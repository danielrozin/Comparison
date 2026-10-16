import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: GEICO vs State Farm (blog /blog/cheapest-car-insurance-companies-2026-ranked-and-compared).
 * Facts read 16 October 2026 from GEICO (company history) and State Farm
 * (company overview, 2026 newsroom history). Company structure and history
 * only. No quotes, rates, ratings or claims-satisfaction scores. No winner.
 */

const A = "geico";
const B = "state-farm";

const GEICO_HISTORY = "https://www.geico.com/about/corporate/history-the-full-story/";
const SF_OVERVIEW = "https://www.statefarm.com/about-us/company-overview/company-profile";
const SF_HISTORY = "https://newsroom.statefarm.com/the-104-year-customer-first-legacy-of-state-farm/";

const SOURCE_DATE = "2026-10-16";
const PUBLISHED = "2026-10-16T00:00:00Z";
const INS = "Insurance";

const SHORT_ANSWER =
  "GEICO and State Farm are both large U.S. auto insurers, but they are built differently. GEICO, founded in 1936, has been a Berkshire Hathaway subsidiary since 1996 and grew by selling directly to customers by phone and online. State Farm, which issued its first policy in 1922, is a mutual company owned by its policyholders rather than shareholders and sells through a network of agents. Your price depends on your driver profile and state, so get quotes from both.";

const FAQS = [
  {
    question: "Is GEICO or State Farm cheaper?",
    answer:
      "It depends on you. Auto insurance prices depend on your driving record, vehicle, location, coverage and discounts, so one company can be cheaper for one driver and pricier for another. Get quotes from both with the same coverage limits and deductibles.",
  },
  {
    question: "Who owns GEICO and who owns State Farm?",
    answer:
      "GEICO is a subsidiary of Berkshire Hathaway, which bought its remaining shares in 1995 and completed the deal by 1996. State Farm Mutual Automobile Insurance Company is a mutual company, which means it answers to its policyholders rather than shareholders.",
  },
  {
    question: "Does State Farm pay dividends to policyholders?",
    answer:
      "State Farm announced a $5 billion mutual auto policyholder dividend in February 2026. Whether and how much a policyholder receives depends on State Farm's terms and state rules.",
  },
  {
    question: "Do I deal with an agent at GEICO or State Farm?",
    answer:
      "State Farm sells mainly through its agents. GEICO was built on selling directly to customers and offers 24-hour phone service and online and mobile quotes and purchase; it also runs the GEICO Insurance Agency for homeowners, renters and other coverage.",
  },
  {
    question: "Where are GEICO and State Farm available?",
    answer:
      "GEICO offers insurance in all 50 states and the District of Columbia. State Farm is headquartered in Bloomington, Illinois. Check each company's quote tool or agent for coverage in your state.",
  },
  {
    question: "How old are GEICO and State Farm?",
    answer:
      "State Farm issued its first policy on June 7, 1922. GEICO was established in 1936 as the Government Employees Insurance Company, first serving federal employees and certain military personnel.",
  },
];

const VERDICT = `GEICO suits drivers who want to buy and manage a policy directly by phone, online or in an app.

State Farm suits drivers who want a local agent and a policyholder-owned mutual insurer.

Prices depend on your profile, so compare quotes with identical coverage. This is general information, not financial or legal advice.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- GEICO was founded in 1936 and has been a Berkshire Hathaway subsidiary since 1996.
- State Farm issued its first policy on June 7, 1922 and is a mutual company owned by policyholders.
- GEICO grew by selling directly; State Farm sells through agents.
- State Farm announced a $5 billion mutual auto policyholder dividend in February 2026.
- Neither is cheapest for everyone; compare quotes with the same coverage.

Ownership and structure

GEICO, the Government Employees Insurance Company, was founded in 1936 by Leo and Lillian Goodwin. Berkshire Hathaway bid for its remaining shares in 1995, and by 1996 GEICO was a Berkshire subsidiary. State Farm Mutual Automobile Insurance Company, based in Bloomington, Illinois, was founded by G.J. Mecherle and is a mutual company that answers to customers rather than shareholders.

How you buy

GEICO's model has been direct marketing from the start, with 24-hour phone service since 1980 and mobile quote and purchase since 2010. State Farm sells through its agent network and describes a human plus digital approach.

Scale and reach

GEICO offers insurance in all 50 states and the District of Columbia and describes itself as having more than 40,000 associates in 17 major locations. State Farm's product lines include auto, life (since 1929) and fire and property (since 1935).

What to compare in quotes

1. Same liability limits, deductibles and optional coverages on both quotes.
2. Discounts you qualify for.
3. Whether you prefer a local agent or direct service.
4. Claims and service options in your state.

Allstate vs GEICO, Farmers Insurance vs State Farm and GEICO vs USAA cover other insurer pairs. This is general information, not financial or legal advice.`;

