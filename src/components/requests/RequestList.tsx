"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ComparisonRequest {
  id: string;
  entityA: string;
  entityB: string;
  category: string | null;
  reason: string | null;
  voteCount: number;
  status: string;
  comparisonSlug: string | null;
  createdAt: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = document.cookie
    .split("; ")
    .find((c) => c.startsWith("avsb_session="))
    ?.split("=")[1];
  if (!id) {
    id = crypto.randomUUID();
    document.cookie = `avsb_session=${id}; path=/; max-age=${365 * 86400}; SameSite=Lax`;
  }
  return id;
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", className: "bg-blue-100 text-blue-800" },
  generating: { label: "Generating", className: "bg-purple-100 text-purple-800" },
  generated: { label: "Live", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
};

export function RequestList() {
  const [requests, setRequests] = useState<ComparisonRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"votes" | "newest">("votes");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/requests?status=pending,approved,generating,generated&sort=${sort}&page=${page}&limit=20`
      );
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests);
        setTotalPages(data.totalPages);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [sort, page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleVote(requestId: string) {
    if (votedIds.has(requestId)) return;

    try {
      const res = await fetch("/api/requests/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, sessionId: getSessionId() }),
      });

      if (res.ok) {
        const data = await res.json();
        setRequests((prev) =>
          prev.map((r) =>
            r.id === requestId ? { ...r, voteCount: data.voteCount } : r
          )
        );
        setVotedIds((prev) => new Set([...prev, requestId]));
      } else if (res.status === 409) {
        setVotedIds((prev) => new Set([...prev, requestId]));
      }
    } catch {
      // silently fail
    }
  }

  return (
    <div>
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-500">Sort by:</span>
        <button
          onClick={() => { setSort("votes"); setPage(1); }}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            sort === "votes"
              ? "bg-primary-100 text-primary-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Most Voted
        </button>
        <button
          onClick={() => { setSort("newest"); setPage(1); }}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            sort === "newest"
              ? "bg-primary-100 text-primary-700"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Newest
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No requests yet
          </h3>
          <p className="text-sm text-gray-500">
            Be the first to suggest a comparison!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const badge = STATUS_BADGES[req.status] || STATUS_BADGES.pending;
            const hasVoted = votedIds.has(req.id);

            return (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors flex items-start gap-4"
              >
                {/* Vote button */}
                <button
                  onClick={() => handleVote(req.id)}
                  disabled={hasVoted || req.status === "generated"}
                  className={`flex flex-col items-center min-w-[52px] py-2 px-2 rounded-lg border transition-all ${
                    hasVoted
                      ? "bg-primary-50 border-primary-200 text-primary-600"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600"
                  } ${req.status === "generated" ? "opacity-50 cursor-default" : ""}`}
                >
                  <svg
                    className="w-4 h-4 mb-0.5"
                    fill={hasVoted ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <span className="text-sm font-bold">{req.voteCount}</span>
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {req.entityA}{" "}
                      <span className="text-gray-400 font-normal">vs</span>{" "}
                      {req.entityB}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  {req.reason && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-1">
                      {req.reason}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {req.category && (
                      <span className="capitalize">{req.category}</span>
                    )}
                    <span>
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {req.status === "generated" && req.comparisonSlug && (
                    <Link
                      href={`/compare/${req.comparisonSlug}`}
                      className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View comparison &rarr;
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
