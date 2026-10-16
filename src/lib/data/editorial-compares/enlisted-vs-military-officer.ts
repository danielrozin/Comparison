import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Enlisted Soldier vs Commissioned Officer.
 * GoArmy steps to join, officer paths, ROTC and West Point pages.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Enlisted Soldiers carry out the Army's missions; to enlist you need a high school diploma, GED or a plan to get one, plus a minimum ASVAB score. Commissioned Officers lead Soldiers and organizations and must hold a bachelor's degree by the time they are commissioned, through ROTC, the U.S. Military Academy at West Point, the 12-week Officer Candidate School or direct commission. Officers must be under 31 in the year of commissioning, or under 27 from West Point. Enlisted Soldiers can become officers through Green to Gold.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Enlisting requires a high school diploma, GED or a plan to get one, and a minimum ASVAB score.
- Officers need a bachelor's degree by the time they are commissioned.
- Officer paths: ROTC, West Point, Officer Candidate School (OCS) and direct commission.
- Officers must be at least 17 and under 31 in the year of commissioning, or under 27 from West Point.
- Enlisted Soldiers can earn a commission through the Green to Gold program.

Role

Enlisted Soldiers carry out orders and specialize in a job. Commissioned Officers guide and oversee missions and lead Army organizations.

Education and age

To enlist you must be a U.S. citizen or permanent resident who meets the age requirement and has a high school diploma, GED or a plan to get one. Officers need a college degree by commissioning, and must be a U.S. citizen by then.

Training

1. Enlisted: 10 weeks of Basic Combat Training, then individual job training.
2. Officers: the Basic Officer Leader Course, after ROTC, West Point or OCS.
3. OCS is a 12-week course for enlisted Soldiers and civilians with college degrees.

Service commitments

A four-year ROTC scholarship requires four years full time as an officer after graduation, then four more years either extended or in the Individual Ready Reserve. West Point graduates commit to at least five years of active duty and three years in the Individual Ready Reserve.

Who should pick which

Enlist if you want to start serving now without a degree. Pursue a commission if you have or are earning a bachelor's degree and want to lead. Active duty vs National Guard covers the other main choice.`;

