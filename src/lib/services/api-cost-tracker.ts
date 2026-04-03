/**
 * API Cost Tracker
 *
 * Tracks API usage per provider and calculates cost estimates.
 * Stores usage logs in Redis and provides cost projections for scaling.
 *
 * Providers tracked:
 * - DataForSEO: keyword discovery calls
 * - Tavily: web enrichment calls (3 per comparison)
 * - Claude/Anthropic: token usage for generation
 */

import { getRedis } from "./redis";

// Redis keys
const COST_LOG_KEY = "costs:api-calls";
const COST_DAILY_KEY = "costs:daily";
const RATE_LIMIT_KEY = "costs:rate-limits";

// Pricing (USD)
const PRICING = {
  dataforseo: {
    keyword_suggestions: 0.05,   // per task (up to 700 keywords)
    keyword_ideas: 0.05,
    related_keywords: 0.05,
    competitor_domains: 0.05,
    ranked_keywords: 0.05,
    bulk_difficulty: 0.02,       // per keyword in batch
    serp_organic: 0.04,          // per SERP
    trends_explore: 0.03,
  },
  tavily: {
    basic: 0.01,     // basic search
    advanced: 0.02,  // advanced search (enrichment)
  },
  anthropic: {
    // Claude Haiku 4.5 pricing per 1K tokens
    input_per_1k: 0.001,
    output_per_1k: 0.005,
    // Average tokens per comparison generation
    avg_input_tokens: 2000,
    avg_output_tokens: 2500,
  },
} as const;

export interface ApiCallLog {
  id: string;
  provider: "dataforseo" | "tavily" | "anthropic";
  endpoint: string;
  costUsd: number;
  tokens?: { input: number; output: number };
  timestamp: string;
  source: string; // "pipeline", "cron", "manual", "api"
}

export interface DailyCostSummary {
  date: string;
  dataforseo: { calls: number; costUsd: number };
  tavily: { calls: number; costUsd: number };
  anthropic: { calls: number; costUsd: number; inputTokens: number; outputTokens: number };
  totalCostUsd: number;
  comparisonsGenerated: number;
}

export interface RateLimitStatus {
  provider: string;
  endpoint: string;
  remaining: number | null;
  limit: number | null;
  resetAt: string | null;
  percentUsed: number | null;
  timestamp: string;
}

export interface CostProjection {
  comparisonsPerDay: number;
  dailyCost: {
    dataforseo: number;
    tavily: number;
    anthropic: number;
    total: number;
  };
  monthlyCost: {
    dataforseo: number;
    tavily: number;
    anthropic: number;
    total: number;
  };
  costPerComparison: number;
}

// ---------------------------------------------------------------------------
// Log API calls
// ---------------------------------------------------------------------------

