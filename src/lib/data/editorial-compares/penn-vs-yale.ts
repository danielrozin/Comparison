import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: University of Pennsylvania vs Yale University.
 * Penn facts page (Fall 2025); Yale facts and history pages.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Penn, in Philadelphia, had 29,384 students in Fall 2025, including 10,325 full-time undergraduates across four undergraduate schools, among them Wharton and Engineering; it admitted 5% of applicants for the Class of 2029 and has a 10:1 student-faculty ratio. Yale, in New Haven, was founded in 1701, has 15,657 students, a 5:1 undergraduate student-to-faculty ratio, 14 residential colleges and 80+ majors, and 87% of students graduate debt-free. Choose by programs, size and campus life.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Penn: 29,384 students (Fall 2025); Yale: 15,657 students.
- Penn student-faculty ratio 10:1; Yale undergraduate ratio 5:1.
- Penn admitted 3,570 of 72,544 applicants, 5%, for the Class of 2029.
- Yale was founded in 1701 and houses undergraduates in 14 residential colleges.
- Penn's endowment was $24.81 billion in fiscal year 2025.

Size and schools

Penn enrols 10,325 full-time undergraduates and 14,006 full-time graduate and professional students. Its undergraduate schools are the College of Arts and Sciences, Engineering and Applied Science, Nursing and the Wharton School. Yale has 15 schools and 5,842 faculty members university-wide.

Admissions and aid

Penn received 72,544 applications for the Class of 2029 and offered admission to 3,570. At Yale, 54% of undergraduates receive financial aid, the average scholarship award for aid recipients is $75,800, and 87% graduate debt-free.

Campus life

1. Yale: 77% of undergraduates, and all first-year students, live on campus in one of 14 residential colleges.
2. Penn: a 299-acre West Philadelphia campus with 225 buildings, excluding the hospital, and 33 varsity sports.

Who should pick which

Pick Penn for a large research university with Wharton, Engineering and Nursing undergraduate schools. Pick Yale for a smaller student body and a residential college system. Visit both and compare programs and aid offers.`;

const BUILT = buildEditorialComparison({
  slug: "penn-vs-yale",
  title: "Penn vs Yale: Size, Students and Campus Facts",
  shortAnswer: SHORT_ANSWER,
  verdict: "Penn: 29,384 students, four undergraduate schools including Wharton, 10:1 ratio.\n\nYale: 15,657 students, founded 1701, 5:1 undergraduate ratio, 14 residential colleges.\n\nCompare programs and financial aid offers.",
  category: "education",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "penn", "slug": "penn", "name": "University of Pennsylvania", "shortDesc": "Ivy League university in Philadelphia with 29,384 students (Fall 2025).", "imageUrl": null, "entityType": "organization", "position": 0, "pros": ["Four undergraduate schools, including Wharton and Engineering", "90 undergraduate majors pursued", "$24.81 billion endowment (FY2025)"], "cons": ["5% admission rate for the Class of 2029", "10:1 student-faculty ratio"], "bestFor": "Students wanting a large research university with business and engineering schools"},
    {"id": "yale", "slug": "yale", "name": "Yale University", "shortDesc": "Ivy League university in New Haven, founded in 1701, with 15,657 students.", "imageUrl": null, "entityType": "organization", "position": 1, "pros": ["5:1 undergraduate student-to-faculty ratio", "Residential college system: 14 colleges", "87% of students graduate debt-free"], "cons": ["Smaller total enrolment", "80+ majors"], "bestFor": "Students wanting a residential college experience"},
  ],
  keyDifferences: [{"label": "Location", "entityAValue": "Philadelphia, Pennsylvania", "entityBValue": "New Haven, Connecticut", "winner": "tie"}, {"label": "Total students", "entityAValue": "29,384 (Fall 2025)", "entityBValue": "15,657", "winner": "tie"}, {"label": "Student-faculty ratio", "entityAValue": "10:1", "entityBValue": "5:1 (undergraduate)", "winner": "tie"}, {"label": "Faculty", "entityAValue": "6,049", "entityBValue": "5,842", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Undergraduates", "Universities", "penn", "yale", "10,325 full-time", "Students from all 50 states"),
    textAttr("a1", "Faculty", "Universities", "penn", "yale", "6,049 total", "5,842 university-wide"),
    textAttr("a2", "Majors", "Universities", "penn", "yale", "90 pursued", "80+"),
    textAttr("a3", "Housing", "Universities", "penn", "yale", "On a 299-acre campus", "14 residential colleges; 77% live on campus"),
    textAttr("a4", "Admissions", "Universities", "penn", "yale", "5% offered admission (Class of 2029)", "1,633 first-years enrolled"),
    textAttr("a5", "Endowment or aid", "Universities", "penn", "yale", "$24.81 billion endowment", "87% graduate debt-free"),
  ],
  faqs: [{"question": "Which is bigger, Penn or Yale?", "answer": "Penn had 29,384 students in Fall 2025; Yale has 15,657 students."}, {"question": "What is the student-faculty ratio?", "answer": "Penn reports a 10:1 student-faculty ratio. Yale reports a 5:1 undergraduate student-to-faculty ratio."}, {"question": "How selective is Penn?", "answer": "Penn received 72,544 applications for the Class of 2029 and offered admission to 3,570, or 5 percent."}, {"question": "When was Yale founded?", "answer": "In 1701, when the Connecticut legislature chartered the Collegiate School, which became Yale College in 1718."}, {"question": "Do Yale students live on campus?", "answer": "Yes. 77% of undergraduates, and all first-year students, live on campus in one of 14 residential colleges."}, {"question": "Does Penn have a business school for undergraduates?", "answer": "Yes. The Wharton School is one of Penn's four undergraduate schools, with 1,841 undergraduates in Fall 2025."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Penn for a large research university with Wharton and Engineering; Yale for a smaller body and residential colleges.", keyFact: "Penn had 29,384 students in Fall 2025; Yale has 15,657 and a 5:1 undergraduate ratio." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "University of Pennsylvania: Facts", "url": "https://www.upenn.edu/about/facts"}, {"name": "Yale University: Yale Facts", "url": "https://www.yale.edu/about-yale/yale-facts"}, {"name": "Yale University: Traditions and History", "url": "https://www.yale.edu/about-yale/traditions-history"}]},
  resources: [{"type": "external", "label": "University of Pennsylvania: Facts", "url": "https://www.upenn.edu/about/facts", "description": "Fall 2025 enrolment, admissions, 10:1 ratio, schools, 299 acres, $24.81B endowment."}, {"type": "external", "label": "Yale University: Yale Facts", "url": "https://www.yale.edu/about-yale/yale-facts", "description": "15,657 students, 5,842 faculty, 5:1 ratio, 14 residential colleges, aid figures."}, {"type": "external", "label": "Yale University: Traditions and History", "url": "https://www.yale.edu/about-yale/traditions-history", "description": "Chartered 1701 as the Collegiate School; Yale College 1718."}],
  metaTitle: "University of Pennsylvania vs Yale University | A Versus B",
});

BUILT.metadata.metaDescription = "Penn vs Yale: enrolment, student-faculty ratio, admissions, schools, residential colleges, campus size and financial aid.";

export const PENN_VS_YALE: EditorialComparison = BUILT;
