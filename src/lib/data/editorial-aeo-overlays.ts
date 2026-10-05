import type {
  ComparisonAttribute,
  ComparisonEntityData,
  ComparisonPageData,
  FAQData,
  KeyDifference,
  QuickAnswerTLDR,
} from "@/types";
import {
  NBA_SEASON_OVERLAYS,
  type NamedAttribute,
  type NamedCell,
  type NamedFact,
  type SeasonScorecard,
} from "@/lib/data/nba-2026-season-overlays";

/**
 * Plain-fact AEO overlays for live compares.
 *
 * Every figure below was on the live scorecard or attribute cells at
 * https://aversusb.net/compare/<slug> on 2026-10-05. Reader copy states
 * those facts in the name of the company, country, or product. It does not
 * mention the page, a table, a row, or a column. Where two on-page figures
 * disagree, both are stated. Figures that are not on that live scorecard or
 * attribute set are left out. winnerName stays null.
 */

const GDP_SHORT_ANSWER =
  "In 2026, the United States is larger on nominal GDP ($28.7 trillion vs $17.9 trillion). A separate nominal comparison is about $30+ trillion versus about $19 trillion. GDP per capita is $89,000 for the United States and $13,500 for China, and the headline per-capita comparison is $89,000+ versus $13,500. China’s 2026 growth is faster (about 4.5–5% vs about 2–2.5%). Manufacturing output share is about 15% of global output for the United States and 35% for China. A second manufacturing comparison is about 16% versus 35%. Defense spending is $925.8 billion for the United States and $296.5 billion for China. Neither is named the winner.";

const GDP_FAQS: FAQData[] = [
  {
    question: "Is China’s economy bigger than the US in 2026?",
    answer:
      "It depends on the measure. In 2026, the United States is larger on nominal GDP ($28.7 trillion vs $17.9 trillion). A separate nominal comparison is about $30+ trillion versus about $19 trillion. The United States is higher on GDP per capita ($89,000 vs $13,500). China’s 2026 growth is faster (about 4.5–5% vs about 2–2.5%). Neither is named the winner.",
  },
  {
    question: "What is US vs China GDP (nominal) in 2026?",
    answer:
      "In 2026, nominal GDP is $28.7 trillion for the United States and $17.9 trillion for China. A separate nominal comparison is about $30+ trillion versus about $19 trillion. These are different totals. Name which pair you mean.",
  },
  {
    question: "How do US and China defense spending and manufacturing share compare?",
    answer:
      "Defense spending is $925.8 billion for the United States and $296.5 billion for China. The United States spends more ($925.8 billion vs $296.5 billion). Manufacturing output share is about 15% of global output for the United States and 35% for China. China is higher on that share (35% vs about 15%). A second manufacturing comparison is about 16% versus 35%.",
  },
  {
    question: "Why can nominal GDP totals for the US and China differ?",
    answer:
      "Nominal GDP converts output into dollars at market exchange rates, so the total moves with the year and the exchange rate. In 2026, one nominal pair is $28.7 trillion for the United States and $17.9 trillion for China. A separate nominal pair is about $30+ trillion versus about $19 trillion. Cite the pair and the year together.",
  },
  {
    question: "What is GDP per capita for the US vs China?",
    answer:
      "GDP per capita is $89,000 for the United States and $13,500 for China. The headline per-capita comparison is $89,000+ versus $13,500. The United States is higher ($89,000 vs $13,500).",
  },
  {
    question: "Will China overtake the US in nominal GDP this decade?",
    answer:
      "Neither is named the winner. In 2026 the United States is larger on nominal GDP ($28.7 trillion vs $17.9 trillion). China’s 2026 growth is faster (about 4.5–5% vs about 2–2.5%). That growth gap is not itself a year when China would pass the United States.",
  },
  {
    question: "Which GDP measure should journalists and students cite?",
    answer:
      "Cite nominal GDP for dollar market size, and GDP per capita for output per person. In 2026, nominal GDP is $28.7 trillion versus $17.9 trillion, and a separate nominal comparison is about $30+ trillion versus about $19 trillion. GDP per capita is $89,000 versus $13,500. Name the measure and the year. Neither is named the winner.",
  },
];

const GDP_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: GDP_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: United States nominal GDP, GDP per capita, and defense spending; China 2026 growth and manufacturing share.",
  keyFact:
    "In 2026, nominal GDP is $28.7 trillion for the United States and $17.9 trillion for China. A separate nominal comparison is about $30+ trillion versus about $19 trillion. Neither is named the winner.",
};

const JAPAN_CHINA_SHORT_ANSWER =
  "China is larger on nominal GDP ($17.9 trillion vs $4.2 trillion) and on population (1.417 billion vs 125 million). Japan is higher on GDP per capita ($39,285 vs $12,720) and on life expectancy (84.6 years vs 78.2 years). Japan’s Human Development Index is 0.920 (very high) and China’s is 0.796 (high). Manufacturing output is 20% of GDP for Japan and 28% for China. Neither is named the winner.";

const JAPAN_CHINA_FAQS: FAQData[] = [
  {
    question: "Is China’s economy bigger than Japan’s?",
    answer:
      "On nominal GDP, yes. China is larger ($17.9 trillion vs $4.2 trillion). Japan is higher on GDP per capita ($39,285 vs $12,720). Neither is named the winner.",
  },
  {
    question: "What is Japan vs China GDP?",
    answer:
      "Nominal GDP is $4.2 trillion for Japan and $17.9 trillion for China. China is larger ($17.9 trillion vs $4.2 trillion).",
  },
  {
    question: "What is Japan vs China GDP per capita?",
    answer:
      "GDP per capita is $39,285 for Japan and $12,720 for China. Japan is higher ($39,285 vs $12,720).",
  },
  {
    question: "What share of GDP is manufacturing in Japan vs China?",
    answer:
      "Manufacturing output is 28% of GDP for China and 20% for Japan. China is higher (28% vs 20%). A second manufacturing comparison is 19.5% for Japan and 28% for China.",
  },
  {
    question: "Which country has the larger population, Japan or China?",
    answer:
      "China. Population is 1.417 billion for China and 125 million for Japan. A second China population figure is 1.42 billion. China is larger (1.417 billion vs 125 million).",
  },
  {
    question: "Which country spends more on defence, Japan or China?",
    answer:
      "China. 2024 defence expenditure is €296.5 billion for China and €50.9 billion for Japan. China spends more (€296.5 billion vs €50.9 billion).",
  },
  {
    question: "Which country has higher life expectancy and HDI, Japan or China?",
    answer:
      "Japan. Life expectancy is 84.6 years for Japan and 78.2 years for China. Japan’s Human Development Index is 0.920 (very high). China’s is 0.796 (high). Japan is higher on life expectancy (84.6 years vs 78.2 years).",
  },
];

