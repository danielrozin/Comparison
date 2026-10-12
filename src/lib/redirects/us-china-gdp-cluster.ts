/**
 * ROO-24 — US ↔ China GDP soft-404 redirect cluster.
 *
 * Product (2026-09-17) locked the citation canonical at
 * `/compare/us-vs-china-gdp` (live 200). GDP phrasing variants that 404
 * must 301 there. Related live pages stay put — they are distinct intents
 * (general usa-vs-china, economy facet, nominal-GDP facet, military/tech,
 * three-way India) and must never be folded into the GDP H1.
 *
 * Two layers:
 *   1. Explicit aliases — Product-listed samples + the same US↔China GDP
 *      phrasing seen in the thin-audit / 404 dump. These ship in
 *      next.config redirects() so they 301 at the edge.
 *   2. A conservative pattern matcher used only after getStaticProps has
 *      already decided the slug is unpublished, so a later live facet
 *      (per-capita, military, …) cannot be stolen by the rule.
 *
 * These aliases were never catalog pages. Do not add them to
 * REDIRECTED_COMPARE_SLUGS — that list drives published-corpus math
 * (DAN-2067 / DAN-2112) and treating a 404 as a "retired published slug"
 * would falsely shrink the advertised catalog.
 */

export const US_CHINA_GDP_CANONICAL = "us-vs-china-gdp";

/** Live related pages — do not redirect. Product confirm 2026-09-17. */
export const US_CHINA_GDP_LIVE_RELATED = [
  "us-economy-vs-china-economy",
  "usa-vs-china",
  "china-vs-us-gdp-military-tech-comparison-2026",
  "us-nominal-gdp-vs-china-2026",
  "usa-vs-china-vs-india-gdp-2026",
] as const;

/**
 * Soft-404 GDP phrasing aliases → Product-locked canonical.
 * First four are the ROO-24 / live-audit 2026-09-20 samples.
 */
export const US_CHINA_GDP_SOFT_404_ALIASES = [
  "china-vs-united-states-gdp-comparison-2026",
  "current-nominal-gdp-us-vs-china-2026",
  "china-vs-us-gdp-nominal-2026",
  "american-economy-vs-china",
  // Same US↔China GDP intent (thin-audit / 404 dump). Not live related.
  "china-vs-us-gdp-nominal-and-ppp-2026",
  "us-vs-china-gdp-2026-latest-figures",
  "us-vs-china-gdp-economy-comparison-2026",
  "united-states-vs-china-gdp",
  "united-states-vs-china-gdp-comparison-2026",
  "china-vs-usa-gdp",
  "usa-vs-china-gdp",
  "us-vs-china-gdp-comparison",
] as const;

const PROTECTED = new Set<string>([
  US_CHINA_GDP_CANONICAL,
  ...US_CHINA_GDP_LIVE_RELATED,
]);

function isProtectedSlug(slug: string): boolean {
  return PROTECTED.has(slug);
}

export const US_CHINA_GDP_CLUSTER_REDIRECTS: Record<string, string> = {};
for (const alias of US_CHINA_GDP_SOFT_404_ALIASES) {
  if (!isProtectedSlug(alias)) {
    US_CHINA_GDP_CLUSTER_REDIRECTS[alias] = US_CHINA_GDP_CANONICAL;
  }
}

const US_TOKEN = /(^|-)(us|usa|u-s|united-states|america|american)(-|$)/;
const CHINA_TOKEN = /(^|-)(china|chinese)(-|$)/;
const GDP_TOKEN = /(^|-)gdp(-|$)/;
/** Third-country or sibling-facet tokens — not this cluster. */
const EXCLUDED_TOKEN = /(^|-)(india|japan|russia|germany|uk|britain|military|tech|per-capita)(-|$)/;

/**
 * Conservative unpublished-only matcher: US + China + GDP, no sibling facet
 * and no third country. Callers must already know the slug is not a live page.
 */
export function matchesUsChinaGdpAliasPattern(slug: string): boolean {
  if (isProtectedSlug(slug)) return false;
  if (EXCLUDED_TOKEN.test(slug)) return false;
  return US_TOKEN.test(slug) && CHINA_TOKEN.test(slug) && GDP_TOKEN.test(slug);
}

/** Explicit map only — safe for the edge redirect list and catalog lookups. */
export function getExplicitUsChinaGdpRedirect(slug: string): string | null {
  if (isProtectedSlug(slug)) return null;
  return US_CHINA_GDP_CLUSTER_REDIRECTS[slug] ?? null;
}

/**
 * Resolve a US↔China GDP soft-404 to the canonical. Includes the unpublished
 * pattern so getStaticProps can 301 novel phrasing without a redeploy of the
 * edge map. Never returns a target for the canonical or live related pages.
 */
export function resolveUsChinaGdpRedirect(slug: string): string | null {
  if (isProtectedSlug(slug)) return null;
  if (US_CHINA_GDP_CLUSTER_REDIRECTS[slug]) return US_CHINA_GDP_CANONICAL;
  if (matchesUsChinaGdpAliasPattern(slug)) return US_CHINA_GDP_CANONICAL;
  return null;
}

export function isUsChinaGdpLiveRelated(slug: string): boolean {
  return (US_CHINA_GDP_LIVE_RELATED as readonly string[]).includes(slug);
}
