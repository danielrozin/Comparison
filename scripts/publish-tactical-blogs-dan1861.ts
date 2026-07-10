/**
 * DAN-1861: Blog — Does Costco Accept American Express? (12,100/mo, KD 2)
 * Run: npx tsx scripts/publish-tactical-blogs-dan1861.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "does-costco-accept-american-express",
    title: "Does Costco Accept American Express?",
    excerpt:
      "No — Costco does not accept American Express at its warehouses or on Costco.com. Costco dropped AmEx in 2016 when its exclusive co-branded credit card partnership switched to Visa. Today Costco only accepts Visa credit cards (plus debit, cash, checks, and EBT). Here's what you can pay with — and the best Visa card to use at Costco.",
    category: "finance",
    tags: [
      "Costco payment methods",
      "does Costco accept American Express",
      "Costco credit cards",
      "Costco Visa",
      "American Express",
      "retail payments",
    ],
    metaTitle:
      "Does Costco Accept American Express? No — Here's What They Take",
    metaDescription:
      "Costco stopped accepting American Express in 2016. Today Costco only accepts Visa credit cards, plus debit, cash, checks, and EBT. See every accepted payment method and the best Visa card to use at Costco.",
    relatedComparisonSlugs: [
      "american-express-vs-visa",
      "american-express-vs-mastercard",
      "costco-vs-sams-club",
    ],
    content: `# Does Costco Accept American Express?

**No — Costco does not accept American Express.** If you pull out your AmEx card at a Costco warehouse checkout or try to use it on Costco.com, it will be declined. This surprises a lot of shoppers, especially those with premium AmEx rewards cards. Here's exactly what happened, what Costco does accept, and the best card to use when you shop there.

## Why Doesn't Costco Accept American Express Anymore?

Costco and American Express had an exclusive co-branded credit card partnership that lasted from 1999 to 2016. For 17 years, AmEx was the **only** credit card accepted at Costco warehouses — a deal that benefited both companies by driving spending on the co-branded Costco AmEx card.

In 2016, Costco ended that partnership and signed an exclusive deal with **Visa** instead. The new co-branded card — the **Citi/Costco Anywhere Visa® Card** — launched in June 2016 and replaced the AmEx partnership entirely.

As a result:
- **All American Express cards** (Blue Cash, Gold, Platinum, Centurion — everything) are declined at Costco
- Costco only accepts **Visa** as a credit card network
- The switch applied to all warehouses in the U.S. and to Costco.com simultaneously

## What Payment Methods Does Costco Accept?

Here's every payment method Costco currently accepts (as of 2026):

| Payment Type | Accepted? | Notes |
|-------------|-----------|-------|
| **Visa credit cards** | ✓ Yes | Any Visa — the Citi/Costco Visa earns the most rewards |
| **Visa debit cards** | ✓ Yes | Any Visa-network debit card |
| **Mastercard** | ✗ No | Not accepted |
| **American Express** | ✗ No | Not accepted since 2016 |
| **Discover** | ✗ No | Not accepted |
| **Cash** | ✓ Yes | All warehouses |
| **Debit cards (PIN)** | ✓ Yes | Must enter PIN; must have sufficient balance |
| **Checks** | ✓ Yes | Personal, cashier's, business checks |
| **EBT/SNAP** | ✓ Yes | Food-eligible items only |
| **Costco Shop Cards** | ✓ Yes | Costco's own gift cards (reloadable) |
| **Apple Pay / Google Pay** | ✓ Yes (in-store) | Contactless payments using a linked Visa card |
| **PayPal** | ✓ Yes (online only) | Costco.com accepts PayPal at checkout |

### Does Costco Accept Mastercard or Discover?

No. Costco only accepts **Visa** among credit card networks. Mastercard, Discover, and American Express are all declined. This is one of the most restrictive payment policies of any major U.S. retailer.

### What About Costco Gas Stations?

Costco gas stations follow the same policy — **Visa only** for credit cards. Cash and PIN debit are also accepted at the pump. AmEx, Mastercard, and Discover are not accepted at Costco gas stations.

### What About Costco.com?

Costco's website (Costco.com) accepts Visa credit and debit cards, plus PayPal, Costco Shop Cards, and EBT for eligible orders. **American Express is not accepted on Costco.com** either.

---

## The Best Card to Use at Costco

Since you're limited to Visa, the single best card to use at Costco is the **Citi® / Costco Anywhere Visa® Card by Citi**:

| Category | Reward Rate |
|----------|-------------|
| Costco and Costco.com | **2% cash back** |
| Restaurants and eligible travel | **3% cash back** |
| Gas (including Costco gas) | **4% cash back** (first $7,000/yr, then 1%) |
| All other purchases | **1% cash back** |

- **Annual fee:** $0 (included with Costco membership)
- **Cash back paid:** Once a year in February as a reward certificate, redeemable at Costco warehouses

If you don't want the co-branded card, other strong Visa options at Costco include:
- **Chase Freedom Unlimited® Visa** — 1.5% cash back on all purchases
- **Capital One Venture Visa** — 2x miles everywhere
- **Wells Fargo Active Cash® Visa** — 2% cash back on all purchases

---

## What If You Only Have an American Express Card?

If AmEx is your primary card, you have a few workarounds:

1. **Pay with cash** — straightforward, though less convenient for large purchases
2. **Use a Visa debit card** — even a basic checking account debit card on the Visa network works
3. **Buy a Costco Shop Card** — purchase a Costco gift card in advance using your AmEx through a third-party retailer (some grocery stores or gas stations sell them), then use the Shop Card at Costco
4. **Use Apple Pay or Google Pay** — if your phone wallet has a linked Visa card, contactless payments work in-store (the underlying card must still be Visa)
5. **Open a Visa credit card** — if you shop at Costco regularly, getting a no-fee Visa card is the cleanest solution

> **Note:** You cannot load an AmEx card onto Apple Pay and use it at Costco. The payment network that processes the transaction must be Visa — Apple Pay simply passes through the underlying card's network.

---

## Costco vs. Sam's Club: Which Accepts More Cards?

If payment flexibility matters to you, it's worth comparing Costco to its biggest competitor:

| Feature | Costco | Sam's Club |
|---------|--------|-----------|
| American Express | ✗ No | ✓ Yes |
| Mastercard | ✗ No | ✓ Yes |
| Discover | ✗ No | ✓ Yes |
| Visa | ✓ Yes | ✓ Yes |
| Cash | ✓ Yes | ✓ Yes |

**Sam's Club accepts all four major credit card networks**, including American Express. If you're locked into AmEx rewards and want a wholesale club membership, Sam's Club is more card-friendly than Costco.

---

## Frequently Asked Questions

**Does Costco take American Express in 2026?**
No. Costco has not accepted American Express since June 2016, when the co-branded AmEx partnership ended. There are no plans to bring AmEx back — Costco has an exclusive agreement with Visa.

**When did Costco stop accepting American Express?**
Costco stopped accepting American Express on June 19, 2016. That's when the Citi/Costco Visa card launched and the AmEx partnership expired.

**Can I use my Amex Blue Cash Everyday or Amex Platinum at Costco?**
No. All American Express cards are declined at Costco — no exceptions. The Blue Cash Everyday, Blue Cash Preferred, Gold, Platinum, Centurion, and all other AmEx products are not accepted.

**Does Costco accept Mastercard?**
No. Mastercard is not accepted at Costco warehouses, Costco.com, or Costco gas stations. Visa is the only accepted credit card network.

**Does Costco accept contactless/tap payments?**
Yes — but the underlying card must be a Visa. Apple Pay, Google Pay, and Samsung Pay all work in-store at Costco as long as the card you've linked is a Visa.

**What's the best credit card to use at Costco?**
The Citi/Costco Anywhere Visa® Card earns 2% at Costco, 3% at restaurants and travel, and 4% on gas — and there's no annual fee beyond your Costco membership. It's the top-earning Visa card specifically for Costco purchases.

**Can I pay at Costco with PayPal?**
PayPal is accepted on Costco.com (online orders only). PayPal is not accepted at the in-store checkout or at the warehouse.

**Does Costco accept Apple Pay with an AmEx card linked?**
No. Even if you try to pay with Apple Pay using a linked AmEx card, the transaction will be declined because the underlying network is American Express. The contactless payment still processes over the card's network — Costco's terminals reject AmEx regardless of how it's presented.

---

## The Bottom Line

Costco stopped accepting American Express in 2016 and shows no signs of reversing that decision. At Costco warehouses and Costco.com, **Visa is the only accepted credit card network**. If you want to maximize rewards at Costco, the Citi/Costco Anywhere Visa® Card is purpose-built for it — 2% back at Costco and 4% on gas. If you're committed to AmEx and don't want to open a Visa card, pay with cash, a Visa debit card, or a Costco Shop Card purchased elsewhere with your AmEx.

### Related Comparisons
- [American Express vs. Visa: Which Is More Widely Accepted?](/compare/american-express-vs-visa)
- [American Express vs. Mastercard: Network Comparison](/compare/american-express-vs-mastercard)
- [Costco vs. Sam's Club: Which Is the Better Warehouse Club?](/compare/costco-vs-sams-club)
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
    `DAN-1861: Publishing "Does Costco Accept American Express?" (12,100/mo, KD 2)...\n`
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
    "american-express-vs-visa",
    "Does Costco accept American Express or only Visa?",
    "Costco only accepts Visa credit cards — American Express has not been accepted at Costco since June 2016, when the co-branded AmEx partnership ended. If you want to earn credit card rewards at Costco, you need a Visa. The Citi/Costco Anywhere Visa® Card earns 2% at Costco and 4% on gas.",
    11
  );

  await addFaqToComparison(
    "costco-vs-sams-club",
    "Does Costco or Sam's Club accept more credit card types?",
    "Sam's Club is more card-flexible than Costco. Costco only accepts Visa credit cards (and declined American Express, Mastercard, and Discover since 2016). Sam's Club accepts all four major networks: Visa, Mastercard, American Express, and Discover. If you prefer paying with AmEx, Sam's Club is the better choice.",
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
