import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local'), override: true });

const prisma = new PrismaClient();

// DAN-2497: Publish Batch 62 enriched compare pages (ranked 601-610 by GSC)
// Enrichment applied by DAN-2495 (SEO Specialist)
const slugsToPublish = [
  'capitalism-vs-socialism',
  'costco-vs-walmart',
  'knicks-vs-detroit-pistons-match-player-stats',
  'kobe-vs-lebron',
  'lebron-james-vs-kevin-durant',
  'lego-vs-mega-bloks',
  'pixel-9-vs-iphone-16',
  'safari-vs-edge',
  'samsung-galaxy-s25-plus-vs-samsung-galaxy-s25-ultra',
  'android-vs-lineageos',
];

const now = new Date();

for (const slug of slugsToPublish) {
  const page = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, status: true, slug: true },
  });

  if (!page) {
    console.log(`SKIP ${slug} — not found in DB`);
    continue;
  }

  if (page.status === 'published') {
    console.log(`✅ Already published: ${slug}`);
    continue;
  }

  await prisma.comparison.update({
    where: { slug },
    data: { status: 'published', publishedAt: now },
  });
  console.log(`✓ ${slug}: ${page.status} → published`);
}

await prisma.$disconnect();
console.log('\nDone.');
