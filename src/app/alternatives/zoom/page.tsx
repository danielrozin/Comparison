import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const PAGE_URL = `${SITE_URL}/alternatives/zoom`;
const PAGE_TITLE = "Best Zoom Alternatives in 2026: 8 Video Conferencing Apps Compared";
const PAGE_DESCRIPTION =
  "Google Meet, Microsoft Teams, Webex, GoTo Meeting, Discord, Around, Jitsi, and Whereby compared. Find the best Zoom alternative for free calls, Microsoft 365, Google Workspace, or open-source needs in 2026.";
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Best Zoom Alternatives in 2026",
)}&a=${encodeURIComponent("Zoom")}&b=${encodeURIComponent("Alternatives")}&type=comparison`;

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
        alt: "Best Zoom Alternatives in 2026",
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
  name: "Best Zoom Alternatives in 2026",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: 8,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "Google Meet",
        applicationCategory: "Video Conferencing",
        operatingSystem: "Web, iOS, Android",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://meet.google.com",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "Microsoft Teams",
        applicationCategory: "Video Conferencing / Team Chat",
        operatingSystem: "Web, Windows, macOS, iOS, Android, Linux",
        offers: { "@type": "Offer", price: "6", priceCurrency: "USD" },
        url: "https://www.microsoft.com/microsoft-teams",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "SoftwareApplication",
        name: "Webex",
        applicationCategory: "Video Conferencing / Enterprise",
        operatingSystem: "Web, Windows, macOS, iOS, Android, Linux",
        offers: { "@type": "Offer", price: "14.50", priceCurrency: "USD" },
        url: "https://www.webex.com",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "SoftwareApplication",
        name: "GoTo Meeting",
        applicationCategory: "Video Conferencing",
        operatingSystem: "Web, Windows, macOS, iOS, Android",
        offers: { "@type": "Offer", price: "12", priceCurrency: "USD" },
        url: "https://www.goto.com/meeting",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "SoftwareApplication",
        name: "Discord",
        applicationCategory: "Video / Voice Chat",
        operatingSystem: "Web, Windows, macOS, iOS, Android, Linux",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://discord.com",
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "SoftwareApplication",
        name: "Around",
        applicationCategory: "Video Conferencing / Async-first",
        operatingSystem: "Web, Windows, macOS",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://www.around.co",
      },
    },
    {
      "@type": "ListItem",
      position: 7,
      item: {
        "@type": "SoftwareApplication",
        name: "Jitsi Meet",
        applicationCategory: "Video Conferencing / Open-source",
        operatingSystem: "Web, iOS, Android, Self-hosted",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://meet.jit.si",
      },
    },
    {
      "@type": "ListItem",
      position: 8,
      item: {
        "@type": "SoftwareApplication",
        name: "Whereby",
        applicationCategory: "Video Conferencing / Browser-based",
        operatingSystem: "Web (no install required)",
        offers: { "@type": "Offer", price: "6.99", priceCurrency: "USD" },
        url: "https://whereby.com",
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
      name: "What is the best free Zoom alternative?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google Meet is the strongest free Zoom alternative — no download required, works in any browser, and supports up to 100 participants with no time limit on calls. Jitsi Meet is the best option if you need completely free, open-source, self-hostable video conferencing. Discord video calls are also free and unlimited for casual or community use.",
      },
    },
    {
      "@type": "Question",
      name: "Is Google Meet better than Zoom?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For Google Workspace users, yes. Meet is bundled at no extra cost, requires no download, integrates natively with Google Calendar and Gmail, and includes live captions by default. For large enterprise deployments, webinar hosting, or advanced recording/transcription features, Zoom still leads. At the free tier, both are competitive — Meet has no time limits while Zoom free caps group calls at 40 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Is Microsoft Teams a good replacement for Zoom?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For Microsoft 365 organizations, yes — Teams video is bundled in M365 Business Basic ($6/u/mo) and above, so you're not paying twice. Teams integrates calendar, chat, file sharing, and video into one client where Zoom requires bolting on a separate chat app. The main trade-off: Teams' meeting UX is heavier and slower to load than Zoom. For meeting-room hardware compatibility, Zoom still has wider device support.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a Zoom alternative with no time limit on free calls?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google Meet, Jitsi Meet, and Discord all have no time limits on free calls. Zoom's free tier caps group calls at 40 minutes per session (unlimited one-on-one calls). Whereby's free tier allows 45-minute group calls. For unlimited free group video, Google Meet or Jitsi are the strongest choices.",
      },
    },
    {
      "@type": "Question",
      name: "What is the most secure Zoom alternative?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jitsi Meet (self-hosted) gives you the most control — you own the server, the data, and the encryption keys. Webex (Cisco) is the enterprise-grade choice with FIPS 140-2 compliance, FedRAMP authorization, and end-to-end encryption. For government or defense use cases requiring classified meetings, Cisco Webex and Zoom for Government (FedRAMP) are the two credible options.",
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
      name: "Zoom Alternatives",
      item: { "@type": "WebPage", "@id": PAGE_URL, name: "Zoom Alternatives", url: PAGE_URL },
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
  image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Best Zoom Alternatives in 2026 — A Versus B" },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Technology professionals comparing video conferencing apps", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
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
    name: "Google Meet",
    bestFor: "Google Workspace orgs, no-download calls",
    freeTier: "Yes (100 participants, no time limit)",
    paidEntry: "Bundled in Workspace Starter $7/u/mo",
    advantage: "No time limit; no download; native Calendar/Gmail integration",
  },
  {
    rank: 2,
    name: "Microsoft Teams",
    bestFor: "Microsoft 365 orgs",
    freeTier: "Yes (free with personal M365)",
    paidEntry: "Bundled in M365 Business Basic $6/u/mo",
    advantage: "Bundled video + chat + files in one client; no separate Zoom bill",
  },
  {
    rank: 3,
    name: "Webex (Cisco)",
    bestFor: "Enterprise, government, regulated industries",
    freeTier: "Yes (40-min, 100 participants)",
    paidEntry: "Meet $14.50/u/mo",
    advantage: "FedRAMP authorized; FIPS 140-2; widest hardware (room systems) compatibility",
  },
  {
    rank: 4,
    name: "GoTo Meeting",
    bestFor: "SMB video conferencing, long meetings",
    freeTier: "No (14-day trial)",
    paidEntry: "Professional $12/u/mo",
    advantage: "Unlimited meeting duration; smart meeting insights; no participant caps on paid",
  },
  {
    rank: 5,
    name: "Discord",
    bestFor: "Communities, casual teams, gaming",
    freeTier: "Yes (unlimited)",
    paidEntry: "Nitro $9.99/mo (cosmetic)",
    advantage: "Free; always-on voice channels; screen share; no per-seat cost",
  },
  {
    rank: 6,
    name: "Around",
    bestFor: "Remote-first teams, low-distraction video",
    freeTier: "Yes",
    paidEntry: "Pro $10/u/mo",
    advantage: "Floating bubble UI; background blur by default; less fatigue than full-screen video",
  },
  {
    rank: 7,
    name: "Jitsi Meet",
    bestFor: "Privacy-first, open-source, self-hosted",
    freeTier: "Yes (fully free, open-source)",
    paidEntry: "8×8 hosted plan $0–custom",
    advantage: "Open-source; self-host with zero vendor lock-in; no account required",
  },
  {
    rank: 8,
    name: "Whereby",
    bestFor: "No-install browser calls, small teams",
    freeTier: "Yes (1 room, 45-min group)",
    paidEntry: "Pro $6.99/u/mo",
    advantage: "Permanent room links; no download ever; the simplest host-to-guest experience",
  },
];

export default function ZoomAlternativesPage() {
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
              <Link href="/alternatives/zoom" className="hover:text-primary-600 transition-colors">
                Alternatives
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-text font-medium" aria-current="page">Zoom Alternatives</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text leading-tight">
            Best Zoom Alternatives in 2026: 8 Video Conferencing Apps That Are Actually Good
          </h1>
          <p className="mt-3 text-sm text-text-secondary italic">
            Updated June 2026 · Pricing verified against provider pages.
          </p>
        </header>

        <section aria-labelledby="zoom-why-look-for-a" className="prose-section">
          <h2 id="zoom-why-look-for-a" className="text-2xl font-bold text-text mt-10 mb-4">
            Why look for a Zoom alternative?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Zoom is still the world&rsquo;s most recognized video conferencing app — over
            300 million daily meeting participants as of 2025. But &ldquo;most
            recognized&rdquo; doesn&rsquo;t mean &ldquo;best for your situation.&rdquo; Zoom
            Pro costs $13.32/user/month; if your org already pays for Microsoft 365 or
            Google Workspace, you&rsquo;re paying twice. Zoom&rsquo;s free tier caps group
            calls at 40 minutes — a friction point for small teams with longer meetings. And
            several alternatives have caught up on call quality, AI transcription, and
            hardware compatibility.
          </p>
          <p className="text-text leading-relaxed mb-4">
            The right Zoom alternative depends entirely on your existing stack. Microsoft
            365 orgs are better served by Teams. Google Workspace orgs have Meet bundled
            at no extra cost. Startups and communities often find Discord or Around more
            appropriate for their culture. And privacy-conscious teams can self-host Jitsi
            for free. This page breaks down each option by use case so you can skip to
            the one that fits your situation.
          </p>
        </section>

        {/* The comparison table */}
        <section aria-labelledby="zoom-the-8-best-zoom" className="mt-10">
          <h2 id="zoom-the-8-best-zoom" className="text-2xl font-bold text-text mb-4">
            The 8 best Zoom alternatives at a glance
          </h2>

          {/* Desktop / tablet: real table inside an overflow wrapper */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border bg-white" tabIndex={0} role="region" aria-label="Scrollable table">
            <table aria-label="Best Zoom alternatives at a glance" className="min-w-full text-sm">
              <thead className="bg-surface-alt text-text-secondary">
                <tr>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">#</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Alternative</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Best for</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Free tier</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Paid (entry)</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">
                    Key advantage over Zoom
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
                      Key advantage over Zoom
                    </dt>
                    <dd className="text-text">{row.advantage}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* 1. Google Meet */}
        <section aria-labelledby="zoom-1-google-meet-best" className="mt-12">
          <h2 id="zoom-1-google-meet-best" className="text-2xl font-bold text-text mb-3">
            1. Google Meet — best alternative for Google Workspace orgs
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Zoom:</strong> If your org pays for Google Workspace,
            Meet is included at zero incremental cost. Unlike Zoom&rsquo;s 40-minute free
            cap, Meet imposes no time limit on calls. It requires no download — works in
            any browser and is linked natively to Google Calendar (every meeting event
            auto-generates a Meet link). Live captions, noise cancellation, and meeting
            recordings (on Workspace Business and above) are built in. For organizations
            already on Gmail, Meet is effectively free video conferencing you&rsquo;re
            already paying for.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Google Meet over Zoom:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your org is on Google Workspace (Gmail, Calendar, Drive, Docs)</li>
            <li>You want calls with no time limits on the free tier</li>
            <li>You need no-download joins for guests and clients</li>
            <li>You want to consolidate Zoom + Workspace bills into one</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Zoom:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need Zoom Rooms hardware for conference rooms</li>
            <li>Webinar hosting (Zoom Webinar supports 500–50,000 attendees)</li>
            <li>Breakout rooms with more control than Meet offers</li>
            <li>You&rsquo;re on Microsoft 365 or are ecosystem-agnostic</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Free (100 participants, no time limit) · Bundled in
            Workspace Starter $7/u/mo · Standard $14/u/mo · Business Plus $22/u/mo
          </p>
          <p className="text-text">
            Compare:{" "}
            <Link
              href="/compare/zoom-vs-google-meet"
              className="text-primary-600 font-semibold hover:underline"
            >
              Zoom vs Google Meet
            </Link>{" "}
            ·{" "}
            <Link
              href="/compare/zoom-vs-google-meet-vs-teams"
              className="text-primary-600 font-semibold hover:underline"
            >
              Zoom vs Google Meet vs Teams
            </Link>
          </p>
        </section>

        {/* 2. Microsoft Teams */}
        <section aria-labelledby="zoom-2-microsoft-teams-best" className="mt-12">
          <h2 id="zoom-2-microsoft-teams-best" className="text-2xl font-bold text-text mb-3">
            2. Microsoft Teams — best alternative for Microsoft 365 orgs
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Zoom:</strong> Teams is bundled in Microsoft 365 Business
            Basic ($6/u/mo) — if you&rsquo;re already on M365, you&rsquo;re already paying
            for video conferencing. Teams meetings support up to 1,000 participants, include
            meeting recordings, AI-generated transcriptions (Microsoft 365 Copilot), and
            integrate with your Outlook calendar and SharePoint files. The Microsoft Teams
            Room hardware ecosystem (MTR) is the largest certified room-system lineup in the
            category.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Teams over Zoom:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your org is on Microsoft 365 (Outlook, Word, Excel, SharePoint)</li>
            <li>You want video + chat + files in one client without bolting on Zoom</li>
            <li>You use Teams Rooms hardware for conference rooms</li>
            <li>You need Copilot-powered meeting summaries in your Microsoft environment</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Zoom:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your team is on Google Workspace or mixed ecosystems</li>
            <li>You host large webinars (Zoom Webinar &gt; Teams Live Events in flexibility)</li>
            <li>You want a lighter, faster-loading meeting client (Zoom vs Teams load time)</li>
          </ul>
          <p className="text-text leading-relaxed mb-3">
            <strong>Pricing:</strong> Free (basic) · Teams Essentials $4/u/mo · Bundled in
            M365 Business Basic $6/u/mo · M365 Business Standard $12.50/u/mo
          </p>
          <p className="text-text">
            Compare:{" "}
            <Link
              href="/compare/zoom-vs-microsoft-teams"
              className="text-primary-600 font-semibold hover:underline"
            >
              Zoom vs Microsoft Teams
            </Link>{" "}
            ·{" "}
            <Link
              href="/compare/zoom-vs-google-meet-vs-teams"
              className="text-primary-600 font-semibold hover:underline"
            >
              Zoom vs Google Meet vs Teams
            </Link>
          </p>
        </section>

        {/* 3. Webex */}
        <section aria-labelledby="zoom-3-webex-best-alternative" className="mt-12">
          <h2 id="zoom-3-webex-best-alternative" className="text-2xl font-bold text-text mb-3">
            3. Webex — best alternative for enterprise and government use
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Zoom:</strong> Cisco Webex is the enterprise-grade choice
            when compliance and security are non-negotiable. Webex holds FedRAMP
            authorization (Zoom for Government also offers this, but Webex has longer
            tenure), FIPS 140-2 encryption, and Cisco&rsquo;s hardware ecosystem for
            conference rooms is the most mature in the category. Webex also supports the
            widest range of room systems — including legacy Cisco TelePresence endpoints
            — which matters for organizations with existing hardware investments.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Webex over Zoom:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re in a government or defense environment requiring FedRAMP</li>
            <li>You have existing Cisco room hardware you need to integrate</li>
            <li>You need FIPS 140-2 encrypted video conferencing</li>
            <li>Your procurement process favors Cisco / enterprise-grade vendor relationships</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Zoom:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Price sensitivity matters — Zoom Pro is $13.32 vs Webex Meet $14.50+ at comparable tiers</li>
            <li>Your team needs a simpler, faster client with less enterprise overhead</li>
            <li>You rely on third-party app integrations (Zoom Marketplace is broader)</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (40-min, 100 participants) · Meet $14.50/u/mo ·
            Suite $25/u/mo · Enterprise custom
          </p>
        </section>

        {/* 4. GoTo Meeting */}
        <section aria-labelledby="zoom-4-goto-meeting-best" className="mt-12">
          <h2 id="zoom-4-goto-meeting-best" className="text-2xl font-bold text-text mb-3">
            4. GoTo Meeting — best alternative for unlimited meeting duration
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Zoom:</strong> GoTo Meeting&rsquo;s Professional plan
            ($12/u/mo) includes unlimited meeting duration, no participant caps on group
            calls, and Smart Meeting Notes powered by AI. For organizations that run
            long training sessions, client workshops, or extended team calls that routinely
            hit Zoom&rsquo;s free 40-minute cap, GoTo Meeting is an affordable alternative.
            Call quality and reliability have been GoTo&rsquo;s core value proposition since
            the early WebEx era.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose GoTo Meeting over Zoom:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You regularly run meetings that exceed 60–90 minutes</li>
            <li>You want reliable call quality without ecosystem lock-in</li>
            <li>Training, workshops, or customer demos are your primary meeting type</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Zoom:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need a free tier (GoTo Meeting has no free plan)</li>
            <li>You want webinar hosting for large audiences (&gt;250 participants)</li>
            <li>You need the largest third-party integration marketplace</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> No free tier · Professional $12/u/mo · Business
            $16/u/mo · Enterprise custom
          </p>
        </section>

        {/* 5. Discord */}
        <section aria-labelledby="zoom-5-discord-best-free" className="mt-12">
          <h2 id="zoom-5-discord-best-free" className="text-2xl font-bold text-text mb-3">
            5. Discord — best free alternative for communities and informal teams
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Zoom:</strong> Discord&rsquo;s video + voice channels are
            always-on and free — no meeting links, no time limits, no per-seat cost.
            Screen sharing and Go Live (up to 50 viewers) are included on the free tier.
            For gaming teams, open-source communities, creator audiences, and casual
            startups that don&rsquo;t need business-grade compliance, Discord removes the
            overhead of scheduled meetings entirely. Just join a voice channel and start
            talking.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Discord over Zoom:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want always-on voice channels, not scheduled meetings</li>
            <li>You run a community, open-source project, or gaming team</li>
            <li>Budget is zero and you don&rsquo;t need enterprise compliance</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Zoom:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need enterprise SSO, audit logs, or HIPAA compliance</li>
            <li>Your client-facing meetings require a professional appearance</li>
            <li>You host webinars or large online events regularly</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (unlimited voice + video) · Nitro $9.99/mo
            (cosmetic) · Server Boosts optional
          </p>
        </section>

        {/* 6. Around */}
        <section aria-labelledby="zoom-6-around-best-alternative" className="mt-12">
          <h2 id="zoom-6-around-best-alternative" className="text-2xl font-bold text-text mb-3">
            6. Around — best alternative for remote-first teams fighting Zoom fatigue
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Zoom:</strong> Around uses a floating bubble UI — small
            circular video windows that overlay your desktop without taking over your
            screen. Background blur is on by default, you can use your own apps while
            in a call without switching windows, and the design is intentionally
            low-distraction. Studies on remote work find that full-screen video calls
            increase fatigue; Around&rsquo;s ambient call style addresses this directly.
            For async-first or maker-schedule teams who want lighter presence calls,
            it&rsquo;s a meaningful UX upgrade over Zoom.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Around over Zoom:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your team is remote-first and wants less screen-takeover during calls</li>
            <li>Zoom fatigue is a documented problem for your team</li>
            <li>You want ambient, presence-style calls that let you keep working</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Zoom:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need structured meeting formats (webinars, all-hands, training)</li>
            <li>You require large participant counts (&gt;25)</li>
            <li>Enterprise compliance features are required</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (unlimited, up to 25 participants) · Pro $10/u/mo
          </p>
        </section>

        {/* 7. Jitsi Meet */}
        <section aria-labelledby="zoom-7-jitsi-meet-best" className="mt-12">
          <h2 id="zoom-7-jitsi-meet-best" className="text-2xl font-bold text-text mb-3">
            7. Jitsi Meet — best open-source and self-hosted alternative
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Zoom:</strong> Jitsi Meet is fully open-source, requires no
            account, and can be used for free at meet.jit.si with no time limits. The same
            software can be self-hosted on your own server for complete privacy and data
            sovereignty. For organizations where cloud vendor access to meeting data is
            unacceptable — public sector, healthcare, legal — a self-hosted Jitsi instance
            is one of the cleanest solutions: full encryption, zero third-party dependency,
            and no per-seat licensing cost.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Jitsi over Zoom:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need self-hosted, open-source video conferencing</li>
            <li>Privacy and data sovereignty are hard requirements</li>
            <li>You want completely free video calls with no account required</li>
            <li>Your tech team can manage server infrastructure</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Zoom:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need polished enterprise features (SSO, admin console, analytics)</li>
            <li>You don&rsquo;t have capacity to manage a self-hosted server</li>
            <li>You need webinar or large event hosting</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (open-source, self-host) · 8×8 Video Meetings
            hosted from $0 to custom
          </p>
        </section>

        {/* 8. Whereby */}
        <section aria-labelledby="zoom-8-whereby-best-alternative" className="mt-12">
          <h2 id="zoom-8-whereby-best-alternative" className="text-2xl font-bold text-text mb-3">
            8. Whereby — best alternative for no-install browser calls
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Zoom:</strong> Whereby&rsquo;s core differentiator is the
            permanent room link — you create a room once (e.g. whereby.com/yourteam) and
            it&rsquo;s always there. No meeting link generation, no login for guests, no
            download ever required. For external consultants, client calls, or patient
            consultations where the other party won&rsquo;t install software, Whereby
            removes all friction. It embeds natively into websites (healthcare portals,
            education platforms, SaaS tools) via its API.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Whereby over Zoom:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your guests or clients refuse to download apps</li>
            <li>You want a permanent room URL that&rsquo;s always accessible</li>
            <li>You&rsquo;re embedding video calls in a product or website via API</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Zoom:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need large participant counts (&gt;200)</li>
            <li>Enterprise compliance features are required (HIPAA, SOC 2 at scale)</li>
            <li>Webinar or live event hosting is a primary use case</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (1 permanent room, 45-min group) · Pro $6.99/u/mo ·
            Business $9.99/u/mo · Enterprise custom
          </p>
        </section>

        {/* How to choose */}
        <section aria-labelledby="zoom-how-to-choose-the" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="zoom-how-to-choose-the" className="text-2xl font-bold text-text">How to choose the right Zoom alternative</h2>
          </div>
          <p className="text-text font-semibold mb-2">By ecosystem fit:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>
              Google Workspace org<span aria-hidden="true"> →</span> <strong>Google Meet</strong> (already bundled)
            </li>
            <li>
              Microsoft 365 org<span aria-hidden="true"> →</span> <strong>Microsoft Teams</strong> (already bundled)
            </li>
          </ul>
          <p className="text-text font-semibold mb-2">By use case:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>
              Free calls, no time limit<span aria-hidden="true"> →</span> <strong>Google Meet</strong> or <strong>Jitsi</strong>
            </li>
            <li>
              Government / FedRAMP / FIPS<span aria-hidden="true"> →</span> <strong>Webex</strong>
            </li>
            <li>
              Self-hosted / open-source<span aria-hidden="true"> →</span> <strong>Jitsi Meet</strong>
            </li>
            <li>
              Community / casual teams<span aria-hidden="true"> →</span> <strong>Discord</strong>
            </li>
            <li>
              Zoom fatigue / ambient calls<span aria-hidden="true"> →</span> <strong>Around</strong>
            </li>
            <li>
              No-download guest calls<span aria-hidden="true"> →</span> <strong>Whereby</strong>
            </li>
            <li>
              Long meetings, no time caps<span aria-hidden="true"> →</span> <strong>GoTo Meeting</strong>
            </li>
          </ul>
          <p className="text-text font-semibold mb-2">By price:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1">
            <li>
              $0<span aria-hidden="true"> →</span> <strong>Google Meet</strong>, <strong>Jitsi</strong>,{" "}
              <strong>Discord</strong>, <strong>Around</strong> (free tier)
            </li>
            <li>
              Under $10/u/mo<span aria-hidden="true"> →</span> <strong>Whereby Pro</strong> ($6.99),{" "}
              <strong>Google Meet</strong> (bundled with Workspace)
            </li>
            <li>
              Bundled with existing SaaS<span aria-hidden="true"> →</span> <strong>Google Meet</strong> (Workspace),{" "}
              <strong>Teams</strong> (M365)
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section aria-labelledby="zoom-frequently-asked-questions" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="zoom-frequently-asked-questions" className="text-2xl font-bold text-text">Frequently asked questions</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-text mb-2">
                What is the best free Zoom alternative?
              </h3>
              <p className="text-text leading-relaxed">
                Google Meet is the strongest free Zoom alternative — no download required,
                works in any browser, and supports up to 100 participants with no time limit
                on calls. Jitsi Meet is the best option if you need completely free,
                open-source, self-hostable video conferencing. Discord video calls are also
                free and unlimited for casual or community use.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">Is Google Meet better than Zoom?</h3>
              <p className="text-text leading-relaxed">
                For Google Workspace users, yes. Meet is bundled at no extra cost, requires
                no download, integrates natively with Google Calendar and Gmail, and includes
                live captions by default. For large enterprise deployments, webinar hosting,
                or advanced recording features, Zoom still leads. See{" "}
                <Link
                  href="/compare/zoom-vs-google-meet"
                  className="text-primary-600 font-semibold hover:underline"
                >
                  Zoom vs Google Meet
                </Link>{" "}
                for the full comparison.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Is Microsoft Teams a good replacement for Zoom?
              </h3>
              <p className="text-text leading-relaxed">
                For Microsoft 365 organizations, yes — Teams video is bundled in M365
                Business Basic ($6/u/mo) and above, so you&rsquo;re not paying twice. Teams
                integrates calendar, chat, file sharing, and video into one client where
                Zoom requires bolting on a separate chat app. See{" "}
                <Link
                  href="/compare/zoom-vs-google-meet-vs-teams"
                  className="text-primary-600 font-semibold hover:underline"
                >
                  Zoom vs Google Meet vs Teams
                </Link>{" "}
                for the full 3-way.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Is there a Zoom alternative with no time limit on free calls?
              </h3>
              <p className="text-text leading-relaxed">
                Google Meet, Jitsi Meet, and Discord all have no time limits on free calls.
                Zoom&rsquo;s free tier caps group calls at 40 minutes per session. Whereby&rsquo;s
                free tier allows 45-minute group calls. For unlimited free group video,
                Google Meet or Jitsi are the strongest choices.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                What is the most secure Zoom alternative?
              </h3>
              <p className="text-text leading-relaxed">
                Jitsi Meet (self-hosted) gives you the most control — you own the server, the
                data, and the encryption keys. Webex (Cisco) is the enterprise-grade choice
                with FIPS 140-2 compliance, FedRAMP authorization, and end-to-end encryption.
                For government or defense use cases, Cisco Webex and Zoom for Government are
                the two credible options.
              </p>
            </div>
          </div>
        </section>

        {/* Related comparisons */}
        <section aria-labelledby="zoom-related-comparisons" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 id="zoom-related-comparisons" className="text-2xl font-bold text-text">Related comparisons</h2>
          </div>
          <ul className="space-y-2 text-text">
            <li>
              <Link
                href="/compare/zoom-vs-google-meet"
                className="text-primary-600 font-semibold hover:underline"
              >
                Zoom vs Google Meet
              </Link>{" "}
              — the most-searched 2-way
            </li>
            <li>
              <Link
                href="/compare/zoom-vs-microsoft-teams"
                className="text-primary-600 font-semibold hover:underline"
              >
                Zoom vs Microsoft Teams
              </Link>{" "}
              — video-first vs collaboration suite
            </li>
            <li>
              <Link
                href="/compare/zoom-vs-google-meet-vs-teams"
                className="text-primary-600 font-semibold hover:underline"
              >
                Zoom vs Google Meet vs Teams
              </Link>{" "}
              — 3-way video conferencing shootout
            </li>
            <li>
              <Link
                href="/compare/zoom-vs-webex"
                className="text-primary-600 font-semibold hover:underline"
              >
                Zoom vs Webex
              </Link>{" "}
              — SMB vs enterprise compliance
            </li>
            <li>
              <Link
                href="/alternatives/slack"
                className="text-primary-600 font-semibold hover:underline"
              >
                Best Slack Alternatives
              </Link>{" "}
              — team chat to pair with your video tool
            </li>
          </ul>
        </section>

        <div className="mt-12">
          <NewsletterSignup source="alternatives" referrerSlug="zoom" />
        </div>
      </div>
    </>
  );
}
