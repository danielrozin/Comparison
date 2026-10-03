import Head from "next/head";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { OnDemandComparison } from "@/components/comparison/OnDemandComparison";
import { isUserGenerationEnabled } from "@/lib/generation/user-generation-guard";
import {
  canRequestComparisonSlug,
  canonicalRequestedComparisonSlug,
  entityLabelFromSlug,
} from "@/lib/parse-comparison-query";
import { selectCustomCompareEscapes, type CustomCompareEscape } from "@/lib/data/custom-compare-escapes";
import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { lastSearchAttachment } from "@/lib/search/search-session";
import { trackCompareMissingViewed, trackMatchupRequested, type MatchupCta } from "@/lib/utils/analytics";
import { SITE_NAME } from "@/lib/utils/constants";
import { parseComparisonSlug } from "@/lib/utils/slugify";

/**
 * Pages Router 404. A missing two-entity /compare URL can show the on-demand
 * builder when USER_GENERATION_ENABLED is on. The HTTP status stays 404, and
 * _document already sends X-Robots-Tag: noindex. Generation starts in that
 * component after load, never while this HTML is rendered.
 *
 * The flag off, and archived / draft / review slugs, keep the request copy.
 * They must not promise a page we will not build, and they must not promise
 * a 24-hour turnaround.
 *
 * Search and popular comparisons are in this first render. They are not
 * fetched after hydration. The search form uses the same `not_found_form`
 * surface the /search page already records.
 */

export const MISSING_COMPARE_TITLE = `Comparison not found | ${SITE_NAME}`;

type Mode =
  | { kind: "plain"; compareSlug: string | null }
  | { kind: "request"; compareSlug: string | null }
  | { kind: "build"; slug: string };

export default function PagesNotFound({
  generationEnabled = false,
  popular = [],
}: {
  generationEnabled?: boolean;
  popular?: CustomCompareEscape[];
}) {
  const router = useRouter();
  // The server does not know the path. Render the recovery shell immediately
  // so the title, search box, and popular links are in the HTML. The client
  // only swaps in the builder when generation is actually on.
  const [mode, setMode] = useState<Mode>({ kind: "request", compareSlug: null });
  const reportedMissing = useRef<string | null>(null);

  useEffect(() => {
    const slug = mode.kind === "build" ? mode.slug : mode.compareSlug;
    if (!slug) return;
    const key = `${mode.kind}:${slug}`;
    if (reportedMissing.current === key) return;
    reportedMissing.current = key;
    const attachment = lastSearchAttachment();
    let referrerPath = "";
    try {
      if (document.referrer) referrerPath = new URL(document.referrer).pathname;
    } catch {
      referrerPath = "";
    }
    trackCompareMissingViewed({
      slug,
      canonical_slug: canonicalRequestedComparisonSlug(slug) ?? "",
      mode: mode.kind,
      generation_enabled: generationEnabled,
      from_search: attachment.from_search,
      search_id: attachment.search_id,
      query_raw: attachment.query_raw,
      referrer_path: referrerPath,
    });
  }, [mode, generationEnabled]);

  useLayoutEffect(() => {
    let cancelled = false;

    async function resolve() {
      const path = window.location.pathname;
      const match = path.match(/^\/compare\/([a-z0-9-]+)\/?$/i);
      if (!match) {
        if (!cancelled) setMode({ kind: "plain", compareSlug: null });
        return;
      }
      const slug = match[1].toLowerCase();

      // Flag off: same request page as before this feature. No building copy.
      if (!generationEnabled) {
        if (!cancelled) setMode({ kind: "request", compareSlug: slug });
        return;
      }

      const parts = parseComparisonSlug(slug);
      if (!parts || parts.entities.length !== 2) {
        if (!cancelled) setMode({ kind: "plain", compareSlug: slug });
        return;
      }

      // A hidden row (archived, draft, review) 404s. Do not open the builder
      // and do not follow a canonical URL that would then 409.
      if (await pairIsHidden(slug)) {
        if (!cancelled) setMode({ kind: "request", compareSlug: slug });
        return;
      }
      if (cancelled) return;

      // Stay on the URL that 404'd. Redirecting the browser to the
      // alphabetical slug repeats the old 301-into-a-404 when that page
      // is not live. A real pair in the wrong order keeps the request
      // shell here. Junk (self-compare, too-short side) does not.
      const canonical = canonicalRequestedComparisonSlug(slug);
      if (canonical && canRequestComparisonSlug(slug)) {
        setMode({ kind: "build", slug });
        return;
      }
      if (canonical) {
        setMode({ kind: "request", compareSlug: slug });
        return;
      }
      setMode({ kind: "plain", compareSlug: slug });
    }

    void resolve();
    router.events.on("routeChangeComplete", resolve);
    return () => {
      cancelled = true;
      router.events.off("routeChangeComplete", resolve);
    };
  }, [router, generationEnabled]);

  return (
    <>
      <Head>
        <title>{MISSING_COMPARE_TITLE}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {mode.kind === "build" ? (
        <OnDemandBuilder slug={mode.slug} />
      ) : (
        <MissingCompareBody mode={mode} popular={popular} />
      )}
    </>
  );
}

