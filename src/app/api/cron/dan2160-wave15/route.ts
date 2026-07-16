import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/**
 * GET /api/cron/dan2160-wave15
 *
 * DAN-2160 Wave 15 — Aggressive internal link push to the 3 closest-to-page-1 targets.
 * All source pages verified as published or existing blog_articles before writing.
 *
 * Target pages (positions that need the least movement to reach page 1):
 *   - youtube-music-vs-soundcloud  (pos 11, vol 30)  — +8 links from music/streaming pages
 *   - ikea-vs-wayfair              (pos 13, vol 40)  — +7 links from retail/home pages
 *   - capital-one-vs-chase         (pos 13, vol 40)  — +5 links from exact-match blog articles
 *
 * Also freshness-touches all 3 targets (updated_at).
 * Idempotent — checks for existing links before inserting.
 * Auth: Bearer {CRON_SECRET}.
 */

const LINK_ADDITIONS: Array<{
  fromPath: string;
  fromType: "comparison" | "blog";
  toPath: string;
  anchorText: string;
  score?: number;
}> = [
  // ── youtube-music-vs-soundcloud (pos 11) ──────────────────────────────────
  // Published music/streaming comparison pages
  {
    fromPath: "/compare/spotify-vs-apple-music",
    fromType: "comparison",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "SoundCloud vs YouTube Music comparison",
    score: 1.5,
  },
  {
    fromPath: "/compare/tidal-vs-deezer",
    fromType: "comparison",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud: budget streaming alternatives",
    score: 1.3,
  },
  {
    fromPath: "/compare/apple-music-vs-spotify",
    fromType: "comparison",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "SoundCloud vs YouTube Music alternatives",
    score: 1.4,
  },
  {
    fromPath: "/compare/spotify-vs-amazon-music",
    fromType: "comparison",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud compared",
    score: 1.3,
  },
  {
    fromPath: "/compare/netflix-vs-youtube-premium",
    fromType: "comparison",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud for YouTube users",
    score: 1.3,
  },
  {
    fromPath: "/compare/sling-tv-vs-youtube-tv",
    fromType: "comparison",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "SoundCloud vs YouTube Music: music streaming apps",
    score: 1.1,
  },
  {
    fromPath: "/blog/best-streaming-services-of-2026-top-picks-for-movies-tv-sports",
    fromType: "blog",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "SoundCloud vs YouTube Music 2026 breakdown",
    score: 1.4,
  },
  {
    fromPath: "/blog/best-streaming-services-2026-netflix-vs-disney-plus-vs-hbo-max",
    fromType: "blog",
    toPath: "/compare/youtube-music-vs-soundcloud",
    anchorText: "YouTube Music vs SoundCloud: music streaming compared",
    score: 1.3,
  },

  // ── ikea-vs-wayfair (pos 13) ──────────────────────────────────────────────
  // Published retail/shopping comparison pages
  {
    fromPath: "/compare/amazon-vs-chewy",
    fromType: "comparison",
    toPath: "/compare/ikea-vs-wayfair",
    anchorText: "IKEA vs Wayfair for home shopping",
    score: 1.1,
  },
  {
    fromPath: "/compare/amazon-vs-ebay",
    fromType: "comparison",
    toPath: "/compare/ikea-vs-wayfair",
    anchorText: "IKEA vs Wayfair: online furniture retailers compared",
    score: 1.2,
  },
  {
    fromPath: "/compare/whole-foods-vs-target",
    fromType: "comparison",
    toPath: "/compare/ikea-vs-wayfair",
    anchorText: "IKEA vs Wayfair for home décor and furniture",
    score: 1.1,
  },
  {
    fromPath: "/compare/amazon-haul-vs-shein",
    fromType: "comparison",
    toPath: "/compare/ikea-vs-wayfair",
    anchorText: "IKEA vs Wayfair: home shopping alternatives",
    score: 1.0,
  },
  {
    fromPath: "/compare/temu-vs-shein",
    fromType: "comparison",
    toPath: "/compare/ikea-vs-wayfair",
    anchorText: "IKEA vs Wayfair for furniture and home goods",
    score: 1.0,
  },
  {
    fromPath: "/compare/trader-joes-vs-whole-foods",
    fromType: "comparison",
    toPath: "/compare/ikea-vs-wayfair",
    anchorText: "furnish your home: IKEA vs Wayfair compared",
    score: 0.9,
  },
  {
    fromPath: "/blog/is-wayfair-furniture-better-than-ikea-honest-comparison",
    fromType: "blog",
    toPath: "/compare/ikea-vs-wayfair",
    anchorText: "IKEA vs Wayfair 2026: full comparison",
    score: 1.6,
  },

  // ── capital-one-vs-chase (pos 13) ─────────────────────────────────────────
  // Blog articles that directly answer "are chase and capital one affiliated"
  {
    fromPath: "/blog/is-chase-owned-by-capital-one-the-relationship-explained",
    fromType: "blog",
    toPath: "/compare/capital-one-vs-chase",
    anchorText: "Capital One vs Chase: full bank comparison",
    score: 1.8,
  },
  {
    fromPath: "/blog/are-chase-and-capital-one-affiliated",
    fromType: "blog",
    toPath: "/compare/capital-one-vs-chase",
    anchorText: "Capital One vs Chase: are they affiliated? Full comparison",
    score: 1.8,
  },
  {
    fromPath: "/blog/does-capital-one-have-zelle-in-2026-features-compared-to-chase",
    fromType: "blog",
    toPath: "/compare/capital-one-vs-chase",
    anchorText: "Capital One vs Chase banking features compared",
    score: 1.6,
  },
  {
    fromPath: "/blog/does-chase-bank-offer-personal-loans-in-2026-complete-guide-vs-capital-one-other",
    fromType: "blog",
    toPath: "/compare/capital-one-vs-chase",
    anchorText: "Capital One vs Chase personal loans and banking",
    score: 1.5,
  },
  {
    fromPath: "/blog/does-capital-one-offer-personal-loans-in-2026-compare-capital-one-vs-chase-disco",
    fromType: "blog",
    toPath: "/compare/capital-one-vs-chase",
    anchorText: "Capital One vs Chase: personal loans compared",
    score: 1.5,
  },
];

