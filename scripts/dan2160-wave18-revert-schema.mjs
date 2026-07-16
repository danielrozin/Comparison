/**
 * Revert Wave 18 Part 1: set schemaMarkup back to null for all target pages.
 *
 * The existing comparisonPageSchema() already generates FAQPage schema when
 * comparison.faqs.length > 0. By setting schemaMarkup, we were replacing the
 * full rich @graph (Article + ComparisonPage + FAQPage + BreadcrumbList + etc.)
 * with just a standalone FAQPage object — a regression.
 *
 * The internal links added in Part 2 are KEPT (they are additive and beneficial).
 */

import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);

const targetSlugs = [
  'youtube-music-vs-soundcloud',
  'capital-one-vs-chase',
  'ikea-vs-wayfair',
  'expedia-vs-kayak',
  'ww1-vs-ww2',
  'amazon-vs-best-buy',
  'farmers-insurance-vs-state-farm',
  'kobe-bryant-vs-lebron-james',
  'macbook-air-vs-macbook-pro-difference-2026-specs',
  'virat-kohli-vs-sachin-tendulkar',
];

log('Reverting schemaMarkup to null for all target pages...');

for (const slug of targetSlugs) {
  const result = await prisma.comparison.updateMany({
    where: { slug },
    data: {
      schemaMarkup: null,
      // Keep updatedAt updated — freshness signal is still useful
      updatedAt: new Date(),
    },
  });
  if (result.count > 0) {
    log(`  ✓ ${slug} — schemaMarkup cleared`);
  } else {
    log(`  · ${slug} — not found`);
  }
}

log('\nRevert done. Pages will now use the rich auto-generated @graph schema (which already includes FAQPage when FAQs exist).');

await prisma.$disconnect();
