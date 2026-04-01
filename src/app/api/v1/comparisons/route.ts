import { NextRequest, NextResponse } from "next/server";
import { searchComparisons, getComparisonsByCategory, listAllComparisons } from "@/lib/services/comparison-service";
import { withApiKey, AuthenticatedRequest } from "@/lib/services/api-middleware";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  return withApiKey(request, async (req: NextRequest, _auth: AuthenticatedRequest) => {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

    try {
      let comparisons: { slug: string; title: string; category: string }[];
      let total: number;

      if (query) {
        const results = await searchComparisons(query, 100);
        total = results.length;
        comparisons = results.slice(offset, offset + limit);
      } else if (category) {
        const result = await getComparisonsByCategory(category, limit, offset);
        total = result.total;
        comparisons = result.comparisons.map((c) => ({
          slug: c.slug,
          title: c.title,
          category: c.category || "general",
        }));
      } else {
        const result = await listAllComparisons(limit, offset);
        total = result.total;
        comparisons = result.comparisons;
      }

      const page = Math.floor(offset / limit) + 1;

      return NextResponse.json({ comparisons, total, page });
    } catch (error) {
      console.error("API v1 comparisons error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  });
}
