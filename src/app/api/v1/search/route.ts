import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/utils/constants";

// GET /api/v1/search?q={query}&types=comparisons,entities,blog&limit=10
//
// Unified search endpoint for AI tools — searches comparisons, entities, and blog
// articles in parallel and returns ranked results by type.
//
// Query parameters:
//   q: search query (required)
//   types: comma-separated list of types to search (default: comparisons,entities,blog)
//   limit: max results per type (default 5, max 20)
//
// Returns results grouped by type, each with URL, slug, title, and excerpt/shortAnswer.
// This is the ideal endpoint for AI tools doing intent-based content lookup.

export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const types = (searchParams.get("types") ?? "comparisons,entities,blog").split(",").map((t) => t.trim());
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "5", 10), 20);

  if (!q.trim()) {
    return NextResponse.json(
      { error: "?q parameter is required", example: `${SITE_URL}/api/v1/search?q=chatgpt+vs+claude` },
      { status: 400, headers: HEADERS }
    );
  }

  const prisma = getPrisma();

  const [compResults, entityResults, blogResults] = await Promise.all([
    // Comparisons (direct Prisma query to include shortAnswer)
    types.includes("comparisons") && prisma
      ? prisma.comparison
          .findMany({
            where: {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { slug: { contains: q.toLowerCase().replace(/\s+/g, "-") } },
                { category: { contains: q, mode: "insensitive" } },
              ],
            },
            select: {
              slug: true,
              title: true,
              shortAnswer: true,
              category: true,
            },
            orderBy: { viewCount: "desc" },
            take: limit,
          })
          .then((results) =>
            results.map((r) => ({
              type: "comparison" as const,
              slug: r.slug,
              title: r.title,
              url: `${SITE_URL}/compare/${r.slug}`,
              excerpt: r.shortAnswer ?? undefined,
              answerUrl: `${SITE_URL}/api/answer/${r.slug}`,
              knowledgeGraphUrl: `${SITE_URL}/api/knowledge-graph/${r.slug}`,
              schemaJsonLdUrl: `${SITE_URL}/api/v1/schema/${r.slug}`,
            }))
          )
      : Promise.resolve([]),

    // Entities
    types.includes("entities") && prisma
      ? prisma.entity
          .findMany({
            where: {
              status: "published",
              name: { contains: q, mode: "insensitive" },
            },
            select: {
              slug: true,
              name: true,
              shortDesc: true,
              entityType: { select: { name: true } },
            },
            take: limit,
          })
          .then((results) =>
            results.map((e) => ({
              type: "entity" as const,
              slug: e.slug,
              title: e.name,
              url: `${SITE_URL}/entity/${e.slug}`,
              excerpt: e.shortDesc ?? undefined,
              entityType: e.entityType?.name ?? undefined,
              profileUrl: `${SITE_URL}/api/v1/entities/${e.slug}`,
            }))
          )
      : Promise.resolve([]),

    // Blog articles
    types.includes("blog") && prisma
      ? prisma.blogArticle
          .findMany({
            where: {
              status: "published",
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { excerpt: { contains: q, mode: "insensitive" } },
                { tags: { hasSome: [q.toLowerCase()] } },
              ],
            },
            select: {
              slug: true,
              title: true,
              excerpt: true,
              category: true,
              publishedAt: true,
            },
            orderBy: { publishedAt: "desc" },
            take: limit,
          })
          .then((results) =>
            results.map((b) => ({
              type: "blog" as const,
              slug: b.slug,
              title: b.title,
              url: `${SITE_URL}/blog/${b.slug}`,
              excerpt: b.excerpt ?? undefined,
              category: b.category ?? undefined,
              jsonUrl: `${SITE_URL}/api/blog/${b.slug}`,
            }))
          )
      : Promise.resolve([]),
  ]);

  const total = compResults.length + entityResults.length + blogResults.length;

  return NextResponse.json(
    {
      query: q,
      total,
      comparisons: compResults,
      entities: entityResults,
      blog: blogResults,
    },
    {
      headers: {
        ...HEADERS,
        ...(compResults[0]?.excerpt ? { "X-Summary": compResults[0].excerpt.slice(0, 500) } : {}),
      },
    }
  );
}
