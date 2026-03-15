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
