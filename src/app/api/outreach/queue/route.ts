import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  return isAdmin || isCron;
}

/**
 * GET /api/outreach/queue?status=queued|posted|skipped|all&platform=reddit|quora|all
 * Lists saved outreach posts for the admin review workflow.
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "queued";
  const platform = searchParams.get("platform") || "all";

  const where: { status?: string; platform?: string } = {};
  if (status !== "all") where.status = status;
  if (platform !== "all") where.platform = platform;

  const [posts, counts] = await Promise.all([
    prisma.outreachPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.outreachPost.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const statusCounts: Record<string, number> = {
    queued: 0,
    posted: 0,
    skipped: 0,
  };
  for (const row of counts) {
    statusCounts[row.status] = row._count._all;
  }

  return NextResponse.json({ posts, counts: statusCounts });
}

/**
 * POST /api/outreach/queue
 * Body: { platform, questionUrl, questionTitle, subreddit?, category?, entityA?, entityB?,
 *         comparisonSlug, comparisonUrl, answer }
 * Saves a prepared answer to the queue. Upserts on questionUrl.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const {
    platform,
    questionUrl,
    questionTitle,
    subreddit,
    category,
    entityA,
    entityB,
    comparisonSlug,
    comparisonUrl,
    answer,
  } = body as Record<string, string | undefined>;

  if (
    !platform ||
    !questionUrl ||
    !questionTitle ||
    !comparisonSlug ||
    !comparisonUrl ||
    !answer
  ) {
    return NextResponse.json(
      { error: "platform, questionUrl, questionTitle, comparisonSlug, comparisonUrl, answer required" },
      { status: 400 }
    );
  }

  if (platform !== "reddit" && platform !== "quora") {
    return NextResponse.json({ error: "platform must be reddit or quora" }, { status: 400 });
  }

  const post = await prisma.outreachPost.upsert({
    where: { questionUrl },
    create: {
      platform,
      questionUrl,
      questionTitle,
      subreddit: subreddit || null,
      category: category || null,
      entityA: entityA || null,
      entityB: entityB || null,
      comparisonSlug,
      comparisonUrl,
      answer,
      status: "queued",
    },
    update: {
      // Refresh the answer copy but don't touch status if it's already been acted on
      answer,
      questionTitle,
      comparisonSlug,
      comparisonUrl,
    },
  });

  return NextResponse.json({ post });
}
