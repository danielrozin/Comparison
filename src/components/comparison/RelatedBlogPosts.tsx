import Link from "next/link";
import type { RelatedBlogPost } from "@/types";

export function RelatedBlogPosts({
  posts,
}: {
  posts: RelatedBlogPost[];
}) {
  if (posts.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Related Articles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex flex-col p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              {post.category && (
                <span className="text-xs text-text-secondary capitalize">{post.category}</span>
              )}
            </div>
            <p className="text-sm font-medium text-text group-hover:text-primary-700 transition-colors line-clamp-2 mb-1">
              {post.title}
            </p>
            {post.excerpt && (
              <p className="text-xs text-text-secondary line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
