"use client";

import type { ComparisonEntityData } from "@/types";
import { trackEvent } from "@/lib/utils/analytics";

const AFFILIATE_ENABLED = process.env.NEXT_PUBLIC_AFFILIATE_ENABLED === "true";

function hasRealAffiliateLink(entity: ComparisonEntityData): boolean {
  return (
    (entity.affiliateLinks?.length ?? 0) > 0 &&
    entity.affiliateLinks![0].partner !== "generic"
  );
}

export function BestDealBanner({
  entities,
  category,
}: {
  entities: ComparisonEntityData[];
  category: string | null;
}) {
  if (!AFFILIATE_ENABLED) return null;

  const eligibleEntities = entities.filter(hasRealAffiliateLink);
  if (eligibleEntities.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a.5.5 0 000 1h5a.5.5 0 000-1h-5zm0 3a.5.5 0 000 1h5a.5.5 0 000-1h-5zm0 3a.5.5 0 000 1h3a.5.5 0 000-1h-3z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-sm sm:text-base font-bold text-amber-900">
            Best Deals
          </h2>
          {category && (
            <span className="text-[10px] sm:text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
              {category}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {eligibleEntities.map((entity) => {
            const link = entity.affiliateLinks![0];
            return (
              <a
                key={entity.id || entity.slug}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                onClick={() => {
                  trackEvent("affiliate_click", {
                    affiliate_partner: link.partner,
                    source: "best_deal_banner",
                    product: entity.name,
                  });
                }}
                className="group flex items-center gap-3 bg-white rounded-lg p-3 sm:p-4 border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-amber-200 group-hover:to-orange-200 transition-colors">
                  <span className="text-lg sm:text-xl font-bold text-amber-700">
                    {entity.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-text truncate group-hover:text-amber-800 transition-colors">
                    {entity.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {link.label || `View on ${link.partner === "amazon" ? "Amazon" : "Store"}`}
                  </p>
                </div>
                <span className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm group-hover:shadow-md transition-all min-h-[44px] min-w-[44px] justify-center">
                  <svg
                    className="w-4 h-4"
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
                  <span className="hidden sm:inline">View Deal</span>
                </span>
              </a>
            );
          })}
        </div>

        <p className="text-[10px] text-amber-600/70 mt-2">
          Prices may vary. As an affiliate, we may earn from qualifying purchases.
        </p>
      </div>
    </section>
  );
}