const JAPAN_CHINA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: JAPAN_CHINA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: China nominal GDP, population, and manufacturing share; Japan GDP per capita, life expectancy, and HDI.",
  keyFact:
    "Nominal GDP is $17.9 trillion for China and $4.2 trillion for Japan. GDP per capita is $39,285 for Japan and $12,720 for China. Neither is named the winner.",
};

const MESSI_SHORT_ANSWER =
  "Messi has more Ballon d'Or awards (8 vs 5) and won the World Cup in 2022. Ronaldo has never won the World Cup. World Cup titles are 1 for Messi and 0 for Ronaldo. Ronaldo has more career club goals (895+ vs 810+). A count as of 2025 is 890 for Ronaldo and 810 for Messi. Ronaldo has more international goals (130+ vs 129). Ronaldo has more Champions League titles (5 vs 4). Neither is named the winner.";

const MESSI_FAQS: FAQData[] = [
  {
    question: "Who is better, Messi or Ronaldo?",
    answer:
      "Neither is named the winner. Messi has more Ballon d'Or awards (8 vs 5) and won the 2022 World Cup. Ronaldo has more career club goals (895+ vs 810+) and more Champions League titles (5 vs 4).",
  },
  {
    question: "Who has more Ballon d'Or awards, Messi or Ronaldo?",
    answer:
      "Messi has 8 Ballon d'Or awards. Ronaldo has 5. Messi has more (8 vs 5).",
  },
  {
    question: "Who has scored more career goals, Messi or Ronaldo?",
    answer:
      "Ronaldo has more career club goals (895+ vs 810+). A count as of 2025 is 890 goals for Ronaldo and 810 goals for Messi.",
  },
  {
    question: "Who won the World Cup, Messi or Ronaldo?",
    answer:
      "Messi won the 2022 World Cup. Ronaldo has never won the World Cup. World Cup titles are 1 for Messi and 0 for Ronaldo.",
  },
  {
    question: "Who has more Champions League titles, Messi or Ronaldo?",
    answer:
      "Ronaldo has 5 Champions League titles. Messi has 4. Ronaldo has more (5 vs 4).",
  },
  {
    question: "Who has more international goals, Messi or Ronaldo?",
    answer:
      "Ronaldo has more international goals (130+ vs 129).",
  },
  {
    question: "What is the 2025 career-goal count for Messi and Ronaldo?",
    answer:
      "As of 2025, career goals are 810 for Messi and 890 for Ronaldo. Career club goals are also given as 810+ for Messi and 895+ for Ronaldo.",
  },
];

const MESSI_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: MESSI_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Messi Ballon d'Or and the 2022 World Cup; Ronaldo career club goals, international goals, and Champions League titles.",
  keyFact:
    "Messi has 8 Ballon d'Or awards and Ronaldo has 5. Ronaldo has more career club goals (895+ vs 810+). Neither is named the winner.",
};

const PS5_SHORT_ANSWER =
  "The Xbox Series X has more GPU power (12 TFLOPS vs 10.28 TFLOPS). The PS5 has a faster SSD (5.5 GB/s vs 2.4 GB/s). Launch price is $499 for both. Monthly subscription cost is $11.99/month versus $9.99/month for Game Pass. Library size is about 280 games (PS Plus Extra) versus about 500 games (Game Pass). Internal storage is 825 GB usable on the PS5 and a 1TB SSD on the Xbox Series X. Major exclusives are 25+ for the PS5 and 15+ for the Xbox Series X. A second exclusive count is 40+ versus 25+. Neither is named the winner.";

const PS5_FAQS: FAQData[] = [
  {
    question: "Which console is better, PS5 or Xbox Series X?",
    answer:
      "Neither is named the winner. The Xbox Series X has more GPU power (12 TFLOPS vs 10.28 TFLOPS). The PS5 has a faster SSD (5.5 GB/s vs 2.4 GB/s). Launch price is $499 for both.",
  },
  {
    question: "How much storage does the PS5 have compared with the Xbox Series X?",
    answer:
      "The PS5’s internal storage is 825 GB usable. The Xbox Series X’s internal storage is a 1TB SSD.",
  },
  {
    question: "Which has more GPU power, PS5 or Xbox Series X (TFLOPS)?",
    answer:
      "The Xbox Series X has more GPU power (12 TFLOPS vs 10.28 TFLOPS). The PS5 SSD is faster (5.5 GB/s vs 2.4 GB/s).",
  },
  {
    question: "How much do the PS5 and Xbox Series X cost?",
    answer:
      "Launch price is $499 for both the disc edition and the standard console. Monthly subscription cost is $11.99/month versus $9.99/month for Game Pass. Library size is about 280 games (PS Plus Extra) versus about 500 games (Game Pass).",
  },
  {
    question: "Which console has more exclusive games, PS5 or Xbox?",
    answer:
      "The PS5 has more major exclusives on one count (25+ vs 15+). A second exclusive count is 40+ for the PS5 and 25+ for the Xbox Series X.",
  },
  {
    question: "Which console has better backward compatibility, PS5 or Xbox Series X?",
    answer:
      "Both have 4,000+ backward-compatible games: 4,000+ PS4 games and 4,000+ Xbox One and Xbox 360 games.",
  },
  {
    question: "What is the SSD speed of the PS5 vs the Xbox Series X?",
    answer:
      "The PS5 SSD speed is 5.5 GB/s. The Xbox Series X SSD speed is 2.4 GB/s. The PS5 is faster (5.5 GB/s vs 2.4 GB/s).",
  },
  {
    question: "Which should you buy, a PS5 or an Xbox Series X?",
    answer:
      "Neither is named the winner. The PS5 leads on SSD speed (5.5 GB/s vs 2.4 GB/s) and on one exclusive count (25+ vs 15+). The Xbox Series X leads on GPU power (12 TFLOPS vs 10.28 TFLOPS). Launch price is $499 for both.",
  },
];

