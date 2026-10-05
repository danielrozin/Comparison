import { describe, it, expect } from "vitest";
import {
  applyEditorialAeoOverlay,
  getEditorialAeoOverlay,
} from "../editorial-aeo-overlays";
import { comparisonPageSchema } from "@/lib/seo/schema";
import { findSelfContradictions } from "@/lib/services/numeric-claim-guard";
import { getMockComparison } from "@/lib/services/mock-data";
import type { ComparisonPageData } from "@/types";

const BRIEF_GDP_FAQS = [
  "Is China’s economy bigger than the US in 2026?",
  "What is US vs China GDP (nominal) in 2026?",
  "How do US and China defense spending and manufacturing share compare?",
  "Why can nominal GDP totals for the US and China differ?",
  "What is GDP per capita for the US vs China?",
  "Will China overtake the US in nominal GDP this decade?",
  "Which GDP measure should journalists and students cite?",
];

const BRIEF_JAPAN_CHINA_FAQS = [
  "Is China’s economy bigger than Japan’s?",
  "What is Japan vs China GDP?",
  "What is Japan vs China GDP per capita?",
  "What share of GDP is manufacturing in Japan vs China?",
  "Which country has the larger population, Japan or China?",
  "Which country spends more on defence, Japan or China?",
  "Which country has higher life expectancy and HDI, Japan or China?",
];

const BRIEF_MESSI_FAQS = [
  "Who is better, Messi or Ronaldo?",
  "Who has more Ballon d'Or awards, Messi or Ronaldo?",
  "Who has scored more career goals, Messi or Ronaldo?",
  "Who won the World Cup, Messi or Ronaldo?",
  "Who has more Champions League titles, Messi or Ronaldo?",
  "Who has more international goals, Messi or Ronaldo?",
  "What is the 2025 career-goal count for Messi and Ronaldo?",
];

const BRIEF_PS5_FAQS = [
  "Which console is better, PS5 or Xbox Series X?",
  "How much storage does the PS5 have compared with the Xbox Series X?",
  "Which has more GPU power, PS5 or Xbox Series X (TFLOPS)?",
  "How much do the PS5 and Xbox Series X cost?",
  "Which console has more exclusive games, PS5 or Xbox?",
  "Which console has better backward compatibility, PS5 or Xbox Series X?",
  "What is the SSD speed of the PS5 vs the Xbox Series X?",
  "Which should you buy, a PS5 or an Xbox Series X?",
];

const BRIEF_FIGMA_FAQS = [
  "Which is better, Figma or Sketch?",
  "What is Figma vs Sketch market share?",
  "Does Figma work on Windows, and does Sketch?",
  "Which has better real-time collaboration, Figma or Sketch?",
  "How much do Figma and Sketch cost?",
  "Can you use Figma or Sketch offline?",
  "Is Figma free?",
  "How many active designers use Figma vs Sketch?",
];

const BRIEF_CANVA_FAQS = [
  "Which is better, Canva or Photoshop?",
  "How much do Canva and Photoshop cost?",
  "Is Canva replacing Photoshop?",
  "Who has more users, Canva or Photoshop?",
  "Which is easier to learn, Canva or Photoshop?",
  "Which is better for photo retouching and templates?",
  "Can Canva be used professionally?",
  "What Canva and Photoshop prices are stated?",
];

const BRIEF_CURSOR_FAQS = [
  "Which is better, Cursor or GitHub Copilot?",
  "How much do Cursor and GitHub Copilot cost?",
  "Which has better agentic and multi-file editing, Cursor or Copilot?",
  "Which works in more editors, Cursor or GitHub Copilot?",
  "Which has better GitHub integration and enterprise controls?",
  "Do Cursor and Copilot both offer Claude, GPT, and Gemini?",
  "Which is better for inline autocomplete and onboarding?",
  "What are the Cursor and Copilot business prices?",
];

const BRIEF_ANDROID_FAQS = [
  "Which is better, Android or iOS?",
  "What is Android vs iOS global market share?",
  "Which gets software updates longer, Android or iOS?",
  "Which is more private, Android or iOS?",
  "Which is more customizable, Android or iOS?",
  "How long do Android and iOS software updates last?",
  "What Android and iOS differences are settled by market share, updates, and privacy?",
];

const BRIEF_NVIDIA_FAQS = [
  "Which is better, NVIDIA or AMD?",
  "What is NVIDIA vs AMD discrete GPU market share?",
  "Which has the larger market cap, NVIDIA or AMD?",
  "Which is better for AI, NVIDIA or AMD?",
  "Which is better for gaming value, and who makes CPUs?",
  "How is NVIDIA’s market cap written?",
  "What do the NVIDIA and AMD share and market-cap figures say?",
];

const BRIEF_US_ECONOMY_CHINA_FAQS = [
  "Which economy is bigger, the US or China?",
  "What is US vs China nominal GDP?",
  "What is GDP per capita for the US vs China?",
  "Who has the larger manufacturing share, the US or China?",
  "Which economy is growing faster, the US or China?",
  "Is there one overall winner between the US and China economies?",
  "Do the US and China nominal GDP figures agree?",
];

const BRIEF_USA_CHINA_FAQS = [
  "Which is ahead, the USA or China?",
  "What is USA vs China GDP?",
  "Which country has the larger population, the USA or China?",
  "Which country spends more on the military, the USA or China?",
  "What is GDP per capita for the USA vs China?",
  "Who leads manufacturing output, the USA or China?",
  "How do the USA and China population counts compare?",
];

const BRIEF_LYFT_UBER_FAQS = [
  "Which is bigger, Uber or Lyft?",
  "What is Uber vs Lyft US rideshare market share?",
  "Where do Uber and Lyft operate?",
  "What was Uber and Lyft 2024 annual revenue?",
  "What platform fee do Uber and Lyft charge?",
  "How many drivers do Uber and Lyft have, and is the rating a tie?",
  "What services do Uber and Lyft offer?",
];

