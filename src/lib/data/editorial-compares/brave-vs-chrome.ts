import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-114 — Brave vs Chrome.
 * Checked against sources on 2026-09-30. Speed lines are the vendor's
 * own wording, not a separate measurement. No page-level winner.
 */

const BRAVE = "brave";
const CHROME = "chrome";

const BRAVE_HOME = "https://brave.com/";
const BRAVE_SHIELDS = "https://brave.com/shields/";
const BRAVE_PRIVACY = "https://brave.com/privacy-features/";
const BRAVE_FEATURES = "https://brave.com/features/";
const BRAVE_EXT = "https://brave.com/learn/using-chrome-extensions-in-brave/";
const CHROME_HOME = "https://www.google.com/chrome/";
const CHROMIUM = "https://opensource.google.com/projects/chromium";
const CHROME_SIGNIN = "https://support.google.com/chrome/answer/185277";
const CHROME_COOKIES = "https://support.google.com/chrome/answer/95647";
const MV3 = "https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3";
const MV2 = "https://developer.chrome.com/docs/extensions/develop/migrate/mv2-deprecation-timeline";
const CHROME_139 = "https://developer.chrome.com/release-notes/139";

const SOURCE_DATE = "2026-09-30";
const PUBLISHED = "2026-09-30T00:00:00Z";

const SHORT_ANSWER =
  "It depends on what you want the browser to do before you change a setting. Pick Brave when you want third-party ads and trackers blocked by default, and pick Chrome when you want Google Account sync and the Chrome Web Store as Google ships it. Both are Chromium browsers. Brave says it is 3x faster than Chrome, and Brave also says websites load 3x-6x faster. Those are Brave's claims, not a separate lab result. Neither is better for everyone.";

const FAQS = [
  {
    question: "Is Brave more private than Chrome?",
    answer:
      "Brave turns more blocking on before you change a setting. Brave says Shields block ads, trackers, cross-site cookies, and fingerprinting by default, and that Global Privacy Control is on by default. Brave also says Sync is encrypted on the device and does not use Google's servers. Chrome says third-party cookies are blocked by default in Incognito, and that regular browsing lets you choose Allow or Block. It does not say regular browsing blocks them by default. Chrome describes Safe Browsing, a Privacy Guide, and Enhanced Safe Browsing that you turn on. Those vendor descriptions are not a scored privacy ranking.",
  },
  {
    question: "Does Brave block ads without an extension?",
    answer:
      "Yes, according to Brave. Shields block third-party ads and trackers on every page by default, including video ads, and you can turn Shields off for one broken site. Standard is the default. Aggressive blocks more and can break sites. Brave's extension guide says you do not need an extension ad blocker because of Shields. The filter lists Brave names are EasyList, EasyPrivacy, uBlock Origin's lists, and lists Brave made.",
  },
  {
    question: "Can I install Chrome extensions in Brave?",
    answer:
      "Brave says an extension from the Chrome Web Store works in Brave, and that you click Add to Brave. Brave says it cannot vouch for how a third-party extension handles your data. Brave also says it will keep supporting some Manifest V2 extensions, and that Manifest V3 extensions work in Brave as they do in Chrome. Chrome says Manifest V2 extensions are disabled for every Chrome user as of Chrome 138 on 24 July 2025, and that they stop working on Chrome 139 and later.",
  },
  {
    question: "What is Brave Rewards and BAT?",
    answer:
      "BAT is Basic Attention Token. Brave says Rewards is optional. If you opt in, you can view ads from the Brave Private Ads network and earn BAT. You can keep BAT, tip publishers, or store it in Brave Wallet. Brave's features page also says you can redeem BAT for gift cards, crypto, and more. You do not have to turn Rewards on. Brave says the browser itself is free. Brave Firewall + VPN is a separate subscription, and Brave says one subscription covers up to 5 devices.",
  },
  {
    question: "Does Brave sync like Chrome?",
    answer:
      "Both can sync, and they do not use the same account. Brave says a profile can sync between desktop and mobile, including history and bookmarks, with encryption on the device so Brave cannot read it, and that this sync does not touch Google's servers. The features page adds passwords and tabs. Chrome says a Google Account can put bookmarks, passwords, and more on your devices. Signing in to Chrome is optional. If you turn on Web & App Activity and sync Chrome history, Google says that history can personalize other Google products.",
  },
];

