import Link from "next/link";
import { CATEGORIES } from "@/lib/utils/constants";

// Category affinity map (synced with internal-linking-engine.ts)
const RELATED_CATEGORIES: Record<string, string[]> = {
  sports: ["celebrities"],
  countries: ["military", "economy"],
  technology: ["products", "companies"],
  products: ["technology", "brands"],
  celebrities: ["sports"],
  history: ["military", "countries"],
  military: ["countries", "history"],
  economy: ["countries", "companies"],
  companies: ["brands", "technology", "economy"],
  brands: ["products", "companies"],
  health: ["products"],
  entertainment: ["celebrities"],
  automotive: ["products", "technology"],
  software: ["technology", "companies"],
  finance: ["economy", "companies"],
  education: [],
  travel: ["countries"],
};

interface InternalLinksProps {
  currentSlug: string;
  category: string | null;
  entities: { name: string; slug: string }[];
  relatedComparisons: { slug: string; title: string; category: string | null }[];
}

export function InternalLinks({
  currentSlug,
  category,
  entities,
  relatedComparisons,
}: InternalLinksProps) {
  const currentCategory = CATEGORIES.find((c) => c.slug === category);

  // Show only logically related categories
  const relatedCatSlugs = category ? (RELATED_CATEGORIES[category] || []) : [];
  const relatedCats = CATEGORIES.filter((c) => relatedCatSlugs.includes(c.slug));

  // Filter related comparisons to same or related categories only
  const validCategories = new Set([category, ...relatedCatSlugs].filter(Boolean));
  const filteredRelated = relatedComparisons.filter(
    (comp) => !comp.category || validCategories.has(comp.category)
  );

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Entity links */}
        {entities.length > 0 && (
          <div className="bg-white border border-border rounded-xl p-4 sm:p-5">
            <h3 className="font-semibold text-text text-sm mb-3">Explore Entities</h3>
            <ul className="space-y-2">
              {entities.map((entity) => (
                <li key={entity.slug}>
                  <Link
                    href={`/entity/${entity.slug}`}
                    className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    All about {entity.name} &rarr;
                  </Link>
                </li>
              ))}
              {entities.map((entity) => (
                <li key={`alt-${entity.slug}`}>
                  <Link
                    href={`/alternatives/${entity.slug}`}
                    className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Alternatives to {entity.name} &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Category links — only show current + logically related */}
        <div className="bg-white border border-border rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold text-text text-sm mb-3">
            {currentCategory ? `More ${currentCategory.name}` : "Browse Categories"}
          </h3>
          <ul className="space-y-2">
            {currentCategory && (
              <li>
                <Link
                  href={`/category/${currentCategory.slug}`}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
                >
                  {currentCategory.icon} All {currentCategory.name} Comparisons &rarr;
                </Link>
              </li>
            )}
            {relatedCats.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="text-sm text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {cat.icon} {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* People also compare — filtered to same/related categories */}
        <div className="bg-white border border-border rounded-xl p-4 sm:p-5">
          <h3 className="font-semibold text-text text-sm mb-3">People Also Compare</h3>
          <ul className="space-y-2">
            {filteredRelated.slice(0, 5).map((comp) => (
              <li key={comp.slug}>
                <Link
                  href={`/compare/${comp.slug}`}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {comp.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={currentCategory ? `/category/${currentCategory.slug}` : "/trending"}
                className="text-sm text-accent-600 hover:text-accent-700 hover:underline font-medium"
              >
                See more {currentCategory?.name.toLowerCase() || "trending"} &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
