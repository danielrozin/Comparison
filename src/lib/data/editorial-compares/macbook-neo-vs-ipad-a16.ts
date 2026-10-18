import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-231 — MacBook Neo vs iPad (A16), for light productivity.
 * Figures read on 18 October 2026 from Apple's MacBook Neo tech specs
 * (support.apple.com/126322), the March 2026 MacBook Neo newsroom post,
 * Apple's iPad (A16) tech specs, and the March 4, 2025 Apple newsroom post
 * that lists iPad (A16), Magic Keyboard Folio and Apple Pencil prices.
 * Prices are Apple's US launch prices (MSRP) only, each with its Apple Newsroom
 * month (Folio: October 2022 newsroom; Apple Pencil (USB-C): October 2023
 * newsroom), plus Apple Store links for current prices. No benchmarks.
 * No years-of-updates claims. No page-level winner.
 */

const NEO = "macbook-neo";
const IPAD = "ipad-a16";

const NEO_SPECS = "https://support.apple.com/en-us/126322";
const NEO_NEWS = "https://www.apple.com/newsroom/2026/03/say-hello-to-macbook-neo/";
const IPAD_SPECS = "https://www.apple.com/ipad-11/specs/";
const IPAD_NEWS =
  "https://www.apple.com/newsroom/2025/03/apple-introduces-ipad-air-with-powerful-m3-chip-and-new-magic-keyboard/";
const FOLIO_NEWS =
  "https://www.apple.com/newsroom/2022/10/apple-unveils-completely-redesigned-ipad-in-four-vibrant-colors/";
const PENCIL_NEWS =
  "https://www.apple.com/newsroom/2023/10/apple-introduces-new-apple-pencil-bringing-more-value-and-choice-to-the-lineup/";
const NEO_STORE = "https://www.apple.com/shop/buy-mac/macbook-neo";
const IPAD_STORE = "https://www.apple.com/shop/buy-ipad/ipad";

const SOURCE_DATE = "2026-10-18";
const PUBLISHED = "2026-10-18T00:00:00Z";

const SHORT_ANSWER =
  "Choose the MacBook Neo for Word and Excel, long typing sessions and multi-window study: Apple builds in a Magic Keyboard and Multi-Touch trackpad, runs macOS on an A18 Pro chip, and rates it for up to 16 hours of video streaming; US $599 launch price (MSRP), per Apple Newsroom, March 2026. Choose the iPad (A16) for touch, Apple Pencil drawing and a 477 g tablet; US $349 launch price (MSRP), per Apple Newsroom, March 2025. The Magic Keyboard Folio ($249 launch price (MSRP), per Apple Newsroom, October 2022) and the Apple Pencil (USB-C) ($79 launch price (MSRP), per Apple Newsroom, October 2023) bring the iPad to $677 at those launch prices. Neither is better for everyone; it depends on whether typing or Pencil drawing matters more.";

