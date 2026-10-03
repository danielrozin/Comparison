import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Coinbase vs Binance, checked 3 October 2026.
 * Coinbase: the pricing and fees disclosures, and the about page.
 * Binance: the about page, the ADGM transition announcement, the spot-fee
 * calculation article, and the BNB fee-discount article.
 * No page-level winner.
 */

const COINBASE = "coinbase";
const BINANCE = "binance";

const COINBASE_FEES = "https://help.coinbase.com/en/coinbase/trading-and-funding/pricing-and-fees/fees";
const COINBASE_ABOUT = "https://www.coinbase.com/about";
const BINANCE_ABOUT = "https://www.binance.info/en/about";
const BINANCE_ADGM = "https://www.binance.info/en/support/announcement/detail/f4f57a010f074dae9d34718635aba926";
const BINANCE_SPOT = "https://www.binance.info/en/support/faq/detail/e85d6e703b874674840122196b89780a";
const BINANCE_BNB = "https://www.binance.info/en/support/faq/detail/115000583311";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const SPEC = "Fees";

const SHORT_ANSWER =
  "Coinbase (NASDAQ: COIN) reported $246 billion of assets on platform as of 30 June 2026. A simple Coinbase buy or sell includes a spread, and a simple limit order adds a 1% execution fee. A regular Binance spot trade costs 0.1% of the asset you receive. Binance's BNB fee discount puts that example at 0.075% when the 25% discount applies. There is no winner.";

const FAQS = [
  {
    question: "What does a Coinbase trade cost?",
    answer:
      "Coinbase charges a fee when you buy, sell, or convert cryptocurrency, and that fee varies by payment method, order size, market conditions, location, and asset. The trade preview shows the fee before you submit. A simple buy or sell also includes a spread in the quoted price. A simple limit order adds an execution fee equal to 1% of the amount traded, and Coinbase may also charge a 1.875% Coinbase fee that varies by payment method. Coinbase Advanced does not include a spread. Hosted cash and cryptocurrency balances are free to store, and a transfer from one Coinbase user's primary balance to another is free.",
  },
  {
    question: "What does a Binance spot trade cost?",
    answer:
      "Binance says a regular spot user pays 0.1%. The fee is charged in the asset you receive: buy ETH/USDC and the fee is in ETH; sell and the fee is in USDC. The rate can change with VIP level. Binance's BNB fee discount puts that regular-user example at 0.075% when the 25% spot and margin discount applies. That discount is 25% until further notice, and futures fees can be discounted by up to 10%.",
  },
  {
    question: "When does the Binance BNB discount apply?",
    answer:
      "The discount needs BNB in the Spot account and the Using BNB Deduction setting turned on. If the BNB balance is too low, Binance charges the full fee. The estimated fee shown before the trade is a reference. The actual fee depends on the amount of the asset you receive.",
  },
  {
    question: "Who operates Binance.com after the ADGM change?",
    answer:
      "Binance says that from 5 January 2026 at 08:00 UTC, spot and derivative exchange activity is provided by Nest Exchange Limited, a Recognized Investment Exchange. Nest Clearing and Custody Limited is the Recognized Clearing House and custodian, and the central counterparty for on-exchange derivative trades. Nest Trading Limited is the broker-dealer for off-exchange services such as OTC, Convert, and Earn. Login, balances, and order history stay in place.",
  },
  {
    question: "What did Coinbase report as of 30 June 2026?",
    answer:
      "As of 30 June 2026, Coinbase reports a 10.3% crypto trading volume market share, $246 billion of assets on platform, 100+ countries, and 4,300+ employees. Coinbase also reports 245,000 ecosystem partners. Brian Armstrong is Co-Founder and Chief Executive Officer. The company trades as NASDAQ: COIN. The fee disclosures are not applicable in all regions.",
  },
  {
    question: "Which one is the winner?",
    answer:
      "Neither. Coinbase prices a simple trade with a spread and a fee shown on the preview, and prices a simple limit order with a 1% execution fee. Binance's regular-user spot example is 0.1%. Binance's BNB fee discount puts that example at 0.075%. Those are different ways of charging. There is no winner.",
  },
];

const VERDICT = `Best fit for a spread-quoted simple trade at a company that trades as NASDAQ: COIN: Coinbase. Storage of a hosted balance is free, and Coinbase Advanced has no spread.

Best fit for a spot order book with a regular-user example of 0.1%: Binance. Binance's BNB fee discount takes that example to 0.075% when the discount is on and the BNB balance covers it.

There is no single winner.`;

