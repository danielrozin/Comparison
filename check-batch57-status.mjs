import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const slugs = [
  'github-copilot-vs-cursor',
  'redfin-vs-zillow',
  'delta-airlines-vs-united',
  'final-cut-pro-vs-premiere-pro',
  'norwegian-cruise-line-vs-royal-caribbean',
  'us-vs-china-power-comparison-2026',
  'signal-vs-telegram',
  'suv-vs-sedan',
  'davinci-resolve-vs-premiere-pro'
];

const pages = await prisma.comparison.findMany({
  where: { slug: { in: slugs } },
  select: { slug: true, status: true, publishedAt: true }
});

for (const p of pages) {
  console.log(`${p.slug}: status=${p.status}, publishedAt=${p.publishedAt}`);
}
await prisma.$disconnect();
