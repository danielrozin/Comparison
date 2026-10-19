/**
 * ROO-269: repo override for /blog/how-to-get-a-cashiers-check.
 * Facts read in October 2026 from the CFPB, the OCC's HelpWithMyBank.gov,
 * FinCEN, the FTC, USPS, and the Chase and Wells Fargo fee schedules.
 * Removed because no official page confirmed them: fees for Bank of America,
 * Citi, U.S. Bank, TD Bank, PNC and credit unions; the Walmart money order
 * fee; non-customer fees; mail-delivery times; expiry and "stale check" rules.
 * Chase's cashier's check fee is now $10 (its fee schedule effective
 * 6/14/2026); the older article said $8.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const CASHIERS_CHECK_BLOG_SLUG = "how-to-get-a-cashiers-check";

const PUBLISHED_AT = "2026-07-10T08:48:57.020Z";
const UPDATED_AT = "2026-10-19T00:00:00Z";

const CHASE_FEES_URL = "https://www.chase.com/content/dam/chase-ux/documents/personal/checking/ABSF-en.pdf";
const WELLS_FEES_URL = "https://www.wellsfargo.com/checking/clear-access-banking/account-fees-summary/";
const USPS_URL = "https://www.usps.com/shop/money-orders.htm";

const CONTENT = `**Updated Oct 2026.** To get a cashier's check, go to your bank or credit union with photo ID, the payee's exact name, and the exact amount. The bank takes the money from your account (or your cash) right away and issues a check drawn on its own funds. Fees vary by bank: Chase charges $10 per check, per Chase Additional Banking Services and Fees, effective June 2026 ([See vendor page for current price](${CHASE_FEES_URL})).

| | Cashier's check | Personal check | USPS money order |
| --- | --- | --- | --- |
| Drawn on | The bank's own funds | Your account | USPS |
| Maximum amount | No fixed limit (Chase: "any amount") | Your balance | $1,000 per domestic money order |
| Where to get it | Bank or credit union | Your checkbook | Post office |
| Stop payment | Generally not possible | Yes (Chase: $30 per request at a banker) | Ask the issuer |

*Table: cashier's check, personal check and USPS money order by source of funds, limit, where to get one, and stop payment, October 2026.*

Weighing your options? [Compare a cashier's check vs a money order](/compare/cashiers-check-vs-money-order) side by side.

## What is a cashier's check?

A cashier's check is a check the bank writes on its own account, not yours. You pay the bank first, and the bank promises the payment. That is why sellers ask for one on large purchases such as a car or a home down payment. Because the check is drawn on the bank, a customer generally cannot stop payment on it, and the bank must honor it when it is presented.

## How to get a cashier's check, step by step

1. **Have the details ready.** Bring the payee's full name exactly as it should be printed, the exact amount, and a government-issued photo ID.
2. **Go to your bank or credit union.** At Chase, a cashier's check is a branch purchase "for any amount and to a payee you designate." Some banks also let you get a cashier's check through online banking or the mobile app.
3. **Pay for it.** The bank withdraws the money from your account at the time of the request, or takes cash.
4. **Pay the fee and keep the receipt.** You will need the receipt if the check is lost.

If you pay more than $10,000 in cash, the bank must file a Currency Transaction Report with the federal government and verify your identity.

## What does a cashier's check cost?

| Bank | Cashier's check fee | Money order fee |
| --- | --- | --- |
| Chase | $10 per check, per Chase Additional Banking Services and Fees, June 2026 ([See vendor page for current price](${CHASE_FEES_URL})) | $5 per check, up to $1,000 |
| Wells Fargo | $10, per Wells Fargo Clear Access Banking fee summary, October 2026 ([See vendor page for current price](${WELLS_FEES_URL})) | $5, up to $1,000 |

Chase notes that its fees may be waived with certain checking and savings accounts. Ask your own bank for its fee and any waivers.

## When will the money be available?

When you deposit a cashier's check in person with a teller, or at your bank's own ATM, federal rules generally make the funds available the next business day. The same applies to certified checks and government checks.

## What if a cashier's check is lost or stolen?

1. **Call the issuing bank right away.**
2. **Expect to need an indemnity bond.** This insurance policy makes you, not the bank, liable if the lost check is later cashed. Banks may still make you wait 30 to 90 days after you present the bond before they issue a replacement.
3. **Know your bank's rule.** Wells Fargo, for example, makes customers wait 90 days to replace a lost cashier's check over $1,000 (30 days in Wisconsin, 91 days in New York) unless they buy a surety bond.

## Cashier's check vs money order

A USPS money order is the closest alternative if you don't have a bank account. It is limited to $1,000 per domestic money order, and the fee is $2.65 for $0.01 to $500 and $3.75 for $500.01 to $1,000, per USPS money orders page, October 2026 ([See vendor page for current price](${USPS_URL})). USPS money orders never expire, and replacing a lost one costs $23.

## How to avoid cashier's check scams

Fake cashier's checks look real, even to bank staff. Seeing the money in your account doesn't mean the check is good, because it can take weeks for a bank to find out a check is fake. If you then have to repay the bank, the money you sent is gone. Never accept a check for more than the selling price, and never send money back from a check to someone you don't know and trust. To confirm a cashier's check, call the issuing bank at a number you look up yourself.

## FAQ

### How do I get a cashier's check?

Go to your bank or credit union with photo ID, the payee's exact name, and the exact amount. The bank takes the money from your account or your cash and prints a check drawn on its own funds.

### How much does a cashier's check cost?

It depends on the bank. Chase charges $10 per check and Wells Fargo lists $10 on its Clear Access Banking fee summary. Some account types waive the fee.

### Can I stop payment on a cashier's check?

Generally no. A cashier's check is drawn on the bank, not on your account, so the bank must honor it when it is presented. Contact the bank right away if the check is lost, stolen, or fraudulent.

### How long does a bank hold a cashier's check?

When you deposit a cashier's check in person with a teller, or at your bank's own ATM, the funds are generally available the next business day.

### What is the difference between a cashier's check and a money order?

A cashier's check comes from a bank, is drawn on the bank's funds, and has no fixed limit. A USPS money order is limited to $1,000 per domestic order and costs $2.65 to $3.75.

## Compare further

- [Cashier's check vs money order](/compare/cashiers-check-vs-money-order)
- [Cashier's check vs certified check](/compare/cashiers-check-vs-certified-check)
- [Bank of America vs Chase](/compare/bank-of-america-vs-chase)

## Sources

- [CFPB: How long can a bank or credit union hold funds I deposited?](https://www.consumerfinance.gov/ask-cfpb/how-long-can-a-bank-or-credit-union-hold-funds-i-deposited-en-1023/)
- [HelpWithMyBank.gov (OCC): Can I put a stop payment order on a cashier's check?](https://www.helpwithmybank.gov/help-topics/bank-accounts/cashiers-checks/cashiers-check-stop.html)
- [HelpWithMyBank.gov (OCC): Indemnity bonds for lost cashier's checks](https://www.helpwithmybank.gov/help-topics/bank-accounts/cashiers-checks/cashiers-check-indemnity.html)
- [Chase: Additional Banking Services and Fees (effective 6/14/2026)](${CHASE_FEES_URL})
- [Chase: Cashier's check vs certified check](https://www.chase.com/personal/banking/education/basics/cashiers-check-vs-certified-check)
- [Wells Fargo: Clear Access Banking fee summary](${WELLS_FEES_URL})
- [USPS: Money orders](${USPS_URL})
- [FinCEN: Notice to customers, Currency Transaction Reports](https://www.fincen.gov/sites/default/files/shared/CTRPamphletBW.pdf)
- [FTC: How to spot, avoid, and report fake check scams](https://consumer.ftc.gov/articles/how-spot-avoid-and-report-fake-check-scams)
`;

export const CASHIERS_CHECK_FAQS = [
  {
    question: "How do I get a cashier's check?",
    answer:
      "Go to your bank or credit union with photo ID, the payee's exact name, and the exact amount. The bank takes the money from your account or your cash and prints a check drawn on its own funds.",
  },
  {
    question: "How much does a cashier's check cost?",
    answer:
      "It depends on the bank. Chase charges $10 per check and Wells Fargo lists $10 on its Clear Access Banking fee summary. Some account types waive the fee.",
  },
  {
    question: "Can I stop payment on a cashier's check?",
    answer:
      "Generally no. A cashier's check is drawn on the bank, not on your account, so the bank must honor it when it is presented. Contact the bank right away if the check is lost, stolen, or fraudulent.",
  },
  {
    question: "How long does a bank hold a cashier's check?",
    answer:
      "When you deposit a cashier's check in person with a teller, or at your bank's own ATM, the funds are generally available the next business day.",
  },
  {
    question: "What is the difference between a cashier's check and a money order?",
    answer:
      "A cashier's check comes from a bank, is drawn on the bank's funds, and has no fixed limit. A USPS money order is limited to $1,000 per domestic order and costs $2.65 to $3.75.",
  },
];

export const CASHIERS_CHECK_ARTICLE: BlogArticle = {
  id: "blog-how-to-get-a-cashiers-check",
  slug: CASHIERS_CHECK_BLOG_SLUG,
  title: "How to Get a Cashier's Check",
  excerpt:
    "Bring photo ID, the payee's exact name and the amount to your bank. The bank takes the funds up front and issues a check drawn on its own money.",
  content: CONTENT,
  category: "finance",
  tags: ["cashier's check", "bank check", "certified check", "money order", "banking", "personal finance"],
  metaTitle: "How to Get a Cashier's Check: Steps, Fees and Holds (2026)",
  metaDescription:
    "How to get a cashier's check: what to bring, what Chase and Wells Fargo charge, when deposited funds are available, and what to do if one is lost.",
  relatedComparisonSlugs: ["cashiers-check-vs-money-order", "cashiers-check-vs-certified-check"],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: UPDATED_AT,
  viewCount: 0,
};
