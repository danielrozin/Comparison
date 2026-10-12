import type { ComparisonPageData } from "@/types";
import { SITE_URL } from "@/lib/utils/constants";
import { isEntityPageIndexable } from "@/lib/seo/entity-page-indexable";
import {
  comparisonPageSchema,
  jsonLdGraph,
  webPageSchema,
  type ComparisonVoteData,
} from "@/lib/seo/schema";
import { labelUnreviewedCompareJsonLd } from "@/lib/editorial/human-reviewed";
import { alignJsonLdToRenderedMetrics } from "@/lib/comparison/metric-table-guard";

export interface AssembledCompareJsonLd {
  /** Single JSON-LD document the compare template puts in the first script tag. */
  document: Record<string, unknown>;
  /**
   * Always null. Compare pages do not emit ClaimReview: the site is not a
   * fact-checker, and the old node invented a claim nobody made.
   */
  claimReview: null;
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
 * One FAQPage per compare document. Extra FAQPage nodes (an Article hasPart
 * stub, or a second node stored in schemaMarkup) collapse onto the fullest
 * node. Question text is aligned to the visible FAQ list afterwards.
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

function answerText(question: Record<string, unknown>): string {
  const answer = question.acceptedAnswer;
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) return "";
  const text = (answer as Record<string, unknown>).text;
  return typeof text === "string" ? text : "";
}

function questionName(question: Record<string, unknown>): string {
  if (typeof question.name === "string") return question.name;
  if (typeof question.text === "string") return question.text;
  return "";
}

function visibleFaqsMatch(
  node: Record<string, unknown>,
  faqs: ComparisonPageData["faqs"],
): boolean {
  const questions = questionsOf(node);
  if (questions.length !== faqs.length) return false;
  return faqs.every((faq, index) => {
    const question = questions[index];
    if (questionName(question) !== faq.question) return false;
    if (typeof question.text === "string" && question.text !== faq.question) return false;
    return answerText(question) === faq.answer;
  });
}

function alignedQuestions(
  faqs: ComparisonPageData["faqs"],
  keeper: Record<string, unknown> | undefined,
  comparison: ComparisonPageData,
): Record<string, unknown>[] {
  const existing = keeper ? questionsOf(keeper) : [];
  const faqId =
    keeper && typeof keeper["@id"] === "string"
      ? keeper["@id"]
      : `${SITE_URL}/compare/${comparison.slug}#faq`;
  const base = faqId.endsWith("#faq") ? faqId.slice(0, -"#faq".length) : "";
  const published = comparison.metadata.publishedAt ?? undefined;
  const modified = comparison.metadata.updatedAt ?? published;

  return faqs.map((faq, index) => {
    const template = existing[index] ?? existing[existing.length - 1];
    const n = index + 1;
    if (template) {
      const answer = template.acceptedAnswer;
      const answerObj =
        answer && typeof answer === "object" && !Array.isArray(answer)
          ? { ...(answer as Record<string, unknown>) }
          : { "@type": "Answer" };
      return {
        ...template,
        "@type": "Question",
        name: faq.question,
        text: faq.question,
        ...(base ? { "@id": `${base}#q${n}`, url: `${base}#q${n}` } : {}),
        acceptedAnswer: {
          ...answerObj,
          "@type": "Answer",
          text: faq.answer,
          ...(base ? { "@id": `${base}#a${n}` } : {}),
        },
      };
    }
    return {
      "@type": "Question",
      name: faq.question,
      text: faq.question,
      ...(base ? { "@id": `${base}#q${n}`, url: `${base}#q${n}` } : {}),
      ...(published ? { dateCreated: published } : {}),
      ...(modified ? { dateModified: modified } : {}),
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
        ...(base ? { "@id": `${base}#a${n}` } : {}),
        ...(published ? { dateCreated: published } : {}),
        ...(modified ? { dateModified: modified } : {}),
      },
    };
  });
}

