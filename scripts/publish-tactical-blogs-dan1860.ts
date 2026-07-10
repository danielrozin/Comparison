/**
 * DAN-1860: Blog — How to Endorse a Check to Someone Else (12,100/mo, KD 1)
 * Run: npx tsx scripts/publish-tactical-blogs-dan1860.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const POSTS = [
  {
    slug: "how-to-endorse-a-check-to-someone-else",
    title: "How to Endorse a Check to Someone Else",
    excerpt:
      "To endorse a check to someone else, sign the back with 'Pay to the order of [Name]' followed by your signature. This is called a third-party endorsement or signing a check over. Not all banks accept signed-over checks — here's how to do it correctly and what to watch out for.",
    category: "finance",
    tags: [
      "endorse a check",
      "third-party check",
      "sign over a check",
      "check endorsement",
      "banking",
      "personal finance",
    ],
    metaTitle:
      "How to Endorse a Check to Someone Else (Sign It Over) — 2026 Guide",
    metaDescription:
      "Sign a check over to someone else by writing 'Pay to the order of [Name]' on the back, then your signature. Learn which banks accept third-party checks, when they refuse, and how to do it right.",
    relatedComparisonSlugs: [
      "chase-vs-bank-of-america",
      "wells-fargo-vs-chase",
      "bank-of-america-vs-wells-fargo",
    ],
    content: `# How to Endorse a Check to Someone Else

Need to hand a check to someone else instead of depositing it yourself? You can sign a check over to another person — but only if you follow the correct steps and the receiving bank accepts it. Here's everything you need to know about **third-party check endorsements**.

## What Does It Mean to Endorse a Check to Someone Else?

Endorsing a check to someone else means you transfer your right to cash or deposit that check to another person. This is called a **third-party endorsement** (or "signing a check over"). Instead of cashing it yourself, you authorize the other person to do so in your place.

**Common reasons to sign a check over:**
- You want a family member to deposit it on your behalf
- You owe someone money and want to hand them a check you received
- You received a check while traveling and someone else will handle it
- You're a business owner assigning a customer's check to a vendor

## How to Endorse a Check to Someone Else: Step-by-Step

### Step 1 — Confirm the bank will accept it

Before signing anything, **call the bank where the check will be deposited** and ask if they accept third-party endorsed checks. Many banks — including Chase and Bank of America — have strict policies limiting or outright refusing third-party checks due to fraud risk. Getting confirmation first saves you from a voided endorsement.

### Step 2 — Find the endorsement area on the back of the check

Flip the check over. On the back, you'll see a small box or lines labeled "Endorse check here" or "Do not write, stamp, or sign below this line." The endorsement area is typically the top 1.5 inches of the back of the check.

### Step 3 — Write "Pay to the order of [Full Name]"

In the endorsement area, write the following exactly:

> **Pay to the order of [Recipient's Full Legal Name]**

Replace *[Recipient's Full Legal Name]* with the full name of the person you're signing the check over to. Use the name exactly as it appears on their bank account or government ID.

### Step 4 — Sign your name below

Directly beneath the "Pay to the order of..." line, sign your name exactly as it appears on the front of the check (the payee line). If the check is made out to "Jane M. Smith," sign "Jane M. Smith" — not just "Jane."

### Step 5 — Have the recipient endorse below your signature

The person receiving the check should also sign their name in the endorsement area, below your signature. Some banks require both signatures to process a third-party check.

### Step 6 — The recipient deposits or cashes the check

The recipient takes the check to their bank with a valid photo ID. The bank will verify both signatures and decide whether to accept the check. They may place a hold on the funds for several business days.

---

## Example of a Correctly Endorsed Third-Party Check

Here's what the back of the check should look like:

\`\`\`
Pay to the order of Robert Johnson
Jane M. Smith              ← original payee's signature
Robert Johnson             ← recipient's signature (often required)
\`\`\`

---

## Types of Check Endorsements

| Endorsement Type | What It Looks Like | When to Use |
|-----------------|-------------------|-------------|
| **Blank endorsement** | Just your signature | You're cashing or depositing it yourself |
| **Restrictive endorsement** | "For deposit only" + your signature | Deposit to your own account only, limits fraud |
| **Special/third-party endorsement** | "Pay to the order of [Name]" + your signature | Signing the check over to another person |
| **Conditional endorsement** | Rare — adds a condition for payment | Almost never accepted by banks |

For handing a check to someone else, always use a **special endorsement** (the third-party method described above).

---

## Do Banks Accept Third-Party Endorsed Checks?

This is the most important thing to understand: **many banks no longer accept third-party checks** or have strict limits on when they will.

| Bank | Third-Party Check Policy |
|------|-------------------------|
| **Chase** | Generally does NOT accept third-party checks; exceptions rare |
| **Bank of America** | Does not accept at most branches; may accept for known customers |
| **Wells Fargo** | Policies vary by branch; call ahead |
| **U.S. Bank** | Limited acceptance; may require both parties to be present |
| **Credit unions** | Often more flexible; call your specific credit union |
| **Community banks** | Typically more willing to accept with proper ID |

**Bottom line:** Always call the recipient's bank BEFORE endorsing the check. Once you've written on the back, you've committed to the endorsement even if the bank refuses it.

---

## Why Do Banks Refuse Third-Party Checks?

Banks reject third-party checks primarily because of **check fraud**. A common scam involves someone receiving a fake check, endorsing it to an accomplice, and the victim being held responsible when the check bounces. Banks have shifted responsibility to customers by refusing checks they can't verify.

Additional reasons banks refuse them:
- The original payee can later claim they never signed it over
- Difficult to verify both parties' identities remotely
- Increased risk of altered or forged endorsements

---

## When Signing a Check Over Is NOT Possible

Some checks cannot be endorsed to a third party under any circumstances:

- **Government checks** (IRS tax refunds, Social Security, stimulus checks) — federal law prohibits third-party endorsement of government checks
- **Checks marked "Non-transferable"** — some issuers print this explicitly
- **Two-party checks** — if the check is made out to "John Smith AND Jane Doe" (using AND), both people must endorse; if it says "John Smith OR Jane Doe," either person can sign it over
- **Checks over the bank's dollar threshold** — some banks set a limit (e.g., $500 or $1,000) for third-party checks
- **Money orders from USPS or MoneyGram** — usually cannot be signed over, as they have specific transfer restrictions

---

## Alternatives to Signing a Check Over

If the bank won't accept a third-party check, consider these options instead:

1. **Cash the check yourself first**, then give the person cash or write your own check to them
2. **Mobile deposit the check** into your account, then transfer the money electronically (Zelle, Venmo, bank transfer)
3. **Have the original issuer reissue the check** in the recipient's name — works when the check hasn't been deposited yet
4. **Open a joint account** — if this is a recurring situation (e.g., a family member), a joint account lets either person deposit checks made out to the account

---

## Frequently Asked Questions

**Can I sign a check over to anyone?**
Technically yes — to any person or business. But the recipient's bank must also agree to accept it. Many banks refuse third-party checks entirely, so check before signing.

**What if the check is made out to two people?**
- If it says "AND" between names (e.g., "John AND Jane"): both must endorse it.
- If it says "OR" between names (e.g., "John OR Jane"): either person can cash or endorse it alone.

**Can I sign a government check over to someone else?**
No. Tax refund checks, Social Security checks, and other government-issued checks cannot be signed over to a third party. You must deposit the check into your own account.

**Do both people need to be at the bank at the same time?**
Not necessarily, but some banks require both the original payee and the new recipient to be present together for the third-party endorsement to be accepted. Call ahead to find out.

**Is there a limit on the amount I can sign over?**
The check itself has no legal endorsement limit, but the receiving bank may impose its own dollar threshold for third-party checks (commonly $500–$1,000).

**What if the recipient's bank won't accept the check?**
Cash the check yourself first (at your own bank or a check-cashing service), then give the person the cash or transfer the funds electronically.

**Can I sign a check over to a business?**
Yes. Write "Pay to the order of [Business Name]" exactly as the business name appears on their bank account. A business representative will then need to endorse the check with the company's authorized signature.

**How long does a signed-over check take to clear?**
Third-party checks often take longer to clear — typically 2–5 business days — because banks apply additional scrutiny to these deposits.

---

## The Bottom Line

Endorsing a check to someone else is straightforward — write "Pay to the order of [Full Name]" on the back, then sign your name. The hard part is finding a bank that will accept it. Most major banks (Chase, Bank of America) have stopped accepting third-party checks to prevent fraud. Always call the recipient's bank first. If they refuse, your easiest path is to cash the check yourself and transfer the funds electronically.

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
    `DAN-1860: Publishing "How to Endorse a Check to Someone Else" (12,100/mo, KD 1)...\n`
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
    "Can I sign a check over to someone at Chase or Bank of America?",
    "Generally no — both Chase and Bank of America have largely stopped accepting third-party endorsed checks due to fraud risk. Your best alternative is to deposit the check into your own account and then transfer the funds electronically via Zelle or a bank transfer to the other person.",
    11
  );

  await addFaqToComparison(
    "wells-fargo-vs-chase",
    "Do Wells Fargo or Chase accept third-party endorsed checks?",
    "Both Wells Fargo and Chase have restrictive policies on third-party (signed-over) checks and typically refuse them at most branches. Call your specific branch before attempting to deposit a check endorsed to someone else. If refused, cash the check yourself and transfer the money via Zelle or wire transfer.",
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
