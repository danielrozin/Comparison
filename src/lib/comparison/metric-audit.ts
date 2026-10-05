/**
 * Orders the read-only compare-metric audit.
 *
 * The named pages are always reported first, each with its conflict list.
 * Every other page is then ranked by how many duplicate and conflicting rows
 * it has. This module does not read or write the database.
 */

import type { ComparisonPageData } from "@/types";
import {
  inspectComparisonMetrics,
  type MetricConflict,
} from "@/lib/comparison/metric-table-guard";

/** Checked first, in this order, each with a per-metric conflict list. */
export const PRIORITY_COMPARE_SLUGS = [
  "us-vs-china-gdp",
  "us-economy-vs-china-economy",
  "usa-vs-china",
  "lyft-vs-uber",
  "japan-vs-china",
  "messi-vs-ronaldo",
  "ps5-vs-xbox-series-x",
  "cursor-vs-copilot",
  "android-vs-ios",
  "nvidia-vs-amd",
] as const;

/** Checked immediately after the priority pages, also with conflict lists. */
export const NEXT_TIER_COMPARE_SLUGS = [
  "chatgpt-vs-gemini",
  "canva-vs-photoshop",
  "figma-vs-sketch",
  "signal-vs-whatsapp",
] as const;

export const COMPARE_AUDIT_WORST_LIMIT = 50;

export interface AuditedComparePage {
  slug: string;
  found: boolean;
  rawRowCount: number;
  guardedRowCount: number;
  duplicateGroupCount: number;
  conflictingRowCount: number;
  identicalRowCount: number;
  copiedRowCount: number;
  /**
   * Present for priority and next-tier pages. Ranked pages leave this empty
   * so the worst-50 list stays a ranking rather than another full dump.
   */
  conflicts: MetricConflict[];
}

export interface CompareMetricAudit {
  priority: AuditedComparePage[];
  nextTier: AuditedComparePage[];
  ranked: AuditedComparePage[];
}

function blankPage(slug: string): AuditedComparePage {
  return {
    slug,
    found: false,
    rawRowCount: 0,
    guardedRowCount: 0,
    duplicateGroupCount: 0,
    conflictingRowCount: 0,
    identicalRowCount: 0,
    copiedRowCount: 0,
    conflicts: [],
  };
}

function auditPage(page: ComparisonPageData, includeConflicts: boolean): AuditedComparePage {
  const inspection = inspectComparisonMetrics(page);
  return {
    slug: page.slug,
    found: true,
    rawRowCount: inspection.rawRowCount,
    guardedRowCount: inspection.guardedRowCount,
    duplicateGroupCount: inspection.duplicateGroupCount,
    conflictingRowCount: inspection.conflictingRowCount,
    identicalRowCount: inspection.identicalRowCount,
    copiedRowCount: inspection.copiedRowCount,
    conflicts: includeConflicts ? inspection.conflicts : [],
  };
}

export function compareMetricSeverity(page: AuditedComparePage): number {
  return page.duplicateGroupCount * 10
    + page.conflictingRowCount
    + page.identicalRowCount
    + page.copiedRowCount;
}

function pagesInOrder(
  slugs: readonly string[],
  bySlug: Map<string, ComparisonPageData>,
): AuditedComparePage[] {
  return slugs.map((slug) => {
    const page = bySlug.get(slug);
    return page ? auditPage(page, true) : blankPage(slug);
  });
}

/**
 * Priority slugs, then the next tier, then the remaining pages from worst to
 * best. Focus slugs are not repeated in the ranked list.
 */
export function buildCompareMetricAudit(
  pages: ComparisonPageData[],
  worstLimit = COMPARE_AUDIT_WORST_LIMIT,
): CompareMetricAudit {
  const bySlug = new Map<string, ComparisonPageData>();
  for (const page of pages) {
    if (!bySlug.has(page.slug)) bySlug.set(page.slug, page);
  }

  const focus = new Set<string>([...PRIORITY_COMPARE_SLUGS, ...NEXT_TIER_COMPARE_SLUGS]);
  const ranked = [...bySlug.values()]
    .filter((page) => !focus.has(page.slug) && page.attributes.length > 0)
    .map((page) => auditPage(page, false))
    .sort((a, b) => compareMetricSeverity(b) - compareMetricSeverity(a) || b.rawRowCount - a.rawRowCount)
    .slice(0, worstLimit);

  return {
    priority: pagesInOrder(PRIORITY_COMPARE_SLUGS, bySlug),
    nextTier: pagesInOrder(NEXT_TIER_COMPARE_SLUGS, bySlug),
    ranked,
  };
}
