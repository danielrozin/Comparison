import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-147 — MacBook Air vs iPad Air, as a second device next to a Windows laptop.
 * Figures read from apple.com/macbook-air/specs/, apple.com/ipad-air/specs/,
 * the MacBook Air buy offer, and the Apple Store pages for iPad Air, Apple Pencil,
 * and Magic Keyboard for iPad Air on 4 October 2026.
 * No page-level winner. No benchmark scores.
 * /entity/macbook-air and /entity/ipad-air were both noindex, nofollow, so
 * neither hub is linked.
 */

const MAC = "macbook-air";
const IPAD = "ipad-air";

const MAC_SPECS = "https://www.apple.com/macbook-air/specs/";
const IPAD_SPECS = "https://www.apple.com/ipad-air/specs/";
const MAC_BUY = "https://www.apple.com/shop/buy-mac/macbook-air";
const IPAD_BUY = "https://www.apple.com/shop/buy-ipad/ipad-air";
const PENCIL = "https://www.apple.com/shop/select-apple-pencil";
const KEYBOARD_11 =
  "https://www.apple.com/shop/product/mdfv4ll/a/magic-keyboard-for-ipad-air-11-inch-m4-us-english-white";
const KEYBOARD_13 =
  "https://www.apple.com/shop/product/mdfw4ll/a/magic-keyboard-for-ipad-air-13-inch-m4-us-english-white";

const SOURCE_DATE = "2026-10-04";
const PUBLISHED = "2026-10-04T00:00:00Z";

const SHORT_ANSWER =
  "Choose a MacBook Air when the second device, next to a Windows laptop, should be a macOS laptop for multitasking and long typing. Choose an iPad Air when that second device should be for handwritten notes, Apple Pencil, reading, and light creative work. Apple lists an M5 chip on the MacBook Air and an M4 chip with 12GB of memory on the iPad Air. Neither is better for everyone; it depends on whether the second device should be a laptop or a tablet.";

const FAQS = [
  {
    question: "Do I need a Mac if I already have a Windows laptop?",
    answer:
      "No. A Windows laptop already covers Windows software. A MacBook Air adds macOS, a built-in backlit Magic Keyboard, and a Force Touch trackpad. An iPad Air adds a tablet for notes, reading, and Apple Pencil. If the Windows laptop already handles essays and desktop apps, the iPad Air is the smaller second device. If you want a second full laptop, the MacBook Air is that device.",
  },
  {
    question: "Which is better for handwritten notes?",
    answer:
      "iPad Air. Apple lists support for Apple Pencil Pro, Apple Pencil (USB-C), and Apple Pencil hover on both the 11-inch and 13-inch models. The MacBook Air is a laptop with a backlit Magic Keyboard and a Force Touch trackpad. Apple says that trackpad enables pressure-sensitive drawing. Pencil support is the iPad Air feature.",
  },
  {
    question: "Which battery lasts longer, MacBook Air or iPad Air?",
    answer:
      "Apple rates both MacBook Air sizes for up to 18 hours of video streaming and up to 15 hours of wireless web. The 13-inch battery is 53.8 watt-hours. The 15-inch battery is 66.5 watt-hours. Apple rates every iPad Air model for up to 10 hours of surfing the web on Wi-Fi or watching video. Wi-Fi + Cellular iPad Air models are rated for up to 9 hours of surfing the web on a cellular data network. The 11-inch battery is 28.93 watt-hours and the 13-inch battery is 36.59 watt-hours. Those are separate tests, so the hour counts are not one battery ranking.",
  },
  {
    question: "Which chip is newer, the MacBook Air or the iPad Air?",
    answer:
      "Apple names the MacBook Air chip Apple M5 and the iPad Air chip Apple M4. M5 is the later name in that M-series pair. The MacBook Air M5 has a 10-core CPU. One configuration has an 8-core GPU, and others have a 10-core GPU. The iPad Air M4 has an 8-core CPU, with 3 performance cores and 5 efficiency cores, and a 9-core GPU. Those names are not a speed score.",
  },
  {
    question: "Can an iPad Air replace a laptop for university?",
    answer:
      "It depends on the course. iPad Air runs iPadOS, not macOS. MacBook Air runs macOS and includes a keyboard and trackpad. For long typing, several windows, and up to two external displays, the MacBook Air is the laptop. iPad Air fits notes, reading, and light creative work, and Apple says it supports one external display up to 6K at 60Hz. A Magic Keyboard for iPad Air is a separate purchase. If a class needs desktop macOS or Windows software, the iPad Air does not take that place.",
  },
  {
    question: "Should the price decide between MacBook Air and iPad Air?",
    answer:
      "Use price after the job is clear, and check the current price. Apple lists MacBook Air from $1,299 to $3,719, with the 13-inch from $1,299 and the 15-inch from $1,499. Apple lists iPad Air from $749. A pencil and a keyboard are extra: Apple Pencil Pro is $129, Apple Pencil (USB-C) is $79, Magic Keyboard for iPad Air 11-inch (M4) is from $269, and Magic Keyboard for iPad Air 13-inch (M4) is from $319. The lower iPad Air price is the tablet alone.",
  },
];

