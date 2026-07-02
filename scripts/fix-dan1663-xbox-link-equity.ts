/**
 * DAN-1663: Fix Xbox pos 14→49 regression — redirect chain + internal link equity
 *
 * DAN-1287 patched metaTitle/intro and created internal links targeting the OLD
 * slug `ps5-pro-vs-xbox-series-x`, which was already redirected (308) to the
 * canonical `ps5-pro-vs-xbox-series-x-performance-comparison-2026` by DAN-1269.
 *
 * Two problems to fix:
 *   1. The FPS-intent metaTitle and intro (shortAnswer first sentence) from
 *      DAN-1287 were written to the OLD DB row, not the canonical — the canonical
 *      page still serves DAN-1169's "Specs & Price 2026" title instead of the
 *      intended "FPS, Specs & Price 2026" title.
 *   2. `linkToTarget` in DAN-1287 created up to 5 InternalLink rows with
 *      toPath = '/compare/ps5-pro-vs-xbox-series-x' (the 308 slug). These links
 *      traverse a redirect hop rather than flowing equity directly to the canonical.
 *
 * This script (idempotent):
 *   A) Applies DAN-1287's metaTitle + shortAnswer first-sentence to the CANONICAL.
 *   B) Migrates InternalLink.toPath from old slug → canonical, deduping on conflict.
 *
 * Run via CI:
 *   gh workflow run publish-editorial.yml -f script=scripts/fix-dan1663-xbox-link-equity.ts
 * Local:
 *   npx tsx scripts/fix-dan1663-xbox-link-equity.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ override: true, path: path.resolve(__dirname, "../.env.local") });

import { getPrisma } from "../src/lib/db/prisma";

const prisma = getPrisma();
if (!prisma) {
  console.error("✗ DATABASE_URL not available — this script must run against a real prod DB.");
  process.exit(1);
}

const OLD_SLUG = "ps5-pro-vs-xbox-series-x";
const CANONICAL_SLUG = "ps5-pro-vs-xbox-series-x-performance-comparison-2026";
const OLD_PATH = `/compare/${OLD_SLUG}`;
const CANONICAL_PATH = `/compare/${CANONICAL_SLUG}`;

// DAN-1287's intended updates — should have gone to CANONICAL_SLUG
const META_TITLE = "PS5 Pro vs Xbox Series X: FPS, Specs & Price 2026";
const INTRO_FIRST_SENTENCE =
  "PS5 Pro vs Xbox Series X — frame rate (FPS) and specs compared: the PS5 Pro's 2× GPU and AI upscaling vs the Xbox Series X's 12 TFLOPS, and which console actually hits higher FPS in real games.";

/** Replace the first sentence of `text` with `newFirst`. Idempotent. */
function setFirstSentence(text: string | null, newFirst: string): string {
  const nf = newFirst.trim();
  if (!text || !text.trim()) return nf;
  if (text.trim().startsWith(nf)) return text;
  const m = text.match(/^[\s\S]*?[.!?](\s+|$)/);
  if (!m) return `${nf} ${text.trim()}`;
  const rest = text.slice(m[0].length).trim();
  return rest ? `${nf} ${rest}` : nf;
}

async function main() {
  console.log("== DAN-1663: Xbox link equity fix ==\n");

  // -------------------------------------------------------------------------
  // A) Patch canonical DB row with DAN-1287's intended metaTitle + intro
  // -------------------------------------------------------------------------
  console.log(`[A] Patching canonical: /compare/${CANONICAL_SLUG}`);
  const canonical = await prisma!.comparison.findUnique({
    where: { slug: CANONICAL_SLUG },
    select: { id: true, metaTitle: true, shortAnswer: true },
  });
  if (!canonical) {
    console.error(`  ✗ Canonical row NOT FOUND for slug="${CANONICAL_SLUG}" — aborting`);
    process.exit(1);
  }

  const data: Record<string, string> = {};

  if (canonical.metaTitle === META_TITLE) {
    console.log(`  · metaTitle already correct — skipping`);
  } else {
    data.metaTitle = META_TITLE;
    console.log(`  ✓ metaTitle: "${canonical.metaTitle}" → "${META_TITLE}"`);
  }

  const newShortAnswer = setFirstSentence(canonical.shortAnswer, INTRO_FIRST_SENTENCE);
  if (newShortAnswer === canonical.shortAnswer) {
    console.log(`  · shortAnswer (intro) already starts with intended sentence — skipping`);
  } else {
    data.shortAnswer = newShortAnswer;
    console.log(`  ✓ shortAnswer first sentence updated`);
  }

  if (Object.keys(data).length > 0) {
    await prisma!.comparison.update({ where: { slug: CANONICAL_SLUG }, data });
    console.log(`  ✓ DB row updated`);
  } else {
    console.log(`  · No changes needed on canonical row`);
  }

  // -------------------------------------------------------------------------
  // B) Migrate internal links: toPath = OLD_PATH → CANONICAL_PATH
  // -------------------------------------------------------------------------
  console.log(`\n[B] Migrating internal links: ${OLD_PATH} → ${CANONICAL_PATH}`);
  const staleLinks = await prisma!.internalLink.findMany({
    where: { toPath: OLD_PATH },
    select: { id: true, fromPath: true, anchorText: true },
  });

  if (staleLinks.length === 0) {
    console.log(`  · No stale internal links found pointing to ${OLD_PATH}`);
  } else {
    console.log(`  Found ${staleLinks.length} stale link(s) to migrate:`);
    for (const link of staleLinks) {
      // Check if a canonical-pointing link already exists from same source
      const existing = await prisma!.internalLink.findFirst({
        where: { fromPath: link.fromPath, toPath: CANONICAL_PATH },
        select: { id: true },
      });
      if (existing) {
        // Dedup: canonical link already exists — just delete the stale one
        await prisma!.internalLink.delete({ where: { id: link.id } });
        console.log(`  ✓ ${link.fromPath} → duplicate removed (canonical link already exists)`);
      } else {
        // Update toPath to canonical
        await prisma!.internalLink.update({
          where: { id: link.id },
          data: { toPath: CANONICAL_PATH },
        });
        console.log(`  ✓ ${link.fromPath} → ${CANONICAL_PATH}  anchor="${link.anchorText}"`);
      }
    }
  }

  console.log("\n== Done ==");
  console.log("\nNext: run via CI → gh workflow run publish-editorial.yml -f script=scripts/fix-dan1663-xbox-link-equity.ts");
}

main()
  .then(async () => {
    await prisma!.$disconnect();
  })
  .catch(async (e) => {
    console.error("✗ fix failed:", e);
    await prisma!.$disconnect();
    process.exit(1);
  });
