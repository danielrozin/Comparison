import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-127 — Google Maps vs Waze.
 * Claims below were checked against pages fetched on 2026-09-30.
 * No page-level winner. No battery-drain, speed, or user-count comparison:
 * Google's help pages fetched here do not publish a Maps user count, and
 * Waze's About page states its own monthly figure without a Google Maps number
 * beside it.
 *
 * Two Waze Help articles disagree about a dropped connection during a report.
 * About Waze says Waze does not cache reports to send later. The hazard article
 * says a report started offline is saved and sent when you reconnect. This page
 * quotes both and does not pick one.
 */

const MAPS = "google-maps";
const WAZE = "waze";

const GMAPS_OFFLINE_IOS =
  "https://support.google.com/maps/answer/6291838?co=GENIE.Platform%3DiOS&hl=en";
const GMAPS_OFFLINE_ANDROID = "https://support.google.com/maps/answer/6291838?hl=en";
const GMAPS_DIRECTIONS =
  "https://support.google.com/maps/answer/144339?hl=en&co=GENIE.Platform%3DiOS";
const GMAPS_NAV = "https://support.google.com/maps/answer/3273406?hl=en";
const GMAPS_CARPLAY = "https://support.google.com/maps/answer/9432062?hl=en";
const AA_NAV = "https://support.google.com/androidauto/answer/6348322?hl=en";
const GMAPS_EV = "https://support.google.com/maps/answer/14788580?hl=en";
const GMAPS_TIMELINE = "https://support.google.com/maps/answer/6258979?hl=en";
const WAZE_ABOUT = "https://support.google.com/waze/answer/6071177?hl=en";
const WAZE_AVAIL = "https://support.google.com/waze/answer/6071125?hl=en";
const WAZE_HAZARD = "https://support.google.com/waze/answer/13739290?hl=en";
const WAZE_AA = "https://support.google.com/waze/answer/15113302?hl=en";
const WAZE_CARPLAY = "https://support.google.com/waze/answer/9123774?hl=en";
const WAZE_PARKING = "https://support.google.com/waze/answer/7052890?hl=en";

const FETCHED = "2026-09-30";
const PUBLISHED = "2026-09-30T00:00:00Z";

const SHORT_ANSWER =
  "It depends on the trip. Use Waze when you want other drivers' reports of traffic, crashes, police, and hazards and you can keep a data connection. Use Google Maps when you need a saved offline area, or directions for transit, walking, or cycling. Google Maps Help documents those modes on iPhone and iPad, and offline maps on iPhone, iPad, and Android. Waze's About page says that without an internet connection you cannot locate or navigate a route. This page does not crown a winner.";

const FAQS = [
  {
    question: "Should I use Waze or Google Maps for driving?",
    answer:
      "It depends on the drive. Waze's About page says the maps and navigation are powered by users, and that drivers can report traffic, accidents, police traps, blocked roads, and weather. Google's Android navigation article also lets you report a crash, slowdown, mobile speed camera, police, construction, and other incidents, and it says some incident types are only available in certain countries. Pick Waze when those community reports are the point and you will stay online. Pick Google Maps when you also need an offline area or a mode other than driving.",
  },
  {
    question: "Can Google Maps or Waze navigate offline?",
    answer:
      "Google Maps can, with limits. The iPhone, iPad, and Android help articles say you can download an area and use it when the connection is slow or gone, as long as the whole route is inside that area. They also say offline transit, bicycling, and walking directions are unavailable, and an offline drive has no traffic info or alternate routes. Some countries cannot download offline maps. Waze's About page says Waze assumes a data connection, and that without internet you cannot locate or navigate a route. Two Waze articles disagree about a report if the connection drops while you are reporting: About Waze says reports are not cached to send later, and the hazard article says the report is saved and sent when you reconnect. This page does not choose between those two sentences.",
  },
  {
    question: "Do Google Maps and Waze work on CarPlay and Android Auto?",
    answer:
      "Yes, on the help pages fetched for this comparison. Google Maps has a CarPlay article, and the Android navigation article mentions Android Auto for 3D map details during driving navigation. Android Auto Help says you get voice-guided navigation, arrival times, live traffic, and lane guidance with Google Maps or another navigation app, and it names Waze. Waze has its own Android Auto article and its own CarPlay article. The CarPlay article says Waze on CarPlay is a limited version of the mobile app, so some features might not be available. Car support still depends on the vehicle.",
  },
  {
    question: "Does Waze support transit, bicycle, or truck lanes?",
    answer:
      "Not for transit lanes. Waze's About page says Waze was created for private cars, motorcycles, and taxis, and that it does not currently support navigating in lanes dedicated to public transportation, bicycles, or trucks. Google's iPhone and iPad directions article lists driving, public transit, walking, ride sharing, cycling, flight, and motorcycle. It also says not every city has transit directions, because the local agency has to add its routes.",
  },
  {
    question: "Which app keeps more of my location data?",
    answer:
      "This page does not crown one. Google's Timeline article says Timeline is off by default and turns on only if you opt in. Timeline saves visits and routes on each signed-in device. If you turn on backup, Maps saves an encrypted copy on Google's servers. Waze's About page says that driving with Waze open shares real-time information used for speed, road layout, and routing, and that you can adjust privacy settings. Those are different designs. The pages fetched here do not publish a shared score for them.",
  },
];

