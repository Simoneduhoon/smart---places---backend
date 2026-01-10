const express = require("express");
const router = express.Router();

const { findPlaces } = require("../controllers/placesController");

// POST → Find nearby places (OSM + MongoDB cache)
router.post("/nearby", findPlaces);

module.exports = router;
