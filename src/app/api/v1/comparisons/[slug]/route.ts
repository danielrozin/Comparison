import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug, incrementViewCount } from "@/lib/services/comparison-service";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const comparison = await getComparisonBySlug(slug);

    if (!comparison) {
      return NextResponse.json(
        { error: "Comparison not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Increment view count (fire and forget)
    incrementViewCount(comparison.id).catch(() => {});

    return NextResponse.json(comparison, {
      headers: {
        ...corsHeaders,
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "99",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("API v1 comparison slug error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
