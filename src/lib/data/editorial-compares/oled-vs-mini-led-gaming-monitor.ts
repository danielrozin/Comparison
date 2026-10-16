import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-244 — OLED 240Hz vs Mini-LED 320Hz gaming monitor (panel-technology fork).
 * Figures read on 16 October 2026 from VESA's DisplayHDR CTS 1.2 performance
 * criteria summary and VESA's ClearMR programme page. Frame times are
 * arithmetic (1000 / refresh rate). No response-time or nits ranges from
 * vendor education pages, no review scores, no prices, no model ranking, no
 * winner. ViewSonic, PC Gamer and Reddit material from the brief dropped
 * (house rule: official sources only, no benchmarks). No Acer part numbers.
 */

const A = "oled-240hz-monitor";
const B = "mini-led-320hz-monitor";

const VESA_DISPLAYHDR = "https://displayhdr.org/performance-criteria/";
const VESA_CLEARMR = "https://clearmr.org/";

const SOURCE_DATE = "2026-10-16";
const PUBLISHED = "2026-10-16T00:00:00Z";

const SHORT_ANSWER =
  "Choose a 240Hz OLED gaming monitor if you play in a dim or dark room and care most about black levels, contrast and motion clarity: each OLED pixel makes its own light and can switch fully off. Choose a 320Hz Mini-LED monitor if you play in a bright room, want the highest sustained HDR brightness, or leave static HUDs and toolbars on screen for very long sessions, because Mini-LED is an LCD and does not carry OLED's burn-in risk. The jump from 240Hz to 320Hz only helps when your graphics card can deliver frame rates over 240. Neither is right for everyone, so compare the exact models you are considering.";

const FAQS = [
  {
    question: "Is OLED better than Mini-LED for gaming?",
    answer:
      "For contrast, black levels and motion in a room you can dim, OLED usually suits gaming better, because each pixel lights itself and can turn fully off. For a bright room and the highest sustained HDR brightness without burn-in worry, Mini-LED is often the better fit.",
  },
  {
    question: "Is a 320Hz Mini-LED monitor better than a 240Hz OLED?",
    answer:
      "Not automatically. At 320Hz a new frame can appear about every 3.1 ms, against about 4.2 ms at 240Hz, but you only see that if your graphics card delivers more than 240 frames per second in the game. Pixel response and black levels also shape how clear motion looks, so the higher number alone does not decide it.",
  },
  {
    question: "Which is better for fighting games like Guilty Gear Strive?",
    answer:
      "Fighting games usually run at a fixed frame rate, often 60, so a 320Hz panel adds little. Low input lag and clean motion matter more. Many players lean to OLED for fighters, but check input lag on the exact model you are buying.",
  },
  {
    question: "Is OLED burn-in a dealbreaker for MMOs?",
    answer:
      "It is a real risk if the same HUD, hotbars or taskbar stay on screen for thousands of hours. OLED monitors include pixel-care features, and some warranties cover burn-in, so read the warranty terms. A Mini-LED monitor is an LCD and does not have OLED-style burn-in.",
  },
  {
    question: "Which is brighter, OLED or Mini-LED?",
    answer:
      "Mini-LED monitors generally sustain higher full-screen brightness. In VESA's DisplayHDR criteria, the DisplayHDR 1000 tier requires 600 cd/m² for a long-duration full-screen test, while DisplayHDR True Black 1000, the tier family used for OLED-style displays, requires 500 cd/m². OLED still looks punchy in a dark room because its blacks are so deep.",
  },
  {
    question: "What should I check before buying an Acer Nitro OLED or Mini-LED monitor?",
    answer:
      "Look up the exact model's specs: HDR certification tier, ClearMR rating if it has one, glossy or matte coating, text clarity, connections, and warranty terms including burn-in for OLED. Also check whether your graphics card can reach the monitor's refresh rate in your games, and keep the return window in mind.",
  },
];