const PS5_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: PS5_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Xbox GPU power and the larger game library; PS5 SSD speed and exclusives; launch price is $499 for both.",
  keyFact:
    "GPU power is 12 TFLOPS for the Xbox Series X and 10.28 TFLOPS for the PS5. SSD speed is 5.5 GB/s versus 2.4 GB/s. Neither is named the winner.",
};

const FIGMA_SHORT_ANSWER =
  "Figma runs in any browser. Sketch is Mac only. Real-time collaboration is excellent for Figma and limited for Sketch. Market share is about 80% of designers for Figma and about 15% of designers for Sketch. Active designers are 4M+ for Figma and about 1M for Sketch. Offline use is limited for Figma and full for Sketch. Price is Free / $12+/mo for Figma and $9/mo or $99/yr for Sketch. Neither is named the winner.";

const FIGMA_FAQS: FAQData[] = [
  {
    question: "Which is better, Figma or Sketch?",
    answer:
      "Neither is named the winner. Figma’s market share is higher (~80% of designers vs ~15% of designers). Real-time collaboration is excellent for Figma and limited for Sketch. Offline use is full for Sketch and limited for Figma. Price is Free / $12+/mo for Figma and $9/mo or $99/yr for Sketch.",
  },
  {
    question: "What is Figma vs Sketch market share?",
    answer:
      "Market share is about 80% of designers for Figma and about 15% of designers for Sketch. Figma’s share is higher (~80% of designers vs ~15% of designers). Active designers are 4M+ for Figma and about 1M for Sketch.",
  },
  {
    question: "Does Figma work on Windows, and does Sketch?",
    answer:
      "Figma runs in any browser, including on Windows. Sketch is Mac only.",
  },
  {
    question: "Which has better real-time collaboration, Figma or Sketch?",
    answer:
      "Figma. Real-time collaboration is excellent for Figma and limited for Sketch.",
  },
  {
    question: "How much do Figma and Sketch cost?",
    answer:
      "Figma’s price is Free / $12+/mo. Sketch’s price is $9/mo or $99/yr.",
  },
  {
    question: "Can you use Figma or Sketch offline?",
    answer:
      "Offline use is limited for Figma and full for Sketch.",
  },
  {
    question: "Is Figma free?",
    answer:
      "Figma’s price is Free / $12+/mo, so there is a free starting price and a paid price of $12+/mo. Sketch is $9/mo or $99/yr.",
  },
  {
    question: "How many active designers use Figma vs Sketch?",
    answer:
      "Figma has 4M+ active designers. Sketch has about 1M. Figma has more (4M+ vs ~1M).",
  },
];

const FIGMA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: FIGMA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Figma browser access, real-time collaboration, market share, and active designers; Sketch offline use and price.",
  keyFact:
    "Market share is about 80% of designers for Figma and about 15% of designers for Sketch. Price is Free / $12+/mo versus $9/mo or $99/yr. Neither is named the winner.",
};

const CANVA_SHORT_ANSWER =
  "Canva’s learning curve is minimal and Photoshop’s is steep. Canva’s template library is massive and Photoshop has none built in. Canva’s professional template count is 10,000+. Photoshop leads on professional features (advanced vs basic) and on photo retouching (professional vs basic). Canva’s monthly cost is Free/$13/mo on one comparison and Free / $12.99 on another, both against Photoshop at $22.99. Canva has 170M+ registered users. Photoshop has about 30M paid subscribers. Those are not the same kind of count. File format support is limited for Canva and comprehensive for Photoshop. Neither is named the winner.";

const CANVA_FAQS: FAQData[] = [
  {
    question: "Which is better, Canva or Photoshop?",
    answer:
      "Neither is named the winner. Canva’s learning curve is minimal and Photoshop’s is steep. Canva’s template library is massive and Photoshop has none built in. Photoshop leads on professional features (advanced vs basic) and on photo retouching (professional vs basic).",
  },
  {
    question: "How much do Canva and Photoshop cost?",
    answer:
      "Canva’s monthly cost is lower on the Free/$13/mo comparison (Free/$13/mo vs $22.99/mo). A second Canva price is Free / $12.99, also against Photoshop at $22.99. Those two Canva prices are different. Photoshop’s monthly price in both comparisons is $22.99.",
  },
  {
    question: "Is Canva replacing Photoshop?",
    answer:
      "No. Canva’s learning curve is minimal and its template library is massive. Photoshop’s professional features are advanced and its photo retouching is professional. They are aimed at different work.",
  },
  {
    question: "Who has more users, Canva or Photoshop?",
    answer:
      "Canva has 170M+ registered users. Photoshop has about 30M paid subscribers. Registered users and paid subscribers are not the same kind of count.",
  },
  {
    question: "Which is easier to learn, Canva or Photoshop?",
    answer:
      "Canva. The learning curve is minimal for Canva and steep for Photoshop.",
  },
  {
    question: "Which is better for photo retouching and templates?",
    answer:
      "Photo retouching is basic for Canva and professional for Photoshop. The template library is massive for Canva and none built in for Photoshop. Canva’s professional template count is 10,000+. File format support is limited for Canva and comprehensive for Photoshop.",
  },
  {
    question: "Can Canva be used professionally?",
    answer:
      "Canva’s professional features are basic and its photo retouching is basic. Its template library is massive, with a professional template count of 10,000+. Photoshop’s professional features are advanced.",
  },
  {
    question: "What Canva and Photoshop prices are stated?",
    answer:
      "Canva is Free/$13/mo in one monthly comparison and Free / $12.99 in another. Photoshop is $22.99/mo and $22.99 in those same comparisons. Keep the two Canva prices separate.",
  },
];

