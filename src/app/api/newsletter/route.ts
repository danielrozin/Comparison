import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { sendNotificationEmail, sendOutreachEmail } from "@/lib/services/email";
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
    let isNewSubscriber = true;
    if (prisma) {
      try {
        const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: normalizedEmail }, select: { id: true, status: true } });
        isNewSubscriber = !existing || existing.status !== "active";
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

    // Welcome email to the subscriber — the subscriber→customer bridge.
    // Previously signup sent nothing to the subscriber at all; the first
    // touch is where founding-member conversion is highest, so the welcome
    // carries the pitch. Only on genuinely new/reactivated subscriptions.
    if (isNewSubscriber) {
      const followed = typeof referrerSlug === "string" && referrerSlug.includes("-vs-")
        ? referrerSlug.replace(/-vs-/g, " vs ").replace(/-/g, " ")
        : null;
      try {
        await sendOutreachEmail({
          to: normalizedEmail,
          subject: followed ? `Following: ${followed} — you're in` : "You're in — here's what you'll get",
          html: `
            <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;line-height:1.6">
              <p style="font-size:16px"><strong>Welcome to A Versus B.</strong></p>
              <p>${followed
                ? `You're now following <strong>${followed}</strong> — we'll email you when the verdict, specs or prices change, and send the week's best head-to-heads.`
                : `Every week you'll get the comparisons people are actually deciding with — verdicts included, no affiliate fluff.`}</p>
              <p style="margin:20px 0;padding:16px 18px;background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px">
                <strong>Founding member offer.</strong> We're opening Pro — any comparison you want, researched and published for you within 24 hours. Founding price is <strong>$49/year</strong> (later $90), locked for as long as you stay.<br/>
                <a href="https://www.aversusb.net/pricing?src=welcome-email" style="color:#2563eb;font-weight:600">Lock the founding price →</a>
              </p>
              <p>Questions? Just reply — a founder answers.</p>
              <p style="color:#64748b;font-size:13px">Daniel &amp; Shai, founders of <a href="https://www.aversusb.net" style="color:#2563eb">aversusb.net</a><br/>
              <a href="https://www.aversusb.net/api/newsletter/unsubscribe?email=${encodeURIComponent(normalizedEmail)}" style="color:#94a3b8">Unsubscribe</a></p>
            </div>`,
          tags: [{ name: "type", value: "welcome" }],
        });
        getPostHogClient().capture({
          distinctId: normalizedEmail,
          event: "welcome_email_sent",
          properties: { source: source || "unknown", referrer_slug: referrerSlug || null },
        });
      } catch (welcomeErr) {
        console.error("Welcome email failed (non-fatal):", welcomeErr);
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
