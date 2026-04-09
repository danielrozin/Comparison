"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from "recharts";

interface LiveMetrics {
  period: { start: string; end: string; days: number };
  summary: {
    totalEvents: number;
    todayEvents: number;
    eventsByType: Record<string, number>;
    todayByType: Record<string, number>;
  };
  dailyBreakdown: Array<{
    date: string;
    label: string;
    total: number;
    searches: number;
    generations: number;
    feedbacks: number;
  }>;
  content: {
    comparisons: number;
    entities: number;
    blogArticles: number;
    newsletterSubscribers: number;
    embedPartners: number;
    votes: number;
    keywords: number;
    recentSearchCount: number;
    generatedCount: number;
    organicCount: number;
  };
  topCategories: Array<{ category: string; count: number }>;
  topComparisons: Array<{ slug: string; title: string; count: number }>;
}

interface GSCInsight {
  type: "high_impressions_low_ctr" | "striking_distance" | "quick_win" | "top_performer";
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  action: string;
}

interface GSCCrossRef {
  stats: { totalQueries: number; totalClicks: number; totalImpressions: number; avgPosition: number };
  insights: GSCInsight[];
  topQueries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }>;
  strikingDistance: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }>;
  highImpressionLowCTR: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }>;
}

interface WoWMetric {
  current: number;
  previous: number;
  change: string;
}

interface WeeklyReport {
  title: string;
  generatedAt: string;
  headline: Record<string, number>;
  weekOverWeek?: Record<string, WoWMetric>;
  contentVelocity?: {
    comparisons: WoWMetric & { thisWeek: number; lastWeek: number };
    articles: WoWMetric & { thisWeek: number; lastWeek: number };
    avgComparisonsPerDay: number;
  };
  dailyTrend: Array<{ date: string; label: string; total: number; searches: number; generations: number }>;
  topComparisons: Array<{ slug: string; title: string; count: number }>;
  topCategories: Array<{ category: string; count: number }>;
  contentHealth: Record<string, string | number>;
  callouts: string[];
}

interface AnalyticsConfig {
  product: string;
  ga4Property: string;
  clarityProject: string;
  events: Array<{
    name: string;
    category: string;
    description: string;
    params: string[];
  }>;
  funnel: {
    name: string;
    steps: Array<{
      step: number;
      name: string;
      event: string;
      description: string;
    }>;
  };
  kpis: {
    northStar: { metric: string; description: string; currentBaseline: string | null; target: string };
    core: Array<{ metric: string; source: string; frequency: string; target: string | null }>;
    engagement: Array<{ metric: string; formula: string; target: string }>;
  };
  reporting: Record<string, { name: string; audience: string[]; sections: string[] }>;
  experiments: Array<{
    id: string;
    name: string;
    variants: string[];
    trafficPercent: number;
    startDate: string;
    endDate: string;
    goalMetric: string;
    isActive: boolean;
  }>;
  activeExperimentCount: number;
  live: LiveMetrics;
}

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#818cf8", "#6d28d9", "#4f46e5", "#7c3aed", "#5b21b6", "#4338ca"];
const AREA_COLORS = { searches: "#6366f1", generations: "#10b981", feedbacks: "#f59e0b" };

