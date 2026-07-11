/**
 * DAN-1940: Blog Wave 5 — 7 tactical-intent blog posts (~567K/mo combined)
 * Posts: ZepBound cost, American Airlines cancels, How Ozempic works, EpiPen cost,
 *        Cancel Hulu, Ultra low cost airlines, Frontier bag fees
 * Run: npx tsx scripts/publish-dan1940-wave5.ts
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL.replace(
    /-pooler(\.[^/]+\.aws\.neon\.tech)/,
    "$1"
  );
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NOW = new Date("2026-07-11T10:00:00Z");

const POSTS = [
  // DAN-1945: ZepBound cost + GoodRx savings (49,500/mo, KD 6)
  {
    slug: "zepbound-cost",
    title: "ZepBound Cost: How Much Does It Cost With and Without Insurance? (2026)",
    excerpt:
      "ZepBound (tirzepatide) costs $550–$650/month without insurance as of 2026. With insurance coverage for obesity, it can drop to $25/month. Here's a full breakdown of costs, savings options, and how GoodRx and Cost Plus compare.",
    category: "health",
    tags: ["zepbound", "tirzepatide", "weight loss", "ozempic", "goodrx", "pharmacy savings", "insurance"],
    metaTitle: "ZepBound Cost Without Insurance (2026) | GoodRx vs Cost Plus",
    metaDescription:
      "ZepBound costs $550–$650/month without insurance. With obesity coverage: as low as $25/month. Full 2026 breakdown of savings options, GoodRx, and alternatives.",
    relatedComparisonSlugs: [],
    sourceQuery: "zepbound cost",
    sourceImpressions: 49500,
    publishedAt: NOW,
    content: `# ZepBound Cost: How Much Does It Cost With and Without Insurance? (2026)

**ZepBound (tirzepatide) costs approximately $550–$650 per month without insurance** as of 2026. With insurance that covers obesity treatment, your out-of-pocket cost can drop to as low as $25 per month using Eli Lilly's savings program.

Here's a complete breakdown of ZepBound costs, insurance coverage, and every available savings option.

## ZepBound Prices Without Insurance (2026)

| Dose | Monthly Cost (Without Insurance) |
|------|----------------------------------|
| 2.5 mg/week (starter) | ~$550–$600/month |
| 5 mg/week | ~$600–$650/month |
| 7.5 mg/week | ~$600–$650/month |
| 10 mg/week | ~$600–$650/month |
| 12.5 mg/week | ~$600–$650/month |
| 15 mg/week (max) | ~$600–$650/month |

ZepBound is a weekly self-injection pen. All doses are priced similarly — the monthly cost doesn't change dramatically as you titrate up.

**Note:** ZepBound and Mounjaro contain the same active ingredient (tirzepatide). Mounjaro is FDA-approved for type 2 diabetes; ZepBound is the obesity indication. Insurance coverage and pricing differ between the two prescriptions.

## ZepBound Cost With Insurance

Whether insurance covers ZepBound depends entirely on your plan:

- **Medicare**: Does NOT cover ZepBound for weight loss. Medicare Part D explicitly excludes drugs prescribed solely for weight loss.
- **Medicaid**: Coverage varies by state. Some state Medicaid programs cover GLP-1 drugs for obesity; most do not.
- **Commercial/employer insurance**: Many plans now cover GLP-1s for obesity, especially large self-insured employers. If your plan covers ZepBound, your copay is typically $25–$150/month.
- **High-deductible plans**: If you haven't met your deductible, you'll pay the full negotiated price (often $400–$550/month) until the deductible is satisfied.

**Best case: Eli Lilly Savings Card.** If you have commercial insurance that covers ZepBound, Eli Lilly offers a savings card that reduces your copay to **$25/month** for eligible patients. The card is available at ZepBound.com.

## ZepBound vs Ozempic: Cost Comparison

| Drug | Active Ingredient | Monthly Cost (No Insurance) | Approved Use |
|------|------------------|-----------------------------|--------------|
| ZepBound | Tirzepatide | ~$550–$650 | Obesity/weight management |
| Wegovy | Semaglutide | ~$1,350/month | Obesity/weight management |
| Ozempic | Semaglutide | ~$850–$950/month | Type 2 diabetes |
| Mounjaro | Tirzepatide | ~$1,000/month | Type 2 diabetes |
| Rybelsus | Semaglutide (oral) | ~$850/month | Type 2 diabetes |

ZepBound is the most affordable branded GLP-1 drug for obesity treatment without insurance. Wegovy (same mechanism as Ozempic but obesity-approved) costs more than twice as much.

## Does GoodRx Lower ZepBound Costs?

**GoodRx has limited utility for ZepBound** because tirzepatide is a branded drug with no generic. GoodRx discounts work best on generic drugs. For ZepBound specifically:

- GoodRx may show prices of $500–$600 at certain pharmacies — similar to the cash price, occasionally slightly lower
- The Eli Lilly savings card ($25/month copay) beats GoodRx for anyone with qualifying commercial insurance
- GoodRx is not useful for Medicare patients

**When GoodRx helps:** If you have no insurance and want to compare pharmacy prices, GoodRx is worth checking. You may find ZepBound for $50–$100 less at certain pharmacy chains versus the retail list price.

## Does Mark Cuban's Cost Plus Drugs Carry ZepBound?

**No — Cost Plus Drugs does not currently carry ZepBound (tirzepatide).** Cost Plus works with generics and select branded drugs that have agreed to their pricing model. Eli Lilly has not partnered with Cost Plus for ZepBound or Mounjaro.

Cost Plus is excellent for generic medications but not for recently-launched branded GLP-1 drugs.

## Compounded Tirzepatide: The Lower-Cost Alternative

During the ZepBound shortage of 2024–2025, the FDA allowed compounding pharmacies to manufacture tirzepatide. The shortage was officially resolved in late 2024, but compounding pharmacies continue to offer it.

**Compounded tirzepatide costs:** $100–$300/month depending on the pharmacy and dose.

**Important caveat:** Compounded tirzepatide is not FDA-approved and quality control varies significantly between compounding pharmacies. The FDA has warned about safety concerns with some compounded versions. Only use a licensed 503A or 503B facility.

**Is it legal?** As of 2026, compounded tirzepatide is in a legal gray zone — the FDA declared the shortage resolved, which limits compounding. Some pharmacies continue to offer it; others have stopped. Consult your prescriber before choosing a compounding pharmacy.

## How to Save Money on ZepBound

**Option 1: Eli Lilly ZepBound Savings Card (best option with commercial insurance)**
- Monthly cost: **$25/month** for eligible commercially insured patients
- Requires: Commercial insurance that covers ZepBound + a valid prescription
- Apply at: ZepBound.com
- Savings: Typically saves $500+/month vs paying out of pocket

**Option 2: Manufacturer Patient Assistance Program**
- For uninsured/underinsured patients with qualifying income
- Can reduce cost to near $0 for eligible patients
- Apply through Eli Lilly's AnswersRx program

**Option 3: Telehealth prescribers**
- Some telehealth platforms (Ro, Hims & Hers, Calibrate) offer GLP-1 programs with bundled pricing
- May include coaching + prescription management for $150–$350/month
- Often use compounded tirzepatide rather than branded ZepBound

**Option 4: Pharmacy price comparison**
- Use GoodRx.com to compare prices at CVS, Walgreens, Costco, Walmart, etc.
- Costco pharmacy often has lower cash prices on branded drugs

**Option 5: Employer benefit programs**
- Large employers increasingly offer obesity treatment benefits with GLP-1 coverage
- Check your Summary of Benefits or HR portal

## FAQ

**How much does ZepBound cost per month without insurance?**
ZepBound costs approximately $550–$650 per month without insurance as of 2026. All dose tiers are similarly priced.

**Is ZepBound cheaper than Wegovy?**
Yes — ZepBound is significantly cheaper than Wegovy. ZepBound runs ~$550–$650/month without insurance; Wegovy costs ~$1,350/month. Both are GLP-1 drugs approved for obesity, but Wegovy (semaglutide) carries a higher list price.

**Does Medicare cover ZepBound?**
No. Medicare Part D explicitly excludes drugs used solely for weight loss. ZepBound is not covered by Medicare for obesity, though coverage may change with future legislation.

**Can I use GoodRx for ZepBound?**
GoodRx can show pharmacy prices for ZepBound but rarely provides significant discounts since it's a branded drug with no generic. The Eli Lilly savings card ($25/month) is far more valuable for insured patients.

**What is the difference between ZepBound and Mounjaro?**
Same drug (tirzepatide), different FDA-approved indications. Mounjaro is approved for type 2 diabetes; ZepBound is approved for obesity (BMI ≥30, or ≥27 with a weight-related condition). Insurance coverage differs based on your diagnosis.

**Is ZepBound worth the cost?**
Clinical trials showed ZepBound users lost an average of 20% of body weight over 72 weeks — among the highest efficacy of any approved weight loss drug. For patients with obesity-related health conditions, the long-term health cost savings may far exceed the monthly drug cost.

## Bottom Line

ZepBound costs $550–$650/month without insurance. If you have commercial insurance that covers obesity treatment, Eli Lilly's savings card can bring it down to $25/month. Medicare doesn't cover it. GoodRx has limited impact on the price. For the biggest savings, check your insurance coverage first, then apply for the Lilly savings card.

For a comparison of ZepBound vs Ozempic — mechanism, weight loss results, side effects, and cost — see our full breakdown.

### Related Comparisons
- [Ozempic vs Wegovy: What's the Difference?](/compare/ozempic-vs-wegovy)
- [GoodRx vs Mark Cuban Cost Plus Drugs](/compare/goodrx-vs-cost-plus-drugs)
`,
  },

  // DAN-1946: American Airlines cancels flights (60,500/mo, KD 21)
  {
    slug: "american-airlines-cancels-flights",
    title: "American Airlines Cancels Flights: What to Do and Your Rights (2026)",
    excerpt:
      "When American Airlines cancels your flight, you're entitled to a full refund — not just a voucher — for significant delays and cancellations. Here's exactly what to do, what compensation you can claim, and how AA compares to Delta and Southwest on cancellation policies.",
    category: "travel",
    tags: ["american airlines", "flight cancellation", "travel", "airline", "refund", "compensation", "baggage"],
    metaTitle: "American Airlines Cancels Your Flight: Rights & Refunds (2026)",
    metaDescription:
      "American Airlines cancels your flight? You're entitled to a full cash refund for cancellations and significant delays. Here's what to do, your rights, and how to get compensated.",
    relatedComparisonSlugs: [],
    sourceQuery: "american airlines cancels flights",
    sourceImpressions: 60500,
    publishedAt: NOW,
    content: `# American Airlines Cancels Flights: What to Do and Your Rights (2026)

**When American Airlines cancels your flight, you have the right to a full cash refund** — not just a travel credit or voucher. The DOT's 2024 rule requires airlines to automatically refund passengers for canceled or significantly delayed flights without having to ask.

Here's exactly what to do step-by-step, what compensation you're owed, and how to protect yourself next time.

## What Happens When American Airlines Cancels Your Flight?

American Airlines cancels thousands of flights per year due to weather, mechanical issues, staffing, and air traffic control delays. When your AA flight is canceled, the airline must:

1. **Notify you** — via email, text, and/or the AA app
2. **Offer rebooking** on the next available AA flight at no charge
3. **Offer a full refund** if you don't want to accept the rebooking
4. **Provide a meal voucher** if the delay is 3+ hours and is within AA's control (not weather)

Under the DOT's April 2024 rule, refunds must be **automatic and in the original form of payment** — you don't have to call and argue for them anymore. Cash back to your card, not a voucher.

## What to Do Immediately When AA Cancels Your Flight

### Step 1: Check Your Rebooking Options in the App First
American Airlines will typically rebook you automatically. Open the AA app or check your email for a new itinerary. If the new flight works for you, you're done.

### Step 2: Request a Refund (If Rebooking Doesn't Work)
If the rebooking puts you on a flight 2+ hours later, routes you through additional connections, or simply doesn't work for your schedule, you can refuse it and request a full refund.

**How to request:**
- **Online**: aa.com → My Trips → Request Refund
- **App**: AA app → Your Trip → Cancel and Request Refund
- **Airport**: Speak to an AA agent at the ticket counter or gate
- **Phone**: 1-800-433-7300 (expect long hold times during irregular operations)

### Step 3: Know Your Hotel/Meal Rights
- **Weather cancellations**: AA is NOT required to provide hotels or meals. They may offer vouchers as a courtesy, but it's not guaranteed.
- **AA-controlled cancellations** (mechanical, staffing): You may be entitled to hotel vouchers and meal vouchers. Ask at the gate or customer service desk.

### Step 4: File for DOT Compensation If Needed
If AA doesn't refund you automatically within 7 business days (credit cards) or 20 calendar days (cash), you can file a complaint with the DOT at aviation.consumer.dot.gov.

## American Airlines Cancellation Policy: The Rules

| Situation | Your Right |
|-----------|-----------|
| AA cancels your flight | Full refund to original payment method |
| Flight delayed 3+ hours (domestic) | Full refund option |
| Flight delayed 6+ hours (international) | Full refund option |
| AA changes your itinerary significantly | Full refund option |
| You cancel (Basic Economy) | No refund, no change — flight credit only in some cases |
| You cancel (Main Cabin or above) | Flight credit for future travel; refund if purchased refundable fare |

**"Significantly" means:** Different departure/arrival city, departure/arrival time changes of 3+ hours (domestic) or 6+ hours (international), additional layovers, or a downgrade in cabin class.

## American Airlines Baggage Fees (2026)

While you're managing a canceled flight, here's what to know about AA baggage policies:

| Bag Type | Basic Economy | Main Cabin | Premium Economy | Business |
|----------|--------------|------------|-----------------|---------|
| Personal item (under seat) | Free | Free | Free | Free |
| Carry-on (overhead) | NOT included* | Free | Free | Free |
| 1st checked bag | $40 | $40 | $45 | Free |
| 2nd checked bag | $45 | $45 | $50 | Free |

*Basic Economy passengers can only bring a small personal item that fits under the seat. Overhead bin access requires upgrading or paying.

**AA credit card holders:** The AAdvantage credit cards waive the first checked bag fee for the cardholder and up to 4 companions.

## AA Cancellation Statistics: How Often Does It Happen?

According to BTS data, American Airlines typically cancels 1.5–2.5% of flights in a given month. During summer and winter peak travel seasons, weather-related cancellations spike. In 2023, AA canceled approximately 2.1% of all scheduled flights.

How AA compares:
| Airline | Cancellation Rate (2023) |
|---------|-------------------------|
| Delta | ~0.5% |
| Southwest | ~1.2% |
| United | ~1.8% |
| American | ~2.1% |
| Spirit | ~3.0% |
| Frontier | ~3.4% |

Delta consistently has the best on-time and cancellation record; ultra-low-cost carriers (Spirit, Frontier) have the highest cancellation rates.

## How to Avoid Getting Stranded When AA Cancels

**1. Book early morning flights.** The first flight of the day has the fewest cascading delays — the plane just came from maintenance, not from a late inbound flight.

**2. Non-stop when possible.** Every connection is a new cancellation risk. Nonstop reduces your exposure by 50% or more.

**3. Build in buffer time.** Don't book a connection with under 90 minutes between flights on domestic routes.

**4. Get trip insurance.** Cancel for Any Reason (CFAR) insurance gives you cash back — not a voucher — if you need to cancel. Standard trip insurance covers cancellations due to illness, family emergencies, and travel disruption.

**5. Pay with the right credit card.** Many travel credit cards (Chase Sapphire Preferred, Chase Sapphire Reserve, Amex Platinum) include trip delay and cancellation insurance that pays for hotels and meals when airlines don't.

## AA Cancellation vs. Delta, Southwest, United

| | American | Delta | Southwest | United |
|--|---------|-------|-----------|--------|
| Refund for cancellation | Yes (automatic) | Yes (automatic) | Yes (automatic) | Yes (automatic) |
| Hotel vouchers (carrier-caused) | Sometimes | More consistently | Sometimes | Sometimes |
| Meal vouchers (3+ hr delay) | Yes (carrier-caused) | Yes (carrier-caused) | Yes (carrier-caused) | Yes (carrier-caused) |
| Cancellation rate | ~2.1% | ~0.5% | ~1.2% | ~1.8% |
| Free change policy | Main Cabin+ only | Yes (all) | All tickets | Yes (all) |

**Southwest** is unique because all tickets (including Basic) come with free changes and no change fees — though they don't offer seat assignments.

## FAQ

**Can American Airlines cancel my flight without compensation?**
Yes — airlines are not required to pay cash compensation for flight cancellations under US law (unlike EU rules). You're entitled to a full refund, but not additional compensation beyond that unless you have travel insurance.

**How long does American Airlines take to refund a canceled flight?**
Under DOT rules, AA must refund within 7 business days for credit card purchases and 20 calendar days for cash/check. If you don't receive your refund in that window, file a DOT complaint.

**Does American Airlines cancel flights for weather?**
Yes. Weather is the most common reason for flight cancellations. Weather cancellations are outside the airline's control, so AA is not required to provide hotel vouchers — but you still get a full refund.

**What if American Airlines only offers a voucher?**
Refuse it. Under the 2024 DOT rule, you're entitled to a cash refund (back to your original payment method) for canceled flights and significant delays. You do not have to accept a voucher.

**Can I get a hotel if American Airlines cancels my flight?**
If the cancellation is within AA's control (mechanical, staffing), you can ask for hotel accommodation. AA has "customer of size" policies and frequently provides vouchers at the gate during controllable events. Weather cancellations do not trigger the hotel benefit.

## Bottom Line

When American Airlines cancels your flight, you have three options: accept the rebooking, request a full cash refund, or take a flight credit. Under DOT rules effective 2024, the cash refund must be automatic for cancellations and significant delays. Don't accept a voucher if you want your money back. File a DOT complaint if your refund doesn't arrive within 7 business days.

For a comparison of American Airlines vs Delta — fares, cancellation rates, baggage fees, and frequent flyer programs — check our airline comparison pages.

### Related Comparisons
- [Spirit Airlines vs Frontier: Which Ultra-Low-Cost Wins?](/compare/spirit-airlines-vs-frontier)
- [Southwest vs American Airlines: Full Comparison](/compare/southwest-vs-american-airlines)
`,
  },

  // DAN-1947: How does Ozempic work (33,100/mo, KD 15)
  {
    slug: "how-does-ozempic-work",
    title: "How Does Ozempic Work? The Science Behind It (+ Cost & Who It's For)",
    excerpt:
      "Ozempic (semaglutide) works by mimicking a gut hormone called GLP-1 that regulates blood sugar and appetite. It's FDA-approved for type 2 diabetes and reduces A1C by 1.5–2%. Off-label, it's used for weight loss. Here's how it works, what it costs, and how it compares to ZepBound and Wegovy.",
    category: "health",
    tags: ["ozempic", "semaglutide", "glp-1", "diabetes", "weight loss", "goodrx", "pharmacy"],
    metaTitle: "How Does Ozempic Work? Science, Costs & Who It's For (2026)",
    metaDescription:
      "Ozempic mimics GLP-1, a gut hormone that regulates blood sugar and suppresses appetite. Here's the full science, what it costs, and how it compares to ZepBound and Wegovy.",
    relatedComparisonSlugs: [],
    sourceQuery: "how does ozempic work",
    sourceImpressions: 33100,
    publishedAt: NOW,
    content: `# How Does Ozempic Work? The Science Behind It (+ Cost & Who It's For)

**Ozempic works by mimicking a naturally occurring hormone called GLP-1 (glucagon-like peptide-1)** that your intestines release after eating. This hormone has three main effects: it tells the pancreas to release insulin, tells the liver to stop releasing glucose, and signals the brain that you're full. Ozempic does all three things — and it does them more powerfully than the natural hormone.

## The GLP-1 Mechanism: What Happens in Your Body

When you eat, cells in your small intestine release GLP-1. GLP-1 tells the pancreas: "glucose is coming in — release insulin." It also signals: "stop releasing stored glucose from the liver." And it travels to the brain to activate satiety signals.

The problem: natural GLP-1 breaks down in your bloodstream within 2 minutes. It's not durable enough to sustain blood sugar control throughout the day.

**Ozempic is a semaglutide molecule modified to survive in the bloodstream for approximately 7 days.** The modification — attaching the molecule to a fatty acid chain — lets it bind to albumin (a blood protein) and resist the enzyme that normally degrades GLP-1. This is why Ozempic is a weekly injection rather than a pill.

### The Three Actions of Ozempic

**1. Stimulates insulin secretion (glucose-dependent)**
When blood glucose is high (after eating), Ozempic activates GLP-1 receptors on pancreatic beta cells, triggering insulin release. Crucially, this only happens when glucose is actually high — which is why Ozempic rarely causes dangerous hypoglycemia on its own.

**2. Suppresses glucagon**
Glucagon is the "raise blood sugar" hormone. After meals, you don't need glucagon. Ozempic suppresses glucagon release from the pancreas, preventing the liver from unnecessarily dumping glucose into the blood.

**3. Slows gastric emptying + reduces appetite**
Ozempic activates GLP-1 receptors in the gut and brain. The gut effect slows how quickly food moves from your stomach to your intestines — you feel full longer. The brain effect directly reduces appetite signals, making you less hungry between meals.

This third mechanism is why Ozempic has become widely used for weight loss, even though it's FDA-approved only for type 2 diabetes.

## Ozempic's Effects: What to Expect

| Effect | Timeline | Magnitude |
|--------|----------|-----------|
| Blood sugar improvement (fasting) | 1–2 weeks | Significant |
| A1C reduction | 3 months | ~1.5–2.0 percentage points |
| Weight loss (diabetes patients) | Ongoing | 5–15% of body weight |
| Appetite reduction | 1–4 weeks | Noticeable |
| Full cardiovascular benefit | 1–2 years | 26% reduction in major cardiac events |

The SUSTAIN and SELECT clinical trials showed Ozempic also reduces major cardiovascular events (heart attack, stroke, cardiovascular death) by 26% in people with established cardiovascular disease — an effect beyond blood sugar control.

## Who Ozempic Is Approved For

Ozempic is FDA-approved for:
- **Adults with type 2 diabetes** — to improve blood sugar control (A1C), used alongside diet and exercise
- **Adults with type 2 diabetes and established heart disease** — to reduce the risk of major cardiovascular events

Ozempic is NOT FDA-approved for:
- Weight loss in people without type 2 diabetes (Wegovy is the approved option)
- Type 1 diabetes
- Children (pediatric use requires different formulations)

## Ozempic vs. ZepBound vs. Wegovy: What's the Difference?

| Drug | Active Ingredient | Mechanism | FDA Approved For | Monthly Cost (No Insurance) |
|------|------------------|-----------|-----------------|-----------------------------|
| Ozempic | Semaglutide | GLP-1 agonist | Type 2 diabetes | ~$850–$950 |
| Wegovy | Semaglutide | GLP-1 agonist | Obesity/weight management | ~$1,350 |
| ZepBound | Tirzepatide | GLP-1 + GIP dual agonist | Obesity/weight management | ~$550–$650 |
| Mounjaro | Tirzepatide | GLP-1 + GIP dual agonist | Type 2 diabetes | ~$1,000 |
| Rybelsus | Semaglutide | GLP-1 agonist (oral) | Type 2 diabetes | ~$850 |

**Key difference:** Ozempic and Wegovy are the same molecule (semaglutide) at different doses. Wegovy goes up to 2.4 mg/week; Ozempic maxes at 2 mg/week. ZepBound/Mounjaro (tirzepatide) add a second hormone mechanism (GIP receptor activation) which appears to produce greater weight loss.

## How Much Does Ozempic Cost?

Without insurance, Ozempic costs approximately **$850–$950 per month** (list price). This is significantly more than ZepBound.

**With insurance:**
- Most commercial plans cover Ozempic for type 2 diabetes with a copay of $25–$150/month
- Medicare covers Ozempic for type 2 diabetes (Part D), not for weight loss
- Novo Nordisk offers a savings card that can reduce copays to ~$25/month for eligible commercially insured patients

**GoodRx for Ozempic:** GoodRx typically shows prices of $750–$900 at major pharmacies — limited discount since it's a branded drug. The manufacturer savings card beats GoodRx for insured patients.

**Compounded semaglutide:** During shortages, compounding pharmacies offered semaglutide at $150–$400/month. The FDA declared the Ozempic shortage resolved; compounded versions are now in a legal gray area.

## Common Side Effects

Most side effects are gastrointestinal and typically improve after the first 4–8 weeks:

| Side Effect | Prevalence |
|-------------|-----------|
| Nausea | 20–30% |
| Vomiting | 10–15% |
| Diarrhea | 10–15% |
| Constipation | 5–10% |
| Decreased appetite | Common |
| Fatigue | Less common |

**Rare but serious:** Pancreatitis (stop and call your doctor if you have severe abdominal pain), gallbladder problems, kidney injury (usually from dehydration from vomiting). Ozempic carries a boxed warning about thyroid C-cell tumors (based on rodent data — not observed in humans but unknown risk exists in humans with personal/family history of MTC).

## How Long Does It Take for Ozempic to Work?

- **Blood sugar improvement**: Most patients see meaningful fasting glucose reduction within 1–2 weeks
- **A1C reduction**: 3 months to see full effect; a1c is measured quarterly
- **Weight loss**: Slow and steady — 1–2 lbs/week on average, accelerating over time
- **Maximum effect**: 52+ weeks; the SUSTAIN trials ran to 78 weeks

The medication doesn't "kick in" dramatically — it works gradually over months.

## FAQ

**Can you take Ozempic just for weight loss?**
Not officially. Ozempic is FDA-approved only for type 2 diabetes. Many doctors prescribe it off-label for weight loss (legal practice), but insurance typically won't cover it for weight loss only. Wegovy (same drug, higher dose) is the approved weight loss version.

**Is Ozempic the same as insulin?**
No. Ozempic is a GLP-1 receptor agonist. It stimulates your pancreas to produce insulin when blood sugar is high, but it is not insulin itself. Most people with type 2 diabetes can use Ozempic without also taking insulin.

**What happens if you stop taking Ozempic?**
Blood sugar returns to pre-treatment levels within weeks. Weight lost tends to return over 1–2 years. These drugs are designed for long-term or lifelong use in managing chronic conditions.

**Is Ozempic safe long-term?**
Clinical trials up to 5 years show continued safety and efficacy. The cardiovascular data is actively positive — reduced heart attack and stroke risk. Long-term thyroid effects remain an area of ongoing study.

**How does Ozempic compare to metformin?**
Metformin (the most common first-line type 2 diabetes drug) costs ~$5–$20/month generic. Ozempic is more expensive but provides greater A1C reduction, weight loss, and cardiovascular benefit. The two are often used together.

## Bottom Line

Ozempic works by mimicking GLP-1 — a hormone that controls blood sugar, appetite, and gastric emptying. It's highly effective for type 2 diabetes, reduces A1C by 1.5–2%, promotes weight loss, and has demonstrated cardiovascular benefits. For weight loss without diabetes, ZepBound (tirzepatide) is the better-value GLP-1 option at $550–$650/month vs. Ozempic's $850–$950.

### Related Comparisons
- [Ozempic vs Wegovy: Same Drug, Different Doses?](/compare/ozempic-vs-wegovy)
- [ZepBound vs Ozempic: Which GLP-1 Is Better?](/compare/zepbound-vs-ozempic)
`,
  },

  // DAN-1948: EpiPen cost + GoodRx vs Cost Plus (18,100/mo, KD 1)
  {
    slug: "epipen-cost",
    title: "EpiPen Cost: How Much Is It Without Insurance? (2026 Savings Guide)",
    excerpt:
      "EpiPen costs $650–$700 for a 2-pack without insurance. With a manufacturer coupon or GoodRx: as low as $25–$100. Mark Cuban's Cost Plus Drugs carries a generic epinephrine auto-injector for $109. Here's every savings option ranked.",
    category: "health",
    tags: ["epipen", "epinephrine", "allergy", "pharmacy savings", "goodrx", "cost plus drugs", "prescription"],
    metaTitle: "EpiPen Cost Without Insurance 2026 | GoodRx vs Cost Plus Drugs",
    metaDescription:
      "EpiPen 2-pack costs $650–$700 without insurance. GoodRx: as low as $100. Mark Cuban Cost Plus: $109 for generic. Full 2026 savings comparison.",
    relatedComparisonSlugs: [],
    sourceQuery: "epipen cost",
    sourceImpressions: 18100,
    publishedAt: NOW,
    content: `# EpiPen Cost: How Much Is It Without Insurance? (2026 Savings Guide)

**An EpiPen 2-pack costs approximately $650–$700 without insurance** at retail pharmacies in 2026. That's the list price from Pfizer/Viatris. In practice, you should never pay that — several programs bring the actual out-of-pocket cost down dramatically.

Here's every savings option, ranked by value.

## EpiPen Prices: The Full Picture

| Option | Your Cost | Notes |
|--------|-----------|-------|
| EpiPen retail (no insurance) | $650–$700 | 2-pack |
| EpiPen with Mylan/Viatris coupon | $0 | Uninsured patients; income-qualified |
| EpiPen with GoodRx | $100–$200 | Varies by pharmacy |
| Generic epinephrine auto-injector | $100–$150 | Authorized generic |
| Cost Plus Drugs (generic) | ~$109–$135 | Mark Cuban's pharmacy |
| EpiPen with commercial insurance | $25–$100 copay | Typical |
| Adrenaclick (authorized generic) | $110–$140 | CVS and major chains |

The $650 list price is largely fictional — almost no one pays it. The real question is which savings pathway applies to you.

## Option 1: Pfizer Patient Assistance Program (Best for Uninsured)

Pfizer (which manufactures EpiPen) offers a patient assistance program for people without insurance or with high out-of-pocket costs:

- **Who qualifies:** Uninsured or underinsured patients in the US
- **Cost:** $0 for qualifying patients
- **How to apply:** MyEpiPen.com → Patient Assistance
- **Income requirement:** Varies; the program is broadly accessible

This is the best option if you have no insurance. Apply through the manufacturer before trying any other route.

## Option 2: GoodRx (Best Quick Option Without Insurance)

GoodRx shows EpiPen prices at major pharmacies. Current prices as of 2026:

| Pharmacy | EpiPen 2-pack (GoodRx Price) |
|----------|------------------------------|
| Costco | ~$100–$130 |
| Walmart | ~$120–$150 |
| Kroger | ~$130–$160 |
| CVS | ~$150–$200 |
| Walgreens | ~$150–$210 |

GoodRx prices fluctuate. Always check the current price at GoodRx.com before going to the pharmacy — prices can vary by $50–$100 between pharmacies.

**Tip:** Costco pharmacy almost always has the lowest GoodRx price on EpiPen. You don't need a Costco membership to use the pharmacy.

## Option 3: Mark Cuban's Cost Plus Drugs

Cost Plus Drugs carries generic epinephrine auto-injectors at transparent, low prices:

- **Epinephrine 0.3mg auto-injector (generic for adult EpiPen):** ~$109–$135 for a 2-pack
- **Epinephrine 0.15mg (for children, EpiPen Jr. equivalent):** ~$109–$135

Cost Plus works with a licensed compounding pharmacy network and charges cost + 15% markup + $3 dispensing fee. For a drug like epinephrine where the actual manufacturing cost is very low, this can be significantly cheaper than retail.

**How it works:**
1. Get a prescription from your doctor
2. Go to CostPlusDrugs.com
3. Upload prescription / have your doctor send it directly
4. Ships by mail within a few days

**Limitation:** Cost Plus does not have physical retail locations. If you need an EpiPen refill quickly, GoodRx at your local pharmacy is faster.

## GoodRx vs Cost Plus: Which Is Better for EpiPen?

| | GoodRx | Cost Plus Drugs |
|--|--------|-----------------|
| **EpiPen 2-pack price** | $100–$200 (varies) | ~$109–$135 |
| **Convenience** | In-store, same day | Mail order, 2–5 days |
| **Coverage** | Brand + generic | Generic only |
| **Availability** | 70,000+ pharmacies | Online only |
| **Best for** | Urgent refills | Planned prescription management |

Cost Plus is slightly cheaper on average; GoodRx wins on convenience. For a medication you need right now, use GoodRx at Costco. For planned refills, Cost Plus is typically the better price.

## Option 4: Authorized Generics

The "authorized generic" epinephrine auto-injectors are identical to EpiPen (same drug, same mechanism, FDA-approved) but sold under a different name at a lower price:

- **Adrenaclick** (generic epinephrine auto-injector): ~$110–$140 at CVS with GoodRx
- **Impax generic epinephrine**: Available at Walmart

These are therapeutically equivalent to EpiPen. Ask your doctor to write "epinephrine auto-injector — brand and generic acceptable" on the prescription to ensure the pharmacy can substitute.

**Important:** Some patients have prescriptions written for "EpiPen only" (e.g., due to school requirement). Check that a generic is permitted before substituting.

## Option 5: Does Insurance Cover EpiPen?

Yes — most commercial insurance plans cover EpiPen. Typical copay: $25–$75 for a 2-pack with a standard drug formulary.

**Tier considerations:**
- EpiPen is usually on Tier 2 or 3 of formularies
- Generic epinephrine auto-injectors are often Tier 1 (lower copay)
- Some HDHP plans require meeting the deductible first

**Medicaid:** Most state Medicaid programs cover EpiPen or its generics with low or no copay.

**Medicare Part D:** Covered, but falls into the "coverage gap" (donut hole) for some plans until catastrophic coverage kicks in.

## Does CVS Price Match GoodRx?

CVS does not have a formal price-match policy. However, CVS pharmacies honor GoodRx coupons as part of their pharmacy benefit discount programs. When you show a GoodRx coupon at CVS, you pay the GoodRx price — which is often $50–$100 less than the cash list price at CVS.

## FAQ

**Why is EpiPen so expensive?**
EpiPen's high price reflects decades of price increases (from ~$57 in 2007 to $650+ today), patent protection that prevented generic competition until recently, and the monopoly position Mylan held for years. The controversy over EpiPen pricing led to congressional hearings in 2016. Generic competition has since reduced prices significantly for those who know to ask.

**Is GoodRx reliable for EpiPen?**
Yes — GoodRx prices for EpiPen are generally accurate. The coupon is accepted at most major pharmacy chains. Always verify the price at GoodRx.com before going to the pharmacy, since prices can change.

**Can I use Cost Plus Drugs with insurance?**
No — Cost Plus Drugs requires you to pay cash and does not accept insurance. You may be able to submit a reimbursement claim to your insurance afterward, but Coverage depends entirely on your plan.

**How long does an EpiPen last?**
EpiPens typically have a 12–18 month expiration from date of manufacture. Check the expiration date on your auto-injector. Expired EpiPens may deliver a lower-than-intended dose of epinephrine.

**What is the difference between EpiPen 0.3mg and EpiPen Jr. 0.15mg?**
EpiPen Jr. (0.15mg) is for children weighing 15–30 kg (33–66 lbs). The standard EpiPen (0.3mg) is for people over 30 kg (~66 lbs). Both are available as generics at similar prices.

## Bottom Line

The $650 retail price for EpiPen is almost never what you actually pay. Options in order of lowest cost:
1. **Pfizer patient assistance** (free for eligible uninsured)
2. **GoodRx at Costco** (~$100–$130)
3. **Cost Plus Drugs** (~$109–$135, mail order)
4. **Authorized generics** (Adrenaclick, ~$110–$140)
5. **Commercial insurance** ($25–$75 copay)

Always carry two EpiPens — anaphylaxis sometimes requires a second dose before emergency services arrive.

### Related Comparisons
- [GoodRx vs Mark Cuban Cost Plus Drugs](/compare/goodrx-vs-cost-plus-drugs)
- [CVS vs Walgreens: Which Pharmacy Is Better?](/compare/cvs-vs-walgreens)
`,
  },

  // DAN-1949: Cancel Hulu subscription (27,100/mo, KD 3)
  {
    slug: "cancel-hulu-subscription",
    title: "How to Cancel Hulu: Step-by-Step Guide for All Plans (2026)",
    excerpt:
      "You can cancel Hulu in under 2 minutes through the website, app, or by calling support. Here's exactly how to cancel each Hulu plan — No Ads, Live TV, Disney Bundle — and what happens to your billing and access when you do.",
    category: "entertainment",
    tags: ["hulu", "cancel hulu", "streaming", "subscription", "hulu live tv", "disney plus", "cancel subscription"],
    metaTitle: "How to Cancel Hulu Subscription (2026) — All Plans Covered",
    metaDescription:
      "Cancel Hulu in under 2 minutes. Step-by-step for Hulu No Ads, Hulu + Live TV, and the Disney Bundle. Plus what happens to your billing and access.",
    relatedComparisonSlugs: ["hulu-vs-youtube-tv"],
    sourceQuery: "cancel hulu subscription",
    sourceImpressions: 27100,
    publishedAt: NOW,
    content: `# How to Cancel Hulu: Step-by-Step Guide for All Plans (2026)

**You can cancel Hulu in under 2 minutes** through the Hulu website or by calling Hulu support. The fastest method is through Hulu.com on a computer — apps on phones and smart TVs often redirect you to the browser anyway.

Here's exactly how to cancel each plan.

## How to Cancel Hulu (Website — Fastest Method)

1. Go to **Hulu.com** on a computer and sign in
2. Click your **profile icon** (top right)
3. Select **Account**
4. Under "Your Subscription," click **Cancel**
5. Hulu will show you offers to keep your subscription — scroll past them
6. Confirm cancellation

That's it. You'll see a confirmation screen showing when your access ends (your next billing date).

## How to Cancel Hulu on iPhone/iPad (App)

You can't cancel Hulu through the iPhone app directly — Apple requires you to cancel through your Apple subscription settings.

1. Go to **Settings** on your iPhone
2. Tap your **Apple ID / name** at the top
3. Tap **Subscriptions**
4. Find **Hulu** and tap it
5. Tap **Cancel Subscription**

If you signed up for Hulu through Apple, this is the correct cancellation path. If you signed up directly on Hulu.com, use the web method above.

## How to Cancel Hulu on Android

1. Open the **Google Play Store** app
2. Tap your profile picture (top right)
3. Go to **Payments & subscriptions → Subscriptions**
4. Find **Hulu** and tap **Cancel subscription**

Same rule applies: only use this method if you originally subscribed through Google Play. If you signed up directly on Hulu.com, cancel on the website.

## How to Cancel Hulu + Live TV

Hulu + Live TV (the ~$82.99/month plan with 90+ live channels + Disney+ + ESPN+) cancels through the same process:

1. Go to Hulu.com → Account
2. Under "Your Subscription," click **Cancel**
3. You may see a downgrade offer (switch to standard Hulu instead of canceling)
4. Confirm full cancellation if you want to stop entirely

**Note:** When you cancel Hulu + Live TV, you lose both the live TV channels AND the Disney+ and ESPN+ access that came bundled. If you only want to cancel the live TV portion, you can downgrade to a standard Hulu plan (the option is offered during the cancellation flow).

## How to Cancel the Disney Bundle Through Hulu

If you signed up for the Disney Bundle (Disney+, Hulu, ESPN+) through Hulu.com, you manage cancellation through Hulu:

1. Go to Hulu.com → Account
2. Cancel your subscription
3. This removes the entire bundle

If you signed up for the bundle through Disney+:
1. Go to DisneyPlus.com → Account → Cancel Subscription

Canceling at either end cancels the entire bundle.

## When Does Hulu Access End After Canceling?

After canceling, you keep access until the end of your current billing period. For example:
- If your billing date is the 15th and you cancel on the 5th, you still have access through the 14th
- Hulu does NOT refund partial months

**Hulu does not charge a cancellation fee.**

## Does Hulu Offer a Pause Option Instead?

Yes. Hulu lets you pause your subscription for 1–3 months instead of canceling:

1. Go to Account → Manage Plan
2. Select "Pause Subscription"
3. Choose how long to pause (1, 2, or 3 months)

During the pause, your account is inactive but your preferences, watchlist, and history are saved. Pausing is a good option if you're just taking a break.

## What Happens to Your Data When You Cancel?

- Your watch history and profile settings are saved for 30 days
- If you resubscribe within 30 days, your history and preferences are restored
- After 30 days, Hulu begins deleting your data per their privacy policy
- Downloaded content (if available on your plan) is deleted immediately upon cancellation

## Hulu Cancellation vs. Competitors

| Service | Cancel Process | Access After Cancel | Cancellation Fee |
|---------|---------------|---------------------|-----------------|
| Hulu | Website or app settings | Until billing date | None |
| Netflix | Website or app | Until billing date | None |
| Disney+ | Website or app | Until billing date | None |
| YouTube TV | Google account settings | Until billing date | None |
| Peacock | Website or app | Until billing date | None |

All major streaming services now cancel cleanly with no fees — the days of calling a retention agent are largely over.

## FAQ

**How do I cancel Hulu immediately and stop being charged?**
Cancel through Hulu.com → Account → Cancel. You won't be charged again, but you'll still have access until the end of the current billing period. Hulu does not refund unused days.

**Can I cancel Hulu and get a refund?**
Hulu does not offer refunds for partial subscription months. If you were charged in error, contact Hulu support at help.hulu.com for a billing dispute.

**How do I cancel Hulu on a Roku, Fire TV, or Apple TV?**
If you're watching on Roku/Fire TV but originally subscribed at Hulu.com, cancel on the Hulu website. If you subscribed through the device's app store (Apple App Store, Google Play, Amazon), cancel through that platform's subscription settings.

**Can I cancel Hulu and restart later?**
Yes. You can cancel and resubscribe at any time. Hulu frequently offers promotional prices for returning subscribers — it's worth canceling and waiting 30 days if you want a discount.

**I canceled but I'm still being charged — what do I do?**
First, check that you canceled the correct subscription. Hulu subscriptions through Apple, Google, or Amazon are separate from Hulu.com subscriptions. Contact Hulu support at help.hulu.com if the charge persists after confirming cancellation.

## Bottom Line

To cancel Hulu: go to Hulu.com → Account → Cancel. Done in under 2 minutes. You keep access until your next billing date. No cancellation fee. If you subscribed through Apple or Google, cancel through their subscription settings instead. For Hulu + Live TV, cancel through Hulu to remove the entire bundle.

For a full comparison of Hulu vs YouTube TV — price, channels, sports, and DVR — see our comparison.

### Related Comparisons
- [Hulu vs YouTube TV: Full Comparison](/compare/hulu-vs-youtube-tv)
- [Netflix vs Hulu: Which Is Better Value?](/compare/netflix-vs-hulu)
- [Disney+ vs Hulu: What's the Difference?](/compare/disney-plus-vs-hulu)
`,
  },

  // DAN-1950: Ultra low cost airlines (246,000/mo, KD 22)
  {
    slug: "ultra-low-cost-airlines",
    title: "Ultra Low Cost Airlines: Are Spirit, Frontier, and Allegiant Worth It? (2026)",
    excerpt:
      "Ultra low cost carriers (ULCCs) like Spirit, Frontier, and Allegiant advertise flights as low as $19 — but fees for bags, seat selection, and carry-ons can triple the final price. Here's how they compare and when they're actually a good deal.",
    category: "travel",
    tags: ["spirit airlines", "frontier airlines", "allegiant", "ultra low cost airlines", "budget airlines", "baggage fees", "travel"],
    metaTitle: "Ultra Low Cost Airlines Compared: Spirit vs Frontier vs Allegiant (2026)",
    metaDescription:
      "Spirit, Frontier, and Allegiant start at $19 but fees can triple the price. Here's the full comparison of ultra low cost carriers — when they're worth it and when to avoid them.",
    relatedComparisonSlugs: [],
    sourceQuery: "ultra low cost airlines",
    sourceImpressions: 246000,
    publishedAt: NOW,
    content: `# Ultra Low Cost Airlines: Are Spirit, Frontier, and Allegiant Worth It? (2026)

**Ultra low cost carriers (ULCCs) can offer the cheapest base fares in the US — sometimes $19–$49 each way.** But fees for carry-on bags, checked bags, seat selection, and snacks mean the final price is often comparable to, or more than, a mainstream carrier. Whether they're worth it depends on how you travel.

Here's a complete comparison of Spirit, Frontier, and Allegiant — and how they stack up against Southwest and the major carriers.

## What Is an Ultra Low Cost Carrier?

ULCCs separate the base airfare from every additional service, charging fees for:
- Carry-on bags (overhead bin access)
- Checked bags
- Seat selection
- Priority boarding
- Food and drinks
- Printing your boarding pass at the airport

The strategy: advertise the lowest possible base fare, then recoup revenue through ancillary fees. Many travelers pay more in fees than they did for the ticket.

## Spirit vs Frontier vs Allegiant: The Key Differences

| | Spirit Airlines | Frontier Airlines | Allegiant Air |
|--|----------------|------------------|---------------|
| **Network** | 80+ destinations, hub at Fort Lauderdale | 100+ destinations, hub at Denver | 100+ smaller cities, hub at Las Vegas |
| **Focus** | Price-conscious leisure travelers | Bundles and "GoWild" pass | Secondary airports, leisure-only |
| **Base fare** | Very low | Very low | Very low |
| **Carry-on fee** | $39–$79 | $35–$75 | $18–$50 |
| **1st checked bag** | $39–$79 | $35–$79 | $18–$50 |
| **Seat selection** | $5–$50+ | $9–$50+ | $5–$30+ |
| **Cancellation rate (2023)** | ~3.0% | ~3.4% | ~1.7% |
| **On-time rate (2023)** | ~72% | ~70% | ~78% |

## Bag Fees: The Number That Actually Matters

Bag fees are where ULCCs get you. Here are current fees for the most common scenario — a carry-on bag:

### Spirit Airlines Carry-On Fee (2026)
- **Personal item** (fits under the seat, max 18"×14"×8"): **Free**
- **Carry-on bag** (overhead bin): **$39–$79** depending on route and when you add it
  - Cheapest at booking online
  - Most expensive at the gate ($79+)
- If your bag doesn't fit the personal item dimensions at the gate: you pay the carry-on fee right there

**Spirit's rule:** Only one personal item free. Every overhead bin bag costs extra. Many travelers are caught off guard at the gate when a small backpack is deemed too large.

### Frontier Airlines Bag Fees (2026)
- **Personal item** (under seat, max 14"×18"×8"): **Free**
- **Carry-on bag** (overhead bin): **$35–$75**
  - Buy at booking for lowest price; jumps to $55–$75 within 24 hours of flight
- **1st checked bag (50 lbs):** $35–$79
- **2nd checked bag:** $55–$99

Frontier's "WORKS" bundle: $89–$180/round-trip includes carry-on, checked bag, seat selection, and no change fee. For travelers who need these, WORKS often makes Frontier price-competitive with traditional carriers.

### Allegiant Air Bag Fees (2026)
- **Personal item:** Free
- **Carry-on bag:** $18–$50
- **1st checked bag:** $18–$50
- Allegiant's fees are notably lower than Spirit and Frontier

Allegiant flies to and from smaller regional airports (Bellingham instead of Seattle; Punta Gorda instead of Fort Myers), which can save $20–$40 each way in Uber/parking costs — or cost you if those airports are inconvenient.

## How Much Does It Really Cost to Fly Spirit?

Let's price out a round-trip from Chicago to Miami for one person, carrying a standard carry-on:

**Spirit Airlines (Base):**
- Base fare: $59 each way = $118 round-trip
- Carry-on bag: $49 each way = $98 round-trip
- Seat selection (window): $25 each way = $50 round-trip
- **Total: ~$266**

**Southwest Airlines (same route, with a free carry-on and checked bag):**
- Base fare: $149 each way = $298 round-trip
- Bags: $0 (first 2 checked bags free)
- Seat selection: $0 (open seating, no extra charge)
- **Total: ~$298**

With bag fees and seat selection, Spirit's advantage shrinks to $32 for a worse experience (no assigned seats, higher cancellation rate). Travelers who check bags frequently may find Spirit more expensive than Southwest.

## When Ultra Low Cost Airlines Are Actually Worth It

ULCCs make financial sense when:

1. **You're traveling with just a personal item** — fits under the seat, no overhead bin needed. One backpack or small bag for a weekend trip with no checked luggage.
2. **You don't care about seat assignment** — willing to take whatever seat remains, or sitting separately from your travel partner.
3. **Prices are dramatically lower** — if Spirit is $99 and United is $350 for the same route, even with a $45 carry-on fee, Spirit wins.
4. **You're flying a route ULCCs specialize in** — domestic leisure routes where legacy carriers price high.
5. **You're using the Frontier GoWild pass** — unlimited flights for ~$300/year; extraordinary value for flexible frequent flyers.

## When to Avoid Ultra Low Cost Airlines

Skip ULCCs when:

1. **You have checked bags** — fees can add $80–$160 round-trip, eliminating the savings.
2. **Your schedule is tight** — ULCCs have higher cancellation and delay rates. A missed connection on Spirit/Frontier on a Sunday afternoon can mean a 24+ hour delay.
3. **You're traveling with family** — seat selection fees per person add up fast. A family of four paying $20/seat each way = $160 in seat fees alone.
4. **You need to change your ticket** — Basic Economy on ULCCs typically offers no changes or changes at high cost.
5. **The airport is inconvenient** — Allegiant flies to secondary airports; add transportation cost to your total.

## Frontier GoWild Pass: The Best ULCC Value

Frontier's GoWild All-You-Can-Fly pass at ~$299/year allows unlimited domestic flights on standby. For flexible travelers (remote workers, students, retirees) who can take early morning flights with low load factors, this is genuinely extraordinary value — potentially hundreds of flights per year for $300.

The catch: you don't know if you'll get on the flight until the day of (or same morning). Not for travelers with firm schedules.

## FAQ

**Are ultra low cost airlines safe?**
Yes — Spirit, Frontier, and Allegiant are all FAA-certified and maintain the same safety standards as all US airlines. Safety is not where they cut corners. The difference is customer service, reliability, and ancillary fees.

**What is Spirit's cancellation policy?**
Spirit charges a change/cancellation fee of $49–$99 depending on how far in advance you cancel. Within 24 hours of booking, you can cancel for free (DOT rule). Spirit's "Flight Flex" add-on allows one free modification.

**Is Frontier better than Spirit?**
Both are ULCCs with similar pricing. Frontier's WORKS bundle is a better deal than Spirit's equivalent if you need bags and seats. Allegiant has lower base fees but serves fewer routes. All three have higher cancellation rates than major carriers.

**Does Southwest charge for bags?**
Southwest has historically included two free checked bags and a carry-on — a major differentiator. As of 2024, Southwest announced changes to bag policies; check their current policy at southwest.com before booking.

**How do I avoid bag fees on Spirit and Frontier?**
1. Travel with only a personal item (small backpack under 18"x14"x8")
2. Buy bags at initial booking (cheapest price)
3. Use Frontier's WORKS bundle if you need bags + seat selection
4. Consider a Spirit credit card (includes free carry-on)

## Bottom Line

Ultra low cost airlines offer the lowest base fares in the US but charge for everything else. For carry-on-only travelers on non-time-sensitive routes, they can represent genuine savings. For travelers with checked bags, families who need seat assignments, or anyone with a tight schedule, the total cost after fees often equals or exceeds a mainstream carrier — with worse reliability.

Compare prices for your specific route including estimated fees before booking.

### Related Comparisons
- [Spirit Airlines vs Frontier: Full Comparison](/compare/spirit-airlines-vs-frontier)
- [Southwest vs Spirit Airlines: Which Is Cheaper?](/compare/southwest-vs-spirit-airlines)
- [American Airlines vs Delta: Which Is Better?](/compare/american-airlines-vs-delta)
`,
  },

  // DAN-1951: Frontier bag fees (33,100/mo, KD 14)
  {
    slug: "frontier-bag-fees",
    title: "Frontier Airlines Bag Fees: Carry-On and Checked Bag Costs (2026)",
    excerpt:
      "Frontier Airlines charges $35–$79 for carry-on bags and $35–$99 for checked bags in 2026. Fees are lowest when added at booking. Here's the full fee schedule, how to avoid them, and how Frontier compares to Spirit and Southwest.",
    category: "travel",
    tags: ["frontier airlines", "bag fees", "carry-on", "checked bag", "spirit airlines", "southwest", "budget airline"],
    metaTitle: "Frontier Airlines Bag Fees 2026: Carry-On, Checked Bag Costs & How to Avoid Them",
    metaDescription:
      "Frontier charges $35–$79 for carry-ons and $35–$99 for checked bags in 2026. Fees jump at the gate. Full schedule + how to avoid them and compare to Spirit/Southwest.",
    relatedComparisonSlugs: [],
    sourceQuery: "bag fees frontier",
    sourceImpressions: 33100,
    publishedAt: NOW,
    content: `# Frontier Airlines Bag Fees: Carry-On and Checked Bag Costs (2026)

**Frontier Airlines charges $35–$79 for carry-on bags and $35–$99 for checked bags in 2026.** The exact fee depends on when you add it — fees are lowest at booking and highest at the gate. For most travelers, adding bags at booking is the most affordable option.

Here's the complete Frontier bag fee schedule, every way to avoid the fees, and how Frontier compares to Spirit and Southwest.

## Frontier Airlines Bag Fee Schedule (2026)

### Carry-On Bag Fees

| When You Add It | Carry-On Fee |
|-----------------|-------------|
| At booking (online) | $35–$45 |
| After booking, before check-in | $45–$55 |
| During check-in (24h window) | $55–$65 |
| At the airport (gate) | $75–$79+ |

**Carry-on size requirement:** Maximum 24"×16"×10" (including handles/wheels), must fit in overhead bin. Frontier is strict about this.

**Personal item:** Free. Maximum size is 14"×18"×8". This must fit completely under the seat in front of you. A small backpack that fits under the seat is free — even if it's stuffed.

### Checked Bag Fees

| When You Add It | 1st Checked Bag | 2nd Checked Bag |
|-----------------|-----------------|-----------------|
| At booking | $35–$45 | $55–$65 |
| During online check-in | $45–$55 | $65–$79 |
| At the airport counter | $79 | $99 |

**Weight limit:** 50 lbs for standard fee. Overweight fee: $75 for 51–100 lbs. Oversized (over 62" linear): $75.

**Key insight:** If you know you're checking a bag, add it at booking. Gate fees are 2–3x more expensive than booking fees.

## The Frontier WORKS Bundle

Frontier's "WORKS" bundle is a per-person add-on that includes:

| Included in WORKS | Standard Value |
|-------------------|----------------|
| Carry-on bag | $35–$45 |
| 1st checked bag | $35–$45 |
| Seat selection (any seat) | $9–$50 |
| Priority boarding | $5–$15 |
| No change/cancel fee | $49–$79 value |

**WORKS cost:** Typically $89–$180 round-trip per person depending on route and timing.

**When WORKS is worth it:** If you're checking a bag AND selecting a seat AND value flexibility, WORKS is often the better deal than adding each item separately. For a round-trip traveler with a checked bag and desired seat, WORKS can save $30–$50 vs. buying items à la carte.

## Frontier Personal Item: What Qualifies as Free?

Frontier's free personal item is 14"×18"×8" — a small backpack or a personal-size tote that fits under the seat.

**Items that qualify (under the size limit):**
- Small backpack (~20–25L)
- Laptop bag
- Purse or handbag
- Small duffel (if compressible)

**Items that do NOT qualify:**
- Standard backpack (most are too deep)
- 22" roller/carry-on suitcase (too large even for overhead)
- Camera bag that exceeds dimensions

**Frontier's enforcement:** Frontier gate agents check bag sizes with a sizer frame at the gate on many flights. If your personal item doesn't fit, you'll pay the carry-on fee at the gate (up to $79).

**Practical tip:** A 20L–25L backpack that compresses works well as a Frontier personal item. Brands like Osprey Daylite, Patagonia Atom, or similar slim-profile daypacks fit comfortably.

## How to Avoid Frontier Bag Fees

**Option 1: Fly with only a personal item**
Pack a small backpack that fits under the seat. This is the only way to pay the base Frontier fare without extra fees. You'd be surprised what fits in a 20L pack for a weekend trip.

**Option 2: Use the Frontier credit card**
The Frontier Airlines World Mastercard includes:
- Free carry-on bag for the cardholder
- Free first checked bag for the cardholder
- 50,000 bonus miles on approval
- Annual fee: $89/year

If you fly Frontier more than twice a year with checked bags, the card's bag fee savings (~$140+/year in round-trip bag fees) more than offset the annual fee.

**Option 3: Buy WORKS at booking**
If you need carry-on + checked bag + seat selection, WORKS is typically 10–20% cheaper than buying each à la carte.

**Option 4: Book early**
Bag fees are lowest when added at booking. The same carry-on that costs $35 at booking costs $79 at the gate. Set your reminder and add bags immediately when you book.

## Frontier vs Spirit vs Southwest Bag Fees

| | Frontier | Spirit | Southwest |
|--|---------|--------|-----------|
| **Personal item** | Free (14×18×8") | Free (18×14×8") | Free |
| **Carry-on bag** | $35–$79 | $39–$79 | Free (2 bags) |
| **1st checked bag** | $35–$79 | $39–$79 | Free |
| **2nd checked bag** | $55–$99 | $45–$99 | Free |
| **Carry-on enforcement** | Strict at gate | Strict at gate | N/A |
| **WORKS/bundle option** | Yes ($89–$180) | Yes (similar) | N/A (already included) |

**Southwest** continues to include two free checked bags, a carry-on, and a personal item for all passengers — a major advantage for travelers who check bags. However, Southwest is changing its seating model (moving to assigned seating in 2025–2026); check current policies.

**Key takeaway:** Frontier and Spirit are nearly identical on bag fees. Both are dramatically worse than Southwest if you have bags. Southwest's lower flexibility (limited destinations) and no-same-day cheap last-minute tickets are the tradeoffs.

## Frontier vs American/Delta/United Bag Fees

| | Frontier (booking) | American | Delta | United |
|--|-------------------|----------|-------|--------|
| **Carry-on** | $35–$45 | Free (non-Basic) | Free (non-Basic) | Free (non-Basic) |
| **1st checked bag** | $35–$45 | $40 | $35 | $35 |
| **2nd checked bag** | $55–$65 | $45 | $45 | $45 |

For travelers with just a carry-on: Frontier can be significantly cheaper on base fare. For travelers with a checked bag: the fees narrow the gap considerably.

**When Frontier beats the majors:** If the Frontier base fare is $75 less than Delta for the same route, and you only have a personal item, Frontier wins. If you add a checked bag ($40 each way on Frontier vs included on Delta's higher fare), you may break even or pay more on Frontier.

## FAQ

**What size bag is free on Frontier?**
Frontier allows one free personal item per passenger, maximum 14"×18"×8". The item must fit completely under the seat in front of you. Anything larger requires a carry-on fee.

**Can I bring a backpack on Frontier for free?**
Yes — if it fits the personal item dimensions (14"×18"×8") and fits under the seat. Most standard backpacks are too large and require the carry-on fee.

**Why are Frontier bag fees so high at the gate?**
Frontier charges the highest fees at the gate to incentivize passengers to buy bags in advance (at lower prices online). The strategy generates revenue from travelers who forget or decide to add bags last-minute.

**Does Frontier weigh carry-on bags?**
Frontier measures but generally does not weigh carry-on bags. The concern is dimensions — that it fits in the overhead bin. Checked bags are weighed at the counter (50 lb limit).

**Is Frontier reliable?**
Frontier has a higher cancellation rate (~3.4%) and lower on-time rate (~70%) compared to Delta (~0.5% cancel, ~88% on-time). For time-sensitive travel, this matters. For flexible leisure travel, the cost savings may be worth it.

**Does Frontier have free bags with any credit cards?**
The Frontier Airlines World Mastercard includes a free carry-on and first checked bag for the cardholder. No annual fee waiver on the bag benefit — you'll pay the $89/year card fee but save on bag fees.

## Bottom Line

Frontier bag fees are $35–$79 for carry-ons and $35–$99 for checked bags. The single most important rule: buy bags at booking for the lowest price. Gate fees are up to twice as expensive. If you're checking a bag and want seat selection, the WORKS bundle typically saves money vs. à la carte. For carry-on-free travelers with a small personal item, Frontier can represent genuine savings over major carriers.

For a full comparison of Frontier vs Spirit — fees, routes, reliability, and which is actually cheaper — see our comparison.

### Related Comparisons
- [Spirit Airlines vs Frontier: Full Comparison](/compare/spirit-airlines-vs-frontier)
- [Southwest vs Frontier Airlines: Which Is Better?](/compare/southwest-vs-frontier)
- [Ultra Low Cost Airlines: Spirit, Frontier, Allegiant Compared](/blog/ultra-low-cost-airlines)
`,
  },
];

async function main() {
  console.log(`DAN-1940 Wave 5: Publishing ${POSTS.length} tactical-intent blog posts...\n`);

  let success = 0;
  for (const post of POSTS) {
    console.log(`→ ${post.slug}`);
    try {
      const { publishedAt, ...rest } = post;
      await prisma.blogArticle.upsert({
        where: { slug: rest.slug },
        create: {
          ...rest,
          status: "published",
          isAutoGenerated: false,
          publishedAt,
        },
        update: {
          ...rest,
          status: "published",
          publishedAt,
        },
      });
      console.log(`  ✓ Published`);
      success++;
    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }

  const total = await prisma.blogArticle.count({ where: { status: "published" } });
  console.log(
    `\nDone: ${success}/${POSTS.length} posts published. Total published blog articles: ${total}`
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
