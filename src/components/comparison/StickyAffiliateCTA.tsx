"use client";

import { useState, useEffect } from "react";
import type { ComparisonEntityData } from "@/types";
import { trackAffiliateClick, trackEvent } from "@/lib/utils/analytics";
import { useExperiment } from "@/lib/experiments";
import { usePaidAffiliateHref } from "@/lib/hooks/usePaidAffiliateHref";

const PRODUCT_CATEGORIES = new Set([
  "technology",
  "products",
  "software",
  "automotive",
  "gaming",
  "electronics",
  "appliances",
  "fitness",
]);

function isGenericLink(entity: ComparisonEntityData): boolean {
  return entity.affiliateLinks?.[0]?.partner === "generic";
}

// Brand-homepage CTA for a digital product with no affiliate program yet — a
// real, sponsored destination, not a Google "Learn more". (DAN-1140)
function isBrandLink(entity: ComparisonEntityData): boolean {
  return entity.affiliateLinks?.[0]?.partner === "brand";
}

function ctaLabel(entity: ComparisonEntityData): string {
  if (isGenericLink(entity)) return `Learn about ${entity.name}`;
  if (isBrandLink(entity)) return `Visit the official ${entity.name} site`;
  return `Check ${entity.name} price`;
}

// "Buy Now" reads as a hard-sell on a comparison page (and is simply wrong for
// entities like cars that aren't sold at the destination). Partner-aware,
// professional wording instead.
function ctaText(entity: ComparisonEntityData): string {
  if (isGenericLink(entity)) return "Learn More";
  if (isBrandLink(entity)) return "Official Site";
  return "Check Price";
}

/** Show the sticky bar once the visitor has moved past the first screenful of chrome. */
export const STICKY_AFFILIATE_SHOW_AFTER_PX = 150;

/** Minimum gap between the above-fold next-step card and this bar on a phone. */
const STICKY_CLEARANCE_PX = 80;

function isMobileViewport(): boolean {
  return window.innerWidth < 768;
}

function occupiedBottomPx(): number {
  let offset = 0;
  if (isMobileViewport()) {
    const nav = document.querySelector('nav[aria-label="Mobile bottom navigation"]');
    if (nav) {
      const rect = nav.getBoundingClientRect();
      if (rect.height > 0 && rect.top < window.innerHeight) {
        offset = Math.max(offset, Math.round(window.innerHeight - rect.top));
      }
    }
  }
  const banner = document.querySelector('[aria-label="Cookie consent"]');
  if (banner) {
    const rect = banner.getBoundingClientRect();
    if (rect.height > 0 && rect.top < window.innerHeight) {
      offset = Math.max(offset, Math.round(window.innerHeight - rect.top));
    }
  }
  return offset;
}

/** True when the bar would sit on the cookie buttons or the above-fold next step. */
function stickyWouldCoverContent(offset: number): boolean {
  if (!isMobileViewport()) return false;
  const block = document.getElementById("compare-under-verdict");
  if (!block) return false;
  const blockBottom = block.getBoundingClientRect().bottom;
  const banner = document.querySelector('[aria-label="Cookie consent"]');
  if (banner) {
    const bannerTop = banner.getBoundingClientRect().top;
    if (bannerTop - blockBottom < STICKY_CLEARANCE_PX) return true;
  }
  const barTop = window.innerHeight - offset - STICKY_CLEARANCE_PX;
  return barTop < blockBottom + 8;
}

