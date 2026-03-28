import type { Metadata } from "next";
import Link from "next/link";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_NAME } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: `Blog — ${SITE_NAME}`,
  description:
    "Expert comparison guides, buyer's guides, and in-depth articles to help you make better decisions.",
  openGraph: {
    title: `Blog — ${SITE_NAME}`,
    description:
      "Expert comparison guides, buyer's guides, and in-depth articles to help you make better decisions.",
  },
};

const CATEGORIES = [
  "all",
  "technology",
  "sports",
  "entertainment",
  "lifestyle",
  "science",
  "business",
  "education",
  "health",
  "travel",
  "food",
  "automotive",
];

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
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
    automotive: "bg-slate-100 text-slate-700",
  };
  return colors[cat] || "bg-gray-100 text-gray-700";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category =
    params.category && params.category !== "all"
      ? params.category
      : undefined;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 12;
  const offset = (page - 1) * limit;

  const { articles, total } = await listBlogArticles({
    category,
    limit,
    offset,
    status: "published",
  });

  const totalPages = Math.ceil(total / limit);
  const activeCategory = params.category || "all";

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
            The Comparison Blog
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto">
            Expert guides, in-depth analyses, and data-driven insights to help
            you compare and choose the best options.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-1 justify-center">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === "all" ? "/blog" : `/blog?category=${cat}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeCategory === cat
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
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-text mb-2">
              No articles yet
            </h2>
            <p className="text-text-secondary">
              {category
                ? `No articles found in the "${category}" category.`
                : "Blog articles are coming soon. Check back later!"}
            </p>
            {category && (
              <Link
                href="/blog"
                className="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                View all articles
              </Link>
            )}
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
                  {/* Gradient header */}
                  <div className="h-2 bg-gradient-to-r from-primary-500 to-indigo-500" />

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between mb-3">
                      {article.category && (
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColor(
                            article.category
                          )}`}
                        >
                          {article.category}
                        </span>
                      )}
                      <span className="text-xs text-text-secondary">
                        {estimateReadTime(article.content)} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-text group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-text-secondary flex-1 line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>

                    {/* Footer */}
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
                    href={`/blog?${category ? `category=${category}&` : ""}page=${page - 1}`}
                    className="px-4 py-2 rounded-lg border border-border hover:border-primary-300 text-sm font-medium transition-colors"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={`/blog?${category ? `category=${category}&` : ""}page=${p}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-primary-600 text-white"
                          : "border border-border hover:border-primary-300"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
                {page < totalPages && (
                  <Link
                    href={`/blog?${category ? `category=${category}&` : ""}page=${page + 1}`}
                    className="px-4 py-2 rounded-lg border border-border hover:border-primary-300 text-sm font-medium transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
