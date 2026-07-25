/**
 * DAN-2006: Week 9 /tools/ Pages — 3 additional calculator/tool landing pages.
 * Targets: percentage-calculator (~500k/mo), age-calculator (~200k/mo), calorie-calculator (~200k/mo).
 * Run: npx tsx scripts/publish-dan2006-tools-pages.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PAGES = [
  // ── PAGE 1: Percentage Calculator (~500,000/mo) ──────────────────────────
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator: Formulas, Examples & Common Uses",
    excerpt:
      "Learn the three core percentage formulas — percent of a number, percent change, and what percent X is of Y — with worked examples, quick mental math tricks, and answers to the most common percentage questions.",
    category: "tools",
    tags: [
      "percentage calculator",
      "how to calculate percentage",
      "percent of a number",
      "percent change formula",
      "percentage difference",
      "percentage increase calculator",
      "percentage decrease",
    ],
    metaTitle: "Percentage Calculator: 3 Formulas, Examples & Quick Tricks",
    metaDescription:
      "Calculate any percentage instantly. Learn the 3 core percentage formulas with worked examples — percent of a number, percent change, and what % X is of Y. Free guide with tips.",
    relatedComparisonSlugs: [
      "simple-interest-vs-compound-interest",
      "gross-vs-net-income",
      "roth-ira-vs-traditional-ira",
      "sales-tax-vs-vat",
    ],
    content: `# Percentage Calculator: 3 Formulas, Examples & Quick Tricks

Percentages show up everywhere — discount prices, tax rates, test scores, investment returns, tip calculations, and salary negotiations. There are three core percentage calculations, each with its own formula. Once you know which one to use, the math is straightforward.

---

## The 3 Core Percentage Formulas

### Formula 1: What is X% of Y? (Find the Part)

**Part = (Percentage ÷ 100) × Whole**

This is the most common calculation — finding a percentage of a given number.

**Example:** What is 15% of $240?
- Part = (15 ÷ 100) × 240 = 0.15 × 240 = **$36**

**Real-world uses:** Calculating a tip, a sales tax, a commission, or a discount amount.

---

### Formula 2: X is what percent of Y? (Find the Percentage)

**Percentage = (Part ÷ Whole) × 100**

Use this when you know both numbers and want to express their relationship as a percentage.

**Example:** 45 out of 60 questions answered correctly — what percent is that?
- Percentage = (45 ÷ 60) × 100 = 0.75 × 100 = **75%**

**Real-world uses:** Test scores, conversion rates, market share, batting averages.

---

### Formula 3: Percentage Change (Increase or Decrease)

**Percentage Change = [(New Value − Old Value) ÷ Old Value] × 100**

A positive result is a percentage increase; a negative result is a percentage decrease.

**Example (increase):** Stock price went from $80 to $96. What's the percent change?
- Percentage Change = [(96 − 80) ÷ 80] × 100 = [16 ÷ 80] × 100 = **+20%**

**Example (decrease):** Product price dropped from $50 to $42. What's the percent decrease?
- Percentage Change = [(42 − 50) ÷ 50] × 100 = [−8 ÷ 50] × 100 = **−16%**

**Real-world uses:** Year-over-year revenue growth, price changes, inflation rates, weight loss tracking.

---

## Percentage Difference vs. Percentage Change

These are not the same thing:

| Term | Formula | When to Use |
|------|---------|------------|
| Percentage Change | [(New − Old) ÷ Old] × 100 | Comparing a value to its previous state (directional) |
| Percentage Difference | [|A − B| ÷ ((A + B) ÷ 2)] × 100 | Comparing two values with no defined "before/after" (neutral) |

**Example:** Comparing the price of two TVs — $500 and $650. There's no "old" and "new," just two prices. Use percentage difference:
- Difference = [|500 − 650| ÷ ((500 + 650) ÷ 2)] × 100 = [150 ÷ 575] × 100 = **26.1% difference**

---

## Quick Mental Math Tricks

**10% shortcut:** Move the decimal one place left. 10% of $340 = $34.

**Build from 10%:**
- 5% = half of 10% ($34 ÷ 2 = $17)
- 20% = double 10% ($34 × 2 = $68)
- 15% = 10% + 5% ($34 + $17 = $51)
- 25% = one quarter of the number ($340 ÷ 4 = $85)

**Reverse tip trick:** To find 18% mentally, find 20% (double of 10%) then subtract 10% of that. 20% of $65 = $13; 10% of $13 = $1.30; 18% ≈ $13 − $1.30 = **$11.70**.

**The flip trick:** "What percent of A is B?" gives the same answer as "What percent of B is A?" — just inverted. 25% of 80 = 20; and 20 is 25% of 80, which means 80 is 400% of 20. If you need a quick sanity check, flip the fraction.

---

## Common Percentage Calculations Reference

| Scenario | Formula | Example |
|---------|---------|---------|
| Sales tax | Price × (Tax rate ÷ 100) | $100 × 0.08 = $8 tax |
| Discount | Original × (Discount % ÷ 100) | $200 × 0.30 = $60 off |
| Tip | Bill × (Tip % ÷ 100) | $85 × 0.20 = $17 tip |
| Grade/score | (Points earned ÷ Total) × 100 | (42 ÷ 50) × 100 = 84% |
| Profit margin | (Profit ÷ Revenue) × 100 | ($20 ÷ $100) × 100 = 20% |
| Investment return | [(Final − Initial) ÷ Initial] × 100 | [(1200 − 1000) ÷ 1000] × 100 = 20% |
| Pay raise | [(New − Old) ÷ Old] × 100 | [(55k − 50k) ÷ 50k] × 100 = 10% |
| Body weight change | [(New − Old) ÷ Old] × 100 | [(180 − 200) ÷ 200] × 100 = −10% |

---

## Frequently Asked Questions

**How do I calculate a percentage without a calculator?**
The 10% method works for most situations: divide the number by 10 (move the decimal left one place), then scale up or down. For 15%, add 10% + 5%. For 25%, divide by 4. For 30%, triple 10%. For irregular percentages like 17%, find 10% + 5% + 2% (which is 10% ÷ 5).

**What's the difference between percentage and percentage points?**
A percentage is a ratio (60% approval rating). A percentage point is the arithmetic difference between two percentages. If approval rises from 60% to 65%, it increased by 5 percentage points — but by 8.3% (because 5 is 8.3% of 60). Politicians and marketers often use "percentage" when they mean "percentage points" — the distinction matters when evaluating claims.

**How do I calculate a percentage increase to reach a target?**
Formula: Required increase % = [(Target − Current) ÷ Current] × 100. Example: you earn $60,000 and want $75,000 — that's [(75,000 − 60,000) ÷ 60,000] × 100 = **25% increase**.

**Why does adding and removing the same percentage not return to the original?**
Because the base changes. Increase $100 by 10% = $110. Remove 10% from $110 = $99 — not $100. The second calculation uses $110 as the base, not $100. To reverse a 10% increase, you need to decrease by 9.09% (1/1.1 − 1 = −0.0909).

**How do you calculate compound percentages?**
For compound growth, apply each percentage sequentially to the running total. Two 10% increases = 1.10 × 1.10 = 1.21, so **21% total growth** (not 20%). This is why compound interest and compound annual growth rate (CAGR) formulas use exponents rather than simple addition.`,
  },

  // ── PAGE 2: Age Calculator (~200,000/mo) ─────────────────────────────────
  {
    slug: "age-calculator",
    title: "Age Calculator: How to Calculate Age from Date of Birth",
    excerpt:
      "Learn exactly how age is calculated from a date of birth in years, months, and days — including how leap years are handled, why legal and medical age differ from chronological age, and how to find the date of a future birthday.",
    category: "tools",
    tags: [
      "age calculator",
      "how to calculate age",
      "age from date of birth",
      "date of birth calculator",
      "how old am i",
      "exact age calculator",
      "days since birth",
    ],
    metaTitle: "Age Calculator: How to Calculate Exact Age in Years, Months & Days",
    metaDescription:
      "Calculate your exact age in years, months, and days from any date of birth. Learn how leap years affect age, why legal vs. medical age differ, and how to find your next birthday date. Free guide.",
    relatedComparisonSlugs: [
      "social-security-retirement-ages",
      "roth-ira-vs-traditional-ira",
      "medicare-vs-medicaid",
      "term-life-vs-whole-life-insurance",
    ],
    content: `# Age Calculator: How to Calculate Exact Age in Years, Months & Days

Age calculation seems simple — subtract your birth year from the current year. But the precise calculation in years, months, and days is more involved, especially when leap years, month-end dates, and legal definitions come into play. Here's how it works.

---

## The Basic Age Formula

**Age (years) = Current Year − Birth Year**

With an important adjustment: if the birthday hasn't occurred yet in the current year, subtract 1.

**Example:** Born March 15, 1990. Today is July 11, 2026.
- Year difference: 2026 − 1990 = 36
- Has the birthday (March 15) occurred this year? Yes (before July 11)
- **Age = 36 years**

If today were February 1, 2026 (before March 15), the age would be 35.

---

## Calculating Exact Age in Years, Months, and Days

For a precise age breakdown:

**Step 1:** Calculate completed years (as above).

**Step 2:** Calculate completed months since the last birthday.
- Find the anniversary month of the most recent birthday.
- Count full months elapsed since then.

**Step 3:** Calculate remaining days.
- Subtract the days in completed months from the days since the last birthday anniversary.

**Example:** Born September 4, 1991. Today is July 11, 2026.

1. Most recent birthday: September 4, 2025
2. Completed years: 2026 − 1991 = 35 (but birthday is Sept 4, 2025, which has passed)
   - Actually, since July 11 < September 4, the most recent birthday was September 4, 2025
   - Completed years = 34 (birthday in 2026 hasn't happened yet)
3. Months from September 4, 2025 to July 11, 2026:
   - Sept → Oct → Nov → Dec → Jan → Feb → Mar → Apr → May → Jun = **10 completed months**
4. Days from July 4 to July 11 = **7 days**
- **Exact age: 34 years, 10 months, 7 days**

Use an online calculator like [timeanddate.com's Age Calculator](https://www.timeanddate.com/date/age.html) for instant results without manual math.

---

## How Leap Years Affect Age

Leap years (years divisible by 4, with exceptions for century years) add February 29 to the calendar. This matters for two scenarios:

**Born on February 29:** People born on leap day have a birthday that exists only every 4 years. Legal and practical conventions vary:
- **United States:** February 28 or March 1 (depending on state) is used for official age milestones.
- **United Kingdom:** February 28 is used by default for leap-day birthdays.
- Most software and government systems default to February 28 in non-leap years.

**Counting days across leap years:** A year isn't always 365 days. Between any two dates spanning a February 29, the day count will be 366 rather than 365. Age-in-days calculations must account for this.

**Age in days formula:** Add up calendar days from birth date to today, counting 366 for each leap year crossed and 365 for each regular year.

---

## Age in Different Units

| Unit | Formula | Example (Born Jan 1, 2000 → Jul 11, 2026) |
|------|---------|------------------------------------------|
| Years | Count full calendar years | 26 years |
| Months | Years × 12 + extra months | 318 months |
| Weeks | Days ÷ 7 | ~1,388 weeks |
| Days | Count all days elapsed | ~9,688 days |
| Hours | Days × 24 | ~232,512 hours |
| Seconds | Days × 86,400 | ~836,870,400 seconds |

---

## Legal Age vs. Chronological Age

Chronological age (calendar-based) is not the only age that matters legally or medically:

**Legal age milestones (United States):**

| Age | Milestone |
|-----|-----------|
| 16 | Driving license (most states) |
| 17 | Enlist in military with parental consent |
| 18 | Vote, sign contracts, buy tobacco |
| 21 | Purchase alcohol |
| 62 | Earliest Social Security retirement benefits |
| 65 | Medicare eligibility |
| 67 | Full Social Security retirement age (born 1960 or later) |
| 70 | Maximum Social Security delayed credits |
| 73 | Required Minimum Distributions (RMDs) from retirement accounts begin |

**Medical/biological age:** Clinicians sometimes refer to "biological age" — how old your body functions relative to population norms, based on biomarkers like telomere length, VO₂ max, bone density, and metabolic health. Biological age can diverge significantly from chronological age.

**Asian age reckoning:** Traditional Korean and Chinese age systems count newborns as 1 (not 0) at birth and add 1 at each New Year rather than on the birthday. South Korea officially adopted Western age reckoning in 2023, but traditional reckoning is still culturally referenced.

---

## Finding Your Next Birthday

**Days until next birthday:**

1. Determine next birthday date (same month/day as birth date, in the next future year).
2. Subtract today's date from that date.

**Example:** Born April 22, 1985. Today is July 11, 2026.
- Next birthday: April 22, 2027
- Days from July 11, 2026 to April 22, 2027:
  - July: 20 remaining days + August: 31 + September: 30 + October: 31 + November: 30 + December: 31 + January: 31 + February: 28 + March: 31 + April: 22 = **285 days**

---

## Frequently Asked Questions

**How do I calculate my exact age in days?**
The most reliable way is to use a date difference calculator (timeanddate.com, wolframalpha.com, or Google's built-in calculator — search "days between [birth date] and today"). Manually, add up the days in each year between your birth and today, being careful to count leap years (366 days each).

**Why does my age sometimes differ from what an online calculator shows?**
Time zones and the exact time of birth can cause a one-day difference on your birthday. Also, some calculators define "age" differently — some increment age at midnight, others at the exact birth time. Official documents (passports, driver's licenses) use the calendar date with no time component.

**How is age calculated for legal purposes?**
In the US, a person legally reaches an age at the start of the birthday, not after it ends. Courts interpret "reaching age 18" as the moment midnight arrives on the date of birth. This is called the common law birthday rule — the day you were born counts as a full year.

**What is the most common age calculation method globally?**
The Western (Gregorian calendar) method — chronological years completed since birth — is standard globally for legal, medical, and administrative purposes. Traditional East Asian systems (which counted age differently) have largely been superseded by Western reckoning for official use.

**How do I calculate age for retirement planning?**
Use your exact birth date and projected retirement date. Social Security's Full Retirement Age (FRA) depends on birth year — check ssa.gov for the exact month and year you reach FRA, since retiring even one month early can reduce benefits. For 401(k) and IRA purposes, the IRS uses the calendar year of birth to calculate Required Minimum Distribution age (currently 73).`,
  },

  // ── PAGE 3: Calorie Calculator (~200,000/mo) ─────────────────────────────
  {
    slug: "calorie-calculator",
    title: "Calorie Calculator: How to Find Your Daily Calorie Needs",
    excerpt:
      "Learn how to calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor formula, how activity multipliers work, and how many calories to eat for weight loss, maintenance, or muscle gain.",
    category: "tools",
    tags: [
      "calorie calculator",
      "how many calories should I eat",
      "tdee calculator",
      "bmr calculator",
      "daily calorie needs",
      "calorie deficit",
      "calories to lose weight",
    ],
    metaTitle: "Calorie Calculator: Find Your Daily Calorie Needs (BMR + TDEE)",
    metaDescription:
      "Calculate how many calories you need per day with the Mifflin-St Jeor BMR formula and TDEE activity multipliers. Learn calorie targets for weight loss, maintenance, and muscle gain. Free guide.",
    relatedComparisonSlugs: [
      "keto-vs-mediterranean-diet",
      "bmi-vs-body-fat-percentage",
      "whoop-vs-oura-ring",
      "treadmill-vs-elliptical",
    ],
    content: `# Calorie Calculator: How to Find Your Daily Calorie Needs

How many calories you need per day depends on your body size, age, sex, and how active you are. The calculation starts with your Basal Metabolic Rate (BMR) — the number of calories your body burns at rest — then scales up based on activity. Here's the exact math.

---

## Step 1: Calculate Your Basal Metabolic Rate (BMR)

BMR is the energy your body uses just to stay alive — breathing, circulation, cell maintenance, body temperature regulation — with no movement or activity.

The most accurate widely-used formula for BMR is the **Mifflin-St Jeor equation** (validated in multiple clinical studies since 1990):

**For men:**
BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5

**For women:**
BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161

**Example (man, 35 years old, 80 kg, 178 cm):**
BMR = (10 × 80) + (6.25 × 178) − (5 × 35) + 5
BMR = 800 + 1,112.5 − 175 + 5 = **1,742.5 calories/day**

**Example (woman, 28 years old, 65 kg, 165 cm):**
BMR = (10 × 65) + (6.25 × 165) − (5 × 28) − 161
BMR = 650 + 1,031.25 − 140 − 161 = **1,380.25 calories/day**

**Converting imperial to metric:**
- Pounds to kilograms: weight (lbs) ÷ 2.205
- Inches to centimeters: height (inches) × 2.54

---

## Step 2: Apply the Activity Multiplier (TDEE)

Your **Total Daily Energy Expenditure (TDEE)** is BMR multiplied by an activity factor:

| Activity Level | Description | Multiplier |
|---------------|-------------|-----------|
| Sedentary | Desk job, little or no exercise | BMR × 1.2 |
| Lightly Active | Light exercise 1–3 days/week | BMR × 1.375 |
| Moderately Active | Moderate exercise 3–5 days/week | BMR × 1.55 |
| Very Active | Hard exercise 6–7 days/week | BMR × 1.725 |
| Extra Active | Very hard exercise + physical job, or 2× training | BMR × 1.9 |

**Example:** The man from above (BMR = 1,743) works a desk job but exercises moderately 4 days a week.
TDEE = 1,743 × 1.55 = **2,702 calories/day**

This is his maintenance calories — eating this amount keeps weight stable.

---

## Step 3: Set Your Calorie Target by Goal

Once you know your TDEE, adjust based on goal:

| Goal | Calorie Target | Expected Result |
|------|---------------|-----------------|
| Lose weight (slow) | TDEE − 250 | ~0.5 lb/week loss |
| Lose weight (moderate) | TDEE − 500 | ~1 lb/week loss |
| Lose weight (aggressive) | TDEE − 750 | ~1.5 lb/week loss |
| Maintain weight | TDEE | No change |
| Build muscle (lean bulk) | TDEE + 200–300 | ~0.5 lb/week gain |
| Build muscle (traditional bulk) | TDEE + 500 | ~1 lb/week gain |

**The 3,500-calorie rule:** A deficit of ~3,500 calories corresponds to approximately 1 pound of fat lost. This is a useful approximation — real results vary based on hormones, water retention, and individual metabolism, but it's accurate enough for planning purposes.

**Minimum calorie floors:** Most health guidelines recommend not going below 1,200 calories/day for women or 1,500 for men. Below these thresholds, it becomes difficult to get adequate protein, micronutrients, and essential fats — and metabolism can adapt (slow down) to the restriction.

---

## The Harris-Benedict Formula (Alternative)

The older **Harris-Benedict equation** is still widely used and gives similar results:

**Men:** BMR = 88.362 + (13.397 × kg) + (4.799 × cm) − (5.677 × age)
**Women:** BMR = 447.593 + (9.247 × kg) + (3.098 × cm) − (4.330 × age)

**When to use which formula:**
- Mifflin-St Jeor is more accurate on average for modern populations (validated in a 1990 study against indirect calorimetry).
- Harris-Benedict (1919, revised 1984) slightly overestimates BMR in many studies.
- Neither formula accounts for body composition — a person with high muscle mass will have a higher actual BMR than either formula predicts.

---

## Calorie Content of Common Foods (Reference)

| Food | Serving | Calories |
|------|---------|---------|
| Chicken breast (cooked) | 3.5 oz (100g) | 165 kcal |
| Brown rice (cooked) | 1 cup (195g) | 215 kcal |
| Eggs (large) | 1 egg | 70 kcal |
| Avocado | 1 medium | 234 kcal |
| Banana | 1 medium | 105 kcal |
| Broccoli (cooked) | 1 cup | 55 kcal |
| Whole milk | 1 cup (240ml) | 149 kcal |
| Almonds | 1 oz (28g) | 164 kcal |
| Olive oil | 1 tbsp (14g) | 119 kcal |
| Bread (whole wheat) | 1 slice | 79 kcal |
| Greek yogurt (plain, 2%) | 6 oz (170g) | 100 kcal |
| Salmon (cooked) | 3.5 oz (100g) | 208 kcal |

---

## Why TDEE Calculators Are Estimates (Not Exact)

Activity multipliers are the biggest source of error. Most people overestimate their activity level — selecting "moderately active" when they're closer to "lightly active." A common recommendation: choose the activity level that honestly describes your non-exercise movement (desk job vs. physical job), and account for formal exercise separately by adding calories burned during those sessions.

Other factors that affect individual calorie needs beyond the formula:
- **Muscle mass:** More muscle = higher BMR (muscle tissue burns more calories at rest than fat).
- **Hormones:** Thyroid function, insulin sensitivity, and cortisol levels all affect metabolic rate.
- **Gut microbiome:** Research suggests the microbiome affects how many calories are absorbed from food (not just consumed).
- **Adaptive thermogenesis:** When calories are restricted, the body can reduce BMR by 10–15% beyond what weight loss alone would predict — this is why plateaus occur.

---

## Frequently Asked Questions

**How many calories should I eat to lose weight?**
Start at TDEE − 500 calories per day for approximately 1 pound of weight loss per week. Track for 2–3 weeks and adjust based on actual weight change (weigh daily, average the week). If you're not losing, reduce by another 100–200 calories. If you're losing more than 1.5 lbs/week consistently, consider adding 100–200 calories to preserve muscle.

**Is 1,200 calories a day enough?**
For most adults, 1,200 calories is below maintenance and will cause weight loss — but it is at or near the minimum threshold for getting adequate protein and micronutrients. For taller individuals, very active people, and those with more muscle mass, 1,200 calories represents an aggressive deficit that may cause muscle loss and nutrient deficiencies. For shorter, sedentary women, it may be close to maintenance.

**Do calories from different foods work the same?**
For raw weight change, yes — a calorie deficit of any composition causes fat loss. But protein has a higher thermic effect (your body burns ~25–30% of protein calories just digesting it, vs. ~6–8% for carbohydrates and ~2–3% for fat), so higher-protein diets produce more fat loss per calorie. Protein also preserves muscle mass during a deficit, which matters for long-term metabolic rate.

**Should I eat back exercise calories?**
The safest approach is to use a TDEE that accounts for your average activity (including exercise), rather than tracking exercise calories separately. If you use a sedentary TDEE, eating back exercise calories makes sense — but exercise calorie estimates from fitness trackers are notoriously inaccurate (often overestimated by 20–50%).

**Why did my weight loss stall even though I'm in a deficit?**
Three common causes: (1) You're actually eating more than you think — studies show most people underestimate intake by 20–40%; use a food scale for 2 weeks to confirm. (2) Adaptive thermogenesis — your body has reduced its TDEE in response to restriction; a 1–2 week diet break at maintenance calories can reset this. (3) Water retention masking fat loss — this is common with high-sodium days, new exercise routines, or hormonal cycles; true fat loss is still occurring.`,
  },
];

async function main() {
  console.log(`DAN-2006: Publishing ${PAGES.length} tools landing pages...\n`);

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
