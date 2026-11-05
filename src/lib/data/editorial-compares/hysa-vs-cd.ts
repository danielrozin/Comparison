import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-381 — High-yield savings account (HYSA) vs certificate of deposit (CD).
 * Opened 5 November 2026.
 * FDIC: deposit insurance, understanding deposit insurance, deposit accounts,
 * the November 2023 CD shopping guide, and the Truth in Savings exam manual.
 * CFPB: what a CD is (ask-cfpb 917), CD rollover (923), and savings withdrawal
 * fees (2150). The brief's ask-cfpb 913 and 991 IDs now resolve to other answers.
 * NCUA: share insurance coverage. The old protect-your-savings path is gone.
 * No winner. No APY, no dollar return, and no bank ranking.
 */

const HYSA = "hysa";
const CD = "cd";

const FDIC_INSURANCE = "https://www.fdic.gov/resources/deposit-insurance/";
const FDIC_UNDERSTANDING =
  "https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance";
const FDIC_ACCOUNTS = "https://www.fdic.gov/consumer-resource-center/deposit-accounts";
const FDIC_CD_SHOPPING =
  "https://www.fdic.gov/consumer-resource-center/2023-11/shopping-certificate-deposit";
const FDIC_TISA = "https://www.fdic.gov/consumer-compliance-examination-manual/vi-3-truth-savings";
const CFPB_CD = "https://www.consumerfinance.gov/ask-cfpb/what-is-a-certificate-of-deposit-cd-en-917/";
const CFPB_ROLLOVER =
  "https://www.consumerfinance.gov/ask-cfpb/what-is-a-certificate-of-deposit-cd-rollover-or-renewal-en-923/";
const CFPB_SAVINGS_FEES =
  "https://www.consumerfinance.gov/ask-cfpb/why-am-i-being-charged-for-transactions-in-my-savings-account-en-2150/";
const NCUA_SHARE = "https://ncua.gov/consumers/share-insurance-coverage";

const SOURCE_DATE = "2026-11-05";
const PUBLISHED = "2026-11-05T00:00:00Z";
const SPEC = "Savings";

const SHORT_ANSWER =
  "A high-yield savings account (HYSA) and a certificate of deposit (CD) are both deposit accounts that can be FDIC-insured at banks (or NCUA-insured at a federally insured credit union), but they trade liquidity for rate certainty differently: a HYSA usually lets you withdraw when you need the money, while a CD holds funds for a set term and often charges an early-withdrawal penalty if you cash out early. Use a HYSA for an emergency fund or money you may need soon; use a CD when you have a known horizon and can leave the money until maturity, and always check the bank's current APY rather than treating a rate you saw elsewhere as a quote.";

const FAQS = [
  {
    question: "What is the difference between a HYSA and a CD?",
    answer:
      "A high-yield savings account is a savings deposit that typically stays accessible, while a certificate of deposit holds funds for a fixed term. Both can be insured deposits at banks or credit unions; the tradeoff is liquidity versus a rate locked for the CD\u2019s term.",
  },
  {
    question: "Should my emergency fund be in a HYSA or a CD?",
    answer:
      "An emergency fund usually belongs in a HYSA (or similarly liquid insured deposit) so you can withdraw without waiting for a maturity date or paying an early-withdrawal penalty.",
  },
  {
    question: "Are HYSA and CD deposits FDIC insured?",
    answer:
      "Deposit accounts at FDIC-insured banks can be covered up to the FDIC\u2019s standard insurance amount per depositor, per insured bank, for each account ownership category. Credit union deposits can be NCUA-insured instead. Confirm the institution\u2019s insurance status on the official FDIC or NCUA tools.",
  },
  {
    question: "What happens if I withdraw from a CD early?",
    answer:
      "Many CDs charge an early-withdrawal penalty if you take funds before maturity. The penalty and any exceptions are set by the bank\u2019s account agreement \u2014 read that disclosure before you open the CD.",
  },
  {
    question: "Do HYSA and CD rates stay the same?",
    answer:
      "A HYSA APY can change when the bank updates its rate. A CD typically locks the rate for the stated term if you keep the money until maturity; after maturity, renewal terms and rates can differ.",
  },
  {
    question: "Can I use both a HYSA and a CD?",
    answer:
      "Yes. Some savers keep liquid cash in a HYSA and put money they will not need until a known date into one or more CDs (including a simple ladder of staggered maturities).",
  },
];

