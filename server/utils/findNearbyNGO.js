const axios = require("axios");

// Simple in-memory cache keyed by rounded lat/lng (1 decimal ≈ 11 km grid)
// TTL: 30 minutes so data stays fresh without hammering Overpass
const cache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

function cacheKey(lat, lng) {
  return `${parseFloat(lat).toFixed(1)},${parseFloat(lng).toFixed(1)}`;
}

async function findNearbyNGO(lat, lng, radiusMeters = 10000) {
  const key = cacheKey(lat, lng);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }

  // Single union query is faster for Overpass than multiple separate queries.
  // Kept to the two most reliable NGO tags to reduce server-side scan cost.
  const query = `[out:json][timeout:8];(node["office"="ngo"](around:${radiusMeters},${lat},${lng});node["amenity"="charity"](around:${radiusMeters},${lat},${lng}););out 5;`;

  try {
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" }, timeout: 9000 }
    );

    const results = response.data.elements
      .filter((place) => place.tags?.name)
      .map((place) => ({
        name: place.tags.name,
        latitude: place.lat,
        longitude: place.lon,
        type: place.tags.amenity || place.tags.office || "ngo",
      }));

    const data = results.length > 0 ? results.slice(0, 5) : getFallbackNGOs(lat, lng);
    cache.set(key, { data, ts: Date.now() });
    return data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 429) {
      console.warn("Overpass API rate limited (429) — using fallback NGO list");
    } else if (status === 504 || error.code === "ECONNABORTED") {
      console.warn("Overpass API timed out (504) — using fallback NGO list");
    } else {
      console.error("Overpass API error:", error.message);
    }
    // Do NOT cache fallback so a later request retries Overpass
    return getFallbackNGOs(lat, lng);
  }
}

// Curated list of well-known Indian food relief NGOs shown as fallback
function getFallbackNGOs(lat, lng) {
  return [
    { name: "ISKCON Food Relief Foundation", latitude: lat, longitude: lng, type: "charity" },
    { name: "Akshaya Patra Foundation", latitude: lat, longitude: lng, type: "charity" },
    { name: "Robin Hood Army", latitude: lat, longitude: lng, type: "charity" },
    { name: "Feeding India (Zomato)", latitude: lat, longitude: lng, type: "charity" },
    { name: "No Food Waste", latitude: lat, longitude: lng, type: "charity" },
  ];
}

module.exports = findNearbyNGO;
