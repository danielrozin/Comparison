import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { sendNotificationEmail, sendConfirmationEmail } from "@/lib/services/email";
import { generateToken, buildConfirmUrl, buildUnsubscribeUrl } from "@/lib/services/subscriber-tokens";

const VALID_CATEGORIES = [
  "technology", "sports", "countries", "products", "health",
  "history", "companies", "entertainment", "brands", "automotive",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source, referrerSlug, categories } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate categories if provided
    const validCategories: string[] = [];
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        if (typeof cat === "string" && VALID_CATEGORIES.includes(cat)) {
          validCategories.push(cat);
        }
      }
    }

    const confirmToken = generateToken();
    const unsubscribeToken = generateToken();

    const prisma = getPrisma();
    let isResubscribe = false;

    if (prisma) {
      try {
        const existing = await prisma.newsletterSubscriber.findUnique({
          where: { email: normalizedEmail },
        });

        if (existing) {
          if (existing.status === "active") {
            // Already confirmed — update categories if provided
            if (validCategories.length > 0) {
              await prisma.newsletterSubscriber.update({
                where: { email: normalizedEmail },
                data: { categories: validCategories },
              });
            }
            return NextResponse.json({
              success: true,
              message: "You're already subscribed! Preferences updated.",
              alreadySubscribed: true,
            });
          }

          // Resubscribe (was unsubscribed or pending) — new double opt-in
          isResubscribe = true;
          await prisma.newsletterSubscriber.update({
            where: { email: normalizedEmail },
            data: {
              status: "pending",
              source: source || existing.source,
              referrerSlug: referrerSlug || existing.referrerSlug,
              categories: validCategories.length > 0 ? validCategories : existing.categories,
              confirmToken,
              unsubscribeToken,
              confirmedAt: null,
            },
          });
        } else {
          // New subscriber
          await prisma.newsletterSubscriber.create({
            data: {
              email: normalizedEmail,
              source: source || "unknown",
              referrerSlug: referrerSlug || null,
              categories: validCategories,
              status: "pending",
              confirmToken,
              unsubscribeToken,
            },
          });
        }
      } catch (dbError) {
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

    // Send confirmation email (double opt-in)
    const confirmUrl = buildConfirmUrl(confirmToken);
    await sendConfirmationEmail({
      to: normalizedEmail,
      confirmUrl,
      categories: validCategories,
    });

    // Notify admin
    await sendNotificationEmail({
      subject: isResubscribe ? "Newsletter Resubscribe (pending confirmation)" : "New Newsletter Subscriber (pending confirmation)",
      type: "newsletter_subscribe",
      message: `${isResubscribe ? "Resubscribe" : "New subscriber"}: ${normalizedEmail}\nSource: ${source || "unknown"}${referrerSlug ? `\nReferrer: ${referrerSlug}` : ""}${validCategories.length > 0 ? `\nCategories: ${validCategories.join(", ")}` : ""}`,
      senderEmail: normalizedEmail,
    });

    await logAdminEvent("contact", {
      subtype: "newsletter_subscribe",
      email: normalizedEmail,
      source,
      referrerSlug,
      categories: validCategories,
      doubleOptIn: true,
    });

    return NextResponse.json({
      success: true,
      message: "Please check your email to confirm your subscription.",
      pendingConfirmation: true,
    });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
