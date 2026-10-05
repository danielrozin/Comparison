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
  "Is China’s economy bigger than the US?",
  "What is US vs China nominal GDP?",
  "Which country spends more on its military, the United States or China?",
  "Why can nominal GDP totals for the US and China differ?",
  "What is GDP per capita for the US vs China?",
  "Will China overtake the US in nominal GDP this decade?",
  "Which GDP measure should journalists and students cite?",
];

const BRIEF_JAPAN_CHINA_FAQS = [
  "Is China’s economy bigger than Japan’s?",
  "What is Japan vs China GDP?",
  "What is Japan vs China GDP per capita?",
  "Which country has the larger population, Japan or China?",
  "Which country spends more on defence, Japan or China?",
  "Which country has higher life expectancy, Japan or China?",
];

const BRIEF_MESSI_FAQS = [
  "Who is better, Messi or Ronaldo?",
  "Who has more Ballon d'Or awards, Messi or Ronaldo?",
  "Who won the World Cup, Messi or Ronaldo?",
];

const BRIEF_PS5_FAQS = [
  "Which console is better, PS5 or Xbox Series X?",
  "Which has the higher GPU rating, PS5 or Xbox Series X?",
  "What is the SSD speed of the PS5 vs the Xbox Series X?",
  "Which should you buy, a PS5 or an Xbox Series X?",
];

const BRIEF_FIGMA_FAQS = [
  "Which is better, Figma or Sketch?",
  "Does Figma work on Windows, and does Sketch?",
  "Is Figma free?",
];

const BRIEF_CANVA_FAQS = [
  "Which is better, Canva or Photoshop?",
  "Is Canva replacing Photoshop?",
  "Which is the better fit for a simple layout, Canva or Photoshop?",
  "Which is the better fit for photo editing, Canva or Photoshop?",
];

const BRIEF_CURSOR_FAQS = [
  "Which is better, Cursor or GitHub Copilot?",
  "How much do Cursor and GitHub Copilot cost?",
  "Which works in more editors, Cursor or GitHub Copilot?",
  "What are the Cursor and Copilot team prices?",
];

const BRIEF_ANDROID_FAQS = [
  "Which is better, Android or iOS?",
  "What is Android vs iOS global market share?",
];

const BRIEF_NVIDIA_FAQS = [
  "Which is better, NVIDIA or AMD?",
  "Which company has the larger market value, NVIDIA or AMD?",
  "Who designs CPUs, NVIDIA or AMD?",
];

const BRIEF_US_ECONOMY_CHINA_FAQS = [
  "Which economy is bigger, the US or China?",
  "What is US vs China nominal GDP?",
  "What is GDP per capita for the US vs China?",
  "Which economy is growing faster, the US or China?",
  "Is there one overall winner between the US and China economies?",
];

const BRIEF_USA_CHINA_FAQS = [
  "Which is ahead, the USA or China?",
  "What is USA vs China GDP?",
  "Which country has the larger population, the USA or China?",
  "Which country spends more on the military, the USA or China?",
  "What is GDP per capita for the USA vs China?",
];

const BRIEF_LYFT_UBER_FAQS = [
  "Which is bigger, Uber or Lyft?",
  "Where do Uber and Lyft operate?",
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
  "$43.978 billion, FY2024",
  "$5.786 billion, FY2024",
  "2024",
  "6+ million globally",
  "600,000-700,000 in North America",
  "4.6+ stars to remain active",
  "2024 Annual Revenue",
];

const BRIEF_CHATGPT_FAQS = [
  "Which AI is better, ChatGPT or Gemini?",
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
    const nominal = next.keyDifferences.find((row) => row.label === "Nominal GDP");
    expect(nominal?.entityAValue).toContain("$32.38 trillion");
    expect(nominal?.entityBValue).toContain("$20.85 trillion");
    expect(next.keyDifferences.some((row) => row.entityAValue.includes("$30+"))).toBe(false);
  });

  it("states the IMF April 2026 figures and does not repeat conflicting dollar totals", () => {
    const overlay = getEditorialAeoOverlay("us-vs-china-gdp")!;
    const blob = overlayProse(overlay);
    expect(blob).toMatch(/The IMF estimates US nominal GDP at \$32\.38 trillion in 2026/);
    expect(blob).toMatch(/\$32\.38 trillion vs \$20\.85 trillion/);
    expect(blob).toMatch(/\$94,430 vs \$14,874/);
    expect(blob).toMatch(/\$997 billion vs \$314 billion/);
    expect(blob).toMatch(/growing faster/);
    expect(blob).not.toMatch(/2\.3%/);
    expect(blob).not.toMatch(/4\.4%/);
    expect(blob).toMatch(/Neither is named the winner/);
    expect(blob).not.toMatch(/\$28\.7/);
    expect(blob).not.toMatch(/\$30\+/);
    expect(blob).not.toMatch(/\$17\.9/);
    expect(blob).not.toMatch(/\$89,000/);
    expect(blob).not.toMatch(/\$925\.8/);
    expect(blob).not.toMatch(/\$28\.8/);
    expect(blob).not.toMatch(/\$18\.5/);
    expect(blob).not.toMatch(/282%/);
    expect(blob).not.toMatch(/126%/);
    expect(overlay.quickAnswer.winnerName).toBeNull();
    expect(overlay.resources?.some((resource) => resource.url.includes("datamapper/api/v1/NGDPD"))).toBe(true);
  });
});