const VERDICT = `Best second laptop next to a Windows PC: MacBook Air. macOS, a built-in keyboard and trackpad, an M5 chip, and up to 18 hours of video streaming.

Best for notes, Apple Pencil, reading, and light creative work: iPad Air. An M4 chip, 12GB of memory, and Apple Pencil Pro or Apple Pencil (USB-C). The 11-inch Wi-Fi model is 1.02 pounds (464 grams).

Neither is better for everyone; it depends on whether the second device should be a laptop or a tablet.`;

const EXPERT_ANALYSIS = `Choose a MacBook Air when the second device, next to a Windows laptop, should be a macOS laptop for multitasking and long typing. Choose an iPad Air when that second device should be for handwritten notes, Apple Pencil, reading, and light creative work. Neither is better for everyone; it depends on whether the second device should be a laptop or a tablet.

What each one is

The MacBook Air is a macOS laptop. Apple lists a backlit Magic Keyboard with Touch ID and a Force Touch trackpad. The iPad Air is an iPadOS tablet with Touch ID. A keyboard for it is a separate accessory.

Chip and memory

Apple lists an Apple M5 chip in the MacBook Air, with a 10-core CPU, a 16-core Neural Engine, and 153GB/s memory bandwidth. One configuration has an 8-core GPU. Others have a 10-core GPU. Apple lists 16GB of unified memory on the lower configurations, configurable to 24GB or 32GB. One configuration on each size starts at 24GB, configurable to 32GB. Storage on the entry configurations is a 512GB SSD, configurable to 1TB, 2TB, or 4TB. Some configurations start at 1TB.

Apple lists an Apple M4 chip in the iPad Air: an 8-core CPU with 3 performance cores and 5 efficiency cores, a 9-core GPU, a 16-core Neural Engine, 120GB/s memory bandwidth, and 12GB of unified memory. Capacity is 128GB, 256GB, 512GB, or 1TB on both the 11-inch and 13-inch models.

Display

Apple lists a 13.6-inch (diagonal) MacBook Air display at 2560-by-1664 and 224 pixels per inch, at 500 nits. The 15-inch model is a 15.3-inch (diagonal) display at 2880-by-1864 and 224 pixels per inch, also at 500 nits. Apple says the screens measured as rectangles are 13.6 inches and 15.3 inches.

Apple lists an 11-inch iPad Air display at 2360-by-1640 and 264 pixels per inch, at 500 nits. Measured as a rectangle, that screen is 10.86 inches. The 13-inch model is 2732-by-2048 at 264 pixels per inch and 600 nits. Measured as a rectangle, that screen is 12.9 inches. Both support Apple Pencil Pro, Apple Pencil (USB-C), and Apple Pencil hover.

Battery

Apple rates both MacBook Air sizes for up to 18 hours of video streaming and up to 15 hours of wireless web. The 13-inch battery is 53.8 watt-hours. The 15-inch battery is 66.5 watt-hours. Apple rates every iPad Air model for up to 10 hours of surfing the web on Wi-Fi or watching video, and Wi-Fi + Cellular models for up to 9 hours on a cellular data network. The 11-inch battery is 28.93 watt-hours. The 13-inch battery is 36.59 watt-hours. Those tests are not the same, so the hour figures are not one ranking.

Weight, typing, and a second screen

The 13-inch MacBook Air weighs 2.7 pounds (1.23 kg) and is 0.44 inch (1.13 cm) high. The 15-inch model weighs 3.3 pounds (1.51 kg) and is 0.45 inch (1.15 cm) high. The 11-inch Wi-Fi iPad Air weighs 1.02 pounds (464 grams). The 11-inch Wi-Fi + Cellular model weighs 1.03 pounds (465 grams). The 13-inch Wi-Fi model weighs 1.36 pounds (616 grams), and the 13-inch Wi-Fi + Cellular model weighs 1.36 pounds (617 grams). Depth on both iPad Air sizes is 0.24 inch (6.1 mm).

Apple says the MacBook Air supports up to two external displays. Apple says the iPad Air supports one external display with up to 6K resolution at 60Hz.

Price

Apple lists MacBook Air from $1,299 to $3,719. The 13-inch starts at $1,299. The 15-inch starts at $1,499. Apple lists iPad Air from $749. Apple Pencil Pro is $129. Apple Pencil (USB-C) is $79. Magic Keyboard for iPad Air 11-inch (M4) is from $269. Magic Keyboard for iPad Air 13-inch (M4) is from $319. Check the current price. The keyboard and pencil are not included with the tablet.

Who should buy which

Buy the MacBook Air if the second device should be a laptop: long typing, macOS multitasking, and a keyboard that is already attached. Buy the iPad Air if the second device should be a tablet for handwritten notes, Apple Pencil, reading, and light creative work, and the Windows laptop still covers desktop software. Add the pencil and keyboard prices before you compare the totals.`;

