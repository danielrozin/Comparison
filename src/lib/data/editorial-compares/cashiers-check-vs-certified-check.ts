import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Cashier's check vs certified check (US).
 * Definitions from 12 CFR 229.2. Fees from Chase, Bank of America, and Wells Fargo.
 * Availability from 12 CFR 229.10 and 229.13. Fraud from the CFPB.
 * No page-level winner. entityType "concept" (schema type Thing).
 * "Many banks no longer offer certified checks" is omitted: Chase and Bank of
 * America still describe them, and no bank source here says they stopped.
 */

const CASHIER = "cashiers-check";
const CERTIFIED = "certified-check";

const CFR_DEF = "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-229/subpart-A/section-229.2";
const CFR_NEXT = "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-229/subpart-B/section-229.10";
const CFR_HOLD = "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-229/subpart-B/section-229.13";
const CFPB_FAKE =
  "https://www.consumerfinance.gov/ask-cfpb/someone-bought-something-i-was-selling-online-and-sent-me-a-check-or-money-order-for-more-than-the-price-of-the-item-they-asked-me-to-send-back-the-difference-should-i-be-worried-en-997/";
const CFPB_BACK =
  "https://www.consumerfinance.gov/ask-cfpb/i-deposited-a-check-and-waited-until-i-was-able-to-withdraw-the-money-from-the-bank-i-later-found-out-that-the-check-was-fraudulent-the-bankcredit-union-took-the-money-back-and-now-my-account-is-overdrawn-can-they-charge-me-an-overdraft-fe-en-1001/";
const CHASE_FEES = "https://www.chase.com/content/dam/chase-ux/documents/personal/checking/ABSF-en.pdf";
const CHASE_SAPPHIRE = "https://www.chase.com/personal/fees/sapphire-checking";
const CHASE_VS = "https://www.chase.com/personal/banking/education/basics/cashiers-check-vs-certified-check";
const CHASE_TYPES = "https://www.chase.com/personal/banking/education/basics/five-common-types-of-checks";
const BOFA_FAQ = "https://www.bankofamerica.com/help/financial-center-faqs/";
const BOFA_GLOSSARY = "https://www.bankofamerica.com/smallbusiness/deposits/resources/glossary/";
const WELLS = "https://www.wellsfargo.com/mobile-online-banking/service-fees/";

const SOURCE_DATE = "2026-10-06";
const PUBLISHED = "2026-10-06T00:00:00Z";
const SPEC = "US";

const SHORT_ANSWER =
  "A cashier's check is drawn on the bank's own funds: Regulation CC defines it as a check signed for the bank as drawer and a direct obligation of the bank. A certified check is the customer's own check that the drawee bank certifies, and Regulation CC says the bank has set aside funds equal to the check to pay it, or that the bank will pay the check on presentment. Neither is named the winner.";

