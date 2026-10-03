import crypto from "node:crypto";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const sendOutreachEmail = vi.fn().mockResolvedValue({ success: true, id: "em_1" });

vi.mock("@/lib/services/redis", () => ({
  // Production does not configure Redis (PR #300). A throw here would also
  // break the membership mirror, so null is the real production value.
  getRedis: () => null,
}));

vi.mock("@/lib/db/prisma", async () => {
  const db = await import("./in-memory-membership-db");
  return { getPrisma: () => db.getMembershipTestPrisma() };
});

vi.mock("@/lib/services/email", () => ({
  sendOutreachEmail: (...args: unknown[]) => sendOutreachEmail(...args),
}));

import { upsertMember } from "../members";
import {
  membershipTestBillingTokens,
  resetMembershipTestDb,
  setMembershipDbEnabled,
} from "./in-memory-membership-db";
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

function tokenFromLastEmail(): string {
  const mail = sendOutreachEmail.mock.calls.at(-1)?.[0] as { text: string } | undefined;
  const link = mail?.text.split("\n").find((line) => line.startsWith("http"));
  return new URL(link ?? "https://example.com").searchParams.get("token") ?? "";
}

describe("startBillingPortal", () => {
  const previousKey = process.env.STRIPE_SECRET_KEY;
  const previousYear = process.env.STRIPE_PRICE_PRO_YEARLY;
  const previousFloor = process.env.BILLING_PORTAL_MIN_RESPONSE_MS;

  beforeEach(async () => {
    resetMembershipTestDb();
    setMembershipDbEnabled(true);
    process.env.STRIPE_SECRET_KEY = "sk_test_billing";
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_year";
    process.env.BILLING_PORTAL_MIN_RESPONSE_MS = "0";
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
    if (previousFloor === undefined) delete process.env.BILLING_PORTAL_MIN_RESPONSE_MS;
    else process.env.BILLING_PORTAL_MIN_RESPONSE_MS = previousFloor;
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
    const token = tokenFromLastEmail();
    const bytes = Buffer.from(token, "base64url");
    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    expect(bytes).toHaveLength(32);
    expect(membershipTestBillingTokens()).toHaveLength(1);
    expect(membershipTestBillingTokens()[0]?.tokenHash).toBe(hash);
    expect(JSON.stringify(membershipTestBillingTokens()[0])).not.toContain(token);

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

  it("emails a link for a canceled member when the subscription is an AversusB price", async () => {
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_portal",
      stripeSubscription: "sub_portal",
      status: "canceled",
      replaceSubscription: true,
    });
    stubStripe(stripeSubscription({ priceId: "price_pro_year" }));
    const result = await startBillingPortal("buyer@example.com");
    expect(result).toEqual(GENERIC);
    expect(sendOutreachEmail).toHaveBeenCalledTimes(1);
    const opened = await redeemBillingPortal(tokenFromLastEmail());
    expect(opened).toMatchObject({ ok: true, url: "https://billing.stripe.com/p/session_test" });
  });

  it("refuses a canceled member whose subscription is not an AversusB price", async () => {
    await upsertMember({
      email: "buyer@example.com",
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_portal",
      stripeSubscription: "sub_portal",
      status: "canceled",
      replaceSubscription: true,
    });
    const fetchMock = stubStripe(stripeSubscription());
    const result = await startBillingPortal("buyer@example.com");
    expect(result).toEqual(GENERIC);
    expect(sendOutreachEmail).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes("billing_portal"))).toBe(false);
    expect(membershipTestBillingTokens()).toHaveLength(0);
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
    const token = tokenFromLastEmail();
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

  it("stops after 3 links per email per hour and still answers with the generic message", async () => {
    stubStripe(stripeSubscription({ priceId: "price_pro_year" }));
    for (let i = 0; i < 3; i += 1) {
      const result = await startBillingPortal("buyer@example.com");
      expect(result).toEqual(GENERIC);
    }
    expect(sendOutreachEmail).toHaveBeenCalledTimes(3);
    sendOutreachEmail.mockClear();
    const blocked = await startBillingPortal("buyer@example.com");
    expect(blocked).toEqual(GENERIC);
    expect(sendOutreachEmail).not.toHaveBeenCalled();
    expect(membershipTestBillingTokens()).toHaveLength(3);
  });

  it("does not redeem an expired token", async () => {
    stubStripe(stripeSubscription({ priceId: "price_pro_year" }));
    await startBillingPortal("buyer@example.com");
    const token = tokenFromLastEmail();
    const row = membershipTestBillingTokens()[0];
    expect(row).toBeTruthy();
    row.expiresAt = new Date(Date.now() - 1000);
    const opened = await redeemBillingPortal(token);
    expect(opened).toMatchObject({ ok: false, status: 400, code: "invalid" });
    expect(row.usedAt).toBeNull();
  });

  it("lets only one of two parallel redeems open the portal", async () => {
    stubStripe(stripeSubscription({ app: "aversusb", priceId: "price_pro_year" }));
    await startBillingPortal("buyer@example.com");
    const token = tokenFromLastEmail();
    const [first, second] = await Promise.all([
      redeemBillingPortal(token),
      redeemBillingPortal(token),
    ]);
    const opened = [first, second].filter((result) => result.ok);
    expect(opened).toHaveLength(1);
    expect(membershipTestBillingTokens()[0]?.usedAt).toBeInstanceOf(Date);
  });

  it("drops the token when the email send fails", async () => {
    stubStripe(stripeSubscription({ priceId: "price_pro_year" }));
    sendOutreachEmail.mockResolvedValueOnce({ success: false, error: "resend down" });
    const result = await startBillingPortal("buyer@example.com");
    expect(result).toEqual(GENERIC);
    expect(membershipTestBillingTokens()).toHaveLength(0);
  });

  it("pads member and non-member responses to the same minimum", async () => {
    process.env.BILLING_PORTAL_MIN_RESPONSE_MS = "40";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const strangerStarted = Date.now();
    const stranger = await startBillingPortal("nobody@example.com");
    const strangerMs = Date.now() - strangerStarted;

    stubStripe(stripeSubscription());
    const memberStarted = Date.now();
    const member = await startBillingPortal("buyer@example.com");
    const memberMs = Date.now() - memberStarted;

    expect(stranger).toEqual(GENERIC);
    expect(member).toEqual(GENERIC);
    expect(strangerMs).toBeGreaterThanOrEqual(35);
    expect(memberMs).toBeGreaterThanOrEqual(35);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
