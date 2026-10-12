import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-120 — Galaxy Z Fold 7 vs Galaxy S26 Ultra.
 * Specs below were checked against sources on 2026-09-29.
 * GSMArena compare (idPhone1=13826 is the Z Fold 7, idPhone2=14320 is the S26 Ultra),
 * each phone's GSMArena spec page, and Geeky Gadgets (24 April 2026).
 * No single winner. Samsung Display says the Fold 7 panel passed a
 * Bureau Veritas 500,000-fold test (22 July 2025).
 */

const FOLD = "galaxy-z-fold-7";
const S26 = "samsung-galaxy-s26-ultra";

const GSMARENA_COMPARE =
  "https://www.gsmarena.com/compare.php3?idPhone1=13826&idPhone2=14320";
const GSMARENA_FOLD = "https://www.gsmarena.com/samsung_galaxy_z_fold7-13826.php";
const GSMARENA_S26 = "https://www.gsmarena.com/samsung_galaxy_s26_ultra_5g-14320.php";
const GEEKY = "https://www.geeky-gadgets.com/galaxy-s26-ultra-vs-z-fold-7/";
const SAMSUNG_DISPLAY =
  "https://www.samsungdisplay.com/eng/media/news/detail/ssdsNews-250722.jsp";
const SAMSUNG_WARRANTY = "https://www.samsung.com/us/support/warranty/";
const SAMSUNG_S26 = "https://www.samsung.com/us/smartphones/galaxy-s26-ultra/";
const ANDROID_AUTHORITY =
  "https://www.androidauthority.com/samsung-galaxy-z-fold-7-drops-s-pen-support-3575176/";

const SOURCE_DATE = "2026-09-29";
const PUBLISHED = "2026-09-29T00:00:00Z";

const SHORT_ANSWER =
  "The Galaxy S26 Ultra suits a 4-5 year keep. GSMArena lists IP68, a 5,000 mAh battery, 60W wired and 25W wireless charging, a 5x periscope, and a 7.9 mm slab. The Galaxy Z Fold 7 is the pick only if the 8.0-inch inner screen and multitasking are why you are buying, and you accept IP48, a 4,400 mAh battery, 25W wired charging, and the extra care a hinge needs. Both phones have a 200MP main camera and up to 7 major OS updates. GSMArena's active-use score is 11:44h on the Fold 7 and 16:23h on the S26 Ultra. Neither is better for everyone; it depends on whether you want a 4-5 year slab or the inner foldable screen.";

const FAQS = [
  {
    question: "Which phone is better if you want to keep it for 4-5 years?",
    answer:
      "The Galaxy S26 Ultra. GSMArena lists IP68, a 5,000 mAh battery, 60W wired charging, 25W wireless charging, and a 7.9 mm slab, and its active-use score is 16:23h. The Z Fold 7 is worth it only if the 8.0-inch inner screen is the reason you are buying, and you accept IP48, a 4,400 mAh battery, 25W wired charging, and the extra care a hinge needs. Both list up to 7 major OS updates.",
  },
  {
    question: "How durable is the Galaxy Z Fold 7 hinge?",
    answer:
      "GSMArena lists the Z Fold 7 ingress rating as IP48: dust larger than 1 mm, and immersion up to 1.5 m for 30 minutes. GSMArena lists the S26 Ultra as IP68, dust tight, with the same 1.5 m / 30 minute water line. Samsung says Galaxy Z Fold5 and newer models may have limited international warranty service during the standard 12-month period. Samsung Display says the Fold 7's foldable panel passed a 500,000-fold test verified by Bureau Veritas.",
  },
  {
    question: "Does the Galaxy Z Fold 7 have the better camera?",
    answer:
      "Not on the hardware GSMArena lists. Both phones have a 200MP main camera and a 10MP 3x telephoto. The Fold 7 ultrawide is 12MP. The S26 Ultra adds a 50MP 5x periscope and a 50MP ultrawide. Geeky Gadgets calls the S26 Ultra the photography pick and says the Fold 7 is fine for everyday shots. That is Geeky Gadgets' judgment, not a lab score.",
  },
  {
    question: "Which phone has the better battery?",
    answer:
      "The Galaxy S26 Ultra, on the figures GSMArena gives. GSMArena lists a 5,000 mAh battery, 60W wired charging, and 25W wireless charging, with an active-use score of 16:23h. The Z Fold 7 is a 4,400 mAh battery, 25W wired, 15W wireless, and an active-use score of 11:44h. Those hour scores are GSMArena's lab scores.",
  },
  {
    question: "How long is software support on the Fold 7 and the S26 Ultra?",
    answer:
      "GSMArena lists up to 7 major OS updates for both. GSMArena lists Android 16 and One UI 8 for the Fold 7. GSMArena lists Android 16, upgradable to Android 17, One UI 9, and the same cap of 7 major OS updates for the S26 Ultra. The S26 Ultra shipped later (released 6 March 2026, against 25 July 2025 for the Fold 7), so that seven-update window starts one generation later. GSMArena does not name the final Android version for either phone.",
  },
];