const VERDICT = `Emergency fund, or cash you may need soon: a HYSA, or another insured savings deposit you can withdraw. CFPB says to use a savings account for emergencies and infrequent purchases. A CD makes you wait for maturity or pay to get out early.

Known date: a CD whose term matches that date. CFPB says to pick the maturity from when you expect to spend the money. FDIC says the term is often three months to five years or more.

Both: keep spending-soon cash in the HYSA and money with a known date in one or more CDs. A simple ladder staggers those maturity dates. Read each account agreement, and check the bank's current APY. Neither choice fits every goal.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- FDIC describes a savings account as money set aside for the future, for deposits you do not expect to use on a regular basis. A high-yield savings account is that kind of savings deposit. The APY is whatever the bank discloses now.
- FDIC says a CD is also a deposit for future money, but you cannot withdraw whenever you like. You typically keep the money for a set term or you will likely pay a penalty or lose some or all of the interest you earned.
- CFPB defines a CD as a type of savings account where you generally agree not to take a withdrawal for a specified length of time. Withdrawing early means paying a penalty fee to the bank.
- CFPB says a savings account can hold money for emergencies and infrequent purchases. The same answer says a bank or credit union may limit how many withdrawals or transfers you make in a month and may charge a fee.
- FDIC's standard insurance amount is $250,000 per depositor, per insured bank, for each account ownership category. Deposits in the same category at the same bank, including a HYSA and a CD, are added together. The limit includes principal and accrued interest.
- NCUA share insurance can cover share savings and share certificates at a federally insured credit union. Some state-chartered credit unions use private insurance instead. That private coverage is not backed by the full faith and credit of the United States.

Quick verdict by goal

Emergency fund: use a HYSA or a similarly liquid insured savings deposit. You can usually take money out without waiting for a maturity date. CFPB's savings-fee answer tells people to hold emergency money in a savings account and to use a checking account for day-to-day cash. Read the withdrawal rules. A limit or a fee is still possible.

Known horizon: use a CD when you can leave the money until that date. CFPB's tip is to match the maturity to the expense. If you expect to spend the money in five years, CFPB says to look at a five-year CD, meaning a term that ends five years out. FDIC says terms are usually three months to five years or more, and there may be a minimum deposit.

Optional ladder: some savers split the CD portion across more than one term so the maturity dates are staggered. When one CD matures, that portion is available. The rest stays in its own term. CFPB says each renewal rate is not guaranteed to match the rate on the CD you have now. This is a scheduling idea, not a product to buy from a particular bank.

Liquidity and access

FDIC contrasts the two accounts directly. A savings account is for money you set aside. A CD does not let you withdraw whenever you like. CFPB uses the same split: a CD is still a savings account, and the bargain is that you generally leave the money in place for the term.

A HYSA is not a separate insurance category and it is not a separate kind of charter. It is a savings deposit that a bank markets with a yield. Compare the APY on that bank's current disclosure with the APY on the CD disclosure. FDIC says CDs typically offer a higher rate of interest than regular savings accounts, in exchange for the term. That sentence is about regular savings accounts. It is not a ranking of named banks, and it is not a promise that every CD beats every HYSA. Check the current APY.

Access is not the same thing as "free and unlimited." CFPB explains that a bank or credit union can set a monthly limit on savings withdrawals or transfers. After the maximum number, or after a maximum dollar amount, the institution can charge an excessive-use fee or a withdrawal-limit fee. Going below a minimum balance can also trigger a fee. Those rules are in the account disclosure.

Rate certainty and early-withdrawal penalties

FDIC's Truth in Savings manual defines a variable-rate account as one where the interest rate may change after the account is opened, unless the institution contracts to give at least 30 calendar days' advance written notice of rate decreases. For a variable-rate account, the bank must disclose that the interest rate and annual percentage yield may change, how the rate is determined, how often it may change, and any limit on the size of the change. If the savings account is variable-rate, those are the terms that apply. The account disclosure tells you whether the APY can change.

The same manual defines a fixed-rate account as one where the institution contracts to give at least 30 calendar days' advance written notice of decreases in the interest rate. For a fixed-rate account, the bank must disclose the period of time the interest rate will be in effect. That is the usual way a CD states a rate for its term. It is not true of every CD. FDIC's November 2023 shopping guide says some banks offer CDs with variable interest rates, on a preset schedule or tied to a basket of market indexes. Many market-linked CDs accrue interest only when the CD matures.

Early exit is a contract term. CFPB says withdrawing before the end of the term means paying a penalty fee, and it tells shoppers to compare the term, the interest rate, and the penalty amount. FDIC says you will likely pay a penalty or lose some or all of the interest you earned. The November 2023 guide adds a split: the terms of most fixed-rate CDs let the depositor pay a fee to redeem before maturity, while most market-linked CDs do not allow an early redemption. Read the account agreement for the penalty and for any exception.

After maturity, the rate can change even if it was fixed during the term. CFPB says a rollover or renewal can put the original deposit, and sometimes the interest already earned, into a new CD. Some CDs do not roll over, and then they stop earning interest at maturity. A bank or credit union may renew automatically unless you say not to, and it must send a written notice before maturity that tells you when the CD ends and whether it will renew. CFPB says the new CD's interest rate is not guaranteed to match the current CD. It may be higher or lower. FDIC says to see whether an automatic renewal uses the old rate or the rate in effect at renewal.

FDIC also says some market-linked and other long-term CDs have a call feature that lets the bank close the account early. If rates fall, the bank may return your money plus accrued interest and issue new CDs at the lower rates. A call feature is a limit on how long a rate stays in place. It belongs in the deposit agreement.

FDIC's Truth in Savings manual defines a grace period as the time after maturity of an automatically renewing time account when the consumer may withdraw funds without a penalty. Whether you have one, and how long it lasts, is in that agreement.

Deposit insurance

FDIC explains that deposit insurance protects money in deposit accounts if an FDIC-insured bank fails. Coverage includes savings accounts and certificates of deposit, and it is automatic when you open one of those accounts at an FDIC-insured bank. The standard amount is $250,000 per depositor, per FDIC-insured bank, for each account ownership category. FDIC's deposit insurance overview also summarizes this as deposits insured to at least $250,000 at each FDIC-insured bank.

FDIC explains that all deposits in the same ownership category at the same bank are added together. A checking account and a savings account in the same single-ownership category share one limit. A HYSA and a CD you own the same way at the same bank work the same way: they are not two separate $250,000 limits. FDIC's November 2023 guide says the $250,000 standard maximum includes principal and accrued interest. A different ownership category at the same bank, or the same category at a different FDIC-insured bank, is calculated separately. FDIC lists examples that include single accounts, joint accounts, and certain retirement accounts such as IRAs. Use FDIC's Electronic Deposit Insurance Estimator, which FDIC links from its deposit insurance pages, or call 1-877-ASK-FDIC, for a balance that is not a simple single account.

FDIC insurance does not cover mutual funds, annuities, stocks, bonds, crypto assets, or the contents of a safe deposit box, even when a bank sells them. Confirm the bank with FDIC BankFind before you send money. FDIC says a CD bought through a deposit broker is insured only if the broker actually places the funds in a CD at an FDIC-insured bank.

NCUA explains that the Share Insurance Fund is similar to FDIC insurance and is backed by the full faith and credit of the United States. Members do not apply for it. It is provided when they join a federally insured credit union. Share insurance covers share draft accounts, share savings accounts, and time deposits such as share certificates, including principal and posted dividends through the date the credit union closes, up to the limit. NCUA states that individual accounts are insured up to $250,000, that a member's interest in all joint accounts combined is insured up to $250,000, and that IRA and KEOGH retirement accounts have separate protection up to $250,000. Those figures are the total of that ownership type at each federally insured credit union, and NCUA says the common examples assume the coverage requirements are met. Revocable and irrevocable trusts have their own rules and limits.

NCUA also explains that some state-chartered credit unions are insured by private insurers. That coverage is not federal and is not backed by the full faith and credit of the United States. Confirm a credit union with the NCUA Credit Union Locator. NCUA's Share Insurance Estimator is on MyCreditUnion.gov.

CFPB's CD answer says bank CDs are insured up to $250,000 by the FDIC and credit union CDs are insured up to $250,000 by the NCUA. Use that as the short statement, then use the FDIC and NCUA rules above for whose accounts count together and for credit unions that are not federally insured. Insurance is not a rate, and it does not replace an early-withdrawal penalty. The penalty can still apply while the deposit remains insured.

How to choose

Read the Truth in Savings disclosures. FDIC says banks must disclose fees, interest rates, and other terms when you open the account, when you ask, and when the terms change. Compare the current APY, the term, any minimum deposit, withdrawal limits, and the early-withdrawal penalty. Ignore any APY that is not on the institution's own disclosure.

Keep the emergency fund where you can reach it. Put a known future expense in a CD whose maturity matches that expense. If you want several dates, stagger the maturities instead of locking the whole sum to the farthest date. At renewal, read the written notice and compare the new rate before you let the CD roll.

Ally Bank vs Marcus by Goldman Sachs is a separate comparison of two savings accounts: /compare/ally-bank-vs-marcus-by-goldman-sachs. It is not a ranking to follow from this choice, and it does not set an APY for either account here.

This is general information from FDIC, CFPB, and NCUA publications. It is not a recommendation of a bank, a credit union, or a term.`;

