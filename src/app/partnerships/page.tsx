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

    locale: "en_US",  },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-primary-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-primary-400">/</li>
              <li className="text-white font-medium">Partnerships</li>
            </ol>
          </nav>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary-100 mb-5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Now accepting partners
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight mb-4">
              Reach Buyers at the<br className="hidden sm:block" /> Point of Decision
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
              People visit {SITE_NAME} when they&apos;re actively comparing options and ready to choose.
              Partner with us to put your brand in front of high-intent decision-makers.
            </p>
            <div className="mt-8">
              <a href="#apply" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all duration-150 text-sm">
                Start a Partnership
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-alt border border-border rounded-2xl p-6 text-center hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
          >
            <div className="text-3xl font-display font-black text-primary-600 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Why Partner */}
      <div className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text mb-8 text-center">
          Why Partner With {SITE_NAME}?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div
              key={item.title}
              className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              <h3 className="font-display font-bold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="mb-16">
        <h2 className="text-2xl font-display font-bold text-text mb-8 text-center">
          Partnership Tiers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
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
                  <li key={feature} className="flex gap-2 text-sm text-text-secondary">
                    <span className="text-primary-600 font-bold shrink-0">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

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

      {/* Intake Form */}
      <div id="apply">
        <h2 className="text-2xl font-display font-bold text-text mb-2 text-center">
          Start a Partnership
        </h2>
        <p className="text-text-secondary text-center mb-8">
          Fill out the form below and we&apos;ll get back to you within 2 business days.
        </p>
        <div className="max-w-2xl mx-auto">
          <PartnershipForm />
        </div>
      </div>
    </div>
    </>
  );
}
