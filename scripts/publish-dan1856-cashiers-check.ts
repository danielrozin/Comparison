/**
 * DAN-1856: Blog — What Is a Cashier's Check? (33,100/mo, KD 6)
 * Run: npx tsx scripts/publish-dan1856-cashiers-check.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "what-is-a-cashiers-check",
    title: "What Is a Cashier's Check?",
    excerpt:
      "A cashier's check is a check issued and guaranteed by a bank — unlike a personal check, the funds are drawn directly from the bank's own account, not yours. That makes it one of the safest forms of payment for large transactions like real estate closings, car purchases, and security deposits.",
    category: "finance",
    tags: [
      "cashier's check",
      "banking",
      "payment methods",
      "check cashing",
      "secure payments",
    ],
    metaTitle:
      "What Is a Cashier's Check? How It Works, Fees & When to Use One (2026)",
    metaDescription:
      "A cashier's check is guaranteed by the bank — funds are drawn from the bank's account, not yours. Learn how to get one, what it costs, and when to use it instead of a personal check or money order.",
    relatedComparisonSlugs: [
      "checking-account-vs-savings-account",
      "chase-vs-bank-of-america",
      "chase-vs-wells-fargo",
    ],
    content: `# What Is a Cashier's Check?

A **cashier's check** is a check issued and guaranteed by a bank. When you get a cashier's check, the bank withdraws the funds from your account (or collects cash), deposits that money into the bank's own account, and then issues a check drawn on the bank's funds — not yours.

Because the bank itself backs the payment, a cashier's check is considered one of the most secure forms of payment. The recipient doesn't have to worry about the check bouncing, which is why cashier's checks are required for large transactions like real estate closings, car purchases, and down payments.

---

## How a Cashier's Check Works

Here's the step-by-step of what happens when you get a cashier's check:

1. **You request the check** — You visit your bank (or credit union) in person or, at some banks, request online. You specify the payee name and the exact dollar amount.
2. **The bank withdraws the funds** — The bank debits your checking or savings account (or you pay cash) for the check amount plus any fee.
3. **The bank issues the check** — The check is drawn on the bank's own account and signed by a bank officer. It states "Cashier's Check" on its face.
4. **The payee receives guaranteed funds** — When the recipient deposits or cashes the check, it clears quickly because the funds are backed by the bank, not an individual's personal account.

Once issued, the funds are essentially held in reserve by the bank until the check is deposited or cashed.

---

## Cashier's Check vs. Personal Check: Key Differences

| Feature | Cashier's Check | Personal Check |
|---------|----------------|----------------|
| **Funds backed by** | The bank | Your personal account |
| **Bounce risk** | None (unless fraudulent) | Yes, if account has insufficient funds |
| **Acceptance for large payments** | Widely accepted | Often not accepted |
| **Traceability** | Bank keeps record | Depends on your bank |
| **Cost to get** | $5–$15 fee (often free for premium accounts) | Free (part of your checking account) |
| **Where to get** | Bank or credit union | Write it yourself |
| **Best for** | Real estate, cars, large deposits | Everyday payments between people you trust |

The key distinction: a personal check draws on your account balance, and if your account doesn't have sufficient funds, the check bounces. A cashier's check draws on the bank's own account, so bouncing is not a risk — unless the check is counterfeit (more on fraud below).

---

## Cashier's Check vs. Money Order

Both cashier's checks and money orders are prepaid and considered safer than personal checks, but they serve different use cases.

| Feature | Cashier's Check | Money Order |
|---------|----------------|-------------|
| **Maximum amount** | Typically no limit (depends on bank) | Usually $1,000 per money order |
| **Issued by** | Banks and credit unions | Post offices, Walmart, grocery stores, banks |
| **Cost** | $5–$15 | $0.65–$2 (post office), up to $5 (retail) |
| **Best for** | Large payments ($500+) | Small to medium payments ($500 and under) |
| **Accepted for real estate** | Yes | Typically no |
| **Requires bank account** | Yes (to debit funds) | No |
| **Traceability** | Yes (bank record) | Yes (receipt and serial number) |

**Use a cashier's check** when you need to make a large payment to an institution or individual who requires guaranteed funds — home down payments, vehicle purchases, security deposits, legal settlements.

**Use a money order** for smaller amounts when you don't have a bank account, or when you need to pay by mail and don't want to send cash.

---

## How to Get a Cashier's Check

### At a Bank or Credit Union (In-Person)

This is the most common method:

1. **Go to your bank branch** with a valid photo ID.
2. **Request a cashier's check** at the teller window. Provide:
   - The exact dollar amount
   - The full legal name of the payee (person or business receiving the check)
   - Your account number (if paying from an account)
3. **Pay the fee** — the bank deducts the check amount plus fee from your account, or you pay cash.
4. **Receive the check** — the teller or a bank officer issues and signs the check on the spot.

The process takes 5–15 minutes at most branches.

### Online or via App (Some Banks)

Select banks — including Chase, Bank of America, Wells Fargo, and some credit unions — allow you to request a cashier's check online or through the mobile app. The check is then mailed to you, which typically takes 5–10 business days. Online requests are not suitable if you need the check the same day.

### What If You Don't Have an Account at That Bank?

Most banks require you to be an account holder to issue a cashier's check. However, some banks and credit unions will issue a cashier's check to non-customers if you pay with cash. Policies vary; call ahead to confirm before visiting.

---

## Cashier's Check Fees by Bank (2026)

| Bank | Cashier's Check Fee |
|------|---------------------|
| Chase | $8 (free for Sapphire Banking and Private Client) |
| Bank of America | $15 (waived for Preferred Rewards Platinum and higher) |
| Wells Fargo | $10 (waived for Premier and Private Bank clients) |
| Citibank | $10 (waived for Citi Priority and higher) |
| U.S. Bank | $7 (waived for Premium account holders) |
| TD Bank | $8 (waived for some account types) |
| Credit unions | Often $0–$5 (many offer free cashier's checks to members) |
| Post office | Does not offer cashier's checks (only money orders) |

**Pro tip:** If your checking account has a premium tier or relationship pricing, cashier's check fees are often waived. Members of credit unions frequently get cashier's checks free or at very low cost compared to big banks.

---

## When to Use a Cashier's Check

Cashier's checks are typically required or strongly preferred for:

- **Real estate closings** — Mortgage lenders and title companies require guaranteed funds at closing. Cashier's checks are the standard payment method for down payments and closing costs.
- **Vehicle purchases** — Private sellers and dealerships often require a cashier's check for large vehicle purchases to avoid bounced check risk.
- **Security deposits** — Some landlords require cashier's checks for first month/last month/deposit payments, especially for higher-end rentals.
- **Large peer-to-peer transactions** — When buying expensive items on Craigslist or Facebook Marketplace from someone you don't know.
- **Legal settlements** — Courts and attorneys often require guaranteed funds for settlement payments.
- **Tax payments** — Some state agencies accept (or require) cashier's checks for large tax payments.

You generally do **not** need a cashier's check for:
- Paying bills (use ACH/bank transfer or credit card)
- Everyday purchases (use debit/credit card)
- Sending money to friends/family (use Venmo, Zelle, etc.)
- Small transactions under $200 (personal check or cash works fine)

---

## Are Cashier's Checks Safe?

A legitimate cashier's check from a real bank is extremely safe — the bank guarantees the funds. However, **cashier's check fraud is a significant and growing problem.**

### Common Cashier's Check Scams

**Overpayment scam:** A "buyer" sends you a cashier's check for more than the agreed amount and asks you to wire back the difference. The check later bounces (it was counterfeit), and you've already wired real money. This is the most common cashier's check fraud.

**Fake check scam:** Criminals create convincing counterfeit cashier's checks using real bank names and routing numbers. Banks may initially show the funds as "available" before the check clears — if you spend those funds and the check later comes back fraudulent, you owe the money back.

**How to protect yourself:**
- **Never accept a cashier's check for more than the agreed amount** and wire back the difference.
- **Wait for the check to fully clear** — not just appear available — before releasing goods or sending money. Full clearance can take 1–5 business days beyond the initial availability.
- **Verify the check directly with the issuing bank** — call the bank's main number (not any number on the check itself) and ask them to verify the check number and amount.
- **Be suspicious of unsolicited checks** — if you weren't expecting a cashier's check, treat it with extra caution.

---

## How Long Does a Cashier's Check Take to Clear?

Under federal Regulation CC, banks must make the first $225 of a cashier's check available the next business day. For checks over $5,000, the first $5,525 must be available within one business day, with the remainder by the second business day.

However, **availability is not the same as clearance.** A fraudulent check may appear available for 1–5 days before it bounces. If you spend available funds from a fraudulent cashier's check, you may be liable for the full amount.

For extra security with high-value transactions, wait the full clearance period (up to 5 business days) before releasing goods or acting on the funds.

---

## Can a Cashier's Check Be Cancelled or Stopped?

Cancelling a cashier's check is more complicated than stopping a personal check:

1. **Contact your bank immediately** — banks can sometimes place a stop payment on a cashier's check, but only before it has been cashed.
2. **You'll need to wait 90 days** — if the check has not been cashed within 90 days, most banks will issue a replacement or refund after that period.
3. **You may need an indemnity bond** — for immediate replacement (before 90 days), many banks require you to purchase an indemnity bond (a type of insurance) protecting them from double-payment liability.

If you lose a cashier's check, report it to your bank immediately.

---

## Cashier's Check vs. Certified Check

A **certified check** is different from a cashier's check:

| Feature | Cashier's Check | Certified Check |
|---------|----------------|-----------------|
| **Drawn on** | Bank's own account | Your personal account |
| **Bank guarantees** | Yes | Yes (funds are earmarked/frozen) |
| **Availability** | Widely available | Less common; many banks have stopped offering |
| **Acceptance** | Broad | Same as cashier's check |

A certified check is drawn on your personal account, but the bank verifies and "certifies" that sufficient funds exist by freezing that amount. Both types are considered guaranteed funds, but cashier's checks are more widely issued and accepted today because certified checks are increasingly rare.

---

## FAQ

**What is a cashier's check used for?**
Cashier's checks are used for large, high-stakes transactions where the recipient needs guaranteed funds — real estate closings, vehicle purchases, security deposits, legal settlements, and large peer-to-peer sales. They're the standard payment method when personal checks aren't trusted.

**How is a cashier's check different from a regular check?**
A regular personal check draws on your personal bank account and can bounce if you don't have sufficient funds. A cashier's check draws on the bank's own account — the bank has already collected the funds from you and guarantees payment to the recipient.

**How much does a cashier's check cost?**
Most banks charge $5–$15 for a cashier's check. Credit unions often charge less ($0–$5) or nothing for members. Premium bank accounts (Chase Sapphire Banking, BofA Preferred Rewards Platinum, etc.) typically waive the fee entirely.

**Where can I get a cashier's check without a bank account?**
Some banks and credit unions will issue cashier's checks to non-customers in exchange for cash. Check with the institution before visiting. The post office and grocery stores do not offer cashier's checks — they offer money orders, which have a $1,000 limit.

**Can a cashier's check bounce?**
A legitimate cashier's check from a real bank cannot bounce — the bank has already set aside the funds. However, **counterfeit cashier's checks** can appear valid and still "bounce" when the bank discovers they're fraudulent. This is why cashier's check scams are so dangerous.

**How long is a cashier's check valid?**
Most cashier's checks don't have a printed expiration date, but they're generally considered valid for 90–180 days. After that, a bank may refuse to cash an old or "stale" cashier's check. Contact the issuing bank if you have an old uncashed cashier's check.

**Can I get a cashier's check from an online bank?**
Some online banks (Ally, Capital One, etc.) offer cashier's checks, but typically require you to request by mail or phone — and the check arrives by mail in several business days. Online banks don't have branch locations where you can pick up a check the same day.

**Is a cashier's check the same as a bank check?**
Yes — "bank check," "cashier's check," "official bank check," and "teller's check" are often used interchangeably to describe the same instrument: a check drawn on the bank's own account and guaranteed by the bank.

**What happens if a cashier's check is lost or stolen?**
Contact the issuing bank immediately. They can put a stop payment on the check and may issue a replacement, but you'll typically need to wait 90 days and/or purchase an indemnity bond to cover the bank against potential double-payment.

---

## Bottom Line

A cashier's check is a bank-guaranteed payment instrument where the bank collects your funds upfront and issues a check drawn on its own account. Because the bank backs the payment, cashier's checks are one of the safest forms of guaranteed funds — required for real estate closings, large vehicle purchases, and other high-value transactions. Most banks charge $5–$15 to issue one; credit unions and premium bank accounts often offer them free.

If you're deciding between a cashier's check and a money order, use a cashier's check for amounts over $1,000 or when the recipient specifically requires guaranteed bank-issued funds. Use a money order for smaller amounts, especially if you don't have a bank account.

### Related Comparisons
- [Checking Account vs Savings Account: What's the Difference?](/compare/checking-account-vs-savings-account)
- [Chase vs Bank of America: Which Bank Is Better?](/compare/chase-vs-bank-of-america)
- [Chase vs Wells Fargo: Full Comparison](/compare/chase-vs-wells-fargo)
`,
  },
];

async function addFaqToComparison(
  comparisonSlug: string,
  question: string,
  answer: string,
  sortOrder: number
) {
  const comparison = await prisma.comparison.findUnique({
    where: { slug: comparisonSlug },
    select: { id: true },
  });
  if (!comparison) {
    console.log(`  → Comparison not found: ${comparisonSlug}, skipping FAQ`);
    return;
  }

  const existing = await prisma.fAQ.findFirst({
    where: {
      comparisonId: comparison.id,
      question: { contains: question.substring(0, 40) },
    },
  });

  if (existing) {
    console.log(`  → FAQ already exists on ${comparisonSlug}`);
    return;
  }

  await prisma.fAQ.create({
    data: {
      comparisonId: comparison.id,
      question,
      answer,
      sortOrder,
    },
  });
  console.log(`  → FAQ added to ${comparisonSlug}`);
}

async function main() {
  console.log(
    `DAN-1856: Publishing "What Is a Cashier's Check?" (33,100/mo, KD 6)...\n`
  );

  let success = 0;
  for (const post of POSTS) {
    console.log(`→ ${post.slug}`);
    try {
      await prisma.blogArticle.upsert({
        where: { slug: post.slug },
        create: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          relatedComparisonSlugs: post.relatedComparisonSlugs,
          status: "published",
          isAutoGenerated: false,
          publishedAt: new Date(),
        },
        update: {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          relatedComparisonSlugs: post.relatedComparisonSlugs,
          status: "published",
          publishedAt: new Date(),
        },
      });
      console.log(`  ✓ Published`);
      success++;
    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }

  console.log(
    "\n→ Adding exact-match FAQ to checking-account-vs-savings-account comparison..."
  );

  await addFaqToComparison(
    "checking-account-vs-savings-account",
    "What is a cashier's check?",
    "A cashier's check is a check issued and guaranteed by a bank. Unlike a personal check drawn on your account, a cashier's check is drawn on the bank's own account — the bank collects your funds upfront and guarantees payment. Cashier's checks are used for large transactions like real estate closings, vehicle purchases, and security deposits where guaranteed funds are required. Most banks charge $5–$15 to issue one.",
    15
  );

  await addFaqToComparison(
    "chase-vs-bank-of-america",
    "What is a cashier's check and can I get one at Chase or Bank of America?",
    "A cashier's check is a bank-guaranteed check drawn on the bank's own account — unlike a personal check, it can't bounce because the bank has already collected the funds. Chase charges $8 for a cashier's check (free for Sapphire Banking customers). Bank of America charges $15 (waived for Preferred Rewards Platinum and higher). Both banks can issue cashier's checks at branch locations, typically within 15 minutes.",
    15
  );

  const total = await prisma.blogArticle.count({
    where: { status: "published" },
  });
  console.log(`\nDone: ${success}/${POSTS.length} posts published.`);
  console.log(`Total published blog articles: ${total}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
