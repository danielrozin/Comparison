import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import {
  defaultConsentForRegion,
  getCountryFromHeaders,
  isEuEea,
  toGoogleConsentMode,
  type ConsentCategories,
} from "@/lib/consent";

export async function GET(request: NextRequest) {
  try {
    const visitorId = request.nextUrl.searchParams.get("visitorId");
    if (!visitorId) {
      return NextResponse.json(
        { error: "visitorId query parameter is required" },
        { status: 400 }
      );
    }

    const geoCountry = getCountryFromHeaders(request.headers);
    const isEu = isEuEea(geoCountry);

    const prisma = getPrisma();
    const latestConsent = prisma
      ? await prisma.consentRecord.findFirst({
          where: { visitorId, revokedAt: null },
          orderBy: { grantedAt: "desc" },
        })
      : null;

    if (!latestConsent) {
      const defaults = defaultConsentForRegion(isEu);
      return NextResponse.json({
        hasConsented: false,
        isEuEea: isEu,
        geoCountry,
        categories: defaults,
        consentMode: toGoogleConsentMode(defaults),
      });
    }

    const categories = latestConsent.consentCategories as unknown as ConsentCategories;

    return NextResponse.json({
      hasConsented: true,
      isEuEea: isEu,
      geoCountry,
      categories,
      consentMode: toGoogleConsentMode(categories),
      policyVersion: latestConsent.policyVersion,
      grantedAt: latestConsent.grantedAt,
    });
  } catch (error) {
    console.error("[consent/status] error:", error);
    return NextResponse.json({ error: "Failed to get consent status" }, { status: 500 });
  }
}
