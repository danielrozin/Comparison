import Link from "next/link";
import { PRODUCT_SUBCATEGORIES } from "@/lib/utils/constants";

interface BreadcrumbsProps {
  title: string;
  slug: string;
  category: string | null;
}

function ChevronSep() {
  return (
    <svg className="w-3 h-3 text-text-secondary/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function Breadcrumbs({ title, slug, category }: BreadcrumbsProps) {
  const lower = (title?.toLowerCase() || "") + " " + (slug || "");
  const subcat =
    category === "products"
      ? PRODUCT_SUBCATEGORIES.find((s) =>
          s.keywords.some((kw) => lower.includes(kw))
        )
      : undefined;

  // BreadcrumbList JSON-LD is emitted from comparisonPageSchema() in lib/seo/schema.ts
  // — do not duplicate it here. (DAN-410)
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border/60 bg-surface/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-1.5 text-xs sm:text-sm overflow-x-auto scrollbar-none whitespace-nowrap py-2.5 [-webkit-overflow-scrolling:touch] [mask-image:linear-gradient(to_right,transparent_0,black_16px,black_calc(100%-32px),transparent_100%)]">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-text-secondary hover:text-primary-600 transition-colors font-medium"
              aria-label="Home"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>

          {category && (
            <>
              <li aria-hidden><ChevronSep /></li>
              <li>
                <Link
                  href={`/category/${category}`}
                  className="text-text-secondary hover:text-primary-600 transition-colors font-medium capitalize"
                >
                  {category}
                </Link>
              </li>
            </>
          )}

          {subcat && (
            <>
              <li aria-hidden><ChevronSep /></li>
              <li>
                <Link
                  href={`/category/${category}/${subcat.slug}`}
                  className="text-text-secondary hover:text-primary-600 transition-colors font-medium"
                >
                  {subcat.name}
                </Link>
              </li>
            </>
          )}

          <li aria-hidden><ChevronSep /></li>
          <li className="flex items-center gap-1.5" aria-current="page">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary-50 border border-primary-100 text-primary-700 font-semibold max-w-[200px] sm:max-w-none truncate">
              {title}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
}
