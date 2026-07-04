import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/v1/changes
//
// Incremental indexing feed — returns content added or updated since a
// given timestamp. AI crawlers and indexers can poll this endpoint daily
// (or hourly) to discover new content without re-crawling all 3,000+ pages.
//
// Query parameters:
//   since     — ISO8601 timestamp (default: 24 hours ago). e.g. ?since=2026-06-30T00:00:00Z
//   type      — "comparisons" | "blog" | "best" | "all" (default: all)
//   limit     — max results per type (default 100, max 500)
//   offset    — pagination offset
//
// Returns:
//   { generated_at, since, type, total, hasMore, nextUrl, changes: [] }
//   Each change: { slug, title, shortAnswer, comparisonUrl, answerUrl,
//                  schemaJsonLdUrl, knowledgeGraphUrl, category, action, changedAt }
//
// Use cases:
//   - AI crawl scheduler: check this daily and only re-fetch changed pages
//   - RSS/Atom alternative: structured feed of new content
//   - IndexNow trigger: feed these URLs to Bing/Yandex automatically
//
// ETag + Last-Modified: changes API is cacheable between polls — use 304
// conditional GET to save bandwidth if no new changes since last poll.
//
// X-Change-Count header: total count of changes in this window (for quick probe)

export const dynamic = "force-dynamic";

const CHANGES_URL = `${SITE_URL}/api/v1/changes`;

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
  "Vary": "Accept",
  "X-Source": SITE_NAME,
  "X-Source-URL": CHANGES_URL,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
  "X-Attribution": `${SITE_NAME} (${CHANGES_URL})`,
};

