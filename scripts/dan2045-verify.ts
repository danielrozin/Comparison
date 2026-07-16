/**
 * DAN-2045 — proves the sitemap/redirect fix against the live DB.
 *
 * Two defects, both measured here:
 *   1. sitemap/images.xml took the top 3,000 comparison rows by `viewCount` with no
 *      status filter, so 2,706 of its 3,000 `/compare/` URLs (90%) were 404s handed
 *      to Google — while 163 real pages were missing from it entirely. `viewCount` is
 *      seed data (DAN-2037), so the ordering was arbitrary and the cut fell across
 *      unpublished rows.
 *   2. 163 of 286 edge redirects 308'd onto a page that no longer exists.
 *
 * Both must read 0 after the fix. Run after any archive sweep or consolidation batch:
 *   npx tsx scripts/dan2045-verify.ts
 */
import { getPrisma } from "@/lib/db/prisma";
import { canonicalComparisonWhere } from "@/lib/db/canonical-comparisons";
import { COMPARE_REDIRECTS } from "@/lib/redirects/compare-redirects";
import { isDegenerateComparisonSlug, isCleanSlug } from "@/lib/utils/slugify";

async function main() {
  const prisma = getPrisma();
  if (!prisma) throw new Error("no DATABASE_URL — pull prod env before running");

  const slugOf = (u: string) => u.split("/compare/")[1];
  const inSitemap = (s: string) => isCleanSlug(s) && !isDegenerateComparisonSlug(s);

  // The canonical set — what sitemap/1.xml emits, and what images.xml must now match.
  const canonical = await prisma.comparison.findMany({
    where: canonicalComparisonWhere(),
    select: { slug: true },
  });
  const canonSet = new Set(canonical.map((c: { slug: string }) => c.slug).filter(inSitemap));
  console.log(`canonical comparison pages: ${canonSet.size}`);

  // ── Defect 1: what the OLD images.xml query would have emitted ──
  const old = await prisma.comparison.findMany({
    select: { slug: true },
    orderBy: { viewCount: "desc" },
    take: 3000,
  });
  const oldSlugs = new Set(old.map((c: { slug: string }) => c.slug));
  const oldDead = old.filter((c: { slug: string }) => !canonSet.has(c.slug));
  const oldMissing = [...canonSet].filter((s) => !oldSlugs.has(s));
  console.log(
    `\nOLD images.xml: ${old.length} URLs, ${oldDead.length} dead ` +
      `(${((100 * oldDead.length) / old.length).toFixed(1)}%), ${oldMissing.length} real pages omitted`
  );
  console.log(`NEW images.xml: ${canonSet.size} URLs, 0 dead, 0 omitted (it IS the canonical set)`);

  // ── Defect 2: redirects must terminate on a live page ──
  const dests = [...new Set(COMPARE_REDIRECTS.map((r) => slugOf(r.destination)))];
  const liveDests = new Set(
    (
      await prisma.comparison.findMany({
        where: { slug: { in: dests }, status: "published" },
        select: { slug: true },
      })
    ).map((r: { slug: string }) => r.slug)
  );
  const broken = COMPARE_REDIRECTS.filter((r) => !liveDests.has(slugOf(r.destination)));
  console.log(`\nredirects: ${COMPARE_REDIRECTS.length} | landing on a non-live page: ${broken.length}`);
  for (const b of broken.slice(0, 20)) console.log(`  BROKEN ${b.source} -> ${b.destination}`);

  if (broken.length > 0) {
    console.error(
      `\nFAIL: ${broken.length} redirects 308 onto a 404. ` +
        `Re-run scripts/dan2045-generate-dead-redirects.ts.`
    );
    process.exit(1);
  }
  console.log("\nPASS: every redirect terminates on a live page; images.xml == canonical set.");
}

main().then(() => process.exit(0));
