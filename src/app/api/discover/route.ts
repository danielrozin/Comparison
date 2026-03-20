import { NextRequest, NextResponse } from "next/server";
import {
  discoverTopics,
  discoverFromReddit,
  discoverFromQuora,
  discoverFromTavily,
  discoverFromDataForSEO,
  type DiscoveredTopic,
} from "@/lib/services/content-discovery";

export const maxDuration = 120; // 2 minutes

/**
 * GET /api/discover?source=all|reddit|quora|tavily|dataforseo&category=technology
 *
 * Manually trigger content discovery and see results.
 * Auth required: ADMIN_TOKEN or CRON_SECRET via Bearer token.
 */
export async function GET(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  const validTokens = [process.env.ADMIN_TOKEN, process.env.CRON_SECRET].filter(Boolean);

  if (validTokens.length > 0 && !validTokens.includes(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") || "all";
  const category = searchParams.get("category") || "technology";

  let topics: DiscoveredTopic[] = [];

  try {
    switch (source) {
      case "reddit":
        topics = await discoverFromReddit();
        break;
      case "quora":
        topics = await discoverFromQuora([category]);
        break;
      case "tavily":
        topics = await discoverFromTavily([category]);
        break;
      case "dataforseo":
        topics = await discoverFromDataForSEO(category);
        break;
      case "all":
      default:
        topics = await discoverTopics({ categories: [category], limit: 100 });
        break;
    }
  } catch (err) {
    return NextResponse.json(
      { error: `Discovery failed: ${err instanceof Error ? err.message : "Unknown"}` },
      { status: 500 }
    );
  }

  // Compute stats
  const bySource: Record<string, number> = {};
  const byType: Record<string, number> = { comparison: 0, blog: 0 };

  for (const t of topics) {
    bySource[t.source] = (bySource[t.source] || 0) + 1;
    byType[t.type] = (byType[t.type] || 0) + 1;
  }

  return NextResponse.json({
    topics,
    stats: {
      total: topics.length,
      bySource,
      byType,
    },
  });
}
