/**
 * Email service
 *
 * Two providers:
 * 1. Resend — for outreach / transactional emails (requires RESEND_API_KEY + verified domain)
 * 2. Web3Forms — for internal notifications (lightweight, no domain needed)
 */

import { Resend } from "resend";

const NOTIFICATION_EMAIL = "Daniarozin@gmail.com";
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

// ─── Internal notifications (Web3Forms → Resend fallback) ───────────

export async function sendNotificationEmail(opts: {
  subject: string;
  type: string;
  message: string;
  senderEmail?: string;
  pageUrl?: string;
}) {
  // If Web3Forms key is set, use it
  if (WEB3FORMS_KEY) {
    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          to: NOTIFICATION_EMAIL,
          subject: `[A Versus B] ${opts.subject}`,
          from_name: "A Versus B Notifications",
          message: `Type: ${opts.type}\n\nMessage: ${opts.message}\n\nFrom: ${opts.senderEmail || "Anonymous"}\nPage: ${opts.pageUrl || "N/A"}\nTime: ${new Date().toISOString()}`,
        }),
      });
      const data = await res.json();
      return { success: data.success, method: "web3forms" };
    } catch (err) {
      console.error("Web3Forms email failed:", err);
    }
  }

  // Fallback: try Resend
  const resend = getResend();
  if (resend) {
    try {
      await resend.emails.send({
        from: RESEND_FROM,
        to: NOTIFICATION_EMAIL,
        subject: `[A Versus B] ${opts.subject}`,
        text: `Type: ${opts.type}\n\nMessage: ${opts.message}\n\nFrom: ${opts.senderEmail || "Anonymous"}\nPage: ${opts.pageUrl || "N/A"}\nTime: ${new Date().toISOString()}`,
      });
      return { success: true, method: "resend" };
    } catch (err) {
      console.error("Resend notification failed:", err);
    }
  }

  // Last resort: log it
  console.log(`[EMAIL NOTIFICATION] To: ${NOTIFICATION_EMAIL}`);
  console.log(`  Subject: ${opts.subject}`);
  console.log(`  Type: ${opts.type}`);
  console.log(`  Message: ${opts.message}`);

  return { success: true, method: "logged" };
}

// ─── Partner key email ──────────────────────────────────────────────

export async function sendPartnerKeyEmail(opts: {
  partnerEmail: string;
  partnerName: string;
  partnerKey: string;
  tier: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";
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

  console.log(`[PARTNER EMAIL] To: ${opts.partnerEmail}`);
  console.log(`  Partner: ${opts.partnerName}`);
  console.log(`  Key: ${opts.partnerKey}`);
  console.log(`  Tier: ${opts.tier}`);

  return { success: true, method: "logged" };
}
