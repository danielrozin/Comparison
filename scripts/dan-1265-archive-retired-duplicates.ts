/**
 * DAN-1265 — archive retired duplicate /compare/ rows.
 *
 * Sets status="archived" on every losing slug from the consolidation map so the
 * page drops out of the sitemap (getAllSitemapData filters status="published")
 * and internal linking. Requests to these slugs are 301'd to the survivor by
 * next.config.ts redirects(). Idempotent.
 *
 *   npx dotenv -e .env.dan1265 -- npx tsx scripts/dan-1265-archive-retired-duplicates.ts
 */
import { PrismaClient } from "@prisma/client";
import { ORDERING_CONSOLIDATIONS } from "../src/lib/redirects/compare-ordering-redirects.generated";

const prisma = new PrismaClient();

// Mirror of ALIAS_CONSOLIDATIONS in compare-redirects.ts (entity-alias dupes).
const ALIAS_CONSOLIDATIONS: Record<string, string> = {
  "paramount-plus-vs-peacock": "paramount-vs-peacock",
};

async function main() {
  const map = { ...ORDERING_CONSOLIDATIONS, ...ALIAS_CONSOLIDATIONS };
  const retired = Object.keys(map);
  const survivors = new Set(Object.values(map));

  // Safety: never archive a slug that is also a survivor.
  const toArchive = retired.filter((s) => !survivors.has(s));
  console.log(`Map entries: ${retired.length}; to archive: ${toArchive.length}`);

  // Verify survivors are actually present & published before retiring their dupes.
  const survivorRows = await prisma.comparison.findMany({
    where: { slug: { in: [...survivors] } },
    select: { slug: true, status: true },
  });
  const presentSurvivors = new Set(survivorRows.filter((r) => r.status === "published").map((r) => r.slug));
  const missingSurvivors = [...survivors].filter((s) => !presentSurvivors.has(s));
  if (missingSurvivors.length) {
    console.warn(`WARNING: ${missingSurvivors.length} survivor(s) not published/found — skipping their dupes:`);
    console.warn(missingSurvivors.join(", "));
  }

  // Only archive a dupe whose survivor is confirmed published (don't strand a pair).
  const safe = toArchive.filter((s) => presentSurvivors.has(map[s]));
  const skipped = toArchive.filter((s) => !presentSurvivors.has(map[s]));

  const result = await prisma.comparison.updateMany({
    where: { slug: { in: safe }, status: "published" },
    data: { status: "archived" },
  });

  console.log(`Archived: ${result.count} rows`);
  console.log(`Skipped (survivor missing): ${skipped.length}`);
  if (skipped.length) console.log(skipped.join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
