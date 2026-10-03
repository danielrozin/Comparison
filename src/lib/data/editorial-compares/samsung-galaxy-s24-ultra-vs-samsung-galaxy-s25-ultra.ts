import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-115 — Galaxy S24 Ultra vs Galaxy S25 Ultra.
 * Specs below were checked against pages fetched on 2026-09-28.
 * GSMArena compare (idPhone1=13322 is the S25 Ultra, idPhone2=12771 is the S24 Ultra),
 * Digital Trends (updated February 10, 2025), Samsung's US S25 Ultra page, and
 * Samsung's Levant S24 Ultra page. The Reddit summary is from the Arctic Shift
 * archive of the two thread ids, because reddit.com returned 403.
 * No page-level winner. Asker prices stay attributed to the asker.
 */

const S24 = "samsung-galaxy-s24-ultra";
const S25 = "samsung-galaxy-s25-ultra";

const GSMARENA = "https://www.gsmarena.com/compare.php3?idPhone1=13322&idPhone2=12771";
const DIGITAL_TRENDS =
  "https://www.digitaltrends.com/phones/samsung-galaxy-s25-ultra-vs-samsung-galaxy-s24-ultra/";
const SAMSUNG_S25 = "https://www.samsung.com/us/smartphones/galaxy-s25-ultra/";
const SAMSUNG_S24 = "https://www.samsung.com/levant/smartphones/galaxy-s24-ultra/";
const REDDIT =
  "https://www.reddit.com/r/samsunggalaxy/comments/1wrr9qy/s24_ultra_vs_s25_ultra_which_one_should_i_get/";
const REDDIT_CROSSPOST =
  "https://www.reddit.com/r/S24Ultra/comments/1wrrehr/s24_ultra_vs_s25_ultra_which_one_should_i_get/";
const GSMARENA_SPEN =
  "https://www.gsmarena.com/galaxy_s25_ultra_replacement_s_pens_are_49_a_pop_despite_lacking_bluetooth-news-66381.php";
const GSMARENA_AIR_ACTIONS =
  "https://www.gsmarena.com/s_pen_in_samsung_galaxy_s25_ultra_to_become_even_less_usable-news-66041.php";

const PUBLISHED = "2026-09-28T00:00:00Z";

const SHORT_ANSWER =
  "If you can buy a discounted Galaxy S24 Ultra, it is still the better value for most people in 2026: same 5,000 mAh battery class, the same 200MP main and 5x periscope cameras, and seven years of OS updates from launch. Choose the Galaxy S25 Ultra if you want the Snapdragon 8 Elite for Galaxy chip, the larger 6.9-inch display, the 50MP ultrawide upgrade, and a lighter body.";

const FAQS = [
  {
    question: "Is the Samsung Galaxy S25 Ultra worth it over the S24 Ultra?",
    answer:
      "Only if you want the Snapdragon 8 Elite for Galaxy chip, the larger 6.9-inch display, the lighter body, or the 50MP ultrawide camera. A discounted Galaxy S24 Ultra is the better value for most buyers.",
  },
  {
    question: "Does the Galaxy S25 Ultra have better battery life than the S24 Ultra?",
    answer:
      "Both phones use a 5,000 mAh battery and 45W wired charging. Independent reviews generally treat day-to-day endurance as similar.",
  },
  {
    question: "Is the S25 Ultra camera better than the S24 Ultra?",
    answer:
      "The clearest hardware upgrade is the ultrawide camera (50MP on the S25 Ultra versus 12MP on the S24 Ultra). Both keep a 200MP main camera and 3x/5x telephoto lenses.",
  },
  {
    question: "What did the Galaxy S25 Ultra S Pen lose compared with the S24 Ultra?",
    answer:
      "The S25 Ultra S Pen has no Bluetooth, so Air Actions (remote shutter, gestures, and media control) are gone. The S24 Ultra S Pen still supports them. GSMArena says Samsung removed Bluetooth from the S25 Ultra S Pen. That outlet describes Air Actions as the Bluetooth gesture and remote-control set, including the camera shutter, and says a Bluetooth S Pen also controlled gallery swipes, slides, and music playback.",
  },
  {
    question: "How long will the S24 Ultra and S25 Ultra receive updates?",
    answer:
      "Samsung promised seven years of OS and security updates for both phones from their respective launch years, so the S25 Ultra starts one generation later.",
  },
  {
    question: "Which is better for gaming?",
    answer:
      "Digital Trends gives the Galaxy S25 Ultra the edge for gaming. The phone uses the Snapdragon 8 Elite for Galaxy chip, and the review describes a larger vapor chamber and new thermal material for cooling. Their reviewer played Asphalt Legends: Unite at maximum settings and reported no overheating, including in performance mode. The same article still treats the Galaxy S24 Ultra as strong for everyday tasks and games: a reviewer spent over 30 minutes on demanding titles such as Asphalt 9: Legends, the phone barely got warm, and it never got too hot to hold, including during stress tests. Digital Trends also says that in daily use most people probably will not see much difference, and that the S24 Ultra can handle the latest games without overheating.",
  },
];

