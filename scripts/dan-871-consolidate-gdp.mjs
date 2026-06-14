// DAN-871 — Consolidate "US vs China GDP 2026" thin blog cluster.
//
// Audit (DAN-347 P1 #7) under-counted; surface = 44 published BlogArticle
// rows, all 0 views, all targeting the same intent ("US vs China GDP /
// nominal GDP 2026" + 2 mirror-cased "china-vs-us-gdp" siblings). Same
// cron-cannibalization pattern absorbed by DAN-451 (MacBook, 150 dupes)
// and DAN-868 (Mercedes, 75 dupes).
//
// Canonical target is NOT a BlogArticle — it is the existing published
// Comparison row at `/compare/us-vs-china-gdp-comparison-2026` (DAN-608
// 2-way schema; /vs/ is not a route, see blog-redirects.ts DAN-1154 note).
// This script therefore only archives the 44 dupes; no
// canonical body enhancement is applied (per DAN-871 plan v1, CMO
// endorsed 2026-05-30 — TL;DR/FAQ on the /vs row is parked as
// out-of-scope follow-up).
//
// Companion edge redirects live in src/lib/redirects/blog-redirects.ts
// and are applied via next.config.ts redirects() — they fire
// independently of DB state, so 301s work even if the archived rows are
// later deleted.
//
// Idempotent. Safe to re-run.

import { PrismaClient } from "@prisma/client";

const CANONICAL_VS_PATH = "/compare/us-vs-china-gdp-comparison-2026";

// Exact slugs from the 2026-05-30 audit (scripts/dan-871-gdp-audit.ts).
// Static list — the DAN-520 dedup-gate prevents the cron from minting
// new variants, so the cluster is closed. Drift swept by re-running the
// audit script; new variants would be added here in a follow-up commit.
const GDP_DUPES = [
  "us-vs-china-gdp-comparison-2026-economic-leaders-face-off",
  "us-vs-china-gdp-comparison-2026-economic-powerhouses-face-off",
  "us-vs-china-gdp-comparison-2026-economic-outlook-and-growth-projections",
  "us-vs-china-gdp-comparison-2026-economic-power-growth-and-global-impact",
  "us-vs-china-gdp-comparison-2026-economic-growth-rankings-analysis",
  "us-vs-china-gdp-comparison-2026-latest-economic-data",
  "us-vs-china-gdp-comparison-2026-economic-powerhouses-head-to-head",
  "us-vs-china-gdp-comparison-2026-whos-leading-the-global-economy",
  "us-vs-china-gdp-comparison-2026-latest-economic-data-and-analysis",
  "us-vs-china-gdp-comparison-2026-which-economy-leads",
  "us-vs-china-gdp-2026-latest-economic-comparison-analysis",
  "us-vs-china-gdp-comparison-2026-who-has-the-larger-economy",
  "us-vs-china-gdp-comparison-2026-the-latest-economic-data",
  "us-vs-china-gdp-comparison-2026-economic-powers-face-off",
  "us-vs-china-gdp-comparison-2026-economic-powers-explained",
  "us-vs-china-gdp-comparison-2026-economic-power-showdown",
  "us-vs-china-gdp-comparison-2026-economic-power-in-the-modern-era",
  "us-vs-china-gdp-comparison-2026-whos-ahead",
  "us-vs-china-gdp-comparison-2026-latest-economic-data-analysis",
  "us-vs-china-gdp-2026-economic-power-comparison-projections",
  "us-vs-china-gdp-comparison-2026-economic-breakdown-and-outlook",
  "us-vs-china-gdp-comparison-2026-whos-really-ahead",
  "us-vs-china-gdp-comparison-2026-economic-powers-in-focus",
  "us-vs-china-gdp-comparison-2026-economic-superpowers-face-off",
  "us-vs-china-gdp-comparison-2026-nominal-vs-ppp-analysis",
  "us-vs-china-gdp-comparison-2026-economic-powers-ranked",
  "us-vs-china-gdp-comparison-2026-economic-superpowers-head-to-head",
  "us-vs-china-gdp-comparison-2026-latest-economic-figures",
  "us-vs-china-gdp-2026-economic-powerhouses-compared",
  "us-vs-china-gdp-comparison-2026-economic-powerhouses-ranked",
  "us-vs-china-gdp-comparison-2026-economic-power-face-off",
  "us-vs-china-gdp-comparison-2026-economic-power-and-projections",
  "us-vs-china-gdp-comparison-2026-economic-power-growth-outlook",
  "us-vs-china-gdp-comparison-2026-economic-outlook-key-metrics",
  "us-vs-china-gdp-comparison-2026-economic-power-and-growth-trends",
  "us-vs-china-nominal-gdp-2026-economic-comparison-projections",
  "us-vs-china-nominal-gdp-2026-economic-comparison-analysis",
  "us-vs-china-nominal-gdp-2026-who-has-the-larger-economy",
  "us-vs-china-nominal-gdp-2026-economic-comparison",
  "us-vs-china-nominal-gdp-2026-which-economy-is-larger",
  "us-vs-china-nominal-gdp-2026-economic-comparison-outlook",
  "us-vs-china-nominal-gdp-2026-latest-economic-comparison",
  "china-vs-usa-gdp-comparison-2026-economic-powerhouses-face-off",
  "china-vs-us-gdp-comparison-2026-economic-power-face-off",
];

const prisma = new PrismaClient();

async function main() {
  if (GDP_DUPES.length !== 44) {
    throw new Error(
      `GDP_DUPES expected 44 entries, got ${GDP_DUPES.length}`,
    );
  }

  const dupes = await prisma.blogArticle.findMany({
    where: {
      slug: { in: GDP_DUPES },
      status: { not: "archived" },
    },
    select: { id: true, slug: true, status: true },
  });

  console.log(
    `target cluster: ${GDP_DUPES.length} slugs; non-archived in DB: ${dupes.length}`,
  );

  if (dupes.length > 0) {
    const ids = dupes.map((d) => d.id);
    const result = await prisma.blogArticle.updateMany({
      where: { id: { in: ids } },
      data: { status: "archived" },
    });
    console.log(`archived: ${result.count}`);
  } else {
    console.log("nothing to archive (idempotent re-run).");
  }

  const publishedAfter = await prisma.blogArticle.count({
    where: { slug: { in: GDP_DUPES }, status: "published" },
  });
  console.log(`published GDP cluster slugs remaining: ${publishedAfter}`);
  console.log(`canonical: ${CANONICAL_VS_PATH}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
