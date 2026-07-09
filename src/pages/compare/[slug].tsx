import type { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { getComparisonBySlug, getTrendingComparisons, saveComparison } from "@/lib/services/comparison-service";
import { generateComparison, generateMultiComparison } from "@/lib/services/ai-comparison-generator";
import {
  startAttempt,
  finishAttemptSuccess,
  finishAttemptFailure,
  evaluateAttemptGuard,
  type AttemptStage,
} from "@/lib/services/generation-attempt-tracker";
import { comparisonPageSchema, jsonLdGraph, videoObjectSchema, selfHostedVideoObjectSchema, claimReviewSchema, webPageSchema, type ComparisonVoteData } from "@/lib/seo/schema";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL } from "@/lib/utils/constants";
import { buildPageTitle, clampDescription } from "@/lib/seo/metadata";
import { ComparisonHero } from "@/components/comparison/ComparisonHero";
import { KeyDifferencesBlock } from "@/components/comparison/KeyDifferences";
import { ProsConsBlock } from "@/components/comparison/ProsCons";
import { FAQBlock } from "@/components/comparison/FAQ";
import { RelatedComparisons } from "@/components/comparison/RelatedComparisons";
import { RelatedBlogPosts } from "@/components/comparison/RelatedBlogPosts";
// DAN-1724: DynamicComparison is a pure client widget (generates content via
// fetch, uses Math.random for fun facts). Loading it ssr:false eliminates the
// SSR → hydration mismatch that caused "Application error" when Prisma was
// unavailable and getStaticProps fell back to kind:"dynamic".
const DynamicComparison = dynamic(
  () => import("@/components/comparison/DynamicComparison").then((m) => ({ default: m.DynamicComparison })),
  { ssr: false, loading: () => null }
);
import { DeferUntilVisible } from "@/components/comparison/DeferUntilVisible";
import { InternalLinks } from "@/components/comparison/InternalLinks";
import { ResourcesSection } from "@/components/comparison/ResourcesSection";
import { PartnerReviews } from "@/components/comparison/PartnerReviews";
import { generateResources } from "@/lib/services/resources";
import { getPartnerReviews } from "@/lib/data/partner-reviews";
import { enrichEntitiesWithAffiliateLinks } from "@/lib/services/affiliate";
import { enrichEntitiesWithImages } from "@/lib/services/image-service";
import { getAllMockSlugs } from "@/lib/services/mock-data";
import {
  parseComparisonSlug,
  sortComparisonSlug,
  isDegenerateComparisonSlug,
} from "@/lib/utils/slugify";
import { humanizeEntityName } from "@/lib/utils/humanize";
import { Breadcrumbs } from "@/components/comparison/Breadcrumbs";
import { VerdictCard } from "@/components/comparison/VerdictCard";
import { TrackComparisonCard } from "@/components/comparison/TrackComparisonCard";
import { KeyDifferencesSummary } from "@/components/comparison/KeyDifferencesSummary";
import { ShortAnswerBlock } from "@/components/comparison/ShortAnswerBlock";
import { InContentAd } from "@/components/ads/AdUnit";
import { SmartReviewLinks, type SmartReviewEntry } from "@/components/comparison/SmartReviewLinks";
import { getEntityAggregation } from "@/lib/services/review-service";
import { QuickAnswerTLDR } from "@/components/comparison/QuickAnswerTLDR";
import { CitationStatsBar } from "@/components/comparison/CitationStatsBar";
import { DataFactsTable } from "@/components/comparison/DataFactsTable";
import { getVideoMetadata } from "@/lib/services/video-service";
import { selfHostedVideoExists, selfHostedVideoUploadDate } from "@/lib/services/self-hosted-video";
import type { RelatedComparison } from "@/types";

// DAN-432 Phase C: /compare/[slug] served by the Pages Router.
//
// WHY: under App Router every crawlable byte was serialized twice — once as the
// SSR DOM and again into the inline RSC flight (`self.__next_f.push(...)`,
// ~103 KB). Phase A's inert HTML islands collapsed each section's flight
// *encoding* but the HTML strings still appeared in both the DOM and the flight,
// so the duplication remained. Pages Router renders the SSR DOM once and ships a
// single compact `__NEXT_DATA__` props blob for hydration — no streamed RSC, no
// second copy of the rendered tree.
//
// The rendered DOM is intentionally kept identical to the verified App Router
// output: the former island sections are now plain SSR'd components (same markup,
// they were never interactive), below-fold heavy sections stay SSR'd via
// `dynamic()` (default ssr:true), and the interactive/analytics widgets stay out
// of SSR via the shared `ComparisonClientWidgets` shim (ssr:false). Multi-entity
// (3+) pages keep the same MultiEntityLayout main shipped under App Router.

