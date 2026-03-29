import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { getRedis } from "@/lib/services/redis";

export async function GET() {
  const checks: Record<string, { status: string; latencyMs?: number }> = {};
  let overallStatus = "ok";

  // Check PostgreSQL
  const dbStart = Date.now();
  try {
    const prisma = getPrisma();
    if (prisma) {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = { status: "ok", latencyMs: Date.now() - dbStart };
    } else {
      checks.database = { status: "not_configured" };
    }
  } catch {
    checks.database = { status: "error", latencyMs: Date.now() - dbStart };
    overallStatus = "degraded";
  }

  // Check Redis
  const redisStart = Date.now();
  try {
    const redis = getRedis();
    if (redis) {
      await redis.ping();
      checks.redis = { status: "ok", latencyMs: Date.now() - redisStart };
    } else {
      checks.redis = { status: "not_configured" };
    }
  } catch {
    checks.redis = { status: "error", latencyMs: Date.now() - redisStart };
    overallStatus = "degraded";
  }

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      checks,
    },
    { status: overallStatus === "ok" ? 200 : 503 }
  );
}
