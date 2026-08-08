/**
 * Affiliate Link Service
 *
 * Generates affiliate URLs for entities based on their type and category.
 * Supports Amazon Associates, and is extensible for Impact, ShareASale, etc.
 *
 * Configuration:
 *   NEXT_PUBLIC_AMAZON_AFFILIATE_TAG - Amazon Associates tag (e.g. "aversusb-20")
 *   NEXT_PUBLIC_AFFILIATE_ENABLED    - Set to "true" to enable affiliate links
 */

import type { ComparisonEntityData, AffiliateLink } from "@/types";
import { getPrisma } from "@/lib/db/prisma";

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG || "";
const AFFILIATE_ENABLED = process.env.NEXT_PUBLIC_AFFILIATE_ENABLED === "true";

// Entity types that are eligible for affiliate links (products people can buy)
// "software" intentionally excluded: SaaS/subscription software cannot be purchased
// on Amazon as a "/dp/" product — emitting an /s?k= search link earns ~$0 and
// damages credibility on B2B comparison pages. See DAN-2208.
// "vehicle" intentionally excluded: cars are not sold on Amazon — an
// /s?k=Toyota+Camry search link points at floor mats and toy models, not the
// car. Vehicles route to the manufacturer's official site instead.
const AFFILIATE_ELIGIBLE_TYPES = new Set([
  "product",
  "products",
  "technology",
  "brand",
  "device",
  "gadget",
  "appliance",
  "supplement",
  "smartphone",
  "medication",
  "gaming",
  "audio",
  "beverage/product",
]);

// Categories where affiliate links make commercial sense
// "software" intentionally excluded: the software comparison category covers SaaS/
// subscription tools (CRMs, project management, productivity apps) that are not
// sold on Amazon. See DAN-2208.
// "automotive" intentionally excluded: the automotive category compares car
// models, which cannot be bought on Amazon (see vehicle note above).
const AFFILIATE_ELIGIBLE_CATEGORIES = new Set([
  "technology",
  "products",
  "health",
  "entertainment",
  "brands",
  "gaming",
  "electronics",
  "appliances",
  "fitness",
]);

// Entity types that are inherently digital / non-physical and cannot be
// purchased on Amazon as a "/dp/" product. Emitting an Amazon /s?k= search
// link for these points at irrelevant junk (~0% conversion) and risks the
// Amazon Associates relevance policy. See DAN-1053.
const DIGITAL_ENTITY_TYPES = new Set([
  "streaming",
  "streaming_service",
  "browser",
  "os",
  "operating_system",
  "saas",
  "web_service",
  "website",
  "app",
  "social_media",
  "social-media",
  "search_engine",
  "vpn",
  // The bulk "software" type (SaaS tools, dev frameworks, cloud platforms —
  // AWS, React, Google Meet) is digital: never Amazon-buyable. DAN-2208.
  "software",
  "framework",
  "platform",
]);

