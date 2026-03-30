import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";

const voteSchema = z.object({
  comparisonId: z.string().min(1).max(200),
  entityChoice: z.string().min(1).max(200),
  sessionId: z.string().min(1).max(200),
});

// In-memory fallback when DB is unavailable
const memoryVotes: Map<string, Map<string, number>> = new Map();
const memorySessionVotes: Set<string> = new Set();

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

    const { comparisonId, entityChoice, sessionId } = parsed.data;
    const prisma = getPrisma();

    if (prisma) {
      // Check if already voted
      const existing = await prisma.comparisonVote.findUnique({
        where: { comparisonId_sessionId: { comparisonId, sessionId } },
      });
      if (existing) {
        return NextResponse.json({ error: "Already voted" }, { status: 409 });
      }

      await prisma.comparisonVote.create({
        data: { comparisonId, entityChoice, sessionId },
      });

      const results = await prisma.comparisonVote.groupBy({
        by: ["entityChoice"],
        where: { comparisonId },
        _count: { entityChoice: true },
      });

      const votes: Record<string, number> = {};
      let total = 0;
      for (const r of results) {
        votes[r.entityChoice] = r._count.entityChoice;
        total += r._count.entityChoice;
      }

      return NextResponse.json({ success: true, votes, total });
    }

    // In-memory fallback
    const sessionKey = `${comparisonId}:${sessionId}`;
    if (memorySessionVotes.has(sessionKey)) {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }

    memorySessionVotes.add(sessionKey);
    if (!memoryVotes.has(comparisonId)) {
      memoryVotes.set(comparisonId, new Map());
    }
    const compVotes = memoryVotes.get(comparisonId)!;
    compVotes.set(entityChoice, (compVotes.get(entityChoice) || 0) + 1);

    const votes: Record<string, number> = {};
    let total = 0;
    for (const [entity, count] of compVotes) {
      votes[entity] = count;
      total += count;
    }

    return NextResponse.json({ success: true, votes, total });
  } catch {
    return NextResponse.json({ error: "Failed to submit vote" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const comparisonId = request.nextUrl.searchParams.get("comparisonId");
  if (!comparisonId) {
    return NextResponse.json({ error: "comparisonId required" }, { status: 400 });
  }

  try {
    const prisma = getPrisma();

    if (prisma) {
      const results = await prisma.comparisonVote.groupBy({
        by: ["entityChoice"],
        where: { comparisonId },
        _count: { entityChoice: true },
      });

      const votes: Record<string, number> = {};
      let total = 0;
      for (const r of results) {
        votes[r.entityChoice] = r._count.entityChoice;
        total += r._count.entityChoice;
      }

      return NextResponse.json({ votes, total });
    }

    // In-memory fallback
    const compVotes = memoryVotes.get(comparisonId);
    if (!compVotes) {
      return NextResponse.json({ votes: {}, total: 0 });
    }

    const votes: Record<string, number> = {};
    let total = 0;
    for (const [entity, count] of compVotes) {
      votes[entity] = count;
      total += count;
    }

    return NextResponse.json({ votes, total });
  } catch {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
