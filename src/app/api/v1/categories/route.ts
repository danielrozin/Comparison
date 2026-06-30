import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CATEGORIES, SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/v1/categories
// Returns the full taxonomy of comparison categories with counts and top comparisons.
// Designed for AI tool discovery, topic-cluster authority signals, and developer integrations.

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

export async function GET() {
  // Count published comparisons per category
  const counts: Record<string, number> = {};
  const topComparisons: Record<string, { slug: string; title: string }[]> = {};

  try {
    const grouped = await prisma.comparison.groupBy({
      by: ["category"],
      where: { status: "published", category: { not: null } },
      _count: { _all: true },
    });
    for (const row of grouped) {
      if (row.category) counts[row.category] = row._count._all;
    }

    // Top 5 comparisons per category (by title alpha — proxy for editorial quality)
    for (const cat of CATEGORIES) {
      const items = await prisma.comparison.findMany({
        where: { status: "published", category: cat.slug },
        select: { slug: true, title: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
      topComparisons[cat.slug] = items;
    }
  } catch {
    // DB unavailable — return category list without counts
  }

  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/#taxonomy`,
    name: "A Versus B Comparison Taxonomy",
    url: `${SITE_URL}/category`,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    hasDefinedTerm: CATEGORIES.map((cat) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/category/${cat.slug}#term`,
      name: cat.name,
      url: `${SITE_URL}/category/${cat.slug}`,
      inDefinedTermSet: `${SITE_URL}/#taxonomy`,
    })),
  };

  const categories = CATEGORIES.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    url: `${SITE_URL}/category/${cat.slug}`,
    comparisonCount: counts[cat.slug] ?? 0,
    topComparisons: (topComparisons[cat.slug] ?? []).map((c) => ({
      slug: c.slug,
      title: c.title,
      url: `${SITE_URL}/compare/${c.slug}`,
    })),
  }));

  return NextResponse.json(
    {
      totalCategories: CATEGORIES.length,
      totalComparisons: Object.values(counts).reduce((a, b) => a + b, 0),
      categories,
      definedTermSetSchema,
    },
    { headers: HEADERS }
  );
}
