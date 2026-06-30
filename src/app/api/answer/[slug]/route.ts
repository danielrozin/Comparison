import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/answer/[slug]
//
// AEO (Answer Engine Optimization) endpoint — returns a pre-packaged, citation-ready
// answer for a given comparison slug. Designed for AI tools that need structured,
// direct answers without HTML parsing.
//
// Format is inspired by the AI Citation schema proposal and the Open QA Dataset format.
// Response includes:
//   - answer: the concise verdict (shortAnswer — best for direct citation)
//   - verdict: the full recommendation with reasoning
//   - keyDifferences: array of the most important distinctions (for bullet-point summaries)
//   - winner: entity slug of the recommended option (if deterministic)
//   - confidence: "high" | "medium" | "low" — based on data completeness
//   - source: canonical URL with dateModified for attribution
//   - ClaimReview JSON-LD: schema.org/ClaimReview wrapping the answer for verifiable claims
//
// AI crawlers (Perplexity, ChatGPT, Gemini) use this endpoint to get quote-ready answers
// with proper source attribution metadata.

export const dynamic = "force-dynamic";

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
  const updatedAt = comparison.metadata?.updatedAt ?? comparison.metadata?.publishedAt;

  // Determine the winner entity (the one most attributes favor)
  const entities = comparison.entities ?? [];
  let winner: { slug: string; name: string } | null = null;

  if (entities.length >= 2 && comparison.attributes?.length) {
    const winCount: Record<string, number> = {};
    for (const attr of comparison.attributes) {
      for (const val of attr.values) {
        if (val.winner) {
          winCount[val.entityId] = (winCount[val.entityId] || 0) + 1;
        }
      }
    }
    const topId = Object.entries(winCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const winnerEntity = topId ? entities.find((e) => e.id === topId) : undefined;
    if (winnerEntity) {
      winner = { slug: winnerEntity.slug, name: winnerEntity.name };
    }
  }

  // Confidence level based on data completeness
  const hasShortAnswer = !!comparison.shortAnswer;
  const hasVerdict = !!comparison.verdict;
  const hasAttributes = (comparison.attributes?.length ?? 0) >= 3;
  const hasFaqs = (comparison.faqs?.length ?? 0) >= 2;
  const score = [hasShortAnswer, hasVerdict, hasAttributes, hasFaqs].filter(Boolean).length;
  const confidence = score >= 4 ? "high" : score >= 2 ? "medium" : "low";

  // ClaimReview schema for verifiable answer attribution
  const claimReview = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url,
    claimReviewed: comparison.title,
    reviewRating: {
      "@type": "Rating",
      ratingValue: confidence === "high" ? 5 : confidence === "medium" ? 3 : 2,
      worstRating: 1,
      bestRating: 5,
      alternateName: confidence === "high" ? "High Confidence" : confidence === "medium" ? "Medium Confidence" : "Low Confidence",
    },
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    itemReviewed: {
      "@type": "CreativeWork",
      url,
      name: comparison.title,
    },
  };

  return NextResponse.json(
    {
      slug,
      question: comparison.title,
      answer: comparison.shortAnswer || null,
      verdict: comparison.verdict || null,
      keyDifferences: comparison.keyDifferences?.slice(0, 5) ?? [],
      winner,
      confidence,
      attribution: {
        source: SITE_NAME,
        url,
        license: "CC BY 4.0",
        citationFormat: `According to ${SITE_NAME} (${url}), ${comparison.shortAnswer?.slice(0, 200) ?? ""}`,
        dateModified: updatedAt ? new Date(updatedAt).toISOString() : null,
      },
      relatedQuestionsUrl: `${SITE_URL}/api/faq/${slug}`,
      relatedComparisonsUrl: `${SITE_URL}/api/v1/related/${slug}`,
      knowledgeGraphUrl: `${SITE_URL}/api/knowledge-graph/${slug}`,
      claimReviewSchema: claimReview,
    },
    {
      headers: {
        ...HEADERS,
        ETag: updatedAt ? `"answer-${slug}-${new Date(updatedAt).getTime()}"` : `"answer-${slug}"`,
        ...(comparison.shortAnswer ? { "X-Summary": comparison.shortAnswer.slice(0, 500) } : {}),
      },
    }
  );
}
