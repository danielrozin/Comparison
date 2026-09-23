/**
 * ROO-41 — Stripe webhook emits purchase ($revenue) and subscription_canceled.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "node:crypto";
import { NextRequest } from "next/server";

const capture = vi.fn();
const flushPostHog = vi.fn().mockResolvedValue(undefined);
const sendNotificationEmail = vi.fn().mockResolvedValue(undefined);

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
    reset() {
      hashes.clear();
      strings.clear();
      lists.clear();
      sets.clear();
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
  getRedis: () => redisState,
}));

vi.mock("@/lib/services/email", () => ({
  sendNotificationEmail: (...args: unknown[]) => sendNotificationEmail(...args),
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
    redisState.reset();
  });

  afterEach(() => {
    if (previousSecret === undefined) {
      delete process.env.STRIPE_WEBHOOK_SECRET;
    } else {
      process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
    }
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
          metadata: { plan: "pro", interval: "year", src: "header" },
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
          metadata: { plan: "pro", interval: "year", src: "header" },
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
          metadata: { plan: "pro", interval: "year", src: "header" },
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
            metadata: { plan: "pro", interval: "month", src: "pricing" },
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
            metadata: { plan: "pro", interval: "month" },
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
            metadata: { plan: "pro", interval: "year", src: "header" },
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
            metadata: { plan: "pro", interval: "year", src: "header" },
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
});
