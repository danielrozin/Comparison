"use client";

import { useState, useEffect, useCallback } from "react";

interface AdminEvent {
  id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

interface DashboardData {
  stats: {
    totalEvents: number;
    todayEvents: number;
    searches: number;
    generations: number;
    feedbacks: number;
    contacts: number;
    todaySearches: number;
    todayGenerations: number;
  };
  recentEvents: AdminEvent[];
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (result.success) {
        setToken(result.token);
        setIsLoggedIn(true);
        localStorage.setItem("admin_token", result.token);
      } else {
        setLoginError(result.error || "Login failed");
      }
    } catch {
      setLoginError("Connection error");
    }
  };

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        headers: { "x-admin-token": token },
      });
      if (res.ok) {
        setData(await res.json());
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("admin_token");
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token]);

  // Auto-login from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch data on login
  useEffect(() => {
    if (isLoggedIn && token) fetchData();
  }, [isLoggedIn, token, fetchData]);

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-surface-dark rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">VS</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-text">Admin Panel</h1>
            <p className="text-text-secondary text-sm mt-1">Sign in to manage your site</p>
          </div>

          <form onSubmit={login} className="bg-white border border-border rounded-xl p-6 space-y-4">
            {loginError && (
              <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{loginError}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">Dashboard</h1>
          <p className="text-text-secondary text-sm">A Versus B Admin Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={() => { setIsLoggedIn(false); setToken(""); localStorage.removeItem("admin_token"); }}
            className="px-4 py-2 bg-surface-alt text-text text-sm font-medium rounded-lg hover:bg-gray-200 border border-border"
          >
            Logout
          </button>
        </div>
      </div>

      {data && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Events", value: data.stats.totalEvents, color: "text-primary-600" },
              { label: "Today", value: data.stats.todayEvents, color: "text-green-600" },
              { label: "Searches", value: data.stats.searches, color: "text-blue-600" },
              { label: "AI Generations", value: data.stats.generations, color: "text-amber-600" },
              { label: "Feedbacks", value: data.stats.feedbacks, color: "text-purple-600" },
              { label: "Contacts", value: data.stats.contacts, color: "text-pink-600" },
              { label: "Today Searches", value: data.stats.todaySearches, color: "text-blue-600" },
              { label: "Today Generations", value: data.stats.todayGenerations, color: "text-amber-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-border rounded-xl p-4">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Event log */}
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-bold text-text">Recent Activity</h2>
            </div>
            {data.recentEvents.length === 0 ? (
              <div className="p-8 text-center text-text-secondary text-sm">
                No events yet. Events will appear as users search, generate comparisons, or send feedback.
              </div>
            ) : (
              <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                {data.recentEvents.map((event) => (
                  <div key={event.id} className="px-5 py-3 hover:bg-surface-alt/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          event.type === "search" ? "bg-blue-500" :
                          event.type === "generation" ? "bg-amber-500" :
                          event.type === "feedback" ? "bg-purple-500" :
                          event.type === "contact" ? "bg-pink-500" :
                          "bg-gray-400"
                        }`} />
                        <span className="text-xs font-medium text-text-secondary uppercase">{event.type}</span>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-text">
                      {event.type === "search" && (
                        <span>Searched: <strong>{String(event.data.query || event.data.slug || "")}</strong></span>
                      )}
                      {event.type === "generation" && (
                        <span>Generated: <strong>{String(event.data.title || event.data.slug || "")}</strong> — {String(event.data.category || "")} / {String(event.data.subcategory || "")}</span>
                      )}
                      {event.type === "feedback" && (
                        <span>[{String(event.data.feedbackType || "")}] {String(event.data.message || "").slice(0, 100)}{event.data.email ? ` — ${event.data.email}` : ""}</span>
                      )}
                      {event.type === "contact" && (
                        <span>{String(event.data.message || "").slice(0, 100)} — {String(event.data.email || "")}</span>
                      )}
                      {event.type === "page_view" && (
                        <span>Viewed: {String(event.data.slug || "")}</span>
                      )}
                    </div>
                    {Array.isArray(event.data.tags) && (
                      <div className="flex gap-1 mt-1">
                        {event.data.tags.slice(0, 5).map((tag, ti) => (
                          <span key={ti} className="text-[10px] bg-surface-alt text-text-secondary px-1.5 py-0.5 rounded capitalize">{String(tag)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
