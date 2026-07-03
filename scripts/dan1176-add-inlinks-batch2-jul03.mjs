/**
 * DAN-1176 — Add internal links to remaining 0-inlink pos 11-20 pages (Batch 2, 2026-07-03)
 *
 * Targets:
 *   1. paramount-plus-vs-peacock (pos 20, 30/mo)
 *   2. virat-kohli-vs-sachin-tendulkar (pos 15, 30/mo)
 *   3. f-16-vs-f-15 (pos 18, 30/mo)
 *   4. samsung-galaxy-vs-motorola (pos 18, 30/mo)
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
const prisma = new PrismaClient();

const linksToAdd = [
  // ── paramount-plus-vs-peacock (pos 20) ──────────────────────────────────
  {
    fromPath: "/compare/netflix-vs-peacock-comparison-2026",
    toPath: "/compare/paramount-plus-vs-peacock",
    anchorText: "Paramount Plus vs Peacock",
    linkType: "related",
    position: "inline",
    score: 1.8,
  },
  {
    fromPath: "/compare/netflix-vs-hulu",
    toPath: "/compare/paramount-plus-vs-peacock",
    anchorText: "Paramount Plus vs Peacock comparison",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/netflix-vs-disney-plus",
    toPath: "/compare/paramount-plus-vs-peacock",
    anchorText: "Paramount Plus vs Peacock",
    linkType: "related",
    position: "inline",
    score: 1.4,
  },
  {
    fromPath: "/compare/netflix-vs-max-comparison-2026",
    toPath: "/compare/paramount-plus-vs-peacock",
    anchorText: "Paramount Plus vs Peacock",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },
  {
    fromPath: "/compare/disney-vs-netflix-2026",
    toPath: "/compare/paramount-plus-vs-peacock",
    anchorText: "Paramount Plus vs Peacock",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },

  // ── virat-kohli-vs-sachin-tendulkar (pos 15) ────────────────────────────
  {
    fromPath: "/compare/india-vs-pakistan",
    toPath: "/compare/virat-kohli-vs-sachin-tendulkar",
    anchorText: "Virat Kohli vs Sachin Tendulkar",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/india-military-vs-pakistan-military",
    toPath: "/compare/virat-kohli-vs-sachin-tendulkar",
    anchorText: "Virat Kohli vs Sachin Tendulkar cricket stats",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },
  {
    fromPath: "/compare/us-vs-india-economy",
    toPath: "/compare/virat-kohli-vs-sachin-tendulkar",
    anchorText: "Virat Kohli vs Sachin Tendulkar",
    linkType: "related",
    position: "inline",
    score: 1.2,
  },
  {
    fromPath: "/compare/china-vs-india",
    toPath: "/compare/virat-kohli-vs-sachin-tendulkar",
    anchorText: "Kohli vs Tendulkar cricket comparison",
    linkType: "related",
    position: "inline",
    score: 1.2,
  },
  {
    fromPath: "/compare/china-vs-india-economy",
    toPath: "/compare/virat-kohli-vs-sachin-tendulkar",
    anchorText: "Virat Kohli vs Sachin Tendulkar",
    linkType: "related",
    position: "inline",
    score: 1.2,
  },

  // ── f-16-vs-f-15 (pos 18) ───────────────────────────────────────────────
  {
    fromPath: "/compare/aircraft-carrier-vs-submarine",
    toPath: "/compare/f-16-vs-f-15",
    anchorText: "F-16 vs F-15 fighter jets",
    linkType: "related",
    position: "inline",
    score: 1.6,
  },
  {
    fromPath: "/compare/us-military-vs-china-military",
    toPath: "/compare/f-16-vs-f-15",
    anchorText: "F-16 vs F-15",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/us-military-vs-russia-military",
    toPath: "/compare/f-16-vs-f-15",
    anchorText: "F-16 vs F-15 comparison",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/israel-vs-iran-military-capabilities-2026",
    toPath: "/compare/f-16-vs-f-15",
    anchorText: "F-16 vs F-15 fighter aircraft",
    linkType: "related",
    position: "inline",
    score: 1.4,
  },
  {
    fromPath: "/compare/india-military-vs-pakistan-military",
    toPath: "/compare/f-16-vs-f-15",
    anchorText: "F-16 vs F-15",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },

  // ── samsung-galaxy-vs-motorola (pos 18) ─────────────────────────────────
  {
    fromPath: "/compare/apple-vs-samsung",
    toPath: "/compare/samsung-galaxy-vs-motorola",
    anchorText: "Samsung Galaxy vs Motorola",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/android-vs-ios",
    toPath: "/compare/samsung-galaxy-vs-motorola",
    anchorText: "Samsung Galaxy vs Motorola comparison",
    linkType: "related",
    position: "inline",
    score: 1.4,
  },
  {
    fromPath: "/compare/samsung-s25-vs-s25-ultra",
    toPath: "/compare/samsung-galaxy-vs-motorola",
    anchorText: "Samsung Galaxy vs Motorola",
    linkType: "related",
    position: "inline",
    score: 1.5,
  },
  {
    fromPath: "/compare/ipad-vs-samsung-tablet",
    toPath: "/compare/samsung-galaxy-vs-motorola",
    anchorText: "Samsung Galaxy vs Motorola phones",
    linkType: "related",
    position: "inline",
    score: 1.4,
  },
  {
    fromPath: "/compare/airpods-pro-vs-galaxy-buds",
    toPath: "/compare/samsung-galaxy-vs-motorola",
    anchorText: "Samsung Galaxy vs Motorola",
    linkType: "related",
    position: "inline",
    score: 1.3,
  },
];

console.log(`Adding ${linksToAdd.length} internal links (Batch 2)...`);
let added = 0;
let skipped = 0;

for (const link of linksToAdd) {
  const existing = await prisma.internalLink.findFirst({
    where: { fromPath: link.fromPath, toPath: link.toPath },
  });
  if (existing) {
    console.log(`  SKIP (exists): ${link.fromPath} → ${link.toPath}`);
    skipped++;
    continue;
  }

  // Verify source page is published
  const sourceSlug = link.fromPath.replace("/compare/", "");
  const sourcePage = await prisma.comparison.findUnique({
    where: { slug: sourceSlug },
    select: { status: true },
  });
  if (!sourcePage || sourcePage.status !== "published") {
    console.log(`  SKIP (not published): ${link.fromPath}`);
    skipped++;
    continue;
  }

  await prisma.internalLink.create({ data: link });
  console.log(`  ADDED: ${link.fromPath} → ${link.toPath} (score=${link.score})`);
  added++;
}

console.log(`\nDone. Added: ${added}, Skipped: ${skipped}`);

// Verify final inlink counts
const targets = [
  "paramount-plus-vs-peacock",
  "virat-kohli-vs-sachin-tendulkar",
  "f-16-vs-f-15",
  "samsung-galaxy-vs-motorola",
];
for (const slug of targets) {
  const count = await prisma.internalLink.count({ where: { toPath: `/compare/${slug}` } });
  console.log(`Final inlinks for /compare/${slug}: ${count}`);
}

await prisma.$disconnect();