const CANVA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CANVA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Canva ease, template library, and monthly cost; Photoshop professional features, photo retouching, and file formats.",
  keyFact:
    "Canva’s monthly prices are Free/$13/mo and Free / $12.99. Photoshop’s monthly price is $22.99. Canva’s template library is massive and Photoshop has none built in. Neither is named the winner.",
};

const CHATGPT_SHORT_ANSWER =
  "Gemini’s context window is larger (1,000,000 tokens vs 128,000 tokens). A second context comparison is 256,000 tokens for ChatGPT and 1,000,000 tokens for Gemini. Gemini’s average response latency is faster (0.8 seconds vs 1.2 seconds). Cost per 1 million input tokens is $2.50 for ChatGPT and $0.075 for Gemini. The output token limit is 32,000 for ChatGPT and 65,000 for Gemini. Training-data cutoff is April 2024 for ChatGPT and December 2024 for Gemini. ChatGPT’s native inputs are text and image. Gemini’s native inputs are text, image, audio, and video. Real-time search is limited for ChatGPT and native for Gemini. Neither is named the winner.";

const CHATGPT_FAQS: FAQData[] = [
  {
    question: "Which AI is better, ChatGPT or Gemini?",
    answer:
      "Neither is named the winner. Gemini’s context window is larger (1,000,000 tokens vs 128,000 tokens). Gemini’s average latency is faster (0.8 seconds vs 1.2 seconds). Cost per 1 million input tokens is $2.50 for ChatGPT and $0.075 for Gemini.",
  },
  {
    question: "Who has the larger context window, ChatGPT or Gemini?",
    answer:
      "Gemini. The context window is 1,000,000 tokens for Gemini and 128,000 tokens for ChatGPT. Gemini’s window is larger (1,000,000 tokens vs 128,000 tokens). A second context comparison is 256,000 tokens for ChatGPT and 1,000,000 tokens for Gemini.",
  },
  {
    question: "Which has real-time web search, ChatGPT or Gemini?",
    answer:
      "Real-time search is native for Gemini and limited for ChatGPT.",
  },
  {
    question: "What inputs do ChatGPT and Gemini accept?",
    answer:
      "ChatGPT’s native inputs are text and image. Gemini’s native inputs are text, image, audio, and video.",
  },
  {
    question: "How much do ChatGPT and Gemini cost per million input tokens?",
    answer:
      "Cost per 1 million input tokens is $2.50 for ChatGPT and $0.075 for Gemini. ChatGPT’s price is higher ($2.50 vs $0.075).",
  },
  {
    question: "Which responds faster, ChatGPT or Gemini?",
    answer:
      "Gemini. Average response latency is faster for Gemini (0.8 seconds vs 1.2 seconds).",
  },
  {
    question: "What is the output token limit for ChatGPT vs Gemini?",
    answer:
      "The output token limit is 65,000 tokens for Gemini and 32,000 tokens for ChatGPT. Gemini’s limit is larger (65,000 tokens vs 32,000 tokens).",
  },
  {
    question: "When does training data stop for ChatGPT and Gemini?",
    answer:
      "ChatGPT’s training-data cutoff is April 2024. Gemini’s training-data cutoff is December 2024.",
  },
];

const CHATGPT_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CHATGPT_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Gemini context window, latency, input-token price, output limit, and native multimodal inputs. Neither side has a single overall win.",
  keyFact:
    "Gemini’s context window is larger (1,000,000 tokens vs 128,000 tokens). A second ChatGPT context figure is 256,000 tokens. Neither is named the winner.",
};

const CURSOR_SHORT_ANSWER =
  "GitHub Copilot Pro costs less ($10/mo vs $20/mo). The annual price is $100/yr for Copilot Pro, two months free annually, and roughly $192/yr for Cursor Pro. Business is $19/user/mo for Copilot and $40/user/mo for Cursor. Copilot Pro+ is $39/mo and Copilot Enterprise is $39/user/mo. Cursor leads on agentic editing with Composer and on codebase indexing. Copilot is a plugin for VS Code, Visual Studio, JetBrains, Neovim, Xcode, Eclipse, and more. Cursor is a standalone editor, a fork of VS Code. Both offer Claude, GPT, and Gemini. Inline autocomplete is effectively a tie. Neither is named the winner.";

