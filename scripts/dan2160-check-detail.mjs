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
];

for (const { slug, pos } of targets) {
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, slug: true, metaTitle: true, metaDescription: true, shortAnswer: true, verdict: true, schemaMarkup: true, contentScore: true }
  });
  if (!comp) { console.log(`${slug} — NOT FOUND`); continue; }
  
  const faqs = await prisma.fAQ.findMany({ where: { comparisonId: comp.id }, orderBy: { sortOrder: 'asc' } });
  
  // Count inbound links  
  const inLinks = await prisma.internalLink.count({ where: { toPath: `/compare/${slug}` } });
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[pos ${pos}] ${slug}`);
  console.log(`  metaTitle: ${comp.metaTitle?.substring(0, 65) || 'NONE'}`);
  console.log(`  metaDesc: ${comp.metaDescription?.substring(0, 80) || 'NONE'}`);
  console.log(`  contentScore: ${comp.contentScore || 'N/A'} | inboundLinks: ${inLinks}`);
  console.log(`  hasSchemaMarkup: ${!!comp.schemaMarkup}`);
  console.log(`  FAQs (${faqs.length}):`);
  faqs.forEach((f, i) => console.log(`    [${i}] ${f.question?.substring(0, 70)}`));
}

await prisma.$disconnect();
