import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Venmo vs Zelle. Fees and limits only as published on Venmo and Zelle pages.
 * Venmo: the published fees, personal payment limits, and bank-transfer limits.
 * Zelle: the fee FAQ, the limits FAQ, and the data center note that Early
 * Warning Services is the company behind Zelle.
 * No winner and no recommendation.
 */

const VENMO = "venmo";
const ZELLE = "zelle";

const VENMO_FEES = "https://venmo.com/legal/fees/";
const VENMO_PAY_LIMITS = "https://help.venmo.com/cs/articles/personal-profile-payment-limits-vhel188";
const VENMO_BANK_LIMITS = "https://help.venmo.com/cs/articles/personal-profile-bank-transfer-limits-vhel314";
const VENMO_CANCEL = "https://help.venmo.com/cs/articles/cancel-payment-vhel148";
const VENMO_PENDING = "https://help.venmo.com/cs/articles/my-personal-venmo-payment-is-pending-vhel276";
const ZELLE_FEES = "https://www.zelle.com/faq/are-there-any-fees-send-money-using-zelle";
const ZELLE_LIMITS = "https://www.zelle.com/faq/there-limit-how-much-money-i-can-send-or-receive";
const ZELLE_DATA = "https://www.zelle.com/data-center";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const SPEC = "Payments";

const ZELLE_FEE_SURVEY =
  "Zelle reports that, based on a Q1 2026 survey of financial institutions offering Zelle, 99.40% of linked consumer checking and savings accounts don't charge a fee to send, receive, or request money.";

const SHORT_ANSWER =
  "PayPal provides Venmo, and Venmo accounts are issued by PayPal, Inc. Sending to a Venmo or U.S. PayPal account is $0 from a balance, debit card, or bank, and 3% from a credit card. An unverified personal profile can send $299.99 in a rolling week. Zelle is from Early Warning Services. Zelle says consumers typically pay no fee to send or receive, and that the bank or credit union sets the limit. There is no winner.";

const FAQS = [
  {
    question: "What does Venmo charge to send or receive money?",
    answer:
      "Account setup is $0, and there is no monthly fee. Sending to a Venmo account or a U.S. PayPal account is $0 from a Venmo balance, debit card, or bank account, and 3.00% from a credit card. Receiving a personal payment from a Venmo user is $0, unless the sender identifies it as goods and services. That goods-and-services payment has a 2.99% seller transaction fee. A standard transfer out is $0 and is typically available in 1-3 business days at a linked bank, or in about 48 hours at an eligible linked debit card. Instant Transfer is 1.75%, with a minimum fee of $0.25 and a maximum fee of $25, and the money is typically available in minutes.",
  },
  {
    question: "What are Venmo's published personal limits?",
    answer:
      "Without identity verification, a personal profile has a weekly spending limit of $299.99. That limit includes person-to-person payments and payments to authorized merchants. With identity verification, it is possible to send up to $60,000 per week. A payment can still be declined for another reason. A transfer to a bank is up to $999.99 per week without verification. With verification, a transfer to a bank is up to $5,000.00 per transfer and up to $19,999.99 per week. Instant transfers have a minimum of $0.26. Venmo will not complete an instant transfer for an amount under $0.25. If Add Money is available, a bank add can be up to $10,000 per week and a debit-card add up to $3,000 per week. These are rolling weekly limits. Venmo says it can change them.",
  },
  {
    question: "What does Zelle charge?",
    answer:
      "Zelle says consumers typically pay no fee to send or receive money, and that a person should confirm with their bank or credit union that it does not charge a fee. " +
      ZELLE_FEE_SURVEY,
  },
  {
    question: "What limit does Zelle publish?",
    answer:
      "Zelle does not publish a dollar sending or receiving limit. It directs people to the bank or credit union for those limits. To use Zelle, the sender and the recipient need U.S. bank accounts, and both need an eligible checking or savings account. Zelle is in over 2,400 bank and credit union apps. Money sent to someone already enrolled is typically available within minutes.",
  },
  {
    question: "Can a payment be canceled?",
    answer:
      "Zelle says a payment to someone who is already enrolled cannot be reversed, and it cannot be canceled. A payment can be canceled only when the recipient has not enrolled. If that recipient does not enroll within 14 days, the payment expires and the funds return. Venmo says a sent payment cannot be canceled. A pending payment to an unregistered recipient can be canceled, and it expires after 30 days if it is not claimed.",
  },
  {
    question: "How do the published fees and limits differ?",
    answer:
      "Venmo publishes a $0 fee to send from a balance, debit card, or bank, a 3.00% fee to send from a credit card, and its own weekly dollar limits. Zelle says a consumer send or receive is typically free, and that the dollar limit comes from the bank or credit union. " +
      ZELLE_FEE_SURVEY +
      " There is no winner.",
  },
];

