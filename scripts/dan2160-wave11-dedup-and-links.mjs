/**
 * DAN-2160 Wave 11 — Fix duplicate KDs + boost inbound links for low-link pages
 *
 * Actions:
 * 1. Deduplicate keyDifferences on ps5-pro-vs-xbox-series-x-performance-comparison-2026
 * 2. Deduplicate keyDifferences on macbook-air-vs-macbook-pro-difference-2026-specs
 * 3. Add inbound links to virat-kohli-vs-sachin-tendulkar (13→18 links)
 * 4. Add inbound links to expedia-vs-kayak (14→18 links)
 * 5. Add inbound links to ikea-vs-wayfair (14→18 links)
 * 6. Add inbound links to amazon-vs-best-buy (14→18 links)
 * 7. Add inbound links to farmers-insurance-vs-state-farm (15→18 links)
 * 8. Add inbound links to ww1-vs-ww2 (16→20 links)
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);

// ─────────────────────────────────────────────────────────────
// UTIL: add a link safely
// ─────────────────────────────────────────────────────────────
async function addLink({ fromSlug, fromPath, toPath, anchorText, score = 1.1 }) {
  const exists = await prisma.comparison.findFirst({ where: { slug: fromSlug }, select: { id: true } });
  if (!exists) { log(`  · skip (page missing): ${fromSlug}`); return 0; }
  const already = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (already) { log(`  · skip (exists): ${fromPath} → ${toPath}`); return 0; }
  await prisma.internalLink.create({ data: { fromPath, toPath, anchorText, linkType: 'related', position: 'inline', score } });
  log(`  ✓ linked: ${fromSlug} → ${anchorText.slice(0, 50)}`);
  return 1;
}

// ─────────────────────────────────────────────────────────────
// UTIL: deduplicate keyDifferences by label or aValue
// ─────────────────────────────────────────────────────────────
async function deduplicateKDs(slug) {
  const page = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, keyDifferences: true }
  });
  if (!page || !Array.isArray(page.keyDifferences)) {
    log(`  · ${slug}: no KDs to dedup`);
    return;
  }
  const seen = new Set();
  const deduped = [];
  for (const kd of page.keyDifferences) {
    const key = kd.label || kd.aValue || JSON.stringify(kd).slice(0, 40);
    if (seen.has(key)) {
      log(`  · removed dup: "${key.slice(0, 50)}"`);
    } else {
      seen.add(key);
      deduped.push(kd);
    }
  }
  if (deduped.length < page.keyDifferences.length) {
    await prisma.comparison.update({
      where: { id: page.id },
      data: { keyDifferences: deduped, updatedAt: new Date() }
    });
    log(`  ✓ ${slug}: ${page.keyDifferences.length} → ${deduped.length} KDs (deduped)`);
  } else {
    log(`  · ${slug}: no duplicates found`);
  }
}

// ─────────────────────────────────────────────────────────────
// 1. Fix duplicate KDs
// ─────────────────────────────────────────────────────────────
log('\n=== 1. Dedup keyDifferences ===');
await deduplicateKDs('ps5-pro-vs-xbox-series-x-performance-comparison-2026');
await deduplicateKDs('macbook-air-vs-macbook-pro-difference-2026-specs');

// ─────────────────────────────────────────────────────────────
// 2. Virat Kohli vs Sachin (pos 15, 13 links → target 18)
// ─────────────────────────────────────────────────────────────
log('\n=== 2. virat-kohli-vs-sachin-tendulkar: add inbound links ===');
const KOHLI_TARGET = '/compare/virat-kohli-vs-sachin-tendulkar';
const KOHLI_SOURCES = [
  { fromSlug: 'messi-vs-ronaldo', anchorText: 'Virat Kohli vs Sachin Tendulkar: cricket GOAT debate', score: 1.1 },
  { fromSlug: 'lebron-james-vs-michael-jordan', anchorText: 'Virat Kohli vs Sachin Tendulkar statistics', score: 1.1 },
  { fromSlug: 'lebron-james-vs-kobe-bryant', anchorText: 'Virat Kohli vs Sachin Tendulkar career comparison', score: 1.1 },
  { fromSlug: 'kobe-bryant-vs-lebron-james', anchorText: 'Virat Kohli vs Sachin Tendulkar: who is better?', score: 1.1 },
  { fromSlug: 'cristiano-ronaldo-vs-lionel-messi', anchorText: 'Virat Kohli vs Sachin Tendulkar: cricket stats showdown', score: 1.1 },
  { fromSlug: 'tiger-woods-vs-rory-mcilroy', anchorText: 'Virat Kohli vs Sachin Tendulkar comparison', score: 1.0 },
  { fromSlug: 'nba-vs-nfl', anchorText: 'Virat Kohli vs Sachin Tendulkar records', score: 1.0 },
  { fromSlug: 'michael-jordan-vs-lebron-james', anchorText: 'Virat Kohli vs Sachin Tendulkar: full career stats', score: 1.0 },
];
for (const s of KOHLI_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: KOHLI_TARGET, anchorText: s.anchorText, score: s.score });
}

// ─────────────────────────────────────────────────────────────
// 3. Expedia vs Kayak (pos 16, 14 links → target 18)
// ─────────────────────────────────────────────────────────────
log('\n=== 3. expedia-vs-kayak: add inbound links ===');
const EXPEDIA_TARGET = '/compare/expedia-vs-kayak';
const EXPEDIA_SOURCES = [
  { fromSlug: 'airbnb-vs-vrbo', anchorText: 'Expedia or Kayak: which travel site wins?', score: 1.3 },
  { fromSlug: 'tripadvisor-vs-google-reviews', anchorText: 'Expedia or Kayak for booking flights and hotels?', score: 1.2 },
  { fromSlug: 'booking-com-vs-expedia', anchorText: 'Is Kayak or Expedia better for travel deals?', score: 1.3 },
  { fromSlug: 'airbnb-vs-hotels', anchorText: 'Expedia vs Kayak 2026 comparison', score: 1.2 },
  { fromSlug: 'google-flights-vs-expedia', anchorText: 'Expedia or Kayak: which travel search engine to use?', score: 1.3 },
  { fromSlug: 'priceline-vs-expedia', anchorText: 'Expedia or Kayak for cheap flights?', score: 1.3 },
  { fromSlug: 'hotels-com-vs-expedia', anchorText: 'Kayak vs Expedia: full travel site comparison', score: 1.2 },
  { fromSlug: 'delta-vs-united-airlines', anchorText: 'Expedia or Kayak for airline booking?', score: 1.0 },
];
for (const s of EXPEDIA_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: EXPEDIA_TARGET, anchorText: s.anchorText, score: s.score });
}

// ─────────────────────────────────────────────────────────────
// 4. IKEA vs Wayfair (pos 13, 14 links → target 18)
// ─────────────────────────────────────────────────────────────
log('\n=== 4. ikea-vs-wayfair: add inbound links ===');
const IKEA_TARGET = '/compare/ikea-vs-wayfair';
const IKEA_SOURCES = [
  { fromSlug: 'costco-vs-sams-club', anchorText: 'IKEA vs Wayfair: which is better for home furniture?', score: 1.2 },
  { fromSlug: 'target-vs-walmart', anchorText: 'Wayfair vs IKEA furniture comparison', score: 1.2 },
  { fromSlug: 'amazon-vs-walmart', anchorText: 'IKEA vs Wayfair: price, quality and delivery', score: 1.2 },
  { fromSlug: 'home-depot-vs-lowes', anchorText: 'IKEA or Wayfair for home furniture?', score: 1.2 },
  { fromSlug: 'walmart-vs-target', anchorText: 'Wayfair vs IKEA: Reddit user verdict', score: 1.1 },
  { fromSlug: 'amazon-vs-best-buy', anchorText: 'IKEA vs Wayfair: which has better furniture deals?', score: 1.1 },
  { fromSlug: 'target-vs-amazon', anchorText: 'Wayfair vs IKEA 2026: comprehensive review', score: 1.1 },
  { fromSlug: 'bed-bath-beyond-vs-wayfair', anchorText: 'IKEA vs Wayfair: the complete furniture guide', score: 1.2 },
];
for (const s of IKEA_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: IKEA_TARGET, anchorText: s.anchorText, score: s.score });
}

// ─────────────────────────────────────────────────────────────
// 5. Amazon vs Best Buy (pos 18, 14 links → target 18)
// ─────────────────────────────────────────────────────────────
log('\n=== 5. amazon-vs-best-buy: add inbound links ===');
const AMAZON_TARGET = '/compare/amazon-vs-best-buy';
const AMAZON_SOURCES = [
  { fromSlug: 'amazon-vs-walmart', anchorText: 'Amazon vs Best Buy: which wins for electronics?', score: 1.3 },
  { fromSlug: 'target-vs-amazon', anchorText: 'Best Buy vs Amazon for electronics shopping', score: 1.2 },
  { fromSlug: 'amazon-prime-vs-walmart-plus', anchorText: 'Amazon vs Best Buy 2026 comparison', score: 1.3 },
  { fromSlug: 'walmart-vs-amazon', anchorText: 'Best Buy vs Amazon: which is cheaper?', score: 1.3 },
  { fromSlug: 'apple-store-vs-best-buy', anchorText: 'Amazon or Best Buy: where should you shop?', score: 1.3 },
  { fromSlug: 'best-buy-vs-costco-electronics', anchorText: 'Amazon vs Best Buy electronics pricing 2026', score: 1.2 },
  { fromSlug: 'newegg-vs-amazon', anchorText: 'Best Buy vs Amazon: electronics retailer showdown', score: 1.2 },
  { fromSlug: 'costco-vs-amazon', anchorText: 'Amazon vs Best Buy: complete shopping guide', score: 1.2 },
];
for (const s of AMAZON_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: AMAZON_TARGET, anchorText: s.anchorText, score: s.score });
}

// ─────────────────────────────────────────────────────────────
// 6. Farmers vs State Farm (pos 19, 15 links → target 20)
// ─────────────────────────────────────────────────────────────
log('\n=== 6. farmers-insurance-vs-state-farm: add inbound links ===');
const FARMERS_TARGET = '/compare/farmers-insurance-vs-state-farm';
const FARMERS_SOURCES = [
  { fromSlug: 'geico-vs-progressive', anchorText: 'Farmers vs State Farm home insurance comparison', score: 1.3 },
  { fromSlug: 'allstate-vs-state-farm', anchorText: 'Farmers Insurance vs State Farm: which is better?', score: 1.3 },
  { fromSlug: 'geico-vs-state-farm', anchorText: 'Farmers vs State Farm insurance review', score: 1.3 },
  { fromSlug: 'progressive-vs-state-farm', anchorText: 'Farmers Insurance vs State Farm: full comparison', score: 1.2 },
  { fromSlug: 'liberty-mutual-vs-state-farm', anchorText: 'Farmers vs State Farm home insurance 2026', score: 1.2 },
  { fromSlug: 'nationwide-vs-state-farm', anchorText: 'Farmers Insurance or State Farm: which is cheaper?', score: 1.2 },
  { fromSlug: 'usaa-vs-state-farm', anchorText: 'Farmers vs State Farm: insurance comparison guide', score: 1.1 },
  { fromSlug: 'travelers-vs-state-farm', anchorText: 'Farmers vs State Farm: rates and coverage compared', score: 1.2 },
];
for (const s of FARMERS_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: FARMERS_TARGET, anchorText: s.anchorText, score: s.score });
}

// ─────────────────────────────────────────────────────────────
// 7. WW1 vs WW2 (pos 20, 16 links → target 22)
// ─────────────────────────────────────────────────────────────
log('\n=== 7. ww1-vs-ww2: add inbound links ===');
const WW_TARGET = '/compare/ww1-vs-ww2';
const WW_SOURCES = [
  { fromSlug: 'allied-vs-axis-powers', anchorText: 'WW1 vs WW2: causes, deaths and key differences', score: 1.4 },
  { fromSlug: 'hiroshima-vs-nagasaki', anchorText: 'World War 1 vs World War 2 comparison', score: 1.3 },
  { fromSlug: 'vietnam-war-vs-korean-war', anchorText: 'WW1 vs WW2: which was worse?', score: 1.3 },
  { fromSlug: 'cold-war-vs-world-war-2', anchorText: 'World War 1 vs World War 2: deaths, causes and scope', score: 1.3 },
  { fromSlug: 'british-empire-vs-roman-empire', anchorText: 'WW1 vs WW2: which shaped the modern world more?', score: 1.2 },
  { fromSlug: 'napoleon-vs-hitler', anchorText: 'WW1 vs WW2: why is WW2 more famous?', score: 1.3 },
  { fromSlug: 'american-civil-war-vs-revolutionary-war', anchorText: 'WW1 vs WW2 full comparison guide', score: 1.2 },
  { fromSlug: 'korean-war-vs-vietnam-war', anchorText: 'World War 1 vs 2: complete historical comparison', score: 1.2 },
  { fromSlug: 'usa-vs-ussr-cold-war', anchorText: 'WW1 vs WW2: casualties, technology and legacy', score: 1.2 },
  { fromSlug: 'roman-empire-vs-mongol-empire', anchorText: 'Why was WW2 more devastating than WW1?', score: 1.1 },
];
for (const s of WW_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: WW_TARGET, anchorText: s.anchorText, score: s.score });
}

// ─────────────────────────────────────────────────────────────
// 8. Touch freshness on all key striking-distance pages
// ─────────────────────────────────────────────────────────────
log('\n=== 8. Freshness touch on all striking-distance pages ===');
const freshnessSlugs = [
  'ww1-vs-ww2',
  'amazon-vs-best-buy',
  'farmers-insurance-vs-state-farm',
  'expedia-vs-kayak',
  'capital-one-vs-chase',
  'ikea-vs-wayfair',
  'ps5-pro-vs-xbox-series-x-performance-comparison-2026',
  'macbook-air-vs-macbook-pro-difference-2026-specs',
  'youtube-music-vs-soundcloud',
  'virat-kohli-vs-sachin-tendulkar',
  'kobe-bryant-vs-lebron-james',
  'samsung-galaxy-vs-motorola',
  'f-16-vs-f-15',
  'macbook-air-m3-vs-macbook-air-m4',
];
let freshnessCount = 0;
for (const slug of freshnessSlugs) {
  const page = await prisma.comparison.findUnique({ where: { slug }, select: { id: true } });
  if (page) {
    await prisma.comparison.update({
      where: { id: page.id },
      data: { lastRefreshedAt: new Date(), updatedAt: new Date() }
    });
    log(`  ✓ touched: ${slug}`);
    freshnessCount++;
  }
}
log(`  → Freshness-touched ${freshnessCount} pages`);

log('\n=== Wave 11 done ===');
await prisma.$disconnect();
