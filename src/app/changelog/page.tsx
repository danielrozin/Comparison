import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

const CHANGELOG_OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent("Changelog — A Versus B Updates")}&type=home`;
const CHANGELOG_TITLE = `Changelog — ${SITE_NAME} Updates, Features & New Comparisons`;
const CHANGELOG_DESC = `See what's new on ${SITE_NAME}. Complete history of updates, new comparisons, features, and improvements — updated continuously.`;
const CHANGELOG_URL = `${SITE_URL}/changelog`;

export const metadata: Metadata = {
  title: CHANGELOG_TITLE,
  description: CHANGELOG_DESC,
  alternates: {
    canonical: CHANGELOG_URL,
    languages: { "en": CHANGELOG_URL, "x-default": CHANGELOG_URL },
  },
  openGraph: {
    title: CHANGELOG_TITLE,
    description: CHANGELOG_DESC,
    url: CHANGELOG_URL,
    type: "article",

    locale: "en_US",    siteName: SITE_NAME,
    images: [{ url: CHANGELOG_OG_IMAGE, width: 1200, height: 630, alt: "Changelog — A Versus B Updates, Features & New Comparisons" }],
  },
  twitter: {
    card: "summary_large_image",
    title: CHANGELOG_TITLE,
    description: CHANGELOG_DESC,
    images: [CHANGELOG_OG_IMAGE],
  },
  other: {
    "citation_title": CHANGELOG_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": CHANGELOG_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": CHANGELOG_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": CHANGELOG_URL,
  },
};

interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  type: "launch" | "feature" | "content" | "fix" | "improvement";
  items: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-06-30",
    version: "1.8.0",
    title: "Accessibility Pass, Skip Navigation & Reduced-Motion Support",
    type: "improvement",
    items: [
      "Added skip-to-content keyboard navigation link on every page (WCAG 2.1 AA)",
      "Added @media prefers-reduced-motion support — all hero animations pause for users with motion sensitivity",
      "Fixed all 4 missing category gradients (software, military, economy, travel) in category cards",
      "Completed semantic design token sweep across all public-facing components — zero raw gray tokens remain",
      "Fixed duplicate className bug in RecentlyViewed component",
    ],
  },
  {
    date: "2026-06-15",
    version: "1.7.0",
    title: "E-E-A-T Schema Sweep — Publishing Principles, Ethics & Corrections Policy",
    type: "improvement",
    items: [
      "Added publishingPrinciples, ethicsPolicy, and correctionsPolicy to all 40+ page schemas",
      "Added accessibilityFeature arrays to every schema (structuralNavigation, alternativeText, readingOrder)",
      "Launched dynamic /llms.txt describing site structure for AI crawlers",
      "Added CompareAction schema to homepage and comparison pages for voice/AI search",
      "Added accessibilityFeature and conditionsOfAccess to organization and WebSite schemas",
    ],
  },
  {
    date: "2026-05-20",
    version: "1.6.0",
    title: "Design System Token Sweep — Full Semantic Color System",
    type: "improvement",
    items: [
      "Replaced all raw Tailwind gray-* classes with semantic design tokens across 60+ components",
      "Light mode: gray → text-text, text-text-secondary, bg-surface-alt, border-border",
      "Dark sections (footer, hero gradients): gray → text-white/N opacity variants",
      "Fixed TrendingCard rank #2 border, Pagination disabled states, SearchBox category fallbacks",
      "Fixed Header mobile menu, Footer text hierarchy, EmbedButton modal and code blocks",
    ],
  },
  {
    date: "2026-05-01",
    version: "1.5.0",
    title: "Data Studies, Investing Report & B2B SaaS Study",
    type: "content",
    items: [
      "Published 3 original data studies: Most-Compared Brands 2026, B2B SaaS Comparison Report 2026, Investing & Finance Comparison Report 2026",
      "Each study features interactive data tables, stat cards, and methodology section",
      "Full Schema.org Article + Dataset + DataCatalog structured data on each study",
      "Studies hub page at /studies with collection schema for AI crawlers",
    ],
  },
  {
    date: "2026-04-15",
    version: "1.4.0",
    title: "Embed Widget, Developer API & Review Pages",
    type: "feature",
    items: [
      "Launched embeddable comparison widgets — any comparison can be embedded via script tag, iframe, or link badge",
      "Developer dashboard at /developers with usage stats and embed code generator",
      "New review pages at /reviews/[slug] with star ratings, pros/cons, and review aggregation",
      "Added StickyAffiliateCTA component for above-the-fold conversion on comparison pages",
      "Added VersionHistory component showing comparison update timeline",
      "Launched survey system for collecting user insights at /survey",
    ],
  },
  {
    date: "2026-03-15",
    version: "1.3.0",
    title: "Email Notifications, Mobile Fixes & Category Logic",
    type: "improvement",
    items: [
      "Fixed Full Comparison table responsiveness on mobile devices",
      "Added email notifications — all feedback and contact form submissions now sent to team inbox",
      "Fixed internal linking logic — categories now show only logically related topics (economy shows countries/companies, not sports)",
      "Improved mobile text sizing across all comparison components",
    ],
  },
  {
    date: "2026-03-15",
    version: "1.2.0",
    title: "50 New Comparisons & Engagement Features",
    type: "content",
    items: [
      "Added 50 new comparison pages across 8 categories (53 total)",
      "Sports: LeBron vs Jordan, Federer vs Nadal, Ali vs Tyson, Brady vs Manning, and more",
      "Countries: USA vs China, India vs China, Germany vs France, UK vs USA, and more",
      "Technology: PS5 vs Xbox, Mac vs Windows, ChatGPT vs Claude, and more",
      "Companies: Google vs Microsoft, Amazon vs Walmart, Netflix vs Disney+, and more",
      "Brands: Nike vs Adidas, Coca-Cola vs Pepsi, Apple vs Samsung, and more",
      "History: WW1 vs WW2, Roman Empire vs Ottoman Empire, and more",
      "Economy: Bitcoin vs Ethereum, Capitalism vs Socialism, and more",
      "Added share buttons (X, Facebook, LinkedIn, WhatsApp, Reddit, copy link)",
      "Added like button with count on every comparison",
      "Added comment section with name, text, and likes",
      "Added floating feedback widget for requests, questions, and bug reports",
    ],
  },
  {
    date: "2026-03-15",
    version: "1.1.0",
    title: "AI Comparison Generation & Legal Pages",
    type: "feature",
    items: [
      "AI-powered dynamic comparison generation — search for any comparison and it's created in real-time using Claude API",
      "New loading animation while comparisons are being generated",
      "Search results page with comparison pattern parsing (supports 'A vs B', 'compare A to B', 'difference between A and B')",
      "Entity pages showing all comparisons for a given entity (/entity/[slug])",
      "Alternatives pages showing competitors (/alternatives/[slug])",
      "Internal links component with entity links, category links, and 'People Also Compare'",
      "About page with mission statement and platform overview",
      "Contact page with form (name, email, subject, message)",
      "Privacy Policy — comprehensive data handling documentation",
      "Terms of Use — user agreement and intellectual property terms",
      "Disclaimer — accuracy, AI-generated content, and affiliate disclosures",
    ],
  },
  {
    date: "2026-03-15",
    version: "1.0.0",
    title: "Initial Launch — A Versus B",
    type: "launch",
    items: [
      "Launched aversusb.net — the comparison platform",
      "Homepage with hero section, search box, trending comparisons, and category browsing",
      "3 flagship comparison pages: Messi vs Ronaldo, Japan vs China, iPhone 16 vs Samsung S25",
      "Comparison page template with: short answer, key differences, comparison table, pros/cons, verdict, FAQ, related comparisons",
      "10 category hub pages: Sports, Countries, Technology, Products, Celebrities, History, Military, Economy, Companies, Brands",
      "Trending comparisons page",
      "Full JSON-LD structured data: Article, FAQPage, BreadcrumbList, ItemList, Dataset",
      "SEO-optimized metadata, Open Graph, and canonical URLs",
      "DataForSEO integration for keyword discovery (server-side)",
      "Prisma database schema with 20+ models ready for production",
      "Mobile-first responsive design with Tailwind CSS",
      "Custom design system: colors, typography, cards, tables, badges",
    ],
  },
];

const TYPE_BADGES: Record<string, { label: string; className: string }> = {
  launch: { label: "Launch", className: "bg-green-100 text-green-800" },
  feature: { label: "Feature", className: "bg-blue-100 text-blue-800" },
  content: { label: "Content", className: "bg-purple-100 text-purple-800" },
  fix: { label: "Fix", className: "bg-orange-100 text-orange-800" },
  improvement: { label: "Improvement", className: "bg-amber-100 text-amber-800" },
};

// Derive dates from the CHANGELOG array so the schema stays in sync automatically.
const CHANGELOG_LATEST_DATE = CHANGELOG.map((e) => e.date).sort().at(-1) ?? "2026-03-15";
const CHANGELOG_FIRST_DATE = CHANGELOG.map((e) => e.date).sort()[0] ?? "2026-03-15";

const changelogSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Article", "TechArticle"],
      "@id": `${CHANGELOG_URL}#article`,
      headline: CHANGELOG_TITLE,
      description: CHANGELOG_DESC,
      abstract: CHANGELOG_DESC,
      url: CHANGELOG_URL,
      // datePublished / dateModified — freshness signals for Google and AI crawlers.
      // Without these, crawlers cannot determine when the changelog was last updated.
      datePublished: CHANGELOG_FIRST_DATE,
      dateModified: CHANGELOG_LATEST_DATE,
      lastReviewed: CHANGELOG_LATEST_DATE,
      contentReferenceTime: CHANGELOG_LATEST_DATE,
      inLanguage: "en-US",
      genre: "Changelog",
      interactivityType: "expositive",
      creativeWorkStatus: "Published",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      thumbnailUrl: CHANGELOG_OG_IMAGE,
      image: {
        "@type": "ImageObject",
        "@id": `${CHANGELOG_URL}#primaryImage`,
        url: CHANGELOG_OG_IMAGE,
        contentUrl: CHANGELOG_OG_IMAGE,
        width: 1200,
        height: 630,
        caption: `Changelog — ${SITE_NAME} Updates, Features & New Comparisons`,
      },
      alternativeHeadline: `${SITE_NAME} Release Notes & Update History`,
      license: "https://creativecommons.org/licenses/by/4.0/",
      usageInfo: `${SITE_URL}/terms`,
      accessMode: ["textual"],
      accessibilityFeature: ["readingOrder", "structuralNavigation"],
      accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
      educationalLevel: "General",
      teaches: "What has changed and improved in A Versus B platform features and content",
      educationalUse: "reference",
      author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      mainEntityOfPage: { "@type": "WebPage", "@id": CHANGELOG_URL },
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
      ethicsPolicy: `${SITE_URL}/disclaimer`,
      correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
      potentialAction: { "@type": "ReadAction", target: CHANGELOG_URL },
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
      // hasPart — list each release as an ItemList so crawlers can enumerate versions.
      hasPart: {
        "@type": "ItemList",
        name: "Release History",
        numberOfItems: CHANGELOG.length,
        itemListElement: CHANGELOG.map((entry, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${entry.version} — ${entry.title}`,
          description: entry.items[0] ?? entry.title,
          datePublished: entry.date,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Changelog", item: CHANGELOG_URL },
      ],
    },
  ],
};

export default function ChangelogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(changelogSchema) }}
      />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" aria-hidden="true" />
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
              <li className="text-white font-medium" aria-current="page">Changelog</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                Changelog
              </h1>
              <p className="text-primary-100 text-sm sm:text-base max-w-xl mt-1">
                Everything new on {SITE_NAME}. New comparisons, features, improvements, and fixes.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Stats bar */}
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 list-none">
        {[
          { label: "Comparisons", value: "53" },
          { label: "Categories", value: "10" },
          { label: "Entity Pages", value: "100+" },
          { label: "Releases", value: String(CHANGELOG.length) },
        ].map((stat) => (
          <li key={stat.label} className="bg-white border border-border rounded-xl p-4 text-center hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
            <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
          </li>
        ))}
      </ul>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />

        <ol className="space-y-10 list-none">
          {CHANGELOG.map((entry, idx) => {
            const badge = TYPE_BADGES[entry.type] || TYPE_BADGES.improvement;
            return (
              <li key={idx} className="relative pl-12 sm:pl-16">
                {/* Dot on timeline */}
                <div className="absolute left-2.5 sm:left-4.5 top-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 ring-4 ring-white" aria-hidden="true" />

                {/* Date & version */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <time className="text-sm font-medium text-text-secondary" dateTime={entry.date}>
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-xs font-mono text-text-secondary bg-surface-alt px-2 py-0.5 rounded">
                    v{entry.version}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                  {entry.title}
                </h2>

                {/* Items */}
                <ul className="space-y-1.5">
                  {entry.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                      <svg className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Subscribe CTA */}
      <div className="mt-16 bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 rounded-xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none rounded-xl" aria-hidden="true" />
        <h3 className="text-lg font-bold mb-2 relative">Stay Updated</h3>
        <p className="text-primary-100 text-sm mb-4 relative">
          Want to know when we add new comparisons or features? Get in touch.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 hover:shadow-md transition-all duration-150 relative"
        >
          Contact Us
        </Link>
      </div>
      </div>
    </>
  );
}
