/**
 * DAN-1857: Blog post — "Does Target Accept Apple Pay?" (27,100/mo, KD 5)
 * Run: npx tsx scripts/publish-dan1857-target-apple-pay.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POST = {
  slug: "does-target-accept-apple-pay",
  title: "Does Target Accept Apple Pay?",
  excerpt:
    "Yes — Target accepts Apple Pay in all its U.S. stores and on Target.com as of 2026. Target's NFC-enabled terminals support Apple Pay, Google Pay, and Samsung Pay at every checkout lane, including self-checkout. Here's exactly how to use Apple Pay at Target and what other payment methods Target accepts.",
  category: "retail",
  tags: ["target", "apple pay", "payment methods", "contactless payment", "mobile wallet"],
  metaTitle: "Does Target Accept Apple Pay? Yes — Here's How (2026)",
  metaDescription:
    "Target accepts Apple Pay in all stores and on Target.com. Tap to pay at any checkout lane or self-checkout. See all Target payment methods and how to use Apple Pay in-store.",
  relatedComparisonSlugs: ["walmart-vs-target"],
  content: `# Does Target Accept Apple Pay?

**Yes — Target accepts Apple Pay.** As of 2026, Target supports Apple Pay at every checkout lane in all U.S. stores, at self-checkout, and on Target.com and the Target app. Target's NFC terminals are enabled for all major contactless wallets, including Apple Pay, Google Pay, and Samsung Pay.

This makes Target one of the most Apple Pay-friendly major retailers in the United States — a direct contrast to Walmart, which actively blocks Apple Pay.

## How to Use Apple Pay at Target

Using Apple Pay at Target is fast and works exactly the same as at any other NFC-enabled retailer:

### In-Store (iPhone or Apple Watch)

1. **Look for the contactless payment symbol** on the checkout terminal — it looks like a WiFi icon on its side (↗)
2. **Double-click the side button** on your iPhone (or double-click the Digital Crown on Apple Watch)
3. **Hold your device near the terminal** — within 1–2 inches of the NFC reader
4. **Authenticate** with Face ID, Touch ID, or your passcode
5. **Payment completes** in under 2 seconds — you'll feel a vibration and see a checkmark

The Apple Pay tap works at every staffed checkout lane and at all Target self-checkout kiosks.

### On Target.com (Online)

1. Add items to your cart and proceed to checkout
2. Select **Apple Pay** as your payment method
3. Confirm your shipping address and authenticate with Face ID or Touch ID
4. Order is placed instantly — no card number entry required

### In the Target App

1. Add items to your cart in the Target app
2. At checkout, select **Apple Pay**
3. Authenticate with Face ID or Touch ID
4. Payment goes through immediately

Apple Pay also works for **Target Drive Up** and **Target Order Pickup** orders placed through the app.

## What Payment Methods Does Target Accept?

Target accepts a wide range of payment methods in-store and online:

### In-Store Payment Methods

| Payment Type | Accepted? |
|-------------|-----------|
| **Visa, Mastercard, Discover, Amex** | ✓ Yes |
| **Debit cards (chip + PIN)** | ✓ Yes |
| **Apple Pay** | ✓ Yes |
| **Google Pay** | ✓ Yes |
| **Samsung Pay** | ✓ Yes |
| **Target Circle Card (RedCard) — debit** | ✓ Yes (5% off every purchase) |
| **Target Circle Card (RedCard) — credit** | ✓ Yes (5% off every purchase) |
| **Target Gift Cards** | ✓ Yes |
| **Cash** | ✓ Yes |
| **Personal checks** | ✓ Yes |
| **EBT / SNAP** | ✓ Yes (eligible grocery items) |
| **WIC** | ✓ Yes (select stores) |
| **PayPal** | ✗ No (not accepted in-store) |

### Online (Target.com) Payment Methods

| Payment Type | Accepted? |
|-------------|-----------|
| **Visa, Mastercard, Discover, Amex** | ✓ Yes |
| **Apple Pay** | ✓ Yes |
| **Google Pay** | ✓ Yes |
| **Target Circle Card (RedCard)** | ✓ Yes |
| **Target Gift Cards** | ✓ Yes |
| **Affirm (Buy Now Pay Later)** | ✓ Yes |
| **PayPal** | ✓ Yes |
| **EBT** | ✓ Yes (eligible grocery items) |

## Does Target Self-Checkout Accept Apple Pay?

**Yes.** Every Target self-checkout kiosk supports Apple Pay. The NFC reader is built into the payment terminal — just hold your iPhone or Apple Watch near the reader after scanning your items and authenticate as usual.

Self-checkout is often the fastest way to use Apple Pay at Target because you control the pace of scanning.

## Does Target Circle Work with Apple Pay?

**Yes.** You can use both Target Circle rewards and Apple Pay in the same transaction.

Here's the recommended checkout order:
1. Open the **Target app** and tap **Wallet** to show your Target Circle barcode
2. Have the cashier (or scan it yourself at self-checkout) scan your Target Circle barcode first
3. Then tap to pay with Apple Pay

This applies your Target Circle coupons, earns circle earnings, and completes payment — all without a physical card.

## Target RedCard vs. Apple Pay: Which Is Better?

If you shop at Target frequently, you may wonder whether to use Apple Pay (linked to your bank card or credit card) or the Target Circle Card (RedCard).

| Feature | Apple Pay (linked to your bank/credit card) | Target Circle Card (RedCard) |
|---------|---------------------------------------------|------------------------------|
| **Discount at Target** | 0% (depends on your linked card) | **5% off every purchase** |
| **Works everywhere** | ✓ Yes — all NFC-enabled stores | ✗ No — Target only |
| **Rewards on top** | Points from your linked card | Target Circle earnings |
| **Security** | Token-based — no card number transmitted | Standard card |
| **Application required** | No | Yes (credit) / Easy setup (debit) |

**Recommendation:** Link your Target Circle Card debit RedCard to Apple Pay. You get the 5% Target discount AND the convenience of tap-to-pay. To do this:
1. Apply for the Target Circle Card debit at Target.com or in-store
2. Add the card to Apple Wallet
3. Tap to pay at checkout — the 5% discount applies automatically

## When Did Target Start Accepting Apple Pay?

Target rolled out Apple Pay support across all U.S. stores in **October 2019** — five years after Apple Pay launched nationally. Before 2019, Target's older payment terminals did not support NFC contactless payments. The 2019 terminal upgrade also added Google Pay and Samsung Pay simultaneously.

Before the upgrade, Target processed all payments through mag-stripe and chip-only readers. The new terminals brought Target in line with most other major U.S. retailers.

## Target vs. Walmart: Apple Pay Acceptance

The biggest payment difference between Target and Walmart is Apple Pay:

| Feature | Target | Walmart |
|---------|--------|---------|
| **Apple Pay in-store** | ✓ Yes | ✗ No |
| **Apple Pay online** | ✓ Yes | ✗ No |
| **Google Pay** | ✓ Yes | ✗ No |
| **Proprietary wallet** | Target app (optional) | Walmart Pay (required for contactless) |
| **Contactless without an app** | ✓ Yes (via Apple/Google Pay) | ✗ No |

If Apple Pay is your primary payment method, Target is the better choice over Walmart for comparable everyday shopping.

## FAQ

**Does Target accept Apple Pay at all locations?**
Yes. Apple Pay is accepted at all Target stores in the United States, including Target Express locations. All stores completed the NFC terminal upgrade and support contactless payments.

**Can I use Apple Pay at Target self-checkout?**
Yes. All Target self-checkout kiosks have NFC readers that accept Apple Pay. Tap your iPhone or Apple Watch to the reader on the payment terminal and authenticate with Face ID, Touch ID, or your passcode.

**Does Apple Pay work at Target Drive Up?**
Yes. When you place a Drive Up order through the Target app, you pay in the app during checkout. Select Apple Pay as your payment method, authenticate, and your order is paid before you arrive.

**Can I use my Target RedCard with Apple Pay?**
Yes. You can add the Target Circle Card debit or credit to Apple Wallet and use it to tap to pay. The 5% RedCard discount applies automatically when you pay with your RedCard through Apple Pay.

**Does Apple Pay work with Target Circle coupons?**
Yes, but you need to scan your Target Circle barcode separately first. Show your Target Circle barcode (in the Target app Wallet) before tapping Apple Pay so your coupons and earnings are applied.

**Does Target.com accept Apple Pay?**
Yes. At checkout on Target.com and in the Target app, you can select Apple Pay as your payment method and complete the purchase with Face ID or Touch ID — no card number needed.

**Does Target accept Google Pay and Samsung Pay?**
Yes. All three major contactless wallets — Apple Pay, Google Pay, and Samsung Pay — work at Target in-store and, for Android users, via Google Pay online at Target.com.

## Bottom Line

Target accepts Apple Pay everywhere — in stores, at self-checkout, online, in the Target app, and for Drive Up and Order Pickup. Target has supported Apple Pay since 2019 and its NFC terminals work with all major contactless wallets.

For the best of both worlds, link your Target Circle Card (RedCard) to Apple Wallet: you get the 5% Target discount on every purchase plus the speed and security of Apple Pay.

For a full side-by-side comparison of Walmart and Target — pricing, perks, shopping experience, and which retailer wins overall — see our [Walmart vs Target comparison](/compare/walmart-vs-target).

### Related Comparisons
- [Walmart vs Target: Which Retailer Is Better?](/compare/walmart-vs-target)
- [Amazon vs Target: Which Is Right for You?](/compare/amazon-vs-target)
- [Costco vs Target: Bulk vs Everyday Shopping](/compare/costco-vs-target)
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
  console.log(`DAN-1857: Publishing blog post — ${POST.title}...\n`);

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
    "walmart-vs-target",
    "Does Target accept Apple Pay?",
    "Yes — Target accepts Apple Pay in all U.S. stores and on Target.com. Target's NFC terminals support Apple Pay, Google Pay, and Samsung Pay at every checkout lane including self-checkout. You can also use Apple Pay in the Target app for Drive Up and Order Pickup orders. For the best deal, link your Target Circle Card (RedCard) to Apple Wallet to get the 5% RedCard discount plus tap-to-pay convenience.",
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
