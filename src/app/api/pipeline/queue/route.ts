import { NextRequest, NextResponse } from "next/server";
import {
  enqueueJob,
  enqueueBatch,
  processQueue,
  getQueueStatus,
  getRecentJobs,
  clearQueue,
} from "@/lib/services/generation-queue";

/**
 * GET /api/pipeline/queue — Queue status and recent jobs
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const limit = Number(request.nextUrl.searchParams.get("limit")) || 20;

  if (status === "completed" || status === "failed") {
    const jobs = await getRecentJobs(status, limit);
    return NextResponse.json({ jobs });
  }

  const stats = await getQueueStatus();
  return NextResponse.json(stats);
}

/**
 * POST /api/pipeline/queue — Enqueue or process jobs
 *
 * Body:
 *   { action: "enqueue", entityA, entityB, category?, source?, priority? }
 *   { action: "enqueue-batch", items: [{ entityA, entityB, category?, source?, priority? }] }
 *   { action: "process", concurrency?, maxJobs? }
 *   { action: "clear", status?: "pending" | "failed" }
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isAdmin && !isCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "enqueue": {
      const { entityA, entityB, category, source, priority } = body;
      if (!entityA || !entityB) {
        return NextResponse.json({ error: "entityA and entityB required" }, { status: 400 });
      }
      const job = await enqueueJob(entityA, entityB, { category, source, priority });
      if (!job) {
        return NextResponse.json({ message: "Already exists or in queue" }, { status: 200 });
      }
      return NextResponse.json({ job }, { status: 201 });
    }

    case "enqueue-batch": {
      const { items } = body;
      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "items array required" }, { status: 400 });
      }
      const result = await enqueueBatch(items);
      return NextResponse.json(result, { status: 201 });
    }

    case "process": {
      const { concurrency = 5, maxJobs = 50 } = body;
      const result = await processQueue(concurrency, maxJobs);
      return NextResponse.json(result);
    }

    case "clear": {
      const { status } = body;
      await clearQueue(status);
      return NextResponse.json({ message: `Queue cleared${status ? ` (${status})` : ""}` });
    }

    default:
      return NextResponse.json(
        { error: "Invalid action. Use: enqueue, enqueue-batch, process, clear" },
        { status: 400 }
      );
  }
}
