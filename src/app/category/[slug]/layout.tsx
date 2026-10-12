import { notFound } from "next/navigation";
import { isKnownCategorySlug } from "@/lib/seo/category-page-path";

/**
 * Unknown /category/{slug} must 404 before the page streams.
 *
 * `loading.tsx` wraps the page in Suspense and Next starts that fallback
 * with status 200. `notFound()` inside the page then cannot change the
 * status, so Google saw a soft 404 with index,follow. This layout sits
 * outside that Suspense boundary: an unknown slug never renders the page.
 */
export default async function CategorySlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isKnownCategorySlug(slug)) notFound();
  return children;
}
