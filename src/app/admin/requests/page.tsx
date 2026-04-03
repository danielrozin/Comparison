"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ComparisonRequest {
  id: string;
  entityA: string;
  entityB: string;
  category: string | null;
  reason: string | null;
  email: string | null;
  voteCount: number;
  status: string;
  comparisonSlug: string | null;
  createdAt: string;
  _count: { votes: number };
}

const STATUSES = ["pending", "approved", "generating", "generated", "rejected"] as const;
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  generating: "bg-purple-100 text-purple-800",
  generated: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminRequestsPage() {
  const [token, setToken] = useState("");
  const [requests, setRequests] = useState<ComparisonRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("pending");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchRequests = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests?status=${filter}`, {
        headers: { "x-admin-token": token },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token, filter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch {
      // ignore
    }
    setUpdating(null);
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comparison Requests</h1>
            <p className="text-sm text-gray-500">Moderate user-submitted comparison requests</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 inline-flex">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                filter === s
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No {filter} requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4"
              >
                <div className="flex flex-col items-center min-w-[40px]">
                  <span className="text-lg font-bold text-primary-600">{req.voteCount}</span>
                  <span className="text-[10px] text-gray-400 uppercase">votes</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {req.entityA} <span className="text-gray-400">vs</span> {req.entityB}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[req.status] || ""}`}>
                      {req.status}
                    </span>
                  </div>
                  {req.reason && (
                    <p className="text-sm text-gray-500 mb-1">{req.reason}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {req.category && <span className="capitalize">{req.category}</span>}
                    {req.email && <span>{req.email}</span>}
                    <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(req.id, "approved")}
                        disabled={updating === req.id}
                        className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, "rejected")}
                        disabled={updating === req.id}
                        className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {req.status === "approved" && (
                    <button
                      onClick={() => updateStatus(req.id, "generating")}
                      disabled={updating === req.id}
                      className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                      Queue Generation
                    </button>
                  )}
                  {req.status === "rejected" && (
                    <button
                      onClick={() => updateStatus(req.id, "pending")}
                      disabled={updating === req.id}
                      className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
