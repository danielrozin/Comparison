import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-395 — VA vs IPS LCD panels.
 * Opened 8 November 2026 (Asia/Jerusalem):
 * TechSpot, Tim Schiesser, "Display Tech Comparison: IPS vs. VA vs. TN vs.
 * QD-OLED vs. WOLED" (9 December 2024).
 * Display Ninja, "IPS vs TN vs VA" (schema dateModified 29 December 2025),
 * used only for the IPS-glow description. Its contrast ranges, 178° specs,
 * and advertised 1 ms claims are not copied.
 * Reddit returned HTTP 403, so there is no community block and no G7/G8/Neo G9
 * mention. No winner. No prices. No 2026 market census.
 */

const PUBLISHED = "2026-11-08T00:00:00Z";
const SOURCE_DATE = "2026-11-08";

const VA = "va";
const IPS = "ips";

const TECHSPOT = "https://www.techspot.com/article/2929-display-tech-lcd-oled/";
const DISPLAY_NINJA = "https://www.displayninja.com/ips-vs-tn-vs-va/";

const SHORT_ANSWER = `VA and IPS are two ways an LCD arranges its liquid crystals, and neither type is the right monitor for every room or every game. In TechSpot's 9 December 2024 tested sample, VA panels averaged higher native contrast than IPS panels, and the non-Samsung VA response-time average was slower than the IPS grey-to-grey average, so read a measured review of the exact model.`;

