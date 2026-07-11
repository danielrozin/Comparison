/**
 * DAN-1976: Week 8 /tools/ Pages — 3 calculator/tool landing pages.
 * Targets: mortgage-calculator (~1.2M/mo), bmi-calculator (~550k/mo), tip-calculator (~200k/mo).
 * Run: npx tsx scripts/publish-dan1976-tools-pages.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PAGES = [
  // ── PAGE 1: Mortgage Calculator (~1,200,000/mo) ──────────────────────────
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator: Monthly Payment Formula Explained",
    excerpt:
      "Use our guide to understand how mortgage calculators work, what the monthly payment formula means, and how to interpret your results — including amortization, PMI, and total interest paid.",
    category: "tools",
    tags: [
      "mortgage calculator",
      "monthly mortgage payment",
      "how to calculate mortgage",
      "mortgage payment formula",
      "amortization calculator",
      "home loan calculator",
      "mortgage interest calculator",
    ],
    metaTitle: "Mortgage Calculator: How It Works & What the Numbers Mean",
    metaDescription:
      "Learn how mortgage calculators compute your monthly payment, total interest, and amortization schedule. Understand PMI, escrow, and how to lower your payment. Free guide.",
    relatedComparisonSlugs: [
      "buying-vs-renting-a-home",
      "fixed-rate-vs-adjustable-rate-mortgage",
      "conventional-loan-vs-fha-loan",
      "15-year-vs-30-year-mortgage",
    ],
    content: `# Mortgage Calculator: How It Works & What the Numbers Mean

A mortgage calculator takes four inputs — home price, down payment, interest rate, and loan term — and tells you your estimated monthly payment. Behind that number is a standard formula that banks, lenders, and financial planners have used for decades. Understanding it puts you in control of your biggest financial decision.

---

## The Monthly Mortgage Payment Formula

The formula for a fixed-rate mortgage payment is:

**M = P × [r(1+r)^n] / [(1+r)^n − 1]**

Where:
- **M** = monthly payment
- **P** = principal loan amount (home price minus down payment)
- **r** = monthly interest rate (annual rate ÷ 12)
- **n** = number of payments (loan term in years × 12)

**Example:** $400,000 home, 20% down ($80,000), 6.5% interest rate, 30-year term.

- Principal (P): $320,000
- Monthly rate (r): 6.5% ÷ 12 = 0.5417% = 0.005417
- Number of payments (n): 30 × 12 = 360

Monthly payment = $320,000 × [0.005417 × (1.005417)^360] / [(1.005417)^360 − 1] = **$2,022/month**

Over 30 years, you'd pay $728,000 total — $408,000 in interest on top of your $320,000 principal.

---

## What Goes Into Your Total Monthly Payment (PITI)

Most mortgage calculators show principal + interest only. Your actual monthly cost includes four components, often called **PITI**:

| Component | What It Is | Typical Amount |
|-----------|-----------|---------------|
| **P**rincipal | Loan repayment | Varies by balance |
| **I**nterest | Cost of borrowing | Largest share early on |
| **T**axes | Property tax (escrowed) | 1–2% of home value/year |
| **I**nsurance | Homeowner's insurance | $100–$300/month |

If your down payment is less than 20%, add **Private Mortgage Insurance (PMI)**: typically 0.5%–1.5% of the loan amount annually, divided into monthly payments. On a $320,000 loan, that's $133–$400/month until you reach 20% equity.

---

## How to Use a Mortgage Calculator

1. **Enter the home price** — the purchase price you're targeting.
2. **Set your down payment** — typically 3%–20%. A 20% down payment eliminates PMI.
3. **Enter the interest rate** — use current market rates or the rate from your lender's pre-approval.
4. **Choose your loan term** — 30 years is most common; 15 years costs more monthly but far less in total interest.
5. **Add taxes and insurance** — for an accurate total monthly cost.

Use a trusted calculator like [NerdWallet's Mortgage Calculator](https://www.nerdwallet.com/mortgages/mortgage-calculator) or [Bankrate's Mortgage Calculator](https://www.bankrate.com/mortgages/mortgage-calculator/) to run scenarios.

---

## What the Results Tell You

**Monthly payment:** The minimum you owe the lender each month. Paying even $100 extra per month toward principal significantly shortens your loan and cuts total interest.

**Total interest paid:** Over a 30-year mortgage at 6.5%, you often pay more in interest than your original loan amount. This is why making extra principal payments early — when interest charges are highest — has an outsized effect.

**Amortization schedule:** A table showing how each payment splits between interest and principal. Early payments are mostly interest; late payments are mostly principal. This is why selling after just 2–3 years of ownership often means you've barely reduced the principal.

**Break-even point:** If you're refinancing, divide closing costs by your monthly savings to find how many months until you break even. If you plan to sell before that point, refinancing doesn't make financial sense.

---

## How to Lower Your Monthly Payment

- **Increase your down payment** — every additional dollar reduces the principal and eliminates PMI sooner.
- **Extend the loan term** — a 30-year term has lower payments than 15 years, though you pay more interest overall.
- **Improve your credit score** — a 760+ credit score typically qualifies for the best rates, often 0.5%–1% lower than a 680 score.
- **Buy down the rate with points** — paying 1% of the loan upfront reduces your rate by roughly 0.25%.
- **Shop multiple lenders** — rate differences of even 0.5% can save $30,000–$80,000 over a 30-year mortgage.

---

## Frequently Asked Questions

**How accurate are mortgage calculators?**
For principal + interest, very accurate — the formula is standard. Taxes, insurance, and PMI estimates vary by location and lender. Always get a Loan Estimate (the standardized disclosure lenders must provide) for exact numbers.

**Does a 15-year or 30-year mortgage make more sense?**
A 30-year mortgage has lower monthly payments; a 15-year mortgage has a lower interest rate and you pay roughly half the total interest. The right choice depends on your income stability, investment opportunities, and risk tolerance. See our [15-year vs 30-year mortgage comparison](/compare/15-year-vs-30-year-mortgage) for a full breakdown.

**What credit score do I need for the best mortgage rate?**
Most lenders reserve their best rates for credit scores of 760 or higher. Scores below 620 typically can't qualify for conventional loans. Improving your score from 680 to 760 before applying can save tens of thousands of dollars over the life of the loan.

**How much house can I afford?**
A common rule is that your total housing costs (PITI) should not exceed 28% of your gross monthly income, and total debt payments should not exceed 36% (the 28/36 rule). On a $100,000 annual income (~$8,333/month), that's a maximum housing payment of about $2,333/month.`,
  },

  // ── PAGE 2: BMI Calculator (~550,000/mo) ─────────────────────────────────
  {
    slug: "bmi-calculator",
    title: "BMI Calculator: Formula, Ranges & What Your Number Means",
    excerpt:
      "Learn how to calculate your Body Mass Index (BMI), what the formula is, what the healthy ranges mean, and the well-documented limitations of BMI as a health metric.",
    category: "tools",
    tags: [
      "bmi calculator",
      "body mass index",
      "bmi formula",
      "what is a healthy bmi",
      "bmi chart",
      "calculate bmi",
      "bmi ranges",
    ],
    metaTitle: "BMI Calculator: Formula, Ranges & What Your Score Means",
    metaDescription:
      "Calculate your BMI and understand what it means. Learn the BMI formula, healthy ranges by age and sex, and why BMI is a limited health metric. Free guide with examples.",
    relatedComparisonSlugs: [
      "bmi-vs-body-fat-percentage",
      "keto-vs-mediterranean-diet",
      "whoop-vs-oura-ring",
      "treadmill-vs-elliptical",
    ],
    content: `# BMI Calculator: Formula, Ranges & What Your Score Means

Body Mass Index (BMI) is the most widely used screening tool in medicine for categorizing weight relative to height. A single number from a simple formula — it's used in clinical settings, insurance assessments, and public health research worldwide. But it's also widely misunderstood and has well-documented limitations. Here's how it works and what it can (and can't) tell you.

---

## The BMI Formula

BMI is calculated differently depending on whether you use metric or imperial units:

**Metric (kg and cm):**
**BMI = weight (kg) ÷ height (m)²**

**Imperial (lbs and inches):**
**BMI = [weight (lbs) ÷ height (inches)²] × 703**

**Example (metric):** Person weighs 75 kg, height is 1.75 m.
BMI = 75 ÷ (1.75)² = 75 ÷ 3.0625 = **24.5**

**Example (imperial):** Person weighs 165 lbs, height is 69 inches (5'9").
BMI = [165 ÷ (69)²] × 703 = [165 ÷ 4,761] × 703 = 0.03466 × 703 = **24.4**

Use a trusted calculator like [CDC's BMI Calculator](https://www.cdc.gov/bmi/adult-calculator/index.html) or [NIH's BMI Calculator](https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm) for instant results.

---

## BMI Ranges for Adults (18+)

The World Health Organization (WHO) and CDC use the same classification system for adults:

| BMI Range | Category |
|-----------|----------|
| Below 18.5 | Underweight |
| 18.5 – 24.9 | Normal weight (healthy) |
| 25.0 – 29.9 | Overweight |
| 30.0 – 34.9 | Obese (Class I) |
| 35.0 – 39.9 | Obese (Class II) |
| 40.0 and above | Obese (Class III) |

**Note for children and teens:** BMI ranges are age- and sex-specific for those under 18. The same BMI number means different things at different ages. Use the CDC's child BMI calculator for accurate classification.

---

## How to Interpret Your BMI

**Healthy range (18.5–24.9):** Most clinical guidelines associate this range with the lowest risk of weight-related health conditions like Type 2 diabetes, hypertension, and cardiovascular disease. However, "healthy BMI" does not mean "healthy person" — fitness, diet, blood markers, and genetics all matter.

**Overweight (25–29.9):** Associated with modestly increased health risk. For many people in this range, risk factors (blood pressure, blood sugar, cholesterol) are still normal. This is where BMI's limitations show most clearly — an athletic person with high muscle mass often lands here.

**Obese (30+):** Clinical research consistently links BMI above 30 with significantly higher risk of metabolic disease, cardiovascular disease, sleep apnea, and joint problems. This is where weight loss interventions typically have the strongest evidence base.

**Underweight (below 18.5):** Associated with malnutrition risk, bone density loss, immune suppression, and in severe cases, organ damage. Being underweight is often overlooked in conversations about health risks.

---

## What BMI Doesn't Measure

BMI is a screening tool, not a diagnostic test. It has well-documented limitations:

**It doesn't account for body composition.** Muscle is denser than fat. A 200-lb athlete with 10% body fat and a sedentary person with 30% body fat have the same BMI — but vastly different health profiles. This is why many fit athletes are classified as "overweight" or even "obese" by BMI.

**It doesn't account for fat distribution.** Where body fat is stored matters as much as how much. Visceral fat (around the abdomen) is more metabolically harmful than subcutaneous fat (under the skin). Waist circumference — over 40 inches for men, over 35 inches for women — is often a better predictor of metabolic risk than BMI alone.

**It varies by ethnicity.** Research shows that health risks associated with excess weight occur at lower BMI thresholds in South, East, and Southeast Asian populations. Many health organizations recommend lower BMI cutpoints (e.g., overweight starting at 23) for these groups.

**It doesn't distinguish age-related changes.** Older adults typically have more body fat at the same BMI compared to younger adults, and muscle loss (sarcopenia) can make an older person appear "healthy weight" when they are actually metabolically compromised.

---

## Better Metrics to Use Alongside BMI

| Metric | What It Measures | How to Measure |
|--------|-----------------|----------------|
| Waist circumference | Abdominal fat (visceral) | Tape measure at navel level |
| Waist-to-height ratio | Relative abdominal fat | Waist (cm) ÷ height (cm); healthy = below 0.5 |
| Body fat percentage | Actual fat vs. lean mass | DEXA scan (most accurate), bioimpedance, calipers |
| Resting metabolic rate | Caloric baseline | Indirect calorimetry or estimation formulas |

For most people, BMI combined with waist circumference gives a much better picture of weight-related health risk than BMI alone.

---

## Frequently Asked Questions

**Is a BMI of 25 considered overweight?**
Yes, according to WHO and CDC classifications, a BMI of 25.0 or above is classified as "overweight." However, this is a statistical threshold derived from population studies, not a clinical diagnosis. A single number doesn't determine health — your doctor will look at blood pressure, blood glucose, cholesterol, fitness level, and other markers alongside BMI.

**What BMI is considered obese?**
A BMI of 30.0 or above is classified as obese. This is further divided into Class I (30–34.9), Class II (35–39.9), and Class III (40+, sometimes called "morbid obesity" though the term is increasingly discouraged in clinical settings).

**Can you be healthy with a high BMI?**
Yes. "Metabolically healthy obesity" is a recognized phenomenon — some people with BMI above 30 have normal blood pressure, blood sugar, and cholesterol. Conversely, "normal weight metabolic obesity" exists — people with healthy BMI who have poor metabolic markers. BMI predicts group-level risk well but is a poor individual diagnostic tool.

**How often should I check my BMI?**
For most healthy adults, checking annually (e.g., at a yearly physical) is sufficient. Frequent checking isn't clinically useful and can contribute to unhealthy focus on a single number. If you're actively working toward weight loss or gain goals, monthly tracking alongside other metrics (waist measurement, fitness benchmarks) gives a more complete picture.`,
  },

  // ── PAGE 3: Tip Calculator (~200,000/mo) ─────────────────────────────────
  {
    slug: "tip-calculator",
    title: "Tip Calculator: How to Calculate a Tip and Who to Tip",
    excerpt:
      "Learn the simple formula for calculating a tip on any bill, standard tipping rates by service type, how to split a tip among multiple people, and answers to common tipping questions.",
    category: "tools",
    tags: [
      "tip calculator",
      "how to calculate a tip",
      "tip percentage",
      "how much to tip",
      "restaurant tip calculator",
      "split tip calculator",
      "gratuity calculator",
    ],
    metaTitle: "Tip Calculator: Formula, Rates & How Much to Tip in 2026",
    metaDescription:
      "Calculate a tip instantly and learn standard tipping rates by service type, how to split a bill, and when tipping etiquette has changed. Simple guide for restaurants, rideshares, and more.",
    relatedComparisonSlugs: [
      "venmo-vs-cash-app",
      "paypal-vs-venmo",
      "doordash-vs-ubereats",
      "uber-vs-lyft",
    ],
    content: `# Tip Calculator: How to Calculate a Tip and How Much to Leave

Tipping has become more complex — and more contested — in recent years. Tip prompts on tablet screens now appear at coffee counters, bakeries, and self-checkout kiosks. At the same time, standard restaurant tip expectations have risen. This guide covers the math, the current norms, and the situations where tipping etiquette is genuinely unclear.

---

## The Tip Calculation Formula

Calculating a tip is straightforward:

**Tip amount = Bill total × (Tip percentage ÷ 100)**

**Total with tip = Bill total + Tip amount**

**Example:** $65 restaurant bill, 20% tip.
- Tip = $65 × 0.20 = **$13.00**
- Total = $65 + $13 = **$78.00**

**The quick mental math shortcut:**
1. Move the decimal one place left to get 10% ($65 → $6.50)
2. Double it for 20% ($6.50 × 2 = $13.00)
3. Add half of 10% for 15% ($6.50 + $3.25 = $9.75)

Use [NerdWallet's Tip Calculator](https://www.nerdwallet.com/article/finance/tip-calculator) or [Calculator.net's Tip Calculator](https://www.calculator.net/tip-calculator.html) to split tips between multiple people automatically.

---

## Standard Tipping Rates by Service Type (2026)

| Service | Standard Tip | Notes |
|---------|-------------|-------|
| Sit-down restaurant | 18–22% | 20% is now the baseline expectation |
| Bar / cocktails | $1–2 per drink, or 15–20% | Higher for complicated orders |
| Bartender (open bar) | $1–2 per drink regardless | |
| Food delivery (DoorDash, Uber Eats) | 15–20% of order, min $3–5 | Higher for long distances or bad weather |
| Coffee shop / café counter | 10–15% optional | Not expected; increasingly prompted |
| Rideshare (Uber, Lyft) | 15–20% | Not required; added after the ride |
| Taxi | 15–20% | |
| Hotel housekeeping | $2–5 per night | Left daily for the cleaner on duty |
| Hotel bellhop / valet | $2–5 per interaction | |
| Hair salon / barber | 15–20% | |
| Nail salon | 15–20% | |
| Spa services (massage, facial) | 15–20% | |
| Food truck | 10–15% optional | No expectation, but appreciated |
| Grocery delivery (Instacart) | 5–10%, min $3 | |
| Movers | $20–50 per mover for a full-day move | Cash preferred |
| Pizza delivery | 15–20%, min $3–4 | |

**Tip prompts at counter service (coffee shops, bakeries, fast food):** There is no universal expectation here. These are businesses that previously didn't receive tips. Whether you tip is genuinely a personal choice — neither expected nor clearly rude to skip.

---

## How to Split a Tip Between Multiple People

When splitting a bill with a group, calculate the total for the table first, then divide:

1. Add up the total bill (before tax in some regions, after tax in others — both are acceptable)
2. Apply the tip percentage to the full bill
3. Add tip to the total
4. Divide by the number of people

**Example:** $180 dinner for 4 people, 20% tip.
- Tip: $180 × 0.20 = $36
- Total with tip: $216
- Per person: $216 ÷ 4 = **$54 each**

If people ordered very different amounts, splitting by what each person ordered (plus a shared tip) is more equitable. Apps like Splitwise, Venmo, and PayPal make this easier.

---

## Pre-Tax vs. Post-Tax Tipping

In the US, tipping is typically calculated on the pre-tax bill. However, many people tip on the total (post-tax) amount, and servers generally prefer this. The difference on a $100 bill with 8% sales tax and 20% tip:

- Pre-tax: $100 × 20% = $20 tip
- Post-tax: $108 × 20% = $21.60 tip

Either is acceptable. Tipping on pre-tax is technically correct; tipping on post-tax is increasingly common and more generous.

---

## When Tipping Is Included (and When It's Not)

**Automatic gratuity:** Many restaurants add a mandatory gratuity (typically 18–20%) for parties of 6 or more. Check your bill before adding more — you don't need to tip twice. The check will show "gratuity included" or "service charge included."

**Service charges:** Some restaurants have replaced tips with a flat service charge (typically 20–22%) added to all bills. This money may be distributed differently than tips — some goes to the kitchen, some to servers. These are not optional and are disclosed on menus.

**"No tipping" restaurants:** A small number of restaurants pay staff a living wage and prohibit tipping. The menu will note this. Leaving a tip is unnecessary and may be declined.

---

## Frequently Asked Questions

**What is a standard restaurant tip in 2026?**
The expectation has shifted upward over the past decade. In 2026, 20% is generally considered the standard tip for adequate service at a sit-down restaurant. 18% is acceptable for average service; 25% or more signals exceptional service. Tipping below 15% is seen as commentary on the service quality.

**Do I have to tip if service was bad?**
Tipping is voluntary in the US. However, servers are paid a sub-minimum "tipped wage" (as low as $2.13/hour federally, though many states have higher minimums) and depend on tips for most of their income. If the problem was with the food or kitchen — not the server's effort — many customers still tip normally and address the issue with the manager. For genuinely bad service (rudeness, neglect), 10% or less is one way to signal it.

**How much do you tip for food delivery?**
The general guideline is 15–20% of the order total, with a minimum of $3–5 for small orders. Delivery drivers use their own vehicles, pay their own gas, and are often gig workers without employer benefits. Increasing the tip for long distances, bad weather, or large or heavy orders is common practice.

**Is it rude not to tip at a coffee shop?**
Not tipping at a coffee counter is not considered rude by most etiquette standards — counter service tips are optional, not expected. The increasing prevalence of tip prompts on payment tablets has created social pressure that doesn't reflect historical norms. If you tip, it's appreciated. If you don't, it's not an etiquette violation.`,
  },
];

async function main() {
  console.log(`DAN-1976: Publishing ${PAGES.length} tools landing pages...\n`);

  let success = 0;
  const urls: string[] = [];

  for (const page of PAGES) {
    console.log(`→ ${page.slug}`);
    try {
      await prisma.blogArticle.upsert({
        where: { slug: page.slug },
        create: {
          slug: page.slug,
          title: page.title,
          excerpt: page.excerpt,
          content: page.content,
          category: page.category,
          tags: page.tags,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          relatedComparisonSlugs: page.relatedComparisonSlugs,
          status: "published",
          isAutoGenerated: false,
          publishedAt: new Date(),
        },
        update: {
          title: page.title,
          excerpt: page.excerpt,
          content: page.content,
          category: page.category,
          tags: page.tags,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          relatedComparisonSlugs: page.relatedComparisonSlugs,
          status: "published",
          publishedAt: new Date(),
        },
      });
      console.log(`  ✓ Published`);
      urls.push(`https://www.aversusb.net/tools/${page.slug}`);
      success++;
    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }

  const total = await prisma.blogArticle.count({
    where: { status: "published", category: "tools" },
  });

  console.log(`\n✓ ${success}/${PAGES.length} tool pages published.`);
  console.log(`Total published tools articles: ${total}`);
  console.log("\nLive URLs (after Vercel deploy):");
  urls.forEach((u) => console.log(`  ${u}`));

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
