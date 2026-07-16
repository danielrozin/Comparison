/**
 * Query GSC Search Analytics for our 22 striking-distance targets.
 * Gives up-to-date positions (daily GSC data vs weekly DataForSEO lag).
 */
import { GoogleAuth } from "google-auth-library";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
const SITE = "sc-domain:aversusb.net";

// Target keywords from DAN-2160 issue (matched by page)
const TARGETS = [
  { keyword: "ww1 vs ww2",                           page: "/compare/ww1-vs-ww2",                                    dfsPos: 20, vol: 2900 },
  { keyword: "macbook pro vs air 2026",              page: "/compare/macbook-air-vs-macbook-pro-difference-2026-specs", dfsPos: 19, vol: 140 },
  { keyword: "best buy vs amazon",                   page: "/compare/amazon-vs-best-buy",                            dfsPos: 18, vol: 110 },
  { keyword: "farmers vs state farm home insurance", page: "/compare/farmers-insurance-vs-state-farm",               dfsPos: 19, vol: 110 },
  { keyword: "expedia or kayak",                     page: "/compare/expedia-vs-kayak",                              dfsPos: 16, vol: 50 },
  { keyword: "are chase and capital one affiliated", page: "/compare/capital-one-vs-chase",                          dfsPos: 13, vol: 40 },
  { keyword: "wayfair vs ikea reddit",               page: "/compare/ikea-vs-wayfair",                               dfsPos: 13, vol: 40 },
  { keyword: "soundcloud vs youtube music",          page: "/compare/youtube-music-vs-soundcloud",                   dfsPos: 11, vol: 30 },
  { keyword: "virat kohli vs sachin tendulkar statistics", page: "/compare/virat-kohli-vs-sachin-tendulkar",         dfsPos: 15, vol: 30 },
  { keyword: "lebron james vs kobe bryant",          page: "/compare/kobe-bryant-vs-lebron-james",                   dfsPos: 17, vol: 30 },
  { keyword: "kobe accolades vs lebron",             page: "/compare/kobe-bryant-vs-lebron-james",                   dfsPos: 18, vol: 30 },
  { keyword: "motorola vs galaxy",                   page: "/compare/samsung-galaxy-vs-motorola",                    dfsPos: 18, vol: 30 },
  { keyword: "is paramount plus and peacock the same", page: "/compare/paramount-plus-vs-peacock",                  dfsPos: 20, vol: 30 },
  { keyword: "why is ww2 more famous than ww1",      page: "/compare/ww1-vs-ww2",                                    dfsPos: 20, vol: 30 },
  { keyword: "macbook air m3 vs macbook air m4",     page: "/compare/macbook-air-m3-vs-macbook-air-m4",              dfsPos: 13, vol: 20 },
];

async function getToken() {
  const auth = new GoogleAuth({
    credentials: KEY,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

async function queryGSC(token, startDate, endDate, dimensions, dimensionFilterGroups) {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        dimensionFilterGroups,
        rowLimit: 100,
      }),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data.rows || [];
}

// Get date range: last 7 days
const end = new Date();
end.setDate(end.getDate() - 2); // GSC has 2-3 day lag
const start = new Date(end);
start.setDate(start.getDate() - 6); // 7-day window

const startDate = start.toISOString().split("T")[0];
const endDate = end.toISOString().split("T")[0];

console.log(`Querying GSC: ${startDate} → ${endDate}\n`);

const token = await getToken();

// Query each target page for keyword + page dimension
const results = [];

for (const t of TARGETS) {
  try {
    const rows = await queryGSC(token, startDate, endDate, ["query", "page"], [{
      filters: [
        { dimension: "page", expression: `https://aversusb.net${t.page}` },
        { dimension: "query", expression: t.keyword },
      ],
    }]);
    if (rows.length > 0) {
      const r = rows[0];
      results.push({
        keyword: t.keyword,
        page: t.page,
        dfsPos: t.dfsPos,
        gscPos: Math.round(r.position),
        impressions: r.impressions,
        clicks: r.clicks,
        ctr: (r.ctr * 100).toFixed(1),
        vol: t.vol,
        pageOne: r.position <= 10,
      });
    } else {
      // No exact match — query all keywords for that page to find variants
      results.push({
        keyword: t.keyword,
        page: t.page,
        dfsPos: t.dfsPos,
        gscPos: null,
        impressions: 0,
        clicks: 0,
        ctr: "0",
        vol: t.vol,
        pageOne: false,
        note: "no GSC data for this exact query (may be under threshold)",
      });
    }
  } catch (e) {
    results.push({ keyword: t.keyword, page: t.page, dfsPos: t.dfsPos, gscPos: null, error: e.message });
  }
}

// Sort by GSC position (ascending), then DFS position
results.sort((a, b) => {
  if (a.pageOne && !b.pageOne) return -1;
  if (!a.pageOne && b.pageOne) return 1;
  const ap = a.gscPos ?? 99;
  const bp = b.gscPos ?? 99;
  return ap - bp;
});

const p1 = results.filter(r => r.pageOne);
const near = results.filter(r => !r.pageOne && r.gscPos !== null);
const nodata = results.filter(r => r.gscPos === null && !r.error);

console.log(`PAGE 1 (pos ≤10): ${p1.length}`);
if (p1.length > 0) {
  for (const r of p1) {
    console.log(`  ✅ pos ${r.gscPos}  "${r.keyword}"  impr=${r.impressions}  ${r.page}`);
  }
}

console.log(`\nSTRIKING DISTANCE (pos 11-20):`);
for (const r of near) {
  const moved = r.dfsPos - (r.gscPos ?? r.dfsPos);
  const arrow = moved > 0 ? `↑${moved}` : moved < 0 ? `↓${Math.abs(moved)}` : "—";
  console.log(`  pos ${r.gscPos ?? "??"}  ${arrow}  vol=${r.vol}  "${r.keyword}"`);
}

console.log(`\nNO GSC DATA (under threshold / new): ${nodata.length}`);
for (const r of nodata) {
  console.log(`  [DFS pos${r.dfsPos}] "${r.keyword}"`);
}

// Also get top 20 keywords overall in last 7 days
console.log("\n── Top 20 keywords by GSC position (pos ≤20) last 7 days ──");
try {
  const topRows = await queryGSC(token, startDate, endDate, ["query"], [{
    filters: [{ dimension: "query", operator: "notContains", expression: "aversusb" }],
  }]);
  // Filter to positions ≤ 20
  const top20 = topRows
    .filter(r => r.position <= 20 && r.impressions >= 5)
    .sort((a, b) => a.position - b.position)
    .slice(0, 30);
  for (const r of top20) {
    const icon = r.position <= 10 ? "✅" : "◉";
    console.log(`  ${icon} pos ${r.position.toFixed(1).padStart(5)}  impr=${String(r.impressions).padStart(4)}  "${r.keys[0]}"`);
  }
} catch (e) {
  console.log(`  error: ${e.message}`);
}

console.log(`\nDone. Page-1 count: ${p1.length}/5 needed`);