// Published lyft-vs-uber Key Differences cells only. The slug is not in the mock map.
const LYFT_UBER_SCORECARD = [
  "72 countries across 6 continents",
  "US and Canada only",
  "71%",
  "29%",
  "Rideshare, Uber Eats, Uber Freight, Uber Jump, Uber Elevate",
  "Rideshare only",
  "25-30% platform fee",
  "Approximately 25% platform fee",
  "$38.7 billion",
  "$38.1 billion",
  "$4.3 billion",
  "6+ million globally",
  "600,000-700,000 in North America",
  "4.6+ stars to remain active",
  "2024 Annual Revenue",
];

const BRIEF_CHATGPT_FAQS = [
  "Which AI is better, ChatGPT or Gemini?",
  "Who has the larger context window, ChatGPT or Gemini?",
  "Which has real-time web search, ChatGPT or Gemini?",
  "What inputs do ChatGPT and Gemini accept?",
  "How much do ChatGPT and Gemini cost per million input tokens?",
  "Which responds faster, ChatGPT or Gemini?",
  "What is the output token limit for ChatGPT vs Gemini?",
  "When does training data stop for ChatGPT and Gemini?",
];

/** Reader copy must not point at the page furniture. Word boundaries avoid hits inside real words such as "growth" or "browser". */
const PAGE_FURNITURE =
  /\brows?\b|\btable\b|\bcolumns?\b|quote the|listed above|\bshown\b|\bquoted\b|\bprints?\b|\bprinted\b|\bincluded\b|\bchecked\b|\bpage\b|\babove\b|\bscorecard\b|key facts|page-level winner/i;

const CITATION_SLUGS = [
  "us-vs-china-gdp",
  "us-economy-vs-china-economy",
  "usa-vs-china",
  "lyft-vs-uber",
  "japan-vs-china",
  "messi-vs-ronaldo",
  "ps5-vs-xbox-series-x",
  "cursor-vs-copilot",
  "android-vs-ios",
  "nvidia-vs-amd",
  "chatgpt-vs-gemini",
  "canva-vs-photoshop",
  "figma-vs-sketch",
];

function stubGdpPage(): ComparisonPageData {
  return {
    id: "us-vs-china-gdp",
    slug: "us-vs-china-gdp",
    title: "USA vs China GDP 2026",
    shortAnswer: "Old buried answer.",
    verdict: "Existing verdict.",
    category: "countries",
    entities: [
      { id: "us", slug: "united-states-economy", name: "United States Economy", shortDesc: null, imageUrl: null, entityType: "country", position: 0, pros: [], cons: [], bestFor: null },
      { id: "cn", slug: "china-economy", name: "China Economy", shortDesc: null, imageUrl: null, entityType: "country", position: 1, pros: [], cons: [], bestFor: null },
    ],
    attributes: [],
    keyDifferences: [
      { label: "Nominal GDP Size", entityAValue: "$30+ trillion", entityBValue: "$19 trillion", winner: "a" },
    ],
    faqs: [{ question: "Old Q", answer: "Old A" }],
    relatedComparisons: [],
    relatedBlogPosts: [],
    metadata: {
      metaTitle: "USA vs China GDP",
      metaDescription: "Compare US and China GDP.",
      publishedAt: "2026-03-27T00:00:00Z",
      updatedAt: "2026-09-15T00:00:00Z",
      isAutoGenerated: false,
      isHumanReviewed: true,
      viewCount: 1,
      status: "published",
    },
  };
}

function stubJapanChinaPage(): ComparisonPageData {
  return {
    id: "japan-vs-china",
    slug: "japan-vs-china",
    title: "Japan vs China",
    shortAnswer: "Old buried answer.",
    verdict: "Existing verdict.",
    category: "countries",
    entities: [
      { id: "ent-3", slug: "japan", name: "Japan", shortDesc: null, imageUrl: null, entityType: "country", position: 0, pros: [], cons: [], bestFor: null },
      { id: "ent-4", slug: "china", name: "China", shortDesc: null, imageUrl: null, entityType: "country", position: 1, pros: [], cons: [], bestFor: null },
    ],
    attributes: [],
    keyDifferences: [
      { label: "Population", entityAValue: "125M", entityBValue: "1.4B", winner: "b" },
      { label: "GDP", entityAValue: "$4.2T", entityBValue: "$17.7T", winner: "b" },
      { label: "GDP per Capita", entityAValue: "$33,800", entityBValue: "$12,500", winner: "a" },
    ],
    faqs: [{ question: "Old Q", answer: "Old A" }],
    relatedComparisons: [],
    relatedBlogPosts: [],
    metadata: {
      metaTitle: "Japan vs China",
      metaDescription: "Compare Japan and China.",
      publishedAt: "2024-03-01T00:00:00Z",
      updatedAt: "2026-03-15T00:00:00Z",
      isAutoGenerated: false,
      isHumanReviewed: true,
      viewCount: 1,
      status: "published",
    },
  };
}

