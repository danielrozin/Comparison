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
  // Reserve the 32px button square so the share/like row above the hero
  // doesn't grow when this hydrates — was a top CLS contributor on mobile.
  { ssr: false, loading: () => <div className="w-8 h-8" aria-hidden="true" /> }
);

export const ComparisonPoll = dynamic(
  () => import("@/components/engagement/ComparisonPoll").then((m) => ({ default: m.ComparisonPoll })),
  // The poll renders just below the verdict and is usually still above the
  // fold on mobile — reserve its mounted height so it doesn't cause a shift.
  {
    ssr: false,
    loading: () => (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-hidden="true">
        <div className="min-h-[208px]" />
      </section>
    ),
  }
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
  // Reserve a 32px tall row matching the icon buttons — prevents the hero
  // sliding down when the share row hydrates.
  { ssr: false, loading: () => <div className="h-8" aria-hidden="true" /> }
);

export const LikeButton = dynamic(
  () => import("@/components/engagement/LikeButton").then((m) => ({ default: m.LikeButton })),
  { ssr: false, loading: () => <div className="w-8 h-8" aria-hidden="true" /> }
);

export const BackToResults = dynamic(
  () => import("@/components/comparison/BackToResults").then((m) => ({ default: m.BackToResults })),
  { ssr: false, loading: () => null }
);

export const TableOfContents = dynamic(
  () => import("@/components/comparison/TableOfContents").then((m) => ({ default: m.TableOfContents })),
  // The mobile/tablet TOC is a 48px collapsible bar wrapped in `mb-4` (16px)
  // and placed above the hero — without a placeholder, mounting it pushed the
  // LCP element down by ~64px. Reserve that space upfront.
  {
    ssr: false,
    loading: () => (
      <div className="min-[1700px]:hidden max-w-5xl mx-auto px-4 sm:px-6 mb-4" aria-hidden="true">
        <div className="h-12" />
      </div>
    ),
  }
);
