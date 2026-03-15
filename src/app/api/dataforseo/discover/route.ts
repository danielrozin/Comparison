export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { discoverByCategory, discoverByEntity, discoverFromCompetitors } from "@/lib/dataforseo/keyword-discovery";

/**
 * POST /api/dataforseo/discover
 * Trigger keyword discovery (server-side only, credentials never exposed)
 *
 * Body: { type: "category" | "entity" | "competitors", seed?: string, category?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, seed, category } = body;

    let results;

    switch (type) {
      case "category":
        if (!category) {
          return NextResponse.json({ error: "category required" }, { status: 400 });
        }
        results = await discoverByCategory(category);
        break;

      case "entity":
        if (!seed) {
          return NextResponse.json({ error: "seed required" }, { status: 400 });
        }
        results = await discoverByEntity(seed, category);
        break;

      case "competitors":
        results = await discoverFromCompetitors();
        break;

      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results: results.slice(0, 100), // Limit response size
    });
  } catch (error) {
    console.error("DataForSEO discovery error:", error);
    return NextResponse.json(
      { error: "Discovery failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
