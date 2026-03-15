export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { searchComparisons } from "@/lib/services/comparison-service";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20", 10);

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchComparisons(query, limit);

  return NextResponse.json({ results });
}
