import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Gatorade vs Powerade.
 * Facts read 19 October 2026 from powerade.com (product and FAQ), The Coca-Cola
 * Company brand page, gatorade.com (Thirst Quencher) and PepsiCo's Gatorade
 * history story. The electrolyte comparison is Powerade's own claim and is
 * credited to Powerade. No performance or health claims. No prices. No winner.
 */

const A = "gatorade";
const B = "powerade";

const GATORADE_TQ = "https://www.gatorade.com/products/gatorade-thirst-quencher";
const PEPSICO_HISTORY = "https://www.pepsico.com/newsroom/stories/2026/how-gatorade-started-sports-hydration";
const POWERADE_PRODUCT = "https://www.powerade.com/products/powerade.html";
const POWERADE_FAQ = "https://www.powerade.com/faqs.html";
const COKE_POWERADE = "https://www.coca-colacompany.com/brands/waters-and-hydration/powerade";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Sports drinks";

const SHORT_ANSWER =
  "Gatorade is PepsiCo's sports drink, created in 1965 by University of Florida physicians; Powerade is The Coca-Cola Company's, introduced in 1988. Both are sugar-sweetened electrolyte drinks with zero-sugar versions. Powerade lists 240mg sodium and 80mg potassium per 12 fl oz and says that is 50% more electrolytes than Gatorade Thirst Quencher, which it puts at 160mg and 50mg. Gatorade sweetens with sugar and dextrose; Powerade uses high fructose corn syrup. Neither is better for everyone.";

const FAQS = [
  {
    question: "Who makes Gatorade and Powerade?",
    answer:
      "Gatorade is a PepsiCo brand: Quaker Oats bought Gatorade's maker Stokely-Van Camp in 1983, and Quaker became part of PepsiCo in 2001. Powerade is part of The Coca-Cola Company and was introduced in 1988.",
  },
  {
    question: "Does Powerade have more electrolytes than Gatorade?",
    answer:
      "Powerade says it does. Powerade lists 240mg sodium and 80mg potassium per 12 fl oz and compares that with 160mg sodium and 50mg potassium for Gatorade Thirst Quencher, which it calls 50% more electrolytes.",
  },
  {
    question: "How much sugar is in Powerade?",
    answer:
      "Powerade lists 80 calories and 21g of added sugars per 12 fl oz, sweetened with high fructose corn syrup. Gatorade Thirst Quencher contains sugar and dextrose; Gatorade says Gatorade Lower Sugar has 75% less sugar than Thirst Quencher.",
  },
  {
    question: "Are there zero-sugar versions?",
    answer:
      "Yes. Gatorade Zero has zero sugar and, Gatorade says, the same electrolytes as Thirst Quencher. G2 is Gatorade's lower-calorie line. Powerade sells Powerade Zero.",
  },
  {
    question: "Where did Gatorade come from?",
    answer:
      "PepsiCo says University of Florida physicians led by Dr. Robert Cade created Gatorade in 1965, the drink appeared at the 1966 Orange Bowl, and national sales began in 1967.",
  },
  {
    question: "What bottle sizes do they come in?",
    answer:
      "Both list 12, 20 and 28 fl oz bottles for their core drink. Powerade says its bottles are BPA-free and recyclable.",
  },
];

const VERDICT = `Gatorade: PepsiCo's original sports drink from 1965, with Thirst Quencher, Zero, G2 and Lower Sugar lines.

Powerade: The Coca-Cola Company's drink from 1988, which says it carries 50% more electrolytes than Gatorade Thirst Quencher per 12 fl oz.

Compare the labels for sodium, potassium and sugar and pick the one that fits how you drink it.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Gatorade belongs to PepsiCo; Powerade belongs to The Coca-Cola Company.
- Powerade lists 240mg sodium and 80mg potassium per 12 fl oz.
- Powerade says Gatorade Thirst Quencher has 160mg sodium and 50mg potassium per 12 fl oz.
- Gatorade uses sugar and dextrose; Powerade uses high fructose corn syrup.
- Both sell zero-sugar versions: Gatorade Zero and Powerade Zero.

Ownership and history

PepsiCo says Gatorade was created in 1965 by University of Florida physicians led by Dr. Robert Cade, reached national sales in 1967, came to Quaker Oats with Stokely-Van Camp in 1983 and joined PepsiCo with Quaker in 2001. The Coca-Cola Company says Powerade was introduced in 1988.

Electrolytes

Powerade lists 240mg of sodium and 80mg of potassium per 12 fl oz. Powerade says that is 50% more electrolytes than Gatorade Thirst Quencher, which it lists at 160mg of sodium and 50mg of potassium per 12 fl oz. Gatorade says a 20 oz bottle of Thirst Quencher has about 270mg of sodium.

Sugar and ingredients

On its Mountain Berry Blast label, Powerade lists 80 calories and 21g of added sugars per 12 fl oz, with high fructose corn syrup and vitamins B12 and C. Gatorade Thirst Quencher contains sugar and dextrose. PepsiCo says Gatorade Lower Sugar has 75% less sugar than Thirst Quencher.

Product lines

1. Gatorade: Thirst Quencher, Gatorade Zero, G2 and Gatorade Lower Sugar.
2. Powerade: Powerade and Powerade Zero. Powerade says its drink is gluten free, kosher and soy-free.

Who should pick which

Pick by label: Powerade if you want more sodium and potassium per serving, Gatorade if you want sugar instead of corn syrup or a lower-sugar line. Coca-Cola vs Pepsi and Celsius vs Red Bull cover the same rivals in other drinks.`;