export async function logApiCall(
  provider: ApiCallLog["provider"],
  endpoint: string,
  options: {
    costUsd?: number;
    tokens?: { input: number; output: number };
    source?: string;
  } = {}
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  let costUsd = options.costUsd ?? 0;

  // Auto-calculate cost if not provided
  if (!options.costUsd) {
    if (provider === "dataforseo") {
      const key = endpoint.replace(/\//g, "_").replace(/^_/, "") as keyof typeof PRICING.dataforseo;
      costUsd = PRICING.dataforseo[key] ?? 0.05;
    } else if (provider === "tavily") {
      costUsd = PRICING.tavily.advanced;
    } else if (provider === "anthropic" && options.tokens) {
      costUsd =
        (options.tokens.input / 1000) * PRICING.anthropic.input_per_1k +
        (options.tokens.output / 1000) * PRICING.anthropic.output_per_1k;
    }
  }

  const log: ApiCallLog = {
    id: `call-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    provider,
    endpoint,
    costUsd,
    tokens: options.tokens,
    timestamp: new Date().toISOString(),
    source: options.source ?? "pipeline",
  };

  try {
    await redis.lpush(COST_LOG_KEY, JSON.stringify(log));
    await redis.ltrim(COST_LOG_KEY, 0, 4999); // Keep last 5000

    // Update daily summary
    await updateDailySummary(redis, log);
  } catch {
    // Non-critical
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateDailySummary(redis: any, log: ApiCallLog): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const key = `${COST_DAILY_KEY}:${today}`;

  const existing = await redis.get(key);
  const summary: DailyCostSummary = existing && typeof existing === "object"
    ? existing as DailyCostSummary
    : {
        date: today,
        dataforseo: { calls: 0, costUsd: 0 },
        tavily: { calls: 0, costUsd: 0 },
        anthropic: { calls: 0, costUsd: 0, inputTokens: 0, outputTokens: 0 },
        totalCostUsd: 0,
        comparisonsGenerated: 0,
      };

  if (log.provider === "dataforseo") {
    summary.dataforseo.calls++;
    summary.dataforseo.costUsd += log.costUsd;
  } else if (log.provider === "tavily") {
    summary.tavily.calls++;
    summary.tavily.costUsd += log.costUsd;
  } else if (log.provider === "anthropic") {
    summary.anthropic.calls++;
    summary.anthropic.costUsd += log.costUsd;
    if (log.tokens) {
      summary.anthropic.inputTokens += log.tokens.input;
      summary.anthropic.outputTokens += log.tokens.output;
    }
  }

  summary.totalCostUsd = summary.dataforseo.costUsd + summary.tavily.costUsd + summary.anthropic.costUsd;

  await redis.set(key, summary, { ex: 90 * 86400 }); // 90-day retention
}

// ---------------------------------------------------------------------------
// Log rate limit status
// ---------------------------------------------------------------------------

export async function logRateLimit(
  provider: string,
  endpoint: string,
  remaining: number | null,
  limit: number | null,
  resetAt: string | null
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const status: RateLimitStatus = {
    provider,
    endpoint,
    remaining,
    limit,
    resetAt,
    percentUsed: remaining !== null && limit !== null && limit > 0
      ? Math.round(((limit - remaining) / limit) * 100)
      : null,
    timestamp: new Date().toISOString(),
  };

  try {
    const key = `${RATE_LIMIT_KEY}:${provider}:${endpoint.replace(/\//g, "_")}`;
    await redis.set(key, status, { ex: 3600 });

    // Alert if below 20%
    if (status.percentUsed !== null && status.percentUsed >= 80) {
      await redis.lpush("costs:rate-limit-alerts", JSON.stringify({
        ...status,
        alert: `Rate limit warning: ${provider}/${endpoint} at ${status.percentUsed}% usage`,
      }));
      await redis.ltrim("costs:rate-limit-alerts", 0, 99);
    }
  } catch {
    // Non-critical
  }
}

// ---------------------------------------------------------------------------
// Get cost data
// ---------------------------------------------------------------------------

export async function getRecentCosts(days: number = 30): Promise<DailyCostSummary[]> {
  const redis = getRedis();
  if (!redis) return [];

  const summaries: DailyCostSummary[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const key = `${COST_DAILY_KEY}:${dateStr}`;

    try {
      const data = await redis.get(key);
      if (data && typeof data === "object") {
        summaries.push(data as DailyCostSummary);
      }
    } catch {
      // Skip
    }
  }

  return summaries.reverse(); // Oldest first
}

export async function getRecentApiCalls(limit: number = 100): Promise<ApiCallLog[]> {
  const redis = getRedis();
  if (!redis) return [];

  const raw = await redis.lrange(COST_LOG_KEY, 0, limit - 1);
  return raw.map((r) => {
    if (typeof r === "string") {
      try { return JSON.parse(r); } catch { return r; }
    }
    return r as ApiCallLog;
  });
}

export async function getRateLimitStatuses(): Promise<RateLimitStatus[]> {
  const redis = getRedis();
  if (!redis) return [];

  const statuses: RateLimitStatus[] = [];
  const providers = ["dataforseo", "tavily", "anthropic"];

  for (const provider of providers) {
    // Scan for all endpoints for this provider
    // Since we can't scan with Upstash easily, check known endpoints
    const endpoints = provider === "dataforseo"
      ? ["keyword_suggestions", "keyword_ideas", "related_keywords", "competitor_domains", "ranked_keywords"]
      : provider === "tavily"
        ? ["search"]
        : ["messages"];

    for (const ep of endpoints) {
      const key = `${RATE_LIMIT_KEY}:${provider}:${ep}`;
      try {
        const data = await redis.get(key);
        if (data && typeof data === "object") {
          statuses.push(data as RateLimitStatus);
        }
      } catch {
        // Skip
      }
    }
  }

  return statuses;
}

export async function getRateLimitAlerts(): Promise<Array<RateLimitStatus & { alert: string }>> {
  const redis = getRedis();
  if (!redis) return [];

  const raw = await redis.lrange("costs:rate-limit-alerts", 0, 49);
  return raw.map((r) => {
    if (typeof r === "string") {
      try { return JSON.parse(r); } catch { return r; }
    }
    return r;
  });
}

// ---------------------------------------------------------------------------
// Cost projections
// ---------------------------------------------------------------------------

export function calculateCostProjection(comparisonsPerDay: number): CostProjection {
  // Per comparison:
  // - DataForSEO: 1 discovery call (amortized across batch) ≈ 0.05 / 10 = 0.005
  //   But we also do bulk discovery: ~2 calls per day at different category seeds
  const dataforseoPerComparison = 0.005;
  const dataforseoDailyFixed = 2 * 0.05; // 2 discovery batches/day

  // - Tavily: 3 enrichment calls per comparison (comparison + 2 entity)
  const tavilyPerComparison = 3 * PRICING.tavily.advanced;

  // - Anthropic: 1 generation call
  const anthropicPerComparison =
    (PRICING.anthropic.avg_input_tokens / 1000) * PRICING.anthropic.input_per_1k +
    (PRICING.anthropic.avg_output_tokens / 1000) * PRICING.anthropic.output_per_1k;

  const dailyDataforseo = dataforseoDailyFixed + comparisonsPerDay * dataforseoPerComparison;
  const dailyTavily = comparisonsPerDay * tavilyPerComparison;
  const dailyAnthropic = comparisonsPerDay * anthropicPerComparison;
  const dailyTotal = dailyDataforseo + dailyTavily + dailyAnthropic;

  const costPerComparison =
    dataforseoPerComparison + tavilyPerComparison + anthropicPerComparison;

  return {
    comparisonsPerDay,
    dailyCost: {
      dataforseo: Math.round(dailyDataforseo * 100) / 100,
      tavily: Math.round(dailyTavily * 100) / 100,
      anthropic: Math.round(dailyAnthropic * 100) / 100,
      total: Math.round(dailyTotal * 100) / 100,
    },
    monthlyCost: {
      dataforseo: Math.round(dailyDataforseo * 30 * 100) / 100,
      tavily: Math.round(dailyTavily * 30 * 100) / 100,
      anthropic: Math.round(dailyAnthropic * 30 * 100) / 100,
      total: Math.round(dailyTotal * 30 * 100) / 100,
    },
    costPerComparison: Math.round(costPerComparison * 1000) / 1000,
  };
}

// ---------------------------------------------------------------------------
// Pipeline capacity metrics
// ---------------------------------------------------------------------------

export async function getPipelineMetrics(): Promise<{
  daily: DailyCostSummary[];
  recentCalls: ApiCallLog[];
  rateLimits: RateLimitStatus[];
  rateLimitAlerts: Array<RateLimitStatus & { alert: string }>;
  projections: {
    at10: CostProjection;
    at25: CostProjection;
    at50: CostProjection;
    at100: CostProjection;
  };
  qualityScores: Array<{ slug: string; score: number; grade: string; timestamp: string }>;
}> {
  const [daily, recentCalls, rateLimits, rateLimitAlerts] = await Promise.all([
    getRecentCosts(30),
    getRecentApiCalls(50),
    getRateLimitStatuses(),
    getRateLimitAlerts(),
  ]);

  // Get quality scores from generation queue
  let qualityScores: Array<{ slug: string; score: number; grade: string; timestamp: string }> = [];
  try {
    const { getRecentQualityScores } = await import("./generation-queue");
    qualityScores = await getRecentQualityScores(50);
  } catch {
    // Optional
  }

  return {
    daily,
    recentCalls,
    rateLimits,
    rateLimitAlerts,
    projections: {
      at10: calculateCostProjection(10),
      at25: calculateCostProjection(25),
      at50: calculateCostProjection(50),
      at100: calculateCostProjection(100),
    },
    qualityScores,
  };
}
