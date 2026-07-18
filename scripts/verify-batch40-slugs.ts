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
  const slugsToCheck = [
    "bojangles-menu",
    "portillos-menu",
    "pf-changs-menu",
    "captain-ds-menu",
    "sheetz-menu",
  ];

  const found = await prisma.blogArticle.findMany({
    where: { slug: { in: slugsToCheck } },
    select: { slug: true },
  });
  const foundSlugs = new Set(found.map((f) => f.slug));

  console.log("Checking batch 40 candidates:");
  slugsToCheck.forEach((s) => {
    console.log(`  ${foundSlugs.has(s) ? "❌ EXISTS" : "✅ NEW   "}: ${s}`);
  });

  await prisma.$disconnect();
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
