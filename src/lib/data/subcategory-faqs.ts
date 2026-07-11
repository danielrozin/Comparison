/**
 * Subcategory-level FAQ pairs for FAQPage JSON-LD schema on /category/[slug]/[subcategory] pages.
 * 3 Q&A pairs per subcategory — AEO-optimised for AI answer engine citation and Google FAQ rich results.
 */

import type { CategoryFaq } from "./category-faqs";

export const SUBCATEGORY_FAQS: Record<string, Record<string, CategoryFaq[]>> = {
  // ── Software ──────────────────────────────────────────────────────────────
  software: {
    "vpn-security": [
      {
        question: "How do I compare VPNs side by side?",
        answer:
          "A Versus B VPN comparisons evaluate speed (Mbps), server count, jurisdiction, logging policy, simultaneous connections, supported protocols (WireGuard, OpenVPN, IKEv2), and price — displayed in a structured table with a verdict for different use cases such as streaming, torrenting, or privacy.",
      },
      {
        question: "What are the best VPNs compared on A Versus B?",
        answer:
          "Top VPN comparisons on A Versus B include NordVPN vs ExpressVPN, Surfshark vs NordVPN, ProtonVPN vs Mullvad, and comparisons of antivirus suites like Norton vs Bitdefender vs Malwarebytes for users who need a bundled security solution.",
      },
      {
        question: "What makes one VPN better than another for streaming?",
        answer:
          "For streaming, the key factors are the ability to unblock region-locked libraries (Netflix US, BBC iPlayer, Disney+), server speed, and consistency of unblocking over time. A Versus B streaming-specific VPN comparisons highlight these factors in a dedicated attribute row.",
      },
    ],
    "hosting-domains": [
      {
        question: "How does A Versus B compare web hosting providers?",
        answer:
          "Web hosting comparisons on A Versus B cover uptime SLA, server response time (TTFB), storage and bandwidth limits, free SSL, cPanel or custom control panel, one-click WordPress install, free domain for year 1, and renewal pricing — side by side with a verdict.",
      },
      {
        question: "What are the most popular hosting comparisons?",
        answer:
          "Top hosting comparisons include Hostinger vs Bluehost, SiteGround vs WP Engine, GoDaddy vs Namecheap for domain registration, and Cloudflare vs AWS CloudFront for CDN and DNS management.",
      },
      {
        question: "Should I choose shared hosting or managed WordPress hosting?",
        answer:
          "Shared hosting is cheaper and sufficient for new or low-traffic sites. Managed WordPress hosting adds automatic updates, staging environments, and WordPress-specific caching — worth the premium once monthly traffic exceeds ~10,000 visitors. A Versus B comparisons surface this trade-off in the verdict section.",
      },
    ],
    "website-builders": [
      {
        question: "How does A Versus B compare website builders?",
        answer:
          "Website builder comparisons evaluate template library size, drag-and-drop flexibility, built-in SEO tools, eCommerce capabilities (for Shopify, Wix, Squarespace), loading speed, custom domain support, and total monthly cost — with a verdict per use case (portfolio, blog, store).",
      },
      {
        question: "What are the most popular website builder comparisons?",
        answer:
          "Top comparisons include Wix vs Squarespace, Shopify vs WooCommerce, Webflow vs Framer, WordPress vs Squarespace, and BigCommerce vs Shopify for high-volume eCommerce stores.",
      },
      {
        question: "Which website builder is best for an online store?",
        answer:
          "For eCommerce, Shopify leads on payment integrations, inventory management, and app ecosystem, while WooCommerce offers more flexibility at lower cost if you already use WordPress. BigCommerce suits high-SKU catalogues. A Versus B eCommerce comparisons break down transaction fees, hosting requirements, and scalability side by side.",
      },
    ],
    "ai-tools": [
      {
        question: "How does A Versus B compare AI tools?",
        answer:
          "AI tool comparisons on A Versus B evaluate model capability (reasoning, coding, writing, multimodal), context window size, price per token or per plan, API access, latency, and accuracy on standard benchmarks — displayed side by side with a use-case verdict.",
      },
      {
        question: "What are the most popular AI tool comparisons?",
        answer:
          "Top AI comparisons include ChatGPT vs Claude, Gemini vs ChatGPT, Cursor vs GitHub Copilot, Midjourney vs DALL-E 3, and comparisons of AI writing assistants like Jasper vs Copy.ai for marketing teams.",
      },
      {
        question: "How do I choose between Claude and ChatGPT?",
        answer:
          "ChatGPT (GPT-4o) excels at general knowledge, image analysis, and plugin ecosystem. Claude (claude-sonnet-5 / claude-opus-4-8) leads on long-context tasks, coding precision, and instruction-following accuracy. A Versus B compares them on output quality, safety guardrails, price, and API features so you can match the model to your workflow.",
      },
    ],
    "productivity": [
      {
        question: "How does A Versus B compare productivity tools?",
        answer:
          "Productivity tool comparisons cover core features (notes, tasks, databases, kanban), collaboration capabilities, third-party integrations, mobile app quality, offline access, and pricing tiers — with a verdict for individuals vs teams and specific use cases like project management or PKM.",
      },
      {
        question: "What are the most popular productivity comparisons?",
        answer:
          "Top comparisons include Notion vs Obsidian, ClickUp vs Asana, Trello vs Jira, Todoist vs TickTick, Monday.com vs ClickUp, and Evernote vs Notion for note-taking and knowledge management.",
      },
      {
        question: "Is Notion or Obsidian better for personal knowledge management?",
        answer:
          "Notion is better for teams, databases, and structured wikis — with real-time collaboration and generous free tier. Obsidian is better for solo knowledge graphs, local-first storage, and plugin extensibility. A Versus B PKM comparisons break down linking, search, offline access, and data ownership side by side.",
      },
    ],
    "design-creative": [
      {
        question: "How does A Versus B compare design tools?",
        answer:
          "Design tool comparisons evaluate vector editing, prototyping, collaboration, asset libraries, plugin ecosystems, file compatibility (SVG, PSD, AI), cloud storage, and price — with a verdict for UI/UX designers, graphic designers, and motion designers.",
      },
      {
        question: "What are the most popular design tool comparisons?",
        answer:
          "Top comparisons include Figma vs Adobe XD, Canva vs Adobe Express, Photoshop vs GIMP, DaVinci Resolve vs Premiere Pro, Procreate vs Illustrator, and Affinity Designer vs Illustrator for budget-conscious professionals.",
      },
      {
        question: "Is Figma or Adobe XD better for UI design in 2026?",
        answer:
          "Figma dominates UI/UX in 2026 due to superior real-time multiplayer editing, Dev Mode for developer handoff, and a richer plugin marketplace. Adobe XD is a strong free alternative if you're already in the Adobe ecosystem but lags on collaboration. A Versus B compares them on component management, prototyping fidelity, and handoff workflow.",
      },
    ],
    "communication": [
      {
        question: "How does A Versus B compare communication and collaboration tools?",
        answer:
          "Communication tool comparisons cover messaging channels, video call quality (resolution, noise cancellation), file sharing, thread organisation, search depth, integrations (calendar, task managers, CRM), guest access, and pricing per seat — with a verdict for remote-first teams.",
      },
      {
        question: "What are the most popular communication tool comparisons?",
        answer:
          "Top comparisons include Slack vs Microsoft Teams, Zoom vs Google Meet, Discord vs Slack, Loom vs Soapbox, and Webex vs Teams for enterprise video conferencing.",
      },
      {
        question: "Should my team use Slack or Microsoft Teams?",
        answer:
          "Microsoft Teams is the better default if your organisation uses Microsoft 365 — native integration with Outlook, SharePoint, and Office apps reduces friction. Slack wins on UI/UX, third-party app ecosystem, and developer-friendly workflows. A Versus B compares them on search, notifications, video quality, and admin controls.",
      },
    ],
    "cloud-devtools": [
      {
        question: "How does A Versus B compare cloud platforms?",
        answer:
          "Cloud platform comparisons on A Versus B evaluate compute options (VMs, containers, serverless), managed database offerings, free tier limits, pricing model, global region count, CDN, compliance certifications (SOC 2, HIPAA, GDPR), and developer experience — side by side with a verdict.",
      },
      {
        question: "What are the most popular cloud and DevTools comparisons?",
        answer:
          "Top comparisons include AWS vs Azure vs Google Cloud, Vercel vs Netlify for front-end hosting, GitHub vs GitLab, VS Code vs JetBrains IDEs, Supabase vs Firebase, and Docker vs Podman for containerisation.",
      },
      {
        question: "Is Vercel or Netlify better for Next.js deployments?",
        answer:
          "Vercel is the native host for Next.js — it supports all framework features (ISR, Server Actions, Edge Functions) out of the box. Netlify is more framework-agnostic, with comparable DX and slightly simpler form handling. A Versus B compares them on build times, cold start latency, free tier limits, and team collaboration features.",
      },
    ],
    "email-crm": [
      {
        question: "How does A Versus B compare email marketing platforms?",
        answer:
          "Email marketing comparisons evaluate deliverability rate, list segmentation, automation workflow builder, A/B testing, template library, landing page builder, subscriber limit per pricing tier, and eCommerce integrations — with a verdict per business size and use case.",
      },
      {
        question: "What are the most popular email marketing and CRM comparisons?",
        answer:
          "Top comparisons include Mailchimp vs Klaviyo, HubSpot vs Salesforce, ConvertKit vs ActiveCampaign, Brevo vs Mailchimp, and Zoho CRM vs HubSpot CRM for growing SMBs.",
      },
      {
        question: "Is HubSpot or Salesforce better for a growing team?",
        answer:
          "HubSpot is the better choice for teams up to ~200 employees — simpler onboarding, generous free tier, and native marketing/sales/service alignment. Salesforce scales better for enterprise deal complexity and advanced reporting. A Versus B compares them on setup time, total cost, automation depth, and CRM customisation.",
      },
    ],
    "finance-accounting": [
      {
        question: "How does A Versus B compare accounting software?",
        answer:
          "Accounting software comparisons evaluate invoicing, expense tracking, payroll add-on, bank reconciliation, multi-currency support, tax filing integrations, receipt capture, and pricing per month — with a verdict for freelancers, small businesses, and growing companies.",
      },
      {
        question: "What are the most popular finance software comparisons?",
        answer:
          "Top comparisons include QuickBooks vs Xero, FreshBooks vs Wave, Stripe vs PayPal for payment processing, Square vs Stripe, and Venmo vs Cash App vs Zelle for peer-to-peer payments.",
      },
      {
        question: "Should a freelancer use QuickBooks or FreshBooks?",
        answer:
          "FreshBooks is the better choice for freelancers — simpler interface, client-focused invoicing, and time tracking built in. QuickBooks handles more complex accounting scenarios (inventory, payroll, tax prep) better. A Versus B compares them on learning curve, mobile app, receipt capture, and annual cost.",
      },
    ],
    "password-privacy": [
      {
        question: "How does A Versus B compare password managers?",
        answer:
          "Password manager comparisons cover zero-knowledge encryption, device sync, browser extension quality, secure sharing, passkey support, dark web monitoring, emergency access, and price per year — with a verdict for individuals, families, and businesses.",
      },
      {
        question: "What are the most popular password manager comparisons?",
        answer:
          "Top comparisons include 1Password vs Bitwarden, LastPass vs Dashlane, Keeper vs 1Password, and privacy browser comparisons like Brave vs Firefox vs DuckDuckGo browser for users who want an integrated privacy stack.",
      },
      {
        question: "Is 1Password or Bitwarden the better password manager?",
        answer:
          "Bitwarden is the top choice for cost-conscious users — open-source, audited, and free tier covers all core features. 1Password has a better UX, travel mode, and richer business features. A Versus B compares them on mobile app quality, browser extension speed, Watchtower vs Bitwarden breach alerts, and total annual cost.",
      },
    ],
    "office-tools": [
      {
        question: "How does A Versus B compare office and document tools?",
        answer:
          "Office tool comparisons evaluate document creation, spreadsheet capability, real-time co-editing, cloud storage included, offline mode, file format compatibility (DOCX, XLSX, PDF), and price — with a verdict for individuals and enterprise teams.",
      },
      {
        question: "What are the most popular office software comparisons?",
        answer:
          "Top comparisons include Google Workspace vs Microsoft 365, Google Docs vs Microsoft Word, Grammarly vs ProWritingAid, Dropbox vs Google Drive vs OneDrive, and Acrobat vs PDFelement for PDF editing.",
      },
      {
        question: "Is Google Workspace or Microsoft 365 better for a small team?",
        answer:
          "Google Workspace is simpler to set up, browser-native, and excellent for real-time collaboration. Microsoft 365 is the better fit if your team relies on deep Excel or PowerPoint features, or needs Outlook with Exchange. A Versus B compares them on storage per user, admin controls, video conferencing, and total cost per seat.",
      },
    ],
  },

  // ── Products ──────────────────────────────────────────────────────────────
  products: {
    "home-kitchen": [
      {
        question: "How does A Versus B compare home and kitchen appliances?",
        answer:
          "Home appliance comparisons cover suction power (Pa) for robot vacuums, motor wattage for blenders, filtration stages for air purifiers, capacity for instant pots, and energy efficiency ratings — displayed in structured tables with a verdict for different household sizes and needs.",
      },
      {
        question: "What are the most popular home and kitchen comparisons?",
        answer:
          "Top comparisons include Roomba vs Roborock, Dyson V15 vs Shark Stratos, Vitamix vs Ninja, Instant Pot vs Crock-Pot, and Dyson Purifier vs Levoit for air quality — covering the most-searched appliance matchups.",
      },
      {
        question: "What should I look for when comparing robot vacuums?",
        answer:
          "Key factors are suction power (Pa), obstacle avoidance (camera vs LIDAR), mopping capability, auto-empty base, battery life, app and voice assistant support, and noise level. A Versus B robot vacuum comparisons rate each factor and recommend the best pick for pet owners, hardwood floors, and carpeted homes.",
      },
    ],
    "personal-care": [
      {
        question: "How does A Versus B compare personal care products?",
        answer:
          "Personal care comparisons evaluate key specs (heat settings, motor speed, attachments for hair tools), ingredient quality for skincare, dermatologist rating, free-from certifications, and value per millilitre — with a verdict for different skin types, hair types, and budgets.",
      },
      {
        question: "What are the most popular personal care comparisons?",
        answer:
          "Top comparisons include Dyson Airwrap vs Dyson Flexstyle, Ordinary vs Paula's Choice serums, La Roche-Posay vs CeraVe moisturisers, Olaplex vs K18, and comparisons of electric toothbrushes and face cleansing devices.",
      },
      {
        question: "How do I compare hair styling tools?",
        answer:
          "For hair tools, compare heat range (°F), attachment variety, motor type (brushless vs standard), cord length, weight, and heat protection technology. A Versus B hair tool comparisons include test results for curl hold, frizz reduction, and heat damage, with verdicts per hair type.",
      },
    ],
    "audio-wearables": [
      {
        question: "How does A Versus B compare headphones and earbuds?",
        answer:
          "Audio comparisons evaluate driver size and type (dynamic, planar, BA), frequency response, ANC (dB attenuation), transparency mode quality, codec support (AAC, aptX, LDAC, LC3), battery life, IP rating, and price — with a verdict for commuters, gym use, and audiophiles.",
      },
      {
        question: "What are the most popular audio and wearables comparisons?",
        answer:
          "Top comparisons include AirPods Pro 2 vs Samsung Galaxy Buds 3, Sony WH-1000XM6 vs Bose QC Ultra, Apple Watch vs Garmin vs WHOOP for fitness tracking, and Oura Ring vs WHOOP for recovery metrics.",
      },
      {
        question: "Which fitness tracker is most accurate for health monitoring?",
        answer:
          "Garmin leads on GPS accuracy and training load metrics for athletes; Apple Watch leads on ECG and medical-grade heart monitoring; WHOOP and Oura Ring specialise in recovery and sleep staging. A Versus B wearable comparisons evaluate each on sensor accuracy, battery life, subscription cost, and app depth.",
      },
    ],
    "smart-home": [
      {
        question: "How does A Versus B compare smart home devices?",
        answer:
          "Smart home comparisons evaluate compatibility (Matter, Thread, Zigbee, Z-Wave), voice assistant support (Alexa, Google, HomeKit), setup complexity, video resolution and storage for cameras, automation capabilities, privacy policy, and price — with a verdict for Apple, Google, and Amazon ecosystems.",
      },
      {
        question: "What are the most popular smart home comparisons?",
        answer:
          "Top comparisons include Ring vs Nest Doorbell, Amazon Echo vs Google Nest Hub, Philips Hue vs Govee smart bulbs, Ecobee vs Nest Thermostat, and Amazon Echo vs Apple HomePod for smart speakers.",
      },
      {
        question: "Should I build my smart home around Alexa or Google Home?",
        answer:
          "Alexa leads on device compatibility (60,000+ compatible devices) and routine automation. Google Home leads on conversational AI and tight Android/Pixel integration. Apple HomeKit is the best choice for iPhone users who prioritise local processing and privacy. A Versus B compares all three on ecosystem lock-in, automation depth, and device breadth.",
      },
    ],
    "fitness-equipment": [
      {
        question: "How does A Versus B compare fitness equipment?",
        answer:
          "Fitness equipment comparisons cover resistance levels, workout library size, instructor quality, monthly subscription cost, weight/footprint, build quality, and resale value — with a verdict for home gym setups at different budgets and fitness goals.",
      },
      {
        question: "What are the most popular fitness equipment comparisons?",
        answer:
          "Top comparisons include Peloton vs NordicTrack, Tonal vs BowFlex, creatine monohydrate vs HMB, whey vs casein protein powder, and comparisons of major pre-workout supplements by caffeine content, ingredient transparency, and taste.",
      },
      {
        question: "Is creatine monohydrate better than creatine HCL?",
        answer:
          "Creatine monohydrate is the most researched form — safe, effective, and inexpensive. Creatine HCL has better solubility and may cause less bloating but costs more and has less long-term research. A Versus B creatine comparisons show dosing, efficacy data, and price per serving side by side so you can make an evidence-based choice.",
      },
    ],
    "outdoor-travel": [
      {
        question: "How does A Versus B compare outdoor and travel gear?",
        answer:
          "Outdoor gear comparisons evaluate insulation type and R-value for sleeping bags, denier and waterproof rating for tents, insulation capacity for coolers, weight-to-volume ratio for hydration gear, and durability — with a verdict for backpackers, car campers, and day hikers.",
      },
      {
        question: "What are the most popular outdoor and travel product comparisons?",
        answer:
          "Top comparisons include YETI vs Stanley vs Hydro Flask, Osprey vs Gregory backpacks, Away vs Samsonite luggage, Nemo vs Big Agnes sleeping bags, and REI Co-op vs Patagonia for outdoor apparel sustainability.",
      },
      {
        question: "Is YETI or Stanley the better insulated bottle?",
        answer:
          "Both use double-wall vacuum insulation, but YETI leads on durability and brand reputation while Stanley's Quencher has outsized capacity (40 oz) and handle design suited for daily carry. A Versus B compares them on ice retention (hours), leak-proof rating, BPA-free certification, and value per ounce.",
      },
    ],
    "fashion-shopping": [
      {
        question: "How does A Versus B compare fashion brands?",
        answer:
          "Fashion brand comparisons evaluate fabric quality, sizing consistency, return policy, sustainability practices, price-per-wear value, and brand reputation — with a verdict per category such as activewear, casual, and occasion wear.",
      },
      {
        question: "What are the most popular fashion and shopping comparisons?",
        answer:
          "Top comparisons include Lululemon vs Athleta, Nike vs Adidas, TEMU vs Shein, Nordstrom vs Saks, and comparisons of luxury resale platforms like The RealReal vs Vestiaire Collective for authenticated pre-owned fashion.",
      },
      {
        question: "Is Lululemon or Athleta better for activewear?",
        answer:
          "Lululemon leads on technical fabric innovation (Luon, Nulu) and fit consistency. Athleta has a wider size range (XXS–3X), is certified B Corp, and costs slightly less. A Versus B compares them on fabric feel, durability after 50+ washes, return policy, and sustainability credentials.",
      },
    ],
    "streaming": [
      {
        question: "How does A Versus B compare streaming devices?",
        answer:
          "Streaming device comparisons evaluate processor speed, supported resolutions (4K, 8K, HDR10+, Dolby Vision), app ecosystem, remote design, smart home integration, and price — with a verdict for budget, mid-range, and premium setups.",
      },
      {
        question: "What are the most popular streaming product comparisons?",
        answer:
          "Top comparisons include Amazon Fire TV Stick vs Roku, Apple TV 4K vs Nvidia Shield, Kindle Paperwhite vs Kobo Libra, and PlayStation 5 vs Xbox Series X as media players in addition to gaming consoles.",
      },
      {
        question: "Should I buy an Apple TV 4K or Nvidia Shield?",
        answer:
          "Apple TV 4K is the best choice for iPhone and HomeKit users — AirPlay 2, Siri integration, and the smoothest streaming UI. Nvidia Shield is better for Android power users who want local media playback (Plex), game streaming, and an extensible Android TV platform. A Versus B compares them on performance, app ecosystem, and price.",
      },
    ],
    "gaming": [
      {
        question: "How does A Versus B compare gaming consoles and accessories?",
        answer:
          "Gaming comparisons cover exclusive library strength, performance (frame rate, resolution, ray tracing), load time with SSD storage, online subscription value, backward compatibility, controller ergonomics, and launch price vs total 5-year cost — with a verdict per gamer profile.",
      },
      {
        question: "What are the most popular gaming product comparisons?",
        answer:
          "Top gaming comparisons include PS5 vs Xbox Series X, Nintendo Switch OLED vs Steam Deck, DualSense vs Xbox Series X Controller, Sony Pulse 3D vs SteelSeries Arctis for gaming audio, and ROG Ally vs Steam Deck for handheld PC gaming.",
      },
      {
        question: "Is the PS5 or Xbox Series X the better console in 2026?",
        answer:
          "PS5 leads on exclusive first-party titles (Spider-Man, God of War, Horizon) and haptic DualSense controller. Xbox Series X leads on backward compatibility depth, Game Pass value (hundreds of titles for ~$15/month), and PC crossplay. A Versus B compares them on performance, exclusives, subscription cost, and ecosystem.",
      },
    ],
    "automotive": [
      {
        question: "How does A Versus B compare cars in the products category?",
        answer:
          "Automotive product comparisons evaluate MSRP, fuel economy (MPG or MPGe for EVs), cargo space, safety ratings (NHTSA/IIHS), technology features (infotainment screen, ADAS), warranty, and 5-year ownership cost — side by side with a verdict for different buyer priorities.",
      },
      {
        question: "What are the most popular automotive product comparisons?",
        answer:
          "Top comparisons include Toyota RAV4 vs Honda CR-V, Tesla Model Y vs Ford Mustang Mach-E, Honda Civic vs Toyota Corolla, Ram 1500 vs Ford F-150, and Toyota Camry vs Honda Accord for family sedans.",
      },
      {
        question: "What should I look at when comparing SUVs?",
        answer:
          "For SUVs, compare cargo volume behind second and third rows (if applicable), towing capacity, AWD/4WD system availability, ADAS features (adaptive cruise, lane keep, blind spot), infotainment screen size, and 5-year resale value. A Versus B SUV comparisons surface all of these in a single table with a verdict per use case.",
      },
    ],
  },

  // ── Sports ────────────────────────────────────────────────────────────────
  sports: {
    "football": [
      {
        question: "How does A Versus B compare football players?",
        answer:
          "Football comparisons evaluate career goals, assists, Ballon d'Or titles, Champions League and league titles, international trophies, peak seasons, and club vs country performance — with a structured verdict that identifies which player leads in each category.",
      },
      {
        question: "What are the most popular football comparisons on A Versus B?",
        answer:
          "Top football comparisons include Messi vs Ronaldo, Mbappé vs Haaland, Neymar vs Mbappé, Zidane vs Ronaldinho, and top Premier League head-to-head team matchups like Man City vs Arsenal and Liverpool vs Chelsea.",
      },
      {
        question: "How does A Versus B determine the better footballer?",
        answer:
          "We evaluate objective statistics (goals, assists, titles) alongside era context, competition strength, and consistency metrics. The verdict reflects both statistical dominance and qualitative factors like leadership and big-game performance.",
      },
    ],
    "basketball": [
      {
        question: "How does A Versus B compare basketball players?",
        answer:
          "Basketball comparisons cover PPG, RPG, APG, PER, Win Shares, championships, MVP awards, Finals MVP, All-Star selections, shooting efficiency (TS%), and defensive rating — giving a multi-dimensional view across different eras and roles.",
      },
      {
        question: "What are the most popular basketball comparisons?",
        answer:
          "Top comparisons include LeBron James vs Michael Jordan, Steph Curry vs Kobe Bryant, Kevin Durant vs LeBron, Nikola Jokić vs Joel Embiid, and franchise comparisons like Lakers vs Celtics by championship count.",
      },
      {
        question: "Is LeBron James or Michael Jordan the GOAT?",
        answer:
          "Jordan leads on championship percentage (6/6 Finals), scoring titles (10), and defensive dominance (2× DPOY). LeBron leads on longevity, all-time points record, playoff win total, and statistical consistency across four decades. A Versus B compares them across 15+ metrics with a verdict that frames the argument by both era and statistical lens.",
      },
    ],
    "american-football": [
      {
        question: "How does A Versus B compare NFL players and teams?",
        answer:
          "NFL comparisons cover career passing yards, touchdowns, passer rating, Super Bowl wins, Pro Bowl selections, rushing yards and TDs for running backs, and franchise win percentage — with a structured verdict for QBs, skill positions, and teams.",
      },
      {
        question: "What are the most popular American football comparisons?",
        answer:
          "Top comparisons include Tom Brady vs Patrick Mahomes, Chiefs vs Patriots dynasty records, Jim Brown vs Barry Sanders for all-time RB GOAT debates, and Aaron Rodgers vs Peyton Manning across career stats and clutch performance.",
      },
      {
        question: "Is Tom Brady or Patrick Mahomes the better quarterback?",
        answer:
          "Brady leads on total Super Bowl wins (7), career longevity (23 seasons), and postseason records. Mahomes leads on passing efficiency, early-career Super Bowl tally, and MVP frequency. A Versus B compares them on QB Rating, TD/INT ratio, postseason record, and peak season metrics.",
      },
    ],
    "combat-sports": [
      {
        question: "How does A Versus B compare MMA fighters and boxers?",
        answer:
          "Combat sports comparisons evaluate win-loss record, finish rate (KO/TKO/submission %), championship reigns, title defences, weight class context, and notable wins — with a verdict that accounts for era, competition quality, and stylistic matchups.",
      },
      {
        question: "What are the most popular combat sports comparisons?",
        answer:
          "Top comparisons include Jon Jones vs Anderson Silva, Khabib vs Conor McGregor, Tyson Fury vs Anthony Joshua, Canelo vs GGG, and historical boxing GOATs like Muhammad Ali vs Floyd Mayweather.",
      },
      {
        question: "How does A Versus B compare UFC fighters across weight classes?",
        answer:
          "Cross-weight-class comparisons are normalised by title defences, finish rate, and quality-of-competition scoring rather than raw weight. A Versus B uses a weighted P4P metric that accounts for opposition strength so comparisons between, say, flyweights and heavyweights remain meaningful.",
      },
    ],
    "tennis": [
      {
        question: "How does A Versus B compare tennis players?",
        answer:
          "Tennis comparisons cover Grand Slam titles (by surface), weeks at world No. 1, Masters titles, Davis Cup wins, head-to-head record, and peak ranking — with a verdict that contextualises dominance across different eras of the Open era.",
      },
      {
        question: "What are the most popular tennis comparisons?",
        answer:
          "Top comparisons include Djokovic vs Federer, Federer vs Nadal, Djokovic vs Nadal for the GOAT debate, Serena Williams vs Steffi Graf among women, and Alcaraz vs Sinner as the next generation.",
      },
      {
        question: "Who is the GOAT in men's tennis?",
        answer:
          "Djokovic leads on Grand Slams (24), weeks at No. 1 (428+), and career Golden Masters. Federer leads on style influence and Wimbledon titles (8). Nadal leads on French Open titles (14) and clay-court dominance. A Versus B compares all three across 12 metrics with a verdict that changes depending on which criteria you weight most.",
      },
    ],
    "cricket": [
      {
        question: "How does A Versus B compare cricket players?",
        answer:
          "Cricket comparisons cover Test and ODI batting averages, centuries, wickets for bowlers, ICC rankings across formats, World Cup titles, and captaincy records — with a verdict that distinguishes performance in Test, ODI, and T20 formats.",
      },
      {
        question: "What are the most popular cricket comparisons?",
        answer:
          "Top comparisons include Virat Kohli vs Sachin Tendulkar, Kohli vs Babar Azam, Jasprit Bumrah vs Pat Cummins, and India vs Australia for Test cricket supremacy across different eras.",
      },
      {
        question: "Is Virat Kohli or Sachin Tendulkar the better batsman?",
        answer:
          "Sachin leads on career centuries (100 in internationals), longevity (24 years), and ODI records. Kohli leads on Test batting average in modern conditions, chase success rate, and T20 consistency. A Versus B compares them format by format with stats sourced from ICC and ESPNcricinfo.",
      },
    ],
    "motorsport": [
      {
        question: "How does A Versus B compare Formula 1 drivers and teams?",
        answer:
          "F1 comparisons cover World Championship titles, race wins, pole positions, podiums, fastest laps, DNF rate, and constructors' championship wins for teams — with a verdict that contextualises performance by era and car quality.",
      },
      {
        question: "What are the most popular motorsport comparisons?",
        answer:
          "Top comparisons include Max Verstappen vs Lewis Hamilton, Schumacher vs Senna for the all-time GOAT debate, Red Bull vs Mercedes constructor dominance, Ferrari vs McLaren historical records, and Verstappen vs Leclerc as current-generation rivals.",
      },
      {
        question: "Is Max Verstappen or Lewis Hamilton the greater F1 driver?",
        answer:
          "Hamilton leads on total championships (7), race wins (103), poles (104), and the breadth of machinery he won with. Verstappen leads on pace metrics, qualifying and race win rate from 2021 onward, and back-to-back dominance with multiple titles. A Versus B compares them on raw stats, era difficulty, and equipment context.",
      },
    ],
    "other-sports": [
      {
        question: "What other sports comparisons does A Versus B cover?",
        answer:
          "A Versus B covers golf (Tiger vs Jack Nicklaus), rugby (All Blacks vs Springboks), cycling (Tour de France winners), swimming (Phelps vs Caeleb Dressel), athletics (100m and marathon records), baseball (Babe Ruth vs Mike Trout), and Olympic medal table comparisons.",
      },
      {
        question: "What are the most popular other sports comparisons?",
        answer:
          "Top non-mainstream comparisons include Tiger Woods vs Jack Nicklaus for golf GOAT, New Zealand vs South Africa in rugby, Michael Phelps vs Ian Thorpe, and Usain Bolt vs Carl Lewis for the sprint GOAT debate.",
      },
      {
        question: "How does A Versus B compare sports across different eras?",
        answer:
          "We normalise cross-era comparisons by available competition quality, record books at the time, and structural differences (fewer Grand Slam events, shorter seasons, fewer opponents). The verdict notes these adjustments explicitly so readers can weigh era context themselves.",
      },
    ],
  },

  // ── Countries ─────────────────────────────────────────────────────────────
  countries: {
    "asia": [
      {
        question: "How does A Versus B compare Asian countries?",
        answer:
          "Asian country comparisons cover GDP and GDP per capita, population, HDI rank, internet penetration, military spending, trade balance, and quality-of-life indicators from the World Bank, IMF, and UNDP — side by side in structured tables with a verdict.",
      },
      {
        question: "What are the most popular Asian country comparisons?",
        answer:
          "Top comparisons include China vs Japan, India vs China, South Korea vs Japan, Singapore vs Hong Kong, Vietnam vs Thailand for expat and investment comparisons, and Indonesia vs Philippines for emerging economy analysis.",
      },
      {
        question: "Which Asian country has the highest standard of living?",
        answer:
          "Singapore, Japan, and South Korea consistently rank highest in Asia on HDI, life expectancy, and per-capita income. Qatar and UAE lead the Middle East by per-capita GDP. A Versus B compares them on all major quality-of-life metrics so you can see which dimension each country leads.",
      },
    ],
    "europe": [
      {
        question: "How does A Versus B compare European countries?",
        answer:
          "European country comparisons evaluate GDP per capita, Gini coefficient (inequality), life expectancy, education index, press freedom score, cost of living index, and EU membership status — drawing from Eurostat, World Bank, and OECD data.",
      },
      {
        question: "What are the most popular European country comparisons?",
        answer:
          "Top comparisons include Germany vs France, UK vs Germany, Norway vs Sweden, Spain vs Italy, Ireland vs Netherlands for tech hub comparisons, and Switzerland vs Germany for financial and quality-of-life metrics.",
      },
      {
        question: "Which European country has the best quality of life?",
        answer:
          "Norway, Switzerland, and Finland consistently top European quality-of-life rankings by combining high per-capita income, low inequality, strong healthcare, and high press freedom. A Versus B compares all major European nations on 10+ metrics so you can find the best fit for your specific priorities.",
      },
    ],
    "americas": [
      {
        question: "How does A Versus B compare countries in the Americas?",
        answer:
          "Americas comparisons cover GDP, GDP per capita, population, HDI rank, life expectancy, literacy rate, military budget, trade flows, and digital infrastructure — with a verdict that frames each country's relative strengths across economic and quality-of-life dimensions.",
      },
      {
        question: "What are the most popular Americas country comparisons?",
        answer:
          "Top comparisons include USA vs Canada, USA vs Mexico, Brazil vs Argentina, Canada vs Australia as expat destinations, Chile vs Colombia as Latin American investment destinations, and USA vs UK for economic and lifestyle comparisons.",
      },
      {
        question: "Is Canada or the USA a better country to live in?",
        answer:
          "Canada leads on universal healthcare, lower homicide rate, and immigration openness. The USA leads on GDP per capita, salary levels in high-skill sectors, and cultural diversity of major metro areas. A Versus B compares them on healthcare access, cost of living by city, tax burden, and immigration pathways.",
      },
    ],
    "middle-east-africa": [
      {
        question: "How does A Versus B compare countries in the Middle East and Africa?",
        answer:
          "Middle East and Africa comparisons draw from World Bank, IMF, and SIPRI data to cover GDP, oil reserves (barrels), HDI rank, political stability index, internet penetration, and military strength — with a verdict that highlights both economic and geopolitical dimensions.",
      },
      {
        question: "What are the most popular Middle East and Africa comparisons?",
        answer:
          "Top comparisons include Saudi Arabia vs UAE, Israel vs Jordan, Nigeria vs South Africa for sub-Saharan economic leadership, Egypt vs Morocco, and Qatar vs Kuwait for Gulf state comparisons.",
      },
      {
        question: "Which Middle Eastern country has the highest GDP per capita?",
        answer:
          "Qatar has the highest GDP per capita in the region at ~$82,000 (PPP), followed by UAE (~$78,000) and Kuwait (~$67,000), largely driven by hydrocarbon revenues. A Versus B compares these nations on GDP per capita, non-oil GDP diversification, and HDI rank.",
      },
    ],
    "oceania": [
      {
        question: "How does A Versus B compare countries in Oceania?",
        answer:
          "Oceania comparisons cover Australia and New Zealand's GDP per capita, HDI rank, cost of living, immigration points systems, natural disaster risk, and internet speed — alongside smaller Pacific island nations compared on tourism, sustainability, and development index.",
      },
      {
        question: "What are the most popular Oceania country comparisons?",
        answer:
          "Top comparisons include Australia vs New Zealand for emigration, Sydney vs Auckland cost of living, and Pacific island comparisons such as Fiji vs Bali as travel and retirement destinations.",
      },
      {
        question: "Is Australia or New Zealand better to live in?",
        answer:
          "Australia leads on salary levels, job market breadth, and climate diversity. New Zealand leads on work-life balance, natural environment access, and lower population density. A Versus B compares them on median salary, housing affordability, healthcare quality, and pathway to citizenship.",
      },
    ],
  },

  // ── Technology ────────────────────────────────────────────────────────────
  technology: {
    "smartphones": [
      {
        question: "How does A Versus B compare smartphones?",
        answer:
          "Smartphone comparisons evaluate processor (SoC benchmark scores), camera system (main, ultra-wide, telephoto MP and aperture), display (nits, Hz, resolution), battery life (PCMark endurance score), charging speed (W), and price at launch — with a verdict per use case.",
      },
      {
        question: "What are the most popular smartphone comparisons?",
        answer:
          "Top comparisons include iPhone 16 Pro vs Samsung Galaxy S25 Ultra, Google Pixel 9 Pro vs iPhone 16, OnePlus 13 vs Samsung Galaxy S25, and budget comparisons like Pixel 9a vs iPhone 16e.",
      },
      {
        question: "iPhone or Samsung Galaxy — which is better?",
        answer:
          "iPhone leads on software longevity (7 years of iOS updates), ecosystem integration (AirDrop, iMessage, AirPlay), and video quality. Samsung Galaxy leads on display peak brightness, telephoto zoom range, Android customisation, and charging speed. A Versus B compares the flagship models across 12 specs with a verdict per use case.",
      },
    ],
    "laptops-computers": [
      {
        question: "How does A Versus B compare laptops?",
        answer:
          "Laptop comparisons cover CPU (single-core and multi-core benchmark), RAM and upgradability, SSD speed, display (nits, colour gamut, refresh rate), battery life (hours of real-world video playback), weight, port selection, and MSRP — with a verdict per use case.",
      },
      {
        question: "What are the most popular laptop comparisons?",
        answer:
          "Top comparisons include MacBook Pro M4 vs Dell XPS 15, MacBook Air M4 vs Dell XPS 13, Lenovo ThinkPad vs HP EliteBook for business laptops, and ASUS ROG vs Razer Blade for gaming laptops.",
      },
      {
        question: "Is the MacBook Pro M4 or Dell XPS 15 better for creative work?",
        answer:
          "MacBook Pro M4 leads on sustained CPU/GPU performance, battery life (~18 hours), and display calibration. Dell XPS 15 offers Nvidia GPU options for GPU-accelerated Adobe workflows and more port flexibility with USB-A. A Versus B compares them on Blender, Premiere, and LightRoom render benchmarks with a creator-focused verdict.",
      },
    ],
    "tablets": [
      {
        question: "How does A Versus B compare tablets?",
        answer:
          "Tablet comparisons evaluate display size and resolution, processor performance, stylus support (Apple Pencil, S Pen), keyboard accessory compatibility, app ecosystem depth, battery capacity, 5G option availability, and price — with a verdict for students, creatives, and media consumers.",
      },
      {
        question: "What are the most popular tablet comparisons?",
        answer:
          "Top comparisons include iPad Pro M4 vs Samsung Galaxy Tab S10 Ultra, iPad Air M2 vs Google Pixel Tablet, Amazon Fire HD 10 vs iPad mini, and iPad vs Surface Pro for productivity-focused buyers.",
      },
      {
        question: "Should I buy an iPad or Samsung Galaxy Tab?",
        answer:
          "iPad leads on app optimisation, Apple Pencil latency, and iOS/macOS continuity features. Samsung Galaxy Tab leads on DeX desktop mode, broader file management, and price-per-spec at mid-range. A Versus B compares them on display quality, stylus performance, keyboard case, and 5-year software support.",
      },
    ],
    "gaming-tech": [
      {
        question: "How does A Versus B compare gaming technology?",
        answer:
          "Gaming tech comparisons cover GPU (frame rate at 1080p/1440p/4K, ray tracing performance, VRAM), console exclusive library, load times, backward compatibility, online subscription value, and total 5-year cost — with a verdict for PC gamers, console gamers, and casual players.",
      },
      {
        question: "What are the most popular gaming technology comparisons?",
        answer:
          "Top comparisons include PS5 vs Xbox Series X, Nvidia RTX 5090 vs AMD RX 9070 XT, Steam Deck vs ROG Ally X, Nintendo Switch 2 vs Steam Deck, and 1440p vs 4K gaming monitors for competitive and single-player setups.",
      },
      {
        question: "Is Nvidia RTX or AMD RX better for PC gaming in 2026?",
        answer:
          "Nvidia RTX 5090/5080 leads on ray tracing performance, DLSS 4 (frame generation), and content creator GPU acceleration. AMD RX 9070 XT leads on rasterisation price-to-performance and open-source FSR 4 upscaling. A Versus B compares them on 1440p and 4K benchmarks across a test suite of 10 titles.",
      },
    ],
    "ai-ml": [
      {
        question: "How does A Versus B compare AI models and machine learning tools?",
        answer:
          "AI model comparisons evaluate benchmark performance (MMLU, HumanEval, GPQA), context window size, multimodal capability (vision, audio, code), price per million tokens, API rate limits, and fine-tuning availability — with a verdict per use case.",
      },
      {
        question: "What are the most popular AI and machine learning comparisons?",
        answer:
          "Top comparisons include Claude Opus 4.8 vs GPT-4o, Gemini 2.0 Flash vs Claude Haiku 4.5, Llama 4 vs Mistral Large for open-source deployments, and Midjourney vs Stable Diffusion for AI image generation.",
      },
      {
        question: "What is the best large language model for coding tasks in 2026?",
        answer:
          "Claude claude-sonnet-5 and GPT-4o lead on HumanEval and SWE-bench coding benchmarks in 2026. Gemini 2.0 Pro is strong for multi-file context. DeepSeek Coder v3 offers competitive open-source performance at near-zero hosting cost. A Versus B compares them on pass@1 accuracy, context length, and API pricing per coding workflow.",
      },
    ],
    "networking": [
      {
        question: "How does A Versus B compare routers and networking equipment?",
        answer:
          "Networking comparisons cover Wi-Fi standard (Wi-Fi 6E, Wi-Fi 7), maximum throughput (Gbps), band support (2.4GHz/5GHz/6GHz/60GHz), mesh node count, coverage area (sq ft), port selection (2.5GbE, 10GbE), and price — with a verdict for apartments, large homes, and home offices.",
      },
      {
        question: "What are the most popular networking comparisons?",
        answer:
          "Top comparisons include Eero Max 7 vs Google Nest WiFi Pro, TP-Link Deco XE75 vs Netgear Orbi RBK863S, 5G home internet vs cable broadband, and Ethernet vs Wi-Fi 7 for latency-sensitive gaming and streaming.",
      },
      {
        question: "Is Wi-Fi 7 worth upgrading to from Wi-Fi 6E?",
        answer:
          "Wi-Fi 7 (802.11be) adds multi-link operation (MLO) for lower latency, up to 46 Gbps theoretical throughput, and 320 MHz channels on 6 GHz. For most home users with <1 Gbps ISP plans, Wi-Fi 6E is sufficient. Wi-Fi 7 is worth it for 10GbE ISP connections, low-latency gaming, or large-file NAS transfers. A Versus B compares them on real-world throughput and device compatibility.",
      },
    ],
  },

  // ── Companies ─────────────────────────────────────────────────────────────
  companies: {
    "big-tech": [
      {
        question: "How does A Versus B compare Big Tech companies?",
        answer:
          "Big Tech comparisons cover revenue, net income, market cap, employee count, R&D spend, cloud market share (for AWS, Azure, GCP), advertising revenue, and AI investment — with a verdict that frames relative strength across hardware, software, and services segments.",
      },
      {
        question: "What are the most popular Big Tech comparisons?",
        answer:
          "Top comparisons include Apple vs Microsoft, Google vs Amazon, Nvidia vs AMD, Meta vs Alphabet, and Tesla vs legacy automakers — covering the most-watched corporate rivalries by market cap, revenue, and innovation trajectory.",
      },
      {
        question: "Who is winning the AI race: Google, Microsoft, or Anthropic?",
        answer:
          "Microsoft leads on enterprise AI integration (Copilot across 365 and Azure), Google leads on search AI (Overviews, Gemini integration) and TPU infrastructure, while Anthropic leads on safety-focused Claude models that dominate enterprise coding and legal workflows. A Versus B compares them on model capability, distribution, and enterprise contract wins.",
      },
    ],
    "startups-saas": [
      {
        question: "How does A Versus B compare startups and SaaS companies?",
        answer:
          "Startup comparisons cover ARR (or latest funding round), growth rate, NPS, product breadth, team size, and market category leadership — with a verdict that contextualises competitive position and growth trajectory.",
      },
      {
        question: "What are the most popular startup and SaaS comparisons?",
        answer:
          "Top comparisons include Notion vs Coda, Vercel vs Netlify, Shopify vs BigCommerce, Stripe vs Adyen, and OpenAI vs Anthropic for AI platform comparisons.",
      },
      {
        question: "Is Stripe or Adyen better for a growing eCommerce business?",
        answer:
          "Stripe leads on developer experience, extensive API documentation, and ease of setup for SMBs. Adyen is better for enterprise merchants (>$1M GMV) seeking lower blended transaction rates, multi-currency settlement, and unified in-store + online payment infrastructure. A Versus B compares them on pricing at different GMV tiers, supported countries, and integration complexity.",
      },
    ],
    "finance-companies": [
      {
        question: "How does A Versus B compare financial companies?",
        answer:
          "Finance company comparisons cover assets under management (AUM), trading commission structure, account minimums, crypto support, interest rates on cash, international wire fees, and regulatory standing — with a verdict per investor type.",
      },
      {
        question: "What are the most popular financial company comparisons?",
        answer:
          "Top comparisons include Fidelity vs Vanguard vs Schwab for long-term investing, Robinhood vs Webull for active trading, Coinbase vs Binance for crypto, Wise vs Revolut for international transfers, and JPMorgan Chase vs Bank of America for consumer banking.",
      },
      {
        question: "Is Fidelity or Vanguard better for retirement investing?",
        answer:
          "Both are outstanding for long-term retirement investing with $0 commissions and extensive index fund libraries. Fidelity edges out on zero-expense-ratio index funds (FZROX, FZILX) and richer platform features. Vanguard leads on brand trust among index investing pioneers. A Versus B compares them on fund expense ratios, account types, research tools, and customer service.",
      },
    ],
    "retail-ecommerce": [
      {
        question: "How does A Versus B compare retail and eCommerce companies?",
        answer:
          "Retail comparisons evaluate gross merchandise volume, delivery speed (standard vs Prime/Walmart+), private label programme strength, return policy, third-party marketplace seller experience, and price competitiveness — with a verdict for shoppers and sellers.",
      },
      {
        question: "What are the most popular retail and eCommerce comparisons?",
        answer:
          "Top comparisons include Amazon vs Walmart, Etsy vs eBay for handmade and vintage, TEMU vs Shein, Costco vs Sam's Club, and Amazon vs Target for everyday grocery and household items.",
      },
      {
        question: "Is Amazon or Walmart better for online shopping?",
        answer:
          "Amazon leads on product selection (350M+ SKUs), Prime delivery speed, and third-party seller ecosystem. Walmart leads on grocery pricing, in-store pickup convenience, and same-day delivery in areas with Walmart stores. A Versus B compares them on delivery speed, price index, membership cost, and return experience.",
      },
    ],
    "food-beverage": [
      {
        question: "How does A Versus B compare food and beverage brands?",
        answer:
          "Food and beverage comparisons evaluate brand revenue and market share, product line breadth, nutritional profile (for health comparisons), taste test scores, pricing per unit, sustainability practices, and consumer loyalty index — with a verdict per category.",
      },
      {
        question: "What are the most popular food and beverage company comparisons?",
        answer:
          "Top comparisons include Coca-Cola vs Pepsi, Starbucks vs Dunkin', McDonald's vs Burger King, Chick-fil-A vs Popeyes, Chipotle vs Qdoba, and Domino's vs Pizza Hut.",
      },
      {
        question: "Is Starbucks or Dunkin' the better coffee chain?",
        answer:
          "Starbucks leads on menu variety, premium beverage innovation, and loyalty programme rewards depth. Dunkin' leads on price (average drink cost ~30–40% lower), speed of service, and breakfast food value. A Versus B compares them on drink price, mobile ordering UX, calorie ranges, and rewards programme earn rate.",
      },
    ],
  },

  // ── Entertainment ─────────────────────────────────────────────────────────
  entertainment: {
    "streaming-services": [
      {
        question: "How does A Versus B compare streaming services?",
        answer:
          "Streaming service comparisons evaluate content library size, exclusive originals quality (Emmy/Oscar nominations), video quality (4K, Dolby Vision, Atmos), simultaneous streams, download for offline, price per plan, and ad tier experience — with a verdict per viewer profile.",
      },
      {
        question: "What are the most popular streaming service comparisons?",
        answer:
          "Top comparisons include Netflix vs Disney+, HBO Max vs Netflix, Hulu vs Peacock, Apple TV+ vs Amazon Prime Video, and YouTube TV vs FuboTV for live TV streaming.",
      },
      {
        question: "Is Netflix or Disney+ worth the subscription in 2026?",
        answer:
          "Netflix leads on total library size, non-English originals (Money Heist, Squid Game), and documentary breadth. Disney+ leads on franchise depth (Marvel, Star Wars, Pixar, National Geographic) and family-safe content. A Versus B compares them on content library metrics, 4K catalogue size, price, and simultaneous screen limits.",
      },
    ],
    "music": [
      {
        question: "How does A Versus B compare music streaming services?",
        answer:
          "Music streaming comparisons cover catalogue size (tracks), audio quality (kbps and lossless availability), podcast library, algorithm quality for discovery, offline downloads per device, family plan cost, and artist royalty model — with a verdict for audiophiles, casual listeners, and podcast lovers.",
      },
      {
        question: "What are the most popular music streaming comparisons?",
        answer:
          "Top comparisons include Spotify vs Apple Music, Tidal vs Apple Music for lossless audio, Spotify vs YouTube Music, Amazon Music Unlimited vs Spotify, and Spotify Free vs premium tier for cost-conscious listeners.",
      },
      {
        question: "Is Spotify or Apple Music better for music discovery?",
        answer:
          "Spotify leads on algorithmic discovery (Discover Weekly, Daylist, AI DJ) and podcast integration. Apple Music leads on audio quality (Dolby Atmos Spatial Audio included free with subscription), iTunes Match, and Android experience parity. A Versus B compares them on catalogue size, lossless quality, offline limits, and family plan pricing.",
      },
    ],
    "gaming-entertainment": [
      {
        question: "How does A Versus B compare gaming platforms for entertainment?",
        answer:
          "Gaming entertainment comparisons evaluate game subscription library depth (Game Pass vs PS Plus), exclusive first-party titles, backward compatibility, game streaming (xCloud vs GeForce Now), VR support, and total cost of ownership — with a verdict for casual and core gamers.",
      },
      {
        question: "What are the most popular gaming entertainment comparisons?",
        answer:
          "Top comparisons include Xbox Game Pass vs PlayStation Plus, Nintendo Switch 2 vs PS5, Steam vs Epic Games Store, Twitch vs YouTube Gaming for content creators, and PC gaming vs console gaming for total cost analysis.",
      },
      {
        question: "Is Xbox Game Pass or PlayStation Plus better value?",
        answer:
          "Xbox Game Pass Ultimate (~$20/month) includes day-one first-party titles (Halo, Forza, Starfield) and xCloud streaming. PS Plus Extra/Premium includes a growing back catalogue but not day-one Sony first-party games. A Versus B compares them on included games per month, streaming quality, and total savings vs. buying titles individually.",
      },
    ],
    "social-media": [
      {
        question: "How does A Versus B compare social media platforms?",
        answer:
          "Social media comparisons cover monthly active users, content format strengths (short video, text, long-form), creator monetisation options, algorithm reach for non-followers, ad platform capabilities, and data privacy policy — with a verdict per content type and creator goal.",
      },
      {
        question: "What are the most popular social media comparisons?",
        answer:
          "Top comparisons include TikTok vs Instagram Reels, Twitter/X vs Threads vs Bluesky, LinkedIn vs Twitter for professional networking, YouTube vs TikTok for creator revenue, and Reddit vs Quora for community-driven Q&A.",
      },
      {
        question: "Is TikTok or Instagram Reels better for growing an audience?",
        answer:
          "TikTok's algorithm is more likely to distribute content to non-followers, making it the better growth platform for new creators. Instagram Reels benefits from an older, purchase-intent audience and deeper cross-posting integration with Facebook. A Versus B compares them on organic reach rate, monetisation thresholds, and average view duration.",
      },
    ],
    "movies-tv": [
      {
        question: "How does A Versus B compare movies and TV franchises?",
        answer:
          "Movie and TV comparisons cover box office revenue, critical (Rotten Tomatoes/Metacritic) and audience (CinemaScore) scores, franchise longevity, budget vs ROI, streaming performance, and cultural impact — with a verdict that weighs both commercial and artistic dimensions.",
      },
      {
        question: "What are the most popular movie and TV comparisons?",
        answer:
          "Top comparisons include Marvel vs DC cinematic universe, Breaking Bad vs Sopranos for greatest TV drama, Avatar vs Avengers for box office records, and anime comparisons like Naruto vs One Piece vs Dragon Ball Z.",
      },
      {
        question: "Is the Marvel or DC cinematic universe better?",
        answer:
          "MCU leads on box office revenue (>$33B cumulative), critical consistency, and interconnected storytelling across 30+ films and series. DCU leads on individual iconic films (The Dark Knight, Joker) but has faced more inconsistency. A Versus B compares them on average Rotten Tomatoes score, opening weekend revenue, and franchise future roadmap.",
      },
    ],
  },

  // ── Automotive ────────────────────────────────────────────────────────────
  automotive: {
    "electric-vehicles": [
      {
        question: "How does A Versus B compare electric vehicles?",
        answer:
          "EV comparisons cover EPA-rated range (miles), real-world range estimate, DC fast-charge speed (kW peak and 10–80% time), L2 charging rate, battery size (kWh), cargo space, NHTSA safety rating, MSRP, and 5-year total cost of ownership — with a verdict per range and budget tier.",
      },
      {
        question: "What are the most popular EV comparisons?",
        answer:
          "Top EV comparisons include Tesla Model Y vs Ford Mustang Mach-E, Tesla Model 3 vs BMW i4, Rivian R1T vs Tesla Cybertruck, Chevy Equinox EV vs Volkswagen ID.4, and Lucid Air vs Tesla Model S for long-range luxury EVs.",
      },
      {
        question: "Is the Tesla Model Y or Ford Mustang Mach-E the better EV SUV?",
        answer:
          "Tesla Model Y leads on Supercharger network access, over-the-air updates, Autopilot capability, and resale value. Ford Mustang Mach-E leads on NHTSA safety scores, interior quality, and standard BlueCruise hands-free driving. A Versus B compares them on real-world range, charging cost, ADAS features, and 5-year cost.",
      },
    ],
    "suvs-trucks": [
      {
        question: "How does A Versus B compare SUVs and trucks?",
        answer:
          "SUV and truck comparisons cover towing capacity (lbs), payload (lbs), cargo volume, seating, ground clearance, drivetrain options (4WD, AWD, 2WD), fuel economy, NHTSA/IIHS rating, and MSRP — with a verdict for families, off-roaders, and work truck buyers.",
      },
      {
        question: "What are the most popular SUV and truck comparisons?",
        answer:
          "Top comparisons include Ford F-150 vs Chevy Silverado, Toyota RAV4 vs Honda CR-V, Toyota 4Runner vs Jeep Wrangler, Ram 1500 vs Ford F-150 for pickup trucks, and Chevy Tahoe vs Ford Expedition for full-size family SUVs.",
      },
      {
        question: "Is the Toyota RAV4 or Honda CR-V the better compact SUV?",
        answer:
          "RAV4 leads on hybrid and PHEV availability, off-road-ready Adventure trim, and resale value. CR-V leads on interior space (best-in-class rear legroom), fuel economy in standard gas trim, and Honda's reliability track record. A Versus B compares them on cargo volume, hybrid powertrain fuel economy, and IIHS safety ratings.",
      },
    ],
    "sedans-coupes": [
      {
        question: "How does A Versus B compare sedans and coupes?",
        answer:
          "Sedan comparisons cover rear legroom, trunk volume, fuel economy, powertrain options, standard and available safety tech, infotainment screen size and responsiveness, and MSRP — with a verdict for commuters, families, and driving enthusiasts.",
      },
      {
        question: "What are the most popular sedan comparisons?",
        answer:
          "Top comparisons include Honda Accord vs Toyota Camry, Honda Civic vs Toyota Corolla, BMW 3 Series vs Mercedes C-Class, Hyundai Elantra vs Kia Forte, and Tesla Model 3 vs BMW 3 Series for electric vs ICE.",
      },
      {
        question: "Is the Honda Accord or Toyota Camry the better family sedan?",
        answer:
          "Both are excellent — the Honda Accord leads on sporty handling, turbocharged engine options, and tech features at equivalent trims. The Toyota Camry leads on hybrid efficiency (50+ MPG combined in hybrid form) and historically lower maintenance costs. A Versus B compares them on interior comfort, fuel economy, safety scores, and 5-year ownership cost.",
      },
    ],
    "luxury": [
      {
        question: "How does A Versus B compare luxury cars?",
        answer:
          "Luxury car comparisons evaluate interior material quality, powertrain performance (0–60 mph, horsepower), standard and optional ADAS, infotainment UX, ride quality, customisation options, and MSRP — with a verdict for buyers prioritising performance, comfort, or brand prestige.",
      },
      {
        question: "What are the most popular luxury car comparisons?",
        answer:
          "Top comparisons include BMW vs Mercedes vs Audi, Lexus vs BMW for reliability vs performance, Porsche Cayenne vs BMW X5, Range Rover vs Bentley Bentayga, and Mercedes S-Class vs BMW 7 Series for full-size luxury sedans.",
      },
      {
        question: "Is BMW or Mercedes better for a luxury sedan?",
        answer:
          "BMW leads on driving dynamics, chassis balance, and M Sport performance trims. Mercedes leads on interior luxury (MBUX, ambient lighting, air suspension), rear seat comfort, and brand prestige for business contexts. A Versus B compares the 3/5 Series vs C/E-Class on ride quality, tech features, maintenance costs, and resale value.",
      },
    ],
    "motorcycles": [
      {
        question: "How does A Versus B compare motorcycles?",
        answer:
          "Motorcycle comparisons cover engine displacement (cc), horsepower and torque, wet weight, seat height, fuel economy, ABS and traction control availability, and MSRP — with a verdict for beginners, touring riders, and sport riders.",
      },
      {
        question: "What are the most popular motorcycle comparisons?",
        answer:
          "Top comparisons include Harley-Davidson Sportster vs Honda Rebel, Ducati Panigale vs Kawasaki Ninja, Yamaha MT-09 vs KTM 890 Duke, Royal Enfield vs Honda CB300R for beginner bikes, and BMW R 1300 GS vs Honda Africa Twin for adventure touring.",
      },
      {
        question: "Is Harley-Davidson or Honda the better motorcycle brand?",
        answer:
          "Harley-Davidson leads on brand culture, V-twin sound character, and customisation aftermarket. Honda leads on reliability, fuel efficiency, breadth of model lineup (beginner to supersport), and lower cost of ownership. A Versus B compares them on engine options, reliability data, maintenance intervals, and resale value.",
      },
    ],
  },
};

export function getSubcategoryFaqs(categorySlug: string, subcategorySlug: string): CategoryFaq[] {
  return SUBCATEGORY_FAQS[categorySlug]?.[subcategorySlug] ?? [];
}
