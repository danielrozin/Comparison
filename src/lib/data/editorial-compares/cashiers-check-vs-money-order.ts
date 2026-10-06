import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Cashier's check vs money order (US).
 * Figures from USPS, Notice 123, 12 CFR 229, the CFPB, Chase, Bank of America,
 * Wells Fargo, and Walmart. No page-level winner. Generic payment instruments
 * use entityType "concept" (schema type Thing), not Product.
 * Rent, car, and closing examples are omitted: Chase names other uses.
 * "Many banks no longer offer certified checks" is not on a bank source.
 */

const CHECK = "cashiers-check";
const ORDER = "money-order";

const USPS = "https://www.usps.com/shop/money-orders.htm";
const NOTICE = "https://pe.usps.com/text/DMM300/Notice123.htm";
const CFR_DEF = "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-229/subpart-A/section-229.2";
const CFR_NEXT = "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-229/subpart-B/section-229.10";
const CFR_HOLD = "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-229/subpart-B/section-229.13";
const CFPB_ORDER =
  "https://files.consumerfinance.gov/f/documents/cfpb_your-money-your-goals_find-financial-products-services_tool.pdf";
const CFPB_FAKE =
  "https://www.consumerfinance.gov/ask-cfpb/someone-bought-something-i-was-selling-online-and-sent-me-a-check-or-money-order-for-more-than-the-price-of-the-item-they-asked-me-to-send-back-the-difference-should-i-be-worried-en-997/";
const CFPB_BACK =
  "https://www.consumerfinance.gov/ask-cfpb/i-deposited-a-check-and-waited-until-i-was-able-to-withdraw-the-money-from-the-bank-i-later-found-out-that-the-check-was-fraudulent-the-bankcredit-union-took-the-money-back-and-now-my-account-is-overdrawn-can-they-charge-me-an-overdraft-fe-en-1001/";
const CHASE_FEES = "https://www.chase.com/content/dam/chase-ux/documents/personal/checking/ABSF-en.pdf";
const CHASE_SAPPHIRE = "https://www.chase.com/personal/fees/sapphire-checking";
const CHASE_TYPES = "https://www.chase.com/personal/banking/education/basics/five-common-types-of-checks";
const BOFA_FAQ = "https://www.bankofamerica.com/help/financial-center-faqs/";
const BOFA_GLOSSARY = "https://www.bankofamerica.com/smallbusiness/deposits/resources/glossary/";
const WELLS = "https://www.wellsfargo.com/mobile-online-banking/service-fees/";
const WALMART = "https://www.walmart.com/cp/check-cashing/632047";

const SOURCE_DATE = "2026-10-06";
const PUBLISHED = "2026-10-06T00:00:00Z";
const SPEC = "US";

const SHORT_ANSWER =
  "In the United States, a money order is for a smaller amount and does not require a checking account: the CFPB says no checking account is needed and that money orders are usually for smaller amounts up to $1,000, and USPS says a domestic money order can be up to $1,000. A cashier's check is drawn on the bank and is a direct obligation of the bank under Regulation CC, and Chase says cashier's checks are used for down payments, renovations, international payments, and legal settlements. Neither is named the winner.";

