import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { BEST_CONFIG, type BestEntry } from "@/lib/data/best-entries";
import { getPrisma } from "@/lib/db/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const staticSlugs = Object.keys(BEST_CONFIG).map((slug) => ({ slug }));
  try {
    const prisma = getPrisma();
    if (!prisma) return staticSlugs;
    const dbPages = await prisma.bestPage.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    const dbSlugs = dbPages.map((p) => ({ slug: p.slug }));
    const all = [...staticSlugs, ...dbSlugs.filter((d) => !staticSlugs.some((s) => s.slug === d.slug))];
    return all;
  } catch {
    return staticSlugs;
  }
}

async function getEntry(slug: string): Promise<BestEntry | null> {
  // Static config takes precedence for existing pages
  if (BEST_CONFIG[slug]) return BEST_CONFIG[slug];

  try {
    const prisma = getPrisma();
    if (!prisma) return null;
    const row = await prisma.bestPage.findUnique({ where: { slug, status: "published" } });
    if (!row) return null;
    return {
      slug: row.slug,
      title: row.title,
      description: row.description,
      h1: row.h1,
      authorName: row.authorName,
      authorUrl: row.authorUrl ?? undefined,
      category: row.category ?? undefined,
      bodyMarkdown: row.bodyMarkdown,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString().slice(0, 10) : row.createdAt.toISOString().slice(0, 10),
      updatedAt: row.updatedAt.toISOString().slice(0, 10),
      listItems: (row.listItems as BestEntry["listItems"]) ?? [],
      faqs: (row.faqs as BestEntry["faqs"]) ?? [],
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) return { title: "Not Found" };

  const canonicalUrl = `${SITE_URL}/best/${slug}`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(entry.h1)}&type=best`;
  return {
    title: entry.title,
    description: entry.description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: { "en": canonicalUrl, "x-default": canonicalUrl },
    },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url: canonicalUrl,
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: entry.publishedAt,
      modifiedTime: entry.updatedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${entry.h1} — A Versus B best-of list` }],
    },
    twitter: {
      card: "summary_large_image",
    site: "@aversusb",
      title: entry.title,
      description: entry.description,
      images: [ogImage],
    },
    other: {
      "citation_title": entry.title,
      "citation_author": entry.authorName,
      "citation_publication_date": entry.publishedAt?.slice(0, 10) ?? "",
      "citation_online_date": entry.updatedAt?.slice(0, 10) ?? "",
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": entry.description,
      "DC.title": entry.title,
      "DC.creator": entry.authorName,
      "DC.publisher": "A Versus B",
      "DC.date": entry.publishedAt?.slice(0, 10) ?? "",
      "DC.language": "en",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.identifier": canonicalUrl,
      "thumbnail": ogImage,
    },
  };
}

