import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { PartnershipForm } from "./PartnershipForm";

const PARTNER_TITLE = `Partner With ${SITE_NAME} — Sponsored Comparisons & Data Partnerships`;
const PARTNER_DESC = `Partner with ${SITE_NAME} to reach millions of decision-makers. Sponsored comparisons, featured placements, and custom data solutions for brands.`;
const PARTNER_URL = `${SITE_URL}/partnerships`;

export const metadata: Metadata = {
  title: PARTNER_TITLE,
  description: PARTNER_DESC,
  alternates: {
    canonical: PARTNER_URL,
    languages: { "en": PARTNER_URL, "x-default": PARTNER_URL },
  },
  openGraph: {
    title: PARTNER_TITLE,
    description: `Reach decision-makers at the point of comparison. Sponsored placements, featured reviews, and custom data partnerships.`,
    url: PARTNER_URL,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: PARTNER_TITLE,
    description: PARTNER_DESC,
  },
  other: {
    "citation_title": PARTNER_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": PARTNER_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": PARTNER_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": PARTNER_URL,
  },
};

const TIERS = [
  {
    name: "Standard",
    price: "$500",
    period: "/month",
    description: "Get your brand in front of comparison shoppers",
    features: [
      "Sponsored comparison listing",
      "Brand logo on comparison pages",
      "Link to your product page",
      "Monthly performance report",
    ],
  },
  {
    name: "Featured",
    price: "$1,000",
    period: "/month",
    description: "Stand out with enhanced visibility and content",
    features: [
      "Everything in Standard",
      "Featured badge on comparison pages",
      "Custom comparison attributes",
      "Dedicated comparison landing page",
      "Priority placement in category pages",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$2,000",
    period: "/month",
    description: "Full partnership with custom content and data",
    features: [
      "Everything in Featured",
      "Custom branded comparison widgets",
      "API access to comparison data",
      "Co-branded blog content",
      "Quarterly strategy review",
      "Dedicated account manager",
    ],
  },
];

const STATS = [
  { label: "Monthly Comparisons", value: "500K+" },
  { label: "Categories Covered", value: "50+" },
  { label: "Average Time on Page", value: "4.2 min" },
  { label: "Decision-Stage Visitors", value: "89%" },
];

const PARTNER_FAQS = [
  {
    q: "How much does it cost to partner with A Versus B?",
    a: "Partnership tiers start at $500/month for Standard (sponsored listing + logo), $1,000/month for Featured (dedicated landing page + priority placement), and $2,000/month for Premium (custom widgets, API access, co-branded content, and a dedicated account manager). All tiers are billed monthly with no lock-in period.",
  },
  {
    q: "Are sponsored comparisons labeled as paid content?",
    a: "Yes — all sponsored comparisons carry a clear 'Sponsored' label. Our editorial team retains full control over comparison methodology and data accuracy. Sponsorship affects visibility and placement, but never the comparison results themselves.",
  },
  {
    q: "What types of brands are a good fit for A Versus B partnerships?",
    a: "Any brand whose products or services are regularly compared by consumers: software companies, SaaS platforms, consumer electronics brands, financial services, insurance providers, e-commerce retailers, and B2B vendors. If shoppers search 'X vs Y' and your product is X or Y, you're a strong fit.",
  },
  {
    q: "How is partnership performance measured?",
    a: "Every partner receives a monthly performance report with impressions, clicks, and click-through rates by comparison page. Featured and Premium partners also get conversion tracking integration so you can tie traffic directly to downstream sales.",
  },
  {
    q: "How quickly can a sponsored comparison go live?",
    a: "Standard placements typically go live within 3–5 business days after contract signing. Featured and Premium tiers that require custom content or a dedicated landing page take 5–10 business days. Fill out the form below and we'll send a full timeline with your proposal.",
  },
];

export default function PartnershipsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PARTNER_URL}#webpage`,
    name: PARTNER_TITLE,
    description: PARTNER_DESC,
    abstract: PARTNER_DESC,
    alternativeHeadline: `Advertise on A Versus B — Sponsored Comparisons & Data Deals`,
    url: PARTNER_URL,

    locale: "en_US",    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Publishers, Brands, Agencies, Researchers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessibilityFeature: ["readingOrder", "structuralNavigation"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: { "@type": "ReadAction", target: PARTNER_URL },
    timeRequired: "PT3M",
    wordCount: 600,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PARTNER_URL}#faqpage`,
    name: `Partnership FAQ — ${SITE_NAME}`,
    url: PARTNER_URL,
    mainEntity: PARTNER_FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Gradient Hero */}
      <section aria-labelledby="partnerships-hero-heading" className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <nav className="mb-6" aria-label="Breadcrumb">
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
              <li className="text-white font-medium" aria-current="page">Partnerships</li>
            </ol>
          </nav>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary-100 mb-5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Now accepting partners
            </div>
            <h1 id="partnerships-hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight mb-4">
              Reach Buyers at the<br className="hidden sm:block" /> Point of Decision
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
              People visit {SITE_NAME} when they&apos;re actively comparing options and ready to choose.
              Partner with us to put your brand in front of high-intent decision-makers.
            </p>
            <div className="mt-8">
              <a href="#apply" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all duration-150 text-sm">
                Start a Partnership
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Stats */}
      <ul role="list" className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 list-none">
        {STATS.map((stat) => (
          <li
            key={stat.label}
            className="bg-surface-alt border border-border rounded-2xl p-6 text-center hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
          >
            <div className="text-3xl font-display font-black text-primary-600 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </li>
        ))}
      </ul>

      {/* Why Partner */}
      <section aria-labelledby="partnerships-why-heading" className="mb-16">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 id="partnerships-why-heading" className="text-2xl font-display font-bold text-text">Why Partner With {SITE_NAME}?</h2>
        </div>
        <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none">
          {[
            {
              title: "High-Intent Traffic",
              desc: "Our visitors are actively comparing products and services — they're further down the funnel than typical search traffic.",
            },
            {
              title: "Trusted Reviews",
              desc: "We provide data-driven, unbiased comparisons. Sponsored content is clearly labeled, maintaining trust with readers.",
            },
            {
              title: "Full Transparency",
              desc: "Monthly performance reports with impressions, clicks, and conversion tracking. Know exactly what you're getting.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              <h3 className="font-display font-bold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Pricing Tiers */}
      <section aria-labelledby="partnerships-tiers-heading" className="mb-16">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h2 id="partnerships-tiers-heading" className="text-2xl font-display font-bold text-text">Partnership Tiers</h2>
        </div>
        <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none">
          {TIERS.map((tier) => (
            <li
              key={tier.name}
              className={`bg-surface-alt border rounded-2xl p-6 relative ${
                tier.popular
                  ? "border-primary-500 ring-2 ring-primary-500/20 hover:shadow-lg"
                  : "border-border hover:border-primary-300 hover:shadow-md"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}
              <h3 className="font-display font-bold text-text text-lg mb-1">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-display font-black text-text">{tier.price}</span>
                <span className="text-text-secondary text-sm">{tier.period}</span>
              </div>
              <p className="text-sm text-text-secondary mb-4">{tier.description}</p>
              <ul className="space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                      <svg className="w-2.5 h-2.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Disclosure */}
      <div className="bg-surface-alt border border-border rounded-2xl p-6 mb-16">
        <h3 className="font-display font-bold text-text mb-2">Sponsored Content Disclosure</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          All sponsored comparisons and partnerships are clearly labeled. Our editorial team
          maintains full control over comparison methodology and data accuracy. Sponsorship
          affects visibility and placement but never the comparison results themselves. See
          our{" "}
          <Link href="/disclaimer" className="text-primary-600 hover:underline">
            full disclaimer
          </Link>{" "}
          for details.
        </p>
      </div>

      {/* FAQ */}
      <section aria-labelledby="partnerships-faq-heading" className="mb-16">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="partnerships-faq-heading" className="text-2xl font-display font-bold text-text">Partnership FAQ</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {PARTNER_FAQS.map(({ q, a }) => (
            <details key={q} className="group border border-border rounded-xl overflow-hidden bg-surface-alt/40 open:bg-white open:shadow-sm transition-all">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none font-semibold text-text list-none">
                <span>{q}</span>
                <svg className="w-4 h-4 flex-shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border">{a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Intake Form */}
      <section id="apply" aria-labelledby="partnerships-apply-heading">
        <div className="flex flex-col items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 id="partnerships-apply-heading" className="text-2xl font-display font-bold text-text">Start a Partnership</h2>
        </div>
        <p className="text-text-secondary text-center mb-8">
          Fill out the form below and we&apos;ll get back to you within 2 business days.
        </p>
        <div className="max-w-2xl mx-auto">
          <PartnershipForm />
        </div>
      </section>
    </div>
    </>
  );
}
