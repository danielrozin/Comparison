"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { parseComparisonQuery } from "@/lib/parse-comparison-query";
import { suggestExistingComparison } from "@/lib/search/did-you-mean";
import { compareSlugForQuery } from "@/lib/search/resolve-search-destination";
import { lastSearchAttachment, normalizeQuery, readLastSearch, searchIdFor } from "@/lib/search/search-session";
import { trackPickedResult, trackSubmittedQuery } from "@/lib/search/track-search";
import { DidYouMean } from "@/components/search/DidYouMean";
import { slugify } from "@/lib/utils/slugify";
import {
  trackComparisonSearch,
  trackMatchupRequested,
  trackSearchPageOpened,
  trackSearchParsed,
  trackSearchResultsShown,
} from "@/lib/utils/analytics";
import { saveSearchContext } from "@/lib/utils/recently-viewed";

const SEARCH_PAGE_URL = "https://aversusb.net/search";
const SITE_OG_IMAGE = "https://aversusb.net/api/og?title=Search+Comparisons&type=page";

const SITE_URL = "https://aversusb.net";
const SITE_NAME = "A Versus B";
const TODAY = new Date().toISOString().slice(0, 10);

const QUEUED_FAQ =
  "Yes. Type your query in the format \"A vs B\" (e.g. \"MacBook Air vs Dell XPS\") and press Enter. A Versus B will route you to that comparison page. If the page does not yet exist, it is queued for research and generation.";

const BUILDING_FAQ =
  "Yes. Type two things, such as \"Thailand vs Vietnam\" or \"Thailand compared to Vietnam\", and press Enter. You go straight to that comparison. If the page does not exist yet, you will see a short \"We're building your comparison\" state (usually 20–40 seconds) and then the finished page, at a permanent address, for every later visitor.";

function searchPageSchema(generationEnabled: boolean) {
  const generateAnswer = generationEnabled ? BUILDING_FAQ : QUEUED_FAQ;
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SEARCH_PAGE_URL}#webpage`,
      url: SEARCH_PAGE_URL,
      name: "Search Comparisons — A Versus B",
      description: "Search A Versus B's full library of side-by-side comparisons. Find comparisons by topic, product, person, or concept.",
      abstract: "A Versus B's search tool lets you find any of 10,000+ side-by-side comparisons instantly. Type a topic, product, person, or concept to get structured comparison results.",
      alternativeHeadline: "Find Any Comparison — A Versus B Search",
      inLanguage: "en-US",
      genre: "Search Results",
      contentReferenceTime: TODAY,
      datePublished: "2024-01-01",
      dateModified: TODAY,
      isAccessibleForFree: true,
      creativeWorkStatus: "Published",
      thumbnailUrl: SITE_OG_IMAGE,
      image: {
        "@type": "ImageObject",
        url: SITE_OG_IMAGE,
        contentUrl: SITE_OG_IMAGE,
        name: "Search Comparisons — A Versus B",
        creditText: SITE_NAME,
        creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      },
      // speakable — marks the page heading and FAQ answers for voice assistants and AI extraction.
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".faq-answer"] },
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      potentialAction: [
        { "@type": "ReadAction", target: SEARCH_PAGE_URL },
        { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SEARCH_PAGE_URL}?q={search_term_string}` }, "query-input": "required name=search_term_string" },
      ],
      hasPart: [{ "@id": `${SEARCH_PAGE_URL}#faq` }],
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SEARCH_PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, url: SITE_URL } },
        { "@type": "ListItem", position: 2, name: "Search", item: { "@type": "WebPage", "@id": SEARCH_PAGE_URL, url: SEARCH_PAGE_URL } },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SEARCH_PAGE_URL}#faq`,
      inLanguage: "en-US",
      isPartOf: { "@type": "WebPage", "@id": `${SEARCH_PAGE_URL}#webpage` },
      speakable: { "@type": "SpeakableSpecification", cssSelector: [".faq-answer"] },
      mainEntity: [
    {
      "@type": "Question",
      name: "How does search work on A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Type any topic, product, person, or concept into the search box. A Versus B searches its full library of side-by-side comparisons and returns matching results instantly. If your query matches a known \"A vs B\" pattern, you are taken directly to that comparison page.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate a comparison that does not exist yet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: generateAnswer,
      },
    },
    {
      "@type": "Question",
      name: "What categories of comparisons does A Versus B cover?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Versus B covers technology, software, products, sports, countries, people, historical events, health topics, finance, and more. Use the category filters on the home page or browse /category pages to explore by topic.",
      },
    },
    {
      "@type": "Question",
      name: "How do I find the most popular comparisons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Visit the Trending page at aversusb.net/trending to see the most-viewed comparisons right now. You can filter by category and sort by views, votes, or alphabetically.",
      },
    },
    {
      "@type": "Question",
      name: "Are A Versus B comparisons updated over time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Comparison pages are periodically reviewed and updated when product specs, pricing, or rankings change. Each page shows its last-reviewed date. You can also submit an update request via the contact page.",
      },
    },
      ],
    },
  ],
  };
}