const CURSOR_FAQS: FAQData[] = [
  {
    question: "Which is better, Cursor or GitHub Copilot?",
    answer:
      "Neither is named the winner. Copilot Pro costs less ($10/mo vs $20/mo). Cursor leads on agentic editing with Composer and on codebase indexing. Copilot leads on editor coverage and GitHub integration. Both offer Claude, GPT, and Gemini. Inline autocomplete is effectively a tie.",
  },
  {
    question: "How much do Cursor and GitHub Copilot cost?",
    answer:
      "Cursor Pro is $20/mo, or roughly $192/yr. Copilot Pro is $10/mo, or $100/yr, which is two months free annually. Copilot Pro costs less ($10/mo vs $20/mo). Cursor Business is $40/user/mo. Copilot Business is $19/user/mo. Business is higher for Cursor ($40/user/mo vs $19/user/mo). Copilot Pro+ is $39/mo. Copilot Enterprise is $39/user/mo. The annual figure is higher for Cursor (roughly $192/yr vs $100/yr).",
  },
  {
    question: "Which has better agentic and multi-file editing, Cursor or Copilot?",
    answer:
      "Cursor. Composer runs a plan-execute-verify loop across files, terminal commands, and tests. Copilot has an in-editor agent, Copilot Workspace, and an issue-to-PR coding agent.",
  },
  {
    question: "Which works in more editors, Cursor or GitHub Copilot?",
    answer:
      "GitHub Copilot. Copilot is a plugin for VS Code, Visual Studio, JetBrains, Neovim, Xcode, Eclipse, and more. Cursor is a standalone editor, a fork of VS Code.",
  },
  {
    question: "Which has better GitHub integration and enterprise controls?",
    answer:
      "GitHub Copilot. Copilot offers PR summaries, an issue-to-PR agent, the GitHub CLI, and GitHub.com. Enterprise controls include org policy, SSO, audit logs, content exclusion, data residency, and IP indemnification. Cursor’s enterprise features are SSO/SAML, a privacy mode, and SOC 2 compliance.",
  },
  {
    question: "Do Cursor and Copilot both offer Claude, GPT, and Gemini?",
    answer:
      "Yes. Both offer Anthropic Claude, OpenAI GPT, and Google Gemini. The model choice is a tie. Inline autocomplete is effectively a tie. Copilot’s inline autocomplete still defaults to GitHub’s OpenAI-based completion engine.",
  },
  {
    question: "Which is better for inline autocomplete and onboarding?",
    answer:
      "Inline autocomplete is effectively a tie. Onboarding favors Copilot: one extension in the IDE you already use. Cursor is a separate application. For someone coming from VS Code, Cursor imports extensions, settings, and keybindings.",
  },
  {
    question: "What are the Cursor and Copilot business prices?",
    answer:
      "Cursor Business is $40/user/mo. Copilot Business is $19/user/mo. Copilot Enterprise is $39/user/mo. Copilot Pro+ is $39/mo. Business is higher for Cursor ($40/user/mo vs $19/user/mo).",
  },
];

const CURSOR_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CURSOR_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Copilot price, editor coverage, GitHub integration, enterprise controls, and onboarding; Cursor agentic editing and codebase indexing; models and inline autocomplete are ties.",
  keyFact:
    "Copilot Pro costs less ($10/mo vs $20/mo). The annual figure is higher for Cursor (roughly $192/yr vs $100/yr). Neither is named the winner.",
};

const ANDROID_SHORT_ANSWER =
  "Android’s global market share is higher (72% vs 28%). A 2025 Android global market share figure is 71%. Customization is extensive on Android and limited on iOS. iOS software support is 5–6 years and Android software support is 2–3 years. Privacy is excellent on iOS and good on Android. Neither is named the winner.";

const ANDROID_FAQS: FAQData[] = [
  {
    question: "Which is better, Android or iOS?",
    answer:
      "Neither is named the winner. Android’s global market share is higher (72% vs 28%). Customization is extensive on Android and limited on iOS. iOS software support is 5–6 years and Android software support is 2–3 years. Privacy is excellent on iOS and good on Android.",
  },
  {
    question: "What is Android vs iOS global market share?",
    answer:
      "Global market share is 72% for Android and 28% for iOS. Android’s share is higher (72% vs 28%). A 2025 Android global market share figure is 71%.",
  },
  {
    question: "Which gets software updates longer, Android or iOS?",
    answer:
      "iOS. Software support is 5–6 years on iOS and 2–3 years on Android. Average update support is 2–3 years for Android and 5–6 years for iOS.",
  },
  {
    question: "Which is more private, Android or iOS?",
    answer:
      "iOS. Privacy is good on Android and excellent on iOS.",
  },
  {
    question: "Which is more customizable, Android or iOS?",
    answer:
      "Android. Customization is extensive on Android and limited on iOS.",
  },
  {
    question: "How long do Android and iOS software updates last?",
    answer:
      "Android software support is 2–3 years. iOS software support is 5–6 years. A separate Android support span is 3–5 years.",
  },
  {
    question: "What Android and iOS differences are settled by market share, updates, and privacy?",
    answer:
      "Android leads global market share (72% vs 28%). iOS leads software support, at 5–6 years against Android’s 2–3 years, and privacy, excellent against good. Customization is extensive on Android and limited on iOS. Neither is named the winner.",
  },
];

const ANDROID_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: ANDROID_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Android market share and customization; iOS software updates and privacy.",
  keyFact:
    "Android’s global market share is higher (72% vs 28%). A 2025 Android figure is 71%. Neither is named the winner.",
};

const NVIDIA_SHORT_ANSWER =
  "NVIDIA leads AI compute, dominant versus growing for AMD. NVIDIA’s market cap is larger ($2.5T+ vs $250B). The same market cap is also $2.5 trillion versus $250 billion. NVIDIA’s discrete GPU share is higher (80% vs 20%). AMD leads value for money, excellent versus premium for NVIDIA, and AMD leads CPUs. NVIDIA’s CPU market position is none. Neither is named the winner.";

const NVIDIA_FAQS: FAQData[] = [
  {
    question: "Which is better, NVIDIA or AMD?",
    answer:
      "Neither is named the winner. NVIDIA’s market cap is larger ($2.5T+ vs $250B) and its discrete GPU share is higher (80% vs 20%). NVIDIA leads AI compute, dominant versus growing. AMD leads value for money, excellent versus premium, and AMD leads CPUs.",
  },
  {
    question: "What is NVIDIA vs AMD discrete GPU market share?",
    answer:
      "Discrete GPU market share is 80% for NVIDIA and 20% for AMD. NVIDIA’s share is higher (80% vs 20%).",
  },
  {
    question: "Which has the larger market cap, NVIDIA or AMD?",
    answer:
      "NVIDIA. Market cap is $2.5T+ versus $250B, and the same comparison is $2.5 trillion versus $250 billion. NVIDIA’s market cap is larger ($2.5T+ vs $250B).",
  },
  {
    question: "Which is better for AI, NVIDIA or AMD?",
    answer:
      "NVIDIA leads AI compute. NVIDIA’s position is dominant and AMD’s is growing.",
  },
  {
    question: "Which is better for gaming value, and who makes CPUs?",
    answer:
      "AMD leads value for money: AMD is excellent and NVIDIA is premium. AMD leads CPUs. NVIDIA’s CPU market position is none.",
  },
  {
    question: "How is NVIDIA’s market cap written?",
    answer:
      "One market-cap comparison is $2.5T+ for NVIDIA and $250B for AMD. Another is $2.5 trillion versus $250 billion. NVIDIA’s market cap is larger ($2.5 trillion vs $250 billion).",
  },
  {
    question: "What do the NVIDIA and AMD share and market-cap figures say?",
    answer:
      "Discrete GPU share is 80% for NVIDIA and 20% for AMD. Market cap is $2.5T+ versus $250B. Neither is named the winner.",
  },
];

