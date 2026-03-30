import Link from "next/link";
import { getRelatedBlogArticles } from "@/lib/services/blog-generator";

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

export async function RelatedArticles({
  comparisonSlug,
  category,
}: {
  comparisonSlug: string;
  category?: string;
}) {
  const articles = await getRelatedBlogArticles(comparisonSlug, category, 3);

  if (articles.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-text">Related Articles</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {articles.map((article) => {
            const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group p-4 rounded-xl border border-border hover:border-primary-300 hover:shadow-md transition-all duration-200"
              >
                {article.category && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${categoryColor(article.category)}`}>
                    {article.category}
                  </span>
                )}
                <h3 className="text-sm font-bold text-text group-hover:text-primary-600 transition-colors mt-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="text-xs text-primary-600 font-medium mt-2 inline-block group-hover:underline">
                  {readTime} min read &rarr;
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 text-center">
          <Link
            href={category ? `/blog/category/${category}` : "/blog"}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
          >
            View all articles &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
