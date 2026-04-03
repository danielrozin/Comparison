/**
 * Auto-generates resources (Wikipedia links + related blog articles) for any comparison.
 * No manual data entry needed — works from entity names and slug matching.
 */

import type { ComparisonResource, ComparisonEntityData } from "@/types";

// Wikipedia article name mappings for entities that don't map 1:1
const WIKIPEDIA_OVERRIDES: Record<string, string> = {
  // Military
  "israel-idf": "Israel_Defense_Forces",
  "iran-military": "Armed_Forces_of_the_Islamic_Republic_of_Iran",
  "iran-armed-forces": "Armed_Forces_of_the_Islamic_Republic_of_Iran",
  "us-military": "United_States_Armed_Forces",
  "f-35": "Lockheed_Martin_F-35_Lightning_II",
  "f-35-lightning": "Lockheed_Martin_F-35_Lightning_II",
  "su-57": "Sukhoi_Su-57",
  "f-22-raptor": "Lockheed_Martin_F-22_Raptor",
  "b-2-spirit": "Northrop_Grumman_B-2_Spirit",
  "b-52": "Boeing_B-52_Stratofortress",
  "m1-abrams": "M1_Abrams",
  "t-90m": "T-90",
  "iron-dome": "Iron_Dome",
  "s-400": "S-400_missile_system",
  "f-15-eagle": "McDonnell_Douglas_F-15_Eagle",
  "f-16": "General_Dynamics_F-16_Fighting_Falcon",
  "patriot-missile": "MIM-104_Patriot",
  "s-300": "S-300_missile_system",
  "ah-64-apache": "Boeing_AH-64_Apache",
  "ka-52": "Kamov_Ka-52",
  "barrett-m82": "Barrett_M82",
  "dragunov-svd": "Dragunov_sniper_rifle",
  // Sports
  "lionel-messi": "Lionel_Messi",
  "cristiano-ronaldo": "Cristiano_Ronaldo",
  "lebron-james": "LeBron_James",
  "michael-jordan": "Michael_Jordan",
  // Technology
  "bitcoin": "Bitcoin",
  "ethereum": "Ethereum",
  "chatgpt": "ChatGPT",
  // Countries
  "usa": "United_States",
  "china": "China",
  // Brands
  "mercedes-benz": "Mercedes-Benz",
  "bmw": "BMW",
};

// Relationship Wikipedia articles for common comparison pairs
const RELATIONSHIP_ARTICLES: Record<string, { title: string; article: string }> = {
  "israel-vs-iran": { title: "Iran\u2013Israel relations", article: "Iran%E2%80%93Israel_relations" },
  "israel-vs-iran-military": { title: "Iran\u2013Israel conflict", article: "Iran%E2%80%93Israel_conflict_(2023%E2%80%93present)" },
  "us-military-vs-iran": { title: "Iran\u2013United States relations", article: "Iran%E2%80%93United_States_relations" },
  "usa-vs-china": { title: "China\u2013United States relations", article: "China%E2%80%93United_States_relations" },
  "us-economy-vs-china-economy": { title: "China\u2013US economic relations", article: "China%E2%80%93United_States_trade_war" },
  "us-military-vs-china-military": { title: "China\u2013US military relations", article: "China%E2%80%93United_States_relations" },
  "india-vs-china": { title: "China\u2013India relations", article: "China%E2%80%93India_relations" },
  "india-vs-pakistan": { title: "India\u2013Pakistan relations", article: "India%E2%80%93Pakistan_relations" },
  "japan-vs-china": { title: "China\u2013Japan relations", article: "China%E2%80%93Japan_relations" },
  "russia-vs-usa": { title: "Russia\u2013United States relations", article: "Russia%E2%80%93United_States_relations" },
  "north-korea-vs-south-korea": { title: "North\u2013South Korea relations", article: "North_Korea%E2%80%93South_Korea_relations" },
  "uk-vs-usa": { title: "UK\u2013US relations", article: "United_Kingdom%E2%80%93United_States_relations" },
  "germany-vs-france": { title: "France\u2013Germany relations", article: "France%E2%80%93Germany_relations" },
  "brazil-vs-argentina": { title: "Argentina\u2013Brazil relations", article: "Argentina%E2%80%93Brazil_relations" },
  "spain-vs-italy": { title: "Italy\u2013Spain relations", article: "Italy%E2%80%93Spain_relations" },
  "messi-vs-ronaldo": { title: "Messi\u2013Ronaldo rivalry", article: "Messi%E2%80%93Ronaldo_rivalry" },
  "f-22-vs-f-35": { title: "5th-generation fighters", article: "Fifth-generation_fighter" },
  "f-35-vs-su-57": { title: "5th-generation fighters", article: "Fifth-generation_fighter" },
  "b-2-vs-b-52": { title: "Strategic bombing", article: "Strategic_bombing" },
  "mac-vs-windows": { title: "Mac vs. PC advertising", article: "Get_a_Mac" },
  "android-vs-ios": { title: "Smartphone market", article: "Mobile_operating_system" },
  "nike-vs-adidas": { title: "Sportswear industry", article: "Sportswear_(activewear)" },
  "coca-cola-vs-pepsi": { title: "Cola wars", article: "Cola_wars" },
  "mercedes-vs-bmw": { title: "German luxury car rivalry", article: "German_automobile_industry" },
  "iron-dome-vs-s-400": { title: "Air defense systems", article: "Air_defense" },
  "m1-abrams-vs-t-90": { title: "Main battle tanks", article: "Main_battle_tank" },
  "bitcoin-vs-ethereum": { title: "Cryptocurrency", article: "Cryptocurrency" },
};

