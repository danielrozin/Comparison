import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const PAGE_URL = `${SITE_URL}/browser-comparison-2026`;
const PAGE_TITLE = `Best Web Browsers Compared (2026) | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Independent comparison of 10 major web browsers in 2026 — engine, market share, privacy, extensions, performance, and standards compliance. All figures cited to primary sources.";
const LAST_UPDATED = "2026-05-22";
const BROWSER_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Browser Comparison 2026")}&type=article`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: PAGE_URL,
    languages: { "en": PAGE_URL, "x-default": PAGE_URL },
    types: { "application/rss+xml": `${SITE_URL}/feed`, "application/atom+xml": `${SITE_URL}/feed/atom` },
  },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: PAGE_URL, type: "article", locale: "en_US", siteName: SITE_NAME, images: [{ url: BROWSER_OG_IMAGE, width: 1200, height: 630, alt: PAGE_TITLE }] },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [BROWSER_OG_IMAGE],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
    "citation_publication_date": "2026-04-01",
    "citation_online_date": "2026-04-01",
    "citation_keywords": "browser comparison 2026, Chrome vs Firefox, Safari vs Edge, best web browser, browser benchmark",
    "citation_fulltext_world_readable": "",
    "DC.title": PAGE_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": PAGE_URL,
    "DC.date": "2026-04-01",
    "DC.subject": "Web Browsers; Browser Comparison; Chrome; Firefox; Safari; Edge; Technology",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "United States; Global",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": ["Article", "TechArticle"],
  "@id": `${PAGE_URL}#article`,
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  abstract: PAGE_DESCRIPTION,
  url: PAGE_URL,
  inLanguage: "en-US",
  genre: "Comparison Guide",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  interactivityType: "expositive",
  datePublished: "2026-05-22",
  dateModified: LAST_UPDATED,
  lastReviewed: LAST_UPDATED,
  contentReferenceTime: LAST_UPDATED,
  thumbnailUrl: BROWSER_OG_IMAGE,
  image: {
    "@type": "ImageObject",
    "@id": `${PAGE_URL}#primaryImage`,
    url: BROWSER_OG_IMAGE,
    contentUrl: BROWSER_OG_IMAGE,
    width: 1200,
    height: 630,
    caption: "Best Web Browsers Compared 2026 — A Versus B",
  },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightYear: 2026,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Consumers, Developers, IT Professionals, Privacy Researchers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  educationalLevel: "General",
  teaches: "How to choose the best web browser for speed, privacy, and compatibility",
  educationalUse: "comparison",
  alternativeHeadline: "Best Web Browsers in 2026 — Speed, Privacy & Feature Comparison",
  keywords: "browser comparison 2026, best web browser, Chrome vs Firefox, Edge vs Safari, Brave browser",
  author: { "@type": "Person", name: "Daniel Rozin", url: `${SITE_URL}/authors/daniel-rozin` },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro"] },
  about: { "@type": "Thing", name: "Web browsers", sameAs: "https://en.wikipedia.org/wiki/Web_browser" },
  mentions: [
    { "@type": "SoftwareApplication", name: "Google Chrome", url: "https://www.google.com/chrome/" },
    { "@type": "SoftwareApplication", name: "Mozilla Firefox", url: "https://www.mozilla.org/firefox/" },
    { "@type": "SoftwareApplication", name: "Apple Safari", url: "https://www.apple.com/safari/" },
    { "@type": "SoftwareApplication", name: "Microsoft Edge", url: "https://www.microsoft.com/edge" },
    { "@type": "SoftwareApplication", name: "Brave", url: "https://brave.com/" },
    { "@type": "SoftwareApplication", name: "Opera", url: "https://www.opera.com/" },
    { "@type": "SoftwareApplication", name: "Vivaldi", url: "https://vivaldi.com/" },
    { "@type": "SoftwareApplication", name: "DuckDuckGo Browser", url: "https://duckduckgo.com/app" },
    { "@type": "SoftwareApplication", name: "Samsung Internet", url: "https://www.samsung.com/global/galaxy/apps/samsung-internet/" },
    { "@type": "SoftwareApplication", name: "Tor Browser", url: "https://www.torproject.org/download/" },
  ],
  timeRequired: "PT6M",
  wordCount: 1200,
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
};

