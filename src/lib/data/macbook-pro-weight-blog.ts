/**
 * ROO-269: repo override for
 * /blog/macbook-pro-weight-2025-2026-complete-specs-comparison-guide.
 * Weights and dimensions read in October 2026 from Apple's MacBook Pro and
 * MacBook Air tech specs pages; launch prices from Apple Newsroom
 * (October 2025 and March 2026).
 * Corrected: 14-inch M5 Max is 1.62 kg (was 1.63), 16-inch is 2.14 kg (M5 Pro)
 * and 2.15 kg (M5 Max) (was 2.13), MacBook Air 13-inch is 1.23 kg (was 1.22
 * and 1.24) and 15-inch 1.51 kg (was 1.50); 14-inch depth and width corrected.
 * Removed because no official source supports them: CPU/GPU core counts per
 * configuration, "real-world" carry tests, accessory weights, and forecasts.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const MACBOOK_PRO_WEIGHT_BLOG_SLUG = "macbook-pro-weight-2025-2026-complete-specs-comparison-guide";

const PUBLISHED_AT = "2026-05-01T06:53:19.352Z";
const UPDATED_AT = "2026-10-19T00:00:00Z";

const PRO_BUY_URL = "https://www.apple.com/shop/buy-mac/macbook-pro";
const AIR_BUY_URL = "https://www.apple.com/shop/buy-mac/macbook-air";

const CONTENT = `**Updated Oct 2026.** The current 14-inch MacBook Pro weighs 3.4 pounds (1.55 kg) with M5, 3.5 pounds (1.60 kg) with M5 Pro and 3.6 pounds (1.62 kg) with M5 Max. The 16-inch MacBook Pro weighs 4.7 pounds: 2.14 kg with M5 Pro and 2.15 kg with M5 Max. Apple notes that weight varies by configuration and manufacturing process.

| Model | Weight | Height × width × depth |
| --- | --- | --- |
| MacBook Pro 14-inch (M5) | 3.4 lb (1.55 kg) | 0.61 × 12.31 × 8.71 in (1.55 × 31.26 × 22.12 cm) |
| MacBook Pro 14-inch (M5 Pro) | 3.5 lb (1.60 kg) | 0.61 × 12.31 × 8.71 in |
| MacBook Pro 14-inch (M5 Max) | 3.6 lb (1.62 kg) | 0.61 × 12.31 × 8.71 in |
| MacBook Pro 16-inch (M5 Pro) | 4.7 lb (2.14 kg) | 0.66 × 14.01 × 9.77 in (1.68 × 35.57 × 24.81 cm) |
| MacBook Pro 16-inch (M5 Max) | 4.7 lb (2.15 kg) | 0.66 × 14.01 × 9.77 in |
| MacBook Air 13-inch (M5) | 2.7 lb (1.23 kg) | 0.44 × 11.97 × 8.46 in (1.13 × 30.41 × 21.5 cm) |
| MacBook Air 15-inch (M5) | 3.3 lb (1.51 kg) | 0.45 × 13.40 × 9.35 in (1.15 × 34.04 × 23.76 cm) |

*Table: current MacBook Pro and MacBook Air weight and dimensions by size and chip, October 2026.*

Torn between sizes? [Compare the 14-inch vs 16-inch MacBook Pro](/compare/macbook-pro-14-vs-macbook-pro-16) side by side.

## How much does the 14-inch MacBook Pro weigh?

Between 3.4 and 3.6 pounds (1.55 to 1.62 kg), depending on the chip. The M5 model is the lightest; M5 Pro adds about 0.1 pound and M5 Max about 0.2 pound. All three share the same case: 0.61 inch thick, 12.31 inches wide and 8.71 inches deep.

## How much does the 16-inch MacBook Pro weigh?

4.7 pounds with either chip: 2.14 kg with M5 Pro and 2.15 kg with M5 Max. The case is 0.66 inch thick, 14.01 inches wide and 9.77 inches deep. There is no 16-inch model with the base M5 chip.

## MacBook Pro vs MacBook Air: how much weight do you save?

The 13-inch MacBook Air with M5 weighs 2.7 pounds (1.23 kg), 0.7 pound less than the lightest 14-inch MacBook Pro. The 15-inch Air weighs 3.3 pounds (1.51 kg), still lighter than any 14-inch Pro. For a full side-by-side, see [MacBook Air vs MacBook Pro](/compare/macbook-air-vs-macbook-pro).

## What do the current models cost?

| Model | Launch price (MSRP) |
| --- | --- |
| MacBook Pro 14-inch (M5) | $1,599, per Apple Newsroom, October 2025; $1,699 with 1TB standard storage from March 2026, per Apple Newsroom |
| MacBook Pro 14-inch (M5 Pro) | $2,199, per Apple Newsroom, March 2026 |
| MacBook Pro 16-inch (M5 Pro) | $2,699, per Apple Newsroom, March 2026 |
| MacBook Pro 14-inch (M5 Max) | $3,599, per Apple Newsroom, March 2026 |
| MacBook Pro 16-inch (M5 Max) | $3,899, per Apple Newsroom, March 2026 |
| MacBook Air 13-inch (M5) | $1,099, per Apple Newsroom, March 2026 |
| MacBook Air 15-inch (M5) | $1,299, per Apple Newsroom, March 2026 |

US starting prices. [See vendor page for current price](${PRO_BUY_URL}) (MacBook Pro) or [MacBook Air](${AIR_BUY_URL}).

## Which size should you carry?

| If you... | Choose |
| --- | --- |
| Carry your laptop every day and want Pro chips | 14-inch MacBook Pro (3.4 to 3.6 lb) |
| Work mostly at a desk and want the bigger screen | 16-inch MacBook Pro (4.7 lb) |
| Want the lightest Mac laptop | 13-inch MacBook Air (2.7 lb) |
| Want a big screen at low weight | 15-inch MacBook Air (3.3 lb) |

## FAQ

### How much does the MacBook Pro 14-inch weigh?

The 14-inch MacBook Pro weighs 3.4 pounds (1.55 kg) with M5, 3.5 pounds (1.60 kg) with M5 Pro and 3.6 pounds (1.62 kg) with M5 Max.

### How much does the MacBook Pro 16-inch weigh?

The 16-inch MacBook Pro weighs 4.7 pounds: 2.14 kg with M5 Pro and 2.15 kg with M5 Max.

### What is the lightest MacBook Pro?

The 14-inch MacBook Pro with M5, at 3.4 pounds (1.55 kg). The 13-inch MacBook Air with M5 is lighter still at 2.7 pounds (1.23 kg).

### Do the M5 Pro and M5 Max versions weigh the same?

Nearly. On the 14-inch model, M5 Max weighs 1.62 kg against 1.60 kg for M5 Pro. On the 16-inch model, both are listed at 4.7 pounds (2.14 kg and 2.15 kg).

### How thick is the MacBook Pro?

The 14-inch MacBook Pro is 0.61 inch (1.55 cm) thick and the 16-inch is 0.66 inch (1.68 cm).

## Compare further

- [MacBook Pro 14-inch vs 16-inch](/compare/macbook-pro-14-vs-macbook-pro-16)
- [MacBook Air vs MacBook Pro](/compare/macbook-air-vs-macbook-pro)

## Sources

- [Apple: MacBook Pro tech specs](https://www.apple.com/macbook-pro/specs/)
- [Apple: MacBook Air tech specs](https://www.apple.com/macbook-air/specs/)
- [Apple Newsroom: Apple unveils new 14-inch MacBook Pro powered by the M5 chip (October 2025)](https://www.apple.com/newsroom/2025/10/apple-unveils-new-14-inch-macbook-pro-powered-by-the-m5-chip/)
- [Apple Newsroom: Apple introduces MacBook Pro with all-new M5 Pro and M5 Max (March 2026)](https://www.apple.com/newsroom/2026/03/apple-introduces-macbook-pro-with-all-new-m5-pro-and-m5-max/)
- [Apple Newsroom: Apple introduces the new MacBook Air with M5 (March 2026)](https://www.apple.com/newsroom/2026/03/apple-introduces-the-new-macbook-air-with-m5/)
`;

export const MACBOOK_PRO_WEIGHT_FAQS = [
  {
    question: "How much does the MacBook Pro 14-inch weigh?",
    answer:
      "The 14-inch MacBook Pro weighs 3.4 pounds (1.55 kg) with M5, 3.5 pounds (1.60 kg) with M5 Pro and 3.6 pounds (1.62 kg) with M5 Max.",
  },
  {
    question: "How much does the MacBook Pro 16-inch weigh?",
    answer: "The 16-inch MacBook Pro weighs 4.7 pounds: 2.14 kg with M5 Pro and 2.15 kg with M5 Max.",
  },
  {
    question: "What is the lightest MacBook Pro?",
    answer:
      "The 14-inch MacBook Pro with M5, at 3.4 pounds (1.55 kg). The 13-inch MacBook Air with M5 is lighter still at 2.7 pounds (1.23 kg).",
  },
  {
    question: "Do the M5 Pro and M5 Max versions weigh the same?",
    answer:
      "Nearly. On the 14-inch model, M5 Max weighs 1.62 kg against 1.60 kg for M5 Pro. On the 16-inch model, both are listed at 4.7 pounds (2.14 kg and 2.15 kg).",
  },
  {
    question: "How thick is the MacBook Pro?",
    answer: "The 14-inch MacBook Pro is 0.61 inch (1.55 cm) thick and the 16-inch is 0.66 inch (1.68 cm).",
  },
];

export const MACBOOK_PRO_WEIGHT_ARTICLE: BlogArticle = {
  id: "blog-macbook-pro-weight-2025-2026",
  slug: MACBOOK_PRO_WEIGHT_BLOG_SLUG,
  title: "MacBook Pro Weight 2025-2026: Complete Specs & Comparison Guide",
  excerpt:
    "The 14-inch MacBook Pro weighs 3.4 to 3.6 lb (1.55 to 1.62 kg) and the 16-inch 4.7 lb (2.14 to 2.15 kg). The 13-inch MacBook Air is 2.7 lb.",
  content: CONTENT,
  category: "technology",
  tags: ["MacBook Pro", "MacBook Pro weight", "MacBook Air", "laptop weight", "apple", "M5"],
  metaTitle: "MacBook Pro Weight 2026: 14-inch vs 16-inch (M5, M5 Pro, M5 Max)",
  metaDescription:
    "MacBook Pro weight by size and chip: 14-inch 3.4 to 3.6 lb (1.55 to 1.62 kg), 16-inch 4.7 lb (2.14 to 2.15 kg), plus MacBook Air and dimensions.",
  relatedComparisonSlugs: ["macbook-pro-14-vs-macbook-pro-16", "macbook-air-vs-macbook-pro"],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: UPDATED_AT,
  viewCount: 0,
};
