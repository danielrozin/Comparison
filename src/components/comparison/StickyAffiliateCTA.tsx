"use client";

import { useState, useEffect, useRef } from "react";
import type { ComparisonEntityData } from "@/types";
import { trackEvent } from "@/lib/utils/analytics";

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

  // Only show on product-related categories with affiliate links
  const isProductCategory =
    category != null && PRODUCT_CATEGORIES.has(category.toLowerCase());
  const entityA = entities[0];
  const entityB = entities[1];
  const hasLinks =
    (entityA?.affiliateLinks?.length ?? 0) > 0 ||
    (entityB?.affiliateLinks?.length ?? 0) > 0;

  useEffect(() => {
    if (!isProductCategory || !hasLinks) return;

    // Check sessionStorage for dismissal
    const key = `affiliate_cta_dismissed_${slug}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
      setDismissed(true);
      return;
    }

    // Observe the verdict section — show bar after scrolling past it
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
  }, [isProductCategory, hasLinks, slug]);

  if (!isProductCategory || !hasLinks || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`affiliate_cta_dismissed_${slug}`, "1");
    }
  };

  const handleClick = (entity: ComparisonEntityData, position: string) => {
    trackEvent("affiliate_click", {
      product: entity.name,
      position,
      page: slug,
      source: "sticky_cta",
    });
  };

  const linkA = entityA?.affiliateLinks?.[0];
  const linkB = entityB?.affiliateLinks?.[0];

  return (
    <>
      {/* Sentinel element placed near verdict for IntersectionObserver */}
      <div ref={sentinelRef} />

      {/* Sticky bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* CTA buttons */}
            <div className="flex-1 flex items-center gap-2">
              {linkA && entityA && (
                <a
                  href={linkA.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => handleClick(entityA, "left")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors truncate"
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="truncate">Buy {entityA.name}</span>
                </a>
              )}
              {linkB && entityB && (
                <a
                  href={linkB.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  onClick={() => handleClick(entityB, "right")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors truncate"
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="truncate">Buy {entityB.name}</span>
                </a>
              )}
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
