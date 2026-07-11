import { NextRequest, NextResponse } from "next/server";
import { getAdminEvents } from "@/lib/services/admin-logger";

export async function GET(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const events = await getAdminEvents();
  const signups = events
    .filter((e) => e.type === "feedback" && (e.data as Record<string, unknown>).feedbackType === "ux_study_signup")
    .map((e) => ({
      id: e.id,
      name: e.data.name,
      email: e.data.email,
      timeSlots: e.data.timeSlots,
      device: e.data.device,
      submittedAt: e.timestamp,
    }));

  return NextResponse.json({ count: signups.length, signups });
}
