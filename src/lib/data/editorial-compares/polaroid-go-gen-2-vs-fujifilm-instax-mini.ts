import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-122 — Polaroid Go Generation 2 vs Fujifilm Instax Mini.
 * Checked against sources on 2026-09-29. Film and camera prices are the
 * reviewers' cited figures, not a live shelf price. No Polaroid Go Generation 3
 * specs. No page-level winner.
 */

const GO = "polaroid-go-gen-2";
const INSTAX = "fujifilm-instax-mini";

const DCW = "https://www.digitalcameraworld.com/reviews/polaroid-go-generation-2-review";
const PCMAG_UK = "https://uk.pcmag.com/cameras-1/152230/polaroid-go-generation-2";
const PCMAG_12 = "https://www.pcmag.com/reviews/fujifilm-instax-mini-12";
const PCMAG_BEST = "https://www.pcmag.com/picks/the-best-instant-cameras";

const SOURCE_DATE = "2026-09-29";
const PUBLISHED = "2026-09-29T00:00:00Z";

const SHORT_ANSWER =
  "An Instax Mini is the easier start. That means the Mini 12, or the Mini 13 if that is the camera on the shelf: cheaper film in the reviews cited here, more consistent prints, and simple one-button shooting. The Polaroid Go Gen 2 is for people who want the Polaroid look and tiny square prints, and who accept a higher cost per shot and less predictable exposure. Digital Camera World lists both camera bodies at a US$79.99 RRP and says the Go still leans toward overexposing outdoors. This page does not crown a winner.";

const FAQS = [
  {
    question: "Is Instax Mini better than the Polaroid Go Gen 2?",
    answer:
      "For most people starting out, yes. Digital Camera World says Instax Mini images are conventionally better and cheaper, and that the Go is the pick if you want the Polaroid look. PCMag UK (updated 8 May 2024) says the same split and points buyers to the Instax Mini 12. The Go is the better fit only if you want tiny square Polaroid prints and you accept the film cost and the exposure quirks.",
  },
  {
    question: "Why would you buy the Polaroid Go Gen 2?",
    answer:
      "For the Polaroid look and the tiny square prints. Digital Camera World says Go film is square and smaller than Instax Mini film. The Gen 2 adds double exposure and a self-timer, which the Mini 12 does not offer as double exposure, plus USB-C charging of an internal battery. PCMag UK confirms the self-timer, double exposure, USB-C, and the internal battery. Buy it for that look, not because the prints are more consistent.",
  },
  {
    question: "How much does the film cost?",
    answer:
      "These are reviewer-cited prices, not a live shelf price. Digital Camera World (26 October 2024) cites about US$1.24 a shot for Polaroid Go film and about US$0.79 a shot for Instax Mini film. PCMag UK cites US$1.25 a photo for Go film, from two eight-shot cartridges at $20, and US$0.70 a picture for Instax Mini. PCMag's Mini 12 review (2 March 2023) says a color pack is about $7.50 for 10 exposures, which is $0.75 a shot. Together those color figures sit around US$1.24 to US$1.25 for Go and about US$0.70 to US$0.80 for Instax Mini color film.",
  },
  {
    question: "Should you buy the Instax Mini 12 or the Mini 13?",
    answer:
      "Buy the Instax Mini that is actually on the shelf. PCMag's roundup, updated 6 July 2026, names the Mini 13 as the current entry-level pick: one-button operation, a selfie mirror, a self-timer, and AA batteries, and it does not do double exposures. The Mini 12 review from 2 March 2023 describes one-button operation, a selfie mirror, a close-up mode, and AA batteries. These sources do not include a full Mini 13 spec sheet, and this page does not invent one. It also does not use Polaroid Go Generation 3 specs.",
  },
  {
    question: "Is the Polaroid Go Gen 2 good outdoors?",
    answer:
      "Digital Camera World's reviewer still found that it leans toward overexposing outdoors, and treats it as a better indoor people camera. PCMag UK says the light meter often misread a scene, leaving the exposure too dark or too bright. Both are that reviewer's experience, not a measured failure rate. If you want more consistent outdoor prints, the same reviews point you to Instax Mini.",
  },
];

const VERDICT = `Best easy start: Instax Mini (Mini 12, or Mini 13 if that is what is on the shelf). The reviews cited here describe cheaper film and more consistent prints.

Best for the Polaroid look: Polaroid Go Gen 2. Tiny square prints, double exposure, a self-timer, and USB-C, if you accept the higher cost per shot and less predictable exposure.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `An Instax Mini gives you the easier start. The Polaroid Go Gen 2 is the camera for the Polaroid look and tiny square prints, if you accept the higher cost per shot and the less predictable exposure. This page does not crown one camera.

