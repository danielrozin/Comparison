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
    async del(key: string) {
      return strings.delete(key) ? 1 : 0;
    },
  };
  return api;
});

const sendOutreachEmail = vi.fn().mockResolvedValue({ success: true, id: "em_1" });

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => (redisBox.enabled ? redisBox : null),
}));

vi.mock("@/lib/db/prisma", async () => {
  const db = await import("./in-memory-membership-db");
  return { getPrisma: () => db.getMembershipTestPrisma() };
});

vi.mock("@/lib/services/email", () => ({
  sendOutreachEmail: (...args: unknown[]) => sendOutreachEmail(...args),
}));

import { upsertMember } from "../members";
import { resetMembershipTestDb, setMembershipDbEnabled } from "./in-memory-membership-db";
import {
  BILLING_PORTAL_GENERIC_MESSAGE,
  redeemBillingPortal,
  startBillingPortal,
} from "../billing-portal";

const GENERIC = { ok: true, message: BILLING_PORTAL_GENERIC_MESSAGE };

function stripeSubscription(overrides?: {
  customer?: string;
  app?: string;
  priceId?: string;
}) {
  return {
    id: "sub_portal",
    customer: overrides?.customer ?? "cus_portal",
    metadata: overrides?.app ? { app: overrides.app } : {},
    items: { data: [{ price: { id: overrides?.priceId ?? "price_1T9Nf7Rubzz9nfe2GtZALW5s" } }] },
  };
}

function stubStripe(subscription: ReturnType<typeof stripeSubscription>, portalUrl?: string) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const href = String(url);
    if (href.includes("/v1/subscriptions/")) {
      expect(init?.method ?? "GET").toBe("GET");
      return { ok: true, json: async () => subscription };
    }
    if (href.includes("/v1/billing_portal/sessions")) {
      return { ok: true, json: async () => ({ url: portalUrl ?? "https://billing.stripe.com/p/session_test" }) };
    }
    throw new Error(`unexpected Stripe call ${init?.method} ${href}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("startBillingPortal", () => {
  const previousKey = process.env.STRIPE_SECRET_KEY;
  const previousYear = process.env.STRIPE_PRICE_PRO_YEARLY;

  beforeEach(async () => {
    redisBox.reset();
    resetMembershipTestDb();
    setMembershipDbEnabled(true);
    process.env.STRIPE_SECRET_KEY = "sk_test_billing";
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_year";
    sendOutreachEmail.mockClear();
    sendOutreachEmail.mockResolvedValue({ success: true, id: "em_1" });
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
    if (previousYear === undefined) delete process.env.STRIPE_PRICE_PRO_YEARLY;
    else process.env.STRIPE_PRICE_PRO_YEARLY = previousYear;
    vi.unstubAllGlobals();
  });

  it("returns the same generic response for a non-member and does not call Stripe", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await startBillingPortal("nobody@example.com");
    expect(result).toEqual(GENERIC);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendOutreachEmail).not.toHaveBeenCalled();
  });

  it("refuses a foreign subscription with the same generic response and no portal session", async () => {
    const fetchMock = stubStripe(stripeSubscription());
    const foreign = await startBillingPortal("buyer@example.com");
    const stranger = await startBillingPortal("nobody@example.com");
    expect(foreign).toEqual(GENERIC);
    expect(stranger).toEqual(foreign);
    expect(sendOutreachEmail).not.toHaveBeenCalled();
    const urls = fetchMock.mock.calls.map((call) => String(call[0]));
    expect(urls.some((url) => url.includes("/v1/subscriptions/"))).toBe(true);
    expect(urls.some((url) => url.includes("billing_portal"))).toBe(false);
  });

  it("emails a one-time link for an active member on an AversusB price and does not return the portal URL", async () => {
    const fetchMock = stubStripe(stripeSubscription({ priceId: "price_pro_year" }));
    const result = await startBillingPortal("buyer@example.com");
    expect(result).toEqual(GENERIC);
    expect(result).not.toHaveProperty("url");
    expect(sendOutreachEmail).toHaveBeenCalledTimes(1);
    const mail = sendOutreachEmail.mock.calls[0][0] as { to: string; text: string };
    expect(mail.to).toBe("buyer@example.com");
    expect(mail.text).toContain("/api/billing-portal/redeem?token=");
    expect(mail.text).not.toContain("billing.stripe.com");
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes("billing_portal"))).toBe(false);
  });

  it("emails a link when the subscription is tagged aversusb even if the price env is unset", async () => {
    delete process.env.STRIPE_PRICE_PRO_YEARLY;
    stubStripe(stripeSubscription({ app: "aversusb", priceId: "price_not_configured" }));
    const result = await startBillingPortal("buyer@example.com");
    expect(result).toEqual(GENERIC);
    expect(sendOutreachEmail).toHaveBeenCalledTimes(1);
  });

  it("redeems the one-time link into a portal session and refuses a second use", async () => {
    const fetchMock = stubStripe(
      stripeSubscription({ app: "aversusb", priceId: "price_pro_year" }),
      "https://billing.stripe.com/p/session_test",
    );
    await startBillingPortal("buyer@example.com");
    const mail = sendOutreachEmail.mock.calls[0][0] as { text: string };
    const link = mail.text.split("\n").find((line) => line.startsWith("http"));
    const token = new URL(link ?? "").searchParams.get("token") ?? "";

    const opened = await redeemBillingPortal(token);
    expect(opened).toEqual({ ok: true, url: "https://billing.stripe.com/p/session_test" });
    const portalCall = fetchMock.mock.calls.find((call) => String(call[0]).includes("billing_portal"));
    expect(portalCall?.[1]).toEqual(expect.objectContaining({ method: "POST" }));
    const body = String(portalCall?.[1]?.body);
    expect(body).toContain("customer=cus_portal");
    expect(body).not.toContain("price");

    const again = await redeemBillingPortal(token);
    expect(again).toMatchObject({ ok: false, status: 400, code: "invalid" });
  });

  it("does not open a portal for a canceled member", async () => {
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_portal",
      stripeSubscription: "sub_portal",
      status: "canceled",
      replaceSubscription: true,
    });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await startBillingPortal("buyer@example.com");
    expect(result).toEqual(GENERIC);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendOutreachEmail).not.toHaveBeenCalled();
  });

  it("does not call Stripe when the secret is missing", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await startBillingPortal("buyer@example.com");
    expect(result).toEqual(GENERIC);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendOutreachEmail).not.toHaveBeenCalled();
  });

  it("refuses to redeem a link when the subscription is no longer AversusB", async () => {
    const fetchMock = stubStripe(stripeSubscription({ app: "aversusb", priceId: "price_pro_year" }));
    await startBillingPortal("buyer@example.com");
    const mail = sendOutreachEmail.mock.calls[0][0] as { text: string };
    const link = mail.text.split("\n").find((line) => line.startsWith("http"));
    const token = new URL(link ?? "").searchParams.get("token") ?? "";
    fetchMock.mockImplementation(async (url: string) => {
      if (String(url).includes("/v1/subscriptions/")) {
        return { ok: true, json: async () => stripeSubscription() };
      }
      throw new Error("portal must not be created");
    });
    const opened = await redeemBillingPortal(token);
    expect(opened).toMatchObject({ ok: false, status: 400 });
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes("billing_portal"))).toBe(false);
  });
});
