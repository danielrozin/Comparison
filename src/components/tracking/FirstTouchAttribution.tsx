"use client";

import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/utils/attribution";

/**
 * Records how the visitor arrived, once per session, on the page they land on
 * (DAN-2146). Mounted in the root layout so it runs before they navigate on to
 * /contact, where the paid/organic signal is no longer in the URL or referrer.
 */
export function FirstTouchAttribution() {
  useEffect(() => {
    captureFirstTouch();
  }, []);

  return null;
}
