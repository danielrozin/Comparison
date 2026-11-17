import { buildEditorialComparison, textAttrN } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-459 — Brick vs Opal, with oneTap as the third option.
 * Opened 17 November 2026 (Asia/Jerusalem).
 * getbrick.app redirects to getbrick.com. opal.so redirects to opalapp.com.
 * winnerName null. No dollar amounts. No vendor survey figures.
 * A community forum URL returned 403, so it is not quoted.
 * dataPointCount stays 0.
 */

const PUBLISHED = "2026-11-17T00:00:00Z";
const SOURCE_DATE = "2026-11-17";

const BRICK = "brick";
const OPAL = "opal";
const ONETAP = "onetap";

const BRICK_HOME = "https://getbrick.com/";
const BRICK_FAQ = "https://getbrick.com/pages/faq";
const BRICK_EMERGENCY = "https://getbrick.com/pages/emergency-unbricks";
const BRICK_PRODUCT = "https://getbrick.com/products/grey-brick";
const BRICK_NIGHT = "https://getbrick.com/products/brick-night";
const BRICK_RETURNS = "https://getbrick.com/pages/return-policy";
const OPAL_HOME = "https://opalapp.com/";
const OPAL_PRICING = "https://opalapp.com/pricing";
const OPAL_ANDROID = "https://opalapp.com/android";
const OPAL_MAC = "https://opalapp.com/mac";
const OPAL_ALLOW = "https://opalapp.com/help/what-is-allow-list";
const ONETAP_FAQ = "https://theonetap.app/faq";
const ONETAP_STORE = "https://apps.apple.com/us/app/onetap-brief-block/id6774352132";
const FOQOS = "https://www.foqos.app/";
const SCREENZEN = "https://screenzen.co/";

const SHORT_ANSWER = `Choose Brick if you want ending a session to require a tap on the physical device, which Brick's FAQ says is still required after you start a block from the app. Choose Opal if you want software rules on iPhone, Mac, and Android, or choose oneTap if you want an iPhone morning brief and then a timed lock on the apps you pick.`;

const CHOOSE_TABLE = [
  "Choose-if rows from each maker's own copy on 17 November 2026. No row is a ranked result.",
  "| Situation | Choose Brick if | Choose Opal if | Choose oneTap if |",
  "| --- | --- | --- | --- |",
  "| Ending a session | You want a tap on the device. The FAQ says a 5-second hold in the app can start a block, and unbricking still needs the device | You want software rules. Hard Mode, listed on Pro, is worded \"No way out. You can't turn Opal off.\" | You want a morning brief and then a timed lock. The US listing also names Place, NFC Tag, and Anytime |",
  "| Apps you still need | You want up to 10 modes. Phone stays available on iPhone. Phone and Launcher stay available on Android | You want an Allow List, which blocks every app and website except the ones you select. Allow Only is the name on the Pro list | You want Phone, Messages, Maps, and anything you did not pick to stay open. Nothing is locked by default |",
  "| A lost piece of hardware | Five Emergency Unbricks are enough for a lost device, and you will not use them as a daily exit | You do not want a separate device that can be lost | You do not want a required Brick device. An NFC tag is one lock on the US listing, not a device oneTap sells here |",
  "| Price | You will check the current device price. The product description calls the app subscription-free | You will check the free plan and Pro. The free plan is 3 Rules. Hard Mode is not on that free list | You will check the 7-day trial wording on the FAQ and on the US listing, then the current subscription price |",
].join("\n");

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways.

- Choose Brick if ending a session should take a tap on a device you can leave in another room. Brick's FAQ says unbricking still needs that device.
- Choose Opal if you want software rules on iPhone, Mac, and Android. Hard Mode and Allow Only are on the Pro list, not on the free plan's list.
- Choose oneTap if the problem is the morning on an iPhone. Its FAQ starts with a brief, then a timed lock. The US App Store listing also names Place, NFC Tag, and Anytime.
- No dollar amount is copied here. Brick's homepage was running a Black Friday sale on 17 November 2026, so check the current price before you buy.
- Brick's FAQ says five Emergency Unbricks can unblock apps if the device is lost. They are for emergencies, not daily use.
- A community forum URL for this question did not load on 17 November 2026, so nothing here quotes that thread.