const BUILT = buildEditorialComparison({
  slug: "gatorade-vs-powerade",
  title: "Gatorade vs Powerade: Electrolytes, Sugar, Owners",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "brands",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Gatorade",
      shortDesc: "PepsiCo's sports drink, created in 1965, with Thirst Quencher, Zero, G2 and Lower Sugar lines.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: ["Sweetened with sugar and dextrose", "Zero, G2 and Lower Sugar options", "Gatorade Sports Science Institute research program"],
      cons: ["Powerade lists more sodium and potassium per 12 fl oz", "Thirst Quencher contains sugar"],
      bestFor: "Drinkers who want sugar rather than corn syrup or a lower-sugar line",
    },
    {
      id: B,
      slug: B,
      name: "Powerade",
      shortDesc: "The Coca-Cola Company's sports drink, introduced in 1988, with 240mg sodium per 12 fl oz.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: ["240mg sodium and 80mg potassium per 12 fl oz", "Vitamins B12 and C", "Gluten free, kosher and soy-free"],
      cons: ["Sweetened with high fructose corn syrup", "21g added sugars per 12 fl oz"],
      bestFor: "Drinkers who want more sodium and potassium per serving",
    },
  ],
  keyDifferences: [
    { label: "Owner", entityAValue: "PepsiCo", entityBValue: "The Coca-Cola Company", winner: "tie" },
    { label: "Sodium per 12 fl oz", entityAValue: "160mg (Powerade's figure for Thirst Quencher)", entityBValue: "240mg", winner: "tie" },
    { label: "Potassium per 12 fl oz", entityAValue: "50mg (Powerade's figure for Thirst Quencher)", entityBValue: "80mg", winner: "tie" },
    { label: "Sweetener", entityAValue: "Sugar and dextrose", entityBValue: "High fructose corn syrup", winner: "tie" },
  ],
  attributes: [
    textAttr("owner", "Owner", GROUP, A, B, "PepsiCo (via Quaker Oats, 2001)", "The Coca-Cola Company"),
    textAttr("launched", "Created", GROUP, A, B, "1965, University of Florida", "Introduced 1988"),
    textAttr("sodium", "Sodium", GROUP, A, B, "About 270mg per 20 oz bottle (Gatorade); 160mg per 12 fl oz (Powerade's figure)", "240mg per 12 fl oz"),
    textAttr("potassium", "Potassium per 12 fl oz", GROUP, A, B, "50mg (Powerade's figure)", "80mg"),
    textAttr("sweetener", "Sweetener", GROUP, A, B, "Sugar and dextrose", "High fructose corn syrup; 21g added sugars per 12 fl oz"),
    textAttr("zero", "Zero-sugar version", GROUP, A, B, "Gatorade Zero, same electrolytes as Thirst Quencher", "Powerade Zero"),
    textAttr("sizes", "Core bottle sizes", GROUP, A, B, "12, 20 and 28 oz", "12, 20 and 28 fl oz"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "coca-cola-vs-pepsi", title: "Coca-Cola vs Pepsi", category: "brands" },
    { slug: "celsius-vs-red-bull", title: "Celsius vs Red Bull", category: "brands" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Powerade for more sodium and potassium per serving; Gatorade for sugar instead of corn syrup and more low-sugar lines.",
    keyFact: "Powerade lists 240mg sodium and 80mg potassium per 12 fl oz and says Gatorade Thirst Quencher has 160mg and 50mg.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 16,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Gatorade: Thirst Quencher", url: GATORADE_TQ },
      { name: "PepsiCo: How Gatorade started sports hydration", url: PEPSICO_HISTORY },
      { name: "Powerade: Powerade", url: POWERADE_PRODUCT },
      { name: "Powerade: FAQs", url: POWERADE_FAQ },
      { name: "The Coca-Cola Company: Powerade", url: COKE_POWERADE },
    ],
  },
  resources: [
    { type: "external", label: "Gatorade: Thirst Quencher", url: GATORADE_TQ, description: "About 270mg sodium per 20 oz; sugar and dextrose; 12, 20 and 28 oz; Gatorade Zero and G2." },
    { type: "external", label: "PepsiCo: How Gatorade started sports hydration", url: PEPSICO_HISTORY, description: "July 28, 2026. Created 1965 at the University of Florida; Quaker 1983; PepsiCo 2001; Lower Sugar has 75% less sugar." },
    { type: "external", label: "Powerade: Powerade", url: POWERADE_PRODUCT, description: "Mountain Berry Blast, per 12 fl oz: 80 calories, 240mg sodium, 80mg potassium, 21g added sugars; vitamins B12 and C." },
    { type: "external", label: "Powerade: FAQs", url: POWERADE_FAQ, description: "Powerade's 50% more electrolytes claim against Gatorade Thirst Quencher (160mg sodium, 50mg potassium per 12 fl oz)." },
    { type: "external", label: "The Coca-Cola Company: Powerade", url: COKE_POWERADE, description: "Powerade is a Coca-Cola brand introduced in 1988." },
  ],
  metaTitle: "Gatorade vs Powerade | A Versus B",
});

BUILT.metadata.metaDescription =
  "Gatorade vs Powerade: owners, sodium and potassium per 12 fl oz, sugar and sweeteners, zero-sugar versions and bottle sizes, from the brands' own labels.";

export const GATORADE_VS_POWERADE: EditorialComparison = BUILT;