// Blog slug patterns that match comparison topics
const BLOG_MATCHES: Record<string, { slug: string; title: string }[]> = {
  "israel-vs-iran-military": [
    { slug: "israel-vs-iran-military-power-2026-complete-breakdown", title: "Israel vs Iran Military Power 2026: Complete Breakdown" },
    { slug: "us-military-weapons-used-against-iran-2026", title: "US Military Weapons Used Against Iran" },
    { slug: "missile-defense-systems-compared-iron-dome-patriot-s-400-thaad", title: "Missile Defense Systems Compared" },
  ],
  "us-military-vs-iran-military": [
    { slug: "us-military-weapons-used-against-iran-2026", title: "US Military Weapons Used Against Iran: B-2, F-35, Tomahawk" },
    { slug: "israel-vs-iran-military-power-2026-complete-breakdown", title: "Israel vs Iran Military Power 2026" },
  ],
  "f-35-vs-su-57": [
    { slug: "top-10-fighter-jets-world-2026-ranked", title: "Top 10 Fighter Jets in the World 2026" },
    { slug: "us-military-weapons-used-against-iran-2026", title: "US Military Weapons Used Against Iran" },
  ],
  "f-22-vs-f-35": [
    { slug: "top-10-fighter-jets-world-2026-ranked", title: "Top 10 Fighter Jets in the World 2026" },
  ],
  "f-15-vs-f-16": [
    { slug: "top-10-fighter-jets-world-2026-ranked", title: "Top 10 Fighter Jets in the World 2026" },
  ],
  "b-2-vs-b-52": [
    { slug: "us-military-weapons-used-against-iran-2026", title: "US Military Weapons Used Against Iran" },
  ],
  "m1-abrams-vs-t-90": [
    { slug: "best-tanks-world-2026-abrams-vs-t-90-vs-leopard", title: "Best Tanks 2026: Abrams vs T-90 vs Leopard vs Merkava" },
  ],
  "iron-dome-vs-s-400": [
    { slug: "missile-defense-systems-compared-iron-dome-patriot-s-400-thaad", title: "Iron Dome vs S-400 vs Patriot vs THAAD Compared" },
    { slug: "israel-vs-iran-military-power-2026-complete-breakdown", title: "Israel vs Iran Military Power 2026" },
  ],
  "patriot-vs-s-300": [
    { slug: "missile-defense-systems-compared-iron-dome-patriot-s-400-thaad", title: "Missile Defense Systems Compared" },
  ],
  "apache-vs-ka-52": [
    { slug: "us-military-weapons-used-against-iran-2026", title: "US Military Weapons Used Against Iran" },
  ],
  "usa-vs-china": [
    { slug: "usa-vs-china-superpower-comparison-2026", title: "USA vs China: The Superpower Rivalry Explained (2026)" },
    { slug: "china-vs-us-economy-2026-gdp-comparison", title: "China vs US Economy 2026: GDP Compared" },
  ],
  "us-economy-vs-china-economy": [
    { slug: "china-vs-us-economy-2026-gdp-comparison", title: "China vs US Economy 2026: GDP, Growth, Trade Compared" },
    { slug: "usa-vs-china-superpower-comparison-2026", title: "USA vs China: The Superpower Rivalry" },
  ],
  "iphone-17-vs-samsung-s26": [
    { slug: "best-smartphones-2026-ultimate-comparison", title: "Best Smartphones of 2026: The Ultimate Comparison Guide" },
  ],
  "chatgpt-vs-claude": [
    { slug: "ai-chatbots-compared-chatgpt-vs-claude-vs-gemini", title: "AI Chatbots Compared: ChatGPT vs Claude vs Gemini" },
  ],
  "chatgpt-vs-gemini": [
    { slug: "ai-chatbots-compared-chatgpt-vs-claude-vs-gemini", title: "AI Chatbots Compared: ChatGPT vs Claude vs Gemini" },
  ],
  "bitcoin-vs-ethereum": [
    { slug: "bitcoin-vs-ethereum-investment-guide-2026", title: "Bitcoin vs Ethereum: Which Crypto Should You Invest In?" },
  ],
  "wegovy-vs-ozempic": [
    { slug: "wegovy-vs-ozempic-differences-similarities-2026", title: "Wegovy vs Ozempic: Differences, Side Effects & Cost" },
  ],
  "messi-vs-ronaldo": [
    { slug: "messi-vs-ronaldo-all-time-goat-debate", title: "Messi vs Ronaldo: Settling the GOAT Debate in 2026" },
  ],
  "netflix-vs-disney-plus": [
    { slug: "netflix-vs-disney-plus-streaming-wars-2026", title: "Netflix vs Disney+: Streaming Wars in 2026" },
  ],
  "delta-vs-united": [
    { slug: "delta-vs-united-airlines-comparison-2026", title: "Delta vs United Airlines: Which Is Better in 2026?" },
  ],
  "buying-vs-renting": [
    { slug: "buying-vs-renting-home-2026-analysis", title: "Buying vs Renting a Home in 2026" },
  ],
  "mercedes-vs-bmw": [
    { slug: "best-alternatives-to-mercedes-benz-2026", title: "Best Alternatives to Mercedes-Benz: 7 Luxury Cars" },
  ],
  "macbook-air-vs-macbook-pro": [
    { slug: "macbook-air-vs-macbook-pro-2026-specs-comparison", title: "MacBook Air vs MacBook Pro 2026: Which to Buy?" },
  ],
  "keto-vs-paleo": [
    { slug: "keto-vs-paleo-vs-mediterranean-diet-comparison", title: "Keto vs Paleo vs Mediterranean: Which Diet Works?" },
  ],
  "harvard-vs-stanford": [
    { slug: "harvard-vs-stanford-vs-mit-which-university", title: "Harvard vs Stanford vs MIT: Which Is Right for You?" },
  ],
  "running-vs-walking": [
    { slug: "running-vs-walking-weight-loss-fitness", title: "Running vs Walking for Weight Loss" },
  ],
};