## Which tool to choose

Choose Brick for a physical tap, Opal for software rules on iPhone, Mac, and Android, and oneTap for an iPhone morning brief plus a timed lock.

${CHOOSE_TABLE}

## How Brick works

Brick is a physical device you tap. The product description calls the companion app subscription-free.

On Brick's homepage, you tap the phone to Brick to block apps, and schedules can start a block at times you set. The product description says you can set 10 custom modes, and that the device uses a high-grade magnet and anti-slip silicone. The FAQ and the product description describe a tap. They do not call that tap NFC.

Brick's FAQ says Strict Mode is there to close loopholes and to prevent deleting the app or changing settings to unbrick. It says you can block any iPhone app except Phone, per Apple policy, and selected Safari sites from Apple's approved list. On Android you can block any app except Phone and Launcher. On both, you can create up to 10 custom modes.

The same FAQ says Brick currently works with Android devices running version 12.0 or later and iPhones running iOS 18.0 or later, and that one device can be used with as many phones as you want.

To start a block without the device, the FAQ says to hold the virtual Brick on the app homepage for 5 seconds. You still need the physical device to unbrick.

## How Brick Night differs

Choose Brick Night if you want a Bluetooth beacon by the bed, rather than a tap you carry through the day.

Brick Night's product description calls it a location-based Bluetooth beacon for a nightstand. You set it up once in the Brick app, choose which apps go quiet at night, and it blocks those apps at bedtime with no tapping or toggling. The same description says it works on its own, so you do not need a Brick to use it. Check the current price at ${BRICK_NIGHT}. No price is stated here.

## How Opal works

Choose Opal if you want a software blocker on iPhone, iPad, Android, and Mac, and you do not want a separate device.

Opal's homepage names iPhone, Mac, and Android. It describes Focus Rules as blocking the apps you choose, on your phone or desktop. It describes the focus timer as choosing what to focus on, setting the length, and locking in until the timer runs out. It describes Opal Score as combining signals from sleep, focus, and rest into one measure.

Opal's Android copy says Opal runs on iPhone, iPad, Android, and Mac, and that it is not on Windows yet. On Mac it also blocks distracting websites. The Mac copy says the Mac app requires macOS 13.0 or later, and that you can set sessions, schedules, open limits, and time limits for websites or apps. It says personal usage data does not currently sync between devices, even on the same account, across the phone, iPad, and Mac app. Browsers named there are Chrome, Safari, Opera, Edge, Brave, and Arc, and not Dia yet.

The free plan on the pricing copy is labeled free forever. It lists 3 Rules, schedule, time limits, open limits, basic timers and soundscapes, app blocking, and Opal Score for today only, on iOS, Android, and Mac. Opal Pro lists Hard Mode, unlimited Rules, advanced timers and soundscapes, Allow Only, and Opal Score with history. Hard Mode is worded "No way out. You can't turn Opal off." That line sits on the Pro list. The same pricing copy labels one Pro option Start Free Week and another Start Free 3 Days. Check the current offer at ${OPAL_PRICING}.

Opal's Allow List help says a session usually uses a block list, and an Allow List flips that: all apps and websites are blocked except the ones you explicitly select. The pricing copy calls the Pro feature Allow Only. Those two labels are reported separately here, because the two documents do not say they are the same control.

## How oneTap works

Choose oneTap if you want an iPhone morning brief and then a lock, not a hardware device from Brick.

oneTap's FAQ says it is a morning briefing app for iOS. At your wake-up time it sends a brief, and Start my day blocks the apps you picked for a duration you set, from 15 minutes to 8 hours. The FAQ recommends 90 minutes. It says the block runs on Apple's Family Controls framework, and that it holds if you move the app to another home screen, bury it in a folder, or delete and redownload it. The FAQ says oneTap is iOS only and not on Android yet.

The US App Store listing says the app requires iOS 18.0 or later and is compatible with iPhone, iPad, and iPod touch, and that Apple Vision requires visionOS 2.0 or later. That listing names four locks. Morning locks apps when you wake up, until the window ends. Place locks them when you arrive at the office or gym, and unlocks when you leave. NFC Tag locks when you tap the phone to a card. Anytime starts a focus block when you choose. The FAQ describes the morning path. It does not name Place, NFC Tag, or Anytime.

