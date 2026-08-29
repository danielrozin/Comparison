"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * Client-side PostHog bootstrap.
 *
 * Until this existed, posthog.init was never called in the browser, so every
 * client capture in analytics.ts — affiliate clicks, pricing views, checkout
 * clicks, searches, comparison views — was silently dropped. Only server-side
 * events (posthog-node) ever reached PostHog.
 *
 * Consent: mirrors the Clarity rule already in both document heads — track
 * when the visitor granted analytics consent, or made no choice outside the
 * EU. Otherwise stay dark.
 *
 * Also registers the visitor's A/B assignments (ab_experiments cookie) as
 * super properties, so every event can be split by experiment variant.
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
    const raw = JSON.parse(decodeURIComponent(m[1])) as Record<string, { variant?: string } | string>;
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

export function PostHogInit() {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (!token || posthog.__loaded) return;
    if (!analyticsAllowed()) return;

    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      // SPA-aware pageviews + pageleave give session/bounce data for funnels
      capture_pageview: "history_change",
      capture_pageleave: true,
      // autocapture off: we instrument deliberately via analytics.ts, and
      // autocapture on content pages this size is mostly noise + cost
      autocapture: false,
      persistence: "localStorage+cookie",
    });

    const assignments = experimentAssignments();
    if (Object.keys(assignments).length > 0) {
      // super properties: every subsequent event carries the variant, which is
      // what makes "signups by follow-cta-copy variant" a one-click breakdown
      posthog.register(assignments);
    }
  }, []);

  return null;
}
