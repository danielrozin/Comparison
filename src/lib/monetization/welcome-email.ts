/**
 * Buyer welcome / receipt copy (ROO-49).
 *
 * Sent from the Stripe `checkout.session.completed` webhook through the
 * existing Resend path (`sendOutreachEmail`). This file only builds the
 * message so the words can be tested without a mail provider.
 *
 * "What Pro unlocks" is the plan's live `features` list — the same sentences
 * the pricing page shows. Launch-only promises (PDF export, alerts) stay off
 * this email until they actually ship.
 */

import { getPlan } from "@/lib/monetization/plans";
import { SITE_URL } from "@/lib/utils/constants";

export const CUSTOM_COMPARE_PATH = "/custom-compare";
export const BILLING_PORTAL_PATH = "/account/billing";

export interface MemberWelcomeInput {
  planId: string;
  interval: string;
  /** Major currency units (Stripe cents / 100). Omitted when unknown. */
  amountMajor?: number | null;
  currency?: string | null;
  siteUrl?: string;
}

export interface MemberWelcomeMessage {
  subject: string;
  html: string;
  text: string;
  planName: string;
  customCompareUrl: string;
  billingUrl: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function intervalLabel(interval: string): string {
  if (interval === "year") return "yearly";
  if (interval === "month") return "monthly";
  if (!interval || interval === "unknown") return "subscription";
  return interval;
}

export function buildMemberWelcomeEmail(input: MemberWelcomeInput): MemberWelcomeMessage {
  const siteUrl = (input.siteUrl || SITE_URL).replace(/\/+$/, "");
  const plan = getPlan(input.planId) ?? getPlan("pro");
  const planName = getPlan(input.planId)?.name ?? (input.planId && input.planId !== "unknown" ? input.planId : "Pro");
  const features = plan?.features ?? [];
  const cadence = intervalLabel(input.interval);
  const customCompareUrl = `${siteUrl}${CUSTOM_COMPARE_PATH}`;
  const billingUrl = `${siteUrl}${BILLING_PORTAL_PATH}`;

  const amount =
    typeof input.amountMajor === "number" && Number.isFinite(input.amountMajor)
      ? `${input.amountMajor.toFixed(2)} ${(input.currency || "usd").toUpperCase()}`
      : null;

  const subject = `You're in — ${planName} on A Versus B`;
  const featureLines = features.map((feature) => `• ${feature}`);
  const featureHtml = features
    .map((feature) => `<li>${escapeHtml(feature)}</li>`)
    .join("");

  const text = [
    `Welcome to A Versus B ${planName}.`,
    "",
    "Payment received. This email is your receipt and the key to what you just unlocked.",
    "",
    `Plan: ${planName} (${cadence})`,
    amount ? `Charged: ${amount}` : null,
    "Stripe also emails its own card receipt.",
    "",
    "What this unlocks:",
    ...featureLines,
    "",
    `Request a custom comparison (2 per month, published within 24 hours): ${customCompareUrl}`,
    "Use the same email you paid with. Free visitors are sent to pricing instead.",
    "",
    `Manage billing (update card or cancel): ${billingUrl}`,
    "Canceling turns custom comparisons off the same day.",
    "",
    "Questions? Reply to this email — a founder answers.",
    "",
    "Daniel & Shai",
    siteUrl,
  ]
    .filter((line): line is string => line != null)
    .join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#0f172a;line-height:1.6">
      <p style="font-size:16px"><strong>Welcome to A Versus B ${escapeHtml(planName)}.</strong></p>
      <p>Payment received. This email is your receipt and the key to what you just unlocked.</p>
      <p style="margin:20px 0;padding:16px 18px;background:#f8fafc;border-radius:8px">
        <strong>Plan:</strong> ${escapeHtml(planName)} (${escapeHtml(cadence)})<br/>
        ${amount ? `<strong>Charged:</strong> ${escapeHtml(amount)}<br/>` : ""}
        Stripe also emails its own card receipt.
      </p>
      <p><strong>What this unlocks</strong></p>
      <ul>${featureHtml}</ul>
      <p>
        <a href="${customCompareUrl}" style="color:#2563eb;font-weight:600">Request a custom comparison →</a><br/>
        Two per month, published within 24 hours. Use the same email you paid with.
      </p>
      <p>
        <a href="${billingUrl}" style="color:#2563eb;font-weight:600">Manage billing →</a><br/>
        Update your card or cancel. Canceling turns custom comparisons off the same day.
      </p>
      <p>Questions? Reply to this email — a founder answers.</p>
      <p style="color:#64748b;font-size:13px">Daniel &amp; Shai, founders of <a href="${siteUrl}" style="color:#2563eb">A Versus B</a></p>
    </div>`.trim();

  return { subject, html, text, planName, customCompareUrl, billingUrl };
}
