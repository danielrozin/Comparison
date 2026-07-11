import Link from "next/link";
import type { RelatedBlogPost } from "@/types";

const POST_GRADIENTS = [
  "from-primary-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-cyan-400 to-sky-500",
];

const POST_GRADIENT_LIGHT = [
  "from-primary-50 to-indigo-50",
  "from-emerald-50 to-teal-50",
  "from-violet-50 to-purple-50",
  "from-amber-50 to-orange-50",
  "from-rose-50 to-pink-50",
  "from-cyan-50 to-sky-50",
];

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
  if (!category) return "bg-surface-alt text-text-secondary border-border";
  return CATEGORY_COLORS[category.toLowerCase()] ?? "bg-primary-50 text-primary-700 border-primary-100";
}

// Excerpts are ~15% of the full article — scale to estimate total article length
function estimateReadingTime(excerpt: string): number {
  const words = excerpt.trim().split(/\s+/).length;
  const estimatedTotal = words * 7;
  return Math.max(2, Math.round(estimatedTotal / 200));
}

export function RelatedBlogPosts({
  posts,
}: {
  posts: RelatedBlogPost[];
}) {
  if (posts.length === 0) return null;

  return (
    <section id="related-articles" aria-labelledby="related-articles-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <div>
          <h2 id="related-articles-heading" className="text-2xl font-display font-bold text-text">Related Articles</h2>
          <p className="text-xs text-text-secondary mt-0.5">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none">
        {posts.map((post, idx) => {
          const catColor = getCategoryColor(post.category ?? undefined);
          const readMins = estimateReadingTime(post.excerpt || "");
          const gradientDark = POST_GRADIENTS[idx % POST_GRADIENTS.length];
          const gradientLight = POST_GRADIENT_LIGHT[idx % POST_GRADIENT_LIGHT.length];
          return (
            <li key={post.slug} className="flex">
            <Link
              href={`/blog/${post.slug}`}
              style={{ animationDelay: `${idx * 40}ms` }}
              className="group relative flex flex-col bg-white border border-border rounded-xl overflow-hidden hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in w-full"
            >
              {/* Thumbnail area — gradient placeholder with article icon */}
              <div className={`relative h-24 bg-gradient-to-br ${gradientLight} flex items-center justify-center overflow-hidden`}>
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-20" aria-hidden="true">
                  <svg className="w-full h-full" viewBox="0 0 100 48" fill="none">
                    <circle cx="85" cy="10" r="20" className={`fill-current text-white`} />
                    <circle cx="15" cy="38" r="14" className={`fill-current text-white`} />
                  </svg>
                </div>
                {/* Article icon */}
                <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${gradientDark} flex items-center justify-center shadow-md`}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                {/* Reading time pill */}
                <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-semibold bg-white/80 backdrop-blur-sm text-text-secondary px-2 py-0.5 rounded-full border border-white/60">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readMins} min
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                {/* Category row */}
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  {post.category && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${catColor}`}>
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-text group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug mb-2 flex-1">
                  {post.title}
                </h3>

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
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
