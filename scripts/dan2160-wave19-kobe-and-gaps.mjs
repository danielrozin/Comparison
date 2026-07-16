/**
 * DAN-2160 Wave 19 — Kobe link gap + remaining untapped sources
 *
 * kobe-bryant-vs-lebron-james has only 17 inbound links (vs 36 for youtube-music,
 * 34 for capital-one-vs-chase). It covers 4 keyword variants at pos 16-19.
 * Bringing it to 30+ links gives it the same internal authority as our top targets.
 *
 * Also filling in the remaining gaps discovered in the Wave 18 audit:
 * - ww1-vs-ww2 (678k page views!) → youtube-music, kobe, amazon, farmers
 * - neymar-vs-mbappe (567k) → youtube-music, farmers
 * - nvidia-vs-amd (412k) → kobe, youtube-music
 * - us-economy-vs-china-economy (345k) → youtube-music, kobe, expedia
 * - stock-market-vs-real-estate (287k) → youtube-music, kobe, expedia, amazon
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
    data: { fromPath, toPath, anchorText, linkType: 'related', position: 'inline', score },
  });
  log(`  ✓ ${fromSlug} → ${toSlug}`);
  added++;
}

// ─────────────────────────────────────────────────────────────
// kobe-bryant-vs-lebron-james (pos 16-19, only 17 inbound links)
// Need to get to ~30 to match our other top targets.
// High-traffic source pages that don't link to kobe yet:
// ─────────────────────────────────────────────────────────────
log('\n=== kobe-bryant-vs-lebron-james: filling the link gap ===');

// ww1-vs-ww2 (678k views) — historical GOAT debate parallels athlete GOAT debate
await addLink('ww1-vs-ww2', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: comparing basketball\'s greatest, like the world wars', 0.75);

// neymar-vs-mbappe (567k) — sports rivalry context, same "who\'s the GOAT" debate
await addLink('neymar-vs-mbappe', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: basketball\'s equivalent of Neymar vs Mbappé — who\'s the GOAT?', 0.85);

// nvidia-vs-amd (412k) — tech rivalry mirrors sports rivalry; gamers and sports fans overlap
await addLink('nvidia-vs-amd', 'kobe-bryant-vs-lebron-james',
  'Kobe Bryant vs LeBron James compared: like the GPU wars, who wins the GOAT title?', 0.75);

// ali-vs-tyson — already used for other targets but not for kobe
await addLink('ali-vs-tyson', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: basketball\'s Ali vs Tyson — two eras, one debate', 0.9);

// android-vs-ios — platform rivalry context (Lakers vs Celtics as iPhone vs Android)
await addLink('android-vs-ios', 'kobe-bryant-vs-lebron-james',
  'Kobe Bryant vs LeBron James: basketball\'s iPhone vs Android debate — which side are you on?', 0.8);

// stock-market-vs-real-estate (287k) — wealth comparison; both athletes are billionaires/wealthy
await addLink('stock-market-vs-real-estate', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: who built the better investment portfolio and legacy beyond basketball', 0.75);

// us-economy-vs-china-economy (345k) — cultural influence, LeBron has China connection
await addLink('us-economy-vs-china-economy', 'kobe-bryant-vs-lebron-james',
  'Kobe Bryant vs LeBron James: who had bigger global impact, including in China', 0.8);

// mba-vs-masters (38k) — athletes and business schools; both have business ventures
await addLink('mba-vs-masters', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: which basketball legend built the better business empire after the game', 0.75);

// harvard-vs-stanford (33k) — academic excellence debate mirrors GOAT debate
await addLink('harvard-vs-stanford', 'kobe-bryant-vs-lebron-james',
  'Kobe Bryant vs LeBron James: like Harvard vs Stanford, which legend tops the rankings?', 0.7);

// iphone-17-vs-samsung-s26 (2.1M) — already linked to kobe ✓ (done in wave 18)
// mac-vs-windows (623k) — added in wave 17 context... check
await addLink('mac-vs-windows', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: the Mac vs Windows of basketball — which side wins the debate?', 0.75);

// bitcoin-vs-ethereum (456k) — both are "gold standard" comparisons in their domains
await addLink('bitcoin-vs-ethereum', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: basketball\'s Bitcoin vs Ethereum debate — which is the better investment in legacy?', 0.8);

// netflix-vs-disney-plus (421k) — entertainment platform rivalry mirrors sports rivalry
await addLink('netflix-vs-disney-plus', 'kobe-bryant-vs-lebron-james',
  'Kobe Bryant vs LeBron James: basketball\'s Netflix vs Disney+ — which streaming legend wins?', 0.8);

// figma-vs-sketch (24k) — design community also follows sports
await addLink('figma-vs-sketch', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: designing the perfect GOAT — which basketball legend wins the creative debate', 0.7);

// ─────────────────────────────────────────────────────────────
// youtube-music-vs-soundcloud (pos 11): untapped 567k-678k sources
// ─────────────────────────────────────────────────────────────
log('\n=== youtube-music-vs-soundcloud: 5 more high-traffic sources ===');

// ww1-vs-ww2 (678k views) — war documentaries and history fans stream music while studying
await addLink('ww1-vs-ww2', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: which streaming platform has the best WW1 and WW2 documentaries and historical playlists', 0.7);

// neymar-vs-mbappe (567k) — both use streaming music; soccer fans stream on the go
await addLink('neymar-vs-mbappe', 'youtube-music-vs-soundcloud',
  'YouTube Music vs SoundCloud: which music streaming app do top football stars like Neymar and Mbappé prefer', 0.8);

// nvidia-vs-amd (412k) — PC gaming + music is a natural combination; streamers use both
await addLink('nvidia-vs-amd', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music for PC gaming: which streaming app pairs best with your NVIDIA or AMD GPU', 0.85);

// us-economy-vs-china-economy (345k) — US has YouTube Music; China has alternative platforms
await addLink('us-economy-vs-china-economy', 'youtube-music-vs-soundcloud',
  'YouTube Music vs SoundCloud: how US and China\'s music streaming markets compare', 0.75);

// stock-market-vs-real-estate (287k) — investors listen to music while researching
await addLink('stock-market-vs-real-estate', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: best background music app for stock market and real estate research', 0.75);

// ─────────────────────────────────────────────────────────────
// amazon-vs-best-buy (pos 18): additional sources
// ─────────────────────────────────────────────────────────────
log('\n=== amazon-vs-best-buy: additional sources ===');

// ww1-vs-ww2 (678k) — history buffs buy books, memorabilia from Amazon and Best Buy
await addLink('ww1-vs-ww2', 'amazon-vs-best-buy',
  'Amazon vs Best Buy: best online retailer for WW1 and WW2 books, games, and memorabilia', 0.8);

// stock-market-vs-real-estate (287k) — investors buy equipment from Amazon vs Best Buy
await addLink('stock-market-vs-real-estate', 'amazon-vs-best-buy',
  'Amazon vs Best Buy: which has better deals on home office equipment for trading', 0.85);

// mba-vs-masters (38k) — MBA students buy tech and supplies from both
await addLink('mba-vs-masters', 'amazon-vs-best-buy',
  'Amazon vs Best Buy: where MBA students get the best deals on textbooks and tech', 0.8);

// ─────────────────────────────────────────────────────────────
// farmers-insurance-vs-state-farm (pos 19): more sources
// ─────────────────────────────────────────────────────────────
log('\n=== farmers-insurance-vs-state-farm: more sources ===');

// ww1-vs-ww2 (678k) — insurance for veterans, historical context
await addLink('ww1-vs-ww2', 'farmers-insurance-vs-state-farm',
  'Farmers vs State Farm insurance: which insurer has better coverage for veterans and military families', 0.7);

// us-economy-vs-china-economy (345k) — insurance in US economic context
await addLink('us-economy-vs-china-economy', 'farmers-insurance-vs-state-farm',
  'Farmers vs State Farm: US insurance giants compared in the context of America\'s economic landscape', 0.75);

// stock-market-vs-real-estate (287k) — real estate and farming insurance
await addLink('stock-market-vs-real-estate', 'farmers-insurance-vs-state-farm',
  'Farmers vs State Farm: which insurer is better for protecting your real estate or farm investment', 0.9);

// ─────────────────────────────────────────────────────────────
// expedia-vs-kayak (pos 16): more sources
// ─────────────────────────────────────────────────────────────
log('\n=== expedia-vs-kayak: more sources ===');

// us-economy-vs-china-economy (345k) — travel for business between US and China
await addLink('us-economy-vs-china-economy', 'expedia-vs-kayak',
  'Expedia or Kayak: best travel booking site for US-China business travel', 0.8);

// stock-market-vs-real-estate (287k) — investors travel for property tours
await addLink('stock-market-vs-real-estate', 'expedia-vs-kayak',
  'Expedia or Kayak: best travel site for booking real estate investment property tours', 0.8);

// mba-vs-masters (38k) — business school students travel for interviews and recruitment
await addLink('mba-vs-masters', 'expedia-vs-kayak',
  'Expedia or Kayak: which travel site is best for MBA and Masters interview trip booking', 0.8);

// harvard-vs-stanford (33k) — college visits and academic travel
await addLink('harvard-vs-stanford', 'expedia-vs-kayak',
  'Expedia or Kayak: best travel site to book flights for Harvard or Stanford college visits', 0.8);

log(`\n=== Wave 19 done — ${added} new links added ===`);
await prisma.$disconnect();
