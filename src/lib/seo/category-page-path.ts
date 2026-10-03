/**
 * Turn a stored comparison category into a URL that actually exists.
 *
 * The database uses values like `gaming` and `food_and_drink`. The site's
 * category pages live at `/category/products`, `/category/products/gaming`,
 * and so on. Linking the raw value builds `/category/gaming`, which is not
 * a page. Callers should omit the link when this returns null.
 */

import { CATEGORIES, CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";

/**
 * Legacy keys that are not a top-level category slug. Same destinations as
 * the permanent category redirects, so a breadcrumb does not 301.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  gaming: "/category/products/gaming",
  ecommerce: "/category/companies/retail-ecommerce",
  "kitchen-appliances": "/category/products/home-kitchen",
  "food-and-drink": "/category/companies/food-beverage",
};

const TOP_LEVEL = new Set<string>(CATEGORIES.map((category) => category.slug));

function normalizeCategoryKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Subcategory slug → path, but only when that slug belongs to one parent. */
const SUBCATEGORY_PATHS: ReadonlyMap<string, string> = (() => {
  const index = new Map<string, string>();
  const ambiguous = new Set<string>();
  for (const [parent, subs] of Object.entries(CATEGORY_SUBCATEGORIES)) {
    for (const sub of subs) {
      const path = `/category/${parent}/${sub.slug}`;
      const existing = index.get(sub.slug);
      if (existing && existing !== path) ambiguous.add(sub.slug);
      else index.set(sub.slug, path);
    }
  }
  for (const slug of ambiguous) index.delete(slug);
  return index;
})();

/** True when `/category/{slug}` is one of the real top-level category pages. */
export function isKnownCategorySlug(slug: string): boolean {
  return TOP_LEVEL.has(slug);
}

/** True when `/category/{categorySlug}/{subcategorySlug}` is a real page. */
export function isKnownSubcategorySlug(categorySlug: string, subcategorySlug: string): boolean {
  const subs = CATEGORY_SUBCATEGORIES[categorySlug];
  if (!subs) return false;
  return subs.some((sub) => sub.slug === subcategorySlug);
}

/**
 * Rewrite target for an unknown subcategory.
 *
 * `/category/[slug]/loading.tsx` starts a 200 before the child route can
 * call notFound(). This path is not a category, so the router 404s it
 * before that skeleton streams. It is not a subcategory path, so middleware
 * does not rewrite the rewrite.
 */
export const UNKNOWN_CATEGORY_404_REWRITE = "/category/__not-a-category__";

/**
 * A real category with a subcategory that is not in the map, such as
 * `/category/products/ereaders`. Top-level unknowns (`/category/foo`) and
 * redirect sources (`/category/gaming`) are not included: those already
 * 404 or 301 without this rewrite.
 */
export function isUnknownSubcategoryPath(pathname: string): boolean {
  const match = pathname.match(/^\/category\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return false;
  const slug = match[1] ?? "";
  const subcategory = match[2] ?? "";
  return isKnownCategorySlug(slug) && !isKnownSubcategorySlug(slug, subcategory);
}

/**
 * A category request that has no page: unknown parent, or a real parent
 * with an unknown subcategory. Redirect sources such as `/category/gaming`
 * are unknown here; next.config sends those to a live page before render.
 */
export function isUnknownCategoryPath(pathname: string): boolean {
  const match = pathname.match(/^\/category\/([^/]+)(?:\/([^/]+))?\/?$/);
  if (!match) return false;
  const slug = match[1] ?? "";
  const subcategory = match[2];
  if (!isKnownCategorySlug(slug)) return true;
  if (subcategory && !isKnownSubcategorySlug(slug, subcategory)) return true;
  return false;
}

/** Real category path, or null when there is nothing safe to link. */
export function categoryPagePath(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const key = normalizeCategoryKey(raw);
  if (!key) return null;
  if (TOP_LEVEL.has(key)) return `/category/${key}`;
  const alias = CATEGORY_ALIASES[key];
  if (alias) return alias;
  return SUBCATEGORY_PATHS.get(key) ?? null;
}
