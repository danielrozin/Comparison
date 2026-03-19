import { NextRequest, NextResponse } from "next/server";
import {
  discoverByCategory,
  discoverByEntity,
  discoverFromCompetitors,
} from "@/lib/dataforseo/keyword-discovery";
import { mergeOpportunities } from "@/lib/services/pipeline-service";

/**
 * POST /api/dataforseo/discover
 * Trigger keyword discovery and save to Redis pipeline.
 *
 * Body: { category: "sports" } or { entity: "iphone" } or { mode: "competitors" }
 */
export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { category, entity, mode } = body as {
      category?: string;
      entity?: string;
      mode?: string;
    };

    let results;

    if (mode === "competitors") {
      results = await discoverFromCompetitors();
    } else if (entity) {
      results = await discoverByEntity(entity, category);
    } else if (category) {
      results = await discoverByCategory(category);
    } else {
      return NextResponse.json(
        { error: "Provide category, entity, or mode" },
        { status: 400 }
      );
    }

    // Save discovered opportunities to Redis pipeline
    await mergeOpportunities(results);

    return NextResponse.json({
      success: true,
      count: results.length,
      results: results.slice(0, 100),
    });
  } catch (error) {
    console.error("DataForSEO discovery error:", error);
    return NextResponse.json(
      {
        error: "Discovery failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
