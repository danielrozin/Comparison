import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const maxDuration = 300; // 5 minutes

/**
 * GET /api/cron/daily-videos
 *
 * Triggers the daily video pipeline:
 * 1. Picks 5 comparison pages that don't have videos yet
 * 2. Scrapes data from each page
 * 3. Renders videos with Remotion
 * 4. Uploads to YouTube (if credentials configured)
 *
 * Query params:
 *   ?count=5      Number of videos to generate (default 5)
 *   ?dry-run=true  Generate videos without uploading to YouTube
 *   ?slug=x-vs-y   Generate video for a specific comparison
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const count = searchParams.get("count") || "5";
  const dryRun = searchParams.get("dry-run") === "true";
  const slug = searchParams.get("slug");

  const args = [];
  if (slug) {
    args.push("--slug", slug);
  } else {
    args.push("--count", count);
  }
  if (dryRun) {
    args.push("--dry-run");
  }

  const cmd = `node scripts/daily-video-pipeline.mjs ${args.join(" ")}`;

  try {
    console.log(`[daily-videos] Running: ${cmd}`);
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: process.cwd(),
      timeout: 280000, // 4m 40s (leave buffer for response)
      env: { ...process.env, NODE_ENV: "production" },
    });

    console.log(`[daily-videos] stdout:`, stdout);
    if (stderr) console.error(`[daily-videos] stderr:`, stderr);

    return NextResponse.json({
      success: true,
      mode: dryRun ? "dry-run" : "full",
      count: parseInt(count, 10),
      output: stdout.slice(-2000), // Last 2KB of output
    });
  } catch (error: unknown) {
    const err = error as Error & { stdout?: string; stderr?: string };
    console.error("[daily-videos] Pipeline error:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        stdout: err.stdout?.slice(-1000),
        stderr: err.stderr?.slice(-1000),
      },
      { status: 500 }
    );
  }
}
