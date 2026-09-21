"use client";

import { useEffect } from "react";
import { trackCheckoutThanksViewed } from "@/lib/utils/analytics";

/**
 * Stripe Checkout success_url lands on /pricing/thanks. Fires
 * checkout_thanks_viewed once per mount so the paid-return is visible
 * next to the server-side purchase / checkout_completed webhook events.
 */
export function CheckoutThanksTracker({ sessionId }: { sessionId?: string }) {
  useEffect(() => {
    trackCheckoutThanksViewed(sessionId);
  }, [sessionId]);
  return null;
}
