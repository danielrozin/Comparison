/**
 * Copy for /pricing. Stripe can be live while the page still describes the
 * old reservation flow ("pay nothing, checkout opens this week"). That copy
 * talks people out of the button, and a click on a live price goes to Stripe
 * Checkout immediately — so the words have to match `stripeConfigured`.
 */

import { PLANS, stripeConfigured, type PlanInterval } from "@/lib/monetization/plans";

export type PricingPayments = "live" | "partial" | "reservation";

/** How /pricing should describe payment, from the env wired right now. */
export function pricingPayments(): PricingPayments {
  const ready = PLANS.flatMap((plan) => plan.intervals.map((interval) => stripeConfigured(interval)));
  if (ready.length > 0 && ready.every(Boolean)) return "live";
  if (ready.some(Boolean)) return "partial";
  return "reservation";
}

/** Schema.org availability for one price. Live Stripe prices are in stock. */
export function offerAvailability(interval: PlanInterval): string {
  return stripeConfigured(interval)
    ? "https://schema.org/InStock"
    : "https://schema.org/PreOrder";
}

/** Sentence after the "Founding member pricing." label. */
export function pricingBannerDetail(mode: PricingPayments): string {
  if (mode === "live") {
    return "Checkout is open on Stripe — you pay there, not on this site, and the founding price stays locked for as long as you subscribe.";
  }
  if (mode === "partial") {
    return "Plans connected to Stripe open checkout immediately and charge on Stripe's page. Any plan still waiting on a price takes an email only and charges nothing today. The founding price stays locked once you subscribe.";
  }
  return "These are pre-launch prices — reserve with an email today, pay nothing until Stripe checkout opens this week, and keep the founding price for as long as you subscribe.";
}

const FREE_ANSWER =
  "Yes — every comparison, verdict and table on the site is free and stays free. Pro sells what doesn't exist yet: comparisons built on your request, exports, and alerts.";

const VENDOR_ANSWER =
  "No. Verdicts are never for sale — not to subscribers, not to vendors, not to us. That policy is published in our methodology and it's the reason the verdicts are worth paying around.";

/** FAQ pairs. Reservation wording stays exactly as it was before Stripe went live. */
export function pricingFaq(mode: PricingPayments): { q: string; a: string }[] {
  const founding =
    mode === "reservation"
      ? "The prices on this page are pre-launch prices. Reserve now and the price is locked for as long as you stay subscribed, even after public pricing goes up."
      : "These are founding prices. Subscribe now and the price stays locked for as long as you stay subscribed, even after public pricing goes up.";

  const charged =
    mode === "live"
      ? "When you finish Stripe Checkout. Card details are entered on Stripe's page only — this site never sees or stores them. Closing that page before you pay charges nothing."
      : mode === "partial"
        ? "If the button opens Stripe, you are charged when you finish on Stripe's page. If it asks for an email instead, nothing is charged today — we email your checkout link when that plan opens."
        : "Not today. Reserving takes an email only. Checkout (via Stripe) opens this week — you'll get your link by email, and only then do you enter payment details, on Stripe's own page.";

  return [
    { q: "Do comparisons stay free?", a: FREE_ANSWER },
    { q: "What does “founding price” mean?", a: founding },
    { q: "When am I charged?", a: charged },
    { q: "Can vendors pay to win a comparison?", a: VENDOR_ANSWER },
  ];
}