const NVIDIA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: NVIDIA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: NVIDIA AI compute, market cap, and discrete GPU share; AMD value for money and CPUs.",
  keyFact:
    "NVIDIA’s market cap is larger ($2.5T+ vs $250B). Discrete GPU share is 80% for NVIDIA and 20% for AMD. Neither is named the winner.",
};

const US_ECONOMY_CHINA_SHORT_ANSWER =
  "The United States is larger on nominal GDP ($25.5 trillion vs $17.9 trillion). A second nominal comparison is $25.5T versus $17.7T. The United States is higher on GDP per capita ($76,398 vs $12,720). A second per-capita comparison is $76,300 versus $12,500. China is higher on manufacturing share (30% vs 16%). China’s headline GDP growth is higher (4.5% vs 2.5%). A 2026 growth comparison is 4.6–4.8% for China and 2.0–2.5% for the United States. Neither is named the winner.";

const US_ECONOMY_CHINA_FAQS: FAQData[] = [
  {
    question: "Which economy is bigger, the US or China?",
    answer:
      "Neither is named the winner. The United States is larger on nominal GDP ($25.5 trillion vs $17.9 trillion) and higher on GDP per capita ($76,300 vs $12,500). China is higher on manufacturing share (30% vs 16%) and on headline GDP growth (4.5% vs 2.5%).",
  },
  {
    question: "What is US vs China nominal GDP?",
    answer:
      "Nominal GDP is $25.5 trillion for the United States and $17.9 trillion for China. The United States is larger ($25.5 trillion vs $17.9 trillion). A second nominal comparison is $25.5T versus $17.7T.",
  },
  {
    question: "What is GDP per capita for the US vs China?",
    answer:
      "GDP per capita is $76,398 for the United States and $12,720 for China, and the China figure is dated 2025. The United States is higher ($76,398 vs $12,720). A second per-capita comparison is $76,300 versus $12,500.",
  },
  {
    question: "Who has the larger manufacturing share, the US or China?",
    answer:
      "China. Manufacturing share is 30% for China and 16% for the United States. China is higher (30% vs 16%).",
  },
  {
    question: "Which economy is growing faster, the US or China?",
    answer:
      "China. Headline GDP growth is 4.5% for China and 2.5% for the United States. China is higher (4.5% vs 2.5%). A 2026 growth comparison is 4.6–4.8% for China and 2.0–2.5% for the United States.",
  },
  {
    question: "Is there one overall winner between the US and China economies?",
    answer:
      "Neither is named the winner. The United States leads on nominal GDP and GDP per capita. China leads on manufacturing share (30% vs 16%) and on GDP growth (4.5% vs 2.5%).",
  },
  {
    question: "Do the US and China nominal GDP figures agree?",
    answer:
      "The United States figure is $25.5 trillion in both nominal comparisons. China’s figure is $17.9 trillion in one and $17.7 trillion in the other. Do not treat those China totals as one number.",
  },
];

const US_ECONOMY_CHINA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: US_ECONOMY_CHINA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: United States nominal GDP and GDP per capita; China manufacturing share and GDP growth.",
  keyFact:
    "Nominal GDP is $25.5 trillion for the United States and $17.9 trillion for China. A second China nominal figure is $17.7 trillion. Manufacturing share is 16% versus 30%. Neither is named the winner.",
};

const USA_CHINA_SHORT_ANSWER =
  "The United States is larger on nominal GDP ($25.5 trillion vs $17.7 trillion) and on military spending ($877 billion vs $292 billion). The United States is higher on GDP per capita ($76,300 vs $12,500). A 2026 nominal per-capita comparison is $76,398 versus $12,556. China’s population is larger (1.4 billion vs 333 million). A second population comparison is 1.42 billion versus 0.340 billion. Manufacturing output rank is #1 for China and #2 for the United States. Neither is named the winner.";

const USA_CHINA_FAQS: FAQData[] = [
  {
    question: "Which is ahead, the USA or China?",
    answer:
      "Neither is named the winner. The United States is larger on nominal GDP ($25.5 trillion vs $17.7 trillion) and on military spending ($877 billion vs $292 billion), and higher on GDP per capita ($76,300 vs $12,500). China’s population is larger (1.4 billion vs 333 million). Manufacturing output rank is #1 for China and #2 for the United States.",
  },
  {
    question: "What is USA vs China GDP?",
    answer:
      "Nominal GDP is $25.5 trillion for the United States and $17.7 trillion for China. The United States is larger ($25.5 trillion vs $17.7 trillion).",
  },
  {
    question: "Which country has the larger population, the USA or China?",
    answer:
      "China. Population is 1.4 billion for China and 333 million for the United States. China is larger (1.4 billion vs 333 million). A second population comparison is 1.42 billion versus 0.340 billion.",
  },
  {
    question: "Which country spends more on the military, the USA or China?",
    answer:
      "The United States. Military spending is $877 billion for the United States and $292 billion for China. The United States spends more ($877 billion vs $292 billion).",
  },
  {
    question: "What is GDP per capita for the USA vs China?",
    answer:
      "GDP per capita is $76,300 for the United States and $12,500 for China. The United States is higher ($76,300 vs $12,500). A 2026 nominal per-capita comparison is $76,398 versus $12,556.",
  },
  {
    question: "Who leads manufacturing output, the USA or China?",
    answer:
      "China’s manufacturing output rank is #1. The United States’ rank is #2. China leads that rank (#1 vs #2).",
  },
  {
    question: "How do the USA and China population counts compare?",
    answer:
      "China’s population is 1.4 billion and the United States’ population is 333 million. A second comparison is 1.42 billion for China and 0.340 billion for the United States. China is larger (1.4 billion vs 333 million).",
  },
];

