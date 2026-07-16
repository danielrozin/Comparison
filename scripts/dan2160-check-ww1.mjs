import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
const prisma = new PrismaClient();

const c = await prisma.comparison.findUnique({
  where: { slug: "ww1-vs-ww2" },
  select: {
    metaTitle: true, metaDescription: true, contentScore: true, viewCount: true,
    faqs: { select: { question: true, answer: true } },
    keyDifferences: true, shortAnswer: true,
  }
});

if (!c) { console.log("NOT FOUND"); process.exit(1); }
const faqs = Array.isArray(c.faqs) ? c.faqs : [];
const kds = Array.isArray(c.keyDifferences) ? c.keyDifferences : [];
console.log(`score=${c.contentScore} views=${c.viewCount}`);
console.log(`title(${(c.metaTitle||'').length}ch): ${c.metaTitle}`);
console.log(`desc(${(c.metaDescription||'').length}ch): ${c.metaDescription}`);
console.log(`\nFAQs (${faqs.length}):`);
faqs.forEach((f,i) => console.log(`  [${i+1}] ${f.question}`));
console.log(`\nKDs (${kds.length}):`);
kds.forEach((k,i) => console.log(`  [${i+1}] ${k.label || k.key}`));
console.log(`\nShortAnswer(${(c.shortAnswer||'').length}ch): ${c.shortAnswer?.substring(0,400)}`);

await prisma.$disconnect();
