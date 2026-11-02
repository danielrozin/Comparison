import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-369 — Kindle vs iPad (or tablet) for reading.
 * Opened 2 November 2026 (Asia/Jerusalem):
 * Amazon Paperwhite and Colorsoft product pages (both titled 2024 model),
 * Amazon's 28 October 2026 Kindle lineup post, Apple iPad 11-inch (A16) specs,
 * the U.S. Apple Store iPad buy page, Libby help 6017, the AAO digital-device
 * eye-strain article, Send to Kindle help, the Kindle+ signup page,
 * Apple Books, and the U.S. App Store listings for Kindle and Libby.
 * Reddit returned HTTP 403, so there is no community-opinion block.
 * No winner. The 20-20-20 rule is not on the AAO article, so it is omitted.
 * A live Fire tablet price was not taken from a single product page, so none is stated.
 */

const PUBLISHED = "2026-11-02T00:00:00Z";
const SOURCE_DATE = "2026-11-02";

const KINDLE = "amazon-kindle";
const IPAD = "ipad-a16";

const PAPERWHITE = "https://www.amazon.com/Amazon-Kindle-Paperwhite-16-GB/dp/B0CFPJYX7P";
const COLORSOFT = "https://www.amazon.com/Amazon-Kindle-Colorsoft/dp/B0CGVSKR1G";
const LINEUP = "https://www.aboutamazon.com/news/devices/new-kindle-lineup-2026";
const IPAD_SPECS = "https://www.apple.com/ipad-11/specs/";
const BUY_IPAD = "https://www.apple.com/shop/buy-ipad/ipad";
const LIBBY_HELP = "https://help.libbyapp.com/en-us/6017.htm";
const AAO = "https://www.aao.org/eye-health/tips-prevention/computer-usage";
const SEND = "https://www.amazon.com/gp/help/customer/display.html?nodeId=200767340";
const KINDLE_PLUS = "https://www.amazon.com/kindle-dbs/hz/signup";
const APPLE_BOOKS = "https://www.apple.com/apple-books/";
const KINDLE_APP = "https://apps.apple.com/us/app/amazon-kindle/id302584613";
const LIBBY_APP = "https://apps.apple.com/us/app/libby-by-overdrive/id1076402606";

const PRICE_NOTE = "U.S. prices on 2 November 2026";

const SHORT_ANSWER = `Choose a Kindle if you mostly read books. Amazon's Kindle Paperwhite 16GB (2024 model) has a 7-inch glare-free display at 300 ppi, a light Amazon says you can adjust from white to amber in bright sunlight or in the dark, a USB-C charge Amazon rates at up to 12 weeks, and a Waterproof (IPX8) rating tested for 2 meters of fresh water for 60 minutes. Amazon says that Kindle does not have social media, notifications, or other distracting apps. Choose an iPad if you read comics, magazines, PDFs, or textbooks in color, or you want web and video on the same device. Apple lists an 11-inch Liquid Retina LED-backlit display at 2360 by 1640 pixels, 264 ppi, and 500 nits, a Wi-Fi weight of 1.05 pounds (477 grams), and up to 10 hours of surfing the web on Wi-Fi or watching video. On 2 November 2026 the U.S. Apple Store price for Wi-Fi iPad (A16) was $449 for 128GB. The same day Amazon.com listed the Paperwhite 16GB (2024 model) at $199.99 and at $142.55 with 29 percent savings.`;

