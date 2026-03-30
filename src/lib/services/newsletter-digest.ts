/**
 * Newsletter Digest Service
 * Builds and sends weekly digest emails to active subscribers.
 * Uses Resend API when RESEND_API_KEY is set; otherwise logs to console.
 */

import { getPrisma } from "@/lib/db/prisma";
import { getTrendingComparisons } from "./comparison-service";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "A Versus B <digest@aversusb.net>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";

interface DigestComparison {
  title: string;
  slug: string;
  category: string | null;
  entityA: string;
  entityB: string;
}

export async function getActiveSubscribers(): Promise<{ email: string }[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  return prisma.newsletterSubscriber.findMany({
    where: { status: "active" },
    select: { email: true },
  });
}

export async function getDigestContent(): Promise<DigestComparison[]> {
  const trending = await getTrendingComparisons(10);
  return trending.map((c) => {
    // Parse entity names from title (format: "Entity A vs Entity B")
    const parts = c.title.split(/\s+vs\s+/i);
    return {
      title: c.title,
      slug: c.slug,
      category: c.category,
      entityA: parts[0]?.trim() || "",
      entityB: parts[1]?.trim() || "",
    };
  });
}

export function buildDigestHtml(comparisons: DigestComparison[]): string {
  const weekOf = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const comparisonRows = comparisons
    .map(
      (c) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
          <a href="${SITE_URL}/compare/${c.slug}?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_digest" style="color: #4f46e5; text-decoration: none; font-weight: 600; font-size: 16px;">
            ${c.title}
          </a>
          ${c.category ? `<span style="display: inline-block; margin-left: 8px; padding: 2px 8px; background: #f3f4f6; color: #6b7280; border-radius: 12px; font-size: 11px; text-transform: uppercase;">${c.category}</span>` : ""}
          <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">
            See how ${c.entityA} stacks up against ${c.entityB}
          </p>
        </td>
      </tr>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Digest - A Versus B</title>
</head>
<body style="margin: 0; padding: 0; background: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">A Versus B</h1>
              <p style="margin: 8px 0 0; color: #c7d2fe; font-size: 14px;">Weekly Digest &mdash; ${weekOf}</p>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 24px 32px 8px;">
              <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">
                Here are this week&rsquo;s most popular comparisons. See what everyone is researching and make better decisions.
              </p>
            </td>
          </tr>

          <!-- Trending Comparisons -->
          <tr>
            <td style="padding: 16px 32px;">
              <h2 style="margin: 0 0 12px; color: #111827; font-size: 18px; font-weight: 600;">Trending Comparisons</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${comparisonRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 24px 32px; text-align: center;">
              <a href="${SITE_URL}/trending?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_digest" style="display: inline-block; padding: 12px 32px; background: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 14px;">
                See All Trending
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                You&rsquo;re receiving this because you subscribed to A Versus B updates.<br>
                <a href="${SITE_URL}/api/newsletter/unsubscribe?email={{email}}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}" style="color: #6b7280; text-decoration: underline;">Visit Website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendDigestEmail(
  to: string,
  html: string
): Promise<{ success: boolean; method: string }> {
  // Replace {{email}} placeholder with actual recipient
  const personalizedHtml = html.replace(/\{\{email\}\}/g, encodeURIComponent(to));

  if (RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to,
          subject: "Your Weekly Comparison Digest - A Versus B",
          html: personalizedHtml,
        }),
      });
      const data = await res.json();
      return { success: res.ok, method: "resend" };
    } catch (err) {
      console.error("Resend send failed:", err);
      return { success: false, method: "resend_error" };
    }
  }

  // Fallback: log to console
  console.log(`[DIGEST] Would send weekly digest to: ${to}`);
  return { success: true, method: "logged" };
}

export async function sendWeeklyDigest(): Promise<{
  subscriberCount: number;
  sentCount: number;
  failedCount: number;
  method: string;
}> {
  const subscribers = await getActiveSubscribers();
  const content = await getDigestContent();

  if (content.length === 0) {
    return { subscriberCount: subscribers.length, sentCount: 0, failedCount: 0, method: "skipped_no_content" };
  }

  const html = buildDigestHtml(content);

  let sentCount = 0;
  let failedCount = 0;
  let method = "none";

  for (const sub of subscribers) {
    const result = await sendDigestEmail(sub.email, html);
    method = result.method;
    if (result.success) {
      sentCount++;
    } else {
      failedCount++;
    }
  }

  return { subscriberCount: subscribers.length, sentCount, failedCount, method };
}
