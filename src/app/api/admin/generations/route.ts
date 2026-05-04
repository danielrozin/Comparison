import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { generateComparison } from "@/lib/services/ai-comparison-generator";
import { saveComparison, getComparisonBySlug } from "@/lib/services/comparison-service";
import { parseComparisonSlug } from "@/lib/utils/slugify";
import { getPrisma } from "@/lib/db/prisma";
import {
  startAttempt,
  finishAttemptSuccess,
  finishAttemptFailure,
  listStuckSlugs,
  type AttemptStage,
} from "@/lib/services/generation-attempt-tracker";

export const maxDuration = 120;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "Daniarozin@gmail.com";

function verifyAdmin(request: NextRequest): { ok: true } | { ok: false; response: NextResponse } {
  const auth = request.headers.get("x-admin-token");
  // Allow CRON_SECRET as a fallback for backfill scripts/cron-driven retries.
  const cronAuth = request.headers.get("authorization");
  if (cronAuth && process.env.CRON_SECRET && cronAuth === `Bearer ${process.env.CRON_SECRET}`) {
    return { ok: true };
  }
  if (!auth) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not configured");
    const decoded = jwt.verify(auth, secret) as { email: string; role: string };
    if (decoded.email !== ADMIN_EMAIL || decoded.role !== "admin") {
      return { ok: false, response: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
    }
    return { ok: true };
  } catch {
    return { ok: false, response: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}

/**
 * GET /api/admin/generations
 * Returns the list of currently-stuck slugs (recent failures or
 * `in_progress` attempts past the stuck threshold).
 */
export async function GET(request: NextRequest) {
  const auth = verifyAdmin(request);
  if (!auth.ok) return auth.response;

  const stuck = await listStuckSlugs();
  return NextResponse.json({ stuck });
}

const retrySchema = z.object({
  slugs: z.array(z.string().min(1).max(200)).min(1).max(20),
  /** Skip Tavily enrichment (faster, more reliable on stuck slugs). */
  skipEnrichment: z.boolean().optional(),
  /** Force regeneration even if a saved comparison already exists. */
  force: z.boolean().optional(),
});

interface RetryResult {
  slug: string;
  success: boolean;
  error?: string;
  errorStage?: string;
  durationMs?: number;
  alreadyExisted?: boolean;
}

/**
 * POST /api/admin/generations
 * Manual backfill / retry for a set of stuck slugs. Runs each slug
 * through the standard generation pipeline (with optional
 * `skipEnrichment` for chronically-failing slugs) and persists
 * successful results to the DB.
 */
export async function POST(request: NextRequest) {
  const auth = verifyAdmin(request);
  if (!auth.ok) return auth.response;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const parsed = retrySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { slugs, skipEnrichment, force } = parsed.data;
  const results: RetryResult[] = [];

  for (const slug of slugs) {
    const slugParts = parseComparisonSlug(slug);
    if (!slugParts) {
      results.push({ slug, success: false, error: "Invalid slug format" });
      continue;
    }

    if (!force) {
      const existing = await getComparisonBySlug(slug).catch(() => null);
      if (existing) {
        results.push({ slug, success: true, alreadyExisted: true });
        continue;
      }
    }

    const entityA = slugParts.entityA.replace(/-/g, " ");
    const entityB = slugParts.entityB.replace(/-/g, " ");

    const attempt = await startAttempt(slug, "admin_backfill");
    const startedAt = Date.now();

    try {
      const result = await generateComparison(entityA, entityB, slug, { skipEnrichment });
      const durationMs = Date.now() - startedAt;

      if (result.success && result.comparison) {
        await saveComparison(result.comparison);
        if (attempt) await finishAttemptSuccess(attempt.id, durationMs);
        results.push({ slug, success: true, durationMs });
      } else {
        const stage: AttemptStage = (result.errorStage as AttemptStage | undefined) ?? "unknown";
        if (attempt) {
          await finishAttemptFailure(attempt.id, stage, result.error ?? "Generation failed", durationMs);
        }
        results.push({ slug, success: false, error: result.error, errorStage: stage, durationMs });
      }
    } catch (err) {
      const durationMs = Date.now() - startedAt;
      const message = err instanceof Error ? err.message : "Unknown error";
      if (attempt) await finishAttemptFailure(attempt.id, "unknown", message, durationMs);
      results.push({ slug, success: false, error: message, errorStage: "unknown", durationMs });
    }
  }

  return NextResponse.json({
    requested: slugs.length,
    succeeded: results.filter((r) => r.success).length,
    results,
  });
}
