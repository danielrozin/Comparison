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
import { DynamicComparison } from "@/components/comparison/DynamicComparison";
import { InternalLinks } from "@/components/comparison/InternalLinks";
import { ResourcesSection } from "@/components/comparison/ResourcesSection";
import { PartnerReviews } from "@/components/comparison/PartnerReviews";
import { generateResources } from "@/lib/services/resources";
import { getPartnerReviews } from "@/lib/data/partner-reviews";
import { enrichEntitiesWithAffiliateLinks } from "@/lib/services/affiliate";
import { enrichEntitiesWithImages } from "@/lib/services/image-service";
import { getAllMockSlugs } from "@/lib/services/mock-data";
import { parseComparisonSlug } from "@/lib/utils/slugify";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/comparison/Breadcrumbs";
import { VerdictCard } from "@/components/comparison/VerdictCard";
import { TrackComparisonCard } from "@/components/comparison/TrackComparisonCard";
import { KeyDifferencesSummary } from "@/components/comparison/KeyDifferencesSummary";
import { ShortAnswerBlock } from "@/components/comparison/ShortAnswerBlock";
import { InContentAd } from "@/components/ads/AdUnit";
import { SmartReviewLinks } from "@/components/comparison/SmartReviewLinks";
import { QuickAnswerTLDR } from "@/components/comparison/QuickAnswerTLDR";
import { CitationStatsBar } from "@/components/comparison/CitationStatsBar";
import { DataFactsTable } from "@/components/comparison/DataFactsTable";
import { getVideoMetadata } from "@/lib/services/video-service";
import { videoObjectSchema } from "@/lib/seo/schema";

