import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-114 — Chrome vs Safari.
 * Checked against sources on 2026-09-30. Speed and battery lines are
 * Apple's own tests, labelled as Apple's claims. No page-level winner.
 */

const CHROME = "chrome";
const SAFARI = "safari";

const CHROME_HOME = "https://www.google.com/chrome/";
const CHROMIUM = "https://opensource.google.com/projects/chromium";
const CHROME_SIGNIN = "https://support.google.com/chrome/answer/185277";
const CHROME_COOKIES = "https://support.google.com/chrome/answer/95647";
const MV3 = "https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3";
const MV2 = "https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline";
const CHROME_139 = "https://developer.chrome.com/release-notes/139";
const APPLE_SAFARI = "https://www.apple.com/safari/";
const APPLE_PRIVACY = "https://www.apple.com/privacy/features/";
const APPLE_LEGAL = "https://www.apple.com/legal/privacy/data/en/safari/";
const ICLOUD =
  "https://support.apple.com/guide/icloud/what-you-can-do-with-icloud-and-safari-mm9b8da4f328/icloud";

const SOURCE_DATE = "2026-09-30";
const PUBLISHED = "2026-09-30T00:00:00Z";

const SHORT_ANSWER =
  "It depends on the devices you actually use. Pick Safari when you stay on Apple devices and want Intelligent Tracking Prevention on by default, and pick Chrome when you also need Windows, Linux, ChromeOS, or Android. Safari extensions come from the App Store, and Chrome extensions come from the Chrome Web Store on desktop. Apple says Safari is up to 5 hours longer than Chrome for streaming video. That figure is Apple's August 2026 test, labelled here as Apple's claim, not a result measured for this page. This page does not crown a winner.";

const FAQS = [
  {
    question: "Is Safari more private than Chrome?",
    answer:
      "Safari turns more tracking protection on before you change a setting. Apple says Intelligent Tracking Prevention is on by default, hides your IP address from trackers, and that fingerprinting defense is on by default too. Apple says Safari blocks third-party cookies from tracking you by default. Its comparison chart marks Chrome as No on that row. That cell is Apple's chart, not Google's own statement. Chrome says third-party cookies are blocked by default in Incognito, and that regular browsing lets you choose Allow or Block. It does not say regular browsing blocks them by default. Chrome describes Safe Browsing, a Privacy Guide, and Enhanced Safe Browsing that you turn on. This page does not turn those descriptions into a scored privacy ranking.",
  },
  {
    question: "Is Safari better for battery life than Chrome?",
    answer:
      "Apple says Safari is up to 5 hours longer than Chrome for streaming video, and up to 18 hours of video streaming. Footnote 3 says Apple ran that test in August 2026 on a 15-inch MacBook Air with an M5 chip, prerelease Safari 27.0, and Chrome v151, streaming 1080p on battery. Apple also says Safari was 35% faster on average at loading frequently visited websites than Chrome, and footnote 2 ties that line to an Apple test of 12 websites on the same kind of Mac. This page did not re-run either test. Google's Chrome page names Energy Saver and Memory Saver and does not publish an hour count against Safari.",
  },
  {
    question: "Can I use Chrome extensions in Safari?",
    answer:
      "Not as a Chrome Web Store install. Apple says you add extensions from the Safari category on the App Store, for iPhone, iPad, and Mac. Apple says you then choose whether an extension can see your information for one day, for the current website, or always. Apple says you must turn a Safari extension on and grant it permission before it can read or change pages. Chrome says desktop extensions come from the Chrome Web Store. Chrome's Manifest V2 timeline, updated 9 September 2026, says those older extensions are disabled in Chrome 138 as of 24 July 2025 and stop working on Chrome 139 and later.",
  },
  {
    question: "Does Safari work on Windows or Android?",
    answer:
      "Apple describes Safari on Mac, iPhone, iPad, and Apple Watch. Apple says bookmarks also sync to Windows devices that have iCloud for Windows. That is bookmark sync, not a Safari app for Windows. Apple also says an extension is not installed for you on every device. You install it on each one. Chrome names Windows, Mac, Linux, ChromeOS, Android, iPhone, and iPad.",
  },
  {
    question: "Does Safari sync across iPhone, iPad, and Mac?",
    answer:
      "Yes, with iCloud. Apple says bookmarks, Reading List, history, open tabs, Tab Groups, profiles, and Safari settings stay up to date on iPhone, iPad, and Mac. Extension on/off state syncs too, but the extension itself still has to be installed on each device. Apple says iCloud Keychain stores user names, passkeys, passwords, and credit card numbers across trusted devices, and that Handoff can pass the website you are viewing to a nearby Apple device. Chrome sync is a different account. Chrome says a Google Account can put bookmarks, passwords, and more on your devices, and that signing in to Chrome is optional.",
  },
];

