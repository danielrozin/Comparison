/** Page size for `/blog`. Shared by the page and the out-of-range check. */
export const BLOG_LIST_PAGE_SIZE = 12;

/**
 * Missing `page` is page 1. `0`, negatives, decimals, and other non-integers
 * are invalid. Callers answer those with `notFound()`.
 */
export function parseBlogListPage(raw: string | undefined): number | "invalid" {
  if (raw == null || raw === "") return 1;
  if (!/^[1-9]\d*$/.test(raw)) return "invalid";
  const page = Number(raw);
  if (!Number.isSafeInteger(page) || page < 1) return "invalid";
  return page;
}

/** Page 1 of an empty list is the empty state. Any later page is past the end. */
export function blogListPageIsOutOfRange(
  page: number,
  total: number,
  pageSize: number = BLOG_LIST_PAGE_SIZE,
): boolean {
  if (page < 1 || pageSize < 1) return true;
  const totalPages = total <= 0 ? 0 : Math.ceil(total / pageSize);
  if (totalPages === 0) return page > 1;
  return page > totalPages;
}
