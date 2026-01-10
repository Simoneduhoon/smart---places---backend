const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Unnamed place"
  },
  category: String,

  lat: Number,
  lng: Number,

  distance: Number,     // distance from user (km)
  price: Number,        // 1 (cheap) → 5 (expensive)
  rating: Number,       // 1 → 5 stars

  mood: String,         // chill, food, travel
  userType: String,     // student, professional, traveller

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Place", placeSchema);
