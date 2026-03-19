/**
 * Content Velocity Pipeline Service
 * Discovers keyword opportunities via DataForSEO and generates comparisons via Claude.
 */

import { getRedis } from "./redis";
import {
  discoverByCategory,
  discoverByEntity,
  discoverFromCompetitors,
  type DiscoveredOpportunity,
} from "@/lib/dataforseo/keyword-discovery";
import { generateComparison } from "./ai-comparison-generator";

// Redis key constants
const REDIS_KEY_OPPORTUNITIES = "pipeline:opportunities";
const REDIS_KEY_RUNS = "pipeline:runs";

function generatedKey(slug: string) {
  return `pipeline:generated:${slug}`;
}

export interface PipelineRun {
  id: string;
  mode: "discover" | "generate" | "full";
  startedAt: string;
  completedAt: string | null;
  discovered: number;
  generated: number;
  errors: string[];
}

export interface PipelineStatus {
  lastRun: PipelineRun | null;
  totalDiscovered: number;
  totalGenerated: number;
  recentRuns: PipelineRun[];
}

/**
 * Check if a keyword is a comparison keyword
 */
function isComparisonKeyword(keyword: string): boolean {
  return /\bvs\b|versus|compar|alternative|difference between/i.test(keyword);
}

/**
 * Create a slug from entity names
 */
function makeSlug(entityA: string, entityB: string): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${clean(entityA)}-vs-${clean(entityB)}`;
}

/**
 * Run keyword discovery for a category or entity and store results in Redis.
 */
export async function runDiscovery(
  category?: string,
  entity?: string,
  mode?: "competitors"
): Promise<DiscoveredOpportunity[]> {
  let discovered: DiscoveredOpportunity[];

  if (mode === "competitors") {
    discovered = await discoverFromCompetitors();
  } else if (entity) {
    discovered = await discoverByEntity(entity, category);
  } else if (category) {
    discovered = await discoverByCategory(category);
  } else {
    discovered = await discoverByCategory("technology");
  }

  // Filter for comparison keywords only
  const comparisonOpps = discovered.filter((opp) =>
    isComparisonKeyword(opp.keyword)
  );

  // Store in Redis (merge with existing, dedup by keyword)
  await mergeOpportunities(comparisonOpps);

  return comparisonOpps;
}

/**
 * Merge new opportunities with existing ones in Redis (dedup by keyword).
 */
export async function mergeOpportunities(
  newOpps: DiscoveredOpportunity[]
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const existing = await getStoredOpportunities();
  const byKeyword = new Map<string, DiscoveredOpportunity>();

  // Existing first, then new ones overwrite (fresher data)
  for (const opp of existing) {
    byKeyword.set(opp.keyword.toLowerCase(), opp);
  }
  for (const opp of newOpps) {
    byKeyword.set(opp.keyword.toLowerCase(), opp);
  }

  const merged = Array.from(byKeyword.values()).sort(
    (a, b) => b.opportunityScore - a.opportunityScore
  );

  await redis.set(REDIS_KEY_OPPORTUNITIES, JSON.stringify(merged));
}

/**
 * Take top N discovered opportunities and generate comparisons via Claude.
 */
export async function runGeneration(
  limit: number = 5
): Promise<{ generated: number; errors: string[] }> {
  const opportunities = await getStoredOpportunities();
  const errors: string[] = [];
  let generated = 0;

  // Take top N by opportunityScore that have both entities parsed
  const toGenerate = opportunities
    .filter((opp) => opp.entityA && opp.entityB)
    .slice(0, limit);

  const redis = getRedis();

  for (const opp of toGenerate) {
    try {
      const slug = makeSlug(opp.entityA!, opp.entityB!);

      // Skip if already generated
      if (redis) {
        const existing = await redis.get(generatedKey(slug));
        if (existing) {
          continue;
        }
      }

      const result = await generateComparison(opp.entityA!, opp.entityB!, slug);

      if (result.success && result.comparison) {
        if (redis) {
          await redis.set(
            generatedKey(slug),
            JSON.stringify(result.comparison)
          );
        }
        generated++;
      } else {
        errors.push(`${opp.keyword}: ${result.error || "Generation failed"}`);
      }
    } catch (err) {
      errors.push(
        `${opp.keyword}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  return { generated, errors };
}

/**
 * Get all stored opportunities from Redis.
 */
export async function getStoredOpportunities(): Promise<
  DiscoveredOpportunity[]
> {
  const redis = getRedis();
  if (!redis) return [];

  const raw = await redis.get(REDIS_KEY_OPPORTUNITIES);
  if (!raw) return [];

  try {
    // Upstash redis.get auto-parses JSON, so raw may already be an array
    if (Array.isArray(raw)) return raw as DiscoveredOpportunity[];
    return JSON.parse(raw as string) as DiscoveredOpportunity[];
  } catch {
    return [];
  }
}

/**
 * Record a pipeline run in Redis.
 */
export async function recordPipelineRun(run: PipelineRun): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  await redis.lpush(REDIS_KEY_RUNS, JSON.stringify(run));
}

/**
 * Get pipeline status: last run, totals, recent runs.
 */
export async function getPipelineStatus(): Promise<PipelineStatus> {
  const redis = getRedis();
  if (!redis) {
    return { lastRun: null, totalDiscovered: 0, totalGenerated: 0, recentRuns: [] };
  }

  // Get recent runs
  const rawRuns = await redis.lrange(REDIS_KEY_RUNS, 0, 19);
  const recentRuns: PipelineRun[] = rawRuns.map((r) => {
    if (typeof r === "string") {
      try { return JSON.parse(r); } catch { return r; }
    }
    return r as PipelineRun;
  });

  // Get opportunities count
  const opportunities = await getStoredOpportunities();
  const totalDiscovered = opportunities.length;

  // Count generated (sum from runs)
  const totalGenerated = recentRuns.reduce((sum, r) => sum + (r.generated || 0), 0);

  return {
    lastRun: recentRuns.length > 0 ? recentRuns[0] : null,
    totalDiscovered,
    totalGenerated,
    recentRuns,
  };
}