function stubMessiPage(): ComparisonPageData {
  return {
    id: "comp-1",
    slug: "messi-vs-ronaldo",
    title: "Messi vs Ronaldo",
    shortAnswer: "Old buried answer.",
    verdict: "Existing verdict.",
    category: "sports",
    entities: [
      { id: "ent-1", slug: "lionel-messi", name: "Lionel Messi", shortDesc: null, imageUrl: null, entityType: "person", position: 0, pros: [], cons: [], bestFor: null },
      { id: "ent-2", slug: "cristiano-ronaldo", name: "Cristiano Ronaldo", shortDesc: null, imageUrl: null, entityType: "person", position: 1, pros: [], cons: [], bestFor: null },
    ],
    attributes: [],
    keyDifferences: [
      { label: "Ballon d'Or Awards", entityAValue: "8", entityBValue: "5", winner: "a" },
      { label: "Career Goals", entityAValue: "838", entityBValue: "899", winner: "b" },
    ],
    faqs: [{ question: "Old Q", answer: "Old A" }],
    relatedComparisons: [],
    relatedBlogPosts: [],
    metadata: {
      metaTitle: "Messi vs Ronaldo",
      metaDescription: "Compare Messi and Ronaldo.",
      publishedAt: "2024-01-15T00:00:00Z",
      updatedAt: "2026-03-15T00:00:00Z",
      isAutoGenerated: false,
      isHumanReviewed: true,
      viewCount: 1,
      status: "published",
    },
  };
}

function numbersIn(text: string): string[] {
  return text.match(/\d+(?:\.\d+)?/g) ?? [];
}

function overlayProse(overlay: NonNullable<ReturnType<typeof getEditorialAeoOverlay>>): string {
  return [
    overlay.shortAnswer,
    overlay.quickAnswer.winnerReason,
    overlay.quickAnswer.keyFact,
    ...overlay.faqs.flatMap((f) => [f.question, f.answer]),
  ].join("\n");
}

function mockMessiAllowedNumbers(): Set<string> {
  const mock = getMockComparison("messi-vs-ronaldo");
  if (!mock) throw new Error("expected messi-vs-ronaldo mock comparison");
  const texts = [
    mock.shortAnswer,
    mock.verdict,
    mock.metadata.metaTitle,
    mock.metadata.metaDescription,
    ...mock.keyDifferences.flatMap((d) => [d.label, d.entityAValue, d.entityBValue]),
    ...mock.faqs.flatMap((f) => [f.question, f.answer]),
    ...mock.entities.flatMap((e) => [e.shortDesc, e.bestFor, ...(e.pros || []), ...(e.cons || [])]),
    ...mock.attributes.flatMap((a) => [
      a.name,
      ...a.values.map((v) => v.valueText),
    ]),
  ];
  const set = new Set<string>();
  for (const t of texts) {
    if (!t) continue;
    for (const n of numbersIn(t)) set.add(n);
  }
  return set;
}

describe("ROO-27 GDP AEO overlay", () => {
  it("rewrites speakable Quick Answer and FAQ to the brief’s 7 questions", () => {
    const overlay = getEditorialAeoOverlay("us-vs-china-gdp");
    expect(overlay).toBeTruthy();
    expect(overlay!.faqs.map((f) => f.question)).toEqual(BRIEF_GDP_FAQS);

    const next = applyEditorialAeoOverlay(stubGdpPage());
    expect(next.shortAnswer).toBe(overlay!.shortAnswer);
    expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
    expect(next.faqs.map((f) => f.question)).toEqual(BRIEF_GDP_FAQS);
    expect(next.keyDifferences).toEqual(stubGdpPage().keyDifferences);
  });

  it("uses the 2026 nominal pair and does not invent a PPP dollar total", () => {
    const overlay = getEditorialAeoOverlay("us-vs-china-gdp")!;
    const blob = overlayProse(overlay);
    expect(blob).toMatch(/\$28\.7 trillion vs \$17\.9 trillion/);
    expect(blob).toMatch(/\$30\+ trillion versus about \$19 trillion/);
    expect(blob).toMatch(/\$89,000 vs \$13,500/);
    expect(blob).toMatch(/\$925\.8 billion vs \$296\.5 billion/);
    expect(blob).toMatch(/Neither is named the winner/);
    expect(blob).not.toMatch(/\$28\.8/);
    expect(blob).not.toMatch(/\$18\.5/);
    expect(blob).not.toMatch(/\$35/);
    expect(blob).not.toMatch(/\$36/);
    expect(blob).not.toMatch(/282%/);
    expect(blob).not.toMatch(/126%/);
    expect(overlay.quickAnswer.winnerName).toBeNull();
  });
});

describe("japan-vs-china citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and FAQ to 7 citation questions", () => {
    const overlay = getEditorialAeoOverlay("japan-vs-china");
    expect(overlay).toBeTruthy();
    expect(overlay!.faqs).toHaveLength(7);
    expect(overlay!.faqs.map((f) => f.question)).toEqual(BRIEF_JAPAN_CHINA_FAQS);

    const original = stubJapanChinaPage();
    const next = applyEditorialAeoOverlay(original);
    expect(next.shortAnswer).toBe(overlay!.shortAnswer);
    expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
    expect(next.faqs.map((f) => f.question)).toEqual(BRIEF_JAPAN_CHINA_FAQS);
    expect(next.keyDifferences).toEqual(original.keyDifferences);
    expect(next.verdict).toBe(original.verdict);
  });

  it("uses the live nominal pair and does not invent a PPP dollar total", () => {
    const overlay = getEditorialAeoOverlay("japan-vs-china")!;
    const perCapita = overlay.faqs.find((f) => f.question.includes("per capita"));
    expect(perCapita?.answer).toMatch(/\$39,285/);
    expect(perCapita?.answer).toMatch(/\$12,720/);
    const blob = overlayProse(overlay);
    expect(blob).not.toMatch(/PPP/i);
    expect(blob).not.toMatch(/\$17\.7/);
    expect(blob).not.toMatch(/\$33,800/);
  });

  it("reuses the live GDP totals ($17.9T vs $4.2T) and per capita", () => {
    const overlay = getEditorialAeoOverlay("japan-vs-china")!;
    const blob = [overlay.shortAnswer, ...overlay.faqs.map((f) => f.answer)].join("\n");
    expect(blob).toMatch(/\$17\.9 trillion/);
    expect(blob).toMatch(/\$4\.2 trillion/);
    expect(blob).toMatch(/\$39,285/);
    expect(blob).toMatch(/\$12,720/);
    const trillionFigures = blob.match(/\$[\d.]+ trillion/gi) ?? [];
    const unique = [...new Set(trillionFigures.map((s) => s.toLowerCase()))];
    expect(unique.sort()).toEqual(["$17.9 trillion", "$4.2 trillion"].sort());
  });

  it("uses the live defence expenditure and life-expectancy figures", () => {
    const overlay = getEditorialAeoOverlay("japan-vs-china")!;
    const military = overlay.faqs.find((f) => f.question.includes("defence"));
    const qol = overlay.faqs.find((f) => f.question.includes("life expectancy"));
    expect(military?.answer).toMatch(/€296\.5 billion vs €50\.9 billion/);
    expect(qol?.answer).toMatch(/84\.6 years vs 78\.2 years/);
    expect(qol?.answer).toMatch(/0\.920/);
    expect(qol?.answer).toMatch(/0\.796/);
    expect(overlayProse(overlay)).not.toMatch(/377,975/);
    expect(overlayProse(overlay)).not.toMatch(/2\.0 million/);
  });
});

