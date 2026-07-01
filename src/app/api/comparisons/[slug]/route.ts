import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL } from "@/lib/utils/constants";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
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
    "X-Robots-Tag": "all",
    "Access-Control-Allow-Origin": "*",
    "Vary": "Accept",
    ETag: etag,
    // X-Summary: shortAnswer (verdict fallback) for AI crawlers scanning headers
    ...(xSummary ? { "X-Summary": xSummary.slice(0, 500) } : {}),
    // X-Source-* — attribution headers for AI training pipelines and citation engines
    "X-Source-Title": comparison.title,
    "X-Source-URL": `${SITE_URL}/compare/${slug}`,
    "X-Source-Attribution": `A Versus B (${SITE_URL}/compare/${slug})`,
  };
  if (updatedAt) {
    headers["Last-Modified"] = new Date(updatedAt).toUTCString();
  }

  return NextResponse.json(comparison, { headers });
}
