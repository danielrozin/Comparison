import type { ComparisonPageData, FAQData, QuickAnswerTLDR } from "@/types";

/**
 * Copilot-first AEO overlays for live compares (ROO-27 GDP pattern).
 *
 * GDP figures come from the live `/compare/us-vs-china-gdp` scorecard/FAQ
 * (fetched 2026-09-21). Japan vs China figures come only from in-repo
 * `mock-data.ts` and `faq-expansion.ts` — do not invent IMF/World Bank
 * totals (including PPP GDP). Messi vs Ronaldo figures come only from
 * in-repo `mock-data.ts` — never invent Ballon d'Or or goal totals.
 * PS5 vs Xbox Series X figures come from the mock `getMockComparison`
 * actually returns: `mock-data-extra.ts` overwrites the same slug in
 * `mock-data.ts`, and the prod short-answer fixture matches that extra
 * text. Printed there (plus merged `faq-expansion.ts`): GPU 12 vs 10.28
 * TFLOPS, SSD 5.5 vs 2.4 GB/s, price $499 tie, qualitative exclusives and
 * backward compatibility, and the named franchises in the FAQ. The
 * shadowed base row’s 825GB/1TB, 50M+/~21M, and Game Pass $15/400+ are
 * not on that scorecard. 4K/120Hz is not printed. Do not use the remotion
 * 12.15 TFLOPS outlier. If a stat is not on that scorecard, say unknown.
 * If the pipeline later refreshes a scorecard, keep using that page’s own
 * printed figures in shortAnswer/FAQ.
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

const JAPAN_CHINA_SHORT_ANSWER =
  "China is larger on this page’s scorecard for total GDP (about $17.7 trillion vs about $4.2 trillion), population (about 1.4 billion vs about 125 million), land area (about 9.6 million km² vs 377,975 km²), and active military personnel (about 2.0 million vs 247,000). Japan leads GDP per capita (about $33,800 vs about $12,500), life expectancy (84.6 vs 78.2 years), and HDI rank (#19 vs #75). Cite the metric; this page does not print a PPP GDP total.";

const JAPAN_CHINA_FAQS: FAQData[] = [
  {
    question: "Is China’s economy bigger than Japan’s?",
    answer:
      "On total GDP, yes. This page’s scorecard lists China’s economy at about $17.7 trillion versus Japan’s about $4.2 trillion, and describes China as the world’s second-largest economy and Japan as the third-largest. Japan still leads GDP per capita (about $33,800 vs about $12,500). There is no single “bigger economy” without naming the metric.",
  },
  {
    question: "What is Japan vs China GDP?",
    answer:
      "This page’s scorecard and FAQ print total GDP of about $4.2 trillion for Japan and about $17.7 trillion for China. Use those printed totals when you cite this page. Do not mix in other years or sources unless you name them.",
  },
  {
    question: "What is Japan vs China GDP (PPP)?",
    answer:
      "Unknown on this page. The in-repo scorecard and FAQ do not print a PPP dollar total for Japan or China. Cite the printed total GDP ($17.7 trillion vs $4.2 trillion) and per capita ($33,800 vs $12,500) instead of inventing a PPP figure.",
  },
  {
    question: "What is GDP per capita for Japan vs China?",
    answer:
      "This page’s scorecard lists about $33,800 for Japan and about $12,500 for China. That per-person gap is the clearest “who is richer per resident” framing even though China’s total GDP is larger.",
  },
  {
    question: "Which country is larger in land area and population?",
    answer:
      "China is larger on both. Land area is about 9.6 million km² versus Japan’s 377,975 km² (China 3rd or 4th largest country; Japan ranks 62nd). Population is about 1.4 billion versus about 125 million.",
  },
  {
    question: "Which country has a stronger military?",
    answer:
      "China has more active personnel on this page’s scorecard (about 2.0 million vs Japan’s 247,000). The same FAQ states China has a larger defense budget and nuclear weapons capability. A dollar defense-budget total is unknown here — do not invent one.",
  },
  {
    question: "Which country has a higher quality of life, and which is safer to visit?",
    answer:
      "Japan leads the printed quality-of-life stats: life expectancy 84.6 vs 78.2 years, HDI rank #19 vs #75. Japan is described as one of the safest countries with extremely low crime rates; China is generally safe for tourists but has higher property crime and more complex travel logistics. Numeric crime-rate figures are unknown on this page.",
  },
];

const JAPAN_CHINA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: JAPAN_CHINA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: China total GDP, population, land area, and military size; Japan per capita, life expectancy, and HDI.",
  keyFact:
    "Total GDP and GDP per capita disagree on this page. Always name the measure when you say which country is “ahead.”",
};

// Scorecard figures from `mock-data.ts` `messi-vs-ronaldo` only:
// Ballon d'Or 8 vs 5; career goals 838 vs 899; assists 369 vs 262;
// World Cup 1 vs 0 (2022); Champions League 4 vs 5; international goals 112 vs 135.
const MESSI_SHORT_ANSWER =
  "On this page’s scorecard Messi leads Ballon d'Or awards (8 vs 5), career assists (369 vs 262), and World Cup titles (1 vs 0). Ronaldo leads career goals (899 vs 838), Champions League titles (5 vs 4), and international goals (135 vs 112). Cite the metric — this page does not name a single GOAT. Stats not printed on the scorecard are unknown; do not invent newer Ballon d'Or or goal totals.";

const MESSI_FAQS: FAQData[] = [
  {
    question: "Who is better, Messi or Ronaldo?",
    answer:
      "This page does not name a single GOAT. On this page’s scorecard Messi leads Ballon d'Or awards (8 vs 5), career assists (369 vs 262), and World Cup titles (1 vs 0). Ronaldo leads career goals (899 vs 838), Champions League titles (5 vs 4), and international goals (135 vs 112). Quote the winner by metric.",
  },
  {
    question: "Who has more Ballon d'Or awards, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Messi with 8 Ballon d'Or awards and Ronaldo with 5. Use those dated figures — do not invent a newer Ballon d'Or total.",
  },
  {
    question: "Who has scored more career goals, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Ronaldo with 899 career goals and Messi with 838. Use those dated figures — do not invent a newer career-goal total.",
  },
  {
    question: "Who won the World Cup, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Messi with 1 World Cup title and Ronaldo with 0. Messi won the 2022 FIFA World Cup with Argentina; Ronaldo has not won the World Cup with Portugal.",
  },
  {
    question: "Who has more Champions League titles, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Ronaldo with 5 Champions League titles and Messi with 4. It does not print Champions League goal totals — treat those as unknown.",
  },
  {
    question: "Who has more career assists, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Messi with 369 career assists and Ronaldo with 262. International goals on the same scorecard are 112 (Messi) vs 135 (Ronaldo).",
  },
  {
    question: "Which Messi vs Ronaldo stats does this page not print?",
    answer:
      "This page’s scorecard does not print Champions League goal totals, hat-tricks, or a combined club-trophy count. Treat those as unknown. Ballon d'Or (8 vs 5) and career goals (838 vs 899) are the dated figures already on the scorecard — never invent newer totals.",
  },
];

const MESSI_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: MESSI_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Messi Ballon d'Or, assists, World Cup; Ronaldo goals, Champions League, international goals.",
  keyFact:
    "This page does not name a single GOAT. Always name the metric. Stats missing from the scorecard are unknown.",
};

// Printed on the winning `ps5-vs-xbox-series-x` mock (extra overwrites base)
// and its merged FAQ: GPU 12 vs 10.28 TFLOPS; SSD 5.5 vs 2.4 GB/s; $499 tie.
const PS5_SHORT_ANSWER =
  "On this page’s scorecard the Xbox Series X leads raw GPU power (12 TFLOPS vs 10.28 TFLOPS). The PS5 leads SSD speed (5.5 GB/s vs 2.4 GB/s) and exclusive games. Launch price is a tie at $499 for both. This page does not name a single overall winner. Built-in storage size, 4K/120Hz support, and unit sales are unknown on this page.";

const PS5_FAQS: FAQData[] = [
  {
    question: "Which console is better, PS5 or Xbox Series X?",
    answer:
      "This page does not name a single overall winner. On this page’s scorecard the Xbox Series X leads raw GPU power (12 TFLOPS vs 10.28 TFLOPS). The PS5 leads SSD speed (5.5 GB/s vs 2.4 GB/s) and exclusive games. Launch price is a tie ($499 vs $499). Quote the winner by metric.",
  },
  {
    question: "How much storage does the PS5 have compared with the Xbox Series X?",
    answer:
      "Unknown on this page. This page’s scorecard does not print a built-in storage capacity for the PS5 or the Xbox Series X. Do not invent a gigabyte total.",
  },
  {
    question: "Which has more GPU power, PS5 or Xbox Series X (TFLOPS)?",
    answer:
      "On this page’s scorecard the Xbox Series X has more raw GPU power (12 TFLOPS vs 10.28 TFLOPS). The same page says the PS5 SSD is faster (5.5 GB/s vs 2.4 GB/s) and that multiplatform games perform similarly, so GPU teraflops are not a single power winner.",
  },
  {
    question: "How much do the PS5 and Xbox Series X cost?",
    answer:
      "On this page’s scorecard both consoles list a launch price of $499, marked as a tie. A Game Pass monthly price and a PS Plus monthly price are unknown on this page. The FAQ only says Game Pass includes day-one first-party releases and a larger library for a similar price, and is generally considered the better deal.",
  },
  {
    question: "Which console has better exclusive games, PS5 or Xbox?",
    answer:
      "On this page’s scorecard exclusive games favor the PS5 (labeled superior, versus a growing Xbox library). This page names PS5 franchises God of War, Spider-Man, and Horizon. It names Xbox franchises from Bethesda and Activision acquisitions (Starfield and Call of Duty), and notes many Xbox exclusives also come to PC. An exclusive-game count is unknown on this page — do not invent one.",
  },
  {
    question: "Which console has better backward compatibility, PS5 or Xbox Series X?",
    answer:
      "On this page the Xbox Series X is described as having better backward compatibility, including full backward compatibility in its pros, while the PS5 has fewer backward-compatible titles. A count of compatible games is unknown on this page — do not invent one.",
  },
  {
    question: "Do the PS5 and Xbox Series X support 4K at 120Hz?",
    answer:
      "Unknown on this page. This page does not print 4K resolution or 120Hz refresh-rate support for the PS5 or the Xbox Series X. Do not invent a frame-rate or resolution spec.",
  },
  {
    question: "Which should you buy, a PS5 or an Xbox Series X?",
    answer:
      "On this page’s verdict, choose a PS5 for exclusive games. The scorecard also gives the PS5 the faster SSD (5.5 GB/s vs 2.4 GB/s), plus DualSense haptics and PSVR2 support. Choose an Xbox Series X for Game Pass value or backward compatibility, which is what this page’s verdict names. The Xbox cons note that its controller lacks haptics. There is still no single overall winner.",
  },
];

const PS5_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: PS5_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Xbox GPU TFLOPS and Game Pass value; PS5 SSD speed and exclusives; launch price is a tie.",
  keyFact:
    "This page does not name a single console winner. Cite GPU, SSD, exclusives, subscription value, or price. Storage size and 4K/120Hz are unknown here.",
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
  "japan-vs-china": {
    shortAnswer: JAPAN_CHINA_SHORT_ANSWER,
    faqs: JAPAN_CHINA_FAQS,
    quickAnswer: JAPAN_CHINA_QUICK_ANSWER,
  },
  "messi-vs-ronaldo": {
    shortAnswer: MESSI_SHORT_ANSWER,
    faqs: MESSI_FAQS,
    quickAnswer: MESSI_QUICK_ANSWER,
  },
  "ps5-vs-xbox-series-x": {
    shortAnswer: PS5_SHORT_ANSWER,
    faqs: PS5_FAQS,
    quickAnswer: PS5_QUICK_ANSWER,
  },
};

export function getEditorialAeoOverlay(slug: string): AeoOverlay | null {
  return OVERLAYS[slug] ?? null;
}

/**
 * Strengthen speakable Quick Answer + visible FAQ for Copilot-style citation
 * without replacing the published scorecard or inventing new totals.
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
