import { getPrisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { createHash } from "crypto";

type ConsentAction = "consent_given" | "confirmed" | "unsubscribed" | "resubscribed";
type ConsentSource = "newsletter" | "smartreview_survey" | "intercept_survey";

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function logMarketingConsent(params: {
  email: string;
  action: ConsentAction;
  source: ConsentSource;
  ip?: string | null;
  userAgent?: string | null;
  subscriberId?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) return;

  try {
    await prisma.marketingConsentLog.create({
      data: {
        email: params.email.toLowerCase().trim(),
        action: params.action,
        source: params.source,
        ipHash: params.ip ? hashIp(params.ip) : null,
        userAgent: params.userAgent?.slice(0, 500) || null,
        subscriberId: params.subscriberId || null,
        metadata: (params.metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      },
    });
  } catch (error) {
    console.error("Failed to log marketing consent:", error);
  }
}

export function generateUnsubscribeToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
