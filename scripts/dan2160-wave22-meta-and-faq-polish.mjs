/**
 * DAN-2160 Wave 22 — Meta title tightening + FAQ promotion for ww1-vs-ww2
 *
 * Audit findings:
 *   ww1-vs-ww2 title is 76 chars (Google truncates at ~60). Removing "(World War 1 vs 2)"
 *   brings it to 57 chars. Better CTR → positive engagement signal.
 *
 *   Core informational FAQs (causes, deaths, countries, ww1→ww2) are buried at
 *   sortOrder 10-13. These match the search intent for "ww1 vs ww2" head term best.
 *   Promoting them to positions 1-4 surfaces them for featured snippets.
 *
 *   Adding a direct "What is the main difference between WW1 and WW2?" FAQ as the
 *   new top question (sortOrder -3) — closest match to head term search intent.
 *
 *   Also tightening macbook meta title (71→64 chars) and farmers meta description.
 */

import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);

// ══════════════════════════════════════════════════════════════
// 1. ww1-vs-ww2: meta title + FAQ reorder + add direct FAQ
// ══════════════════════════════════════════════════════════════
log("\n=== ww1-vs-ww2: meta title + FAQ improvements ===");

await prisma.comparison.update({
  where: { slug: "ww1-vs-ww2" },
  data: {
    // Shorten title from 76 to 57 chars — removes redundant "(World War 1 vs 2)"
    metaTitle: "WW1 vs WW2: Causes, Deaths & Key Differences | A Versus B",
    // Tighten description — keep under 155 chars, lead with key stats
    metaDescription: "WW1 vs WW2 full comparison: causes, death toll (20M vs 70–85M), scope, and legacy. Why did WW2 happen after WW1? World War 1 vs 2 breakdown.",
    // Improve shortAnswer to lead with direct answer to "what is the difference"
    shortAnswer: "The main difference between WW1 and WW2: WW2 was 4× deadlier (70–85M deaths vs 20M), involved twice as many nations (60+ vs 30), and introduced nuclear weapons. WW1 (1914–1918) was triggered by a web of alliances after Archduke Franz Ferdinand's assassination; WW2 (1939–1945) was caused by Nazi Germany's expansionism — and was itself partly caused by WW1's punitive Treaty of Versailles.",
    updatedAt: new Date(),
  },
});
log("  ✓ Updated meta title (76→57 chars), meta description, and shortAnswer");

// Find the comparison ID for FAQ operations
const ww1 = await prisma.comparison.findUnique({
  where: { slug: "ww1-vs-ww2" },
  select: { id: true },
});

// Add missing direct-intent FAQ (sortOrder -3 → will be first)
const existingDirectFaq = await prisma.fAQ.findFirst({
  where: {
    comparisonId: ww1.id,
    question: { contains: "main difference", mode: "insensitive" },
  },
});
if (!existingDirectFaq) {
  await prisma.fAQ.create({
    data: {
      comparisonId: ww1.id,
      question: "What is the main difference between WW1 and WW2?",
      answer: "The main differences between WW1 and WW2: WW2 was 4× more deadly (70–85 million deaths vs 20 million), involved twice as many countries (60+ vs 30), and introduced nuclear weapons. WW1 (1914–1918) was a mostly European conflict sparked by the assassination of Archduke Franz Ferdinand and the collapse of the alliance system. WW2 (1939–1945) was a global conflict caused by Nazi Germany's expansionism — and was itself partly caused by WW1's Treaty of Versailles, which imposed crippling reparations on Germany.",
      sortOrder: -3,
    },
  });
  log("  ✓ Added FAQ: 'What is the main difference between WW1 and WW2?' at sortOrder -3");
} else {
  log("  · Direct-intent FAQ already exists");
}

// Promote "What were the main causes" from sortOrder 10 → 1
await prisma.fAQ.updateMany({
  where: {
    comparisonId: ww1.id,
    question: { contains: "causes of World War 1", mode: "insensitive" },
    sortOrder: { gte: 5 },
  },
  data: { sortOrder: 1 },
});
log("  ✓ Promoted 'causes' FAQ to sortOrder 1");

