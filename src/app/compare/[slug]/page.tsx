import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getComparisonBySlug, getTrendingComparisons } from "@/lib/services/comparison-service";
import { comparisonPageSchema, type ComparisonVoteData } from "@/lib/seo/schema";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/utils/constants";
import { ComparisonHero } from "@/components/comparison/ComparisonHero";
import { KeyDifferencesBlock } from "@/components/comparison/KeyDifferences";
import { ProsConsBlock } from "@/components/comparison/ProsCons";
import { FAQBlock } from "@/components/comparison/FAQ";
import { RelatedComparisons } from "@/components/comparison/RelatedComparisons";
import { RelatedBlogPosts } from "@/components/comparison/RelatedBlogPosts";
// Lazy-load sidebar to avoid LCP regression
const RelatedComparisonsSidebar = dynamic(
  () => import("@/components/comparison/RelatedComparisonsSidebar").then((m) => ({ default: m.RelatedComparisonsSidebar })),
  { loading: () => null }
);
import { ShareBar } from "@/components/engagement/ShareBar";
import { LikeButton } from "@/components/engagement/LikeButton";
import { EmbedButton } from "@/components/comparison/EmbedButton";
import { CommentSection } from "@/components/engagement/CommentSection";
import { DynamicComparison } from "@/components/comparison/DynamicComparison";
import { InternalLinks } from "@/components/comparison/InternalLinks";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { VersionHistory } from "@/components/comparison/VersionHistory";
import { ResourcesSection } from "@/components/comparison/ResourcesSection";
import { PartnerReviews } from "@/components/comparison/PartnerReviews";
import { generateResources } from "@/lib/services/resources";
import { getPartnerReviews } from "@/lib/data/partner-reviews";
import { enrichEntitiesWithAffiliateLinks } from "@/lib/services/affiliate";
import { getAllMockSlugs } from "@/lib/services/mock-data";
import { parseComparisonSlug } from "@/lib/utils/slugify";
import { notFound } from "next/navigation";
import { BackToResults } from "@/components/comparison/BackToResults";
import { TrackRecentView } from "@/components/comparison/TrackRecentView";
import { Breadcrumbs } from "@/components/comparison/Breadcrumbs";
import { VerdictCard } from "@/components/comparison/VerdictCard";
import { KeyDifferencesSummary } from "@/components/comparison/KeyDifferencesSummary";
import { ShortAnswerBlock } from "@/components/comparison/ShortAnswerBlock";
import { InContentAd } from "@/components/ads/AdUnit";
import { StickyAffiliateCTA } from "@/components/comparison/StickyAffiliateCTA";
import { ComparisonPoll } from "@/components/engagement/ComparisonPoll";
import { SmartReviewLinks } from "@/components/comparison/SmartReviewLinks";
import { TableOfContents } from "@/components/comparison/TableOfContents";
import { ConversionFunnelTracker } from "@/components/engagement/ConversionFunnelTracker";
import { QuickAnswerTLDR } from "@/components/comparison/QuickAnswerTLDR";
import { CitationStatsBar } from "@/components/comparison/CitationStatsBar";
import { DataFactsTable } from "@/components/comparison/DataFactsTable";