describe("Messi vs Ronaldo Copilot AEO overlay", () => {
  it("rewrites speakable Quick Answer and 7 visible FAQs 1:1 with FAQPage", () => {
    const overlay = getEditorialAeoOverlay("messi-vs-ronaldo");
    expect(overlay).toBeTruthy();
    expect(overlay!.faqs).toHaveLength(7);
    expect(overlay!.faqs.map((f) => f.question)).toEqual(BRIEF_MESSI_FAQS);
    expect(overlay!.quickAnswer.tldr).toBe(overlay!.shortAnswer);
    expect(overlay!.quickAnswer.winnerName).toBeNull();

    const page = stubMessiPage();
    const next = applyEditorialAeoOverlay(page);
    expect(next.shortAnswer).toBe(overlay!.shortAnswer);
    expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
    expect(next.faqs).toEqual(overlay!.faqs);
    expect(next.faqs.map((f) => f.question)).toEqual(BRIEF_MESSI_FAQS);
    expect(next.keyDifferences).toEqual(page.keyDifferences);
    expect(next.verdict).toBe(page.verdict);

    const schemas = comparisonPageSchema(next) as Array<Record<string, unknown>>;
    const faqPage = schemas.find((s) => s["@type"] === "FAQPage") as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
      speakable: { "@type": string };
    };
    expect(faqPage).toBeTruthy();
    expect(faqPage.speakable["@type"]).toBe("SpeakableSpecification");
    expect(faqPage.mainEntity.map((q) => q.name)).toEqual(BRIEF_MESSI_FAQS);
    expect(faqPage.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(
      overlay!.faqs.map((f) => f.answer),
    );
  });

  it("uses only in-repo mock scorecard/FAQ numbers and says unknown for missing stats", () => {
    const overlay = getEditorialAeoOverlay("messi-vs-ronaldo")!;
    const allowed = mockMessiAllowedNumbers();
    for (const n of ["810", "895", "890", "129", "130", "2025"]) allowed.add(n);
    const prose = overlayProse(overlay);

    for (const n of numbersIn(prose)) {
      expect(allowed.has(n), `overlay invented number ${n} not present in mock messi-vs-ronaldo data`).toBe(true);
    }

    expect(prose).not.toMatch(/\b14[0-9]\b/);
    expect(prose).not.toMatch(/\b900\b/);
    expect(prose).not.toMatch(/\b9\b/);

    const dated = overlay.faqs.find((f) => f.question.includes("2025"));
    expect(dated?.answer).toMatch(/810/);
    expect(dated?.answer).toMatch(/890/);
    expect(prose).not.toMatch(/\b838\b/);
    expect(prose).not.toMatch(/\b899\b/);
    expect(prose).not.toMatch(/\b369\b/);
    expect(prose).not.toMatch(/\b112\b/);
  });

  it("does not self-contradict quoted (A vs B) order", () => {
    const overlay = getEditorialAeoOverlay("messi-vs-ronaldo")!;
    expect(
      findSelfContradictions({
        shortAnswer: overlay.shortAnswer,
        quickAnswer: overlay.quickAnswer,
        faqs: overlay.faqs,
      }),
    ).toHaveLength(0);
  });

  it("applies on the mock comparison fallback without rewriting the scorecard", () => {
    const mock = getMockComparison("messi-vs-ronaldo");
    expect(mock).toBeTruthy();
    const scorecard = mock!.keyDifferences.map((d) => ({ ...d }));
    const next = applyEditorialAeoOverlay(mock!);
    expect(next.faqs.map((f) => f.question)).toEqual(BRIEF_MESSI_FAQS);
    expect(next.shortAnswer).toBe(getEditorialAeoOverlay("messi-vs-ronaldo")!.shortAnswer);
    expect(next.keyDifferences).toEqual(scorecard);
  });
});

function mockPs5AllowedNumbers(): Set<string> {
  const mock = getMockComparison("ps5-vs-xbox-series-x");
  if (!mock) throw new Error("expected ps5-vs-xbox-series-x mock comparison");
  const texts = [
    mock.shortAnswer,
    mock.verdict,
    mock.metadata.metaTitle,
    mock.metadata.metaDescription,
    ...mock.keyDifferences.flatMap((d) => [d.label, d.entityAValue, d.entityBValue]),
    ...mock.faqs.flatMap((f) => [f.question, f.answer]),
    ...mock.entities.flatMap((e) => [e.name, e.shortDesc, e.bestFor, ...(e.pros || []), ...(e.cons || [])]),
    ...mock.attributes.flatMap((a) => [a.name, a.unit, ...a.values.map((v) => v.valueText)]),
  ];
  const set = new Set<string>();
  for (const t of texts) {
    if (!t) continue;
    for (const n of numbersIn(t)) set.add(n);
  }
  return set;
}

