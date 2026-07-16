/**
 * DAN-2160 Wave 14 — Final cleanup + content boost
 * 
 * 1. Fix Kobe KD near-duplicates ("Career Accolades & Awards" vs "Career Accolades at a Glance")
 * 2. Fix F-16 vs F-15 meta title format (add | A Versus B)
 * 3. Improve samsung-galaxy-vs-motorola meta title
 * 4. Boost "cars like mercedes" target - update meta title on published blog
 * 5. Find more inbound links for capital-one-vs-chase and macbook-air-m3 from banking/tech pages
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
// 1. Fix Kobe KD near-duplicates
// ─────────────────────────────────────────────────────────────
log('\n=== 1. kobe-bryant-vs-lebron-james: merge near-dup KDs ===');
const kobeP = await prisma.comparison.findUnique({
  where: { slug: 'kobe-bryant-vs-lebron-james' },
  select: { id: true, keyDifferences: true }
});
if (kobeP && Array.isArray(kobeP.keyDifferences)) {
  // Keep "Career Accolades & Awards", remove "Career Accolades at a Glance" (redundant)
  const deduped = kobeP.keyDifferences.filter(k => k.label !== 'Career Accolades at a Glance');
  if (deduped.length < kobeP.keyDifferences.length) {
    await prisma.comparison.update({
      where: { id: kobeP.id },
      data: { keyDifferences: deduped, updatedAt: new Date() }
    });
    log(`  ✓ kobe: ${kobeP.keyDifferences.length} → ${deduped.length} KDs (removed "Career Accolades at a Glance")`);
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Fix F-16 vs F-15 meta title (add brand suffix)
// ─────────────────────────────────────────────────────────────
log('\n=== 2. f-16-vs-f-15: fix meta title ===');
await prisma.comparison.update({
  where: { slug: 'f-16-vs-f-15' },
  data: {
    metaTitle: 'F-16 vs F-15 Fighter Jet: Speed, Range & Combat Comparison 2026 | A Versus B',
    updatedAt: new Date()
  }
});
log('  ✓ F-16 vs F-15: meta title updated');

// ─────────────────────────────────────────────────────────────
// 3. Improve samsung-galaxy-vs-motorola meta title
// ─────────────────────────────────────────────────────────────
log('\n=== 3. samsung-galaxy-vs-motorola: improve meta title ===');
await prisma.comparison.update({
  where: { slug: 'samsung-galaxy-vs-motorola' },
  data: {
    metaTitle: 'Samsung Galaxy vs Motorola 2026: Camera, Price & Which to Buy | A Versus B',
    metaDescription: 'Samsung Galaxy vs Motorola 2026: compare camera quality, price, software support, battery life, and which Android phone brand is better for most buyers.',
    updatedAt: new Date()
  }
});
log('  ✓ samsung-galaxy-vs-motorola: meta improved');

// ─────────────────────────────────────────────────────────────
// 4. Boost the "cars like mercedes" blog - update the published article's meta
// ─────────────────────────────────────────────────────────────
log('\n=== 4. "cars like mercedes" blog: update published article ===');
const mercedesBlog = await prisma.blogArticle.findFirst({
  where: { slug: 'best-alternatives-to-mercedes-in-2026-luxury-performance-options', status: 'published' },
  select: { id: true, metaTitle: true, metaDescription: true }
});
if (mercedesBlog) {
  await prisma.blogArticle.update({
    where: { id: mercedesBlog.id },
    data: {
      metaTitle: 'Cars Like Mercedes 2026: Best Luxury Alternatives to Mercedes-Benz',
      metaDescription: 'Looking for cars like Mercedes-Benz? Compare BMW, Audi, Lexus, and Genesis — luxury cars that match or beat Mercedes on quality, price, and technology in 2026.',
      updatedAt: new Date()
    }
  });
  log('  ✓ Mercedes blog: meta updated to target "cars like mercedes"');
} else {
  log('  · Mercedes blog not found or not published');
}

// ─────────────────────────────────────────────────────────────
// 5. Find and add more links to capital-one-vs-chase and macbook-air-m3
// ─────────────────────────────────────────────────────────────
log('\n=== 5. capital-one-vs-chase: find banking source pages ===');
const CHASE_TARGET = '/compare/capital-one-vs-chase';
const bankingPages = await prisma.comparison.findMany({
  where: {
    status: 'published',
    OR: [
      { slug: { contains: 'bank' } },
      { slug: { contains: 'credit' } },
      { slug: { contains: 'visa' } },
      { slug: { contains: 'mastercard' } },
      { slug: { contains: 'amex' } },
      { slug: { contains: 'discover' } },
      { slug: { contains: 'citi' } },
      { slug: { contains: 'wells-fargo' } },
      { slug: { contains: 'td-bank' } },
      { slug: { contains: 'paypal' } },
    ]
  },
  select: { slug: true }
});

let chaseAdded = 0;
for (const p of bankingPages) {
  if (p.slug === 'capital-one-vs-chase') continue;
  const fromPath = '/compare/' + p.slug;
  const already = await prisma.internalLink.findFirst({ where: { fromPath, toPath: CHASE_TARGET } });
  if (already) continue;
  await prisma.internalLink.create({
    data: { fromPath, toPath: CHASE_TARGET, anchorText: 'Capital One vs Chase: full bank comparison', linkType: 'related', position: 'inline', score: 1.1 }
  });
  log(`  ✓ ${p.slug} → capital-one-vs-chase`);
  chaseAdded++;
  if (chaseAdded >= 5) break; // cap at 5 new links
}
if (chaseAdded === 0) log('  · No new banking pages found');

log('\n=== 6. macbook-air-m3-vs-macbook-air-m4: find tech source pages ===');
const M3_TARGET = '/compare/macbook-air-m3-vs-macbook-air-m4';
const techPages = await prisma.comparison.findMany({
  where: {
    status: 'published',
    OR: [
      { slug: { contains: 'macbook' } },
      { slug: { contains: 'apple' } },
      { slug: { contains: 'mac-mini' } },
      { slug: { contains: 'ipad' } },
      { slug: { contains: 'laptop' } },
      { slug: { contains: 'chromebook' } },
    ]
  },
  select: { slug: true }
});

let m3Added = 0;
for (const p of techPages) {
  if (p.slug === 'macbook-air-m3-vs-macbook-air-m4') continue;
  const fromPath = '/compare/' + p.slug;
  const already = await prisma.internalLink.findFirst({ where: { fromPath, toPath: M3_TARGET } });
  if (already) continue;
  await prisma.internalLink.create({
    data: { fromPath, toPath: M3_TARGET, anchorText: 'MacBook Air M3 vs MacBook Air M4: buyer\'s guide 2026', linkType: 'related', position: 'inline', score: 1.2 }
  });
  log(`  ✓ ${p.slug} → macbook-air-m3-vs-macbook-air-m4`);
  m3Added++;
  if (m3Added >= 6) break; // cap at 6 new links
}
if (m3Added === 0) log('  · No new tech pages found');

log('\n=== Wave 14 done ===');
await prisma.$disconnect();
