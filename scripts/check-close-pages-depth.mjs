import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

const slugs = [
  'youtube-music-vs-soundcloud',      // pos 11 - CLOSEST to page 1
  'capital-one-vs-chase',             // pos 13
  'ikea-vs-wayfair',                  // pos 13
  'macbook-air-m3-vs-macbook-air-m4', // pos 13
  'virat-kohli-vs-sachin-tendulkar',  // pos 15
];

for (const slug of slugs) {
  const page = await prisma.comparison.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      metaTitle: true,
      metaDescription: true,
      keyDifferences: true,
      shortAnswer: true,
      faqs: { select: { question: true, answer: true } },
      verdict: true,
    }
  });
  if (page) {
    const kds = Array.isArray(page.keyDifferences) ? page.keyDifferences.length : 0;
    const faqs = page.faqs ? page.faqs.length : 0;
    console.log(`\n=== ${slug} (KDs:${kds} FAQs:${faqs}) ===`);
    console.log(`  MetaTitle: ${page.metaTitle || 'MISSING'}`);
    console.log(`  MetaDesc: ${(page.metaDescription || 'MISSING').slice(0, 100)}`);
    if (Array.isArray(page.keyDifferences)) {
      console.log(`  KD labels: ${page.keyDifferences.map(k => k.label || k.aspect || '?').join(', ')}`);
    }
    if (page.faqs) {
      page.faqs.forEach(f => console.log(`  Q: ${f.question}`));
    }
  }
}

await prisma.$disconnect();
