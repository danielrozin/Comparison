import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const WHO_TITLE = `Who Is This For? | ${SITE_NAME}`;
const WHO_DESC = `Find out if ${SITE_NAME} is the right comparison tool for you. Structured data comparisons across 17 categories for consumers, students, sports fans, tech professionals, and business decision-makers.`;
const WHO_URL = `${SITE_URL}/who-is-this-for`;

export const metadata: Metadata = {
  title: WHO_TITLE,
  description: WHO_DESC,
  alternates: { canonical: WHO_URL },
  openGraph: {
    title: WHO_TITLE,
    description: `Discover who benefits from ${SITE_NAME} — structured, data-driven comparisons across sports, technology, countries, products, and more.`,
    url: WHO_URL,

    locale: "en_US",  },
  other: {
    "citation_title": WHO_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": WHO_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": WHO_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": WHO_URL,
  },
};

const FAQ_DATA = [
  {
    question: "What is A Versus B used for?",
    answer:
      "A Versus B is a free comparison platform that helps you compare two subjects side by side — products, countries, athletes, software tools, and more — using structured data tables, key differences, and visual indicators across 17 categories.",
  },
  {
    question: "Who should use A Versus B?",
    answer:
      "Anyone making a decision between two options: consumers comparing products like iPhone vs Galaxy, students researching countries or historical events, sports fans settling debates with stats, tech professionals evaluating frameworks, and business decision-makers choosing enterprise tools.",
  },
  {
    question: "Is A Versus B free to use?",
    answer:
      "Yes. Every comparison on A Versus B is completely free. No sign-ups, no paywalls, no subscriptions required.",
  },
  {
    question: "How many comparisons does A Versus B have?",
    answer:
      "A Versus B has over 3,000 comparisons across 17 categories including sports, countries, technology, products, software, automotive, health, finance, education, entertainment, and more. New comparisons are added daily.",
  },
  {
    question: "What's the difference between A Versus B and a product review site?",
    answer:
      "Product review sites evaluate one item at a time. A Versus B focuses exclusively on side-by-side comparisons between two subjects, using structured data tables and visual indicators so you can see exactly where each option wins or loses.",
  },
];

function buildSchemas() {
  const pageUrl = `${SITE_URL}/who-is-this-for`;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    name: WHO_TITLE,
    description: WHO_DESC,
    abstract: WHO_DESC,
    alternativeHeadline: `Is A Versus B Right for You? — Audience Guide & Use Cases`,
    url: pageUrl,

    locale: "en_US",    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Students, Researchers, Professionals", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessibilityFeature: ["readingOrder", "structuralNavigation"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: { "@type": "ReadAction", target: pageUrl },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "#for-you-section",
        "#not-for-you-section",
        "#how-it-works-section",
      ],
    },
    timeRequired: "PT3M",
    wordCount: 600,
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Who Is This For?",
        item: pageUrl,
      },
    ],
  };

  return [webPage, faqPage, breadcrumbs];
}

const IDEAL_USERS = [
  {
    persona: "Consumers Comparing Products",
    icon: "📦",
    scenario:
      "You're deciding between iPhone 16 vs Galaxy S25 and want structured data, not opinion blogs.",
    queries: [
      "iPhone 16 vs Galaxy S25",
      "MacBook Air vs Dell XPS",
      "Sony WH-1000XM5 vs AirPods Max",
    ],
    outcome:
      "Side-by-side spec tables, key differences highlighted, and a clear verdict — all on one page.",
  },
  {
    persona: "Students and Researchers",
    icon: "🎓",
    scenario:
      "You're comparing countries, economies, or historical events for a paper or class project.",
    queries: [
      "Japan vs China economy",
      "World War 1 vs World War 2",
      "USA vs UK education system",
    ],
    outcome:
      "Structured data points with sourced attributes you can reference in your work.",
  },
  {
    persona: "Sports Fans",
    icon: "⚽",
    scenario:
      "You're settling a debate with friends using stats, not just opinions.",
    queries: [
      "Messi vs Ronaldo stats",
      "Lakers vs Celtics all-time record",
      "Premier League vs La Liga",
    ],
    outcome:
      "Career stats, head-to-head records, and community polls to see what other fans think.",
  },
  {
    persona: "Tech Professionals",
    icon: "💻",
    scenario:
      "Your team needs to choose between React vs Vue, AWS vs Azure, or PostgreSQL vs MongoDB.",
    queries: [
      "React vs Vue 2026",
      "AWS vs Azure comparison",
      "PostgreSQL vs MongoDB",
    ],
    outcome:
      "Feature-by-feature breakdowns, performance benchmarks, and ecosystem comparisons.",
  },
  {
    persona: "Business Decision-Makers",
    icon: "🏢",
    scenario:
      "You're evaluating Salesforce vs HubSpot for your sales team or Slack vs Teams for communication.",
    queries: [
      "Salesforce vs HubSpot",
      "Slack vs Microsoft Teams",
      "Shopify vs WooCommerce",
    ],
    outcome:
      "Pricing tiers, feature matrices, and integration comparisons to inform procurement decisions.",
  },
];

