/**
 * DAN-1030: Build the explicit allow-list of already-ranking /compare/ slugs to
 * pin the refresh pipeline (refreshStaleComparisons / getComparisonsForRefresh
 * `onlySlugs`).
 *
 * Pulls the full ranked-keywords footprint for aversusb.net (rank_group <= 100 —
 * i.e. every keyword where a page appears on Google pages 1–10), aggregates to
 * unique /compare/ slugs, and emits:
 *   - scripts/data/dan1030-ranking-slugs.json   (JSON array of slugs)
 *   - scripts/data/dan1030-ranking-slugs.csv    (slug,bestPosition,impressions,topKeyword,topVolume)
 *
 * "impressions" here is a GSC-style proxy: sum over the page's ranking keywords
 * of search_volume scaled by a position-based CTR curve. It is a stand-in for
 * real GSC impressions and is only used to rank/pin, never as ground truth.
 */
import * as dotenv from "dotenv";
import { writeFileSync } from "fs";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

const login = process.env.DATAFORSEO_LOGIN;
const password = process.env.DATAFORSEO_PASSWORD;
if (!login && !process.env.DATAFORSEO_BASE64) throw new Error("Missing DataForSEO creds");
const auth = "Basic " + (process.env.DATAFORSEO_BASE64 || Buffer.from(`${login}:${password}`).toString("base64"));

// Position-based CTR curve (approx organic CTR by rank). Beyond 20 ~ flat tail.
function ctr(pos) {
  const table = { 1: 0.27, 2: 0.16, 3: 0.11, 4: 0.08, 5: 0.06, 6: 0.045, 7: 0.035, 8: 0.028, 9: 0.022, 10: 0.018 };
  if (table[pos]) return table[pos];
  if (pos <= 20) return 0.012;
  if (pos <= 50) return 0.005;
  return 0.002;
}

async function rankedKeywords(target) {
  const all = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const res = await fetch("https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live", {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify([{
        target,
        location_code: 2840,
        language_code: "en",
        limit,
        offset,
        filters: [["ranked_serp_element.serp_item.rank_group", "<=", 100]],
        order_by: ["keyword_data.keyword_info.search_volume,desc"],
      }]),
    });
    const json = await res.json();
    const task = json.tasks?.[0];
    if (task?.status_code !== 20000) {
      console.error("API status:", task?.status_code, task?.status_message);
      break;
    }
    const result = task.result?.[0];
    const items = result?.items || [];
    for (const it of items) {
      all.push({
        keyword: it.keyword_data?.keyword,
        volume: it.keyword_data?.keyword_info?.search_volume || 0,
        cpc: it.keyword_data?.keyword_info?.cpc || 0,
        difficulty: it.keyword_data?.keyword_properties?.keyword_difficulty ?? null,
        position: it.ranked_serp_element?.serp_item?.rank_group || 0,
        url: it.ranked_serp_element?.serp_item?.url || "",
        etv: it.ranked_serp_element?.serp_item?.etv || 0,
      });
    }
    console.error(`fetched ${items.length} (offset ${offset}), total_count=${result?.total_count}, cost=${json.cost}`);
    offset += limit;
    if (items.length < limit || offset >= (result?.total_count || 0)) break;
  }
  return all;
}

const rows = await rankedKeywords("aversusb.net");

// Aggregate to /compare/ slugs.
const bySlug = new Map();
for (const r of rows) {
  if (!r.url || !r.url.includes("/compare/")) continue;
  const slug = r.url.split("/compare/")[1].replace(/[/#?].*$/, "").replace(/\/$/, "");
  if (!slug) continue;
  if (!bySlug.has(slug)) bySlug.set(slug, { slug, bestPosition: 999, impressions: 0, kwCount: 0, topKeyword: "", topVolume: 0 });
  const agg = bySlug.get(slug);
  agg.kwCount += 1;
  agg.impressions += Math.round(r.volume * ctr(r.position));
  if (r.position < agg.bestPosition) agg.bestPosition = r.position;
  if (r.volume > agg.topVolume) { agg.topVolume = r.volume; agg.topKeyword = r.keyword; }
}

const slugs = [...bySlug.values()].sort((a, b) => b.impressions - a.impressions || a.bestPosition - b.bestPosition);

const jsonPath = new URL("../scripts/data/dan1030-ranking-slugs.json", import.meta.url).pathname;
const csvPath = new URL("../scripts/data/dan1030-ranking-slugs.csv", import.meta.url).pathname;
writeFileSync(jsonPath, JSON.stringify(slugs.map((s) => s.slug), null, 2));

const csv = ["slug,bestPosition,impressions,topKeyword,topVolume"];
for (const s of slugs) {
  const kw = (s.topKeyword || "").replace(/"/g, '""');
  csv.push(`${s.slug},${s.bestPosition},${s.impressions},"${kw}",${s.topVolume}`);
}
writeFileSync(csvPath, csv.join("\n"));

// Position buckets for context.
const bucket = (p) => (p <= 3 ? "1-3" : p <= 10 ? "4-10" : p <= 20 ? "11-20" : p <= 50 ? "21-50" : "51-100");
const counts = {};
for (const s of slugs) counts[bucket(s.bestPosition)] = (counts[bucket(s.bestPosition)] || 0) + 1;

console.error(`\n=== compare keyword-rows: ${rows.filter((r) => r.url.includes("/compare/")).length} ===`);
console.error(`=== UNIQUE ranking /compare/ slugs: ${slugs.length} ===`);
console.error("Best-position buckets:", JSON.stringify(counts));
console.error("Top 15 by impressions proxy:");
for (const s of slugs.slice(0, 15)) {
  console.error(`  imp=${String(s.impressions).padStart(5)} pos=${String(s.bestPosition).padStart(2)} kw=${s.kwCount}  ${s.slug}`);
}
console.error(`\nWrote ${jsonPath}`);
console.error(`Wrote ${csvPath}`);
