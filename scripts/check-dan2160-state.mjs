import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

const slugs = [
  'ww1-vs-ww2',
  'macbook-air-vs-macbook-pro-difference-2026-specs',
  'amazon-vs-best-buy',
  'farmers-insurance-vs-state-farm',
  'ps5-pro-vs-xbox-series-x-performance-comparison-2026',
  'expedia-vs-kayak',
  'capital-one-vs-chase',
  'ikea-vs-wayfair',
  'kobe-bryant-vs-lebron-james',
  'youtube-music-vs-soundcloud',
  'virat-kohli-vs-sachin-tendulkar',
  'f-16-vs-f-15',
  'samsung-galaxy-vs-motorola',
  'paramount-plus-vs-peacock'
];

async function main() {
  const comps = await prisma.comparison.findMany({
    where: { slug: { in: slugs } },
    select: { 
      slug: true, 
      title: true, 
      metaTitle: true,
      keyDifferences: true,
      contentScore: true,
      updatedAt: true
    },
  });

  // Get inlinks via InternalLink model
  const inlinkCounts = await prisma.internalLink.groupBy({
    by: ['toPath'],
    _count: { id: true }
  });
  const inlinkMap = {};
  inlinkCounts.forEach(r => { inlinkMap[r.toPath] = r._count.id; });

  for (const slug of slugs) {
    const comp = comps.find(c => c.slug === slug);
    if (!comp) { console.log(`NOT FOUND: ${slug}`); continue; }
    const kdCount = Array.isArray(comp.keyDifferences) ? comp.keyDifferences.length : 0;
    const toPath = `/compare/${slug}`;
    const inlinkCount = inlinkMap[toPath] || 0;
    const updatedDays = Math.round((Date.now() - new Date(comp.updatedAt)) / (1000*60*60*24));
    const slug40 = slug.substring(0, 38);
    console.log(`${slug40}: KDs=${kdCount} inlinks=${inlinkCount} score=${comp.contentScore||'?'} upd=${updatedDays}d`);
    console.log(`  metaTitle: ${(comp.metaTitle || comp.title || '').substring(0, 80)}`);
  }

  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
