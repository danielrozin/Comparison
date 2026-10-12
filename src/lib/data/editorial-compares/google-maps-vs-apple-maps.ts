import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-127 — Google Maps vs Apple Maps.
 * Claims below were checked against sources on 2026-09-30.
 * No page-level winner. No user counts, ratings, or battery-drain figures:
 * none of the cited sources publish a shared score for those.
 *
 * Apple's legal privacy statement (dated 2026-09-14) says Apple does
 * not collect personal data associated with Maps usage, and the same page
 * lists route details that are still sent. Both are quoted. That is not
 * flattened into "Apple collects nothing."
 */

const GOOGLE = "google-maps";
const APPLE = "apple-maps";

const APPLE_MAPS = "https://www.apple.com/maps/";
const APPLE_PRIVACY = "https://www.apple.com/legal/privacy/data/en/apple-maps/";
const APPLE_OFFLINE = "https://support.apple.com/en-us/105084";
const APPLE_DRIVE =
  "https://support.apple.com/guide/iphone/get-driving-directions-ipha84a94043/ios";
const APPLE_TRANSIT =
  "https://support.apple.com/guide/iphone/get-transit-directions-ipha44f57caa/26";
const APPLE_EV =
  "https://support.apple.com/guide/iphone/set-up-electric-vehicle-routing-iphc5e3a4b4b/ios";
const GMAPS_OFFLINE_IOS =
  "https://support.google.com/maps/answer/6291838?co=GENIE.Platform%3DiOS&hl=en";
const GMAPS_OFFLINE_ANDROID = "https://support.google.com/maps/answer/6291838?hl=en";
const GMAPS_DIRECTIONS =
  "https://support.google.com/maps/answer/144339?hl=en&co=GENIE.Platform%3DiOS";
const GMAPS_NAV = "https://support.google.com/maps/answer/3273406?hl=en";
const GMAPS_CARPLAY = "https://support.google.com/maps/answer/9432062?hl=en";
const AA_NAV = "https://support.google.com/androidauto/answer/6348322?hl=en";
const GMAPS_EV = "https://support.google.com/maps/answer/14788580?hl=en";
const GMAPS_EV_CAR = "https://support.google.com/maps/answer/9773205?hl=en";
const GMAPS_TIMELINE = "https://support.google.com/maps/answer/6258979?hl=en";

const SOURCE_DATE = "2026-09-30";
const PUBLISHED = "2026-09-30T00:00:00Z";

const SHORT_ANSWER =
  "It depends on the phone and the trip. Use Apple Maps when you are on an iPhone and want the built-in Maps app, and use Google Maps when you need Android or a saved offline area on either phone. Apple says it does not collect personal data associated with Maps usage, and it still sends route details under a random identifier for that trip. Apple's offline maps, in iOS 17 and later, cover select areas and include walking, cycling, and transit directions. Google's downloaded areas are for driving only, and they are not available in every country. Neither is better for everyone.";