const BUILT = buildEditorialComparison({
  slug: "geico-vs-state-farm",
  title: "GEICO vs State Farm: How the Two Insurers Differ",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "finance",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "GEICO",
      shortDesc: "Auto insurer founded in 1936, a Berkshire Hathaway subsidiary since 1996, built on direct sales.",
      imageUrl: null,
      entityType: "company",
      position: 0,
      pros: ["Direct buying by phone, online or mobile", "Insurance in all 50 states and DC", "24-hour phone service"],
      cons: ["Built around direct service rather than a local agent", "Shareholder-owned (Berkshire Hathaway), not a mutual"],
      bestFor: "Drivers who want to buy and manage a policy themselves",
    },
    {
      id: B,
      slug: B,
      name: "State Farm",
      shortDesc: "Mutual insurer from Bloomington, Illinois, that issued its first auto policy in 1922 and sells through agents.",
      imageUrl: null,
      entityType: "company",
      position: 1,
      pros: ["Mutual company owned by policyholders", "Local agent network", "Auto, life and property lines"],
      cons: ["Agent-led model may not suit people who want fully self-serve buying", "Dividends depend on company terms and state rules"],
      bestFor: "Drivers who want a local agent and a mutual insurer",
    },
  ],
  keyDifferences: [
    { label: "Ownership", entityAValue: "Berkshire Hathaway subsidiary since 1996", entityBValue: "Mutual company owned by policyholders", winner: "tie" },
    { label: "Founded", entityAValue: "1936", entityBValue: "1922 (first policy June 7)", winner: "tie" },
    { label: "Sales model", entityAValue: "Direct by phone, online and mobile", entityBValue: "Agent network", winner: "tie" },
    { label: "Headquarters", entityAValue: "Chevy Chase, Maryland (since 1959)", entityBValue: "Bloomington, Illinois", winner: "tie" },
  ],
  attributes: [
    textAttr("owner", "Ownership", INS, A, B, "Berkshire Hathaway subsidiary", "Mutual company"),
    textAttr("founded", "Founded", INS, A, B, "1936 by Leo and Lillian Goodwin", "First policy June 7, 1922, founded by G.J. Mecherle"),
    textAttr("sales", "How you buy", INS, A, B, "Direct: phone, online, mobile", "Through State Farm agents"),
    textAttr("reach", "Availability", INS, A, B, "All 50 states and the District of Columbia", "Check with an agent for your state"),
    textAttr("dividend", "Policyholder dividend", INS, A, B, "Not a mutual", "$5 billion mutual auto dividend announced February 2026"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "allstate-vs-geico", title: "Allstate vs GEICO", category: "finance" },
    { slug: "farmers-insurance-vs-state-farm", title: "Farmers Insurance vs State Farm", category: "finance" },
    { slug: "geico-vs-usaa", title: "GEICO vs USAA", category: "finance" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "GEICO for direct, self-serve buying; State Farm for a local agent and a mutual structure. Prices depend on the driver.",
    keyFact: "State Farm is a policyholder-owned mutual; GEICO has been a Berkshire Hathaway subsidiary since 1996.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 12,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "GEICO: History, the full story", url: GEICO_HISTORY },
      { name: "State Farm: Company overview", url: SF_OVERVIEW },
      { name: "State Farm newsroom: The 104-year customer-first legacy", url: SF_HISTORY },
    ],
  },
  resources: [
    { type: "external", label: "GEICO: History, the full story", url: GEICO_HISTORY, description: "Founded 1936; Berkshire Hathaway subsidiary by 1996; Chevy Chase headquarters 1959; 24-hour phone service 1980; mobile buying 2010; all 50 states and DC; 40,000+ associates." },
    { type: "external", label: "State Farm: Company overview", url: SF_OVERVIEW, description: "Mission, values and mutual company structure." },
    { type: "external", label: "State Farm newsroom: The 104-year customer-first legacy", url: SF_HISTORY, description: "June 2026. First policy June 7, 1922; mutual company; Life 1929, Fire 1935; $5 billion mutual auto policyholder dividend announced February 2026." },
  ],
  metaTitle: "GEICO vs State Farm | A Versus B",
});

BUILT.metadata.metaDescription =
  "GEICO vs State Farm: Berkshire Hathaway subsidiary vs policyholder-owned mutual, direct buying vs local agents, history and what to compare in quotes.";

export const GEICO_VS_STATE_FARM: EditorialComparison = BUILT;
