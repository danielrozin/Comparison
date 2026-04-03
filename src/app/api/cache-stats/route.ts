import { NextRequest, NextResponse } from "next/server";
import { getCacheStats } from "@/lib/services/comparison-service";

/**
 * GET /api/cache-stats
 *
 * Returns current Redis cache hit/miss statistics for monitoring.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getCacheStats());
}
