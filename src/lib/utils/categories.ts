/**
 * Unified category system for blog articles and comparisons.
 * Provides keyword-based validation so AI-assigned categories are corrected
 * when they clearly don't match the content.
 */

// ---- Blog categories (displayed on /blog page) ----
export const BLOG_CATEGORIES = [
  "technology",
  "sports",
  "entertainment",
  "lifestyle",
  "science",
  "business",
  "education",
  "health",
  "travel",
  "food",
  "automotive",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

// ---- Comparison categories ----
export const COMPARISON_CATEGORIES = [
  "sports",
  "countries",
  "technology",
  "software",
  "products",
  "companies",
  "brands",
  "history",
  "economy",
  "military",
  "science",
  "entertainment",
  "automotive",
  "general",
] as const;

export type ComparisonCategory = (typeof COMPARISON_CATEGORIES)[number];

// ---- Keyword → category mapping (checked against title + topic text) ----
// Order matters: first match wins, so put more specific patterns first.
const CATEGORY_KEYWORD_RULES: { keywords: string[]; blogCategory: BlogCategory; comparisonCategory: ComparisonCategory }[] = [
  // Automotive — must come before "technology" or "products"
  {
    keywords: [
      "car", "cars", "vehicle", "vehicles", "suv", "sedan", "truck", "trucks",
      "mercedes", "bmw", "audi", "toyota", "honda", "ford", "chevrolet", "chevy",
      "tesla model", "porsche", "ferrari", "lamborghini", "lexus", "volvo",
      "hyundai", "kia", "mazda", "subaru", "nissan", "jeep", "dodge", "ram",
      "volkswagen", "vw", "jaguar", "land rover", "range rover", "bentley",
      "rolls royce", "maserati", "alfa romeo", "buick", "cadillac", "lincoln",
      "acura", "infiniti", "genesis", "rivian", "lucid", "polestar",
      "minivan", "coupe", "convertible", "hatchback", "crossover",
      "horsepower", "torque", "0-60", "mpg", "fuel economy",
      "electric vehicle", "ev", "hybrid", "phev", "plug-in hybrid",
      "automotive", "automobile", "motor", "driving", "driver",
      "luxury car", "sports car", "muscle car", "supercar", "hypercar",
    ],
    blogCategory: "automotive",
    comparisonCategory: "automotive",
  },
  // Sports
  {
    keywords: [
      "player", "players", "athlete", "team", "league", "nba", "nfl", "mlb",
      "nhl", "mls", "premier league", "champions league", "la liga", "serie a",
      "bundesliga", "world cup", "olympics", "soccer", "football", "basketball",
      "baseball", "hockey", "tennis", "golf", "boxing", "mma", "ufc",
      "cricket", "rugby", "f1", "formula 1", "nascar", "match", "game",
      "championship", "tournament", "season", "stats", "goal", "touchdown",
      "quarterback", "striker", "midfielder", "goalkeeper",
      "messi", "ronaldo", "lebron", "jordan", "brady", "mahomes",
    ],
    blogCategory: "sports",
    comparisonCategory: "sports",
  },
  // Health / Fitness
  {
    keywords: [
      "health", "healthy", "medical", "medicine", "doctor", "hospital",
      "vitamin", "supplement", "diet", "nutrition", "calorie", "protein",
      "fitness", "workout", "exercise", "yoga", "meditation", "mental health",
      "therapy", "wellness", "disease", "symptom", "treatment", "drug",
      "pharmaceutical", "vaccine", "surgery", "dental", "skin care",
    ],
    blogCategory: "health",
    comparisonCategory: "science",
  },
  // Food & Drink
  {
    keywords: [
      "food", "recipe", "cooking", "restaurant", "cuisine", "meal",
      "ingredient", "flavor", "taste", "drink", "beverage", "coffee",
      "tea", "wine", "beer", "cocktail", "snack", "dessert", "baking",
      "vegan", "vegetarian", "organic", "gluten-free", "keto",
    ],
    blogCategory: "food",
    comparisonCategory: "products",
  },
  // Travel
  {
    keywords: [
      "travel", "vacation", "trip", "tourism", "tourist", "hotel", "resort",
      "airline", "flight", "airport", "cruise", "destination", "beach",
      "hiking", "backpacking", "luggage", "passport", "visa",
    ],
    blogCategory: "travel",
    comparisonCategory: "general",
  },
  // Countries / Geography
  {
    keywords: [
      "country", "countries", "nation", "gdp", "population", "capital city",
      "government", "democracy", "republic", "continent", "geography",
      "immigration", "embassy", "citizenship",
    ],
    blogCategory: "lifestyle",
    comparisonCategory: "countries",
  },
  // Military
  {
    keywords: [
      "military", "army", "navy", "air force", "marines", "defense",
      "weapon", "missile", "nuclear", "tank", "fighter jet", "warship",
      "soldier", "troops", "combat", "war ", "warfare",
    ],
    blogCategory: "science",
    comparisonCategory: "military",
  },
  // Entertainment
  {
    keywords: [
      "movie", "film", "tv show", "series", "streaming", "netflix",
      "disney", "hbo", "amazon prime", "hulu", "spotify", "music",
      "album", "song", "artist", "band", "concert", "gaming", "game",
      "playstation", "xbox", "nintendo", "steam", "twitch", "youtube",
      "tiktok", "instagram", "social media", "podcast", "anime", "manga",
    ],
    blogCategory: "entertainment",
    comparisonCategory: "entertainment",
  },
  // Education
  {
    keywords: [
      "university", "college", "school", "education", "degree", "course",
      "student", "teacher", "professor", "learning", "online course",
      "certification", "scholarship", "tuition", "campus",
    ],
    blogCategory: "education",
    comparisonCategory: "general",
  },
  // Business / Economy
  {
    keywords: [
      "business", "company", "startup", "stock", "market", "invest",
      "revenue", "profit", "ceo", "entrepreneur", "management",
      "marketing", "saas", "crm", "erp", "b2b", "economy", "inflation",
      "interest rate", "bank", "finance", "fintech", "insurance",
      "cryptocurrency", "bitcoin", "ethereum", "blockchain",
    ],
    blogCategory: "business",
    comparisonCategory: "companies",
  },
  // Science
  {
    keywords: [
      "science", "research", "study", "experiment", "physics", "chemistry",
      "biology", "astronomy", "space", "nasa", "quantum", "atom",
      "molecule", "genome", "dna", "evolution", "climate", "environment",
    ],
    blogCategory: "science",
    comparisonCategory: "science",
  },
  // Software — must come before generic "technology" to catch software comparisons
  {
    keywords: [
      "vpn", "nordvpn", "expressvpn", "surfshark", "cyberghost", "protonvpn",
      "antivirus", "norton", "mcafee", "bitdefender", "kaspersky", "malwarebytes", "avast",
      "hosting", "bluehost", "hostinger", "siteground", "godaddy", "namecheap", "cloudflare",
      "website builder", "wix", "squarespace", "webflow", "wordpress",
      "shopify", "woocommerce", "bigcommerce", "magento",
      "crm", "hubspot", "salesforce", "pipedrive", "zoho crm",
      "project management", "asana", "monday.com", "clickup", "trello", "jira", "basecamp",
      "notion", "obsidian", "evernote", "onenote", "todoist", "ticktick",
      "figma", "sketch", "canva", "adobe", "photoshop", "illustrator", "lightroom",
      "premiere pro", "davinci resolve", "after effects", "capcut",
      "slack", "microsoft teams", "zoom", "google meet", "discord",
      "github", "gitlab", "bitbucket", "vscode", "intellij",
      "vercel", "netlify", "heroku", "docker", "kubernetes",
      "aws", "azure", "google cloud", "digitalocean", "linode",
      "supabase", "firebase", "mongodb", "postgresql", "mysql", "redis",
      "stripe", "paypal", "square payment",
      "mailchimp", "constant contact", "klaviyo", "convertkit", "brevo",
      "quickbooks", "xero", "freshbooks", "wave accounting",
      "1password", "lastpass", "bitwarden", "dashlane", "keeper",
      "grammarly", "hemingway", "protonmail", "signal", "telegram",
      "chatgpt", "claude ai", "gemini ai", "copilot", "perplexity",
      "midjourney", "dall-e", "stable diffusion", "cursor", "jasper ai",
      "dropbox", "google drive", "onedrive", "icloud",
      "datadog", "grafana", "new relic", "terraform", "ansible",
      "password manager", "email marketing", "accounting software",
      "web hosting", "website builder", "project management tool",
    ],
    blogCategory: "technology",
    comparisonCategory: "software",
  },
  // Technology (catch-all for tech — should come after more specific categories)
  {
    keywords: [
      "iphone", "samsung", "pixel", "smartphone", "phone", "tablet", "ipad",
      "laptop", "macbook", "chromebook", "computer", "pc", "monitor",
      "keyboard", "mouse", "headphone", "earbuds", "airpods", "speaker",
      "smart home", "alexa", "siri", "chatgpt", "claude", "ai ",
      "artificial intelligence", "machine learning", "robot", "software",
      "app", "programming", "coding", "developer", "cloud", "saas",
      "wifi", "bluetooth", "5g", "processor", "chip", "gpu", "cpu",
      "camera", "drone", "vr", "ar", "wearable", "smartwatch",
      "apple watch", "fitbit", "garmin", "ring doorbell", "nest",
    ],
    blogCategory: "technology",
    comparisonCategory: "technology",
  },
];

/**
 * Checks if a keyword matches in text using word boundary awareness.
 * Prevents "ford" from matching "stanford" or "car" from matching "carnivore".
 */
function keywordMatches(text: string, keyword: string): boolean {
  // Build a regex with word boundaries for short keywords to avoid partial matches
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\b`, "i");
  return pattern.test(text);
}

/**
 * Validates and corrects a blog article category based on the title and topic text.
 * If keyword matching finds a strong signal, it overrides the AI-assigned category.
 */
export function validateBlogCategory(
  aiCategory: string,
  title: string,
  topic: string = ""
): BlogCategory {
  const text = `${title} ${topic}`;

  // Check keyword rules — require 2+ keyword matches for override
  for (const rule of CATEGORY_KEYWORD_RULES) {
    const matchCount = rule.keywords.filter((kw) => keywordMatches(text, kw)).length;
    if (matchCount >= 2) {
      return rule.blogCategory;
    }
  }

  // If AI category is valid, keep it
  if (BLOG_CATEGORIES.includes(aiCategory as BlogCategory)) {
    return aiCategory as BlogCategory;
  }

  return "lifestyle"; // safe fallback
}

/**
 * Validates and corrects a comparison category based on the title and topic text.
 */
export function validateComparisonCategory(
  aiCategory: string,
  title: string,
  entityA: string = "",
  entityB: string = ""
): ComparisonCategory {
  const text = `${title} ${entityA} ${entityB}`;

  // Check keyword rules — require 2+ keyword matches for override
  for (const rule of CATEGORY_KEYWORD_RULES) {
    const matchCount = rule.keywords.filter((kw) => keywordMatches(text, kw)).length;
    if (matchCount >= 2) {
      return rule.comparisonCategory;
    }
  }

  // If AI category is valid, keep it
  if (COMPARISON_CATEGORIES.includes(aiCategory as ComparisonCategory)) {
    return aiCategory as ComparisonCategory;
  }

  return "general";
}
