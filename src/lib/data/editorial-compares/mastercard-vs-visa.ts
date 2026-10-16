import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Mastercard vs Visa (blog /blog/visa-vs-mastercard-2026-which-card-network-is-better).
 * Facts read 16 October 2026 from Visa (about, credit card tiers, Zero Liability)
 * and Mastercard (about, media resources, card portfolio, Zero Liability).
 * Company-reported network figures only, each with its own date. No card
 * offers, APRs, or fees: the issuing bank sets those. No winner.
 */

const A = "mastercard";
const B = "visa";

const MC_ABOUT = "https://www.mastercard.com/us/en/for-the-world/about-us.html";
const MC_MEDIA = "https://www.mastercard.com/news/press/media-resources/";
const MC_CARDS = "https://www.mastercard.com/us/en/personal/find-a-card/credit-card.html";
const MC_ZERO = "https://www.mastercard.us/en-us/personal/get-support/zero-liability-terms-conditions.html";
const VISA_ABOUT = "https://usa.visa.com/about-visa.html";
const VISA_CREDIT = "https://www.visa.com/en-us/personal/cards/credit";
const VISA_ZERO = "https://usa.visa.com/pay-with-visa/visa-chip-technology-consumers/zero-liability-policy.html";

const SOURCE_DATE = "2026-10-16";
const PUBLISHED = "2026-10-16T00:00:00Z";
const NET = "Network";

const SHORT_ANSWER =
  "Visa and Mastercard are both global card networks, not banks: the bank that issues your card sets the interest rate, fees and rewards. Mastercard reports connections in more than 210 countries and territories; Visa reports more than 200. Both have a Zero Liability policy for unauthorized charges, with exceptions for certain commercial and prepaid cards. The practical difference is the benefit tier on your card: Visa Traditional, Signature and Infinite, or Mastercard Standard, World, World Elite and World Legend.";

const FAQS = [
  {
    question: "Is Visa or Mastercard better?",
    answer:
      "Neither is better for everyone. Both are payment networks that banks put on their cards, so the card's interest rate, annual fee and rewards come from the issuing bank. The differences that matter are the card's tier benefits and whether the merchants and countries you use accept that network.",
  },
  {
    question: "Is Visa or Mastercard accepted in more places?",
    answer:
      "Both are accepted almost everywhere cards are taken. Visa reports more than 175 million merchant locations and more than 200 countries and territories. Mastercard reports acceptance at more than 150 million locations and connections in more than 210 countries and territories. Each company counts differently, so the figures are not a like-for-like ranking.",
  },
  {
    question: "Do Visa and Mastercard charge me interest or fees?",
    answer:
      "No. The bank or credit union that issued the card sets the APR, annual fee, foreign transaction fee and rewards. Visa and Mastercard run the network that carries the payment.",
  },
  {
    question: "What is the difference between Visa Signature and World Elite Mastercard?",
    answer:
      "They are each network's upper tiers. Visa lists three consumer credit levels (Traditional, Signature, Infinite) and says higher levels carry richer Visa benefits. Mastercard lists World, World Elite and World Legend as its higher credit tiers; World Elite adds benefits such as a 24/7 concierge. Many tier benefits are optional for the issuer, so the card's guide to benefits decides.",
  },
  {
    question: "Am I protected from fraud on both networks?",
    answer:
      "Yes, with conditions. Visa's Zero Liability Policy says you won't be held responsible for unauthorized charges and requires issuers to replace funds within five business days of notification. Mastercard's Zero Liability applies when you used reasonable care and promptly reported loss or theft. Both exclude certain commercial cards and some prepaid cards.",
  },
  {
    question: "Should I choose a card by network?",
    answer:
      "Usually choose by the card offer first: rates, fees and rewards from the issuer. Then check the network tier benefits and acceptance where you shop or travel. This is general information, not financial advice.",
  },
];

