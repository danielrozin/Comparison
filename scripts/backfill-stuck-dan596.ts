/**
 * One-shot backfill script for the 5 stuck slugs identified in the
 * HB19 audit (DAN-596). Hits the admin generations endpoint with the
 * CRON_SECRET so it doesn't need an admin JWT.
 *
 * Usage:
 *   tsx scripts/backfill-stuck-dan596.ts
 *
 * Required env:
 *   BACKFILL_BASE_URL  e.g. https://aversusb.net or http://localhost:3000
 *   CRON_SECRET        same secret used by Vercel crons
 *
 * Optional:
 *   BACKFILL_SKIP_ENRICHMENT=1  bypass Tavily for these slugs (use if
 *                                Tavily is the chronic upstream
 *                                culprit on retries)
 */

const STUCK_SLUGS = [
  "cursor-vs-copilot",
  "m4-pro-vs-m4-max",
  "apple-vision-pro-vs-meta-quest-3",
  "cursor-vs-claude-code",
  "windsurf-vs-cursor",
];

async function main() {
  const base = process.env.BACKFILL_BASE_URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) {
    console.error("BACKFILL_BASE_URL and CRON_SECRET are required");
    process.exit(1);
  }

  const skipEnrichment = process.env.BACKFILL_SKIP_ENRICHMENT === "1";

  const url = `${base.replace(/\/$/, "")}/api/admin/generations`;
  console.log(`Backfilling ${STUCK_SLUGS.length} stuck slugs against ${url}`);
  console.log(`skipEnrichment=${skipEnrichment}`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ slugs: STUCK_SLUGS, skipEnrichment, force: true }),
  });

  const body = await res.text();
  console.log(`HTTP ${res.status}`);
  console.log(body);

  if (!res.ok) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
