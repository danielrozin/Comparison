/**
 * DAN-1365 — On-page intent-match BATCH 2 (Tier 1 + §A Kobe cannibalization).
 *
 * Idempotent prod-DB publisher, run via .github/workflows/publish-editorial.yml:
 *   gh workflow run publish-editorial.yml -f script=scripts/dan1365-batch2.mjs
 *
 * Mirrors the DAN-1288 ship pattern (DB content fields served by ISR). Scope is
 * the confirmed, low-risk Tier-1 copy mismatches + the Kobe/LeBron consolidation;
 * the §B Mercedes and §C MacBook clusters and the Tier-3 touch-ups are tracked as
 * separate child issues because they need inbound-link / primary-entity
 * verification (per the SEO Specialist recs doc `dan1365-intent-match-recs`).
 *
 * What it does (all idempotent):
 *   1. Tier-1 copy edits — metaTitle / H1 (title) / intro (shortAnswer) on
 *      sling-tv-vs-youtube-tv, kobe-vs-lebron, youtube-music-vs-amazon-music.
 *   2. §A Kobe consolidation — repoint inbound InternalLink rows to the survivor
 *      and archive the losing comparison (the edge 301 lives in compare-redirects.ts).
 *   3. New exact-match inbound InternalLink rows to the three Tier-1 targets.
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");

// ---- 1. Tier-1 copy edits -------------------------------------------------
// intro: prepended first sentence carrying the exact target query (existing copy retained)
const INTROS = {
  "sling-tv-vs-youtube-tv":
    "Sling vs YouTube TV comes down to price versus completeness: Sling starts at $40/mo with a leaner channel list, while YouTube TV is $72.99/mo with locals, unlimited DVR, and more streams.",
  "kobe-vs-lebron":
    "Kobe vs LeBron is the GOAT-tier debate: Kobe Bryant's 5 rings, 81-point game and peak scoring against LeBron James's 4 MVPs, 40,361 career points and 22-season longevity.",
  "youtube-music-vs-amazon-music":
    "Amazon Music vs YouTube Music splits on what you value: Amazon Music Unlimited's lossless/Hi-Res catalog versus YouTube Music's music-video library and bundle with YouTube Premium.",
};
// H1 (stored in the `title` field)
const TITLE_EDITS = {
  "sling-tv-vs-youtube-tv": "Sling vs YouTube TV", // drop first "TV" to match query
  "kobe-vs-lebron": "Kobe vs LeBron: Bryant vs James Compared", // short query form leads
  "youtube-music-vs-amazon-music": "Amazon Music vs YouTube Music", // flip to match title + query
};
// metaTitle (title tag). amazon-music title is already correct — left untouched on purpose.
const META_EDITS = {
  "sling-tv-vs-youtube-tv": "Sling vs YouTube TV 2026: Price, Channels & DVR | A Versus B",
  "kobe-vs-lebron": "Kobe vs LeBron: Stats, Rings & Who's Better (2026) | A Versus B",
};

console.log("== 1. Tier-1 copy edits ==");
for (const slug of Object.keys(INTROS)) {
  const c = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, title: true, metaTitle: true, shortAnswer: true, status: true },
  });
  if (!c) { console.log("!! MISSING", slug); continue; }
  const data = {};
  const nf = INTROS[slug];
  const cur = c.shortAnswer || "";
  if (!cur.startsWith(nf)) data.shortAnswer = cur ? `${nf} ${cur}` : nf;
  if (TITLE_EDITS[slug] && c.title !== TITLE_EDITS[slug]) data.title = TITLE_EDITS[slug];
  if (META_EDITS[slug] && c.metaTitle !== META_EDITS[slug]) data.metaTitle = META_EDITS[slug];
  console.log(`\n--- ${slug} [${c.status}] ---`);
  for (const k of ["title", "metaTitle", "shortAnswer"]) if (data[k] !== undefined) {
    console.log(`  ${k}:`);
    console.log(`    - was: ${JSON.stringify((c[k] || "").slice(0, 90))}`);
    console.log(`    + new: ${JSON.stringify(String(data[k]).slice(0, 90))}`);
  }
  if (Object.keys(data).length === 0) { console.log("  (no change — already applied)"); continue; }
  data.lastRefreshedAt = new Date();
  if (!DRY) { await prisma.comparison.update({ where: { id: c.id }, data }); console.log("  >> WRITTEN"); }
}

// ---- 2. §A Kobe/LeBron consolidation --------------------------------------
const KOBE_LOSER = "kobe-bryant-vs-lebron-james";
const KOBE_SURVIVOR = "kobe-vs-lebron";
const loserPath = `/compare/${KOBE_LOSER}`;
const survivorPath = `/compare/${KOBE_SURVIVOR}`;

console.log("\n== 2. §A Kobe consolidation ==");
// 2a. Repoint inbound InternalLink rows from the loser to the survivor.
const inbound = await prisma.internalLink.findMany({ where: { toPath: loserPath } });
console.log(`inbound links to ${loserPath}: ${inbound.length}`);
let repointed = 0, dropped = 0;
for (const link of inbound) {
  if (link.fromPath === survivorPath) {
    console.log(`   drop self-link ${link.fromPath} -> survivor`);
    if (!DRY) await prisma.internalLink.delete({ where: { id: link.id } });
    dropped++;
    continue;
  }
  const dup = await prisma.internalLink.findFirst({
    where: { fromPath: link.fromPath, toPath: survivorPath },
  });
  if (dup) {
    console.log(`   drop dup ${link.fromPath} (survivor link already exists)`);
    if (!DRY) await prisma.internalLink.delete({ where: { id: link.id } });
    dropped++;
    continue;
  }
  console.log(`   repoint ${link.fromPath} -> survivor`);
  if (!DRY) await prisma.internalLink.update({ where: { id: link.id }, data: { toPath: survivorPath } });
  repointed++;
}
console.log(`repointed=${repointed} dropped=${dropped}`);

// 2b. Archive the losing comparison so it stops self-canonicalizing (edge 301 serves it).
const loser = await prisma.comparison.findUnique({
  where: { slug: KOBE_LOSER },
  select: { id: true, status: true },
});
if (!loser) {
  console.log(`!! losing comparison ${KOBE_LOSER} not found (already removed?)`);
} else if (loser.status === "archived") {
  console.log(`losing comparison already archived`);
} else {
  console.log(`archiving ${KOBE_LOSER} (was ${loser.status})`);
  if (!DRY) await prisma.comparison.update({ where: { id: loser.id }, data: { status: "archived" } });
}

// ---- 3. New exact-match inbound InternalLink rows -------------------------
console.log("\n== 3. New exact-match inbound links ==");
const cp = (s) => `/compare/${s}`;
const LINK_PLAN = [
  ["/compare/sling-tv-vs-youtube-tv", "sling vs youtube tv",
    ["sling-tv-vs-hulu-live", "hulu-live-vs-youtube-tv", "fubo-vs-youtube-tv", "directv-stream-vs-youtube-tv", "youtube-tv-vs-hulu"]],
  ["/compare/kobe-vs-lebron", "kobe vs lebron",
    ["lebron-vs-jordan", "kobe-vs-jordan", "michael-jordan-vs-lebron-james"]],
  ["/compare/youtube-music-vs-amazon-music", "amazon music vs youtube music",
    ["spotify-vs-amazon-music", "spotify-vs-youtube-music"]],
];
let created = 0, skipped = 0;
for (const [toPath, anchor, sources] of LINK_PLAN) {
  console.log(`\n-> ${toPath}  (anchor "${anchor}")`);
  for (const src of sources) {
    const fromPath = cp(src);
    if (fromPath === toPath) { console.log(`   self-skip ${src}`); continue; }
    const exists = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
    if (exists) { console.log(`   exists  ${fromPath}`); skipped++; continue; }
    console.log(`   + ${fromPath}`);
    if (!DRY) await prisma.internalLink.create({ data: { fromPath, toPath, anchorText: anchor, linkType: "related", position: "inline", score: 1.4 } });
    created++;
  }
}
console.log(`\nlinks created=${created} skipped=${skipped}`);

await prisma.$disconnect();
console.log(DRY ? "\nDRY RUN — no writes" : "\nDONE");
