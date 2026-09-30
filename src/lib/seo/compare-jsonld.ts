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
    if (walked === undefined) continue;
    next[key] = walked;
  }
  // Stripping a noindex /entity URL used to leave
  // {"@type":"ProfilePage","name":"… — Comparisons & Profile"} in hasPart,
  // and {"@type":"ProfilePage"} under mainEntityOfPage. Drop that node
  // wherever it sits: hasPart, mainEntityOfPage, about, mentions, or a nested array.
  if (isEmptyProfilePage(next)) return undefined;
  return next;
}

function isProfilePageType(type: unknown): boolean {
  if (type === "ProfilePage") return true;
  return Array.isArray(type) && type.includes("ProfilePage");
}

function isEmptyProfilePage(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  if (!isProfilePageType(obj["@type"])) return false;
  return !obj["@id"] && !obj.url;
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

function isFaqPageType(type: unknown): boolean {
  if (type === "FAQPage") return true;
  return Array.isArray(type) && type.includes("FAQPage");
}

function isFaqPageNode(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return isFaqPageType((value as Record<string, unknown>)["@type"]);
}

function collectFaqPages(node: unknown, found: Record<string, unknown>[]): void {
  if (Array.isArray(node)) {
    for (const item of node) collectFaqPages(item, found);
    return;
  }
  if (!isFaqPageNode(node) && (!node || typeof node !== "object")) return;
  if (isFaqPageNode(node)) {
    found.push(node);
    return;
  }
  for (const child of Object.values(node as Record<string, unknown>)) collectFaqPages(child, found);
}

function questionsOf(node: Record<string, unknown>): Record<string, unknown>[] {
  const main = node.mainEntity;
  if (Array.isArray(main)) {
    return main.filter((item): item is Record<string, unknown> => !!item && typeof item === "object" && !Array.isArray(item));
  }
  if (main && typeof main === "object" && !Array.isArray(main)) return [main as Record<string, unknown>];
  return [];
}

function questionKey(question: Record<string, unknown>): string {
  const name = typeof question.name === "string" ? question.name : typeof question.text === "string" ? question.text : "";
  return name.trim().toLowerCase();
}

function uniqueQuestions(nodes: Record<string, unknown>[]): Record<string, unknown>[] {
  const seen = new Set<string>();
  const questions: Record<string, unknown>[] = [];
  for (const node of nodes) {
    for (const question of questionsOf(node)) {
      const key = questionKey(question);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      questions.push(question);
    }
  }
  return questions;
}

function reindexQuestions(questions: Record<string, unknown>[], faqId: string): Record<string, unknown>[] {
  const base = faqId.replace(/#faq$/, "");
  if (!base || base === faqId) return questions;
  return questions.map((question, index) => {
    const n = index + 1;
    const answer = question.acceptedAnswer;
    return {
      ...question,
      "@id": `${base}#q${n}`,
      url: `${base}#q${n}`,
      ...(answer && typeof answer === "object" && !Array.isArray(answer)
        ? { acceptedAnswer: { ...(answer as Record<string, unknown>), "@id": `${base}#a${n}` } }
        : {}),
    };
  });
}

function rewriteFaqTree(
  value: unknown,
  keeper: Record<string, unknown>,
  keeperId: unknown,
  mergedQuestions: Record<string, unknown>[] | null,
): unknown {
  if (Array.isArray(value)) {
    const next: unknown[] = [];
    for (const item of value) {
      if (isFaqPageNode(item)) {
        if (item === keeper) {
          next.push(rewriteFaqTree(item, keeper, keeperId, mergedQuestions));
        } else if (keeperId && questionsOf(item).length === 0) {
          // hasPart stub: keep the graph edge, but do not emit a second FAQPage.
          next.push({ "@id": keeperId });
        }
        continue;
      }
      next.push(rewriteFaqTree(item, keeper, keeperId, mergedQuestions));
    }
    return next;
  }
  if (!value || typeof value !== "object") return value;
  if (value === keeper) {
    const next: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(keeper)) {
      if (key === "mainEntity" && mergedQuestions) {
        next[key] = mergedQuestions;
        continue;
      }
      const walked = rewriteFaqTree(child, keeper, keeperId, mergedQuestions);
      if (walked !== undefined) next[key] = walked;
    }
    return next;
  }
  if (isFaqPageNode(value)) {
    return keeperId ? { "@id": keeperId } : undefined;
  }
  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const walked = rewriteFaqTree(child, keeper, keeperId, mergedQuestions);
    if (walked !== undefined) next[key] = walked;
  }
  return next;
}

/**
 * One FAQPage per compare document. The Article hasPart stub and the full
 * FAQPage node (and a second full node inside editorial schemaMarkup) share
 * `#faq`. Questions from every source are merged, and a repeated question
 * keeps the first answer.
 */
export function dedupeFaqPages<T>(document: T): T {
  if (!document || typeof document !== "object") return document;
  const faqNodes: Record<string, unknown>[] = [];
  collectFaqPages(document, faqNodes);
  if (faqNodes.length <= 1) return document;

  const ranked = [...faqNodes].sort((a, b) => schemaCompleteness(b) - schemaCompleteness(a));
  const keeper = ranked[0];
  const others = faqNodes.filter((node) => node !== keeper);
  const merged = uniqueQuestions([keeper, ...others]);
  const mergedQuestions =
    merged.length !== questionsOf(keeper).length
      ? reindexQuestions(merged, typeof keeper["@id"] === "string" ? keeper["@id"] : "")
      : null;
  return rewriteFaqTree(document, keeper, keeper["@id"], mergedQuestions) as T;
}

/**
 * JSON-LD for `/compare/[slug]`. Mirrors the previous getStaticProps
 * branches (editorial schemaMarkup, multi-entity @graph, 2-entity graph)
 * then applies the entity-page indexability gate, FAQPage dedupe, and
 * ClaimReview dedupe.
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
  document = dedupeFaqPages(document);

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
