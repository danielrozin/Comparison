import Link from "next/link";
import { CATEGORIES } from "@/lib/utils/constants";
import { CategoryIcon } from "@/lib/utils/category-icons";

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

function CardHeader({ icon, title, gradient = "from-primary-500 to-accent-600" }: { icon: React.ReactNode; title: string; gradient?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
        {icon}
      </div>
      <h3 className="font-semibold text-text text-sm">{title}</h3>
    </div>
  );
}

export function InternalLinks({
  currentSlug,
  category,
  entities,
  relatedComparisons,
}: InternalLinksProps) {
  const currentCategory = CATEGORIES.find((c) => c.slug === category);

  const relatedCatSlugs = category ? (RELATED_CATEGORIES[category] || []) : [];
  const relatedCats = CATEGORIES.filter((c) => relatedCatSlugs.includes(c.slug));

  const validCategories = new Set([category, ...relatedCatSlugs].filter(Boolean));
  const filteredRelated = relatedComparisons.filter(
    (comp) => !comp.category || validCategories.has(comp.category)
  );

  return (
    <section aria-labelledby="explore-more-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <div>
          <h2 id="explore-more-heading" className="text-xl font-display font-bold text-text">Explore More</h2>
          <p className="text-xs text-text-secondary mt-0.5">Related comparisons and categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Entity links */}
        {entities.length > 0 && (
          <div className="group relative bg-white border border-border rounded-2xl p-4 sm:p-5 hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 opacity-100" />
            <CardHeader
              title="Explore Entities"
              gradient="from-primary-500 to-primary-700"
              icon={
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <ul className="space-y-2">
              {entities.map((entity) => (
                <li key={entity.slug}>
                  <Link
                    href={`/entity/${entity.slug}`}
                    className="group flex items-center justify-between gap-2 text-sm text-text hover:text-primary-700 py-1 rounded-lg hover:bg-primary-50/50 px-1 -mx-1 transition-all"
                  >
                    <span>All about <span className="font-medium">{entity.name}</span></span>
                    <svg className="w-3.5 h-3.5 text-text-secondary/40 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
              {entities.map((entity) => (
                <li key={`alt-${entity.slug}`}>
                  <Link
                    href={`/alternatives/${entity.slug}`}
                    className="group flex items-center justify-between gap-2 text-sm text-text hover:text-primary-700 py-1 rounded-lg hover:bg-primary-50/50 px-1 -mx-1 transition-all"
                  >
                    <span>Alternatives to <span className="font-medium">{entity.name}</span></span>
                    <svg className="w-3.5 h-3.5 text-text-secondary/40 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Category links */}
        <div className="group relative bg-white border border-border rounded-2xl p-4 sm:p-5 hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-100" />
          <CardHeader
            title={currentCategory ? `More ${currentCategory.name}` : "Browse Categories"}
            gradient="from-indigo-500 to-purple-600"
            icon={
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
          />
          <ul className="space-y-2">
            {currentCategory && (
              <li>
                <Link
                  href={`/category/${currentCategory.slug}`}
                  className="group flex items-center justify-between gap-2 py-1 rounded-lg hover:bg-primary-50/50 px-1 -mx-1 transition-all"
                >
                  <span className="text-sm font-semibold text-primary-700 flex items-center gap-1.5">
                    <CategoryIcon category={currentCategory.slug} className="w-4 h-4" /> All {currentCategory.name}
                  </span>
                  <svg className="w-3.5 h-3.5 text-primary-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            )}
            {relatedCats.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group flex items-center justify-between gap-2 text-sm text-text-secondary hover:text-primary-600 py-1 rounded-lg hover:bg-primary-50/50 px-1 -mx-1 transition-all"
                >
                  <span className="flex items-center gap-1.5"><CategoryIcon category={cat.slug} className="w-3.5 h-3.5" /> {cat.name}</span>
                  <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* People also compare */}
        <div className="group relative bg-white border border-border rounded-2xl p-4 sm:p-5 hover:border-primary-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 to-pink-500 opacity-100" />
          <CardHeader
            title="People Also Compare"
            gradient="from-accent-500 to-pink-600"
            icon={
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <ul className="space-y-2">
            {filteredRelated.slice(0, 5).map((comp) => {
              const parts = comp.title.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
              return (
                <li key={comp.slug}>
                  <Link
                    href={`/compare/${comp.slug}`}
                    className="group flex items-center justify-between gap-2 text-sm text-text hover:text-primary-700 py-1 rounded-lg hover:bg-primary-50/50 px-1 -mx-1 transition-all"
                  >
                    <span className="truncate">
                      {parts ? (
                        <>
                          <span className="font-medium">{parts[1]}</span>
                          <span className="text-text-secondary"> vs </span>
                          <span className="font-medium">{parts[2]}</span>
                        </>
                      ) : comp.title}
                    </span>
                    <svg className="w-3.5 h-3.5 text-text-secondary/40 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              );
            })}
            <li className="pt-1 border-t border-border/50">
              <Link
                href={currentCategory ? `/category/${currentCategory.slug}` : "/trending"}
                className="group flex items-center gap-1.5 text-xs font-semibold text-accent-600 hover:text-accent-700 transition-colors"
              >
                See more {currentCategory?.name.toLowerCase() || "trending"}
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
