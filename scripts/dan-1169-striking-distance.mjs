// DAN-1169 — Push striking-distance keywords (pos 11–20) into the top-10.
//
// Idempotent. Safe to re-run. Applies the on-page levers for the pos 11–20
// cohort identified in the Growth Lead re-measure (2026-06-20, Semrush US):
//
//   1) Cleveland Browns entity — set curated metaTitle/metaDescription. The
//      entity route now reads these from the DB (see
//      src/app/entity/[slug]/page.tsx generateMetadata, DAN-1169). Target kw
//      "versus browns" (vol 6,600, pos 18) — biggest-volume target.
//   2) Title/meta CTR rewrites on the 11–20 comparison cohort: front-load the
//      actual query token + year + outcome.
//   3) PS5 Pro vs Xbox Series X cannibalization: archive the short duplicate
//      `xbox-series-x-vs-ps5-pro` and consolidate into the keyword-aligned
//      canonical. The 301 lives in src/lib/redirects/compare-redirects.ts.
//   4) Topical internal links into the affiliate/commercial target
//      `/compare/bose-vs-jbl` from same-niche audio pages (stronger relevance
//      signal than the existing cross-category links).
//
//   node scripts/dan-1169-striking-distance.mjs
import * as dotenv from "dotenv";
dotenv.config({ path: new URL("../.env.local", import.meta.url).pathname, override: true });
dotenv.config({ path: new URL("../.env", import.meta.url).pathname });
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const log = (...a) => console.log(...a);

// ---------------------------------------------------------------------------
// 1) Cleveland Browns entity meta (kw "versus browns", vol 6,600, pos 18)
// ---------------------------------------------------------------------------
// metaTitle kept <=47 chars: the entity route template appends " | A Versus B"
// (13 chars), so >47 truncates in Google. See src/app/layout.tsx title.template.
const BROWNS = {
  slug: "cleveland-browns",
  metaTitle: "Cleveland Browns Matchups, Stats & Rivals 2026",
  metaDescription:
    "Compare the Cleveland Browns vs every NFL rival — head-to-head stats, roster, records and matchup breakdowns. All Browns comparisons in one place.",
};

// ---------------------------------------------------------------------------
// 2) Comparison title/meta CTR rewrites (pos 11–20 cohort)
// ---------------------------------------------------------------------------
// metaTitles kept <=47 chars: buildPageTitle() appends " | A Versus B" (13 chars).
const COMPARISON_META = [
  {
    // kw "amazon music vs youtube music" (pos 20) — front-load query order
    slug: "youtube-music-vs-amazon-music",
    metaTitle: "Amazon Music vs YouTube Music: Which Wins 2026",
    metaDescription:
      "Amazon Music vs YouTube Music 2026: lossless audio vs music videos, pricing, library size and which streaming service is better for you.",
  },
  {
    // kw "bloomberg vs wsj" (pos 17) — add the WSJ query token + outcome
    slug: "bloomberg-vs-the-wall-street-journal",
    metaTitle: "Bloomberg vs WSJ 2026: Cost, Data & Verdict",
    metaDescription:
      "Bloomberg vs WSJ (Wall Street Journal) 2026: subscription cost, data and market coverage, terminal vs paper, and which is better for investors.",
  },
  {
    // kw "xbox series x vs ps5 pro specs" (pos 14) — canonical absorbs the
    // consolidated short page; add the "specs" query token
    slug: "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
    metaTitle: "PS5 Pro vs Xbox Series X: Specs & Price 2026",
    metaDescription:
      "PS5 Pro vs Xbox Series X 2026: full specs, GPU/teraflops, 4K performance, price and which console is worth buying. Side-by-side breakdown.",
  },
];

// ---------------------------------------------------------------------------
// 3) PS5 cannibalization — archive the short duplicate
// ---------------------------------------------------------------------------
const ARCHIVE_SLUG = "xbox-series-x-vs-ps5-pro";

// ---------------------------------------------------------------------------
// 4) Topical internal links into the affiliate target /compare/bose-vs-jbl
// ---------------------------------------------------------------------------
const AFFILIATE_TARGET = "/compare/bose-vs-jbl";
const INBOUND_AUDIO_LINKS = [
  "bose-vs-sonos",
  "jbl-vs-marshall",
  "bose-quietcomfort-45-vs-sony-wh-1000xm5",
  "airpods-pro-2-vs-sony-wh-1000xm5",
  "bose-quietcomfort-vs-sony-wh-1000xm5",
];

async function main() {
  // 1) Browns entity meta
  const browns = await prisma.entity.findUnique({ where: { slug: BROWNS.slug }, select: { id: true } });
  if (browns) {
    await prisma.entity.update({
      where: { slug: BROWNS.slug },
      data: { metaTitle: BROWNS.metaTitle, metaDescription: BROWNS.metaDescription },
    });
    log(`✓ entity meta set: /${BROWNS.slug}`);
    log(`    T(${BROWNS.metaTitle.length}): ${BROWNS.metaTitle}`);
  } else {
    log(`! entity not found: ${BROWNS.slug}`);
  }

  // 2) Comparison meta rewrites
  for (const c of COMPARISON_META) {
    const row = await prisma.comparison.findUnique({ where: { slug: c.slug }, select: { id: true } });
    if (!row) { log(`! comparison not found: ${c.slug}`); continue; }
    await prisma.comparison.update({
      where: { slug: c.slug },
      data: { metaTitle: c.metaTitle, metaDescription: c.metaDescription },
    });
    log(`✓ comparison meta set: /${c.slug}  T(${c.metaTitle.length})`);
  }

  // 3) PS5 consolidation — archive short duplicate
  const dup = await prisma.comparison.findUnique({ where: { slug: ARCHIVE_SLUG }, select: { status: true } });
  if (dup) {
    if (dup.status !== "archived") {
      await prisma.comparison.update({ where: { slug: ARCHIVE_SLUG }, data: { status: "archived" } });
      log(`✓ archived duplicate: /${ARCHIVE_SLUG} (was ${dup.status}) → 301 to canonical`);
    } else {
      log(`= already archived: /${ARCHIVE_SLUG}`);
    }
  } else {
    log(`! consolidation source not found: ${ARCHIVE_SLUG}`);
  }

  // 4) Inbound internal links to affiliate target (idempotent upsert-by-pair)
  let added = 0;
  for (const fromSlug of INBOUND_AUDIO_LINKS) {
    const fromExists = await prisma.comparison.findUnique({ where: { slug: fromSlug }, select: { id: true } });
    if (!fromExists) { log(`  · skip (from-page missing): ${fromSlug}`); continue; }
    const fromPath = `/compare/${fromSlug}`;
    const existing = await prisma.internalLink.findFirst({ where: { fromPath, toPath: AFFILIATE_TARGET } });
    if (existing) { log(`  = link exists: ${fromPath} → ${AFFILIATE_TARGET}`); continue; }
    await prisma.internalLink.create({
      data: {
        fromPath,
        toPath: AFFILIATE_TARGET,
        anchorText: "Bose vs JBL",
        linkType: "related",
        position: "module",
        score: 1.5, // > 1.3 so it surfaces ahead of entity-overlap defaults
      },
    });
    added++;
    log(`  ✓ link added: ${fromPath} → ${AFFILIATE_TARGET}`);
  }
  log(`Internal links added: ${added}`);

  log("\nDone. Re-run-safe.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
