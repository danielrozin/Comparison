import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Honda vs Ford, brand level, checked 3 October 2026.
 * History and lineup categories come from honda.com, automobiles.honda.com,
 * ford.com, fromtheroad.ford.com, and shareholder.ford.com.
 * Safety awards come from the IIHS 2026 Top Safety Pick lists.
 * No prices. No winner. The J.D. Power press release was not readable from
 * this check, so no dependability score is stated.
 */

const HONDA = "honda";
const FORD = "ford";

const HONDA_ABOUT = "https://www.honda.com/about";
const HONDA_HISTORY = "https://www.honda.com/history";
const HONDA_AUTOS = "https://automobiles.honda.com/";
const FORD_STOCK = "https://shareholder.ford.com/Information/stock/default.aspx";
const FORD_HOMES = "https://www.fromtheroad.ford.com/us/en/articles/2025/the-many-homes-of-ford-on-the-american-road";
const FORD_HOME = "https://www.ford.com/";
const FORD_CARS = "https://www.ford.com/cars/";
const FORD_SUVS = "https://www.ford.com/suvs/";
const FORD_TRUCKS = "https://www.ford.com/trucks/";
const FORD_ELECTRIC = "https://www.ford.com/electric/";
const FORD_POWER = "https://www.ford.com/powertrains/";
const IIHS_HONDA = "https://www.iihs.org/ratings/top-safety-picks/2026/all/honda";
const IIHS_FORD = "https://www.iihs.org/ratings/top-safety-picks/2026/all/ford";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const SPEC = "Lineup";

const SHORT_ANSWER =
  "Honda was founded in 1948 and Ford was incorporated on June 16, 1903. Both sell cars, SUVs, trucks, hybrids, and electric models. There is no winner.";

const FAQS = [
  {
    question: "When did Honda and Ford start?",
    answer:
      "Honda was founded in 1948 in Hamamatsu, Japan, and opened its first U.S. storefront in Los Angeles in 1959. Co-founders are Soichiro Honda and Takeo Fujisawa. American Honda Motor Co., Inc. was established in Los Angeles on June 11, 1959, as Honda's first overseas subsidiary. Henry Ford founded Ford Motor Company and incorporated it in Michigan on June 16, 1903.",
  },
  {
    question: "What kinds of vehicles does each brand sell?",
    answer:
      "Honda's U.S. lineup includes sedans (Civic and Accord), SUVs (HR-V, CR-V, Passport, Pilot, and Prologue), the Ridgeline pickup, and the Odyssey minivan, plus hybrid models and the hydrogen-electric CR-V e:FCEV. Ford groups its vehicles as hybrid and electric models, SUVs, crossovers, trucks, vans, and cars. The car is the Mustang. The SUVs are Expedition, Explorer, Bronco Sport, Bronco, and Mustang Mach-E. The trucks and vans are Super Duty, F-150, Ranger, Maverick, and Transit, including the 2027 electric E-Transit.",
  },
  {
    question: "Which models are hybrid or electric?",
    answer:
      "Honda's hybrids are Prelude Hybrid, CR-V Hybrid, Civic Hatchback Hybrid, Civic Sedan Hybrid, and Accord Hybrid. The Prologue is electrified, and the CR-V e:FCEV is a hydrogen model with an electric driving experience. Ford's available hybrids are the Maverick and the F-150. Ford's current electric models are Fathom (preorder, early 2027, not yet on sale), the 2026 Mustang Mach-E, and the 2027 E-Transit.",
  },
  {
    question: "What did IIHS award for 2026?",
    answer:
      "On the 2026 IIHS Top Safety Pick list for Honda, the Civic hatchback and Accord sedan are Top Safety Pick. The HR-V and Passport are Top Safety Pick+. On the Ford list, the Explorer and Mustang Mach-E are Top Safety Pick. IIHS says these awards pick strong results inside a size class for that year. A smaller vehicle with an award may still protect occupants less than a larger vehicle without one. Top Safety Pick has been awarded since the 2006 model year, and Top Safety Pick+ since 2013.",
  },
];

const VERDICT = `Honda fits a lineup built around Civic and Accord sedans, CR-V and Passport SUVs, the Ridgeline pickup, hybrids, and the electric Prologue.

Ford fits a lineup built around the Mustang, SUVs such as Explorer, Bronco, and Mustang Mach-E, trucks such as F-150 and Super Duty, vans, Maverick and F-150 hybrids, and electric models: Fathom (preorder, early 2027, not yet on sale), the 2026 Mustang Mach-E, and the 2027 E-Transit.

There is no single winner.`;

