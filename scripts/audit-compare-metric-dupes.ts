/**
 * ROO-154 dry run: score compare pages for duplicate and contradictory metrics.
 *
 * Read-only. It never inserts, updates, or deletes. With a real DATABASE_URL
 * it reads published comparisons. Otherwise it scores the in-repo fixtures.
 *
 * The report is written under reports/ (gitignored). Pass --stdout to skip
 * the file. Pass --out <path> to choose a different path.
 *
 *   npx tsx scripts/audit-compare-metric-dupes.ts
 *   COMPARE_METRIC_DEDUPE=false npx tsx scripts/audit-compare-metric-dupes.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ComparisonAttribute, ComparisonPageData, KeyDifference } from "../src/types";
import {
  isCompareMetricDedupeEnabled,
  scoreComparisonMetrics,
  type MetricQualityScore,
} from "../src/lib/comparison/metric-table-guard";
import { lyftVsUberFixture, usVsChinaGdpFixture } from "../src/lib/comparison/metric-table-fixtures";

const WORST_LIMIT = 50;
const DEFAULT_OUT = path.join("reports", "compare-metric-dupes.local.json");

interface Report {
  generatedAt: string;
  mode: "database" | "fixtures";
  guardEnabled: boolean;
  pageCount: number;
  pagesWithDuplicates: number;
  pagesWithConflicts: number;
  pagesWithIdenticalRows: number;
  worst: MetricQualityScore[];
}

function arg(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
}

function severity(score: MetricQualityScore): number {
  return score.duplicateGroupCount * 10 + score.conflictingRowCount + score.identicalRowCount + score.copiedRowCount;
}

function reportFor(pages: ComparisonPageData[], mode: Report["mode"]): Report {
  const scores = pages
    .map((page) => scoreComparisonMetrics(page))
    .filter((score) => score.rawRowCount > 0);
  const worst = [...scores].sort((a, b) => severity(b) - severity(a) || b.rawRowCount - a.rawRowCount).slice(0, WORST_LIMIT);
  return {
    generatedAt: new Date().toISOString(),
    mode,
    guardEnabled: isCompareMetricDedupeEnabled(),
    pageCount: scores.length,
    pagesWithDuplicates: scores.filter((score) => score.duplicateGroupCount > 0).length,
    pagesWithConflicts: scores.filter((score) => score.conflictingRowCount > 0).length,
    pagesWithIdenticalRows: scores.filter((score) => score.identicalRowCount > 0).length,
    worst,
  };
}

function printReport(report: Report): void {
  console.log(`Mode: ${report.mode}`);
  console.log(`Guard enabled: ${report.guardEnabled}`);
  console.log(`Pages scored: ${report.pageCount}`);
  console.log(`Pages with duplicate metric groups: ${report.pagesWithDuplicates}`);
  console.log(`Pages with scorecard conflicts: ${report.pagesWithConflicts}`);
  console.log(`Pages with identical-column rows: ${report.pagesWithIdenticalRows}`);
  console.log(`Worst ${report.worst.length}:`);
  for (const score of report.worst) {
    console.log(
      `  ${score.slug}  raw ${score.rawRowCount} -> guarded ${score.guardedRowCount}` +
        `  dupes ${score.duplicateGroupCount}  conflicts ${score.conflictingRowCount}` +
        `  identical ${score.identicalRowCount}  copied ${score.copiedRowCount}`,
    );
  }
}

function stamp(value: Date | string | null | undefined): string | null {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return null;
}

async function loadPublishedPages(): Promise<ComparisonPageData[] | null> {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  if (!databaseUrl || databaseUrl.includes("placeholder") || databaseUrl.includes("user:password@")) {
    return null;
  }

  const { getPrisma } = await import("../src/lib/db/prisma");
  const prisma = getPrisma();
  if (!prisma) return null;

  // findMany is the only Prisma call. This script must not write.
  const rows = await prisma.comparison.findMany({
    where: { status: "published" },
    select: {
      slug: true,
      title: true,
      shortAnswer: true,
      keyDifferences: true,
      content: true,
      entities: {
        orderBy: { position: "asc" },
        select: {
          position: true,
          entity: {
            select: {
              id: true,
              slug: true,
              name: true,
              attributeValues: {
                select: {
                  valueText: true,
                  valueNumber: true,
                  valueBoolean: true,
                  source: true,
                  updatedAt: true,
                  asOfDate: true,
                  attribute: {
                    select: {
                      id: true,
                      slug: true,
                      name: true,
                      unit: true,
                      category: true,
                      dataType: true,
                      higherIsBetter: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return rows.map((row) => toPage(row));
}

interface AuditAttributeValue {
  valueText: string | null;
  valueNumber: number | null;
  valueBoolean: boolean | null;
  source: string | null;
  updatedAt: Date | string;
  asOfDate: Date | string | null;
  attribute: {
    id: string;
    slug: string;
    name: string;
    unit: string | null;
    category: string | null;
    dataType: string;
    higherIsBetter: boolean | null;
  };
}

interface AuditRow {
  slug: string;
  title: string;
  shortAnswer: string | null;
  keyDifferences: unknown;
  content: unknown;
  entities: {
    position: number;
    entity: {
      id: string;
      slug: string;
      name: string;
      attributeValues: AuditAttributeValue[];
    };
  }[];
}

function toPage(row: AuditRow): ComparisonPageData {
  const content = row.content && typeof row.content === "object" && !Array.isArray(row.content)
    ? row.content as { quickAnswer?: ComparisonPageData["quickAnswer"] }
    : {};
  const entities = [...row.entities].sort((a, b) => a.position - b.position);
  const attributeMap = new Map<string, ComparisonAttribute>();

  for (const link of entities) {
    for (const value of link.entity.attributeValues) {
      let attr = attributeMap.get(value.attribute.id);
      if (!attr) {
        attr = {
          id: value.attribute.id,
          slug: value.attribute.slug,
          name: value.attribute.name,
          unit: value.attribute.unit,
          category: value.attribute.category,
          dataType: value.attribute.dataType,
          higherIsBetter: value.attribute.higherIsBetter,
          values: [],
        };
        attributeMap.set(value.attribute.id, attr);
      }
      const updatedAt = stamp(value.updatedAt) ?? stamp(value.asOfDate);
      const source = typeof value.source === "string" && value.source.trim() ? value.source.trim() : null;
      attr.values.push({
        entityId: link.entity.id,
        valueText: value.valueText,
        valueNumber: value.valueNumber,
        valueBoolean: value.valueBoolean,
        ...(source ? { source } : {}),
        ...(updatedAt ? { updatedAt } : {}),
      });
    }
  }

  const keyDifferences = Array.isArray(row.keyDifferences)
    ? row.keyDifferences as KeyDifference[]
    : [];

  return {
    id: row.slug,
    slug: row.slug,
    title: row.title,
    shortAnswer: row.shortAnswer,
    keyDifferences,
    verdict: null,
    category: null,
    entities: entities.map((link) => ({
      id: link.entity.id,
      slug: link.entity.slug,
      name: link.entity.name,
      shortDesc: null,
      imageUrl: null,
      entityType: "entity",
      position: link.position,
      pros: [],
      cons: [],
      bestFor: null,
    })),
    attributes: [...attributeMap.values()],
    faqs: [],
    relatedComparisons: [],
    relatedBlogPosts: [],
    ...(content.quickAnswer ? { quickAnswer: content.quickAnswer } : {}),
    metadata: {
      metaTitle: row.title,
      metaDescription: row.shortAnswer ?? row.title,
      publishedAt: null,
      updatedAt: new Date(0).toISOString(),
      isAutoGenerated: false,
      isHumanReviewed: false,
      viewCount: 0,
      status: "published",
    },
  };
}

async function main(): Promise<void> {
  let pages: ComparisonPageData[] | null = null;
  let mode: Report["mode"] = "fixtures";
  try {
    pages = await loadPublishedPages();
    if (pages) mode = "database";
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Database read failed (${message}). Scoring fixtures instead.`);
    pages = null;
  }

  if (!pages) {
    pages = [usVsChinaGdpFixture(), lyftVsUberFixture()];
    mode = "fixtures";
  }

  const report = reportFor(pages, mode);
  printReport(report);

  if (process.argv.includes("--stdout")) return;

  const outPath = arg("--out") ?? DEFAULT_OUT;
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
