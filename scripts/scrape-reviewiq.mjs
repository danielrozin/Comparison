/**
 * Scrape ReviewIQ Google Sites — content lift for the migration to Next.js
 *
 * Pre-staged work product for DAN-386 Phase 1 step 3 ("content seed + redirects").
 * Does NOT run automatically — the migration repo doesn't exist yet. This is
 * dropped here so when DAN-386 plan approval lands, Phase 1 starts at
 * "run the script" not "write the script from scratch".
 *
 * Why a headless browser is required: reviewiq.net is hosted on Google Sites
 * which renders content client-side. A plain `fetch()` returns a near-empty
 * HTML shell; the actual review body, images, and headings are JS-injected.
 * See DAN-386 Phase 0 inventory comment for the render audit that proves this.
 *
 * Usage:
 *   npm i -D playwright
 *   npx playwright install chromium
 *   node scripts/scrape-reviewiq.mjs                       # crawl all 24 reviews + 9 index pages
 *   node scripts/scrape-reviewiq.mjs --slug technology/10-port-usb-charger  # single page
 *   node scripts/scrape-reviewiq.mjs --dry-run             # print URLs only, no crawl
 *
 * Output: scripts/output/reviewiq-content.json
 *   {
 *     scrapedAt: ISO8601,
 *     pages: [{ url, path, category, slug, title, h1, bodyHtml, bodyText,
 *               wordCount, images: [{src, alt}], links: [{href, text}] }]
 *   }
 *
 * Author: VP R&D, 2026-05-03 (DAN-386 Phase 0 deliverable)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(__dirname, "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "reviewiq-content.json");

const BASE_URL = "https://reviewiq.net";

// 33 known URLs derived from the live homepage nav (DAN-386 Phase 0 crawl).
// Static + index pages are intentionally listed so the crawler captures the
// nav, intro paragraphs, and category descriptions for the migrated site.
const STATIC_PAGES = ["/", "/home", "/about", "/blog", "/reviews"];

const CATEGORY_INDEX_PAGES = [
  "/reviews/content-creation",
  "/reviews/home-goods",
  "/reviews/on-the-green",
  "/reviews/take-me-out-to-the-ballgame",
  "/reviews/technology",
];

const REVIEW_PAGES = [
  // content-creation (1)
  "/reviews/content-creation/neewer-cube-light",
  // home-goods (3)
  "/reviews/home-goods/table-leg-risers",
  "/reviews/home-goods/titan-clad-cutting-board",
  "/reviews/home-goods/welclux-shaver",
  // on-the-green (1)
  "/reviews/on-the-green/4-pack-ball-markers",
  // take-me-out-to-the-ballgame (7)
  "/reviews/take-me-out-to-the-ballgame/baseball-bogg-charms",
  "/reviews/take-me-out-to-the-ballgame/baseball-ice-molds",
  "/reviews/take-me-out-to-the-ballgame/baseball-sunflower-seed-bag",
  "/reviews/take-me-out-to-the-ballgame/easton-bomb-bat-grip-tape",
  "/reviews/take-me-out-to-the-ballgame/fence-mounted-phone-holder",
  "/reviews/take-me-out-to-the-ballgame/fuzzy-baseball-mascot",
  "/reviews/take-me-out-to-the-ballgame/party-animals-lanyard",
  // technology (12)
  "/reviews/technology/10-port-usb-charger",
  "/reviews/technology/4-in-1-switch-2-controller-charger-dock",
  "/reviews/technology/45-w-usb-c-plugs-and-usb-c-cables",
  "/reviews/technology/flexible-overhead-camera-mount",
  "/reviews/technology/game-controller-case",
  "/reviews/technology/inchoi-cases-dji-osmo-pocket-3-hard-case",
  "/reviews/technology/large-capacity-power-bank",
  "/reviews/technology/mobile-phone-magnetic-vent-clip",
  "/reviews/technology/multi-plug-surge-protector",
  "/reviews/technology/raubay-monitor-camera-mount",
  "/reviews/technology/suncat-wallet-with-find-my-tracking",
  "/reviews/technology/switch-2-joy-con-controllers",
  "/reviews/technology/zyqeee-phone-screen-protector",
];

const ALL_PATHS = [...STATIC_PAGES, ...CATEGORY_INDEX_PAGES, ...REVIEW_PAGES];

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { dryRun: false, singleSlug: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") out.dryRun = true;
    else if (args[i] === "--slug") out.singleSlug = args[++i];
  }
  return out;
}

function deriveCategoryAndSlug(urlPath) {
  // /reviews/{cat}/{slug} → { category, slug }
  // /reviews/{cat}        → { category, slug: null }
  // /reviews              → { category: null, slug: null }
  // /home /about /blog /  → { category: null, slug: null }
  const parts = urlPath.split("/").filter(Boolean);
  if (parts[0] !== "reviews") return { category: null, slug: null };
  return { category: parts[1] || null, slug: parts[2] || null };
}

async function scrapeOne(page, urlPath) {
  const url = BASE_URL + urlPath;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  // Google Sites injects content after networkidle; small extra wait covers slow JS.
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const h1 = document.querySelector('h1')?.textContent?.trim() || null;
    const title = document.title || null;
    const bodyHtml = main.innerHTML;
    const bodyText = main.innerText.replace(/\s+/g, ' ').trim();
    const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

    const images = Array.from(main.querySelectorAll('img'))
      .filter(img => img.src && !img.src.startsWith('data:'))
      .map(img => ({ src: img.src, alt: img.alt || '' }));

    const links = Array.from(main.querySelectorAll('a[href]'))
      .map(a => ({ href: a.href, text: (a.textContent || '').trim().slice(0, 200) }))
      .filter(l => l.text);

    return { title, h1, bodyHtml, bodyText, wordCount, images, links };
  });

  const { category, slug } = deriveCategoryAndSlug(urlPath);
  return { url, path: urlPath, category, slug, ...data };
}

async function main() {
  const { dryRun, singleSlug } = parseArgs();

  const targets = singleSlug
    ? ALL_PATHS.filter(p => p.endsWith(singleSlug) || p === `/${singleSlug}`)
    : ALL_PATHS;

  if (!targets.length) {
    console.error(`No matching path for --slug ${singleSlug}`);
    process.exit(1);
  }

  console.log(`ReviewIQ scraper: ${targets.length} target URL(s)`);
  if (dryRun) {
    targets.forEach(t => console.log("  " + BASE_URL + t));
    console.log("--dry-run: exiting without crawling.");
    return;
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch (e) {
    console.error(
      "playwright not installed. Run: npm i -D playwright && npx playwright install chromium"
    );
    process.exit(2);
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: "Mozilla/5.0 (compatible; ReviewIQMigrationBot/1.0; +https://reviewiq.net)",
  });
  const page = await ctx.newPage();

  const pages = [];
  let i = 0;
  for (const p of targets) {
    i++;
    process.stdout.write(`[${i}/${targets.length}] ${p} ... `);
    try {
      const res = await scrapeOne(page, p);
      pages.push(res);
      console.log(`ok (${res.wordCount}w, ${res.images.length} imgs)`);
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      pages.push({ url: BASE_URL + p, path: p, error: err.message });
    }
  }

  await browser.close();

  const out = {
    scrapedAt: new Date().toISOString(),
    source: BASE_URL,
    underlying: "sites.google.com/view/review-iq",
    pageCount: pages.length,
    pages,
  };
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${pages.length} page(s) to ${path.relative(ROOT_DIR, OUTPUT_FILE)}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
