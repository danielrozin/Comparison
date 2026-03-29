import { getPrisma } from "@/lib/db/prisma";
import { getRedis } from "@/lib/services/redis";
import crypto from "crypto";

// Tier definitions
export const API_TIERS = {
  free: { name: "Free", dailyLimit: 100, price: 0 },
  pro: { name: "Pro", dailyLimit: 10000, price: 9900 }, // cents
  enterprise: { name: "Enterprise", dailyLimit: Infinity, price: 49900 },
} as const;

export type ApiTier = keyof typeof API_TIERS;

function generateRawKey(): string {
  return `avsb_${crypto.randomBytes(32).toString("hex")}`;
}

function hashKey(rawKey: string): string {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

export async function createApiKey(params: {
  email: string;
  name: string;
  tier?: ApiTier;
}): Promise<{ apiKey: { id: string; keyPrefix: string; tier: string; name: string; email: string }; rawKey: string }> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database not available");

  const rawKey = generateRawKey();
  const hashedKey = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12);
  const tier = params.tier || "free";

  const apiKey = await prisma.apiKey.create({
    data: {
      key: hashedKey,
      keyPrefix,
      name: params.name,
      email: params.email,
      tier,
      dailyLimit: API_TIERS[tier].dailyLimit === Infinity ? null : API_TIERS[tier].dailyLimit,
    },
    select: { id: true, keyPrefix: true, tier: true, name: true, email: true },
  });

  return { apiKey, rawKey };
}

export async function validateApiKey(rawKey: string): Promise<{
  valid: boolean;
  apiKeyId?: string;
  tier?: ApiTier;
  dailyLimit?: number;
  requestsToday?: number;
  error?: string;
}> {
  if (!rawKey || !rawKey.startsWith("avsb_")) {
    return { valid: false, error: "Invalid API key format" };
  }

  const prisma = getPrisma();
  if (!prisma) return { valid: false, error: "Database not available" };

  const hashedKey = hashKey(rawKey);

  const apiKey = await prisma.apiKey.findUnique({
    where: { key: hashedKey },
    select: {
      id: true,
      tier: true,
      status: true,
      dailyLimit: true,
      requestsToday: true,
      lastResetAt: true,
      expiresAt: true,
    },
  });

  if (!apiKey) return { valid: false, error: "API key not found" };
  if (apiKey.status === "revoked") return { valid: false, error: "API key has been revoked" };
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return { valid: false, error: "API key has expired" };

  const tier = apiKey.tier as ApiTier;
  const dailyLimit = apiKey.dailyLimit ?? API_TIERS[tier].dailyLimit;

  // Check if we need to reset the daily counter
  const now = new Date();
  const lastReset = new Date(apiKey.lastResetAt);
  const needsReset = now.getUTCDate() !== lastReset.getUTCDate() ||
    now.getUTCMonth() !== lastReset.getUTCMonth() ||
    now.getUTCFullYear() !== lastReset.getUTCFullYear();

  let requestsToday = apiKey.requestsToday;
  if (needsReset) {
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { requestsToday: 0, lastResetAt: now },
    });
    requestsToday = 0;
  }

  return {
    valid: true,
    apiKeyId: apiKey.id,
    tier,
    dailyLimit: dailyLimit === Infinity ? -1 : dailyLimit,
    requestsToday,
  };
}

export async function incrementUsage(apiKeyId: string, endpoint: string, statusCode: number, responseMs?: number, ip?: string, userAgent?: string): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) return;

  await prisma.$transaction([
    prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        requestsToday: { increment: 1 },
        requestsTotal: { increment: 1 },
        lastUsedAt: new Date(),
      },
    }),
    prisma.apiUsageLog.create({
      data: {
        apiKeyId,
        endpoint,
        statusCode,
        responseMs,
        ip,
        userAgent,
      },
    }),
  ]);
}

export async function revokeApiKey(apiKeyId: string): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database not available");

  await prisma.apiKey.update({
    where: { id: apiKeyId },
    data: { status: "revoked", revokedAt: new Date() },
  });

  // Clear Redis cache
  const redis = getRedis();
  if (redis) {
    await redis.del(`apikey:${apiKeyId}`);
  }
}

export async function getApiKeysByEmail(email: string) {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database not available");

  return prisma.apiKey.findMany({
    where: { email },
    select: {
      id: true,
      keyPrefix: true,
      name: true,
      tier: true,
      status: true,
      requestsToday: true,
      requestsTotal: true,
      dailyLimit: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApiKeyUsageStats(apiKeyId: string, days: number = 30) {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database not available");

  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await prisma.apiUsageLog.groupBy({
    by: ["endpoint"],
    where: {
      apiKeyId,
      createdAt: { gte: since },
    },
    _count: { id: true },
    _avg: { responseMs: true },
  });

  const dailyCounts = await prisma.apiUsageLog.groupBy({
    by: ["createdAt"],
    where: {
      apiKeyId,
      createdAt: { gte: since },
    },
    _count: { id: true },
  });

  return { byEndpoint: logs, dailyCounts };
}

export async function checkRateLimit(rawKey: string): Promise<{
  allowed: boolean;
  apiKeyId?: string;
  tier?: ApiTier;
  remaining?: number;
  limit?: number;
  error?: string;
}> {
  const validation = await validateApiKey(rawKey);
  if (!validation.valid) {
    return { allowed: false, error: validation.error };
  }

  const { apiKeyId, tier, dailyLimit, requestsToday } = validation;

  // Enterprise tier: unlimited
  if (dailyLimit === -1) {
    return { allowed: true, apiKeyId, tier, remaining: -1, limit: -1 };
  }

  const remaining = dailyLimit! - (requestsToday || 0);
  if (remaining <= 0) {
    return {
      allowed: false,
      apiKeyId,
      tier,
      remaining: 0,
      limit: dailyLimit,
      error: "Daily rate limit exceeded. Upgrade your plan for higher limits.",
    };
  }

  return { allowed: true, apiKeyId, tier, remaining, limit: dailyLimit };
}
