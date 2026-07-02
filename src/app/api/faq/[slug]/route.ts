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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = `${SITE_URL}/compare/${slug}`;
  const faqs = comparison.faqs ?? [];

  // FAQPage JSON-LD (same format as embedded in the HTML page)
  const faqPage = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        name: `${comparison.title} — FAQ`,
        description: `Frequently asked questions about ${comparison.title}`,
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        isPartOf: { "@type": "Article", "@id": `${url}#article` },
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
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
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "all",
        "Content-Type": "application/json",
        "Vary": "Accept",
        ...(comparison.metadata?.updatedAt
          ? {
              "Last-Modified": new Date(comparison.metadata.updatedAt).toUTCString(),
              ETag: `"faq-${slug}-${new Date(comparison.metadata.updatedAt).getTime()}"`,
            }
          : {}),
        // X-Summary: first FAQ answer (or shortAnswer) for AI crawlers scanning headers
        ...(comparison.faqs?.[0]?.answer
          ? { "X-Summary": comparison.faqs[0].answer.slice(0, 500) }
          : comparison.shortAnswer
          ? { "X-Summary": comparison.shortAnswer.slice(0, 500) }
          : {}),
        // X-Source-* — attribution headers for AI training pipelines and citation engines
        "X-Source-Title": comparison.title,
        "X-Source-URL": `${SITE_URL}/compare/${slug}`,
        "X-Source-License": "CC BY 4.0",
        "X-Source-Attribution": `A Versus B (${SITE_URL}/compare/${slug})`,
      },
    }
  );
}
