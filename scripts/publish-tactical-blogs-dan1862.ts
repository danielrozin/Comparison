/**
 * DAN-1862: Blog — Does McDonald's Take Apple Pay? (8,100/mo, KD 1)
 * Run: npx tsx scripts/publish-tactical-blogs-dan1862.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "does-mcdonalds-take-apple-pay",
    title: "Does McDonald's Take Apple Pay?",
    excerpt:
      "Yes — McDonald's accepts Apple Pay at virtually all U.S. locations, including in-store, the drive-through, and via the McDonald's app. Tap your iPhone or Apple Watch at the NFC reader, and you're done. Here's everything you need to know about using Apple Pay at McDonald's.",
    category: "finance",
    tags: [
      "McDonald's Apple Pay",
      "does McDonald's take Apple Pay",
      "McDonald's payment methods",
      "Apple Pay fast food",
      "contactless payment McDonald's",
      "McDonald's app payment",
    ],
    metaTitle:
      "Does McDonald's Take Apple Pay? Yes — Here's How to Use It",
    metaDescription:
      "McDonald's accepts Apple Pay at virtually all U.S. locations — in-store, drive-through, and via the app. Learn how to tap and pay, which locations may not support it, and every other payment McDonald's accepts.",
    relatedComparisonSlugs: [
      "apple-pay-vs-google-pay",
      "mcdonalds-vs-burger-king",
      "mcdonalds-vs-wendys",
    ],
    content: `# Does McDonald's Take Apple Pay?

**Yes — McDonald's accepts Apple Pay at virtually all U.S. locations.** Whether you're ordering at the counter, pulling up to the drive-through, or paying through the McDonald's app, Apple Pay works. McDonald's was one of the early major fast-food chains to adopt contactless payments, and today it's seamless at nearly every location.

---

## How to Use Apple Pay at McDonald's

### In-Store (Counter or Kiosk)

1. Place your order at the counter or self-order kiosk
2. When it's time to pay, look for the **contactless symbol** (four curved lines) on the payment terminal
3. Hold your **iPhone near the NFC reader** — Face ID or Touch ID authenticates the payment automatically
4. Or hold your **Apple Watch** near the reader and double-click the side button to confirm
5. You'll feel a haptic tap and see a checkmark when the payment goes through

Most McDonald's now have NFC-enabled terminals at every register and kiosk. The whole process takes under five seconds.

### Drive-Through

McDonald's drive-throughs support Apple Pay at the payment window. The cashier will hold out a handheld NFC terminal — tap your iPhone or Apple Watch to it exactly as you would at the counter. Some newer McDonald's drive-throughs also have fixed NFC readers built into the window panel.

### McDonald's App

You can also pay directly through the **McDonald's app** (available on iPhone and Android). The app accepts Apple Pay as a payment method for mobile orders. To set it up:

1. Open the McDonald's app and go to **Account → Payment Methods**
2. Tap **Add Payment Method** and select Apple Pay
3. Authenticate with Face ID / Touch ID
4. At checkout, select Apple Pay and confirm with biometrics

Mobile order pickup is one of the smoothest use cases — you pay in the app, skip the line, and pick up at the counter or designated mobile order parking spots.

---

## Does Apple Pay Work at Every McDonald's?

Virtually every corporate-owned U.S. McDonald's accepts Apple Pay. The main exceptions are a small number of **older, independently franchised locations** that haven't yet upgraded their payment terminals to NFC hardware. These are increasingly rare.

If Apple Pay doesn't work at a specific location:
- The terminal may not have an NFC reader (look for the contactless symbol)
- The terminal may have NFC disabled — ask the cashier if they accept contactless payment
- As a fallback, use the McDonald's app to pay by mobile order, or pay with a physical card or cash

In 2026, the overwhelming majority of U.S. McDonald's locations support Apple Pay without issue.

---

## What Other Contactless Payments Does McDonald's Accept?

McDonald's supports all major contactless payment methods:

| Payment Method | In-Store | Drive-Through | App |
|----------------|----------|---------------|-----|
| **Apple Pay** | ✓ Yes | ✓ Yes | ✓ Yes |
| **Google Pay** | ✓ Yes | ✓ Yes | ✓ Yes (via app) |
| **Samsung Pay** | ✓ Yes | ✓ Yes | — |
| **Contactless Visa/Mastercard** | ✓ Yes | ✓ Yes | ✓ Yes |
| **Contactless AmEx** | ✓ Yes | ✓ Yes | ✓ Yes |
| **Physical credit/debit card** | ✓ Yes | ✓ Yes | ✓ Yes |
| **Cash** | ✓ Yes | ✓ Yes | — |
| **McDonald's App Gift Cards** | — | — | ✓ Yes |

### Apple Pay vs Google Pay at McDonald's

Both work equally well at McDonald's. If you're an Android user, Google Pay is the contactless equivalent. The NFC terminals at McDonald's don't discriminate — any NFC wallet (Apple Pay, Google Pay, Samsung Pay) works the same way.

→ See the full breakdown: [Apple Pay vs Google Pay](/compare/apple-pay-vs-google-pay)

---

## Does McDonald's Accept Apple Pay for Delivery?

If you order McDonald's through a third-party delivery app, payment goes through that app — not McDonald's directly:

- **DoorDash** — accepts Apple Pay
- **Uber Eats** — accepts Apple Pay
- **Grubhub** — accepts Apple Pay

So yes, you can effectively pay with Apple Pay for McDonald's delivery, but the transaction runs through the delivery platform, not McDonald's.

---

## McDonald's vs. Competitors: Who Else Takes Apple Pay?

McDonald's isn't alone in accepting Apple Pay. Here's how the major fast-food chains compare:

| Chain | Apple Pay (In-Store) | Apple Pay (Drive-Through) |
|-------|---------------------|--------------------------|
| **McDonald's** | ✓ Yes | ✓ Yes |
| **Burger King** | ✓ Yes | ✓ Yes |
| **Wendy's** | ✓ Yes | ✓ Yes |
| **Chick-fil-A** | ✓ Yes | ✓ Yes |
| **Taco Bell** | ✓ Yes | ✓ Yes |
| **Starbucks** | ✓ Yes | ✓ Yes |
| **Subway** | ✓ Yes | N/A |

All of the major U.S. fast-food chains now accept Apple Pay. McDonald's was one of the early adopters when contactless payments became standard.

→ Compare McDonald's to its rivals: [McDonald's vs Burger King](/compare/mcdonalds-vs-burger-king) | [McDonald's vs Wendy's](/compare/mcdonalds-vs-wendys)

---

## Frequently Asked Questions

**Does McDonald's take Apple Pay in 2026?**
Yes. McDonald's accepts Apple Pay at virtually all U.S. locations, including in-store, at the drive-through window, and through the McDonald's app. NFC terminals are standard at McDonald's across the country.

**Can I use Apple Pay at the McDonald's drive-through?**
Yes. The cashier at the drive-through window will hold out a handheld NFC terminal or direct you to a fixed reader at the window. Tap your iPhone or Apple Watch to pay.

**Does the McDonald's app accept Apple Pay?**
Yes. You can add Apple Pay as a payment method in the McDonald's app under Account → Payment Methods. This lets you pay for mobile orders using Face ID or Touch ID.

**What if Apple Pay is declined at McDonald's?**
First, check that the terminal has the contactless symbol. If it does but Apple Pay still won't work, try asking the cashier to enable contactless on the terminal. If that fails, use a physical card or cash. This issue is rare at McDonald's.

**Does McDonald's accept Google Pay too?**
Yes. McDonald's NFC terminals accept Apple Pay, Google Pay, and Samsung Pay — all three major mobile wallets work the same way.

**Can I use Apple Pay at McDonald's self-order kiosks?**
Yes. McDonald's self-order kiosks have built-in NFC readers. Hold your iPhone or Apple Watch near the payment terminal at the bottom of the kiosk when prompted to pay.

**Does McDonald's accept contactless card payments (tap-to-pay)?**
Yes. In addition to mobile wallets, McDonald's accepts contactless (tap-to-pay) physical credit and debit cards from Visa, Mastercard, American Express, and Discover.

**Can I pay with Apple Pay for McDonald's delivery on DoorDash or Uber Eats?**
You can pay with Apple Pay inside the DoorDash or Uber Eats app when ordering McDonald's for delivery. The payment goes to the delivery platform, not McDonald's directly, but the result is the same.

---

## The Bottom Line

McDonald's accepts Apple Pay — it's one of the easiest and fastest ways to pay, and it works at virtually every U.S. location. Tap your iPhone or Apple Watch at the NFC terminal in-store, at the drive-through, or use Apple Pay directly in the McDonald's app for mobile orders. The only edge case is a handful of older franchise locations that may not have NFC terminals, but these are becoming increasingly rare.

If you're comparing mobile payment options, both Apple Pay and Google Pay work equally well at McDonald's.

→ [Apple Pay vs Google Pay: Which Is Better?](/compare/apple-pay-vs-google-pay)
→ [McDonald's vs Burger King: Which Is Better?](/compare/mcdonalds-vs-burger-king)
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
    `DAN-1862: Publishing "Does McDonald's Take Apple Pay?" (8,100/mo, KD 1)...\n`
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

  console.log("\n→ Adding exact-match FAQs to related comparisons...");

  await addFaqToComparison(
    "apple-pay-vs-google-pay",
    "Does McDonald's accept Apple Pay and Google Pay?",
    "Yes — McDonald's accepts both Apple Pay and Google Pay at virtually all U.S. locations. McDonald's NFC terminals support all major contactless wallets. Tap your iPhone (Apple Pay) or Android phone (Google Pay) at the payment terminal in-store or at the drive-through window.",
    11
  );

  await addFaqToComparison(
    "mcdonalds-vs-burger-king",
    "Does McDonald's or Burger King accept Apple Pay?",
    "Both McDonald's and Burger King accept Apple Pay. You can tap to pay with your iPhone or Apple Watch at the NFC terminal in-store and at the drive-through window at both chains. The McDonald's app also accepts Apple Pay for mobile orders.",
    11
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