const EXPERT_ANALYSIS = `This is a brand comparison, not a score for one model. There is no winner.

History

Honda was founded in 1948 in Hamamatsu, Japan, and opened its first U.S. storefront in Los Angeles in 1959. Soichiro Honda and Takeo Fujisawa co-founded Honda Motor Co., Ltd., and the first original product, the Dream D-type motorcycle, came in 1949. American Honda was established in Los Angeles on June 11, 1959, as the first overseas subsidiary.

Henry Ford founded Ford Motor Company and incorporated it in Michigan on June 16, 1903. When the company was incorporated in 1903, the first headquarters was on Mack Avenue, where the first Model A was assembled.

Lineup categories

Honda's U.S. lineup includes sedans, hatchbacks, SUVs, a pickup, a minivan, hybrids, an electric Prologue, and the CR-V e:FCEV. Named models include Civic, Accord, HR-V, CR-V, Passport, Pilot, Ridgeline, Odyssey, Prelude Hybrid, and Prologue.

Ford sells hybrid and electric vehicles, SUVs, crossovers, trucks, vans, and cars. The car is the Mustang, as a coupe or convertible. The SUVs are Expedition, Explorer, Bronco Sport, Bronco, and Mustang Mach-E. The trucks and vans are Super Duty, F-150, Ranger, Maverick, Transit, and the 2027 electric E-Transit. Powertrains are grouped as gas, hybrid, electric, and diesel. Available hybrids are the Maverick and the F-150. Current electric models are Fathom (preorder, early 2027, not yet on sale), the 2026 Mustang Mach-E, and the 2027 E-Transit.

2026 IIHS awards

Honda: Civic hatchback and Accord are Top Safety Pick. HR-V and Passport are Top Safety Pick+. Ford: Explorer and Mustang Mach-E are Top Safety Pick. IIHS awards are for a model year and a size class. They are not a ranking of the whole brand.

Who should look at which

Choose Honda if you want the Civic and Accord sedans, CR-V-class SUVs, the Ridgeline pickup, and Honda's hybrid list. Choose Ford if you want the Mustang, SUVs such as Bronco, a wider truck range from Maverick through Super Duty, the 2026 Mustang Mach-E, or the 2027 E-Transit. A model comparison such as Toyota RAV4 vs Honda CR-V is a different question from this brand comparison.`;

