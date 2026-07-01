import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

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
// Includes DataFeed JSON-LD so AI crawlers can treat the entity corpus as a typed dataset.

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 200);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10), 0);

  const whereClause = {
    status: "published",
    ...(type ? { entityType: { name: { equals: type, mode: "insensitive" as const } } } : {}),
  };

  const [entities, total] = await Promise.all([
    prisma.entity.findMany({
      where: whereClause,
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
    }),
    prisma.entity.count({ where: whereClause }),
  ]);

  const hasMore = offset + limit < total;
  const baseUrl = `${SITE_URL}/api/v1/entities`;
  const nextUrl = hasMore
    ? `${baseUrl}?limit=${limit}&offset=${offset + limit}${type ? `&type=${encodeURIComponent(type)}` : ""}`
    : null;

  const mappedEntities = entities.map((e) => ({
    slug: e.slug,
    name: e.name,
    type: e.entityType.name,
    shortDesc: e.shortDesc,
    url: `${SITE_URL}/entity/${e.slug}`,
    profileUrl: `${SITE_URL}/api/v1/entities/${e.slug}`,
    alternativesUrl: `${SITE_URL}/api/v1/alternatives/${e.slug}`,
    updatedAt: e.updatedAt,
  }));

  // DataFeed JSON-LD — positions the entity corpus as a typed machine-readable dataset.
  // AI crawlers (Perplexity, ChatGPT, Google Dataset Search) use DataFeed to discover
  // and index structured entity data without crawling individual entity pages.
  const dataFeed = {
    "@context": "https://schema.org",
    "@type": "DataFeed",
    "@id": `${SITE_URL}/api/v1/entities#datafeed`,
    name: `${SITE_NAME} Entity Profiles`,
    description: `Structured entity profiles from ${SITE_NAME} — covering products, software, countries, athletes, companies, and more.`,
    url: baseUrl,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    license: "https://creativecommons.org/licenses/by/4.0/",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    ...(type ? { about: { "@type": "Thing", name: type } } : {}),
    dataFeedElement: mappedEntities.map((e) => ({
      "@type": "DataFeedItem",
      item: {
        "@type": "Thing",
        "@id": `${e.url}#entity`,
        name: e.name,
        description: e.shortDesc ?? undefined,
        url: e.url,
      },
    })),
  };

  const summary = mappedEntities.length > 0
    ? `${total.toLocaleString()} ${type ? type + " " : ""}entities on ${SITE_NAME}. Sample: ${mappedEntities.slice(0, 3).map((e) => e.name).join(", ")}.`
    : `No entities found${type ? ` of type ${type}` : ""}.`;

  return NextResponse.json(
    {
      total,
      limit,
      offset,
      hasMore,
      nextUrl,
      entities: mappedEntities,
      dataFeed,
    },
    {
      headers: {
        ...HEADERS,
        "X-Summary": summary.slice(0, 500),
      },
    }
  );
}
