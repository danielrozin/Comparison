import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient, flushPostHog } from "@/lib/posthog-server";
import { z } from "zod";
import {
  generateComparison,
  type GenerationErrorStage,
} from "@/lib/services/ai-comparison-generator";
import {
  isDegenerateComparisonSlug,
  parseComparisonSlug,
  stripKeywordSuffixSlug,
} from "@/lib/utils/slugify";
import { canonicalRequestedComparisonSlug } from "@/lib/parse-comparison-query";
import { relatedComparisonSlugs } from "@/lib/compare-slug-resolution";
import {
  getComparisonBySlug,
  isComparisonDbConfigured,
  saveComparison,
} from "@/lib/services/comparison-service";
import { warmCacheForPaths, warmCacheForSlug } from "@/lib/services/cache-warming";
import { captureGenerationLifecycle } from "@/lib/generation/generation-events";
import { provisionalPageNeedsRegeneration } from "@/lib/generation/comparison-content";
import { sanitizeErrorMessage } from "@/lib/utils/sanitize";
import {
  startAttempt,
  finishAttemptSuccess,
  finishAttemptFailure,
  evaluateAttemptGuard,
  type AttemptStage,
} from "@/lib/services/generation-attempt-tracker";
import { assertBrowserGenerationRequest } from "@/lib/generation/generation-bot-check";
import {
  isUserGenerationEnabled,
  queryBlockReason,
  validateRealEntities,
} from "@/lib/generation/user-generation-guard";
import { consumeUserGenerationSlot } from "@/lib/generation/user-generation-rate-limit";
import type { ComparisonPageData } from "@/types";

export const maxDuration = 60;
export const runtime = "nodejs";

const generateSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

const HIDDEN_STATUSES = new Set(["archived", "draft", "review"]);

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isServable(row: ComparisonPageData | null): row is ComparisonPageData {
  if (!row || (row.entities?.length ?? 0) < 2) return false;
  if (provisionalPageNeedsRegeneration(row.metadata)) return false;
  const status = row.metadata?.status;
  if (!status) return !isComparisonDbConfigured();
  return status === "published" || status === "provisional";
}

function blocksRegeneration(row: ComparisonPageData | null): boolean {
  const status = row?.metadata?.status;
  return typeof status === "string" && HIDDEN_STATUSES.has(status);
}

async function loadRow(slug: string): Promise<ComparisonPageData | null> {
  return getComparisonBySlug(slug).catch(() => null);
}

/**
 * Server events use a fixed distinct id. Never a test project id, and never
 * a visitor id copied from the browser (ROO-97: headless clients must not
 * mint analytics identities through this route).
 */
async function captureServerEvent(
  event: string,
  properties: { slug: string; reason: string; duration_ms: number },
) {
  try {
    getPostHogClient().capture({
      distinctId: "system",
      event,
      properties,
    });
    await flushPostHog();
  } catch (err) {
    console.error(`[posthog] ${event} capture failed:`, err);
  }
}

/**
 * POST /api/comparisons/generate
 *
 * Visitor-requested generation. Independent of GENERATION_FREEZE and
 * PAUSE_GENERIC_GENERATION — those still freeze cron and batch jobs.
 * This route runs only when USER_GENERATION_ENABLED=true.
 *
 * A null save is a failure. The route never reports success unless the
 * row was persisted.
 */