describe("japan-vs-china citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and FAQ to the citation questions", () => {
    const overlay = getEditorialAeoOverlay("japan-vs-china");
    expect(overlay).toBeTruthy();
    expect(overlay!.faqs).toHaveLength(BRIEF_JAPAN_CHINA_FAQS.length);
    expect(overlay!.faqs.map((f) => f.question)).toEqual(BRIEF_JAPAN_CHINA_FAQS);

    const original = stubJapanChinaPage();
    const next = applyEditorialAeoOverlay(original);
    expect(next.shortAnswer).toBe(overlay!.shortAnswer);
    expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
    expect(next.faqs.map((f) => f.question)).toEqual(BRIEF_JAPAN_CHINA_FAQS);
    const gdp = next.keyDifferences.find((row) => row.label === "Nominal GDP");
    expect(gdp?.entityAValue).toContain("$4.38 trillion");
    expect(gdp?.entityBValue).toContain("$20.85 trillion");
    const life = next.keyDifferences.find((row) => row.label === "Life expectancy");
    expect(life?.entityAValue).toContain("84.04");
    expect(life?.entityBValue).toContain("78.02");
    const hdi = next.attributes.find((attr) => attr.name === "HDI");
    expect(hdi?.values.find((value) => value.entityId === "ent-4")?.valueText).toContain("High");
    expect(hdi?.values.find((value) => value.entityId === "ent-4")?.valueText).not.toMatch(/Very high/);
    expect(next.keyDifferences.some((row) => row.label === "Population")).toBe(true);
    expect(next.verdict).toBe(original.verdict);
  });

  it("states the official totals and does not repeat euros or the old life-expectancy pair", () => {
    const overlay = getEditorialAeoOverlay("japan-vs-china")!;
    const perCapita = overlay.faqs.find((f) => f.question.includes("per capita"));
    expect(perCapita?.answer).toMatch(/higher in Japan/);
    const blob = overlayProse(overlay);
    expect(blob).toMatch(/The IMF estimates Japan’s 2026 real GDP growth at 0\.7%/);
    expect(blob).toMatch(/4\.4% vs 0\.7%/);
    expect(blob).toMatch(/\$314 billion vs \$55\.3 billion/);
    expect(blob).toMatch(/larger than Japan’s in nominal terms/);
    expect(blob).toMatch(/live longer/);
    expect(blob).not.toMatch(/\$20\.85/);
    expect(blob).not.toMatch(/\$4\.38/);
    expect(blob).not.toMatch(/\$35,703/);
    expect(blob).not.toMatch(/84\.04/);
    expect(blob).not.toMatch(/78\.02/);
    expect(blob).not.toMatch(/0\.797/);
    expect(blob).not.toMatch(/0\.925/);
    expect(blob).not.toMatch(/€/);
    expect(blob).not.toMatch(/0\.920/);
    expect(blob).not.toMatch(/84\.6/);
    expect(blob).not.toMatch(/377,975/);
    expect(blob).not.toMatch(/Very High/);
    expect(blob).not.toMatch(/1\.417/);
    expect(blob).not.toMatch(/1\.42/);
  });
});

