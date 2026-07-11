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

export const BackToTop = dynamic(
  () => import("@/components/layout/BackToTop").then((m) => ({ default: m.BackToTop })),
  { ssr: false, loading: () => null }
);

export const ReadingProgress = dynamic(
  () => import("@/components/layout/ReadingProgress").then((m) => ({ default: m.ReadingProgress })),
  { ssr: false, loading: () => null }
);

export const SearchOverlay = dynamic(
  () => import("@/components/layout/SearchOverlay").then((m) => ({ default: m.SearchOverlay })),
  { ssr: false, loading: () => null }
);

// DAN-1980: paid usability-study recruitment top bar. ssr:false because its
// visibility depends on a client-side 50% coin flip + localStorage dismissal —
// rendering it on the server would cause a hydration mismatch.
export const UxStudyBanner = dynamic(
  () => import("@/components/engagement/UxStudyBanner").then((m) => ({ default: m.UxStudyBanner })),
  { ssr: false, loading: () => null }
);
