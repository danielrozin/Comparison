"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface OutreachPost {
  id: string;
  platform: "reddit" | "quora";
  questionUrl: string;
  questionTitle: string;
  subreddit: string | null;
  category: string | null;
  entityA: string | null;
  entityB: string | null;
  comparisonSlug: string;
  comparisonUrl: string;
  answer: string;
  status: "queued" | "posted" | "skipped";
  postedUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  postedAt: string | null;
}

type Status = "queued" | "posted" | "skipped";
type PlatformFilter = "all" | "reddit" | "quora";

const STATUSES: Status[] = ["queued", "posted", "skipped"];

const PLATFORM_LABEL: Record<string, string> = {
  reddit: "Reddit",
  quora: "Quora",
};

export default function OutreachQueuePage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("queued");
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [posts, setPosts] = useState<OutreachPost[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({
    queued: 0,
    posted: 0,
    skipped: 0,
  });
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/outreach/queue?status=${status}&platform=${platform}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setCounts(data.counts || { queued: 0, posted: 0, skipped: 0 });
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token, status, platform]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function updatePost(
    id: string,
    patch: { status?: Status; postedUrl?: string | null; notes?: string | null; answer?: string }
  ) {
    setActing(id);
    try {
      const res = await fetch(`/api/outreach/queue/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        await fetchPosts();
      }
    } catch {
      // ignore
    }
    setActing(null);
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this outreach post?")) return;
    setActing(id);
    try {
      const res = await fetch(`/api/outreach/queue/${id}`, {
        method: "DELETE",
        headers: { authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchPosts();
    } catch {
      // ignore
    }
    setActing(null);
  }

  async function copyAndOpen(post: OutreachPost) {
    try {
      await navigator.clipboard.writeText(post.answer);
    } catch {
      // Some browsers block clipboard in background tabs; fall back to prompt
      window.prompt("Copy this answer:", post.answer);
    }
    setCopiedId(post.id);
    setTimeout(() => setCopiedId((prev) => (prev === post.id ? null : prev)), 2000);
    window.open(post.questionUrl, "_blank", "noopener,noreferrer");
  }

  async function markPosted(post: OutreachPost) {
    const postedUrl = window.prompt(
      "Paste the URL of the live answer (optional — press Cancel to skip):",
      post.postedUrl || ""
    );
    // prompt returns null on Cancel, empty string on OK with empty input
    if (postedUrl === null) return;
    await updatePost(post.id, {
      status: "posted",
      postedUrl: postedUrl.trim() || null,
    });
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in at the admin dashboard first.</p>
          <Link href="/admin" className="text-primary-600 font-medium hover:underline">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Outreach Queue</h1>
            <p className="text-sm text-gray-500">
              Review prepared Quora &amp; Reddit answers, copy &amp; post, then mark as posted.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                  status === s
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {s} <span className="ml-1 text-xs opacity-70">({counts[s] || 0})</span>
              </button>
            ))}
          </div>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as PlatformFilter)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
          >
            <option value="all">All Platforms</option>
            <option value="reddit">Reddit Only</option>
            <option value="quora">Quora Only</option>
          </select>

          <button
            onClick={fetchPosts}
            disabled={loading}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Posts list */}
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No {status} posts.</p>
            {status === "queued" && (
              <p className="text-xs text-gray-400 mt-2">
                Generate answers in the{" "}
                <Link href="/admin" className="text-primary-600 hover:underline">
                  Social Outreach panel
                </Link>{" "}
                and click &quot;Save to Queue&quot;.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const isOpen = expanded === post.id;
              const isCopied = copiedId === post.id;
              const isActing = acting === post.id;
              return (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-xl p-5"
                >
                  {/* Header row */}
                  <div className="flex items-start gap-3 mb-3">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded text-[11px] font-bold flex-shrink-0 ${
                        post.platform === "reddit"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                      title={PLATFORM_LABEL[post.platform]}
                    >
                      {post.platform === "reddit" ? "R" : "Q"}
                    </span>

                    <div className="flex-1 min-w-0">
                      <a
                        href={post.questionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                      >
                        {post.questionTitle}
                      </a>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                        {post.subreddit && <span>r/{post.subreddit}</span>}
                        {post.category && (
                          <span className="capitalize">{post.category}</span>
                        )}
                        {post.entityA && post.entityB && (
                          <span>
                            {post.entityA} vs {post.entityB}
                          </span>
                        )}
                        <Link
                          href={post.comparisonUrl}
                          target="_blank"
                          className="text-green-600 hover:underline"
                        >
                          /{post.comparisonSlug}
                        </Link>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.postedAt && (
                          <span className="text-blue-600">
                            Posted {new Date(post.postedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {post.postedUrl && (
                        <a
                          href={post.postedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-block break-all"
                        >
                          Live answer: {post.postedUrl}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Answer preview */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div
                      className={`text-sm text-gray-800 whitespace-pre-wrap ${
                        isOpen ? "" : "line-clamp-4"
                      }`}
                    >
                      {post.answer}
                    </div>
                    <button
                      onClick={() => setExpanded(isOpen ? null : post.id)}
                      className="mt-2 text-xs text-primary-600 hover:underline"
                    >
                      {isOpen ? "Collapse" : "Expand full answer"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => copyAndOpen(post)}
                      className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      {isCopied ? "Copied — thread opened" : "Copy & Open Thread"}
                    </button>

                    {post.status !== "posted" && (
                      <button
                        onClick={() => markPosted(post)}
                        disabled={isActing}
                        className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Mark Posted
                      </button>
                    )}

                    {post.status !== "skipped" && (
                      <button
                        onClick={() => updatePost(post.id, { status: "skipped" })}
                        disabled={isActing}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                      >
                        Skip
                      </button>
                    )}

                    {post.status !== "queued" && (
                      <button
                        onClick={() => updatePost(post.id, { status: "queued" })}
                        disabled={isActing}
                        className="px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50"
                      >
                        Restore to Queue
                      </button>
                    )}

                    <button
                      onClick={() => deletePost(post.id)}
                      disabled={isActing}
                      className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
