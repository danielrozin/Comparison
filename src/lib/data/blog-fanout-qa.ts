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

export const BLOG_FANOUT: Record<string, BlogFanout> = {
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
  for (const [from, to] of f.corrections ?? []) md = md.split(from).join(to);
  if (md.includes(`## ${f.heading}`)) return md;
  const block = fanoutMarkdown(f);
  const m = /^## /m.exec(md);
  return m ? md.slice(0, m.index) + block + md.slice(m.index) : `${md.trimEnd()}\n\n${block}`;
}
