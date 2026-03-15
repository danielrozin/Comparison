import { NextRequest, NextResponse } from "next/server";
import { generateComparison } from "@/lib/services/ai-comparison-generator";
import { parseComparisonSlug } from "@/lib/utils/slugify";

export const maxDuration = 60; // Allow up to 60s for AI generation

/**
 * POST /api/comparisons/generate
 * Generate a comparison synchronously and return the result
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const parsed = parseComparisonSlug(slug);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid comparison slug format. Use: entity-a-vs-entity-b" }, { status: 400 });
    }

    const entityA = parsed.entityA.replace(/-/g, " ");
    const entityB = parsed.entityB.replace(/-/g, " ");

    // Generate synchronously — wait for the result
    const result = await generateComparison(entityA, entityB, slug);

    if (result.success && result.comparison) {
      return NextResponse.json({ status: "ready", comparison: result.comparison });
    } else {
      return NextResponse.json(
        { status: "error", error: result.error || "Generation failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
