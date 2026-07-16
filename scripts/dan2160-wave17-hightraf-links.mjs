/**
 * DAN-2160 Wave 17 — High-traffic page links to striking-distance targets
 *
 * Top pages by view_count that are missing contextual links to our 5 targets.
 *
 * Only add where topical context is defensible (Google penalizes off-topic link spam).
 *
 * Mapping:
 *   netflix-vs-disney-plus (421k) → youtube-music-vs-soundcloud (streaming music/video)
 *   mac-vs-windows (623k)         → youtube-music-vs-soundcloud (default music apps differ)
 *   bitcoin-vs-ethereum (456k)    → capital-one-vs-chase (crypto users need banking)
 *   stock-market-vs-real-estate   → capital-one-vs-chase (personal finance)
 *   us-economy-vs-china-economy   → capital-one-vs-chase, amazon-vs-best-buy (economic)
 *   lebron-vs-jordan (983k)       → expedia-vs-kayak (athlete travel), capital-one-vs-chase
 *   ali-vs-tyson (412k)           → expedia-vs-kayak, amazon-vs-best-buy
 *   wordpress-vs-wix (68k)        → youtube-music-vs-soundcloud (content creators)
 *   slack-vs-microsoft-teams (53k)→ youtube-music-vs-soundcloud (tech users)
 *   canva-vs-photoshop (53k)      → youtube-music-vs-soundcloud (creative creators)
 *   marvel-vs-dc (48k)            → youtube-music-vs-soundcloud (entertainment fans)
 *   star-wars-vs-star-trek (29k)  → youtube-music-vs-soundcloud (streaming fans)
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
    data: { fromPath, toPath, anchorText, linkType: 'related', position: 'inline', score }
  });
  log(`  ✓ ${fromSlug} → ${toSlug}`);
  added++;
}

// ─────────────────────────────────────────────────────────────
// youtube-music-vs-soundcloud (pos 11 — closest to page 1!)
// ─────────────────────────────────────────────────────────────
log('\n=== youtube-music-vs-soundcloud: add from streaming/tech pages ===');
// netflix-vs-disney-plus: streaming context — "while you're comparing streaming video, see how music streaming stacks up"
await addLink('netflix-vs-disney-plus', 'youtube-music-vs-soundcloud',
  'YouTube Music vs SoundCloud: how the music streaming options compare', 1.2);
// mac-vs-windows: music apps differ — Apple Music vs Spotify on Mac vs Windows; YouTube Music fits
await addLink('mac-vs-windows', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: best music streaming for Mac and Windows users', 1.1);
// wordpress-vs-wix: content creators use music for videos — fair use, background music
await addLink('wordpress-vs-wix', 'youtube-music-vs-soundcloud',
  'YouTube Music vs SoundCloud for content creators', 1.0);
// canva-vs-photoshop: creative professionals need background music
await addLink('canva-vs-photoshop', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: music for designers and creatives', 1.0);
// slack-vs-microsoft-teams: office workers who use music to focus
await addLink('slack-vs-microsoft-teams', 'youtube-music-vs-soundcloud',
  'YouTube Music vs SoundCloud: best for focus playlists at work', 0.9);
// marvel-vs-dc: entertainment fans who also stream music
await addLink('marvel-vs-dc', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: streaming options for entertainment fans', 0.9);
// star-wars-vs-star-trek: same reasoning
await addLink('star-wars-vs-star-trek', 'youtube-music-vs-soundcloud',
  'YouTube Music vs SoundCloud: best streaming for film soundtrack fans', 0.9);

// ─────────────────────────────────────────────────────────────
// capital-one-vs-chase (pos 13 — "are chase and capital one affiliated")
// ─────────────────────────────────────────────────────────────
log('\n=== capital-one-vs-chase: add from finance pages ===');
// bitcoin-vs-ethereum: crypto users still need banking for on/off-ramp
await addLink('bitcoin-vs-ethereum', 'capital-one-vs-chase',
  'Capital One vs Chase: best traditional bank for crypto investors', 1.1);
// stock-market-vs-real-estate: personal finance context
await addLink('stock-market-vs-real-estate', 'capital-one-vs-chase',
  'Are Chase and Capital One affiliated? Banking options for investors', 1.2);
// us-economy-vs-china-economy: macroeconomic article → banking context
await addLink('us-economy-vs-china-economy', 'capital-one-vs-chase',
  'Capital One vs Chase: largest US banks compared', 1.0);
// lebron-vs-jordan: high earners need premium banking; athlete wealth management
await addLink('lebron-vs-jordan', 'capital-one-vs-chase',
  'Capital One vs Chase: premium banking for high earners', 0.9);

// ─────────────────────────────────────────────────────────────
// amazon-vs-best-buy (pos 18 — "best buy vs amazon")
// ─────────────────────────────────────────────────────────────
log('\n=== amazon-vs-best-buy: add from relevant pages ===');
// us-economy-vs-china-economy: retail/trade war context
await addLink('us-economy-vs-china-economy', 'amazon-vs-best-buy',
  'Best Buy vs Amazon: how US retail giants compare', 1.0);
// lebron-vs-jordan: consumer culture, sneaker/merch buying
await addLink('lebron-vs-jordan', 'amazon-vs-best-buy',
  'Amazon vs Best Buy: best place to buy sports merchandise and electronics', 0.9);
// ali-vs-tyson: same consumer context
await addLink('ali-vs-tyson', 'amazon-vs-best-buy',
  'Best Buy vs Amazon: which retailer wins for sporting goods and electronics', 0.9);
// neymar-vs-mbappe: sports fans buy merchandise
await addLink('neymar-vs-mbappe', 'amazon-vs-best-buy',
  'Amazon vs Best Buy for sports fans: electronics and gear', 0.9);

// ─────────────────────────────────────────────────────────────
// expedia-vs-kayak (pos 16 — "expedia or kayak")
// ─────────────────────────────────────────────────────────────
log('\n=== expedia-vs-kayak: add from travel/lifestyle pages ===');
// usa-vs-china: cross-border travel planning
await addLink('usa-vs-china', 'expedia-vs-kayak',
  'Expedia or Kayak: best travel sites for US-China flights', 1.0);
// lebron-vs-jordan: athletes travel extensively
await addLink('lebron-vs-jordan', 'expedia-vs-kayak',
  'Expedia vs Kayak: which travel site is better for booking away games?', 0.9);
// ali-vs-tyson: boxing matches require travel
await addLink('ali-vs-tyson', 'expedia-vs-kayak',
  'Expedia or Kayak: best for booking fight-night travel packages', 0.9);
// neymar-vs-mbappe: international travel for Champions League
await addLink('neymar-vs-mbappe', 'expedia-vs-kayak',
  'Expedia vs Kayak for international football travel: which to use', 0.9);

// ─────────────────────────────────────────────────────────────
// ikea-vs-wayfair (pos 13 — "wayfair vs ikea reddit")
// ─────────────────────────────────────────────────────────────
log('\n=== ikea-vs-wayfair: add from relevant lifestyle pages ===');
// usa-vs-china: IKEA is Swedish but manufactured largely in China; Wayfair sources globally
await addLink('usa-vs-china', 'ikea-vs-wayfair',
  'IKEA vs Wayfair: how global manufacturing shapes furniture prices', 0.9);
// mac-vs-windows: home office setup, desk ergonomics
await addLink('mac-vs-windows', 'ikea-vs-wayfair',
  'Wayfair vs IKEA for home office furniture: Reddit\'s top picks', 1.0);
// wordpress-vs-wix: home-based businesses that need office furniture
await addLink('wordpress-vs-wix', 'ikea-vs-wayfair',
  'IKEA vs Wayfair: best furniture for home office and studio setups', 1.0);

log(`\n=== Wave 17 done — ${added} new links added ===`);
await prisma.$disconnect();
