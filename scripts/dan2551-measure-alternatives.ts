/**
 * DAN-2551 task 1: measure /alternatives/[slug] thinness the same way /entity was.
 *
 * The page renders one card per DISTINCT rival entity reachable through a
 * comparison that contains this entity (see getAlternativesForEntity in
 * comparison-service.ts), merged with curated ENTITY_CONTENT alternatives.
 *
 * Two counts per entity, because the service does NOT filter on status:
 *   rendered  — what the live page shows today (any comparison status)
 *   canonical — rivals reachable through a *published* comparison only
 * The gap is the number of alternative cards linking to /compare/* URLs that
 * 404 (archived rows 404 via getStaticProps — DAN-1886/DAN-2065).
 */
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";
import { ENTITY_CONTENT } from "../src/lib/data/entity-content";

const prisma = new PrismaClient();

type Row = { slug: string; rendered: number; canonical: number; curated: number };

async function main() {
  const entities = await prisma.entity.findMany({ select: { id: true, slug: true } });
  const links = await prisma.comparisonEntity.findMany({
    select: { entityId: true, comparison: { select: { id: true, status: true } } },
  });

  // comparisonId -> entityIds, plus status
  const byComparison = new Map<string, { status: string; entityIds: string[] }>();
  for (const l of links) {
    const c = l.comparison;
    if (!c) continue;
    const e = byComparison.get(c.id) ?? { status: c.status, entityIds: [] };
    e.entityIds.push(l.entityId);
    byComparison.set(c.id, e);
  }

  const rendered = new Map<string, Set<string>>();
  const canonical = new Map<string, Set<string>>();
  for (const { status, entityIds } of byComparison.values()) {
    for (const a of entityIds) {
      for (const b of entityIds) {
        if (a === b) continue;
        if (!rendered.has(a)) rendered.set(a, new Set());
        rendered.get(a)!.add(b);
        if (status === "published") {
          if (!canonical.has(a)) canonical.set(a, new Set());
          canonical.get(a)!.add(b);
        }
      }
    }
  }

  const rows: Row[] = entities.map((e) => {
    const curatedSlugs = ENTITY_CONTENT[e.slug]?.alternatives?.length ?? 0;
    return {
      slug: e.slug,
      rendered: (rendered.get(e.id)?.size ?? 0) + curatedSlugs,
      canonical: (canonical.get(e.id)?.size ?? 0) + curatedSlugs,
      curated: curatedSlugs,
    };
  });

  const bucket = (n: number, pick: (r: Row) => number) => rows.filter((r) => pick(r) === n).length;
  const atLeast = (n: number, pick: (r: Row) => number) => rows.filter((r) => pick(r) >= n).length;

  console.log(`/alternatives/* pages (one per entity row): ${rows.length}`);
  for (const [label, pick] of [
    ["RENDERED TODAY (no status filter)", (r: Row) => r.rendered],
    ["CANONICAL (published comparisons only)", (r: Row) => r.canonical],
  ] as const) {
    console.log(`\n--- ${label} ---`);
    console.log(`  0 alternatives : ${bucket(0, pick)}  (${((bucket(0, pick) / rows.length) * 100).toFixed(1)}%)`);
    console.log(`  1 alternative  : ${bucket(1, pick)}`);
    console.log(`  2 alternatives : ${bucket(2, pick)}`);
    console.log(`  3+ alternatives: ${atLeast(3, pick)}`);
  }

  const degraded = rows.filter((r) => r.rendered > 0 && r.canonical === 0);
  const lossy = rows.filter((r) => r.rendered > r.canonical);
  console.log(`\nPages whose alternative cards ALL link to non-published (404) compare URLs: ${degraded.length}`);
  console.log(`Pages with at least one dead alternative card: ${lossy.length}`);
  console.log(`Curated ENTITY_CONTENT slugs: ${Object.keys(ENTITY_CONTENT).length}`);

  console.log(`\nSample of 15 zero-canonical slugs:`);
  for (const r of rows.filter((r) => r.canonical === 0).slice(0, 15)) console.log(`  /alternatives/${r.slug}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
