import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-93 — Carhartt vs Dickies, work-pants focus (B01 vs 874 and Dickies Double Knee).
 * B01 fabric, fit, knee pads, pockets, and origin are from carhartt.com
 * (style 106679, model B01-M), confirmed in a browser on 2026-09-28.
 * Gear Patrol (Aug 2, 2021) is only the reviewer's hands-on fit and break-in.
 * No 2021 prices are reused, and this page does not print a live price.
 */

const CARHARTT = "carhartt";
const DICKIES = "dickies";

const CARHARTT_B01 = "https://www.carhartt.com/product/106679";
const DICKIES_874 = "https://www.dickies.com/en-us/products/original-874-r-work-pants-dk0008740gh";
const GEAR_PATROL = "https://www.gearpatrol.com/style/a37114165/carhartt-dickies-double-knee-work-pants/";
const REDDIT = "https://www.reddit.com/r/BuyItForLife/comments/1wp1i7e/which_pants_are_biflier_carhartt_or_dickies/";

const PUBLISHED = "2026-09-26T00:00:00Z";
const UPDATED = "2026-09-28T00:00:00Z";

const SHORT_ANSWER =
  "For pure durability, Carhartt's duck-canvas work pants (like the B01 Double-Front) usually outlast Dickies' classic 874. Carhartt uses heavy 12-oz 100% cotton duck; the 874 is lighter 8.5-oz poly/cotton twill. Dickies wins for a lighter, wrinkle- and stain-resistant pant with a short break-in, better for uniform or indoor work than abrasive job sites.";

const FAQS = [
  {
    question: "Which is more durable?",
    answer:
      "Carhartt lists the Iconic B01 Firm Duck Double-Front Dungaree (style 106679, model B01-M) as 12-ounce, firm-hand, 100% cotton ringspun duck canvas. The Dickies 874 is 8.5 oz, 65% polyester / 35% cotton, non-stretch twill. Gear Patrol’s August 2021 hands-on says that blended twill is not nearly as durable as the cotton duck, and that it trades durability for a lighter pant that resists stains and wrinkles. Owners in the linked Reddit thread are split: some prefer Carhartt duck, and some report Carhartt knees wearing through or rear pockets tearing.",
  },
  {
    question: "What's the difference between the B01 and the 874?",
    answer:
      "The B01 is Carhartt’s Iconic Firm Duck Double-Front Dungaree in 12-ounce, firm-hand, 100% cotton ringspun duck canvas. Carhartt calls the cut its most generous: a loose fit with a roomy seat and thigh, a high rise that sits slightly above the waist, a straight leg, and cuffs that fit over work boots. It has multiple tool and utility pockets, a left-leg hammer loop, and reinforced back pockets. The 874 is Dickies’ lighter 8.5-oz 65/35 non-stretch twill, with a relaxed fit through the seat and thigh and a straight leg that tapers slightly. These are two different cuts, not the same pant in two brands.",
  },
  {
    question: "Do Carhartt pants run big?",
    answer:
      "Carhartt describes the B01 as its most generous cut: a loose fit with free movement, roomy through the hips and thigh, a high rise that sits slightly above the waist, a generous seat, a straight leg opening, and cuffs that fit easily over work boots. In Gear Patrol’s August 2021 hands-on, that reviewer found the B01 very wide and long in the inseam, and suggested ordering a shorter inseam than usual. The width is the product’s own loose-fit description. The long inseam is that reviewer’s finding.",
  },
  {
    question: "Which is better for skateboarding or casual wear?",
    answer:
      "Gear Patrol described the Dickies Loose Fit Double Knee as the straighter silhouette, closer to a skater cut than a construction cut, and noted Dickies on skateboarders and in uniforms. The same review found the B01 very wide. Carhartt’s own copy describes that width as a loose work fit with cuffs that fit over work boots. Dickies’ twill also had the shorter break-in in that review. That is the reviewer’s finding, not a skate test.",
  },
  {
    question: "Can you use knee pads?",
    answer:
      "Yes on the Carhartt B01. Carhartt says the Iconic B01 Firm Duck Double-Front Dungaree has double-layer knees with openings for adding knee pads and cleaning out debris, and that it is compatible with the Carhartt Knee Pad. Gear Patrol says the Dickies Double Knee is two layers of twill seamed together, with no slots for knee pads.",
  },
  {
    question: "Are there more durable alternatives?",
    answer:
      "Commenters on the linked Reddit thread also mention Duluth Trading and Helly Hansen. Those are mentions only. This page does not compare their fabric weight or warranty.",
  },
];

