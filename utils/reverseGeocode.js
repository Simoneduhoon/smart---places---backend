const axios = require("axios");

exports.reverseGeocode = async (lat, lng) => {
  const url = "https://nominatim.openstreetmap.org/reverse";

  const response = await axios.get(url, {
    params: {
      lat,
      lon: lng,
      format: "json"
    },
    headers: {
      "User-Agent": "smart-places-app" // REQUIRED by OSM
    }
  });

  const address = response.data.address || {};

  return {
    area:
      address.neighbourhood ||
      address.suburb ||
      address.city_district ||
      "Unknown area",
    city: address.city || address.town || address.village || "Unknown city",
    state: address.state || "Unknown state",
    country: address.country || "Unknown country"
  };
};