const EXPERT_ANALYSIS = `VA and IPS are two ways an LCD arranges its liquid crystals, and neither type is the right monitor for every room or every game. In TechSpot's 9 December 2024 tested sample, VA panels averaged higher native contrast than IPS panels, and the non-Samsung VA response-time average was slower than the IPS grey-to-grey average, so read a measured review of the exact model.

Key takeaways. The numbers here are TechSpot's tested sample from 9 December 2024, not a 2026 census of every VA or IPS monitor. In that sample VA contrast averaged 3,238:1 and IPS contrast averaged 1,088:1, and TechSpot did not state how many panels were in either average. Non-Samsung VA response time averaged 10.8 ms, with many results from 8 to 15 ms and some cases at 7 ms. IPS grey-to-grey response averaged 6.9 ms across 80 or more IPS panels. The strongest Samsung-tuned VA examples reached about 3 to 4 ms, and TechSpot said not every Samsung VA is tuned that way. An advertised 1 ms spec is not these measurements.

The comparison table is captioned for VA vs IPS and grouped under the label TechSpot tested sample, 9 December 2024. Numeric rows are that sample only. The viewing-angle row is TechSpot's description, not a degree measurement. Room and game suggestions later in this write-up are editorial judgment, not a measured purchase optimum.

IPS and VA change how the liquid crystals move. They do not decide whether the monitor is Mini-LED or OLED. TechSpot describes IPS as crystals that lie parallel to the panel and rotate, and VA as crystals that stand vertically and tilt. The backlight is a separate layer, which is why TechSpot says brightness need not differ much by crystal type. Mini-LED is a zoned backlight on an LCD, so a Mini-LED monitor can still be VA or IPS. OLED is a different family.

On native contrast, that 9 December 2024 sample favored VA. The VA average was 3,238:1 and the IPS average was 1,088:1. About 29 percent of the IPS models TechSpot had tested were under 1,000:1, and about 21 percent were over 1,200:1. TechSpot wrote that, among panels they had seen, VA had the strongest contrast inside the LCD family, and that even the weakest VA they had seen beat the strongest IPS LCD they had seen on contrast. That is their experience as of that date. It is not a guarantee for every monitor on sale in 2026, and they did not state the panel count behind the two averages. At a 200-nit calibration they typically saw VA black around 0.067 nits and IPS black at an average of 0.19 nits. Display Ninja describes IPS glow as light around the corners in dark scenes in a dark room, from extra light passing through the panel. That sentence is a description on a guide whose schema date is 29 December 2025, not a nit measurement.

Black smearing is still a model question. TechSpot describes dark-level smearing on VA: transitions that involve dark greys are especially slow, so fast motion in dark scenes can leave a trail. For non-Samsung VA, response time averaged 10.8 ms, the usual span was 8 to 15 ms, and some cases reached 7 ms at the highest refresh rates. TechSpot did not state how many panels were in that 10.8 ms average. Their cumulative-deviation score, which tracks how far a transition is from an instant change, averaged 844 on those non-Samsung VA panels and 595 on IPS. TechSpot called the IPS average 42 percent better on that score. Most modern IPS results in the same write-up fell between 500 and 600. IPS grey-to-grey response averaged 6.9 ms across 80 or more panels, with a general span of 4 to 10 ms, and newer panels often landed between 4 and 6.5 ms. The strongest Samsung-tuned VA examples reached about 3 to 4 ms, with cumulative deviation around 400. TechSpot said the fastest IPS panels can also reach that range, that not every Samsung VA is tuned this well, and that IPS varies less from its fastest to its slowest examples than VA does. Do not read a brand name, or an advertised 1 ms box spec, as a measured dark-transition time.

Viewing angles favor IPS in TechSpot's 9 December 2024 description, with no degree numbers for either type. VA shifts in contrast or gamma off-center. Its comfortable area is still wider than TN, which is a third LCD type and not the subject here. Most IPS panels have a wider comfortable area than VA, with less gamma, color, and brightness shift at extreme angles. IPS quality still varies by the company that made the panel. Color accuracy, TechSpot says, depends on the monitor maker's tuning rather than on VA versus IPS. Color gamut is mostly the backlight, so a VA panel and an IPS panel can use the same kind of backlight.

Editorial judgment, not a measured purchase optimum: a dim room and films or slower games are where the deeper VA blacks in that sample are easiest to notice. Fast competitive games are where a slow dark transition is easiest to notice, so IPS is the more cautious starting point, and you still check the model. People sitting well off to the side are the case for IPS viewing angles. None of this ranks the monitors you can buy in 2026.

Before you buy, panel type is only the first filter. On the exact model, look for a measured response-time chart that includes dark-grey transitions, and for overshoot, a bright trail, at the overdrive setting you would actually use. TechSpot describes dark-level smearing and the cumulative-deviation score. It does not publish an overshoot ranking of VA against IPS. Also read that model's contrast, how it looks from your seat, and whether a Mini-LED backlight is added on top of the VA or IPS layer. Refresh rate and resolution are separate choices. Compare the current price of the two monitors in front of you. There is no price list in this write-up.

OLED and Mini-LED are a different choice, not a shortcut around the model review. Mini-LED is a zoned backlight on an LCD, so the crystals can still be VA or IPS. OLED is not an LCD. Those topics are /compare/oled-vs-mini-led-gaming-monitor, /compare/qd-oled-vs-woled, and /compare/mini-led-vs-qled. SDR brightness in the same TechSpot sample averaged 410 nits for IPS and 394 nits for VA. TechSpot did not state how many panels were in those two averages. TechSpot's over 150 LCDs line is the combined LCD brightness average, 402 nits, not a VA-only count.`;

