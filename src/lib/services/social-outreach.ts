/**
 * Social Outreach Service
 * Finds "X vs Y" questions on Reddit and Quora, and prepares ready-to-post answers
 * with links back to the site.
 */

import { searchTavily } from "@/lib/services/tavily-service";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL } from "@/lib/utils/constants";
import Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FoundQuestion {
  id: string;
  platform: "reddit" | "quora";
  title: string;
  url: string;
  subreddit?: string;
  upvotes?: number;
  comments?: number;
  createdAt: string;
  entityA: string | null;
  entityB: string | null;
  matchingComparisonSlug: string | null;
  matchingComparisonUrl: string | null;
}

export interface PreparedAnswer {
  questionId: string;
  question: FoundQuestion;
  answer: string;
  comparisonUrl: string;
  shortSummary: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const REDDIT_SUBREDDITS = [
  "technology",
  "gadgets",
  "android",
  "apple",
  "gaming",
  "fitness",
  "personalfinance",
  "cars",
  "nutrition",
  "programming",
  "soccer",
  "nba",
  "movies",
  "buildapc",
  "buyitforlife",
  "ShouldIbuythiscar",
  "laptops",
  "headphones",
  "running",
  "AskReddit",
];

const REDDIT_SEARCH_QUERIES = [
  "vs",
  "versus",
  "which is better",
  "compare",
  "should I get",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parses a title to extract entity A and entity B from comparison patterns.
 * Handles: "X vs Y", "X versus Y", "X or Y", "X compared to Y"
 */
function parseEntities(
  title: string
): { entityA: string | null; entityB: string | null } {
  const patterns = [
    /^(.+?)\s+(?:vs\.?|versus)\s+(.+?)(?:\?|$|\s*[-–—])/i,
    /^(.+?)\s+(?:vs\.?|versus)\s+(.+)/i,
    /(?:between|comparing)\s+(.+?)\s+(?:and|or|vs\.?)\s+(.+?)(?:\?|$)/i,
    /(?:should\s+I\s+(?:get|buy|choose|pick))\s+(.+?)\s+(?:or|vs\.?)\s+(.+?)(?:\?|$)/i,
    /^(.+?)\s+or\s+(.+?)(?:\?|$)/i,
    /^(.+?)\s+compared\s+to\s+(.+?)(?:\?|$)/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      const a = match[1].trim().replace(/^(the|a|an)\s+/i, "");
      const b = match[2].trim().replace(/^(the|a|an)\s+/i, "");
      if (a.length > 0 && b.length > 0 && a.length < 80 && b.length < 80) {
        return { entityA: a, entityB: b };
      }
    }
  }

  return { entityA: null, entityB: null };
}

/**
 * Generates a slug from entity names: "iPhone 15" vs "Galaxy S24" -> "iphone-15-vs-galaxy-s24"
 */
function generateSlug(entityA: string, entityB: string): string {
  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  return `${slugify(entityA)}-vs-${slugify(entityB)}`;
}

// ---------------------------------------------------------------------------
// Reddit
// ---------------------------------------------------------------------------

interface RedditPost {
  data: {
    id: string;
    title: string;
    permalink: string;
    subreddit: string;
    ups: number;
    num_comments: number;
    created_utc: number;
  };
}

interface RedditSearchResponse {
  data?: {
    children?: RedditPost[];
  };
}

export async function findRedditQuestions(
  options?: {
    subreddits?: string[];
    limit?: number;
    timeframe?: string;
  }
): Promise<FoundQuestion[]> {
  const subreddits = options?.subreddits || REDDIT_SUBREDDITS;
  const limit = options?.limit || 25;
  const timeframe = options?.timeframe || "week";
  const questions: FoundQuestion[] = [];
  const seenIds = new Set<string>();

  for (const subreddit of subreddits) {
    // Pick one random search query per subreddit to avoid rate limiting
    const query =
      REDDIT_SEARCH_QUERIES[
        Math.floor(Math.random() * REDDIT_SEARCH_QUERIES.length)
      ];

    try {
      const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&sort=new&t=${timeframe}&limit=${limit}&restrict_sr=on`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "AversusB/1.0",
        },
      });

      if (!response.ok) {
        console.warn(
          `Reddit: ${subreddit} returned ${response.status}, skipping`
        );
        await sleep(2000);
        continue;
      }

      const data: RedditSearchResponse = await response.json();
      const posts = data?.data?.children || [];

      for (const post of posts) {
        if (seenIds.has(post.data.id)) continue;
        seenIds.add(post.data.id);

        const { entityA, entityB } = parseEntities(post.data.title);

        let matchingComparisonSlug: string | null = null;
        let matchingComparisonUrl: string | null = null;

        if (entityA && entityB) {
          // Try both orderings
          const slug1 = generateSlug(entityA, entityB);
          const slug2 = generateSlug(entityB, entityA);

          const comp1 = await getComparisonBySlug(slug1);
          if (comp1) {
            matchingComparisonSlug = slug1;
            matchingComparisonUrl = `${SITE_URL}/${slug1}`;
          } else {
            const comp2 = await getComparisonBySlug(slug2);
            if (comp2) {
              matchingComparisonSlug = slug2;
              matchingComparisonUrl = `${SITE_URL}/${slug2}`;
            }
          }
        }

        questions.push({
          id: `reddit-${post.data.id}`,
          platform: "reddit",
          title: post.data.title,
          url: `https://www.reddit.com${post.data.permalink}`,
          subreddit: post.data.subreddit,
          upvotes: post.data.ups,
          comments: post.data.num_comments,
          createdAt: new Date(post.data.created_utc * 1000).toISOString(),
          entityA,
          entityB,
          matchingComparisonSlug,
          matchingComparisonUrl,
        });
      }
    } catch (error) {
      console.warn(`Reddit: Error searching ${subreddit}:`, error);
    }

    // Rate-limit: 1 second between subreddit requests
    await sleep(1000);
  }

  return questions;
}

