import type {
  ComparisonAttribute,
  ComparisonEntityData,
  ComparisonPageData,
  FAQData,
  KeyDifference,
  QuickAnswerTLDR,
} from "@/types";
import {
  NBA_SEASON_OVERLAYS,
  type NamedAttribute,
  type NamedCell,
  type NamedFact,
  type SeasonScorecard,
} from "@/lib/data/nba-2026-season-overlays";

/**
 * Plain-fact AEO overlays for live compares.
 *
 * A metric stays here only when the live compare has one value for it and
 * that value matches a primary official source. Conflicting pairs and figures
 * that disagree with the official source are left out. Qualitative wording
 * stays when every conflicting pair, and the official source, agree on the
 * direction. Reader copy does not mention the page, a table, a row, or a
 * column. winnerName stays null.
 */

const GDP_SHORT_ANSWER =
  "In nominal terms, the United States economy is larger than China’s. Output per person is also higher in the United States. China’s economy is growing faster. The United States spends more on its military than China. Neither is named the winner.";

const GDP_FAQS: FAQData[] = [
  {
    question: "Is China’s economy bigger than the US?",
    answer:
      "It depends on the measure. In nominal terms, the United States economy is larger than China’s. Output per person is higher in the United States. China’s economy is growing faster. Neither is named the winner.",
  },
  {
    question: "What is US vs China nominal GDP?",
    answer:
      "The United States economy is larger than China’s in nominal terms.",
  },
  {
    question: "Which country spends more on its military, the United States or China?",
    answer:
      "The United States spends more on its military than China.",
  },
  {
    question: "Why can nominal GDP totals for the US and China differ?",
    answer:
      "Nominal GDP converts output into dollars at market exchange rates, so the dollar total depends on the year and the exchange rate. In nominal terms, the United States economy is larger than China’s.",
  },
  {
    question: "What is GDP per capita for the US vs China?",
    answer:
      "Output per person is higher in the United States than in China.",
  },
  {
    question: "Will China overtake the US in nominal GDP this decade?",
    answer:
      "China’s economy is growing faster than the United States economy. Faster growth does not by itself name a year when China would become larger in nominal terms. Neither is named the winner.",
  },
  {
    question: "Which GDP measure should journalists and students cite?",
    answer:
      "Use nominal GDP for the size of the economy in dollars, and output per person for the typical level of output. The United States is ahead on both of those measures. China’s economy is growing faster. Name the measure. Neither is named the winner.",
  },
];

const GDP_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: GDP_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: the United States on nominal size, output per person, and military spending; China on the pace of growth.",
  keyFact:
    "The United States economy is larger than China’s in nominal terms. China’s economy is growing faster. Neither is named the winner.",
};

const JAPAN_CHINA_SHORT_ANSWER =
  "China’s economy is larger than Japan’s in nominal terms, and China’s population is larger. Output per person is higher in Japan, and people in Japan live longer. China spends more on its military than Japan. Neither is named the winner.";

const JAPAN_CHINA_FAQS: FAQData[] = [
  {
    question: "Is China’s economy bigger than Japan’s?",
    answer:
      "In nominal terms, yes. China’s economy is larger than Japan’s. Output per person is higher in Japan. Neither is named the winner.",
  },
  {
    question: "What is Japan vs China GDP?",
    answer:
      "China’s economy is larger than Japan’s in nominal terms.",
  },
  {
    question: "What is Japan vs China GDP per capita?",
    answer:
      "Output per person is higher in Japan than in China.",
  },
  {
    question: "Which country has the larger population, Japan or China?",
    answer:
      "China. China’s population is larger than Japan’s.",
  },
  {
    question: "Which country spends more on defence, Japan or China?",
    answer:
      "China spends more on its military than Japan.",
  },
  {
    question: "Which country has higher life expectancy, Japan or China?",
    answer:
      "Japan. People in Japan live longer than people in China.",
  },
];

const JAPAN_CHINA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: JAPAN_CHINA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: China on nominal size, population, and military spending; Japan on output per person and life expectancy.",
  keyFact:
    "China’s economy is larger than Japan’s in nominal terms. Output per person is higher in Japan. Neither is named the winner.",
};

