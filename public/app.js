/* =========================
   GLOBAL EQUIPMENT DATA
========================= */

let equipmentData = [];

/* =========================
   LOAD EQUIPMENT
========================= */

async function loadEquipment() {
  try {
    const response = await fetch("/api/equipment");

    if (!response.ok) {
      throw new Error("Failed to load equipment");
    }

    equipmentData = await response.json();

    displayEquipment(equipmentData);
    updateStats(equipmentData);
    populateBorrowSelect(equipmentData);
    populateReturnSelect(equipmentData);
  } catch (error) {
    console.error("Error loading equipment:", error);
  }
}

/* =========================
   DISPLAY EQUIPMENT
========================= */

function displayEquipment(equipment) {
  const grid = document.querySelector(".equipment-grid");

  grid.innerHTML = "";

  if (equipment.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        No equipment found.
      </div>
    `;
    return;
  }

  equipment.forEach((item) => {
    const card = document.createElement("div");

    card.className = "equipment-card";

    const statusClass =
      item.availableQuantity > 0
        ? "available"
        : "borrowed";

    const statusText =
      item.availableQuantity > 0
        ? "Available"
        : "Fully Borrowed";

    card.innerHTML = `
      <div class="equipment-image">
        ${item.icon}
      </div>

      <div class="equipment-content">

        <span class="category">
          ${item.category}
        </span>

        <h3>
          ${item.name}
        </h3>

        <p>
          ${item.description}
        </p>

        <div class="quantity-box">

          <div>
            <small>Total Units</small>
            <strong>
              ${item.totalQuantity}
            </strong>
          </div>

          <div>
            <small>Available</small>
            <strong>
              ${item.availableQuantity}
            </strong>
          </div>

          <div>
            <small>Borrowed</small>
            <strong>
              ${item.totalQuantity - item.availableQuantity}
            </strong>
          </div>

        </div>

        <div class="equipment-footer">

          <span class="${statusClass}">
            ● ${statusText}
          </span>

          <span class="quantity-text">
            ${item.availableQuantity}/${item.totalQuantity}
            available
          </span>

        </div>

      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================
   UPDATE DASHBOARD STATS
========================= */

function updateStats(equipment) {
  const total = equipment.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );

  const available = equipment.reduce(
    (sum, item) => sum + item.availableQuantity,
    0
  );

  const borrowed = total - available;

  document.getElementById("totalEquipment").textContent =
    total;

  document.getElementById("availableEquipment").textContent =
    available;

  document.getElementById("borrowedEquipment").textContent =
    borrowed;
}

/* =========================
   BORROW SELECT
========================= */

function populateBorrowSelect(equipment) {
  const select = document.getElementById("equipmentSelect");

  select.innerHTML = `
    <option value="">
      Select equipment
    </option>
  `;

  equipment
    .filter((item) => item.availableQuantity > 0)
    .forEach((item) => {
      const option = document.createElement("option");

      option.value = item.id;

      option.textContent =
        `${item.name} — ${item.availableQuantity} available`;

      select.appendChild(option);
    });
}

/* =========================
   RETURN SELECT
========================= */

function populateReturnSelect(equipment) {
  const select = document.getElementById(
    "returnEquipmentSelect"
  );

  select.innerHTML = `
    <option value="">
      Select equipment
    </option>
  `;

  equipment
    .filter((item) => item.borrowers.length > 0)
    .forEach((item) => {
      const option = document.createElement("option");

      option.value = item.id;

      option.textContent =
        `${item.name} — ${item.borrowers.length} borrowed`;

      select.appendChild(option);
    });
}

/* =========================
   BORROW FORM
========================= */

document
  .getElementById("borrowForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document
      .getElementById("borrowerName")
      .value
      .trim();

    const equipmentId = document
      .getElementById("equipmentSelect")
      .value;

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    if (!equipmentId) {
      alert("Please select equipment.");
      return;
    }

    try {
      const response = await fetch(
        `/api/equipment/${equipmentId}/borrow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            borrowerName: name
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert(
        `Success! ${result.equipment.name} has been borrowed by ${name}.`
      );

      document
        .getElementById("borrowForm")
        .reset();

      await loadEquipment();
    } catch (error) {
      console.error("Borrow error:", error);

      alert("Unable to borrow equipment.");
    }
  });

/* =========================
   RETURN FORM
========================= */

document
  .getElementById("returnForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document
      .getElementById("returnBorrowerName")
      .value
      .trim();

    const equipmentId = document
      .getElementById("returnEquipmentSelect")
      .value;

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    if (!equipmentId) {
      alert("Please select equipment.");
      return;
    }

    try {
      const response = await fetch(
        `/api/equipment/${equipmentId}/return`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            borrowerName: name
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      alert(
        `Success! ${result.equipment.name} has been returned by ${name}.`
      );

      document
        .getElementById("returnForm")
        .reset();

      await loadEquipment();
    } catch (error) {
      console.error("Return error:", error);

      alert("Unable to return equipment.");
    }
  });

/* =========================
   SEARCH EQUIPMENT
========================= */

document
  .getElementById("search")
  .addEventListener("input", function () {
    const searchText = this.value
      .toLowerCase()
      .trim();

    const filtered = equipmentData.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(searchText) ||
        item.category
          .toLowerCase()
          .includes(searchText)
    );

    displayEquipment(filtered);
  });

/* =========================
   LOAD DEPLOYED COMMIT ID
========================= */

async function loadCommitId() {
  try {
    const response = await fetch("/api/version");

    if (!response.ok) {
      throw new Error("Failed to load commit ID");
    }

    const data = await response.json();

    document.getElementById("commitId").textContent =
      data.commit;
  } catch (error) {
    console.error("Version error:", error);
  }
}

/* =========================
   INITIALIZE APPLICATION
========================= */

loadEquipment();
loadCommitId();