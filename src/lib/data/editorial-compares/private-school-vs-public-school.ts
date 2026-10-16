import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Private School vs Public School.
 * NCES Fast Facts: back-to-school statistics and enrollment trends.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "About 49.6 million U.S. students attended public elementary and secondary schools in fall 2022, taught by 3.2 million full-time-equivalent teachers, with current spending of $15,591 per student in 2021-22. About 5.5 million attended private schools in fall 2021, with 0.5 million teachers. From 2020-21 to 2021-22, 84% of public and 82% of private school teachers stayed at the same school, while 8% and 12% left teaching. Choose by your child's needs, cost and the specific schools near you.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Public schools: about 49.6 million students in fall 2022.
- Private schools: about 5.5 million students in fall 2021.
- Teachers: 3.2 million FTE in public schools (fall 2022), 0.5 million in private schools (fall 2021).
- Public school current spending: $15,591 per student in 2021-22.
- Teacher retention 2020-21 to 2021-22: 84% public, 82% private stayed at the same school.

Enrollment

Of public school students in fall 2022, 1.5 million were in prekindergarten, 32.5 million in kindergarten to grade 8 and 15.5 million in grades 9 to 12. Of private school students in fall 2021, 3.3 million were in kindergarten to grade 8 and 1.4 million in grades 9 to 12. Private enrollment was 6.2 million in fall 2000 and 5.3 million in fall 2011.

Teachers

From 2020-21 to 2021-22, 8% of public school teachers and 6% of private school teachers moved to another school, and 8% of public and 12% of private school teachers left the profession.

Cost

1. Public schools are funded publicly; total current spending was $768 billion in 2021-22.
2. Private schools are generally funded by tuition and other private sources, so costs vary by school.

Who should pick which

Compare the specific schools available to you: class sizes, programs, support services, travel time and total cost. Visit, ask about teacher retention and review local results.`;

const BUILT = buildEditorialComparison({
  slug: "private-school-vs-public-school",
  title: "Private School vs Public School: U.S. Facts",
  shortAnswer: SHORT_ANSWER,
  verdict: "Public: about 49.6 million students, $15,591 current spending per student.\n\nPrivate: about 5.5 million students, tuition-based.\n\nCompare the individual schools near you.",
  category: "education",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "private-school", "slug": "private-school", "name": "Private School", "shortDesc": "Privately run K-12 schools, religious or nonsectarian.", "imageUrl": null, "entityType": "concept", "position": 0, "pros": ["About 5.5 million students in fall 2021", "About 0.5 million full-time-equivalent teachers", "82% of teachers stayed at the same school (2020-21 to 2021-22)"], "cons": ["Families usually pay tuition", "12% of teachers left the profession (2020-21 to 2021-22)"], "bestFor": "Families seeking a specific religious, educational or size fit"},
    {"id": "public-school", "slug": "public-school", "name": "Public School", "shortDesc": "Publicly funded K-12 schools run by local school systems.", "imageUrl": null, "entityType": "concept", "position": 1, "pros": ["About 49.6 million students in fall 2022", "Current spending of $15,591 per student (2021-22)", "84% of teachers stayed at the same school (2020-21 to 2021-22)"], "cons": ["Enrollment set largely by where you live", "8% of teachers left the profession (2020-21 to 2021-22)"], "bestFor": "Families wanting a free neighbourhood school"},
  ],
  keyDifferences: [{"label": "Students", "entityAValue": "About 5.5 million (fall 2021)", "entityBValue": "About 49.6 million (fall 2022)", "winner": "tie"}, {"label": "Teachers (FTE)", "entityAValue": "0.5 million", "entityBValue": "3.2 million", "winner": "tie"}, {"label": "Teachers staying at same school", "entityAValue": "82%", "entityBValue": "84%", "winner": "tie"}, {"label": "Teachers leaving the profession", "entityAValue": "12%", "entityBValue": "8%", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Kindergarten to grade 8", "Schools", "private-school", "public-school", "3.3 million", "32.5 million"),
    textAttr("a1", "Grades 9 to 12", "Schools", "private-school", "public-school", "1.4 million", "15.5 million"),
    textAttr("a2", "Funding", "Schools", "private-school", "public-school", "Tuition and private sources", "Public funds; $15,591 per student (2021-22)"),
    textAttr("a3", "Enrollment in fall 2000", "Schools", "private-school", "public-school", "6.2 million", "47.2 million"),
    textAttr("a4", "Teachers moving to another school", "Schools", "private-school", "public-school", "6%", "8%"),
  ],
  faqs: [{"question": "How many students go to private school in the U.S.?", "answer": "About 5.5 million students were enrolled in private elementary and secondary schools in fall 2021."}, {"question": "How many students go to public school?", "answer": "About 49.6 million students were enrolled in public elementary and secondary schools in fall 2022."}, {"question": "How much do public schools spend per student?", "answer": "Current expenditures were $15,591 per student in 2021-22, out of $768 billion in total current spending."}, {"question": "Do private school teachers stay longer?", "answer": "From 2020-21 to 2021-22, 82% of private and 84% of public school teachers stayed at the same school; 12% of private and 8% of public school teachers left the profession."}, {"question": "How many teachers work in each sector?", "answer": "About 3.2 million full-time-equivalent teachers in public schools (fall 2022) and 0.5 million in private schools (fall 2021)."}, {"question": "Is private school better than public school?", "answer": "It depends on the specific schools and your child. Compare programs, class sizes, support services, travel and total cost for the schools you can choose from."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Public for a free neighbourhood school; private for a specific religious, educational or size fit, usually with tuition.", keyFact: "About 49.6 million U.S. students attended public schools (fall 2022) and 5.5 million private schools (fall 2021)." },
  citationStats: {"sourceCount": 2, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "NCES Fast Facts: Back-to-school statistics", "url": "https://nces.ed.gov/fastfacts/display.asp?id=372"}, {"name": "NCES Fast Facts: Enrollment trends", "url": "https://nces.ed.gov/fastfacts/display.asp?id=65"}]},
  resources: [{"type": "external", "label": "NCES Fast Facts: Back-to-school statistics", "url": "https://nces.ed.gov/fastfacts/display.asp?id=372", "description": "Public 49.6M (fall 2022), private 5.5M (fall 2021); teachers; retention; $15,591 per student."}, {"type": "external", "label": "NCES Fast Facts: Enrollment trends", "url": "https://nces.ed.gov/fastfacts/display.asp?id=65", "description": "Public and private enrollment from fall 1985 to fall 2021."}],
  metaTitle: "Private School vs Public School | A Versus B",
});

BUILT.metadata.metaDescription = "Private vs public school in the U.S.: enrollment, teachers, teacher retention and per-student spending from national education statistics.";

export const PRIVATE_SCHOOL_VS_PUBLIC_SCHOOL: EditorialComparison = BUILT;
