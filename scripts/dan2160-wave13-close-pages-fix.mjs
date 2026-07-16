/**
 * DAN-2160 Wave 13 — Fix pages closest to page 1
 * 
 * 1. Fix duplicate KDs on youtube-music-vs-soundcloud (pos 11 - just 1 spot from page 1!)
 * 2. Fix duplicate KDs on virat-kohli-vs-sachin-tendulkar (pos 15)
 * 3. Add 5 more FAQs to virat-kohli (only has 5 - well below the 10 target)
 * 4. Add 2 unique new KDs to youtube-music-vs-soundcloud after dedup
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
// UTIL: dedup KDs by label
// ─────────────────────────────────────────────────────────────
async function deduplicateAndExtendKDs(slug, newKDs = []) {
  const page = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, keyDifferences: true }
  });
  if (!page || !Array.isArray(page.keyDifferences)) {
    log(`  · ${slug}: no KDs to process`);
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
  // Add new KDs (only those not already present)
  for (const nk of newKDs) {
    if (!seen.has(nk.label)) {
      deduped.push(nk);
      seen.add(nk.label);
      log(`  + added KD: "${nk.label}"`);
    }
  }
  if (deduped.length !== page.keyDifferences.length || newKDs.length > 0) {
    await prisma.comparison.update({
      where: { id: page.id },
      data: { keyDifferences: deduped, updatedAt: new Date() }
    });
    log(`  ✓ ${slug}: ${page.keyDifferences.length} → ${deduped.length} KDs`);
  }
}

// ─────────────────────────────────────────────────────────────
// 1. Fix youtube-music-vs-soundcloud (pos 11, CLOSEST to page 1)
// ─────────────────────────────────────────────────────────────
log('\n=== 1. youtube-music-vs-soundcloud: dedup + expand KDs ===');
await deduplicateAndExtendKDs('youtube-music-vs-soundcloud', [
  {
    label: 'Podcast Integration',
    winner: 'b',
    entityAValue: 'No native podcast support',
    entityBValue: 'Seamless YouTube podcast support — over 1M podcasts available',
    description: 'YouTube Music integrates directly with YouTube\'s massive podcast catalog; SoundCloud has no dedicated podcast section'
  },
  {
    label: 'Platform Availability',
    winner: 'b',
    entityAValue: 'iOS, Android, Web; limited smart TV support',
    entityBValue: 'iOS, Android, Web, Smart TVs (Samsung, LG, Roku, Chromecast)',
    description: 'YouTube Music benefits from Google ecosystem integration and broader device support'
  }
]);

// ─────────────────────────────────────────────────────────────
// 2. Fix virat-kohli-vs-sachin-tendulkar (pos 15)
// ─────────────────────────────────────────────────────────────
log('\n=== 2. virat-kohli-vs-sachin-tendulkar: dedup KDs ===');
await deduplicateAndExtendKDs('virat-kohli-vs-sachin-tendulkar');

// ─────────────────────────────────────────────────────────────
// 3. Add FAQs to virat-kohli (only 5 currently, target 10)
// ─────────────────────────────────────────────────────────────
log('\n=== 3. virat-kohli-vs-sachin-tendulkar: add FAQs ===');
const kohliPage = await prisma.comparison.findUnique({
  where: { slug: 'virat-kohli-vs-sachin-tendulkar' },
  select: { id: true, faqs: { select: { question: true } } }
});
if (kohliPage) {
  const existingQs = new Set(kohliPage.faqs.map(f => f.question));
  const newFAQs = [
    {
      question: 'Who has better batting statistics — Kohli or Tendulkar?',
      answer: 'Sachin Tendulkar holds the all-time international records: 100 international centuries, 34,357 international runs, and 49 Test centuries. Virat Kohli has 80 international centuries and 27,000+ runs but his career is ongoing. In Test average, Kohli\'s 48+ average trails Tendulkar\'s 53.78. However, Kohli has a superior ODI average of 58.07 vs Tendulkar\'s 44.83.'
    },
    {
      question: 'Did Kohli or Tendulkar perform better in Test cricket?',
      answer: 'Sachin Tendulkar edges Kohli in Test cricket. Tendulkar scored 15,921 Test runs at an average of 53.78 with 51 centuries across 200 Tests. Kohli has scored 9,200+ Test runs at ~48 average with 30 centuries (as of 2026). Tendulkar\'s consistency over 24 years of Test cricket remains the benchmark.'
    },
    {
      question: 'Which player dominated the ICC rankings more — Kohli or Tendulkar?',
      answer: 'Virat Kohli has spent more consecutive days at #1 in ICC ODI rankings than Sachin Tendulkar. Kohli held the #1 ODI spot for over 1,000 days (2017–2020). Tendulkar reached #1 in both Tests and ODIs but for shorter cumulative periods. In terms of peak dominance periods, Kohli\'s 2016–2019 run is often considered more dominant than any single Tendulkar era.'
    },
    {
      question: 'Who is better in pressure situations — Kohli or Tendulkar?',
      answer: 'Virat Kohli is widely regarded as the superior chase-finisher. He averages over 63 when chasing in ODIs compared to Tendulkar\'s 43. Kohli\'s ability to anchor and accelerate in run chases — including iconic chases at Hobart (2012), Colombo (2012), and multiple IPL finals — is unmatched. Tendulkar excelled as an opener setting totals, while Kohli excels finishing them.'
    },
    {
      question: 'Virat Kohli vs Sachin Tendulkar: who has the better ODI record?',
      answer: 'Virat Kohli has the statistically superior ODI record in terms of average: 58.07 vs Tendulkar\'s 44.83. Kohli has 50 ODI centuries vs Tendulkar\'s 49. Tendulkar leads in total ODI runs (18,426 vs Kohli\'s ~14,000 as of 2026) due to his longer career. Kohli\'s conversion rate and average make him the more efficient ODI batter by modern analytics standards.'
    }
  ];
  
  let faqsAdded = 0;
  for (const faq of newFAQs) {
    if (!existingQs.has(faq.question)) {
      await prisma.fAQ.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          comparisonId: kohliPage.id,
          sortOrder: 10 + faqsAdded
        }
      });
      log(`  + FAQ: ${faq.question.slice(0, 60)}`);
      faqsAdded++;
    }
  }
  log(`  ✓ Added ${faqsAdded} new FAQs to virat-kohli-vs-sachin-tendulkar`);
}

// ─────────────────────────────────────────────────────────────
// 4. Touch freshness on the 3 closest-to-page-1 pages
// ─────────────────────────────────────────────────────────────
log('\n=== 4. Freshness touch + lastRefreshedAt on closest pages ===');
const closeSlugs = ['youtube-music-vs-soundcloud', 'capital-one-vs-chase', 'ikea-vs-wayfair', 'macbook-air-m3-vs-macbook-air-m4', 'virat-kohli-vs-sachin-tendulkar'];
for (const slug of closeSlugs) {
  const p = await prisma.comparison.findUnique({ where: { slug }, select: { id: true } });
  if (p) {
    await prisma.comparison.update({
      where: { id: p.id },
      data: { lastRefreshedAt: new Date(), updatedAt: new Date() }
    });
    log(`  ✓ touched: ${slug}`);
  }
}

log('\n=== Wave 13 done ===');
await prisma.$disconnect();
