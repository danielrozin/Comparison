/**
 * ROO-269: repo override for
 * /blog/best-marvel-movies-ranked-2026-mcu-definitive-list.
 * Film list and release dates read in October 2026 from marvel.com/movies and
 * each film's marvel.com page. The ranking itself is editorial opinion.
 * Added the films the old list missed: The Marvels (2023), Captain America:
 * Brave New World (2025), Thunderbolts* (2025), The Fantastic Four: First
 * Steps (2025) and Spider-Man: Brand New Day (2026).
 * Removed: Morbius (not on Marvel's MCU film list), the "Shang-Chi 2 pending"
 * placeholder, the "35 films" count, the phase table (no official phase list
 * was fetched), unsourced figures ("70+ characters"), and the personal byline
 * with a future date.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const MARVEL_MOVIES_RANKED_BLOG_SLUG = "best-marvel-movies-ranked-2026-mcu-definitive-list";

const PUBLISHED_AT = "2026-07-18T21:17:26.185Z";
const UPDATED_AT = "2026-10-19T00:00:00Z";

const CONTENT = `**Updated Oct 2026.** Our top three MCU movies are Avengers: Endgame (2019), Avengers: Infinity War (2018) and Iron Man (2008). The ranking now covers all 38 MCU films from Iron Man through Spider-Man: Brand New Day (July 31, 2026), including the 2025 releases. Next up is Avengers: Doomsday on December 18, 2026.

| Rank | Film | Year | Tier |
| --- | --- | --- | --- |
| 1 | Avengers: Endgame | 2019 | S |
| 2 | Avengers: Infinity War | 2018 | S |
| 3 | Iron Man | 2008 | S |
| 4 | Black Panther | 2018 | S |
| 5 | Spider-Man: No Way Home | 2021 | S |

*Table: top five MCU films in this ranking, with release year and tier, October 2026.*

Weighing the two big comic-book universes? [Compare Marvel vs DC](/compare/marvel-vs-dc) side by side.

## Tier S: essential

### 1. Avengers: Endgame (2019)
The payoff to everything before it. The first hour sits with grief and failure; the last hour is the biggest crowd-pleasing finale the franchise has made. Moments like Cap lifting Mjolnir land because the series earned them.

### 2. Avengers: Infinity War (2018)
Marvel let the villain win. It juggles a huge cast across several storylines, and it works because Thanos has a clear, coherent goal. The ending still hits hard.

### 3. Iron Man (2008)
The film that started the MCU. Tony Stark's debut holds up better than almost anything else from the early years.

### 4. Black Panther (2018)
The most visually distinctive MCU film, with its strongest world-building outside the Avengers films. Wakanda feels like a real place, and Killmonger is one of the franchise's best villains.

### 5. Spider-Man: No Way Home (2021)
Fan service with real emotional intelligence. Bringing three generations of Spider-Man together could have been a stunt; instead it is one of the most satisfying films in the series.

## Tier A: excellent

### 6. Captain America: The Winter Soldier (2014)
A political thriller with superheroes in it, and genuinely tense. The Hydra-inside-S.H.I.E.L.D. twist is the best reveal in the MCU.

### 7. Guardians of the Galaxy (2014)
A talking raccoon and a tree turned out to be the funniest, most heartfelt film of its era.

### 8. Thor: Ragnarok (2017)
It threw out the old Thor formula and replaced it with something loose and funny. The Hulk vs. Thor arena fight is a highlight.

### 9. Captain America: Civil War (2016)
An Avengers film in all but name. Tony and Steve both have a point, which makes the split painful, and the airport battle is a peak action set piece.

### 10. Shang-Chi and the Legend of the Ten Rings (2021)
The best newer origin story, with the most distinctive fight choreography in the MCU. The creature-heavy finale is the weakest part.

### 11. Doctor Strange in the Multiverse of Madness (2022)
The MCU's horror movie and one of its most visually inventive. Wanda as the villain divides fans but works.

### 12. Iron Man 3 (2013)
Better than its reputation: a smart blockbuster about anxiety and identity. Tony spending much of the film out of the suit is a choice, not a flaw.

### 13. Deadpool & Wolverine (2024)
A jolt of energy that jokes about franchise fatigue while giving fans exactly what they came for.

## Tier B: good

### 14. The Avengers (2012)
The film that proved the shared universe could work at scale. The Battle of New York looks dated now but was a landmark at the time.

### 15. Guardians of the Galaxy Vol. 2 (2017)
More emotional than the first, slightly less fun. The Ego reveal and Yondu's arc land hard.

### 16. Thunderbolts* (2025)
An unconventional team of antiheroes: Yelena Belova, Bucky Barnes, Red Guardian, Ghost, Taskmaster and John Walker. A darker, character-first team-up that gives Yelena the spotlight. Marvel has since rebranded the film as The New Avengers.

### 17. Ant-Man (2015)
Small-scale in the best way. Scott Lang is one of the most likeable leads, and the heist structure gives it its own identity.

### 18. The Fantastic Four: First Steps (2025)
Marvel's First Family arrives: Reed Richards, Sue Storm, Johnny Storm and Ben Grimm. A confident reset for characters who had never fit the MCU before.

### 19. Thor (2011)
A solid origin story with Shakespearean ambitions, mostly delivered through Loki.

### 20. Captain Marvel (2019)
Flawed but worthwhile. Carol Danvers grows on you as the film goes, and the 1990s setting is fun.

### 21. Spider-Man: Homecoming (2017)
Peter Parker's solo debut is charming throughout, and the Vulture is the best grounded villain in the MCU.

### 22. Spider-Man: Brand New Day (2026)
Tom Holland's Spider-Man returns in the first solo outing since No Way Home. It's a strong pick if you followed Peter's story, less so as an entry point.

### 23. Black Widow (2021)
A good spy thriller that arrived late in Natasha's story. Yelena steals every scene.

### 24. Ant-Man and the Wasp (2018)
Pleasant and light, though wedged between Infinity War and Endgame it feels like a detour.

### 25. Avengers: Age of Ultron (2015)
Ultron should have been a great villain and isn't. The farmhouse sequence is the best part.

### 26. Spider-Man: Far From Home (2019)
A post-Endgame palate cleanser, with Mysterio a clever idea well executed and a mid-credits scene with real consequences.

## Tier C: watchable

### 27. Guardians of the Galaxy Vol. 3 (2023)
A fitting farewell for this team. Rocket's backstory is moving; the film runs long but earns its emotional beats.

### 28. Doctor Strange (2016)
Striking mirror-dimension visuals inside a predictable origin story.

### 29. Black Panther: Wakanda Forever (2022)
A near-impossible task handled with more grace than expected. Too long, but Namor is a strong antagonist.

### 30. Captain America: The First Avenger (2011)
A warm period piece that sets up Steve Rogers well, even if the Red Skull is wasted.

### 31. The Marvels (2023)
Brie Larson, Teyonah Parris and Iman Vellani lead a three-hero team-up. Breezy and short on stakes.

### 32. Captain America: Brave New World (2025)
Sam Wilson's first film as Captain America, caught in an international incident after meeting President Thaddeus Ross. Solid, but rarely surprising.

### 33. Thor: Love and Thunder (2022)
Too jokey by half. Gorr is sidelined and the Zeus subplot goes nowhere.

### 34. Ant-Man and the Wasp: Quantumania (2023)
Kang had potential the film never develops, and the quantum realm looks like a video game cutscene.

## Tier D: the bottom

### 35. Eternals (2021)
Beautiful to look at, hard to follow. It introduces a large new team the audience never gets to care about.

### 36. Thor: The Dark World (2013)
The Dark Elves are forgettable villains and the plot is joyless; Ragnarok later reused its best ideas.

### 37. The Incredible Hulk (2008)
The forgotten MCU film: a generic superhero story the franchise mostly moved past.

### 38. Iron Man 2 (2010)
Franchise setup crowds out the story. It had to tease the Avengers and introduce Black Widow while telling an Iron Man story, and the story lost.

## Where to start

If you only watch three, make them Iron Man, Avengers: Infinity War and Avengers: Endgame. For the newest era, start with Thunderbolts* and The Fantastic Four: First Steps before Avengers: Doomsday on December 18, 2026.

## FAQ

### What is the best MCU movie?

Avengers: Endgame (2019) tops this ranking, followed by Avengers: Infinity War (2018) and Iron Man (2008).

### How many MCU movies are there?

There are 38 MCU films from Iron Man (2008) through Spider-Man: Brand New Day (2026). Avengers: Doomsday is next, on December 18, 2026.

### What is the worst MCU movie?

Iron Man 2 (2010) ranks last here, just below The Incredible Hulk (2008) and Thor: The Dark World (2013).

### What are the newest MCU movies?

Spider-Man: Brand New Day (July 31, 2026), The Fantastic Four: First Steps (July 25, 2025), Thunderbolts* (May 2, 2025) and Captain America: Brave New World (February 14, 2025).

### Is Morbius part of the MCU?

No. Morbius isn't on Marvel Studios' list of MCU films, so it isn't ranked here.

## Compare further

- [Marvel vs DC](/compare/marvel-vs-dc)

## Sources

- [Marvel: Movies](https://www.marvel.com/movies)
- [Marvel: Spider-Man: Brand New Day](https://www.marvel.com/movies/spider-man-brand-new-day)
- [Marvel: The Fantastic Four: First Steps](https://www.marvel.com/movies/the-fantastic-four-first-steps)
- [Marvel: Thunderbolts*](https://www.marvel.com/movies/thunderbolts)
- [Marvel: Captain America: Brave New World](https://www.marvel.com/movies/captain-america-brave-new-world)
- [Marvel: The Marvels](https://www.marvel.com/movies/the-marvels)
- [Marvel: Avengers: Doomsday](https://www.marvel.com/movies/avengers-doomsday)
`;

export const MARVEL_MOVIES_RANKED_FAQS = [
  {
    question: "What is the best MCU movie?",
    answer: "Avengers: Endgame (2019) tops this ranking, followed by Avengers: Infinity War (2018) and Iron Man (2008).",
  },
  {
    question: "How many MCU movies are there?",
    answer:
      "There are 38 MCU films from Iron Man (2008) through Spider-Man: Brand New Day (2026). Avengers: Doomsday is next, on December 18, 2026.",
  },
  {
    question: "What is the worst MCU movie?",
    answer: "Iron Man 2 (2010) ranks last here, just below The Incredible Hulk (2008) and Thor: The Dark World (2013).",
  },
  {
    question: "What are the newest MCU movies?",
    answer:
      "Spider-Man: Brand New Day (July 31, 2026), The Fantastic Four: First Steps (July 25, 2025), Thunderbolts* (May 2, 2025) and Captain America: Brave New World (February 14, 2025).",
  },
  {
    question: "Is Morbius part of the MCU?",
    answer: "No. Morbius isn't on Marvel Studios' list of MCU films, so it isn't ranked here.",
  },
];

export const MARVEL_MOVIES_RANKED_ARTICLE: BlogArticle = {
  id: "blog-best-marvel-movies-ranked-2026",
  slug: MARVEL_MOVIES_RANKED_BLOG_SLUG,
  title: "Every MCU Movie Ranked 2026: The Definitive Marvel Movie List",
  excerpt:
    "All 38 MCU films ranked, from Avengers: Endgame at the top to Iron Man 2 at the bottom, now including the 2025 films and Spider-Man: Brand New Day.",
  content: CONTENT,
  category: "entertainment",
  tags: ["best mcu movies ranked 2026", "every marvel movie ranked", "mcu movies best to worst", "marvel movies tier list 2026"],
  metaTitle: "Every MCU Movie Ranked (2026): All 38 Marvel Films, Best to Worst",
  metaDescription:
    "All 38 MCU films ranked best to worst, from Avengers: Endgame to Iron Man 2, including Thunderbolts*, The Fantastic Four: First Steps and Brand New Day.",
  relatedComparisonSlugs: ["marvel-vs-dc"],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: UPDATED_AT,
  viewCount: 0,
};