const FAQS = [
  {
    question: "Should I use Apple Maps or Google Maps on an iPhone?",
    answer:
      "It depends on the trip. Apple says Maps works across Apple devices, including CarPlay, and the iPhone guide documents driving, walking, transit, and cycling. Offline maps in iOS 17 and later include those direction modes in select areas, and they do not sync between devices. Google Maps on iPhone and iPad documents the same kinds of trips, plus a downloadable offline area that guides a drive when the whole route is inside it. Pick Apple Maps when you want the built-in app and Apple's privacy wording. Pick Google Maps when you also use Android, or when you want Google's offline driving areas.",
  },
  {
    question: "Does Apple Maps work on Android?",
    answer:
      "Apple Maps works across Apple devices: iPhone, iPad, Mac, Apple Watch, HomePod, and CarPlay. Google Maps Help documents the app on Android and on iPhone and iPad, and Android Auto Help names Google Maps for voice-guided navigation.",
  },
  {
    question: "Can I download Apple Maps or Google Maps for offline use?",
    answer:
      "Both document offline maps, and they are not the same download. Apple says offline maps in iOS 17 and later include hours and ratings, turn-by-turn directions for driving, walking, cycling, or transit, and estimated arrival times. They are only in select areas, they do not sync across devices, and features vary by country. Google's iPhone, iPad, and Android articles say you can download an area and drive with it if the whole route is inside the map. Offline transit, bicycling, and walking directions are unavailable, an offline drive has no traffic or alternate routes, and some countries cannot download the maps.",
  },
  {
    question: "Which app is better for transit, walking, and lane guidance?",
    answer:
      "Both document those trips, with limits. Apple's transit guide covers departure times, connections, and fares. Apple says that in select cities you get a street-level view that helps you find the right lane at a complex intersection, and that spoken turn-by-turn directions are not available in every country. Google lists transit, walking, and cycling, and says transit depends on the local agency adding its routes. Google says voice guidance can tell you which lane to use, and that this is not available in all countries. Neither lane prompt is scored as clearer.",
  },
  {
    question: "Do Apple Maps and Google Maps route electric cars to chargers?",
    answer:
      "Both describe charging help, for some cars and places. Apple's iPhone guide says EV routing is on select vehicles and in select areas. Maps can track the charge, look at elevation, and add charging stations, with real-time availability for select providers and countries. You can set it up through CarPlay or a car maker's app. Google says that in some countries you can add an EV, filter stations by your plugs, and see a battery estimate on Maps app version 25.44 and up. That estimate uses the vehicle info you entered. It does not adjust to real-time driving or a live connection to the car. A separate article, only for Google Maps built into the car, says charging stops can be added automatically if you will not reach the destination. Do not read the car-built-in article as a promise about the phone app.",
  },
  {
    question: "Which app is more private?",
    answer:
      "Neither is better for everyone; it depends on the privacy controls. Apple says, in wording dated 14 September 2026, that it does not collect personal data associated with your Maps usage, that you do not have to sign in, and that precise locations are converted to less-exact locations within 24 hours. Apple says a navigation request sends the origin, the destination, the mode of transport, including whether you are on CarPlay, and a random identifier that lasts for that session. Google says Timeline is off by default and turns on only if you opt in. It saves visits and routes on signed-in devices. If you turn backup on, Maps saves an encrypted copy on Google's servers. Those are different controls, not a shared score.",
  },
];

const VERDICT = `Best on an iPhone, if you want the built-in app and Apple's privacy wording: Apple Maps. Offline maps in select areas include walking, cycling, and transit. Apple says it does not collect personal data associated with Maps usage, and it still sends the route under a random identifier.

Best when you need Android, or a saved offline driving area on either phone: Google Maps. Help articles document the Android app, Android Auto, and downloadable areas. Timeline stays off until you opt in.

Neither is better for everyone; it depends on the phone and the trip.`;