// ---------------------------------------------------------------------------
// Quora (via Tavily)
// ---------------------------------------------------------------------------

export async function findQuoraQuestions(
  options?: { limit?: number }
): Promise<FoundQuestion[]> {
  const limit = options?.limit || 20;
  const questions: FoundQuestion[] = [];
  const seenUrls = new Set<string>();

  const searchQueries = [
    `site:quora.com "vs" OR "which is better" OR "should I choose" 2026`,
    `site:quora.com "versus" OR "compared to" OR "or which" 2026`,
  ];

  for (const query of searchQueries) {
    const results = await searchTavily(query, Math.ceil(limit / 2));

    for (const result of results) {
      if (!result.url.includes("quora.com")) continue;
      if (seenUrls.has(result.url)) continue;
      seenUrls.add(result.url);

      const { entityA, entityB } = parseEntities(result.title);

      let matchingComparisonSlug: string | null = null;
      let matchingComparisonUrl: string | null = null;

      if (entityA && entityB) {
        const slug1 = generateSlug(entityA, entityB);
        const slug2 = generateSlug(entityB, entityA);

        const comp1 = await getComparisonBySlug(slug1);
        if (comp1) {
          matchingComparisonSlug = slug1;
          matchingComparisonUrl = `${SITE_URL}/${slug1}`;
        } else {
          const comp2 = await getComparisonBySlug(slug2);
          if (comp2) {
            matchingComparisonSlug = slug2;
            matchingComparisonUrl = `${SITE_URL}/${slug2}`;
          }
        }
      }

      questions.push({
        id: `quora-${Buffer.from(result.url).toString("base64").slice(0, 20)}`,
        platform: "quora",
        title: result.title,
        url: result.url,
        createdAt: new Date().toISOString(),
        entityA,
        entityB,
        matchingComparisonSlug,
        matchingComparisonUrl,
      });
    }
  }

  return questions;
}

// ---------------------------------------------------------------------------
// Combined
// ---------------------------------------------------------------------------

export async function findAllQuestions(
  options?: { limit?: number }
): Promise<FoundQuestion[]> {
  const [reddit, quora] = await Promise.all([
    findRedditQuestions({ limit: options?.limit || 25 }),
    findQuoraQuestions({ limit: options?.limit || 20 }),
  ]);

  return [...reddit, ...quora];
}

// ---------------------------------------------------------------------------
// Answer Generation
// ---------------------------------------------------------------------------

export async function prepareAnswer(
  question: FoundQuestion
): Promise<PreparedAnswer | null> {
  // Only prepare answers for questions with a matching comparison page
  if (!question.matchingComparisonSlug || !question.matchingComparisonUrl) {
    return null;
  }

  const comparison = await getComparisonBySlug(question.matchingComparisonSlug);
  if (!comparison) return null;

  // Build context from comparison data
  const entityNames = comparison.entities.map((e) => e.name).join(" vs ");
  const keyDiffs = comparison.keyDifferences
    ?.map((d) => `- ${d}`)
    .join("\n") || "N/A";
  const entityDetails = comparison.entities
    .map((e) => {
      const pros = e.pros?.slice(0, 3).join(", ") || "N/A";
      const cons = e.cons?.slice(0, 3).join(", ") || "N/A";
      return `${e.name}: Pros: ${pros}. Cons: ${cons}. ${e.bestFor ? `Best for: ${e.bestFor}` : ""}`;
    })
    .join("\n");

  const platformTone =
    question.platform === "reddit"
      ? "Use a casual, conversational Reddit tone. Be helpful like a knowledgeable friend."
      : "Use a clear, informative Quora tone. Be thorough but concise, like an expert answering.";

  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `You are writing a helpful answer to this ${question.platform} question: "${question.title}"

Here is factual comparison data for ${entityNames}:

Key Differences:
${keyDiffs}

Entity Details:
${entityDetails}

${comparison.verdict ? `Verdict: ${comparison.verdict}` : ""}

${platformTone}

Write a genuinely helpful answer (2-3 short paragraphs) that:
1. Directly answers the question with key facts and differences
2. Gives a brief verdict / recommendation
3. At the very end, naturally mention: "I found a detailed comparison at ${question.matchingComparisonUrl} that breaks it down further."
4. Do NOT be spammy or overly promotional
5. Use markdown formatting appropriate for ${question.platform}

Answer:`,
      },
    ],
  });

  const answerText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Build a short summary (first sentence or so)
  const shortSummary =
    answerText.split(/[.!?]\s/)[0]?.trim().slice(0, 150) + "...";

  return {
    questionId: question.id,
    question,
    answer: answerText,
    comparisonUrl: question.matchingComparisonUrl,
    shortSummary,
  };
}

export async function prepareAnswers(
  questions: FoundQuestion[],
  limit?: number
): Promise<PreparedAnswer[]> {
  // Filter to only questions with matching comparisons
  const withMatches = questions.filter(
    (q) => q.matchingComparisonSlug && q.matchingComparisonUrl
  );
  const toProcess = withMatches.slice(0, limit || 10);
  const answers: PreparedAnswer[] = [];

  for (const question of toProcess) {
    const answer = await prepareAnswer(question);
    if (answer) {
      answers.push(answer);
    }
  }

  return answers;
}
