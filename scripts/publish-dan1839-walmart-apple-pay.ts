/**
 * DAN-1839: Blog post — "Does Walmart Take Apple Pay?" (49,500/mo, KD 11)
 * Run: npx tsx scripts/publish-dan1839-walmart-apple-pay.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POST = {
  slug: "does-walmart-take-apple-pay",
  title: "Does Walmart Take Apple Pay?",
  excerpt:
    "No — Walmart does not accept Apple Pay in stores or online as of 2026. Walmart exclusively uses its own Walmart Pay system and blocks NFC-based wallets like Apple Pay and Google Pay. Here's why, what payment methods Walmart does accept, and which major retailers do take Apple Pay.",
  category: "retail",
  tags: ["walmart", "apple pay", "payment methods", "contactless payment", "mobile wallet"],
  metaTitle: "Does Walmart Take Apple Pay? No — Here's Why (2026)",
  metaDescription:
    "Walmart does not accept Apple Pay in stores or on Walmart.com. Walmart uses its own Walmart Pay app. See what Walmart does accept and which stores do take Apple Pay.",
  relatedComparisonSlugs: ["amazon-vs-walmart"],
  content: `# Does Walmart Take Apple Pay?

**No — Walmart does not accept Apple Pay.** As of 2026, Walmart refuses Apple Pay (and Google Pay) in all its U.S. stores and on Walmart.com. Walmart deliberately blocks NFC-based contactless payment wallets because it operates its own in-house payment system: **Walmart Pay**.

This policy has been in place since Apple Pay launched in 2014 and shows no signs of changing.

## Why Doesn't Walmart Accept Apple Pay?

The reason is strategic, not technical. Walmart is the largest shareholder in **MCX (Merchant Customer Exchange)**, a retail consortium that created **CurrentC** — a competitor to Apple Pay. Even after CurrentC failed to gain traction, Walmart doubled down with its own Walmart Pay system.

The key reasons Walmart blocks Apple Pay:

| Reason | Explanation |
|--------|-------------|
| **Avoids transaction fees** | Apple charges ~0.15% on credit transactions processed via Apple Pay |
| **Customer data control** | Apple Pay anonymizes purchases; Walmart Pay ties every transaction to a customer profile |
| **Loyalty integration** | Walmart Pay links directly to Walmart+ rewards and Walmart Cash |
| **Walmart Pay investment** | Having built its own system, Walmart protects that investment by blocking NFC wallets |

Walmart's NFC terminals are physically configured to reject Apple Pay signals even though the hardware is technically capable of accepting them.

## What Payment Methods Does Walmart Accept?

While Walmart rejects Apple Pay, it accepts nearly every other payment method:

### In-Store Payment Methods

| Payment Type | Accepted? |
|-------------|-----------|
| **Visa, Mastercard, Discover, Amex** | ✓ Yes |
| **Debit cards (chip + PIN)** | ✓ Yes |
| **Walmart Pay** (via Walmart app) | ✓ Yes — Walmart's preferred method |
| **Walmart Gift Cards** | ✓ Yes |
| **Cash** | ✓ Yes |
| **Checks (personal/traveler's)** | ✓ Yes |
| **EBT / SNAP** | ✓ Yes |
| **PayPal** | ✓ Yes (via Walmart Pay) |
| **Venmo** | ✓ Yes (via Walmart Pay) |
| **Apple Pay** | ✗ No |
| **Google Pay** | ✗ No |
| **Samsung Pay** | ✗ No |
| **Cash App Pay** | ✗ No |

### Online (Walmart.com) Payment Methods

| Payment Type | Accepted? |
|-------------|-----------|
| **Visa, Mastercard, Discover, Amex** | ✓ Yes |
| **Walmart Pay / Walmart account balance** | ✓ Yes |
| **PayPal** | ✓ Yes |
| **Affirm (Buy Now Pay Later)** | ✓ Yes |
| **Walmart Gift Cards** | ✓ Yes |
| **EBT** | ✓ Yes (eligible grocery items) |
| **Apple Pay** | ✗ No |

## What Is Walmart Pay?

Walmart Pay is Walmart's proprietary mobile payment system built into the Walmart app. It's available for iOS and Android — but it's not the same as Apple Pay.

**How Walmart Pay works:**
1. Download the Walmart app (free)
2. Add a payment method: credit card, debit card, prepaid card, PayPal, or Venmo
3. At checkout, open the app and tap **Walmart Pay**
4. Scan the QR code on the register screen
5. Payment processes instantly

**Key advantages of Walmart Pay:**
- Links to your Walmart account for receipt tracking
- Automatically applies Walmart Cash rewards
- Connects to Walmart+ membership benefits
- Works at all Walmart checkout lanes including self-checkout
- Supports PayPal and Venmo as funding sources (so iPhone users who use PayPal can still go contactless)

The main limitation: you must have the Walmart app installed and a Walmart account. Unlike Apple Pay, it doesn't work outside of Walmart stores.

## Does Sam's Club Accept Apple Pay?

No. **Sam's Club** (owned by Walmart) also does not accept Apple Pay. Sam's Club uses the Sam's Club app for mobile payments — similar to Walmart's approach.

## Does Walmart+ Accept Apple Pay?

**No.** Walmart+ is Walmart's membership program, and purchases made at Walmart with a Walmart+ membership still run through the same in-store payment system. Apple Pay is not accepted regardless of your Walmart+ membership status.

For Walmart.com deliveries through Walmart+, Apple Pay is also not available as a checkout option online.

## Which Major Retailers DO Accept Apple Pay?

If Apple Pay is important to your shopping experience, these major retailers fully support it:

| Retailer | Apple Pay in Stores | Apple Pay Online |
|----------|--------------------|--------------------|
| **Target** | ✓ Yes | ✓ Yes |
| **Costco** | ✓ Yes | ✓ Yes |
| **Whole Foods / Amazon Fresh** | ✓ Yes | ✓ Yes |
| **Kroger / Kroger family** | ✓ Yes | ✓ Yes |
| **Trader Joe's** | ✓ Yes | N/A |
| **Best Buy** | ✓ Yes | ✓ Yes |
| **Home Depot** | ✓ Yes | ✓ Yes |
| **Lowe's** | ✓ Yes | ✓ Yes |
| **CVS** | ✓ Yes | ✓ Yes |
| **Walgreens** | ✓ Yes | ✓ Yes |
| **McDonald's** | ✓ Yes | ✓ Yes |
| **Starbucks** | ✓ Yes | ✓ Yes |
| **Walmart** | ✗ No | ✗ No |

**Target is the most direct alternative** for Walmart shoppers who prefer Apple Pay — it sells most of the same product categories and accepts Apple Pay in every store.

## Will Walmart Ever Accept Apple Pay?

There's no indication Walmart plans to accept Apple Pay. In fact, Walmart has been doubling down on Walmart Pay as a key component of its retail strategy. With Walmart Pay now linked to Walmart+, Walmart Cash, and customer purchase histories, Walmart's incentive to block NFC wallets has only grown stronger over time.

Walmart is one of the last major U.S. retailers to actively block Apple Pay. Apple has reportedly been in discussions with Walmart in the past, but no deal has been reached. Apple's 0.15% transaction fee model is a fundamental sticking point for a retailer processing hundreds of billions of dollars in annual transactions.

## Workarounds If You Want to Pay Contactlessly at Walmart

If you prefer not to swipe a physical card at Walmart:

1. **Use Walmart Pay** — It's the closest experience to Apple Pay at Walmart. Download the Walmart app, add your card (Visa, Mastercard, Amex, PayPal), and scan the QR code at checkout.

2. **Link PayPal to Walmart Pay** — If you use Apple Pay via your bank account and don't want to enter a card number into the Walmart app, linking PayPal to Walmart Pay adds one layer of separation.

3. **Use a chip+PIN debit card** — Physical chip cards still offer moderate fraud protection at checkout.

4. **Shop at Target or Costco instead** — Both accept Apple Pay and carry similar general merchandise.

## FAQ

**Does Walmart accept Apple Pay at self-checkout?**
No. Walmart self-checkout lanes use the same NFC-blocked terminals as manned lanes. Apple Pay does not work at any Walmart self-checkout.

**Why does Walmart block Apple Pay if the hardware supports NFC?**
Walmart intentionally configures its NFC terminals to reject Apple Pay, Google Pay, and Samsung Pay. The decision is financial and strategic — Walmart wants transactions processed through Walmart Pay where it retains customer data and avoids Apple's transaction fee.

**Does Walmart.com accept Apple Pay for online grocery pickup?**
No. Walmart.com and the Walmart pickup/delivery checkout do not support Apple Pay. Accepted online methods include credit/debit cards, PayPal, Affirm, and Walmart Pay.

**Does Walmart accept Google Pay?**
No. Like Apple Pay, Google Pay (and Samsung Pay) are blocked at all Walmart locations.

**Is Walmart Pay safe to use?**
Yes. Walmart Pay uses tokenization — your actual card number is never transmitted during a transaction. It's protected by Walmart's security infrastructure and your phone's biometric/PIN lock.

## Bottom Line

Walmart does not take Apple Pay and has no plans to change this policy. Walmart Pay (via the Walmart app) is the only contactless payment option at Walmart, and it's built specifically to keep customer transactions — and data — within Walmart's ecosystem.

If Apple Pay is essential to your shopping experience, Target, Costco, and Whole Foods are the strongest Walmart alternatives that support it. For a full side-by-side comparison of Amazon and Walmart — pricing, delivery, payment options, and which retailer wins by category — see our [Amazon vs Walmart comparison](/compare/amazon-vs-walmart).

### Related Comparisons
- [Amazon vs Walmart: Price, Speed & Selection](/compare/amazon-vs-walmart)
- [Walmart vs Target: Which Retailer Wins?](/compare/walmart-vs-target)
- [Costco vs Walmart: Bulk vs. Convenience](/compare/costco-vs-walmart)
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
  console.log(`DAN-1839: Publishing blog post — ${POST.title}...\n`);

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
    "amazon-vs-walmart",
    "Does Walmart accept Apple Pay?",
    "No — Walmart does not accept Apple Pay in any of its stores or on Walmart.com. Walmart actively blocks NFC-based payment wallets (Apple Pay, Google Pay, Samsung Pay) and instead uses its own Walmart Pay system, available through the Walmart app. Walmart Pay supports credit/debit cards, PayPal, and Venmo as funding sources.",
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
