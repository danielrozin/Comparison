/**
 * DAN-2160 Wave 12 — Add links from VERIFIED existing pages to striking-distance targets
 *
 * All source slugs confirmed to exist in DB from find-linkable-pages.mjs
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);
let added = 0;

async function addLink({ fromSlug, toPath, anchorText, score = 1.1 }) {
  const fromPath = '/compare/' + fromSlug;
  const already = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (already) { log(`  · skip (exists): ${fromSlug} → ${toPath}`); return; }
  await prisma.internalLink.create({ data: { fromPath, toPath, anchorText, linkType: 'related', position: 'inline', score } });
  log(`  ✓ ${fromSlug} → ${anchorText.slice(0, 55)}`);
  added++;
}

// ─────────────────────────────────────────────────────────────
// 1. WW1 vs WW2 (pos 20, vol 2900) — link from Japan/China/military pages
// ─────────────────────────────────────────────────────────────
log('\n=== 1. ww1-vs-ww2: links from confirmed existing pages ===');
const WW = '/compare/ww1-vs-ww2';
await addLink({ fromSlug: 'air-force-vs-navy', toPath: WW, anchorText: 'WW1 vs WW2: causes, deaths and key differences', score: 1.3 });
await addLink({ fromSlug: 'china-vs-japan-economy-comparison-2026', toPath: WW, anchorText: 'World War 1 vs World War 2: how conflict shaped Asia', score: 1.2 });
await addLink({ fromSlug: 'japan-vs-china', toPath: WW, anchorText: 'WW1 vs WW2: Japan and China in both world wars', score: 1.2 });
await addLink({ fromSlug: 'japan-vs-china-economic-comparison-2026', toPath: WW, anchorText: 'WW1 vs WW2 comparison guide', score: 1.1 });
await addLink({ fromSlug: 'japan-vs-china-economy-comparison-2026', toPath: WW, anchorText: 'World War 1 vs 2: which was worse?', score: 1.1 });
await addLink({ fromSlug: 'china-vs-us-gdp-military-tech-comparison-2026', toPath: WW, anchorText: 'WW1 vs WW2: military scope and technology compared', score: 1.2 });
await addLink({ fromSlug: 'america-vs-china-economy', toPath: WW, anchorText: 'WW1 vs WW2: causes, deaths and global impact', score: 1.1 });

// ─────────────────────────────────────────────────────────────
// 2. Amazon vs Best Buy (pos 18, vol 110) — link from Amazon-related pages
// ─────────────────────────────────────────────────────────────
log('\n=== 2. amazon-vs-best-buy: links from confirmed existing pages ===');
const AMZ = '/compare/amazon-vs-best-buy';
await addLink({ fromSlug: 'shein-vs-amazon-haul', toPath: AMZ, anchorText: 'Amazon vs Best Buy: which is better for electronics?', score: 1.2 });
await addLink({ fromSlug: 'amazon-vs-wayfair', toPath: AMZ, anchorText: 'Best Buy vs Amazon 2026 comparison', score: 1.3 });
await addLink({ fromSlug: 'amazon-echo-vs-google-nest-hub', toPath: AMZ, anchorText: 'Amazon vs Best Buy: where to buy smart home devices', score: 1.3 });
await addLink({ fromSlug: 'amazon-vs-chewy', toPath: AMZ, anchorText: 'Amazon vs Best Buy electronics shopping guide', score: 1.2 });
await addLink({ fromSlug: 'youtube-music-vs-amazon-music', toPath: AMZ, anchorText: 'Amazon vs Best Buy: which retailer wins in 2026?', score: 1.1 });
await addLink({ fromSlug: 'spotify-vs-amazon-music', toPath: AMZ, anchorText: 'Amazon vs Best Buy: complete shopping comparison', score: 1.1 });
await addLink({ fromSlug: 'whole-foods-vs-target', toPath: AMZ, anchorText: 'Amazon vs Best Buy 2026: price and selection compared', score: 1.1 });
await addLink({ fromSlug: 'amazon-haul-vs-shein', toPath: AMZ, anchorText: 'Best Buy vs Amazon: where to shop for tech deals', score: 1.1 });

// ─────────────────────────────────────────────────────────────
// 3. Expedia vs Kayak (pos 16, vol 50) — link from travel/airline pages
// ─────────────────────────────────────────────────────────────
log('\n=== 3. expedia-vs-kayak: links from confirmed existing pages ===');
const EXP = '/compare/expedia-vs-kayak';
await addLink({ fromSlug: 'backpacking-vs-luxury-travel', toPath: EXP, anchorText: 'Expedia or Kayak: best travel site for finding deals', score: 1.3 });
await addLink({ fromSlug: 'united-airlines-vs-delta-business-class', toPath: EXP, anchorText: 'Expedia or Kayak for booking premium flights?', score: 1.3 });
await addLink({ fromSlug: 'road-trip-vs-flying', toPath: EXP, anchorText: 'Expedia vs Kayak: which travel site to use', score: 1.2 });
await addLink({ fromSlug: 'southwest-airlines-vs-delta-airlines', toPath: EXP, anchorText: 'Expedia or Kayak for booking cheap flights?', score: 1.2 });
await addLink({ fromSlug: 'booking-com-vs-hotels-com', toPath: EXP, anchorText: 'Expedia or Kayak: which is best for hotel searches?', score: 1.3 });
await addLink({ fromSlug: 'united-airlines-vs-delta-air-lines', toPath: EXP, anchorText: 'Expedia vs Kayak: find the best flight deals', score: 1.2 });
await addLink({ fromSlug: 'booking-com-vs-trivago', toPath: EXP, anchorText: 'Expedia or Kayak vs other travel sites', score: 1.2 });
await addLink({ fromSlug: 'american-airlines-vs-united-airlines', toPath: EXP, anchorText: 'Expedia or Kayak: best travel booking site?', score: 1.2 });

// ─────────────────────────────────────────────────────────────
// 4. IKEA vs Wayfair (pos 13, 15 links) — link from home/kitchen pages
// ─────────────────────────────────────────────────────────────
log('\n=== 4. ikea-vs-wayfair: links from confirmed existing pages ===');
const IKEA = '/compare/ikea-vs-wayfair';
await addLink({ fromSlug: 'cuisinart-vs-kitchenaid', toPath: IKEA, anchorText: 'IKEA vs Wayfair: best for kitchen furniture and storage', score: 1.2 });
await addLink({ fromSlug: 'hellofresh-vs-home-chef', toPath: IKEA, anchorText: 'IKEA vs Wayfair: which is better for home furnishings?', score: 1.1 });

// ─────────────────────────────────────────────────────────────
// 5. Farmers vs State Farm — find different approach: look for existing insurance pages
// ─────────────────────────────────────────────────────────────
log('\n=== 5. farmers-insurance-vs-state-farm: checking for insurance source pages ===');
const FARMERS = '/compare/farmers-insurance-vs-state-farm';
// These are the confirmed existing insurance pages (from wave scripts that already ran)
await addLink({ fromSlug: 'state-farm-vs-allstate', toPath: FARMERS, anchorText: 'Farmers vs State Farm home insurance: full comparison', score: 1.3 });
await addLink({ fromSlug: 'state-farm-vs-geico', toPath: FARMERS, anchorText: 'Farmers Insurance vs State Farm: which is cheaper?', score: 1.3 });
await addLink({ fromSlug: 'allstate-vs-geico', toPath: FARMERS, anchorText: 'Farmers vs State Farm insurance 2026', score: 1.2 });
await addLink({ fromSlug: 'amica-vs-state-farm', toPath: FARMERS, anchorText: 'Farmers vs State Farm: home insurance rates and coverage', score: 1.2 });
await addLink({ fromSlug: 'erie-insurance-vs-state-farm', toPath: FARMERS, anchorText: 'Farmers Insurance vs State Farm: full comparison', score: 1.3 });
await addLink({ fromSlug: 'state-farm-vs-nationwide', toPath: FARMERS, anchorText: 'Farmers vs State Farm: which is better for home insurance?', score: 1.2 });
await addLink({ fromSlug: 'american-family-insurance-vs-state-farm', toPath: FARMERS, anchorText: 'Farmers Insurance vs State Farm compared', score: 1.2 });

log(`\n=== Wave 12 done — ${added} new links added ===`);
await prisma.$disconnect();
