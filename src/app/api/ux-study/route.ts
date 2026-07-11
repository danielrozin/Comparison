import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendNotificationEmail } from "@/lib/services/email";
import { logAdminEvent } from "@/lib/services/admin-logger";

// DAN-1980 — usability-study participant sign-ups. Zero-migration: each sign-up
// is emailed to the founder (Reply-To reaches the inbox) and logged as an admin
// event, so recruitment of n=5 needs no new DB table or external form.

const TIME_SLOTS = ["Weekday mornings", "Weekday afternoons", "Evenings", "Weekends"] as const;
const DEVICES = ["Desktop", "Mobile", "Both"] as const;

const signupSchema = z.object({
  name: z.string().min(1).max(120).transform((s) => s.trim()),
  email: z.string().email().max(254),
  timeSlots: z.array(z.enum(TIME_SLOTS)).min(1).max(4),
  device: z.enum(DEVICES),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, timeSlots, device } = parsed.data;

    const message = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Available: ${timeSlots.join(", ")}`,
      `Device: ${device}`,
      "",
      "Paid usability study (30 min, $25 gift card) sign-up via aversusb.net banner (DAN-1980).",
    ].join("\n");

    await sendNotificationEmail({
      subject: `UX study sign-up: ${name}`,
      type: "ux_study",
      message,
      senderEmail: email,
    });

    await logAdminEvent("feedback", {
      feedbackType: "ux_study_signup",
      name,
      email,
      timeSlots,
      device,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
