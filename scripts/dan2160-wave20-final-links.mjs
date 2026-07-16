/**
 * DAN-2160 Wave 20 — Final link-building pass
 *
 * Gap audit: several mega-traffic pages don't yet point to our
 * most important striking-distance targets. Fixing:
 *
 * ww1-vs-ww2 (pos 20, vol 2900 — biggest traffic prize):
 *   Missing from iphone-17-vs-samsung-s26 (2.1M), mac-vs-windows (623k),
 *   android-vs-ios (534k), nvidia-vs-amd (412k), wordpress-vs-wix, canva-vs-photoshoot, slack
 *
 * farmers-insurance-vs-state-farm (pos 19, $12.32 CPC):
 *   Missing from iphone-17-vs-samsung-s26 (2.1M), mac-vs-windows (623k),
 *   neymar-vs-mbappe (567k), android-vs-ios (534k), nvidia-vs-amd (412k), ali-vs-tyson (412k)
 *
 * amazon-vs-best-buy (pos 18, vol 110):
 *   Missing from usa-vs-china (1.2M)
 *
 * ikea-vs-wayfair (pos 13, vol 40):
 *   Missing from nvidia-vs-amd (412k), us-economy-vs-china-economy (345k),
 *   stock-market-vs-real-estate (287k)
 *
 * capital-one-vs-chase (pos 13, vol 40):
 *   Missing from nvidia-vs-amd (412k)
 *
 * expedia-vs-kayak (pos 16, vol 50):
 *   Missing from nvidia-vs-amd (412k), wordpress-vs-wix
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

async function addLink(fromSlug, toSlug, anchorText, score = 1.0) {
  const fromPath = `/compare/${fromSlug}`;
  const toPath = `/compare/${toSlug}`;
  const existing = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (existing) {
    log(`  · already exists: ${fromSlug} → ${toSlug}`);
    return;
  }
  await prisma.internalLink.create({
    data: { fromPath, toPath, anchorText, linkType: "related", position: "inline", score },
  });
  log(`  ✓ ${fromSlug} → ${toSlug}`);
  added++;
}

// ══════════════════════════════════════════════════════════════
// 1. ww1-vs-ww2  (pos 20, vol 2900 — the biggest traffic prize)
// ══════════════════════════════════════════════════════════════
log("\n=== ww1-vs-ww2: mega-traffic sources ===");

// iphone-17-vs-samsung-s26 (2.1M views)
await addLink(
  "iphone-17-vs-samsung-s26",
  "ww1-vs-ww2",
  "WW1 vs WW2: history's most consequential tech and strategy clash, compared",
  0.80
);

// mac-vs-windows (623k views)
await addLink(
  "mac-vs-windows",
  "ww1-vs-ww2",
  "WW1 vs WW2 compared: another platform war that changed everything",
  0.75
);

// android-vs-ios (534k views)
await addLink(
  "android-vs-ios",
  "ww1-vs-ww2",
  "WW1 vs WW2: the original ecosystem battle — open alliances vs closed blocs",
  0.75
);

// nvidia-vs-amd (412k views)
await addLink(
  "nvidia-vs-amd",
  "ww1-vs-ww2",
  "GPU rivalries are fierce; WW1 vs WW2 shows what real industrial rivalry looks like",
  0.70
);

// wordpress-vs-wix (68k views)
await addLink(
  "wordpress-vs-wix",
  "ww1-vs-ww2",
  "WW1 vs WW2: understanding the world wars helps put any modern rivalry in perspective",
  0.65
);

// canva-vs-photoshop (53k views)
await addLink(
  "canva-vs-photoshop",
  "ww1-vs-ww2",
  "WW1 vs WW2: history's graphic battle — propaganda posters and the visual war",
  0.68
);

// slack-vs-microsoft-teams (53k views)
await addLink(
  "slack-vs-microsoft-teams",
  "ww1-vs-ww2",
  "WW1 vs WW2 compared: team communication decided outcomes in both world wars",
  0.67
);

// ══════════════════════════════════════════════════════════════
// 2. farmers-insurance-vs-state-farm  (pos 19, $12.32 CPC)
// ══════════════════════════════════════════════════════════════
log("\n=== farmers-insurance-vs-state-farm: mega-traffic sources ===");

// iphone-17-vs-samsung-s26 (2.1M views)
await addLink(
  "iphone-17-vs-samsung-s26",
  "farmers-insurance-vs-state-farm",
  "Farmers vs State Farm home insurance: protecting the tech you buy matters",
  0.72
);

// mac-vs-windows (623k views)
await addLink(
  "mac-vs-windows",
  "farmers-insurance-vs-state-farm",
  "Farmers Insurance vs State Farm: just as you protect your devices, protect your home",
  0.70
);

// neymar-vs-mbappe (567k views)
await addLink(
  "neymar-vs-mbappe",
  "farmers-insurance-vs-state-farm",
  "Farmers vs State Farm: world-class coverage rivalry, like football's biggest stars",
  0.72
);

// android-vs-ios (534k views)
await addLink(
  "android-vs-ios",
  "farmers-insurance-vs-state-farm",
  "Farmers Insurance vs State Farm: picking the right insurer is as personal as your phone choice",
  0.70
);

// nvidia-vs-amd (412k views)
await addLink(
  "nvidia-vs-amd",
  "farmers-insurance-vs-state-farm",
  "Farmers vs State Farm: insure that home office setup — which insurer wins for electronics?",
  0.68
);

// ali-vs-tyson (412k views)
await addLink(
  "ali-vs-tyson",
  "farmers-insurance-vs-state-farm",
  "Farmers Insurance vs State Farm: the heavyweight insurance rivalry — who delivers the knockout coverage?",
  0.73
);

// wordpress-vs-wix (68k views)
await addLink(
  "wordpress-vs-wix",
  "farmers-insurance-vs-state-farm",
  "Farmers vs State Farm home insurance: coverage that matters whether you build on WordPress or Wix",
  0.60
);

// canva-vs-photoshop (53k views)
await addLink(
  "canva-vs-photoshop",
  "farmers-insurance-vs-state-farm",
  "Farmers Insurance vs State Farm: creative pros need strong home-office coverage",
  0.60
);

// slack-vs-microsoft-teams (53k views)
await addLink(
  "slack-vs-microsoft-teams",
  "farmers-insurance-vs-state-farm",
  "Farmers vs State Farm: remote workers need reliable home insurance — the two giants compared",
  0.62
);

// ══════════════════════════════════════════════════════════════
// 3. amazon-vs-best-buy  (pos 18, vol 110)
// ══════════════════════════════════════════════════════════════
log("\n=== amazon-vs-best-buy: usa-vs-china ===");

// usa-vs-china (1.2M views)
await addLink(
  "usa-vs-china",
  "amazon-vs-best-buy",
  "Amazon vs Best Buy: the retail battle that plays out in the US-China trade rivalry",
  0.78
);

// wordpress-vs-wix (68k views)
await addLink(
  "wordpress-vs-wix",
  "amazon-vs-best-buy",
  "Amazon vs Best Buy: where to buy tech for your site build — online or in-store?",
  0.65
);

// canva-vs-photoshop (53k views)
await addLink(
  "canva-vs-photoshop",
  "amazon-vs-best-buy",
  "Amazon vs Best Buy: where creative pros buy their design hardware",
  0.63
);

// slack-vs-microsoft-teams (53k views)
await addLink(
  "slack-vs-microsoft-teams",
  "amazon-vs-best-buy",
  "Amazon vs Best Buy: equipping your remote team — where to shop for tech gear",
  0.63
);

// ══════════════════════════════════════════════════════════════
// 4. ikea-vs-wayfair  (pos 13, "wayfair vs ikea reddit")
// ══════════════════════════════════════════════════════════════
log("\n=== ikea-vs-wayfair: remaining sources ===");

// nvidia-vs-amd (412k views)
await addLink(
  "nvidia-vs-amd",
  "ikea-vs-wayfair",
  "IKEA vs Wayfair: furnish your battlestation after choosing your GPU",
  0.68
);

// us-economy-vs-china-economy (345k views)
await addLink(
  "us-economy-vs-china-economy",
  "ikea-vs-wayfair",
  "IKEA vs Wayfair: global trade dynamics explain why Swedish IKEA vs US Wayfair prices differ",
  0.74
);

// stock-market-vs-real-estate (287k views)
await addLink(
  "stock-market-vs-real-estate",
  "ikea-vs-wayfair",
  "IKEA vs Wayfair: furnishing your investment property — which delivers better value?",
  0.75
);

// canva-vs-photoshop (53k views)
await addLink(
  "canva-vs-photoshop",
  "ikea-vs-wayfair",
  "IKEA vs Wayfair: interior design decisions, just like your design tool choice",
  0.62
);

// slack-vs-microsoft-teams (53k views)
await addLink(
  "slack-vs-microsoft-teams",
  "ikea-vs-wayfair",
  "IKEA vs Wayfair: outfitting your home office — which wins for WFH essentials?",
  0.65
);

// ══════════════════════════════════════════════════════════════
// 5. capital-one-vs-chase  (pos 13, "are chase and capital one affiliated")
// ══════════════════════════════════════════════════════════════
log("\n=== capital-one-vs-chase: remaining sources ===");

// nvidia-vs-amd (412k views)
await addLink(
  "nvidia-vs-amd",
  "capital-one-vs-chase",
  "Capital One vs Chase: the best credit card for financing your GPU upgrade",
  0.70
);

// wordpress-vs-wix (68k views)
await addLink(
  "wordpress-vs-wix",
  "capital-one-vs-chase",
  "Capital One vs Chase: the best bank for funding your website business",
  0.63
);

// canva-vs-photoshop (53k views)
await addLink(
  "canva-vs-photoshop",
  "capital-one-vs-chase",
  "Capital One vs Chase: the best credit card rewards for creative professionals",
  0.63
);

// slack-vs-microsoft-teams (53k views)
await addLink(
  "slack-vs-microsoft-teams",
  "capital-one-vs-chase",
  "Capital One vs Chase: banking options for remote-first businesses using either platform",
  0.63
);

// ══════════════════════════════════════════════════════════════
// 6. expedia-vs-kayak  (pos 16, "expedia or kayak")
// ══════════════════════════════════════════════════════════════
log("\n=== expedia-vs-kayak: remaining sources ===");

// nvidia-vs-amd (412k views)
await addLink(
  "nvidia-vs-amd",
  "expedia-vs-kayak",
  "Expedia vs Kayak: book your trip to the next GPU launch event — which travel site wins?",
  0.67
);

// wordpress-vs-wix (68k views)
await addLink(
  "wordpress-vs-wix",
  "expedia-vs-kayak",
  "Expedia or Kayak: where digital nomads using WordPress book their flights",
  0.63
);

// canva-vs-photoshop (53k views)
await addLink(
  "canva-vs-photoshop",
  "expedia-vs-kayak",
  "Expedia vs Kayak: booking travel for creative conferences and design events",
  0.62
);

// slack-vs-microsoft-teams (53k views)
await addLink(
  "slack-vs-microsoft-teams",
  "expedia-vs-kayak",
  "Expedia or Kayak: travel booking for remote teams headed to company offsites",
  0.65
);

// ══════════════════════════════════════════════════════════════
// Update freshness on all target pages
// ══════════════════════════════════════════════════════════════
log("\n=== Updating freshness on all target pages ===");
const freshTargets = [
  "capital-one-vs-chase",
  "ikea-vs-wayfair",
  "expedia-vs-kayak",
  "ww1-vs-ww2",
  "amazon-vs-best-buy",
  "farmers-insurance-vs-state-farm",
  "youtube-music-vs-soundcloud",
  "kobe-bryant-vs-lebron-james",
];

for (const slug of freshTargets) {
  await prisma.comparison.update({
    where: { slug },
    data: { updatedAt: new Date() },
  });
  log(`  ✓ refreshed: ${slug}`);
}

log(`\n✅ Wave 20 complete — ${added} new links added`);
await prisma.$disconnect();
