/**
 * ROO-119 — compare links for /blog/how-to-get-a-cashiers-check.
 *
 * Each slug is a canonical compare (not a redirect source), appears in repo
 * compare data, and is listed in the comparison sitemap. The article page
 * still drops any slug `filterLiveCompareSlugs` does not keep.
 */

export const CASHIERS_CHECK_BLOG_SLUG = "how-to-get-a-cashiers-check";

/**
 * PostHog `source_page` for these clicks. The value is the blog path so
 * `related_comparison_click` and the destination `comparison_viewed` can be
 * tied back to this lander.
 */
export const CASHIERS_CHECK_SOURCE_PAGE = "/blog/how-to-get-a-cashiers-check";

export interface CashiersCheckCompareLink {
  slug: string;
  label: string;
}

/**
 * Banks named in the post, plus the live money-transfer comparison.
 * Labels stay descriptive and do not declare a winner.
 */
export const CASHIERS_CHECK_COMPARE_LINKS: readonly CashiersCheckCompareLink[] = [
  { slug: "bank-of-america-vs-chase", label: "Chase vs Bank of America" },
  { slug: "capital-one-vs-chase", label: "Capital One vs Chase" },
  { slug: "revolut-vs-wise", label: "Revolut vs Wise" },
];

/** Keep curated order. Drop anything the live-slug filter did not return. */
export function selectCashiersCheckCompareLinks(
  liveSlugs: readonly string[],
): CashiersCheckCompareLink[] {
  const live = new Set(liveSlugs);
  return CASHIERS_CHECK_COMPARE_LINKS.filter((link) => live.has(link.slug));
}

/**
 * Split rendered article HTML so a CTA can sit directly under the intro.
 * A leftover markdown H1 (`# Title` rendered as a paragraph) is not the intro.
 */
export function splitHtmlAfterIntro(
  html: string,
): { lead: string; rest: string } | null {
  const matches = [...html.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)];
  if (matches.length === 0) return null;

  const textOf = (match: RegExpMatchArray) =>
    match[0].replace(/<[^>]+>/g, "").trim();

  let target = matches[0];
  if (matches.length > 1 && /^#\s+/.test(textOf(matches[0]))) {
    target = matches[1];
  }

  const end = (target.index ?? 0) + target[0].length;
  if (end <= 0) return null;
  return { lead: html.slice(0, end), rest: html.slice(end) };
}
