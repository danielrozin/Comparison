/**
 * DAN-1840: Blog post — "Can You Deposit Cash at an ATM? (All Banks Guide)" (22,200/mo, KD 0)
 * Run: npx tsx scripts/publish-dan1840-atm-cash-deposit.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POST = {
  slug: "can-you-deposit-cash-at-an-atm",
  title: "Can You Deposit Cash at an ATM? (All Banks Guide)",
  excerpt:
    "Yes — most major bank ATMs accept cash deposits, but online-only banks and many credit union ATMs do not. This guide covers which banks let you deposit cash at ATMs, how long it takes to appear, daily deposit limits, and what to do when your bank's ATM isn't nearby.",
  category: "finance",
  tags: ["atm", "cash deposit", "banking", "checking account", "bank of america", "chase", "wells fargo"],
  metaTitle: "Can You Deposit Cash at an ATM? Yes — All Banks Guide (2026)",
  metaDescription:
    "Most bank ATMs accept cash deposits. Chase, Bank of America, Wells Fargo, and TD Bank do. Online banks (Chime, Ally) do not. See limits, availability times, and what to do without a nearby ATM.",
  relatedComparisonSlugs: ["chase-vs-bank-of-america"],
  content: `# Can You Deposit Cash at an ATM?

**Yes — most major bank ATMs accept cash deposits.** If you have a checking or savings account at Chase, Bank of America, Wells Fargo, TD Bank, Citi, or most traditional banks, you can deposit cash at their branded ATMs 24/7 without needing to visit a teller.

However, there are important exceptions: **online-only banks** (Chime, Ally, SoFi, Marcus) and many credit union members cannot deposit cash at ATMs because those institutions don't operate their own ATM networks.

Here's the full breakdown by bank, how deposits work, how long funds take to appear, and what your options are if your bank's ATM isn't nearby.

## Which Banks Accept Cash Deposits at ATMs?

### Banks That DO Accept ATM Cash Deposits

| Bank | ATM Cash Deposit | ATM Network | Notes |
|------|-----------------|-------------|-------|
| **Chase** | ✓ Yes | Chase ATMs only | Deposits available same business day (or next if after cutoff) |
| **Bank of America** | ✓ Yes | BofA ATMs only | Instant availability for debit card holders |
| **Wells Fargo** | ✓ Yes | Wells Fargo ATMs only | Envelope-free deposits accepted |
| **TD Bank** | ✓ Yes | TD ATMs + some partner ATMs | Available same day |
| **Citibank** | ✓ Yes | Citi ATMs only | Limited locations outside major cities |
| **U.S. Bank** | ✓ Yes | U.S. Bank ATMs only | Available same business day |
| **PNC Bank** | ✓ Yes | PNC ATMs only | PNC Smart Access and Virtual Wallet accounts supported |
| **Capital One** | ✓ Yes | Capital One ATMs + select partner locations | 360 Checking customers; some CVS and Walgreens locations |
| **Regions Bank** | ✓ Yes | Regions ATMs | Available in Southeast and Midwest U.S. |
| **KeyBank** | ✓ Yes | KeyBank ATMs | Available same business day |

### Banks That Do NOT Accept ATM Cash Deposits

| Bank/Service | ATM Cash Deposit | Why Not | Alternative |
|-------------|-----------------|---------|-------------|
| **Chime** | ✗ No | Online-only, no proprietary ATMs | Walgreens, Walmart, CVS (fees apply) |
| **Ally Bank** | ✗ No | Online-only bank | No direct cash deposit option |
| **SoFi Bank** | ✗ No | Online-only | No ATM cash deposit; use Allpoint ATMs for withdrawals only |
| **Marcus (Goldman Sachs)** | ✗ No | Savings-only, no ATM network | No cash deposit option |
| **CIT Bank** | ✗ No | Online-only | No ATM cash deposits |
| **Discover Bank** | ✗ No | Online-only | No ATM cash deposits |
| **American Express Savings** | ✗ No | Online-only | No ATM cash deposits |

**The pattern:** Traditional brick-and-mortar banks with their own ATM networks accept cash deposits. Online-only banks do not, because they rely on partner ATM networks (Allpoint, MoneyPass) that are withdrawal-only.

## How to Deposit Cash at an ATM (Step-by-Step)

The process is similar across most major banks:

1. **Find a bank-branded ATM** — Use your bank's app to locate the nearest deposit-accepting ATM. Note that not all ATMs accept deposits — older ATMs and some partner network ATMs are withdrawal-only.
2. **Insert your debit card** and enter your PIN
3. **Select "Deposit"** from the main menu
4. **Choose the account** (checking or savings)
5. **Insert the cash** — Modern ATMs accept loose bills directly; they count and verify the bills automatically. No envelope required at most major banks.
6. **Verify the amount on screen** — The ATM displays a count of bills detected. Confirm the total is correct before proceeding.
7. **Select "Confirm"** — The ATM prints a receipt showing the deposit amount and your new balance.

**Tips:**
- Do not bundle bills with rubber bands or paper clips — ATMs can jam
- Remove staples or tape from bills before inserting
- If the ATM miscounts a bill, it may reject it — set it aside and re-deposit
- Keep your receipt until the deposit appears in your account

## ATM Cash Deposit Limits by Bank

| Bank | Daily Deposit Limit | Per-Transaction Limit |
|------|--------------------|-----------------------|
| **Chase** | $10,000 | $10,000 |
| **Bank of America** | $10,000 | $10,000 (up to 50 bills) |
| **Wells Fargo** | Varies by account | $2,500–$10,000 |
| **TD Bank** | $5,000–$10,000 | Varies |
| **Capital One** | $5,000 | $5,000 |
| **U.S. Bank** | $10,000 | $5,000 |
| **PNC Bank** | $10,000 | Varies |

Most banks cap ATM cash deposits at $10,000 per day, which aligns with federal currency transaction reporting (CTR) thresholds. Some banks have lower limits for newer accounts or specific account types.

## How Long Does It Take for ATM Cash Deposits to Show Up?

This depends on the time of your deposit and your bank's policies:

| Timing | Availability |
|--------|-------------|
| **Deposited before daily cutoff (typically 2–3 PM)** | Available same business day |
| **Deposited after cutoff** | Available next business day |
| **Deposited on weekend or federal holiday** | Available following business day |
| **Large deposits (over $5,525)** | $225 available same day; remainder within 1–2 business days |

**Bank of America** and **Chase** typically make the full deposit available immediately or within a few hours if the ATM is branded with the bank's name. Third-party ATMs may have holds applied.

The first $225 of a deposit is almost always available immediately under federal Regulation CC. Banks can hold the remainder for up to 2 business days for standard deposits.

## What If Your Bank Doesn't Have a Nearby ATM?

If you bank with an online institution or can't reach your bank's ATM, here are your options:

### 1. Retail Cash Reload Networks (Fees Apply)

| Service | Locations | Fee |
|---------|-----------|-----|
| **Green Dot** | Walgreens, CVS, Dollar General, Walmart | $3.95–$5.95 |
| **PayPal/Venmo Cash Reload** | CVS, Rite Aid, Dollar General | Up to $3.95 |
| **Chime SpotMe** | Walgreens, Dollar General, Family Dollar | Free for Chime customers |
| **MoneyPak** | 70,000+ retail locations | $5.95 |

These services let you hand cash to a cashier, who applies a reload code to your account. They're convenient but carry fees.

### 2. Bank Transfer Workaround

If you have cash and no fee-free deposit option:
1. Open a checking account at a local bank that has ATMs near you (Chase and Bank of America have the widest U.S. ATM networks)
2. Deposit cash into that account via ATM
3. ACH transfer the funds to your online bank (1–3 business days, usually free)

This two-step process avoids retail reload fees at the cost of an extra transfer day.

### 3. Money Order

Buy a money order at USPS, Walmart, or a convenience store (typically $1–$1.50), then deposit it via your bank's mobile check deposit app. This works for online banks that don't have ATMs but do accept mobile deposits.

### 4. Zelle or Peer-to-Peer Transfer

If someone you trust can deposit cash for you, you can reimburse them via Zelle, Venmo, or Cash App once they deposit the cash to your account.

## Chase vs. Bank of America: ATM Cash Deposit Comparison

Since Chase and Bank of America are the two largest U.S. banks and both accept ATM cash deposits, here's how they compare:

| Feature | Chase | Bank of America |
|---------|-------|-----------------|
| **ATMs in U.S.** | ~16,000 | ~15,000 |
| **ATM cash deposit** | ✓ Yes | ✓ Yes |
| **Envelope required** | No | No |
| **Same-day availability** | ✓ Before daily cutoff | ✓ Most accounts |
| **Daily deposit limit** | $10,000 | $10,000 |
| **24/7 availability** | ✓ Yes | ✓ Yes |
| **International ATMs** | Yes (fees apply) | Yes (fees apply) |

Both banks have comparable ATM cash deposit capabilities. Bank of America edges slightly ahead in deposit immediacy for existing customers with established accounts.

## ATM Cash Deposit FAQs

**Can you deposit cash at any ATM?**
No — only ATMs operated by your own bank or in-network partner ATMs that explicitly support deposits. Most ATM networks (Allpoint, MoneyPass, STAR) only allow withdrawals, not deposits.

**Can you deposit cash at a Chase ATM if you don't have a Chase account?**
No. Chase ATMs require a Chase debit or credit card for cash deposits. Non-Chase cardholders can use Chase ATMs for withdrawals (with fees), but not deposits.

**Does depositing cash at an ATM count toward FDIC insurance?**
Yes — once credited to your account, ATM deposits are FDIC-insured up to $250,000 per depositor per insured bank.

**What happens if an ATM takes your cash and doesn't credit your account?**
If the ATM swallows cash without crediting your account, call your bank immediately (the number is on the back of your card). Banks have 10 business days to investigate ATM discrepancy claims and must provisionally credit disputed amounts within that window under Regulation E.

**Can you deposit coins at an ATM?**
No — ATMs only accept paper bills. For coins, you'll need a teller or a coin counting machine (many grocery stores have Coinstar machines, though they charge a fee unless you take a store gift card).

**Does Wells Fargo accept ATM cash deposits without an envelope?**
Yes — Wells Fargo updated its ATM technology to accept loose bills directly. Envelopes are no longer required at Wells Fargo ATMs.

## Bottom Line

Most major U.S. banks — Chase, Bank of America, Wells Fargo, TD Bank, U.S. Bank, and Capital One — allow you to deposit cash at their branded ATMs 24/7 with no envelope required. Funds are typically available same-day if deposited before the daily cutoff (usually 2–3 PM local time).

Online-only banks (Chime, Ally, SoFi, Marcus) do not offer ATM cash deposits. Customers who frequently need to deposit cash should either bank with a traditional institution or use a retail cash reload service and accept the ~$4 fee.

For a full side-by-side comparison of Chase and Bank of America — fees, ATM networks, savings rates, checking accounts, and which bank is better for your needs — see our [Chase vs Bank of America comparison](/compare/chase-vs-bank-of-america).

### Related Comparisons
- [Chase vs Bank of America: Full Comparison](/compare/chase-vs-bank-of-america)
- [Capital One vs Chase: Which Bank Wins?](/compare/capital-one-vs-chase)
- [Wells Fargo vs Chase: Full Comparison](/compare/wells-fargo-vs-chase)
`,
};

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
  console.log(`DAN-1840: Publishing blog post — ${POST.title}...\n`);

  try {
    await prisma.blogArticle.upsert({
      where: { slug: POST.slug },
      create: {
        slug: POST.slug,
        title: POST.title,
        excerpt: POST.excerpt,
        content: POST.content,
        category: POST.category,
        tags: POST.tags,
        metaTitle: POST.metaTitle,
        metaDescription: POST.metaDescription,
        relatedComparisonSlugs: POST.relatedComparisonSlugs,
        status: "published",
        isAutoGenerated: false,
        publishedAt: new Date(),
      },
      update: {
        title: POST.title,
        excerpt: POST.excerpt,
        content: POST.content,
        category: POST.category,
        tags: POST.tags,
        metaTitle: POST.metaTitle,
        metaDescription: POST.metaDescription,
        relatedComparisonSlugs: POST.relatedComparisonSlugs,
        status: "published",
        publishedAt: new Date(),
      },
    });
    console.log(`  ✓ Published: /blog/${POST.slug}`);
  } catch (err: any) {
    console.error(`  ✗ Error: ${err.message}`);
    process.exit(1);
  }

  // Add exact-match FAQ to parent comparison page
  console.log("\n→ Adding exact-match FAQ to parent comparison page...");
  await addFaqToComparison(
    "chase-vs-bank-of-america",
    "Can you deposit cash at a Chase or Bank of America ATM?",
    "Yes — both Chase and Bank of America allow cash deposits at their branded ATMs 24/7. No envelope is required. Deposits made before the daily cutoff (typically 2–3 PM) are available same business day. Both banks cap ATM cash deposits at $10,000 per day. Note: you must use your own bank's ATM — Chase ATMs only accept Chase cards for deposits, and Bank of America ATMs only accept BofA cards.",
    13
  );

  const total = await prisma.blogArticle.count({ where: { status: "published" } });
  console.log(`\nTotal published blog articles: ${total}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
