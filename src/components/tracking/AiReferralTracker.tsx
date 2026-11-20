"use client";

import { useEffect } from "react";
import { classifyAiReferral } from "@/lib/utils/ai-referral";
import { trackAiReferralLanding } from "@/lib/utils/analytics";

const KEY = "avsb_ai_referral";

/**
 * Fires `ai_referral_landing` once per session when the visitor arrived from an
 * AI assistant. Mounted in BOTH the App Router layout and pages/_app, because
 * most AI-referred visits land on /compare (Pages Router).
 */
export function AiReferralTracker() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY)) return;
      const platform = classifyAiReferral(window.location.search, document.referrer);
      window.sessionStorage.setItem(KEY, platform ?? "none");
      if (platform) trackAiReferralLanding(platform, window.location.pathname);
    } catch {
      // storage blocked — skip rather than double-count
    }
  }, []);
  return null;
}
