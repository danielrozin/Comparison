import { describe, it, expect } from "vitest";
import { aversusbOwnedPriceIds, aversusbProPriceIds } from "../backfill-pro-members";
import { readMembershipPlan, subscriptionBelongsToAversusB } from "../stripe-app";

describe("aversusb price set", () => {
  const env = {
    STRIPE_PRICE_PRO_YEARLY: "price_pro_year",
    STRIPE_PRICE_PRO_MONTHLY: "price_pro_month",
    STRIPE_PRICE_BUSINESS_MONTHLY: "price_business_month",
    STRIPE_PRICE_PRO: "price_api_pro_not_consumer",
  };

  it("includes Pro and Business consumer prices and leaves the API price out", () => {
    const owned = [...aversusbOwnedPriceIds(env).keys()].sort();
    expect(owned).toEqual(["price_business_month", "price_pro_month", "price_pro_year"]);
    const pro = [...aversusbProPriceIds(env).keys()].sort();
    expect(pro).toEqual(["price_pro_month", "price_pro_year"]);
  });

  it("treats a subscription on the Business price as AversusB", () => {
    const prices = new Set(aversusbOwnedPriceIds(env).keys());
    expect(
      subscriptionBelongsToAversusB(
        { items: { data: [{ price: { id: "price_business_month" } }] } },
        prices,
      ),
    ).toBe(true);
    expect(
      subscriptionBelongsToAversusB(
        {
          metadata: { app: "scan2remember" },
          items: { data: [{ price: { id: "price_1T9Nf7Rubzz9nfe2GtZALW5s" } }] },
        },
        prices,
      ),
    ).toBe(false);
  });

  it("rejects a missing or unknown plan", () => {
    expect(readMembershipPlan({})).toBeNull();
    expect(readMembershipPlan({ plan: "unknown", interval: "year" })).toBeNull();
    expect(readMembershipPlan({ plan: "pro", interval: "year", src: "header" })).toEqual({
      plan: "pro",
      interval: "year",
      src: "header",
    });
  });
});
