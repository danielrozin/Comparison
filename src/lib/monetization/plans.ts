/**
 * Single source of truth for paid plans.
 *
 * The pricing page, the checkout API and (later) the Stripe webhook all read
 * from here, so a price or feature can never differ between what the page
 * promises and what checkout charges.
 *
 * Stripe wiring: each interval maps to a STRIPE_PRICE_* env var. Until those
 * and STRIPE_SECRET_KEY exist, /api/checkout falls back to founding-member
 * reservations (email + plan, nothing charged) — so the same buttons convert
 * before and after Stripe is connected.
 */

export interface PlanInterval {
  interval: "month" | "year";
  /** USD, what founding members pay now */
  foundingPrice: number;
  /** USD, the price after launch — shown struck through */
  regularPrice: number;
  /** Env var holding the Stripe Price id for this interval */
  stripePriceEnv: string;
}

export interface Plan {
  id: "pro" | "business";
  name: string;
  tagline: string;
  intervals: PlanInterval[];
  features: string[];
  /** Promises that ship at launch, not live today — always labeled on-page */
  launchFeatures: string[];
  highlight: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "pro",
    name: "Pro",
    tagline: "For anyone who needs the comparison that doesn't exist yet.",
    intervals: [
      { interval: "year", foundingPrice: 49, regularPrice: 90, stripePriceEnv: "STRIPE_PRICE_PRO_YEARLY" },
      { interval: "month", foundingPrice: 9, regularPrice: 12, stripePriceEnv: "STRIPE_PRICE_PRO_MONTHLY" },
    ],
    features: [
      "2 custom comparisons per month — request any matchup, built for you within 24 hours",
      "Priority on every comparison request you vote for",
      "Founding price locked for as long as you stay subscribed",
    ],
    launchFeatures: [
      "PDF export of any comparison",
      "Verdict-change and price-drop alerts",
      "Ad-free reading",
    ],
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    tagline: "The comparison data itself — API, embeds and exports.",
    intervals: [
      { interval: "month", foundingPrice: 49, regularPrice: 99, stripePriceEnv: "STRIPE_PRICE_BUSINESS_MONTHLY" },
    ],
    features: [
      "Production API access to every comparison, verdict and attribute table",
      "White-label embeds — comparison widgets on your site without attribution",
      "Everything in Pro, for your whole team",
    ],
    launchFeatures: [
      "Bulk CSV export of comparison data",
      "Priority support with a named contact",
    ],
    highlight: false,
  },
];

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getInterval(plan: Plan, interval: string): PlanInterval | undefined {
  return plan.intervals.find((i) => i.interval === interval);
}

/** True once Stripe is wired for this specific plan+interval. */
export function stripeConfigured(pi: PlanInterval): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env[pi.stripePriceEnv]);
}
