import { NextRequest, NextResponse } from "next/server";
import { searchComparisons } from "@/lib/services/comparison-service";
import { withTiming } from "@/lib/utils/api-timing";

export const GET = withTiming(async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20", 10);

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchComparisons(query, limit);

  return NextResponse.json({ results });
});