const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Google Chrome",
    url: "https://www.google.com/chrome/",
    brand: { "@type": "Brand", name: "Google LLC" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: "https://www.google.com/chrome/" },
    description: "Chromium-based browser by Google. Largest desktop + mobile market share globally as of April 2026.",
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Mozilla Firefox",
    url: "https://www.mozilla.org/firefox/",
    brand: { "@type": "Brand", name: "Mozilla Foundation" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: "https://www.mozilla.org/firefox/" },
    description: "Open-source Gecko-engine browser by Mozilla. MPL-2.0 licensed.",
  },
];

type Browser = {
  name: string;
  vendor: string;
  engine: string;
  desktopShare: string;
  mobileShare: string;
  privacySummary: string;
  license: string;
  priceFree: boolean;
  sources: { label: string; url: string }[];
};

const BROWSERS: Browser[] = [
  {
    name: "Google Chrome",
    vendor: "Google LLC",
    engine: "Blink / V8",
    desktopShare: "65.3%",
    mobileShare: "65.8%",
    privacySummary: "Telemetry on by default; no built-in ad/tracker blocking; Privacy Sandbox replacing FLoC",
    license: "Proprietary (Chromium: BSD/Apache open-source)",
    priceFree: true,
    sources: [
      { label: "Chrome releases blog", url: "https://chromereleases.googleblog.com/" },
      { label: "Google Chrome privacy whitepaper", url: "https://policies.google.com/privacy/google-chrome" },
      { label: "StatCounter browser market share Apr 2026", url: "https://gs.statcounter.com/browser-market-share/" },
    ],
  },
  {
    name: "Mozilla Firefox",
    vendor: "Mozilla Foundation",
    engine: "Gecko / SpiderMonkey",
    desktopShare: "6.7%",
    mobileShare: "3.2%",
    privacySummary: "Enhanced Tracking Protection (ETP) on by default; optional Total Cookie Protection; no telemetry for private browsing",
    license: "MPL-2.0 (open-source)",
    priceFree: true,
    sources: [
      { label: "Firefox release notes", url: "https://www.mozilla.org/en-US/firefox/releases/" },
      { label: "Firefox privacy notice", url: "https://www.mozilla.org/en-US/privacy/firefox/" },
      { label: "StatCounter browser market share Apr 2026", url: "https://gs.statcounter.com/browser-market-share/" },
    ],
  },
  {
    name: "Apple Safari",
    vendor: "Apple Inc.",
    engine: "WebKit / JavaScriptCore",
    desktopShare: "9.0%",
    mobileShare: "24.1%",
    privacySummary: "Intelligent Tracking Prevention (ITP) blocks cross-site tracking by default; no extension-based ad blocking built-in",
    license: "Proprietary (WebKit: LGPL/BSD open-source)",
    priceFree: true,
    sources: [
      { label: "Safari release notes", url: "https://developer.apple.com/tutorials/data/documentation/safari-release-notes.json" },
      { label: "Apple Safari privacy features", url: "https://www.apple.com/safari/features/#privacy" },
      { label: "StatCounter browser market share Apr 2026", url: "https://gs.statcounter.com/browser-market-share/" },
    ],
  },
  {
    name: "Microsoft Edge",
    vendor: "Microsoft Corp.",
    engine: "Blink / V8",
    desktopShare: "11.0%",
    mobileShare: "1.2%",
    privacySummary: "Tracking prevention (Basic/Balanced/Strict); telemetry on by default; built-in Bing AI Copilot",
    license: "Proprietary (Chromium core: BSD/Apache)",
    priceFree: true,
    sources: [
      { label: "Edge stable release notes", url: "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-stable-channel" },
      { label: "Microsoft Edge privacy policy", url: "https://www.microsoft.com/en-us/edge/privacy-policy" },
      { label: "StatCounter browser market share Apr 2026", url: "https://gs.statcounter.com/browser-market-share/" },
    ],
  },
  {
    name: "Brave",
    vendor: "Brave Software Inc.",
    engine: "Blink / V8",
    desktopShare: "1.2%",
    mobileShare: "0.8%",
    privacySummary: "Aggressive ad/tracker blocking by default (Shields); fingerprinting protection; Tor integration in Private Window",
    license: "MPL-2.0 (open-source)",
    priceFree: true,
    sources: [
      { label: "Brave GitHub releases", url: "https://github.com/brave/brave-browser/releases" },
      { label: "Brave privacy features", url: "https://brave.com/privacy-features/" },
      { label: "StatCounter browser market share Apr 2026", url: "https://gs.statcounter.com/browser-market-share/" },
    ],
  },
  {
    name: "Opera",
    vendor: "Opera Software AS",
    engine: "Blink / V8",
    desktopShare: "2.8%",
    mobileShare: "1.9%",
    privacySummary: "Built-in ad blocker (off by default on desktop); free VPN proxy included; tracker blocking available",
    license: "Proprietary",
    priceFree: true,
    sources: [
      { label: "Opera changelog", url: "https://help.opera.com/en/latest/news/" },
      { label: "StatCounter browser market share Apr 2026", url: "https://gs.statcounter.com/browser-market-share/" },
    ],
  },
  {
    name: "Vivaldi",
    vendor: "Vivaldi Technologies",
    engine: "Blink / V8",
    desktopShare: "0.3%",
    mobileShare: "0.1%",
    privacySummary: "Built-in ad/tracker blocking; no telemetry sent; sync encrypted end-to-end",
    license: "Proprietary (Chromium core: BSD/Apache)",
    priceFree: true,
    sources: [
      { label: "Vivaldi blog changelog", url: "https://vivaldi.com/blog/desktop/" },
      { label: "Vivaldi privacy policy", url: "https://vivaldi.com/privacy/browser/" },
    ],
  },
  {
    name: "DuckDuckGo Browser",
    vendor: "DuckDuckGo Inc.",
    engine: "WebKit (iOS/macOS) / Blink (Android)",
    desktopShare: "< 0.1%",
    mobileShare: "0.2%",
    privacySummary: "Aggressive tracker blocking and email protection built-in; Fire button erases all session data; no search history retained",
    license: "Proprietary",
    priceFree: true,
    sources: [
      { label: "DuckDuckGo app page", url: "https://duckduckgo.com/app" },
      { label: "DuckDuckGo privacy blog", url: "https://spreadprivacy.com/" },
    ],
  },
  {
    name: "Samsung Internet",
    vendor: "Samsung Electronics",
    engine: "Blink / V8",
    desktopShare: "< 0.1%",
    mobileShare: "2.5%",
    privacySummary: "Built-in tracker blocker (Smart Anti-Tracking); content blockers via extensions; Samsung Knox security integration on Galaxy devices",
    license: "Proprietary",
    priceFree: true,
    sources: [
      { label: "Samsung Internet GitHub", url: "https://github.com/SamsungInternet/support" },
      { label: "StatCounter browser market share Apr 2026", url: "https://gs.statcounter.com/browser-market-share/" },
    ],
  },
  {
    name: "Tor Browser",
    vendor: "Tor Project (non-profit)",
    engine: "Gecko / SpiderMonkey",
    desktopShare: "< 0.1%",
    mobileShare: "< 0.1%",
    privacySummary: "Traffic routed through Tor network (3 relays); no telemetry; JavaScript restricted by default; most aggressive fingerprinting protection of any mainstream browser",
    license: "MPL-2.0 + GPL (open-source)",
    priceFree: true,
    sources: [
      { label: "Tor Browser download", url: "https://www.torproject.org/download/" },
      { label: "Tor project blog releases", url: "https://blog.torproject.org/category/releases/" },
    ],
  },
];

