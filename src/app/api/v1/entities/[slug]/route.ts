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
  // Vary: Accept — prevents CDN from serving cached application/json to clients that
  // sent Accept: application/ld+json (content negotiation produces different bodies).
  "Vary": "Accept",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

// GET /api/v1/entities/[slug]
// Returns structured entity data for AI tools, knowledge graph ingestion,
// and developer integrations. Includes comparisons the entity appears in.
// When Accept: application/ld+json is the primary accept type (e.g. Linked Data
// clients or the content-negotiation redirect from /entity/{slug}), returns a
// clean @context + @graph JSON-LD document with application/ld+json content-type.
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

  // DefinedTerm schema — makes entity profiles eligible for Google's definition
  // rich results and AI knowledge-graph "what is X" citation queries.
  // DefinedTermSet links back to the entity-type category so AI systems can
  // understand the taxonomy (e.g. "smartphone" belongs to "Consumer Electronics").
  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${url}#definedterm`,
    name: entity.name,
    description: entity.shortDesc ?? entity.description ?? undefined,
    url,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      "@id": `${SITE_URL}/entities/${encodeURIComponent(entity.entityType.name.toLowerCase())}#termset`,
      name: entity.entityType.name,
      url: `${SITE_URL}/entities/${encodeURIComponent(entity.entityType.name.toLowerCase())}`,
    },
    ...(entity.imageUrl ? { image: entity.imageUrl } : {}),
  };

  const response = {
    slug: entity.slug,
    name: entity.name,
    type: entity.entityType.name,
    url,
    alternativesUrl: `${SITE_URL}/alternatives/${entity.slug}`,
    alternativesApiUrl: `${SITE_URL}/api/v1/alternatives/${entity.slug}`,
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
      answerUrl: `${SITE_URL}/api/answer/${c.slug}`,
      category: c.category,
    })),
    profilePageSchema,
    definedTermSchema,
    updatedAt: entity.updatedAt,
  };

  const acceptHeader = _req.headers.get("accept") ?? "";
  const primaryAccept = acceptHeader.split(",")[0]?.trim().split(";")[0]?.trim() ?? "";

  if (primaryAccept === "application/ld+json") {
    // Linked Data / content-negotiation path: return clean @context + @graph
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        profilePageSchema,
        definedTermSchema,
        ...(entity.faqs.length > 0
          ? [{
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              url,
              mainEntity: entity.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }]
          : []),
        { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      ],
    };
    return new Response(JSON.stringify(jsonLd, null, 2), {
      headers: {
        "Content-Type": "application/ld+json",
        "Cache-Control": HEADERS["Cache-Control"],
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "all",
        "X-Source-Title": entity.name,
        "X-Source-URL": url,
        "X-Source-License": "CC BY 4.0",
        "X-Source-Attribution": `A Versus B (${url})`,
        ...(entity.updatedAt ? { "Last-Modified": new Date(entity.updatedAt).toUTCString() } : {}),
        "Link": `<${url}>; rel="canonical"`,
      },
    });
  }

  return NextResponse.json(response, {
    headers: {
      ...HEADERS,
      "X-Source-Title": entity.name,
      "X-Source-URL": url,
      "X-Source-License": "CC BY 4.0",
      "X-Source-Attribution": `A Versus B (${url})`,
      ...(entity.updatedAt ? { "Last-Modified": new Date(entity.updatedAt).toUTCString() } : {}),
    },
  });
}
