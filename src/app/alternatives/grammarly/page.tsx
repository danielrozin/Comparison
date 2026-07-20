import type { Metadata } from "next";
import Link from "next/link";
import { CompareLink } from "@/components/comparison/CompareLink";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const PAGE_URL = `${SITE_URL}/alternatives/grammarly`;
const PAGE_TITLE = "8 Best Grammarly Alternatives (Free and Paid) | 2026";
const PAGE_DESCRIPTION =
  "ProWritingAid, LanguageTool, Hemingway, QuillBot, Wordtune, Microsoft Editor, Writer, and Ginger compared. Find the best Grammarly alternative for grammar checking, style editing, or AI rewriting in 2026.";
const OG_IMAGE = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Best Grammarly Alternatives in 2026",
)}&a=${encodeURIComponent("Grammarly")}&b=${encodeURIComponent("Alternatives")}&type=comparison`;

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
        alt: "Best Grammarly Alternatives in 2026",
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
    "citation_publication_date": "2026-07-01",
    "citation_online_date": "2026-07-10",
    "DC.title": PAGE_TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.date": "2026-07-10",
    "DC.identifier": PAGE_URL,
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Grammarly Alternatives in 2026",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: 8,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "SoftwareApplication",
        name: "ProWritingAid",
        applicationCategory: "Writing / Grammar",
        operatingSystem: "Web, Windows, macOS, Chrome, Word, Google Docs",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://prowritingaid.com",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "SoftwareApplication",
        name: "LanguageTool",
        applicationCategory: "Grammar / Language Checker",
        operatingSystem: "Web, Windows, macOS, Linux, Chrome, Firefox",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://languagetool.org",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "SoftwareApplication",
        name: "Hemingway Editor",
        applicationCategory: "Writing / Readability",
        operatingSystem: "Web, Windows, macOS",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://hemingwayapp.com",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "SoftwareApplication",
        name: "QuillBot",
        applicationCategory: "AI Writing / Paraphrasing",
        operatingSystem: "Web, Chrome, Word",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://quillbot.com",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "SoftwareApplication",
        name: "Wordtune",
        applicationCategory: "AI Writing / Rewriting",
        operatingSystem: "Web, Chrome, Word, Google Docs",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://www.wordtune.com",
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "SoftwareApplication",
        name: "Microsoft Editor",
        applicationCategory: "Grammar / Spelling",
        operatingSystem: "Web, Windows, macOS, Chrome, Edge",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://www.microsoft.com/en-us/microsoft-365/microsoft-editor",
      },
    },
    {
      "@type": "ListItem",
      position: 7,
      item: {
        "@type": "SoftwareApplication",
        name: "Writer",
        applicationCategory: "AI Writing / Enterprise",
        operatingSystem: "Web, Chrome, Word, Google Docs",
        offers: { "@type": "Offer", price: "18", priceCurrency: "USD" },
        url: "https://writer.com",
      },
    },
    {
      "@type": "ListItem",
      position: 8,
      item: {
        "@type": "SoftwareApplication",
        name: "Ginger Software",
        applicationCategory: "Grammar / Spelling",
        operatingSystem: "Web, Windows, macOS, Chrome, iOS, Android",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        url: "https://www.gingersoftware.com",
      },
    },
  ],
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the best free Grammarly alternative?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LanguageTool is the strongest free Grammarly alternative — it checks grammar in 30+ languages and has a generous free tier with no word limit for the browser extension. Microsoft Editor is also free with a Microsoft account and integrates directly into Word and Edge. For readability-focused feedback, the free Hemingway web app is unmatched.",
      },
    },
    {
      "@type": "Question",
      name: "Is ProWritingAid better than Grammarly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For long-form writers and authors, yes. ProWritingAid offers 20+ in-depth writing reports covering overused words, clichés, sentence length variation, readability, and style consistency — far more depth than Grammarly's style suggestions. Grammarly is faster and more polished for everyday business writing and short documents. ProWritingAid wins on depth; Grammarly wins on UX and speed.",
      },
    },
    {
      "@type": "Question",
      name: "Which Grammarly alternative works best in Google Docs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LanguageTool, ProWritingAid, QuillBot, and Wordtune all have Chrome extensions that work inside Google Docs. LanguageTool has the most seamless Google Docs integration with inline suggestions. ProWritingAid also offers a Google Docs add-on with a full sidebar report. Grammarly's Google Docs integration has improved but can still conflict with some Doc formatting.",
      },
    },
    {
      "@type": "Question",
      name: "Does any free tool match Grammarly Premium?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No single free tool replicates all of Grammarly Premium's features — advanced style suggestions, plagiarism detection, and tone detection require a paid tier from any provider. The closest free combination is LanguageTool (grammar + 30 languages) plus Hemingway (readability) plus the free QuillBot tier (paraphrasing). For casual use, this covers roughly 80% of Grammarly Premium's value at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best Grammarly alternative for teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Writer.com is built specifically for brand-consistent team writing — it enforces a company style guide, terminology, and tone across every document your team produces. Grammarly Business can do this too, but Writer's style-guide enforcement is more granular and its AI is trained on your brand voice. For regulated industries (legal, financial, healthcare), Writer's compliance features are stronger than Grammarly Business.",
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
      name: "Grammarly Alternatives",
      item: { "@type": "WebPage", "@id": PAGE_URL, name: "Grammarly Alternatives", url: PAGE_URL },
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
  datePublished: "2026-07-01",
  dateModified: "2026-07-10",
  contentReferenceTime: "2026-07-10",
  thumbnailUrl: OG_IMAGE,
  image: { "@type": "ImageObject", "@id": `${PAGE_URL}#primaryImage`, url: OG_IMAGE, contentUrl: OG_IMAGE, width: 1200, height: 630, caption: "Best Grammarly Alternatives in 2026 — A Versus B" },
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Writers and professionals comparing grammar tools", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
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
  wordCount: 1200,
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
    name: "ProWritingAid",
    bestFor: "Long-form writers, authors, deep style reports",
    freeTier: "Yes (500-word limit per check)",
    paidEntry: "Premium $30/yr (annual)",
    advantage: "20+ in-depth writing reports: overused words, clichés, sentence variety, readability — far deeper than Grammarly",
  },
  {
    rank: 2,
    name: "LanguageTool",
    bestFor: "Multilingual writing, privacy-first, open-source",
    freeTier: "Yes (unlimited via browser extension)",
    paidEntry: "Premium $4.92/mo (annual)",
    advantage: "30+ languages, open-source, no word limits on extension, self-hostable",
  },
  {
    rank: 3,
    name: "Hemingway Editor",
    bestFor: "Readability, concise writing, content marketers",
    freeTier: "Yes (free web app)",
    paidEntry: "Desktop app $19.99 one-time",
    advantage: "Highlights passive voice, adverbs, complex sentences — trains cleaner, bolder writing",
  },
  {
    rank: 4,
    name: "QuillBot",
    bestFor: "AI paraphrasing, summarizing, citation generation",
    freeTier: "Yes (limited paraphrasing + summarizer)",
    paidEntry: "Premium $9.95/mo or $49.95/yr",
    advantage: "Best-in-class AI paraphraser; grammar + summarizer + citation tool in one; cheaper than Grammarly",
  },
  {
    rank: 5,
    name: "Wordtune",
    bestFor: "AI-powered sentence rewriting, tone adjustment",
    freeTier: "Yes (10 rewrites/day)",
    paidEntry: "Plus $9.99/mo or $119.88/yr",
    advantage: "Rewrites whole sentences with multiple tone options; stronger AI rewriting than Grammarly's suggestions",
  },
  {
    rank: 6,
    name: "Microsoft Editor",
    bestFor: "Microsoft 365 users, Office/Word, no extra cost",
    freeTier: "Yes (free with Microsoft account)",
    paidEntry: "Included in Microsoft 365 ($6.99/mo)",
    advantage: "Free for existing Microsoft 365 subscribers; native Word integration; works in Edge browser",
  },
  {
    rank: 7,
    name: "Writer",
    bestFor: "Enterprise teams, brand voice, style guide enforcement",
    freeTier: "No (14-day trial)",
    paidEntry: "Team $18/u/mo",
    advantage: "Brand style guide + terminology enforcement across the whole team; stronger for regulated industries than Grammarly Business",
  },
  {
    rank: 8,
    name: "Ginger Software",
    bestFor: "ESL writers, mobile users, translation",
    freeTier: "Yes (limited daily checks)",
    paidEntry: "Premium $7.49/mo (annual)",
    advantage: "Context-aware grammar based on whole sentence meaning; built-in translator and text reader; strong ESL support",
  },
];

