import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { PLANS, type Plan, type PlanInterval } from "@/lib/monetization/plans";
import { offerAvailability } from "@/lib/monetization/pricing-messaging";

/**
 * Photo for the subscriptions we actually sell.
 * Live file is a 512×512 PNG (well above Google's 50K-pixel merchant minimum).
 */
export const PRICING_PRODUCT_IMAGE = `${SITE_URL}/images/logo.png`;

const PRICING_PAGE_URL = `${SITE_URL}/pricing`;

function intervalLabel(interval: PlanInterval["interval"]): string {
  return interval === "year" ? "yearly" : "monthly";
}

/**
 * One Offer per billing interval. Price is the founding price from PLANS —
 * the same number the pricing page and checkout use. No invented amount.
 */
export function pricingOfferJsonLd(plan: Plan, interval: PlanInterval) {
  return {
    "@type": "Offer" as const,
    name: `${SITE_NAME} ${plan.name} ${intervalLabel(interval.interval)}`,
    price: interval.foundingPrice,
    priceCurrency: "USD",
    // founding price — honest validity window, revisited at launch
    priceValidUntil: "2026-12-31",
    availability: offerAvailability(interval),
    url: PRICING_PAGE_URL,
  };
}

/**
 * Product markup only for plans AversusB sells. Merchant listings need
 * name, image, and an Offer with price, priceCurrency, and availability.
 */
export function pricingPlanJsonLd(plan: Plan) {
  return {
    "@type": "Product" as const,
    name: `${SITE_NAME} ${plan.name}`,
    description: plan.tagline,
    image: PRICING_PRODUCT_IMAGE,
    url: PRICING_PAGE_URL,
    brand: { "@type": "Brand" as const, name: SITE_NAME },
    offers: plan.intervals.map((interval) => pricingOfferJsonLd(plan, interval)),
  };
}

export function pricingPlanProducts() {
  return PLANS.map((plan) => pricingPlanJsonLd(plan));
}