// Name patterns for well-known digital/non-physical entities that live inside
// the technology/products/entertainment categories and would otherwise slip
// through category-gating. These are services, browsers, operating systems,
// free/OSS tools, streaming platforms and web apps — none buyable on Amazon as
// a product. Patterns are kept specific to avoid catching physical hardware
// that shares a brand name (e.g. "Apple Music" the service vs an iPhone).
const DIGITAL_ENTITY_PATTERNS: RegExp = new RegExp(
  [
    // Streaming video
    "netflix",
    "\\bhulu\\b",
    // "Max" only as the streaming service — NOT "iPhone 15 Pro Max" etc.
    "^max$|hbo\\s*max|\\bmax\\b\\s*\\(formerly",
    "hbo",
    "disney\\s*\\+|disney\\s*plus",
    "peacock",
    "paramount\\s*\\+|paramount\\s*plus",
    "prime\\s*video",
    "crunchyroll",
    "funimation",
    "sling\\s*tv",
    "fubo",
    "youtube\\s*tv",
    "apple\\s*tv\\s*\\+|apple\\s*tv\\s*plus",
    // Streaming music
    "spotify",
    "apple\\s*music",
    "\\btidal\\b",
    "deezer",
    "soundcloud",
    "pandora",
    "youtube\\s*music",
    "amazon\\s*music",
    // Browsers
    "google\\s*chrome|\\bchrome\\b",
    "firefox",
    "\\bsafari\\b",
    "microsoft\\s*edge|\\bedge\\b",
    "brave\\s*browser|\\bbrave\\b",
    "\\bopera\\b",
    "vivaldi",
    "tor\\s*browser",
    // Operating systems
    "windows\\s*\\d|microsoft\\s*windows|\\bwindows\\b",
    "macos|mac\\s*os",
    "\\blinux\\b",
    "ubuntu",
    "fedora",
    "debian",
    "chrome\\s*os|chromeos",
    "\\bandroid\\b",
    "\\bios\\b",
    // SaaS / productivity / web apps / free & OSS software
    "notion",
    "obsidian",
    "\\bslack\\b",
    "microsoft\\s*teams",
    "\\bzoom\\b",
    // Chat / messaging / comms apps (mirror the slack/teams/zoom cluster) — DAN-1140
    "discord",
    "telegram",
    "whatsapp",
    "\\bsignal\\b",
    "skype",
    "figma",
    "sketch\\b",
    "canva",
    "photoshop",
    "wordpress",
    "\\bwix\\b",
    "squarespace",
    "webflow",
    "dropbox",
    "google\\s*drive",
    "onedrive",
    "vs\\s*code|vscode|visual\\s*studio\\s*code",
    "\\bcursor\\b",
    "gmail",
    "outlook",
    "evernote",
    "\\bchatgpt\\b",
    "\\bclaude\\b",
    "\\bgemini\\b",
    "perplexity",
    "midjourney",
    // CRM / sales platforms (DAN-2208)
    "salesforce",
    "hubspot",
    "pipedrive",
    "zoho\\s*crm|\\bzoho\\b",
    "microsoft\\s*dynamics",
    "freshsales",
    "keap|infusionsoft",
    "\\bclose\\s*crm\\b|\\bclose\\.io\\b",
    // Project management / work OS (DAN-2208)
    "confluence",
    "\\bjira\\b",
    "atlassian",
    "\\basana\\b",
    "\\bmonday\\.com\\b|\\bmonday\\s*\\.com\\b",
    "clickup",
    "\\btrello\\b",
    "basecamp",
    "\\blinear\\.app\\b|\\blinear\\b(?!\\s*tv)",
    "\\bheight\\.app\\b",
    "teamwork",
    "wrike",
    "smartsheet",
    "\\bairtable\\b",
    "\\bcoda\\.io\\b|\\bcoda\\b(?!\\s*cola)",
    // Customer support / helpdesk (DAN-2208)
    "zendesk",
    "intercom",
    "freshdesk",
    "freshworks",
    "servicenow",
    "helpscout|help\\s*scout",
    "gorgias",
    "\\bfront\\b(?=\\s*app|\\s*\\.com|\\s*help|$)",
    // Marketing / email automation (DAN-2208)
    "mailchimp",
    "klaviyo",
    "convertkit",
    "\\bbrevo\\b|sendinblue",
    "\\bactivecampaign\\b",
    "marketo",
    "pardot",
    "constant\\s*contact",
    // HR / payroll SaaS (DAN-2208)
    "workday",
    "bamboohr|bamboo\\s*hr",
    "gusto\\s*payroll|\\bgusto\\b",
    "rippling",
    "\\bceridian\\b",
    "\\badp\\b(?!\\s*receptor)",
    // Developer / DevOps tooling (DAN-2208)
    "\\bgithub\\b",
    "\\bgitlab\\b",
    "bitbucket",
    "\\bdatadog\\b",
    "\\bgrafana\\b",
    "new\\s*relic",
    "pagerduty",
    "\\bsentry\\.io\\b|\\bsentry\\b(?=\\s*error)",
    "\\bpostman\\b",
    "\\btwilio\\b",
    "\\bsendgrid\\b",
    "\\bsegment\\.com\\b|\\bsegment\\b(?=\\s*cdp|\\s*analytics)",
    "\\bmixpanel\\b",
    "\\bamplitude\\.com\\b|\\bamplitude\\b(?=\\s*analytics)",
    "\\bhotjar\\b",
    "\\bfullstory\\b",
    // Cloud & infra platforms (DAN-2208)
    "\\bvercel\\b",
    "\\bnetlify\\b",
    "\\bheroku\\b",
    "\\bdigitalocean\\b",
    "\\bsupabase\\b",
    "\\bfirebase\\b",
    "\\bmongodb\\b",
    // Accounting / finance SaaS (DAN-2208)
    "quickbooks",
    "\\bxero\\b",
    "freshbooks",
    "wave\\s*accounting",
    // E-commerce platforms (DAN-2208)
    "\\bshopify\\b",
    "bigcommerce",
    "woocommerce",
    "\\bmagento\\b",
    // VPNs / web services
    "nordvpn|surfshark|expressvpn",
    "\\b1password\\b|lastpass|bitwarden",
    // Social networks (typed inconsistently in the DB — gate by name too)
    "facebook|\\breddit\\b|instagram|tiktok|snapchat|pinterest|linkedin|\\btwitter\\b|\\bx\\b\\s*\\(formerly",
    // Cloud platforms
    "\\baws\\b|amazon\\s*web\\s*services|\\bazure\\b|google\\s*cloud|\\bgcp\\b",
    // Game stores / gaming subscriptions (codes ≠ the service itself)
    "\\bsteam\\b(?!\\s*(cleaner|mop|iron))|game\\s*pass|playstation\\s*plus|epic\\s*games",
    // Online marketplaces / retailers / listing platforms — the destination
    // IS their own site, never an Amazon competitor search
    "\\bchewy\\b|\\bebay\\b|\\betsy\\b|\\btemu\\b|\\bshein\\b|aliexpress|\\bwayfair\\b|\\bikea\\b|best\\s*buy|\\blowe'?s\\b|home\\s*depot|\\bwalmart\\b|\\btarget\\b(?=\\s*(store|corp|retail|vs|$))|\\bcostco\\b|\\bzillow\\b|realtor\\.com|\\bkayak\\b|expedia|booking\\.com|\\bairbnb\\b|\\bvrbo\\b|tripadvisor",
    // News / media subscriptions
    "wall\\s*street\\s*journal|\\bwsj\\b|bloomberg|new\\s*york\\s*times|\\bnyt\\b|washington\\s*post|the\\s*economist|financial\\s*times",
    // Meal-kit subscriptions
    "hellofresh|hello\\s*fresh|home\\s*chef|blue\\s*apron|factor\\s*meals",
    // Office / productivity suites (SaaS these days, never a /dp/ product)
    "google\\s*(sheets|docs|slides|drive|flights|maps|photos)|\\bexcel\\b|powerpoint|microsoft\\s*(office|365|word)",
    // Travel booking platforms
    "hotels\\.com|priceline|orbitz|travelocity|skyscanner",
    // Amazon's own sub-brands — an Amazon search FOR Amazon is circular junk
    "amazon\\s*(haul|fresh|prime|basics)?$|amazon\\s*haul",
  ].join("|"),
  "i",
);

