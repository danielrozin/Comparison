import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/utils/constants";
import { getPlan, getInterval, stripeConfigured } from "@/lib/monetization/plans";
import { getRedis } from "@/lib/services/redis";
import { sendNotificationEmail } from "@/lib/services/email";
import { getPostHogClient } from "@/lib/posthog-server";

/**
 * POST /api/checkout — the one conversion endpoint.
 *
 * With Stripe configured (STRIPE_SECRET_KEY + the plan's price env var) it
 * creates a Checkout Session and returns its URL; card details are entered on
 * Stripe's hosted page only — this codebase never sees or stores a card
 * number.
 *
 * Until Stripe is configured it records a founding-member reservation
 * (email + plan, nothing charged, price locked) so the same buttons convert
 * from day one. Flipping to live checkout is purely an env-var change.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Redis keys
const RESERVATIONS_KEY = "monetization:reservations"; // list of JSON records
const RESERVED_EMAILS_KEY = "monetization:reserved-emails"; // set, dedup

export async function POST(request: NextRequest) {
  let body: { plan?: string; interval?: string; email?: string; src?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const plan = getPlan(body.plan ?? "");
  const interval = plan ? getInterval(plan, body.interval ?? "") : undefined;
  if (!plan || !interval) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }
  const src = (body.src ?? "direct").slice(0, 40);

  // ---- Live path: Stripe Checkout ------------------------------------------
  if (stripeConfigured(interval)) {
    try {
      const params = new URLSearchParams({
        mode: "subscription",
        "line_items[0][price]": process.env[interval.stripePriceEnv] as string,
        "line_items[0][quantity]": "1",
        success_url: `${SITE_URL}/pricing/thanks?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE_URL}/pricing?canceled=1`,
        "metadata[plan]": plan.id,
        "metadata[interval]": interval.interval,
        "metadata[src]": src,
        allow_promotion_codes: "true",
      });
      if (body.email && EMAIL_RE.test(body.email)) {
        params.set("customer_email", body.email.trim());
      }
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });
      const session = await res.json();
      if (!res.ok || !session.url) {
        throw new Error(session?.error?.message || `Stripe ${res.status}`);
      }
      try {
        getPostHogClient().capture({
          distinctId: body.email?.trim() || "anonymous",
          event: "checkout_started",
          properties: { plan: plan.id, interval: interval.interval, src },
        });
      } catch {}
      return NextResponse.json({ mode: "stripe", url: session.url });
    } catch (err) {
      return NextResponse.json(
        { error: `Checkout failed: ${err instanceof Error ? err.message : "unknown"}` },
        { status: 502 }
      );
    }
  }

  // ---- Pre-launch path: founding-member reservation ------------------------
  const email = body.email?.trim() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required to reserve the founding price" }, { status: 400 });
  }

  const record = {
    email,
    plan: plan.id,
    interval: interval.interval,
    foundingPrice: interval.foundingPrice,
    src,
    at: new Date().toISOString(),
  };

  const redis = getRedis();
  let duplicate = false;
  if (redis) {
    try {
      const added = await redis.sadd(RESERVED_EMAILS_KEY, `${email}:${plan.id}`);
      duplicate = added === 0;
      if (!duplicate) await redis.lpush(RESERVATIONS_KEY, JSON.stringify(record));
    } catch {
      // reservation still counts — the email below is the durable record
    }
  }

  if (!duplicate) {
    try {
      await sendNotificationEmail({
        subject: `💳 Founding reservation: ${plan.name} (${interval.interval}) — ${email}`,
        type: "monetization",
        message: `${email} reserved ${plan.name} at $${interval.foundingPrice}/${interval.interval} (src: ${src}). Send them the Stripe checkout link when it goes live.`,
        pageUrl: `${SITE_URL}/pricing`,
      });
    } catch {}
    try {
      getPostHogClient().capture({
        distinctId: email,
        event: "reservation_created",
        properties: { plan: plan.id, interval: interval.interval, price: interval.foundingPrice, src },
      });
    } catch {}
  }

  return NextResponse.json({
    mode: "reservation",
    duplicate,
    message: duplicate
      ? "You're already on the founding list — we'll email your checkout link this week."
      : `Founding price locked: $${interval.foundingPrice}/${interval.interval}. Nothing is charged today — your checkout link arrives by email this week.`,
  });
}
