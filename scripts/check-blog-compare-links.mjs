#!/usr/bin/env node
/**
 * ROO-224: crawl every /blog post in the sitemap and fail on any /compare
 * link whose target is a 404.
 *
 *   node scripts/check-blog-compare-links.mjs [--base https://www.aversusb.net] [--limit N]
 *
 * Exit 0 when every compare link answers 200 (after redirects), 1 otherwise.
 * Prints one "DEAD <post> -> <compare>" line per broken link.
 * ROO-234: also checks /build/ builder links and every card link (any
 * internal href carrying source_page=/blog/...), and prints how many posts
 * show a relevant card, only the generic popular trio, or no card.
 *
 * Uses a plain GET with a descriptive User-Agent; no auth, no secrets.
 */

const GENERIC_TRIO = new Set(["/compare/iphone-17-vs-samsung-s26", "/compare/lebron-vs-jordan", "/compare/usa-vs-china"]);
const CARD = /<section\b[^>]*data-inline-comparison-card[^>]*>[\s\S]*?<\/section>/gi;
const HREF = /href="(\/[^"#?]*)\/?(\?[^"]*)?"/gi;

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = argValue("--base", process.env.SITE_URL || "https://www.aversusb.net").replace(/\/$/, "");
const LIMIT = Number(argValue("--limit", "0")) || Infinity;
const CONCURRENCY = 6;
const HEADERS = { "user-agent": "aversusb-link-check/1.0 (+ROO-224)" };

async function text(url) {
  const res = await fetch(url, { headers: HEADERS, redirect: "follow" });
  return { status: res.status, body: res.ok ? await res.text() : "" };
}

async function sitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const { body } = await text(url);
  const locs = Array.from(body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (m) => m[1]);
  if (/<sitemapindex/i.test(body)) {
    const nested = await Promise.all(locs.map((loc) => sitemapUrls(loc, seen)));
    return nested.flat();
  }
  return locs;
}

async function pool(items, worker) {
  const out = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await worker(items[i]);
      }
    }),
  );
  return out;
}

const all = await sitemapUrls(`${BASE}/sitemap.xml`);
const posts = Array.from(
  new Set(all.map((u) => new URL(u).pathname).filter((p) => /^\/blog\/[^/]+\/?$/.test(p))),
).slice(0, LIMIT);

const linksByPost = new Map();
const cardByPost = new Map();
await pool(posts, async (post) => {
  const { body } = await text(`${BASE}${post}`);
  const targets = new Set();
  for (const m of body.matchAll(HREF)) {
    const path = m[1].toLowerCase();
    const query = m[2] || "";
    if (/^\/(compare|build)\/[a-z0-9-]+$/.test(path) || /source_page=%2Fblog%2F/i.test(query)) targets.add(path);
  }
  linksByPost.set(post, targets);
  const cards = Array.from(body.matchAll(CARD), (m) => m[0]).join(" ");
  const cardLinks = new Set(Array.from(cards.matchAll(HREF), (m) => m[1].toLowerCase()));
  cardByPost.set(post, { cardLinks, builder: /data-generated="true"/.test(cards) });
});

const targets = Array.from(new Set(Array.from(linksByPost.values()).flatMap((s) => Array.from(s))));
const statusByTarget = new Map();
await pool(targets, async (target) => {
  const res = await fetch(`${BASE}${target}`, { headers: HEADERS, redirect: "follow" }).catch(() => null);
  statusByTarget.set(target, res ? res.status : 0);
});

let dead = 0;
for (const [post, set] of linksByPost) {
  for (const target of set) {
    const status = statusByTarget.get(target);
    if (status !== 200) {
      dead++;
      console.log(`DEAD ${post} -> ${target} (${status})`);
    }
  }
}
let relevant = 0;
let generic = 0;
let hidden = 0;
let builder = 0;
for (const { cardLinks, builder: hasBuilder } of cardByPost.values()) {
  if (cardLinks.size === 0) hidden++;
  else if ([...cardLinks].every((href) => GENERIC_TRIO.has(href))) generic++;
  else relevant++;
  if (hasBuilder) builder++;
}
console.log(`cards: ${relevant} relevant, ${generic} generic trio only, ${hidden} hidden, ${builder} with a builder link`);
console.log(
  `checked ${posts.length} posts, ${targets.length} link targets, ${dead} dead link(s)`,
);
process.exit(dead > 0 ? 1 : 0);