const EXPERT_ANALYSIS = `Coinbase and Binance both let a customer buy and sell cryptocurrency. They do not quote that trade the same way. There is no winner.

Coinbase

Coinbase trades as NASDAQ: COIN. Brian Armstrong is Co-Founder and Chief Executive Officer. As of 30 June 2026, Coinbase reports a 10.3% crypto trading volume market share, $246 billion of assets on platform, 100+ countries, and 4,300+ employees. Coinbase also reports 245,000 ecosystem partners. Consumers use Coinbase's apps. Institutions use Coinbase Prime. Developers use the Coinbase Developer Platform.

A hosted cash or cryptocurrency balance is free. A transfer between two Coinbase users' primary balances is free. Sending cryptocurrency off the platform includes a network fee shown at the time of the transaction. A Lightning Network bitcoin send adds a processing fee of 0.2% of the bitcoin. A USDT withdrawal adds a processing fee of 0.01% of the amount, capped at 20 USDT, plus a network fee. A 0.10% USDC processing fee applies to net conversion above $5 million in a rolling 30 days.

A simple buy or sell includes a spread in the quoted price. The separate Coinbase fee on a buy, sell, or convert varies, and the trade preview shows it. A simple limit order adds an execution fee of 1% of the amount traded. Coinbase may also charge a 1.875% Coinbase fee on that limit order, and that fee varies by payment method. Coinbase Advanced has no spread. Coinbase One can zero out trading fees with limits: the 1% limit-order execution fee is still charged, and a spread can still be in the quoted price. There is no fee to stake. Coinbase's commission on staking rewards is 35% for ADA, ATOM, AVAX, DOT, ETH, MATIC, SOL, and XTZ. Coinbase does not have payment-for-order-flow relationships with market makers. The disclosed fees are not applicable in all regions.

Binance

Changpeng Zhao launched Binance in July 2017. Yi He is Co-CEO and Co-Founder. Richard Teng is Co-CEO. Binance says Binance Exchange is regulated by the ADGM FSRA. Customer support runs 24/7 in 40 languages.

Binance says that from 5 January 2026 at 08:00 UTC, spot and derivative exchange activity is provided by Nest Exchange Limited, clearing and custody by Nest Clearing and Custody Limited, and off-exchange services such as OTC, Convert, and Earn by Nest Trading Limited.

On a spot trade, the fee is charged in the asset you receive. Binance's regular-user rate in the fee example is 0.1%, and the rate can change with VIP level. Binance's BNB fee discount grants 25% off spot and margin fees, so that regular-user example is 0.075%. Futures fees can be discounted by up to 10%. The 25% discount is valid until further notice. It requires BNB in the Spot account and the deduction setting. A short BNB balance means the full fee.

Who should use which

Use Coinbase if you want the simple-trade preview, with its spread and its disclosed fee, at the company (NASDAQ: COIN) that reported $246 billion of assets on platform as of 30 June 2026. Use Binance if you want the spot order book whose regular-user example is 0.1%, or 0.075% under Binance's BNB fee discount. The two fees are not ranked here, because one quote includes a spread and the other is a percentage of the asset you receive.`;

