import { buildEditorialComparison, textAttrN } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-200 — OnePlus 15 vs Galaxy S26 Ultra vs Galaxy S25 Ultra for battery
 * and a 4–5 year keep. Checked on 12 October 2026 against OnePlus US, the
 * OnePlus PSTI page (OnePlus 15 security updates to 2031/11/13), Samsung US
 * support ANS10010342, the Samsung US S25 Ultra page, and Samsung's SMR/OS
 * policy PDF. No winner, no benchmarks, no street prices. Not stated because
 * no official source was found: OnePlus 15 OS-upgrade count, S26 Ultra chip,
 * S25 Ultra wired wattage, S26 Ultra video-playback hours.
 */

const OP15 = "oneplus-15";
const S26 = "samsung-galaxy-s26-ultra";
const S25 = "samsung-galaxy-s25-ultra";

const ONEPLUS = "https://www.oneplus.com/us/15";
const ONEPLUS_PSTI = "https://www.oneplus.com/uk/psti";
const SAMSUNG_S26 = "https://www.samsung.com/us/support/answer/ANS10010342/";
const SAMSUNG_S25 = "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/";
const SAMSUNG_POLICY =
  "https://images.samsung.com/is/content/samsung/assets/at/business/enterprise-edition/7-2026/SMR_OS_Policy.pdf";

const SOURCE_DATE = "2026-10-12";
const PUBLISHED = "2026-10-12T00:00:00Z";

const cell = (entityId: string, text: string, winner?: boolean) => ({ entityId, text, winner });

const SHORT_ANSWER =
  "If battery life comes first, the OnePlus 15 has the biggest battery of the three: OnePlus lists 7,300mAh with 80W SUPERVOOC wired and 50W AIRVOOC wireless charging, against 5,000mAh on both Galaxy Ultras. If you want the longest update window, the S Pen, or to stay on One UI, pick a Galaxy Ultra. Samsung lists seven OS upgrades for both, with security updates to February 2033 on the S26 Ultra and January 2032 on the S25 Ultra. OnePlus lists security updates for the OnePlus 15 to November 13, 2031. Neither is better for everyone; it depends on whether battery or software and the S Pen matter more.";

const FAQS = [
  {
    question: "Which has the best battery: OnePlus 15, Galaxy S26 Ultra, or Galaxy S25 Ultra?",
    answer:
      "On capacity, the OnePlus 15. OnePlus lists a 7,300mAh battery and up to 31 hours of video playback. Samsung lists 5,000mAh for both the Galaxy S26 Ultra and the Galaxy S25 Ultra, and up to 31 hours of video playback on the S25 Ultra. OnePlus also says the battery keeps 80 percent capacity after 4 years. That is OnePlus's own claim.",
  },
  {
    question: "How long will the OnePlus 15 get software updates?",
    answer:
      "OnePlus lists security updates for the OnePlus 15 until November 13, 2031. That is about six years from launch, not two or three. OnePlus's general policy promises a minimum of three years of security updates for phones, and the OnePlus 15 date runs well past that.",
  },
  {
    question: "How long will the Galaxy S26 Ultra and S25 Ultra get updates?",
    answer:
      "Samsung lists seven major OS upgrades for both. The S26 Ultra launched on Android 16 and is listed up to Android 23, with security updates until February 2033. The S25 Ultra launched on Android 15 and is listed up to Android 22, with security updates until January 2032.",
  },
  {
    question: "Which charges fastest?",
    answer:
      "The OnePlus 15. OnePlus lists 80W SUPERVOOC wired charging, up to 100W with its 100W adapter, and 50W AIRVOOC wireless charging. Samsung lists up to 60W wired and up to 25W wireless for the Galaxy S26 Ultra.",
  },
  {
    question: "Does the OnePlus 15 have a stylus like the S Pen?",
    answer:
      "No. The S Pen is built into the Galaxy S26 Ultra and the Galaxy S25 Ultra. If you will not use it, it should not decide the purchase.",
  },
  {
    question: "Is the S26 Ultra worth it over the S25 Ultra?",
    answer:
      "Both have a 5,000mAh battery, a 6.9-inch screen, a 200MP main camera, and the S Pen. The S26 Ultra adds about a year of extra security support, to February 2033 against January 2032, and Samsung lists up to 60W wired charging for it. If the S25 Ultra is clearly cheaper and January 2032 covers your keep, it is the better value.",
  },
];

