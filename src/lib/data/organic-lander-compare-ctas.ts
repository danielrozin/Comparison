/**
 * ROO-127 — compare links for organic blog landers that bounce before a
 * product event. Reuses the ROO-119 cashier's-check pattern: curated slugs
 * that are also `BLOG_COMPARE_FALLBACKS`, then dropped unless
 * `filterLiveCompareSlugs` kept them.
 *
 * Labels name the matchup. They do not declare a winner or add specs.
 */

export const MACBOOK_PRO_WEIGHT_BLOG_SLUG =
  "macbook-pro-weight-2025-2026-complete-specs-comparison-guide";
export const MACBOOK_AIR_WEIGHT_BLOG_SLUG =
  "macbook-air-weight-comparison-2025-2026-which-model-is-right-for-you";
/**
 * Live article. `/blog/best-navigation-apps-2026` 404s; this is the published slug.
 */
export const NAVIGATION_APPS_BLOG_SLUG =
  "best-navigation-apps-2026-google-maps-waze-and-apple-maps-compared";

export interface OrganicCompareLink {
  slug: string;
  label: string;
}

export interface OrganicLanderCompare {
  blogSlug: string;
  /** PostHog `source_page`: the blog path, not the slug alone. */
  sourcePage: string;
  heading: string;
  links: readonly OrganicCompareLink[];
}

export const ORGANIC_LANDER_COMPARES: readonly OrganicLanderCompare[] = [
  {
    blogSlug: MACBOOK_PRO_WEIGHT_BLOG_SLUG,
    sourcePage: `/blog/${MACBOOK_PRO_WEIGHT_BLOG_SLUG}`,
    heading: "Compare MacBooks and laptops",
    // The post is a 14-inch vs 16-inch Pro weight guide. Air vs Pro is the
    // other weight choice. Mac vs Windows is the live platform alternative
    // (no published Dell XPS vs MacBook Pro page).
    links: [
      {
        slug: "macbook-pro-14-vs-macbook-pro-16",
        label: "Compare MacBook Pro 14-inch vs 16-inch",
      },
      {
        slug: "macbook-air-vs-macbook-pro",
        label: "Compare MacBook Air vs MacBook Pro",
      },
      { slug: "mac-vs-windows", label: "Compare Mac vs Windows" },
    ],
  },
  {
    blogSlug: MACBOOK_AIR_WEIGHT_BLOG_SLUG,
    sourcePage: `/blog/${MACBOOK_AIR_WEIGHT_BLOG_SLUG}`,
    heading: "Compare MacBooks and laptops",
    // "Which Air is right" plus the Windows ultraportable and the Pro step-up.
    links: [
      {
        slug: "macbook-air-m3-vs-macbook-air-m4",
        label: "Compare MacBook Air M3 vs M4",
      },
      {
        slug: "dell-xps-13-vs-macbook-air",
        label: "Compare Dell XPS 13 vs MacBook Air",
      },
      {
        slug: "macbook-air-vs-macbook-pro",
        label: "Compare MacBook Air vs MacBook Pro",
      },
    ],
  },
  {
    blogSlug: NAVIGATION_APPS_BLOG_SLUG,
    sourcePage: `/blog/${NAVIGATION_APPS_BLOG_SLUG}`,
    heading: "Compare navigation apps",
    // Maps compares are published editorial pages. Android vs iOS stays
    // because Apple Maps is iPhone-only and the other two run on both.
    links: [
      { slug: "google-maps-vs-waze", label: "Compare Google Maps vs Waze" },
      {
        slug: "google-maps-vs-apple-maps",
        label: "Compare Google Maps vs Apple Maps",
      },
      { slug: "android-vs-ios", label: "Compare Android vs iOS" },
    ],
  },
];

/** Keep curated order. Drop anything the live-slug filter did not return. */
export function selectOrganicLanderCompare(
  blogSlug: string,
  liveSlugs: readonly string[],
): { sourcePage: string; heading: string; links: OrganicCompareLink[] } | null {
  const config = ORGANIC_LANDER_COMPARES.find((entry) => entry.blogSlug === blogSlug);
  if (!config) return null;
  const live = new Set(liveSlugs);
  return {
    sourcePage: config.sourcePage,
    heading: config.heading,
    links: config.links.filter((link) => live.has(link.slug)),
  };
}
