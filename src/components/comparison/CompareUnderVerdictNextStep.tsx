"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { AffiliateLink, ComparisonEntityData } from "@/types";
import { trackAffiliateClick, trackEvent } from "@/lib/utils/analytics";
import { usePaidAffiliateHref } from "@/lib/hooks/usePaidAffiliateHref";
import { COMPARE_NEXT_SOFT_HREF } from "@/lib/data/compare-next-constants";
import type { CompareNextStepChip } from "@/components/comparison/CompareNextStepCTA";

/**
 * Compact affiliate / next-compare action that shares a card with
 * SoftPricingLine. SoftPricingLine itself is not rendered here — the page
 * keeps that element unchanged so `pricing_cta_click` stays
 * placement=soft-line, src=compare-{slug}.
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

function ctaText(link: AffiliateLink): string {
  if (link.partner === "brand") return "Official Site";
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

  return (
    <div data-placement={PLACEMENT} className="mb-1.5">
      {commercial.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
            Next step
          </span>
          {commercial.map((entity) => (
            <CommercialNextStep
              key={entity.id || entity.slug}
              entity={entity}
              slug={slug}
            />
          ))}
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
}: {
  entity: ComparisonEntityData;
  slug: string;
}) {
  const link = commercialLink(entity);
  const href = usePaidAffiliateHref(link?.url ?? "");
  if (!link) return null;

  const label = ctaText(link);
  const src = pageSrc(slug);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      aria-label={`${label} — ${entity.name}`}
      data-entity={entity.name}
      className="inline-flex max-w-full items-center gap-1.5 min-h-11 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      onClick={() => {
        trackAffiliateClick(entity.name, PLACEMENT, slug, {
          url: href,
          partner: link.partner,
          label: link.label,
          src,
          source_page: src,
          cta_type: "affiliate",
        });
      }}
    >
      <span className="truncate max-w-[9rem] font-medium text-white/80">{entity.name}</span>
      <span className="whitespace-nowrap">{label}</span>
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
  const withSource = href.includes("?")
    ? `${href}&source_page=${encodeURIComponent(src)}`
    : `${href}?source_page=${encodeURIComponent(src)}`;
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
        href={withSource}
        onClick={track}
        className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <span className="truncate max-w-[16rem]">{label}</span>
      </Link>
    </div>
  );
}
