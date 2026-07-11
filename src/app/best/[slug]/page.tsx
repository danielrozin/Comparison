import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { BackToTop } from "@/components/ui/BackToTop";
import { BEST_CONFIG, type BestEntry } from "@/lib/data/best-entries";
import { getPrisma } from "@/lib/db/prisma";
import { personAuthorNode, teachesDefinedTerm } from "@/lib/seo/schema";

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
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
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
      images: [{ url: ogImage, alt: `${entry.h1} — A Versus B best-of list` }],
    },
    other: {
      "citation_title": entry.title,
      "citation_author": entry.authorName,
      "citation_publication_date": entry.publishedAt?.slice(0, 10) ?? "",
      "citation_online_date": entry.updatedAt?.slice(0, 10) ?? "",
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": entry.description,
      "abstract": entry.description,
      "DC.title": entry.title,
      "DC.description": entry.description,
      "DC.creator": entry.authorName,
      "DC.publisher": "A Versus B",
      "DC.date": entry.publishedAt?.slice(0, 10) ?? "",
      "DC.language": "en",
      "DC.subject": `${entry.h1}, Best Of`,
      "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
      "DC.coverage": "Worldwide",
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
          `<th scope="col" class="bg-primary-50 px-4 py-3 text-left text-sm font-semibold text-text border-b border-border">${c.trim()}</th>`
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
      processed.push(`<h2${anchorId} class="text-3xl font-bold text-text mt-4 mb-6">${cleanLine.slice(2)}</h2>`);
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
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
          { "@type": "ListItem", position: 2, name: "Best Lists", item: { "@type": "WebPage", "@id": `${SITE_URL}/best`, name: "Best Lists", url: `${SITE_URL}/best` } },
          { "@type": "ListItem", position: 3, name: entry.h1, item: { "@type": "WebPage", "@id": url, name: entry.h1, url } },
        ],
      },
      {
        "@type": ["CollectionPage", "Article"],
        // LearningResource — signals Google Education carousel + AI educational intent routing.
        // Best-of pages are structured decision guides, which qualifies them as LearningResource
        // under Schema.org's definition (a resource designed to support learning a skill/topic).
        additionalType: ["https://schema.org/LearningResource", "https://schema.org/InDepthArticle"],
        learningResourceType: "Roundup",
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
        dateCreated: entry.publishedAt,
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
        reviewedBy: [personAuthorNode(), { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL }],
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
        accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
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
          cssSelector: ["h1", "article.prose-custom p:first-of-type", "article.prose-custom"],
        },
        educationalLevel: "General",
        // teaches — explicit learning outcome for AI classifiers routing "best X" queries.
        // ChatGPT and Perplexity route decision queries to pages with a `teaches` field.
        teaches: teachesDefinedTerm(`How to choose the best ${entry.h1.toLowerCase().replace(/^best\s+/i, "")}`, url),
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
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["article.prose-custom"] },
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
      <link rel="cite-as" href={`${SITE_URL}/best/${entry.slug}`} />
      <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
      <meta httpEquiv="content-language" content="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <ReadingProgressBar articleId="best-article-body" />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-800 to-primary-800 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="best-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#best-hero-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav aria-label="breadcrumb" className="text-sm text-emerald-200 mb-5">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-emerald-400/60 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li><Link href="/best" className="hover:text-white transition-colors">Best lists</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-emerald-400/60 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li className="text-white font-medium" aria-current="page">{entry.h1}</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight">
                {entry.h1}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-emerald-200">
                {entry.authorName && (
                  entry.authorUrl ? (
                    <Link href={entry.authorUrl} rel="author" className="flex items-center gap-2 hover:text-white transition-colors group">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400/80 to-accent-500/80 flex items-center justify-center border-2 border-white/30 flex-shrink-0 shadow-sm group-hover:border-white/50 transition-all" aria-hidden="true">
                        <span className="text-white font-bold text-xs tracking-tight select-none leading-none">
                          {entry.authorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-semibold">{entry.authorName}</span>
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400/80 to-accent-500/80 flex items-center justify-center border-2 border-white/30 flex-shrink-0 shadow-sm" aria-hidden="true">
                        <span className="text-white font-bold text-xs tracking-tight select-none leading-none">
                          {entry.authorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-semibold">{entry.authorName}</span>
                    </span>
                  )
                )}
                {entry.updatedAt && (
                  <time dateTime={new Date(entry.updatedAt).toISOString()} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Updated {new Date(entry.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article
          id="best-article-body"
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        <div className="mt-12">
          <NewsletterSignup source={`best-${slug}`} />
        </div>
      </div>
      <BackToTop />
    </>
  );
}
