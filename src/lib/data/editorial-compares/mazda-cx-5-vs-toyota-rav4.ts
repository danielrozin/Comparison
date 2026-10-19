import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Mazda CX-5 vs Toyota RAV4 (2026 model
 * year). Facts read 19 October 2026 from mazdausa.com/vehicles/cx-5 and
 * toyota.com/rav4. Prices are starting MSRPs in the launch-price format, with
 * vendor links for current pricing. No winner.
 */

const A = "mazda-cx-5";
const B = "toyota-rav4";

const MAZDA = "https://www.mazdausa.com/vehicles/cx-5";
const MAZDA_BUILD = "https://www.mazdausa.com/shopping-tools/build-and-price";
const TOYOTA = "https://www.toyota.com/rav4/";
const TOYOTA_BUILD = "https://www.toyota.com/configurator/";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "Compact SUV";

const MAZDA_PRICE = "$29,990 starting launch price (MSRP), per Mazda USA, Oct 2026";
const TOYOTA_PRICE = "$31,900 starting launch price (MSRP), per Toyota, Oct 2026";

const SHORT_ANSWER = `The 2026 Mazda CX-5 is a gas compact SUV with a 187-hp 2.5-liter four-cylinder, a 6-speed automatic and standard all-wheel drive, rated 26 mpg combined, at ${MAZDA_PRICE}. The 2026 Toyota RAV4 comes as a hybrid or plug-in hybrid, with 236 net combined hp in the hybrid, up to an estimated 47 city/40 highway mpg and front- or all-wheel drive, at ${TOYOTA_PRICE}. Neither is better for everyone.`;

const FAQS = [
  {
    question: "How much do the 2026 Mazda CX-5 and Toyota RAV4 cost?",
    answer: `The Mazda CX-5 is ${MAZDA_PRICE}, before a $1,595 destination charge, with trims up to the 2.5 S Premium Plus at $38,990. The Toyota RAV4 is ${TOYOTA_PRICE}. See vendor page for current price.`,
  },
  {
    question: "Which gets better fuel economy?",
    answer:
      "Toyota rates the 2026 RAV4 hybrid at up to an estimated 47 mpg city and 40 mpg highway. Mazda rates the 2026 CX-5 at 26 mpg combined.",
  },
  {
    question: "Is there a hybrid Mazda CX-5?",
    answer:
      "Mazda says a Mazda Hybrid powertrain for the CX-5 is confirmed and will launch in 2027; the 2026 CX-5 launches with the Skyactiv-G 2.5 gas engine. The 2026 RAV4 comes with hybrid and plug-in hybrid powertrains.",
  },
  {
    question: "Do both come with all-wheel drive?",
    answer:
      "Mazda makes i-Activ AWD standard on every 2026 CX-5. The 2026 RAV4 offers front-wheel drive or all-wheel drive, depending on trim.",
  },
  {
    question: "How big are the touchscreens?",
    answer:
      "Mazda lists a 12.9-inch center touchscreen with Google built-in on the CX-5 2.5 S and an available 15.6-inch screen. Toyota fits a 10.5-inch touchscreen as standard on the RAV4 and offers a 12.9-inch screen.",
  },
  {
    question: "What about safety and cargo?",
    answer:
      "Mazda says the 2026 CX-5 earned a 2026 IIHS TOP SAFETY PICK+. Toyota fits Toyota Safety Sense 4.0 to the RAV4 and lists up to 37.8 cubic feet of cargo space and up to 3,500 lbs of towing.",
  },
];

const VERDICT = `Best for a lower starting price with standard all-wheel drive: Mazda CX-5, at ${MAZDA_PRICE}.

Best for fuel economy and electrified powertrains: Toyota RAV4, with up to an estimated 47 city/40 highway mpg as a hybrid and a plug-in hybrid option.

Test-drive both; compare current offers on each vendor page.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Mazda CX-5: ${MAZDA_PRICE}.
- Toyota RAV4: ${TOYOTA_PRICE}.
- The CX-5 has a 187-hp gas engine and standard i-Activ AWD.
- The RAV4 is a hybrid or plug-in hybrid, rated up to an estimated 47 city/40 highway mpg.
- Mazda says a CX-5 hybrid arrives in 2027.

Price and trims

Mazda sells five CX-5 trims, starting with the 2.5 S at ${MAZDA_PRICE} and rising to the 2.5 S Premium Plus at $38,990, before a $1,595 destination charge. Toyota lists the RAV4 at ${TOYOTA_PRICE}.

Powertrain and efficiency

The CX-5 uses a Skyactiv-G 2.5-liter four-cylinder with 187 hp and 186 lb-ft of torque, a 6-speed automatic and i-Activ AWD, rated 26 mpg combined. The RAV4 pairs a 2.5-liter four-cylinder with hybrid electric motors for 236 net combined hp and an ECVT, rated up to an estimated 47 city/40 highway mpg; a plug-in hybrid version is also offered.

Interior and technology

Mazda fits a 12.9-inch touchscreen with Google built-in to the 2.5 S and offers a 15.6-inch screen. Toyota fits a 10.5-inch touchscreen as standard and offers a 12.9-inch screen.

Safety and utility

Mazda says the 2026 CX-5 earned a 2026 IIHS TOP SAFETY PICK+. Toyota fits Toyota Safety Sense 4.0 and lists up to 37.8 cubic feet of cargo and up to 3,500 lbs of towing.

Who should pick which

Pick the CX-5 for a lower starting price and standard all-wheel drive. Pick the RAV4 for hybrid fuel economy or a plug-in hybrid. Toyota RAV4 vs Honda CR-V and Subaru Outback vs Toyota RAV4 compare other rivals.`;

