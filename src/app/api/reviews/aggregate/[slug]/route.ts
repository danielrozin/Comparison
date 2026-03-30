import { NextRequest, NextResponse } from "next/server";
import { getEntityAggregation } from "@/lib/services/review-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const aggregation = await getEntityAggregation(slug);

  if (!aggregation) {
    return NextResponse.json({ error: "No aggregation found" }, { status: 404 });
  }

  return NextResponse.json(aggregation);
}
