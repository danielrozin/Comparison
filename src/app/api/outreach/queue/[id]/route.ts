import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const isAdmin = authHeader === `Bearer ${process.env.ADMIN_TOKEN}`;
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  return isAdmin || isCron;
}

const VALID_STATUSES = ["queued", "posted", "skipped"] as const;
type Status = (typeof VALID_STATUSES)[number];

/**
 * PATCH /api/outreach/queue/[id]
 * Body: { status?: "queued"|"posted"|"skipped", postedUrl?: string, notes?: string, answer?: string }
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { status, postedUrl, notes, answer } = body as {
    status?: string;
    postedUrl?: string | null;
    notes?: string | null;
    answer?: string;
  };

  const data: {
    status?: Status;
    postedUrl?: string | null;
    notes?: string | null;
    answer?: string;
    postedAt?: Date | null;
  } = {};

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status as Status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = status as Status;
    // Stamp postedAt when moving to posted; clear it when moving back to queued
    if (status === "posted") {
      data.postedAt = new Date();
    } else if (status === "queued") {
      data.postedAt = null;
    }
  }

  if (postedUrl !== undefined) data.postedUrl = postedUrl || null;
  if (notes !== undefined) data.notes = notes || null;
  if (answer !== undefined) data.answer = answer;

  try {
    const post = await prisma.outreachPost.update({
      where: { id },
      data,
    });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

/**
 * DELETE /api/outreach/queue/[id]
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const { id } = await context.params;
  try {
    await prisma.outreachPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
