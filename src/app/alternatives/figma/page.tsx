import type { Metadata } from "next";
import Link from "next/link";
import { CompareLink } from "@/components/comparison/CompareLink";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const PAGE_URL = `${SITE_URL}/alternatives/figma`;
const PAGE_TITLE = "Best Figma Alternatives in 2026: 8 Design Tools Compared";
const PAGE_DESCRIPTION =
  "Sketch, Adobe XD, Penpot, Framer, Canva, InVision, Marvel, and Lunacy compared. Find the best Figma alternative for open-source, offline design, prototyping, or Mac-native workflows in 2026.";
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Best Figma Alternatives in 2026",
)}&a=${encodeURIComponent("Figma")}&b=${encodeURIComponent("Alternatives")}&type=comparison`;

export const revalidate = 3600;

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
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",

    locale: "en_US",    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Best Figma Alternatives in 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  other: {
    "citation_title": PAGE_TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": PAGE_TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": PAGE_URL,
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Figma Alternatives in 2026",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: 8,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "Sketch",
        applicationCategory: "Design / UI",
        operatingSystem: "macOS",
        offers: { "@type": "Offer", price: "10", priceCurrency: "USD" },
        url: "https://www.sketch.com",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "Adobe XD",
        applicationCategory: "Design / Prototyping",
        operatingSystem: "Windows, macOS",
        offers: { "@type": "Offer", price: "54.99", priceCurrency: "USD" },
        url: "https://www.adobe.com/products/xd.html",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "SoftwareApplication",
        name: "Penpot",
        applicationCategory: "Design / Open-source",
        operatingSystem: "Web, Self-hosted",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://penpot.app",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "SoftwareApplication",
        name: "Framer",
        applicationCategory: "Design / No-code Websites",
        operatingSystem: "Web, macOS",
        offers: { "@type": "Offer", price: "5", priceCurrency: "USD" },
        url: "https://www.framer.com",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "SoftwareApplication",
        name: "Canva",
        applicationCategory: "Design / All-purpose",
        operatingSystem: "Web, iOS, Android, Windows, macOS",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://www.canva.com",
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "SoftwareApplication",
        name: "InVision",
        applicationCategory: "Design / Prototyping",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://www.invisionapp.com",
      },
    },
    {
      "@type": "ListItem",
      position: 7,
      item: {
        "@type": "SoftwareApplication",
        name: "Marvel",
        applicationCategory: "Design / Prototyping",
        operatingSystem: "Web, iOS",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://marvelapp.com",
      },
    },
    {
      "@type": "ListItem",
      position: 8,
      item: {
        "@type": "SoftwareApplication",
        name: "Lunacy",
        applicationCategory: "Design / Free Desktop",
        operatingSystem: "Windows, macOS, Linux",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://icons8.com/lunacy",
      },
    },
  ],
};

// FAQ copy is byte-identical to the FAQ section below — if you change one,
// you MUST change the other (DAN-872 acceptance).
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best free Figma alternative?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Penpot is the strongest free alternative — it's fully open-source, supports the same SVG-based design format, and can be self-hosted for complete data ownership. Canva is the most accessible free option for general design work. Lunacy is the best free desktop app for Windows/macOS if you need offline capability without a subscription.",
      },
    },
    {
      "@type": "Question",
      name: "Is Sketch better than Figma?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For macOS-native workflows, Sketch offers a faster, more polished desktop experience with offline capability. Figma leads on collaboration (real-time multi-cursor), browser-based access, and cross-platform support. Sketch is $10/editor/mo vs Figma's $15/editor/mo, which matters for solo designers or small studios. For teams with mixed operating systems, Figma's browser-first model wins clearly.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a Figma alternative that works offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Sketch (macOS), Adobe XD (Windows + macOS), Lunacy (Windows, macOS, Linux), and Penpot (self-hosted) all work offline. Figma's desktop app has limited offline capability but was designed as a cloud-first tool. If offline work is a hard requirement, Sketch for macOS users or Lunacy for Windows/Linux users are the strongest picks.",
      },
    },
    {
      "@type": "Question",
      name: "What happened to Adobe XD after the Figma acquisition was blocked?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After the EU blocked Adobe's acquisition of Figma in 2024, Adobe continued XD as a product within Creative Cloud. XD is bundled with Adobe Creative Cloud All Apps ($54.99/mo) or available as a standalone plan. Adobe has integrated XD more deeply with Photoshop and Illustrator, positioning it for teams in the full Adobe ecosystem rather than competing head-to-head with Figma on collaboration features.",
      },
    },
    {
      "@type": "Question",
      name: "Is Penpot a good Figma replacement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For teams that prioritize open-source software and data sovereignty, yes. Penpot is the most feature-complete open-source Figma alternative — it supports components, prototyping, grids, SVG-native export, and team collaboration. It lacks some of Figma's advanced features (variables, dev mode depth, plugin ecosystem breadth), but it's improving rapidly. For startups and public-sector orgs that can't use US-hosted SaaS, Penpot is the credible alternative.",
      },
    },
  ],
};

const breadcrumbListSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${PAGE_URL}#breadcrumbs`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": `${SITE_URL}/`, name: "Home", url: `${SITE_URL}/` } },
    {
      "@type": "ListItem",
      position: 2,
      name: "Alternatives",
      item: { "@type": "WebPage", "@id": `${SITE_URL}/alternatives/`, name: "Alternatives", url: `${SITE_URL}/alternatives/` },
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Figma Alternatives",
      item: { "@type": "WebPage", "@id": PAGE_URL, name: "Figma Alternatives", url: PAGE_URL },
    },
  ],
};

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${PAGE_URL}#collectionpage`,
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  genre: "Alternatives Guide",
  inLanguage: "en-US",
  interactivityType: "expositive",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  datePublished: "2026-05-01",
  dateModified: "2026-07-11",
  contentReferenceTime: "2026-07-11",
  thumbnailUrl: OG_IMAGE,
  image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Best Figma Alternatives in 2026 — A Versus B" },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Technology professionals comparing design tools", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText"],
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
      ethicsPolicy: `${SITE_URL}/disclaimer`,
      correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2", ".alternatives-intro"] },
  potentialAction: { "@type": "ReadAction", target: PAGE_URL },
  timeRequired: "PT4M",
  wordCount: 800,
};
interface AlternativeRow {
  rank: number;
  name: string;
  bestFor: string;
  freeTier: string;
  paidEntry: string;
  advantage: string;
}

