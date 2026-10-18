import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-210: Google Pixel 9a vs Pixel 9.
 * Google Pixel tech specs (Pixel Help), Google Store Pixel 9a specs, and the
 * Google Keyword launch posts for Pixel 9 (13 August 2024) and Pixel 9a
 * (19 March 2025). Facts read 18 October 2026 from official sources only.
 * No benchmarks; launch prices from Google's own announcements. No winner.
 */

const PUBLISHED = "2026-10-18T00:00:00Z";
const SOURCE_DATE = "2026-10-18";

const PIXEL_SPECS = "https://support.google.com/pixelphone/answer/7158570?hl=en";
const STORE_9A = "https://store.google.com/us/product/pixel_9a_specs?hl=en-US";
const BLOG_9 = "https://blog.google/products-and-platforms/devices/pixel/google-pixel-9-pro-xl/";
const BLOG_9A = "https://blog.google/products-and-platforms/devices/pixel/google-pixel-9a/";

const SHORT_ANSWER =
  "Choose the Pixel 9a if you want the same Google Tensor G4 chip, a larger typical 5,100 mAh battery and seven years of updates at a $499 launch price. Choose the Pixel 9 ($799 at launch) for 12GB of RAM instead of 8GB, a 50MP main camera with a 48MP autofocus ultrawide, a 10.5MP autofocus selfie camera, Gorilla Glass Victus 2 on both sides, faster charging (up to 27W wired, 15W on Pixel Stand) and Wi-Fi 7. Both have a 6.3-inch 60-120Hz display and IP68. Neither is better for everyone.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Same chip: Google Tensor G4 with the Titan M2 security coprocessor in both.
- Battery: typical 5,100 mAh in the Pixel 9a against 4,700 mAh in the Pixel 9.
- Memory: 8GB of RAM in the 9a, 12GB in the 9; both come in 128GB or 256GB.
- Cameras: 48MP main and 13MP ultrawide on the 9a; 50MP main and 48MP ultrawide with autofocus and Macro Focus on the 9.
- Updates: seven years of OS, security and Pixel Drop updates for both, counted from first availability on the U.S. Google Store.

Display

Both have a 6.3-inch 1080 x 2424 Actua display at about 422 ppi, Smooth Display from 60 to 120Hz, up to 1,800 nits in HDR and up to 2,700 nits peak. The Pixel 9a uses a pOLED panel under Gorilla Glass 3; the Pixel 9 uses an OLED panel under Gorilla Glass Victus 2.

Design and durability

The Pixel 9a measures 154.7 x 73.3 x 8.9 mm and weighs 185.9 g, with a composite matte back and a satin metal frame. The Pixel 9 measures 152.8 x 72.0 x 8.5 mm and weighs 198 g, with a Gorilla Glass Victus 2 polished back and a satin-finish metal frame. Both are rated IP68 for dust and water.

Chip and memory

Both run the Google Tensor G4. The Pixel 9a has 8GB of RAM and the Pixel 9 has 12GB; each is sold with 128GB or 256GB of storage.

Cameras

1. Pixel 9a: 48MP Quad PD wide camera with OIS, 13MP ultrawide, 13MP selfie camera, Super Res Zoom up to 8x.
2. Pixel 9: 50MP Octa PD wide camera, 48MP Quad PD ultrawide with autofocus and Macro Focus, 10.5MP Dual PD selfie camera with autofocus, Super Res Zoom up to 8x.

Neither has a telephoto camera.

Battery and charging

The Pixel 9a has a typical 5,100 mAh battery (minimum 5,000 mAh), charges at up to 23W wired and up to 7.5W wirelessly with Qi-certified EPP chargers. The Pixel 9 has a typical 4,700 mAh battery (minimum 4,558 mAh), charges at up to 27W wired with the Google 45W USB-C Charger, and up to 15W wirelessly on Pixel Stand (2nd gen) or 12W on Qi-certified EPP chargers. Google rates the 9a at 30+ hours and the 9 at 24+ hours of battery life.

Software and updates

The Pixel 9 launched with Android 14 and the Pixel 9a with Android 15. Google promises seven years of OS, security and Pixel Drop updates for each from the date it first went on sale on the U.S. Google Store, so the Pixel 9a's window runs about eight months later.

Connectivity

The Pixel 9 supports Wi-Fi 7; the Pixel 9a supports Wi-Fi 6E. Both have Bluetooth 5.3 and a USB-C 3.2 port.

Price at launch

Google announced the Pixel 9 from $799 on 13 August 2024 and the Pixel 9a from $499 on 19 March 2025, on sale from 10 April 2025 in the U.S., Canada and the U.K.

Choose the Pixel 9a if

1. You want the bigger battery and the longer update window.
2. 8GB of RAM is enough for how you use your phone.
3. You want Tensor G4 features at the lower launch price.

Choose the Pixel 9 if

