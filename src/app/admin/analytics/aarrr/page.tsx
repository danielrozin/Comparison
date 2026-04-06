"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
  FunnelChart, Funnel, LabelList,
} from "recharts";

interface AARRRData {
  generatedAt: string;
  period: { start: string; end: string };
  northStar: {
    metric: string;
    value: number;
    totalWeeklyViews: number;
    returningUserProxy: number;
    trend: string;
  };
  acquisition: {
    totalSearches7d: number;
    totalViews7d: number;
    searchToViewRate: number;
    totalComparisons: number;
    publishedComparisons: number;
    totalViewCount: number;
    comparisonsThisWeek: number;
    comparisonsPrevWeek: number;
    contentGrowth: string;
    sourceDistribution: Array<{ source: string; count: number }>;
    categoryDistribution: Array<{ category: string; count: number }>;
  };
  activation: {
    searchToViewRate: number;
    comparisonRequests: number;
    comparisonRequestsThisWeek: number;
    surveysCompleted: number;
    surveysThisWeek: number;
    avgSurveyRating: number;
  };
  retention: {
    uniqueVoteSessions: number;
    uniqueVoteSessionsThisWeek: number;
    totalVotes: number;
    votesThisWeek: number;
    votesPrevWeek: number;
    votesTrend: string;
    subscribersThisWeek: number;
    subscribersPrevWeek: number;
    subscribersTrend: string;
    viewToEngageRate: number;
  };
  revenue: {
    totalAffiliateClicks: number;
    affiliateClicksThisWeek: number;
    affiliateClicksPrevWeek: number;
    affiliateTrend: string;
    affiliateClicksByNetwork: Array<{ network: string; count: number }>;
    totalApiKeys: number;
    activeApiKeys: number;
    apiKeysByTier: Array<{ tier: string; count: number }>;
    totalEmbedPartners: number;
    activeEmbedPartners: number;
    embedPartnersByTier: Array<{ tier: string; count: number }>;
    totalApiRequests: number;
    apiRequestsThisWeek: number;
    engageToConvertRate: number;
  };
  referral: {
    npsScore: number;
    npsPromoters: number;
    npsPassives: number;
    npsDetractors: number;
    syndicatedContent: number;
    syndicatedReferralClicks: number;
    shares7d: number;
    totalSubscribers: number;
    subscribersBySource: Array<{ source: string; count: number }>;
  };
  engagement: {
    totalVotes: number;
    votesThisWeek: number;
    totalSubscribers: number;
    subscribersThisWeek: number;
    totalBlogArticles: number;
    totalEntities: number;
    viewToEngageRate: number;
    engageToConvertRate: number;
    searches7d: number;
    signups7d: number;
  };
  funnel: Array<{ stage: string; label: string; value: number; color: string }>;
  dailyBreakdown: Array<{
    date: string;
    label: string;
    searches: number;
    views: number;
    engagements: number;
    affiliateClicks: number;
    shares: number;
    signups: number;
  }>;
}

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#818cf8", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];
const FUNNEL_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#10b981", "#f59e0b"];

