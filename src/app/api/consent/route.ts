import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { getPrisma } from "@/lib/db/prisma";
import {
  CURRENT_POLICY_VERSION,
  getCountryFromHeaders,
  hashIp,
  toGoogleConsentMode,
} from "@/lib/consent";

// Backwards-compatible payload: still accepts the legacy flat shape
// (necessary/analytics/marketing/functional/timestamp/version) and a
// newer shape with explicit visitorId + policyVersion.
const consentSchema = z.object({
  visitorId: z.string().min(1).optional(),
  necessary: z.literal(true),
  analytics: z.boolean(),
  marketing: z.boolean(),
  functional: z.boolean(),
  timestamp: z.string().datetime().optional(),
  version: z.union([z.number().int().positive(), z.string()]).optional(),
  policyVersion: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = consentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid consent data" }, { status: 400 });
    }

    const { analytics, marketing, functional, timestamp } = parsed.data;
    const visitorId = parsed.data.visitorId ?? deriveVisitorIdFromHeaders(request);
    const policyVersion =
      parsed.data.policyVersion ?? String(parsed.data.version ?? CURRENT_POLICY_VERSION);

    const ipRaw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipHash = ipRaw && ipRaw !== "unknown" ? hashIp(ipRaw) : null;
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) ?? null;
    const geoCountry = getCountryFromHeaders(request.headers);

    const categories = { necessary: true as const, analytics, marketing, functional };

    // Existing in-Redis admin event log (kept as-is per "What works today")
    await logAdminEvent("consent", {
      visitorId,
      analytics,
      marketing,
      functional,
      timestamp: timestamp ?? new Date().toISOString(),
      ipHash, // hashed only — never raw IPs
      userAgent: userAgent?.slice(0, 200) || "unknown",
      policyVersion,
    });

    // Server-side audit trail (GDPR Article 7(1))
    const prisma = getPrisma();
    let recordId: string | null = null;
    if (prisma) {
      try {
        const record = await prisma.consentRecord.create({
          data: {
            visitorId,
            consentCategories: categories as unknown as Record<string, boolean>,
            ipHash,
            policyVersion,
            userAgent,
            geoCountry,
          },
        });
        recordId = record.id;
      } catch (err) {
        // Do not fail the user-facing request if the DB is briefly unavailable —
        // the admin event log above still captures the consent for audit.
        console.error("[consent] ConsentRecord write failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      id: recordId,
      visitorId,
      policyVersion,
      consentMode: toGoogleConsentMode(categories),
    });
  } catch {
    return NextResponse.json({ error: "Failed to save consent" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

function deriveVisitorIdFromHeaders(request: NextRequest): string {
  // Fallback when client doesn't send a visitorId: hash IP+UA so we still
  // have a stable per-visitor key for the audit row.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  return hashIp(`${ip}|${ua}`);
}