const FAQS = [
  {
    question: "Is a cashier's check safer than a money order?",
    answer:
      "Neither is named safer. Regulation CC defines a cashier's check as a direct obligation of the bank. USPS calls a postal money order a safe alternative to cash and personal checks. The CFPB says a money order is funded up front, so it can't bounce the way a check might. The CFPB also says counterfeit money orders and bad checks are a common scam, and that a bank can take the money back if a deposited check was fraudulent, even after a withdrawal.",
  },
  {
    question: "What's the maximum money order amount?",
    answer:
      "USPS says you can send up to $1,000 in a single domestic money order anywhere in the United States. Notice 123 sets the same maximum of $1,000. Chase lists a money order for an amount up to $1,000. Wells Fargo says checking and savings customers can purchase money orders valued up to $1,000 each. The CFPB says money orders are usually available only in smaller amounts, up to $1,000.",
  },
  {
    question: "Can I get a cashier's check without a bank account?",
    answer:
      "Bank of America says it will not provide a cashier's check unless you have a Bank of America checking or savings account. Wells Fargo says checking and savings customers can order a cashier's check. A money order is the instrument the CFPB says does not need a checking account. USPS says you can buy a postal money order at any Post Office with cash or a debit card, and that you cannot pay with a credit card.",
  },
  {
    question: "How much does a USPS money order cost?",
    answer:
      "USPS lists $2.65 for $0.01 to $500, and $3.75 for $500.01 to $1,000. A postal military money order issued by a military facility is $0.85. Notice 123, effective October 4, 2026, matches those fees. You pay the dollar value plus the issuing fee. Confirm a bank or store fee with that seller. Chase lists $5 for a money order up to $1,000. Wells Fargo lists $5 per money order.",
  },
  {
    question: "How fast do the funds become available?",
    answer:
      "Regulation CC says a USPS money order deposited in a payee's account, in person to an employee of the depositary bank, must be available the next business day. A cashier's check deposited in a payee's account, in person to an employee, must be available the next business day, and the bank may require its special deposit slip. If that deposit is not made in person to an employee, the same section says the second business day. Amounts over $6,725 on one banking day, and amounts over $6,725 in a new account, can take longer. The CFPB says a bank can take the money back if the check was fraudulent, even after you withdrew it.",
  },
  {
    question: "What happens if a money order is lost?",
    answer:
      "USPS says you cannot stop payment on a postal money order, and that a lost or stolen money order can be replaced. USPS says loss or theft may take up to 30 days to confirm, an investigation may take up to 60 days, and there is a $23 processing fee to replace a lost or stolen money order. Notice 123 lists a $23 money order inquiry fee, and that fee covers a copy of a paid money order. The CFPB says a money order can be cancelled or reissued if it is lost or stolen. Take the receipt to a Post Office to start an inquiry.",
  },
  {
    question: "Can a cashier's check or money order be fake?",
    answer:
      "Yes. The CFPB says this is a common scam: someone sends a counterfeit money order or a bad check for more than the price and asks for the difference back. Do not send money to that buyer. Alert the bank or credit union. USPS says a domestic money order can't be more than $1,000, and that the words and numbers for the amount should match. USPS says to verify a money order at tools.usps.com/money-orders.htm or 1-866-459-7822, and to contact the U.S. Postal Inspection Service at 1-877-876-2455 about fraud.",
  },
];

const VERDICT = `Money order (US): the CFPB says no checking account is needed, and that amounts are usually up to $1,000. USPS caps a domestic money order at $1,000. USPS lists $2.65 up to $500 and $3.75 up to $1,000.

Cashier's check (US): Regulation CC makes it a direct obligation of the bank. Chase lists $10 at a branch. Bank of America lists $15 for a checking or savings customer. Wells Fargo lists $10 each. Confirm the fee with the bank.

Neither is named the winner.`;