interface FeatureRow {
  feature: string;
  grammarly: string;
  proWritingAid: string;
  languageTool: string;
  quillBot: string;
  hemingway: string;
}

const FEATURE_ROWS: FeatureRow[] = [
  {
    feature: "Grammar & spelling",
    grammarly: "✅ Excellent",
    proWritingAid: "✅ Excellent",
    languageTool: "✅ Excellent",
    quillBot: "✅ Good",
    hemingway: "⚠️ Basic",
  },
  {
    feature: "Style suggestions",
    grammarly: "✅ (Premium)",
    proWritingAid: "✅ 20+ reports",
    languageTool: "✅ (Premium)",
    quillBot: "⚠️ Limited",
    hemingway: "✅ Readability focus",
  },
  {
    feature: "AI rewriting",
    grammarly: "✅ (Premium)",
    proWritingAid: "⚠️ Basic",
    languageTool: "❌ No",
    quillBot: "✅ Best-in-class",
    hemingway: "❌ No",
  },
  {
    feature: "Plagiarism check",
    grammarly: "✅ (Premium)",
    proWritingAid: "✅ (Premium)",
    languageTool: "❌ No",
    quillBot: "✅ (Premium)",
    hemingway: "❌ No",
  },
  {
    feature: "Multilingual support",
    grammarly: "⚠️ English-only",
    proWritingAid: "⚠️ English-only",
    languageTool: "✅ 30+ languages",
    quillBot: "⚠️ English best",
    hemingway: "❌ English-only",
  },
  {
    feature: "Browser extension",
    grammarly: "✅ Chrome/Firefox",
    proWritingAid: "✅ Chrome",
    languageTool: "✅ Chrome/Firefox",
    quillBot: "✅ Chrome",
    hemingway: "❌ No extension",
  },
  {
    feature: "Google Docs",
    grammarly: "✅ (improved)",
    proWritingAid: "✅ Add-on + Chrome",
    languageTool: "✅ Seamless",
    quillBot: "✅ Chrome",
    hemingway: "❌ No",
  },
  {
    feature: "Free tier usefulness",
    grammarly: "⚠️ Grammar only",
    proWritingAid: "⚠️ 500-word limit",
    languageTool: "✅ No limit (extension)",
    quillBot: "✅ Good (limited AI)",
    hemingway: "✅ Full web app",
  },
  {
    feature: "Starting price (paid)",
    grammarly: "$12/mo (annual)",
    proWritingAid: "$30/yr (~$2.50/mo)",
    languageTool: "$4.92/mo (annual)",
    quillBot: "$49.95/yr (~$4.16/mo)",
    hemingway: "$19.99 one-time",
  },
];

