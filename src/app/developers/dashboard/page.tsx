"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { trackApiKeyGeneration } from "@/lib/utils/analytics";

type ApiKeyInfo = {
  id: string;
  keyPrefix: string;
  name: string;
  tier: string;
  status: string;
  requestsToday: number;
  requestsTotal: number;
  dailyLimit: number | null;
  lastUsedAt: string | null;
  createdAt: string;
};

type UsageStats = {
  key: {
    id: string;
    prefix: string;
    name: string;
    tier: string;
    requestsToday: number;
    requestsTotal: number;
    dailyLimit: number | null;
  };
  usage: {
    byEndpoint: { endpoint: string; _count: { id: number }; _avg: { responseMs: number | null } }[];
    dailyCounts: { createdAt: string; _count: { id: number } }[];
  };
};

export default function DeveloperDashboard() {
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyResult, setNewKeyResult] = useState<string | null>(null);
  const [selectedKeyStats, setSelectedKeyStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async (emailAddr: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/keys?email=${encodeURIComponent(emailAddr)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch keys");
      setKeys(data.keys || []);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch keys");
    } finally {
      setLoading(false);
    }
  }, []);

  const createKey = async () => {
    if (!newKeyName.trim()) return;
    setLoading(true);
    setError(null);
    setNewKeyResult(null);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: newKeyName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create key");
      setNewKeyResult(data.apiKey);
      trackApiKeyGeneration(newKeyName.trim());
      setNewKeyName("");
      await fetchKeys(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    } finally {
      setLoading(false);
    }
  };

  const revokeKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyId, email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to revoke key");
      }
      await fetchKeys(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke key");
    } finally {
      setLoading(false);
    }
  };

  const loadUsage = async (keyId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/keys/usage?email=${encodeURIComponent(email)}&keyId=${keyId}&days=30`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load usage");
      setSelectedKeyStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load usage");
    } finally {
      setLoading(false);
    }
  };

  const tierColors: Record<string, string> = {
    free: "bg-gray-100 text-gray-700",
    pro: "bg-indigo-100 text-indigo-700",
    enterprise: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/developers" className="hover:text-primary-600 transition-colors">Developers</Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Dashboard</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-2">
        API Dashboard
      </h1>
      <p className="text-text-secondary mb-8">
        Manage your API keys and monitor usage.
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-medium underline">Dismiss</button>
        </div>
      )}

      {!isAuthenticated ? (
        <div className="max-w-md">
          <label className="block text-sm font-medium text-text mb-2">Your email address</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              onKeyDown={(e) => e.key === "Enter" && email && fetchKeys(email)}
            />
            <button
              onClick={() => email && fetchKeys(email)}
              disabled={!email || loading}
              className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : "Sign In"}
            </button>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            Enter the email you used to create your API keys.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Create New Key */}
          <section className="p-6 rounded-xl border border-border bg-surface">
            <h2 className="text-lg font-bold text-text mb-4">Create New API Key</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key name (e.g., Production, Staging)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-text placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                onKeyDown={(e) => e.key === "Enter" && createKey()}
              />
              <button
                onClick={createKey}
                disabled={!newKeyName.trim() || loading}
                className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                Create
              </button>
            </div>

            {newKeyResult && (
              <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-800 mb-2">
                  API key created! Copy it now — it won&apos;t be shown again.
                </p>
                <code className="block p-3 rounded-lg bg-white border border-green-200 text-sm font-mono text-green-900 break-all select-all">
                  {newKeyResult}
                </code>
              </div>
            )}
          </section>

          {/* Keys List */}
          <section>
            <h2 className="text-lg font-bold text-text mb-4">
              Your API Keys ({keys.length})
            </h2>
            {keys.length === 0 ? (
              <p className="text-text-secondary">No API keys yet. Create one above to get started.</p>
            ) : (
              <div className="space-y-3">
                {keys.map((key) => (
                  <div
                    key={key.id}
                    className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-text">{key.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[key.tier] || tierColors.free}`}>
                          {key.tier}
                        </span>
                        {key.status === "revoked" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                            revoked
                          </span>
                        )}
                      </div>
                      <code className="text-xs font-mono text-text-secondary">{key.keyPrefix}...</code>
                      <div className="flex gap-4 mt-1 text-xs text-text-secondary">
                        <span>
                          Today: {key.requestsToday}{key.dailyLimit ? `/${key.dailyLimit}` : ""}
                        </span>
                        <span>Total: {key.requestsTotal.toLocaleString()}</span>
                        {key.lastUsedAt && (
                          <span>Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => loadUsage(key.id)}
                        className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-alt transition-colors"
                      >
                        Usage
                      </button>
                      {key.status === "active" && (
                        <button
                          onClick={() => revokeKey(key.id)}
                          className="px-3 py-1.5 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Usage Stats */}
          {selectedKeyStats && (
            <section className="p-6 rounded-xl border border-border bg-surface">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text">
                  Usage: {selectedKeyStats.key.name}
                </h2>
                <button
                  onClick={() => setSelectedKeyStats(null)}
                  className="text-sm text-text-secondary hover:text-text"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-surface-alt text-center">
                  <div className="text-2xl font-black text-text">{selectedKeyStats.key.requestsToday}</div>
                  <div className="text-xs text-text-secondary">Requests Today</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-alt text-center">
                  <div className="text-2xl font-black text-text">{selectedKeyStats.key.requestsTotal.toLocaleString()}</div>
                  <div className="text-xs text-text-secondary">Total Requests</div>
                </div>
                <div className="p-4 rounded-lg bg-surface-alt text-center">
                  <div className="text-2xl font-black text-text">
                    {selectedKeyStats.key.dailyLimit ? selectedKeyStats.key.dailyLimit.toLocaleString() : "Unlimited"}
                  </div>
                  <div className="text-xs text-text-secondary">Daily Limit</div>
                </div>
              </div>

              {selectedKeyStats.usage.byEndpoint.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text mb-3">Requests by Endpoint (30 days)</h3>
                  <div className="space-y-2">
                    {selectedKeyStats.usage.byEndpoint.map((ep) => (
                      <div key={ep.endpoint} className="flex items-center justify-between text-sm">
                        <code className="text-xs font-mono text-text-secondary">{ep.endpoint}</code>
                        <div className="flex gap-4">
                          <span className="text-text">{ep._count.id.toLocaleString()} requests</span>
                          {ep._avg.responseMs && (
                            <span className="text-text-secondary">{Math.round(ep._avg.responseMs)}ms avg</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Upgrade CTA */}
          <section className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200">
            <h2 className="text-lg font-bold text-text mb-2">Need more requests?</h2>
            <p className="text-text-secondary text-sm mb-4">
              Upgrade to Pro for 10,000 requests/day or Enterprise for unlimited access.
            </p>
            <Link
              href="/developers#pricing"
              className="inline-flex px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Plans
            </Link>
          </section>
        </div>
      )}
    </div>
  );
}