const BUILT = buildEditorialComparison({
  slug: "enlisted-vs-military-officer",
  title: "Enlisted vs Officer: Army Requirements and Paths",
  shortAnswer: SHORT_ANSWER,
  verdict: "Enlisted: high school diploma or GED, ASVAB score, 10 weeks of Basic Combat Training.\n\nOfficer: bachelor's degree by commissioning, through ROTC, West Point, OCS or direct commission.\n\nTalk to a recruiter about current requirements.",
  category: "military",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "enlisted", "slug": "enlisted", "name": "Enlisted Soldier", "shortDesc": "Soldiers who carry out the unit's mission; join with a high school diploma or GED.", "imageUrl": null, "entityType": "concept", "position": 0, "pros": ["High school diploma, GED or a plan to get one", "Start after Basic Combat Training (10 weeks) and job training", "Green to Gold program offers a path to a commission"], "cons": ["Must meet a minimum score on the ASVAB", "Leadership roles come with rank over time"], "bestFor": "People who want to start serving without a college degree"},
    {"id": "officer", "slug": "officer", "name": "Commissioned Officer", "shortDesc": "Leaders who guide missions and lead Army organizations; need a bachelor's degree by commissioning.", "imageUrl": null, "entityType": "concept", "position": 1, "pros": ["Lead Soldiers and organizations from the start", "Paths through ROTC, West Point, OCS or direct commission", "ROTC offered at more than 1,000 colleges"], "cons": ["Bachelor's degree required by commissioning", "ROTC scholarship and West Point carry service commitments"], "bestFor": "College students and graduates who want to lead"},
  ],
  keyDifferences: [{"label": "Education", "entityAValue": "High school diploma, GED or plan to get one", "entityBValue": "Bachelor's degree by commissioning", "winner": "tie"}, {"label": "Role", "entityAValue": "Carry out missions in a specialty", "entityBValue": "Lead Soldiers and organizations", "winner": "tie"}, {"label": "Entry training", "entityAValue": "Basic Combat Training (10 weeks)", "entityBValue": "Basic Officer Leader Course", "winner": "tie"}, {"label": "Entry test", "entityAValue": "Minimum ASVAB score", "entityBValue": "Background check and interview", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Age", "Military service", "enlisted", "officer", "Must meet the enlistment age requirement", "17 to under 31 in year of commissioning (under 27 from West Point)"),
    textAttr("a1", "Citizenship", "Military service", "enlisted", "officer", "U.S. citizen or permanent resident", "U.S. citizen by commissioning"),
    textAttr("a2", "Paths", "Military service", "enlisted", "officer", "Enlist through a recruiter", "ROTC, West Point, OCS (12 weeks), direct commission"),
    textAttr("a3", "Move between", "Military service", "enlisted", "officer", "Green to Gold to earn a commission", "Not applicable"),
    textAttr("a4", "Commitment examples", "Military service", "enlisted", "officer", "Set by enlistment contract", "West Point: 5 years active + 3 IRR"),
  ],
  faqs: [{"question": "Do you need a college degree to join the Army?", "answer": "No. To enlist you need a high school diploma, GED or a plan to get one. A bachelor's degree is required only to become a commissioned officer, by the time you are commissioned."}, {"question": "What are the ways to become an Army officer?", "answer": "ROTC in college, the U.S. Military Academy at West Point, Officer Candidate School (OCS) for enlisted Soldiers and civilians with degrees, or direct commission for some professions."}, {"question": "Can an enlisted Soldier become an officer?", "answer": "Yes. Enlisted Soldiers can attend OCS with a degree, or earn a degree and commission through the Green to Gold program."}, {"question": "What is the age limit for Army officers?", "answer": "You must be at least 17 and under 31 in the year of commissioning, or under 27 if you commission from West Point."}, {"question": "How long is Officer Candidate School?", "answer": "OCS is a 12-week officer training program."}, {"question": "What is the service commitment after West Point?", "answer": "At least five years of active duty and three years in the Individual Ready Reserve, for a total of eight years."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Enlist to start serving without a degree; pursue a commission with a bachelor's degree to lead.", keyFact: "Officers need a bachelor's degree by commissioning; enlisting needs a high school diploma or GED." },
  citationStats: {"sourceCount": 4, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "U.S. Army: Steps to Join", "url": "https://www.goarmy.com/how-to-join/steps"}, {"name": "U.S. Army: Path for Army Officers", "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers"}, {"name": "U.S. Army: Army ROTC", "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/rotc"}, {"name": "U.S. Army: U.S. Military Academy at West Point", "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/military-academy"}]},
  resources: [{"type": "external", "label": "U.S. Army: Steps to Join", "url": "https://www.goarmy.com/how-to-join/steps", "description": "Enlisting needs diploma/GED; officers need a degree by commissioning; age under 31 (under 27 West Point)."}, {"type": "external", "label": "U.S. Army: Path for Army Officers", "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers", "description": "ROTC, West Point, 12-week OCS, direct commission; Green to Gold."}, {"type": "external", "label": "U.S. Army: Army ROTC", "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/rotc", "description": "Offered at more than 1,000 colleges; scholarship service commitment."}, {"type": "external", "label": "U.S. Army: U.S. Military Academy at West Point", "url": "https://www.goarmy.com/careers-and-jobs/find-your-path/army-officers/military-academy", "description": "Commission as second lieutenant; five years active and three years IRR."}],
  metaTitle: "Enlisted Soldier vs Commissioned Officer | A Versus B",
});

BUILT.metadata.metaDescription = "Enlisted vs officer in the U.S. Army: education and age rules, ASVAB, ROTC, West Point and OCS paths, training and service commitments.";

export const ENLISTED_VS_MILITARY_OFFICER: EditorialComparison = BUILT;