const MESSI_SHORT_ANSWER =
  "Messi has won 8 Ballon d'Or awards. Ronaldo has won 5. Messi won the 2022 World Cup with Argentina. Ronaldo has not won the World Cup. Neither is named the winner.";

const MESSI_FAQS: FAQData[] = [
  {
    question: "Who is better, Messi or Ronaldo?",
    answer:
      "Neither is named the winner. Messi has won more Ballon d'Or awards (8 vs 5) and won the 2022 World Cup. Ronaldo has not won the World Cup.",
  },
  {
    question: "Who has more Ballon d'Or awards, Messi or Ronaldo?",
    answer:
      "Messi has won 8 Ballon d'Or awards. Ronaldo has won 5. Messi has won more (8 vs 5).",
  },
  {
    question: "Who won the World Cup, Messi or Ronaldo?",
    answer:
      "Messi won the 2022 World Cup with Argentina. Ronaldo has not won the World Cup.",
  },
];

const MESSI_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: MESSI_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Messi on Ballon d'Or awards and the 2022 World Cup.",
  keyFact:
    "Messi has won 8 Ballon d'Or awards and Ronaldo has won 5. Messi won the 2022 World Cup. Neither is named the winner.",
};

const PS5_SHORT_ANSWER =
  "The PS5 SSD is faster (5.5 GB/s vs 2.4 GB/s). The Xbox Series X GPU is rated higher than the PS5 GPU. Neither is named the winner.";

const PS5_FAQS: FAQData[] = [
  {
    question: "Which console is better, PS5 or Xbox Series X?",
    answer:
      "Neither is named the winner. The PS5 SSD is faster (5.5 GB/s vs 2.4 GB/s). The Xbox Series X GPU is rated higher than the PS5 GPU.",
  },
  {
    question: "Which has the higher GPU rating, PS5 or Xbox Series X?",
    answer:
      "The Xbox Series X GPU is rated higher than the PS5 GPU. The PS5 SSD is faster (5.5 GB/s vs 2.4 GB/s).",
  },
  {
    question: "What is the SSD speed of the PS5 vs the Xbox Series X?",
    answer:
      "Sony rates the PS5 SSD at 5.5 GB/s. Microsoft rates the Xbox Series X SSD at 2.4 GB/s. The PS5 is faster (5.5 GB/s vs 2.4 GB/s).",
  },
  {
    question: "Which should you buy, a PS5 or an Xbox Series X?",
    answer:
      "Neither is named the winner. The PS5 SSD is faster (5.5 GB/s vs 2.4 GB/s). The Xbox Series X GPU is rated higher than the PS5 GPU.",
  },
];

const PS5_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: PS5_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: PS5 SSD speed; Xbox Series X GPU rating.",
  keyFact:
    "The PS5 SSD is faster (5.5 GB/s vs 2.4 GB/s). Neither is named the winner.",
};

const FIGMA_SHORT_ANSWER =
  "Figma works in a web browser, including on Windows. Sketch’s native editor is a Mac app. Figma has a free Starter plan. Neither is named the winner.";

const FIGMA_FAQS: FAQData[] = [
  {
    question: "Which is better, Figma or Sketch?",
    answer:
      "Neither is named the winner. Figma works in a web browser, including on Windows. Sketch’s native editor is a Mac app. Figma has a free Starter plan.",
  },
  {
    question: "Does Figma work on Windows, and does Sketch?",
    answer:
      "Figma works in a web browser, so it works on Windows. Sketch’s native editor is a Mac app.",
  },
  {
    question: "Is Figma free?",
    answer:
      "Figma has a free Starter plan. Figma also sells paid plans.",
  },
];

const FIGMA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: FIGMA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Figma works in the browser and has a free Starter plan; Sketch’s native editor is a Mac app.",
  keyFact:
    "Figma works in a web browser, including on Windows. Sketch’s native editor is a Mac app. Neither is named the winner.",
};

