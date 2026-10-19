import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { AI_CONTENT_LABEL, AI_DISCLOSURE } from "@/lib/editorial/blog-authorship";
import { SoftPricingLine } from "@/components/monetization/SoftPricingLine";
import { BlogInlineCompareCtas } from "@/components/blog/BlogInlineCompareCtas";
import {
  BROWSER_COMPARISON_COMPARE_LINKS,
  BROWSER_COMPARISON_CTA_HEADING,
  BROWSER_COMPARISON_SOURCE_PAGE,
} from "@/lib/data/browser-comparison-cta";
import { LAST_UPDATED } from "./last-updated";

const PAGE_URL = `${SITE_URL}/browser-comparison-2026`;
const PAGE_TITLE = `Best Web Browsers Compared (2026) | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "10 major web browsers compared for 2026: rendering engine, current stable version, privacy defaults and license, with each vendor's release channel linked.";
const QUICK_ANSWER =
  "For everyday use pick Chrome or Edge, both built on Chromium. For privacy pick Brave, which blocks ads and trackers by default. For an open-source engine outside Chromium pick Firefox, or Tor Browser for anonymity. On iPhone and Mac, Safari ships Intelligent Tracking Prevention on by default. Current stable versions on October 19, 2026: Chrome 156, Edge 155, Firefox 158, Safari 27 and Brave 1.97.";

const BROWSER_FAQS: { question: string; answer: string }[] = [
  {
    question: "Which web browser is best in 2026?",
    answer:
      "There is no single best browser; it depends on what you need. Chrome or Edge suit everyday use on Chromium, Brave blocks ads and trackers by default, Firefox and Tor Browser use the open-source Gecko engine, and Safari is the built-in choice on iPhone and Mac with Intelligent Tracking Prevention.",
  },
  {
    question: "Which browser is most private?",
    answer:
      "Brave blocks ads and trackers by default with Shields, adds fingerprinting protection, and offers private windows with Tor. Firefox turns on Enhanced Tracking Protection by default. Tor Browser routes traffic through the Tor network for anonymity. Chrome and Edge do not block ads by default.",
  },
  {
    question: "What is the latest version of Chrome, Firefox and Edge?",
    answer:
      "As of October 19, 2026, the stable releases are Chrome 156 (156.0.8078.36 on Windows), Firefox 158.0 and Microsoft Edge 155 (155.0.4283.62, released October 16, 2026). Brave's latest desktop release is 1.97.57 (October 14, 2026), built on Chromium 155. All four update automatically by default.",
  },
  {
    question: "Chrome vs Firefox: which should I use?",
    answer:
      "Choose Chrome for Google-account sync and the Chrome Web Store. Choose Firefox for a non-Chromium engine (Gecko), MPL-2.0 open-source licensing and Enhanced Tracking Protection on by default. Both are free.",
  },
  {
    question: "Is Brave better than Chrome for everyday browsing?",
    answer:
      "Brave is the better fit if you want ad and tracker blocking without installing an extension. Chrome is the better fit if you want Google's default services and sync. Both run on the Blink engine and V8, so the main difference is the default settings, not the engine.",
  },
  {
    question: "Which browser is best on iPhone?",
    answer:
      "Safari is built into iPhone and turns on Intelligent Tracking Prevention by default. Chrome, Firefox, Edge and Brave are also available on iPhone with their own sync and privacy features.",
  },
  {
    question: "Which browsers are open source?",
    answer:
      "Firefox (MPL-2.0), Brave (MPL-2.0) and Tor Browser (MPL-2.0 and GPL) are open source. Chrome, Edge, Safari, Opera and Samsung Internet are proprietary products built on partly open-source engines (Chromium or WebKit).",
  },
];
const BROWSER_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Browser Comparison 2026")}&type=article`;

