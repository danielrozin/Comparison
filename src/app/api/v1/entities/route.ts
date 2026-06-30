import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/utils/constants";

const HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

// GET /api/v1/entities
// Browseable entity list for AI tools and developer integrations.
// Supports filtering by type and pagination. Returns lightweight summaries.

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 200);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10), 0);

  const entities = await prisma.entity.findMany({
    where: {
      status: "published",
      ...(type ? { entityType: { name: { equals: type, mode: "insensitive" } } } : {}),
    },
    select: {
      slug: true,
      name: true,
      shortDesc: true,
      entityType: { select: { name: true } },
      updatedAt: true,
    },
    orderBy: { name: "asc" },
    take: limit,
    skip: offset,
  });

  const total = await prisma.entity.count({
    where: {
      status: "published",
      ...(type ? { entityType: { name: { equals: type, mode: "insensitive" } } } : {}),
    },
  });

  return NextResponse.json(
    {
      total,
      limit,
      offset,
      entities: entities.map((e) => ({
        slug: e.slug,
        name: e.name,
        type: e.entityType.name,
        shortDesc: e.shortDesc,
        url: `${SITE_URL}/entity/${e.slug}`,
        profileUrl: `${SITE_URL}/api/v1/entities/${e.slug}`,
        updatedAt: e.updatedAt,
      })),
    },
    { headers: HEADERS }
  );
}
