import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { logAdminEvent } from "@/lib/services/admin-logger";
import {
  sendConfirmationEmail,
  generateConfirmationToken,
} from "@/lib/services/newsletter";

const RATE_LIMIT_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, referrerSlug } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const prisma = getPrisma();

    if (prisma) {
      // Check for existing subscriber + rate limiting
      const existing = await prisma.newsletterSubscriber.findUnique({
        where: { email: normalizedEmail },
      });

      if (existing) {
        // Already confirmed — no need to re-subscribe
        if (existing.status === "active") {
          return NextResponse.json({ success: true, alreadySubscribed: true });
        }

        // Rate limit: 1 signup attempt per email per 24h
        const timeSinceLastSignup =
          Date.now() - new Date(existing.lastSignupAt).getTime();
        if (timeSinceLastSignup < RATE_LIMIT_MS) {
          return NextResponse.json({
            success: true,
            message: "Confirmation email already sent. Check your inbox.",
          });
        }
      }

      // Generate confirmation token
      const confirmationToken = generateConfirmationToken();

      // Upsert subscriber in pending state
      await prisma.newsletterSubscriber.upsert({
        where: { email: normalizedEmail },
        update: {
          status: "pending",
          confirmationToken,
          lastSignupAt: new Date(),
          source: source || undefined,
          referrerSlug: referrerSlug || undefined,
          updatedAt: new Date(),
        },
        create: {
          email: normalizedEmail,
          source: source || "unknown",
          referrerSlug: referrerSlug || null,
          status: "pending",
          confirmationToken,
          lastSignupAt: new Date(),
        },
      });

      // Send confirmation email via Resend
      await sendConfirmationEmail(normalizedEmail, confirmationToken);
    }

    await logAdminEvent("contact", {
      subtype: "newsletter_subscribe",
      email: normalizedEmail,
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
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