export const metadata: Metadata = {
  // ROO-241: title already carries the brand; skip the layout template.
  title: { absolute: PAGE_TITLE },
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
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [BROWSER_OG_IMAGE],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": SITE_NAME,
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
    "citation_publication_date": "2026-04-01",
    "citation_online_date": "2026-04-01",
    "citation_keywords": "browser comparison 2026, Chrome vs Firefox, Safari vs Edge, best web browser, browser benchmark",
    "citation_fulltext_world_readable": "",
    "DC.title": PAGE_TITLE,
    "DC.creator": SITE_NAME,
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
  datePublished: "2026-07-11",
  dateModified: LAST_UPDATED,
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
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  educationalLevel: "General",
  teaches: "How to choose the best web browser for speed, privacy, and compatibility",
  educationalUse: "comparison",
  alternativeHeadline: "Best Web Browsers in 2026 — Speed, Privacy & Feature Comparison",
  keywords: "browser comparison 2026, best web browser, Chrome vs Firefox, Edge vs Safari, Brave browser",
  author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#page-intro", "#quick-answer", ".faq-answer"] },
  hasPart: [{ "@id": `${PAGE_URL}#faq` }],
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

const browserFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  name: "Best Web Browsers Compared (2026) — Frequently Asked Questions",
  url: `${PAGE_URL}#faq`,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  speakable: { "@type": "SpeakableSpecification", cssSelector: [".faq-answer"] },
  mainEntity: BROWSER_FAQS.map((faq, i) => ({
    "@type": "Question",
    "@id": `${PAGE_URL}#q${i + 1}`,
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      "@id": `${PAGE_URL}#a${i + 1}`,
      text: faq.answer,
    },
  })),
};

