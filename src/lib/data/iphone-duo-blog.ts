/**
 * ROO-272: repo blog answer for /blog/iphone-duo-features ("iphone fold",
 * "iphone flip", "iphone duo features").
 * Facts read on 19 October 2026 from Apple only: Apple Newsroom "Apple unveils
 * iPhone Duo" (9 September 2026) and "Open up to new possibilities with iPhone
 * Duo" (15 October 2026), apple.com/iphone-duo, apple.com/iphone-duo/specs,
 * apple.com/iphone-18-pro/specs and the apple.com/iphone lineup.
 * No hands-on, durability or rumor claims. No flip-style iPhone exists in
 * Apple's lineup, so none is described. Price is a dated launch MSRP with a
 * link to Apple's store page. No byline, no human-review flag.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const IPHONE_DUO_BLOG_SLUG = "iphone-duo-features";

const PUBLISHED_AT = "2026-10-19T00:00:00Z";

const NEWS_UNVEIL = "https://www.apple.com/newsroom/2026/09/apple-unveils-iphone-duo/";
const NEWS_PREORDER = "https://www.apple.com/newsroom/2026/10/open-up-to-new-possibilities-with-iphone-duo/";
const DUO_PAGE = "https://www.apple.com/iphone-duo/";
const DUO_SPECS = "https://www.apple.com/iphone-duo/specs/";
const PRO_SPECS = "https://www.apple.com/iphone-18-pro/specs/";
const NEWS_18_PRO = "https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/";
const LINEUP = "https://www.apple.com/iphone/";
const COMPARE = "https://www.apple.com/iphone/compare/";
const DUO_BUY = "https://www.apple.com/shop/buy-iphone/iphone-duo";

export const IPHONE_DUO_FAQS = [
  {
    question: "Is iPhone Duo the iPhone Fold?",
    answer:
      "Yes. iPhone Duo is the foldable iPhone people search for as the iPhone Fold. Apple announced it on September 9, 2026 as the first foldable iPhone, and it goes on sale on October 23, 2026.",
  },
  {
    question: "Is there an iPhone Flip?",
    answer:
      "No. Apple has not announced a flip-style iPhone. iPhone Duo folds like a book: a 7.6-inch inner display opens out, and a 5.4-inch outer display works when it is closed.",
  },
  {
    question: "How much does iPhone Duo cost?",
    answer:
      "iPhone Duo has a $1,999 launch price (MSRP) for 256GB, per Apple Newsroom, September 2026. It also comes in 512GB, 1TB and 2TB.",
  },
  {
    question: "When can I buy iPhone Duo?",
    answer:
      "Pre-orders opened on October 16, 2026, and iPhone Duo goes on sale on October 23, 2026 in more than 70 countries and regions, including the U.S. Apple says 28 more countries and regions follow on October 30.",
  },
  {
    question: "Does iPhone Duo have Face ID?",
    answer:
      "No. iPhone Duo uses Touch ID built into the side button, so it unlocks the same way open or closed. iPhone 18 Pro and iPhone 18 Pro Max use Face ID.",
  },
  {
    question: "Does iPhone Duo have a telephoto camera?",
    answer:
      "Not a separate one. iPhone Duo has a 48MP Fusion Main camera that also gives a 12MP optical-quality 2x Telephoto, plus a 48MP Fusion Ultra Wide. iPhone 18 Pro Max adds a 48MP 4x Fusion Telephoto with up to 8x optical-quality zoom.",
  },
];

const FAQ_SECTION = IPHONE_DUO_FAQS.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join("\n\n");

const CONTENT = `**Updated Oct 2026.** The "iPhone fold" is iPhone Duo. Apple announced it on September 9, 2026 as the first foldable iPhone, opened pre-orders on October 16, and puts it on sale on October 23, 2026. It folds like a book, with a 7.6-inch inner display and a 5.4-inch outer display. It is not a flip phone, and Apple has not announced a flip-style iPhone.

## Key takeaways

- iPhone Duo is Apple's first foldable iPhone. Apple announced it on September 9, 2026, and it goes on sale on October 23, 2026.
- iPhone Duo folds like a book: a 7.6-inch inner display opens out, and a 5.4-inch outer display works when it is closed.
- Apple has not announced a flip-style iPhone. In October 2026, iPhone Duo is the only foldable model in Apple's iPhone lineup.
- iPhone Duo uses the A20 Pro chip, the same chip as iPhone 18 Pro, and Apple rates it for up to 31 hours of video playback on the inner display and up to 44 hours on the outer display.
- iPhone Duo has two rear cameras (48MP Fusion Main with optical-quality 2x, and 48MP Fusion Ultra Wide) and no separate telephoto camera.
- iPhone Duo has a $1,999 launch price (MSRP) for 256GB, per Apple Newsroom, September 2026. [See vendor page for current price](${DUO_BUY}).

| Spec | iPhone Duo |
| --- | --- |
| Design | Folds like a book; grade 5 titanium |
| Inner display | 7.6-inch Super Retina XDR folding OLED, 1878 x 2670 at 430 ppi, nano-texture finish |
| Outer display | 5.4-inch Super Retina XDR OLED, 1398 x 2034 at 460 ppi |
| Chip | A20 Pro (6-core CPU, 7-core GPU, Dual 16-core Neural Engine) |
| Rear cameras | 48MP Fusion Main (with 12MP optical-quality 2x Telephoto), 48MP Fusion Ultra Wide |
| Video playback | Up to 31 hours (inner display), up to 44 hours (outer display) |
| Weight | 254 g (8.96 oz) |
| Thickness | 5.2 mm open, 11.3 mm closed |
| Storage | 256GB, 512GB, 1TB, 2TB |
| Unlock | Touch ID in the side button |
| SIM | eSIM only |
| Water and dust | IP68 (up to 6 meters for up to 30 minutes) |

*Table: iPhone Duo key specifications as Apple lists them, October 2026.*

## When did Apple announce iPhone Duo, and when can you buy it?

Apple announced iPhone Duo on September 9, 2026, alongside iPhone 18 Pro and iPhone 18 Pro Max. Pre-orders opened at 5 a.m. PT on Friday, October 16, 2026, and it goes on sale on Friday, October 23, 2026.

- **First wave:** more than 70 countries and regions, including the U.S., the UK, Canada, Australia, Germany, France, India, Japan and China.
- **Second wave:** 28 more countries and regions from Friday, October 30, 2026.
- **Software:** Apple says iPhone Duo ships with iOS 27.1.
- **Colors:** star white and night sky.

## Is iPhone Duo a flip phone or a foldable?

iPhone Duo is a book-style foldable, not a flip phone. It opens sideways into a small tablet-shaped screen, and closes into a narrower phone with its own outer display. Apple has not announced a flip-style iPhone that folds top to bottom.

| | Open | Closed |
| --- | --- | --- |
| Height | 117.8 mm (4.64 in) | 117.8 mm (4.64 in) |
| Width | 164.6 mm (6.48 in) | 84.1 mm (3.31 in) |
| Depth | 5.2 mm (0.21 in) | 11.3 mm (0.44 in) |
| Screen in use | 7.6-inch inner display | 5.4-inch outer display |

*Table: iPhone Duo size open and closed, from Apple's iPhone Duo tech specs, October 2026.*

Apple says the closed phone is similar in size to a passport and is comfortable to use one-handed. Opened, Apple calls it the thinnest iPhone it has made.

## What are iPhone Duo's displays like?

iPhone Duo has two Super Retina XDR OLED displays that share the same aspect ratio, so apps keep their proportions open or closed. Apple says the inner display is 50 percent larger than the iPhone 18 Pro Max display, and the outer display has 90 percent of the screen area of iPhone 18 Pro.

- **Inner:** 7.6 inches, 1878 x 2670 pixels at 430 ppi, with a nano-texture finish that Apple says reduces glare.
- **Outer:** 5.4 inches, 1398 x 2034 pixels at 460 ppi.
- **Both:** ProMotion up to 120Hz, Always-On, Dynamic Island, 1000 nits typical, 1600 nits HDR peak and 3000 nits outdoor peak brightness.
- **Front camera under the screen:** the inner display hides a FaceTime camera that records 1080p video.
- **Apple Pencil:** Apple says support for Apple Pencil (USB-C) arrives later in 2026, so it is not part of the launch feature set.

## What chip, battery and charging does iPhone Duo have?

iPhone Duo runs the A20 Pro, the chip in iPhone 18 Pro, with a vapor chamber for heat. It splits its battery into two cells, one on each side of the fold, and Apple's ratings are below.

| Battery rating (Apple) | iPhone Duo |
| --- | --- |
| Video playback, inner display | Up to 31 hours |
| Video playback, outer display | Up to 44 hours |
| Streamed video, inner display | Up to 26 hours |
| Streamed video, outer display | Up to 37 hours |
| Typical use (both displays used equally) | Up to 24 hours |

*Table: Apple's battery ratings for iPhone Duo, October 2026. Apple says actual results vary.*

- **Chip:** 6-core CPU with 2 super cores and 4 efficiency cores, 7-core GPU with Neural Accelerators, Dual 16-core Neural Engine.
- **Wired charging:** up to 50 percent in around 20 minutes with a 60W-capable adapter or higher (sold separately).
- **Wireless charging:** MagSafe and Qi2 up to 25W; up to 50 percent in around 30 minutes with a 35W adapter and MagSafe Charger.
- **Unlock:** Touch ID in the side button. There is no Face ID.
- **SIM:** eSIM only, worldwide. Apple says the space saved goes to battery.

## What cameras does iPhone Duo have?

iPhone Duo has two rear cameras and two front cameras. The rear pair is a 48MP Fusion Main (26 mm, f/1.6) that also gives a 12MP optical-quality 2x Telephoto, and a 48MP Fusion Ultra Wide (13 mm, f/2.2). There is no separate telephoto lens.

- **Front, outer display:** 12MP Center Stage camera that can take landscape selfies without rotating the phone.
- **Front, inner display:** the under-display FaceTime camera, 1080p video.
- **Video:** up to 4K at 120 fps in Dolby Vision on the Fusion Main camera.
- **Features Apple says no other iPhone has:** Smart Take, which captures photos automatically when subjects are posing; Duo Preview, which shows the person being photographed a live preview on the outer display; Kid Cue, which plays Peanuts animations on the outer display to catch a child's attention; and Duo FaceTime, which lets nearby people join a call on the outer display.

## Which iOS 27 features are made for iPhone Duo?

Apple says iOS 27 is adapted for the fold. The main changes are:

1. **Split View:** two apps side by side on the inner display, which Apple says is a first for iPhone, plus two windows of the same app, such as Safari.
2. **Controls on the side:** Lock Screen controls, the Dock and app navigation move to the side to leave more vertical space.
3. **Two Home Screen pages when open,** with Today View widgets on the left.
4. **A redesigned Dynamic Island** that sits vertically on the side of each display.
5. **StandBy on either display,** even when iPhone Duo is not charging.
6. **Hands-free use:** iPhone Duo can stand on its own for FaceTime calls and videos.

Siri AI is rolling out as a beta with iOS 27, in English first. Apple says Siri AI will not initially be available in the EU, and the new Apple Intelligence features will not be available in China. Some Apple Intelligence features have daily usage limits.

## iPhone Duo vs iPhone 18 Pro Max: what is different?

Both use the A20 Pro chip and come in the same four storage sizes. iPhone 18 Pro Max has the longer battery rating, the 4x telephoto camera and Face ID; iPhone Duo has the larger folding screen and the Duo-only camera features.

| | iPhone Duo | iPhone 18 Pro Max |
| --- | --- | --- |
| Design | Foldable (book-style) | Slab phone, aluminum unibody |
| Display | 7.6-inch inner, 5.4-inch outer | 6.9-inch |
| Chip | A20 Pro | A20 Pro |
| Rear cameras | 48MP Main (2x optical-quality), 48MP Ultra Wide | 48MP Main with variable aperture, 48MP Ultra Wide, 48MP 4x Telephoto (up to 8x optical-quality) |
| Front camera | 12MP Center Stage, plus under-display FaceTime camera | 18MP Center Stage |
| Video playback (Apple rating) | Up to 31 h inner / 44 h outer | Up to 45 h |
| Typical use (Apple rating) | Up to 24 h | Up to 30 h |
| Weight | 254 g | 249 g |
| Unlock | Touch ID | Face ID |
| Storage | 256GB to 2TB | 256GB to 2TB |
| Starting price, 256GB (U.S.) | $1,999 launch price (MSRP), per Apple Newsroom, September 2026 | $1,299 launch price (MSRP), per Apple Newsroom, September 2026 |

*Table: iPhone Duo vs iPhone 18 Pro Max from Apple's tech specs and launch announcements, October 2026.*

[See vendor page for current price](${DUO_BUY}). Choosing between Pro Max generations instead? See [iPhone 17 Pro Max vs iPhone 18 Pro Max](/compare/iphone-17-pro-max-vs-iphone-18-pro-max).

## What has Apple not announced?

Apple has announced one foldable iPhone, in one size, and nothing beyond it. In October 2026:

- **No flip-style iPhone.** Apple's current lineup is iPhone Duo, iPhone 18 Pro, iPhone 18 Pro Max, iPhone Air, iPhone 17, iPhone 17e and iPhone 16.
- **No second foldable model.** iPhone Duo comes in one size, with a choice of storage and two colors.
- **Apple Pencil support is still to come.** Apple says it arrives later in 2026.
- **Battery hours are Apple's ratings.** Apple says real-world results vary with use and settings.

## FAQ

${FAQ_SECTION}

## Compare further

- [iPhone 17 Pro Max vs iPhone 18 Pro Max](/compare/iphone-17-pro-max-vs-iphone-18-pro-max)
- [Galaxy Z Fold 7 vs Galaxy S26 Ultra](/compare/galaxy-z-fold-7-vs-samsung-galaxy-s26-ultra)

## Sources

- [Apple Newsroom: Apple unveils iPhone Duo (September 9, 2026)](${NEWS_UNVEIL})
- [Apple Newsroom: Open up to new possibilities with iPhone Duo (October 15, 2026)](${NEWS_PREORDER})
- [Apple: iPhone Duo](${DUO_PAGE})
- [Apple: iPhone Duo tech specs](${DUO_SPECS})
- [Apple: iPhone 18 Pro and iPhone 18 Pro Max tech specs](${PRO_SPECS})
- [Apple Newsroom: Apple debuts iPhone 18 Pro and iPhone 18 Pro Max (September 9, 2026)](${NEWS_18_PRO})
- [Apple: iPhone lineup](${LINEUP})
- [Apple: Compare iPhone models](${COMPARE})
`;

export const IPHONE_DUO_ARTICLE: BlogArticle = {
  id: "blog-iphone-duo-features",
  slug: IPHONE_DUO_BLOG_SLUG,
  title: "iPhone Duo: Apple's First Foldable iPhone, Explained",
  excerpt:
    "iPhone Duo is Apple's first foldable iPhone, announced September 9, 2026 and on sale October 23. It folds like a book; Apple has not announced a flip iPhone.",
  content: CONTENT,
  category: "technology",
  tags: ["iPhone Duo", "iPhone fold", "foldable iPhone", "iPhone flip", "apple", "iOS 27"],
  metaTitle: "iPhone Duo Features: Apple's Foldable iPhone",
  metaDescription:
    "iPhone Duo is Apple's first foldable iPhone: 7.6-inch inner and 5.4-inch outer displays, A20 Pro, on sale October 23, 2026. Apple has no flip iPhone.",
  relatedComparisonSlugs: ["iphone-17-pro-max-vs-iphone-18-pro-max", "galaxy-z-fold-7-vs-samsung-galaxy-s26-ultra"],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: PUBLISHED_AT,
  viewCount: 0,
};