describe("ps5-vs-xbox-series-x citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 8 visible FAQs 1:1 with FAQPage", () => {
    const overlay = getEditorialAeoOverlay("ps5-vs-xbox-series-x");
    expect(overlay).toBeTruthy();
    expect(overlay!.faqs).toHaveLength(8);
    expect(overlay!.faqs.map((f) => f.question)).toEqual(BRIEF_PS5_FAQS);
    expect(overlay!.quickAnswer.tldr).toBe(overlay!.shortAnswer);
    expect(overlay!.quickAnswer.winnerName).toBeNull();
    expect(getEditorialAeoOverlay("playstation-5-vs-xbox-series-x")).toBeNull();

    const mock = getMockComparison("ps5-vs-xbox-series-x");
    expect(mock).toBeTruthy();
    const scorecard = mock!.keyDifferences.map((d) => ({ ...d }));
    const next = applyEditorialAeoOverlay(mock!);
    expect(next.shortAnswer).toBe(overlay!.shortAnswer);
    expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
    expect(next.faqs).toEqual(overlay!.faqs);
    expect(next.faqs.map((f) => f.question)).toEqual(BRIEF_PS5_FAQS);
    expect(next.keyDifferences).toEqual(scorecard);
    expect(next.verdict).toBe(mock!.verdict);

    const schemas = comparisonPageSchema(next) as Array<Record<string, unknown>>;
    const faqPage = schemas.find((s) => s["@type"] === "FAQPage") as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
      speakable: { "@type": string };
    };
    expect(faqPage).toBeTruthy();
    expect(faqPage.speakable["@type"]).toBe("SpeakableSpecification");
    expect(faqPage.mainEntity).toHaveLength(overlay!.faqs.length);
    expect(faqPage.mainEntity.map((q) => q.name)).toEqual(BRIEF_PS5_FAQS);
    expect(faqPage.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(
      overlay!.faqs.map((f) => f.answer),
    );
  });

  it("uses live GPU, SSD, price, storage, and subscription figures", () => {
    const overlay = getEditorialAeoOverlay("ps5-vs-xbox-series-x")!;
    const allowed = mockPs5AllowedNumbers();
    for (const n of ["825", "11.99", "9.99", "280", "500", "25", "15", "40", "000", "1", "4", "360"]) {
      allowed.add(n);
    }
    const prose = overlayProse(overlay);

    for (const n of numbersIn(prose)) {
      expect(allowed.has(n), `overlay invented number ${n} not present in live ps5-vs-xbox-series-x figures`).toBe(true);
    }

    expect(prose).toMatch(/12 TFLOPS vs 10\.28 TFLOPS/);
    expect(prose).toMatch(/5\.5 GB\/s vs 2\.4 GB\/s/);
    expect(prose).toMatch(/\$499/);
    expect(prose).toMatch(/825 GB usable/);
    expect(prose).toMatch(/\$11\.99\/month versus \$9\.99\/month/);
    expect(prose).not.toMatch(/\b50\s*M/i);
    expect(prose).not.toMatch(/12\.15/);
    expect(prose).not.toMatch(/\$15/);
    expect(prose).not.toMatch(/\b21\s*M/i);
    expect(prose).not.toMatch(/4K/);
  });

  it("does not self-contradict quoted (A vs B) order", () => {
    const overlay = getEditorialAeoOverlay("ps5-vs-xbox-series-x")!;
    expect(
      findSelfContradictions({
        shortAnswer: overlay.shortAnswer,
        quickAnswer: overlay.quickAnswer,
        faqs: overlay.faqs,
      }),
    ).toHaveLength(0);
  });
});

function mockAllowedNumbers(slug: string): Set<string> {
  const mock = getMockComparison(slug);
  if (!mock) throw new Error(`expected ${slug} mock comparison`);
  const texts = [
    mock.shortAnswer,
    mock.verdict,
    mock.metadata.metaTitle,
    mock.metadata.metaDescription,
    ...mock.keyDifferences.flatMap((d) => [d.label, d.entityAValue, d.entityBValue]),
    ...mock.faqs.flatMap((f) => [f.question, f.answer]),
    ...mock.entities.flatMap((e) => [e.name, e.shortDesc, e.bestFor, ...(e.pros || []), ...(e.cons || [])]),
    ...mock.attributes.flatMap((a) => [a.name, a.unit, ...a.values.map((v) => v.valueText)]),
  ];
  const set = new Set<string>();
  for (const t of texts) {
    if (!t) continue;
    for (const n of numbersIn(t)) set.add(n);
  }
  return set;
}

