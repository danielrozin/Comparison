import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Duolingo vs Rosetta Stone.
 * Duolingo investor relations and blog; Rosetta Stone home and product navigation. No prices.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Duolingo is a free app, launched in 2012, that teaches languages through short game-style lessons, with an optional Super Duolingo subscription; it also teaches chess and runs the Duolingo English Test. Rosetta Stone is a paid program, part of IXL Learning, built on its Dynamic Immersion method with TruAccent speech feedback, Chat Missions, 500+ flashcard sets and optional certified tutors, across 25 language options. Choose Duolingo for free daily practice; choose Rosetta Stone for structured immersion and tutoring.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Duolingo is free to use; Super Duolingo is its paid subscription.
- Rosetta Stone is a paid membership with a free trial.
- Rosetta Stone teaches through Dynamic Immersion, without translations, and scores pronunciation with TruAccent.
- Rosetta Stone lists 25 language options, including Latin American and Spain Spanish and American and British English.
- Duolingo also offers chess lessons and the Duolingo English Test.

How lessons work

Duolingo lessons are short, game-style exercises built for a daily habit, with streaks and levels. Rosetta Stone lessons immerse you in the new language from the start and use TruAccent to give feedback on your speaking. Rosetta Stone adds Chat Missions for conversation practice in travel and social situations, 500+ flashcard sets, and Sapphire Studio for building activities on any topic.

Cost model

Duolingo's core app is free, with Super Duolingo as an optional upgrade. Rosetta Stone requires a paid membership after its free trial. Both change prices with promotions, so compare current offers.

Extras

1. Duolingo: chess course, Duolingo English Test, Duolingo for Business.
2. Rosetta Stone: tutoring with certified tutors, plus enterprise and school editions used by 12,000 corporations and 22,000 educational institutions.

Who should pick which

Pick Duolingo for free, game-style daily practice. Pick Rosetta Stone for immersion-first lessons, pronunciation feedback and optional tutoring.`;

const BUILT = buildEditorialComparison({
  slug: "duolingo-vs-rosetta-stone",
  title: "Duolingo vs Rosetta Stone: Free App vs Immersion",
  shortAnswer: SHORT_ANSWER,
  verdict: "Duolingo: free, game-style lessons, optional Super Duolingo subscription.\n\nRosetta Stone: paid Dynamic Immersion program with TruAccent and optional tutors.\n\nCompare current subscription offers before paying.",
  category: "software",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "duolingo", "slug": "duolingo", "name": "Duolingo", "shortDesc": "Free learning app launched in 2012, with paid Super Duolingo subscriptions.", "imageUrl": null, "entityType": "software", "position": 0, "pros": ["Free to use, with an optional Super Duolingo subscription", "Short game-style lessons on mobile and desktop", "Also teaches chess, and offers the Duolingo English Test"], "cons": ["Paid tier needed for an ad-free experience", "No live tutoring"], "bestFor": "Daily practice on a budget"},
    {"id": "rosetta-stone", "slug": "rosetta-stone", "name": "Rosetta Stone", "shortDesc": "Paid immersion-based language program, part of IXL Learning.", "imageUrl": null, "entityType": "software", "position": 1, "pros": ["Dynamic Immersion method with TruAccent speech feedback", "Chat Missions, 500+ flashcard sets and Sapphire Studio", "Optional sessions with certified tutors"], "cons": ["Paid membership after the free trial", "25 language options, fewer subjects beyond languages"], "bestFor": "Learners who want structured immersion and pronunciation feedback"},
  ],
  keyDifferences: [{"label": "Cost model", "entityAValue": "Free, optional Super Duolingo", "entityBValue": "Paid membership after free trial", "winner": "tie"}, {"label": "Method", "entityAValue": "Short game-style lessons", "entityBValue": "Dynamic Immersion", "winner": "tie"}, {"label": "Speaking feedback", "entityAValue": "Speaking exercises", "entityBValue": "TruAccent speech tool", "winner": "tie"}, {"label": "Tutoring", "entityAValue": "None", "entityBValue": "Certified tutors (optional)", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Launched", "Language learning", "duolingo", "rosetta-stone", "2012", "Decades in language learning; part of IXL Learning"),
    textAttr("a1", "Languages", "Language learning", "duolingo", "rosetta-stone", "Many language courses plus chess", "25 language options"),
    textAttr("a2", "Conversation practice", "Language learning", "duolingo", "rosetta-stone", "In-app exercises", "Chat Missions"),
    textAttr("a3", "Vocabulary", "Language learning", "duolingo", "rosetta-stone", "Built into lessons", "500+ flashcard sets"),
    textAttr("a4", "Other products", "Language learning", "duolingo", "rosetta-stone", "Duolingo English Test, Duolingo for Business", "Editions for enterprise and schools"),
  ],
  faqs: [{"question": "Is Duolingo free?", "answer": "Yes. The Duolingo app is free to use. Super Duolingo is an optional paid subscription."}, {"question": "Is Rosetta Stone free?", "answer": "Rosetta Stone offers a free trial, then requires a paid membership."}, {"question": "Which is better for speaking?", "answer": "Rosetta Stone puts speaking at the centre with its TruAccent speech tool and Chat Missions. Duolingo includes speaking exercises within short lessons."}, {"question": "How many languages does Rosetta Stone offer?", "answer": "Rosetta Stone lists 25 language options, including Latin American and Spain Spanish, American and British English, Japanese, Korean, Arabic, Hebrew, Hindi, Irish and Latin."}, {"question": "Does Duolingo teach anything besides languages?", "answer": "Yes. Duolingo also offers chess lessons, and runs the Duolingo English Test for English proficiency."}, {"question": "Can I use both?", "answer": "Yes. Some learners use Duolingo for a daily habit and Rosetta Stone or a tutor for immersion and speaking practice."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Duolingo for free game-style practice; Rosetta Stone for immersion, pronunciation feedback and tutoring.", keyFact: "Duolingo is free to use; Rosetta Stone lists 25 language options on a paid membership." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Duolingo Investor Relations", "url": "https://investors.duolingo.com/"}, {"name": "Duolingo Blog", "url": "https://blog.duolingo.com/"}, {"name": "Rosetta Stone", "url": "https://www.rosettastone.com/"}]},
  resources: [{"type": "external", "label": "Duolingo Investor Relations", "url": "https://investors.duolingo.com/", "description": "Launched 2012; mission to make education free and universally available; premium subscriptions."}, {"type": "external", "label": "Duolingo Blog", "url": "https://blog.duolingo.com/", "description": "Chess course; Duolingo English Test, Duolingo for Business and Super Duolingo products."}, {"type": "external", "label": "Rosetta Stone", "url": "https://www.rosettastone.com/", "description": "Dynamic Immersion, TruAccent, Chat Missions, 500+ flashcard sets, tutoring; 25 language options; part of IXL Learning."}],
  metaTitle: "Duolingo vs Rosetta Stone | A Versus B",
});

BUILT.metadata.metaDescription = "Duolingo vs Rosetta Stone: free game-style app vs paid Dynamic Immersion program. Cost model, speaking feedback, tutoring and language options.";

export const DUOLINGO_VS_ROSETTA_STONE: EditorialComparison = BUILT;