export const HONDA_VS_FORD: EditorialComparison = buildEditorialComparison({
  slug: "honda-vs-ford",
  title: "Honda vs Ford: Sedans, SUVs, Trucks, and Electric Vehicles",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "automotive",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: HONDA,
      slug: HONDA,
      name: "Honda",
      shortDesc: "Japanese automaker founded in 1948, with a U.S. storefront since 1959.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: [
        "Founded in 1948 in Hamamatsu, with a Los Angeles storefront in 1959",
        "U.S. lineup includes Civic and Accord sedans, SUVs, the Ridgeline pickup, and hybrids",
        "2026 IIHS: Civic and Accord are Top Safety Pick; HR-V and Passport are Top Safety Pick+",
      ],
      cons: [
        "The pickup is the Ridgeline, rather than a heavy-duty truck line",
        "The electric model is the Prologue, plus the hydrogen-electric CR-V e:FCEV",
      ],
      bestFor: "Best for Civic, Accord, CR-V, and Honda hybrids",
    },
    {
      id: FORD,
      slug: FORD,
      name: "Ford",
      shortDesc: "U.S. automaker incorporated on June 16, 1903, with cars, trucks, and EVs.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: [
        "Incorporated in Michigan on June 16, 1903",
        "Current electric models: Fathom (preorder, early 2027, not yet on sale), 2026 Mustang Mach-E, and 2027 E-Transit",
        "2026 IIHS Top Safety Pick: Explorer and Mustang Mach-E",
      ],
      cons: [
        "Explorer and Mustang Mach-E are 2026 Top Safety Pick winners, not Top Safety Pick+",
        "The car in the lineup is the Mustang, rather than a set of family sedans",
      ],
      bestFor: "Best for trucks, Bronco, Mustang, Mach-E, and E-Transit",
    },
  ],
  keyDifferences: [
    {
      label: "Start",
      entityAValue: "Founded 1948 in Hamamatsu",
      entityBValue: "Incorporated June 16, 1903",
      winner: "tie",
    },
    {
      label: "Cars",
      entityAValue: "Civic and Accord sedans",
      entityBValue: "Mustang coupe and convertible",
      winner: "tie",
    },
    {
      label: "Trucks",
      entityAValue: "Ridgeline pickup",
      entityBValue: "Maverick, Ranger, F-150, Super Duty",
      winner: "tie",
    },
    {
      label: "Electric",
      entityAValue: "Prologue, plus CR-V e:FCEV",
      entityBValue: "Fathom (preorder, early 2027, not yet on sale), 2026 Mustang Mach-E, 2027 E-Transit",
      winner: "tie",
    },
    {
      label: "2026 IIHS",
      entityAValue: "Civic, Accord, HR-V, Passport",
      entityBValue: "Explorer, Mustang Mach-E",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("founded", "Founding", SPEC, HONDA, FORD, "1948, Hamamatsu, Japan. U.S. storefront in Los Angeles in 1959", "Incorporated in Michigan on June 16, 1903, by Henry Ford"),
    textAttr("cars", "Cars", SPEC, HONDA, FORD, "2026 Civic sedan and hatchback, Civic Si, Civic Type R, and Accord", "2026 Mustang coupe or convertible"),
    textAttr("suvs", "SUVs", SPEC, HONDA, FORD, "HR-V, CR-V, Passport, Pilot, and Prologue", "Expedition, Explorer, Bronco Sport, Bronco, and Mustang Mach-E"),
    textAttr("trucks", "Trucks and vans", SPEC, HONDA, FORD, "Ridgeline pickup. Odyssey minivan", "Super Duty, F-150, Ranger, Maverick, Transit, and 2027 E-Transit"),
    textAttr("hybrid", "Hybrids", SPEC, HONDA, FORD, "Prelude, CR-V, Civic hatchback, Civic sedan, and Accord hybrids", "Maverick and F-150"),
    textAttr("ev", "Electric", SPEC, HONDA, FORD, "Prologue. CR-V e:FCEV is hydrogen with an electric driving experience", "Fathom (preorder, early 2027, not yet on sale), 2026 Mustang Mach-E, and 2027 E-Transit"),
    textAttr("iihs", "2026 IIHS", SPEC, HONDA, FORD, "Top Safety Pick: Civic hatchback, Accord. Top Safety Pick+: HR-V, Passport", "Top Safety Pick: Explorer, Mustang Mach-E"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "toyota-rav4-vs-honda-cr-v",
      title: "Toyota RAV4 vs Honda CR-V",
      category: "automotive",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Honda for Civic, Accord, CR-V, and Honda hybrids. Ford for Mustang, trucks from Maverick to Super Duty, the 2026 Mustang Mach-E, and the 2027 E-Transit.",
    keyFact:
      "Honda founded 1948. Ford incorporated June 16, 1903. IIHS 2026 awards are model awards, not a brand ranking.",
  },
  citationStats: {
    sourceCount: 13,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "Honda — about", url: HONDA_ABOUT },
      { name: "Honda — history", url: HONDA_HISTORY },
      { name: "Honda — U.S. automobiles", url: HONDA_AUTOS },
      { name: "Ford — shareholder stock history", url: FORD_STOCK },
      { name: "Ford — early homes", url: FORD_HOMES },
      { name: "Ford — homepage vehicle groups", url: FORD_HOME },
      { name: "Ford — cars", url: FORD_CARS },
      { name: "Ford — SUVs", url: FORD_SUVS },
      { name: "Ford — trucks", url: FORD_TRUCKS },
      { name: "Ford — electric vehicles", url: FORD_ELECTRIC },
      { name: "Ford — powertrains", url: FORD_POWER },
      { name: "IIHS — 2026 Top Safety Picks, Honda", url: IIHS_HONDA },
      { name: "IIHS — 2026 Top Safety Picks, Ford", url: IIHS_FORD },
    ],
  },
  resources: [
    { type: "external", label: "Honda about", url: HONDA_ABOUT, description: "Founded in 1948 in Hamamatsu. First U.S. storefront in Los Angeles in 1959." },
    { type: "external", label: "Honda history", url: HONDA_HISTORY, description: "Co-founders Soichiro Honda and Takeo Fujisawa. American Honda established in Los Angeles on June 11, 1959." },
    { type: "external", label: "Honda automobiles", url: HONDA_AUTOS, description: "U.S. sedans, SUVs, Ridgeline, Odyssey, hybrids, Prologue, and CR-V e:FCEV." },
    { type: "external", label: "Ford shareholder history", url: FORD_STOCK, description: "Henry Ford incorporated Ford Motor Company in Michigan on June 16, 1903." },
    { type: "external", label: "Ford early homes", url: FORD_HOMES, description: "Incorporated in 1903. First headquarters on Mack Avenue, where the first Model A was assembled." },
    { type: "external", label: "Ford homepage", url: FORD_HOME, description: "Hybrid and electric vehicles, SUVs, crossovers, trucks, vans, and cars." },
    { type: "external", label: "Ford cars", url: FORD_CARS, description: "2026 Mustang coupe or convertible." },
    { type: "external", label: "Ford SUVs", url: FORD_SUVS, description: "Expedition, Explorer, Bronco Sport, Bronco, and Mustang Mach-E." },
    { type: "external", label: "Ford trucks", url: FORD_TRUCKS, description: "Super Duty, F-150, Ranger, Maverick, Transit, and 2027 E-Transit." },
    { type: "external", label: "Ford electric", url: FORD_ELECTRIC, description: "Fathom (preorder, early 2027, not yet on sale), 2026 Mustang Mach-E, and 2027 E-Transit." },
    { type: "external", label: "Ford powertrains", url: FORD_POWER, description: "Gas, hybrid, electric, and diesel. Available hybrids are Maverick and F-150." },
    { type: "external", label: "IIHS 2026 Honda awards", url: IIHS_HONDA, description: "Civic and Accord are Top Safety Pick. HR-V and Passport are Top Safety Pick+." },
    { type: "external", label: "IIHS 2026 Ford awards", url: IIHS_FORD, description: "Explorer and Mustang Mach-E are Top Safety Pick." },
  ],
  metaTitle: "Honda vs Ford | A Versus B",
});