const VERDICT = `Best for a 4-5 year keep: Galaxy S26 Ultra. IP68, a 5,000 mAh battery, faster charging, a 5x periscope, and a simpler slab are the reasons.

Best for an inner foldable screen: Galaxy Z Fold 7. Buy it only if that 8.0-inch display and the multitasking it allows are why you want the phone, and you accept IP48, the smaller battery, and the extra care a hinge needs.

Neither is better for everyone; it depends on whether you want a 4-5 year slab or the inner foldable screen.`;

const EXPERT_ANALYSIS = `The Galaxy S26 Ultra suits a 4-5 year keep. The Galaxy Z Fold 7 is the pick only if the inner foldable screen and multitasking are why you are buying. Neither is better for everyone; it depends on whether you want a 4-5 year slab or the inner foldable screen.

Screens and body

GSMArena lists an 8.0-inch inner display on the Z Fold 7 and a 6.5-inch cover display. The S26 Ultra display is 6.9 inches. Both inner and slab panels are Dynamic LTPO AMOLED 2X, 120Hz, with 2,600 nits peak. The Fold 7 weighs 215 g. Unfolded it is 4.2 mm thick. Folded it is 8.9 mm thick. The S26 Ultra weighs 214 g and is 7.9 mm thick. One gram is not a meaningful weight gap. The shape is the gap: a foldable versus a slab.

Ingress and chip

GSMArena rates the Fold 7 IP48 (dust larger than 1 mm, immersion up to 1.5 m for 30 minutes) and the S26 Ultra IP68 (dust tight, same water line). GSMArena lists the Fold 7 chipset as Snapdragon 8 Elite. GSMArena lists the S26 Ultra chipset as Snapdragon 8 Elite Gen 5. GSMArena's benchmark scores are not repeated.

Cameras

Both phones have a 200MP main camera. The Fold 7's other rear cameras are a 10MP 3x telephoto and a 12MP ultrawide. The S26 Ultra also has a 10MP 3x telephoto, and adds a 50MP 5x periscope and a 50MP ultrawide. The Fold 7 does not have the longer telephoto or the higher-resolution ultrawide. Geeky Gadgets, summarizing a Nick Ackerman video on 24 April 2026, calls the S26 Ultra the camera pick and says the Fold 7 covers everyday photos. That is the article's view.

Battery and charging

GSMArena lists the Fold 7 at 4,400 mAh, with 25W wired charging and 15W wireless charging. It lists the S26 Ultra at 5,000 mAh, with 60W wired charging and 25W wireless charging (Qi2.2). GSMArena lists an active-use score of 11:44h for the Fold 7 and 16:23h for the S26 Ultra. Those scores are GSMArena's, not a Samsung marketing claim.

Software support

GSMArena lists up to 7 major OS updates for both. The Fold 7 launched on Android 16 with One UI 8 (released 25 July 2025). The S26 Ultra launched on Android 16 with One UI 9 and GSMArena lists it as upgradable to Android 17 (released 6 March 2026). The seven-update promise starts later on the S26 Ultra. GSMArena does not say that one phone receives updates faster than the other.

Who should buy which

Keep the S26 Ultra if you want one phone for 4-5 years and you care about ingress protection, battery, charging speed, and the longer telephoto. Geeky Gadgets makes the same split: the slab for durability, camera, and battery; the foldable for the large screen and multitasking. Samsung says the S26 Ultra has a built-in S Pen, and Samsung told Android Authority the Fold 7 does not support the S Pen because the digitizer was removed to make it thinner.

Buy the Z Fold 7 only if that inner 8.0-inch screen is the point. You are accepting IP48 instead of IP68, a smaller battery, slower charging, and a hinge. Samsung Display says the Fold 7's foldable panel passed a 500,000-fold test verified by Bureau Veritas. Samsung says Galaxy Z Fold5 and newer models may have limited international warranty service during the standard 12-month period. Check Samsung's warranty terms for the coverage that applies to your country and purchase date.`;

