
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/utils/constants";
import { getAllMockSlugs, getMockComparison } from "@/lib/services/mock-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `Alternatives to ${name}`,
    description: `Discover the best alternatives to ${name}. Compare ${name} against top competitors and find the best option for you.`,
    alternates: { canonical: `${SITE_URL}/alternatives/${slug}` },
  };
}

export default async function AlternativesPage({ params }: PageProps) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Find all comparisons that include this entity and extract alternatives
  const allSlugs = getAllMockSlugs();
  const alternatives: { name: string; slug: string; comparisonSlug: string; comparisonTitle: string }[] = [];

  for (const compSlug of allSlugs) {
    const comp = getMockComparison(compSlug);
    if (!comp) continue;

    const matchEntity = comp.entities.find((e) => e.slug === slug || compSlug.includes(slug));
    if (matchEntity) {
      const otherEntity = comp.entities.find((e) => e.slug !== matchEntity.slug);
      if (otherEntity) {
        alternatives.push({
          name: otherEntity.name,
          slug: otherEntity.slug,
          comparisonSlug: comp.slug,
          comparisonTitle: comp.title,
        });
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
          <li>/</li>
          <li><Link href={`/entity/${slug}`} className="hover:text-primary-600">{name}</Link></li>
          <li>/</li>
          <li className="text-text font-medium">Alternatives</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-2">
        Alternatives to {name}
      </h1>
      <p className="text-text-secondary mb-8">
        {alternatives.length} alternative{alternatives.length !== 1 ? "s" : ""} found
      </p>

      {alternatives.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alternatives.map((alt) => (
            <div key={alt.comparisonSlug} className="bg-white border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center">
                  <span className="text-accent-600 font-bold text-lg">{alt.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-text">{alt.name}</h3>
                  <p className="text-xs text-text-secondary">Alternative to {name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/compare/${alt.comparisonSlug}`}
                  className="flex-1 text-center py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Compare
                </Link>
                <Link
                  href={`/entity/${alt.slug}`}
                  className="flex-1 text-center py-2 bg-surface-alt text-text text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors border border-border"
                >
                  Learn more
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-alt rounded-xl">
          <p className="text-text-secondary mb-4">No alternatives found for {name} yet.</p>
          <Link
            href="/#search"
            className="inline-block px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Search for a comparison
          </Link>
        </div>
      )}
    </div>
  );
}
