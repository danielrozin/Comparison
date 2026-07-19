import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local'), override: true });

const prisma = new PrismaClient();

// DAN-2475: Publish Batch 60 enriched compare pages (ranked 581-590 by GSC)
// Enrichment applied by DAN-2473 (SEO Specialist)
const slugsToPublish = [
  'wix-vs-wordpress',
  'acorns-vs-robinhood',
  'amd-ryzen-9-9900x-vs-intel-core-ultra-9',
  'capture-one-vs-lightroom',
  'framer-vs-wordpress',
  'galaxy-buds-vs-sony',
  'houston-rockets-vs-oklahoma-city-thunder-match-player-stats',
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