export async function POST(request: NextRequest) {
  if (!isUserGenerationEnabled()) {
    return NextResponse.json(
      {
        status: "disabled",
        error: "On-demand comparison generation is turned off.",
      },
      { status: 503 },
    );
  }

  try {
    const bot = await assertBrowserGenerationRequest(request);
    if (!bot.ok) {
      return NextResponse.json(
        { status: "refused", reason: bot.reason, error: "This request was not accepted." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    const { slug } = parsed.data;
    const slugParts = parseComparisonSlug(slug);
    if (!slugParts || slugParts.entities.length !== 2) {
      return NextResponse.json(
        { error: "Invalid comparison slug format. Use: entity-a-vs-entity-b" },
        { status: 400 },
      );
    }
    if (isDegenerateComparisonSlug(slug)) {
      return NextResponse.json({ status: "refused", reason: "self_compare", error: "That comparison is the same thing twice." }, { status: 400 });
    }

    const canonicalSlug = canonicalRequestedComparisonSlug(slug);
    if (!canonicalSlug) {
      return NextResponse.json(
        { status: "refused", reason: "self_compare", error: "That comparison is the same thing twice." },
        { status: 400 },
      );
    }
    const baseSlug = stripKeywordSuffixSlug(canonicalSlug);
    // Reverse order, alias spellings, and keyword-suffix forms are the same
    // matchup. A live row on any of them is returned instead of a new copy.
    const candidates = [
      ...new Set([...relatedComparisonSlugs(slug), ...(baseSlug ? [baseSlug] : [])]),
    ];

    const rows = await Promise.all(candidates.map((candidate) => loadRow(candidate)));
    for (let i = 0; i < candidates.length; i++) {
      const row = rows[i];
      if (isServable(row)) {
        return NextResponse.json({
          status: "ready",
          comparison: row,
          canonicalSlug: row.slug,
        });
      }
    }
    if (rows.some((row) => blocksRegeneration(row))) {
      return NextResponse.json(
        {
          status: "refused",
          reason: "unavailable",
          error: "This comparison isn't available to build.",
        },
        { status: 409 },
      );
    }

    const genSlug = baseSlug && baseSlug !== canonicalSlug ? baseSlug : canonicalSlug;
    const genParts = parseComparisonSlug(genSlug) ?? slugParts;
    const entityNames = genParts.entities.map((part) => part.replace(/-/g, " "));
    const [entityA, entityB] = entityNames;

    const blocked = queryBlockReason(entityA, entityB);
    if (blocked) {
      await captureServerEvent("generation_failed", {
        slug: genSlug,
        reason: blocked,
        duration_ms: 0,
      });
      return NextResponse.json(
        { status: "refused", reason: blocked, error: "We can't build that comparison." },
        { status: 422 },
      );
    }

    const guard = await evaluateAttemptGuard(genSlug);
    if (guard.action === "dedupe_inflight") {
      return NextResponse.json(
        { status: "in_progress", error: guard.reason },
        { status: 202 },
      );
    }
    if (guard.action === "block_repeat_failure") {
      return NextResponse.json(
        {
          status: "error",
          error: guard.reason,
          errorStage: guard.lastErrorStage ?? "unknown",
          blocked: true,
          reason: "blocked",
        },
        { status: 503 },
      );
    }

    const slot = await consumeUserGenerationSlot(clientIp(request), genSlug);
    if (!slot.allowed) {
      await captureServerEvent("generation_failed", {
        slug: genSlug,
        reason: slot.reason,
        duration_ms: 0,
      });
      return NextResponse.json(
        {
          status: "refused",
          reason: slot.reason,
          error: "Too many comparisons are being built right now. Please try again later.",
        },
        { status: 429 },
      );
    }

    const entities = await validateRealEntities(entityA, entityB);
    if (!entities.ok) {
      await captureServerEvent("generation_failed", {
        slug: genSlug,
        reason: entities.reason,
        duration_ms: 0,
      });
      return NextResponse.json(
        {
          status: "refused",
          reason: entities.reason,
          error: "We couldn't confirm both sides are real topics.",
        },
        { status: 422 },
      );
    }

    const attempt = await startAttempt(genSlug, "user");
    const startedAt = Date.now();
    await captureServerEvent("generation_started", {
      slug: genSlug,
      reason: "user_request",
      duration_ms: 0,
    });

    let result;
    try {
      result = await generateComparison(entityA, entityB, genSlug, { keepBelowQualityBar: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation crashed";
      if (attempt) {
        await finishAttemptFailure(attempt.id, "unknown", message, Date.now() - startedAt);
      }
      await captureServerEvent("generation_failed", {
        slug: genSlug,
        reason: "unknown",
        duration_ms: Date.now() - startedAt,
      });
      return NextResponse.json(
        { status: "error", error: sanitizeErrorMessage(err, "Generation failed"), errorStage: "unknown", reason: "unknown" },
        { status: 500 },
      );
    }

    if (result.success && result.comparison) {
      const saved = await saveComparison(result.comparison, { origin: "user" });
      if (!saved) {
        if (attempt) {
          await finishAttemptFailure(attempt.id, "save", "saveComparison returned null", Date.now() - startedAt);
        }
        await captureServerEvent("generation_failed", {
          slug: genSlug,
          reason: "save_rejected",
          duration_ms: Date.now() - startedAt,
        });
        return NextResponse.json(
          {
            status: "error",
            error: "We couldn't save this comparison.",
            errorStage: "save",
            reason: "save_rejected",
          },
          { status: 500 },
        );
      }

      if (attempt) {
        await finishAttemptSuccess(attempt.id, Date.now() - startedAt);
      }
      await captureServerEvent("generation_succeeded", {
        slug: result.comparison.slug,
        reason: saved.status,
        duration_ms: Date.now() - startedAt,
      });
      if (saved.promoted) {
        await captureServerEvent("generated_page_promoted", {
          slug: result.comparison.slug,
          reason: "quality_pass",
          duration_ms: Date.now() - startedAt,
        });
        await captureGenerationLifecycle("generation_promoted", {
          slug: result.comparison.slug,
          reasons: [],
          attempt: 0,
        });
      } else if (saved.status === "provisional") {
        await captureGenerationLifecycle("generation_promotion_failed", {
          slug: result.comparison.slug,
          reasons: saved.promotionReasons,
          attempt: 1,
        });
      }
      try {
        getPostHogClient().capture({
          distinctId: "system",
          event: "comparison_generated",
          properties: {
            slug: result.comparison.slug,
            comparison_slug: result.comparison.slug,
            category: result.comparison.category ?? null,
            status: saved.status,
          },
        });
        await flushPostHog();
      } catch (err) {
        console.error("[posthog] comparison_generated capture failed:", err);
      }
      if (saved.promoted) {
        await warmCacheForPaths([`/compare/${result.comparison.slug}`, "/sitemap/1.xml"]);
      } else {
        await warmCacheForSlug(result.comparison.slug);
      }
      return NextResponse.json({
        status: "ready",
        comparison: result.comparison,
        canonicalSlug: result.comparison.slug,
        persistedStatus: saved.status,
      });
    }

    const stage: AttemptStage = (result.errorStage as GenerationErrorStage | undefined) ?? "unknown";
    if (attempt) {
      await finishAttemptFailure(
        attempt.id,
        stage,
        result.error ?? "Generation failed",
        Date.now() - startedAt,
      );
    }
    await captureServerEvent("generation_failed", {
      slug: genSlug,
      reason: stage,
      duration_ms: Date.now() - startedAt,
    });
    return NextResponse.json(
      { status: "error", error: result.error || "Generation failed", errorStage: stage, reason: stage },
      { status: 500 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: error instanceof Error ? error.message : "Generation failed", reason: "unknown" },
      { status: 500 },
    );
  }
}