The FAQ says you read the brief in about three minutes. The US listing calls the brief a 2-minute read. Those are the two wordings on the maker's own copy.

Phone, Messages, Maps, and anything you have not picked stay open, the FAQ says, and nothing is locked by default.

## How hard it is to get back in

Choose Brick if you want the stop condition to be a tap on the device. Choose Opal Pro if you want the line "You can't turn Opal off." Choose oneTap if you want the FAQ's hard block for the window you set.

Brick's FAQ says Apple Screen Time and Android Digital Wellbeing limits are easy to bypass, because a tap on skip puts you back in. Brick, it says, creates physical separation and requires a rescan to exit. No separate feature list for Screen Time or Digital Wellbeing is added here.

oneTap's FAQ calls Screen Time a soft limit. It says you can tap "One more minute," or "Ignore for today," or enter a passcode or Face ID. It calls oneTap a hard block: once the window starts, the chosen apps stay shut until the timer runs out. That is oneTap's description of Screen Time.

Opal's pricing copy keeps "You can't turn Opal off" on the Pro list. The free plan still lists app blocking and 3 Rules.

## If you lose the Brick

Choose Brick only if five emergency unlocks are enough for a lost device. Choose Opal or oneTap if you do not want a piece of hardware you can misplace.

Brick's FAQ says that if you lose the Brick, five Emergency Unbricks in the app automatically unblock all apps. The Emergency Unbricks copy says you get 5, you are covered if you lose the Brick or you are away from home, and they are meant for emergencies, not daily use. You open them in Brick Settings under Use an Emergency Unbrick. The FAQ says to contact hello@getbrick.com to request 5 more. The Emergency Unbricks copy says that if you have used them all, you fill out the reset form linked from that copy.

## What you pay

No dollar amount is stated here. Check the current price on each link before you buy.

Brick is a device you purchase. The product description calls the companion app subscription-free. Check the current price at ${BRICK_PRODUCT}. Brick Night is a separate device. Check ${BRICK_NIGHT}.

Brick's return policy says orders placed between 11/9 and 12/21/26, that is 9 November 2026 through 21 December 2026, are eligible for return anytime. Other orders need a return request within 30 days of delivery. In both cases the policy says to ship the items back within 14 days of approval, in original condition, for a full item refund. Read ${BRICK_RETURNS} before you rely on that.

Opal's pricing copy describes a free plan and Opal Pro on yearly, monthly, and lifetime options. The Android copy says prices depend on your country and show in Google Play before you pay. Check ${OPAL_PRICING}.

oneTap's FAQ says every new account gets 7 days free with full access, with no card required to start, and that a paid plan follows. The US App Store listing says "Try oneTap free for 7 days on the annual plan, then continue with a subscription." Those two trial wordings are both on the maker's own copy. Check the current price on ${ONETAP_STORE} and on ${ONETAP_FAQ}.

## Other blockers to look up

Foqos, ScreenZen, Apple Screen Time, and Android Digital Wellbeing are separate tools. No Bloom feature is stated here.

Foqos describes a free, open-source iPhone app that uses Apple Screen Time APIs, with no account, ads, subscription, or tracking, and says a session can start or end with an NFC tag or a QR code. It says the app is made for iPhone.

ScreenZen's site copy says there is no subscription, and that the app blocks distracting apps and websites. It also names halo, a companion device you place in a bedroom, at a desk, or in a shared area.

Brick's FAQ is the only line here about Apple Screen Time and Android Digital Wellbeing, and it only says those limits are easy to bypass with a tap on skip.

A Bloom card is only a name to look up. No Bloom site loaded on 17 November 2026, so no Bloom feature is stated here.

