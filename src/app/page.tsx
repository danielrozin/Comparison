import Link from "next/link";
import { CATEGORIES } from "@/lib/utils/constants";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { SearchBox } from "@/components/home/SearchBox";
import { TrendingCard } from "@/components/home/TrendingCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { RecentSearches } from "@/components/home/RecentSearches";

export default async function HomePage() {
  const trending = await getTrendingComparisons(10);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black tracking-tight mb-6">
              Compare{" "}
              <span className="bg-gradient-to-r from-accent-400 to-primary-300 bg-clip-text text-transparent">
                Anything
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
              Sports players, countries, products, technology, history — get clear,
              visual, data-driven comparisons in seconds.
            </p>

            {/* Search Box */}
            <div id="search" className="max-w-2xl mx-auto">
              <SearchBox />
            </div>

            {/* Quick Examples */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
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

      {/* Categories */}
      <section className="bg-surface-alt py-16">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-text text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Search or Browse",
              desc: "Type any two things you want to compare, or browse our categories.",
            },
            {
              step: "2",
              title: "Get Instant Answers",
              desc: "See key differences, structured tables, and visual comparisons at a glance.",
            },
            {
              step: "3",
              title: "Explore & Discover",
              desc: "Find related comparisons, alternatives, and deeper analysis.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
