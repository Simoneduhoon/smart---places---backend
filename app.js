const express = require("express");
const cors = require("cors");

const placesRoutes = require("./routes/placesRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/places", placesRoutes);

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("Smart Places Backend is running 🚀");
});

module.exports = app;
