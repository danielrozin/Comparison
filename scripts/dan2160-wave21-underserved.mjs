/**
 * DAN-2160 Wave 21 — Boost underserved striking-distance targets
 *
 * Gap audit showed:
 *   macbook-air-vs-macbook-pro (pos 19-20, vol 90-140): 22 inbound links, 12 mega-sources missing
 *   ps5-pro-vs-xbox-series-x  (pos 20, vol 90): 16 inbound links, 15 mega-sources missing
 *   kobe-bryant-vs-lebron-james (pos 16-19): 4 remaining mega-sources
 *
 * Focusing on the highest-traffic missing sources for fastest SEO impact.
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
// 1. macbook-air-vs-macbook-pro  (pos 19-20, vol 90-140)
//    Keywords: "macbook pro vs air 2026", "macbook air vs pro 2026"
// ══════════════════════════════════════════════════════════════
const MB = "macbook-air-vs-macbook-pro-difference-2026-specs";
log(`\n=== macbook-air-vs-macbook-pro: 12 missing mega-sources ===`);

// usa-vs-china (1.2M) — Apple is caught in the US-China rivalry
await addLink("usa-vs-china", MB,
  "MacBook Air vs MacBook Pro 2026: Apple's lineup navigating the US-China chip rivalry", 0.76);

// lebron-vs-jordan (983k) — GOAT debate: which MacBook is the GOAT?
await addLink("lebron-vs-jordan", MB,
  "MacBook Air vs MacBook Pro: the LeBron vs Jordan of laptops — which is the all-time great?", 0.74);

// ww1-vs-ww2 (678k) — historical perspective on technology shifts
await addLink("ww1-vs-ww2", MB,
  "MacBook Air vs MacBook Pro 2026: which laptop wins the performance war?", 0.72);

// neymar-vs-mbappe (567k) — speed vs power: Air is fast, Pro is powerful (like the players)
await addLink("neymar-vs-mbappe", MB,
  "MacBook Air vs MacBook Pro: speed vs power — the Neymar vs Mbappé of laptops", 0.72);

// bitcoin-vs-ethereum (456k) — tech investment comparison
await addLink("bitcoin-vs-ethereum", MB,
  "MacBook Air vs MacBook Pro 2026: which is the better tech investment for creators and devs?", 0.74);

// netflix-vs-disney-plus (421k) — media consumption + content creation
await addLink("netflix-vs-disney-plus", MB,
  "MacBook Air vs MacBook Pro: which is better for streaming, content creation, and video editing?", 0.73);

// ali-vs-tyson (412k) — classic matchup, weight class difference (Air = lighter, Pro = heavier)
await addLink("ali-vs-tyson", MB,
  "MacBook Air vs MacBook Pro: the Ali vs Tyson of Apple laptops — light and fast vs heavy hitter", 0.72);

// us-economy-vs-china-economy (345k) — Apple silicon vs competing chips
await addLink("us-economy-vs-china-economy", MB,
  "MacBook Air vs MacBook Pro 2026: Apple Silicon advantages in the global chip competition", 0.70);

// stock-market-vs-real-estate (287k) — investment decision framing
await addLink("stock-market-vs-real-estate", MB,
  "MacBook Air vs MacBook Pro: which is the smarter long-term investment for your workflow?", 0.70);

// wordpress-vs-wix (68k) — web devs and designers choose MacBook
await addLink("wordpress-vs-wix", MB,
  "MacBook Air vs MacBook Pro 2026: the best laptop for WordPress and Wix developers", 0.67);

// canva-vs-photoshop (53k) — design tool users on Mac
await addLink("canva-vs-photoshop", MB,
  "MacBook Air vs MacBook Pro: which laptop handles Canva and Photoshop best in 2026?", 0.68);

// slack-vs-microsoft-teams (53k) — remote work laptop
await addLink("slack-vs-microsoft-teams", MB,
  "MacBook Air vs MacBook Pro: the best laptop for remote workers on Slack or Teams", 0.67);

// ══════════════════════════════════════════════════════════════
// 2. ps5-pro-vs-xbox-series-x  (pos 20, vol 90)
//    Keyword: "ps5 pro vs xbox series x: performance"
// ══════════════════════════════════════════════════════════════
const PS5 = "ps5-pro-vs-xbox-series-x-performance-comparison-2026";
log(`\n=== ps5-pro-vs-xbox-series-x: 15 missing mega-sources ===`);

// iphone-17-vs-samsung-s26 (2.1M) — tech ecosystem choice mirrors console choice
await addLink("iphone-17-vs-samsung-s26", PS5,
  "PS5 Pro vs Xbox Series X: the console rivalry that rivals iPhone vs Samsung in passion", 0.82);

// usa-vs-china (1.2M) — Sony (Japan) vs Microsoft (US) + gaming market
await addLink("usa-vs-china", PS5,
  "PS5 Pro vs Xbox Series X: the console war playing out in the US vs Asia gaming markets", 0.76);

// lebron-vs-jordan (983k) — GOAT debate, generational rivalry
await addLink("lebron-vs-jordan", PS5,
  "PS5 Pro vs Xbox Series X: the LeBron vs Jordan of gaming consoles — which defines the era?", 0.80);

// ww1-vs-ww2 (678k) — console wars have defined gaming generations
await addLink("ww1-vs-ww2", PS5,
  "PS5 Pro vs Xbox Series X: the console war that defines a generation, just like historic conflicts", 0.70);

// mac-vs-windows (623k) — closed ecosystem (PS5) vs open ecosystem (Xbox/PC)
await addLink("mac-vs-windows", PS5,
  "PS5 Pro vs Xbox Series X: closed ecosystem vs open platform — the Mac vs Windows of gaming", 0.82);

// neymar-vs-mbappe (567k) — elite performance rivalry
await addLink("neymar-vs-mbappe", PS5,
  "PS5 Pro vs Xbox Series X: elite gaming performance — which console is the Neymar vs Mbappé of 2026?", 0.75);

// bitcoin-vs-ethereum (456k) — investment and ecosystem comparison
await addLink("bitcoin-vs-ethereum", PS5,
  "PS5 Pro vs Xbox Series X: which gaming ecosystem is the better long-term investment?", 0.73);

// netflix-vs-disney-plus (421k) — entertainment ecosystem, media streaming
await addLink("netflix-vs-disney-plus", PS5,
  "PS5 Pro vs Xbox Series X: both serve as 4K media hubs — which beats Netflix and Disney+?", 0.74);

// nvidia-vs-amd (412k) — GPU rivalry directly maps to PS5 (AMD custom GPU) vs Xbox (AMD GPU)
await addLink("nvidia-vs-amd", PS5,
  "PS5 Pro vs Xbox Series X: both use AMD-derived GPUs — see how they compare on performance", 0.85);

// ali-vs-tyson (412k) — legendary rivalry
await addLink("ali-vs-tyson", PS5,
  "PS5 Pro vs Xbox Series X: gaming's Ali vs Tyson — two heavyweights, one winner", 0.78);

// us-economy-vs-china-economy (345k) — gaming market global dynamics
await addLink("us-economy-vs-china-economy", PS5,
  "PS5 Pro vs Xbox Series X: how the US-China gaming market shapes console dominance", 0.70);

// stock-market-vs-real-estate (287k) — investment in gaming ecosystem
await addLink("stock-market-vs-real-estate", PS5,
  "PS5 Pro vs Xbox Series X: investing in a console ecosystem — which has better long-term ROI?", 0.70);

// wordpress-vs-wix (68k) — gaming content creators
await addLink("wordpress-vs-wix", PS5,
  "PS5 Pro vs Xbox Series X: the best console for gaming content creators and streamers", 0.64);

// canva-vs-photoshop (53k) — content creation overlap
await addLink("canva-vs-photoshop", PS5,
  "PS5 Pro vs Xbox Series X: which has better built-in capture and sharing tools for creators?", 0.63);

// slack-vs-microsoft-teams (53k) — Xbox Game Pass ties to Microsoft 365 ecosystem
await addLink("slack-vs-microsoft-teams", PS5,
  "PS5 Pro vs Xbox Series X: Xbox integrates with Microsoft Teams and Game Pass — worth it?", 0.68);

// ══════════════════════════════════════════════════════════════
// 3. kobe-bryant-vs-lebron-james  (pos 16-19, 4 keyword variants)
// ══════════════════════════════════════════════════════════════
log(`\n=== kobe-bryant-vs-lebron-james: 4 remaining sources ===`);

// usa-vs-china (1.2M) — LeBron's China connection is famous
await addLink("usa-vs-china", "kobe-bryant-vs-lebron-james",
  "Kobe vs LeBron: the US vs China angle — LeBron's business ties to China made headlines", 0.80);

// wordpress-vs-wix (68k)
await addLink("wordpress-vs-wix", "kobe-bryant-vs-lebron-james",
  "Kobe Bryant vs LeBron James: basketball's GOAT debate, like choosing your platform", 0.62);

// canva-vs-photoshop (53k)
await addLink("canva-vs-photoshop", "kobe-bryant-vs-lebron-james",
  "Kobe vs LeBron: design your GOAT argument — which basketball legend wins?", 0.60);

// slack-vs-microsoft-teams (53k)
await addLink("slack-vs-microsoft-teams", "kobe-bryant-vs-lebron-james",
  "Kobe Bryant vs LeBron James: team players who changed the communication of their sport", 0.60);

// ══════════════════════════════════════════════════════════════
// Freshness update for new targets
// ══════════════════════════════════════════════════════════════
log("\n=== Updating freshness ===");
const freshTargets = [
  MB, PS5, "kobe-bryant-vs-lebron-james",
];
for (const slug of freshTargets) {
  await prisma.comparison.update({
    where: { slug },
    data: { updatedAt: new Date() },
  });
  log(`  ✓ refreshed: ${slug}`);
}

log(`\n✅ Wave 21 complete — ${added} new links added`);
await prisma.$disconnect();
