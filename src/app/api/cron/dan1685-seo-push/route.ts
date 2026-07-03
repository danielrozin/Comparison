import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/**
 * GET /api/cron/dan1685-seo-push
 *
 * One-shot meta-title / meta-description CTR refresh for the top striking-distance
 * keywords (positions 11–20 per 2026-07-03 re-measure, DAN-1683).
 *
 * Levers applied:
 *   1. Comparison metaTitle + metaDescription for 6 priority pages.
 *   2. Blog metaTitle + metaDescription for the Mercedes-Benz alternatives page.
 *   3. Additional internal links into /compare/ww1-vs-ww2 from history/military pages
 *      (DAN-1662 changes applied idempotently in case that script never ran locally).
 *
 * Idempotent — safe to re-run. Auth: Bearer {CRON_SECRET}.
 *
 * Call once after deploy:
 *   curl -s -X GET https://www.aversusb.net/api/cron/dan1685-seo-push \
 *     -H "Authorization: Bearer aversusb-cron-2026-secret-x9k4m"
 */

// ---------------------------------------------------------------------------
// Comparison meta rewrites (6 pages, pos 11–20)
// ---------------------------------------------------------------------------
// metaTitle stored as full "<keyword phrase> | A Versus B" — buildPageTitle()
// strips the existing suffix and re-appends it exactly once (DAN-1145 Bug 1).
// Target: ≤60 chars total for the rendered <title> tag.
const COMPARISON_META = [
  {
    // "ww1 vs ww2" (vol 2,900, pos 20) — front-load "World War 1 vs World War 2"
    // Carries DAN-1662 shortAnswer + FAQ changes (applied separately in that script).
    slug: "ww1-vs-ww2",
    metaTitle: "World War 1 vs World War 2: Causes & Deaths | A Versus B",
    metaDescription:
      "Compare World War 1 vs World War 2: causes, casualties (20M vs 70–85M deaths), technology used, and which war was more destructive. Full WW1 vs WW2 breakdown.",
  },
  {
    // "macbook air vs pro 2026" (vol 140, pos 19) + "macbook pro vs air 2026" (vol 90, pos 20)
    // Both hit the same URL — title front-loads "Air vs Pro" and captures the "Pro vs Air"
    // variant implicitly (Google matches on all tokens, not just order).
    slug: "macbook-air-vs-macbook-pro-difference-2026-specs",
    metaTitle: "MacBook Air vs Pro 2026: Specs & Which to Buy | A Versus B",
    metaDescription:
      "MacBook Air vs MacBook Pro 2026: M4 chip performance, display specs, weight, battery life, price difference and which Apple laptop best fits your needs.",
  },
  {
    // "farmers vs state farm home insurance" (vol 110, pos 19) — add "home insurance" token
    slug: "farmers-insurance-vs-state-farm",
    metaTitle: "Farmers vs State Farm Home Insurance 2026 | A Versus B",
    metaDescription:
      "Farmers vs State Farm home insurance 2026: coverage options, premiums, discounts, claims experience, J.D. Power ratings and which insurer is right for you.",
  },
  {
    // "best buy vs amazon" (vol 110, pos 18) — flip slug order to match query
    slug: "amazon-vs-best-buy",
    metaTitle: "Best Buy vs Amazon 2026: Which Wins? | A Versus B",
    metaDescription:
      "Best Buy vs Amazon 2026: compare pricing, product selection, shipping speed, return policies, warranties and in-store support — which retailer gives you the better deal?",
  },
  {
    // "ps5 pro vs xbox series x: performance" (vol 90, pos 20) — add "performance" token
    // DAN-1169 had "PS5 Pro vs Xbox Series X: Specs & Price 2026"; refresh adds performance.
    slug: "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
    metaTitle: "PS5 Pro vs Xbox Series X Performance 2026 | A Versus B",
    metaDescription:
      "PS5 Pro vs Xbox Series X performance 2026: GPU teraflops, 4K frame rates, ray tracing, load times, exclusive games and which console is worth buying.",
  },
  {
    // "expedia or kayak" (vol 50, pos 16) — match the "or" phrasing of the query
    slug: "expedia-vs-kayak",
    metaTitle: "Expedia or Kayak 2026: Which Travel Site Wins? | A Versus B",
    metaDescription:
      "Expedia or Kayak 2026: compare flight and hotel prices, search tools, booking fees, rewards programs, customer support and which travel site saves you more.",
  },
];

