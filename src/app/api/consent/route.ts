import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { prisma } from "@/lib/db/prisma";
import {
  CURRENT_POLICY_VERSION,
  getCountryFromHeaders,
  hashIp,
  toGoogleConsentMode,
  type ServerConsentCategories,
} from "@/lib/consent-server";

const consentSchema = z.object({
  visitorId: z.string().min(1).optional(),
  necessary: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  functional: z.boolean(),
  timestamp: z.string().datetime(),
  version: z.number().int().positive(),
  policyVersion: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = consentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid consent data" }, { status: 400 });
    }

    const { visitorId, necessary, analytics, marketing, functional, timestamp, policyVersion } = parsed.data;
    const categories: ServerConsentCategories = { necessary, analytics, marketing, functional };

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim();
    const ipHash = ip ? hashIp(ip) : null;
    const userAgent = request.headers.get("user-agent")?.slice(0, 200) || null;
    const geoCountry = getCountryFromHeaders(request.headers);

    let recordId: string | null = null;
    if (visitorId) {
      try {
        const record = await prisma.consentRecord.create({
          data: {
            visitorId,
            consentCategories: categories as unknown as Record<string, boolean>,
            ipHash,
            policyVersion: policyVersion || CURRENT_POLICY_VERSION,
            userAgent,
            geoCountry,
          },
        });
        recordId = record.id;
      } catch (err) {
        // DB unavailable should not block consent capture — admin event log
        // is the secondary audit trail.
        console.error("ConsentRecord persistence failed:", err);
      }
    }

    await logAdminEvent("consent", {
      visitorId: visitorId ?? null,
      analytics,
      marketing,
      functional,
      timestamp,
      ipHash,
      userAgent,
      geoCountry,
      recordId,
    });

    return NextResponse.json({
      success: true,
      id: recordId,
      consentMode: toGoogleConsentMode(categories),
      policyVersion: policyVersion || CURRENT_POLICY_VERSION,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save consent" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
