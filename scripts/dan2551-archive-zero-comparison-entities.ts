/**
 * DAN-2551 task 2 — batch archive entity rows that have zero canonical comparisons.
 *
 * A "published" entity with no canonical comparisons renders as a live 200 page
 * titled "<Entity> vs Every Rival: Comparisons & Stats 2026" but has nothing to
 * show. The DAN-2551 task-3 gate (notFound() for non-published) and task-4 sitemap
 * filter both depend on entity.status being "archived" for these rows to take
 * effect.
 *
 * Definition of "zero canonical comparisons":
 *   - No ComparisonEntity rows where comparison.status = "published"
 *   - AND no curated ENTITY_CONTENT alternative that resolves to a published slug
 *     (either direction: `${slug}-vs-${rival}` or `${rival}-vs-${slug}`)
 *
 * Safety
 *   - Dry run by default; nothing is written without --apply.
 *   - Hard cap: MAX_BATCH rows per run.
 *   - Idempotent: already-archived rows are skipped (no-ops).
 *   - Writes archive-batches/entities-{batchId}.json for rollback.
 *   - Never archives an entity that has curated content in ENTITY_CONTENT with a
 *     valid canonical comparison (they are thin only on the DB side).
 *
 * Usage
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/dan2551-archive-zero-comparison-entities.ts
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/dan2551-archive-zero-comparison-entities.ts --apply
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/dan2551-archive-zero-comparison-entities.ts --apply --limit 200
 *   npx dotenv-cli -e .env.local -- npx tsx scripts/dan2551-archive-zero-comparison-entities.ts --rollback archive-batches/entities-<id>.json --apply
 */

import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";
import { ENTITY_CONTENT } from "../src/lib/data/entity-content";
import { REDIRECTED_COMPARE_SLUGS } from "../src/lib/redirects/compare-redirects";

const prisma = new PrismaClient();
const MAX_BATCH = 500;
const BATCH_DIR = path.join(process.cwd(), "archive-batches");

type RollbackEntry = { id: string; slug: string; previousStatus: string };

function parseArgs(argv: string[]) {
  const get = (flag: string) => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const limitStr = get("--limit");
  return {
    apply: argv.includes("--apply"),
    rollback: get("--rollback"),
    limit: limitStr ? parseInt(limitStr, 10) : MAX_BATCH,
  };
}

async function main() {
  const { apply, rollback, limit } = parseArgs(process.argv.slice(2));

  // --- ROLLBACK PATH ---
  if (rollback) {
    const entries: RollbackEntry[] = JSON.parse(fs.readFileSync(rollback, "utf-8"));
    console.log(`Rolling back ${entries.length} entities…`);
    if (!apply) {
      console.log("(dry run — add --apply to write)");
      for (const e of entries) console.log(`  would restore ${e.slug} → ${e.previousStatus}`);
      return;
    }
    let restored = 0;
    for (const e of entries) {
      await prisma.entity.update({ where: { id: e.id }, data: { status: e.previousStatus } });
      restored++;
    }
    console.log(`Restored ${restored} entities.`);
    return;
  }

  // --- MEASURE PASS ---
  const redirected = new Set(REDIRECTED_COMPARE_SLUGS);

  // Load all comparisons + their status + entity pairs in one query.
  const comparisons = await prisma.comparison.findMany({
    select: {
      slug: true,
      status: true,
      entities: { select: { entity: { select: { id: true, slug: true } } } },
    },
  });

  const canonicalSlugs = new Set(
    comparisons
      .filter((c) => c.status === "published" && !redirected.has(c.slug))
      .map((c) => c.slug)
  );

  // entity id -> does it appear in any canonical comparison?
  const inCanonical = new Set<string>();
  for (const c of comparisons) {
    if (c.status !== "published" || redirected.has(c.slug)) continue;
    for (const ce of c.entities) inCanonical.add(ce.entity.id);
  }

  // entity slug -> does it have any curated alternative resolving to a canonical comparison?
  function hasCuratedCanonical(slug: string): boolean {
    const curated = ENTITY_CONTENT[slug]?.alternatives ?? [];
    for (const c of curated) {
      const fwd = `${slug}-vs-${c.slug}`;
      const rev = `${c.slug}-vs-${slug}`;
      if (canonicalSlugs.has(fwd) || canonicalSlugs.has(rev)) return true;
    }
    return false;
  }

  // Load published entities only (draft/archived already excluded from the live site).
  const published = await prisma.entity.findMany({
    where: { status: "published" },
    select: { id: true, slug: true, status: true },
  });

  const candidates = published.filter(
    (e) => !inCanonical.has(e.id) && !hasCuratedCanonical(e.slug)
  );

  console.log(`Published entities: ${published.length}`);
  console.log(`Entities in >=1 canonical comparison: ${inCanonical.size}`);
  console.log(`Candidates (0 canonical comparisons, 0 curated canonical): ${candidates.length}`);

  const batch = candidates.slice(0, limit);
  console.log(`Batch size (capped at ${limit}): ${batch.length}`);

  if (batch.length === 0) {
    console.log("Nothing to archive.");
    return;
  }

  if (!apply) {
    console.log("\n(dry run — add --apply to write)\nSample of first 20:");
    for (const e of batch.slice(0, 20)) console.log(`  /entity/${e.slug}`);
    return;
  }

  // --- APPLY ---
  if (!fs.existsSync(BATCH_DIR)) fs.mkdirSync(BATCH_DIR, { recursive: true });
  const batchId = `${Date.now()}`;
  const rollbackPath = path.join(BATCH_DIR, `entities-${batchId}.json`);
  const rollbackData: RollbackEntry[] = batch.map((e) => ({
    id: e.id,
    slug: e.slug,
    previousStatus: e.status,
  }));
  fs.writeFileSync(rollbackPath, JSON.stringify(rollbackData, null, 2));
  console.log(`Rollback file: ${rollbackPath}`);

  let archived = 0;
  for (const e of batch) {
    await prisma.entity.update({ where: { id: e.id }, data: { status: "archived" } });
    archived++;
    if (archived % 50 === 0) process.stdout.write(`  archived ${archived}/${batch.length}…\r`);
  }
  process.stdout.write("\n");
  console.log(`\nDone. Archived ${archived} entities.`);
  console.log(`Rollback: npx dotenv-cli -e .env.local -- npx tsx ${path.basename(__filename)} --rollback ${rollbackPath} --apply`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