const VERDICT = `Best for live driver reports, if you can stay online: Waze. The About page describes a community that reports traffic, accidents, police, hazards, and weather, and says the navigation is powered by people driving with the app open.

Best for offline areas, transit, walking, and cycling: Google Maps. Help articles document downloadable areas and those direction modes, with the limits named on those pages.

There is no single winner on this page.`;

const EXPERT_ANALYSIS = `It depends on the trip. Waze fits a drive where you want other drivers' reports and you can keep a data connection. Google Maps fits a saved offline area, and trips that are not only driving. This page does not crown one app.

Spec table. Caption: Google Maps vs Waze, from official help articles. Source note: every row is a claim from a Google Maps, Android Auto, or Waze Help page fetched on 30 September 2026. Where a help page was not fetched, the cell says so. This page does not turn that gap into a claim that the feature is missing.

Sources fetched on 30 September 2026: Google Maps offline help for iPhone and iPad, Google Maps offline help for Android, Google Maps directions for iPhone and iPad, Google Maps navigation for Android, Google Maps on CarPlay, Android Auto turn-by-turn navigation, Google Maps vehicle profiles, Google Maps Timeline, About Waze, Waze availability and cost, Waze road-hazard reports, Waze on Android Auto, Waze on Apple CarPlay, and Waze parking.

Offline maps

Google Maps can guide a drive from a downloaded area. The iPhone, iPad, and Android articles say you save an area to the phone or tablet and use it when the connection is slow or unavailable, if the whole route is inside the map. They also say you cannot download offline maps in some countries, and that offline transit, bicycling, and walking directions are unavailable. An offline drive does not get traffic info or alternate routes. Waze's About page answers "Can I use Waze without an internet connection?" by saying that without internet you will not be able to locate or navigate a route, and that every part of Waze needs an active data connection.

Direction modes

Google Maps documents more than driving. The iPhone and iPad directions article lists driving, public transit, walking, ride sharing, cycling, flight, and motorcycle. Transit is not in every city. Waze's About page says the app was created for private cars, motorcycles, and taxis, and that it does not currently support navigating in lanes dedicated to public transportation, bicycles, or trucks.

Driver reports

Both products document incident reports. Waze's About page says you can report traffic, accidents, police traps, blocked roads, weather, and more, and that the maps are powered by users. The About page states about 180 million monthly active users. That figure is Waze's, on the page fetched 30 September 2026. This page does not pair it with a Google Maps user count, because the Google pages fetched here do not publish one. The hazard article lists construction, a car on the shoulder, a broken traffic light, a pothole, and an object, and it documents the same report flow on Android Auto and CarPlay. Google's Android navigation article lists crash, slowdown, mobile speed camera, police, construction, lane closure, an object on the road, a flooded road, low visibility, and an unplowed road, and says some incidents can only be reported in certain countries. The CarPlay article lists a similar set, without the word crash.

One Waze contradiction, left unresolved

About Waze says that if Waze has no connection back to its servers, you cannot report hazards, and that Waze does not cache reports or map issues to send later. The hazard article's own FAQ says that if you lose the connection while reporting, Waze saves the report and submits it when you reconnect. Both pages were fetched on 30 September 2026. This page does not decide which sentence is current.

Lane guidance

Google's Android navigation article says voice navigation can tell you which lane to use, and that lane guidance is not available in all countries. Android Auto Help says lane guidance is part of navigation with Google Maps or another navigation app, and it names Waze in that sentence. None of the Waze Help pages fetched for this comparison describe lane guidance as its own feature. That is a gap in the pages read here, not a finding that Waze never shows a lane.

CarPlay and Android Auto

Both are documented on both systems. Google Maps has a CarPlay article for search, stops, and incident types. Android Auto Help tells you to open Google Maps, or another navigation app, for voice guidance, arrival times, and live traffic. Waze's Android Auto article says Android Auto brings Waze to the car display, and its report list includes traffic, police, crash, hazard, bad weather, a blocked lane, and a map issue. Waze's CarPlay article says you need a compatible iPhone and a car that supports CarPlay in one of the listed regions, and that Waze on CarPlay is a limited version of the mobile app.

Platforms and EV help

Waze's availability article says the app is in the Apple App Store for iPhone and iPad and in Google Play for Android, on iOS 16 and above and Android 10 and above, and that the phone needs GPS and a cellular connection. It is free to download, and carrier data rates still apply. Google Maps Help documents the app on Android and on iPhone and iPad. The vehicle-profile article says that in some countries you can add an electric vehicle and then filter charging stations by your plugs, and that a compatible EV on Maps app version 25.44 and up can show an estimated battery use for the trip. That estimate depends on the vehicle info you entered and does not adjust to real-time driving or a live connection to the car. No Waze Help page fetched here describes electric-vehicle routing.

Who should use which

Use Waze for a drive where the community reports are why you opened the app, and you expect a data connection the whole way. Use Google Maps when the route may leave coverage, or when the trip is transit, walking, or cycling. Privacy is not a tie-breaker on this page: Google's Timeline is off until you opt in, and Waze says driving with the app open shares real-time road information you can limit in settings.`;

