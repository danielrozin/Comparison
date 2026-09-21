/**
 * ROO-41 — Stripe webhook emits purchase ($revenue) and subscription_canceled.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import crypto from "node:crypto";
import { NextRequest } from "next/server";

const capture = vi.fn();
const flushPostHog = vi.fn().mockResolvedValue(undefined);
const sendNotificationEmail = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => null,
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
});
