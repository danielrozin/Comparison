/**
 * ROO-387 — presentation allowlist only.
 *
 * These compares already receive a non-generic shop link from the existing
 * affiliate generator (physical products, not companies or software). The
 * under-verdict row is already above the hero; on a phone it is a small chip
 * beside a longer Pro sentence. This set only changes that row's layout.
 * It does not create partners, tags, or destinations.
 */
export const EARLY_COMMERCE_COMPARE_SLUGS = [
  "iphone-17-vs-samsung-s26",
  "ps5-vs-xbox-series-x",
] as const;

const EARLY_COMMERCE_COMPARE_SLUG_SET = new Set<string>(EARLY_COMMERCE_COMPARE_SLUGS);

export function isEarlyCommerceCompare(slug: string): boolean {
  return EARLY_COMMERCE_COMPARE_SLUG_SET.has(slug);
}
