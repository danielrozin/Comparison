/**
 * DAN-1758 — Striking-distance internal links: 4 pages pos 20-24 → page 1
 *
 * Target pages (from 2026-07-05 DataForSEO snapshot):
 *   - /compare/amazon-vs-best-buy (pos 20, vol 110) — "best buy vs amazon"
 *   - /entity/mercedes-benz (pos 21, vol 320) — "mercedes-benz competitors"
 *   - /compare/farmers-insurance-vs-state-farm (pos 22, vol 110) — "farmers vs state farm home insurance"
 *   - /compare/hulu-vs-peacock (pos 24, vol 170) — "peacock hulu"
 *
 * Strategy: add 3-5 inbound internal links to each target page from topically adjacent pages.
 * Meta titles already optimized in DAN-1685.
 *
 * Run:
 *   node scripts/dan1758-striking-distance-links.mjs --dry
 *   node scripts/dan1758-striking-distance-links.mjs
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

async function insertLinkIfMissing({ fromPath, toPath, anchorText, linkType = "related", position = "inline", score = 1.0 }) {
  const existing = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (existing) { log(`  skip (exists): ${fromPath} → ${toPath}`); return false; }
  if (!DRY) {
    await prisma.internalLink.create({ data: { fromPath, toPath, anchorText, linkType, position, score } });
    log(`  ✓ Link: ${fromPath} → ${toPath}  anchor="${anchorText}"`);
  } else {
    log(`  [DRY] would link: ${fromPath} → ${toPath}`);
  }
  return true;
}

// ===========================================================================
// 1. /compare/amazon-vs-best-buy — "best buy vs amazon" pos 20, vol 110
// ===========================================================================
log("\n=== 1. amazon-vs-best-buy ===");
const AMAZON_LINKS = [
  { fromPath: "/compare/amazon-vs-walmart", toPath: "/compare/amazon-vs-best-buy", anchorText: "Best Buy vs Amazon", score: 1.3 },
  { fromPath: "/compare/amazon-vs-ebay", toPath: "/compare/amazon-vs-best-buy", anchorText: "Best Buy vs Amazon comparison", score: 1.2 },
  { fromPath: "/compare/amazon-vs-target", toPath: "/compare/amazon-vs-best-buy", anchorText: "Best Buy vs Amazon pricing and selection", score: 1.1 },
];
for (const link of AMAZON_LINKS) {
  const fromSlug = link.fromPath.replace("/compare/", "");
  const exists = await prisma.comparison.findFirst({ where: { slug: fromSlug }, select: { id: true } });
  if (!exists) { log(`  · skip (from-page missing): ${link.fromPath}`); continue; }
  await insertLinkIfMissing(link);
}

// ===========================================================================
// 2. /entity/mercedes-benz — "mercedes-benz competitors" pos 21, vol 320
// ===========================================================================
log("\n=== 2. entity/mercedes-benz ===");
const MERCEDES_ENTITY_PATH = "/entity/mercedes-benz";
const MERCEDES_COMPARE_LINKS = [
  { fromPath: "/compare/bmw-vs-mercedes", toPath: MERCEDES_ENTITY_PATH, anchorText: "Mercedes-Benz competitors", score: 1.3 },
  { fromPath: "/compare/audi-vs-mercedes-benz", toPath: MERCEDES_ENTITY_PATH, anchorText: "Mercedes-Benz rivals", score: 1.2 },
  { fromPath: "/compare/lexus-vs-mercedes", toPath: MERCEDES_ENTITY_PATH, anchorText: "Mercedes-Benz competitors overview", score: 1.1 },
  { fromPath: "/compare/tesla-vs-bmw", toPath: MERCEDES_ENTITY_PATH, anchorText: "Mercedes-Benz alternatives", score: 1.0 },
];
for (const link of MERCEDES_COMPARE_LINKS) {
  const fromSlug = link.fromPath.replace("/compare/", "");
  const exists = await prisma.comparison.findFirst({ where: { slug: fromSlug }, select: { id: true } });
  if (!exists) { log(`  · skip (from-page missing): ${link.fromPath}`); continue; }
  await insertLinkIfMissing(link);
}

// ===========================================================================
// 3. /compare/farmers-insurance-vs-state-farm — "farmers vs state farm home insurance" pos 22, vol 110
// ===========================================================================
log("\n=== 3. farmers-insurance-vs-state-farm ===");
const FARMERS_LINKS = [
  { fromPath: "/compare/allstate-vs-state-farm", toPath: "/compare/farmers-insurance-vs-state-farm", anchorText: "Farmers vs State Farm home insurance", score: 1.3 },
  { fromPath: "/compare/geico-vs-state-farm", toPath: "/compare/farmers-insurance-vs-state-farm", anchorText: "Farmers Insurance vs State Farm", score: 1.2 },
  { fromPath: "/compare/progressive-vs-state-farm", toPath: "/compare/farmers-insurance-vs-state-farm", anchorText: "Farmers vs State Farm home insurance comparison", score: 1.1 },
];
for (const link of FARMERS_LINKS) {
  const fromSlug = link.fromPath.replace("/compare/", "");
  const exists = await prisma.comparison.findFirst({ where: { slug: fromSlug }, select: { id: true } });
  if (!exists) { log(`  · skip (from-page missing): ${link.fromPath}`); continue; }
  await insertLinkIfMissing(link);
}

// ===========================================================================
// 4. /compare/hulu-vs-peacock — "peacock hulu" pos 24, vol 170
// ===========================================================================
log("\n=== 4. hulu-vs-peacock ===");
const PEACOCK_LINKS = [
  { fromPath: "/compare/disney-plus-vs-hulu", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock comparison", score: 1.3 },
  { fromPath: "/compare/netflix-vs-hulu", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock vs Hulu streaming services", score: 1.2 },
  { fromPath: "/compare/apple-tv-plus-vs-hulu", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock", score: 1.1 },
  { fromPath: "/compare/max-vs-hulu", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock vs Hulu pricing and content", score: 1.0 },
];
for (const link of PEACOCK_LINKS) {
  const fromSlug = link.fromPath.replace("/compare/", "");
  const exists = await prisma.comparison.findFirst({ where: { slug: fromSlug }, select: { id: true } });
  if (!exists) { log(`  · skip (from-page missing): ${link.fromPath}`); continue; }
  await insertLinkIfMissing(link);
}

log("\n=== Done ✓ ===");
await prisma.$disconnect();
