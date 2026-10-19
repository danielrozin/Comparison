import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Bing 404 build list (2026-10-19): CNN vs Fox News. Neutral and factual:
 * ownership, networks, digital products and streaming access only. Facts read
 * 19 October 2026 from cnn.com/about, foxnews.com/about, foxcorporation.com
 * and foxone.com. Ratings, "most watched" and award claims from either side
 * are left out, and no political or editorial characterization is made.
 * CNN's All Access price could not be read, so no CNN price is printed.
 * No winner.
 */

const A = "cnn";
const B = "fox-news";

const CNN_ABOUT = "https://www.cnn.com/about";
const FOX_ABOUT = "https://www.foxnews.com/about";
const FOX_CORP = "https://www.foxcorporation.com/";
const FOX_ONE = "https://www.foxone.com/";

const SOURCE_DATE = "2026-10-19";
const PUBLISHED = "2026-10-19T00:00:00Z";
const GROUP = "News networks";

const FOX_ONE_PRICE = "$19.99/month, per FOX One pricing page, Oct 2026";

const SHORT_ANSWER = `CNN and Fox News are both news brands with TV channels, websites and apps. CNN says it is a division of Skydance Corporation and runs CNN, CNN International and CNN en Español, plus an All Access subscription across web, mobile and connected TV. Fox News is part of FOX News Media, a Fox Corporation business that also runs FOX Business Network, FOX Nation and the free, ad-supported FOX Weather; FOX News streams inside FOX One at ${FOX_ONE_PRICE}. Neither is better for everyone.`;

const FAQS = [
  {
    question: "Who owns CNN and Fox News?",
    answer:
      "CNN says it is a division of Skydance Corporation. Fox News is part of FOX News Media, which Fox Corporation lists among its brands.",
  },
  {
    question: "What networks are part of CNN and Fox News?",
    answer:
      "CNN says its TV channels are CNN, CNN International and CNN en Español. Fox says FOX News Media is anchored by FOX News Channel and FOX Business Network.",
  },
  {
    question: "How can I stream CNN or Fox News without cable?",
    answer: `CNN sells an All Access subscription that works on the web, mobile apps and connected TVs. Fox News is included in FOX One, Fox's streaming service, at ${FOX_ONE_PRICE}, with a 3-day free trial.`,
  },
  {
    question: "Do CNN and Fox News reach viewers outside the U.S.?",
    answer:
      "CNN says CNN International reaches more than 200 countries and territories. Fox runs FOX News International as part of FOX News Media.",
  },
  {
    question: "What other products do the two news brands run?",
    answer:
      "CNN says CNN Originals stream on HBO Max and discovery+, and its CNN Newsource service partners with more than 1,000 news organizations. Fox says FOX News Media also runs FOX News Digital, FOX News Audio, FOX News Books, FOX Nation and FOX Weather.",
  },
  {
    question: "Is FOX Weather free?",
    answer:
      "Fox describes FOX Weather as a free, ad-supported service within FOX News Media.",
  },
];

const VERDICT = `CNN suits viewers who want CNN's U.S., international and Spanish-language channels and a CNN All Access subscription on web, mobile and TV.

Fox News suits viewers who want FOX News Channel and FOX Business, and who may stream them through FOX One alongside FOX Sports.

Both run TV channels, websites and apps; choose the coverage you prefer.`;

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- CNN says it is a division of Skydance Corporation.
- Fox News is part of FOX News Media, a Fox Corporation business.
- CNN runs CNN, CNN International and CNN en Español.
- FOX News Media is anchored by FOX News Channel and FOX Business Network.
- FOX One, which includes FOX News, is ${FOX_ONE_PRICE}.

Ownership

CNN says it is a division of Skydance Corporation. FOX News Media is part of Fox Corporation, and Fox's FOX One streaming service carries FOX News alongside FOX Sports.

Networks

CNN lists three TV channels sold through pay-TV providers: CNN, CNN International and CNN en Español. Fox says FOX News Media is anchored by FOX News Channel and FOX Business Network.

Streaming and digital

CNN sells All Access, a subscription that works across the web, mobile apps and connected TVs, and says CNN Originals stream on HBO Max and discovery+. Fox News streams inside FOX One at ${FOX_ONE_PRICE}, with a 3-day free trial and FOX Sports in the same app. Fox also runs FOX Nation and FOX News Digital.

International reach and other services

CNN says CNN International reaches more than 200 countries and territories, and CNN Newsource partners with more than 1,000 news organizations. Fox runs FOX News International, FOX News Audio, FOX News Books and the free, ad-supported FOX Weather.

Who should pick which

Pick CNN for its international and Spanish-language channels and the CNN All Access app. Pick Fox News for FOX News Channel and FOX Business, or if FOX One's mix of news and sports fits how you watch. Disney+ vs HBO Max and Disney+ vs Peacock compare streaming services.`;

