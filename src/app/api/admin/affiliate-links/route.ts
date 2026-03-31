import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { verifyAdmin } from "@/lib/services/admin-auth";
import { z } from "zod";

const createSchema = z.object({
  entityId: z.string().min(1),
  partner: z.string().min(1),
  url: z.string().url(),
  label: z.string().min(1),
  priority: z.number().int().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().optional(),
  source: z.enum(["manual", "import", "generated"]).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const bulkCreateSchema = z.object({
  links: z.array(createSchema).min(1).max(100),
});

// GET: list affiliate links (with optional filters)
export async function GET(request: NextRequest) {
  const auth = verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const { searchParams } = request.nextUrl;
  const entityId = searchParams.get("entityId");
  const partner = searchParams.get("partner");
  const activeOnly = searchParams.get("activeOnly") !== "false";
  const expiringSoon = searchParams.get("expiringSoon") === "true";

  const where: Record<string, unknown> = {};
  if (entityId) where.entityId = entityId;
  if (partner) where.partner = partner;
  if (activeOnly) where.isActive = true;
  if (expiringSoon) {
    const ninetyDays = new Date();
    ninetyDays.setDate(ninetyDays.getDate() + 90);
    where.expiresAt = { lte: ninetyDays, not: null };
  }

  const links = await prisma.affiliateLink.findMany({
    where,
    include: { entity: { select: { id: true, name: true, slug: true } } },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ links, total: links.length });
}

// POST: create affiliate link(s) — supports single or bulk
export async function POST(request: NextRequest) {
  const auth = verifyAdmin(request);
  if (!auth.authorized) return auth.response;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  try {
    const json = await request.json();

    // Check if bulk or single
    if (json.links) {
      const data = bulkCreateSchema.parse(json);
      const results = await prisma.$transaction(
        data.links.map((link) =>
          prisma.affiliateLink.upsert({
            where: {
              entityId_partner: {
                entityId: link.entityId,
                partner: link.partner,
              },
            },
            create: {
              entityId: link.entityId,
              partner: link.partner,
              url: link.url,
              label: link.label,
              priority: link.priority,
              isActive: link.isActive,
              expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
              source: link.source,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              metadata: link.metadata as any,
            },
            update: {
              url: link.url,
              label: link.label,
              priority: link.priority,
              isActive: link.isActive,
              expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
              source: link.source,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              metadata: link.metadata as any,
            },
          }),
        ),
      );
      return NextResponse.json({ created: results.length, links: results }, { status: 201 });
    }

    const data = createSchema.parse(json);
    const link = await prisma.affiliateLink.upsert({
      where: {
        entityId_partner: {
          entityId: data.entityId,
          partner: data.partner,
        },
      },
      create: {
        entityId: data.entityId,
        partner: data.partner,
        url: data.url,
        label: data.label,
        priority: data.priority,
        isActive: data.isActive,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        source: data.source,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: data.metadata as any,
      },
      update: {
        url: data.url,
        label: data.label,
        priority: data.priority,
        isActive: data.isActive,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        source: data.source,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata: data.metadata as any,
      },
      include: { entity: { select: { id: true, name: true, slug: true } } },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Affiliate link create error:", error);
    return NextResponse.json({ error: "Failed to create affiliate link" }, { status: 500 });
  }
}
