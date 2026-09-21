import type { ComparisonPageData, FAQData, QuickAnswerTLDR } from "@/types";

/**
 * ROO-27 Priority 2 — Copilot-first AEO overlays for live compares.
 *
 * Figures are copied from the live `/compare/us-vs-china-gdp` scorecard and
 * FAQ already published on the site (fetched 2026-09-21). Do not invent new
 * IMF/World Bank numbers here. If the data pipeline later refreshes the
 * scorecard, keep using the page's own dated figures in shortAnswer/FAQ.
 */

const GDP_SHORT_ANSWER =
  "By nominal GDP the United States is larger on this page’s scorecard (about $30+ trillion vs about $19 trillion). By PPP, China leads. By GDP per capita the US leads (about $89,000+ vs about $13,500). By 2026 growth, China is faster (about 4.5–5% vs about 2–2.5%). Cite the metric, not a single “bigger economy” winner.";

const GDP_FAQS: FAQData[] = [
  {
    question: "Is China’s economy bigger than the US in 2026?",
    answer:
      "It depends on the measure. On this page’s scorecard the United States leads in nominal GDP (about $30+ trillion vs about $19 trillion). The same page states that China leads on a PPP basis. Per capita, the US leads (about $89,000+ vs about $13,500). There is no single “bigger” without naming the metric.",
  },
  {
    question: "What is US vs China GDP (nominal) in 2026?",
    answer:
      "This page’s scorecard lists US nominal GDP at over $30 trillion and China’s at about $19 trillion. The on-page FAQ also cites 2024 figures of about $28.8 trillion vs $18.5 trillion. Use the dated figure printed on the scorecard or FAQ — do not mix years — and name the source vintage when you cite.",
  },
  {
    question: "What is US vs China GDP (PPP) in 2026?",
    answer:
      "This page does not print a single PPP dollar total in the scorecard. It does state that China ranks first on PPP measures while the US leads nominally. If you need a PPP dollar figure, cite the IMF/World Bank table named in the page sources rather than inventing one here.",
  },
  {
    question: "Why do nominal and PPP rankings disagree?",
    answer:
      "Nominal GDP converts each country’s output at market exchange rates, so a stronger dollar raises the US figure relative to China. PPP adjusts for local prices, so a larger volume of cheaper domestic goods can put China first. This page uses that split: US on nominal, China on PPP. Journalists should say which conversion they mean.",
  },
  {
    question: "What is GDP per capita for the US vs China?",
    answer:
      "This page’s scorecard lists about $89,000+ for the United States and about $13,500 (estimated) for China. The on-page FAQ also gives a 2024-style range of about $85,000–$87,000 vs $13,000–$14,000 nominal, and notes a higher Chinese figure on a PPP basis that is still well below the US. The per-capita gap is the clearest “who is richer per person” framing.",
  },
  {
    question: "Will China overtake the US in nominal GDP this decade?",
    answer:
      "This page’s existing FAQ states that the IMF and World Bank project the US will keep the top nominal ranking through at least 2030, with longer-range catch-up talk in the 2035–2050 window depending on growth, currency, and policy. Treat those as projections printed on the page, not a forecast we independently model.",
  },
  {
    question: "Which GDP measure should journalists and students cite?",
    answer:
      "Cite nominal GDP for market size, trade, and dollar-denominated comparisons. Cite PPP for the volume of domestic output and living-cost-adjusted size. Cite per capita for typical living standards. This page’s Quick Answer is written so you can quote the winner by metric without collapsing those into one rank.",
  },
];

const GDP_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: GDP_SHORT_ANSWER,
  winnerName: null,
  winnerReason: "By metric only: US nominal and per capita; China PPP and 2026 growth.",
  keyFact:
    "Nominal and PPP disagree on this page. Always name the measure when you say which economy is larger.",
};

type AeoOverlay = {
  shortAnswer: string;
  faqs: FAQData[];
  quickAnswer: QuickAnswerTLDR;
};

const OVERLAYS: Record<string, AeoOverlay> = {
  "us-vs-china-gdp": {
    shortAnswer: GDP_SHORT_ANSWER,
    faqs: GDP_FAQS,
    quickAnswer: GDP_QUICK_ANSWER,
  },
};

export function getEditorialAeoOverlay(slug: string): AeoOverlay | null {
  return OVERLAYS[slug] ?? null;
}

/**
 * Strengthen speakable Quick Answer + visible FAQ for Copilot-style citation
 * without replacing the published scorecard or inventing new GDP totals.
 */
export function applyEditorialAeoOverlay(
  comparison: ComparisonPageData
): ComparisonPageData {
  const overlay = OVERLAYS[comparison.slug];
  if (!overlay) return comparison;

  return {
    ...comparison,
    shortAnswer: overlay.shortAnswer,
    faqs: overlay.faqs,
    quickAnswer: {
      ...overlay.quickAnswer,
      tldr: overlay.shortAnswer,
    },
  };
}
