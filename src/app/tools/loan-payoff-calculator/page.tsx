import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { LoanPayoffCalculator } from "./LoanPayoffCalculator";

const SLUG = "loan-payoff-calculator";
const TITLE = "Free Loan Payoff Calculator — See Exactly When You'll Be Debt-Free";
const DESCRIPTION =
  "Calculate your loan payoff date, total interest paid, and full amortization schedule instantly. Enter your balance, rate, and monthly payment — no signup needed.";
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
        { "@type": "ListItem", position: 3, name: "Loan Payoff Calculator", item: { "@type": "WebPage", "@id": CANONICAL, url: CANONICAL } },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: TITLE,
      description: DESCRIPTION,
      abstract: "Free online loan payoff calculator. Enter your loan balance, interest rate, and monthly payment to see your exact payoff date, total interest paid, and full amortization schedule — no account required.",
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
      name: "Loan Payoff Calculator",
      url: CANONICAL,
      description: DESCRIPTION,
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: ["Monthly payment calculator", "Amortization schedule", "Total interest cost", "Payoff timeline"],
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      inLanguage: "en-US",
      isAccessibleForFree: true,
      potentialAction: [
        {
          "@type": "UseAction",
          target: CANONICAL,
          name: "Calculate Loan Payoff",
          description: "Enter loan balance, interest rate, and monthly payment to see payoff date and amortization schedule.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I calculate when my loan will be paid off?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Enter your current loan balance, annual interest rate (APR), and your fixed monthly payment. The calculator uses the standard amortization formula to find the exact number of payments until your balance reaches zero.",
          },
        },
        {
          "@type": "Question",
          name: "What happens if I pay extra on my loan each month?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Even small extra payments dramatically cut payoff time and total interest. For example, paying $50 extra per month on a $10,000 loan at 6.5% shortens the payoff by months and saves hundreds in interest.",
          },
        },
        {
          "@type": "Question",
          name: "What is an amortization schedule?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An amortization schedule breaks down each monthly payment into principal (loan reduction) and interest. Early in the loan, most of each payment is interest. Over time, the principal portion grows as the balance falls.",
          },
        },
      ],
    },
  ],
};

const RELATED_LINKS = [
  { href: "/compare/fixed-rate-vs-adjustable-rate-mortgage", label: "Fixed-Rate vs Adjustable-Rate Mortgage" },
  { href: "/compare/15-year-vs-30-year-mortgage", label: "15-Year vs 30-Year Mortgage" },
  { href: "/compare/paying-off-debt-vs-investing", label: "Paying Off Debt vs Investing" },
  { href: "/blog/best-strategies-to-pay-off-debt-faster", label: "Best Strategies to Pay Off Debt Faster" },
];

export default function LoanPayoffCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-900 to-teal-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-emerald-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-emerald-400">›</li>
              <li><Link href="/tools" className="hover:text-white transition-colors">Tools</Link></li>
              <li aria-hidden="true" className="text-emerald-400">›</li>
              <li className="text-white font-medium">Loan Payoff Calculator</li>
            </ol>
          </nav>
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
              <span>💳</span> Finance Calculator
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Loan Payoff Calculator
          </h1>
          <p className="text-lg text-emerald-100 leading-relaxed max-w-2xl">
            Find out exactly when you&apos;ll be debt-free, how much interest you&apos;ll pay, and see your full
            amortization schedule — instantly, no account needed.
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
        <LoanPayoffCalculator />

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">How the Loan Payoff Calculator Works</h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              The calculator uses the standard amortization formula: <strong className="text-text">M = P × [r(1+r)^n] / [(1+r)^n − 1]</strong>, where
              P is your loan principal, r is the monthly interest rate (APR ÷ 12), and n is the remaining number of payments.
              Each month, interest accrues on the remaining balance; the rest of your payment reduces principal.
            </p>
            <p>
              Because interest is front-loaded, early payments are mostly interest. As the balance shrinks, more of each payment
              goes to principal — which is why making extra payments early has an outsized impact on total interest paid.
            </p>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">Tips to Pay Off Your Loan Faster</h2>
          <ul className="space-y-3">
            {[
              ["Make bi-weekly payments", "Paying half your monthly payment every two weeks results in 26 half-payments (13 full payments) per year instead of 12 — shaving years off most loans."],
              ["Round up every payment", "Rounding a $347 payment to $400 costs little but consistently reduces principal faster."],
              ["Apply windfalls to principal", "Tax refunds, bonuses, or cash gifts applied as lump-sum principal payments create an outsized reduction in total interest."],
              ["Refinance if rates dropped", "If market rates have fallen more than 1% since you took out your loan, refinancing may lower your payment and/or payoff date."],
              ["Don't skip payments", "Most loans accrue daily interest. Even one skipped payment can add weeks to your payoff timeline."],
            ].map(([title, body]) => (
              <li key={title as string} className="flex gap-3 bg-white border border-border rounded-xl p-4">
                <span className="text-emerald-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-text">{title}</p>
                  <p className="text-sm text-text-secondary mt-0.5">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {[
              ["How do I calculate when my loan will be paid off?", "Enter your current balance, your annual interest rate (APR), and your fixed monthly payment. The calculator applies the amortization formula month-by-month until the balance reaches zero."],
              ["What if my minimum payment barely covers the interest?", "If your payment is less than or equal to the monthly interest charge, your balance never decreases — it grows. Increase your payment above the interest amount to start making real progress."],
              ["Should I pay off my loan early or invest instead?", "It depends on your interest rate. If your loan rate is 7%+ and you have a stable emergency fund, paying off the loan is often the better guaranteed return. At rates below 5%, investing in a diversified index fund has historically outperformed. See our comparison: paying off debt vs investing."],
              ["Does making extra principal payments change the payoff date?", "Yes — dramatically. Extra principal payments skip forward in your amortization schedule, reducing both the number of remaining payments and the total interest paid. Even an extra $50/month on a $20,000 loan can save 12–18 months and thousands in interest."],
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
