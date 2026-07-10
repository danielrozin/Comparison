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
 * This script performs the DB-level cleanup so the records stop appearing in
 * sitemaps. By default it UNPUBLISHES them (status -> "archived"), a reversible
 * change; pass HARD_DELETE=true to remove them permanently.
 *
 * Dry run (default):  npm run cleanup:slugs
 * Execute (archive):  DRY_RUN=false npm run cleanup:slugs
 * Execute (delete):   DRY_RUN=false HARD_DELETE=true npm run cleanup:slugs
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

  // Default cleanup mode is a reversible UNPUBLISH (status -> "archived"), which
  // matches the issue title and satisfies acceptance because the sitemap only
  // serves `published` rows. This is safer than a hard delete: if any malformed
  // slug turns out to have NO clean counterpart, its content is recoverable
  // (just flip status back) instead of being lost forever. Set HARD_DELETE=true
  // to permanently remove the rows instead.
  const HARD_DELETE = process.env.HARD_DELETE === "true";
  const verb = HARD_DELETE ? "delete" : "archive (unpublish)";

  // Dry-run guard
  const DRY_RUN = process.env.DRY_RUN !== "false";
  if (DRY_RUN) {
    console.log(`\nDRY RUN — would ${verb} ${ids.length} records.`);
    console.log("Set DRY_RUN=false to execute (archive), or add HARD_DELETE=true to delete.");
    return;
  }

  // Process in batches of 500 to avoid statement timeouts.
  let processed = 0;
  const BATCH = 500;
  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH);
    const result = HARD_DELETE
      ? await prisma.comparison.deleteMany({ where: { id: { in: batch } } })
      : await prisma.comparison.updateMany({
          where: { id: { in: batch } },
          data: { status: "archived" },
        });
    processed += result.count;
    console.log(
      `Batch ${Math.floor(i / BATCH) + 1}: ${verb} ${result.count} records (total: ${processed})`
    );
  }

  console.log(`\nDone. ${HARD_DELETE ? "Deleted" : "Archived"} ${processed} malformed comparison records.`);
  console.log("Next steps:");
  console.log("  1. Verify: curl https://www.aversusb.net/api/sitemap?limit=1 | jq .total");
  console.log("     (expect ~3138, was 5442)");
  console.log("  2. Trigger sitemap revalidation: curl -X POST https://www.aversusb.net/api/revalidate-pages");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
