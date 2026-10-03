import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-138 — iPhone 17 Pro vs iPhone 18 Pro for someone who upgrades rarely.
 * Specs checked on 3 October 2026 against Apple's iPhone 18 Pro spec page,
 * Apple Support's iPhone 17 Pro tech specs, Apple's newsroom post, and the
 * Apple Store buy page. No page-level winner. No benchmark scores.
 * /entity/iphone-17-pro was index, follow. /entity/iphone-18-pro was
 * noindex, nofollow, so this page does not link that hub.
 */

const PRO_17 = "iphone-17-pro";
const PRO_18 = "iphone-18-pro";

const APPLE_18 = "https://www.apple.com/iphone-18-pro/specs/";
const APPLE_17 = "https://support.apple.com/en-us/125090";
const NEWS_18 =
  "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/";
const BUY_18 = "https://www.apple.com/shop/buy-iphone/iphone-18-pro";
const REDDIT =
  "https://www.reddit.com/r/AppleWhatShouldIBuy/comments/1wv8num/17_pro_vs_18_pro/";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";

const SHORT_ANSWER =
  "Choose the iPhone 18 Pro if you keep a phone for years and want Apple's newest Pro chip and battery ratings. Apple lists an A20 Pro chip, up to 36 hours of video playback, and up to 24 hours of typical use. Choose the iPhone 17 Pro if a carrier or street price makes it clearly cheaper. Apple Support lists an A19 Pro chip and up to 33 hours of video playback, and that page does not list a typical-use hour. This page does not crown a winner.";

const FAQS = [
  {
    question: "Is the iPhone 18 Pro worth the extra over the iPhone 17 Pro?",
    answer:
      "Choose the iPhone 18 Pro if you will keep the phone for years and you want the A20 Pro chip plus the higher battery ratings Apple publishes. Choose the iPhone 17 Pro if the offer in front of you is clearly cheaper and the A19 Pro, with up to 33 hours of video playback, is enough. Apple's store page, fetched on 3 October 2026, lists a 256GB iPhone 18 Pro purchase price of $1,199 before taxes and trade-in. This page does not have a current Apple Store price for the iPhone 17 Pro: the 17 Pro specs URL and the 17 Pro buy URL both redirected away from a 17 Pro listing that day. One shopper on r/AppleWhatShouldIBuy wrote that AT&T quoted about $15.99 a month for the 17 Pro with no trade-in and about $23.65 a month for the 18 Pro with a trade-in. Those are that shopper's quotes, not a current price.",
  },
  {
    question: "Which has better battery life, iPhone 17 Pro or iPhone 18 Pro?",
    answer:
      "On the hours Apple publishes, the iPhone 18 Pro. Apple rates it for up to 24 hours of typical use, up to 36 hours of video playback, and up to 33 hours of streamed video playback. Apple Support rates the iPhone 17 Pro for up to 33 hours of video playback and up to 30 hours of streamed video playback, and that page does not list a typical-use hour. Apple says the 18 Pro hours come from preproduction testing and that results vary. Apple Support says 17 Pro battery claims vary with the network and with use. This page does not add a lab score of its own.",
  },
  {
    question: "Which chip is in the iPhone 18 Pro and the iPhone 17 Pro?",
    answer:
      "The iPhone 18 Pro uses the A20 Pro. Apple lists a 6-core CPU with 2 super cores and 4 efficiency cores, and a 7-core GPU. The iPhone 17 Pro uses the A19 Pro. Apple Support lists a 6-core CPU with 2 performance cores and 4 efficiency cores, and a 6-core GPU. This page does not cite a benchmark, so it does not turn those names into a speed ranking.",
  },
  {
    question: "Should I upgrade from an iPhone 13 mini to the 17 Pro or the 18 Pro?",
    answer:
      "Both of these are 6.3-inch Pro phones, so either one is a size step up from a mini. This page does not restate iPhone 13 mini specs. If you keep phones for years, the iPhone 18 Pro is the one with the newer chip and the higher published battery ratings. If the 17 Pro is the clearly cheaper phone in the offer you actually have, that price gap is the reason to take the prior Pro. A shopper in that spot, coming from a dying 13 mini, posted AT&T monthly quotes on r/AppleWhatShouldIBuy. Treat those quotes as one example, and check the offer you are given.",
  },
  {
    question: "Should I get a Pro Max instead of the iPhone 17 Pro or 18 Pro?",
    answer:
      "That is a separate comparison. This page does not list iPhone 17 Pro Max or iPhone 18 Pro Max specs, and it does not link a 17 Pro Max versus 18 Pro Max page, because that compare was not live on 3 October 2026. A live page does cover iPhone 17 Pro versus iPhone 17 Pro Max if the question is the larger 17 Pro body.",
  },
  {
    question: "How does a trade-in change the iPhone 17 Pro versus 18 Pro price?",
    answer:
      "Recalculate with the credit you are actually offered. A trade-in can shrink the gap, or it can already be inside the higher quote, which means the two monthly numbers are not the same kind of deal. In the Reddit thread, the about $23.65 a month figure for the 18 Pro included a trade-in, and the about $15.99 a month figure for the 17 Pro did not. Those are the asker's examples, not current prices. Apple's newsroom post says iPhone 18 Pro starts at $1,199, and that Apple Trade In credit for an iPhone 13 or later was listed at $175 to $885, with values that vary by condition, year, and configuration. The same post says select carrier deals can reach up to $1,200 in credits for an iPhone 14 or later. Check a live offer before you decide.",
  },
];