const FAQS = [
  {
    question: "What is the difference between a cashier's check and a certified check?",
    answer:
      "Regulation CC says a cashier's check is drawn on the bank, signed for the bank as drawer, and is a direct obligation of the bank. A certified check is a check the drawee bank certifies. Certification means the drawer's signature is genuine and the bank has set aside funds equal to the check that will be used to pay it, or that the bank will pay the check on presentment. Chase says the cashier's check amount is withdrawn when you request it, and that a certified check is your personal check.",
  },
  {
    question: "Do certified checks still exist?",
    answer:
      "Regulation CC still defines a certified check. Chase still describes one as a personal check the bank verifies, and Bank of America still defines one as a check for which the bank guarantees payment. Chase's personal fee schedule states a cashier's check fee and a money order fee. It does not state a certified-check fee. Confirm with the bank whether it will certify a check.",
  },
  {
    question: "How much does a cashier's check cost?",
    answer:
      "Chase lists $10 per cashier's check purchased at a branch. Chase Premier Plus Checking and Chase Private Client Checking pay no Chase fee for one. Chase says a Sapphire Checking customer pays no Chase fee for one, and that Sapphire Checking is no longer available for new account openings. Bank of America lists $15, waived for Preferred Rewards. Wells Fargo lists $10 each, plus $8 to deliver an online order inside the United States. Confirm the fee with the bank. These schedules do not state a certified-check fee.",
  },
  {
    question: "Does a certified check set the money aside?",
    answer:
      "Regulation CC says certification can mean the bank has set aside funds equal to the check and will use those funds to pay it, or that the bank will pay the check on presentment. Chase says the bank sets the money aside when the check is certified, and that the money is drawn from the linked checking account when the check is cashed or deposited. Chase also says the funds are not withdrawn until the recipient cashes the check. A cashier's check is withdrawn when you request it.",
  },
  {
    question: "How fast do the funds become available?",
    answer:
      "Regulation CC puts a cashier's check and a certified check on the same next-day rule. Deposited in a payee's account, in person to an employee of the depositary bank, the funds must be available the next business day. The bank may require its special deposit slip. If the deposit is not made in person to an employee, the rule is the second business day. Amounts over $6,725 on one banking day, and amounts over $6,725 in a new account, can take longer. The CFPB says the bank can take the money back if the check was fraudulent, even after a withdrawal.",
  },
  {
    question: "What if a cashier's check is lost?",
    answer:
      "Wells Fargo says you may request a stop payment and reissuance only in a branch, and that Wells Fargo requires an indemnity agreement. For a cashier's check over $1,000, Wells Fargo says the wait is 90 days, 30 days in Wisconsin, and 91 days in New York, unless an acceptable surety bond is provided. The cost of that bond varies. Chase says a cashier's check cannot be canceled the way a personal check can. Confirm the steps with the bank that issued the check.",
  },
  {
    question: "Is a cashier's check safer than a certified check?",
    answer:
      "Neither is named safer. Chase says both may provide extra assurance for large transactions, and that both generally offer a high level of security compared with a regular personal check. Bank of America says a cashier's check will not usually bounce because the bank assumes the obligation, and that a certified check is a check for which the bank guarantees payment. The CFPB says a bad check can still be counterfeit, and that the bank can take deposited funds back if the check was fraudulent.",
  },
];

const VERDICT = `Cashier's check (US): Regulation CC makes it a direct obligation of the bank. Chase lists $10 at a branch. Bank of America lists $15. Wells Fargo lists $10. Confirm the fee with the bank.

Certified check (US): the customer's own check. Regulation CC says the drawee bank certifies it and has set aside funds equal to the check, or will pay it on presentment. These three bank schedules do not state a certified-check fee.

Neither is named the winner.`;

