import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): Epic Games Store vs Steam.
 * Facts read 19 October 2026 from Epic's store FAQ, Epic Rewards FAQ and refund
 * policy, and Steam's About, refunds and platform pages. Steam's revenue share
 * is not published by Valve, so it is left out. No game prices. No winner.
 */

const A = "epic-games-store";
const B = "steam";

const EPIC_FAQ = "https://www.epicgames.com/site/en-US/epic-games-store-faq";
const EPIC_REWARDS = "https://www.epicgames.com/site/en-US/epic-rewards-faq";
const EPIC_REFUNDS = "https://legal.epicgames.com/store/refund-policy";
const STEAM_ABOUT = "https://store.steampowered.com/about/";
const STEAM_REFUNDS = "https://store.steampowered.com/steam_refunds/";
const STEAM_PLATFORMS = "https://partner.steamgames.com/doc/store/application/platforms";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "PC game stores";

const SHORT_ANSWER =
  "Epic Games Store gives away a free game every week, pays 5% back in Epic Rewards on eligible purchases and runs on PC, Mac and Android, plus iPhone and iPad in the EU. Steam is Valve's store for Windows, macOS and Linux (SteamOS) with Steam Workshop mods for nearly 1,000 games, Early Access and Steam Deck. Both refund most PC games within 14 days if you played under two hours. Pick Epic for free games and rewards; pick Steam for mods, Linux and Steam Deck. Neither is better for everyone.";

const FAQS = [
  {
    question: "Does the Epic Games Store really give away free games?",
    answer:
      "Yes. Epic says it offers a new free game each week, and a game you claim stays in your library after the giveaway ends.",
  },
  {
    question: "What are the refund rules on Epic and Steam?",
    answer:
      "Steam refunds a purchase requested within two weeks of buying it if you played for less than two hours. Epic refunds PC and Mac games within 14 days of purchase with less than 2 hours of runtime when the product is marked refundable or self-refundable.",
  },
  {
    question: "What is Epic Rewards?",
    answer:
      "Epic says members earn a standard 5% back on eligible purchases, enrollment is automatic, rewards are granted 14 days after purchase and they expire after 25 months.",
  },
  {
    question: "Which platforms do Epic and Steam support?",
    answer:
      "Epic says its store is available worldwide on PC, Mac and Android, and on iPhone and iPad only in the EU. Valve says Steam supports Windows, macOS and Linux (SteamOS), and Steam has a mobile app for iOS and Android.",
  },
  {
    question: "Can I use the Epic Games Store on an iPhone?",
    answer:
      "Only in the EU. Epic says its store is available on iPhone and iPad only in the European Union, while PC, Mac and Android versions are available worldwide.",
  },
  {
    question: "Which store supports mods and Steam Deck?",
    answer:
      "Steam. Valve says Steam Workshop hosts mods for nearly 1,000 games, and Steam Deck is Valve's handheld PC that runs Steam.",
  },
];

const VERDICT = `Best for free games and cash back: Epic Games Store, with a free game each week and 5% back in Epic Rewards.

Best for mods, Linux and handheld play: Steam, with Steam Workshop, SteamOS support and Steam Deck.

Both refund most PC games within 14 days if you played under two hours.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Epic gives away a new free game each week; claimed games stay in your library.
- Epic Rewards pays 5% back on eligible purchases.
- Steam supports Windows, macOS and Linux (SteamOS) and runs on Steam Deck.
- Steam Workshop has mods for nearly 1,000 games.
- Both stores refund PC games within two weeks when playtime is under two hours.

Free games and rewards

Epic says it offers a new free game each week, and each claimed game stays in your library. Epic Rewards pays a standard 5% back on eligible purchases, granted 14 days after purchase and valid for 25 months.

Platforms and devices

Epic says its store runs worldwide on PC, Mac and Android, and on iPhone and iPad only in the EU. Valve says Steam supports Windows, macOS and Linux through SteamOS, sells the Steam Deck handheld and offers a Steam mobile app for iOS and Android.

Refunds

1. Steam: request within two weeks of purchase with less than two hours of playtime; Valve says approved refunds arrive within a week.
2. Epic: PC and Mac games within 14 days with less than 2 hours of runtime if marked refundable or self-refundable; mobile purchases within 2 hours.

Community and payments

Steam lists Steam Workshop mods for nearly 1,000 games, Early Access, 28 languages and more than 100 payment methods across more than 35 currencies. Epic lists 16 store languages, regional pricing in more than 190 countries and 43 currencies.

Who should pick which

Pick Epic if you want free weekly games and rewards on purchases. Pick Steam if you want mods, Linux support or a Steam Deck. Epic Games vs GOG and Steam vs Xbox Game Pass cover other PC options.`;

