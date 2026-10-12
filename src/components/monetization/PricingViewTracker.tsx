"use client";

import { useEffect } from "react";
import { trackCheckoutCanceled, trackPricingViewed } from "@/lib/utils/analytics";

/**
 * Fires pricing_viewed once per mount with the referring surface.
 * A full page load already captured it in the PostHog bootstrap (ROO-54);
 * this effect covers client navigations, which do not re-run that bootstrap.
 * When Stripe's cancel_url lands here (`?canceled=1`), also fires
 * checkout_canceled so abandon after checkout_started is visible.
 *
 * Funnel: pricing_viewed → checkout_clicked → checkout_started →
 * purchase (webhook, `$revenue`). Side: checkout_canceled / thanks /
 * subscription_canceled. `pricing_cta_click` is the lander link, not the
 * buy button on this page.
 */
export function PricingViewTracker({ src, canceled }: { src: string; canceled?: boolean }) {
  useEffect(() => {
    trackPricingViewed(src);
    if (canceled) trackCheckoutCanceled(src);
  }, [src, canceled]);
  return null;
}