const VERDICT = `Best value: Galaxy S24 Ultra (on sale). A discounted S24 Ultra is the better buy for most people in 2026. It stays in the same 5,000 mAh battery class, keeps the 200MP main camera and 50MP 5x periscope, and launched with the same seven-year update promise.

Best upgrade: Galaxy S25 Ultra (chip, display, ultrawide). Choose it for the Snapdragon 8 Elite for Galaxy chip, the 6.9-inch display, the 50MP ultrawide, and the lighter 218 g body.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `If you can buy a discounted Galaxy S24 Ultra, it is still the better value for most people in 2026. Choose the Galaxy S25 Ultra if you want the Snapdragon 8 Elite for Galaxy chip, the larger 6.9-inch display, the 50MP ultrawide, and a lighter body. This page does not crown one phone.

Spec snapshot

GSMArena lists the S24 Ultra at 232 g or 233 g and the S25 Ultra at 218 g. Digital Trends lists 233 g and 218 g, and says the S25 Ultra is 15 grams lighter. Both spec sheets list a 3120 x 1440 resolution, a 120Hz refresh rate, and 2,600 nits of peak brightness. GSMArena calls both panels Dynamic LTPO AMOLED 2X. Samsung says that display can reach a peak brightness of up to 2600 nits, and that the screen measures 6.8 inches. Samsung says the screen is 6.9 inches in the full rectangle and 6.8 inches once the rounded corners are accounted for.

Samsung names the chips Snapdragon 8 Gen 3 for Galaxy on the S24 Ultra and Snapdragon 8 Elite for Galaxy on the S25 Ultra. GSMArena's compare lists those same chipsets.

Cameras match on three modules. Both have a 200MP main camera, a 10MP 3x telephoto, and a 50MP 5x periscope (Digital Trends and GSMArena). Samsung lists a 12MP ultrawide for the S24 Ultra. Samsung lists an upgraded 50MP ultrawide for the S25 Ultra. That ultrawide is the clear hardware gap.

Battery and daily use

Both phones use a 5,000 mAh battery, 45W wired charging, and 15W wireless charging (GSMArena and Digital Trends). GSMArena also lists 65% in 30 minutes on wired charging for both, and 4.5W reverse wireless for both. The S25 Ultra is Qi2 Ready, which Digital Trends says still needs a compatible magnetic case.

Samsung's S24 Ultra page calls 5,000 mAh the typical capacity, lists a 4,855 mAh rated capacity, and claims up to 30 hours of video playback. Samsung lists 5,000 mAh for the S25 Ultra and claims up to 31 hours of video playback. Those hour figures are Samsung's claims, not a lab result on this page. Digital Trends called the battery round a tie: in that review, both phones were described as lasting through two days of use, with the same 45W charging.

Camera

Do not read a lab score into this. Digital Trends says the 50MP ultrawide is the one clear camera upgrade, with excellent color, dynamic range, and detail in their review, and that the rest of the S25 Ultra camera did not feel like a big step past the S24 Ultra. The S24 Ultra's main and ultrawide photos still impressed that review. Both phones keep the 200MP main camera and the 3x and 5x telephoto lenses.

Performance and gaming