// ---------------------------------------------------------------------------
// Blog meta rewrites (mercedes-benz competitors, vol 320, pos 16)
// ---------------------------------------------------------------------------
// Blog pages feed title directly to Next.js metadata (no buildPageTitle wrapper);
// the root layout title.template appends " | A Versus B", so store WITHOUT suffix.
const BLOG_META = [
  {
    slug: "mercedes-benz-alternatives-in-2026-best-luxury-cars-brands-to-consider",
    metaTitle: "Mercedes-Benz Competitors 2026: Top Rivals",
    metaDescription:
      "Top Mercedes-Benz competitors in 2026: BMW, Audi, Lexus, Genesis and more. Compare luxury sedan and SUV rivals by price, features and brand reputation.",
  },
];

// ---------------------------------------------------------------------------
// Internal links into /compare/ww1-vs-ww2 (DAN-1662 additions, idempotent)
// ---------------------------------------------------------------------------
// 5 links already existed pre-DAN-1662 (ancient-greece, roman-empire,
// french-revolution, cold-war, vietnam-war). Adding 3 more from adjacent
// history/military comparison pages.
const WW1_LINK_TARGET = "/compare/ww1-vs-ww2";
const WW1_INBOUND_LINKS = [
  {
    fromPath: "/compare/democracy-vs-communism",
    anchorText: "World War 1 vs World War 2",
    linkType: "related" as const,
    position: "inline" as const,
    score: 1.2,
  },
  {
    fromPath: "/compare/vietnam-war-vs-korean-war-comparison",
    anchorText: "WW1 vs WW2 comparison",
    linkType: "related" as const,
    position: "inline" as const,
    score: 1.1,
  },
  {
    fromPath: "/compare/us-military-vs-china-military",
    anchorText: "World War 1 vs World War 2",
    linkType: "related" as const,
    position: "inline" as const,
    score: 1.0,
  },
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

  // 1) Comparison meta rewrites
  for (const c of COMPARISON_META) {
    const row = await prisma.comparison.findUnique({ where: { slug: c.slug }, select: { id: true, metaTitle: true } });
    if (!row) {
      results.push(`! comparison not found: ${c.slug}`);
      continue;
    }
    await prisma.comparison.update({
      where: { slug: c.slug },
      data: { metaTitle: c.metaTitle, metaDescription: c.metaDescription },
    });
    results.push(`✓ comparison meta set: /compare/${c.slug}  T(${c.metaTitle.length})`);
  }

  // 2) Blog meta rewrites
  for (const b of BLOG_META) {
    const row = await prisma.blogArticle.findUnique({ where: { slug: b.slug }, select: { id: true, metaTitle: true } });
    if (!row) {
      results.push(`! blog not found: ${b.slug}`);
      continue;
    }
    await prisma.blogArticle.update({
      where: { slug: b.slug },
      data: { metaTitle: b.metaTitle, metaDescription: b.metaDescription },
    });
    results.push(`✓ blog meta set: /blog/${b.slug}  T(${b.metaTitle.length})`);
  }

  // 3) Internal links into ww1-vs-ww2
  let linksAdded = 0;
  for (const link of WW1_INBOUND_LINKS) {
    const fromExists = await prisma.comparison.findFirst({
      where: { slug: link.fromPath.replace("/compare/", "") },
      select: { id: true },
    });
    if (!fromExists) {
      results.push(`  · skip (from-page missing): ${link.fromPath}`);
      continue;
    }
    const existing = await prisma.internalLink.findFirst({
      where: { fromPath: link.fromPath, toPath: WW1_LINK_TARGET },
    });
    if (existing) {
      results.push(`  = link exists: ${link.fromPath} → ${WW1_LINK_TARGET}`);
      continue;
    }
    await prisma.internalLink.create({
      data: {
        fromPath: link.fromPath,
        toPath: WW1_LINK_TARGET,
        anchorText: link.anchorText,
        linkType: link.linkType,
        position: link.position,
        score: link.score,
      },
    });
    linksAdded++;
    results.push(`  ✓ link added: ${link.fromPath} → ${WW1_LINK_TARGET}`);
  }
  results.push(`Internal links added: ${linksAdded}`);

  return NextResponse.json({
    ok: true,
    summary: `DAN-1685: ${COMPARISON_META.length} comparison metas + ${BLOG_META.length} blog meta + ${linksAdded} internal links`,
    results,
  });
}
