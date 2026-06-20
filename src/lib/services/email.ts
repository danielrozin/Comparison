/**
 * Email notification service
 *
 * Primary transport: Resend (verified + warm domain aversusb.net — same key the
 * weekly-digest cron uses). Resend can send to ANY recipient, so it is correct
 * for admin notifications, subscriber confirmations, and partner key emails.
 *
 * Fallback transport: Web3Forms. NOTE — Web3Forms' API ignores the `to` field and
 * always delivers to the access-key owner's mailbox, so it can only be used as a
 * best-effort fallback for ADMIN notifications (never for external recipients).
 *
 * Historical bug (DAN-1204): the admin-notification path ran on Web3Forms only.
 * With no/invalid key it silently console.log'd and returned success:true, so the
 * founder's mailbox never received a single form/feedback/newsletter notification
 * even though no error was ever raised. Resend is now the primary path and every
 * send is logged with the provider response.
 */

const NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "daniarozin@gmail.com";

// Resend (primary)
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_URL = "https://api.resend.com/emails";
// Notifications come FROM the verified, warm aversusb.net domain.
const RESEND_FROM =
  process.env.RESEND_NOTIFICATION_FROM || "A Versus B <noreply@aversusb.net>";

// Web3Forms (legacy fallback — admin notifications only)
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY || "";

type SendResult = { success: boolean; method: string };

/**
 * Low-level Resend send. Logs the provider response (status + id/error) so that
 * every notification send is observable in serverless logs going forward.
 */
async function sendViaResend(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  context: string; // e.g. "notification:feedback" — for log correlation
}): Promise<SendResult> {
  if (!RESEND_API_KEY) return { success: false, method: "resend_unconfigured" };

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
        ...(opts.html ? { html: opts.html } : {}),
      }),
    });

    let data: { id?: string; message?: string; name?: string } = {};
    try {
      data = await res.json();
    } catch {
      /* non-JSON body */
    }

    if (res.ok) {
      console.log(
        `[EMAIL][resend][ok] ${opts.context} -> ${opts.to} | id=${data.id ?? "?"} status=${res.status}`
      );
      return { success: true, method: "resend" };
    }

    console.error(
      `[EMAIL][resend][fail] ${opts.context} -> ${opts.to} | status=${res.status} error=${data.name ?? ""}:${data.message ?? JSON.stringify(data)}`
    );
    return { success: false, method: "resend_error" };
  } catch (err) {
    console.error(`[EMAIL][resend][throw] ${opts.context} -> ${opts.to} |`, err);
    return { success: false, method: "resend_error" };
  }
}

export async function sendNotificationEmail(opts: {
  subject: string;
  type: string;
  message: string;
  senderEmail?: string;
  pageUrl?: string;
}): Promise<SendResult> {
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

  // 1) Primary: Resend (can deliver to the admin mailbox reliably)
  const resend = await sendViaResend({
    to: NOTIFICATION_EMAIL,
    subject,
    text,
    context,
  });
  if (resend.success) return resend;

  // 2) Fallback: Web3Forms (delivers to the key owner's mailbox only)
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

  // 3) Last resort: log so the submission is at least recoverable from logs.
  console.error(
    `[EMAIL][undelivered] ${context} -> ${NOTIFICATION_EMAIL} | subject="${opts.subject}" message="${opts.message}" from=${opts.senderEmail || "Anonymous"} page=${opts.pageUrl || "N/A"}`
  );
  return { success: false, method: "undelivered" };
}

export async function sendConfirmationEmail(opts: {
  to: string;
  confirmUrl: string;
  categories?: string[];
}): Promise<SendResult> {
  const categoryLine =
    opts.categories && opts.categories.length > 0
      ? `\nCategories: ${opts.categories.join(", ")}`
      : "";

  const text = [
    `Please confirm your subscription to A Versus B.`,
    "",
    `Click the link below to confirm:`,
    opts.confirmUrl,
    "",
    `If you didn't sign up, you can safely ignore this email.${categoryLine}`,
  ].join("\n");

  // External recipient -> Resend only (Web3Forms cannot send to arbitrary addresses).
  const resend = await sendViaResend({
    to: opts.to,
    subject: "[A Versus B] Confirm your subscription",
    text,
    context: "confirmation:newsletter",
  });
  if (resend.success) return resend;

  console.error(
    `[EMAIL][undelivered] confirmation:newsletter -> ${opts.to} | confirmUrl=${opts.confirmUrl}`
  );
  return { success: false, method: "undelivered" };
}

export async function sendPartnerKeyEmail(opts: {
  partnerEmail: string;
  partnerName: string;
  partnerKey: string;
  tier: string;
}): Promise<SendResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";
  const embedSnippet = `<iframe src="${siteUrl}/embed/YOUR-COMPARISON-SLUG?partner=${opts.partnerKey}" width="100%" height="400" frameborder="0" style="border-radius: 12px; border: 1px solid #e2e8f0;"></iframe>`;
  const scriptSnippet = `<script src="${siteUrl}/api/v1/widget?slug=YOUR-COMPARISON-SLUG&partner=${opts.partnerKey}"></script>`;

  const text = [
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
  ].join("\n");

  // External recipient -> Resend only.
  const resend = await sendViaResend({
    to: opts.partnerEmail,
    subject: "[A Versus B] Your Embed Partner Key",
    text,
    context: "partner_key:embed",
  });
  if (resend.success) return resend;

  console.error(
    `[EMAIL][undelivered] partner_key:embed -> ${opts.partnerEmail} | key=${opts.partnerKey} tier=${opts.tier}`
  );
  return { success: false, method: "undelivered" };
}
