import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getRedis } from "@/lib/services/redis";
import { sendNotificationEmail } from "@/lib/services/email";
import { getPostHogClient, flushPostHog } from "@/lib/posthog-server";
import { MEMBERS_LIST_KEY, revokeMember, upsertMember } from "@/lib/monetization/members";
import { checkoutEventDistinctId } from "@/lib/analytics/checkout-identity";

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
 *
 * PostHog (ROO-41): checkout.session.completed → checkout_completed + purchase
 * ($revenue in major units). customer.subscription.deleted → subscription_canceled.
 *
 * PostHog identity (ROO-40): those captures use the distinct id stored on the
 * Checkout Session (`metadata.posthog_distinct_id`, then `client_reference_id`).
 * The Stripe email is only a fallback so one person owns pricing → purchase.
 *
 * Membership (ROO-42): checkout and subscription create/update upsert Redis
 * hash monetization:member:{email}. subscription.deleted marks that hash
 * canceled (access off). Founder notification emails stay as they were.
 */

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
      id?: string;
      customer_email?: string;
      customer_details?: { email?: string };
      customer?: string;
      subscription?: string;
      amount_total?: number;
      currency?: string;
      client_reference_id?: string;
      metadata?: { plan?: string; interval?: string; src?: string; posthog_distinct_id?: string };
    };
    const email = s.customer_details?.email || s.customer_email || "";
    // The browser id from session create. Do not replace it with the email —
    // that split pricing_viewed (anon) from purchase (email) in funnel 0vnNHD98.
    const distinctId =
      checkoutEventDistinctId({
        posthogDistinctId: s.metadata?.posthog_distinct_id,
        clientReferenceId: s.client_reference_id,
        email,
        fallback: s.customer || "unknown",
      }) || "unknown";
    const record = {
      email: email || "unknown",
      plan: s.metadata?.plan ?? "unknown",
      interval: s.metadata?.interval ?? "unknown",
      src: s.metadata?.src ?? "unknown",
      stripeCustomer: s.customer ?? null,
      stripeSubscription: s.subscription ?? null,
      amountTotal: s.amount_total ?? null,
      currency: s.currency ?? "usd",
      at: new Date().toISOString(),
    };
    // Stripe amount_total is the smallest currency unit (cents). PostHog
    // revenue tiles / funnel `purchase` expect major units via `$revenue`.
    const revenue = (record.amountTotal ?? 0) / 100;

    if (redis) {
      try {
        // Append-only purchase log. Access checks use the hash below, not this list.
        await redis.lpush(MEMBERS_LIST_KEY, JSON.stringify(record));
      } catch {}
      try {
        await upsertMember({
          email: record.email,
          plan: record.plan,
          interval: record.interval,
          stripeCustomer: record.stripeCustomer,
          stripeSubscription: record.stripeSubscription,
          src: record.src,
          status: "active",
          replaceSubscription: true,
        });
      } catch (err) {
        console.error("[membership] checkout upsert failed:", err);
      }
    }
    try {
      await sendNotificationEmail({
        subject: `🎉 PAID: ${record.plan} (${record.interval}) — ${record.email}`,
        type: "monetization",
        message: `New paying member: ${record.email} bought ${record.plan}/${record.interval} for ${revenue.toFixed(2)} ${record.currency.toUpperCase()} (src: ${record.src}). Send the founder welcome email today — onboarding instructions are in MONETIZATION.md Phase 2.`,
      });
    } catch {}
    try {
      // ROO-12 / ROO-31: await flush — serverless freeze was dropping server events
      const ph = getPostHogClient();
      ph.capture({
        distinctId,
        event: "checkout_completed",
        properties: {
          plan: record.plan,
          interval: record.interval,
          src: record.src,
          amount: revenue,
        },
      });
      // ROO-41: keep checkout_completed; also emit `purchase` so dashboard
      // 2116269 / funnel 0vnNHD98 can convert on `$revenue`.
      ph.capture({
        distinctId,
        event: "purchase",
        properties: {
          $revenue: revenue,
          revenue,
          currency: record.currency.toLowerCase(),
          plan: record.plan,
          interval: record.interval,
          src: record.src,
          stripe_session_id: s.id ?? null,
          stripe_customer: record.stripeCustomer,
          stripe_subscription: record.stripeSubscription,
        },
      });
      await flushPostHog();
    } catch (err) {
      console.error("[posthog] checkout_completed/purchase capture failed:", err);
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated"
  ) {
    const s = (event.data?.object ?? {}) as {
      id?: string;
      customer?: string;
      status?: string;
      metadata?: { plan?: string; interval?: string; src?: string; email?: string };
    };
    try {
      await upsertMember({
        email: s.metadata?.email,
        plan: s.metadata?.plan,
        interval: s.metadata?.interval,
        src: s.metadata?.src,
        stripeCustomer: s.customer,
        stripeSubscription: s.id,
        status: s.status || "active",
        replaceSubscription: false,
      });
    } catch (err) {
      console.error("[membership] subscription upsert failed:", err);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const s = (event.data?.object ?? {}) as {
      id?: string;
      customer?: string;
      status?: string;
      canceled_at?: number;
      cancellation_details?: { reason?: string; comment?: string; feedback?: string };
      metadata?: {
        plan?: string;
        interval?: string;
        src?: string;
        email?: string;
        posthog_distinct_id?: string;
      };
    };
    try {
      await revokeMember({
        email: s.metadata?.email,
        stripeCustomer: s.customer,
        stripeSubscription: s.id,
      });
    } catch (err) {
      console.error("[membership] revoke failed:", err);
    }
    // Founder inboxes (sendNotificationEmail) stay on this path. Revoke is
    // the hash update above; the email is still the same-day cancel notice.
    try {
      await sendNotificationEmail({
        subject: `⚠️ Subscription canceled: ${s.id ?? "unknown"}`,
        type: "monetization",
        message: `Stripe subscription ${s.id ?? "?"} (customer ${s.customer ?? "?"}) was canceled. Worth a one-line "what was missing?" email.`,
      });
    } catch {}
    try {
      getPostHogClient().capture({
        distinctId:
          checkoutEventDistinctId({
            posthogDistinctId: s.metadata?.posthog_distinct_id,
            fallback: s.customer || s.id || "unknown",
          }) || "unknown",
        event: "subscription_canceled",
        properties: {
          stripe_subscription: s.id ?? null,
          stripe_customer: s.customer ?? null,
          status: s.status ?? "canceled",
          cancellation_reason: s.cancellation_details?.reason ?? null,
          canceled_at: s.canceled_at ?? null,
          plan: s.metadata?.plan ?? null,
          interval: s.metadata?.interval ?? null,
          src: s.metadata?.src ?? null,
        },
      });
      await flushPostHog();
    } catch (err) {
      console.error("[posthog] subscription_canceled capture failed:", err);
    }
  }

  return NextResponse.json({ received: true });
}
