import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { getRedis } from "@/lib/services/redis";
import { resendFromAddress, resendKeyCanSend } from "@/lib/services/resend-from";

// Neon free tier auto-suspends after 5 min inactivity; first connection after
// suspend is rejected in <10ms. Retry once with a short delay to let Neon wake.
const NEON_WAKE_DELAY_MS = 3000;
const HEALTH_DB_RETRIES = 1;

async function checkDatabase(): Promise<{ status: string; latencyMs: number }> {
  const prisma = getPrisma();
  if (!prisma) return { status: "not_configured", latencyMs: 0 };

  const start = Date.now();
  for (let attempt = 0; attempt <= HEALTH_DB_RETRIES; attempt++) {
    try {
      if (attempt > 0) await new Promise((r) => setTimeout(r, NEON_WAKE_DELAY_MS));
      await prisma.$queryRaw`SELECT 1`;
      return { status: "ok", latencyMs: Date.now() - start };
    } catch {
      if (attempt === HEALTH_DB_RETRIES) {
        return { status: "error", latencyMs: Date.now() - start };
      }
    }
  }
  return { status: "error", latencyMs: Date.now() - start };
}

async function checkEmail(): Promise<{ status: string; latencyMs: number; from?: string }> {
  const apiKey = (process.env.RESEND_API_KEY ?? "").replace(/[\r\n]+/g, "").trim();
  if (!apiKey) return { status: "not_configured", latencyMs: 0 };

  const from = resendFromAddress();
  const start = Date.now();
  try {
    const res = await fetch("https://api.resend.com/domains", {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const body = (await res.json?.().catch(() => ({}))) as { name?: string; message?: string };
    const status = typeof res.status === "number" ? res.status : res.ok ? 200 : 0;
    if (!res.ok && !resendKeyCanSend(status, body)) {
      return { status: "error", latencyMs: Date.now() - start, from };
    }
    return { status: "ok", latencyMs: Date.now() - start, from };
  } catch {
    return { status: "error", latencyMs: Date.now() - start, from };
  }
}

export async function GET() {
  const checks: Record<string, { status: string; optional?: boolean; latencyMs?: number; from?: string }> = {};
  let overallStatus = "ok";

  // Postgres is required for Pro membership. A failed query degrades health.
  const dbResult = await checkDatabase();
  if (dbResult.status === "not_configured") {
    checks.database = { status: "not_configured" };
  } else {
    checks.database = { status: dbResult.status, latencyMs: dbResult.latencyMs };
    if (dbResult.status === "error") overallStatus = "degraded";
  }

  // Redis is an optional cache. Missing or failing Redis must not degrade.
  const redisStart = Date.now();
  try {
    const redis = getRedis();
    if (redis) {
      await redis.ping();
      checks.redis = { status: "ok", optional: true, latencyMs: Date.now() - redisStart };
    } else {
      checks.redis = { status: "not_configured", optional: true };
    }
  } catch {
    checks.redis = { status: "error", optional: true, latencyMs: Date.now() - redisStart };
  }

  const emailResult = await checkEmail();
  if (emailResult.status === "not_configured") {
    checks.email = { status: "not_configured" };
  } else {
    checks.email = { status: emailResult.status, latencyMs: emailResult.latencyMs, from: emailResult.from };
    if (emailResult.status === "error") overallStatus = "degraded";
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
