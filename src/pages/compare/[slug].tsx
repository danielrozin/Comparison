import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { getComparisonBySlug, getTrendingComparisons } from "@/lib/services/comparison-service";
import { comparisonPageSchema, jsonLdGraph, videoObjectSchema, type ComparisonVoteData } from "@/lib/seo/schema";
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
import { Breadcrumbs } from "@/components/comparison/Breadcrumbs";
import { VerdictCard } from "@/components/comparison/VerdictCard";
import { KeyDifferencesSummary } from "@/components/comparison/KeyDifferencesSummary";
import { ShortAnswerBlock } from "@/components/comparison/ShortAnswerBlock";
import { InContentAd } from "@/components/ads/AdUnit";
import { SmartReviewLinks } from "@/components/comparison/SmartReviewLinks";
import { QuickAnswerTLDR } from "@/components/comparison/QuickAnswerTLDR";
import { CitationStatsBar } from "@/components/comparison/CitationStatsBar";
import { DataFactsTable } from "@/components/comparison/DataFactsTable";
import { getVideoMetadata } from "@/lib/services/video-service";
import type { RelatedComparison } from "@/types";

// DAN-432 Phase C: /compare/[slug] served by the Pages Router.
//
// WHY: under App Router every crawlable byte was serialized twice — once as the
// SSR DOM and again into the inline RSC flight (`self.__next_f.push(...)`,
// ~103 KB). Phase A's inert HTML islands collapsed each section's flight
// *encoding* but the HTML strings still appeared in both the DOM and the flight,
// so the duplication remained. Pages Router renders the SSR DOM once and ships a
// single compact `__NEXT_DATA__` props blob (the ~4 KB comparison data object)
// for hydration — no streamed RSC, no second copy of the rendered tree.
//
// The rendered DOM is intentionally kept identical to the verified Phase A
// output: the former island sections are now plain SSR'd components (same markup,
// they were never interactive), below-fold heavy sections stay SSR'd via
// `dynamic()` (default ssr:true), and the interactive/analytics widgets stay out
// of SSR via the shared `ComparisonClientWidgets` shim (ssr:false).

// Below-fold heavy sections — code-split but kept in SSR DOM (crawlable).
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
const RelatedComparisonsSidebar = dynamic(
  () => import("@/components/comparison/RelatedComparisonsSidebar").then((m) => ({ default: m.RelatedComparisonsSidebar })),
  { loading: () => null }
);

// Interactive/tracking widgets — kept out of SSR HTML (ssr:false shim, shared
// verbatim with the former App Router route).
import {
  TrackRecentView,
  EmbedButton,
  ComparisonPoll,
  NewsletterSignup,
  CommentSection,
  VersionHistory,
  StickyAffiliateCTA,
  ConversionFunnelTracker,
  ShareBar,
  LikeButton,
  BackToResults,
  TableOfContents,
} from "@/components/comparison/ComparisonClientWidgets";

type Comparison = NonNullable<Awaited<ReturnType<typeof getComparisonBySlug>>>;

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: "article" | "website";
  publishedTime?: string;
  modifiedTime?: string;
}

type Props =
  | {
      kind: "comparison";
      slug: string;
      comparison: Comparison;
      sidebarComparisons: RelatedComparison[];
      videoMeta: ReturnType<typeof getVideoMetadata>;
      jsonLd: string;
      meta: PageMeta;
    }
  | {
      kind: "dynamic";
      slug: string;
      meta: PageMeta;
    };

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

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllMockSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug || "");

  // Validate slug format — must be "entity-a-vs-entity-b"
  const slugParts = parseComparisonSlug(slug);
  if (!slugParts || !slugParts.entityA || !slugParts.entityB) {
    return { notFound: true };
  }

  let comparison: Comparison | null = null;
  try {
    comparison = (await getComparisonBySlug(slug)) as Comparison | null;
  } catch {
    comparison = null;
  }

  // Unknown slug → client-side dynamic generation (same fallback as before).
  if (!comparison) {
    const parts = slug.split("-vs-");
    const a = parts[0]?.replace(/-/g, " ") || "";
    const b = parts[1]?.replace(/-/g, " ") || "";
    const title = `${capitalize(a)} vs ${capitalize(b)}`;
    const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&a=${encodeURIComponent(capitalize(a))}&b=${encodeURIComponent(capitalize(b))}&type=comparison`;
    return {
      props: {
        kind: "dynamic",
        slug,
        meta: {
          title: `${title} | A Versus B`,
          description: `Compare ${capitalize(a)} and ${capitalize(b)} — key differences, pros & cons, and verdict.`,
          canonical: `${SITE_URL}/compare/${slug}`,
          ogImage,
          ogType: "website",
        },
      },
      revalidate: 3600,
    };
  }

  const voteData = await getComparisonVotes(comparison.id);
  const schemas = comparisonPageSchema(comparison, voteData);
  const videoMeta = getVideoMetadata(slug);

  // Enrich entities with images (Wikipedia/Clearbit) + affiliate links in parallel
  const [entitiesWithImages, entitiesWithAffiliates] = await Promise.all([
    enrichEntitiesWithImages(comparison.entities),
    enrichEntitiesWithAffiliateLinks(comparison.entities, comparison.category),
  ]);

  const mergedEntities = entitiesWithAffiliates.map((e, i) => ({
    ...e,
    imageUrl: entitiesWithImages[i]?.imageUrl || e.imageUrl,
  }));

  const enrichedComparison = { ...comparison, entities: mergedEntities } as Comparison;

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

  const entityA = enrichedComparison.entities[0]?.name || "";
  const entityB = enrichedComparison.entities[1]?.name || "";
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(enrichedComparison.title)}&a=${encodeURIComponent(entityA)}&b=${encodeURIComponent(entityB)}&cat=${encodeURIComponent(enrichedComparison.category || "")}&type=comparison`;
  const fallbackDescription = enrichedComparison.shortAnswer
    || `${entityA} vs ${entityB} — compare key differences, pros & cons, features, and find which is best for you.`;

  const jsonLd = JSON.stringify(
    jsonLdGraph([
      ...schemas,
      videoMeta?.youtubeVideoId
        ? videoObjectSchema({
            slug,
            title: enrichedComparison.title,
            description: enrichedComparison.shortAnswer || enrichedComparison.metadata.metaDescription || "",
            youtubeVideoId: videoMeta.youtubeVideoId,
            uploadDate: videoMeta.uploadedAt,
            entityA: videoMeta.entityA,
            entityB: videoMeta.entityB,
          })
        : null,
    ])
  );

  const meta: PageMeta = {
    title: enrichedComparison.metadata.metaTitle || enrichedComparison.title,
    description: enrichedComparison.metadata.metaDescription || fallbackDescription,
    canonical: `${SITE_URL}/compare/${slug}`,
    ogImage,
    ogType: "article",
    publishedTime: enrichedComparison.metadata.publishedAt || undefined,
    modifiedTime: enrichedComparison.metadata.updatedAt,
  };

  // JSON-sanitize: getStaticProps forbids `undefined` in props.
  const props: Props = JSON.parse(
    JSON.stringify({
      kind: "comparison",
      slug,
      comparison: enrichedComparison,
      sidebarComparisons,
      videoMeta,
      jsonLd,
      meta,
    })
  );

  return { props, revalidate: 3600 };
};

