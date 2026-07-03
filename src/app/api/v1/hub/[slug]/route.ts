import { NextRequest, NextResponse } from "next/server";
import { HUB_CONFIG } from "@/lib/data/hubs";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/v1/hub/{slug}
//
// Returns structured JSON for a topic hub page, including metadata,
// comparison slugs, FAQs, and ItemList JSON-LD.
// Designed for AI tools answering "[topic] comparison hub" queries and
// for Link: describedby discovery from the middleware.
//
// Each hub includes:
// - title, description, h1, intro
// - comparisonSlugs — the curated comparison pages for this hub
// - faqs — hub-level Q&A pairs
// - JSON-LD: ItemList of comparisons + FAQPage schema

export const dynamic = "force-static";
export const revalidate = 86400;

const HEADERS = {
  "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
  "Vary": "Accept",
  "X-Source": SITE_NAME,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const hub = HUB_CONFIG[slug];

  if (!hub) {
    return NextResponse.json({ error: "Hub not found", slug }, { status: 404, headers: HEADERS });
  }

  const hubUrl = `${SITE_URL}/hub/${slug}`;
  const etag = `"hub-${slug}-${hub.comparisonSlugs.length}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${hubUrl}#comparisons`,
    name: hub.h1,
    description: hub.description,
    url: hubUrl,
    inLanguage: "en",
    numberOfItems: hub.comparisonSlugs.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    datePublished: "2024-01-01",
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().slice(0, 10),
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    itemListElement: hub.comparisonSlugs.map((compSlug, i) => {
      const compUrl = `${SITE_URL}/compare/${compSlug}`;
      const name = compSlug.replace(/-/g, " ").replace(/\bvs\b/, "vs.");
      return {
        "@type": "ListItem",
        position: i + 1,
        name,
        item: { "@type": "WebPage", "@id": compUrl, name, url: compUrl },
      };
    }),
  };

  const faqSchema = hub.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${hubUrl}#faq`,
        inLanguage: "en",
        mainEntity: hub.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }
    : null;

  const response = {
    slug,
    title: hub.title,
    description: hub.description,
    h1: hub.h1,
    intro: hub.intro,
    url: hubUrl,
    comparisonCount: hub.comparisonSlugs.length,
    comparisonSlugs: hub.comparisonSlugs,
    comparisonUrls: hub.comparisonSlugs.map((s) => `${SITE_URL}/compare/${s}`),
    faqs: hub.faqs,
    schema: {
      itemList: itemListSchema,
      ...(faqSchema && { faq: faqSchema }),
    },
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      ...HEADERS,
      ETag: etag,
      "X-Source-URL": hubUrl,
      "X-Attribution": `${SITE_NAME} (${hubUrl})`,
      "X-Summary": hub.description.slice(0, 500),
    },
  });
}
