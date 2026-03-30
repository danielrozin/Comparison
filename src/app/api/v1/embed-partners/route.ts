import { NextRequest, NextResponse } from "next/server";
import {
  createEmbedPartner,
  updateEmbedPartnerBranding,
  getEmbedPartnerByKey,
  type EmbedTier,
  EMBED_TIERS,
} from "@/lib/services/embed-partner-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, website, tier } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    if (tier && !(tier in EMBED_TIERS)) {
      return NextResponse.json(
        { error: `Invalid tier. Options: ${Object.keys(EMBED_TIERS).join(", ")}` },
        { status: 400 }
      );
    }

    const result = await createEmbedPartner({
      name,
      email,
      website,
      tier: (tier as EmbedTier) || "free",
    });

    return NextResponse.json({
      success: true,
      partner: result.partner,
      partnerKey: result.partnerKey,
      tier: EMBED_TIERS[(tier as EmbedTier) || "free"],
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create embed partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner account" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { partnerKey, brandName, primaryColor, accentColor, logoUrl, customFooterText, customFooterUrl } = body;

    if (!partnerKey) {
      return NextResponse.json({ error: "partnerKey is required" }, { status: 400 });
    }

    const partner = await getEmbedPartnerByKey(partnerKey);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    // Only pro/enterprise can customize branding
    if (partner.tier === "free" && (brandName || primaryColor || accentColor || logoUrl)) {
      return NextResponse.json(
        { error: "Branding customization requires Pro or Enterprise tier" },
        { status: 403 }
      );
    }

    await updateEmbedPartnerBranding(partnerKey, {
      brandName,
      primaryColor,
      accentColor,
      logoUrl,
      customFooterText,
      customFooterUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update partner branding:", error);
    return NextResponse.json(
      { error: "Failed to update branding" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const partnerKey = request.nextUrl.searchParams.get("key");

  if (!partnerKey) {
    return NextResponse.json({ error: "key parameter is required" }, { status: 400 });
  }

  const partner = await getEmbedPartnerByKey(partnerKey);
  if (!partner) {
    return NextResponse.json({ error: "Partner not found" }, { status: 404 });
  }

  return NextResponse.json({ partner });
}
