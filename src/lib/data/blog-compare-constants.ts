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
  // ROO-119: canonical finance compares (banks + money transfer). The
  // retired alias chase-vs-bank-of-america folds onto bank-of-america-vs-chase.
  "how-to-get-a-cashiers-check": [
    "bank-of-america-vs-chase",
    "capital-one-vs-chase",
    "revolut-vs-wise",
  ],
  // ROO-127: editorial Maps compares are the live canonicals. Android vs iOS stays.
  "best-navigation-apps-2026-google-maps-waze-and-apple-maps-compared": [
    "google-maps-vs-waze",
    "google-maps-vs-apple-maps",
    "android-vs-ios",
  ],
  // ROO-127: 14" vs 16" Pro weight guide, plus Air and Mac vs Windows.
  "macbook-pro-weight-2025-2026-complete-specs-comparison-guide": [
    "macbook-pro-14-vs-macbook-pro-16",
    "macbook-air-vs-macbook-pro",
    "mac-vs-windows",
  ],
  // ROO-127: which Air, the Windows ultraportable, and the Pro step-up.
  "macbook-air-weight-comparison-2025-2026-which-model-is-right-for-you": [
    "macbook-air-m3-vs-macbook-air-m4",
    "dell-xps-13-vs-macbook-air",
    "macbook-air-vs-macbook-pro",
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
  // ROO-133: Abrams / T-90 / Leopard compares 404. These three are the
  // published, self-canonical army pages the live-slug filter keeps.
  "best-tanks-world-2026-abrams-vs-t-90-vs-leopard": [
    "us-military-vs-china-military",
    "russia-vs-usa",
    "marines-vs-army",
  ],
  // workspace-vs-365 compares 404 live; slack/zoom are published workplace tools.
  "google-workspace-alternatives-2026": [
    "slack-vs-microsoft-teams",
    "zoom-vs-google-meet",
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