const BUILT = buildEditorialComparison({
  slug: "mazda-cx-5-vs-toyota-rav4",
  title: "Mazda CX-5 vs Toyota RAV4: 2026 Price, MPG",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "automotive",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Mazda CX-5",
      shortDesc: "2026 compact SUV with a 187-hp 2.5-liter engine and standard i-Activ AWD.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: ["Standard i-Activ AWD", "Lower starting MSRP", "2026 IIHS TOP SAFETY PICK+, per Mazda"],
      cons: ["Mazda Hybrid version due in 2027", "26 mpg combined"],
      bestFor: "Buyers who want standard all-wheel drive at a lower starting price",
    },
    {
      id: B,
      slug: B,
      name: "Toyota RAV4",
      shortDesc: "2026 compact SUV with hybrid and plug-in hybrid powertrains.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: ["Up to an estimated 47 city/40 highway mpg", "Hybrid or plug-in hybrid", "Up to 37.8 cu ft of cargo and 3,500 lbs towing"],
      cons: ["Higher starting MSRP", "All-wheel drive depends on trim"],
      bestFor: "Buyers who want hybrid fuel economy or a plug-in hybrid",
    },
  ],
  keyDifferences: [
    { label: "Starting price", entityAValue: MAZDA_PRICE, entityBValue: TOYOTA_PRICE, winner: "tie" },
    { label: "Powertrain", entityAValue: "187-hp 2.5L gas, 6-speed automatic", entityBValue: "Hybrid (236 net combined hp) or plug-in hybrid", winner: "tie" },
    { label: "Fuel economy", entityAValue: "26 mpg combined", entityBValue: "Up to est. 47 city/40 hwy mpg", winner: "tie" },
    { label: "Drive", entityAValue: "Standard i-Activ AWD", entityBValue: "FWD or AWD", winner: "tie" },
  ],
  attributes: [
    textAttr("price", "Starting price", GROUP, A, B, MAZDA_PRICE, TOYOTA_PRICE),
    textAttr("engine", "Powertrain", GROUP, A, B, "Skyactiv-G 2.5L, 187 hp, 186 lb-ft, 6-speed automatic", "2.5L hybrid, 236 net combined hp, ECVT; plug-in hybrid offered"),
    textAttr("mpg", "Fuel economy", GROUP, A, B, "26 mpg combined", "Up to est. 47 city/40 hwy mpg"),
    textAttr("drive", "Drivetrain", GROUP, A, B, "Standard i-Activ AWD", "FWD or AWD"),
    textAttr("screen", "Touchscreen", GROUP, A, B, "12.9-inch with Google built-in; 15.6-inch available", "10.5-inch standard; 12.9-inch available"),
    textAttr("safety", "Safety", GROUP, A, B, "2026 IIHS TOP SAFETY PICK+, per Mazda", "Toyota Safety Sense 4.0"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "toyota-rav4-vs-honda-cr-v", title: "Toyota RAV4 vs Honda CR-V", category: "automotive" },
    { slug: "subaru-outback-vs-toyota-rav4", title: "Subaru Outback vs Toyota RAV4", category: "automotive" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Mazda CX-5 for a lower starting price with standard AWD; Toyota RAV4 for hybrid fuel economy and a plug-in option.",
    keyFact: "The 2026 RAV4 is rated up to an estimated 47 city/40 highway mpg; the 2026 CX-5 is rated 26 mpg combined.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 18,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Mazda USA: 2026 Mazda CX-5", url: MAZDA },
      { name: "See vendor page for current price: Mazda build and price", url: MAZDA_BUILD },
      { name: "Toyota: 2026 RAV4", url: TOYOTA },
      { name: "See vendor page for current price: Toyota build", url: TOYOTA_BUILD },
    ],
  },
  resources: [
    { type: "external", label: "Mazda USA: 2026 Mazda CX-5", url: MAZDA, description: "Trims and starting MSRPs, $1,595 destination, 187 hp, i-Activ AWD, 26 mpg combined, IIHS award, 2027 hybrid." },
    { type: "external", label: "See vendor page for current price: Mazda build and price", url: MAZDA_BUILD, description: "Configure a CX-5 and see current pricing." },
    { type: "external", label: "Toyota: 2026 RAV4", url: TOYOTA, description: "Starting MSRP, hybrid and plug-in hybrid, 236 hp, est. 47/40 mpg, cargo, towing, TSS 4.0." },
    { type: "external", label: "See vendor page for current price: Toyota build", url: TOYOTA_BUILD, description: "Configure a RAV4 and see current pricing." },
  ],
  metaTitle: "Mazda CX-5 vs Toyota RAV4: 2026 Price, MPG",
});

BUILT.metadata.metaDescription =
  "2026 Mazda CX-5 vs Toyota RAV4: starting MSRP, 187-hp gas AWD against hybrid and plug-in hybrid power, fuel economy, screens, safety and cargo.";

export const MAZDA_CX_5_VS_TOYOTA_RAV4: EditorialComparison = BUILT;