export const HYSA_VS_CD: EditorialComparison = buildEditorialComparison({
  slug: "hysa-vs-cd",
  title: "HYSA vs CD: Which to Use for Savings",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "finance",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: HYSA,
      slug: HYSA,
      name: "High-yield savings account (HYSA)",
      shortDesc:
        "A savings deposit you can usually withdraw, with an APY the bank can change on a variable-rate account.",
      imageUrl: null,
      entityType: "account",
      position: 0,
      pros: [
        "FDIC: a savings account is for money you set aside and do not expect to use on a regular basis",
        "CFPB: use a savings account for emergencies and infrequent purchases",
        "FDIC: savings deposits can be insured at an FDIC-insured bank",
      ],
      cons: [
        "CFPB: the institution may limit monthly withdrawals or transfers and charge a fee",
        "FDIC Truth in Savings: on a variable-rate account, the interest rate and APY may change",
        "The current APY is the bank's disclosure, not a fixed quote",
      ],
      bestFor: "An emergency fund or cash you may need before a set date",
    },
    {
      id: CD,
      slug: CD,
      name: "Certificate of deposit (CD)",
      shortDesc:
        "A savings deposit you generally leave in place for a stated term, often with an early-withdrawal penalty.",
      imageUrl: null,
      entityType: "account",
      position: 1,
      pros: [
        "CFPB: you pick a term that matches when you expect to need the money",
        "FDIC: a fixed-rate account disclosure states how long the interest rate stays in effect",
        "FDIC: CDs can be insured at an FDIC-insured bank, on the same rules as other deposits",
      ],
      cons: [
        "CFPB: withdrawing early means a penalty fee; FDIC says most market-linked CDs do not allow early redemption",
        "CFPB: a renewal rate is not guaranteed to match the rate on the current CD",
        "FDIC: some CDs are variable, market-linked, or callable, so the rate is not locked on every CD",
      ],
      bestFor: "Money you can leave until a known maturity date",
    },
  ],
  keyDifferences: [
    {
      label: "What it is",
      entityAValue: "Savings deposit, often marketed for its yield",
      entityBValue: "Savings deposit with a stated term",
      winner: "tie",
    },
    {
      label: "Access",
      entityAValue: "Usually withdraw without a maturity date",
      entityBValue: "Generally leave the money until maturity",
      winner: "tie",
    },
    {
      label: "Withdrawal limits",
      entityAValue: "Bank may cap monthly withdrawals and charge a fee",
      entityBValue: "Early cash-out is a penalty or may be unavailable",
      winner: "tie",
    },
    {
      label: "Rate",
      entityAValue: "Variable-rate APY may change after opening",
      entityBValue: "Fixed-rate term is disclosed; not every CD is fixed",
      winner: "tie",
    },
    {
      label: "After maturity",
      entityAValue: "No maturity date on a savings deposit",
      entityBValue: "Renewal rate can differ; some CDs do not renew",
      winner: "tie",
    },
    {
      label: "FDIC, if the bank is insured",
      entityAValue: "$250,000 per depositor, per bank, per ownership category",
      entityBValue: "$250,000 per depositor, per bank, per ownership category",
      winner: "tie",
    },
    {
      label: "Credit union",
      entityAValue: "NCUA only if that credit union is federally insured",
      entityBValue: "Share certificate; same federal-insurance question",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "what-it-is",
      "What it is",
      SPEC,
      HYSA,
      CD,
      "Savings deposit. \"High-yield\" is the bank's label, not a separate FDIC category",
      "CD: a savings account you generally leave for a specified time (CFPB)",
    ),
    textAttr(
      "access",
      "Access to the money",
      SPEC,
      HYSA,
      CD,
      "FDIC: savings is for money you do not expect to use on a regular basis",
      "FDIC: you cannot withdraw from a CD whenever you like",
    ),
    textAttr(
      "withdrawal-fees",
      "Withdrawal limits or fees",
      SPEC,
      HYSA,
      CD,
      "CFPB: a monthly withdrawal or transfer limit, and a fee, are allowed",
      "Early withdrawal is the penalty in the account agreement",
    ),
    textAttr(
      "term",
      "Term",
      SPEC,
      HYSA,
      CD,
      "No set maturity",
      "FDIC: often three months to five years or more; a minimum deposit is possible",
    ),
    textAttr(
      "early-exit",
      "Taking money out early",
      SPEC,
      HYSA,
      CD,
      "No CD-style maturity wait; savings fees can still apply",
      "Most fixed-rate CDs: a fee. Most market-linked CDs: no early redemption (FDIC)",
    ),
    textAttr(
      "rate",
      "Rate during the term",
      SPEC,
      HYSA,
      CD,
      "Variable-rate accounts: the interest rate and APY may change (FDIC)",
      "Fixed-rate accounts: disclosure states how long the rate stays in effect (FDIC)",
    ),
    textAttr(
      "renewal",
      "When a CD matures",
      SPEC,
      HYSA,
      CD,
      "A savings deposit does not mature",
      "CFPB: renewal rate may be higher or lower; some CDs stop earning interest",
    ),
    textAttr(
      "fdic",
      "FDIC insurance",
      SPEC,
      HYSA,
      CD,
      "Covered at an FDIC-insured bank, up to the standard amount",
      "Covered at an FDIC-insured bank, up to the standard amount",
    ),
    textAttr(
      "standard-amount",
      "Standard amount",
      SPEC,
      HYSA,
      CD,
      "$250,000 per depositor, per insured bank, per ownership category",
      "$250,000 per depositor, per insured bank, per ownership category",
    ),
    textAttr(
      "same-bank",
      "Same owner, same bank",
      SPEC,
      HYSA,
      CD,
      "Added together with other deposits in that ownership category",
      "Added together with other deposits in that ownership category",
    ),
    textAttr(
      "ncua",
      "Credit union insurance",
      SPEC,
      HYSA,
      CD,
      "NCUA if the credit union is federally insured; private insurance is not NCUA",
      "A share certificate follows the same NCUA rules",
    ),
    textAttr(
      "apy-source",
      "Where the APY comes from",
      SPEC,
      HYSA,
      CD,
      "The bank's current account disclosure",
      "The bank's current account disclosure",
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "ally-bank-vs-marcus-by-goldman-sachs",
      title: "Ally Bank vs Marcus: 2026 HYSA Comparison",
      category: "finance",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "A HYSA for an emergency fund or cash you may need soon. A CD when you can leave the money until a known maturity date. Check the bank's current APY.",
    keyFact:
      "FDIC's standard deposit insurance amount is $250,000 per depositor, per insured bank, for each account ownership category. A HYSA and a CD in the same category at the same bank are added together.",
  },
  citationStats: {
    sourceCount: 9,
    dataPointCount: 24,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "FDIC: Deposit insurance", url: FDIC_INSURANCE },
      { name: "FDIC: Understanding deposit insurance", url: FDIC_UNDERSTANDING },
      { name: "FDIC: Deposit accounts", url: FDIC_ACCOUNTS },
      { name: "FDIC: Shopping for a certificate of deposit (November 2023)", url: FDIC_CD_SHOPPING },
      { name: "FDIC: Truth in Savings (Regulation DD)", url: FDIC_TISA },
      { name: "CFPB: What is a certificate of deposit (CD)?", url: CFPB_CD },
      { name: "CFPB: What is a CD rollover or renewal?", url: CFPB_ROLLOVER },
      { name: "CFPB: Savings-account withdrawal fees", url: CFPB_SAVINGS_FEES },
      { name: "NCUA: Share insurance coverage", url: NCUA_SHARE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "FDIC: Deposit insurance",
      url: FDIC_INSURANCE,
      description:
        "Deposits are automatically insured to at least $250,000 at each FDIC-insured bank. Covered accounts include savings accounts and certificates of deposit. Coverage is automatic at an FDIC-insured bank. BankFind confirms whether a bank is insured. The Electronic Deposit Insurance Calculator is linked from this overview.",
    },
    {
      type: "external",
      label: "FDIC: Understanding deposit insurance",
      url: FDIC_UNDERSTANDING,
      description:
        "Insurance covers $250,000 per depositor, per FDIC-insured bank, for each account ownership category. Deposits in the same category at the same bank are added together. Different categories, or the same category at another insured bank, are separate. EDIE is the estimator. Page last updated April 1, 2024.",
    },
    {
      type: "external",
      label: "FDIC: Deposit accounts",
      url: FDIC_ACCOUNTS,
      description:
        "A savings account sets aside money you do not expect to use on a regular basis. A CD does not let you withdraw whenever you like. The term is often three months to five years or more. Early withdrawal will likely mean a penalty or lost interest. CDs typically offer a higher rate than regular savings accounts. The standard insurance amount is $250,000 per depositor, per insured bank, for each ownership category. Truth in Savings requires disclosure of fees, rates, and other terms.",
    },
    {
      type: "external",
      label: "FDIC: Shopping for a certificate of deposit (November 2023)",
      url: FDIC_CD_SHOPPING,
      description:
        "A CD typically offers a higher rate than a regular savings account in exchange for a term, usually three months to five years or more. Some CDs use variable or market-linked rates. Most fixed-rate CDs allow early redemption for a fee. Most market-linked CDs do not. Renewal may use the old rate or the rate then in effect. The $250,000 limit includes principal and accrued interest. Some long-term CDs are callable.",
    },
    {
      type: "external",
      label: "FDIC: Truth in Savings (Regulation DD)",
      url: FDIC_TISA,
      description:
        "A variable-rate account may change after opening unless the institution contracts for at least 30 calendar days' written notice of rate decreases. The disclosure must say the interest rate and APY may change. A fixed-rate account is one with at least 30 calendar days' written notice of decreases, and the disclosure must state how long the rate stays in effect. A grace period is the post-maturity window on an automatically renewing time account when a withdrawal is not assessed a penalty.",
    },
    {
      type: "external",
      label: "CFPB: What is a certificate of deposit (CD)?",
      url: CFPB_CD,
      description:
        "A CD is a type of savings account from a bank or credit union. You generally agree to keep the money without a withdrawal for a specified time. Withdrawing early means a penalty fee. Shop the term, the interest rate, and the penalty. Match the maturity to when you expect to spend the money. Bank CDs are insured up to $250,000 by the FDIC, and credit union CDs up to $250,000 by the NCUA.",
    },
    {
      type: "external",
      label: "CFPB: What is a CD rollover or renewal?",
      url: CFPB_ROLLOVER,
      description:
        "A rollover can reinvest the original deposit, and sometimes interest already earned, in a new CD. Some CDs do not roll over and stop earning interest at maturity. The institution may renew automatically unless you opt out, and it must send a written notice before maturity. The new rate is not guaranteed to match the current CD.",
    },
    {
      type: "external",
      label: "CFPB: Savings-account withdrawal fees",
      url: CFPB_SAVINGS_FEES,
      description:
        "Banks and credit unions can charge fees for too many withdrawals or transfers in a month, for withdrawing too much, or for going below a minimum balance. They may set a monthly limit and then charge an excessive-use or withdrawal-limit fee. CFPB says to use a savings account for emergencies and infrequent purchases, and a checking account for day-to-day transactions.",
    },
    {
      type: "external",
      label: "NCUA: Share insurance coverage",
      url: NCUA_SHARE,
      description:
        "The Share Insurance Fund is similar to FDIC insurance and is backed by the full faith and credit of the United States. It covers share savings and share certificates at a federally insured credit union. Individual accounts up to $250,000. A member's interest in all joint accounts combined up to $250,000. IRA and KEOGH accounts separately up to $250,000. Some state-chartered credit unions use private insurance that is not federal. Confirm with the Credit Union Locator. The estimator is on MyCreditUnion.gov.",
    },
  ],
  metaTitle: "HYSA vs CD for Savings",
});
