import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/utils/constants";
import { logMarketingConsent } from "@/lib/services/marketing-consent";

// GET — one-click link unsubscribe (from email link)
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe?status=error`);
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe?status=error`);
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe?status=invalid`);
    }

    if (subscriber.status === "unsubscribed") {
      return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe?status=already`);
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "unsubscribed",
        marketingConsent: false,
      },
    });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");
    await logMarketingConsent({
      email: subscriber.email,
      action: "unsubscribed",
      source: "newsletter",
      ip,
      userAgent,
      subscriberId: subscriber.id,
      metadata: { method: "one_click_link" },
    });

    return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe?status=success`);
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.redirect(`${SITE_URL}/newsletter/unsubscribe?status=error`);
  }
}

// POST — RFC 8058 one-click unsubscribe (from List-Unsubscribe-Post header)
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    if (subscriber.status === "unsubscribed") {
      return NextResponse.json({ success: true, alreadyUnsubscribed: true });
    }

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: "unsubscribed",
        marketingConsent: false,
      },
    });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
    const userAgent = request.headers.get("user-agent");
    await logMarketingConsent({
      email: subscriber.email,
      action: "unsubscribed",
      source: "newsletter",
      ip,
      userAgent,
      subscriberId: subscriber.id,
      metadata: { method: "rfc8058_one_click" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe POST error:", error);
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
