import { getPrisma } from "@/lib/db/prisma";
import { sendOutreachEmail } from "@/lib/services/email";

/**
 * "Email me when it's live" on missing-compare pages.
 *
 * A visitor who lands on a compare we couldn't build leaves an email. The
 * subscriber row keeps source = MISSING_COMPARE_NOTIFY_SOURCE and
 * referrerSlug = the compare slug. Once that compare is published (by the
 * promotion recheck, a later build or an editorial page), the job below sends
 * one "it's live" email and flips the source to MISSING_COMPARE_NOTIFIED_SOURCE
 * so nobody is emailed twice. No schema change needed.
 */
export const MISSING_COMPARE_NOTIFY_SOURCE = "missing_compare_notify";
export const MISSING_COMPARE_NOTIFIED_SOURCE = "missing_compare_notified";

const SITE = "https://www.aversusb.net";

export function matchupFromSlug(slug: string): string {
  return slug
    .split("-vs-")
    .map((part) => part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" vs ");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell(email: string, body: string): string {
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;line-height:1.6">
      ${body}
      <p>Questions? Just reply. A founder answers.</p>
      <p style="color:#64748b;font-size:13px">Daniel &amp; Shai, founders of <a href="${SITE}" style="color:#2563eb">aversusb.net</a><br/>
      <a href="${SITE}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}" style="color:#94a3b8">Unsubscribe</a></p>
    </div>`;
}

function trialBlock(src: string): string {
  return `<p style="margin:20px 0;padding:16px 18px;background:#eff6ff;border-left:4px solid #2563eb;border-radius:6px">
      <strong>Don't want to wait?</strong> Pro members get any comparison researched, sourced and published within 24 hours.
      Try Pro free for 7 days, then $9/month. Cancel before day 7 and you pay nothing.<br/>
      <a href="${SITE}/pricing?src=${encodeURIComponent(src)}" style="color:#2563eb;font-weight:600">Start your free trial →</a>
    </p>`;
}

export function missingCompareWelcomeEmail(email: string, slug: string): { subject: string; html: string } {
  const matchup = escapeHtml(matchupFromSlug(slug));
  return {
    subject: `We're on it: ${matchupFromSlug(slug)}`,
    html: shell(
      email,
      `<p style="font-size:16px"><strong>Got it.</strong></p>
      <p>We don't have <strong>${matchup}</strong> yet. We'll send you one email the moment it's published, with the verdict.</p>
      ${trialBlock(`notify-welcome-${slug}`)}`,
    ),
  };
}

export function readyCompareEmail(email: string, slug: string): { subject: string; html: string } {
  const matchup = escapeHtml(matchupFromSlug(slug));
  const url = `${SITE}/compare/${slug}?utm_source=email&utm_medium=notify&utm_campaign=compare_ready`;
  return {
    subject: `${matchupFromSlug(slug)} is live`,
    html: shell(
      email,
      `<p style="font-size:16px"><strong>${matchup} is ready.</strong></p>
      <p>You asked us to tell you when this comparison was published. Here it is, with the verdict and sources:</p>
      <p style="margin:20px 0"><a href="${url}" style="display:inline-block;background:#2563eb;color:#fff;font-weight:700;padding:12px 20px;border-radius:10px;text-decoration:none">Read ${matchup} →</a></p>
      ${trialBlock(`notify-ready-${slug}`)}`,
    ),
  };
}

export interface ReadyCompareNotifyReport {
  pending: number;
  sent: number;
  failed: number;
}

/** Emails everyone whose requested compare is now published. Bounded per run. */
export async function notifyReadyCompareSubscribers(limit = 200): Promise<ReadyCompareNotifyReport> {
  const report: ReadyCompareNotifyReport = { pending: 0, sent: 0, failed: 0 };
  const prisma = getPrisma();
  if (!prisma) return report;

  const waiting = await prisma.newsletterSubscriber.findMany({
    where: { source: MISSING_COMPARE_NOTIFY_SOURCE, status: "active", referrerSlug: { not: null } },
    select: { id: true, email: true, referrerSlug: true },
    orderBy: { updatedAt: "asc" },
    take: limit,
  });
  report.pending = waiting.length;
  if (waiting.length === 0) return report;

  const slugs = [...new Set(waiting.map((row) => row.referrerSlug as string))];
  const published = await prisma.comparison.findMany({
    where: { slug: { in: slugs }, status: "published" },
    select: { slug: true },
  });
  const live = new Set(published.map((row) => row.slug));

  for (const row of waiting) {
    const slug = row.referrerSlug as string;
    if (!live.has(slug)) continue;
    const message = readyCompareEmail(row.email, slug);
    const result = await sendOutreachEmail({
      to: row.email,
      subject: message.subject,
      html: message.html,
      tags: [{ name: "type", value: "compare_ready" }],
    });
    if (!result.success) {
      report.failed += 1;
      continue;
    }
    await prisma.newsletterSubscriber.update({
      where: { id: row.id },
      data: { source: MISSING_COMPARE_NOTIFIED_SOURCE },
    });
    report.sent += 1;
    // Resend allows 10 requests/second (see ROO-415).
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return report;
}
