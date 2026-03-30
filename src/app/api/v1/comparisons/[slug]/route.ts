import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug, incrementViewCount } from "@/lib/services/comparison-service";
import { withApiKey, AuthenticatedRequest } from "@/lib/services/api-middleware";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  return withApiKey(request, async (_req: NextRequest, _auth: AuthenticatedRequest) => {
    try {
      const comparison = await getComparisonBySlug(slug);

      if (!comparison) {
        return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
      }

      incrementViewCount(comparison.id).catch(() => {});

      return NextResponse.json(comparison, {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      });
    } catch (error) {
      console.error("API v1 comparison slug error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  });
}
