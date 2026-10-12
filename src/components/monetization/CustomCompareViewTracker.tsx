"use client";

import { useEffect } from "react";
import { trackCustomCompareViewed } from "@/lib/utils/analytics";

/** Fires custom_compare_viewed once when /custom-compare mounts. */
export function CustomCompareViewTracker() {
  useEffect(() => {
    trackCustomCompareViewed();
  }, []);
  return null;
}