const EXPERT_ANALYSIS = `It depends on the phone and the trip. Apple Maps is the built-in app on Apple devices. Google Maps is the app that also runs on Android. Neither is better for everyone.

Where the apps run

Apple says Maps works across your Apple devices, and it describes CarPlay as Maps behind the wheel. It says Maps is available in over two hundred regions, and that some features are not available in every country. Google Maps Help documents the app on Android and on iPhone and iPad. Android Auto Help says you get voice-guided navigation, arrival times, live traffic, and lane guidance with Google Maps or another navigation app. Google Maps also has its own CarPlay article.

Offline maps

Apple's support article is for iOS 17 and later. Offline maps include hours and ratings, turn-by-turn directions for driving, walking, cycling, or transit, and estimated arrival times. They do not sync across devices. They are only available in select areas, and a map for one region is not meant for every region. Google's iPhone, iPad, and Android articles say you save an area and use it when the connection is slow or gone, if the whole driving route is inside the map. Offline transit, bicycling, and walking directions are unavailable. An offline drive has no traffic info or alternate routes. You cannot download offline maps in some countries. The practical split is the download, not a speed test: Apple's offline article includes walking, cycling, and transit. Google's offline articles keep those modes online.

Transit, walking, and lanes

Both document trips that are not only driving. Apple's transit guide says you can get departure times, connection information, and fare amounts, and that some transit systems can use Apple Pay inside Maps. Apple says that in select cities you see crosswalks, bike lanes, and a street-level view that helps you find the right lane at a complex intersection. Spoken turn-by-turn directions are not available in every country. Apple also says lane guidance prepares you for turns and exits. Google's iPhone and iPad directions article lists driving, public transit, walking, ride sharing, cycling, flight, and motorcycle, and says not every city has transit directions. Google says voice navigation can tell you which lane to use, and that lane guidance is not available in all countries.

Electric vehicles

Apple's iPhone guide says EV routing is available on select vehicles and in select areas, and that features vary by country. Maps can track the charge, use elevation and other factors, identify charging stations along the way, and, for select providers and countries, show real-time availability. Setup can go through CarPlay or through the car maker's app. Google's phone article is narrower than a slogan. In some countries you add the vehicle, filter charging stations by your plugs, and, on Maps version 25.44 and up for a compatible EV, see an estimated battery use that does not follow live driving or a live link to the car. The article titled for Google Maps built into your electric vehicle says that if you will not reach the destination, charging stops are added along the route. Google says it is only for Maps built into the car, and that features depend on the manufacturer, the region, and the data plan.

Privacy, read as written

Apple says Maps is designed to protect your privacy and that Apple does not collect personal data associated with your Maps usage. It also says you do not have to sign in, that signed-in pins and guides can sync with end-to-end encryption, and that precise locations are converted to less-exact locations within 24 hours. A navigation request still sends the origin, the current location if you allowed it, the destination, the mode of transport, including CarPlay, and a random identifier for that session. If you use EV routing, charge information is sent and is not tied to your Apple Account. Apple's shorter line, that Maps does not let Apple know which stores, neighborhoods, or clinics you visit, sits next to that legal text. The legal statement is the fuller account.

Google says Timeline is off by default for the Google Account and turns on only if you opt in. Timeline saves visits and routes on each signed-in device. If backup is on, Maps saves an encrypted copy on Google's servers. You can delete Timeline data. Neither design is called the private one. The controls are the ones the two companies describe.

Who should use which

Use Apple Maps on an iPhone when the built-in app, CarPlay, and Apple's privacy wording are what you want, and you accept that offline maps exist only in select areas. Use Google Maps when the phone is Android, when you want Android Auto, or when you want a downloaded driving area on iPhone or Android. Use either for transit, walking, cycling, lane prompts, and EV charging help, and check the limit for your city and your car.`;

