import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getRedis } from "@/lib/services/redis";
import { getPrisma } from "@/lib/db/prisma";
import { sendMemberWelcomeEmail, sendNotificationEmail } from "@/lib/services/email";
import { getPostHogClient, flushPostHog } from "@/lib/posthog-server";
import { MEMBERS_LIST_KEY, normalizeMemberEmail, revokeMember, upsertMember, type MemberUpsert } from "@/lib/monetization/members";
import { claimStripeEvent } from "@/lib/monetization/stripe-events";
import { MembershipStoreError } from "@/lib/monetization/prisma-errors";
import { checkoutEventDistinctId } from "@/lib/analytics/checkout-identity";

/**
 * POST /api/stripe/webhook — Phase 2 of MONETIZATION.md.
 *
 * Inert until STRIPE_WEBHOOK_SECRET is set (returns 503 so Stripe retries
 * nothing before launch). Once live it verifies the signature manually (no
 * SDK dependency, same as /api/checkout), records the subscription in Redis
 * and notifies Info@ so the founder can onboard the customer the same day.
 *
 * On checkout.session.completed the buyer gets a Resend welcome / receipt
 * (plan, manage-billing link, what that plan unlocks) when the email is real.
 * Founder alerts still go through sendNotificationEmail, which fans out to
 * every address in ADMIN_NOTIFICATION_EMAIL.
 *
 * PostHog (ROO-41): checkout.session.completed → checkout_completed + purchase
 * ($revenue in major units). customer.subscription.deleted → subscription_canceled.
 *
 * PostHog identity (ROO-40): those captures use the distinct id stored on the
 * Checkout Session (`metadata.posthog_distinct_id`, then `client_reference_id`).
 * The Stripe email is only a fallback so one person owns pricing → purchase.
 *
 * Membership: checkout and subscription create/update upsert the Postgres
 * `pro_members` row. subscription.deleted sets that row to canceled.
 * Redis, when configured, only mirrors the row. If the membership write
 * fails the route returns 500 so Stripe retries, and the welcome email
 * for that attempt is not sent. Founder alerts still go out, with a
 * warning line when the row was not saved. Emails are sent only after
 * the event id is claimed, so a retry does not send them again.
 */