function expectCitationOverlay(
  slug: string,
  questions: string[],
  extraNumbers: string[] = [],
) {
  const overlay = getEditorialAeoOverlay(slug);
  expect(overlay).toBeTruthy();
  expect(overlay!.faqs).toHaveLength(questions.length);
  expect(overlay!.faqs.map((f) => f.question)).toEqual(questions);
  expect(overlay!.quickAnswer.tldr).toBe(overlay!.shortAnswer);
  expect(overlay!.quickAnswer.winnerName).toBeNull();

  const mock = getMockComparison(slug);
  expect(mock).toBeTruthy();
  const scorecard = mock!.keyDifferences.map((d) => ({ ...d }));
  const next = applyEditorialAeoOverlay(mock!);
  expect(next.shortAnswer).toBe(overlay!.shortAnswer);
  expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
  expect(next.faqs).toEqual(overlay!.faqs);
  expect(next.keyDifferences).toEqual(scorecard);
  expect(next.verdict).toBe(mock!.verdict);

  const schemas = comparisonPageSchema(next) as Array<Record<string, unknown>>;
  const faqPage = schemas.find((s) => s["@type"] === "FAQPage") as {
    mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    speakable: { "@type": string };
  };
  expect(faqPage).toBeTruthy();
  expect(faqPage.speakable["@type"]).toBe("SpeakableSpecification");
  expect(faqPage.mainEntity).toHaveLength(overlay!.faqs.length);
  expect(faqPage.mainEntity.map((q) => q.name)).toEqual(questions);
  expect(faqPage.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(
    overlay!.faqs.map((f) => f.answer),
  );

  const allowed = mockAllowedNumbers(slug);
  for (const n of extraNumbers) allowed.add(n);
  const prose = overlayProse(overlay!);
  for (const n of numbersIn(prose)) {
    expect(allowed.has(n), `overlay invented number ${n} not present in mock or live ${slug} figures`).toBe(true);
  }

  expect(
    findSelfContradictions({
      shortAnswer: overlay!.shortAnswer,
      quickAnswer: overlay!.quickAnswer,
      faqs: overlay!.faqs,
    }),
  ).toHaveLength(0);
}

describe("figma-vs-sketch citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 8 visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("sketch-vs-figma")).toBeNull();
    expectCitationOverlay("figma-vs-sketch", BRIEF_FIGMA_FAQS);
  });

  it("keeps winnerName null and cites live share, seats, and prices", () => {
    const overlay = getEditorialAeoOverlay("figma-vs-sketch")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/~80% of designers vs ~15% of designers/);
    expect(prose).toMatch(/4M\+ vs ~1M/);
    expect(prose).toMatch(/Free \/ \$12\+\/mo/);
    expect(prose).toMatch(/\$9\/mo or \$99\/yr/);
    expect(prose).toMatch(/Neither is named the winner/);
    expect(prose).not.toMatch(/3 projects/);
    expect(prose).not.toMatch(/\b20\s*billion/i);
    expect(prose).not.toMatch(/\b2023\b/);
  });
});

describe("canva-vs-photoshop citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 8 visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("photoshop-vs-canva")).toBeNull();
    expectCitationOverlay("canva-vs-photoshop", BRIEF_CANVA_FAQS, ["000", "10", "12.99"]);
  });

  it("keeps winnerName null and cites both printed Canva prices without inventing a third", () => {
    const overlay = getEditorialAeoOverlay("canva-vs-photoshop")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/Free\/\$13\/mo vs \$22\.99\/mo/);
    expect(prose).toMatch(/Free \/ \$12\.99/);
    expect(prose).toMatch(/170M\+ registered users/);
    expect(prose).toMatch(/~30M paid subscribers|about 30M paid subscribers/);
    expect(prose).toMatch(/not the same kind of count/);
    expect(prose).toMatch(/10,000\+/);
    expect(prose).toMatch(/massive/);
    expect(prose).not.toMatch(/\b54\.99\b/);
    expect(prose).not.toMatch(/\b250,?000\b/);
  });
});

describe("chatgpt-vs-gemini citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 8 visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("gemini-vs-chatgpt")).toBeNull();
    expectCitationOverlay("chatgpt-vs-gemini", BRIEF_CHATGPT_FAQS, [
      "1",
      "000",
      "128",
      "256",
      "32",
      "65",
      "2.50",
      "0.075",
      "0.8",
      "1.2",
      "2024",
    ]);
  });

  it("keeps winnerName null, treats monthly users as a tie, and marks missing specs unknown", () => {
    const overlay = getEditorialAeoOverlay("chatgpt-vs-gemini")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/1,000,000 tokens vs 128,000 tokens/);
    expect(prose).toMatch(/256,000 tokens/);
    expect(prose).toMatch(/\$2\.50/);
    expect(prose).toMatch(/\$0\.075/);
    expect(prose).toMatch(/0\.8 seconds vs 1\.2 seconds/);
    expect(prose).not.toMatch(/200M/);
    expect(prose).not.toMatch(/\$19\.99/);
    expect(prose).not.toMatch(/GPT-3\.5/);
    expect(prose).not.toMatch(/DALL-E/);
    expect(prose).not.toMatch(/94\.2/);
    expect(prose).not.toMatch(/HumanEval/);
    expect(prose).not.toMatch(/benchmark/i);
  });
});

describe("cursor-vs-copilot citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 8 visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("copilot-vs-cursor")).toBeNull();
    expect(getEditorialAeoOverlay("cursor-vs-github-copilot")).toBeNull();
    expectCitationOverlay("cursor-vs-copilot", BRIEF_CURSOR_FAQS);
  });

  it("keeps winnerName null and cites only printed plan prices", () => {
    const overlay = getEditorialAeoOverlay("cursor-vs-copilot")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/\$10\/mo vs \$20\/mo/);
    expect(prose).toMatch(/roughly \$192\/yr vs \$100\/yr/);
    expect(prose).toMatch(/\$40\/user\/mo vs \$19\/user\/mo/);
    expect(prose).toMatch(/\$39\/mo/);
    expect(prose).toMatch(/\$39\/user\/mo/);
    expect(prose).toMatch(/two months free annually/);
    expect(prose).toMatch(/effectively a tie/);
    expect(prose).toMatch(/SOC 2/);
    expect(prose).not.toMatch(/\b3\.7\b/);
    expect(prose).not.toMatch(/\bGPT-4o\b/);
    expect(prose).not.toMatch(/\b55\b/);
    expect(prose).not.toMatch(/\b2,?000\b/);
    expect(prose).not.toMatch(/\b128\b/);
    expect(prose).not.toMatch(/\b63\b/);
    expect(prose).not.toMatch(/context window/i);
  });
});

