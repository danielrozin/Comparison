/**
 * Per-IP rate limiter using a sliding window counter.
 * Uses Upstash Redis when available, falls back to in-memory Map.
 */

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterSeconds?: number;
};

// In-memory fallback store (cleared on cold start, fine for serverless)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

// Periodically clean expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanupMemoryStore(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of memoryStore) {
    if (now > entry.resetAt + windowMs) {
      memoryStore.delete(key);
    }
  }
}

async function checkRedis(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult | null> {
  try {
    const { getRedis } = await import("@/lib/services/redis");
    const redis = getRedis();
    if (!redis) return null;

    const now = Math.floor(Date.now() / 1000);
    const windowKey = `ratelimit:${key}:${Math.floor(now / windowSeconds)}`;

    const count = await redis.incr(windowKey);
    if (count === 1) {
      await redis.expire(windowKey, windowSeconds + 1);
    }

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      limit,
      retryAfterSeconds: count > limit ? windowSeconds : undefined,
    };
  } catch {
    return null; // Fall back to in-memory
  }
}

function checkMemory(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  cleanupMemoryStore(windowMs);
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, limit };
  }

  entry.count++;
  const remaining = Math.max(0, limit - entry.count);
  return {
    allowed: entry.count <= limit,
    remaining,
    limit,
    retryAfterSeconds: entry.count > limit
      ? Math.ceil((entry.resetAt - now) / 1000)
      : undefined,
  };
}

export type RateLimitConfig = {
  /** Max requests per window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
};

/** Default tiers for different route categories */
export const RATE_LIMIT_TIERS = {
  /** Public read endpoints (search, popular, recent) */
  read: { limit: 60, windowSeconds: 60 } as RateLimitConfig,
  /** User write endpoints (feedback, newsletter, comments) */
  write: { limit: 10, windowSeconds: 60 } as RateLimitConfig,
  /** Generation endpoints (comparisons/generate, blog/generate) */
  generate: { limit: 5, windowSeconds: 60 } as RateLimitConfig,
  /** Admin/cron endpoints */
  admin: { limit: 30, windowSeconds: 60 } as RateLimitConfig,
} as const;

/**
 * Check rate limit for a given identifier (typically IP address).
 * Tries Redis first, falls back to in-memory.
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `${identifier}:${config.limit}:${config.windowSeconds}`;
  const redisResult = await checkRedis(key, config.limit, config.windowSeconds);
  if (redisResult) return redisResult;
  return checkMemory(key, config.limit, config.windowSeconds * 1000);
}
