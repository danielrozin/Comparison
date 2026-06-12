import { NextRequest, NextResponse } from "next/server";
import { getGSCCompareWeekly } from "@/lib/services/gsc-service";
import { sendNotificationEmail } from "@/lib/services/email";

export const maxDuration = 120;

/**
 * GET /api/cron/compare-gate
 *
 * Weekly cron (Tue 9am UTC) — H6 `/compare/*` traffic gate meter (DAN-1014 / DAN-1008).
 *
 * Reads GSC organic clicks to `/compare/*` (VP Product ruling DAN-1022: the gate
 * read path is GSC organic clicks, NOT GA4 sessions) and evaluates the gate:
 * `≥250 gsc_clicks/week for 2 consecutive complete weeks`. A trailing partial
 * week is excluded (GSC's ~2-day lag is accounted for in getGSCCompareWeekly).
 *
 * Runs unattended so the meter advances every week with no human in the loop.
 * Emails the gate status to the admin notification address each run, with a
 * GATE CLEAR alert when `≥250 × 2 consecutive complete weeks` is met — that is
 * the signal to mark DAN-1008 `done`, which auto-resumes DAN-703 (usability R1).
 *
 * Scheduled Tuesday (not Monday) so the just-ended Mon–Sun week is ≥2 days past
 * and therefore counts as a "complete" week in this run.
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

  try {
    const report = await getGSCCompareWeekly();

    const latest = report.latestCompleteWeek;
    const lines = [
      `Read path: ${report.metric} (GSC organic clicks to /compare/*)`,
      `Gate: >=${report.thresholdPerWeek}/week for 2 consecutive complete weeks`,
      `Gate status: ${report.gateClear ? "CLEAR" : "not yet"} (${report.consecutiveCompleteWeeksAtThreshold} consecutive complete week(s) at/above threshold)`,
      `Latest complete week: ${latest ? `${latest.weekStart} -> ${latest.weekEnd}: ${latest.clicks} clicks (${report.wowClicksChange} WoW)` : "none complete yet"}`,
      `Data available: ${report.available}`,
    ];
    if (report.gateClear) {
      lines.push(
        "",
        "ACTION: Gate met. Mark DAN-1008 done to auto-resume DAN-703 (moderated usability Round 1)."
      );
    }

    // Fire-and-forget the admin notification; never fail the cron on email error.
    try {
      await sendNotificationEmail({
        subject: report.gateClear
          ? "/compare/* GATE CLEAR — ≥250 GSC clicks × 2 weeks"
          : "/compare/* gate meter — weekly check",
        type: "cron-report",
        message: lines.join("\n"),
      });
    } catch (emailErr) {
      console.error("compare-gate cron: notification email failed:", emailErr);
    }

    return NextResponse.json({
      success: true,
      gateClear: report.gateClear,
      consecutiveCompleteWeeksAtThreshold: report.consecutiveCompleteWeeksAtThreshold,
      thresholdPerWeek: report.thresholdPerWeek,
      metric: report.metric,
      available: report.available,
      latestCompleteWeek: latest,
      weeks: report.weeks,
    });
  } catch (error) {
    console.error("compare-gate cron error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate /compare/* gate meter" },
      { status: 500 }
    );
  }
}
