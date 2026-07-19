import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local'), override: true });

const prisma = new PrismaClient();

// DAN-2468: Publish Batch 58 enriched compare pages (ranked 561-570 by GSC)
const slugsToPublish = [
  'doctor-vs-lawyer',
  'kindle-vs-kobo',
  'honda-cr-v-vs-toyota-rav4',
  'lasik-vs-prk',
  'google-analytics-vs-plausible',
  'israel-vs-iran-military-capabilities-2026',
  'mattermost-vs-slack',
  'yale-vs-penn',
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

  const result = await prisma.comparison.update({
    where: { slug },
    data: { status: 'published', publishedAt: now },
  });
  console.log(`✓ ${slug}: ${page.status} → published`);
}

await prisma.$disconnect();
console.log('\nDone.');