const EXPERT_ANALYSIS = `In the United States, a money order is for a smaller amount and does not require a checking account: the CFPB says no checking account is needed and that money orders are usually for smaller amounts up to $1,000, and USPS says a domestic money order can be up to $1,000. A cashier's check is drawn on the bank and is a direct obligation of the bank under Regulation CC, and Chase says cashier's checks are used for down payments, renovations, international payments, and legal settlements. Neither is named the winner.

Who issues it

Regulation CC defines a cashier's check as a check drawn on a bank, signed by an officer or employee of the bank on behalf of the bank as drawer, that is a direct obligation of the bank, and that is provided to a customer of the bank or acquired from the bank for remittance purposes. Bank of America says a cashier's check is issued by a bank and paid from its funds, that the amount is paid to the bank when the check is issued, and that the bank then assumes the obligation. Chase says the money is debited from the account holder's account, then the check is printed and signed by a bank representative.

Bank of America says a money order is a financial instrument, issued by a bank or other institution, that lets the named person receive a specified amount of cash on demand, and that it is often used by people who do not have checking accounts. The CFPB says you pay the full amount, plus any fees, up front, and that no checking account is needed. USPS says a postal money order is a safe alternative to sending cash or a personal check.

Fees, limits, and where to get one (US)

USPS says a domestic money order can be up to $1,000. USPS lists $2.65 for $0.01 to $500, $3.75 for $500.01 to $1,000, and $0.85 for a postal military money order issued by a military facility. Notice 123, effective October 4, 2026, matches those three fees and the $1,000 maximum. USPS says you buy one at any Post Office with cash or a debit card, and that you cannot pay with a credit card. You pay the face amount plus the issuing fee. USPS says domestic money orders never expire and do not accrue interest, and that a Post Office cashes one for free for the exact amount on the order.

Chase's personal fee schedule, effective March 15, 2026, lists a money order as a check issued by you, purchased at a branch, for an amount up to $1,000, at $5 per check. The same schedule lists a cashier's check as a check issued by the bank, purchased at a branch, for any amount and to a payee you designate, at $10 per check. Chase says Premier Plus Checking and Private Client Checking do not pay a Chase fee for a money order or a cashier's check. Chase says a Sapphire Checking customer pays no Chase fee for a money order or a cashier's check, and that Sapphire Checking is no longer available for new account openings.

Bank of America says a checking or savings customer can get a cashier's check for a $15 fee, waived for customers enrolled in Preferred Rewards. Bank of America says it will not provide a cashier's check without a checking or savings account. Wells Fargo lists $10 for each cashier's check. Wells Fargo says checking and savings customers can order one online for up to $2,000, or in person for a larger amount, subject to a $6,000 monthly limit per customer. An online order delivered to a U.S. address adds an $8 delivery charge. Wells Fargo says delivery is limited to addresses in the United States, not to P.O. Boxes, and to allow up to 3 business days for Alaska and Hawaii. Wells Fargo lists $5 per money order, up to $1,000 each, for checking and savings customers. Wells Fargo says some accounts offer fee waivers. Confirm the fee with the bank.

Walmart's check-cashing service names money orders as an in-store service and describes the fees as low. It does not state a dollar fee. Confirm the fee at the store.

When each one is used

The CFPB says a money order is a way to pay and manage bills, and a way to guarantee a payment to a person or company because it has already been funded. Chase says cashier's checks are used for down payments for various assets, renovations, international payments, and legal settlements. Cashier's check vs certified check covers the customer's own certified check.

Safety and fraud

The CFPB says a common scam sends a counterfeit money order or a bad check for more than the price of an item, then asks for the difference back. The CFPB says not to send money to that buyer, and to alert the bank or credit union and the marketplace. If you deposit a counterfeit check or money order, the CFPB says you will not receive the funds or you will have to pay them back even if you already withdrew them. The CFPB also says the bank can charge an overdraft fee if taking the money back leaves the account overdrawn.

USPS says a domestic money order can't be more than $1,000, and that the words and the numbers for the amount should match. USPS says discoloration around the dollar amount may show the amount was changed. USPS says to verify a postal money order at tools.usps.com/money-orders.htm or by calling 1-866-459-7822, and to report suspected fraud to the U.S. Postal Inspection Service at 1-877-876-2455 or uspis.gov/report.

How to get one

For a USPS money order, USPS says to decide the amount, go to any Post Office, take cash or a debit card, fill out the money order at the counter, pay the value plus the fee, and keep the receipt. For a cashier's check, Chase says it is purchased at a branch. Bank of America says a checking or savings customer can get one at a financial center. Wells Fargo says checking and savings customers can order one online up to $2,000 or in person for a larger amount. Confirm the fee with the bank before you request one.

Replacing a lost one

USPS says you cannot stop payment on a postal money order. USPS says a lost or stolen money order can be replaced, that confirming the loss may take up to 30 days, that the investigation may take up to 60 days, and that the replacement processing fee is $23. USPS says to take the receipt to any Post Office and start a money order inquiry. USPS says it will replace a defective or damaged money order when you bring that money order and the receipt to a Post Office. The CFPB says a money order can be cancelled or reissued if it gets lost or stolen, and that it can be harder to prove payment without a bank record that it was cashed.

Wells Fargo says a lost, stolen, or destroyed cashier's check can be stopped and reissued only in a branch, and that Wells Fargo requires an indemnity agreement. For a cashier's check over $1,000, Wells Fargo says the wait before that stop and reissuance is 90 days, 30 days in Wisconsin, and 91 days in New York, unless an acceptable surety bond is provided. The cost of that bond varies. Confirm the replacement steps with the bank that issued the check.`;