const VERDICT = `Most durable: Carhartt duck, such as the B01 Double-Front. Carhartt lists that pant as 12-ounce, firm-hand, 100% cotton ringspun duck canvas. Gear Patrol says that cotton duck is more durable than Dickies’ poly/cotton twill.

Best lightweight or uniform pant: Dickies 874. Dickies lists it as 8.5 oz, 65% polyester / 35% cotton, non-stretch twill. Gear Patrol found Dickies twill lighter, stain- and wrinkle-resistant, and quicker to break in — a better match for uniform or indoor work than for abrasive job sites.

No value pick. This page does not print a price. Gear Patrol’s 2021 prices are out of date.`;

const EXPERT_ANALYSIS = `This page compares Carhartt and Dickies work pants, focused on the Carhartt Iconic B01 Firm Duck Double-Front Dungaree (style 106679, model B01-M), the Dickies Original 874, and the Dickies Loose Fit Double Knee that Gear Patrol reviewed. There is no single winner, and there is no value crown.

Fabric

Carhartt’s product page lists the B01 as 12-ounce, firm-hand, 100% cotton ringspun duck canvas. Dickies’ Original 874 product page lists 8.5 oz, 65% polyester / 35% cotton, non-stretch twill. Gear Patrol’s August 2021 hands-on says Dickies’ blended twill is not nearly as durable as that cotton duck, and that the twill resists stains and wrinkles except in extreme cases. Firm-hand, in that review, means tougher to the touch. The fabric weight itself is from Carhartt and Dickies, not from the 2021 review.

Fit and sizing

Carhartt calls the B01 its most generous cut. The loose fit is meant to give free movement, with a roomy fit through the hips and thigh and cuffs that fit easily over work boots. The same page says the high rise sits slightly above the waist, with a generous fit in the seat and thigh, and a straight leg opening. Gear Patrol’s hands-on is a separate finding: that reviewer found the B01 very wide and long in the inseam, and suggested ordering one inseam shorter than usual. Dickies describes the 874 as a high rise, relaxed through the seat and thigh, with a straight leg that tapers slightly. Gear Patrol found the Dickies Loose Fit Double Knee looser than a slim pant but straighter than the B01.

Construction

Carhartt says the B01 has double-layer knees with openings for adding knee pads and cleaning out debris, and that the pant is compatible with the Carhartt Knee Pad. The same page lists multiple tool and utility pockets with a left-leg hammer loop, and heavy-hauling reinforced back pockets for hand tools and more. Origin on that page is “Imported or Made in USA of Imported Parts.” The Dickies Double Knee, in Gear Patrol’s review, is two layers of twill seamed together and has no slots for knee pads. The 874 page lists reinforced seams and welt back pockets. It does not describe a double knee.

What owners report

The r/BuyItForLife thread asking which pants last longer is a split, not a vote tally this page can print. Some people prefer Carhartt duck over regular Dickies. Some report Carhartt knees wearing through or rear pockets tearing. Read the thread for the range of jobs those owners do. This summary does not quote usernames.

Break-in

Gear Patrol calls the B01 duck firm-hand and tougher to the touch, and says the Dickies twill break-in is much shorter. Dickies’ own 874 copy says the pants soften with wear. Neither source times that break-in in days. Carhartt’s “firm-hand” wording is the fabric name on the B01 page. The shorter Dickies break-in is the reviewer’s finding.

Alternatives commenters mention

People in that Reddit thread also name Duluth Trading and Helly Hansen. Those are mentions only. This page does not rank them or repeat a warranty claim.`;

