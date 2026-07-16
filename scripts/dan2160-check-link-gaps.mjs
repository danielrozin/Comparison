/**
 * DAN-2160 — Find top 20 highest-traffic pages NOT linking to our 6 closest targets
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

const targets = [
  'youtube-music-vs-soundcloud',
  'capital-one-vs-chase',
  'ikea-vs-wayfair',
  'macbook-air-m3-vs-macbook-air-m4',
  'virat-kohli-vs-sachin-tendulkar',
  'expedia-vs-kayak',
];
const targetPaths = targets.map(s => `/compare/${s}`);

// Get top 50 pages by view count
const topPages = await prisma.comparison.findMany({
  where: { viewCount: { gt: 50000 } },
  select: { slug: true, viewCount: true },
  orderBy: { viewCount: 'desc' },
  take: 50,
});

console.log(`Top ${topPages.length} pages with 50k+ views`);

// For each top page, check which target paths it links to
for (const p of topPages) {
  const fromPath = `/compare/${p.slug}`;
  const existingLinks = await prisma.internalLink.findMany({
    where: { fromPath, toPath: { in: targetPaths } },
    select: { toPath: true },
  });
  const linked = new Set(existingLinks.map(l => l.toPath));
  const missing = targetPaths.filter(t => !linked.has(t)).map(t => t.replace('/compare/', ''));
  
  if (missing.length > 0) {
    console.log(`${p.slug} (${(p.viewCount/1000).toFixed(0)}k views) → missing links to: ${missing.join(', ')}`);
  }
}

await prisma.$disconnect();
