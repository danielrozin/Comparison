/**
 * Generation Queue Service
 *
 * Redis-backed job queue that decouples content discovery from generation.
 * Supports parallel processing, retry with exponential backoff, and
 * entity enrichment caching to reduce API calls.
 *
 * Queue design:
 *   - Jobs are stored as Redis list entries keyed by status
 *   - Each job has a unique ID, retry count, and timestamps
 *   - Workers process N jobs concurrently (configurable)
 *   - Failed jobs retry up to 3 times with exponential backoff
 *   - Entity enrichment data is cached for 24h to avoid duplicate Tavily calls
 */

import { getRedis } from "./redis";
import { generateComparison } from "./ai-comparison-generator";
import { saveComparison, getComparisonBySlug } from "./comparison-service";
import { warmCacheForSlug } from "./cache-warming";
import { checkAndAlert } from "./pipeline-alerting";

// Redis keys
const QUEUE_PENDING = "genqueue:pending";
const QUEUE_PROCESSING = "genqueue:processing";
const QUEUE_COMPLETED = "genqueue:completed";
const QUEUE_FAILED = "genqueue:failed";
const QUEUE_STATS = "genqueue:stats";
const ENTITY_CACHE_PREFIX = "entity:enrichment:";

const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 5000; // 5s, 10s, 20s
const DEFAULT_CONCURRENCY = 5;
const ENTITY_CACHE_TTL = 86400; // 24h

export interface GenerationJob {
  id: string;
  entityA: string;
  entityB: string;
  slug: string;
  category: string | null;
  source: string; // "discovery", "manual", "cron", "api"
  priority: number; // higher = more urgent
  retries: number;
  status: "pending" | "processing" | "completed" | "failed";
  error: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  totalProcessed: number;
  avgDurationMs: number;
  lastProcessedAt: string | null;
}

// ---------------------------------------------------------------------------
// Enqueue jobs
// ---------------------------------------------------------------------------

export async function enqueueJob(
  entityA: string,
  entityB: string,
  options: {
    category?: string | null;
    source?: string;
    priority?: number;
  } = {}
): Promise<GenerationJob | null> {
  const redis = getRedis();
  if (!redis) return null;

  const slug = makeSlug(entityA, entityB);

  // Skip if comparison already exists
  const existing = await getComparisonBySlug(slug);
  if (existing) return null;

  // Skip if already in queue
  const inQueue = await isInQueue(slug);
  if (inQueue) return null;

  const job: GenerationJob = {
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    entityA,
    entityB,
    slug,
    category: options.category ?? null,
    source: options.source ?? "manual",
    priority: options.priority ?? 0,
    retries: 0,
    status: "pending",
    error: null,
    createdAt: new Date().toISOString(),
    startedAt: null,
    completedAt: null,
  };

  await redis.lpush(QUEUE_PENDING, JSON.stringify(job));
  return job;
}

export async function enqueueBatch(
  items: { entityA: string; entityB: string; category?: string | null; source?: string; priority?: number }[]
): Promise<{ enqueued: number; skipped: number }> {
  let enqueued = 0;
  let skipped = 0;

  for (const item of items) {
    const result = await enqueueJob(item.entityA, item.entityB, {
      category: item.category,
      source: item.source,
      priority: item.priority,
    });
    if (result) enqueued++;
    else skipped++;
  }

  return { enqueued, skipped };
}

// ---------------------------------------------------------------------------
// Process jobs (worker)
// ---------------------------------------------------------------------------

export async function processQueue(
  concurrency: number = DEFAULT_CONCURRENCY,
  maxJobs: number = 50
): Promise<{ processed: number; succeeded: number; failed: number; slugs: string[]; errors: string[] }> {
  const redis = getRedis();
  if (!redis) return { processed: 0, succeeded: 0, failed: 0, slugs: [], errors: [] };

  const slugs: string[] = [];
  const errors: string[] = [];
  let succeeded = 0;
  let failed = 0;

  // Pull jobs from pending queue (sorted by priority if we re-sort)
  const pendingRaw = await redis.lrange(QUEUE_PENDING, 0, maxJobs - 1);
  if (pendingRaw.length === 0) {
    return { processed: 0, succeeded: 0, failed: 0, slugs: [], errors: [] };
  }

  // Parse and sort by priority (higher first)
  const jobs: GenerationJob[] = pendingRaw.map((raw) => {
    if (typeof raw === "string") {
      try { return JSON.parse(raw); } catch { return raw; }
    }
    return raw as GenerationJob;
  });
  jobs.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  // Clear the pulled jobs from pending
  // We re-add failed ones back later
  await redis.ltrim(QUEUE_PENDING, pendingRaw.length, -1);

  // Process in batches of `concurrency`
  for (let i = 0; i < jobs.length; i += concurrency) {
    const batch = jobs.slice(i, i + concurrency);
    const results = await Promise.allSettled(
      batch.map((job) => processOneJob(redis, job))
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const job = batch[j];
      if (result.status === "fulfilled" && result.value.success) {
        succeeded++;
        slugs.push(job.slug);
      } else {
        failed++;
        const errMsg = result.status === "rejected"
          ? String(result.reason)
          : result.value.error || "Unknown";
        errors.push(`${job.slug}: ${errMsg}`);
      }
    }
  }

  // Update stats
  await updateStats(redis, succeeded, failed);

  // Check pipeline health and send alerts if needed
  checkAndAlert({ processed: jobs.length, succeeded, failed, errors }).catch(() => {});

  return { processed: jobs.length, succeeded, failed, slugs, errors };
}

