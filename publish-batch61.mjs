import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local'), override: true });

const prisma = new PrismaClient();

// DAN-2483: Publish Batch 61 enriched compare pages (ranked 591-600 by GSC)
// Enrichment applied by DAN-2481 (SEO Specialist)
const slugsToPublish = [
  'mercedes-vs-lexus',
  'new-york-vs-los-angeles',
  'pipedrive-vs-hubspot',
  'robinhood-vs-webull',
  'samsung-vs-lg',
  'smart-tv-vs-streaming-stick-which-one-should-you-buy-in-2026',
  'brave-vs-duckduckgo',
  'delta-vs-united-airlines',
  'iphone-16-pro-vs-galaxy-s25-ultra',
  'south-korea-vs-japan',
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
