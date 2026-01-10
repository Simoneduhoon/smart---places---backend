const axios = require("axios");

exports.fetchPlacesFromOSM = async (lat, lon, tag) => {
  const query = `
[out:json][timeout:25];
(
  node["${tag.key}"="${tag.value}"](around:5000,${lat},${lon});
  way["${tag.key}"="${tag.value}"](around:5000,${lat},${lon});
);
out center tags 20;
`;

  const response = await axios.post(
    "https://overpass.kumi.systems/api/interpreter",
    query,
    { headers: { "Content-Type": "text/plain" } }
  );

  return response.data.elements;
};