// Lazy-load heavy below-fold components
const ComparisonTable = dynamic(
  () => import("@/components/comparison/ComparisonTable").then((m) => ({ default: m.ComparisonTable })),
  { loading: () => <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse"><div className="h-64 bg-surface-alt rounded-xl" /></div> }
);
const ComparisonCharts = dynamic(
  () => import("@/components/comparison/ComparisonCharts").then((m) => ({ default: m.ComparisonCharts })),
  { loading: () => <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse"><div className="h-48 bg-surface-alt rounded-xl" /></div> }
);
const ComparisonVideoPlayer = dynamic(
  () => import("@/components/comparison/ComparisonVideoPlayer").then((m) => ({ default: m.ComparisonVideoPlayer })),
  { loading: () => null }
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 3600; // ISR: revalidate comparison pages every 1 hour

export async function generateStaticParams() {
  const slugs = getAllMockSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let comparison;
  try {
    comparison = await getComparisonBySlug(slug);
  } catch {
    comparison = null;
  }

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
  const fallbackDescription = comparison.shortAnswer
    || `${entityA} vs ${entityB} — compare key differences, pros & cons, features, and find which is best for you.`;

  return {
    title: comparison.metadata.metaTitle || comparison.title,
    description: comparison.metadata.metaDescription || fallbackDescription,
    openGraph: {
      title: comparison.metadata.metaTitle || comparison.title,
      description: comparison.metadata.metaDescription || fallbackDescription,
      url: `${SITE_URL}/compare/${slug}`,
      type: "article",
      publishedTime: comparison.metadata.publishedAt || undefined,
      modifiedTime: comparison.metadata.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: comparison.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.title,
      description: comparison.metadata.metaDescription || fallbackDescription,
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

async function getComparisonVotes(comparisonId: string): Promise<ComparisonVoteData | null> {
  try {
    const prisma = getPrisma();
    if (!prisma) return null;

    const results = await prisma.comparisonVote.groupBy({
      by: ["entityChoice"],
      where: { comparisonId },
      _count: { entityChoice: true },
    });

    const votes: Record<string, number> = {};
    let total = 0;
    for (const r of results) {
      votes[r.entityChoice] = r._count.entityChoice;
      total += r._count.entityChoice;
    }

    return { votes, total };
  } catch {
    return null;
  }
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;

  // Validate slug format — must be "entity-a-vs-entity-b"
  const slugParts = parseComparisonSlug(slug);
  if (!slugParts || !slugParts.entityA || !slugParts.entityB) {
    notFound();
  }

  let comparison;
  try {
    comparison = await getComparisonBySlug(slug);
  } catch {
    // DB/cache error — fall through to dynamic generation
    comparison = null;
  }

  if (!comparison) {
    return <DynamicComparison slug={slug} />;
  }

  const voteData = await getComparisonVotes(comparison.id);
  const schemas = comparisonPageSchema(comparison, voteData);

  // Enrich entities with affiliate links
  const enrichedComparison = {
    ...comparison,
    entities: await enrichEntitiesWithAffiliateLinks(comparison.entities, comparison.category),
  };

  // Fallback to trending if fewer than 3 related comparisons
  let sidebarComparisons = enrichedComparison.relatedComparisons;
  if (sidebarComparisons.length < 3) {
    const trending = await getTrendingComparisons(6);
    const trendingAsRelated = trending
      .filter((t) => t.slug !== slug)
      .map((t) => ({ slug: t.slug, title: t.title, category: t.category }));
    const existingSlugs = new Set(sidebarComparisons.map((c) => c.slug));
    const additional = trendingAsRelated.filter((t) => !existingSlugs.has(t.slug));
    sidebarComparisons = [...sidebarComparisons, ...additional].slice(0, 6);
  }

  return (
    <VerdictFirstLayout comparison={enrichedComparison} schemas={schemas} slug={slug} sidebarComparisons={sidebarComparisons} />
  );
}

function VerdictFirstLayout({
  comparison,
  schemas,
  slug,
  sidebarComparisons,
}: {
  comparison: Awaited<ReturnType<typeof getComparisonBySlug>> & {};
  schemas: ReturnType<typeof comparisonPageSchema>;
  slug: string;
  sidebarComparisons: import("@/types").RelatedComparison[];
}) {
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

      {/* Track recently viewed */}
      <TrackRecentView slug={slug} title={comparison.title} category={comparison.category || ""} />

      {/* Back to search results */}
      <BackToResults />

      {/* Breadcrumbs */}
      <Breadcrumbs
        title={comparison.title}
        slug={comparison.slug}
        category={comparison.category}
      />

      {/* Table of Contents */}
      <TableOfContents
        items={[
          ...(comparison.quickAnswer?.tldr || comparison.verdict || comparison.shortAnswer ? [{ id: "verdict", label: "Quick Answer" }] : []),
          ...(comparison.keyDifferences.length > 0 ? [{ id: "key-differences", label: "Key Differences" }] : []),
          ...(comparison.attributes.length > 0 ? [{ id: "key-facts", label: "Key Facts" }] : []),
          ...(comparison.attributes.length > 0 ? [{ id: "comparison-table", label: "Comparison Table" }] : []),
          { id: "pros-cons", label: "Pros & Cons" },
          ...(comparison.faqs.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
          { id: "resources", label: "Resources" },
          { id: "comments", label: "Comments" },
        ]}
      />

      {/* Share + Like Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
        <ShareBar title={comparison.title} slug={comparison.slug} />
        <div className="flex items-center gap-2">
          <EmbedButton slug={comparison.slug} title={comparison.title} />
          <LikeButton comparisonId={comparison.id} />
        </div>
      </div>

      {/* Hero: Title + Entity Cards */}
      <ComparisonHero comparison={comparison} />

      {/* Citation Stats Bar — data density signal */}
      {comparison.citationStats && (
        <CitationStatsBar stats={comparison.citationStats} />
      )}

      {/* Quick Answer TL;DR — above the fold, GEO-optimized */}
      {comparison.quickAnswer?.tldr && (
        <div id="verdict">
          <QuickAnswerTLDR
            quickAnswer={comparison.quickAnswer}
            entityA={comparison.entities[0]}
            entityB={comparison.entities[1]}
          />
        </div>
      )}

      {/* Short Answer Block — AEO/featured snippet target (fallback when no quickAnswer) */}
      {!comparison.quickAnswer?.tldr && (comparison.shortAnswer || comparison.verdict) && (
        <div id="verdict">
          <ShortAnswerBlock
            shortAnswer={comparison.shortAnswer || ""}
            verdict={comparison.verdict}
            entityA={comparison.entities[0]}
            entityB={comparison.entities[1]}
          />
        </div>
      )}

      {/* VERDICT CARD — above the fold */}
      {(comparison.verdict || comparison.shortAnswer) && (
        <VerdictCard
          verdict={comparison.verdict || ""}
          shortAnswer={comparison.shortAnswer}
          entities={comparison.entities}
          attributes={comparison.attributes}
        />
      )}

      {/* User Poll — after verdict card */}
      {comparison.entities.length >= 2 && (
        <ComparisonPoll
          comparisonId={comparison.id}
          comparisonSlug={comparison.slug}
          entities={comparison.entities.map((e) => ({
            name: e.name,
            imageUrl: e.imageUrl,
            position: e.position,
          }))}
        />
      )}

      {/* Key Differences Summary — top 3, above the fold */}
      {comparison.keyDifferences.length > 0 && (
        <KeyDifferencesSummary
          differences={comparison.keyDifferences}
          entityA={comparison.entities[0]}
          entityB={comparison.entities[1]}
        />
      )}

      {/* Key Facts & Figures table — exact numbers alongside prose */}
      {comparison.attributes.length > 0 && (
        <div id="key-facts">
          <DataFactsTable
            attributes={comparison.attributes}
            entityA={comparison.entities[0]}
            entityB={comparison.entities[1]}
          />
        </div>
      )}

      {/* Mobile: related comparisons scroll strip below verdict area */}
      {sidebarComparisons.length > 0 && (
        <RelatedComparisonsSidebar
          comparisons={sidebarComparisons}
          sourceSlug={slug}
        />
      )}

      {/* ── Below the fold ── */}
      <div className="max-w-7xl mx-auto lg:flex lg:gap-8 lg:px-8">
        {/* Main content column */}
        <div className="flex-1 min-w-0">
          {/* Full Key Differences Table */}
          {comparison.keyDifferences.length > 0 && (
            <div id="key-differences">
              <KeyDifferencesBlock
                differences={comparison.keyDifferences}
                entityA={comparison.entities[0]}
                entityB={comparison.entities[1]}
              />
            </div>
          )}

          {/* Comparison Table (lazy loaded) */}
          {comparison.attributes.length > 0 && (
            <div id="comparison-table">
              <ComparisonTable
                attributes={comparison.attributes}
                entityA={comparison.entities[0]}
                entityB={comparison.entities[1]}
              />
            </div>
          )}

          {/* Visual Comparison Charts (lazy loaded) */}
          {comparison.attributes.some(a => a.values.some(v => v.valueNumber != null)) && (
            <ComparisonCharts
              attributes={comparison.attributes}
              entityA={comparison.entities[0]}
              entityB={comparison.entities[1]}
            />
          )}

          {/* Video Comparison — lazy loaded, auto-hides if no video available */}
          <ComparisonVideoPlayer slug={comparison.slug} title={comparison.title} />

          {/* Pros & Cons */}
          <div id="pros-cons">
            <ProsConsBlock entities={comparison.entities} />
          </div>

          {/* Inline Newsletter Signup — after pros/cons, high engagement zone */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <NewsletterSignup source="comparison_inline" referrerSlug={comparison.slug} variant="card" />
          </div>

          {/* Inline Newsletter Signup — after pros/cons, high engagement zone */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <NewsletterSignup source="comparison_inline" referrerSlug={comparison.slug} variant="card" />
          </div>

          {/* FAQ */}
          {comparison.faqs.length > 0 && (
            <div id="faq">
              <FAQBlock faqs={comparison.faqs} />
            </div>
          )}

          {/* Resources & Learn More */}
          <div id="resources">
            <ResourcesSection
              resources={generateResources(comparison.slug, comparison.entities)}
              entities={comparison.entities}
            />
          </div>
        </div>

        {/* Desktop: sticky related comparisons sidebar */}
        {sidebarComparisons.length > 0 && (
          <RelatedComparisonsSidebar
            comparisons={sidebarComparisons}
            sourceSlug={slug}
          />
        )}
      </div>

      {/* Ad: between main content and partner reviews */}
      <InContentAd />

      {/* Partner Reviews (SmartReview) */}
      {(() => {
        const partnerReviews = getPartnerReviews(comparison.slug);
        return partnerReviews.length > 0 ? <PartnerReviews reviews={partnerReviews} /> : null;
      })()}

      {/* SmartReview Cross-Links */}
      <SmartReviewLinks
        entities={comparison.entities.map((e) => ({ name: e.name, slug: e.slug }))}
      />

      {/* Full-width sections below sidebar area */}
      {/* Related Comparisons (bottom grid, kept for SEO internal links) */}
      {comparison.relatedComparisons.length > 0 && (
        <RelatedComparisons comparisons={comparison.relatedComparisons} sourceSlug={slug} />
      )}

      {/* Related Blog Posts (reciprocal blog-comparison linking) */}
      <RelatedBlogPosts posts={comparison.relatedBlogPosts} />

      {/* Internal Links */}
      <InternalLinks
        currentSlug={comparison.slug}
        category={comparison.category}
        entities={comparison.entities.map((e) => ({ name: e.name, slug: e.slug }))}
        relatedComparisons={comparison.relatedComparisons}
      />

      {/* Newsletter Signup */}
      <NewsletterSignup source="comparison" referrerSlug={comparison.slug} />

      {/* Comments */}
      <div id="comments">
        <CommentSection comparisonId={comparison.id} comparisonTitle={comparison.title} />
      </div>

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
      <FreshnessFooter metadata={comparison.metadata} />

      {/* Sticky Affiliate CTA Bar */}
      <StickyAffiliateCTA
        entities={comparison.entities}
        category={comparison.category}
        slug={slug}
      />

      {/* Conversion Funnel Tracking */}
      <ConversionFunnelTracker slug={slug} category={comparison.category || "general"} />
    </>
  );
}

function FreshnessFooter({ metadata }: { metadata: { updatedAt: string; isHumanReviewed: boolean; isAutoGenerated: boolean } }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-text-secondary">
      Last updated: {new Date(metadata.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      {metadata.isHumanReviewed && (
        <span className="ml-2 inline-flex items-center gap-1 text-green-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Human reviewed
        </span>
      )}
      {metadata.isAutoGenerated && (
        <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          AI generated
        </span>
      )}
    </div>
  );
}
