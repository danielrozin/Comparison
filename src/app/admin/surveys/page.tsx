"use client";

import { useState, useEffect, useCallback } from "react";

interface InterceptStats {
  totalCount: number;
  avgRating: number;
  optInCount: number;
  dailyBreakdown: Array<{ date: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
  intentBreakdown: Array<{ intent: string; count: number }>;
  discoveryBreakdown: Array<{ discovery: string; count: number }>;
}

interface SmartReviewStats {
  totalCount: number;
  avgEase: number;
  avgTrust: number;
  optInCount: number;
  dailyBreakdown: Array<{ date: string; count: number }>;
  motivationBreakdown: Array<{ motivation: string; count: number }>;
  discoveryBreakdown: Array<{ discovery: string; count: number }>;
  triggerBreakdown: Array<{ trigger: string; count: number }>;
  trustFactorBreakdown: Array<{ factor: string; count: number }>;
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
  comparison_page: "From comparison page",
  other: "Other",
};

const MOTIVATION_LABELS: Record<string, string> = {
  share_experience: "Share experience",
  help_others: "Help others decide",
  positive_experience: "Great experience",
  negative_experience: "Bad experience",
  research_purchase: "Research purchase",
  compare_options: "Compare options",
  check_quality: "Check quality",
  curiosity: "Just curious",
  other: "Other",
};

const TRIGGER_LABELS: Record<string, string> = {
  form_submit_success: "After review submit",
  form_abandon: "Form abandon",
  browse_5_pages: "Browsed 5+ pages",
};

const TRUST_FACTOR_LABELS: Record<string, string> = {
  verified_purchase: "Verified purchases",
  rating_distribution: "Rating distributions",
  reviewer_profiles: "Reviewer profiles",
  more_reviews: "More reviews",
  expert_reviews: "Expert reviews",
  response_from_brand: "Brand responses",
};

type Tab = "intercept" | "smartreview";

export default function SurveyDashboardPage() {
  const [tab, setTab] = useState<Tab>("intercept");
  const [interceptStats, setInterceptStats] = useState<InterceptStats | null>(null);
  const [smartReviewStats, setSmartReviewStats] = useState<SmartReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const headers = { "x-admin-token": token };
      const [interceptRes, smartReviewRes] = await Promise.all([
        fetch("/api/surveys/intercept/stats", { headers }),
        fetch("/api/surveys/smartreview/stats", { headers }),
      ]);
      if (interceptRes.ok) setInterceptStats(await interceptRes.json());
      if (smartReviewRes.ok) setSmartReviewStats(await smartReviewRes.json());
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <a href="/admin" className="text-primary-600 text-sm mt-4 inline-block hover:underline">
            Back to admin
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text">Survey Dashboard</h1>
            <p className="text-text-secondary text-sm mt-1">User research survey responses</p>
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

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setTab("intercept")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "intercept" ? "bg-primary-600 text-white" : "text-text-secondary hover:text-text"
            }`}
          >
            Intercept Survey (aversusb.net)
          </button>
          <button
            onClick={() => setTab("smartreview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === "smartreview" ? "bg-primary-600 text-white" : "text-text-secondary hover:text-text"
            }`}
          >
            SmartReview Survey
          </button>
        </div>

        {tab === "intercept" && interceptStats && (
          <InterceptDashboard stats={interceptStats} />
        )}
        {tab === "smartreview" && smartReviewStats && (
          <SmartReviewDashboard stats={smartReviewStats} />
        )}
        {tab === "intercept" && !interceptStats && (
          <p className="text-sm text-text-secondary">No intercept survey data available.</p>
        )}
        {tab === "smartreview" && !smartReviewStats && (
          <p className="text-sm text-text-secondary">No SmartReview survey data available.</p>
        )}
      </div>
    </div>
  );
}

