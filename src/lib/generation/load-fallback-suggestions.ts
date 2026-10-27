/**
 * Loads the rows `selectGenerationFallbackSuggestions` ranks.
 * Every lookup is injected so tests do not need a database.
 */

import { classifyComparison } from "@/lib/services/categorizer";
import { parseComparisonSlug } from "@/lib/utils/slugify";
import {
  dominantSuggestionCategory,
  selectGenerationFallbackSuggestions,
  type FallbackSuggestion,
  type FallbackSuggestionSource,
} from "@/lib/generation/fallback-suggestions";

export interface FallbackSuggestionDeps {
  comparisonsForEntity: (entitySlug: string) => Promise<FallbackSuggestion[]>;
  comparisonsByCategory: (category: string, limit: number) => Promise<FallbackSuggestion[]>;
  popularComparisons: (limit: number) => Promise<FallbackSuggestion[]>;
}

export interface LoadedFallbackSuggestions {
  suggestions: FallbackSuggestion[];
  source: FallbackSuggestionSource;
}

async function safeRows(
  load: () => Promise<FallbackSuggestion[]>,
): Promise<FallbackSuggestion[]> {
  try {
    const rows = await load();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

/** Category from the name classifier, or null when it only knows "general". */
export function inferredComparisonCategory(entityA: string, entityB: string): string | null {
  const classified = classifyComparison(entityA.replace(/-/g, " "), entityB.replace(/-/g, " "));
  const category = classified.category?.trim() ?? "";
  if (!category || category.toLowerCase() === "general") return null;
  return category;
}

export async function loadGenerationFallbackSuggestions(
  slug: string,
  deps: FallbackSuggestionDeps,
): Promise<LoadedFallbackSuggestions> {
  const requestedSlug = slug.trim().toLowerCase();
  const parsed = parseComparisonSlug(requestedSlug);
  const entitySlugs =
    parsed && parsed.entities.length === 2 ? [parsed.entityA, parsed.entityB] : [];

  const byEntity = await Promise.all(
    entitySlugs.map((entitySlug) => safeRows(() => deps.comparisonsForEntity(entitySlug))),
  );

  const entityOnly = selectGenerationFallbackSuggestions({
    requestedSlug,
    entitySlugs,
    byEntity,
    categoryComparisons: [],
    popularComparisons: [],
  });

  let categoryComparisons: FallbackSuggestion[] = [];
  if (entityOnly.suggestions.length < 3 && entitySlugs.length === 2) {
    const category =
      dominantSuggestionCategory(entityOnly.suggestions) ??
      inferredComparisonCategory(entitySlugs[0], entitySlugs[1]);
    if (category) {
      categoryComparisons = await safeRows(() => deps.comparisonsByCategory(category, 8));
    }
  }

  const withCategory = selectGenerationFallbackSuggestions({
    requestedSlug,
    entitySlugs,
    byEntity,
    categoryComparisons,
    popularComparisons: [],
  });

  let popularComparisons: FallbackSuggestion[] = [];
  if (withCategory.suggestions.length < 3) {
    popularComparisons = await safeRows(() => deps.popularComparisons(8));
  }

  return selectGenerationFallbackSuggestions({
    requestedSlug,
    entitySlugs,
    byEntity,
    categoryComparisons,
    popularComparisons,
  });
}
