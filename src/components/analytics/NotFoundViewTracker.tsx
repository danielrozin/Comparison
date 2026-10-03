"use client";

import { useEffect } from "react";
import { trackNotFoundViewed } from "@/lib/utils/analytics";

/**
 * Fires not_found_viewed once when the generic App Router 404 mounts.
 * Bots are dropped inside captureClient.
 */
export function NotFoundViewTracker() {
  useEffect(() => {
    let referrer = "";
    try {
      referrer = document.referrer || "";
    } catch {
      referrer = "";
    }
    trackNotFoundViewed(window.location.pathname, referrer);
  }, []);
  return null;
}
