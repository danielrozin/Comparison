/**
 * ROO-45 — /pricing must not tell people checkout is closed when Stripe is live.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  offerAvailability,
  pricingBannerDetail,
  pricingFaq,
  pricingPayments,
} from "../pricing-messaging";
import { PLANS } from "../plans";

const PRICE_ENVS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_PRO_YEARLY",
  "STRIPE_PRICE_PRO_MONTHLY",
  "STRIPE_PRICE_BUSINESS_MONTHLY",
] as const;

describe("pricing messaging (ROO-45)", () => {
  const previous = new Map<string, string | undefined>();

  afterEach(() => {
    for (const key of PRICE_ENVS) {
      const value = previous.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    previous.clear();
  });

  function setEnv(values: Partial<Record<(typeof PRICE_ENVS)[number], string>>) {
    for (const key of PRICE_ENVS) {
      if (!previous.has(key)) previous.set(key, process.env[key]);
      if (values[key] === undefined) delete process.env[key];
      else process.env[key] = values[key];
    }
  }

  it("keeps the reservation wording when Stripe is not configured", () => {
    setEnv({});
    expect(pricingPayments()).toBe("reservation");
    expect(pricingBannerDetail("reservation")).toMatch(/pay nothing until Stripe checkout/);
    expect(pricingFaq("reservation").find((item) => item.q === "When am I charged?")?.a).toMatch(
      /^Not today\./,
    );
    expect(offerAvailability(PLANS[0].intervals[0])).toBe("https://schema.org/PreOrder");
  });

  it("says checkout is open when every price is configured", () => {
    setEnv({
      STRIPE_SECRET_KEY: "sk_test",
      STRIPE_PRICE_PRO_YEARLY: "price_year",
      STRIPE_PRICE_PRO_MONTHLY: "price_month",
      STRIPE_PRICE_BUSINESS_MONTHLY: "price_biz",
    });
    expect(pricingPayments()).toBe("live");
    expect(pricingBannerDetail("live")).not.toMatch(/pay nothing/);
    expect(pricingBannerDetail("live")).toMatch(/Checkout is open on Stripe/);
    const charged = pricingFaq("live").find((item) => item.q === "When am I charged?")?.a;
    expect(charged).toMatch(/Stripe Checkout/);
    expect(charged).not.toMatch(/Not today/);
    expect(offerAvailability(PLANS[0].intervals[0])).toBe("https://schema.org/InStock");
  });

  it("does not claim every plan is free of charge when only some prices exist", () => {
    setEnv({
      STRIPE_SECRET_KEY: "sk_test",
      STRIPE_PRICE_PRO_YEARLY: "price_year",
    });
    expect(pricingPayments()).toBe("partial");
    expect(pricingBannerDetail("partial")).toMatch(/charges nothing today/);
    expect(pricingBannerDetail("partial")).toMatch(/open checkout immediately/);
  });
});