const VERDICT = `Best if you stay on Apple devices: Safari. Intelligent Tracking Prevention is on by default, and extensions come from the App Store.

Best if you also use Windows, Linux, ChromeOS, or Android: Chrome. A Google Account syncs bookmarks and passwords, and desktop extensions come from the Chrome Web Store.

There is no single winner on this page. It depends on the use.`;

const EXPERT_ANALYSIS = `It depends on the devices you actually use. Safari is the pick when you stay on Apple devices and want tracking prevention on before you change a setting. Chrome is the pick when you also need Windows, Linux, ChromeOS, or Android, or you want the Chrome Web Store. This page does not crown one browser.

Spec table. Caption: Chrome vs Safari. Source note: the rows were checked on 30 September 2026 against Google's Chrome page, Google's Chromium project page, Chrome's sign-in and cookie help, Chrome's Manifest V2 timeline (updated 9 September 2026), Chrome's Manifest V3 doc, the Chrome 139 release notes, Apple's Safari page (including footnotes 1 to 3), Apple's privacy features page, Apple's Safari privacy notice (dated 12 December 2025), and Apple's iCloud Safari guide.

Sources: google.com/chrome, opensource.google.com/projects/chromium, Chrome sign-in help, Chrome cookie help, the Manifest V3 doc, the Manifest V2 timeline (updated 9 September 2026), Chrome 139 release notes (stable 5 August 2025), apple.com/safari, apple.com/privacy/features, Apple's Safari privacy notice, and the iCloud Safari guide.

Engine

Google says Chromium is the web browser that Google Chrome is built on. Apple describes deep WebKit integration between Mac hardware and macOS, and it names WebKit in macOS Sequoia. This page does not treat the two engines as a speed score.

Where each one runs

Chrome says you can set Chrome as the default browser on Windows, Mac, iPhone, iPad, or Android. Google says the Chrome 139 stable release applies to Android, ChromeOS, Linux, macOS, and Windows. Apple describes Safari on Mac, iPhone, iPad, and Apple Watch, with extensions for iPhone, iPad, and Mac. Apple's iCloud guide adds that bookmarks also sync to Windows if that PC has iCloud for Windows.

Tracking and cookies

Apple says Intelligent Tracking Prevention is on by default and hides your IP address from trackers. Fingerprinting defense is on by default. Private Browsing goes further: known trackers are prevented from loading, and link tracking protection removes tracking added to URLs. Apple says Safari blocks third-party cookies from tracking you by default. The chart there marks Chrome as No for the same row. Treat that Chrome cell as Apple's comparison.

Chrome says third-party cookies are blocked by default in Incognito, and that regular browsing is a choice between Allow and Block. It does not say regular browsing blocks them by default. Chrome describes Safe Browsing, a Privacy Guide, and Enhanced Safe Browsing that you turn on.

Sync

Apple says Safari bookmarks, Reading List, history, open tabs, Tab Groups, profiles, and settings stay updated on iPhone, iPad, and Mac. It also syncs which extensions are installed and whether each is on, and it says the extension is not installed automatically. Apple says iCloud Keychain stores user names, passkeys, passwords, and credit card numbers, and that Handoff can move the current Safari website to a nearby Apple device. Chrome says a Google Account can carry bookmarks, passwords, and more. Signing in to Chrome is optional. If you turn on Web & App Activity and sync Chrome history, Google says that history can personalize other Google products.

Extensions

Apple says extensions come from the App Store. Apple says you can limit an extension to one day, the current website, or always. Apple says you must turn the extension on and grant permission before it can read or change pages. Chrome says you add desktop extensions from the Chrome Web Store. Chrome's Manifest V3 doc says version 3 uses service workers, blocks remotely hosted code, and replaces the blocking webRequest API with declarativeNetRequest. Chrome's timeline, updated 9 September 2026, says Chrome 138 disabled Manifest V2 extensions on 24 July 2025, users cannot turn them back on, and those extensions stop working on Chrome 139 and later. On 31 August 2026 the remaining Manifest V2 extensions were removed from the Chrome Web Store.

Speed and battery, as Apple states them

Apple's Safari page calls Safari the world's fastest browser. Footnote 1 says that line refers to tests Apple ran in August 2026 with JetStream 3.0, MotionMark 1.3.2, and Speedometer 3.1, and that Safari scored higher on average than the other browsers in that test. Apple also says Safari was 35% faster on average at loading frequently visited websites than Chrome. Footnote 2 says Apple measured snapshot versions of 12 websites in August 2026 on a 15-inch MacBook Air with an M5 chip, prerelease Safari 27.0, and Chrome v151.0.7922.138. The battery lines in the same statement are up to 5 hours more streaming video than Chrome, and up to 18 hours of video streaming. Footnote 3 says Apple ran that in August 2026 on the same kind of Mac, streaming 1080p, against Chrome v151.0.7922.76. Those are Apple's tests. This page did not repeat the benchmark multiples printed in Apple's charts, and it did not re-run the tests. Google's Chrome page names Energy Saver and Memory Saver. It does not publish an hour count.

Who should pick which

Pick Safari if your phones and computers are Apple's, and you want Intelligent Tracking Prevention on by default. Pick Chrome if you also browse on Windows, Linux, ChromeOS, or Android, or you want Chrome Web Store extensions and a Google Account for sync. The 2026 browser roundup is the wider list. Chrome vs Firefox and Firefox vs Safari are the other live browser head-to-heads. Brave vs Chrome is the Chromium privacy matchup.`;

