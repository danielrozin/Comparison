import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Active Duty vs Army National Guard.
 * GoArmy army structure, National Guard and pay pages; Alabama National Guard FAQ.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Active-duty Soldiers serve full time, usually living on or near a base, and are paid by rank and years of service. Army National Guard Soldiers serve part time: one weekend a month and two weeks a year, while keeping a civilian job or studies, and are paid for the time they train. The Guard has a dual mission: the state governor or the federal government can call it up, and it can be called to active duty when needed. Guard contracts run three to six years depending on the job.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Active duty is full time; the Army National Guard is part time.
- Guard Soldiers drill one weekend a month and train two weeks a year.
- The Guard serves both the state (under the governor) and the nation; active duty serves a federal mission.
- Guard units exist in all 50 states, DC, Guam, Puerto Rico and the Virgin Islands.
- Guard service contracts range from three to six years, depending on the job.

Time commitment

Active-duty Soldiers work for the Army full time and usually live on or near a base. Army National Guard Soldiers attend paid drill one weekend a month and paid annual training for two weeks a year, and live in their local community the rest of the time.

Mission

Active duty fulfils a federal mission. The Guard has a dual mission: the governor can call it up for emergencies such as floods and hurricanes, and the president can call it to federal service. Guard Soldiers can be temporarily called to active duty when needed.

Pay and benefits

1. Active-duty pay follows rank and years of service.
2. Guard and Reserve pay is based on the time served, including the monthly weekend and two weeks of annual training.
3. Both have access to Army benefits such as health care and the GI Bill, with differences in coverage and cost between full-time and part-time service.

Training

All enlisted Soldiers complete 10 weeks of Basic Combat Training plus job training, whichever component they join.

Who should pick which

Pick active duty if you want the military as your full-time career. Pick the National Guard if you want to serve part time near home and help your state in emergencies. Enlisted vs officer covers the other main choice.`;

const BUILT = buildEditorialComparison({
  slug: "active-duty-vs-national-guard",
  title: "Active Duty vs National Guard: Time and Mission",
  shortAnswer: SHORT_ANSWER,
  verdict: "Active duty: full-time federal service, usually on or near a base.\n\nNational Guard: part time, one weekend a month and two weeks a year, with a state and federal mission.\n\nTalk to a recruiter about current contracts and incentives.",
  category: "military",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "active-duty", "slug": "active-duty", "name": "Active Duty", "shortDesc": "Full-time Army service, usually living on or near a base.", "imageUrl": null, "entityType": "concept", "position": 0, "pros": ["Full-time pay by rank and years of service", "Ongoing training and specialization", "Full Army benefits"], "cons": ["Usually relocated to live on or near a base", "Full-time commitment for the enlistment"], "bestFor": "People who want military service as their full-time job"},
    {"id": "national-guard", "slug": "national-guard", "name": "Army National Guard", "shortDesc": "Part-time service with a state and federal mission.", "imageUrl": null, "entityType": "concept", "position": 1, "pros": ["Serve close to home while keeping a civilian job or school", "Drill one weekend a month and train two weeks a year", "Units in all 50 states, DC, Guam, Puerto Rico and the Virgin Islands"], "cons": ["Can be called to active duty when needed", "Can be activated by the governor for state emergencies"], "bestFor": "People who want to serve part time in their community"},
  ],
  keyDifferences: [{"label": "Schedule", "entityAValue": "Full time", "entityBValue": "One weekend a month, two weeks a year", "winner": "tie"}, {"label": "Mission", "entityAValue": "Federal", "entityBValue": "State and federal", "winner": "tie"}, {"label": "Where you live", "entityAValue": "Usually on or near a base", "entityBValue": "In your local community", "winner": "tie"}, {"label": "Civilian job or school", "entityAValue": "Not alongside service", "entityBValue": "Yes, alongside service", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Called up by", "Military service", "active-duty", "national-guard", "Federal government", "Governor or federal government"),
    textAttr("a1", "Pay basis", "Military service", "active-duty", "national-guard", "Rank and years of service", "Time served, including drills and annual training"),
    textAttr("a2", "Contract length", "Military service", "active-duty", "national-guard", "Varies by enlistment", "Three to six years, by job"),
    textAttr("a3", "Initial training", "Military service", "active-duty", "national-guard", "Basic Combat Training (10 weeks) plus job training", "Basic Combat Training (10 weeks) plus job training"),
    textAttr("a4", "Locations", "Military service", "active-duty", "national-guard", "Army bases", "All 50 states, DC, Guam, Puerto Rico, Virgin Islands"),
  ],
  faqs: [{"question": "What is the difference between active duty and the National Guard?", "answer": "Active duty is full-time federal service, usually living on or near a base. The Army National Guard is part time, one weekend a month and two weeks a year, and serves both the state and the nation."}, {"question": "How often does the National Guard train?", "answer": "Guard Soldiers drill one weekend a month and attend two weeks of annual training each year."}, {"question": "Can National Guard Soldiers be deployed?", "answer": "Yes. Guard Soldiers can be temporarily called to active duty when needed, and the governor can call them up for state emergencies."}, {"question": "How long is a National Guard contract?", "answer": "Army National Guard service contracts range from three to six years, depending on the job."}, {"question": "Do Guard Soldiers get the GI Bill?", "answer": "Active-duty, Army Reserve and Army National Guard Soldiers are all eligible for Army benefits including the GI Bill, with some differences between full-time and part-time service."}, {"question": "How is the National Guard different from the Army Reserve?", "answer": "Both train one weekend a month and two weeks a year. The Guard has a state mission under the governor as well as a federal one; the Reserve is federal only."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Active duty for a full-time military career; the National Guard for part-time service near home with a state mission.", keyFact: "National Guard Soldiers train one weekend a month and two weeks a year; active duty is full time." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "U.S. Army: Ways to Serve", "url": "https://www.goarmy.com/explore-the-army/army-structure"}, {"name": "U.S. Army: Army National Guard", "url": "https://www.goarmy.com/explore-the-army/army-structure/national-guard"}, {"name": "U.S. Army: Money and pay charts", "url": "https://www.goarmy.com/benefits/while-you-serve/money-pay"}]},
  resources: [{"type": "external", "label": "U.S. Army: Ways to Serve", "url": "https://www.goarmy.com/explore-the-army/army-structure", "description": "Active duty full time on or near a base; Reserve and Guard part time; 10-week Basic Combat Training; benefits incl. GI Bill."}, {"type": "external", "label": "U.S. Army: Army National Guard", "url": "https://www.goarmy.com/explore-the-army/army-structure/national-guard", "description": "Governor and federal missions; all 50 states, DC, Guam, PR, VI; one weekend a month and two weeks a year; 3-6 year contracts."}, {"type": "external", "label": "U.S. Army: Money and pay charts", "url": "https://www.goarmy.com/benefits/while-you-serve/money-pay", "description": "Active duty paid by rank and years; Guard and Reserve paid for time served."}],
  metaTitle: "Active Duty vs Army National Guard | A Versus B",
});

BUILT.metadata.metaDescription = "Active duty vs Army National Guard: full-time vs one weekend a month and two weeks a year, federal vs state and federal mission, pay basis and contract length.";

export const ACTIVE_DUTY_VS_NATIONAL_GUARD: EditorialComparison = BUILT;
