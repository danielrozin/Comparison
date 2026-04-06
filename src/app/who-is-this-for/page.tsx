import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

export const metadata: Metadata = {
  title: `Who Is This For? | ${SITE_NAME}`,
  description: `Find out if ${SITE_NAME} is the right comparison tool for you. Structured data comparisons across 17 categories for consumers, students, sports fans, tech professionals, and business decision-makers.`,
  alternates: { canonical: `${SITE_URL}/who-is-this-for` },
  openGraph: {
    title: `Who Is This For? | ${SITE_NAME}`,
    description: `Discover who benefits from ${SITE_NAME} — structured, data-driven comparisons across sports, technology, countries, products, and more.`,
    url: `${SITE_URL}/who-is-this-for`,
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
      "A Versus B has over 500 comparisons across 17 categories including sports, countries, technology, products, software, automotive, health, finance, education, entertainment, and more. New comparisons are added daily.",
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
    name: `Who Is This For? | ${SITE_NAME}`,
    description: `Find out if ${SITE_NAME} is the right comparison tool for you.`,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        "#for-you-section",
        "#not-for-you-section",
        "#how-it-works-section",
      ],
    },
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
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={buildSchemas()} />

      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link
              href="/"
              className="hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Who Is This For?</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          Who Is {SITE_NAME} For?
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          {SITE_NAME} is a free comparison platform with 500+ structured
          comparisons across 17 categories. Here&apos;s how to know if
          it&apos;s the right tool for what you need.
        </p>
      </div>

      {/* ─── Section 1: This is for you if... ─── */}
      <section id="for-you-section" className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          This is for you if&hellip;
        </h2>
        <div className="space-y-6">
          {IDEAL_USERS.map((user) => (
            <div
              key={user.persona}
              className="bg-surface-alt border border-border rounded-2xl p-6"
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
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          This is <em>not</em> for you if&hellip;
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {NOT_FOR_YOU.map((item) => (
            <div
              key={item.title}
              className="border border-border rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-lg mt-0.5">&#10005;</span>
                <div>
                  <h3 className="font-semibold text-text mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 3: Use-case scenarios ─── */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          Real-World Use Cases
        </h2>
        <div className="space-y-4">
          {USE_CASES.map((uc, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-bold text-sm">
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
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {HOW_IT_WORKS_STEPS.map((s) => (
            <div
              key={s.step}
              className="bg-surface-alt border border-border rounded-2xl p-6"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-primary-600 font-bold text-lg">
                  {s.step}
                </span>
              </div>
              <h3 className="font-semibold text-text mb-2">{s.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 5: Proof with numbers ─── */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          {SITE_NAME} by the Numbers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
            <p className="text-4xl font-display font-black text-primary-600 mb-2">
              500+
            </p>
            <p className="text-sm text-text-secondary font-medium">
              Structured comparisons
            </p>
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
            <p className="text-4xl font-display font-black text-primary-600 mb-2">
              17
            </p>
            <p className="text-sm text-text-secondary font-medium">
              Categories covered
            </p>
          </div>
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
            <p className="text-4xl font-display font-black text-primary-600 mb-2">
              Free
            </p>
            <p className="text-sm text-text-secondary font-medium">
              Forever, no sign-up required
            </p>
          </div>
        </div>
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
        <h2 className="text-2xl font-display font-bold text-text mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => (
            <details
              key={faq.question}
              className="border border-border rounded-xl group"
            >
              <summary className="cursor-pointer p-5 font-semibold text-text flex items-center justify-between">
                {faq.question}
                <span className="text-text-secondary group-open:rotate-180 transition-transform ml-2">
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
      <section className="bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-display font-bold text-text mb-2">
          Ready to compare?
        </h2>
        <p className="text-text-secondary mb-6 text-sm">
          Search any two subjects and get a structured, data-driven comparison
          in seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Start Comparing
          </Link>
          <Link
            href="/trending"
            className="inline-block px-6 py-3 border border-border text-text font-semibold rounded-xl hover:bg-surface-alt transition-colors"
          >
            Browse Trending
          </Link>
        </div>
      </section>
    </article>
  );
}