const FRESHNESS_SLUGS = [
  "youtube-music-vs-soundcloud",
  "ikea-vs-wayfair",
  "capital-one-vs-chase",
];

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getPrisma } = await import("@/lib/db/prisma");
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "No database connection" }, { status: 503 });
  }

  const results: string[] = [];
  let linksAdded = 0;
  let freshnessUpdated = 0;

  // 1. Add internal links (idempotent — check before insert)
  for (const { fromPath, fromType, toPath, anchorText, score } of LINK_ADDITIONS) {
    const existing = await prisma.internalLink.findFirst({ where: { fromPath, toPath } });
    if (existing) {
      results.push(`= exists: ${fromPath} → ${toPath}`);
      continue;
    }

    let sourceExists = false;
    if (fromType === "comparison") {
      const fromSlug = fromPath.replace("/compare/", "");
      const row = await prisma.comparison.findFirst({
        where: { slug: fromSlug, status: "published" },
        select: { id: true },
      });
      sourceExists = !!row;
    } else {
      const fromSlug = fromPath.replace("/blog/", "");
      const row = await prisma.blogArticle.findFirst({
        where: { slug: fromSlug },
        select: { id: true },
      });
      sourceExists = !!row;
    }

    if (!sourceExists) {
      results.push(`· source not found: ${fromPath}`);
      continue;
    }

    await prisma.internalLink.create({
      data: { fromPath, toPath, anchorText, linkType: "related", position: "inline", score: score ?? 1.0 },
    });
    linksAdded++;
    results.push(`✓ link: ${fromPath} → ${toPath}`);
  }

  // 2. Freshness touch — update updated_at so ISR re-renders the page
  for (const slug of FRESHNESS_SLUGS) {
    const row = await prisma.comparison.findUnique({ where: { slug }, select: { id: true } });
    if (!row) {
      results.push(`! not found: ${slug}`);
      continue;
    }
    await prisma.comparison.update({ where: { slug }, data: { updatedAt: new Date() } });
    freshnessUpdated++;
    results.push(`✓ freshness: ${slug}`);
  }

  return NextResponse.json({
    ok: true,
    wave: 15,
    linksAdded,
    freshnessUpdated,
    details: results,
  });
}
