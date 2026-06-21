import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  generateComparison,
  generateMultiComparison,
  type GenerationErrorStage,
} from "@/lib/services/ai-comparison-generator";
import { parseComparisonSlug, comparisonSlugN } from "@/lib/utils/slugify";
import { getComparisonBySlug, saveComparison } from "@/lib/services/comparison-service";
import {
  resolveCanonicalCompareSlug,
  isCanonicalCompareSurvivor,
} from "@/lib/redirects/compare-redirects";
import { sanitizeErrorMessage } from "@/lib/utils/sanitize";
import {
  startAttempt,
  finishAttemptSuccess,
  finishAttemptFailure,
  evaluateAttemptGuard,
  type AttemptStage,
} from "@/lib/services/generation-attempt-tracker";

export const maxDuration = 60; // Allow up to 60s for AI generation

const generateSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

/**
 * POST /api/comparisons/generate
 *
 * Generates an AI comparison synchronously and persists the result.
 *
 * Failure-handling contract (DAN-596):
 *   - Every attempt is recorded in `generation_attempts` so visits to
 *     a stuck slug surface a real error instead of looping the
 *     loading UI forever.
 *   - Concurrent visits to the same slug are deduplicated against an
 *     in-flight attempt (90s window).
 *   - After N recent failures the route short-circuits with a 503 +
 *     `errorStage: "blocked"` so the client renders a meaningful
 *     error and stops auto-retrying every visit.
 *   - The DB save is awaited so a save failure is recorded, not
 *     silently dropped.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    const { slug } = parsed.data;

    const slugParts = parseComparisonSlug(slug);
    if (!slugParts) {
      return NextResponse.json({ error: "Invalid comparison slug format. Use: entity-a-vs-entity-b" }, { status: 400 });
    }

    // If the comparison was generated and saved while this request was
    // queueing (common for popular slugs), short-circuit and serve it
    // instead of regenerating.
    const existing = await getComparisonBySlug(slug).catch(() => null);
    if (existing) {
      return NextResponse.json({ status: "ready", comparison: existing });
    }

    // Source-prevention for A-vs-B / B-vs-A cannibalization (Semrush 2026-06-21):
    // before generating a NEW comparison, fold the requested ordering to its
    // canonical survivor so we never persist a fresh duplicate row.
    //   1. Known retired ordering → its mapped survivor (covers footprint/health
    //      exceptions where the survivor is intentionally non-alphabetical).
    //   2. Brand-new pair (neither ordering known) → enforce the alphabetical
    //      ordering, matching comparisonSlug()/comparisonSlugN() so the only row
    //      ever created is the one the redirect table would canonicalize to.
    // Existing pages already short-circuited above, so this never re-alphabetizes
    // a legitimately non-alphabetical page that already exists.
    let canonicalSlug = resolveCanonicalCompareSlug(slug);
    if (canonicalSlug === slug && !isCanonicalCompareSurvivor(slug)) {
      const alpha = comparisonSlugN(
        slugParts.entities.map((p) => p.replace(/-/g, " ")),
      );
      if (alpha && alpha !== slug) canonicalSlug = alpha;
    }
    if (canonicalSlug !== slug) {
      const canonicalExisting = await getComparisonBySlug(canonicalSlug).catch(
        () => null,
      );
      if (canonicalExisting) {
        return NextResponse.json({
          status: "ready",
          comparison: canonicalExisting,
          canonicalSlug,
        });
      }
    }

    // From here on generate and persist under the canonical ordering only.
    const slugForGeneration = canonicalSlug;
    const partsForGeneration =
      parseComparisonSlug(slugForGeneration) ?? slugParts;

    const guard = await evaluateAttemptGuard(slugForGeneration);
    if (guard.action === "dedupe_inflight") {
      return NextResponse.json(
        { status: "in_progress", error: guard.reason },
        { status: 202 }
      );
    }
    if (guard.action === "block_repeat_failure") {
      return NextResponse.json(
        {
          status: "error",
          error: guard.reason,
          errorStage: guard.lastErrorStage ?? "unknown",
          blocked: true,
        },
        { status: 503 }
      );
    }

    const entityNames = partsForGeneration.entities.map((p) =>
      p.replace(/-/g, " "),
    );
    const entityA = entityNames[0];
    const entityB = entityNames[1];
    const isMulti = entityNames.length > 2;

    const attempt = await startAttempt(slugForGeneration, "user");
    const startedAt = Date.now();

    let result;
    try {
      result = isMulti
        ? await generateMultiComparison(entityNames, slugForGeneration)
        : await generateComparison(entityA, entityB, slugForGeneration);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation crashed";
      if (attempt) {
        await finishAttemptFailure(attempt.id, "unknown", message, Date.now() - startedAt);
      }
      return NextResponse.json(
        { status: "error", error: sanitizeErrorMessage(err, "Generation failed"), errorStage: "unknown" },
        { status: 500 }
      );
    }

    if (result.success && result.comparison) {
      // Await the save — a silent save-failure was the second-order
      // bug behind the stuck-page symptom. If the save fails we still
      // return the comparison to the user (they get a one-shot view)
      // but we log it as a failed attempt so monitoring can pick it up.
      try {
        await saveComparison(result.comparison);
        if (attempt) {
          await finishAttemptSuccess(attempt.id, Date.now() - startedAt);
        }
      } catch (saveErr) {
        console.error("Failed to save generated comparison to DB:", saveErr);
        if (attempt) {
          const message = saveErr instanceof Error ? saveErr.message : "DB save failed";
          await finishAttemptFailure(attempt.id, "save", message, Date.now() - startedAt);
        }
      }
      return NextResponse.json({ status: "ready", comparison: result.comparison });
    }

    const stage: AttemptStage = (result.errorStage as GenerationErrorStage | undefined) ?? "unknown";
    if (attempt) {
      await finishAttemptFailure(
        attempt.id,
        stage,
        result.error ?? "Generation failed",
        Date.now() - startedAt
      );
    }
    return NextResponse.json(
      { status: "error", error: result.error || "Generation failed", errorStage: stage },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