function appendFaqPage(
  document: Record<string, unknown>,
  comparison: ComparisonPageData,
  questions: Record<string, unknown>[],
): Record<string, unknown> {
  const url = `${SITE_URL}/compare/${comparison.slug}`;
  const faqNode: Record<string, unknown> = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: questions,
  };
  if (Array.isArray(document["@graph"])) {
    return { ...document, "@graph": [...(document["@graph"] as unknown[]), faqNode] };
  }
  const { "@context": context, ...rest } = document;
  return {
    "@context": context ?? "https://schema.org",
    "@graph": [rest, faqNode],
  };
}

/**
 * Keep at most one FAQPage, and make its questions the ones rendered on
 * the page. A node that already matches is left alone so its dates stay.
 * Stored schemaMarkup questions that are not on the page are dropped.
 */
function alignFaqToVisibleFaqs(
  document: Record<string, unknown>,
  comparison: ComparisonPageData,
): Record<string, unknown> {
  const faqs = comparison.faqs ?? [];
  const nodes: Record<string, unknown>[] = [];
  collectFaqPages(document, nodes);

  if (faqs.length === 0) {
    const stripped = nodes.length === 0 ? document : stripFaqPageNodes(document);
    const withoutFaqLinks = omitEmptyFaqLinks(stripped);
    return withoutFaqLinks && typeof withoutFaqLinks === "object" && !Array.isArray(withoutFaqLinks)
      ? (withoutFaqLinks as Record<string, unknown>)
      : document;
  }

  if (nodes.length === 1 && visibleFaqsMatch(nodes[0], faqs)) return document;

  const keeper = [...nodes].sort((a, b) => schemaCompleteness(b) - schemaCompleteness(a))[0];
  const questions = alignedQuestions(faqs, keeper, comparison);
  if (!keeper) return appendFaqPage(document, comparison, questions);

  const rewritten = rewriteFaqTree(document, keeper, keeper["@id"], questions);
  return rewritten && typeof rewritten === "object" && !Array.isArray(rewritten)
    ? (rewritten as Record<string, unknown>)
    : document;
}

function isIdOnlyFaqRef(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  return keys.length === 1 && keys[0] === "@id" && typeof obj["@id"] === "string" && obj["@id"].endsWith("#faq");
}

/** Drop `{ "@id": "...#faq" }` edges when the page has no FAQPage to point at. */
function omitEmptyFaqLinks(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(omitEmptyFaqLinks).filter((item) => item !== undefined && !isIdOnlyFaqRef(item));
  }
  if (!value || typeof value !== "object") return value;
  if (isIdOnlyFaqRef(value)) return undefined;
  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const walked = omitEmptyFaqLinks(child);
    if (walked !== undefined && !isIdOnlyFaqRef(walked)) next[key] = walked;
  }
  return next;
}

function stripFaqPageNodes(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map((item) => stripFaqPageNodes(item))
      .filter((item) => item !== undefined);
  }
  if (!value || typeof value !== "object") return value;
  if (isFaqPageNode(value)) return undefined;
  const next: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const stripped = stripFaqPageNodes(child);
    if (stripped !== undefined) next[key] = stripped;
  }
  return next;
}

/**
 * JSON-LD for `/compare/[slug]`. Mirrors the previous getStaticProps
 * branches (editorial schemaMarkup, multi-entity @graph, 2-entity graph)
 * then applies the entity-page indexability gate and a single visible FAQPage.
 * ClaimReview is never emitted.
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
  const withoutClaims = stripClaimReviewNodes(document);
  if (withoutClaims && typeof withoutClaims === "object" && !Array.isArray(withoutClaims)) {
    document = withoutClaims as Record<string, unknown>;
  }
  document = dedupeFaqPages(document);
  document = alignFaqToVisibleFaqs(document, comparison);
  document = alignJsonLdToRenderedMetrics(document, comparison);

  return {
    document: labelUnreviewedCompareJsonLd(document, slug),
    claimReview: null,
  };
}
