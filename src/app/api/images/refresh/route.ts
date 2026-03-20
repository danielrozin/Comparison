import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { fetchEntityImage } from "@/lib/services/image-service";

export const maxDuration = 60;

/**
 * POST /api/images/refresh
 * Body: { slug: "messi-vs-ronaldo" } or { all: true, limit: 50 }
 * Fetches fresh images for entities and updates the DB.
 */
export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (
    authHeader !== `Bearer ${process.env.ADMIN_TOKEN}` &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { slug, all, limit = 50 } = body;

    if (!slug && !all) {
      return NextResponse.json(
        { error: "Provide either 'slug' (comparison slug) or 'all: true'" },
        { status: 400 }
      );
    }

    const updated: { slug: string; name: string; imageUrl: string | null }[] = [];

    if (slug) {
      // Refresh images for a single comparison
      const comparison = await prisma.comparison.findUnique({
        where: { slug },
        include: {
          entities: {
            include: { entity: true },
          },
        },
      });

      if (!comparison) {
        return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
      }

      for (const ce of comparison.entities) {
        const entity = ce.entity;
        const imageUrl = await fetchEntityImage(
          entity.name,
          entity.entityTypeId || "general",
          entity.slug
        );

        if (imageUrl) {
          await prisma.entity.update({
            where: { slug: entity.slug },
            data: { imageUrl },
          });
          updated.push({ slug: entity.slug, name: entity.name, imageUrl });
        }
      }
    } else {
      // Refresh images for all entities (with limit)
      const entities = await prisma.entity.findMany({
        take: Math.min(limit, 200),
        orderBy: { createdAt: "desc" },
      });

      for (const entity of entities) {
        const imageUrl = await fetchEntityImage(
          entity.name,
          entity.entityTypeId || "general",
          entity.slug
        );

        if (imageUrl) {
          await prisma.entity.update({
            where: { slug: entity.slug },
            data: { imageUrl },
          });
          updated.push({ slug: entity.slug, name: entity.name, imageUrl });
        }

        // Rate limit: 200ms delay between requests
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    return NextResponse.json({
      success: true,
      updated: updated.length,
      entities: updated,
    });
  } catch (error) {
    console.error("Image refresh failed:", error);
    return NextResponse.json(
      { error: "Image refresh failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