const SOURCES: { name: string; url: string; description: string }[] = [
  {
    name: "USPS money orders",
    url: USPS,
    description:
      "Domestic maximum $1,000. Fees $2.65, $3.75, and $0.85 for a postal military money order. Cash or debit, not a credit card. Post Office cashing is free. No stop payment. Replacement timing and a $23 processing fee. Fake-money-order checks and verification phone numbers.",
  },
  {
    name: "USPS Notice 123",
    url: NOTICE,
    description:
      "Price list effective October 4, 2026. Domestic money order $2.65 up to $500 and $3.75 up to a $1,000 maximum. Postal military money order $0.85. Inquiry fee $23, covering a copy of a paid money order.",
  },
  {
    name: "12 CFR 229.2 (eCFR)",
    url: CFR_DEF,
    description:
      "Cashier's check: drawn on a bank, signed for the bank as drawer, a direct obligation of the bank. A USPS money order is a check for availability purposes.",
  },
  {
    name: "12 CFR 229.10 (eCFR)",
    url: CFR_NEXT,
    description:
      "Next-business-day availability for a USPS money order and for a cashier's check deposited in person to an employee, into a payee's account. Second business day if not in person. Special deposit slip for a cashier's check when the bank requires one.",
  },
  {
    name: "12 CFR 229.13 (eCFR)",
    url: CFR_HOLD,
    description:
      "New-account and large-deposit exceptions at $6,725. New-account excess by the ninth business day. Reasonable-cause and emergency exceptions.",
  },
  {
    name: "CFPB financial products tool",
    url: CFPB_ORDER,
    description:
      "Money order: pay the amount plus fees up front, no checking account needed, usually up to $1,000, offered by a bank, credit union, check-cashing store, or USPS. Can be cancelled or reissued if lost or stolen.",
  },
  {
    name: "CFPB fake check answer",
    url: CFPB_FAKE,
    description:
      "A counterfeit money order or bad check for more than the price, with a request to send the difference back, is a common scam. Do not send money. Alert the bank.",
  },
  {
    name: "CFPB fraudulent deposit answer",
    url: CFPB_BACK,
    description:
      "A bank can take the money back if the deposited check was fraudulent, even after a withdrawal, and can charge an overdraft fee if the account is then overdrawn.",
  },
  {
    name: "Chase personal fee schedule",
    url: CHASE_FEES,
    description:
      "Effective March 15, 2026. Money order $5, up to $1,000, at a branch. Cashier's check $10, at a branch, for any amount. Premier Plus Checking and Private Client Checking pay no Chase fee for either.",
  },
  {
    name: "Chase Sapphire Checking fees",
    url: CHASE_SAPPHIRE,
    description:
      "Sapphire Checking is no longer available for new account openings. A Sapphire Checking customer pays no Chase fee for a money order or a cashier's check.",
  },
  {
    name: "Chase, five common types of checks",
    url: CHASE_TYPES,
    description:
      "Cashier's checks are used for down payments, renovations, international payments, and legal settlements. The bank debits the account, then a bank representative signs the check.",
  },
  {
    name: "Bank of America financial center FAQ",
    url: BOFA_FAQ,
    description:
      "A checking or savings customer can get a cashier's check for $15. The fee is waived for Preferred Rewards. Bank of America will not provide a cashier's check without a checking or savings account.",
  },
  {
    name: "Bank of America glossary",
    url: BOFA_GLOSSARY,
    description:
      "Cashier's check: issued by a bank and paid from its funds. Money order: often used by people who do not have checking accounts.",
  },
  {
    name: "Wells Fargo consumer and business fees",
    url: WELLS,
    description:
      "Cashier's check $10. Online up to $2,000, in person for a larger amount, $6,000 monthly limit. Delivery $8 inside the United States. Money order $5, up to $1,000. Lost-check wait of 90 days, 30 days in Wisconsin, 91 days in New York.",
  },
  {
    name: "Walmart check cashing",
    url: WALMART,
    description:
      "Names money orders as an in-store service and describes the fees as low. No dollar fee is stated there.",
  },
];

