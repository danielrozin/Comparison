import type { ComparisonPageData } from "@/types";
import { SITE_URL } from "@/lib/utils/constants";
import { isEntityPageIndexable } from "@/lib/seo/entity-page-indexable";
import {
  claimReviewSchema,
  comparisonPageSchema,
  jsonLdGraph,
  webPageSchema,
  type ComparisonVoteData,
} from "@/lib/seo/schema";

export interface AssembledCompareJsonLd {
  /** Single JSON-LD document the compare template puts in the first script tag. */
  document: Record<string, unknown>;
  /**
   * Standalone ClaimReview script. Null when the main document already
   * carries the ClaimReview (the usual editorial case) or when that node
   * is at least as complete as `claimReviewSchema`.
   */
  claimReview: Record<string, unknown> | null;
}

/**
 * Slug of an AversusB `/entity/{slug}` URL, absolute or relative, with an
 * optional hash (`#profilepage`). Wikidata's `/entity/Q…` paths are not
 * ours and return null.
 */
export function entitySlugFromPageUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/")) {
    const match = trimmed.match(/^\/entity\/([^/?#]+)\/?(?:[?#].*)?$/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  if (!/^https?:\/\//i.test(trimmed)) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const siteHost = new URL(SITE_URL).hostname.replace(/^www\./, "");
  const host = url.hostname.replace(/^www\./, "");
  if (host !== siteHost) return null;

  const match = url.pathname.match(/^\/entity\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

function noindexSlugs(entities: ComparisonPageData["entities"]): Set<string> {
  const slugs = new Set<string>();
  for (const entity of entities) {
    if (!entity.slug) continue;
    if (!isEntityPageIndexable(entity.status)) slugs.add(entity.slug);
  }
  return slugs;
}

function isNoindexEntityUrl(value: string, blocked: Set<string>): boolean {
  const slug = entitySlugFromPageUrl(value);
  return slug != null && blocked.has(slug);
}

/**
 * Drop `/entity/{slug}` strings (url, @id, sameAs, mainEntity, about, …)
 * when that entity page is noindex. Other schema types and non-URL fields
 * stay. An array that becomes empty is removed so we don't emit `url: []`.
 */
export function stripNoindexEntityPageUrls<T>(value: T, entities: ComparisonPageData["entities"]): T {
  const blocked = noindexSlugs(entities);
  if (blocked.size === 0) return value;
  const walked = walk(value, blocked);
  return (walked === undefined ? value : walked) as T;
}

function walk(value: unknown, blocked: Set<string>): unknown {
  if (typeof value === "string") {
    return isNoindexEntityUrl(value, blocked) ? undefined : value;
  }
  if (Array.isArray(value)) {
    const next = value
      .map((item) => walk(item, blocked))
      .filter((item) => item !== undefined);
    return next.length === 0 ? undefined : next;
  }
  if (!value || typeof value !== "object") return value;

  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const walked = walk(child, blocked);
    if (walked !== undefined) next[key] = walked;
  }
  return next;
}

function appendVideoToGraph(
  doc: Record<string, unknown>,
  video: Record<string, unknown> | null,
): Record<string, unknown> {
  if (!video) return doc;
  const videoNode = Object.fromEntries(
    Object.entries(video).filter(([key]) => key !== "@context"),
  );
  if (Array.isArray(doc["@graph"])) {
    return { ...doc, "@graph": [...(doc["@graph"] as unknown[]), videoNode] };
  }
  return jsonLdGraph([doc, video]);
}

function isClaimReviewType(type: unknown): boolean {
  if (type === "ClaimReview") return true;
  return Array.isArray(type) && type.includes("ClaimReview");
}

function collectClaimReviews(node: unknown, found: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(node)) {
    for (const item of node) collectClaimReviews(item, found);
    return found;
  }
  if (!node || typeof node !== "object") return found;
  const obj = node as Record<string, unknown>;
  if (isClaimReviewType(obj["@type"])) {
    found.push(obj);
    return found;
  }
  for (const child of Object.values(obj)) collectClaimReviews(child, found);
  return found;
}

/** How many populated fields a node carries. `@context` is boilerplate. */
function schemaCompleteness(node: unknown): number {
  if (node == null || node === "") return 0;
  if (typeof node !== "object") return 1;
  if (Array.isArray(node)) {
    return node.reduce((sum, item) => sum + schemaCompleteness(item), 0);
  }
  let score = 0;
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    if (key === "@context") continue;
    if (child == null || child === "") continue;
    score += 1 + schemaCompleteness(child);
  }
  return score;
}

function stripClaimReviewNodes(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map((item) => stripClaimReviewNodes(item))
      .filter((item) => item !== undefined);
  }
  if (!value || typeof value !== "object") return value;
  const obj = value as Record<string, unknown>;
  if (isClaimReviewType(obj["@type"])) return undefined;
  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(obj)) {
    const stripped = stripClaimReviewNodes(child);
    if (stripped !== undefined) next[key] = stripped;
  }
  return next;
}

