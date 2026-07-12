import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { DaysBetweenDates } from "./DaysBetweenDates";

const SLUG = "days-between-dates";
const TITLE = "Days Between Dates Calculator — Count Days, Weeks & Workdays";
const DESCRIPTION =
  "Calculate the exact number of days, weeks, workdays, hours, and minutes between any two dates. Free date difference calculator with calendar breakdown.";
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

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": `${CANONICAL}#breadcrumbs`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, url: SITE_URL } },
        { "@type": "ListItem", position: 2, name: "Tools", item: { "@type": "WebPage", "@id": `${SITE_URL}/tools`, url: `${SITE_URL}/tools` } },
        { "@type": "ListItem", position: 3, name: "Days Between Dates", item: { "@type": "WebPage", "@id": CANONICAL, url: CANONICAL } },
      ],
    },
    {
      "@type": "WebApplication",
      "@id": `${CANONICAL}#app`,
      name: "Days Between Dates Calculator",
      url: CANONICAL,
      description: DESCRIPTION,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Total days between dates",
        "Weeks and remaining days",
        "Business / workday count",
        "Hours and minutes",
        "Years, months, days breakdown",
      ],
      publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      inLanguage: "en-US",
      isAccessibleForFree: true,
    },
    {
      "@type": "FAQPage",
      "@id": `${CANONICAL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I count the days between two dates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Subtract the earlier date from the later date in milliseconds, then divide by 86,400,000 (the number of milliseconds in a day). Our calculator does this instantly — just pick your start and end dates.",
          },
        },
        {
          "@type": "Question",
          name: "How many workdays are between two dates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Workdays (or business days) exclude Saturdays and Sundays. Our calculator counts each calendar day between the two dates and skips weekends. Note: it does not exclude public holidays.",
          },
        },
        {
          "@type": "Question",
          name: "Does the calculator include both the start and end date?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The calculator counts the total number of days from the start date up to (but not including) the end date. This is the standard convention for date-difference calculations.",
          },
        },
      ],
    },
  ],
};

const RELATED_LINKS = [
  { href: "/compare/julian-calendar-vs-gregorian-calendar", label: "Julian vs Gregorian Calendar" },
  { href: "/compare/fiscal-year-vs-calendar-year", label: "Fiscal Year vs Calendar Year" },
  { href: "/blog/how-to-calculate-business-days", label: "How to Calculate Business Days" },
  { href: "/compare/utc-vs-gmt", label: "UTC vs GMT: What's the Difference?" },
];

export default function DaysBetweenDatesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-violet-900 to-purple-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-violet-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-violet-400">›</li>
              <li><Link href="/tools" className="hover:text-white transition-colors">Tools</Link></li>
              <li aria-hidden="true" className="text-violet-400">›</li>
              <li className="text-white font-medium">Days Between Dates</li>
            </ol>
          </nav>
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
              <span>📅</span> Date Calculator
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Days Between Dates Calculator
          </h1>
          <p className="text-lg text-violet-100 leading-relaxed max-w-2xl">
            Count the exact number of days, weeks, workdays, hours, and minutes between any two dates. Instant
            results — no account needed.
          </p>
        </div>
        <div className="relative h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z" fill="var(--color-background, #f9fafb)" />
          </svg>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <DaysBetweenDates />

        {/* Common use cases */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">Common Uses for a Date Difference Calculator</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Project deadlines", "Count the workdays remaining until a project milestone or contract deadline."],
              ["Age in days", "Pick your birthday as the start date and today as the end date to find your age in days, weeks, and hours."],
              ["Event countdowns", "Days until a vacation, wedding, product launch, or exam."],
              ["Billing periods", "Count days in a billing cycle or contract term to prorate fees or services."],
              ["Pregnancy / due dates", "Track weeks and days from a known conception or LMP date to an expected due date."],
              ["Historical durations", "How many days between two historical events? Great for research and trivia."],
            ].map(([title, body]) => (
              <div key={title as string} className="bg-white border border-border rounded-xl p-4">
                <p className="font-semibold text-text mb-1">{title}</p>
                <p className="text-sm text-text-secondary">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">How Date Difference Is Calculated</h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              The calculator subtracts the earlier date from the later date in milliseconds, then converts to days
              by dividing by 86,400,000 (60 seconds × 60 minutes × 24 hours × 1,000 ms). This gives the exact number
              of full calendar days.
            </p>
            <p>
              <strong className="text-text">Workday calculation</strong> iterates over each day in the range and skips Saturdays
              (day 6) and Sundays (day 0). Note: it does not automatically exclude public holidays, which vary by country
              and region.
            </p>
            <p>
              <strong className="text-text">Calendar breakdown</strong> (years, months, days) accounts for varying month lengths
              and leap years — so the result matches what you&apos;d count manually on a calendar.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-6 pb-2 border-b border-border">Frequently Asked Questions</h2>
          <dl className="space-y-6">
            {[
              ["How do I count the days between two dates?", "Subtract the earlier date from the later one in milliseconds, then divide by 86,400,000. Our calculator does this instantly — just pick your dates."],
              ["Does the calculator count the start date or end date?", "The total days counts from the start date up to (not including) the end date — standard for date-difference calculations. If you want to include both endpoints, add 1 to the result."],
              ["How many workdays are between two dates?", "Workdays (Mon–Fri) exclude Saturday and Sunday. Our workday count iterates each calendar day and skips weekends. Public holidays are not excluded, as they vary by location."],
              ["What if my end date is before my start date?", "The calculator shows the absolute (positive) difference either way and notes that the dates were reversed. This lets you calculate backward from a past event."],
              ["Why do some months seem to have different day counts?", "The years/months/days breakdown accounts for varying month lengths (28–31 days) and leap years. So '1 month' in the calculator reflects real calendar months, not exactly 30 or 31 days."],
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
      </main>
    </>
  );
}