function MetaHead({ meta }: { meta: PageMeta }) {
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={meta.canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:type" content={meta.ogType} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {meta.publishedTime && <meta property="article:published_time" content={meta.publishedTime} />}
      {meta.modifiedTime && <meta property="article:modified_time" content={meta.modifiedTime} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />
    </Head>
  );
}

export default function ComparisonPage(props: Props) {
  if (props.kind === "dynamic") {
    return (
      <>
        <MetaHead meta={props.meta} />
        <DynamicComparison slug={props.slug} />
      </>
    );
  }

  const { comparison, slug, sidebarComparisons, videoMeta, jsonLd } = props;

  return (
    <>
      <MetaHead meta={props.meta} />

      {/* Schema markup — all page schemas (+ optional VideoObject) consolidated
          into a single @graph block. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* Track recently viewed */}
      <TrackRecentView slug={slug} title={comparison.title} category={comparison.category || ""} />

      {/* Back to search results */}
      <BackToResults />

      {/* Breadcrumbs */}
      <Breadcrumbs title={comparison.title} slug={comparison.slug} category={comparison.category} />

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

      {/* Citation Stats Bar */}
      {comparison.citationStats && <CitationStatsBar stats={comparison.citationStats} />}

      {/* Quick Answer TL;DR — above the fold, GEO-optimized. */}
      {comparison.quickAnswer?.tldr && (
        <div id="verdict">
          <QuickAnswerTLDR
            quickAnswer={comparison.quickAnswer}
            entityA={comparison.entities[0]}
            entityB={comparison.entities[1]}
          />
        </div>
      )}

      {/* Short Answer Block — fallback when no quickAnswer */}
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
          entities={comparison.entities.map((e) => ({ name: e.name, imageUrl: e.imageUrl, position: e.position }))}
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

      {/* Key Facts & Figures table */}
      {comparison.attributes.length > 0 && (
        <div id="key-facts">
          <DataFactsTable
            attributes={comparison.attributes}
            entityA={comparison.entities[0]}
            entityB={comparison.entities[1]}
          />
        </div>
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

          {/* Comparison Table (code-split, SSR'd) */}
          {comparison.attributes.length > 0 && (
            <div id="comparison-table">
              <ComparisonTable
                attributes={comparison.attributes}
                entityA={comparison.entities[0]}
                entityB={comparison.entities[1]}
              />
            </div>
          )}

          {/* Visual Comparison Charts (code-split, SSR'd) */}
          {comparison.attributes.some((a) => a.values.some((v) => v.valueNumber != null)) && (
            <ComparisonCharts
              attributes={comparison.attributes}
              entityA={comparison.entities[0]}
              entityB={comparison.entities[1]}
            />
          )}

          {/* Video Comparison */}
          <ComparisonVideoPlayer slug={comparison.slug} title={comparison.title} youtubeVideoId={videoMeta?.youtubeVideoId || undefined} />

          {/* Pros & Cons */}
          <div id="pros-cons">
            <ProsConsBlock entities={comparison.entities} />
          </div>

          {/* Inline Newsletter Signup */}
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
          <RelatedComparisonsSidebar comparisons={sidebarComparisons} sourceSlug={slug} variant="desktop" />
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
      <SmartReviewLinks entities={comparison.entities.map((e) => ({ name: e.name, slug: e.slug }))} />

      {/* Related Comparisons (bottom grid, kept for SEO internal links) */}
      {comparison.relatedComparisons.length > 0 && (
        <RelatedComparisons comparisons={comparison.relatedComparisons} sourceSlug={slug} />
      )}

      {/* Related Blog Posts */}
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
      <StickyAffiliateCTA entities={comparison.entities} category={comparison.category} slug={slug} />

      {/* Conversion Funnel Tracking */}
      <ConversionFunnelTracker slug={slug} category={comparison.category || "general"} />
    </>
  );
}

function FreshnessFooter({ metadata }: { metadata: { updatedAt: string; isHumanReviewed: boolean; isAutoGenerated: boolean } }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-text-secondary">
      Last updated: {new Date(metadata.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
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