1. You want 12GB of RAM.
2. You shoot close-ups or group selfies and want the autofocus ultrawide and autofocus selfie cameras.
3. You use fast wireless charging or Wi-Fi 7.`;

const FAQS = [
  {
    question: "Do the Pixel 9a and Pixel 9 have the same chip?",
    answer: "Yes. Both use the Google Tensor G4 with the Titan M2 security coprocessor.",
  },
  {
    question: "Which has the bigger battery, Pixel 9a or Pixel 9?",
    answer:
      "The Pixel 9a, with a typical 5,100 mAh battery against 4,700 mAh in the Pixel 9. Google rates the 9a at 30+ hours and the 9 at 24+ hours.",
  },
  {
    question: "How much RAM do the Pixel 9a and Pixel 9 have?",
    answer: "The Pixel 9a has 8GB and the Pixel 9 has 12GB.",
  },
  {
    question: "Does either phone have a telephoto camera?",
    answer:
      "No. Both have a wide and an ultrawide camera with Super Res Zoom up to 8x. The Pixel 9 uses a 50MP main and 48MP autofocus ultrawide; the 9a uses 48MP and 13MP.",
  },
  {
    question: "How many years of updates do the Pixel 9a and Pixel 9 get?",
    answer:
      "Seven years of OS, security and Pixel Drop updates each, counted from first availability on the U.S. Google Store: August 2024 for the Pixel 9 and April 2025 for the Pixel 9a.",
  },
  {
    question: "Are the Pixel 9a and Pixel 9 waterproof?",
    answer: "Both are rated IP68 for dust and water resistance.",
  },
  {
    question: "How much did the Pixel 9a and Pixel 9 cost at launch?",
    answer: "Google announced the Pixel 9 from $799 and the Pixel 9a from $499.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "pixel-9a-vs-pixel-9",
  title: "Pixel 9a vs Pixel 9: Battery, Cameras and Updates",
  shortAnswer: SHORT_ANSWER,
  verdict:
    "Pixel 9a: Tensor G4, typical 5,100 mAh battery, 8GB RAM, $499 at launch.\n\nPixel 9: Tensor G4, 12GB RAM, 50MP main and 48MP autofocus ultrawide, 27W wired and 15W wireless charging, $799 at launch.",
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: "google-pixel-9a",
      slug: "google-pixel-9a",
      name: "Google Pixel 9a",
      shortDesc: "Tensor G4, 6.3-inch 60-120Hz display, typical 5,100 mAh battery, IP68.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Typical 5,100 mAh battery, rated 30+ hours",
        "Same Tensor G4 chip as the Pixel 9",
        "$499 launch price",
        "Update window runs to about eight months later than the Pixel 9's",
      ],
      cons: ["8GB of RAM", "Up to 7.5W wireless charging", "Gorilla Glass 3"],
      bestFor: "Buyers who want Pixel software and battery life for less",
    },
    {
      id: "google-pixel-9",
      slug: "google-pixel-9",
      name: "Google Pixel 9",
      shortDesc: "Tensor G4, 12GB RAM, 50MP main and 48MP autofocus ultrawide, IP68.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "12GB of RAM",
        "48MP ultrawide with autofocus and Macro Focus",
        "Up to 27W wired and 15W wireless charging",
        "Wi-Fi 7",
      ],
      cons: ["Smaller typical 4,700 mAh battery", "$799 launch price", "Heavier at 198 g"],
      bestFor: "Buyers who want more RAM, the better ultrawide and selfie cameras, and faster charging",
    },
  ],
  keyDifferences: [
    { label: "Battery (typical)", entityAValue: "5,100 mAh", entityBValue: "4,700 mAh", winner: "tie" },
    { label: "RAM", entityAValue: "8GB", entityBValue: "12GB", winner: "tie" },
    { label: "Rear cameras", entityAValue: "48MP wide, 13MP ultrawide", entityBValue: "50MP wide, 48MP autofocus ultrawide", winner: "tie" },
    { label: "Charging", entityAValue: "23W wired, 7.5W wireless", entityBValue: "27W wired, 15W wireless", winner: "tie" },
    { label: "Launch price", entityAValue: "$499", entityBValue: "$799", winner: "tie" },
  ],
  attributes: [
    textAttr("a0", "Display", "Display", "google-pixel-9a", "google-pixel-9", "6.3-inch pOLED, 1080 x 2424, 60-120Hz, 2,700 nits peak", "6.3-inch OLED, 1080 x 2424, 60-120Hz, 2,700 nits peak"),
    textAttr("a1", "Cover glass", "Design", "google-pixel-9a", "google-pixel-9", "Gorilla Glass 3; composite matte back", "Gorilla Glass Victus 2 front and back"),
    textAttr("a2", "Size and weight", "Design", "google-pixel-9a", "google-pixel-9", "154.7 x 73.3 x 8.9 mm, 185.9 g", "152.8 x 72.0 x 8.5 mm, 198 g"),
    textAttr("a3", "Water and dust", "Design", "google-pixel-9a", "google-pixel-9", "IP68", "IP68"),
    textAttr("a4", "Chip", "Performance", "google-pixel-9a", "google-pixel-9", "Google Tensor G4, Titan M2", "Google Tensor G4, Titan M2"),
    textAttr("a5", "Memory and storage", "Performance", "google-pixel-9a", "google-pixel-9", "8GB RAM; 128GB or 256GB", "12GB RAM; 128GB or 256GB"),
    textAttr("a6", "Battery", "Battery", "google-pixel-9a", "google-pixel-9", "Typical 5,100 mAh (minimum 5,000)", "Typical 4,700 mAh (minimum 4,558)"),
    textAttr("a7", "Charging", "Battery", "google-pixel-9a", "google-pixel-9", "Up to 23W wired; up to 7.5W Qi wireless", "Up to 27W wired; up to 15W on Pixel Stand (2nd gen)"),
    textAttr("a8", "Main camera", "Camera", "google-pixel-9a", "google-pixel-9", "48MP Quad PD, OIS", "50MP Octa PD"),
    textAttr("a9", "Ultrawide", "Camera", "google-pixel-9a", "google-pixel-9", "13MP", "48MP with autofocus and Macro Focus"),
    textAttr("a10", "Selfie camera", "Camera", "google-pixel-9a", "google-pixel-9", "13MP", "10.5MP with autofocus"),
    textAttr("a11", "Wi-Fi", "Connectivity", "google-pixel-9a", "google-pixel-9", "Wi-Fi 6E", "Wi-Fi 7"),
    textAttr("a12", "Updates", "Software", "google-pixel-9a", "google-pixel-9", "7 years; launched with Android 15", "7 years; launched with Android 14"),
    textAttr("a13", "Launch price (US)", "Price", "google-pixel-9a", "google-pixel-9", "From $499 (19 March 2025)", "From $799 (13 August 2024)"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "galaxy-s25-vs-galaxy-s25-ultra",
      title: "Galaxy S25 vs Galaxy S25 Ultra: Camera and Long-Term Use",
      category: "technology",
    },
    {
      slug: "iphone-16e-vs-iphone-17e",
      title: "iPhone 16e vs iPhone 17e: 512GB or 256GB?",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Pixel 9a for the bigger battery and lower launch price with the same Tensor G4. Pixel 9 for 12GB of RAM, the stronger ultrawide and selfie cameras, and faster charging.",
    keyFact:
      "Both use Tensor G4 and get seven years of updates; the Pixel 9a launched at $499 with a 5,100 mAh battery, the Pixel 9 at $799 with 4,700 mAh.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 30,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Google Pixel Help: Pixel tech specs", url: PIXEL_SPECS },
      { name: "Google Store: Pixel 9a tech specs", url: STORE_9A },
      { name: "Google: Pixel 9, Pixel 9 Pro and Pixel 9 Pro XL", url: BLOG_9 },
      { name: "Google: Pixel 9a", url: BLOG_9A },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Google Pixel Help: Pixel tech specs",
      url: PIXEL_SPECS,
      description:
        "Pixel 9: 6.3-inch OLED 1080 x 2424, 60-120Hz, Gorilla Glass Victus 2, 152.8 x 72.0 x 8.5 mm, 198 g, typical 4,700 mAh, up to 27W wired and 15W on Pixel Stand (2nd gen), 12GB RAM, 50MP wide, 48MP ultrawide, 10.5MP selfie, Wi-Fi 7, Android 14 at launch. Pixel 9a: 154.7 x 73.3 x 8.9 mm, 185.9 g, typical 5,100 mAh, up to 23W wired and 7.5W wireless, 8GB RAM, 48MP wide, 13MP ultrawide, 13MP selfie, Wi-Fi 6E, Android 15 at launch. Both Tensor G4, IP68, 7 years of updates.",
    },
    {
      type: "external",
      label: "Google Store: Pixel 9a tech specs",
      url: STORE_9A,
      description:
        "6.3-inch Actua pOLED, 1080 x 2424 at 422.2 PPI, Gorilla Glass 3, up to 2,700 nits peak. Typical 5,100 mAh, Qi wireless charging. 128GB or 256GB with 8GB RAM. Tensor G4. IP68. 7 years of OS, security and Pixel Drop updates.",
    },
    {
      type: "external",
      label: "Google: Pixel 9, Pixel 9 Pro and Pixel 9 Pro XL",
      url: BLOG_9,
      description: "13 August 2024. Pixel 9, Pixel 9 Pro and Pixel 9 Pro XL from $799, $999 and $1,099.",
    },
    {
      type: "external",
      label: "Google: Pixel 9a",
      url: BLOG_9A,
      description:
        "19 March 2025. Pixel 9a from $499 with Tensor G4, on sale from 10 April in the U.S., Canada and the U.K.",
    },
  ],
  metaTitle: "Pixel 9a vs Pixel 9 | A Versus B",
});

BUILT.metadata.metaDescription =
  "Pixel 9a vs Pixel 9 from Google's specs: same Tensor G4, 5,100 vs 4,700 mAh battery, 8GB vs 12GB RAM, cameras, charging, updates and launch prices.";

export const PIXEL_9A_VS_PIXEL_9: EditorialComparison = BUILT;
