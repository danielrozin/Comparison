import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const maxDuration = 300; // 5 minutes

/**
 * GET /api/cron/daily-videos
 *
 * Triggers the daily video pipeline (HyperFrames is the standard renderer
 * since 2026-04-22; Remotion remains as a fallback via ?renderer=remotion).
 *
 * Flow:
 * 1. Pick comparison pages that don't have videos yet
 * 2. Scrape + Tavily/Claude enrichment
 * 3. Render with HyperFrames (Data Drift style + ElevenLabs v3 narration + karaoke captions)
 * 4. Upload to YouTube (if credentials configured)
 *
 * Query params:
 *   ?count=3                 Number of videos (default 3 — each HF render takes ~3 min)
 *   ?dry-run=true            Render without uploading
 *   ?slug=x-vs-y             Single comparison
 *   ?skip-tts=true           Mute version (faster, no narration)
 *   ?voice=JBFqnCBsd6RMkjVDRZzb  Override ElevenLabs voice ID
 *   ?renderer=remotion       Fall back to legacy Remotion renderer
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const count = searchParams.get("count") || "3";
  const dryRun = searchParams.get("dry-run") === "true";
  const slug = searchParams.get("slug");
  const skipTts = searchParams.get("skip-tts") === "true";
  const voice = searchParams.get("voice");
  const renderer = searchParams.get("renderer") || "hyperframes";

  const args: string[] = [];
  if (slug) args.push("--slug", slug);
  else args.push("--count", count);
  if (dryRun) args.push("--dry-run");
  if (renderer === "hyperframes") {
    if (skipTts) args.push("--skip-tts");
    if (voice) args.push("--voice", voice);
  }

  const script =
    renderer === "remotion"
      ? "scripts/daily-video-pipeline.mjs"
      : "scripts/daily-video-pipeline-hf.mjs";
  const cmd = `node ${script} ${args.join(" ")}`;

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
      renderer,
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