const EXPERT_ANALYSIS = `A cashier's check is drawn on the bank's own funds: Regulation CC defines it as a check signed for the bank as drawer and a direct obligation of the bank. A certified check is the customer's own check that the drawee bank certifies, and Regulation CC says the bank has set aside funds equal to the check to pay it, or that the bank will pay the check on presentment. Neither is named the winner.

Who issues it

Regulation CC says a cashier's check is drawn on a bank, signed by an officer or employee of the bank on behalf of the bank as drawer, is a direct obligation of the bank, and is provided to a customer of the bank or acquired from the bank for remittance purposes. Bank of America says it is issued by a bank and paid from the bank's funds, that the amount is paid to the bank when it is issued, and that the bank then assumes the obligation. Chase says the bank withdraws the amount from your account and issues the check using the bank's own account details.

Regulation CC says a certified check is a check the drawee bank certifies by the signature of an officer or other authorized employee. That certification is either that the drawer's signature is genuine and the bank has set aside funds equal to the check that will be used to pay it, or that the bank will pay the check on presentment. Chase says a certified check is a personal check the bank verifies as having sufficient funds. Bank of America says a certified check is a check for which the bank guarantees payment.

Fees, limits, and where to get one (US)

Chase's personal fee schedule, effective June 14, 2026, lists a cashier's check at $10 per check, purchased at a branch, for any amount and to a payee you designate. Chase says Premier Plus Checking and Private Client Checking do not pay a Chase fee for a cashier's check. Chase says a Sapphire Checking customer pays no Chase fee for a cashier's check, and that Sapphire Checking is no longer available for new account openings. Bank of America lists a $15 fee for a checking or savings customer, waived for customers enrolled in Preferred Rewards. Bank of America says it will not provide a cashier's check without a checking or savings account. Wells Fargo lists $10 for each cashier's check. Checking and savings customers can order one online for up to $2,000, or in person for a larger amount, with a $6,000 monthly limit per customer. Delivery of an online order to a U.S. address adds $8. Wells Fargo says it does not deliver to P.O. Boxes, and to allow up to 3 business days for Alaska and Hawaii. Wells Fargo says some accounts offer fee waivers. Confirm the fee with the bank.

Chase's personal fee schedule states a cashier's check fee and a money order fee. It does not state a certified-check fee. Bank of America's financial center FAQ states the $15 cashier's check fee and does not state a certified-check fee. Wells Fargo's fee schedule states the $10 cashier's check fee and does not state a certified-check fee. Confirm with the bank whether it will certify a check and what it charges.

When each one is used

Chase says cashier's checks tend to be used for larger transactions, and that certified checks may be best for smaller payments. On its types-of-checks explanation, Chase says cashier's checks are used for down payments for various assets, renovations, international payments, and legal settlements, and that certified checks are used for large purchases, down payments for various assets, and government transactions. Chase says both may provide extra assurance for large transactions. Cashier's check vs money order covers postal and bank money orders.

Safety and fraud

Chase says the bank's signature on a certified check guarantees payment, and that the bank sets the money aside so the check can be paid without a risk of bouncing. Chase says a cashier's check cannot be canceled the way a personal check can. Bank of America says a cashier's check will not usually bounce. Those statements describe a check the bank actually issued or certified.

The CFPB says a common scam uses a bad check for more than the price of something you are selling, then asks you to send the difference back. Do not send that money. Alert the bank or credit union. The CFPB says the bank can take the money back if the deposited check was fraudulent, even if the bank had made the money available and you had withdrawn it, and that the bank can charge an overdraft fee if the account is then overdrawn.

How to get one

Chase says a cashier's check is purchased at a branch, and that you may be able to get one online. Wells Fargo says checking and savings customers can order one online up to $2,000 or in person for a larger amount. Bank of America says a checking or savings customer gets one at a financial center. Chase says a certified check is your personal check, so certification may require a visit to the bank. Confirm the fee and whether that bank will certify a check before you go.

Replacing a lost one

Wells Fargo says a stop payment and reissuance of a lost, stolen, or destroyed cashier's check can be completed only in a branch, and that an indemnity agreement is required. For a cashier's check over $1,000, Wells Fargo says the waiting period is 90 days, 30 days in Wisconsin, and 91 days in New York. A surety bond can avoid that wait. The cost varies by the amount and the insurer. Chase says that, for the person receiving a cashier's check, it cannot be canceled the way a personal check can. Confirm the steps with the bank that issued or certified the check.`;

