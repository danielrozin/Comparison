import { NextRequest, NextResponse } from "next/server";
import { searchComparisons } from "@/lib/services/comparison-service";
import { withTiming } from "@/lib/utils/api-timing";
import { sanitizeSearchQuery } from "@/lib/utils/sanitize";

export const GET = withTiming(async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get("q") || "";
  const query = sanitizeSearchQuery(rawQuery);
  const limit = Math.min(Math.max(parseInt(request.nextUrl.searchParams.get("limit") || "20", 10) || 20, 1), 50);

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchComparisons(query, limit);

  return NextResponse.json({ results });
});
