import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-371 — QD-OLED vs WOLED monitor panels.
 * Opened 3 November 2026 (Asia/Jerusalem):
 * TechSpot, Tim Schiesser, "4K QD-OLED vs. 4K WOLED" (13 April 2024);
 * TFTCentral grey banding (13 February 2026);
 * TFTCentral RGB-stripe panels (7 August 2026; first published 10 July 2026);
 * ASUS ROG panel guide (25 August 2026), used only as a vendor overview.
 * Reddit returned HTTP 403, so there is no community-opinion block.
 * No winner. ASUS nit ranges are not copied. No burn-in winner.
 */

const PUBLISHED = "2026-11-03T00:00:00Z";
const SOURCE_DATE = "2026-11-03";

const QD = "qd-oled";
const WOLED = "woled";

const TECHSPOT = "https://www.techspot.com/article/2824-qd-oled-vs-woled/";
const BANDING =
  "https://tftcentral.co.uk/articles/exploring-the-grey-banding-issue-affecting-some-tandem-woled-panels";
const RGB_STRIPE =
  "https://tftcentral.co.uk/articles/oled-rgb-stripe-panels-explained-should-you-wait";
const ASUS =
  "https://rog.asus.com/articles/gaming-monitors/qd-oled-vs-tandem-oled-vs-rgb-stripe-oled-the-complete-gaming-monitor-panel-guide/";
const OLED_ENTITY = "https://www.aversusb.net/entity/oled-organic-light-emitting-diode";

const SHORT_ANSWER = `Choose QD-OLED if you mostly use the monitor in a dim or dark room and want vivid, saturated color. Choose WOLED if the room is bright or lights or windows face the screen, because WOLED panels keep blacks looking black in ambient light better. In TechSpot's 13 April 2024 4K testing, response times were in the 0.3 ms range for both, and in a dark room both produced the same deep blacks. Price and the exact model often decide it.`;

