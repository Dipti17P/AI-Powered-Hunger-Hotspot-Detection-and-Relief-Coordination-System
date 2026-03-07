const axios = require("axios");

async function findNearbyNGO(lat, lng) {

  const query = `
  [out:json];
  (
    node["amenity"="charity"](around:5000,${lat},${lng});
    node["amenity"="social_facility"](around:5000,${lat},${lng});
  );
  out;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await axios.post(url, query, {
      headers: { "Content-Type": "text/plain" }
    });

    const ngos = response.data.elements.map(place => ({
      name: place.tags?.name || "Unknown NGO",
      latitude: place.lat,
      longitude: place.lon
    }));

    return ngos.slice(0, 3); // return top 3 NGOs

  } catch (error) {
    console.log("Overpass API error:", error.message);
    return [];
  }
}

module.exports = findNearbyNGO;