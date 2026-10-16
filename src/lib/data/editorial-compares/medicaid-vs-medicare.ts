import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Medicaid vs Medicare (blog /blog/medicaid-vs-medicare).
 * Facts read 16 October 2026 from Medicare.gov (eligibility, parts, Medicaid
 * help with costs), CMS (2026 Part A and B premiums and deductibles) and
 * Medicaid.gov (eligibility policy). General information only; no plan
 * recommendation, no state income limits. No winner.
 */

const A = "medicaid";
const B = "medicare";

const MEDICARE_START = "https://www.medicare.gov/basics/get-started-with-medicare";
const MEDICARE_PARTS = "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/parts-of-medicare";
const MEDICARE_MEDICAID = "https://www.medicare.gov/basics/costs/help/medicaid";
const CMS_2026 = "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles";
const MEDICAID_ELIG = "https://www.medicaid.gov/medicaid/eligibility-policy";

const SOURCE_DATE = "2026-10-16";
const PUBLISHED = "2026-10-16T00:00:00Z";
const COV = "Coverage";

const SHORT_ANSWER =
  "Medicare is federal health insurance for people 65 or older, and for some younger people with a disability, End-Stage Renal Disease or ALS. Medicaid is a joint federal and state program for certain people with low income, with eligibility rules that differ by state. Medicare has set national costs, such as the 2026 Part B premium of $202.90 a month and $283 deductible. Some people qualify for both, and then Medicaid can pay Medicare premiums and cost sharing.";

const FAQS = [
  {
    question: "What is the main difference between Medicaid and Medicare?",
    answer:
      "Medicare is based mainly on age or disability: it covers people 65 or older and some younger people with a disability, End-Stage Renal Disease or ALS. Medicaid is based mainly on income and is run by each state within federal rules, so who qualifies differs by state.",
  },
  {
    question: "Can I have both Medicaid and Medicare?",
    answer:
      "Yes. People who qualify for both are often called dual eligibles. If you have Medicare and full-benefit Medicaid, your state pays your Part B premium, and depending on your Medicaid level it may also pay deductibles, coinsurance, copayments and any Part A premium. You also automatically get Extra Help with drug costs.",
  },
  {
    question: "How much does Medicare cost in 2026?",
    answer:
      "CMS set the 2026 standard Part B premium at $202.90 a month and the Part B deductible at $283 a year. The Part A inpatient hospital deductible is $1,736. Most people pay no Part A premium because they have at least 40 quarters of Medicare-covered work. Higher incomes pay more for Part B.",
  },
  {
    question: "Who qualifies for Medicaid?",
    answer:
      "Federal law requires states to cover certain groups, such as low-income families, qualified pregnant women and children, and people receiving SSI. Most states also expanded Medicaid to adults under 65 with income at or below 133% of the federal poverty level. Your state's Medicaid office decides eligibility.",
  },
  {
    question: "Does Medicaid cover things Medicare doesn't?",
    answer:
      "Yes. Medicaid offers benefits not normally covered by Medicare, like nursing home care and personal care services. What is covered varies by state.",
  },
  {
    question: "Is Medicare or Medicaid better?",
    answer:
      "They are not alternatives for most people: eligibility decides which applies, and some people have both. Check Medicare eligibility by age or disability and Medicaid eligibility with your state. This is general information, not medical, legal or financial advice.",
  },
];

const VERDICT = `Medicare: for people 65 or older, or younger with a qualifying disability, ESRD or ALS. National rules and costs.

Medicaid: for people with limited income who meet their state's rules. Costs and benefits vary by state.

Many people qualify for both. This is general information, not medical, legal or financial advice.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Medicare eligibility rests on age (65 or older) or certain disabilities, ESRD or ALS.
- Medicaid eligibility rests on income and other state rules.
- The 2026 Medicare Part B premium is $202.90 a month with a $283 annual deductible.
- People with both programs can have Medicaid pay Medicare premiums and cost sharing.
- Medicaid covers some services Medicare normally doesn't, like nursing home care.

Who each program covers

Medicare is health insurance for people 65 or older who meet citizenship or residency requirements, and for some younger people with a disability, End-Stage Renal Disease or ALS. Medicaid is a joint federal and state program that, with CHIP, covers over 77.9 million Americans, including children, pregnant women, parents, seniors and people with disabilities. Federal law requires states to cover certain groups, and most states expanded coverage to adults under 65 with income at or below 133% of the federal poverty level.

What Medicare covers

1. Part A (Hospital Insurance): inpatient hospital care, skilled nursing facility care, hospice and home health care.
2. Part B (Medical Insurance): doctors' services, outpatient care, durable medical equipment and many preventive services.
3. Part D: prescription drug coverage, through a drug plan or a Medicare Advantage Plan with drug coverage.

What it costs

CMS set these 2026 Medicare amounts: a $202.90 standard monthly Part B premium, a $283 Part B deductible and a $1,736 Part A inpatient hospital deductible. Medicaid costs and any cost sharing are set by each state within federal rules.

Having both

If you have Medicare and full-benefit Medicaid, your state pays your Part B premium and may pay your deductibles, coinsurance and copayments, plus any Part A premium. You automatically get Extra Help with drug costs. Starting January 1, 2027 (or earlier in some states), certain adults must complete at least 80 hours a month of work or other approved activities for Medicaid; this does not apply to people with Medicare.

Where to start

Check Medicare eligibility through Medicare.gov or Social Security, and Medicaid eligibility with your state Medicaid office. Delta Dental PPO vs Delta Dental Premier covers a related dental coverage choice. This is general information, not medical, legal or financial advice.`;

