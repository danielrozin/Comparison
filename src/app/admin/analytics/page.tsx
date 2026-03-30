"use client";

import { useState, useEffect } from "react";

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
}

function StatCard({ label, value, subtitle }: { label: string; value: string; subtitle?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [config, setConfig] = useState<AnalyticsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "funnel" | "events" | "reporting">("overview");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "funnel", label: "Conversion Funnel" },
    { key: "events", label: "Custom Events" },
    { key: "reporting", label: "Reporting" },
  ] as const;

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
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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
          {/* North Star */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-2xl p-6">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-1">North Star Metric</p>
            <h2 className="text-xl font-bold text-gray-900">{config.kpis.northStar.metric}</h2>
            <p className="text-sm text-gray-600 mt-1">{config.kpis.northStar.description}</p>
            <p className="text-sm text-gray-400 mt-2">Target: {config.kpis.northStar.target}</p>
          </div>

          {/* Core KPIs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Core KPIs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {config.kpis.core.map((kpi) => (
                <StatCard
                  key={kpi.metric}
                  label={kpi.metric}
                  value={kpi.target || "Collecting..."}
                  subtitle={kpi.source}
                />
              ))}
            </div>
          </div>

          {/* Engagement KPIs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement KPIs</h3>
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

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`https://analytics.google.com/analytics/web/#/p${config.ga4Property.replace("G-", "")}/reports`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-lg">G</div>
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
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 text-lg">C</div>
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
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 text-lg">S</div>
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
          <div className="space-y-3">
            {config.funnel.steps.map((step, i) => (
              <div key={step.step} className="flex items-stretch gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
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
                        className="h-2 bg-primary-400 rounded-full transition-all"
                        style={{ width: `${100 - i * 20}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-12 text-right">
                      {100 - i * 20}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Note: Conversion percentages are placeholders. Actual data will populate after 7 days of collection.
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

      {/* Reporting Tab */}
      {activeTab === "reporting" && (
        <div className="space-y-6">
          {Object.entries(config.reporting).map(([key, report]) => (
            <div key={key} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  key === "weekly" ? "bg-blue-50 text-blue-700" :
                  key === "monthly" ? "bg-purple-50 text-purple-700" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <h3 className="font-semibold text-gray-900">{report.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Audience: {report.audience.join(", ")}
              </p>
              <ul className="space-y-1.5">
                {report.sections.map((section, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-gray-300 shrink-0 mt-0.5">-</span>
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