const EXPERT_ANALYSIS = `Choose a Kindle if you mostly read books. Choose an iPad if you read comics, magazines, PDFs, or textbooks in color, or you want web and video on the same device. Neither device is the right one for every kind of reading.

Key takeaways. Amazon rates Kindle Paperwhite battery life at up to 12 weeks and Kindle Colorsoft at up to 8 weeks. Apple rates the 11-inch iPad (A16) at up to 10 hours of surfing the web on Wi-Fi or watching video. Amazon says the Paperwhite Kindle does not have social media, notifications, or other distracting apps. The iPad runs the Amazon Kindle reading app and Libby from the App Store, and Apple Books is a built-in app for ebooks and audiobooks. On 2 November 2026 Wi-Fi iPad (A16) was $449 for 128GB at the U.S. Apple Store, and Amazon.com listed Paperwhite 16GB (2024 model) at $199.99 and at $142.55 with 29 percent savings.

Quick verdict by reading type. Novels and other long books line up with the Paperwhite: a 7-inch glare-free screen, a white-to-amber light, up to 12 weeks, and no social apps. Comics, manga, and magazines line up with the iPad's 11-inch color LED display at 264 ppi and 500 nits. Kindle Colorsoft is Amazon's color e-reader: 300 ppi in black and white and 150 ppi in color, which is a different display from the Paperwhite. PDFs can go to a Kindle through Send to Kindle, and the iPad's 11-inch LED screen is the larger color display. In the U.S., Libby can send most library books to a Kindle e-reader. On an iPad, Libby is its own app. In bed, the Paperwhite is 7.4 ounces (211 grams) with a warm-end light. At the beach, Amazon says the Paperwhite light is for bright sunlight, and the Paperwhite is Waterproof (IPX8). For kids, Amazon's 28 October 2026 lineup post lists Kids Kindles starting at $179.99 and says kids read, on average, more than an hour a day, with no notifications, no apps, and no messaging.

Screen. The Paperwhite product Amazon titles as the 2024 model uses a 7-inch Paperwhite display at 300 ppi, with a built-in light and 16-level gray scale. Amazon calls the screen glare-free. Kindle Colorsoft, also titled as a 2024 model, uses a 7-inch color display at 300 ppi in black and white and 150 ppi in color. Amazon says a color filter layer makes the Colorsoft look different in texture or brightness from the Paperwhite, and describes that color reading as easy on the eyes. The iPad (A16) uses an 11-inch Liquid Retina display. Apple says it is an LED-backlit Multi-Touch display with IPS technology, 2360 by 1640 pixels at 264 ppi, True Tone, and 500 nits. Measured as a rectangle, Apple lists 10.86 inches, and says the actual viewable area is less. Amazon's 28 October 2026 lineup post describes a redesigned Kindle family and calls Colorsoft paper-like color without the harsh glare of a tablet. The 7-inch measurements in this section are from the Amazon.com products titled as 2024 models.

Eye comfort and night reading. The American Academy of Ophthalmology says looking at a computer, smartphone, or other digital screen for long periods will not permanently damage your eyes. It also says eyes may feel uncomfortable, and that digital eye strain can include blur, aching, dryness, tearing, or stinging. The Academy says those symptoms are no different from close work such as reading, writing, or sewing. It says people normally blink about 15 times a minute, and that studies show about 5 to 7 blinks a minute while using computers and other digital screens. Its tips are to blink on purpose, look up at a distant object, match screen brightness to the room, and cut glare. Amazon says the Paperwhite and Colorsoft lights adjust from white to amber for bright sunlight or the dark. Colorsoft also has Dark Mode, which Amazon says turns backgrounds black and text white. The iPad display is LED-backlit, and Apple lists True Tone and 500 nits.

Battery. Amazon rates a Paperwhite USB-C charge at up to 12 weeks, and a Colorsoft USB-C charge at up to 8 weeks. Amazon says the Colorsoft color-style choice, Standard or Vivid, has no impact on that battery figure. Amazon says someone who wants longer battery life may like Kindle Paperwhite or Kindle Paperwhite Signature Edition, both with up to 12 weeks. Apple rates the iPad (A16) at up to 10 hours of surfing the web on Wi-Fi or watching video, and up to 9 hours of surfing the web on a cellular data network for Wi-Fi + Cellular models. Apple lists a built-in 28.93-watt-hour rechargeable lithium-polymer battery. Amazon's 28 October 2026 lineup post rates the 6-inch Kindle at up to 6 weeks and the new Paperwhite at up to 12 weeks.

Distractions. Amazon says the Paperwhite Kindle does not have social media, notifications, or other distracting apps. Amazon says the same for Colorsoft. The iPad is a tablet with the A16 chip, Wi-Fi 6, and apps. Apple's U.S. App Store lists Amazon Kindle: Reading App and Libby, the library app. Apple says Apple Books is built in, for ebooks and audiobooks. Apple's battery rating covers surfing the web and watching video, so the iPad is specified for those uses as well as reading.

Content and stores. Amazon says the Paperwhite and Colorsoft can access over 15 million titles in the Kindle Store, and that a Kindle+ subscription can be added. Amazon's Kindle+ signup says Kindle Unlimited is now Kindle+. Send to Kindle accepts HTML, HTM, RTF, TXT, JPEG, JPG, GIF, PNG, BMP, PDF, and EPUB. Web uploads are 200 MB or smaller. Send to Kindle also has a path from the Kindle app for iOS. In the U.S., Libby says you can read most Libby books on a Kindle e-reader. Libby says that on a Fire tablet it is better to install Libby and read there. On an iPad, library books can be read in the Libby app, Kindle books in the Kindle app, and Apple Books titles in Apple Books.

Comics, magazines, and PDFs. A color comic, magazine, or illustrated textbook uses the iPad's 11-inch LED display at 264 ppi and 500 nits, or Colorsoft's 7-inch color display at 150 ppi in color. Amazon's lineup post names comics and graphic novels as Colorsoft reading. Send to Kindle accepts PDF files up to the 200 MB web limit. The iPad screen is the larger of the two color displays in this pair.

Weight, size, and water. Amazon lists the Paperwhite 2024 model at 5 by 7 by 0.3 inches (127.6 by 176.7 by 7.8 mm) and 7.4 ounces (211 grams), and says actual size and weight may vary. Amazon lists Colorsoft at the same 5 by 7 by 0.3 inches and at 7.6 ounces (215 grams), with the same variation note. Apple lists the iPad (A16) at 9.79 inches high, 7.07 inches wide, and 0.28 inch thick (248.6 by 179.5 by 7 mm). Wi-Fi models are 1.05 pounds (477 grams). Wi-Fi + Cellular models are 1.06 pounds (481 grams). Apple says size and weight vary by configuration and manufacturing process. Amazon rates both the Paperwhite and the Colorsoft Waterproof (IPX8), tested for immersion in 2 meters of fresh water for 60 minutes.

Price. On 2 November 2026 Amazon.com listed Kindle Paperwhite 16GB (2024 model) at $199.99 and at $142.55 with 29 percent savings. The same day Amazon.com listed Kindle Colorsoft 16 GB (2024 model) without Kindle+ at $289.99 and at $246.49 with 15 percent savings. On 2 November 2026 the U.S. Apple Store price for iPad (A16) Wi-Fi was $449 for 128GB, $549 for 256GB, and $749 for 512GB, in blue, pink, yellow, and silver. Amazon's 28 October 2026 lineup post lists a 6-inch Kindle from $149.99 with 16GB, an aluminum 32GB version at $189.99, Paperwhite 16GB from $199.99, a Paperwhite Signature Edition at $249.99, Colorsoft 16GB from $289.99, a Colorsoft Signature Edition at $319.99, and Kids Kindles from $179.99. That post says Paperwhite and Colorsoft were moving to preorder on a rolling basis. See vendor page for current price.

Already have an iPad? The Kindle reading app is on the iPad, so Kindle Store books can be read there, and Apple Books and Libby are there too. A separate Kindle adds the glare-free screen, the white-to-amber light, a battery Amazon rates in weeks, Waterproof (IPX8) on Paperwhite and Colorsoft, and a device Amazon says has no social media, notifications, or other distracting apps. That trade is for someone who reads books often. Someone who mostly reads comics, magazines, or PDFs already has the 11-inch color LED display.

Who should choose which. Choose a Kindle Paperwhite for long books, sunlight, baths or pools, and weeks between charges. Choose Kindle Colorsoft if the books are in color and a 7-inch, 150 ppi color display is enough. Choose the iPad (A16) for comics, magazines, PDFs, textbooks, notes with Apple Pencil, and web or video on one device. Apple says Apple Pencil (USB-C) works with this iPad, and Apple Pencil (1st generation) needs a USB-C to Apple Pencil adapter.`;

