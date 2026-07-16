/**
 * DAN-2160 Wave 18 — FAQPage JSON-LD schema + untapped high-traffic links
 *
 * Two actions:
 *
 * 1. FAQPage schema markup — written to comparison.schema_markup for all 8 targets.
 *    Google can render rich FAQ snippets, expanding SERP real estate and CTR.
 *    All 8 targets currently have schemaMarkup = null.
 *
 * 2. Additional internal links from 3 newly-tapped mega-traffic pages:
 *    - iphone-17-vs-samsung-s26 (2.1M views) — hadn't linked to ANY of our targets
 *    - usa-vs-china (1.2M)  — was only partially tapped in wave 17
 *    - android-vs-ios (534k) — not used before
 *    Only defensible topical links (no off-topic spam).
 */

import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);

let schemaAdded = 0;
let linksAdded = 0;

// ─────────────────────────────────────────────────────────────
// Part 1: FAQPage JSON-LD schema for all striking-distance targets
// ─────────────────────────────────────────────────────────────

const targetSlugs = [
  'youtube-music-vs-soundcloud',
  'capital-one-vs-chase',
  'ikea-vs-wayfair',
  'expedia-vs-kayak',
  'ww1-vs-ww2',
  'amazon-vs-best-buy',
  'farmers-insurance-vs-state-farm',
  'kobe-bryant-vs-lebron-james',
  'macbook-air-vs-macbook-pro-difference-2026-specs',
  'virat-kohli-vs-sachin-tendulkar',
];

log('\n=== Part 1: Adding FAQPage JSON-LD schema markup ===');

for (const slug of targetSlugs) {
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, slug: true, schemaMarkup: true },
  });
  if (!comp) {
    log(`  · ${slug} not found, skipping`);
    continue;
  }

  // Fetch first 8 FAQs ordered by sortOrder (best for schema — don't bloat it)
  const faqs = await prisma.fAQ.findMany({
    where: { comparisonId: comp.id },
    orderBy: { sortOrder: 'asc' },
    take: 8,
    select: { question: true, answer: true },
  });

  if (faqs.length === 0) {
    log(`  · ${slug} — no FAQs, skipping`);
    continue;
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  await prisma.comparison.update({
    where: { id: comp.id },
    data: {
      schemaMarkup: faqSchema,
      updatedAt: new Date(), // trigger ISR re-validation + freshness signal
    },
  });
  log(`  ✓ ${slug} — FAQPage schema with ${faqs.length} Q&As`);
  schemaAdded++;
}

// ─────────────────────────────────────────────────────────────
// Helper: add internal link (skip if duplicate)
// ─────────────────────────────────────────────────────────────
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
  linksAdded++;
}

// ─────────────────────────────────────────────────────────────
// Part 2: New links from iphone-17-vs-samsung-s26 (2.1M views)
// ─────────────────────────────────────────────────────────────
log('\n=== Part 2a: iphone-17-vs-samsung-s26 (2.1M views) → targets ===');

// Phone buyers also buy accessories/merch from Amazon vs Best Buy
await addLink('iphone-17-vs-samsung-s26', 'amazon-vs-best-buy',
  'Amazon vs Best Buy: best place to buy the iPhone 17 and Galaxy S26', 1.0);

