/**
 * Durable rate limit for visitor-requested generation.
 *
 * Uses Postgres (`user_generation_requests`) so it works in production, where
 * Redis is not configured. The in-memory limiter in middleware is only a
 * burst guard and resets on every edge instance.
 *
 * Limits: 3 per IP per rolling hour, 10 per IP per rolling day, and
 * USER_GENERATION_DAILY_CAP (default 150) per UTC day for the whole site.
 */

import { createHash } from "crypto";
import { getPrisma } from "@/lib/db/prisma";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
export const IP_HOUR_LIMIT = 3;
export const IP_DAY_LIMIT = 10;
export const DEFAULT_DAILY_CAP = 150;

export type RateLimitReason = "ip_hour" | "ip_day" | "global_day" | "unavailable";

export type RateLimitDecision =
  | { allowed: true }
  | { allowed: false; reason: RateLimitReason };

export function userGenerationDailyCap(): number {
  const raw = process.env.USER_GENERATION_DAILY_CAP;
  if (raw === undefined || raw.trim() === "") return DEFAULT_DAILY_CAP;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return DEFAULT_DAILY_CAP;
  return Math.floor(parsed);
}

export function hashGenerationIp(ip: string): string {
  const salt = process.env.USER_GENERATION_IP_SALT || "aversusb-user-generation";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function startOfUtcDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function consumeUserGenerationSlot(
  ip: string,
  slug: string,
  now: Date = new Date(),
): Promise<RateLimitDecision> {
  const prisma = getPrisma();
  if (!prisma) {
    // No database means we cannot record the spend. Production must refuse.
    if (process.env.NODE_ENV === "production") {
      return { allowed: false, reason: "unavailable" };
    }
    return { allowed: true };
  }

  const ipHash = hashGenerationIp(ip || "unknown");
  const hourAgo = new Date(now.getTime() - HOUR_MS);
  const dayAgo = new Date(now.getTime() - DAY_MS);
  const utcDay = startOfUtcDay(now);
  const cap = userGenerationDailyCap();

  try {
    const [hourCount, dayCount, globalCount] = await Promise.all([
      prisma.userGenerationRequest.count({
        where: { ipHash, createdAt: { gte: hourAgo } },
      }),
      prisma.userGenerationRequest.count({
        where: { ipHash, createdAt: { gte: dayAgo } },
      }),
      prisma.userGenerationRequest.count({
        where: { createdAt: { gte: utcDay } },
      }),
    ]);

    if (hourCount >= IP_HOUR_LIMIT) return { allowed: false, reason: "ip_hour" };
    if (dayCount >= IP_DAY_LIMIT) return { allowed: false, reason: "ip_day" };
    if (globalCount >= cap) return { allowed: false, reason: "global_day" };

    await prisma.userGenerationRequest.create({
      data: { ipHash, slug },
    });
    // Drop rows that can no longer affect either window. Best-effort.
    void prisma.userGenerationRequest
      .deleteMany({ where: { createdAt: { lt: new Date(now.getTime() - 2 * DAY_MS) } } })
      .catch(() => {});
    return { allowed: true };
  } catch (error) {
    console.error("[user-generation] rate limit lookup failed:", error);
    return { allowed: false, reason: "unavailable" };
  }
}
