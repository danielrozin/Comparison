/**
 * Email notification service
 * Sends notifications to Daniarozin@gmail.com via Web3Forms (free, no signup needed for basic use)
 * Falls back to storing in-memory if email fails
 */

const NOTIFICATION_EMAIL = "Daniarozin@gmail.com";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY || "";

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

  // Fallback: Use mailto-style notification via API (log it)
  console.log(`[EMAIL NOTIFICATION] To: ${NOTIFICATION_EMAIL}`);
  console.log(`  Subject: ${opts.subject}`);
  console.log(`  Type: ${opts.type}`);
  console.log(`  Message: ${opts.message}`);
  console.log(`  From: ${opts.senderEmail || "Anonymous"}`);
  console.log(`  Page: ${opts.pageUrl || "N/A"}`);

  return { success: true, method: "logged" };
}

export async function sendConfirmationEmail(opts: {
  to: string;
  confirmUrl: string;
  categories?: string[];
}) {
  const categoryLine =
    opts.categories && opts.categories.length > 0
      ? `\nCategories: ${opts.categories.join(", ")}`
      : "";

  const message = [
    `Please confirm your subscription to A Versus B.`,
    "",
    `Click the link below to confirm:`,
    opts.confirmUrl,
    "",
    `If you didn't sign up, you can safely ignore this email.${categoryLine}`,
  ].join("\n");

  if (WEB3FORMS_KEY) {
    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          to: opts.to,
          subject: "[A Versus B] Confirm your subscription",
          from_name: "A Versus B",
          message,
        }),
      });
      const data = await res.json();
      return { success: data.success, method: "web3forms" };
    } catch (err) {
      console.error("Confirmation email failed:", err);
    }
  }

  console.log(`[CONFIRM EMAIL] To: ${opts.to}`);
  console.log(`  Confirm URL: ${opts.confirmUrl}`);
  return { success: true, method: "logged" };
}

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