Spec table. Caption: Polaroid Go Gen 2 vs Instax Mini. Source note: the rows are reviewer-cited figures from Digital Camera World, PCMag UK, PCMag's Instax Mini 12 review, and PCMag's instant-camera roundup. They are not a live store price.

Sources: Digital Camera World (26 October 2024), PCMag UK (updated 8 May 2024), PCMag's Instax Mini 12 review (2 March 2023), and PCMag's best instant cameras roundup (updated 6 July 2026).

Prints

Digital Camera World says Go film is square and smaller than Instax Mini film. PCMag UK measures Go prints at 2.6 by 2.1 inches, with a 1.8-inch-square image area. The same review measures the Instax Mini picture area at 1.8 by 2.4 inches. PCMag's Mini 12 review calls Instax Mini prints wallet-sized, with an image area of about 1.8 by 2.4 inches. The July 2026 roundup calls Mini 13 pictures wallet-size. PCMag says wallet-size, not credit-card size.

Price of the camera and the film

Digital Camera World lists the Go Gen 2 and the Instax Mini 12 at a US$79.99 RRP. PCMag UK lists the Go 2 at $79.99 and calls the Instax Mini 12 a $79.95 camera. PCMag's Mini 12 review lists an MSRP of $79.95. Those are the reviewers' prices.

Film is where the reviews separate them. Digital Camera World cites US$1.24 a shot for Go film and US$0.79 a shot for Instax Mini. PCMag UK cites US$1.25 a photo for Go and US$0.70 a picture for Instax Mini. PCMag's Mini 12 review says color packs cost about $7.50 for 10 exposures. None of those sentences is a price checked in a store on 29 September 2026.

Controls and power

Digital Camera World and PCMag UK both say the Go Gen 2 has double exposure, a self-timer, and USB-C charging for an internal battery. PCMag's Mini 12 review describes one-button operation, a selfie mirror, a close-up mode (11.8 inches / 0.3 m), and AA batteries. The July 2026 roundup says the Mini 13 is also one-button, with a selfie mirror, a self-timer, and AA batteries, and that it does not support double exposures. This page does not add Mini 13 specs beyond that roundup, and it does not describe a Polaroid Go Generation 3.

Exposure

Digital Camera World says exposure improved on the Gen 2, and that the reviewer still found it leans toward overexposing outdoors. Indoor people pictures are where that review says the Go behaves. PCMag UK's reviewer found the meter inaccurate in both directions, too dark or too bright, and recommended the Instax Mini 12 instead.

Which to buy

Start with Instax Mini if you want cheaper film and more consistent prints. PCMag's 6 July 2026 roundup names the Mini 13 as the current entry-level Instax. The Mini 12 is the camera the earlier reviews compare directly with the Go. Choose the Go Gen 2 if the square Polaroid print is the thing you want, and you have already accepted the film cost and the outdoor exposure.`;