describe("android-vs-ios citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 7 visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("ios-vs-android")).toBeNull();
    expectCitationOverlay("android-vs-ios", BRIEF_ANDROID_FAQS, ["71", "2025"]);
  });

  it("keeps winnerName null and cites the extra-row share, not the shadowed base cells", () => {
    const overlay = getEditorialAeoOverlay("android-vs-ios")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/72% vs 28%/);
    expect(prose).toMatch(/2–3 years/);
    expect(prose).toMatch(/5–6 years/);
    expect(prose).toMatch(/extensive/i);
    expect(prose).toMatch(/limited/i);
    expect(prose).toMatch(/excellent/i);
    expect(prose).toMatch(/Neither is named the winner/);
    expect(prose).not.toMatch(/~27%/);
    expect(prose).not.toMatch(/~44%/);
    expect(prose).not.toMatch(/~56%/);
    expect(prose).not.toMatch(/2-4/);
    expect(prose).not.toMatch(/2x/);
  });
});

describe("nvidia-vs-amd citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 7 visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("amd-vs-nvidia")).toBeNull();
    expectCitationOverlay("nvidia-vs-amd", BRIEF_NVIDIA_FAQS);
  });

  it("keeps winnerName null and cites both printed market-cap figures without the shadowed base specs", () => {
    const overlay = getEditorialAeoOverlay("nvidia-vs-amd")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/\$2\.5T\+ vs \$250B/);
    expect(prose).toMatch(/\$2\.5 trillion versus \$250 billion/);
    expect(prose).toMatch(/80% vs 20%/);
    expect(prose).toMatch(/dominant versus growing/i);
    expect(prose).not.toMatch(/\$2T\+/);
    expect(prose).not.toMatch(/\b4090\b/);
    expect(prose).not.toMatch(/\b7800\b/);
    expect(prose).not.toMatch(/\$300/);
    expect(prose).not.toMatch(/\bH100\b/);
    expect(prose).not.toMatch(/\bA100\b/);
    expect(prose).not.toMatch(/\bMI300X\b/);
    expect(prose).not.toMatch(/~80%/);
  });
});

describe("us-economy-vs-china-economy citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 7 visible FAQs 1:1 with FAQPage", () => {
    expectCitationOverlay("us-economy-vs-china-economy", BRIEF_US_ECONOMY_CHINA_FAQS, [
      "17.9",
      "398",
      "720",
      "2025",
      "2026",
      "4.6",
      "4.8",
      "2.0",
    ]);
  });

  it("keeps winnerName null and cites only the extra-row scorecard", () => {
    const overlay = getEditorialAeoOverlay("us-economy-vs-china-economy")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/\$25\.5 trillion vs \$17\.9 trillion/);
    expect(prose).toMatch(/\$25\.5T versus \$17\.7T/);
    expect(prose).toMatch(/\$76,398 vs \$12,720/);
    expect(prose).toMatch(/\$76,300 versus \$12,500/);
    expect(prose).toMatch(/30% vs 16%/);
    expect(prose).toMatch(/4\.5% vs 2\.5%/);
    expect(prose).toMatch(/Neither is named the winner/);
    expect(prose).not.toMatch(/27\.4/);
    expect(prose).not.toMatch(/29\.4/);
    expect(prose).not.toMatch(/30\+/);
    expect(prose).not.toMatch(/\$35T/);
    expect(prose).not.toMatch(/5\.2%/);
    expect(prose).not.toMatch(/80,300/);
    expect(prose).not.toMatch(/\$46T/);
    expect(prose).not.toMatch(/125%/);
  });
});

describe("usa-vs-china citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and 7 visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("china-vs-usa")).toBeNull();
    expectCitationOverlay("usa-vs-china", BRIEF_USA_CHINA_FAQS, [
      "398",
      "556",
      "2026",
      "0.340",
      "1.42",
    ]);
  });

  it("keeps winnerName null and cites the extra-row scorecard, not the shadowed base cells", () => {
    const overlay = getEditorialAeoOverlay("usa-vs-china")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/\$25\.5 trillion vs \$17\.7 trillion/);
    expect(prose).toMatch(/1\.4 billion vs 333 million/);
    expect(prose).toMatch(/\$877 billion vs \$292 billion/);
    expect(prose).toMatch(/\$76,300 vs \$12,500/);
    expect(prose).toMatch(/#1 for China and #2 for the United States|#2 for the United States and #1 for China/);
    expect(prose).toMatch(/0\.340 billion/);
    expect(prose).not.toMatch(/27\.4/);
    expect(prose).not.toMatch(/335M/);
    expect(prose).not.toMatch(/\$916B/);
    expect(prose).not.toMatch(/80,300/);
    expect(prose).not.toMatch(/5,550/);
    expect(prose).not.toMatch(/26\.9/);
    expect(prose).not.toMatch(/\$886/);
  });
});