const CANVA_SHORT_ANSWER =
  "Canva is built for layouts made from templates. Photoshop is Adobe’s photo editor. Neither is named the winner.";

const CANVA_FAQS: FAQData[] = [
  {
    question: "Which is better, Canva or Photoshop?",
    answer:
      "Neither is named the winner. Canva is built for layouts made from templates. Photoshop is Adobe’s photo editor. They are aimed at different work.",
  },
  {
    question: "Is Canva replacing Photoshop?",
    answer:
      "No. Canva is built for layouts made from templates. Photoshop is Adobe’s photo editor.",
  },
  {
    question: "Which is the better fit for a simple layout, Canva or Photoshop?",
    answer:
      "Canva. Canva is built for layouts made from templates. Photoshop is Adobe’s photo editor.",
  },
  {
    question: "Which is the better fit for photo editing, Canva or Photoshop?",
    answer:
      "Photoshop. Photoshop is Adobe’s photo editor. Canva is built for layouts made from templates.",
  },
];

const CANVA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CANVA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Canva for template layouts; Photoshop for photo editing.",
  keyFact:
    "Canva is built for layouts made from templates. Photoshop is Adobe’s photo editor. Neither is named the winner.",
};

const CHATGPT_SHORT_ANSWER =
  "OpenAI makes ChatGPT. Google makes Gemini. Neither is named the winner.";

const CHATGPT_FAQS: FAQData[] = [
  {
    question: "Which AI is better, ChatGPT or Gemini?",
    answer:
      "Neither is named the winner. OpenAI makes ChatGPT. Google makes Gemini.",
  },
];

const CHATGPT_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CHATGPT_SHORT_ANSWER,
  winnerName: null,
  winnerReason: "Neither product is named the winner.",
  keyFact: "OpenAI makes ChatGPT. Google makes Gemini. Neither is named the winner.",
};

const CURSOR_SHORT_ANSWER =
  "GitHub Copilot Pro costs $10 per month. Cursor Pro costs $20 per month. Copilot Business is $19 per user per month, and a Cursor team plan is $40 per user per month. Copilot Pro+ is $39 per month. Copilot Enterprise is $39 per user per month. GitHub Copilot works inside existing editors. Cursor is its own editor. Neither is named the winner.";

const CURSOR_FAQS: FAQData[] = [
  {
    question: "Which is better, Cursor or GitHub Copilot?",
    answer:
      "Neither is named the winner. GitHub Copilot Pro costs less ($10 per month vs $20 per month). GitHub Copilot works inside existing editors. Cursor is its own editor.",
  },
  {
    question: "How much do Cursor and GitHub Copilot cost?",
    answer:
      "GitHub Copilot Pro costs $10 per month. Cursor Pro costs $20 per month. Copilot Pro costs less ($10 per month vs $20 per month). Copilot Pro+ costs $39 per month. Copilot Business is $19 per user per month. A Cursor team plan is $40 per user per month. Copilot Enterprise is $39 per user per month.",
  },
  {
    question: "Which works in more editors, Cursor or GitHub Copilot?",
    answer:
      "GitHub Copilot works inside existing editors, including VS Code, Visual Studio, JetBrains, Neovim, Xcode, and Eclipse. Cursor is its own editor.",
  },
  {
    question: "What are the Cursor and Copilot team prices?",
    answer:
      "A Cursor team plan is $40 per user per month. Copilot Business is $19 per user per month. Copilot Enterprise is $39 per user per month. The team price is higher for Cursor ($40 per user per month vs $19 per user per month).",
  },
];

const CURSOR_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CURSOR_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Copilot Pro and Copilot Business cost less; Copilot works inside existing editors; Cursor is its own editor.",
  keyFact:
    "GitHub Copilot Pro costs $10 per month. Cursor Pro costs $20 per month. Neither is named the winner.",
};

const ANDROID_SHORT_ANSWER =
  "Android is used on more phones worldwide than iOS. Neither is named the winner.";

