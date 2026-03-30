import Link from "next/link";
import { SITE_URL, PRODUCT_SUBCATEGORIES } from "@/lib/utils/constants";
import { breadcrumbSchema } from "@/lib/seo/schema";

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

  const crumbs = [{ name: "Home", url: SITE_URL }];
  if (category) {
    crumbs.push({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      url: `${SITE_URL}/category/${category}`,
    });
  }
  if (subcat) {
    crumbs.push({
      name: subcat.name,
      url: `${SITE_URL}/category/${category}/${subcat.slug}`,
    });
  }
  crumbs.push({ name: title, url: `${SITE_URL}/compare/${slug}` });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(crumbs)),
        }}
      />
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