const VERDICT = `Best for dark-room gaming, contrast and motion clarity: a 240Hz OLED monitor. Each pixel makes its own light and can turn fully off, and VESA's DisplayHDR True Black tiers allow a black level of no more than 0.0005 cd/m².

Best for bright rooms, sustained HDR brightness and static HUDs: a 320Hz Mini-LED monitor. It is an LCD with a dense local-dimming backlight, without OLED-style burn-in.

Neither is right for everyone. Compare the exact models you are considering.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- OLED pixels make their own light and can switch fully off, so blacks are true black.
- Mini-LED is an LCD whose backlight is split into many small dimming zones, which allows high brightness but can show blooming around bright objects on dark backgrounds.
- 320Hz shows a new frame about every 3.1 ms and 240Hz about every 4.2 ms, but only if your graphics card keeps up.
- OLED can develop burn-in from static images over very long use. Mini-LED does not have that kind of burn-in.
- VESA DisplayHDR True Black tiers target OLED-style displays; standard DisplayHDR 1000 and 1400 require 2D local dimming, which Mini-LED provides.

How the two panel types work

An OLED monitor has no backlight. Every pixel produces its own light and can switch off completely, which gives true black next to bright detail with no glow. A Mini-LED monitor is an LCD: a liquid-crystal layer filters light from a backlight made of many small LEDs grouped into local-dimming zones. More zones mean finer control, but a zone is still larger than a pixel, so bright objects on dark backgrounds can show a halo, often called blooming.

Refresh rate: 240Hz vs 320Hz

Refresh rate is how many times per second the monitor can show a new frame. At 240Hz that is about every 4.2 ms; at 320Hz about every 3.1 ms. The higher rate only helps when the game runs at more than 240 frames per second, which usually means lighter competitive shooters and a strong graphics card. Fighting games often run at a fixed 60, and many MMOs and story games will not reach 240 on most systems. How quickly pixels change also affects motion: OLED pixels switch very quickly, while LCD pixels take longer and can leave a slight trail.

Measuring motion blur: VESA ClearMR

VESA's ClearMR certification grades motion blur with a Clear Motion Ratio, the ratio of clear pixels to blurry pixels, and applies to both LCD and OLED displays. Tiers run from ClearMR 3000 to ClearMR 21000, and a higher tier means less blur. If both monitors you are considering carry a ClearMR rating, it is a fairer motion comparison than refresh rate alone.

HDR and brightness: VESA DisplayHDR tiers

VESA's DisplayHDR CTS 1.2 has two families. Standard tiers run from DisplayHDR 400 to DisplayHDR 1400; DisplayHDR 1000 and higher require 2D local dimming, with minimum static contrast of 30,000:1 at 1000 and 50,000:1 at 1400. DisplayHDR True Black tiers, from True Black 400 to True Black 1400, require a black level of no more than 0.0005 cd/m² and a rise from black to peak in no more than 2 frames, against 8 frames for standard tiers. For long-duration full-screen brightness, DisplayHDR 1000 requires 600 cd/m² and DisplayHDR 1400 requires 900 cd/m², while True Black 400 requires 250 cd/m² and True Black 1000 requires 500 cd/m². In practice, Mini-LED is the stronger choice for bright full-screen HDR, and OLED for deep blacks and contrast.

Burn-in and static HUDs

OLED pixels age with use, and if the same bright elements stay in one place for very long periods, such as MMO hotbars, a minimap or a taskbar, they can leave a faint permanent image. OLED monitors include pixel-refresh and screen-shift features to reduce the risk, and warranty terms vary by brand. Mini-LED monitors are LCDs and do not have this OLED-style burn-in. Hiding or moving HUD elements, using a dark taskbar that auto-hides and turning the screen off when idle all help on OLED.

Which suits which games

- Fighting games and casual team shooters: OLED, for contrast and clean motion. The extra refresh of 320Hz rarely comes into play.
- Fast competitive shooters at very high frame rates: either. A 320Hz Mini-LED helps only if your graphics card regularly exceeds 240 frames per second.
- MMOs with fixed UI for long sessions: Mini-LED if you want no burn-in worry, or OLED with care and a burn-in warranty.
- Bright living rooms or desks by a window: Mini-LED for sustained brightness.
- Dark-room HDR and story games: OLED for black levels.

Buying checklist

- Check the HDR certification tier on the exact model, DisplayHDR or DisplayHDR True Black.
- Check for a ClearMR rating if motion clarity matters.
- Glossy or matte coating, text clarity and subpixel layout for desktop use.
- Warranty terms, including whether OLED burn-in is covered.
- Whether your graphics card can reach the refresh rate in the games you play.
- The return window, so you can test it in your own room.

RX 9060 XT vs RX 9070 and RX 9070 XT vs RTX 5080 cover graphics cards for driving a high-refresh monitor.`;

const SPEC = "Specs";