const VERDICT = `Best if you keep a phone for years and want the newest Pro chip and battery ratings: iPhone 18 Pro. A20 Pro, up to 36 hours of video playback, and up to 24 hours of typical use.

Best if the offer in front of you is clearly cheaper: iPhone 17 Pro. A19 Pro and up to 33 hours of video playback. Apple Support does not list a typical-use hour.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `Choose the iPhone 18 Pro if you keep a phone for years and want the newest Pro chip and the higher battery ratings Apple publishes. Choose the iPhone 17 Pro if a carrier or street price makes it clearly cheaper. This page does not crown a winner.

Source note: chip, display, weight, storage, and the iPhone 18 Pro battery hours are from Apple's iPhone 18 Pro spec page, fetched on 3 October 2026. The iPhone 17 Pro figures are from Apple Support's iPhone 17 Pro tech specs, fetched the same day. The $1,199 starting price is from Apple's newsroom post and from the Apple Store buy page, both fetched the same day. The monthly AT&T figures are one shopper's quotes from a Reddit thread, not a price this page checked with a carrier.

Chip

The iPhone 18 Pro uses an A20 Pro chip. Apple lists a 6-core CPU with 2 super cores and 4 efficiency cores, and a 7-core GPU. The iPhone 17 Pro uses an A19 Pro chip. Apple Support lists a 6-core CPU with 2 performance cores and 4 efficiency cores, and a 6-core GPU. The names and the core counts are the published difference. This page does not cite a benchmark.

Battery

The iPhone 18 Pro is the phone with the higher published battery ratings. Apple rates typical use at up to 24 hours, video playback at up to 36 hours, and streamed video playback at up to 33 hours. Apple's footnotes say the typical-use figure is from preproduction testing in August 2026, and the video figures are from preproduction testing in July 2026. Apple Support rates the iPhone 17 Pro at up to 33 hours of video playback and up to 30 hours of streamed video playback. That support page does not list a typical-use hour. Its battery footnote says claims depend on the network and on use, and that actual results will vary. Do not read the 18 Pro's 24-hour typical-use line as a number the 17 Pro also published.

Body, display, and storage

Both phones list a 6.3-inch Super Retina XDR OLED display. Apple lists the same footprint for both: 150.0 mm tall, 71.9 mm wide, and 8.75 mm thick. The iPhone 18 Pro weighs 211 grams. The iPhone 17 Pro weighs 206 grams. Storage on the iPhone 18 Pro is 256GB, 512GB, 1TB, or 2TB. Storage on the iPhone 17 Pro is 256GB, 512GB, or 1TB.

Price and trade-in

Apple's newsroom post says iPhone 18 Pro starts at $1,199 (U.S.). The Apple Store buy page, fetched on 3 October 2026, lists a 256GB iPhone 18 Pro purchase price of $1,199 before taxes and any trade-in credit. Fetching apple.com/iphone-17-pro/specs/ that day landed on apple.com/iphone/, and fetching the iPhone 17 Pro buy URL landed on the general buy-iPhone page. This page does not invent a current 17 Pro price from those redirects.

Apple's newsroom post also says customers trading in an iPhone 13 or later can get $175 to $885 in credit, and that trade-in values vary by condition, year, and configuration. It says select carrier deals can reach up to $1,200 in credits when the trade-in is an iPhone 14 or later. Those are Apple's published ranges, not a quote for one buyer.

