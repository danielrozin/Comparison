import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import {
  FOUNDERS,
  SCAN2REMEMBER_ABOUT,
  SCAN2REMEMBER_URL,
  founderPersonSchema,
  whatsappLink,
} from "@/lib/data/founders";

const ABOUT_TITLE = `Why We Built ${SITE_NAME} — Our Story & Founders`;
const ABOUT_DESC = `Two founders who could not find a decent way to compare a coffee machine. Meet Daniel Rozin and Shai Goldenberg, and the curiosity that turned into ${SITE_NAME}.`;
const ABOUT_URL = `${SITE_URL}/about`;

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESC,
  alternates: {
    canonical: ABOUT_URL,
    languages: { "en": ABOUT_URL, "x-default": ABOUT_URL },
  },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESC,
    url: ABOUT_URL,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_TITLE,
    description: ABOUT_DESC,
  },
  other: {
    "citation_title": ABOUT_TITLE,
    "citation_author": "Daniel Rozin",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": ABOUT_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": ABOUT_TITLE,
    "DC.creator": "Daniel Rozin",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
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

  locale: "en_US",  inLanguage: "en-US",
  creativeWorkStatus: "Published",
  datePublished: "2024-01-01",
  dateModified: new Date().toISOString().slice(0, 10),
  isAccessibleForFree: true,
  conditionsOfAccess: "Free",
  alternativeHeadline: `${SITE_NAME} — Compare Anything, Data-Driven & Free`,
  license: "https://creativecommons.org/licenses/by/4.0/",
  usageInfo: `${SITE_URL}/terms`,
  copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
  copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
  acquireLicensePage: `${SITE_URL}/terms`,
  audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Potential Partners, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
  accessMode: ["textual"],
  accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
  accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
  accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
  educationalLevel: "General",
  teaches: "How A Versus B produces data-driven side-by-side comparisons and the mission behind the platform",
  educationalUse: "reference",
  genre: "About",
  contentReferenceTime: "2024-01-01T00:00:00Z",
  thumbnailUrl: `${SITE_URL}/images/og-default.png`,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/og-default.png`,
    contentUrl: `${SITE_URL}/images/og-default.png`,
    name: `${SITE_NAME} — About Page`,
    description: `About page for ${SITE_NAME}, the free data-driven comparison platform`,
    width: 1200,
    height: 630,
  },
  potentialAction: [
    { "@type": "ReadAction", target: ABOUT_URL },
    {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/compare/{search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  ],
  significantLink: [
    `${SITE_URL}/trending`,
    `${SITE_URL}/how-we-write-verdicts`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/site-map`,
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "#about-story-heading", "#about-mission-heading", "#about-vision-heading"],
  },
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

    locale: "en_US",    logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
    // Reference the full Person nodes emitted below rather than restating a
    // thinner copy of them — one authoritative node per human.
    founder: FOUNDERS.map((f) => ({ "@id": f.personId })),
  },
  timeRequired: "PT3M",
  wordCount: 600,
  breadcrumb: {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/about#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
      { "@type": "ListItem", position: 2, name: "About", item: { "@type": "WebPage", "@id": `${SITE_URL}/about`, name: "About", url: `${SITE_URL}/about` } },
    ],
  },
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/about#faqpage`,
  url: `${SITE_URL}/about`,
  inLanguage: "en-US",
  isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
  mainEntity: [
    {
      "@type": "Question",
      name: "Is A Versus B free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All comparisons, verdicts, and data on A Versus B are completely free. There is no paywall, login requirement, or usage limit for readers.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate are the comparison verdicts on A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Verdicts are AI-assisted and grounded in structured specs, pricing, and aggregated public reviews. A human editorial layer reviews pages that fall below quality thresholds or cover sensitive topics. Users can flag inaccuracies directly on any comparison page using the feedback widget.",
      },
    },
    {
      "@type": "Question",
      name: "Can I request a comparison that does not exist yet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Visit the Comparison Requests page to suggest any comparison you would like to see. You can also upvote existing requests — top-voted comparisons are built first.",
      },
    },
    {
      "@type": "Question",
      name: "Does A Versus B accept paid placements or sponsored comparisons?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. A Versus B does not accept payment to influence comparison verdicts or rankings. All verdicts are produced by our AI and editorial process without commercial interference.",
      },
    },
    {
      "@type": "Question",
      name: "How often is comparison data updated on A Versus B?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comparison pages are refreshed automatically on a rolling schedule and re-ranked daily based on trending activity. You can trigger an update on any page by using the thumbs-down feedback widget to flag outdated information.",
      },
    },
  ],
};

