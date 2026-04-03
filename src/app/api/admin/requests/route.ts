import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getPrisma } from "@/lib/db/prisma";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "Daniarozin@gmail.com";

function verifyAdmin(request: NextRequest): boolean {
  const auth = request.headers.get("x-admin-token");
  if (!auth) return false;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return false;
    const decoded = jwt.verify(auth, secret) as { email: string; role: string };
    return decoded.email === ADMIN_EMAIL && decoded.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status") || "pending";
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const statuses = status.split(",").map((s) => s.trim());
  const requests = await prisma.comparisonRequest.findMany({
    where: { status: { in: statuses } },
    orderBy: { voteCount: "desc" },
    take: 100,
    include: { _count: { select: { votes: true } } },
  });

  return NextResponse.json({ requests });
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  const validStatuses = ["pending", "approved", "generating", "generated", "rejected"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.comparisonRequest.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ success: true, request: updated });
}
