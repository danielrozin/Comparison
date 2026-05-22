import Link from "next/link";
import { PRODUCT_SUBCATEGORIES } from "@/lib/utils/constants";

interface BreadcrumbsProps {
  title: string;
  slug: string;
  category: string | null;
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
    <>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          </li>
          {category && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/category/${category}`}
                  className="hover:text-primary-600 transition-colors capitalize"
                >
                  {category}
                </Link>
              </li>
            </>
          )}
          {subcat && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={`/category/${category}/${subcat.slug}`}
                  className="hover:text-primary-600 transition-colors"
                >
                  {subcat.name}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-text font-medium truncate">{title}</li>
        </ol>
      </nav>
    </>
  );
}
