import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function NGODashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const stored = localStorage.getItem("user");
  const user = stored && stored !== "undefined" ? JSON.parse(stored) : null;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await API.get("/reports/verified");
        setReports(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getSeverity = (report) => {
    const s = (report.aiSeverity || "").toLowerCase();
    if (s === "high" || s === "medium") return s;
    return "low";
  };

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => getSeverity(r) === filter);

  const severityConfig = {
    high: {
      label: "High",
      badge: "bg-red-100 text-red-700 border border-red-200",
      card: "border-l-red-500",
      dot: "bg-red-500",
    },
    medium: {
      label: "Medium",
      badge: "bg-amber-100 text-amber-700 border border-amber-200",
      card: "border-l-amber-500",
      dot: "bg-amber-500",
    },
    low: {
      label: "Low",
      badge: "bg-blue-100 text-blue-700 border border-blue-200",
      card: "border-l-blue-400",
      dot: "bg-blue-400",
    },
  };

  const counts = {
    all: reports.length,
    high: reports.filter((r) => getSeverity(r) === "high").length,
    medium: reports.filter((r) => getSeverity(r) === "medium").length,
    low: reports.filter((r) => getSeverity(r) === "low").length,
  };

  const filterButtons = [
    { key: "all", active: "bg-green-600 text-white", inactive: "bg-white text-gray-600 border border-gray-200 hover:border-green-400" },
    { key: "high", active: "bg-red-500 text-white", inactive: "bg-white text-gray-600 border border-gray-200 hover:border-red-400" },
    { key: "medium", active: "bg-amber-500 text-white", inactive: "bg-white text-gray-600 border border-gray-200 hover:border-amber-400" },
    { key: "low", active: "bg-blue-500 text-white", inactive: "bg-white text-gray-600 border border-gray-200 hover:border-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="bg-linear-to-r from-teal-600 to-green-500 rounded-3xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-teal-100 text-sm uppercase tracking-wide">NGO Portal</p>
                <h1 className="text-3xl font-bold">Response Dashboard</h1>
                {user?.name && (
                  <p className="text-teal-100 text-sm mt-0.5">{user.name}</p>
                )}
              </div>
            </div>
            <Link
              to="/map"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View on Map
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Hotspots", value: counts.all, color: "from-green-500 to-emerald-400", icon: "📍" },
            { label: "High Severity", value: counts.high, color: "from-red-500 to-rose-400", icon: "🔴" },
            { label: "Medium Severity", value: counts.medium, color: "from-amber-500 to-yellow-400", icon: "🟡" },
            { label: "Low Severity", value: counts.low, color: "from-blue-500 to-cyan-400", icon: "🔵" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 bg-linear-to-br ${s.color} rounded-xl flex items-center justify-center text-lg mb-3 shadow-sm`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100">

          {/* Filter Bar */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-gray-800">Verified Hotspots</h2>
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 capitalize ${
                    filter === f.key ? f.active : f.inactive
                  }`}
                >
                  {f.key === "all" ? "All Reports" : f.key}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${filter === f.key ? "bg-white/25" : "bg-gray-100"}`}>
                    {counts[f.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <svg className="w-10 h-10 animate-spin text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-gray-400 text-sm">Loading hotspots...</p>
              </div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <svg className="w-14 h-14 mx-auto mb-3 opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-medium">No hotspots found</p>
              <p className="text-sm mt-1">Try changing the severity filter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredReports.map((report) => {
                const sev = getSeverity(report);
                const cfg = severityConfig[sev];
                const lat = report.coordinates?.coordinates?.[1] ?? report.latitude;
                const lng = report.coordinates?.coordinates?.[0] ?? report.longitude;

                return (
                  <div
                    key={report._id}
                    className={`px-6 py-5 flex items-start gap-4 hover:bg-gray-50 transition border-l-4 ${cfg.card}`}
                  >
                    <div className="mt-1.5 shrink-0">
                      <div className={`w-3 h-3 rounded-full ${cfg.dot}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {report.title || "Hunger Hotspot"}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                            {report.description}
                          </p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${cfg.badge}`}>
                          {cfg.label} Severity
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        {report.locationName && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {report.locationName}
                          </span>
                        )}
                        {lat && lng && (
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg">
                            {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
                          </span>
                        )}
                        {report.peopleAffected > 0 && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            ~{report.peopleAffected} affected
                          </span>
                        )}
                        {report.aiAnalysis && (
                          <span className="flex items-center gap-1 text-xs text-gray-400 italic">
                            🤖 {report.aiAnalysis}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NGODashboard;
