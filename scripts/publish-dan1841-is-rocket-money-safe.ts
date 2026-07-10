/**
 * DAN-1841: Blog post — "Is Rocket Money Safe? (App Review + Security)" (22,200/mo, KD 12)
 * Run: npx tsx scripts/publish-dan1841-is-rocket-money-safe.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POST = {
  slug: "is-rocket-money-safe",
  title: "Is Rocket Money Safe? (App Review + Security Guide for 2026)",
  excerpt:
    "Yes — Rocket Money is safe to use. It uses 256-bit bank-level encryption, read-only access to your accounts, and is backed by Rocket Companies (NYSE: RKT). This guide covers exactly what data it accesses, how it protects your information, what it costs, and whether it's worth it.",
  category: "finance",
  tags: [
    "rocket money",
    "budgeting app",
    "personal finance",
    "app safety",
    "subscription manager",
    "truebill",
    "bank security",
  ],
  metaTitle: "Is Rocket Money Safe? App Review + Security Guide (2026)",
  metaDescription:
    "Rocket Money is safe — 256-bit encryption, read-only bank access, and backed by Rocket Companies. See what data it collects, what it costs, and if it's worth it in 2026.",
  relatedComparisonSlugs: ["paypal-vs-venmo"],
  content: `# Is Rocket Money Safe? (App Review + Security Guide for 2026)

**Yes — Rocket Money is safe to use.** It employs 256-bit SSL encryption (the same standard used by major banks), requests only read-only access to your financial accounts, and is owned by Rocket Companies (NYSE: RKT) — one of the largest and most regulated financial services companies in the United States. Rocket Money does not store your bank credentials; it connects through Plaid, an industry-standard data aggregator.

That said, connecting any app to your bank accounts carries inherent risks, and it's worth understanding exactly what Rocket Money accesses, how it protects your data, and whether its privacy trade-offs are worth the benefits.

## What Is Rocket Money?

Rocket Money (formerly Truebill) is a personal finance app launched in 2015 and acquired by Rocket Companies in 2021 for $1.275 billion. It helps users:

- **Track spending** across all linked accounts in one dashboard
- **Cancel unwanted subscriptions** (its standout feature)
- **Negotiate lower bills** on your behalf (cable, internet, phone)
- **Monitor credit score** (via TransUnion)
- **Set budgets** and savings goals
- **Manage debt** and track net worth

As of 2026, Rocket Money has over 5 million subscribers and has reportedly helped users cancel over $500 million in unwanted subscriptions.

## Is Rocket Money Safe? Security Breakdown

### Encryption and Data Transmission

| Security Feature | Rocket Money Status |
|-----------------|---------------------|
| **SSL encryption** | ✓ 256-bit (bank-grade) |
| **Data at rest** | ✓ Encrypted |
| **Credential storage** | ✓ Not stored — uses Plaid token |
| **Two-factor authentication** | ✓ Available |
| **SOC 2 Type II compliance** | ✓ Audited annually |

Rocket Money connects to your bank through **Plaid**, which means your actual bank username and password are never transmitted to or stored by Rocket Money. Instead, Plaid issues a secure token granting limited access. This is the same infrastructure used by apps like Venmo, Robinhood, and Coinbase.

### What Access Does Rocket Money Have to Your Bank Account?

**Read-only.** Rocket Money cannot move money, initiate transfers, or make payments from your accounts. It can only view:

- Transaction history
- Account balances
- Account type and institution name

The only exception: if you opt into the **Smart Savings** feature, Rocket Money can move small amounts of money into a Rocket Money savings account on your behalf — but only after you explicitly set this up and authorize it.

### Is Rocket Money FDIC Insured?

Rocket Money itself is not a bank and does not hold your money (except for Smart Savings deposits). The **Smart Savings** account is held at Coastal Community Bank, which is FDIC-insured up to $250,000 per depositor.

### Who Owns Rocket Money?

Rocket Money is owned by **Rocket Companies, Inc.** (NYSE: RKT), headquartered in Detroit, Michigan. Rocket Companies is the parent of Rocket Mortgage (the largest U.S. mortgage lender), Rocket Loans, and Rocket Solar. As a publicly traded company, Rocket Companies is subject to SEC oversight and publicly discloses its financials and data practices.

This is a meaningful trust signal — Rocket Money is not a startup of unknown backing. It operates under the compliance and reputational standards of a major publicly traded financial institution.

## What Data Does Rocket Money Collect?

Being transparent about data collection is important. Here's what Rocket Money collects:

| Data Type | Collected | Purpose |
|-----------|-----------|---------|
| **Bank transaction history** | ✓ Yes | Budget tracking, subscription detection |
| **Account balances** | ✓ Yes | Net worth calculation |
| **Name, email, phone** | ✓ Yes | Account identity |
| **Credit score data** | ✓ Yes (with permission) | Credit monitoring feature |
| **Device/usage data** | ✓ Yes | App improvement, analytics |
| **Bank login credentials** | ✗ No | Not stored — Plaid token only |
| **Social Security Number** | ✓ Last 4 digits (for credit check) | Credit monitoring verification |

Rocket Money's privacy policy states it does not sell your personal information to third parties. However, like most free-tier apps, it does share aggregated, anonymized spending data for analytics and marketing purposes. If this is a concern, review their full privacy policy before signing up.

## Is Rocket Money Free?

Rocket Money has a **free tier** and a **premium tier**:

| Feature | Free | Premium ($6–$12/mo) |
|---------|------|---------------------|
| Spending tracking | ✓ | ✓ |
| Subscription detection | ✓ (limited) | ✓ (full) |
| Bill negotiation | ✓ (40% success fee) | ✓ (40% success fee) |
| Budgeting | ✓ | ✓ |
| Credit score monitoring | ✓ | ✓ |
| Custom budget categories | ✗ | ✓ |
| Smart Savings | ✗ | ✓ |
| Cancellation concierge | ✗ | ✓ |
| Priority chat support | ✗ | ✓ |
| Net worth tracking | ✓ | ✓ |

The **free tier is genuinely useful** for subscription detection and basic budgeting. The premium tier ($6–$12/mo, you choose the price) unlocks automated cancellations and savings automation.

**Bill negotiation pricing:** Rocket Money charges 40% of first-year savings if it successfully negotiates a lower rate for a bill. This is separate from the monthly subscription and is only charged on success.

## Common Safety Concerns — Answered

### "Is Rocket Money a Scam?"

No. Rocket Money is owned by Rocket Companies (a Fortune 500 company), has processed billions of dollars in subscription cancellations and bill negotiations, and is reviewed positively by the CFPB's consumer complaint database (relatively few complaints for its user base size).

However, **be aware of fake "Rocket Money" apps** in app stores. Only download from the official App Store or Google Play listing linked from rocketmoney.com.

### "What Happens if Rocket Money Gets Hacked?"

Because Rocket Money uses Plaid tokens rather than storing credentials, a Rocket Money data breach would expose:
- Your email address
- Your name and phone number
- Your transaction history and account balances
- Possibly your credit score data

It would NOT expose your bank login credentials or allow fraudulent transfers (since access is read-only). You should still revoke Plaid access and change passwords if a breach occurs.

You can revoke Rocket Money's access to your accounts at any time through:
1. Your bank's "connected apps" or "third-party access" settings
2. Plaid's dashboard at [my.plaid.com](https://my.plaid.com) → revoke Rocket Money

### "Does Rocket Money Sell My Data?"

Rocket Money's privacy policy states it does not sell personal data to third parties. It does share data with:
- **Plaid** (bank connectivity)
- **TransUnion** (credit monitoring)
- **Analytics providers** (anonymized usage data)
- **Rocket Companies affiliates** (for internal product improvement)

If you have a Rocket Mortgage or other Rocket Companies account, there may be data sharing across their platform ecosystem.

### "Can Rocket Money Empty My Bank Account?"

No — unless you have explicitly enabled and authorized the Smart Savings feature. Standard read-only bank connections cannot initiate transfers. If you're concerned, review your bank's "connected apps" section to see exactly what permissions Rocket Money/Plaid has been granted, and adjust or revoke as needed.

## Rocket Money vs. Competitors: Safety Comparison

| App | Bank Access | Credential Storage | Parent Company | Data Sold? |
|-----|------------|-------------------|----------------|------------|
| **Rocket Money** | Read-only via Plaid | No | Rocket Companies (public) | No |
| **YNAB** | Read-only via Plaid | No | ynab.com (private) | No |
| **Copilot** | Read-only via Plaid | No | Private startup | No |
| **Monarch Money** | Read-only via Plaid | No | Private startup | No |
| **Personal Capital** | Read-only via Plaid | No | Empower (private equity) | Limited |
| **Mint (discontinued)** | Read-only via Plaid | No | Intuit (public) | Limited |

All major budgeting apps use the same underlying Plaid infrastructure and read-only access model. The key differentiator is **who owns the app** and how they monetize your data — Rocket Money's backing by a publicly traded, regulated financial company is a meaningful trust advantage compared to venture-backed startups.

## Is Rocket Money Worth It?

**Yes, for most people** — especially those who:
- Suspect they're paying for forgotten subscriptions
- Want a simple overview of all accounts in one place
- Need help tracking spending without building spreadsheets
- Want passive bill negotiation (Rocket Money handles the phone calls)

**The free tier is the best starting point.** It identifies subscriptions and gives you spending visibility with no commitment. Upgrade to Premium only if you want automated cancellations or Smart Savings.

**It may not be worth it if:**
- You already use a full-featured budgeting app (YNAB, Copilot, Monarch)
- You're uncomfortable connecting financial accounts to third-party apps
- You have very few subscriptions and already track spending manually

## Rocket Money Security: Quick Summary

| | Result |
|--|--------|
| **Safe to use?** | ✓ Yes |
| **Bank-grade encryption** | ✓ 256-bit SSL |
| **Stores bank password** | ✗ No — Plaid token only |
| **Read-only access** | ✓ (unless Smart Savings enabled) |
| **Publicly traded parent** | ✓ Rocket Companies (NYSE: RKT) |
| **FDIC insured** | ✓ Smart Savings deposits only |
| **Sells personal data** | ✗ No (per privacy policy) |
| **Can move your money** | ✗ Only with Smart Savings opt-in |

## Frequently Asked Questions

**Is Rocket Money the same as Truebill?**
Yes — Truebill was rebranded to Rocket Money in 2022 after Rocket Companies acquired it. The app and its features are identical; only the name changed.

**Can I trust Rocket Money with my bank account information?**
Yes. Rocket Money uses Plaid (bank-grade infrastructure) and only gets read-only access to your account data. It never stores your bank username or password. Over 5 million users connect their accounts without incident.

**How do I delete my Rocket Money account?**
Go to Settings → Account → Delete Account inside the Rocket Money app. This removes your account and data from their servers. Separately, revoke Plaid access through your bank's connected apps settings or at my.plaid.com to fully disconnect account access.

**Does Rocket Money work with all banks?**
Rocket Money works with most major U.S. banks and credit unions via Plaid. Smaller regional institutions may not be supported. If your bank isn't found, you can add accounts manually.

**Is Rocket Money Premium worth the $6–$12/month?**
The premium tier is worth it if you use the cancellation concierge feature regularly or want automated Smart Savings. The bill negotiation feature pays for itself if it successfully lowers one bill — the 40% success fee is only charged when they save you money.

For a full side-by-side comparison of digital payment apps and budgeting tools, see our [PayPal vs Venmo comparison](/compare/paypal-vs-venmo) to understand how payment platforms handle your financial data differently.

### Related Comparisons
- [PayPal vs Venmo: Full Comparison](/compare/paypal-vs-venmo)
- [Rocket Mortgage vs Better.com](/compare/better-com-vs-rocket-mortgage)
- [Rocket Mortgage vs Quicken Loans](/compare/quicken-loans-vs-rocket-mortgage)
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
  console.log(`DAN-1841: Publishing blog post — ${POST.title}...\n`);

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

  // Add exact-match FAQ to parent comparison page (paypal-vs-venmo)
  console.log("\n→ Adding FAQ to parent comparison page...");
  await addFaqToComparison(
    "paypal-vs-venmo",
    "Is Rocket Money safe to link to my bank account?",
    "Yes — Rocket Money uses 256-bit encryption and connects to bank accounts via Plaid, granting read-only access only. Rocket Money never stores your bank username or password. It's owned by Rocket Companies (NYSE: RKT), a publicly traded financial services company. Over 5 million users connect their accounts, and the app does not sell your personal data. If you want to revoke access, you can do so through your bank's connected-apps settings or at my.plaid.com.",
    15
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
