const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

/* =========================
   EQUIPMENT DATA
========================= */

const equipment = [
  {
    id: 1,
    name: "Arduino Uno Kit",
    category: "Electronics",
    icon: "🔌",
    description: "Microcontroller development kit for electronics projects.",
    totalQuantity: 5,
    availableQuantity: 5,
    status: "Available",
    borrowers: []
  },
  {
    id: 2,
    name: "Raspberry Pi 5 Kit",
    category: "IoT",
    icon: "🥧",
    description: "Single-board computer for IoT and programming projects.",
    totalQuantity: 4,
    availableQuantity: 4,
    status: "Available",
    borrowers: []
  },
  {
    id: 3,
    name: "ESP32 Development Board",
    category: "IoT",
    icon: "📡",
    description: "Wi-Fi and Bluetooth development board.",
    totalQuantity: 8,
    availableQuantity: 8,
    status: "Available",
    borrowers: []
  },
  {
    id: 4,
    name: "Digital Multimeter",
    category: "Electronics",
    icon: "🔢",
    description: "Instrument for measuring voltage and current.",
    totalQuantity: 6,
    availableQuantity: 6,
    status: "Available",
    borrowers: []
  },
  {
    id: 5,
    name: "Digital Oscilloscope",
    category: "Electronics",
    icon: "📈",
    description: "Equipment for observing electrical signals.",
    totalQuantity: 3,
    availableQuantity: 3,
    status: "Available",
    borrowers: []
  },
  {
    id: 6,
    name: "Function Generator",
    category: "Electronics",
    icon: "〰️",
    description: "Signal generator for electronics experiments.",
    totalQuantity: 3,
    availableQuantity: 3,
    status: "Available",
    borrowers: []
  },
  {
    id: 7,
    name: "Dell Laptop",
    category: "Computing",
    icon: "💻",
    description: "Laptop for programming and student projects.",
    totalQuantity: 10,
    availableQuantity: 10,
    status: "Available",
    borrowers: []
  },
  {
    id: 8,
    name: "Network Router",
    category: "Networking",
    icon: "📶",
    description: "Router for networking laboratory experiments.",
    totalQuantity: 5,
    availableQuantity: 5,
    status: "Available",
    borrowers: []
  },
  {
    id: 9,
    name: "Network Switch",
    category: "Networking",
    icon: "🔀",
    description: "Network switch for practical networking exercises.",
    totalQuantity: 5,
    availableQuantity: 5,
    status: "Available",
    borrowers: []
  },
  {
    id: 10,
    name: "VR Headset",
    category: "Technology",
    icon: "🥽",
    description: "Virtual reality equipment for technology projects.",
    totalQuantity: 4,
    availableQuantity: 4,
    status: "Available",
    borrowers: []
  },
  {
    id: 11,
    name: "Robotics Starter Kit",
    category: "Robotics",
    icon: "🤖",
    description: "Components for building educational robots.",
    totalQuantity: 6,
    availableQuantity: 6,
    status: "Available",
    borrowers: []
  },
  {
    id: 12,
    name: "Servo Motor Kit",
    category: "Robotics",
    icon: "⚙️",
    description: "Servo motors for robotics experiments.",
    totalQuantity: 8,
    availableQuantity: 8,
    status: "Available",
    borrowers: []
  },
  {
    id: 13,
    name: "Ultrasonic Sensor Kit",
    category: "Robotics",
    icon: "📡",
    description: "Distance sensors for robotics projects.",
    totalQuantity: 8,
    availableQuantity: 8,
    status: "Available",
    borrowers: []
  },
  {
    id: 14,
    name: "Motor Trainer Kit",
    category: "Electrical",
    icon: "⚙️",
    description: "Training equipment for electric motor experiments.",
    totalQuantity: 4,
    availableQuantity: 4,
    status: "Available",
    borrowers: []
  },
  {
    id: 15,
    name: "Vernier Caliper",
    category: "Mechanical",
    icon: "📏",
    description: "Precision measuring instrument for engineering labs.",
    totalQuantity: 10,
    availableQuantity: 10,
    status: "Available",
    borrowers: []
  },
  {
    id: 16,
    name: "3D Printer",
    category: "Manufacturing",
    icon: "🖨️",
    description: "3D printer for prototyping and student projects.",
    totalQuantity: 2,
    availableQuantity: 2,
    status: "Available",
    borrowers: []
  },
  {
    id: 17,
    name: "Theodolite",
    category: "Civil",
    icon: "🔭",
    description: "Surveying instrument for measuring angles.",
    totalQuantity: 4,
    availableQuantity: 4,
    status: "Available",
    borrowers: []
  },
  {
    id: 18,
    name: "Digital Microscope",
    category: "Science",
    icon: "🔬",
    description: "Digital microscope for laboratory observations.",
    totalQuantity: 3,
    availableQuantity: 3,
    status: "Available",
    borrowers: []
  },
  {
    id: 19,
    name: "Canon DSLR Camera",
    category: "Media",
    icon: "📷",
    description: "Camera for photography and media projects.",
    totalQuantity: 4,
    availableQuantity: 4,
    status: "Available",
    borrowers: []
  },
  {
    id: 20,
    name: "Epson Projector",
    category: "Presentation",
    icon: "📽️",
    description: "HD projector for classroom presentations.",
    totalQuantity: 5,
    availableQuantity: 5,
    status: "Available",
    borrowers: []
  }
];

