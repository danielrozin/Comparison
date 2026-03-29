import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const likeSchema = z.object({
  comparisonId: z.string().min(1).max(200),
  liked: z.boolean(),
});

// In-memory store (in production, use database)
const likeStore: Map<string, number> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = likeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { comparisonId, liked } = parsed.data;
    const current = likeStore.get(comparisonId) || 0;
    const updated = liked ? current + 1 : Math.max(0, current - 1);
    likeStore.set(comparisonId, updated);

    return NextResponse.json({ success: true, count: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update like" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const comparisonId = request.nextUrl.searchParams.get("comparisonId");
  if (!comparisonId) {
    return NextResponse.json({ error: "comparisonId required" }, { status: 400 });
  }

  const count = likeStore.get(comparisonId) || 0;
  return NextResponse.json({ count });
}
