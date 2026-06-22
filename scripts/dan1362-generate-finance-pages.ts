/**
 * DAN-1362: Generate finance/news-media comparison pages as inbound-link
 * sources for /compare/bloomberg-vs-the-wall-street-journal.
 *
 * Uses the same generation path as POST /api/comparisons/generate
 * (generateComparison -> saveComparison), run headless so we don't need
 * the dev server. Idempotent: skips slugs already in the DB.
 *
 * Run with:
 *   npx tsx scripts/dan1362-generate-finance-pages.ts
 */
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { generateComparison } from "../src/lib/services/ai-comparison-generator";
import { getComparisonBySlug, saveComparison } from "../src/lib/services/comparison-service";
import { parseComparisonSlug } from "../src/lib/utils/slugify";

const SLUGS = [
  "bloomberg-vs-cnbc",
  "bloomberg-vs-financial-times",
  "wall-street-journal-vs-financial-times",
  "bloomberg-vs-marketwatch",
];

async function run() {
  for (const slug of SLUGS) {
    console.log(`\n=== ${slug} ===`);
    const existing = await getComparisonBySlug(slug).catch(() => null);
    if (existing) {
      console.log(`  SKIP — already exists [${(existing as { status?: string }).status ?? "?"}]`);
      continue;
    }
    const parts = parseComparisonSlug(slug);
    if (!parts) {
      console.log("  ERROR — unparseable slug");
      continue;
    }
    const entityA = parts.entities[0].replace(/-/g, " ");
    const entityB = parts.entities[1].replace(/-/g, " ");
    console.log(`  generating: "${entityA}" vs "${entityB}"`);
    const t0 = Date.now();
    const result = await generateComparison(entityA, entityB, slug);
    if (!result.success || !result.comparison) {
      console.log(`  FAILED [${result.errorStage ?? "unknown"}]: ${result.error}`);
      continue;
    }
    await saveComparison(result.comparison);
    console.log(`  SAVED in ${((Date.now() - t0) / 1000).toFixed(1)}s — title: ${result.comparison.title}`);
  }
  console.log("\nDone.");
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
