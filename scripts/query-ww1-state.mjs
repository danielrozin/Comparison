import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const prisma = new PrismaClient();

// Check current ww1-vs-ww2 state
const c = await prisma.comparison.findUnique({
  where: { slug: "ww1-vs-ww2" },
  select: { id: true, title: true, shortAnswer: true, metaTitle: true, metaDescription: true, status: true, faqs: { select: { id: true, question: true, sortOrder: true } } },
});
console.log("ww1-vs-ww2 current state:", JSON.stringify(c, null, 2));

// Find related history/WW comparisons that are published
const related = await prisma.comparison.findMany({
  where: {
    status: "published",
    OR: [
      { slug: { contains: "ww" } },
      { slug: { contains: "war" } },
      { slug: { contains: "vietnam" } },
      { slug: { contains: "cold" } },
      { slug: { contains: "nuclear" } },
      { slug: { contains: "atomic" } },
      { slug: { contains: "japan" } },
      { slug: { contains: "germany" } },
      { slug: { contains: "russia" } },
      { slug: { contains: "soviet" } },
      { category: { in: ["history", "military", "countries"] } },
    ],
  },
  select: { slug: true, title: true, category: true },
  take: 50,
});
console.log("\nRelated history pages:", JSON.stringify(related, null, 2));

// Also check existing internal links TO ww1-vs-ww2
const existingLinks = await prisma.internalLink.findMany({
  where: { toPath: "/compare/ww1-vs-ww2" },
  select: { fromPath: true, anchorText: true },
});
console.log("\nExisting internal links TO ww1-vs-ww2:", JSON.stringify(existingLinks, null, 2));

await prisma.$disconnect();