const BUILT = buildEditorialComparison({
  slug: "medicaid-vs-medicare",
  title: "Medicaid vs Medicare: Who Qualifies and What It Costs",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "health",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "Medicaid",
      shortDesc: "Joint federal and state health coverage for certain people with low income; rules vary by state.",
      imageUrl: null,
      entityType: "program",
      position: 0,
      pros: [
        "Covers services Medicare normally doesn't, like nursing home care and personal care",
        "Can pay Medicare premiums and cost sharing for people with both",
      ],
      cons: ["Eligibility and benefits differ by state", "Income and resource rules apply"],
      bestFor: "People with limited income who meet their state's rules",
    },
    {
      id: B,
      slug: B,
      name: "Medicare",
      shortDesc: "Federal health insurance for people 65 or older and some younger people with a disability, ESRD or ALS.",
      imageUrl: null,
      entityType: "program",
      position: 1,
      pros: ["National rules and costs", "Most people pay no Part A premium"],
      cons: ["2026 Part B premium of $202.90 a month and $283 deductible", "Does not normally cover nursing home care or personal care"],
      bestFor: "People 65 or older, or younger with a qualifying condition",
    },
  ],
  keyDifferences: [
    { label: "Based on", entityAValue: "Income and state rules", entityBValue: "Age 65+ or qualifying disability, ESRD or ALS", winner: "tie" },
    { label: "Run by", entityAValue: "States, within federal rules", entityBValue: "Federal government (CMS)", winner: "tie" },
    { label: "2026 Part B premium", entityAValue: "Can be paid by Medicaid for people with both", entityBValue: "$202.90 a month standard", winner: "tie" },
    { label: "Long-term care", entityAValue: "Covers nursing home care", entityBValue: "Not normally covered", winner: "tie" },
  ],
  attributes: [
    textAttr("eligibility", "Eligibility", COV, A, B, "Low income and other state rules; ACA expansion to 133% of the poverty level in most states", "Age 65 or older, or a disability, ESRD or ALS"),
    textAttr("admin", "Administered by", COV, A, B, "Each state, jointly funded with the federal government", "Federal program run by CMS"),
    textAttr("costs", "2026 costs", COV, A, B, "Set by each state within federal rules", "Part B $202.90 a month, $283 deductible; Part A hospital deductible $1,736"),
    textAttr("coverage", "Coverage", COV, A, B, "Varies by state; includes nursing home and personal care", "Part A hospital, Part B medical, Part D drugs"),
    textAttr("both", "If you have both", COV, A, B, "State pays the Part B premium and may pay cost sharing", "Extra Help with drug costs is automatic"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "delta-dental-ppo-vs-delta-dental-premier", title: "Delta Dental PPO vs Delta Dental Premier", category: "health" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "Not alternatives: Medicare follows age or disability, Medicaid follows income and state rules, and some people have both.",
    keyFact: "The 2026 standard Medicare Part B premium is $202.90 a month.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 12,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "Medicare.gov: Get started with Medicare", url: MEDICARE_START },
      { name: "Medicare.gov: Parts of Medicare", url: MEDICARE_PARTS },
      { name: "Medicare.gov: Medicaid", url: MEDICARE_MEDICAID },
      { name: "CMS: 2026 Medicare Parts A and B premiums and deductibles", url: CMS_2026 },
      { name: "Medicaid.gov: Eligibility policy", url: MEDICAID_ELIG },
    ],
  },
  resources: [
    { type: "external", label: "Medicare.gov: Get started with Medicare", url: MEDICARE_START, description: "Medicare is for people 65 or older, and some younger people with a disability, ESRD or ALS." },
    { type: "external", label: "Medicare.gov: Parts of Medicare", url: MEDICARE_PARTS, description: "What Parts A, B and D help cover." },
    { type: "external", label: "Medicare.gov: Medicaid", url: MEDICARE_MEDICAID, description: "Medicaid benefits not normally covered by Medicare; what Medicaid pays for people with both; 2027 work requirement does not apply to people with Medicare." },
    { type: "external", label: "CMS: 2026 Medicare Parts A and B premiums and deductibles", url: CMS_2026, description: "Part B premium $202.90, Part B deductible $283, Part A inpatient deductible $1,736 for 2026." },
    { type: "external", label: "Medicaid.gov: Eligibility policy", url: MEDICAID_ELIG, description: "Joint federal and state program; over 77.9 million covered with CHIP; mandatory groups; expansion to 133% of the poverty level." },
  ],
  metaTitle: "Medicaid vs Medicare | A Versus B",
});

BUILT.metadata.metaDescription =
  "Medicaid vs Medicare: who qualifies (income vs age or disability), what each covers, 2026 Part B premium of $202.90, and how dual eligibility works.";

export const MEDICAID_VS_MEDICARE: EditorialComparison = BUILT;
