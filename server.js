// =========================
// Load Environment Variables
// =========================
require("dotenv").config();

// =========================
// Import Packages
// =========================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// =========================
// Initialize Express App
// =========================
const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// MongoDB Connection
// =========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection failed:", error));

// =========================
// Cement Request Schema
// =========================
const cementRequestSchema = new mongoose.Schema({
  buyerName: String,
  buyerType: String,
  cementBrand: String,
  buyerLocation: String,
  cementBags: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// =========================
// Truck Schema
// =========================
const truckSchema = new mongoose.Schema({
  truckName: String,
  truckPlate: String,
  truckCapacity: String,
  truckLocation: String,
  truckDestination: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// =========================
// Models
// =========================
const CementRequest = mongoose.model("CementRequest", cementRequestSchema);
const Truck = mongoose.model("Truck", truckSchema);

// =========================
// Test Route
// =========================
app.get("/", (req, res) => {
  res.send("CargoConnectAI Backend is running successfully.");
});

// =========================
// Cement Request Routes
// =========================
app.post("/api/cement-requests", async (req, res) => {
  try {
    const newRequest = new CementRequest(req.body);
    await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Cement request saved successfully",
      data: newRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save cement request",
      error: error.message
    });
  }
});

app.get("/api/cement-requests", async (req, res) => {
  try {
    const requests = await CementRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// Truck Routes
// =========================
app.post("/api/trucks", async (req, res) => {
  try {
    const newTruck = new Truck(req.body);
    await newTruck.save();

    res.status(201).json({
      success: true,
      message: "Truck registered successfully",
      data: newTruck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register truck",
      error: error.message
    });
  }
});

app.get("/api/trucks", async (req, res) => {
  try {
    const trucks = await Truck.find().sort({ createdAt: -1 });
    res.json(trucks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
