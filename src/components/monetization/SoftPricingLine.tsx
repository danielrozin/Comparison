"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackPricingCtaClick } from "@/lib/utils/analytics";

/**
 * `/pricing?src=` for a lander. Empty src falls back to `direct`.
 * Pass `placement` only when that control should show up on the URL.
 * Leave it off for the default soft line so existing hrefs stay `/pricing?src=…`.
 */
export function pricingHref(src: string, placement?: string): string {
  const value = src.trim() || "direct";
  const base = `/pricing?src=${encodeURIComponent(value)}`;
  if (!placement) return base;
  return `${base}&placement=${encodeURIComponent(placement)}`;
}

/**
 * Link to pricing that records `pricing_cta_click` with the lander `src`.
 * The pricing page then fires `pricing_viewed` with the same `src`.
 */
export function TrackedPricingLink({
  src,
  placement = "soft-line",
  className,
  children,
  href,
}: {
  src: string;
  placement?: string;
  className?: string;
  children: ReactNode;
  /** Set when the href needs `&placement=` as well as `?src=`. */
  href?: string;
}) {
  return (
    <Link
      href={href ?? pricingHref(src)}
      onClick={() => trackPricingCtaClick(src.trim() || "direct", placement)}
      className={className}
    >
      {children}
    </Link>
  );
}

export interface SoftPricingLineProps {
  /** Lander slug written to `/pricing?src=` (blog, blog-{slug}, compare-{slug}, …). */
  src: string;
  /** light: body text on a white page. onDark: one line inside a dark hero. */
  tone?: "light" | "onDark";
  lead?: string;
  label?: string;
  className?: string;
  /**
   * Which control fired `pricing_cta_click`. Defaults to `soft-line` so
   * existing landers keep the same event and the same `/pricing?src=` href.
   * Any other value is also written to `&placement=` on the href.
   */
  placement?: string;
}

/**
 * One-line Pro / pricing link. Same voice as the /trending soft line:
 * a sentence plus a text link, not a modal or a second hero.
 */
export function SoftPricingLine({
  src,
  tone = "light",
  lead = "Need a matchup we haven't published?",
  label = "See Pro pricing",
  className = "",
  placement = "soft-line",
}: SoftPricingLineProps) {
  const onDark = tone === "onDark";
  // Default soft-line href stays `/pricing?src=` with no placement query.
  const href = placement === "soft-line" ? undefined : pricingHref(src, placement);
  return (
    <p
      className={`text-sm ${onDark ? "text-primary-100" : "text-text-secondary"} ${className}`.trim()}
    >
      {lead ? `${lead} ` : null}
      <TrackedPricingLink
        src={src}
        placement={placement}
        href={href}
        className={
          onDark
            ? "font-semibold text-white underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded"
            : "font-semibold text-primary-600 hover:text-primary-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
        }
      >
        {label}
      </TrackedPricingLink>
    </p>
  );
}
