import posthog from "posthog-js";

/**
 * Single client-side PostHog bootstrap (ROO-33 / #244).
 *
 * Next.js runs this instrumentation hook once at browser start, before React
 * hydrates. It is the only place that calls posthog.init. A second init used
 * to live in PostHogInit.tsx, but it always lost the race to this hook and
 * bailed on posthog.__loaded, so its consent check never ran and EU visitors
 * who never granted analytics consent were tracked anyway.
 *
 * Consent: mirror the Clarity rule in both document heads — track when the
 * visitor granted analytics consent, or made no choice outside the EU.
 * Otherwise stay dark.
 *
 * Keeps the SPA pageview / pageleave / no-autocapture settings from the old
 * PostHogInit so CRO funnels and $pageview stay intact after the collapse.
 */

function analyticsAllowed(): boolean {
  try {
    const m = document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/);
    if (m) {
      const settings = JSON.parse(decodeURIComponent(m[1]));
      return Boolean(settings.analytics);
    }
    // no explicit choice: allowed unless the visitor was geo-flagged EU
    return document.cookie.indexOf("consent_region=eu") === -1;
  } catch {
    return false;
  }
}

function experimentAssignments(): Record<string, string> {
  try {
    const m = document.cookie.match(/(?:^|; )ab_experiments=([^;]*)/);
    if (!m) return {};
    const raw = JSON.parse(decodeURIComponent(m[1])) as Record<
      string,
      { variant?: string } | string
    >;
    const out: Record<string, string> = {};
    for (const [id, v] of Object.entries(raw)) {
      const variant = typeof v === "string" ? v : v?.variant;
      if (variant) out[`exp_${id}`] = variant;
    }
    return out;
  } catch {
    return {};
  }
}

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
if (token && analyticsAllowed()) {
  posthog.init(token, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    // SPA-aware pageviews + pageleave (carried over from PostHogInit)
    capture_pageview: "history_change",
    capture_pageleave: true,
    // deliberate instrumentation via analytics.ts — autocapture is noise here
    autocapture: false,
    persistence: "localStorage+cookie",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });

  // Super properties: every subsequent event carries the visitor's A/B variant
  const assignments = experimentAssignments();
  if (Object.keys(assignments).length > 0) {
    posthog.register(assignments);
  }
}
