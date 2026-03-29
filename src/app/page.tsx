export const dynamic = "force-dynamic";

import Link from "next/link";
import { CATEGORIES } from "@/lib/utils/constants";
import { getTrendingComparisons, getLatestComparisons, getTotalComparisonsCount } from "@/lib/services/comparison-service";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SearchBox } from "@/components/home/SearchBox";
import { TrendingCard } from "@/components/home/TrendingCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { RecentSearches } from "@/components/home/RecentSearches";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

export default async function HomePage() {
  const [trending, latest, totalCount, blogResult] = await Promise.all([
    getTrendingComparisons(10),
    getLatestComparisons(8),
    getTotalComparisonsCount(),
    listBlogArticles({ limit: 3, status: "published" }),
  ]);
  const blogArticles = blogResult.articles;

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />

        {/* Floating gradient blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "4s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black tracking-tight mb-6 animate-slide-up">
              Compare{" "}
              <span className="bg-gradient-to-r from-accent-400 to-primary-300 bg-clip-text text-transparent">
                Anything
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-6 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Sports players, countries, products, technology, history — get clear,
              visual, data-driven comparisons in seconds.
            </p>

            {/* Animated counter */}
            <div className="flex justify-center gap-8 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-accent-400 to-white bg-clip-text text-transparent">
                  {totalCount}+
                </div>
                <div className="text-xs sm:text-sm text-primary-200 mt-1">Comparisons</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white to-accent-400 bg-clip-text text-transparent">
                  {CATEGORIES.length}
                </div>
                <div className="text-xs sm:text-sm text-primary-200 mt-1">Categories</div>
              </div>
            </div>

            {/* Search Box */}
            <div id="search" className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <SearchBox />
            </div>

            {/* Quick Examples */}
            <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              {[
                { label: "Messi vs Ronaldo", href: "/compare/messi-vs-ronaldo" },
                { label: "Japan vs China", href: "/compare/japan-vs-china" },
                { label: "iPhone vs Samsung", href: "/compare/iphone-17-vs-samsung-s26" },
                { label: "WW1 vs WW2", href: "/compare/ww1-vs-ww2" },
              ].map((example) => (
                <Link
                  key={example.href}
                  href={example.href}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium text-white/90 transition-colors backdrop-blur-sm"
                >
                  {example.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path
              d="M0 80V20C240 60 480 0 720 20C960 40 1200 0 1440 20V80H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Recent Searches */}
      <RecentSearches />

      {/* Trending Comparisons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
              Trending Comparisons
            </h2>
            <p className="text-text-secondary mt-1">Most popular comparisons right now</p>
          </div>
          <Link
            href="/trending"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trending.map((item, index) => (
            <TrendingCard key={item.slug} comparison={item} rank={index + 1} />
          ))}
        </div>
      </section>

      {/* Latest Comparisons */}
      <section className="bg-surface-alt py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
                Latest Comparisons
              </h2>
              <p className="text-text-secondary mt-1">Recently added and updated comparisons</p>
            </div>
            <Link
              href="/trending"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latest.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="group bg-white rounded-xl border border-border hover:border-primary-300 hover:shadow-lg transition-all duration-200 p-5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 capitalize">
                    {item.category}
                  </span>
                  {item.updatedAt && (
                    <span className="text-xs text-text-secondary">
                      {new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-text group-hover:text-primary-600 transition-colors mb-2">
                  {item.title}
                </h3>
                <div className="mt-auto flex items-center gap-1 text-xs text-text-secondary">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {item.viewCount.toLocaleString()} views
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
              Browse by Category
            </h2>
            <p className="text-text-secondary mt-2">
              Explore comparisons across every topic
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-text text-center mb-16">
          How It Works
        </h2>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

          {[
            {
              step: "1",
              title: "Search or Browse",
              desc: "Type any two things you want to compare, or browse our categories.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
            },
            {
              step: "2",
              title: "Get Instant Answers",
              desc: "See key differences, structured tables, and visual comparisons at a glance.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
            },
            {
              step: "3",
              title: "Explore & Discover",
              desc: "Find related comparisons, alternatives, and deeper analysis.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200/50 relative z-10">
                {item.icon}
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                  {item.step}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-surface-alt py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-text mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-text-secondary mb-10 max-w-2xl mx-auto">
            Join thousands of users making informed decisions with clear, side-by-side comparisons across {CATEGORIES.length} categories.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: `${totalCount}+`, label: "Comparisons", icon: "📊" },
              { value: `${CATEGORIES.length}`, label: "Categories", icon: "📁" },
              { value: "24/7", label: "Available", icon: "🕐" },
              { value: "Free", label: "Always", icon: "💎" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-border">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-primary-700">{stat.value}</div>
                <div className="text-xs text-text-secondary mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From the Blog */}
      {blogArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-text">
                From the Blog
              </h2>
              <p className="text-text-secondary mt-1">Expert guides and in-depth analyses</p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all articles &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-xl border border-border hover:border-primary-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
              >
                <div className="h-2 bg-gradient-to-r from-primary-500 to-indigo-500" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    {article.category && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 capitalize">
                        {article.category}
                      </span>
                    )}
                    <span className="text-xs text-text-secondary">
                      {Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200))} min read
                    </span>
                  </div>
                  <h3 className="font-bold text-text group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-text-secondary flex-1 line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-border">
                    <span>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                    <span className="text-primary-600 font-medium group-hover:underline">
                      Read more &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <NewsletterSignup source="homepage" />

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
            Ready to Compare?
          </h2>
          <p className="text-primary-100 mb-8">
            Start with any comparison — sports, countries, products, or anything else.
          </p>
          <Link
            href="/#search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-full hover:bg-primary-50 transition-colors shadow-lg"
          >
            Start Comparing
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