// Lazy-load heavy below-fold SEO content (kept SSR'd for crawlers via dynamic + ssr default)
const ComparisonTable = dynamic(
  () => import("@/components/comparison/ComparisonTable").then((m) => ({ default: m.ComparisonTable })),
  { loading: () => <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse"><div className="h-64 bg-surface-alt rounded-xl" /></div> }
);
const MultiComparisonTable = dynamic(
  () => import("@/components/comparison/MultiComparisonTable").then((m) => ({ default: m.MultiComparisonTable })),
  { loading: () => <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse"><div className="h-64 bg-surface-alt rounded-xl" /></div> }
);
const ComparisonCharts = dynamic(
  () => import("@/components/comparison/ComparisonCharts").then((m) => ({ default: m.ComparisonCharts })),
  { loading: () => <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse"><div className="h-48 bg-surface-alt rounded-xl" /></div> }
);
const ComparisonVideoPlayer = dynamic(
  () => import("@/components/comparison/ComparisonVideoPlayer").then((m) => ({ default: m.ComparisonVideoPlayer })),
  { loading: () => null }
);
const RelatedComparisonsSidebar = dynamic(
  () => import("@/components/comparison/RelatedComparisonsSidebar").then((m) => ({ default: m.RelatedComparisonsSidebar })),
  { loading: () => null }
);

// Interactive/tracking widgets — kept out of SSR HTML and the RSC stream
// via a client-side dynamic-import shim (ssr:false is forbidden in server components).
import {
  TrackRecentView,
  EmbedButton,
  ComparisonPoll,
  NewsletterSignup,
  CommentSection,
  VersionHistory,
  StickyAffiliateCTA,
  ConversionFunnelTracker,
  InterceptSurvey,
  ShareBar,
  LikeButton,
  BackToResults,
  TableOfContents,
} from "@/components/comparison/ComparisonClientWidgets";

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
    const parts = slug.split("-vs-").map((p) => p.replace(/-/g, " ").trim()).filter(Boolean);
    const nameParts = parts.map(capitalize);
    const title = nameParts.join(" vs ");
    const isMulti = nameParts.length > 2;
    const ogImage = isMulti
      ? `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&entities=${encodeURIComponent(nameParts.join("|"))}&type=multi`
      : `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&a=${encodeURIComponent(nameParts[0] || "")}&b=${encodeURIComponent(nameParts[1] || "")}&type=comparison`;
    return {
      title: `${title} | A Versus B`,
      description: `Compare ${nameParts.join(", ")} — key differences, pros & cons, and verdict.`,
      alternates: { canonical: `${SITE_URL}/compare/${slug}` },
      openGraph: { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
      twitter: { card: "summary_large_image", images: [ogImage] },
    };
  }

  const isMultiEntity = comparison.entities.length > 2;
  const entityA = comparison.entities[0]?.name || "";
  const entityB = comparison.entities[1]?.name || "";
  const ogImage = isMultiEntity
    ? `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&entities=${encodeURIComponent(comparison.entities.map((e) => e.name).join("|"))}&cat=${encodeURIComponent(comparison.category || "")}&type=multi`
    : `${SITE_URL}/api/og?title=${encodeURIComponent(comparison.title)}&a=${encodeURIComponent(entityA)}&b=${encodeURIComponent(entityB)}&cat=${encodeURIComponent(comparison.category || "")}&type=comparison`;
  const fallbackDescription = comparison.shortAnswer
    || (isMultiEntity
      ? `${comparison.entities.map((e) => e.name).join(" vs ")} — compare key differences, pros & cons, features, and find which is best for you.`
      : `${entityA} vs ${entityB} — compare key differences, pros & cons, features, and find which is best for you.`);

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

  // Validate slug format — must be "entity-a-vs-entity-b" (or N-way: "a-vs-b-vs-c-...")
  const slugParts = parseComparisonSlug(slug);
  if (!slugParts || slugParts.entities.length < 2) {
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

  // Video metadata (YouTube upload)
  const videoMeta = getVideoMetadata(slug);

  // Enrich entities with images (Wikipedia/Clearbit) + affiliate links in parallel
  const [entitiesWithImages, entitiesWithAffiliates] = await Promise.all([
    enrichEntitiesWithImages(comparison.entities),
    enrichEntitiesWithAffiliateLinks(comparison.entities, comparison.category),
  ]);

  // Merge: affiliates as base, overlay imageUrl from image enrichment
  const mergedEntities = entitiesWithAffiliates.map((e, i) => ({
    ...e,
    imageUrl: entitiesWithImages[i]?.imageUrl || e.imageUrl,
  }));

  const enrichedComparison = {
    ...comparison,
    entities: mergedEntities,
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

  // N-entity (3+): render the multi-entity layout. Most 2-entity-only components
  // (verdict card, key-differences summary, comparison charts) are skipped in v1.
  if (enrichedComparison.entities.length > 2) {
    return (
      <MultiEntityLayout
        comparison={enrichedComparison}
        schemas={schemas}
        slug={slug}
        sidebarComparisons={sidebarComparisons}
      />
    );
  }

  return (
    <VerdictFirstLayout comparison={enrichedComparison} schemas={schemas} slug={slug} sidebarComparisons={sidebarComparisons} videoMeta={videoMeta} />
  );
}

function VerdictFirstLayout({
  comparison,
  schemas,
  slug,
  sidebarComparisons,
  videoMeta,
}: {
  comparison: Awaited<ReturnType<typeof getComparisonBySlug>> & {};
  schemas: ReturnType<typeof comparisonPageSchema>;
  slug: string;
  sidebarComparisons: import("@/types").RelatedComparison[];
  videoMeta: ReturnType<typeof getVideoMetadata>;
}) {
  return (
    <>
      {/* Schema markup — use validated editorial @graph when present, else auto-generated */}
      {comparison.schemaMarkup ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(comparison.schemaMarkup) }}
        />
      ) : (
        schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))
      )}

      {/* Video schema (VideoObject) */}
      {videoMeta?.youtubeVideoId && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              videoObjectSchema({
                slug,
                title: comparison.title,
                description: comparison.shortAnswer || comparison.metadata.metaDescription || "",
                youtubeVideoId: videoMeta.youtubeVideoId,
                uploadDate: videoMeta.uploadedAt,
                entityA: videoMeta.entityA,
                entityB: videoMeta.entityB,
              })
            ),
          }}
        />
      )}

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
          comparisonSlug={comparison.slug}
        />
      )}

      {/* DAN-406: Track this comparison — high-intent capture right under verdict */}
      <TrackComparisonCard
        comparisonSlug={comparison.slug}
        comparisonTitle={comparison.title}
      />

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

      {/* Mobile RC strip dropped (DAN-410): mobile users still get related
          comparisons via the bottom <RelatedComparisons /> SEO grid below.
          Desktop sticky aside + bottom grid retain crawler internal-link surface. */}

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
          <ComparisonVideoPlayer slug={comparison.slug} title={comparison.title} youtubeVideoId={videoMeta?.youtubeVideoId || undefined} />

          {/* Pros & Cons */}
          <div id="pros-cons">
            <ProsConsBlock entities={comparison.entities} />
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
            variant="desktop"
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

      {/* Intercept Survey — 30s dwell OR 60% scroll, 14-day cap (DAN-697) */}
      <InterceptSurvey comparisonSlug={comparison.slug} category={comparison.category || undefined} />
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

/**
 * MultiEntityLayout — Phase 1 v1 N-entity (3+) renderer.
 * Renders only components that already iterate entities[] safely:
 * Hero (custom inline), MultiComparisonTable, ProsCons, FAQ, Resources, Related.
 * 2-entity-only widgets (VerdictCard, KeyDifferencesSummary, ComparisonCharts,
 * QuickAnswerTLDR, etc.) are intentionally skipped for v1 per DAN-387 Phase 1.
 */
