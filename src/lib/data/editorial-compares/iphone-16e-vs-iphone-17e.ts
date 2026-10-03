import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-121 — iPhone 16e (512GB) vs iPhone 17e (256GB).
 * Checked against sources on 2026-09-29: MacRumors, AppleInsider, and
 * apple.com/iphone-17e/. AppleInsider's Geekbench scores compare the 16e's A18
 * with the iPhone 17's five-core A19, not the 17e's four-core GPU. Those scores
 * are not repeated here. Launch prices are the article's launch prices, not a
 * live deal. No page-level winner.
 */

const E16 = "iphone-16e";
const E17 = "iphone-17e";

const MACRUMORS = "https://www.macrumors.com/guide/iphone-16e-vs-17e/";
const APPLEINSIDER =
  "https://appleinsider.com/inside/iphone-17e/vs/iphone-17e-vs-iphone-16e-apples-low-end-compared";
const APPLE = "https://www.apple.com/iphone-17e/";

const SOURCE_DATE = "2026-09-29";
const PUBLISHED = "2026-09-29T00:00:00Z";

const SHORT_ANSWER =
  "Buy the iPhone 17e 256GB unless you already know you need more than 256GB. It has the A19 chip, MagSafe up to 15W, Ceramic Shield 2, and it launched a year after the 16e. Pick the iPhone 16e 512GB only if that extra storage matters more than MagSafe and the newer chip, and a live price check shows it is close to the 17e. Both have a 6.1-inch Super Retina XDR display, one 48MP Fusion camera, and up to 26 hours of video playback. Both launched at a $599 starting price. This page does not crown a winner.";

const FAQS = [
  {
    question: "Is the iPhone 17e worth it over the iPhone 16e?",
    answer:
      "For most people, yes. MacRumors calls MagSafe the main upgrade: the 16e is Qi charging up to 7.5W, and the 17e is MagSafe up to 15W. The 17e also moves to the A19 chip and Ceramic Shield 2, and its storage starts at 256GB instead of 128GB. MacRumors still treats a heavily discounted 16e as a capable phone if you do not care about MagSafe. Check a live price. This page does not hard-code a sale price.",
  },
  {
    question: "Is 256GB enough, or should you get the 512GB iPhone 16e?",
    answer:
      "256GB is the 17e's starting storage. Apple says that is twice the 16e's starting storage. AppleInsider lists the 16e at 128GB, 256GB, and 512GB, and the 17e at 256GB and 512GB only. Buy the 16e 512GB only if you know you need more than 256GB and the live price is close to the 17e. AppleInsider's 2 March 2026 article lists launch prices, not today's price: 16e 512GB at $899 and 17e 256GB at $599. Those figures can be out of date. Check the current price before you decide.",
  },
  {
    question: "Is the iPhone 17e camera better than the iPhone 16e?",
    answer:
      "The hardware is the same single 48MP Fusion camera. AppleInsider says Apple did not change that camera hardware for the 17e, and that the 2x telephoto view is a crop of the 48MP sensor, not a second lens. The 17e adds what Apple and MacRumors call next-generation portraits with Focus and Depth Control. AppleInsider says there is no material difference in camera hardware, and that the 17e should benefit from the newer chip. This page does not cite a lab photo score.",
  },
  {
    question: "Does MagSafe matter on the iPhone 17e?",
    answer:
      "It matters if you want magnetic chargers, cases, wallets, or car mounts. Apple says the 17e charges wirelessly at up to 15W, compared with 7.5W on the 16e, and that the magnets snap onto that accessory family. MacRumors calls this the most consequential upgrade. If you never use a magnetic charger or mount, it matters less than storage or price.",
  },
  {
    question: "Which should you buy if you are coming from an iPhone 8?",
    answer:
      "The iPhone 17e 256GB, unless you know you need more than 256GB. MacRumors says the 17e is a strong upgrade from an iPhone 14 or older, and that the newer chip should age better over a three- to five-year ownership stretch. An iPhone 8 is older than that. AppleInsider points owners of much older iPhones, such as the iPhone XR or the last iPhone SE, to the 17e. Neither source publishes a year count for iOS updates, so this page does not invent one. The 17e simply starts that window a year later, on the A19.",
  },
];

const VERDICT = `Best for most people leaving an iPhone 8: iPhone 17e 256GB. You get the A19, MagSafe up to 15W, Ceramic Shield 2, and a later launch.

Best if you need more than 256GB: iPhone 16e 512GB, and only when a live price check shows it is close to the 17e. Storage is the reason. MagSafe and the newer chip are the things you give up.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `Buy the iPhone 17e 256GB unless you already know you need more than 256GB. Pick the iPhone 16e 512GB only when that extra storage matters more than MagSafe and the A19, and only after you check a live price. This page does not crown one phone.

