import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Kindle vs Kobo, checked 3 October 2026.
 * Amazon: the 2026 Kindle lineup post, the Kindle Scribe post, and Send to Kindle help.
 * Kobo: the US eReaders page, the US eReader store collection (including its FAQ),
 * the file-format help article, and the library-borrowing help articles.
 * No page-level winner. Prices and specs that those pages do not publish are left out.
 */

const KINDLE = "amazon-kindle";
const KOBO = "rakuten-kobo";

const LINEUP = "https://www.aboutamazon.com/news/devices/new-kindle-lineup-2026";
const SCRIBE = "https://www.aboutamazon.com/news/devices/new-amazon-kindle-scribe-color";
const SEND = "https://www.amazon.com/gp/help/customer/display.html?nodeId=200767340";
const KOBO_LINEUP = "https://www.kobo.com/us/en/ereaders";
const KOBO_STORE = "https://ereader.kobo.com/en-us/collections/ereaders";
const FORMATS = "https://help.kobo.com/hc/en-us/articles/360017763713-File-formats-your-Kobo-eReader-and-Kobo-Books-app-support";
const LIBRARY = "https://help.kobo.com/hc/en-us/articles/360017677053-Borrow-eBooks-from-the-public-library-using-your-Kobo-eReader";
const LIBBY = "https://help.kobo.com/hc/en-us/articles/4477058367895-About-the-Libby-app";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const SPEC = "Lineup · checked 2026-10-03";

const SHORT_ANSWER =
  "Choose a Kindle if you want Amazon's bookstore on a dedicated reader. The 6-inch Kindle starts at $149.99 with 16GB and up to 6 weeks of battery, and Kindle Paperwhite is waterproof with up to 12 weeks, from $199.99. Choose a Kobo if you want EPUB on the device and public-library borrowing. Kobo Clara BW is $159.99 and Kobo Libra Colour is $259.99. Checked 3 October 2026. There is no winner on this page.";

const FAQS = [
  {
    question: "Can a Kindle open an EPUB file?",
    answer:
      "Send to Kindle, checked 3 October 2026, accepts HTML, RTF, TXT, JPEG, GIF, PNG, BMP, PDF, and EPUB. Web uploads are 200 MB or smaller, and the service is at no additional cost. Kobo's file-format help says a Kobo eReader supports EPUB, EPUB2, and EPUB3 on the device, plus PDF, FlePub, and MOBI.",
  },
  {
    question: "Can a Kobo borrow library books?",
    answer:
      "Libby by OverDrive on a Kobo eReader can browse, borrow, and place holds with a library card and Wi-Fi. That built-in feature covers Kobo Libra Colour, Clara Colour, Clara BW, Elipsa 2E, and Sage, among other models, in the United States, Canada, the United Kingdom, Australia, New Zealand, and several other countries. Libby may not be available at your library. Audiobooks borrowed through Libby cannot be played on Kobo eReaders. The Kobo store FAQ says you can borrow library eBooks and audiobooks with OverDrive.",
  },
  {
    question: "Which current models are waterproof?",
    answer:
      "Kindle Paperwhite is waterproof and has an adjustable warm light. The 6-inch Kindle and Kindle Colorsoft are not described as waterproof, and no IP rating is published for them. On the Kobo store, Waterproof is a feature of Kobo Libra Colour, Kobo Clara Colour, Kobo Clara BW, and Kobo Sage. Elipsa 2E is not listed as waterproof.",
  },
  {
    question: "Which lineup has a color screen?",
    answer:
      "Kindle Colorsoft is paper-like color, from $289.99 with 16GB, and a Signature Edition at $319.99 with 32GB. No Colorsoft screen size in inches is published. Kobo Clara Colour is a 6-inch color E Ink Kaleido 3 and Kobo Libra Colour is a 7-inch color E Ink Kaleido 3. The store lists Clara Colour at $179.99 and Libra Colour at $259.99.",
  },
  {
    question: "What do the current models cost?",
    answer:
      "Checked 3 October 2026. New Kindle models: 6-inch Kindle 16GB from $149.99, aluminum 32GB at $189.99, Paperwhite 16GB from $199.99, Paperwhite Signature Edition 32GB at $249.99, Colorsoft 16GB from $289.99, Colorsoft Signature Edition 32GB at $319.99, and Kids versions starting at $179.99. Kindle Scribe is an 11-inch model with no price published alongside it. New Kobo models: Clara BW $159.99, Clara Colour $179.99, Libra Colour $259.99, Sage $269.99, Elipsa 2E $399.99. The same Kobo store also lists certified refurbished readers at $79.99, $109.99, $159.99, and $279.99.",
  },
  {
    question: "Which one is for handwritten notes?",
    answer:
      "Kindle Scribe is the notebook Kindle: 5.4 mm and 400 g, with an 11-inch glare-free display, a pen that does not need charging, and Google Drive and Microsoft OneDrive import. Libra Colour and Sage work with a Kobo Stylus, and Elipsa 2E includes Kobo Stylus 2. Elipsa 2E is $399.99 with a 10.3-inch screen. Clara Colour and Clara BW are not stylus eReaders.",
  },
];

