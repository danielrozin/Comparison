import { NextRequest, NextResponse } from "next/server";
import { getReviewedEntities, getReviewCategories } from "@/lib/services/review-service";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const category = sp.get("category") || undefined;
  const sort = (sp.get("sort") as "rating" | "reviews" | "smartscore" | "alphabetical") || "smartscore";
  const minRating = sp.get("minRating") ? Number(sp.get("minRating")) : undefined;
  const limit = Math.min(Number(sp.get("limit")) || 20, 50);
  const offset = Number(sp.get("offset")) || 0;

  const [result, categories] = await Promise.all([
    getReviewedEntities({ category, sort, minRating, limit, offset }),
    getReviewCategories(),
  ]);

  return NextResponse.json({
    entities: result.entities,
    total: result.total,
    categories,
  });
}
