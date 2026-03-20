import { NextRequest, NextResponse } from "next/server";
import {
  generateBlogArticle,
  saveBlogArticle,
} from "@/lib/services/blog-generator";

export async function POST(request: NextRequest) {
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
    const { topic, sourceQuery, sourceImpressions } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Missing required field: topic" },
        { status: 400 }
      );
    }

    const gscData =
      sourceQuery && sourceImpressions
        ? { query: sourceQuery, impressions: sourceImpressions }
        : undefined;

    const article = await generateBlogArticle(topic, gscData);

    // Save to database
    const saved = await saveBlogArticle(article);

    return NextResponse.json({
      article: { ...article, id: saved?.id },
    });
  } catch (e) {
    console.error("Blog generation error:", e);
    return NextResponse.json(
      { error: "Failed to generate blog article" },
      { status: 500 }
    );
  }
}