const VERDICT = `Best fit for Amazon's bookstore: Kindle. The 6-inch model starts at $149.99. Paperwhite adds waterproofing and up to 12 weeks of battery, from $199.99.

Best fit for EPUB on the device and library borrowing: Kobo. Clara BW is $159.99. Libra Colour adds a 7-inch color screen and page-turn buttons at $259.99.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `Choose a Kindle if the books you buy are in Amazon's Kindle store and you want a dedicated reader for them. Choose a Kobo if you want EPUB on the device and a built-in way to borrow from a public library that supports Libby. There is no winner on this page.

Checked 3 October 2026. Kindle prices, storage, the 6-inch size, battery weeks, Paperwhite waterproofing, and the Colorsoft description come from Amazon's 2026 Kindle lineup. Kindle Scribe size, thickness, weight, and the pen come from Amazon's Kindle Scribe announcement. Send to Kindle file types come from Amazon Help. Kobo screen sizes, storage, and battery wording come from Kobo's US eReaders page. Kobo prices, waterproof models, refurbished prices, and the ad-free note come from the Kobo eReader store. File types and library borrowing come from Kobo Help.

What each lineup is

The 2026 Kindle lineup is a redesigned Kindle, Kindle Paperwhite, and Kindle Colorsoft, plus Kids versions. The 6-inch Kindle has 16GB, up to 6 weeks of battery, and starts at $149.99 in Ube and Graphite. An aluminum version has 32GB at $189.99. Kindle Paperwhite is waterproof, has an adjustable warm light, and up to 12 weeks of battery. It starts at $199.99 with 16GB. The Signature Edition is $249.99 with 32GB, an aluminum rear, an auto-adjusting front light, and pogo-pin dock charging. Kindle Colorsoft starts at $289.99 with 16GB. Its Signature Edition is $319.99 with 32GB. The 6-inch Kindle and its aluminum version are available. Paperwhite and Colorsoft are on preorder on a rolling basis. Paperwhite and Colorsoft have no published screen size in inches, and Colorsoft has no published battery-week count.

Kobo's current US lineup is Libra Colour, Clara Colour, Clara BW, Sage, and Elipsa 2E. Clara Colour and Clara BW are 6-inch. Libra Colour is 7-inch color E Ink Kaleido 3 with page-turn buttons and 32GB, described as up to 24,000 eBooks or 150 Kobo audiobooks. Clara models have 16GB, described as up to 12,000 eBooks or 75 Kobo audiobooks. Sage is an 8-inch E Ink Carta 1200 with 32GB. Elipsa 2E is a 10.3-inch E Ink Carta 1200 with 32GB and includes Kobo Stylus 2. New store prices are Clara BW $159.99, Clara Colour $179.99, Libra Colour $259.99, Sage $269.99, and Elipsa 2E $399.99. Certified refurbished readers on that store are $79.99, $109.99, $159.99, and $279.99.

Files

Send to Kindle accepts HTML, RTF, TXT, JPEG, GIF, PNG, BMP, PDF, and EPUB, and delivers them to the Kindle library. A Kobo eReader supports EPUB, EPUB2, EPUB3, PDF, FlePub, and MOBI, plus CBZ and CBR comics. Sideloaded books do not sync across devices or appear in the Kobo Books app.

Library borrowing

Kobo includes Libby by OverDrive on the models and in the countries named above. Public-library borrowing is not part of the Kindle lineup or of Send to Kindle.

Notes and ads

Kindle Scribe is the writing Kindle: 11 inches, 5.4 mm, 400 g, and a pen that never needs charging. Kobo puts handwriting on Libra Colour, Sage, and Elipsa 2E. Every Kobo eReader is free of ads.

Who should buy which

Buy a Kindle if your library of purchased books is already in Kindle format and you want Amazon's store on the device. Among new models, the 6-inch Kindle at $149.99 is the lowest price, and Kobo Clara BW at $159.99 is the lowest new Kobo. Refurbished Kobo readers start lower, at $79.99. Paperwhite is the waterproof Kindle, with the longer battery figure of up to 12 weeks.

