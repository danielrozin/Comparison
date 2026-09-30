/**
 * Decides whether Enter opens /compare/<slug> or /search.
 *
 * A normal "vs" query within main's 5-word / 60-character side limit still
 * opens /compare immediately, even when that page does not exist yet.
 *
 * Two cases wait for the dropdown (or /api/search) and only open /compare
 * when that exact slug is a row fetched for this query:
 * - the separator was "x" / "×" ("messi x ronaldo", not "spy x family")
 * - a side is longer than main's old limit (SEO-style queries)
 *
 * Results from a previous query are ignored. Until the fetch for this text
 * settles, those two cases go to /search.
 */

import { parseComparisonQuery } from "@/lib/parse-comparison-query";
import { normalizeQuery } from "@/lib/search/search-session";

export interface SettledSearchResults {
  /** The query string these rows were fetched for. */
  query: string;
  slugs: string[];
}

const EXTENDED_MAX_SIDE_WORDS = 8;
const EXTENDED_MAX_SIDE_CHARS = 80;

export function settledSearchResults(
  query: string,
  resultsQuery: string | null,
  results: { slug: string }[],
): SettledSearchResults | null {
  if (resultsQuery == null) return null;
  if (normalizeQuery(resultsQuery) !== normalizeQuery(query)) return null;
  return { query: resultsQuery, slugs: results.map((row) => row.slug) };
}

function slugIsLive(slug: string, query: string, settled: SettledSearchResults | null): boolean {
  if (!settled) return false;
  if (normalizeQuery(settled.query) !== normalizeQuery(query)) return false;
  return settled.slugs.includes(slug);
}

/**
 * Slug to open under /compare, or null when the person should land on /search.
 */
export function compareSlugForQuery(query: string, settled: SettledSearchResults | null): string | null {
  const parsed = parseComparisonQuery(query);
  if (parsed.parsed && parsed.slug) {
    if (parsed.separator === "x" && !slugIsLive(parsed.slug, query, settled)) return null;
    return parsed.slug;
  }

  // Sides longer than main's 5-word / 60-character limit. Open /compare
  // only when that slug is already a row for this query.
  const relaxed = parseComparisonQuery(query, {
    maxSideWords: EXTENDED_MAX_SIDE_WORDS,
    maxSideChars: EXTENDED_MAX_SIDE_CHARS,
  });
  if (!relaxed.parsed || !relaxed.slug) return null;
  if (!slugIsLive(relaxed.slug, query, settled)) return null;
  return relaxed.slug;
}