export const COINBASE_VS_BINANCE: EditorialComparison = buildEditorialComparison({
  slug: "coinbase-vs-binance",
  title: "Coinbase vs Binance",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "companies",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: COINBASE,
      slug: COINBASE,
      name: "Coinbase",
      shortDesc: "Public crypto company (NASDAQ: COIN), with simple trades, Advanced, and hosted balances.",
      imageUrl: null,
      entityType: "company",
      position: 0,
      pros: [
        "NASDAQ: COIN. $246 billion of assets on platform as of 30 June 2026",
        "Hosted cash and crypto balances are free to store",
        "Coinbase Advanced has no spread",
        "No payment-for-order-flow relationships with market makers",
      ],
      cons: [
        "A simple buy or sell includes a spread in the quoted price",
        "A simple limit order adds a 1% execution fee",
        "Staking commission is 35% of rewards on ADA, ATOM, AVAX, DOT, ETH, MATIC, SOL, and XTZ",
      ],
      bestFor: "Best for a simple trade with the fee shown before you submit",
    },
    {
      id: BINANCE,
      slug: BINANCE,
      name: "Binance",
      shortDesc: "Crypto exchange launched in July 2017, with spot fees and an ADGM structure from January 2026.",
      imageUrl: null,
      entityType: "company",
      position: 1,
      pros: [
        "Regular-user spot example is 0.1%, charged in the asset you receive",
        "Binance's BNB fee discount takes that example to 0.075%",
        "Binance says that from 5 January 2026, spot and derivatives sit with Nest Exchange Limited",
        "Customer support is 24/7 in 40 languages",
      ],
      cons: [
        "The 0.1% example can change with VIP level",
        "The BNB discount needs BNB in the Spot account and the deduction setting on",
        "A short BNB balance means the full spot fee",
      ],
      bestFor: "Best for a spot order book with a BNB fee discount",
    },
  ],
  keyDifferences: [
    {
      label: "Company",
      entityAValue: "NASDAQ: COIN. Brian Armstrong, CEO",
      entityBValue: "Launched July 2017. Yi He and Richard Teng, Co-CEOs",
      winner: "tie",
    },
    {
      label: "Simple or spot price",
      entityAValue: "Spread, plus a fee shown on the preview",
      entityBValue: "Regular-user example 0.1% of the asset received",
      winner: "tie",
    },
    {
      label: "Discount",
      entityAValue: "Coinbase One can zero trading fees, with limits",
      entityBValue: "25% off spot and margin fees when paying with BNB",
      winner: "tie",
    },
    {
      label: "Regulatory status (company statement)",
      entityAValue: "NASDAQ: COIN. Fees not applicable in all regions",
      entityBValue: "Binance says Binance Exchange is regulated by the ADGM FSRA",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("listing", "Company", SPEC, COINBASE, BINANCE, "NASDAQ: COIN. Brian Armstrong, Co-Founder and CEO. 4,300+ employees as of 30 June 2026", "Launched July 2017 by Changpeng Zhao. Yi He and Richard Teng are Co-CEOs"),
    textAttr("scale", "Scale", SPEC, COINBASE, BINANCE, "As of 30 June 2026: 10.3% crypto trading volume market share, $246 billion assets on platform, 100+ countries. Also reports 245,000 ecosystem partners", "Binance says Binance Exchange is regulated by the ADGM FSRA. Support 24/7 in 40 languages"),
    textAttr("spot", "Trade price", SPEC, COINBASE, BINANCE, "Simple buy or sell includes a spread. Fee varies and is shown on the preview. Simple limit order: 1% execution fee, and a Coinbase fee that may be 1.875%", "Regular-user spot example 0.1%, in the asset you receive. VIP level can change the rate"),
    textAttr("discount", "Discount", SPEC, COINBASE, BINANCE, "Coinbase One can zero trading fees. The 1% limit-order fee still applies. A spread can remain", "25% off spot and margin with BNB, until further notice. Futures discount up to 10%"),
    textAttr("storage", "Holding crypto", SPEC, COINBASE, BINANCE, "Hosted balance storage is free. User-to-user primary balance transfer is free", "From 5 January 2026, Nest Clearing and Custody Limited safeguards user digital assets"),
    textAttr("regulator", "Named oversight", SPEC, COINBASE, BINANCE, "Fee disclosures are not applicable in all regions", "Binance says Binance Exchange is regulated by the ADGM FSRA. Nest Exchange Limited runs spot and derivatives from 5 January 2026"),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Coinbase for a spread-quoted simple trade at a company that trades as NASDAQ: COIN. Binance for a spot book whose regular-user example is 0.1%, or 0.075% under the BNB fee discount.",
    keyFact:
      "Coinbase simple trades include a spread and a 1% simple-limit fee. Binance's regular-user spot example is 0.1%.",
  },
  citationStats: {
    sourceCount: 6,
    dataPointCount: 8,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "Coinbase Help — pricing and fees disclosures", url: COINBASE_FEES },
      { name: "Coinbase — About", url: COINBASE_ABOUT },
      { name: "Binance — About", url: BINANCE_ABOUT },
      { name: "Binance — ADGM transition announcement (updated 2026-01-05)", url: BINANCE_ADGM },
      { name: "Binance Support — spot trading fees (updated 2026-01-06)", url: BINANCE_SPOT },
      { name: "Binance Support — BNB fee discount (updated 2026-02-06)", url: BINANCE_BNB },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Coinbase pricing and fees",
      url: COINBASE_FEES,
      description:
        "Spread on simple trades, 1% simple limit-order fee, Advanced with no spread, free hosted balances, 35% staking commission on the listed assets.",
    },
    {
      type: "external",
      label: "Coinbase about",
      url: COINBASE_ABOUT,
      description:
        "As of 30 June 2026: 10.3% market share, $246 billion assets on platform, 100+ countries, 4,300+ employees. Also reports 245,000 ecosystem partners.",
    },
    {
      type: "external",
      label: "Binance about",
      url: BINANCE_ABOUT,
      description:
        "Launched July 2017. Yi He and Richard Teng are Co-CEOs. Binance says Binance Exchange is regulated by the ADGM FSRA. Support in 40 languages.",
    },
    {
      type: "external",
      label: "Binance ADGM announcement",
      url: BINANCE_ADGM,
      description:
        "Updated 2026-01-05. From 5 January 2026, Nest Exchange Limited, Nest Clearing and Custody Limited, and Nest Trading Limited provide the services.",
    },
    {
      type: "external",
      label: "Binance spot fee calculation",
      url: BINANCE_SPOT,
      description:
        "Regular-user example 0.1%, charged in the asset received. VIP level can change the rate.",
    },
    {
      type: "external",
      label: "Binance BNB fee discount",
      url: BINANCE_BNB,
      description:
        "25% off spot and margin, so the regular-user example is 0.075%. Up to 10% off futures. The 25% discount is valid until further notice. A short BNB balance means the full fee.",
    },
  ],
  metaTitle: "Coinbase vs Binance | A Versus B",
});
