/**
 * Smart Auto-Categorization Engine
 * Classifies comparisons into category → subcategory → tags
 */

export interface Classification {
  category: string;
  subcategory: string;
  tags: string[];
}

// Category → subcategory → keyword patterns
const TAXONOMY: {
  category: string;
  subcategories: {
    name: string;
    patterns: RegExp;
    tags: string[];
  }[];
}[] = [
  {
    category: "sports",
    subcategories: [
      { name: "Soccer Players", patterns: /messi|ronaldo|neymar|mbappe|haaland|maradona|pele|beckham|zidane|modric|salah|benzema|lewandowski|suarez|hazard|pogba|kante|de bruyne|ronaldinho|rivaldo|romario|xavi|iniesta|pirlo|buffon/i, tags: ["soccer", "football", "players"] },
      { name: "Soccer Teams", patterns: /real madrid|barcelona|manchester|liverpool|chelsea|arsenal|bayern|juventus|psg|inter milan|ac milan|tottenham|dortmund|atletico/i, tags: ["soccer", "football", "teams"] },
      { name: "Basketball Players", patterns: /lebron|jordan|kobe|curry|durant|shaq|magic johnson|bird|iverson|duncan|garnett|nowitzki|harden|westbrook|giannis|jokic|luka|tatum|morant/i, tags: ["basketball", "nba", "players"] },
      { name: "Tennis Players", patterns: /federer|nadal|djokovic|serena|venus williams|alcaraz|sinner|medvedev|tsitsipas|murray|agassi|sampras/i, tags: ["tennis", "players"] },
      { name: "Combat Sports", patterns: /ali|tyson|mcgregor|khabib|mayweather|pacquiao|ufc|boxing|mma|jones|adesanya|volkanovski|fury|wilder|joshua|canelo|crawford/i, tags: ["combat", "fighting"] },
      { name: "American Football", patterns: /brady|manning|mahomes|rodgers|nfl|quarterback|patriots|chiefs|cowboys|packers|49ers|eagles|super bowl/i, tags: ["nfl", "american football"] },
      { name: "Golf", patterns: /tiger woods|nicklaus|mcilroy|spieth|koepka|scheffler|rahm|golf|pga/i, tags: ["golf"] },
      { name: "Cricket Players", patterns: /kohli|sachin|tendulkar|dhoni|smith|root|williamson|babar|cricket/i, tags: ["cricket", "players"] },
      { name: "Sports Leagues", patterns: /nfl vs nba|nba vs nfl|premier league|champions league|la liga|serie a|bundesliga|mls|nhl/i, tags: ["leagues", "sports"] },
    ],
  },
  {
    category: "technology",
    subcategories: [
      { name: "Smartphones", patterns: /iphone|samsung|galaxy|pixel|oneplus|xiaomi|huawei|phone|smartphone|mobile/i, tags: ["phones", "mobile"] },
      { name: "Computers", patterns: /macbook|laptop|desktop|pc|imac|dell|lenovo|thinkpad|surface|chromebook/i, tags: ["computers", "laptops"] },
      { name: "Gaming", patterns: /ps5|xbox|playstation|nintendo|switch|steam deck|gaming|console|pc gaming/i, tags: ["gaming", "consoles"] },
      { name: "AI & ML", patterns: /chatgpt|claude|gemini|gpt|llm|ai\b|artificial intelligence|copilot|midjourney|dall.e|stable diffusion|openai|anthropic|perplexity/i, tags: ["ai", "machine learning"] },
      { name: "Programming Languages", patterns: /python|javascript|java\b|typescript|rust|go\b|swift|kotlin|ruby|php|c\+\+|c#/i, tags: ["programming", "coding"] },
      { name: "Web Frameworks", patterns: /react|angular|vue|next\.?js|svelte|django|flask|laravel|rails|express/i, tags: ["frameworks", "web development"] },
      { name: "Cloud & DevOps", patterns: /aws|azure|gcp|google cloud|docker|kubernetes|vercel|netlify|heroku|cloudflare/i, tags: ["cloud", "devops"] },
      { name: "Software & Tools", patterns: /notion|obsidian|slack|teams|zoom|figma|sketch|canva|photoshop|wordpress|wix|shopify|vscode|cursor/i, tags: ["software", "tools", "saas"] },
      { name: "Hardware", patterns: /nvidia|amd|intel|rtx|gpu|cpu|chip|m[1-4]|snapdragon|processor|graphics card/i, tags: ["hardware", "chips"] },
      { name: "Operating Systems", patterns: /windows|macos|linux|android|ios|chrome.?os/i, tags: ["os", "operating systems"] },
      { name: "Browsers", patterns: /chrome|firefox|safari|edge|brave|opera|browser/i, tags: ["browsers", "web"] },
      { name: "Streaming & Music", patterns: /spotify|apple music|tidal|youtube music|deezer|soundcloud/i, tags: ["music", "streaming"] },
    ],
  },
  {
    category: "countries",
    subcategories: [
      { name: "Country Comparisons", patterns: /usa|china|japan|india|russia|germany|france|uk\b|brazil|canada|australia|mexico|south korea|north korea|israel|iran|turkey|pakistan|indonesia|saudi|egypt|nigeria|south africa|argentina|italy|spain|sweden|norway|switzerland|netherlands|poland|ukraine/i, tags: ["countries", "nations"] },
      { name: "US States", patterns: /california|texas|florida|new york state|ohio|illinois|pennsylvania|georgia state|michigan|virginia/i, tags: ["us states", "states"] },
      { name: "Cities", patterns: /new york|los angeles|london|paris|tokyo|shanghai|dubai|singapore|hong kong|sydney|toronto|berlin|moscow|mumbai|chicago|san francisco|seattle|miami|austin|boston/i, tags: ["cities", "urban"] },
    ],
  },
  {
    category: "companies",
    subcategories: [
      { name: "Tech Companies", patterns: /google|microsoft|apple inc|meta|amazon|tesla|nvidia|netflix|spotify|uber|lyft|airbnb|booking|twitter|tiktok|snap/i, tags: ["tech companies"] },
      { name: "Retail & E-commerce", patterns: /walmart|target|costco|sam.s club|home depot|lowe|amazon|ebay|etsy|alibaba|shopify/i, tags: ["retail", "shopping"] },
      { name: "Food & Restaurants", patterns: /mcdonald|burger king|starbucks|dunkin|chipotle|subway|wendy|chick.fil.a|pizza hut|domino|taco bell|kfc|popeyes/i, tags: ["restaurants", "fast food"] },
      { name: "Airlines", patterns: /delta|united|american airlines|southwest|jetblue|spirit|frontier|lufthansa|emirates|qatar|british airways|ryanair/i, tags: ["airlines", "travel"] },
      { name: "Delivery & Rideshare", patterns: /doordash|uber eats|grubhub|instacart|postmates|uber|lyft/i, tags: ["delivery", "rideshare"] },
      { name: "Streaming Services", patterns: /netflix|disney|hulu|hbo|peacock|paramount|amazon prime/i, tags: ["streaming", "entertainment"] },
      { name: "Hotels & Travel", patterns: /airbnb|vrbo|booking|marriott|hilton|hyatt|expedia|trivago/i, tags: ["hotels", "travel"] },
    ],
  },
  {
    category: "brands",
    subcategories: [
      { name: "Sportswear", patterns: /nike|adidas|puma|under armour|new balance|reebok|asics|converse|jordan brand/i, tags: ["sportswear", "fashion"] },
      { name: "Luxury Fashion", patterns: /gucci|louis vuitton|chanel|hermes|prada|dior|versace|balenciaga|burberry|fendi/i, tags: ["luxury", "fashion"] },
      { name: "Automotive", patterns: /toyota|honda|bmw|mercedes|audi|ford|chevy|chevrolet|hyundai|kia|nissan|volkswagen|porsche|ferrari|lamborghini|tesla|rivian|lucid/i, tags: ["cars", "automotive"] },
      { name: "Beverages", patterns: /coca.cola|pepsi|red bull|monster|gatorade|dr pepper|sprite|fanta/i, tags: ["drinks", "beverages"] },
    ],
  },
  {
    category: "health",
    subcategories: [
      { name: "Medications", patterns: /tylenol|advil|ibuprofen|acetaminophen|aspirin|ozempic|wegovy|mounjaro|zepbound|adderall|ritalin|xanax|lexapro|zoloft/i, tags: ["medications", "drugs", "pharma"] },
      { name: "Diets & Nutrition", patterns: /keto|paleo|vegan|vegetarian|carnivore|mediterranean|intermittent fasting|whole30|atkins|low carb|gluten free/i, tags: ["diet", "nutrition"] },
      { name: "Fitness", patterns: /yoga|pilates|crossfit|gym|running|walking|swimming|cycling|hiit|strength training|cardio|peloton|orangetheory/i, tags: ["fitness", "exercise"] },
      { name: "Food & Ingredients", patterns: /almond milk|oat milk|organic|protein|whey|casein|creatine|collagen|vitamin|supplement/i, tags: ["food", "supplements"] },
    ],
  },
  {
    category: "finance",
    subcategories: [
      { name: "Investing", patterns: /stock|etf|mutual fund|index fund|bond|dividend|s&p|nasdaq|dow jones|vanguard|fidelity|schwab|robinhood/i, tags: ["investing", "stocks"] },
      { name: "Crypto", patterns: /bitcoin|ethereum|solana|cardano|dogecoin|crypto|blockchain|coinbase|binance|defi|nft/i, tags: ["crypto", "blockchain"] },
      { name: "Banking", patterns: /chase|bank of america|wells fargo|citi|capital one|credit union|savings account|checking account/i, tags: ["banking", "banks"] },
      { name: "Tax & Business", patterns: /llc|s.corp|c.corp|sole proprietor|401k|ira|roth|tax|mortgage|renting|buying/i, tags: ["tax", "business structure"] },
      { name: "Real Estate", patterns: /rent|buy|mortgage|property|real estate|house|apartment|condo/i, tags: ["real estate", "housing"] },
    ],
  },
  {
    category: "education",
    subcategories: [
      { name: "Universities", patterns: /harvard|stanford|mit|yale|princeton|columbia|berkeley|oxford|cambridge|caltech|university|college/i, tags: ["universities", "colleges"] },
      { name: "Degrees & Careers", patterns: /mba|master|bachelor|phd|degree|certification|bootcamp|online course|career|salary/i, tags: ["degrees", "careers"] },
    ],
  },
  {
    category: "entertainment",
    subcategories: [
      { name: "Movies & TV", patterns: /marvel|dc|star wars|star trek|game of thrones|breaking bad|stranger things|lord of the rings|harry potter|disney|pixar|anime/i, tags: ["movies", "tv shows"] },
      { name: "Music Artists", patterns: /taylor swift|drake|beyonce|kanye|eminem|beatles|rolling stones|elvis|michael jackson|adele|ed sheeran|billie eilish/i, tags: ["music", "artists"] },
      { name: "Celebrities", patterns: /elon musk|jeff bezos|mark zuckerberg|bill gates|warren buffett|oprah|kardashian|trump|obama|biden|putin|xi jinping|modi|netanyahu/i, tags: ["celebrities", "public figures"] },
    ],
  },
  {
    category: "history",
    subcategories: [
      { name: "Wars & Conflicts", patterns: /ww1|ww2|world war|civil war|cold war|vietnam|korean war|war on terror|revolutionary war|napoleonic/i, tags: ["wars", "military history"] },
      { name: "Empires & Civilizations", patterns: /roman|ottoman|byzantine|persian|mongol|british empire|greek|egyptian|mayan|aztec|inca/i, tags: ["empires", "ancient history"] },
      { name: "Political Systems", patterns: /capitalism|socialism|communism|democracy|monarchy|fascism|libertarian|conservative|liberal/i, tags: ["politics", "ideology"] },
    ],
  },
];

export function classifyComparison(entityA: string, entityB: string): Classification {
  const combined = `${entityA} ${entityB}`.toLowerCase();

  for (const cat of TAXONOMY) {
    for (const sub of cat.subcategories) {
      if (sub.patterns.test(combined)) {
        return {
          category: cat.category,
          subcategory: sub.name,
          tags: [...sub.tags, slugify(entityA), slugify(entityB)],
        };
      }
    }
  }

  return {
    category: "general",
    subcategory: "General Comparisons",
    tags: [slugify(entityA), slugify(entityB)],
  };
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
}