/**
 * One ClaimReview per page. The @graph node from `comparisonPageSchema`
 * (publisher, itemReviewed.datePublished, appearance, firstAppearance) is
 * more complete than the standalone `claimReviewSchema` script. When the
 * standalone node is richer — a thin editorial `schemaMarkup` blob — keep
 * that one and remove the thinner node so FAQPage, Product, BreadcrumbList,
 * and the rest of the graph stay.
 */
function singleClaimReview(
  document: Record<string, unknown>,
  standalone: Record<string, unknown> | null,
): AssembledCompareJsonLd {
  if (!standalone) return { document, claimReview: null };

  const inDocument = collectClaimReviews(document);
  if (inDocument.length === 0) return { document, claimReview: standalone };

  const documentScore = Math.max(...inDocument.map((node) => schemaCompleteness(node)));
  const standaloneScore = schemaCompleteness(standalone);
  if (standaloneScore > documentScore) {
    return {
      document: stripClaimReviewNodes(document) as Record<string, unknown>,
      claimReview: standalone,
    };
  }
  return { document, claimReview: null };
}

/**
 * JSON-LD for `/compare/[slug]`. Mirrors the previous getStaticProps
 * branches (editorial schemaMarkup, multi-entity @graph, 2-entity graph)
 * then applies the entity-page indexability gate and ClaimReview dedupe.
 */
export function assembleCompareJsonLd(args: {
  comparison: ComparisonPageData;
  voteData: ComparisonVoteData | null;
  videoNode: Record<string, unknown> | null;
  fallbackDescription: string;
}): AssembledCompareJsonLd {
  const { comparison, voteData, videoNode, fallbackDescription } = args;
  const slug = comparison.slug;
  const isMultiEntity = comparison.entities.length > 2;
  const schemas = comparisonPageSchema(comparison, voteData);

  let document: Record<string, unknown>;
  if (comparison.schemaMarkup) {
    document = appendVideoToGraph(comparison.schemaMarkup, videoNode);
  } else if (isMultiEntity) {
    document = appendVideoToGraph(schemas[0] as Record<string, unknown>, videoNode);
  } else {
    document = jsonLdGraph([
      ...schemas,
      webPageSchema({
        title: comparison.metadata.metaTitle ?? comparison.title,
        description: comparison.metadata.metaDescription ?? fallbackDescription,
        url: `${SITE_URL}/compare/${slug}`,
        datePublished: comparison.metadata.publishedAt ?? undefined,
        dateModified: comparison.metadata.updatedAt ?? undefined,
        keywords: [
          ...comparison.entities.map((entity) => entity.name),
          "comparison",
          "versus",
          ...(comparison.category ? [comparison.category] : []),
        ].join(", "),
        mainEntity: { "@type": "Article", "@id": `${SITE_URL}/compare/${slug}#article` },
        speakableCssSelector: [
          "h1",
          "#hero-tldr",
          "#short-answer",
          "#video",
          "#verdict",
          "#key-differences",
          "#comparison-table",
          "#key-facts",
          "#expert-analysis",
          "#faq",
        ],
      }),
      videoNode,
    ]);
  }

  document = stripNoindexEntityPageUrls(document, comparison.entities);

  const entityA = comparison.entities[0]?.name || "";
  const entityB = comparison.entities[1]?.name || "";
  const standalone =
    !isMultiEntity && comparison.verdict && entityA && entityB && comparison.shortAnswer
      ? (claimReviewSchema({
          slug,
          title: comparison.title,
          entityA,
          entityB,
          verdict: comparison.verdict,
          shortAnswer: comparison.shortAnswer,
          datePublished: comparison.metadata.publishedAt
            ? new Date(comparison.metadata.publishedAt).toISOString().slice(0, 10)
            : undefined,
          dateModified: comparison.metadata.updatedAt
            ? new Date(comparison.metadata.updatedAt).toISOString().slice(0, 10)
            : undefined,
        }) as Record<string, unknown>)
      : null;

  return singleClaimReview(document, standalone);
}