// Entity types that are organizations, places, people, or abstract concepts —
// never purchasable on Amazon regardless of which category the comparison
// lives in. The category fallback used to grant Amazon /s?k= links to banks
// ("Ally Bank" in the products category), fast-food chains, diets, and
// airlines. The link must sell the actual entity or not exist at all.
const NON_BUYABLE_ENTITY_TYPES = new Set([
  "company",
  "banking",
  "bank",
  "finance",
  "financial_product",
  "financial_option",
  "financial_decision",
  "financial_metric",
  "insurance",
  "investment",
  "brokerage",
  "retirement",
  "savings",
  "mortgage",
  "payment",
  "index",
  "currency",
  "market",
  "economy",
  "person",
  "athlete",
  "team",
  "sports-team",
  "sports team",
  "sports league",
  "country",
  "place",
  "city",
  "destination",
  "travel",
  "travel mode",
  "vacation",
  "flight",
  "airline",
  "hotel",
  "accommodation",
  "restaurant",
  "food_and_drink",
  "institution",
  "school",
  "education",
  "degree",
  "career",
  "profession",
  "work arrangement",
  "event",
  "history",
  "military",
  "military_branch",
  "branch",
  "rank",
  "military rank/position",
  "diet",
  "diet/lifestyle",
  "diet/health",
  "dietary philosophy",
  "concept",
  "approach",
  "practice",
  "activity",
  "language",
  "linguistic_term",
  "anatomy",
  "surgery",
  "treatment",
  "test",
  "organization",
  "industry",
  "business structure",
  "alliance",
  "animal",
]);

