import { NextRequest, NextResponse } from "next/server";
import { searchComparisons, getComparisonsByCategory } from "@/lib/services/comparison-service";
import { getAllMockSlugs, getMockComparison } from "@/lib/services/mock-data";
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
      let comparisons: { slug: string; title: string; category: string; viewCount?: number }[];
      let total: number;

      if (query) {
        const results = await searchComparisons(query, 100);
        total = results.length;
        comparisons = results.slice(offset, offset + limit);
      } else if (category) {
        const result = await getComparisonsByCategory(category, 100, 0);
        total = result.total;
        const withViews = result.comparisons.map((c) => {
          const full = getMockComparison(c.slug);
          return { ...c, category: c.category || "general", viewCount: full?.metadata.viewCount || 0 };
        });
        comparisons = withViews.slice(offset, offset + limit);
      } else {
        const allSlugs = getAllMockSlugs();
        total = allSlugs.length;
        const all = allSlugs.map((slug) => {
          const comp = getMockComparison(slug);
          return comp
            ? { slug: comp.slug, title: comp.title, category: comp.category || "general", viewCount: comp.metadata.viewCount }
            : null;
        }).filter(Boolean) as { slug: string; title: string; category: string; viewCount: number }[];
        comparisons = all.slice(offset, offset + limit);
      }

      const page = Math.floor(offset / limit) + 1;

      return NextResponse.json({ comparisons, total, page });
    } catch (error) {
      console.error("API v1 comparisons error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  });
}
