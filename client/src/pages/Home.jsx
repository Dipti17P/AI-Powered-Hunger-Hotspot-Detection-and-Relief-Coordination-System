import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";

const testimonials = [
  {
    quote: "Within 2 hours of my report, an NGO arrived with food packages. I couldn't believe how fast it worked.",
    name: "Priya S.",
    role: "Community Member, Pune",
    avatar: "PS",
    bg: "bg-green-500",
  },
  {
    quote: "The verified hotspot map transformed how we plan distribution runs. We now reach 3× more families.",
    name: "Rajan M.",
    role: "NGO Coordinator, Mumbai",
    avatar: "RM",
    bg: "bg-teal-600",
  },
  {
    quote: "HungerHotspot gave our volunteers a clear mission each day. The analytics keep our donors engaged.",
    name: "Anita K.",
    role: "Volunteer Lead, Delhi",
    avatar: "AK",
    bg: "bg-emerald-600",
  },
];

const Home = () => {
  const [liveStats, setLiveStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          API.get("/reports/public-stats"),
          API.get("/reports/recent"),
        ]);
        setLiveStats(statsRes.data);
        setRecentReports(recentRes.data);
      } catch (err) {
        // silently fall back to static display
      } finally {
        setStatsLoading(false);
      }
    };
    fetchLiveData();
  }, []);

  const steps = [
    {
      number: "01",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Report a Hotspot",
      desc: "Any citizen can pin a hunger-affected location on the map with a description and GPS coordinates.",
      color: "from-green-500 to-emerald-400",
      border: "border-green-200",
    },
    {
      number: "02",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Admin Verification",
      desc: "Trained admins review each report, confirm its authenticity, and approve it for NGO response.",
      color: "from-blue-500 to-cyan-400",
      border: "border-blue-200",
    },
    {
      number: "03",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "NGO Takes Action",
      desc: "Partner NGOs get real-time alerts and dispatch food assistance to the verified location.",
      color: "from-purple-500 to-pink-400",
      border: "border-purple-200",
    },
  ];

  const roles = [
    {
      icon: "👤",
      title: "Citizens",
      subtitle: "Report & Witness",
      color: "from-green-600 to-emerald-500",
      features: [
        "Pin hunger locations on the live map",
        "Attach descriptions & GPS coordinates",
        "Track the status of your reports",
        "View all verified hotspots near you",
      ],
      cta: "Join as Citizen",
      to: "/register",
    },
    {
      icon: "🤝",
      title: "NGOs",
      subtitle: "Respond & Help",
      color: "from-teal-600 to-cyan-500",
      features: [
        "Access all verified hunger hotspots",
        "Filter reports by severity level",
        "Get precise GPS coordinates",
        "Coordinate food distribution drives",
      ],
      cta: "Join as NGO",
      to: "/register",
      featured: true,
    },
    {
      icon: "🛡️",
      title: "Admins",
      subtitle: "Verify & Manage",
      color: "from-slate-600 to-gray-500",
      features: [
        "Review and approve submitted reports",
        "Monitor platform statistics",
        "Manage users and NGO partners",
        "Ensure report authenticity",
      ],
      cta: "Admin Login",
      to: "/login",
    },
  ];

  const stats = [
    {
      value: statsLoading ? "…" : liveStats ? `${liveStats.totalReports}` : "500+",
      label: "Hotspots Reported",
      icon: "📍",
    },
    {
      value: statsLoading ? "…" : liveStats ? `${liveStats.approvedReports}` : "120+",
      label: "Verified Hotspots",
      icon: "✅",
    },
    {
      value: statsLoading ? "…" : liveStats ? `${liveStats.pendingReports}` : "50+",
      label: "Awaiting Review",
      icon: "⏳",
    },
    {
      value: statsLoading ? "…" : liveStats ? `${liveStats.rejectedReports}` : "10+",
      label: "Reports Rejected",
      icon: "🚫",
    },
  ];

  const impacts = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Real-Time Response",
      desc: "Reports reach NGOs within minutes of admin verification — ensuring faster food delivery.",
      color: "text-yellow-500 bg-yellow-50",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      title: "Geo-Intelligence Map",
      desc: "Every report is plotted on an interactive India map — visualizing hunger patterns across regions.",
      color: "text-blue-500 bg-blue-50",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Verified & Trusted",
      desc: "Every public hotspot goes through admin review before being shared — preventing misuse.",
      color: "text-green-500 bg-green-50",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Community-Driven",
      desc: "Built by the people, for the people. Every citizen becomes a first responder against hunger.",
      color: "text-purple-500 bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-linear-to-br from-green-700 via-green-600 to-emerald-500 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-emerald-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-green-100 text-sm font-medium px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              Fighting Hunger Across India
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Map Hunger.
              <br />
              <span className="text-green-200">Feed Hope.</span>
            </h1>

            <p className="text-green-100 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              HungerHotspot connects citizens who spot hunger with NGOs who can help —
              through real-time mapping, admin verification, and instant action.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-green-700 font-bold rounded-2xl shadow-xl hover:bg-green-50 transition transform hover:scale-105 text-base"
              >
                Get Started Free
              </Link>
              <Link
                to="/map"
                className="w-full sm:w-auto px-8 py-4 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/25 transition flex items-center justify-center gap-2 text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                View Live Map
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-green-200 text-xs font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-600 text-sm font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Three simple steps that turn a report into real food on the table.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-3xl border-2 ${step.border} p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}
              >
                <div className="absolute -top-4 -right-3 w-10 h-10 bg-gray-800 text-white text-xs font-black rounded-xl flex items-center justify-center shadow-lg">
                  {step.number}
                </div>
                <div className={`w-14 h-14 bg-linear-to-br ${step.color} text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-600 text-sm font-bold uppercase tracking-widest">Why HungerHotspot</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Built for Real Impact</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Every feature is designed to get food to people faster.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT REPORTS ── */}
      {recentReports.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-green-600 text-sm font-bold uppercase tracking-widest">Live Feed</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2">Recent Verified Hotspots</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                These hunger hotspots have been reviewed and approved for NGO response.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentReports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white rounded-3xl border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-linear-to-br from-green-500 to-emerald-400 p-4">
                    <div className="flex items-center gap-2 text-white">
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs font-semibold truncate">{report.locationName}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">{report.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-4">{report.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Verified
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(report.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/map"
                className="inline-flex items-center gap-2 px-7 py-3 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                View All on Live Map
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── ROLES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-600 text-sm font-bold uppercase tracking-widest">For Everyone</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">Your Role in the Mission</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Whether you're a citizen, an NGO, or an admin — there's a place for you here.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {roles.map((role, i) => (
              <div
                key={i}
                className={`rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  role.featured
                    ? "border-transparent shadow-2xl md:scale-105"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {/* Header */}
                <div className={`bg-linear-to-br ${role.color} p-7 text-white relative`}>
                  {role.featured && (
                    <span className="absolute top-4 right-4 bg-white/25 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className="text-4xl mb-3">{role.icon}</div>
                  <h3 className="text-2xl font-black">{role.title}</h3>
                  <p className="text-white/75 text-sm font-medium mt-1">{role.subtitle}</p>
                </div>

                {/* Body */}
                <div className="p-7 bg-white">
                  <ul className="space-y-3 mb-7">
                    {role.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={role.to}
                    className={`block text-center py-3 rounded-xl font-semibold transition text-sm ${
                      role.featured
                        ? "bg-linear-to-r from-teal-600 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {role.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE BANNER ── */}
      <section className="py-20 bg-linear-to-r from-slate-800 to-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-5xl mb-6">🌾</div>
          <blockquote className="text-3xl md:text-4xl font-black leading-tight mb-6">
            "No one should go to bed hungry while food exists nearby."
          </blockquote>
          <p className="text-slate-400 text-base">
            HungerHotspot bridges the gap between those who need help and those who can provide it.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-linear-to-br from-green-600 to-emerald-500 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-5">
            Be the reason someone
            <br />eats today.
          </h2>
          <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of citizens and NGOs already using HungerHotspot to make a difference across India.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-10 py-4 bg-white text-green-700 font-bold rounded-2xl shadow-2xl hover:bg-green-50 transition transform hover:scale-105 text-base"
            >
              Start Reporting Now
            </Link>
            <Link
              to="/map"
              className="px-10 py-4 bg-white/15 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/25 transition text-base flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Explore the Map
            </Link>
          </div>

          <p className="text-green-200 text-sm mt-8 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free to use &middot; No credit card &middot; Instant access
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">
              Hunger<span className="text-green-500">Hotspot</span>
            </span>
          </div>

          <p className="text-xs text-center">
            Fighting hunger, one report at a time. Built with ❤️ for India.
          </p>

          <div className="flex gap-5 text-sm">
            <Link to="/map" className="hover:text-white transition">Map</Link>
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
