import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { verifyAdmin } from "@/lib/services/admin-auth";
import { z } from "zod";

const updateSchema = z.object({
  url: z.string().url().optional(),
  label: z.string().min(1).optional(),
  priority: z.number().int().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// PATCH: update an affiliate link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const { id } = await params;

  try {
    const json = await request.json();
    const data = updateSchema.parse(json);

    const link = await prisma.affiliateLink.update({
      where: { id },
      data: {
        url: data.url,
        label: data.label,
        priority: data.priority,
        isActive: data.isActive,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: data.metadata as any,
        expiresAt: data.expiresAt === null ? null : data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
      include: { entity: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json(link);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Affiliate link update error:", error);
    return NextResponse.json({ error: "Failed to update affiliate link" }, { status: 500 });
  }
}

// DELETE: remove an affiliate link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const { id } = await params;

  try {
    await prisma.affiliateLink.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Affiliate link delete error:", error);
    return NextResponse.json({ error: "Failed to delete affiliate link" }, { status: 500 });
  }
}
