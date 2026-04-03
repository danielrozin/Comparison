import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";

const submitSchema = z.object({
  entityA: z.string().min(1).max(200).trim(),
  entityB: z.string().min(1).max(200).trim(),
  category: z.string().max(100).optional(),
  reason: z.string().max(500).optional(),
  sessionId: z.string().min(1).max(200),
  email: z.string().email().optional().or(z.literal("")),
});

// In-memory fallback
const memoryRequests: Map<string, {
  id: string;
  entityA: string;
  entityB: string;
  category: string | null;
  reason: string | null;
  voteCount: number;
  status: string;
  comparisonSlug: string | null;
  createdAt: Date;
  voters: Set<string>;
}> = new Map();

function normalizeKey(a: string, b: string): string {
  const sorted = [a.toLowerCase().trim(), b.toLowerCase().trim()].sort();
  return `${sorted[0]}::${sorted[1]}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { entityA, entityB, category, reason, sessionId, email } = parsed.data;

    if (entityA.toLowerCase() === entityB.toLowerCase()) {
      return NextResponse.json(
        { error: "Cannot compare something with itself" },
        { status: 400 }
      );
    }

    // Normalize order so "A vs B" and "B vs A" are the same
    const [normA, normB] = [entityA, entityB].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );

    const prisma = getPrisma();

    if (prisma) {
      // Check if comparison already exists
      const slug = `${normA.toLowerCase().replace(/\s+/g, "-")}-vs-${normB.toLowerCase().replace(/\s+/g, "-")}`;
      const existing = await prisma.comparison.findUnique({
        where: { slug },
        select: { slug: true, status: true },
      });
      if (existing && existing.status === "published") {
        return NextResponse.json(
          { error: "This comparison already exists!", slug: existing.slug },
          { status: 409 }
        );
      }

      // Upsert the request
      const req = await prisma.comparisonRequest.upsert({
        where: { entityA_entityB: { entityA: normA, entityB: normB } },
        create: {
          entityA: normA,
          entityB: normB,
          category: category || null,
          reason: reason || null,
          sessionId,
          email: email || null,
          voteCount: 1,
          votes: { create: { sessionId } },
        },
        update: {},
      });

      // If it already existed, try to add a vote
      if (req.createdAt < new Date(Date.now() - 1000)) {
        try {
          await prisma.comparisonRequestVote.create({
            data: { requestId: req.id, sessionId },
          });
          await prisma.comparisonRequest.update({
            where: { id: req.id },
            data: { voteCount: { increment: 1 } },
          });
        } catch {
          // Already voted — that's fine
        }
      }

      return NextResponse.json({
        success: true,
        request: {
          id: req.id,
          entityA: req.entityA,
          entityB: req.entityB,
          voteCount: req.voteCount,
          status: req.status,
        },
      });
    }

    // In-memory fallback
    const key = normalizeKey(normA, normB);
    const mem = memoryRequests.get(key);
    if (mem) {
      if (!mem.voters.has(sessionId)) {
        mem.voters.add(sessionId);
        mem.voteCount++;
      }
      return NextResponse.json({
        success: true,
        request: {
          id: mem.id,
          entityA: mem.entityA,
          entityB: mem.entityB,
          voteCount: mem.voteCount,
          status: mem.status,
        },
      });
    }

    const id = crypto.randomUUID();
    memoryRequests.set(key, {
      id,
      entityA: normA,
      entityB: normB,
      category: category || null,
      reason: reason || null,
      voteCount: 1,
      status: "pending",
      comparisonSlug: null,
      createdAt: new Date(),
      voters: new Set([sessionId]),
    });

    return NextResponse.json({
      success: true,
      request: { id, entityA: normA, entityB: normB, voteCount: 1, status: "pending" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status") || "pending,approved";
  const sort = request.nextUrl.searchParams.get("sort") || "votes";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "20", 10), 50);

  try {
    const prisma = getPrisma();

    if (prisma) {
      const statuses = status.split(",").map((s) => s.trim());
      const orderBy = sort === "newest"
        ? { createdAt: "desc" as const }
        : { voteCount: "desc" as const };

      const [requests, total] = await Promise.all([
        prisma.comparisonRequest.findMany({
          where: { status: { in: statuses } },
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
          select: {
            id: true,
            entityA: true,
            entityB: true,
            category: true,
            reason: true,
            voteCount: true,
            status: true,
            comparisonSlug: true,
            createdAt: true,
          },
        }),
        prisma.comparisonRequest.count({
          where: { status: { in: statuses } },
        }),
      ]);

      return NextResponse.json({
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }

    // In-memory fallback
    const statuses = status.split(",").map((s) => s.trim());
    let items = Array.from(memoryRequests.values()).filter((r) =>
      statuses.includes(r.status)
    );

    if (sort === "newest") {
      items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      items.sort((a, b) => b.voteCount - a.voteCount);
    }

    const total = items.length;
    items = items.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      requests: items.map(({ voters, ...rest }) => rest),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
