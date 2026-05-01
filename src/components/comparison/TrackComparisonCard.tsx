"use client";

import { useEffect, useRef, useState } from "react";
import {
  trackComparisonTrackerClick,
  trackComparisonTrackerConfirmed,
  trackComparisonTrackerImpression,
  trackComparisonTrackerSubmit,
} from "@/lib/utils/analytics";

interface TrackComparisonCardProps {
  comparisonSlug: string;
  comparisonTitle?: string;
}

type CardState =
  | "idle_loggedout"
  | "idle_loggedin"
  | "loading"
  | "tracking"
  | "pending_confirmation"
  | "error";

const TRIGGERS_LABEL = (
  <>
    <span className="inline-flex items-center gap-1">
      <span aria-hidden="true">💲</span> price change
    </span>
    <span aria-hidden="true" className="text-text-secondary/60">·</span>
    <span className="inline-flex items-center gap-1">
      <span aria-hidden="true">🆕</span> new spec
    </span>
    <span aria-hidden="true" className="text-text-secondary/60">·</span>
    <span className="inline-flex items-center gap-1">
      <span aria-hidden="true">✏️</span> verdict update
    </span>
  </>
);

export function TrackComparisonCard({
  comparisonSlug,
  comparisonTitle,
}: TrackComparisonCardProps) {
  const [state, setState] = useState<CardState>("idle_loggedout");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const impressionFiredRef = useRef(false);

  // Initial state: ask the API whether this browser already has an active
  // tracker for this comparison. The route inspects the signed cookie.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/track-comparison?slug=${encodeURIComponent(comparisonSlug)}`,
          { credentials: "include" },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { status?: string };
        if (cancelled) return;
        if (data.status === "active") {
          setState("tracking");
        }
      } catch {
        // Stay logged-out idle on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [comparisonSlug]);

  // Fire impression once when the card scrolls into view.
  useEffect(() => {
    const node = containerRef.current;
    if (!node || impressionFiredRef.current) return;
    if (!("IntersectionObserver" in window)) {
      impressionFiredRef.current = true;
      trackComparisonTrackerImpression(comparisonSlug);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !impressionFiredRef.current) {
            impressionFiredRef.current = true;
            trackComparisonTrackerImpression(comparisonSlug);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [comparisonSlug]);

  // Detect ?tracker=confirmed redirect coming back from the magic-link route.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const status = params.get("tracker");
    if (!status) return;
    if (status === "confirmed") {
      setState("tracking");
      trackComparisonTrackerConfirmed(comparisonSlug);
    }
    // Clean the URL so reloads don't re-fire the event.
    params.delete("tracker");
    const newSearch = params.toString();
    const url =
      window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
    window.history.replaceState({}, "", url);
  }, [comparisonSlug]);

  async function submitWithEmail(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("Enter a valid email.");
      setState("error");
      return;
    }
    trackComparisonTrackerClick(comparisonSlug, "logged_out");
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/track-comparison", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comparisonSlug,
          email: trimmed,
          triggers: ["price_change", "new_spec", "verdict_update"],
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = (await res.json()) as { status?: string };
      trackComparisonTrackerSubmit(comparisonSlug, "logged_out");
      if (data.status === "active") {
        setState("tracking");
      } else {
        setState("pending_confirmation");
      }
    } catch {
      setErrorMsg("Couldn't save your tracker. Try again?");
      setState("error");
    }
  }

  async function oneClickTrack() {
    if (state === "loading") return;
    trackComparisonTrackerClick(comparisonSlug, "logged_in");
    const previous = state;
    setState("loading");
    try {
      const res = await fetch("/api/track-comparison", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comparisonSlug,
          triggers: ["price_change", "new_spec", "verdict_update"],
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      trackComparisonTrackerSubmit(comparisonSlug, "logged_in");
      setState("tracking");
    } catch {
      setErrorMsg("Couldn't save your tracker. Try again?");
      setState(previous === "tracking" ? "tracking" : "error");
    }
  }

  async function stopTracking() {
    setState("loading");
    try {
      const res = await fetch(
        `/api/track-comparison?slug=${encodeURIComponent(comparisonSlug)}`,
        { method: "DELETE", credentials: "include" },
      );
      if (!res.ok) throw new Error(`status ${res.status}`);
      setState("idle_loggedin");
    } catch {
      setErrorMsg("Couldn't stop tracking. Try again?");
      setState("tracking");
    }
  }

  const headingId = `track-comparison-heading-${comparisonSlug}`;
  const titleSuffix = comparisonTitle ? ` ${comparisonTitle}` : "";

  return (
    <section
      ref={containerRef}
      aria-labelledby={headingId}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      <div className="bg-gradient-to-br from-primary-50 via-white to-blue-50 border border-primary-200 rounded-xl p-6 sm:p-7 shadow-sm">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xl"
            aria-hidden="true"
          >
            🔔
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id={headingId}
              className="text-base sm:text-lg font-semibold text-text flex items-center gap-2"
            >
              <span className="sm:hidden" aria-hidden="true">🔔</span>
              Track this comparison
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Get notified when prices change, new specs ship, or our verdict updates.
            </p>

            <div aria-live="polite" className="mt-4">
              {state === "tracking" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-semibold">
                    <span aria-hidden="true">✓</span> Tracking
                  </span>
                  <span className="text-sm text-text-secondary">
                    We&apos;ll email you when something changes.
                  </span>
                  <button
                    type="button"
                    onClick={stopTracking}
                    className="text-xs text-text-secondary underline underline-offset-2 hover:text-text"
                  >
                    Stop tracking
                  </button>
                </div>
              ) : state === "pending_confirmation" ? (
                <p className="text-sm text-emerald-700 font-medium">
                  Check your inbox — we sent a confirmation link to start tracking{titleSuffix}.
                </p>
              ) : state === "idle_loggedin" ? (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={oneClickTrack}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Track
                  </button>
                  <span className="text-xs text-text-secondary">
                    No spam. Stop anytime.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={submitWithEmail}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <label htmlFor={`${headingId}-email`} className="sr-only">
                    Email address
                  </label>
                  <input
                    id={`${headingId}-email`}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle_loggedout");
                    }}
                    placeholder="you@example.com"
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    aria-invalid={state === "error" || undefined}
                  />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    {state === "loading" ? "Saving…" : "Track"}
                  </button>
                </form>
              )}

              {state === "error" && errorMsg && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                  {errorMsg}
                </p>
              )}
            </div>

            {state !== "tracking" && state !== "pending_confirmation" && (
              <>
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
                  <span className="font-medium text-text-secondary">Triggers:</span>
                  {TRIGGERS_LABEL}
                </p>
                <p className="mt-2 text-xs text-text-secondary">
                  No spam. Stop anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
