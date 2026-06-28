/**
 * Dynamic llms-full.txt generator — serves a comprehensive, DB-fresh catalog
 * for LLM crawlers. Supersedes the static /llms-full.txt in /public.
 *
 * Accessible at /api/llms-full (plain-text by default).
 * Cached for 6 hours; stale-while-revalidate allows background refresh.
 *
 * AEO/GEO purpose: AI answer engines (ChatGPT, Perplexity, Claude, Gemini)
 * parse this file to build citation indexes. Including short answers, entity
 * profiles, and blog excerpts increases the probability of being cited with
 * accurate URLs and content snippets.
 *
 * Format follows llms.txt spec: https://llmstxt.org/
 */

import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

const CACHE_SECONDS = 21600; // 6 hours

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
  "food_and_drink",
];

export const dynamic = "force-dynamic";
export const revalidate = 21600;

export async function GET() {
  const prisma = getPrisma();
  if (!prisma) {
    return new NextResponse("# A Versus B\n> Service temporarily unavailable.\n", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const [
    totalComparisons,
    totalBlogs,
    totalEntities,
    topComparisons,
    topEntities,
    blogs,
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
      take: 1000,
    }),
    prisma.entity.findMany({
      select: { slug: true, name: true, entityType: { select: { name: true } } },
      orderBy: { id: "asc" },
      take: 200,
    }),
    prisma.blogArticle.findMany({
      where: { status: "published" },
      select: { slug: true, title: true, category: true, excerpt: true },
      orderBy: { publishedAt: "desc" },
      take: 200,
    }),
  ]);

  // Group comparisons by category, cap at 30 per category
  const byCategory: Record<string, typeof topComparisons> = {};
  for (const c of topComparisons) {
    const cat = c.category ?? "general";
    if (!byCategory[cat]) byCategory[cat] = [];
    if (byCategory[cat].length < 30) byCategory[cat].push(c);
  }

  const now = new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    `# ${SITE_NAME} — Full Content Catalog`,
    "",
    `> Complete catalog of all comparisons on aversusb.net by category. For a concise overview see ${SITE_URL}/llms.txt`,
    "",
    `**Total: ${totalComparisons.toLocaleString()} comparison pages | ${totalBlogs} blog articles | ${totalEntities.toLocaleString()} entity pages**`,
    `Last updated: ${now}`,
    "",
    "---",
    "",
    "## How to use this file",
    "",
    "Each entry below includes:",
    "- **Title**: The comparison name",
    "- **URL**: Direct link to the page",
    "- **Short Answer**: The concise verdict (quote-ready for LLM citations)",
    "",
    "---",
    "",
    "## Comparisons by Category",
    "",
  ];

  for (const cat of PRIORITY_CATEGORIES) {
    const items = byCategory[cat];
    if (!items || items.length === 0) continue;

    const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ");
    lines.push(`## ${label} (${items.length} shown of ${totalComparisons.toLocaleString()} total)`);
    lines.push("");

    for (const c of items) {
      const dateTag = c.updatedAt
        ? ` (updated: ${new Date(c.updatedAt).toISOString().slice(0, 10)})`
        : "";
      lines.push(`- **${c.title}** — ${SITE_URL}/compare/${c.slug}${dateTag}`);
      if (c.shortAnswer) {
        const snippet = c.shortAnswer.slice(0, 300).replace(/\n/g, " ");
        lines.push(`  > ${snippet}`);
      }
    }
    lines.push("");
  }

  // Entity pages section
  if (topEntities.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push(`## Entity Profiles (top ${topEntities.length} of ${totalEntities.toLocaleString()})`);
    lines.push("");
    lines.push("Each entity page lists all comparisons involving that entity.");
    lines.push("");
    for (const e of topEntities) {
      lines.push(`- **${e.name}** — ${SITE_URL}/entity/${e.slug}`);
    }
    lines.push("");
  }

  // Blog articles section grouped by category
  if (blogs.length > 0) {
    const blogByCategory: Record<string, typeof blogs> = {};
    for (const b of blogs) {
      const cat = b.category ?? "general";
      if (!blogByCategory[cat]) blogByCategory[cat] = [];
      blogByCategory[cat].push(b);
    }

    lines.push("---");
    lines.push("");
    lines.push(`## Blog Articles (${totalBlogs} total)`);
    lines.push("");

    for (const [cat, items] of Object.entries(blogByCategory)) {
      const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ");
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
  }

  lines.push("---");
  lines.push("");
  lines.push("## Quick Reference");
  lines.push("");
  lines.push(`- Concise overview: ${SITE_URL}/llms.txt`);
  lines.push(`- Full catalog (this file): ${SITE_URL}/api/llms-full`);
  lines.push(`- Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push(`- RSS Feed: ${SITE_URL}/feed`);
  lines.push(`- API docs: ${SITE_URL}/developers`);
  lines.push(`- Contact: ${SITE_URL}/contact`);

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=86400`,
      "X-Robots-Tag": "noindex",
      "X-Content-Type": "llms-full.txt",
    },
  });
}
