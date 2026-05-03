/**
 * Blog redirects for retired duplicate slugs.
 *
 * Source of truth for 301 redirects from archived blog articles to their
 * canonical successors. Wired into next.config.ts via the redirects() async
 * function so Next.js handles them server-side before route resolution.
 *
 * Origin: DAN-452 — consolidating 91 macbook-pro-weight near-duplicates
 * (cannibalization fix) into a single canonical post. Extended under DAN-453
 * to absorb a second cluster of 16 macbook-weight (no "-pro-") near-duplicates
 * that bypassed the original prefix net. Future consolidations append entries
 * here; the dedup gate that prevents new dupes is tracked separately on the
 * engineering side.
 */

export type BlogRedirect = {
  source: string;
  destination: string;
  permanent: true;
};

const MACBOOK_PRO_WEIGHT_CANONICAL =
  "/blog/macbook-pro-weight-2025-2026-complete-specs-comparison-guide";

const MACBOOK_PRO_WEIGHT_DUPES: string[] = [
  "macbook-pro-weight-2025-2026-all-current-models-compared",
  "macbook-pro-weight-comparison-2024-2025-and-2026-models",
  "macbook-pro-weight-2026-a-complete-comparison-of-current-models",
  "macbook-pro-weight-2026-complete-guide-to-all-models",
  "macbook-pro-weight-comparison-2025-2026-all-current-models-explained",
  "macbook-pro-14-inch-vs-16-inch-weight-comparison-2024-2026-models",
  "macbook-pro-weight-comparison-2026-m5-pro-vs-m5-max-models",
  "macbook-pro-weight-2026-all-current-models-compared",
  "macbook-pro-weight-comparison-2024-2025-and-2026-models-explained",
  "macbook-pro-weight-2026-complete-guide-to-current-models",
  "macbook-pro-weight-2025-2026-complete-specs-for-every-model",
  "macbook-pro-14-vs-16-inch-weight-specs-2024-2026",
  "macbook-pro-weight-comparison-2026-all-current-models",
  "macbook-pro-weight-2025-2026-complete-comparison-of-all-current-models",
  "macbook-pro-weight-comparison-2024-2026-models-explained",
  "macbook-pro-14-inch-vs-16-inch-weight-2024-2026-models-compared",
  "macbook-pro-weight-comparison-2025-2026-complete-guide-to-current-models",
  "macbook-pro-weight-comparison-2026-all-current-models-explained",
  "macbook-pro-weight-comparison-2024-2026-models-specs",
  "macbook-pro-weight-2025-2026-complete-model-comparison-guide",
  "macbook-pro-weight-comparison-2024-2025-2026-models",
  "macbook-pro-weight-2026-complete-spec-comparison-of-all-models",
  "macbook-pro-weight-2024-2026-complete-specs-model-comparison",
  "macbook-pro-14-vs-16-inch-weight-specs-which-to-choose-in-2026",
  "macbook-pro-weight-2025-2026-complete-specs-model-comparison",
  "macbook-pro-weight-comparison-2024-2025-2026-models-explained",
  "macbook-pro-weight-comparison-2025-2026-all-current-models",
  "macbook-pro-weight-by-model-2024-2026-complete-specs-comparison",
  "macbook-pro-weight-by-model-2024-2026-specs-comparison",
  "macbook-pro-weight-comparison-2026-all-models-and-specs",
  "macbook-pro-weight-comparison-2024-2026-models-guide",
  "macbook-pro-weight-by-model-2024-2026-complete-specs-guide",
  "macbook-pro-weight-comparison-2024-2026-latest-models-analyzed",
  "macbook-pro-weight-2025-2026-complete-specs-for-all-models",
  "macbook-pro-weight-comparison-2024-2026-which-model-is-right-for-you",
  "macbook-pro-models-weight-2026-complete-specs-guide",
  "macbook-pro-weight-by-model-2024-2026-complete-comparison-guide",
  "macbook-pro-weight-guide-2024-2026-which-model-is-right-for-you",
  "macbook-pro-weight-2026-m5-and-m5-max-models-compared",
  "macbook-pro-weight-2025-2026-current-models-compared",
  "macbook-pro-weight-comparison-2024-2026-which-model-is-lightest",
  "macbook-pro-weight-guide-2024-2026-all-current-models-compared",
  "macbook-pro-weight-comparison-2026-all-models-analyzed",
  "macbook-pro-14-inch-vs-16-inch-weight-comparison-2024-2025-2026-models",
  "macbook-pro-14-inch-vs-16-inch-weight-size-performance-comparison-2024-2026",
  "macbook-pro-14-vs-16-inch-weight-size-comparison-2024-2026-models",
  "macbook-pro-weight-comparison-2024-2026-latest-models-specs",
  "macbook-pro-14-vs-16-inch-weight-comparison-2024-2026-models-explained",
  "macbook-pro-2024-2025-weight-comparison-why-its-heavier-than-previous-models",
  "macbook-pro-weight-comparison-2025-2026-all-models-analyzed",
  "macbook-pro-weight-comparison-2024-2026-all-models-specs",
  "macbook-pro-14-vs-16-inch-weight-specs-2024-2026-comparison",
  "macbook-pro-weight-comparison-2025-2026-all-models-explained",
  "macbook-pro-weight-2024-2025-why-new-models-are-heavier-how-they-compare",
  "macbook-pro-weight-comparison-2024-2025-and-2026-models-analyzed",
  "macbook-pro-weight-comparison-2026-all-current-models-specs",
  "macbook-pro-weight-2026-all-current-models-compared-specs",
  "macbook-pro-weight-by-model-2024-2026-complete-specifications-guide",
  "macbook-pro-weight-comparison-all-2024-2026-models-explained",
  "macbook-pro-weight-2024-2025-how-modern-models-compare-to-previous-generations",
  "macbook-pro-weight-by-model-2024-2026-complete-breakdown",
  "macbook-pro-weight-2026-complete-specs-for-14-inch-16-inch-models",
  "macbook-pro-weight-all-2024-2026-models-compared",
  "macbook-pro-2024-2025-weight-comparison-why-apples-models-got-heavier",
  "macbook-pro-weight-comparison-2024-2025-2026-models-analyzed",
  "macbook-pro-14-inch-vs-16-inch-weight-comparison-2024-2026-which-is-right-for-yo",
  "macbook-pro-weight-2024-2025-how-new-models-compare-to-previous-generations",
  "macbook-pro-weight-by-model-2024-2026-specs-compared",
  "macbook-pro-weight-2026-all-models-compared-and-specs",
  "macbook-pro-weight-comparison-2024-2026-all-models-specs-guide",
  "macbook-pro-14-inch-vs-16-inch-weight-2024-2025-2026-specs-compared",
  "macbook-pro-weight-comparison-2024-2026-why-the-latest-models-changed",
  "macbook-pro-weight-by-model-2024-2025-and-2026-specs-compared",
  "macbook-pro-weight-comparison-2024-2026-every-model-analyzed",
  "macbook-pro-weight-2024-2026-complete-specs-comparison-guide",
  "macbook-pro-14-inch-vs-16-inch-weight-size-specs-comparison-2024-2026",
  "macbook-pro-weight-2025-2026-complete-guide-to-all-models",
  "macbook-pro-weight-comparison-2024-2025-why-apples-models-got-heavier",
  "macbook-pro-weight-comparison-2026-all-current-models-analyzed",
  "macbook-pro-14-vs-16-inch-weight-size-specs-comparison-2024-2026",
  "macbook-pro-weight-by-model-2024-2025-and-2026-comparison-guide",
  "macbook-pro-weight-2026-complete-guide-to-all-current-models",
  "macbook-pro-weight-comparison-2024-2026-all-models-specs-portability-guide",
  "macbook-pro-14-inch-vs-16-inch-weight-size-specs-compared-2024-2026",
  "macbook-pro-2024-2025-weight-compared-to-previous-models-why-it-matters",
  "macbook-pro-weight-2026-all-models-compared-specifications",
  "macbook-pro-weight-comparison-2024-2026-all-models-spec-guide",
  "macbook-pro-weight-comparison-2024-2026-all-models-analyzed",
  "macbook-pro-2024-weight-compared-to-previous-models-why-did-apple-make-them-heav",
  "macbook-pro-weight-by-model-2024-2025-2026-comparison-guide",
  "macbook-pro-weight-2026-all-models-compared-in-pounds",
];

