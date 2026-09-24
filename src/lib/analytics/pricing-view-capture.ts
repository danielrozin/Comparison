/**
 * ROO-54 — PostHog `pricing_viewed` (top of the checkout funnel).
 *
 * `$pageview` is captured inside the client bootstrap, before React hydrates.
 * `pricing_viewed` used to wait for `PricingViewTracker`'s effect, which runs
 * only after hydration. Short-lived clients that execute the bootstrap and
 * then stop recorded a `/pricing` pageview and never the funnel event
 * (53 pageviews vs 16 `pricing_viewed` on 2026-09-24).
 *
 * Capture from the bootstrap, in the same turn as init, with `send_instantly`.
 * A normal batched capture sits until the flush interval or pageleave, and
 * these clients often never emit `$pageleave`.
 *
 * The React tracker still calls `capturePricingViewed` so a client navigation
 * (which does not re-run the bootstrap) fires too. The bootstrap arms a
 * one-shot skip so the hydrated effect on that same load is not a second event.
 */

import posthog from "posthog-js";

const PRICING_PATH = "/pricing";

/** Set by the bootstrap. The next matching hydrated capture consumes it. */
let skipHydratedSrc: string | null = null;

/** `?src=` on `/pricing`, same value the buy button sends to checkout. */
export function normalizePricingSrc(src: string | null | undefined): string {
  const value = (src ?? "").trim();
  return (value || "direct").slice(0, 80);
}

/** Exact `/pricing` only. `/pricing/thanks` is a different step. */
export function isPricingPath(pathname: string): boolean {
  const path = pathname.split("?")[0]?.split("#")[0]?.replace(/\/+$/, "") || "/";
  return path === PRICING_PATH;
}

export function readPricingSrc(search: string): string {
  return normalizePricingSrc(new URLSearchParams(search).get("src"));
}

/**
 * PostHog `pricing_viewed`. Returns false when this call is the hydrated
 * twin of the bootstrap capture for the same `src`.
 */
export function capturePricingViewed(
  src: string,
  options?: { sendInstantly?: boolean },
): boolean {
  const normalized = normalizePricingSrc(src);
  if (skipHydratedSrc === normalized) {
    skipHydratedSrc = null;
    return false;
  }
  posthog.capture(
    "pricing_viewed",
    { src: normalized },
    options?.sendInstantly ? { send_instantly: true } : undefined,
  );
  return true;
}

/**
 * Early path. Call immediately after `posthog.init` on `/pricing`.
 * Returns false when this document is not the pricing page.
 */
export function capturePricingViewedFromLocation(loc?: {
  pathname: string;
  search: string;
}): boolean {
  const location = loc ?? (typeof window !== "undefined" ? window.location : undefined);
  if (!location || !isPricingPath(location.pathname)) return false;
  const src = readPricingSrc(location.search);
  // The hydrated tracker will call capturePricingViewed with this same src.
  skipHydratedSrc = src;
  posthog.capture("pricing_viewed", { src }, { send_instantly: true });
  return true;
}

export function resetPricingViewCaptureForTests(): void {
  skipHydratedSrc = null;
}
