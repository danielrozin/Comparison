/**
 * ROO-40 — Checkout Session stores the browser PostHog distinct id, and
 * checkout_started is captured on that same id.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { SITE_URL } from "@/lib/utils/constants";

const capture = vi.fn();
const flushPostHog = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => null,
}));

vi.mock("@/lib/services/email", () => ({
  sendNotificationEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/posthog-server", () => ({
  getPostHogClient: () => ({ capture }),
  flushPostHog: () => flushPostHog(),
}));

const fetchMock = vi.fn();

async function postCheckout(body: unknown) {
  const { POST } = await import("../route");
  const req = new NextRequest("https://aversusb.net/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return POST(req);
}

describe("POST /api/checkout (ROO-40)", () => {
  const previousSecret = process.env.STRIPE_SECRET_KEY;
  const previousPrice = process.env.STRIPE_PRICE_PRO_YEARLY;

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_roo40";
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_year";
    capture.mockClear();
    flushPostHog.mockClear();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: "cs_test_roo40", url: "https://checkout.stripe.com/c/pay/cs_test_roo40" }),
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (previousSecret === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = previousSecret;
    if (previousPrice === undefined) delete process.env.STRIPE_PRICE_PRO_YEARLY;
    else process.env.STRIPE_PRICE_PRO_YEARLY = previousPrice;
  });

  it("stores the browser distinct id on the Checkout Session and captures checkout_started with it", async () => {
    const res = await postCheckout({
      plan: "pro",
      interval: "year",
      src: "header",
      email: "Buyer@Example.com",
      posthogDistinctId: "ph_anon_019",
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      mode: "stripe",
      url: "https://checkout.stripe.com/c/pay/cs_test_roo40",
    });

    const [, init] = fetchMock.mock.calls[0] as [string, { body: string }];
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.stripe.com/v1/checkout/sessions");
    const params = new URLSearchParams(init.body);
    // Email is present, but the browser id wins so the funnel stays one person.
    expect(params.get("client_reference_id")).toBe("ph_anon_019");
    expect(params.get("metadata[posthog_distinct_id]")).toBe("ph_anon_019");
    expect(params.get("subscription_data[metadata][posthog_distinct_id]")).toBe("ph_anon_019");
    expect(params.get("customer_email")).toBe("Buyer@Example.com");
    expect(params.get("metadata[plan]")).toBe("pro");
    // Stripe substitutes this placeholder. It has to survive form encoding
    // as the literal token, and cancel must return to /pricing.
    expect(params.get("success_url")).toBe(
      `${SITE_URL}/pricing/thanks?session_id={CHECKOUT_SESSION_ID}`,
    );
    expect(params.get("cancel_url")).toBe(`${SITE_URL}/pricing?canceled=1&src=header`);

    const events = capture.mock.calls.map((call) => call[0] as {
      distinctId: string;
      event: string;
      properties: { plan: string; interval: string; src: string };
      timestamp: Date;
    });
    const clicked = events.find((event) => event.event === "checkout_clicked");
    const started = events.find((event) => event.event === "checkout_started");
    expect(clicked).toMatchObject({
      distinctId: "ph_anon_019",
      properties: { plan: "pro", interval: "year", src: "header" },
    });
    expect(started).toMatchObject({
      distinctId: "ph_anon_019",
      properties: { plan: "pro", interval: "year", src: "header" },
    });
    expect(clicked?.timestamp.getTime()).toBeLessThan(started!.timestamp.getTime());
    expect(flushPostHog).toHaveBeenCalled();
  });

  it("does not store the anonymous placeholder when the browser sent no id", async () => {
    const res = await postCheckout({
      plan: "pro",
      interval: "year",
      src: "header",
    });
    expect(res.status).toBe(200);

    const params = new URLSearchParams(
      (fetchMock.mock.calls[0] as [string, { body: string }])[1].body,
    );
    expect(params.get("client_reference_id")).toBeNull();
    expect(params.get("metadata[posthog_distinct_id]")).toBeNull();
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "anonymous",
        event: "checkout_started",
      }),
    );
  });

  it("falls back to the email only when the client did not send a distinct id", async () => {
    await postCheckout({
      plan: "pro",
      interval: "year",
      email: "buyer@example.com",
    });

    const params = new URLSearchParams(
      (fetchMock.mock.calls[0] as [string, { body: string }])[1].body,
    );
    expect(params.get("client_reference_id")).toBe("buyer@example.com");
    expect(params.get("metadata[posthog_distinct_id]")).toBe("buyer@example.com");
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "buyer@example.com",
        event: "checkout_started",
      }),
    );
  });
});
