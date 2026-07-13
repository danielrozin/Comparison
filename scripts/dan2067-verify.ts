/**
 * DAN-2067 — proves the sitemap/corpus fix against the live DB.
 *
 * Counts published comparison rows vs *canonical* ones (published AND not a
 * redirect source). The gap is the number of 308s we were submitting to Google
 * as if they were pages.
 */
import { getPrisma } from "@/lib/db/prisma";
import { canonicalComparisonWhere } from "@/lib/db/canonical-comparisons";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug, isCleanSlug } from "@/lib/utils/slugify";

async function main() {
  const prisma = getPrisma();
  if (!prisma) throw new Error("no DATABASE_URL");

  const published = await prisma.comparison.findMany({
    where: { status: "published" },
    select: { slug: true, category: true },
  });
  const canonicalCount = await prisma.comparison.count({ where: canonicalComparisonWhere() });

  // What sitemap/1.xml actually emits (same filters as src/app/sitemap.ts).
  const inSitemap = (s: string) => isCleanSlug(s) && !isDegenerateComparisonSlug(s);
  const before = published.filter((c) => inSitemap(c.slug));
  const after = before.filter((c) => !isRedirectedCompareSlug(c.slug));
  const dropped = before.filter((c) => isRedirectedCompareSlug(c.slug));

  console.log(`published rows              : ${published.length}`);
  console.log(`  of which redirect sources : ${published.filter((c) => isRedirectedCompareSlug(c.slug)).length}`);
  console.log(`canonical count (new total) : ${canonicalCount}`);
  console.log("");
  console.log(`sitemap/1.xml BEFORE fix    : ${before.length}`);
  console.log(`sitemap/1.xml AFTER fix     : ${after.length}`);
  console.log(`  redirect URLs dropped     : ${dropped.length}`);
  dropped.forEach((c) => console.log(`    - ${c.slug}`));

  for (const [label, where] of [
    ["software", canonicalComparisonWhere({ category: "software" })],
    ["finance+economy", canonicalComparisonWhere({ category: { in: ["finance", "economy"] } })],
  ] as const) {
    const n = await prisma.comparison.count({ where });
    console.log(`canonical ${label}: ${n}`);
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
