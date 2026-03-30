import { NextRequest, NextResponse } from "next/server";
import { getReviewsByEntity, getEntityAggregation } from "@/lib/services/review-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sp = request.nextUrl.searchParams;
  const source = sp.get("source") || undefined;
  const limit = Math.min(Number(sp.get("limit")) || 20, 50);
  const offset = Number(sp.get("offset")) || 0;

  const [reviewResult, aggregation] = await Promise.all([
    getReviewsByEntity(slug, { limit, offset, source }),
    getEntityAggregation(slug),
  ]);

  if (!aggregation && reviewResult.total === 0) {
    return NextResponse.json({ error: "No reviews found for this entity" }, { status: 404 });
  }

  return NextResponse.json({
    reviews: reviewResult.reviews,
    total: reviewResult.total,
    aggregation,
  });
}
