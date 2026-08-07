/**
 * Fix blog articles published with fake future dates (the "September 2027"
 * cards on /blog) and titles/metas branded with the year 2027.
 *  - publishedAt > now  → backdate to the row's createdAt (the real moment)
 *  - "2027" in title/metaTitle/metaDescription/excerpt/content → "2026"
 *    (slugs untouched — URLs must not change)
 * Run with --apply to write; default is dry-run audit.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");
const now = new Date();

const future = await prisma.blogArticle.findMany({
  where: { publishedAt: { gt: now } },
  select: { id: true, slug: true, publishedAt: true, createdAt: true },
  orderBy: { publishedAt: "asc" },
});
console.log("future-dated blog articles:", future.length);

const year2027 = await prisma.blogArticle.findMany({
  // Only articles whose TITLE is branded with 2027 (e.g. "Popeyes Menu … (2027)").
  // Articles that merely mention 2027 in body/meta (e.g. PS6 launch speculation)
  // are legitimate future references and must not be rewritten.
  where: { title: { contains: "2027" } },
  select: { id: true, slug: true, title: true, metaTitle: true, metaDescription: true, excerpt: true, content: true },
});
console.log("articles with 2027-branded titles:", year2027.length);
for (const a of year2027.slice(0, 10)) console.log("  ", a.slug, "|", a.title);

if (!APPLY) {
  console.log("\nDry run — pass --apply to write.");
} else {
  let n = 0;
  for (const a of future) {
    const real = a.createdAt <= now ? a.createdAt : now;
    await prisma.blogArticle.update({ where: { id: a.id }, data: { publishedAt: real } });
    n++;
  }
  console.log("backdated", n, "articles to their createdAt");

  const fix = (s) => (s ? s.replaceAll("2027", "2026") : s);
  let m = 0;
  for (const a of year2027) {
    await prisma.blogArticle.update({
      where: { id: a.id },
      data: {
        title: fix(a.title),
        metaTitle: fix(a.metaTitle),
        metaDescription: fix(a.metaDescription),
        excerpt: fix(a.excerpt),
        content: fix(a.content),
      },
    });
    m++;
  }
  console.log("rewrote 2027→2026 in", m, "articles");
}
await prisma.$disconnect();
