/**
 * DAN-2160 Wave 27 — Add thematically-relevant blog→comparison links
 *
 * Highest-signal links: blog posts with EXACT topic match to our targets.
 *
 * Run:
 *   node scripts/dan2160-wave27-blog-links.mjs --dry
 *   node scripts/dan2160-wave27-blog-links.mjs
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
const prisma = new PrismaClient();
const DRY = process.argv.includes("--dry");
const log = (...a) => console.log(...a);

async function addBlogLink(blogSlug, toSlug, anchor) {
  const fromPath = `/blog/${blogSlug}`;
  const toPath = `/compare/${toSlug}`;
  const exists = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
  if (exists) { log(`  skip (exists): blog/${blogSlug} → ${toSlug}`); return 0; }
  if (!DRY) {
    await prisma.internalLink.create({
      data: { fromPath, toPath, anchorText: anchor, linkType: "related", position: "inline", score: 1.3 },
    });
  }
  log(`  ${DRY ? "[DRY]" : "✅"} blog/${blogSlug} → ${toSlug} "${anchor}"`);
  return 1;
}

log(`DAN-2160 Wave 27 — Blog→comparison link gaps ${DRY ? "(DRY RUN)" : ""}`);
log("=".repeat(64));
let total = 0;

// ── Capital One vs Chase: exact-match blog posts ─────────────────────────────
log("\n── capital-one-vs-chase: from finance blogs (EXACT INTENT MATCH) ──");
total += await addBlogLink(
  "is-chase-owned-by-capital-one-the-relationship-explained",
  "capital-one-vs-chase",
  "Capital One vs Chase: full comparison of two separate banks"
);
total += await addBlogLink(
  "does-capital-one-have-zelle-in-2026-features-compared-to-chase",
  "capital-one-vs-chase",
  "Capital One vs Chase: Zelle, features, and full bank comparison"
);
total += await addBlogLink(
  "does-chase-bank-offer-personal-loans-in-2026-complete-guide-vs-capital-one-other",
  "capital-one-vs-chase",
  "Capital One vs Chase: which bank is better for personal loans?"
);
total += await addBlogLink(
  "does-capital-one-offer-personal-loans-in-2026-compare-capital-one-vs-chase-disco",
  "capital-one-vs-chase",
  "Capital One vs Chase bank: full comparison of loans, cards & features"
);

// ── IKEA vs Wayfair: from furniture blog ──────────────────────────────────────
log("\n── ikea-vs-wayfair: from furniture blog (EXACT INTENT MATCH) ──");
total += await addBlogLink(
  "is-wayfair-furniture-better-than-ikea-honest-comparison",
  "ikea-vs-wayfair",
  "Wayfair vs IKEA: detailed comparison with Reddit verdict"
);

// ── MacBook Air M3 vs M4: from MacBook blog posts ────────────────────────────
log("\n── macbook-air-m3-vs-macbook-air-m4: from MacBook blogs ──");
total += await addBlogLink(
  "macbook-pro-14-inch-vs-16-inch-weight-comparison-2024-2026-which-size-is-right",
  "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: which Apple laptop should you upgrade to?"
);
total += await addBlogLink(
  "macbook-pro-thickness-2024-2026-how-the-latest-models-compare",
  "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: full spec and upgrade comparison"
);
total += await addBlogLink(
  "macbook-pro-weight-comparison-2024-2026-how-new-models-stack-up",
  "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: which to buy in 2026?"
);
total += await addBlogLink(
  "is-samsung-better-than-apple-in-2026-iphone-vs-galaxy-comparison",
  "macbook-air-m3-vs-macbook-air-m4",
  "MacBook Air M3 vs M4: best Apple laptop upgrade for 2026"
);

// ── YouTube Music vs SoundCloud: from streaming blogs ─────────────────────────
log("\n── youtube-music-vs-soundcloud: from streaming blogs ──");
total += await addBlogLink(
  "best-streaming-services-in-2026-top-picks-for-every-budget-interest",
  "youtube-music-vs-soundcloud",
  "SoundCloud vs YouTube Music: which music streaming app is better?"
);
total += await addBlogLink(
  "best-streaming-services-of-2026-top-picks-for-movies-tv-sports",
  "youtube-music-vs-soundcloud",
  "YouTube Music vs SoundCloud: full 2026 comparison"
);
total += await addBlogLink(
  "philo-in-2026-streaming-tv-service-review-pricing-reddit-community-insights",
  "youtube-music-vs-soundcloud",
  "SoundCloud vs YouTube Music: which streaming service wins for music?"
);
total += await addBlogLink(
  "best-live-tv-streaming-services-plans-for-spring-2026-complete-buyers-guide",
  "youtube-music-vs-soundcloud",
  "SoundCloud vs YouTube Music: music streaming comparison 2026"
);

log(`\n${"=".repeat(64)}`);
log(`Wave 27 ${DRY ? "DRY RUN" : "DONE"}: ${total} blog→comparison links added`);
await prisma.$disconnect();
