import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { RoiCalculator } from "./RoiCalculator";

const SLUG = "roi-calculator";
const TITLE = "Free ROI Calculator — Calculate Return on Investment Instantly";
const DESCRIPTION =
  "Calculate ROI, net profit, annualized return (CAGR), and investment multiple for any investment in seconds. Free, no login required.";
const CANONICAL = `${SITE_URL}/tools/${SLUG}`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
  },
  alternates: { canonical: CANONICAL, languages: { en: CANONICAL, "x-default": CANONICAL } },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", site: "@aversusb", title: TITLE, description: DESCRIPTION },
};

const TODAY = new Date().toISOString().slice(0, 10);

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, url: SITE_URL } },
        { "@type": "ListItem", position: 2, name: "Tools", item: { "@type": "WebPage", "@id": `${SITE_URL}/tools`, url: `${SITE_URL}/tools` } },
        { "@type": "ListItem", position: 3, name: "ROI Calculator", item: { "@type": "WebPage", "@id": CANONICAL, url: CANONICAL } },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: TITLE,
      description: DESCRIPTION,
      abstract: "Free online ROI calculator. Enter initial investment, final value, and optional time period to instantly compute return on investment percentage, net profit, annualized ROI (CAGR), and investment multiple.",
      inLanguage: "en-US",
      genre: "Financial Calculator",
      interactivityType: "active",
      isAccessibleForFree: true,
      datePublished: "2026-07-01",
      dateModified: TODAY,
      contentReferenceTime: TODAY,
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      breadcrumb: { "@id": `${CANONICAL}#breadcrumbs` },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "dl dt", "dl dd", "[data-speakable]"],
        xpath: [
          "//h1",
          "//h2",
          "//section[contains(@class,'faq')]//dt",
          "//section[contains(@class,'faq')]//dd",
        ],
      },
      mainEntity: { "@id": `${CANONICAL}#app` },
    },
    {
      "@type": "WebApplication",
      "@id": `${CANONICAL}#app`,
      name: "ROI Calculator",
      url: CANONICAL,
      description: DESCRIPTION,
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: ["ROI percentage", "Net profit calculation", "Annualized ROI (CAGR)", "Return multiple"],
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      inLanguage: "en-US",
      isAccessibleForFree: true,
      potentialAction: [
        {
          "@type": "UseAction",
          target: CANONICAL,
          name: "Calculate ROI",
          description: "Enter initial investment and final value to calculate ROI, CAGR, and net profit instantly.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the ROI formula?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ROI = ((Final Value − Initial Investment) / Initial Investment) × 100. For example, investing $10,000 and receiving $15,000 back yields an ROI of 50%.",
          },
        },
        {
          "@type": "Question",
          name: "What is annualized ROI (CAGR)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Annualized ROI, or Compound Annual Growth Rate (CAGR), tells you what consistent annual growth rate would produce the same total return over a given period. Formula: CAGR = (Final Value / Initial Value)^(1/years) − 1.",
          },
        },
        {
          "@type": "Question",
          name: "What is a good ROI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Context matters. For stock market investments, the S&P 500 averages roughly 10% annually before inflation. For real estate, 8–12% annualized is considered strong. For business investments, ROI varies widely by industry and risk level.",
          },
        },
      ],
    },
  ],
};

const RELATED_LINKS = [
  { href: "/compare/stocks-vs-real-estate", label: "Stocks vs Real Estate: Which Has Better ROI?" },
  { href: "/compare/etf-vs-mutual-fund", label: "ETF vs Mutual Fund" },
  { href: "/compare/index-fund-vs-actively-managed-fund", label: "Index Fund vs Actively Managed Fund" },
  { href: "/compare/roth-ira-vs-traditional-ira", label: "Roth IRA vs Traditional IRA" },
];

