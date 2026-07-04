import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const PAGE_URL = `${SITE_URL}/alternatives/notion`;
const PAGE_TITLE = "Best Notion Alternatives in 2026: 8 Workspace Apps Compared";
const PAGE_DESCRIPTION =
  "Coda, Obsidian, Craft, ClickUp, Confluence, Roam Research, Logseq, and Bear compared. Find the best Notion alternative for linked notes, databases, team wikis, or offline-first use in 2026.";
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Best Notion Alternatives in 2026",
)}&a=${encodeURIComponent("Notion")}&b=${encodeURIComponent("Alternatives")}&type=comparison`;

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
        alt: "Best Notion Alternatives in 2026",
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
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PAGE_DESCRIPTION,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": PAGE_TITLE,
    "DC.creator": "A Versus B",
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
  name: "Best Notion Alternatives in 2026",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: 8,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "Coda",
        applicationCategory: "Productivity / Docs",
        operatingSystem: "Web, macOS, iOS, Android",
        offers: { "@type": "Offer", price: "10", priceCurrency: "USD" },
        url: "https://coda.io",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "Obsidian",
        applicationCategory: "Knowledge Management",
        operatingSystem: "Web, Windows, macOS, Linux, iOS, Android",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://obsidian.md",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "SoftwareApplication",
        name: "Craft",
        applicationCategory: "Productivity / Docs",
        operatingSystem: "macOS, iOS, Web, Windows",
        offers: { "@type": "Offer", price: "5", priceCurrency: "USD" },
        url: "https://www.craft.do",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "SoftwareApplication",
        name: "ClickUp",
        applicationCategory: "Project Management / Docs",
        operatingSystem: "Web, Windows, macOS, iOS, Android, Linux",
        offers: { "@type": "Offer", price: "7", priceCurrency: "USD" },
        url: "https://clickup.com",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "SoftwareApplication",
        name: "Confluence",
        applicationCategory: "Team Wiki / Documentation",
        operatingSystem: "Web, iOS, Android",
        offers: { "@type": "Offer", price: "5.16", priceCurrency: "USD" },
        url: "https://www.atlassian.com/software/confluence",
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "SoftwareApplication",
        name: "Roam Research",
        applicationCategory: "Knowledge Management",
        operatingSystem: "Web, macOS, iOS, Android",
        offers: { "@type": "Offer", price: "15", priceCurrency: "USD" },
        url: "https://roamresearch.com",
      },
    },
    {
      "@type": "ListItem",
      position: 7,
      item: {
        "@type": "SoftwareApplication",
        name: "Logseq",
        applicationCategory: "Knowledge Management",
        operatingSystem: "Web, Windows, macOS, Linux, iOS, Android",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://logseq.com",
      },
    },
    {
      "@type": "ListItem",
      position: 8,
      item: {
        "@type": "SoftwareApplication",
        name: "Bear",
        applicationCategory: "Notes / Markdown",
        operatingSystem: "macOS, iOS",
        offers: { "@type": "Offer", price: "2.99", priceCurrency: "USD" },
        url: "https://bear.app",
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
      name: "What is the best free Notion alternative?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Obsidian and Logseq are both free with no seat caps. Obsidian stores your notes locally as plain Markdown files — zero vendor lock-in. Logseq is open-source and uses the same local-file approach with bi-directional linking. ClickUp's free tier is generous for teams who need project management alongside docs.",
      },
    },
    {
      "@type": "Question",
      name: "Is Obsidian better than Notion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For personal knowledge management and offline-first use, yes. Obsidian stores files locally as plain Markdown, works offline by default, and has a powerful plugin ecosystem. Notion is stronger for team collaboration, databases, and shared workspace features. If your use case is personal PKM rather than team wiki, Obsidian wins clearly.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a Notion alternative with better databases?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Coda is the strongest alternative for relational-database-style docs — it supports cross-table lookups, formulas, and automation natively in a doc. ClickUp handles databases alongside full project management. Notion's databases are good but lack true cross-database joins that Coda supports out of the box.",
      },
    },
    {
      "@type": "Question",
      name: "Which Notion alternative is best for teams and wikis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Confluence is the most enterprise-proven team wiki at scale — 70,000+ companies use it for internal documentation. It integrates tightly with Jira, Trello, and the Atlassian ecosystem. Coda is the better pick if you want docs + databases + automation in one product. ClickUp covers docs + project management if you're consolidating tools.",
      },
    },
    {
      "@type": "Question",
      name: "Does Notion have an offline mode?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Notion's offline mode is limited — you can view recently opened pages but cannot create or edit without an internet connection. If offline-first is a requirement, Obsidian (local files) or Logseq (local files) are the correct alternatives. Craft also offers strong offline editing on Apple platforms.",
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
      name: "Notion Alternatives",
      item: { "@type": "WebPage", "@id": PAGE_URL, name: "Notion Alternatives", url: PAGE_URL },
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
  dateModified: "2026-05-22",
  contentReferenceTime: "2026-05-22",
  thumbnailUrl: OG_IMAGE,
  image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Best Notion Alternatives in 2026 — A Versus B" },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Technology professionals comparing workspace apps", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText"],
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
    name: "Coda",
    bestFor: "Relational databases in docs",
    freeTier: "Yes (unlimited docs, limited rows)",
    paidEntry: "Pro $10/u/mo",
    advantage: "Cross-table lookups, formulas, automation — true relational power Notion lacks",
  },
  {
    rank: 2,
    name: "Obsidian",
    bestFor: "Personal PKM, offline-first, plain text",
    freeTier: "Yes (free forever, local-only)",
    paidEntry: "Sync add-on $5/mo",
    advantage: "Local Markdown files, 1,000+ plugins, zero vendor lock-in",
  },
  {
    rank: 3,
    name: "Craft",
    bestFor: "Beautiful writing, Apple ecosystem",
    freeTier: "Yes (limited docs)",
    paidEntry: "Pro $5/mo or $49/yr",
    advantage: "Native Apple design; best offline writing UX; fast and polished",
  },
  {
    rank: 4,
    name: "ClickUp",
    bestFor: "Docs + project management in one tool",
    freeTier: "Yes (unlimited tasks, 100 MB storage)",
    paidEntry: "Unlimited $7/u/mo",
    advantage: "Replaces Notion + Asana/Trello; Docs nested alongside projects",
  },
  {
    rank: 5,
    name: "Confluence",
    bestFor: "Enterprise teams, Atlassian orgs",
    freeTier: "Yes (10 users)",
    paidEntry: "Standard $5.16/u/mo",
    advantage: "Battle-tested team wiki at scale; Jira/Atlassian native integration",
  },
  {
    rank: 6,
    name: "Roam Research",
    bestFor: "Bi-directional linking, daily notes",
    freeTier: "No (30-day trial)",
    paidEntry: "$15/mo or $165/yr",
    advantage: "Originated the backlinks-first knowledge graph; block-level linking",
  },
  {
    rank: 7,
    name: "Logseq",
    bestFor: "Open-source Roam/Obsidian hybrid",
    freeTier: "Yes (open-source, free)",
    paidEntry: "Self-hosted free / Logseq Sync $8/mo",
    advantage: "Open-source; local Markdown + outliner + bi-directional links; privacy-first",
  },
  {
    rank: 8,
    name: "Bear",
    bestFor: "Apple users, clean Markdown notes",
    freeTier: "Yes (no sync)",
    paidEntry: "Pro $2.99/mo",
    advantage: "Cleanest writing UX on macOS/iOS; fast; Markdown-native; affordable",
  },
];

export default function NotionAlternativesPage() {
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
              <Link href="/alternatives/notion" className="hover:text-primary-600 transition-colors">
                Alternatives
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-text font-medium" aria-current="page">Notion Alternatives</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text leading-tight">
            Best Notion Alternatives in 2026: 8 Workspace Apps That Are Actually Good
          </h1>
          <p className="mt-3 text-sm text-text-secondary italic">
            Updated June 2026 · Pricing verified against provider pages.
          </p>
        </header>

        <section className="prose-section">
          <h2 className="text-2xl font-bold text-text mt-10 mb-4">
            Why look for a Notion alternative?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Notion is the dominant all-in-one workspace for notes, wikis, and databases —
            6.7 million active users as of 2026. But &ldquo;dominant&rdquo; doesn&rsquo;t
            mean &ldquo;best for every use case.&rdquo; Notion&rsquo;s offline mode is
            weak, performance degrades on large workspaces, and its database model lacks
            true cross-table joins that power users need. Its pricing jumped significantly
            in 2024, making it harder to justify for solo users or small teams.
          </p>
          <p className="text-text leading-relaxed mb-4">
            Meanwhile, the alternatives have matured. Obsidian and Logseq are now the
            default choice for personal knowledge management. Coda has closed the
            database gap. ClickUp consolidates docs + project management more cleanly than
            Notion. And Craft has become the go-to writing tool for Apple users who want a
            polished, offline-capable editor. This page is for users evaluating whether one
            of these is a better fit, organized by use case.
          </p>
        </section>

        {/* The comparison table */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-text mb-4">
            The 8 best Notion alternatives at a glance
          </h2>

          {/* Desktop / tablet: real table inside an overflow wrapper */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-alt text-text-secondary">
                <tr>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">#</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Alternative</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Best for</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Free tier</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Paid (entry)</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">
                    Key advantage over Notion
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
                      Key advantage over Notion
                    </dt>
                    <dd className="text-text">{row.advantage}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* 1. Coda */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-3">
            1. Coda — best alternative for relational databases and automation
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Notion:</strong> Coda&rsquo;s tables are genuinely
            relational — you can create cross-table lookups, write formulas that reference
            other tables, and trigger automation from data changes. Notion&rsquo;s databases
            are powerful for single-table use but lack true cross-database joins. If you
            rely on databases for project tracking, CRM, or content planning and keep
            hitting Notion&rsquo;s relational limitations, Coda is the direct upgrade.
          </p>
          <p className="text-text leading-relaxed mb-4">
            Coda also integrates tightly with Google Workspace, Slack, Jira, and Salesforce
            through Packs (Coda&rsquo;s integration layer), allowing automations that pull
            live data from external sources directly into your docs.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Coda over Notion:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need cross-table relational lookups or formula-driven automation</li>
            <li>You want to pull live data from Salesforce, Jira, or Google Sheets into a doc</li>
            <li>Your team builds internal tools (CRMs, trackers, dashboards) inside docs</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Notion:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want the largest template library and third-party integration ecosystem</li>
            <li>Your use case is primarily a team wiki, not database-heavy</li>
            <li>You need Notion AI features (writing assist, summaries) built into the editor</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (unlimited docs, 1,000 rows/doc) · Pro $10/u/mo ·
            Team $30/u/mo · Enterprise custom
          </p>
        </section>

        {/* 2. Obsidian */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-3">
            2. Obsidian — best alternative for personal PKM and offline-first use
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Notion:</strong> Obsidian stores all your notes as plain
            Markdown files on your local filesystem — no vendor lock-in, no data on a
            server you don&rsquo;t control, and full offline capability by default. It has
            grown to over 1,000 community plugins covering everything from Kanban boards
            and citation managers to spaced-repetition flashcards and Dataview (a
            SQL-like query engine for your notes). For researchers, writers, and developers
            who think in linked ideas rather than hierarchical pages, Obsidian&rsquo;s
            bi-directional linking and graph view are structurally better than anything
            Notion offers for personal knowledge management.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Obsidian over Notion:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your primary use case is personal note-taking or knowledge management, not team collaboration</li>
            <li>Offline access and data ownership are hard requirements</li>
            <li>You write in Markdown and want files portable across apps</li>
            <li>You want a plugin ecosystem that lets you build a custom PKM workflow</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Notion:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need team collaboration features (shared pages, comments, permissions)</li>
            <li>You want databases for project tracking, not just notes</li>
            <li>You don&rsquo;t want to manage local files or configure plugins</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (local vault, no sync) · Sync $5/mo or $50/yr ·
            Publish $10/mo · Commercial license $50/yr
          </p>
        </section>

        {/* 3. Craft */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-3">
            3. Craft — best alternative for Apple users who prioritize writing quality
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Notion:</strong> Craft is a native Apple app with the
            design quality and performance you expect from macOS/iOS software — fast,
            snappy, with an editor that feels like a premium writing tool rather than a
            web app wrapper. Offline editing is seamless; everything syncs via iCloud or
            Craft&rsquo;s own sync. Document nesting, block-level linking, and a clean
            visual hierarchy make Craft the best-looking notes app for the Apple ecosystem.
            At $5/month (or $49/yr), it&rsquo;s meaningfully cheaper than Notion Plus.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Craft over Notion:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re on macOS and iOS and want native performance</li>
            <li>Writing quality and editor UX matter more than database features</li>
            <li>You need reliable offline editing on Apple devices</li>
            <li>You want beautiful document sharing and exports (PDF, Markdown, Craft links)</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Notion:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need team wikis, databases, and permission management</li>
            <li>Your team is mixed Windows/macOS (Craft is Apple-first; Windows is limited)</li>
            <li>You need relational data or project tracking, not just writing</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (limited docs) · Pro $5/mo or $49/yr · Business
            $10/u/mo
          </p>
        </section>

        {/* 4. ClickUp */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-3">
            4. ClickUp — best alternative when you also need project management
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Notion:</strong> ClickUp consolidates docs, tasks,
            projects, goals, time tracking, and whiteboards into one product. If
            you&rsquo;re using Notion for a wiki alongside Asana, Trello, or Jira for
            project management, ClickUp can replace both. Docs in ClickUp are nested
            inside project spaces and linked to tasks — so your meeting notes connect
            directly to the action items that came from that meeting. The free tier is
            generous: unlimited tasks, unlimited members, and 100 MB storage.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose ClickUp over Notion:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want docs + project management in one tool without two subscriptions</li>
            <li>You need time tracking, goals, OKRs, and reporting alongside wikis</li>
            <li>Your team already uses ClickUp for tasks and wants to drop Notion</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Notion:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your primary need is a simple, beautiful wiki/knowledge base</li>
            <li>ClickUp&rsquo;s feature density is overwhelming for your team&rsquo;s needs</li>
            <li>You want Notion AI for writing assistance built into your editor</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (unlimited tasks, 100 MB) · Unlimited $7/u/mo ·
            Business $12/u/mo · Enterprise custom
          </p>
        </section>

        {/* 5. Confluence */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-3">
            5. Confluence — best alternative for enterprise teams and Atlassian orgs
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Notion:</strong> Confluence is the battle-tested team wiki
            for enterprise at scale — 70,000+ companies, including the majority of the
            Fortune 500, use it for internal documentation. If your engineering team already
            uses Jira, Confluence is the natural choice: Jira issues link directly into
            Confluence pages, sprint retrospectives update automatically, and the Atlassian
            admin model (SSO, permissions, audit log, DLP) is familiar. Notion&rsquo;s
            enterprise compliance is improving but Confluence has years of proven deployment
            in regulated industries.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Confluence over Notion:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your team is on Jira and wants native bidirectional linking</li>
            <li>You need enterprise compliance: HIPAA, SOC 2, FedRAMP, GDPR at scale</li>
            <li>Your wiki needs advanced permission trees (Space<span aria-hidden="true"> →</span> Page<span aria-hidden="true"> →</span> Section)</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Notion:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re a small team and Confluence feels overengineered</li>
            <li>You prefer Notion&rsquo;s block-based UX over Confluence&rsquo;s document structure</li>
            <li>Your stack is Google or Microsoft, not Atlassian</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (10 users) · Standard $5.16/u/mo · Premium $9.73/u/mo ·
            Enterprise custom · Data Center (self-host) custom
          </p>
        </section>

        {/* 6. Roam Research */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-3">
            6. Roam Research — best alternative for networked thought and bi-directional linking
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it stands apart:</strong> Roam originated the bi-directional linking
            knowledge graph model that Obsidian and Logseq later popularized. Everything
            is a block; every block can be referenced anywhere; every reference creates a
            back-link that surfaces the full context of where the block was used. For
            researchers, writers, and academics building a personal knowledge graph over
            years, Roam&rsquo;s block-level network model is more powerful than
            Notion&rsquo;s page-based hierarchy. Daily Notes make it an ideal journal and
            capture tool.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Roam over Notion:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re building a long-term knowledge graph with dense bi-directional links</li>
            <li>Your workflow centers on block references, not pages</li>
            <li>Academic research, zettelkasten, or complex writing projects are your main use case</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Notion:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need team collaboration and shared workspaces</li>
            <li>You want databases for project tracking alongside notes</li>
            <li>Roam&rsquo;s steep learning curve is impractical for your time</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> $15/mo · Believer Plan $500 (5 years) · Academic $7.50/mo
          </p>
        </section>

        {/* 7. Logseq */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-3">
            7. Logseq — best open-source alternative for privacy-first PKM
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it stands apart:</strong> Logseq is open-source, stores your notes
            as local Markdown or Org-mode files, and combines Roam-style bi-directional
            linking with an outliner-based editor. It&rsquo;s completely free to self-host
            (or use the desktop app), with an optional Logseq Sync add-on at $8/mo for
            cross-device sync. For privacy-first users who want a Roam-like experience
            without the $15/month price tag, Logseq is the strongest open-source
            alternative.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Logseq over Notion:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want open-source PKM with bi-directional links and local file storage</li>
            <li>Privacy and data sovereignty are non-negotiable</li>
            <li>You want Roam&rsquo;s features at $0 (or $8/mo for sync)</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Notion:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need team collaboration features and shared workspaces</li>
            <li>You want a polished, consumer-friendly UX without configuration</li>
            <li>Databases for project tracking matter more than outliners</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (open-source, self-hosted) · Logseq Sync $8/mo ·
            Team features in development
          </p>
        </section>

        {/* 8. Bear */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text mb-3">
            8. Bear — best alternative for simple, beautiful note-taking on Apple
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it stands apart:</strong> Bear is a Markdown note-taking app for
            macOS and iOS with a clean, focused editor that gets out of your way. At
            $2.99/mo, it&rsquo;s the most affordable premium option on this list. Bear
            excels at fast capture, hashtag-based organization, and beautiful export to
            PDF, HTML, and Markdown. It doesn&rsquo;t try to replace Notion&rsquo;s
            databases — it&rsquo;s the right tool for quick notes, research snippets, and
            writing drafts on Apple devices.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Bear over Notion:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want a fast, minimal Apple note-taking app with Markdown support</li>
            <li>You don&rsquo;t need databases or project management features</li>
            <li>Price matters and $2.99/mo fits better than $16+/mo for Notion Plus</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Notion:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need team collaboration or shared workspaces</li>
            <li>You need databases, kanban boards, or project tracking</li>
            <li>You&rsquo;re on Windows or Android (Bear is Apple-only)</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (no sync) · Pro $2.99/mo or $29.99/yr
          </p>
        </section>

        {/* How to choose */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text">How to choose the right Notion alternative</h2>
          </div>
          <p className="text-text font-semibold mb-2">By use case:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>
              Relational databases + automation<span aria-hidden="true"> →</span> <strong>Coda</strong>
            </li>
            <li>
              Personal PKM, offline-first, local files<span aria-hidden="true"> →</span> <strong>Obsidian</strong>
            </li>
            <li>
              Best writing UX on Apple<span aria-hidden="true"> →</span> <strong>Craft</strong>
            </li>
            <li>
              Docs + project management in one<span aria-hidden="true"> →</span> <strong>ClickUp</strong>
            </li>
            <li>
              Enterprise wiki + Jira integration<span aria-hidden="true"> →</span> <strong>Confluence</strong>
            </li>
            <li>
              Networked thought, bi-directional links<span aria-hidden="true"> →</span> <strong>Roam Research</strong>
            </li>
            <li>
              Open-source PKM with privacy focus<span aria-hidden="true"> →</span> <strong>Logseq</strong>
            </li>
            <li>
              Simple, affordable notes on Apple<span aria-hidden="true"> →</span> <strong>Bear</strong>
            </li>
          </ul>
          <p className="text-text font-semibold mb-2">By budget:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1">
            <li>
              $0 forever<span aria-hidden="true"> →</span> <strong>Obsidian</strong> (local), <strong>Logseq</strong>{" "}
              (open-source), <strong>ClickUp</strong> (free tier), <strong>Confluence</strong>{" "}
              (free up to 10 users)
            </li>
            <li>
              Under $5/mo<span aria-hidden="true"> →</span> <strong>Bear</strong> ($2.99), <strong>Craft</strong> ($5)
            </li>
            <li>
              Enterprise / team budget<span aria-hidden="true"> →</span> <strong>Coda</strong> Team ($30), <strong>Confluence</strong>{" "}
              Standard ($5.16)
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text">Frequently asked questions</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-text mb-2">
                What is the best free Notion alternative?
              </h3>
              <p className="text-text leading-relaxed">
                Obsidian and Logseq are both free with no seat caps. Obsidian stores your
                notes locally as plain Markdown files — zero vendor lock-in. Logseq is
                open-source and uses the same local-file approach with bi-directional
                linking. ClickUp&rsquo;s free tier is generous for teams who need project
                management alongside docs.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">Is Obsidian better than Notion?</h3>
              <p className="text-text leading-relaxed">
                For personal knowledge management and offline-first use, yes. Obsidian stores
                files locally as plain Markdown, works offline by default, and has a powerful
                plugin ecosystem. Notion is stronger for team collaboration, databases, and
                shared workspace features. If your use case is personal PKM rather than team
                wiki, Obsidian wins clearly.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Is there a Notion alternative with better databases?
              </h3>
              <p className="text-text leading-relaxed">
                Coda is the strongest alternative for relational-database-style docs — it
                supports cross-table lookups, formulas, and automation natively in a doc.
                ClickUp handles databases alongside full project management. Notion&rsquo;s
                databases are good but lack true cross-database joins that Coda supports out
                of the box.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Which Notion alternative is best for teams and wikis?
              </h3>
              <p className="text-text leading-relaxed">
                Confluence is the most enterprise-proven team wiki at scale — 70,000+
                companies use it for internal documentation. It integrates tightly with Jira,
                Trello, and the Atlassian ecosystem. Coda is the better pick if you want
                docs + databases + automation in one product. ClickUp covers docs + project
                management if you&rsquo;re consolidating tools.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Does Notion have an offline mode?
              </h3>
              <p className="text-text leading-relaxed">
                Notion&rsquo;s offline mode is limited — you can view recently opened pages
                but cannot create or edit without an internet connection. If offline-first is
                a requirement, Obsidian (local files) or Logseq (local files) are the correct
                alternatives. Craft also offers strong offline editing on Apple platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Related comparisons */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text">Related comparisons</h2>
          </div>
          <ul className="space-y-2 text-text">
            <li>
              <Link
                href="/compare/notion-vs-obsidian"
                className="text-primary-600 font-semibold hover:underline"
              >
                Notion vs Obsidian
              </Link>{" "}
              — the most-searched 2-way
            </li>
            <li>
              <Link
                href="/compare/notion-vs-coda"
                className="text-primary-600 font-semibold hover:underline"
              >
                Notion vs Coda
              </Link>{" "}
              — databases + automation head-to-head
            </li>
            <li>
              <Link
                href="/compare/notion-vs-confluence"
                className="text-primary-600 font-semibold hover:underline"
              >
                Notion vs Confluence
              </Link>{" "}
              — startup vs enterprise wiki
            </li>
            <li>
              <Link
                href="/compare/notion-vs-clickup"
                className="text-primary-600 font-semibold hover:underline"
              >
                Notion vs ClickUp
              </Link>{" "}
              — docs-only vs all-in-one
            </li>
            <li>
              <Link
                href="/compare/obsidian-vs-logseq"
                className="text-primary-600 font-semibold hover:underline"
              >
                Obsidian vs Logseq
              </Link>{" "}
              — local PKM apps compared
            </li>
          </ul>
        </section>

        <div className="mt-12">
          <NewsletterSignup source="alternatives" referrerSlug="notion" />
        </div>
      </div>
    </>
  );
}
