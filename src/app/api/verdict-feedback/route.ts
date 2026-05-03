import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";

const feedbackSchema = z
  .object({
    comparisonSlug: z.string().min(1).max(300),
    vote: z.enum(["up", "down"]),
    reason: z.string().max(2000).optional(),
    anonId: z.string().min(1).max(200).optional(),
    userId: z.string().min(1).max(200).optional(),
  })
  .refine((d) => Boolean(d.anonId || d.userId), {
    message: "anonId or userId is required",
    path: ["anonId"],
  });

// In-memory fallback when DB is unavailable (e.g. local dev / preview).
const memoryByKey = new Map<string, { vote: "up" | "down"; reason?: string }>();

function fallbackKey(slug: string, voter: string) {
  return `${slug}::${voter}`;
}

export async function POST(request: NextRequest) {
  let parsed;
  try {
    const body = await request.json();
    parsed = feedbackSchema.safeParse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { comparisonSlug, vote, reason, anonId, userId } = parsed.data;

  try {
    const prisma = getPrisma();

    if (prisma) {
      const where = userId
        ? { uniq_user_per_slug: { comparisonSlug, userId } }
        : { uniq_anon_per_slug: { comparisonSlug, anonId: anonId! } };

      const create = {
        comparisonSlug,
        vote,
        reason: reason?.trim() ? reason.trim() : null,
        anonId: anonId ?? null,
        userId: userId ?? null,
      };

      const update = {
        vote,
        // Only overwrite reason if the caller actually supplied one — the
        // initial vote-only POST shouldn't clear a reason from a later POST,
        // and a follow-up reason POST should be persisted.
        ...(reason?.trim() ? { reason: reason.trim() } : {}),
      };

      const record = await prisma.verdictFeedback.upsert({
        where,
        create,
        update,
      });

      return NextResponse.json({ success: true, id: record.id, vote: record.vote });
    }

    // In-memory fallback
    const voter = userId || anonId || "";
    const key = fallbackKey(comparisonSlug, voter);
    const prev = memoryByKey.get(key);
    memoryByKey.set(key, {
      vote,
      reason: reason?.trim() || prev?.reason,
    });
    return NextResponse.json({ success: true, vote });
  } catch (err) {
    console.error("[verdict-feedback] failed", err);
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
