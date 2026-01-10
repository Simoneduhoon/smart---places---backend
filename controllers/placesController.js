const osmTags = require("../services/osmTagMapper");
const { fetchPlacesFromOSM } = require("../services/osmService");
const { calculateDistance } = require("../utils/distance");
const { getPriceAndRating } = require("../utils/placeScoring");
const Place = require("../models/place.js");

exports.findPlaces = async (req, res) => {
  try {
    const {
      mood,
      userType = "student",
      lat,
      lng,
      page = 1,
      limit = 5
    } = req.body;

    // =====================
    // VALIDATION
    // =====================
    if (!mood || !lat || !lng) {
      return res.status(400).json({
        error: "mood, lat and lng are required"
      });
    }

    const tag = osmTags[mood];
    if (!tag) {
      return res.status(400).json({
        error: "Invalid mood"
      });
    }

    // =====================
    // PAGINATION
    // =====================
    const skip = (page - 1) * limit;

    // =====================
    // CHECK CACHE (DB)
    // =====================
    const cachedPlaces = await Place.find({
      mood,
      userType
    })
      .sort({ rating: -1, price: 1 }) // best rated + cheapest
      .skip(skip)
      .limit(Number(limit));

    const totalCached = await Place.countDocuments({
      mood,
      userType
    });

    if (cachedPlaces.length > 0) {
      return res.json({
        source: "cache",
        page: Number(page),
        limit: Number(limit),
        total: totalCached,
        count: cachedPlaces.length,
        places: cachedPlaces
      });
    }

    // =====================
    // FETCH FROM OSM
    // =====================
    const osmPlaces = await fetchPlacesFromOSM(lat, lng, tag);

    // =====================
    // FORMAT + SAVE
    // =====================
    const formatted = [];

    for (const p of osmPlaces) {
      const placeLat = p.lat || p.center?.lat;
      const placeLng = p.lon || p.center?.lon;

      if (!placeLat || !placeLng) continue;

      const distance = calculateDistance(lat, lng, placeLat, placeLng);
      const score = getPriceAndRating(tag.value, userType);

      formatted.push({
        name: p.tags?.name || "Unnamed place",
        category: tag.value,
        lat: placeLat,
        lng: placeLng,
        distance: Number(distance.toFixed(2)),
        price: score.price,
        rating: score.rating,
        mood,
        userType
      });
    }

    // =====================
    // SAVE TO DATABASE
    // =====================
    await Place.insertMany(formatted);

    // =====================
    // SORT + PAGINATE RESPONSE
    // =====================
    const sorted = formatted
      .sort((a, b) => b.rating - a.rating || a.price - b.price);

    const paginated = sorted.slice(skip, skip + Number(limit));

    res.json({
      source: "osm",
      page: Number(page),
      limit: Number(limit),
      total: sorted.length,
      count: paginated.length,
      places: paginated
    });

  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({
      error: "Failed to fetch places"
    });
  }
};