const SOURCES: { name: string; url: string; description: string }[] = [
  {
    name: "12 CFR 229.2 (eCFR)",
    url: CFR_DEF,
    description:
      "Cashier's check: drawn on a bank, signed for the bank as drawer, a direct obligation of the bank. Certified check: the drawee bank certifies the signature and sets funds aside, or agrees to pay the check on presentment.",
  },
  {
    name: "12 CFR 229.10 (eCFR)",
    url: CFR_NEXT,
    description:
      "Next-business-day availability for a cashier's check or a certified check deposited in a payee's account, in person to an employee, with a special deposit slip when the bank requires one. Second business day if not in person.",
  },
  {
    name: "12 CFR 229.13 (eCFR)",
    url: CFR_HOLD,
    description:
      "New-account and large-deposit exceptions at $6,725. New-account excess by the ninth business day. Reasonable-cause and emergency exceptions.",
  },
  {
    name: "CFPB fake check answer",
    url: CFPB_FAKE,
    description:
      "A bad check for more than the price, with a request to send the difference back, is a common scam. Do not send money. Alert the bank.",
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
      "Effective June 14, 2026. Cashier's check $10 at a branch, for any amount. Premier Plus Checking and Private Client Checking pay no Chase fee. No certified-check fee is stated.",
  },
  {
    name: "Chase Sapphire Checking fees",
    url: CHASE_SAPPHIRE,
    description:
      "Sapphire Checking is no longer available for new account openings. A Sapphire Checking customer pays no Chase fee for a cashier's check.",
  },
  {
    name: "Chase, cashier's check vs certified check",
    url: CHASE_VS,
    description:
      "A cashier's check is issued on the bank's account details and the amount is withdrawn at the request. A certified check is a personal check. Chase says the amount is usually set aside, and also that it is not withdrawn until the check is cashed.",
  },
  {
    name: "Chase, five common types of checks",
    url: CHASE_TYPES,
    description:
      "Cashier's checks: down payments, renovations, international payments, and legal settlements. Certified checks: large purchases, down payments, and government transactions. The bank sets the certified-check money aside.",
  },
  {
    name: "Bank of America financial center FAQ",
    url: BOFA_FAQ,
    description:
      "A checking or savings customer can get a cashier's check for $15, waived for Preferred Rewards. No cashier's check without a checking or savings account. No certified-check fee is stated.",
  },
  {
    name: "Bank of America glossary",
    url: BOFA_GLOSSARY,
    description:
      "Cashier's check: issued by a bank and paid from its funds. Certified check: a check for which the bank guarantees payment.",
  },
  {
    name: "Wells Fargo consumer and business fees",
    url: WELLS,
    description:
      "Cashier's check $10. Online up to $2,000, in person for a larger amount, $6,000 monthly limit. Delivery $8. Lost-check wait of 90 days, 30 days in Wisconsin, 91 days in New York. No certified-check fee is stated.",
  },
];

