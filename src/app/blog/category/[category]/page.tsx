import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { BLOG_CATEGORIES, type BlogCategory } from "@/lib/utils/categories";
import { breadcrumbSchema } from "@/lib/seo/schema";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  technology: "Comparisons and guides on phones, laptops, software, and emerging tech.",
  sports: "Head-to-head matchups of athletes, teams, leagues, and sports gear.",
  entertainment: "Movies, shows, games, and streaming platform face-offs.",
  lifestyle: "Everyday choices compared — from fitness routines to productivity tools.",
  science: "Scientific concepts, discoveries, and theories compared side by side.",
  business: "Companies, strategies, tools, and market trends broken down.",
  education: "Courses, platforms, learning methods, and academic comparisons.",
  health: "Diets, supplements, treatments, and wellness approaches reviewed.",
  travel: "Destinations, airlines, hotels, and travel gear compared.",
  food: "Cuisines, ingredients, kitchen tools, and dining experiences rated.",
  automotive: "Cars, EVs, trucks, and automotive tech put to the test.",
};

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
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
    automotive: "bg-slate-100 text-slate-700",
  };
  return colors[cat] || "bg-gray-100 text-gray-700";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const valid = (BLOG_CATEGORIES as readonly string[]).includes(category);
  if (!valid) return { title: "Category Not Found" };

  const label = category.charAt(0).toUpperCase() + category.slice(1);
  const description = CATEGORY_DESCRIPTIONS[category] || `Browse ${label} articles and comparisons on ${SITE_NAME}.`;
  return {
    title: `${label} — Blog — ${SITE_NAME}`,
    description,
    alternates: { canonical: `${SITE_URL}/blog/category/${category}` },
    openGraph: {
      title: `${label} — Blog — ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/blog/category/${category}`,
    },
  };
}

export default async function CategoryHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category } = await params;
  const sp = await searchParams;

  if (!(BLOG_CATEGORIES as readonly string[]).includes(category)) {
    notFound();
  }

  const label = category.charAt(0).toUpperCase() + category.slice(1);
  const description = CATEGORY_DESCRIPTIONS[category] || `Browse ${label} articles and comparisons.`;

  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const limit = 12;
  const offset = (page - 1) * limit;

  const { articles, total } = await listBlogArticles({
    category,
    limit,
    offset,
    status: "published",
  });

  const totalPages = Math.ceil(total / limit);

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: label, url: `${SITE_URL}/blog/category/${category}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />

      <main className="min-h-screen bg-surface">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <nav className="flex items-center justify-center gap-2 text-sm text-primary-200 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white font-medium">{label}</span>
            </nav>

            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${categoryColor(category)}`}>
              {label}
            </span>

            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              {label}
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </section>

        {/* Category Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-1 justify-center">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg text-sm font-medium capitalize text-text-secondary hover:bg-surface-alt hover:text-text transition-colors"
            >
              All
            </Link>
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${cat}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  category === cat
                    ? "bg-primary-600 text-white shadow-sm"
                    : "text-text-secondary hover:bg-surface-alt hover:text-text"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📂</div>
              <h2 className="text-2xl font-bold text-text mb-2">
                No {label.toLowerCase()} articles yet
              </h2>
              <p className="text-text-secondary mb-6">
                We&apos;re working on content for this category. Check back soon!
              </p>
              <Link
                href="/blog"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Browse all articles
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group bg-white rounded-xl border border-border hover:border-primary-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                  >
                    <div className="h-2 bg-gradient-to-r from-primary-500 to-indigo-500" />

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColor(category)}`}>
                          {category}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {estimateReadTime(article.content)} min read
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-text group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                        {article.title}
                      </h2>

                      <p className="text-sm text-text-secondary flex-1 line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-border">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span className="text-primary-600 font-medium group-hover:underline">
                          Read more &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  {page > 1 && (
                    <Link
                      href={`/blog/category/${category}?page=${page - 1}`}
                      className="px-4 py-2 rounded-lg border border-border hover:border-primary-300 text-sm font-medium transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog/category/${category}?page=${p}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-primary-600 text-white"
                          : "border border-border hover:border-primary-300"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/blog/category/${category}?page=${page + 1}`}
                      className="px-4 py-2 rounded-lg border border-border hover:border-primary-300 text-sm font-medium transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

          {/* Cross-link to comparison categories */}
          <div className="mt-16 p-8 bg-white rounded-2xl border border-border text-center">
            <h2 className="text-xl font-bold text-text mb-2">
              Explore {label} Comparisons
            </h2>
            <p className="text-text-secondary mb-4">
              See detailed head-to-head comparisons in the {label.toLowerCase()} category.
            </p>
            <Link
              href={`/category/${category}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs font-bold">VS</span>
              Browse {label} comparisons
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
