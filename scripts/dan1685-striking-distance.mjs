/**
 * DAN-1685 — Striking-distance push: optimize top 11–20 pages for top-10
 *
 * Target deadline: 2026-07-12. Based on 2026-07-03 re-measure (DAN-1683).
 * 23 keywords in pos 11–20, 0 in top 10.
 *
 * Levers applied:
 *   1. metaTitle + metaDescription CTR refresh (6 comparison pages, 1 blog)
 *   2. Additional internal links → /compare/ww1-vs-ww2 from history/military pages
 *
 * NOTE: If the local DB credentials are expired, run via the production endpoint instead:
 *   curl -s -X GET https://www.aversusb.net/api/cron/dan1685-seo-push \
 *     -H "Authorization: Bearer aversusb-cron-2026-secret-x9k4m"
 *
 * Run locally (after refreshing .env.local credentials):
 *   node scripts/dan1685-striking-distance.mjs
 *   node scripts/dan1685-striking-distance.mjs --dry
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

// ---------------------------------------------------------------------------
// 1) Comparison meta rewrites
// ---------------------------------------------------------------------------
const COMPARISON_META = [
  {
    slug: "ww1-vs-ww2",
    // vol 2,900 pos 20 — "ww1 vs ww2"
    metaTitle: "World War 1 vs World War 2: Causes & Deaths | A Versus B",
    metaDescription:
      "Compare World War 1 vs World War 2: causes, casualties (20M vs 70–85M deaths), technology used, and which war was more destructive. Full WW1 vs WW2 breakdown.",
  },
  {
    slug: "macbook-air-vs-macbook-pro-difference-2026-specs",
    // vol 140 pos 19 + vol 90 pos 20 — "macbook air vs pro 2026" + "macbook pro vs air 2026"
    metaTitle: "MacBook Air vs Pro 2026: Specs & Which to Buy | A Versus B",
    metaDescription:
      "MacBook Air vs MacBook Pro 2026: M4 chip performance, display specs, weight, battery life, price difference and which Apple laptop best fits your needs.",
  },
  {
    slug: "farmers-insurance-vs-state-farm",
    // vol 110 pos 19 — "farmers vs state farm home insurance"
    metaTitle: "Farmers vs State Farm Home Insurance 2026 | A Versus B",
    metaDescription:
      "Farmers vs State Farm home insurance 2026: coverage options, premiums, discounts, claims experience, J.D. Power ratings and which insurer is right for you.",
  },
  {
    slug: "amazon-vs-best-buy",
    // vol 110 pos 18 — "best buy vs amazon" (query has Best Buy first)
    metaTitle: "Best Buy vs Amazon 2026: Which Wins? | A Versus B",
    metaDescription:
      "Best Buy vs Amazon 2026: compare pricing, product selection, shipping speed, return policies, warranties and in-store support — which retailer gives you the better deal?",
  },
  {
    slug: "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
    // vol 90 pos 20 — "ps5 pro vs xbox series x: performance"
    metaTitle: "PS5 Pro vs Xbox Series X Performance 2026 | A Versus B",
    metaDescription:
      "PS5 Pro vs Xbox Series X performance 2026: GPU teraflops, 4K frame rates, ray tracing, load times, exclusive games and which console is worth buying.",
  },
  {
    slug: "expedia-vs-kayak",
    // vol 50 pos 16 — "expedia or kayak"
    metaTitle: "Expedia or Kayak 2026: Which Travel Site Wins? | A Versus B",
    metaDescription:
      "Expedia or Kayak 2026: compare flight and hotel prices, search tools, booking fees, rewards programs, customer support and which travel site saves you more.",
  },
];

// ---------------------------------------------------------------------------
// 2) Blog meta rewrites
// ---------------------------------------------------------------------------
// Blog pages use Next.js title.template so metaTitle should NOT include " | A Versus B"
const BLOG_META = [
  {
    slug: "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider",
    // vol 320 pos 16 — "mercedes-benz competitors"
    metaTitle: "Mercedes-Benz Competitors 2026: Top Rivals",
    metaDescription:
      "Top Mercedes-Benz competitors in 2026: BMW, Audi, Lexus, Genesis and more. Compare luxury sedan and SUV rivals by price, features and brand reputation.",
  },
];

// ---------------------------------------------------------------------------
// 3) Internal links → /compare/ww1-vs-ww2 (DAN-1662 additions)
// ---------------------------------------------------------------------------
const WW1_TARGET = "/compare/ww1-vs-ww2";
const WW1_LINKS = [
  { fromPath: "/compare/democracy-vs-communism", anchorText: "World War 1 vs World War 2", linkType: "related", position: "inline", score: 1.2 },
  { fromPath: "/compare/vietnam-war-vs-korean-war-comparison", anchorText: "WW1 vs WW2 comparison", linkType: "related", position: "inline", score: 1.1 },
  { fromPath: "/compare/us-military-vs-china-military", anchorText: "World War 1 vs World War 2", linkType: "related", position: "inline", score: 1.0 },
];

async function main() {
  // 1) Comparison metas
  log("== Comparison meta rewrites ==");
  for (const c of COMPARISON_META) {
    const row = await prisma.comparison.findUnique({ where: { slug: c.slug }, select: { id: true, metaTitle: true } });
    if (!row) { log(`! not found: ${c.slug}`); continue; }
    log(`  slug: ${c.slug}`);
    log(`    was:  ${row.metaTitle || "(none)"}`);
    log(`    now:  ${c.metaTitle} (${c.metaTitle.length})`);
    if (!DRY) {
      await prisma.comparison.update({ where: { slug: c.slug }, data: { metaTitle: c.metaTitle, metaDescription: c.metaDescription } });
      log("    ✓ updated");
    }
  }

  // 2) Blog metas
  log("\n== Blog meta rewrites ==");
  for (const b of BLOG_META) {
    const row = await prisma.blogArticle.findUnique({ where: { slug: b.slug }, select: { id: true, metaTitle: true } });
    if (!row) { log(`! not found: ${b.slug}`); continue; }
    log(`  slug: ${b.slug}`);
    log(`    was:  ${row.metaTitle || "(none)"}`);
    log(`    now:  ${b.metaTitle} (${b.metaTitle.length})`);
    if (!DRY) {
      await prisma.blogArticle.update({ where: { slug: b.slug }, data: { metaTitle: b.metaTitle, metaDescription: b.metaDescription } });
      log("    ✓ updated");
    }
  }

  // 3) Internal links
  log("\n== Internal links → /compare/ww1-vs-ww2 ==");
  let added = 0;
  for (const link of WW1_LINKS) {
    const fromSlug = link.fromPath.replace("/compare/", "");
    const fromExists = await prisma.comparison.findFirst({ where: { slug: fromSlug }, select: { id: true } });
    if (!fromExists) { log(`  · skip (from-page missing): ${link.fromPath}`); continue; }
    const existing = await prisma.internalLink.findFirst({ where: { fromPath: link.fromPath, toPath: WW1_TARGET } });
    if (existing) { log(`  = exists: ${link.fromPath} → ${WW1_TARGET}`); continue; }
    if (!DRY) {
      await prisma.internalLink.create({ data: { ...link, toPath: WW1_TARGET } });
      added++;
    }
    log(`  ✓ ${DRY ? "[dry]" : "added"}: ${link.fromPath} → ${WW1_TARGET}`);
  }
  log(`  Total new links: ${DRY ? "N/A (dry)" : added}`);

  log("\nDone ✓");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
