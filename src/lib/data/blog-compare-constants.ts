/**
 * ROO-9 — client-safe blog→compare CTA constants.
 *
 * Keep this module free of server-only imports. Client components
 * (`BlogCompareCTA`, `BlogRelatedComparisons`) must import from here so the
 * Next.js client bundle never pulls `posthog-otel` / gRPC via
 * `blog-related-compares` → `resolve-internal-links` → `blog-generator`.
 */

/**
 * Small curated map for top-traffic / high-bounce posts where
 * `relatedComparisonSlugs` is empty or thin. Only candidates known (or likely)
 * to resolve live — runtime filter drops anything dead.
 */
export const BLOG_COMPARE_FALLBACKS: Record<string, string[]> = {
  "how-to-get-a-cashiers-check": ["bank-of-america-vs-chase", "chase-vs-bank-of-america"],
  // nav-apps: maps/waze compares currently 404 live — leave empty; soft CTA only
  "best-navigation-apps-2026-google-maps-waze-and-apple-maps-compared": [
    "google-maps-vs-waze",
    "apple-maps-vs-waze",
  ],
  "macbook-pro-weight-2025-2026-complete-specs-comparison-guide": [
    "macbook-air-vs-macbook-pro",
    "mac-vs-windows",
  ],
  "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider": [
    "bmw-vs-mercedes",
    "mercedes-vs-audi",
    "mercedes-vs-lexus",
  ],
  "best-alternatives-to-mercedes-benz-2026": [
    "bmw-vs-mercedes",
    "mercedes-vs-audi",
    "mercedes-vs-lexus",
  ],
  "best-cloud-platforms-2026": ["aws-vs-azure", "aws-vs-azure-vs-gcp"],
  // tanks: abrams compares currently 404 live — candidates filtered out at runtime
  "best-tanks-world-2026-abrams-vs-t-90-vs-leopard": [
    "m1-abrams-vs-t-90",
    "abrams-tank-vs-leopard-2",
  ],
  "us-china-military-comparison-2026-defense-spending-nuclear-naval": [
    "us-military-vs-china-military",
    "usa-vs-china",
    "us-economy-vs-china-economy",
  ],
  "whatsapp-vs-signal-2026-which-messaging-app-is-more-private": [
    "signal-vs-whatsapp",
    "signal-vs-telegram",
    "whatsapp-vs-telegram",
  ],
  "signal-vs-telegram-2026-which-messaging-app-is-actually-private": [
    "signal-vs-telegram",
    "signal-vs-whatsapp",
    "whatsapp-vs-telegram",
  ],
};

/** Soft explore target when no live compare slugs remain. */
export const BLOG_COMPARE_SOFT_HREF = "/search";

/** PostHog source_page for hub `/blog` → compare CTA clicks (ROO-23). */
export const BLOG_HUB_COMPARE_SOURCE = "blog-hub";
