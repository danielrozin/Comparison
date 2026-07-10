/**
 * DAN-1851: Blog — Does Home Depot Take Apple Pay? (12100/mo, KD 0)
 * Run: npx tsx scripts/publish-tactical-blogs-dan1851.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "does-home-depot-take-apple-pay",
    title: "Does Home Depot Take Apple Pay?",
    excerpt:
      "Yes — Home Depot accepts Apple Pay in all of its U.S. stores. You can tap to pay at any Home Depot checkout lane using an iPhone or Apple Watch. Apple Pay also works on the Home Depot website and mobile app. Here's exactly how to use it and what to know.",
    category: "finance",
    tags: [
      "home depot",
      "apple pay",
      "contactless payment",
      "tap to pay",
      "mobile payments",
    ],
    metaTitle:
      "Does Home Depot Take Apple Pay? Yes — In-Store, App & Online (2026)",
    metaDescription:
      "Home Depot accepts Apple Pay at all U.S. stores. Tap to pay with iPhone or Apple Watch at checkout. Also works on HomeDepot.com and the mobile app. See full payment details.",
    relatedComparisonSlugs: [
      "home-depot-vs-lowes",
      "apple-pay-vs-google-pay",
      "home-depot-vs-ace-hardware",
    ],
    content: `# Does Home Depot Take Apple Pay?

**Yes — Home Depot accepts Apple Pay** at all of its U.S. store locations. You can use Apple Pay at any checkout lane by tapping your iPhone or Apple Watch on the contactless payment terminal. Apple Pay is also accepted on the Home Depot website and mobile app.

Here's a complete guide to using Apple Pay at Home Depot: in-store, online, and in the app.

## Does Home Depot Accept Apple Pay In-Store?

**Yes.** Home Depot has NFC-enabled (near-field communication) payment terminals at all checkout lanes, including self-checkout. These terminals accept:

- Apple Pay (iPhone and Apple Watch)
- Google Pay
- Samsung Pay
- Other contactless cards (Visa, Mastercard, Amex with tap-to-pay)

You don't need to open any app. Just double-click the side button on your iPhone to bring up Apple Pay, authenticate with Face ID or Touch ID, and hold your phone near the payment terminal.

## How to Use Apple Pay at Home Depot

### In-Store Checkout

1. **Look for the contactless symbol** (four curved lines) on the payment terminal at the register or self-checkout.
2. **Wake your iPhone or Apple Watch** — double-click the side button on Face ID phones, or the home button on Touch ID phones. For Apple Watch, double-click the side button.
3. **Authenticate** — use Face ID, Touch ID, or your Apple Watch passcode.
4. **Hold your device near the reader** — keep it about 1–2 inches from the terminal and wait for the confirmation vibration and checkmark.

The transaction completes in under 2 seconds. You'll see the confirmation on your device and the register.

### Online at HomeDepot.com

Apple Pay works when shopping on HomeDepot.com from Safari on iPhone, iPad, or Mac:

1. Add items to your cart and proceed to checkout.
2. Select **Apple Pay** as your payment method (it appears automatically in Safari if you have a card set up in Wallet).
3. Authenticate with Face ID, Touch ID, or your device passcode.
4. Your shipping address and payment are filled in automatically — no manual entry needed.

### In the Home Depot Mobile App

Apple Pay is available in the Home Depot iOS app:

1. Browse and add items to your cart.
2. At checkout, select **Apple Pay** as your payment method.
3. Authenticate to confirm.

This is the fastest checkout experience on mobile — no card number or CVV entry required.

## Payment Methods Accepted at Home Depot

| Payment Method | In-Store | Online | App |
|---------------|----------|--------|-----|
| **Apple Pay** | ✓ Yes | ✓ Yes | ✓ Yes |
| Google Pay | ✓ Yes | ✓ Yes | — |
| Samsung Pay | ✓ Yes | — | — |
| Credit/debit cards (Visa, MC, Amex, Discover) | ✓ Yes | ✓ Yes | ✓ Yes |
| Home Depot Consumer Credit Card | ✓ Yes | ✓ Yes | ✓ Yes |
| Home Depot Commercial Account | ✓ Yes | ✓ Yes | ✓ Yes |
| PayPal | — | ✓ Yes | ✓ Yes |
| Cash | ✓ Yes | — | — |
| Checks (personal/business) | ✓ Yes | — | — |
| Gift cards | ✓ Yes | ✓ Yes | ✓ Yes |

## Is Apple Pay Accepted at Home Depot Self-Checkout?

**Yes.** Self-checkout kiosks at Home Depot have the same NFC-enabled terminals as staffed registers. The contactless payment process is identical — tap your iPhone or Apple Watch on the terminal to pay.

## Does the Home Depot App Work with Apple Pay?

**Yes.** The Home Depot iOS app supports Apple Pay at checkout. This is particularly useful for:

- **Buy Online, Pick Up In Store (BOPIS)** orders — complete the purchase on your phone and pick up at the store
- **Home delivery** orders — pay with Apple Pay and skip manual card entry
- **Pro Xtra members** — link your Pro account and pay with Apple Pay in a single step

## Is Apple Pay Secure at Home Depot?

Apple Pay is one of the most secure payment methods available:

- **No card number transmitted** — Apple Pay uses a device-specific account number and one-time transaction code. Home Depot's terminal never receives your actual card number.
- **Biometric authentication required** — Face ID, Touch ID, or a device passcode must be used to authorize every transaction.
- **No data stored by the retailer** — Apple Pay transactions can't be reversed engineered to obtain your card number even if Home Depot's payment systems were compromised.

This is more secure than swiping or inserting a physical card.

## Does Home Depot Accept Google Pay?

**Yes.** Home Depot accepts Google Pay (Android) at the same NFC terminals that accept Apple Pay. If you have an Android phone with Google Pay set up, the process is the same: unlock your phone, hold it near the terminal, and the payment completes via NFC.

## Home Depot Pro App and Apple Pay

The **Home Depot Pro** app (for contractors and professional buyers) also supports Apple Pay. Pro Xtra account holders can complete purchases and track spending through the app using Apple Pay.

## What If Apple Pay Doesn't Work at Home Depot?

If Apple Pay fails at a Home Depot terminal, try these steps:

1. **Check your Wallet** — make sure a valid card is set as your default in the Wallet app.
2. **Enable NFC** — Go to Settings and ensure NFC is enabled on your iPhone.
3. **Hold closer to the terminal** — The device needs to be within 1–2 inches of the reader.
4. **Try a different card** — Switch your default card in Apple Wallet if one card is declined.
5. **Ask the cashier to re-enable tap payments** — Occasionally a terminal needs to be reset to accept contactless.
6. **Pay with physical card or cash as backup** — Home Depot accepts all major credit/debit cards if Apple Pay fails.

## Home Depot vs. Lowe's: Apple Pay Acceptance

Both major home improvement chains accept Apple Pay:

| Feature | Home Depot | Lowe's |
|---------|-----------|--------|
| **Apple Pay in-store** | ✓ Yes (all U.S. stores) | ✓ Yes (all U.S. stores) |
| **Apple Pay online** | ✓ Yes (via Safari) | ✓ Yes (via Safari) |
| **Apple Pay in app** | ✓ Yes | ✓ Yes |
| **Google Pay in-store** | ✓ Yes | ✓ Yes |
| **Samsung Pay in-store** | ✓ Yes | ✓ Yes |
| **Store credit card** | Home Depot Consumer Credit Card | Lowe's Advantage Card |

Both stores have fully implemented contactless payments across their networks. For a full comparison of what each retailer offers, see our [Home Depot vs Lowe's comparison](/compare/home-depot-vs-lowes).

## FAQ

**Can I use Apple Pay at Home Depot's tool rental counter?**
Yes — the tool rental counter uses the same payment terminals as the main checkout lanes, which accept Apple Pay.

**Does Home Depot Accept Apple Pay for curbside pickup?**
Yes. If you order online or in-app for curbside pickup and pay with Apple Pay during checkout, the payment is processed at the time of purchase — no additional payment is needed at pickup.

**Can I split payment between Apple Pay and a gift card at Home Depot?**
Yes. Home Depot cashiers can process split payments. You'd pay the gift card balance first (the cashier applies it), then complete the remainder via Apple Pay on the terminal.

**Does Apple Pay work with the Home Depot Pro Xtra rewards?**
Yes. Your Pro Xtra membership is linked to your account, not your payment method. You can still earn and redeem Pro Xtra points when paying with Apple Pay — either by scanning your Pro Xtra barcode before paying, or by using the Home Depot app where your account is already linked.

**Is there a minimum purchase to use Apple Pay at Home Depot?**
No minimum purchase required. Apple Pay works for any transaction amount, including small purchases like screws or batteries.

**Does Home Depot charge extra for using Apple Pay?**
No. Home Depot does not charge a surcharge for Apple Pay or any other contactless payment method. You pay the same price as any other payment method.

**Can I return an Apple Pay purchase at Home Depot?**
Yes. Bring your receipt (email or printed) and the card linked to your Apple Pay. The refund goes back to the original card via the contactless terminal — you may need to tap your phone again to process the refund.

## Bottom Line

Home Depot accepts Apple Pay everywhere — in all U.S. stores (including self-checkout), on HomeDepot.com, and in the iOS app. Tap to pay with your iPhone or Apple Watch for a fast, secure checkout. No card number required, no surcharge, no minimum purchase.

For a full side-by-side of Home Depot vs. Lowe's across pricing, services, and contractor programs, see our [Home Depot vs Lowe's comparison](/compare/home-depot-vs-lowes).

### Related Comparisons
- [Home Depot vs Lowe's: Full Comparison](/compare/home-depot-vs-lowes)
- [Apple Pay vs Google Pay: Which Is Better?](/compare/apple-pay-vs-google-pay)
- [Home Depot vs Ace Hardware: Which Is Right for You?](/compare/home-depot-vs-ace-hardware)
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
    `DAN-1851: Publishing "Does Home Depot Take Apple Pay?" (12100/mo, KD 0)...\n`
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
    "\n→ Adding exact-match FAQ to home-depot-vs-lowes comparison..."
  );

  await addFaqToComparison(
    "home-depot-vs-lowes",
    "Does Home Depot take Apple Pay?",
    "Yes — Home Depot accepts Apple Pay at all U.S. store locations, including self-checkout. You can also use Apple Pay on HomeDepot.com (via Safari) and in the Home Depot iOS app. Tap your iPhone or Apple Watch to the NFC terminal at checkout. No surcharge and no minimum purchase required.",
    10
  );

  await addFaqToComparison(
    "apple-pay-vs-google-pay",
    "Does Home Depot accept Apple Pay?",
    "Yes — Home Depot accepts Apple Pay in all U.S. stores, on its website, and in its mobile app. The NFC-enabled terminals at every checkout lane (including self-checkout) support tap-to-pay with iPhone and Apple Watch.",
    10
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
