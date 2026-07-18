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
  const articles = await prisma.blogArticle.findMany({
    select: { slug: true },
  });
  const slugs = articles.map(a => a.slug).sort();
  console.log(JSON.stringify(slugs));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
