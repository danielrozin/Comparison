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
  { slug: "software", name: "Software", icon: "🖥️" },
  { slug: "automotive", name: "Automotive", icon: "🚗" },
  { slug: "travel", name: "Travel", icon: "✈️" },
] as const;

// Product subcategories for organizing the Products category page
export const PRODUCT_SUBCATEGORIES: { slug: string; name: string; icon: string; keywords: string[] }[] = [
  { slug: "home-kitchen", name: "Home & Kitchen", icon: "🏠", keywords: ["vacuum", "dyson", "shark", "roomba", "roborock", "kitchen", "coffee", "blender", "air purifier", "instant pot"] },
  { slug: "personal-care", name: "Personal Care & Beauty", icon: "💄", keywords: ["airwrap", "flexstyle", "skincare", "shampoo", "moisturizer", "serum", "haircare", "beauty"] },
  { slug: "audio-wearables", name: "Audio & Wearables", icon: "🎧", keywords: ["airpods", "buds", "headphones", "earbuds", "oura", "whoop", "garmin", "fitbit", "smartwatch", "apple watch"] },
  { slug: "smart-home", name: "Smart Home", icon: "🏡", keywords: ["ring", "nest", "doorbell", "camera", "thermostat", "smart speaker", "alexa", "echo", "homepod"] },
  { slug: "fitness-equipment", name: "Fitness & Equipment", icon: "🏋️", keywords: ["peloton", "nordictrack", "treadmill", "bike", "rower", "creatine", "pre workout", "protein", "supplement"] },
  { slug: "outdoor-travel", name: "Outdoor & Travel", icon: "🏕️", keywords: ["yeti", "hydroflask", "hydro flask", "stanley", "luggage", "cooler", "backpack", "tent"] },
  { slug: "fashion-shopping", name: "Fashion & Shopping", icon: "👗", keywords: ["temu", "shein", "lululemon", "athleta", "nike", "adidas", "fashion", "clothing"] },
  { slug: "streaming", name: "Streaming & Entertainment", icon: "📺", keywords: ["netflix", "max", "hbo", "hulu", "disney", "youtube tv", "streaming", "kindle", "kobo"] },
  { slug: "gaming", name: "Gaming", icon: "🎮", keywords: ["ps6", "ps5", "xbox", "nintendo", "switch", "steam deck", "gaming", "console"] },
  { slug: "automotive", name: "Cars & EVs", icon: "🚗", keywords: ["tesla", "rivian", "lucid", "ford", "chevy", "honda", "toyota", "rav4", "civic", "corolla", "cr-v", "ev", "hybrid"] },
];

// Software subcategories for organizing the Software category page
export const SOFTWARE_SUBCATEGORIES: { slug: string; name: string; icon: string; keywords: string[] }[] = [
  { slug: "vpn-security", name: "VPN & Security", icon: "🔒", keywords: ["vpn", "nordvpn", "expressvpn", "surfshark", "cyberghost", "protonvpn", "antivirus", "norton", "mcafee", "bitdefender", "kaspersky", "malwarebytes", "avast"] },
  { slug: "hosting-domains", name: "Hosting & Domains", icon: "🌐", keywords: ["hosting", "bluehost", "hostinger", "siteground", "godaddy", "namecheap", "cloudflare", "domain", "porkbun"] },
  { slug: "website-builders", name: "Website Builders & eCommerce", icon: "🏪", keywords: ["wix", "squarespace", "webflow", "wordpress", "shopify", "woocommerce", "bigcommerce", "magento", "website builder", "ecommerce"] },
  { slug: "ai-tools", name: "AI Tools", icon: "🤖", keywords: ["chatgpt", "claude", "gemini", "copilot", "perplexity", "midjourney", "dall-e", "stable diffusion", "cursor", "jasper", "grok", "deepseek", "ai tool", "ai writing"] },
  { slug: "productivity", name: "Productivity & PM", icon: "📋", keywords: ["notion", "obsidian", "asana", "monday", "clickup", "trello", "jira", "todoist", "ticktick", "basecamp", "evernote", "onenote", "project management", "linear"] },
  { slug: "design-creative", name: "Design & Creative", icon: "🎨", keywords: ["figma", "sketch", "canva", "photoshop", "illustrator", "lightroom", "premiere", "davinci", "after effects", "capcut", "procreate", "affinity", "adobe"] },
  { slug: "communication", name: "Communication & Collaboration", icon: "💬", keywords: ["slack", "teams", "zoom", "google meet", "discord", "loom", "webex", "confluence"] },
  { slug: "cloud-devtools", name: "Cloud & DevTools", icon: "☁️", keywords: ["aws", "azure", "google cloud", "vercel", "netlify", "github", "gitlab", "docker", "kubernetes", "terraform", "vscode", "intellij", "supabase", "firebase", "heroku", "digitalocean"] },
  { slug: "email-crm", name: "Email Marketing & CRM", icon: "📧", keywords: ["mailchimp", "hubspot", "salesforce", "klaviyo", "convertkit", "brevo", "constant contact", "pipedrive", "zoho", "zendesk", "intercom", "freshdesk", "crm", "email marketing"] },
  { slug: "finance-accounting", name: "Finance & Accounting", icon: "💳", keywords: ["quickbooks", "xero", "freshbooks", "wave", "stripe", "paypal", "square", "accounting", "invoicing", "venmo", "cash app", "klarna"] },
  { slug: "password-privacy", name: "Password & Privacy", icon: "🔑", keywords: ["1password", "lastpass", "bitwarden", "dashlane", "keeper", "protonmail", "signal", "telegram", "brave", "duckduckgo", "tor", "password manager", "privacy"] },
  { slug: "office-tools", name: "Office & Documents", icon: "📄", keywords: ["google docs", "excel", "word", "google sheets", "office 365", "microsoft 365", "libreoffice", "acrobat", "pdf", "grammarly", "google workspace", "dropbox", "google drive", "onedrive"] },
];

