import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getComparisonsForEntity } from "@/lib/services/comparison-service";
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

// GET /api/v1/entities/[slug]
// Returns structured entity data for AI tools, knowledge graph ingestion,
// and developer integrations. Includes comparisons the entity appears in.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const entity = await prisma.entity.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      shortDesc: true,
      description: true,
      imageUrl: true,
      thumbnailUrl: true,
      metaTitle: true,
      metaDescription: true,
      entityType: { select: { name: true } },
      faqs: { select: { question: true, answer: true }, orderBy: { sortOrder: "asc" }, take: 10 },
      reviewAggregation: { select: { averageRating: true, totalReviews: true, smartScore: true, positivePct: true, negativePct: true } },
      metadata: true,
      updatedAt: true,
    },
  });

  if (!entity) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comparisons = await getComparisonsForEntity(slug);

  const url = `${SITE_URL}/entity/${slug}`;

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    name: entity.metaTitle || `${entity.name} — Comparisons & Profile`,
    description: entity.metaDescription || entity.shortDesc || undefined,
    about: {
      "@type": "Thing",
      "@id": `${url}#entity`,
      name: entity.name,
      description: entity.shortDesc ?? undefined,
      url,
      ...(entity.imageUrl ? { image: entity.imageUrl } : {}),
    },
    mainEntity: {
      "@type": "ItemList",
      name: `Comparisons involving ${entity.name}`,
      numberOfItems: comparisons.length,
      itemListElement: comparisons.slice(0, 10).map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/compare/${c.slug}`,
        name: c.title,
      })),
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
  };

  const response = {
    slug: entity.slug,
    name: entity.name,
    type: entity.entityType.name,
    url,
    shortDesc: entity.shortDesc,
    description: entity.description,
    imageUrl: entity.imageUrl,
    thumbnailUrl: entity.thumbnailUrl,
    rating: entity.reviewAggregation ?? null,
    faqs: entity.faqs,
    comparisonCount: comparisons.length,
    comparisons: comparisons.map((c) => ({
      slug: c.slug,
      title: c.title,
      url: `${SITE_URL}/compare/${c.slug}`,
      category: c.category,
    })),
    profilePageSchema,
    updatedAt: entity.updatedAt,
  };

  return NextResponse.json(response, {
    headers: {
      ...HEADERS,
      ...(entity.updatedAt ? { "Last-Modified": new Date(entity.updatedAt).toUTCString() } : {}),
    },
  });
}
