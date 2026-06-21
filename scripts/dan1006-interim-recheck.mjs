// DAN-1006 3-page push-cluster position re-check (interim/final).
// Ship date 2026-06-12; final measure gated ~2026-07-03 (T+21). This harness is
// safe to run any time — it labels itself interim (<T+18) vs final and pulls
// current DataForSEO rank for the 3 head keywords, plus an HTTP liveness probe.
//   node scripts/dan1006-interim-recheck.mjs
import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });

const login = process.env.DATAFORSEO_LOGIN, password = process.env.DATAFORSEO_PASSWORD;
const auth = "Basic " + Buffer.from(`${login}:${password}`).toString("base64");

// Baselines from DAN-706 pull 2026-06-11 (US, location 2840).
const TARGETS = [
  { page: "/compare/ikea-vs-wayfair",      kw: "wayfair vs ikea reddit",            base: 15, vol: 50 },
  { page: "/compare/capital-one-vs-chase", kw: "are chase and capital one affiliated", base: 17, vol: 40 },
  { page: "/compare/amazon-vs-best-buy",   kw: "best buy vs amazon",                base: 20, vol: 110 },
];

async function pull() {
  const res = await fetch("https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live", {
    method: "POST", headers: { Authorization: auth, "Content-Type": "application/json" },
    body: JSON.stringify([{ target: "aversusb.net", location_code: 2840, language_code: "en", limit: 1000,
      order_by: ["keyword_data.keyword_info.search_volume,desc"] }]),
  });
  const j = await res.json();
  if (j.status_code !== 20000) throw new Error(`DataForSEO ${j.status_code}: ${j.status_message}`);
  const items = j.tasks?.[0]?.result?.[0]?.items || [];
  return items.map((it) => ({
    keyword: (it.keyword_data?.keyword || "").toLowerCase(),
    volume: it.keyword_data?.keyword_info?.search_volume || 0,
    position: it.ranked_serp_element?.serp_item?.rank_group || 0,
    url: it.ranked_serp_element?.serp_item?.url || "",
  }));
}

async function probe(path) {
  try {
    const r = await fetch(`https://aversusb.net${path}`, { redirect: "manual" });
    return r.status;
  } catch (e) { return `ERR ${e.message}`; }
}

const today = new Date().toISOString().slice(0, 10);
const tPlus = Math.round((Date.parse(today) - Date.parse("2026-06-12")) / 86400000);
const phase = tPlus >= 18 ? "FINAL" : "INTERIM";

const now = await pull();
const map = new Map();
for (const d of now) if (!map.has(d.keyword)) map.set(d.keyword, d);

console.log(`\n=== DAN-1006 3-page push cluster — ${phase} re-check  ${today} (T+${tPlus} from ship 2026-06-12) ===`);
console.log(`Universe: ${now.length} ranked keywords pulled for aversusb.net (US).`);
console.log(`\n| Page | Head keyword | Base | Now | Δ | Live |`);
console.log(`|---|---|--:|--:|--:|--:|`);
for (const t of TARGETS) {
  const hit = map.get(t.kw.toLowerCase());
  const pos = hit ? hit.position : null;
  const live = await probe(t.page);
  const delta = pos != null ? (t.base - pos >= 0 ? `+${t.base - pos}` : `${t.base - pos}`) : "n/r";
  const flag = pos != null && pos <= 10 ? " ✅top-10" : "";
  console.log(`| ${t.page} | "${t.kw}" | ${t.base} | ${pos ?? "not ranked"} | ${delta}${flag} | ${live} |`);
}
console.log(`\nNote: ${phase === "INTERIM" ? "Interim datapoint — Google re-crawl/re-rank window is 2–3 wks; final win/loss call gated ~2026-07-03 (T+21)." : "Final measurement window reached — page-1 (≤10) = win."}`);
