import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { withTiming } from "@/lib/utils/api-timing";

export const GET = withTiming(async function GET(
  _request: NextRequest,
  context?: unknown
) {
  const { slug } = await (context as { params: Promise<{ slug: string }> }).params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(comparison);
});
