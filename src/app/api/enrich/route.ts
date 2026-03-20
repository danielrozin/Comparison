import { NextResponse } from "next/server";
import { getComparisonBySlug, saveComparison } from "@/lib/services/comparison-service";
import { generateComparison } from "@/lib/services/ai-comparison-generator";

export async function POST(request: Request) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.ADMIN_TOKEN}` &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid slug" },
        { status: 400 }
      );
    }

    // Get existing comparison to extract entity names
    const existing = await getComparisonBySlug(slug);
    if (!existing || existing.entities.length < 2) {
      return NextResponse.json(
        { error: "Comparison not found or missing entities" },
        { status: 404 }
      );
    }

    const entityA = existing.entities[0].name;
    const entityB = existing.entities[1].name;

    // Regenerate with Tavily enrichment (skipEnrichment = false)
    const result = await generateComparison(entityA, entityB, slug);

    if (!result.success || !result.comparison) {
      return NextResponse.json(
        { error: result.error || "Generation failed" },
        { status: 500 }
      );
    }

    // Save to DB
    const saved = await saveComparison(result.comparison);

    return NextResponse.json({
      success: true,
      saved: !!saved,
      comparison: result.comparison,
    });
  } catch (error) {
    console.error("Enrich endpoint error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
