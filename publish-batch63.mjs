import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local'), override: true });

const prisma = new PrismaClient();

// DAN-2503: Publish Batch 63 enriched compare pages (ranked 611-620 by GSC)
// Enrichment applied by DAN-2501 (SEO Specialist + CML)
const slugsToPublish = [
  'apple-music-vs-tidal',
  'australia-vs-new-zealand',
  'booking-com-vs-airbnb-comparison-2026',
  'canva-vs-figma',
  'disney-plus-vs-peacock',
  'electric-car-vs-hybrid-car',
  'ios-vs-microsoft',
  'iphone-16-vs-google-pixel-9',
  'online-degree-vs-traditional-degree',
  'steam-vs-xbox-game-pass',
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
