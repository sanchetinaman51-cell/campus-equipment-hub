const test = require("node:test");
const assert = require("node:assert");
const request = require("supertest");

const app = require("../app");

test("GET /health returns status ok", async () => {
  const response = await request(app).get("/health");

  assert.strictEqual(response.statusCode, 200);
  assert.deepStrictEqual(response.body, {
    status: "ok"
  });
});

test("GET /api/equipment returns 20 equipment items", async () => {
  const response = await request(app).get("/api/equipment");

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(Array.isArray(response.body), true);
  assert.strictEqual(response.body.length, 20);
});

test("Equipment contains quantity and borrower fields", async () => {
  const response = await request(app).get("/api/equipment");

  const firstItem = response.body[0];

  assert.ok(firstItem.id);
  assert.ok(firstItem.name);
  assert.ok(firstItem.category);
  assert.ok(firstItem.status);
  assert.ok(firstItem.totalQuantity);
  assert.ok(firstItem.availableQuantity);
  assert.ok(Array.isArray(firstItem.borrowers));
});

test("Equipment can be borrowed and quantity decreases", async () => {
  const beforeResponse = await request(app).get("/api/equipment");

  const itemBefore = beforeResponse.body.find(
    (item) => item.id === 1
  );

  const initialAvailable = itemBefore.availableQuantity;

  const response = await request(app)
    .post("/api/equipment/1/borrow")
    .send({
      borrowerName: "Test Student"
    });

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(
    response.body.equipment.availableQuantity,
    initialAvailable - 1
  );
  assert.ok(
    response.body.equipment.borrowers.includes("Test Student")
  );

  // Clean up the test
  await request(app)
    .post("/api/equipment/1/return")
    .send({
      borrowerName: "Test Student"
    });
});

test("Equipment can be returned and quantity increases", async () => {
  const beforeResponse = await request(app).get("/api/equipment");

  const itemBefore = beforeResponse.body.find(
    (item) => item.id === 2
  );

  const initialAvailable = itemBefore.availableQuantity;

  await request(app)
    .post("/api/equipment/2/borrow")
    .send({
      borrowerName: "Return Test Student"
    });

  const response = await request(app)
    .post("/api/equipment/2/return")
    .send({
      borrowerName: "Return Test Student"
    });

  assert.strictEqual(response.statusCode, 200);
  assert.strictEqual(
    response.body.equipment.availableQuantity,
    initialAvailable
  );
  assert.ok(
    !response.body.equipment.borrowers.includes(
      "Return Test Student"
    )
  );
});

test("Cannot borrow when all units are unavailable", async () => {
  // Equipment ID 16 has 2 units.
  await request(app)
    .post("/api/equipment/16/borrow")
    .send({
      borrowerName: "Student One"
    });

  await request(app)
    .post("/api/equipment/16/borrow")
    .send({
      borrowerName: "Student Two"
    });

  const response = await request(app)
    .post("/api/equipment/16/borrow")
    .send({
      borrowerName: "Student Three"
    });

  assert.strictEqual(response.statusCode, 400);
  assert.strictEqual(
    response.body.message,
    "No units of this equipment are currently available"
  );

  // Clean up both borrowed units.
  await request(app)
    .post("/api/equipment/16/return")
    .send({
      borrowerName: "Student One"
    });

  await request(app)
    .post("/api/equipment/16/return")
    .send({
      borrowerName: "Student Two"
    });
});

test("Cannot return equipment for the wrong borrower", async () => {
  await request(app)
    .post("/api/equipment/3/borrow")
    .send({
      borrowerName: "Correct Student"
    });

  const response = await request(app)
    .post("/api/equipment/3/return")
    .send({
      borrowerName: "Wrong Student"
    });

  assert.strictEqual(response.statusCode, 400);
  assert.strictEqual(
    response.body.message,
    "This borrower does not have this equipment"
  );

  // Clean up.
  await request(app)
    .post("/api/equipment/3/return")
    .send({
      borrowerName: "Correct Student"
    });
});