/**
 * DAN-2176 — weekly /compare/* spam-recovery tracker.
 *
 * Re-pulls GSC /compare/* impressions per ISO week (Mon–Sun) and compares them
 * against the DAN-1799 W27 collapse baseline. Run every Tuesday; paste the
 * printed table into DAN-1800 / DAN-1799.
 *
 * Baseline + method: docs/DAN-1800-thin-page-audit.md
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_KEY (GSC read). Pull it with:
 *   npx vercel link --yes && npx vercel env pull .env.local --environment production --yes
 * NOTE: `vercel env pull` writes the key wrapped in double quotes with unescaped
 * inner quotes, so dotenv truncates it at the first inner `"`. This script
 * unwraps that quoting itself — do not "fix" it by editing .env.local by hand.
 * Delete .env.local and .vercel when done.
 *
 * Usage: npx tsx scripts/dan2176-weekly-compare-trend.ts [--weeks N]
 */

import * as fs from "fs";
import * as path from "path";

/** Read GOOGLE_SERVICE_ACCOUNT_KEY from .env.local, undoing vercel's quote wrapping. */
function loadServiceAccountKey(): void {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return;
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) return;
  const m = /^GOOGLE_SERVICE_ACCOUNT_KEY=(.*)$/m.exec(fs.readFileSync(envPath, "utf8"));
  if (!m) return;
  let v = m[1];
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY = v;
}

// W26 (Jun 22–28) — the last complete pre-collapse week, per DAN-1799.
const BASELINE_WEEK_START = "2026-06-22";

async function main() {
  loadServiceAccountKey();
  const args = process.argv.slice(2);
  const wi = args.indexOf("--weeks");
  const weeks = wi !== -1 ? parseInt(args[wi + 1], 10) : 12;

  const { getGSCCompareWeekly } = await import("../src/lib/services/gsc-service");
  const report = await getGSCCompareWeekly(weeks, 50);

  if (!report.available || report.weeks.length === 0) {
    console.error("No GSC data — credentials missing or empty window.");
    console.error(report.note);
    process.exit(1);
  }

  const baseline = report.weeks.find((w) => w.weekStart === BASELINE_WEEK_START);
  const pct = (v: number) =>
    baseline && baseline.impressions > 0
      ? `${(((v - baseline.impressions) / baseline.impressions) * 100).toFixed(1)}%`
      : "n/a";

  console.log(`=== DAN-2176 weekly /compare/* impressions (baseline W26 ${BASELINE_WEEK_START}) ===\n`);
  console.log("week_start  | complete | impressions | vs baseline | clicks | pages");
  console.log("------------|----------|-------------|-------------|--------|------");
  for (const w of report.weeks) {
    console.log(
      `${w.weekStart}  | ${String(w.complete).padEnd(8)} | ${String(w.impressions).padStart(11)} | ` +
        `${pct(w.impressions).padStart(11)} | ${String(w.clicks).padStart(6)} | ${String(w.pages).padStart(5)}`
    );
  }

  const complete = report.weeks.filter((w) => w.complete);
  const latest = complete[complete.length - 1];
  const prior = complete[complete.length - 2];
  console.log("");
  if (latest && prior) {
    const wow =
      prior.impressions > 0
        ? `${(((latest.impressions - prior.impressions) / prior.impressions) * 100).toFixed(1)}%`
        : "n/a";
    console.log(`Latest complete week : ${latest.weekStart} — ${latest.impressions} impressions (WoW ${wow})`);
    console.log(`Verdict              : ${latest.impressions > (baseline?.impressions ?? 0) * 0.25 ? "REVERSAL SIGNAL — check for a sustained multi-week climb" : "STILL SUPPRESSED — no reversal; continue weekly tracking"}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