const EXPERT_ANALYSIS = `Choose QD-OLED if you mostly use the monitor in a dim or dark room and want vivid, saturated color. Choose WOLED if the room is bright or lights or windows face the screen, because WOLED panels keep blacks looking black in ambient light better. Neither panel type is the right one for every room.

Key takeaways. TechSpot's 13 April 2024 4K testing found response times in the 0.3 ms range on both, SDR brightness of 250 nits on both, and the same deep blacks in a dark room. In that same testing, QD-OLED color volume was around 73 percent Rec. 2020 and WOLED color volume was 34 percent. WOLED reflected less ambient light, so its blacks stayed deeper when the room was bright. TFTCentral's 7 August 2026 RGB-stripe note says newer stripe layouts improve text. TFTCentral's 13 February 2026 note says some tandem WOLED samples show grey banding on very dark greys. TechSpot had no evidence that one type is more resilient than the other. Check reviews of the exact model.

Pick by your room, then by the job. In a dark or dim room, TechSpot found the blacks match, so QD-OLED's color advantage is the part that stands out. If lights or a window face the screen, TechSpot found WOLED keeps blacks blacker because its filters reflect less ambient light, while QD-OLED blacks can look raised and red-grey. ASUS ROG's 25 August 2026 guide, a vendor article, gives the same room split: QD-OLED when you want color in a dark room, WOLED when the room is well lit. ASUS also describes a TrueBlack Glossy film on some WOLED monitors and a BlackShield film on some QD-OLED monitors. Those films are model features, not a rule for every panel. In April 2024 the QD-OLED monitors TechSpot tested were glossy and the 4K WOLED monitors were matte. A 2026 monitor can use a different coating, so read that model's review.

How each works. Both are OLED: each pixel makes its own light and can switch off. TechSpot describes WOLED as a white OLED layer passing through red, green, and blue filters, plus a fourth subpixel with no filter so white light comes through. That white subpixel is the W in WOLED. QD-OLED uses a blue OLED layer and a quantum-dot layer. The blue subpixel passes the blue light. The red and green subpixels use the quantum dots to change the wavelength. QD-OLED has three subpixels, set in a triangle with green on top and red and blue below.

Generation decoder. Treat the name on the box as a generation, not as a score.

Classic WOLED. White OLED light, color filters, and a white subpixel. TechSpot's April 2024 4K panels used an RGWB stripe. TFTCentral says earlier WOLED panels used red-white-blue-green (RWBG), and that from around 2024 LG Display switched the order to red-green-white-blue (RGWB), which improved text. The white subpixel is still there.

QD-OLED. Blue OLED plus quantum dots, triangular red, green, and blue. TechSpot tied the vivid color to that stack, and the text fringing to the triangle. ASUS ROG describes the same light path and the same triangular layout on QD-OLED panels that are not RGB-stripe.

Tandem WOLED. ASUS ROG describes this as several white-OLED layers plus color filters, still with an RGWB stripe. TFTCentral's 13 February 2026 report is about grey banding on some of these panels. The tandem name is the stack. It is not a promise about every sample.

Tandem QD-OLED. ASUS ROG describes several blue-OLED layers plus a quantum-dot layer, and uses Samsung's name Penta Tandem for that stack. On the non-stripe versions the subpixels stay in a triangle. ASUS is the vendor, so the note stays on the stack and the layout.

RGB-stripe WOLED. TFTCentral's 7 August 2026 article says LG Display now also makes panels that drop the white subpixel and use a vertical RGB stripe. Text gets closer to the stripe Windows expects. Brightness is the trade. For the 32-inch 4K WOLED panel, TFTCentral reports an RGWB spec of 1500 nits peak at 1.5 percent APL, 335 nits SDR, and DisplayHDR True Black 500, against an RGB-stripe spec of 1000 nits peak, 250 nits SDR, and True Black 400. TFTCentral also reports that LG Display said that 32-inch RGB-stripe panel can reach 1000 nits of color luminance at 1.5 percent APL, against 600 nits of color luminance on the RGWB version, while the RGWB version can still reach 1500 nits of total peak with the white subpixel. Those are panel specs in that article, not a measurement of every monitor.

RGB-stripe QD-OLED. TFTCentral says Samsung's triangular QD-OLED can move to an RGB stripe without dropping a white subpixel, because it never had one. ASUS ROG says Samsung's name for that stripe is V-Stripe. TFTCentral says the 34-inch ultrawide RGB-stripe QD-OLED panel is the one already on sale: 3440 by 1440, about 110 PPI, 280 Hz or 360 Hz, a 1300 nits peak spec at 1.5 percent APL, 300 nits SDR, and DisplayHDR True Black 500. TFTCentral says a 32-inch 4K 360 Hz RGB-stripe QD-OLED was not expected until 2027. A 27-inch 5K RGB-stripe WOLED was still a prototype in that article, with no monitor announced.

Color and HDR. The nits below are TechSpot's 13 April 2024 measurements of 32-inch 4K monitors, not a 2026 catalog. SDR brightness was 250 nits for both the WOLED and the QD-OLED models in that test. On synthetic HDR windows, the 2 percent and 10 percent windows were slightly higher on the WOLED, and the 5 percent window was higher on the QD-OLED. In one low-APL video, TechSpot measured the MSI 321URX at 897 nits and the LG 32GS95UE, in its brightest mode, at 603 nits, and said other QD-OLED models did not match each other. What TechSpot said does not change by model is color brightness. Color brightness on QD-OLED was typically more than twice as high as on WOLED, because the white subpixel does not help a saturated color. Red went from 105 nits on WOLED to 241 nits on QD-OLED, green from 296 nits to 686 nits, and blue from 34 nits to 69 nits. In low-APL testing, QD-OLED reached around 73 percent Rec. 2020 color volume and WOLED 34 percent. Color-space coverage, brightness left out, was around 72 to 73 percent Rec. 2020 for WOLED and in the 80 percent range for QD-OLED. TechSpot said HDR brightness accuracy tracked the monitor maker's tuning more than the panel type. For hobby color work, the color-volume gap is the QD-OLED side of that test. Still check the review of the exact model. ASUS ROG's vendor guide also points color-critical work toward QD-OLED. That is a vendor note, not a lab report.

Text clarity. Windows draws text for a normal RGB stripe. TechSpot's April 2024 32-inch 4K panels are about 140 PPI. At that density TechSpot found the flaws hard to spot in normal use: pink and green fringing on QD-OLED, and a shadow on the left or right edge of letters on WOLED. TechSpot preferred the QD-OLED text in Windows and did not treat the gap as large. TFTCentral's 7 August 2026 article says the triangle is the QD-OLED problem and the extra white subpixel is the WOLED problem. A move to RGWB around 2024 helped WOLED text. An RGB stripe helps more. TFTCentral also says pixel density hides a lot of fringing: a 27-inch 4K triangular QD-OLED is about 166 PPI and already looks strong for text, while a 34-inch ultrawide at about 110 PPI gains the most from the stripe. If you read and write on the monitor for hours, prefer a reviewed RGB-stripe panel or a high-PPI panel, and still judge the sample you buy.

Motion and gaming. At the same refresh rate, TechSpot found motion essentially the same. Response times in that 13 April 2024 testing sat in the 0.3 ms range for both. The 4K panels in the test topped out at 240 Hz. Processing delay at 4K 240 Hz was under 1 ms in SDR and HDR on the OLEDs TechSpot had tested. The WOLED difference is LG Display Dual Mode. On the LG 32GS95UE, the panel can switch to 1920 by 1080 at 480 Hz. TechSpot said that mode is clearer in motion and has less refresh lag than 240 Hz, and that 1080p is softer than 4K. At 4K 240 Hz the two types matched. A competitive player who will use the lower-resolution mode has a reason to look at a 4K WOLED with Dual Mode. A single-player HDR player does not get a motion difference at the same refresh rate.

Power. For a full-screen white image, TechSpot's 13 April 2024 testing found WOLED used around 35 to 40 percent less power than QD-OLED, because of the white subpixel. On a Steam Store homepage example in that same test, WOLED measured 47 watts and QD-OLED measured 32 watts. Which panel draws less depends on the picture.

Uniformity, grey banding, and burn-in. TechSpot found viewing angles excellent on both April 2024 panel types. On dark grey, that test found QD-OLED uniform and WOLED prone to a dirty-screen speckle. TFTCentral's 13 February 2026 article is a later, narrower issue: grey banding on some, not all, tandem WOLED samples. It shows up most on very dark grey, in a dim room, in dark apps and night scenes. Asus and LG Display told TFTCentral it comes from tiny current differences at very low brightness, and that it is a characteristic of that tandem driving, not a bad batch. Their table, published by TFTCentral, puts the variation at 1.25 percent around 4.82 nits (32 grey) and at 31 percent around 0.26 nits (8 grey). Samples differ. Earlier WOLED panels can show a milder version. Photos online exaggerate it. Check a dark-grey scene on the exact model. On burn-in, TechSpot wrote that the risk looked similar and that it did not have evidence either technology is more resilient. Warranties differ by brand. Read the warranty.

Who should choose which. Choose QD-OLED for a dim room, movies, HDR single-player games, and hobby color grading, then confirm calibration in a review of that model. Choose WOLED when light faces the screen, or when you want a 4K panel that can drop to 1080p at 480 Hz for competitive games. For long hours of text, choose a panel whose review covers an RGB stripe or a high pixel density, whether the stack is QD-OLED or WOLED. ASUS ROG says older non-stripe panels show up on the lower-priced monitors. Compare the current price of the two models in front of you.

OLED vs Mini-LED gaming monitors is the separate choice between an OLED panel and a Mini-LED LCD. OLED vs QLED compares OLED with a quantum-dot LCD. LG OLED vs Sony OLED compares television brands. The OLED profile is /entity/oled-organic-light-emitting-diode. Samsung vs LG OLED 2026 is about television sets, not these monitor panels.`;