// FAQ questions live on the FAQPage node. Index [1] is the BreadcrumbList,
// which has no mainEntity — calling .map on it threw and sent every /search
// page into the error boundary (ROO-82).
function searchFaqQuestions(generationEnabled: boolean) {
  return searchPageSchema(generationEnabled)["@graph"].flatMap((node) => {
    if (node["@type"] !== "FAQPage" || !("mainEntity" in node) || !Array.isArray(node.mainEntity)) {
      return [];
    }
    return node.mainEntity;
  });
}

function PopularComparisons({ items }: { items: { slug: string; title: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
        <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Popular right now</p>
      </div>
      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
        {items.map((item) => {
          const title = item.title || "Comparison";
          const parts = title.split(/\s+vs\.?\s+/i);
          return (
            <li key={item.slug}>
              <Link
                href={`/compare/${item.slug}`}
                className="flex items-center gap-3 p-3.5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
              >
                <div className="relative flex flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-10">
                    {(parts[0] || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute left-5 top-0 w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm z-0">
                    {(parts[1] || "B").charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 left-4 z-20 w-4 h-4 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center ring-1 ring-white" aria-hidden="true">
                    <span className="text-[7px] font-black text-white leading-none">VS</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-text group-hover:text-primary-700 transition-colors truncate flex-1 pl-3">
                  {title}
                </span>
                <svg className="w-4 h-4 text-text-secondary group-hover:translate-x-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SearchContent({ generationEnabled }: { generationEnabled: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams?.get("q") || "";
  const surfaceParam = searchParams?.get("surface") || "";
  const sourcePage = searchParams?.get("source_page") || "";
  const locallySubmitted = useRef<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<{ slug: string; title: string; category: string }[]>([]);
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [compareWith, setCompareWith] = useState("");
  const [trending, setTrending] = useState<{ slug: string; title: string }[]>([]);
  const parsedQuery = parseComparisonQuery(query);
  const immediateSlug = compareSlugForQuery(query, null);
  const faq = searchFaqQuestions(generationEnabled);
  // Next's router is stable. The search-page test returns a new object on
  // every render, and this effect writes state, so depending on `router`
  // itself retriggers the fetch forever.
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    fetch("/api/v1/trending?limit=8")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.comparisons)) {
          setTrending(data.comparisons.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearchQuery(query);
    setFetchedFor(null);
    if (!query) {
      trackSearchPageOpened(sourcePage);
      setResults([]);
      setLoading(false);
      return;
    }

    const normalized = normalizeQuery(query);
    const stored = readLastSearch();
    const arrivedFromThisPage = locallySubmitted.current === normalized;
    const noteArrival = (
      destination: "compare" | "search_page",
      rows: { slug: string }[],
      resultsQuery: string | null,
    ) => {
      if (arrivedFromThisPage) return;
      if (!stored || stored.query_normalized !== normalized) {
        const surface = surfaceParam === "not_found_form" ? "not_found_form" : "url";
        trackSubmittedQuery({
          query,
          surface,
          destination,
          results: rows,
          resultsQuery,
          dropdownCount: rows.length,
        });
      } else {
        trackSearchParsed(query, parsedQuery.slug, parsedQuery.parsed);
      }
    };

    if (immediateSlug) {
      noteArrival("compare", [], null);
      routerRef.current.replace(`/compare/${immediateSlug}`);
      return;
    }

    let cancelled = false;
    saveSearchContext(query);
    setLoading(true);
    const started = performance.now();
    const recordShown = (count: number, slugs: string[]) => {
      trackSearchResultsShown({
        search_id: searchIdFor(query),
        query_raw: query,
        surface: "search_page",
        result_count: count,
        top_slugs: slugs,
        latency_ms: Math.round(performance.now() - started),
      });
    };
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`search failed: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        const items = Array.isArray(data?.results) ? data.results : [];
        const confirmed = compareSlugForQuery(query, {
          query,
          slugs: items.map((item: { slug?: string }) => item.slug || "").filter(Boolean),
        });
        if (confirmed) {
          noteArrival("compare", items, query);
          routerRef.current.replace(`/compare/${confirmed}`);
          return;
        }
        setResults(items);
        setFetchedFor(query);
        setLoading(false);
        noteArrival("search_page", items, query);
        recordShown(items.length, items.slice(0, 5).map((item: { slug?: string }) => item.slug || ""));
        trackComparisonSearch(query, items.length > 0 ? "results" : "no_results", items.length, "search_page");
      })
      .catch(() => {
        if (cancelled) return;
        // A failed search is an empty result, not a page crash.
        setResults([]);
        setFetchedFor(query);
        setLoading(false);
        noteArrival("search_page", [], query);
        recordShown(0, []);
        trackComparisonSearch(query, "no_results", 0, "search_page");
      });

    return () => {
      cancelled = true;
    };
  }, [query, immediateSlug, parsedQuery.slug, parsedQuery.parsed, sourcePage, surfaceParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const sameQuery = fetchedFor != null && normalizeQuery(fetchedFor) === normalizeQuery(searchQuery);
    const settled = sameQuery ? { query: fetchedFor, slugs: results.map((item) => item.slug) } : null;
    const compareSlug = compareSlugForQuery(searchQuery, settled);
    locallySubmitted.current = normalizeQuery(searchQuery);
    if (compareSlug) {
      trackSubmittedQuery({
        query: searchQuery,
        surface: "search_page",
        destination: "compare",
        results: sameQuery ? results : [],
        resultsQuery: sameQuery ? fetchedFor : null,
        dropdownCount: sameQuery ? results.length : 0,
      });
      router.push(`/compare/${compareSlug}`);
      return;
    }

    trackSubmittedQuery({
      query: searchQuery,
      surface: "search_page",
      destination: "search_page",
      results: sameQuery ? results : [],
      resultsQuery: sameQuery ? fetchedFor : null,
      dropdownCount: sameQuery ? results.length : 0,
    });
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  function createComparison() {
    const other = compareWith.trim();
    if (!other) return;
    const slug = `${slugify(query)}-vs-${slugify(other)}`;
    const attachment = lastSearchAttachment();
    trackMatchupRequested({
      slug,
      cta: "create_on_search",
      from_search: attachment.from_search,
      search_id: attachment.search_id,
      query_raw: attachment.query_raw || query,
    });
    trackPickedResult({
      query,
      surface: "search_page",
      slug,
      position: results.length + 1,
      resultCount: results.length,
      resultKind: "create_new",
    });
    router.push(`/compare/${slug}`);
  }

  const suggestion = query && !immediateSlug
    ? suggestExistingComparison(query, results)
    : null;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchPageSchema(generationEnabled)) }}
      />
      {/* Search Hero */}
      <section aria-labelledby="search-hero-heading" className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="search-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#search-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Search</li>
            </ol>
          </nav>
          <h1 id="search-hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">
            Search Comparisons
          </h1>
          <p className="text-primary-200 text-sm sm:text-base mb-8">
            {generationEnabled
              ? "Search the library, or type “Thailand vs Vietnam” and we'll create the comparison if it doesn't exist yet."
              : "Find any comparison or type “A vs B” to generate one instantly."}
          </p>

          {/* Search form */}
          <form onSubmit={handleSearch} role="search">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoComplete="off"
                type="search"
                inputMode="search"
                enterKeyHint="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Try "Messi vs Ronaldo" or "Python vs JavaScript"...'
                aria-label="Search comparisons"
                className="w-full pl-12 pr-28 py-4 rounded-xl text-lg bg-white text-text placeholder:text-text-secondary/50 focus:ring-4 focus:ring-primary-400/60 outline-none border-2 border-transparent focus:border-primary-500 transition-all"
                autoFocus={!query}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-150 hover:shadow-md"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

      {/* Results */}
      <div role="region" aria-label="Search results" aria-live="polite" aria-atomic="false">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="sr-only">Loading results…</span>
        </div>
      ) : query && results.length > 0 ? (
        <div className="space-y-3">
          {suggestion && (
            <DidYouMean
              title={suggestion.title}
              href={`/compare/${suggestion.slug}`}
              onSelect={() =>
                trackPickedResult({
                  query,
                  surface: "search_page",
                  slug: suggestion.slug,
                  position: 1,
                  resultCount: results.length,
                  resultKind: "comparison",
                })
              }
            />
          )}
          <p className="text-sm text-text-secondary mb-4">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          <ul role="list" className="space-y-3 list-none" aria-label="Search results">
          {results.map((result, index) => {
            const title = result.title || "Comparison";
            const parts = title.split(/\s+vs\.?\s+/i);
            return (
              <li key={result.slug}>
              <Link
                href={`/compare/${result.slug}?from=${encodeURIComponent(query)}`}
                onClick={() =>
                  trackPickedResult({
                    query,
                    surface: "search_page",
                    slug: result.slug,
                    position: index + 1,
                    resultCount: results.length,
                    resultKind: "comparison",
                  })
                }
                className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
              >
                <div className="relative flex flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm z-10">
                    {(parts[0] || "A").charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute left-6 top-0 w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm z-0">
                    {(parts[1] || "B").charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 left-5 z-20 w-5 h-5 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center ring-1 ring-white" aria-hidden="true">
                    <span className="text-[9px] font-black text-white leading-none">VS</span>
                  </div>
                </div>
                <div className="flex-1 pl-4">
                  <p className="font-semibold text-text group-hover:text-primary-700 transition-colors">
                    {title}
                  </p>
                  <p className="text-xs text-text-secondary capitalize mt-0.5">{result.category}</p>
                </div>
                <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              </li>
            );
          })}
          </ul>
        </div>
      ) : query ? (
        <div className="space-y-8">
          {/* No exact match — never throw. Show the raw query and a way to create one. */}
          {suggestion && (
            <DidYouMean
              title={suggestion.title}
              href={`/compare/${suggestion.slug}`}
              onSelect={() =>
                trackPickedResult({
                  query,
                  surface: "search_page",
                  slug: suggestion.slug,
                  position: 1,
                  resultCount: results.length,
                  resultKind: "comparison",
                })
              }
            />
          )}
          <div className="text-center py-8 bg-surface-alt rounded-xl px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-text font-display font-bold text-xl mb-2">
              No exact match for &ldquo;{query}&rdquo;
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              Nothing in the library matches <span className="font-medium text-text">{query}</span> exactly.
              {generationEnabled
                ? " Type two things, like “Thailand vs Vietnam”, and we'll create that comparison. It usually takes 20–40 seconds, then the page stays up for everyone."
                : " Name something to compare it with and we'll create the comparison."}
            </p>
            {!generationEnabled && (
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                <span className="text-sm font-medium text-text">{query} vs</span>
                <label htmlFor="compare-with" className="sr-only">Compare {query} with</label>
                <input
                  autoComplete="off"
                  type="text"
                  placeholder="Enter something to compare..."
                  id="compare-with"
                  aria-label={`Compare ${query} with`}
                  value={compareWith}
                  onChange={(e) => setCompareWith(e.target.value)}
                  className="px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/60 focus:border-primary-500 outline-none w-56"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createComparison();
                  }}
                />
                <button
                  type="button"
                  onClick={createComparison}
                  className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg transition-all duration-150 hover:shadow-md hover:scale-105 active:scale-95"
                >
                  Create this comparison
                </button>
              </div>
            )}
          </div>
          <PopularComparisons items={trending} />
        </div>
      ) : (
        <div className="space-y-8 pt-2">
          <PopularComparisons items={trending} />
          <p className="text-center text-sm text-text-secondary py-4">
            {generationEnabled
              ? "Or type “Thailand vs Vietnam” above. If that page doesn't exist yet, we'll create it."
              : "Or type “A vs B” above to generate any comparison instantly."}
          </p>
        </div>
      )}
      </div>
      </div>

      {/* FAQ section — static Q&A for AEO/FAQPage JSON-LD speakable selectors. */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <section aria-labelledby="search-faq-heading">
          <h2 id="search-faq-heading" className="text-xl font-display font-bold text-text mb-6">
            Frequently Asked Questions
          </h2>
          <dl className="divide-y divide-border">
            {faq.map((item) => (
              <div key={item.name} className="py-5">
                <dt className="font-semibold text-text text-base mb-2">{item.name}</dt>
                <dd className="text-text-secondary text-sm leading-relaxed faq-answer">{item.acceptedAnswer.text}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}

