/**
 * DAN-1842: Blog post — "Is Cash App Safe? (Risks & Protections)" (14,800/mo, KD 7)
 * Run: npx tsx scripts/publish-dan1842-is-cash-app-safe.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POST = {
  slug: "is-cash-app-safe",
  title: "Is Cash App Safe? Risks, Protections & Safety Tips (2026)",
  excerpt:
    "Cash App is generally safe — it uses 256-bit encryption, biometric authentication, and real-time fraud monitoring. But your Cash App balance is not FDIC-insured by default, and Cash App scams are widespread. This guide covers exactly what protections exist, what risks to watch for, and how to keep your account secure.",
  category: "finance",
  tags: [
    "cash app",
    "p2p payments",
    "mobile payments",
    "app safety",
    "fintech",
    "venmo",
    "paypal",
    "bank security",
  ],
  metaTitle: "Is Cash App Safe? Risks, Protections & Safety Tips (2026)",
  metaDescription:
    "Cash App uses 256-bit encryption and biometric login, but your balance isn't FDIC-insured by default. See Cash App's real risks, Visa zero-liability protections, and 7 safety tips.",
  relatedComparisonSlugs: ["cash-app-vs-venmo"],
  content: `# Is Cash App Safe? Risks, Protections & Safety Tips (2026)

**Cash App is generally safe** — it uses industry-standard 256-bit encryption, supports biometric authentication (Touch ID, Face ID, PIN), and monitors accounts for suspicious activity in real time. It's developed and maintained by Block, Inc. (formerly Square), a publicly traded financial technology company (NYSE: SQ).

That said, Cash App carries specific risks that are worth understanding before you use it. Your standard Cash App balance is **not FDIC-insured** unless you have a Cash App Savings account or a Cash App Card with activated direct deposit. And Cash App scams are among the most commonly reported peer-to-peer payment fraud in the United States.

Here's a complete breakdown of what's safe, what's not, and how to protect yourself.

## Cash App Security Features

### Encryption and Account Protection

| Security Feature | Cash App Status |
|-----------------|-----------------|
| **Encryption** | ✓ 256-bit TLS (bank-grade) |
| **Biometric login** | ✓ Face ID, Touch ID, fingerprint |
| **PIN/passcode** | ✓ Required for all payments |
| **Security lock** | ✓ Auto-lock after inactivity |
| **Two-factor authentication** | ✓ SMS-based verification |
| **Real-time fraud monitoring** | ✓ Block, Inc. security team |
| **Card lock** | ✓ Instant Cash Card freeze via app |

Cash App requires a confirmation step for every payment — either via PIN, Face ID, or Touch ID depending on your device settings. This prevents unauthorized transfers if someone else picks up your phone.

### Is Cash App FDIC-Insured?

This is the most important safety distinction to understand:

| Account Type | FDIC Insured? | Details |
|-------------|---------------|---------|
| **Standard Cash App balance** | ✗ No | Stored in a prepaid account — not a bank deposit |
| **Cash App Savings** | ✓ Yes | Up to $250,000 via Sutton Bank or Wells Fargo |
| **Cash App Card (with direct deposit)** | ✓ Yes | Deposits insured via partner banks |
| **Cash App Card (without direct deposit)** | ✗ No | Prepaid card, not FDIC covered |

**What this means in practice:** If you receive $500 via Cash App and leave it in your Cash App balance without setting up direct deposit or a Savings account, that money is not FDIC-insured. If Block, Inc. were to fail, you might not recover those funds through the federal deposit insurance system.

**How to get FDIC coverage:** Set up direct deposit to your Cash App Card, or transfer funds into the Cash App Savings feature. Both route money through FDIC-member banks (Sutton Bank and Wells Fargo respectively).

### Cash App Card Visa Protections

If you use the **Cash App Card** (the free Visa debit card), it comes with **Visa Zero Liability Protection** — meaning you're not responsible for unauthorized transactions you didn't make or authorize, as long as you report them promptly. This applies to:

- In-store purchases
- Online purchases
- ATM withdrawals (with some exceptions)

This protection does NOT apply to peer-to-peer Cash App transfers you authorize yourself — even if you were scammed into making them.

## Cash App Risks to Know

### 1. Scams Are the Biggest Risk

The Federal Trade Commission (FTC) and Consumer Financial Protection Bureau (CFPB) have flagged Cash App as one of the most commonly impersonated platforms in payment fraud. Common scams include:

**Cash App Friday Scam**: Fake accounts impersonating Cash App's real #CashAppFridays giveaway promotion. They ask you to "verify" your account by sending a small amount first, then promise to send a larger amount back. They don't.

**Cash Flipping Scam**: "Send me $100, I'll flip it into $500." This is always a scam. Cash cannot be multiplied through any Cash App feature.

**Impersonation Scam**: Someone claiming to be Cash App support calls or messages you, says your account is compromised, and asks for your sign-in code or PIN. Cash App support will never ask for your sign-in code.

**Accidental Overpayment Scam**: A "buyer" for something you're selling sends more than agreed via Cash App, asks you to return the difference. Their original payment later turns out to be fraudulent and is reversed — you've already sent real money.

**Fake Job Scam**: Fake employers send a check (or Cash App payment), ask you to send back a portion for "equipment" or "supplies." The initial payment reverses; you lose the amount you sent.

### 2. Payments Are Instant and Mostly Irreversible

Unlike a credit card or even a bank wire with a brief delay, **Cash App payments to individuals are instant and generally cannot be reversed** once accepted by the recipient. If you send money to the wrong person or fall for a scam:

- You can request a refund within the app
- The recipient must choose to accept it
- Cash App support typically cannot force a reversal of authorized peer-to-peer payments

This is a feature, not a bug — instant settlement is what makes the app useful — but it means you have very little recourse if something goes wrong.

### 3. No Credit Card Chargeback Protection for P2P Transfers

When you send money P2P (person-to-person) via Cash App using your linked bank account or Cash App balance, you have no chargeback rights. If you pay with a **credit card** on Cash App, you technically may be able to dispute the charge with your card issuer, but issuers often decline these disputes for authorized transactions.

### 4. Cash App Investing and Bitcoin Carry Market Risk

Cash App allows you to buy stocks and Bitcoin directly in the app. These are subject to standard investment and cryptocurrency market risks — the value can go to zero. Your investment assets are held with Block's brokerage affiliate (not FDIC-insured, but may be SIPC-protected for securities up to $500,000).

## 7 Tips to Stay Safe on Cash App

**1. Enable Security Lock.** Go to Profile → Privacy & Security → Security Lock. This requires your PIN or biometric every time you open the app or make a payment.

**2. Only send money to people you know.** Cash App is designed for payments between people who trust each other — friends, family, small businesses you've verified. It's not a secure payment method for strangers you've met online.

**3. Never share your sign-in code or PIN.** Cash App support (real Cash App) will never ask for this. Anyone asking for your sign-in code via text, call, or social media is attempting fraud.

**4. Verify phone numbers and $Cashtags carefully before sending.** A single digit off sends money to a stranger. Once they accept it, recovery depends entirely on their willingness to return it.

**5. Set up direct deposit to get FDIC protection.** Once you set up direct deposit to your Cash App Card, your balance becomes FDIC-insured through partner banks. This is the easiest way to add deposit insurance to your Cash App balance.

**6. Enable notifications for every transaction.** Go to Profile → Notifications → enable push notifications for all activity. This lets you catch unauthorized transactions immediately.

**7. Lock your Cash App Card instantly if lost.** Go to Cash Card → tap the card image → Disable Card. You can re-enable it once you find it or get a replacement.

## Is Cash App Safer Than Venmo?

Both apps use similar security infrastructure (bank-grade encryption, biometric login, Plaid or direct bank connections), but there are meaningful differences:

| Security Feature | Cash App | Venmo |
|-----------------|----------|-------|
| **Parent company** | Block, Inc. (NYSE: SQ) | PayPal, Inc. (NASDAQ: PYPL) |
| **FDIC insured (standard balance)** | ✗ No (requires direct deposit) | ✗ No |
| **FDIC insured (savings/activated)** | ✓ Yes (with direct deposit or Savings) | ✓ Yes (with activated Venmo debit card) |
| **Biometric authentication** | ✓ Yes | ✓ Yes |
| **PIN requirement** | ✓ Yes | ✓ Yes |
| **Public transaction feed** | ✗ No | ✓ Yes (default — can be turned off) |
| **Buyer/seller protections** | Limited | Limited |
| **Investing features** | ✓ Stocks + Bitcoin | ✗ No |

**Venmo's biggest risk** vs. Cash App: Venmo defaults to a **public transaction feed** that shows your payment activity (names and notes) to all Venmo users. This is a privacy risk if you don't change it to private. Go to Settings → Privacy → set to Private immediately after signing up.

**Cash App's biggest risk** vs. Venmo: Cash App's FDIC situation is more nuanced — many users have a Cash App balance that isn't insured because they haven't set up direct deposit. Venmo's activated debit card triggers FDIC coverage through a simpler flow.

## Cash App Safety: Quick Summary

| | Result |
|--|--------|
| **Safe to use?** | ✓ Generally yes |
| **Bank-grade encryption** | ✓ 256-bit TLS |
| **Biometric login** | ✓ Face ID / Touch ID / PIN |
| **FDIC insured (standard balance)** | ✗ No — requires activation |
| **FDIC insured (with direct deposit)** | ✓ Yes, via partner banks |
| **Visa Zero Liability (Cash Card)** | ✓ Yes, for unauthorized card use |
| **P2P transfers reversible** | ✗ No — instant and final |
| **Scam risk** | ⚠ High — major FTC fraud target |
| **Publicly traded parent** | ✓ Block, Inc. (NYSE: SQ) |

## Frequently Asked Questions

**Is Cash App safe to receive money from strangers?**
Receiving money is generally safe — you're not providing access to your account. However, be cautious of overpayment scams where someone sends extra money and asks you to return the difference. If an unknown sender overpays, wait to ensure the payment doesn't get reversed before returning anything.

**Is Cash App safe to link my bank account?**
Yes. Cash App uses 256-bit encryption and connects to your bank securely. Your bank credentials are not stored by Cash App. However, linking your bank account means Cash App can withdraw funds when you authorize a payment — only link accounts you're comfortable using for that purpose.

**What happens if Cash App is hacked?**
If your Cash App account is compromised, unauthorized payments are very difficult to reverse for P2P transfers. Lock your Cash App Card immediately, change your PIN, contact Cash App support, and notify your linked bank. The sooner you act, the better your chance of limiting losses.

**Is Cash App safe for buying and selling things?**
No — not with strangers. Cash App offers no buyer or seller protection for goods and services. If you pay someone for an item via Cash App and they don't deliver, you have very limited recourse. Use PayPal Goods & Services or a credit card for transactions with unknown parties.

**Does Cash App report to the IRS?**
Yes. If you receive more than $600 in business payments (via the Cash App Business account) in a calendar year, Cash App will issue a 1099-K and report it to the IRS. Personal P2P payments (splitting bills, paying friends back) are not reported.

For a full side-by-side comparison of Cash App and Venmo — fees, limits, features, and which is better for different use cases — see our [Venmo vs Cash App comparison](/compare/cash-app-vs-venmo).

### Related Comparisons
- [Venmo vs Cash App: Full Comparison](/compare/cash-app-vs-venmo)
- [PayPal vs Venmo: Which Is Better?](/compare/paypal-vs-venmo)
- [PayPal vs Cash App: Which Should You Use?](/compare/paypal-vs-cash-app)
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
  console.log(`DAN-1842: Publishing blog post — ${POST.title}...\n`);

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

  // Add exact-match FAQ to parent comparison page (venmo-vs-cash-app)
  console.log("\n→ Adding FAQ to parent comparison page...");
  await addFaqToComparison(
    "cash-app-vs-venmo",
    "Is Cash App safe to use?",
    "Yes — Cash App is generally safe. It uses 256-bit encryption, requires PIN or biometric authentication for every payment, and is backed by Block, Inc. (NYSE: SQ). However, your standard Cash App balance is not FDIC-insured unless you set up direct deposit or a Cash App Savings account. Cash App scams (fake giveaways, cash flipping, impersonation) are widespread — only send money to people you know and trust. The Cash App Card carries Visa Zero Liability protection for unauthorized card transactions.",
    16
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
