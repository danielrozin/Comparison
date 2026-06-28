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

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Trending", url: `${SITE_URL}/trending` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Trending Comparisons on A Versus B",
    description: trendingDescription,
    abstract: "The most-viewed X vs Y comparisons right now — ranked by views, votes, and social signals.",
    url: `${SITE_URL}/trending`,
    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    lastReviewed: new Date().toISOString().slice(0, 10),
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1"] },
    keywords: "trending comparisons, most popular comparisons, top vs comparisons 2026",
  };

  // ItemList schema — lets AI answer engines enumerate the trending comparisons
  // directly from structured data, without parsing the rendered HTML.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trending Comparisons on A Versus B",
    description: trendingDescription,
    url: `${SITE_URL}/trending`,
    numberOfItems: trending.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: trending.map((item, index) => ({
      "@type": "ListItem",
      position: startIdx + index + 1,
      name: item.title,
      url: `${SITE_URL}/compare/${item.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Trending Hero */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-orange-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-orange-400">/</li>
              <li className="text-white font-medium">Trending</li>
            </ol>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <span className="text-3xl sm:text-4xl" role="img" aria-label="Trending">🔥</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                Trending Comparisons
              </h1>
              <p className="text-orange-100 mt-1.5 text-sm sm:text-base">
                The most popular comparisons right now
                {allTrending.length > ITEMS_PER_PAGE && (
                  <span className="ml-1">· Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, allTrending.length)} of {allTrending.length}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

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
