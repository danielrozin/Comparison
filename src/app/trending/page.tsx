import type { Metadata } from "next";
import Link from "next/link";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { TrendingCard } from "@/components/home/TrendingCard";
import { Pagination } from "@/components/ui/Pagination";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

export const revalidate = 300; // ISR: revalidate trending page every 5 minutes

const ITEMS_PER_PAGE = 20;

const trendingDescription = "See the most popular comparisons right now — sports, countries, products, technology, and more.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent("Trending Comparisons")}&type=trending`;

export const metadata: Metadata = {
  title: "Trending Comparisons",
  description: trendingDescription,
  alternates: { canonical: `${SITE_URL}/trending` },
  openGraph: {
    title: "Trending Comparisons",
    description: trendingDescription,
    url: `${SITE_URL}/trending`,
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Trending Comparisons" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending Comparisons",
    description: trendingDescription,
    images: [ogImage],
  },
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TrendingPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  // Fetch enough items for pagination (up to 100)
  const allTrending = await getTrendingComparisons(100);
  const totalPages = Math.ceil(allTrending.length / ITEMS_PER_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
  const trending = allTrending.slice(startIdx, startIdx + ITEMS_PER_PAGE);

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
          {allTrending.length > ITEMS_PER_PAGE && (
            <span className="ml-1">Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, allTrending.length)} of {allTrending.length}.</span>
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trending.map((item, index) => (
            <TrendingCard key={item.slug} comparison={item} rank={startIdx + index + 1} />
          ))}
        </div>

        <Pagination currentPage={safePage} totalPages={totalPages} basePath="/trending" />
      </div>
    </>
  );
}