const MEMBERSHIP_NOT_RECORDED =
  "WARNING: membership was NOT recorded in Postgres. Stripe will retry this event. Do not treat this customer as Pro until a later alert omits this warning.";

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

  const redis = getRedis();

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

    let saved = false;
    try {
      requireMembershipDatabase();
      saved = await upsertMember({
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
      await notifyMembershipFailure(
        `⚠️ PAID but NOT SAVED: ${record.plan} (${record.interval}) — ${record.email}`,
        `New paying member: ${record.email} bought ${record.plan}/${record.interval} for ${revenue.toFixed(2)} ${record.currency.toUpperCase()} (src: ${record.src}). ${MEMBERSHIP_NOT_RECORDED} ${errorText(err)}`
      );
      return NextResponse.json({ error: "Membership persist failed" }, { status: 500 });
    }

    const duplicate = await acknowledgeEvent(event.id, event.type);
    if (duplicate) return duplicate;

    if (redis) {
      try {
        // Append-only purchase log. Access checks use pro_members, not this list.
        await redis.lpush(MEMBERS_LIST_KEY, JSON.stringify(record));
      } catch {}
    }

    const welcomeTo = saved ? normalizeMemberEmail(email) : null;
    let welcomeNote = saved
      ? "Welcome email: skipped (no buyer email on the Checkout Session)."
      : MEMBERSHIP_NOT_RECORDED;
    if (welcomeTo) {
      try {
        const welcome = await sendMemberWelcomeEmail({
          to: welcomeTo,
          planId: record.plan,
          interval: record.interval,
          amountMajor: revenue,
          currency: record.currency,
        });
        welcomeNote = welcome.success
          ? `Welcome email: sent to ${welcomeTo} via ${welcome.method}.`
          : `Welcome email: NOT sent to ${welcomeTo} (${welcome.error || welcome.method}). Check RESEND_API_KEY and RESEND_FROM_EMAIL.`;
      } catch (err) {
        console.error("[email] member welcome failed:", err);
        welcomeNote = `Welcome email: NOT sent to ${welcomeTo} (threw). Check RESEND_API_KEY and RESEND_FROM_EMAIL.`;
      }
    }
    const recordedNote = saved ? "" : ` ${MEMBERSHIP_NOT_RECORDED}`;
    try {
      await sendNotificationEmail({
        subject: `🎉 PAID: ${record.plan} (${record.interval}) — ${record.email}`,
        type: "monetization",
        message: `New paying member: ${record.email} bought ${record.plan}/${record.interval} for ${revenue.toFixed(2)} ${record.currency.toUpperCase()} (src: ${record.src}). ${welcomeNote}${recordedNote}`,
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
    return NextResponse.json({ received: true });
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
      await saveSubscriptionMember({
        email: s.metadata?.email,
        plan: s.metadata?.plan,
        interval: s.metadata?.interval,
        src: s.metadata?.src,
        stripeCustomer: s.customer,
        stripeSubscription: s.id,
        status: s.status || "active",
        currentPeriodEnd: periodEndFromUnix(
          (event.data?.object as { current_period_end?: unknown } | undefined)?.current_period_end
        ),
        replaceSubscription: false,
      });
    } catch (err) {
      console.error("[membership] subscription upsert failed:", err);
      await notifyMembershipFailure(
        `⚠️ Subscription not saved: ${s.id ?? "unknown"}`,
        `Stripe subscription ${s.id ?? "?"} (customer ${s.customer ?? "?"}) could not be written to pro_members. ${MEMBERSHIP_NOT_RECORDED} ${errorText(err)}`
      );
      return NextResponse.json({ error: "Membership persist failed" }, { status: 500 });
    }
    const duplicate = await acknowledgeEvent(event.id, event.type);
    if (duplicate) return duplicate;
    return NextResponse.json({ received: true });
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
    let memberEmail = s.metadata?.email ?? null;
    let accessOff = false;
    try {
      requireMembershipDatabase();
      const revoked = await revokeMember({
        email: s.metadata?.email,
        stripeCustomer: s.customer,
        stripeSubscription: s.id,
      });
      memberEmail = revoked.email ?? memberEmail;
      accessOff = revoked.revoked;
    } catch (err) {
      console.error("[membership] revoke failed:", err);
      await notifyMembershipFailure(
        `⚠️ Subscription canceled but NOT SAVED: ${s.id ?? "unknown"}`,
        `Stripe subscription ${s.id ?? "?"} (customer ${s.customer ?? "?"}, member ${memberEmail || "unknown"}) was canceled, but the pro_members row was not updated. ${MEMBERSHIP_NOT_RECORDED} ${errorText(err)}`
      );
      return NextResponse.json({ error: "Membership persist failed" }, { status: 500 });
    }
    const duplicate = await acknowledgeEvent(event.id, event.type);
    if (duplicate) return duplicate;
    // Founder inboxes (sendNotificationEmail) stay on this path. Revoke is
    // the pro_members update above; the email is still the same-day cancel notice.
    // sendNotificationEmail delivers to every ADMIN_NOTIFICATION_EMAIL.
    try {
      await sendNotificationEmail({
        subject: `⚠️ Subscription canceled: ${s.id ?? "unknown"}`,
        type: "monetization",
        message: accessOff
          ? `Stripe subscription ${s.id ?? "?"} (customer ${s.customer ?? "?"}, member ${memberEmail || "unknown"}) was canceled. Access is off on pro_members. Worth a one-line "what was missing?" email.`
          : `Stripe subscription ${s.id ?? "?"} (customer ${s.customer ?? "?"}, member ${memberEmail || "unknown"}) was canceled in Stripe. The stored pro_members subscription did not match, so access was left unchanged.`,
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
    return NextResponse.json({ received: true });
  }

  // Events we do not act on are still claimed so a retry is a no-op.
  const duplicate = await acknowledgeEvent(event.id, event.type);
  if (duplicate) return duplicate;

  return NextResponse.json({ received: true });
}

function requireMembershipDatabase(): void {
  if (!getPrisma()) throw new MembershipStoreError();
}

function periodEndFromUnix(value: unknown): Date | null | undefined {
  if (value == null || value === "") return undefined;
  const seconds = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
  return new Date(seconds * 1000);
}

async function saveSubscriptionMember(input: MemberUpsert): Promise<boolean> {
  requireMembershipDatabase();
  return upsertMember(input);
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : "unknown error";
}

async function notifyMembershipFailure(subject: string, message: string): Promise<void> {
  try {
    await sendNotificationEmail({ subject, type: "monetization", message });
  } catch (err) {
    console.error("[membership] failure alert failed:", err);
  }
}

/** null when this delivery owns the event. A response when it must stop. */
async function acknowledgeEvent(eventId: string, type: string): Promise<NextResponse | null> {
  try {
    const claim = await claimStripeEvent(eventId, type);
    if (claim === "duplicate") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    return null;
  } catch (err) {
    console.error("[membership] event claim failed:", err);
    return NextResponse.json({ error: "Membership persist failed" }, { status: 500 });
  }
}
