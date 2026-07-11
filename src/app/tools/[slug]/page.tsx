import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { BackToTop } from "@/components/ui/BackToTop";
import { getPrisma } from "@/lib/db/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;
export const dynamicParams = true;

async function getToolPage(slug: string) {
  try {
    const prisma = getPrisma();
    if (!prisma) return null;
    const article = await prisma.blogArticle.findUnique({ where: { slug } });
    if (!article || article.status !== "published" || article.category !== "tools") return null;
    return article;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const prisma = getPrisma();
    if (!prisma) return [];
    const pages = await prisma.blogArticle.findMany({
      where: { status: "published", category: "tools" },
      select: { slug: true },
    });
    return pages.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getToolPage(slug);
  if (!page) return { title: "Not Found" };

  const canonicalUrl = `${SITE_URL}/tools/${slug}`;
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || page.excerpt || "";

  return {
    title,
    description,
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
      canonical: canonicalUrl,
      languages: { en: canonicalUrl, "x-default": canonicalUrl },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: page.publishedAt?.toISOString(),
      modifiedTime: page.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      site: "@aversusb",
      title,
      description,
    },
  };
}

// ── Markdown renderer ──────────────────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function renderMarkdown(md: string): string {
  let html = md;

  // Code blocks
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_m, _lang, code) =>
      `<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`
  );

  // Tables
  html = html.replace(/((?:\|.+\|\n)+)/g, (block) => {
    const rows = block.trim().split("\n");
    if (rows.length < 2) return block;
    let t =
      '<div class="overflow-x-auto my-6"><table class="w-full border-collapse rounded-lg overflow-hidden">';
    rows.forEach((row, idx) => {
      if (/^\|[\s-:|]+\|$/.test(row)) return;
      const cells = row.split("|").filter((c) => c.trim() !== "");
      if (idx === 0) {
        t +=
          "<thead><tr>" +
          cells
            .map(
              (c) =>
                `<th scope="col" class="bg-primary-50 px-4 py-3 text-left text-sm font-semibold text-text border-b border-border">${c.trim()}</th>`
            )
            .join("") +
          "</tr></thead><tbody>";
      } else {
        t +=
          `<tr class="${idx % 2 === 0 ? "bg-surface-alt" : "bg-white"}">` +
          cells
            .map(
              (c) =>
                `<td class="px-4 py-3 text-sm text-text-secondary border-b border-border">${c.trim()}</td>`
            )
            .join("") +
          "</tr>";
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

    if (line.startsWith("### ")) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      const text = line.slice(4);
      const id = slugifyHeading(text);
      processed.push(
        `<h3 id="${id}" class="text-xl font-bold text-text mt-8 mb-3">${text}</h3>`
      );
      continue;
    }
    if (line.startsWith("## ")) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      const text = line.slice(3);
      const id = slugifyHeading(text);
      processed.push(
        `<h2 id="${id}" class="text-2xl font-bold text-text mt-10 mb-4 pb-2 border-b border-border">${text}</h2>`
      );
      continue;
    }
    if (line.startsWith("# ")) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      processed.push(
        `<h1 class="text-3xl font-bold text-text mt-4 mb-6">${line.slice(2)}</h1>`
      );
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      if (inOl) { processed.push("</ol>"); inOl = false; }
      if (!inUl) {
        processed.push(
          '<ul class="list-disc list-inside space-y-2 my-4 text-text-secondary">'
        );
        inUl = true;
      }
      processed.push(`<li>${line.replace(/^[-*]\s/, "")}</li>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (!inOl) {
        processed.push(
          '<ol class="list-decimal list-inside space-y-2 my-4 text-text-secondary">'
        );
        inOl = true;
      }
      processed.push(`<li>${line.replace(/^\d+\.\s/, "")}</li>`);
      continue;
    }

    if (line.trim() === "") {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
    }

    if (line.trim() !== "" && !line.startsWith("<")) {
      if (inUl) { processed.push("</ul>"); inUl = false; }
      if (inOl) { processed.push("</ol>"); inOl = false; }
      processed.push(
        `<p class="text-text-secondary leading-relaxed my-4">${line}</p>`
      );
    } else {
      processed.push(line);
    }
  }
  if (inUl) processed.push("</ul>");
  if (inOl) processed.push("</ol>");

  html = processed.join("\n");

  // Inline formatting
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="text-text font-semibold">$1</strong>'
  );
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary-600 hover:text-primary-700 underline underline-offset-2">$1</a>'
  );

  return html;
}

// ── JSON-LD schema ─────────────────────────────────────────────────────────────

function toolPageSchema(slug: string, title: string, description: string, publishedAt: string, updatedAt: string) {
  const url = `${SITE_URL}/tools/${slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL },
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/tools`,
              name: "Tools & Calculators",
              url: `${SITE_URL}/tools`,
            },
          },
          {
            "@type": "ListItem",
            position: 3,
            name: title,
            item: { "@type": "WebPage", "@id": url, name: title, url },
          },
        ],
      },
      {
        "@type": ["WebPage", "Article"],
        additionalType: ["https://schema.org/LearningResource"],
        "@id": `${url}#article`,
        name: title,
        description,
        url,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        datePublished: publishedAt,
        dateModified: updatedAt,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
    ],
  };
}

// ── Page component ─────────────────────────────────────────────────────────────

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getToolPage(slug);
  if (!page) notFound();

  const publishedAt = page.publishedAt?.toISOString() ?? page.updatedAt.toISOString();
  const updatedAt = page.updatedAt.toISOString();
  const contentHtml = renderMarkdown(page.content);
  const schema = toolPageSchema(
    slug,
    page.title,
    page.metaDescription || page.excerpt || "",
    publishedAt,
    updatedAt
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-900 to-teal-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-emerald-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-emerald-400">›</li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true" className="text-emerald-400">›</li>
              <li className="text-white font-medium truncate">{page.title}</li>
            </ol>
          </nav>

          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
              <span>🧮</span> Calculator Guide
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-lg text-emerald-100 leading-relaxed max-w-2xl">
              {page.excerpt}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-emerald-200">
            <span>By A Versus B Editorial Team</span>
            <span aria-hidden="true">·</span>
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-12 overflow-hidden">
          <svg
            viewBox="0 0 1440 48"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,48 C360,0 1080,0 1440,48 L1440,48 L0,48 Z"
              fill="var(--color-background, #f9fafb)"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <article
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Related comparisons */}
        {page.relatedComparisonSlugs && page.relatedComparisonSlugs.length > 0 && (
          <aside className="mt-12 p-6 bg-surface-alt rounded-xl border border-border">
            <h2 className="text-lg font-bold text-text mb-4">Related Comparisons</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {page.relatedComparisonSlugs.map((s) => {
                const label = s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <li key={s}>
                    <Link
                      href={`/compare/${s}`}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium group"
                    >
                      <span className="text-primary-400 group-hover:translate-x-0.5 transition-transform">→</span>
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        <NewsletterSignup source={`tools-${slug}`} />
      </main>

      <BackToTop />
    </>
  );
}