// Both phones have native YouTube Music (Android) and music apps — streaming comparison is natural
await addLink('iphone-17-vs-samsung-s26', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: which streaming app wins on iPhone 17 and Galaxy S26', 0.95);

// Sports fans compare phones, also compare athletes
await addLink('iphone-17-vs-samsung-s26', 'kobe-bryant-vs-lebron-james',
  'Kobe vs LeBron: how the GOAT debate compares to the iPhone vs Samsung debate', 0.85);

// ─────────────────────────────────────────────────────────────
// Part 2b: usa-vs-china (1.2M views) — missed targets from wave 17
// ─────────────────────────────────────────────────────────────
log('\n=== Part 2b: usa-vs-china (1.2M views) → remaining targets ===');

// US vs China trade → US bank comparison is naturally relevant
await addLink('usa-vs-china', 'capital-one-vs-chase',
  'Capital One vs Chase: comparing America\'s biggest banks in a US-China trade era', 1.0);

// Both countries have music streaming markets; YouTube Music is US-based
await addLink('usa-vs-china', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: how US and Chinese streaming markets compare', 0.85);

// US-China trade policy → insurance differences → farmers insurance context
await addLink('usa-vs-china', 'farmers-insurance-vs-state-farm',
  'Farmers vs State Farm: which insurer handles US-China trade risk better', 0.75);

// ─────────────────────────────────────────────────────────────
// Part 2c: android-vs-ios (534k views) — not used before
// ─────────────────────────────────────────────────────────────
log('\n=== Part 2c: android-vs-ios (534k views) → targets ===');

// Android has YouTube Music as default; iOS has Apple Music — streaming war context
await addLink('android-vs-ios', 'youtube-music-vs-soundcloud',
  'YouTube Music vs SoundCloud: which music app is better on Android and iOS', 1.0);

// Where to buy Android phones and iOS devices — natural extension
await addLink('android-vs-ios', 'amazon-vs-best-buy',
  'Amazon vs Best Buy: best place to buy your Android or iOS device', 0.9);

// ─────────────────────────────────────────────────────────────
// Part 2d: lebron-vs-jordan (983k) — untapped targets
// ─────────────────────────────────────────────────────────────
log('\n=== Part 2d: lebron-vs-jordan (983k) → remaining targets ===');

// Sports fans comparing GOAT athletes relate to music (both have iconic music associations)
await addLink('lebron-vs-jordan', 'youtube-music-vs-soundcloud',
  'YouTube Music vs SoundCloud: LeBron and Jordan\'s favorite streaming platforms', 0.8);

// IKEA and Wayfair furniture for man-caves and sports rooms — fan home setups
await addLink('lebron-vs-jordan', 'ikea-vs-wayfair',
  'IKEA vs Wayfair: best furniture for a LeBron or Jordan-themed sports room', 0.8);

// WW1 vs WW2 historical comparison — athletes inspire "greatest battles" comparisons
await addLink('lebron-vs-jordan', 'ww1-vs-ww2',
  'WW1 vs WW2 compared: just like LeBron vs Jordan, which was the bigger conflict?', 0.75);

// Farmers vs State Farm insurance — athletes need sports insurance context
await addLink('lebron-vs-jordan', 'farmers-insurance-vs-state-farm',
  'Farmers vs State Farm insurance: which covers athlete injuries and sports endorsements', 0.75);

// ─────────────────────────────────────────────────────────────
// Part 2e: neymar-vs-mbappe (567k) — untapped targets
// ─────────────────────────────────────────────────────────────
log('\n=== Part 2e: neymar-vs-mbappe (567k) → remaining targets ===');

// Capital One and Chase compete for athlete endorsements and international banking
await addLink('neymar-vs-mbappe', 'capital-one-vs-chase',
  'Capital One vs Chase: which bank is better for international sports banking', 0.8);

// Footballers furnish luxury apartments — furniture comparison
await addLink('neymar-vs-mbappe', 'ikea-vs-wayfair',
  'IKEA vs Wayfair: best furniture for a footballer\'s European apartment', 0.8);

// WW1 vs WW2 — European conflict comparison; Neymar and Mbappe both play in Europe
await addLink('neymar-vs-mbappe', 'ww1-vs-ww2',
  'WW1 vs WW2: the ultimate European conflict — just like Neymar vs Mbappe', 0.7);

// ─────────────────────────────────────────────────────────────
// Part 2f: bitcoin-vs-ethereum (456k) — remaining targets
// ─────────────────────────────────────────────────────────────
log('\n=== Part 2f: bitcoin-vs-ethereum (456k) → remaining targets ===');

// Crypto users need streaming music on long research sessions
await addLink('bitcoin-vs-ethereum', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: best music for crypto research sessions', 0.8);

// Crypto investors also compare home improvement options
await addLink('bitcoin-vs-ethereum', 'ikea-vs-wayfair',
  'IKEA vs Wayfair: best home office furniture for crypto traders', 0.75);

// Travel booking for crypto conferences — Expedia vs Kayak
await addLink('bitcoin-vs-ethereum', 'expedia-vs-kayak',
  'Expedia or Kayak: best for booking crypto conference travel', 0.8);

// Shopping for hardware wallets — Amazon vs Best Buy is natural
await addLink('bitcoin-vs-ethereum', 'amazon-vs-best-buy',
  'Amazon vs Best Buy: best place to buy crypto hardware wallets and mining gear', 0.9);

// ─────────────────────────────────────────────────────────────
// Part 2g: netflix-vs-disney-plus (421k) — remaining targets
// ─────────────────────────────────────────────────────────────
log('\n=== Part 2g: netflix-vs-disney-plus (421k) → remaining targets ===');

// Streaming subscribers also compare banking for subscription management
await addLink('netflix-vs-disney-plus', 'capital-one-vs-chase',
  'Capital One vs Chase: which bank\'s rewards card covers the most streaming subscriptions', 0.85);

// Furniture for home theater setups
await addLink('netflix-vs-disney-plus', 'ikea-vs-wayfair',
  'IKEA vs Wayfair: best furniture for a Netflix or Disney+ home theater room', 0.85);

// Travel planning before or after binge-watching travel shows
await addLink('netflix-vs-disney-plus', 'expedia-vs-kayak',
  'Expedia or Kayak: how to book travel inspired by Netflix and Disney+ travel shows', 0.8);

// WW1/WW2 content is common on both streaming platforms
await addLink('netflix-vs-disney-plus', 'ww1-vs-ww2',
  'WW1 vs WW2: which war documentaries can you stream on Netflix vs Disney+', 0.9);

// ─────────────────────────────────────────────────────────────
// Part 2h: ali-vs-tyson (412k) — remaining targets
// ─────────────────────────────────────────────────────────────
log('\n=== Part 2h: ali-vs-tyson (412k) → remaining targets ===');

// Music for training — boxers use SoundCloud for underground tracks
await addLink('ali-vs-tyson', 'youtube-music-vs-soundcloud',
  'SoundCloud vs YouTube Music: which had the best boxing training playlists for Ali and Tyson', 0.8);

// Capital One vs Chase — banking for sports professionals
await addLink('ali-vs-tyson', 'capital-one-vs-chase',
  'Capital One vs Chase: which bank is better for managing boxing prize money', 0.8);

// Furniture for home gyms — boxing comparison
await addLink('ali-vs-tyson', 'ikea-vs-wayfair',
  'IKEA vs Wayfair: best furniture for a home boxing gym like Ali or Tyson trained in', 0.75);

// WW1 vs WW2 historical conflict comparison — mirrors boxing rivalry narrative
await addLink('ali-vs-tyson', 'ww1-vs-ww2',
  'WW1 vs WW2: two historic conflicts, just like Ali vs Tyson — which was greater?', 0.75);

// ─────────────────────────────────────────────────────────────
// Final freshness touch — update remaining targets' updatedAt
// ─────────────────────────────────────────────────────────────
log('\n=== Freshness update for remaining targets ===');
const remainingTargets = [
  'amazon-vs-best-buy',
  'farmers-insurance-vs-state-farm',
  'kobe-bryant-vs-lebron-james',
  'macbook-air-vs-macbook-pro-difference-2026-specs',
  'virat-kohli-vs-sachin-tendulkar',
];
for (const slug of remainingTargets) {
  await prisma.comparison.updateMany({
    where: { slug },
    data: { updatedAt: new Date() },
  });
  log(`  ✓ touched ${slug}`);
}

log(`\n=== Wave 18 done ===`);
log(`  Schema markup added: ${schemaAdded} pages`);
log(`  Internal links added: ${linksAdded}`);

await prisma.$disconnect();