export function StickyAffiliateCTA({
  entities,
  category,
  slug,
}: {
  entities: ComparisonEntityData[];
  category: string | null;
  slug: string;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(0);
  const { variant: ctaVariant } = useExperiment("cta-button-style");
  const { variant: placementVariant } = useExperiment("cta-placement");
  const isTreatment = ctaVariant === "treatment";

  const isProductCategory =
    category != null && PRODUCT_CATEGORIES.has(category.toLowerCase());
  const entityA = entities[0];
  const entityB = entities[1];
  const hasLinks =
    (entityA?.affiliateLinks?.length ?? 0) > 0 ||
    (entityB?.affiliateLinks?.length ?? 0) > 0;
  const isGeneric = entityA ? isGenericLink(entityA) : false;

  const linkA = entityA?.affiliateLinks?.[0];
  const linkB = entityB?.affiliateLinks?.[0];
  // Hooks must run before the early returns below, so resolve both hrefs here.
  const hrefA = usePaidAffiliateHref(linkA?.url ?? "");
  const hrefB = usePaidAffiliateHref(linkB?.url ?? "");

  useEffect(() => {
    if (!hasLinks) return;

    // Check sessionStorage for dismissal
    const key = `affiliate_cta_dismissed_${slug}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
      setDismissed(true);
      return;
    }

    // "inline-verdict" variant: always visible inline (no sticky behavior)
    if (placementVariant === "inline-verdict") {
      setVisible(true);
      return;
    }

    // ROO-55: the verdict is far below the fold, so waiting for it to leave
    // the viewport meant almost nobody saw this bar. Show after a short scroll.
    const update = () => {
      const offset = occupiedBottomPx();
      const show =
        window.scrollY >= STICKY_AFFILIATE_SHOW_AFTER_PX &&
        !stickyWouldCoverContent(offset);
      setBottomOffset((prev) => (prev === offset ? prev : offset));
      setVisible(show);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // Cookie banner mounts ~800ms after load; don't watch the whole page.
    const timer = window.setInterval(update, 500);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearInterval(timer);
    };
  }, [hasLinks, slug, placementVariant]);

  if (!hasLinks || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`affiliate_cta_dismissed_${slug}`, "1");
    }
  };

  const handleClick = (
    entity: ComparisonEntityData,
    position: string,
    url: string,
  ) => {
    const isEntityGeneric = isGenericLink(entity);
    // `source` stays sticky_cta / inline_cta. The sticky bar's placement is
    // `sticky` so PostHog can split it from the under-verdict row.
    const source =
      placementVariant === "inline-verdict" ? "inline_cta" : "sticky_cta";
    const placement =
      placementVariant === "inline-verdict" ? "inline_cta" : "sticky";
    if (isEntityGeneric) {
      trackEvent("generic_cta_click", {
        product: entity.name,
        position,
        page: slug,
        placement,
        source,
        cta_variant: ctaVariant,
        cta_placement: placementVariant,
        cta_type: "learn_more",
      });
      return;
    }
    trackAffiliateClick(entity.name, placement, slug, {
      url,
      position,
      partner: entity.affiliateLinks?.[0]?.partner ?? "",
      label: entity.affiliateLinks?.[0]?.label ?? "",
      source,
      cta_variant: ctaVariant,
      cta_placement: placementVariant,
      cta_type: "affiliate",
    });
  };

  return (
    <>
      {/* CTA bar — sticky-bottom or inline depending on experiment.
          z-50 stays under the cookie dialog (z-60). bottomOffset lifts the
          bar above the cookie buttons and the mobile nav. */}
      <div
        role="region"
        aria-label="Comparison purchase options"
        data-visible={visible ? "true" : "false"}
        className={`${
          placementVariant === "inline-verdict"
            ? `relative ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-300`
            : `fixed left-0 right-0 z-50 transition-transform duration-300 ${
                visible ? "translate-y-0" : "translate-y-[100vh] pointer-events-none"
              }`
        }`}
        style={
          placementVariant !== "inline-verdict"
            ? {
                bottom: bottomOffset,
                paddingBottom:
                  bottomOffset > 0 ? undefined : "env(safe-area-inset-bottom, 0px)",
              }
            : undefined
        }
      >
        <div className="bg-white/96 backdrop-blur-xl border-t border-border shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* CTA buttons */}
            <div className="flex-1 flex items-center gap-2">
              {linkA && entityA && (
                <a
                  href={hrefA}
                  target="_blank"
                  rel={isGenericLink(entityA) ? "noopener noreferrer" : "noopener noreferrer nofollow sponsored"}
                  aria-label={ctaLabel(entityA)}
                  onClick={() => handleClick(entityA, "left", hrefA)}
                  className={`flex-1 inline-flex flex-col items-center justify-center gap-0.5 px-4 py-2 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isGenericLink(entityA)
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : isTreatment
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                        : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  }`}
                >
                  <span className="text-xs font-medium text-white/70 truncate max-w-full leading-none">
                    {entityA.name}
                  </span>
                  <span className="text-sm font-bold truncate max-w-full leading-tight">
                    {ctaText(entityA)}
                  </span>
                </a>
              )}

              {linkA && linkB && (
                <div className="flex-shrink-0 flex flex-col items-center gap-0.5" aria-hidden="true">
                  <div className="w-px h-4 bg-border" />
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">vs</span>
                  <div className="w-px h-4 bg-border" />
                </div>
              )}

              {linkB && entityB && (
                <a
                  href={hrefB}
                  target="_blank"
                  rel={isGenericLink(entityB) ? "noopener noreferrer" : "noopener noreferrer nofollow sponsored"}
                  aria-label={ctaLabel(entityB)}
                  onClick={() => handleClick(entityB, "right", hrefB)}
                  className={`flex-1 inline-flex flex-col items-center justify-center gap-0.5 px-4 py-2 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isGenericLink(entityB)
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : isTreatment
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                        : "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
                  }`}
                >
                  <span className="text-xs font-medium text-white/70 truncate max-w-full leading-none">
                    {entityB.name}
                  </span>
                  <span className="text-sm font-bold truncate max-w-full leading-tight">
                    {ctaText(entityB)}
                  </span>
                </a>
              )}
            </div>

            {/* Dismiss button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-alt hover:bg-primary-50 flex items-center justify-center text-text-secondary hover:text-primary-600 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="Dismiss comparison offers bar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
