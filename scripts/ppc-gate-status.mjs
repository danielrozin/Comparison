#!/usr/bin/env node
/**
 * PPC restart gate — full status check (DAN-2140 gates DAN-79).
 *
 * PPC is paused per CMO decision (Jul 14, 2026). DAN-2140 lists five conditions
 * that must all hold before DAN-79 (Google Ads / Meta / Taboola) may re-activate.
 * Those conditions lived only as prose on the issue, so every heartbeat re-argued
 * them from memory. This script answers all five from real data instead.
 *
 * Exit code 0 only when every criterion PASSes. Anything else is a hold.
 *
 * Usage:
 *   DATABASE_URL=... node scripts/ppc-gate-status.mjs
 *   node scripts/ppc-gate-status.mjs --json
 *
 * Criteria 1/2/3/5 are agent-checkable. Criterion 4 (budget re-confirmation) is a
 * CMO+CEO decision and is reported as PENDING until DAN-2140 records it.
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname });

const DOMAIN = "aversusb.net";
const PAGE_ONE_KEYWORDS_REQUIRED = 5;
const BASELINE_DAYS_REQUIRED = 30;
const DOMAIN_STABLE_DAYS_REQUIRED = 60;

// aversusb.net went live on this date. Criterion #5 measures uptime-without-migration
// from here; update only if the site actually moves domains.
const DOMAIN_LIVE_SINCE = new Date("2026-01-27T00:00:00Z");

// Seed/QA rows must never anchor the baseline — see ppc-conversion-baseline.mjs.
const TEST_SOURCE = /test|seed|qa|dummy|sample/i;

const jsonOut = process.argv.includes("--json");
const days = (ms) => Math.floor(ms / 86_400_000);

/** Criterion #1 — GSC/SERP shows PAGE_ONE_KEYWORDS_REQUIRED+ page-1 keywords. */
async function checkPageOneKeywords() {
  const login = process.env.DATAFORSEO_LOGIN;
  const pw = process.env.DATAFORSEO_PASSWORD;
  if (!login || !pw) {
    return { pass: false, unknown: true, detail: "DATAFORSEO_LOGIN/PASSWORD not set — cannot measure" };
  }

  const auth = "Basic " + Buffer.from(`${login}:${pw}`).toString("base64");
  const res = await fetch("https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live", {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        target: DOMAIN,
        location_code: 2840,
        language_code: "en",
        limit: 1000,
        filters: [["ranked_serp_element.serp_item.rank_group", "<=", 20]],
        order_by: ["ranked_serp_element.serp_item.rank_group,asc"],
      },
    ]),
  });
  const body = await res.json();
  if (body.status_code !== 20000) {
    return { pass: false, unknown: true, detail: `DataForSEO error ${body.status_code}: ${body.status_message}` };
  }

  const items = (body.tasks?.[0]?.result?.[0]?.items || []).map((it) => ({
    keyword: it.keyword_data?.keyword,
    volume: it.keyword_data?.keyword_info?.search_volume || 0,
    position: it.ranked_serp_element?.serp_item?.rank_group || 0,
    url: (it.ranked_serp_element?.serp_item?.url || "").replace(/^https:\/\/(www\.)?aversusb\.net/, ""),
  }));

  const pageOne = items.filter((i) => i.position >= 1 && i.position <= 10);
  const striking = items.filter((i) => i.position >= 11 && i.position <= 20);

  return {
    pass: pageOne.length >= PAGE_ONE_KEYWORDS_REQUIRED,
    detail: `${pageOne.length} page-1 keyword(s), need >=${PAGE_ONE_KEYWORDS_REQUIRED} (${striking.length} more in striking distance at 11-20)`,
    pageOne,
    striking,
  };
}

/** Criterion #2 — 30d organic conversion baseline, measured after #1 clears. */
async function checkConversionBaseline(pageOnePassed) {
  if (!process.env.DATABASE_URL) {
    return { pass: false, unknown: true, detail: "DATABASE_URL not set — cannot count conversions" };
  }

  const prisma = new PrismaClient();
  try {
    const [signups, contacts] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ select: { subscribedAt: true, source: true } }),
      prisma.contactSubmission.findMany({ select: { createdAt: true, source: true } }),
    ]);

    const rows = [
      ...signups.map((r) => ({ at: r.subscribedAt, source: r.source || "unknown" })),
      ...contacts.map((r) => ({ at: r.createdAt, source: r.source || "unknown" })),
    ]
      .filter((r) => !TEST_SOURCE.test(r.source))
      .sort((a, b) => a.at - b.at);

    const now = Date.now();
    const last30 = rows.filter((r) => now - r.at.getTime() <= 30 * 86_400_000).length;
    const span = rows.length ? days(rows[rows.length - 1].at - rows[0].at) : 0;
    const pass = span >= BASELINE_DAYS_REQUIRED && last30 > 0;

    // The clock only means anything once organic traffic is actually landing.
    const detail = pageOnePassed
      ? `${rows.length} real conversion(s), ${last30} in last 30d, ${span}d span (need >=${BASELINE_DAYS_REQUIRED}d)`
      : `not started — criterion #1 must clear first (currently ${rows.length} conversion(s), ${span}d span)`;

    return { pass: pass && pageOnePassed, detail, total: rows.length, last30, span };
  } finally {
    await prisma.$disconnect();
  }
}

