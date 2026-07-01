import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { BEST_CONFIG } from "@/lib/data/best-entries";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/v1/best — List all published best-of pages
// Supports ?category filter, ?limit (default 20, max 100), ?offset.
// Each item includes slug, title, h1, category, itemCount, url, and apiUrl.

export const dynamic = "force-dynamic";

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

type BestPage = {
  slug: string;
  title: string | undefined;
  metaTitle?: string;
  category?: string;
  itemCount: number;
  publishedAt?: string;
  updatedAt?: string;
  url: string;
  apiUrl: string;
};

function buildDataFeed(pages: BestPage[], total: number) {
  return {
    "@context": "https://schema.org",
    "@type": "DataFeed",
    "@id": `${SITE_URL}/api/v1/best#datafeed`,
    name: `${SITE_NAME} Best-Of Lists`,
    description: `Ranked best-of lists from ${SITE_NAME} — top picks across technology, software, sports, countries, and more.`,
    url: `${SITE_URL}/api/v1/best`,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    license: "https://creativecommons.org/licenses/by/4.0/",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    about: { "@type": "CollectionPage", url: `${SITE_URL}/best`, name: `${SITE_NAME} Best-Of Lists` },
    totalItems: total,
    dataFeedElement: pages.map((p) => ({
      "@type": "DataFeedItem",
      item: {
        "@type": "ItemList",
        "@id": `${p.url}#itemlist`,
        name: p.title,
        url: p.url,
        numberOfItems: p.itemCount,
      },
    })),
  };
}

function buildSummary(total: number, pages: BestPage[]) {
  const s = total > 0
    ? `${total} best-of lists on ${SITE_NAME}. Sample: ${pages.slice(0, 3).map((p) => p.title).join(", ")}.`
    : `No best-of lists available.`;
  return s.slice(0, 500);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const prisma = getPrisma();
  if (prisma) {
    const [total, rows] = await Promise.all([
      prisma.bestPage.count({ where: { status: "published", ...(category ? { category } : {}) } }),
      prisma.bestPage.findMany({
        where: { status: "published", ...(category ? { category } : {}) },
        select: {
          slug: true,
          title: true,
          h1: true,
          category: true,
          publishedAt: true,
          updatedAt: true,
          listItems: true,
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: offset,
      }),
    ]);

    const hasMore = offset + limit < total;
    const pages = rows.map((r) => ({
      slug: r.slug,
      title: r.h1 ?? r.title,
      metaTitle: r.title,
      category: r.category ?? undefined,
      itemCount: Array.isArray(r.listItems) ? r.listItems.length : 0,
      publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString() : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : undefined,
      url: `${SITE_URL}/best/${r.slug}`,
      apiUrl: `${SITE_URL}/api/v1/best/${r.slug}`,
    }));

    const dataFeed = buildDataFeed(pages, total);
    const summary = buildSummary(total, pages);
    return NextResponse.json(
      { total, limit, offset, hasMore, pages, dataFeed },
      { headers: { ...HEADERS, "X-Summary": summary } }
    );
  }

  // Static fallback
  const allEntries = Object.values(BEST_CONFIG).filter(
    (e) => !category || e.category === category
  );
  const total = allEntries.length;
  const pages = allEntries.slice(offset, offset + limit).map((e) => ({
    slug: e.slug,
    title: e.h1,
    metaTitle: e.title,
    category: e.category ?? undefined,
    itemCount: e.listItems.length,
    publishedAt: e.publishedAt,
    updatedAt: e.updatedAt,
    url: `${SITE_URL}/best/${e.slug}`,
    apiUrl: `${SITE_URL}/api/v1/best/${e.slug}`,
  }));

  const dataFeed = buildDataFeed(pages, total);
  const summary = buildSummary(total, pages);
  return NextResponse.json(
    { total, limit, offset, hasMore: offset + limit < total, pages, dataFeed },
    { headers: { ...HEADERS, "X-Summary": summary } }
  );
}