const USA_CHINA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: USA_CHINA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: United States nominal GDP, military spending, and GDP per capita; China population and manufacturing output rank.",
  keyFact:
    "Nominal GDP is $25.5 trillion for the United States and $17.7 trillion for China. Manufacturing output rank is #2 for the United States and #1 for China. Neither is named the winner.",
};

const LYFT_UBER_SHORT_ANSWER =
  "Uber operates in 72 countries across 6 continents. Lyft operates in the US and Canada only. Uber’s US rideshare market share is higher (71% vs 29%). Uber’s services are rideshare, Uber Eats, Uber Freight, Uber Jump, and Uber Elevate. Lyft’s service is rideshare only. Uber’s platform fee is 25–30%. Lyft’s platform fee is about 25%. 2024 annual revenue is $38.1 billion for Uber and $4.3 billion for Lyft. A second Uber 2024 revenue figure is $38.7 billion. Uber’s active driver base is 6+ million globally. Lyft’s is 600,000–700,000 in North America. Both require a 4.6+ star driver rating to remain active. Neither is named the winner.";

const LYFT_UBER_FAQS: FAQData[] = [
  {
    question: "Which is bigger, Uber or Lyft?",
    answer:
      "Neither is named the winner. Uber’s US rideshare share is higher (71% vs 29%). 2024 annual revenue is $38.1 billion for Uber and $4.3 billion for Lyft, and a second Uber figure is $38.7 billion. Uber operates in 72 countries across 6 continents. Lyft operates in the US and Canada only. Lyft’s platform fee is about 25%, and Uber’s is 25–30%. The driver rating requirement is a tie at 4.6+ stars.",
  },
  {
    question: "What is Uber vs Lyft US rideshare market share?",
    answer:
      "Uber’s US rideshare market share is 71%. Lyft’s is 29%. Uber’s share is higher (71% vs 29%).",
  },
  {
    question: "Where do Uber and Lyft operate?",
    answer:
      "Uber operates in 72 countries across 6 continents. Lyft operates in the US and Canada only.",
  },
  {
    question: "What was Uber and Lyft 2024 annual revenue?",
    answer:
      "2024 annual revenue is $38.1 billion for Uber and $4.3 billion for Lyft. A second Uber 2024 revenue figure is $38.7 billion. Uber’s figure is higher on the $38.1 billion comparison ($38.1 billion vs $4.3 billion).",
  },
  {
    question: "What platform fee do Uber and Lyft charge?",
    answer:
      "Uber’s platform fee is 25–30%. Lyft’s platform fee is about 25%.",
  },
  {
    question: "How many drivers do Uber and Lyft have, and is the rating a tie?",
    answer:
      "Uber’s active driver base is 6+ million globally. Lyft’s is 600,000–700,000 in North America. The driver rating requirement is a tie: 4.6+ stars to remain active for both.",
  },
  {
    question: "What services do Uber and Lyft offer?",
    answer:
      "Uber offers rideshare, Uber Eats, Uber Freight, Uber Jump, and Uber Elevate. Lyft offers rideshare only. Uber operates in 72 countries across 6 continents. Lyft operates in the US and Canada only.",
  },
];

const LYFT_UBER_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: LYFT_UBER_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Uber presence, US share, service mix, annual revenue, and driver base; Lyft platform fee; driver rating is a tie.",
  keyFact:
    "US rideshare share is 71% for Uber and 29% for Lyft. 2024 annual revenue is $38.1 billion for Uber and $4.3 billion for Lyft. A second Uber figure is $38.7 billion. Neither is named the winner.",
};

type AeoOverlay = {
  shortAnswer: string;
  faqs: FAQData[];
  quickAnswer: QuickAnswerTLDR;
} & Partial<SeasonScorecard>;

const OVERLAYS: Record<string, AeoOverlay> = {
  "us-vs-china-gdp": {
    shortAnswer: GDP_SHORT_ANSWER,
    faqs: GDP_FAQS,
    quickAnswer: GDP_QUICK_ANSWER,
  },
  "japan-vs-china": {
    shortAnswer: JAPAN_CHINA_SHORT_ANSWER,
    faqs: JAPAN_CHINA_FAQS,
    quickAnswer: JAPAN_CHINA_QUICK_ANSWER,
  },
  "messi-vs-ronaldo": {
    shortAnswer: MESSI_SHORT_ANSWER,
    faqs: MESSI_FAQS,
    quickAnswer: MESSI_QUICK_ANSWER,
  },
  "ps5-vs-xbox-series-x": {
    shortAnswer: PS5_SHORT_ANSWER,
    faqs: PS5_FAQS,
    quickAnswer: PS5_QUICK_ANSWER,
  },
  "figma-vs-sketch": {
    shortAnswer: FIGMA_SHORT_ANSWER,
    faqs: FIGMA_FAQS,
    quickAnswer: FIGMA_QUICK_ANSWER,
  },
  "canva-vs-photoshop": {
    shortAnswer: CANVA_SHORT_ANSWER,
    faqs: CANVA_FAQS,
    quickAnswer: CANVA_QUICK_ANSWER,
  },
  "chatgpt-vs-gemini": {
    shortAnswer: CHATGPT_SHORT_ANSWER,
    faqs: CHATGPT_FAQS,
    quickAnswer: CHATGPT_QUICK_ANSWER,
  },
  "cursor-vs-copilot": {
    shortAnswer: CURSOR_SHORT_ANSWER,
    faqs: CURSOR_FAQS,
    quickAnswer: CURSOR_QUICK_ANSWER,
  },
  "android-vs-ios": {
    shortAnswer: ANDROID_SHORT_ANSWER,
    faqs: ANDROID_FAQS,
    quickAnswer: ANDROID_QUICK_ANSWER,
  },
  "nvidia-vs-amd": {
    shortAnswer: NVIDIA_SHORT_ANSWER,
    faqs: NVIDIA_FAQS,
    quickAnswer: NVIDIA_QUICK_ANSWER,
  },
  "us-economy-vs-china-economy": {
    shortAnswer: US_ECONOMY_CHINA_SHORT_ANSWER,
    faqs: US_ECONOMY_CHINA_FAQS,
    quickAnswer: US_ECONOMY_CHINA_QUICK_ANSWER,
  },
  "usa-vs-china": {
    shortAnswer: USA_CHINA_SHORT_ANSWER,
    faqs: USA_CHINA_FAQS,
    quickAnswer: USA_CHINA_QUICK_ANSWER,
  },
  "lyft-vs-uber": {
    shortAnswer: LYFT_UBER_SHORT_ANSWER,
    faqs: LYFT_UBER_FAQS,
    quickAnswer: LYFT_UBER_QUICK_ANSWER,
  },
};


