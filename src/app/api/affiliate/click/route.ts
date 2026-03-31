import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { z } from "zod";

const clickSchema = z.object({
  entityId: z.string().min(1),
  comparisonSlug: z.string().min(1),
  affiliateNetwork: z.string().min(1),
  sessionId: z.string().min(1),
  source: z.string().optional(),
  affiliateLinkId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// POST: record an affiliate click event
export async function POST(request: NextRequest) {
  const prisma = getPrisma();
  if (!prisma) {
    // Silently accept if DB is unavailable — don't break UX for tracking
    return NextResponse.json({ recorded: false, reason: "db_unavailable" });
  }

  try {
    const json = await request.json();
    const data = clickSchema.parse(json);

    const click = await prisma.affiliateClick.create({
      data: {
        entityId: data.entityId,
        comparisonSlug: data.comparisonSlug,
        affiliateNetwork: data.affiliateNetwork,
        sessionId: data.sessionId,
        source: data.source,
        affiliateLinkId: data.affiliateLinkId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: data.metadata as any,
      },
    });

    return NextResponse.json({ recorded: true, id: click.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Affiliate click tracking error:", error);
    // Don't fail hard on tracking errors
    return NextResponse.json({ recorded: false, reason: "error" });
  }
}
