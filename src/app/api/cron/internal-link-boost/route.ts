import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/**
 * GET /api/cron/internal-link-boost
 *
 * Weekly cron that identifies published comparisons with few explicit
 * InternalLink records and auto-creates same-category + related-category
 * links from the highest-viewed peers.
 *
 * Why: The InternalLink engine (internal-linking-engine.ts) heavily weights
 * explicit InternalLink records (score 40 vs 20 for same-category). Pages
 * with no explicit records rely solely on entity-overlap and category signals,
 * which may produce fewer and less relevant related-comparison widgets
 * (DAN-1619 priority 2). This cron fills that gap for top-traffic pages.
 *
 * Schedule in vercel.json:
 *   { "path": "/api/cron/internal-link-boost", "schedule": "0 10 * * 3" }
 */

const RELATED_CATEGORIES: Record<string, string[]> = {
  sports: ["celebrities"],
  countries: ["military", "economy"],
  technology: ["products", "companies"],
  products: ["technology", "brands"],
  celebrities: ["sports"],
  history: ["military", "countries"],
  military: ["countries", "history"],
  economy: ["countries", "companies"],
  companies: ["brands", "technology", "economy"],
  brands: ["products", "companies"],
  health: ["products"],
  entertainment: ["celebrities"],
  automotive: ["products", "technology"],
  software: ["technology", "companies"],
  finance: ["economy", "companies"],
  education: [],
  travel: ["countries"],
};

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

  // Find top-viewed comparisons with fewer than 5 explicit inbound InternalLink records
  const underlinked = await prisma.$queryRaw<
    { id: string; slug: string; title: string; category: string; view_count: number; link_count: bigint }[]
  >`
    SELECT c.id, c.slug, c.title, c.category, c.view_count,
           COUNT(il.id) AS link_count
    FROM comparisons c
    LEFT JOIN internal_links il ON il.to_path = CONCAT('/compare/', c.slug)
    WHERE c.status = 'published'
    GROUP BY c.id, c.slug, c.title, c.category, c.view_count
    HAVING COUNT(il.id) < 5
    ORDER BY c.view_count DESC
    LIMIT 40
  `;

  if (!underlinked.length) {
    return NextResponse.json({ message: "All top pages already have sufficient links", created: 0 });
  }

  let created = 0;
  const errors: string[] = [];

  for (const page of underlinked) {
    if (!page.category) continue;

    // Find top 5 peers in the same category (excluding self)
    const peers = await prisma.comparison.findMany({
      where: {
        status: "published",
        category: page.category,
        slug: { not: page.slug },
      },
      select: { slug: true, title: true },
      orderBy: { viewCount: "desc" },
      take: 5,
    });

    // Also pull 2 from related categories
    const relatedCats = RELATED_CATEGORIES[page.category] ?? [];
    const relatedPeers = relatedCats.length > 0
      ? await prisma.comparison.findMany({
          where: {
            status: "published",
            category: { in: relatedCats },
          },
          select: { slug: true, title: true, category: true },
          orderBy: { viewCount: "desc" },
          take: 2,
        })
      : [];

    const toCreate = [
      ...peers.map((p) => ({ slug: p.slug, title: p.title, type: "related" })),
      ...relatedPeers.map((p) => ({ slug: p.slug, title: p.title, type: "category" })),
    ];

    for (const peer of toCreate) {
      const fromPath = `/compare/${page.slug}`;
      const toPath = `/compare/${peer.slug}`;

      // Skip if already exists (avoid duplicate index)
      const existing = await prisma.internalLink.findFirst({
        where: { fromPath, toPath },
      });
      if (existing) continue;

      try {
        await prisma.internalLink.create({
          data: {
            fromPath,
            toPath,
            anchorText: peer.title,
            linkType: peer.type,
            position: "module",
            score: 1.2, // slight boost over default 1.0 to surface as top suggestion
          },
        });
        created++;
      } catch (err) {
        errors.push(`${page.slug}→${peer.slug}: ${String(err)}`);
      }
    }
  }

  return NextResponse.json({
    pagesAudited: underlinked.length,
    created,
    errors: errors.slice(0, 10),
  });
}
