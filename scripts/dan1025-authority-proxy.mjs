// DAN-1025 Lever 3 — Authority-growth proxy tracker (fallback for the gated
// DataForSEO *Backlinks* add-on, approval ae06eef2). GSC's Search Analytics API
// does not expose referring domains and the Backlinks subscription is inactive,
// so we proxy authority growth with the one signal Labs DOES give us for free:
// the distribution of ranked keywords across SERP position buckets. As referring
// domains / authority accrue, parked keywords (21-50) should migrate up into
// page 2 (11-20) then page 1 (1-10). Run weekly; each run appends a dated
// snapshot so we can chart the migration over time.
//
// Usage:  node scripts/dan1025-authority-proxy.mjs
import * as dotenv from "dotenv";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
dotenv.config({ path: "/Users/danielrozin/Comparison/.env.local", override: true });

const DOMAIN = "aversusb.net";
const DFS_BASE = "https://api.dataforseo.com/v3";
const SNAP_DIR = "/Users/danielrozin/Comparison/docs/authority-proxy-snapshots";

function auth() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) throw new Error("DataForSEO credentials missing (.env.local)");
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

async function dfs(endpoint, body) {
  const res = await fetch(`${DFS_BASE}${endpoint}`, {
    method: "POST",
    headers: { Authorization: auth(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`DataForSEO HTTP ${res.status}`);
  return res.json();
}

// Pull the full ranked-keyword set (all keywords, not just %vs%) so the bucket
// distribution reflects the whole domain's authority footprint.
async function pullRanked() {
  const all = [];
  let offset = 0;
  const PAGE = 1000;
  for (let page = 0; page < 10; page++) {
    const data = await dfs("/dataforseo_labs/google/ranked_keywords/live", [{
      target: DOMAIN,
      location_code: 2840,
      language_code: "en",
      limit: PAGE,
      offset,
      order_by: ["ranked_serp_element.serp_item.rank_absolute,asc"],
    }]);
    const task = data.tasks?.[0];
    if (task?.status_code === 40200) {
      throw new Error("40200 Payment Required — DataForSEO balance exhausted (see DAN-695)");
    }
    const items = task?.result?.[0]?.items || [];
    all.push(...items);
    if (items.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

function rankOf(item) {
  // rank_group is the deduped Google position; fall back to rank_absolute.
  const el = item.ranked_serp_element?.serp_item;
  return el?.rank_group ?? el?.rank_absolute ?? null;
}

function bucketize(items) {
  const buckets = {
    "top3 (1-3)": 0,
    "rest_page1 (4-10)": 0,
    "page2 (11-20)": 0,
    "parked (21-50)": 0,
    "deep (51-100)": 0,
  };
  let withVolume = 0;
  let totalVolume = 0;
  for (const it of items) {
    const r = rankOf(it);
    if (r == null) continue;
    const vol = it.keyword_data?.keyword_info?.search_volume || 0;
    totalVolume += vol;
    if (vol > 0) withVolume++;
    if (r <= 3) buckets["top3 (1-3)"]++;
    else if (r <= 10) buckets["rest_page1 (4-10)"]++;
    else if (r <= 20) buckets["page2 (11-20)"]++;
    else if (r <= 50) buckets["parked (21-50)"]++;
    else buckets["deep (51-100)"]++;
  }
  return { buckets, totalRanked: items.length, withVolume, totalVolume };
}

function isoDate() {
  // Date.* is fine in node scripts (only blocked inside Workflow scripts).
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  console.log(`[dan1025] pulling ranked_keywords for ${DOMAIN} ...`);
  const items = await pullRanked();
  const { buckets, totalRanked, withVolume, totalVolume } = bucketize(items);

  const snapshot = {
    date: isoDate(),
    domain: DOMAIN,
    totalRanked,
    page1: buckets["top3 (1-3)"] + buckets["rest_page1 (4-10)"],
    buckets,
    keywordsWithVolume: withVolume,
    totalTrackedVolume: totalVolume,
    note: "Authority proxy: as referring domains accrue, expect parked(21-50) -> page2(11-20) -> page1 migration.",
  };

  if (!existsSync(SNAP_DIR)) mkdirSync(SNAP_DIR, { recursive: true });

  // Per-run dated file (immutable record)
  writeFileSync(`${SNAP_DIR}/${snapshot.date}.json`, JSON.stringify(snapshot, null, 2));

  // Append to the rolling history series for trend charting
  const hist = `${SNAP_DIR}/history.json`;
  const series = existsSync(hist) ? JSON.parse(readFileSync(hist, "utf8")) : [];
  const idx = series.findIndex((s) => s.date === snapshot.date);
  if (idx >= 0) series[idx] = snapshot;
  else series.push(snapshot);
  series.sort((a, b) => a.date.localeCompare(b.date));
  writeFileSync(hist, JSON.stringify(series, null, 2));

  console.log(`\n=== aversusb.net authority proxy — ${snapshot.date} ===`);
  console.log(`Total ranked keywords: ${totalRanked}  (with volume: ${withVolume})`);
  for (const [k, v] of Object.entries(buckets)) console.log(`  ${k.padEnd(20)} ${v}`);
  console.log(`Page-1 total (1-10):   ${snapshot.page1}`);
  if (series.length > 1) {
    const prev = series[series.length - 2];
    console.log(`\nΔ vs ${prev.date}:  page1 ${prev.page1} -> ${snapshot.page1} (${snapshot.page1 - prev.page1 >= 0 ? "+" : ""}${snapshot.page1 - prev.page1})`);
  }
  console.log(`\nSnapshot written: ${SNAP_DIR}/${snapshot.date}.json`);
}

main().catch((e) => { console.error("[dan1025] FAILED:", e.message); process.exit(1); });