Digital Trends gives gaming to the S25 Ultra because of the Snapdragon 8 Elite for Galaxy chip plus a larger vapor chamber and new thermal material. Samsung's S25 Ultra page describes the same larger vapor chamber and new thermal interface material, and says they are there for a smoother, cooler gaming session. In the Digital Trends review, Asphalt Legends: Unite at maximum settings did not overheat the S25 Ultra, including in performance mode.

The S24 Ultra is still described as strong for everyday use and games. Digital Trends says a reviewer spent over 30 minutes on demanding titles such as Asphalt 9: Legends, the phone barely got warm, and it never got too hot to hold, including during stress tests. The same says most people probably will not see much difference in daily use.

S Pen and software support

GSMArena says Samsung removed Bluetooth from the S25 Ultra S Pen. The same outlet describes Air Actions as the Bluetooth set of gestures and remote controls, including a camera shutter, and says a Bluetooth S Pen also worked as a remote for photos, videos, gallery swipes, slides, and music playback. Those Air Actions are gone on the S25 Ultra. GSMArena's spec sheet lists Bluetooth integration, an accelerometer, and a gyro on the S24 Ultra stylus, and lists the S25 Ultra stylus without them. Samsung's S25 Ultra page still says the phone comes with a built-in S Pen. It does not describe Bluetooth or Air Actions.

Digital Trends says Samsung promised seven years of security updates and OS upgrades for both phones. In that February 2025 article, the S25 Ultra's final OS update would be Android 22, likely in 2032, and the S24 Ultra's would be Android 21. GSMArena lists up to 7 major OS updates for both. The S25 Ultra starts one generation later. That article also listed launch software as One UI 7 on Android 15 for the S25 Ultra and One UI 6.1 on Android 14 for the S24 Ultra. Those are the versions at the time of the article, not a claim about what is installed in September 2026.

Who should buy which

Buy a discounted Galaxy S24 Ultra if you want flagship cameras, a 5,000 mAh battery, and a long update window without paying for the newer chip, the larger panel, or the 50MP ultrawide. The Bluetooth S Pen, including Air Actions, is still the S24 Ultra feature the S25 Ultra dropped.

Buy the Galaxy S25 Ultra if those upgrades are the point: Snapdragon 8 Elite for Galaxy, the 6.9-inch display, the lighter body, the 50MP ultrawide, and the newer cooling hardware.

Community takeaway

On September 27, 2026, a post on r/samsunggalaxy asked which phone to buy. The asker listed €545 for the S24 Ultra and €665 for the S25 Ultra, and asked whether the extra €120 was worth it for camera, battery, performance, display, and gaming, and whether to wait for Black Friday 2026. Those euro figures are the asker's prices in that post. This page does not treat them as a current store price.

That thread had three comments. One person would take the S24 Ultra and use the €120 for something else, and would not wait for Black Friday. One person asked how the battery life compares, and the thread did not answer with a test. One person said it depends: the S24 Ultra for the design and a Bluetooth S Pen, the S25 Ultra for more power and the better ultrawide.