const NOT_FOR_YOU = [
  {
    title: "Single product reviews",
    description:
      "We compare two subjects side by side. For in-depth reviews of a single product, check dedicated review sites.",
  },
  {
    title: "Real-time pricing or stock availability",
    description:
      "Our comparisons focus on features, specs, and data — not live pricing or inventory tracking.",
  },
  {
    title: "Subjective lifestyle content",
    description:
      "We present structured data and factual differences, not personal opinions or lifestyle recommendations.",
  },
  {
    title: "Affiliate deal aggregation",
    description:
      "We're a comparison tool, not a deal-finding or coupon site. Our goal is to help you understand differences, not chase discounts.",
  },
];

const USE_CASES = [
  {
    situation: "A college student writing a paper on NATO vs the EU",
    usage:
      "uses A Versus B to pull structured data on membership, budget, founding dates, and key policy differences — saving hours of research across multiple Wikipedia tabs.",
  },
  {
    situation: "A startup CTO choosing between Next.js vs Remix for a new project",
    usage:
      "compares rendering strategies, deployment options, community size, and learning curve on a single comparison page before presenting the recommendation to the team.",
  },
  {
    situation:
      "A parent deciding between the Nintendo Switch vs Steam Deck for their kid",
    usage:
      "sees game library size, price, parental controls, and portability compared visually — and reads the community verdict from other parents.",
  },
  {
    situation:
      "A sports journalist fact-checking Messi vs Ronaldo career stats for an article",
    usage:
      "pulls structured career data — goals, assists, trophies, international caps — from one page instead of scraping three different databases.",
  },
  {
    situation:
      "A small business owner comparing Shopify vs WooCommerce before launching an online store",
    usage:
      "reviews pricing, transaction fees, plugin ecosystems, and scalability in a structured format to make a confident platform choice.",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Search or Browse",
    description:
      "Type any two subjects into the search bar — \"iPhone vs Samsung\", \"Japan vs South Korea\", \"React vs Angular\" — or browse by category.",
  },
  {
    step: 2,
    title: "See Structured Data",
    description:
      "Our system pulls attributes from reliable sources and organizes them into clean comparison tables with visual indicators showing where each option wins.",
  },
  {
    step: 3,
    title: "Read Key Differences",
    description:
      "Every comparison includes a concise summary, key differences, pros and cons for each side, and frequently asked questions.",
  },
  {
    step: 4,
    title: "Make Your Decision",
    description:
      "Walk away with a clear, data-backed understanding. Vote in community polls, share comparisons, or explore related matchups.",
  },
];

