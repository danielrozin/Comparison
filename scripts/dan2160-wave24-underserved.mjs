/**
 * DAN-2160 Wave 24 — Fix remaining underserved striking-distance pages.
 *
 * Pages missed by previous waves (too-long titles, low FAQs, low inbound links):
 *   1. virat-kohli-vs-sachin-tendulkar  → fix 80ch title + add 5 FAQs (5→10) + 10 links (15→25)
 *   2. f-16-vs-f-15                     → fix 76ch title + 7 more links (18→25)
 *   3. samsung-galaxy-vs-motorola       → fix 74ch title + 7 more links (20→27)
 *   4. macbook-air-m3-vs-macbook-air-m4 → fix 74ch title (missing brand suffix) + 7 more links (23→30)
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const prisma = new PrismaClient();

// ── 1. Meta title fixes ──────────────────────────────────────────────────────

const titleFixes = [
  {
    slug: 'virat-kohli-vs-sachin-tendulkar',
    oldLen: 80,
    newTitle: 'Kohli vs Tendulkar: Stats, Records & Who Is Better? | A Versus B',
    // Targets: "virat kohli vs sachin tendulkar statistics" (pos 15, vol 30)
  },
  {
    slug: 'f-16-vs-f-15',
    oldLen: 76,
    newTitle: 'F-16 vs F-15: Speed, Range & Combat Comparison | A Versus B',
    // Targets: "j-16 vs f-15" (pos 18, vol 30)
  },
  {
    slug: 'samsung-galaxy-vs-motorola',
    oldLen: 74,
    newTitle: 'Samsung Galaxy vs Motorola 2026: Which Phone Is Better? | A Versus B',
    // Targets: "motorola vs galaxy" (pos 18, vol 30)
  },
  {
    slug: 'macbook-air-m3-vs-macbook-air-m4',
    oldLen: 74,
    newTitle: 'MacBook Air M3 vs M4: Should You Upgrade? | A Versus B',
    // Was missing brand suffix. Targets: "macbook air m3 vs macbook air m4" (pos 13, vol 20)
  },
];

console.log('=== Wave 24: Meta title fixes ===\n');
for (const fix of titleFixes) {
  const page = await prisma.comparison.findFirst({ where: { slug: fix.slug }, select: { id: true, metaTitle: true } });
  if (!page) { console.log(`SKIP ${fix.slug} — not found`); continue; }
  if (page.metaTitle === fix.newTitle) { console.log(`SKIP ${fix.slug} — already fixed`); continue; }

  const newLen = fix.newTitle.length;
  await prisma.comparison.update({ where: { id: page.id }, data: { metaTitle: fix.newTitle } });
  console.log(`FIXED ${fix.slug}: ${fix.oldLen}ch → ${newLen}ch`);
  console.log(`  new: ${fix.newTitle}`);
}

// ── 2. Virat Kohli — add 5 more FAQs (5 → 10) ──────────────────────────────

console.log('\n=== Wave 24: Virat Kohli FAQs ===\n');

const kohliPage = await prisma.comparison.findFirst({
  where: { slug: 'virat-kohli-vs-sachin-tendulkar' },
  select: { id: true, faqs: { select: { question: true } } }
});

if (kohliPage) {
  const existingQs = new Set(kohliPage.faqs.map(f => f.question));
  const newFaqs = [
    {
      question: 'Who has more Test match runs — Kohli or Tendulkar?',
      answer: 'Sachin Tendulkar holds the all-time Test record with 15,921 runs in 200 Tests. Virat Kohli had scored over 9,100 Test runs as of 2026 and is still active. Tendulkar leads in total volume, though Kohli averages higher in many conditions.',
      order: 6,
    },
    {
      question: 'What is Kohli vs Tendulkar batting average in Tests?',
      answer: 'Virat Kohli averages around 48–50 in Tests, while Sachin Tendulkar averaged 53.78. Tendulkar edges Kohli on average, but Kohli has a higher average in overseas conditions in many modern analyses.',
      order: 7,
    },
    {
      question: 'Who is the better T20 International batsman, Kohli or Tendulkar?',
      answer: 'Virat Kohli is clearly the better T20I batsman. He averages over 50 in T20 Internationals with over 4,000 runs and is widely considered the greatest T20I batter. Tendulkar played very few T20Is before retiring.',
      order: 8,
    },
    {
      question: 'Who has the better ODI strike rate — Kohli or Tendulkar?',
      answer: "Tendulkar's career ODI strike rate was around 86. Kohli's ODI strike rate is around 93. Kohli edges Tendulkar in strike rate, reflecting the evolution of the game and his more aggressive approach in the middle overs.",
      order: 9,
    },
    {
      question: 'Who is considered the greatest Indian cricketer of all time?',
      answer: 'Sachin Tendulkar is widely considered the greatest Indian cricketer of all time, backed by his 100 international centuries and status as the all-time leading run-scorer in both Tests and ODIs. Virat Kohli is the leading contender to challenge this legacy once he retires.',
      order: 10,
    },
  ];

  let added = 0;
  for (const faq of newFaqs) {
    if (existingQs.has(faq.question)) { console.log(`SKIP faq: "${faq.question.slice(0,50)}"`); continue; }
    await prisma.fAQ.create({
      data: {
        comparison: { connect: { id: kohliPage.id } },
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.order,
      }
    });
    console.log(`ADDED faq #${faq.order}: ${faq.question.slice(0,60)}`);
    added++;
  }
  console.log(`\nVirat Kohli FAQs: +${added} added (${kohliPage.faqs.length} → ${kohliPage.faqs.length + added})`);
}

// ── 3. Internal links — batch adds ──────────────────────────────────────────

console.log('\n=== Wave 24: Internal links ===\n');

async function addLinksBatch(toSlug, toPath, links) {
  let added = 0;
  for (const { fromSlug, anchorText } of links) {
    const fromPath = `/compare/${fromSlug}`;
    const exists = await prisma.internalLink.findFirst({
      where: { fromPath, toPath }
    });
    if (exists) { console.log(`SKIP ${fromSlug} → already linked`); continue; }

    // Verify source page is published
    const sourcePage = await prisma.comparison.findFirst({
      where: { slug: fromSlug, status: 'published' }
    });
    if (!sourcePage) { console.log(`SKIP ${fromSlug} → not found/published`); continue; }

    await prisma.internalLink.create({
      data: {
        fromPath,
        toPath,
        anchorText,
        linkType: 'contextual',
        position: 'body',
        score: 0.5,
      }
    });
    console.log(`  LINKED ${fromSlug} → ${toSlug}`);
    added++;
  }
  return added;
}

// Virat Kohli — from sports/athlete GOAT pages (contextually: sports legends comparison)
const kohliAdded = await addLinksBatch(
  'virat-kohli-vs-sachin-tendulkar',
  '/compare/virat-kohli-vs-sachin-tendulkar',
  [
    { fromSlug: 'maradona-vs-pele',            anchorText: 'Virat Kohli vs Sachin Tendulkar — cricket\'s equivalent of the Maradona vs Pele debate' },
    { fromSlug: 'djokovic-vs-nadal',            anchorText: 'Kohli vs Tendulkar stats comparison' },
    { fromSlug: 'djokovic-vs-federer',          anchorText: 'Virat Kohli vs Sachin Tendulkar: the greatest Indian cricket debate' },
    { fromSlug: 'tiger-woods-vs-jack-nicklaus', anchorText: 'Kohli vs Tendulkar: who is the greater Indian cricketer?' },
    { fromSlug: 'mcgregor-vs-khabib',           anchorText: 'Virat Kohli vs Sachin Tendulkar cricket records' },
    { fromSlug: 'serena-vs-venus',              anchorText: 'Kohli vs Tendulkar career statistics' },
    { fromSlug: 'ufc-vs-boxing',                anchorText: 'Virat Kohli vs Sachin Tendulkar: India\'s greatest sports debate' },
    { fromSlug: 'nfl-vs-nba',                   anchorText: 'Kohli vs Tendulkar cricket comparison' },
    { fromSlug: 'real-madrid-vs-barcelona',     anchorText: 'Virat Kohli vs Sachin Tendulkar stats and records' },
    { fromSlug: 'liverpool-vs-manchester-united', anchorText: 'Kohli vs Sachin Tendulkar: who is the better batsman?' },
  ]
);
console.log(`Kohli total new links: ${kohliAdded}`);

// F-16 vs F-15 — from military/country pages
const f16Added = await addLinksBatch(
  'f-16-vs-f-15',
  '/compare/f-16-vs-f-15',
  [
    { fromSlug: 'usa-vs-china',               anchorText: 'F-16 vs F-15 fighter jet comparison' },
    { fromSlug: 'north-korea-vs-south-korea', anchorText: 'F-16 vs F-15: US fighter aircraft capabilities' },
    { fromSlug: 'russia-vs-usa',              anchorText: 'F-16 vs F-15 combat aircraft specs' },
    { fromSlug: 'japan-vs-china',             anchorText: 'F-16 vs F-15 fighter comparison' },
    { fromSlug: 'marines-vs-army',            anchorText: 'F-16 vs F-15: US air superiority fighters' },
    { fromSlug: 'india-vs-pakistan',          anchorText: 'F-16 vs F-15 military aircraft comparison' },
    { fromSlug: 'ww1-vs-ww2',                anchorText: 'F-16 vs F-15: modern air combat comparison' },
  ]
);
console.log(`F-16 total new links: ${f16Added}`);

// Samsung Galaxy vs Motorola — from tech pages
const samsungAdded = await addLinksBatch(
  'samsung-galaxy-vs-motorola',
  '/compare/samsung-galaxy-vs-motorola',
  [
    { fromSlug: 'mac-vs-windows',       anchorText: 'Samsung Galaxy vs Motorola Android phone comparison' },
    { fromSlug: 'nvidia-vs-amd',        anchorText: 'Samsung Galaxy vs Motorola smartphone specs' },
    { fromSlug: 'figma-vs-sketch',      anchorText: 'Samsung Galaxy vs Motorola: which Android phone to choose?' },
    { fromSlug: 'slack-vs-microsoft-teams', anchorText: 'Samsung vs Motorola phone comparison' },
    { fromSlug: 'canva-vs-photoshop',   anchorText: 'Samsung Galaxy vs Motorola camera and price comparison' },
    { fromSlug: 'wordpress-vs-wix',     anchorText: 'Samsung Galaxy vs Motorola 2026' },
    { fromSlug: 'mba-vs-masters',       anchorText: 'Samsung Galaxy vs Motorola: best Android phones compared' },
  ]
);
console.log(`Samsung total new links: ${samsungAdded}`);

// MacBook Air M3 vs M4 — from tech pages
const macbookAdded = await addLinksBatch(
  'macbook-air-m3-vs-macbook-air-m4',
  '/compare/macbook-air-m3-vs-macbook-air-m4',
  [
    { fromSlug: 'iphone-17-vs-samsung-s26', anchorText: 'MacBook Air M3 vs M4 comparison' },
    { fromSlug: 'mac-vs-windows',            anchorText: 'MacBook Air M3 vs MacBook Air M4: which to buy?' },
    { fromSlug: 'android-vs-ios',            anchorText: 'MacBook Air M3 vs M4 specs and upgrade guide' },
    { fromSlug: 'nvidia-vs-amd',             anchorText: 'MacBook Air M3 vs M4 performance comparison' },
    { fromSlug: 'figma-vs-sketch',           anchorText: 'MacBook Air M3 vs M4: should you upgrade?' },
    { fromSlug: 'canva-vs-photoshop',        anchorText: 'MacBook Air M3 vs M4 for creative work' },
    { fromSlug: 'slack-vs-microsoft-teams',  anchorText: 'MacBook Air M3 vs M4 for productivity' },
  ]
);
console.log(`MacBook M3 total new links: ${macbookAdded}`);

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('\n=== Wave 24 complete ===');
console.log(`Meta titles fixed: ${titleFixes.length}`);
console.log(`Kohli links added: ${kohliAdded}`);
console.log(`F-16 links added: ${f16Added}`);
console.log(`Samsung links added: ${samsungAdded}`);
console.log(`MacBook M3 links added: ${macbookAdded}`);

await prisma.$disconnect();
