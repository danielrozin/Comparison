import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/lib/services/redis", () => ({
  getRedis: () => null,
}));

vi.mock("@/lib/db/prisma", async () => {
  const db = await import("./in-memory-membership-db");
  return { getPrisma: () => db.getMembershipTestPrisma() };
});

import { backfillProMembers } from "../backfill-pro-members";
import { lookupMember } from "../members";
import { resetMembershipTestDb } from "./in-memory-membership-db";

const PRO_YEAR = "price_pro_year";
const PRO_MONTH = "price_pro_month";
const BUSINESS = "price_business";
const OTHER_PRODUCT = "price_scan2remember";

function session(id: string, priceId: string, email: string) {
  return {
    id,
    customer: `cus_${id}`,
    customer_details: { email },
    subscription: `sub_${id}`,
    metadata: { src: "pricing", plan: "pro" },
    line_items: { data: [{ price: { id: priceId } }] },
  };
}

describe("backfillProMembers", () => {
  const env = {
    STRIPE_SECRET_KEY: "sk_test_backfill",
    STRIPE_PRICE_PRO_YEARLY: PRO_YEAR,
    STRIPE_PRICE_PRO_MONTHLY: PRO_MONTH,
    STRIPE_PRICE_BUSINESS_MONTHLY: BUSINESS,
    STRIPE_PRICE_PRO: "price_api_pro_not_consumer",
  };

  beforeEach(() => {
    resetMembershipTestDb();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("dry-run lists only AversusB Pro prices and does not write members", async () => {
    const calls: Array<{ url: string; method: string }> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string, init?: RequestInit) => {
        const method = init?.method ?? "GET";
        calls.push({ url: String(url), method });
        expect(method).toBe("GET");
        if (String(url).includes("/checkout/sessions?")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              has_more: false,
              data: [
                session("cs_pro", PRO_YEAR, "Buyer@Example.com"),
                session("cs_month", PRO_MONTH, "month@example.com"),
                session("cs_biz", BUSINESS, "biz@example.com"),
                session("cs_other", OTHER_PRODUCT, "other@example.com"),
              ],
            }),
          };
        }
        if (String(url).includes("/subscriptions/")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ id: "sub", status: "active", current_period_end: 1_800_000_000 }),
          };
        }
        throw new Error(`unexpected Stripe call ${method} ${url}`);
      })
    );

    const result = await backfillProMembers({ dryRun: true, env });
    expect(result.ok).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.scanned).toBe(4);
    expect(result.matched).toBe(2);
    expect(result.upserted).toBe(0);
    expect(result.priceIds.sort()).toEqual([PRO_MONTH, PRO_YEAR].sort());
    expect(result.members.map((row) => row.email).sort()).toEqual([
      "buyer@example.com",
      "month@example.com",
    ]);
    expect(calls.every((call) => call.method === "GET")).toBe(true);
    expect(calls.some((call) => call.url.includes("/v1/products"))).toBe(false);

    const lookedUp = await lookupMember("buyer@example.com");
    expect(lookedUp).toEqual({ available: true, member: null });
  });

  it("apply upserts the matched Pro sessions", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        expect(String(url).startsWith("https://api.stripe.com/v1/")).toBe(true);
        if (String(url).includes("/checkout/sessions?")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              has_more: false,
              data: [session("cs_pro", PRO_YEAR, "buyer@example.com")],
            }),
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ status: "active", current_period_end: 1_800_000_000 }),
        };
      })
    );

    const result = await backfillProMembers({ dryRun: false, env });
    expect(result.ok).toBe(true);
    expect(result.upserted).toBe(1);
    const lookedUp = await lookupMember("buyer@example.com");
    expect(lookedUp.available && lookedUp.member).toMatchObject({
      active: true,
      plan: "pro",
      interval: "year",
      stripeCustomer: "cus_cs_pro",
      stripeSubscription: "sub_cs_pro",
      status: "active",
    });
  });

  it("refuses to scan Stripe when Pro price ids are not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await backfillProMembers({
      dryRun: true,
      env: { STRIPE_SECRET_KEY: "sk_test" },
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/STRIPE_PRICE_PRO_YEARLY/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