export const CARHARTT_VS_DICKIES: EditorialComparison = buildEditorialComparison({
  slug: "carhartt-vs-dickies",
  title: "Carhartt vs Dickies: Which Work Pants Last Longer?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "brands",
  publishedAt: PUBLISHED,
  updatedAt: UPDATED,
  entities: [
    {
      id: CARHARTT,
      slug: CARHARTT,
      name: "Carhartt",
      shortDesc:
        "Workwear brand. The Iconic B01 Firm Duck Double-Front Dungaree (style 106679) is 12-ounce cotton ringspun duck canvas.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: [
        "B01 is 12-ounce, firm-hand, 100% cotton ringspun duck canvas (Carhartt, style 106679)",
        "Heavier fabric than the Dickies 874’s 8.5-oz twill",
        "Double-layer knees with openings for knee pads; compatible with the Carhartt Knee Pad",
        "Tool and utility pockets, a left-leg hammer loop, and reinforced back pockets",
        "Gear Patrol called the duck more durable than Dickies’ poly/cotton twill",
      ],
      cons: [
        "Carhartt calls the B01 its most generous, loose cut",
        "That reviewer found the inseam long and suggested ordering shorter",
        "Firm-hand duck is tougher to the touch at first (Gear Patrol)",
        "Some owners report knees wearing through or rear pockets tearing",
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
        "Lighter than 12-ounce duck, which suits uniform or indoor work",
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
      entityAValue: "12-ounce, firm-hand, 100% cotton ringspun duck canvas (B01, Carhartt)",
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
      entityAValue: "Firm-hand; tougher at first (Gear Patrol)",
      entityBValue: "Shorter break-in (Gear Patrol)",
      winner: "b",
    },
    {
      label: "Knee pads",
      entityAValue: "Double-layer knees with openings; compatible with the Carhartt Knee Pad",
      entityBValue: "Double Knee has no knee-pad slots (Gear Patrol)",
      winner: "a",
    },
  ],
  attributes: [
    textAttr(
      "fabric",
      "Fabric",
      "Material",
      CARHARTT,
      DICKIES,
      "12-ounce, firm-hand, 100% cotton ringspun duck canvas (B01)",
      "8.5 oz, 65% polyester / 35% cotton, non-stretch twill (874)",
      "a"
    ),
    textAttr(
      "fit",
      "Fit",
      "Fit",
      CARHARTT,
      DICKIES,
      "Loose fit: roomy hips and thigh, straight leg, cuffs over boots (Carhartt). Inseam ran long in one review (Gear Patrol).",
      "874: relaxed seat and thigh, slight taper (Dickies)",
      undefined
    ),
    textAttr(
      "double-knee",
      "Double front / double knee",
      "Construction",
      CARHARTT,
      DICKIES,
      "Double-layer knees with openings for knee pads; compatible with the Carhartt Knee Pad",
      "Double Knee: two twill layers, no knee-pad slots (Gear Patrol)",
      "a"
    ),
    textAttr(
      "break-in",
      "Break-in",
      "Comfort",
      CARHARTT,
      DICKIES,
      "Firm-hand duck; tougher to the touch at first (Gear Patrol)",
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
      "Carhartt duck for durability; Dickies 874 for a lighter uniform pant. No value pick.",
    keyFact:
      "The 874 is 8.5-oz 65/35 twill (Dickies). The B01 is 12-ounce, firm-hand, 100% cotton ringspun duck canvas (Carhartt style 106679).",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 4,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: "2026-09-28",
    sources: [
      { name: "Carhartt — Iconic B01 Firm Duck Double-Front Dungaree (106679)", url: CARHARTT_B01 },
      { name: "Dickies — Original 874 Work Pants", url: DICKIES_874 },
      { name: "Gear Patrol — Carhartt vs Dickies (Aug 2, 2021)", url: GEAR_PATROL },
      { name: "Reddit — r/BuyItForLife thread", url: REDDIT },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Carhartt B01 — style 106679, model B01-M",
      url: CARHARTT_B01,
      description:
        "12-ounce, firm-hand, 100% cotton ringspun duck canvas. Loose fit, knee-pad openings, pockets, and origin.",
    },
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
      description:
        "Reviewer only: B01 inseam ran long, Dickies break-in was shorter, and the Dickies Double Knee has no knee-pad slots. 2021 prices are not reused.",
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