const FAQS = [
  {
    question: "Is QD-OLED or WOLED better?",
    answer:
      "Neither wins everywhere. QD-OLED usually has brighter, more saturated color and looks best in a dark or dim room. WOLED handles ambient light better, so blacks stay deeper in bright rooms.",
  },
  {
    question: "Is QD-OLED or WOLED better in a dark room?",
    answer:
      "In a dark room both show the same deep blacks, so the difference is small. QD-OLED's color advantage then tends to stand out more.",
  },
  {
    question: "Why does a QD-OLED look grey in a bright room?",
    answer:
      "QD-OLED panels reflect more ambient light than WOLED panels, which use extra filters, so in a bright room their blacks can look raised and reddish-grey. In a dark room the difference goes away.",
  },
  {
    question: "Does QD-OLED or WOLED have better text clarity?",
    answer:
      "Older WOLED and QD-OLED panels both show some text fringing because their subpixels aren't a standard RGB stripe. Newer RGB-stripe panels improve text clarity noticeably.",
  },
  {
    question: "Is QD-OLED or WOLED faster for gaming?",
    answer:
      "Response times are about the same on both. Some 4K WOLED monitors add a 1080p high-refresh mode that helps competitive players.",
  },
];

const VERDICT = `Choose QD-OLED if you mostly use the monitor in a dim or dark room and want vivid, saturated color. TechSpot's 13 April 2024 4K testing put QD-OLED color volume at around 73 percent Rec. 2020 and WOLED at 34 percent, with the same deep blacks once the room was dark.

Choose WOLED if the room is bright or lights or windows face the screen. In that testing, WOLED filters reflected less ambient light, so blacks stayed deeper, and some 4K WOLED panels can switch to 1920 by 1080 at 480 Hz.

Neither panel type is the right one for every desk. Check reviews of the exact model, including text layout, grey uniformity, and the burn-in warranty.`;

