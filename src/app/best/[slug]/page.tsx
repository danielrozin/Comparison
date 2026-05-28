import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { BEST_CONFIG } from "@/lib/data/best";
import { getComparisonTitlesBySlugs } from "@/lib/services/comparison-service";
import { breadcrumbSchema, faqSchema, socialSameAs } from "@/lib/seo/schema";
import { countWords, renderRoundupMarkdown } from "@/lib/utils/markdown";
import { ShareBar } from "@/components/engagement/ShareBar";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { InContentAd } from "@/components/ads/AdUnit";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(BEST_CONFIG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = BEST_CONFIG[slug];
  if (!entry) return { title: "Not Found" };

  const canonicalUrl = `${SITE_URL}/best/${entry.slug}`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(entry.title)}&type=best`;
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: canonicalUrl,
      type: "article",
      siteName: SITE_NAME,
      publishedTime: entry.publishedAt,
      modifiedTime: entry.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: entry.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [ogImage],
    },
  };
}

function bestSchemas(entry: (typeof BEST_CONFIG)[string]) {
  const url = `${SITE_URL}/best/${entry.slug}`;

  const article = {
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    url,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    author: {
      "@type": "Person",
      name: entry.author.name,
      ...(entry.author.url && { url: entry.author.url }),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
      sameAs: socialSameAs(),
    },
    mainEntityOfPage: url,
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Best", url: `${SITE_URL}/best` },
    { name: entry.h1, url },
  ]);

  const graph: Record<string, unknown>[] = [article, breadcrumbs];

  if (entry.itemList?.items.length) {
    graph.push({
      "@type": "ItemList",
      name: entry.itemList.name,
      ...(entry.itemList.description && { description: entry.itemList.description }),
      numberOfItems: entry.itemList.items.length,
      itemListElement: entry.itemList.items.map((it) => ({
        "@type": "ListItem",
        position: it.position,
        name: it.name,
        url: `${url}#${it.anchor}`,
      })),
    });
  }

  if (entry.faqs?.length) {
    graph.push(faqSchema(entry.faqs.map((f) => ({ question: f.q, answer: f.a }))));
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BestPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = BEST_CONFIG[slug];
  if (!entry) notFound();

  const renderedBody = renderRoundupMarkdown(entry.bodyMarkdown);
  const readTime = Math.max(1, Math.ceil(countWords(entry.bodyMarkdown) / 200));
  const jsonLd = bestSchemas(entry);

  const relatedTitles = entry.relatedComparisonSlugs?.length
    ? await getComparisonTitlesBySlugs(entry.relatedComparisonSlugs)
    : {};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-surface">
        {/* Breadcrumbs */}
        <div className="bg-surface-alt border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-text-secondary">
              <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/best" className="hover:text-primary-600 transition-colors">Best</Link>
              <span aria-hidden="true">/</span>
              <span className="text-text truncate max-w-[260px] sm:max-w-none">{entry.h1}</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                Roundup
              </span>
              <span className="text-xs text-primary-200">{readTime} min read</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
              {entry.h1}
            </h1>
            {entry.excerpt && (
              <p className="text-lg text-primary-100 leading-relaxed max-w-3xl">
                {entry.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-6 text-sm text-primary-200">
              <span>By {entry.author.name}</span>
              <span aria-hidden="true">|</span>
              <span>Published {formatDate(entry.publishedAt)}</span>
              {entry.updatedAt !== entry.publishedAt && (
                <>
                  <span aria-hidden="true">|</span>
                  <span>Updated {formatDate(entry.updatedAt)}</span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Body */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sm:p-10">
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: renderedBody }}
            />
          </div>

          <div className="my-8">
            <InContentAd />
          </div>

          {/* Share */}
          <div className="mt-8 p-6 bg-white rounded-xl border border-border">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Share this guide
            </h2>
            <ShareBar title={entry.title} slug={slug} path="best" />
          </div>

          {/* Newsletter */}
          <div className="mt-8">
            <NewsletterSignup source="best" referrerSlug={slug} />
          </div>

          {/* Related comparisons */}
          {entry.relatedComparisonSlugs && entry.relatedComparisonSlugs.length > 0 && (
            <aside className="mt-8 p-6 bg-white rounded-xl border border-border">
              <h2 className="text-lg font-bold text-text mb-4">Related comparisons</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {entry.relatedComparisonSlugs.map((compSlug) => {
                  const title = relatedTitles[compSlug] || compSlug.replace(/-/g, " ");
                  return (
                    <Link
                      key={compSlug}
                      href={`/compare/${compSlug}`}
                      className="block p-3 rounded-lg border border-border hover:border-primary-300 hover:bg-primary-50 transition-all"
                    >
                      <span className="text-sm font-medium text-text">{title}</span>
                    </Link>
                  );
                })}
              </div>
            </aside>
          )}
        </article>
      </main>
    </>
  );
}
