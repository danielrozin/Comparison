import Link from "next/link";
import type { RelatedBlogPost } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  technology: "bg-blue-50 text-blue-700 border-blue-100",
  products: "bg-violet-50 text-violet-700 border-violet-100",
  sports: "bg-orange-50 text-orange-700 border-orange-100",
  health: "bg-emerald-50 text-emerald-700 border-emerald-100",
  history: "bg-amber-50 text-amber-700 border-amber-100",
  entertainment: "bg-pink-50 text-pink-700 border-pink-100",
  countries: "bg-cyan-50 text-cyan-700 border-cyan-100",
  automotive: "bg-slate-50 text-slate-700 border-slate-100",
};

function getCategoryColor(category: string | undefined): string {
  if (!category) return "bg-gray-50 text-gray-600 border-gray-100";
  return CATEGORY_COLORS[category.toLowerCase()] ?? "bg-primary-50 text-primary-700 border-primary-100";
}

export function RelatedBlogPosts({
  posts,
}: {
  posts: RelatedBlogPost[];
}) {
  if (posts.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-text">Related Articles</h2>
          <p className="text-xs text-text-secondary mt-0.5">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, idx) => {
          const catColor = getCategoryColor(post.category ?? undefined);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ animationDelay: `${idx * 40}ms` }}
              className="group relative flex flex-col bg-white border border-border rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in"
            >
              {/* Top accent strip */}
              <div className="h-0.5 w-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <div className="p-4 flex flex-col flex-1">
                {/* Category badge */}
                {post.category && (
                  <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize mb-3 ${catColor}`}>
                    {post.category}
                  </span>
                )}

                {/* Title */}
                <p className="text-sm font-semibold text-text group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug mb-2 flex-1">
                  {post.title}
                </p>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-3">
                    {post.excerpt}
                  </p>
                )}

                {/* Read more CTA */}
                <div className="flex items-center gap-1 text-xs font-medium text-primary-600 mt-auto">
                  <span>Read article</span>
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