const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Google Chrome",
    url: "https://www.google.com/chrome/",
    brand: { "@type": "Brand", name: "Google LLC" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: "https://www.google.com/chrome/" },
    description: "Chromium-based browser by Google.",
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
  version: string;
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
    version: "156 (156.0.8078.36, Windows)",
    privacySummary: "Telemetry on by default; no built-in ad/tracker blocking; Privacy Sandbox replacing FLoC",
    license: "Proprietary (Chromium: BSD/Apache open-source)",
    priceFree: true,
    sources: [
      { label: "Chrome version history (stable)", url: "https://versionhistory.googleapis.com/v1/chrome/platforms/win/channels/stable/versions" },
      { label: "Chrome releases blog", url: "https://chromereleases.googleblog.com/" },
      { label: "Google Chrome privacy whitepaper", url: "https://policies.google.com/privacy/google-chrome" },
    ],
  },
  {
    name: "Mozilla Firefox",
    vendor: "Mozilla Foundation",
    engine: "Gecko / SpiderMonkey",
    version: "158.0",
    privacySummary: "Enhanced Tracking Protection (ETP) on by default; optional Total Cookie Protection; no telemetry for private browsing",
    license: "MPL-2.0 (open-source)",
    priceFree: true,
    sources: [
      { label: "Mozilla product details (current versions)", url: "https://product-details.mozilla.org/1.0/firefox_versions.json" },
      { label: "Firefox release notes", url: "https://www.mozilla.org/en-US/firefox/releases/" },
      { label: "Firefox privacy notice", url: "https://www.mozilla.org/en-US/privacy/firefox/" },
    ],
  },
  {
    name: "Apple Safari",
    vendor: "Apple Inc.",
    engine: "WebKit / JavaScriptCore",
    version: "27",
    privacySummary: "Intelligent Tracking Prevention (ITP) blocks cross-site tracking by default; no extension-based ad blocking built-in",
    license: "Proprietary (WebKit: LGPL/BSD open-source)",
    priceFree: true,
    sources: [
      { label: "Safari release notes", url: "https://developer.apple.com/tutorials/data/documentation/safari-release-notes.json" },
      { label: "Apple Safari privacy features", url: "https://www.apple.com/safari/features/#privacy" },
    ],
  },
  {
    name: "Microsoft Edge",
    vendor: "Microsoft Corp.",
    engine: "Blink / V8",
    version: "155 (155.0.4283.62)",
    privacySummary: "Tracking prevention (Basic/Balanced/Strict); telemetry on by default; built-in Bing AI Copilot",
    license: "Proprietary (Chromium core: BSD/Apache)",
    priceFree: true,
    sources: [
      { label: "Microsoft Edge release API", url: "https://edgeupdates.microsoft.com/api/products" },
      { label: "Edge stable release notes", url: "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-relnote-stable-channel" },
      { label: "Microsoft Edge privacy policy", url: "https://www.microsoft.com/en-us/edge/privacy-policy" },
    ],
  },
  {
    name: "Brave",
    vendor: "Brave Software Inc.",
    engine: "Blink / V8",
    version: "1.97.57 (Chromium 155)",
    privacySummary: "Aggressive ad/tracker blocking by default (Shields); fingerprinting protection; Tor integration in Private Window",
    license: "MPL-2.0 (open-source)",
    priceFree: true,
    sources: [
      { label: "Brave release notes", url: "https://brave.com/latest/" },
      { label: "Brave privacy features", url: "https://brave.com/privacy-features/" },
    ],
  },
  {
    name: "Opera",
    vendor: "Opera Software AS",
    engine: "Blink / V8",
    version: "137 (137.0.6036.63)",
    privacySummary: "Built-in ad blocker (off by default on desktop); free VPN proxy included; tracker blocking available",
    license: "Proprietary",
    priceFree: true,
    sources: [
      { label: "Opera desktop downloads", url: "https://get.geo.opera.com/pub/opera/desktop/" },
      { label: "Opera changelog", url: "https://help.opera.com/en/latest/news/" },
    ],
  },
  {
    name: "Vivaldi",
    vendor: "Vivaldi Technologies",
    engine: "Blink / V8",
    version: "8.2",
    privacySummary: "Built-in ad/tracker blocking; no telemetry sent; sync encrypted end-to-end",
    license: "Proprietary (Chromium core: BSD/Apache)",
    priceFree: true,
    sources: [
      { label: "Vivaldi blog", url: "https://vivaldi.com/blog/" },
      { label: "Vivaldi privacy policy", url: "https://vivaldi.com/privacy/browser/" },
    ],
  },
  {
    name: "DuckDuckGo Browser",
    vendor: "DuckDuckGo Inc.",
    engine: "WebKit (iOS/macOS) / Blink (Android)",
    version: "See vendor page",
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
    version: "See vendor page",
    privacySummary: "Built-in tracker blocker (Smart Anti-Tracking); content blockers via extensions; Samsung Knox security integration on Galaxy devices",
    license: "Proprietary",
    priceFree: true,
    sources: [
      { label: "Samsung Internet GitHub", url: "https://github.com/SamsungInternet/support" },
    ],
  },
  {
    name: "Tor Browser",
    vendor: "Tor Project (non-profit)",
    engine: "Gecko / SpiderMonkey",
    version: "15.0.25",
    privacySummary: "Traffic routed through Tor network (3 relays); no telemetry; JavaScript restricted by default; most aggressive fingerprinting protection of any mainstream browser",
    license: "MPL-2.0 + GPL (open-source)",
    priceFree: true,
    sources: [
      { label: "Tor Browser release metadata", url: "https://aus1.torproject.org/torbrowser/update_3/release/download-linux-x86_64.json" },
      { label: "Tor Browser download", url: "https://www.torproject.org/download/" },
      { label: "Tor project blog releases", url: "https://blog.torproject.org/category/releases/" },
    ],
  },
];

