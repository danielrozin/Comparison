import * as dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const raw = JSON.parse(readFileSync(new URL("./data/dan1030-ranking-slugs.json", import.meta.url), "utf8"));
const csvRaw = readFileSync(new URL("./data/dan1030-ranking-slugs.csv", import.meta.url), "utf8").trim().split("\n").slice(1);
const meta = new Map();
for (const line of csvRaw) {
  const m = line.match(/^([^,]+),(\d+),(\d+),"(.*)",(\d+)$/);
  if (m) meta.set(m[1], { bestPosition: +m[2], impressions: +m[3], topKeyword: m[4], topVolume: +m[5] });
}

// Reverse-order corrections (ranking URL -> canonical DB slug).
const remap = { "mercedes-vs-tesla": "tesla-vs-mercedes", "google-pixel-vs-samsung-galaxy": "samsung-galaxy-vs-google-pixel" };
// Ranking URLs with no Comparison row (cannot be pinned — reported separately).
const noRow = new Set(["mercedes-vs-audi","xbox-series-x-vs-nintendo-switch-2","macbook-pro-14-vs-16","b-2-vs-b-52","paramount-plus-vs-hulu"]);

const pinned = [];
const seen = new Set();
const unmatched = [];
for (const slug of raw) {
  if (noRow.has(slug)) { unmatched.push({ slug, ...meta.get(slug) }); continue; }
  const canonical = remap[slug] || slug;
  if (seen.has(canonical)) continue;
  seen.add(canonical);
  pinned.push({ slug: canonical, sourceUrlSlug: slug, ...meta.get(slug) });
}

// Final DB confirmation of the pinned set.
const rows = await prisma.comparison.findMany({ select: { slug: true }, where: { slug: { in: pinned.map(p => p.slug) } } });
const have = new Set(rows.map(r => r.slug));
const stillMissing = pinned.filter(p => !have.has(p.slug));
await prisma.$disconnect();

const finalSlugs = pinned.filter(p => have.has(p.slug)).map(p => p.slug);

writeFileSync(new URL("./data/dan1030-pinned-slugs.json", import.meta.url).pathname, JSON.stringify(finalSlugs, null, 2));
const csv = ["slug,bestPosition,impressions,topKeyword,topVolume"];
for (const p of pinned.filter(p => have.has(p.slug)).sort((a,b)=>b.impressions-a.impressions)) {
  csv.push(`${p.slug},${p.bestPosition},${p.impressions},"${(p.topKeyword||"").replace(/"/g,'""')}",${p.topVolume}`);
}
writeFileSync(new URL("./data/dan1030-pinned-slugs.csv", import.meta.url).pathname, csv.join("\n"));
writeFileSync(new URL("./data/dan1030-unmatched-urls.json", import.meta.url).pathname, JSON.stringify(unmatched, null, 2));

console.log("PINNED (DB-validated) slugs:", finalSlugs.length);
console.log("Reverse-corrected:", Object.entries(remap).map(([a,b])=>`${a}->${b}`).join(", "));
console.log("Still missing after remap:", stillMissing.map(p=>p.slug).join(", ") || "none");
console.log("Unmatched ranking URLs (no Comparison row):", unmatched.length, unmatched.map(u=>u.slug).join(", "));