export const POLAROID_GO_GEN_2_VS_INSTAX_MINI: EditorialComparison = buildEditorialComparison({
  slug: "polaroid-go-gen-2-vs-fujifilm-instax-mini",
  title: "Polaroid Go Gen 2 vs Instax Mini: Which Instant Camera?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "products",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: GO,
      slug: GO,
      name: "Polaroid Go Gen 2",
      shortDesc:
        "Tiny Polaroid instant camera with square Go film, double exposure, a self-timer, and a USB-C internal battery.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Square Go prints, smaller than Instax Mini (Digital Camera World)",
        "Double exposure and a self-timer (Digital Camera World, PCMag UK)",
        "USB-C charging and an internal battery (Digital Camera World, PCMag UK)",
        "Digital Camera World lists a US$79.99 RRP, the same body price it lists for the Mini 12",
      ],
      cons: [
        "Reviewer-cited film cost is about US$1.24 to US$1.25 a shot, higher than Instax Mini",
        "Digital Camera World says it still leans toward overexposing outdoors",
        "PCMag UK says the meter can leave shots too dark or too bright",
        "PCMag UK calls the picture quality the reason to look at Instax instead",
      ],
      bestFor: "Best for the Polaroid look and tiny square prints",
    },
    {
      id: INSTAX,
      slug: INSTAX,
      name: "Fujifilm Instax Mini",
      shortDesc:
        "Wallet-size Instax Mini cameras, including the Mini 12 and the Mini 13 entry model named by PCMag in July 2026.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Reviewer-cited color film is about US$0.70 to US$0.80 a shot, cheaper than Go film",
        "Digital Camera World and PCMag UK describe more consistent prints than the Go",
        "Mini 12: one button, a selfie mirror, close-up mode, and AA batteries (PCMag)",
        "PCMag's 6 July 2026 roundup names the Mini 13 as the current entry-level pick",
      ],
      cons: [
        "Prints are the rectangular wallet-size Instax Mini format, not square Polaroid Go prints",
        "The Mini 12 review says it has no double exposure",
        "Mini 12 and Mini 13 run on AA batteries, not a USB-C internal pack",
        "This page does not invent a full Mini 13 spec sheet beyond PCMag's 2026 roundup",
      ],
      bestFor: "Best easy start: cheaper film and more consistent prints",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Best for the Polaroid look",
      entityBValue: "Best easy start",
      winner: "tie",
    },
    {
      label: "Prints",
      entityAValue: "Tiny square Go film",
      entityBValue: "Wallet-size Instax Mini",
      winner: "tie",
    },
    {
      label: "Film cost (reviewer-cited)",
      entityAValue: "About US$1.24 to US$1.25 a shot",
      entityBValue: "About US$0.70 to US$0.80 a color shot",
      winner: "b",
    },
    {
      label: "Exposure",
      entityAValue: "Leans toward overexposing outdoors (Digital Camera World)",
      entityBValue: "Reviewers call the prints more consistent",
      winner: "b",
    },
    {
      label: "Extras",
      entityAValue: "Double exposure, self-timer, USB-C",
      entityBValue: "Mini 12: one button, selfie mirror, close-up, AA batteries",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "prints",
      "Prints",
      "Reviewer-cited",
      GO,
      INSTAX,
      "Square Go film. Image area about 1.8 inches square (PCMag UK)",
      "Wallet-size Instax Mini. Image area about 1.8 by 2.4 inches (PCMag)"
    ),
    textAttr(
      "body-price",
      "Camera price (reviewer-cited)",
      "Reviewer-cited",
      GO,
      INSTAX,
      "US$79.99 RRP (Digital Camera World, PCMag UK). Not a live price",
      "Mini 12 US$79.99 RRP (Digital Camera World) or $79.95 MSRP (PCMag). Not a live price"
    ),
    textAttr(
      "film-cost",
      "Film cost (reviewer-cited)",
      "Reviewer-cited",
      GO,
      INSTAX,
      "About US$1.24 a shot (Digital Camera World) or US$1.25 (PCMag UK)",
      "About US$0.79 (Digital Camera World), US$0.70 (PCMag UK), or about $7.50 for 10 color shots (PCMag, 2023)"
    ),
    textAttr(
      "exposure",
      "Exposure",
      "Reviewer-cited",
      GO,
      INSTAX,
      "Leans toward overexposing outdoors (Digital Camera World). Meter can run too dark or too bright (PCMag UK)",
      "Reviewers describe more consistent color and exposure than Go film",
      "b"
    ),
    textAttr(
      "features",
      "Features",
      "Reviewer-cited",
      GO,
      INSTAX,
      "Double exposure, self-timer, USB-C, internal battery",
      "Mini 12: one button, selfie mirror, close-up mode, AA batteries. Mini 13: one button, selfie mirror, self-timer, AA batteries (PCMag, 6 Jul 2026)",
      "a"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Best easy start: Instax Mini. Best for the Polaroid look: Polaroid Go Gen 2.",
    keyFact:
      "Digital Camera World lists both cameras at a US$79.99 RRP and cites about US$1.24 a Go shot against about US$0.79 an Instax Mini shot. PCMag UK cites US$1.25 and US$0.70. Those are the reviewers' prices.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 5,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Digital Camera World — Polaroid Go Gen 2 (26 Oct 2024)", url: DCW },
      { name: "PCMag UK — Polaroid Go Gen 2 (updated 8 May 2024)", url: PCMAG_UK },
      { name: "PCMag — Instax Mini 12 (2 Mar 2023)", url: PCMAG_12 },
      { name: "PCMag — best instant cameras (updated 6 Jul 2026)", url: PCMAG_BEST },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Digital Camera World Go Gen 2 review",
      url: DCW,
      description:
        "US$79.99 RRP for the Go and the Mini 12, US$1.24 vs US$0.79 a shot, square film, outdoor overexposure, double exposure, self-timer, USB-C.",
    },
    {
      type: "external",
      label: "PCMag UK Go Gen 2 review",
      url: PCMAG_UK,
      description:
        "Updated 8 May 2024. US$1.25 a Go photo, US$0.70 an Instax Mini picture, USB-C, internal battery, self-timer, double exposure.",
    },
    {
      type: "external",
      label: "PCMag Instax Mini 12 review",
      url: PCMAG_12,
      description:
        "Published 2 March 2023. One-button, selfie mirror, close-up mode, AA batteries, color packs about $7.50 for 10.",
    },
    {
      type: "external",
      label: "PCMag best instant cameras",
      url: PCMAG_BEST,
      description:
        "Updated 6 July 2026. Names the Instax Mini 13 as the current entry-level pick.",
    },
  ],
  metaTitle: "Go Gen 2 vs Instax Mini: Which Camera? | A Versus B",
});
