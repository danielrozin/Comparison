/**
 * DAN-1843: Blog — Does Walmart Cash Checks? (Types, Fees & Limits) (14,800/mo, KD 4)
 * Run: npx tsx scripts/publish-tactical-blogs-dan1843.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "does-walmart-cash-checks",
    title: "Does Walmart Cash Checks? (Types, Fees & Limits)",
    excerpt:
      "Yes — Walmart cashes checks at the MoneyCenter or customer service desk in most stores. Personal checks, payroll checks, government checks, tax refunds, and cashier's checks are accepted. Fees are $4 for checks up to $1,000 and $8 for checks over $1,000 (up to $5,000). Here's exactly what's accepted and what's not.",
    category: "finance",
    tags: ["walmart", "check cashing", "financial services", "money center", "fees"],
    metaTitle: "Does Walmart Cash Checks? Types, Fees & Limits (2026)",
    metaDescription:
      "Walmart cashes payroll, government, tax refund, and cashier's checks at the MoneyCenter. Fees: $4 up to $1,000, $8 up to $5,000. See which check types are accepted and what's excluded.",
    relatedComparisonSlugs: ["amazon-vs-walmart", "target-vs-walmart"],
    content: `# Does Walmart Cash Checks?

**Yes — Walmart cashes checks** at the MoneyCenter or customer service desk in most stores. It's one of the largest check-cashing services in the U.S., available without a bank account and at lower fees than most check-cashing stores.

Here's everything you need to know: which check types are accepted, what Walmart charges, how high the limits go, and what you'll need to bring.

## Walmart Check Cashing Fees (2026)

| Check Amount | Fee |
|-------------|-----|
| Up to $1,000 | **$4** |
| $1,001 – $5,000 | **$8** |

These fees are flat — not a percentage of the check amount. For a $500 payroll check, you pay $4 total. For a $4,000 tax refund check, you pay $8. This is significantly cheaper than most check-cashing stores, which typically charge 1–3% of the check amount.

**Note:** Two-party personal checks have a lower limit — capped at $200 with a $6 fee.

## Check Cashing Limits at Walmart

| Check Type | Maximum Amount |
|-----------|---------------|
| Payroll, government, tax refund, cashier's checks | $5,000 |
| Two-party personal checks | $200 |
| Seasonal tax refunds (Jan–Apr) | $7,500 |

During tax season (roughly January through April), Walmart raises the limit on tax refund checks to **$7,500** to accommodate larger IRS and state refunds.

## Which Check Types Does Walmart Cash?

### ✓ Accepted

- **Payroll checks** — employer-issued checks for wages; the most common use case
- **Government checks** — Social Security, disability, unemployment, veterans' benefits
- **Tax refund checks** — federal and state tax refund checks from the IRS or state tax agency
- **Cashier's checks** — bank-issued cashier's checks
- **Insurance settlement checks** — single-party insurance checks
- **MoneyGram money orders** — Walmart cashes its own MoneyGram-branded money orders
- **401(k) and retirement distribution checks** — accepted at many locations

### ✗ Not Accepted

- **Personal checks** (single-party from an individual's bank account, over $200)
- **Two-party checks over $200** — where one person writes a check to another and that person wants to cash it
- **Business checks** (checks made out to a business, not an individual)
- **Checks written in foreign currency**
- **Post-dated checks** — Walmart generally won't accept checks dated in the future
- **Checks over $5,000** (outside of tax season)

## What You Need to Cash a Check at Walmart

Bring **one valid government-issued photo ID**:

- Driver's license
- State-issued ID card
- Passport
- Military ID

The name on your ID must match the payee name on the check. If the check is made out to "John A. Smith" and your ID says "John Smith," that may cause issues — ask the associate and have a backup ID if possible.

You do **not** need a Walmart account, a Walmart+ membership, or any prior relationship with Walmart to cash a check.

## How the Process Works

1. **Go to the MoneyCenter or customer service desk** — MoneyCenters (large standalone kiosks near the entrance or in a dedicated area) are available in most full-size Walmart Supercenters. Neighborhood Market Walmarts typically use the customer service desk instead.

2. **Present the check and your ID** — The associate reviews both documents.

3. **The system verifies the check** — Walmart uses a third-party verification system (Certegy) to screen the check. If the check doesn't clear verification (e.g., the issuing account has flags), Walmart can decline even a valid-looking check.

4. **Pay the fee and receive cash** — You receive the full check amount minus the fee in cash. You cannot deposit the proceeds onto a Walmart MoneyCard as an alternative to cash — you receive physical currency.

## Walmart Check Cashing vs. Alternatives

| Service | Max Amount | Fee | Requires Bank Account? |
|---------|-----------|-----|----------------------|
| **Walmart** | $5,000 ($7,500 tax season) | $4–$8 flat | No |
| **ACE Cash Express** | Varies | 1–3% of check | No |
| **Check Into Cash** | Varies | 1–4% of check | No |
| **Chase (as a non-customer)** | $2,000 (check-cashing fee) | $8 | No |
| **Your own bank** | Unlimited | Free (usually) | Yes |
| **Walmart MoneyCard** | Load via mobile check deposit | $0 (standard) | Yes — card required |

For a payroll check under $1,000, Walmart's $4 fee is hard to beat. A check-cashing store charging 2% on a $900 check would cost $18 — more than 4× Walmart's fee.

## Walmart MoneyCard: A Bank-Free Alternative

If you frequently cash checks or manage finances without a traditional bank account, the **Walmart MoneyCard** (a prepaid debit card) lets you:

- **Mobile check deposit** — snap a photo of the check in the app; funds load in 10 days (standard) or within 10 minutes (for a fee)
- **Direct deposit** — have your paycheck deposited to the card; funds available up to 2 days early
- **Use everywhere Visa/Mastercard is accepted**

The MoneyCard has a $1/month fee (waived if you load $500+/month). For people who regularly cash paychecks, it can reduce fees compared to per-check cashing.

## Walmart Check Cashing During Weekends and Holidays

Walmart Supercenter MoneyCenters are generally open **7 days a week**, with many locations open until 11pm. Hours vary by store — confirm your local hours at Walmart.com before making a special trip. MoneyCenter hours sometimes differ from the store's general retail hours.

During major holidays (Thanksgiving, Christmas Day), some locations close or reduce MoneyCenter hours while the main store stays open. The MoneyCenter and customer service desk are separate services.

## What Happens If Walmart Declines Your Check?

Walmart uses **Certegy Check Services** to verify checks. If Certegy's system flags your check — due to a hold on the issuing account, a history of bounced checks by the issuer, or other database matches — Walmart will decline the transaction, even if you're confident the check is valid.

If this happens:

1. **Ask why** — the associate can tell you it was declined by Certegy but typically can't share more detail.
2. **Contact Certegy directly** at 1-800-237-3826 or certegypaymentsolutions.com to dispute the decline.
3. **Try your bank** — if the check is from a known employer or government agency, your bank will cash it even if Certegy flags it, because they can verify the issuer directly.

A Certegy decline does not mean the check is fraudulent — it often reflects data patterns or a cautious system, not an actual problem with your specific check.

## FAQ

**Does Walmart cash personal checks?**
Yes, but only two-party personal checks up to $200, with a $6 fee. Walmart does not cash single-party personal checks (a check you write to yourself or someone writes to themselves).

**Does Walmart cash checks without a bank account?**
Yes. You don't need a bank account, a Walmart account, or any prior relationship with Walmart. You need a valid government-issued photo ID and the check itself.

**What time does Walmart MoneyCenter open and close?**
Most MoneyCenter locations open at 8am and close at 8pm, though hours vary by location. Use Walmart's store finder to check your local MoneyCenter hours — they differ from the main store hours.

**Can I cash a check at Walmart on Sunday?**
Yes. Walmart MoneyCenters operate 7 days a week. Hours may be reduced on Sundays at some locations.

**Does Walmart cash two-party checks?**
Yes, but only up to $200 with a $6 fee. Two-party checks are checks where one person (Party A) has written a check to Party B, and Party B wants to cash it at Walmart.

**Does Walmart cash checks for non-customers?**
Yes. Anyone with a valid photo ID can cash an eligible check at Walmart — no Walmart account or purchase required.

## Bottom Line

Walmart is one of the cheapest and most accessible check-cashing options available — $4 for checks up to $1,000, $8 for checks up to $5,000, no bank account required. Payroll, government, tax refund, and cashier's checks are all accepted. The main limits to know: no personal checks over $200, no business checks, and a $5,000 cap (raised to $7,500 during tax season).

For a full comparison of Walmart and Amazon — including financial services, pricing, delivery, and which retailer wins by category — see our [Amazon vs Walmart comparison](/compare/amazon-vs-walmart).

### Related Comparisons
- [Amazon vs Walmart: Full Comparison](/compare/amazon-vs-walmart)
- [Target vs Walmart: Which Retailer Wins?](/compare/target-vs-walmart)
- [Costco vs Walmart: Membership vs. Everyday Low Prices](/compare/costco-vs-walmart)
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
  console.log(`DAN-1843: Publishing ${POSTS.length} blog post (does-walmart-cash-checks, 14,800/mo)...\n`);

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
    "amazon-vs-walmart",
    "Does Walmart cash checks?",
    "Yes — Walmart cashes checks at the MoneyCenter or customer service desk in most stores. Payroll, government, tax refund, cashier's checks, and insurance settlement checks are accepted up to $5,000 (raised to $7,500 during tax season). Fees are $4 for checks up to $1,000 and $8 for checks up to $5,000. You need a valid government-issued photo ID. Personal checks are capped at $200 with a $6 fee.",
    15
  );

  await addFaqToComparison(
    "target-vs-walmart",
    "Does Walmart cash checks?",
    "Yes — Walmart cashes payroll, government, tax refund, and cashier's checks at the MoneyCenter or customer service desk. Fees are $4 (up to $1,000) and $8 (up to $5,000). No bank account is required — just a valid photo ID. The limit is $5,000 per check, raised to $7,500 for tax refund checks during tax season. Target does not offer check-cashing services.",
    15
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
