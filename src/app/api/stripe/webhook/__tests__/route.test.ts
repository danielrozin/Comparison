/**
 * ROO-41 — Stripe webhook emits purchase ($revenue) and subscription_canceled.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { lookupMember } from "@/lib/monetization/members";
import {
  membershipTestEvents,
  resetMembershipTestDb,
  setMembershipDbFailWrites,
} from "@/lib/monetization/__tests__/in-memory-membership-db";

const capture = vi.fn();
const flushPostHog = vi.fn().mockResolvedValue(undefined);
const sendNotificationEmail = vi.fn().mockResolvedValue(undefined);
const sendMemberWelcomeEmail = vi.fn().mockResolvedValue({ success: true, method: "resend" });

type Hash = Record<string, string>;

const redisState = vi.hoisted(() => {
  const hashes = new Map<string, Hash>();
  const strings = new Map<string, string>();
  const lists = new Map<string, string[]>();
  const sets = new Map<string, Set<string>>();
  const api = {
    hashes,
    strings,
    lists,
    sets,
    enabled: true,
    reset() {
      hashes.clear();
      strings.clear();
      lists.clear();
      sets.clear();
      api.enabled = true;
    },
    async sadd(key: string, member: string) {
      let set = sets.get(key);
      if (!set) {
        set = new Set();
        sets.set(key, set);
      }
      const sizeBefore = set.size;
      set.add(member);
      return set.size > sizeBefore ? 1 : 0;
    },
    async lpush(key: string, value: string) {
      const list = lists.get(key) ?? [];
      list.unshift(value);
      lists.set(key, list);
      return list.length;
    },
    async hset(key: string, fields: Hash) {
      const current = hashes.get(key) ?? {};
      Object.assign(current, fields);
      hashes.set(key, current);
      return Object.keys(fields).length;
    },
    async hgetall(key: string) {
      const current = hashes.get(key);
      return current ? { ...current } : null;
    },
    async get(key: string) {
      return strings.get(key) ?? null;
    },
    async set(key: string, value: string) {
      strings.set(key, value);
      return "OK";
    },
  };
  return api;
});

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => (redisState.enabled ? redisState : null),
}));

vi.mock("@/lib/db/prisma", async () => {
  const db = await import("@/lib/monetization/__tests__/in-memory-membership-db");
  return { getPrisma: () => db.getMembershipTestPrisma() };
});

vi.mock("@/lib/services/email", () => ({
  sendNotificationEmail: (...args: unknown[]) => sendNotificationEmail(...args),
  sendMemberWelcomeEmail: (...args: unknown[]) => sendMemberWelcomeEmail(...args),
}));

vi.mock("@/lib/posthog-server", () => ({
  getPostHogClient: () => ({ capture }),
  flushPostHog: () => flushPostHog(),
}));

function sign(payload: string, secret: string) {
  const t = Math.floor(Date.now() / 1000);
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return `t=${t},v1=${expected}`;
}

async function postWebhook(payload: string, secret: string) {
  const { POST } = await import("../route");
  const req = new NextRequest("https://aversusb.net/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": sign(payload, secret) },
    body: payload,
  });
  return POST(req);
}

describe("POST /api/stripe/webhook (ROO-41)", () => {
  const secret = "whsec_test_roo41";
  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;

  beforeEach(() => {
    process.env.STRIPE_WEBHOOK_SECRET = secret;
    capture.mockClear();
    flushPostHog.mockClear();
    sendNotificationEmail.mockClear();
    sendNotificationEmail.mockResolvedValue(undefined);
    sendMemberWelcomeEmail.mockClear();
    sendMemberWelcomeEmail.mockResolvedValue({ success: true, method: "resend" });
    redisState.reset();
    resetMembershipTestDb();
  });

  afterEach(() => {
    if (previousSecret === undefined) {
      delete process.env.STRIPE_WEBHOOK_SECRET;
    } else {
      process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
    }
    vi.unstubAllGlobals();
  });

  it("keeps checkout_completed and also captures purchase with $revenue", async () => {
    const payload = JSON.stringify({
      id: "evt_completed_1",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          customer_details: { email: "buyer@example.com" },
          customer: "cus_abc",
          subscription: "sub_xyz",
          amount_total: 4900,
          currency: "USD",
          metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);

    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "buyer@example.com",
        event: "checkout_completed",
        properties: expect.objectContaining({
          plan: "pro",
          interval: "year",
          src: "header",
          amount: 49,
        }),
      }),
    );

    expect(capture).toHaveBeenCalledWith({
      distinctId: "buyer@example.com",
      event: "purchase",
      properties: {
        $revenue: 49,
        revenue: 49,
        currency: "usd",
        plan: "pro",
        interval: "year",
        src: "header",
        stripe_session_id: "cs_test_123",
        stripe_customer: "cus_abc",
        stripe_subscription: "sub_xyz",
      },
    });

    expect(flushPostHog).toHaveBeenCalled();
    expect(sendNotificationEmail).toHaveBeenCalled();
    expect(sendMemberWelcomeEmail).toHaveBeenCalledWith({
      to: "buyer@example.com",
      planId: "pro",
      interval: "year",
      amountMajor: 49,
      currency: "USD",
    });
  });

  it("captures purchase on the Checkout Session distinct id, not the Stripe email", async () => {
    const payload = JSON.stringify({
      id: "evt_completed_stitch",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_stitch",
          client_reference_id: "ph_anon_019",
          customer_details: { email: "buyer@example.com" },
          customer: "cus_abc",
          subscription: "sub_xyz",
          amount_total: 4900,
          currency: "usd",
          metadata: {
            app: "aversusb",
            plan: "pro",
            interval: "year",
            src: "header",
            posthog_distinct_id: "ph_anon_019",
          },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);

    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "ph_anon_019",
        event: "checkout_completed",
      }),
    );
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "ph_anon_019",
        event: "purchase",
        properties: expect.objectContaining({ $revenue: 49 }),
      }),
    );
    expect(capture).not.toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "buyer@example.com",
        event: "purchase",
      }),
    );
  });

  it("uses client_reference_id when metadata has no posthog distinct id", async () => {
    const payload = JSON.stringify({
      id: "evt_completed_ref_only",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_ref",
          client_reference_id: "ph_from_reference",
          customer_details: { email: "buyer@example.com" },
          customer: "cus_abc",
          amount_total: 900,
          currency: "usd",
          metadata: { app: "aversusb", plan: "pro", interval: "month", src: "header" },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "ph_from_reference",
        event: "purchase",
      }),
    );
  });

  it("falls back to Stripe customer id when email is missing", async () => {
    const payload = JSON.stringify({
      id: "evt_completed_2",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_no_email",
          customer: "cus_fallback",
          amount_total: 900,
          currency: "usd",
          metadata: { app: "aversusb", plan: "pro", interval: "month", src: "header" },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "cus_fallback",
        event: "purchase",
        properties: expect.objectContaining({ $revenue: 9, revenue: 9 }),
      }),
    );
    expect(sendMemberWelcomeEmail).not.toHaveBeenCalled();
  });

  it("captures subscription_canceled and still emails Info@", async () => {
    const payload = JSON.stringify({
      id: "evt_deleted_1",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_canceled",
          customer: "cus_gone",
          status: "canceled",
          canceled_at: 1_700_000_000,
          cancellation_details: { reason: "cancellation_requested" },
          metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);

    expect(sendNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("sub_canceled"),
      }),
    );
    expect(capture).toHaveBeenCalledWith({
      distinctId: "cus_gone",
      event: "subscription_canceled",
      properties: {
        stripe_subscription: "sub_canceled",
        stripe_customer: "cus_gone",
        status: "canceled",
        cancellation_reason: "cancellation_requested",
        canceled_at: 1_700_000_000,
        plan: "pro",
        interval: "year",
        src: "header",
      },
    });
    expect(flushPostHog).toHaveBeenCalled();
  });

  it("captures subscription_canceled on the session distinct id when metadata has one", async () => {
    const payload = JSON.stringify({
      id: "evt_deleted_stitch",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_canceled_stitch",
          customer: "cus_gone",
          status: "canceled",
          metadata: {
            app: "aversusb",
            plan: "pro",
            interval: "year",
            src: "header",
            posthog_distinct_id: "ph_anon_019",
          },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "ph_anon_019",
        event: "subscription_canceled",
      }),
    );
  });

  it("upserts the member hash on checkout and still LPUSHes the purchase list", async () => {
    const payload = JSON.stringify({
      id: "evt_completed_hash",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_hash",
          customer_details: { email: "Buyer@Example.com" },
          customer: "cus_hash",
          subscription: "sub_hash",
          amount_total: 4900,
          currency: "usd",
          metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);

    expect(redisState.hashes.get("monetization:member:buyer@example.com")).toMatchObject({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_hash",
      stripeSubscription: "sub_hash",
      status: "active",
      active: "1",
      src: "header",
    });
    expect(redisState.strings.get("monetization:member-by-subscription:sub_hash")).toBe(
      "buyer@example.com",
    );
    const purchaseLog = redisState.lists.get("monetization:members") ?? [];
    expect(purchaseLog).toHaveLength(1);
    // The list keeps the email Stripe sent. The hash key is the normalized one.
    expect(purchaseLog[0]).toContain("Buyer@Example.com");
    expect(sendNotificationEmail).toHaveBeenCalled();
  });

  it("updates the same hash on subscription.updated when the sub id matches", async () => {
    await postWebhook(
      JSON.stringify({
        id: "evt_completed_before_update",
        type: "checkout.session.completed",
        data: {
          object: {
            customer_details: { email: "buyer@example.com" },
            customer: "cus_hash",
            subscription: "sub_hash",
            amount_total: 900,
            currency: "usd",
            metadata: { app: "aversusb", plan: "pro", interval: "month", src: "pricing" },
          },
        },
      }),
      secret,
    );

    const res = await postWebhook(
      JSON.stringify({
        id: "evt_sub_updated",
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_hash",
            customer: "cus_hash",
            status: "past_due",
            metadata: { app: "aversusb", plan: "pro", interval: "month" },
          },
        },
      }),
      secret,
    );
    expect(res.status).toBe(200);

    const hash = redisState.hashes.get("monetization:member:buyer@example.com");
    expect(hash?.status).toBe("past_due");
    expect(hash?.active).toBe("0");
    expect(hash?.plan).toBe("pro");
  });

  it("revokes the member hash on subscription.deleted and still emails founders", async () => {
    await postWebhook(
      JSON.stringify({
        id: "evt_completed_before_delete",
        type: "checkout.session.completed",
        data: {
          object: {
            customer_details: { email: "buyer@example.com" },
            customer: "cus_hash",
            subscription: "sub_hash",
            amount_total: 4900,
            currency: "usd",
            metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
          },
        },
      }),
      secret,
    );
    sendNotificationEmail.mockClear();

    const res = await postWebhook(
      JSON.stringify({
        id: "evt_deleted_hash",
        type: "customer.subscription.deleted",
        data: {
          object: {
            id: "sub_hash",
            customer: "cus_hash",
            status: "canceled",
            metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
          },
        },
      }),
      secret,
    );
    expect(res.status).toBe(200);

    const hash = redisState.hashes.get("monetization:member:buyer@example.com");
    expect(hash).toMatchObject({
      plan: "pro",
      interval: "year",
      status: "canceled",
      active: "0",
      stripeSubscription: "sub_hash",
    });
    expect(sendNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining("sub_hash"),
      }),
    );
  });

  it("grants, updates, and revokes access in Postgres when Redis is not configured", async () => {
    redisState.enabled = false;

    const completed = await postWebhook(
      JSON.stringify({
        id: "evt_pg_completed",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_pg",
            customer_details: { email: "Buyer@Example.com" },
            customer: "cus_pg",
            subscription: "sub_pg",
            amount_total: 4900,
            currency: "usd",
            metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
          },
        },
      }),
      secret,
    );
    expect(completed.status).toBe(200);
    const granted = await lookupMember("buyer@example.com");
    expect(granted).toMatchObject({
      available: true,
      member: expect.objectContaining({
        active: true,
        plan: "pro",
        status: "active",
        stripeCustomer: "cus_pg",
        stripeSubscription: "sub_pg",
      }),
    });

    const updated = await postWebhook(
      JSON.stringify({
        id: "evt_pg_updated",
        type: "customer.subscription.updated",
        data: {
          object: {
            id: "sub_pg",
            customer: "cus_pg",
            status: "past_due",
            metadata: { app: "aversusb", plan: "pro", interval: "year" },
          },
        },
      }),
      secret,
    );
    expect(updated.status).toBe(200);
    const pastDue = await lookupMember("buyer@example.com");
    expect(pastDue.available && pastDue.member).toMatchObject({
      status: "past_due",
      active: false,
      plan: "pro",
    });

    const deleted = await postWebhook(
      JSON.stringify({
        id: "evt_pg_deleted",
        type: "customer.subscription.deleted",
        data: {
          object: {
            id: "sub_pg",
            customer: "cus_pg",
            status: "canceled",
            metadata: { app: "aversusb", plan: "pro", interval: "year" },
          },
        },
      }),
      secret,
    );
    expect(deleted.status).toBe(200);
    const revoked = await lookupMember("buyer@example.com");
    expect(revoked.available && revoked.member).toMatchObject({
      status: "canceled",
      active: false,
      plan: "pro",
    });
    expect(redisState.hashes.size).toBe(0);
  });

  it("sends the welcome and founder alert once when Stripe retries the same event", async () => {
    const payload = JSON.stringify({
      id: "evt_retry_once",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_retry",
          customer_details: { email: "buyer@example.com" },
          customer: "cus_retry",
          subscription: "sub_retry",
          amount_total: 900,
          currency: "usd",
          metadata: { app: "aversusb", plan: "pro", interval: "month", src: "pricing" },
        },
      },
    });

    const first = await postWebhook(payload, secret);
    const second = await postWebhook(payload, secret);
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({ received: true, duplicate: true });
    expect(sendMemberWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(sendNotificationEmail).toHaveBeenCalledTimes(1);
    expect(membershipTestEvents()).toHaveLength(1);
  });

  it("returns 500 and skips the welcome email when the membership write fails", async () => {
    setMembershipDbFailWrites(true);
    const payload = JSON.stringify({
      id: "evt_persist_fail",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_fail",
          customer_details: { email: "buyer@example.com" },
          customer: "cus_fail",
          subscription: "sub_fail",
          amount_total: 4900,
          currency: "usd",
          metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
        },
      },
    });

    const failed = await postWebhook(payload, secret);
    expect(failed.status).toBe(500);
    expect(sendMemberWelcomeEmail).not.toHaveBeenCalled();
    expect(sendNotificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("WARNING: membership was NOT recorded in Postgres"),
      }),
    );
    expect(membershipTestEvents()).toHaveLength(0);
    const missing = await lookupMember("buyer@example.com");
    expect(missing).toEqual({ available: true, member: null });

    setMembershipDbFailWrites(false);
    sendNotificationEmail.mockClear();
    const retried = await postWebhook(payload, secret);
    expect(retried.status).toBe(200);
    expect(sendMemberWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(sendNotificationEmail).toHaveBeenCalledTimes(1);
    const granted = await lookupMember("buyer@example.com");
    expect(granted.available && granted.member?.active).toBe(true);
  });

  it("does not say Stripe will retry when checkout has no buyer email", async () => {
    const payload = JSON.stringify({
      id: "evt_no_email",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_no_email",
          customer: "cus_no_email",
          subscription: "sub_no_email",
          amount_total: 4900,
          currency: "usd",
          metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);
    expect(sendMemberWelcomeEmail).not.toHaveBeenCalled();
    const message = String(sendNotificationEmail.mock.calls[0]?.[0]?.message ?? "");
    expect(message).toContain("no buyer email");
    expect(message).toContain("Stripe will not retry");
    expect(message).not.toContain("Stripe will retry this event");
    expect(membershipTestEvents().map((event) => event.id)).toEqual(["evt_no_email"]);

    sendNotificationEmail.mockClear();
    const again = await postWebhook(payload, secret);
    expect(again.status).toBe(200);
    expect(await again.json()).toMatchObject({ duplicate: true });
    expect(sendNotificationEmail).not.toHaveBeenCalled();
  });

  it("ignores a Scan2Remember checkout with no member, email, alert, or PostHog call", async () => {
    const fetchMock = vi.fn(() => {
      throw new Error("Stripe must not be called for a foreign checkout");
    });
    vi.stubGlobal("fetch", fetchMock);

    const payload = JSON.stringify({
      id: "evt_scan2remember",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_live_b1fyVXK4test",
          customer_details: { email: "scan@example.com" },
          customer: "cus_scan",
          subscription: "sub_scan",
          amount_total: 499,
          currency: "usd",
          success_url: "https://app.scan2remember.com/plus/success",
          metadata: {
            intro_offer: "1",
            price_id: "price_1T9Nf7Rubzz9nfe2GtZALW5s",
            user_id: "user_123",
          },
          line_items: {
            data: [{ price: { id: "price_1T9Nf7Rubzz9nfe2GtZALW5s" } }],
          },
        },
      },
    });

    const res = await postWebhook(payload, secret);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true, ignored: "foreign_app" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendMemberWelcomeEmail).not.toHaveBeenCalled();
    expect(sendNotificationEmail).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
    expect(flushPostHog).not.toHaveBeenCalled();
    expect(redisState.hashes.size).toBe(0);
    expect(redisState.lists.size).toBe(0);
    expect(membershipTestEvents()).toHaveLength(0);
    const member = await lookupMember("scan@example.com");
    expect(member).toEqual({ available: true, member: null });
  });

  it("ignores a foreign subscription.deleted and does not revoke an AversusB member", async () => {
    await postWebhook(
      JSON.stringify({
        id: "evt_ours_before_foreign_delete",
        type: "checkout.session.completed",
        data: {
          object: {
            customer_details: { email: "buyer@example.com" },
            customer: "cus_ours",
            subscription: "sub_ours",
            amount_total: 4900,
            currency: "usd",
            metadata: { app: "aversusb", plan: "pro", interval: "year", src: "header" },
          },
        },
      }),
      secret,
    );
    sendNotificationEmail.mockClear();
    sendMemberWelcomeEmail.mockClear();
    capture.mockClear();
    flushPostHog.mockClear();

    const res = await postWebhook(
      JSON.stringify({
        id: "evt_foreign_deleted",
        type: "customer.subscription.deleted",
        data: {
          object: {
            id: "sub_foreign",
            customer: "cus_foreign",
            status: "canceled",
            metadata: { user_id: "user_123" },
            items: { data: [{ price: { id: "price_1T9Nf7Rubzz9nfe2GtZALW5s" } }] },
          },
        },
      }),
      secret,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true, ignored: "foreign_app" });
    expect(sendNotificationEmail).not.toHaveBeenCalled();
    expect(sendMemberWelcomeEmail).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
    expect(flushPostHog).not.toHaveBeenCalled();
    const member = await lookupMember("buyer@example.com");
    expect(member.available && member.member).toMatchObject({
      status: "active",
      active: true,
      stripeSubscription: "sub_ours",
    });
  });

  it("still processes a checkout tagged metadata.app=aversusb", async () => {
    const res = await postWebhook(
      JSON.stringify({
        id: "evt_tagged_ok",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_tagged",
            customer_details: { email: "member@example.com" },
            customer: "cus_tagged",
            subscription: "sub_tagged",
            amount_total: 4900,
            currency: "usd",
            metadata: { app: "aversusb", plan: "pro", interval: "year", src: "pricing" },
          },
        },
      }),
      secret,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
    const member = await lookupMember("member@example.com");
    expect(member.available && member.member).toMatchObject({
      active: true,
      plan: "pro",
      interval: "year",
    });
    expect(sendMemberWelcomeEmail).toHaveBeenCalled();
    expect(sendNotificationEmail).toHaveBeenCalled();
    expect(capture).toHaveBeenCalledWith(expect.objectContaining({ event: "purchase" }));
  });

  it("processes a checkout with no app tag when the line item is an AversusB price, including Business", async () => {
    const previousYear = process.env.STRIPE_PRICE_PRO_YEARLY;
    const previousBusiness = process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_year";
    process.env.STRIPE_PRICE_BUSINESS_MONTHLY = "price_business_month";
    try {
      const pro = await postWebhook(
        JSON.stringify({
          id: "evt_price_fallback_pro",
          type: "checkout.session.completed",
          data: {
            object: {
              id: "cs_price_pro",
              customer_details: { email: "pro-price@example.com" },
              customer: "cus_price_pro",
              subscription: "sub_price_pro",
              amount_total: 4900,
              currency: "usd",
              metadata: { plan: "pro", interval: "year", src: "pricing" },
              line_items: { data: [{ price: { id: "price_pro_year" } }] },
            },
          },
        }),
        secret,
      );
      expect(pro.status).toBe(200);
      expect(await pro.json()).toEqual({ received: true });

      const business = await postWebhook(
        JSON.stringify({
          id: "evt_price_fallback_biz",
          type: "checkout.session.completed",
          data: {
            object: {
              id: "cs_price_biz",
              customer_details: { email: "biz-price@example.com" },
              customer: "cus_price_biz",
              subscription: "sub_price_biz",
              amount_total: 4900,
              currency: "usd",
              metadata: { plan: "business", interval: "month", src: "pricing" },
              line_items: { data: [{ price: "price_business_month" }] },
            },
          },
        }),
        secret,
      );
      expect(business.status).toBe(200);
      const bizMember = await lookupMember("biz-price@example.com");
      expect(bizMember.available && bizMember.member).toMatchObject({
        plan: "business",
        interval: "month",
        active: true,
      });
    } finally {
      if (previousYear === undefined) delete process.env.STRIPE_PRICE_PRO_YEARLY;
      else process.env.STRIPE_PRICE_PRO_YEARLY = previousYear;
      if (previousBusiness === undefined) delete process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
      else process.env.STRIPE_PRICE_BUSINESS_MONTHLY = previousBusiness;
    }
  });

  it("reads line items when a transition checkout has no app tag and no price in the payload", async () => {
    const previousKey = process.env.STRIPE_SECRET_KEY;
    const previousYear = process.env.STRIPE_PRICE_PRO_YEARLY;
    process.env.STRIPE_SECRET_KEY = "sk_test_transition";
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_year";
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      expect(init?.method ?? "GET").toBe("GET");
      expect(String(url)).toContain("/checkout/sessions/cs_transition/line_items");
      return {
        ok: true,
        json: async () => ({ data: [{ price: { id: "price_pro_year" } }] }),
      };
    });
    vi.stubGlobal("fetch", fetchMock);
    try {
      const res = await postWebhook(
        JSON.stringify({
          id: "evt_transition",
          type: "checkout.session.completed",
          data: {
            object: {
              id: "cs_transition",
              customer_details: { email: "transition@example.com" },
              customer: "cus_transition",
              subscription: "sub_transition",
              amount_total: 4900,
              currency: "usd",
              metadata: { plan: "pro", interval: "year", src: "header" },
            },
          },
        }),
        secret,
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ received: true });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const member = await lookupMember("transition@example.com");
      expect(member.available && member.member?.active).toBe(true);
    } finally {
      if (previousKey === undefined) delete process.env.STRIPE_SECRET_KEY;
      else process.env.STRIPE_SECRET_KEY = previousKey;
      if (previousYear === undefined) delete process.env.STRIPE_PRICE_PRO_YEARLY;
      else process.env.STRIPE_PRICE_PRO_YEARLY = previousYear;
    }
  });

  it("ignores an AversusB-tagged checkout with a missing or invalid plan", async () => {
    const res = await postWebhook(
      JSON.stringify({
        id: "evt_bad_plan",
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_bad_plan",
            customer_details: { email: "bad-plan@example.com" },
            customer: "cus_bad",
            subscription: "sub_bad",
            amount_total: 4900,
            currency: "usd",
            metadata: { app: "aversusb", plan: "unknown", interval: "year", src: "header" },
          },
        },
      }),
      secret,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true, ignored: "invalid_plan" });
    expect(sendMemberWelcomeEmail).not.toHaveBeenCalled();
    expect(sendNotificationEmail).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
    expect(membershipTestEvents()).toHaveLength(0);
    const member = await lookupMember("bad-plan@example.com");
    expect(member).toEqual({ available: true, member: null });
  });

  it("accepts a subscription event by price id when metadata.app is absent", async () => {
    const previousYear = process.env.STRIPE_PRICE_PRO_YEARLY;
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_year";
    try {
      await postWebhook(
        JSON.stringify({
          id: "evt_sub_seed",
          type: "checkout.session.completed",
          data: {
            object: {
              customer_details: { email: "sub-price@example.com" },
              customer: "cus_sub_price",
              subscription: "sub_price",
              amount_total: 900,
              currency: "usd",
              metadata: { app: "aversusb", plan: "pro", interval: "month", src: "pricing" },
            },
          },
        }),
        secret,
      );
      const res = await postWebhook(
        JSON.stringify({
          id: "evt_sub_price_update",
          type: "customer.subscription.updated",
          data: {
            object: {
              id: "sub_price",
              customer: "cus_sub_price",
              status: "past_due",
              metadata: { plan: "pro", interval: "month" },
              items: { data: [{ price: { id: "price_pro_year" } }] },
            },
          },
        }),
        secret,
      );
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ received: true });
      const member = await lookupMember("sub-price@example.com");
      expect(member.available && member.member).toMatchObject({ status: "past_due", active: false });
    } finally {
      if (previousYear === undefined) delete process.env.STRIPE_PRICE_PRO_YEARLY;
      else process.env.STRIPE_PRICE_PRO_YEARLY = previousYear;
    }
  });
});
