/**
 * DAN-1844: Blog post — "Does Home Depot Take Apple Pay?" (12,100/mo, KD 0)
 * Run: npx tsx scripts/publish-dan1844-home-depot-apple-pay.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POST = {
  slug: "does-home-depot-take-apple-pay",
  title: "Does Home Depot Take Apple Pay?",
  excerpt:
    "Yes — Home Depot accepts Apple Pay in all U.S. stores and on the Home Depot app. Home Depot's NFC-enabled checkout terminals accept Apple Pay, Google Pay, Samsung Pay, and other contactless wallets. Here's how to use it, what else Home Depot accepts, and how it compares to Lowe's.",
  category: "retail",
  tags: ["home depot", "apple pay", "payment methods", "contactless payment", "mobile wallet"],
  metaTitle: "Does Home Depot Take Apple Pay? Yes — How to Use It (2026)",
  metaDescription:
    "Home Depot accepts Apple Pay in all U.S. stores and on the Home Depot app. Tap to pay at NFC-enabled registers. See all payment methods Home Depot accepts in 2026.",
  relatedComparisonSlugs: ["home-depot-vs-lowes"],
  content: `# Does Home Depot Take Apple Pay?

**Yes — Home Depot accepts Apple Pay.** All U.S. Home Depot stores have NFC-enabled checkout terminals that accept Apple Pay, Google Pay, Samsung Pay, and other contactless wallets. You can also use Apple Pay when checking out through the Home Depot mobile app.

This makes Home Depot one of the more payment-friendly major retailers — a direct contrast to Walmart, which actively blocks Apple Pay and NFC wallets.

## How to Use Apple Pay at Home Depot

### In-Store

1. **Look for the contactless payment symbol** on the terminal — it looks like a sideways Wi-Fi icon (📶). All Home Depot register terminals display it.
2. **Wake your iPhone** and double-click the side button (Face ID) or rest your finger on the home button (Touch ID).
3. **Hold your iPhone near the terminal** — keep it within 1–2 inches of the contactless reader.
4. **Authorize with Face ID, Touch ID, or your passcode** — payment confirms in seconds.
5. **Done** — the terminal shows a checkmark or "Approved."

**Apple Watch users**: Double-click the side button on your Apple Watch, select the card you want to use, and hold the display face near the reader.

### On the Home Depot App

Home Depot's mobile app supports Apple Pay at checkout:

1. Add items to your cart in the Home Depot app
2. Proceed to checkout
3. Select **Apple Pay** as your payment method
4. Confirm with Face ID or Touch ID

The app also supports Buy Online, Pick Up In Store (BOPIS) — you can pay via Apple Pay in the app and pick up your order at the pro desk or curbside.

### On HomeDepot.com (Web)

Apple Pay is not currently available as a checkout option on the desktop version of HomeDepot.com. Use the mobile app for Apple Pay, or pay via credit/debit card on the website.

## What Payment Methods Does Home Depot Accept?

Home Depot is broadly payment-friendly and accepts nearly all major payment types:

### In-Store Payment Methods

| Payment Type | Accepted? |
|-------------|-----------|
| **Visa, Mastercard, Discover, Amex** | ✓ Yes |
| **Debit cards (chip + PIN + tap)** | ✓ Yes |
| **Apple Pay** | ✓ Yes — all stores |
| **Google Pay** | ✓ Yes — all stores |
| **Samsung Pay** | ✓ Yes — all stores |
| **PayPal** (via QR code at select locations) | ✓ Yes |
| **Home Depot Gift Cards** | ✓ Yes |
| **Home Depot Credit Card (Consumer / Pro)** | ✓ Yes |
| **Cash** | ✓ Yes |
| **Personal checks** | ✓ Yes (with ID) |
| **EBT / SNAP** | ✗ No — Home Depot does not sell eligible food items |
| **Cryptocurrency** | ✗ No |

### Online (Home Depot App) Payment Methods

| Payment Type | Accepted? |
|-------------|-----------|
| **Visa, Mastercard, Discover, Amex** | ✓ Yes |
| **Apple Pay** | ✓ Yes (mobile app only) |
| **PayPal** | ✓ Yes |
| **Home Depot Gift Cards** | ✓ Yes |
| **Home Depot Consumer Credit Card** | ✓ Yes |
| **Home Depot Pro Xtra Credit Card** | ✓ Yes |
| **Buy Now, Pay Later (Home Depot Credit)** | ✓ Yes |

## Does Home Depot Accept Google Pay and Samsung Pay?

**Yes.** All three major mobile wallets work at Home Depot:

- **Apple Pay** — works on iPhone (Face ID or Touch ID) and Apple Watch
- **Google Pay** — works on Android phones with NFC enabled
- **Samsung Pay** — works on Samsung Galaxy phones (MST and NFC modes)

Home Depot has not blocked any NFC wallet. Any contactless payment that uses NFC technology should work at Home Depot's terminals.

## The Home Depot Credit Card

If you shop at Home Depot regularly, the **Home Depot Consumer Credit Card** offers project financing:

| Feature | Detail |
|---------|--------|
| **Special financing** | 6–24 months deferred interest on purchases $299+ |
| **Standard APR** | ~29.99% (apply when project financing runs out) |
| **Discounts** | 5–10% off select items for new cardholders |
| **Annual fee** | $0 |
| **Best for** | Large home improvement projects (kitchens, bathrooms, flooring) |

The project financing (deferred interest) is useful for big purchases but requires paying the full balance before the promotional period ends — otherwise interest accrues retroactively to the purchase date.

**Note**: The Home Depot Credit Card cannot be added to Apple Pay or Google Pay — it's not a standard Visa/Mastercard, so it doesn't work with mobile wallets. Use it as a physical card at the register.

## Does Lowe's Also Accept Apple Pay?

**Yes — Lowe's accepts Apple Pay too.** Both Home Depot and Lowe's have NFC-enabled terminals that support Apple Pay, Google Pay, and Samsung Pay. This is one category where they're identical.

| Payment Feature | Home Depot | Lowe's |
|----------------|------------|--------|
| **Apple Pay** | ✓ Yes | ✓ Yes |
| **Google Pay** | ✓ Yes | ✓ Yes |
| **Samsung Pay** | ✓ Yes | ✓ Yes |
| **Store credit card** | ✓ Yes (Consumer + Pro) | ✓ Yes (Advantage Card) |
| **PayPal** | ✓ Yes | ✓ Yes |
| **Gift cards** | ✓ Yes | ✓ Yes |
| **Cash** | ✓ Yes | ✓ Yes |

If contactless payment is your primary concern, either retailer works equally well.

## Which Major Retailers Don't Accept Apple Pay?

Apple Pay works at the vast majority of U.S. retailers, but a notable exception is:

| Retailer | Apple Pay? | Reason |
|----------|-----------|--------|
| **Walmart** | ✗ No | Uses own Walmart Pay; blocks NFC wallets |
| **Sam's Club** | ✗ No | Walmart-owned; same policy |
| **Home Depot** | ✓ Yes | Fully supported in-store and on app |
| **Lowe's** | ✓ Yes | Fully supported |
| **Target** | ✓ Yes | Fully supported |
| **Costco** | ✓ Yes | Accepted in stores and on app |
| **Best Buy** | ✓ Yes | Fully supported |

Walmart remains the most significant holdout among major retailers. Everywhere else — including Home Depot — Apple Pay works as expected.

## Tips for Using Apple Pay at Home Depot

**1. Use it at the pro desk too.** The dedicated pro/contractor checkout areas at larger Home Depot stores have the same NFC-enabled terminals.

**2. Apple Pay works at self-checkout.** Home Depot's self-checkout kiosks accept Apple Pay — tap the contactless symbol on the reader.

**3. Returns work normally.** If you need to return an item you paid for via Apple Pay, bring the original receipt (emailed or printed). Home Depot's system links the transaction, but staff may still ask for ID.

**4. Check your card issuer limits.** Your bank may set a per-transaction limit on Apple Pay in-store purchases (some set it at $100–$200 without a PIN/biometric). Most modern iPhones with Face ID or Touch ID bypass these limits because they authenticate the cardholder.

**5. Apple Pay is as secure as chip.** Apple Pay uses a one-time transaction code (token) for each purchase. Home Depot never sees your actual card number during an Apple Pay transaction.

## FAQ

**Does Home Depot accept Apple Pay in self-checkout?**
Yes. Home Depot self-checkout kiosks have NFC readers that support Apple Pay, Google Pay, and Samsung Pay. Tap your phone or watch on the reader and authenticate as normal.

**Can I use Apple Pay on HomeDepot.com?**
Apple Pay is available on the Home Depot mobile app but not on the desktop version of HomeDepot.com. For website purchases, use a credit/debit card or PayPal. The app is the recommended path for Apple Pay online.

**Does Home Depot accept Google Pay?**
Yes. Google Pay works at all Home Depot registers that support Apple Pay — which is all of them. Home Depot's NFC terminals accept any contactless payment, including Google Pay on Android phones.

**Can I use Apple Pay with my Home Depot credit card?**
No. The Home Depot Consumer Credit Card and Pro Xtra Credit Card are store-branded cards that don't support digital wallets. They must be used as physical cards. Your regular bank card (Visa, Mastercard) can be added to Apple Pay and used at Home Depot.

**Does Home Depot accept contactless payments at the pro desk?**
Yes. The dedicated pro/contractor checkout areas at Home Depot also have NFC-enabled terminals that accept Apple Pay, Google Pay, and other contactless wallets.

**Is Apple Pay accepted at Home Depot in Canada?**
Home Depot Canada locations generally support contactless payments, but availability can vary by terminal. When in doubt, the physical card always works as a fallback.

## Bottom Line

Home Depot accepts Apple Pay in all U.S. stores — at standard registers, self-checkout, and the pro desk — plus on the Home Depot mobile app. There are no restrictions on NFC wallets; tap-to-pay works just like any other contactless payment.

For a full comparison of Home Depot and Lowe's — prices, project services, loyalty programs, and which wins by product category — see our [Home Depot vs Lowe's comparison](/compare/home-depot-vs-lowes).

### Related Comparisons
- [Home Depot vs Lowe's: Full Comparison](/compare/home-depot-vs-lowes)
- [Amazon vs Home Depot: Online vs. In-Store](/compare/amazon-vs-home-depot)
- [Does Walmart Take Apple Pay?](/blog/does-walmart-take-apple-pay)
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
  console.log(`DAN-1844: Publishing blog post — ${POST.title}...\n`);

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
    "home-depot-vs-lowes",
    "Does Home Depot accept Apple Pay?",
    "Yes — Home Depot accepts Apple Pay at all U.S. stores and on the Home Depot mobile app. Home Depot's NFC-enabled checkout terminals support Apple Pay, Google Pay, and Samsung Pay. To pay, hold your iPhone or Apple Watch near the contactless reader at checkout and authenticate with Face ID, Touch ID, or your passcode. Apple Pay also works at self-checkout kiosks and the pro desk. Lowe's also accepts Apple Pay, so both major home improvement retailers support contactless wallets.",
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