const TABLE_ROWS: AlternativeRow[] = [
  {
    rank: 1,
    name: "Sketch",
    bestFor: "macOS-native design, offline capability",
    freeTier: "No (30-day trial)",
    paidEntry: "$10/editor/mo or $99/yr",
    advantage: "Native macOS app; fast offline performance; lower price per seat than Figma",
  },
  {
    rank: 2,
    name: "Adobe XD",
    bestFor: "Adobe Creative Cloud users",
    freeTier: "No (bundled in CC)",
    paidEntry: "Included in CC All Apps $54.99/mo",
    advantage: "Tight Photoshop/Illustrator integration; best for existing Adobe teams",
  },
  {
    rank: 3,
    name: "Penpot",
    bestFor: "Open-source, self-hosted, EU data residency",
    freeTier: "Yes (cloud + self-host)",
    paidEntry: "Free / Enterprise custom (self-host)",
    advantage: "Fully open-source; self-hosted option; no vendor lock-in; SVG-native",
  },
  {
    rank: 4,
    name: "Framer",
    bestFor: "Interactive prototypes + no-code websites",
    freeTier: "Yes (1 project, basic)",
    paidEntry: "Mini $5/mo",
    advantage: "Publish working websites directly from the design tool; React-based components",
  },
  {
    rank: 5,
    name: "Canva",
    bestFor: "Non-designers, marketing teams, quick graphics",
    freeTier: "Yes (generous)",
    paidEntry: "Pro $15/mo",
    advantage: "Easiest learning curve; massive template library; AI generation built in",
  },
  {
    rank: 6,
    name: "InVision",
    bestFor: "Prototyping, user testing workflows",
    freeTier: "Yes (3 documents)",
    paidEntry: "Custom (InVision Enterprise)",
    advantage: "Deep user testing integrations; whiteboard (Freehand); large enterprise installs",
  },
  {
    rank: 7,
    name: "Marvel",
    bestFor: "Simple prototypes, beginner designers",
    freeTier: "Yes (1 project)",
    paidEntry: "Pro $12/mo",
    advantage: "Fastest path from sketch to clickable prototype; user testing built in",
  },
  {
    rank: 8,
    name: "Lunacy",
    bestFor: "Free offline desktop design (Windows/Linux/macOS)",
    freeTier: "Yes (fully free)",
    paidEntry: "Free forever",
    advantage: "Completely free; opens .sketch files; works offline; built-in asset library",
  },
];

