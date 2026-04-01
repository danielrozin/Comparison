"use client";

import { useState } from "react";
import { trackNewsletterSignup } from "@/lib/utils/analytics";

interface ComparisonAlertSignupProps {
  comparisonSlug: string;
  entityA: string;
  entityB: string;
  category?: string;
}

export function ComparisonAlertSignup({
  comparisonSlug,
  entityA,
  entityB,
  category,
}: ComparisonAlertSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: "alert",
          referrerSlug: comparisonSlug,
          categories: category ? [category] : undefined,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        trackNewsletterSignup(comparisonSlug, "alert");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-blue-800">
          Check your email to confirm!
        </p>
        <p className="text-xs text-blue-600 mt-1">
          We&apos;ll notify you when this comparison is updated.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <h4 className="text-sm font-semibold text-text">
          Get alerts for {entityA} vs {entityB}
        </h4>
      </div>
      <p className="text-xs text-text-secondary mb-3">
        Get notified when prices change or new data is available.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          placeholder="you@example.com"
          required
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Alert Me"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-600 text-xs mt-1">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
