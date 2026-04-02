import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripHtml } from "@/lib/utils/sanitize";

const commentSchema = z.object({
  comparisonId: z.string().min(1).max(200).transform((s) => s.replace(/[^a-zA-Z0-9_-]/g, "")),
  name: z.string().min(1).max(100).transform((s) => stripHtml(s).trim()),
  text: z.string().min(1).max(2000).transform((s) => stripHtml(s).trim()),
});

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
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { comparisonId, name, text } = parsed.data;

    const comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      comparisonId,
      name,
      text,
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