const VERDICT = `Venmo, provided by PayPal: $0 to send from a balance, debit card, or bank to a Venmo or U.S. PayPal account. 3.00% from a credit card. An unverified personal profile can send $299.99 in a rolling week. With identity verification, Venmo says it is possible to send up to $60,000 per week.

Zelle, from Early Warning Services: consumers typically pay no fee to send or receive. The dollar limit is set by the bank or credit union. Zelle does not publish one.

There is no single winner.`;

const EXPERT_ANALYSIS = `Venmo and Zelle both move money between people. Venmo publishes its own fees and weekly dollar limits. Zelle says a consumer fee is typically none, and that the bank or credit union sets the limit. There is no winner.

Who provides the service

PayPal provides the Venmo service. Venmo accounts are issued by PayPal, Inc. PayPal is not a bank, does not take deposits, and is not FDIC insured. If you have added money to your Venmo personal account using Direct Deposit or the cash a check feature, or have bought or received cryptocurrency with your Venmo account, Venmo says it will place your U.S. dollar Venmo personal account funds in one or more Program Banks, where, subject to certain conditions, they will be eligible for pass-through FDIC insurance, up to applicable limits. That insurance protects against the failure of a Program Bank, not the failure of PayPal. Other Venmo funds and all cryptocurrencies are not held in FDIC-insured deposits. Early Warning Services is the company behind Zelle. Zelle says its stand-alone app is no longer accessible. Zelle is available in over 2,400 bank and credit union apps. The sender and the recipient need U.S. bank accounts and an eligible checking or savings account.

Sending and receiving

Sending from a Venmo balance, debit card, or bank to a Venmo account or a U.S. PayPal account is $0. Sending that way from a credit card is 3.00%. A personal payment received from a Venmo user is $0 unless the sender marks it as goods and services, which carries a 2.99% seller transaction fee. Sending to an eligible non-U.S. PayPal account is 5.00%, with a minimum fee of $0.99 and a maximum fee of $4.99, plus another 3.00% when the funding source is a credit card.

Zelle sends to an email address or a U.S. mobile number through a bank or credit union app or online banking. Money sent to an enrolled person is typically available within minutes. Zelle says consumers typically pay no fee to send or receive, and that the bank or credit union should be asked whether it adds a fee. ${ZELLE_FEE_SURVEY}

Moving money out

A standard Venmo transfer is $0. To a linked bank it is typically available in 1-3 business days. To an eligible linked debit card it is typically available in about 48 hours. Instant Transfer is 1.75%, minimum fee $0.25, maximum fee $25, and is typically available in minutes. Instant transfers have a minimum of $0.26. Venmo will not complete an instant transfer for an amount under $0.25.

Zelle sends into the recipient's bank account. It does not publish a separate withdrawal fee or a dollar cap.

Limits

Without identity verification, Venmo's personal weekly spending limit is $299.99, covering person-to-person payments and payments to authorized merchants. With verification, Venmo says it is possible to send up to $60,000 per week, and a payment can still be declined for another reason. Bank transfers are up to $999.99 per week without verification, and up to $5,000.00 per transfer and $19,999.99 per week with verification. If Add Money is shown, a bank add can be up to $10,000 per week and a debit-card add up to $3,000 per week. The limits are rolling weekly limits. Venmo says it can change them.

Zelle does not publish a dollar sending or receiving limit. It directs people to the bank or credit union.

Canceling

Zelle says a payment cannot be reversed once the recipient is enrolled, and it can be canceled only before enrollment. If the recipient does not enroll within 14 days, the payment expires and the funds return. Venmo says a sent payment cannot be canceled. A pending payment to an unregistered recipient can be canceled, and it expires after 30 days if it is not claimed.

There is no winner. The published difference is who sets the fee and the dollar limit: Venmo publishes both, and Zelle says the bank or credit union does.`;