A community forum URL for this question did not load on 17 November 2026, so nothing here quotes that thread or treats it as a product fact.`;

const FAQS = [
  {
    question: "Should I choose Brick or Opal?",
    answer:
      "Choose Brick if you want ending a session to require a tap on the physical device. Brick's FAQ says a 5-second hold in the app can start a block, and you still need the device to unbrick. Choose Opal if you want software rules on iPhone, Mac, and Android. Opal's pricing copy puts Hard Mode on Pro, with the words \"No way out. You can't turn Opal off.\"",
  },
  {
    question: "Is Brick worth buying?",
    answer:
      "Choose Brick if you will leave the device away from the phone, because Brick's FAQ says unbricking still needs that device. Choose a software blocker if you would keep the device with you, or if you already keep the limits you set. Check the current price at https://getbrick.com/products/grey-brick before you buy. No price is stated here.",
  },
  {
    question: "What is oneTap?",
    answer:
      "oneTap's FAQ says it is a morning briefing app for iOS. At your wake-up time it sends a brief, then Start my day blocks the apps you picked for a duration from 15 minutes to 8 hours. The US App Store listing also names four locks: Morning, Place, NFC Tag, and Anytime. That listing requires iOS 18.0 or later. The FAQ says oneTap is not on Android yet.",
  },
  {
    question: "Are there free alternatives to Brick?",
    answer:
      "Yes, with different limits. Opal's pricing copy describes a free plan with 3 Rules on iOS, Android, and Mac. Foqos describes a free, open-source iPhone app that can use an NFC tag or a QR code, with no subscription. ScreenZen's site copy says there is no subscription. Brick's FAQ names Apple Screen Time and Android Digital Wellbeing as built-in limits you can tap past. Check each current offer on the maker's own site.",
  },
  {
    question: "What if I lose my Brick?",
    answer:
      "Brick's FAQ says five Emergency Unbricks in the app automatically unblock all apps. The Emergency Unbricks copy says you get 5, they are for emergencies rather than daily use, and you open them in Brick Settings under Use an Emergency Unbrick. To request more, the FAQ says to contact hello@getbrick.com. If you have used all five, that copy points to a reset form.",
  },
  {
    question: "Can I keep the apps I need while a block is on?",
    answer:
      "Yes, if you set that up. Brick's FAQ says you can make up to 10 modes, Phone stays available on iPhone, and Phone and Launcher stay available on Android. Opal's Allow List help says every app and website is blocked except the ones you select, and the pricing copy lists Allow Only on Pro. oneTap's FAQ says Phone, Messages, Maps, and anything you did not pick stay open, and nothing is locked by default.",
  },
];

const VERDICT = `Choose Brick if you want ending a session to require a tap on the physical device. Choose Opal if you want software rules on iPhone, Mac, and Android. Choose oneTap if you want an iPhone morning brief and then a timed lock.