export const GOOGLE_MAPS_VS_APPLE_MAPS: EditorialComparison = buildEditorialComparison({
  slug: "google-maps-vs-apple-maps",
  title: "Google Maps vs Apple Maps: Which Should You Use?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: GOOGLE,
      slug: GOOGLE,
      name: "Google Maps",
      shortDesc:
        "Navigation on Android and on iPhone and iPad, with downloadable offline driving areas and Android Auto.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Help articles document the Android app and the iPhone and iPad app",
        "Download an offline driving area on iPhone, iPad, and Android",
        "Transit, walking, and cycling directions on iPhone and iPad",
        "Voice navigation can say which lane to use, not in every country",
        "Android Auto Help names Google Maps; Google also documents CarPlay",
        "Timeline is off until you opt in",
      ],
      cons: [
        "Offline transit, walking, and cycling directions are unavailable",
        "An offline drive has no traffic info or alternate routes",
        "Offline downloads are blocked in some countries",
        "The phone's EV battery estimate is not a live reading from the car",
        "If you opt in and turn backup on, Timeline stores an encrypted copy on Google's servers",
      ],
      bestFor: "Best when you need Android or an offline driving area",
    },
    {
      id: APPLE,
      slug: APPLE,
      name: "Apple Maps",
      shortDesc:
        "The built-in Maps app on Apple devices, with offline maps in select areas and Apple's privacy wording.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Built in on iPhone, iPad, Mac, Apple Watch, HomePod, and CarPlay",
        "Offline maps in iOS 17 and later include driving, walking, cycling, and transit in select areas",
        "Lane guidance at complex intersections in select cities",
        "EV routing on select vehicles, including charging stops along the route",
        "Privacy page: no personal data associated with Maps usage, and no sign-in required",
      ],
      cons: [
                "Offline maps do not sync between devices and exist only in select areas",
        "Spoken turn-by-turn directions are not available in every country",
        "EV routing is limited to select vehicles and areas",
        "A navigation request still sends the route under a random identifier for that session",
      ],
      bestFor: "Best built-in app on an iPhone",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Android, or an offline driving area on either phone",
      entityBValue: "The built-in app on an iPhone",
      winner: "tie",
    },
    {
      label: "Android",
      entityAValue: "Documented on Android and in Android Auto Help",
      entityBValue: "iPhone, iPad, Mac, Apple Watch, HomePod, and CarPlay",
      winner: "a",
    },
    {
      label: "Offline maps",
      entityAValue: "Driving only, if the whole route is inside the area",
      entityBValue: "Driving, walking, cycling, and transit in select areas",
      winner: "tie",
    },
    {
      label: "Lane guidance",
      entityAValue: "Voice prompt for which lane to use, not every country",
      entityBValue: "Right-lane help at complex intersections, in select cities",
      winner: "tie",
    },
    {
      label: "EV charging help",
      entityAValue: "Plug filter and a non-live battery estimate on the phone",
      entityBValue: "Charging stops on select vehicles and in select areas",
      winner: "tie",
    },
    {
      label: "Location diary",
      entityAValue: "Timeline is off until you opt in",
      entityBValue: "No personal Maps data, per Apple; route still sent",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "platforms",
      "Where it runs",
      "Product and help pages",
      GOOGLE,
      APPLE,
      "Android, iPhone, and iPad help articles. Android Auto Help names Google Maps. A CarPlay article too.",
      "iPhone, iPad, Mac, Apple Watch, HomePod, and CarPlay",
      "a"
    ),
    textAttr(
      "offline-maps",
      "Offline maps",
      "Help articles",
      GOOGLE,
      APPLE,
      "Download an area on iPhone, iPad, and Android. Driving only. No offline traffic or alternate routes. Blocked in some countries.",
      "iOS 17 and later. Driving, walking, cycling, and transit in select areas. Does not sync between devices."
    ),
    textAttr(
      "other-modes",
      "Transit and walking",
      "Help articles",
      GOOGLE,
      APPLE,
      "Transit, walking, and cycling on iPhone and iPad. Transit is not in every city.",
      "Transit guide: departures, connections, and fares. Driving guide also lists walking and cycling."
    ),
    textAttr(
      "lane-guidance",
      "Lane guidance",
      "Help articles",
      GOOGLE,
      APPLE,
      "Voice navigation can say which lane to use. Not available in all countries.",
      "In select cities, a street-level view helps you find the right lane. Spoken directions are not in every country."
    ),
    textAttr(
      "ev-routing",
      "EV charging help",
      "Help articles",
      GOOGLE,
      APPLE,
      "On the phone, some countries: plug filter and a battery estimate that is not live from the car. Built-in car Maps can add chargers automatically.",
      "Select vehicles and areas. Maps can add charging stations and, for select providers, show live availability."
    ),
    textAttr(
      "carplay",
      "Apple CarPlay",
      "Product and help pages",
      GOOGLE,
      APPLE,
      "Google Maps Help documents search, stops, and incident reports on CarPlay.",
      "Apple describes CarPlay as Maps behind the wheel. The EV guide includes a CarPlay setup."
    ),
    textAttr(
      "privacy",
      "Location diary",
      "Privacy pages",
      GOOGLE,
      APPLE,
      "Timeline is off by default. Opt in to save visits and routes. Backup stores an encrypted copy on Google's servers.",
      "Apple says it does not collect personal data associated with Maps usage. A trip still sends the route under a random identifier."
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "google-maps-vs-waze",
      title: "Google Maps vs Waze",
      category: "technology",
    },
    {
      slug: "android-vs-ios",
      title: "Android vs iOS",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Use Apple Maps for the built-in iPhone app. Use Google Maps when you need Android or a saved offline driving area on either phone.",
    keyFact:
      "Apple's offline maps in iOS 17 and later include walking, cycling, and transit in select areas. Google's downloaded areas are for driving, and offline transit, walking, and cycling directions are unavailable.",
  },
  citationStats: {
    sourceCount: 15,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Apple — Maps", url: APPLE_MAPS },
      {
        name: "Apple — Maps and Privacy (page dated 2026-09-14)",
        url: APPLE_PRIVACY,
      },
      { name: "Apple Support — offline maps", url: APPLE_OFFLINE },
      { name: "Apple Support — driving directions", url: APPLE_DRIVE },
      { name: "Apple Support — transit directions", url: APPLE_TRANSIT },
      { name: "Apple Support — EV routing", url: APPLE_EV },
      { name: "Google Maps Help — offline maps, iPhone and iPad", url: GMAPS_OFFLINE_IOS },
      { name: "Google Maps Help — offline maps, Android", url: GMAPS_OFFLINE_ANDROID },
      { name: "Google Maps Help — directions, iPhone and iPad", url: GMAPS_DIRECTIONS },
      { name: "Google Maps Help — navigation, Android", url: GMAPS_NAV },
      { name: "Google Maps Help — CarPlay", url: GMAPS_CARPLAY },
      { name: "Android Auto Help — turn-by-turn navigation", url: AA_NAV },
      { name: "Google Maps Help — vehicle profile and EV", url: GMAPS_EV },
      {
        name: "Google Maps Help — Maps built into an electric vehicle",
        url: GMAPS_EV_CAR,
      },
      { name: "Google Maps Help — Timeline", url: GMAPS_TIMELINE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Apple Maps",
      url: APPLE_MAPS,
      description:
        "Works on iPhone, iPad, Mac, Apple Watch, HomePod, and CarPlay, with lane guidance, EV charging stops, transit, and coverage in over two hundred regions.",
    },
    {
      type: "external",
      label: "Apple Maps and Privacy",
      url: APPLE_PRIVACY,
      description:
        "Page dated 2026-09-14. No personal data associated with Maps usage. A navigation request still sends the route under a random identifier.",
    },
    {
      type: "external",
      label: "Apple offline maps",
      url: APPLE_OFFLINE,
      description:
        "iOS 17 and later. Driving, walking, cycling, and transit in select areas. Maps do not sync between devices.",
    },
    {
      type: "external",
      label: "Apple driving directions",
      url: APPLE_DRIVE,
      description:
        "In select cities, a street-level view helps you find the right lane. Spoken directions are not in every country.",
    },
    {
      type: "external",
      label: "Apple transit directions",
      url: APPLE_TRANSIT,
      description:
        "Departure times, connections, and fares. Some systems can pay with Apple Pay inside Maps.",
    },
    {
      type: "external",
      label: "Apple EV routing",
      url: APPLE_EV,
      description:
        "Select vehicles and areas. Charging stations along the route, with live availability for select providers.",
    },
    {
      type: "external",
      label: "Google Maps offline maps on iPhone and iPad",
      url: GMAPS_OFFLINE_IOS,
      description:
        "Download an area. Offline transit, walking, and cycling directions are unavailable.",
    },
    {
      type: "external",
      label: "Google Maps offline maps on Android",
      url: GMAPS_OFFLINE_ANDROID,
      description:
        "Same offline driving rules on Android, and downloads are blocked in some countries.",
    },
    {
      type: "external",
      label: "Google Maps directions on iPhone and iPad",
      url: GMAPS_DIRECTIONS,
      description:
        "Driving, transit, walking, cycling, rideshare, flight, and motorcycle.",
    },
    {
      type: "external",
      label: "Google Maps navigation on Android",
      url: GMAPS_NAV,
      description:
        "Voice guidance can say which lane to use. Not available in all countries.",
    },
    {
      type: "external",
      label: "Google Maps on CarPlay",
      url: GMAPS_CARPLAY,
      description: "Search, stops, and incident reports on Apple CarPlay.",
    },
    {
      type: "external",
      label: "Android Auto turn-by-turn navigation",
      url: AA_NAV,
      description:
        "Names Google Maps for voice guidance, arrival times, live traffic, and lane guidance.",
    },
    {
      type: "external",
      label: "Google Maps vehicle profile",
      url: GMAPS_EV,
      description:
        "Phone EV profile: plug filter and a battery estimate that is not live from the car.",
    },
    {
      type: "external",
      label: "Google Maps built into an electric vehicle",
      url: GMAPS_EV_CAR,
      description:
        "Only for Maps built into the car. Charging stops can be added automatically. Not a phone-app promise.",
    },
    {
      type: "external",
      label: "Google Maps Timeline",
      url: GMAPS_TIMELINE,
      description:
        "Timeline is off by default. Backup stores an encrypted copy on Google's servers.",
    },
  ],
  metaTitle: "Google Maps vs Apple Maps: Which? | A Versus B",
});
