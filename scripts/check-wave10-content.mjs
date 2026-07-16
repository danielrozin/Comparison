import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();

const slugs = [
  'ww1-vs-ww2',
  'amazon-vs-best-buy',
  'farmers-insurance-vs-state-farm',
  'expedia-vs-kayak',
  'capital-one-vs-chase',
  'ikea-vs-wayfair',
  'ps5-pro-vs-xbox-series-x-performance-comparison-2026',
  'macbook-air-vs-macbook-pro-difference-2026-specs'
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
      faqs: true,
      shortAnswer: true,
    }
  });
  if (page) {
    const kds = Array.isArray(page.keyDifferences) ? page.keyDifferences.length : 0;
    const faqs = Array.isArray(page.faqs) ? page.faqs.length : 0;
    console.log(`\n=== ${slug} ===`);
    console.log(`  KDs: ${kds}, FAQs: ${faqs}`);
    console.log(`  MetaTitle: ${page.metaTitle || 'MISSING'}`);
    console.log(`  MetaDesc: ${(page.metaDescription || 'MISSING').slice(0, 120)}`);
    if (Array.isArray(page.keyDifferences)) {
      console.log('  KD titles:');
      page.keyDifferences.forEach(k => console.log(`    - ${k.title || k.aspect || JSON.stringify(k).slice(0, 60)}`));
    }
    if (Array.isArray(page.faqs) && page.faqs.length > 0) {
      console.log('  FAQs:');
      page.faqs.forEach(f => console.log(`    Q: ${f.question || f.q || JSON.stringify(f).slice(0, 80)}`));
    }
  } else {
    console.log(`\n${slug}: NOT FOUND`);
  }
}
await prisma.$disconnect();
