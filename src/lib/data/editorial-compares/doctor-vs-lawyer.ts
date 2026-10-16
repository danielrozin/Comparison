import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Doctor (Physician) vs Lawyer.
 * BLS Occupational Outlook Handbook: physicians and surgeons; lawyers (May 2025 wages, 2025-35 projections).
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Physicians and surgeons earned a median $275,930 a year in May 2025, held 862,800 jobs, and typically need a bachelor's degree, 4 years of medical school and 3 to 9 years of residency. Lawyers earned a median $159,670, held 863,700 jobs, and usually need about 7 years of study after high school, a law degree and a state license from passing the bar exam. Employment is projected to grow 4% for physicians and 5% for lawyers from 2025 to 2035. Choose by the work you want, not pay alone.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Median pay, May 2025: physicians and surgeons $275,930; lawyers $159,670.
- Jobs in 2025: physicians and surgeons 862,800; lawyers 863,700.
- Training: physicians need medical school plus 3 to 9 years of residency; lawyers need about 7 years after high school and a bar exam.
- Projected employment growth, 2025 to 2035: physicians 4%, lawyers 5%.
- Projected openings each year: about 22,100 for physicians and surgeons, 28,700 for lawyers.

Education and licensing

Physicians need a bachelor's degree, then an M.D. or D.O., which takes 4 more years. Residency lasts 3 to 9 years depending on specialty, and a fellowship adds 1 to 3 years. All states require a license. Lawyers typically complete 4 years of undergraduate study and 3 years of law school for a Juris Doctor (J.D.), then pass a bar exam to be admitted in a state.

Pay range

Physician pay ranged from under $76,560 for the lowest 10 percent to more than $488,320 for the highest 10 percent, and varies widely by specialty, from $210,040 for general pediatricians to $559,030 for pediatric surgeons. Lawyer pay ranged from under $78,360 to more than $351,600; lawyers in the federal government had a median of $178,380.

Work settings

1. Physicians work in offices and hospitals, often with long or irregular shifts and on-call duty.
2. Lawyers work mostly in offices; 52% work in legal services and 11% are self-employed.

Who should pick which

