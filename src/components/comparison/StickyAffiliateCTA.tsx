"use client";

import { useState, useEffect, useRef } from "react";
import type { ComparisonEntityData } from "@/types";
import { trackEvent } from "@/lib/utils/analytics";
import { useExperiment } from "@/lib/experiments";

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

function ctaLabel(
  entity: ComparisonEntityData,
  isTreatment: boolean,
): string {
  if (isGenericLink(entity)) return `Learn about ${entity.name}`;
  if (isBrandLink(entity)) return `Get ${entity.name}`;
  return `${isTreatment ? "Get" : "Buy"} ${entity.name}`;
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
  const sentinelRef = useRef<HTMLDivElement>(null);
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

    // "sticky-bottom" (default) and "control": observe verdict section
    const target =
      document.getElementById("verdict-sentinel") ||
      document.querySelector("[data-verdict]");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show when verdict scrolls out of view (above viewport)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasLinks, slug, placementVariant]);

  if (!hasLinks || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`affiliate_cta_dismissed_${slug}`, "1");
    }
  };

  const handleClick = (entity: ComparisonEntityData, position: string) => {
    const isEntityGeneric = isGenericLink(entity);
    trackEvent(isEntityGeneric ? "generic_cta_click" : "affiliate_click", {
      product: entity.name,
      position,
      page: slug,
      source: placementVariant === "inline-verdict" ? "inline_cta" : "sticky_cta",
      cta_variant: ctaVariant,
      cta_placement: placementVariant,
      cta_type: isEntityGeneric ? "learn_more" : "affiliate",
    });
  };

  const linkA = entityA?.affiliateLinks?.[0];
  const linkB = entityB?.affiliateLinks?.[0];

  return (
    <>
      {/* Sentinel element placed near verdict for IntersectionObserver */}
      <div ref={sentinelRef} />

      {/* CTA bar — sticky-bottom or inline depending on experiment */}
      <div
        className={`${
          placementVariant === "inline-verdict"
            ? `relative ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-300`
            : `fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`
        }`}
        style={placementVariant !== "inline-verdict" ? { paddingBottom: "env(safe-area-inset-bottom, 0px)" } : undefined}
      >
        <div className="bg-white/96 backdrop-blur-xl border-t border-border shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* CTA buttons */}
            <div className="flex-1 flex items-center gap-2">
              {linkA && entityA && (
                <a
                  href={linkA.url}
                  target="_blank"
                  rel={isGenericLink(entityA) ? "noopener noreferrer" : "noopener noreferrer nofollow sponsored"}
                  onClick={() => handleClick(entityA, "left")}
                  className={`flex-1 inline-flex flex-col items-center justify-center gap-0.5 px-4 py-2 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                    isGenericLink(entityA)
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : isTreatment
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                        : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  }`}
                >
                  <span className="text-[10px] font-medium text-white/70 truncate max-w-full leading-none">
                    {entityA.name}
                  </span>
                  <span className="text-sm font-bold truncate max-w-full leading-tight">
                    {isGenericLink(entityA) ? "Learn More" : isTreatment ? "Get Deal" : "Buy Now"}
                  </span>
                </a>
              )}

              {linkA && linkB && (
                <div className="flex-shrink-0 flex flex-col items-center gap-0.5">
                  <div className="w-px h-4 bg-border" />
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">vs</span>
                  <div className="w-px h-4 bg-border" />
                </div>
              )}

              {linkB && entityB && (
                <a
                  href={linkB.url}
                  target="_blank"
                  rel={isGenericLink(entityB) ? "noopener noreferrer" : "noopener noreferrer nofollow sponsored"}
                  onClick={() => handleClick(entityB, "right")}
                  className={`flex-1 inline-flex flex-col items-center justify-center gap-0.5 px-4 py-2 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                    isGenericLink(entityB)
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : isTreatment
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                        : "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700"
                  }`}
                >
                  <span className="text-[10px] font-medium text-white/70 truncate max-w-full leading-none">
                    {entityB.name}
                  </span>
                  <span className="text-sm font-bold truncate max-w-full leading-tight">
                    {isGenericLink(entityB) ? "Learn More" : isTreatment ? "Get Deal" : "Buy Now"}
                  </span>
                </a>
              )}
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-alt hover:bg-primary-50 flex items-center justify-center text-text-secondary hover:text-primary-600 transition-all duration-150"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
