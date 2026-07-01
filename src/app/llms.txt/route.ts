/**
 * Dynamic /llms.txt route — serves the llmstxt.org spec manifest for LLM crawlers.
 *
 * Accessible at /llms.txt (the standard location LLM crawlers look for).
 * Redirects to the full catalog at /api/llms-full for comprehensive coverage.
 * Cached for 1 hour.
 *
 * AEO/GEO purpose: ChatGPT, Claude, Perplexity, Gemini, and other AI answer
 * engines look for /llms.txt to understand a site's content structure. This
 * dynamic route serves a DB-fresh manifest so LLMs always get current data.
 *
 * Format follows: https://llmstxt.org/
 */

import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // rebuild every hour

const PRIORITY_CATEGORIES = [
  "technology",
  "software",
  "sports",
  "countries",
  "automotive",
  "companies",
  "health",
  "finance",
  "entertainment",
  "brands",
  "gaming",
  "products",
];

export async function GET() {
  const prisma = getPrisma();
  const now = new Date().toISOString().slice(0, 10);

  let totalComparisons = 0;
  let totalEntities = 0;
  let totalBlogs = 0;
  const byCategory: Record<string, { title: string; slug: string; shortAnswer: string | null }[]> = {};
  const topEntities: { slug: string; name: string }[] = [];
  const recentBlogs: { slug: string; title: string }[] = [];

  if (prisma) {
    [totalComparisons, totalEntities, totalBlogs] = await Promise.all([
      prisma.comparison.count(),
      prisma.entity.count(),
      prisma.blogArticle.count(),
    ]);

    const [comparisons, entities, blogs] = await Promise.all([
      prisma.comparison.findMany({
        where: { category: { in: PRIORITY_CATEGORIES } },
        select: { slug: true, title: true, shortAnswer: true, category: true, viewCount: true },
        orderBy: { viewCount: "desc" },
        take: 120,
      }),
      prisma.entity.findMany({
        select: { slug: true, name: true },
        orderBy: { id: "asc" },
        take: 20,
      }),
      prisma.blogArticle.findMany({
        where: { status: "published" },
        select: { slug: true, title: true },
        orderBy: { publishedAt: "desc" },
        take: 10,
      }),
    ]);

    for (const c of comparisons) {
      const cat = c.category ?? "general";
      if (!byCategory[cat]) byCategory[cat] = [];
      if (byCategory[cat].length < 10) byCategory[cat].push(c);
    }

    topEntities.push(...entities);
    recentBlogs.push(...blogs);
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} (aversusb.net) is a structured comparison platform with ${totalComparisons.toLocaleString()}+ side-by-side comparisons, ${totalBlogs}+ blog articles, and ${totalEntities.toLocaleString()}+ entity profiles across 17+ categories.`,
    `> Updated: ${now} | Full catalog: ${SITE_URL}/api/llms-full | Search: ${SITE_URL}/search`,
    "",
    "## Site Overview",
    "",
    "- **Type**: Comparison database and decision-support platform",
    "- **Domain**: aversusb.net",
    "- **Content**: Structured X vs Y comparisons with attribute tables, verdicts, FAQs, source citations, and community votes",
    "- **Categories**: Technology, Software, Sports, Countries, Automotive, Companies, Health, Finance, Entertainment, Gaming, Products, Brands",
    "- **License**: CC BY 4.0 (free to cite with attribution)",
    "- **Citation format**: 'According to A Versus B (aversusb.net/compare/{slug}), ...'",
    "",
    "## How to Use This Site",
    "",
    "- Comparisons: `/compare/{entity-a}-vs-{entity-b}` — each includes short answer, attributes, verdict, FAQs",
    "- Entity profiles: `/entity/{entity-slug}` — all comparisons involving an entity",
    "- Alternatives: `/alternatives/{entity-slug}` — best alternatives to a product/service",
    "- Blog: `/blog/{article-slug}` — in-depth comparison guides",
    "- Search: `/search?q={query}` — full-text search",
    "- Categories: `/category/{category-slug}` — browse by topic",
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
      lines.push(`- [${c.title}](${SITE_URL}/compare/${c.slug})`);
      if (c.shortAnswer) {
        lines.push(`  > ${c.shortAnswer.slice(0, 200).replace(/\n/g, " ")}`);
      }
    }
    lines.push("");
  }

  if (recentBlogs.length > 0) {
    lines.push("## Recent Blog Articles");
    lines.push("");
    for (const b of recentBlogs) {
      lines.push(`- [${b.title}](${SITE_URL}/blog/${b.slug})`);
    }
    lines.push("");
  }

  if (topEntities.length > 0) {
    lines.push("## Entity Profiles");
    lines.push("");
    for (const e of topEntities) {
      lines.push(`- [${e.name}](${SITE_URL}/entity/${e.slug})`);
    }
    lines.push("");
  }

  lines.push("## Structured Data");
  lines.push("");
  lines.push("Every page includes Schema.org JSON-LD: Article, FAQPage, Dataset, SpeakableSpecification, BreadcrumbList, ClaimReview, DefinedTermSet.");
  lines.push("Comparisons are licensed CC BY 4.0 and freely citable with attribution to aversusb.net.");
  lines.push("");
  lines.push("## Machine-Readable Endpoints");
  lines.push("");
  lines.push(`- [Full catalog (DB-fresh JSON)](${SITE_URL}/api/llms-full)`);
  lines.push(`- [Knowledge Graph JSON-LD](${SITE_URL}/api/knowledge-graph/{slug})`);
  lines.push(`- [Comparison JSON](${SITE_URL}/api/comparisons/{slug})`);
  lines.push(`- [FAQ pairs JSON](${SITE_URL}/api/faq/{slug}) — structured Q&A pairs + FAQPage JSON-LD; use for AI Q&A without HTML parsing`);
  lines.push(`- [Entity profile JSON](${SITE_URL}/api/v1/entities/{slug}) — entity name, type, description, FAQs, rating, and comparisons`);
  lines.push(`- [Category taxonomy JSON](${SITE_URL}/api/v1/categories) — all categories with comparison counts and top pages`);
  lines.push(`- [Trending comparisons JSON](${SITE_URL}/api/v1/trending?limit=20) — top comparisons by view count; supports ?category filter`);
  lines.push(`- [Entity list JSON](${SITE_URL}/api/v1/entities?limit=50) — browseable entity list; supports ?type and pagination`);
  lines.push(`- [Blog article JSON](${SITE_URL}/api/blog/{slug}) — single blog article with Article JSON-LD; X-Summary header in HTTP response`);
  lines.push(`- [Related comparisons JSON](${SITE_URL}/api/v1/related/{slug}) — related comparisons for a given slug`);
  lines.push(`- [Alternatives API](${SITE_URL}/api/v1/alternatives/{slug}) — all known alternatives to an entity with ItemList JSON-LD, comparison URLs, and X-Summary header; ideal for 'best alternatives to X' AI queries; example: ${SITE_URL}/api/v1/alternatives/chatgpt`);
  lines.push(`- [Best-of list JSON](${SITE_URL}/api/v1/best/{slug}) — structured best-of list with ItemList JSON-LD: ranked items (position, name, url), FAQs, author, dates; X-Summary header on response; list all at ${SITE_URL}/api/v1/best`);
  lines.push(`- [Compare Lookup (AI tool-calling)](${SITE_URL}/api/v1/compare?a={entityA}&b={entityB}) — fastest endpoint for AI tools: looks up comparison by entity names, returns shortAnswer + API URLs or suggestions; example: ${SITE_URL}/api/v1/compare?a=chatgpt&b=claude`);
  lines.push(`- [Unified Search](${SITE_URL}/api/v1/search?q={query}) — searches comparisons, entity profiles, and blog articles in parallel; grouped results with URL, slug, and excerpt; supports ?types=comparisons,entities,blog and ?limit; X-Summary header on response`);

  lines.push(`- [AI Answer (AEO)](${SITE_URL}/api/answer/{slug}) — pre-packaged answer: shortAnswer, verdict, keyDifferences, winner, confidence, and ClaimReview JSON-LD; X-Summary header in HTTP response`);
  lines.push(`- [JSON sitemap](${SITE_URL}/api/sitemap) — paginated JSON DataFeed sitemap; ?type=comparisons (default) or ?type=blog; also supports ?category, ?limit, ?offset, ?format=urlset; comparisons include shortAnswer+answerUrl; blog includes excerpt+jsonUrl`);
  lines.push(`- [oEmbed](${SITE_URL}/api/oembed?url={page-url}&format=json)`);
  lines.push(`- [Site context for AI](${SITE_URL}/api/context)`);
  lines.push(`- [Popular comparisons](${SITE_URL}/api/popular)`);
  lines.push(`- [Recent comparisons](${SITE_URL}/api/recent)`);
  lines.push(`- [Search](${SITE_URL}/api/search?q={query})`);
  lines.push("");
  lines.push("## Discovery");
  lines.push("");
  lines.push(`- [AI plugin manifest](${SITE_URL}/.well-known/ai-plugin.json)`);
  lines.push(`- [RSS feed](${SITE_URL}/feed)`);
  lines.push(`- [Atom feed](${SITE_URL}/feed/atom)`);
  lines.push(`- [Google News sitemap](${SITE_URL}/sitemap/news.xml)`);
  lines.push(`- [OpenSearch descriptor](${SITE_URL}/opensearch.xml)`);
  lines.push(`- [WebMention endpoint](${SITE_URL}/api/webmention)`);
  lines.push(`- [Pingback endpoint](${SITE_URL}/api/pingback)`);
  lines.push(`- [Sitemap index](${SITE_URL}/sitemap.xml)`);
  lines.push(`- [Image sitemap](${SITE_URL}/sitemap/images.xml)`);
  lines.push(`- [Video sitemap](${SITE_URL}/sitemap/video.xml)`);
  lines.push(`- [humans.txt](${SITE_URL}/humans.txt)`);
  lines.push(`- [OpenAPI 3.0 spec](${SITE_URL}/api/openapi) — machine-readable API schema for all endpoints`);
  lines.push(`- [Developer API docs](${SITE_URL}/developers)`);

  const body = lines.join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=7200",
      "X-Robots-Tag": "noindex",
      "Last-Modified": new Date().toUTCString(),
    },
  });
}