Choose medicine if you want patient care and can commit to residency. Choose law if you want advocacy, research and writing, with a shorter path to practice.`;

const BUILT = buildEditorialComparison({
  slug: "doctor-vs-lawyer",
  title: "Doctor vs Lawyer: Pay, Training and Job Outlook",
  shortAnswer: SHORT_ANSWER,
  verdict: "Doctor: median $275,930; bachelor's, 4 years of medical school and 3 to 9 years of residency.\n\nLawyer: median $159,670; about 7 years of study and a bar exam.\n\nPay varies widely by specialty, employer and location.",
  category: "education",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "doctor", "slug": "doctor", "name": "Doctor (Physician)", "shortDesc": "Physicians and surgeons diagnose and treat injuries and illnesses.", "imageUrl": null, "entityType": "concept", "position": 0, "pros": ["Median pay $275,930 a year (May 2025)", "862,800 jobs in 2025", "Specialties from family medicine to surgery"], "cons": ["Bachelor's degree, 4 years of medical school, then 3 to 9 years of residency", "Long shifts, overnight hours and on-call duty"], "bestFor": "People drawn to patient care and science"},
    {"id": "lawyer", "slug": "lawyer", "name": "Lawyer", "shortDesc": "Lawyers advise and represent clients on legal proceedings and transactions.", "imageUrl": null, "entityType": "concept", "position": 1, "pros": ["Median pay $159,670 a year (May 2025)", "About 7 years of study after high school", "Employment projected to grow 5% from 2025 to 2035"], "cons": ["Must pass a bar exam for a state license", "Some work more than 40 hours a week; trials and deadlines can be stressful"], "bestFor": "People drawn to argument, research and writing"},
  ],
  keyDifferences: [{"label": "Median pay (May 2025)", "entityAValue": "$275,930", "entityBValue": "$159,670", "winner": "tie"}, {"label": "Jobs (2025)", "entityAValue": "862,800", "entityBValue": "863,700", "winner": "tie"}, {"label": "Training after high school", "entityAValue": "Bachelor's + 4 years medical school + 3-9 years residency", "entityBValue": "About 7 years (bachelor's + 3 years law school)", "winner": "tie"}, {"label": "Projected growth 2025-35", "entityAValue": "4%", "entityBValue": "5%", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Degree", "Careers", "doctor", "lawyer", "M.D. or D.O.", "Juris Doctor (J.D.)"),
    textAttr("a1", "License", "Careers", "doctor", "lawyer", "State medical license", "State bar admission"),
    textAttr("a2", "Lowest 10% earned less than", "Careers", "doctor", "lawyer", "$76,560", "$78,360"),
    textAttr("a3", "Highest 10% earned more than", "Careers", "doctor", "lawyer", "$488,320", "$351,600"),
    textAttr("a4", "Openings per year (projected)", "Careers", "doctor", "lawyer", "About 22,100", "About 28,700"),
    textAttr("a5", "Main settings", "Careers", "doctor", "lawyer", "Physicians' offices and hospitals", "Legal services (52%), self-employed (11%)"),
  ],
  faqs: [{"question": "Who earns more, doctors or lawyers?", "answer": "In May 2025, the median annual wage was $275,930 for physicians and surgeons and $159,670 for lawyers. Pay varies widely by specialty, employer and location."}, {"question": "How long does it take to become a doctor?", "answer": "Typically a bachelor's degree, 4 years of medical school, and 3 to 9 years of internship and residency. A fellowship adds 1 to 3 years."}, {"question": "How long does it take to become a lawyer?", "answer": "Usually about 7 years of full-time study after high school: 4 years of undergraduate study and 3 years of law school, then a bar exam."}, {"question": "Which field is growing faster?", "answer": "Lawyer employment is projected to grow 5% and physician employment 4% from 2025 to 2035."}, {"question": "How many doctors and lawyers are there?", "answer": "Physicians and surgeons held about 862,800 jobs and lawyers about 863,700 jobs in 2025."}, {"question": "Which specialties pay the most?", "answer": "Among physicians in May 2025, pediatric surgeons had a median of $559,030 and cardiologists $496,010. Among lawyers, the federal government had a median of $178,380."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Medicine for patient care with longer training; law for advocacy and a shorter path to practice.", keyFact: "Median pay in May 2025: $275,930 for physicians and surgeons, $159,670 for lawyers." },
  citationStats: {"sourceCount": 2, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "BLS Occupational Outlook Handbook: Physicians and Surgeons", "url": "https://www.bls.gov/ooh/healthcare/physicians-and-surgeons.htm"}, {"name": "BLS Occupational Outlook Handbook: Lawyers", "url": "https://www.bls.gov/ooh/legal/lawyers.htm"}]},
  resources: [{"type": "external", "label": "BLS Occupational Outlook Handbook: Physicians and Surgeons", "url": "https://www.bls.gov/ooh/healthcare/physicians-and-surgeons.htm", "description": "Median $275,930 (May 2025); 862,800 jobs; 4% growth 2025-35; 3-9 years residency."}, {"type": "external", "label": "BLS Occupational Outlook Handbook: Lawyers", "url": "https://www.bls.gov/ooh/legal/lawyers.htm", "description": "Median $159,670 (May 2025); 863,700 jobs; 5% growth 2025-35; about 7 years of study; bar exam."}],
  metaTitle: "Doctor (Physician) vs Lawyer | A Versus B",
});

BUILT.metadata.metaDescription = "Doctor vs lawyer: May 2025 median pay, jobs, education and licensing, residency vs bar exam, and projected 2025-35 employment growth.";

export const DOCTOR_VS_LAWYER: EditorialComparison = BUILT;
