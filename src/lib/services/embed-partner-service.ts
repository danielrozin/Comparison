import { getPrisma } from "@/lib/db/prisma";
import { getRedis } from "@/lib/services/redis";
import crypto from "crypto";

export const EMBED_TIERS = {
  free: { name: "Free", monthlyViewLimit: 10000, price: 0, hideBranding: false },
  pro: { name: "Pro", monthlyViewLimit: 100000, price: 19900, hideBranding: true },
  enterprise: { name: "Enterprise", monthlyViewLimit: null, price: 49900, hideBranding: true },
} as const;

export type EmbedTier = keyof typeof EMBED_TIERS;

export interface EmbedPartnerConfig {
  partnerKey: string;
  tier: string;
  brandName: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  logoUrl: string | null;
  hideBranding: boolean;
  customFooterText: string | null;
  customFooterUrl: string | null;
}

function generatePartnerKey(): string {
  return `emb_${crypto.randomBytes(16).toString("hex")}`;
}

const PARTNER_CACHE_TTL = 300; // 5 minutes

export async function getEmbedPartnerByKey(partnerKey: string): Promise<EmbedPartnerConfig | null> {
  const redis = getRedis();
  const cacheKey = `embed:partner:${partnerKey}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached as string);
  }

  const prisma = getPrisma();
  if (!prisma) return null;

  const partner = await prisma.embedPartner.findUnique({
    where: { partnerKey, status: "active" },
    select: {
      partnerKey: true,
      tier: true,
      brandName: true,
      primaryColor: true,
      accentColor: true,
      logoUrl: true,
      hideBranding: true,
      customFooterText: true,
      customFooterUrl: true,
    },
  });

  if (!partner) return null;

  if (redis) {
    await redis.set(cacheKey, JSON.stringify(partner), { ex: PARTNER_CACHE_TTL });
  }

  return partner;
}

export async function createEmbedPartner(params: {
  name: string;
  email: string;
  website?: string;
  tier?: EmbedTier;
}): Promise<{ partner: { id: string; partnerKey: string; name: string; tier: string }; partnerKey: string }> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database not available");

  const partnerKey = generatePartnerKey();
  const tier = params.tier || "free";
  const tierDef = EMBED_TIERS[tier];

  const partner = await prisma.embedPartner.create({
    data: {
      partnerKey,
      name: params.name,
      email: params.email,
      website: params.website,
      tier,
      hideBranding: tierDef.hideBranding,
      monthlyViewLimit: tierDef.monthlyViewLimit,
    },
    select: { id: true, partnerKey: true, name: true, tier: true },
  });

  return { partner, partnerKey };
}

export async function updateEmbedPartnerBranding(
  partnerKey: string,
  branding: {
    brandName?: string | null;
    primaryColor?: string | null;
    accentColor?: string | null;
    logoUrl?: string | null;
    customFooterText?: string | null;
    customFooterUrl?: string | null;
  }
): Promise<void> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Database not available");

  await prisma.embedPartner.update({
    where: { partnerKey },
    data: branding,
  });

  // Invalidate cache
  const redis = getRedis();
  if (redis) {
    await redis.del(`embed:partner:${partnerKey}`);
  }
}

export async function incrementEmbedViews(partnerKey: string): Promise<boolean> {
  const prisma = getPrisma();
  if (!prisma) return true;

  const partner = await prisma.embedPartner.findUnique({
    where: { partnerKey },
    select: { monthlyEmbedViews: true, monthlyViewLimit: true, lastViewResetAt: true },
  });

  if (!partner) return false;

  // Reset monthly counter if needed
  const now = new Date();
  const lastReset = new Date(partner.lastViewResetAt);
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    await prisma.embedPartner.update({
      where: { partnerKey },
      data: { monthlyEmbedViews: 1, lastViewResetAt: now },
    });
    return true;
  }

  // Check limit
  if (partner.monthlyViewLimit && partner.monthlyEmbedViews >= partner.monthlyViewLimit) {
    return false;
  }

  await prisma.embedPartner.update({
    where: { partnerKey },
    data: { monthlyEmbedViews: { increment: 1 } },
  });

  return true;
}