// ─── Unified subcategory system for ALL categories ───
export type SubcategoryDef = { slug: string; name: string; icon: string; keywords: string[] };

export const CATEGORY_SUBCATEGORIES: Record<string, SubcategoryDef[]> = {
  software: SOFTWARE_SUBCATEGORIES,
  products: PRODUCT_SUBCATEGORIES,
  sports: [
    { slug: "football", name: "Football / Soccer", icon: "⚽", keywords: ["messi", "ronaldo", "mbappe", "neymar", "haaland", "premier league", "la liga", "champions league", "soccer", "footballer"] },
    { slug: "basketball", name: "Basketball", icon: "🏀", keywords: ["lebron", "jordan", "curry", "durant", "nba", "basketball", "lakers", "celtics"] },
    { slug: "american-football", name: "American Football", icon: "🏈", keywords: ["brady", "mahomes", "nfl", "quarterback", "super bowl", "touchdown", "football"] },
    { slug: "combat-sports", name: "Combat Sports", icon: "🥊", keywords: ["mcgregor", "khabib", "ufc", "mma", "boxing", "tyson", "ali", "fury", "canelo"] },
    { slug: "tennis", name: "Tennis", icon: "🎾", keywords: ["federer", "nadal", "djokovic", "serena", "tennis", "wimbledon", "grand slam"] },
    { slug: "cricket", name: "Cricket", icon: "🏏", keywords: ["cricket", "ipl", "virat", "sachin", "kohli", "ashes", "t20", "test match"] },
    { slug: "motorsport", name: "Motorsport", icon: "🏎️", keywords: ["f1", "formula 1", "nascar", "verstappen", "hamilton", "racing", "grand prix"] },
    { slug: "other-sports", name: "Other Sports", icon: "🏅", keywords: ["golf", "rugby", "hockey", "swimming", "athletics", "olympics", "baseball", "mlb"] },
  ],
  countries: [
    { slug: "asia", name: "Asia", icon: "🌏", keywords: ["japan", "china", "india", "korea", "vietnam", "thailand", "indonesia", "philippines", "singapore", "malaysia", "pakistan", "bangladesh"] },
    { slug: "europe", name: "Europe", icon: "🇪🇺", keywords: ["germany", "france", "uk", "italy", "spain", "netherlands", "sweden", "norway", "poland", "switzerland", "portugal", "ireland", "denmark", "finland", "austria", "belgium", "greece"] },
    { slug: "americas", name: "Americas", icon: "🌎", keywords: ["usa", "canada", "mexico", "brazil", "argentina", "colombia", "chile", "peru", "united states", "america"] },
    { slug: "middle-east-africa", name: "Middle East & Africa", icon: "🌍", keywords: ["saudi", "uae", "dubai", "israel", "egypt", "south africa", "nigeria", "kenya", "turkey", "iran", "qatar", "morocco"] },
    { slug: "oceania", name: "Oceania", icon: "🦘", keywords: ["australia", "new zealand", "fiji", "oceania"] },
  ],
  technology: [
    { slug: "smartphones", name: "Smartphones", icon: "📱", keywords: ["iphone", "samsung", "pixel", "oneplus", "xiaomi", "smartphone", "phone", "galaxy"] },
    { slug: "laptops-computers", name: "Laptops & Computers", icon: "💻", keywords: ["macbook", "laptop", "pc", "chromebook", "dell", "lenovo", "hp", "computer", "desktop", "imac"] },
    { slug: "tablets", name: "Tablets", icon: "📟", keywords: ["ipad", "tablet", "surface", "galaxy tab", "fire tablet"] },
    { slug: "gaming-tech", name: "Gaming Tech", icon: "🎮", keywords: ["ps5", "ps6", "xbox", "nintendo", "switch", "steam deck", "gaming", "console", "gpu", "graphics card"] },
    { slug: "ai-ml", name: "AI & Machine Learning", icon: "🧠", keywords: ["ai", "machine learning", "neural", "deep learning", "chatgpt", "claude", "llm", "artificial intelligence"] },
    { slug: "networking", name: "Networking & WiFi", icon: "📡", keywords: ["wifi", "router", "mesh", "5g", "bluetooth", "vpn", "network", "ethernet"] },
  ],
  companies: [
    { slug: "big-tech", name: "Big Tech", icon: "🏢", keywords: ["google", "apple", "microsoft", "amazon", "meta", "facebook", "alphabet", "nvidia", "tesla"] },
    { slug: "startups-saas", name: "Startups & SaaS", icon: "🚀", keywords: ["startup", "saas", "openai", "anthropic", "stripe", "shopify", "notion", "figma", "canva"] },
    { slug: "finance-companies", name: "Finance & Fintech", icon: "🏦", keywords: ["bank", "visa", "mastercard", "paypal", "robinhood", "coinbase", "binance", "revolut", "wise"] },
    { slug: "retail-ecommerce", name: "Retail & eCommerce", icon: "🛒", keywords: ["amazon", "walmart", "costco", "target", "ebay", "etsy", "alibaba", "temu", "shein"] },
    { slug: "food-beverage", name: "Food & Beverage", icon: "🍔", keywords: ["coca cola", "pepsi", "starbucks", "dunkin", "mcdonalds", "burger king", "chipotle", "subway"] },
  ],
  entertainment: [
    { slug: "streaming-services", name: "Streaming Services", icon: "📺", keywords: ["netflix", "disney", "hbo", "max", "hulu", "amazon prime", "apple tv", "paramount", "peacock", "youtube"] },
    { slug: "music", name: "Music & Audio", icon: "🎵", keywords: ["spotify", "apple music", "tidal", "youtube music", "pandora", "soundcloud", "deezer"] },
    { slug: "gaming-entertainment", name: "Gaming", icon: "🎮", keywords: ["playstation", "xbox", "nintendo", "steam", "epic games", "twitch", "gaming"] },
    { slug: "social-media", name: "Social Media", icon: "📱", keywords: ["tiktok", "instagram", "twitter", "reddit", "snapchat", "linkedin", "threads", "bluesky", "youtube", "social media"] },
    { slug: "movies-tv", name: "Movies & TV", icon: "🎬", keywords: ["marvel", "dc", "movie", "film", "series", "show", "anime", "manga"] },
  ],
  automotive: [
    { slug: "electric-vehicles", name: "Electric Vehicles", icon: "⚡", keywords: ["tesla", "rivian", "lucid", "ev", "electric", "polestar", "byd", "model y", "model 3", "model s"] },
    { slug: "suvs-trucks", name: "SUVs & Trucks", icon: "🚙", keywords: ["suv", "truck", "rav4", "cr-v", "highlander", "explorer", "tahoe", "4runner", "f-150", "silverado", "ram"] },
    { slug: "sedans-coupes", name: "Sedans & Coupes", icon: "🚗", keywords: ["sedan", "coupe", "civic", "corolla", "camry", "accord", "3 series", "c-class", "a4"] },
    { slug: "luxury", name: "Luxury Cars", icon: "✨", keywords: ["bmw", "mercedes", "audi", "lexus", "porsche", "bentley", "rolls royce", "maserati", "luxury"] },
    { slug: "motorcycles", name: "Motorcycles", icon: "🏍️", keywords: ["motorcycle", "harley", "ducati", "yamaha", "kawasaki", "honda cb", "bike"] },
  ],
};

// Helper to get subcategories for any category
export function getSubcategoriesForSlug(categorySlug: string): SubcategoryDef[] {
  return CATEGORY_SUBCATEGORIES[categorySlug] || [];
}

export const PAGE_SIZES = {
  COMPARISONS_PER_CATEGORY: 20,
  TRENDING_COUNT: 10,
  RELATED_COMPARISONS: 8,
  SEARCH_RESULTS: 20,
  ADMIN_PAGE_SIZE: 50,
} as const;
