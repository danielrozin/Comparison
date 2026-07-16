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
      <svg className="w-3 h-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      {" "}price change
    </span>
    <span aria-hidden="true" className="text-text-secondary/60">·</span>
    <span className="inline-flex items-center gap-1">
      <svg className="w-3 h-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
      {" "}new spec
    </span>
    <span aria-hidden="true" className="text-text-secondary/60">·</span>
    <span className="inline-flex items-center gap-1">
      <svg className="w-3 h-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      {" "}verdict update
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
            className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm"
            aria-hidden="true"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id={headingId}
              className="text-base sm:text-lg font-semibold text-text flex items-center gap-2"
            >
              <svg className="sm:hidden w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
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
                    className="text-xs text-text-secondary underline underline-offset-2 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:rounded"
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
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
                    className="flex-1 px-4 py-2.5 bg-white border border-border rounded-lg text-sm text-text placeholder:text-text-secondary focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                    aria-invalid={state === "error" || undefined}
                  />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all duration-150 disabled:opacity-60 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
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
