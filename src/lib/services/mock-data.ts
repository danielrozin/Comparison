/**
 * Mock Data for MVP Development
 * Realistic comparison data for UI development before DB is connected
 */

import type { ComparisonPageData, TrendingComparison, RelatedComparison } from "@/types";
import { getExtraComparisons, getExtraTrendingData } from "./mock-data-extra";

// Merge original 3 comparisons with 50 extra
const EXTRA = getExtraComparisons();

const MOCK_COMPARISONS_BASE: Record<string, ComparisonPageData> = {
  "messi-vs-ronaldo": {
    id: "comp-1",
    slug: "messi-vs-ronaldo",
    title: "Messi vs Ronaldo",
    shortAnswer:
      "Messi is widely regarded as the more naturally gifted player with superior dribbling and playmaking, while Ronaldo is celebrated for his athleticism, goal-scoring consistency, and aerial dominance. Messi has won 8 Ballon d'Or awards to Ronaldo's 5.",
    keyDifferences: [
      { label: "Ballon d'Or Awards", entityAValue: "8", entityBValue: "5", winner: "a" },
      { label: "Career Goals", entityAValue: "838", entityBValue: "899", winner: "b" },
      { label: "Career Assists", entityAValue: "369", entityBValue: "262", winner: "a" },
      { label: "World Cup Titles", entityAValue: "1", entityBValue: "0", winner: "a" },
      { label: "Champions League Titles", entityAValue: "4", entityBValue: "5", winner: "b" },
      { label: "International Goals", entityAValue: "112", entityBValue: "135", winner: "b" },
    ],
    verdict:
      "Both are all-time greats. Messi edges it for overall ability and the 2022 World Cup, while Ronaldo's longevity and Champions League record is unmatched. Choose Messi for magic, Ronaldo for power.",
    category: "sports",
    entities: [
      {
        id: "ent-1",
        slug: "lionel-messi",
        name: "Lionel Messi",
        shortDesc: "Argentine forward, 8x Ballon d'Or winner, 2022 World Cup champion",
        imageUrl: null,
        entityType: "person",
        position: 0,
        pros: [
          "Best dribbler of all time",
          "Superior vision and passing",
          "8 Ballon d'Or awards",
          "2022 World Cup winner",
          "More consistent in big tournaments late career",
        ],
        cons: [
          "Fewer Champions League titles",
          "Less aerial threat",
          "Fewer international goals",
        ],
        bestFor: "Fans who value natural talent, creativity, and playmaking",
      },
      {
        id: "ent-2",
        slug: "cristiano-ronaldo",
        name: "Cristiano Ronaldo",
        shortDesc: "Portuguese forward, 5x Ballon d'Or winner, all-time international top scorer",
        imageUrl: null,
        entityType: "person",
        position: 1,
        pros: [
          "All-time leading international scorer",
          "5 Champions League titles",
          "Incredible athleticism and heading",
          "Performed across 3 top leagues",
          "Remarkable longevity",
        ],
        cons: [
          "No World Cup title",
          "Fewer Ballon d'Or awards",
          "Less effective as playmaker",
        ],
        bestFor: "Fans who value athleticism, goal-scoring, and determination",
      },
    ],
    attributes: [
      {
        id: "attr-1",
        slug: "ballon-dor",
        name: "Ballon d'Or Awards",
        unit: null,
        category: "Awards",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-1", valueText: "8", valueNumber: 8, valueBoolean: null, winner: true },
          { entityId: "ent-2", valueText: "5", valueNumber: 5, valueBoolean: null, winner: false },
        ],
      },
      {
        id: "attr-2",
        slug: "career-goals",
        name: "Career Goals",
        unit: null,
        category: "Statistics",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-1", valueText: "838", valueNumber: 838, valueBoolean: null, winner: false },
          { entityId: "ent-2", valueText: "899", valueNumber: 899, valueBoolean: null, winner: true },
        ],
      },
      {
        id: "attr-3",
        slug: "career-assists",
        name: "Career Assists",
        unit: null,
        category: "Statistics",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-1", valueText: "369", valueNumber: 369, valueBoolean: null, winner: true },
          { entityId: "ent-2", valueText: "262", valueNumber: 262, valueBoolean: null, winner: false },
        ],
      },
      {
        id: "attr-4",
        slug: "champions-league",
        name: "Champions League Titles",
        unit: null,
        category: "Trophies",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-1", valueText: "4", valueNumber: 4, valueBoolean: null, winner: false },
          { entityId: "ent-2", valueText: "5", valueNumber: 5, valueBoolean: null, winner: true },
        ],
      },
      {
        id: "attr-5",
        slug: "world-cup",
        name: "World Cup Titles",
        unit: null,
        category: "Trophies",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-1", valueText: "1", valueNumber: 1, valueBoolean: null, winner: true },
          { entityId: "ent-2", valueText: "0", valueNumber: 0, valueBoolean: null, winner: false },
        ],
      },
      {
        id: "attr-6",
        slug: "height",
        name: "Height",
        unit: "cm",
        category: "Physical",
        dataType: "number",
        higherIsBetter: null,
        values: [
          { entityId: "ent-1", valueText: "170", valueNumber: 170, valueBoolean: null },
          { entityId: "ent-2", valueText: "187", valueNumber: 187, valueBoolean: null },
        ],
      },
      {
        id: "attr-7",
        slug: "international-goals",
        name: "International Goals",
        unit: null,
        category: "Statistics",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-1", valueText: "112", valueNumber: 112, valueBoolean: null, winner: false },
          { entityId: "ent-2", valueText: "135", valueNumber: 135, valueBoolean: null, winner: true },
        ],
      },
    ],
    faqs: [
      {
        question: "Who has more Ballon d'Or awards, Messi or Ronaldo?",
        answer: "Messi has won 8 Ballon d'Or awards compared to Ronaldo's 5, giving Messi the lead in individual awards.",
      },
      {
        question: "Who has scored more career goals?",
        answer: "Ronaldo leads with 899 career goals compared to Messi's 838, though Messi has more assists (369 vs 262).",
      },
      {
        question: "Who won the World Cup?",
        answer: "Messi won the 2022 FIFA World Cup with Argentina, while Ronaldo has not won the World Cup with Portugal.",
      },
      {
        question: "Who is the better player overall?",
        answer: "This is subjective. Messi is generally considered the more naturally talented player with better dribbling and vision, while Ronaldo is praised for his athleticism, aerial ability, and remarkable consistency across different leagues.",
      },
    ],
    relatedComparisons: [
      { slug: "neymar-vs-mbappe", title: "Neymar vs Mbappé", category: "sports" },
      { slug: "maradona-vs-pele", title: "Maradona vs Pelé", category: "sports" },
      { slug: "haaland-vs-mbappe", title: "Haaland vs Mbappé", category: "sports" },
      { slug: "lebron-vs-jordan", title: "LeBron vs Jordan", category: "sports" },
    ],
    metadata: {
      metaTitle: "Messi vs Ronaldo: The Ultimate Comparison (2026) | Comparison",
      metaDescription:
        "Compare Messi and Ronaldo across goals, assists, trophies, Ballon d'Or awards, and more. See who comes out on top in the greatest football debate.",
      publishedAt: "2024-01-15T00:00:00Z",
      updatedAt: "2026-03-15T00:00:00Z",
      isAutoGenerated: false,
      isHumanReviewed: true,
      viewCount: 1542300,
    },
  },
  "japan-vs-china": {
    id: "comp-2",
    slug: "japan-vs-china",
    title: "Japan vs China",
    shortAnswer:
      "China has a much larger economy (GDP $17.7T vs $4.2T), population (1.4B vs 125M), and military, while Japan leads in GDP per capita ($33,800 vs $12,500), technology innovation, life expectancy, and quality of life indices.",
    keyDifferences: [
      { label: "Population", entityAValue: "125M", entityBValue: "1.4B", winner: "b" },
      { label: "GDP", entityAValue: "$4.2T", entityBValue: "$17.7T", winner: "b" },
      { label: "GDP per Capita", entityAValue: "$33,800", entityBValue: "$12,500", winner: "a" },
      { label: "Life Expectancy", entityAValue: "84.6 years", entityBValue: "78.2 years", winner: "a" },
      { label: "Military Personnel", entityAValue: "247K", entityBValue: "2.0M", winner: "b" },
      { label: "HDI Rank", entityAValue: "#19", entityBValue: "#75", winner: "a" },
    ],
    verdict:
      "China dominates in scale — economy, population, and military size. Japan leads in quality of life, technology density, and per-capita wealth. The comparison depends on what dimension matters most to you.",
    category: "countries",
    entities: [
      {
        id: "ent-3",
        slug: "japan",
        name: "Japan",
        shortDesc: "Island nation in East Asia, 3rd largest economy, known for technology and culture",
        imageUrl: null,
        entityType: "country",
        position: 0,
        pros: ["Higher GDP per capita", "Longer life expectancy", "Higher HDI", "Technology leader", "Lower crime rate"],
        cons: ["Aging population", "Smaller military", "Smaller total GDP", "Limited natural resources"],
        bestFor: "Quality of life and technological innovation",
      },
      {
        id: "ent-4",
        slug: "china",
        name: "China",
        shortDesc: "Most populous country, 2nd largest economy, growing global superpower",
        imageUrl: null,
        entityType: "country",
        position: 1,
        pros: ["Largest population", "2nd largest GDP", "Massive military", "Rapid growth", "Manufacturing powerhouse"],
        cons: ["Lower GDP per capita", "Lower HDI", "Environmental challenges", "Lower life expectancy"],
        bestFor: "Economic scale and geopolitical influence",
      },
    ],
    attributes: [
      {
        id: "attr-10",
        slug: "population",
        name: "Population",
        unit: "people",
        category: "Demographics",
        dataType: "number",
        higherIsBetter: null,
        values: [
          { entityId: "ent-3", valueText: "125,000,000", valueNumber: 125000000, valueBoolean: null },
          { entityId: "ent-4", valueText: "1,400,000,000", valueNumber: 1400000000, valueBoolean: null },
        ],
      },
      {
        id: "attr-11",
        slug: "gdp",
        name: "GDP",
        unit: "USD",
        category: "Economy",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-3", valueText: "$4.2 Trillion", valueNumber: 4200000000000, valueBoolean: null, winner: false },
          { entityId: "ent-4", valueText: "$17.7 Trillion", valueNumber: 17700000000000, valueBoolean: null, winner: true },
        ],
      },
      {
        id: "attr-12",
        slug: "gdp-per-capita",
        name: "GDP per Capita",
        unit: "USD",
        category: "Economy",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-3", valueText: "$33,800", valueNumber: 33800, valueBoolean: null, winner: true },
          { entityId: "ent-4", valueText: "$12,500", valueNumber: 12500, valueBoolean: null, winner: false },
        ],
      },
      {
        id: "attr-13",
        slug: "life-expectancy",
        name: "Life Expectancy",
        unit: "years",
        category: "Quality of Life",
        dataType: "number",
        higherIsBetter: true,
        values: [
          { entityId: "ent-3", valueText: "84.6", valueNumber: 84.6, valueBoolean: null, winner: true },
          { entityId: "ent-4", valueText: "78.2", valueNumber: 78.2, valueBoolean: null, winner: false },
        ],
      },
    ],
    faqs: [
      {
        question: "Which country has a larger economy, Japan or China?",
        answer: "China has a significantly larger economy with a GDP of approximately $17.7 trillion compared to Japan's $4.2 trillion. However, Japan has a higher GDP per capita at $33,800 vs China's $12,500.",
      },
      {
        question: "Which country has a stronger military?",
        answer: "China has a larger military with approximately 2 million active personnel compared to Japan's 247,000. China also has a larger defense budget and nuclear weapons capability.",
      },
    ],
    relatedComparisons: [
      { slug: "usa-vs-china", title: "USA vs China", category: "countries" },
      { slug: "japan-vs-south-korea", title: "Japan vs South Korea", category: "countries" },
      { slug: "india-vs-china", title: "India vs China", category: "countries" },
    ],
    metadata: {
      metaTitle: "Japan vs China: Complete Country Comparison (2026) | Comparison",
      metaDescription:
        "Compare Japan and China across economy, population, military, quality of life, and more. See the key differences between these East Asian powers.",
      publishedAt: "2024-03-01T00:00:00Z",
      updatedAt: "2026-03-15T00:00:00Z",
      isAutoGenerated: false,
      isHumanReviewed: true,
      viewCount: 892100,
    },
  },
  "iphone-16-vs-samsung-s25": {
    id: "comp-3",
    slug: "iphone-16-vs-samsung-s25",
    title: "iPhone 16 vs Samsung Galaxy S25",
    shortAnswer:
      "The iPhone 16 excels in video recording, ecosystem integration, and processor performance with the A18 chip. The Samsung Galaxy S25 offers a brighter display, more customization with Android, and superior zoom camera capabilities.",
    keyDifferences: [
      { label: "Processor", entityAValue: "A18 Bionic", entityBValue: "Snapdragon 8 Elite", winner: "a" },
      { label: "Display", entityAValue: "6.1\" OLED, 2000 nits", entityBValue: "6.2\" AMOLED, 2600 nits", winner: "b" },
      { label: "Base Storage", entityAValue: "128GB", entityBValue: "128GB", winner: "tie" },
      { label: "Battery", entityAValue: "3,561 mAh", entityBValue: "4,000 mAh", winner: "b" },
      { label: "Starting Price", entityAValue: "$799", entityBValue: "$799", winner: "tie" },
      { label: "OS", entityAValue: "iOS 18", entityBValue: "Android 15", winner: "tie" },
    ],
    verdict:
      "Both phones are excellent flagships at the same price. Choose iPhone 16 if you're in the Apple ecosystem or prioritize video. Choose Samsung S25 for display quality, customization, and zoom photography.",
    category: "technology",
    entities: [
      {
        id: "ent-5",
        slug: "iphone-16",
        name: "iPhone 16",
        shortDesc: "Apple's 2024 flagship smartphone with A18 chip and Action Button",
        imageUrl: null,
        entityType: "product",
        position: 0,
        pros: ["A18 chip performance", "Best-in-class video", "iOS ecosystem", "Long software support", "Action Button"],
        cons: ["Lower base storage options", "Smaller battery", "Less customizable", "Lightning to USB-C recent"],
        bestFor: "Apple ecosystem users who prioritize video and performance",
      },
      {
        id: "ent-6",
        slug: "samsung-galaxy-s25",
        name: "Samsung Galaxy S25",
        shortDesc: "Samsung's 2025 flagship with Snapdragon 8 Elite and Galaxy AI",
        imageUrl: null,
        entityType: "product",
        position: 1,
        pros: ["Brighter display", "Larger battery", "More customization", "Better zoom camera", "Galaxy AI features"],
        cons: ["Shorter update window historically", "Bloatware", "Bixby less useful", "Exynos in some regions"],
        bestFor: "Android users who want the best display and camera versatility",
      },
    ],
    attributes: [],
    faqs: [
      {
        question: "Which phone has a better camera?",
        answer: "Both are excellent. iPhone 16 leads in video recording quality, while Samsung S25 has superior zoom capabilities with its telephoto lens.",
      },
      {
        question: "Which phone has better battery life?",
        answer: "Samsung Galaxy S25 has a larger 4,000 mAh battery compared to iPhone 16's 3,561 mAh, though real-world performance depends on usage patterns.",
      },
    ],
    relatedComparisons: [
      { slug: "iphone-16-pro-vs-samsung-s25-ultra", title: "iPhone 16 Pro vs Samsung S25 Ultra", category: "technology" },
      { slug: "pixel-9-vs-iphone-16", title: "Pixel 9 vs iPhone 16", category: "technology" },
    ],
    metadata: {
      metaTitle: "iPhone 16 vs Samsung Galaxy S25: Which Phone Wins? (2026) | Comparison",
      metaDescription:
        "Compare iPhone 16 and Samsung Galaxy S25 specs, camera, battery, performance, and price. Find out which flagship phone is right for you.",
      publishedAt: "2025-02-01T00:00:00Z",
      updatedAt: "2026-03-15T00:00:00Z",
      isAutoGenerated: false,
      isHumanReviewed: true,
      viewCount: 2105000,
    },
  },
};