const FAQS = [
  {
    question: "Is the MacBook Neo better than the iPad (A16) for Word and Excel?",
    answer:
      "For typing-heavy documents, the MacBook Neo is the simpler choice. Apple builds in a Magic Keyboard with 78 (ANSI) or 79 (ISO) keys and a Multi-Touch trackpad, and it runs macOS. The iPad (A16) runs iPadOS and needs the Magic Keyboard Folio ($249 launch price (MSRP), per Apple Newsroom, October 2022) for a keyboard and trackpad.",
  },
  {
    question: "Is the iPad (A16) cheaper than the MacBook Neo once you add accessories?",
    answer:
      "Not with both accessories, at US launch prices. The iPad (A16) with 128GB is $349 launch price (MSRP), per Apple Newsroom, March 2025. The Magic Keyboard Folio is $249 launch price (MSRP), per Apple Newsroom, October 2022, and the Apple Pencil (USB-C) is $79 launch price (MSRP), per Apple Newsroom, October 2023, which is $677 together. The MacBook Neo with 256GB and a built-in keyboard and trackpad is $599 launch price (MSRP), per Apple Newsroom, March 2026, or $499 for education. The iPad alone, or with only one accessory, costs less than the MacBook Neo at those launch prices.",
  },
  {
    question: "Which is better for digital coloring?",
    answer:
      "The iPad (A16). Apple says it works with the Apple Pencil (USB-C) and the Apple Pencil (1st generation), which needs the USB-C to Apple Pencil Adapter. The MacBook Neo has a trackpad and no Apple Pencil support, so drawing apps on it use the trackpad or a mouse.",
  },
  {
    question: "Which has longer battery life, the MacBook Neo or the iPad (A16)?",
    answer:
      "Apple rates the MacBook Neo for up to 16 hours of video streaming and up to 11 hours of wireless web, with a 36.5 watt-hour battery. It rates the iPad (A16) Wi-Fi model for up to 10 hours of web browsing on Wi-Fi or watching video, with a 28.93 watt-hour battery. Apple's own tests use different tasks for the two devices, and real use varies.",
  },
  {
    question: "How much storage do the MacBook Neo and iPad (A16) have?",
    answer:
      "Apple sells the MacBook Neo with 256GB or 512GB of SSD storage and 8GB of unified memory. The iPad (A16) comes in 128GB, 256GB or 512GB. For keeping a device for years, the larger tier leaves more room for apps, photos and offline video.",
  },
  {
    question: "How heavy are the MacBook Neo and the iPad (A16)?",
    answer:
      "Apple lists the MacBook Neo at 1.23 kg (2.7 pounds) and 1.27 cm thick, with a 13.0-inch display. It lists the iPad (A16) Wi-Fi model at 477 grams and 7 mm thick, with an 11-inch display. The Magic Keyboard Folio adds weight to the iPad.",
  },
];

const VERDICT = `Best for typing, documents and multi-window study: MacBook Neo. A18 Pro chip, macOS, a built-in Magic Keyboard and trackpad, a 13.0-inch display and up to 16 hours of video streaming; US $599 launch price (MSRP), per Apple Newsroom, March 2026.

Best for touch and Apple Pencil drawing: iPad (A16). A16 chip, an 11-inch display, 477 g and Apple Pencil (USB-C) support; US $349 launch price (MSRP), per Apple Newsroom, March 2025. With the Magic Keyboard Folio and Apple Pencil (USB-C), the total is $677 at launch prices (MSRP).

Neither is better for everyone; it depends on whether typing or Pencil drawing matters more.`;

