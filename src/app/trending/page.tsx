import type { Metadata } from "next";
import Link from "next/link";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { TrendingCard } from "@/components/home/TrendingCard";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: "Trending Comparisons",
  description: "See the most popular comparisons right now — sports, countries, products, technology, and more.",
  alternates: { canonical: `${SITE_URL}/trending` },
};

export default async function TrendingPage() {
  const trending = await getTrendingComparisons(20);

  const schema = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Trending", url: `${SITE_URL}/trending` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li className="text-text font-medium">Trending</li>
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-2">
          Trending Comparisons
        </h1>
        <p className="text-text-secondary mb-8">
          The most popular comparisons being viewed right now.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trending.map((item, index) => (
            <TrendingCard key={item.slug} comparison={item} rank={index + 1} />
          ))}
        </div>
      </div>
    </>
  );
}
