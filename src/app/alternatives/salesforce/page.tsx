import type { Metadata } from "next";
import Link from "next/link";
import { CompareLink } from "@/components/comparison/CompareLink";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const PAGE_URL = `${SITE_URL}/alternatives/salesforce`;
const PAGE_TITLE = "Best Salesforce Alternatives in 2026: 7 CRMs That Are Simpler and Cheaper";
const PAGE_DESCRIPTION =
  "HubSpot, Pipedrive, Zoho CRM, Microsoft Dynamics, Freshsales, Copper, and Close compared. Find the best Salesforce alternative for your team size and budget in 2026.";
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Best Salesforce Alternatives in 2026",
)}&a=${encodeURIComponent("Salesforce")}&b=${encodeURIComponent("Alternatives")}&type=comparison`;

export const revalidate = 3600;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
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
    locale: "en_US",
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Best Salesforce Alternatives in 2026",
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
    "citation_publication_date": "2026-07-11",
    "citation_online_date": "2026-07-11",
    "DC.title": PAGE_TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.date": "2026-07-11",
    "DC.identifier": PAGE_URL,
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Salesforce Alternatives in 2026",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: 7,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "HubSpot CRM",
        applicationCategory: "CRM / Marketing + Sales",
        operatingSystem: "Web, iOS, Android",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://www.hubspot.com/products/crm",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "Pipedrive",
        applicationCategory: "CRM / Sales Pipeline",
        operatingSystem: "Web, iOS, Android",
        offers: { "@type": "Offer", price: "14.90", priceCurrency: "USD" },
        url: "https://www.pipedrive.com",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "SoftwareApplication",
        name: "Zoho CRM",
        applicationCategory: "CRM / Full-suite",
        operatingSystem: "Web, Windows, macOS, iOS, Android",
        offers: { "@type": "Offer", price: "14", priceCurrency: "USD" },
        url: "https://www.zoho.com/crm/",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "SoftwareApplication",
        name: "Microsoft Dynamics 365",
        applicationCategory: "CRM / Enterprise",
        operatingSystem: "Web, Windows, iOS, Android",
        offers: { "@type": "Offer", price: "65", priceCurrency: "USD" },
        url: "https://dynamics.microsoft.com/",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "SoftwareApplication",
        name: "Freshsales",
        applicationCategory: "CRM / AI-powered",
        operatingSystem: "Web, iOS, Android",
        offers: { "@type": "Offer", price: "15", priceCurrency: "USD" },
        url: "https://www.freshworks.com/crm/sales/",
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "SoftwareApplication",
        name: "Copper",
        applicationCategory: "CRM / Google Workspace",
        operatingSystem: "Web, iOS, Android",
        offers: { "@type": "Offer", price: "23", priceCurrency: "USD" },
        url: "https://www.copper.com",
      },
    },
    {
      "@type": "ListItem",
      position: 7,
      item: {
        "@type": "SoftwareApplication",
        name: "Close",
        applicationCategory: "CRM / Inside Sales",
        operatingSystem: "Web, iOS, Android",
        offers: { "@type": "Offer", price: "49", priceCurrency: "USD" },
        url: "https://www.close.com",
      },
    },
  ],
};

// FAQ copy is byte-identical to the FAQ section below — if you change one,
// you MUST change the other (DAN-872 acceptance).
// Dev caveat (DAN-608 / DAN-701 carryforward): FAQPage is emitted for
// semantic/AIO completeness only. Google's Aug 2023 change disqualifies
// non-gov/non-health domains from FAQ rich results; do not track FAQ
// rich-result impressions as a KPI on this page.
const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best Salesforce alternative for small business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HubSpot CRM is the best Salesforce alternative for small businesses — it's free for unlimited users with solid contact management, deal pipelines, and email tracking. For teams wanting a cleaner pipeline-focused tool, Pipedrive at $14.90/user/mo is the second-best pick. Both require no dedicated admin and can be set up in a day.",
      },
    },
    {
      "@type": "Question",
      name: "Is HubSpot a good Salesforce replacement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, for most SMBs and mid-market teams. HubSpot's free CRM covers the core use cases — contact management, deal tracking, email, and basic reporting. The paid Sales Hub tiers add sequences, forecasting, and deeper automation. The trade-off: HubSpot's advanced tiers (Professional $500/mo, Enterprise $1,500/mo) can approach or exceed Salesforce costs at scale, so evaluate total cost at your projected user count before committing.",
      },
    },
    {
      "@type": "Question",
      name: "Which CRM is cheapest compared to Salesforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Zoho CRM Standard at $14/user/mo is the cheapest full-featured Salesforce alternative. HubSpot's free tier costs nothing for unlimited users. Freshsales Growth starts at $15/user/mo. All three undercut Salesforce Starter ($25/user/mo) and especially Salesforce Professional ($80/user/mo) by a wide margin.",
      },
    },
    {
      "@type": "Question",
      name: "Can a small team use Salesforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Technically yes, but Salesforce is rarely cost-effective for teams under 20. Salesforce Starter is $25/user/mo with limited features. Moving to Professional ($80/user/mo) is where the core feature set unlocks, but that's $1,600/mo for 20 users before consulting fees. Most small teams get equivalent value from HubSpot, Pipedrive, or Zoho at a fraction of the cost and without needing a dedicated Salesforce admin.",
      },
    },
    {
      "@type": "Question",
      name: "What CRM do startups use instead of Salesforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HubSpot is the most common startup choice — the free tier is genuinely useful, and it scales gracefully. ClickUp and Notion handle lightweight CRM for very early-stage teams. For sales-led B2B startups with inside sales teams making high call volume, Close is a purpose-built alternative with built-in calling and sequencing designed for that motion.",
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
      name: "Salesforce Alternatives",
      item: { "@type": "WebPage", "@id": PAGE_URL, name: "Salesforce Alternatives", url: PAGE_URL },
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
  datePublished: "2026-07-11",
  dateModified: "2026-07-11",
  contentReferenceTime: "2026-07-11",
  thumbnailUrl: OG_IMAGE,
  image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Best Salesforce Alternatives in 2026 — A Versus B" },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Sales teams and business owners comparing CRM platforms", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
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
  timeRequired: "PT5M",
  wordCount: 900,
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
    name: "HubSpot CRM",
    bestFor: "SMBs and marketing-led growth",
    freeTier: "Yes (unlimited users)",
    paidEntry: "Sales Hub Starter $20/u/mo",
    advantage: "Free tier is genuinely useful; all-in-one marketing + sales + service hub",
  },
  {
    rank: 2,
    name: "Pipedrive",
    bestFor: "Visual pipeline management",
    freeTier: "No (14-day trial)",
    paidEntry: "Essential $14.90/u/mo",
    advantage: "Clean pipeline-first UI; fast to set up; no admin required",
  },
  {
    rank: 3,
    name: "Zoho CRM",
    bestFor: "Value-conscious teams needing full features",
    freeTier: "Yes (up to 3 users)",
    paidEntry: "Standard $14/u/mo",
    advantage: "Widest feature set per dollar; deep Zoho ecosystem integration",
  },
  {
    rank: 4,
    name: "Microsoft Dynamics 365",
    bestFor: "Microsoft 365 enterprise orgs",
    freeTier: "No",
    paidEntry: "Sales Professional $65/u/mo",
    advantage: "Native M365 + Azure integration; best fit for existing Microsoft shops",
  },
  {
    rank: 5,
    name: "Freshsales",
    bestFor: "AI-powered lead scoring and sequencing",
    freeTier: "Yes (up to 3 users)",
    paidEntry: "Growth $15/u/mo",
    advantage: "Built-in AI scoring, phone, email sequences; cheaper than Salesforce",
  },
  {
    rank: 6,
    name: "Copper",
    bestFor: "Google Workspace teams",
    freeTier: "No (14-day trial)",
    paidEntry: "Starter $23/u/mo",
    advantage: "Lives inside Gmail/Calendar; zero duplicate data entry for Google shops",
  },
  {
    rank: 7,
    name: "Close",
    bestFor: "Inside sales teams with high call volume",
    freeTier: "No (14-day trial)",
    paidEntry: "Startup $49/mo (3 users)",
    advantage: "Built-in calling, SMS, email sequences; purpose-built for outbound sales",
  },
];

export default function SalesforceAlternativesPage() {
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
              <Link href="/alternatives" className="hover:text-primary-600 transition-colors">
                Alternatives
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-text font-medium" aria-current="page">Salesforce Alternatives</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text leading-tight">
            Best Salesforce Alternatives in 2026: 7 CRMs That Are Simpler and Cheaper
          </h1>
          <p className="mt-3 text-sm text-text-secondary italic">
            Updated July 2026 · Pricing verified against provider pages.
          </p>
        </header>

        <section aria-labelledby="salesforce-why-look-for-a" className="prose-section">
          <h2 id="salesforce-why-look-for-a" className="text-2xl font-bold text-text mt-10 mb-4">
            Why look for a Salesforce alternative?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Salesforce is the dominant CRM platform for a reason — it is the most configurable,
            most integration-rich, and most widely supported CRM on the market. But dominant
            doesn&rsquo;t mean best fit, especially for teams under 200 people. Three problems
            push buyers to look elsewhere: cost ($25/user/mo for Starter, $80/user/mo for
            Professional, and $300+ per user for advanced tiers before add-ons and consulting
            fees), implementation complexity (most Salesforce deployments require a dedicated
            admin or a six-figure consulting engagement), and long timelines to first value —
            Salesforce setups measured in months are common.
          </p>
          <p className="text-text leading-relaxed mb-4">
            In 2026, the CRM alternatives market has never been stronger. HubSpot, Pipedrive,
            and Zoho have closed the capability gap at a fraction of the price. This page
            covers the seven best Salesforce alternatives, matched to specific team sizes, tech
            ecosystems, and sales motion types — so you can find the right fit instead of the
            most famous brand.
          </p>
        </section>

        {/* Comparison table */}
        <section aria-labelledby="salesforce-the-7-best-salesforce" className="mt-10">
          <h2 id="salesforce-the-7-best-salesforce" className="text-2xl font-bold text-text mb-4">
            The 7 best Salesforce alternatives at a glance
          </h2>

          {/* Desktop / tablet */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border bg-white" tabIndex={0} role="region" aria-label="Scrollable table">
            <table className="min-w-full text-sm" aria-label="Best Salesforce alternatives at a glance">
              <thead className="bg-surface-alt text-text-secondary">
                <tr>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">#</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Alternative</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Best for</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Free tier</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Paid (entry)</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">
                    Key advantage over Salesforce
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
                    <dt className="text-text-secondary text-xs uppercase tracking-wide">Key advantage over Salesforce</dt>
                    <dd className="text-text">{row.advantage}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* 1. HubSpot */}
        <section aria-labelledby="salesforce-1-hubspot-best" className="mt-12">
          <h2 id="salesforce-1-hubspot-best" className="text-2xl font-bold text-text mb-3">
            1. HubSpot CRM — best free Salesforce alternative for SMBs
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Salesforce:</strong> HubSpot&rsquo;s free CRM is the most
            credible no-cost starting point for any team coming off Salesforce or evaluating
            their first CRM. Unlimited users, unlimited contacts, deal pipelines, email
            tracking, meeting scheduling, and a live chat widget are all available with zero
            spend. More importantly, HubSpot&rsquo;s architecture connects marketing, sales,
            and service in a single platform without the integration cost and complexity of
            wiring separate Salesforce products together. For inbound-led companies where
            marketing automation and CRM alignment matter, HubSpot is structurally ahead of
            Salesforce at the SMB price point. The caveat: HubSpot&rsquo;s own advanced tiers
            (Professional and Enterprise) are expensive, so evaluate the full roadmap before
            treating the free tier as a permanent solution.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">When to choose HubSpot over Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want to start free and scale gradually without a big upfront commitment</li>
            <li>Marketing, sales, and service alignment is a priority (the HubSpot flywheel model)</li>
            <li>You don&rsquo;t have a Salesforce admin or the budget to hire one</li>
            <li>Your team is under 50 people and Salesforce feels over-engineered</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need deep custom objects, complex workflow logic, or Salesforce AppExchange apps</li>
            <li>Your enterprise contracts require a vendor with Salesforce&rsquo;s compliance certifications</li>
            <li>You run a high-volume field sales motion that Salesforce&rsquo;s Einstein AI supports</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Free (unlimited users) · Sales Hub Starter $20/u/mo ·
            Professional $100/u/mo · Enterprise $150/u/mo
          </p>
          <p className="text-text">
            Compare:{" "}
            <CompareLink
              href="/compare/salesforce-vs-hubspot"
              className="text-primary-600 font-semibold hover:underline"
            >
              Salesforce vs HubSpot
            </CompareLink>
          </p>
        </section>

        {/* 2. Pipedrive */}
        <section aria-labelledby="salesforce-2-pipedrive-best" className="mt-12">
          <h2 id="salesforce-2-pipedrive-best" className="text-2xl font-bold text-text mb-3">
            2. Pipedrive — best visual pipeline alternative for sales-led teams
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Salesforce:</strong> Pipedrive is built around one idea —
            the visual deal pipeline — and it executes that idea better than any other CRM on
            this list. Every feature serves the question: &ldquo;What should my rep do next to
            move a deal forward?&rdquo; Setup takes hours, not weeks. There&rsquo;s no admin
            required. The UI is intuitive enough that reps actually use it without manager
            enforcement, which solves Salesforce&rsquo;s notorious adoption problem.
            Pipedrive&rsquo;s AI Sales Assistant (included at Advanced and above) surfaces
            deal warnings, suggests follow-up timing, and flags stalled deals — without the
            Einstein licensing cost layered on top of Salesforce. At $14.90/u/mo Essential,
            it&rsquo;s one of the most accessible entry points in B2B CRM.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">When to choose Pipedrive over Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You run a B2B sales team and pipeline visibility is the primary use case</li>
            <li>Rep adoption is a problem and you need a simpler, more intuitive tool</li>
            <li>You want fast time-to-value — days of setup rather than months</li>
            <li>Your team is under 100 reps and you don&rsquo;t need enterprise governance</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need complex multi-object relationships, custom apps, or AppExchange integrations</li>
            <li>Enterprise reporting with hundreds of custom fields is a requirement</li>
            <li>You have an existing Salesforce admin and the switching cost is high</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Essential $14.90/u/mo · Advanced $27.90/u/mo · Professional
            $49.90/u/mo · Power $64.90/u/mo · Enterprise $99/u/mo
          </p>
          <p className="text-text">
            Compare:{" "}
            <CompareLink
              href="/compare/salesforce-vs-pipedrive"
              className="text-primary-600 font-semibold hover:underline"
            >
              Salesforce vs Pipedrive
            </CompareLink>
          </p>
        </section>

        {/* 3. Zoho CRM */}
        <section aria-labelledby="salesforce-3-zoho-crm-best" className="mt-12">
          <h2 id="salesforce-3-zoho-crm-best" className="text-2xl font-bold text-text mb-3">
            3. Zoho CRM — best value alternative for feature-complete teams on a budget
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Salesforce:</strong> Zoho CRM packs more per dollar than
            any other CRM on this list — leads, contacts, accounts, deals, workflows,
            automations, email marketing, telephony, social integrations, and AI (Zia) are
            available from $14/u/mo Standard. For teams that want Salesforce-level feature
            depth at a price that doesn&rsquo;t require board approval, Zoho is the answer.
            The broader Zoho ecosystem (Zoho Desk, Zoho Books, Zoho Campaigns, Zoho
            Analytics) means you can build a full business stack entirely within one vendor,
            avoiding the data-silo problem that plagues best-of-breed stacks stitched around
            Salesforce. The trade-off: Zoho&rsquo;s UI and documentation quality lag behind
            Salesforce and HubSpot, and the breadth can feel overwhelming without a guided
            onboarding.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">When to choose Zoho CRM over Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Budget is the primary constraint and you need full CRM features without enterprise pricing</li>
            <li>You want an integrated business suite (CRM + accounting + support + analytics) under one vendor</li>
            <li>Your team is globally distributed and needs multi-currency, multi-language support</li>
            <li>You&rsquo;re in a market where Zoho&rsquo;s regional support is strong (India, Middle East, Southeast Asia)</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your enterprise procurement team requires a Salesforce vendor for compliance or liability reasons</li>
            <li>You rely on AppExchange-specific applications that have no Zoho equivalent</li>
            <li>Your team needs the polished UX and design quality that Salesforce invests heavily in</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Free (up to 3 users) · Standard $14/u/mo · Professional
            $23/u/mo · Enterprise $40/u/mo · Ultimate $52/u/mo
          </p>
          <p className="text-text">
            Compare:{" "}
            <CompareLink
              href="/compare/salesforce-vs-zoho-crm"
              className="text-primary-600 font-semibold hover:underline"
            >
              Salesforce vs Zoho CRM
            </CompareLink>
          </p>
        </section>

        {/* 4. Microsoft Dynamics 365 */}
        <section aria-labelledby="salesforce-4-microsoft-dynamics-best" className="mt-12">
          <h2 id="salesforce-4-microsoft-dynamics-best" className="text-2xl font-bold text-text mb-3">
            4. Microsoft Dynamics 365 — best alternative for Microsoft-native enterprises
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Salesforce:</strong> For organizations already deep in
            Microsoft 365, Azure, and Teams, Dynamics 365 Sales offers tighter native
            integration than Salesforce&rsquo;s Microsoft connectors ever can. Outlook
            integration is bi-directional and real-time. LinkedIn Sales Navigator is bundled
            (Relationship Sales add-on). Teams meetings link directly to CRM records. Azure
            AI and Copilot capabilities in Dynamics have advanced rapidly in 2025–2026,
            surfacing deal insights and drafting follow-up emails without the extra Einstein
            licensing Salesforce charges. For a Microsoft shop negotiating an EA, Dynamics
            can often be included in bundle pricing that makes the per-seat comparison with
            Salesforce even more favorable.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">When to choose Dynamics 365 over Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your organization is standardized on Microsoft 365 and Azure</li>
            <li>You want bi-directional Outlook sync and Teams-native CRM actions</li>
            <li>LinkedIn Sales Navigator integration is a priority for your sales team</li>
            <li>You can negotiate Dynamics into an existing Microsoft EA for bundled pricing</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your stack is Google Workspace, not Microsoft — Salesforce integrates better in that ecosystem</li>
            <li>You need the depth and maturity of Salesforce&rsquo;s AppExchange (4,000+ apps)</li>
            <li>Your team is used to Salesforce&rsquo;s UX and retraining is a significant cost</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Sales Professional $65/u/mo · Sales Enterprise $105/u/mo ·
            Sales Premium $150/u/mo · Microsoft 365 bundle pricing available through EA
          </p>
          <p className="text-text">
            Compare:{" "}
            <CompareLink
              href="/compare/salesforce-vs-microsoft-dynamics"
              className="text-primary-600 font-semibold hover:underline"
            >
              Salesforce vs Microsoft Dynamics 365
            </CompareLink>
          </p>
        </section>

        {/* 5. Freshsales */}
        <section aria-labelledby="salesforce-5-freshsales-best" className="mt-12">
          <h2 id="salesforce-5-freshsales-best" className="text-2xl font-bold text-text mb-3">
            5. Freshsales — best AI-powered alternative for growing sales teams
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Salesforce:</strong> Freshsales (part of the Freshworks suite)
            bundles AI lead scoring, built-in phone/SMS, email sequencing, and web tracking
            into a single platform that costs $15/u/mo at the Growth tier — versus Salesforce
            where each of those capabilities may require a separate add-on or AppExchange
            purchase. The AI — Freddy AI — scores leads based on behavior, suggests the next
            best action, and predicts deal closures without needing a data science team to
            configure it. For growing B2B teams that want a Salesforce-adjacent feature set
            without the Salesforce price and admin overhead, Freshsales hits the right price-to-
            capability ratio.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">When to choose Freshsales over Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want AI lead scoring and sequencing without paying for Salesforce Einstein</li>
            <li>Built-in calling and SMS are important (avoiding a separate Aircall/Dialpad subscription)</li>
            <li>You&rsquo;re part of a Freshworks shop (Freshdesk, Freshservice) and want one vendor</li>
            <li>Your team is 10–200 reps and you want to scale without a dedicated admin</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need Salesforce&rsquo;s enterprise compliance, governance, and audit trail depth</li>
            <li>Custom app development on the CRM platform is a core part of your IT roadmap</li>
            <li>Enterprise contract management (CPQ) is required</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Free (up to 3 users) · Growth $15/u/mo · Pro $39/u/mo ·
            Enterprise $69/u/mo
          </p>
          <p className="text-text">
            Compare: Freshsales vs Salesforce — AI-powered CRM at a mid-market price point.
          </p>
        </section>

        {/* 6. Copper */}
        <section aria-labelledby="salesforce-6-copper-best" className="mt-12">
          <h2 id="salesforce-6-copper-best" className="text-2xl font-bold text-text mb-3">
            6. Copper — best alternative for Google Workspace teams
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Salesforce:</strong> Copper is the only CRM built natively
            inside Google Workspace — it lives in your Gmail sidebar, auto-captures contacts
            from email threads, syncs calendar meetings to deal records, and populates CRM data
            without any manual data entry. For Google-native teams, this eliminates the biggest
            CRM adoption problem: reps forgetting to log activity. Salesforce&rsquo;s Gmail
            connector works, but it&rsquo;s an integration bolt-on; Copper is the native
            experience. At $23/u/mo Starter, it&rsquo;s a fraction of Salesforce Professional
            for teams whose workflow centers on Gmail and Google Calendar.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">When to choose Copper over Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your team lives in Gmail and Google Calendar — Copper removes all data entry friction</li>
            <li>You want automatic activity capture without Salesforce&rsquo;s Inbox Add-on cost</li>
            <li>Your team is small-to-mid-size and you want to be up and running in a day</li>
            <li>You&rsquo;re already on Google Workspace and want a CRM that feels native, not bolted on</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re on Microsoft 365, not Google Workspace</li>
            <li>You need enterprise-scale reporting, custom objects, or AppExchange apps</li>
            <li>Complex sales processes requiring CPQ, territory management, or partner portals</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Starter $23/u/mo · Basic $59/u/mo · Professional $99/u/mo
          </p>
          <p className="text-text">
            Compare: Copper vs Salesforce — Google-native CRM vs the enterprise market leader.
          </p>
        </section>

        {/* 7. Close */}
        <section aria-labelledby="salesforce-7-close-best" className="mt-12">
          <h2 id="salesforce-7-close-best" className="text-2xl font-bold text-text mb-3">
            7. Close — best alternative for inside sales teams with high call volume
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it stands apart:</strong> Close is purpose-built for inside sales teams
            — the outbound, call-heavy, sequence-driven motion that Salesforce accommodates but
            never optimized for. Built-in power dialer, predictive dialer, SMS, email
            sequences, and call recording are native at every plan. For SDR teams making
            50–200 calls per day, Close&rsquo;s workflow is a significant productivity
            upgrade over Salesforce + Outreach/Salesloft stitched together. The Startup plan
            at $49/mo (3 users) is the most accessible entry point for early-stage B2B teams
            doing outbound. Close&rsquo;s simplicity is also its limit — it&rsquo;s not a
            full enterprise CRM, and large orgs with complex account management needs will
            outgrow it.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">When to choose Close over Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your team does outbound calling at volume and needs a built-in dialer, not an add-on</li>
            <li>You want email sequences + calling + SMS in one tool without a separate SEP (Outreach/Salesloft)</li>
            <li>You&rsquo;re an early-stage startup that needs to ship sales infrastructure fast</li>
            <li>Call recording and conversation intelligence are must-haves</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Salesforce:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need enterprise account management, complex opportunity stages, and executive dashboards</li>
            <li>Your sales motion is complex enterprise deals, not high-velocity inside sales</li>
            <li>You need CPQ, partner portal, or custom field complexity beyond Close&rsquo;s scope</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Startup $49/mo (3 users) · Professional $299/mo (3 users) ·
            Enterprise $699/mo (5 users) · additional seats per plan
          </p>
          <p className="text-text">
            Compare: Close vs Salesforce — inside sales specialist vs enterprise CRM.
          </p>
        </section>

        {/* How to choose */}
        <section aria-labelledby="salesforce-how-to-choose-the" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="salesforce-how-to-choose-the" className="text-2xl font-bold text-text">How to choose the right Salesforce alternative</h2>
          </div>
          <p className="text-text font-semibold mb-2">By ecosystem fit:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>
              Google Workspace org<span aria-hidden="true"> →</span> <strong>Copper</strong> (native Gmail CRM) or <strong>HubSpot</strong> (Google integration)
            </li>
            <li>
              Microsoft 365 enterprise<span aria-hidden="true"> →</span> <strong>Microsoft Dynamics 365</strong> (native M365 integration)
            </li>
            <li>
              Freshworks customer (Freshdesk/Freshservice)<span aria-hidden="true"> →</span> <strong>Freshsales</strong> (one vendor, shared data)
            </li>
          </ul>
          <p className="text-text font-semibold mb-2">By use case:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>
              Free CRM to start immediately<span aria-hidden="true"> →</span> <strong>HubSpot CRM</strong>
            </li>
            <li>
              Visual pipeline management<span aria-hidden="true"> →</span> <strong>Pipedrive</strong>
            </li>
            <li>
              Maximum features per dollar<span aria-hidden="true"> →</span> <strong>Zoho CRM</strong>
            </li>
            <li>
              AI lead scoring without Einstein pricing<span aria-hidden="true"> →</span> <strong>Freshsales</strong>
            </li>
            <li>
              High-volume outbound calling + sequences<span aria-hidden="true"> →</span> <strong>Close</strong>
            </li>
          </ul>
          <p className="text-text font-semibold mb-2">By budget:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1">
            <li>
              $0 budget<span aria-hidden="true"> →</span> <strong>HubSpot CRM</strong> (unlimited users free),{" "}
              <strong>Zoho CRM</strong> (3 users free), <strong>Freshsales</strong> (3 users free)
            </li>
            <li>
              Under $25/user (beats Salesforce Starter)<span aria-hidden="true"> →</span>{" "}
              <strong>Pipedrive</strong> ($14.90), <strong>Zoho CRM Standard</strong> ($14),{" "}
              <strong>Freshsales Growth</strong> ($15), <strong>HubSpot Starter</strong> ($20),{" "}
              <strong>Copper</strong> ($23)
            </li>
            <li>
              Under $80/user (beats Salesforce Professional)<span aria-hidden="true"> →</span> all seven alternatives on this page
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section aria-labelledby="salesforce-frequently-asked-questions" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="salesforce-frequently-asked-questions" className="text-2xl font-bold text-text">Frequently asked questions</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-text mb-2">What is the best Salesforce alternative for small business?</h3>
              <p className="text-text leading-relaxed">
                HubSpot CRM is the best Salesforce alternative for small businesses — it&rsquo;s
                free for unlimited users with solid contact management, deal pipelines, and email
                tracking. For teams wanting a cleaner pipeline-focused tool, Pipedrive at
                $14.90/user/mo is the second-best pick. Both require no dedicated admin and can
                be set up in a day.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">Is HubSpot a good Salesforce replacement?</h3>
              <p className="text-text leading-relaxed">
                Yes, for most SMBs and mid-market teams. HubSpot&rsquo;s free CRM covers the
                core use cases — contact management, deal tracking, email, and basic reporting.
                The paid Sales Hub tiers add sequences, forecasting, and deeper automation.
                The trade-off: HubSpot&rsquo;s advanced tiers (Professional $500/mo, Enterprise
                $1,500/mo) can approach or exceed Salesforce costs at scale, so evaluate total
                cost at your projected user count. See{" "}
                <CompareLink href="/compare/salesforce-vs-hubspot" className="text-primary-600 font-semibold hover:underline">
                  Salesforce vs HubSpot
                </CompareLink>{" "}
                for a full breakdown.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">Which CRM is cheapest compared to Salesforce?</h3>
              <p className="text-text leading-relaxed">
                Zoho CRM Standard at $14/user/mo is the cheapest full-featured Salesforce
                alternative. HubSpot&rsquo;s free tier costs nothing for unlimited users.
                Freshsales Growth starts at $15/user/mo. All three undercut Salesforce Starter
                ($25/user/mo) and especially Salesforce Professional ($80/user/mo) by a wide
                margin.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">Can a small team use Salesforce?</h3>
              <p className="text-text leading-relaxed">
                Technically yes, but Salesforce is rarely cost-effective for teams under 20.
                Salesforce Starter is $25/user/mo with limited features. Moving to Professional
                ($80/user/mo) is where the core feature set unlocks, but that&rsquo;s
                $1,600/mo for 20 users before consulting fees. Most small teams get equivalent
                value from HubSpot, Pipedrive, or Zoho at a fraction of the cost and without
                needing a dedicated Salesforce admin.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">What CRM do startups use instead of Salesforce?</h3>
              <p className="text-text leading-relaxed">
                HubSpot is the most common startup choice — the free tier is genuinely useful,
                and it scales gracefully. ClickUp and Notion handle lightweight CRM for very
                early-stage teams. For sales-led B2B startups with inside sales teams making
                high call volume, Close is a purpose-built alternative with built-in calling
                and sequencing designed for that motion.
              </p>
            </div>
          </div>
        </section>

        {/* Related comparisons */}
        <section aria-labelledby="salesforce-related-comparisons" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 id="salesforce-related-comparisons" className="text-2xl font-bold text-text">Related comparisons</h2>
          </div>
          <ul className="space-y-2 text-text">
            <li>
              <CompareLink href="/compare/salesforce-vs-hubspot" className="text-primary-600 font-semibold hover:underline">
                Salesforce vs HubSpot
              </CompareLink>{" "}
              — the most-asked CRM 2-way
            </li>
            <li>
              <CompareLink href="/compare/salesforce-vs-pipedrive" className="text-primary-600 font-semibold hover:underline">
                Salesforce vs Pipedrive
              </CompareLink>{" "}
              — enterprise depth vs pipeline simplicity
            </li>
            <li>
              <CompareLink href="/compare/salesforce-vs-zoho-crm" className="text-primary-600 font-semibold hover:underline">
                Salesforce vs Zoho CRM
              </CompareLink>{" "}
              — market leader vs best value
            </li>
            <li>
              <CompareLink href="/compare/salesforce-vs-microsoft-dynamics" className="text-primary-600 font-semibold hover:underline">
                Salesforce vs Microsoft Dynamics 365
              </CompareLink>{" "}
              — the enterprise CRM battle
            </li>
          </ul>
        </section>

        <div className="mt-12">
          <NewsletterSignup source="alternatives" referrerSlug="salesforce" />
        </div>
      </div>
    </>
  );
}