describe("lyft-vs-uber citation AEO overlay", () => {
  it("is the substitute for the military slug, which has no in-repo comparison", () => {
    expect(getMockComparison("china-vs-us-gdp-military-tech-comparison-2026")).toBeNull();
    expect(getEditorialAeoOverlay("china-vs-us-gdp-military-tech-comparison-2026")).toBeNull();
    expect(getMockComparison("lyft-vs-uber")).toBeNull();
    expect(getEditorialAeoOverlay("uber-vs-lyft")).toBeNull();
  });

  it("rewrites speakable Quick Answer and 7 visible FAQs 1:1 with FAQPage", () => {
    const overlay = getEditorialAeoOverlay("lyft-vs-uber");
    expect(overlay).toBeTruthy();
    expect(overlay!.faqs.map((f) => f.question)).toEqual(BRIEF_LYFT_UBER_FAQS);
    expect(overlay!.quickAnswer.tldr).toBe(overlay!.shortAnswer);
    expect(overlay!.quickAnswer.winnerName).toBeNull();

    const page: ComparisonPageData = {
      id: "lyft-vs-uber",
      slug: "lyft-vs-uber",
      title: "Uber vs Lyft",
      shortAnswer: "Old buried answer.",
      verdict: "Existing verdict.",
      category: "companies",
      entities: [
        { id: "uber", slug: "uber", name: "Uber Technologies Inc.", shortDesc: null, imageUrl: null, entityType: "company", position: 0, pros: [], cons: [], bestFor: null },
        { id: "lyft", slug: "lyft", name: "Lyft Inc.", shortDesc: null, imageUrl: null, entityType: "company", position: 1, pros: [], cons: [], bestFor: null },
      ],
      attributes: [],
      keyDifferences: [
        { label: "US Rideshare Market Share", entityAValue: "71%", entityBValue: "29%", winner: "a" },
      ],
      faqs: [{ question: "Old Q", answer: "Old A" }],
      relatedComparisons: [],
      relatedBlogPosts: [],
      metadata: {
        metaTitle: "Uber vs Lyft",
        metaDescription: "Compare Uber and Lyft.",
        publishedAt: "2024-06-15T00:00:00Z",
        updatedAt: "2026-09-22T00:00:00Z",
        isAutoGenerated: false,
        isHumanReviewed: true,
        viewCount: 1,
        status: "published",
      },
    };
    const scorecard = page.keyDifferences.map((d) => ({ ...d }));
    const next = applyEditorialAeoOverlay(page);
    expect(next.shortAnswer).toBe(overlay!.shortAnswer);
    expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
    expect(next.faqs).toEqual(overlay!.faqs);
    expect(next.keyDifferences).toEqual(scorecard);
    expect(next.verdict).toBe(page.verdict);

    const schemas = comparisonPageSchema(next) as Array<Record<string, unknown>>;
    const faqPage = schemas.find((s) => s["@type"] === "FAQPage") as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
      speakable: { "@type": string };
    };
    expect(faqPage.speakable["@type"]).toBe("SpeakableSpecification");
    expect(faqPage.mainEntity.map((q) => q.name)).toEqual(BRIEF_LYFT_UBER_FAQS);
    expect(faqPage.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(
      overlay!.faqs.map((f) => f.answer),
    );

    const allowed = new Set<string>();
    for (const cell of LYFT_UBER_SCORECARD) {
      for (const n of numbersIn(cell)) allowed.add(n);
    }
    const prose = overlayProse(overlay!);
    for (const n of numbersIn(prose)) {
      expect(allowed.has(n), `overlay invented number ${n} not on the lyft-vs-uber scorecard`).toBe(true);
    }
    expect(prose).not.toMatch(/\b2026\b/);
    expect(
      findSelfContradictions({
        shortAnswer: overlay!.shortAnswer,
        quickAnswer: overlay!.quickAnswer,
        faqs: overlay!.faqs,
      }),
    ).toHaveLength(0);
  });

  it("keeps winnerName null and cites the published scorecard, not the uber-vs-lyft mock", () => {
    const overlay = getEditorialAeoOverlay("lyft-vs-uber")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/72 countries across 6 continents/);
    expect(prose).toMatch(/US and Canada only/);
    expect(prose).toMatch(/71% vs 29%/);
    expect(prose).toMatch(/25–30%/);
    expect(prose).toMatch(/about 25%/);
    expect(prose).toMatch(/\$38\.1 billion/);
    expect(prose).toMatch(/\$38\.7 billion/);
    expect(prose).toMatch(/\$4\.3 billion/);
    expect(prose).toMatch(/6\+ million globally/);
    expect(prose).toMatch(/600,000–700,000 in North America/);
    expect(prose).toMatch(/4\.6\+ star/);
    expect(prose).toMatch(/tie/i);
    expect(prose).toMatch(/Neither is named the winner/);
    expect(prose).not.toMatch(/\b68%/);
    expect(prose).not.toMatch(/\$37/);
    expect(prose).not.toMatch(/\$4\.4B/);
    expect(prose).not.toMatch(/75-80%/);
    expect(prose).not.toMatch(/75–80%/);
    expect(prose).not.toMatch(/\b70\+/);
  });
});

describe("AEO overlay scope", () => {
  it("leaves unrelated slugs untouched", () => {
    const page = stubGdpPage();
    page.slug = "neymar-vs-mbappe";
    expect(applyEditorialAeoOverlay(page)).toBe(page);
  });

  it("has no overlay for signal-vs-whatsapp", () => {
    expect(getEditorialAeoOverlay("signal-vs-whatsapp")).toBeNull();
  });

  it("keeps citation copy free of page-furniture phrasing", () => {
    for (const slug of CITATION_SLUGS) {
      const overlay = getEditorialAeoOverlay(slug);
      expect(overlay, slug).toBeTruthy();
      const prose = overlayProse(overlay!);
      const hit = prose.match(PAGE_FURNITURE);
      expect(hit, `${slug} contains banned phrasing ${hit?.[0]}`).toBeNull();
      expect(overlay!.quickAnswer.winnerName, slug).toBeNull();
      expect(prose, slug).toMatch(/Neither is named the winner/);
      expect(
        findSelfContradictions({
          shortAnswer: overlay!.shortAnswer,
          quickAnswer: overlay!.quickAnswer,
          faqs: overlay!.faqs,
        }),
        slug,
      ).toHaveLength(0);
    }
  });
});
