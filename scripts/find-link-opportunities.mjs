import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

async function main() {
  // Find music/streaming pages that could link to youtube-music-vs-soundcloud
  const musicPages = await prisma.comparison.findMany({
    where: {
      slug: { contains: 'music' },
      status: 'published',
    },
    select: { slug: true, title: true },
    take: 15
  });
  console.log('\n=== Music pages that could link to youtube-music-vs-soundcloud ===');
  musicPages.forEach(p => console.log(`  ${p.slug}`));

  // Also spotify, apple music, streaming
  const streamingPages = await prisma.comparison.findMany({
    where: {
      OR: [
        { slug: { contains: 'spotify' } },
        { slug: { contains: 'streaming' } },
        { slug: { contains: 'soundcloud' } },
        { slug: { contains: 'tidal' } },
        { slug: { contains: 'deezer' } },
        { slug: { contains: 'pandora' } },
      ],
      status: 'published',
    },
    select: { slug: true },
    take: 15
  });
  console.log('\n=== Streaming pages ===');
  streamingPages.forEach(p => console.log(`  ${p.slug}`));

  // Banking pages that could link to capital-one-vs-chase  
  const bankPages = await prisma.comparison.findMany({
    where: {
      OR: [
        { slug: { contains: 'bank' } },
        { slug: { contains: 'credit-card' } },
        { slug: { contains: 'chase' } },
        { slug: { contains: 'capital-one' } },
        { slug: { contains: 'wells-fargo' } },
        { slug: { contains: 'citi' } },
        { slug: { contains: 'amex' } },
        { slug: { contains: 'american-express' } },
      ],
      status: 'published',
    },
    select: { slug: true },
    take: 15
  });
  console.log('\n=== Banking pages that could link to capital-one-vs-chase ===');
  bankPages.forEach(p => console.log(`  ${p.slug}`));

  // Furniture/home pages that could link to ikea-vs-wayfair
  const homePages = await prisma.comparison.findMany({
    where: {
      OR: [
        { slug: { contains: 'ikea' } },
        { slug: { contains: 'wayfair' } },
        { slug: { contains: 'furniture' } },
        { slug: { contains: 'home' } },
        { slug: { contains: 'amazon-vs-best-buy' } },
        { slug: { contains: 'costco' } },
        { slug: { contains: 'target' } },
        { slug: { contains: 'walmart' } },
      ],
      status: 'published',
    },
    select: { slug: true },
    take: 15
  });
  console.log('\n=== Home/furniture pages that could link to ikea-vs-wayfair ===');
  homePages.forEach(p => console.log(`  ${p.slug}`));

  // Check existing inlinks for each target
  const targets = [
    '/compare/youtube-music-vs-soundcloud',
    '/compare/capital-one-vs-chase', 
    '/compare/ikea-vs-wayfair'
  ];
  console.log('\n=== Current inlinks to these targets ===');
  for (const toPath of targets) {
    const links = await prisma.internalLink.findMany({
      where: { toPath },
      select: { fromPath: true, anchorText: true },
      take: 20
    });
    console.log(`\n${toPath} (${links.length} links):`);
    links.forEach(l => console.log(`  from: ${l.fromPath}  anchor: "${l.anchorText}"`));
  }

  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
