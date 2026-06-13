/**
 * Generation Attempt Tracker
 *
 * Persists every on-demand AI comparison generation attempt to the
 * `generation_attempts` table so we can:
 *   1. Deduplicate concurrent visits to the same stuck slug.
 *   2. Surface a meaningful error (vs. infinite loading) when a
 *      slug has failed repeatedly within the cooldown window.
 *   3. Detect generations stuck `in_progress` past a threshold
 *      (>2h) for monitoring/alerting.
 *
 * Background context (DAN-596): the synchronous generate route used
 * to swallow all failures (no DB record, fire-and-forget save), so
 * stuck slugs would show the loading UI forever — every visit kicked
 * off a fresh attempt that hit the same upstream failure.
 */

import { getPrisma } from "@/lib/db/prisma";

export type AttemptStatus = "in_progress" | "succeeded" | "failed";
export type AttemptStage =
  | "tavily"
  | "anthropic"
  | "parse"
  | "save"
  | "timeout"
  | "quality"
  | "unknown";

export interface AttemptRow {
  id: string;
  slug: string;
  status: AttemptStatus;
  attempt: number;
  errorStage: string | null;
  errorMessage: string | null;
  durationMs: number | null;
  source: string;
  startedAt: Date;
  completedAt: Date | null;
}

export const RECENT_FAILURE_WINDOW_MS = 30 * 60 * 1000; // 30 min
export const MAX_FAILURES_BEFORE_BLOCK = 3;
export const IN_PROGRESS_DEDUPE_WINDOW_MS = 90 * 1000; // 90s — longer than any single gen
export const STUCK_THRESHOLD_MS = 2 * 60 * 60 * 1000; // 2h

/**
 * Start a new attempt row. Returns null if Prisma is unavailable
 * (mock-data mode); callers should treat that as "best-effort, just
 * run the generation without tracking".
 */
export async function startAttempt(
  slug: string,
  source: "user" | "cron" | "admin_backfill" = "user"
): Promise<AttemptRow | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  try {
    const previousCount = await prisma.generationAttempt.count({ where: { slug } });
    const row = await prisma.generationAttempt.create({
      data: {
        slug,
        status: "in_progress",
        attempt: previousCount + 1,
        source,
      },
    });
    return row as AttemptRow;
  } catch (e) {
    console.warn("startAttempt failed:", e);
    return null;
  }
}

export async function finishAttemptSuccess(
  attemptId: string,
  durationMs: number
): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) return;
  try {
    await prisma.generationAttempt.update({
      where: { id: attemptId },
      data: {
        status: "succeeded",
        completedAt: new Date(),
        durationMs,
      },
    });
  } catch (e) {
    console.warn("finishAttemptSuccess failed:", e);
  }
}

export async function finishAttemptFailure(
  attemptId: string,
  stage: AttemptStage,
  message: string,
  durationMs: number
): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) return;
  try {
    await prisma.generationAttempt.update({
      where: { id: attemptId },
      data: {
        status: "failed",
        errorStage: stage,
        errorMessage: message.slice(0, 2000),
        completedAt: new Date(),
        durationMs,
      },
    });
  } catch (e) {
    console.warn("finishAttemptFailure failed:", e);
  }
}

export interface AttemptGuard {
  action: "proceed" | "dedupe_inflight" | "block_repeat_failure";
  /** Reason / human-readable detail to optionally surface to the UI */
  reason?: string;
  /** Last attempt's failure stage (when blocking) */
  lastErrorStage?: string | null;
}

/**
 * Decide whether a fresh generate request should proceed, wait on an
 * in-flight attempt, or be blocked because the slug has failed too
 * many times recently.
 */
