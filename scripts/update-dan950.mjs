import * as dotenv from "dotenv";
dotenv.config({ path: "/Users/danielrozin/.paperclip/instances/default/projects/3bac00ef-9dd8-442f-8e07-9176d1e1c247/8af50701-a454-4b0c-98ee-b2bb66b2dfa2/Comparison/.env.local", override: true });
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "fs";
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
const slug = "alternatives-to-mercedes-top-luxury-car-options-for-every-budget";

const before = await prisma.blogArticle.findUnique({ where: { slug } });
// backup original
writeFileSync("/tmp/dan950-content.backup.md", before.content);
console.log("backed up original content (", before.content.length, "chars )");
console.log("old relatedComparisonSlugs:", JSON.stringify(before.relatedComparisonSlugs));

const newContent = readFileSync("/tmp/dan950-content.md", "utf8");
// Real, verified-published related slugs (replaces 3 shell slugs: audi-vs-mercedes, porsche-vs-mercedes, genesis-vs-mercedes)
const newRelated = ["bmw-vs-mercedes","lexus-vs-mercedes","tesla-vs-mercedes","genesis-vs-mercedes-benz","mercedes-e-class-vs-audi-a6"];

const updated = await prisma.blogArticle.update({
  where: { slug },
  data: { content: newContent, relatedComparisonSlugs: newRelated },
});
console.log("UPDATED. new content length:", updated.content.length);
console.log("new relatedComparisonSlugs:", JSON.stringify(updated.relatedComparisonSlugs));
const compLinks = [...new Set([...updated.content.matchAll(/\/compare\/[a-z0-9-]+/g)].map(m=>m[0]))];
const blogLinks = [...new Set([...updated.content.matchAll(/\/blog\/[a-z0-9-]+/g)].map(m=>m[0]))];
console.log("DB now has /compare body links:", compLinks.length, "| /blog body links:", blogLinks.length);
await prisma.$disconnect();