const BUILT = buildEditorialComparison({
  slug: "epic-games-vs-steam",
  title: "Epic Games Store vs Steam: Free Games, Refunds",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "technology",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Epic Games Store",
      shortDesc: "Epic's PC, Mac and Android game store with a free game every week and 5% Epic Rewards.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: ["New free game each week that stays in your library", "5% back in Epic Rewards on eligible purchases", "Developers keep 88% of revenue"],
      cons: ["iPhone and iPad store only in the EU", "Refunds only on products marked refundable or self-refundable"],
      bestFor: "Players who want free games and rewards",
    },
    {
      id: B,
      slug: B,
      name: "Steam",
      shortDesc: "Valve's PC game store for Windows, macOS and Linux (SteamOS), with Steam Workshop and Steam Deck.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: ["Windows, macOS and Linux (SteamOS) support", "Steam Workshop mods for nearly 1,000 games", "Runs on Steam Deck"],
      cons: ["Refund window closes after two hours of playtime", "Steam Deck is a separate hardware purchase"],
      bestFor: "Players who want mods, Linux or Steam Deck",
    },
  ],
  keyDifferences: [
    { label: "Store perks", entityAValue: "Weekly free game, 5% Epic Rewards", entityBValue: "Steam Workshop, Early Access", winner: "tie" },
    { label: "Platforms", entityAValue: "PC, Mac, Android; iOS in the EU", entityBValue: "Windows, macOS, Linux (SteamOS)", winner: "tie" },
    { label: "Hardware", entityAValue: "Runs on existing PCs, Macs and Android devices", entityBValue: "Steam Deck handheld", winner: "tie" },
    { label: "Refunds", entityAValue: "14 days, under 2 hours, if refundable", entityBValue: "Two weeks, under two hours", winner: "tie" },
  ],
  attributes: [
    textAttr("owner", "Operator", GROUP, A, B, "Epic Games", "Valve"),
    textAttr("platforms", "Platforms", GROUP, A, B, "PC, Mac and Android worldwide; iPhone and iPad in the EU", "Windows, macOS and Linux (SteamOS); mobile app on iOS and Android"),
    textAttr("refunds", "PC refund window", GROUP, A, B, "14 days, under 2 hours of runtime, if marked refundable", "Two weeks, under two hours of playtime"),
    textAttr("perks", "Store perks", GROUP, A, B, "New free game each week; 5% Epic Rewards, expires after 25 months", "Steam Workshop mods for nearly 1,000 games; Early Access"),
    textAttr("languages", "Store languages", GROUP, A, B, "16", "28"),
    textAttr("currencies", "Currencies", GROUP, A, B, "43 currencies; regional pricing in more than 190 countries", "More than 35 currencies; more than 100 payment methods"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "epic-games-vs-gog", title: "Epic Games vs GOG", category: "technology" },
    { slug: "steam-vs-xbox-game-pass", title: "Steam vs Xbox Game Pass", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Epic for free weekly games and 5% rewards; Steam for mods, Linux and Steam Deck.",
    keyFact: "Both stores refund PC games bought within two weeks if you played for under two hours.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 18,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Epic Games: Epic Games Store FAQ", url: EPIC_FAQ },
      { name: "Epic Games: Epic Rewards FAQ", url: EPIC_REWARDS },
      { name: "Epic Games: Store refund policy", url: EPIC_REFUNDS },
      { name: "Steam: About", url: STEAM_ABOUT },
      { name: "Steam: Refunds", url: STEAM_REFUNDS },
      { name: "Steamworks: Platforms", url: STEAM_PLATFORMS },
    ],
  },
  resources: [
    { type: "external", label: "Epic Games: Epic Games Store FAQ", url: EPIC_FAQ, description: "PC, Mac and Android worldwide; iOS in the EU; 88/12 revenue share; weekly free game; 16 languages; 43 currencies." },
    { type: "external", label: "Epic Games: Epic Rewards FAQ", url: EPIC_REWARDS, description: "Standard 5% back; automatic enrollment; granted after 14 days; expires after 25 months." },
    { type: "external", label: "Epic Games: Store refund policy", url: EPIC_REFUNDS, description: "PC and Mac: 14 days and under 2 hours of runtime if refundable; mobile: within 2 hours." },
    { type: "external", label: "Steam: About", url: STEAM_ABOUT, description: "Steam Workshop for nearly 1,000 games, mobile app, 28 languages, 100+ payment methods, 35+ currencies, Steam Deck." },
    { type: "external", label: "Steam: Refunds", url: STEAM_REFUNDS, description: "Refund within two weeks of purchase with under two hours of playtime." },
    { type: "external", label: "Steamworks: Platforms", url: STEAM_PLATFORMS, description: "Steam supports Windows, macOS and Linux (SteamOS)." },
  ],
  metaTitle: "Epic Games Store vs Steam | A Versus B",
});

BUILT.metadata.metaDescription =
  "Epic Games Store vs Steam: weekly free games and 5% Epic Rewards against Steam Workshop, Linux and Steam Deck. Refund rules and platforms compared.";

export const EPIC_GAMES_VS_STEAM: EditorialComparison = BUILT;
