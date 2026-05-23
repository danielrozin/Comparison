export type HubFAQ = { q: string; a: string };

export type HubEntry = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  comparisonSlugs: string[];
  faqs: HubFAQ[];
  categoryAnchor: string | null;
};

export const HUB_CONFIG: Record<string, HubEntry> = {
  vpn: {
    slug: "vpn",
    title: "VPN Comparison Hub: NordVPN, ExpressVPN, Surfshark & More Compared (2026)",
    description:
      "Compare top VPNs side-by-side: speed, privacy, streaming unlocks, server count, and price. Updated for 2026 with verified test data on NordVPN, ExpressVPN, Surfshark, ProtonVPN, Mullvad and more.",
    h1: "VPN Comparison Hub (2026)",
    intro:
      "Choosing a VPN in 2026 means weighing five things at once: connection speed, no-logs verification, streaming unlocks (Netflix, BBC iPlayer, Disney+), server-country coverage, and dollars-per-month after the introductory year. The comparisons below put each major VPN side-by-side on those exact axes, with verified speed-test data and audit dates so you can pick the one that fits your specific use case — heavy streaming, privacy-first browsing, or a budget setup for occasional travel. Start with the top three head-to-heads if you're cross-shopping a household plan, or jump to the FAQ at the bottom for quick answers on legality, kill switches, and split tunneling.",
    comparisonSlugs: [
      "nordvpn-vs-surfshark",
      "expressvpn-vs-nordvpn",
      "protonvpn-vs-mullvad",
    ],
    faqs: [
      {
        q: "What's the most important factor when comparing VPNs in 2026?",
        a: "An independently audited no-logs policy is non-negotiable. After that, prioritize the use case: streaming households need confirmed Netflix/BBC unlocks; remote workers need wide server-country coverage; budget users need transparent renewal pricing (the discounted first-year price often triples on renewal). Connection speed is now table-stakes for top-tier providers and is rarely the deciding factor.",
      },
      {
        q: "Are NordVPN, ExpressVPN, and Surfshark really different?",
        a: "Yes — meaningfully. NordVPN leads on speed (NordLynx/WireGuard) and feature breadth. ExpressVPN has the cleanest UX and the strongest streaming track record, at a premium price. Surfshark is the best-value option with unlimited simultaneous connections, suiting larger households. The head-to-head pages compare them on identical test conditions.",
      },
      {
        q: "Is ProtonVPN better than Mullvad for privacy?",
        a: "Both are privacy-first, but they optimize for different things. Mullvad takes anonymous accounts (no email required, cash-payable) and runs lean on features. ProtonVPN integrates with the broader Proton ecosystem (Mail, Drive) and offers a free tier. For maximum legal-anonymity defense, Mullvad has the edge; for general daily use with strong privacy, ProtonVPN is more flexible.",
      },
      {
        q: "Do VPNs really hide my activity from my ISP?",
        a: "Yes — your ISP sees only encrypted traffic to the VPN server, not the destination websites. They can still see that you're using a VPN. For activities where even VPN-usage visibility matters (some workplaces, restrictive networks), look for VPNs offering obfuscated/stealth servers — covered in each comparison's privacy section.",
      },
      {
        q: "How often should I re-check my VPN comparison?",
        a: "Annually at minimum, and every time your household's needs change (new streaming service, new country added to your travel itinerary). VPN providers update their server networks monthly and run promotional pricing seasonally — the comparisons on this hub are refreshed quarterly with fresh test data and current renewal pricing.",
      },
    ],
    categoryAnchor: "software/vpn-security",
  },

  "project-management": {
    slug: "project-management",
    title:
      "Project Management Software Comparison: Notion, Asana, ClickUp, Monday & More (2026)",
    description:
      "Compare top project management tools side-by-side: pricing, integrations, workflow flexibility, and team-size fit. Side-by-side pages on Notion, Obsidian, Asana, Monday, ClickUp, Jira, Figma and Canva.",
    h1: "Project Management Software Comparison Hub (2026)",
    intro:
      "The right project management tool depends on three variables: how your team thinks (lists vs boards vs docs), how big your team is (5 vs 50 vs 500), and how much you're willing to pay per seat after the free tier runs out. Notion and Obsidian both flex on flexibility, Monday and Asana win on team coordination at scale, ClickUp and Jira lean engineering-heavy, and Figma and Canva have quietly become collaboration tools in their own right. The comparisons below put each pair head-to-head on pricing, learning curve, integrations, and workflow patterns — pick the comparison that matches the two tools you're already cross-shopping, or scan the FAQ for category-level decisions like \"Notion vs traditional PM\" and \"free tier limits in 2026.\"",
    comparisonSlugs: [
      "notion-vs-obsidian",
      "monday-vs-asana",
      "clickup-vs-jira",
      "figma-vs-canva",
    ],
    faqs: [
      {
        q: "What's the best project management software for a small team in 2026?",
        a: "For teams under 10 with mixed roles (eng + design + ops), Notion strikes the best balance of flexibility, free-tier generosity, and learning curve. Engineering-heavy teams should default to Linear or Jira; design-heavy teams to Figma's project features or ClickUp. The Notion vs Obsidian comparison is the right starting point if you also need a knowledge base.",
      },
      {
        q: "Notion vs Obsidian — which is better for projects?",
        a: "Notion wins on multi-player projects: real-time collaboration, databases, and team permissions are first-class. Obsidian wins on personal knowledge management and offline-first workflows — its plugins make it more powerful for solo deep work. Use Notion if more than one person edits the same project; use Obsidian if you're optimizing for individual thinking.",
      },
      {
        q: "Is ClickUp really better than Jira?",
        a: "It depends on the workload. Jira is purpose-built for engineering ticketing with deep agile reporting and Atlassian-stack integrations — it's hard to beat for sprint-heavy teams. ClickUp is broader: it covers PM, docs, goals, and chat in one workspace, which appeals to non-engineering teams. The comparison page breaks down where each one's reporting and automation surface area diverges.",
      },
      {
        q: "Are Figma and Canva project management tools?",
        a: "Increasingly, yes. Figma's project organization, dev-mode handoff, and Figjam whiteboarding turn it into a design-team workflow tool. Canva's brand-kit and team templates, plus the addition of AI-assisted scheduling, push it from \"design tool\" toward marketing-team coordination. Neither replaces a true PM tool for engineering, but for cross-functional creative teams the Figma vs Canva comparison is now a real decision.",
      },
      {
        q: "Should I switch project management tools mid-project?",
        a: "Generally no — the switching cost (data migration, team retraining, integration rebuilds) almost always exceeds the marginal productivity gain. The exception is when your current tool's pricing scales unfavorably as you grow (common with per-seat tools). The individual comparison pages have a \"migration friction\" section calling out which tool's exports are clean and which lock you in.",
      },
    ],
    categoryAnchor: "software/productivity",
  },

  "phone-laptop": {
    slug: "phone-laptop",
    title:
      "Phone & Laptop Comparison Hub: iPhone, Samsung, Pixel, MacBook & More (2026)",
    description:
      "Side-by-side phone and laptop comparisons with verified specs and 2026 pricing. Cross-shop iPhone 16 Pro vs Galaxy S25 Ultra, MacBook Air vs Dell XPS, and more — pick the right device, not just the popular one.",
    h1: "Phone & Laptop Comparison Hub (2026)",
    intro:
      "Phones and laptops are the two highest-stakes consumer-tech buys most people make in a year — and both are dominated by a handful of head-to-head decisions: iPhone vs Samsung Galaxy at the top end, Pixel vs the rest in the value tier, and MacBook vs Windows ultrabook in laptops. The comparisons below put the actual flagships side-by-side on the things that decide a purchase: chipset performance, camera output (with sample shots), battery life under real workloads, and 2026 retail pricing. Cross-shopping iPhone 16 Pro and Galaxy S25 Ultra is the most-searched device decision of the year — start there if you haven't picked an OS, or jump to the laptop comparisons if you've already locked your phone choice.",
    comparisonSlugs: [
      "iphone-16-pro-vs-samsung-galaxy-s25-ultra",
      "iphone-17-vs-pixel-10",
      "galaxy-s26-vs-iphone-17",
      "macbook-air-vs-dell-xps",
      "iphone-16-pro-vs-iphone-16-pro-max",
      "samsung-galaxy-s25-ultra-vs-galaxy-s25-plus",
    ],
    faqs: [
      {
        q: "iPhone 16 Pro vs Galaxy S25 Ultra — which should I buy in 2026?",
        a: "Galaxy S25 Ultra wins on hardware-spec-sheet (200MP camera, S Pen, more RAM); iPhone 16 Pro wins on software polish, ecosystem lock-in, and resale value. If you're already deep in iMessage / FaceTime / AirPods, switching costs probably outweigh the spec gap. If you're cross-shopping fresh, the head-to-head comparison page breaks down the camera output and battery results from a same-day shoot.",
      },
      {
        q: "Is the Pixel 10 actually competitive with iPhone 17 in 2026?",
        a: "Yes — and Google's pricing pressure is forcing Apple to defend the mid-tier. Pixel 10 leads on AI-assisted features (Magic Editor, real-time translation, on-device Gemini) and pure Android experience. iPhone 17 still leads on app-store quality, tighter hardware-software integration, and long-term iOS support. The iPhone 17 vs Pixel 10 comparison covers both.",
      },
      {
        q: "Do I need the Pro Max / Ultra model?",
        a: "Usually no. The Pro Max and Ultra trims are battery + camera-zoom upgrades over the standard Pro / S25+ — meaningful only if you photograph distant subjects (sports, wildlife, concerts) or run heavy battery loads (gaming, video shoots). For 90% of buyers, the standard Pro size delivers the same software and chipset for $200-300 less. The intra-line comparisons (iPhone 16 Pro vs Pro Max, S25 Ultra vs S25+) quantify what you actually gain.",
      },
      {
        q: "MacBook Air or Dell XPS for general work in 2026?",
        a: "MacBook Air M4 has the better battery life, silent fanless operation, and macOS reliability. Dell XPS 15 has the higher peak performance for compute-heavy tasks and a wider port selection. Cross-platform users (people who need Windows for one specific tool) should pick XPS; everyone else, MacBook Air. The comparison page has same-task benchmarks for both.",
      },
      {
        q: "How often should I refresh phone vs laptop comparisons?",
        a: "Phone comparisons get stale fast — refresh quarterly because firmware updates, AI feature rollouts, and price drops shift verdicts. Laptop comparisons hold longer (annual refresh is fine) because hardware cycles are slower. The dates in each comparison's TL;DR table show last verified — anything older than 6 months in the phone cluster is being prioritized for refresh.",
      },
    ],
    categoryAnchor: null,
  },
};
