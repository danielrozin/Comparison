import type { Metadata } from "next";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/utils/constants";
import { ComparisonHero } from "@/components/comparison/ComparisonHero";
import { KeyDifferencesBlock } from "@/components/comparison/KeyDifferences";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { ComparisonCharts } from "@/components/comparison/ComparisonCharts";
import { ProsConsBlock } from "@/components/comparison/ProsCons";
import { VerdictBlock } from "@/components/comparison/Verdict";
import { FAQBlock } from "@/components/comparison/FAQ";
import { RelatedComparisons } from "@/components/comparison/RelatedComparisons";
import { ShareBar } from "@/components/engagement/ShareBar";
import { LikeButton } from "@/components/engagement/LikeButton";
import { CommentSection } from "@/components/engagement/CommentSection";
import { DynamicComparison } from "@/components/comparison/DynamicComparison";
import { InternalLinks } from "@/components/comparison/InternalLinks";
import { VersionHistory } from "@/components/comparison/VersionHistory";
import { getAllMockSlugs } from "@/lib/services/mock-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = getAllMockSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    const parts = slug.split("-vs-");
    const a = parts[0]?.replace(/-/g, " ") || "";
    const b = parts[1]?.replace(/-/g, " ") || "";
    const title = `${capitalize(a)} vs ${capitalize(b)}`;
    const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&a=${encodeURIComponent(capitalize(a))}&b=${encodeURIComponent(capitalize(b))}&type=comparison`;
    return {
      title: `${title} | A Versus B`,
      description: `Compare ${capitalize(a)} and ${capitalize(b)} — key differences, pros & cons, and verdict.`,
      alternates: { canonical: `${SITE_URL}/compare/${slug}` },
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    };
  }

  const entityA = comparison.entities[0]?.name || "";
  const entityB = comparison.entities[1]?.name || "";
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&a=${encodeURIComponent(entityA)}&b=${encodeURIComponent(entityB)}&cat=${encodeURIComponent(comparison.category || "")}&type=comparison`;

  return {
    title: comparison.metadata.metaTitle || comparison.title,
    description: comparison.metadata.metaDescription || comparison.shortAnswer || "",
    openGraph: {
      title: comparison.metadata.metaTitle || comparison.title,
      description: comparison.metadata.metaDescription || "",
      url: `${SITE_URL}/compare/${slug}`,
      type: "article",
      publishedTime: comparison.metadata.publishedAt || undefined,
      modifiedTime: comparison.metadata.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: comparison.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.title,
      description: comparison.metadata.metaDescription || "",
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE_URL}/compare/${slug}`,
    },
  };
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (l) => l.toUpperCase());
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  // If no existing comparison, render dynamic generator
  if (!comparison) {
    return <DynamicComparison slug={slug} />;
  }

  const schemas = comparisonPageSchema(comparison);

  return (
    <>
      {/* Schema markup */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <a href="/" className="hover:text-primary-600 transition-colors">Home</a>
          </li>
          {comparison.category && (
            <>
              <li>/</li>
              <li>
                <a
                  href={`/category/${comparison.category}`}
                  className="hover:text-primary-600 transition-colors capitalize"
                >
                  {comparison.category}
                </a>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-text font-medium truncate">{comparison.title}</li>
        </ol>
      </nav>

      {/* Share + Like Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
        <ShareBar title={comparison.title} slug={comparison.slug} />
        <LikeButton comparisonId={comparison.id} />
      </div>

      {/* Hero: Title + Short Answer + Entity Cards */}
      <ComparisonHero comparison={comparison} />

      {/* Key Differences */}
      {comparison.keyDifferences.length > 0 && (
        <KeyDifferencesBlock
          differences={comparison.keyDifferences}
          entityA={comparison.entities[0]}
          entityB={comparison.entities[1]}
        />
      )}

      {/* Comparison Table */}
      {comparison.attributes.length > 0 && (
        <ComparisonTable
          attributes={comparison.attributes}
          entityA={comparison.entities[0]}
          entityB={comparison.entities[1]}
        />
      )}

      {/* Visual Comparison Charts */}
      {comparison.attributes.some(a => a.values.some(v => v.valueNumber != null)) && (
        <ComparisonCharts
          attributes={comparison.attributes}
          entityA={comparison.entities[0]}
          entityB={comparison.entities[1]}
        />
      )}

      {/* Pros & Cons */}
      <ProsConsBlock entities={comparison.entities} />

      {/* Verdict */}
      {comparison.verdict && (
        <VerdictBlock
          verdict={comparison.verdict}
          entities={comparison.entities}
        />
      )}

      {/* FAQ */}
      {comparison.faqs.length > 0 && <FAQBlock faqs={comparison.faqs} />}

      {/* Related Comparisons */}
      {comparison.relatedComparisons.length > 0 && (
        <RelatedComparisons comparisons={comparison.relatedComparisons} />
      )}

      {/* Internal Links */}
      <InternalLinks
        currentSlug={comparison.slug}
        category={comparison.category}
        entities={comparison.entities.map((e) => ({ name: e.name, slug: e.slug }))}
        relatedComparisons={comparison.relatedComparisons}
      />

      {/* Comments */}
      <CommentSection comparisonId={comparison.id} comparisonTitle={comparison.title} />

      {/* Version History */}
      <VersionHistory
        comparisonSlug={comparison.slug}
        currentVersion={{
          updatedAt: comparison.metadata.updatedAt,
          isAutoGenerated: comparison.metadata.isAutoGenerated,
          isHumanReviewed: comparison.metadata.isHumanReviewed,
        }}
      />

      {/* Freshness */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-text-secondary">
        Last updated: {new Date(comparison.metadata.updatedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {comparison.metadata.isHumanReviewed && (
          <span className="ml-2 inline-flex items-center gap-1 text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Human reviewed
          </span>
        )}
        {comparison.metadata.isAutoGenerated && (
          <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            AI generated
          </span>
        )}
      </div>
    </>
  );
}