// YouTube video mappings for popular comparisons (videoId -> title)
const YOUTUBE_VIDEOS: Record<string, { videoId: string; title: string }[]> = {
  "messi-vs-ronaldo": [
    { videoId: "search", title: "Messi vs Ronaldo - The Ultimate Comparison" },
  ],
  "iphone-17-vs-samsung-s26": [
    { videoId: "search", title: "iPhone 17 vs Samsung S26 - Full Comparison" },
  ],
  "chatgpt-vs-claude": [
    { videoId: "search", title: "ChatGPT vs Claude - AI Chatbot Showdown" },
  ],
};

function entityToWikipedia(entity: ComparisonEntityData): string {
  // Check overrides first
  if (WIKIPEDIA_OVERRIDES[entity.slug]) {
    return WIKIPEDIA_OVERRIDES[entity.slug];
  }
  // Convert name to Wikipedia format: "LeBron James" -> "LeBron_James"
  return entity.name
    .replace(/\s+/g, "_")
    .replace(/[()]/g, "");
}

export function generateResources(
  slug: string,
  entities: ComparisonEntityData[],
): ComparisonResource[] {
  const resources: ComparisonResource[] = [];

  // 1. Wikipedia links for each entity
  if (entities.length >= 2) {
    resources.push({
      type: "wikipedia",
      label: `${entities[0].name} on Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${entityToWikipedia(entities[0])}`,
      description: entities[0].shortDesc || undefined,
    });
    resources.push({
      type: "wikipedia",
      label: `${entities[1].name} on Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${entityToWikipedia(entities[1])}`,
      description: entities[1].shortDesc || undefined,
    });
  }

  // 2. Relationship Wikipedia article
  const relationship = RELATIONSHIP_ARTICLES[slug];
  if (relationship) {
    resources.push({
      type: "wikipedia",
      label: relationship.title,
      url: `https://en.wikipedia.org/wiki/${relationship.article}`,
      description: "The relationship and history between these two",
    });
  }

  // 3. Related blog articles
  const blogs = BLOG_MATCHES[slug];
  if (blogs) {
    for (const blog of blogs) {
      resources.push({
        type: "blog",
        label: blog.title,
        url: `/blog/${blog.slug}`,
        description: "In-depth analysis on our blog",
      });
    }
  }

  // 4. YouTube video resources
  const videos = YOUTUBE_VIDEOS[slug];
  if (videos) {
    for (const video of videos) {
      if (video.videoId === "search") {
        const query = encodeURIComponent(`${entities[0]?.name || ""} vs ${entities[1]?.name || ""}`);
        resources.push({
          type: "video",
          label: video.title,
          url: `https://www.youtube.com/results?search_query=${query}`,
          description: "Watch comparison videos on YouTube",
        });
      } else {
        resources.push({
          type: "video",
          label: video.title,
          url: `https://www.youtube.com/watch?v=${video.videoId}`,
          description: "Watch on YouTube",
        });
      }
    }
  } else if (entities.length >= 2) {
    // Generic YouTube search link for all comparisons
    const query = encodeURIComponent(`${entities[0].name} vs ${entities[1].name}`);
    resources.push({
      type: "video",
      label: `${entities[0].name} vs ${entities[1].name} videos`,
      url: `https://www.youtube.com/results?search_query=${query}`,
      description: "Find comparison videos on YouTube",
    });
  }

  return resources;
}