const FAQS = [
  {
    question: "Is VA worse than IPS for gaming?",
    answer:
      "Not for every game, and not for every model. In TechSpot's 9 December 2024 sample, the non-Samsung VA response-time average was 10.8 ms and the IPS grey-to-grey average was 6.9 ms across 80 or more IPS panels, so slow dark transitions matter more in fast competitive games. VA contrast in that sample averaged 3,238:1 against 1,088:1 for IPS, which can matter more for slower or darker games. Editorial judgment, not a measured ranking: start with IPS for fast competitive play, then read a measured review of the exact model. The strongest Samsung-tuned VA examples reached about 3 to 4 ms, the fastest IPS panels can reach that range too, and not every Samsung VA is in the fast group.",
  },
  {
    question: "Is VA black smearing still a problem?",
    answer:
      "It still depends on the model. TechSpot, on 9 December 2024, described dark-level smearing on VA: transitions that involve dark greys are especially slow. Non-Samsung VA response time in that sample averaged 10.8 ms, often from 8 to 15 ms, with some cases at 7 ms, and TechSpot did not state how many panels were in that average. The strongest Samsung-tuned examples reached about 3 to 4 ms, and not every Samsung VA is in that group. Look up a measured response-time chart for the exact monitor, including dark transitions and overshoot at the overdrive setting you would use. These figures are not a 2026 guarantee.",
  },
  {
    question: "Which has better contrast, VA or IPS?",
    answer:
      "In TechSpot's 9 December 2024 tested sample, VA averaged 3,238:1 and IPS averaged 1,088:1. About 29 percent of the IPS models in that testing were under 1,000:1, and about 21 percent were over 1,200:1. TechSpot did not state how many VA or IPS panels were in the contrast averages. TechSpot also wrote that, among panels they had seen, even the weakest VA beat the strongest IPS LCD on contrast. That is their sample as of that date, not a promise for every monitor on sale in 2026. With a 200-nit calibration, they typically saw VA black around 0.067 nits and IPS black at an average of 0.19 nits.",
  },
  {
    question: "Is VA or IPS better for movies?",
    answer:
      "Editorial judgment, not a measured optimum: films in a dim room are where the deeper VA blacks in TechSpot's 9 December 2024 sample are easiest to notice. At a 200-nit calibration that sample typically put VA black around 0.067 nits and IPS black at an average of 0.19 nits. Display Ninja describes IPS glow as light around the corners during dark scenes in a dark room. That is a description on a guide whose schema date is 29 December 2025, not a black-level measurement. If people sit off to the side, IPS viewing angles were the wider comfortable area in TechSpot's description.",
  },
  {
    question: "Which has better viewing angles, VA or IPS?",
    answer:
      "In TechSpot's description, published 9 December 2024, most IPS panels have a wider comfortable viewing area than VA, with less gamma, color, and brightness shift at extreme angles. VA still shifts in contrast or gamma off-center. IPS quality still varies by panel maker. TechSpot did not publish degree measurements for VA or IPS on 9 December 2024.",
  },
  {
    question: "Should I skip VA and IPS for OLED or Mini-LED?",
    answer:
      "Only when you want a different technology, not a different answer to VA versus IPS. Mini-LED is a zoned backlight on an LCD, so the panel can still be VA or IPS. OLED is not an LCD. Compare OLED vs Mini-LED gaming monitors, QD-OLED vs WOLED, and Mini-LED vs QLED for those choices. This write-up does not rank those technologies.",
  },
];

const VERDICT = `Editorial judgment, not a measured purchase optimum. Choose VA if you mostly watch films or play slower games in a dim room and a review of that exact model shows the contrast you want. TechSpot's 9 December 2024 sample averaged 3,238:1 for VA and 1,088:1 for IPS, and those averages are not a 2026 guarantee.

Choose IPS if you play fast competitive games or people sit off-center. In that sample the non-Samsung VA response-time average was 10.8 ms and the IPS grey-to-grey average was 6.9 ms across 80 or more panels, while the strongest Samsung-tuned VA examples and the fastest IPS panels both reached about 3 to 4 ms.

Read a measured review of the exact model, including dark transitions and overshoot, before you treat either crystal type as the decision.`;

const SAMPLE = "TechSpot tested sample, 9 December 2024";

