const STORAGE_KEY = "recently_viewed_comparisons";
const MAX_ITEMS = 20;

export interface RecentlyViewedItem {
  slug: string;
  title: string;
  category: string;
  viewedAt: number;
}

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentlyViewedItem[];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: Omit<RecentlyViewedItem, "viewedAt">) {
  if (typeof window === "undefined") return;
  try {
    const items = getRecentlyViewed().filter((i) => i.slug !== item.slug);
    items.unshift({ ...item, viewedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    // localStorage full or unavailable
  }
}

const SEARCH_CONTEXT_KEY = "last_search_context";

export function saveSearchContext(query: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SEARCH_CONTEXT_KEY, query);
  } catch {
    // sessionStorage unavailable
  }
}

export function getSearchContext(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(SEARCH_CONTEXT_KEY);
  } catch {
    return null;
  }
}