function OnDemandBuilder({ slug }: { slug: string }) {
  const parts = parseComparisonSlug(slug);
  return (
    <OnDemandComparison
      slug={slug}
      entityA={entityLabelFromSlug(parts?.entityA || "A")}
      entityB={entityLabelFromSlug(parts?.entityB || "B")}
    />
  );
}

function MissingCompareBody({
  mode,
  popular,
}: {
  mode: Exclude<Mode, { kind: "build" }>;
  popular: readonly CustomCompareEscape[];
}) {
  const slug = mode.compareSlug;
  const requestHref = slug ? `/custom-compare?slug=${encodeURIComponent(slug)}` : "/custom-compare";
  const junkCompare = mode.kind === "plain" && Boolean(slug);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-primary-600 mb-2">404</p>
      <h1 className="text-3xl font-display font-bold text-text mb-3">We don&apos;t have that page</h1>
      <p className="text-text-secondary mb-6">
        {junkCompare
          ? "That address isn't a comparison we can build. Search for one, or open a popular matchup below."
          : "Published comparisons stay free. Search for a matchup, or open a popular one below. Pro members can request a comparison that is not published yet."}
      </p>

      <form
        action="/search"
        method="get"
        role="search"
        className="mb-8 text-left"
        onSubmit={() => trackMissingCta("search", slug)}
      >
        <label htmlFor="missing-compare-search" className="sr-only">
          Search comparisons
        </label>
        <input type="hidden" name="surface" value="not_found_form" />
        <div className="flex gap-2">
          <input
            id="missing-compare-search"
            type="search"
            name="q"
            autoComplete="off"
            inputMode="search"
            enterKeyHint="search"
            placeholder='Try "Thailand vs Vietnam"'
            className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
          <button
            type="submit"
            className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
          >
            Search
          </button>
        </div>
      </form>

      {popular.length > 0 && (
        <nav aria-label="Popular comparisons" className="mb-8 text-left">
          <h2 className="text-sm font-semibold text-text mb-2">Popular comparisons</h2>
          <ul className="flex flex-col gap-2 list-none m-0 p-0">
            {popular.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/compare/${item.slug}`}
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-700 underline underline-offset-2 hover:text-primary-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {junkCompare ? (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/contact"
            onClick={() => trackMissingCta("contact", slug)}
            className="inline-flex items-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface-alt"
          >
            Contact us
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={requestHref}
            onClick={() => trackMissingCta("request", slug)}
            className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
          >
            Request this comparison
          </Link>
          <Link
            href="/pricing?src=missing-compare"
            onClick={() => trackMissingCta("pricing", slug)}
            className="inline-flex items-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface-alt"
          >
            See Pro pricing
          </Link>
        </div>
      )}
    </div>
  );
}

function trackMissingCta(cta: MatchupCta, slug: string | null) {
  const attachment = lastSearchAttachment();
  trackMatchupRequested({
    slug: slug ?? "",
    cta,
    from_search: attachment.from_search,
    search_id: attachment.search_id,
    query_raw: attachment.query_raw,
  });
}

async function pairIsHidden(slug: string): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/comparisons/${encodeURIComponent(slug)}?lookup=availability`,
    );
    if (response.ok) return false;
    const body = await response.json().catch(() => ({}));
    return body?.unavailable === true;
  } catch {
    // If we cannot tell, do not promise a build that would come back 409.
    return true;
  }
}

export async function getStaticProps() {
  let popular: CustomCompareEscape[] = [];
  try {
    // Same live filter /custom-compare uses: trending by view count, then
    // drop any slug that would 404, then keep five.
    const trending = await getTrendingComparisons(12);
    const liveSlugs = await filterLiveCompareSlugs(trending.map((item) => item.slug));
    popular = selectCustomCompareEscapes(trending, liveSlugs);
  } catch (err) {
    console.warn("[404] popular comparisons unavailable", err);
    popular = [];
  }
  return {
    props: {
      generationEnabled: isUserGenerationEnabled(),
      popular,
    },
    revalidate: 300,
  };
}
