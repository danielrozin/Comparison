"use client";

// Below-fold interactive/tracking widgets for the comparison page.
// Wrapping them here lets us use `ssr: false` (forbidden in server components),
// keeping their HTML out of the initial SSR response and the streamed RSC payload.
// All of these are pure interaction or analytics — no SEO content lives in them.

import dynamic from "next/dynamic";

export const TrackRecentView = dynamic(
  () => import("@/components/comparison/TrackRecentView").then((m) => ({ default: m.TrackRecentView })),
  { ssr: false }
);

export const EmbedButton = dynamic(
  () => import("@/components/comparison/EmbedButton").then((m) => ({ default: m.EmbedButton })),
  { ssr: false, loading: () => null }
);

export const ComparisonPoll = dynamic(
  () => import("@/components/engagement/ComparisonPoll").then((m) => ({ default: m.ComparisonPoll })),
  { ssr: false, loading: () => null }
);

export const NewsletterSignup = dynamic(
  () => import("@/components/engagement/NewsletterSignup").then((m) => ({ default: m.NewsletterSignup })),
  { ssr: false, loading: () => null }
);

export const CommentSection = dynamic(
  () => import("@/components/engagement/CommentSection").then((m) => ({ default: m.CommentSection })),
  { ssr: false, loading: () => null }
);

export const VersionHistory = dynamic(
  () => import("@/components/comparison/VersionHistory").then((m) => ({ default: m.VersionHistory })),
  { ssr: false, loading: () => null }
);

export const StickyAffiliateCTA = dynamic(
  () => import("@/components/comparison/StickyAffiliateCTA").then((m) => ({ default: m.StickyAffiliateCTA })),
  { ssr: false, loading: () => null }
);

export const ConversionFunnelTracker = dynamic(
  () => import("@/components/engagement/ConversionFunnelTracker").then((m) => ({ default: m.ConversionFunnelTracker })),
  { ssr: false, loading: () => null }
);

export const ShareBar = dynamic(
  () => import("@/components/engagement/ShareBar").then((m) => ({ default: m.ShareBar })),
  { ssr: false, loading: () => null }
);

export const LikeButton = dynamic(
  () => import("@/components/engagement/LikeButton").then((m) => ({ default: m.LikeButton })),
  { ssr: false, loading: () => null }
);

export const BackToResults = dynamic(
  () => import("@/components/comparison/BackToResults").then((m) => ({ default: m.BackToResults })),
  { ssr: false, loading: () => null }
);

export const TableOfContents = dynamic(
  () => import("@/components/comparison/TableOfContents").then((m) => ({ default: m.TableOfContents })),
  { ssr: false, loading: () => null }
);
