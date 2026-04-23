/**
 * Standalone software comparison generator.
 * Calls Claude API + Tavily directly, then saves via Prisma.
 * Run: npx tsx scripts/gen-software.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const COMPARISONS = [
  // VPN & Security
  ["NordVPN", "ExpressVPN"],
  ["Surfshark", "NordVPN"],
  ["Norton", "McAfee"],
  ["Bitdefender", "Kaspersky"],
  ["NordVPN", "ProtonVPN"],
  // Hosting
  ["Hostinger", "Namecheap"],
  ["Hostinger", "GoDaddy"],
  ["Bluehost", "GoDaddy"],
  ["SiteGround", "Bluehost"],
  // Website Builders
  ["Squarespace", "Wix"],
  ["WordPress", "Wix"],
  ["Shopify", "WooCommerce"],
  ["Webflow", "WordPress"],
  ["Shopify", "BigCommerce"],
  ["Squarespace", "Shopify"],
  ["Webflow", "Framer"],
  // AI Tools
  ["ChatGPT", "Claude"],
  ["Perplexity", "ChatGPT"],
  ["ChatGPT", "Gemini"],
  ["Copilot", "ChatGPT"],
  ["DeepSeek", "ChatGPT"],
  ["Midjourney", "DALL-E"],
  // Productivity
  ["Notion", "Obsidian"],
  ["Asana", "Monday.com"],
  ["Jira", "Trello"],
  ["Slack", "Microsoft Teams"],
  ["Slack", "Discord"],
  ["Notion", "Confluence"],
  ["Notion", "ClickUp"],
  ["Asana", "ClickUp"],
  ["Asana", "Jira"],
  ["ClickUp", "Monday.com"],
  ["Notion", "Coda"],
  ["Jira", "Linear"],
  // Design
  ["Figma", "Sketch"],
  ["Canva", "Adobe Express"],
  ["Canva", "Photoshop"],
  ["Figma", "Framer"],
  // Video & Meetings
  ["Zoom", "Google Meet"],
  ["Zoom", "Microsoft Teams"],
  ["Zoom", "Webex"],
  // Email/CRM
  ["Mailchimp", "Constant Contact"],
  ["HubSpot", "Salesforce"],
  ["Mailchimp", "Klaviyo"],
  ["HubSpot", "Pipedrive"],
  ["Mailchimp", "ConvertKit"],
  ["ActiveCampaign", "HubSpot"],
  // Finance
  ["QuickBooks", "Xero"],
  ["Stripe", "Square"],
  ["QuickBooks", "FreshBooks"],
  // Password/Privacy
  ["Bitwarden", "1Password"],
  ["1Password", "LastPass"],
  // Business Intelligence
  ["Tableau", "Power BI"],
  ["Tableau", "Looker"],
  ["Power BI", "Looker"],
  // Observability & Monitoring
  ["Datadog", "New Relic"],
  ["Datadog", "Sentry"],
  ["Sentry", "Rollbar"],
  ["Datadog", "Grafana"],
  // E-Signature
  ["DocuSign", "PandaDoc"],
  ["DocuSign", "HelloSign"],
  // WordPress Builders
  ["Elementor", "Divi"],
  ["Elementor", "Beaver Builder"],
  // Databases & Backend
  ["MongoDB", "PostgreSQL"],
  ["Supabase", "Firebase"],
  ["Supabase", "PlanetScale"],
  ["Firebase", "Appwrite"],
  ["MongoDB", "DynamoDB"],
  // E-learning
  ["Teachable", "Thinkific"],
  ["Kajabi", "Teachable"],
  ["Kajabi", "Podia"],
  ["Thinkific", "Podia"],
  // AI Code Editors (very high search volume 2025-2026)
  ["Cursor", "GitHub Copilot"],
  ["Cursor", "VS Code"],
  ["GitHub Copilot", "ChatGPT"],
  ["Cursor", "Windsurf"],
  // Cloud Providers
  ["AWS", "Google Cloud"],
  ["AWS", "Azure"],
  ["Azure", "Google Cloud"],
  ["AWS", "DigitalOcean"],
  ["DigitalOcean", "Heroku"],
  // Social Media Management
  ["Buffer", "Hootsuite"],
  ["Sprout Social", "Hootsuite"],
  ["Buffer", "Later"],
  // HR & Payroll
  ["Gusto", "Rippling"],
  ["Gusto", "ADP"],
  ["Rippling", "Workday"],
  ["BambooHR", "Workday"],
  // Antivirus
  ["Norton", "McAfee"],
  ["Bitdefender", "Norton"],
  ["Bitdefender", "McAfee"],
  ["Kaspersky", "Bitdefender"],
  ["Norton", "Windows Defender"],
  // More Hosting
  ["SiteGround", "Hostinger"],
  ["SiteGround", "GoDaddy"],
  ["Bluehost", "Namecheap"],
  ["Bluehost", "Hostinger"],
  // Storage
  ["Google Drive", "OneDrive"],
  ["Dropbox", "OneDrive"],
  // Payments
  ["Square", "Stripe"],
  ["Square", "PayPal"],
  // Code Hosting
  ["GitHub", "GitLab"],
  ["GitHub", "Bitbucket"],
  ["GitLab", "Bitbucket"],
  // Deployment
  ["Vercel", "Netlify"],
  // Productivity Suites
  ["Microsoft 365", "Google Workspace"],
  // Analytics
  ["Mixpanel", "Amplitude"],
  ["Hotjar", "Microsoft Clarity"],
  ["Google Analytics", "Plausible"],
  ["Google Analytics", "Matomo"],
  ["Mixpanel", "PostHog"],
  // SEO
  ["Ahrefs", "Semrush"],
  // Customer Support
  ["Zendesk", "Freshdesk"],
  ["Intercom", "Zendesk"],
  ["Help Scout", "Zendesk"],
  // Publishing/Creator
  ["Ghost", "Substack"],
  ["Beehiiv", "Substack"],
  ["Ghost", "WordPress"],
  // Email Marketing
  ["Mailchimp", "Brevo"],
  ["MailerLite", "Mailchimp"],
  ["SendGrid", "Mailchimp"],
  // Scheduling
  ["Calendly", "Acuity Scheduling"],
  // Task Management
  ["Todoist", "Asana"],
  ["Todoist", "ClickUp"],
  ["Basecamp", "Asana"],
  ["Smartsheet", "Monday.com"],
  // Collaboration
  ["Miro", "FigJam"],
  // Notes/Docs
  ["Evernote", "Notion"],
  // Storage
  ["Dropbox", "Google Drive"],
  // Payments
  ["PayPal", "Stripe"],
  // Automation
  ["Zapier", "Make"],
  // No-code DB
  ["Airtable", "Notion"],
  ["Airtable", "Monday.com"],
  // Video
  ["Loom", "Zoom"],
  ["Descript", "Adobe Premiere"],
  // CRM
  ["Salesforce", "HubSpot"],
  ["HubSpot", "Pipedrive"],
  ["Salesforce", "Zoho CRM"],
  ["HubSpot", "Zoho CRM"],
  ["Pipedrive", "Monday CRM"],
  // Chat & Messaging
  ["Slack", "Microsoft Teams"],
  ["Slack", "Discord"],
  ["Microsoft Teams", "Zoom"],
  // E-Signature (extended)
  ["PandaDoc", "HelloSign"],
  ["Adobe Sign", "DocuSign"],
  // BI (extended)
  ["Looker", "Metabase"],
  ["Looker", "Domo"],
  // Observability (extended)
  ["New Relic", "Dynatrace"],
  ["Rollbar", "Bugsnag"],
  // WordPress Builders (extended)
  ["Divi", "Beaver Builder"],
  // Project Management (dev-focused)
  ["Linear", "Jira"],
  ["Notion", "Confluence"],
  ["Jira", "ClickUp"],
  // Finance & Accounting
  ["QuickBooks", "FreshBooks"],
  ["QuickBooks", "Xero"],
  ["Xero", "FreshBooks"],
  ["Wave", "QuickBooks"],
  ["QuickBooks", "Sage"],
  // DevOps & CI/CD
  ["GitHub Actions", "CircleCI"],
  ["GitHub Actions", "Jenkins"],
  ["CircleCI", "Jenkins"],
  ["Bitbucket Pipelines", "GitHub Actions"],
  ["ArgoCD", "Flux"],
  // Video Conferencing
  ["Zoom", "Google Meet"],
  ["Google Meet", "Microsoft Teams"],
  ["Webex", "Zoom"],
  ["Whereby", "Zoom"],
  // Marketing Automation
  ["Marketo", "HubSpot"],
  ["Pardot", "HubSpot"],
  ["ActiveCampaign", "HubSpot"],
  ["Marketo", "Pardot"],
  // E-commerce Platforms
  ["Shopify", "WooCommerce"],
  ["Shopify", "Squarespace"],
  ["WooCommerce", "Magento"],
  ["BigCommerce", "Shopify"],
  ["Shopify", "Wix"],
  // Data Engineering & Pipelines
  ["dbt", "Airflow"],
  ["Apache Kafka", "RabbitMQ"],
  ["Snowflake", "BigQuery"],
  ["Snowflake", "Redshift"],
  ["Fivetran", "Airbyte"],
  // Password Managers
  ["1Password", "Bitwarden"],
  ["LastPass", "1Password"],
  ["Dashlane", "1Password"],
  // Endpoint Security
  ["CrowdStrike", "SentinelOne"],
  ["Okta", "Microsoft Entra ID"],
  // Data Warehouses (extended)
  ["Snowflake", "BigQuery"],
  ["Snowflake", "Databricks"],
  ["Redshift", "BigQuery"],
  // Identity & Access (extended)
  ["Okta", "Auth0"],
  ["CrowdStrike", "Microsoft Defender"],
  ["SentinelOne", "Microsoft Defender"],
  // E-commerce (extended)
  ["Magento", "Shopify"],
  ["WooCommerce", "Magento"],
  // Container & IaC
  ["Docker", "Podman"],
  ["Kubernetes", "Docker Swarm"],
  ["Terraform", "Pulumi"],
  // Analytics (extended)
  ["Amplitude", "Heap"],
  ["PostHog", "Amplitude"],
  // Productivity Docs
  ["Notion", "Coda"],
  ["Coda", "Airtable"],
  // LLM / AI Assistants (very high 2025-2026 search volume)
  ["ChatGPT", "Claude"],
  ["ChatGPT", "Gemini"],
  ["Claude", "Gemini"],
  ["Perplexity", "ChatGPT"],
  ["ChatGPT", "Copilot"],
  // HR Tech (extended)
  ["Workday", "SAP SuccessFactors"],
  ["BambooHR", "HiBob"],
  ["Lattice", "Culture Amp"],
  ["Greenhouse", "Lever"],
  // Customer Success
  ["Gainsight", "ChurnZero"],
  ["Intercom", "Drift"],
  ["Zendesk", "Intercom"],
  // Note-taking & PKM
  ["Obsidian", "Roam Research"],
  ["Obsidian", "Notion"],
  ["Bear", "Notion"],
  // Infrastructure
  ["Terraform", "Pulumi"],
  ["Docker", "Kubernetes"],
  // API Development Tools
  ["Postman", "Insomnia"],
  ["Postman", "Bruno"],
  ["Swagger", "Postman"],
  // Browsers
  ["Chrome", "Firefox"],
  ["Chrome", "Brave"],
  ["Firefox", "Brave"],
  ["Arc", "Chrome"],
  // Email Clients
  ["Gmail", "Outlook"],
  ["ProtonMail", "Gmail"],
  ["Superhuman", "Gmail"],
  // Design Tools
  ["Figma", "Sketch"],
  ["Canva", "Adobe Express"],
  ["Figma", "Adobe XD"],
  // Customer Success
  ["Gainsight", "ChurnZero"],
  ["Gainsight", "Totango"],
  // Recruiting / ATS
  ["Greenhouse", "Lever"],
  ["Ashby", "Greenhouse"],
  // Performance Management
  ["Lattice", "Culture Amp"],
  ["Lattice", "Leapsome"],
  // Streaming Services (very high consumer search volume)
  ["Netflix", "Disney+"],
  ["Netflix", "Hulu"],
  ["Disney+", "HBO Max"],
  ["Apple TV+", "Netflix"],
  ["Peacock", "Hulu"],
  // Music Streaming
  ["Spotify", "Apple Music"],
  ["Tidal", "Spotify"],
  ["YouTube Music", "Spotify"],
  // Gaming Consoles
  ["PlayStation 5", "Xbox Series X"],
  ["Nintendo Switch", "Steam Deck"],
  ["Xbox Series X", "Nintendo Switch"],
  // Social Media Platforms
  ["Instagram", "TikTok"],
  ["LinkedIn", "X"],
  ["Reddit", "Quora"],
  // Mobile Operating Systems
  ["iOS", "Android"],
  ["iPhone", "Samsung Galaxy"],
  // Wearables & Fitness Trackers
  ["Apple Watch", "Fitbit"],
  ["Apple Watch", "Garmin"],
  ["Garmin", "Fitbit"],
  ["Apple Watch", "Samsung Galaxy Watch"],
  // Travel & Accommodation
  ["Airbnb", "Vrbo"],
  ["Airbnb", "Booking.com"],
  ["Booking.com", "Expedia"],
  ["Hotels.com", "Booking.com"],
  // Food Delivery
  ["DoorDash", "Uber Eats"],
  ["Grubhub", "DoorDash"],
  ["Instacart", "DoorDash"],
  ["Uber Eats", "Grubhub"],
  // Ride-Sharing
  ["Uber", "Lyft"],
  ["Uber", "DoorDash"],
  // Neobanks & Fintech
  ["Chime", "Revolut"],
  ["Robinhood", "Webull"],
  ["Coinbase", "Binance"],
  ["Venmo", "Cash App"],
  ["Cash App", "Zelle"],
  // Fitness & Wellness Apps
  ["Peloton", "NordicTrack"],
  ["MyFitnessPal", "Cronometer"],
  ["Calm", "Headspace"],
  // Password Managers (extended)
  ["NordPass", "1Password"],
  ["Keeper", "LastPass"],
  // Cloud Storage
  ["Google Drive", "Dropbox"],
  ["OneDrive", "Google Drive"],
  ["Dropbox", "Box"],
  // Smart Home
  ["Google Nest", "Amazon Echo"],
  ["Amazon Echo", "Apple HomePod"],
  ["Ring", "Arlo"],
  // EdTech & E-Learning
  ["Coursera", "Udemy"],
  ["Coursera", "edX"],
  ["Udemy", "Skillshare"],
  ["LinkedIn Learning", "Coursera"],
  ["Duolingo", "Babbel"],
  ["Duolingo", "Rosetta Stone"],
  ["Khan Academy", "Coursera"],
  // Streaming (extended)
  ["HBO Max", "Peacock"],
  ["Apple TV+", "HBO Max"],
  ["Tidal", "Apple Music"],
  ["YouTube Music", "Apple Music"],
  // Gaming Handhelds
  ["Steam Deck", "Nintendo Switch"],
  ["Steam Deck", "ASUS ROG Ally"],
  // VPN Services
  ["NordVPN", "ExpressVPN"],
  ["Surfshark", "NordVPN"],
  ["ProtonVPN", "NordVPN"],
  // Antivirus / Security
  ["Norton", "McAfee"],
  ["Malwarebytes", "Norton"],
  ["Bitdefender", "Norton"],
  // Email Marketing
  ["Mailchimp", "Klaviyo"],
  ["ConvertKit", "Mailchimp"],
  ["ActiveCampaign", "Mailchimp"],
  // Website Builders
  ["Squarespace", "Wix"],
  ["Webflow", "Squarespace"],
  ["Wix", "WordPress"],
  // PKM & Note-taking (extended)
  ["Roam Research", "Obsidian"],
  ["Roam Research", "Logseq"],
  ["Bear", "Obsidian"],
  ["Bear", "Notion"],
  ["Evernote", "Notion"],
  ["Evernote", "Obsidian"],
  ["Evernote", "Bear"],
  // Browser (extended)
  ["Arc", "Chrome"],
  ["Arc", "Firefox"],
  ["Arc", "Brave"],
  // AI Writing Tools
  ["Notion AI", "ChatGPT"],
  ["Notion AI", "Grammarly"],
  ["Jasper", "ChatGPT"],
  ["Copy.ai", "Jasper"],
  // Visual Collaboration
  ["Whimsical", "Miro"],
  ["Whimsical", "FigJam"],
  ["Lucidchart", "Whimsical"],
  // Fitness Apps
  ["Peloton", "Mirror"],
  ["Strava", "Garmin Connect"],
  ["MyFitnessPal", "Noom"],
  // Food & Restaurant Discovery
  ["Yelp", "Google Maps"],
  ["OpenTable", "Resy"],
  ["DoorDash", "Grubhub"],
  // CRM Extended
  ["Zoho CRM", "Salesforce"],
  ["Zoho CRM", "HubSpot"],
  ["Zoho CRM", "Pipedrive"],
  ["Zoho", "Freshworks"],
  // Survey Tools
  ["SurveyMonkey", "Typeform"],
  ["SurveyMonkey", "Google Forms"],
  ["Qualtrics", "SurveyMonkey"],
  // Adobe Creative
  ["Adobe Photoshop", "GIMP"],
  ["Adobe Photoshop", "Affinity Photo"],
  ["Adobe Illustrator", "Affinity Designer"],
  ["Adobe Illustrator", "Inkscape"],
  ["Adobe Photoshop", "Lightroom"],
  ["Adobe Illustrator", "Figma"],
  // Cloud Storage Extended
  ["Box", "Dropbox"],
  ["Box", "Google Drive"],
  ["OneDrive", "Google Drive"],
  ["OneDrive", "Dropbox"],
  ["OneDrive", "Box"],
  // Databases
  ["PostgreSQL", "MySQL"],
  ["MongoDB", "PostgreSQL"],
  ["Redis", "Memcached"],
  ["Elasticsearch", "Solr"],
  // DevOps Monitoring
  ["Datadog", "Splunk"],
  ["PagerDuty", "OpsGenie"],
  ["Grafana", "Datadog"],
  // Cloud Platforms Extended
  ["GCP", "AWS"],
  ["GCP", "Azure"],
  ["GCP", "DigitalOcean"],
  // Databases Extended
  ["PostgreSQL", "MySQL"],
  ["PostgreSQL", "MongoDB"],
  ["MySQL", "MariaDB"],
  ["Redis", "Memcached"],
  ["Redis", "MongoDB"],
  ["Elasticsearch", "Solr"],
  ["Elasticsearch", "OpenSearch"],
  ["Splunk", "Elasticsearch"],
  ["Splunk", "Datadog"],
  // Message Queues
  ["Apache Kafka", "RabbitMQ"],
  ["Kafka", "Redis"],
  ["SQS", "RabbitMQ"],
  // Infrastructure as Code Extended
  ["Ansible", "Terraform"],
  ["Ansible", "Chef"],
  ["Chef", "Puppet"],
  // Container Orchestration Extended
  ["Kubernetes", "Nomad"],
  ["Docker", "Podman"],
  // Frontend Frameworks (very high search volume)
  ["React", "Vue"],
  ["React", "Angular"],
  ["Vue", "Angular"],
  ["React", "Svelte"],
  ["Vue", "Svelte"],
  ["Angular", "Svelte"],
  ["Next.js", "Nuxt"],
  ["React", "Next.js"],
  // Programming Languages (extremely high search volume)
  ["Python", "JavaScript"],
  ["Python", "Java"],
  ["Python", "Go"],
  ["Python", "R"],
  ["TypeScript", "JavaScript"],
  ["TypeScript", "Python"],
  ["Go", "Rust"],
  ["Java", "Kotlin"],
  ["Swift", "Kotlin"],
  ["C++", "Rust"],
  // Observability / Monitoring
  ["Grafana", "Datadog"],
  ["Grafana", "Kibana"],
  ["Prometheus", "Datadog"],
  ["Grafana", "New Relic"],
  // Email Marketing Extended
  ["Mailchimp", "Brevo"],
  ["Klaviyo", "Mailchimp"],
  ["ConvertKit", "Beehiiv"],
  // Programming Languages Extended
  ["JavaScript", "TypeScript"],
  ["JavaScript", "Python"],
  ["Go", "Python"],
  ["Rust", "Go"],
  ["Rust", "C++"],
  ["Java", "Go"],
  ["Swift", "Kotlin"],
  // Frontend Frameworks Extended
  ["Svelte", "React"],
  ["Svelte", "Vue"],
  ["Next.js", "Remix"],
  ["Next.js", "Astro"],
  ["Next.js", "Gatsby"],
  // Backend Frameworks
  ["Django", "FastAPI"],
  ["Django", "Flask"],
  ["Django", "Rails"],
  ["FastAPI", "Flask"],
  ["Laravel", "Django"],
  ["Spring Boot", "Django"],
  ["Express", "FastAPI"],
  ["NestJS", "Express"],
  // Runtime Environments
  ["Node.js", "Bun"],
  ["Node.js", "Deno"],
  ["Bun", "Deno"],
  // Backend Frameworks Extended
  ["Flask", "FastAPI"],
  ["Flask", "Django"],
  ["FastAPI", "Django"],
  ["Rails", "Laravel"],
  ["Rails", "Django"],
  ["Laravel", "Symfony"],
  ["Spring Boot", "Micronaut"],
  ["NestJS", "Fastify"],
  // Web Servers
  ["Nginx", "Apache"],
  ["Nginx", "Caddy"],
  ["HAProxy", "Nginx"],
  ["Traefik", "Nginx"],
  // Operating Systems
  ["Linux", "Windows Server"],
  ["Ubuntu", "Debian"],
  ["CentOS", "Ubuntu"],
  ["Rocky Linux", "AlmaLinux"],
  // DevOps CI/CD Extended
  ["Jenkins", "GitHub Actions"],
  ["CircleCI", "GitHub Actions"],
  ["GitLab CI", "GitHub Actions"],
  ["ArgoCD", "Flux"],
  ["Helm", "Kustomize"],
  // Security Tools
  ["Snyk", "SonarQube"],
  ["Vault", "AWS Secrets Manager"],
  ["Trivy", "Snyk"],
  // Languages Extended
  ["Java", "Python"],
  ["Java", "Go"],
  ["Java", "C#"],
  ["Kotlin", "Java"],
  ["Kotlin", "Swift"],
  ["PHP", "Python"],
  ["PHP", "Node.js"],
  ["Ruby", "Python"],
  ["Ruby", "Go"],
  // Runtime / Server
  ["Node.js", "Java"],
  ["Node.js", "Go"],
  // Data Engineering
  ["Apache Spark", "Apache Flink"],
  ["Apache Spark", "dbt"],
  ["Apache Spark", "Hadoop"],
  ["dbt", "Dataform"],
  ["Airflow", "Prefect"],
  ["Airflow", "Dagster"],
  ["Kafka", "Apache Flink"],
  ["DuckDB", "BigQuery"],
  // Mobile Development
  ["React Native", "Flutter"],
  ["Swift", "React Native"],
  ["Kotlin", "React Native"],
  ["Expo", "React Native"],
  // Testing Frameworks
  ["Jest", "Vitest"],
  ["Cypress", "Playwright"],
  ["Selenium", "Playwright"],
];

function makeSlug(a: string, b: string): string {
  const sa = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  const sb = b.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  return [sa, sb].sort().join("-vs-");
}

const CATEGORIES = [
  "sports", "countries", "technology", "software", "products", "companies",
  "brands", "history", "economy", "military", "science", "entertainment",
  "automotive", "general",
];

async function tavilySearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "";
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, query, max_results: 3 }),
    });
    if (!res.ok) return "";
    const data: any = await res.json();
    return (data.results || []).map((r: any) => `- ${r.content?.slice(0, 300)} (${r.url})`).join("\n");
  } catch { return ""; }
}

async function generateOne(entityA: string, entityB: string): Promise<boolean> {
  const slug = makeSlug(entityA, entityB);

  // Check if already exists
  const existing = await prisma.comparison.findUnique({ where: { slug } });
  if (existing) {
    console.log(`  ⏭ Already exists: ${slug}`);
    return true;
  }

  // Tavily enrichment
  const [compData, aData, bData] = await Promise.all([
    tavilySearch(`${entityA} vs ${entityB} comparison 2026`),
    tavilySearch(`${entityA} latest features specs pricing 2026`),
    tavilySearch(`${entityB} latest features specs pricing 2026`),
  ]);
  const enrichment = [compData, aData, bData].filter(Boolean).join("\n");

  const prompt = `You are a comparison data expert. Generate a structured comparison between "${entityA}" and "${entityB}".

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "Entity A vs Entity B",
  "shortAnswer": "2-3 sentence factual summary of the key difference",
  "keyDifferences": [
    {"label": "Attribute Name", "entityAValue": "value", "entityBValue": "value", "winner": "a" or "b" or "tie"}
  ],
  "verdict": "2-3 sentence balanced conclusion",
  "category": "one of: ${CATEGORIES.join(", ")}. Use 'software' for any software/SaaS/app/tool comparisons.",
  "entities": [
    {
      "name": "Full Name",
      "shortDesc": "One-line description",
      "entityType": "software",
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "Who should choose this"
    }
  ],
  "attributes": [
    {
      "name": "Attribute",
      "unit": "unit or null",
      "category": "Category Group",
      "dataType": "number or text",
      "higherIsBetter": true/false/null,
      "entityAValue": "display value",
      "entityANumber": number_or_null,
      "entityBValue": "display value",
      "entityBNumber": number_or_null,
      "winner": "a" or "b" or "tie" or null
    }
  ],
  "faqs": [
    {"question": "Common question?", "answer": "Detailed answer."}
  ],
  "metaTitle": "SEO title under 60 chars with 2026",
  "metaDescription": "SEO description under 155 chars"
}

Requirements:
- Include 5-7 key differences
- Include 5-8 attributes with real data (pricing, features, performance)
- Include 3-5 FAQs
- Include 3-5 pros and 2-3 cons per entity
- Be factual, balanced, and include real pricing/specs
- Year is 2026

${enrichment ? `\nHere is current real-world data:\n${enrichment}` : ""}`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = (message.content[0] as any).text || "";
  let jsonText = text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();

  let data: any;
  try {
    data = JSON.parse(jsonText);
  } catch {
    console.error(`  ✗ JSON parse failed for ${slug}`);
    return false;
  }

  // Force software category for all these comparisons
  const category = "software";

  // Save to DB
  const entityASlug = (data.entities?.[0]?.name || entityA).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");
  const entityBSlug = (data.entities?.[1]?.name || entityB).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "");

  // Step 1: Core data (fast transaction)
  const entityType = await prisma.entityType.upsert({
    where: { slug: "software" },
    create: { slug: "software", name: "Software" },
    update: {},
  });
  const entityTypeId = entityType.id;

  const entA = await prisma.entity.upsert({
    where: { slug: entityASlug },
    create: { slug: entityASlug, name: data.entities?.[0]?.name || entityA, shortDesc: data.entities?.[0]?.shortDesc || null, entityTypeId },
    update: { shortDesc: data.entities?.[0]?.shortDesc || undefined },
  });

  const entB = await prisma.entity.upsert({
    where: { slug: entityBSlug },
    create: { slug: entityBSlug, name: data.entities?.[1]?.name || entityB, shortDesc: data.entities?.[1]?.shortDesc || null, entityTypeId },
    update: { shortDesc: data.entities?.[1]?.shortDesc || undefined },
  });

  const comparison = await prisma.comparison.upsert({
    where: { slug },
    create: {
      slug, title: data.title || `${entityA} vs ${entityB}`,
      shortAnswer: data.shortAnswer || null, keyDifferences: data.keyDifferences || [],
      verdict: data.verdict || null, category,
      metaTitle: data.metaTitle || `${entityA} vs ${entityB} | Comparison 2026`,
      metaDescription: data.metaDescription || `Compare ${entityA} and ${entityB} side by side.`,
      status: "published", isAutoGenerated: true, publishedAt: new Date(),
    },
    update: {
      title: data.title, shortAnswer: data.shortAnswer, keyDifferences: data.keyDifferences,
      verdict: data.verdict, category, metaTitle: data.metaTitle, metaDescription: data.metaDescription,
      status: "published", publishedAt: new Date(),
    },
  });

  // Step 2: Join records
  await prisma.comparisonEntity.deleteMany({ where: { comparisonId: comparison.id } });
  await prisma.comparisonEntity.createMany({
    data: [
      { comparisonId: comparison.id, entityId: entA.id, position: 0, pros: data.entities?.[0]?.pros || [], cons: data.entities?.[0]?.cons || [], bestFor: data.entities?.[0]?.bestFor || null },
      { comparisonId: comparison.id, entityId: entB.id, position: 1, pros: data.entities?.[1]?.pros || [], cons: data.entities?.[1]?.cons || [], bestFor: data.entities?.[1]?.bestFor || null },
    ],
  });

  // Step 3: FAQs
  await prisma.fAQ.deleteMany({ where: { comparisonId: comparison.id } });
  for (const faq of data.faqs || []) {
    await prisma.fAQ.create({ data: { question: faq.question, answer: faq.answer, comparisonId: comparison.id } });
  }

  // Step 4: Attributes (individually, non-critical)
  for (const attr of data.attributes || []) {
    try {
      const attrSlug = (attr.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "") || `attr-${Date.now()}`;
      let dbAttr = await prisma.attribute.findFirst({ where: { slug: attrSlug, entityTypeId } });
      if (!dbAttr) {
        dbAttr = await prisma.attribute.create({
          data: { slug: attrSlug, name: attr.name || attrSlug, unit: attr.unit || null, dataType: attr.dataType || "text", category: attr.category || null, higherIsBetter: typeof attr.higherIsBetter === "boolean" ? attr.higherIsBetter : null, entityTypeId },
        });
      }
      await prisma.attributeValue.deleteMany({ where: { entityId: entA.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entA.id, attributeId: dbAttr.id, valueText: attr.entityAValue ? String(attr.entityAValue) : null, valueNumber: typeof attr.entityANumber === "number" ? attr.entityANumber : null } });
      await prisma.attributeValue.deleteMany({ where: { entityId: entB.id, attributeId: dbAttr.id } });
      await prisma.attributeValue.create({ data: { entityId: entB.id, attributeId: dbAttr.id, valueText: attr.entityBValue ? String(attr.entityBValue) : null, valueNumber: typeof attr.entityBNumber === "number" ? attr.entityBNumber : null } });
    } catch { /* skip */ }
  }

  return true;
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  Generating Software Comparisons");
  console.log(`  Total: ${COMPARISONS.length} comparisons`);
  console.log("═══════════════════════════════════════════════════════\n");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < COMPARISONS.length; i++) {
    const [a, b] = COMPARISONS[i];
    const slug = makeSlug(a, b);
    console.log(`[${i + 1}/${COMPARISONS.length}] ${a} vs ${b} (${slug})`);

    const start = Date.now();
    try {
      const result = await generateOne(a, b);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      if (result) {
        const existing = await prisma.comparison.findUnique({ where: { slug }, select: { id: true } });
        if (existing) {
          console.log(`  ✓ Done in ${elapsed}s`);
          success++;
        }
      } else {
        console.log(`  ✗ Failed in ${elapsed}s`);
        failed++;
      }
    } catch (err: any) {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`  ✗ Error (${elapsed}s): ${err.message?.slice(0, 100)}`);
      failed++;
    }

    // Delay between generations
    if (i < COMPARISONS.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log("\n═══════════════════════════════════════════════════════");
  console.log(`  DONE: ${success} generated, ${skipped} skipped, ${failed} failed`);
  console.log("═══════════════════════════════════════════════════════");

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