describe("Messi vs Ronaldo Copilot AEO overlay", () => {
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    const overlay = getEditorialAeoOverlay("messi-vs-ronaldo");
    expect(overlay).toBeTruthy();
    expect(overlay!.faqs).toHaveLength(BRIEF_MESSI_FAQS.length);
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

  it("keeps the Ballon d'Or count and the 2022 World Cup, and drops unverified goal totals", () => {
    const overlay = getEditorialAeoOverlay("messi-vs-ronaldo")!;
    const allowed = mockMessiAllowedNumbers();
    const prose = overlayProse(overlay);

    for (const n of numbersIn(prose)) {
      expect(allowed.has(n), `overlay invented number ${n} not present in mock messi-vs-ronaldo data`).toBe(true);
    }

    expect(prose).toMatch(/8 Ballon d'Or/);
    expect(prose).toMatch(/won 5/);
    expect(prose).toMatch(/2022 World Cup/);
    expect(prose).not.toMatch(/\b14[0-9]\b/);
    expect(prose).not.toMatch(/\b900\b/);
    expect(prose).not.toMatch(/\b810\b/);
    expect(prose).not.toMatch(/\b890\b/);
    expect(prose).not.toMatch(/\b895\b/);
    expect(prose).not.toMatch(/\b838\b/);
    expect(prose).not.toMatch(/\b899\b/);
    expect(prose).not.toMatch(/\b369\b/);
    expect(prose).not.toMatch(/\b112\b/);
    expect(prose).not.toMatch(/Champions League/);
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
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    const overlay = getEditorialAeoOverlay("ps5-vs-xbox-series-x");
    expect(overlay).toBeTruthy();
    expect(overlay!.faqs).toHaveLength(BRIEF_PS5_FAQS.length);
    expect(overlay!.faqs.map((f) => f.question)).toEqual(BRIEF_PS5_FAQS);
    expect(overlay!.quickAnswer.tldr).toBe(overlay!.shortAnswer);
    expect(overlay!.quickAnswer.winnerName).toBeNull();
    expect(getEditorialAeoOverlay("playstation-5-vs-xbox-series-x")).toBeNull();

    const mock = getMockComparison("ps5-vs-xbox-series-x");
    expect(mock).toBeTruthy();
    const next = applyEditorialAeoOverlay(mock!);
    expect(next.shortAnswer).toBe(overlay!.shortAnswer);
    expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
    expect(next.faqs).toEqual(overlay!.faqs);
    expect(next.faqs.map((f) => f.question)).toEqual(BRIEF_PS5_FAQS);
    const gpu = next.keyDifferences.find((row) => row.label === "GPU");
    expect(gpu?.entityAValue).toContain("10.3 TFLOPS");
    expect(gpu?.entityBValue).toContain("12 TFLOPS");
    const drive = next.keyDifferences.find((row) => row.label === "SSD capacity");
    expect(drive?.entityAValue).toMatch(/825GB/);
    expect(drive?.entityAValue).toMatch(/drive size/);
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

  it("keeps the official SSD speeds and drops figures that do not match one official spec", () => {
    const overlay = getEditorialAeoOverlay("ps5-vs-xbox-series-x")!;
    const allowed = mockPs5AllowedNumbers();
    const prose = overlayProse(overlay);

    for (const n of numbersIn(prose)) {
      expect(allowed.has(n), `overlay invented number ${n} not present in live ps5-vs-xbox-series-x figures`).toBe(true);
    }

    expect(prose).toMatch(/5\.5 GB\/s vs 2\.4 GB\/s/);
    expect(prose).toMatch(/12 TFLOPS vs 10\.3 TFLOPS/);
    expect(prose).toMatch(/825GB/);
    expect(prose).toMatch(/drive size/);
    expect(prose).not.toMatch(/10\.28/);
    expect(prose).not.toMatch(/\$499/);
    expect(prose).not.toMatch(/11\.99/);
    expect(prose).not.toMatch(/9\.99/);
    expect(prose).not.toMatch(/\b50\s*M/i);
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
  if (overlay!.metricMerge && overlay!.facts) {
    for (const fact of overlay!.facts) {
      const row = next.keyDifferences.find((diff) => diff.label === fact.label);
      expect(row, `${slug} ${fact.label}`).toBeTruthy();
      const texts = [row!.entityAValue, row!.entityBValue];
      for (const cell of fact.cells) {
        expect(texts, `${slug} ${fact.label}`).toContain(cell.text);
      }
    }
  } else {
    expect(next.keyDifferences).toEqual(scorecard);
  }
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
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("sketch-vs-figma")).toBeNull();
    expectCitationOverlay("figma-vs-sketch", BRIEF_FIGMA_FAQS);
  });

  it("keeps the browser and Mac-editor facts and drops unverified prices and shares", () => {
    const overlay = getEditorialAeoOverlay("figma-vs-sketch")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/web browser/);
    expect(prose).toMatch(/Mac app/);
    expect(prose).toMatch(/free Starter plan/);
    expect(prose).toMatch(/\$16\/mo/);
    expect(prose).toMatch(/does not list a \$9\/mo plan or a \$99\/yr plan/);
    expect(prose).toMatch(/Neither is named the winner/);
    expect(prose).not.toMatch(/~80%/);
    expect(prose).not.toMatch(/4M\+/);
    expect(prose).not.toMatch(/\$12\+/);
    expect(prose).not.toMatch(/3 projects/);
  });
});

describe("canva-vs-photoshop citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("photoshop-vs-canva")).toBeNull();
    expectCitationOverlay("canva-vs-photoshop", BRIEF_CANVA_FAQS);
  });

  it("keeps the product roles and drops conflicting prices and user counts", () => {
    const overlay = getEditorialAeoOverlay("canva-vs-photoshop")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/layouts made from templates/);
    expect(prose).toMatch(/photo editor/);
    expect(prose).not.toMatch(/\$13/);
    expect(prose).not.toMatch(/12\.99/);
    expect(prose).not.toMatch(/22\.99/);
    expect(prose).not.toMatch(/170M/);
    expect(prose).not.toMatch(/10,000/);
    expect(prose).not.toMatch(/\b54\.99\b/);
  });
});

