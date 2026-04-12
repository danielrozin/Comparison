import { NextResponse } from "next/server";
import { getAllMockSlugs } from "@/lib/services/mock-data";

/**
 * GET /api/video-pipeline/slugs
 *
 * Returns all available comparison slugs (from mock data) for use by the
 * daily video pipeline. Public endpoint — no auth required.
 */
export async function GET() {
  try {
    const slugs = getAllMockSlugs();
    return NextResponse.json(
      { slugs, count: slugs.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[video-pipeline/slugs] Error:", error);
    return NextResponse.json({ error: "Failed to list slugs" }, { status: 500 });
  }
}
