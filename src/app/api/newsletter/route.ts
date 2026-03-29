import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { logAdminEvent } from "@/lib/services/admin-logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, referrerSlug } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const prisma = getPrisma();
    if (prisma) {
      await prisma.newsletterSubscriber.upsert({
        where: { email: email.toLowerCase().trim() },
        update: { status: "active", updatedAt: new Date() },
        create: {
          email: email.toLowerCase().trim(),
          source: source || "unknown",
          referrerSlug: referrerSlug || null,
        },
      });
    }

    await logAdminEvent("contact", {
      subtype: "newsletter_subscribe",
      email: email.toLowerCase().trim(),
      source,
      referrerSlug,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ success: true });
    }
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
