/**
 * Whether a visitor-requested comparison may be indexed.
 *
 * Passing pages are `published` (sitemap + indexable). Failing pages stay
 * `provisional`: live at the permanent URL, robots noindex, absent from the
 * sitemap. Cron and batch saves do not use this quality bar. They keep
 * DAN-1886 (`archived` for auto-generated pages) unless the slug is on
 * HUMAN_REVIEWED_SLUGS. The stored isHumanReviewed column does not
 * publish a row or skip these checks.
 *
 * The bar is the existing quality gate, the numeric self-contradiction guard,
 * and a minimum-sources/data check defined here:
 *   - at least 2 distinct sources on citationStats
 *   - at least one numeric data point in attributes or key differences
 */

import { isHumanReviewedSlug } from "@/lib/editorial/human-reviewed";
import { distinctSources } from "@/lib/generation/citation-sources";
import { assessComparisonQuality, isSubstantiveValue, MIN_SUBSTANTIVE_ATTRIBUTES } from "@/lib/services/comparison-quality";
import { describeContradictions, findSelfContradictions } from "@/lib/services/numeric-claim-guard";

export const MIN_USER_GENERATION_SOURCES = 2;

export type SaveOrigin = "batch" | "user";
export type PersistedComparisonStatus = "published" | "archived" | "provisional";

export interface PromotionDecision {
  pass: boolean;
  reasons: string[];
  score: number;
}

/**
 * How many distinct sources the gate can see.
 *
 * When a source list is stored, that list wins. A declared `sourceCount` of 0
 * used to hide two real Tavily URLs, and a declared count with no list is
 * still accepted so older rows and tests that only set the number keep working.
 */
export function userGenerationSourceCount(comparison: {
  citationStats?: { sourceCount?: number; sources?: unknown[] } | null;
}): number {
  const stats = comparison.citationStats;
  if (!stats) return 0;
  if (Array.isArray(stats.sources) && stats.sources.length > 0) {
    return distinctSources(
      stats.sources.filter(isCitationSource).map((source) => ({
        name: typeof source.name === "string" ? source.name : "",
        url: typeof source.url === "string" ? source.url : undefined,
      })),
    ).length;
  }
  if (typeof stats.sourceCount === "number" && Number.isFinite(stats.sourceCount)) {
    return stats.sourceCount;
  }
  return 0;
}

function isCitationSource(value: unknown): value is { name?: string; url?: string } {
  return Boolean(value) && typeof value === "object";
}

/**
 * Attribute rows that actually compare both sides.
 *
 * Entity attribute values are shared across every comparison that reused the
 * entity. A one-sided row (Kayak.com metrics on the `kayak` entity, with a
 * blank canoe column) is not a data point for this matchup.
 */
function twoSidedAttributes(attributes: unknown): unknown[] {
  if (!Array.isArray(attributes)) return [];
  return attributes.filter((attribute) => {
    const values = Array.isArray((attribute as { values?: unknown[] })?.values)
      ? (attribute as { values: unknown[] }).values
      : [];
    const real = values.filter((value) => {
      const row = value as { valueNumber?: unknown; valueText?: unknown };
      if (typeof row?.valueNumber === "number" && Number.isFinite(row.valueNumber)) return true;
      return isSubstantiveValue(row?.valueText);
    });
    return real.length >= 2;
  });
}

function hasNumericDataPoint(comparison: {
  attributes?: unknown;
  keyDifferences?: unknown;
}): boolean {
  const attributes = Array.isArray(comparison.attributes) ? comparison.attributes : [];
  for (const attr of attributes) {
    const values = Array.isArray((attr as { values?: unknown[] })?.values)
      ? (attr as { values: unknown[] }).values
      : [];
    for (const value of values) {
      const row = value as { valueNumber?: unknown; valueText?: unknown };
      if (typeof row?.valueNumber === "number" && Number.isFinite(row.valueNumber)) return true;
      if (/\d/.test(String(row?.valueText ?? ""))) return true;
    }
  }
  const diffs = Array.isArray(comparison.keyDifferences) ? comparison.keyDifferences : [];
  for (const diff of diffs) {
    const row = diff as { entityAValue?: unknown; entityBValue?: unknown; values?: unknown[] };
    const cells = Array.isArray(row.values) ? row.values : [row.entityAValue, row.entityBValue];
    if (cells.some((cell) => /\d/.test(String(cell ?? "")))) return true;
  }
  return false;
}

export function assessUserGenerationPromotion(comparison: {
  keyDifferences?: unknown;
  attributes?: unknown;
  entities?: unknown;
  verdict?: string | null;
  shortAnswer?: string | null;
  citationStats?: { sourceCount?: number; sources?: unknown[] } | null;
  faqs?: { question?: string; answer?: string }[] | null;
  quickAnswer?: { tldr?: string | null; keyFact?: string | null } | null;
}): PromotionDecision {
  const sidedAttributes = twoSidedAttributes(comparison.attributes);
  const rawAttributeCount = Array.isArray(comparison.attributes) ? comparison.attributes.length : 0;
  const quality = assessComparisonQuality({ ...comparison, attributes: sidedAttributes });
  const reasons = [...quality.reasons];
  if (rawAttributeCount > sidedAttributes.length && sidedAttributes.length < MIN_SUBSTANTIVE_ATTRIBUTES) {
    reasons.push(
      `${rawAttributeCount - sidedAttributes.length} attribute rows cover only one side and do not count`,
    );
  }
  const contradictions = findSelfContradictions(comparison);
  if (contradictions.length > 0) {
    reasons.push(`self-contradictory numbers (${describeContradictions(contradictions)})`);
  }
  const sources = userGenerationSourceCount(comparison);
  if (sources < MIN_USER_GENERATION_SOURCES) {
    reasons.push(`only ${sources} sources (need ${MIN_USER_GENERATION_SOURCES})`);
  }
  if (!hasNumericDataPoint(comparison)) {
    reasons.push("no numeric data points");
  }
  return { pass: reasons.length === 0, reasons, score: quality.score };
}

export function decidePersistedStatus(
  metadata: { isAutoGenerated?: boolean; isHumanReviewed?: boolean },
  origin: SaveOrigin,
  promotionPass: boolean,
  slug?: string | null,
): PersistedComparisonStatus {
  if (origin === "user") {
    return promotionPass ? "published" : "provisional";
  }
  // DAN-1886 stays in force for cron, batch, and admin writes. A stored
  // isHumanReviewed flag used to keep an auto-generated row published.
  // Only a slug Daniel has actually reviewed does that now.
  if (metadata.isAutoGenerated && !isHumanReviewedSlug(slug)) return "archived";
  return "published";
}
