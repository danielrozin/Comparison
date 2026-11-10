/**
 * ROO-406: repo override for
 * /blog/macbook-air-weight-comparison-2025-2026-which-model-is-right-for-you.
 * Weights, size, display, ports, and battery figures opened 2026-11-10 on
 * Apple's MacBook Air tech specs page. The live May 2026 article called the
 * 13-inch M5 weight "expected" and printed 1.24 kg and 1.50 kg.
 * Removed because Apple's current specs page does not support them: M3 and M4
 * weights, a fanless-versus-fan claim, Dell and ThinkPad weights, storage
 * "does not change the weight," 2017 history, and any dollar price.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const MACBOOK_AIR_WEIGHT_BLOG_SLUG =
  "macbook-air-weight-comparison-2025-2026-which-model-is-right-for-you";

const PUBLISHED_AT = "2026-05-05T18:14:10.191Z";
const UPDATED_AT = "2026-11-10T00:00:00Z";

const SPECS_URL = "https://www.apple.com/macbook-air/specs/";

export const MACBOOK_AIR_WEIGHT_FAQS = [
  {
    question: "How much does the 13-inch MacBook Air weigh?",
    answer:
      "Apple's MacBook Air tech specs list the 13-inch model at 2.7 pounds (1.23 kg). The same row lists the case at 0.44 inch high, 11.97 inches wide, and 8.46 inches deep. Apple says weight varies by configuration and manufacturing process.",
  },
  {
    question: "How much does the 15-inch MacBook Air weigh?",
    answer:
      "Apple's MacBook Air tech specs list the 15-inch model at 3.3 pounds (1.51 kg). The case is 0.45 inch high, 13.40 inches wide, and 9.35 inches deep. Apple says weight varies by configuration and manufacturing process.",
  },
  {
    question: "How much heavier is the 15-inch MacBook Air?",
    answer:
      "Using Apple's listed weights, 3.3 pounds minus 2.7 pounds is 0.6 pounds, and 1.51 kg minus 1.23 kg is 0.28 kg. Both figures are the listed weights, and Apple says the actual weight varies by configuration and manufacturing process.",
  },
  {
    question: "Does Apple list an M4 MacBook Air on the current specs page?",
    answer:
      "No. The MacBook Air tech specs page opened on November 10, 2026 lists Apple M5 models only. An M3 or M4 weight is not stated here.",
  },
  {
    question: "What battery life does Apple list for the MacBook Air?",
    answer:
      "Apple lists up to 18 hours of video streaming and up to 15 hours of wireless web for both sizes. Apple says it tested preproduction systems in January 2026, and that battery life varies by use and configuration.",
  },
  {
    question: "Does storage change the MacBook Air weight?",
    answer:
      "Apple does not publish a separate weight for each storage size. It does say weight varies by configuration and manufacturing process, so a single listed weight is not a promise that every storage option weighs the same.",
  },
];

const FAQ_MD = MACBOOK_AIR_WEIGHT_FAQS.map(
  (faq) => `### ${faq.question}\n\n${faq.answer}`,
).join("\n\n");

const CONTENT = `**Updated November 10, 2026.** Apple's current MacBook Air tech specs list two sizes, both with an M5 chip: the 13-inch model at 2.7 pounds (1.23 kg) and the 15-inch model at 3.3 pounds (1.51 kg). The difference between those listed weights is 0.6 pounds (0.28 kg). Apple says weight varies by configuration and manufacturing process, so the listed number is not a scale reading for every build. The 13-inch case is 0.44 inch thick and the 15-inch case is 0.45 inch thick. Apple lists up to 18 hours of video streaming and up to 15 hours of wireless web for both, from a January 2026 test of preproduction systems. The specs page lists M5 only, so older M3 and M4 weights are not repeated here.

| Model on Apple's specs | Listed weight | Case size | Display Apple names |
| --- | --- | --- | --- |
| 13-inch MacBook Air (M5) | 2.7 pounds (1.23 kg) | 0.44 × 11.97 × 8.46 inches (1.13 × 30.41 × 21.5 cm) | 13.6-inch Liquid Retina |
| 15-inch MacBook Air (M5) | 3.3 pounds (1.51 kg) | 0.45 × 13.40 × 9.35 inches (1.15 × 34.04 × 23.76 cm) | 15.3-inch Liquid Retina |

*Table: listed weight, case size, and display for the two MacBook Air sizes on Apple's tech specs, opened November 10, 2026. Apple's footnote says weight varies by configuration and manufacturing process.*

For the step up in weight to a Pro, see [MacBook Air vs MacBook Pro](/compare/macbook-air-vs-macbook-pro).

## How much does the 13-inch MacBook Air weigh?

2.7 pounds (1.23 kg), which is the weight Apple lists for the 13-inch MacBook Air. The case is 0.44 inch (1.13 cm) high, 11.97 inches (30.41 cm) wide, and 8.46 inches (21.5 cm) deep. Apple's display row calls it a 13.6-inch Liquid Retina display. Apple's footnote says the corners at the top are rounded, so the rectangular diagonal is 13.6 inches and the viewable area is less.

## How much does the 15-inch MacBook Air weigh?

3.3 pounds (1.51 kg), which is the weight Apple lists for the 15-inch MacBook Air. The case is 0.45 inch (1.15 cm) high, 13.40 inches (34.04 cm) wide, and 9.35 inches (23.76 cm) deep. Apple calls the display a 15.3-inch Liquid Retina display. The same footnote says the corners at the top are rounded, so the rectangular diagonal is 15.3 inches and the viewable area is less.

## How much heavier is the 15-inch model?

0.6 pounds, if you subtract Apple's listed 13-inch weight from the listed 15-inch weight. In kilograms the same subtraction is 1.51 minus 1.23, which is 0.28 kg. That gap is the difference between the two listed weights. It is not a packed-bag measurement, and Apple's footnote still says weight varies by configuration and manufacturing process.

## What else is the same, and what else differs?

Both sizes on the current specs page use an Apple M5 chip, a MagSafe 3 port, a 3.5 mm headphone jack, and two Thunderbolt 4 ports. Apple lists the same battery claims for both: up to 18 hours of video streaming and up to 15 hours of wireless web. The battery cells are not the same size. Apple lists a 53.8-watt-hour battery in the 13-inch model and a 66.5-watt-hour battery in the 15-inch model.

Apple says the battery figures come from tests in January 2026 on preproduction systems. The 13-inch test system was an M5 with a 10-core CPU and an 8-core GPU. The 15-inch test system was an M5 with a 10-core CPU and a 10-core GPU. Both had 16GB of unified memory and a 512GB SSD. Wireless-web testing was browsing 25 popular websites on Wi-Fi. Video testing was 1080p in Safari on Wi-Fi, with the display at 8 clicks from the bottom and the keyboard backlight off. Apple says battery life varies by use and configuration.

## Which size should you carry?

Choose the 13-inch model when the listed 2.7 pounds matters more than the larger display. Choose the 15-inch model when the 15.3-inch display is worth the listed extra 0.6 pounds. That is a choice between Apple's listed weight and Apple's listed screen size, not a prediction about heat, fans, or a future model. Chip, memory, and storage options are on [Apple's MacBook Air tech specs](${SPECS_URL}).

| If you want... | Apple's listed match |
| --- | --- |
| The lighter of the two current Air sizes | 13-inch M5, 2.7 pounds (1.23 kg) |
| The larger display | 15-inch M5, 3.3 pounds (1.51 kg) and a 15.3-inch display |
| A number for an M3 or M4 Air | Not on the current specs page, so not stated here |

*Table: which current MacBook Air matches a lighter carry or a larger display, using only Apple's listed weight and display. Opened November 10, 2026.*

## FAQ

The answers below are the 13-inch weight, the 15-inch weight, the gap between them, whether M4 is on the current specs, the battery claim, and what Apple says about configuration.

${FAQ_MD}

## Compare further

Three live comparisons put the Air next to a MacBook Pro, the M5 Air next to the M5 Pro, and the Air next to the Dell XPS 13.

- [MacBook Air vs MacBook Pro](/compare/macbook-air-vs-macbook-pro)
- [MacBook Air M5 vs MacBook Pro M5](/compare/macbook-air-m5-vs-macbook-pro-m5)
- [Dell XPS 13 vs MacBook Air](/compare/dell-xps-13-vs-macbook-air)

## Sources

Every weight, size, display, port, battery-hour, and watt-hour figure above is from Apple's MacBook Air tech specs, opened November 10, 2026.

- [Apple: MacBook Air tech specs](${SPECS_URL})
`;

export const MACBOOK_AIR_WEIGHT_ARTICLE: BlogArticle = {
  id: "blog-macbook-air-weight-comparison-2025-2026",
  slug: MACBOOK_AIR_WEIGHT_BLOG_SLUG,
  title: "How Much Does a MacBook Air Weigh?",
  excerpt:
    "Apple lists the 13-inch M5 MacBook Air at 2.7 lb (1.23 kg) and the 15-inch at 3.3 lb (1.51 kg). Weight varies by configuration.",
  content: CONTENT,
  category: "technology",
  tags: ["MacBook Air", "MacBook Air weight", "M5", "laptop weight", "13-inch", "15-inch"],
  metaTitle: "How Much Does a MacBook Air Weigh?",
  metaDescription:
    "The 13-inch M5 MacBook Air is listed at 2.7 lb (1.23 kg) and the 15-inch at 3.3 lb (1.51 kg). Weight varies by configuration.",
  relatedComparisonSlugs: [
    "macbook-air-vs-macbook-pro",
    "macbook-air-m5-vs-macbook-pro-m5",
    "dell-xps-13-vs-macbook-air",
  ],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: UPDATED_AT,
  viewCount: 0,
};
