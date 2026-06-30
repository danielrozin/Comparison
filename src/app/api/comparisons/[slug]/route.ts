import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";

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

  const headers: Record<string, string> = {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "X-Robots-Tag": "all",
    "Access-Control-Allow-Origin": "*",
    ETag: etag,
    // X-Summary: shortAnswer in HTTP header for AI crawlers scanning headers
    ...(comparison.shortAnswer ? { "X-Summary": comparison.shortAnswer.slice(0, 500) } : {}),
  };
  if (updatedAt) {
    headers["Last-Modified"] = new Date(updatedAt).toUTCString();
  }

  return NextResponse.json(comparison, { headers });
}
