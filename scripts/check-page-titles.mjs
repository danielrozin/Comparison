#!/usr/bin/env node
/**
 * ROO-241: crawl every sitemap URL (plus a 404) and fail when the brand
 * appears twice in <title>.
 *
 *   node scripts/check-page-titles.mjs [--base URL] [--json out.json]
 *
 * --json writes { url: { title, ogTitle, description, ogDescription, canonical } }
 * so two runs can be diffed. Plain GETs, no auth, no secrets.
 */
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const arg = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const BASE = arg("--base", "https://www.aversusb.net").replace(/\/$/, "");
const OUT = arg("--json", "");
const BRAND = arg("--brand", "A Versus B");
const HEADERS = { "user-agent": "aversusb-title-check/1.0 (+ROO-241)" };

const decode = (s) =>
  (s ?? "")
    .replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
const meta = (html, attr, name) => {
  const re = new RegExp(`<meta[^>]*${attr}="${name}"[^>]*>`, "i");
  const tag = html.match(re)?.[0] ?? "";
  return decode(tag.match(/content="([^"]*)"/i)?.[1]);
};

async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS });
      return { status: res.status, html: await res.text() };
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  return { status: 0, html: "" };
}

async function sitemap(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const { html } = await get(url);
  const locs = Array.from(html.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (m) => m[1]);
  if (/<sitemapindex/i.test(html)) return (await Promise.all(locs.map((l) => sitemap(l, seen)))).flat();
  return locs;
}

const urls = Array.from(new Set(await sitemap(`${BASE}/sitemap.xml`)));
urls.push(`${BASE}/this-page-does-not-exist-roo-241`);
const result = {};
let next = 0;
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      const { status, html } = await get(url);
      const path = new URL(url).pathname;
      result[path] = {
        status,
        title: decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]),
        ogTitle: meta(html, "property", "og:title"),
        description: meta(html, "name", "description"),
        ogDescription: meta(html, "property", "og:description"),
        canonical: decode(html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1]),
      };
    }
  }),
);

const doubled = Object.entries(result).filter(([, r]) => r.title.split(BRAND).length - 1 >= 2);
for (const [path, r] of doubled) console.log(`DOUBLED ${path}: ${r.title}`);
const failed = Object.entries(result).filter(([, r]) => r.status === 0);
console.log(`checked ${urls.length} URLs, ${doubled.length} doubled title(s), ${failed.length} fetch failure(s)`);
if (OUT) writeFileSync(OUT, JSON.stringify(result, null, 1));
process.exit(doubled.length > 0 ? 1 : 0);