One shopper on r/AppleWhatShouldIBuy, upgrading from a dying iPhone 13 mini, wrote that AT&T quoted about $15.99 a month for the 17 Pro with no trade-in and about $23.65 a month for the 18 Pro with a trade-in. Use those numbers only as that thread's example. The 18 Pro quote already included a trade-in and was still the higher monthly figure in that example, so a trade-in does not automatically make the newer phone the lower payment. Check the offer in front of you.

Who should buy which

Choose the iPhone 18 Pro if you are the person who keeps a phone for years and you want the A20 Pro and the battery hours Apple rates higher. The 256GB store price checked on 3 October 2026 is $1,199 before tax and trade-in.

Choose the iPhone 17 Pro if the carrier or street price you are offered is clearly lower and you can live with the A19 Pro and Apple Support's 33-hour video-playback rating. This page cannot tell you that the 17 Pro is cheaper today, because Apple's own 17 Pro buy URL did not show a price on the day these pages were fetched.

Pro Max

A Pro Max is a different phone. This page does not compare iPhone 17 Pro Max and iPhone 18 Pro Max, and it does not link that compare, because no live page was up on 3 October 2026. The live iPhone 17 Pro versus iPhone 17 Pro Max page is the one to use if the question is the larger 17-generation body.`;

const SPEC_BOTH = "Specs · Apple, fetched 2026-10-03";

export const IPHONE_17_PRO_VS_IPHONE_18_PRO: EditorialComparison = buildEditorialComparison({
  slug: "iphone-17-pro-vs-iphone-18-pro",
  title: "iPhone 17 Pro vs iPhone 18 Pro: Which Should You Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: PRO_17,
      slug: PRO_17,
      name: "iPhone 17 Pro",
      shortDesc:
        "6.3-inch Pro with an A19 Pro chip, up to 33 hours of video playback, and storage up to 1TB.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "A19 Pro chip with a 6-core GPU (Apple Support)",
        "Up to 33 hours of video playback and up to 30 hours streamed (Apple Support)",
        "206 grams, against 211 grams on the iPhone 18 Pro (Apple)",
        "The phone to take when the offer in front of you is clearly cheaper",
      ],
      cons: [
        "Apple Support does not list a typical-use hour. The 18 Pro lists up to 24 hours",
        "Video playback is up to 33 hours, against up to 36 hours on the 18 Pro",
        "Storage stops at 1TB. The 18 Pro lists a 2TB option",
        "No current Apple Store price on the 17 Pro buy URL fetched 3 October 2026",
      ],
      bestFor: "Best when the carrier or street price is clearly lower",
    },
    {
      id: PRO_18,
      slug: PRO_18,
      name: "iPhone 18 Pro",
      shortDesc:
        "6.3-inch Pro with an A20 Pro chip, up to 36 hours of video playback, and up to 24 hours of typical use.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "A20 Pro chip with a 7-core GPU (Apple)",
        "Up to 36 hours of video playback and up to 24 hours of typical use (Apple)",
        "Storage from 256GB to 2TB (Apple)",
        "Apple Store lists 256GB at $1,199 before tax and trade-in, fetched 2026-10-03",
      ],
      cons: [
        "211 grams, against 206 grams on the iPhone 17 Pro",
        "The published starting price is $1,199. A lower 17 Pro offer can still be the better buy",
        "Apple's battery hours are preproduction test ratings, and Apple says results vary",
      ],
      bestFor: "Best for a multi-year keep of the newest Pro chip and battery ratings",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Clearly lower carrier or street price",
      entityBValue: "Multi-year keep of the newest Pro",
      winner: "tie",
    },
    {
      label: "Chip",
      entityAValue: "A19 Pro, 6-core GPU",
      entityBValue: "A20 Pro, 7-core GPU",
      winner: "tie",
    },
    {
      label: "Video playback",
      entityAValue: "Up to 33 hours",
      entityBValue: "Up to 36 hours",
      winner: "b",
    },
    {
      label: "Typical use",
      entityAValue: "Not listed on Apple Support",
      entityBValue: "Up to 24 hours",
      winner: "tie",
    },
    {
      label: "Storage",
      entityAValue: "256GB to 1TB",
      entityBValue: "256GB to 2TB",
      winner: "b",
    },
  ],
  attributes: [
    textAttr("chip", "Chip", SPEC_BOTH, PRO_17, PRO_18, "A19 Pro, 6-core GPU", "A20 Pro, 7-core GPU"),
    textAttr(
      "playback",
      "Video playback",
      SPEC_BOTH,
      PRO_17,
      PRO_18,
      "Up to 33 hours",
      "Up to 36 hours",
      "b"
    ),
    textAttr(
      "streamed",
      "Streamed video playback",
      SPEC_BOTH,
      PRO_17,
      PRO_18,
      "Up to 30 hours",
      "Up to 33 hours",
      "b"
    ),
    textAttr(
      "typical",
      "Typical use",
      SPEC_BOTH,
      PRO_17,
      PRO_18,
      "Not listed on Apple Support",
      "Up to 24 hours"
    ),
    textAttr(
      "display",
      "Display",
      SPEC_BOTH,
      PRO_17,
      PRO_18,
      "6.3-inch Super Retina XDR OLED",
      "6.3-inch Super Retina XDR OLED"
    ),
    textAttr(
      "body",
      "Size and weight",
      SPEC_BOTH,
      PRO_17,
      PRO_18,
      "150.0 mm by 71.9 mm, 8.75 mm, 206 g",
      "150.0 mm by 71.9 mm, 8.75 mm, 211 g"
    ),
    textAttr(
      "storage",
      "Storage",
      SPEC_BOTH,
      PRO_17,
      PRO_18,
      "256GB, 512GB, or 1TB",
      "256GB, 512GB, 1TB, or 2TB",
      "b"
    ),
    textAttr(
      "price",
      "Apple price checked 2026-10-03",
      "Price · Apple Store and newsroom for the 18 Pro. No 17 Pro price was listed. Fetched 2026-10-03",
      PRO_17,
      PRO_18,
      "No current price. The specs and buy URLs redirected",
      "256GB $1,199 before tax and trade-in"
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
      slug: "iphone-17-pro-vs-pro-max",
      title: "iPhone 17 Pro vs iPhone 17 Pro Max",
      category: "technology",
    },
    {
      slug: "iphone-17-vs-iphone-air",
      title: "iPhone Air vs iPhone 17",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "iPhone 18 Pro for a multi-year keep of the newest Pro chip and battery ratings. iPhone 17 Pro when the offer in front of you is clearly cheaper.",
    keyFact:
      "Apple rates the iPhone 18 Pro for up to 36 hours of video playback and up to 24 hours of typical use, with an A20 Pro chip. Apple Support rates the iPhone 17 Pro for up to 33 hours of video playback, with an A19 Pro chip, and does not list a typical-use hour.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 8,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "Apple — iPhone 18 Pro specs (fetched 2026-10-03)", url: APPLE_18 },
      { name: "Apple Support — iPhone 17 Pro tech specs (fetched 2026-10-03)", url: APPLE_17 },
      { name: "Apple Newsroom — iPhone 18 Pro, starts at $1,199 (fetched 2026-10-03)", url: NEWS_18 },
      { name: "Apple Store — iPhone 18 Pro buy (fetched 2026-10-03)", url: BUY_18 },
      {
        name: "Reddit — r/AppleWhatShouldIBuy, asker's AT&T quotes only (fetched 2026-10-03)",
        url: REDDIT,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple iPhone 18 Pro specs",
      url: APPLE_18,
      description:
        "Fetched 2026-10-03. A20 Pro, 6.3-inch, 211 g, 256GB to 2TB, up to 24 hours typical use, up to 36 hours video playback.",
    },
    {
      type: "external",
      label: "Apple Support iPhone 17 Pro specs",
      url: APPLE_17,
      description:
        "Fetched 2026-10-03. A19 Pro, 6.3-inch, 206 g, 256GB to 1TB, up to 33 hours video playback. No typical-use hour.",
    },
    {
      type: "external",
      label: "Apple Newsroom iPhone 18 Pro",
      url: NEWS_18,
      description:
        "Fetched 2026-10-03. Starts at $1,199. Trade-in range $175 to $885 for iPhone 13 or later. Values vary.",
    },
    {
      type: "external",
      label: "Apple Store iPhone 18 Pro",
      url: BUY_18,
      description:
        "Fetched 2026-10-03. 256GB purchase price $1,199 before taxes and trade-in credit.",
    },
    {
      type: "external",
      label: "Reddit thread: 17 Pro vs 18 Pro",
      url: REDDIT,
      description:
        "Asker's example only. About $15.99 a month for the 17 Pro with no trade-in, and about $23.65 a month for the 18 Pro with a trade-in, on AT&T. Not a current price.",
    },
    {
      type: "blog",
      label: "iPhone 17 Pro hub",
      url: "/entity/iphone-17-pro",
      description: "iPhone 17 Pro hub.",
    },
  ],
  metaTitle: "iPhone 17 Pro vs iPhone 18 Pro | A Versus B",
});