const BUILT = buildEditorialComparison({
  slug: "va-vs-ips",
  title: "VA vs IPS for Gaming: Contrast, Dark Transitions, and Viewing Angles",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: VA,
      slug: VA,
      name: "VA",
      shortDesc: "LCD crystals that stand vertically and tilt to control the backlight.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Contrast averaged 3,238:1 in TechSpot's 9 December 2024 sample. The panel count was not stated",
        "Black around 0.067 nits at a 200-nit calibration in that sample",
        "The strongest Samsung-tuned examples reached about 3 to 4 ms. Not every Samsung VA",
      ],
      cons: [
        "Non-Samsung response time averaged 10.8 ms, often 8 to 15 ms, with dark-level smearing. The count was not stated",
        "Contrast or gamma shifts off-center, in TechSpot's 9 December 2024 description",
      ],
      bestFor:
        "Editorial judgment: dim-room films and slower games, after a measured review of the exact model.",
    },
    {
      id: IPS,
      slug: IPS,
      name: "IPS",
      shortDesc: "LCD crystals that lie parallel to the panel and rotate to control the backlight.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Grey-to-grey average 6.9 ms across 80 or more IPS panels in the 9 December 2024 sample",
        "Wider comfortable viewing area than VA in TechSpot's description, with less shift at extreme angles",
        "The fastest IPS panels can also reach the 3 to 4 ms range of the strongest Samsung-tuned VA examples",
      ],
      cons: [
        "Contrast averaged 1,088:1 in that sample. About 29 percent of tested IPS models were under 1,000:1",
        "Black averaged 0.19 nits at the same 200-nit calibration. Display Ninja describes corner glow in dark scenes",
      ],
      bestFor:
        "Editorial judgment: fast competitive games and off-center seats, after a measured review of the exact model.",
    },
  ],
  keyDifferences: [
    {
      label: "Native contrast, 9 December 2024 sample",
      entityAValue: "Average 3,238:1. Panel count not stated",
      entityBValue: "Average 1,088:1. Panel count not stated",
      winner: "tie",
    },
    {
      label: "Black level at 200 nits",
      entityAValue: "Around 0.067 nits in that calibration",
      entityBValue: "Average 0.19 nits in that calibration",
      winner: "tie",
    },
    {
      label: "Dark transitions",
      entityAValue: "Non-Samsung average 10.8 ms. Often 8 to 15 ms. Some cases 7 ms. Count not stated",
      entityBValue: "6.9 ms grey-to-grey average across 80 or more panels. Newer panels often 4 to 6.5 ms",
      winner: "tie",
    },
    {
      label: "Tuned fast examples",
      entityAValue: "Strongest Samsung-tuned examples about 3 to 4 ms. Not every Samsung VA",
      entityBValue: "Fastest IPS panels can also reach that range. The sample span is often 4 to 10 ms",
      winner: "tie",
    },
    {
      label: "Viewing angles",
      entityAValue: "Contrast or gamma shift off-center. No degree measurement from TechSpot",
      entityBValue: "Wider comfortable area in TechSpot's description. Quality still varies by maker",
      winner: "tie",
    },
    {
      label: "Backlight versus crystal type",
      entityAValue: "Mini-LED is a backlight, so it can sit on VA. SDR brightness average 394 nits. Count not stated",
      entityBValue: "Mini-LED can sit on IPS too. SDR brightness average 410 nits. Count not stated",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "contrast",
      "Native contrast average",
      SAMPLE,
      VA,
      IPS,
      "3,238:1. Panel count not stated",
      "1,088:1. About 29 percent of tested IPS models were under 1,000:1, and about 21 percent were over 1,200:1",
    ),
    textAttr(
      "black-level",
      "Black level at 200 nits",
      SAMPLE,
      VA,
      IPS,
      "Around 0.067 nits",
      "Average 0.19 nits",
    ),
    textAttr(
      "response",
      "Response time",
      SAMPLE,
      VA,
      IPS,
      "Non-Samsung average 10.8 ms. Often 8 to 15 ms. Some cases 7 ms at the highest refresh rates. Count not stated",
      "Grey-to-grey average 6.9 ms across 80 or more panels. General span 4 to 10 ms. Newer panels often 4 to 6.5 ms",
    ),
    textAttr(
      "deviation",
      "Cumulative deviation",
      SAMPLE,
      VA,
      IPS,
      "Non-Samsung average 844. Strongest Samsung-tuned examples around 400",
      "Average 595. TechSpot called this 42 percent better than the non-Samsung VA average. Most modern IPS results in that sample were 500 to 600",
    ),
    textAttr(
      "samsung-tuned",
      "Fastest tuned examples",
      SAMPLE,
      VA,
      IPS,
      "Strongest Samsung-tuned examples about 3 to 4 ms. Not every Samsung VA. An advertised 1 ms spec is not this measurement",
      "The fastest IPS panels can also reach about 3 to 4 ms. IPS varies less than VA. An advertised 1 ms spec is not this measurement",
    ),
    textAttr(
      "angles",
      "Viewing angles",
      SAMPLE,
      VA,
      IPS,
      "Contrast or gamma shift off-center. No degree figure from TechSpot on 9 December 2024",
      "Wider comfortable area, with less gamma, color, and brightness shift at extreme angles. Quality varies by maker. No degree figure from TechSpot",
    ),
    textAttr(
      "brightness",
      "SDR brightness average",
      SAMPLE,
      VA,
      IPS,
      "394 nits. Count not stated. The backlight, not the crystal type, sets brightness",
      "410 nits. Count not stated. Mini-LED is a zoned backlight that can sit on either crystal type",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "oled-vs-mini-led-gaming-monitor",
      title: "OLED vs Mini-LED Gaming Monitor",
      category: "technology",
    },
    {
      slug: "qd-oled-vs-woled",
      title: "QD-OLED vs WOLED: Which Gaming Monitor Panel",
      category: "technology",
    },
    { slug: "mini-led-vs-qled", title: "Mini-LED vs QLED", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Contrast and dark transitions pull in different directions. Read a measured review of the exact model. The 9 December 2024 sample is not a 2026 ranking.",
    keyFact:
      "TechSpot, 9 December 2024 tested sample: VA contrast average 3,238:1, IPS 1,088:1. Non-Samsung VA response average 10.8 ms. IPS grey-to-grey average 6.9 ms across 80 or more panels. Not a 2026 census.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      {
        name: "TechSpot: IPS vs VA vs TN vs QD-OLED vs WOLED (Tim Schiesser, 9 December 2024)",
        url: TECHSPOT,
      },
      {
        name: "Display Ninja: IPS vs TN vs VA (schema date 29 December 2025, IPS glow description only)",
        url: DISPLAY_NINJA,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "TechSpot: display tech comparison (Tim Schiesser, 9 December 2024)",
      url: TECHSPOT,
      description:
        "Tim Schiesser, 9 December 2024. Tested-sample averages, not a 2026 census. VA contrast 3,238:1 and IPS contrast 1,088:1, panel counts not stated. About 29 percent of tested IPS models under 1,000:1 and about 21 percent over 1,200:1. Black at a 200-nit calibration around 0.067 nits on VA and 0.19 nits average on IPS. Non-Samsung VA response average 10.8 ms, often 8 to 15 ms, some cases 7 ms, count not stated, cumulative deviation 844. IPS grey-to-grey average 6.9 ms across 80 or more panels, span often 4 to 10 ms, newer panels often 4 to 6.5 ms, cumulative deviation 595, which TechSpot called 42 percent better. Strongest Samsung-tuned VA examples about 3 to 4 ms and deviation around 400, and not every Samsung VA. SDR brightness averages 410 nits IPS and 394 nits VA, counts not stated. The over-150 LCD line is the combined 402-nit LCD average.",
    },
    {
      type: "external",
      label: "Display Ninja: IPS vs TN vs VA (schema date 29 December 2025)",
      url: DISPLAY_NINJA,
      description:
        "Guide whose schema dateModified is 29 December 2025. Used for one description: IPS glow is light around the corners in dark scenes in a dark room. Contrast ranges, specified viewing angles, and advertised response times on that guide are not used here.",
    },
  ],
  metaTitle: "VA vs IPS: Gaming Contrast and Smear | A Versus B",
});

BUILT.metadata.metaDescription =
  "VA and IPS are LCD crystal types. TechSpot's 9 December 2024 sample: higher VA contrast, slower non-Samsung VA dark transitions. Check the exact model.";

export const VA_VS_IPS: EditorialComparison = BUILT;
