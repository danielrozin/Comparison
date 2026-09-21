import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

const SIGNAL = "signal";
const TELEGRAM = "telegram";

const SHORT_ANSWER =
  "Signal is the better pick when default privacy matters: chats and calls are end-to-end encrypted by default, and clients are open source. Telegram is better for large public groups, Channels, bots, and cloud chats you can open on any logged-in device. Telegram’s default cloud chats are not end-to-end encrypted — only Secret Chats are. Pick by use-case.";

const FAQS = [
  {
    question: "Is Signal more private than Telegram?",
    answer:
      "Yes for default chats. Signal encrypts messages and calls end-to-end by default and publishes open-source clients. Telegram’s default cloud chats are encrypted between the client and Telegram’s servers and stored in the cloud; only Secret Chats are end-to-end encrypted (Telegram FAQ). If you never enable Secret Chats, Signal’s default is the stronger privacy posture.",
  },
  {
    question: "Does Telegram use end-to-end encryption by default?",
    answer:
      "No. Telegram’s FAQ states that Secret Chats are end-to-end encrypted and that ordinary cloud chats are stored on Telegram’s servers so they can sync across devices. Signal’s default 1:1 and group chats are end-to-end encrypted. Do not treat “Telegram is encrypted” as the same claim as “Telegram is end-to-end encrypted by default.”",
  },
  {
    question: "Which is better for large groups and channels?",
    answer:
      "Telegram. Official docs describe groups with a very large member cap and Channels for one-to-many broadcasts, plus a public bot API. Signal supports encrypted groups sized for private circles, not public broadcast communities. Use Telegram for public or very large communities; use Signal for private groups.",
  },
  {
    question: "Can I use Signal or Telegram without a phone number?",
    answer:
      "Signal still registers with a phone number and offers optional usernames so contacts need not see that number (Signal Support). Telegram also uses a phone number to create an account and can show a username in public contexts (Telegram FAQ). Neither is a pure email-only messenger.",
  },
  {
    question: "Which is better for everyday family chat?",
    answer:
      "It depends who is already installed. If the goal is private family chat with default end-to-end encryption, Signal matches that job. If the family already lives in Telegram groups or Channels, Telegram is easier — but default cloud chats are not end-to-end encrypted. There is no MAU ranking on this page.",
  },
  {
    question: "Signal vs Telegram for business — which should teams use?",
    answer:
      "Neither is a full WhatsApp Business replacement. Telegram documents bots, Channels, and large groups that creators and communities use. Signal has no official business API. For customer messaging with a verified business profile, see WhatsApp Business instead. For private staff chat, prefer Signal if everyone can install it.",
  },
  {
    question: "Are Signal and Telegram both open source?",
    answer:
      "Signal publishes its clients and the Signal Protocol. Telegram publishes clients and documents its APIs, but default cloud-chat encryption is not the same as Signal’s default end-to-end model. Open source does not by itself make Telegram’s default chats end-to-end encrypted.",
  },
];

const EXPERT_ANALYSIS = `This page compares Signal and Telegram by use-case: default privacy versus large-community features. It does not invent user counts.

Privacy and encryption

Signal encrypts chats and calls by default and publishes protocol and client source. Telegram’s FAQ distinguishes Secret Chats (end-to-end encrypted, device-to-device) from cloud chats (stored on Telegram servers so they sync). Treat that distinction as load-bearing: a Telegram group or Channel is not a Secret Chat.

Features and communities

Telegram documents large groups, unlimited-audience Channels, bots, and large file transfers. Those are the reasons people pick Telegram for public communities. Signal’s feature set is narrower and privacy-oriented (disappearing messages, sealed sender, usernames).

Choose Signal if every participant can install it and you want default end-to-end encryption. Choose Telegram if you need Channels, bots, or very large groups and accept that default cloud chats are not end-to-end encrypted. Related: Signal vs WhatsApp; WhatsApp vs Telegram.

Sources: Signal documentation and Support; Telegram FAQ (Secret Chats, groups, Channels).`;