export const GOOGLE_MAPS_VS_WAZE: EditorialComparison = buildEditorialComparison({
  slug: "google-maps-vs-waze",
  title: "Google Maps vs Waze: Which Should You Use?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: MAPS,
      slug: MAPS,
      name: "Google Maps",
      shortDesc:
        "Driving, transit, walking, and cycling directions, with downloadable offline areas on iPhone, iPad, and Android.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Download an offline area on iPhone, iPad, and Android (Google Maps Help)",
        "Driving, transit, walking, cycling, rideshare, flight, and motorcycle directions on iPhone and iPad",
        "Voice navigation can say which lane to use, not in every country",
        "Documented on Apple CarPlay and in Android Auto Help",
        "In some countries, an EV profile can filter plugs and estimate battery use",
      ],
      cons: [
        "Offline transit, walking, and cycling directions are unavailable",
        "An offline drive has no traffic info or alternate routes",
        "Offline downloads are blocked in some countries",
        "Some incident types can only be reported in certain countries",
        "Timeline is off by default; if you opt in and back it up, an encrypted copy is stored on Google's servers",
      ],
      bestFor: "Best for offline areas and for transit, walking, or cycling",
    },
    {
      id: WAZE,
      slug: WAZE,
      name: "Waze",
      shortDesc:
        "A driver community app for traffic, crash, police, and hazard reports, on iOS 16+ and Android 10+.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Reports for traffic, accidents, police, hazards, and weather (About Waze)",
        "About Waze says the maps are powered by users, and states about 180 million monthly active users",
        "Hazard, police, and traffic reports are documented on Android Auto and CarPlay",
        "Free to download on iOS 16+ and Android 10+ (carrier data rates still apply)",
      ],
      cons: [
        "Without an internet connection you cannot locate or navigate a route",
        "Does not currently support navigating in public-transport, bicycle, or truck lanes",
        "Waze on CarPlay is a limited version of the phone app",
        "The phone needs GPS and a cellular connection",
      ],
      bestFor: "Best for driver reports when you can stay online",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Offline areas, transit, walking, cycling",
      entityBValue: "Live driver reports, if you stay online",
      winner: "tie",
    },
    {
      label: "Offline navigation",
      entityAValue: "Download an area; the whole route must be inside it",
      entityBValue: "Cannot locate or navigate without internet",
      winner: "a",
    },
    {
      label: "Beyond driving",
      entityAValue: "Transit, walking, and cycling are documented",
      entityBValue: "No public-transport, bicycle, or truck lanes",
      winner: "a",
    },
    {
      label: "Driver reports",
      entityAValue: "Crash, police, speed camera, construction, and more",
      entityBValue: "Traffic, accidents, police, hazards, and weather",
      winner: "tie",
    },
    {
      label: "CarPlay and Android Auto",
      entityAValue: "Documented on both",
      entityBValue: "Documented on both; CarPlay is a limited app",
      winner: "tie",
    },
    {
      label: "Location diary",
      entityAValue: "Timeline is off until you opt in",
      entityBValue: "Driving with the app open shares road data",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "offline-navigation",
      "Offline navigation",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "Download an area on iPhone, iPad, and Android. The whole route must be inside it. No offline traffic or alternate routes.",
      "About Waze: without internet you cannot locate or navigate a route.",
      "a"
    ),
    textAttr(
      "direction-modes",
      "Direction modes",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "Driving, transit, walking, cycling, rideshare, flight, motorcycle. Transit is not in every city.",
      "Private cars, motorcycles, and taxis. No public-transport, bicycle, or truck lanes.",
      "a"
    ),
    textAttr(
      "driver-reports",
      "Driver reports",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "Crash, slowdown, mobile speed camera, police, construction, and other types. Some types are country-limited.",
      "Traffic, accidents, police, hazards, blocked roads, and weather. About 180 million monthly active users, per About Waze."
    ),
    textAttr(
      "lane-guidance",
      "Lane guidance",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "Voice navigation can say which lane to use. Not available in all countries.",
      "Not described in the Waze Help pages fetched for this page."
    ),
    textAttr(
      "carplay",
      "Apple CarPlay",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "Google Maps Help documents search, stops, and incident reports on CarPlay.",
      "Waze Help documents CarPlay. It says the CarPlay app is a limited version of the phone app."
    ),
    textAttr(
      "android-auto",
      "Android Auto",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "Android Auto Help names Google Maps for voice guidance, live traffic, and lane guidance.",
      "Waze Help documents navigation and incident reports on Android Auto."
    ),
    textAttr(
      "platforms",
      "Phone platforms",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "Help articles document the Android app and the iPhone and iPad app.",
      "App Store and Google Play. iOS 16 and above, Android 10 and above. Needs GPS and cellular."
    ),
    textAttr(
      "ev-help",
      "Electric-vehicle help",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "In some countries, add an EV to filter plugs and see a battery estimate. The estimate is not live from the car.",
      "Not described in the Waze Help pages fetched for this page.",
      "a"
    ),
    textAttr(
      "location-data",
      "Location diary",
      "Help articles · fetched 2026-09-30",
      MAPS,
      WAZE,
      "Timeline is off by default. Opt in to save visits and routes. Backup stores an encrypted copy on Google's servers.",
      "Driving with Waze open shares real-time road information. Privacy settings can be changed."
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "google-maps-vs-apple-maps",
      title: "Google Maps vs Apple Maps",
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
      "Use Waze for live driver reports when you can stay online. Use Google Maps for offline areas and for transit, walking, or cycling.",
    keyFact:
      "Waze's About page says that without an internet connection you cannot locate or navigate a route. Google Maps Help says a downloaded area can guide a drive when the whole route is inside that area.",
  },
  citationStats: {
    sourceCount: 14,
    dataPointCount: 9,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "Google Maps Help — offline maps, iPhone and iPad (fetched 2026-09-30)", url: GMAPS_OFFLINE_IOS },
      { name: "Google Maps Help — offline maps, Android (fetched 2026-09-30)", url: GMAPS_OFFLINE_ANDROID },
      { name: "Google Maps Help — directions, iPhone and iPad (fetched 2026-09-30)", url: GMAPS_DIRECTIONS },
      { name: "Google Maps Help — navigation, Android (fetched 2026-09-30)", url: GMAPS_NAV },
      { name: "Google Maps Help — CarPlay (fetched 2026-09-30)", url: GMAPS_CARPLAY },
      { name: "Android Auto Help — turn-by-turn navigation (fetched 2026-09-30)", url: AA_NAV },
      { name: "Google Maps Help — vehicle profile and EV (fetched 2026-09-30)", url: GMAPS_EV },
      { name: "Google Maps Help — Timeline (fetched 2026-09-30)", url: GMAPS_TIMELINE },
      { name: "Waze Help — About Waze (fetched 2026-09-30)", url: WAZE_ABOUT },
      { name: "Waze Help — availability and cost (fetched 2026-09-30)", url: WAZE_AVAIL },
      { name: "Waze Help — report road hazards (fetched 2026-09-30)", url: WAZE_HAZARD },
      { name: "Waze Help — Android Auto (fetched 2026-09-30)", url: WAZE_AA },
      { name: "Waze Help — Apple CarPlay (fetched 2026-09-30)", url: WAZE_CARPLAY },
      { name: "Waze Help — find parking (fetched 2026-09-30)", url: WAZE_PARKING },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Google Maps offline maps on iPhone and iPad",
      url: GMAPS_OFFLINE_IOS,
      description:
        "Fetched 2026-09-30. Download an area, country limits, and no offline transit, walking, cycling, traffic, or alternate routes.",
    },
    {
      type: "external",
      label: "Google Maps offline maps on Android",
      url: GMAPS_OFFLINE_ANDROID,
      description:
        "Fetched 2026-09-30. Same offline rules on Android: the whole route must be inside the downloaded area.",
    },
    {
      type: "external",
      label: "Google Maps directions on iPhone and iPad",
      url: GMAPS_DIRECTIONS,
      description:
        "Fetched 2026-09-30. Driving, transit, walking, rideshare, cycling, flight, and motorcycle. Transit is not in every city.",
    },
    {
      type: "external",
      label: "Google Maps navigation on Android",
      url: GMAPS_NAV,
      description:
        "Fetched 2026-09-30. Lane guidance is not in every country. Incident report types, including police and speed cameras.",
    },
    {
      type: "external",
      label: "Google Maps on CarPlay",
      url: GMAPS_CARPLAY,
      description:
        "Fetched 2026-09-30. Search, stops, and incident types on Apple CarPlay.",
    },
    {
      type: "external",
      label: "Android Auto turn-by-turn navigation",
      url: AA_NAV,
      description:
        "Fetched 2026-09-30. Names Google Maps and Waze for voice guidance, arrival times, live traffic, and lane guidance.",
    },
    {
      type: "external",
      label: "Google Maps vehicle profile",
      url: GMAPS_EV,
      description:
        "Fetched 2026-09-30. EV plug filter and battery estimate in some countries. The estimate is not a live car connection.",
    },
    {
      type: "external",
      label: "Google Maps Timeline",
      url: GMAPS_TIMELINE,
      description:
        "Fetched 2026-09-30. Timeline is off by default. Backup stores an encrypted copy on Google's servers.",
    },
    {
      type: "external",
      label: "About Waze",
      url: WAZE_ABOUT,
      description:
        "Fetched 2026-09-30. Community reports, about 180 million monthly active users, no offline navigation, and no public-transport, bicycle, or truck lanes.",
    },
    {
      type: "external",
      label: "Waze availability and cost",
      url: WAZE_AVAIL,
      description:
        "Fetched 2026-09-30. App Store and Google Play, iOS 16+, Android 10+, GPS and cellular required. Free to download.",
    },
    {
      type: "external",
      label: "Waze road hazard reports",
      url: WAZE_HAZARD,
      description:
        "Fetched 2026-09-30. Hazard types on the phone, Android Auto, and CarPlay. This article says a dropped connection still sends the report later.",
    },
    {
      type: "external",
      label: "Waze on Android Auto",
      url: WAZE_AA,
      description:
        "Fetched 2026-09-30. Navigation on the car display, plus traffic, police, crash, hazard, and blocked-lane reports.",
    },
    {
      type: "external",
      label: "Waze on Apple CarPlay",
      url: WAZE_CARPLAY,
      description:
        "Fetched 2026-09-30. CarPlay is a limited version of the mobile app. Incident reports include police, crash, and hazard.",
    },
    {
      type: "external",
      label: "Waze find parking",
      url: WAZE_PARKING,
      description:
        "Fetched 2026-09-30. Find a parking lot, add one as a stop, or mark where you parked.",
    },
  ],
  metaTitle: "Google Maps vs Waze: Which to Use? | A Versus B",
});