// Merge base + extra comparisons
const MOCK_COMPARISONS: Record<string, ComparisonPageData> = {
  ...MOCK_COMPARISONS_BASE,
  ...EXTRA,
};

// Build trending from all comparisons, sorted by views
const ALL_TRENDING_DATA = [
  { slug: "iphone-16-vs-samsung-s25", title: "iPhone 16 vs Samsung S25", category: "Technology", viewCount: 2105000 },
  { slug: "messi-vs-ronaldo", title: "Messi vs Ronaldo", category: "Sports", viewCount: 1542300 },
  { slug: "japan-vs-china", title: "Japan vs China", category: "Countries", viewCount: 892100 },
  ...getExtraTrendingData(),
];

const MOCK_TRENDING: TrendingComparison[] = ALL_TRENDING_DATA
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, 20)
  .map((t) => ({ ...t, entityImages: [] }));

// Build related from all comparisons (diverse selection)
const MOCK_RELATED: RelatedComparison[] = Object.entries(MOCK_COMPARISONS)
  .map(([slug, comp]) => ({ slug, title: comp.title, category: comp.category }))
  .sort(() => Math.random() - 0.5)
  .slice(0, 15);

export function getMockComparison(slug: string): ComparisonPageData | null {
  return MOCK_COMPARISONS[slug] || null;
}

export function getMockTrending(limit: number): TrendingComparison[] {
  return MOCK_TRENDING.slice(0, limit);
}

export function getMockRelated(_comparisonId: string, limit: number): RelatedComparison[] {
  return MOCK_RELATED.slice(0, limit);
}

export function getAllMockSlugs(): string[] {
  return Object.keys(MOCK_COMPARISONS);
}

export function getMockComparisonsByCategory(category: string): RelatedComparison[] {
  const results: RelatedComparison[] = [];
  for (const [slug, comp] of Object.entries(MOCK_COMPARISONS)) {
    if (!category || comp.category === category) {
      results.push({ slug, title: comp.title, category: comp.category });
    }
  }
  return results;
}