// Name patterns for entities that slip through type/category gates but are
// clearly not products sold on Amazon: financial institutions, airlines,
// hotel chains, restaurant/fast-food chains, and luxury houses that do not
// distribute through Amazon (a search there surfaces counterfeits).
const NON_BUYABLE_NAME_PATTERNS: RegExp = new RegExp(
  [
    // Corporate suffixes — "Nike Inc.", "Netflix, Inc.", "Blue Origin LLC"
    "\\b(inc\\.?|incorporated|corp\\.?|corporation|llc|ltd\\.?|plc|holdings|group)\\b",
    // Financial institutions & products
    "\\b(bank|banking|credit union|capital one|chase|wells fargo|citibank|goldman sachs|fidelity|vanguard|schwab|credit card|debit card|american express|amex|mastercard|\\bvisa\\b|discover card)\\b",
    // Airlines / travel
    "airlines?|airways|\\bdelta\\b|\\bunited air|lufthansa|emirates\\b",
    // Hotels
    "\\b(marriott|hilton|hyatt|sheraton|resort|hostel)\\b",
    // Restaurant / fast-food chains
    "mcdonald|burger king|\\bwendy'?s\\b|\\bkfc\\b|taco bell|subway\\b|chipotle|chick-?fil-?a|popeyes|domino'?s|pizza hut|starbucks|dunkin|five guys|in-?n-?out|panera|olive garden|applebee|chili'?s|cheesecake factory|texas roadhouse|outback steakhouse|jimmy john",
    // Luxury fashion houses (not officially on Amazon; searches surface fakes)
    "\\b(gucci|louis vuitton|chanel|herm[eè]s|prada|dior|cartier|rolex|patek philippe)\\b",
    // Diets / fitness regimes / abstract health
    "\\b(diet|fasting|keto(genic)?|paleo|veganism|crossfit|pilates|yoga|gym)\\b",
    // Degrees / education credentials
    "\\b(mba|bachelor'?s?|master'?s|ph\\.?d|degree|diploma|bootcamp)\\b",
    // Abstract finance / economy terms
    "stock\\s*market|real\\s*estate|\\beconomy\\b|\\binflation\\b|\\brecession\\b",
    // Insurance carriers
    "\\binsurance\\b|\\bgeico\\b|\\ballstate\\b|state\\s*farm|progressive\\b|nationwide\\b|liberty\\s*mutual|\\baetna\\b|\\bcigna\\b|humana\\b",
    // Universities / schools
    "\\buniversity\\b|\\bcollege\\b|harvard|stanford|\\bmit\\b|\\byale\\b|princeton|\\boxford\\b|berkeley",
    // Grocery / supermarket / restaurant chains
    "\\bkroger\\b|safeway|albertsons|publix|whole\\s*foods|trader\\s*joe|\\baldi\\b|wegmans|\\bqdoba\\b|\\bmoe'?s\\b|panda\\s*express|\\bwingstop\\b|\\bsonic\\b\\s*(drive|menu|vs|$)|golden\\s*corral|buffalo\\s*wild\\s*wings|red\\s*lobster|\\bihop\\b|denny'?s|waffle\\s*house|cracker\\s*barrel",
    // Military hardware (fighter jets, warships — comparison pages, not products)
    "\\bf-?1[456]\\b|\\bf-?22\\b|\\bf-?35\\b|fighter\\s*(jet|falcon)|\\bbomber\\b|warship|destroyer|aircraft\\s*carrier|\\bmissile\\b",
  ].join("|"),
  "i",
);

/**
 * Entities that are organizations, places, concepts, or otherwise not a
 * concrete product — an Amazon search link would point at merchandise or
 * junk, never the entity itself. See user directive: "Always check that the
 * product is the actual product we are talking about."
 */
export function isNonBuyableEntity(entity: ComparisonEntityData): boolean {
  const type = entity.entityType?.toLowerCase?.() ?? "";
  if (NON_BUYABLE_ENTITY_TYPES.has(type)) return true;
  if (NON_BUYABLE_NAME_PATTERNS.test(entity.name)) return true;
  return false;
}

// Vehicles cannot be bought on Amazon. An /s?k= search for a car model returns
// accessories and toys — not the product being compared. Route these to the
// manufacturer's official site instead.
const VEHICLE_ENTITY_TYPES = new Set([
  "vehicle",
  "car",
  "truck",
  "suv",
  "motorcycle",
  "automobile",
  "ev",
]);

