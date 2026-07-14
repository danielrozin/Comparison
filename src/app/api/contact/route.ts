import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { sendNotificationEmail } from "@/lib/services/email";
import { getPostHogClient } from "@/lib/posthog-server";
import { CONVERSION_SOURCES } from "@/lib/utils/attribution";

const contactSchema = z.object({
  name: z.string().min(1).max(120).transform((s) => s.trim()),
  email: z.string().email().max(254),
  subject: z.string().max(50).optional().or(z.literal("")),
  message: z.string().min(1).max(2000).transform((s) => s.trim()),
  source: z.enum(CONVERSION_SOURCES).default("direct"),
  sessionId: z.string().max(64).optional().or(z.literal("")),
  url: z.string().url().max(2000).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, email, subject, message, source, sessionId, url } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // The row is the conversion signal the PPC gate reads (DAN-2146), so it is
    // written first — but a DB outage must not swallow the lead, hence the
    // notification email still goes out below either way.
    let persisted = false;
    const prisma = getPrisma();
    if (prisma) {
      try {
        await prisma.contactSubmission.create({
          data: {
            name,
            email: normalizedEmail,
            subject: subject || null,
            message,
            source,
            sessionId: sessionId || null,
            pageUrl: url || null,
          },
        });
        persisted = true;
      } catch (dbError) {
        console.error("Contact submission DB error (non-fatal):", dbError);
      }
    }

    // Notification/telemetry must never fail the response once the row exists:
    // an error here would push the user to re-submit and double-count the lead.
    try {
      await sendNotificationEmail({
        subject: `New contact: ${subject || "General Inquiry"}`,
        type: `contact-${subject || "General Inquiry"}`,
        message: `Name: ${name}\nSubject: ${subject || "General Inquiry"}\nSource: ${source}\n\n${message}`,
        senderEmail: normalizedEmail,
        pageUrl: url || undefined,
      });

      await logAdminEvent("contact", {
        subtype: "contact_form_submit",
        email: normalizedEmail,
        subject: subject || null,
        source,
        persisted,
        message: message.slice(0, 200),
        url,
      });

      // Server-side conversion event — GA4 `contact_form_submit` still fires
      // client-side; this is the copy that survives ad blockers.
      getPostHogClient().capture({
        distinctId: sessionId || normalizedEmail,
        event: "contact_form_submitted",
        properties: { source, subject: subject || null, email: normalizedEmail },
      });
    } catch (notifyError) {
      console.error("Contact notification error (non-fatal):", notifyError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
