import { NextRequest, NextResponse } from "next/server";
import { findAllQuestions } from "@/lib/services/social-outreach";

/**
 * GET /api/outreach/dashboard
 * Returns outreach stats overview.
 */
export async function GET(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const questions = await findAllQuestions({ limit: 15 });

    const withMatches = questions.filter((q) => q.matchingComparisonSlug);

    // Count subreddits
    const subredditCounts: Record<string, number> = {};
    for (const q of questions) {
      if (q.subreddit) {
        subredditCounts[q.subreddit] =
          (subredditCounts[q.subreddit] || 0) + 1;
      }
    }

    const topSubreddits = Object.entries(subredditCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return NextResponse.json({
      totalQuestions: questions.length,
      questionsWithMatches: withMatches.length,
      answersPrepared: 0, // In-memory only, no persistence for now
      topSubreddits,
      recentQuestions: questions.slice(0, 20),
    });
  } catch (error) {
    console.error("Outreach dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
