"use client";

import { useState, useEffect, useCallback } from "react";

interface SurveyStats {
  totalCount: number;
  avgRating: number;
  optInCount: number;
  dailyBreakdown: Array<{ date: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
  intentBreakdown: Array<{ intent: string; count: number }>;
  discoveryBreakdown: Array<{ discovery: string; count: number }>;
}

const INTENT_LABELS: Record<string, string> = {
  purchase: "Purchase decision",
  curiosity: "Curiosity / debate",
  project: "School/work project",
  browsing: "Just browsing",
  other: "Other",
};

const DISCOVERY_LABELS: Record<string, string> = {
  search: "Search engine",
  social: "Social media",
  shared: "Shared link",
  direct: "Direct / bookmark",
  other: "Other",
};

export default function SurveyDashboardPage() {
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/surveys/intercept/stats", {
        headers: { "x-admin-token": token },
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setStats(data);
      setError("");
    } catch {
      setError("Could not load survey stats. Make sure you are logged in as admin.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-text-secondary">Loading survey data...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
          <p className="text-red-600 font-medium">{error || "No data available"}</p>
          <a href="/admin" className="text-primary-600 text-sm mt-4 inline-block hover:underline">
            Back to admin
          </a>
        </div>
      </div>
    );
  }

  const maxDaily = Math.max(...stats.dailyBreakdown.map((d) => d.count), 1);
  const maxIntent = Math.max(...stats.intentBreakdown.map((d) => d.count), 1);
  const maxDiscovery = Math.max(...stats.discoveryBreakdown.map((d) => d.count), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text">Intercept Survey Dashboard</h1>
            <p className="text-text-secondary text-sm mt-1">
              Real-time responses from comparison page surveys
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-white border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
            <a
              href="/admin"
              className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Back to admin
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Responses" value={stats.totalCount} target={200} />
          <StatCard label="Avg Rating" value={stats.avgRating.toFixed(1)} suffix="/5" />
          <StatCard label="Opt-in Emails" value={stats.optInCount} />
          <StatCard
            label="Response Rate"
            value={stats.dailyBreakdown.length > 0
              ? (stats.totalCount / stats.dailyBreakdown.length).toFixed(1)
              : "0"}
            suffix="/day"
          />
        </div>

        {/* Daily Breakdown */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-semibold text-text mb-4">Daily Responses (Last 30 Days)</h2>
          {stats.dailyBreakdown.length === 0 ? (
            <p className="text-sm text-text-secondary">No responses yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.dailyBreakdown.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary w-24 shrink-0">
                    {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${(day.count / maxDaily) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-text w-8 text-right">{day.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Intent Breakdown */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text mb-4">User Intent (Q1)</h2>
            <div className="space-y-3">
              {stats.intentBreakdown.map((item) => (
                <div key={item.intent}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">{INTENT_LABELS[item.intent] || item.intent}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(item.count / maxIntent) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discovery Breakdown */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text mb-4">Discovery Source (Q5)</h2>
            <div className="space-y-3">
              {stats.discoveryBreakdown.map((item) => (
                <div key={item.discovery}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">{DISCOVERY_LABELS[item.discovery] || item.discovery}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(item.count / maxDiscovery) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-semibold text-text mb-4">By Category</h2>
            <div className="space-y-2">
              {stats.categoryBreakdown.slice(0, 10).map((item) => (
                <div key={item.category} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{item.category}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
              {stats.categoryBreakdown.length === 0 && (
                <p className="text-sm text-text-secondary">No data yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  target,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  target?: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <p className="text-xs text-text-secondary uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-text mt-1">
        {value}
        {suffix && <span className="text-lg font-normal text-text-secondary">{suffix}</span>}
      </p>
      {target && (
        <div className="mt-2">
          <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${Math.min((Number(value) / target) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-1">Target: {target}</p>
        </div>
      )}
    </div>
  );
}
