/**
 * DAN-1176 — Check state of remaining unoptimized pos 11-20 pages
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();

const slugs = [
  'youtube-music-vs-soundcloud',
  'capital-one-vs-chase',
  'virat-kohli-vs-sachin-tendulkar',
  'f-16-vs-f-15',
  'samsung-galaxy-vs-motorola',
  'paramount-plus-vs-peacock',
  'macbook-air-m3-vs-macbook-air-m4',
];

for (const slug of slugs) {
  const cmp = await prisma.comparison.findUnique({
    where: { slug },
    select: {
      slug: true, status: true, title: true, metaTitle: true, shortAnswer: true,
      faqs: { orderBy: { sortOrder: 'asc' }, select: { id: true, question: true, sortOrder: true } }
    }
  });
  if (cmp) {
    const lastSort = cmp.faqs.length > 0 ? Math.max(...cmp.faqs.map(f => f.sortOrder)) : 0;
    console.log(`\n=== /compare/${slug} (${cmp.status}) ===`);
    console.log(`Title: ${cmp.title}`);
    console.log(`MetaTitle: ${cmp.metaTitle || '(none)'}`);
    console.log(`FAQs: ${cmp.faqs.length} (lastSortOrder=${lastSort})`);
    for (const f of cmp.faqs) console.log(`  [${f.sortOrder}] ${f.question}`);
  } else {
    console.log(`\n=== ${slug}: NOT FOUND ===`);
  }
}

await prisma.$disconnect();
