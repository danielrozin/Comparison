import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { PartnershipForm } from "./PartnershipForm";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: `Partner with ${SITE_NAME} to reach millions of decision-makers. Sponsored comparisons, featured placements, and custom data solutions for brands.`,
  alternates: { canonical: `${SITE_URL}/partnerships` },
  openGraph: {
    title: `Partner With ${SITE_NAME}`,
    description: `Reach decision-makers at the point of comparison. Sponsored placements, featured reviews, and custom data partnerships.`,
    url: `${SITE_URL}/partnerships`,
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
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Partnerships</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          Reach Buyers at the Point of Decision
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          People visit {SITE_NAME} when they&apos;re actively comparing options and ready to choose.
          Partner with us to put your brand in front of high-intent decision-makers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-alt border border-border rounded-2xl p-6 text-center"
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
              className="bg-surface-alt border border-border rounded-2xl p-6"
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
                  ? "border-primary-600 ring-2 ring-primary-600/20"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
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
  );
}
