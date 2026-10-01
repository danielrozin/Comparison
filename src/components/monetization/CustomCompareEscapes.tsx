"use client";

import { TrackedCompareLink } from "@/components/home/HomeCompareCTA";
import { pricingHref, TrackedPricingLink } from "@/components/monetization/SoftPricingLine";
import {
  CUSTOM_COMPARE_PRICING_PLACEMENT,
  CUSTOM_COMPARE_PRICING_SRC,
  CUSTOM_COMPARE_SOURCE_PAGE,
  type CustomCompareEscape,
} from "@/lib/data/custom-compare-escapes";

/**
 * Live /compare links plus the Pro pricing CTA.
 * Compare clicks use TrackedCompareLink (`related_comparison_click` and
 * `?source_page=`). Pricing uses TrackedPricingLink (`pricing_cta_click`
 * and `?src=`), and the href also carries `source_page` so the lander
 * is on the URL.
 */
export function CustomCompareEscapes({
  links,
  tone = "light",
}: {
  links: readonly CustomCompareEscape[];
  tone?: "onDark" | "light";
}) {
  const onDark = tone === "onDark";
  const pricingUrl = `${pricingHref(CUSTOM_COMPARE_PRICING_SRC, CUSTOM_COMPARE_PRICING_PLACEMENT)}&source_page=${encodeURIComponent(CUSTOM_COMPARE_SOURCE_PAGE)}`;

  return (
    <section
      aria-label="Ways to continue"
      data-testid="custom-compare-escapes"
      className={
        onDark
          ? "rounded-2xl bg-white/10 p-4 ring-1 ring-white/20"
          : "rounded-xl border border-border bg-white p-4"
      }
    >
      {links.length > 0 ? (
        <nav aria-label="Popular comparisons">
          <p className={`text-sm font-semibold ${onDark ? "text-white" : "text-text"}`}>
            Popular comparisons
          </p>
          <ul className="mt-2 flex flex-col gap-2 list-none m-0 p-0">
            {links.map((link) => (
              <li key={link.slug}>
                <TrackedCompareLink
                  slug={link.slug}
                  source={CUSTOM_COMPARE_SOURCE_PAGE}
                  className={
                    onDark
                      ? "inline-flex min-h-11 items-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-primary-900 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      : "inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  }
                >
                  {link.label}
                </TrackedCompareLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <p className={`text-sm ${links.length > 0 ? "mt-3" : ""} ${onDark ? "text-primary-100" : "text-text-secondary"}`}>
        Pro adds 2 custom comparison requests a month and priority on comparisons you vote for.{" "}
        <TrackedPricingLink
          src={CUSTOM_COMPARE_PRICING_SRC}
          placement={CUSTOM_COMPARE_PRICING_PLACEMENT}
          href={pricingUrl}
          className={
            onDark
              ? "font-semibold text-white underline underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
              : "font-semibold text-primary-700 underline underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          }
        >
          See Pro pricing
        </TrackedPricingLink>
      </p>
    </section>
  );
}