/**
 * The two founders as first-class Person entities.
 *
 * Everything an answer engine needs to treat a byline as a real, checkable
 * human sits here: a stable @id the rest of the graph points at, a photo, the
 * topics they are a source on, a reachable contact point, and sameAs links to
 * profiles that name the same person — including the About page of the other
 * company they run, which independently corroborates the claim.
 */
const founderSchemas = FOUNDERS.map(founderPersonSchema);

/**
 * The sister company. Declaring it as a real Organization the founders also
 * founded turns "we built this too" from a marketing line into a traversable
 * edge in the knowledge graph.
 */
const scan2rememberSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SCAN2REMEMBER_URL}/#organization`,
  name: "Scan2Remember",
  url: SCAN2REMEMBER_URL,
  description:
    "Digital memorial pages and QR memorial plaques, founded by Daniel Rozin and Shai Goldenberg after each lost someone.",
  founder: FOUNDERS.map((f) => ({ "@id": f.personId })),
  sameAs: [SCAN2REMEMBER_ABOUT],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[aboutPageSchema, faqPageSchema, ...founderSchemas, scan2rememberSchema]} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="about-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-hero-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
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
              <li className="text-white font-medium" aria-current="page">About</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300 mb-1.5">
                Our Story
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                Why We Built {SITE_NAME}
              </h1>
            </div>
          </div>
          <p className="text-primary-100 text-base sm:text-lg leading-relaxed max-w-2xl">
            We spent years comparing things for the fun of it — economies, empires, athletes. Then we
            tried to buy a coffee machine, and found there was no decent way to compare anything you
            actually buy. So we built one.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Founders — cards first, the way a reader wants it: who is behind this? */}
      <section aria-labelledby="about-team-heading" className="mb-12">
        <h2 id="about-team-heading" className="sr-only">The founders of {SITE_NAME}</h2>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-6 list-none">
          {FOUNDERS.map((founder) => (
            <li
              key={founder.id}
              id={founder.id}
              className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md transition-all duration-150"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={founder.image}
                  alt={founder.imageAlt}
                  width={640}
                  height={640}
                  sizes="80px"
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                />
                <div>
                  <p className="font-display font-bold text-text text-lg leading-tight">{founder.name}</p>
                  <p className="text-sm text-primary-600 font-semibold">{founder.jobTitle}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{founder.role}</p>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-5">{founder.bio}</p>

              <a
                href={whatsappLink(founder)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1eb959] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1eb959] transition-colors"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.464 3.488" />
                </svg>
                Connect on WhatsApp
              </a>
              <p className="text-[11px] text-text-secondary text-center mt-2">{founder.whatsappDisplay}</p>

              <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                <a
                  href={founder.facebook}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="text-xs text-primary-600 hover:underline font-medium"
                >
                  Facebook<span className="sr-only"> (opens in new tab)</span>
                </a>
                {founder.linkedin && (
                  <>
                    <span className="text-text-secondary text-xs" aria-hidden="true">·</span>
                    <a
                      href={founder.linkedin}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="text-xs text-primary-600 hover:underline font-medium"
                    >
                      LinkedIn<span className="sr-only"> (opens in new tab)</span>
                    </a>
                  </>
                )}
                {founder.email && (
                  <>
                    <span className="text-text-secondary text-xs" aria-hidden="true">·</span>
                    <a href={`mailto:${founder.email}`} className="text-xs text-primary-600 hover:underline font-medium">
                      Email
                    </a>
                  </>
                )}
                {founder.authorPage && (
                  <>
                    <span className="text-text-secondary text-xs" aria-hidden="true">·</span>
                    <Link href={founder.authorPage} className="text-xs text-primary-600 hover:underline font-medium">
                      Author page
                    </Link>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Origin story */}
      <section aria-labelledby="about-story-heading" className="mb-12">
        <h2 id="about-story-heading" className="text-2xl font-display font-bold text-text mb-5">
          It started as an argument we kept having
        </h2>

        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            We have been comparing things our whole lives. Which economy actually grew faster once you
            look past the headline. Whether the Roman empire really outlasted the Ottoman one. Whether
            Messi or Ronaldo has the better record when you strip out the noise. GDP against GDP, era
            against era, player against player. None of it was work — it was the argument we kept
            having, and the reason we kept opening twenty tabs to settle it.
          </p>
          <p>
            Then one of us went to buy a coffee machine.
          </p>
          <p>
            That is where curiosity turned into frustration. Two espresso machines, an hour of
            reading, and still no way to put them side by side and see what actually differed. The
            same thing happened with a phone. Then a laptop, a monitor, a pair of headphones. Every
            search returned the same three things: a review that was really an affiliate pitch, a
            forum thread from four years ago, or a spec sheet with no opinion attached to it.
          </p>
        </div>

        <blockquote className="my-7 border-l-4 border-primary-500 pl-5 py-1">
          <p className="text-lg sm:text-xl font-display font-semibold text-text leading-snug">
            The comparisons we found for free were never honest, and the honest ones were never free.
          </p>
        </blockquote>

        <div className="space-y-4 text-text-secondary leading-relaxed">
          <p>
            So we built the thing we kept looking for. {SITE_NAME} puts two things next to each other —
            the specs, the price, the trade-offs — and then commits to an answer. Not a ranked list of
            affiliate links. An actual verdict, with the reasoning shown, on whatever you want to put
            head to head: coffee machines and phones, but also countries, athletes, empires and ideas.
          </p>
          <p>
            It is free, and it stays free. We are not going to gate the answer to a question we spent
            years being annoyed we could not answer ourselves.
          </p>
        </div>
      </section>

      {/* Scan2Remember — the other company, and why it belongs on this page */}
      <section aria-labelledby="about-s2r-heading" className="mb-12">
        <div className="bg-surface-alt border border-border rounded-2xl p-6 sm:p-7">
          <h2 id="about-s2r-heading" className="text-xl font-display font-bold text-text mb-3">
            Every site we build starts with something personal
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            {SITE_NAME} is the second company we have built together. The first is{" "}
            <a
              href={SCAN2REMEMBER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 font-medium hover:underline"
            >
              Scan2Remember
            </a>
            , which gives families a free digital memorial page and a QR plaque for a grave or urn.
            That one came from loss — Daniel had lost his mother, Shai his grandfather, and neither of
            us could find a way to keep a whole life in one place.
          </p>
          <p className="text-text-secondary leading-relaxed mb-4">
            Same instinct, different feeling. Scan2Remember came out of grief. {SITE_NAME} came out of
            curiosity. Both exist because we went looking for something, could not find it, and were
            stubborn enough to build it.{" "}
            <a
              href={SCAN2REMEMBER_ABOUT}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 font-medium hover:underline"
            >
              Read that story
              <span className="sr-only"> on Scan2Remember (opens in new tab)</span>
            </a>
            .
          </p>
          <p className="text-text-secondary leading-relaxed">
            The newest one is still in development:{" "}
            <a
              href="https://cpgsite.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 font-medium hover:underline"
            >
              Free Coloring Pages
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            {" "}— thousands of free printable coloring pages for kids and adults. Different corner of
            the internet, same rule: find something people keep searching for and can&apos;t get without
            a catch, then build it without the catch.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section aria-labelledby="about-mission-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          </div>
          <h2 id="about-mission-heading" className="text-2xl font-display font-bold text-text">Our Mission</h2>
        </div>
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
          From Messi vs. Ronaldo to Japan vs. China, from the iPhone to the latest Android flagship,{" "}
          {SITE_NAME} surfaces the facts that matter most — organized, visual, and instantly understandable.
        </p>
      </section>

      {/* How It Works */}
      <section aria-labelledby="about-how-it-works-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 id="about-how-it-works-heading" className="text-2xl font-display font-bold text-text">How It Works</h2>
        </div>
        <ol role="list" className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none">
          <li className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <h3 className="font-semibold text-text mb-2">Search Anything</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Type any two subjects — people, places, products, brands, or ideas — into our search bar
              and get a structured comparison instantly.
            </p>
          </li>
          <li className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <h3 className="font-semibold text-text mb-2">See the Data</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our system aggregates data from reliable sources, organizes it into clear tables, highlights
              key differences, and surfaces pros and cons for both sides.
            </p>
          </li>
          <li className="bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <h3 className="font-semibold text-text mb-2">Make a Decision</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Walk away with a clear understanding of the strengths and weaknesses of each subject,
              empowered to form your own informed opinion.
            </p>
          </li>
        </ol>
      </section>

      {/* What Makes Us Different */}
      <section aria-labelledby="about-differentiators-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 id="about-differentiators-heading" className="text-2xl font-display font-bold text-text">What Makes Us Different</h2>
        </div>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">Visual-first design</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                Data is presented in clean tables, side-by-side cards, and visual indicators — not
                walls of text. You see the answer at a glance.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">Broad coverage</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                We cover sports, countries, technology, products, celebrities, history, military, economy,
                companies, and more — and we&apos;re constantly expanding.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">No hidden agendas</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                We present data objectively. We are not paid to favor one product or entity over another.
                Where affiliate relationships exist, we disclose them transparently.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-text">Always up to date</p>
              <p className="text-text-secondary text-sm leading-relaxed mt-1">
                Our team and systems continuously monitor sources to ensure comparison data stays
                current, accurate, and relevant.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
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
      <section aria-labelledby="about-categories-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 id="about-categories-heading" className="text-2xl font-display font-bold text-text">What We Compare</h2>
        </div>
        <p className="text-text-secondary leading-relaxed mb-6">
          {SITE_NAME} covers a wide and growing range of comparison categories:
        </p>
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
          {[
            { label: "Sports & Athletes", gradient: "from-green-500 to-emerald-600", path: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
            { label: "Countries & Nations", gradient: "from-blue-500 to-cyan-600", path: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Technology & Gadgets", gradient: "from-indigo-500 to-blue-600", path: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
            { label: "Products & Consumer Goods", gradient: "from-violet-500 to-purple-600", path: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            { label: "Celebrities & Public Figures", gradient: "from-amber-400 to-orange-500", path: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
            { label: "History & Events", gradient: "from-rose-500 to-pink-600", path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Military & Defense", gradient: "from-slate-600 to-gray-700", path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            { label: "Economy & Finance", gradient: "from-teal-500 to-emerald-600", path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { label: "Companies & Brands", gradient: "from-primary-500 to-indigo-600", path: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 bg-surface-alt border border-border rounded-xl p-3 hover:border-primary-200 hover:bg-white transition-colors duration-150"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.path} />
                </svg>
              </div>
              <span className="text-sm font-medium text-text">{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Team Vision */}
      <section aria-labelledby="about-vision-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 id="about-vision-heading" className="text-2xl font-display font-bold text-text">Our Vision</h2>
        </div>
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

      {/* FAQ */}
      <section aria-labelledby="about-faq-heading" className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 id="about-faq-heading" className="text-2xl font-display font-bold text-text">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
            {[
            {
              q: "Is A Versus B free to use?",
              a: <span>Yes. All comparisons, verdicts, and data are completely free — no paywall, login, or usage limit.</span>,
            },
            {
              q: "How accurate are the comparison verdicts?",
              a: <span>Verdicts are AI-assisted and grounded in structured specs, pricing, and aggregated public reviews. A human editorial layer reviews pages below quality thresholds or covering sensitive topics. You can flag inaccuracies using the feedback widget on any comparison page.</span>,
            },
            {
              q: "Can I request a comparison that doesn't exist yet?",
              a: <span>Yes — visit our <Link href="/requests" className="text-primary-600 hover:underline font-medium">Comparison Requests page</Link>, suggest any pairing you would like to see, and upvote existing requests. Top-voted comparisons are built first.</span>,
            },
            {
              q: "Does A Versus B accept paid placements or sponsored comparisons?",
              a: <span>No. We do not accept payment to influence verdicts or rankings. All verdicts are produced by our AI and editorial process without commercial interference.</span>,
            },
            {
              q: "How often is comparison data updated?",
              a: <span>Comparison pages refresh automatically on a rolling schedule and re-rank daily based on trending activity. You can also trigger an update by flagging outdated information via the thumbs-down widget.</span>,
            },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-border rounded-xl overflow-hidden bg-surface-alt/40 open:bg-white open:shadow-sm transition-all">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none font-semibold text-text list-none">
                <span>{q}</span>
                <svg className="w-4 h-4 flex-shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border">
                {a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="about-contact-cta-heading" className="bg-gradient-to-br from-primary-50 to-indigo-50 border border-primary-100 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 id="about-contact-cta-heading" className="text-xl font-display font-bold text-text mb-2">Have a question or suggestion?</h2>
        <p className="text-text-secondary mb-6 text-sm">
          We&apos;d love to hear from you. Reach out to our team any time.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl hover:shadow-md transition-all duration-150"
        >
          Contact Us
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      <div className="mt-12">
        <NewsletterSignup source="about" />
      </div>
    </div>
    </>
  );
}
