import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/services/blog-generator";
import { getComparisonTitlesBySlugs } from "@/lib/services/comparison-service";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { breadcrumbSchema, faqSchema, socialSameAs, howToSchemaFromBlog, entityWikipediaSameAs } from "@/lib/seo/schema";
import { getBlogSchemaExtras } from "@/lib/data/blog-schema-extras";

export const revalidate = 3600; // ISR: revalidate blog pages every 1 hour
import { ShareBar } from "@/components/engagement/ShareBar";
import { InContentAd } from "@/components/ads/AdUnit";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

// ---------- Tag-type inference ----------
// Infers schema.org @type from a blog tag name for typed mentions[] — same pattern
// as HB139 on comparison pages. Uses lightweight keyword detection; falls back to Thing.
function inferTagSchemaType(tag: string): string {
  const t = tag.toLowerCase();
  // Known organization names and company-suffix patterns
  if (
    ["openai", "anthropic", "google", "microsoft", "meta", "amazon", "apple", "nvidia",
      "samsung", "ibm", "adobe", "salesforce", "oracle", "sap", "shopify"].includes(t) ||
    /\b(inc|corp|ltd|llc|group|labs|technologies)\b/.test(t)
  ) return "Organization";
  // Software products, AI models, APIs, platforms
  if (
    /\b(gpt|chatgpt|claude|gemini|copilot|llm|model|api|sdk|framework|platform|app|plugin|browser|linux|windows|android|ios|macos|software|tool)\b/.test(t) ||
    t.endsWith(" ai") || t.startsWith("ai ") || t === "ai"
  ) return "SoftwareApplication";
  return "Thing";
}

// ---------- Markdown renderer ----------