export const CASHIERS_CHECK_VS_MONEY_ORDER: EditorialComparison = buildEditorialComparison({
  slug: "cashiers-check-vs-money-order",
  title: "Cashier's Check vs Money Order",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "finance",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: CHECK,
      slug: CHECK,
      name: "Cashier's check",
      shortDesc: "A check drawn on the bank and a direct obligation of the bank.",
      imageUrl: null,
      entityType: "concept",
      position: 0,
      pros: [
        "Regulation CC: a direct obligation of the bank",
        "Chase lists $10 at a branch, and some Chase accounts pay no Chase fee",
        "Chase names down payments, renovations, international payments, and legal settlements",
        "Next-business-day availability when Regulation CC's in-person conditions are met",
      ],
      cons: [
        "Bank of America will not provide one without a checking or savings account",
        "Bank of America lists a $15 fee unless Preferred Rewards waives it",
        "Wells Fargo lists a $6,000 monthly limit per customer",
        "The CFPB says a counterfeit check can be taken back after you withdraw the money",
      ],
      bestFor: "A bank's own check for a larger payment",
    },
    {
      id: ORDER,
      slug: ORDER,
      name: "Money order",
      shortDesc: "A funded payment, usually up to $1,000, with no checking account required.",
      imageUrl: null,
      entityType: "concept",
      position: 1,
      pros: [
        "The CFPB says no checking account is needed",
        "USPS lists $2.65 up to $500 and $3.75 up to $1,000",
        "USPS cashes a postal money order at a Post Office for free",
        "USPS says domestic postal money orders never expire",
      ],
      cons: [
        "USPS caps a domestic money order at $1,000",
        "USPS says you cannot pay for one with a credit card",
        "USPS says you cannot stop payment on a postal money order",
        "The CFPB says counterfeit money orders are part of a common scam",
      ],
      bestFor: "A smaller funded payment, with no checking account required",
    },
  ],
  keyDifferences: [
    {
      label: "Who stands behind it",
      entityAValue: "The bank. Regulation CC: a direct obligation of the bank",
      entityBValue: "Funded up front. USPS, a bank, or another issuer",
      winner: "tie",
    },
    {
      label: "US maximum",
      entityAValue: "Chase: any amount at a branch. Wells Fargo: $6,000 a month",
      entityBValue: "USPS, Chase, and Wells Fargo: $1,000 each",
      winner: "tie",
    },
    {
      label: "US fee",
      entityAValue: "Chase $10. Bank of America $15. Wells Fargo $10. Confirm with the bank",
      entityBValue: "USPS $2.65 or $3.75. Chase $5. Wells Fargo $5",
      winner: "tie",
    },
    {
      label: "Checking account",
      entityAValue: "Bank of America requires a checking or savings account",
      entityBValue: "The CFPB says no checking account is needed",
      winner: "tie",
    },
    {
      label: "Where to get it (US)",
      entityAValue: "The bank's branch. Wells Fargo also offers online up to $2,000",
      entityBValue: "Any Post Office. Chase or Wells Fargo branch. Walmart names them in store",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "issuer",
      "Who issues it",
      SPEC,
      CHECK,
      ORDER,
      "The bank. Regulation CC: drawn on the bank, signed for the bank, a direct obligation of the bank",
      "USPS, a bank, or another institution. The CFPB says you pay the amount plus fees up front"
    ),
    textAttr(
      "maximum",
      "Maximum (US)",
      SPEC,
      CHECK,
      ORDER,
      "Chase: any amount, purchased at a branch. Wells Fargo: online up to $2,000, and $6,000 a month per customer",
      "USPS domestic: $1,000. Chase: up to $1,000. Wells Fargo: up to $1,000 each. The CFPB says usually up to $1,000"
    ),
    textAttr(
      "fee",
      "Fee (US)",
      SPEC,
      CHECK,
      ORDER,
      "Chase $10. Bank of America $15, waived for Preferred Rewards. Wells Fargo $10, plus $8 delivery for an online order. Some accounts waive the fee. Confirm with the bank",
      "USPS $2.65 up to $500, $3.75 up to $1,000, $0.85 for a postal military money order. Chase $5. Wells Fargo $5. Walmart describes its fee as low and does not state a dollar fee"
    ),
    textAttr(
      "account",
      "Account needed",
      SPEC,
      CHECK,
      ORDER,
      "Bank of America: a checking or savings account. Wells Fargo: checking and savings customers",
      "The CFPB: no checking account needed. USPS: cash or debit at a Post Office, not a credit card"
    ),
    textAttr(
      "where",
      "Where to get it (US)",
      SPEC,
      CHECK,
      ORDER,
      "Chase: a branch. Bank of America: a financial center. Wells Fargo: online up to $2,000, or in person for a larger amount",
      "Any Post Office. A Chase or Wells Fargo branch for their money orders. Walmart names money orders in store"
    ),
    textAttr(
      "availability",
      "When deposited funds must be available",
      SPEC,
      CHECK,
      ORDER,
      "Next business day if deposited in a payee's account, in person to an employee, with the bank's special slip when required. Second business day if not in person. Exceptions can apply over $6,725",
      "A USPS money order: next business day in a payee's account, in person to an employee. Second business day if not in person. Exceptions can apply over $6,725"
    ),
    textAttr(
      "lost",
      "If it is lost",
      SPEC,
      CHECK,
      ORDER,
      "Wells Fargo: branch stop and reissuance, an indemnity agreement, and a wait of 90 days over $1,000 (30 days in Wisconsin, 91 days in New York) unless a surety bond is provided",
      "USPS: no stop payment. Replacement after an inquiry. Up to 30 days to confirm, up to 60 days to investigate, $23 processing fee. The CFPB says it can be cancelled or reissued"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "cashiers-check-vs-certified-check",
      title: "Cashier's Check vs Certified Check",
      category: "finance",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Neither is named the winner.",
    keyFact:
      "USPS caps a domestic money order at $1,000 and lists $2.65 up to $500 and $3.75 up to $1,000. Regulation CC makes a cashier's check a direct obligation of the bank.",
  },
  citationStats: {
    sourceCount: SOURCES.length,
    dataPointCount: 18,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: SOURCES.map((source) => ({ name: source.name, url: source.url })),
  },
  resources: SOURCES.map((source) => ({
    type: "external" as const,
    label: source.name,
    url: source.url,
    description: source.description,
  })),
  metaTitle: "Cashier's Check vs Money Order | A Versus B",
});
