/**
 * DAN-1371 — DAN-1365 Tier 3: light intro touch-ups (idempotent prod-DB publisher).
 *
 * Run via .github/workflows/publish-editorial.yml:
 *   gh workflow run publish-editorial.yml -f script=scripts/dan1371-tier3-touchups.mjs
 *
 * Mirrors the DAN-1288 / dan1365-batch2 ship pattern (DB content fields served by
 * ISR). These pages already have query-order-matched H1s, so the only upside is a
 * minimal copy nudge that surfaces the exact target query in the intro/body. No
 * re-slugging of ranking URLs; no internal-link changes. SKIP paramount-disney
 * (KD 100, unwinnable on-page) — intentionally out of scope.
 *
 * Targets (all confirmed live via the /api/comparisons read API, 2026-06-22):
 *   /compare/marshalls-vs-tj-maxx  — "tj maxx vs marshalls" (1,000 vol, pos 29)
 *   /compare/geico-vs-usaa         — "usaa vs geico"        (390 vol, pos 30, CPC $7.27)
 *   /compare/bose-vs-sonos         — "sonos versus bose"    (390 vol, pos 29)
 *   /blog/best-streaming-services-2026-netflix-vs-disney-plus-vs-hbo-max
 *                                  — "netflix vs disney plus content comparison 2026" (880 vol, pos 24)
 *
 * Idempotency: each compare edit is a no-op once its required exact phrase is
 * present in shortAnswer; the blog H2 is a no-op once the heading exists.
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");

// ---- 1. Compare intro touch-ups -------------------------------------------
// Each entry: the exact phrase that must appear (idempotency guard) + the new
// first sentence to prepend (existing shortAnswer copy is retained as detail).
const COMPARES = {
  "marshalls-vs-tj-maxx": {
    phrase: "TJ Maxx vs Marshalls",
    lede:
      "TJ Maxx vs Marshalls comes down to one question — designer splurge or everyday variety: TJ Maxx leans into luxury labels (and Runway sections) while Marshalls casts a wider net of mid-range brands at sharp prices.",
  },
  "geico-vs-usaa": {
    phrase: "USAA vs Geico",
    // Lead with the military-cost angle — USAA's wedge (highest-value query, CPC $7.27).
    lede:
      "USAA vs Geico hinges on military affiliation: USAA's military-only discounts and lower average premiums are its wedge, while Geico stays open to everyone with competitive rates averaging about $2,053/year.",
  },
  "bose-vs-sonos": {
    phrase: "Sonos versus Bose",
    // Use the "versus" spelling once to catch the exact-match variant "sonos versus bose".
    lede:
      "Sonos versus Bose splits on what matters most: Sonos owns multi-room and smart-home audio, while Bose chases pure sound quality at a friendlier price.",
  },
};

console.log("== 1. Compare intro touch-ups ==");
for (const [slug, { phrase, lede }] of Object.entries(COMPARES)) {
  const c = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, shortAnswer: true, status: true },
  });
  if (!c) { console.log("!! MISSING", slug); continue; }
  const cur = c.shortAnswer || "";
  console.log(`\n--- ${slug} [${c.status}] ---`);
  if (cur.includes(phrase)) { console.log(`  (no change — "${phrase}" already present)`); continue; }
  const next = cur ? `${lede} ${cur}` : lede;
  console.log(`  shortAnswer:`);
  console.log(`    - was: ${JSON.stringify(cur.slice(0, 90))}`);
  console.log(`    + new: ${JSON.stringify(next.slice(0, 90))}`);
  if (!DRY) {
    await prisma.comparison.update({ where: { id: c.id }, data: { shortAnswer: next, lastRefreshedAt: new Date() } });
    console.log("  >> WRITTEN");
  }
}

// ---- 2. Blog H2 insertion -------------------------------------------------
// Add an H2 + paragraph literally titled with the long-tail query so the page
// can capture "netflix vs disney plus content comparison 2026".
const BLOG_SLUG = "best-streaming-services-2026-netflix-vs-disney-plus-vs-hbo-max";
const BLOG_HEADING = "## Netflix vs Disney Plus content comparison (2026)";
const BLOG_SECTION = `${BLOG_HEADING}

In a head-to-head Netflix vs Disney Plus content comparison for 2026, Netflix wins on breadth — a deep, constantly refreshed catalog of originals, films, and global series across every genre — while Disney Plus wins on franchises, owning Marvel, Star Wars, Pixar, and the full Disney vault alongside its growing Hulu-on-Disney+ general entertainment. If you want the widest variety and the most new originals each month, Netflix has the edge; if you're streaming for family-friendly franchises and tentpole releases you'll rewatch, Disney Plus delivers more of what you'll actually return to.`;
// Insert just before the comparison table so the prose sections stay together.
const BLOG_MARKER = "## Detailed Comparison Table";

console.log("\n== 2. Blog H2 insertion ==");
const b = await prisma.blogArticle.findUnique({ where: { slug: BLOG_SLUG }, select: { id: true, content: true } });
if (!b) {
  console.log("!! MISSING blog", BLOG_SLUG);
} else if (/^## Netflix vs Disney Plus content comparison/m.test(b.content)) {
  console.log("  (no change — heading already present)");
} else {
  const idx = b.content.indexOf(BLOG_MARKER);
  if (idx < 0) throw new Error(`insertion marker not found: ${BLOG_MARKER}`);
  const next = b.content.slice(0, idx) + BLOG_SECTION + "\n\n" + b.content.slice(idx);
  console.log(`  inserting ${BLOG_SECTION.length} chars before "${BLOG_MARKER}"`);
  console.log(`  new content len: ${next.length} (was ${b.content.length})`);
  if (!DRY) {
    await prisma.blogArticle.update({ where: { id: b.id }, data: { content: next, updatedAt: new Date() } });
    console.log("  >> WRITTEN");
  }
}

await prisma.$disconnect();
console.log(DRY ? "\nDRY RUN — no writes" : "\nDONE");
