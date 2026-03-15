import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Changelog",
  description: `See what's new on ${SITE_NAME}. Complete history of updates, new comparisons, features, and improvements.`,
  alternates: { canonical: `${SITE_URL}/changelog` },
  openGraph: {
    title: `Changelog | ${SITE_NAME}`,
    description: "Complete history of updates, new comparisons, features, and improvements.",
    url: `${SITE_URL}/changelog`,
  },
};

interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  type: "launch" | "feature" | "content" | "fix" | "improvement";
  items: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-03-15",
    version: "1.3.0",
    title: "Email Notifications, Mobile Fixes & Category Logic",
    type: "improvement",
    items: [
      "Fixed Full Comparison table responsiveness on mobile devices",
      "Added email notifications — all feedback and contact form submissions now sent to team inbox",
      "Fixed internal linking logic — categories now show only logically related topics (economy shows countries/companies, not sports)",
      "Improved mobile text sizing across all comparison components",
    ],
  },
  {
    date: "2026-03-15",
    version: "1.2.0",
    title: "50 New Comparisons & Engagement Features",
    type: "content",
    items: [
      "Added 50 new comparison pages across 8 categories (53 total)",
      "Sports: LeBron vs Jordan, Federer vs Nadal, Ali vs Tyson, Brady vs Manning, and more",
      "Countries: USA vs China, India vs China, Germany vs France, UK vs USA, and more",
      "Technology: PS5 vs Xbox, Mac vs Windows, ChatGPT vs Claude, and more",
      "Companies: Google vs Microsoft, Amazon vs Walmart, Netflix vs Disney+, and more",
      "Brands: Nike vs Adidas, Coca-Cola vs Pepsi, Apple vs Samsung, and more",
      "History: WW1 vs WW2, Roman Empire vs Ottoman Empire, and more",
      "Economy: Bitcoin vs Ethereum, Capitalism vs Socialism, and more",
      "Added share buttons (X, Facebook, LinkedIn, WhatsApp, Reddit, copy link)",
      "Added like button with count on every comparison",
      "Added comment section with name, text, and likes",
      "Added floating feedback widget for requests, questions, and bug reports",
    ],
  },
  {
    date: "2026-03-15",
    version: "1.1.0",
    title: "AI Comparison Generation & Legal Pages",
    type: "feature",
    items: [
      "AI-powered dynamic comparison generation — search for any comparison and it's created in real-time using Claude API",
      "New loading animation while comparisons are being generated",
      "Search results page with comparison pattern parsing (supports 'A vs B', 'compare A to B', 'difference between A and B')",
      "Entity pages showing all comparisons for a given entity (/entity/[slug])",
      "Alternatives pages showing competitors (/alternatives/[slug])",
      "Internal links component with entity links, category links, and 'People Also Compare'",
      "About page with mission statement and platform overview",
      "Contact page with form (name, email, subject, message)",
      "Privacy Policy — comprehensive data handling documentation",
      "Terms of Use — user agreement and intellectual property terms",
      "Disclaimer — accuracy, AI-generated content, and affiliate disclosures",
    ],
  },
  {
    date: "2026-03-15",
    version: "1.0.0",
    title: "Initial Launch — A Versus B",
    type: "launch",
    items: [
      "Launched aversusb.net — the comparison platform",
      "Homepage with hero section, search box, trending comparisons, and category browsing",
      "3 flagship comparison pages: Messi vs Ronaldo, Japan vs China, iPhone 16 vs Samsung S25",
      "Comparison page template with: short answer, key differences, comparison table, pros/cons, verdict, FAQ, related comparisons",
      "10 category hub pages: Sports, Countries, Technology, Products, Celebrities, History, Military, Economy, Companies, Brands",
      "Trending comparisons page",
      "Full JSON-LD structured data: Article, FAQPage, BreadcrumbList, ItemList, Dataset",
      "SEO-optimized metadata, Open Graph, and canonical URLs",
      "DataForSEO integration for keyword discovery (server-side)",
      "Prisma database schema with 20+ models ready for production",
      "Mobile-first responsive design with Tailwind CSS",
      "Custom design system: colors, typography, cards, tables, badges",
    ],
  },
];

const TYPE_BADGES: Record<string, { label: string; className: string }> = {
  launch: { label: "Launch", className: "bg-green-100 text-green-800" },
  feature: { label: "Feature", className: "bg-blue-100 text-blue-800" },
  content: { label: "Content", className: "bg-purple-100 text-purple-800" },
  fix: { label: "Fix", className: "bg-orange-100 text-orange-800" },
  improvement: { label: "Improvement", className: "bg-amber-100 text-amber-800" },
};

export default function ChangelogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
          <li>/</li>
          <li className="text-text font-medium">Changelog</li>
        </ol>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-3">
          Changelog
        </h1>
        <p className="text-text-secondary text-lg">
          Everything new on {SITE_NAME}. New comparisons, features, improvements, and fixes.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Comparisons", value: "53" },
          { label: "Categories", value: "10" },
          { label: "Entity Pages", value: "100+" },
          { label: "Releases", value: String(CHANGELOG.length) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
            <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-10">
          {CHANGELOG.map((entry, idx) => {
            const badge = TYPE_BADGES[entry.type] || TYPE_BADGES.improvement;
            return (
              <div key={idx} className="relative pl-12 sm:pl-16">
                {/* Dot on timeline */}
                <div className="absolute left-2.5 sm:left-4.5 top-1.5 w-3 h-3 rounded-full bg-primary-600 ring-4 ring-white" />

                {/* Date & version */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <time className="text-sm font-medium text-text-secondary" dateTime={entry.date}>
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-xs font-mono text-text-secondary bg-surface-alt px-2 py-0.5 rounded">
                    v{entry.version}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-text mb-3">
                  {entry.title}
                </h2>

                {/* Items */}
                <ul className="space-y-1.5">
                  {entry.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary leading-relaxed">
                      <svg className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscribe CTA */}
      <div className="mt-16 bg-primary-50 border border-primary-200 rounded-xl p-6 sm:p-8 text-center">
        <h3 className="text-lg font-bold text-text mb-2">Stay Updated</h3>
        <p className="text-sm text-text-secondary mb-4">
          Want to know when we add new comparisons or features? Get in touch.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
