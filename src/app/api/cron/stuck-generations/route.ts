import { NextRequest, NextResponse } from "next/server";
import {
  findStuckAttempts,
  reapStuckAttempt,
  STUCK_THRESHOLD_MS,
} from "@/lib/services/generation-attempt-tracker";

export const maxDuration = 60;

/**
 * GET /api/cron/stuck-generations
 *
 * Hourly monitoring cron that finds AI-generation attempts that
 * have been stuck `in_progress` past the stuck threshold (>2h),
 * marks them failed (so users see the proper error UI on the next
 * visit instead of looping the loading state), and posts a Slack
 * webhook alert if any were reaped (DAN-596).
 *
 * Configure schedule via `vercel.json` and the optional
 * `PIPELINE_ALERT_WEBHOOK_URL` env var.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stuck = await findStuckAttempts(STUCK_THRESHOLD_MS);
  const reaped: string[] = [];

  for (const row of stuck) {
    const slug = await reapStuckAttempt(row.id);
    if (slug) reaped.push(slug);
  }

  if (reaped.length > 0) {
    await sendStuckAlert(reaped).catch((err) => {
      console.warn("stuck-generations alert failed:", err);
    });
  }

  return NextResponse.json({
    found: stuck.length,
    reaped: reaped.length,
    slugs: reaped,
  });
}

async function sendStuckAlert(slugs: string[]): Promise<void> {
  const webhook = process.env.PIPELINE_ALERT_WEBHOOK_URL;
  if (!webhook) return;

  const isSlack = webhook.includes("hooks.slack.com");
  const text = `*Stuck AI generations reaped:* ${slugs.length} slug${slugs.length === 1 ? "" : "s"} were stuck >2h and have been marked failed:\n${slugs.map((s) => `• \`${s}\``).join("\n")}`;

  const body = isSlack
    ? { text }
    : {
        type: "stuck_generations",
        message: `${slugs.length} AI generations stuck >2h, reaped`,
        slugs,
        timestamp: new Date().toISOString(),
      };

  await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
}
