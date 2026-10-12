import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const scheduled: Array<() => Promise<void>> = [];
const sendOutreachEmail = vi.fn().mockResolvedValue({ success: true, id: "em_1" });

vi.mock("next/server", () => ({
  after: (task: () => Promise<void>) => {
    scheduled.push(task);
  },
}));

vi.mock("@/lib/services/redis", () => ({
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
import { resetMembershipTestDb, setMembershipDbEnabled } from "./in-memory-membership-db";
import { BILLING_PORTAL_GENERIC_MESSAGE, startBillingPortal } from "../billing-portal";

describe("billing portal follow-up after the response", () => {
  const previousKey = process.env.STRIPE_SECRET_KEY;
  const previousYear = process.env.STRIPE_PRICE_PRO_YEARLY;
  const previousFloor = process.env.BILLING_PORTAL_MIN_RESPONSE_MS;

  beforeEach(async () => {
    scheduled.splice(0, scheduled.length);
    resetMembershipTestDb();
    setMembershipDbEnabled(true);
    process.env.STRIPE_SECRET_KEY = "sk_test_billing";
    process.env.STRIPE_PRICE_PRO_YEARLY = "price_pro_year";
    process.env.BILLING_PORTAL_MIN_RESPONSE_MS = "0";
    sendOutreachEmail.mockClear();
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

  it("returns before the Stripe lookup and the email", async () => {
    let releaseFetch: () => void = () => {};
    const fetchGate = new Promise<void>((resolve) => {
      releaseFetch = resolve;
    });
    const fetchMock = vi.fn(async (url: string) => {
      await fetchGate;
      if (String(url).includes("/v1/subscriptions/")) {
        return {
          ok: true,
          json: async () => ({
            id: "sub_portal",
            customer: "cus_portal",
            metadata: { app: "aversusb" },
            items: { data: [{ price: { id: "price_pro_year" } }] },
          }),
        };
      }
      throw new Error(`unexpected Stripe call ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const started = Date.now();
    const result = await startBillingPortal("buyer@example.com");
    const elapsed = Date.now() - started;

    expect(result).toEqual({ ok: true, message: BILLING_PORTAL_GENERIC_MESSAGE });
    expect(elapsed).toBeLessThan(150);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendOutreachEmail).not.toHaveBeenCalled();
    expect(scheduled).toHaveLength(1);

    releaseFetch();
    await scheduled[0]();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sendOutreachEmail).toHaveBeenCalledTimes(1);
  });
});