export default function BrowserComparison2026Page() {
  return (
    <>
      <JsonLd data={[articleSchema, browserFaqSchema, ...productSchemas]} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-cyan-900 via-teal-900 to-primary-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
  <defs>
    <pattern id="grid-browser-comparison-2026-hero" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
      <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-browser-comparison-2026-hero)"/>
</svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-cyan-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-cyan-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Browser Comparison 2026</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20 mt-1">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                Best Web Browsers Compared (2026)
              </h1>
              {/* ROO-50: under the title, before the long intro. A line after
                  the intro sits inside the cookie banner on a ~700px phone. */}
              <SoftPricingLine src="browser-comparison-2026" tone="onDark" className="mt-3" />
              {/* ROO-114: before the long intro, same band as SoftPricingLine.
                  A block after the intro sits inside the cookie banner on a short phone. */}
              <div className="mt-4 max-w-xl [&_nav]:my-0 [&_nav]:bg-white">
                <BlogInlineCompareCtas
                  sourcePage={BROWSER_COMPARISON_SOURCE_PAGE}
                  links={BROWSER_COMPARISON_COMPARE_LINKS}
                  heading={BROWSER_COMPARISON_CTA_HEADING}
                  placement="hero_card"
                  variant="cards"
                />
              </div>
              <p id="page-intro" className="mt-2 text-cyan-100 text-base sm:text-lg leading-relaxed max-w-3xl">
                {QUICK_ANSWER}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-cyan-200">
                <span className="font-semibold uppercase tracking-wide text-white">{AI_CONTENT_LABEL}</span>
                <span aria-hidden="true">·</span>
                <span>{AI_DISCLOSURE}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Updated:{" "}
                  <time dateTime={LAST_UPDATED}>
                    {new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                </span>
                <span aria-hidden="true">·</span>
                <Link href="/browser-comparison-2026/methodology" className="text-white hover:underline">
                  Methodology
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Quick Answer — speakable (#quick-answer) */}
      <section aria-labelledby="browscomp-quick-answer" className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
        <h2 id="browscomp-quick-answer" className="font-display font-bold text-text mb-2">Quick Answer</h2>
        <p id="quick-answer" className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {QUICK_ANSWER}
        </p>
      </section>

      {/* Quick verdict */}
      <section aria-labelledby="browscomp-quick-verdict" className="mb-10 p-5 bg-surface-alt rounded-2xl border border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 id="browscomp-quick-verdict" className="font-display font-bold text-text">Quick verdict</h2>
        </div>
        <ul className="space-y-1 text-text-secondary text-sm list-disc list-inside">
          <li><strong className="text-text">Best for everyday use:</strong> Chrome (ecosystem) or Edge (Windows-integrated); both Chromium-based.</li>
          <li><strong className="text-text">Best for privacy:</strong> Brave — blocks ads/trackers by default, Tor integration available, open-source.<sup><a href="#cite-4" className="text-primary-600">[5]</a></sup></li>
          <li><strong className="text-text">Best open-source:</strong> Firefox (MPL-2.0) or Tor Browser — both use Gecko, fully auditable.</li>
          <li><strong className="text-text">iPhone and Mac:</strong> Safari is built in and turns on Intelligent Tracking Prevention by default.<sup><a href="#cite-2" className="text-primary-600">[3]</a></sup></li>
        </ul>
        <p className="mt-3 text-sm text-text-secondary">
          Choosing between Chrome and Firefox?{" "}
          <Link href="/compare/chrome-vs-firefox" className="text-primary-600 hover:underline font-medium">
            Compare Chrome vs Firefox side by side
          </Link>
          .
        </p>
      </section>

      {/* Main table */}
      <section aria-labelledby="browscomp-full-comparison-table" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </svg>
          </div>
          <h2 id="browscomp-full-comparison-table" className="text-2xl font-display font-bold text-text">Full comparison table</h2>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          <strong>Updated Oct 19, 2026:</strong> current stable releases, including Microsoft Edge 155.0.4283.62.<sup><a href="#cite-versions" className="text-primary-600">[*]</a></sup>{" "}
          Every browser listed is free.
        </p>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Browser comparison table — scroll to see all columns">
          <table className="w-full border border-border rounded-xl text-sm">
            <caption className="sr-only">Browser comparison table: rendering engine, current stable version, privacy defaults and license, October 2026</caption>
            <thead>
              <tr className="bg-surface-alt">
                {["Browser", "Engine", "Stable version (Oct 2026)", "Privacy defaults", "License"].map((h) => (
                  <th scope="col" key={h} className="text-left p-3 font-semibold text-text border-b border-border whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BROWSERS.map((b, i) => (
                <tr key={b.name} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="p-3 font-medium text-text whitespace-nowrap">{b.name}</td>
                  <td className="p-3 text-text-secondary">{b.engine}</td>
                  <td className="p-3 text-text-secondary">{b.version}<sup><a href={`#cite-${i}`} className="text-primary-600">[{i + 1}]</a></sup></td>
                  <td className="p-3 text-text-secondary">{b.privacySummary}</td>
                  <td className="p-3 text-text-secondary">{b.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ — visible 1:1 with FAQPage JSON-LD */}
      <section id="faq" aria-labelledby="browscomp-faq" className="mb-12">
        <h2 id="browscomp-faq" className="text-2xl font-display font-bold text-text mb-4">
          Frequently asked questions
        </h2>
        <dl className="space-y-4">
          {BROWSER_FAQS.map((faq) => (
            <div key={faq.question} className="p-4 border border-border rounded-xl bg-surface-alt/40">
              <dt className="font-semibold text-text">{faq.question}</dt>
              <dd className="faq-answer mt-2 text-sm text-text-secondary leading-relaxed">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Methodology link */}
      <section aria-labelledby="browscomp-how-we-evaluate-browsers" className="mb-12 p-5 border border-border rounded-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 id="browscomp-how-we-evaluate-browsers" className="font-display font-bold text-text">How we evaluate browsers</h2>
        </div>
        <p className="text-text-secondary text-sm mb-3">
          Our{" "}
          <Link href="/browser-comparison-2026/methodology" className="text-primary-600 hover:underline">full methodology</Link>{" "}
          covers all nine measured attributes, source tiers, recency policy, COI disclosure, and the correction process.
        </p>
        <Link href="/browser-comparison-2026/methodology" className="text-sm text-primary-600 hover:underline font-medium">
          Read the methodology <span aria-hidden="true">→</span>
        </Link>
      </section>

      {/* Citations */}
      <section aria-labelledby="browscomp-sources" className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 id="browscomp-sources" className="text-xl font-display font-bold text-text">Sources</h2>
        </div>
        <ol className="space-y-2 text-sm text-text-secondary">
          {BROWSERS.map((b, i) => (
            <li key={b.name} id={`cite-${i}`}>
              {b.name} ({b.vendor}).{" "}
              {b.sources.map((s, si) => (
                <span key={s.url}>
                  <a href={s.url} rel="nofollow noopener" target="_blank" className="text-primary-600 hover:underline">{s.label}<span className="sr-only"> (opens in new tab)</span></a>
                  {si < b.sources.length - 1 ? "; " : ""}
                </span>
              ))}
              {" "}<em>Checked October 2026.</em>
            </li>
          ))}
          <li id="cite-versions">
            <sup>*</sup> Stable versions read on October 19, 2026: Chrome from Google&apos;s version-history service (Windows stable), Firefox from Mozilla&apos;s product-details feed, Edge from Microsoft&apos;s Edge stable-channel release notes, Safari from Apple&apos;s Safari release notes, Brave from its desktop release notes, Opera from its official download directory, Vivaldi from the Vivaldi blog and Tor Browser from the Tor Project&apos;s release metadata. DuckDuckGo and Samsung Internet do not publish a single current version number. Browsers auto-update, so versions move quickly.
          </li>
        </ol>
      </section>
    </article>
    </>
  );
}