const ANDROID_FAQS: FAQData[] = [
  {
    question: "Which is better, Android or iOS?",
    answer:
      "Neither is named the winner. Android is used on more phones worldwide than iOS.",
  },
  {
    question: "What is Android vs iOS global market share?",
    answer:
      "Android is used on more phones worldwide than iOS.",
  },
];

const ANDROID_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: ANDROID_SHORT_ANSWER,
  winnerName: null,
  winnerReason: "By metric only: Android is used on more phones worldwide.",
  keyFact:
    "Android is used on more phones worldwide than iOS. Neither is named the winner.",
};

const NVIDIA_SHORT_ANSWER =
  "NVIDIA’s market value is larger than AMD’s. AMD designs CPUs and GPUs. NVIDIA’s main products are GPUs. Neither is named the winner.";

const NVIDIA_FAQS: FAQData[] = [
  {
    question: "Which is better, NVIDIA or AMD?",
    answer:
      "Neither is named the winner. NVIDIA’s market value is larger than AMD’s. AMD designs CPUs and GPUs. NVIDIA’s main products are GPUs.",
  },
  {
    question: "Which company has the larger market value, NVIDIA or AMD?",
    answer:
      "NVIDIA. NVIDIA’s market value is larger than AMD’s.",
  },
  {
    question: "Who designs CPUs, NVIDIA or AMD?",
    answer:
      "AMD designs CPUs and GPUs. NVIDIA’s main products are GPUs.",
  },
];

const NVIDIA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: NVIDIA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: NVIDIA on market value; AMD on CPU design.",
  keyFact:
    "NVIDIA’s market value is larger than AMD’s. Neither is named the winner.",
};

const US_ECONOMY_CHINA_SHORT_ANSWER =
  "The United States economy is larger than China’s in nominal terms. Output per person is higher in the United States. China’s economy is growing faster. Neither is named the winner.";

const US_ECONOMY_CHINA_FAQS: FAQData[] = [
  {
    question: "Which economy is bigger, the US or China?",
    answer:
      "Neither is named the winner. The United States economy is larger than China’s in nominal terms, and output per person is higher in the United States. China’s economy is growing faster.",
  },
  {
    question: "What is US vs China nominal GDP?",
    answer:
      "The United States economy is larger than China’s in nominal terms.",
  },
  {
    question: "What is GDP per capita for the US vs China?",
    answer:
      "Output per person is higher in the United States than in China.",
  },
  {
    question: "Which economy is growing faster, the US or China?",
    answer:
      "China’s economy is growing faster than the United States economy.",
  },
  {
    question: "Is there one overall winner between the US and China economies?",
    answer:
      "Neither is named the winner. The United States is ahead on nominal size and on output per person. China’s economy is growing faster.",
  },
];

const US_ECONOMY_CHINA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: US_ECONOMY_CHINA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: the United States on nominal size and output per person; China on the pace of growth.",
  keyFact:
    "The United States economy is larger than China’s in nominal terms. China’s economy is growing faster. Neither is named the winner.",
};

const USA_CHINA_SHORT_ANSWER =
  "The United States economy is larger than China’s in nominal terms. Output per person is higher in the United States. The United States spends more on its military. China’s population is larger. Neither is named the winner.";

const USA_CHINA_FAQS: FAQData[] = [
  {
    question: "Which is ahead, the USA or China?",
    answer:
      "Neither is named the winner. The United States economy is larger than China’s in nominal terms. Output per person is higher in the United States. The United States spends more on its military. China’s population is larger.",
  },
  {
    question: "What is USA vs China GDP?",
    answer:
      "The United States economy is larger than China’s in nominal terms.",
  },
  {
    question: "Which country has the larger population, the USA or China?",
    answer:
      "China. China’s population is larger than the population of the United States.",
  },
  {
    question: "Which country spends more on the military, the USA or China?",
    answer:
      "The United States spends more on its military than China.",
  },
  {
    question: "What is GDP per capita for the USA vs China?",
    answer:
      "Output per person is higher in the United States than in China.",
  },
];

