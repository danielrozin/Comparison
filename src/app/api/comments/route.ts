import { NextRequest, NextResponse } from "next/server";

// In-memory store (in production, use database)
const commentStore: Map<string, {
  id: string;
  comparisonId: string;
  name: string;
  text: string;
  likes: number;
  timestamp: string;
}[]> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { comparisonId, name, text } = body;

    if (!comparisonId || !name?.trim() || !text?.trim()) {
      return NextResponse.json({ error: "comparisonId, name, and text are required" }, { status: 400 });
    }

    const comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      comparisonId,
      name: name.trim(),
      text: text.trim(),
      likes: 0,
      timestamp: new Date().toISOString(),
    };

    const existing = commentStore.get(comparisonId) || [];
    existing.unshift(comment);
    commentStore.set(comparisonId, existing);

    return NextResponse.json({ success: true, comment });
  } catch {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const comparisonId = request.nextUrl.searchParams.get("comparisonId");
  if (!comparisonId) {
    return NextResponse.json({ error: "comparisonId required" }, { status: 400 });
  }

  const comments = commentStore.get(comparisonId) || [];
  return NextResponse.json({ comments });
}