const VERDICT = `Best if you want blocking on before you add an extension: Brave. Shields block third-party ads and trackers by default, and Brave Rewards is optional.

Best if you want Google's browser as Google ships it: Chrome. A Google Account syncs bookmarks and passwords, and the Chrome Web Store follows Manifest V3.

Neither is better for everyone; it depends on the use.`;

const EXPERT_ANALYSIS = `It depends on what you want the browser to do before you change a setting. Brave is the pick when default ad and tracker blocking is the point. Chrome is the pick when Google Account sync and the Chrome Web Store, as Google ships it, are the point. Neither is better for everyone.

Spec table. Caption: Brave vs Chrome. Source note: the rows are as of 30 September 2026, from Brave's homepage, Shields, privacy, and features pages, Brave's 2 June 2025 extension guide, Google's Chrome page, Google's Chromium project page, Chrome's sign-in and cookie help, Chrome's Manifest V2 timeline (updated 9 September 2026), Chrome's Manifest V3 doc, and the Chrome 139 release notes.

Sources: brave.com, brave.com/shields, brave.com/privacy-features, brave.com/features, Brave's extension guide (2 June 2025), google.com/chrome, opensource.google.com/projects/chromium, Chrome sign-in help, Chrome cookie help, the Manifest V3 doc, the Manifest V2 timeline (updated 9 September 2026), and Chrome 139 release notes (stable 5 August 2025).

Engine

Google says Chromium is the web browser that Google Chrome is built on. Brave says Brave is built on that same open-source Chromium project, and names Google Chrome as one browser that engine powers. Brave says the same thing in its own words: Brave is built on the open-source Chromium web core. That shared engine is not a speed score.

Where each one runs

Brave says you can download Brave for Android, iOS, Linux, macOS, or Windows. Chrome says you can set Chrome as the default browser on Windows, Mac, iPhone, iPad, or Android. Chrome 139's release notes say that stable release applies to Android, ChromeOS, Linux, macOS, and Windows.

Ads, trackers, and cookies

Brave says third-party ad and tracker blocking is on for every page, with no extra download. It also says Brave blocks cross-site cookies by default and randomizes fingerprinting by default. The homepage adds that Global Privacy Control is on by default, and that Brave upgrades pages to HTTPS when it can. Shields can be turned off for one site.

Chrome describes extensions, Safe Browsing, a Privacy Guide, and Enhanced Safe Browsing that you turn on. Chrome says third-party cookies are blocked by default in Incognito, and that in regular browsing you choose Allow or Block. It does not say regular browsing blocks them by default.

Sync

Brave says Sync is encrypted on each device, covers history, bookmarks, and other profile data between desktop and mobile, and does not use Google's servers. Brave's features include bookmarks, passwords, and tabs. Chrome says a Google Account brings bookmarks, passwords, and more to your devices, and that signing in to Chrome is optional even if you use Gmail. It says Chrome history can personalize other Google products if you turn on Web & App Activity and sync that history.

Extensions and Manifest V3

Brave's 2 June 2025 guide says Chrome Web Store extensions install in Brave with Add to Brave. It says Brave will keep supporting some Manifest V2 extensions, and that Manifest V3 extensions work in Brave the way they work in Chrome. Brave also says Shields replaces an extension ad blocker.

Chrome's Manifest V3 doc says version 3 moves the background page to service workers, stops remotely hosted code, and replaces the blocking webRequest API with declarativeNetRequest. Chrome's timeline, updated 9 September 2026, says that on 24 July 2025 Chrome 138 disabled Manifest V2 extensions for every user, and that users cannot turn them back on. It says those extensions stop working on Chrome 139 and later. It also says that on 31 August 2026 the remaining Manifest V2 extensions were removed from the Chrome Web Store. Installs already on Chrome 138 or earlier can keep running, but they cannot be updated or reinstalled. Chrome says you add extensions from the Chrome Web Store on desktop.

Rewards

Brave says BAT, the Basic Attention Token, is optional. Opt in and you can view Brave Private Ads and earn BAT, then keep it, tip a publisher, or store it in Brave Wallet. Brave also lists gift cards and crypto as redeem options. The browser is free without Rewards. Brave Firewall + VPN is separate: Brave says one subscription covers up to 5 devices on Android, iOS, and desktop.

Speed, as the vendor states it

Brave's homepage FAQ says the browser is 3x faster than Google Chrome. The same homepage also says websites load 3x-6x faster. Those two sentences are both Brave's. Neither speed figure is picked, and neither figure is a lab result. Chrome names Energy Saver and Memory Saver. It does not publish a speed multiple against Brave.

Who should pick which

Pick Brave if the thing you want is ads and trackers blocked before you install anything, with an optional BAT program and sync that Brave says never reaches Google. Pick Chrome if you want a Google Account to carry bookmarks and passwords, and you want extensions under the Manifest V3 rules Google now enforces. The 2026 browser roundup is the wider list. Chrome vs Firefox and Firefox vs Safari are the other live browser head-to-heads. Chrome vs Safari is the Apple matchup.`;