describe("chatgpt-vs-gemini citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("gemini-vs-chatgpt")).toBeNull();
    expectCitationOverlay("chatgpt-vs-gemini", BRIEF_CHATGPT_FAQS);
  });

  it("names the makers and drops conflicting model specs", () => {
    const overlay = getEditorialAeoOverlay("chatgpt-vs-gemini")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/OpenAI makes ChatGPT/);
    expect(prose).toMatch(/Google makes Gemini/);
    expect(prose).not.toMatch(/1,000,000/);
    expect(prose).not.toMatch(/128,000/);
    expect(prose).not.toMatch(/256,000/);
    expect(prose).not.toMatch(/\$2\.50/);
    expect(prose).not.toMatch(/\$0\.075/);
    expect(prose).not.toMatch(/0\.8 seconds/);
    expect(prose).not.toMatch(/200M/);
    expect(prose).not.toMatch(/benchmark/i);
  });
});

describe("cursor-vs-copilot citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("copilot-vs-cursor")).toBeNull();
    expect(getEditorialAeoOverlay("cursor-vs-github-copilot")).toBeNull();
    expectCitationOverlay("cursor-vs-copilot", BRIEF_CURSOR_FAQS);
  });

  it("keeps winnerName null and cites only printed plan prices", () => {
    const overlay = getEditorialAeoOverlay("cursor-vs-copilot")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/\$10 per month vs \$20 per month/);
    expect(prose).toMatch(/Teams is \$40 per user per month/);
    expect(prose).toMatch(/\$39 per month/);
    expect(prose).toMatch(/\$100 per month/);
    expect(prose).not.toMatch(/\$192/);
    expect(prose).not.toMatch(/\$100\/yr/);
    expect(prose).not.toMatch(/\$19 per user/);
    expect(prose).not.toMatch(/two months free/);
    expect(prose).not.toMatch(/SOC 2/);
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
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("ios-vs-android")).toBeNull();
    expectCitationOverlay("android-vs-ios", BRIEF_ANDROID_FAQS);
  });

  it("keeps the worldwide-share direction and drops conflicting percentages", () => {
    const overlay = getEditorialAeoOverlay("android-vs-ios")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/67\.61% vs 32\.36%/);
    expect(prose).toMatch(/August 2026/);
    expect(prose).toMatch(/Neither is named the winner/);
    expect(prose).not.toMatch(/72%/);
    expect(prose).not.toMatch(/71%/);
    expect(prose).not.toMatch(/28%/);
    expect(prose).not.toMatch(/2–3 years/);
    expect(prose).not.toMatch(/5–6 years/);
    expect(prose).not.toMatch(/~27%/);
    expect(prose).not.toMatch(/~44%/);
    expect(prose).not.toMatch(/~56%/);
    expect(prose).not.toMatch(/2-4/);
    expect(prose).not.toMatch(/2x/);
  });
});

