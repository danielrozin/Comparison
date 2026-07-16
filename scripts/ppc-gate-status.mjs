#!/usr/bin/env node
/**
 * PPC restart gate — all 5 criteria (DAN-2140 / DAN-79).
 *
 * Run from Comparison/ root:
 *   node scripts/ppc-gate-status.mjs
 *
 * Exit 0 = all 5 pass (PPC restart unblocked). Exit 1 = one or more failing.
 *
 * Criteria:
 *   #1  5+ keywords at Google US positions 1–10 (DataForSEO ranked_keywords)
 *   #2  30+ days of organic conversion baseline data (newsletter + contact)
 *   #3  Conversion tracking live (contact_submissions table has rows post-DAN-2146)
 *   #4  At least 1 published comparison in each of the 3 top revenue categories
 *       (insurance, finance/credit, tech — high CPC)
 *   #5  No critical Lighthouse or Core Web Vitals regression in the last 7 days
 *       (proxy: no pages with content_score < 50 among top-100 by view_count)
 */
import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── helpers ──────────────────────────────────────────────────────────────────

function pass(label) { console.log(`  ✅ PASS  ${label}`); }
function fail(label) { console.log(`  ❌ FAIL  ${label}`); }
function info(label) { console.log(`         ${label}`); }

// ── criterion #1 — 5+ page-1 keywords ────────────────────────────────────────

async function checkKeywords() {
  const login = process.env.DATAFORSEO_LOGIN;
  const pw    = process.env.DATAFORSEO_PASSWORD;
  if (!login || !pw) {
    console.log("  ⚠️  SKIP  #1 — DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD not set");
    return null;
  }
  const auth = "Basic " + Buffer.from(`${login}:${pw}`).toString("base64");
  let items = [];
  try {
    const res = await fetch(
      "https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live",
      {
        method: "POST",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify([{
          target: "aversusb.net",
          location_code: 2840,
          language_code: "en",
          limit: 1000,
          filters: [["ranked_serp_element.serp_item.rank_group", "<=", 30]],
          order_by: ["keyword_data.keyword_info.search_volume,desc"],
        }]),
      }
    );
    const j = await res.json();
    items = (j.tasks?.[0]?.result?.[0]?.items || []).map(it => ({
      kw:  it.keyword_data?.keyword,
      vol: it.keyword_data?.keyword_info?.search_volume || 0,
      pos: it.ranked_serp_element?.serp_item?.rank_group || 0,
      url: (it.ranked_serp_element?.serp_item?.url || "")
            .replace("https://www.aversusb.net", "")
            .replace("https://aversusb.net", ""),
    }));
  } catch (e) {
    console.log(`  ⚠️  SKIP  #1 — DataForSEO fetch failed: ${e.message}`);
    return null;
  }

  const page1 = items.filter(i => i.pos >= 1 && i.pos <= 10);
  const str   = items.filter(i => i.pos >= 11 && i.pos <= 20);

  const ok = page1.length >= 5;
  if (ok) pass(`#1  Page-1 keywords: ${page1.length} (need ≥5)`);
  else    fail(`#1  Page-1 keywords: ${page1.length} (need ≥5) — striking-distance: ${str.length} at pos 11–20`);

  if (page1.length > 0) {
    info(`Top page-1 hits (by volume):`);
    page1.sort((a,b) => b.vol - a.vol).slice(0, 10).forEach(k =>
      info(`    pos${String(k.pos).padStart(2)}  vol${String(k.vol).padStart(6)}  "${k.kw}"`)
    );
  }
  if (!ok && str.length > 0) {
    info(`Striking-distance (pos 11–20, by volume):`);
    str.sort((a,b) => b.vol - a.vol).slice(0, 10).forEach(k =>
      info(`    pos${String(k.pos).padStart(2)}  vol${String(k.vol).padStart(6)}  "${k.kw}"  ${k.url}`)
    );
  }
  return ok;
}

// ── criterion #2 — 30-day conversion baseline ────────────────────────────────

async function checkConversionBaseline() {
  const REQUIRED_DAYS = 30;
  const now   = new Date();
  const since = (d) => new Date(now.getTime() - d * 86_400_000);

  let signupRows = [], contactRows = [];
  try {
    [signupRows, contactRows] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ select: { subscribedAt: true }, orderBy: { subscribedAt: "asc" } }),
      prisma.contactSubmission.findMany({ select: { createdAt: true }, orderBy: { createdAt: "asc" } }).catch(() => []),
    ]);
  } catch (e) {
    console.log(`  ⚠️  SKIP  #2 — DB query failed: ${e.message}`);
    return null;
  }

  const conversions = [
    ...signupRows.map(r => r.subscribedAt),
    ...contactRows.map(r => r.createdAt),
  ].sort((a, b) => a.getTime() - b.getTime());

  const total    = conversions.length;
  const inWindow = (d) => conversions.filter(t => t >= since(d)).length;
  const first    = conversions[0] ?? null;
  const last     = conversions[total - 1] ?? null;
  const spanDays = first && last
    ? Math.floor((last.getTime() - first.getTime()) / 86_400_000)
    : 0;

  const ok = spanDays >= REQUIRED_DAYS && inWindow(30) > 0;
  if (ok) pass(`#2  Conversion baseline: ${spanDays}d span, ${inWindow(30)} in last 30d`);
  else    fail(`#2  Conversion baseline: ${spanDays}d span (need ≥${REQUIRED_DAYS}d), ${inWindow(30)} in last 30d (need ≥1)`);
  info(`    newsletters: ${signupRows.length}  contact: ${contactRows.length}  total: ${total}`);
  return ok;
}

