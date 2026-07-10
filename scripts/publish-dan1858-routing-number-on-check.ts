/**
 * DAN-1858: Blog — Where Is the Routing Number on a Check? (33,100/mo, KD 11)
 * Run: npx tsx scripts/publish-dan1858-routing-number-on-check.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POST = {
  slug: "where-is-routing-number-on-check",
  title: "Where Is the Routing Number on a Check? (And How to Find It Fast)",
  excerpt:
    "Your routing number is the 9-digit number at the bottom-left of any personal check — to the left of your account number. It identifies your bank and is required for wire transfers, ACH payments, direct deposit, and setting up bill pay. Here's exactly where to find it and what it means.",
  category: "finance",
  tags: [
    "routing number",
    "check",
    "banking",
    "direct deposit",
    "ACH transfer",
    "wire transfer",
    "bank routing number",
  ],
  metaTitle: "Where Is the Routing Number on a Check? Quick Guide (2026)",
  metaDescription:
    "Your routing number is the 9-digit number at the bottom-left corner of a check. Find it fast — plus how to locate it online without a checkbook in 2026.",
  relatedComparisonSlugs: [
    "chase-bank-vs-wells-fargo",
    "bank-of-america-vs-wells-fargo",
    "chase-bank-vs-bank-of-america",
  ],
  content: `# Where Is the Routing Number on a Check? (And How to Find It Fast)

**Your routing number is the 9-digit number printed at the bottom-left corner of any personal check.** It appears before your account number and is enclosed by symbols that look like this: ⑆123456789⑆

If you need the quick answer: look at the very bottom of your check, read the numbers from left to right, and the first group of 9 digits — the leftmost number — is your routing number.

---

## Routing Number Location on a Check (Visual Guide)

A standard personal check has three sets of numbers printed along the magnetic ink character recognition (MICR) line at the bottom:

\`\`\`
⑆ ROUTING NUMBER ⑆  ACCOUNT NUMBER ⑆  CHECK NUMBER
   (9 digits)         (8–12 digits)     (4–6 digits)
\`\`\`

**Position:** Bottom-left corner, always first, always exactly 9 digits.

**Example bottom line:**
\`⑆021000021⑆  000123456789⑆  1001\`

In this example:
- **021000021** = Routing number (JPMorgan Chase, New York)
- **000123456789** = Account number
- **1001** = Check number

The transit symbols (⑆) are printed in magnetic ink and mark the boundaries between each section. Your routing number is always between the first two symbols.

---

## What Is a Routing Number?

A routing number (also called an ABA routing number or RTN — Routing Transit Number) is a **9-digit code that identifies your bank** in the U.S. banking system. It was created by the American Bankers Association (ABA) in 1910 and is used to:

- Route funds between financial institutions
- Process ACH (Automated Clearing House) transfers
- Handle direct deposits (payroll, tax refunds, Social Security)
- Facilitate wire transfers
- Set up automatic bill payments
- Verify the bank during electronic transactions

Every U.S. bank has at least one routing number. Large banks like Chase, Bank of America, and Wells Fargo have **multiple routing numbers** — one per region or state — so the routing number on your check depends on where you opened your account, not just which bank you use.

---

## How to Read the Bottom of a Check

Here's exactly what each section means:

| Position | What It Is | Format |
|----------|-----------|--------|
| **First (left)** | Routing number | Always 9 digits |
| **Second (middle)** | Account number | 8–17 digits (varies by bank) |
| **Third (right)** | Check number | Matches the number in the top-right corner |

**Important:** The check number at the bottom is a duplicate of the number printed in the upper-right corner of your check. Don't confuse it with your account number — your account number is the longer number in the middle.

---

## How to Find Your Routing Number Without a Checkbook

No checks handy? You have several options:

### 1. Online Banking / Mobile App
Log in to your bank's website or app:
- **Chase:** Settings → Account Details
- **Bank of America:** Accounts → Account & Routing Number
- **Wells Fargo:** Accounts → Account Summary → Routing Number
- **Citi:** Account Details page
- **Capital One:** Accounts → View Account Details

### 2. Bank's Website
Most banks list their routing numbers publicly. Search:
> "[Your bank name] routing number [your state]"

Remember: large banks have state-specific routing numbers. Always confirm by state.

### 3. Federal Reserve E-Payments Routing Directory
The official source: search.fededirectory.frb.org — maintained by the Federal Reserve, lists all registered ABA routing numbers.

### 4. Call Your Bank
Customer service can give you the correct routing number in under a minute.

### 5. Bank Statement
Some banks print the routing number on paper statements, though this is less common.

---

## Routing Numbers for the Biggest U.S. Banks (2026)

Large banks have multiple routing numbers by region. The most commonly used ones:

| Bank | Common Routing Numbers |
|------|----------------------|
| **Chase (JPMorgan Chase)** | 021000021 (NY), 267084131 (FL), 322271627 (CA) |
| **Bank of America** | 026009593 (NY), 063100277 (FL), 121000358 (CA) |
| **Wells Fargo** | 121042882 (CA/West), 073000228 (IA/Midwest), 053000219 (East) |
| **Citibank** | 021000089 (NY), 321171184 (CA) |
| **Capital One** | 051405515 (VA), 056073502 (MD) |
| **US Bank** | 091000022 (MN), 124303120 (CA) |
| **PNC Bank** | 043000096 (PA), 031207607 (NJ) |
| **Truist** | 061000104 (GA), 053101121 (NC) |

**Always verify your specific routing number** on your own check or in your bank's app — the correct number depends on where your account was opened, and banks update routing numbers when they merge or restructure.

---

## Routing Number vs. Account Number: What's the Difference?

People frequently confuse these two numbers. Here's the key distinction:

| | Routing Number | Account Number |
|--|----------------|----------------|
| **Digits** | Always exactly 9 | 8–17 (varies by bank) |
| **Identifies** | Your bank | Your specific account |
| **Position on check** | Bottom-left (first) | Bottom-center (second) |
| **Changes if you move?** | Yes (state-based) | No |
| **Same for all customers?** | Yes (same bank/state) | No (unique to you) |
| **Public?** | Yes | No — keep private |

**Together**, the routing number + account number uniquely identify your bank account for any electronic payment.

---

## Why Do You Need Your Routing Number?

You'll be asked for your routing number when:

1. **Setting up direct deposit** — payroll, tax refunds, government benefits
2. **ACH transfers** — bank-to-bank transfers (Venmo, Cash App, Zelle linked accounts)
3. **Wire transfers** — domestic wire payments require routing + account number
4. **Online bill pay** — utilities, mortgage, insurance, loan payments
5. **Filing taxes** — IRS direct deposit for refunds
4. **Verifying your bank account** — when linking to apps like PayPal, Robinhood, or Betterment

---

## Common Routing Number Mistakes to Avoid

**Mistake 1: Using the check number as the routing number**
The check number (right side of the MICR line) is only 4–6 digits — routing numbers are always 9 digits. If what you're reading isn't 9 digits, you're in the wrong spot.

**Mistake 2: Using a routing number from the wrong state**
If you opened your Chase account in Texas but now live in California, you still use the Texas routing number — routing numbers are assigned based on where you opened the account, not where you live now.

**Mistake 3: Confusing routing and account numbers**
Your account number is longer (8–12+ digits) and is unique to you. Your routing number is shorter (exactly 9 digits) and is shared by everyone at your bank in your region.

**Mistake 4: Using the routing number from a voided check vs. a deposit slip**
Deposit slips sometimes use a different routing number than personal checks — one is optimized for processing checks, the other for ACH. When setting up direct deposit, always use the routing number from a personal check, not a deposit slip, unless your bank's app specifies otherwise.

---

## Is My Routing Number the Same for Wires and ACH?

**Not always.** Some banks use separate routing numbers for:
- **ACH transfers** (direct deposit, online bill pay)
- **Domestic wire transfers**
- **International wire transfers** (usually uses a SWIFT code instead)

Your check's routing number is typically the ACH routing number. For wire transfers, verify the wire routing number through your bank's app or by calling customer service. Major banks like Chase and Bank of America use the same routing number for both ACH and domestic wires; others like Wells Fargo distinguish between them.

---

## Routing Number FAQs

**Is it safe to share my routing number?**
Your routing number is semi-public information — it's printed on your checks and is the same for all customers at your bank in a given state. By itself, it's not sensitive. However, sharing your routing number *and* account number together gives someone enough information to initiate an ACH debit from your account. Share the combination only with trusted parties (employers, IRS, verified billers).

**Can I have multiple routing numbers for the same bank?**
Yes — if you have accounts at the same bank in different states (opened at different times), each account may have its own routing number based on where it was opened.

**Does my routing number change if I get a new debit card?**
No. A new debit card number doesn't change your routing number or account number. Your routing number is tied to your bank account, not your card.

**What if my routing number has fewer than 9 digits?**
Routing numbers are always exactly 9 digits. If the number you found has fewer digits, you may be reading it incorrectly — check for leading zeros (e.g., a routing number that starts with 0 might appear to have only 8 digits visually).

**Do savings accounts have the same routing number as checking accounts?**
Generally yes — if you have a checking and savings account at the same bank in the same state, they share the same routing number. The account number is what differentiates them.

---

## Summary: Finding Your Routing Number in 30 Seconds

1. **On a check:** Look at the bottom-left — the first 9-digit number
2. **In your banking app:** Account Details or Account Summary section
3. **On your bank's website:** Search "[Bank name] routing number [your state]"
4. **Call your bank:** Customer service gives it in under a minute

The routing number is always **9 digits**, always at the **bottom-left** of your check, and always comes **before** your account number.

For a side-by-side comparison of the biggest U.S. banks — including how their routing systems, fee structures, and digital banking features compare — see our [Chase vs Wells Fargo comparison](/compare/chase-bank-vs-wells-fargo).

### Related Comparisons
- [Chase Bank vs Wells Fargo](/compare/chase-bank-vs-wells-fargo)
- [Bank of America vs Wells Fargo](/compare/bank-of-america-vs-wells-fargo)
- [Chase Bank vs Bank of America](/compare/chase-bank-vs-bank-of-america)
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
  console.log(`DAN-1858: Publishing blog post — ${POST.title}...\n`);

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

  // Add FAQ to Chase vs Wells Fargo comparison page
  console.log("\n→ Adding FAQ to comparison pages...");
  await addFaqToComparison(
    "chase-bank-vs-wells-fargo",
    "Where is the routing number on a Chase or Wells Fargo check?",
    "The routing number is the 9-digit number at the bottom-left corner of any personal check, to the left of your account number. For Chase, the routing number varies by state (e.g., 021000021 in NY, 322271627 in CA). For Wells Fargo, common routing numbers include 121042882 (West/CA) and 073000228 (Midwest). Always verify yours in your banking app or by checking your own checkbook — large banks have multiple routing numbers by region.",
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
