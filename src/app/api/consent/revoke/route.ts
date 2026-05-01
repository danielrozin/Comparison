import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { prisma } from "@/lib/db/prisma";
import {
  toGoogleConsentMode,
  type ServerConsentCategories,
} from "@/lib/consent-server";

const revokeSchema = z.object({
  visitorId: z.string().min(1),
  categories: z.array(z.enum(["analytics", "marketing", "functional"])).min(1),
  reason: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const data = revokeSchema.parse(json);

    const latestConsent = await prisma.consentRecord.findFirst({
      where: { visitorId: data.visitorId, revokedAt: null },
      orderBy: { grantedAt: "desc" },
    });

    if (!latestConsent) {
      return NextResponse.json(
        { error: "No active consent found for this visitor" },
        { status: 404 }
      );
    }

    const currentCategories = latestConsent.consentCategories as unknown as ServerConsentCategories;

    await prisma.consentRecord.update({
      where: { id: latestConsent.id },
      data: {
        revokedAt: new Date(),
        revokedReason: data.reason ?? null,
      },
    });

    const updatedCategories: ServerConsentCategories = {
      ...currentCategories,
      necessary: true,
    };
    for (const cat of data.categories) {
      updatedCategories[cat] = false;
    }

    const newRecord = await prisma.consentRecord.create({
      data: {
        visitorId: data.visitorId,
        consentCategories: updatedCategories as unknown as Record<string, boolean>,
        ipHash: latestConsent.ipHash,
        policyVersion: latestConsent.policyVersion,
        userAgent: latestConsent.userAgent,
        geoCountry: latestConsent.geoCountry,
      },
    });

    await logAdminEvent("consent", {
      action: "revoke",
      visitorId: data.visitorId,
      revokedCategories: data.categories,
      revokedReason: data.reason ?? null,
      previousRecordId: latestConsent.id,
      newRecordId: newRecord.id,
    });

    return NextResponse.json({
      id: newRecord.id,
      categories: updatedCategories,
      consentMode: toGoogleConsentMode(updatedCategories),
      revokedCategories: data.categories,
      revokedReason: data.reason ?? null,
      grantedAt: newRecord.grantedAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid revoke data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Consent revoke error:", error);
    return NextResponse.json(
      { error: "Failed to revoke consent" },
      { status: 500 }
    );
  }
}
