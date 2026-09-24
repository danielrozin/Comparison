import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

type Hash = Record<string, string>;

const redisBox = vi.hoisted(() => {
  const hashes = new Map<string, Hash>();
  const strings = new Map<string, string>();
  const api = {
    enabled: true,
    reset() {
      hashes.clear();
      strings.clear();
      api.enabled = true;
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
  getRedis: () => (redisBox.enabled ? redisBox : null),
}));

import { upsertMember } from "../members";
import { startBillingPortal } from "../billing-portal";

describe("startBillingPortal", () => {
  const previousKey = process.env.STRIPE_SECRET_KEY;

  beforeEach(async () => {
    redisBox.reset();
    process.env.STRIPE_SECRET_KEY = "sk_test_billing";
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_portal",
      stripeSubscription: "sub_portal",
      status: "active",
      replaceSubscription: true,
    });
  });

  afterEach(() => {
    if (previousKey === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = previousKey;
    vi.unstubAllGlobals();
  });

  it("sends an unknown email to pricing", async () => {
    const result = await startBillingPortal("nobody@example.com");
    expect(result).toMatchObject({
      ok: false,
      status: 403,
      code: "upgrade_required",
      upgradeUrl: "/pricing?src=billing",
    });
  });

  it("opens a portal session for the stored Stripe customer", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: "https://billing.stripe.com/p/session_test" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await startBillingPortal("buyer@example.com");
    expect(result).toEqual({ ok: true, url: "https://billing.stripe.com/p/session_test" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.stripe.com/v1/billing_portal/sessions",
      expect.objectContaining({ method: "POST" })
    );
    const body = String(fetchMock.mock.calls[0][1].body);
    expect(body).toContain("customer=cus_portal");
    expect(body).not.toContain("price");
  });

  it("does not call Stripe when the secret is missing", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await startBillingPortal("buyer@example.com");
    expect(result).toMatchObject({ ok: false, status: 503, code: "unavailable" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
