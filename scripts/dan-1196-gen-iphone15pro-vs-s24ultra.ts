/**
 * DAN-1196: Generate iphone-15-pro-vs-samsung-galaxy-s24-ultra comparison row.
 *
 * Runs the real content-generation pipeline (Tavily enrich -> Claude ->
 * saveComparison to prod PostgreSQL) scoped to this single pairing, using the
 * exact target slug. This is the same code path as
 * POST /api/comparisons/generate, run locally against the prod DB because the
 * Vercel production deploy of the max_tokens fix (PR #80) was canceled at the
 * dashboard / account-blocked.
 *
 * Run with:
 *   npx tsx scripts/dan-1196-gen-iphone15pro-vs-s24ultra.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { generateComparison } from "../src/lib/services/ai-comparison-generator";
import { saveComparison, getComparisonBySlug } from "../src/lib/services/comparison-service";

const ENTITY_A = "iPhone 15 Pro";
const ENTITY_B = "Samsung Galaxy S24 Ultra";
const SLUG = "iphone-15-pro-vs-samsung-galaxy-s24-ultra";

async function main() {
  const existing = await getComparisonBySlug(SLUG).catch(() => null);
  if (existing) {
    console.log(`Already exists: id=${existing.id} slug=${existing.slug}`);
    return;
  }

  console.log(`Generating "${ENTITY_A}" vs "${ENTITY_B}" -> slug="${SLUG}"...`);
  const result = await generateComparison(ENTITY_A, ENTITY_B, SLUG);

  if (!result.success || !result.comparison) {
    console.error(`FAIL: ${result.error} (stage=${result.errorStage})`);
    process.exit(1);
  }

  // Guard: confirm the generator kept the exact target slug.
  if (result.comparison.slug !== SLUG) {
    console.error(`SLUG DRIFT: got "${result.comparison.slug}", expected "${SLUG}". Aborting.`);
    process.exit(1);
  }

  const saved = await saveComparison(result.comparison);
  if (!saved) {
    console.error("FAIL: saveComparison returned null. Check DATABASE_URL.");
    process.exit(1);
  }

  console.log(`Saved: id=${saved.id} slug=${saved.slug}`);
  console.log(
    `Populated: keyDifferences=${saved.keyDifferences.length} attributes=${saved.attributes.length} faqs=${saved.faqs.length} entities=${saved.entities.length}`,
  );
  console.log(`Verdict present: ${Boolean(saved.verdict)}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Generation error:", err);
    process.exit(1);
  });
