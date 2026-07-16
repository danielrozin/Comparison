/**
 * DAN-2160 — Check blog posts for link gaps to our 6 closest-to-page-1 targets
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
const prisma = new PrismaClient();

const targetPaths = [
  '/compare/youtube-music-vs-soundcloud',
  '/compare/capital-one-vs-chase',
  '/compare/ikea-vs-wayfair',
  '/compare/macbook-air-m3-vs-macbook-air-m4',
  '/compare/virat-kohli-vs-sachin-tendulkar',
  '/compare/expedia-vs-kayak',
];

// Get all blog posts
const blogs = await prisma.blogArticle.findMany({
  select: { slug: true, title: true, viewCount: true },
  orderBy: { viewCount: 'desc' },
  take: 100,
});

console.log(`Found ${blogs.length} blog posts. Checking link gaps...`);

for (const b of blogs) {
  const fromPath = `/blog/${b.slug}`;
  const existingLinks = await prisma.internalLink.findMany({
    where: { fromPath, toPath: { in: targetPaths } },
    select: { toPath: true },
  });
  const linked = new Set(existingLinks.map(l => l.toPath));
  const missing = targetPaths.filter(t => !linked.has(t)).map(t => t.replace('/compare/', ''));
  
  // Only show if it has any relevance (via title keywords)
  const title = b.title.toLowerCase();
  const hasMusicKw = title.includes('music') || title.includes('soundcloud') || title.includes('spotify') || title.includes('stream');
  const hasFinanceKw = title.includes('bank') || title.includes('credit') || title.includes('capital') || title.includes('chase') || title.includes('finance');
  const hasFurnKw = title.includes('ikea') || title.includes('wayfair') || title.includes('furni') || title.includes('home');
  const hasMacKw = title.includes('macbook') || title.includes('apple') || title.includes('mac ') || title.includes('laptop');
  const hasCricKw = title.includes('cricket') || title.includes('kohli') || title.includes('tendulkar');
  const hasTravelKw = title.includes('travel') || title.includes('expedia') || title.includes('kayak') || title.includes('flight') || title.includes('hotel');
  
  const relevant = hasMusicKw || hasFinanceKw || hasFurnKw || hasMacKw || hasCricKw || hasTravelKw;
  
  if (relevant && missing.length > 0) {
    console.log(`\nBlog: ${b.slug} (views: ${b.viewCount||0})`);
    console.log(`  Title: ${b.title}`);
    console.log(`  Missing links to: ${missing.join(', ')}`);
  }
}

await prisma.$disconnect();