export async function evaluateAttemptGuard(slug: string): Promise<AttemptGuard> {
  const prisma = getPrisma();
  if (!prisma) return { action: "proceed" };

  try {
    const recent = await prisma.generationAttempt.findMany({
      where: { slug },
      orderBy: { startedAt: "desc" },
      take: MAX_FAILURES_BEFORE_BLOCK + 1,
    });

    const inflight = recent.find((r) => {
      if (r.status !== "in_progress") return false;
      const ageMs = Date.now() - r.startedAt.getTime();
      // Treat anything older than the dedupe window as abandoned —
      // it's almost certainly a function that died (Vercel timeout)
      // and never wrote a final status. Don't block new attempts.
      return ageMs <= IN_PROGRESS_DEDUPE_WINDOW_MS;
    });
    if (inflight) {
      return {
        action: "dedupe_inflight",
        reason: "Another visitor is already generating this comparison — please wait a few seconds and refresh.",
      };
    }

    const recentFailures = recent.filter((r) => {
      if (r.status !== "failed") return false;
      const ageMs = Date.now() - (r.completedAt ?? r.startedAt).getTime();
      return ageMs <= RECENT_FAILURE_WINDOW_MS;
    });
    if (recentFailures.length >= MAX_FAILURES_BEFORE_BLOCK) {
      const last = recentFailures[0];
      return {
        action: "block_repeat_failure",
        reason: `This comparison has failed to generate ${recentFailures.length} times recently. Our team has been notified.`,
        lastErrorStage: last?.errorStage ?? null,
      };
    }

    return { action: "proceed" };
  } catch (e) {
    console.warn("evaluateAttemptGuard failed, allowing through:", e);
    return { action: "proceed" };
  }
}

/**
 * Find generations that have been stuck in `in_progress` past the
 * stuck threshold. Used by the monitoring cron + admin tooling.
 */
export async function findStuckAttempts(thresholdMs: number = STUCK_THRESHOLD_MS) {
  const prisma = getPrisma();
  if (!prisma) return [];

  const cutoff = new Date(Date.now() - thresholdMs);
  return prisma.generationAttempt.findMany({
    where: { status: "in_progress", startedAt: { lt: cutoff } },
    orderBy: { startedAt: "asc" },
  });
}

/**
 * Mark a stuck `in_progress` attempt as failed with a synthetic
 * timeout reason. Returns the slug that was unstuck.
 */
export async function reapStuckAttempt(attemptId: string): Promise<string | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  try {
    const updated = await prisma.generationAttempt.update({
      where: { id: attemptId },
      data: {
        status: "failed",
        errorStage: "timeout",
        errorMessage: "Reaped by monitor — function never reported completion (likely Vercel timeout / crash)",
        completedAt: new Date(),
      },
    });
    return updated.slug;
  } catch (e) {
    console.warn("reapStuckAttempt failed:", e);
    return null;
  }
}

/**
 * Slugs the system currently considers "stuck": either repeatedly
 * failing within the window, or with an in_progress row past the
 * stuck threshold. Used by admin dashboards.
 */
export async function listStuckSlugs(): Promise<
  { slug: string; status: AttemptStatus; lastError: string | null; lastStage: string | null; attempts: number; lastAt: Date }[]
> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const failureCutoff = new Date(Date.now() - RECENT_FAILURE_WINDOW_MS);
  const stuckCutoff = new Date(Date.now() - STUCK_THRESHOLD_MS);

  // Group by slug, take the most-recent attempt per slug.
  const recent = await prisma.generationAttempt.findMany({
    where: {
      OR: [
        { status: "failed", completedAt: { gte: failureCutoff } },
        { status: "in_progress", startedAt: { lt: stuckCutoff } },
      ],
    },
    orderBy: { startedAt: "desc" },
    take: 200,
  });

  const bySlug = new Map<string, AttemptRow>();
  for (const row of recent) {
    if (!bySlug.has(row.slug)) bySlug.set(row.slug, row as AttemptRow);
  }

  // Tally attempt counts in window per slug.
  const tallies = new Map<string, number>();
  for (const row of recent) {
    tallies.set(row.slug, (tallies.get(row.slug) ?? 0) + 1);
  }

  return Array.from(bySlug.values()).map((row) => ({
    slug: row.slug,
    status: row.status,
    lastError: row.errorMessage,
    lastStage: row.errorStage,
    attempts: tallies.get(row.slug) ?? 1,
    lastAt: row.completedAt ?? row.startedAt,
  }));
}