function InterceptDashboard({ stats }: { stats: InterceptStats }) {
  const maxDaily = Math.max(...stats.dailyBreakdown.map((d) => d.count), 1);
  const maxIntent = Math.max(...stats.intentBreakdown.map((d) => d.count), 1);
  const maxDiscovery = Math.max(...stats.discoveryBreakdown.map((d) => d.count), 1);

  return (
    <>
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

      <DailyChart data={stats.dailyBreakdown} maxVal={maxDaily} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <BarBreakdown
          title="User Intent (Q1)"
          data={stats.intentBreakdown.map((i) => ({ label: INTENT_LABELS[i.intent] || i.intent, count: i.count }))}
          maxVal={maxIntent}
          color="blue"
        />
        <BarBreakdown
          title="Discovery Source (Q5)"
          data={stats.discoveryBreakdown.map((i) => ({ label: DISCOVERY_LABELS[i.discovery] || i.discovery, count: i.count }))}
          maxVal={maxDiscovery}
          color="purple"
        />
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
    </>
  );
}

function SmartReviewDashboard({ stats }: { stats: SmartReviewStats }) {
  const maxDaily = Math.max(...stats.dailyBreakdown.map((d) => d.count), 1);
  const maxMotivation = Math.max(...stats.motivationBreakdown.map((d) => d.count), 1);
  const maxDiscovery = Math.max(...stats.discoveryBreakdown.map((d) => d.count), 1);
  const maxTrigger = Math.max(...stats.triggerBreakdown.map((d) => d.count), 1);
  const maxTrust = Math.max(...stats.trustFactorBreakdown.map((d) => d.count), 1);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Responses" value={stats.totalCount} target={100} />
        <StatCard label="Avg Ease" value={stats.avgEase.toFixed(1)} suffix="/5" />
        <StatCard label="Avg Trust" value={stats.avgTrust.toFixed(1)} suffix="/5" />
        <StatCard label="Opt-in Emails" value={stats.optInCount} />
      </div>

      <DailyChart data={stats.dailyBreakdown} maxVal={maxDaily} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <BarBreakdown
          title="User Motivation (Q1)"
          data={stats.motivationBreakdown.map((i) => ({ label: MOTIVATION_LABELS[i.motivation] || i.motivation, count: i.count }))}
          maxVal={maxMotivation}
          color="blue"
        />
        <BarBreakdown
          title="Discovery Source (Q4)"
          data={stats.discoveryBreakdown.map((i) => ({ label: DISCOVERY_LABELS[i.discovery] || i.discovery, count: i.count }))}
          maxVal={maxDiscovery}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <BarBreakdown
          title="Trigger Type"
          data={stats.triggerBreakdown.map((i) => ({ label: TRIGGER_LABELS[i.trigger] || i.trigger, count: i.count }))}
          maxVal={maxTrigger}
          color="green"
        />
        <BarBreakdown
          title="Trust Improvement Factors (Q3)"
          data={stats.trustFactorBreakdown.map((i) => ({ label: TRUST_FACTOR_LABELS[i.factor] || i.factor, count: i.count }))}
          maxVal={maxTrust}
          color="amber"
        />
      </div>
    </>
  );
}

function DailyChart({ data, maxVal }: { data: Array<{ date: string; count: number }>; maxVal: number }) {
  return (
    <div className="bg-white rounded-xl border border-border p-6 mb-6">
      <h2 className="font-semibold text-text mb-4">Daily Responses (Last 30 Days)</h2>
      {data.length === 0 ? (
        <p className="text-sm text-text-secondary">No responses yet.</p>
      ) : (
        <div className="space-y-2">
          {data.map((day) => (
            <div key={day.date} className="flex items-center gap-3">
              <span className="text-xs text-text-secondary w-24 shrink-0">
                {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${(day.count / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-text w-8 text-right">{day.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BarBreakdown({
  title,
  data,
  maxVal,
  color,
}: {
  title: string;
  data: Array<{ label: string; count: number }>;
  maxVal: number;
  color: string;
}) {
  const colorClass = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    amber: "bg-amber-500",
  }[color] || "bg-primary-500";

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <h2 className="font-semibold text-text mb-4">{title}</h2>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-secondary">{item.label}</span>
              <span className="font-medium">{item.count}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${colorClass} rounded-full`}
                style={{ width: `${(item.count / maxVal) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-text-secondary">No data yet.</p>}
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
