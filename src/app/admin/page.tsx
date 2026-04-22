"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

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

interface PipelineRun {
  id: string;
  mode: string;
  startedAt: string;
  completedAt: string | null;
  discovered: number;
  generated: number;
  errors: string[];
}

interface PipelineStatus {
  lastRun: PipelineRun | null;
  totalDiscovered: number;
  totalGenerated: number;
  recentRuns: PipelineRun[];
}

interface PipelineOpportunity {
  keyword: string;
  searchVolume: number;
  cpc: number;
  difficulty: number;
  entityA: string | null;
  entityB: string | null;
  opportunityScore: number;
  source: string;
}

interface OutreachQuestion {
  id: string;
  platform: "reddit" | "quora";
  title: string;
  url: string;
  subreddit?: string;
  category?: string;
  upvotes?: number;
  comments?: number;
  createdAt: string;
  entityA: string | null;
  entityB: string | null;
  matchingComparisonSlug: string | null;
  matchingComparisonUrl: string | null;
}

interface OutreachAnswer {
  questionId: string;
  question: OutreachQuestion;
  answer: string;
  comparisonUrl: string;
  shortSummary: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
  const [pipelineOpps, setPipelineOpps] = useState<PipelineOpportunity[]>([]);
  const [pipelineLoading, setPipelineLoading] = useState(false);
  const [pipelineMessage, setPipelineMessage] = useState("");
  // Outreach state
  const [outreachQuestions, setOutreachQuestions] = useState<OutreachQuestion[]>([]);
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [outreachStats, setOutreachStats] = useState<{ total: number; withMatches: number } | null>(null);
  const [outreachAnswers, setOutreachAnswers] = useState<Record<string, OutreachAnswer>>({});
  const [generatingAnswerId, setGeneratingAnswerId] = useState<string | null>(null);
  const [outreachPlatform, setOutreachPlatform] = useState<string>("all");
  const [savedQuestionIds, setSavedQuestionIds] = useState<Set<string>>(new Set());
  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null);

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

  const fetchPipelineData = useCallback(async () => {
    if (!token) return;
    try {
      const [statusRes, oppsRes] = await Promise.all([
        fetch("/api/pipeline/status", { headers: { authorization: `Bearer ${token}` } }),
        fetch("/api/pipeline/opportunities?limit=20", { headers: { authorization: `Bearer ${token}` } }),
      ]);
      if (statusRes.ok) setPipelineStatus(await statusRes.json());
      if (oppsRes.ok) {
        const oppsData = await oppsRes.json();
        setPipelineOpps(oppsData.opportunities || []);
      }
    } catch {
      // ignore
    }
  }, [token]);

  const triggerPipeline = async (mode: "discover" | "generate" | "full") => {
    if (!token) return;
    setPipelineLoading(true);
    setPipelineMessage("");
    try {
      const res = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ mode, category: "technology", limit: 5 }),
      });
      const result = await res.json();
      if (result.success) {
        setPipelineMessage(`${mode}: ${result.discovered} discovered, ${result.generated} generated (${result.duration})`);
        fetchPipelineData();
      } else {
        setPipelineMessage(`Error: ${result.error || "Failed"}`);
      }
    } catch {
      setPipelineMessage("Connection error");
    }
    setPipelineLoading(false);
  };

  const findOutreachQuestions = async () => {
    if (!token) return;
    setOutreachLoading(true);
    try {
      const res = await fetch(`/api/outreach/questions?platform=${outreachPlatform}&limit=30`, {
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        setOutreachQuestions(result.questions || []);
        setOutreachStats({ total: result.stats?.total || 0, withMatches: result.stats?.withMatches || 0 });
      }
    } catch {
      // ignore
    }
    setOutreachLoading(false);
  };

  const generateAnswer = async (question: OutreachQuestion) => {
    if (!token) return;
    setGeneratingAnswerId(question.id);
    try {
      const res = await fetch("/api/outreach/answers", {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: [question.id], limit: 1 }),
      });
      if (res.ok) {
        const result = await res.json();
        if (result.answers && result.answers.length > 0) {
          setOutreachAnswers((prev) => ({ ...prev, [question.id]: result.answers[0] }));
        }
      }
    } catch {
      // ignore
    }
    setGeneratingAnswerId(null);
  };

  const saveAnswerToQueue = async (answer: OutreachAnswer) => {
    if (!token) return;
    setSavingQuestionId(answer.questionId);
    try {
      const q = answer.question;
      const res = await fetch("/api/outreach/queue", {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: q.platform,
          questionUrl: q.url,
          questionTitle: q.title,
          subreddit: q.subreddit,
          category: q.category ?? null,
          entityA: q.entityA,
          entityB: q.entityB,
          comparisonSlug: q.matchingComparisonSlug,
          comparisonUrl: answer.comparisonUrl,
          answer: answer.answer,
        }),
      });
      if (res.ok) {
        setSavedQuestionIds((prev) => new Set(prev).add(answer.questionId));
      }
    } catch {
      // ignore
    }
    setSavingQuestionId(null);
  };

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
    if (isLoggedIn && token) {
      fetchData();
      fetchPipelineData();
    }
  }, [isLoggedIn, token, fetchData, fetchPipelineData]);

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

          {/* Quick Links */}
          <div className="flex gap-3 mb-8">
            <Link
              href="/admin/requests"
              className="px-4 py-3 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all flex items-center gap-3"
            >
              <span className="text-xl">💡</span>
              <div>
                <p className="text-sm font-semibold text-text">Comparison Requests</p>
                <p className="text-xs text-text-secondary">Moderate user submissions</p>
              </div>
            </Link>
            <Link
              href="/admin/analytics"
              className="px-4 py-3 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all flex items-center gap-3"
            >
              <span className="text-xl">📊</span>
              <div>
                <p className="text-sm font-semibold text-text">Analytics</p>
                <p className="text-xs text-text-secondary">View detailed analytics</p>
              </div>
            </Link>
            <Link
              href="/admin/outreach"
              className="px-4 py-3 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all flex items-center gap-3"
            >
              <span className="text-xl">🔗</span>
              <div>
                <p className="text-sm font-semibold text-text">Outreach Queue</p>
                <p className="text-xs text-text-secondary">Quora &amp; Reddit posting workflow</p>
              </div>
            </Link>
          </div>

          {/* Content Pipeline */}
          <div className="bg-white border border-border rounded-xl overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-bold text-text">Content Pipeline</h2>
                {pipelineStatus?.lastRun && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    Last run: {new Date(pipelineStatus.lastRun.startedAt).toLocaleString()} ({pipelineStatus.lastRun.mode})
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerPipeline("discover")}
                  disabled={pipelineLoading}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Discover
                </button>
                <button
                  onClick={() => triggerPipeline("generate")}
                  disabled={pipelineLoading}
                  className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50"
                >
                  Generate
                </button>
                <button
                  onClick={() => triggerPipeline("full")}
                  disabled={pipelineLoading}
                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Full Pipeline
                </button>
              </div>
            </div>

            {pipelineMessage && (
              <div className="px-5 py-2 bg-surface-alt text-sm text-text-secondary border-b border-border/50">
                {pipelineMessage}
              </div>
            )}

            {/* Pipeline stats */}
            <div className="grid grid-cols-3 gap-4 p-5 border-b border-border/50">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{pipelineStatus?.totalDiscovered || 0}</p>
                <p className="text-xs text-text-secondary">Discovered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-600">{pipelineStatus?.totalGenerated || 0}</p>
                <p className="text-xs text-text-secondary">Generated</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{pipelineStatus?.recentRuns?.length || 0}</p>
                <p className="text-xs text-text-secondary">Runs</p>
              </div>
            </div>

            {/* Recent opportunities */}
            {pipelineOpps.length > 0 && (
              <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                <div className="px-5 py-2 bg-surface-alt">
                  <p className="text-xs font-semibold text-text-secondary uppercase">Top Opportunities</p>
                </div>
                {pipelineOpps.map((opp, i) => (
                  <div key={`${opp.keyword}-${i}`} className="px-5 py-2.5 hover:bg-surface-alt/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text">{opp.keyword}</span>
                      <span className="text-xs font-mono text-text-secondary">
                        Score: {opp.opportunityScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-text-secondary">
                      <span>{opp.searchVolume.toLocaleString()}/mo</span>
                      <span>${opp.cpc} CPC</span>
                      <span>Diff: {opp.difficulty}</span>
                      {opp.entityA && opp.entityB && (
                        <span className="text-green-600">{opp.entityA} vs {opp.entityB}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {pipelineOpps.length === 0 && !pipelineLoading && (
              <div className="p-6 text-center text-text-secondary text-sm">
                No opportunities discovered yet. Click &quot;Discover&quot; to start.
              </div>
            )}
          </div>

          {/* Social Outreach */}
          <div className="bg-white border border-border rounded-xl overflow-hidden mb-8">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-bold text-text">Social Outreach</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Find &quot;X vs Y&quot; questions on Reddit &amp; Quora and generate answers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={outreachPlatform}
                  onChange={(e) => setOutreachPlatform(e.target.value)}
                  className="px-2 py-1.5 border border-border rounded-lg text-xs bg-white"
                >
                  <option value="all">All Platforms</option>
                  <option value="reddit">Reddit Only</option>
                  <option value="quora">Quora Only</option>
                </select>
                <button
                  onClick={findOutreachQuestions}
                  disabled={outreachLoading}
                  className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50"
                >
                  {outreachLoading ? "Searching..." : "Find Questions"}
                </button>
              </div>
            </div>

            {/* Outreach stats */}
            {outreachStats && (
              <div className="grid grid-cols-2 gap-4 p-5 border-b border-border/50">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{outreachStats.total}</p>
                  <p className="text-xs text-text-secondary">Questions Found</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{outreachStats.withMatches}</p>
                  <p className="text-xs text-text-secondary">With Matching Pages</p>
                </div>
              </div>
            )}

            {/* Questions list */}
            {outreachQuestions.length > 0 ? (
              <div className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                {outreachQuestions.map((q) => (
                  <div key={q.id} className="px-5 py-3 hover:bg-surface-alt/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${
                            q.platform === "reddit"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {q.platform === "reddit" ? "R" : "Q"}
                          </span>
                          {q.subreddit && (
                            <span className="text-[10px] text-text-secondary">r/{q.subreddit}</span>
                          )}
                          {q.upvotes !== undefined && (
                            <span className="text-[10px] text-text-secondary">{q.upvotes} upvotes</span>
                          )}
                          {q.comments !== undefined && (
                            <span className="text-[10px] text-text-secondary">{q.comments} comments</span>
                          )}
                        </div>
                        <a
                          href={q.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-text hover:text-primary-600 transition-colors"
                        >
                          {q.title}
                        </a>
                        {q.entityA && q.entityB && (
                          <p className="text-xs text-text-secondary mt-0.5">
                            Parsed: {q.entityA} vs {q.entityB}
                          </p>
                        )}
                        {q.matchingComparisonSlug && (
                          <p className="text-xs text-green-600 mt-0.5">
                            Matching page: /{q.matchingComparisonSlug}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {q.matchingComparisonSlug ? (
                          <button
                            onClick={() => generateAnswer(q)}
                            disabled={generatingAnswerId === q.id}
                            className="px-2.5 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                          >
                            {generatingAnswerId === q.id ? "Generating..." : "Generate Answer"}
                          </button>
                        ) : (
                          <span className="text-[10px] text-text-secondary italic">No match</span>
                        )}
                      </div>
                    </div>

                    {/* Generated answer */}
                    {outreachAnswers[q.id] && (
                      <div className="mt-3 bg-surface-alt rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <span className="text-xs font-semibold text-text-secondary">Generated Answer</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(outreachAnswers[q.id].answer);
                              }}
                              className="px-2 py-0.5 bg-primary-600 text-white text-[10px] font-medium rounded hover:bg-primary-700"
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => saveAnswerToQueue(outreachAnswers[q.id])}
                              disabled={savingQuestionId === q.id || savedQuestionIds.has(q.id)}
                              className="px-2 py-0.5 bg-green-600 text-white text-[10px] font-medium rounded hover:bg-green-700 disabled:opacity-60"
                            >
                              {savedQuestionIds.has(q.id)
                                ? "✓ Saved"
                                : savingQuestionId === q.id
                                  ? "Saving..."
                                  : "Save to Queue"}
                            </button>
                          </div>
                        </div>
                        <textarea
                          readOnly
                          value={outreachAnswers[q.id].answer}
                          className="w-full h-32 text-xs text-text bg-white border border-border rounded p-2 resize-y font-mono"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-text-secondary text-sm">
                {outreachLoading
                  ? "Searching for comparison questions..."
                  : "Click \"Find Questions\" to search Reddit & Quora for comparison questions."}
              </div>
            )}
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
