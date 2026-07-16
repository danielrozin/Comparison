import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

// Target pages we want links TO
const targetSlugs = [
  'youtube-music-vs-soundcloud',
  'capital-one-vs-chase',
  'ikea-vs-wayfair',
  'expedia-vs-kayak',
  'ww1-vs-ww2',
  'amazon-vs-best-buy',
  'farmers-insurance-vs-state-farm',
  'kobe-bryant-vs-lebron-james',
];

// Top 30 high-traffic pages that could be sources
const highTrafficCandidates = await prisma.comparison.findMany({
  where: { status: 'published', viewCount: { gt: 10000 } },
  orderBy: { viewCount: 'desc' },
  select: { slug: true, viewCount: true },
  take: 40,
});

console.log(`\nChecking ${highTrafficCandidates.length} high-traffic pages for unused link opportunities\n`);

for (const source of highTrafficCandidates) {
  if (targetSlugs.includes(source.slug)) continue; // skip targets themselves
  
  const fromPath = `/compare/${source.slug}`;
  const existingLinks = await prisma.internalLink.findMany({
    where: { fromPath },
    select: { toPath: true },
  });
  const linkedTargets = existingLinks.map(l => l.toPath.replace('/compare/', ''));
  const missingTargets = targetSlugs.filter(t => !linkedTargets.includes(t));
  
  if (missingTargets.length > 0) {
    console.log(`${source.slug} (${source.viewCount.toLocaleString()} views) → missing: ${missingTargets.slice(0, 4).join(', ')}`);
  }
}

await prisma.$disconnect();
