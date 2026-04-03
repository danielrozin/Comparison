"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

interface DailyCostSummary {
  date: string;
  dataforseo: { calls: number; costUsd: number };
  tavily: { calls: number; costUsd: number };
  anthropic: { calls: number; costUsd: number; inputTokens: number; outputTokens: number };
  totalCostUsd: number;
  comparisonsGenerated: number;
}

interface CostProjection {
  comparisonsPerDay: number;
  dailyCost: { dataforseo: number; tavily: number; anthropic: number; total: number };
  monthlyCost: { dataforseo: number; tavily: number; anthropic: number; total: number };
  costPerComparison: number;
}

interface RateLimitStatus {
  provider: string;
  endpoint: string;
  remaining: number | null;
  limit: number | null;
  percentUsed: number | null;
  timestamp: string;
}

interface QualityScore {
  slug: string;
  score: number;
  grade: string;
  timestamp: string;
}

interface ApiCallLog {
  id: string;
  provider: string;
  endpoint: string;
  costUsd: number;
  tokens?: { input: number; output: number };
  timestamp: string;
  source: string;
}

interface CostsData {
  daily: DailyCostSummary[];
  recentCalls: ApiCallLog[];
  rateLimits: RateLimitStatus[];
  rateLimitAlerts: Array<RateLimitStatus & { alert: string }>;
  projections: {
    at10: CostProjection;
    at25: CostProjection;
    at50: CostProjection;
    at100: CostProjection;
  };
  qualityScores: QualityScore[];
  customProjection: CostProjection | null;
}

interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  totalProcessed: number;
  avgDurationMs: number;
  lastProcessedAt: string | null;
}

const COLORS = ["#2563eb", "#f59e0b", "#8b5cf6", "#10b981"];
const GRADE_COLORS: Record<string, string> = { A: "#10b981", B: "#3b82f6", C: "#f59e0b", D: "#f97316", F: "#ef4444" };

