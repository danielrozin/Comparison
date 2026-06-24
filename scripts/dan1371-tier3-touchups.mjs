/**
 * DAN-1371 — Tier-3 intro touch-ups (tj-maxx, usaa-geico, sonos, netflix-disney)
 *
 * Idempotent prod-DB publisher, run via .github/workflows/publish-editorial.yml:
 *   gh workflow run publish-editorial.yml -f script=scripts/dan1371-tier3-touchups.mjs
 *
 * Mirrors the DAN-1288 / DAN-1365 ship pattern (DB content served by ISR).
 * These pages already have query-order-matched H1s — this pass adds the exact
 * keyword phrase to the first intro sentence (shortAnswer) and inserts the
 * long-tail Netflix H2 into the blog post.
 *
 * What it does (all idempotent):
 *   1. marshalls-vs-tj-maxx  — prepend "TJ Maxx vs Marshalls" exact phrase to intro.
 *   2. geico-vs-usaa          — prepend "USAA vs Geico" + military-cost angle lede.
 *   3. bose-vs-sonos          — prepend "Sonos versus Bose" intro (adds "versus" variant).
 *   4. blog: best-streaming-services-2026-netflix-vs-disney-plus-vs-hbo-max
 *             — insert H2 + paragraph "Netflix vs Disney Plus content comparison (2026)"
 *               after the Detailed Comparison Table section.
 *
 * Run dry-run with: node scripts/dan1371-tier3-touchups.mjs --dry
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env.local from this worktree first; fall back to sibling Comparison dir (local dev).
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, "../../Comparison/.env.local") });
}
const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");

// ---------------------------------------------------------------------------
// 1–3. Compare intro touch-ups (shortAnswer field, idempotent prefix check)
// ---------------------------------------------------------------------------
const INTROS = {
  "marshalls-vs-tj-maxx":
    "TJ Maxx vs Marshalls pits two TJX-owned off-price giants: TJ Maxx skews toward upscale designer labels and its Runway section, while Marshalls leans into everyday variety and competitive mid-range pricing.",
  "geico-vs-usaa":
    "USAA vs Geico: USAA delivers the lowest average premiums for military families and veterans — often $500–$800/year less than Geico's ~$2,053/year national average — plus industry-leading claims satisfaction, making it the clear winner for those who qualify.",
  "bose-vs-sonos":
    "Sonos versus Bose is the multi-room ecosystem vs portability trade-off: Sonos leads in whole-home wireless audio integration while Bose wins on portable speaker value and headphone noise cancellation.",
};

console.log("== 1–3. Compare intro touch-ups ==");
for (const [slug, lede] of Object.entries(INTROS)) {
  const c = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, title: true, shortAnswer: true, status: true },
  });
  if (!c) { console.log(`!! MISSING comparison: ${slug}`); continue; }
  const cur = c.shortAnswer || "";
  console.log(`\n--- ${slug} [${c.status}] ---`);
  if (cur.startsWith(lede)) {
    console.log("  (no change — lede already applied)");
    continue;
  }
  const next = cur ? `${lede} ${cur}` : lede;
  console.log("  shortAnswer:");
  console.log(`    - was: ${JSON.stringify(cur.slice(0, 100))}`);
  console.log(`    + new: ${JSON.stringify(next.slice(0, 100))}`);
  if (!DRY) {
    await prisma.comparison.update({
      where: { id: c.id },
      data: { shortAnswer: next, lastRefreshedAt: new Date() },
    });
    console.log("  >> WRITTEN");
  }
}

// ---------------------------------------------------------------------------
// 4. Blog — insert "Netflix vs Disney Plus content comparison (2026)" H2
// ---------------------------------------------------------------------------
const BLOG_SLUG = "best-streaming-services-2026-netflix-vs-disney-plus-vs-hbo-max";
const NEW_H2_ANCHOR = "## Netflix vs Disney Plus content comparison (2026)";
const NEW_H2_BLOCK = `
## Netflix vs Disney Plus content comparison (2026)

When comparing Netflix vs Disney Plus content in 2026, the gap is sharpest in originals and franchise depth. Netflix leads in sheer volume — 6,000+ titles spanning every genre — with prestige originals like *Squid Game*, *Wednesday*, and *Stranger Things* dominating global viewership. Disney Plus counters with an unrivalled franchise library: Marvel Cinematic Universe (30+ films, 15+ series), Star Wars (multiple series and films), Pixar, and National Geographic, plus live-action remakes of beloved classics. For families, Disney Plus wins on brand-safe, universally recognisable IP; for adults seeking variety, Netflix's broader catalog and mature originals pull ahead. If you subscribe to only one, the right pick comes down to franchise loyalty vs genre diversity — Disney Plus owns IP loyalty, Netflix owns content breadth.
`;

console.log("\n== 4. Blog Netflix vs Disney Plus H2 insertion ==");
const post = await prisma.blogArticle.findUnique({
  where: { slug: BLOG_SLUG },
  select: { id: true, title: true, content: true, status: true },
});
if (!post) {
  console.log(`!! MISSING blog article: ${BLOG_SLUG}`);
} else {
  console.log(`\n--- ${BLOG_SLUG} [${post.status}] ---`);
  if (post.content.includes(NEW_H2_ANCHOR)) {
    console.log("  (no change — H2 already present)");
  } else {
    // Insert after the "## Detailed Comparison Table" section's table ends
    // (i.e., before "## Making Your Decision")
    const INSERT_AFTER = "## Making Your Decision:";
    const insertIdx = post.content.indexOf(INSERT_AFTER);
    if (insertIdx === -1) {
      console.log(`!! Could not find insert anchor "${INSERT_AFTER}" — aborting blog update`);
    } else {
      const newContent =
        post.content.slice(0, insertIdx) +
        NEW_H2_BLOCK +
        "\n" +
        post.content.slice(insertIdx);
      console.log(`  Inserting H2 before "${INSERT_AFTER}" (pos ${insertIdx})`);
      console.log(`  Content length: ${post.content.length} -> ${newContent.length}`);
      if (!DRY) {
        await prisma.blogArticle.update({
          where: { id: post.id },
          data: { content: newContent, updatedAt: new Date() },
        });
        console.log("  >> WRITTEN");
      }
    }
  }
}

await prisma.$disconnect();
console.log(DRY ? "\nDRY RUN — no writes" : "\nDONE");
