"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MetricPair {
  current: number;
  previous: number;
  change: string;
  trend: "up" | "down" | "flat";
}

interface FunnelStep {
  stage: string;
  value: number;
  rate: number;
}

interface DailyRow {
  date: string;
  day: string;
  searches: number;
  views: number;
  engagements: number;
}

interface TopComparison {
  slug: string;
  title: string;
  viewCount: number;
}

interface ReportData {
  weekNumber: number;
  year: number;
  period: { start: string; end: string };
  generatedAt: string;
  summary: Record<string, MetricPair>;
  content: {
    publishedComparisons: number;
    totalComparisons: number;
    entities: number;
    blogArticles: number;
    totalViewCount: number;
  };
  funnel: FunnelStep[];
  dailyBreakdown: DailyRow[];
  topComparisons: TopComparison[];
  topCategories: Array<{ category: string; count: number }>;
  revenue: {
    totalAffiliateClicks: number;
    affiliateClicksThisWeek: number;
    apiKeys: { active: number; total: number };
    apiRequestsThisWeek: number;
    embedPartners: { active: number; total: number };
  };
  engagement: {
    totalVotes: number;
    votesThisWeek: number;
    totalSubscribers: number;
    surveys: { total: number; thisWeek: number; avgRating: number };
    npsScore: number;
    comparisonRequestsThisWeek: number;
  };
  markdown: string;
}