/** Criterion #3 — contact-form submissions persisted server-side (DAN-2146). */
function checkContactPersistence() {
  const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
  const hasModel = /model\s+ContactSubmission\s*\{/.test(schema);

  let hasRoute = true;
  try {
    readFileSync(new URL("../src/app/api/contact/route.ts", import.meta.url), "utf8");
  } catch {
    hasRoute = false;
  }

  return {
    pass: hasModel && hasRoute,
    detail: hasModel && hasRoute
      ? "ContactSubmission model + /api/contact route both present (DAN-2146 shipped)"
      : `missing: ${[!hasModel && "ContactSubmission model", !hasRoute && "/api/contact route"].filter(Boolean).join(", ")}`,
  };
}

/** Criterion #4 — CMO+CEO re-confirm the $2K/mo budget. Not agent-decidable. */
function checkBudgetReview() {
  return {
    pass: false,
    manual: true,
    detail: "CMO + CEO must re-confirm $2K/mo PPC budget on DAN-2140 (no agent can self-approve spend)",
  };
}

/** Criterion #5 — domain stable 60+ days and currently serving. */
async function checkDomainStability() {
  const age = days(Date.now() - DOMAIN_LIVE_SINCE.getTime());
  let live = false;
  let status = "unreachable";
  try {
    const res = await fetch(`https://www.${DOMAIN}/`, { method: "HEAD", redirect: "follow" });
    live = res.ok;
    status = String(res.status);
  } catch (e) {
    status = e.message;
  }

  return {
    pass: age >= DOMAIN_STABLE_DAYS_REQUIRED && live,
    detail: `${age}d on ${DOMAIN} (need >=${DOMAIN_STABLE_DAYS_REQUIRED}d), homepage HTTP ${status}`,
  };
}

async function main() {
  const c1 = await checkPageOneKeywords();
  const [c2, c5] = await Promise.all([checkConversionBaseline(c1.pass), checkDomainStability()]);
  const c3 = checkContactPersistence();
  const c4 = checkBudgetReview();

  const criteria = [
    { n: 1, name: "GSC shows 5+ page-1 keywords", ...c1 },
    { n: 2, name: "30d organic conversion baseline", ...c2 },
    { n: 3, name: "Contact-form submissions persisted server-side", ...c3 },
    { n: 4, name: "Q4 2026 budget review", ...c4 },
    { n: 5, name: "Domain stability confirmed", ...c5 },
  ];

  const gateOpen = criteria.every((c) => c.pass);

  if (jsonOut) {
    console.log(JSON.stringify({ gateOpen, checkedAt: new Date().toISOString(), criteria }, null, 2));
  } else {
    console.log("=== PPC restart gate (DAN-2140) — blocks DAN-79 ===\n");
    for (const c of criteria) {
      const label = c.pass ? "PASS" : c.manual ? "PENDING (human)" : c.unknown ? "UNKNOWN" : "FAIL";
      console.log(`[${label}] #${c.n} ${c.name}`);
      console.log(`         ${c.detail}\n`);
    }
    if (c1.pageOne?.length) {
      console.log("Page-1 keywords:");
      for (const k of c1.pageOne) {
        console.log(`  pos ${String(k.position).padStart(2)}  vol ${String(k.volume).padStart(5)}  "${k.keyword}" -> ${k.url}`);
      }
      console.log();
    }
    console.log(`GATE: ${gateOpen ? "OPEN — DAN-79 may re-activate" : "CLOSED — DAN-79 stays blocked"}`);
    if (!gateOpen) {
      const blockers = criteria.filter((c) => !c.pass).map((c) => `#${c.n}`).join(", ");
      console.log(`Outstanding criteria: ${blockers}`);
    }
  }

  process.exit(gateOpen ? 0 : 1);
}

main().catch((e) => {
  console.error("gate check failed:", e.message);
  process.exit(2);
});