function StatCard({ label, value, subtitle, trend }: { label: string; value: string | number; subtitle?: string; trend?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && <span className="text-xs font-medium text-emerald-600 mb-1">{trend}</span>}
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [config, setConfig] = useState<AnalyticsConfig | null>(null);
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "funnel" | "events" | "experiments" | "gsc" | "report">("overview");
  const [gscData, setGscData] = useState<GSCCrossRef | null>(null);
  const [gscLoading, setGscLoading] = useState(false);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadReport = () => {
    if (report) return;
    setReportLoading(true);
    fetch("/api/analytics?section=report")
      .then((r) => r.json())
      .then(setReport)
      .catch(() => {})
      .finally(() => setReportLoading(false));
  };

  const loadGsc = () => {
    if (gscData) return;
    setGscLoading(true);
    fetch("/api/analytics?section=gsc-crossref")
      .then((r) => r.json())
      .then(setGscData)
      .catch(() => {})
      .finally(() => setGscLoading(false));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-500">Failed to load analytics configuration.</p>
      </div>
    );
  }

  const live = config.live;
  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "funnel" as const, label: "Conversion Funnel" },
    { key: "events" as const, label: "Custom Events" },
    { key: "experiments" as const, label: `Experiments (${config.activeExperimentCount})` },
    { key: "gsc" as const, label: "GSC Insights" },
    { key: "report" as const, label: "Weekly Report" },
  ];

  const categoryColors: Record<string, string> = {
    discovery: "bg-blue-50 text-blue-700 border-blue-200",
    consideration: "bg-indigo-50 text-indigo-700 border-indigo-200",
    exploration: "bg-violet-50 text-violet-700 border-violet-200",
    conversion: "bg-emerald-50 text-emerald-700 border-emerald-200",
    partnership: "bg-amber-50 text-amber-700 border-amber-200",
    amplification: "bg-pink-50 text-pink-700 border-pink-200",
    lead_capture: "bg-cyan-50 text-cyan-700 border-cyan-200",
    engagement: "bg-orange-50 text-orange-700 border-orange-200",
    retention: "bg-red-50 text-red-700 border-red-200",
    experimentation: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {config.product} — GA4: {config.ga4Property} | Clarity: {config.clarityProject}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Data period: {live.period.start} to {live.period.end} ({live.period.days} days)
        </p>
        <div className="flex gap-4 mt-2">
          <a href="/admin/analytics/aarrr" className="inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View AARRR Pirate Metrics Dashboard &rarr;
          </a>
          <a href="/admin/analytics/okr" className="inline-block text-sm text-violet-600 hover:text-violet-800 font-medium">
            View OKR Dashboard &rarr;
          </a>
          <a href="/admin/analytics/weekly-report" className="inline-block text-sm text-emerald-600 hover:text-emerald-800 font-medium">
            Weekly Report &rarr;
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key === "report") loadReport();
              if (tab.key === "gsc") loadGsc();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <StatCard label="Total Events" value={live.summary.totalEvents} subtitle="Last 500 in Redis" />
            <StatCard label="Today" value={live.summary.todayEvents} subtitle="Events today" />
            <StatCard label="Comparisons" value={live.content.comparisons} subtitle="In database" />
            <StatCard label="Entities" value={live.content.entities} subtitle="Tracked entities" />
            <StatCard label="Subscribers" value={live.content.newsletterSubscribers} subtitle="Newsletter" />
            <StatCard label="Keywords" value={live.content.keywords} subtitle="Opportunities tracked" />
          </div>

          {/* Daily Activity Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity (7 days)</h3>
            {live.dailyBreakdown.some((d) => d.total > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={live.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="searches" stackId="1" stroke={AREA_COLORS.searches} fill={AREA_COLORS.searches} fillOpacity={0.6} name="Searches" />
                  <Area type="monotone" dataKey="generations" stackId="1" stroke={AREA_COLORS.generations} fill={AREA_COLORS.generations} fillOpacity={0.6} name="Generations" />
                  <Area type="monotone" dataKey="feedbacks" stackId="1" stroke={AREA_COLORS.feedbacks} fill={AREA_COLORS.feedbacks} fillOpacity={0.6} name="Feedbacks" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                No event data yet. Events will appear as users interact with the site.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Categories */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
              {live.topCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={live.topCategories}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} (${((percent || 0) * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {live.topCategories.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  No category data yet.
                </div>
              )}
            </div>

            {/* Top Comparisons */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Comparisons</h3>
              {live.topComparisons.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={live.topComparisons.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={180}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: string) => v.length > 28 ? v.slice(0, 25) + "..." : v}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Searches" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">
                  No comparison data yet.
                </div>
              )}
            </div>
          </div>

          {/* Content Health */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Health</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <StatCard label="Comparisons" value={live.content.comparisons} />
              <StatCard label="Entities" value={live.content.entities} />
              <StatCard label="Blog Articles" value={live.content.blogArticles} />
              <StatCard label="Embed Partners" value={live.content.embedPartners} />
              <StatCard label="User Votes" value={live.content.votes} />
              <StatCard
                label="Content Mix"
                value={`${live.content.generatedCount}/${live.content.organicCount}`}
                subtitle="Generated / Organic"
              />
              <StatCard label="Recent Searches" value={live.content.recentSearchCount} subtitle="In Redis" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`https://analytics.google.com/analytics/web/#/p${config.ga4Property.replace("G-", "")}/reports`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-lg font-bold">G</div>
              <div>
                <p className="font-medium text-gray-900">Google Analytics</p>
                <p className="text-xs text-gray-400">{config.ga4Property}</p>
              </div>
            </a>
            <a
              href={`https://clarity.microsoft.com/projects/view/${config.clarityProject}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 text-lg font-bold">C</div>
              <div>
                <p className="font-medium text-gray-900">Microsoft Clarity</p>
                <p className="text-xs text-gray-400">{config.clarityProject}</p>
              </div>
            </a>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 text-lg font-bold">S</div>
              <div>
                <p className="font-medium text-gray-900">Search Console</p>
                <p className="text-xs text-gray-400">GSC data</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Funnel Tab */}
      {activeTab === "funnel" && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">{config.funnel.name}</h3>

          {/* KPI Targets */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">North Star Metric</p>
            <h2 className="text-xl font-bold text-gray-900">{config.kpis.northStar.metric}</h2>
            <p className="text-sm text-gray-600 mt-1">{config.kpis.northStar.description}</p>
            <p className="text-sm text-gray-400 mt-2">Target: {config.kpis.northStar.target}</p>
          </div>

          {/* Funnel Steps */}
          <div className="space-y-3">
            {config.funnel.steps.map((step, i) => (
              <div key={step.step} className="flex items-stretch gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {step.step}
                  </div>
                  {i < config.funnel.steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 mb-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-gray-900">{step.name}</h4>
                    <code className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200">
                      {step.event}
                    </code>
                  </div>
                  <p className="text-sm text-gray-500">{step.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 bg-gray-100 rounded-full flex-1">
                      <div
                        className="h-2 bg-indigo-400 rounded-full transition-all"
                        style={{ width: `${Math.round(100 * Math.pow(0.75, i))}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-12 text-right">
                      {Math.round(100 * Math.pow(0.75, i))}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Engagement KPI Targets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement KPI Targets</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {config.kpis.engagement.map((kpi) => (
                <StatCard
                  key={kpi.metric}
                  label={kpi.metric}
                  value={kpi.target}
                  subtitle={kpi.formula}
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Funnel percentages are placeholders. Actual GA4 data will replace them after sufficient collection.
          </p>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Custom Events ({config.events.length})</h3>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Event</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Parameters</th>
                </tr>
              </thead>
              <tbody>
                {config.events.map((event) => (
                  <tr key={event.name} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200 font-mono">
                        {event.name}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${categoryColors[event.category] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{event.description}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {event.params.map((p) => (
                          <code key={p} className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100">
                            {p}
                          </code>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Experiments Tab */}
      {activeTab === "experiments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">A/B Experiments</h3>
            <span className="text-sm text-gray-500">{config.activeExperimentCount} active</span>
          </div>

          <div className="grid gap-4">
            {config.experiments.map((exp) => {
              const start = new Date(exp.startDate);
              const end = new Date(exp.endDate);
              const now = new Date();
              const totalDays = Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000));
              const elapsed = exp.isActive ? Math.floor((now.getTime() - start.getTime()) / 86400000) : 0;
              const progress = exp.isActive ? Math.min(100, Math.round((elapsed / totalDays) * 100)) : 0;

              return (
                <div key={exp.id} className={`bg-white border rounded-xl p-6 ${exp.isActive ? "border-indigo-200" : "border-gray-200 opacity-60"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{exp.name}</h4>
                        {exp.isActive ? (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Active</span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-200">Scheduled</span>
                        )}
                      </div>
                      <code className="text-xs text-gray-500 mt-1">{exp.id}</code>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{exp.trafficPercent}% traffic</p>
                      <p className="text-xs text-gray-400">{exp.variants.join(" vs ")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Goal Metric</p>
                      <p className="text-sm font-medium text-indigo-600">{exp.goalMetric}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start</p>
                      <p className="text-sm text-gray-700">{exp.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End</p>
                      <p className="text-sm text-gray-700">{exp.endDate}</p>
                    </div>
                  </div>

                  {exp.isActive && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Day {elapsed} of {totalDays}</span>
                        <span>{progress}% elapsed</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-indigo-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Analysis Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-900 mb-3">Analysis Notes</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>* <strong>verdict-first-layout:</strong> 50% traffic split. Compare bounce_rate between variants in GA4 Explore. Filter by <code className="bg-blue-100 px-1 rounded">experiment_view</code> event with <code className="bg-blue-100 px-1 rounded">variant</code> dimension.</li>
              <li>* <strong>cta-button-style:</strong> 100% traffic. Measure affiliate_click rate per variant. Check <code className="bg-blue-100 px-1 rounded">affiliate_click</code> events segmented by experiment variant.</li>
              <li>* <strong>social-proof-elements:</strong> Scheduled May 15. No action needed yet.</li>
              <li>* <strong>Sample size:</strong> Need ~1,000 sessions per variant for 95% confidence on bounce_rate changes &gt;5 percentage points.</li>
              <li>* <strong>Duration:</strong> Wait 2+ full weeks before drawing conclusions to control for day-of-week effects.</li>
            </ul>
          </div>
        </div>
      )}

      {/* GSC Insights Tab */}
      {activeTab === "gsc" && (
        <div className="space-y-6">
          {gscLoading && (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-48 bg-gray-200 rounded" />
            </div>
          )}
          {gscData && (
            <>
              {/* GSC Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Queries" value={gscData.stats.totalQueries} subtitle="Last 28 days" />
                <StatCard label="Total Clicks" value={gscData.stats.totalClicks} subtitle="From search" />
                <StatCard label="Total Impressions" value={gscData.stats.totalImpressions.toLocaleString()} subtitle="Search visibility" />
                <StatCard label="Avg Position" value={gscData.stats.avgPosition.toFixed(1)} subtitle="In search results" />
              </div>

              {/* Insights */}
              {gscData.insights.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Actionable Insights</h3>
                  {gscData.insights.slice(0, 15).map((insight, i) => {
                    const colorMap: Record<string, string> = {
                      high_impressions_low_ctr: "border-red-200 bg-red-50",
                      striking_distance: "border-amber-200 bg-amber-50",
                      quick_win: "border-green-200 bg-green-50",
                      top_performer: "border-blue-200 bg-blue-50",
                    };
                    const labelMap: Record<string, string> = {
                      high_impressions_low_ctr: "Low CTR",
                      striking_distance: "Striking Distance",
                      quick_win: "Quick Win",
                      top_performer: "Top Performer",
                    };
                    return (
                      <div key={i} className={`border rounded-xl p-4 ${colorMap[insight.type] || "border-gray-200 bg-white"}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                              {labelMap[insight.type] || insight.type}
                            </span>
                            <code className="text-xs bg-white/60 px-2 py-0.5 rounded border border-gray-200">
                              {insight.query}
                            </code>
                          </div>
                          <div className="flex gap-3 text-xs text-gray-500">
                            <span>{insight.impressions} imp</span>
                            <span>{insight.clicks} clicks</span>
                            <span>Pos {insight.position.toFixed(1)}</span>
                            <span>{(insight.ctr * 100).toFixed(1)}% CTR</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{insight.action}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Striking Distance Keywords */}
              {gscData.strikingDistance.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Striking Distance Keywords</h3>
                  <p className="text-sm text-gray-500 mb-4">Position 5-15 — optimize to push into top 5</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500 font-medium">Query</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Impressions</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Clicks</th>
                        <th className="text-right py-2 text-gray-500 font-medium">CTR</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gscData.strikingDistance.map((q, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="py-2 text-gray-900">{q.query}</td>
                          <td className="py-2 text-right text-gray-600">{q.impressions}</td>
                          <td className="py-2 text-right text-gray-600">{q.clicks}</td>
                          <td className="py-2 text-right text-gray-600">{(q.ctr * 100).toFixed(1)}%</td>
                          <td className="py-2 text-right font-medium text-amber-600">{q.position.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* High Impression Low CTR */}
              {gscData.highImpressionLowCTR.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">High Impressions, Low CTR</h3>
                  <p className="text-sm text-gray-500 mb-4">Top 10 positions with CTR below 3% — meta optimization needed</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500 font-medium">Query</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Impressions</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Clicks</th>
                        <th className="text-right py-2 text-gray-500 font-medium">CTR</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gscData.highImpressionLowCTR.map((q, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="py-2 text-gray-900">{q.query}</td>
                          <td className="py-2 text-right text-gray-600">{q.impressions}</td>
                          <td className="py-2 text-right text-gray-600">{q.clicks}</td>
                          <td className="py-2 text-right font-medium text-red-600">{(q.ctr * 100).toFixed(1)}%</td>
                          <td className="py-2 text-right text-gray-600">{q.position.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Top Queries by Clicks */}
              {gscData.topQueries.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Queries by Clicks</h3>
                  <ResponsiveContainer width="100%" height={Math.min(400, gscData.topQueries.length * 32 + 40)}>
                    <BarChart data={gscData.topQueries.slice(0, 12)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="query"
                        width={200}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v: string) => v.length > 30 ? v.slice(0, 27) + "..." : v}
                      />
                      <Tooltip />
                      <Bar dataKey="clicks" fill="#6366f1" radius={[0, 4, 4, 0]} name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
          {!gscLoading && !gscData && (
            <div className="text-center py-12 text-gray-400">
              No GSC data available. Ensure GOOGLE_SERVICE_ACCOUNT_KEY is configured.
            </div>
          )}
          {gscData && gscData.stats.totalQueries === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <p className="text-amber-800 font-medium">No GSC queries found</p>
              <p className="text-sm text-amber-600 mt-1">
                Either GSC credentials are not configured or no data is available yet. Data typically appears 2-3 days after site verification.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Weekly Report Tab */}
      {activeTab === "report" && (
        <div className="space-y-6">
          {reportLoading && (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-48 bg-gray-200 rounded" />
            </div>
          )}
          {report && (
            <>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900">{report.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Generated: {new Date(report.generatedAt).toLocaleString()}
                </p>
              </div>

              {/* Headline Numbers */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(report.headline).map(([key, value]) => (
                  <StatCard
                    key={key}
                    label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    value={value}
                  />
                ))}
              </div>

              {/* Week-over-Week Comparison */}
              {report.weekOverWeek && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Week-over-Week</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(report.weekOverWeek).map(([key, data]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{key}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{data.current}</p>
                        <p className={`text-sm mt-1 font-medium ${data.change.startsWith("+") && data.change !== "+0%" ? "text-green-600" : data.change.startsWith("-") ? "text-red-600" : "text-gray-500"}`}>
                          {data.change} vs last week ({data.previous})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Velocity */}
              {report.contentVelocity && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Velocity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Comparisons Created</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{report.contentVelocity.comparisons.thisWeek}</p>
                      <p className="text-sm text-gray-500 mt-1">{report.contentVelocity.comparisons.change} vs last week</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Articles Created</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{report.contentVelocity.articles.thisWeek}</p>
                      <p className="text-sm text-gray-500 mt-1">{report.contentVelocity.articles.change} vs last week</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Comparisons/Day</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{report.contentVelocity.avgComparisonsPerDay}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Trend */}
              {report.dailyTrend.some((d) => d.total > 0) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={report.dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="searches" fill="#6366f1" name="Searches" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="generations" fill="#10b981" name="Generations" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Content Health */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Health</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(report.contentHealth).map(([key, value]) => (
                    <StatCard
                      key={key}
                      label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={value}
                    />
                  ))}
                </div>
              </div>

              {/* Callouts */}
              {report.callouts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">Callouts</h3>
                  <ul className="space-y-2">
                    {report.callouts.map((callout, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                        <span className="text-amber-500 shrink-0 mt-0.5">*</span>
                        {callout}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Top Content Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {report.topComparisons.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Comparisons</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-500 font-medium">#</th>
                          <th className="text-left py-2 text-gray-500 font-medium">Comparison</th>
                          <th className="text-right py-2 text-gray-500 font-medium">Searches</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.topComparisons.map((c, i) => (
                          <tr key={c.slug} className="border-b border-gray-50 last:border-0">
                            <td className="py-2 text-gray-400">{i + 1}</td>
                            <td className="py-2 text-gray-900">{c.title}</td>
                            <td className="py-2 text-right font-medium text-indigo-600">{c.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {report.topCategories.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Top Categories</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-500 font-medium">#</th>
                          <th className="text-left py-2 text-gray-500 font-medium">Category</th>
                          <th className="text-right py-2 text-gray-500 font-medium">Searches</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.topCategories.map((c, i) => (
                          <tr key={c.category} className="border-b border-gray-50 last:border-0">
                            <td className="py-2 text-gray-400">{i + 1}</td>
                            <td className="py-2 text-gray-900 capitalize">{c.category}</td>
                            <td className="py-2 text-right font-medium text-indigo-600">{c.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
          {!reportLoading && !report && (
            <div className="text-center py-12 text-gray-400">
              Failed to load weekly report. Try refreshing.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