/* =========================
   GET ALL EQUIPMENT
========================= */

app.get("/api/equipment", (req, res) => {
  res.json(equipment);
});

/* =========================
   BORROW EQUIPMENT
========================= */

app.post("/api/equipment/:id/borrow", (req, res) => {
  const id = Number(req.params.id);
  const borrowerName = req.body.borrowerName?.trim();

  if (!borrowerName) {
    return res.status(400).json({
      message: "Borrower name is required"
    });
  }

  const item = equipment.find(
    (equipmentItem) => equipmentItem.id === id
  );

  if (!item) {
    return res.status(404).json({
      message: "Equipment not found"
    });
  }

  if (item.availableQuantity <= 0) {
    return res.status(400).json({
      message: "No units of this equipment are currently available"
    });
  }

  item.availableQuantity -= 1;

  item.borrowers.push(borrowerName);

  if (item.availableQuantity === 0) {
    item.status = "Borrowed";
  } else {
    item.status = "Available";
  }

  res.json({
    message: "Equipment borrowed successfully",
    equipment: item
  });
});

/* =========================
   RETURN EQUIPMENT
========================= */

app.post("/api/equipment/:id/return", (req, res) => {
  const id = Number(req.params.id);
  const borrowerName = req.body.borrowerName?.trim();

  const item = equipment.find(
    (equipmentItem) => equipmentItem.id === id
  );

  if (!item) {
    return res.status(404).json({
      message: "Equipment not found"
    });
  }

  if (item.availableQuantity >= item.totalQuantity) {
    return res.status(400).json({
      message: "All units of this equipment are already available"
    });
  }

  if (borrowerName) {
    const borrowerIndex = item.borrowers.indexOf(borrowerName);

    if (borrowerIndex === -1) {
      return res.status(400).json({
        message: "This borrower does not have this equipment"
      });
    }

    item.borrowers.splice(borrowerIndex, 1);
  } else {
    item.borrowers.pop();
  }

  item.availableQuantity += 1;

  if (item.availableQuantity > 0) {
    item.status = "Available";
  }

  res.json({
    message: "Equipment returned successfully",
    equipment: item
  });
});

/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

/* =========================
   VERSION / COMMIT ID
========================= */

app.get("/api/version", (req, res) => {
  res.json({
    commit: process.env.RENDER_GIT_COMMIT || "local"
  });
});

/* =========================
   EXPORT APP
========================= */

module.exports = app;