import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";

const ABOUT_TITLE = `About ${SITE_NAME} — Mission, Team & Methodology`;
const ABOUT_DESC = `Learn about ${SITE_NAME} — our mission to democratize comparisons and help people make better decisions through clear, data-driven insights.`;
const ABOUT_URL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESC,
  alternates: { canonical: ABOUT_URL },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESC,
    url: ABOUT_URL,
  },
  other: {
    "citation_title": ABOUT_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": ABOUT_DESC,
    "DC.title": ABOUT_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": ABOUT_URL,
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: ABOUT_TITLE,
  description: ABOUT_DESC,
  abstract: ABOUT_DESC,
  url: ABOUT_URL,
  inLanguage: "en-US",
  creativeWorkStatus: "Published",
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  alternativeHeadline: `${SITE_NAME} — Compare Anything, Data-Driven & Free`,
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Potential Partners, Students" },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["structuralNavigation", "alternativeText", "readingOrder"],
  educationalLevel: "General",
  teaches: "How A Versus B produces data-driven side-by-side comparisons and the mission behind the platform",
  educationalUse: "reference",
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
  publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
  ethicsPolicy: `${SITE_URL}/disclaimer`,
  correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
  // mainEntity — Organization node that represents the company behind this About page.
  // Google's Knowledge Panel and AI crawlers (Perplexity, ChatGPT) use mainEntity to
  // resolve "About" pages to the canonical Organization in their knowledge graphs.
  mainEntity: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
    founder: [
      {
        "@type": "Person",
        name: "Daniel Rozin",
        url: `${SITE_URL}/authors/daniel-rozin`,
        jobTitle: "Founder & Editor-in-Chief",
        sameAs: [
          "https://www.linkedin.com/in/daniel-rozin-56a066b0/",
          "https://www.facebook.com/daniel.rozin.94",
        ],
      },
      {
        "@type": "Person",
        name: "Shai And",
        jobTitle: "Co-Founder & CTO",
        sameAs: ["https://www.facebook.com/shai.and1"],
      },
    ],
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutPageSchema} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">About</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          About {SITE_NAME}
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          We believe everyone deserves clear, unbiased information to make confident decisions —
          whether you&apos;re choosing a smartphone, understanding world history, or settling a
          debate with friends.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-4">Our Mission</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          {SITE_NAME} was founded on a simple idea: comparisons should be easy, fast, and trustworthy.
          Every day, millions of people search the internet to understand the difference between two
          things — two athletes, two countries, two products, two ideas. Too often, they find walls of
          text, biased reviews, or incomplete data scattered across dozens of tabs.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          We set out to fix that. Our mission is to <strong className="text-text">democratize comparisons</strong> —
          making high-quality, structured, visual comparison data freely available to anyone, anywhere,
          on any topic that matters to them.
        </p>
        <p className="text-text-secondary leading-relaxed">
          From Messi vs. Ronaldo to Japan vs. China, from the iPhone to the latest Android flagship,
          {SITE_NAME} surfaces the facts that matter most — organized, visual, and instantly understandable.
        </p>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-6">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-text mb-2">Search Anything</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Type any two subjects — people, places, products, brands, or ideas — into our search bar
              and get a structured comparison instantly.
            </p>
          </div>
          <div className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-text mb-2">See the Data</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our system aggregates data from reliable sources, organizes it into clear tables, highlights
              key differences, and surfaces pros and cons for both sides.
            </p>
          </div>
          <div className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-text mb-2">Make a Decision</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Walk away with a clear understanding of the strengths and weaknesses of each subject,
              empowered to form your own informed opinion.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-4">What Makes Us Different</h2>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-text">Visual-first design</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                Data is presented in clean tables, side-by-side cards, and visual indicators — not
                walls of text. You see the answer at a glance.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-text">Broad coverage</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                We cover sports, countries, technology, products, celebrities, history, military, economy,
                companies, and more — and we&apos;re constantly expanding.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-text">No hidden agendas</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                We present data objectively. We are not paid to favor one product or entity over another.
                Where affiliate relationships exist, we disclose them transparently.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-text">Always up to date</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                Our team and systems continuously monitor sources to ensure comparison data stays
                current, accurate, and relevant.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 mt-2 flex-shrink-0" />
            <div>
              <p className="font-semibold text-text">Free for everyone</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                Every comparison on {SITE_NAME} is completely free to access. No paywalls, no sign-ups
                required, no data locked behind subscriptions.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-4">What We Compare</h2>
        <p className="text-text-secondary leading-relaxed mb-6">
          {SITE_NAME} covers a wide and growing range of comparison categories:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Sports & Athletes", icon: "⚽" },
            { label: "Countries & Nations", icon: "🌍" },
            { label: "Technology & Gadgets", icon: "💻" },
            { label: "Products & Consumer Goods", icon: "📦" },
            { label: "Celebrities & Public Figures", icon: "⭐" },
            { label: "History & Events", icon: "📜" },
            { label: "Military & Defense", icon: "🎖️" },
            { label: "Economy & Finance", icon: "📈" },
            { label: "Companies & Brands", icon: "🏢" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 bg-surface-alt border border-border rounded-xl p-3"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium text-text">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Founders */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-6">Who We Are</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Daniel */}
          <div className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl font-display font-black text-white shrink-0 ring-2 ring-white shadow-sm">
                DR
              </div>
              <div>
                <p className="font-semibold text-text">Daniel Rozin</p>
                <p className="text-sm text-text-secondary">Founder &amp; Editor-in-Chief</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Daniel started {SITE_NAME} out of a lifelong curiosity about comparing things — from economics
              and history to sports, technology, and products. When he couldn&apos;t find a single tool that
              let him explore all those comparisons in one place, he decided to build it himself.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/daniel-rozin-56a066b0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                LinkedIn
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <a
                href="https://www.facebook.com/daniel.rozin.94"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Facebook
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <Link href="/authors/daniel-rozin" className="text-xs text-primary-600 hover:underline font-medium">
                Author page
              </Link>
            </div>
          </div>
          {/* Shai */}
          <div className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl font-display font-black text-white shrink-0 ring-2 ring-white shadow-sm">
                SA
              </div>
              <div>
                <p className="font-semibold text-text">Shai And</p>
                <p className="text-sm text-text-secondary">Co-Founder &amp; CTO</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Shai is the technical co-founder and engineering lead. He designed and built the platform&apos;s
              infrastructure, data pipeline, and AI integration layer. Daniel and Shai have worked
              together since the beginning, combining curiosity with engineering to make the idea real.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/shai.and1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Facebook
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <a
                href="mailto:Shai.and1@gmail.com"
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Vision */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold text-text mb-4">Our Vision</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          We envision a world where information asymmetry is no longer a barrier to good decision-making.
          Whether you&apos;re a student researching a school project, a professional evaluating enterprise
          software, a parent choosing the right product, or simply a curious person exploring the world —
          {SITE_NAME} is built for you.
        </p>
        <p className="text-text-secondary leading-relaxed">
          We are a small, dedicated team of engineers, researchers, and content specialists who care deeply
          about information quality and user experience. We are committed to continuous improvement and
          always welcome feedback from our community.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-primary-50 border border-primary-100 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-display font-bold text-text mb-2">Have a question or suggestion?</h2>
        <p className="text-text-secondary mb-6 text-sm">
          We&apos;d love to hear from you. Reach out to our team any time.
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl hover:shadow-md transition-all duration-150"
        >
          Contact Us
        </Link>
      </section>
    </div>
    </>
  );
}
