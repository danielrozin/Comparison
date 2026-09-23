"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackPricingCtaClick } from "@/lib/utils/analytics";

/** `/pricing?src=` for a lander. Empty src falls back to `direct`. */
export function pricingHref(src: string): string {
  const value = src.trim() || "direct";
  return `/pricing?src=${encodeURIComponent(value)}`;
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
}: {
  src: string;
  placement?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={pricingHref(src)}
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
}: SoftPricingLineProps) {
  const onDark = tone === "onDark";
  return (
    <p
      className={`text-sm ${onDark ? "text-primary-100" : "text-text-secondary"} ${className}`.trim()}
    >
      {lead}{" "}
      <TrackedPricingLink
        src={src}
        placement="soft-line"
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