const VERDICT = `Pick by the card, not the logo. Rates, fees and rewards come from the issuing bank on both networks.

Both reach more than 200 countries and territories and both have Zero Liability protection with similar exceptions.

Compare tier benefits (Visa Signature or Infinite against World or World Elite Mastercard) in the issuer's guide to benefits. This is general information, not financial advice.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Visa and Mastercard are payment networks. The issuing bank sets APR, fees and rewards.
- Mastercard reports connections in more than 210 countries and territories; Visa reports more than 200.
- Both have Zero Liability policies that exclude certain commercial and prepaid cards.
- Visa's consumer credit tiers are Traditional, Signature and Infinite.
- Mastercard's credit tiers run from standard cards to World, World Elite and World Legend.

What each company is

Both are card networks, not lenders. Visa describes itself as a network that connects businesses, banks and governments in more than 200 countries and territories; its history starts with BankAmericard in 1958, which became Visa in 1976. Mastercard describes itself as a technology company in the payments industry, headquartered in Purchase, New York, connecting more than 210 countries and territories.

Network size

Each company publishes its own figures with its own dates and definitions:

- Visa: about 5 billion payment credentials (June 30, 2025), about 14.5 thousand financial institutions (September 30, 2025), 329 billion total transactions in the 12 months to September 30, 2025, and more than 175 million merchant locations.
- Mastercard: 3.5 billion Mastercard and Maestro cards in circulation, more than 150 million acceptance locations, 159.4 billion transactions processed in 2024, and more than 150 currencies.

The definitions differ (credentials against cards, different periods), so treat these as scale indicators, not a ranking.

Fraud protection

Visa's Zero Liability Policy says cardholders won't be held responsible for unauthorized charges and requires issuers to replace funds within five business days of notification. Mastercard's Zero Liability applies to in-store, phone, online, mobile and ATM transactions when the cardholder used reasonable care and reported loss or theft promptly. Both exclude certain commercial cards; Visa also excludes anonymous prepaid cards and Mastercard unregistered prepaid cards such as gift cards.

Card tiers

1. Visa Traditional, Visa Signature, Visa Infinite: Visa says the higher the level, the richer the Visa benefits, and many Signature and Infinite benefits are issuer optional.
2. Mastercard standard cards, World, World Elite, World Legend: World Elite adds a 24/7 concierge and travel and lifestyle services.

Who should pick which

Choose the card whose issuer offer fits you, then check the tier benefits. If you travel, confirm acceptance at your destination. American Express vs Mastercard and credit card vs debit card cover related choices. This is general information, not financial advice.`;

