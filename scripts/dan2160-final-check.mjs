import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

const targets = [
  { slug: 'youtube-music-vs-soundcloud', pos: 11 },
  { slug: 'capital-one-vs-chase', pos: 13 },
  { slug: 'ikea-vs-wayfair', pos: 13 },
  { slug: 'expedia-vs-kayak', pos: 16 },
  { slug: 'ww1-vs-ww2', pos: 20 },
  { slug: 'amazon-vs-best-buy', pos: 18 },
  { slug: 'farmers-insurance-vs-state-farm', pos: 19 },
  { slug: 'kobe-bryant-vs-lebron-james', pos: 16 },
];

console.log('=== Final link counts after Waves 16-18 ===\n');

for (const { slug, pos } of targets) {
  const inLinks = await prisma.internalLink.count({ where: { toPath: `/compare/${slug}` } });
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { schemaMarkup: true, updatedAt: true }
  });
  console.log(`[pos ${pos}] ${slug}: inboundLinks=${inLinks} | schemaMarkup=${!!comp?.schemaMarkup} | updatedAt=${comp?.updatedAt.toISOString().substring(0,16)}`);
}

// Also find any remaining high-traffic pages not yet linking to youtube-music
console.log('\n=== Remaining untapped for youtube-music-vs-soundcloud ===');
const allHighTraffic = await prisma.comparison.findMany({
  where: { status: 'published', viewCount: { gt: 5000 } },
  orderBy: { viewCount: 'desc' },
  select: { slug: true, viewCount: true },
  take: 50,
});

for (const p of allHighTraffic) {
  if (p.slug === 'youtube-music-vs-soundcloud') continue;
  const link = await prisma.internalLink.findFirst({
    where: { fromPath: `/compare/${p.slug}`, toPath: '/compare/youtube-music-vs-soundcloud' },
  });
  if (!link) {
    console.log(`  ${p.slug} (${p.viewCount.toLocaleString()} views) — NOT linking to soundcloud`);
  }
}

await prisma.$disconnect();
