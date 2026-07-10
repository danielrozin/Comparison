/**
 * DAN-1847: Blog — Can You Deposit Cash at an ATM? (22200/mo, KD 0)
 * Run: npx tsx scripts/publish-tactical-blogs-dan1847.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "can-you-deposit-cash-at-an-atm",
    title: "Can You Deposit Cash at an ATM? (Yes — Here's How)",
    excerpt:
      "Yes — most bank ATMs accept cash deposits, but ATMs from third-party networks (Allpoint, Cirrus, MoneyPass) typically do not. You can only deposit cash at an ATM owned by your own bank or credit union. Here's which banks allow it, how it works, and when deposits become available.",
    category: "finance",
    tags: ["atm", "cash deposit", "banking", "checking account", "bank atm"],
    metaTitle: "Can You Deposit Cash at an ATM? Yes — How It Works (2026)",
    metaDescription:
      "Most bank ATMs accept cash deposits, but only at ATMs owned by your own bank. Learn which banks allow ATM cash deposits, daily limits, availability timelines, and what to do if your ATM doesn't take cash.",
    relatedComparisonSlugs: ["chase-vs-bank-of-america", "chase-vs-wells-fargo"],
    content: `# Can You Deposit Cash at an ATM?

**Yes — most bank ATMs accept cash deposits**, but only at ATMs owned or operated by your own bank. Third-party ATMs (Allpoint, Cirrus, MoneyPass, and most convenience store ATMs) are withdrawal-only and will not accept cash deposits.

Here's what you need to know: which banks support it, how the process works, when your money becomes available, and what your alternatives are if your nearest ATM doesn't take cash.

## Which Banks Allow Cash Deposits at ATMs?

Most major U.S. banks and credit unions support cash deposits at their own ATMs. Here's the status for the largest banks:

| Bank | Cash Deposits at ATM? | Notes |
|------|-----------------------|-------|
| **Chase** | ✓ Yes | At Chase-branded ATMs only; no deposit envelopes needed |
| **Bank of America** | ✓ Yes | At BofA ATMs; some older ATMs are cash-only for withdrawals |
| **Wells Fargo** | ✓ Yes | At Wells Fargo ATMs with envelope-free deposits |
| **Citi** | ✓ Yes | At Citi ATMs; limited ATM network nationwide |
| **Capital One** | ✓ Yes | At Capital One ATMs and Café locations |
| **TD Bank** | ✓ Yes | At TD Bank ATMs |
| **US Bank** | ✓ Yes | At US Bank ATMs |
| **PNC Bank** | ✓ Yes | At PNC ATMs; envelope-free at most locations |
| **Ally Bank** | ✗ No | Online-only bank; no proprietary ATM network |
| **Chime** | ✗ No | No ATM cash deposit support; use Green Dot retail deposits |
| **Marcus by Goldman Sachs** | ✗ No | Savings-only bank; no ATM deposits |

**The rule:** if your bank has physical branches, its ATMs almost certainly accept cash deposits. If your bank is online-only (Ally, Marcus, Chime, SoFi), cash deposit options are limited or unavailable at ATMs.

## How to Deposit Cash at an ATM

Modern bank ATMs make cash deposits straightforward — most no longer require deposit envelopes:

1. **Insert your debit card** — use the card for the account you want to deposit into
2. **Enter your PIN**
3. **Select "Deposit"** from the main menu
4. **Choose the account** — checking or savings
5. **Insert the cash into the ATM's bill acceptor** — the machine counts the bills and displays the total on screen
6. **Confirm the amount** — review the count and confirm (or cancel if it's wrong)
7. **Take your receipt** — the receipt shows the amount deposited and the transaction reference number

Most ATMs can process bills in any order and count them automatically. If the machine miscounts, you'll see the discrepancy on screen before you confirm — you can cancel and re-insert the cash.

**Older ATMs with envelopes:** Some older bank ATMs still require you to insert cash into a deposit envelope, seal it, and write the amount on the outside before inserting it into a slot. These are being phased out, but you may encounter them at off-site locations (gas stations, airports) that still run older ATM hardware.

## ATM Cash Deposit Limits

ATM cash deposit limits vary by bank and account type. Some general benchmarks:

| Bank | Typical ATM Cash Deposit Limit |
|------|-------------------------------|
| **Chase** | $10,000 per day (may vary by account) |
| **Bank of America** | $10,000 per transaction / per day |
| **Wells Fargo** | $10,000 per day |
| **Capital One** | $5,000 per day for most accounts |

These limits align with IRS currency transaction reporting requirements — any cash deposit over $10,000 triggers a Currency Transaction Report (CTR), a standard anti-money-laundering filing. This applies to bank tellers too, not just ATMs.

If you regularly deposit amounts above these limits, use a bank teller instead of the ATM.

## When Does ATM Cash Deposit Money Become Available?

This is the most important practical question — ATM cash deposits are not always immediately accessible:

| Scenario | Typical Availability |
|----------|---------------------|
| **Deposit at your bank's ATM before cutoff** | Same business day or next business day |
| **Deposit at your bank's ATM after cutoff** | Next business day |
| **Weekend deposit** | Following Monday (next business day) |
| **Holiday deposit** | Next business day after the holiday |

**Regulation CC rules:** Under the Expedited Funds Availability Act (Regulation CC), banks are required to make the first $225 of a cash deposit available on the next business day. The rest must be available within two business days. Many banks make larger cash deposits available sooner, but this is the federal minimum.

**Cutoff times:** Most banks have ATM deposit cutoff times, typically 9pm–11pm local time. Deposits made before cutoff count as same-day; deposits after cutoff post the next business day.

**Tip:** If you need the funds urgently and can visit a branch during business hours, a teller deposit is usually credited same-day or within one business day regardless of the amount.

## Why Some ATMs Don't Accept Cash Deposits

You may encounter ATMs that only dispense cash — here's why:

- **Third-party ATM networks** (Allpoint, MoneyPass, Cirrus, NYCE) operate ATMs at gas stations, convenience stores, and retailers. These are almost always withdrawal-only. They're designed to give customers access to cash, not to process deposits on behalf of individual banks.
- **Off-premises ATMs** owned by your bank but located at retail locations or airports may be older models without deposit functionality.
- **Credit union shared branching networks** — some credit unions participate in shared branching, which allows deposits at partner credit union locations but not at all shared ATMs.

If you see an ATM that accepts deposits, it will typically display a "deposit" option on the main screen. If there's no deposit option, the machine doesn't support it.

## ATM Cash Deposit vs. Teller: Key Differences

| | ATM Deposit | Teller Deposit |
|--|-------------|---------------|
| **Hours** | 24/7 | Branch hours only |
| **Speed** | 1–2 business days | Same day to next day |
| **Limit** | Usually $10,000/day | No ATM cap; CTR required over $10,000 |
| **Receipt** | Printed or digital | Paper receipt |
| **Error handling** | ATM counts automatically | Human verification |
| **Large amounts** | May require multiple transactions | No restriction |

For routine deposits under $10,000, the ATM is fast and convenient. For larger amounts, irregular cash (foreign currency, unusual denominations), or when you need same-day availability confirmed, use a teller.

## Alternatives If Your Bank Has No ATM Cash Deposits

If your bank is online-only (Ally, Chime, Marcus, SoFi) or doesn't have ATMs in your area, these are your main options:

- **Green Dot Reload Network** — Chime, Varo, and many online banks partner with Green Dot. You can hand cash to a cashier at Walmart, CVS, Walgreens, or 7-Eleven and have it loaded to your account. Fees typically run $4.95–$5.95 per transaction.
- **Money order + mobile deposit** — buy a money order (Walmart: $1, USPS: $2.10), then deposit via your bank's mobile app. Slightly roundabout but works for online banks.
- **Deposit at a retail partner's register** — some online banks have specific retail partnerships. Check your bank's app for "deposit cash" to see partnered locations.
- **Switch to a bank with ATMs** — if you regularly deposit cash, a bank with physical branches and ATMs (Chase, Bank of America, Wells Fargo) is genuinely more convenient.

## FAQ

**Can you deposit cash at an ATM without a card?**
Usually no. You typically need your debit card to authenticate the transaction before depositing. A few banks allow cardless ATM access via mobile app NFC, but even then you need the app linked to your account.

**Can you deposit cash at any ATM?**
No — only at ATMs owned or operated by your own bank. Third-party network ATMs (Allpoint, MoneyPass, Cirrus) are withdrawal-only.

**Is it safe to deposit cash at an ATM?**
Yes, with normal precautions. Deposit at well-lit ATMs, take your receipt, and confirm the amount on screen before confirming. If the ATM malfunctions after you insert cash, call your bank immediately with your card number and the ATM location — the machine logs the transaction and disputes are resolved with security footage.

**Can you deposit cash at a drive-through ATM?**
Yes, if the drive-through ATM is owned by your bank and has deposit capability. Many bank branch drive-throughs have full-service ATMs. Some drive-throughs use pneumatic tubes to a teller instead.

**What happens if the ATM eats my cash?**
Call your bank's 24/7 customer service line immediately. Give them the ATM location, the time of the transaction, and your account number. Banks investigate disputed ATM transactions using internal logs and camera footage. The resolution typically takes 5–10 business days, and most banks credit the amount provisionally while the investigation is underway.

**Can you deposit coins at an ATM?**
No. ATMs only accept paper currency (bills). To deposit coins, you need a bank teller or a coin-counting machine (Coinstar, bank coin counters at branches).

**Does depositing cash at an ATM count toward my daily limit?**
The cash deposit limit is separate from the withdrawal limit. Your daily ATM cash deposit limit (typically $10,000) is independent of how much you can withdraw.

## Bottom Line

You can deposit cash at an ATM — but only at your own bank's ATMs, not at third-party network ATMs. The process is straightforward: insert card, select deposit, feed in cash, confirm the count, and take your receipt. Funds typically post the same or next business day. If your bank is online-only with no ATM network, you'll need a third-party reload service like Green Dot or a money order + mobile deposit workaround.

For a full comparison of major bank accounts — including ATM networks, fees, and deposit options — see our [Chase vs Bank of America comparison](/compare/chase-vs-bank-of-america).

### Related Comparisons
- [Chase vs Bank of America: Which Bank Wins?](/compare/chase-vs-bank-of-america)
- [Chase vs Wells Fargo: Side-by-Side Comparison](/compare/chase-vs-wells-fargo)
- [Capital One vs Chase: Banking Head-to-Head](/compare/capital-one-vs-chase)
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
  console.log(`DAN-1847: Publishing ${POSTS.length} blog post (can-you-deposit-cash-at-an-atm, 22200/mo)...\n`);

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

  // Add exact-match FAQs to parent comparison pages
  console.log("\n→ Adding exact-match FAQs to parent comparison pages...");

  await addFaqToComparison(
    "chase-vs-bank-of-america",
    "Can you deposit cash at a Chase or Bank of America ATM?",
    "Yes — both Chase and Bank of America ATMs accept cash deposits at their own branded ATMs. You can only deposit at ATMs owned by your bank; third-party network ATMs (Allpoint, MoneyPass) are withdrawal-only. Most modern Chase and BofA ATMs use envelope-free deposits — the machine counts bills automatically. Funds typically post the same or next business day.",
    16
  );

  await addFaqToComparison(
    "chase-vs-wells-fargo",
    "Can you deposit cash at a Chase or Wells Fargo ATM?",
    "Yes — both Chase and Wells Fargo support envelope-free cash deposits at their own branded ATMs. You need your debit card to authenticate, then insert cash and the ATM counts it automatically. Funds typically post same or next business day. Neither bank's ATMs accept cash deposits at third-party network machines.",
    16
  );

  const total = await prisma.blogArticle.count({ where: { status: "published" } });
  console.log(`\nDone: ${success}/${POSTS.length} posts published.`);
  console.log(`Total published blog articles: ${total}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
