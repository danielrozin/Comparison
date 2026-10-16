"use client";

import { useEffect, useRef, useState } from "react";
import {
  identifySubscriber,
  trackCompareChangeAlertSignup,
  trackCompareChangeAlertViewed,
} from "@/lib/utils/analytics";

/**
 * ROO-242: the one email capture on a compare page, right after the verdict.
 * It replaces the two generic newsletter blocks (inline card + footer).
 * Uses the existing /api/newsletter endpoint, tagged with compare_slug.
 * The view event fires once, when half the card is on screen, so signups
 * can be divided by real views.
 */
export function CompareChangeAlert({ compareSlug, matchup }: { compareSlug: string; matchup: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ref = useRef<HTMLElement | null>(null);
  const viewedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (viewedRef.current || !entries.some((entry) => entry.isIntersecting)) return;
        viewedRef.current = true;
        observer.disconnect();
        trackCompareChangeAlertViewed(compareSlug);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [compareSlug]);

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
          source: "compare_change_alert",
          referrerSlug: compareSlug,
          compareSlug,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      identifySubscriber(trimmed);
      trackCompareChangeAlertSignup(compareSlug);
      setEmail("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const headingId = `compare-change-alert-${compareSlug}`;

  return (
    <section
      ref={ref}
      aria-labelledby={headingId}
      data-testid="compare-change-alert"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5 sm:p-6">
        <h2 id={headingId} className="text-base sm:text-lg font-bold text-text m-0">
          Get notified when {matchup} changes
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          One email when prices, specs or our verdict on {matchup} change. No spam, unsubscribe anytime.
        </p>
        <div aria-live="polite" className="mt-3">
          {status === "success" ? (
            <p role="status" className="text-sm font-semibold text-emerald-700">
              You&apos;re on the list. We&apos;ll email you when {matchup} changes.
            </p>
          ) : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <label htmlFor={`${headingId}-email`} className="sr-only">
                Email address
              </label>
              <input
                id={`${headingId}-email`}
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
                className="flex-1 min-w-0 min-h-11 rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="min-h-11 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
      </div>
    </section>
  );
}
