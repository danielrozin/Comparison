/**
 * DAN-2160 — Check content of closest-to-page-1 pages
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
  { slug: 'youtube-music-vs-soundcloud', pos: 11, kw: 'soundcloud vs youtube music', vol: 30 },
  { slug: 'capital-one-vs-chase', pos: 13, kw: 'are chase and capital one affiliated', vol: 40 },
  { slug: 'ikea-vs-wayfair', pos: 13, kw: 'wayfair vs ikea reddit', vol: 40 },
  { slug: 'macbook-air-m3-vs-macbook-air-m4', pos: 13, kw: 'macbook air m3 vs macbook air m4', vol: 20 },
  { slug: 'virat-kohli-vs-sachin-tendulkar', pos: 15, kw: 'virat kohli vs sachin tendulkar statistics', vol: 30 },
  { slug: 'expedia-vs-kayak', pos: 16, kw: 'expedia or kayak', vol: 50 },
];

for (const t of targets) {
  const c = await prisma.comparison.findUnique({
    where: { slug: t.slug },
    select: {
      metaTitle: true, metaDescription: true,
      contentScore: true, viewCount: true,
      faqs: true, keyDifferences: true, shortAnswer: true, title: true,
    }
  });
  if (!c) { console.log(`NOT FOUND: ${t.slug}`); continue; }
  
  const faqs = Array.isArray(c.faqs) ? c.faqs : [];
  const kds = Array.isArray(c.keyDifferences) ? c.keyDifferences : [];
  
  console.log(`\n=== pos${t.pos} vol${t.vol}: "${t.kw}" → /compare/${t.slug} ===`);
  console.log(`score=${c.contentScore} faqs=${faqs.length} kds=${kds.length} views=${c.viewCount}`);
  console.log(`title: ${c.metaTitle || c.title || '(none)'}`);
  console.log(`desc(${(c.metaDescription||'').length}ch): ${(c.metaDescription||'').substring(0,130)}`);
  console.log(`FAQs(${faqs.length}): ${faqs.map(f => f.question?.substring(0,50)).join(' | ')}`);
  console.log(`KDs(${kds.length}): ${kds.map(k => (k.label || k.key)?.substring(0,30)).slice(0,8).join(' | ')}`);
}

await prisma.$disconnect();
