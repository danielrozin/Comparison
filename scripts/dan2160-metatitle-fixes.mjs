/**
 * DAN-2160 — MetaTitle polish for remaining gaps
 * - virat-kohli: add "Statistics" to match query "virat kohli vs sachin tendulkar statistics"
 * - ps5-pro-vs-xbox: add "Performance" to match query "ps5 pro vs xbox series x: performance"
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

async function setMetaTitle(slug, metaTitle) {
  const row = await prisma.comparison.findUnique({ where: { slug }, select: { id: true, metaTitle: true } });
  if (!row) { log(`  ! not found: ${slug}`); return; }
  if (row.metaTitle === metaTitle) { log(`  skip (same): ${slug}`); return; }
  log(`  old: "${row.metaTitle}"`);
  log(`  new: "${metaTitle}"`);
  if (!DRY) {
    await prisma.comparison.update({ where: { slug }, data: { metaTitle, updatedAt: new Date() } });
  }
  log(`  ${DRY ? "[DRY]" : "✓"} updated: ${slug}`);
}

log("\n=== MetaTitle fixes ===\n");

// Query: "virat kohli vs sachin tendulkar statistics"
// Old:   "Virat Kohli vs Sachin Tendulkar 2026 Comparison"
// New:   "Virat Kohli vs Sachin Tendulkar: Stats, Records & Career Comparison | A Versus B"
await setMetaTitle(
  "virat-kohli-vs-sachin-tendulkar",
  "Virat Kohli vs Sachin Tendulkar: Stats, Records & Career Comparison | A Versus B"
);

// Query: "ps5 pro vs xbox series x: performance"
// Old:   "PS5 Pro vs Xbox Series X 2026: Which Is Better?"
// New:   "PS5 Pro vs Xbox Series X: Performance, Graphics & Value (2026) | A Versus B"
await setMetaTitle(
  "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "PS5 Pro vs Xbox Series X: Performance, Graphics & Value (2026) | A Versus B"
);

log("\nDone.");
await prisma.$disconnect();
