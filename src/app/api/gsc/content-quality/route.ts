import { NextRequest, NextResponse } from "next/server";
import { scoreAllComparisons } from "@/lib/services/content-quality";

/**
 * GET /api/gsc/content-quality?grade=D,F&limit=50
 *
 * Returns content quality scores for all comparison pages.
 * Filter by grade to find pages needing improvement.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.ADMIN_TOKEN}` &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gradeFilter = request.nextUrl.searchParams.get("grade")?.split(",") || [];
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "100", 10);

  try {
    const { scores, summary } = await scoreAllComparisons();

    let filtered = scores;
    if (gradeFilter.length > 0) {
      filtered = scores.filter((s) => gradeFilter.includes(s.grade));
    }

    return NextResponse.json({
      summary,
      scores: filtered.slice(0, limit),
      total: filtered.length,
    });
  } catch (err) {
    console.error("Content quality endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to score content quality" },
      { status: 500 }
    );
  }
}