const SPEC = "Specs";

export const MACBOOK_AIR_VS_IPAD_AIR: EditorialComparison = buildEditorialComparison({
  slug: "macbook-air-vs-ipad-air",
  title: "MacBook Air vs iPad Air: Which Second Device?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: MAC,
      slug: MAC,
      name: "MacBook Air",
      shortDesc:
        "macOS laptop with an M5 chip, a built-in Magic Keyboard, and 13.6-inch or 15.3-inch display.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "macOS laptop with a backlit Magic Keyboard, Touch ID, and a Force Touch trackpad (Apple)",
        "Apple M5, with 16GB of memory on the lower configurations (Apple)",
        "Up to 18 hours of video streaming and 15 hours of wireless web on both sizes (Apple)",
        "Up to two external displays (Apple)",
      ],
      cons: [
        "13-inch model is 2.7 pounds (1.23 kg); 15-inch model is 3.3 pounds (1.51 kg)",
        "Apple Pencil works with iPad Air; it is not a MacBook Air accessory",
      ],
      bestFor: "Best when the second device should be a macOS laptop",
    },
    {
      id: IPAD,
      slug: IPAD,
      name: "iPad Air",
      shortDesc:
        "iPadOS tablet with an M4 chip, 12GB of memory, and Apple Pencil Pro support.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Apple Pencil Pro, Apple Pencil (USB-C), and Apple Pencil hover (Apple)",
        "11-inch Wi-Fi model weighs 1.02 pounds (464 grams) (Apple)",
        "Apple M4 with 12GB of unified memory (Apple)",
        "Up to 10 hours of Wi-Fi web or video (Apple)",
      ],
      cons: [
        "Runs iPadOS, not macOS",
        "Pencil and Magic Keyboard are separate purchases",
        "One external display, up to 6K at 60Hz (Apple)",
      ],
      bestFor: "Best for notes, Apple Pencil, reading, and light creative work",
    },
  ],
  keyDifferences: [
    {
      label: "Second device job",
      entityAValue: "macOS laptop for typing and multitasking",
      entityBValue: "Tablet for notes, Pencil, reading, and light creative work",
      winner: "tie",
    },
    {
      label: "Chip",
      entityAValue: "Apple M5",
      entityBValue: "Apple M4, 12GB memory",
      winner: "tie",
    },
    {
      label: "Keyboard",
      entityAValue: "Built-in Magic Keyboard and trackpad",
      entityBValue: "Magic Keyboard sold separately",
      winner: "tie",
    },
    {
      label: "Starting price",
      entityAValue: "13-inch from $1,299",
      entityBValue: "From $749, before Pencil or keyboard",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "role",
      "What it is",
      SPEC,
      MAC,
      IPAD,
      "macOS laptop with a built-in Magic Keyboard and Force Touch trackpad",
      "iPadOS tablet with Touch ID"
    ),
    textAttr(
      "chip",
      "Chip",
      SPEC,
      MAC,
      IPAD,
      "Apple M5. 10-core CPU. 8-core GPU on one configuration, 10-core GPU on others",
      "Apple M4. 8-core CPU (3 performance, 5 efficiency). 9-core GPU. 12GB unified memory"
    ),
    textAttr(
      "display",
      "Display",
      SPEC,
      MAC,
      IPAD,
      "13.6-inch, 2560-by-1664, 500 nits. 15.3-inch, 2880-by-1864, 500 nits",
      "11-inch, 2360-by-1640, 500 nits. 13-inch, 2732-by-2048, 600 nits"
    ),
    textAttr(
      "memory",
      "Memory",
      SPEC,
      MAC,
      IPAD,
      "16GB on the lower configurations, configurable to 24GB or 32GB. One configuration on each size starts at 24GB",
      "12GB unified memory"
    ),
    textAttr(
      "storage",
      "Storage",
      SPEC,
      MAC,
      IPAD,
      "512GB SSD on entry configurations, configurable to 1TB, 2TB, or 4TB. Some configurations start at 1TB",
      "128GB, 256GB, 512GB, or 1TB on both sizes"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      MAC,
      IPAD,
      "Up to 18 hours video streaming and 15 hours wireless web on both sizes. 53.8 Wh (13-inch) or 66.5 Wh (15-inch)",
      "Up to 10 hours of Wi-Fi web or video. Up to 9 hours on cellular for Wi-Fi + Cellular models. 28.93 Wh (11-inch) or 36.59 Wh (13-inch)"
    ),
    textAttr(
      "weight",
      "Weight",
      SPEC,
      MAC,
      IPAD,
      "13-inch: 2.7 pounds (1.23 kg). 15-inch: 3.3 pounds (1.51 kg)",
      "11-inch Wi-Fi: 1.02 pounds (464 grams). 13-inch Wi-Fi: 1.36 pounds (616 grams)"
    ),
    textAttr(
      "input",
      "Pencil and keyboard",
      SPEC,
      MAC,
      IPAD,
      "Backlit Magic Keyboard and Force Touch trackpad",
      "Apple Pencil Pro, Apple Pencil (USB-C), and Apple Pencil hover. Magic Keyboard sold separately"
    ),
    textAttr(
      "displays",
      "External displays",
      SPEC,
      MAC,
      IPAD,
      "Up to two external displays",
      "One external display, up to 6K at 60Hz"
    ),
    textAttr(
      "price",
      "Price",
      SPEC,
      MAC,
      IPAD,
      "From $1,299 (13-inch) and $1,499 (15-inch). Offer range $1,299 to $3,719",
      "From $749. Apple Pencil Pro $129. Apple Pencil (USB-C) $79. 11-inch Magic Keyboard from $269. 13-inch Magic Keyboard from $319"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "MacBook Air when the second device should be a macOS laptop. iPad Air when it should be a tablet for notes, Apple Pencil, reading, and light creative work.",
    keyFact:
      "Apple lists an M5 chip on the MacBook Air and an M4 chip with 12GB of memory on the iPad Air. The 13-inch MacBook Air weighs 2.7 pounds (1.23 kg). The 11-inch Wi-Fi iPad Air weighs 1.02 pounds (464 grams).",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 10,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple — MacBook Air specs", url: MAC_SPECS },
      { name: "Apple — iPad Air specs", url: IPAD_SPECS },
      { name: "Apple — MacBook Air buy offer", url: MAC_BUY },
      { name: "Apple — iPad Air", url: IPAD_BUY },
      { name: "Apple — Apple Pencil", url: PENCIL },
      { name: "Apple — Magic Keyboard for iPad Air 11-inch (M4)", url: KEYBOARD_11 },
      { name: "Apple — Magic Keyboard for iPad Air 13-inch (M4)", url: KEYBOARD_13 },
    ],
  },
  resources: [
    {
      type: "external",
      label: "MacBook Air specs",
      url: MAC_SPECS,
      description:
        "Apple M5. 13.6-inch 2560-by-1664 and 15.3-inch 2880-by-1864. 16GB on the lower configurations. Up to 18 hours of video streaming and 15 hours of wireless web. 13-inch weight 2.7 pounds (1.23 kg).",
    },
    {
      type: "external",
      label: "iPad Air specs",
      url: IPAD_SPECS,
      description:
        "Apple M4 with 12GB of memory. 11-inch 2360-by-1640. 13-inch 2732-by-2048. Up to 10 hours of Wi-Fi web or video. 11-inch Wi-Fi weight 1.02 pounds (464 grams). Apple Pencil Pro and Apple Pencil (USB-C).",
    },
    {
      type: "external",
      label: "MacBook Air buy offer",
      url: MAC_BUY,
      description: "13-inch from $1,299. 15-inch from $1,499. Offer range $1,299 to $3,719.",
    },
    {
      type: "external",
      label: "iPad Air",
      url: IPAD_BUY,
      description: "iPad Air from $749. Apple Pencil Pro $129. Apple Pencil (USB-C) $79.",
    },
    {
      type: "external",
      label: "Apple Pencil",
      url: PENCIL,
      description: "Apple Pencil Pro $129. Apple Pencil (USB-C) $79.",
    },
    {
      type: "external",
      label: "Magic Keyboard for iPad Air 11-inch (M4)",
      url: KEYBOARD_11,
      description: "Magic Keyboard for iPad Air 11-inch (M4) from $269.",
    },
    {
      type: "external",
      label: "Magic Keyboard for iPad Air 13-inch (M4)",
      url: KEYBOARD_13,
      description: "Magic Keyboard for iPad Air 13-inch (M4) from $319.",
    },
  ],
  metaTitle: "MacBook Air vs iPad Air | A Versus B",
});
