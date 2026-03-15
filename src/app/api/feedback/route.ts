export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";

// In-memory store (in production, use database)
const feedbackStore: {
  id: string;
  type: string;
  message: string;
  email: string | null;
  url: string;
  timestamp: string;
}[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, email, url } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const feedback = {
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: type || "general",
      message: message.trim(),
      email: email?.trim() || null,
      url: url || "",
      timestamp: new Date().toISOString(),
    };

    feedbackStore.push(feedback);

    // TODO: Store in database, send notification email

    return NextResponse.json({ success: true, id: feedback.id });
  } catch {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

export async function GET() {
  // Admin-only endpoint
  return NextResponse.json({
    count: feedbackStore.length,
    feedback: feedbackStore.slice(-50).reverse(),
  });
}
