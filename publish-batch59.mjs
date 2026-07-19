import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local'), override: true });

const prisma = new PrismaClient();

// DAN-2471: Publish Batch 59 enriched compare pages (ranked 571-580 by GSC)
// Enrichment applied by DAN-2469 (SEO Specialist)
const slugsToPublish = [
  'toyota-vs-tesla',
  'public-school-vs-private-school',
  'aws-amplify-vs-netlify',
  '49ers-vs-los-angeles-rams-match-player-stats',
  'rivian-vs-lucid',
  'cruise-vs-all-inclusive-resort',
  'airpods-max-vs-sony-wh-1000xm5',
  'united-vs-delta-2026',
  'microsoft-clarity-vs-google-analytics',
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
