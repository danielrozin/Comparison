"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { trackRelatedComparisonClick } from "@/lib/utils/analytics";
import {
  HOME_COMPARE_SOFT_HREF,
  HOME_COMPARE_SOURCE,
  HOME_COMPARE_TRENDING_HREF,
} from "@/lib/data/home-compare-constants";
import { buildPopularCompareDestinations } from "@/lib/data/hub-popular-compares";

export interface HomeCompareChip {
  slug: string;
  label: string;
}

export interface HomeCompareCTAProps {
  /** Primary live compare for the main CTA button. */
  primarySlug?: string | null;
  primaryTitle?: string | null;
  /** Live chip targets already filtered server-side (DAN-2581). */
  chips?: HomeCompareChip[];
  /** PostHog source_page for related_comparison_click (default: home). */
  source?: string;
  /**
   * Soft explore href when no live primary (e.g. /search on /blog hub).
   * When set, the primary button is a Link instead of focusSearch —
   * required on pages without a #search input.
   */
  softHref?: string;
  /**
   * glass: translucent card on the home hero.
   * solid: white card with a filled button so blog heroes read as a compare CTA.
   */
  variant?: "glass" | "solid";
  /**
   * Secondary /trending link. Off on blog surfaces and on /trending itself:
   * that click never mounts a /compare/* page, so it cannot fire comparison_viewed.
   */
  showTrending?: boolean;
  /**
   * ROO-51: put a compact compare link at the top of the hero and hide the
   * bottom sticky bar. The cookie banner is `fixed` at `z-[60]` and about
   * 362px tall on a phone, so it covers the in-hero "Compare now" button
   * (and the old bottom bar) on viewports around 667–700px. A link in normal
   * flow under the breadcrumb stays above that banner.
   */
  mobileLead?: boolean;
  /**
   * ROO-53: on /blog and /trending, replace the single mobile button with a
   * short stack of real compare cards. A "Compare now" label was above the
   * banner after ROO-51, but short visits still left without opening
   * /compare/*. Two named cards under the breadcrumb stay in the clear band
   * above that banner on a 390×667 phone.
   */
  popularCards?: boolean;
}

/** `/compare/:slug?source_page=` link that records related_comparison_click. */
export function TrackedCompareLink({
  slug,
  source,
  className,
  children,
}: {
  slug: string;
  source: string;
  className?: string;
  children: ReactNode;
}) {
  const href = `/compare/${slug}?source_page=${encodeURIComponent(source)}`;
  return (
    <Link href={href} onClick={() => trackRelatedComparisonClick(source, slug)} className={className}>
      {children}
    </Link>
  );
}

/**
 * Above-the-fold home → compare CTA + sticky mobile bar.
 * ROO-16: push `/` landers into live `/compare/*` with tracking
 * (`related_comparison_click` → page fires `comparison_viewed`).
 */
