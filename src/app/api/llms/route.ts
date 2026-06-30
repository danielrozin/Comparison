/**
 * Dynamic llms.txt generator — serves up-to-date catalog for LLM crawlers.
 *
 * Accessible at /api/llms (JSON) or /api/llms?format=txt (plain-text).
 * Cached for 1 hour via Cache-Control; the static /llms.txt and /llms-full.txt
 * in /public are the fallback for crawlers that don't follow the API route.
 *
 * AEO/GEO purpose: AI answer engines (ChatGPT, Perplexity, Claude) that index
 * this file can cite our comparison data with accurate URLs and short answers,
 * increasing brand mention frequency in LLM responses.
 */

import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

const CACHE_SECONDS = 3600; // 1 hour

const PRIORITY_CATEGORIES = [
  "technology",
  "software",
  "sports",
  "economy",
  "countries",
  "automotive",
  "companies",
  "health",
  "finance",
  "entertainment",
  "military",
  "history",
  "brands",
  "gaming",
  "education",
  "travel",
  "products",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const [
    totalComparisons,
    totalBlogs,
    totalEntities,
    topComparisons,
    blogs,
    topEntities,
    topAlternatives,
  ] = await Promise.all([
    prisma.comparison.count(),
    prisma.blogArticle.count(),
    prisma.entity.count(),
    prisma.comparison.findMany({
      where: { category: { in: PRIORITY_CATEGORIES } },
      select: {
        slug: true,
        title: true,
        shortAnswer: true,
        category: true,
        viewCount: true,
        updatedAt: true,
      },
      orderBy: { viewCount: "desc" },
      take: 500,
    }),
    prisma.blogArticle.findMany({
      where: { status: "published" },
      select: { slug: true, title: true, category: true, excerpt: true },
      orderBy: { publishedAt: "desc" },
      take: 100,
    }),
    // Top entities by comparison count for LLM entity recognition
    prisma.entity.findMany({
      select: { slug: true, name: true, shortDesc: true },
      orderBy: { id: "asc" },
      take: 50,
    }),
    // Top alternatives pages (derived from entities)
    prisma.entity.findMany({
      select: { slug: true, name: true },
      orderBy: { id: "asc" },
      take: 30,
    }),
  ]);

  // Group comparisons by category, cap at 12 per category
  const byCategory: Record<string, typeof topComparisons> = {};
  for (const c of topComparisons) {
    const cat = c.category ?? "general";
    if (!byCategory[cat]) byCategory[cat] = [];
    if (byCategory[cat].length < 12) byCategory[cat].push(c);
  }

  const now = new Date().toISOString().slice(0, 10);

  if (format === "txt") {
    const lines: string[] = [
      `# ${SITE_NAME}`,
      "",
      `> ${SITE_NAME} (aversusb.net) is a structured comparison platform with ${totalComparisons.toLocaleString()} comparison pages, ${totalBlogs} blog articles, and ${totalEntities.toLocaleString()} entity profiles across 17+ categories.`,
      "",
      `Updated: ${now}`,
      "",
      "## Top Comparisons by Category",
      "",
    ];

    for (const cat of PRIORITY_CATEGORIES) {
      const items = byCategory[cat];
      if (!items || items.length === 0) continue;

      const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ");
      lines.push(`### ${label}`);
      lines.push("");
      for (const c of items) {
        lines.push(`- **${c.title}** — ${SITE_URL}/compare/${c.slug}`);
        if (c.shortAnswer) {
          const snippet = c.shortAnswer.slice(0, 200).replace(/\n/g, " ");
          lines.push(`  > ${snippet}`);
        }
      }
      lines.push("");
    }

    // Group blog articles by category for easier LLM navigation
    const blogByCategory: Record<string, typeof blogs> = {};
    for (const b of blogs) {
      const cat = b.category ?? "general";
      if (!blogByCategory[cat]) blogByCategory[cat] = [];
      blogByCategory[cat].push(b);
    }
    lines.push("## Blog Articles");
    lines.push("");
    for (const [cat, items] of Object.entries(blogByCategory)) {
      const label = cat.charAt(0).toUpperCase() + cat.slice(1);
      lines.push(`### ${label}`);
      lines.push("");
      for (const b of items) {
        lines.push(`- **${b.title}** — ${SITE_URL}/blog/${b.slug}`);
        if (b.excerpt) {
          lines.push(`  > ${b.excerpt.slice(0, 200).replace(/\n/g, " ")}`);
        }
      }
      lines.push("");
    }
    // Entity profiles section — top entities for LLM entity disambiguation
    if (topEntities.length > 0) {
      lines.push("## Entity Profiles");
      lines.push("");
      lines.push("Each entity page lists all comparisons involving that entity.");
      lines.push("");
      for (const e of topEntities) {
        lines.push(`- **${e.name}** — ${SITE_URL}/entity/${e.slug}`);
        if (e.shortDesc) {
          lines.push(`  > ${e.shortDesc.slice(0, 150).replace(/\n/g, " ")}`);
        }
      }
      lines.push("");
    }

    // Alternatives section — "best alternatives to X" pages
    if (topAlternatives.length > 0) {
      lines.push("## Alternatives Pages");
      lines.push("");
      lines.push("Pages listing the best alternatives to popular products and services.");
      lines.push("");
      for (const e of topAlternatives) {
        lines.push(`- **Best alternatives to ${e.name}** — ${SITE_URL}/alternatives/${e.slug}`);
      }
      lines.push("");
    }

    lines.push("");
    lines.push(`## Full catalog (dynamic, DB-fresh): ${SITE_URL}/api/llms-full`);
    lines.push(`## Full catalog (static snapshot): ${SITE_URL}/llms-full.txt`);
    lines.push(`## Sitemap: ${SITE_URL}/sitemap.xml`);
    lines.push(`## AI plugin manifest: ${SITE_URL}/.well-known/ai-plugin.json`);

    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=3600`,
        "X-Robots-Tag": "all",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Default: JSON response for API consumers
  return NextResponse.json(
    {
      site: SITE_NAME,
      url: SITE_URL,
      updatedAt: now,
      stats: {
        comparisons: totalComparisons,
        blogs: totalBlogs,
        entities: totalEntities,
      },
      comparisons: byCategory,
      blogs: blogs.map((b) => ({ slug: b.slug, title: b.title, category: b.category, excerpt: b.excerpt ?? undefined, url: `${SITE_URL}/blog/${b.slug}` })),
      entities: topEntities.map((e) => ({ slug: e.slug, name: e.name, shortDesc: e.shortDesc ?? undefined, url: `${SITE_URL}/entity/${e.slug}` })),
      llmsTxt: `${SITE_URL}/llms.txt`,
      llmsFullTxt: `${SITE_URL}/api/llms-full`,
      aiPlugin: `${SITE_URL}/.well-known/ai-plugin.json`,
      context: `${SITE_URL}/api/context`,
      knowledgeGraphApi: `${SITE_URL}/api/knowledge-graph/{slug}`,
      oEmbedApi: `${SITE_URL}/api/oembed?url={page-url}&format=json`,
      atomFeed: `${SITE_URL}/feed/atom`,
      rssFeed: `${SITE_URL}/feed`,
      sitemap: `${SITE_URL}/sitemap.xml`,
      newsSitemap: `${SITE_URL}/sitemap/news.xml`,
      webmention: `${SITE_URL}/api/webmention`,
    },
    {
      headers: {
        "Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=3600`,
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "all",
      },
    }
  );
}