export default function WhoIsThisForPage() {
  return (
    <>
      <JsonLd data={buildSchemas()} />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
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
              <li className="text-white font-medium" aria-current="page">Who Is This For?</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">
            Who Is {SITE_NAME} For?
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-2xl leading-relaxed">
            {SITE_NAME} is a free comparison platform with 3,000+ structured comparisons across 17 categories. Here&apos;s how to know if
          it&apos;s the right tool for what you need.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ─── Section 1: This is for you if... ─── */}
      <section id="for-you-section" className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">This is for you if&hellip;</h2>
        </div>
        <div className="space-y-6">
          {IDEAL_USERS.map((user) => (
            <div
              key={user.persona}
              className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{user.icon}</span>
                <h3 className="text-lg font-semibold text-text">
                  {user.persona}
                </h3>
              </div>
              <p className="text-text-secondary leading-relaxed mb-3">
                {user.scenario}
              </p>
              <div className="mb-3">
                <p className="text-sm font-medium text-text mb-1">
                  Searches you might run:
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.queries.map((q) => (
                    <span
                      key={q}
                      className="text-xs bg-primary-50 text-primary-700 border border-primary-100 rounded-full px-3 py-1"
                    >
                      &ldquo;{q}&rdquo;
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                <strong className="text-text">What you get:</strong>{" "}
                {user.outcome}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 2: This is NOT for you if... ─── */}
      <section id="not-for-you-section" className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">This is <em>not</em> for you if&hellip;</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none">
          {NOT_FOR_YOU.map((item) => (
            <li
              key={item.title}
              className="border border-border rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-lg mt-0.5" aria-hidden="true">&#10005;</span>
                <div>
                  <h3 className="font-semibold text-text mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Section 3: Use-case scenarios ─── */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Real-World Use Cases</h2>
        </div>
        <div className="space-y-4">
          {USE_CASES.map((uc, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <span className="text-white font-bold text-sm">
                  {i + 1}
                </span>
              </div>
              <p className="text-text-secondary leading-relaxed">
                <strong className="text-text">{uc.situation}</strong> &mdash;{" "}
                {uc.usage}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 4: How it works ─── */}
      <section id="how-it-works-section" className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">How It Works</h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6 list-none">
          {HOW_IT_WORKS_STEPS.map((s) => (
            <li
              key={s.step}
              className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <span className="text-white font-bold text-lg">
                  {s.step}
                </span>
              </div>
              <h3 className="font-semibold text-text mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {s.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── Section 5: Proof with numbers ─── */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">{SITE_NAME} by the Numbers</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none">
          <li className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 rounded-2xl p-6 text-center hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <p className="text-4xl font-display font-black text-primary-600 mb-2">
              3,000+
            </p>
            <p className="text-sm text-text-secondary font-medium">
              Structured comparisons
            </p>
          </li>
          <li className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 rounded-2xl p-6 text-center hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <p className="text-4xl font-display font-black text-primary-600 mb-2">
              17
            </p>
            <p className="text-sm text-text-secondary font-medium">
              Categories covered
            </p>
          </li>
          <li className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 rounded-2xl p-6 text-center hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
            <p className="text-4xl font-display font-black text-primary-600 mb-2">
              Free
            </p>
            <p className="text-sm text-text-secondary font-medium">
              Forever, no sign-up required
            </p>
          </li>
        </ul>
        <p className="text-text-secondary leading-relaxed mt-6">
          Categories include{" "}
          <Link
            href="/category/sports"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Sports
          </Link>
          ,{" "}
          <Link
            href="/category/countries"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Countries
          </Link>
          ,{" "}
          <Link
            href="/category/technology"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Technology
          </Link>
          ,{" "}
          <Link
            href="/category/products"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Products
          </Link>
          ,{" "}
          <Link
            href="/category/software"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Software
          </Link>
          ,{" "}
          <Link
            href="/category/automotive"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Automotive
          </Link>
          ,{" "}
          <Link
            href="/category/companies"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Companies
          </Link>
          ,{" "}
          <Link
            href="/category/health"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Health
          </Link>
          ,{" "}
          <Link
            href="/category/finance"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Finance
          </Link>
          , and more. New comparisons are added daily.
        </p>
      </section>

      {/* ─── FAQ ─── */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => (
            <details
              key={faq.question}
              className="border border-border rounded-xl group"
            >
              <summary className="cursor-pointer p-5 font-semibold text-text flex items-center justify-between">
                {faq.question}
                <span className="text-text-secondary group-open:rotate-180 transition-transform ml-2" aria-hidden="true">
                  &#9662;
                </span>
              </summary>
              <p className="px-5 pb-5 text-text-secondary leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white rounded-2xl p-8 text-center">
        <h2 className="text-xl font-display font-bold text-white mb-2">
          Ready to compare?
        </h2>
        <p className="text-primary-100 mb-6 text-sm">
          Search any two subjects and get a structured, data-driven comparison
          in seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 hover:shadow-md transition-all duration-150"
          >
            Start Comparing
          </Link>
          <Link
            href="/trending"
            className="inline-block px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-150"
          >
            Browse Trending
          </Link>
        </div>
      </section>
    </article>
    </>
  );
}
