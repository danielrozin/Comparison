import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { GUIDE_CONFIG } from "@/lib/data/guides";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo/schema";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { filterLiveInternalLinks } from "@/lib/seo/resolve-internal-links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(GUIDE_CONFIG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_CONFIG[slug];
  if (!guide) return { title: "Not Found" };

  const canonicalUrl = `${SITE_URL}/guides/${guide.slug}`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(guide.h1)}&type=hub`;

  return {
    title: guide.title,
    description: guide.description,
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
      canonical: canonicalUrl,
      languages: { en: canonicalUrl, "x-default": canonicalUrl },
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: canonicalUrl,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${guide.h1} — A Versus B guide`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@aversusb",
      title: guide.title,
      description: guide.description,
      images: [{ url: ogImage, alt: `${guide.h1} — A Versus B guide` }],
    },
    other: {
      "DC.title": guide.title,
      "DC.description": guide.description,
      "DC.creator": "Daniel Rozin",
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.type": "Text",
      "DC.date": "2026-01-01",
      "DC.identifier": canonicalUrl,
      thumbnail: ogImage,
    },
  };
}

function guideSchemas(guide: (typeof GUIDE_CONFIG)[string]) {
  const guideUrl = `${SITE_URL}/guides/${guide.slug}`;
  const today = new Date().toISOString().slice(0, 10);
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(guide.h1)}&type=hub`;

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Guides", url: `${SITE_URL}/guides` },
    { name: guide.h1, url: guideUrl },
  ]);

  const allLinks = guide.sections.flatMap((s) => s.links);
  const compareLinks = allLinks.filter((l) => l.type === "compare");
  const blogLinks = allLinks.filter((l) => l.type === "blog");

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    additionalType: "https://schema.org/LearningResource",
    learningResourceType: "Guide",
    "@id": `${guideUrl}#collectionpage`,
    name: guide.h1,
    description: guide.description,
    url: guideUrl,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    creativeWorkStatus: "Published",
    lastReviewed: today,
    contentReferenceTime: today,
    thumbnailUrl: ogImage,
    image: {
      "@type": "ImageObject",
      "@id": `${guideUrl}#primaryImage`,
      url: ogImage,
      width: 1200,
      height: 630,
      caption: `${guide.h1} — Topical Guide on A Versus B`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      "@id": `${guideUrl}#topics`,
      name: `${guide.h1} — Sub-topics`,
      numberOfItems: guide.sections.length,
      itemListElement: guide.sections.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.heading,
      })),
    },
    mentions: [
      ...compareLinks.slice(0, 6).map((l) => ({
        "@type": "WebPage",
        "@id": `${SITE_URL}/compare/${l.slug}#webpage`,
        name: l.title,
        url: `${SITE_URL}/compare/${l.slug}`,
      })),
      ...blogLinks.slice(0, 4).map((l) => ({
        "@type": "Article",
        "@id": `${SITE_URL}/blog/${l.slug}#article`,
        name: l.title,
        url: `${SITE_URL}/blog/${l.slug}`,
      })),
    ],
    dateCreated: "2026-01-01",
    datePublished: "2026-01-01",
    dateModified: today,
    license: "https://creativecommons.org/licenses/by/4.0/",
    teaches: {
      "@type": "DefinedTerm",
      name: guide.h1,
      url: guideUrl,
    },
    educationalUse: "guide",
    keywords: guide.sections.map((s) => s.heading.toLowerCase()).join(", "),
  };

  const faqs = faqSchema(guide.faqs.map((f) => ({ question: f.q, answer: f.a })));

  const webpage = webPageSchema({
    title: guide.h1,
    description: guide.description,
    url: guideUrl,
    dateModified: today,
    mainEntity: { "@type": "CollectionPage", "@id": `${guideUrl}#collectionpage` },
    speakableCssSelector: ["h1", "#guide-intro", "#guide-description"],
  });

  return [breadcrumbs, collection, faqs, webpage];
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const configured = GUIDE_CONFIG[slug];
  if (!configured) notFound();

  // DAN-2581: the curated section links are hardcoded slugs, and consolidation
  // batches retire /compare slugs out from under them. Resolve once, up front, so the
  // filtered guide drives the schema graph and the rendered lists alike — a dead link
  // must not survive in JSON-LD either.
  const liveSections = await Promise.all(
    configured.sections.map(async (section) => ({
      ...section,
      links: (
        await filterLiveInternalLinks(
          section.links.map((l) => ({
            ...l,
            href: l.type === "blog" ? `/blog/${l.slug}` : `/compare/${l.slug}`,
          }))
        )
      ).map(({ href, ...l }) => ({
        // Re-derive the slug: a retired /compare slug comes back folded onto its
        // survivor, and the renderer + schema builder both key off `slug`.
        ...l,
        slug: href.replace(/^\/(?:compare|blog)\//, ""),
      })),
    }))
  );
  const guide = {
    ...configured,
    sections: liveSections.filter((s) => s.links.length > 0),
  };

  const schemas = guideSchemas(guide);
  const totalLinks = guide.sections.reduce((n, s) => n + s.links.length, 0);

  return (
    <>
      <link rel="cite-as" href={`${SITE_URL}/guides/${guide.slug}`} />
      <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
      <meta httpEquiv="content-language" content="en" />
      {schemas.map((schema, i) => (
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
              id="guide-hero-grid"
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
              <path
                d="M0 16h32M16 0v32"
                fill="none"
                stroke="#888"
                strokeWidth=".5"
                strokeOpacity=".2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#guide-hero-grid)" />
        </svg>
        <div
          className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"
          aria-hidden="true"
        />
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
              <li>
                <Link href="/guides" className="hover:text-white transition-colors">
                  Guides
                </Link>
              </li>
              <li aria-hidden="true" className="text-accent-400">
                /
              </li>
              <li className="text-white font-medium" aria-current="page">
                {guide.h1}
              </li>
            </ol>
          </nav>
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-accent-100 border border-white/20">
              <svg
                className="w-3 h-3"
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
              Guide · {totalLinks} resources
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">
            {guide.h1}
          </h1>
          <div id="guide-intro" className="text-accent-100 text-sm sm:text-base max-w-2xl space-y-3">
            {guide.intro.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Jump links */}
        <nav
          aria-label="Guide sections"
          className="mb-10 p-4 rounded-xl border border-border bg-surface-alt/40"
        >
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Jump to section
          </p>
          <ol className="flex flex-wrap gap-2">
            {guide.sections.map((section, i) => (
              <li key={i}>
                <a
                  href={`#section-${i}`}
                  className="inline-block px-3 py-1.5 rounded-lg bg-white border border-border text-sm text-text-secondary hover:text-primary-700 hover:border-primary-300 transition-colors"
                >
                  {section.heading}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#faq-heading"
                className="inline-block px-3 py-1.5 rounded-lg bg-white border border-border text-sm text-text-secondary hover:text-primary-700 hover:border-primary-300 transition-colors"
              >
                FAQs
              </a>
            </li>
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-14 mb-14">
          {guide.sections.map((section, i) => (
            <section key={i} id={`section-${i}`} aria-labelledby={`section-heading-${i}`}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-xs font-bold text-white">{i + 1}</span>
                </div>
                <h2
                  id={`section-heading-${i}`}
                  className="text-xl font-display font-bold text-text"
                >
                  {section.heading}
                </h2>
              </div>
              <p className="text-text-secondary text-sm mb-5 max-w-2xl leading-relaxed">
                {section.description}
              </p>
              <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none">
                {section.links.map((link) => {
                  const href =
                    link.type === "blog"
                      ? `/blog/${link.slug}`
                      : `/compare/${link.slug}`;
                  const badgeLabel = link.type === "blog" ? "Article" : "Compare";
                  const badgeClass =
                    link.type === "blog"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-primary-50 text-primary-700 border-primary-200";
                  return (
                    <li key={link.slug} className="flex">
                      <Link
                        href={href}
                        className="flex items-start gap-4 p-5 rounded-xl border border-border hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 bg-white group relative overflow-hidden w-full"
                      >
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass}`}
                            >
                              {badgeLabel}
                            </span>
                          </div>
                          <h3 className="font-semibold text-text group-hover:text-primary-700 mb-1 leading-snug transition-colors text-sm">
                            {link.title}
                          </h3>
                          <p className="text-xs text-text-secondary line-clamp-2">
                            {link.excerpt}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
                            Read
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
            </section>
          ))}
        </div>

        {/* FAQ section */}
        <section aria-labelledby="faq-heading" className="mb-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 id="faq-heading" className="text-xl font-display font-bold text-text">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-2">
            {guide.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-border rounded-xl overflow-hidden bg-surface-alt/40 open:bg-white open:shadow-sm transition-all"
              >
                <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer select-none font-semibold text-text list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Cite this guide */}
        <section
          aria-labelledby="guide-cite-heading"
          className="mt-10 pt-8 border-t border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2
              id="guide-cite-heading"
              className="text-base font-display font-bold text-text"
            >
              Cite This Guide
            </h2>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Free to use with attribution (CC BY 4.0).
          </p>
          <pre className="whitespace-pre-wrap break-words rounded-xl bg-surface-alt border border-border px-4 py-3 text-xs text-text font-mono select-all leading-relaxed">
            {`A Versus B, "${guide.h1}," aversusb.net, ${new Date().getFullYear()}. https://aversusb.net/guides/${slug}`}
          </pre>
        </section>

        {/* Back to guides */}
        <div className="mt-8 pt-6 border-t border-border">
          <Link
            href="/guides"
            className="text-primary-600 hover:text-primary-700 hover:underline text-sm font-medium transition-colors"
          >
            <span aria-hidden="true">← </span>Browse all guides
          </Link>
        </div>

        <div className="mt-12">
          <NewsletterSignup source={`guide-${slug}`} />
        </div>
      </div>
    </>
  );
}