Buy a Kobo if EPUB files and public-library loans matter more than the Kindle store. Clara BW at $159.99 is the black-and-white 6-inch model. Libra Colour at $259.99 is the 7-inch color model with page-turn buttons. Kobo battery life is described as weeks, without a number of weeks, so the two lineups are not ranked on battery past the figures each company publishes.`;

export const KINDLE_VS_KOBO: EditorialComparison = buildEditorialComparison({
  slug: "kindle-vs-kobo",
  title: "Kindle vs Kobo: Which E-Reader Should You Buy?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "products",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: KINDLE,
      slug: KINDLE,
      name: "Amazon Kindle",
      shortDesc: "Amazon's 2026 Kindle, Paperwhite, and Colorsoft readers, plus Kindle Scribe.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "6-inch Kindle from $149.99, with 16GB and up to 6 weeks of battery",
        "Paperwhite is waterproof, with up to 12 weeks, from $199.99",
        "Colorsoft from $289.99, and a Signature Edition with 32GB at $319.99",
        "Send to Kindle accepts EPUB, PDF, HTML, RTF, TXT, and JPEG, GIF, PNG, and BMP, at no additional cost",
      ],
      cons: [
        "Paperwhite and Colorsoft have no published screen size in inches",
        "Colorsoft has no published battery-week count and is not described as waterproof",
        "EPUB goes through Send to Kindle, rather than opening as a file on the device itself",
        "Kindle Scribe has no published price",
      ],
      bestFor: "Best for books you buy from Amazon",
    },
    {
      id: KOBO,
      slug: KOBO,
      name: "Rakuten Kobo",
      shortDesc: "Kobo Clara, Libra Colour, Sage, and Elipsa 2E, with EPUB and Libby borrowing.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "EPUB, EPUB2, and EPUB3 on the eReader",
        "Libby borrowing on Libra Colour, Clara Colour, Clara BW, Elipsa 2E, and Sage",
        "Clara BW $159.99, Clara Colour $179.99, Libra Colour $259.99 with page-turn buttons",
        "Every Kobo eReader is free of ads",
      ],
      cons: [
        "Battery life is described as weeks, with no week count",
        "Audiobooks borrowed through Libby cannot play on the eReader",
        "Elipsa 2E is $399.99 and is not listed as waterproof",
        "Sideloaded books do not sync across devices",
      ],
      bestFor: "Best for EPUB files and public-library loans",
    },
  ],
  keyDifferences: [
    {
      label: "Bookstore",
      entityAValue: "Kindle store on the device",
      entityBValue: "Kobo Store on the device",
      winner: "tie",
    },
    {
      label: "EPUB",
      entityAValue: "Send to Kindle accepts EPUB",
      entityBValue: "EPUB on the eReader",
      winner: "tie",
    },
    {
      label: "Library loans",
      entityAValue: "Not part of the Kindle lineup or Send to Kindle",
      entityBValue: "Libby on listed models and countries",
      winner: "tie",
    },
    {
      label: "Lowest new price",
      entityAValue: "6-inch Kindle from $149.99",
      entityBValue: "Clara BW $159.99. Refurbished from $79.99",
      winner: "tie",
    },
    {
      label: "Color reader",
      entityAValue: "Colorsoft from $289.99",
      entityBValue: "Clara Colour $179.99, Libra Colour $259.99",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("entry", "Lowest new price", SPEC, KINDLE, KOBO, "6-inch Kindle, 16GB, from $149.99", "Clara BW, 6-inch, $159.99. Certified refurbished from $79.99"),
    textAttr("paperwhite", "Mid black-and-white", SPEC, KINDLE, KOBO, "Paperwhite from $199.99, waterproof, up to 12 weeks. No screen size in inches", "Clara BW $159.99, 6-inch Carta 1300, waterproof"),
    textAttr("color", "Color model", SPEC, KINDLE, KOBO, "Colorsoft from $289.99, 16GB. Signature Edition $319.99, 32GB", "Clara Colour $179.99, 6-inch Kaleido 3. Libra Colour $259.99, 7-inch Kaleido 3"),
    textAttr("notes", "Handwriting", SPEC, KINDLE, KOBO, "Kindle Scribe: 11-inch, 5.4 mm, 400 g, pen included. No published price", "Libra Colour and Sage take a Kobo Stylus. Elipsa 2E includes Stylus 2, 10.3-inch, $399.99"),
    textAttr("epub", "EPUB", SPEC, KINDLE, KOBO, "Send to Kindle accepts EPUB, plus HTML, RTF, TXT, JPEG, GIF, PNG, BMP, and PDF. Web upload 200 MB or smaller", "EPUB, EPUB2, and EPUB3 on the eReader"),
    textAttr("library", "Public library", SPEC, KINDLE, KOBO, "Not part of the Kindle lineup or Send to Kindle", "Libby by OverDrive on listed models, in listed countries"),
    textAttr("water", "Waterproof", SPEC, KINDLE, KOBO, "Paperwhite is waterproof. No IP rating is published", "Libra Colour, Clara Colour, Clara BW, and Sage"),
    textAttr("battery", "Battery", SPEC, KINDLE, KOBO, "6-inch Kindle up to 6 weeks. Paperwhite up to 12 weeks. Colorsoft has no published week count", "Weeks of battery life, with no week count"),
    textAttr("ads", "Ads", SPEC, KINDLE, KOBO, "No ad policy is stated for the 2026 lineup", "Every Kobo eReader is free of ads"),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Kindle for Amazon's store, including a $149.99 6-inch reader and a waterproof Paperwhite. Kobo for EPUB on the device and Libby library loans.",
    keyFact:
      "Checked 3 October 2026: Kindle from $149.99 with up to 6 weeks, Paperwhite up to 12 weeks, Kobo Clara BW $159.99, Libra Colour $259.99.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 9,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "Amazon — 2026 Kindle lineup post (checked 2026-10-03)", url: LINEUP },
      { name: "Amazon — Kindle Scribe lineup post (checked 2026-10-03)", url: SCRIBE },
      { name: "Amazon Help — Send to Kindle file types (checked 2026-10-03)", url: SEND },
      { name: "Rakuten Kobo — US eReaders (checked 2026-10-03)", url: KOBO_LINEUP },
      { name: "Rakuten Kobo — US eReader store (checked 2026-10-03)", url: KOBO_STORE },
      { name: "Kobo Help — file formats (checked 2026-10-03)", url: FORMATS },
      { name: "Kobo Help — borrow library books on the eReader (checked 2026-10-03)", url: LIBRARY },
      { name: "Kobo Help — About the Libby app (checked 2026-10-03)", url: LIBBY },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Amazon 2026 Kindle lineup",
      url: LINEUP,
      description:
        "Checked 2026-10-03. 6-inch Kindle from $149.99, Paperwhite from $199.99 and waterproof with up to 12 weeks, Colorsoft from $289.99.",
    },
    {
      type: "external",
      label: "Amazon Kindle Scribe post",
      url: SCRIBE,
      description: "Checked 2026-10-03. 11-inch display, 5.4 mm, 400 g, pen included. No price in the sections used here.",
    },
    {
      type: "external",
      label: "Send to Kindle help",
      url: SEND,
      description: "Checked 2026-10-03. HTML, RTF, TXT, JPEG, GIF, PNG, BMP, PDF, and EPUB. Web uploads 200 MB or smaller. No additional cost.",
    },
    {
      type: "external",
      label: "Kobo US eReaders",
      url: KOBO_LINEUP,
      description:
        "Checked 2026-10-03. Clara 6-inch, Libra Colour 7-inch, Sage 8-inch, Elipsa 2E 10.3-inch. Battery life is weeks, with no week count.",
    },
    {
      type: "external",
      label: "Kobo US eReader store",
      url: KOBO_STORE,
      description:
        "Checked 2026-10-03. New: Clara BW $159.99, Clara Colour $179.99, Libra Colour $259.99, Sage $269.99, Elipsa 2E $399.99. Certified refurbished: $79.99, $109.99, $159.99, and $279.99. Every Kobo eReader is free of ads.",
    },
    {
      type: "external",
      label: "Kobo file formats",
      url: FORMATS,
      description: "Checked 2026-10-03. EPUB, EPUB2, EPUB3, PDF, FlePub, and MOBI on the eReader.",
    },
    {
      type: "external",
      label: "Kobo library borrowing",
      url: LIBRARY,
      description: "Checked 2026-10-03. Libby by OverDrive on listed models, in listed countries.",
    },
    {
      type: "external",
      label: "About the Libby app",
      url: LIBBY,
      description: "Checked 2026-10-03. Audiobooks borrowed through Libby cannot be played on Kobo eReaders.",
    },
  ],
  metaTitle: "Kindle vs Kobo | A Versus B",
});