export function HomeCompareCTA({
  primarySlug,
  primaryTitle,
  chips = [],
  source = HOME_COMPARE_SOURCE,
  softHref,
  variant = "glass",
  showTrending = true,
  mobileLead = false,
  popularCards = false,
}: HomeCompareCTAProps) {
  const [showSticky, setShowSticky] = useState(false);
  const hasPrimary = Boolean(primarySlug);
  const exploreHref = softHref || HOME_COMPARE_SOFT_HREF;
  const primaryHref = hasPrimary ? `/compare/${primarySlug}` : exploreHref;
  const primaryLabel = hasPrimary
    ? primaryTitle || primarySlug!.replace(/-/g, " ")
    : "Explore side-by-side comparisons";
  const ctaVerb = hasPrimary ? "Compare now" : "Start a comparison";
  // Prefer Link softHref on non-home pages; focusSearch only when no softHref.
  const useFocusSearch = !hasPrimary && !softHref;
  const solid = variant === "solid";
  // Only slugs the page already resolved. Two cards fit above the cookie
  // banner; a longer list would land inside it on a 667px phone.
  const popularDestinations = popularCards
    ? buildPopularCompareDestinations(primarySlug, primaryLabel, chips, 2)
    : [];

  useEffect(() => {
    if (mobileLead) return;
    function onScroll() {
      const scrolled = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? scrolled / docH : 0;
      // Show after leaving hero; hide near footer
      setShowSticky(pct > 0.12 && pct < 0.88);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileLead]);

  function withSourcePage(href: string) {
    if (!source) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}source_page=${encodeURIComponent(source)}`;
  }

  function track(target: string) {
    trackRelatedComparisonClick(source, target);
  }

  function focusSearch() {
    track(exploreHref);
    const input = document.querySelector<HTMLInputElement>('#search input[type="text"]');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    window.location.hash = "search";
  }

  const primaryClass = solid
    ? "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-sm hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    : "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-primary-900 bg-white hover:bg-primary-50 shadow-sm hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70";

  const primaryButton = (hasPrimary || !useFocusSearch) ? (
    <Link
      href={withSourcePage(primaryHref)}
      onClick={() => track(hasPrimary ? primarySlug! : exploreHref)}
      className={primaryClass}
    >
      {ctaVerb}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={hasPrimary ? "M13 7l5 5m0 0l-5 5m5-5H6" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"} />
      </svg>
    </Link>
  ) : (
    <button
      type="button"
      onClick={focusSearch}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-primary-900 bg-white hover:bg-primary-50 shadow-sm hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {ctaVerb}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );

  return (
    <>
      {mobileLead && (
        <div className="md:hidden mb-3 text-left" data-testid="mobile-compare-lead">
          {popularDestinations.length > 0 ? (
            // In normal flow, not fixed. z-10 sits under the header (z-50) and
            // the cookie dialog (z-60). pointer-events-auto so a decorative
            // hero layer cannot swallow the tap. The dialog only captures
            // clicks on its own card, which these rows sit above on a 667px phone.
            <section
              aria-label="Popular compares"
              data-testid="popular-compares"
              className="relative z-10 pointer-events-auto rounded-2xl bg-white text-text shadow-lg ring-1 ring-black/10 p-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 mb-2">
                Popular compares
              </p>
              <ul className="flex flex-col gap-2 list-none m-0 p-0">
                {popularDestinations.map((item, index) => (
                  <li key={item.slug}>
                    <Link
                      href={withSourcePage(`/compare/${item.slug}`)}
                      onClick={() => track(item.slug)}
                      aria-label={`Compare ${item.label}`}
                      className={
                        index === 0
                          ? "flex w-full min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 px-3 py-2 text-sm font-bold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
                          : "flex w-full min-h-12 items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2 text-sm font-bold text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      }
                    >
                      <span
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                          index === 0 ? "bg-white/20 text-white" : "bg-white text-accent-600 ring-1 ring-primary-200"
                        }`}
                        aria-hidden="true"
                      >
                        VS
                      </span>
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <>
              {hasPrimary || !useFocusSearch ? (
                <Link
                  href={withSourcePage(primaryHref)}
                  onClick={() => track(hasPrimary ? primarySlug! : exploreHref)}
                  className="flex w-full min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <span>{ctaVerb}</span>
                  {hasPrimary && <span className="truncate font-semibold">{primaryLabel}</span>}
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={hasPrimary ? "M13 7l5 5m0 0l-5 5m5-5H6" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"} />
                  </svg>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={focusSearch}
                  className="flex w-full min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 shadow-md"
                >
                  {ctaVerb}
                </button>
              )}
              {chips.length > 0 && (
                <ul
                  className="mt-2 flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide list-none p-0"
                  aria-label="Popular comparisons"
                >
                  {chips.map((chip) => (
                    <li key={chip.slug} className="flex-shrink-0">
                      <Link
                        href={withSourcePage(`/compare/${chip.slug}`)}
                        onClick={() => track(chip.slug)}
                        className="inline-flex items-center gap-1.5 min-h-11 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                      >
                        <span className="text-[10px] font-black text-accent-300" aria-hidden="true">VS</span>
                        {chip.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
      <aside
        aria-label="Start a comparison"
        className={`${mobileLead ? "hidden md:block " : ""}${solid ? "mt-5 max-w-3xl" : "mt-8 max-w-2xl"} mx-auto animate-slide-up text-left`}
        style={{ animationDelay: "0.25s" }}
      >
        <div
          className={
            solid
              ? "rounded-2xl bg-white text-text shadow-lg ring-1 ring-black/10 p-3 sm:p-4 overflow-hidden"
              : "rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 p-4 sm:p-5 overflow-hidden"
          }
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-primary-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${solid ? "text-primary-600" : "text-accent-300"}`}>
                  {hasPrimary ? "Start a comparison" : "Ready to decide?"}
                </p>
                <p className={`text-sm sm:text-base font-bold leading-snug truncate sm:whitespace-normal ${solid ? "text-text" : "text-white"}`}>
                  {primaryLabel}
                </p>
                <p className={`text-xs mt-1 ${solid ? "text-text-secondary" : "text-primary-200"}`}>
                  {hasPrimary
                    ? "Jump into a live head-to-head — winners, verdict, and community votes."
                    : "Search any two options or browse trending side-by-sides."}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              {primaryButton}
              {showTrending && (
                <Link
                  href={withSourcePage(HOME_COMPARE_TRENDING_HREF)}
                  onClick={() => track(HOME_COMPARE_TRENDING_HREF)}
                  className={
                    solid
                      ? "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-primary-800 bg-primary-50 ring-1 ring-primary-200 hover:bg-primary-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      : "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-white/10 ring-1 ring-white/25 hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  }
                >
                  Trending
                </Link>
              )}
            </div>
          </div>

          {chips.length > 0 && (
            <ul
              className={`mt-3 flex gap-2 list-none p-0 ${
                solid ? "flex-nowrap overflow-x-auto scrollbar-hide" : "flex-wrap"
              }`}
              aria-label="Popular comparisons"
            >
              {chips.map((chip) => (
                <li key={chip.slug} className={solid ? "flex-shrink-0" : undefined}>
                  <Link
                    href={withSourcePage(`/compare/${chip.slug}`)}
                    onClick={() => track(chip.slug)}
                    className={
                      solid
                        ? "inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-full text-xs font-semibold text-primary-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        : "inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 rounded-full text-xs font-medium text-white/85 hover:text-white transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    }
                  >
                    <span className={`text-[10px] font-black ${solid ? "text-accent-600" : "text-accent-300"}`} aria-hidden="true">
                      VS
                    </span>
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Sticky mobile bar — md:hidden.
          Skipped when mobileLead is set: this bar is z-40, under the cookie
          banner (z-60), so taps never reach it until consent is dismissed. */}
      {!mobileLead && (
      <div
        className={`fixed bottom-0 inset-x-0 z-40 md:hidden transition-transform duration-200 ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        role="complementary"
        aria-label="Compare CTA"
      >
        <div className="mx-3 mb-3 rounded-xl border border-primary-200 bg-white/95 backdrop-blur-md shadow-lg p-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600">Compare</p>
            <p className="text-sm font-semibold text-text truncate">{primaryLabel}</p>
          </div>
          {hasPrimary || !useFocusSearch ? (
            <Link
              href={withSourcePage(primaryHref)}
              onClick={() => track(hasPrimary ? primarySlug! : exploreHref)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Go
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <button
              type="button"
              onClick={focusSearch}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Go
            </button>
          )}
        </div>
      </div>
      )}
    </>
  );
}
