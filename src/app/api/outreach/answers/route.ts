import { NextRequest, NextResponse } from "next/server";
import {
  findAllQuestions,
  findRedditQuestions,
  findQuoraQuestions,
  prepareAnswers,
  type FoundQuestion,
} from "@/lib/services/social-outreach";

/**
 * POST /api/outreach/answers
 * Body: { questionIds?: string[], limit?: number, platform?: string }
 * Generates ready-to-post answers for questions with matching comparison pages.
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
    const body = await request.json().catch(() => ({}));
    const { questionIds, limit = 10, platform } = body as {
      questionIds?: string[];
      limit?: number;
      platform?: string;
    };

    let questions: FoundQuestion[];

    if (questionIds && questionIds.length > 0) {
      // If specific IDs provided, we need to find all questions first and filter
      const all = await findAllQuestions();
      questions = all.filter((q) => questionIds.includes(q.id));
    } else {
      // Find questions based on platform
      switch (platform) {
        case "reddit":
          questions = await findRedditQuestions({ limit: 25 });
          break;
        case "quora":
          questions = await findQuoraQuestions({ limit: 20 });
          break;
        default:
          questions = await findAllQuestions();
      }
    }

    const answers = await prepareAnswers(questions, limit);

    return NextResponse.json({ answers });
  } catch (error) {
    console.error("Outreach answers error:", error);
    return NextResponse.json(
      { error: "Failed to generate answers" },
      { status: 500 }
    );
  }
}