// Car / motorcycle manufacturer homepages, matched against the entity name
// ("Toyota Camry" → toyota.com). First match wins; keep specific before broad.
const VEHICLE_MAKE_HOMEPAGES: ReadonlyArray<readonly [RegExp, string]> = [
  [/\btoyota\b/i, "https://www.toyota.com"],
  [/\bhonda\b/i, "https://automobiles.honda.com"],
  [/\bford\b/i, "https://www.ford.com"],
  [/\bchevrolet\b|\bchevy\b/i, "https://www.chevrolet.com"],
  [/\btesla\b/i, "https://www.tesla.com"],
  [/\bnissan\b/i, "https://www.nissanusa.com"],
  [/\bhyundai\b/i, "https://www.hyundaiusa.com"],
  [/\bkia\b/i, "https://www.kia.com/us"],
  [/\bmazda\b/i, "https://www.mazdausa.com"],
  [/\bsubaru\b/i, "https://www.subaru.com"],
  [/\bvolkswagen\b|\bvw\b/i, "https://www.vw.com"],
  [/\bbmw\b/i, "https://www.bmwusa.com"],
  [/mercedes/i, "https://www.mbusa.com"],
  [/\baudi\b/i, "https://www.audiusa.com"],
  [/\blexus\b/i, "https://www.lexus.com"],
  [/\bacura\b/i, "https://www.acura.com"],
  [/\binfiniti\b/i, "https://www.infinitiusa.com"],
  [/\bvolvo\b/i, "https://www.volvocars.com/us"],
  [/\bporsche\b/i, "https://www.porsche.com/usa"],
  [/\bjeep\b/i, "https://www.jeep.com"],
  [/\bram\b\s*\d|\bram\s*truck/i, "https://www.ramtrucks.com"],
  [/\bgmc\b/i, "https://www.gmc.com"],
  [/\bcadillac\b/i, "https://www.cadillac.com"],
  [/\bbuick\b/i, "https://www.buick.com"],
  [/\bdodge\b/i, "https://www.dodge.com"],
  [/\bchrysler\b/i, "https://www.chrysler.com"],
  [/\blincoln\b/i, "https://www.lincoln.com"],
  [/\bgenesis\b/i, "https://www.genesis.com/us"],
  [/\bmitsubishi\b/i, "https://www.mitsubishicars.com"],
  [/\brivian\b/i, "https://rivian.com"],
  [/\blucid\b/i, "https://lucidmotors.com"],
  [/\bpolestar\b/i, "https://www.polestar.com"],
  [/land\s*rover|range\s*rover/i, "https://www.landroverusa.com"],
  [/\bjaguar\b/i, "https://www.jaguarusa.com"],
  [/\bmini\b\s*cooper|\bmini\b/i, "https://www.miniusa.com"],
  [/\bfiat\b/i, "https://www.fiatusa.com"],
  [/alfa\s*romeo/i, "https://www.alfaromeousa.com"],
  [/\bferrari\b/i, "https://www.ferrari.com"],
  [/lamborghini/i, "https://www.lamborghini.com"],
  [/\bmaserati\b/i, "https://www.maserati.com"],
  [/\bbentley\b/i, "https://www.bentleymotors.com"],
  [/rolls[\s-]*royce/i, "https://www.rolls-roycemotorcars.com"],
  [/aston\s*martin/i, "https://www.astonmartin.com"],
  [/mclaren/i, "https://cars.mclaren.com"],
  [/\bharley\b|harley[\s-]*davidson/i, "https://www.harley-davidson.com"],
  [/\bducati\b/i, "https://www.ducati.com"],
  [/\bkawasaki\b/i, "https://www.kawasaki.com"],
  [/\byamaha\b/i, "https://www.yamahamotorsports.com"],
];

/**
 * Detect vehicles (cars, trucks, SUVs, motorcycles) — physical products that
 * still cannot be purchased on Amazon. They get a manufacturer-site CTA, never
 * an Amazon search link.
 */
export function isVehicleEntity(
  entity: ComparisonEntityData,
  category: string | null,
): boolean {
  const type = entity.entityType?.toLowerCase?.() ?? "";
  if (VEHICLE_ENTITY_TYPES.has(type)) return true;
  if (category?.toLowerCase() === "automotive") return true;
  return false;
}

/**
 * Resolve a vehicle entity to its manufacturer's official homepage.
 * Returns null when the make is not recognized.
 */
export function resolveVehicleHomepage(entityName: string): string | null {
  for (const [pattern, url] of VEHICLE_MAKE_HOMEPAGES) {
    if (pattern.test(entityName)) return url;
  }
  return null;
}

/**
 * Detect digital / non-physical entities (streaming services, browsers, OSes,
 * SaaS, free/OSS software, web services) that cannot be bought on Amazon as a
 * product. These must NOT receive an Amazon /s?k= search CTA. See DAN-1053.
 */
export function isDigitalEntity(entity: ComparisonEntityData): boolean {
  const type = entity.entityType?.toLowerCase?.() ?? "";
  if (DIGITAL_ENTITY_TYPES.has(type)) return true;
  if (DIGITAL_ENTITY_PATTERNS.test(entity.name)) return true;
  return false;
}

/**
 * Check if an entity is eligible for affiliate links.
 */
function isAffiliateEligible(
  entity: ComparisonEntityData,
  category: string | null,
): boolean {
  // Digital/non-physical entities are never Amazon-eligible — suppress the
  // dead search link and let the generic "Learn more" CTA take over. (DAN-1053)
  if (isDigitalEntity(entity)) return false;
  // Organizations, places, people, concepts: an Amazon search would return
  // merchandise, not the entity. Blocks the category fallback below from
  // granting links to banks/restaurants/diets that share a product category.
  if (isNonBuyableEntity(entity)) return false;
  if (AFFILIATE_ELIGIBLE_TYPES.has(entity.entityType?.toLowerCase?.() ?? ""))
    return true;
  if (category && AFFILIATE_ELIGIBLE_CATEGORIES.has(category.toLowerCase()))
    return true;
  return false;
}

/**
 * Generate an Amazon search affiliate URL for an entity.
 */
function generateAmazonLink(entityName: string): AffiliateLink | null {
  if (!AMAZON_TAG) return null;
  const query = encodeURIComponent(entityName);
  return {
    url: `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`,
    partner: "amazon",
    label: `Shop ${entityName} on Amazon`,
  };
}

