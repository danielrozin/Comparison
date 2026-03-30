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

export async function sendPartnerKeyEmail(opts: {
  partnerEmail: string;
  partnerName: string;
  partnerKey: string;
  tier: string;
}) {
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
          message: [
            `Hi ${opts.partnerName},`,
            "",
            "Welcome to the A Versus B embed partner program!",
            "",
            `Your partner key: ${opts.partnerKey}`,
            `Plan: ${opts.tier.charAt(0).toUpperCase() + opts.tier.slice(1)}`,
            "",
            "Keep this key safe — you'll need it for all embed codes.",
            "",
            "Get started: https://aversusb.net/embed/register",
            "API docs: https://aversusb.net/developers",
            "",
            "— The A Versus B Team",
          ].join("\n"),
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