const FAQS = [
  {
    question: "Is a Kindle or an iPad better for reading books?",
    answer:
      "For mostly text books, a Kindle fits the reading. Amazon's Kindle Paperwhite 16GB (2024 model) has a 7-inch glare-free display at 300 ppi, a light that adjusts from white to amber, a charge Amazon rates at up to 12 weeks, and no social media, notifications, or other distracting apps. An iPad fits color comics, magazines, PDFs, and textbooks, and Apple rates the 11-inch iPad (A16) at up to 10 hours of surfing the web on Wi-Fi or watching video.",
  },
  {
    question: "Is a Kindle easier on the eyes than an iPad?",
    answer:
      "Amazon calls the Paperwhite display glare-free and says its light adjusts from white to amber for bright sunlight or the dark. Amazon describes Colorsoft color reading as easy on the eyes, at 300 ppi in black and white and 150 ppi in color. The American Academy of Ophthalmology says long sessions on a computer, smartphone, or other digital screen will not permanently damage your eyes, and that eyes can still feel uncomfortable. Its tips are to blink, look at a distant object, match brightness to the room, and cut glare.",
  },
  {
    question: "Is a Kindle worth it if I already have an iPad?",
    answer:
      "It can be, if you read books often. The iPad already runs Amazon Kindle: Reading App, Libby, and built-in Apple Books. A Kindle adds a glare-free screen, a battery Amazon rates in weeks, and a device Amazon says has no social media, notifications, or other distracting apps. Paperwhite and Colorsoft are Waterproof (IPX8). If you mostly read comics, magazines, or PDFs, the 11-inch iPad (A16) LED display is the color screen you already have.",
  },
  {
    question: "Can you borrow library books on a Kindle?",
    answer:
      "In the U.S., Libby says you can read most Libby books on a Kindle e-reader. Libby sends you to Amazon to get the library book onto the devices on your Amazon account. Libby says this is available in the U.S. only. On an iPad, the Libby app from the App Store reads library loans on the tablet. Libby says a Fire tablet should use the Libby app rather than a Kindle e-reader handoff.",
  },
  {
    question: "How long do Kindle and iPad batteries last?",
    answer:
      "Amazon rates Kindle Paperwhite at up to 12 weeks and Kindle Colorsoft at up to 8 weeks on a USB-C charge. Amazon's 28 October 2026 lineup post rates the 6-inch Kindle at up to 6 weeks. Apple rates the iPad (A16) at up to 10 hours of surfing the web on Wi-Fi or watching video, and lists a 28.93-watt-hour battery. Wi-Fi + Cellular models are rated up to 9 hours of surfing the web on a cellular data network.",
  },
  {
    question: "Which is the better fit for comics, magazines, and PDFs?",
    answer:
      "The iPad (A16) has an 11-inch LED-backlit display at 264 ppi and 500 nits. Kindle Colorsoft is a 7-inch color display at 150 ppi in color and 300 ppi in black and white, and Amazon's lineup post names comics and graphic novels for it. Send to Kindle accepts PDF, with web uploads of 200 MB or smaller. The Paperwhite display is black and white at 300 ppi.",
  },
];

