import { NextRequest, NextResponse } from "next/server";
import { headerSafe } from "@/lib/utils/header-safe";
import {
  getComparisonBySlug,
  getPublishedComparisonBySlug,
} from "@/lib/services/comparison-service";
import {
  isHiddenComparisonStatus,
  relatedComparisonSlugs,
} from "@/lib/compare-slug-resolution";
import { SITE_URL } from "@/lib/utils/constants";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getPublishedComparisonBySlug(slug);

  if (!comparison) {
    const lookup = new URL(request.url).searchParams.get("lookup");
    if (lookup === "availability") {
      const unavailable = await pairIsHidden(slug);
      return NextResponse.json(
        { error: "Not found", ...(unavailable ? { unavailable: true } : {}) },
        { status: 404 },
      );
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updatedAt = comparison.metadata?.updatedAt ?? comparison.metadata?.publishedAt;
  const etag = updatedAt
    ? `"${slug}-${new Date(updatedAt).getTime()}"`
    : `"${slug}"`;

  // Conditional GET support — 304 if content unchanged
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  }

  const xSummary = comparison.shortAnswer
    || comparison.verdict?.slice(0, 250).replace(/\n+/g, " ").trim()
    || null;

  const headers: Record<string, string> = {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "X-Robots-Tag": comparison.metadata?.status === "provisional" ? "noindex, nofollow" : "all",
    "Access-Control-Allow-Origin": "*",
    "Vary": "Accept",
    ETag: etag,
    // X-Summary: shortAnswer (verdict fallback) for AI crawlers scanning headers
    ...(xSummary ? { "X-Summary": headerSafe(xSummary) } : {}),
    // X-Source-* — attribution headers for AI training pipelines and citation engines
    "X-Source-Title": headerSafe(comparison.title),
    "X-Source-URL": `${SITE_URL}/compare/${slug}`,
    "X-Source-License": "CC BY 4.0",
    "X-Source-Attribution": `A Versus B (${SITE_URL}/compare/${slug})`,
  };
  if (updatedAt) {
    headers["Last-Modified"] = new Date(updatedAt).toUTCString();
  }

  const comparisonUrl = `${SITE_URL}/compare/${slug}`;
  headers["Link"] = [
    `<${comparisonUrl}>; rel="canonical"`,
    `<${SITE_URL}/api/knowledge-graph/${slug}>; rel="alternate"; type="application/ld+json"`,
    `<${SITE_URL}/api/v1/schema/${slug}>; rel="alternate"; type="application/ld+json"; title="Schema.org JSON-LD"`,
    `<${SITE_URL}/api/answer/${slug}>; rel="alternate"; type="application/json"; title="AI Answer"`,
    `<${SITE_URL}/api/faq/${slug}>; rel="alternate"; type="application/json"; title="FAQ pairs"`,
    `<${SITE_URL}/api/openapi>; rel="service-doc"; type="application/json"`,
  ].join(", ");

  return NextResponse.json(comparison, { headers });
}

/** Archived, draft, and review rows must 404 like today — not open the builder. */
async function pairIsHidden(slug: string): Promise<boolean> {
  const slugs = relatedComparisonSlugs(slug);
  const rows = await Promise.all(
    slugs.map((candidate) => getComparisonBySlug(candidate).catch(() => null)),
  );
  return rows.some((row) => isHiddenComparisonStatus(row?.metadata?.status));
}
