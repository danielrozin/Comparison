/**
 * DAN-1800 — archive retired duplicate + degenerate /compare/ rows.
 *
 * Spam-update recovery lever #1 (reduce scaled-content footprint). Sets
 * status="archived" on:
 *   1. Every losing slug in the DAN-1800 84-cluster consolidation map
 *      (compare-ordering-redirects.dan1800.generated.ts), so the retired
 *      ordering drops out of the sitemap (sitemap.ts filters status="published")
 *      and internal linking. Requests are 301'd to the survivor at the edge by
 *      next.config.ts redirects().
 *   2. The degenerate self-comparison `grubhub-vs-grubhub`. The route already
 *      404s it (isDegenerateComparisonSlug in [slug].tsx) and it is already
 *      sitemap-excluded, but the DB row is still status="published" (audit
 *      noise); archive it so the corpus is clean.
 *
 * Idempotent. Growth Lead + VP Product signed off on this scope (DAN-1800,
 * 2026-07-09). Run AFTER the redirect map merges to prod:
 *
 *   npx dotenv -e .env.production -- npx tsx scripts/dan1800-archive-consolidated.ts
 */
import { PrismaClient } from "@prisma/client";
import { ORDERING_CONSOLIDATIONS_DAN1800 } from "../src/lib/redirects/compare-ordering-redirects.dan1800.generated";

const prisma = new PrismaClient();

// Degenerate self-comparisons found by the DAN-1800 audit (route already 404s
// these; archiving the row removes the last published-status residue).
const DEGENERATE_SLUGS = ["grubhub-vs-grubhub"];

async function main() {
  const map = ORDERING_CONSOLIDATIONS_DAN1800;
  const retired = Object.keys(map);
  const survivors = new Set(Object.values(map));

  // Safety: never archive a slug that is also a survivor.
  const toArchive = retired.filter((s) => !survivors.has(s));
  console.log(`Consolidation entries: ${retired.length}; to archive: ${toArchive.length}`);

  // Verify survivors are actually present & published before retiring their dupes.
  const survivorRows = await prisma.comparison.findMany({
    where: { slug: { in: [...survivors] } },
    select: { slug: true, status: true },
  });
  const presentSurvivors = new Set(
    survivorRows.filter((r) => r.status === "published").map((r) => r.slug),
  );
  const missingSurvivors = [...survivors].filter((s) => !presentSurvivors.has(s));
  if (missingSurvivors.length) {
    console.warn(`WARNING: ${missingSurvivors.length} survivor(s) not published/found — skipping their dupes:`);
    console.warn(missingSurvivors.join(", "));
  }

  // Only archive a dupe whose survivor is confirmed published (don't strand a pair).
  const safe = toArchive.filter((s) => presentSurvivors.has(map[s]));
  const skipped = toArchive.filter((s) => !presentSurvivors.has(map[s]));

  const dupResult = await prisma.comparison.updateMany({
    where: { slug: { in: safe }, status: "published" },
    data: { status: "archived" },
  });
  console.log(`Archived (ordering dupes): ${dupResult.count} rows`);
  console.log(`Skipped (survivor missing): ${skipped.length}`);
  if (skipped.length) console.log(skipped.join(", "));

  const degenResult = await prisma.comparison.updateMany({
    where: { slug: { in: DEGENERATE_SLUGS }, status: "published" },
    data: { status: "archived" },
  });
  console.log(`Archived (degenerate self-comparisons): ${degenResult.count} rows`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
