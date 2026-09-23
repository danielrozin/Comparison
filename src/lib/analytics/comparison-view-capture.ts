/**
 * ROO-48 — PostHog `comparison_viewed` (the compare-page north star).
 *
 * `$pageview` is captured inside the client bootstrap, before React hydrates.
 * `comparison_viewed` used to wait for `ConversionFunnelTracker`, a
 * `dynamic(..., { ssr: false })` chunk whose effect runs only after hydration.
 * Headless clients that execute the bootstrap and then stop (Lightpanda/1.0,
 * and often a short-lived 800×600 Chrome crawler) therefore recorded a
 * pageview and never the north-star event. Design/AI compare URLs are where
 * that traffic concentrates, so their CV rate collapsed while human loads of
 * the same template still fired.
 *
 * Capture from the bootstrap, in the same turn as init. `$pageview` is sent
 * with `send_instantly` (posthog-js flushes it on its own request, one
 * millisecond after init). A normal batched capture would sit until the flush
 * interval or pageleave — and these clients never emit `$pageleave` — so the
 * bootstrap capture uses `send_instantly` too.
 *
 * The React tracker still calls this helper so a client navigation (which
 * does not re-run the bootstrap) fires too. One slug is recorded once per
 * document, so a hydrated visit is not double-counted.
 */

import posthog from "posthog-js";

const COMPARE_PATH = /^\/compare\/([^/]+)$/;

const capturedSlugs = new Set<string>();

type NextData = {
  props?: {
    pageProps?: {
      comparison?: { category?: string | null };
    };
  };
};

export function parseCompareSlug(pathname: string): string | null {
  const path = pathname.split("?")[0]?.split("#")[0]?.replace(/\/+$/, "") || "/";
  const match = COMPARE_PATH.exec(path);
  const raw = match?.[1];
  if (!raw || raw === "index") return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Category stored on the comparison, from the Pages Router payload. */
export function readCompareCategory(
  doc: Pick<Document, "getElementById"> | null | undefined,
): string {
  const raw = doc?.getElementById("__NEXT_DATA__")?.textContent;
  if (!raw) return "general";
  try {
    const parsed = JSON.parse(raw) as NextData;
    const category = parsed.props?.pageProps?.comparison?.category;
    if (typeof category === "string" && category.trim()) return category.trim();
  } catch {
    // Malformed payload — still emit the event, with the fallback category.
  }
  return "general";
}

export function captureComparisonViewed(
  slug: string,
  category: string,
  sourcePage?: string,
  options?: { sendInstantly?: boolean },
): boolean {
  const normalized = slug.trim();
  if (!normalized || capturedSlugs.has(normalized)) return false;
  capturedSlugs.add(normalized);
  const resolvedCategory = category.trim() || "general";
  posthog.capture(
    "comparison_viewed",
    {
      comparison_slug: normalized,
      category: resolvedCategory,
      ...(sourcePage ? { source_page: sourcePage } : {}),
    },
    // Match $pageview: do not wait for the batch flush. Short-lived clients
    // that emit a pageview never reach pageleave, so a queued event is lost.
    options?.sendInstantly ? { send_instantly: true } : undefined,
  );
  return true;
}

/**
 * Early path. Call immediately after `posthog.init` on compare URLs.
 * Returns false when this document is not a single-slug compare page.
 */
export function captureComparisonViewedFromLocation(
  loc?: { pathname: string; search: string },
  doc?: Pick<Document, "getElementById"> | null,
): boolean {
  const location = loc ?? (typeof window !== "undefined" ? window.location : undefined);
  if (!location) return false;
  const slug = parseCompareSlug(location.pathname);
  if (!slug) return false;
  const categorySource =
    doc === undefined ? (typeof document !== "undefined" ? document : null) : doc;
  const sourcePage = new URLSearchParams(location.search).get("source_page")?.trim() || undefined;
  return captureComparisonViewed(slug, readCompareCategory(categorySource), sourcePage, {
    sendInstantly: true,
  });
}

export function resetComparisonViewedCaptureForTests(): void {
  capturedSlugs.clear();
}