export const VENMO_VS_ZELLE: EditorialComparison = buildEditorialComparison({
  slug: "venmo-vs-zelle",
  title: "Venmo vs Zelle",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: VENMO,
      slug: VENMO,
      name: "Venmo",
      shortDesc: "A PayPal service. Accounts are issued by PayPal, Inc.",
      imageUrl: null,
      entityType: "software",
      position: 0,
      pros: [
        "Account setup is $0, and there is no monthly fee",
        "$0 to send to a Venmo or U.S. PayPal account from a balance, debit card, or bank",
        "$0 to receive a personal payment, unless it is marked as goods and services",
        "$0 standard transfer to a bank, typically in 1-3 business days",
      ],
      cons: [
        "3.00% to send to a Venmo or U.S. PayPal account from a credit card",
        "Instant Transfer is 1.75%, with a minimum fee of $0.25 and a maximum of $25",
        "Without identity verification, weekly sending is $299.99",
        "A goods-and-services payment has a 2.99% seller transaction fee",
      ],
      bestFor: "Published send fees and weekly dollar limits",
    },
    {
      id: ZELLE,
      slug: ZELLE,
      name: "Zelle",
      shortDesc: "Bank and credit union transfers from Early Warning Services.",
      imageUrl: null,
      entityType: "software",
      position: 1,
      pros: [
        "Zelle says consumers typically pay no fee to send or receive",
        "Money to an enrolled person is typically available within minutes",
        "Available in over 2,400 bank and credit union apps",
      ],
      cons: [
        "Zelle does not publish a dollar sending or receiving limit",
        "A bank or credit union can still charge a fee. Zelle says to confirm that it does not",
        "A payment to an enrolled recipient cannot be reversed or canceled",
        "The sender and the recipient need U.S. bank accounts",
      ],
      bestFor: "A bank or credit union transfer, typically with no consumer fee",
    },
  ],
  keyDifferences: [
    {
      label: "Who provides it",
      entityAValue: "PayPal provides Venmo. Accounts are issued by PayPal, Inc.",
      entityBValue: "Early Warning Services. The bank or credit union app",
      winner: "tie",
    },
    {
      label: "Send fee",
      entityAValue: "$0 from a balance, debit card, or bank. 3.00% from a credit card",
      entityBValue: "Typically none for consumers. Confirm with the bank",
      winner: "tie",
    },
    {
      label: "Published dollar limit",
      entityAValue: "$299.99 a week unverified. Up to $60,000 a week with verification",
      entityBValue: "Set by the bank or credit union. No dollar figure from Zelle",
      winner: "tie",
    },
    {
      label: "Where the money lands",
      entityAValue: "A Venmo balance. A standard bank transfer is $0",
      entityBValue: "The recipient's bank account, typically within minutes if enrolled",
      winner: "tie",
    },
    {
      label: "Cancel an enrolled payment",
      entityAValue: "A sent payment cannot be canceled. A pending payment to an unregistered recipient can be canceled and expires after 30 days",
      entityBValue: "Cannot be reversed or canceled once the recipient is enrolled",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "provider",
      "Provider",
      SPEC,
      VENMO,
      ZELLE,
      "PayPal provides the Venmo service. Venmo accounts are issued by PayPal, Inc.",
      "Early Warning Services. Available in over 2,400 bank and credit union apps. The stand-alone app is no longer accessible",
    ),
    textAttr(
      "send-fee",
      "Send fee",
      SPEC,
      VENMO,
      ZELLE,
      "$0 from a balance, debit card, or bank to a Venmo or U.S. PayPal account. 3.00% from a credit card. Non-U.S. PayPal: 5.00% (minimum $0.99, maximum $4.99), plus 3.00% from a credit card",
      "Typically no consumer fee to send or receive. Confirm with the bank or credit union",
    ),
    textAttr(
      "receive-fee",
      "Receive fee",
      SPEC,
      VENMO,
      ZELLE,
      "$0 for a personal payment. 2.99% seller transaction fee if the sender marks goods and services",
      "Typically no consumer fee to receive. Confirm with the bank or credit union",
    ),
    textAttr(
      "transfer-out",
      "Transfer to a bank",
      SPEC,
      VENMO,
      ZELLE,
      "Standard transfer $0, typically 1-3 business days. Instant Transfer 1.75%, minimum fee $0.25, maximum fee $25, typically within minutes",
      "Money goes into the recipient's bank account. Zelle does not publish a separate withdrawal fee",
    ),
    textAttr(
      "limits",
      "Published limits",
      SPEC,
      VENMO,
      ZELLE,
      "Unverified: $299.99 spending per rolling week, and up to $999.99 to a bank per week. Verified: up to $60,000 sending per week, up to $5,000 per bank transfer, and up to $19,999.99 to a bank per week. Venmo can change these",
      "No dollar limit from Zelle. The bank or credit union sets sending and receiving limits",
    ),
    textAttr(
      "cancel",
      "Cancel",
      SPEC,
      VENMO,
      ZELLE,
      "A sent payment cannot be canceled. A pending payment to an unregistered recipient can be canceled and expires after 30 days",
      "Cannot reverse or cancel a payment to an enrolled recipient. Cancel is available only before enrollment. Unenrolled payments expire after 14 days",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Venmo publishes a $0 send fee from a balance, debit card, or bank, and its own weekly limits. Zelle says a consumer send or receive is typically free, and that the bank or credit union sets the dollar limit.",
    keyFact:
      "Venmo's unverified weekly send limit is $299.99. Zelle says consumers typically pay no fee to send or receive, and the bank or credit union sets the limit.",
  },
  citationStats: {
    sourceCount: 8,
    dataPointCount: 6,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: "Venmo — fees", url: VENMO_FEES },
      { name: "Venmo — personal profile payment limits", url: VENMO_PAY_LIMITS },
      { name: "Venmo — personal profile bank transfer limits", url: VENMO_BANK_LIMITS },
      { name: "Venmo — cancel a sent payment", url: VENMO_CANCEL },
      { name: "Venmo — pending payments", url: VENMO_PENDING },
      { name: "Zelle — consumer fees", url: ZELLE_FEES },
      { name: "Zelle — sending and receiving limits", url: ZELLE_LIMITS },
      { name: "Zelle — Early Warning Services", url: ZELLE_DATA },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Venmo fees",
      url: VENMO_FEES,
      description:
        "Account setup $0 and no monthly fee. $0 to send from a balance, debit card, or bank. 3.00% from a credit card. Instant Transfer 1.75%, minimum $0.25, maximum $25.",
    },
    {
      type: "external",
      label: "Venmo payment limits",
      url: VENMO_PAY_LIMITS,
      description:
        "Unverified personal weekly spending limit of $299.99. With identity verification, up to $60,000 per week. Rolling weekly limits that Venmo can change.",
    },
    {
      type: "external",
      label: "Venmo bank transfer limits",
      url: VENMO_BANK_LIMITS,
      description:
        "Up to $999.99 a week to a bank without verification. With verification, up to $5,000 per transfer and $19,999.99 a week. Instant minimum $0.26.",
    },
    {
      type: "external",
      label: "Venmo cancel payment",
      url: VENMO_CANCEL,
      description: "A sent payment cannot be canceled.",
    },
    {
      type: "external",
      label: "Venmo pending payments",
      url: VENMO_PENDING,
      description:
        "A pending payment to an unregistered recipient can be canceled. It expires after 30 days if it is not claimed.",
    },
    {
      type: "external",
      label: "Zelle consumer fees",
      url: ZELLE_FEES,
      description:
        "Consumers typically pay no fee to send or receive. The bank or credit union can still charge a fee.",
    },
    {
      type: "external",
      label: "Zelle sending and receiving limits",
      url: ZELLE_LIMITS,
      description:
        "The bank or credit union sets the dollar limit. Enrolled payments cannot be reversed. An unenrolled payment expires after 14 days.",
    },
    {
      type: "external",
      label: "Early Warning Services and Zelle",
      url: ZELLE_DATA,
      description:
        "Early Warning Services is the company behind Zelle. The stand-alone app is no longer accessible. U.S. checking or savings accounts.",
    },
  ],
  metaTitle: "Venmo vs Zelle | A Versus B",
});