function TrendBadge({ change, trend }: { change: string; trend: "up" | "down" | "flat" }) {
  const color = trend === "up" ? "text-emerald-600 bg-emerald-50" : trend === "down" ? "text-red-600 bg-red-50" : "text-gray-500 bg-gray-100";
  const arrow = trend === "up" ? "\u2191" : trend === "down" ? "\u2193" : "\u2192";
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${color}`}>
      {arrow} {change}
    </span>
  );
}

function MetricCard({ label, current, previous, change, trend }: { label: string } & MetricPair) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <p className="text-2xl font-bold text-gray-900">{current.toLocaleString()}</p>
        <TrendBadge change={change} trend={trend} />
      </div>
      <p className="text-xs text-gray-400 mt-0.5">prev: {previous.toLocaleString()}</p>
    </div>
  );
}

function FunnelBar({ step, maxValue }: { step: FunnelStep; maxValue: number }) {
  const pct = maxValue > 0 ? Math.max((step.value / maxValue) * 100, 2) : 2;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-32 text-sm text-gray-700 font-medium">{step.stage}</div>
      <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
        <div
          className="bg-indigo-500 rounded-full h-6 transition-all duration-500 flex items-center justify-end pr-2"
          style={{ width: `${pct}%`, minWidth: "40px" }}
        >
          <span className="text-[10px] font-bold text-white">{step.value}</span>
        </div>
      </div>
      <div className="w-16 text-right text-xs text-gray-500">{step.rate}%</div>
    </div>
  );
}

function MiniBar({ values, max }: { values: number[]; max: number }) {
  return (
    <div className="flex items-end gap-px h-8">
      {values.map((v, i) => (
        <div
          key={i}
          className="bg-indigo-400 rounded-sm w-3 transition-all"
          style={{ height: `${max > 0 ? Math.max((v / max) * 100, 4) : 4}%` }}
        />
      ))}
    </div>
  );
}

export default function WeeklyReportPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMarkdown, setShowMarkdown] = useState(false);

  useEffect(() => {
    fetch("/api/analytics/weekly-report")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Generating weekly report...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">Failed to generate report</p>
      </div>
    );
  }

  const summaryLabels: Record<string, string> = {
    searches: "Searches",
    views: "Page Views",
    engagements: "Engagements",
    affiliateClicks: "Affiliate Clicks",
    subscribers: "New Subscribers",
    newComparisons: "New Comparisons",
  };

  const maxFunnel = Math.max(...data.funnel.map((f) => f.value), 1);
  const dailyViewValues = data.dailyBreakdown.map((d) => d.views);
  const maxDaily = Math.max(...dailyViewValues, 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/admin/analytics" className="text-gray-400 hover:text-gray-600 text-sm">&larr; Analytics</Link>
                <span className="text-gray-300">|</span>
                <Link href="/admin/analytics/aarrr" className="text-gray-400 hover:text-gray-600 text-sm">AARRR</Link>
                <span className="text-gray-300">|</span>
                <Link href="/admin/analytics/okr" className="text-gray-400 hover:text-gray-600 text-sm">OKR</Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                Weekly Report W{data.weekNumber}
              </h1>
              <p className="text-sm text-gray-500">
                {data.period.start} to {data.period.end}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMarkdown(!showMarkdown)}
                className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {showMarkdown ? "Dashboard" : "Markdown"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(data.markdown);
                }}
                className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Copy Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showMarkdown ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
              {data.markdown}
            </pre>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Week-over-Week Summary</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {Object.entries(data.summary).map(([key, metric]) => (
                  <MetricCard key={key} label={summaryLabels[key] || key} {...metric} />
                ))}
              </div>
            </section>

            {/* Daily Activity + Funnel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Daily Activity (7d)</h3>
                <div className="space-y-2">
                  {data.dailyBreakdown.map((d) => (
                    <div key={d.date} className="flex items-center gap-3 text-xs">
                      <span className="w-8 text-gray-500 font-medium">{d.day}</span>
                      <div className="flex-1 flex gap-1">
                        <div className="bg-indigo-400 h-4 rounded" style={{ width: `${maxDaily > 0 ? Math.max((d.searches / maxDaily) * 100, 2) : 2}%` }} title={`${d.searches} searches`} />
                        <div className="bg-violet-400 h-4 rounded" style={{ width: `${maxDaily > 0 ? Math.max((d.views / maxDaily) * 100, 2) : 2}%` }} title={`${d.views} views`} />
                        <div className="bg-emerald-400 h-4 rounded" style={{ width: `${maxDaily > 0 ? Math.max((d.engagements / maxDaily) * 100, 2) : 2}%` }} title={`${d.engagements} engagements`} />
                      </div>
                      <span className="w-12 text-right text-gray-400">{d.searches + d.views + d.engagements}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-400 rounded" />Searches</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-violet-400 rounded" />Views</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded" />Engagements</span>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Conversion Funnel</h3>
                {data.funnel.map((step) => (
                  <FunnelBar key={step.stage} step={step} maxValue={maxFunnel} />
                ))}
              </section>
            </div>

            {/* Top Pages + Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Top 10 Pages by Views</h3>
                <div className="space-y-1.5">
                  {data.topComparisons.length === 0 ? (
                    <p className="text-xs text-gray-400">No published comparisons yet</p>
                  ) : (
                    data.topComparisons.map((c, i) => (
                      <div key={c.slug} className="flex items-center gap-2 text-xs">
                        <span className="w-5 text-gray-400 font-medium">{i + 1}.</span>
                        <span className="flex-1 text-gray-700 truncate">{c.title || c.slug}</span>
                        <span className="text-gray-500 font-medium">{c.viewCount}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Top Categories</h3>
                <div className="space-y-1.5">
                  {data.topCategories.length === 0 ? (
                    <p className="text-xs text-gray-400">No categories yet</p>
                  ) : (
                    data.topCategories.map((c) => (
                      <div key={c.category} className="flex items-center gap-2 text-xs">
                        <span className="flex-1 text-gray-700">{c.category}</span>
                        <span className="text-gray-500 font-medium">{c.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Revenue + Engagement */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Revenue & Monetization</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Affiliate Clicks (7d)</p>
                    <p className="text-xl font-bold text-gray-900">{data.revenue.affiliateClicksThisWeek}</p>
                    <p className="text-[10px] text-gray-400">{data.revenue.totalAffiliateClicks} all-time</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">API Requests (7d)</p>
                    <p className="text-xl font-bold text-gray-900">{data.revenue.apiRequestsThisWeek}</p>
                    <p className="text-[10px] text-gray-400">{data.revenue.apiKeys.active}/{data.revenue.apiKeys.total} active keys</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Embed Partners</p>
                    <p className="text-xl font-bold text-gray-900">{data.revenue.embedPartners.active}</p>
                    <p className="text-[10px] text-gray-400">{data.revenue.embedPartners.total} total</p>
                  </div>
                </div>
              </section>

              <section className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Engagement & Satisfaction</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Votes (7d)</p>
                    <p className="text-xl font-bold text-gray-900">{data.engagement.votesThisWeek}</p>
                    <p className="text-[10px] text-gray-400">{data.engagement.totalVotes} all-time</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">NPS Score</p>
                    <p className="text-xl font-bold text-gray-900">{data.engagement.npsScore}</p>
                    <p className="text-[10px] text-gray-400">Target: 50+</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Subscribers</p>
                    <p className="text-xl font-bold text-gray-900">{data.engagement.totalSubscribers}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Surveys (avg rating)</p>
                    <p className="text-xl font-bold text-gray-900">{data.engagement.surveys.avgRating}/5</p>
                    <p className="text-[10px] text-gray-400">{data.engagement.surveys.total} responses</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Content Inventory */}
            <section className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Content Inventory</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: "Published Comparisons", value: data.content.publishedComparisons },
                  { label: "Total Comparisons", value: data.content.totalComparisons },
                  { label: "Entities", value: data.content.entities },
                  { label: "Blog Articles", value: data.content.blogArticles },
                  { label: "Total Views", value: data.content.totalViewCount },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