// DAN-453: second cluster — macbook-weight-* (no "-pro-" segment) auto-generated
// after DAN-452 ran. Same intent as the canonical, redirected accordingly.
const MACBOOK_WEIGHT_DUPES: string[] = [
  "macbook-weight-2026-complete-comparison-of-all-models",
  "macbook-weight-2026-complete-comparison-of-m5-pro-max-air-models",
  "macbook-weight-2026-complete-guide-to-all-models",
  "macbook-weight-2026-complete-guide-to-m5-models",
  "macbook-weight-2026-complete-guide-to-m5-pro-air-models",
  "macbook-weight-2026-complete-guide-to-new-model-specs-comparisons",
  "macbook-weight-2026-complete-guide-to-new-models",
  "macbook-weight-2026-complete-specs-comparison-guide-for-all-models",
  "macbook-weight-2026-complete-specs-for-all-models",
  "macbook-weight-2026-complete-specs-for-m5-models",
  "macbook-weight-2026-complete-specs-for-m5-pro-m5-max-air-models",
  "macbook-weight-2026-full-specs-comparison-of-all-new-models",
  "macbook-weight-2026-how-heavy-are-the-new-m5-models",
  "macbook-weight-2026-how-light-are-apples-new-m5-models",
  "macbook-weight-2026-how-light-are-the-new-m5-models",
  "macbook-weight-2026-m5-models-compared-specs-guide",
];

export const BLOG_REDIRECTS: BlogRedirect[] = [
  ...MACBOOK_PRO_WEIGHT_DUPES,
  ...MACBOOK_WEIGHT_DUPES,
].map((slug) => ({
  source: `/blog/${slug}`,
  destination: MACBOOK_PRO_WEIGHT_CANONICAL,
  permanent: true,
}));
