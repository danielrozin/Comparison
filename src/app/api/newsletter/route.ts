import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { sendNotificationEmail } from "@/lib/services/email";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, referrerSlug } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Store in database (non-blocking — don't fail the signup if DB is down)
    const prisma = getPrisma();
    if (prisma) {
      try {
        await prisma.newsletterSubscriber.upsert({
          where: { email: normalizedEmail },
          update: { status: "active", updatedAt: new Date() },
          create: {
            email: normalizedEmail,
            source: source || "unknown",
            referrerSlug: referrerSlug || null,
          },
        });
      } catch (dbError) {
        // Log but don't fail — P2002 (duplicate) is fine, other errors are non-fatal
        if (
          dbError &&
          typeof dbError === "object" &&
          "code" in dbError &&
          (dbError as { code: string }).code !== "P2002"
        ) {
          console.error("Newsletter DB error (non-fatal):", dbError);
        }
      }
    }

    // Send email notification to admin
    await sendNotificationEmail({
      subject: "New Newsletter Subscriber",
      type: "newsletter_subscribe",
      message: `New subscriber: ${normalizedEmail}\nSource: ${source || "unknown"}${referrerSlug ? `\nReferrer: ${referrerSlug}` : ""}`,
      senderEmail: normalizedEmail,
    });

    await logAdminEvent("contact", {
      subtype: "newsletter_subscribe",
      email: normalizedEmail,
      source,
      referrerSlug,
    });

    // Server-side PostHog: identify + capture (use normalizedEmail as distinct ID before a real user ID is known)
    const ph = getPostHogClient();
    ph.identify({ distinctId: normalizedEmail, properties: { email: normalizedEmail } });
    ph.capture({ distinctId: normalizedEmail, event: "newsletter_subscribed", properties: { source: source || "unknown", referrer_slug: referrerSlug || null } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