// Below-fold heavy sections — code-split but kept in SSR DOM (crawlable).
const ComparisonTable = dynamic(
  () => import("@/components/comparison/ComparisonTable").then((m) => ({ default: m.ComparisonTable })),
  { loading: () => <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse"><div className="h-64 bg-surface-alt rounded-xl" /></div> }
);
const MultiComparisonTable = dynamic(
  () => import("@/components/comparison/MultiComparisonTable").then((m) => ({ default: m.MultiComparisonTable })),
  { loading: () => <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse"><div className="h-64 bg-surface-alt rounded-xl" /></div> }
);
// DAN-1642: recharts is the single largest client chunk (~115 KB, ~90 KB unused)
// and its hydration dominated main-thread script evaluation on this route
// (framework chunk ~8s scripting on throttled mobile → TBT 2.5s, TTI 10s, LCP
// 4.1s). Charts are a purely visual restatement of the numeric data already
// crawlable in ComparisonTable/DataFactsTable, so they carry no SEO weight.
// Load client-only (ssr:false) and gate behind DeferUntilVisible so recharts
// downloads + mounts only when the section nears the viewport — off the initial
// hydration / LCP path entirely.
const ComparisonCharts = dynamic(
  () => import("@/components/comparison/ComparisonCharts").then((m) => ({ default: m.ComparisonCharts })),
  { ssr: false, loading: () => <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse"><div className="h-48 bg-surface-alt rounded-xl" /></div> }
);
// DAN-1645: the video player is a purely interactive client widget — its SSR
// output is just an empty aspect-video placeholder (the crawlable VideoObject is
// emitted separately in JSON-LD), so it carries no SEO weight. Load client-only
// (ssr:false) and gate behind DeferUntilVisible so its chunk downloads + mounts
// only near the viewport, off the initial hydration / LCP path (recharts pattern).
const ComparisonVideoPlayer = dynamic(
  () => import("@/components/comparison/ComparisonVideoPlayer").then((m) => ({ default: m.ComparisonVideoPlayer })),
  { ssr: false, loading: () => null }
);
const RelatedComparisonsSidebar = dynamic(
  () => import("@/components/comparison/RelatedComparisonsSidebar").then((m) => ({ default: m.RelatedComparisonsSidebar })),
  { loading: () => null }
);

const ReadingProgressBar = dynamic(
  () => import("@/components/blog/ReadingProgressBar").then((m) => ({ default: m.ReadingProgressBar })),
  { ssr: false, loading: () => null }
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
  InterceptSurvey,
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
  // article:* OG tags — entity names + category for social graph AEO signals
  articleSection?: string;
  articleTags?: string[];
  // twitter:label/data — structured stat labels shown in Twitter/X link preview cards
  twitterLabel1?: string;
  twitterData1?: string;
  twitterLabel2?: string;
  twitterData2?: string;
  // og:see_also — related comparison URLs for AI crawler graph traversal
  seeAlsoUrls?: string[];
}

type Props =
  | {
      kind: "comparison";
      slug: string;
      comparison: Comparison;
      sidebarComparisons: RelatedComparison[];
      smartReviews: SmartReviewEntry[];
      videoMeta: ReturnType<typeof getVideoMetadata>;
      hasSelfHostedVideo: boolean;
      jsonLd: string;
      claimReviewJsonLd: string | null;
      meta: PageMeta;
    }
  | {
      kind: "dynamic";
      slug: string;
      meta: PageMeta;
    };

// Hand-written CTR rewrites for high-volume defective pages (DAN-1144 Bug 4).
// These slugs had weak/auto-generated titles (and sometimes descriptions); the
// copy here is pre-optimized. Still piped through buildPageTitle/clampDescription
// so the single-brand and length invariants hold (buildPageTitle is a no-op on
// the already-clean brand suffix). `description` is optional — omit it to keep an
// already-good stored metaDescription and only swap the weak <title> (DAN-1281).
const META_OVERRIDES: Record<string, { title: string; description?: string }> = {
  "figma-vs-canva": {
    title: "Figma vs Canva 2026: Which Design Tool Wins? | A Versus B",
    description:
      "Figma vs Canva compared: design power vs ease of use, pricing, templates and collaboration. See which design tool fits your team in 2026.",
  },
  "slack-vs-teams": {
    title: "Slack vs Teams 2026: Features, Price & Verdict | A Versus B",
    description:
      "Slack vs Microsoft Teams compared: messaging, video, integrations and pricing. See which team chat app wins for your workflow in 2026.",
  },
  // DAN-1281: title-only CTR swaps (year + verdict hook). Descriptions audited as
  // already good — left untouched. The legacy `iphone-15-vs-16` override was
  // removed: that slug now 308s at the edge to the canonical iphone-15-vs-iphone-16
  // (compare-redirects.ts), so this page never renders.
  "ansible-vs-chef": {
    title: "Ansible vs Chef 2026: Which Config Tool Wins? | A Versus B",
  },
  "cold-war-vs-world-war-ii": {
    title: "Cold War vs WWII: Causes, Deaths & Impact | A Versus B",
  },
  "figma-vs-invision": {
    title: "InVision vs Figma 2026: Prototyping & Price | A Versus B",
  },
  "metlife-vs-state-farm": {
    title: "MetLife vs State Farm 2026: Which Insurer Wins? | A Versus B",
  },
  "miro-vs-mural": {
    title: "Miro vs Mural 2026: Pricing, AI & Features | A Versus B",
  },
};

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

// Budget for on-demand server-side generation inside getStaticProps. Kept under
// Vercel's function ceiling; on timeout we fall back to the client-only shell so
// the request never hangs. Matches the route's 60s `maxDuration` headroom.
const SSR_GENERATION_BUDGET_MS = 45000;

/**
 * DAN-1146 — Defense-in-depth SSR for un-ingested `/compare/*` slugs.
 *
 * When `getComparisonBySlug` returns null (no DB row), the page previously
 * shipped a `"use client"` shell with an empty SSR DOM — crawler-invisible thin
 * content and $0 SSR monetization on the highest-affiliate-value category.
 *
 * Here we generate the comparison server-side (same generator the client
 * `/api/comparisons/generate` route uses), persist it best-effort so the next
 * crawl is DB-backed and fully linked, and return a `ComparisonPageData` so the
 * full SSR layout (incl. the DAN-1140 brand-homepage affiliate CTAs) renders in
 * raw HTML. Any failure (missing API key, timeout, generation error) returns
 * null and the caller falls back to the existing client shell — so this strictly
 * improves on the prior behavior and never regresses it.
 *
 * Runs only at request time: `getStaticPaths` uses `fallback: "blocking"`, so
 * un-ingested slugs are never generated during `next build`.
 */
async function generateComparisonForSSR(
  slug: string,
  entitySlugParts: string[]
): Promise<Comparison | null> {
  if (process.env.DISABLE_SSR_FALLBACK_GENERATION === "1") return null;

  const entityNames = entitySlugParts.map((p) => p.replace(/-/g, " "));
  const isMulti = entityNames.length > 2;

  try {
    const result = await Promise.race([
      isMulti
        ? generateMultiComparison(entityNames, slug)
        : generateComparison(entityNames[0], entityNames[1], slug),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), SSR_GENERATION_BUDGET_MS)),
    ]);

    if (!result || !result.success || !result.comparison) return null;

    // Persist best-effort so the next request is DB-backed (self-healing
    // ingestion). A save failure (e.g. read-only clone DB) is non-fatal — we
    // still return the generated comparison for a one-shot full SSR render.
    try {
      await saveComparison(result.comparison);
      // Re-fetch so the comparison carries linking-engine relatedComparisons +
      // relatedBlogPosts, identical to the natively DB-backed path.
      const refetched = (await getComparisonBySlug(slug)) as Comparison | null;
      if (refetched) return refetched;
    } catch (saveErr) {
      console.warn("SSR-fallback: saveComparison failed, serving generated copy:", saveErr);
    }

    return result.comparison as Comparison;
  } catch (err) {
    console.warn("SSR-fallback generation failed, using client shell:", err);
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

// DAN-1285: append a VideoObject node into an existing @graph JSON-LD document
// (editorial schemaMarkup or the multi-entity @graph) without disturbing its
// other nodes. The node's @context is stripped since it lives inside @graph.
function appendVideoToGraph(
  doc: Record<string, unknown>,
  video: Record<string, unknown> | null,
): Record<string, unknown> {
  if (!video) return doc;
  const { ["@context"]: _ctx, ...videoNode } = video;
  if (Array.isArray(doc["@graph"])) {
    return { ...doc, "@graph": [...(doc["@graph"] as unknown[]), videoNode] };
  }
  // Not a @graph document — wrap the existing doc and the video into one.
  return jsonLdGraph([doc, video]);
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = String(params?.slug || "");

  // Validate slug format — must be "entity-a-vs-entity-b" (or N-way: "a-vs-b-vs-c-...")
  const slugParts = parseComparisonSlug(slug);
  if (!slugParts || slugParts.entities.length < 2) {
    return { notFound: true };
  }

  // A self-comparison (e.g. `grubhub-vs-grubhub`) is a thin/duplicate-content
  // dead-end — comparing an entity against itself yields no useful page and
  // wastes crawl budget. 404 it so it leaves the index; it is also excluded
  // from the sitemap (DAN: self-comparison crawl-quality guard).
  if (isDegenerateComparisonSlug(slug)) {
    return { notFound: true };
  }

  let comparison: Comparison | null = null;
  try {
    comparison = (await getComparisonBySlug(slug)) as Comparison | null;
  } catch {
    comparison = null;
  }

  // A record that's missing OR exists but is empty/corrupt (fewer than 2
  // entities) is treated the same: the full SSR layout assumes entityA/entityB
  // exist and throws a hard 500 on an empty record (DAN-1201/DAN-1262 follow-up
  // — 25 such records were live in prod). Server-side generation for these slugs
  // is hoisted into the generateComparisonForSSR() helper, invoked below AFTER
  // the DAN-1265 canonical-ordering redirect so non-canonical orderings aren't
  // minted as their own URL. The helper supersedes the older inline DAN-1201
  // block (it adds N-way support, a timeout budget, and the env kill-switch).
  if (!comparison || !comparison.entities || comparison.entities.length < 2) {
    // DAN-1265: a non-canonical ordering (B-vs-A) — whether brand-new or backed
    // by an empty/corrupt record — must never be generated/indexed as its own
    // URL. Send it to the canonical alphabetically-sorted ordering BEFORE any
    // generation so only one page per comparison can exist. (Known retired
    // duplicates are already 301'd at the edge by next.config redirects(); this
    // catches orderings not yet in that map.)
    const sortedSlug = sortComparisonSlug(slug);
    if (sortedSlug !== slug) {
      // DAN-1265 regression guard: only consolidate into the sorted ordering
      // when that ordering is a REAL comparison. sortComparisonSlug() sorts the
      // raw "-vs-" tokens, so a slug whose last entity carries a keyword suffix
      // (e.g. "xbox-series-x-vs-ps5-pro-performance-comparison-2026") sorts the
      // suffix into the middle and yields a non-existent slug
      // ("ps5-pro-performance-comparison-2026-vs-xbox-series-x"). 308-ing there
      // mints a self-canonicalizing thin-shell dead-end and permanently strands
      // the variant's link equity instead of folding it into the canonical. If
      // the sorted target has no valid record, fall through to the dynamic
      // fallback (which self-canonicals at the requested URL) rather than 308 to
      // a slug that does not exist. Genuine B-vs-A reorderings still redirect,
      // because their sorted target resolves to a real page here.
      let canonical: Comparison | null = null;
      try {
        canonical = (await getComparisonBySlug(sortedSlug)) as Comparison | null;
      } catch {
        canonical = null;
      }
      if (canonical && canonical.entities && canonical.entities.length >= 2) {
        return {
          redirect: { destination: `/compare/${sortedSlug}`, permanent: true },
        };
      }
    }

    // Canonical ordering but unknown/empty → attempt server-side generation so
    // crawlers get a full SSR body + affiliate CTAs (DAN-1146). On success we
    // fall through to the normal comparison render path below; on failure we
    // degrade to the crawlable client shell, which also lets the client
    // re-generation path heal the record.
    comparison = await generateComparisonForSSR(slug, slugParts.entities);
  }

  // Still no usable comparison → client-side dynamic generation (same fallback
  // as before).
  if (!comparison || !comparison.entities || comparison.entities.length < 2) {
    const override = META_OVERRIDES[slug];
    const nameParts = slug
      .split("-vs-")
      .map((p) => p.trim())
      .filter(Boolean)
      .map(humanizeEntityName);
    const title = nameParts.join(" vs ");
    const isMulti = nameParts.length > 2;
    const ogImage = isMulti
      ? `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&entities=${encodeURIComponent(nameParts.join("|"))}&type=multi`
      : `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&a=${encodeURIComponent(nameParts[0] || "")}&b=${encodeURIComponent(nameParts[1] || "")}&type=comparison`;
    // buildPageTitle appends the brand suffix exactly once (DAN-1145 Bug 1);
    // clampDescription enforces the meta-length / word-boundary invariant (Bug 3).
    return {
      props: {
        kind: "dynamic",
        slug,
        meta: {
          title: buildPageTitle(override?.title ?? title),
          description: clampDescription(
            override?.description ?? `Compare ${nameParts.join(", ")} — key differences, pros & cons, and verdict.`,
          ),
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

  // DAN-1656: SmartReview aggregations are fetched here (server-side) — the
  // service is Prisma/Redis-backed and must never run on the client. The
  // presentational SmartReviewLinks component receives this as a plain prop and
  // renders synchronously. (Previously it was an async Client Component, which
  // threw React #482 on hydration and crashed every /compare page.)
  const smartReviews: SmartReviewEntry[] = (
    await Promise.all(
      comparison.entities.map(async (e) => {
        try {
          const agg = await getEntityAggregation(e.slug);
          return agg ? { name: e.name, slug: e.slug, agg } : null;
        } catch {
          return null;
        }
      })
    )
  ).filter((x): x is SmartReviewEntry => x !== null);

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

  const isMultiEntity = enrichedComparison.entities.length > 2;
  const entityA = enrichedComparison.entities[0]?.name || "";
  const entityB = enrichedComparison.entities[1]?.name || "";
  const ogImage = isMultiEntity
    ? `${SITE_URL}/api/og?title=${encodeURIComponent(enrichedComparison.title)}&entities=${encodeURIComponent(enrichedComparison.entities.map((e) => e.name).join("|"))}&cat=${encodeURIComponent(enrichedComparison.category || "")}&type=multi`
    : `${SITE_URL}/api/og?title=${encodeURIComponent(enrichedComparison.title)}&a=${encodeURIComponent(entityA)}&b=${encodeURIComponent(entityB)}&cat=${encodeURIComponent(enrichedComparison.category || "")}&type=comparison`;
  // 4-part meta description formula: Problem · Solution · Differentiator · CTA
  // shortAnswer from DB is preferred; fallback constructs a more compelling description
  // that names the year (freshness signal) and ends with a verb-led CTA.
  const currentYear = new Date().getFullYear();
  const fallbackDescription = enrichedComparison.shortAnswer
    || (isMultiEntity
      ? `Can't decide? See ${enrichedComparison.entities.map((e) => e.name).join(" vs ")} compared side-by-side — key differences, pros & cons, and verdict. Get the answer in seconds.`
      : `${entityA} vs ${entityB} ${currentYear}: key differences, pros & cons, features, and a clear verdict. See which is best for you — get the answer in seconds.`);

  // DAN-1285: self-hosted VideoObject. When there's no YouTube upload but a
  // public/videos/<slug>.mp4 exists (ComparisonVideoPlayer HEAD-checks and
  // self-hosts it client-side, so the URL never appears in static HTML), emit a
  // VideoObject whose contentUrl → the already-served mp4 so Google Video / AI
  // Overviews can index it. Credential-independent of the YouTube path
  // (DAN-1197). Only emitted when the file is present so contentUrl never 404s.
  const selfHostedVideo =
    !videoMeta?.youtubeVideoId && selfHostedVideoExists(slug)
      ? selfHostedVideoObjectSchema({
          slug,
          title: enrichedComparison.title,
          description:
            enrichedComparison.shortAnswer ||
            enrichedComparison.verdict ||
            enrichedComparison.metadata.metaDescription ||
            fallbackDescription,
          // thumbnailUrl is REQUIRED by Google — reuse the per-page OG image.
          thumbnailUrl: ogImage,
          uploadDate:
            selfHostedVideoUploadDate(slug) ||
            enrichedComparison.metadata.publishedAt ||
            enrichedComparison.metadata.updatedAt,
        })
      : null;

  // JSON-LD: prefer the validated editorial @graph (comparison.schemaMarkup) when
  // present. Otherwise: N>=3 pages already get a single consolidated @graph from
  // comparisonPageSchema (schema-3way v1), so emit it directly; 2-entity pages get
  // the DAN-432 jsonLdGraph consolidation. The self-hosted VideoObject (DAN-1285)
  // is folded into whichever document the page emits.
  let jsonLd: string;
  if (enrichedComparison.schemaMarkup) {
    jsonLd = JSON.stringify(appendVideoToGraph(enrichedComparison.schemaMarkup, selfHostedVideo));
  } else if (isMultiEntity) {
    jsonLd = JSON.stringify(appendVideoToGraph(schemas[0], selfHostedVideo));
  } else {
    jsonLd = JSON.stringify(
      jsonLdGraph([
        ...schemas,
        webPageSchema({
          title: enrichedComparison.metadata.metaTitle ?? enrichedComparison.title,
          description: enrichedComparison.metadata.metaDescription ?? fallbackDescription,
          url: `${SITE_URL}/compare/${slug}`,
          datePublished: enrichedComparison.metadata.publishedAt ?? undefined,
          dateModified: enrichedComparison.metadata.updatedAt ?? undefined,
          keywords: [
            ...enrichedComparison.entities.map((e) => e.name),
            "comparison",
            "versus",
            ...(enrichedComparison.category ? [enrichedComparison.category] : []),
          ].join(", "),
          // mainEntity — bidirectional WebPage↔Article graph edge (HB322 fix).
          mainEntity: { "@type": "Article", "@id": `${SITE_URL}/compare/${slug}#article` },
          speakableCssSelector: ["h1", "#hero-tldr", "#short-answer", "#verdict", "#key-differences", "#comparison-table"],
        }),
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
          : selfHostedVideo,
      ])
    );
  }

  // buildPageTitle strips any pre-existing brand suffix / redundant "| Comparison"
  // segment, then appends the brand once (DAN-1145 Bug 1 + Bug 2); clampDescription
  // clamps at a word boundary instead of mid-word (Bug 3). META_OVERRIDES supplies
  // hand-written CTR copy for known-defective high-volume pages (DAN-1144 Bug 4).
  const override = META_OVERRIDES[slug];
  const meta: PageMeta = {
    title: buildPageTitle(override?.title ?? enrichedComparison.metadata.metaTitle ?? enrichedComparison.title),
    description: clampDescription(
      override?.description ?? enrichedComparison.metadata.metaDescription ?? fallbackDescription,
    ),
    canonical: `${SITE_URL}/compare/${slug}`,
    ogImage,
    ogType: "article",
    publishedTime: enrichedComparison.metadata.publishedAt || undefined,
    modifiedTime: enrichedComparison.metadata.updatedAt,
    // article:section = category (e.g. "Software", "Technology")
    articleSection: enrichedComparison.category
      ? enrichedComparison.category.charAt(0).toUpperCase() + enrichedComparison.category.slice(1)
      : undefined,
    // article:tag = entity names + "comparison" + category for social/AI graph signals
    articleTags: [
      ...enrichedComparison.entities.map((e) => e.name),
      "comparison",
      "versus",
      ...(enrichedComparison.category ? [enrichedComparison.category] : []),
    ],
    // twitter:label/data — structured stat labels rendered in Twitter/X link preview cards.
    // X shows these as two key-value pairs below the card description, surfacing comparison
    // stats at a glance. Bing and LinkedIn also parse these for structured snippet extraction.
    twitterLabel1: "Category",
    twitterData1: enrichedComparison.category
      ? enrichedComparison.category.charAt(0).toUpperCase() + enrichedComparison.category.slice(1)
      : "Comparison",
    twitterLabel2: enrichedComparison.citationStats?.sourceCount
      ? "Sources"
      : enrichedComparison.metadata.viewCount
      ? "Views"
      : "Attributes",
    twitterData2: enrichedComparison.citationStats?.sourceCount
      ? String(enrichedComparison.citationStats.sourceCount)
      : enrichedComparison.metadata.viewCount
      ? enrichedComparison.metadata.viewCount.toLocaleString()
      : String(enrichedComparison.attributes.length),
    // og:see_also — up to 5 related comparison URLs.
    // AI crawlers (Perplexity, ChatGPT browse, Gemini) follow og:see_also links
    // to discover semantically related pages and build entity-relationship graphs.
    seeAlsoUrls: sidebarComparisons
      .slice(0, 5)
      .map((c) => `${SITE_URL}/compare/${c.slug}`),
  };

  // ClaimReview schema — only for 2-entity comparisons with a clear verdict winner
  const claimReviewJsonLd: string | null =
    !isMultiEntity && enrichedComparison.verdict && entityA && entityB && enrichedComparison.shortAnswer
      ? JSON.stringify(
          claimReviewSchema({
            slug,
            title: enrichedComparison.title,
            entityA,
            entityB,
            verdict: enrichedComparison.verdict,
            shortAnswer: enrichedComparison.shortAnswer,
            datePublished: enrichedComparison.metadata.publishedAt
              ? new Date(enrichedComparison.metadata.publishedAt).toISOString().slice(0, 10)
              : undefined,
            dateModified: enrichedComparison.metadata.updatedAt
              ? new Date(enrichedComparison.metadata.updatedAt).toISOString().slice(0, 10)
              : undefined,
          })
        )
      : null;

  // JSON-sanitize: getStaticProps forbids `undefined` in props.
  const props: Props = JSON.parse(
    JSON.stringify({
      kind: "comparison",
      slug,
      comparison: enrichedComparison,
      sidebarComparisons,
      smartReviews,
      videoMeta,
      hasSelfHostedVideo: !!selfHostedVideo,
      jsonLd,
      claimReviewJsonLd,
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
      {/* author — used by Bing, Yahoo, and AI content attributors for authorship resolution */}
      <meta name="author" content="A Versus B" />
      {/* coverage/distribution/rating — classic HTML meta; Bing, Yandex, and AI content
          classifiers use these to confirm global availability and safe-search eligibility */}
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      <link rel="canonical" href={meta.canonical} />
      {/* cite-as — W3C cite-as in HTML <head> makes the preferred citation URL visible to
          HTML parsers that don't read HTTP Link headers (complements the Link: header set by
          middleware). Perplexity, ChatGPT browse, and Gemini all use cite-as for attribution. */}
      <link rel="cite-as" href={meta.canonical} />
      {/* license — standard HTML link tag for CC BY 4.0; AI citation engines (Semantic Scholar,
          Perplexity, Google AI Overview) use this to confirm content is freely citable. */}
      <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
      {/* content-language — HTML <meta> complements the HTTP Content-Language: en header set
          by middleware; ensures language is declared for HTML snapshot tools that don't inspect
          HTTP headers (Common Crawl, Internet Archive, some AI training pipelines). */}
      <meta httpEquiv="content-language" content="en" />
      {/* JSON API alternate — lets AI crawlers and developer tools discover structured data */}
      <link rel="alternate" type="application/json" href={`https://www.aversusb.net/api/comparisons/${meta.canonical.split("/compare/")[1] ?? ""}`} title="Structured comparison data (JSON)" />
      {/* Pure Schema.org JSON-LD — spec-compliant application/ld+json for Semantic Web tools,
          RDF clients, and AI crawlers doing Accept: application/ld+json content negotiation */}
      <link rel="alternate" type="application/ld+json" href={`https://www.aversusb.net/api/v1/schema/${meta.canonical.split("/compare/")[1] ?? ""}`} title="Schema.org JSON-LD (pure)" />
      {/* JSON-LD knowledge graph — richer format with extra metadata fields for developer tools */}
      <link rel="alternate" type="application/ld+json" href={`https://www.aversusb.net/api/knowledge-graph/${meta.canonical.split("/compare/")[1] ?? ""}`} title="Structured comparison knowledge graph (JSON-LD)" />
      {/* oEmbed — Slack, Discord, Notion, LinkedIn and AI assistants use this to render
          rich comparison cards when a user pastes an aversusb.net URL */}
      <link rel="alternate" type="application/json+oembed" href={`https://www.aversusb.net/api/oembed?url=${encodeURIComponent(meta.canonical)}&format=json`} title={meta.title} />
      {/* FAQ API — structured Q&A pairs; AI answer engines use this for direct Q&A extraction */}
      <link rel="alternate" type="application/json" href={`https://www.aversusb.net/api/faq/${meta.canonical.split("/compare/")[1] ?? ""}`} title="Structured FAQ pairs (JSON)" />
      {/* Answer API — pre-packaged citation-ready answer for AI tools */}
      <link rel="alternate" type="application/json" href={`https://www.aversusb.net/api/answer/${meta.canonical.split("/compare/")[1] ?? ""}`} title="AI Answer (citation-ready)" />
      {/* describedby — Linked Data HTML best practice (RFC 5988 §5, HTML5 §4.8.6).
          Tells any HTML parser (not just HTTP header readers) that the JSON-LD endpoint
          is the machine-readable description of this page. Supplements the Link header
          emitted by middleware; visible to Googlebot, GPTBot, PerplexityBot without
          requiring HTTP header parsing. */}
      <link rel="describedby" type="application/ld+json" href={`https://www.aversusb.net/api/v1/schema/${meta.canonical.split("/compare/")[1] ?? ""}`} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:type" content={meta.ogType} />
      <meta property="og:site_name" content="A Versus B" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:image:secure_url" content={meta.ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {meta.publishedTime && <meta property="article:published_time" content={meta.publishedTime} />}
      {meta.modifiedTime && <meta property="article:modified_time" content={meta.modifiedTime} />}
      {meta.modifiedTime && <meta property="og:updated_time" content={meta.modifiedTime} />}
      {meta.articleSection && <meta property="article:section" content={meta.articleSection} />}
      <meta property="article:author" content={`${SITE_URL}/authors/daniel-rozin`} />
      {/* rel=up — HTML hierarchy signal; tells AI crawlers this comparison belongs to a
          specific category, enabling topical authority context without following breadcrumbs */}
      {meta.articleSection && (
        <link rel="up" href={`https://www.aversusb.net/category/${meta.articleSection.toLowerCase().replace(/[\s_]+/g, "-")}`} title={`${meta.articleSection} comparisons`} />
      )}
      {/* article:tag — entity names + comparison terms for Open Graph topic signals.
          Social platforms and AI crawlers (Perplexity social graph, Bing social signals)
          use article:tag to build topic affinity maps for citation selection. */}
      {(meta.articleTags ?? []).map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      {/* og:image:alt — alt text for OG image; used by AI models for image understanding */}
      <meta property="og:image:alt" content={meta.title} />
      {/* thumbnail — Bing rich snippets; also parsed by Apple News and Microsoft Copilot
          to select the preview image when displaying a summary card for this page */}
      <meta name="thumbnail" content={meta.ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@aversusb" />
      <meta name="twitter:creator" content="@aversusb" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />
      <meta name="twitter:image:alt" content={meta.title} />
      {/* twitter:label/data — structured stat pairs in Twitter/X link preview cards.
          Bing and LinkedIn also parse these for structured snippet extraction. */}
      {meta.twitterLabel1 && <meta name="twitter:label1" content={meta.twitterLabel1} />}
      {meta.twitterData1 && <meta name="twitter:data1" content={meta.twitterData1} />}
      {meta.twitterLabel2 && <meta name="twitter:label2" content={meta.twitterLabel2} />}
      {meta.twitterData2 && <meta name="twitter:data2" content={meta.twitterData2} />}
      {/* Academic / AI citation meta tags — Perplexity, Semantic Scholar, and AI research
          crawlers use citation_* and Dublin Core tags to extract citable metadata and
          attribute content to the correct source, increasing structured citation frequency. */}
      <meta name="citation_title" content={meta.title} />
      <meta name="citation_author" content="A Versus B" />
      {meta.publishedTime && <meta name="citation_publication_date" content={meta.publishedTime.slice(0, 10)} />}
      {meta.modifiedTime && <meta name="citation_online_date" content={meta.modifiedTime.slice(0, 10)} />}
      <meta name="citation_journal_title" content="A Versus B" />
      <meta name="citation_abstract" content={meta.description} />
      {/* abstract — standard HTML meta used by Bing/Yahoo and some AI tools to extract
          a short summary without parsing body copy. Same value as citation_abstract. */}
      <meta name="abstract" content={meta.description} />
      <meta name="citation_language" content="en" />
      <meta name="citation_url" content={meta.canonical} />
      {/* citation_fulltext_world_accessible — Google Scholar + Semantic Scholar signal that
          content is freely accessible (no paywall). Increases indexing priority for AI citation. */}
      <meta name="citation_fulltext_world_accessible" content="" />
      <meta name="copyright" content={`© ${new Date().getFullYear()} A Versus B`} />
      {/* Freshness signals — AI crawlers and news aggregators use these to determine
          content age and prioritize recent content for time-sensitive queries */}
      {meta.publishedTime && <meta name="date" content={meta.publishedTime} />}
      {meta.modifiedTime && <meta name="last-modified" content={meta.modifiedTime} />}
      {meta.modifiedTime && <meta http-equiv="last-modified" content={meta.modifiedTime} />}
      {/* citation_keywords — AI academic indexers (Semantic Scholar, Perplexity research)
          use these to classify content and boost citation density on keyword-matched queries. */}
      {(meta.articleTags ?? []).length > 0 && (
        <meta name="citation_keywords" content={(meta.articleTags ?? []).join("; ")} />
      )}
      <meta name="DC.title" content={meta.title} />
      <meta name="DC.description" content={meta.description} />
      <meta name="DC.creator" content="A Versus B" />
      <meta name="DC.publisher" content="A Versus B" />
      <meta name="DC.language" content="en" />
      <meta name="DC.type" content="Text" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content={meta.canonical} />
      <meta name="DC.rights" content="https://creativecommons.org/licenses/by/4.0/" />
      <meta name="DC.coverage" content="Worldwide" />
      {meta.publishedTime && <meta name="DC.date" content={meta.publishedTime} />}
      {/* DC.subject — Dublin Core subject taxonomy for AI citation indexers.
          Maps the comparison topic to a structured subject vocabulary. */}
      {meta.articleSection && <meta name="DC.subject" content={meta.articleSection} />}
      {/* Bing / AI topic classification meta tags — Bing Webmaster, Bing AI, and several
          AI crawlers use subject/topic/classification for topical authority scoring and
          content routing. category + subject = two separate classification signals. */}
      {meta.articleSection && <meta name="subject" content={`${meta.articleSection} comparison`} />}
      {meta.articleSection && <meta name="topic" content={`${meta.articleSection} comparison`} />}
      {meta.articleSection && <meta name="classification" content={`Reference/Comparison/${meta.articleSection}`} />}
      {meta.articleSection && <meta name="category" content={meta.articleSection} />}
      {/* Feed discovery — RSS + Atom feed links on every page; feed readers and AI crawlers
          use these to subscribe to content updates and detect freshness signals */}
      <link rel="alternate" type="application/rss+xml" title="A Versus B — RSS Feed" href="https://www.aversusb.net/feed" />
      <link rel="alternate" type="application/atom+xml" title="A Versus B — Atom Feed" href="https://www.aversusb.net/feed/atom" />
      <link rel="alternate" type="application/feed+json" title="A Versus B — JSON Feed" href="https://www.aversusb.net/feed/json" />
      {/* hreflang — English-only site; x-default avoids "missing x-default" Search Console warning */}
      <link rel="alternate" hrefLang="en" href={meta.canonical} />
      <link rel="alternate" hrefLang="x-default" href={meta.canonical} />
      {/* WebMention — W3C backlink notification; CMS platforms auto-POST here on link */}
      <link rel="webmention" href="https://www.aversusb.net/api/webmention" />
      {/* Pingback — XML-RPC backlink discovery; WordPress/Ghost auto-POST when they link here */}
      <link rel="pingback" href="https://www.aversusb.net/api/pingback" />
      {/* news_keywords — Google News, Apple News, Bing News categorization signal */}
      {(meta.articleTags ?? []).length > 0 && (
        <meta name="news_keywords" content={(meta.articleTags ?? []).slice(0, 10).join(", ")} />
      )}
      {/* keywords — standard HTML meta; Bing, Yandex, and AI topic classifiers still use this */}
      {(meta.articleTags ?? []).length > 0 && (
        <meta name="keywords" content={(meta.articleTags ?? []).slice(0, 15).join(", ")} />
      )}
      {/* og:see_also — related comparison URLs.
          AI crawlers (Perplexity, ChatGPT browse, Gemini) follow these to build
          entity-relationship graphs and surface more of our comparisons in answers. */}
      {(meta.seeAlsoUrls ?? []).map((url) => (
        <meta key={url} property="og:see_also" content={url} />
      ))}
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

  // N-entity (3+): multi-entity layout (parity with the App Router version).
  if (props.comparison.entities.length > 2) {
    return (
      <>
        <MetaHead meta={props.meta} />
        <MultiEntityLayout {...props} />
      </>
    );
  }

  const { comparison, slug, sidebarComparisons, videoMeta, hasSelfHostedVideo, jsonLd, claimReviewJsonLd } = props;

  return (
    <>
      <MetaHead meta={props.meta} />
      <ReadingProgressBar />

      {/* Schema markup — single consolidated @graph (or editorial schemaMarkup). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      {/* ClaimReview — fact-check schema for verdict pages; boosts E-E-A-T and AI citation confidence */}
      {claimReviewJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: claimReviewJsonLd }} />}

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
      {/* id="short-answer" lives inside QuickAnswerTLDR; no wrapper id needed */}
      {comparison.quickAnswer?.tldr && (
        <div>
          <QuickAnswerTLDR
            quickAnswer={comparison.quickAnswer}
            entityA={comparison.entities[0]}
            entityB={comparison.entities[1]}
          />
        </div>
      )}

      {/* Short Answer Block — fallback when no quickAnswer */}
      {/* id="short-answer" lives inside ShortAnswerBlock; no wrapper id needed */}
      {!comparison.quickAnswer?.tldr && (comparison.shortAnswer || comparison.verdict) && (
        <div>
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
      <TrackComparisonCard comparisonSlug={comparison.slug} comparisonTitle={comparison.title} />

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
            <KeyDifferencesBlock
              differences={comparison.keyDifferences}
              entityA={comparison.entities[0]}
              entityB={comparison.entities[1]}
            />
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

          {/* Visual Comparison Charts (client-only, viewport-deferred — DAN-1642) */}
          {comparison.attributes.some((a) => a.values.some((v) => v.valueNumber != null)) && (
            <DeferUntilVisible minHeight={360}>
              <ComparisonCharts
                attributes={comparison.attributes}
                entityA={comparison.entities[0]}
                entityB={comparison.entities[1]}
              />
            </DeferUntilVisible>
          )}

          {/* Video Comparison (client-only, viewport-deferred — DAN-1645).
              Gate on actual video existence: if neither a YouTube nor a self-hosted
              video exists, skip the wrapper entirely to avoid reserving 320px that
              would collapse to 0 on visibility and cause CLS (HB179). */}
          {(videoMeta?.youtubeVideoId || hasSelfHostedVideo) && (
            <DeferUntilVisible minHeight={320}>
              <ComparisonVideoPlayer slug={comparison.slug} title={comparison.title} youtubeVideoId={videoMeta?.youtubeVideoId || undefined} />
            </DeferUntilVisible>
          )}

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
            <FAQBlock faqs={comparison.faqs} />
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
      <SmartReviewLinks reviews={props.smartReviews} />

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

      {/* Intercept Survey — 30s dwell OR 60% scroll, 14-day cap (DAN-697) */}
      <InterceptSurvey comparisonSlug={comparison.slug} category={comparison.category || undefined} />
    </>
  );
}

/**
 * MultiEntityLayout — N-entity (3+) renderer (parity with the App Router version,
 * DAN-387 Phase 1). Renders only components that iterate entities[] safely.
 */
function MultiEntityLayout({
  comparison,
  slug,
  sidebarComparisons,
  smartReviews,
  jsonLd,
}: {
  comparison: Comparison;
  slug: string;
  sidebarComparisons: RelatedComparison[];
  smartReviews: SmartReviewEntry[];
  jsonLd: string;
}) {
  const n = comparison.entities.length;
  return (
    <>
      <ReadingProgressBar />
      {/* Schema markup — single consolidated @graph (or editorial schemaMarkup). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <TrackRecentView slug={slug} title={comparison.title} category={comparison.category || ""} />
      <BackToResults />

      <Breadcrumbs title={comparison.title} slug={comparison.slug} category={comparison.category} />

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
      <section aria-labelledby="compare-hero-heading" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 id="compare-hero-heading" className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-center text-text mb-3">
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
          {comparison.entities.map((ent) => (
            <div
              key={ent.id}
              className="bg-white border border-border rounded-xl p-4 sm:p-5 text-center hover:shadow-md transition-shadow"
            >
              {ent.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ent.imageUrl}
                  alt={ent.name}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-3 ring-2 ring-white shadow"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 bg-gradient-to-br from-primary-100 to-accent-100 text-primary-700 flex items-center justify-center font-bold text-2xl">
                  {ent.name.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="text-sm sm:text-base font-bold text-text mb-1">{ent.name}</h2>
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
        <section id="short-answer" aria-label="Quick Answer" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <MultiComparisonTable attributes={comparison.attributes} entities={comparison.entities} />
            </div>
          )}

          {/* Pros & Cons (already array-friendly, renders all N entities) */}
          <div id="pros-cons">
            <ProsConsBlock entities={comparison.entities} />
          </div>

          {/* Verdict — plain text fallback to avoid 2-entity VerdictCard */}
          {comparison.verdict && (
            <section aria-label="Verdict" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-text">Verdict</h2>
              </div>
              <p className="text-base text-text leading-relaxed whitespace-pre-line">{comparison.verdict}</p>
            </section>
          )}

          {/* Newsletter */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <NewsletterSignup source="comparison_inline" referrerSlug={comparison.slug} variant="card" />
          </div>

          {comparison.faqs.length > 0 && (
            <FAQBlock faqs={comparison.faqs} />
          )}

          <div id="resources">
            <ResourcesSection
              resources={generateResources(comparison.slug, comparison.entities)}
              entities={comparison.entities}
            />
          </div>
        </div>

        {sidebarComparisons.length > 0 && (
          <RelatedComparisonsSidebar comparisons={sidebarComparisons} sourceSlug={slug} variant="desktop" />
        )}
      </div>

      <InContentAd />

      <SmartReviewLinks reviews={smartReviews} />

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

function FreshnessFooter({ metadata }: { metadata: { updatedAt: string; isHumanReviewed: boolean; isAutoGenerated: boolean } }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-text-secondary">
      <time dateTime={metadata.updatedAt}>
        Last updated: {new Date(metadata.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </time>
      {metadata.isHumanReviewed && (
        <span className="ml-2 inline-flex items-center gap-1 text-green-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Human reviewed
        </span>
      )}
      {metadata.isAutoGenerated && (
        <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          AI generated
        </span>
      )}
    </div>
  );
}
