import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { getRedis } from "@/lib/services/redis";
import { Resend } from "resend";

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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "not_configured", latencyMs: 0 };

  const from = process.env.RESEND_FROM_EMAIL || "A Versus B <noreply@aversusb.net>";
  const start = Date.now();
  try {
    const resend = new Resend(apiKey);
    // Resend's built-in test sink — accepted and marked delivered without actual delivery
    const { error } = await resend.emails.send({
      from,
      to: "delivered@resend.dev",
      subject: "health-check",
      text: "health",
    });
    if (error) return { status: "error", latencyMs: Date.now() - start, from };
    return { status: "ok", latencyMs: Date.now() - start, from };
  } catch {
    return { status: "error", latencyMs: Date.now() - start, from };
  }
}

export async function GET() {
  const checks: Record<string, { status: string; latencyMs?: number; from?: string }> = {};
  let overallStatus = "ok";

  // Check PostgreSQL (with Neon wake-up retry)
  const dbResult = await checkDatabase();
  if (dbResult.status === "not_configured") {
    checks.database = { status: "not_configured" };
  } else {
    checks.database = { status: dbResult.status, latencyMs: dbResult.latencyMs };
    if (dbResult.status === "error") overallStatus = "degraded";
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

  // Check Resend email (using test sink — no actual delivery, just API verification)
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
