import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateComparison } from "@/lib/services/ai-comparison-generator";
import { parseComparisonSlug } from "@/lib/utils/slugify";
import { saveComparison } from "@/lib/services/comparison-service";
import { withTiming } from "@/lib/utils/api-timing";
import { sanitizeErrorMessage } from "@/lib/utils/sanitize";

export const maxDuration = 60; // Allow up to 60s for AI generation

const generateSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

/**
 * POST /api/comparisons/generate
 * Generate a comparison synchronously and return the result
 */
export const POST = withTiming(async function POST(request: NextRequest) {
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

    const entityA = slugParts.entityA.replace(/-/g, " ");
    const entityB = slugParts.entityB.replace(/-/g, " ");

    // Generate synchronously — wait for the result
    const result = await generateComparison(entityA, entityB, slug);

    if (result.success && result.comparison) {
      // Persist to database (non-blocking, don't fail the response if DB save fails)
      saveComparison(result.comparison).catch((err) =>
        console.error("Failed to save generated comparison to DB:", err)
      );
      return NextResponse.json({ status: "ready", comparison: result.comparison });
    } else {
      return NextResponse.json(
        { status: "error", error: result.error || "Generation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: sanitizeErrorMessage(error, "Generation failed") },
      { status: 500 }
    );
  }
});
