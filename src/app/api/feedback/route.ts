import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/services/email";
import { logAdminEvent } from "@/lib/services/admin-logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, email, url } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Send email notification to Daniarozin@gmail.com
    await sendNotificationEmail({
      subject: `New ${type || "feedback"}: ${message.trim().slice(0, 50)}`,
      type: type || "general",
      message: message.trim(),
      senderEmail: email?.trim(),
      pageUrl: url,
    });

    // Log to admin panel
    logAdminEvent(type?.startsWith("contact") ? "contact" : "feedback", {
      feedbackType: type,
      message: message.trim().slice(0, 200),
      email: email?.trim() || null,
      url,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
