"use client";

import { useState } from "react";
import { identifySubscriber, trackMissingCompareNotifySignup } from "@/lib/utils/analytics";

/**
 * On a compare we couldn't build: "Email me when it's live".
 * Saves the visitor through /api/newsletter with source missing_compare_notify;
 * the promote-provisional cron emails them once the compare is published.
 */
export function MissingCompareNotify({ slug, matchup }: { slug: string; matchup: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source: "missing_compare_notify",
          referrerSlug: slug,
          compareSlug: slug,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      identifySubscriber(trimmed);
      trackMissingCompareNotifySignup(slug);
      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputId = `missing-compare-notify-${slug}`;

  return (
    <section
      aria-label={`Get ${matchup} by email`}
      data-testid="missing-compare-notify"
      className="rounded-2xl border border-border bg-white p-5 text-left"
    >
      <p className="font-display font-bold text-text">Email me when {matchup} is live</p>
      <p className="mt-1 text-sm text-text-secondary leading-relaxed">
        One email with the verdict as soon as it&apos;s published. No spam, unsubscribe anytime.
      </p>
      <div aria-live="polite" className="mt-3">
        {status === "success" ? (
          <p role="status" className="text-sm font-semibold text-emerald-700">
            Done. We&apos;ll email you when {matchup} is published.
          </p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2">
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <input
              id={inputId}
              type="email"
              inputMode="email"
              autoComplete="email"
              enterKeyHint="go"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@example.com"
              aria-invalid={status === "error" ? "true" : undefined}
              className="flex-1 min-w-0 min-h-11 rounded-xl border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="min-h-11 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {status === "loading" ? "Saving…" : "Notify me"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
