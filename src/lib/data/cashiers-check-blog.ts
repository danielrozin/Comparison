/**
 * ROO-406: repo override for /blog/how-to-get-a-cashiers-check.
 * Facts opened 2026-11-10 from 12 CFR 229.10 and 229.13, the Federal Reserve
 * Regulation CC compliance guide, the OCC's HelpWithMyBank.gov, FinCEN, the
 * USPS, and the Chase and Wells Fargo fee schedules.
 * The 2018 FTC fake-check alert URL returned 404 on 2026-11-10, so the
 * sentences that depended on it are not in the body.
 * Removed because the sources disagreed or never stated them: next-day
 * availability at an ATM; the CFPB summary figures of $225 and $5,525 (eCFR
 * shows $275 for other checks and $6,725 for the large-deposit exception);
 * a universal cash-purchase and photo-ID rule; fees for banks other than
 * Chase and Wells Fargo Clear Access Banking.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const CASHIERS_CHECK_BLOG_SLUG = "how-to-get-a-cashiers-check";

const PUBLISHED_AT = "2026-07-10T08:48:57.020Z";
const UPDATED_AT = "2026-11-10T00:00:00Z";

const CHASE_FEES_URL = "https://www.chase.com/content/dam/chase-ux/documents/personal/checking/ABSF-en.pdf";
const CHASE_EDU_URL = "https://www.chase.com/personal/banking/education/basics/cashiers-check-vs-certified-check";
const WELLS_FEES_URL = "https://www.wellsfargo.com/checking/clear-access-banking/account-fees-summary/";
const USPS_URL = "https://www.usps.com/shop/money-orders.htm";
const ECFR_229_10 = "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-229/subpart-B/section-229.10";
const ECFR_229_13 = "https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-229/subpart-B/section-229.13";

export const CASHIERS_CHECK_FAQS = [
  {
    question: "How do I get a cashier's check?",
    answer:
      "Go to your bank with the payee's exact name and the exact amount. Chase's fee schedule, effective June 14, 2026, describes a cashier's check as a branch purchase for any amount, made out to a payee you designate. Chase's education page says the bank withdraws that amount from your account when you request the check. For a cash transaction over $10,000, FinCEN says the institution must collect a Social Security number and a government-issued document such as a driver's license.",
  },
  {
    question: "How much does a cashier's check cost?",
    answer:
      "Chase lists $10 per check, per Chase Additional Banking Services and Fees, effective June 14, 2026, and says some personal checking and savings accounts waive that fee. Wells Fargo's Clear Access Banking quick view, effective July 28, 2026, lists $10 each. Other Wells Fargo accounts can differ, so read your own fee schedule for the current price.",
  },
  {
    question: "Can I stop payment on a cashier's check?",
    answer:
      "Generally no. The OCC says a customer cannot order a stop payment on a cashier's check, and the bank must honor the check when it is presented, because the check is drawn on the bank. Contact the issuing bank if the check is lost, stolen, destroyed, or you believe it is fraudulent.",
  },
  {
    question: "How soon is a deposited cashier's check available?",
    answer:
      "12 CFR 229.10 requires the next business day when a cashier's check is deposited in person to an employee of the bank, into an account held by a payee of the check, and with a special deposit slip if the bank requires one. If it is not deposited in person to an employee, the same section requires the second business day. 12 CFR 229.13 allows a longer hold for a new account, check deposits over $6,725 on one banking day, a redeposited check, repeated overdrafts, reasonable cause to doubt collection, or an emergency.",
  },
  {
    question: "What is the difference between a cashier's check and a certified check?",
    answer:
      "Chase says a cashier's check is issued by the bank on the bank's own account after the bank withdraws the amount. A certified check is your personal check, which the bank verifies has enough funds, and Chase says those funds stay in your account until the recipient cashes the check.",
  },
  {
    question: "What is the difference between a cashier's check and a money order?",
    answer:
      "A cashier's check comes from a bank. Chase's schedule says one can be for any amount. A domestic USPS money order is limited to $1,000, costs $2.65 from $0.01 to $500 or $3.75 from $500.01 to $1,000, never expires, and cannot be stopped. Replacing a lost or stolen USPS money order costs $23.",
  },
];

const FAQ_MD = CASHIERS_CHECK_FAQS.map(
  (faq) => `### ${faq.question}\n\n${faq.answer}`,
).join("\n\n");

const CONTENT = `**Updated November 10, 2026.** To get a cashier's check, take the payee's exact name and the exact amount to your bank. Chase's fee schedule, effective June 14, 2026, calls it a branch purchase for any amount, and Chase's education page says the bank withdraws that amount from your account when you ask for the check. Chase lists $10 per check, per Chase Additional Banking Services and Fees, and Wells Fargo's Clear Access Banking quick view, effective July 28, 2026, lists $10 each. The OCC says a customer generally cannot stop payment, because the check is drawn on the bank. Under 12 CFR 229.10, an in-person deposit to a bank employee is due the next business day and a deposit that is not made in person to an employee is due the second business day, unless an exception in 12 CFR 229.13 applies. A domestic USPS money order stops at $1,000. This is general information from the cited sources, not financial, legal, or tax advice.

| | Cashier's check | Personal check | USPS money order |
| --- | --- | --- | --- |
| Who stands behind it | The issuing bank | Your account | USPS |
| Amount | Chase: any amount | Whatever is in the account | $1,000 per domestic money order |
| Where to get it | Chase: purchased at a branch | Your checkbook | A Post Office |
| Stop payment | OCC: generally not available | Chase: $30 per banker request on a check or ACH; $25 online or by automated phone covers a check | USPS: cannot be stopped; replacement fee $23 |

*Table: cashier's check, personal check, and USPS money order by who pays, amount, where to get one, and stop payment. Chase figures are from the fee schedule effective June 14, 2026. USPS figures are from the USPS money orders page, opened November 10, 2026.*

## What is a cashier's check?

A cashier's check is a check the bank issues on its own account after it takes the money from yours. Chase's education page says the bank withdraws the amount when you request the check, and the OCC says the bank must honor the check when it is presented. Sellers ask for one on large purchases because the promise comes from the bank.

## How do I get a cashier's check?

Bring the payee's full name, exactly as it should be printed, and the exact amount. Chase's fee schedule describes the purchase as a branch purchase "for any amount and to a payee you designate." Chase's education page says the bank withdraws the specified amount from your account at the time of the request. Ask the bank which identification it wants for a smaller purchase. If you pay more than $10,000 in cash, or if cash transactions by or for one person add up to over $10,000 in one day, FinCEN says the institution must file a Currency Transaction Report and must collect a Social Security number and a government-issued document such as a driver's license. FinCEN also says that breaking the cash into smaller amounts to avoid that report, called structuring, is a federal crime.

1. Write down the payee's exact name and the exact amount before you go.
2. Buy it at a branch if you use Chase. The fee schedule describes a cashier's check as a branch purchase.
3. Keep the receipt. The OCC says you will need the issuing bank, and often an indemnity bond, if the check is lost.

## What does a cashier's check cost?

Chase charges $10 per check, per Chase Additional Banking Services and Fees, effective June 14, 2026 ([See vendor page for current price](${CHASE_FEES_URL})). The same schedule lists a money order, which it describes as a check issued by you, at $5 per check for an amount up to $1,000, and it says these fees may be waived with certain personal checking and savings accounts. Wells Fargo's Clear Access Banking quick view lists a cashier's check at $10 each and a money order, up to $1,000, at $5 each ([See vendor page for current price](${WELLS_FEES_URL})). The Clear Access summary is marked effective July 28, 2026. Wells Fargo says fees can differ by account, so a different Wells Fargo account may not match this quick view.

| Bank product | Cashier's check | Money order |
| --- | --- | --- |
| Chase, schedule effective June 14, 2026 | $10 per check, per Chase Additional Banking Services and Fees ([See vendor page for current price](${CHASE_FEES_URL})) | $5 per check, up to $1,000, purchased at a branch |
| Wells Fargo Clear Access Banking, effective July 28, 2026 | $10 each ([See vendor page for current price](${WELLS_FEES_URL})) | $5 each, up to $1,000 |

*Table: cashier's check and money order fees named on the Chase fee schedule and the Wells Fargo Clear Access Banking quick view, opened November 10, 2026. These are not a national fee.*

## When is the money from a deposited cashier's check available?

12 CFR 229.10 says the bank must make a cashier's, certified, or teller's check available on the next business day when three things are true: the account is held by a payee of the check, you deposit it in person to an employee of that bank, and you use a special deposit slip or envelope if the bank requires one to identify the type of check. If the same check is not deposited in person to an employee, 12 CFR 229.10(c)(2) says the funds must be available by the second business day. The Federal Reserve's Regulation CC guide describes cashier's checks as a next-day item in general, and it says the guide is an overview rather than the full rule.

12 CFR 229.13 lists exceptions that can extend the hold. A new account, the first 30 calendar days, gets the next-day rule only for the first $6,725 of these deposits on one banking day, and the amount over $6,725 must be available by the ninth business day. The next-day and second-day schedules also do not apply to the part of a day's check deposits over $6,725, to a check that was returned and redeposited, to repeated overdrafts, to a check the bank has reasonable cause to believe it cannot collect, or during listed emergency conditions. When the bank uses an exception in 12 CFR 229.13(b) through (e), covering large deposits, a redeposited check, repeated overdrafts, or reasonable cause to doubt collection, 12 CFR 229.13(g) requires a written notice to the depositor.

## What if a cashier's check is lost or stolen?

Call the issuing bank. The OCC says the bank will require an indemnity bond for the amount of the lost check before it issues a replacement. That bond is an insurance policy that makes you, not the bank, liable if the lost check is later presented. The OCC says banks may still require a wait of 30 to 90 days after you present the bond, and that the bonds are often difficult to obtain.

Wells Fargo's Clear Access Banking footnote is narrower. A stop payment and reissuance of a lost, stolen, or destroyed cashier's check is $0, can be done only in a branch, and requires an indemnity agreement. For a cashier's check over $1,000, Wells Fargo's waiting period is 90 days, 30 days in Wisconsin, and 91 days in New York, and that wait can be avoided with an acceptable surety bond.

## How does a cashier's check differ from a certified check or a money order?

Chase says a certified check is your personal check, verified by the bank as having enough funds, and that the money stays in your account until the recipient cashes it. The cashier's check is different because the bank has already withdrawn the money and issued the check on the bank's account. Chase also says a cashier's check cannot be canceled the way a personal check can. Chase lists $30 when a banker places a stop payment on a check or ACH, and $25 when the stop payment is placed online or by automated phone on a check. Those fees are not a way to stop a cashier's check. The OCC rule above still governs the cashier's check.

A USPS money order is the product to read about if you do not have a bank account. USPS limits a domestic money order to $1,000, charges $2.65 for $0.01 to $500 and $3.75 for $500.01 to $1,000 ([See vendor page for current price](${USPS_URL})), says money orders never expire, and says you cannot stop payment. A lost or stolen money order can be replaced. USPS lists a $23 processing fee for that replacement. For a side-by-side of the two products, see [cashier's check vs money order](/compare/cashiers-check-vs-money-order).

## How do fake cashier's checks show up?

The OCC says to contact the issuing bank if you believe a check is fraudulent. Use a phone number you look up yourself.

## FAQ

The short answers below match the sections above: how to get one, what Chase and Wells Fargo list, whether you can stop payment, when a deposit is available, and how a certified check and a USPS money order differ.

${FAQ_MD}

## Compare further

Three live comparisons cover the money-order choice, the certified-check choice, and Chase next to Bank of America.

- [Cashier's check vs money order](/compare/cashiers-check-vs-money-order)
- [Cashier's check vs certified check](/compare/cashiers-check-vs-certified-check)
- [Bank of America vs Chase](/compare/bank-of-america-vs-chase)

## Sources

Each fee, limit, wait, and availability rule above is taken from one of these official pages, opened November 10, 2026.

- [12 CFR 229.10, next-day availability](${ECFR_229_10})
- [12 CFR 229.13, availability exceptions](${ECFR_229_13})
- [Federal Reserve: Regulation CC compliance guide](https://www.federalreserve.gov/supervisionreg/regcccg.htm)
- [OCC HelpWithMyBank.gov: stop payment on a cashier's check](https://www.helpwithmybank.gov/help-topics/bank-accounts/cashiers-checks/cashiers-check-stop.html)
- [OCC HelpWithMyBank.gov: indemnity bond for a lost cashier's check](https://www.helpwithmybank.gov/help-topics/bank-accounts/cashiers-checks/cashiers-check-indemnity.html)
- [Chase: Additional Banking Services and Fees (effective 6/14/2026)](${CHASE_FEES_URL})
- [Chase: cashier's check vs certified check](${CHASE_EDU_URL})
- [Wells Fargo: Clear Access Banking fee summary](${WELLS_FEES_URL})
- [USPS: money orders](${USPS_URL})
- [FinCEN: Currency Transaction Report notice](https://www.fincen.gov/sites/default/files/shared/CTRPamphletBW.pdf)
`;

export const CASHIERS_CHECK_ARTICLE: BlogArticle = {
  id: "blog-how-to-get-a-cashiers-check",
  slug: CASHIERS_CHECK_BLOG_SLUG,
  title: "How Do I Get a Cashier's Check?",
  excerpt:
    "A cashier's check is the bank's check. Chase lists $10 at a branch. Availability is the next or second business day, and hold exceptions can apply.",
  content: CONTENT,
  category: "finance",
  tags: ["cashier's check", "bank check", "certified check", "money order", "banking", "personal finance"],
  metaTitle: "How Do I Get a Cashier's Check?",
  metaDescription:
    "How to get a cashier's check: Chase and Wells Fargo fees, next-day or second-day availability, and the hold exceptions that can apply.",
  relatedComparisonSlugs: [
    "cashiers-check-vs-money-order",
    "cashiers-check-vs-certified-check",
    "bank-of-america-vs-chase",
  ],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: UPDATED_AT,
  viewCount: 0,
};
