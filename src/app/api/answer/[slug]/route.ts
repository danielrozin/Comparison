import { NextRequest, NextResponse } from "next/server";
import { getPublishedComparisonBySlug } from "@/lib/services/comparison-service";
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

// HEAD /api/answer/[slug] — zero-body response with metadata headers.
// AI crawlers can issue a HEAD request to discover X-Summary (shortAnswer) and
// Link headers without downloading the full JSON body. This saves crawl budget
// for agents that only need to decide whether to follow up with a GET.
export async function HEAD(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getPublishedComparisonBySlug(slug);

  if (!comparison) {
    return new Response(null, { status: 404 });
  }

  const url = `${SITE_URL}/compare/${slug}`;
  const updatedAt = comparison.metadata?.updatedAt ?? comparison.metadata?.publishedAt;
  const etag = updatedAt ? `"answer-${slug}-${new Date(updatedAt).getTime()}"` : `"answer-${slug}"`;

  const headSummary = comparison.shortAnswer
    || comparison.verdict?.slice(0, 250).replace(/\n+/g, " ").trim()
    || null;

  return new Response(null, {
    status: 200,
    headers: {
      ...HEADERS,
      "X-Source-URL": url,
      "X-Attribution": `${SITE_NAME} (${url})`,
      ETag: etag,
      ...(headSummary ? { "X-Summary": headSummary.slice(0, 500) } : {}),
      ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
      "Link": [
        `<${url}>; rel="canonical"`,
        `<${SITE_URL}/api/knowledge-graph/${slug}>; rel="alternate"; type="application/ld+json"`,
        `<${SITE_URL}/api/openapi>; rel="service-doc"; type="application/json"`,
      ].join(", "),
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getPublishedComparisonBySlug(slug);

  if (!comparison) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = `${SITE_URL}/compare/${slug}`;
  const updatedAt = comparison.metadata?.updatedAt ?? comparison.metadata?.publishedAt;
  const etag = updatedAt ? `"answer-${slug}-${new Date(updatedAt).getTime()}"` : `"answer-${slug}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

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

  // Synthesize a shortAnswer when the DB field is empty.
  // A synthetic answer is better than null for AI citation — Perplexity and ChatGPT
  // will skip citing a page that has no quotable sentence.
  // Synthesis priority: shortAnswer → verdict excerpt → winner + keyDifference → title fallback.
  const entityNames = entities.map((e) => e.name);
  const syntheticAnswer = comparison.shortAnswer
    || (comparison.verdict
        ? comparison.verdict.slice(0, 250).replace(/\n+/g, " ").trim()
        : null)
    || (winner && comparison.keyDifferences?.[0]
        ? `${winner.name} is the better choice for most users. Key difference: ${comparison.keyDifferences[0].label}.`
        : null)
    || (winner
        ? `Between ${entityNames.join(" and ")}, ${winner.name} generally comes out ahead across key attributes.`
        : entityNames.length >= 2
        ? `${entityNames[0]} and ${entityNames[1]} each have distinct strengths — this comparison covers the key differences to help you choose.`
        : null);

  // Confidence level based on data completeness
  const hasShortAnswer = !!comparison.shortAnswer;
  const hasVerdict = !!comparison.verdict;
  const hasAttributes = (comparison.attributes?.length ?? 0) >= 3;
  const hasFaqs = (comparison.faqs?.length ?? 0) >= 2;
  const score = [hasShortAnswer, hasVerdict, hasAttributes, hasFaqs].filter(Boolean).length;
  const confidence = score >= 4 ? "high" : score >= 2 ? "medium" : "low";

  // ClaimReview schema for verifiable answer attribution.
  // itemReviewed must be @type "Claim" (not WebPage) per schema.org spec and
  // Google Fact Check Tools guidelines — using WebPage breaks Fact Check eligibility.
  const publishedAt = comparison.metadata?.publishedAt;
  const winnerName = winner?.name ?? entityNames[0] ?? "";
  const loserName = winner
    ? entityNames.find((n) => n !== winnerName) ?? entityNames[1] ?? ""
    : entityNames[1] ?? "";
  const claimText = winner
    ? `${winnerName} is better than ${loserName} for most use cases`
    : comparison.title;
  const verdictRating = winner ? "TRUE" : "MIXTURE";
  const claimReview = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    "@id": `${url}#claimreview`,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    // claimReviewed — the factual claim being evaluated (distinct from comparison title)
    claimReviewed: claimText,
    reviewBody: syntheticAnswer ?? claimText,
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
    // reviewRating uses schema.org Fact Check token values so Google Fact Check
    // Tools can render a verdict badge (TRUE / FALSE / MIXTURE) alongside citations.
    reviewRating: {
      "@type": "Rating",
      ratingValue: verdictRating,
      bestRating: "TRUE",
      worstRating: "FALSE",
      alternateName: winner
        ? `${winnerName} wins`
        : "Depends on use case",
      ratingExplanation: confidence === "high"
        ? "Verified verdict based on structured attribute comparison, community votes, and expert analysis"
        : confidence === "medium"
        ? "Verdict based on available data — some attributes missing"
        : "Limited data — verdict is approximate",
    },
    // author — Organization (publisher of the review); separate from itemReviewed.author
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    // itemReviewed — @type "Claim" is required by Google Fact Check Tools spec.
    // appearance + firstAppearance link back to the canonical page where this claim appears.
    itemReviewed: {
      "@type": "Claim",
      "@id": `${url}#claim`,
      inLanguage: "en-US",
      name: claimText,
      text: syntheticAnswer ?? claimText,
      // author of the claim — "Internet consensus" signals this is a community/aggregate claim
      author: { "@type": "Thing", name: "Internet consensus" },
      appearance: { "@type": "WebPage", "@id": url, url, name: comparison.title, inLanguage: "en-US" },
      firstAppearance: { "@type": "WebPage", "@id": url, url, name: comparison.title },
    },
    // speakable — AI voice assistants extract this section as the primary spoken answer
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".claim-review-answer", "#short-answer", "#verdict"],
    },
  };

  return NextResponse.json(
    {
      slug,
      question: comparison.title,
      answer: syntheticAnswer || null,
      // answer_curated: true when shortAnswer is from DB (human-reviewed), false = synthesized
      answer_curated: !!comparison.shortAnswer,
      verdict: comparison.verdict || null,
      keyDifferences: comparison.keyDifferences?.slice(0, 5) ?? [],
      winner,
      confidence,
      // entities — who is being compared (name + slug + alternatives URL)
      entities: entities.map((e) => ({
        name: e.name,
        slug: e.slug,
        url: `${SITE_URL}/entity/${e.slug}`,
        alternativesUrl: `${SITE_URL}/api/v1/alternatives/${e.slug}`,
      })),
      // faqs — top 3 Q&A pairs for additional citation context
      faqs: (comparison.faqs ?? []).slice(0, 3).map((f) => ({
        question: f.question,
        answer: f.answer,
      })),
      attribution: {
        source: SITE_NAME,
        url,
        license: "CC BY 4.0",
        citationFormat: `According to ${SITE_NAME} (${url}), ${syntheticAnswer?.slice(0, 200) ?? ""}`,
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
        "X-Source-URL": url,
        "X-Attribution": `${SITE_NAME} (${url})`,
        ETag: etag,
        ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
        ...(syntheticAnswer ? { "X-Summary": syntheticAnswer.slice(0, 500) } : {}),
        "Link": [
          `<${url}>; rel="canonical"`,
          `<${SITE_URL}/api/knowledge-graph/${slug}>; rel="alternate"; type="application/ld+json"`,
          `<${SITE_URL}/api/faq/${slug}>; rel="alternate"; type="application/json"; title="FAQ pairs"`,
          `<${SITE_URL}/api/openapi>; rel="service-doc"; type="application/json"`,
        ].join(", "),
      },
    }
  );
}