const VERDICT = `Best for battery and charging speed: OnePlus 15. 7,300mAh, 80W wired and 50W wireless, security updates to November 2031.

Best for the longest update window and the S Pen: Galaxy S26 Ultra. Seven OS upgrades and security updates to February 2033, 60W wired.

Best for Samsung software and the S Pen at an older-model price: Galaxy S25 Ultra. Seven OS upgrades and security updates to January 2032.

Neither is better for everyone; it depends on whether battery or software and the S Pen matter more.`;

const EXPERT_ANALYSIS = `If you charge twice a day now, the OnePlus 15 has the most battery on paper. If you want the longest update window, the S Pen, or One UI with Galaxy Buds, pick a Galaxy Ultra. Neither is better for everyone; it depends on whether battery or software and the S Pen matter more.

Battery and charging

OnePlus lists a 7,300mAh battery for the OnePlus 15 and up to 31 hours of video playback. It charges at 80W SUPERVOOC wired, up to 100W with OnePlus's 100W adapter, and 50W AIRVOOC wireless. OnePlus also says the battery keeps 80 percent of its capacity after 4 years. Treat that as OnePlus's claim.

Samsung lists 5,000mAh for both Galaxy Ultras. The S26 Ultra has Super Fast Charging 3.0 up to 60W wired and up to 25W wireless. Samsung lists up to 31 hours of video playback for the S25 Ultra. On capacity and charging speed, the OnePlus 15 leads.

Software support for a 4 to 5 year keep

Samsung's update policy lists seven major OS upgrades for both Ultras. The Galaxy S26 Ultra launched in February 2026 on Android 16 and is listed up to Android 23, with security updates until February 2033. The Galaxy S25 Ultra launched in January 2025 on Android 15 and is listed up to Android 22, with security updates until January 2032.

OnePlus lists security updates for the OnePlus 15 until November 13, 2031. It launched on OxygenOS 16, based on Android 16. That date is well past a 4 to 5 year keep, so any of the three covers it. OnePlus has not published a number of major OS upgrades for the OnePlus 15.

Display

The OnePlus 15 has a 6.78-inch LTPO 1.5K display with refresh up to 165Hz. Both Galaxy Ultras have a 6.9-inch screen, and the S26 Ultra is QHD+. If 120Hz is smooth enough for you, the display should not decide it.

Chip

OnePlus lists the Snapdragon 8 Elite Gen 5 for the OnePlus 15. Samsung lists the Snapdragon 8 Elite for Galaxy for the S25 Ultra. Chip names alone are not a speed ranking.

Cameras

The OnePlus 15 has three 50MP rear cameras: a main camera, an ultra wide with a 112-degree field of view, and a periscope telephoto with 3.5x optical zoom. The Galaxy S26 Ultra has a 200MP wide, a 50MP ultra wide, a 10MP 3x telephoto, and a 50MP telephoto with up to 100x Space Zoom, plus a 12MP selfie camera. The S25 Ultra also has a 200MP wide camera and a 12MP front camera.

S Pen and ecosystem

The S Pen is built into both Galaxy Ultras. The OnePlus 15 has no stylus. If you already use One UI and Galaxy Buds, staying on Samsung keeps that setup the same.

S25 Ultra or S26 Ultra

Both have a 5,000mAh battery, a 6.9-inch screen, a 200MP main camera, and the S Pen. The S26 Ultra adds about a year of security support and Samsung's listed 60W wired charging. If the S25 Ultra is clearly cheaper and January 2032 is long enough, it is the value pick.

Who should buy which

Choose the OnePlus 15 if battery and fast charging are the reason you are upgrading, and you are open to OxygenOS.

Choose the Galaxy S26 Ultra if you want the longest update window, the S Pen, and the newest Samsung cameras.

Choose the Galaxy S25 Ultra if you want One UI and the S Pen for less, and security updates to January 2032 are enough.`;

