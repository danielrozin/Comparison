// DAN-1026 weekly re-measure: pull fresh aversusb.net rankings, diff vs baseline,
// report the 21-50 -> 11-20 -> top-10 migration. Run weekly.
//   node scripts/dan1026-remeasure.mjs
import * as dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

const login = process.env.DATAFORSEO_LOGIN, password = process.env.DATAFORSEO_PASSWORD;
const auth = "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
const BASELINE = "./data/dan1026-baseline-2026-06-12.json";

async function pull() {
  const res = await fetch("https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live", {
    method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify([{ target: "aversusb.net", location_code: 2840, language_code: "en", limit: 1000,
      filters: [["ranked_serp_element.serp_item.rank_group", "<=", 50]],
      order_by: ["keyword_data.keyword_info.search_volume,desc"] }]),
  });
  const j = await res.json();
  const items = j.tasks?.[0]?.result?.[0]?.items || [];
  return items.map((it) => ({
    keyword: it.keyword_data?.keyword,
    volume: it.keyword_data?.keyword_info?.search_volume || 0,
    position: it.ranked_serp_element?.serp_item?.rank_group || 0,
    url: it.ranked_serp_element?.serp_item?.url || "",
  }));
}

const bucket = (p) => p <= 3 ? "1-3" : p <= 10 ? "4-10" : p <= 20 ? "11-20" : p <= 30 ? "21-30" : p <= 50 ? "31-50" : "50+";
const base = JSON.parse(readFileSync(new URL(BASELINE, import.meta.url)));
const baseMap = new Map(base.map((d) => [d.keyword, d.position]));

const now = await pull();
const counts = { top10: 0, p11_20: 0, p21_50: 0 };
const movers = [];
for (const d of now) {
  if (d.position <= 10) counts.top10++;
  else if (d.position <= 20) counts.p11_20++;
  else if (d.position <= 50) counts.p21_50++;
  const was = baseMap.get(d.keyword);
  if (was != null && was - d.position >= 3) movers.push({ keyword: d.keyword, was, now: d.position, vol: d.volume });
}
movers.sort((a, b) => (b.was - b.now) - (a.was - a.now));

console.log(`\n=== DAN-1026 RE-MEASURE (baseline 2026-06-12, n=${base.length}) ===`);
console.log(`Baseline: top10=0  11-20=10  21-50=307`);
console.log(`Current:  top10=${counts.top10}  11-20=${counts.p11_20}  21-50=${counts.p21_50}`);
console.log(`Target: 10+ keywords in top 10 within 30 days. Progress: ${counts.top10}/10`);
console.log(`\nTop improvers (>=3 positions gained vs baseline):`);
for (const m of movers.slice(0, 25)) console.log(`  +${String(m.was - m.now).padStart(2)}  ${String(m.was)}->${m.now}  vol=${m.vol}  "${m.keyword}"`);
if (!movers.length) console.log("  (none yet — allow 1-2 crawl cycles)");

writeFileSync(new URL("./data/dan1026-remeasure-latest.json", import.meta.url).pathname,
  JSON.stringify({ measuredBuckets: counts, movers, total: now.length }, null, 2));
