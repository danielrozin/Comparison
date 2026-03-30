import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logAdminEvent } from "@/lib/services/admin-logger";

const consentSchema = z.object({
  necessary: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  functional: z.boolean(),
  timestamp: z.string().datetime(),
  version: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = consentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid consent data" }, { status: 400 });
    }

    const { analytics, marketing, functional, timestamp } = parsed.data;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    await logAdminEvent("consent", {
      analytics,
      marketing,
      functional,
      timestamp,
      ip: ip.slice(0, 45), // Truncate for privacy
      userAgent: request.headers.get("user-agent")?.slice(0, 200) || "unknown",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save consent" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
