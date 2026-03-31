import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { verifyAdmin } from "@/lib/services/admin-auth";

// GET: affiliate click-through rate stats
export async function GET(request: NextRequest) {
  const auth = verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const { searchParams } = request.nextUrl;
  const days = parseInt(searchParams.get("days") || "30", 10);
  const comparisonSlug = searchParams.get("comparisonSlug");

  const since = new Date();
  since.setDate(since.getDate() - days);

  const where: Record<string, unknown> = { createdAt: { gte: since } };
  if (comparisonSlug) where.comparisonSlug = comparisonSlug;

  const [totalClicks, clicksByNetwork, clicksBySource, topComparisons, topEntities] =
    await Promise.all([
      prisma.affiliateClick.count({ where }),
      prisma.affiliateClick.groupBy({
        by: ["affiliateNetwork"],
        where,
        _count: true,
        orderBy: { _count: { affiliateNetwork: "desc" } },
      }),
      prisma.affiliateClick.groupBy({
        by: ["source"],
        where,
        _count: true,
        orderBy: { _count: { source: "desc" } },
      }),
      prisma.affiliateClick.groupBy({
        by: ["comparisonSlug"],
        where,
        _count: true,
        orderBy: { _count: { comparisonSlug: "desc" } },
        take: 20,
      }),
      prisma.affiliateClick.groupBy({
        by: ["entityId"],
        where,
        _count: true,
        orderBy: { _count: { entityId: "desc" } },
        take: 20,
      }),
    ]);

  // Enrich top entities with names
  const entityIds = topEntities.map((e) => e.entityId);
  const entities = entityIds.length > 0
    ? await prisma.entity.findMany({
        where: { id: { in: entityIds } },
        select: { id: true, name: true, slug: true },
      })
    : [];
  const entityMap = new Map(entities.map((e) => [e.id, e]));

  return NextResponse.json({
    period: { days, since: since.toISOString() },
    totalClicks,
    byNetwork: clicksByNetwork.map((r) => ({
      network: r.affiliateNetwork,
      clicks: r._count,
    })),
    bySource: clicksBySource.map((r) => ({
      source: r.source,
      clicks: r._count,
    })),
    topComparisons: topComparisons.map((r) => ({
      slug: r.comparisonSlug,
      clicks: r._count,
    })),
    topEntities: topEntities.map((r) => ({
      entityId: r.entityId,
      entity: entityMap.get(r.entityId) || null,
      clicks: r._count,
    })),
  });
}
