import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/services/blog-generator";
import { getComparisonTitlesBySlugs } from "@/lib/services/comparison-service";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600; // ISR: revalidate blog pages every 1 hour
import { ShareBar } from "@/components/engagement/ShareBar";
import { InContentAd } from "@/components/ads/AdUnit";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

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
            tableHtml += `<th class="bg-primary-50 px-4 py-3 text-left text-sm font-semibold text-text border-b border-border">${cell.trim()}</th>`;
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
  return colors[cat] || "bg-gray-100 text-gray-700";
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
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      siteName: SITE_NAME,
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
      modifiedTime: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: [ogImage],
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

  // JSON-LD Article schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: `${SITE_NAME} Team`,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
      sameAs: [
        "https://twitter.com/aversusb",
        "https://www.linkedin.com/company/aversusb",
        "https://github.com/aversusb",
      ],
    },
    datePublished: article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : undefined,
    dateModified: article.updatedAt
      ? new Date(article.updatedAt).toISOString()
      : undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    url: `${SITE_URL}/blog/${slug}`,
  };

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: article.title, url: `${SITE_URL}/blog/${slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

      <main className="min-h-screen bg-surface">
        {/* Breadcrumbs */}
        <div className="bg-surface-alt border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-text-secondary">
              <Link
                href="/"
                className="hover:text-primary-600 transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/blog"
                className="hover:text-primary-600 transition-colors"
              >
                Blog
              </Link>
              <span>/</span>
              <span className="text-text truncate max-w-[200px] sm:max-w-none">
                {article.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <header className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {article.category && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm capitalize">
                  {article.category}
                </span>
              )}
              <span className="text-xs text-primary-200">
                {readTime} min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-primary-100 leading-relaxed max-w-3xl">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center gap-4 mt-6 text-sm text-primary-200">
              <span>By {SITE_NAME} Team</span>
              <span>|</span>
              <span>{formatDate(article.publishedAt)}</span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {article.relatedComparisonSlugs.map((compSlug) => {
                    const title = comparisonTitles[compSlug] || compSlug.replace(/-/g, " ");
                    const parts = title.split(/\s+vs\.?\s+/i);
                    return (
                      <Link
                        key={compSlug}
                        href={`/compare/${compSlug}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary-300 hover:bg-primary-50 transition-all group"
                      >
                        <div className="flex -space-x-2 flex-shrink-0">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 ring-2 ring-white">
                            {(parts[0] || "A").charAt(0).toUpperCase()}
                          </div>
                          <div className="w-8 h-8 bg-accent-50 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 ring-2 ring-white">
                            {(parts[1] || "B").charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-text group-hover:text-primary-600">
                          {title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              &larr; Back to Blog
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
