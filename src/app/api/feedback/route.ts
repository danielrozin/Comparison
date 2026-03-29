import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendNotificationEmail } from "@/lib/services/email";
import { logAdminEvent } from "@/lib/services/admin-logger";

const feedbackSchema = z.object({
  type: z.string().max(50).optional(),
  message: z.string().min(1).max(2000).transform((s) => s.trim()),
  email: z.string().email().max(254).optional().or(z.literal("")),
  url: z.string().url().max(2000).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { type, message, email, url } = parsed.data;

    await sendNotificationEmail({
      subject: `New ${type || "feedback"}: ${message.slice(0, 50)}`,
      type: type || "general",
      message,
      senderEmail: email || undefined,
      pageUrl: url || undefined,
    });

    await logAdminEvent(type?.startsWith("contact") ? "contact" : "feedback", {
      feedbackType: type,
      message: message.slice(0, 200),
      email: email || null,
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
