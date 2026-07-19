import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Pages enriched by DAN-2462 that are currently archived and need publishing
const slugsToPublish = [
  'delta-airlines-vs-united',
  'redfin-vs-zillow',
  'us-vs-china-power-comparison-2026',
  'github-copilot-vs-cursor',
  'norwegian-cruise-line-vs-royal-caribbean',
  'final-cut-pro-vs-premiere-pro'
];

const now = new Date();

for (const slug of slugsToPublish) {
  const result = await prisma.comparison.updateMany({
    where: { slug, status: 'archived' },
    data: { status: 'published', publishedAt: now }
  });
  console.log(`${slug}: updated ${result.count} row(s) → published`);
}

await prisma.$disconnect();
