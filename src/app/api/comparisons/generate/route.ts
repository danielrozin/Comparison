export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { generateComparison } from "@/lib/services/ai-comparison-generator";
import { parseComparisonSlug } from "@/lib/utils/slugify";

// In-memory cache for generated comparisons (in production, use Redis/DB)
const generatedCache = new Map<string, {
  status: "generating" | "ready" | "error";
  data?: unknown;
  error?: string;
  timestamp: number;
}>();

/**
 * POST /api/comparisons/generate
 * Trigger AI generation for a new comparison
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

    // Check if already generating or cached
    const cached = generatedCache.get(slug);
    if (cached) {
      if (cached.status === "generating") {
        return NextResponse.json({ status: "generating", message: "Comparison is being generated..." });
      }
      if (cached.status === "ready" && cached.timestamp > Date.now() - 3600000) {
        return NextResponse.json({ status: "ready", comparison: cached.data });
      }
    }

    // Mark as generating
    generatedCache.set(slug, { status: "generating", timestamp: Date.now() });

    // Format entity names from slug
    const entityA = parsed.entityA.replace(/-/g, " ");
    const entityB = parsed.entityB.replace(/-/g, " ");

    // Generate in background
    generateComparison(entityA, entityB, slug).then((result) => {
      if (result.success && result.comparison) {
        generatedCache.set(slug, {
          status: "ready",
          data: result.comparison,
          timestamp: Date.now(),
        });
      } else {
        generatedCache.set(slug, {
          status: "error",
          error: result.error || "Generation failed",
          timestamp: Date.now(),
        });
      }
    });

    return NextResponse.json({
      status: "generating",
      message: `Generating comparison: ${entityA} vs ${entityB}. Check back in a few seconds.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to start generation", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/comparisons/generate?slug=xxx
 * Check generation status
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const cached = generatedCache.get(slug);

  if (!cached) {
    return NextResponse.json({ status: "not_found" });
  }

  if (cached.status === "generating") {
    return NextResponse.json({ status: "generating" });
  }

  if (cached.status === "error") {
    return NextResponse.json({ status: "error", error: cached.error });
  }

  return NextResponse.json({ status: "ready", comparison: cached.data });
}