const BUILT = buildEditorialComparison({
  slug: "kindle-vs-ipad",
  title: "Kindle vs iPad for Reading",
  shortAnswer: SHORT_ANSWER,
  verdict: `Choose a Kindle if you mostly read books. Amazon rates Paperwhite battery life at up to 12 weeks, lists a glare-free 7-inch display, and says that Kindle has no social media, notifications, or other distracting apps.\n\nChoose an iPad if you read comics, magazines, PDFs, or textbooks in color, or you want web and video on the same device. Apple rates the 11-inch iPad (A16) at up to 10 hours of surfing the web on Wi-Fi or watching video.\n\nOn 2 November 2026 Wi-Fi iPad (A16) was $449 for 128GB. Amazon.com listed Paperwhite 16GB (2024 model) at $199.99 and at $142.55 with 29 percent savings. Neither device is the right one for every kind of reading.`,
  category: "products",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: KINDLE,
      slug: KINDLE,
      name: "Kindle",
      shortDesc: "Amazon e-readers, including Paperwhite and Colorsoft, for books on a glare-free screen.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Paperwhite: 7-inch glare-free display, 300 ppi, white-to-amber light (Amazon)",
        "Paperwhite battery up to 12 weeks. Colorsoft up to 8 weeks (Amazon)",
        "Waterproof (IPX8), 2 meters of fresh water for 60 minutes (Amazon)",
        "No social media, notifications, or other distracting apps (Amazon)",
      ],
      cons: [
        "Paperwhite is black and white. Colorsoft color is 150 ppi (Amazon)",
        "7-inch screen, against the iPad's 11-inch LED display",
      ],
      bestFor: "Long books, sunlight, and a device without social apps",
    },
    {
      id: IPAD,
      slug: IPAD,
      name: "iPad",
      shortDesc: "11-inch iPad (A16) with a Liquid Retina LED display, apps, and Apple Books.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "11-inch Liquid Retina LED display, 2360 by 1640 at 264 ppi, 500 nits (Apple)",
        "Up to 10 hours of web on Wi-Fi or video (Apple)",
        "Kindle reading app, Libby, and built-in Apple Books",
      ],
      cons: [
        "1.05 pounds (477 grams) for Wi-Fi, against 7.4 ounces (211 grams) on Paperwhite",
        "Battery rated in hours, against weeks on Paperwhite",
        "$449 for 128GB Wi-Fi on 2 November 2026",
      ],
      bestFor: "Color comics, magazines, PDFs, and web or video on one device",
    },
  ],
  keyDifferences: [
    {
      label: "Novels",
      entityAValue: "7-inch glare-free screen, up to 12 weeks, no social apps",
      entityBValue: "Kindle app and Apple Books on an 11-inch LED display",
      winner: "tie",
    },
    {
      label: "Comics and manga",
      entityAValue: "Colorsoft color at 150 ppi, 7 inches",
      entityBValue: "11-inch LED color at 264 ppi and 500 nits",
      winner: "tie",
    },
    {
      label: "Magazines",
      entityAValue: "Colorsoft 7-inch color",
      entityBValue: "11-inch LED color",
      winner: "tie",
    },
    {
      label: "PDFs and textbooks",
      entityAValue: "Send to Kindle accepts PDF, 200 MB web limit",
      entityBValue: "11-inch LED display",
      winner: "tie",
    },
    {
      label: "Library borrowing",
      entityAValue: "Most Libby books on a Kindle e-reader, U.S. only",
      entityBValue: "Libby app on the iPad",
      winner: "tie",
    },
    {
      label: "Reading in bed",
      entityAValue: "7.4 oz (211 g), white-to-amber light",
      entityBValue: "477 g Wi-Fi, LED-backlit, True Tone",
      winner: "tie",
    },
    {
      label: "Beach and sun",
      entityAValue: "Light for bright sunlight. Paperwhite IPX8",
      entityBValue: "500 nits LED-backlit display",
      winner: "tie",
    },
    {
      label: "Kids",
      entityAValue: "Kids Kindles from $179.99 on 28 October 2026. No apps",
      entityBValue: "Full tablet with apps, web, and video",
      winner: "tie",
    },
    {
      label: "Battery",
      entityAValue: "Paperwhite up to 12 weeks. Colorsoft up to 8 weeks",
      entityBValue: "Up to 10 hours of web on Wi-Fi or video",
      winner: "tie",
    },
    {
      label: "Weight",
      entityAValue: "Paperwhite 7.4 oz (211 g)",
      entityBValue: "Wi-Fi 1.05 lb (477 g)",
      winner: "tie",
    },
    {
      label: "Water",
      entityAValue: "Paperwhite and Colorsoft IPX8, 2 m for 60 minutes",
      entityBValue: "Apple gives size and weight for iPad (A16)",
      winner: "tie",
    },
    {
      label: "Price on 2 Nov 2026",
      entityAValue: "Paperwhite $199.99 and $142.55 with 29 percent savings",
      entityBValue: "Wi-Fi 128GB $449",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("display", "Display", "Screen", KINDLE, IPAD, "Paperwhite 7-inch glare-free, 300 ppi, 16-level gray. Colorsoft 7-inch color", "11-inch Liquid Retina, LED-backlit IPS, True Tone, 500 nits"),
    textAttr("resolution", "Resolution", "Screen", KINDLE, IPAD, "Paperwhite 300 ppi. Colorsoft 300 ppi black and white, 150 ppi color", "2360 by 1640 at 264 ppi. Rectangle measure 10.86 inches"),
    textAttr("light", "Light", "Screen", KINDLE, IPAD, "White to amber, for bright sunlight or the dark. Colorsoft Dark Mode", "LED backlight, True Tone, 500 nits"),
    textAttr("battery", "Battery", "Battery", KINDLE, IPAD, "Paperwhite up to 12 weeks. Colorsoft up to 8 weeks. 6-inch Kindle up to 6 weeks in the 28 October 2026 lineup post", "28.93 Wh. Up to 10 hours of web on Wi-Fi or video. Cellular models up to 9 hours on cellular"),
    textAttr("weight", "Weight", "Design", KINDLE, IPAD, "Paperwhite 7.4 oz (211 g). Colorsoft 7.6 oz (215 g). Actual size and weight may vary", "Wi-Fi 1.05 lb (477 g). Wi-Fi + Cellular 1.06 lb (481 g)"),
    textAttr("size", "Size", "Design", KINDLE, IPAD, "Paperwhite and Colorsoft 5 x 7 x 0.3 in (127.6 x 176.7 x 7.8 mm)", "9.79 x 7.07 x 0.28 in (248.6 x 179.5 x 7 mm)"),
    textAttr("water", "Water", "Design", KINDLE, IPAD, "Paperwhite and Colorsoft: Waterproof (IPX8), 2 meters of fresh water for 60 minutes", "Apple specs give size, weight, and the LED display"),
    textAttr("storage", "Storage", "Capacity", KINDLE, IPAD, "Paperwhite and Colorsoft 16GB on the 2 November 2026 listings. Lineup post also lists 32GB Signature Editions", "128GB, 256GB, 512GB"),
    textAttr("stores", "Books and files", "Content", KINDLE, IPAD, "Kindle Store, over 15 million titles. Kindle+. Send to Kindle: HTML, RTF, TXT, JPEG, GIF, PNG, BMP, PDF, EPUB. Web upload 200 MB or smaller", "Kindle reading app, Libby app, built-in Apple Books for ebooks and audiobooks"),
    textAttr("library", "Public library", "Content", KINDLE, IPAD, "Most Libby books on a Kindle e-reader, U.S. only", "Libby app on the iPad"),
    textAttr("price", "Price, 2 Nov 2026", "Price", KINDLE, IPAD, `Paperwhite 16GB (2024 model) $199.99 and $142.55 with 29 percent savings. Colorsoft 16GB without Kindle+ $289.99 and $246.49 with 15 percent savings. ${PRICE_NOTE}`, "Wi-Fi $449 for 128GB, $549 for 256GB, $749 for 512GB. U.S. Apple Store"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "kindle-vs-kobo", title: "Kindle vs Kobo", category: "products" },
    { slug: "kindle-vs-physical-books", title: "Kindle vs Physical Books", category: "entertainment" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Kindle for long books, sunlight, and a battery Amazon rates in weeks. iPad (A16) for color comics, magazines, PDFs, and web or video on the same device.",
    keyFact:
      "Paperwhite: up to 12 weeks, 7.4 oz, IPX8, $199.99 and $142.55 with 29 percent savings on 2 November 2026. iPad (A16): up to 10 hours, 477 g Wi-Fi, $449 for 128GB Wi-Fi the same day.",
  },
  citationStats: {
    sourceCount: 12,
    dataPointCount: 28,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Amazon: Kindle Paperwhite 16GB (2024 model)", url: PAPERWHITE },
      { name: "Amazon: Kindle Colorsoft 16 GB (2024 model)", url: COLORSOFT },
      { name: "Amazon: redesigned Kindle lineup, 28 October 2026", url: LINEUP },
      { name: "Apple: iPad 11-inch (A16) tech specs", url: IPAD_SPECS },
      { name: "See vendor page for current price: iPad (A16) (Apple Store)", url: BUY_IPAD },
      { name: "Libby Help: Reading Kindle books on a Kindle e-reader", url: LIBBY_HELP },
      { name: "American Academy of Ophthalmology: Computers, digital devices, and eye strain", url: AAO },
      { name: "Amazon Help: Send to Kindle file types", url: SEND },
      { name: "Amazon: Kindle+ signup", url: KINDLE_PLUS },
      { name: "Apple Books", url: APPLE_BOOKS },
      { name: "App Store: Amazon Kindle reading app", url: KINDLE_APP },
      { name: "App Store: Libby, the library app", url: LIBBY_APP },
    ],
  },
  resources: [
    {
      type: "external",
      label: "See vendor page for current price: Kindle Paperwhite 16GB (Amazon)",
      url: PAPERWHITE,
      description:
        "2024 model. 7-inch glare-free display, 300 ppi, up to 12 weeks, 7.4 oz (211 g), 5 x 7 x 0.3 in, Waterproof (IPX8). On 2 November 2026: $199.99 and $142.55 with 29 percent savings.",
    },
    {
      type: "external",
      label: "See vendor page for current price: Kindle Colorsoft 16 GB (Amazon)",
      url: COLORSOFT,
      description:
        "2024 model. 7-inch color, 300 ppi black and white, 150 ppi color, up to 8 weeks, 7.6 oz (215 g), Dark Mode, Waterproof (IPX8). On 2 November 2026, without Kindle+: $289.99 and $246.49 with 15 percent savings.",
    },
    {
      type: "external",
      label: "Amazon: redesigned Kindle lineup, 28 October 2026",
      url: LINEUP,
      description:
        "6-inch Kindle from $149.99, up to 6 weeks. Paperwhite from $199.99, up to 12 weeks. Colorsoft from $289.99. Kids Kindles from $179.99.",
    },
    {
      type: "external",
      label: "Apple: iPad 11-inch (A16) tech specs",
      url: IPAD_SPECS,
      description:
        "11-inch Liquid Retina, 2360 by 1640 at 264 ppi, 500 nits, 477 g Wi-Fi, up to 10 hours, 28.93-watt-hour battery, A16 chip.",
    },
    {
      type: "external",
      label: "See vendor page for current price: iPad (A16) (Apple Store)",
      url: BUY_IPAD,
      description:
        "U.S. Apple Store on 2 November 2026: Wi-Fi $449 for 128GB, $549 for 256GB, $749 for 512GB.",
    },
    {
      type: "external",
      label: "Libby Help: Reading Kindle books on a Kindle e-reader",
      url: LIBBY_HELP,
      description:
        "Most Libby books can be read on a Kindle e-reader in the U.S. only. On a Fire tablet, Libby says to install Libby. Updated 3 September 2026.",
    },
    {
      type: "external",
      label: "American Academy of Ophthalmology: Computers, digital devices, and eye strain",
      url: AAO,
      description:
        "Screens do not permanently damage eyes. Digital eye strain can still blur, ache, and dry the eyes. Blink, look away, match brightness, reduce glare. Article dated 27 June 2024.",
    },
    {
      type: "external",
      label: "Amazon Help: Send to Kindle",
      url: SEND,
      description:
        "HTML, RTF, TXT, JPEG, GIF, PNG, BMP, PDF, and EPUB. Web uploads 200 MB or smaller. Send to Kindle works from the Kindle app for iOS.",
    },
    {
      type: "external",
      label: "Amazon: Kindle+ signup",
      url: KINDLE_PLUS,
      description: "Kindle Unlimited is now Kindle+. No monthly price was taken from this signup view.",
    },
    {
      type: "external",
      label: "Apple Books",
      url: APPLE_BOOKS,
      description: "Apple Books is a built-in app for finding, buying, listening to, and reading ebooks and audiobooks, including on iPad.",
    },
    {
      type: "external",
      label: "App Store: Amazon Kindle reading app",
      url: KINDLE_APP,
      description: "Amazon Kindle: Reading App, by AMZN Mobile LLC, on the U.S. App Store.",
    },
    {
      type: "external",
      label: "App Store: Libby, the library app",
      url: LIBBY_APP,
      description: "Libby, the library app, on the U.S. App Store.",
    },
  ],
  metaTitle: "Kindle vs iPad for Reading | A Versus B",
});

BUILT.metadata.metaDescription =
  "Kindle vs iPad for reading: Paperwhite up to 12 weeks and IPX8. iPad (A16) up to 10 hours. Store prices dated 2 November 2026.";

export const KINDLE_VS_IPAD: EditorialComparison = BUILT;