const BUILT = buildEditorialComparison({
  slug: "qd-oled-vs-woled",
  title: "QD-OLED vs WOLED: Which Gaming Monitor Panel",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: QD,
      slug: QD,
      name: "QD-OLED",
      shortDesc: "Blue OLED plus a quantum-dot layer, with three subpixels in a triangle on non-stripe panels.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Color volume around 73 percent Rec. 2020 in TechSpot's 13 April 2024 low-APL test, against 34 percent for WOLED",
        "Same deep blacks as WOLED when the room is dark (TechSpot, 13 April 2024)",
        "RGB-stripe and V-Stripe versions keep the quantum dots and line the subpixels up (TFTCentral, 7 August 2026; ASUS ROG, 25 August 2026)",
      ],
      cons: [
        "Blacks can look raised and red-grey when ambient light hits the screen (TechSpot, 13 April 2024)",
        "Triangular subpixels can fringe text. High pixel density hides much of it (TechSpot; TFTCentral, 7 August 2026)",
      ],
      bestFor: "Dim rooms, vivid HDR color, and hobby color work after you read that model's review",
    },
    {
      id: WOLED,
      slug: WOLED,
      name: "WOLED",
      shortDesc: "White OLED through color filters, plus a white subpixel on panels that still use one.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Blacks stay deeper in a bright room because the filters reflect less ambient light (TechSpot, 13 April 2024)",
        "Some 4K panels add 1920 by 1080 at 480 Hz. The LG 32GS95UE did in TechSpot's April 2024 test",
        "RGWB order from around 2024 improved text versus older RWBG. RGB-stripe drops the white subpixel (TFTCentral, 7 August 2026)",
      ],
      cons: [
        "Color brightness in the April 2024 test was typically under half of QD-OLED for saturated colors",
        "Some tandem samples show grey banding on very dark greys (TFTCentral, 13 February 2026)",
      ],
      bestFor: "Bright rooms, light facing the screen, and a 1080p high-refresh mode where the model has one",
    },
  ],
  keyDifferences: [
    {
      label: "Dim or dark room",
      entityAValue: "Same deep blacks as WOLED. Color volume is the visible gap",
      entityBValue: "Same deep blacks. Less of the saturated-color brightness",
      winner: "tie",
    },
    {
      label: "Bright room",
      entityAValue: "Blacks can look raised and red-grey in ambient light",
      entityBValue: "Filters reflect less ambient light, so blacks stay deeper",
      winner: "tie",
    },
    {
      label: "Color volume, 13 April 2024",
      entityAValue: "Around 73 percent Rec. 2020 in TechSpot's low-APL test",
      entityBValue: "34 percent Rec. 2020 in that same test",
      winner: "tie",
    },
    {
      label: "Text",
      entityAValue: "Triangle fringes text. RGB stripe and high PPI reduce it",
      entityBValue: "White subpixel fringes text. RGWB helped. RGB stripe drops the white subpixel",
      winner: "tie",
    },
    {
      label: "Gaming motion",
      entityAValue: "About 0.3 ms. Matched WOLED at the same refresh rate",
      entityBValue: "About 0.3 ms. Some 4K models add 1080p at 480 Hz",
      winner: "tie",
    },
    {
      label: "Dark grey",
      entityAValue: "April 2024 panels looked uniform on dark grey",
      entityBValue: "Dirty-screen speckle in 2024. Some tandem samples band (13 February 2026)",
      winner: "tie",
    },
    {
      label: "Burn-in",
      entityAValue: "No evidence it is more resilient (TechSpot, 13 April 2024)",
      entityBValue: "No evidence it is more resilient. Read the model warranty",
      winner: "tie",
    },
    {
      label: "Color-critical work",
      entityAValue: "Higher color brightness in the April 2024 test. Calibration is per model",
      entityBValue: "Lower color brightness in that test. Calibration is per model",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "light-path",
      "How color is made",
      "Panel",
      QD,
      WOLED,
      "Blue OLED through a quantum-dot layer (TechSpot, 13 April 2024)",
      "White OLED through color filters, plus a white subpixel when the panel still has one",
    ),
    textAttr(
      "subpixels",
      "Subpixels",
      "Panel",
      QD,
      WOLED,
      "Three, in a triangle on non-stripe panels. V-Stripe on newer RGB-stripe QD-OLED",
      "RGWB on 2024-onward panels that keep the white subpixel. Older order was RWBG. RGB-stripe drops the white subpixel",
    ),
    textAttr(
      "ambient",
      "Ambient light",
      "Panel",
      QD,
      WOLED,
      "Reflects more ambient light. Blacks can look raised and red-grey (TechSpot, 13 April 2024)",
      "Filters reflect less ambient light, so blacks stay deeper in a bright room",
    ),
    textAttr(
      "color-volume",
      "Color volume, low APL",
      "Color",
      QD,
      WOLED,
      "Around 73 percent Rec. 2020 (TechSpot, 13 April 2024)",
      "34 percent Rec. 2020 (TechSpot, 13 April 2024)",
    ),
    textAttr(
      "sdr",
      "SDR brightness",
      "Brightness",
      QD,
      WOLED,
      "250 nits in TechSpot's 13 April 2024 4K test",
      "250 nits in that same test",
    ),
    textAttr(
      "motion",
      "Motion",
      "Gaming",
      QD,
      WOLED,
      "Response in the 0.3 ms range. Processing delay under 1 ms at 4K 240 Hz in that test",
      "Same 0.3 ms range at the same refresh rate. LG 32GS95UE also ran 1920 by 1080 at 480 Hz",
    ),
    textAttr(
      "text",
      "Text",
      "Desktop",
      QD,
      WOLED,
      "Pink and green fringe at about 140 PPI in the April 2024 32-inch 4K test. About 166 PPI on a 27-inch 4K triangle (TFTCentral)",
      "Edge shadow from the white subpixel. RGB-stripe panels remove it and give up some of the brightness spec",
    ),
    textAttr(
      "burn-in",
      "Burn-in",
      "Durability",
      QD,
      WOLED,
      "TechSpot, 13 April 2024: no evidence this type is more resilient",
      "Same finding. Warranty terms are per model",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "oled-vs-mini-led-gaming-monitor",
      title: "OLED vs Mini-LED Gaming Monitor",
      category: "technology",
    },
    { slug: "oled-vs-qled", title: "OLED vs QLED", category: "technology" },
    { slug: "lg-oled-vs-sony-oled", title: "LG OLED vs Sony OLED", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "QD-OLED for vivid color in a dim room. WOLED when light faces the screen. Same fast response. The exact model still matters.",
    keyFact:
      "TechSpot, 13 April 2024: both around 0.3 ms and 250 nits SDR. QD-OLED color volume around 73 percent Rec. 2020, WOLED 34 percent. No evidence that one type is more resilient than the other.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 24,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "TechSpot: 4K QD-OLED vs 4K WOLED (Tim Schiesser, 13 April 2024)", url: TECHSPOT },
      { name: "TFTCentral: grey banding on some tandem WOLED panels (13 February 2026)", url: BANDING },
      { name: "TFTCentral: OLED RGB-stripe panels (7 August 2026)", url: RGB_STRIPE },
      { name: "ASUS ROG: QD-OLED, tandem, and RGB-stripe guide (25 August 2026, vendor)", url: ASUS },
    ],
  },
  resources: [
    {
      type: "external",
      label: "TechSpot: 4K QD-OLED vs 4K WOLED (13 April 2024)",
      url: TECHSPOT,
      description:
        "Tim Schiesser, 13 April 2024. White OLED plus filters and a white subpixel, versus blue OLED plus quantum dots in a triangle. Response times in the 0.3 ms range. SDR 250 nits both. Color volume around 73 percent Rec. 2020 versus 34 percent. Red 105 to 241 nits, green 296 to 686, blue 34 to 69, WOLED then QD-OLED. MSI 321URX at 897 nits and LG 32GS95UE at 603 nits in one low-APL video. Dual Mode 1920 by 1080 at 480 Hz on the LG 32GS95UE. Raised red-grey QD-OLED blacks in ambient light. No evidence that one type is more resilient than the other.",
    },
    {
      type: "external",
      label: "TFTCentral: grey banding on some tandem WOLED panels (13 February 2026)",
      url: BANDING,
      description:
        "Simon Baker, 13 February 2026. Some tandem WOLED samples, not all, show vertical or horizontal bands on very dark grey. Asus and LG Display called it a low-luminance characteristic, not a bad batch. Table: 1.25 percent variation around 4.82 nits, 31 percent around 0.26 nits.",
    },
    {
      type: "external",
      label: "TFTCentral: OLED RGB-stripe panels (7 August 2026)",
      url: RGB_STRIPE,
      description:
        "Simon Baker, updated 7 August 2026. RGB stripe targets text fringing. WOLED moved from RWBG to RGWB around 2024. 32-inch 4K WOLED specs in that article: RGWB 1500 nits peak, 335 nits SDR, True Black 500; RGB-stripe 1000 nits peak, 250 nits SDR, True Black 400. 34-inch QD-OLED stripe: about 110 PPI, 280 Hz or 360 Hz, 1300 nits peak spec, 300 nits SDR, True Black 500. 27-inch 4K triangle about 166 PPI. 32-inch 4K 360 Hz QD-OLED stripe not expected until 2027.",
    },
    {
      type: "external",
      label: "ASUS ROG panel guide (25 August 2026, vendor)",
      url: ASUS,
      description:
        "Whitson Gordon, 25 August 2026. Vendor overview of WOLED, QD-OLED, tandem stacks, and RGB stripe, including V-Stripe and TrueBlack Glossy or BlackShield films. Used for generation names and room guidance.",
    },
    {
      type: "external",
      label: "OLED technology profile",
      url: OLED_ENTITY,
      description: "Profile for OLED, the display technology both of these panels belong to.",
    },
  ],
  metaTitle: "QD-OLED vs WOLED Gaming Monitor | A Versus B",
});

BUILT.metadata.metaDescription =
  "QD-OLED for vivid color in a dim room. WOLED when light faces the screen, so blacks stay deeper. Response times match. Check the exact model.";

BUILT.relatedBlogPosts = [
  {
    slug: "samsung-vs-lg-oled-tv-2026",
    title: "Samsung vs LG OLED 2026",
    excerpt: "Television guide for Samsung QD-OLED sets and LG WOLED sets. It is about TVs, not monitor panels.",
    category: "technology",
  },
];

export const QD_OLED_VS_WOLED: EditorialComparison = BUILT;
