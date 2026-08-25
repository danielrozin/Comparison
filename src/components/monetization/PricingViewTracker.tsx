"use client";

import { useEffect } from "react";
import { trackPricingViewed } from "@/lib/utils/analytics";

/**
 * Fires pricing_viewed once per mount with the referring surface, closing the
 * top of the funnel: pricing_viewed → checkout_clicked →
 * checkout_started/reservation_created (server) → checkout_completed (webhook).
 */
export function PricingViewTracker({ src }: { src: string }) {
  useEffect(() => {
    trackPricingViewed(src);
  }, [src]);
  return null;
}
