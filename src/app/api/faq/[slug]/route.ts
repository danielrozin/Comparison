import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// /api/faq/[slug] — structured FAQ pairs for a comparison page.
//
// AI answer engines (Perplexity, ChatGPT, Google AI Overviews) and voice assistants
// use this endpoint to retrieve pre-structured Q&A pairs without parsing HTML.
// Returns both the raw FAQ array and a FAQPage JSON-LD object.
//
// Linked from: /api/knowledge-graph/[slug] and compare page <head>
// Format: JSON (Content-Type: application/json)

export const dynamic = "force-dynamic";

const BASE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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
  return new Response(null, { status: 204, headers: BASE_HEADERS });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = `${SITE_URL}/compare/${slug}`;
  const faqs = comparison.faqs ?? [];
  const updatedAt = comparison.metadata?.updatedAt;
  const etag = updatedAt
    ? `"faq-${slug}-${new Date(updatedAt).getTime()}"`
    : `"faq-${slug}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  // FAQPage JSON-LD (same format as embedded in the HTML page)
  const faqPage = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        inLanguage: "en-US",
        name: `${comparison.title} — FAQ`,
        description: `Frequently asked questions about ${comparison.title}`,
        dateModified: updatedAt ? new Date(updatedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        isPartOf: { "@type": "Article", "@id": `${url}#article` },
        license: "https://creativecommons.org/licenses/by/4.0/",
        // speakable — marks FAQ answers as the preferred voice-extraction target for
        // AI voice assistants and LLMs generating spoken summaries from this page.
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#faq", ".faq-item"] },
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
            inLanguage: "en-US",
            url,
          },
        })),
      }
    : null;

  return NextResponse.json(
    {
      slug,
      title: comparison.title,
      url,
      faqCount: faqs.length,
      faqs: faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
      faqPageSchema: faqPage,
    },
    {
      headers: {
        ...BASE_HEADERS,
        "X-Source-URL": url,
        "X-Attribution": `According to ${SITE_NAME} (${url}), ...`,
        ETag: etag,
        ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
        ...(comparison.faqs?.[0]?.answer
          ? { "X-Summary": comparison.faqs[0].answer.slice(0, 500) }
          : comparison.shortAnswer
          ? { "X-Summary": comparison.shortAnswer.slice(0, 500) }
          : {}),
      },
    }
  );
}
