import { NextRequest, NextResponse } from "next/server";
import {
  findRedditQuestions,
  findQuoraQuestions,
  findAllQuestions,
} from "@/lib/services/social-outreach";

/**
 * GET /api/outreach/questions?platform=all|reddit|quora&limit=30
 * Returns found comparison questions from social platforms.
 */
export async function GET(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") || "all";
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  try {
    let questions;

    switch (platform) {
      case "reddit":
        questions = await findRedditQuestions({ limit });
        break;
      case "quora":
        questions = await findQuoraQuestions({ limit });
        break;
      default:
        questions = await findAllQuestions({ limit });
    }

    const withMatches = questions.filter((q) => q.matchingComparisonSlug);
    const platforms = {
      reddit: questions.filter((q) => q.platform === "reddit").length,
      quora: questions.filter((q) => q.platform === "quora").length,
    };

    return NextResponse.json({
      questions,
      stats: {
        total: questions.length,
        withMatches: withMatches.length,
        platforms,
      },
    });
  } catch (error) {
    console.error("Outreach questions error:", error);
    return NextResponse.json(
      { error: "Failed to find questions" },
      { status: 500 }
    );
  }
}
