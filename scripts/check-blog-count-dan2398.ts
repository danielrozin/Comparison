import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL.replace(
    /-pooler(\.[^/]+\.aws\.neon\.tech)/,
    "$1"
  ).trim();
}
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.trim();
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.blogArticle.count();
  const articles = await prisma.blogArticle.findMany({
    select: { slug: true, category: true },
    orderBy: { publishedAt: 'desc' },
    take: 30
  });
  console.log(`Total blog articles: ${count}`);
  console.log("Recent 30:");
  articles.forEach((a) => console.log(`  ${a.slug}`));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
