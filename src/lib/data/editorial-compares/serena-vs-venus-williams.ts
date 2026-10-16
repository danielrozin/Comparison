import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Serena Williams vs Venus Williams.
 * WTA official player profiles for Serena Williams and Venus Williams. Official records only.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Serena Williams won 23 Grand Slam singles titles, the most by any woman in the Open Era, among 73 WTA singles titles, and held world No. 1 for 319 weeks. Venus Williams won 7 Grand Slam singles titles (Wimbledon 2000, 2001, 2005, 2007 and 2008; US Open 2000 and 2001) among 49 singles titles, and also reached No. 1. Together they won 14 Grand Slam doubles titles and three Olympic doubles golds (2000, 2008, 2012). Serena won Olympic singles gold in 2012; Venus in 2000.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Grand Slam singles titles: Serena 23, Venus 7.
- WTA singles titles: Serena 73, Venus 49.
- Serena held world No. 1 for 319 weeks; Venus reached a career-high No. 1.
- Together: 14 Grand Slam doubles titles and Olympic doubles gold in 2000, 2008 and 2012.
- Olympic singles gold: Venus in 2000, Serena in 2012.

Grand Slam singles

Serena won seven Australian Open titles, seven Wimbledon titles, six US Open titles and three Roland Garros titles. Venus won Wimbledon five times (2000, 2001, 2005, 2007, 2008) and the US Open twice (2000, 2001). Serena beat Venus in the 2017 Australian Open final.

Career records

1. Serena: 858-156 singles record, five WTA Finals titles and 23 WTA 1000 titles.
2. Venus: 49 singles titles and 34 singles finals lost, including the 2008 WTA Finals title.
3. Venus: 22 WTA doubles titles, all with Serena, and two mixed doubles Grand Slam titles in 1998.

Doubles together

The sisters won 14 Grand Slam doubles titles together, completed a non-calendar-year Grand Slam from the 2009 Australian Open to 2010 Roland Garros, and won Olympic doubles gold in 2000, 2008 and 2012.

Background

Venus was born on June 17, 1980, in Lynwood, California, and is 6 ft 1 in. Serena was born on September 26, 1981, in Saginaw, Michigan, and is 5 ft 9 in. Both play right-handed.`;

const BUILT = buildEditorialComparison({
  slug: "serena-vs-venus-williams",
  title: "Serena vs Venus Williams: Titles and Records",
  shortAnswer: SHORT_ANSWER,
  verdict: "Serena: 23 Grand Slam singles titles, 73 singles titles, 319 weeks at No. 1.\n\nVenus: 7 Grand Slam singles titles, 49 singles titles, 5 Wimbledon crowns.\n\nTogether: 14 Grand Slam doubles titles and three Olympic doubles golds.",
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "serena-williams", "slug": "serena-williams", "name": "Serena Williams", "shortDesc": "American tennis player, born September 26, 1981, in Saginaw, Michigan.", "imageUrl": null, "entityType": "person", "position": 0, "pros": ["23 Grand Slam singles titles", "73 WTA singles titles", "319 weeks at world No. 1"], "cons": ["Retired from singles after the 2022 US Open"], "bestFor": "Grand Slam singles record"},
    {"id": "venus-williams", "slug": "venus-williams", "name": "Venus Williams", "shortDesc": "American tennis player, born June 17, 1980, in Lynwood, California.", "imageUrl": null, "entityType": "person", "position": 1, "pros": ["7 Grand Slam singles titles: 5 Wimbledon, 2 US Open", "49 WTA singles titles", "Olympic singles gold in 2000"], "cons": ["34 singles finals lost"], "bestFor": "Wimbledon singles record"},
  ],
  keyDifferences: [{"label": "Grand Slam singles titles", "entityAValue": "23", "entityBValue": "7", "winner": "tie"}, {"label": "WTA singles titles", "entityAValue": "73", "entityBValue": "49", "winner": "tie"}, {"label": "Weeks at No. 1", "entityAValue": "319", "entityBValue": "Career high No. 1", "winner": "tie"}, {"label": "Olympic singles gold", "entityAValue": "2012", "entityBValue": "2000", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Born", "Tennis", "serena-williams", "venus-williams", "September 26, 1981, Saginaw, Michigan", "June 17, 1980, Lynwood, California"),
    textAttr("a1", "Height", "Tennis", "serena-williams", "venus-williams", "5 ft 9 in (1.75 m)", "6 ft 1 in (1.85 m)"),
    textAttr("a2", "Wimbledon singles", "Tennis", "serena-williams", "venus-williams", "7", "5"),
    textAttr("a3", "US Open singles", "Tennis", "serena-williams", "venus-williams", "6", "2"),
    textAttr("a4", "Australian Open singles", "Tennis", "serena-williams", "venus-williams", "7", "0"),
    textAttr("a5", "Roland Garros singles", "Tennis", "serena-williams", "venus-williams", "3", "0"),
  ],
  faqs: [{"question": "Who has more Grand Slam titles, Serena or Venus?", "answer": "Serena won 23 Grand Slam singles titles and Venus won 7. Together they won 14 Grand Slam doubles titles."}, {"question": "How many singles titles did each win?", "answer": "Serena won 73 WTA singles titles and Venus won 49."}, {"question": "How many times did Venus win Wimbledon?", "answer": "Five: 2000, 2001, 2005, 2007 and 2008."}, {"question": "How long was Serena world No. 1?", "answer": "319 weeks, including a 186-week run."}, {"question": "Did Serena and Venus play each other in a Grand Slam final?", "answer": "Yes. Serena beat Venus in the 2017 Australian Open final."}, {"question": "How many Olympic gold medals did they win?", "answer": "They won doubles gold together in 2000, 2008 and 2012. Venus won singles gold in 2000 and Serena in 2012."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Serena holds the larger singles record; Venus won five Wimbledon titles and the sisters shared 14 doubles majors.", keyFact: "Serena won 23 Grand Slam singles titles; Venus won 7." },
  citationStats: {"sourceCount": 2, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "WTA: Serena Williams", "url": "https://www.wtatennis.com/players/230234/serena-williams"}, {"name": "WTA: Venus Williams", "url": "https://www.wtatennis.com/players/230220/venus-williams"}]},
  resources: [{"type": "external", "label": "WTA: Serena Williams", "url": "https://www.wtatennis.com/players/230234/serena-williams", "description": "23 Grand Slam singles, 73 titles, 319 weeks No. 1, 858-156; 14 doubles majors with Venus; Olympic golds."}, {"type": "external", "label": "WTA: Venus Williams", "url": "https://www.wtatennis.com/players/230220/venus-williams", "description": "49 singles titles; Wimbledon 2000, 2001, 2005, 2007, 2008; US Open 2000, 2001; 22 doubles titles."}],
  metaTitle: "Serena Williams vs Venus Williams | A Versus B",
});

BUILT.metadata.metaDescription = "Serena vs Venus Williams: Grand Slam singles titles, WTA titles, weeks at No. 1, Olympic golds and their doubles record together, from WTA records.";

export const SERENA_VS_VENUS_WILLIAMS: EditorialComparison = BUILT;