const DEFAULT_WINDOW_HOURS = 24;
const MAX_LIMIT = 500;
const DEFAULT_LIMIT = 100;

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const sinceParam = searchParams.get("since");
  const type = searchParams.get("type") ?? "all";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10), MAX_LIMIT);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const since = sinceParam
    ? new Date(sinceParam)
    : new Date(Date.now() - DEFAULT_WINDOW_HOURS * 60 * 60 * 1000);

  if (isNaN(since.getTime())) {
    return NextResponse.json(
      { error: "Invalid 'since' timestamp. Use ISO8601 format: ?since=2026-06-30T00:00:00Z" },
      { status: 400, headers: HEADERS }
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503, headers: HEADERS });
  }

  const generatedAt = new Date().toISOString();

  // Fetch comparisons + blog + best changes in parallel
  const includeBlog = type === "all" || type === "blog";
  const includeComp = type === "all" || type === "comparisons";
  const includeBest = type === "all" || type === "best";

  const [compChanges, blogChanges, bestChanges] = await Promise.all([
    includeComp ? prisma.comparison.findMany({
      where: {
        OR: [
          { createdAt: { gte: since } },
          { updatedAt: { gte: since } },
        ],
      },
      select: {
        slug: true,
        title: true,
        shortAnswer: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    }) : Promise.resolve([]),
    includeBlog ? prisma.blogArticle.findMany({
      where: {
        status: "published",
        OR: [
          { publishedAt: { gte: since } },
          { updatedAt: { gte: since } },
        ],
      },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        publishedAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    }) : Promise.resolve([]),
    includeBest ? prisma.bestPage.findMany({
      where: {
        status: "published",
        OR: [
          { publishedAt: { gte: since, not: null } },
          { updatedAt: { gte: since } },
        ],
      },
      select: {
        slug: true,
        title: true,
        description: true,
        publishedAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    }) : Promise.resolve([]),
  ]);

  const compItems = compChanges.map((c) => ({
    type: "comparison" as const,
    slug: c.slug,
    title: c.title,
    shortAnswer: c.shortAnswer ?? undefined,
    comparisonUrl: `${SITE_URL}/compare/${c.slug}`,
    answerUrl: `${SITE_URL}/api/answer/${c.slug}`,
    schemaJsonLdUrl: `${SITE_URL}/api/v1/schema/${c.slug}`,
    knowledgeGraphUrl: `${SITE_URL}/api/knowledge-graph/${c.slug}`,
    jsonUrl: `${SITE_URL}/api/comparisons/${c.slug}`,
    category: c.category ?? undefined,
    action: c.createdAt >= since ? "added" : "updated",
    changedAt: c.updatedAt.toISOString(),
  }));

  const blogItems = blogChanges.map((b) => ({
    type: "blog" as const,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt ?? undefined,
    url: `${SITE_URL}/blog/${b.slug}`,
    jsonUrl: `${SITE_URL}/api/blog/${b.slug}`,
    category: b.category ?? undefined,
    action: b.publishedAt && b.publishedAt >= since ? "added" : "updated",
    changedAt: b.updatedAt.toISOString(),
  }));

  const bestItems = bestChanges.map((p) => ({
    type: "best" as const,
    slug: p.slug,
    title: p.title,
    description: p.description ?? undefined,
    url: `${SITE_URL}/best/${p.slug}`,
    jsonUrl: `${SITE_URL}/api/v1/best/${p.slug}`,
    action: p.publishedAt && p.publishedAt >= since ? "added" : "updated",
    changedAt: p.updatedAt.toISOString(),
  }));

  // Merge and sort all changes by changedAt desc
  const allChanges = [...compItems, ...blogItems, ...bestItems].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  const total = allChanges.length;
  const hasMore = total === limit;
  const nextUrl = hasMore
    ? `${SITE_URL}/api/v1/changes?since=${since.toISOString()}&type=${type}&limit=${limit}&offset=${offset + limit}`
    : null;

  // ETag based on the most recent change timestamp
  const mostRecentChange = allChanges[0]?.changedAt;
  const etag = mostRecentChange
    ? `"changes-${since.getTime()}-${new Date(mostRecentChange).getTime()}"`
    : `"changes-${since.getTime()}-empty"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag, ...HEADERS } });
  }

  // DataFeed JSON-LD — signals to Google Dataset Search and AI crawlers that
  // this endpoint is a machine-readable feed of structured comparison data.
  const dataFeedSchema = {
    "@context": "https://schema.org",
    "@type": "DataFeed",
    "@id": CHANGES_URL,
    name: `${SITE_NAME} Changes Feed`,
    description: "Incremental feed of comparisons and blog articles added or updated since a given timestamp.",
    url: CHANGES_URL,
    inLanguage: "en-US",
    encodingFormat: "application/json",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    dateModified: mostRecentChange ?? generatedAt,
    dataFeedElement: allChanges.slice(0, 5).map((c) => ({
      "@type": "DataFeedItem",
      dateModified: c.changedAt,
      item: {
        "@type": c.type === "comparison" ? "Article" : c.type === "best" ? "CollectionPage" : "BlogPosting",
        "@id": c.type === "comparison"
          ? `${SITE_URL}/compare/${c.slug}#article`
          : c.type === "best"
          ? `${SITE_URL}/best/${c.slug}#collectionpage`
          : `${SITE_URL}/blog/${c.slug}#article`,
        name: c.title,
        url: c.type === "comparison"
          ? `${SITE_URL}/compare/${c.slug}`
          : c.type === "best"
          ? `${SITE_URL}/best/${c.slug}`
          : `${SITE_URL}/blog/${c.slug}`,
        ...("shortAnswer" in c && c.shortAnswer ? { abstract: String(c.shortAnswer) } : {}),
      },
    })),
  };

  return NextResponse.json(
    {
      generated_at: generatedAt,
      since: since.toISOString(),
      type,
      total,
      hasMore,
      ...(nextUrl ? { nextUrl } : {}),
      publisher: { name: SITE_NAME, url: SITE_URL },
      dataFeedSchema,
      changes: allChanges,
    },
    {
      headers: {
        ...HEADERS,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        ETag: etag,
        ...(mostRecentChange ? { "Last-Modified": new Date(mostRecentChange).toUTCString() } : {}),
        "X-Change-Count": String(total),
      },
    }
  );
}
