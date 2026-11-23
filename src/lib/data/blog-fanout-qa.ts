// Fan-out Q&A + fact corrections for DB-backed blog posts (Nov 2026 AI Mode
// research). Same idea as compare-content-overrides.ts: the DB body is left
// unchanged; at render time a "Quick answers" section is inserted before the
// first H2 (AI Mode quotes from the top third of the page) and hand-checked
// corrections are applied. The same Q&A feeds the post's FAQPage JSON-LD via
// blog-schema-extras.ts, so markup always mirrors visible text.

import type { BlogFaq } from "@/lib/data/blog-schema-extras";

export interface BlogFanout {
  heading: string;
  faqs: BlogFaq[];
  /** Exact substring of the stored markdown → replacement. Skipped if absent. */
  corrections?: [string, string][];
}

export const IKEA_WAYFAIR_SLUG = "is-wayfair-furniture-better-than-ikea-honest-comparison";
export const CHASE_CAPITAL_ONE_SLUG = "is-chase-owned-by-capital-one-the-relationship-explained";
export const STREAMING_SPORTS_SLUG = "best-streaming-services-of-2026-top-picks-for-movies-tv-sports";

const STREAMING_CHART_OLD = `| Service | Price | Best For | Key Features |
|---------|-------|----------|----------------|
| Disney Plus | $7.99-$13.99 | Families | Disney, Marvel, Star Wars, originals |
| Netflix | $6.99-$22.99 | General audiences | Massive library, originals, global content |
| HBO Max | $9.99-$19.99 | Premium entertainment | HBO shows, Warner Bros., DC content |
| YouTube TV | $72.99+ | Live TV lovers | 100+ channels, cloud DVR, 4K |
| Sling TV | $45+ | Budget-conscious | Flexible packages, affordable |
| Fubo | $79.99+ | Sports fans | RSNs, sports focus, 4K |
| Peacock | $5.99-$11.99 | NBC fans | Sports, NBC shows, movies |`;

// Prices removed on purpose (Nov 2026 refresh): the old column was months out
// of date and plan prices change too often to hand-maintain here.
const STREAMING_CHART_NEW = `| Service | Best For | Key Features |
|---------|----------|----------------|
| Disney Plus | Families | Disney, Marvel, Star Wars, originals |
| Netflix | General audiences | Massive library, originals, global content |
| HBO Max | Premium entertainment | HBO shows, Warner Bros., DC content |
| YouTube TV | Live TV lovers | 100+ channels, cloud DVR, 4K |
| Sling TV | Budget-conscious | Flexible packages, lowest entry price of the big live TV services |
| Fubo | Sports fans | RSNs, sports focus, 4K |
| Peacock | NBC fans | Sports, NBC shows, movies |
| ESPN Select | ESPN fans | Live events, *30 for 30*, ESPN originals |

Plan prices change often and holiday deals run from late November, so check each service's own pricing page before you subscribe.`;

const ESPN_SECTION = `## Best ESPN+ Shows in 2026 (Now Called ESPN Select)

ESPN+ was renamed **ESPN Select** in August 2025, when ESPN launched its full streaming service. Since September 17, 2026, ESPN Select costs $13.99 a month or $139.99 a year. **ESPN Unlimited** ($31.99 a month) adds the ESPN TV networks and includes everything in Select.

The shows most worth watching on ESPN Select:

- ***30 for 30***: ESPN's award-winning sports documentary series
- ***E60***: long-form investigative sports journalism
- ***Peyton's Places***: Peyton Manning's tour through NFL history
- **Live events**: thousands of college games, plus UFC, NHL, MLB and international soccer`;

