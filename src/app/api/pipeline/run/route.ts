import { NextRequest, NextResponse } from "next/server";
import {
  runDiscovery,
  runGeneration,
  recordPipelineRun,
  type PipelineRun,
} from "@/lib/services/pipeline-service";

export const maxDuration = 120;

/**
 * POST /api/pipeline/run
 * Body: { mode: "discover" | "generate" | "full", category?: string, entity?: string, limit?: number }
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
    const body = await request.json();
    const { mode, category, entity, limit = 5 } = body as {
      mode: "discover" | "generate" | "full";
      category?: string;
      entity?: string;
      limit?: number;
    };

    if (!mode || !["discover", "generate", "full"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Use: discover, generate, or full" },
        { status: 400 }
      );
    }

    const run: PipelineRun = {
      id: `run-${Date.now()}`,
      mode,
      startedAt: new Date().toISOString(),
      completedAt: null,
      discovered: 0,
      generated: 0,
      errors: [],
    };

    let discovered = 0;
    let generated = 0;
    const errors: string[] = [];

    // Discovery phase
    if (mode === "discover" || mode === "full") {
      const opps = await runDiscovery(category, entity);
      discovered = opps.length;
    }

    // Generation phase
    if (mode === "generate" || mode === "full") {
      const genResult = await runGeneration(limit);
      generated = genResult.generated;
      errors.push(...genResult.errors);
    }

    run.discovered = discovered;
    run.generated = generated;
    run.errors = errors;
    run.completedAt = new Date().toISOString();

    // Record the run
    await recordPipelineRun(run);

    return NextResponse.json({
      success: true,
      discovered,
      generated,
      errors,
      runId: run.id,
      duration: `${Date.now() - new Date(run.startedAt).getTime()}ms`,
    });
  } catch (error) {
    console.error("Pipeline run error:", error);
    return NextResponse.json(
      {
        error: "Pipeline run failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
