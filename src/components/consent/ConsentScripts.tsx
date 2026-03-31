"use client";

import { useEffect } from "react";
import { getConsentFromCookie, updateGoogleConsent } from "@/lib/utils/consent";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Restores consent state on page load and conditionally loads
 * analytics/marketing scripts only when consent has been granted.
 */
export function ConsentScripts() {
  useEffect(() => {
    const consent = getConsentFromCookie();
    if (!consent) return;

    // Restore Google Consent Mode from saved preferences
    updateGoogleConsent(consent);

    // Load Clarity only if analytics consent was granted
    if (consent.analytics && !window.clarity) {
      loadClarity();
    }
  }, []);

  return null;
}

function loadClarity() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!clarityId) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${clarityId}`;
  document.head.appendChild(script);
}
