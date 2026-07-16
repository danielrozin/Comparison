/**
 * DAN-2160 Wave 16 — FAQ reordering + content freshness
 *
 * For each target page, the exact-match query variant FAQ is buried.
 * Google's Featured Snippet / FAQ rich result prefers the FIRST FAQ that
 * matches the search intent. This script:
 *
 * 1. Reorders FAQs so the exact-match query appears first (sort_order -1)
 * 2. Adds a missing direct-intent FAQ for youtube-music-vs-soundcloud
 * 3. Adds a reddit-intent FAQ variant for ikea-vs-wayfair
 * 4. Updates updated_at on all 8 target pages → triggers ISR re-validation
 *    and signals freshness to Googlebot
 *
 * Targets (all striking-distance, pos 11-20):
 *   - youtube-music-vs-soundcloud          pos 11
 *   - capital-one-vs-chase                 pos 13 ("are chase and capital one affiliated")
 *   - ikea-vs-wayfair                      pos 13 ("wayfair vs ikea reddit")
 *   - expedia-vs-kayak                     pos 16 ("expedia or kayak")
 *   - ww1-vs-ww2                           pos 20 ("why is ww2 more famous than ww1")
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
// Helper: move a specific FAQ to position -1 (first)
// ─────────────────────────────────────────────────────────────
async function promoteToFirst(comparisonSlug, faqQuestionFragment) {
  const comparison = await prisma.comparison.findUnique({
    where: { slug: comparisonSlug },
    select: { id: true }
  });
  if (!comparison) { log(`  ✗ ${comparisonSlug}: not found`); return; }

  const faq = await prisma.fAQ.findFirst({
    where: {
      comparisonId: comparison.id,
      question: { contains: faqQuestionFragment, mode: 'insensitive' }
    }
  });
  if (!faq) { log(`  ✗ ${comparisonSlug}: FAQ containing "${faqQuestionFragment}" not found`); return; }

  if (faq.sortOrder <= -1) {
    log(`  · ${comparisonSlug}: FAQ already at top (sort_order ${faq.sortOrder})`);
    return;
  }

  await prisma.fAQ.update({
    where: { id: faq.id },
    data: { sortOrder: -1 }
  });
  log(`  ✓ ${comparisonSlug}: "${faq.question}" moved to sort_order -1 (was ${faq.sortOrder})`);
}

// ─────────────────────────────────────────────────────────────
// Helper: add FAQ if not already present
// ─────────────────────────────────────────────────────────────
async function addFaqIfMissing(comparisonSlug, question, answer, sortOrder = -2) {
  const comparison = await prisma.comparison.findUnique({
    where: { slug: comparisonSlug },
    select: { id: true }
  });
  if (!comparison) { log(`  ✗ ${comparisonSlug}: not found`); return; }

  const existing = await prisma.fAQ.findFirst({
    where: {
      comparisonId: comparison.id,
      question: { contains: question.substring(0, 30), mode: 'insensitive' }
    }
  });
  if (existing) {
    log(`  · ${comparisonSlug}: FAQ already exists: "${existing.question}"`);
    return;
  }

  await prisma.fAQ.create({
    data: {
      comparisonId: comparison.id,
      question,
      answer,
      sortOrder,
    }
  });
  log(`  ✓ ${comparisonSlug}: added FAQ "${question}" at sort_order ${sortOrder}`);
}

// ─────────────────────────────────────────────────────────────
// 1. capital-one-vs-chase
//    Keyword: "are chase and capital one affiliated" (pos 13, vol 40)
//    FAQ "Are Chase and Capital One affiliated or the same company?" is at sort_order 6
// ─────────────────────────────────────────────────────────────
log('\n=== 1. capital-one-vs-chase: promote "affiliated" FAQ to first ===');
await promoteToFirst('capital-one-vs-chase', 'affiliated');

// ─────────────────────────────────────────────────────────────
// 2. ikea-vs-wayfair
//    Keyword: "wayfair vs ikea reddit" (pos 13, vol 40)
//    FAQ "Wayfair vs IKEA: what does Reddit say?" is at sort_order 6
// ─────────────────────────────────────────────────────────────
log('\n=== 2. ikea-vs-wayfair: promote "Reddit" FAQ to first ===');
await promoteToFirst('ikea-vs-wayfair', 'Reddit');

// ─────────────────────────────────────────────────────────────
// 3. ww1-vs-ww2
//    Keywords: "ww1 vs ww2" (pos 20, vol 2900), "why is ww2 more famous than ww1" (pos 20, vol 30)
//    FAQ "Why is WW2 more famous than WW1?" is at sort_order 6
// ─────────────────────────────────────────────────────────────
log('\n=== 3. ww1-vs-ww2: promote "more famous" FAQ to first ===');
await promoteToFirst('ww1-vs-ww2', 'more famous');

// Also make "Which was worse" the second question (direct intent for "ww1 vs ww2")
log('  Promoting "Which was worse" FAQ to second position...');
const ww1Comp = await prisma.comparison.findUnique({
  where: { slug: 'ww1-vs-ww2' },
  select: { id: true }
});
if (ww1Comp) {
  const worseFaq = await prisma.fAQ.findFirst({
    where: { comparisonId: ww1Comp.id, question: { contains: 'worse', mode: 'insensitive' } }
  });
  if (worseFaq && worseFaq.sortOrder > 0) {
    await prisma.fAQ.update({ where: { id: worseFaq.id }, data: { sortOrder: 0 } });
    log(`  ✓ ww1-vs-ww2: "${worseFaq.question}" moved to sort_order 0 (second)`);
  }
}

// ─────────────────────────────────────────────────────────────
// 4. youtube-music-vs-soundcloud
//    Keyword: "soundcloud vs youtube music" (pos 11, vol 30)
//    The existing FAQs don't have a clear "which is better overall?" as the FIRST question
//    Add direct-comparison FAQ at sort_order -2 (before everything else)
// ─────────────────────────────────────────────────────────────
log('\n=== 4. youtube-music-vs-soundcloud: add top-of-page verdict FAQ ===');
await addFaqIfMissing(
  'youtube-music-vs-soundcloud',
  'Is SoundCloud better than YouTube Music overall?',
  `It depends on your use case. YouTube Music wins for listening convenience — it has 100+ million tracks, deep YouTube integration, better smart TV support, and uses Google's powerful recommendation engine. SoundCloud wins for discovering independent artists and niche genres, and it lets artists upload directly without a distributor. For most general listeners, YouTube Music is the better choice (especially at $13.99/mo with full YouTube Premium benefits); for music producers, DJs, and indie fans, SoundCloud's $9.99 plan or even its free tier is unmatched for discovering unsigned talent.`,
  -2
);

// ─────────────────────────────────────────────────────────────
// 5. expedia-vs-kayak
//    Keyword: "expedia or kayak" (pos 16, vol 50)
//    The first FAQ "Is Kayak a booking site or a search engine?" doesn't directly answer
//    Add direct answer FAQ
// ─────────────────────────────────────────────────────────────
log('\n=== 5. expedia-vs-kayak: add direct "which should I use?" FAQ ===');
await addFaqIfMissing(
  'expedia-vs-kayak',
  'Should I use Expedia or Kayak?',
  `Use Kayak when you want to compare prices across multiple sites before committing — it searches hundreds of providers and shows you the best deal without charging booking fees. Use Expedia when you want to book everything (flight + hotel + car) in one place and earn Expedia rewards. For best results: start with Kayak to find the cheapest option, then check if Expedia or the airline's own site can match it with bonus points. Both are free to search; Expedia charges if you book through them.`,
  -2
);

// ─────────────────────────────────────────────────────────────
// 6. amazon-vs-best-buy (pos 18, "best buy vs amazon")
//    The current first FAQ "Is Amazon cheaper than Best Buy?" is decent
//    Add a broader verdict FAQ
// ─────────────────────────────────────────────────────────────
log('\n=== 6. amazon-vs-best-buy: add overall verdict FAQ ===');
await addFaqIfMissing(
  'amazon-vs-best-buy',
  'Is Best Buy or Amazon better for buying electronics?',
  `Amazon is better for price and convenience — its Prime membership delivers most electronics in 1-2 days, and the marketplace often undercuts Best Buy on non-sale prices. Best Buy is better when you want to see the item in person, get same-day pickup, need professional installation (Geek Squad), or want to trade in an old device. Best Buy also price-matches Amazon, so you can often get the best of both by presenting an Amazon listing at checkout. For high-end electronics like OLED TVs, Best Buy's Geek Squad Protection plans and setup services add meaningful value.`,
  -2
);

// ─────────────────────────────────────────────────────────────
// 7. Touch updated_at on all 8 target pages (ISR freshness signal)
//    This tells Google that this content was recently verified/updated
// ─────────────────────────────────────────────────────────────
log('\n=== 7. Touch updated_at on all target pages ===');
const targetSlugs = [
  'youtube-music-vs-soundcloud',
  'capital-one-vs-chase',
  'ikea-vs-wayfair',
  'expedia-vs-kayak',
  'amazon-vs-best-buy',
  'ww1-vs-ww2',
  'farmers-insurance-vs-state-farm',
  'macbook-air-vs-macbook-pro-difference-2026-specs',
  'macbook-air-m3-vs-macbook-air-m4',
  'kobe-bryant-vs-lebron-james',
  'ps5-pro-vs-xbox-series-x-performance-comparison-2026',
  'samsung-galaxy-vs-motorola',
  'paramount-plus-vs-peacock',
  'virat-kohli-vs-sachin-tendulkar',
];

const touchResult = await prisma.comparison.updateMany({
  where: { slug: { in: targetSlugs } },
  data: { updatedAt: new Date() }
});
log(`  ✓ Touched updatedAt on ${touchResult.count} pages`);

// ─────────────────────────────────────────────────────────────
// 8. farmers-insurance-vs-state-farm - check and promote any exact-match FAQ
//    Keyword: "farmers vs state farm home insurance" (pos 19, CPC $12.32 ← highest value!)
// ─────────────────────────────────────────────────────────────
log('\n=== 8. farmers-insurance-vs-state-farm: check FAQs ===');
const farmersComp = await prisma.comparison.findUnique({
  where: { slug: 'farmers-insurance-vs-state-farm' },
  select: { id: true }
});
if (farmersComp) {
  const farmersFaqs = await prisma.fAQ.findMany({
    where: { comparisonId: farmersComp.id },
    orderBy: { sortOrder: 'asc' }
  });
  farmersFaqs.forEach(f => log(`  [${f.sortOrder}] ${f.question}`));

  // Check if there's a "home insurance" specific FAQ
  const homeFaq = farmersFaqs.find(f =>
    f.question.toLowerCase().includes('home') ||
    f.question.toLowerCase().includes('homeowner')
  );
  if (homeFaq && homeFaq.sortOrder > 0) {
    await prisma.fAQ.update({ where: { id: homeFaq.id }, data: { sortOrder: -1 } });
    log(`  ✓ Promoted: "${homeFaq.question}" to sort_order -1`);
  } else if (!homeFaq) {
    // Add a home insurance FAQ
    await addFaqIfMissing(
      'farmers-insurance-vs-state-farm',
      'Which is better for home insurance: Farmers or State Farm?',
      `State Farm is generally better for home insurance for most homeowners. It has the largest market share in the US, earns above-average customer satisfaction scores (J.D. Power), and offers competitive rates with discounts for bundling auto + home. Farmers Insurance offers slightly more customizable coverage options and an "Enhanced" package with guaranteed replacement cost coverage — better if you want premium protection. For price-conscious buyers in most states, State Farm typically quotes 5-15% lower premiums. Farmers has an edge if you want stronger add-ons like eco rebuild coverage or home systems protection.`,
      -2
    );
  }
}

log('\n=== Wave 16 complete ===');
await prisma.$disconnect();