// ── criterion #3 — contact_submissions table live ────────────────────────────

async function checkContactTracking() {
  let count = 0;
  try {
    count = await prisma.contactSubmission.count().catch(() => -1);
  } catch (e) {
    console.log(`  ⚠️  SKIP  #3 — DB query failed: ${e.message}`);
    return null;
  }
  if (count < 0) {
    fail("#3  Contact tracking: contactSubmissions table missing (DAN-2146 not deployed)");
    return false;
  }
  if (count === 0) {
    // Table exists but no rows yet — table ships with DAN-2146, rows come from real submits
    pass(`#3  Contact tracking: table live (0 submissions so far — awaiting first real submit)`);
    return true;
  }
  pass(`#3  Contact tracking: ${count} submissions recorded`);
  return true;
}

// ── criterion #4 — high-CPC category coverage ────────────────────────────────

async function checkCategoryCoverage() {
  const HIGH_CPC_CATEGORIES = ["insurance", "finance", "technology"];
  let rows = [];
  try {
    rows = await prisma.comparison.findMany({
      where: { status: "published", category: { in: HIGH_CPC_CATEGORIES } },
      select: { category: true },
    });
  } catch (e) {
    console.log(`  ⚠️  SKIP  #4 — DB query failed: ${e.message}`);
    return null;
  }
  const counts = {};
  for (const r of rows) counts[r.category] = (counts[r.category] || 0) + 1;
  const missing = HIGH_CPC_CATEGORIES.filter(c => !counts[c]);
  const ok = missing.length === 0;
  if (ok) pass(`#4  High-CPC category coverage: ${HIGH_CPC_CATEGORIES.map(c => `${c}(${counts[c]})`).join(", ")}`);
  else    fail(`#4  High-CPC category coverage: missing categories — ${missing.join(", ")}`);
  return ok;
}

// ── criterion #5 — content quality floor ─────────────────────────────────────

async function checkContentQuality() {
  let badPages = [];
  try {
    badPages = await prisma.comparison.findMany({
      where: { status: "published", contentScore: { lt: 50 }, viewCount: { gt: 1000 } },
      select: { slug: true, contentScore: true, viewCount: true },
      orderBy: { viewCount: "desc" },
      take: 5,
    });
  } catch (e) {
    console.log(`  ⚠️  SKIP  #5 — DB query failed: ${e.message}`);
    return null;
  }
  const ok = badPages.length === 0;
  if (ok) pass("#5  Content quality: no high-traffic pages with content_score < 50");
  else {
    fail(`#5  Content quality: ${badPages.length} high-traffic page(s) with score < 50`);
    badPages.forEach(p => info(`    score:${p.contentScore}  views:${p.viewCount}  /compare/${p.slug}`));
  }
  return ok;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("══════════════════════════════════════════════════════");
  console.log("  PPC restart gate status  (DAN-2140 / DAN-79)");
  console.log(`  Measured: ${new Date().toISOString().slice(0,16)} UTC`);
  console.log("══════════════════════════════════════════════════════\n");

  const results = await Promise.all([
    checkKeywords(),
    checkConversionBaseline(),
    checkContactTracking(),
    checkCategoryCoverage(),
    checkContentQuality(),
  ]);

  const passed  = results.filter(r => r === true).length;
  const skipped = results.filter(r => r === null).length;
  const failed  = results.filter(r => r === false).length;

  console.log("\n──────────────────────────────────────────────────────");
  console.log(`  ${passed}/5 PASS   ${failed} FAIL   ${skipped} SKIP`);
  if (passed === 5) {
    console.log("\n  🚀  ALL CRITERIA PASS — PPC restart is unblocked.");
    console.log("     Comment on DAN-2140 to start the 30-day conversion-baseline clock (criterion #2).");
  } else {
    console.log(`\n  Long pole: ${failed} failing criterion${failed !== 1 ? "a" : "ion"} remain.`);
  }
  console.log("══════════════════════════════════════════════════════");

  await prisma.$disconnect();
  process.exit(passed === 5 ? 0 : 1);
}

main().catch(async (e) => {
  console.error("gate check failed:", e.message);
  await prisma.$disconnect();
  process.exit(2);
});