describe("nvidia-vs-amd citation AEO overlay", () => {
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("amd-vs-nvidia")).toBeNull();
    expectCitationOverlay("nvidia-vs-amd", BRIEF_NVIDIA_FAQS);
  });

  it("keeps winnerName null and cites both printed market-cap figures without the shadowed base specs", () => {
    const overlay = getEditorialAeoOverlay("nvidia-vs-amd")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/\$5\.563 trillion as of October 1, 2026/);
    expect(prose).toMatch(/\$1\.034 trillion as of October 2, 2026/);
    expect(prose).toMatch(/AMD designs CPUs/);
    expect(prose).not.toMatch(/\$2\.5T/);
    expect(prose).not.toMatch(/\$250B/);
    expect(prose).not.toMatch(/80% vs 20%/);
    expect(prose).not.toMatch(/dominant versus growing/i);
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
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    expectCitationOverlay("us-economy-vs-china-economy", BRIEF_US_ECONOMY_CHINA_FAQS);
  });

  it("keeps winnerName null and does not repeat conflicting dollar totals", () => {
    const overlay = getEditorialAeoOverlay("us-economy-vs-china-economy")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/larger than China’s in nominal terms/);
    expect(prose).toMatch(/Output per person is higher in the United States/);
    expect(prose).toMatch(/growing faster/);
    expect(prose).toMatch(/Neither is named the winner/);
    expect(prose).not.toMatch(/\$32\.38/);
    expect(prose).not.toMatch(/\$20\.85/);
    expect(prose).not.toMatch(/\$94,430/);
    expect(prose).not.toMatch(/2\.3%/);
    expect(prose).not.toMatch(/4\.4%/);
    expect(prose).not.toMatch(/\$25\.5/);
    expect(prose).not.toMatch(/\$17\.9/);
    expect(prose).not.toMatch(/\$17\.7/);
    expect(prose).not.toMatch(/30% vs 16%/);
    expect(prose).not.toMatch(/4\.5% vs 2\.5%/);
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
  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
    expect(getEditorialAeoOverlay("china-vs-usa")).toBeNull();
    expectCitationOverlay("usa-vs-china", BRIEF_USA_CHINA_FAQS);
  });

  it("keeps winnerName null and does not repeat conflicting counts", () => {
    const overlay = getEditorialAeoOverlay("usa-vs-china")!;
    expect(overlay.quickAnswer.winnerName).toBeNull();
    const prose = overlayProse(overlay);
    expect(prose).toMatch(/larger than China’s in nominal terms/);
    expect(prose).toMatch(/spends more on its military/);
    expect(prose).toMatch(/population is larger/);
    expect(prose).not.toMatch(/\$32\.38/);
    expect(prose).not.toMatch(/\$20\.85/);
    expect(prose).not.toMatch(/\$997/);
    expect(prose).not.toMatch(/\$314/);
    expect(prose).not.toMatch(/2\.3%/);
    expect(prose).not.toMatch(/4\.4%/);
    expect(prose).not.toMatch(/\$25\.5/);
    expect(prose).not.toMatch(/\$17\.7/);
    expect(prose).not.toMatch(/1\.4 billion/);
    expect(prose).not.toMatch(/\$877/);
    expect(prose).not.toMatch(/#1/);
    expect(prose).not.toMatch(/0\.340/);
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

  it("rewrites speakable Quick Answer and visible FAQs 1:1 with FAQPage", () => {
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
    const next = applyEditorialAeoOverlay(page);
    expect(next.shortAnswer).toBe(overlay!.shortAnswer);
    expect(next.quickAnswer?.tldr).toBe(overlay!.shortAnswer);
    expect(next.faqs).toEqual(overlay!.faqs);
    const revenue = next.keyDifferences.find((row) => row.label === "Annual Revenue");
    expect(revenue?.entityAValue).toContain("$43.978 billion");
    expect(revenue?.entityBValue).toContain("$5.786 billion");
    expect(next.keyDifferences.some((row) => row.entityAValue === "71%")).toBe(true);
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
    expect(prose).toMatch(/Uber reports 2024 revenue of \$43\.978 billion/);
    expect(prose).toMatch(/Lyft reports 2024 revenue of \$5\.786 billion/);
    expect(prose).toMatch(/\$43\.978 billion vs \$5\.786 billion/);
    expect(prose).toMatch(/United States and Canada/);
    expect(prose).toMatch(/Uber Eats/);
    expect(prose).toMatch(/cities around the world/);
    expect(prose).not.toMatch(/72 countries/);
    expect(prose).not.toMatch(/71%/);
    expect(prose).not.toMatch(/25–30%/);
    expect(prose).not.toMatch(/\$38\.1/);
    expect(prose).not.toMatch(/\$38\.7/);
    expect(prose).not.toMatch(/\$4\.3/);
    expect(prose).not.toMatch(/6\+ million/);
    expect(prose).not.toMatch(/4\.6/);
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
