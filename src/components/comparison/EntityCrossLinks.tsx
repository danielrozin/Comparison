import Link from "next/link";

interface EntityComparison {
  slug: string;
  title: string;
}

interface EntityCrossLinksProps {
  entities: { name: string; slug: string }[];
  /** Map of entity slug -> comparisons that also feature that entity */
  entityComparisons: Record<string, EntityComparison[]>;
  currentSlug: string;
}

export function EntityCrossLinks({
  entities,
  entityComparisons,
  currentSlug,
}: EntityCrossLinksProps) {
  const hasAny = entities.some(
    (e) => (entityComparisons[e.slug] || []).filter((c) => c.slug !== currentSlug).length > 0
  );
  if (!hasAny) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-xl font-display font-bold text-text mb-6">
        More Comparisons by Entity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entities.map((entity) => {
          const comparisons = (entityComparisons[entity.slug] || []).filter(
            (c) => c.slug !== currentSlug
          );
          if (comparisons.length === 0) return null;
          return (
            <div
              key={entity.slug}
              className="bg-white border border-border rounded-xl p-5"
            >
              <h3 className="font-semibold text-text text-sm mb-3">
                Other comparisons with{" "}
                <Link
                  href={`/entity/${entity.slug}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {entity.name}
                </Link>
              </h3>
              <ul className="space-y-2">
                {comparisons.slice(0, 5).map((comp) => (
                  <li key={comp.slug}>
                    <Link
                      href={`/compare/${comp.slug}`}
                      className="text-sm text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {comp.title}
                    </Link>
                  </li>
                ))}
                {comparisons.length > 5 && (
                  <li>
                    <Link
                      href={`/entity/${entity.slug}`}
                      className="text-sm text-accent-600 hover:text-accent-700 font-medium"
                    >
                      See all {comparisons.length} comparisons &rarr;
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
