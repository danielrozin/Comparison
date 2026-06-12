import * as dotenv from "dotenv";
import { writeFileSync } from "fs";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

const login = process.env.DATAFORSEO_LOGIN;
const password = process.env.DATAFORSEO_PASSWORD;
if (!login || !password) throw new Error("Missing DataForSEO creds");
const auth = "Basic " + Buffer.from(`${login}:${password}`).toString("base64");

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
        filters: [["ranked_serp_element.serp_item.rank_group", "<=", 50]],
        order_by: ["keyword_data.keyword_info.search_volume,desc"],
      }]),
    });
    const json = await res.json();
    const task = json.tasks?.[0];
    if (task?.status_code !== 20000) {
      console.error("API status:", task?.status_code, task?.status_message);
      console.error("cost:", json.cost, "| balance note: check dashboard");
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
        absPosition: it.ranked_serp_element?.serp_item?.rank_absolute || 0,
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

const data = await rankedKeywords("aversusb.net");
data.sort((a, b) => b.volume - a.volume);
const outPath = new URL("../scripts/data/dan1026-rankings.json", import.meta.url).pathname;
writeFileSync(outPath, JSON.stringify(data, null, 2));

const bucket = (p) => p <= 3 ? "1-3" : p <= 10 ? "4-10" : p <= 20 ? "11-20" : p <= 30 ? "21-30" : p <= 50 ? "31-50" : "50+";
const counts = {};
for (const d of data) counts[bucket(d.position)] = (counts[bucket(d.position)] || 0) + 1;
console.error("\n=== TOTAL ranked (<=50):", data.length, "===");
console.error("Position buckets:", JSON.stringify(counts));

const striking = data.filter((d) => d.position >= 11 && d.position <= 30).sort((a, b) => b.volume - a.volume);
console.error(`\n=== STRIKING DISTANCE (pos 11-30): ${striking.length} keywords ===`);
console.error("Top 40 by volume:");
for (const d of striking.slice(0, 40)) {
  console.error(`  vol=${String(d.volume).padStart(6)} pos=${String(d.position).padStart(2)} kd=${d.difficulty ?? "-"}  ${d.keyword}  ->  ${d.url.replace("https://aversusb.net", "")}`);
}
