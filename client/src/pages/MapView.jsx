import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import API from "../api/api";
import "../utils/fixLeafletIcon";

// Heatmap layer — uses useMap() to get the raw Leaflet map instance
function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const heat = L.heatLayer(points, { radius: 30, blur: 20, maxZoom: 12,
      gradient: { 0.2: "#22c55e", 0.5: "#facc15", 1.0: "#ef4444" } }).addTo(map);
    return () => map.removeLayer(heat);
  }, [map, points]);
  return null;
}

const clusterIcon = (risk) => {
  const bg = risk === "HIGH" ? "#ef4444" : risk === "MEDIUM" ? "#f97316" : "#22c55e";
  return L.divIcon({
    className: "",
    html: `<div style="background:${bg};color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:3px solid white;box-shadow:0 0 8px rgba(0,0,0,0.3);">🔥</div>`,
    iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -20],
  });
};

const ngoIcon = L.divIcon({
  className: "",
  html: `<div style="width:20px;height:20px;border-radius:5px;background:#3b82f6;border:2px solid white;box-shadow:0 0 6px rgba(59,130,246,0.6);display:flex;align-items:center;justify-content:center;font-size:12px;">🤝</div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

const severityIcon = (severity) => {
  const color =
    severity === "high" ? "#ef4444" :
    severity === "medium" ? "#f97316" :
    "#22c55e";
  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
};

function MapView() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ngoMarkers, setNgoMarkers] = useState([]);
  const [reportNGOs, setReportNGOs] = useState({});
  const [viewMode, setViewMode] = useState("markers"); // "markers" | "heatmap"
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [{ data: rpts }, { data: cls }] = await Promise.all([
          API.get("/reports/verified"),
          API.get("/reports/clusters"),
        ]);
        setReports(rpts);
        setClusters(cls);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    if (reports.length === 0) return;
    const fetchNGOs = async () => {
      const results = [];
      // Stagger requests by 600 ms each to avoid Overpass 429 rate limiting
      // The server-side cache means duplicate locations are free after the first hit
      for (const report of reports) {
        const lat = report.coordinates?.coordinates?.[1] ?? report.latitude;
        const lng = report.coordinates?.coordinates?.[0] ?? report.longitude;
        if (!lat || !lng) {
          results.push({ id: report._id, ngos: [], lat, lng });
          continue;
        }
        try {
          const { data } = await API.get(`/reports/nearby-ngos?lat=${lat}&lng=${lng}`);
          results.push({ id: report._id, ngos: data, lat, lng });
        } catch {
          results.push({ id: report._id, ngos: [], lat, lng });
        }
        await new Promise((r) => setTimeout(r, 600));
      }
      // Per-report NGO names for popup display
      const ngoMap = {};
      results.forEach(({ id, ngos }) => { ngoMap[id] = ngos.map((n) => n.name); });
      setReportNGOs(ngoMap);
      // Only show real Overpass NGOs as map markers (fallbacks sit exactly on report coords)
      const seen = new Set();
      const markers = [];
      results.forEach(({ ngos, lat, lng }) => {
        ngos.forEach((ngo) => {
          const isFallback = ngo.latitude === lat && ngo.longitude === lng;
          const key = `${ngo.name}|${ngo.latitude}|${ngo.longitude}`;
          if (!isFallback && !seen.has(key)) {
            seen.add(key);
            markers.push(ngo);
          }
        });
      });
      setNgoMarkers(markers);
    };
    fetchNGOs();
  }, [reports]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hunger Hotspot Map</h1>
            <p className="text-gray-500 text-sm mt-0.5">Live map of verified hunger hotspots across India</p>
          </div>
          <div className="flex gap-6 mb-4">

<div className="flex items-center gap-2">
<div className="w-4 h-4 bg-red-500"></div>
<span>High Risk</span>
</div>

<div className="flex items-center gap-2">
<div className="w-4 h-4 bg-orange-400"></div>
<span>Medium Risk</span>
</div>

<div className="flex items-center gap-2">
<div className="w-4 h-4 bg-green-500"></div>
<span>Low Risk</span>
</div>

<div className="flex items-center gap-2">
<div className="w-4 h-4 bg-blue-500 rounded"></div>
<span>NGO</span>
</div>

</div>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            {/* View mode toggle */}
            <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold">
              {["markers", "heatmap"].map((mode) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 capitalize transition ${viewMode === mode ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {mode === "markers" ? "📍 Markers" : "🔥 Heatmap"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Verified Hotspot</span>
            </div>
            <div className="bg-green-50 border border-green-200 text-green-700 font-semibold px-3 py-1.5 rounded-lg">
              {loading ? "..." : `${reports.length} Active`}
            </div>
            {clusters.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 font-semibold px-3 py-1.5 rounded-lg">
                🔥 {clusters.length} Cluster{clusters.length > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="h-150 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-10 h-10 animate-spin text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-gray-500 text-sm">Loading map data...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[22.9734, 78.6569]}
              zoom={5}
              minZoom={4}
              maxZoom={14}
              maxBounds={[
                [6.5, 68.0],
                [37.5, 97.5],
              ]}
              maxBoundsViscosity={1.0}
              style={{ height: "600px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Heatmap layer */}
              {viewMode === "heatmap" && (
                <HeatmapLayer points={reports
                  .filter((r) => r.coordinates?.coordinates?.length === 2)
                  .map((r) => [r.coordinates.coordinates[1], r.coordinates.coordinates[0],
                    r.aiSeverity === "high" ? 1.0 : r.aiSeverity === "medium" ? 0.6 : 0.3])}
                />
              )}

              {/* Marker layer */}
              {viewMode === "markers" && reports.map((report) => {
                const lat = report.coordinates?.coordinates?.[1] ?? report.latitude;
                const lng = report.coordinates?.coordinates?.[0] ?? report.longitude;
                if (!lat || !lng) return null;
                return (
                  <Marker key={report._id} position={[lat, lng]} icon={severityIcon(report.aiSeverity || "low")}>
                    <Popup>
                      <div style={{ minWidth: "180px" }}>
                        <p style={{ fontWeight: 700, marginBottom: 4 }}>
                          {report.title || "Hunger Hotspot"}
                        </p>
                        <p style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>
                          {report.description}
                        </p>
                        {report.locationName && (
                          <p style={{ fontSize: 11, color: "#888" }}>📍 {report.locationName}</p>
                        )}
                        <p style={{ fontSize: 12, fontWeight: 600, marginTop: 6, marginBottom: 2 }}>
                          🤖 AI Severity: <span style={{
                            textTransform: "capitalize",
                            color:
                              report.aiSeverity === "high" ? "#b91c1c" :
                              report.aiSeverity === "medium" ? "#b45309" : "#1d4ed8",
                          }}>{report.aiSeverity || "low"}</span>
                        </p>
                        <span style={{
                          display: "inline-block",
                          marginTop: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background:
                            report.aiSeverity === "high" ? "#fee2e2" :
                            report.aiSeverity === "medium" ? "#fef3c7" : "#dbeafe",
                          color:
                            report.aiSeverity === "high" ? "#b91c1c" :
                            report.aiSeverity === "medium" ? "#b45309" : "#1d4ed8",
                          textTransform: "capitalize",
                        }}>
                          {report.aiSeverity || "low"} severity
                        </span>
                        {report.aiAnalysis && (
                          <p style={{ fontSize: 11, color: "#666", marginTop: 4, fontStyle: "italic" }}>🤖 {report.aiAnalysis}</p>
                        )}
                        {reportNGOs[report._id]?.length > 0 && (
                          <div style={{ marginTop: 6, borderTop: "1px solid #f0f0f0", paddingTop: 6 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", marginBottom: 3 }}>Nearby NGOs:</p>
                            {reportNGOs[report._id].map((name, i) => (
                              <p key={i} style={{ fontSize: 11, color: "#374151", marginBottom: 1 }}>🤝 {name}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* NGO markers (markers mode only) */}
              {viewMode === "markers" && ngoMarkers.map((ngo, i) => (
                <Marker key={`ngo-${i}`} position={[ngo.latitude, ngo.longitude]} icon={ngoIcon}>
                  <Popup>
                    <div style={{ minWidth: "160px" }}>
                      <p style={{ fontWeight: 700, marginBottom: 4 }}>🤝 {ngo.name}</p>
                      <p style={{ fontSize: 11, color: "#3b82f6", textTransform: "capitalize" }}>NGO · {ngo.type}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* DBSCAN cluster markers (always visible) */}
              {clusters.map((c) => (
                <Marker key={`cluster-${c.id}`} position={c.center} icon={clusterIcon(c.risk)}>
                  <Popup>
                    <div style={{ minWidth: "160px" }}>
                      <p style={{ fontWeight: 700, marginBottom: 4 }}>🔥 AI Hotspot Cluster #{c.id}</p>
                      <p style={{ fontSize: 12, marginBottom: 2 }}>📍 {c.area}</p>
                      <p style={{ fontSize: 12, marginBottom: 2 }}>📊 {c.count} reports</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: c.risk === "HIGH" ? "#b91c1c" : c.risk === "MEDIUM" ? "#b45309" : "#15803d" }}>
                        Risk Level: {c.risk}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Empty state */}
        {!loading && reports.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No verified hotspots to display yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapView;