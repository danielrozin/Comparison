/**
 * DAN-2160 Wave 23 — Final meta title fixes for remaining too-long titles.
 *
 * capital-one-vs-chase:    82 chars → 55 chars (Google truncates at ~60; affiliation answer keyword)
 * kobe-bryant-vs-lebron-james: 78 chars → 54 chars (GOAT debate keyword signals)
 * ikea-vs-wayfair:         70 chars → 61 chars (minor trim, keeps "Reddit" keyword signal)
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });

const prisma = new PrismaClient();

const fixes = [
  {
    slug: 'capital-one-vs-chase',
    keyword: 'are chase and capital one affiliated',
    oldLen: 82,
    oldTitle: 'Capital One vs Chase 2026: Are They Affiliated? Credit Cards Compared | A Versus B',
    newTitle: 'Capital One vs Chase: Are They Affiliated? | A Versus B',
  },
  {
    slug: 'kobe-bryant-vs-lebron-james',
    keyword: 'kobe vs lebron (accolades, stats)',
    oldLen: 78,
    oldTitle: 'Kobe Bryant vs LeBron James: Stats, Accolades & Career Comparison | A Versus B',
    newTitle: 'Kobe vs LeBron James: GOAT Debate & Career Stats | A Versus B',
  },
  {
    slug: 'ikea-vs-wayfair',
    keyword: 'wayfair vs ikea reddit',
    oldLen: 70,
    oldTitle: 'Wayfair vs IKEA 2026: Which Is Better? (Reddit Consensus) | A Versus B',
    newTitle: 'Wayfair vs IKEA: Which Is Better? Reddit Verdict | A Versus B',
  },
];

console.log('=== Wave 23: Meta Title Final Fixes ===\n');

for (const fix of fixes) {
  const page = await prisma.comparison.findFirst({ where: { slug: fix.slug }, select: { id: true, metaTitle: true } });
  if (!page) {
    console.log(`SKIP ${fix.slug} — not found in DB`);
    continue;
  }

  const currentTitle = page.metaTitle;
  const newLen = fix.newTitle.length;

  if (currentTitle === fix.newTitle) {
    console.log(`SKIP ${fix.slug} — already has target title`);
    continue;
  }

  await prisma.comparison.update({
    where: { id: page.id },
    data: { metaTitle: fix.newTitle },
  });

  console.log(`FIXED ${fix.slug}`);
  console.log(`  old (${fix.oldLen}ch): ${fix.oldTitle}`);
  console.log(`  new (${newLen}ch): ${fix.newTitle}`);
  console.log(`  keyword: "${fix.keyword}"`);
  console.log();
}

await prisma.$disconnect();
console.log('Wave 23 complete.');
