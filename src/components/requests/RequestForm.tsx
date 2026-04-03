"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/utils/constants";

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

export function RequestForm({ onSuccess }: { onSuccess?: () => void }) {
  const [entityA, setEntityA] = useState("");
  const [entityB, setEntityB] = useState("");
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [existingSlug, setExistingSlug] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!entityA.trim() || !entityB.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityA: entityA.trim(),
          entityB: entityB.trim(),
          category: category || undefined,
          reason: reason.trim() || undefined,
          sessionId: getSessionId(),
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 409 && data.slug) {
        setExistingSlug(data.slug);
        setError("This comparison already exists!");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess(true);
      setEntityA("");
      setEntityB("");
      setCategory("");
      setReason("");
      setEmail("");
      onSuccess?.();
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="text-3xl mb-3">🎉</div>
        <h3 className="text-lg font-bold text-green-800 mb-2">
          Request Submitted!
        </h3>
        <p className="text-sm text-green-700 mb-4">
          Your comparison request has been added. Others can upvote it to help prioritize it.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="entityA" className="block text-sm font-medium text-gray-700 mb-1">
            First item
          </label>
          <input
            id="entityA"
            type="text"
            value={entityA}
            onChange={(e) => setEntityA(e.target.value)}
            placeholder="e.g. Python"
            maxLength={200}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>
        <div>
          <label htmlFor="entityB" className="block text-sm font-medium text-gray-700 mb-1">
            Second item
          </label>
          <input
            id="entityB"
            type="text"
            value={entityB}
            onChange={(e) => setEntityB(e.target.value)}
            placeholder="e.g. JavaScript"
            maxLength={200}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-gray-400">(optional)</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
          Why do you want this comparison? <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Briefly explain why this comparison would be useful..."
          maxLength={500}
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-gray-400">(optional, to get notified when it&apos;s ready)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
          {existingSlug && (
            <a
              href={`/compare/${existingSlug}`}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 mt-1 inline-block"
            >
              View the comparison &rarr;
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !entityA.trim() || !entityB.trim()}
        className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
      >
        {loading ? "Submitting..." : "Submit Comparison Request"}
      </button>
    </form>
  );
}
