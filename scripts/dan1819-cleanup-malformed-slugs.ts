/**
 * DAN-1819: Delete malformed Comparison records with corrupted slugs.
 *
 * These are DB artifacts where slugs contain non-alphanumeric/hyphen characters
 * (e.g. trailing `)` or `))`, or `-keyword-suffix` variants). The corruption
 * was caused by a slug-generation bug — these records have no unique content,
 * they are duplicates of their clean counterpart with an invalid slug.
 *
 * Code fix (commit 2501981) already:
 *   - Filters them out of the XML sitemap
 *   - 301-redirects incoming requests to the clean version
 *
 * This script performs the DB-level cleanup so the records don't accumulate
 * storage and can never re-appear in sitemaps after a cache purge.
 *
 * Run: DATABASE_URL=... npx ts-node -P tsconfig.json scripts/dan1819-cleanup-malformed-slugs.ts
 * Or:  DATABASE_URL=... tsx scripts/dan1819-cleanup-malformed-slugs.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Audit first
  const malformed = await prisma.comparison.findMany({
    where: {
      status: "published",
      OR: [
        { slug: { contains: ")" } },
        { slug: { endsWith: "-keyword-suffix" } },
      ],
    },
    select: { id: true, slug: true },
    orderBy: { slug: "asc" },
  });

  console.log(`Found ${malformed.length} malformed published comparisons`);

  if (malformed.length === 0) {
    console.log("Nothing to clean up.");
    return;
  }

  // Print a sample
  console.log("Sample (first 20):");
  malformed.slice(0, 20).forEach((r) => console.log(`  ${r.slug}`));

  const ids = malformed.map((r) => r.id);

  // Dry-run guard
  const DRY_RUN = process.env.DRY_RUN !== "false";
  if (DRY_RUN) {
    console.log(`\nDRY RUN — would delete ${ids.length} records.`);
    console.log("Set DRY_RUN=false to execute.");
    return;
  }

  // Delete in batches of 500 to avoid timeout
  let deleted = 0;
  const BATCH = 500;
  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH);
    const result = await prisma.comparison.deleteMany({
      where: { id: { in: batch } },
    });
    deleted += result.count;
    console.log(`Deleted batch ${Math.floor(i / BATCH) + 1}: ${result.count} records (total: ${deleted})`);
  }

  console.log(`\nDone. Deleted ${deleted} malformed comparison records.`);
  console.log("Next steps:");
  console.log("  1. Verify: curl https://www.aversusb.net/api/sitemap?limit=1 | jq .total");
  console.log("     (expect ~3138, was 5442)");
  console.log("  2. Trigger sitemap revalidation: curl -X POST https://www.aversusb.net/api/revalidate-pages");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
