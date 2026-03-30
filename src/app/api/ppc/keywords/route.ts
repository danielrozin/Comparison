import { NextRequest, NextResponse } from "next/server";
import { getPPCKeywords } from "@/lib/services/ppc-campaign-service";

/**
 * GET /api/ppc/keywords
 * Returns top PPC-eligible keywords sorted by CPC and landing page availability.
 * Query params: limit (default 50), minCpc (default 0.5), minVolume (default 100)
 * Auth: Bearer ADMIN_TOKEN
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.ADMIN_TOKEN && authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const minCpc = parseFloat(searchParams.get("minCpc") || "0.5");
  const minVolume = parseInt(searchParams.get("minVolume") || "100", 10);

  try {
    const keywords = await getPPCKeywords(limit, minCpc, minVolume);

    const withLandingPage = keywords.filter((k) => k.hasLandingPage);
    const withoutLandingPage = keywords.filter((k) => !k.hasLandingPage);

    return NextResponse.json({
      total: keywords.length,
      withLandingPage: withLandingPage.length,
      withoutLandingPage: withoutLandingPage.length,
      avgCpc: keywords.length > 0
        ? Math.round((keywords.reduce((s, k) => s + k.cpc, 0) / keywords.length) * 100) / 100
        : 0,
      keywords,
    });
  } catch (error) {
    console.error("PPC keywords error:", error);
    return NextResponse.json(
      { error: "Failed to fetch PPC keywords" },
      { status: 500 }
    );
  }
}
