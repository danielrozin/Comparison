import { CheckoutButton } from "@/components/monetization/CheckoutButton";

/**
 * Primary buy control on `/pricing`.
 *
 * The plan-card buttons sit under a tall hero, a feature list, and — until
 * the visitor dismisses it — the cookie banner (`fixed`, `z-[60]`). On a
 * ~667px phone that stack is below the fold, so the tap never reaches
 * checkout. This control lives in the hero, above the headline, where the
 * banner does not cover it. It is the same CheckoutButton: `checkout_clicked`,
 * then POST `/api/checkout`, then Stripe when that price is configured.
 */
export function PricingHeroCta({
  plan,
  planName,
  interval,
  price,
  src,
  paymentsLive,
}: {
  plan: string;
  planName: string;
  interval: string;
  price: number;
  src: string;
  paymentsLive: boolean;
}) {
  return (
    <div
      id="pricing-primary-cta"
      className="w-full max-w-sm rounded-2xl bg-white p-4 text-left text-text shadow-lg shadow-black/20"
    >
      <p className="text-sm font-semibold">
        {planName} · ${price}/{interval}
      </p>
      <p className="mt-0.5 text-xs text-text-secondary leading-snug">
        {paymentsLive
          ? "Opens Stripe Checkout. Comparisons stay free."
          : "Reserve the founding price with an email. Nothing is charged today."}
      </p>
      <div className="mt-3">
        <CheckoutButton
          plan={plan}
          interval={interval}
          src={src}
          paymentsLive={paymentsLive}
          label={`Get ${planName} — $${price}/${interval}`}
          className="w-full rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60"
        />
      </div>
    </div>
  );
}