export default function CostsPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<CostsData | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [customTarget, setCustomTarget] = useState(50);
  const [customProjection, setCustomProjection] = useState<CostProjection | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [costsRes, queueRes] = await Promise.all([
        fetch(`/api/pipeline/costs?target=${customTarget}`, {
          headers: { authorization: `Bearer ${token}` },
        }),
        fetch("/api/pipeline/queue", {
          headers: { authorization: `Bearer ${token}` },
        }),
      ]);
      if (costsRes.ok) {
        const costsData = await costsRes.json();
        setData(costsData);
        setCustomProjection(costsData.customProjection);
      }
      if (queueRes.ok) {
        setQueueStats(await queueRes.json());
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token, customTarget]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const recalculate = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/pipeline/costs?target=${customTarget}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const d = await res.json();
        setCustomProjection(d.customProjection);
      }
    } catch {
      // ignore
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <p className="text-text-secondary">
          Please log in from the <a href="/admin" className="text-primary-600 underline">admin panel</a> first.
        </p>
      </div>
    );
  }

  // Aggregate data for charts
  const dailyChartData = (data?.daily ?? []).map((d) => ({
    date: d.date.slice(5), // MM-DD
    DataForSEO: d.dataforseo.costUsd,
    Tavily: d.tavily.costUsd,
    Claude: d.anthropic.costUsd,
    Total: d.totalCostUsd,
  }));

  const totalSpent = (data?.daily ?? []).reduce((s, d) => s + d.totalCostUsd, 0);
  const totalCalls = (data?.daily ?? []).reduce(
    (s, d) => s + d.dataforseo.calls + d.tavily.calls + d.anthropic.calls,
    0
  );
  const avgDailyCost = dailyChartData.length > 0 ? totalSpent / dailyChartData.length : 0;

  // Quality score distribution
  const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  (data?.qualityScores ?? []).forEach((q) => {
    if (q.grade in gradeDistribution) gradeDistribution[q.grade as keyof typeof gradeDistribution]++;
  });
  const gradeChartData = Object.entries(gradeDistribution)
    .filter(([, v]) => v > 0)
    .map(([grade, count]) => ({ name: grade, value: count }));

  const avgQuality = (data?.qualityScores ?? []).length > 0
    ? Math.round((data?.qualityScores ?? []).reduce((s, q) => s + q.score, 0) / (data?.qualityScores ?? []).length)
    : 0;

  // Pipeline throughput (comparisons per day from daily data)
  const throughputData = (data?.daily ?? []).map((d) => ({
    date: d.date.slice(5),
    generated: d.comparisonsGenerated,
    apiCalls: d.dataforseo.calls + d.tavily.calls + d.anthropic.calls,
  }));

  // Projection comparison data
  const projections = data?.projections;
  const projectionCompare = projections ? [
    { target: "10/day", daily: projections.at10.dailyCost.total, monthly: projections.at10.monthlyCost.total, perComp: projections.at10.costPerComparison },
    { target: "25/day", daily: projections.at25.dailyCost.total, monthly: projections.at25.monthlyCost.total, perComp: projections.at25.costPerComparison },
    { target: "50/day", daily: projections.at50.dailyCost.total, monthly: projections.at50.monthlyCost.total, perComp: projections.at50.costPerComparison },
    { target: "100/day", daily: projections.at100.dailyCost.total, monthly: projections.at100.monthlyCost.total, perComp: projections.at100.costPerComparison },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text">API Costs & Pipeline Capacity</h1>
          <p className="text-text-secondary text-sm">Cost tracking, projections, and pipeline health</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin" className="px-4 py-2 bg-surface-alt text-text text-sm font-medium rounded-lg hover:bg-gray-200 border border-border">
            Back to Admin
          </a>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-primary-600">${totalSpent.toFixed(2)}</p>
          <p className="text-xs text-text-secondary mt-1">Total Spent (30d)</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-600">${avgDailyCost.toFixed(2)}</p>
          <p className="text-xs text-text-secondary mt-1">Avg Daily Cost</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-amber-600">{totalCalls.toLocaleString()}</p>
          <p className="text-xs text-text-secondary mt-1">API Calls (30d)</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-green-600">
            ${projections ? projections.at50.costPerComparison.toFixed(3) : "—"}
          </p>
          <p className="text-xs text-text-secondary mt-1">Cost / Comparison</p>
        </div>
      </div>

      {/* Daily cost chart */}
      <div className="bg-white border border-border rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-bold text-text">Daily API Costs (Last 30 Days)</h2>
        </div>
        <div className="p-5">
          {dailyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => `$${Number(v).toFixed(3)}`} />
                <Legend />
                <Area type="monotone" dataKey="DataForSEO" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Tavily" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Area type="monotone" dataKey="Claude" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-text-secondary text-sm py-10">No cost data yet. Costs are tracked as the pipeline runs.</p>
          )}
        </div>
      </div>

      {/* Cost Calculator + Quality Score side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cost Calculator */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-bold text-text">Cost Calculator</h2>
            <p className="text-xs text-text-secondary mt-0.5">Estimate costs at different throughput levels</p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-text">Comparisons/day:</label>
              <input
                type="number"
                value={customTarget}
                onChange={(e) => setCustomTarget(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 px-3 py-1.5 border border-border rounded-lg text-sm"
                min={1}
                max={1000}
              />
              <button
                onClick={recalculate}
                className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg hover:bg-primary-700"
              >
                Calculate
              </button>
            </div>

            {customProjection && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-alt rounded-lg p-3">
                    <p className="text-lg font-bold text-text">${customProjection.dailyCost.total}</p>
                    <p className="text-xs text-text-secondary">Daily Cost</p>
                  </div>
                  <div className="bg-surface-alt rounded-lg p-3">
                    <p className="text-lg font-bold text-text">${customProjection.monthlyCost.total}</p>
                    <p className="text-xs text-text-secondary">Monthly Cost</p>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-secondary text-xs">
                      <th className="text-left py-1">Provider</th>
                      <th className="text-right py-1">Daily</th>
                      <th className="text-right py-1">Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />DataForSEO
                      </td>
                      <td className="text-right py-1">${customProjection.dailyCost.dataforseo}</td>
                      <td className="text-right py-1">${customProjection.monthlyCost.dataforseo}</td>
                    </tr>
                    <tr>
                      <td className="py-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />Tavily
                      </td>
                      <td className="text-right py-1">${customProjection.dailyCost.tavily}</td>
                      <td className="text-right py-1">${customProjection.monthlyCost.tavily}</td>
                    </tr>
                    <tr>
                      <td className="py-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-600" />Claude
                      </td>
                      <td className="text-right py-1">${customProjection.dailyCost.anthropic}</td>
                      <td className="text-right py-1">${customProjection.monthlyCost.anthropic}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Projection comparison table */}
            {projectionCompare.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Scaling Projections</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-secondary text-xs">
                      <th className="text-left py-1">Target</th>
                      <th className="text-right py-1">Daily</th>
                      <th className="text-right py-1">Monthly</th>
                      <th className="text-right py-1">Per Comp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionCompare.map((p) => (
                      <tr key={p.target} className={p.target === "50/day" ? "bg-primary-50 font-semibold" : ""}>
                        <td className="py-1.5">{p.target}</td>
                        <td className="text-right py-1.5">${p.daily}</td>
                        <td className="text-right py-1.5">${p.monthly}</td>
                        <td className="text-right py-1.5">${p.perComp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quality Score Distribution */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-bold text-text">Content Quality Distribution</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Quality scores from content-quality.ts (avg: {avgQuality}/100)
            </p>
          </div>
          <div className="p-5">
            {gradeChartData.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={gradeChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {gradeChartData.map((entry) => (
                        <Cell key={entry.name} fill={GRADE_COLORS[entry.name] || "#6b7280"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {Object.entries(gradeDistribution).map(([grade, count]) => (
                    <div key={grade} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: GRADE_COLORS[grade] }} />
                      <span className="text-sm font-medium text-text">Grade {grade}:</span>
                      <span className="text-sm text-text-secondary">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-text-secondary text-sm py-10">No quality scores yet.</p>
            )}

            {/* Recent quality scores */}
            {(data?.qualityScores ?? []).length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50 max-h-[200px] overflow-y-auto">
                <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Recent Scores</p>
                {(data?.qualityScores ?? []).slice(0, 15).map((q) => (
                  <div key={`${q.slug}-${q.timestamp}`} className="flex items-center justify-between py-1">
                    <span className="text-xs text-text truncate max-w-[200px]">{q.slug}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-text-secondary">{q.score}/100</span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${GRADE_COLORS[q.grade]}20`, color: GRADE_COLORS[q.grade] }}
                      >
                        {q.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline throughput + Queue stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pipeline throughput */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-bold text-text">Pipeline Throughput</h2>
          </div>
          <div className="p-5">
            {throughputData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={throughputData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="generated" name="Comparisons" fill="#10b981" />
                  <Bar dataKey="apiCalls" name="API Calls" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-text-secondary text-sm py-10">No throughput data yet.</p>
            )}
          </div>
        </div>

        {/* Queue stats */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-bold text-text">Generation Queue</h2>
          </div>
          <div className="p-5">
            {queueStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-alt rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-blue-600">{queueStats.pending}</p>
                    <p className="text-xs text-text-secondary">Pending</p>
                  </div>
                  <div className="bg-surface-alt rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-amber-600">{queueStats.processing}</p>
                    <p className="text-xs text-text-secondary">Processing</p>
                  </div>
                  <div className="bg-surface-alt rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-green-600">{queueStats.completed}</p>
                    <p className="text-xs text-text-secondary">Completed</p>
                  </div>
                  <div className="bg-surface-alt rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-red-600">{queueStats.failed}</p>
                    <p className="text-xs text-text-secondary">Failed</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Total Processed</span>
                    <span className="font-medium text-text">{queueStats.totalProcessed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Avg Generation Time</span>
                    <span className="font-medium text-text">
                      {queueStats.avgDurationMs > 0 ? `${(queueStats.avgDurationMs / 1000).toFixed(1)}s` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Success Rate</span>
                    <span className="font-medium text-text">
                      {queueStats.totalProcessed > 0
                        ? `${Math.round((queueStats.completed / queueStats.totalProcessed) * 100)}%`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Last Processed</span>
                    <span className="font-medium text-text">
                      {queueStats.lastProcessedAt
                        ? new Date(queueStats.lastProcessedAt).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-text-secondary text-sm py-10">Loading queue stats...</p>
            )}
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white border border-border rounded-xl overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-bold text-text">API Rate Limit Status</h2>
          <p className="text-xs text-text-secondary mt-0.5">Alerts trigger when usage exceeds 80%</p>
        </div>
        <div className="p-5">
          {/* Alerts */}
          {(data?.rateLimitAlerts ?? []).length > 0 && (
            <div className="mb-4 space-y-2">
              {data!.rateLimitAlerts.slice(0, 5).map((alert, i) => (
                <div key={i} className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                  {alert.alert}
                  <span className="text-xs text-red-500 ml-2">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {(data?.rateLimits ?? []).length > 0 ? (
            <div className="space-y-3">
              {data!.rateLimits.map((rl, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-text w-40 truncate">{rl.provider}/{rl.endpoint}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          (rl.percentUsed ?? 0) >= 80 ? "bg-red-500" :
                          (rl.percentUsed ?? 0) >= 50 ? "bg-amber-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(rl.percentUsed ?? 0, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-text-secondary w-24 text-right">
                    {rl.remaining !== null ? `${rl.remaining}/${rl.limit}` : "N/A"}
                  </span>
                  <span className={`text-xs font-medium w-12 text-right ${
                    (rl.percentUsed ?? 0) >= 80 ? "text-red-600" : "text-text-secondary"
                  }`}>
                    {rl.percentUsed !== null ? `${rl.percentUsed}%` : "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-text-secondary text-sm py-6">
              No rate limit data yet. Limits are tracked as API calls are made.
            </p>
          )}
        </div>
      </div>

      {/* Recent API Calls */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-bold text-text">Recent API Calls</h2>
        </div>
        {(data?.recentCalls ?? []).length > 0 ? (
          <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
            {data!.recentCalls.map((call) => (
              <div key={call.id} className="px-5 py-2.5 hover:bg-surface-alt/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      call.provider === "dataforseo" ? "bg-blue-500" :
                      call.provider === "tavily" ? "bg-amber-500" :
                      "bg-purple-500"
                    }`} />
                    <span className="text-sm font-medium text-text">{call.provider}</span>
                    <span className="text-xs text-text-secondary">{call.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-text-secondary">${call.costUsd.toFixed(4)}</span>
                    {call.tokens && (
                      <span className="text-[10px] text-text-secondary">
                        {call.tokens.input}in / {call.tokens.output}out
                      </span>
                    )}
                    <span className="text-xs text-text-secondary">{new Date(call.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-text-secondary text-sm">
            No API calls logged yet. Calls are tracked as the pipeline runs.
          </div>
        )}
      </div>
    </div>
  );
}