function MultiEntityLayout({
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
  const n = comparison.entities.length;
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

      <TrackRecentView slug={slug} title={comparison.title} category={comparison.category || ""} />
      <BackToResults />

      <Breadcrumbs
        title={comparison.title}
        slug={comparison.slug}
        category={comparison.category}
      />

      <TableOfContents
        items={[
          ...(comparison.shortAnswer || comparison.verdict ? [{ id: "verdict", label: "Quick Answer" }] : []),
          ...(comparison.attributes.length > 0 ? [{ id: "comparison-table", label: "Comparison Table" }] : []),
          { id: "pros-cons", label: "Pros & Cons" },
          ...(comparison.faqs.length > 0 ? [{ id: "faq", label: "FAQ" }] : []),
          { id: "resources", label: "Resources" },
          { id: "comments", label: "Comments" },
        ]}
      />

      {/* Share bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
        <ShareBar title={comparison.title} slug={comparison.slug} />
        <div className="flex items-center gap-2">
          <EmbedButton slug={comparison.slug} title={comparison.title} />
          <LikeButton comparisonId={comparison.id} />
        </div>
      </div>

      {/* Multi-entity hero: title + N entity cards in a grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-center text-text mb-3">
          {comparison.title}
        </h1>
        {comparison.metadata?.updatedAt && (
          <p className="text-center text-xs sm:text-sm text-text-secondary mb-6 flex items-center justify-center gap-1.5">
            <time dateTime={comparison.metadata.updatedAt}>
              Updated {new Date(comparison.metadata.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          </p>
        )}
        <div
          className="grid gap-3 sm:gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(n, 3)}, minmax(0, 1fr))` }}
        >
          {comparison.entities.map((ent, idx) => (
            <div
              key={ent.id}
              className={`bg-white border border-border rounded-xl p-4 sm:p-5 text-center hover:shadow-md transition-shadow ${n > 3 && idx >= 3 ? "" : ""}`}
            >
              {ent.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ent.imageUrl}
                  alt={ent.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-3 ring-2 ring-white shadow"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-primary-100 to-accent-100 text-primary-700 flex items-center justify-center font-bold text-2xl">
                  {ent.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="text-sm sm:text-base font-bold text-text mb-1">{ent.name}</h3>
              {ent.shortDesc && (
                <p className="text-xs text-text-secondary leading-snug line-clamp-2">{ent.shortDesc}</p>
              )}
              {ent.bestFor && (
                <p className="mt-3 text-[11px] sm:text-xs font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 px-3 py-1.5 rounded-full inline-block border border-primary-200/50">
                  {ent.bestFor}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick answer (uses array-friendly TLDR text only) */}
      {(comparison.quickAnswer?.tldr || comparison.shortAnswer) && (
        <section id="verdict" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200/40 rounded-xl p-5">
            <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-2">Quick Answer</p>
            <p className="text-base sm:text-lg text-text font-medium leading-relaxed">
              {comparison.quickAnswer?.tldr || comparison.shortAnswer}
            </p>
          </div>
        </section>
      )}

      {comparison.citationStats && <CitationStatsBar stats={comparison.citationStats} />}

      {/* Below the fold */}
      <div className="max-w-7xl mx-auto lg:flex lg:gap-8 lg:px-8">
        <div className="flex-1 min-w-0">
          {/* MultiComparisonTable — main N-entity attribute grid */}
          {comparison.attributes.length > 0 && (
            <div id="comparison-table">
              <MultiComparisonTable
                attributes={comparison.attributes}
                entities={comparison.entities}
              />
            </div>
          )}

          {/* Pros & Cons (already array-friendly, renders all N entities) */}
          <div id="pros-cons">
            <ProsConsBlock entities={comparison.entities} />
          </div>

          {/* Verdict — plain text fallback to avoid 2-entity VerdictCard */}
          {comparison.verdict && (
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <h2 className="text-2xl font-display font-bold text-text mb-3">Verdict</h2>
              <p className="text-base text-text leading-relaxed whitespace-pre-line">{comparison.verdict}</p>
            </section>
          )}

          {/* Newsletter */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <NewsletterSignup source="comparison_inline" referrerSlug={comparison.slug} variant="card" />
          </div>

          {comparison.faqs.length > 0 && (
            <div id="faq">
              <FAQBlock faqs={comparison.faqs} />
            </div>
          )}

          <div id="resources">
            <ResourcesSection
              resources={generateResources(comparison.slug, comparison.entities)}
              entities={comparison.entities}
            />
          </div>
        </div>

        {sidebarComparisons.length > 0 && (
          <RelatedComparisonsSidebar
            comparisons={sidebarComparisons}
            sourceSlug={slug}
            variant="desktop"
          />
        )}
      </div>

      <InContentAd />

      <SmartReviewLinks
        entities={comparison.entities.map((e) => ({ name: e.name, slug: e.slug }))}
      />

      {comparison.relatedComparisons.length > 0 && (
        <RelatedComparisons comparisons={comparison.relatedComparisons} sourceSlug={slug} />
      )}

      <RelatedBlogPosts posts={comparison.relatedBlogPosts} />

      <InternalLinks
        currentSlug={comparison.slug}
        category={comparison.category}
        entities={comparison.entities.map((e) => ({ name: e.name, slug: e.slug }))}
        relatedComparisons={comparison.relatedComparisons}
      />

      <NewsletterSignup source="comparison" referrerSlug={comparison.slug} />

      <div id="comments">
        <CommentSection comparisonId={comparison.id} comparisonTitle={comparison.title} />
      </div>

      <FreshnessFooter metadata={comparison.metadata} />

      <ConversionFunnelTracker slug={slug} category={comparison.category || "general"} />
    </>
  );
}
