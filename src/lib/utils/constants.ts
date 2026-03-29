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

export const PAGE_SIZES = {
  COMPARISONS_PER_CATEGORY: 20,
  TRENDING_COUNT: 10,
  RELATED_COMPARISONS: 8,
  SEARCH_RESULTS: 20,
  ADMIN_PAGE_SIZE: 50,
} as const;
