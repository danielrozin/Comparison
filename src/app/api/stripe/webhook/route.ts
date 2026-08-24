import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getRedis } from "@/lib/services/redis";
import { sendNotificationEmail } from "@/lib/services/email";
import { getPostHogClient } from "@/lib/posthog-server";

/**
 * POST /api/stripe/webhook — Phase 2 of MONETIZATION.md.
 *
 * Inert until STRIPE_WEBHOOK_SECRET is set (returns 503 so Stripe retries
 * nothing before launch). Once live it verifies the signature manually (no
 * SDK dependency, same as /api/checkout), records the subscription in Redis
 * and notifies Info@ so the founder can onboard the customer the same day.
 *
 * Deliberately does NOT auto-email the customer yet: the welcome email is a
 * founder-signed onboarding message during launch week, which converts a
 * buyer into a user far better than a template. Automate it in Phase 3.
 */

const MEMBERS_KEY = "monetization:members"; // list of JSON records
const EVENTS_SEEN_KEY = "monetization:stripe-events"; // set, idempotency

function verifyStripeSignature(payload: string, header: string, secret: string): boolean {
  // Stripe-Signature: t=<ts>,v1=<hmac>[,v1=...]
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=", 2) as [string, string])
  );
  const t = parts["t"];
  if (!t) return false;
  // tolerate 5 minutes of clock drift / retry delay
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .some((kv) => {
      const sig = kv.slice(3);
      return (
        sig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))
      );
    });
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";
  if (!verifyStripeSignature(payload, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { id?: string; type?: string; data?: { object?: Record<string, unknown> } };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (!event.id || !event.type) {
    return NextResponse.json({ error: "Malformed event" }, { status: 400 });
  }

  // Idempotency — Stripe retries; process each event once.
  const redis = getRedis();
  if (redis) {
    try {
      const first = await redis.sadd(EVENTS_SEEN_KEY, event.id);
      if (first === 0) return NextResponse.json({ received: true, duplicate: true });
    } catch {}
  }

  if (event.type === "checkout.session.completed") {
    const s = (event.data?.object ?? {}) as {
      customer_email?: string;
      customer_details?: { email?: string };
      customer?: string;
      subscription?: string;
      amount_total?: number;
      currency?: string;
      metadata?: { plan?: string; interval?: string; src?: string };
    };
    const email = s.customer_details?.email || s.customer_email || "unknown";
    const record = {
      email,
      plan: s.metadata?.plan ?? "unknown",
      interval: s.metadata?.interval ?? "unknown",
      src: s.metadata?.src ?? "unknown",
      stripeCustomer: s.customer ?? null,
      stripeSubscription: s.subscription ?? null,
      amountTotal: s.amount_total ?? null,
      currency: s.currency ?? "usd",
      at: new Date().toISOString(),
    };

    if (redis) {
      try {
        await redis.lpush(MEMBERS_KEY, JSON.stringify(record));
      } catch {}
    }
    try {
      await sendNotificationEmail({
        subject: `🎉 PAID: ${record.plan} (${record.interval}) — ${email}`,
        type: "monetization",
        message: `New paying member: ${email} bought ${record.plan}/${record.interval} for ${((record.amountTotal ?? 0) / 100).toFixed(2)} ${record.currency.toUpperCase()} (src: ${record.src}). Send the founder welcome email today — onboarding instructions are in MONETIZATION.md Phase 2.`,
      });
    } catch {}
    try {
      getPostHogClient().capture({
        distinctId: email,
        event: "checkout_completed",
        properties: {
          plan: record.plan,
          interval: record.interval,
          src: record.src,
          amount: (record.amountTotal ?? 0) / 100,
        },
      });
    } catch {}
  }

  if (event.type === "customer.subscription.deleted") {
    const s = (event.data?.object ?? {}) as { id?: string; customer?: string };
    try {
      await sendNotificationEmail({
        subject: `⚠️ Subscription canceled: ${s.id ?? "unknown"}`,
        type: "monetization",
        message: `Stripe subscription ${s.id ?? "?"} (customer ${s.customer ?? "?"}) was canceled. Worth a one-line "what was missing?" email.`,
      });
    } catch {}
  }

  return NextResponse.json({ received: true });
}
