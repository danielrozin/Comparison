/**
 * ROO-317: what to offer when on-demand comparison generation fails.
 *
 * The visitor asked for a pair we could not build. Show live comparisons
 * that share a side with that pair. When neither side has a live page,
 * show popular comparisons in the same category. Site-wide popular
 * comparisons fill in only when those two lists cannot make three links.
 *
 * This file never talks to the database. Callers pass the rows in.
 */

import { compareHasSide } from "@/lib/blog/blog-compare-fallback";

export const FALLBACK_SUGGESTION_MAX = 4;
/** Below this many stronger matches, fill from the next list. */
const FALLBACK_SUGGESTION_TARGET = 3;

export interface FallbackSuggestion {
  slug: string;
  title: string;
  category?: string | null;
}

export type FallbackSuggestionSource = "entity" | "category" | "popular" | "mixed" | "none";

export interface SelectFallbackSuggestionsInput {
  requestedSlug: string;
  /** Entity slugs from the requested pair, in order (left, then right). */
  entitySlugs: readonly string[];
  /** Live comparisons for each entity slug, same order as `entitySlugs`. */
  byEntity: readonly (readonly FallbackSuggestion[])[];
  categoryComparisons: readonly FallbackSuggestion[];
  popularComparisons: readonly FallbackSuggestion[];
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readableTitle(slug: string): string {
  return slug
    .split("-vs-")
    .map((part) => part.replace(/-/g, " "))
    .join(" vs ");
}

function normalize(row: FallbackSuggestion): FallbackSuggestion | null {
  const slug = row.slug?.trim().toLowerCase() ?? "";
  if (!SLUG.test(slug) || !slug.includes("-vs-")) return null;
  const title = row.title?.trim() || readableTitle(slug);
  const category = row.category?.trim() || null;
  return { slug, title, category };
}

function dedupe(rows: readonly FallbackSuggestion[]): FallbackSuggestion[] {
  const seen = new Set<string>();
  const out: FallbackSuggestion[] = [];
  for (const raw of rows) {
    const row = normalize(raw);
    if (!row || seen.has(row.slug)) continue;
    seen.add(row.slug);
    out.push(row);
  }
  return out;
}

function interleave(groups: readonly (readonly FallbackSuggestion[])[]): FallbackSuggestion[] {
  const out: FallbackSuggestion[] = [];
  const max = groups.reduce((longest, group) => Math.max(longest, group.length), 0);
  for (let index = 0; index < max; index++) {
    for (const group of groups) {
      const row = group[index];
      if (row) out.push(row);
    }
  }
  return out;
}

/**
 * The category that shows up most often on the entity matches.
 * "general" is the classifier's "I don't know" bucket, so it is ignored.
 * Returns the category text as stored, for a case-insensitive lookup.
 */
export function dominantSuggestionCategory(rows: readonly FallbackSuggestion[]): string | null {
  const counts = new Map<string, { count: number; label: string }>();
  for (const row of rows) {
    const label = row.category?.trim() ?? "";
    const key = label.toLowerCase();
    if (!key || key === "general") continue;
    const current = counts.get(key);
    if (current) current.count += 1;
    else counts.set(key, { count: 1, label });
  }
  let best: { count: number; label: string } | null = null;
  for (const value of counts.values()) {
    if (!best || value.count > best.count) best = value;
  }
  return best?.label ?? null;
}

function entityMatches(
  entitySlugs: readonly string[],
  byEntity: readonly (readonly FallbackSuggestion[])[],
  requestedSlug: string,
): FallbackSuggestion[] {
  const sides = entitySlugs.map((slug) => slug.trim().toLowerCase()).filter(Boolean);
  const both: FallbackSuggestion[] = [];
  const perSide: FallbackSuggestion[][] = sides.map(() => []);
  const seenBoth = new Set<string>();

  byEntity.forEach((rows, index) => {
    const side = sides[index];
    if (!side) return;
    for (const raw of rows) {
      const row = normalize(raw);
      // The address that just failed is not a suggestion. The swapped order
      // is kept: that URL can be a live page of the same two sides.
      if (!row || row.slug === requestedSlug) continue;
      const hits = sides.filter((candidate) => compareHasSide(row.slug, candidate)).length;
      // A database "slug contains" match can be a different subject.
      // Keep the row only when one of the requested sides is a real side.
      if (hits >= 2) {
        if (seenBoth.has(row.slug)) continue;
        seenBoth.add(row.slug);
        both.push(row);
      } else if (hits === 1 && compareHasSide(row.slug, side)) {
        perSide[index].push(row);
      }
    }
  });

  return dedupe([...both, ...interleave(perSide)]);
}

function take(
  rows: readonly FallbackSuggestion[],
  into: FallbackSuggestion[],
  seen: Set<string>,
  requestedSlug: string,
  limit: number,
) {
  for (const raw of rows) {
    if (into.length >= limit) return;
    const row = normalize(raw);
    if (!row || seen.has(row.slug) || row.slug === requestedSlug) continue;
    seen.add(row.slug);
    into.push(row);
  }
}

export function selectGenerationFallbackSuggestions(
  input: SelectFallbackSuggestionsInput,
): { suggestions: FallbackSuggestion[]; source: FallbackSuggestionSource } {
  const requestedSlug = input.requestedSlug.trim().toLowerCase();
  const entityOrdered = entityMatches(input.entitySlugs, input.byEntity, requestedSlug);
  const picked: FallbackSuggestion[] = [];
  const seen = new Set<string>();

  take(entityOrdered, picked, seen, requestedSlug, FALLBACK_SUGGESTION_MAX);
  const entityCount = picked.length;

  // Same-category pages are the next best thing. Fill toward 4.
  if (picked.length < FALLBACK_SUGGESTION_MAX) {
    take(input.categoryComparisons, picked, seen, requestedSlug, FALLBACK_SUGGESTION_MAX);
  }
  const categoryCount = picked.length - entityCount;

  // Site-wide popular pages are the last resort, and only to reach 3.
  if (picked.length < FALLBACK_SUGGESTION_TARGET) {
    take(input.popularComparisons, picked, seen, requestedSlug, FALLBACK_SUGGESTION_MAX);
  }
  const popularCount = picked.length - entityCount - categoryCount;

  let source: FallbackSuggestionSource = "none";
  const kinds = [entityCount > 0, categoryCount > 0, popularCount > 0].filter(Boolean).length;
  if (kinds > 1) source = "mixed";
  else if (entityCount > 0) source = "entity";
  else if (categoryCount > 0) source = "category";
  else if (popularCount > 0) source = "popular";

  return { suggestions: picked, source };
}