export const GALAXY_Z_FOLD_7_VS_S26_ULTRA: EditorialComparison = buildEditorialComparison({
  slug: "galaxy-z-fold-7-vs-samsung-galaxy-s26-ultra",
  title: "Galaxy Z Fold 7 vs Galaxy S26 Ultra: Which Should You Keep?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: FOLD,
      slug: FOLD,
      name: "Samsung Galaxy Z Fold 7",
      shortDesc:
        "2025 foldable with an 8.0-inch inner screen, a 6.5-inch cover, Snapdragon 8 Elite, IP48, and a 4,400 mAh battery.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "8.0-inch inner display plus a 6.5-inch cover (GSMArena)",
        "200MP main camera, the same class as the S26 Ultra",
        "Up to 7 major OS updates (GSMArena)",
        "The foldable screen is the reason to buy it, if multitasking on that panel is the point (Geeky Gadgets)",
      ],
      cons: [
        "IP48, against IP68 on the S26 Ultra (GSMArena)",
        "4,400 mAh, 25W wired, 15W wireless, against 5,000 mAh, 60W, and 25W",
        "GSMArena active-use score 11:44h, against 16:23h",
        "10MP 3x telephoto and 12MP ultrawide, with no 5x periscope",
        "A hinge needs extra care",
        "No S Pen support. Samsung removed the digitizer to make it thinner",
      ],
      bestFor: "Best for the inner foldable screen",
    },
    {
      id: S26,
      slug: S26,
      name: "Samsung Galaxy S26 Ultra",
      shortDesc:
        "2026 slab with a 6.9-inch display, Snapdragon 8 Elite Gen 5, IP68, a 5,000 mAh battery, and a 5x periscope.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "IP68, 5,000 mAh, 60W wired, and 25W wireless (GSMArena)",
        "Snapdragon 8 Elite Gen 5 (GSMArena)",
        "200MP main, 50MP 5x periscope, and 50MP ultrawide",
        "GSMArena active-use score 16:23h",
        "Built-in S Pen (Samsung)",
        "Up to 7 major OS updates, starting from a March 2026 release",
      ],
      cons: [
        "No inner foldable screen. The display is a 6.9-inch slab",
        "214 g and 7.9 mm, so it does not fold down to the Fold 7's cover width",
        "Geeky Gadgets treats it as the wrong phone if the large folding screen is the reason you are buying",
      ],
      bestFor: "Best for a 4-5 year keep",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Best if the inner foldable screen is the reason",
      entityBValue: "Best for a 4-5 year keep",
      winner: "tie",
    },
    {
      label: "Displays",
      entityAValue: "8.0-inch inner, 6.5-inch cover",
      entityBValue: "6.9-inch slab",
      winner: "tie",
    },
    {
      label: "Ingress rating",
      entityAValue: "IP48",
      entityBValue: "IP68",
      winner: "b",
    },
    {
      label: "Battery and charging",
      entityAValue: "4,400 mAh, 25W wired, 15W wireless",
      entityBValue: "5,000 mAh, 60W wired, 25W wireless",
      winner: "b",
    },
    {
      label: "Telephoto",
      entityAValue: "10MP 3x",
      entityBValue: "10MP 3x and 50MP 5x periscope",
      winner: "b",
    },
    {
      label: "OS updates",
      entityAValue: "Up to 7 major OS updates",
      entityBValue: "Up to 7 major OS updates, from a later launch",
      winner: "tie",
    },
    {
      label: "S Pen",
      entityAValue: "Not supported",
      entityBValue: "Built-in S Pen",
      winner: "b",
    },
  ],
  attributes: [
    textAttr(
      "displays",
      "Displays",
      "Specs · GSMArena",
      FOLD,
      S26,
      "8.0-inch inner, 6.5-inch cover, 120Hz, 2600 nits peak",
      "6.9-inch Dynamic LTPO AMOLED 2X, 120Hz, 2600 nits peak"
    ),
    textAttr(
      "body",
      "Weight and thickness",
      "Specs · GSMArena",
      FOLD,
      S26,
      "215 g, 4.2 mm unfolded, 8.9 mm folded",
      "214 g, 7.9 mm"
    ),
    textAttr(
      "ingress",
      "Ingress rating",
      "Specs · GSMArena",
      FOLD,
      S26,
      "IP48 (dust larger than 1 mm; 1.5 m for 30 min)",
      "IP68 (dust tight; 1.5 m for 30 min)",
      "b"
    ),
    textAttr(
      "chip",
      "Chip",
      "Specs · GSMArena",
      FOLD,
      S26,
      "Snapdragon 8 Elite",
      "Snapdragon 8 Elite Gen 5",
      "b"
    ),
    textAttr(
      "battery",
      "Battery and charging",
      "Specs · GSMArena",
      FOLD,
      S26,
      "4,400 mAh, 25W wired, 15W wireless",
      "5,000 mAh, 60W wired, 25W wireless (Qi2.2)",
      "b"
    ),
    textAttr(
      "active-use",
      "Active-use score",
      "Specs · GSMArena",
      FOLD,
      S26,
      "11:44h (GSMArena)",
      "16:23h (GSMArena)",
      "b"
    ),
    textAttr(
      "main-camera",
      "Main camera",
      "Specs · GSMArena",
      FOLD,
      S26,
      "200MP",
      "200MP"
    ),
    textAttr(
      "other-cameras",
      "Other rear cameras",
      "Specs · GSMArena",
      FOLD,
      S26,
      "10MP 3x telephoto, 12MP ultrawide",
      "10MP 3x telephoto, 50MP 5x periscope, 50MP ultrawide",
      "b"
    ),
    textAttr(
      "os-updates",
      "OS updates",
      "Specs · GSMArena",
      FOLD,
      S26,
      "Android 16, One UI 8, up to 7 major OS updates",
      "Android 16, upgradable to Android 17, One UI 9, up to 7 major OS updates"
    ),
    textAttr(
      "s-pen",
      "S Pen",
      "S Pen · Samsung, Android Authority, GSMArena",
      FOLD,
      S26,
      "Not supported",
      "Built-in S Pen",
      "b"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "iphone-17-vs-samsung-s26",
      title: "iPhone 17 vs Samsung Galaxy S26",
      category: "technology",
    },
    {
      slug: "samsung-galaxy-s24-ultra-vs-samsung-galaxy-s25-ultra",
      title: "Galaxy S24 Ultra vs Galaxy S25 Ultra",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Best for a 4-5 year keep: Galaxy S26 Ultra. Best for the inner foldable screen: Galaxy Z Fold 7.",
    keyFact:
      "GSMArena lists the Fold 7 at IP48, 4,400 mAh, and an 11:44h active-use score, and the S26 Ultra at IP68, 5,000 mAh, and a 16:23h active-use score. Both have a 200MP main camera and up to 7 major OS updates.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 10,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "GSMArena — Z Fold 7 vs S26 Ultra", url: GSMARENA_COMPARE },
      { name: "GSMArena — Galaxy Z Fold 7", url: GSMARENA_FOLD },
      { name: "GSMArena — Galaxy S26 Ultra", url: GSMARENA_S26 },
      { name: "Geeky Gadgets — S26 Ultra vs Z Fold 7 (24 Apr 2026)", url: GEEKY },
      {
        name: "Samsung Display — Fold 7 panel 500,000-fold test, verified by Bureau Veritas (22 Jul 2025)",
        url: SAMSUNG_DISPLAY,
      },
      { name: "Samsung US — warranty", url: SAMSUNG_WARRANTY },
      { name: "Samsung US — Galaxy S26 Ultra", url: SAMSUNG_S26 },
      {
        name: "Android Authority — Fold 7 drops S Pen support (9 Jul 2025)",
        url: ANDROID_AUTHORITY,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "GSMArena spec compare",
      url: GSMARENA_COMPARE,
      description:
        "Displays, weight, thickness, IP rating, chip, cameras, battery, charging, OS updates, and active-use scores.",
    },
    {
      type: "external",
      label: "GSMArena Galaxy Z Fold 7",
      url: GSMARENA_FOLD,
      description:
        "8.0-inch inner, 6.5-inch cover, 215 g, 4.2 mm / 8.9 mm, IP48, Snapdragon 8 Elite, 4,400 mAh, active-use 11:44h.",
    },
    {
      type: "external",
      label: "GSMArena Galaxy S26 Ultra",
      url: GSMARENA_S26,
      description:
        "6.9-inch, 214 g, 7.9 mm, IP68, Snapdragon 8 Elite Gen 5, 5,000 mAh, 60W / 25W, active-use 16:23h. Body line lists Stylus separately from Armor Aluminum 2.",
    },
    {
      type: "external",
      label: "Geeky Gadgets comparison",
      url: GEEKY,
      description:
        "24 April 2026. Qualitative split: slab for durability, camera, and battery; foldable for the large screen.",
    },
    {
      type: "external",
      label: "Samsung Display fold test",
      url: SAMSUNG_DISPLAY,
      description:
        "Samsung Display says the foldable OLED panel in the Galaxy Z Fold7 stayed fully functional after a 500,000-fold test verified by Bureau Veritas.",
    },
    {
      type: "external",
      label: "Samsung US warranty",
      url: SAMSUNG_WARRANTY,
      description:
        "Standard 12-month wording. Samsung says Galaxy Z Fold5 and newer models may have limited international warranty service.",
    },
    {
      type: "external",
      label: "Samsung Galaxy S26 Ultra",
      url: SAMSUNG_S26,
      description:
        "Samsung's FAQ: Yes, Galaxy S26 Ultra has a built-in S Pen.",
    },
    {
      type: "external",
      label: "Android Authority on Fold 7 S Pen support",
      url: ANDROID_AUTHORITY,
      description:
        "Published 9 July 2025. Samsung confirmed to Android Authority that the Fold 7 does not support the S Pen, because the digitizer was removed to make it thinner.",
    },
  ],
  metaTitle: "Fold 7 vs S26 Ultra: Which to Keep? | A Versus B",
});