export default function GrammarlyAlternativesPage() {
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
              <Link href="/alternatives/grammarly" className="hover:text-primary-600 transition-colors">
                Alternatives
              </Link>
            </li>
            <li aria-hidden="true">
              <svg className="w-3 h-3 text-border flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-text font-medium" aria-current="page">Grammarly Alternatives</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-text leading-tight">
            Best Grammarly Alternatives in 2026: 8 Grammar and Writing Tools Compared
          </h1>
          <p className="mt-3 text-sm text-text-secondary italic">
            Updated July 2026 · Pricing verified against provider pages.
          </p>
        </header>

        <section aria-labelledby="grammarly-why-alt" className="alternatives-intro prose-section">
          <h2 id="grammarly-why-alt" className="text-2xl font-bold text-text mt-10 mb-4">
            Why look for a Grammarly alternative?
          </h2>
          <p className="text-text leading-relaxed mb-4">
            Grammarly is the most-installed writing assistant on the web — over 30 million
            daily active users use it to catch grammar mistakes, improve clarity, and
            adjust tone. But Grammarly Premium costs $12–$30/month depending on billing
            cycle, and its AI has become more aggressive about suggesting rewrites that can
            flatten a writer&rsquo;s voice. The free tier is now limited almost exclusively
            to basic grammar and spelling.
          </p>
          <p className="text-text leading-relaxed mb-4">
            Meanwhile, serious competition has arrived. ProWritingAid offers 20+ in-depth
            style reports for a fraction of Grammarly&rsquo;s annual cost. LanguageTool
            is open-source, supports 30+ languages, and has no word limit on its browser
            extension. QuillBot has become the go-to AI paraphraser. And for teams,
            Writer.com enforces brand voice in a way Grammarly Business never could.
            This page compares the eight best alternatives organized by use case, with
            current pricing verified in July 2026.
          </p>
        </section>

        {/* Quick comparison table */}
        <section aria-labelledby="grammarly-glance" className="mt-10">
          <h2 id="grammarly-glance" className="text-2xl font-bold text-text mb-4">
            The 8 best Grammarly alternatives at a glance
          </h2>

          {/* Desktop / tablet: real table inside an overflow wrapper */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-border bg-white" tabIndex={0} role="region" aria-label="Scrollable table">
            <table aria-label="Best Grammarly alternatives at a glance" className="min-w-full text-sm">
              <thead className="bg-surface-alt text-text-secondary">
                <tr>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">#</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Alternative</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Best for</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Free tier</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Paid (entry)</th>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">
                    Key advantage over Grammarly
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
              <div key={row.rank} className="rounded-xl border border-border bg-white p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-text-secondary">#{row.rank}</span>
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
                      Key advantage over Grammarly
                    </dt>
                    <dd className="text-text">{row.advantage}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        {/* 1. ProWritingAid */}
        <section aria-labelledby="grammarly-alt-prowritingaid" className="mt-12">
          <h2 id="grammarly-alt-prowritingaid" className="text-2xl font-bold text-text mb-3">
            1. ProWritingAid — best alternative for authors and long-form writers
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Grammarly:</strong> ProWritingAid goes far beyond
            grammar — it generates 20+ in-depth reports on your writing style, including
            overused words, sentence length variation, passive voice frequency, cliché
            density, and readability by chapter or section. If you write fiction, essays,
            or long-form non-fiction, ProWritingAid gives you the kind of structural
            feedback that Grammarly never attempts. Its annual price of $30/yr is roughly
            one-quarter of Grammarly Premium, making it the best value for serious
            writers.
          </p>
          <p className="text-text leading-relaxed mb-4">
            ProWritingAid integrates with Scrivener — the dominant tool for novel writers —
            as well as Google Docs, Microsoft Word, and Chrome. The desktop app works fully
            offline. The free tier is limited to 500-word documents per session, which is
            restrictive for testing the full feature set.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose ProWritingAid over Grammarly:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You write novels, long essays, or any document over a few thousand words</li>
            <li>You use Scrivener and need a writing tool that integrates with it</li>
            <li>You want detailed style and structure feedback beyond simple grammar fixes</li>
            <li>You want a cheaper annual price for professional-level writing assistance</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Grammarly:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need real-time suggestions across every browser and email client</li>
            <li>Your writing is primarily short-form — emails, Slack messages, social posts</li>
            <li>You want AI-generated sentence rewrites on demand</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (500 words/session) · Premium $30/yr (~$2.50/mo) ·
            Premium + Lifetime $399 one-time · Business plans available
          </p>
        </section>

        {/* 2. LanguageTool */}
        <section aria-labelledby="grammarly-alt-languagetool" className="mt-12">
          <h2 id="grammarly-alt-languagetool" className="text-2xl font-bold text-text mb-3">
            2. LanguageTool — best free alternative for multilingual writers
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Grammarly:</strong> LanguageTool is open-source and
            supports grammar checking in 30+ languages — German, Spanish, French, Dutch,
            Portuguese, and more — while Grammarly is almost entirely focused on English.
            The browser extension has no word limit, making it the strongest genuinely
            free option for everyday writing. LanguageTool can also be self-hosted for
            teams with data-privacy requirements that make cloud-based tools off-limits.
          </p>
          <p className="text-text leading-relaxed mb-4">
            The free tier catches most grammar and spelling errors. Premium ($4.92/mo
            annual) adds style suggestions, punctuation improvement, and a picky-mode
            that catches subtle errors the free tier misses. Even the paid tier is less
            than half the cost of Grammarly Premium.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose LanguageTool over Grammarly:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You write in a language other than English</li>
            <li>Privacy or GDPR compliance is a requirement — you can self-host LanguageTool</li>
            <li>You want a free browser extension with no word limits</li>
            <li>You want the cheapest effective grammar tool (Premium is $4.92/mo annual)</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Grammarly:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your writing is English-only and you want the most polished AI suggestions</li>
            <li>You need AI tone detection and delivery adjustment</li>
            <li>You need a plagiarism checker integrated into your writing tool</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (browser extension, no word limit) · Premium
            $4.92/mo (annual) or $9.90/mo (monthly) · Teams pricing available
          </p>
        </section>

        {/* 3. Hemingway Editor */}
        <section aria-labelledby="grammarly-alt-hemingway" className="mt-12">
          <h2 id="grammarly-alt-hemingway" className="text-2xl font-bold text-text mb-3">
            3. Hemingway Editor — best alternative for readability and concise writing
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Grammarly:</strong> Hemingway Editor does one thing
            extremely well: it trains you to write shorter, clearer sentences. It highlights
            sentences that are hard or very hard to read, passive voice constructions,
            adverbs that weaken your prose, and complex words with simpler alternatives.
            The readability grade score is calibrated to tell you exactly what
            grade level your audience needs to follow your writing — critical for content
            marketers writing for broad audiences.
          </p>
          <p className="text-text leading-relaxed mb-4">
            The web app is completely free with no account required. The desktop app
            ($19.99 one-time, no subscription) works offline and lets you export directly
            to WordPress or Medium. Hemingway doesn&rsquo;t try to be a complete grammar
            checker — it&rsquo;s a complementary tool that fixes something Grammarly
            largely ignores: prose bloat.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Hemingway Editor over Grammarly:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You write blog posts, landing pages, or marketing copy for general audiences</li>
            <li>Your writing tends to be wordy or overly complex — Hemingway trains you out of it</li>
            <li>You want a free, no-account-required readability tool</li>
            <li>You want to publish directly to WordPress or Medium</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Grammarly:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need a full grammar and spelling checker, not a readability scorer</li>
            <li>You need the tool to work inline in your email, Docs, or browser</li>
            <li>Hemingway works best as a post-draft editor, not a real-time assistant</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (web app, no account) · Desktop app $19.99
            one-time (Windows/macOS)
          </p>
        </section>

        {/* 4. QuillBot */}
        <section aria-labelledby="grammarly-alt-quillbot" className="mt-12">
          <h2 id="grammarly-alt-quillbot" className="text-2xl font-bold text-text mb-3">
            4. QuillBot — best alternative for AI paraphrasing and summarizing
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Grammarly:</strong> QuillBot&rsquo;s core strength is
            AI-powered paraphrasing — rewriting any sentence or paragraph in multiple
            styles (Standard, Fluency, Formal, Academic, Simple, Creative, Expand,
            Shorten). This goes further than Grammarly&rsquo;s rewrite suggestions, which
            are more subtle edits than full paraphrases. QuillBot also bundles a summarizer,
            a citation generator (APA, MLA, Chicago), a plagiarism checker, and a grammar
            checker — all at a lower annual price than Grammarly Premium.
          </p>
          <p className="text-text leading-relaxed mb-4">
            The free tier lets you paraphrase 125 words at a time and run 1,200 summarizer
            words/month — enough for light use. The Chrome extension and Word add-in bring
            QuillBot into your existing workflow without copying text between tabs.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose QuillBot over Grammarly:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need to paraphrase sources for academic work or content creation</li>
            <li>You want a citation generator alongside your grammar tool</li>
            <li>You want more aggressive AI rewrites than Grammarly offers</li>
            <li>You write in Academic or Formal register and need style-appropriate rewrites</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Grammarly:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You want subtle, in-place grammar fixes without major rewrites</li>
            <li>Your priority is tone detection and delivery feedback</li>
            <li>QuillBot&rsquo;s paraphrasing can be too aggressive for preserving your voice</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (125-word paraphrasing, 1,200-word summarizer/mo) ·
            Premium $9.95/mo or $49.95/yr · Team plans available
          </p>
        </section>

        {/* 5. Wordtune */}
        <section aria-labelledby="grammarly-alt-wordtune" className="mt-12">
          <h2 id="grammarly-alt-wordtune" className="text-2xl font-bold text-text mb-3">
            5. Wordtune — best alternative for AI sentence rewriting and tone adjustment
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Grammarly:</strong> Wordtune rewrites entire sentences
            with tone controls — Casual, Formal, Shorten, Expand — giving you 3–5 AI
            alternatives for any sentence with one click. It&rsquo;s optimized for
            professionals who want to adjust their writing register quickly: making an
            email more formal before sending it to a client, or expanding a brief note
            into a full paragraph. Wordtune&rsquo;s AI suggestions feel more creative and
            varied than Grammarly&rsquo;s, which tend to be incremental tweaks.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Wordtune over Grammarly:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You frequently need to adjust the tone or formality of your writing</li>
            <li>You want multiple rewrite options, not a single suggested fix</li>
            <li>You write in Google Docs and want seamless AI rewriting without switching apps</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Grammarly:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You need comprehensive grammar and spelling coverage across all browsers</li>
            <li>You write in emails, Slack, and social media where Grammarly&rsquo;s coverage is broader</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (10 rewrites/day) · Plus $9.99/mo or $119.88/yr ·
            Business $9.99/u/mo (annual)
          </p>
        </section>

        {/* 6. Microsoft Editor */}
        <section aria-labelledby="grammarly-alt-microsoft-editor" className="mt-12">
          <h2 id="grammarly-alt-microsoft-editor" className="text-2xl font-bold text-text mb-3">
            6. Microsoft Editor — best free alternative for Microsoft 365 users
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Grammarly:</strong> If you already pay for Microsoft 365,
            Microsoft Editor is effectively free — it&rsquo;s included in every Microsoft
            account and integrates natively into Word, Outlook, and the Edge browser.
            For users who live in the Microsoft ecosystem, it removes the cost justification
            for Grammarly entirely. The browser extension works on Chrome and Edge and
            catches grammar, spelling, and style errors across most websites.
          </p>
          <p className="text-text leading-relaxed mb-4">
            Microsoft Editor has improved dramatically since its launch — it now includes
            formality detection, clarity suggestions, and conciseness nudges for premium
            Microsoft 365 subscribers. It won&rsquo;t match Grammarly&rsquo;s polish or
            AI rewriting capabilities, but for straightforward grammar and spelling, it
            does the job at zero marginal cost.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Microsoft Editor over Grammarly:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You already subscribe to Microsoft 365 and don&rsquo;t want another subscription</li>
            <li>Your writing workflow is primarily in Word and Outlook</li>
            <li>You use Edge as your primary browser</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Grammarly:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You use Google Docs, Notion, or non-Microsoft apps as your primary editor</li>
            <li>You want AI-powered rewrites and tone detection beyond basic grammar</li>
            <li>Microsoft Editor&rsquo;s suggestions feel less polished for complex sentences</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (with Microsoft account) · Advanced features
            included in Microsoft 365 Personal ($6.99/mo) or Family ($9.99/mo)
          </p>
        </section>

        {/* 7. Writer */}
        <section aria-labelledby="grammarly-alt-writer" className="mt-12">
          <h2 id="grammarly-alt-writer" className="text-2xl font-bold text-text mb-3">
            7. Writer — best alternative for enterprise teams and brand consistency
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Grammarly:</strong> Writer is built for marketing,
            communications, and content teams that need every piece of writing to sound
            like it came from the same brand. You upload your style guide and terminology
            — product names, banned words, preferred phrases — and Writer enforces them
            across every document your team produces. Grammarly Business has some
            team style features, but Writer&rsquo;s style guide enforcement is more
            granular and its AI can be fine-tuned on your brand&rsquo;s own content.
          </p>
          <p className="text-text leading-relaxed mb-4">
            Writer also offers stronger compliance support for regulated industries —
            healthcare, legal, and financial teams can configure Writer to flag content
            that violates disclosure requirements or uses prohibited terminology. This
            level of control doesn&rsquo;t exist in Grammarly Business.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Writer over Grammarly:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You manage a content team that must write consistently in a specific brand voice</li>
            <li>You operate in a regulated industry (healthcare, legal, financial services)</li>
            <li>You want AI trained on your company&rsquo;s own content and terminology</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Grammarly:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>You&rsquo;re an individual user — Writer is overkill and too expensive for solo use</li>
            <li>You need a tool that works across every website and browser without configuration</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> No free tier (14-day trial) · Team $18/u/mo ·
            Enterprise custom
          </p>
        </section>

        {/* 8. Ginger Software */}
        <section aria-labelledby="grammarly-alt-ginger" className="mt-12">
          <h2 id="grammarly-alt-ginger" className="text-2xl font-bold text-text mb-3">
            8. Ginger Software — best alternative for ESL writers and mobile users
          </h2>
          <p className="text-text leading-relaxed mb-4">
            <strong>Why it beats Grammarly:</strong> Ginger Software analyzes grammar in
            the context of a full sentence, which makes it particularly effective for
            ESL (English as a Second Language) writers who make errors that depend on
            meaning and intent, not just surface-level grammar rules. It includes a
            built-in translator (60 languages), a text reader for pronunciation practice,
            and a personal trainer mode that shows you your most frequent mistakes.
            On mobile, Ginger&rsquo;s keyboard app integrates directly into iOS and
            Android.
          </p>
          <h3 className="font-semibold text-text mt-4 mb-2">
            When to choose Ginger over Grammarly:
          </h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>English is not your first language and you want translation + grammar together</li>
            <li>You use a mobile keyboard and want grammar checking on your phone natively</li>
            <li>You want a text reader to hear how your writing sounds aloud</li>
          </ul>
          <h3 className="font-semibold text-text mt-4 mb-2">When to stick with Grammarly:</h3>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>Your English is strong and you want advanced style feedback, not ESL support</li>
            <li>You want the most polished, widely-integrated tool across all desktop apps</li>
          </ul>
          <p className="text-text leading-relaxed">
            <strong>Pricing:</strong> Free (limited daily checks) · Premium $7.49/mo
            (annual) or $13.99/mo (monthly)
          </p>
        </section>

        {/* Feature matrix */}
        <section aria-labelledby="grammarly-feature-matrix" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 id="grammarly-feature-matrix" className="text-2xl font-bold text-text">Feature comparison matrix</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-border bg-white" tabIndex={0} role="region" aria-label="Feature comparison table">
            <table aria-label="Grammarly alternatives feature comparison" className="min-w-full text-sm">
              <thead className="bg-surface-alt text-text-secondary">
                <tr>
                  <th scope="col" className="text-left px-3 py-3 font-semibold">Feature</th>
                  <th scope="col" className="text-center px-3 py-3 font-semibold">Grammarly</th>
                  <th scope="col" className="text-center px-3 py-3 font-semibold">ProWritingAid</th>
                  <th scope="col" className="text-center px-3 py-3 font-semibold">LanguageTool</th>
                  <th scope="col" className="text-center px-3 py-3 font-semibold">QuillBot</th>
                  <th scope="col" className="text-center px-3 py-3 font-semibold">Hemingway</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row) => (
                  <tr key={row.feature} className="border-t border-border align-top">
                    <td className="px-3 py-3 font-medium text-text">{row.feature}</td>
                    <td className="px-3 py-3 text-center text-text">{row.grammarly}</td>
                    <td className="px-3 py-3 text-center text-text">{row.proWritingAid}</td>
                    <td className="px-3 py-3 text-center text-text">{row.languageTool}</td>
                    <td className="px-3 py-3 text-center text-text">{row.quillBot}</td>
                    <td className="px-3 py-3 text-center text-text">{row.hemingway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to choose */}
        <section aria-labelledby="grammarly-how-to-choose" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="grammarly-how-to-choose" className="text-2xl font-bold text-text">How to choose the right Grammarly alternative</h2>
          </div>
          <p className="text-text font-semibold mb-2">By use case:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1 mb-4">
            <li>
              Long-form writing, fiction, essays<span aria-hidden="true"> →</span> <strong>ProWritingAid</strong>
            </li>
            <li>
              Multilingual or non-English writing<span aria-hidden="true"> →</span> <strong>LanguageTool</strong>
            </li>
            <li>
              Readability and conciseness training<span aria-hidden="true"> →</span> <strong>Hemingway Editor</strong>
            </li>
            <li>
              AI paraphrasing and academic rewriting<span aria-hidden="true"> →</span> <strong>QuillBot</strong>
            </li>
            <li>
              Tone adjustment and sentence rewriting<span aria-hidden="true"> →</span> <strong>Wordtune</strong>
            </li>
            <li>
              Already in Microsoft 365 ecosystem<span aria-hidden="true"> →</span> <strong>Microsoft Editor</strong>
            </li>
            <li>
              Enterprise brand consistency<span aria-hidden="true"> →</span> <strong>Writer</strong>
            </li>
            <li>
              ESL writers, mobile keyboard users<span aria-hidden="true"> →</span> <strong>Ginger Software</strong>
            </li>
          </ul>
          <p className="text-text font-semibold mb-2">By budget:</p>
          <ul className="list-disc pl-6 text-text leading-relaxed space-y-1">
            <li>
              $0 forever<span aria-hidden="true"> →</span> <strong>LanguageTool</strong> (extension),{" "}
              <strong>Hemingway</strong> (web), <strong>Microsoft Editor</strong> (with M365)
            </li>
            <li>
              Under $5/mo<span aria-hidden="true"> →</span> <strong>ProWritingAid</strong> ($2.50/mo annual),{" "}
              <strong>LanguageTool Premium</strong> ($4.92/mo annual)
            </li>
            <li>
              Under $10/mo<span aria-hidden="true"> →</span> <strong>QuillBot</strong> ($4.16/mo annual),{" "}
              <strong>Wordtune</strong> ($9.99/mo), <strong>Ginger</strong> ($7.49/mo annual)
            </li>
            <li>
              Enterprise budget<span aria-hidden="true"> →</span> <strong>Writer</strong> ($18/u/mo) or Grammarly Business
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section aria-labelledby="grammarly-faq" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="grammarly-faq" className="text-2xl font-bold text-text">Frequently asked questions</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-text mb-2">
                What is the best free Grammarly alternative?
              </h3>
              <p className="text-text leading-relaxed">
                LanguageTool is the strongest free Grammarly alternative — it checks grammar
                in 30+ languages and has a generous free tier with no word limit for the
                browser extension. Microsoft Editor is also free with a Microsoft account
                and integrates directly into Word and Edge. For readability-focused
                feedback, the free Hemingway web app is unmatched.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">Is ProWritingAid better than Grammarly?</h3>
              <p className="text-text leading-relaxed">
                For long-form writers and authors, yes. ProWritingAid offers 20+ in-depth
                writing reports covering overused words, clichés, sentence length variation,
                readability, and style consistency — far more depth than Grammarly&rsquo;s
                style suggestions. Grammarly is faster and more polished for everyday
                business writing and short documents. ProWritingAid wins on depth;
                Grammarly wins on UX and speed.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Which Grammarly alternative works best in Google Docs?
              </h3>
              <p className="text-text leading-relaxed">
                LanguageTool, ProWritingAid, QuillBot, and Wordtune all have Chrome
                extensions that work inside Google Docs. LanguageTool has the most seamless
                Google Docs integration with inline suggestions. ProWritingAid also offers
                a Google Docs add-on with a full sidebar report. Grammarly&rsquo;s Google
                Docs integration has improved but can still conflict with some formatting.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                Does any free tool match Grammarly Premium?
              </h3>
              <p className="text-text leading-relaxed">
                No single free tool replicates all of Grammarly Premium&rsquo;s features —
                advanced style suggestions, plagiarism detection, and tone detection require
                a paid tier from any provider. The closest free combination is LanguageTool
                (grammar + 30 languages) plus Hemingway (readability) plus the free QuillBot
                tier (paraphrasing). For casual use, this covers roughly 80% of Grammarly
                Premium&rsquo;s value at no cost.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text mb-2">
                What is the best Grammarly alternative for teams?
              </h3>
              <p className="text-text leading-relaxed">
                Writer.com is built specifically for brand-consistent team writing — it
                enforces a company style guide, terminology, and tone across every document
                your team produces. Grammarly Business can do this too, but Writer&rsquo;s
                style-guide enforcement is more granular and its AI is trained on your brand
                voice. For regulated industries (legal, financial, healthcare), Writer&rsquo;s
                compliance features are stronger than Grammarly Business.
              </p>
            </div>
          </div>
        </section>

        {/* Related comparisons */}
        <section aria-labelledby="grammarly-related" className="mt-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 id="grammarly-related" className="text-2xl font-bold text-text">Related comparisons</h2>
          </div>
          <ul className="space-y-2 text-text">
            <li>
              <CompareLink
                href="/compare/grammarly-vs-prowritingaid"
                className="text-primary-600 font-semibold hover:underline"
              >
                Grammarly vs ProWritingAid
              </CompareLink>{" "}
              — the most-searched 2-way grammar tool comparison
            </li>
            <li>
              <CompareLink
                href="/compare/grammarly-vs-quillbot"
                className="text-primary-600 font-semibold hover:underline"
              >
                Grammarly vs QuillBot
              </CompareLink>{" "}
              — grammar checker vs AI paraphraser
            </li>
            <li>
              <CompareLink
                href="/compare/grammarly-vs-languagetool"
                className="text-primary-600 font-semibold hover:underline"
              >
                Grammarly vs LanguageTool
              </CompareLink>{" "}
              — paid polish vs free open-source
            </li>
            <li>
              <CompareLink
                href="/compare/grammarly-vs-hemingway"
                className="text-primary-600 font-semibold hover:underline"
              >
                Grammarly vs Hemingway Editor
              </CompareLink>{" "}
              — real-time checking vs post-draft readability
            </li>
            <li>
              <CompareLink
                href="/compare/quillbot-vs-wordtune"
                className="text-primary-600 font-semibold hover:underline"
              >
                QuillBot vs Wordtune
              </CompareLink>{" "}
              — AI paraphrasing tools compared
            </li>
          </ul>
        </section>

        <div className="mt-12">
          <NewsletterSignup source="alternatives" referrerSlug="grammarly" />
        </div>
      </div>
    </>
  );
}
