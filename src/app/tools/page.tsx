import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { getPrisma } from "@/lib/db/prisma";

const PAGE_TITLE = `Free Online Calculators & Tools — ${SITE_NAME}`;
const PAGE_DESC =
  "Free interactive calculators and decision tools — mortgage payments, BMI, percentages, age, calories, and more. No login required.";

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
    canonical: `${SITE_URL}/tools`,
    languages: { en: `${SITE_URL}/tools`, "x-default": `${SITE_URL}/tools` },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_URL}/tools`,
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

const TOOL_ICONS: Record<string, string> = {
  "mortgage-calculator": "🏠",
  "bmi-calculator": "⚖️",
  "tip-calculator": "💳",
  "percentage-calculator": "%",
  "age-calculator": "🎂",
  "calorie-calculator": "🥗",
};

async function getToolPages() {
  try {
    const prisma = getPrisma();
    if (!prisma) return [];
    return await prisma.blogArticle.findMany({
      where: { status: "published", category: "tools" },
      select: { slug: true, title: true, excerpt: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function ToolsIndexPage() {
  const tools = await getToolPages();
  const today = new Date().toISOString().slice(0, 10);
  const toolsUrl = `${SITE_URL}/tools`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: { "@type": "WebPage", "@id": SITE_URL, url: SITE_URL },
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools & Calculators",
        item: { "@type": "WebPage", "@id": toolsUrl, url: toolsUrl },
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${toolsUrl}#collectionpage`,
    name: PAGE_TITLE,
    description: PAGE_DESC,
    url: toolsUrl,
    dateModified: today,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Free Calculators & Tools",
      numberOfItems: tools.length,
      itemListElement: tools.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
        url: `${toolsUrl}/${t.slug}`,
      })),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${toolsUrl}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "Are these calculators free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. All calculators and tools on A Versus B are completely free with no account or subscription required.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate are these calculators?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our calculators use the same standard formulas used by banks, health organizations, and financial institutions. Each page explains the exact formula so you can verify the math. Results are estimates — consult a professional for medical, legal, or major financial decisions.",
        },
      },
      {
        "@type": "Question",
        name: "Can I suggest a new calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Submit a request at aversusb.net/requests. Community votes help us prioritize which tools to build next.",
        },
      },
    ],
  };

  return (
    <>
      {[breadcrumbSchema, collectionSchema, faqSchema].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-900 to-teal-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-emerald-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-emerald-400">›</li>
              <li className="text-white font-medium">Tools & Calculators</li>
            </ol>
          </nav>

          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
              <span>🧮</span> Free Calculators
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            Tools & Calculators
          </h1>
          <p className="text-lg text-emerald-100 leading-relaxed max-w-2xl">
            Free interactive calculators to help you understand the math behind your biggest decisions — mortgage payments, health metrics, finances, and more.
          </p>
        </div>

        {/* Wave divider */}
        <div className="relative h-10 overflow-hidden">
          <svg
            viewBox="0 0 1440 40"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z"
              fill="var(--color-background, #f9fafb)"
            />
          </svg>
        </div>
      </div>

      {/* Tool grid */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {tools.length === 0 ? (
          <p className="text-text-secondary">No tools published yet.</p>
        ) : (
          <ul
            role="list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none"
          >
            {tools.map((tool) => {
              const icon = TOOL_ICONS[tool.slug] ?? "🔧";
              return (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="flex flex-col h-full p-6 rounded-2xl border border-border hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-150 bg-white group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm mb-4 flex-shrink-0 text-xl">
                      {icon}
                    </div>
                    <h2 className="font-bold text-text group-hover:text-emerald-700 mb-2 transition-colors leading-snug text-base">
                      {tool.title}
                    </h2>
                    {tool.excerpt && (
                      <p className="text-sm text-text-secondary line-clamp-3 flex-1 mb-4">
                        {tool.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-text-tertiary">Free · No login</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
                        Use tool
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
        )}

        {/* FAQ */}
        <section aria-labelledby="tools-faq-heading" className="mt-14 border-t border-border pt-10">
          <h2 id="tools-faq-heading" className="text-2xl font-bold text-text mb-6">
            Frequently Asked Questions
          </h2>
          <dl className="space-y-6">
            {faqSchema.mainEntity.map((item, idx) => (
              <div key={idx} className="bg-surface-alt rounded-xl p-5 border border-border">
                <dt className="font-semibold text-text mb-2">{item.name}</dt>
                <dd className="text-sm text-text-secondary leading-relaxed">
                  {item.acceptedAnswer.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-12">
          <NewsletterSignup source="tools-index" />
        </div>
      </main>
    </>
  );
}
