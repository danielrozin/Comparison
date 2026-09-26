import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-93 — Carhartt vs Dickies, work-pants focus (B01 vs 874 and Dickies Double Knee).
 * Fabric weights are from Dickies.com (874) and Gear Patrol’s August 2021 hands-on (B01).
 * carhartt.com could not be confirmed for the B01. No 2021 prices are reused.
 */

const CARHARTT = "carhartt";
const DICKIES = "dickies";

const DICKIES_874 = "https://www.dickies.com/en-us/products/original-874-r-work-pants-dk0008740gh";
const GEAR_PATROL = "https://www.gearpatrol.com/style/a37114165/carhartt-dickies-double-knee-work-pants/";
const REDDIT = "https://www.reddit.com/r/BuyItForLife/comments/1wp1i7e/which_pants_are_biflier_carhartt_or_dickies/";

const RESEARCHED = "2026-09-26T00:00:00Z";

const SHORT_ANSWER =
  "For pure durability, Carhartt's duck-canvas work pants (like the B01 Double-Front) usually outlast Dickies' classic 874. Carhartt uses heavy 12-oz 100% cotton duck; the 874 is lighter 8.5-oz poly/cotton twill. Dickies wins for a lighter, wrinkle- and stain-resistant pant with a short break-in, better for uniform or indoor work than abrasive job sites.";

const FAQS = [
  {
    question: "Which is more durable?",
    answer:
      "Carhartt’s 12-oz 100% cotton duck, on the B01 in Gear Patrol’s August 2021 hands-on, is the heavier fabric. The Dickies 874 is 8.5 oz, 65% polyester / 35% cotton, non-stretch twill. Gear Patrol says that blended twill is not nearly as durable as the cotton duck, and that it trades durability for a lighter pant that resists stains and wrinkles. Owners in the linked Reddit thread are split: some prefer Carhartt duck, and some report Carhartt knees wearing through or rear pockets tearing.",
  },
  {
    question: "What's the difference between the B01 and the 874?",
    answer:
      "The B01 is a double-front work pant in 12-oz firm-hand 100% ring-spun cotton duck, per Gear Patrol. The 874 is Dickies’ lighter 8.5-oz 65/35 non-stretch twill, with a relaxed fit through the seat and thigh and a straight leg that tapers slightly, per Dickies. Gear Patrol also describes loops and pockets on the B01 suited to tools. These are two different cuts, not the same pant in two brands.",
  },
  {
    question: "Do Carhartt pants run big?",
    answer:
      "In Gear Patrol’s hands-on, the B01 was very wide (Loose Original Fit) and ran long in the inseam. That reviewer suggested ordering a shorter inseam than usual. That is one reviewer’s finding. This page could not confirm a B01 size chart on carhartt.com.",
  },
  {
    question: "Which is better for skateboarding or casual wear?",
    answer:
      "Gear Patrol described the Dickies Loose Fit Double Knee as the straighter silhouette, closer to a skater cut than a construction cut, and noted Dickies on skateboarders and in uniforms. The same review found the B01 very wide. Dickies’ twill also had the shorter break-in. That is the reviewer’s finding, not a skate test.",
  },
  {
    question: "Can you use knee pads?",
    answer:
      "Gear Patrol says the Dickies Double Knee is two layers of twill seamed together, with no slots for knee pads. The same review describes a double front and tool slots on the Carhartt B01. It does not say those slots hold knee pads, and this page could not confirm knee-pad pockets on a B01 page at carhartt.com.",
  },
  {
    question: "Are there more durable alternatives?",
    answer:
      "Commenters on the linked Reddit thread also mention Duluth Trading and Helly Hansen. Those are mentions only. This page does not compare their fabric weight or warranty.",
  },
];

const VERDICT = `Most durable: Carhartt duck, such as the B01 Double-Front. Gear Patrol describes that pant as 12-oz firm-hand 100% ring-spun cotton duck and says the cotton duck is more durable than Dickies’ poly/cotton twill.

Best lightweight or uniform pant: Dickies 874. Dickies lists it as 8.5 oz, 65% polyester / 35% cotton, non-stretch twill. Gear Patrol found Dickies twill lighter, stain- and wrinkle-resistant, and quicker to break in — a better match for uniform or indoor work than for abrasive job sites.

No value pick. This page does not print a price. Gear Patrol’s 2021 prices are out of date, and a current Carhartt B01 price was not confirmed on carhartt.com.`;

