/**
 * DAN-2488 — on-page signal boost for two /compare pages whose redirect-equity
 * recovery stalled (both dropped OUT of the top 100 as of 2026-07-19, DAN-2486).
 *
 * Run (writes to prod Neon via DATABASE_URL in .env.local):
 *   set -a; . ./.env.local; set +a
 *   npx tsx scripts/dan2488-onpage-boost.ts          # dry-run: prints before/after
 *   npx tsx scripts/dan2488-onpage-boost.ts --apply  # writes
 *
 * WHY ONLY paramount-vs-peacock GETS A metaTitle EDIT
 * ---------------------------------------------------
 * The compare H1 is `metadata.metaTitle || title` (ComparisonHero.tsx:285), so the
 * stored metaTitle is the single lever that moves H1 + <title> + og:title + the
 * WebPage schema headline at once.
 *
 *   bose-vs-jbl        metaTitle = "JBL vs Bose 2026: Soundbars, Earbuds, Bass & Price
 *                      Compared" — already leads with the exact target phrase
 *                      "JBL vs Bose" and is specific. No change (intervention #1 met).
 *   paramount-vs-peacock metaTitle = "Paramount+ vs Peacock 2026: Comparison & Winner"
 *                      — generic auto-generated tail ("Comparison & Winner"), the exact
 *                      weak-title pattern. Rewrite the tail to the real differentiators
 *                      (sports/movies/price) keeping the entity order consistent with the
 *                      slug + breadcrumb. Both entities stay in the title, so it still
 *                      matches "peacock vs paramount" in either order.
 *
 * FAQPage schema (#4) is already emitted on both pages (verified live: 7 FAQ nodes each),
 * so no FAQ work is needed. Freshness (#2) is signalled by bumping lastRefreshedAt +
 * the @updatedAt touch. IndexNow re-ping (#5) and page revalidation are done out-of-band
 * after this script (POST /api/indexnow, POST /api/revalidate).
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

// .env.local carries a stray trailing "\n" inside the quoted DATABASE_URL; sanitize it
// rather than trust `set -a` to have stripped it.
if (!process.env.DATABASE_URL) {
  try {
    for (const line of readFileSync(".env.local", "utf8").split("\n")) {
      const m = line.match(/^DATABASE_URL\s*=\s*"?(.*?)"?\s*$/);
      if (m) process.env.DATABASE_URL = m[1].replace(/\\n$/, "").trim();
    }
  } catch {
    /* fall through to Prisma's own error if truly unset */
  }
}

const prisma = new PrismaClient();

const UPDATES: Array<{ slug: string; metaTitle: string }> = [
  {
    slug: "paramount-vs-peacock",
    metaTitle: "Paramount+ vs Peacock 2026: Sports, Movies & Price Compared",
  },
];

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(apply ? "MODE: APPLY (writing)" : "MODE: DRY-RUN (no writes)\n");

  for (const u of UPDATES) {
    const before = await prisma.comparison.findUnique({
      where: { slug: u.slug },
      select: { slug: true, status: true, metaTitle: true },
    });
    if (!before) {
      console.log(`SKIP ${u.slug}: not found`);
      continue;
    }
    if (before.status !== "published") {
      // A metaTitle edit on a non-published row would never render; refuse it loudly.
      console.log(`SKIP ${u.slug}: status is "${before.status}", not published`);
      continue;
    }
    console.log(`${u.slug}`);
    console.log(`  before: ${before.metaTitle}`);
    console.log(`  after : ${u.metaTitle}`);
    if (before.metaTitle === u.metaTitle) {
      console.log("  (unchanged — already applied)");
      continue;
    }
    if (apply) {
      await prisma.comparison.update({
        where: { slug: u.slug },
        data: { metaTitle: u.metaTitle, lastRefreshedAt: new Date() },
      });
      console.log("  ✓ written");
    }
  }
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