The same question was cross-posted to r/S24Ultra. Replies there also split. Some would buy the S24 Ultra. Some would buy the S25 Ultra for the newer chip, or because they see the €120 gap as small. This is a summary of those threads. It does not quote usernames, and it is not a vote count.`;

export const SAMSUNG_GALAXY_S24_ULTRA_VS_S25_ULTRA: EditorialComparison = buildEditorialComparison({
  slug: "samsung-galaxy-s24-ultra-vs-samsung-galaxy-s25-ultra",
  title: "Samsung Galaxy S24 Ultra vs Samsung Galaxy S25 Ultra: Which Should You Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: S24,
      slug: S24,
      name: "Samsung Galaxy S24 Ultra",
      shortDesc:
        "2024 Ultra with a Snapdragon 8 Gen 3 for Galaxy, a 6.8-inch 2600-nit display, a 12MP ultrawide, and a Bluetooth S Pen.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Same 5,000 mAh battery class, 200MP main camera, and 50MP 5x periscope as the S25 Ultra",
        "Seven years of OS and security updates from its launch year (Digital Trends, GSMArena)",
        "S Pen still has Bluetooth, so Air Actions (remote shutter, gestures, and media control) still work (GSMArena)",
        "Snapdragon 8 Gen 3 for Galaxy still handled demanding games without overheating in the Digital Trends review",
      ],
      cons: [
        "Heavier: 232 g or 233 g, against 218 g on the S25 Ultra (GSMArena)",
        "12MP ultrawide, against 50MP on the S25 Ultra",
        "6.8-inch display, against 6.9 inches on the S25 Ultra",
        "Older chip: Snapdragon 8 Gen 3 for Galaxy, against Snapdragon 8 Elite for Galaxy",
      ],
      bestFor: "Best value: Galaxy S24 Ultra (on sale)",
    },
    {
      id: S25,
      slug: S25,
      name: "Samsung Galaxy S25 Ultra",
      shortDesc:
        "2025 Ultra with a Snapdragon 8 Elite for Galaxy, a 6.9-inch display, a 50MP ultrawide, and a 218 g body.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Snapdragon 8 Elite for Galaxy (Samsung, GSMArena)",
        "6.9-inch display and a 50MP ultrawide",
        "218 g, lighter than the S24 Ultra (GSMArena, Digital Trends)",
        "Larger vapor chamber and new thermal material (Samsung, Digital Trends)",
        "Seven-year update promise starts one generation later",
      ],
      cons: [
        "S Pen has no Bluetooth, so Air Actions are gone (GSMArena)",
        "Digital Trends was underwhelmed by the camera upgrade beyond the ultrawide",
        "The better value only if you specifically want the chip, display, ultrawide, or lighter body",
      ],
      bestFor: "Best upgrade: Galaxy S25 Ultra (chip, display, ultrawide)",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Best value when the S24 Ultra is discounted",
      entityBValue: "Best upgrade for the chip, display, and ultrawide",
      winner: "tie",
    },
    {
      label: "Chip",
      entityAValue: "Snapdragon 8 Gen 3 for Galaxy",
      entityBValue: "Snapdragon 8 Elite for Galaxy",
      winner: "b",
    },
    {
      label: "Display",
      entityAValue: "6.8-inch, 3120 x 1440, 120Hz, 2600 nits peak",
      entityBValue: "6.9-inch, 3120 x 1440, 120Hz, 2600 nits peak",
      winner: "b",
    },
    {
      label: "Weight",
      entityAValue: "232 g or 233 g (GSMArena)",
      entityBValue: "218 g",
      winner: "b",
    },
    {
      label: "Ultrawide",
      entityAValue: "12MP",
      entityBValue: "50MP",
      winner: "b",
    },
    {
      label: "S Pen",
      entityAValue: "Bluetooth Air Actions (shutter, gestures, media)",
      entityBValue: "No Bluetooth; Air Actions removed",
      winner: "a",
    },
  ],
  attributes: [
    textAttr(
      "chip",
      "Chip",
      "Performance",
      S24,
      S25,
      "Snapdragon 8 Gen 3 for Galaxy (Samsung, GSMArena)",
      "Snapdragon 8 Elite for Galaxy (Samsung, GSMArena)",
      "b"
    ),
    textAttr(
      "display",
      "Display",
      "Display",
      S24,
      S25,
      "6.8-inch Dynamic LTPO AMOLED 2X, 3120 x 1440, 120Hz, 2600 nits peak",
      "6.9-inch Dynamic LTPO AMOLED 2X, 3120 x 1440, 120Hz, 2600 nits peak",
      "b"
    ),
    textAttr(
      "weight",
      "Weight",
      "Design",
      S24,
      S25,
      "232 g or 233 g (GSMArena); 233 g (Digital Trends)",
      "218 g (GSMArena, Digital Trends)",
      "b"
    ),
    textAttr(
      "ultrawide",
      "Ultrawide camera",
      "Camera",
      S24,
      S25,
      "12MP ultrawide",
      "50MP ultrawide",
      "b"
    ),
    textAttr(
      "main-telephoto",
      "Main and telephoto",
      "Camera",
      S24,
      S25,
      "200MP main, 10MP 3x, 50MP 5x periscope",
      "200MP main, 10MP 3x, 50MP 5x periscope"
    ),
    textAttr(
      "battery",
      "Battery and charging",
      "Battery",
      S24,
      S25,
      "5,000 mAh, 45W wired, 15W wireless",
      "5,000 mAh, 45W wired, 15W wireless (Qi2 Ready)"
    ),
    textAttr(
      "s-pen",
      "S Pen",
      "Features",
      S24,
      S25,
      "Bluetooth S Pen with Air Actions: remote shutter, gestures, and media control (GSMArena)",
      "No Bluetooth, so Air Actions are gone (GSMArena)",
      "a"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "iphone-16-pro-vs-galaxy-s25-ultra",
      title: "iPhone 16 Pro vs Galaxy S25 Ultra",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Best value: Galaxy S24 Ultra (on sale). Best upgrade: Galaxy S25 Ultra (chip, display, ultrawide).",
    keyFact:
      "Both phones are a 5,000 mAh battery with a 200MP main camera and a 50MP 5x periscope. GSMArena lists the S25 Ultra at 218 g and the S24 Ultra at 232 g or 233 g. Both displays are rated for 2600 nits peak.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: "2026-09-28",
    sources: [
      { name: "GSMArena — S25 Ultra vs S24 Ultra", url: GSMARENA },
      { name: "Digital Trends — S25 Ultra vs S24 Ultra (Feb 10, 2025)", url: DIGITAL_TRENDS },
      { name: "Samsung — Galaxy S25 Ultra (US)", url: SAMSUNG_S25 },
      { name: "Samsung — Galaxy S24 Ultra (Levant)", url: SAMSUNG_S24 },
      { name: "Reddit — r/samsunggalaxy thread (Sep 27, 2026)", url: REDDIT },
      { name: "Reddit — r/S24Ultra cross-post", url: REDDIT_CROSSPOST },
      {
        name: "GSMArena — S25 Ultra S Pen lost Bluetooth (Feb 5, 2025)",
        url: GSMARENA_SPEN,
      },
      {
        name: "GSMArena — Air Actions are the S Pen's Bluetooth controls",
        url: GSMARENA_AIR_ACTIONS,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "GSMArena spec compare",
      url: GSMARENA,
      description:
        "Weight, display, chip, cameras, 5,000 mAh battery, 45W/15W charging. S24 Ultra stylus lists Bluetooth; the S25 Ultra stylus does not.",
    },
    {
      type: "external",
      label: "Digital Trends comparison (updated Feb 10, 2025)",
      url: DIGITAL_TRENDS,
      description:
        "Battery called a tie. Ultrawide gap, S Pen remote shutter, gaming notes, and the seven-year update promise.",
    },
    {
      type: "external",
      label: "Samsung Galaxy S25 Ultra",
      url: SAMSUNG_S25,
      description:
        "Snapdragon 8 Elite for Galaxy, 6.9-inch display, 50MP ultrawide, 5,000 mAh, vapor chamber, built-in S Pen.",
    },
    {
      type: "external",
      label: "Samsung Galaxy S24 Ultra",
      url: SAMSUNG_S24,
      description:
        "Snapdragon 8 Gen 3 for Galaxy, 6.8-inch display, 2600 nits peak, 12MP ultrawide, 5,000 mAh typical.",
    },
    {
      type: "external",
      label: "Reddit thread (summary only)",
      url: REDDIT,
      description:
        "Asker listed €545 and €665. Three comments, summarized without usernames. Not a current price.",
    },
    {
      type: "external",
      label: "Reddit cross-post (summary only)",
      url: REDDIT_CROSSPOST,
      description: "r/S24Ultra replies split. No usernames quoted.",
    },
    {
      type: "external",
      label: "GSMArena — Bluetooth removed from the S25 Ultra S Pen",
      url: GSMARENA_SPEN,
      description:
        "Feb 5, 2025. Samsung removed Bluetooth. A Bluetooth S Pen was a remote for photos, videos, gallery swipes, slides, and music.",
    },
    {
      type: "external",
      label: "GSMArena — Air Actions",
      url: GSMARENA_AIR_ACTIONS,
      description:
        "Names Air Actions as the Bluetooth gesture and remote-control set, including the camera shutter.",
    },
  ],
  metaTitle: "Galaxy S24 Ultra vs S25 Ultra: Which Should You Buy? | A Versus B",
});
