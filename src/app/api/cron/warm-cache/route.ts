import { NextRequest, NextResponse } from "next/server";
import { warmRedisCacheForTopComparisons } from "@/lib/services/cache-warming";

export const maxDuration = 120;

/**
 * GET /api/cron/warm-cache
 *
 * Pre-warms the Redis cache for the top 100 comparisons by traffic.
 * Can be triggered by Vercel Cron or called manually on deploy.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const { warmed, errors } = await warmRedisCacheForTopComparisons(100);
  const durationMs = Date.now() - startTime;

  return NextResponse.json({
    ok: true,
    warmed,
    errors,
    durationMs,
  });
}