const USA_CHINA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: USA_CHINA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: the United States on nominal size, output per person, and military spending; China on population.",
  keyFact:
    "The United States economy is larger than China’s in nominal terms. China’s population is larger. Neither is named the winner.",
};

const LYFT_UBER_SHORT_ANSWER =
  "Uber offers rides and restaurant delivery in cities around the world. Lyft offers rides in the United States and Canada. Neither is named the winner.";

const LYFT_UBER_FAQS: FAQData[] = [
  {
    question: "Which is bigger, Uber or Lyft?",
    answer:
      "Neither is named the winner. Uber offers rides and restaurant delivery in cities around the world. Lyft offers rides in the United States and Canada.",
  },
  {
    question: "Where do Uber and Lyft operate?",
    answer:
      "Lyft offers rides in the United States and Canada. Uber offers rides in cities around the world, including outside those two countries.",
  },
  {
    question: "What services do Uber and Lyft offer?",
    answer:
      "Uber offers rides and restaurant delivery through Uber Eats. Lyft offers rides in the United States and Canada.",
  },
];

const LYFT_UBER_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: LYFT_UBER_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Uber operates beyond the United States and Canada and offers restaurant delivery; Lyft offers rides in the United States and Canada.",
  keyFact:
    "Lyft offers rides in the United States and Canada. Uber offers rides in cities around the world. Neither is named the winner.",
};

type AeoOverlay = {
  shortAnswer: string;
  faqs: FAQData[];
  quickAnswer: QuickAnswerTLDR;
} & Partial<SeasonScorecard>;

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
  "figma-vs-sketch": {
    shortAnswer: FIGMA_SHORT_ANSWER,
    faqs: FIGMA_FAQS,
    quickAnswer: FIGMA_QUICK_ANSWER,
  },
  "canva-vs-photoshop": {
    shortAnswer: CANVA_SHORT_ANSWER,
    faqs: CANVA_FAQS,
    quickAnswer: CANVA_QUICK_ANSWER,
  },
  "chatgpt-vs-gemini": {
    shortAnswer: CHATGPT_SHORT_ANSWER,
    faqs: CHATGPT_FAQS,
    quickAnswer: CHATGPT_QUICK_ANSWER,
  },
  "cursor-vs-copilot": {
    shortAnswer: CURSOR_SHORT_ANSWER,
    faqs: CURSOR_FAQS,
    quickAnswer: CURSOR_QUICK_ANSWER,
  },
  "android-vs-ios": {
    shortAnswer: ANDROID_SHORT_ANSWER,
    faqs: ANDROID_FAQS,
    quickAnswer: ANDROID_QUICK_ANSWER,
  },
  "nvidia-vs-amd": {
    shortAnswer: NVIDIA_SHORT_ANSWER,
    faqs: NVIDIA_FAQS,
    quickAnswer: NVIDIA_QUICK_ANSWER,
  },
  "us-economy-vs-china-economy": {
    shortAnswer: US_ECONOMY_CHINA_SHORT_ANSWER,
    faqs: US_ECONOMY_CHINA_FAQS,
    quickAnswer: US_ECONOMY_CHINA_QUICK_ANSWER,
  },
  "usa-vs-china": {
    shortAnswer: USA_CHINA_SHORT_ANSWER,
    faqs: USA_CHINA_FAQS,
    quickAnswer: USA_CHINA_QUICK_ANSWER,
  },
  "lyft-vs-uber": {
    shortAnswer: LYFT_UBER_SHORT_ANSWER,
    faqs: LYFT_UBER_FAQS,
    quickAnswer: LYFT_UBER_QUICK_ANSWER,
  },
};


function entityMatches(entity: ComparisonEntityData, match: string): boolean {
  const needle = match.trim().toLowerCase();
  if (!needle) return false;
  return (
    entity.id.toLowerCase() === needle ||
    entity.slug.toLowerCase() === needle ||
    entity.slug.toLowerCase().includes(needle) ||
    entity.name.toLowerCase().includes(needle)
  );
}

function cellFor(entity: ComparisonEntityData, cells: NamedCell[]): NamedCell | undefined {
  return cells.find((cell) => entityMatches(entity, cell.match));
}