const EXPERT_ANALYSIS = `This page compares Carhartt and Dickies work pants, focused on the Carhartt B01 Double-Front, the Dickies Original 874, and the Dickies Loose Fit Double Knee that Gear Patrol reviewed. There is no single winner, and there is no value crown.

Fabric

Dickies’ Original 874 product page lists 8.5 oz, 65% polyester / 35% cotton, non-stretch twill. Gear Patrol’s August 2021 hands-on describes the Carhartt B01 as 12-oz firm-hand 100% ring-spun cotton duck. Firm-hand, in that review, means tougher to the touch. The same review says Dickies’ blended twill is not nearly as durable as that cotton duck, and that the twill resists stains and wrinkles except in extreme cases. The 12-oz duck figure is from Gear Patrol, not from a carhartt.com B01 page this research could open.

Fit and sizing

Gear Patrol found the B01 very wide — Loose Original Fit, the widest step on the scale that reviewer described — and long in the inseam. The reviewer suggested ordering one inseam shorter than usual. That is that reviewer’s finding. Dickies describes the 874 as a high rise, relaxed through the seat and thigh, with a straight leg that tapers slightly. Gear Patrol found the Dickies Loose Fit Double Knee looser than a slim pant but straighter than the B01.

Construction

Gear Patrol describes a double front on the B01, plus loops and pockets for tools, and says the B01 they reviewed was made in the U.S. The Dickies Double Knee, in that review, is two layers of twill seamed together and has no slots for knee pads. The 874 page lists reinforced seams and welt back pockets. It does not describe a double knee.

What owners report

The r/BuyItForLife thread asking which pants last longer is a split, not a vote tally this page can print. Some people prefer Carhartt duck over regular Dickies. Some report Carhartt knees wearing through or rear pockets tearing. Read the thread for the range of jobs those owners do. This summary does not quote usernames.

Break-in

Gear Patrol calls the B01 duck firm-hand and tougher to the touch, and says the Dickies twill break-in is much shorter. Dickies’ own 874 copy says the pants soften with wear. Neither source times that break-in in days.

Alternatives commenters mention

People in that Reddit thread also name Duluth Trading and Helly Hansen. Those are mentions only. This page does not rank them or repeat a warranty claim.`;

