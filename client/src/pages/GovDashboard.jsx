import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import API from "../api/api";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend
);

const chartOptions = (title) => ({
  responsive: true,
  plugins: { legend: { position: "bottom" }, title: { display: !!title, text: title } },
  scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
});

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value ?? "…"}</p>
      </div>
    </div>
  );
}

export default function GovDashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [priorityAreas, setPriorityAreas] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, a, p, c] = await Promise.all([
          API.get("/reports/public-stats"),
          API.get("/reports/analytics"),
          API.get("/reports/priority-areas"),
          API.get("/reports/clusters"),
        ]);
        setStats(s.data);
        setAnalytics(a.data);
        setPriorityAreas(p.data);
        setClusters(c.data);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const severityChart = analytics ? {
    labels: ["Low", "Medium", "High"],
    datasets: [{
      data: [analytics.severity.low, analytics.severity.medium, analytics.severity.high],
      backgroundColor: ["#22c55e", "#f97316", "#ef4444"],
    }],
  } : null;

  const monthlyChart = analytics ? {
    labels: analytics.monthly.map((m) => m.month),
    datasets: [{
      label: "Reports",
      data: analytics.monthly.map((m) => m.count),
      borderColor: "#22c55e",
      backgroundColor: "rgba(34,197,94,0.15)",
      tension: 0.4,
      fill: true,
    }],
  } : null;

  const locationChart = analytics ? {
    labels: analytics.perLocation.map((l) => l.location),
    datasets: [{
      label: "Reports",
      data: analytics.perLocation.map((l) => l.count),
      backgroundColor: "#3b82f6",
      borderRadius: 6,
    }],
  } : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <svg className="w-10 h-10 animate-spin text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-gray-500 text-sm">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🏛️ Government Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time hunger monitoring, AI hotspot analysis, and resource allocation</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="📋" label="Total Reports" value={stats?.totalReports} color="bg-blue-50" />
          <StatCard icon="✅" label="Active Hotspots" value={stats?.approvedReports} color="bg-green-50" />
          <StatCard icon="🔴" label="High Severity" value={analytics?.severity?.high} color="bg-red-50" />
          <StatCard icon="🔥" label="AI Clusters" value={clusters.length} color="bg-orange-50" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4">📈 Monthly Hunger Trend</h2>
            {monthlyChart && monthlyChart.labels.length > 0
              ? <Line data={monthlyChart} options={chartOptions()} />
              : <p className="text-gray-400 text-sm text-center py-8">Not enough data yet</p>}
          </div>

          {/* Severity Doughnut */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4">🎯 Severity Distribution</h2>
            {severityChart
              ? <Doughnut data={severityChart} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
              : <p className="text-gray-400 text-sm text-center py-8">No data</p>}
          </div>
        </div>

        {/* Per District Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">🗺️ Hunger Reports by District</h2>
          {locationChart && locationChart.labels.length > 0
            ? <Bar data={locationChart} options={chartOptions()} />
            : <p className="text-gray-400 text-sm text-center py-8">No approved reports yet</p>}
        </div>

        {/* Bottom Row: Priority Areas + AI Clusters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Smart Resource Allocation */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4">⚡ Top Priority Areas</h2>
            {priorityAreas.length === 0
              ? <p className="text-gray-400 text-sm">No data yet</p>
              : <ol className="space-y-2">
                  {priorityAreas.map((area, i) => (
                    <li key={area.area} className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                        i === 0 ? "bg-red-500" : i === 1 ? "bg-orange-400" : i === 2 ? "bg-yellow-400" : "bg-gray-300"}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{area.area}</p>
                        <p className="text-xs text-gray-400">{area.count} report{area.count > 1 ? "s" : ""}{area.highCount ? ` · ${area.highCount} high severity` : ""}</p>
                      </div>
                      <div className="w-24 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (area.count / (priorityAreas[0]?.count || 1)) * 100)}%` }} />
                      </div>
                    </li>
                  ))}
                </ol>}
          </div>

          {/* AI Clusters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4">🔥 AI Hotspot Clusters (DBSCAN)</h2>
            {clusters.length === 0
              ? <p className="text-gray-400 text-sm">No clusters detected yet — need more reports in proximity</p>
              : <div className="space-y-3">
                  {clusters.map((c) => (
                    <div key={c.id} className={`rounded-xl px-4 py-3 border ${
                      c.risk === "HIGH" ? "bg-red-50 border-red-200" :
                      c.risk === "MEDIUM" ? "bg-orange-50 border-orange-200" :
                      "bg-green-50 border-green-200"}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-gray-800">📍 {c.area}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          c.risk === "HIGH" ? "bg-red-100 text-red-700" :
                          c.risk === "MEDIUM" ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"}`}>{c.risk}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Reports in cluster: {c.count}</p>
                    </div>
                  ))}
                </div>}
          </div>
        </div>

      </div>
    </div>
  );
}