export const CHROME_VS_SAFARI: EditorialComparison = buildEditorialComparison({
  slug: "chrome-vs-safari",
  title: "Chrome vs Safari: It Depends on Use",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: CHROME,
      slug: CHROME,
      name: "Google Chrome",
      shortDesc:
        "Google's Chromium browser, with Google Account sync and the Chrome Web Store on desktop.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Chrome names Windows, Mac, Linux, ChromeOS, Android, iPhone, and iPad",
        "Google Account sync for bookmarks, passwords, and more (Chrome Help)",
        "Desktop extensions from the Chrome Web Store (Google Chrome)",
        "Safe Browsing warns about malware or phishing. Enhanced Safe Browsing is a setting you turn on",
      ],
      cons: [
        "Third-party cookies are blocked by default in Incognito. Regular browsing is a choice (Chrome Help)",
        "Manifest V2 extensions are disabled in Chrome 138 and stop working on Chrome 139 and later",
      ],
      bestFor: "Best if you also browse on Windows, Android, Linux, or ChromeOS",
    },
    {
      id: SAFARI,
      slug: SAFARI,
      name: "Safari",
      shortDesc:
        "Apple's WebKit browser for Mac, iPhone, iPad, and Apple Watch, with Intelligent Tracking Prevention on by default.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Intelligent Tracking Prevention is on by default (Apple)",
        "Apple says Safari blocks third-party cookies from tracking you by default",
        "iCloud syncs bookmarks, history, tabs, and Keychain passwords across Apple devices",
        "Extensions come from the App Store, with per-site or one-day permission (Apple)",
      ],
      cons: [
        "Apple lists Safari for Mac, iPhone, iPad, and Apple Watch only",
        "Extensions are not installed for you on every device (iCloud guide)",
        "The 5-hour and 35% lines are Apple's August 2026 tests, not a result measured here",
        "Not the Chrome Web Store. A different extension catalog",
      ],
      bestFor: "Best if you stay on Apple devices and want tracking prevention on by default",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Windows, Android, Linux, or ChromeOS too",
      entityBValue: "Apple devices, tracking prevention on by default",
      winner: "tie",
    },
    {
      label: "Engine",
      entityAValue: "Chromium",
      entityBValue: "WebKit",
      winner: "tie",
    },
    {
      label: "Platforms named by the vendor",
      entityAValue: "Windows, Mac, Linux, ChromeOS, Android, iPhone, iPad",
      entityBValue: "Mac, iPhone, iPad, Apple Watch",
      winner: "tie",
    },
    {
      label: "Tracking protection",
      entityAValue: "Incognito blocks third-party cookies by default",
      entityBValue: "Intelligent Tracking Prevention on by default",
      winner: "tie",
    },
    {
      label: "Sync",
      entityAValue: "Google Account",
      entityBValue: "iCloud, including Keychain",
      winner: "tie",
    },
    {
      label: "Extensions",
      entityAValue: "Chrome Web Store on desktop. Manifest V3",
      entityBValue: "App Store. Per-site or one-day permission",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "engine",
      "Engine",
      "Specs",
      CHROME,
      SAFARI,
      "Chromium (Google Open Source)",
      "WebKit (Apple)"
    ),
    textAttr(
      "platforms",
      "Platforms named by the vendor",
      "Specs",
      CHROME,
      SAFARI,
      "Windows, Mac, Linux, ChromeOS, Android, iPhone, iPad",
      "Mac, iPhone, iPad, Apple Watch. No Windows or Android download on Apple's Safari page"
    ),
    textAttr(
      "tracking",
      "Tracking protection",
      "Specs",
      CHROME,
      SAFARI,
      "Incognito blocks third-party cookies by default. Regular browsing is Allow or Block",
      "Intelligent Tracking Prevention on by default. Apple says third-party cookie tracking is blocked by default"
    ),
    textAttr(
      "sync",
      "Sync",
      "Specs",
      CHROME,
      SAFARI,
      "Google Account. Bookmarks, passwords, and more. History sync is optional",
      "iCloud on iPhone, iPad, and Mac. Keychain for passwords. Bookmarks can also sync to Windows via iCloud for Windows"
    ),
    textAttr(
      "extensions",
      "Extensions",
      "Specs",
      CHROME,
      SAFARI,
      "Chrome Web Store on desktop. Manifest V2 disabled in Chrome 138 and later",
      "App Store for iPhone, iPad, and Mac. Permission for one day, this site, or always"
    ),
    textAttr(
      "battery",
      "Battery and speed",
      "Specs",
      CHROME,
      SAFARI,
      "Energy Saver and Memory Saver are named. No hour count against Safari",
      "Apple claims up to 5 more streaming hours than Chrome, and 35% faster loads of frequently visited sites. Apple's August 2026 tests"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "brave-vs-chrome",
      title: "Brave vs Chrome",
      category: "technology",
    },
    {
      slug: "chrome-vs-firefox",
      title: "Chrome vs Firefox",
      category: "technology",
    },
    {
      slug: "firefox-vs-safari",
      title: "Firefox vs Safari",
      category: "technology",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "It depends on the use. Safari when you stay on Apple devices and want tracking prevention on by default. Chrome when you also need Windows, Linux, ChromeOS, or Android.",
    keyFact:
      "Chrome is built on Chromium. Safari uses WebKit. Apple says Intelligent Tracking Prevention is on by default. Chrome says third-party cookies are blocked by default in Incognito.",
  },
  citationStats: {
    sourceCount: 11,
    dataPointCount: 6,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Google Chrome", url: CHROME_HOME },
      { name: "Google Open Source — Chromium", url: CHROMIUM },
      { name: "Google Chrome Help — sign in and sync", url: CHROME_SIGNIN },
      { name: "Google Chrome Help — cookies", url: CHROME_COOKIES },
      { name: "Chrome for Developers — Manifest V3", url: MV3 },
      { name: "Chrome for Developers — Manifest V2 timeline, updated 9 Sep 2026", url: MV2 },
      { name: "Chrome 139 release notes, 5 Aug 2025", url: CHROME_139 },
      { name: "Apple — Safari", url: APPLE_SAFARI },
      { name: "Apple — privacy features", url: APPLE_PRIVACY },
      { name: "Apple — Safari & Privacy, 12 Dec 2025", url: APPLE_LEGAL },
      { name: "Apple Support — iCloud and Safari", url: ICLOUD },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Google Chrome",
      url: CHROME_HOME,
      description:
        "Windows, Mac, iPhone, iPad, Android, Google sign-in, Chrome Web Store on desktop, Energy Saver, Memory Saver.",
    },
    {
      type: "external",
      label: "Chromium project",
      url: CHROMIUM,
      description: "Google says Chromium is the browser Google Chrome is built on.",
    },
    {
      type: "external",
      label: "Chrome sign-in help",
      url: CHROME_SIGNIN,
      description:
        "Google Account sync for bookmarks, passwords, and more. History sync is tied to Web & App Activity.",
    },
    {
      type: "external",
      label: "Chrome cookie help",
      url: CHROME_COOKIES,
      description:
        "Third-party cookies are blocked by default in Incognito. Regular browsing is Allow or Block.",
    },
    {
      type: "external",
      label: "Manifest V3",
      url: MV3,
      description:
        "Service workers, no remotely hosted code, declarativeNetRequest instead of blocking webRequest.",
    },
    {
      type: "external",
      label: "Manifest V2 timeline",
      url: MV2,
      description:
        "Updated 9 September 2026. Manifest V2 disabled in Chrome 138 on 24 July 2025 and removed from the store on 31 August 2026.",
    },
    {
      type: "external",
      label: "Chrome 139 release notes",
      url: CHROME_139,
      description:
        "Stable 5 August 2025. Names Android, ChromeOS, Linux, macOS, and Windows.",
    },
    {
      type: "external",
      label: "Apple Safari",
      url: APPLE_SAFARI,
      description:
        "WebKit, Mac, iPhone, iPad, Apple Watch, App Store extensions, and Apple's August 2026 speed and battery claims.",
    },
    {
      type: "external",
      label: "Apple privacy features",
      url: APPLE_PRIVACY,
      description:
        "Intelligent Tracking Prevention and fingerprinting defense on by default. Extension permission for one day, this site, or always.",
    },
    {
      type: "external",
      label: "Safari privacy notice",
      url: APPLE_LEGAL,
      description:
        "Dated 12 December 2025. Cross-site tracking controls, Hide IP Address, App Store extensions, iCloud sync.",
    },
    {
      type: "external",
      label: "iCloud and Safari",
      url: ICLOUD,
      description:
        "What syncs to iPhone, iPad, and Mac, plus bookmarks on Windows via iCloud for Windows.",
    },
    {
      type: "blog",
      label: "Best browser 2026",
      url: "/browser-comparison-2026",
      description: "The browser roundup this head-to-head sits under.",
    },
  ],
  metaTitle: "Chrome vs Safari: It Depends on Use | A Versus B",
});
