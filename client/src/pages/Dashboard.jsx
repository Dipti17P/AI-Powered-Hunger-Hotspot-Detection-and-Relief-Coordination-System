import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();
  const stored = localStorage.getItem("user");
  const user = stored && stored !== "undefined" ? JSON.parse(stored) : null;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const { data } = await API.get("/reports/my-reports");
        setReports(data);
      } catch {
        // Not an NGO or no reports — silent
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  const stats = [
    {
      label: "My Reports",
      value: reports.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-green-500 to-emerald-400",
    },
    {
      label: "Approved",
      value: reports.filter((r) => r.status === "approved").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Pending",
      value: reports.filter((r) => r.status === "pending").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-amber-500 to-yellow-400",
    },
  ];

  const quickActions = [
    {
      label: "Submit Report",
      desc: "Report a new hunger hotspot",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      to: "/report",
      bg: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "View Map",
      desc: "See hotspots on the map",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      to: "/map",
      bg: "bg-blue-600 hover:bg-blue-700",
    },
    {
      label: "My Profile",
      desc: "View and edit your profile",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      to: "/profile",
      bg: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Welcome Header */}
        <div className="bg-linear-to-r from-green-600 to-emerald-500 rounded-3xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-green-100 text-sm font-medium uppercase tracking-wide">Dashboard</p>
              <h1 className="text-3xl font-bold mt-1">
                Welcome, {user?.name || "User"}!
              </h1>
              <p className="text-green-100 mt-1 capitalize">
                Role: <span className="font-semibold text-white">{user?.role}</span>
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-linear-to-br ${stat.color} text-white rounded-xl flex items-center justify-center shadow-md`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Quick Actions */}
          <div className="md:col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className={`flex items-center gap-4 ${action.bg} text-white px-5 py-4 rounded-2xl transition shadow-md`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {action.icon}
                  </div>
                  <div>
                    <p className="font-semibold">{action.label}</p>
                    <p className="text-xs opacity-80">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Reports</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <svg className="w-8 h-8 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No reports yet</p>
                  <Link to="/report" className="text-green-600 text-sm font-medium hover:underline mt-1 inline-block">
                    Submit your first report
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report._id} className="px-6 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{report.title || report.description}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{report.locationName || "Location not set"}</p>
                        {report.aiAnalysis && (
                          <p className="text-xs text-gray-400 mt-0.5 italic">🤖 {report.aiAnalysis}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {report.aiSeverity && (
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                            report.aiSeverity === "high" ? "bg-red-100 text-red-700" :
                            report.aiSeverity === "medium" ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {report.aiSeverity}
                          </span>
                        )}
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[report.status] || "bg-gray-100 text-gray-600"}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
