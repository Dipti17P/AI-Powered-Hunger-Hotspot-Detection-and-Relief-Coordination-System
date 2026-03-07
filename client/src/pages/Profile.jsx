import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

function Profile() {
  const navigate = useNavigate();
  const stored = localStorage.getItem("user");
  const user = stored && stored !== "undefined" ? JSON.parse(stored) : null;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await API.get("/reports/my-reports");
        setReports(data);
      } catch {
        // silent — regular users may not have access
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
    window.location.reload();
  };

  const roleConfig = {
    admin: { label: "Administrator", color: "bg-purple-100 text-purple-700", icon: "🛡️" },
    ngo: { label: "NGO Partner", color: "bg-teal-100 text-teal-700", icon: "🤝" },
    user: { label: "Citizen Reporter", color: "bg-green-100 text-green-700", icon: "👤" },
  };

  const role = roleConfig[user?.role] ?? roleConfig.user;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const quickLinks = [
    ...(user?.role === "admin"
      ? [{ label: "Admin Dashboard", to: "/admin-dashboard", icon: "🛡️", color: "bg-purple-50 border-purple-200 hover:border-purple-400" }]
      : []),
    ...(user?.role === "ngo" || user?.role === "admin"
      ? [{ label: "NGO Dashboard", to: "/ngo-dashboard", icon: "🤝", color: "bg-teal-50 border-teal-200 hover:border-teal-400" }]
      : []),
    { label: "Report a Hotspot", to: "/report", icon: "📍", color: "bg-green-50 border-green-200 hover:border-green-400" },
    { label: "View Map", to: "/map", icon: "🗺️", color: "bg-blue-50 border-blue-200 hover:border-blue-400" },
    { label: "My Dashboard", to: "/dashboard", icon: "📊", color: "bg-orange-50 border-orange-200 hover:border-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">

          {/* Banner */}
          <div className="h-28 bg-linear-to-r from-green-600 to-emerald-500" />

          {/* Avatar + Info */}
          <div className="px-8 pb-8">
            <div className="flex items-end justify-between -mt-12 mb-6 flex-wrap gap-4">
              <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-green-600">
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 hover:border-red-300 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>

            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{user?.name ?? "Unknown"}</h1>
                <p className="text-gray-500 mt-0.5">{user?.email ?? "—"}</p>
                <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-sm font-semibold ${role.color}`}>
                  {role.icon} {role.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Stats */}
          <div className="md:col-span-1 space-y-4">

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-800">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-800 truncate max-w-35">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-800 capitalize">{user?.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reports</span>
                  <span className="font-medium text-gray-800">{loading ? "..." : reports.length}</span>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            {!loading && reports.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Activity
                </h2>
                <div className="space-y-2.5 text-sm">
                  {[
                    { label: "Total Submitted", value: reports.length, color: "text-gray-800" },
                    { label: "Approved", value: reports.filter((r) => r.status === "approved").length, color: "text-green-600" },
                    { label: "Pending", value: reports.filter((r) => r.status === "pending").length, color: "text-amber-600" },
                    { label: "Rejected", value: reports.filter((r) => r.status === "rejected").length, color: "text-red-500" },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between items-center">
                      <span className="text-gray-500">{s.label}</span>
                      <span className={`font-bold ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-700 mb-4">Quick Navigation</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition text-sm font-medium text-gray-700 ${link.color}`}
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span className="leading-tight">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* My Reports */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-700">My Reports</h2>
                <Link to="/report" className="text-sm text-green-600 font-medium hover:underline">
                  + New Report
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-14">
                  <svg className="w-7 h-7 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-14 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No reports submitted yet</p>
                  <Link to="/report" className="text-green-600 text-sm font-medium hover:underline mt-1 inline-block">
                    Submit your first report
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {reports.slice(0, 6).map((report) => (
                    <div key={report._id} className="px-6 py-4 flex items-start justify-between gap-3 hover:bg-gray-50 transition">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate text-sm">
                          {report.title || "Untitled Report"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {report.locationName || report.description}
                        </p>
                      </div>
                      <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[report.status] || "bg-gray-100 text-gray-600"}`}>
                        {report.status}
                      </span>
                    </div>
                  ))}
                  {reports.length > 6 && (
                    <div className="px-6 py-4 text-sm text-gray-400 text-center">
                      + {reports.length - 6} more reports
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
