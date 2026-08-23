import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getPrisma } from "@/lib/db/prisma";
import { sendOutreachEmail, sendNotificationEmail } from "@/lib/services/email";
import { logAdminEvent } from "@/lib/services/admin-logger";
import { SITE_URL } from "@/lib/utils/constants";
import {
  TRACKER_COOKIE,
  setTrackerCookie,
  verifyTrackerSession,
} from "@/lib/services/tracker-session";

const ALL_TRIGGERS = ["price_change", "new_spec", "verdict_update"] as const;
type Trigger = (typeof ALL_TRIGGERS)[number];

function normalizeTriggers(input: unknown): Trigger[] {
  if (!Array.isArray(input) || input.length === 0) return [...ALL_TRIGGERS];
  const allowed = new Set<string>(ALL_TRIGGERS);
  const filtered = input.filter(
    (t): t is Trigger => typeof t === "string" && allowed.has(t),
  );
  return filtered.length > 0 ? filtered : [...ALL_TRIGGERS];
}

function isValidEmail(value: unknown): value is string {
  return (
    typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

function isValidSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9-]+(?:-vs-[a-z0-9-]+)?$/i.test(value);
}

function humanTitleFromSlug(slug: string): string {
  return slug
    .split("-vs-")
    .map((part) =>
      part
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    )
    .join(" vs ");
}