Brick's FAQ says iPhones need iOS 18.0 or later and Android devices need version 12.0 or later, and that five Emergency Unbricks unblock apps if the device is lost. No dollar amount is stated here. Check the current price on each maker's site.`;

const BUILT = buildEditorialComparison({
  slug: "brick-vs-opal",
  title: "Brick vs Opal?",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: BRICK,
      slug: BRICK,
      name: "Brick",
      shortDesc:
        "A physical device you tap to block apps. The product description calls the companion app subscription-free. iOS 18.0 or later, or Android 12.0 or later.",
      imageUrl: null,
      entityType: "product",
      position: 0,
      pros: [
        "Unbricking still needs the physical device, including after a 5-second start in the app (Brick FAQ)",
        "Up to 10 custom modes, with Phone left available on iPhone (Brick FAQ)",
        "Companion app called subscription-free (Brick product description)",
      ],
      cons: [
        "A lost device uses five Emergency Unbricks, meant for emergencies rather than daily use (Brick FAQ)",
        "iPhone needs iOS 18.0 or later, and Android needs version 12.0 or later (Brick FAQ)",
      ],
      bestFor: null,
    },
    {
      id: OPAL,
      slug: OPAL,
      name: "Opal",
      shortDesc:
        "A software blocker. The Android copy lists iPhone, iPad, Android, and Mac. The free plan lists 3 Rules. Hard Mode and Allow Only are on the Pro list.",
      imageUrl: null,
      entityType: "product",
      position: 1,
      pros: [
        "Runs on iPhone, iPad, Android, and Mac, and not on Windows yet (Opal Android copy)",
        "Free plan with 3 Rules, schedules, limits, and app blocking (Opal pricing copy)",
      ],
      cons: [
        "Hard Mode and Allow Only are on the Pro list, not on the free plan's list (Opal pricing copy)",
        "Phone, iPad, and Mac usage data do not currently sync (Opal Mac copy)",
      ],
      bestFor: null,
    },
    {
      id: ONETAP,
      slug: ONETAP,
      name: "oneTap",
      shortDesc:
        "An iOS morning brief plus a timed app lock. The US listing requires iOS 18.0 or later and also names Place, NFC Tag, and Anytime locks.",
      imageUrl: null,
      entityType: "product",
      position: 2,
      pros: [
        "Wake-up brief, then Start my day locks chosen apps for 15 minutes to 8 hours (oneTap FAQ)",
        "Phone, Messages, and Maps stay open unless you pick them (oneTap FAQ)",
        "US listing also names Place, NFC Tag, and Anytime locks",
      ],
      cons: [
        "FAQ says iOS only, and not on Android yet",
        "US listing requires iOS 18.0 or later",
      ],
      bestFor: null,
    },
  ],
  keyDifferences: [
    {
      label: "Form",
      entityAValue: "Physical device you tap. App described as subscription-free",
      entityBValue: "Software on iPhone, iPad, Android, and Mac. Not on Windows yet",
      values: [
        "Physical device you tap. App described as subscription-free",
        "Software on iPhone, iPad, Android, and Mac. Not on Windows yet",
        "iOS app. Morning brief, then a lock. US listing also names Place, NFC Tag, and Anytime",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "How a session ends",
      entityAValue: "Tap the device. A 5-second hold can start a block from the app",
      entityBValue: "Software rules. Pro Hard Mode: You can't turn Opal off",
      values: [
        "Tap the device. A 5-second hold can start a block from the app",
        "Software rules. Pro Hard Mode: You can't turn Opal off",
        "FAQ: chosen apps stay shut until the timer ends. US listing also names three other locks",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "Systems",
      entityAValue: "iOS 18.0 or later, or Android 12.0 or later",
      entityBValue: "iPhone, iPad, Android, and Mac. Mac app: macOS 13.0 or later",
      values: [
        "iOS 18.0 or later, or Android 12.0 or later",
        "iPhone, iPad, Android, and Mac. Mac app: macOS 13.0 or later",
        "iOS 18.0 or later on iPhone, iPad, and iPod touch. Apple Vision: visionOS 2.0 or later. Not Android yet",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "Apps left open",
      entityAValue: "Up to 10 modes. Phone on iPhone. Phone and Launcher on Android",
      entityBValue: "Allow List keeps the apps you select. Allow Only is the Pro name",
      values: [
        "Up to 10 modes. Phone on iPhone. Phone and Launcher on Android",
        "Allow List keeps the apps you select. Allow Only is the Pro name",
        "Phone, Messages, Maps, and anything you did not pick. Nothing locked by default",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "Lost hardware",
      entityAValue: "Five Emergency Unbricks unblock apps. For emergencies, not daily use",
      entityBValue: "No separate device in the product copy used here",
      values: [
        "Five Emergency Unbricks unblock apps. For emergencies, not daily use",
        "No separate device in the product copy used here",
        "No required Brick device. NFC Tag on the US listing is a card you tap",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
    {
      label: "Price model",
      entityAValue: "Device you purchase. Subscription-free app. Check the current price",
      entityBValue: "Free plan with 3 Rules, plus Pro. Check the current price",
      values: [
        "Device you purchase. Subscription-free app. Check the current price",
        "Free plan with 3 Rules, plus Pro. Check the current price",
        "7 days free, then a subscription. FAQ and US listing word the trial differently. Check the current price",
      ],
      winner: "tie",
      winnerIndex: "tie",
    },
  ],
  attributes: [
    textAttrN("form", "Form", "Product", [
      { entityId: BRICK, text: "Physical device you tap. Companion app called subscription-free" },
      { entityId: OPAL, text: "Software. iPhone, iPad, Android, and Mac. Not Windows yet" },
      { entityId: ONETAP, text: "iOS app. Brief, then a lock. US listing also names Place, NFC Tag, and Anytime" },
    ]),
    textAttrN("systems", "Systems", "Compatibility", [
      { entityId: BRICK, text: "iOS 18.0 or later, or Android 12.0 or later. As many phones as you want" },
      { entityId: OPAL, text: "iPhone, iPad, Android, and Mac. Mac app requires macOS 13.0 or later. Usage data does not currently sync across devices" },
      { entityId: ONETAP, text: "iOS 18.0 or later. iPhone, iPad, and iPod touch. Apple Vision requires visionOS 2.0 or later. Not Android yet" },
    ]),
    textAttrN("end-session", "How a session ends", "Block", [
      { entityId: BRICK, text: "Tap the device to unbrick. Hold the virtual Brick for 5 seconds to start without the device" },
      { entityId: OPAL, text: "Rules, schedules, and timers. Pro Hard Mode is worded: You can't turn Opal off" },
      { entityId: ONETAP, text: "FAQ: apps stay shut until the timer ends. Duration is 15 minutes to 8 hours. US listing also names Place, NFC Tag, and Anytime" },
    ]),
    textAttrN("keep-apps", "Apps you can leave open", "Modes", [
      { entityId: BRICK, text: "Up to 10 modes. Any iPhone app except Phone, plus selected Safari sites. Android: any app except Phone and Launcher" },
      { entityId: OPAL, text: "Allow List blocks everything except the apps and sites you select. Pricing copy lists Allow Only on Pro" },
      { entityId: ONETAP, text: "Phone, Messages, Maps, and anything you did not pick stay open. Nothing is locked by default" },
    ]),
    textAttrN("lost", "If the hardware is lost", "Recovery", [
      { entityId: BRICK, text: "Five Emergency Unbricks unblock all apps. Settings label: Use an Emergency Unbrick. Email hello@getbrick.com for more" },
      { entityId: OPAL, text: "No separate device in the copy used here" },
      { entityId: ONETAP, text: "No required Brick device. NFC Tag on the US listing is a card tap" },
    ]),
    textAttrN("price", "Price model", "Price", [
      { entityId: BRICK, text: "Device you purchase, plus a subscription-free app. Check the current price. No dollar amount here" },
      { entityId: OPAL, text: "Free forever plan with 3 Rules, and Pro on yearly, monthly, or lifetime. Check the current price. No dollar amount here" },
      { entityId: ONETAP, text: "7 days free, then a subscription. FAQ: no card to start. US listing: 7 days on the annual plan. Check the current price. No dollar amount here" },
    ]),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: null,
    keyFact:
      "Brick's FAQ says iPhones need iOS 18.0 or later and Android devices need version 12.0 or later, and that five Emergency Unbricks unblock apps if the device is lost.",
  },
  citationStats: {
    sourceCount: 15,
    dataPointCount: 0,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Brick homepage (17 November 2026)", url: BRICK_HOME },
      { name: "Brick FAQ", url: BRICK_FAQ },
      { name: "Brick Emergency Unbricks", url: BRICK_EMERGENCY },
      { name: "Brick product", url: BRICK_PRODUCT },
      { name: "Brick Night product", url: BRICK_NIGHT },
      { name: "Brick return policy", url: BRICK_RETURNS },
      { name: "Opal homepage", url: OPAL_HOME },
      { name: "Opal pricing", url: OPAL_PRICING },
      { name: "Opal for Android", url: OPAL_ANDROID },
      { name: "Opal for Mac", url: OPAL_MAC },
      { name: "Opal Allow List help", url: OPAL_ALLOW },
      { name: "oneTap FAQ", url: ONETAP_FAQ },
      { name: "oneTap on the US App Store", url: ONETAP_STORE },
      { name: "Foqos homepage", url: FOQOS },
      { name: "ScreenZen homepage", url: SCREENZEN },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Brick homepage",
      url: BRICK_HOME,
      description:
        "17 November 2026. Tap the phone to Brick. Schedules start a block at times you set. A Black Friday sale was on the homepage. No price is copied from it.",
    },
    {
      type: "external",
      label: "Brick FAQ",
      url: BRICK_FAQ,
      description:
        "iOS 18.0 or later and Android 12.0 or later. Strict Mode. Five Emergency Unbricks. Hold the virtual Brick for 5 seconds to start, and unbrick on the device. Up to 10 modes. Phone stays available.",
    },
    {
      type: "external",
      label: "Brick Emergency Unbricks",
      url: BRICK_EMERGENCY,
      description:
        "You get 5. They unlock the phone without the device, for emergencies rather than daily use. Open them under Use an Emergency Unbrick. A reset form is linked if all five are used.",
    },
    {
      type: "external",
      label: "Brick product",
      url: BRICK_PRODUCT,
      description:
        "Check the current price here. The description calls the app subscription-free, names 10 custom modes, and describes a high-grade magnet. No dollar amount is copied.",
    },
    {
      type: "external",
      label: "Brick Night product",
      url: BRICK_NIGHT,
      description:
        "Check the current price here. A location-based Bluetooth beacon for a nightstand. It can run without a Brick. No dollar amount is copied.",
    },
    {
      type: "external",
      label: "Brick return policy",
      url: BRICK_RETURNS,
      description:
        "Orders placed between 11/9 and 12/21/26 are eligible for return anytime. Other orders: request a return within 30 days of delivery. Ship back within 14 days of approval for a full item refund.",
    },
    {
      type: "external",
      label: "Opal homepage",
      url: OPAL_HOME,
      description:
        "Lists iPhone, Mac, and Android. Focus Rules, a focus timer, and Opal Score. Survey figures on that homepage are not repeated here.",
    },
    {
      type: "external",
      label: "Opal pricing",
      url: OPAL_PRICING,
      description:
        "Check the current price here. Free forever plan with 3 Rules. Pro lists Hard Mode, unlimited Rules, and Allow Only. No dollar amount is copied.",
    },
    {
      type: "external",
      label: "Opal for Android",
      url: OPAL_ANDROID,
      description:
        "Free to start. Runs on iPhone, iPad, Android, and Mac. Not on Windows yet. Prices show in Google Play before you pay.",
    },
    {
      type: "external",
      label: "Opal for Mac",
      url: OPAL_MAC,
      description:
        "Requires macOS 13.0 or later. Sessions, schedules, open limits, and time limits. Usage data does not currently sync across devices. Browsers: Chrome, Safari, Opera, Edge, Brave, and Arc. Not Dia yet.",
    },
    {
      type: "external",
      label: "Opal Allow List help",
      url: OPAL_ALLOW,
      description:
        "An Allow List blocks all apps and websites except the ones you select for the session. Always Allowed apps in Screen Time stay available.",
    },
    {
      type: "external",
      label: "oneTap FAQ",
      url: ONETAP_FAQ,
      description:
        "Morning brief, then Start my day. Family Controls. Duration from 15 minutes to 8 hours. iOS only. 7 days free with no card to start, then a paid plan. No dollar amount is copied.",
    },
    {
      type: "external",
      label: "oneTap on the US App Store",
      url: ONETAP_STORE,
      description:
        "Check the current price here. Requires iOS 18.0 or later. Four locks: Morning, Place, NFC Tag, Anytime. Trial line: 7 days free on the annual plan, then a subscription.",
    },
    {
      type: "external",
      label: "Foqos",
      url: FOQOS,
      description:
        "Free, open-source iPhone app. NFC tag or QR code. Apple Screen Time APIs. No account, ads, subscription, or tracking. Ratings on that site are not repeated here.",
    },
    {
      type: "external",
      label: "ScreenZen",
      url: SCREENZEN,
      description:
        "Site copy says there is no subscription, and that the app blocks distracting apps and websites. halo is a companion device for a bedroom, a desk, or a shared area. User-reported hours are not repeated here.",
    },
  ],
  metaTitle: "Brick vs Opal?",
});

BUILT.metadata.metaDescription =
  "Choose Brick when ending a block should take a physical tap. Choose Opal for software rules on iPhone, Mac, and Android. oneTap adds a morning brief on iPhone.";

export const BRICK_VS_OPAL: EditorialComparison = BUILT;