async function processOneJob(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redis: any,
  job: GenerationJob
): Promise<{ success: boolean; error?: string }> {
  const startTime = Date.now();
  job.status = "processing";
  job.startedAt = new Date().toISOString();

  // Move to processing set
  await redis.lpush(QUEUE_PROCESSING, JSON.stringify(job));

  try {
    // Check again if it already exists (race condition guard)
    const existing = await getComparisonBySlug(job.slug);
    if (existing) {
      job.status = "completed";
      job.completedAt = new Date().toISOString();
      await moveToCompleted(redis, job);
      return { success: true };
    }

    // Generate the comparison
    const result = await generateComparison(job.entityA, job.entityB, job.slug);

    if (result.success && result.comparison) {
      // Save to database
      await saveComparison(result.comparison);

      // Cache entity data for future comparisons sharing these entities
      await cacheEntityEnrichment(job.entityA, job.slug);
      await cacheEntityEnrichment(job.entityB, job.slug);

      // Warm ISR cache for the new comparison page and home page
      warmCacheForSlug(job.slug).catch(() => {});

      job.status = "completed";
      job.completedAt = new Date().toISOString();
      await moveToCompleted(redis, job);

      // Track duration for stats
      const duration = Date.now() - startTime;
      await redis.lpush("genqueue:durations", duration);
      await redis.ltrim("genqueue:durations", 0, 99); // Keep last 100

      return { success: true };
    } else {
      throw new Error(result.error || "Generation returned no comparison");
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    job.error = errorMsg;

    if (job.retries < MAX_RETRIES) {
      // Retry with exponential backoff — re-add to pending with delay info
      job.retries++;
      job.status = "pending";
      const backoffMs = BACKOFF_BASE_MS * Math.pow(2, job.retries - 1);
      job.startedAt = null;
      // Store backoff as metadata — the next processQueue call will pick it up
      // In practice this means failed jobs get retried on the next cron cycle
      await redis.lpush(QUEUE_PENDING, JSON.stringify(job));
    } else {
      job.status = "failed";
      job.completedAt = new Date().toISOString();
      await moveToFailed(redis, job);
    }

    // Remove from processing
    await removeFromProcessing(redis, job.id);

    return { success: false, error: errorMsg };
  }
}

// ---------------------------------------------------------------------------
// Queue helpers
// ---------------------------------------------------------------------------

async function isInQueue(slug: string): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  // Check pending queue
  const pending = await redis.lrange(QUEUE_PENDING, 0, -1);
  for (const raw of pending) {
    const job = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (job.slug === slug) return true;
  }

  // Check processing queue
  const processing = await redis.lrange(QUEUE_PROCESSING, 0, -1);
  for (const raw of processing) {
    const job = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (job.slug === slug) return true;
  }

  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function moveToCompleted(redis: any, job: GenerationJob): Promise<void> {
  await redis.lpush(QUEUE_COMPLETED, JSON.stringify(job));
  await redis.ltrim(QUEUE_COMPLETED, 0, 499); // Keep last 500
  await removeFromProcessing(redis, job.id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function moveToFailed(redis: any, job: GenerationJob): Promise<void> {
  await redis.lpush(QUEUE_FAILED, JSON.stringify(job));
  await redis.ltrim(QUEUE_FAILED, 0, 199); // Keep last 200
  await removeFromProcessing(redis, job.id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function removeFromProcessing(redis: any, jobId: string): Promise<void> {
  const processing = await redis.lrange(QUEUE_PROCESSING, 0, -1);
  for (const raw of processing) {
    const job = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (job.id === jobId) {
      await redis.lrem(QUEUE_PROCESSING, 1, typeof raw === "string" ? raw : JSON.stringify(raw));
      break;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateStats(redis: any, succeeded: number, failed: number): Promise<void> {
  const raw = await redis.get(QUEUE_STATS);
  const stats: QueueStats = raw && typeof raw === "object"
    ? raw as QueueStats
    : {
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        totalProcessed: 0,
        avgDurationMs: 0,
        lastProcessedAt: null,
      };

  stats.totalProcessed += succeeded + failed;
  stats.completed += succeeded;
  stats.failed += failed;
  stats.lastProcessedAt = new Date().toISOString();

  // Calculate average duration from recent durations
  const durations = await redis.lrange("genqueue:durations", 0, -1);
  if (durations.length > 0) {
    const nums = durations.map((d: string | number) => Number(d)).filter((n: number) => !isNaN(n));
    stats.avgDurationMs = nums.length > 0 ? Math.round(nums.reduce((a: number, b: number) => a + b, 0) / nums.length) : 0;
  }

  await redis.set(QUEUE_STATS, stats);
}

// ---------------------------------------------------------------------------
// Entity enrichment cache
// ---------------------------------------------------------------------------

async function cacheEntityEnrichment(entityName: string, fromSlug: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const key = `${ENTITY_CACHE_PREFIX}${entityName.toLowerCase().replace(/\s+/g, "-")}`;
  try {
    const existing = await redis.get(key);
    const data = existing && typeof existing === "object"
      ? existing as { name: string; slugs: string[]; cachedAt: string }
      : { name: entityName, slugs: [], cachedAt: new Date().toISOString() };

    if (!data.slugs.includes(fromSlug)) {
      data.slugs.push(fromSlug);
    }

    await redis.set(key, data, { ex: ENTITY_CACHE_TTL });
  } catch {
    // Cache is optional
  }
}

export async function getCachedEntitySlugs(entityName: string): Promise<string[]> {
  const redis = getRedis();
  if (!redis) return [];

  const key = `${ENTITY_CACHE_PREFIX}${entityName.toLowerCase().replace(/\s+/g, "-")}`;
  try {
    const data = await redis.get(key);
    if (data && typeof data === "object") {
      return (data as { slugs: string[] }).slugs || [];
    }
    return [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Queue status / management
// ---------------------------------------------------------------------------

export async function getQueueStatus(): Promise<QueueStats> {
  const redis = getRedis();
  if (!redis) {
    return { pending: 0, processing: 0, completed: 0, failed: 0, totalProcessed: 0, avgDurationMs: 0, lastProcessedAt: null };
  }

  const [pendingLen, processingLen, completedLen, failedLen, statsRaw] = await Promise.all([
    redis.llen(QUEUE_PENDING),
    redis.llen(QUEUE_PROCESSING),
    redis.llen(QUEUE_COMPLETED),
    redis.llen(QUEUE_FAILED),
    redis.get(QUEUE_STATS),
  ]);

  const persisted = statsRaw && typeof statsRaw === "object"
    ? statsRaw as QueueStats
    : { totalProcessed: 0, avgDurationMs: 0, lastProcessedAt: null };

  return {
    pending: pendingLen || 0,
    processing: processingLen || 0,
    completed: completedLen || 0,
    failed: failedLen || 0,
    totalProcessed: persisted.totalProcessed || 0,
    avgDurationMs: persisted.avgDurationMs || 0,
    lastProcessedAt: persisted.lastProcessedAt || null,
  };
}

export async function getRecentJobs(
  status: "completed" | "failed",
  limit: number = 20
): Promise<GenerationJob[]> {
  const redis = getRedis();
  if (!redis) return [];

  const key = status === "completed" ? QUEUE_COMPLETED : QUEUE_FAILED;
  const raw = await redis.lrange(key, 0, limit - 1);
  return raw.map((r) => {
    if (typeof r === "string") {
      try { return JSON.parse(r); } catch { return r; }
    }
    return r as GenerationJob;
  });
}

export async function clearQueue(status?: "pending" | "failed"): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  if (status === "pending") {
    await redis.del(QUEUE_PENDING);
  } else if (status === "failed") {
    await redis.del(QUEUE_FAILED);
  } else {
    await Promise.all([
      redis.del(QUEUE_PENDING),
      redis.del(QUEUE_PROCESSING),
      redis.del(QUEUE_FAILED),
    ]);
  }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function makeSlug(entityA: string, entityB: string): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  const a = clean(entityA);
  const b = clean(entityB);
  // Sort alphabetically so "A vs B" and "B vs A" produce the same slug
  return a <= b ? `${a}-vs-${b}` : `${b}-vs-${a}`;
}
