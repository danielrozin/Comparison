import { Resend } from "resend";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "newsletter@aversusb.net";

export async function sendConfirmationEmail(
  email: string,
  confirmationToken: string
): Promise<boolean> {
  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${confirmationToken}`;

  if (!resend) {
    console.log(
      `[NEWSLETTER] Resend not configured. Confirmation link for ${email}: ${confirmUrl}`
    );
    return true;
  }

  try {
    await resend.emails.send({
      from: `${SITE_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: `Confirm your subscription to ${SITE_NAME}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #1a1a2e; margin-bottom: 16px;">Confirm your subscription</h2>
          <p style="color: #4a4a68; line-height: 1.6; margin-bottom: 24px;">
            Thanks for signing up for the ${SITE_NAME} newsletter! Click the button below to confirm your email and start receiving weekly comparison picks.
          </p>
          <a href="${confirmUrl}" style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Confirm Subscription
          </a>
          <p style="color: #8888a0; font-size: 13px; margin-top: 32px; line-height: 1.5;">
            If you didn&rsquo;t sign up, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return false;
  }
}

export function generateConfirmationToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
