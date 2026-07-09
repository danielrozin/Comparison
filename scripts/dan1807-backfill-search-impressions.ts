/**
 * DAN-1807 — backfill comparisons.searchImpressions from GSC per-page data.
 *
 * `comparisons.searchImpressions` ships as 0 for every row, so the DAN-1800
 * thin-page audit cannot rank the zero-traffic long tail by real demand. This
 * one-shot script runs the same sync the weekly compare-gate cron runs
 * (syncCompareSearchImpressions), joining GSC /compare/* impressions to rows by
 * slug and writing the observed totals.
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_KEY (GSC read) + DATABASE_URL (write) in the
 * environment. No-ops gracefully if GSC creds are missing.
 *
 * Usage: npx tsx scripts/dan1807-backfill-search-impressions.ts [--days N]
 */

import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { syncCompareSearchImpressions } from "../src/lib/services/gsc-service";

async function main() {
  const args = process.argv.slice(2);
  const daysArg = args.indexOf("--days");
  const days = daysArg !== -1 ? parseInt(args[daysArg + 1], 10) : 90;

  console.log(`=== DAN-1807 searchImpressions backfill (window: ${days}d) ===`);
  const res = await syncCompareSearchImpressions(days);

  if (!res.available) {
    console.log(
      "No GSC /compare/* impressions returned — GSC credentials missing or no data in window."
    );
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  }

  console.log(`GSC pages with impressions : ${res.pagesWithImpressions}`);
  console.log(`Total impressions (window) : ${res.totalImpressions}`);
  console.log(`DB rows matched & updated  : ${res.matched}/${res.attempted}`);
  console.log(
    res.skipped
      ? "DB unavailable — no rows written."
      : "Done. Re-run scripts/dan1800-thin-page-audit.ts to refresh demand buckets."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