function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks (``` ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Tables
  html = html.replace(
    /((?:\|.+\|\n)+)/g,
    (tableBlock: string) => {
      const rows = tableBlock.trim().split("\n");
      if (rows.length < 2) return tableBlock;

      let tableHtml =
        '<div class="overflow-x-auto my-6"><table class="w-full border-collapse rounded-lg overflow-hidden">';

      rows.forEach((row, idx) => {
        // Skip separator row (|---|---|)
        if (/^\|[\s-:|]+\|$/.test(row)) return;

        const cells = row
          .split("|")
          .filter((c) => c.trim() !== "");

        if (idx === 0) {
          tableHtml += "<thead><tr>";
          cells.forEach((cell) => {
            tableHtml += `<th scope="col" class="bg-primary-50 px-4 py-3 text-left text-sm font-semibold text-text border-b border-border">${cell.trim()}</th>`;
          });
          tableHtml += "</tr></thead><tbody>";
        } else {
          tableHtml += `<tr class="${idx % 2 === 0 ? "bg-surface-alt" : "bg-white"}">`;
          cells.forEach((cell) => {
            tableHtml += `<td class="px-4 py-3 text-sm text-text-secondary border-b border-border">${cell.trim()}</td>`;
          });
          tableHtml += "</tr>";
        }
      });

      tableHtml += "</tbody></table></div>";
      return tableHtml;
    }
  );

  // Process line-by-line for headings and lists
  const lines = html.split("\n");
  const processed: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    if (line.startsWith("### ")) {
      if (inList) { processed.push("</ul>"); inList = false; }
      processed.push(
        `<h3 class="text-xl font-bold text-text mt-8 mb-3">${line.slice(4)}</h3>`
      );
      continue;
    }
    if (line.startsWith("## ")) {
      if (inList) { processed.push("</ul>"); inList = false; }
      processed.push(
        `<h2 class="text-2xl font-bold text-text mt-10 mb-4 pb-2 border-b border-border">${line.slice(3)}</h2>`
      );
      continue;
    }

    // Unordered list items
    if (/^[-*]\s/.test(line)) {
      if (!inList) { processed.push('<ul class="list-disc list-inside space-y-2 my-4 text-text-secondary">'); inList = true; }
      processed.push(`<li>${line.replace(/^[-*]\s/, "")}</li>`);
      continue;
    }

    // End list
    if (inList && line.trim() === "") {
      processed.push("</ul>");
      inList = false;
    }

    // Regular paragraph
    if (line.trim() !== "" && !line.startsWith("<")) {
      if (inList) { processed.push("</ul>"); inList = false; }
      processed.push(`<p class="text-text-secondary leading-relaxed my-4">${line}</p>`);
    } else {
      processed.push(line);
    }
  }
  if (inList) processed.push("</ul>");

  html = processed.join("\n");

  // Inline formatting
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-text font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary-600 hover:text-primary-700 underline underline-offset-2">$1</a>'
  );

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---------- Helpers ----------

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    technology: "bg-blue-100 text-blue-700",
    sports: "bg-green-100 text-green-700",
    entertainment: "bg-purple-100 text-purple-700",
    lifestyle: "bg-pink-100 text-pink-700",
    science: "bg-cyan-100 text-cyan-700",
    business: "bg-amber-100 text-amber-700",
    education: "bg-indigo-100 text-indigo-700",
    health: "bg-red-100 text-red-700",
    travel: "bg-teal-100 text-teal-700",
    food: "bg-orange-100 text-orange-700",
  };
  return colors[cat] || "bg-surface-alt text-text-secondary";
}

// ---------- Metadata ----------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);
  if (!article) {
    return { title: "Article Not Found" };
  }
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&type=blog&cat=${encodeURIComponent(article.category || "")}`;
  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
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
      canonical: `${SITE_URL}/blog/${slug}`,
      languages: {
        "en": `${SITE_URL}/blog/${slug}`,
        "x-default": `${SITE_URL}/blog/${slug}`,
      },
      types: {
        "application/rss+xml": `${SITE_URL}/feed`,
        "application/atom+xml": `${SITE_URL}/feed/atom`,
        "application/json": `${SITE_URL}/api/blog/${slug}`,
        "application/ld+json": `${SITE_URL}/api/blog/${slug}`,
        "application/json+oembed": `${SITE_URL}/api/oembed?url=${SITE_URL}/blog/${slug}&format=json`,
      },
    },
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
      modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
      authors: [`${SITE_URL}/authors/daniel-rozin`],
      section: article.category ?? "Comparisons",
      tags: article.tags ?? [],
      images: [{ url: ogImage, secureUrl: ogImage, type: "image/png", width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
    site: "@aversusb",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: [ogImage],
    },
    // Academic / AI citation meta tags (Dublin Core + citation_ namespace).
    // Semantic Scholar, Google Scholar, and AI crawlers use these to extract
    // citable metadata and attribute content to the correct source.
    other: {
      "citation_title": article.metaTitle || article.title,
      "citation_author": "Daniel Rozin",
      "citation_publication_date": article.publishedAt
        ? new Date(article.publishedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      "citation_journal_title": "A Versus B",
      "citation_abstract": (article.metaDescription || article.excerpt || "").slice(0, 300),
      "abstract": (article.metaDescription || article.excerpt || "").slice(0, 300),
      "citation_language": "en",
      "citation_fulltext_world_accessible": "",
      "citation_online_date": article.publishedAt
        ? new Date(article.publishedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      "DC.title": article.metaTitle || article.title,
      "DC.description": (article.metaDescription || article.excerpt || "").slice(0, 300),
      "DC.creator": "Daniel Rozin",
      "DC.date": article.publishedAt
        ? new Date(article.publishedAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.subject": `${article.category ?? "Comparisons"}, ${article.title}`,
      "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
      "DC.coverage": "Worldwide",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.identifier": `${SITE_URL}/blog/${slug}`,
      // twitter:label/data — structured stat pairs in Twitter/X link preview cards.
      "twitter:label1": "Category",
      "twitter:data1": article.category
        ? article.category.charAt(0).toUpperCase() + article.category.slice(1)
        : "Blog",
      "twitter:label2": "Read time",
      "twitter:data2": `${Math.ceil((article.content?.split(/\s+/).length ?? 500) / 200)} min`,
      // news_keywords — Google News categorization; also parsed by Apple News and AI news aggregators.
      // Comma-separated list of the most important topics for this article.
      ...(article.tags && article.tags.length > 0
        ? { "news_keywords": article.tags.slice(0, 10).join(", ") }
        : article.category
        ? { "news_keywords": `${article.category}, comparison, A Versus B` }
        : {}),
      // citation_keywords — academic indexers (Semantic Scholar, Perplexity research) use these
      // to classify and boost citation density on keyword-matched queries.
      ...(article.tags && article.tags.length > 0
        ? { "citation_keywords": article.tags.join("; ") }
        : {}),
      // thumbnail — Bing rich snippets + Microsoft Copilot preview card selection.
      "thumbnail": ogImage,
      // Bing / AI topic classification — subject/topic/classification/category help
      // Bing Webmaster Tools, Bing AI, and AI crawlers route this page to the right topical cluster.
      ...(article.category ? {
        "subject": `${article.category} guide`,
        "topic": `${article.category} comparison`,
        "classification": `Reference/Guide/${article.category}`,
        "category": article.category,
      } : {}),
    },
  };
}

// ---------- Page ----------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);

  if (!article) {
    notFound();
  }

  const readTime = estimateReadTime(article.content);
  const renderedContent = renderMarkdown(article.content);

  // Fetch actual comparison titles for related comparisons
  const comparisonTitles = article.relatedComparisonSlugs?.length
    ? await getComparisonTitlesBySlugs(article.relatedComparisonSlugs)
    : {};

  const articleUrl = `${SITE_URL}/blog/${slug}`;
  const extras = getBlogSchemaExtras(slug);

  // JSON-LD Article schema — enriched with wordCount and speakable for AEO
  const wordCount = article.content
    ? article.content.split(/\s+/).filter(Boolean).length
    : undefined;

  // Use NewsArticle for posts published within 30 days — Google treats NewsArticle
  // as time-sensitive content and fast-tracks it for freshness ranking signals.
  const publishedDate = article.publishedAt ? new Date(article.publishedAt) : null;
  const isRecent = publishedDate
    ? Date.now() - publishedDate.getTime() < 30 * 24 * 60 * 60 * 1000
    : false;

  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&type=blog`;

  const articleSchema = {
    // InDepthArticle additionalType: Google Discover uses this to surface comprehensive
    // explainers. Threshold: 1500+ words qualifies as "in-depth" per Google's guidance.
    "@type": isRecent ? ["Article", "NewsArticle"] : "Article",
    ...(wordCount && wordCount >= 1500 ? { additionalType: "https://schema.org/InDepthArticle" } : {}),
    "@id": `${articleUrl}#article`,
    headline: article.title,
    description: article.excerpt,
    thumbnailUrl: ogImage,
    genre: article.category
      ? `${article.category.charAt(0).toUpperCase()}${article.category.slice(1)} Guide`
      : "Comparison Guide",
    image: {
      "@type": "ImageObject",
      url: ogImage,
      contentUrl: ogImage,
      width: 1200,
      height: 630,
      caption: article.title,
      creditText: SITE_NAME,
      creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      acquireLicensePage: `${SITE_URL}/terms`,
    },
    ...(wordCount && { wordCount }),
    // timeRequired — estimated reading time derived from actual word count ÷ 200 wpm.
    timeRequired: wordCount ? `PT${Math.ceil(wordCount / 200)}M` : "PT3M",
    inLanguage: "en-US",
    author: extras?.author
      ? {
          "@type": "Person",
          name: extras.author.name,
          ...(extras.author.url && { url: extras.author.url, "@id": `${extras.author.url}#person` }),
        }
      : {
          "@type": "Person",
          "@id": `${SITE_URL}/authors/daniel-rozin#person`,
          name: "Daniel Rozin",
          url: `${SITE_URL}/authors/daniel-rozin`,
          jobTitle: "Founder & Editor-in-Chief",
          worksFor: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
          sameAs: [
            "https://www.linkedin.com/in/daniel-rozin-56a066b0/",
            "https://www.facebook.com/daniel.rozin.94",
          ],
        },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
        width: 200,
        height: 60,
      },
      sameAs: socialSameAs(),
    },
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : undefined,
    dateCreated: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : undefined,
    dateModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${articleUrl}#webpage` },
    url: articleUrl,
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    ...(article.category && { articleSection: article.category }),
    // abstract — concise summary for LLM citation snippets (preferred over description)
    ...(article.excerpt && { abstract: article.excerpt }),
    // keywords — tags + category for entity/topic recognition in LLM training crawls
    ...(article.tags?.length && { keywords: article.tags.join(", ") }),
    // about — links this blog article to the comparison pages it discusses.
    // @id matches the comparison Article @id for cross-document knowledge graph merging.
    ...(article.relatedComparisonSlugs?.length && {
      about: article.relatedComparisonSlugs.map((s) => ({
        "@type": "Article",
        "@id": `${SITE_URL}/compare/${s}#article`,
        headline: comparisonTitles?.[s] ?? s,
        url: `${SITE_URL}/compare/${s}`,
      })),
    }),
    creativeWorkStatus: "Published",
    // lastReviewed / reviewedBy — explicit freshness signal for AI crawlers.
    lastReviewed: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    // contentReferenceTime — tells LLMs the "as of" date for data in this article,
    // enabling time-qualified citations instead of treating content as timeless.
    contentReferenceTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    alternativeHeadline: `${article.title} — ${SITE_NAME} Guide`,
    copyrightYear: publishedDate ? publishedDate.getFullYear() : new Date().getFullYear(),
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    copyrightNotice: `© ${publishedDate ? publishedDate.getFullYear() : new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: {
      "@type": "Audience",
      audienceType: "Consumers, Researchers, Students, Decision Makers",
    },
    // educationalLevel — AI classifiers use this to select appropriate citation depth.
    educationalLevel: "General",
    // interactivityType — blog articles are read-only expositive content.
    interactivityType: "expositive",
    // accessMode signals content modality to AI classifiers and screen-reader crawlers.
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    // speakable — key sections AI voice assistants and LLMs should prioritize for extraction.
    // .article-excerpt is emitted on the excerpt <p> in the blog header (HB89 fix).
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-excerpt", ".prose-custom p:first-of-type"],
    },
    // potentialAction — ReadAction lets AI crawlers confirm this article is
    // readable at its canonical URL, boosting indexation and citation confidence.
    potentialAction: {
      "@type": "ReadAction",
      target: { "@type": "EntryPoint", urlTemplate: articleUrl },
    },
    // contentReferenceTime — tells LLMs the data freshness window so time-qualified
    // answer engines (ChatGPT, Perplexity) can attribute the correct temporal context.
    ...(article.updatedAt && { contentReferenceTime: new Date(article.updatedAt).toISOString() }),
    // teaches — maps the article to a specific learning outcome for educational AI classifiers.
    // ChatGPT and Perplexity route "how-to" and "which is better" queries to pages
    // with a populated `teaches` field, increasing citation frequency on decision queries.
    teaches: (() => {
      const t = (article.metaTitle || article.title).toLowerCase();
      if (t.startsWith("how to ")) return article.metaTitle || article.title;
      if (t.includes(" vs ") || t.includes(" versus ")) return `How to choose: ${article.title}`;
      return `How to understand: ${article.title}`;
    })(),
    // educationalUse — "comparison" for vs-articles, "guide" for how-to articles.
    educationalUse: (article.title.toLowerCase().includes(" vs ") || article.title.toLowerCase().includes(" versus "))
      ? "comparison"
      : "guide",
    // discussionUrl — community discussion on Reddit; E-E-A-T signal for AI crawlers.
    // Only emits for "vs" articles where a comparison discussion is likely to exist.
    ...((article.title.toLowerCase().includes(" vs ") || article.title.toLowerCase().includes(" versus ")) && {
      discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(article.title)}+comparison&type=link&sort=relevance`,
    }),
    // citation — bibliographic citations referencing the comparison pages this article
    // synthesizes. LLMs and AI answer engines (Perplexity, ChatGPT, Gemini) treat
    // `citation` as a trust signal: an article that cites primary sources gets
    // elevated confidence scores when its claims are verified against those sources.
    ...(article.relatedComparisonSlugs?.length && {
      citation: article.relatedComparisonSlugs.map((s) => ({
        "@type": "WebPage",
        "@id": `${SITE_URL}/compare/${s}#webpage`,
        name: comparisonTitles?.[s] ?? s,
        url: `${SITE_URL}/compare/${s}`,
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      })),
    }),
    ...(article.relatedComparisonSlugs?.length && {
      isBasedOn: article.relatedComparisonSlugs.map((s) => ({
        "@type": "WebPage",
        "@id": `${SITE_URL}/compare/${s}#webpage`,
        name: comparisonTitles?.[s] ?? s,
        url: `${SITE_URL}/compare/${s}`,
      })),
    }),
    // mentions — named entities + linked comparison pages discussed in this article.
    // Tag-typed entities (HB139 pattern) + Article-typed comparison nodes merged
    // into one mentions[] array so AI crawlers get both entity-graph and content
    // signals from a single schema field.
    mentions: [
      ...(article.tags?.length ? article.tags.map((tag: string) => {
        const sameAs = entityWikipediaSameAs(tag);
        return {
          "@type": inferTagSchemaType(tag),
          name: tag,
          url: `${SITE_URL}/entity/${tag.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
          ...(sameAs.length > 0 && { sameAs }),
        };
      }) : []),
      // Comparison page Article nodes — tells AI crawlers which specific comparison
      // pages this blog post synthesizes, strengthening the inter-document entity graph.
      ...(article.relatedComparisonSlugs?.length ? article.relatedComparisonSlugs.map((s: string) => ({
        "@type": "Article",
        "@id": `${SITE_URL}/compare/${s}#article`,
        name: comparisonTitles?.[s] ?? s,
        url: `${SITE_URL}/compare/${s}`,
      })) : []),
    ],
    ...(article.relatedComparisonSlugs?.length && {
      significantLink: article.relatedComparisonSlugs.map((s) => `${SITE_URL}/compare/${s}`),
    }),
  };

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: article.title, url: articleUrl },
  ];

  // Build @graph: Article + BreadcrumbList + optional FAQPage + optional ItemList + optional HowTo
  // Slug-keyed extras live in src/lib/data/blog-schema-extras.ts.
  const graph: Record<string, unknown>[] = [articleSchema, breadcrumbSchema(breadcrumbs)];

  // HowTo schema for step-by-step articles (auto-detected from "How to …" title).
  const howTo = article.content
    ? howToSchemaFromBlog({
        title: article.title,
        description: article.excerpt ?? "",
        url: articleUrl,
        content: article.content,
      })
    : null;
  if (howTo) {
    graph.push(howTo);
    // hasPart — formal Article→HowTo edge; mirrors comparison page hasPart pattern so
    // Google/AI systems associate the step guide with this article in the @graph.
    (articleSchema as Record<string, unknown>).hasPart = { "@type": "HowTo", "@id": `${articleUrl}#howto` };
  }
  if (extras?.faqs?.length) {
    // Pass id="${articleUrl}#faq" so faqSchema() emits isPartOf back-reference to the Article.
    graph.push(faqSchema(extras.faqs, `${articleUrl}#faq`));
    // Merge FAQPage into hasPart — if HowTo was already set, emit an array.
    const existingPart = (articleSchema as Record<string, unknown>).hasPart;
    const faqPart = { "@type": "FAQPage", "@id": `${articleUrl}#faq` };
    (articleSchema as Record<string, unknown>).hasPart = existingPart
      ? [existingPart, faqPart]
      : faqPart;
  }
  if (extras?.itemList?.items?.length) {
    graph.push({
      "@type": "ItemList",
      name: extras.itemList.name,
      ...(extras.itemList.description && { description: extras.itemList.description }),
      numberOfItems: extras.itemList.items.length,
      itemListElement: extras.itemList.items.map((it) => ({
        "@type": "ListItem",
        position: it.position,
        name: it.name,
        url: `${articleUrl}#${it.anchor}`,
      })),
    });
  }

  // WebPage node — @id uses #webpage anchor for explicit cross-document merging;
  // matches Article.mainEntityOfPage @id so crawlers can link both nodes in one hop.
  graph.push({
    "@type": "WebPage",
    "@id": `${articleUrl}#webpage`,
    name: article.title,
    url: articleUrl,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    license: "https://creativecommons.org/licenses/by/4.0/",
    accessMode: ["textual"],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    ...(article.publishedAt && { datePublished: new Date(article.publishedAt).toISOString() }),
    ...(article.publishedAt && { dateCreated: new Date(article.publishedAt).toISOString() }),
    ...(article.updatedAt && { dateModified: new Date(article.updatedAt).toISOString() }),
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    primaryImageOfPage: { "@type": "ImageObject", url: ogImage, width: 1200, height: 630 },
    potentialAction: { "@type": "ReadAction", target: { "@type": "EntryPoint", urlTemplate: articleUrl } },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".article-excerpt", ".prose-custom h2:first-of-type", ".prose-custom p:first-of-type"],
    },
  });

  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <>
      {/* describedby — HTML Linked Data discovery; supplements Link HTTP header from middleware */}
      <link rel="describedby" type="application/ld+json" href={`${SITE_URL}/api/blog/${slug}`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-surface">
        {/* Breadcrumbs */}
        <div className="bg-surface-alt border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-text-secondary overflow-x-auto scrollbar-none whitespace-nowrap">
              <Link href="/" className="flex items-center gap-1 hover:text-primary-600 transition-colors font-medium flex-shrink-0">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="sr-only sm:not-sr-only">Home</span>
              </Link>
              <svg className="w-3 h-3 text-text-secondary/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/blog" className="hover:text-primary-600 transition-colors font-medium flex-shrink-0">
                Blog
              </Link>
              <svg className="w-3 h-3 text-text-secondary/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 border border-primary-100 text-primary-700 font-semibold truncate max-w-[180px] sm:max-w-none" aria-current="page">
                {article.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              {article.category && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 capitalize">
                  {article.category}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-primary-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readTime} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="article-excerpt text-lg text-primary-100 leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <div className="flex items-center gap-2 text-xs text-primary-200">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/20 flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">{SITE_NAME} Editorial Team</span>
              </div>
              {article.publishedAt && (
                <>
                  <span className="w-px h-4 bg-white/20" aria-hidden="true" />
                  <div className="flex items-center gap-1.5 text-xs text-primary-200">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={new Date(article.publishedAt).toISOString()}>{formatDate(article.publishedAt)}</time>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 sm:p-10">
            <div
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
          </div>

          {/* Ad: after article content */}
          <div className="my-8">
            <InContentAd />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-surface-alt text-text-secondary border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Section */}
          <div className="mt-8 p-6 bg-white rounded-xl border border-border">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Share this article
            </h3>
            <ShareBar title={article.title} slug={slug} path="blog" />
          </div>

          {/* Newsletter Signup */}
          <div className="mt-8">
            <NewsletterSignup source="blog" referrerSlug={slug} />
          </div>

          {/* Related Comparisons */}
          {article.relatedComparisonSlugs &&
            article.relatedComparisonSlugs.length > 0 && (
              <div className="mt-8 p-6 bg-white rounded-xl border border-border">
                <h3 className="text-lg font-bold text-text mb-4">
                  Related Comparisons
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
                  {article.relatedComparisonSlugs.map((compSlug) => {
                    const title = comparisonTitles[compSlug] || compSlug.replace(/-/g, " ");
                    const parts = title.split(/\s+vs\.?\s+/i);
                    return (
                      <li key={compSlug} className="flex">
                      <Link
                        href={`/compare/${compSlug}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group w-full"
                      >
                        <div className="flex -space-x-2 flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm">
                            {(parts[0] || "A").charAt(0).toUpperCase()}
                          </div>
                          <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white shadow-sm">
                            {(parts[1] || "B").charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-text group-hover:text-primary-700 transition-colors">
                          {title}
                        </span>
                        <svg className="w-3.5 h-3.5 text-text-secondary/50 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          {/* Ad: before back button */}
          <div className="my-8">
            <InContentAd />
          </div>

          {/* Back to Blog */}
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-150"
            >
              &larr; Back to Blog
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
