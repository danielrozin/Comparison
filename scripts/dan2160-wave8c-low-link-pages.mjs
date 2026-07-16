/**
 * DAN-2160 Wave 8c — Boost inbound links for low-link striking-distance pages
 *
 * Targets:
 *   - ps5-pro-vs-xbox-series-x-performance-comparison-2026: 7 → 15+ links
 *   - paramount-plus-vs-peacock: 8 → 14+ links  
 *   - samsung-galaxy-vs-motorola: 9 → 15+ links
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);

async function addLink({ fromSlug, fromPath, toPath, anchorText, score = 1.1 }) {
  const exists = await prisma.comparison.findFirst({ where: { slug: fromSlug }, select: { id: true } });
  if (!exists) { log(`  · skip (page missing): ${fromSlug}`); return; }
  const already = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (already) { log(`  · skip (exists): ${fromPath} → ${toPath}`); return; }
  await prisma.internalLink.create({ data: { fromPath, toPath, anchorText, linkType: 'related', position: 'inline', score } });
  log(`  ✓ ${fromSlug} → ${anchorText}`);
}

// ─────────────────────────────────────────────────────────────
// 1. PS5 Pro vs Xbox Series X Performance
// ─────────────────────────────────────────────────────────────
log("\n=== PS5 Pro vs Xbox Series X: adding inbound links ===");
const PS5_TARGET = '/compare/ps5-pro-vs-xbox-series-x-performance-comparison-2026';
const PS5_SOURCES = [
  { fromSlug: 'playstation-5-vs-xbox-series-x', anchorText: 'PS5 Pro vs Xbox Series X: performance comparison 2026', score: 1.4 },
  { fromSlug: 'pc-vs-console-gaming', anchorText: 'PS5 Pro vs Xbox Series X performance', score: 1.2 },
  { fromSlug: 'xbox-series-x-vs-ps5-pro', anchorText: 'PS5 Pro vs Xbox Series X: detailed performance comparison', score: 1.4 },
  { fromSlug: 'playstation-plus-vs-xbox-game-pass', anchorText: 'PS5 Pro vs Xbox Series X: which is better?', score: 1.2 },
  { fromSlug: 'ps5-vs-gaming-pc', anchorText: 'PS5 Pro vs Xbox Series X performance 2026', score: 1.2 },
  { fromSlug: 'ps5-pro-vs-xbox-series-x', anchorText: 'PS5 Pro vs Xbox Series X performance head-to-head', score: 1.3 },
  { fromSlug: 'ps5-pro-vs-xbox-series-x-specs', anchorText: 'PS5 Pro vs Xbox Series X performance comparison', score: 1.3 },
  { fromSlug: 'xbox-series-x-vs-ps5-pro-performance', anchorText: 'PS5 Pro vs Xbox Series X: in-depth performance analysis', score: 1.4 },
  { fromSlug: 'ps5-pro-vs-xbox-series-x-performance', anchorText: 'Full PS5 Pro vs Xbox Series X performance test', score: 1.4 },
  { fromSlug: 'nintendo-switch-vs-ps5', anchorText: 'PS5 Pro vs Xbox Series X performance benchmark', score: 1.0 },
  { fromSlug: 'steam-deck-vs-xbox-series-x', anchorText: 'PS5 Pro vs Xbox Series X performance 2026 comparison', score: 1.1 },
];

for (const s of PS5_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: PS5_TARGET, anchorText: s.anchorText, score: s.score });
}

// ─────────────────────────────────────────────────────────────
// 2. Paramount+ vs Peacock
// ─────────────────────────────────────────────────────────────
log("\n=== Paramount+ vs Peacock: adding inbound links ===");
const PARAM_TARGET = '/compare/paramount-plus-vs-peacock';
const PARAM_SOURCES = [
  { fromSlug: 'hbo-max-vs-peacock', anchorText: 'Paramount Plus vs Peacock comparison', score: 1.3 },
  { fromSlug: 'peacock-vs-disney-plus', anchorText: 'Paramount Plus vs Peacock: which is worth it?', score: 1.3 },
  { fromSlug: 'apple-tv-plus-vs-peacock', anchorText: 'Paramount Plus vs Peacock streaming showdown', score: 1.2 },
  { fromSlug: 'peacock-vs-hulu', anchorText: 'Is Paramount Plus or Peacock better?', score: 1.2 },
  { fromSlug: 'peacock-vs-tubi', anchorText: 'Paramount Plus vs Peacock review', score: 1.1 },
  { fromSlug: 'apple-tv-plus-vs-disney-plus', anchorText: 'Paramount Plus vs Peacock streaming comparison', score: 1.0 },
  { fromSlug: 'netflix-vs-peacock', anchorText: 'Paramount Plus vs Peacock: content and pricing compared', score: 1.2 },
  { fromSlug: 'hbo-max-vs-netflix', anchorText: 'Paramount Plus vs Peacock: head-to-head', score: 1.0 },
  { fromSlug: 'hulu-vs-netflix', anchorText: 'Paramount Plus or Peacock: streaming comparison 2026', score: 1.0 },
  { fromSlug: 'sling-tv-vs-hulu-live', anchorText: 'Paramount Plus vs Peacock streaming', score: 1.0 },
];

for (const s of PARAM_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: PARAM_TARGET, anchorText: s.anchorText, score: s.score });
}

// ─────────────────────────────────────────────────────────────
// 3. Samsung Galaxy vs Motorola
// ─────────────────────────────────────────────────────────────
log("\n=== Samsung Galaxy vs Motorola: adding inbound links ===");
const SAM_TARGET = '/compare/samsung-galaxy-vs-motorola';
const SAM_SOURCES = [
  { fromSlug: 'google-pixel-vs-samsung-galaxy', anchorText: 'Samsung Galaxy vs Motorola comparison', score: 1.3 },
  { fromSlug: 'samsung-galaxy-vs-xiaomi', anchorText: 'Samsung vs Motorola: which Android phone brand wins?', score: 1.3 },
  { fromSlug: 'google-pixel-vs-samsung', anchorText: 'Samsung Galaxy vs Motorola phones', score: 1.2 },
  { fromSlug: 'samsung-vs-google', anchorText: 'Samsung Galaxy vs Motorola 2026', score: 1.2 },
  { fromSlug: 'android-vs-iphone', anchorText: 'Samsung Galaxy vs Motorola: which Android brand is better?', score: 1.1 },
  { fromSlug: 'iphone-vs-android', anchorText: 'Samsung Galaxy vs Motorola comparison', score: 1.0 },
  { fromSlug: 'iphone-vs-samsung-galaxy', anchorText: 'Samsung Galaxy vs Motorola', score: 1.0 },
  { fromSlug: 'samsung-galaxy-s26-vs-nothing-phone-3', anchorText: 'Samsung Galaxy vs Motorola: full brand comparison', score: 1.1 },
  { fromSlug: 'google-pixel-9-pro-vs-samsung-galaxy-s25-ultra', anchorText: 'Samsung Galaxy vs Motorola phone comparison', score: 1.1 },
  { fromSlug: 'samsung-galaxy-s25-vs-google-pixel-9', anchorText: 'Samsung Galaxy vs Motorola Edge', score: 1.1 },
  { fromSlug: 'nothing-phone-vs-pixel', anchorText: 'Samsung Galaxy vs Motorola: best budget and flagship Android', score: 1.0 },
];

for (const s of SAM_SOURCES) {
  await addLink({ fromSlug: s.fromSlug, fromPath: '/compare/' + s.fromSlug, toPath: SAM_TARGET, anchorText: s.anchorText, score: s.score });
}

log("\n=== Wave 8c done ===");
await prisma.$disconnect();