function entityMatches(entity: ComparisonEntityData, match: string): boolean {
  const needle = match.trim().toLowerCase();
  if (!needle) return false;
  return (
    entity.id.toLowerCase() === needle ||
    entity.slug.toLowerCase() === needle ||
    entity.slug.toLowerCase().includes(needle) ||
    entity.name.toLowerCase().includes(needle)
  );
}

function cellFor(entity: ComparisonEntityData, cells: NamedCell[]): NamedCell | undefined {
  return cells.find((cell) => entityMatches(entity, cell.match));
}

function rowsToAttributes(
  entities: ComparisonEntityData[],
  rows: NamedAttribute[]
): ComparisonAttribute[] {
  return rows.map((row) => {
    const someoneWon = row.cells.some((cell) => cell.winner);
    return {
      id: row.slug,
      slug: row.slug,
      name: row.name,
      unit: null,
      category: row.category,
      dataType: "text",
      higherIsBetter: null,
      values: entities.map((entity) => {
        const cell = cellFor(entity, row.cells);
        return {
          entityId: entity.id,
          valueText: cell?.text ?? "—",
          valueNumber: null,
          valueBoolean: null,
          winner: someoneWon ? Boolean(cell?.winner) : undefined,
        };
      }),
    };
  });
}

function factsToKeyDifferences(
  entities: ComparisonEntityData[],
  facts: NamedFact[]
): KeyDifference[] {
  const entityA = entities[0];
  const entityB = entities[1];
  return facts.map((fact) => {
    const cellA = entityA ? cellFor(entityA, fact.cells) : undefined;
    const cellB = entityB ? cellFor(entityB, fact.cells) : undefined;
    let winner: "a" | "b" | "tie" = "tie";
    if (cellA?.winner && !cellB?.winner) winner = "a";
    else if (cellB?.winner && !cellA?.winner) winner = "b";
    return {
      label: fact.label,
      entityAValue: cellA?.text ?? "—",
      entityBValue: cellB?.text ?? "—",
      winner,
    };
  });
}

export function getEditorialAeoOverlay(slug: string): AeoOverlay | null {
  return OVERLAYS[slug] ?? NBA_SEASON_OVERLAYS[slug] ?? null;
}

/**
 * Strengthen speakable Quick Answer + visible FAQ for Copilot-style citation.
 * Scorecard fields are optional. Citation overlays leave the published
 * scorecard in place. Season overlays set `facts` and `rows` only when the
 * live table itself is wrong.
 */
export function applyEditorialAeoOverlay(
  comparison: ComparisonPageData
): ComparisonPageData {
  const overlay = getEditorialAeoOverlay(comparison.slug);
  if (!overlay) return comparison;

  const entities = overlay.entityPatches
    ? comparison.entities.map((entity) => {
        const patch = overlay.entityPatches?.find((item) => entityMatches(entity, item.match));
        if (!patch) return entity;
        return {
          ...entity,
          shortDesc: patch.shortDesc,
          pros: patch.pros,
          cons: patch.cons,
          bestFor: patch.bestFor,
        };
      })
    : comparison.entities;

  return {
    ...comparison,
    title: overlay.title ?? comparison.title,
    shortAnswer: overlay.shortAnswer,
    faqs: overlay.faqs,
    quickAnswer: {
      ...overlay.quickAnswer,
      tldr: overlay.shortAnswer,
    },
    ...(overlay.verdict !== undefined ? { verdict: overlay.verdict } : {}),
    ...(overlay.expertAnalysis !== undefined ? { expertAnalysis: overlay.expertAnalysis } : {}),
    ...(overlay.facts ? { keyDifferences: factsToKeyDifferences(entities, overlay.facts) } : {}),
    ...(overlay.rows ? { attributes: rowsToAttributes(entities, overlay.rows) } : {}),
    ...(overlay.citationStats ? { citationStats: overlay.citationStats } : {}),
    ...(overlay.resources ? { resources: overlay.resources } : {}),
    ...(overlay.relatedComparisons ? { relatedComparisons: overlay.relatedComparisons } : {}),
    entities,
    metadata: {
      ...comparison.metadata,
      ...(overlay.metaTitle ? { metaTitle: overlay.metaTitle } : {}),
      ...(overlay.metaDescription ? { metaDescription: overlay.metaDescription } : {}),
      ...(overlay.updatedAt ? { updatedAt: overlay.updatedAt } : {}),
    },
    ...(overlay.clearSchemaMarkup ? { schemaMarkup: undefined } : {}),
  };
}