Spec table. Caption: iPhone 16e vs iPhone 17e. Source note: the rows were checked on 29 September 2026 against MacRumors, AppleInsider (2 March 2026), and Apple's iPhone 17e page. Dollar figures below are launch prices from AppleInsider, not a current deal.

Sources: MacRumors buyer's guide (3 March 2026), AppleInsider's spec comparison (2 March 2026), and apple.com/iphone-17e.

Chip and charging

MacRumors, AppleInsider, and Apple's 17e page all put an A18 in the 16e and an A19 in the 17e. Apple says the 17e A19 has a 4-core GPU with Neural Accelerators. AppleInsider says the iPhone 17's A19 has a five-core GPU, and that its benchmark comparison uses the iPhone 17, not the 17e. This page does not repeat those scores.

The 16e charges by Qi at up to 7.5W. The 17e charges by MagSafe at up to 15W. Apple states that 15W versus 7.5W comparison on the 17e page. MacRumors and AppleInsider's spec table say the same 15W.

Apple says the 17e's C1X modem is up to twice as fast as the C1 modem in the 16e. That is Apple's claim.

Display, camera, and video playback

AppleInsider lists both phones with a 6.1-inch Super Retina XDR display at 2,532 by 1,170 pixels. Apple lists the same 6.1-inch Super Retina XDR display for the 17e. Both have one 48MP Fusion rear camera. AppleInsider says the 2x telephoto view is a crop of that sensor. Both are rated for up to 26 hours of video playback. Apple's page states that figure for the 17e. AppleInsider's table states it for both, under video playback time.

MacRumors lists Ceramic Shield front glass on the 16e and Ceramic Shield 2 on the 17e. Apple says Ceramic Shield 2 has 3x better scratch resistance than the iPhone 16e. That multiplier is Apple's claim.

Storage and launch price

The 16e comes in 128GB, 256GB, and 512GB. The 17e comes in 256GB and 512GB only. Apple says 256GB starting storage is twice the 16e's starting storage. MacRumors and AppleInsider both list a $599 starting launch price for each phone. The $599 starting price comes from MacRumors and AppleInsider.

AppleInsider also lists launch prices by capacity: 16e 128GB $599, 256GB $699, 512GB $899; 17e 256GB $599, 512GB $799. At launch, the 512GB 16e cost more than the 256GB 17e. A discounted 16e can change that. Check a live price. This page does not give a sale price.

Who should buy which

