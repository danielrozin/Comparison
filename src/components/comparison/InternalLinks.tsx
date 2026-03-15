import Link from "next/link";
import { CATEGORIES } from "@/lib/utils/constants";

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
  const otherCategories = CATEGORIES.filter((c) => c.slug !== category).slice(0, 5);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Entity links */}
        {entities.length > 0 && (
          <div className="bg-white border border-border rounded-xl p-5">
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
              {entities.length >= 2 && (
                <li>
                  <Link
                    href={`/alternatives/${entities[0].slug}`}
                    className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    Alternatives to {entities[0].name} &rarr;
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Category links */}
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-semibold text-text text-sm mb-3">
            {currentCategory ? `More ${currentCategory.name}` : "Browse Categories"}
          </h3>
          <ul className="space-y-2">
            {currentCategory && (
              <li>
                <Link
                  href={`/category/${currentCategory.slug}`}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {currentCategory.icon} All {currentCategory.name} Comparisons &rarr;
                </Link>
              </li>
            )}
            {otherCategories.map((cat) => (
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

        {/* People also compare */}
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-semibold text-text text-sm mb-3">People Also Compare</h3>
          <ul className="space-y-2">
            {relatedComparisons.slice(0, 5).map((comp) => (
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
                href="/trending"
                className="text-sm text-accent-600 hover:text-accent-700 hover:underline font-medium"
              >
                See all trending &rarr;
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
