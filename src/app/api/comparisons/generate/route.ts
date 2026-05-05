import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateComparison } from "@/lib/services/ai-comparison-generator";
import { parseComparisonSlug } from "@/lib/utils/slugify";
import { saveComparison } from "@/lib/services/comparison-service";

export const maxDuration = 60; // Allow up to 60s for AI generation

const generateSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});

/**
 * POST /api/comparisons/generate
 * Generate a comparison synchronously, persist it, revalidate ISR, and return the result.
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

    const entityA = slugParts.entityA.replace(/-/g, " ");
    const entityB = slugParts.entityB.replace(/-/g, " ");

    // Generate synchronously — wait for the result
    const result = await generateComparison(entityA, entityB, slug);

    if (!result.success || !result.comparison) {
      console.error(JSON.stringify({
        event: "generate.failed",
        stage: "ai_generation",
        slug,
        error: result.error || "Generation failed",
      }));
      return NextResponse.json(
        { status: "error", error: result.error || "Generation failed" },
        { status: 500 }
      );
    }

    // DAN-605: Persist synchronously. Fire-and-forget meant on Vercel the function
    // could tear down before the DB write finished, so the row was missing on
    // the next visit and crawlers saw the placeholder render until ISR ticked.
    const saveResult = await saveComparison(result.comparison);

    if (!saveResult) {
      // saveComparison returns null on no-DB-connection or caught exception
      // (see comparison-service.ts:877). We surface error to the caller rather
      // than silently report `ready` so the same failure mode is visible.
      console.error(JSON.stringify({
        event: "generate.save_failed",
        slug,
        title: result.comparison.title,
      }));
      return NextResponse.json(
        { status: "error", error: "Failed to persist comparison to database" },
        { status: 500 }
      );
    }

    // Bust ISR for the page so the next visitor (and crawlers) get the real
    // SSR'd comparison instead of the cached DynamicComparison placeholder.
    // Matches the queue worker's warmCacheForSlug behavior.
    try {
      revalidatePath(`/compare/${slug}`);
      revalidatePath("/sitemap.xml");
    } catch (err) {
      // Don't fail the response if revalidation fails — log and continue.
      console.warn(JSON.stringify({
        event: "generate.revalidate_failed",
        slug,
        error: err instanceof Error ? err.message : String(err),
      }));
    }

    console.log(JSON.stringify({
      event: "generate.persisted",
      slug,
      comparisonId: saveResult.id,
      title: result.comparison.title,
    }));

    return NextResponse.json({ status: "ready", comparison: result.comparison });
  } catch (error) {
    return NextResponse.json(
      { status: "error", error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