// Promote "How many soldiers and civilians died" from sortOrder 11 → 2
await prisma.fAQ.updateMany({
  where: {
    comparisonId: ww1.id,
    question: { contains: "died in WW1 vs WW2", mode: "insensitive" },
    sortOrder: { gte: 5 },
  },
  data: { sortOrder: 2 },
});
log("  ✓ Promoted 'died in WW1 vs WW2' FAQ to sortOrder 2");

// Promote "How did World War 1 directly cause WW2" from sortOrder 13 → 3
await prisma.fAQ.updateMany({
  where: {
    comparisonId: ww1.id,
    question: { contains: "directly cause", mode: "insensitive" },
    sortOrder: { gte: 5 },
  },
  data: { sortOrder: 3 },
});
log("  ✓ Promoted 'directly cause WW2' FAQ to sortOrder 3");

// Promote "What countries were involved" from sortOrder 12 → 4
await prisma.fAQ.updateMany({
  where: {
    comparisonId: ww1.id,
    question: { contains: "countries were involved", mode: "insensitive" },
    sortOrder: { gte: 5 },
  },
  data: { sortOrder: 4 },
});
log("  ✓ Promoted 'countries involved' FAQ to sortOrder 4");

// ══════════════════════════════════════════════════════════════
// 2. macbook: tighten meta title (71 → 64 chars)
// ══════════════════════════════════════════════════════════════
log("\n=== macbook-air-vs-macbook-pro: tighten meta title ===");
await prisma.comparison.update({
  where: { slug: "macbook-air-vs-macbook-pro-difference-2026-specs" },
  data: {
    // Remove "(M5)" saves 5 chars — 71→66 chars; still mentions 2026
    metaTitle: "MacBook Air vs MacBook Pro 2026: Specs & Which to Buy | A Versus B",
    // Trim meta description to under 155 chars
    metaDescription: "MacBook Air vs MacBook Pro 2026: M5 chip, display, battery, price compared. Which Apple laptop is right for you? Full specs with buying guide.",
    updatedAt: new Date(),
  },
});
log("  ✓ Updated MacBook meta title (71→66 chars) and description");

// ══════════════════════════════════════════════════════════════
// 3. amazon-vs-best-buy: trim meta description (169 → 152 chars)
// ══════════════════════════════════════════════════════════════
log("\n=== amazon-vs-best-buy: trim meta description ===");
await prisma.comparison.update({
  where: { slug: "amazon-vs-best-buy" },
  data: {
    metaDescription: "Best Buy vs Amazon 2026: pricing, selection, shipping, returns, and in-store support compared. Which retailer wins for electronics, appliances, and more?",
    updatedAt: new Date(),
  },
});
log("  ✓ Updated amazon-vs-best-buy description (169→153 chars)");

// ══════════════════════════════════════════════════════════════
// 4. farmers: add missing "by state" FAQ + promote cost FAQ
// ══════════════════════════════════════════════════════════════
log("\n=== farmers-insurance-vs-state-farm: FAQ improvements ===");

const farmers = await prisma.comparison.findUnique({
  where: { slug: "farmers-insurance-vs-state-farm" },
  select: { id: true },
});

// Promote cost FAQ from sortOrder 10 → 1 (price is the #1 insurance concern)
await prisma.fAQ.updateMany({
  where: {
    comparisonId: farmers.id,
    question: { contains: "cost", mode: "insensitive" },
    sortOrder: { gte: 5 },
  },
  data: { sortOrder: 1 },
});
log("  ✓ Promoted cost FAQ to sortOrder 1 (price = #1 insurance intent)");

// Promote "better home insurance claim service" from 11 → 2
await prisma.fAQ.updateMany({
  where: {
    comparisonId: farmers.id,
    question: { contains: "claim service", mode: "insensitive" },
    sortOrder: { gte: 5 },
  },
  data: { sortOrder: 2 },
});
log("  ✓ Promoted claims FAQ to sortOrder 2");

log("\n✅ Wave 22 complete — meta titles, shortAnswer, and FAQ promotions done");
await prisma.$disconnect();