const EXPERT_ANALYSIS = `Choose the MacBook Neo for Word and Excel, long typing sessions and multi-window study: Apple builds in a Magic Keyboard and Multi-Touch trackpad, runs macOS on an A18 Pro chip, and rates it for up to 16 hours of video streaming; US $599 launch price (MSRP), per Apple Newsroom, March 2026. Choose the iPad (A16) for touch, Apple Pencil drawing and a 477 g tablet; US $349 launch price (MSRP), per Apple Newsroom, March 2025. The Magic Keyboard Folio ($249 launch price (MSRP), per Apple Newsroom, October 2022) and the Apple Pencil (USB-C) ($79 launch price (MSRP), per Apple Newsroom, October 2023) bring the iPad to $677 at those launch prices. Neither is better for everyone; it depends on whether typing or Pencil drawing matters more.

Typing, documents and study

The MacBook Neo is a laptop with the keyboard built in. Apple lists a Magic Keyboard with 78 (ANSI) or 79 (ISO) keys, including 12 full-height function keys, a Multi-Touch trackpad, and a Magic Keyboard with Touch ID option. It runs macOS, so Word, Excel and browser tabs sit in overlapping windows like any Mac.

The iPad (A16) is a touchscreen tablet running iPadOS. For a keyboard and trackpad, Apple sells the Magic Keyboard Folio, a two-piece design with a detachable keyboard, a 14-key function row, a built-in trackpad and a back panel with an adjustable stand. Microsoft Office apps run on both, but long writing sessions and spreadsheets are easier with the keyboard that is always attached.

Drawing, coloring and touch

The iPad (A16) works with the Apple Pencil (USB-C) and the Apple Pencil (1st generation); Apple says the 1st-generation Pencil needs the USB-C to Apple Pencil Adapter. That makes the iPad the device for digital coloring, handwritten notes and touch-first apps. The MacBook Neo has no touchscreen and no Apple Pencil support.

Price with accessories

MacBook Neo: $599 launch price (MSRP), per Apple Newsroom, March 2026, or $499 for education. iPad (A16) Wi-Fi model with 128GB: $349 launch price (MSRP), per Apple Newsroom, March 2025, or $329 for education. Magic Keyboard Folio: $249 launch price (MSRP), per Apple Newsroom, October 2022. Apple Pencil (USB-C): $79 launch price (MSRP), per Apple Newsroom, October 2023. At those launch prices the iPad with both comes to $677, which is more than the MacBook Neo. The iPad with only the Pencil is $428, and with only the Folio is $598. Store prices and discounts change, so compare complete carts before buying.

Chip, memory and storage

Apple lists the A18 Pro chip in the MacBook Neo, with a 6-core CPU (2 performance cores and 4 efficiency cores), a 5-core GPU with hardware-accelerated ray tracing, a 16-core Neural Engine and 8GB of unified memory. Storage is 256GB or 512GB. The iPad (A16) has the A16 chip with a 5-core CPU, a 4-core GPU and a 16-core Neural Engine, and comes in 128GB, 256GB or 512GB.

Display

The MacBook Neo has a 13.0-inch Liquid Retina display at 2408 by 1506 pixels and 219 pixels per inch, with 500 nits brightness. The iPad (A16) has an 11-inch Liquid Retina Multi-Touch display at 2360 by 1640 pixels and 264 pixels per inch; Apple says it measures 10.86 inches diagonally as a rectangle.

Battery

Apple rates the MacBook Neo for up to 16 hours of video streaming and up to 11 hours of wireless web, with a 36.5 watt-hour battery and a 20W USB-C power adapter in the box. It rates the iPad (A16) Wi-Fi model for up to 10 hours of web browsing on Wi-Fi or watching video, with a 28.93 watt-hour battery and a 20W USB-C power adapter. Apple tests the two with different tasks, so the hours are not a like-for-like race.

Ports and size

The MacBook Neo has one USB 3 (USB-C) port, one USB 2 (USB-C) port and a 3.5 mm headphone jack, and supports one external display up to 4K at 60Hz. It weighs 1.23 kg and is 1.27 cm thick. The iPad (A16) has one USB-C port with USB 2.0 speeds and DisplayPort output, Touch ID in the top button and a 12MP back camera. The Wi-Fi model weighs 477 grams and is 7 mm thick.

Who should buy which

Buy the MacBook Neo if it will be your main computer for documents, spreadsheets and study, and you want the keyboard and trackpad without extra purchases. Buy the iPad (A16) if Apple Pencil coloring, handwritten notes, reading and video matter more than long typing sessions, and budget for the Pencil and possibly the Magic Keyboard Folio. For a step up on both sides, MacBook Air vs iPad Air covers the Air models.`;

const SPEC = "Specs";

