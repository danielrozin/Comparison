import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  generateComparison,
  generateMultiComparison,
  type GenerationErrorStage,
} from "@/lib/services/ai-comparison-generator";
import { parseComparisonSlug, sortComparisonSlug } from "@/lib/utils/slugify";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { getComparisonBySlug, saveComparison } from "@/lib/services/comparison-service";
import { warmCacheForSlug } from "@/lib/services/cache-warming";
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

    // DAN-1265 source prevention: never (re)generate a known duplicate slug.
    // If the requested slug is a retired A-vs-B/B-vs-A or alias duplicate, serve
    // the surviving canonical page instead of persisting the duplicate again.
    const consolidated = getConsolidatedCompareSlug(slug);
    if (consolidated) {
      const survivor = await getComparisonBySlug(consolidated).catch(() => null);
      if (survivor) {
        return NextResponse.json({ status: "ready", comparison: survivor, canonicalSlug: consolidated });
      }
    }

    // If the comparison was generated and saved while this request was
    // queueing (common for popular slugs), short-circuit and serve it
    // instead of regenerating — but ONLY when the existing record is valid.
    // An empty/corrupt record (fewer than 2 entities) must fall through and
    // regenerate, otherwise the broken row is served forever and the compare
    // page 500s on it (DAN-1201 follow-up). saveComparison upserts by slug.
    const existing = await getComparisonBySlug(slug).catch(() => null);
    if (existing && Array.isArray(existing.entities) && existing.entities.length >= 2) {
      return NextResponse.json({ status: "ready", comparison: existing });
    }

    // DAN-1265 source prevention for *new* comparisons: force a single canonical
    // ordering so we can never create both A-vs-B and B-vs-A. If the slug is a
    // reverse ordering, normalize to the alphabetically-sorted slug — and if that
    // canonical page already exists, serve it rather than minting the reverse.
    const canonicalSlug = consolidated ?? sortComparisonSlug(slug);
    if (canonicalSlug !== slug) {
      const canonicalExisting = await getComparisonBySlug(canonicalSlug).catch(() => null);
      if (canonicalExisting) {
        return NextResponse.json({ status: "ready", comparison: canonicalExisting, canonicalSlug });
      }
    }
    // From here on, generate and persist under the canonical ordering only.
    const genSlug = canonicalSlug;
    const genSlugParts = parseComparisonSlug(genSlug) ?? slugParts;

    const guard = await evaluateAttemptGuard(genSlug);
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

    const entityNames = genSlugParts.entities.map((p) => p.replace(/-/g, " "));
    const entityA = entityNames[0];
    const entityB = entityNames[1];
    const isMulti = entityNames.length > 2;

    const attempt = await startAttempt(genSlug, "user");
    const startedAt = Date.now();

    let result;
    try {
      result = isMulti
        ? await generateMultiComparison(entityNames, genSlug)
        : await generateComparison(entityA, entityB, genSlug);
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
        // Warm the ISR cache so crawlers get the full SSR page immediately
        // instead of the client-only <DynamicComparison> shell until the next
        // 3600s ISR window (DAN-1201). Best-effort — never block the response.
        void warmCacheForSlug(slug);
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
