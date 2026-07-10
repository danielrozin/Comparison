/**
 * DAN-1859: Blog — How to Get a Cashier's Check (14,800/mo, KD 2)
 * Run: npx tsx scripts/publish-tactical-blogs-dan1859.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "how-to-get-a-cashiers-check",
    title: "How to Get a Cashier's Check",
    excerpt:
      "To get a cashier's check, visit your bank or credit union, tell the teller the amount and the payee's name, and pay with cash or funds from your account. The bank issues a check drawn on its own funds — guaranteed not to bounce. Fees typically run $5–$15. Here's everything you need to know.",
    category: "finance",
    tags: [
      "cashier's check",
      "bank check",
      "certified check",
      "guaranteed check",
      "banking",
      "personal finance",
    ],
    metaTitle:
      "How to Get a Cashier's Check: Step-by-Step at Any Bank (2026)",
    metaDescription:
      "Get a cashier's check at your bank or credit union in minutes. Bring ID, the payee's name, and the exact amount. Fees are $5–$15. See which banks offer free cashier's checks and how to get one online.",
    relatedComparisonSlugs: [
      "chase-vs-bank-of-america",
      "wells-fargo-vs-chase",
      "money-order-vs-cashiers-check",
    ],
    content: `# How to Get a Cashier's Check

A **cashier's check** is one of the safest forms of payment you can use for large transactions — real estate down payments, car purchases, security deposits, or any time a seller demands a guaranteed payment. Unlike a personal check, a cashier's check is drawn on the bank's own funds and is virtually impossible to bounce.

Here's exactly how to get one, where to go, what it costs, and common questions answered.

## What Is a Cashier's Check?

A cashier's check (also called an **official bank check** or **teller's check**) is a check issued by a bank or credit union, signed by a bank teller or officer, and drawn directly on the bank's own account — not your personal account.

Because the bank guarantees the funds, cashier's checks are accepted for transactions where personal checks are not, such as:

- Real estate closings and down payments
- Buying a used car from a private seller
- Large security deposits
- Court settlements
- International wire alternatives

## How to Get a Cashier's Check: Step-by-Step

### Step 1 — Prepare the information you'll need

Before going to the bank, have ready:

- **The payee's full legal name** (exactly as it should appear on the check — "John Smith" or "John Smith LLC")
- **The exact dollar amount** (cashier's checks cannot be written for "approximately" — the amount is final once printed)
- **A government-issued photo ID** (driver's license, passport, or state ID)
- **Your account information** if you're paying from a bank account

### Step 2 — Go to your bank or credit union

Visit a branch of your bank or credit union in person. Most major banks issue cashier's checks at any teller window without an appointment.

**Banks that issue cashier's checks:**
- Chase Bank
- Bank of America
- Wells Fargo
- Citibank
- U.S. Bank
- TD Bank
- PNC Bank
- Capital One (select branches)
- Most credit unions

> **Not a customer?** Some banks will issue a cashier's check to non-customers if you pay in cash. Call ahead — policies vary by bank.

### Step 3 — Ask the teller for a cashier's check

Tell the teller:
- You'd like a cashier's check
- The **payee's name** (who it's made out to)
- The **exact amount**

The teller will withdraw the funds from your account (or accept cash) at that moment. The funds are immediately debited — you cannot stop payment on a cashier's check after it's issued.

### Step 4 — Pay the fee and collect the check

The bank will charge a fee (see the table below) and print the check on the spot. The entire process takes 5–10 minutes.

You'll receive a receipt — keep it. If the check is lost or stolen, you'll need proof of purchase to request a replacement.

## Cashier's Check Fees by Bank (2026)

| Bank | Cashier's Check Fee | Free for Account Holders? |
|------|--------------------|-----------------------------|
| **Chase** | $8 | Free for Premier Plus Checking, Sapphire Banking, and Private Client accounts |
| **Bank of America** | $15 | Free for Preferred Rewards Gold, Platinum, and Platinum Honors members |
| **Wells Fargo** | $10 | Free for Portfolio Checking accounts |
| **Citibank** | $10 | Free for Citigold, Citi Priority accounts |
| **U.S. Bank** | $7 | Free with Platinum Checking |
| **TD Bank** | $8 | Free with TD Beyond Checking |
| **PNC Bank** | $10 | Free with Performance Select Checking |
| **Most credit unions** | $0–$5 | Often free for members |

> **Tip:** Credit unions typically charge the lowest fees — often $0–$3 — and some waive fees entirely for all members.

## Can You Get a Cashier's Check Online?

Most banks **do not** offer fully online cashier's checks — you typically need to visit a branch. However, a few options exist:

- **Chase, Bank of America, and Wells Fargo** allow you to order a cashier's check via online banking or their app, then mail it to you (allow 5–7 business days). This is slower but useful if you can't visit a branch.
- **Some banks offer "electronic cashier's checks"** — digital equivalents sent via email that the recipient prints and deposits. Ask your bank if this is available.
- **Money orders** are a close alternative you can buy online via USPS or at retailers — though they're capped at $1,000 per money order.

If you need a cashier's check quickly, a branch visit is always the fastest route.

## How to Get a Cashier's Check Without a Bank Account

If you don't have a bank account, you have a few options:

1. **Pay a non-customer fee at a bank** — Some banks (Wells Fargo, Chase) will issue a cashier's check to non-customers if you pay in cash plus a higher fee (often $10–$20). Call the branch first to confirm.
2. **Open a basic bank account** — A free checking account at a credit union or online bank takes 5–10 minutes and immediately makes you eligible to purchase cashier's checks.
3. **Use a money order instead** — For amounts under $1,000, a USPS money order ($2.35 fee) or Walmart money order ($1 fee) is nearly as accepted and doesn't require a bank account.
4. **Use Western Union or MoneyGram** — Both services allow you to purchase a type of guaranteed payment instrument without a bank account.

## Cashier's Check vs. Personal Check vs. Money Order

| Feature | Cashier's Check | Personal Check | Money Order |
|---------|----------------|----------------|-------------|
| **Guaranteed funds** | ✓ Yes (bank-backed) | ✗ No (can bounce) | ✓ Yes |
| **Maximum amount** | Unlimited | Unlimited | $1,000/order |
| **Where to get it** | Bank/credit union | Your checkbook | Bank, post office, Walmart, CVS |
| **Typical fee** | $5–$15 | Free | $1–$2.35 |
| **Accepted for real estate** | ✓ Yes | Rarely | Rarely |
| **Can be cancelled** | Very difficult | ✓ Yes | ✓ Yes |
| **Requires ID** | ✓ Yes | No | ✓ Yes |

For large transactions, a **cashier's check is almost always preferred over a personal check**, and it's accepted in situations where money orders aren't practical due to the dollar limit.

## What to Do If a Cashier's Check Is Lost or Stolen

A lost or stolen cashier's check is a serious problem. Here's the process:

1. **Contact your bank immediately** and report it lost or stolen.
2. **Submit a written loss affidavit** — the bank will require you to sign a declaration stating you did not cash or transfer the check.
3. **Wait for the bank's indemnity period** — most banks require waiting 90 days (some up to 12 months) before issuing a replacement, to ensure the original isn't cashed.
4. **Request a replacement or refund** — once the waiting period passes, the bank will reissue the check or refund the amount.

> **Warning:** Never send a "replacement" cashier's check to someone who claims your original was lost — this is a common scam.

## FAQ

**How long does it take to get a cashier's check?**
In-person at a bank branch, the process takes 5–10 minutes. If you order one online for mail delivery, expect 5–7 business days.

**Can I get a cashier's check for any amount?**
Yes. Unlike money orders (capped at $1,000), there's no standard maximum on cashier's checks. Banks may require additional documentation for very large amounts (e.g., over $10,000), as required by federal anti-money-laundering rules.

**Do cashier's checks expire?**
Technically, cashier's checks don't expire, but banks may require additional verification or charge a "stale check" fee on checks older than 90–180 days. Use the check promptly after receiving it.

**Can I cancel a cashier's check?**
It's very difficult. Once issued and funds are withdrawn, you must file an affidavit, wait 90+ days, and the bank decides whether to reissue. Only buy a cashier's check when you're certain you want to complete the transaction.

**What's the difference between a cashier's check and a certified check?**
A **certified check** is drawn on your personal account but certified by the bank (which earmarks the funds so they can't be spent elsewhere). A **cashier's check** is drawn on the bank's own account. Both are guaranteed, but cashier's checks are more widely accepted and more secure.

**Is a cashier's check the same as a bank draft?**
In the U.S., they're essentially the same thing. "Bank draft" is a more common term in some international contexts.

**Can someone fake a cashier's check?**
Unfortunately, yes — cashier's check fraud is common. To verify a cashier's check, call the issuing bank directly (not the number printed on the check) and verify the check number and amount before releasing any goods or property.

## Bottom Line

Getting a cashier's check is straightforward: visit your bank or credit union with a photo ID, the payee's name, and the exact amount. The teller will withdraw the funds and print a check backed by the bank's own guarantee. Expect to pay a $5–$15 fee unless you have a premium account. For most large transactions — real estate, car sales, court settlements — a cashier's check is the gold standard for guaranteed payment.

### Related Comparisons
- [Chase vs Bank of America: Which Is Better?](/compare/chase-vs-bank-of-america)
- [Wells Fargo vs Chase: Full Banking Comparison](/compare/wells-fargo-vs-chase)
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
    `DAN-1859: Publishing "How to Get a Cashier's Check" (14,800/mo, KD 2)...\n`
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
    "chase-vs-bank-of-america",
    "How do I get a cashier's check at Chase or Bank of America?",
    "Visit any Chase or Bank of America branch with a photo ID and the payee's name and amount. The teller will print a cashier's check on the spot. Chase charges $8 (free for Premier Plus Checking and above); Bank of America charges $15 (free for Preferred Rewards members). The process takes about 5–10 minutes.",
    10
  );

  await addFaqToComparison(
    "wells-fargo-vs-chase",
    "How do I get a cashier's check at Wells Fargo or Chase?",
    "Go to any Wells Fargo or Chase branch with your ID and the payee's name and exact amount. Wells Fargo charges $10 for a cashier's check (free with Portfolio Checking); Chase charges $8 (free for Premier Plus Checking and above). Both issue the check in under 10 minutes at the teller window.",
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