const BUILT = buildEditorialComparison({
  slug: "mastercard-vs-visa",
  title: "Mastercard vs Visa: What Actually Differs",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "finance",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Mastercard",
      shortDesc: "Global card network headquartered in Purchase, New York, connecting more than 210 countries and territories.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: [
        "Connections in more than 210 countries and territories (Mastercard)",
        "Zero Liability for unauthorized transactions, with conditions",
        "World, World Elite and World Legend tiers on top of standard cards",
      ],
      cons: [
        "Tier benefits vary by issuer",
        "Zero Liability excludes certain commercial and unregistered prepaid cards",
      ],
      bestFor: "Cardholders whose preferred card offer runs on Mastercard, especially World Elite travel benefits",
    },
    {
      id: B,
      slug: B,
      name: "Visa",
      shortDesc: "Global card network that began as BankAmericard in 1958, operating in more than 200 countries and territories.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: [
        "More than 175 million merchant locations (Visa)",
        "Zero Liability with issuer refunds within five business days of notification",
        "Traditional, Signature and Infinite consumer credit tiers",
      ],
      cons: [
        "Many Signature and Infinite benefits are issuer optional",
        "Zero Liability excludes certain commercial and anonymous prepaid cards",
      ],
      bestFor: "Cardholders whose preferred card offer runs on Visa, especially Signature or Infinite benefits",
    },
  ],
  keyDifferences: [
    { label: "Reach", entityAValue: "More than 210 countries and territories", entityBValue: "More than 200 countries and territories", winner: "tie" },
    { label: "Who sets rates and fees", entityAValue: "The issuing bank", entityBValue: "The issuing bank", winner: "tie" },
    { label: "Consumer credit tiers", entityAValue: "Standard, World, World Elite, World Legend", entityBValue: "Traditional, Signature, Infinite", winner: "tie" },
    { label: "Fraud policy", entityAValue: "Zero Liability (reasonable care, prompt reporting)", entityBValue: "Zero Liability (refund within five business days)", winner: "tie" },
  ],
  attributes: [
    textAttr("type", "What it is", NET, A, B, "Payment network; banks issue the cards", "Payment network; banks issue the cards"),
    textAttr("reach", "Countries and territories", NET, A, B, "More than 210", "More than 200"),
    textAttr("locations", "Acceptance locations", NET, A, B, "More than 150 million", "More than 175 million merchant locations"),
    textAttr("cards", "Cards or credentials", NET, A, B, "3.5 billion Mastercard and Maestro cards", "About 5 billion payment credentials (June 30, 2025)"),
    textAttr("transactions", "Transactions", NET, A, B, "159.4 billion processed in 2024", "329 billion in the 12 months to September 30, 2025"),
    textAttr("tiers", "Credit tiers", NET, A, B, "Standard, World, World Elite, World Legend", "Traditional, Signature, Infinite"),
    textAttr("fraud", "Zero Liability exclusions", NET, A, B, "Certain commercial cards and unregistered prepaid cards", "Certain commercial cards and anonymous prepaid cards"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "american-express-vs-mastercard", title: "American Express vs Mastercard", category: "finance" },
    { slug: "credit-card-vs-debit-card", title: "Credit Card vs Debit Card", category: "finance" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "No network wins: the issuing bank sets rates, fees and rewards. Compare tier benefits and acceptance where you shop.",
    keyFact: "Mastercard reports more than 210 countries and territories; Visa reports more than 200.",
  },
  citationStats: {
    sourceCount: 7,
    dataPointCount: 16,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Mastercard: About us", url: MC_ABOUT },
      { name: "Mastercard: Media resources", url: MC_MEDIA },
      { name: "Mastercard: Credit cards", url: MC_CARDS },
      { name: "Mastercard: Zero Liability", url: MC_ZERO },
      { name: "Visa: About Visa", url: VISA_ABOUT },
      { name: "Visa: Credit cards", url: VISA_CREDIT },
      { name: "Visa: Zero Liability Policy", url: VISA_ZERO },
    ],
  },
  resources: [
    { type: "external", label: "Mastercard: About us", url: MC_ABOUT, description: "More than 210 countries and territories." },
    { type: "external", label: "Mastercard: Media resources", url: MC_MEDIA, description: "3.5 billion Mastercard and Maestro cards, more than 150 million locations, 159.4 billion transactions in 2024, headquarters in Purchase, N.Y." },
    { type: "external", label: "Mastercard: Credit cards", url: MC_CARDS, description: "World, World Elite and World Legend Mastercard tiers." },
    { type: "external", label: "Mastercard: Zero Liability", url: MC_ZERO, description: "Conditions: reasonable care and prompt reporting. Excludes certain commercial and unregistered prepaid cards." },
    { type: "external", label: "Visa: About Visa", url: VISA_ABOUT, description: "More than 200 countries and territories, about 5 billion credentials, about 14.5 thousand institutions, 329 billion transactions, 175 million+ merchant locations. BankAmericard 1958, Visa 1976." },
    { type: "external", label: "Visa: Credit cards", url: VISA_CREDIT, description: "Visa Traditional, Visa Signature and Visa Infinite levels." },
    { type: "external", label: "Visa: Zero Liability Policy", url: VISA_ZERO, description: "Issuers replace funds within five business days of notification. Excludes certain commercial and anonymous prepaid cards." },
  ],
  metaTitle: "Mastercard vs Visa | A Versus B",
});

BUILT.metadata.metaDescription =
  "Mastercard vs Visa: both are card networks, so your bank sets rates and fees. Compare reach, Zero Liability rules and card tiers like Signature and World Elite.";

export const MASTERCARD_VS_VISA: EditorialComparison = BUILT;
