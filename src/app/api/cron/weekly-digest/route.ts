import { NextRequest, NextResponse } from "next/server";
import { sendWeeklyDigest } from "@/lib/services/newsletter-digest";
import { sendNotificationEmail } from "@/lib/services/email";

export const maxDuration = 120; // 2 minutes

/**
 * GET /api/cron/weekly-digest
 *
 * Weekly cron job that sends a digest email to all active newsletter subscribers.
 * Includes the top 10 trending comparisons from the past week.
 * Schedule: Every Monday at 9am UTC
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await sendWeeklyDigest();

    // Notify admin
    await sendNotificationEmail({
      subject: "Weekly Digest Sent",
      type: "cron-report",
      message: [
        `Subscribers: ${result.subscriberCount}`,
        `Sent: ${result.sentCount}`,
        `Failed: ${result.failedCount}`,
        `Method: ${result.method}`,
      ].join("\n"),
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Weekly digest cron error:", error);
    return NextResponse.json(
      { error: "Failed to send weekly digest" },
      { status: 500 }
    );
  }
}