export default function FigmaAlternativesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
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
              <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/alternatives/figma" className="hover:text-primary-600 transition-colors">
                Alternatives
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-text font-medium" aria-current="page">Figma Alternatives</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text leading-tight">
            Best Figma Alternatives in 2026: 8 Design Tools That Are Actually Good
          </h1>
          <p className="mt-3 text-sm text-text-secondary italic">
            Updated June 2026 · Pricing verified against provider pages.
          </p>
        </header>

        <section aria-labelledby="figma-why-look-for-a" className="prose-section">
          <h2 id="figma-why-look-for-a" className="text-2xl font-bold text-text mt-10 mb-4">
            Why look for a Figma alternative?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Figma is the default UI design tool for product teams — over 4 million designers
            use it as of 2026. But &ldquo;default&rdquo; doesn&rsquo;t mean &ldquo;only
            option.&rdquo; Figma&rsquo;s pricing jumped in 2024 ($15/editor/mo on the
            Professional plan, up from $12), which stings for large design teams. Its
            offline mode remains limited — the browser-based model means a slow connection
            hurts productivity. EU and public-sector teams increasingly need software that
            can be self-hosted outside US infrastructure. And for non-designers, Figma&rsquo;s
            learning curve is steep compared to Canva or Framer.
          </p>
          <p className="text-text leading-relaxed mb-4">
            After the EU blocked Adobe&rsquo;s acquisition of Figma in 2024, the competitive
            landscape stabilized: Figma remains independent, Sketch doubled down on macOS
            native performance, Penpot accelerated feature development as the open-source
            contender, and Framer grew into a &ldquo;design and publish&rdquo; tool for
            production websites. This page covers all eight options by use case.
          </p>
        </section>

        {/* The comparison table */}
        <section aria-labelledby="figma-the-8-best-figma" className="mt-10">
          <h2 id="figma-the-8-best-figma" className="text-2xl font-bold text-text mb-4">
            The 8 best Figma alternatives at a glance
          </h2>

          {/* Desktop / tablet: real table inside an overflow wrapper */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border bg-white" tabIndex={0} role="region" aria-label="Scrollable table">
            <table aria-label="Best Figma alternatives at a glance" className="min-w-full text-sm">
              <thead className="bg-surface-alt text-text-secondary">
                <tr>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">#</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Alternative</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Best for</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Free tier</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Paid (entry)</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">
                    Key advantage over Figma
                  </th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.rank} className="border-t border-border align-top">
                    <td className="px-3 py-3 font-semibold text-text">{row.rank}</td>
                    <td className="px-3 py-3 font-bold text-text">{row.name}</td>
                    <td className="px-3 py-3 text-text">{row.bestFor}</td>
                    <td className="px-3 py-3 text-text">{row.freeTier}</td>
                    <td className="px-3 py-3 text-text">{row.paidEntry}</td>
                    <td className="px-3 py-3 text-text">{row.advantage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <div className="sm:hidden flex flex-col gap-3">
            {TABLE_ROWS.map((row) => (
              <div
                key={row.rank}
                className="rounded-xl border border-border bg-white p-4"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-text-secondary">
                    #{row.rank}
                  </span>
                  <h3 className="text-base font-bold text-text">{row.name}</h3>
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">Best for</dt>
                    <dd className="text-text">{row.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">Free tier</dt>
                    <dd className="text-text">{row.freeTier}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">Paid (entry)</dt>
                    <dd className="text-text">{row.paidEntry}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">
                      Key advantage over Figma
                    </dt>
                    <dd className="text-text">{row.advantage}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* 1. Sketch */}
        <section aria-labelledby="figma-1-sketch-best-alternative" className="mt-12">
          <h2 id="figma-1-sketch-best-alternative" className="text-2xl font-bold text-text mb-3">
            1. Sketch — best alternative for macOS-native design and offline performance
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Figma:</strong> Sketch is a native macOS app — it uses
            Metal rendering and runs entirely offline with no dependency on a network
            connection. For designers who work on trains, planes, or anywhere with
            unreliable internet, this is a genuine competitive advantage over Figma&rsquo;s
            browser-first model. At $10/editor/month (or $99/year), Sketch is 33% cheaper
            than Figma&rsquo;s Professional plan ($15/editor/month). The Sketch plugin
            ecosystem is mature, and Sketch&rsquo;s Workspace model (with real-time
            collaboration via the cloud component) has closed most of the collaboration
            gap with Figma.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Sketch over Figma:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re on macOS and want a native app with full offline capability</li>
            <li>Cost matters and $10/mo vs $15/mo per editor adds up for a large team</li>
            <li>You have existing Sketch library files and an established workflow</li>
            <li>You prefer a desktop-first, pixel-perfect design tool</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Figma:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your team includes Windows or Linux users (Sketch is macOS-only)</li>
            <li>Real-time multi-cursor collaboration is a daily requirement</li>
            <li>You rely on FigJam for whiteboarding and ideation alongside design</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> No free tier (30-day trial) · Individual $10/editor/mo
            or $99/yr · Business $20/u/mo · Unlimited $79/u/mo (unlimited editors)
          </p>
          <p className="text-text">
            Compare:{" "}
            <CompareLink
              href="/compare/figma-vs-sketch"
              className="text-primary-600 font-semibold hover:underline"
            >
              Figma vs Sketch
            </CompareLink>{" "}
            ·{" "}
            <CompareLink
              href="/compare/figma-vs-sketch-vs-adobe-xd"
              className="text-primary-600 font-semibold hover:underline"
            >
              Figma vs Sketch vs Adobe XD
            </CompareLink>
          </p>
        </section>

        {/* 2. Adobe XD */}
        <section aria-labelledby="figma-2-adobe-xd-best" className="mt-12">
          <h2 id="figma-2-adobe-xd-best" className="text-2xl font-bold text-text mb-3">
            2. Adobe XD — best alternative for Adobe Creative Cloud teams
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Figma:</strong> For design teams already on Adobe Creative
            Cloud, XD is effectively included at no extra cost. The integration with
            Photoshop and Illustrator is tighter than any Figma plugin can replicate — copy
            assets between apps in one click, maintain linked source files, and use Creative
            Cloud Libraries to keep design tokens consistent across tools. If your workflow
            involves heavy photo editing, illustration, or print alongside digital UI design,
            the Adobe ecosystem advantage is real.
          </p>
          <p className="text-text leading-relaxed mb-4">
            After the EU blocked Adobe&rsquo;s acquisition of Figma in December 2023, Adobe
            continued XD development as a standalone product. XD now supports Auto-Animate
            for micro-interactions, component states, and collaborative design review within
            Creative Cloud.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Adobe XD over Figma:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your team is on Adobe Creative Cloud and wants no additional subscription</li>
            <li>Your workflow involves tight handoffs between Photoshop/Illustrator and UI design</li>
            <li>You use Creative Cloud Libraries for brand asset management</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Figma:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You don&rsquo;t need other Adobe apps (paying CC just for XD is expensive)</li>
            <li>Real-time collaboration quality matters — Figma&rsquo;s multiplayer is still smoother</li>
            <li>You rely on the FigJam whiteboard for team brainstorming</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Included in Adobe Creative Cloud All Apps $54.99/mo ·
            XD Single App plan $9.99/mo · Teams plans from $89.99/mo per license
          </p>
          <p className="text-text">
            Compare:{" "}
            <CompareLink
              href="/compare/figma-vs-adobe-xd"
              className="text-primary-600 font-semibold hover:underline"
            >
              Figma vs Adobe XD
            </CompareLink>{" "}
            ·{" "}
            <CompareLink
              href="/compare/figma-vs-sketch-vs-adobe-xd"
              className="text-primary-600 font-semibold hover:underline"
            >
              Figma vs Sketch vs Adobe XD
            </CompareLink>
          </p>
        </section>

        {/* 3. Penpot */}
        <section aria-labelledby="figma-3-penpot-best-opensource" className="mt-12">
          <h2 id="figma-3-penpot-best-opensource" className="text-2xl font-bold text-text mb-3">
            3. Penpot — best open-source alternative with self-hosting
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Figma:</strong> Penpot is the only fully open-source design
            tool with collaborative features that rival Figma. It&rsquo;s free on the cloud
            (penpot.app) and can be self-hosted on your own infrastructure — meaning your
            design files never leave your servers. For EU public-sector teams, healthcare
            organizations, defense contractors, or any team with data sovereignty
            requirements, Penpot is the credible answer to &ldquo;we need Figma but can&rsquo;t
            use US-hosted SaaS.&rdquo; Penpot supports components, interactive prototyping,
            grids, and developer handoff.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Penpot over Figma:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need self-hosted design software for data residency or sovereignty</li>
            <li>Your team is subject to GDPR constraints that prohibit US-hosted file storage</li>
            <li>Open-source licensing is a procurement requirement</li>
            <li>You want no-cost collaborative design for a budget-constrained team</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Figma:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need Figma Variables (design tokens) or advanced Auto Layout features</li>
            <li>Your plugin ecosystem needs are extensive (Figma has 1,000+ plugins)</li>
            <li>Developer handoff depth matters — Figma&rsquo;s Dev Mode is more polished</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (cloud, unlimited projects) · Self-hosted free ·
            Enterprise custom
          </p>
        </section>

        {/* 4. Framer */}
        <section aria-labelledby="figma-4-framer-best-alternative" className="mt-12">
          <h2 id="figma-4-framer-best-alternative" className="text-2xl font-bold text-text mb-3">
            4. Framer — best alternative for interactive prototypes and no-code websites
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Figma:</strong> Framer lets you design and publish a
            working website from the same tool. You draw a component, add interaction logic,
            and hit publish — no handoff to a developer required for marketing sites and
            landing pages. The output is React-based, SEO-crawlable, and hosted by Framer
            natively. For marketing teams, startup founders, and designers who want to ship
            web pages without engineering resources, Framer is in a different category than
            Figma (which stops at design and prototype — it doesn&rsquo;t publish live web).
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Framer over Figma:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want to design and publish marketing websites without a developer</li>
            <li>Your project is a landing page, portfolio, or marketing site (not an app UI)</li>
            <li>Interactive prototypes that feel like real apps matter for your process</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Figma:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re designing a complex product UI (app, dashboard, multi-screen flows)</li>
            <li>Real-time team collaboration and design review are primary requirements</li>
            <li>You need component library management at scale across a design team</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (1 project, basic) · Mini $5/mo · Basic $15/mo ·
            Pro $30/mo · Enterprise custom
          </p>
        </section>

        {/* 5. Canva */}
        <section aria-labelledby="figma-5-canva-best-alternative" className="mt-12">
          <h2 id="figma-5-canva-best-alternative" className="text-2xl font-bold text-text mb-3">
            5. Canva — best alternative for non-designers and marketing teams
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Figma:</strong> Canva is the easiest design tool on this
            list — its drag-and-drop template model is usable by anyone in under five
            minutes. Over 135 million users as of 2026 use it for social media graphics,
            presentations, posters, and marketing materials without design training.
            Canva&rsquo;s AI Magic Studio generates images, removes backgrounds, rewrites
            copy, and animates presentations with one click. For marketers, small business
            owners, and content creators who need to produce visual assets quickly — not
            design pixel-perfect UI — Canva is clearly the right tool.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Canva over Figma:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re a non-designer creating marketing, social, or presentation content</li>
            <li>You need a massive template library (1M+ templates) to start from</li>
            <li>AI-assisted design generation is a priority in your workflow</li>
            <li>Budget is constrained — Canva&rsquo;s free tier is genuinely useful</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Figma:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re designing product UI with component libraries, auto layout, and variants</li>
            <li>Developer handoff (inspect mode, CSS values) is a core requirement</li>
            <li>Precision vector editing and constraint-based layout matter for your work</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (generous) · Pro $15/mo · Teams $10/u/mo ·
            Enterprise custom
          </p>
        </section>

        {/* 6. InVision */}
        <section aria-labelledby="figma-6-invision-best-alternative" className="mt-12">
          <h2 id="figma-6-invision-best-alternative" className="text-2xl font-bold text-text mb-3">
            6. InVision — best alternative for enterprise prototyping and user testing
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it stands apart:</strong> InVision has been the enterprise
            prototyping standard since 2013. Its InVision Freehand (collaborative
            whiteboard), user testing integrations (Maze, UserTesting), and design-to-dev
            handoff workflows (InVision Inspect) are deeply embedded in large product
            organizations. While InVision has been leaner post-2023 (after organizational
            restructuring), many enterprise design teams continue to use it for established
            workflows around design reviews and usability testing that predate Figma&rsquo;s
            dominance.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose InVision over Figma:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your enterprise team has established InVision workflows for review and handoff</li>
            <li>You use InVision Freehand for collaborative whiteboarding at scale</li>
            <li>User testing integrations are central to your research process</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Figma:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re starting a new design workflow from scratch (Figma is the stronger default)</li>
            <li>Real-time design collaboration in the same file is essential</li>
            <li>Component library depth and variants support are critical</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (3 documents) · Enterprise custom
          </p>
        </section>

        {/* 7. Marvel */}
        <section aria-labelledby="figma-7-marvel-best-alternative" className="mt-12">
          <h2 id="figma-7-marvel-best-alternative" className="text-2xl font-bold text-text mb-3">
            7. Marvel — best alternative for fast clickable prototypes and user testing
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it stands apart:</strong> Marvel&rsquo;s value proposition is speed:
            upload any image, sketch, or screen and link them into a clickable prototype in
            under 10 minutes. Its built-in user testing tool (Marvel Test) allows you to
            send prototypes to participants and receive video recordings with click heatmaps
            — without integrating a separate tool. For startup founders, solo designers, and
            early-stage product teams who need to validate ideas before investing in
            high-fidelity design, Marvel reduces the design-to-feedback cycle significantly.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Marvel over Figma:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need the fastest path from a sketch to a testable prototype</li>
            <li>User testing with recorded sessions is central to your validation process</li>
            <li>You&rsquo;re new to design tools and want minimal setup</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Figma:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need pixel-precise UI design with component libraries</li>
            <li>Real-time team collaboration in the same design file is required</li>
            <li>Your design system needs to scale across a large product</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (1 project) · Pro $12/mo · Team $42/mo (3 users) ·
            Company $84/mo (unlimited users)
          </p>
        </section>

        {/* 8. Lunacy */}
        <section aria-labelledby="figma-8-lunacy-best-free" className="mt-12">
          <h2 id="figma-8-lunacy-best-free" className="text-2xl font-bold text-text mb-3">
            8. Lunacy — best free desktop design tool for Windows and Linux
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it stands apart:</strong> Lunacy by Icons8 is completely free —
            no subscription, no freemium cap, no time limit. It runs natively on Windows,
            macOS, and Linux, works offline, and opens Sketch files natively (which Figma
            can&rsquo;t do without a plugin). Built-in asset libraries (icons, photos,
            illustrations) from Icons8 are accessible directly in the design canvas.
            For solo designers, freelancers, or students who want professional design
            software without a subscription, Lunacy is the answer.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Lunacy over Figma:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want a professional design tool with zero subscription cost</li>
            <li>You&rsquo;re on Windows or Linux (Figma is browser-based but heavier)</li>
            <li>Offline capability is a requirement</li>
            <li>You have .sketch files you need to open without plugins</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Figma:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Real-time collaboration with multiple editors is required</li>
            <li>You need the full Figma plugin ecosystem (1,000+ plugins)</li>
            <li>Developer handoff depth (Dev Mode, code export) is important</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (fully featured, no time limit) · Cloud storage
            add-on available
          </p>
        </section>

        {/* How to choose */}
        <section aria-labelledby="figma-how-to-choose-the" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="figma-how-to-choose-the" className="text-2xl font-bold text-text">How to choose the right Figma alternative</h2>
          </div>
          <p className="text-text font-semibold mb-2">By use case:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>
              macOS-native, offline design<span aria-hidden="true"> →</span> <strong>Sketch</strong>
            </li>
            <li>
              Adobe CC team<span aria-hidden="true"> →</span> <strong>Adobe XD</strong> (bundled)
            </li>
            <li>
              Open-source, self-hosted<span aria-hidden="true"> →</span> <strong>Penpot</strong>
            </li>
            <li>
              Design + publish websites<span aria-hidden="true"> →</span> <strong>Framer</strong>
            </li>
            <li>
              Non-designer / marketing<span aria-hidden="true"> →</span> <strong>Canva</strong>
            </li>
            <li>
              Enterprise prototyping / user testing<span aria-hidden="true"> →</span> <strong>InVision</strong>
            </li>
            <li>
              Fastest prototype to user test<span aria-hidden="true"> →</span> <strong>Marvel</strong>
            </li>
            <li>
              Free offline desktop app<span aria-hidden="true"> →</span> <strong>Lunacy</strong>
            </li>
          </ul>
          <p className="text-text font-semibold mb-2">By price:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1">
            <li>
              $0<span aria-hidden="true"> →</span> <strong>Penpot</strong> (open-source cloud), <strong>Canva</strong> (free
              tier), <strong>Lunacy</strong> (fully free), <strong>InVision</strong> (3 docs
              free), <strong>Marvel</strong> (1 project free)
            </li>
            <li>
              Under $12/mo<span aria-hidden="true"> →</span> <strong>Sketch</strong> ($10), <strong>Framer Mini</strong> ($5)
            </li>
            <li>
              Adobe CC bundle<span aria-hidden="true"> →</span> <strong>Adobe XD</strong> (included in $54.99/mo CC)
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section aria-labelledby="figma-frequently-asked-questions" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="figma-frequently-asked-questions" className="text-2xl font-bold text-text">Frequently asked questions</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-text mb-2">
                What is the best free Figma alternative?
              </h3>
              <p className="text-text leading-relaxed">
                Penpot is the strongest free alternative — it&rsquo;s fully open-source,
                supports the same SVG-based design format, and can be self-hosted for
                complete data ownership. Canva is the most accessible free option for
                general design work. Lunacy is the best free desktop app for Windows/macOS
                if you need offline capability without a subscription.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">Is Sketch better than Figma?</h3>
              <p className="text-text leading-relaxed">
                For macOS-native workflows, Sketch offers a faster, more polished desktop
                experience with offline capability. Figma leads on collaboration (real-time
                multi-cursor), browser-based access, and cross-platform support. Sketch is
                $10/editor/mo vs Figma&rsquo;s $15/editor/mo. See{" "}
                <CompareLink
                  href="/compare/figma-vs-sketch"
                  className="text-primary-600 font-semibold hover:underline"
                >
                  Figma vs Sketch
                </CompareLink>{" "}
                for the full comparison.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Is there a Figma alternative that works offline?
              </h3>
              <p className="text-text leading-relaxed">
                Yes — Sketch (macOS), Adobe XD (Windows + macOS), Lunacy (Windows, macOS,
                Linux), and Penpot (self-hosted) all work offline. Figma&rsquo;s desktop app
                has limited offline capability but was designed as a cloud-first tool. If
                offline work is a hard requirement, Sketch for macOS users or Lunacy for
                Windows/Linux users are the strongest picks.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                What happened to Adobe XD after the Figma acquisition was blocked?
              </h3>
              <p className="text-text leading-relaxed">
                After the EU blocked Adobe&rsquo;s acquisition of Figma in 2024, Adobe
                continued XD as a product within Creative Cloud. XD is bundled with Adobe
                Creative Cloud All Apps ($54.99/mo) or available as a standalone plan. Adobe
                has integrated XD more deeply with Photoshop and Illustrator, positioning it
                for teams in the full Adobe ecosystem rather than competing head-to-head with
                Figma on collaboration features.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Is Penpot a good Figma replacement?
              </h3>
              <p className="text-text leading-relaxed">
                For teams that prioritize open-source software and data sovereignty, yes.
                Penpot is the most feature-complete open-source Figma alternative — it
                supports components, prototyping, grids, SVG-native export, and team
                collaboration. It lacks some of Figma&rsquo;s advanced features (variables,
                dev mode depth, plugin ecosystem breadth), but it&rsquo;s improving rapidly.
                For startups and public-sector orgs that can&rsquo;t use US-hosted SaaS,
                Penpot is the credible alternative.
              </p>
            </div>
          </div>
        </section>

        {/* Related comparisons */}
        <section aria-labelledby="figma-related-comparisons" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 id="figma-related-comparisons" className="text-2xl font-bold text-text">Related comparisons</h2>
          </div>
          <ul className="space-y-2 text-text">
            <li>
              <CompareLink
                href="/compare/figma-vs-sketch"
                className="text-primary-600 font-semibold hover:underline"
              >
                Figma vs Sketch
              </CompareLink>{" "}
              — the most-searched 2-way
            </li>
            <li>
              <CompareLink
                href="/compare/figma-vs-adobe-xd"
                className="text-primary-600 font-semibold hover:underline"
              >
                Figma vs Adobe XD
              </CompareLink>{" "}
              — after the blocked acquisition
            </li>
            <li>
              <CompareLink
                href="/compare/figma-vs-sketch-vs-adobe-xd"
                className="text-primary-600 font-semibold hover:underline"
              >
                Figma vs Sketch vs Adobe XD
              </CompareLink>{" "}
              — 3-way design tool shootout
            </li>
            <li>
              <CompareLink
                href="/compare/figma-vs-framer"
                className="text-primary-600 font-semibold hover:underline"
              >
                Figma vs Framer
              </CompareLink>{" "}
              — design vs design + publish
            </li>
            <li>
              <CompareLink
                href="/compare/figma-vs-canva"
                className="text-primary-600 font-semibold hover:underline"
              >
                Figma vs Canva
              </CompareLink>{" "}
              — pro design tool vs all-purpose creator
            </li>
          </ul>
        </section>

        <div className="mt-12">
          <NewsletterSignup source="alternatives" referrerSlug="figma" />
        </div>
      </div>
    </>
  );
}