export default function RoiCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-blue-900 to-indigo-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-blue-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-blue-400">›</li>
              <li><Link href="/tools" className="hover:text-white transition-colors">Tools</Link></li>
              <li aria-hidden="true" className="text-blue-400">›</li>
              <li className="text-white font-medium">ROI Calculator</li>
            </ol>
          </nav>
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
              <span>📈</span> Investment Calculator
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            ROI Calculator
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-2xl">
            Calculate your return on investment, net profit, annualized return (CAGR), and investment multiple for
            any asset — stocks, real estate, business, or any other investment.
          </p>
        </div>
        <div className="relative h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" fill="var(--color-background, #f9fafb)" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <RoiCalculator />

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">ROI Formula Explained</h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Return on Investment measures the gain or loss from an investment relative to its cost. The formula is:{" "}
              <strong className="text-text">ROI (%) = ((Final Value − Initial Investment) ÷ Initial Investment) × 100</strong>.
            </p>
            <p>
              For example, investing $10,000 and getting back $13,500 yields an ROI of 35%. ROI doesn&apos;t account for
              time by itself — a 35% ROI over 1 year is very different from 35% over 10 years. That&apos;s why
              annualized ROI (CAGR) matters: it converts any ROI over any time period into a comparable annual rate.
            </p>
            <p>
              <strong className="text-text">CAGR formula:</strong> (Final Value ÷ Initial Value)^(1 ÷ years) − 1. A
              $10,000 investment that grows to $13,500 over 3 years has a CAGR of 10.5% per year.
            </p>
          </div>
        </section>

        {/* Benchmarks */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">What Is a Good ROI?</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-surface-alt">
                  {["Asset Class", "Typical Annualized ROI", "Risk Level"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-text border-b border-border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["S&P 500 (stocks)", "~10% before inflation, ~7% real", "Medium–High"],
                  ["Real estate (rental property)", "8–12% total return", "Medium"],
                  ["US Treasury bonds", "4–5% (2024–2025)", "Very Low"],
                  ["High-yield savings account", "4–5% (2024–2025)", "Very Low"],
                  ["Small business", "15–30%+ (highly variable)", "High"],
                  ["Angel / venture investing", "25%+ (most fail)", "Very High"],
                ].map(([asset, roi, risk], i) => (
                  <tr key={asset as string} className={i % 2 === 0 ? "bg-white" : "bg-surface-alt"}>
                    <td className="px-4 py-3 text-sm font-medium text-text border-b border-border">{asset}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary border-b border-border">{roi}</td>
                    <td className="px-4 py-3 text-sm text-text-secondary border-b border-border">{risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {[
              ["What is the difference between ROI and CAGR?", "ROI measures total return over the entire investment period, regardless of how long it was. CAGR (annualized ROI) converts that total return into a consistent annual growth rate, making it possible to compare investments held for different lengths of time."],
              ["Can ROI be negative?", "Yes. A negative ROI means you lost money on the investment. For example, investing $10,000 and getting back $7,000 is an ROI of −30%."],
              ["Does ROI account for dividends or rental income?", "The basic ROI formula uses total return: include dividends or rental income in your final value. So if you invested $10,000 in a stock, received $500 in dividends, and sold for $12,000, your final value is $12,500 for an ROI of 25%."],
              ["Why use annualized ROI instead of total ROI?", "A 100% ROI sounds impressive, but if it took 20 years, that's only ~3.5% per year — worse than most savings accounts. Annualizing lets you compare returns across different time horizons on a level playing field."],
            ].map(([q, a]) => (
              <div key={q as string}>
                <dt className="font-semibold text-text mb-1.5">{q}</dt>
                <dd className="text-text-secondary leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Related links */}
        <aside className="p-6 bg-surface-alt rounded-xl border border-border">
          <h2 className="text-lg font-bold text-text mb-4">Related Comparisons</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {RELATED_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium group">
                  <span className="text-primary-400 group-hover:translate-x-0.5 transition-transform">→</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