const SPEC = "Specs · OnePlus and Samsung";

export const ONEPLUS_15_VS_S26_ULTRA_VS_S25_ULTRA: EditorialComparison = buildEditorialComparison({
  slug: "oneplus-15-vs-samsung-galaxy-s26-ultra-vs-samsung-galaxy-s25-ultra",
  title: "OnePlus 15 vs Galaxy S26 Ultra vs Galaxy S25 Ultra: Best for Battery?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: OP15,
      slug: OP15,
      name: "OnePlus 15",
      shortDesc: "6.78-inch phone with a 7,300mAh battery, 80W wired and 50W wireless charging, and security updates to November 2031.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "7,300mAh battery and up to 31 hours of video playback (OnePlus)",
        "80W SUPERVOOC wired and 50W AIRVOOC wireless",
        "6.78-inch LTPO display up to 165Hz",
        "Security updates to November 13, 2031 (OnePlus)",
      ],
      cons: [
        "No S Pen",
        "Security support ends earlier than both Galaxy Ultras",
        "Number of major OS upgrades not published by OnePlus",
      ],
      bestFor: "Best for battery and fast charging",
    },
    {
      id: S26,
      slug: S26,
      name: "Galaxy S26 Ultra",
      shortDesc: "6.9-inch QHD+ Ultra with a 5,000mAh battery, 60W wired charging, the S Pen, and security updates to February 2033.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Seven OS upgrades and security updates to February 2033 (Samsung)",
        "Built-in S Pen",
        "200MP wide plus 10MP 3x and 50MP telephoto lenses",
        "Up to 60W wired and 25W wireless charging",
      ],
      cons: [
        "5,000mAh, against 7,300mAh on the OnePlus 15",
        "Slower charging than the OnePlus 15",
      ],
      bestFor: "Best for the longest update window and the S Pen",
    },
    {
      id: S25,
      slug: S25,
      name: "Galaxy S25 Ultra",
      shortDesc: "6.9-inch Ultra with a 5,000mAh battery, the S Pen, and security updates to January 2032.",
      imageUrl: null,
      entityType: "product",
      position: 2,
      pros: [
        "Seven OS upgrades and security updates to January 2032 (Samsung)",
        "Built-in S Pen",
        "Up to 31 hours of video playback (Samsung)",
        "200MP wide camera",
      ],
      cons: [
        "5,000mAh, against 7,300mAh on the OnePlus 15",
        "About a year less security support than the S26 Ultra",
      ],
      bestFor: "Best for One UI and the S Pen at an older-model price",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Battery and fast charging",
      entityBValue: "Longest updates and S Pen",
      values: ["Battery and fast charging", "Longest updates and S Pen", "One UI and S Pen for less"],
      winnerIndex: "tie",
    },
    {
      label: "Battery",
      entityAValue: "7,300mAh",
      entityBValue: "5,000mAh",
      values: ["7,300mAh", "5,000mAh", "5,000mAh"],
      winnerIndex: 0,
    },
    {
      label: "Security updates until",
      entityAValue: "November 2031",
      entityBValue: "February 2033",
      values: ["November 2031", "February 2033", "January 2032"],
      winnerIndex: 1,
    },
    {
      label: "S Pen",
      entityAValue: "No",
      entityBValue: "Built in",
      values: ["No", "Built in", "Built in"],
      winnerIndex: "tie",
    },
  ],
  attributes: [
    textAttrN("battery", "Battery", SPEC, [
      cell(OP15, "7,300mAh", true),
      cell(S26, "5,000mAh"),
      cell(S25, "5,000mAh"),
    ]),
    textAttrN("charging", "Charging", SPEC, [
      cell(OP15, "80W wired, 50W wireless", true),
      cell(S26, "Up to 60W wired, 25W wireless"),
      cell(S25, "—"),
    ]),
    textAttrN("updates", "Software support", "Updates · OnePlus PSTI and Samsung policy", [
      cell(OP15, "Security updates to 2031-11-13"),
      cell(S26, "7 OS upgrades, security to 2033-02", true),
      cell(S25, "7 OS upgrades, security to 2032-01"),
    ]),
    textAttrN("display", "Display", SPEC, [
      cell(OP15, "6.78-inch LTPO 1.5K, up to 165Hz"),
      cell(S26, "6.9-inch QHD+"),
      cell(S25, "6.9-inch"),
    ]),
    textAttrN("chip", "Chip", SPEC, [
      cell(OP15, "Snapdragon 8 Elite Gen 5"),
      cell(S26, "—"),
      cell(S25, "Snapdragon 8 Elite for Galaxy"),
    ]),
    textAttrN("cameras", "Rear cameras", SPEC, [
      cell(OP15, "50MP main, 50MP ultra wide, 50MP 3.5x periscope"),
      cell(S26, "200MP wide, 50MP ultra wide, 10MP 3x, 50MP tele"),
      cell(S25, "200MP wide"),
    ]),
    textAttrN("spen", "S Pen", SPEC, [cell(OP15, "No"), cell(S26, "Built in"), cell(S25, "Built in")]),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "galaxy-s26-vs-galaxy-s26-ultra", title: "Galaxy S26 vs Galaxy S26 Ultra", category: "technology" },
    {
      slug: "iphone-17-pro-vs-samsung-galaxy-s25-ultra-vs-samsung-galaxy-s26-ultra",
      title: "iPhone 17 Pro vs Galaxy S25 Ultra vs Galaxy S26 Ultra",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "OnePlus 15 for battery and charging. Galaxy S26 Ultra for the longest updates and the S Pen. Galaxy S25 Ultra for One UI and the S Pen for less.",
    keyFact:
      "OnePlus lists 7,300mAh and security updates to November 2031 for the OnePlus 15. Samsung lists 5,000mAh for both Ultras, with security updates to February 2033 (S26 Ultra) and January 2032 (S25 Ultra).",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 10,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "OnePlus — OnePlus 15", url: ONEPLUS },
      { name: "OnePlus — Product security update period", url: ONEPLUS_PSTI },
      { name: "Samsung US — Compare Galaxy S26 series", url: SAMSUNG_S26 },
      { name: "Samsung US — Galaxy S25 Ultra", url: SAMSUNG_S25 },
      { name: "Samsung — SMR and OS upgrade policy", url: SAMSUNG_POLICY },
    ],
  },
  resources: [
    { type: "external", label: "OnePlus 15", url: ONEPLUS, description: "7,300mAh, 80W wired, 50W wireless, 165Hz, Snapdragon 8 Elite Gen 5." },
    { type: "external", label: "OnePlus security update period", url: ONEPLUS_PSTI, description: "OnePlus 15 security updates until 2031-11-13." },
    { type: "external", label: "Samsung Galaxy S26 series compare", url: SAMSUNG_S26, description: "S26 Ultra 5,000mAh, 60W wired, 6.9-inch QHD+, cameras, S Pen." },
    { type: "external", label: "Samsung Galaxy S25 Ultra", url: SAMSUNG_S25, description: "5,000mAh, up to 31 hours video, Snapdragon 8 Elite for Galaxy." },
    { type: "external", label: "Samsung update policy", url: SAMSUNG_POLICY, description: "Seven OS upgrades; security to 2032-01 (S25 Ultra) and 2033-02 (S26 Ultra)." },
  ],
  metaTitle: "OnePlus 15 vs Galaxy S26 Ultra vs S25 Ultra | A Versus B",
});
