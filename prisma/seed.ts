/**
 * Prisma Seed Script
 * Imports all mock data and saves it to the database using saveComparison.
 *
 * Run with: npx prisma db seed
 */

import { getMockComparison, getAllMockSlugs } from "../src/lib/services/mock-data";
import { saveComparison } from "../src/lib/services/comparison-service";

async function main() {
  const slugs = getAllMockSlugs();
  console.log(`Seeding ${slugs.length} comparisons...`);

  let success = 0;
  let failed = 0;

  for (const slug of slugs) {
    const data = getMockComparison(slug);
    if (!data) {
      console.warn(`  SKIP: no data for slug "${slug}"`);
      failed++;
      continue;
    }

    try {
      const result = await saveComparison(data);
      if (result) {
        console.log(`  OK: ${slug} -> ${result.id}`);
        success++;
      } else {
        console.warn(`  FAIL: ${slug} (saveComparison returned null — check DATABASE_URL)`);
        failed++;
      }
    } catch (err) {
      console.error(`  ERROR: ${slug}`, err);
      failed++;
    }
  }

  // Now resolve relatedComparisonIds from slugs to actual DB ids
  console.log("\nResolving related comparison IDs...");
  try {
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL set, skipping related ID resolution");
      return;
    }
    const { prisma } = await import("../src/lib/db/prisma");

    const allComps = await prisma.comparison.findMany({
      select: { id: true, slug: true, relatedComparisonIds: true },
    });
    const slugToId = new Map(allComps.map((c: { id: string; slug: string }) => [c.slug, c.id]));

    for (const comp of allComps) {
      const resolvedIds = (comp.relatedComparisonIds as string[])
        .map((s: string) => slugToId.get(s))
        .filter(Boolean) as string[];

      if (resolvedIds.length > 0) {
        await prisma.comparison.update({
          where: { id: comp.id },
          data: { relatedComparisonIds: resolvedIds },
        });
      }
    }
    console.log("Related IDs resolved.");
  } catch (e) {
    console.warn("Could not resolve related IDs:", e);
  }

  console.log(`\nSeed complete: ${success} succeeded, ${failed} failed out of ${slugs.length} total.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  });
