/**
 * Close-match suggestion for site search.
 *
 * The parser rewrites a few confident queries onto the live page
 * ("hbo vs netflix" → hbo-max-vs-netflix). Everything else that shares
 * both sides with an existing comparison is a "did you mean" suggestion.
 * We never invent a page — the suggestion is always a row the search
 * already returned.
 */

import { parseComparisonQuery } from "@/lib/parse-comparison-query";
import { parseComparisonSlug } from "@/lib/utils/slugify";

export interface SearchHit {
  slug: string;
  title: string;
}

export interface DidYouMean {
  slug: string;
  title: string;
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function sideScore(queryEntity: string, resultEntity: string): number {
  if (!queryEntity || !resultEntity) return 0;
  if (queryEntity === resultEntity) return 5;
  if (
    resultEntity.startsWith(`${queryEntity}-`) ||
    queryEntity.startsWith(`${resultEntity}-`)
  ) {
    return 3;
  }
  if (queryEntity.length < 3 || resultEntity.length < 3) return 0;
  if (resultEntity.includes(queryEntity) || queryEntity.includes(resultEntity)) return 2;
  return 0;
}

function bestSide(queryEntity: string, resultEntities: string[]): { entity: string; score: number } {
  let best = { entity: "", score: 0 };
  for (const entity of resultEntities) {
    const score = sideScore(queryEntity, entity);
    if (score > best.score) best = { entity, score };
  }
  return best;
}

/**
 * The live page to offer when the typed text is not already that page's title.
 * Returns null when nothing in `results` covers both sides, or when the
 * query already is the matching title (no need to say "did you mean").
 */
export function suggestExistingComparison(query: string, results: SearchHit[]): DidYouMean | null {
  const parsed = parseComparisonQuery(query);
  if (!parsed.parsed || !parsed.slug) return null;
  const sides = parseComparisonSlug(parsed.slug);
  if (!sides || sides.entities.length !== 2) return null;
  const [left, right] = sides.entities;

  let best: { hit: SearchHit; score: number } | null = null;
  for (const hit of results) {
    const parts = parseComparisonSlug(hit.slug);
    if (!parts) continue;
    const scoreLeft = bestSide(left, parts.entities);
    const scoreRight = bestSide(right, parts.entities);
    if (scoreLeft.score === 0 || scoreRight.score === 0) continue;
    if (scoreLeft.entity === scoreRight.entity) continue;
    const score = scoreLeft.score + scoreRight.score + (hit.slug === parsed.slug ? 10 : 0);
    if (!best || score > best.score) best = { hit, score };
  }
  if (!best) return null;
  if (normalizeTitle(query) === normalizeTitle(best.hit.title)) return null;
  return { slug: best.hit.slug, title: best.hit.title };
}

/** Entity tokens of a parsed comparison, taken from the canonical slug. */
export function parsedEntityTokens(query: string): string[] | null {
  const parsed = parseComparisonQuery(query);
  if (!parsed.parsed || !parsed.slug) return null;
  const parts = parseComparisonSlug(parsed.slug);
  if (!parts || parts.entities.length !== 2) return null;
  return parts.entities;
}

export function parsedSlugForQuery(query: string): string | null {
  const parsed = parseComparisonQuery(query);
  return parsed.parsed ? parsed.slug : null;
}
