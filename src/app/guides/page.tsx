import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { GUIDE_CONFIG } from "@/lib/data/guides";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

const PAGE_TITLE = `Topic Guides — ${SITE_NAME}`;
const PAGE_DESC =
  "Structured topical guides covering personal finance, cooking, travel planning, and more — with expert comparisons and articles organized by decision stage.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: `${SITE_URL}/guides`,
    languages: { en: `${SITE_URL}/guides`, "x-default": `${SITE_URL}/guides` },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_URL}/guides`,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

export default function GuidesIndexPage() {
  const guides = Object.values(GUIDE_CONFIG);
  const today = new Date().toISOString().slice(0, 10);

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Guides", url: `${SITE_URL}/guides` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/guides#collectionpage`,
    name: "Topic Guides — A Versus B",
    description: PAGE_DESC,
    url: `${SITE_URL}/guides`,
    dateModified: today,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "A Versus B Topic Guides",
      numberOfItems: guides.length,
      itemListElement: guides.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.h1,
        url: `${SITE_URL}/guides/${g.slug}`,
      })),
    },
  };

  return (
    <>
      {[breadcrumbs, collectionSchema].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero */}
      <div className="bg-gradient-to-br from-accent-900 via-accent-800 to-primary-800 text-white relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="guides-hero-grid"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 0h32v32"
                fill="none"
                stroke="#888"
                strokeWidth=".5"
                strokeOpacity=".4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#guides-hero-grid)" />
        </svg>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav aria-label="breadcrumb" className="text-sm text-accent-200 mb-5">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-accent-400">
                /
              </li>
              <li className="text-white font-medium" aria-current="page">
                Guides
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">
            Topic Guides
          </h1>
          <p className="text-accent-100 text-sm sm:text-base max-w-2xl">
            Structured decision guides organized by topic — each guide links to our
            in-depth comparisons and articles so you can navigate a subject from start
            to finish.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 24"
            fill="none"
            className="w-full"
            aria-hidden="true"
          >
            <path
              d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
          {guides.map((guide) => {
            const totalLinks = guide.sections.reduce(
              (n, s) => n + s.links.length,
              0
            );
            return (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="flex flex-col h-full p-6 rounded-2xl border border-border hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-150 bg-white group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center shadow-sm mb-4 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h2 className="font-display font-bold text-text group-hover:text-primary-700 mb-2 transition-colors leading-snug">
                    {guide.h1}
                  </h2>
                  <p className="text-sm text-text-secondary line-clamp-3 flex-1 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-tertiary">
                      {guide.sections.length} topics · {totalLinks} resources
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
                      Explore
                      <svg
                        className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-12">
          <NewsletterSignup source="guides-index" />
        </div>
      </div>
    </>
  );
}