function rowsToAttributes(
  entities: ComparisonEntityData[],
  rows: NamedAttribute[]
): ComparisonAttribute[] {
  return rows.map((row) => {
    const someoneWon = row.cells.some((cell) => cell.winner);
    return {
      id: row.slug,
      slug: row.slug,
      name: row.name,
      unit: null,
      category: row.category,
      dataType: "text",
      higherIsBetter: null,
      values: entities.map((entity) => {
        const cell = cellFor(entity, row.cells);
        return {
          entityId: entity.id,
          valueText: cell?.text ?? "—",
          valueNumber: null,
          valueBoolean: null,
          winner: someoneWon ? Boolean(cell?.winner) : undefined,
        };
      }),
    };
  });
}

function factsToKeyDifferences(
  entities: ComparisonEntityData[],
  facts: NamedFact[]
): KeyDifference[] {
  const entityA = entities[0];
  const entityB = entities[1];
  return facts.map((fact) => {
    const cellA = entityA ? cellFor(entityA, fact.cells) : undefined;
    const cellB = entityB ? cellFor(entityB, fact.cells) : undefined;
    let winner: "a" | "b" | "tie" = "tie";
    if (cellA?.winner && !cellB?.winner) winner = "a";
    else if (cellB?.winner && !cellA?.winner) winner = "b";
    return {
      label: fact.label,
      entityAValue: cellA?.text ?? "—",
      entityBValue: cellB?.text ?? "—",
      winner,
    };
  });
}

export function getEditorialAeoOverlay(slug: string): AeoOverlay | null {
  return OVERLAYS[slug] ?? NBA_SEASON_OVERLAYS[slug] ?? null;
}

/**
 * Strengthen speakable Quick Answer + visible FAQ for Copilot-style citation.
 * Scorecard fields are optional. Citation overlays leave the published
 * scorecard in place. Season overlays set `facts` and `rows` only when the
 * live table itself is wrong.
 */
export function applyEditorialAeoOverlay(
  comparison: ComparisonPageData
): ComparisonPageData {
  const overlay = getEditorialAeoOverlay(comparison.slug);
  if (!overlay) return comparison;

  const entities = overlay.entityPatches
    ? comparison.entities.map((entity) => {
        const patch = overlay.entityPatches?.find((item) => entityMatches(entity, item.match));
        if (!patch) return entity;
        return {
          ...entity,
          shortDesc: patch.shortDesc,
          pros: patch.pros,
          cons: patch.cons,
          bestFor: patch.bestFor,
        };
      })
    : comparison.entities;

  return {
    ...comparison,
    title: overlay.title ?? comparison.title,
    shortAnswer: overlay.shortAnswer,
    faqs: overlay.faqs,
    quickAnswer: {
      ...overlay.quickAnswer,
      tldr: overlay.shortAnswer,
    },
    ...(overlay.verdict !== undefined ? { verdict: overlay.verdict } : {}),
    ...(overlay.expertAnalysis !== undefined ? { expertAnalysis: overlay.expertAnalysis } : {}),
    ...(overlay.facts ? { keyDifferences: factsToKeyDifferences(entities, overlay.facts) } : {}),
    ...(overlay.rows ? { attributes: rowsToAttributes(entities, overlay.rows) } : {}),
    ...(overlay.citationStats ? { citationStats: overlay.citationStats } : {}),
    ...(overlay.resources ? { resources: overlay.resources } : {}),
    ...(overlay.relatedComparisons ? { relatedComparisons: overlay.relatedComparisons } : {}),
    entities,
    metadata: {
      ...comparison.metadata,
      ...(overlay.metaTitle ? { metaTitle: overlay.metaTitle } : {}),
      ...(overlay.metaDescription ? { metaDescription: overlay.metaDescription } : {}),
      ...(overlay.updatedAt ? { updatedAt: overlay.updatedAt } : {}),
    },
    ...(overlay.clearSchemaMarkup ? { schemaMarkup: undefined } : {}),
  };
}
