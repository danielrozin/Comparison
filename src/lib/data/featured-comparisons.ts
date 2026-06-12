// DAN-1013: curated "Featured Comparisons" internal-linking module.
//
// Sculpts internal PageRank into the 3 /compare/* page-1 push targets from the
// two highest-authority surfaces we fully control — the homepage and the
// category hubs — which previously linked to these pages from NOWHERE (their
// only inbound links came from the algorithmic "Related Comparisons" sidebar of
// sibling pages; see DAN-1006 for that lever).
//
// Weighting (per analyst, DAN-1003 target-cluster): amazon-vs-best-buy is the
// highest-volume / cleanest-head-term target, so it gets the MOST surfaces
// (homepage + technology + companies + products). Anchors are exact-match.

export interface FeaturedComparison {
  /** comparison slug — resolves to /compare/{slug} */
  slug: string;
  /** exact-match anchor text for the link (do not paraphrase) */
  anchor: string;
  /** short supporting blurb shown under the anchor */
  blurb: string;
  /** which surfaces this card appears on */
  surfaces: {
    home: boolean;
    /** category-hub slugs (see CATEGORIES in constants.ts) */
    categories: string[];
  };
}

export const FEATURED_COMPARISONS: FeaturedComparison[] = [
  {
    slug: "amazon-vs-best-buy",
    anchor: "Amazon vs Best Buy",
    blurb: "Online giant vs big-box electronics retailer — pricing, returns, and selection compared.",
    surfaces: { home: true, categories: ["technology", "companies", "products"] },
  },
  {
    slug: "capital-one-vs-chase",
    anchor: "Capital One vs Chase",
    blurb: "Two of the biggest U.S. card issuers head-to-head on rewards, fees, and perks.",
    surfaces: { home: true, categories: ["finance", "products"] },
  },
  {
    slug: "ikea-vs-wayfair",
    anchor: "IKEA vs Wayfair",
    blurb: "Flat-pack value vs an endless online catalog for furnishing your home.",
    surfaces: { home: true, categories: ["products", "brands"] },
  },
];

/** Featured cards for the homepage, in curated order (amazon-vs-best-buy first). */
export function getFeaturedForHome(): FeaturedComparison[] {
  return FEATURED_COMPARISONS.filter((f) => f.surfaces.home);
}

/** Featured cards for a given category-hub slug. */
export function getFeaturedForCategory(slug: string): FeaturedComparison[] {
  return FEATURED_COMPARISONS.filter((f) => f.surfaces.categories.includes(slug));
}
