/**
 * Email service
 *
 * Primary transport: Resend (verified + warm domain aversusb.net — the same key
 * the weekly-digest cron uses). Resend delivers to ANY recipient, so it is the
 * correct transport for admin notifications, transactional, and outreach mail.
 *
 * Fallback transport: Web3Forms. NOTE — Web3Forms' API ignores the `to` field and
 * always delivers to the access-key owner's mailbox, so it is only a best-effort
 * fallback for ADMIN notifications (never for external recipients).
 *
 * Historical bug (DAN-1204): admin notifications ran Web3Forms FIRST and returned
 * its `success` verbatim. Web3Forms accepts the submission (success:true) but the
 * mail lands in the key-owner's mailbox, never the founder's — so Resend was never
 * reached and the founder's inbox got ZERO form/feedback/newsletter notifications
 * for 120 days with no error ever raised. Resend is now the primary path and every
 * send is logged with the provider response.
 */

import { Resend } from "resend";
// Whitespace-hardened base URL (DAN-1033) — the env var has shipped with a
// trailing space; importing the normalized constant keeps embed snippets clean.
import { SITE_URL } from "@/lib/utils/constants";

const NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "daniarozin@gmail.com";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY || "";

// Resend client (lazy-init)
let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL || "A Versus B <noreply@aversusb.net>";

// ─── Outreach email (Resend only) ───────────────────────────────────

export async function sendOutreachEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo || NOTIFICATION_EMAIL,
      tags: opts.tags,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Resend send failed:", msg);
    return { success: false, error: msg };
  }
}

// ─── Batch outreach (up to 100 at a time) ───────────────────────────

export async function sendBatchOutreachEmails(
  emails: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    tags?: { name: string; value: string }[];
  }[]
): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
  const resend = getResend();
  if (!resend) {
    return { success: false, sent: 0, failed: emails.length, errors: ["RESEND_API_KEY not configured"] };
  }

  const batch = emails.map((e) => ({
    from: RESEND_FROM,
    to: e.to,
    subject: e.subject,
    html: e.html,
    text: e.text,
    replyTo: e.replyTo || NOTIFICATION_EMAIL,
    tags: e.tags,
  }));

  try {
    const { data, error } = await resend.batch.send(batch);
    if (error) {
      return { success: false, sent: 0, failed: emails.length, errors: [error.message] };
    }
    return { success: true, sent: data?.data?.length || emails.length, failed: 0, errors: [] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, sent: 0, failed: emails.length, errors: [msg] };
  }
}

// ─── Internal notifications (Resend primary → Web3Forms fallback) ───

export async function sendNotificationEmail(opts: {
  subject: string;
  type: string;
  message: string;
  senderEmail?: string;
  pageUrl?: string;
}): Promise<{ success: boolean; method: string }> {
  const subject = `[A Versus B] ${opts.subject}`;
  const text = [
    `Type: ${opts.type}`,
    "",
    `Message: ${opts.message}`,
    "",
    `From: ${opts.senderEmail || "Anonymous"}`,
    `Page: ${opts.pageUrl || "N/A"}`,
    `Time: ${new Date().toISOString()}`,
  ].join("\n");
  const context = `notification:${opts.type}`;

  // 1) Primary: Resend — reliably delivers to the admin mailbox.
  const resend = getResend();
  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: RESEND_FROM,
        to: NOTIFICATION_EMAIL,
        subject,
        text,
      });
      if (!error) {
        console.log(
          `[EMAIL][resend][ok] ${context} -> ${NOTIFICATION_EMAIL} | id=${data?.id ?? "?"}`
        );
        return { success: true, method: "resend" };
      }
      console.error(
        `[EMAIL][resend][fail] ${context} -> ${NOTIFICATION_EMAIL} | ${error.message}`
      );
    } catch (err) {
      console.error(`[EMAIL][resend][throw] ${context} |`, err);
    }
  }

  // 2) Fallback: Web3Forms — delivers to the key owner's mailbox only (the `to`
  //    field is ignored), so it is a best-effort fallback for admin alerts.
  if (WEB3FORMS_KEY) {
    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: "A Versus B Notifications",
          message: text,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        console.log(`[EMAIL][web3forms][ok] ${context} status=${res.status}`);
        return { success: true, method: "web3forms" };
      }
      console.error(
        `[EMAIL][web3forms][fail] ${context} status=${res.status} body=${JSON.stringify(data)}`
      );
    } catch (err) {
      console.error(`[EMAIL][web3forms][throw] ${context} |`, err);
    }
  }

  // 3) Last resort: log so the submission is recoverable from serverless logs.
  console.error(
    `[EMAIL][undelivered] ${context} -> ${NOTIFICATION_EMAIL} | subject="${opts.subject}" message="${opts.message}" from=${opts.senderEmail || "Anonymous"} page=${opts.pageUrl || "N/A"}`
  );
  return { success: false, method: "undelivered" };
}

// ─── Partner key email ──────────────────────────────────────────────

export async function sendPartnerKeyEmail(opts: {
  partnerEmail: string;
  partnerName: string;
  partnerKey: string;
  tier: string;
}) {
  const siteUrl = SITE_URL;
  const embedSnippet = `<iframe src="${siteUrl}/embed/YOUR-COMPARISON-SLUG?partner=${opts.partnerKey}" width="100%" height="400" frameborder="0" style="border-radius: 12px; border: 1px solid #e2e8f0;"></iframe>`;
  const scriptSnippet = `<script src="${siteUrl}/api/v1/widget?slug=YOUR-COMPARISON-SLUG&partner=${opts.partnerKey}"></script>`;

  const messageLines = [
    `Hi ${opts.partnerName},`,
    "",
    "Welcome to the A Versus B embed partner program!",
    "",
    `Your partner key: ${opts.partnerKey}`,
    `Plan: ${opts.tier.charAt(0).toUpperCase() + opts.tier.slice(1)}`,
    "",
    "Keep this key safe — you'll need it for all embed codes.",
    "",
    "--- Embed Code Snippet ---",
    "",
    "Option 1 — iFrame (recommended):",
    embedSnippet,
    "",
    "Option 2 — Script tag:",
    scriptSnippet,
    "",
    "Replace YOUR-COMPARISON-SLUG with the comparison you want to embed (e.g. react-vs-angular).",
    "",
    "--- Quick Links ---",
    "",
    `Get started: ${siteUrl}/embed/register`,
    `API docs: ${siteUrl}/developers`,
    "",
    "— The A Versus B Team",
  ];

  // Prefer Resend for partner emails
  const resend = getResend();
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: RESEND_FROM,
        to: opts.partnerEmail,
        subject: "[A Versus B] Your Embed Partner Key",
        text: messageLines.join("\n"),
      });
      if (!error) return { success: true, method: "resend" };
      console.error("Resend partner email failed:", error);
    } catch (err) {
      console.error("Resend partner email error:", err);
    }
  }

  // Fallback to Web3Forms
  if (WEB3FORMS_KEY) {
    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          to: opts.partnerEmail,
          subject: "[A Versus B] Your Embed Partner Key",
          from_name: "A Versus B",
          message: messageLines.join("\n"),
        }),
      });
      const data = await res.json();
      return { success: data.success, method: "web3forms" };
    } catch (err) {
      console.error("Partner key email failed:", err);
    }
  }

  // No provider accepted — report honestly (do NOT claim success) so callers and
  // logs reflect that the partner never received their key.
  console.error(
    `[EMAIL][undelivered] partner_key:embed -> ${opts.partnerEmail} | key=${opts.partnerKey} tier=${opts.tier}`
  );

  return { success: false, method: "undelivered" };
}
