"use client";

import { useEffect, useState } from "react";
import { withPaidAmazonTag } from "@/lib/services/paid-attribution";

/**
 * Resolve an outbound affiliate href for the current session (DAN-2591).
 *
 * Affiliate links are generated at build/ISR time, so the paid tracking ID can
 * only be applied in the browser. The first render deliberately returns the
 * server-rendered URL unchanged — swapping it in an effect keeps hydration
 * byte-identical and, when no paid tag is configured, the effect is a no-op.
 */
export function usePaidAffiliateHref(url: string): string {
  const [href, setHref] = useState(url);

  useEffect(() => {
    setHref(withPaidAmazonTag(url));
  }, [url]);

  return href;
}