/**
 * Generate a generic "Learn More" link for non-product entities.
 * Uses a Google search to help users find more information.
 */
function generateGenericLink(entityName: string): AffiliateLink {
  const query = encodeURIComponent(entityName);
  return {
    url: `https://www.google.com/search?q=${query}`,
    partner: "generic",
    label: `Learn more about ${entityName}`,
  };
}

/**
 * Official brand homepages for digital / SaaS / VPN / software entities that
 * cannot be bought on Amazon. When no tracked affiliate URL is configured yet
 * (network approvals tracked in DAN-638/639/654), the CTA points at the brand's
 * real homepage instead of a Google SERP — which leaks high-intent, sponsored
 * clicks to competitors' ads — or an irrelevant Amazon search (the "Claude on
 * Amazon" class of bug). Swapping in a tracked affiliate URL later is a pure
 * data change with zero template edits. See DAN-1140.
 *
 * Patterns are matched in order against the entity name; first match wins, so
 * keep more-specific patterns above broader ones. Aligned with
 * DIGITAL_ENTITY_PATTERNS above.
 */
const BRAND_HOMEPAGES: ReadonlyArray<readonly [RegExp, string]> = [
  // Social networks
  [/facebook/i, "https://www.facebook.com"],
  [/\breddit\b/i, "https://www.reddit.com"],
  [/instagram/i, "https://www.instagram.com"],
  [/tiktok/i, "https://www.tiktok.com"],
  [/linkedin/i, "https://www.linkedin.com"],
  [/\btwitter\b|\bx\b\s*\(formerly/i, "https://x.com"],
  // Cloud platforms
  [/\baws\b|amazon\s*web\s*services/i, "https://aws.amazon.com"],
  [/\bazure\b/i, "https://azure.microsoft.com"],
  [/google\s*cloud|\bgcp\b/i, "https://cloud.google.com"],
  // Game stores / subscriptions
  [/\bsteam\b/i, "https://store.steampowered.com"],
  [/game\s*pass/i, "https://www.xbox.com/xbox-game-pass"],
  [/playstation\s*plus/i, "https://www.playstation.com/ps-plus/"],
  [/epic\s*games/i, "https://store.epicgames.com"],
  // Marketplaces / retailers / listing platforms
  [/\bchewy\b/i, "https://www.chewy.com"],
  [/\bebay\b/i, "https://www.ebay.com"],
  [/\betsy\b/i, "https://www.etsy.com"],
  [/\btemu\b/i, "https://www.temu.com"],
  [/\bshein\b/i, "https://www.shein.com"],
  [/aliexpress/i, "https://www.aliexpress.com"],
  [/\bwayfair\b/i, "https://www.wayfair.com"],
  [/\bikea\b/i, "https://www.ikea.com"],
  [/best\s*buy/i, "https://www.bestbuy.com"],
  [/\blowe'?s\b/i, "https://www.lowes.com"],
  [/home\s*depot/i, "https://www.homedepot.com"],
  [/\bwalmart\b/i, "https://www.walmart.com"],
  [/\bcostco\b/i, "https://www.costco.com"],
  [/\bzillow\b/i, "https://www.zillow.com"],
  [/realtor\.com/i, "https://www.realtor.com"],
  [/\bkayak\b/i, "https://www.kayak.com"],
  [/expedia/i, "https://www.expedia.com"],
  [/booking\.com/i, "https://www.booking.com"],
  [/\bairbnb\b/i, "https://www.airbnb.com"],
  [/\bvrbo\b/i, "https://www.vrbo.com"],
  [/tripadvisor/i, "https://www.tripadvisor.com"],
  // News / media
  [/wall\s*street\s*journal|\bwsj\b/i, "https://www.wsj.com"],
  [/bloomberg/i, "https://www.bloomberg.com"],
  [/new\s*york\s*times|\bnyt\b/i, "https://www.nytimes.com"],
  [/washington\s*post/i, "https://www.washingtonpost.com"],
  [/the\s*economist/i, "https://www.economist.com"],
  [/financial\s*times/i, "https://www.ft.com"],
  // Office / travel platforms
  [/google\s*flights/i, "https://www.google.com/travel/flights"],
  [/google\s*(sheets|docs|slides)/i, "https://workspace.google.com"],
  [/\bexcel\b|microsoft\s*(office|365|word)|powerpoint/i, "https://www.microsoft.com/microsoft-365"],
  [/hotels\.com/i, "https://www.hotels.com"],
  [/priceline/i, "https://www.priceline.com"],
  [/amazon\s*haul/i, "https://www.amazon.com/haul"],
  [/^amazon$|amazon\s*(fresh|prime|basics)/i, "https://www.amazon.com"],
  // Meal kits
  [/hellofresh|hello\s*fresh/i, "https://www.hellofresh.com"],
  [/home\s*chef/i, "https://www.homechef.com"],
  [/blue\s*apron/i, "https://www.blueapron.com"],
  // Dev frameworks (comparison staples)
  [/\breact\b(?!\s*native)/i, "https://react.dev"],
  [/react\s*native/i, "https://reactnative.dev"],
  [/\bvue(\.js)?\b/i, "https://vuejs.org"],
  [/\bangular\b/i, "https://angular.dev"],
  [/\bsvelte\b/i, "https://svelte.dev"],
  [/next\.?js/i, "https://nextjs.org"],
  // VPNs — highest affiliate value ($30–100/sale)
  [/nordvpn/i, "https://nordvpn.com"],
  [/surfshark/i, "https://surfshark.com"],
  [/expressvpn/i, "https://www.expressvpn.com"],
  // AI assistants / tools
  [/\bchatgpt\b/i, "https://chatgpt.com"],
  [/\bclaude\b/i, "https://claude.ai"],
  [/\bgemini\b/i, "https://gemini.google.com"],
  [/perplexity/i, "https://www.perplexity.ai"],
  [/midjourney/i, "https://www.midjourney.com"],
  // Productivity / SaaS / web apps
  [/notion/i, "https://www.notion.so"],
  [/evernote/i, "https://evernote.com"],
  [/obsidian/i, "https://obsidian.md"],
  [/\bslack\b/i, "https://slack.com"],
  [/microsoft\s*teams|^teams$/i, "https://www.microsoft.com/microsoft-teams"],
  [/\bzoom\b/i, "https://zoom.us"],
  // Chat / messaging / comms apps
  [/discord/i, "https://discord.com"],
  [/telegram/i, "https://telegram.org"],
  [/whatsapp/i, "https://www.whatsapp.com"],
  [/\bsignal\b/i, "https://signal.org"],
  [/skype/i, "https://www.skype.com"],
  [/figma/i, "https://www.figma.com"],
  [/sketch\b/i, "https://www.sketch.com"],
  [/canva/i, "https://www.canva.com"],
  [/photoshop/i, "https://www.adobe.com/products/photoshop.html"],
  [/wordpress/i, "https://wordpress.org"],
  [/\bwix\b/i, "https://www.wix.com"],
  [/squarespace/i, "https://www.squarespace.com"],
  [/webflow/i, "https://webflow.com"],
  [/vs\s*code|vscode|visual\s*studio\s*code/i, "https://code.visualstudio.com"],
  [/\bcursor\b/i, "https://cursor.com"],
  [/dropbox/i, "https://www.dropbox.com"],
  [/google\s*drive/i, "https://drive.google.com"],
  [/onedrive/i, "https://onedrive.live.com"],
  [/gmail/i, "https://www.google.com/gmail/about/"],
  [/outlook/i, "https://outlook.com"],
  // Password managers
  [/\b1password\b/i, "https://1password.com"],
  [/lastpass/i, "https://www.lastpass.com"],
  [/bitwarden/i, "https://bitwarden.com"],
  // Streaming video
  [/netflix/i, "https://www.netflix.com"],
  [/\bhulu\b/i, "https://www.hulu.com"],
  [/disney\s*\+|disney\s*plus/i, "https://www.disneyplus.com"],
  [/hbo\s*max|^max$|\bmax\b\s*\(formerly/i, "https://www.max.com"],
  [/peacock/i, "https://www.peacocktv.com"],
  [/paramount\s*\+|paramount\s*plus/i, "https://www.paramountplus.com"],
  [/prime\s*video/i, "https://www.primevideo.com"],
  [/crunchyroll/i, "https://www.crunchyroll.com"],
  [/funimation/i, "https://www.crunchyroll.com"],
  [/youtube\s*tv/i, "https://tv.youtube.com"],
  [/apple\s*tv\s*\+|apple\s*tv\s*plus/i, "https://tv.apple.com"],
  // Streaming music
  [/spotify/i, "https://www.spotify.com"],
  [/apple\s*music/i, "https://music.apple.com"],
  [/\btidal\b/i, "https://tidal.com"],
  [/deezer/i, "https://www.deezer.com"],
  [/soundcloud/i, "https://soundcloud.com"],
  [/pandora/i, "https://www.pandora.com"],
  [/youtube\s*music/i, "https://music.youtube.com"],
  // Browsers
  [/google\s*chrome|\bchrome\b/i, "https://www.google.com/chrome/"],
  [/firefox/i, "https://www.mozilla.org/firefox/"],
  [/\bsafari\b/i, "https://www.apple.com/safari/"],
  [/microsoft\s*edge|\bedge\b/i, "https://www.microsoft.com/edge"],
  [/brave\s*browser|\bbrave\b/i, "https://brave.com"],
  [/\bopera\b/i, "https://www.opera.com"],
  [/vivaldi/i, "https://vivaldi.com"],
  [/tor\s*browser/i, "https://www.torproject.org"],
  // Operating systems
  [/windows\s*\d|microsoft\s*windows|\bwindows\b/i, "https://www.microsoft.com/windows"],
  [/macos|mac\s*os/i, "https://www.apple.com/macos/"],
  [/ubuntu/i, "https://ubuntu.com"],
  [/fedora/i, "https://fedoraproject.org"],
  [/debian/i, "https://www.debian.org"],
  [/chrome\s*os|chromeos/i, "https://www.google.com/chromebook/chrome-os/"],
  [/\blinux\b/i, "https://www.linux.org"],
  [/\bandroid\b/i, "https://www.android.com"],
  [/\bios\b/i, "https://www.apple.com/ios/"],
];

/**
 * Resolve an entity name to its official brand homepage. Returns a curated URL
 * for known digital brands, or "" when unknown. The previous {brand}.com guess
 * for the long tail is gone: unverified domain guesses ("PC Gaming" →
 * pcgaming.com) can point at parked/junk/malicious domains — worse than no
 * link. Unknown brands fall through to the informational "Learn More" CTA.
 */
export function resolveBrandHomepage(entityName: string): string {
  for (const [pattern, url] of BRAND_HOMEPAGES) {
    if (pattern.test(entityName)) return url;
  }
  return "";
}

/**
 * Generate a brand-homepage CTA for a digital / SaaS / VPN / software entity
 * that has no configured affiliate URL. Tagged partner "brand" so the UI renders
 * it as a sponsored, real-destination CTA (not a Google "Learn more"). DAN-1140.
 */
function generateBrandHomepageLink(entityName: string): AffiliateLink | null {
  const url = resolveBrandHomepage(entityName);
  if (!url) return null;
  return {
    url,
    partner: "brand",
    label: `Get ${entityName}`,
  };
}

/**
 * Fetch DB-stored affiliate links for an entity.
 * Returns null if DB is unavailable or no links found.
 */
async function getDbAffiliateLinks(entityId: string): Promise<AffiliateLink[] | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  try {
    const dbLinks = await prisma.affiliateLink.findMany({
      where: {
        entityId,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { priority: "desc" },
    });

    if (dbLinks.length === 0) return null;

    return dbLinks.map((link) => ({
      url: link.url,
      partner: link.partner,
      label: link.label,
    }));
  } catch {
    return null;
  }
}

/**
 * Generate all affiliate links for an entity.
 * Prefers DB-stored links when available, falls back to auto-generated.
 * Returns empty array if affiliate links are disabled.
 */
export function generateAffiliateLinks(
  entity: ComparisonEntityData,
  category: string | null,
): AffiliateLink[] {
  if (!AFFILIATE_ENABLED) return [];

  const links: AffiliateLink[] = [];

  if (isVehicleEntity(entity, category)) {
    // Cars/trucks/motorcycles: an Amazon search for "Toyota Camry" returns
    // floor mats and toy models — never the vehicle. Send the click to the
    // manufacturer's official site (build & price / local inventory) instead.
    const home = resolveVehicleHomepage(entity.name);
    if (home) {
      links.push({
        url: home,
        partner: "brand",
        label: `Explore ${entity.name}`,
      });
    }
  } else if (isDigitalEntity(entity)) {
    // Software / SaaS / VPN / streaming: not buyable on Amazon. Point at the
    // brand's official homepage instead of leaking a sponsored click to a
    // Google SERP or emitting an irrelevant Amazon search. DAN-1140.
    const brand = generateBrandHomepageLink(entity.name);
    if (brand) links.push(brand);
  } else if (isAffiliateEligible(entity, category)) {
    const amazon = generateAmazonLink(entity.name);
    if (amazon) links.push(amazon);
  }

  // Non-product, non-digital entities (countries, people, concepts) fall back
  // to a plain "Learn More" Google search — informational, never sponsored.
  if (links.length === 0) {
    links.push(generateGenericLink(entity.name));
  }

  return links;
}

/**
 * Enrich entities with affiliate links.
 * Uses DB-stored links when available, otherwise auto-generates them.
 */
export async function enrichEntitiesWithAffiliateLinks(
  entities: ComparisonEntityData[],
  category: string | null,
): Promise<ComparisonEntityData[]> {
  if (!AFFILIATE_ENABLED) return entities;

  const enriched = await Promise.all(
    entities.map(async (entity) => {
      // Try DB links first (by entity slug lookup)
      const dbLinks = entity.id ? await getDbAffiliateLinks(entity.id) : null;

      return {
        ...entity,
        affiliateLinks: dbLinks || generateAffiliateLinks(entity, category),
      };
    }),
  );

  return enriched;
}