export const BLOG_FANOUT: Record<string, BlogFanout> = {
  // GSC Oct–Nov 2026: "is capital one part of chase" and close variants rank
  // 4–7. The stored post still called the Discover deal pending.
  [CHASE_CAPITAL_ONE_SLUG]: {
    heading: "Quick answers: Chase and Capital One",
    faqs: [
      {
        question: "Is Capital One part of Chase?",
        answer:
          "No. Capital One is an independent public company (NYSE: COF), and Chase belongs to JPMorgan Chase & Co. (NYSE: JPM). Neither owns any part of the other.",
      },
      {
        question: "Are Chase and Capital One the same company?",
        answer:
          "No. Chase and Capital One are separate, competing banks with different owners, headquarters and card programs.",
      },
      {
        question: "Who owns Discover now?",
        answer:
          "Capital One owns Discover. Capital One completed its acquisition of Discover Financial Services on May 18, 2025, which has no connection to Chase.",
      },
    ],
    corrections: [
      [
        "**Note:** As of 2024, Capital One has a pending acquisition of Discover Financial Services pending regulatory approval. Even if completed, this would make Capital One *larger* — it would not result in Capital One being acquired by or affiliated with Chase.",
        "**Note:** Capital One completed its acquisition of Discover Financial Services on May 18, 2025. That made Capital One larger and gave it the Discover card network, but it has no connection to Chase.",
      ],
      [
        "| **Assets (2025)** | ~$3.9 trillion | ~$480 billion |",
        "| **Assets (2026)** | ~$3.9 trillion | ~$680 billion (after buying Discover) |",
      ],
      [
        "It's now the 10th-largest US bank by assets and one of the top credit card issuers",
        "After buying Discover in 2025 it is one of the 10 largest US banks by assets and one of the top credit card issuers",
      ],
      [
        "| **Best rewards card** | Chase Sapphire Reserve (3x travel, 1x other) | Venture X (2x on everything) |",
        "| **Best rewards card** | Chase Sapphire Reserve (8x on Chase Travel, 4x flights and hotels booked direct, 3x dining) | Venture X (2x on everything) |",
      ],
      ["| **Annual fee** | $550 (Sapphire Reserve) | $395 (Venture X) |", "| **Annual fee** | $795 (Sapphire Reserve) | $395 (Venture X) |"],
      [
        "| **Savings APY** | ~0.01% standard | ~4.35% (360 Performance Savings, online) |",
        "| **Savings APY** | ~0.01% standard | ~3.20% (360 Performance Savings, Nov 2026, variable) |",
      ],
      [
        "Chase (JPMorgan Chase & Co.) is significantly larger — approximately $3.9 trillion in assets vs. Capital One's ~$480 billion.",
        "Chase (JPMorgan Chase & Co.) is much larger: about $3.9 trillion in assets vs. about $680 billion for Capital One, even after it bought Discover.",
      ],
      [
        "Capital One is its own publicly traded company, the 10th-largest US bank by assets.",
        "Capital One is its own publicly traded company and, since buying Discover in 2025, one of the 10 largest US banks by assets.",
      ],
    ],
  },

  // GSC Oct–Nov 2026: "best espn plus shows 2026" had ~4k impressions at
  // position 7 with 0 clicks, and the page never named a show. Also fixes the
  // Max → HBO Max name, ESPN+ → ESPN Select, and drops the stale price column.
  [STREAMING_SPORTS_SLUG]: {
    heading: "Quick answers: streaming in 2026",
    faqs: [
      {
        question: "What are the best ESPN+ shows in 2026?",
        answer:
          "The best ESPN+ shows are 30 for 30, E60 and Peyton's Places, plus live college sports, UFC and NHL games. ESPN+ is now called ESPN Select.",
      },
      {
        question: "Is ESPN+ still available?",
        answer:
          "Yes, under a new name. ESPN+ became ESPN Select in August 2025 and costs $13.99 a month or $139.99 a year since September 17, 2026.",
      },
      {
        question: "What is the best streaming service for sports in 2026?",
        answer:
          "Fubo and YouTube TV are the best all-round sports picks because they carry the major sports networks live. ESPN Select is the cheapest way to get ESPN originals and many live games.",
      },
    ],
    corrections: [
      ["- **Bundle Options**: Package Disney Plus with Hulu and ESPN Plus for maximum value", "- **Bundle Options**: Package Disney Plus with Hulu and ESPN Select (formerly ESPN+) for maximum value"],
      ["**HBO Max** (part of Max) brings premium entertainment including:", "**HBO Max** (renamed back from Max in 2025) brings premium entertainment including:"],
      ["- **Max Originals**: Quality original programming", "- **HBO Max Originals**: Quality original programming"],
      ["Max is perfect for premium entertainment seekers", "HBO Max is perfect for premium entertainment seekers"],
      ["- **Affordable Pricing**: Starting as low as $45/month", "- **Affordable Pricing**: Usually the cheapest of the big live TV services"],
      [
        "- **ESPN Plus**: Live sports, original shows, and exclusive events",
        "- **ESPN Select** (formerly ESPN+): Live sports, *30 for 30* and other ESPN originals",
      ],
      [
        "- **Peacock**: Live sports from NBC networks\n\n## Streaming Service Comparison Chart",
        `- **Peacock**: Live sports from NBC networks\n\n${ESPN_SECTION}\n\n## Streaming Service Comparison Chart`,
      ],
      [STREAMING_CHART_OLD, STREAMING_CHART_NEW],
      ["- Bundled packages (like Disney Plus with Hulu and ESPN Plus)", "- Bundled packages (like Disney Plus with Hulu and ESPN Select)"],
      ["- Disney Bundle: Disney Plus, Hulu, and ESPN Plus", "- Disney Bundle: Disney Plus, Hulu, and ESPN Select"],
      ["- Max + Discovery+: Premium Warner Bros. and Discovery content", "- Disney Plus, Hulu and HBO Max: three services in one bundle"],
    ],
  },

  // GSC Aug–Nov 2026: 146 impressions from 10+-word prompts, avg position ~8.
  [IKEA_WAYFAIR_SLUG]: {
    heading: "Quick answers: IKEA vs Wayfair",
    faqs: [
      {
        question: "How does IKEA compare with Wayfair for bookcases and storage?",
        answer:
          "IKEA is the safer pick for bookcases and storage. Lines like BILLY and KALLAX come in standard sizes and stay in production for years, so you can add matching pieces later; Wayfair quality and availability vary by seller.",
      },
      {
        question: "IKEA or Wayfair: which has the better online shopping experience?",
        answer:
          "Wayfair has the bigger online catalog and more filters. IKEA's site is simpler, shows in-store stock, and sells one consistent range.",
      },
      {
        question: "How does IKEA compare to Wayfair on price and delivery?",
        answer:
          "IKEA is usually cheaper for the same type of piece, and you can carry flat-pack items home yourself. Wayfair often ships free over a minimum order, but large items can cost more.",
      },
      {
        question: "How do IKEA mattresses compare with Wayfair for a mattress that will last 10 years?",
        answer:
          "IKEA mattresses carry a 10-year limited warranty from IKEA itself. On Wayfair the warranty depends on the mattress brand, so check each listing before you buy.",
      },
      {
        question: "How do IKEA sofas compare with Wayfair for a rental?",
        answer:
          "IKEA sofas suit renters: many have removable, washable covers, come apart for moving, and are easy to resell. Wayfair has more styles, but how well a sofa survives a move and holds resale value varies by brand.",
      },
      {
        question: "How does IKEA compare to Wayfair on delivery and returns?",
        answer:
          "IKEA US accepts unopened items for 365 days and opened items for 180 days. Wayfair's window is usually 30 days from delivery, and return shipping is usually deducted from the refund.",
      },
      {
        question: "How do IKEA pick-up points compare with Wayfair if I don't have a car?",
        answer:
          "IKEA offers local pick-up points at FedEx locations as well as home delivery, which starts at about $19 for small orders. Wayfair ships everything to your door.",
      },
    ],
    corrections: [
      [
        "| **Return policy** | 365-day return, must return to store | 30-day return, free returns on most items |",
        "| **Return policy** | 365 days unopened, 180 days opened (US) | 30 days from delivery; return shipping usually deducted from the refund |",
      ],
      [
        "IKEA's 365-day return policy is genuinely excellent. If you buy something and hate it after 6 months, you can still return it (in original packaging, with receipt).",
        "IKEA's return policy is genuinely excellent: in the US, 365 days for unopened products and 180 days for opened ones, with proof of purchase.",
      ],
    ],
  },
};

export function fanoutMarkdown(f: BlogFanout): string {
  const body = f.faqs.map((q) => `### ${q.question}\n\n${q.answer}`).join("\n\n");
  return `## ${f.heading}\n\n${body}\n\n`;
}

/** Applies corrections and inserts the Quick answers section before the first H2. */
export function applyBlogFanout(slug: string, content: string): string {
  const f = BLOG_FANOUT[slug];
  if (!f || !content) return content;
  let md = content;
  // Skip a correction once its replacement is present: some replacements
  // contain their own source text ("Max …" → "HBO Max …").
  for (const [from, to] of f.corrections ?? []) if (!md.includes(to)) md = md.split(from).join(to);
  if (md.includes(`## ${f.heading}`)) return md;
  const block = fanoutMarkdown(f);
  const m = /^## /m.exec(md);
  return m ? md.slice(0, m.index) + block + md.slice(m.index) : `${md.trimEnd()}\n\n${block}`;
}
