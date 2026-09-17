/**
 * ROO-16 — client-safe home → compare CTA constants.
 *
 * Keep this module free of server-only imports. Client components
 * (`HomeCompareCTA`) must import from here so the Next.js client bundle
 * never pulls Node-only graphs (posthog-otel / gRPC via resolve-internal-links).
 */

/** Soft explore targets when no live primary compare is available. */
export const HOME_COMPARE_SOFT_HREF = "/search";
export const HOME_COMPARE_TRENDING_HREF = "/trending";

/**
 * Curated above-the-fold chip candidates (labels). Runtime live-filter
 * (DAN-2581) drops anything that would 404 before render.
 */
export const HOME_COMPARE_CHIP_CANDIDATES: ReadonlyArray<{
  slug: string;
  label: string;
}> = [
  { slug: "messi-vs-ronaldo", label: "Messi vs Ronaldo" },
  { slug: "japan-vs-china", label: "Japan vs China" },
  { slug: "iphone-17-vs-samsung-s26", label: "iPhone vs Samsung" },
  { slug: "ww1-vs-ww2", label: "WW1 vs WW2" },
  { slug: "amazon-vs-best-buy", label: "Amazon vs Best Buy" },
  { slug: "capital-one-vs-chase", label: "Capital One vs Chase" },
];

export const HOME_COMPARE_SOURCE = "home";