const BUILT = buildEditorialComparison({
  slug: "cnn-vs-fox-news",
  title: "CNN vs Fox News: Owners, Channels, Streaming",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "entertainment",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: A,
      slug: A,
      name: "CNN",
      shortDesc: "24-hour news brand that says it is a division of Skydance Corporation.",
      imageUrl: null,
      entityType: "brand",
      position: 0,
      pros: ["CNN, CNN International and CNN en Español", "All Access subscription on web, mobile and connected TV", "CNN Originals on HBO Max and discovery+"],
      cons: ["TV channels need a pay-TV provider", "All Access is a separate subscription"],
      bestFor: "Viewers who want international and Spanish-language CNN channels",
    },
    {
      id: B,
      slug: B,
      name: "Fox News",
      shortDesc: "24-hour news brand within FOX News Media, part of Fox Corporation.",
      imageUrl: null,
      entityType: "brand",
      position: 1,
      pros: ["FOX News Channel and FOX Business Network", "Included in FOX One with FOX Sports", "Free, ad-supported FOX Weather"],
      cons: ["FOX One is a paid subscription", "FOX Nation is a separate service"],
      bestFor: "Viewers who want FOX News Channel and FOX Business, with sports in one app",
    },
  ],
  keyDifferences: [
    { label: "Owner", entityAValue: "Skydance Corporation", entityBValue: "Fox Corporation", winner: "tie" },
    { label: "TV networks", entityAValue: "CNN, CNN International, CNN en Español", entityBValue: "FOX News Channel, FOX Business Network", winner: "tie" },
    { label: "Streaming", entityAValue: "CNN All Access subscription", entityBValue: `FOX One, ${FOX_ONE_PRICE}`, winner: "tie" },
    { label: "Other services", entityAValue: "CNN Originals, CNN Newsource", entityBValue: "FOX Nation, FOX Weather, FOX News Audio", winner: "tie" },
  ],
  attributes: [
    textAttr("owner", "Owner", GROUP, A, B, "Skydance Corporation", "Fox Corporation (FOX News Media)"),
    textAttr("networks", "TV networks", GROUP, A, B, "CNN, CNN International, CNN en Español", "FOX News Channel, FOX Business Network"),
    textAttr("streaming", "Streaming", GROUP, A, B, "All Access on web, mobile and connected TV", `FOX One, ${FOX_ONE_PRICE}; 3-day free trial`),
    textAttr("international", "International", GROUP, A, B, "CNN International in more than 200 countries and territories", "FOX News International"),
    textAttr("digital", "Digital and audio", GROUP, A, B, "CNN Originals on HBO Max and discovery+", "FOX News Digital, FOX News Audio, FOX News Books, FOX Nation"),
    textAttr("other", "Other services", GROUP, A, B, "CNN Newsource, with more than 1,000 partner news organizations", "FOX Weather, free and ad-supported"),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "disney-vs-hbo-max", title: "Disney+ vs HBO Max", category: "entertainment" },
    { slug: "disney-plus-vs-peacock", title: "Disney+ vs Peacock", category: "entertainment" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason: "CNN for international and Spanish-language channels and CNN All Access; Fox News for FOX News Channel, FOX Business and FOX One.",
    keyFact: "CNN says it is a division of Skydance Corporation; Fox News is part of Fox Corporation.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 14,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: "CNN: About CNN", url: CNN_ABOUT },
      { name: "Fox News: About FOX News Media", url: FOX_ABOUT },
      { name: "Fox Corporation: Brands", url: FOX_CORP },
      { name: "FOX One: Plans", url: FOX_ONE },
    ],
  },
  resources: [
    { type: "external", label: "CNN: About CNN", url: CNN_ABOUT, description: "Division of Skydance Corporation; CNN channels, All Access, CNN International reach, Newsource." },
    { type: "external", label: "Fox News: About FOX News Media", url: FOX_ABOUT, description: "FOX News Channel, FOX Business Network, FOX Nation, FOX Weather and other FOX News Media services." },
    { type: "external", label: "Fox Corporation: Brands", url: FOX_CORP, description: "FOX News Media and FOX One among Fox Corporation brands." },
    { type: "external", label: "FOX One: Plans", url: FOX_ONE, description: `${FOX_ONE_PRICE}; 3-day free trial; FOX News and FOX Sports.` },
  ],
  metaTitle: "CNN vs Fox News: Owners, Channels, Streaming",
});

BUILT.metadata.metaDescription =
  "CNN vs Fox News: who owns each network, their TV channels, international reach and how to stream them, from CNN All Access to FOX One.";

export const CNN_VS_FOX_NEWS: EditorialComparison = BUILT;
