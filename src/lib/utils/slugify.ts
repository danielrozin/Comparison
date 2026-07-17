export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Transliterate common non-Latin characters to ASCII equivalents
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    // Keep Unicode letters, digits, spaces, and hyphens (supports Hebrew, Arabic, CJK, etc.)
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function comparisonSlug(entityA: string, entityB: string): string {
  const a = slugify(entityA);
  const b = slugify(entityB);
  // Always sort alphabetically for canonical consistency
  return a < b ? `${a}-vs-${b}` : `${b}-vs-${a}`;
}

/**
 * N-entity canonical slug builder. Sorts alphabetically and joins with -vs-.
 * For N=2 produces the same result as comparisonSlug().
 */
export function comparisonSlugN(entities: string[]): string {
  return entities
    .map(slugify)
    .filter((s) => s.length > 0)
    .sort()
    .join("-vs-");
}

/**
 * Canonicalizes an existing comparison slug by sorting its `-vs-` segments
 * alphabetically — the same ordering rule comparisonSlug()/comparisonSlugN()
 * apply at generation time. Used to detect/prevent A-vs-B vs B-vs-A duplicate
 * orderings (DAN-1265). Returns the input unchanged if it has no `-vs-`.
 *
 *   sortComparisonSlug("roomba-vs-roborock") === "roborock-vs-roomba"
 */
export function sortComparisonSlug(slug: string): string {
  if (!slug.includes("-vs-")) return slug;
  const parts = slug
    .split("-vs-")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (parts.length < 2) return slug;
  return [...parts].sort().join("-vs-");
}

/**
 * Parses a comparison slug into N entity slugs.
 *
 * For backward compatibility, returns entityA/entityB (first two entries)
 * alongside the full entities array. Callers that need N-entity support
 * should read `entities`.
 *
 * Returns null when the slug does not contain `-vs-` or any segment is empty.
 */
export function parseComparisonSlug(
  slug: string
): { entityA: string; entityB: string; entities: string[] } | null {
  if (!slug.includes("-vs-")) return null;
  const parts = slug.split("-vs-").map((p) => p.trim()).filter((p) => p.length > 0);
  if (parts.length < 2) return null;
  return { entityA: parts[0], entityB: parts[1], entities: parts };
}

/**
 * A degenerate comparison is one that pits an entity against itself
 * (e.g. `grubhub-vs-grubhub`, or an N-way slug with a repeated entity).
 * These are thin/duplicate-content dead-ends that waste crawl budget and
 * dilute quality signals, so they must never be rendered or sitemapped
 * (DAN: self-comparison crawl-quality guard). Comparison is case-insensitive
 * since the slug is already lowercased upstream but callers may pass raw input.
 */
export function isDegenerateComparisonSlug(slug: string): boolean {
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return false;
  const seen = new Set<string>();
  for (const entity of parsed.entities) {
    const key = entity.toLowerCase();
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}

/**
 * Keyword/year suffix tails the enrichment cron occasionally carries into an
 * entity token. A Tavily/discovery topic named "China economic comparison 2026"
 * slugifies to the token `china-economic-comparison-2026`, which is NOT a
 * distinct entity — it is the same matchup with an SEO tail. Because it parses
 * as a distinct entity pair, neither the ordering-sort (sortComparisonSlug) nor
 * the consolidation map recognises it as the existing base pair, so the cron
 * mints a net-new near-duplicate page (the DAN-2323 drift; root cause DAN-2324).
 *
 * The list is intentionally an allowlist of the exact tails observed in the
 * DAN-2323 cleanup (…-2026, …-comparison-2026, …-population, …-economic-comparison-2026,
 * …-revenue-comparison-2026). Compound tails MUST precede their shorter substrings
 * so "-economic-comparison" is matched before "-comparison".
 */
const ENTITY_KEYWORD_SUFFIXES = [
  "economic-comparison",
  "revenue-comparison",
  "comparison",
  "population",
  "specs",
  "performance",
];

// Trailing calendar-year tail: -2020 … -2039. Conservative range so a legit
// model-year entity outside this window ("civic-1998") is left intact.
const ENTITY_YEAR_SUFFIX = /-20[2-3][0-9]$/;

/**
 * Strips known keyword/year tails from a single entity token, repeatedly, until
 * a fixed point (so `china-economic-comparison-2026` → `china`). A suffix is only
 * removed when it leaves a non-empty base, so a bare token that IS the suffix
 * ("specs", "2026") is preserved. Idempotent and allowlist-driven (DAN-2324).
 */
export function stripEntityKeywordSuffix(token: string): string {
  let t = token;
  let changed = true;
  while (changed) {
    changed = false;
    const yearStripped = t.replace(ENTITY_YEAR_SUFFIX, "");
    if (yearStripped !== t && yearStripped.length > 0) {
      t = yearStripped;
      changed = true;
    }
    for (const suffix of ENTITY_KEYWORD_SUFFIXES) {
      if (t.endsWith(`-${suffix}`)) {
        const base = t.slice(0, -(suffix.length + 1));
        if (base.length > 0) {
          t = base;
          changed = true;
          break;
        }
      }
    }
  }
  return t;
}

/**
 * Given a comparison slug, strips keyword/year tails from each entity token and
 * returns the re-sorted canonical BASE slug — but ONLY when stripping actually
 * changed a token AND the result is not degenerate (stripping must not collapse
 * two distinct tokens into a self-comparison, e.g. `netflix-2026-vs-netflix`).
 * Returns null otherwise, so callers can cheaply detect "no suffix to strip".
 *
 * Callers use this to re-check getComparisonBySlug(baseSlug) before minting a
 * net-new page: if the clean canonical already exists, skip/serve it instead of
 * publishing a keyword-suffixed near-duplicate (DAN-2324).
 *
 *   stripKeywordSuffixSlug("california-population-vs-texas-2026") === "california-vs-texas"
 *   stripKeywordSuffixSlug("disney-vs-netflix") === null            // nothing to strip
 */
export function stripKeywordSuffixSlug(slug: string): string | null {
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return null;
  const stripped = parsed.entities.map(stripEntityKeywordSuffix);
  const changed = stripped.some((t, i) => t !== parsed.entities[i]);
  if (!changed) return null;
  // Never collapse a real pair into a self-comparison.
  if (new Set(stripped).size < stripped.length) return null;
  return [...stripped].sort().join("-vs-");
}

/**
 * Returns true when a slug contains only lowercase alphanumeric characters and
 * hyphens — i.e. the set that slugify() produces. Slugs with `)`, `(`, spaces,
 * or other special characters are DB corruption artifacts and must never be
 * sitemapped or rendered as their own canonical URL.
 */
export function isCleanSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * Strips known corruption suffixes from a comparison slug and returns the
 * cleaned version so malformed variants can be redirected to the real page.
 * Returns the input unchanged when no corruption is detected.
 *
 * Known patterns (from DB corruption incident):
 *   - Trailing `)` or `))` — markdown link parsing artifact
 *   - `-keyword-suffix` — SEO-variant generation artifact
 */
export function cleanComparisonSlug(slug: string): string {
  return slug
    .replace(/\)+$/, "")          // strip trailing ) or ))
    .replace(/-keyword-suffix$/, "") // strip -keyword-suffix
    .replace(/\)+$/, "")          // strip any ) exposed after suffix removal
    .replace(/-+$/, "");          // strip trailing hyphens
}
