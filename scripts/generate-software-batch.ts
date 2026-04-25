/**
 * Batch Software Comparison & Blog Article Generator
 * Generates the top software comparisons and blog articles from research data.
 *
 * Run: npx tsx scripts/generate-software-batch.ts
 *
 * Options:
 *   --comparisons=N   Number of comparisons to generate (default: 30)
 *   --blogs=N         Number of blog articles to generate (default: 10)
 *   --dry-run         List what would be generated without calling APIs
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// ============================================================
// Top software comparisons selected from research
// Curated list: high volume + high CPC + clear "vs" format
// ============================================================

const SOFTWARE_COMPARISONS = [
  // VPN & Security (highest affiliate commissions — up to 100%)
  { entityA: "NordVPN", entityB: "ExpressVPN", volume: 14800, cpc: 8.54 },
  { entityA: "Surfshark", entityB: "NordVPN", volume: 9900, cpc: 6.21 },
  { entityA: "Norton", entityB: "McAfee", volume: 6600, cpc: 4.87 },
  { entityA: "Bitdefender", entityB: "Kaspersky", volume: 3600, cpc: 3.44 },
  { entityA: "Malwarebytes", entityB: "Norton", volume: 2900, cpc: 3.12 },
  { entityA: "ProtonVPN", entityB: "Mullvad", volume: 1900, cpc: 2.88 },

  // Hosting & Domains (high payouts — $50-200 per sale)
  { entityA: "Hostinger", entityB: "Namecheap", volume: 14800, cpc: 13.54 },
  { entityA: "Hostinger", entityB: "GoDaddy", volume: 1900, cpc: 7.38 },
  { entityA: "Bluehost", entityB: "GoDaddy", volume: 2400, cpc: 5.92 },
  { entityA: "SiteGround", entityB: "Bluehost", volume: 2400, cpc: 6.15 },
  { entityA: "Porkbun", entityB: "Cloudflare", volume: 3600, cpc: 9.92 },

  // Website Builders & eCommerce
  { entityA: "Squarespace", entityB: "Wix", volume: 6600, cpc: 5.61 },
  { entityA: "WordPress", entityB: "Wix", volume: 4400, cpc: 4.25 },
  { entityA: "Shopify", entityB: "WooCommerce", volume: 3600, cpc: 4.87 },
  { entityA: "Webflow", entityB: "WordPress", volume: 2400, cpc: 3.92 },
  { entityA: "GoDaddy", entityB: "Squarespace", volume: 1000, cpc: 14.75 },

  // AI Tools (fastest growing — 20-50% recurring commissions)
  { entityA: "ChatGPT", entityB: "Claude", volume: 3600, cpc: 7.62 },
  { entityA: "Perplexity", entityB: "ChatGPT", volume: 12100, cpc: 3.30 },
  { entityA: "ChatGPT", entityB: "Gemini", volume: 9900, cpc: 1.93 },
  { entityA: "Copilot", entityB: "ChatGPT", volume: 8100, cpc: 2.29 },
  { entityA: "DeepSeek", entityB: "ChatGPT", volume: 4400, cpc: 1.48 },
  { entityA: "Cursor", entityB: "GitHub Copilot", volume: 2400, cpc: 3.15 },
  { entityA: "Midjourney", entityB: "DALL-E", volume: 2900, cpc: 2.44 },

  // Productivity & Project Management ($20+ CPC)
  { entityA: "Notion", entityB: "Obsidian", volume: 2900, cpc: 7.54 },
  { entityA: "Asana", entityB: "Monday.com", volume: 1900, cpc: 21.25 },
  { entityA: "Jira", entityB: "Trello", volume: 1300, cpc: 20.97 },
  { entityA: "ClickUp", entityB: "Monday.com", volume: 1600, cpc: 8.44 },
  { entityA: "Slack", entityB: "Microsoft Teams", volume: 2400, cpc: 5.53 },
  { entityA: "Linear", entityB: "Jira", volume: 880, cpc: 16.21 },

  // Design & Creative
  { entityA: "Figma", entityB: "Sketch", volume: 1600, cpc: 3.87 },
  { entityA: "Canva", entityB: "Adobe Express", volume: 880, cpc: 15.11 },
  { entityA: "Premiere Pro", entityB: "DaVinci Resolve", volume: 1900, cpc: 2.55 },

  // Email Marketing & CRM (recurring commissions 20-40%)
  { entityA: "Mailchimp", entityB: "Constant Contact", volume: 1600, cpc: 12.33 },
  { entityA: "HubSpot", entityB: "Salesforce", volume: 1300, cpc: 18.92 },
  { entityA: "Klaviyo", entityB: "Mailchimp", volume: 1000, cpc: 8.77 },
  { entityA: "Intercom", entityB: "Zendesk", volume: 880, cpc: 11.44 },

  // Finance & Accounting
  { entityA: "QuickBooks", entityB: "Xero", volume: 2400, cpc: 15.88 },
  { entityA: "Wave", entityB: "QuickBooks", volume: 1300, cpc: 22.71 },
  { entityA: "FreshBooks", entityB: "QuickBooks", volume: 1000, cpc: 14.33 },
  { entityA: "Stripe", entityB: "Square", volume: 3600, cpc: 14.97 },

  // Password & Privacy
  { entityA: "Bitwarden", entityB: "1Password", volume: 1600, cpc: 12.67 },
  { entityA: "1Password", entityB: "LastPass", volume: 1300, cpc: 8.44 },
  { entityA: "Dashlane", entityB: "1Password", volume: 720, cpc: 7.88 },

  // Cloud & DevTools
  { entityA: "AWS", entityB: "Azure", volume: 2900, cpc: 9.64 },
  { entityA: "Vercel", entityB: "Netlify", volume: 1600, cpc: 3.25 },
  { entityA: "GitHub", entityB: "GitLab", volume: 2400, cpc: 4.12 },
  { entityA: "Supabase", entityB: "Firebase", volume: 1300, cpc: 3.88 },
  { entityA: "Docker", entityB: "Kubernetes", volume: 5400, cpc: 3.39 },
  { entityA: "Terraform", entityB: "Ansible", volume: 1900, cpc: 6.29 },
  { entityA: "Datadog", entityB: "New Relic", volume: 880, cpc: 9.44 },

  // Office & Documents
  { entityA: "Google Docs", entityB: "Microsoft Word", volume: 2400, cpc: 4.75 },
  { entityA: "Google Workspace", entityB: "Microsoft 365", volume: 1600, cpc: 8.33 },
  { entityA: "Adobe Acrobat", entityB: "Foxit PDF", volume: 1000, cpc: 9.42 },
  { entityA: "Grammarly", entityB: "Hemingway Editor", volume: 880, cpc: 4.55 },

  // Automotive — very high search volume, strong affiliate potential
  { entityA: "Toyota", entityB: "Honda", volume: 40500, cpc: 3.12 },
  { entityA: "BMW", entityB: "Mercedes-Benz", volume: 27100, cpc: 4.55 },
  { entityA: "Tesla", entityB: "BMW", volume: 14800, cpc: 3.88 },
  { entityA: "Ford", entityB: "Chevrolet", volume: 33100, cpc: 2.77 },
  { entityA: "Hyundai", entityB: "Kia", volume: 22200, cpc: 3.44 },
  { entityA: "Toyota", entityB: "Tesla", volume: 12100, cpc: 3.21 },
  { entityA: "Subaru", entityB: "Toyota", volume: 9900, cpc: 3.05 },

  // Consumer Finance — very high CPC, major decision keywords
  { entityA: "Coinbase", entityB: "Binance", volume: 55000, cpc: 7.88 },
  { entityA: "Robinhood", entityB: "Fidelity", volume: 40500, cpc: 12.44 },
  { entityA: "Vanguard", entityB: "Fidelity", volume: 49500, cpc: 11.21 },
  { entityA: "PayPal", entityB: "Venmo", volume: 27100, cpc: 5.33 },
  { entityA: "Cash App", entityB: "Venmo", volume: 33100, cpc: 4.87 },
  { entityA: "Charles Schwab", entityB: "Fidelity", volume: 22200, cpc: 13.92 },
  { entityA: "Coinbase", entityB: "Kraken", volume: 18100, cpc: 6.44 },

  // Health & Fitness — massive organic traffic, growing category
  { entityA: "Ozempic", entityB: "Wegovy", volume: 150000, cpc: 8.33 },
  { entityA: "Apple Watch", entityB: "Fitbit", volume: 40500, cpc: 3.55 },
  { entityA: "Peloton", entityB: "NordicTrack", volume: 33100, cpc: 4.12 },
  { entityA: "WHOOP", entityB: "Garmin", volume: 18100, cpc: 2.88 },
  { entityA: "Oura Ring", entityB: "WHOOP", volume: 22200, cpc: 3.44 },
  { entityA: "Mounjaro", entityB: "Ozempic", volume: 90500, cpc: 9.21 },
  { entityA: "Apple Watch", entityB: "Samsung Galaxy Watch", volume: 27100, cpc: 3.77 },

  // Food Delivery & Consumer Apps
  { entityA: "DoorDash", entityB: "Uber Eats", volume: 49500, cpc: 3.22 },
  { entityA: "Grubhub", entityB: "DoorDash", volume: 22200, cpc: 2.88 },
  { entityA: "Instacart", entityB: "DoorDash", volume: 14800, cpc: 3.11 },

  // Social Media & Communication
  { entityA: "TikTok", entityB: "Instagram", volume: 49500, cpc: 2.44 },
  { entityA: "YouTube", entityB: "TikTok", volume: 40500, cpc: 2.55 },
  { entityA: "WhatsApp", entityB: "Telegram", volume: 40500, cpc: 1.88 },
  { entityA: "Reddit", entityB: "Twitter", volume: 18100, cpc: 2.77 },
  { entityA: "Discord", entityB: "Slack", volume: 14800, cpc: 4.33 },

  // Gaming
  { entityA: "Nintendo Switch", entityB: "Steam Deck", volume: 90500, cpc: 2.88 },
  { entityA: "PlayStation 5", entityB: "Xbox Series X", volume: 74000, cpc: 2.44 },
  { entityA: "Fortnite", entityB: "Apex Legends", volume: 49500, cpc: 1.55 },
  { entityA: "Xbox Game Pass", entityB: "PlayStation Plus", volume: 33100, cpc: 2.11 },

  // Travel & Hospitality — high CPC
  { entityA: "Airbnb", entityB: "Vrbo", volume: 40500, cpc: 5.88 },
  { entityA: "Booking.com", entityB: "Airbnb", volume: 22200, cpc: 4.44 },
  { entityA: "Delta", entityB: "United Airlines", volume: 33100, cpc: 3.77 },
  { entityA: "Marriott", entityB: "Hilton", volume: 27100, cpc: 4.22 },
  { entityA: "Expedia", entityB: "Kayak", volume: 22200, cpc: 5.11 },

  // Mega-brands — massive head-term traffic
  { entityA: "Amazon", entityB: "Walmart", volume: 55000, cpc: 3.44 },
  { entityA: "Amazon", entityB: "eBay", volume: 40500, cpc: 2.88 },
  { entityA: "Google", entityB: "Bing", volume: 40500, cpc: 3.12 },
  { entityA: "Windows", entityB: "macOS", volume: 33100, cpc: 2.55 },
  { entityA: "Google", entityB: "Microsoft", volume: 22200, cpc: 3.77 },
  { entityA: "Amazon", entityB: "Target", volume: 18100, cpc: 3.22 },
  { entityA: "Walmart", entityB: "Costco", volume: 33100, cpc: 2.77 },

  // Automotive brand-level (complements model-level pairs)
  { entityA: "Honda", entityB: "Toyota", volume: 40500, cpc: 3.12 },
  { entityA: "BMW", entityB: "Mercedes-Benz", volume: 27100, cpc: 4.55 },
  { entityA: "BMW", entityB: "Audi", volume: 22200, cpc: 4.33 },
  { entityA: "Ford", entityB: "Chevrolet", volume: 33100, cpc: 2.77 },
  { entityA: "Tesla", entityB: "BMW", volume: 14800, cpc: 3.88 },
  { entityA: "Honda", entityB: "Hyundai", volume: 18100, cpc: 3.21 },
  { entityA: "Lexus", entityB: "BMW", volume: 22200, cpc: 4.44 },
];

// Blog article topics — informational "best X" content
const BLOG_TOPICS = [
  { topic: "Best VPN Services 2026: Complete Comparison Guide", keywords: ["best vpn", "vpn comparison", "nordvpn", "expressvpn"] },
  { topic: "Best Antivirus Software 2026: Norton vs McAfee vs Bitdefender", keywords: ["best antivirus", "antivirus comparison"] },
  { topic: "Best Web Hosting Providers 2026: Speed, Price & Support Compared", keywords: ["best web hosting", "hosting comparison"] },
  { topic: "Best Website Builders 2026: Wix vs Squarespace vs WordPress", keywords: ["best website builder", "website builder comparison"] },
  { topic: "Best AI Chatbots 2026: ChatGPT vs Claude vs Gemini vs Perplexity", keywords: ["best ai chatbot", "chatgpt alternatives"] },
  { topic: "Best Project Management Software 2026: Asana vs Monday vs ClickUp", keywords: ["best project management software"] },
  { topic: "Best CRM Software 2026: HubSpot vs Salesforce vs Pipedrive", keywords: ["best crm software", "crm comparison"] },
  { topic: "Best Password Managers 2026: 1Password vs Bitwarden vs LastPass", keywords: ["best password manager", "password manager comparison"] },
  { topic: "Best Email Marketing Platforms 2026: Mailchimp vs Klaviyo vs ConvertKit", keywords: ["best email marketing software"] },
  { topic: "Best Accounting Software for Small Business 2026: QuickBooks vs Xero vs Wave", keywords: ["best accounting software"] },
  { topic: "Best Cloud Storage Services 2026: Google Drive vs Dropbox vs OneDrive", keywords: ["best cloud storage", "cloud storage comparison"] },
  { topic: "Best Design Tools 2026: Figma vs Canva vs Adobe Creative Suite", keywords: ["best design tools", "design software comparison"] },
  { topic: "Best Video Editing Software 2026: Premiere Pro vs DaVinci Resolve vs CapCut", keywords: ["best video editing software"] },
  { topic: "Best Code Editors and IDEs 2026: VS Code vs IntelliJ vs Cursor", keywords: ["best code editor", "best ide 2026"] },
  { topic: "Best AI Writing Tools 2026: ChatGPT vs Jasper vs Grammarly AI", keywords: ["best ai writing tools", "ai writing comparison"] },
  // New verticals
  { topic: "Best Investment Apps 2026: Robinhood vs Fidelity vs Schwab vs Webull", keywords: ["best investment app", "stock trading app comparison"] },
  { topic: "Best Crypto Exchanges 2026: Coinbase vs Binance vs Kraken vs Gemini", keywords: ["best crypto exchange", "crypto exchange comparison 2026"] },
  { topic: "Best Food Delivery Apps 2026: DoorDash vs Uber Eats vs Grubhub Compared", keywords: ["best food delivery app", "doordash vs uber eats"] },
  { topic: "Best Fitness Trackers 2026: Apple Watch vs Fitbit vs Garmin vs WHOOP", keywords: ["best fitness tracker 2026", "smartwatch comparison"] },
  { topic: "GLP-1 Drugs Compared: Ozempic vs Wegovy vs Mounjaro vs Zepbound", keywords: ["ozempic vs wegovy", "glp-1 comparison", "weight loss drug comparison"] },
  { topic: "Best SUVs 2026: Toyota RAV4 vs Honda CR-V vs Hyundai Tucson vs Ford Escape", keywords: ["best suv 2026", "suv comparison", "family suv ranking"] },
  { topic: "Best Electric Vehicles 2026: Tesla vs Rivian vs Ford Mustang Mach-E vs Hyundai IONIQ 6", keywords: ["best electric car 2026", "ev comparison", "best ev to buy"] },
  { topic: "Best Travel Booking Sites 2026: Airbnb vs Vrbo vs Booking.com vs Hotels.com", keywords: ["best travel booking site", "airbnb vs vrbo", "hotel booking comparison"] },
  { topic: "Best Gaming Consoles 2026: PS5 vs Xbox Series X vs Nintendo Switch", keywords: ["best gaming console 2026", "ps5 vs xbox", "gaming console comparison"] },
];

// ============================================================
// API Clients
// ============================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.CRON_SECRET || "";

async function generateComparison(entityA: string, entityB: string): Promise<{ success: boolean; slug: string; error?: string }> {
  const slug = [entityA, entityB]
    .map(e => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, ""))
    .sort()
    .join("-vs-");

  try {
    const res = await fetch(`${SITE_URL}/api/comparisons/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({ slug }),
    });

    const data = await res.json();
    if (data.status === "ready") {
      return { success: true, slug };
    }
    return { success: false, slug, error: data.error || "Unknown error" };
  } catch (err: any) {
    return { success: false, slug, error: err.message };
  }
}

async function generateBlog(topic: string): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const res = await fetch(`${SITE_URL}/api/blog/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    if (data.article?.slug) {
      return { success: true, slug: data.article.slug };
    }
    return { success: false, error: data.error || "Unknown error" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============================================================
// Direct generation (bypasses HTTP, uses the service directly)
// ============================================================

async function generateComparisonDirect(entityA: string, entityB: string): Promise<{ success: boolean; slug: string; error?: string }> {
  // Dynamic import to load the Next.js modules
  const { generateComparison: generate } = await import("../src/lib/services/ai-comparison-generator");
  const { saveComparison } = await import("../src/lib/services/comparison-service");

  const slug = [entityA, entityB]
    .map(e => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, ""))
    .sort()
    .join("-vs-");

  const result = await generate(entityA, entityB, slug);

  if (result.success && result.comparison) {
    try {
      await saveComparison(result.comparison);
    } catch (err) {
      console.warn(`  DB save failed (will display from cache): ${err}`);
    }
    return { success: true, slug };
  }

  return { success: false, slug, error: result.error };
}

async function generateBlogDirect(topic: string): Promise<{ success: boolean; slug?: string; error?: string }> {
  const { generateBlogArticle } = await import("../src/lib/services/blog-generator");

  const article = await generateBlogArticle(topic);
  if (article?.slug) {
    return { success: true, slug: article.slug };
  }
  return { success: false, error: "Generation returned no article" };
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const compLimit = parseInt(args.find(a => a.startsWith("--comparisons="))?.split("=")[1] || "30");
  const blogLimit = parseInt(args.find(a => a.startsWith("--blogs="))?.split("=")[1] || "10");
  const useHttp = args.includes("--http");

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  SOFTWARE BATCH GENERATION — aversusb.net");
  console.log(`  Mode: ${dryRun ? "DRY RUN" : useHttp ? "HTTP API" : "DIRECT"}`);
  console.log(`  Comparisons: ${compLimit} | Blogs: ${blogLimit}`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Sort by combined value (volume * cpc) to prioritize highest-value pages
  const sortedComparisons = [...SOFTWARE_COMPARISONS]
    .sort((a, b) => (b.volume * b.cpc) - (a.volume * a.cpc))
    .slice(0, compLimit);

  const sortedBlogs = BLOG_TOPICS.slice(0, blogLimit);

  if (dryRun) {
    console.log("━━━ COMPARISONS TO GENERATE ━━━\n");
    for (let i = 0; i < sortedComparisons.length; i++) {
      const c = sortedComparisons[i];
      const slug = [c.entityA, c.entityB]
        .map(e => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, ""))
        .sort()
        .join("-vs-");
      console.log(`  ${i + 1}. ${c.entityA} vs ${c.entityB} (vol: ${c.volume}, CPC: $${c.cpc}) → /compare/${slug}`);
    }

    console.log("\n━━━ BLOG ARTICLES TO GENERATE ━━━\n");
    for (let i = 0; i < sortedBlogs.length; i++) {
      console.log(`  ${i + 1}. ${sortedBlogs[i].topic}`);
    }

    console.log(`\nTotal estimated value: $${sortedComparisons.reduce((sum, c) => sum + c.volume * c.cpc / 1000, 0).toFixed(0)}/mo potential`);
    return;
  }

  // ── Generate Comparisons ──────────────────────────────────
  console.log("━━━ GENERATING COMPARISONS ━━━\n");
  const compResults: { slug: string; success: boolean; error?: string; time: number }[] = [];

  for (let i = 0; i < sortedComparisons.length; i++) {
    const c = sortedComparisons[i];
    const start = Date.now();
    console.log(`  [${i + 1}/${sortedComparisons.length}] ${c.entityA} vs ${c.entityB}...`);

    try {
      const result = useHttp
        ? await generateComparison(c.entityA, c.entityB)
        : await generateComparisonDirect(c.entityA, c.entityB);

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      compResults.push({ slug: result.slug, success: result.success, error: result.error, time: parseFloat(elapsed) });

      if (result.success) {
        console.log(`    ✓ Generated in ${elapsed}s → /compare/${result.slug}`);
      } else {
        console.log(`    ✗ Failed (${elapsed}s): ${result.error}`);
      }
    } catch (err: any) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      compResults.push({ slug: "error", success: false, error: err.message, time: parseFloat(elapsed) });
      console.log(`    ✗ Error (${elapsed}s): ${err.message}`);
    }

    // Small delay between generations to avoid rate limits
    if (i < sortedComparisons.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // ── Generate Blog Articles ────────────────────────────────
  console.log("\n━━━ GENERATING BLOG ARTICLES ━━━\n");
  const blogResults: { topic: string; slug?: string; success: boolean; error?: string; time: number }[] = [];

  for (let i = 0; i < sortedBlogs.length; i++) {
    const b = sortedBlogs[i];
    const start = Date.now();
    console.log(`  [${i + 1}/${sortedBlogs.length}] ${b.topic}...`);

    try {
      const result = useHttp
        ? await generateBlog(b.topic)
        : await generateBlogDirect(b.topic);

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      blogResults.push({ topic: b.topic, slug: result.slug, success: result.success, error: result.error, time: parseFloat(elapsed) });

      if (result.success) {
        console.log(`    ✓ Generated in ${elapsed}s → /blog/${result.slug}`);
      } else {
        console.log(`    ✗ Failed (${elapsed}s): ${result.error}`);
      }
    } catch (err: any) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      blogResults.push({ topic: b.topic, success: false, error: err.message, time: parseFloat(elapsed) });
      console.log(`    ✗ Error (${elapsed}s): ${err.message}`);
    }

    if (i < sortedBlogs.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // ── Summary ───────────────────────────────────────────────
  const successComps = compResults.filter(r => r.success).length;
  const successBlogs = blogResults.filter(r => r.success).length;
  const totalTime = [...compResults, ...blogResults].reduce((sum, r) => sum + r.time, 0);

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("  GENERATION COMPLETE");
  console.log(`  Comparisons: ${successComps}/${sortedComparisons.length} successful`);
  console.log(`  Blog Articles: ${successBlogs}/${sortedBlogs.length} successful`);
  console.log(`  Total time: ${totalTime.toFixed(1)}s`);
  console.log("═══════════════════════════════════════════════════════════════");

  // Save results log
  const logPath = path.resolve(__dirname, "software-generation-log.json");
  fs.writeFileSync(logPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    comparisons: compResults,
    blogs: blogResults,
    summary: {
      comparisonsSuccess: successComps,
      comparisonsTotal: sortedComparisons.length,
      blogsSuccess: successBlogs,
      blogsTotal: sortedBlogs.length,
      totalTimeSeconds: totalTime,
    },
  }, null, 2), "utf-8");
  console.log(`\nLog saved to: ${logPath}`);

  // Print URLs for successful generations
  if (successComps > 0 || successBlogs > 0) {
    console.log("\n━━━ GENERATED URLS ━━━\n");
    if (successComps > 0) {
      console.log("Comparisons:");
      for (const r of compResults.filter(r => r.success)) {
        console.log(`  ${SITE_URL}/compare/${r.slug}`);
      }
    }
    if (successBlogs > 0) {
      console.log("\nBlog Articles:");
      for (const r of blogResults.filter(r => r.success)) {
        console.log(`  ${SITE_URL}/blog/${r.slug}`);
      }
    }
  }
}

main().catch(console.error);
