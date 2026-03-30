import { NextResponse } from "next/server";
import { checkQueueStalled } from "@/lib/services/pipeline-alerting";

export const dynamic = "force-dynamic";

export async function GET() {
  const { stalled, lastProcessedAt } = await checkQueueStalled();

  return NextResponse.json({
    status: stalled ? "degraded" : "healthy",
    lastProcessedAt,
    checkedAt: new Date().toISOString(),
  });
}