export const CASHIERS_CHECK_VS_CERTIFIED_CHECK: EditorialComparison = buildEditorialComparison({
  slug: "cashiers-check-vs-certified-check",
  title: "Cashier's Check vs Certified Check",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "finance",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: CASHIER,
      slug: CASHIER,
      name: "Cashier's check",
      shortDesc: "A check drawn on the bank and a direct obligation of the bank.",
      imageUrl: null,
      entityType: "concept",
      position: 0,
      pros: [
        "Regulation CC: drawn on the bank and a direct obligation of the bank",
        "Chase lists $10 at a branch. Some Chase accounts pay no Chase fee",
        "Bank of America says the bank assumes the obligation",
        "Chase names down payments, renovations, international payments, and legal settlements",
      ],
      cons: [
        "Bank of America will not provide one without a checking or savings account",
        "Bank of America lists $15 unless Preferred Rewards waives it",
        "Wells Fargo lists a $6,000 monthly limit per customer",
        "The CFPB says a fraudulent check can be taken back after a withdrawal",
      ],
      bestFor: "A bank's own check for a larger payment",
    },
    {
      id: CERTIFIED,
      slug: CERTIFIED,
      name: "Certified check",
      shortDesc: "The customer's own check, certified by the drawee bank.",
      imageUrl: null,
      entityType: "concept",
      position: 1,
      pros: [
        "Regulation CC: the drawee bank certifies it",
        "Certification can mean funds equal to the check are set aside to pay it",
        "Chase says the bank's certification guarantees payment",
        "The same next-day deposit rule as a cashier's check, when the conditions are met",
      ],
      cons: [
        "Chase, Bank of America, and Wells Fargo fee schedules do not state a certified-check fee",
        "Confirm with the bank whether it will certify a check",
        "Chase says certification may require a visit to the bank",
        "Chase says the amount is usually set aside in the account",
      ],
      bestFor: "The customer's own check, certified by the drawee bank",
    },
  ],
  keyDifferences: [
    {
      label: "Whose funds",
      entityAValue: "The bank's. A direct obligation of the bank",
      entityBValue: "The customer's check. The bank certifies it",
      winner: "tie",
    },
    {
      label: "When the money moves",
      entityAValue: "Chase: withdrawn from your account when you request the check",
      entityBValue: "Regulation CC: funds set aside, or the bank pays on presentment",
      winner: "tie",
    },
    {
      label: "US fee",
      entityAValue: "Chase $10. Bank of America $15. Wells Fargo $10. Confirm with the bank",
      entityBValue: "These three schedules do not state a fee. Confirm with the bank",
      winner: "tie",
    },
    {
      label: "Where to get it (US)",
      entityAValue: "Chase branch. Bank of America financial center. Wells Fargo online or in person",
      entityBValue: "Chase says certification may require a bank visit",
      winner: "tie",
    },
    {
      label: "Deposit availability",
      entityAValue: "Next business day in person, under Regulation CC. Second business day if not in person",
      entityBValue: "The same next-day rule as a cashier's check",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "issuer",
      "Who issues it",
      SPEC,
      CASHIER,
      CERTIFIED,
      "The bank. Regulation CC: signed for the bank as drawer, a direct obligation of the bank",
      "The customer writes it. The drawee bank certifies it by an officer's or employee's signature"
    ),
    textAttr(
      "funds",
      "Whose funds",
      SPEC,
      CASHIER,
      CERTIFIED,
      "The bank's funds. Chase withdraws the amount from your account when you request the check",
      "Your check. Regulation CC: the bank sets aside funds equal to the check, or agrees to pay it on presentment"
    ),
    textAttr(
      "fee",
      "Fee (US)",
      SPEC,
      CASHIER,
      CERTIFIED,
      "Chase $10. Bank of America $15, waived for Preferred Rewards. Wells Fargo $10, plus $8 to deliver an online order. Some accounts waive the fee. Confirm with the bank",
      "Chase, Bank of America, and Wells Fargo state cashier's check fees and do not state a certified-check fee. Confirm with the bank"
    ),
    textAttr(
      "where",
      "Where to get it (US)",
      SPEC,
      CASHIER,
      CERTIFIED,
      "Chase: a branch, and Chase says you may be able to get one online. Wells Fargo: online up to $2,000, or in person for a larger amount. Bank of America: a financial center, for a checking or savings customer",
      "Chase says it is your personal check, so certification may require a visit to the bank"
    ),
    textAttr(
      "uses",
      "Uses Chase names",
      SPEC,
      CASHIER,
      CERTIFIED,
      "Down payments, renovations, international payments, and legal settlements. Chase also says larger transactions",
      "Large purchases, down payments, and government transactions. Chase also says smaller payments may fit"
    ),
    textAttr(
      "availability",
      "When deposited funds must be available",
      SPEC,
      CASHIER,
      CERTIFIED,
      "Next business day in a payee's account, in person to an employee, with the bank's special slip when required. Second business day if not in person. Exceptions can apply over $6,725",
      "The same next-day rule, the same in-person condition, and the same special-slip condition"
    ),
    textAttr(
      "lost",
      "If it is lost",
      SPEC,
      CASHIER,
      CERTIFIED,
      "Wells Fargo: branch-only stop and reissuance, an indemnity agreement, and a wait of 90 days over $1,000 (30 days in Wisconsin, 91 days in New York) unless a surety bond is provided",
      "Confirm with the bank that certified the check. These schedules do not state a separate certified-check replacement fee"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "cashiers-check-vs-money-order",
      title: "Cashier's Check vs Money Order",
      category: "finance",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Neither is named the winner.",
    keyFact:
      "Regulation CC: a cashier's check is a direct obligation of the bank. A certified check is the customer's check, and the drawee bank either sets aside funds equal to the check or agrees to pay it on presentment.",
  },
  citationStats: {
    sourceCount: SOURCES.length,
    dataPointCount: 14,
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
  metaTitle: "Cashier's Check vs Certified Check | A Versus B",
});
