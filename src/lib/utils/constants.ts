export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "A Versus B";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aversusb.net";

export const COMPARISON_PATTERNS = [
  "vs",
  "versus",
  "compared to",
  "compare",
  "or",
  "difference between",
  "alternative",
  "alternatives to",
  "best alternative to",
] as const;

export const ENTITY_TYPE_ICONS: Record<string, string> = {
  person: "👤",
  country: "🌍",
  product: "📦",
  team: "⚽",
  company: "🏢",
  technology: "💻",
  war: "⚔️",
  event: "📅",
  brand: "🏷️",
  software: "🖥️",
};

export const CATEGORIES = [
  { slug: "sports", name: "Sports", icon: "⚽" },
  { slug: "countries", name: "Countries", icon: "🌍" },
  { slug: "technology", name: "Technology", icon: "💻" },
  { slug: "products", name: "Products", icon: "📦" },
  { slug: "health", name: "Health & Wellness", icon: "💊" },
  { slug: "finance", name: "Finance", icon: "💰" },
  { slug: "education", name: "Education", icon: "🎓" },
  { slug: "entertainment", name: "Entertainment", icon: "🎬" },
  { slug: "history", name: "History", icon: "📜" },
  { slug: "military", name: "Military", icon: "🎖️" },
  { slug: "economy", name: "Economy", icon: "📈" },
  { slug: "companies", name: "Companies", icon: "🏢" },
  { slug: "brands", name: "Brands", icon: "🏷️" },
  { slug: "celebrities", name: "Celebrities", icon: "⭐" },
  { slug: "automotive", name: "Automotive", icon: "🚗" },
  { slug: "travel", name: "Travel", icon: "✈️" },
] as const;

export const PAGE_SIZES = {
  COMPARISONS_PER_CATEGORY: 20,
  TRENDING_COUNT: 10,
  RELATED_COMPARISONS: 8,
  SEARCH_RESULTS: 20,
  ADMIN_PAGE_SIZE: 50,
} as const;