Coming from an iPhone 8, the 17e 256GB is the phone these sources point you toward, because an iPhone 8 is older than the iPhone 14 cutoff MacRumors uses. Take the 16e 512GB only if the extra storage is the thing you cannot give up and the price, checked today, is close.`;

export const IPHONE_16E_VS_IPHONE_17E: EditorialComparison = buildEditorialComparison({
  slug: "iphone-16e-vs-iphone-17e",
  title: "iPhone 16e vs iPhone 17e: 512GB or 256GB?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: E16,
      slug: E16,
      name: "iPhone 16e",
      shortDesc:
        "2025 budget iPhone with an A18, Qi charging up to 7.5W, Ceramic Shield, and 128GB, 256GB, or 512GB storage.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "512GB was a launch option. The 17e starts at 256GB (AppleInsider, MacRumors)",
        "Same 6.1-inch Super Retina XDR display and single 48MP Fusion camera as the 17e",
        "Up to 26 hours of video playback, the same rating AppleInsider lists for the 17e",
        "MacRumors still calls a heavily discounted 16e capable if MagSafe does not matter",
      ],
      cons: [
        "Qi wireless charging up to 7.5W, not MagSafe (Apple, MacRumors)",
        "A18 chip, against the A19 in the 17e",
        "Ceramic Shield, against Ceramic Shield 2 on the 17e (MacRumors)",
        "Launched a year earlier, so the update window starts sooner",
      ],
      bestFor: "Best if you need 512GB and the live price is close",
    },
    {
      id: E17,
      slug: E17,
      name: "iPhone 17e",
      shortDesc:
        "2026 budget iPhone with an A19, MagSafe up to 15W, Ceramic Shield 2, and 256GB or 512GB storage.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "A19 chip with a 4-core GPU (Apple, AppleInsider)",
        "MagSafe wireless charging up to 15W, against 7.5W Qi on the 16e (Apple)",
        "Ceramic Shield 2. Apple says 3x better scratch resistance than the 16e",
        "Storage starts at 256GB. Apple says that is twice the 16e's starting storage",
        "Launched a year later, so the update window starts later",
      ],
      cons: [
        "No 128GB model, and no 512GB unless you step up from the $599 launch configuration (AppleInsider)",
        "Same 48MP Fusion camera hardware as the 16e (AppleInsider)",
        "Same up-to-26-hour video playback rating as the 16e",
        "Apple does not publish an iOS support year count on the cited sources",
      ],
      bestFor: "Best for most people, including an upgrade from an iPhone 8",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Best if you need 512GB at a close live price",
      entityBValue: "Best for most people, including an iPhone 8 upgrade",
      winner: "tie",
    },
    {
      label: "Chip",
      entityAValue: "A18",
      entityBValue: "A19",
      winner: "b",
    },
    {
      label: "Storage",
      entityAValue: "128GB, 256GB, or 512GB",
      entityBValue: "256GB or 512GB",
      winner: "tie",
    },
    {
      label: "Wireless charging",
      entityAValue: "Qi up to 7.5W",
      entityBValue: "MagSafe up to 15W",
      winner: "b",
    },
    {
      label: "Front glass",
      entityAValue: "Ceramic Shield",
      entityBValue: "Ceramic Shield 2",
      winner: "b",
    },
    {
      label: "Launch starting price",
      entityAValue: "$599 (launch, not a live price)",
      entityBValue: "$599 (launch, not a live price)",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "chip",
      "Chip",
      "Specs",
      E16,
      E17,
      "A18 (MacRumors, AppleInsider)",
      "A19, 4-core GPU (Apple, AppleInsider)",
      "b"
    ),
    textAttr(
      "storage",
      "Storage",
      "Specs",
      E16,
      E17,
      "128GB, 256GB, 512GB",
      "256GB, 512GB"
    ),
    textAttr(
      "wireless",
      "Wireless charging",
      "Specs",
      E16,
      E17,
      "Qi up to 7.5W",
      "MagSafe up to 15W",
      "b"
    ),
    textAttr(
      "glass",
      "Front glass",
      "Specs",
      E16,
      E17,
      "Ceramic Shield (MacRumors)",
      "Ceramic Shield 2 (Apple, MacRumors)",
      "b"
    ),
    textAttr(
      "display",
      "Display",
      "Specs",
      E16,
      E17,
      "6.1-inch Super Retina XDR",
      "6.1-inch Super Retina XDR"
    ),
    textAttr(
      "camera",
      "Rear camera",
      "Specs",
      E16,
      E17,
      "Single 48MP Fusion",
      "Single 48MP Fusion"
    ),
    textAttr(
      "video-playback",
      "Video playback",
      "Specs",
      E16,
      E17,
      "Up to 26 hours (AppleInsider)",
      "Up to 26 hours (Apple, AppleInsider)"
    ),
    textAttr(
      "launch-price",
      "Launch starting price",
      "Specs",
      E16,
      E17,
      "$599 starting price at launch (MacRumors, AppleInsider). Not a live price",
      "$599 starting price at launch (MacRumors, AppleInsider). Not a live price"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "iphone-17-vs-iphone-17-pro-vs-iphone-16-pro",
      title: "iPhone 17 vs iPhone 17 Pro vs iPhone 16 Pro",
      category: "technology",
    },
    {
      slug: "iphone-16-pro-vs-iphone-16-pro-max",
      title: "iPhone 16 Pro vs iPhone 16 Pro Max",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Best for most people, including an iPhone 8 upgrade: iPhone 17e 256GB. Best if you need 512GB: iPhone 16e, after a live price check.",
    keyFact:
      "Apple, MacRumors, and AppleInsider list MagSafe up to 15W on the 17e and Qi up to 7.5W on the 16e. Both phones are a 6.1-inch Super Retina XDR display with one 48MP Fusion camera and up to 26 hours of video playback.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 8,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "MacRumors — iPhone 16e vs 17e (3 Mar 2026)", url: MACRUMORS },
      { name: "AppleInsider — iPhone 17e vs 16e (2 Mar 2026)", url: APPLEINSIDER },
      { name: "Apple — iPhone 17e", url: APPLE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "MacRumors buyer's guide",
      url: MACRUMORS,
      description:
        "A18 vs A19, storage tiers, Qi 7.5W vs MagSafe 15W, Ceramic Shield vs Ceramic Shield 2, $599 starting price.",
    },
    {
      type: "external",
      label: "AppleInsider spec comparison",
      url: APPLEINSIDER,
      description:
        "Launch prices by capacity, 6.1-inch display, 48MP Fusion, up to 26 hours video playback. Benchmark scores there are the iPhone 17, not the 17e.",
    },
    {
      type: "external",
      label: "Apple iPhone 17e",
      url: APPLE,
      description:
        "A19, MagSafe up to 15W versus 7.5W on the 16e, Ceramic Shield 2, 6.1-inch Super Retina XDR, 48MP Fusion, up to 26 hours video playback.",
    },
  ],
  metaTitle: "iPhone 16e vs 17e: 512GB or 256GB? | A Versus B",
});