export const SIGNAL_VS_TELEGRAM: EditorialComparison = buildEditorialComparison({
  slug: "signal-vs-telegram",
  title: "Signal vs Telegram (2026): Privacy, Groups & Which to Use",
  shortAnswer: SHORT_ANSWER,
  verdict:
    "Choose Signal for default end-to-end encrypted personal and small-group chat. Choose Telegram for large groups, Channels, and bots — and use Secret Chats only when you need Telegram-side end-to-end encryption. Default Telegram cloud chats are not end-to-end encrypted.",
  entities: [
    {
      id: SIGNAL,
      slug: SIGNAL,
      name: "Signal",
      shortDesc:
        "Privacy-first messenger from the Signal Foundation. Default end-to-end encryption; open-source clients.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Default end-to-end encryption for chats and calls",
        "Open-source clients and published Signal Protocol",
        "Nonprofit operator; no ads product",
        "Optional usernames after phone registration",
      ],
      cons: [
        "No Telegram-style public Channels or bot platform",
        "Groups are for private circles, not broadcast communities",
        "Phone number still required to register",
      ],
      bestFor: "Default-private personal and small-group chat",
    },
    {
      id: TELEGRAM,
      slug: TELEGRAM,
      name: "Telegram",
      shortDesc:
        "Cloud messenger with large groups, Channels, and bots. Default chats sync in the cloud; Secret Chats are end-to-end encrypted.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Large groups and one-to-many Channels (official Telegram FAQ)",
        "Bot API and cloud sync across devices",
        "Secret Chats available when you want end-to-end encryption",
        "Usernames for public identity alongside a phone-number account",
      ],
      cons: [
        "Default cloud chats are not end-to-end encrypted",
        "Secret Chats are opt-in and do not cover groups or Channels",
        "Cloud storage model is a different trust design than Signal",
      ],
      bestFor: "Public communities, Channels, and bots",
    },
  ],
  keyDifferences: [
    {
      label: "Default chat encryption",
      entityAValue: "End-to-end by default",
      entityBValue: "Cloud chats (not E2EE); Secret Chats are E2EE",
      winner: "a",
    },
    {
      label: "Groups & channels",
      entityAValue: "Encrypted private groups",
      entityBValue: "Very large groups plus Channels",
      winner: "b",
    },
    {
      label: "Bots / APIs",
      entityAValue: "No public bot platform",
      entityBValue: "Official Bot API",
      winner: "b",
    },
    {
      label: "Open-source clients",
      entityAValue: "Yes",
      entityBValue: "Clients published; default chats still cloud-synced",
      winner: "a",
    },
    {
      label: "Operator",
      entityAValue: "Signal Foundation (nonprofit)",
      entityBValue: "Telegram Messenger",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("default-e2ee", "Default E2EE chats", "Privacy", SIGNAL, TELEGRAM, "Yes", "No — Secret Chats only", "a"),
    textAttr("secret-chats", "Opt-in E2EE mode", "Privacy", SIGNAL, TELEGRAM, "Default is already E2EE", "Secret Chats", "a"),
    textAttr("channels", "Broadcast channels", "Features", SIGNAL, TELEGRAM, "No", "Yes — Channels", "b"),
    textAttr("bots", "Bot / developer API", "Features", SIGNAL, TELEGRAM, "No public bot platform", "Official Bot API", "b"),
    textAttr("open-source", "Open-source clients", "Privacy", SIGNAL, TELEGRAM, "Yes", "Clients published", "a"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "signal-vs-whatsapp", title: "Signal vs WhatsApp", category: "technology" },
    { slug: "whatsapp-vs-telegram", title: "WhatsApp vs Telegram", category: "technology" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "By use-case: Signal for default privacy; Telegram for large groups, Channels, and bots.",
    keyFact:
      "Telegram Secret Chats are end-to-end encrypted; default Telegram cloud chats are not. Signal’s default chats are.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 5,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: "2026-09-21",
    sources: [
      { name: "Signal documentation", url: "https://signal.org/docs/" },
      { name: "Signal Support", url: "https://support.signal.org/" },
      { name: "Telegram FAQ", url: "https://telegram.org/faq" },
    ],
  },
  metaTitle: "Signal vs Telegram (2026): Privacy, Groups & Which to Use | A Versus B",
});
