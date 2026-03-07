import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      setStats(data);
    } catch {
      // silent
    }
  };

  const fetchReports = async () => {
    try {
      const { data } = await API.get("/admin/reports");
      setReports(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    setVerifyingId(id);
    try {
      await API.patch(`/admin/reports/${id}/verify`);
      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "approved", isVerified: true } : r
        )
      );
      toast.success("Report verified successfully!");
      fetchStats();
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReject = async (id) => {
    setVerifyingId(id);
    try {
      await API.put(`/reports/${id}/status`, { status: "rejected" });
      setReports((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "rejected" } : r
        )
      );
      toast.success("Report rejected.");
      fetchStats();
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setVerifyingId(null);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchReports();
  }, []);

  const filteredReports =
    filter === "all"
      ? reports
      : reports.filter((r) => r.status === filter);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Total Reports",
      value: stats?.totalReports ?? "—",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-purple-500 to-pink-400",
    },
    {
      label: "Verified Reports",
      value: stats?.verifiedReports ?? "—",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-green-500 to-emerald-400",
    },
    {
      label: "Pending Review",
      value: reports.filter((r) => r.status === "pending").length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-amber-500 to-yellow-400",
    },
  ];

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="bg-linear-to-r from-slate-800 to-slate-700 rounded-3xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-300 text-sm uppercase tracking-wide">Admin Panel</p>
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 bg-linear-to-br ${s.color} text-white rounded-xl flex items-center justify-center shadow-sm`}>
                  {s.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-gray-800">All Reports</h2>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                    filter === f
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="w-8 h-8 animate-spin text-green-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No {filter !== "all" ? filter : ""} reports found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredReports.map((report) => (
                <div
                  key={report._id}
                  className="px-6 py-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {report.title || "Untitled Report"}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                          {report.description}
                        </p>
                        {report.locationName && (
                          <p className="text-xs text-gray-400 mt-1">
                            📍 {report.locationName}
                          </p>
                        )}
                        {report.createdBy && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            By: {report.createdBy?.name || "Unknown"}
                          </p>
                        )}
                            {report.aiAnalysis && (
                              <p className="text-xs text-gray-400 mt-0.5 italic">🤖 {report.aiAnalysis}</p>
                            )}
                          </div>
                        </div>
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
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyle[report.status] || "bg-gray-100 text-gray-600"}`}>
                          {report.status}
                        </span>

                        {report.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleVerify(report._id)}
                              disabled={verifyingId === report._id}
                              className="px-4 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            >
                              {verifyingId === report._id ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleReject(report._id)}
                              disabled={verifyingId === report._id}
                              className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