function StatCard({ label, value, subtitle, trend, size = "normal" }: {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  size?: "normal" | "large";
}) {
  const isPositive = trend?.startsWith("+") && trend !== "+0%";
  const isNegative = trend?.startsWith("-");
  return (
    <div className={`bg-white border border-gray-200 rounded-xl ${size === "large" ? "p-6" : "p-4"}`}>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <p className={`font-bold text-gray-900 ${size === "large" ? "text-3xl" : "text-2xl"}`}>{value}</p>
        {trend && (
          <span className={`text-xs font-medium mb-1 ${isPositive ? "text-emerald-600" : isNegative ? "text-red-500" : "text-gray-400"}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function SectionHeader({ letter, title, color, description }: {
  letter: string;
  title: string;
  color: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg ${color}`}>
        {letter}
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function ProgressBar({ value, max, label, color = "bg-indigo-500" }: { value: number; max: number; label: string; color?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className={`${color} rounded-full h-2 transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AARRRDashboard() {
  const [data, setData] = useState<AARRRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"overview" | "acquisition" | "activation" | "retention" | "revenue" | "referral" | "engagement">("overview");

  useEffect(() => {
    fetch("/api/analytics/aarrr")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-5 gap-4 mt-6">
            {[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl mt-6" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-red-500">Failed to load AARRR metrics.</p>
      </div>
    );
  }

  const sections = [
    { key: "overview" as const, label: "Overview" },
    { key: "acquisition" as const, label: "Acquisition" },
    { key: "activation" as const, label: "Activation" },
    { key: "retention" as const, label: "Retention" },
    { key: "revenue" as const, label: "Revenue" },
    { key: "referral" as const, label: "Referral" },
    { key: "engagement" as const, label: "Engagement" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">AARRR Pirate Metrics</h1>
          <span className="text-2xl">&#x1F3F4;&#x200D;&#x2620;&#xFE0F;</span>
        </div>
        <p className="text-gray-500 mt-1">AversusB — Acquisition, Activation, Retention, Revenue, Referral</p>
        <p className="text-xs text-gray-400 mt-1">
          Period: {data.period.start} to {data.period.end} | Generated: {new Date(data.generatedAt).toLocaleString()}
        </p>
      </div>

      {/* North Star Metric */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 text-white">
        <p className="text-sm font-medium text-indigo-100 uppercase tracking-wider">North Star Metric</p>
        <p className="text-3xl font-bold mt-1">{data.northStar.totalWeeklyViews.toLocaleString()}</p>
        <p className="text-indigo-100 mt-1">{data.northStar.metric}</p>
        <div className="flex gap-6 mt-3 text-sm">
          <div>
            <span className="text-indigo-200">Returning users (proxy):</span>{" "}
            <span className="font-semibold">{data.northStar.returningUserProxy}</span>
          </div>
          <div>
            <span className="text-indigo-200">WoW trend:</span>{" "}
            <span className="font-semibold">{data.northStar.trend}</span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit flex-wrap">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === s.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeSection === "overview" && (
        <div className="space-y-8">
          {/* AARRR Funnel */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AARRR Funnel (7-day)</h3>
            {data.funnel.some((f) => f.value > 0) ? (
              <div className="grid grid-cols-5 gap-3">
                {data.funnel.map((f, i) => {
                  const maxVal = Math.max(...data.funnel.map((x) => x.value), 1);
                  const heightPct = Math.max((f.value / maxVal) * 100, 10);
                  return (
                    <div key={f.stage} className="text-center">
                      <div className="h-40 flex items-end justify-center mb-2">
                        <div
                          className="w-full max-w-[80px] rounded-t-lg transition-all"
                          style={{
                            height: `${heightPct}%`,
                            backgroundColor: FUNNEL_COLORS[i],
                          }}
                        />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{f.value.toLocaleString()}</p>
                      <p className="text-xs font-medium text-gray-500 mt-1">{f.label}</p>
                      <p className="text-xs text-gray-400">{f.stage}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                No funnel data yet. Events will appear as users interact.
              </div>
            )}
          </div>

          {/* Conversion rates between stages */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Search -> View" value={`${data.acquisition.searchToViewRate}%`} subtitle="Activation rate" />
            <StatCard label="View -> Engage" value={`${data.retention.viewToEngageRate}%`} subtitle="Retention signal" />
            <StatCard label="Engage -> Convert" value={`${data.revenue.engageToConvertRate}%`} subtitle="Revenue conversion" />
            <StatCard label="Shares + Signups" value={data.referral.shares7d + data.engagement.signups7d} subtitle="Referral signals (7d)" />
          </div>

          {/* 30-day trend */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Activity Trend</h3>
            {data.dailyBreakdown.some((d) => d.searches + d.views + d.engagements > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="searches" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Searches" />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Views" />
                  <Area type="monotone" dataKey="engagements" stackId="1" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.6} name="Engagements" />
                  <Area type="monotone" dataKey="affiliateClicks" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Affiliate Clicks" />
                  <Area type="monotone" dataKey="shares" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Shares" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                No activity data yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ACQUISITION */}
      {activeSection === "acquisition" && (
        <div className="space-y-6">
          <SectionHeader letter="A" title="Acquisition" color="bg-indigo-500" description="How users find AversusB" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Searches (7d)" value={data.acquisition.totalSearches7d} />
            <StatCard label="Views (7d)" value={data.acquisition.totalViews7d} />
            <StatCard label="Search->View Rate" value={`${data.acquisition.searchToViewRate}%`} subtitle="Target: >60%" />
            <StatCard label="Total Page Views" value={data.acquisition.totalViewCount.toLocaleString()} subtitle="All-time" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Comparisons" value={data.acquisition.totalComparisons} />
            <StatCard label="Published" value={data.acquisition.publishedComparisons} />
            <StatCard label="New This Week" value={data.acquisition.comparisonsThisWeek} trend={data.acquisition.contentGrowth} />
            <StatCard label="Prev Week" value={data.acquisition.comparisonsPrevWeek} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Source Distribution</h3>
              {data.acquisition.sourceDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.acquisition.sourceDistribution}
                      dataKey="count"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }: { name?: string; percent?: number }) =>
                        `${name || ""} (${((percent || 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {data.acquisition.sourceDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">No source data yet.</div>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
              {data.acquisition.categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.acquisition.categoryDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">No category data yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVATION */}
      {activeSection === "activation" && (
        <div className="space-y-6">
          <SectionHeader letter="A" title="Activation" color="bg-violet-500" description="Users reaching the aha moment" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Search->View Rate" value={`${data.activation.searchToViewRate}%`} subtitle="Time to Value proxy" size="large" />
            <StatCard label="Surveys Completed" value={data.activation.surveysCompleted} subtitle={`${data.activation.surveysThisWeek} this week`} />
            <StatCard label="Avg Survey Rating" value={`${data.activation.avgSurveyRating}/5`} subtitle="User satisfaction" />
            <StatCard label="Comparison Requests" value={data.activation.comparisonRequests} subtitle={`${data.activation.comparisonRequestsThisWeek} this week`} />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activation Funnel</h3>
            <div className="space-y-2">
              <ProgressBar label="Search (Discovery)" value={data.acquisition.totalSearches7d} max={data.acquisition.totalSearches7d || 1} color="bg-indigo-500" />
              <ProgressBar label="View Comparison (Aha Moment)" value={data.acquisition.totalViews7d} max={data.acquisition.totalSearches7d || 1} color="bg-violet-500" />
              <ProgressBar label="Engage (Vote/Comment)" value={data.retention.votesThisWeek} max={data.acquisition.totalSearches7d || 1} color="bg-purple-500" />
              <ProgressBar label="Request Comparison" value={data.activation.comparisonRequestsThisWeek} max={data.acquisition.totalSearches7d || 1} color="bg-fuchsia-500" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong>Time to Value</strong> represents how quickly users find a useful comparison after arriving.
              The Search-to-View rate ({data.activation.searchToViewRate}%) indicates what percentage of searches result in viewing a comparison.
              Target: &gt;60%.
            </p>
          </div>
        </div>
      )}

      {/* RETENTION */}
      {activeSection === "retention" && (
        <div className="space-y-6">
          <SectionHeader letter="R" title="Retention" color="bg-purple-500" description="Users coming back" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Unique Voting Sessions" value={data.retention.uniqueVoteSessions} subtitle="All-time returning signal" size="large" />
            <StatCard label="This Week" value={data.retention.uniqueVoteSessionsThisWeek} subtitle="Active voting sessions" />
            <StatCard label="Votes (7d)" value={data.retention.votesThisWeek} trend={data.retention.votesTrend} />
            <StatCard label="View->Engage Rate" value={`${data.retention.viewToEngageRate}%`} subtitle="Target: >5%" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Newsletter Subs (7d)" value={data.retention.subscribersThisWeek} trend={data.retention.subscribersTrend} />
            <StatCard label="Newsletter Subs (Prev)" value={data.retention.subscribersPrevWeek} />
            <StatCard label="Total Votes" value={data.retention.totalVotes} subtitle="Lifetime engagement" />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trend (30d)</h3>
            {data.dailyBreakdown.some((d) => d.engagements > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="engagements" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.6} name="Engagements" />
                  <Area type="monotone" dataKey="signups" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} name="Signups" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                No engagement data yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* REVENUE */}
      {activeSection === "revenue" && (
        <div className="space-y-6">
          <SectionHeader letter="R" title="Revenue" color="bg-emerald-500" description="Monetization performance" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Affiliate Clicks (7d)" value={data.revenue.affiliateClicksThisWeek} trend={data.revenue.affiliateTrend} size="large" />
            <StatCard label="Total Affiliate Clicks" value={data.revenue.totalAffiliateClicks} subtitle="All-time" />
            <StatCard label="Engage->Convert Rate" value={`${data.revenue.engageToConvertRate}%`} subtitle="Target: >1%" />
            <StatCard label="API Requests (7d)" value={data.revenue.apiRequestsThisWeek} subtitle={`${data.revenue.totalApiRequests.toLocaleString()} total`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* API Keys */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">API Keys</h4>
              <p className="text-2xl font-bold text-gray-900">{data.revenue.activeApiKeys} <span className="text-sm text-gray-400">/ {data.revenue.totalApiKeys}</span></p>
              <p className="text-xs text-gray-500 mb-2">active / total</p>
              {data.revenue.apiKeysByTier.map((t) => (
                <div key={t.tier} className="flex justify-between text-sm py-1 border-t border-gray-100">
                  <span className="capitalize text-gray-600">{t.tier}</span>
                  <span className="font-medium">{t.count}</span>
                </div>
              ))}
            </div>

            {/* Embed Partners */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Embed Partners</h4>
              <p className="text-2xl font-bold text-gray-900">{data.revenue.activeEmbedPartners} <span className="text-sm text-gray-400">/ {data.revenue.totalEmbedPartners}</span></p>
              <p className="text-xs text-gray-500 mb-2">active / total</p>
              {data.revenue.embedPartnersByTier.map((t) => (
                <div key={t.tier} className="flex justify-between text-sm py-1 border-t border-gray-100">
                  <span className="capitalize text-gray-600">{t.tier}</span>
                  <span className="font-medium">{t.count}</span>
                </div>
              ))}
            </div>

            {/* Affiliate Networks */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Clicks by Network</h4>
              {data.revenue.affiliateClicksByNetwork.length > 0 ? (
                data.revenue.affiliateClicksByNetwork.map((n) => (
                  <div key={n.network} className="flex justify-between text-sm py-1 border-t border-gray-100">
                    <span className="text-gray-600">{n.network}</span>
                    <span className="font-medium">{n.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">No affiliate data yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Affiliate Clicks Trend (30d)</h3>
            {data.dailyBreakdown.some((d) => d.affiliateClicks > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="affiliateClicks" fill="#10b981" radius={[4, 4, 0, 0]} name="Affiliate Clicks" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                No affiliate click data yet.
              </div>
            )}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm text-emerald-800">
              <strong>Revenue Streams:</strong> Affiliate commissions (product CTAs), API subscriptions (developer tier),
              Embed partnerships (white-label widgets). MRR/ARPA/CLV tracking requires Stripe integration data.
            </p>
          </div>
        </div>
      )}

      {/* REFERRAL */}
      {activeSection === "referral" && (
        <div className="space-y-6">
          <SectionHeader letter="R" title="Referral" color="bg-amber-500" description="Users bringing other users" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">NPS Score</p>
              <p className={`text-3xl font-bold mt-1 ${data.referral.npsScore >= 50 ? "text-emerald-600" : data.referral.npsScore >= 0 ? "text-amber-600" : "text-red-600"}`}>
                {data.referral.npsScore}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {data.referral.npsScore >= 50 ? "Excellent" : data.referral.npsScore >= 0 ? "Good" : "Needs improvement"}
              </p>
            </div>
            <StatCard label="Shares (7d)" value={data.referral.shares7d} subtitle="Content shared" />
            <StatCard label="Syndicated Articles" value={data.referral.syndicatedContent} subtitle={`${data.referral.syndicatedReferralClicks} referral clicks`} />
            <StatCard label="Total Subscribers" value={data.referral.totalSubscribers} subtitle="Newsletter reach" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* NPS Breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NPS Breakdown</h3>
              {(data.referral.npsPromoters + data.referral.npsPassives + data.referral.npsDetractors) > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Promoters (4-5)", value: data.referral.npsPromoters },
                        { name: "Passives (3)", value: data.referral.npsPassives },
                        { name: "Detractors (1-2)", value: data.referral.npsDetractors },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">No survey data yet.</div>
              )}
            </div>

            {/* Subscriber Sources */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Sources</h3>
              {data.referral.subscribersBySource.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.referral.subscribersBySource}
                      dataKey="count"
                      nameKey="source"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label={({ name, percent }: { name?: string; percent?: number }) =>
                        `${name || ""} (${((percent || 0) * 100).toFixed(0)}%)`
                      }
                    >
                      {data.referral.subscribersBySource.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400">No subscriber data yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ENGAGEMENT */}
      {activeSection === "engagement" && (
        <div className="space-y-6">
          <SectionHeader letter="E" title="Engagement" color="bg-pink-500" description="DAU/MAU, stickiness, feature usage" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Votes" value={data.engagement.totalVotes.toLocaleString()} subtitle={`${data.engagement.votesThisWeek} this week`} />
            <StatCard label="Total Subscribers" value={data.engagement.totalSubscribers} subtitle={`${data.engagement.subscribersThisWeek} this week`} />
            <StatCard label="Blog Articles" value={data.engagement.totalBlogArticles} />
            <StatCard label="Entities Tracked" value={data.engagement.totalEntities} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="View->Engage Rate" value={`${data.engagement.viewToEngageRate}%`} subtitle="Stickiness proxy | Target: >5%" />
            <StatCard label="Engage->Convert" value={`${data.engagement.engageToConvertRate}%`} subtitle="Feature monetization" />
            <StatCard label="Searches (7d)" value={data.engagement.searches7d} subtitle="Feature usage: search" />
            <StatCard label="Signups (7d)" value={data.engagement.signups7d} subtitle="Feature usage: newsletter" />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage Trend (30d)</h3>
            {data.dailyBreakdown.some((d) => d.searches + d.views + d.engagements > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.dailyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="searches" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} name="Searches" />
                  <Area type="monotone" dataKey="views" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} name="Views" />
                  <Area type="monotone" dataKey="engagements" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.5} name="Votes/Comments" />
                  <Area type="monotone" dataKey="signups" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} name="Signups" />
                  <Area type="monotone" dataKey="shares" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} name="Shares" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400">
                No feature usage data yet.
              </div>
            )}
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
            <p className="text-sm text-pink-800">
              <strong>DAU/MAU & Stickiness:</strong> Full DAU/MAU tracking requires GA4 Data API integration or PostHog.
              Current proxy metrics use session-based voting data and Redis event counts.
              Session Length requires client-side time-on-page tracking.
            </p>
          </div>
        </div>
      )}

      {/* Back to Analytics link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <a href="/admin/analytics" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          &larr; Back to Analytics Dashboard
        </a>
      </div>
    </div>
  );
}