function buildConfirmationEmail(opts: {
  comparisonSlug: string;
  comparisonTitle: string;
  confirmUrl: string;
}): { subject: string; html: string; text: string } {
  const { comparisonTitle, confirmUrl } = opts;
  const subject = `Confirm tracking for ${comparisonTitle}`;
  const text = [
    `You asked to track ${comparisonTitle} on A Versus B.`,
    "",
    "Confirm to start tracking — we'll email you when the price, specs, or verdict changes:",
    confirmUrl,
    "",
    "If you didn't request this, you can ignore this email.",
  ].join("\n");
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a;">
      <h1 style="font-size:20px;margin:0 0 16px;">Confirm to start tracking</h1>
      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
        You asked us to keep an eye on <strong>${comparisonTitle}</strong>.
        Click the button below and we'll email you when the price changes, a new spec ships, or our verdict updates.
      </p>
      <p style="margin:24px 0;">
        <a href="${confirmUrl}" style="display:inline-block;background:#2563eb;color:#fff;font-weight:600;padding:12px 20px;border-radius:8px;text-decoration:none;">
          Confirm tracking
        </a>
      </p>
      <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
        Didn't request this? You can ignore this email — no tracker will be created.
      </p>
    </div>
  `;
  return { subject, html, text };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      comparisonSlug?: unknown;
      email?: unknown;
      triggers?: unknown;
    };

    if (!isValidSlug(body.comparisonSlug)) {
      return NextResponse.json(
        { error: "Valid comparisonSlug is required" },
        { status: 400 },
      );
    }
    const comparisonSlug = body.comparisonSlug.toLowerCase();
    const triggers = normalizeTriggers(body.triggers);

    const cookieToken = request.cookies.get(TRACKER_COOKIE)?.value;
    const session = verifyTrackerSession(cookieToken);

    let email: string | null = null;
    if (session?.email) {
      email = session.email;
    } else if (isValidEmail(body.email)) {
      email = body.email.toLowerCase().trim();
    }

    if (!email) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    const prisma = getPrisma();
    if (!prisma) {
      return NextResponse.json(
        { error: "Tracking is temporarily unavailable" },
        { status: 503 },
      );
    }

    const existing = await prisma.comparisonTracker.findUnique({
      where: { uniq_email_slug: { email, comparisonSlug } },
    });

    // Fast path — already-confirmed session re-tracking the same comparison.
    if (session && existing && existing.status === "active") {
      return NextResponse.json({
        status: "active",
        alreadyTracking: true,
      });
    }

    // Logged-in (cookie-confirmed) one-click flow → activate immediately.
    if (session) {
      const now = new Date();
      const tracker = existing
        ? await prisma.comparisonTracker.update({
            where: { id: existing.id },
            data: {
              status: "active",
              triggers,
              confirmedAt: existing.confirmedAt ?? now,
              source: existing.source ?? "logged_in_oneclick",
            },
          })
        : await prisma.comparisonTracker.create({
            data: {
              email,
              comparisonSlug,
              triggers,
              status: "active",
              confirmedAt: now,
              source: "logged_in_oneclick",
            },
          });

      const response = NextResponse.json({
        status: "active",
        trackerId: tracker.id,
      });
      // Refresh the rolling cookie.
      setTrackerCookie(response, email);
      return response;
    }

    // Logged-out flow → create/refresh pending tracker + send magic link.
    const confirmationToken = randomBytes(32).toString("hex");
    const tracker = existing
      ? await prisma.comparisonTracker.update({
          where: { id: existing.id },
          data: {
            triggers,
            confirmationToken,
            // Re-arm an unconfirmed/stopped tracker; keep active ones active.
            status: existing.status === "active" ? "active" : "pending",
            source: existing.source ?? "card",
          },
        })
      : await prisma.comparisonTracker.create({
          data: {
            email,
            comparisonSlug,
            triggers,
            status: "pending",
            confirmationToken,
            source: "card",
          },
        });

    const confirmUrl = `${SITE_URL}/api/track-comparison/confirm?token=${confirmationToken}`;
    const comparisonTitle = humanTitleFromSlug(comparisonSlug);
    const { subject, html, text } = buildConfirmationEmail({
      comparisonSlug,
      comparisonTitle,
      confirmUrl,
    });

    const send = await sendOutreachEmail({
      to: email,
      subject,
      html,
      text,
      tags: [
        { name: "type", value: "tracker_confirmation" },
        { name: "slug", value: comparisonSlug },
      ],
    });

    if (!send.success) {
      // Resend not configured (dev) — fall back to admin notification so the
      // event isn't silently dropped, and log the confirm URL server-side.
      console.warn(
        `[track-comparison] Resend unavailable, logging confirm URL: ${confirmUrl}`,
      );
      await sendNotificationEmail({
        subject: `[DEV] Tracker confirmation pending for ${email}`,
        type: "tracker_confirmation_dev",
        message: `User: ${email}\nComparison: ${comparisonSlug}\nConfirm: ${confirmUrl}`,
        senderEmail: email,
      });
    }

    await logAdminEvent("contact", {
      subtype: "tracker_pending",
      email,
      comparisonSlug,
      triggers: triggers.join(","),
      trackerId: tracker.id,
    });

    return NextResponse.json({
      status: tracker.status === "active" ? "active" : "pending",
    });
  } catch (error) {
    console.error("track-comparison POST error:", error);
    return NextResponse.json(
      { error: "Failed to create tracker" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  // Status check used by the card on mount: is the current cookie+slug
  // already an active tracker? Returns { status: "active" | "none" }.
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json({ error: "Valid slug is required" }, { status: 400 });
  }

  const session = verifyTrackerSession(request.cookies.get(TRACKER_COOKIE)?.value);
  if (!session) return NextResponse.json({ status: "none" });

  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ status: "none" });

  const tracker = await prisma.comparisonTracker.findUnique({
    where: {
      uniq_email_slug: { email: session.email, comparisonSlug: slug.toLowerCase() },
    },
    select: { status: true },
  });

  return NextResponse.json({
    status: tracker?.status === "active" ? "active" : "none",
  });
}

export async function DELETE(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || !isValidSlug(slug)) {
    return NextResponse.json({ error: "Valid slug is required" }, { status: 400 });
  }

  const session = verifyTrackerSession(request.cookies.get(TRACKER_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not tracking" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }

  await prisma.comparisonTracker.updateMany({
    where: { email: session.email, comparisonSlug: slug.toLowerCase() },
    data: { status: "stopped" },
  });

  await logAdminEvent("contact", {
    subtype: "tracker_stopped",
    email: session.email,
    comparisonSlug: slug.toLowerCase(),
  });

  return NextResponse.json({ status: "stopped" });
}