export const BRAVE_VS_CHROME: EditorialComparison = buildEditorialComparison({
  slug: "brave-vs-chrome",
  title: "Brave vs Chrome: It Depends on Use",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: BRAVE,
      slug: BRAVE,
      name: "Brave",
      shortDesc:
        "Chromium browser with Shields on by default and an optional BAT rewards program.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Shields block third-party ads and trackers by default (Brave)",
        "Sync is encrypted on the device and does not use Google's servers (Brave)",
        "Chrome Web Store extensions, and Brave says some Manifest V2 extensions still work",
        "Rewards and BAT are optional. The browser is free without them (Brave)",
      ],
      cons: [
        "Aggressive Shields can break sites. Brave says you can turn Shields off per site",
        "Brave says it cannot vouch for third-party extensions you add",
        "The 3x and 3x-6x speed lines are Brave's claims, not a separate lab result",
      ],
      bestFor: "Best if you want ads and trackers blocked before you add an extension",
    },
    {
      id: CHROME,
      slug: CHROME,
      name: "Google Chrome",
      shortDesc:
        "Google's Chromium browser with Google Account sync and the Chrome Web Store.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Google Account sync for bookmarks, passwords, and more (Chrome Help)",
        "Chrome Web Store extensions on desktop (Google Chrome)",
        "Chrome names Windows, Mac, Linux, ChromeOS, Android, iPhone, and iPad",
        "Safe Browsing warns about malware or phishing. Enhanced Safe Browsing is a setting you turn on",
      ],
      cons: [
        "Manifest V2 extensions are disabled in Chrome 138 and stop working on Chrome 139 and later",
        "History sync can feed other Google products if Web & App Activity is on (Chrome Help)",
      ],
      bestFor: "Best if you want Google sign-in sync and the Chrome Web Store as Google ships it",
    },
  ],
  keyDifferences: [
    {
      label: "Who it is for",
      entityAValue: "Default ad and tracker blocking",
      entityBValue: "Google sync and the Chrome Web Store",
      winner: "tie",
    },
    {
      label: "Engine",
      entityAValue: "Chromium",
      entityBValue: "Chromium",
      winner: "tie",
    },
    {
      label: "Ad and tracker blocking",
      entityAValue: "Shields on by default",
      entityBValue: "—",
      winner: "tie",
    },
    {
      label: "Sync",
      entityAValue: "On-device encryption, not Google's servers",
      entityBValue: "Google Account",
      winner: "tie",
    },
    {
      label: "Extensions",
      entityAValue: "Chrome Web Store, some Manifest V2 still supported",
      entityBValue: "Chrome Web Store, Manifest V2 disabled",
      winner: "tie",
    },
    {
      label: "Rewards",
      entityAValue: "Optional BAT",
      entityBValue: "—",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "engine",
      "Engine",
      "Specs",
      BRAVE,
      CHROME,
      "Chromium (Brave; Google's Chromium page)",
      "Chromium (Google Open Source)"
    ),
    textAttr(
      "platforms",
      "Platforms named by the vendor",
      "Specs",
      BRAVE,
      CHROME,
      "Windows, macOS, Linux, Android, iOS (Brave)",
      "Windows, Mac, Linux, ChromeOS, Android, iPhone, iPad (Chrome)"
    ),
    textAttr(
      "blocking",
      "Ad and tracker blocking",
      "Specs",
      BRAVE,
      CHROME,
      "Shields on by default (Brave)",
      "—"
    ),
    textAttr(
      "sync",
      "Sync",
      "Specs",
      BRAVE,
      CHROME,
      "Client-side encrypted. History, bookmarks, passwords, tabs. Not Google's servers",
      "Google Account. Bookmarks, passwords, and more. History sync is optional"
    ),
    textAttr(
      "extensions",
      "Extensions",
      "Specs",
      BRAVE,
      CHROME,
      "Chrome Web Store. Brave says some Manifest V2 extensions still work",
      "Chrome Web Store on desktop. Manifest V2 disabled in Chrome 138 and later"
    ),
    textAttr(
      "rewards",
      "Rewards",
      "Specs",
      BRAVE,
      CHROME,
      "Optional BAT (Brave)",
      "—"
    ),
    textAttr(
      "speed",
      "Speed",
      "Specs",
      BRAVE,
      CHROME,
      "Brave claims 3x faster than Chrome, and also 3x-6x faster page loads. Not a lab result here",
      "Energy Saver and Memory Saver are named. No speed multiple against Brave"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "chrome-vs-safari",
      title: "Chrome vs Safari",
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
      "It depends on the use. Brave when you want ads and trackers blocked by default. Chrome when you want Google Account sync and the Chrome Web Store as Google ships it.",
    keyFact:
      "Both browsers are built on Chromium. Brave's Shields block third-party ads and trackers by default. Chrome's Manifest V2 extensions are disabled as of Chrome 138.",
  },
  citationStats: {
    sourceCount: 12,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Brave — homepage", url: BRAVE_HOME },
      { name: "Brave — Shields", url: BRAVE_SHIELDS },
      { name: "Brave — privacy features", url: BRAVE_PRIVACY },
      { name: "Brave — features", url: BRAVE_FEATURES },
      { name: "Brave — Chrome extensions in Brave, 2 Jun 2025", url: BRAVE_EXT },
      { name: "Google Chrome", url: CHROME_HOME },
      { name: "Google Open Source — Chromium", url: CHROMIUM },
      { name: "Google Chrome Help — sign in and sync", url: CHROME_SIGNIN },
      { name: "Google Chrome Help — cookies", url: CHROME_COOKIES },
      { name: "Chrome for Developers — Manifest V3", url: MV3 },
      { name: "Chrome for Developers — Manifest V2 timeline, updated 9 Sep 2026", url: MV2 },
      { name: "Chrome 139 release notes, 5 Aug 2025", url: CHROME_139 },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Brave homepage",
      url: BRAVE_HOME,
      description:
        "Chromium, Windows/macOS/Linux/Android/iOS, Shields, GPC, optional BAT, and Brave's 3x and 3x-6x speed claims.",
    },
    {
      type: "external",
      label: "Brave Shields",
      url: BRAVE_SHIELDS,
      description:
        "Default third-party ad and tracker blocking, cross-site cookies, and fingerprint randomization.",
    },
    {
      type: "external",
      label: "Brave privacy features",
      url: BRAVE_PRIVACY,
      description:
        "Same Chromium engine as Chrome. Sync encrypted on the device, not on Google's servers.",
    },
    {
      type: "external",
      label: "Brave features",
      url: BRAVE_FEATURES,
      description:
        "Sync for bookmarks, passwords, and tabs. Chrome Web Store extensions, including some that rely on Manifest V2.",
    },
    {
      type: "external",
      label: "Brave extension guide",
      url: BRAVE_EXT,
      description:
        "Published 2 June 2025. Chrome Web Store installs, some Manifest V2 support, Manifest V3 parity with Chrome.",
    },
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
      type: "blog",
      label: "Best browser 2026",
      url: "/browser-comparison-2026",
      description: "The browser roundup this head-to-head sits under.",
    },
  ],
  metaTitle: "Brave vs Chrome: It Depends on Use | A Versus B",
});
