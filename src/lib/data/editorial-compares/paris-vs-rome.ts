import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Paris vs Rome.
 * INSEE census for Paris; UNESCO World Heritage List entries for both historic centres.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Paris, the capital of France, had 2,103,778 residents in the 2023 census, at about 19,960 people per square kilometre. Its Banks of the Seine joined the UNESCO World Heritage List in 1991, covering 538 hectares. Rome, the capital of Italy, has had its historic centre on the World Heritage List since 1980, with boundaries extended in 1990; the listed area covers 1,469.7 hectares and includes properties of the Holy See. Choose Paris for a compact riverside city break, Rome for ancient history.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Paris had 2,103,778 residents in the 2023 census.
- Paris density was about 19,960 residents per square kilometre in 2023.
- Paris, Banks of the Seine: World Heritage List 1991, 538 ha.
- Historic Centre of Rome: World Heritage List 1980, boundaries extended 1990, 1,469.7 ha.
- Rome's listed site includes properties of the Holy See in the city.

Population

The city of Paris had 2,103,778 residents in 2023, down from 2,590,771 in 1968 and 2,187,526 in 2017. When comparing city sizes, use city-limit and metropolitan figures from the same year.

World Heritage

1. Paris: the Banks of the Seine, inscribed in 1991 with a listed area of 538 hectares and a 3,194-hectare buffer zone.
2. Rome: the Historic Centre of Rome, the Properties of the Holy See in that City Enjoying Extraterritorial Rights and San Paolo Fuori le Mura, inscribed in 1980 with a listed area of 1,469.7 hectares and a buffer zone of 7,158.9 hectares.

Who should pick which

Pick Paris for a compact city with major sites along the Seine. Pick Rome for a larger historic centre spanning ancient and papal Rome. Paris vs London covers another European capital.`;

const BUILT = buildEditorialComparison({
  slug: "paris-vs-rome",
  title: "Paris vs Rome: Population and World Heritage Sites",
  shortAnswer: SHORT_ANSWER,
  verdict: "Paris: 2,103,778 residents (2023); Banks of the Seine listed in 1991.\n\nRome: historic centre listed in 1980, 1,469.7 ha including properties of the Holy See.\n\nChoose by the history and pace you want.",
  category: "travel",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "paris", "slug": "paris", "name": "Paris", "shortDesc": "Capital of France; 2,103,778 residents in the 2023 census.", "imageUrl": null, "entityType": "place", "position": 0, "pros": ["Banks of the Seine on the World Heritage List since 1991", "Dense, compact city: about 19,960 residents per km²", "Major museums along the river"], "cons": ["Population below its 1968 level", "Crowded central districts"], "bestFor": "Museums, river walks and a compact city break"},
    {"id": "rome", "slug": "rome", "name": "Rome", "shortDesc": "Capital of Italy; historic centre on the World Heritage List since 1980.", "imageUrl": null, "entityType": "place", "position": 1, "pros": ["Historic centre listed since 1980, extended in 1990", "Listed area of 1,469.7 ha, shared with properties of the Holy See", "Ancient monuments throughout the centre"], "cons": ["Large historic area to cover on foot", "Busy central sites"], "bestFor": "Ancient history and a long stay in the centre"},
  ],
  keyDifferences: [{"label": "Country", "entityAValue": "France", "entityBValue": "Italy", "winner": "tie"}, {"label": "World Heritage inscription", "entityAValue": "1991 (Banks of the Seine)", "entityBValue": "1980, extended 1990", "winner": "tie"}, {"label": "Listed area", "entityAValue": "538 ha", "entityBValue": "1,469.7 ha", "winner": "tie"}, {"label": "Buffer zone", "entityAValue": "3,194 ha", "entityBValue": "7,158.9 ha", "winner": "tie"}],
  attributes: [
    textAttr("a0", "City population", "City", "paris", "rome", "2,103,778 (2023 census)", "Capital of Italy"),
    textAttr("a1", "Density", "City", "paris", "rome", "About 19,960 per km² (2023)", "Spread across a larger historic area"),
    textAttr("a2", "Population in 1968", "City", "paris", "rome", "2,590,771", "Not compared"),
    textAttr("a3", "World Heritage site", "City", "paris", "rome", "Paris, Banks of the Seine", "Historic Centre of Rome and properties of the Holy See"),
    textAttr("a4", "Shared with another state", "City", "paris", "rome", "No", "Yes, with the Holy See"),
  ],
  faqs: [{"question": "What is the population of Paris?", "answer": "The city of Paris had 2,103,778 residents in the 2023 census, at about 19,960 people per square kilometre."}, {"question": "When was Rome's historic centre added to the World Heritage List?", "answer": "In 1980, with significant boundary changes in 1990. The site includes properties of the Holy See in Rome."}, {"question": "What part of Paris is a World Heritage Site?", "answer": "The Banks of the Seine, inscribed in 1991, with a listed area of 538 hectares."}, {"question": "Which World Heritage area is larger?", "answer": "Rome's listed area is 1,469.7 hectares; the Paris Banks of the Seine site is 538 hectares."}, {"question": "Is the Paris population growing?", "answer": "The 2023 figure of 2,103,778 was lower than 2,187,526 in 2017 and 2,590,771 in 1968."}, {"question": "Paris or Rome for a first trip to Europe?", "answer": "Paris suits a compact riverside city break with major museums; Rome suits travellers focused on ancient and papal history. Many visitors do both."}],
  relatedComparisons: [{"slug": "paris-vs-london-population", "title": "Paris vs London", "category": "travel"}],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Paris for a compact riverside capital; Rome for a larger historic centre spanning ancient and papal history.", keyFact: "Paris had 2,103,778 residents in 2023; Rome's World Heritage area covers 1,469.7 ha." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "INSEE: Dossier complet, Commune de Paris", "url": "https://www.insee.fr/fr/statistiques/2011101?geo=COM-75056"}, {"name": "UNESCO: Historic Centre of Rome", "url": "https://whc.unesco.org/en/list/91/"}, {"name": "UNESCO: Paris, Banks of the Seine", "url": "https://whc.unesco.org/en/list/600/"}]},
  resources: [{"type": "external", "label": "INSEE: Dossier complet, Commune de Paris", "url": "https://www.insee.fr/fr/statistiques/2011101?geo=COM-75056", "description": "Population 2,103,778 in 2023; density 19,959.9 per km²; historic series from 1968."}, {"type": "external", "label": "UNESCO: Historic Centre of Rome", "url": "https://whc.unesco.org/en/list/91/", "description": "Inscribed 1980; boundaries modified 1990; property 1,469.7 ha; buffer 7,158.933 ha."}, {"type": "external", "label": "UNESCO: Paris, Banks of the Seine", "url": "https://whc.unesco.org/en/list/600/", "description": "Inscribed 1991; property 538 ha; buffer 3,194 ha."}],
  metaTitle: "Paris vs Rome | A Versus B",
});

BUILT.metadata.metaDescription = "Paris vs Rome: 2023 Paris population and density, plus the World Heritage listings of the Banks of the Seine (1991) and Rome's historic centre (1980).";

export const PARIS_VS_ROME: EditorialComparison = BUILT;
