"use client";

// Globally-mounted interactive overlays. Loaded client-side only so they don't add
// HTML weight to every page (FeedbackWidget alone renders a ~700-byte floating button
// before its closed-state state hydrates).

import dynamic from "next/dynamic";

export const FeedbackWidget = dynamic(
  () => import("@/components/feedback/FeedbackWidget").then((m) => ({ default: m.FeedbackWidget })),
  { ssr: false, loading: () => null }
);

export const CookieConsentBanner = dynamic(
  () => import("@/components/consent/CookieConsentBanner").then((m) => ({ default: m.CookieConsentBanner })),
  { ssr: false, loading: () => null }
);
