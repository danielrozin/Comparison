"use client";

import { SOURCE_PAGE_ATTR } from "@/lib/analytics/internal-source";
import { useEffect, useRef } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import type { AffiliateLink, ComparisonEntityData } from "@/types";
import { trackAffiliateClick, trackAffiliateCtaViewed, trackEvent } from "@/lib/utils/analytics";
import { usePaidAffiliateHref } from "@/lib/hooks/usePaidAffiliateHref";
import { COMPARE_NEXT_SOFT_HREF } from "@/lib/data/compare-next-constants";
import { affiliateCtaLabel } from "@/lib/affiliate/affiliate-cta-label";
import type { CompareNextStepChip } from "@/components/comparison/CompareNextStepCTA";
import { AffiliateDisclosure } from "./AffiliateDisclosure";

/**
 * Compact affiliate / next-compare action that shares a card with
 * SoftPricingLine. SoftPricingLine is rendered by the page, not here.
 * That line fires `pricing_cta_click` with placement=under-verdict-pro
 * and src=compare-{slug}. This row keeps its own placement name.
 *
 * Placement name is `under-verdict` (ROO-55). On a 390×667 phone the verdict
 * section is thousands of pixels down and the cookie banner covers everything
 * below ~413px, so this row lives in the above-fold band with the pricing line.
 */

const PLACEMENT = "under-verdict";

function commercialLink(entity: ComparisonEntityData | undefined): AffiliateLink | null {
  const link = entity?.affiliateLinks?.[0];
  if (!link || link.partner === "generic") return null;
  return link;
}

/**
 * ROO-411: Amazon buttons name the product ("Check RTX 5070 price on Amazon").
 * Shop links only reach this row on buyable-product compares; the page strips
 * them everywhere else (classifyAffiliateCompare).
 */
function ctaText(link: AffiliateLink, entityName: string): string {
  if (link.partner === "brand") return "Official Site";
  if (link.partner === "amazon") return affiliateCtaLabel(entityName, "amazon");
  return "Check Price";
}

function pageSrc(slug: string): string {
  return `compare-${slug}`;
}

export function CompareUnderVerdictNextStep({
  entities,
  slug,
  chips,
}: {
  entities: ComparisonEntityData[];
  slug: string;
  chips: CompareNextStepChip[];
}) {
  const commercial = entities.filter((entity) => commercialLink(entity));
  // ROO-411: early commerce (one product-named button per entity, full width
  // on phones, Associate disclosure) now covers every compare whose shop links
  // are all Amazon. Those links survive only on buyable-product compares.
  const shopOnAmazon =
    commercial.length > 0 &&
    commercial.every((entity) => commercialLink(entity)?.partner === "amazon");
  const anyAmazon = commercial.some((entity) => commercialLink(entity)?.partner === "amazon");
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rowRef.current;
    if (!node || commercial.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;

    let seen = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some(
          (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5,
        );
        if (!visible || seen) return;
        // A denied call returns false and is not stored. The row can be
        // counted later only if it leaves and re-enters the viewport after
        // PostHog is already loaded. Staying on screen through a later
        // Accept is not replayed.
        const recorded = trackAffiliateCtaViewed(PLACEMENT, slug, {
          link_count: commercial.length,
          early_commerce: shopOnAmazon ? 1 : 0,
        });
        if (!recorded) return;
        seen = true;
        observer.disconnect();
      },
      { threshold: [0.5] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [slug, commercial.length, shopOnAmazon]);

  return (
    <div data-placement={PLACEMENT} data-early-commerce={shopOnAmazon ? "true" : "false"} className="mb-1.5">
      {commercial.length > 0 ? (
        <div ref={rowRef}>
          <div
            className={
              shopOnAmazon
                ? "flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
                : "flex flex-wrap items-center justify-center gap-2"
            }
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary sm:mr-0">
              Next step
            </span>
            {commercial.map((entity) => (
              <CommercialNextStep
                key={entity.id || entity.slug}
                entity={entity}
                slug={slug}
                fullWidth={shopOnAmazon}
                earlyCommerce={shopOnAmazon}
              />
            ))}
          </div>
          {anyAmazon ? <AffiliateDisclosure /> : null}
        </div>
      ) : (
        <FallbackNextStep slug={slug} chips={chips} />
      )}
    </div>
  );
}

function CommercialNextStep({
  entity,
  slug,
  fullWidth = false,
  earlyCommerce = false,
}: {
  entity: ComparisonEntityData;
  slug: string;
  fullWidth?: boolean;
  earlyCommerce?: boolean;
}) {
  const link = commercialLink(entity);
  const href = usePaidAffiliateHref(link?.url ?? "");
  if (!link) return null;

  const label = ctaText(link, entity.name);
  const named = link.partner === "amazon";
  const src = pageSrc(slug);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      aria-label={named ? label : `${label} — ${entity.name}`}
      data-entity={entity.name}
      className={`inline-flex max-w-full items-center justify-center gap-1.5 min-h-11 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
        fullWidth ? "w-full sm:w-auto" : ""
      }`}
      onClick={() => {
        trackAffiliateClick(entity.name, PLACEMENT, slug, {
          url: href,
          partner: link.partner,
          label: link.label,
          src,
          source_page: src,
          cta_type: "affiliate",
          early_commerce: earlyCommerce ? 1 : 0,
        });
      }}
    >
      {named ? (
        <span className="truncate">{label}</span>
      ) : (
        <>
          <span className="truncate max-w-[9rem] font-medium text-white/80">{entity.name}</span>
          <span className="whitespace-nowrap">{label}</span>
        </>
      )}
    </a>
  );
}

function FallbackNextStep({
  slug,
  chips,
}: {
  slug: string;
  chips: CompareNextStepChip[];
}) {
  const primary = chips[0] ?? null;
  const target = primary ? primary.slug : COMPARE_NEXT_SOFT_HREF;
  const href = primary ? `/compare/${primary.slug}` : COMPARE_NEXT_SOFT_HREF;
  const src = pageSrc(slug);

  const label = primary ? `Compare ${primary.label}` : "Browse trending";

  function track() {
    const props = {
      source_page: src,
      target_page: target,
      placement: PLACEMENT,
      src,
    };
    // Same event as CompareNextStepCTA (`related_comparison_click`), plus the
    // placement/src this block needs. trackEvent is GA today; PostHog capture
    // is the one send. Do not also call trackRelatedComparisonClick.
    trackEvent("related_comparison_click", props);
    posthog.capture("related_comparison_click", props);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
        Next step
      </span>
      <Link
        href={href}
        {...{ [SOURCE_PAGE_ATTR]: src }}
        onClick={track}
        className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <span className="truncate max-w-[16rem]">{label}</span>
      </Link>
    </div>
  );
}
