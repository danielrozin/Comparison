import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import {
  defaultConsentForRegion,
  getCountryFromHeaders,
  isEuEea,
  toGoogleConsentMode,
  type ServerConsentCategories,
} from "@/lib/consent-server";

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

    let latestConsent: { consentCategories: unknown; policyVersion: string; grantedAt: Date } | null = null;
    try {
      latestConsent = await prisma.consentRecord.findFirst({
        where: { visitorId, revokedAt: null },
        orderBy: { grantedAt: "desc" },
        select: { consentCategories: true, policyVersion: true, grantedAt: true },
      });
    } catch (err) {
      // DB unavailable — fall through to defaults so the client gets a
      // legally-safe answer instead of a 500.
      console.error("ConsentRecord lookup failed:", err);
    }

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

    const categories = latestConsent.consentCategories as ServerConsentCategories;

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
    console.error("Consent status error:", error);
    return NextResponse.json(
      { error: "Failed to get consent status" },
      { status: 500 }
    );
  }
}
