import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";

const voteSchema = z.object({
  requestId: z.string().min(1).max(200),
  sessionId: z.string().min(1).max(200),
});

// In-memory fallback
const memoryVotes: Set<string> = new Set();
const memoryVoteCounts: Map<string, number> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { requestId, sessionId } = parsed.data;
    const prisma = getPrisma();

    if (prisma) {
      // Check request exists
      const req = await prisma.comparisonRequest.findUnique({
        where: { id: requestId },
        select: { id: true, voteCount: true },
      });
      if (!req) {
        return NextResponse.json({ error: "Request not found" }, { status: 404 });
      }

      // Try to add vote
      try {
        await prisma.comparisonRequestVote.create({
          data: { requestId, sessionId },
        });
      } catch {
        return NextResponse.json({ error: "Already voted" }, { status: 409 });
      }

      const updated = await prisma.comparisonRequest.update({
        where: { id: requestId },
        data: { voteCount: { increment: 1 } },
        select: { voteCount: true },
      });

      return NextResponse.json({ success: true, voteCount: updated.voteCount });
    }

    // In-memory fallback
    const key = `${requestId}:${sessionId}`;
    if (memoryVotes.has(key)) {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }

    memoryVotes.add(key);
    const count = (memoryVoteCounts.get(requestId) || 1) + 1;
    memoryVoteCounts.set(requestId, count);

    return NextResponse.json({ success: true, voteCount: count });
  } catch {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