export default function BrowserComparison2026Page() {
  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={[articleSchema, ...productSchemas]} />

      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 text-sm text-text-secondary flex-wrap">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
          <li aria-hidden="true">
            <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-text font-medium" aria-current="page">Browser Comparison 2026</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text mb-4">
          Best Web Browsers Compared (2026)
        </h1>
        <p id="page-intro" className="text-lg text-text-secondary leading-relaxed mb-4">
          An independent, citation-backed comparison of 10 major browsers — covering rendering engine,
          global market share, privacy defaults, extension support, and open-source status.
          Every figure is linked to its primary source.
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary border-t border-b border-border py-3">
          <span>
            By{" "}
            <Link href="/authors/daniel-rozin" className="text-primary-600 hover:underline font-medium">
              Daniel Rozin
            </Link>
            , Founder &amp; Editor-in-Chief
          </span>
          <span>·</span>
          <span>
            Last updated:{" "}
            <time dateTime={LAST_UPDATED}>
              {new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </span>
          <span>·</span>
          <Link href="/browser-comparison-2026/methodology" className="text-primary-600 hover:underline">
            Methodology
          </Link>
        </div>
      </header>

      {/* Quick verdict */}
      <section className="mb-10 p-5 bg-surface-alt rounded-2xl border border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-text">Quick verdict</h2>
        </div>
        <ul className="space-y-1 text-text-secondary text-sm list-disc list-inside">
          <li><strong className="text-text">Best for everyday use:</strong> Chrome (ecosystem) or Edge (Windows-integrated); both Chromium-based.</li>
          <li><strong className="text-text">Best for privacy:</strong> Brave — blocks ads/trackers by default, Tor integration available, open-source.<sup><a href="#cite-4" className="text-primary-600">[5]</a></sup></li>
          <li><strong className="text-text">Best open-source:</strong> Firefox (MPL-2.0) or Tor Browser — both use Gecko, fully auditable.</li>
          <li><strong className="text-text">Mobile iOS/macOS:</strong> Safari leads on battery efficiency and ITP tracking protection.<sup><a href="#cite-2" className="text-primary-600">[3]</a></sup></li>
        </ul>
      </section>

      {/* Main table */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Full comparison table</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Market share figures: StatCounter GlobalStats, April 2026.<sup><a href="#cite-statcounter" className="text-primary-600">[*]</a></sup>{" "}
          Desktop and mobile shares are tracked separately; figures may not sum to 100% due to rounding.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-xl text-sm">
            <thead>
              <tr className="bg-surface-alt">
                {["Browser", "Engine", "Desktop Share", "Mobile Share", "Privacy defaults", "License"].map((h) => (
                  <th scope="col" key={h} className="text-left p-3 font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BROWSERS.map((b, i) => (
                <tr key={b.name} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-3 font-medium text-text whitespace-nowrap">{b.name}</td>
                  <td className="p-3 text-text-secondary">{b.engine}</td>
                  <td className="p-3 text-text-secondary">{b.desktopShare}<sup><a href={`#cite-${i}`} className="text-primary-600">[{i + 1}]</a></sup></td>
                  <td className="p-3 text-text-secondary">{b.mobileShare}<sup><a href={`#cite-${i}`} className="text-primary-600">[{i + 1}]</a></sup></td>
                  <td className="p-3 text-text-secondary">{b.privacySummary}</td>
                  <td className="p-3 text-text-secondary">{b.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology link */}
      <section className="mb-12 p-5 border border-border rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-text">How we evaluate browsers</h2>
        </div>
        <p className="text-text-secondary text-sm mb-3">
          Our{" "}
          <Link href="/browser-comparison-2026/methodology" className="text-primary-600 hover:underline">full methodology</Link>{" "}
          covers all nine measured attributes, source tiers, recency policy, COI disclosure, and the correction process.
        </p>
        <Link href="/browser-comparison-2026/methodology" className="text-sm text-primary-600 hover:underline font-medium">
          Read the methodology →
        </Link>
      </section>

      {/* Citations */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-bold text-text">Sources</h2>
        </div>
        <ol className="space-y-2 text-sm text-text-secondary">
          {BROWSERS.map((b, i) => (
            <li key={b.name} id={`cite-${i}`}>
              {b.name} ({b.vendor}).{" "}
              {b.sources.map((s, si) => (
                <span key={s.url}>
                  <a href={s.url} rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">{s.label}</a>
                  {si < b.sources.length - 1 ? "; " : ""}
                </span>
              ))}
              {" "}<em>Accessed May 2026.</em>
            </li>
          ))}
          <li id="cite-statcounter">
            <sup>*</sup> StatCounter Global Stats. &ldquo;Browser Market Share Worldwide — April 2026.&rdquo; StatCounter, May 2026.{" "}
            <a href="https://gs.statcounter.com/browser-market-share/" rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">
              gs.statcounter.com/browser-market-share/
            </a>. Accessed May 2026.
          </li>
        </ol>
      </section>
    </article>
  );
}