export const CARHARTT_VS_DICKIES: EditorialComparison = buildEditorialComparison({
  slug: "carhartt-vs-dickies",
  title: "Carhartt vs Dickies: Which Work Pants Last Longer?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "brands",
  publishedAt: RESEARCHED,
  updatedAt: RESEARCHED,
  entities: [
    {
      id: CARHARTT,
      slug: CARHARTT,
      name: "Carhartt",
      shortDesc:
        "Workwear brand. The B01 Double-Front, in a 2021 Gear Patrol hands-on, is 12-oz cotton duck.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: [
        "B01 is 12-oz firm-hand 100% ring-spun cotton duck (Gear Patrol, Aug 2021)",
        "Heavier fabric than the Dickies 874’s 8.5-oz twill",
        "Double front, plus loops and pockets Gear Patrol tied to tools",
        "Gear Patrol called the duck more durable than Dickies’ poly/cotton twill",
      ],
      cons: [
        "That reviewer found the B01 very wide and long in the inseam",
        "Firm-hand duck is tougher to the touch at first",
        "Some owners report knees wearing through or rear pockets tearing",
        "B01 spec and price were not confirmed on carhartt.com for this page",
      ],
      bestFor: "Most durable duck work pant",
    },
    {
      id: DICKIES,
      slug: DICKIES,
      name: "Dickies",
      shortDesc:
        "Workwear brand. The Original 874 is 8.5-oz poly/cotton twill; the Loose Fit Double Knee is a straighter cut.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: [
        "874 is 8.5 oz, 65% polyester / 35% cotton, non-stretch twill (Dickies)",
        "Lighter than 12-oz duck, which suits uniform or indoor work",
        "Gear Patrol: stain- and wrinkle-resistant twill with a shorter break-in",
        "874 is relaxed through the seat and thigh, with a slight taper (Dickies)",
        "Loose Fit Double Knee was the straighter silhouette in that review",
      ],
      cons: [
        "8.5-oz twill is the less abrasion-resistant fabric in Gear Patrol’s comparison",
        "Double Knee has no knee-pad slots (Gear Patrol)",
        "Non-stretch twill",
      ],
      bestFor: "Lighter uniform or indoor pant",
    },
  ],
  keyDifferences: [
    {
      label: "Fabric",
      entityAValue: "12-oz 100% cotton duck (B01, Gear Patrol)",
      entityBValue: "8.5-oz 65/35 poly/cotton twill (874, Dickies)",
      winner: "a",
    },
    {
      label: "Best job",
      entityAValue: "Abrasive job sites, if the duck holds up",
      entityBValue: "Uniform or indoor work",
      winner: "tie",
    },
    {
      label: "Break-in",
      entityAValue: "Firm-hand; tougher at first",
      entityBValue: "Shorter break-in (Gear Patrol)",
      winner: "b",
    },
    {
      label: "Knee pads",
      entityAValue: "Double front and tool slots; pad pockets not confirmed",
      entityBValue: "Double Knee has no knee-pad slots",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "fabric",
      "Fabric",
      "Material",
      CARHARTT,
      DICKIES,
      "12-oz firm-hand 100% ring-spun cotton duck (B01)",
      "8.5 oz, 65% polyester / 35% cotton, non-stretch twill (874)",
      "a"
    ),
    textAttr(
      "fit",
      "Fit",
      "Fit",
      CARHARTT,
      DICKIES,
      "B01: very wide, inseam ran long (Gear Patrol)",
      "874: relaxed seat and thigh, slight taper (Dickies)",
      undefined
    ),
    textAttr(
      "double-knee",
      "Double front / double knee",
      "Construction",
      CARHARTT,
      DICKIES,
      "B01 double front and tool slots; knee-pad pockets not confirmed",
      "Double Knee: two twill layers, no knee-pad slots",
      undefined
    ),
    textAttr(
      "break-in",
      "Break-in",
      "Comfort",
      CARHARTT,
      DICKIES,
      "Firm-hand duck; tougher to the touch at first",
      "Shorter break-in on the twill (Gear Patrol)",
      "b"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "patagonia-vs-rei", title: "Patagonia vs REI", category: "brands" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Carhartt duck for durability; Dickies 874 for a lighter uniform pant. No value pick without a live Carhartt price.",
    keyFact:
      "The 874 is 8.5-oz 65/35 twill (Dickies). The B01 is 12-oz cotton duck in Gear Patrol’s 2021 hands-on. Confirm the B01 on carhartt.com before treating that weight as current.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 4,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: "2026-09-26",
    sources: [
      { name: "Dickies — Original 874 Work Pants", url: DICKIES_874 },
      { name: "Gear Patrol — Carhartt vs Dickies (Aug 2, 2021)", url: GEAR_PATROL },
      { name: "Reddit — r/BuyItForLife thread", url: REDDIT },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Dickies Original 874 — fabric spec",
      url: DICKIES_874,
      description: "8.5 oz, 65% polyester / 35% cotton, non-stretch twill.",
    },
    {
      type: "external",
      label: "Gear Patrol hands-on (August 2, 2021)",
      url: GEAR_PATROL,
      description: "B01 12-oz duck, fit, break-in, and Dickies knee-pad slots. Prices on that page are from 2021 and are not reused here.",
    },
    {
      type: "external",
      label: "Reddit thread (summary only)",
      url: REDDIT,
      description: "Split owner reports. No usernames quoted. Duluth Trading and Helly Hansen are mentions only.",
    },
  ],
  metaTitle: "Carhartt vs Dickies: Which Work Pants Last Longer? | A Versus B",
});