// ── Markdown renderer (extends blog renderer with anchor IDs and ordered lists) ──

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) =>
    `<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`
  );

  // Tables
  html = html.replace(/((?:\|.+\|\n)+)/g, (block) => {
    const rows = block.trim().split("\n");
    if (rows.length < 2) return block;
    let t = '<div class="overflow-x-auto my-6"><table class="w-full border-collapse rounded-lg overflow-hidden">';
    rows.forEach((row, idx) => {
      if (/^\|[\s-:|]+\|$/.test(row)) return;
      const cells = row.split("|").filter((c) => c.trim() !== "");
      if (idx === 0) {
        t += "<thead><tr>" + cells.map((c) =>
          `<th class="bg-primary-50 px-4 py-3 text-left text-sm font-semibold text-text border-b border-border">${c.trim()}</th>`
        ).join("") + "</tr></thead><tbody>";
      } else {
        t += `<tr class="${idx % 2 === 0 ? "bg-surface-alt" : "bg-white"}">` +
          cells.map((c) =>
            `<td class="px-4 py-3 text-sm text-text-secondary border-b border-border">${c.trim()}</td>`
          ).join("") + "</tr>";
      }
    });
    t += "</tbody></table></div>";
    return t;
  });

  // Horizontal rule
  html = html.replace(/^---\s*$/gm, '<hr class="my-8 border-border" />');

  const lines = html.split("\n");
  const processed: string[] = [];
  let inUl = false;
  let inOl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Extract optional {#anchor} from heading
    const anchorMatch = line.match(/\{#([\w-]+)\}\s*$/);
    const anchorId = anchorMatch ? ` id="${anchorMatch[1]}"` : "";
    const cleanLine = anchorMatch ? line.replace(/\s*\{#[\w-]+\}\s*$/, "") : line;

    if (cleanLine.startsWith("### ")) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      processed.push(`<h3${anchorId} class="text-xl font-bold text-text mt-8 mb-3">${cleanLine.slice(4)}</h3>`);
      continue;
    }
    if (cleanLine.startsWith("## ")) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      processed.push(`<h2${anchorId} class="text-2xl font-bold text-text mt-10 mb-4 pb-2 border-b border-border">${cleanLine.slice(3)}</h2>`);
      continue;
    }
    if (cleanLine.startsWith("# ")) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      processed.push(`<h1${anchorId} class="text-3xl font-bold text-text mt-4 mb-6">${cleanLine.slice(2)}</h1>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      if (inOl) { processed.push("</ol>"); inOl = false; }
      if (!inUl) { processed.push('<ul class="list-disc list-inside space-y-2 my-4 text-text-secondary">'); inUl = true; }
      processed.push(`<li>${line.replace(/^[-*]\s/, "")}</li>`);
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (!inOl) { processed.push('<ol class="list-decimal list-inside space-y-2 my-4 text-text-secondary">'); inOl = true; }
      processed.push(`<li>${line.replace(/^\d+\.\s/, "")}</li>`);
      continue;
    }

    // End lists on blank line
    if (line.trim() === "") {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
    }

    if (line.trim() !== "" && !line.startsWith("<")) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      processed.push(`<p class="text-text-secondary leading-relaxed my-4">${line}</p>`);
    } else {
      processed.push(line);
    }
  }
  if (inUl) processed.push("</ul>");
  if (inOl) processed.push("</ol>");

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

// ── JSON-LD schema ──

function bestPageSchema(entry: BestEntry) {
  const url = `${SITE_URL}/best/${entry.slug}`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(entry.h1)}&type=best`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Best lists", item: `${SITE_URL}/best` },
          { "@type": "ListItem", position: 3, name: entry.h1, item: url },
        ],
      },
      {
        "@type": ["CollectionPage", "Article"],
        "@id": `${url}#article`,
        name: entry.h1,
        description: entry.description,
        abstract: entry.description,
        url,
        inLanguage: "en-US",
        genre: "Roundup Guide",
        creativeWorkStatus: "Published",
        isAccessibleForFree: true,
        conditionsOfAccess: "Free",
        interactivityType: "expositive",
        datePublished: entry.publishedAt,
        dateModified: entry.updatedAt,
        lastReviewed: entry.updatedAt,
        contentReferenceTime: entry.updatedAt,
        thumbnailUrl: ogImage,
        image: {
          "@type": "ImageObject",
          "@id": `${url}#primaryImage`,
          url: ogImage,
          contentUrl: ogImage,
          width: 1200,
          height: 630,
          caption: entry.h1,
        },
        keywords: entry.h1.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").slice(0, 8).join(", "),
        author: {
          "@type": "Person",
          name: entry.authorName,
          ...(entry.authorUrl ? { url: `${SITE_URL}${entry.authorUrl}` } : {}),
        },
        publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
        reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
        alternativeHeadline: `Top ${entry.h1} — Expert Picks ${new Date().getFullYear()}`,
        license: "https://creativecommons.org/licenses/by/4.0/",
        usageInfo: `${SITE_URL}/terms`,
        copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
        copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
        acquireLicensePage: `${SITE_URL}/terms`,
        audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
        accessMode: ["textual"],
        accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
        accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
        publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
        ethicsPolicy: `${SITE_URL}/disclaimer`,
        correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
        potentialAction: { "@type": "ReadAction", target: url },
        // speakable — expand beyond h1 to cover the first body paragraph and FAQ answers.
        // AI voice assistants (Google Assistant, Siri) and LLM answer engines extract
        // speakable sections first when generating spoken or cited responses.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "article.prose-custom p:first-of-type", ".faq-answer"],
        },
        educationalLevel: "General",
        // teaches — explicit learning outcome for AI classifiers routing "best X" queries.
        // ChatGPT and Perplexity route decision queries to pages with a `teaches` field.
        teaches: `How to choose the best ${entry.h1.toLowerCase().replace(/^best\s+/i, "")}`,
        // educationalUse — signals this is a ranked guide, not a review or comparison.
        educationalUse: "guide",
        timeRequired: `PT${Math.max(4, Math.ceil(entry.listItems.length * 1.5))}M`,
        wordCount: Math.max(600, entry.listItems.length * 120),
        // hasPart — formal Article→FAQPage edge so Google/AI attribute FAQ items to this article.
        ...(entry.faqs.length > 0 && { hasPart: { "@type": "FAQPage", "@id": `${url}#faq` } }),
        // mentions — typed entity references for each item in the best-of list.
        // AI Knowledge Graphs use mentions to link this roundup article to the
        // individual entity ProfilePages on A Versus B.
        mentions: entry.listItems.map((item) => ({
          "@type": "Thing",
          name: item.name,
          url: `${url}#${item.anchor}`,
        })),
        mainEntity: {
          "@type": "ItemList",
          "@id": `${url}#list`,
          name: entry.h1,
          description: entry.description,
          itemListOrder: "https://schema.org/ItemListOrderDescending",
          numberOfItems: entry.listItems.length,
          itemListElement: entry.listItems.map((item) => ({
            "@type": "ListItem",
            position: item.position,
            name: item.name,
            url: `${url}#${item.anchor}`,
            item: {
              "@type": "Thing",
              name: item.name,
              url: `${url}#${item.anchor}`,
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        // isPartOf — back-reference from FAQPage to Article so AI crawlers confirm
        // FAQ answers belong to this best-of guide.
        isPartOf: { "@type": "Article", "@id": `${url}#article` },
        speakable: { "@type": "SpeakableSpecification", cssSelector: [".faq-answer"] },
        mainEntity: entry.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a, upvoteCount: 1 },
        })),
      },
    ],
  };
}

export default async function BestPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getEntry(slug);
  if (!entry) notFound();

  const schema = bestPageSchema(entry);
  const bodyHtml = renderMarkdown(entry.bodyMarkdown);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="text-sm text-text-secondary mb-6">
          <ol className="flex items-center gap-1 flex-wrap">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/best" className="hover:underline">Best lists</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-text">{entry.h1}</span></li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 leading-tight">
            {entry.h1}
          </h1>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            {entry.authorName && (
              <span>
                By{" "}
                {entry.authorUrl ? (
                  <Link href={entry.authorUrl} className="text-blue-600 hover:underline">
                    {entry.authorName}
                  </Link>
                ) : (
                  <span>{entry.authorName}</span>
                )}
              </span>
            )}
            {entry.updatedAt && (
              <span>
                Last updated{" "}
                {new Date(entry.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </header>

        {/* Article body */}
        <article
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </main>
    </>
  );
}
