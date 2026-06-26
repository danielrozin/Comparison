import Link from "next/link";
import { PRODUCT_SUBCATEGORIES } from "@/lib/utils/constants";

interface BreadcrumbsProps {
  title: string;
  slug: string;
  category: string | null;
}

function ChevronSep() {
  return (
    <svg className="w-3.5 h-3.5 text-text-secondary/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <ol className="flex items-center gap-1.5 text-sm overflow-x-auto scrollbar-none whitespace-nowrap pb-0.5 [-webkit-overflow-scrolling:touch] [mask-image:linear-gradient(to_right,transparent_0,black_16px,black_calc(100%-32px),transparent_100%)]">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-text-secondary hover:text-primary-600 transition-colors"
            aria-label="Home"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="text-text-secondary hover:text-primary-600 transition-colors capitalize"
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
                className="text-text-secondary hover:text-primary-600 transition-colors"
              >
                {subcat.name}
              </Link>
            </li>
          </>
        )}

        <li aria-hidden><ChevronSep /></li>
        <li className="text-text font-medium" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
