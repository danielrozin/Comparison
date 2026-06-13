/**
 * Curated "Featured comparisons" / Editor's picks.
 *
 * These are surfaced on the highest-crawled template surfaces (homepage +
 * category hubs) with descriptive anchors, INDEPENDENT of `viewCount`. New or
 * strategically-important pages start at `viewCount: 0`, so they never appear
 * in the viewCount-ranked homepage `getTrendingComparisons` module or near the
 * top of a category hub's view-sorted grid. This curated override gives them a
 * prominent, crawlable inbound link from those surfaces.
 *
 * Spec: DAN-1003 §4 target-cluster · DAN-1020.
 *
 * Order matters — earlier entries render first (higher priority anchor weight).
 */

export interface FeaturedComparison {
  /** `/compare/{slug}` target. */
  slug: string;
  /** Descriptive anchor text for the inbound link (used as the link label). */
  anchor: string;
  /** One-line supporting blurb shown under the anchor. */
  blurb: string;
  /**
   * Category hub slugs where this comparison should be pinned/featured.
   * Cross-tagged so a single page can surface on multiple topical hubs.
   */
  categories: string[];
}

export const FEATURED_COMPARISONS: FeaturedComparison[] = [
  {
    slug: "amazon-vs-best-buy",
    anchor: "Amazon vs Best Buy",
    blurb: "Online giant vs big-box electronics — pricing, returns, and delivery compared.",
    categories: ["products", "companies", "technology"],
  },
  {
    slug: "capital-one-vs-chase",
    anchor: "Capital One vs Chase",
    blurb: "Credit cards, rewards, and everyday banking — which bank comes out ahead.",
    categories: ["finance", "companies"],
  },
  {
    slug: "ikea-vs-wayfair",
    anchor: "IKEA vs Wayfair",
    blurb: "Flat-pack value vs endless selection — furniture shopping head to head.",
    categories: ["products", "companies"],
  },
];

/** Featured comparisons pinned to a given category hub, in curated order. */
export function getFeaturedForCategory(categorySlug: string): FeaturedComparison[] {
  return FEATURED_COMPARISONS.filter((f) => f.categories.includes(categorySlug));
}
