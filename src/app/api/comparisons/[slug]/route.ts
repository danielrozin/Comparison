import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updatedAt = comparison.metadata?.updatedAt ?? comparison.metadata?.publishedAt;
  const headers: Record<string, string> = {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    "X-Robots-Tag": "all",
    "Access-Control-Allow-Origin": "*",
  };
  if (updatedAt) {
    headers["Last-Modified"] = new Date(updatedAt).toUTCString();
  }

  return NextResponse.json(comparison, { headers });
}
