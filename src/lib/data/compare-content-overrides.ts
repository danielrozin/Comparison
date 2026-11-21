// Slug-keyed content corrections + fan-out Q&A for DB-backed /compare pages
// (Nov 2026 AI Mode research).
//
// Two jobs:
// 1. Correct stored facts that are wrong (the DB row is left unchanged; the
//    override is applied in getStaticProps, so the table, takeaways, FAQ block
//    and FAQPage JSON-LD all read the corrected value).
// 2. Prepend "fan-out" Q&A: short, self-contained answers to the long,
//    conversational queries GSC shows this page getting impressions for. Each
//    answer names both products and opens with a sentence of ≤160 chars, the
//    shape AI Mode quotes.
//
// Every value here was checked by hand. Prices are approximate on purpose
// ("about"): the sources are third-party price trackers, not the publishers'
// own pricing pages.

import type { ComparisonPageData as Comparison, FAQData, KeyDifference } from "@/types";

interface AttributeValueOverride {
  valueText: string;
  valueNumber?: number | null;
  winner?: boolean;
}

export interface CompareContentOverride {
  /** keyDifferences patched by label. */
  keyDifferences?: Record<string, Partial<Pick<KeyDifference, "entityAValue" | "entityBValue" | "winner">>>;
  /** attribute slug → entity name → value. */
  attributes?: Record<string, Record<string, AttributeValueOverride>>;
  /** entity name → old pro/con text → new text. */
  prosCons?: Record<string, Record<string, string>>;
  /** Existing FAQ answers replaced by exact question text. */
  faqAnswers?: Record<string, string>;
  /** Fan-out Q&A shown first in the FAQ block (and FAQPage JSON-LD). */
  fanoutFaqs?: FAQData[];
}

export const COMPARE_CONTENT_OVERRIDES: Record<string, CompareContentOverride> = {
  // GSC Aug–Nov 2026: 264 impressions from 10+-word prompts, avg position ~5.
  // The stored row treated the $24K+ Terminal as Bloomberg's only option and
  // said there was no personal or student plan — Bloomberg.com sells both.
  "bloomberg-vs-the-wall-street-journal": {
    keyDifferences: {
      "Subscription Cost (Digital)": {
        entityAValue: "Intro offers about $1–2/week, then about $45 every 4 weeks",
        entityBValue: "Bloomberg.com about $40/month; Terminal $24K+/year (institutions)",
        winner: "tie",
      },
      "Best For Students": {
        entityBValue: "Student plan available (about $10/month)",
        winner: "tie",
      },
      "Free Tier Availability": {
        entityBValue: "A few free articles; most stories are paywalled",
      },
    },
    attributes: {
      "digital-subscription-price": {
        "The Wall Street Journal": { valueText: "About $45 / 4 weeks (after intro offer)", valueNumber: 45, winner: false },
        Bloomberg: { valueText: "About $40 / month (Bloomberg.com)", valueNumber: 40, winner: false },
      },
    },
    prosCons: {
      "The Wall Street Journal": {
        "Affordable digital subscription ($39/month)": "Frequent intro offers (about $1–2/week)",
      },
      Bloomberg: {
        "Excellent free website and mobile app access": "Bloomberg.com subscription for individuals (about $40/month)",
      },
    },
    faqAnswers: {
      "How much does Bloomberg cost vs WSJ?":
        "Bloomberg.com costs about $40 a month, and the WSJ about $45 every 4 weeks after an intro offer of roughly $1–2 a week. The $24,000+ a year Bloomberg Terminal is a separate professional product.",
      "Is Bloomberg or WSJ better for investors?":
        "Bloomberg is better for investors who follow markets daily and need fast data and alerts; the WSJ is better for individual investors who want analysis and context. Professionals who need the Terminal pay $24,000+ a year for it.",
      "Can you get Bloomberg or WSJ for free?":
        "Neither is fully free: both show a small number of free articles and paywall the rest. Both sell discounted intro offers, and Bloomberg also has a student plan of about $10 a month.",
    },
    fanoutFaqs: [
      {
        question: "How does The Wall Street Journal compare to Bloomberg in business reporting?",
        answer:
          "The Wall Street Journal covers business alongside general news, politics and investigations. Bloomberg focuses more narrowly on markets, companies and economic data, and reports it faster.",
      },
      {
        question: "Which is the better financial news subscription, The Wall Street Journal or Bloomberg?",
        answer:
          "For most readers The Wall Street Journal is better value: intro offers run about $1–2 a week, then about $45 every 4 weeks. Bloomberg.com costs about $40 a month and suits readers who follow markets daily.",
      },
      {
        question: "Is The Wall Street Journal or Bloomberg stronger for workplace and career reporting?",
        answer:
          "The Wall Street Journal is stronger on workplace, management and career coverage. Bloomberg is stronger on pure market coverage such as stocks, bonds, currencies and commodities.",
      },
      {
        question: "Is it worth paying for news tailored to professional investors?",
        answer:
          "Paying for investor-focused news is worth it if you trade or manage money and need fast market news. Bloomberg.com covers that for individuals, while the $24,000+ a year Bloomberg Terminal is built for institutions.",
      },
      {
        question: "Which is the better stock market news site, The Wall Street Journal or Bloomberg?",
        answer:
          "Bloomberg is better for real-time stock market news and data. The Wall Street Journal is better at explaining what market moves mean for ordinary investors.",
      },
    ],
  },
};

function patchList(list: string[], map: Record<string, string>): string[] {
  return (list ?? []).map((item) => map[item] ?? item);
}

/** Returns a corrected copy of the comparison; the input is not mutated. */
export function applyCompareContentOverride<T extends Comparison>(slug: string, comparison: T): T {
  const o = COMPARE_CONTENT_OVERRIDES[slug];
  if (!o) return comparison;

  const idByName = new Map(comparison.entities.map((e) => [e.name, e.id]));

  const keyDifferences = (comparison.keyDifferences ?? []).map((d) =>
    o.keyDifferences?.[d.label] ? { ...d, ...o.keyDifferences[d.label] } : d,
  );

  const attributes = (comparison.attributes ?? []).map((attr) => {
    const byName = o.attributes?.[attr.slug];
    if (!byName) return attr;
    return {
      ...attr,
      values: attr.values.map((v) => {
        const name = [...idByName.entries()].find(([, id]) => id === v.entityId)?.[0];
        const patch = name ? byName[name] : undefined;
        return patch ? { ...v, ...patch } : v;
      }),
    };
  });

  const entities = comparison.entities.map((e) => {
    const map = o.prosCons?.[e.name];
    if (!map) return e;
    return { ...e, pros: patchList(e.pros, map), cons: patchList(e.cons, map) };
  });

  const existing = (comparison.faqs ?? []).map((f) =>
    o.faqAnswers?.[f.question] ? { ...f, answer: o.faqAnswers[f.question] } : f,
  );
  const fanout = o.fanoutFaqs ?? [];
  const fanoutQs = new Set(fanout.map((f) => f.question.toLowerCase()));
  const faqs = [...fanout, ...existing.filter((f) => !fanoutQs.has(f.question.toLowerCase()))];

  return { ...comparison, keyDifferences, attributes, entities, faqs };
}
