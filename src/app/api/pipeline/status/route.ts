import { NextRequest, NextResponse } from "next/server";
import { getPipelineStatus } from "@/lib/services/pipeline-service";

/**
 * GET /api/pipeline/status
 * Returns pipeline status: last run, totals, recent runs.
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
    const status = await getPipelineStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Pipeline status error:", error);
    return NextResponse.json(
      { error: "Failed to get pipeline status" },
      { status: 500 }
    );
  }
}
