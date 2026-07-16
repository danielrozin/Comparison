/**
 * DAN-2160 — Submit all 22 striking-distance pages to IndexNow.
 *
 * IndexNow instantly signals Bing, Yandex, Seznam, and Naver (and Google's
 * IndexNow trial) that these URLs have fresh content — cutting recrawl from
 * 2–14 days to hours.  Run this after every wave of on-page improvements.
 *
 * Key source: src/lib/seo/indexnow.ts (INDEXNOW_KEY)
 */

const HOST       = "www.aversusb.net";
const SITE_URL   = "https://www.aversusb.net";
const KEY        = "c774592d395cb18932c0cf35c828e1a6";
const KEY_LOC    = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT   = "https://api.indexnow.org/indexnow";

// All 22 striking-distance slugs from the issue (pos 11–20 as of 2026-07-14).
const PATHS = [
  "/compare/ww1-vs-ww2",
  "/compare/macbook-air-vs-macbook-pro-difference-2026-specs",
  "/compare/amazon-vs-best-buy",
  "/compare/farmers-insurance-vs-state-farm",
  "/compare/ps5-pro-vs-xbox-series-x-performance-comparison-2026",
  "/compare/expedia-vs-kayak",
  "/compare/capital-one-vs-chase",
  "/compare/ikea-vs-wayfair",
  "/compare/kobe-bryant-vs-lebron-james",
  "/compare/youtube-music-vs-soundcloud",
  "/blog/best-alternatives-to-mercedes-benz-in-2026-luxury-brands-compared",
  "/compare/virat-kohli-vs-sachin-tendulkar",
  "/compare/f-16-vs-f-15",
  "/compare/samsung-galaxy-vs-motorola",
  "/compare/paramount-plus-vs-peacock",
  "/compare/macbook-air-m3-vs-macbook-air-m4",
];

const urlList = PATHS.map(p => `${SITE_URL}${p}`);

console.log(`=== DAN-2160 IndexNow submit (${urlList.length} URLs) ===\n`);
urlList.forEach(u => console.log(`  ${u}`));
console.log();

const body = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOC, urlList });

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body,
});

console.log(`IndexNow HTTP ${res.status} ${res.statusText}`);

if (res.status === 200 || res.status === 202) {
  console.log(`✅ Accepted — ${urlList.length} URLs queued for recrawl by Bing/Yandex/Seznam/Naver.`);
  console.log("   Engines typically crawl within 24–48 hours; Google via its own signals.");
} else {
  const text = await res.text().catch(() => "");
  console.log(`❌ Rejected — body: ${text.slice(0, 300)}`);
  process.exit(1);
}