export const MACBOOK_NEO_VS_IPAD_A16: EditorialComparison = buildEditorialComparison({
  slug: "macbook-neo-vs-ipad-a16",
  title: "MacBook Neo vs iPad (A16): Light Productivity Pick",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: NEO,
      slug: NEO,
      name: "MacBook Neo",
      shortDesc: "13-inch macOS laptop with an A18 Pro chip and a built-in keyboard; US $599 launch price (MSRP), per Apple Newsroom, March 2026.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Built-in Magic Keyboard and Multi-Touch trackpad (Apple)",
        "macOS on an A18 Pro chip with 8GB unified memory (Apple)",
        "Up to 16 hours video streaming, 36.5 Wh battery (Apple)",
        "256GB or 512GB storage",
      ],
      cons: [
        "No touchscreen and no Apple Pencil support",
        "1.23 kg, against 477 g for the iPad (A16) Wi-Fi model",
      ],
      bestFor: "Best for typing, documents and multi-window study",
    },
    {
      id: IPAD,
      slug: IPAD,
      name: "iPad (A16)",
      shortDesc: "11-inch tablet with an A16 chip and Apple Pencil (USB-C) support; US $349 launch price (MSRP), per Apple Newsroom, March 2025.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Apple Pencil (USB-C) and Apple Pencil (1st generation) support (Apple)",
        "477 g and 7 mm thick, Wi-Fi model (Apple)",
        "128GB, 256GB or 512GB storage",
        "12MP back camera and Touch ID (Apple)",
      ],
      cons: [
        "Keyboard is extra: Magic Keyboard Folio sold separately",
        "Up to 10 hours web or video on Wi-Fi, 28.93 Wh battery (Apple)",
      ],
      bestFor: "Best for touch, Apple Pencil drawing and portability",
    },
  ],
  keyDifferences: [
    {
      label: "Keyboard and trackpad",
      entityAValue: "Built in",
      entityBValue: "Magic Keyboard Folio, sold separately",
      winner: "a",
    },
    {
      label: "Apple Pencil",
      entityAValue: "Not supported",
      entityBValue: "Apple Pencil (USB-C), or 1st generation with adapter",
      winner: "b",
    },
    {
      label: "US launch price (MSRP)",
      entityAValue: "$599 launch price (MSRP), per Apple Newsroom, March 2026 (256GB)",
      entityBValue: "$349 launch price (MSRP), per Apple Newsroom, March 2025 (128GB); $677 with Folio and Pencil (USB-C) at launch prices",
      winner: "tie",
    },
    {
      label: "Battery (Apple ratings)",
      entityAValue: "Up to 16 h video streaming, 11 h wireless web",
      entityBValue: "Up to 10 h web or video on Wi-Fi",
      winner: "a",
    },
  ],
  attributes: [
    textAttr(
      "chip",
      "Chip",
      SPEC,
      NEO,
      IPAD,
      "A18 Pro: 6-core CPU (2 performance, 4 efficiency), 5-core GPU, 16-core Neural Engine",
      "A16: 5-core CPU, 4-core GPU, 16-core Neural Engine"
    ),
    textAttr("os", "Operating system", SPEC, NEO, IPAD, "macOS", "iPadOS"),
    textAttr(
      "display",
      "Display",
      SPEC,
      NEO,
      IPAD,
      "13.0-inch Liquid Retina, 2408 x 1506 at 219 ppi, 500 nits",
      "11-inch Liquid Retina Multi-Touch (10.86 inches as a rectangle), 2360 x 1640 at 264 ppi"
    ),
    textAttr(
      "storage",
      "Memory and storage",
      SPEC,
      NEO,
      IPAD,
      "8GB unified memory. 256GB or 512GB SSD",
      "128GB, 256GB or 512GB"
    ),
    textAttr(
      "input",
      "Keyboard and Pencil",
      SPEC,
      NEO,
      IPAD,
      "Built-in Magic Keyboard (Touch ID option) and Multi-Touch trackpad. No Apple Pencil",
      "Touchscreen. Apple Pencil (USB-C) or Apple Pencil (1st generation) with adapter. Magic Keyboard Folio sold separately"
    ),
    textAttr(
      "battery",
      "Battery",
      SPEC,
      NEO,
      IPAD,
      "36.5 Wh. Up to 16 hours video streaming, up to 11 hours wireless web",
      "28.93 Wh. Up to 10 hours web on Wi-Fi or video (Wi-Fi model)"
    ),
    textAttr(
      "ports",
      "Ports",
      SPEC,
      NEO,
      IPAD,
      "One USB 3 (USB-C), one USB 2 (USB-C), 3.5 mm headphone jack. One external display up to 4K at 60Hz",
      "One USB-C (USB 2.0) with DisplayPort output. One external display up to 4K at 60Hz"
    ),
    textAttr(
      "size",
      "Size and weight",
      SPEC,
      NEO,
      IPAD,
      "1.27 cm thick, 1.23 kg (2.7 pounds)",
      "7 mm thick, 477 g (Wi-Fi), 481 g (Wi-Fi + Cellular)",
      "b"
    ),
    textAttr(
      "price",
      "US launch price (MSRP)",
      SPEC,
      NEO,
      IPAD,
      "$599 launch price (MSRP), per Apple Newsroom, March 2026; $499 for education",
      "$349 launch price (MSRP), per Apple Newsroom, March 2025; $329 for education. Magic Keyboard Folio $249 launch price (MSRP), per Apple Newsroom, October 2022. Apple Pencil (USB-C) $79 launch price (MSRP), per Apple Newsroom, October 2023"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "macbook-air-vs-ipad-air",
      title: "MacBook Air vs iPad Air: Which Second Device?",
      category: "technology",
    },
    {
      slug: "macbook-air-m5-vs-macbook-pro-m5",
      title: "MacBook Air M5 vs MacBook Pro M5 for Video Editing",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "MacBook Neo for typing, documents and study with the keyboard built in. iPad (A16) for touch and Apple Pencil drawing, with the keyboard and Pencil sold separately.",
    keyFact:
      "US launch prices (MSRP): MacBook Neo $599 launch price (MSRP), per Apple Newsroom, March 2026. iPad (A16) $349 launch price (MSRP), per Apple Newsroom, March 2025. Magic Keyboard Folio $249 launch price (MSRP), per Apple Newsroom, October 2022. Apple Pencil (USB-C) $79 launch price (MSRP), per Apple Newsroom, October 2023. $677 for the iPad with both.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 22,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple MacBook Neo tech specs", url: NEO_SPECS },
      { name: "Apple Newsroom: MacBook Neo", url: NEO_NEWS },
      { name: "Apple iPad (A16) tech specs", url: IPAD_SPECS },
      { name: "Apple Newsroom: iPad Air with M3 and iPad with A16", url: IPAD_NEWS },
      { name: "Apple Newsroom: redesigned iPad and Magic Keyboard Folio", url: FOLIO_NEWS },
      { name: "Apple Newsroom: Apple Pencil (USB-C)", url: PENCIL_NEWS },
      { name: "Apple Store: buy MacBook Neo", url: NEO_STORE },
      { name: "Apple Store: buy iPad", url: IPAD_STORE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple MacBook Neo tech specs",
      url: NEO_SPECS,
      description:
        "A18 Pro: 6-core CPU (2 performance, 4 efficiency), 5-core GPU, 16-core Neural Engine. 8GB unified memory. 256GB or 512GB SSD. 13.0-inch Liquid Retina, 2408 x 1506 at 219 ppi, 500 nits. Up to 16 hours video streaming, 11 hours wireless web, 36.5 Wh, 20W adapter. One USB 3 and one USB 2 (USB-C), headphone jack. Magic Keyboard and Multi-Touch trackpad. 1.27 cm, 1.23 kg.",
    },
    {
      type: "external",
      label: "Apple Newsroom: MacBook Neo",
      url: NEO_NEWS,
      description: "March 2026. MacBook Neo launched at $599 (US) and $499 (US) for education.",
    },
    {
      type: "external",
      label: "Apple iPad (A16) tech specs",
      url: IPAD_SPECS,
      description:
        "A16: 5-core CPU, 4-core GPU, 16-core Neural Engine. 128GB, 256GB or 512GB. 11-inch Liquid Retina (10.86 inches as a rectangle), 2360 x 1640 at 264 ppi. 28.93 Wh, up to 10 hours web on Wi-Fi or video. 477 g (Wi-Fi), 7 mm. USB-C with USB 2.0. Apple Pencil (1st generation) pairs with the USB-C to Apple Pencil Adapter.",
    },
    {
      type: "external",
      label: "Apple Newsroom: iPad Air with M3 and iPad with A16",
      url: IPAD_NEWS,
      description:
        "March 4, 2025. iPad with A16 Wi-Fi launched at $349 (US), $329 for education; 128GB, 256GB and 512GB. Apple Pencil (USB-C) and Apple Pencil (1st generation) compatible with the new iPad.",
    },
    {
      type: "external",
      label: "Apple Newsroom: redesigned iPad and Magic Keyboard Folio",
      url: FOLIO_NEWS,
      description: "October 18, 2022. Magic Keyboard Folio launched at $249 (US).",
    },
    {
      type: "external",
      label: "Apple Newsroom: Apple Pencil (USB-C)",
      url: PENCIL_NEWS,
      description: "October 2023. Apple Pencil (USB-C) launched at $79 (US), $69 for education.",
    },
    {
      type: "external",
      label: "See vendor page for current price: MacBook Neo (Apple Store)",
      url: NEO_STORE,
      description: "Apple Store page for MacBook Neo configurations and current US prices.",
    },
    {
      type: "external",
      label: "See vendor page for current price: iPad (A16) (Apple Store)",
      url: IPAD_STORE,
      description: "Apple Store page for iPad (A16) configurations, accessories and current US prices.",
    },
  ],
  metaTitle: "MacBook Neo vs iPad (A16) | A Versus B",
});