const BUILT = buildEditorialComparison({
  slug: "oled-vs-mini-led-gaming-monitor",
  title: "OLED 240Hz vs Mini-LED 320Hz: Which Gaming Monitor to Buy",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "OLED 240Hz monitor",
      shortDesc: "Self-emissive gaming monitor: every pixel makes its own light and can turn fully off.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "True black: pixels switch fully off",
        "No local-dimming blooming",
        "Very quick pixel switching for clean motion",
      ],
      cons: [
        "Burn-in risk from static images over very long use",
        "Lower sustained full-screen brightness than high-tier Mini-LED",
      ],
      bestFor: "Dark-room gaming, contrast and motion clarity",
    },
    {
      id: B,
      slug: B,
      name: "Mini-LED 320Hz monitor",
      shortDesc: "LCD gaming monitor with a backlight of many small LEDs in local-dimming zones.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "High sustained full-screen HDR brightness",
        "No OLED-style burn-in",
        "320Hz: a new frame about every 3.1 ms",
      ],
      cons: [
        "Blooming around bright objects on dark backgrounds",
        "Blacks are not fully off like OLED",
      ],
      bestFor: "Bright rooms, sustained HDR brightness and static HUDs",
    },
  ],
  keyDifferences: [
    {
      label: "Black level",
      entityAValue: "Pixels switch fully off",
      entityBValue: "Set by local-dimming zones; can bloom",
      winner: "a",
    },
    {
      label: "Sustained brightness",
      entityAValue: "Lower full-screen brightness",
      entityBValue: "Higher full-screen brightness",
      winner: "b",
    },
    {
      label: "Refresh rate",
      entityAValue: "240Hz (about 4.2 ms per frame)",
      entityBValue: "320Hz (about 3.1 ms per frame)",
    },
    {
      label: "Burn-in",
      entityAValue: "Possible with static images over long use",
      entityBValue: "No OLED-style burn-in",
      winner: "b",
    },
  ],
  attributes: [
    textAttr("tech", "Panel technology", SPEC, A, B, "OLED: self-emissive pixels, no backlight", "LCD with a Mini-LED local-dimming backlight"),
    textAttr("black", "Black level", SPEC, A, B, "True black; DisplayHDR True Black tiers allow no more than 0.0005 cd/m²", "Depends on dimming zones; blooming possible", "a"),
    textAttr("hdr", "HDR certification family", SPEC, A, B, "DisplayHDR True Black 400 to True Black 1400", "DisplayHDR 1000 and 1400 require 2D local dimming"),
    textAttr("brightness", "Long-duration full-screen minimum (VESA tier)", SPEC, A, B, "True Black 400: 250 cd/m². True Black 1000: 500 cd/m²", "DisplayHDR 1000: 600 cd/m². DisplayHDR 1400: 900 cd/m²", "b"),
    textAttr("refresh", "Refresh rate", SPEC, A, B, "240Hz, about 4.2 ms per frame", "320Hz, about 3.1 ms per frame"),
    textAttr("burnin", "Burn-in", SPEC, A, B, "Possible with static images over very long use", "No OLED-style burn-in", "b"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "rx-9060-xt-vs-rx-9070", title: "RX 9060 XT vs RX 9070", category: "technology" },
    { slug: "rx-9070-xt-vs-rtx-5080", title: "RX 9070 XT vs RTX 5080", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "OLED 240Hz for true black and motion clarity in a dim room. Mini-LED 320Hz for sustained brightness in a bright room and no OLED-style burn-in.",
    keyFact:
      "OLED pixels can switch fully off. Mini-LED is an LCD with a local-dimming backlight, and VESA DisplayHDR 1000 and higher require 2D local dimming.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 14,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "VESA DisplayHDR performance criteria (CTS 1.2)", url: VESA_DISPLAYHDR },
      { name: "VESA ClearMR", url: VESA_CLEARMR },
    ],
  },
  resources: [
    {
      type: "external",
      label: "VESA DisplayHDR performance criteria (CTS 1.2)",
      url: VESA_DISPLAYHDR,
      description: "DisplayHDR 400 to 1400 and True Black 400 to 1400: luminance minimums, 0.0005 cd/m² True Black black level, 2D local dimming at 1000 and higher, rise time in frames.",
    },
    {
      type: "external",
      label: "VESA ClearMR",
      url: VESA_CLEARMR,
      description: "Motion-blur certification for LCD and OLED displays using Clear Motion Ratio, with tiers from ClearMR 3000 to ClearMR 21000.",
    },
  ],
  metaTitle: "OLED vs Mini-LED Gaming Monitor | A Versus B",
});

BUILT.metadata.metaDescription =
  "OLED 240Hz vs Mini-LED 320Hz gaming monitor: true black and motion vs brightness and no burn-in, what the extra 80Hz needs, and VESA HDR tiers to check.";

export const OLED_VS_MINI_LED_GAMING_MONITOR: EditorialComparison = BUILT;
