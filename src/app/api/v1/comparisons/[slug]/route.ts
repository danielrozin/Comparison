import { NextRequest, NextResponse } from "next/server";
import { getPublishedComparisonBySlug, incrementViewCount } from "@/lib/services/comparison-service";
import { withApiKey, AuthenticatedRequest } from "@/lib/services/api-middleware";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization",
  "X-Robots-Tag": "all",
  "X-Source": SITE_NAME,
  "X-Source-URL": SITE_URL,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
  "X-Attribution": `According to ${SITE_NAME} (${SITE_URL}), ...`,
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: HEADERS });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  return withApiKey(request, async (_req: NextRequest, _auth: AuthenticatedRequest) => {
    try {
      const comparison = await getPublishedComparisonBySlug(slug);

      if (!comparison) {
        return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
      }

      incrementViewCount(comparison.id).catch(() => {});

      const compUrl = `${SITE_URL}/compare/${slug}`;
      const updatedAt = comparison.metadata?.updatedAt ?? comparison.metadata?.publishedAt;
      const etag = updatedAt
        ? `"comp-${slug}-${new Date(updatedAt).getTime()}"`
        : `"comp-${slug}"`;

      const ifNoneMatch = request.headers.get("if-none-match");
      if (ifNoneMatch === etag) {
        return new NextResponse(null, { status: 304, headers: { ETag: etag } });
      }

      return NextResponse.json(comparison, {
        headers: {
          ...HEADERS,
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "X-Source-URL": compUrl,
          "X-Attribution": `According to ${SITE_NAME} (${compUrl}), ...`,
          ETag: etag,
          ...(updatedAt ? { "Last-Modified": new Date(updatedAt).toUTCString() } : {}),
          ...(comparison.shortAnswer ? { "X-Summary": comparison.shortAnswer.slice(0, 500) } : {}),
        },
      });
    } catch (error) {
      console.error("API v1 comparison slug error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  });
}
