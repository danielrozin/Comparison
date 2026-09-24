import type { ComparisonPageData, FAQData, QuickAnswerTLDR } from "@/types";

/**
 * Copilot-first AEO overlays for live compares (ROO-27 GDP pattern).
 *
 * GDP figures come from the live `/compare/us-vs-china-gdp` scorecard/FAQ
 * (fetched 2026-09-21). Japan vs China figures come only from in-repo
 * `mock-data.ts` and `faq-expansion.ts` — do not invent IMF/World Bank
 * totals (including PPP GDP). Messi vs Ronaldo figures come only from
 * in-repo `mock-data.ts` — never invent Ballon d'Or or goal totals.
 * PS5 vs Xbox Series X figures come from the mock `getMockComparison`
 * actually returns: `mock-data-extra.ts` overwrites the same slug in
 * `mock-data.ts`, and the prod short-answer fixture matches that extra
 * text. Printed there (plus merged `faq-expansion.ts`): GPU 12 vs 10.28
 * TFLOPS, SSD 5.5 vs 2.4 GB/s, price $499 tie, qualitative exclusives and
 * backward compatibility, and the named franchises in the FAQ. The
 * shadowed base row’s 825GB/1TB, 50M+/~21M, and Game Pass $15/400+ are
 * not on that scorecard. 4K/120Hz is not printed. Do not use the remotion
 * 12.15 TFLOPS outlier. If a stat is not on that scorecard, say unknown.
 * Figma vs Sketch, Canva vs Photoshop, and ChatGPT vs Gemini figures come
 * only from the object `getMockComparison` returns. All three rows live in
 * `mock-data-extra.ts` (nothing in `mock-data.ts` or `faq-expansion.ts`
 * overwrites them). Canva’s monthly cost is printed twice and the Canva
 * cell disagrees: scorecard Free/$13/mo versus attribute Free / $12.99,
 * both against Photoshop $22.99. Cite both. ChatGPT vs Gemini monthly
 * users are a tie (200M+ vs ~200M). None of the three scorecards names a
 * single winner on every row, so winnerName stays null. If a stat is not
 * on that returned page, say unknown.
 * Cursor vs Copilot, Android vs iOS, and NVIDIA vs AMD figures come only
 * from the object `getMockComparison` returns. Android and NVIDIA live in
 * both `mock-data.ts` and `mock-data-extra.ts`; the extra row wins, the
 * same way PS5 does. Do not cite the shadowed base cells (Android ~27% and
 * US ~44/~56, or NVIDIA RTX 4090 / $300–500 / RX 7800 XT / H100). Cursor
 * has no base row; the extra row is the 10 published key-difference cells,
 * not the contradictory attribute dump or the FAQ that says Copilot is
 * GPT-4o only. None of the three scorecards names a single winner on every
 * row, so winnerName stays null. If a stat is not on that returned page,
 * say unknown.
 * If the pipeline later refreshes a scorecard, keep using that page’s own
 * printed figures in shortAnswer/FAQ.
 */

const GDP_SHORT_ANSWER =
  "By nominal GDP the United States is larger on this page’s scorecard (about $30+ trillion vs about $19 trillion). By PPP, China leads. By GDP per capita the US leads (about $89,000+ vs about $13,500). By 2026 growth, China is faster (about 4.5–5% vs about 2–2.5%). Cite the metric, not a single “bigger economy” winner.";

const GDP_FAQS: FAQData[] = [
  {
    question: "Is China’s economy bigger than the US in 2026?",
    answer:
      "It depends on the measure. On this page’s scorecard the United States leads in nominal GDP (about $30+ trillion vs about $19 trillion). The same page states that China leads on a PPP basis. Per capita, the US leads (about $89,000+ vs about $13,500). There is no single “bigger” without naming the metric.",
  },
  {
    question: "What is US vs China GDP (nominal) in 2026?",
    answer:
      "This page’s scorecard lists US nominal GDP at over $30 trillion and China’s at about $19 trillion. The on-page FAQ also cites 2024 figures of about $28.8 trillion vs $18.5 trillion. Use the dated figure printed on the scorecard or FAQ — do not mix years — and name the source vintage when you cite.",
  },
  {
    question: "What is US vs China GDP (PPP) in 2026?",
    answer:
      "This page does not print a single PPP dollar total in the scorecard. It does state that China ranks first on PPP measures while the US leads nominally. If you need a PPP dollar figure, cite the IMF/World Bank table named in the page sources rather than inventing one here.",
  },
  {
    question: "Why do nominal and PPP rankings disagree?",
    answer:
      "Nominal GDP converts each country’s output at market exchange rates, so a stronger dollar raises the US figure relative to China. PPP adjusts for local prices, so a larger volume of cheaper domestic goods can put China first. This page uses that split: US on nominal, China on PPP. Journalists should say which conversion they mean.",
  },
  {
    question: "What is GDP per capita for the US vs China?",
    answer:
      "This page’s scorecard lists about $89,000+ for the United States and about $13,500 (estimated) for China. The on-page FAQ also gives a 2024-style range of about $85,000–$87,000 vs $13,000–$14,000 nominal, and notes a higher Chinese figure on a PPP basis that is still well below the US. The per-capita gap is the clearest “who is richer per person” framing.",
  },
  {
    question: "Will China overtake the US in nominal GDP this decade?",
    answer:
      "This page’s existing FAQ states that the IMF and World Bank project the US will keep the top nominal ranking through at least 2030, with longer-range catch-up talk in the 2035–2050 window depending on growth, currency, and policy. Treat those as projections printed on the page, not a forecast we independently model.",
  },
  {
    question: "Which GDP measure should journalists and students cite?",
    answer:
      "Cite nominal GDP for market size, trade, and dollar-denominated comparisons. Cite PPP for the volume of domestic output and living-cost-adjusted size. Cite per capita for typical living standards. This page’s Quick Answer is written so you can quote the winner by metric without collapsing those into one rank.",
  },
];

const GDP_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: GDP_SHORT_ANSWER,
  winnerName: null,
  winnerReason: "By metric only: US nominal and per capita; China PPP and 2026 growth.",
  keyFact:
    "Nominal and PPP disagree on this page. Always name the measure when you say which economy is larger.",
};

const JAPAN_CHINA_SHORT_ANSWER =
  "China is larger on this page’s scorecard for total GDP (about $17.7 trillion vs about $4.2 trillion), population (about 1.4 billion vs about 125 million), land area (about 9.6 million km² vs 377,975 km²), and active military personnel (about 2.0 million vs 247,000). Japan leads GDP per capita (about $33,800 vs about $12,500), life expectancy (84.6 vs 78.2 years), and HDI rank (#19 vs #75). Cite the metric; this page does not print a PPP GDP total.";

const JAPAN_CHINA_FAQS: FAQData[] = [
  {
    question: "Is China’s economy bigger than Japan’s?",
    answer:
      "On total GDP, yes. This page’s scorecard lists China’s economy at about $17.7 trillion versus Japan’s about $4.2 trillion, and describes China as the world’s second-largest economy and Japan as the third-largest. Japan still leads GDP per capita (about $33,800 vs about $12,500). There is no single “bigger economy” without naming the metric.",
  },
  {
    question: "What is Japan vs China GDP?",
    answer:
      "This page’s scorecard and FAQ print total GDP of about $4.2 trillion for Japan and about $17.7 trillion for China. Use those printed totals when you cite this page. Do not mix in other years or sources unless you name them.",
  },
  {
    question: "What is Japan vs China GDP (PPP)?",
    answer:
      "Unknown on this page. The in-repo scorecard and FAQ do not print a PPP dollar total for Japan or China. Cite the printed total GDP ($17.7 trillion vs $4.2 trillion) and per capita ($33,800 vs $12,500) instead of inventing a PPP figure.",
  },
  {
    question: "What is GDP per capita for Japan vs China?",
    answer:
      "This page’s scorecard lists about $33,800 for Japan and about $12,500 for China. That per-person gap is the clearest “who is richer per resident” framing even though China’s total GDP is larger.",
  },
  {
    question: "Which country is larger in land area and population?",
    answer:
      "China is larger on both. Land area is about 9.6 million km² versus Japan’s 377,975 km² (China 3rd or 4th largest country; Japan ranks 62nd). Population is about 1.4 billion versus about 125 million.",
  },
  {
    question: "Which country has a stronger military?",
    answer:
      "China has more active personnel on this page’s scorecard (about 2.0 million vs Japan’s 247,000). The same FAQ states China has a larger defense budget and nuclear weapons capability. A dollar defense-budget total is unknown here — do not invent one.",
  },
  {
    question: "Which country has a higher quality of life, and which is safer to visit?",
    answer:
      "Japan leads the printed quality-of-life stats: life expectancy 84.6 vs 78.2 years, HDI rank #19 vs #75. Japan is described as one of the safest countries with extremely low crime rates; China is generally safe for tourists but has higher property crime and more complex travel logistics. Numeric crime-rate figures are unknown on this page.",
  },
];

const JAPAN_CHINA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: JAPAN_CHINA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: China total GDP, population, land area, and military size; Japan per capita, life expectancy, and HDI.",
  keyFact:
    "Total GDP and GDP per capita disagree on this page. Always name the measure when you say which country is “ahead.”",
};

// Scorecard figures from `mock-data.ts` `messi-vs-ronaldo` only:
// Ballon d'Or 8 vs 5; career goals 838 vs 899; assists 369 vs 262;
// World Cup 1 vs 0 (2022); Champions League 4 vs 5; international goals 112 vs 135.
const MESSI_SHORT_ANSWER =
  "On this page’s scorecard Messi leads Ballon d'Or awards (8 vs 5), career assists (369 vs 262), and World Cup titles (1 vs 0). Ronaldo leads career goals (899 vs 838), Champions League titles (5 vs 4), and international goals (135 vs 112). Cite the metric — this page does not name a single GOAT. Stats not printed on the scorecard are unknown; do not invent newer Ballon d'Or or goal totals.";

const MESSI_FAQS: FAQData[] = [
  {
    question: "Who is better, Messi or Ronaldo?",
    answer:
      "This page does not name a single GOAT. On this page’s scorecard Messi leads Ballon d'Or awards (8 vs 5), career assists (369 vs 262), and World Cup titles (1 vs 0). Ronaldo leads career goals (899 vs 838), Champions League titles (5 vs 4), and international goals (135 vs 112). Quote the winner by metric.",
  },
  {
    question: "Who has more Ballon d'Or awards, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Messi with 8 Ballon d'Or awards and Ronaldo with 5. Use those dated figures — do not invent a newer Ballon d'Or total.",
  },
  {
    question: "Who has scored more career goals, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Ronaldo with 899 career goals and Messi with 838. Use those dated figures — do not invent a newer career-goal total.",
  },
  {
    question: "Who won the World Cup, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Messi with 1 World Cup title and Ronaldo with 0. Messi won the 2022 FIFA World Cup with Argentina; Ronaldo has not won the World Cup with Portugal.",
  },
  {
    question: "Who has more Champions League titles, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Ronaldo with 5 Champions League titles and Messi with 4. It does not print Champions League goal totals — treat those as unknown.",
  },
  {
    question: "Who has more career assists, Messi or Ronaldo?",
    answer:
      "This page’s scorecard lists Messi with 369 career assists and Ronaldo with 262. International goals on the same scorecard are 112 (Messi) vs 135 (Ronaldo).",
  },
  {
    question: "Which Messi vs Ronaldo stats does this page not print?",
    answer:
      "This page’s scorecard does not print Champions League goal totals, hat-tricks, or a combined club-trophy count. Treat those as unknown. Ballon d'Or (8 vs 5) and career goals (838 vs 899) are the dated figures already on the scorecard — never invent newer totals.",
  },
];

const MESSI_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: MESSI_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Messi Ballon d'Or, assists, World Cup; Ronaldo goals, Champions League, international goals.",
  keyFact:
    "This page does not name a single GOAT. Always name the metric. Stats missing from the scorecard are unknown.",
};

// Printed on the winning `ps5-vs-xbox-series-x` mock (extra overwrites base)
// and its merged FAQ: GPU 12 vs 10.28 TFLOPS; SSD 5.5 vs 2.4 GB/s; $499 tie.
const PS5_SHORT_ANSWER =
  "On this page’s scorecard the Xbox Series X leads raw GPU power (12 TFLOPS vs 10.28 TFLOPS). The PS5 leads SSD speed (5.5 GB/s vs 2.4 GB/s) and exclusive games. Launch price is a tie at $499 for both. This page does not name a single overall winner. Built-in storage size, 4K/120Hz support, and unit sales are unknown on this page.";

const PS5_FAQS: FAQData[] = [
  {
    question: "Which console is better, PS5 or Xbox Series X?",
    answer:
      "This page does not name a single overall winner. On this page’s scorecard the Xbox Series X leads raw GPU power (12 TFLOPS vs 10.28 TFLOPS). The PS5 leads SSD speed (5.5 GB/s vs 2.4 GB/s) and exclusive games. Launch price is a tie ($499 vs $499). Quote the winner by metric.",
  },
  {
    question: "How much storage does the PS5 have compared with the Xbox Series X?",
    answer:
      "Unknown on this page. This page’s scorecard does not print a built-in storage capacity for the PS5 or the Xbox Series X. Do not invent a gigabyte total.",
  },
  {
    question: "Which has more GPU power, PS5 or Xbox Series X (TFLOPS)?",
    answer:
      "On this page’s scorecard the Xbox Series X has more raw GPU power (12 TFLOPS vs 10.28 TFLOPS). The same page says the PS5 SSD is faster (5.5 GB/s vs 2.4 GB/s) and that multiplatform games perform similarly, so GPU teraflops are not a single power winner.",
  },
  {
    question: "How much do the PS5 and Xbox Series X cost?",
    answer:
      "On this page’s scorecard both consoles list a launch price of $499, marked as a tie. A Game Pass monthly price and a PS Plus monthly price are unknown on this page. The FAQ only says Game Pass includes day-one first-party releases and a larger library for a similar price, and is generally considered the better deal.",
  },
  {
    question: "Which console has better exclusive games, PS5 or Xbox?",
    answer:
      "On this page’s scorecard exclusive games favor the PS5 (labeled superior, versus a growing Xbox library). This page names PS5 franchises God of War, Spider-Man, and Horizon. It names Xbox franchises from Bethesda and Activision acquisitions (Starfield and Call of Duty), and notes many Xbox exclusives also come to PC. An exclusive-game count is unknown on this page — do not invent one.",
  },
  {
    question: "Which console has better backward compatibility, PS5 or Xbox Series X?",
    answer:
      "On this page the Xbox Series X is described as having better backward compatibility, including full backward compatibility in its pros, while the PS5 has fewer backward-compatible titles. A count of compatible games is unknown on this page — do not invent one.",
  },
  {
    question: "Do the PS5 and Xbox Series X support 4K at 120Hz?",
    answer:
      "Unknown on this page. This page does not print 4K resolution or 120Hz refresh-rate support for the PS5 or the Xbox Series X. Do not invent a frame-rate or resolution spec.",
  },
  {
    question: "Which should you buy, a PS5 or an Xbox Series X?",
    answer:
      "On this page’s verdict, choose a PS5 for exclusive games. The scorecard also gives the PS5 the faster SSD (5.5 GB/s vs 2.4 GB/s), plus DualSense haptics and PSVR2 support. Choose an Xbox Series X for Game Pass value or backward compatibility, which is what this page’s verdict names. The Xbox cons note that its controller lacks haptics. There is still no single overall winner.",
  },
];

const PS5_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: PS5_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Xbox GPU TFLOPS and Game Pass value; PS5 SSD speed and exclusives; launch price is a tie.",
  keyFact:
    "This page does not name a single console winner. Cite GPU, SSD, exclusives, subscription value, or price. Storage size and 4K/120Hz are unknown here.",
};

// Printed by getMockComparison("figma-vs-sketch") — extra row only.
// Market share ~80% vs ~15%; active designers 4M+ vs ~1M; price
// Free / $12+/mo vs $9/mo or $99/yr (Sketch). Free tier: 3 projects.
const FIGMA_SHORT_ANSWER =
  "On this page’s scorecard Figma leads platform access (Any (browser) versus Mac only) and real-time collaboration (excellent vs limited). Figma’s market share is higher (~80% of designers vs ~15% of designers), and Figma lists more active designers (4M+ vs ~1M). Sketch leads offline use (full vs limited). The price row marks Sketch the winner (Free / $12+/mo vs $9/mo or $99/yr). This page’s verdict says Figma has won the UI design market, but the scorecard does not name a single winner on every row. A plugin count and a separate one-time Sketch license price are unknown on this page.";

const FIGMA_FAQS: FAQData[] = [
  {
    question: "Which is better, Figma or Sketch?",
    answer:
      "This page does not name a single scorecard winner. Figma leads platform access (Mac, Windows, Linux, and browser versus Mac only) and real-time collaboration (excellent vs limited). Figma’s market share is higher (~80% of designers vs ~15% of designers), and Figma lists more active designers (4M+ vs ~1M). Sketch leads offline use (full vs limited). The price row marks Sketch the winner (Free / $12+/mo vs $9/mo or $99/yr). This page’s verdict says Figma has won the UI design market. Quote the metric.",
  },
  {
    question: "What is Figma vs Sketch market share?",
    answer:
      "On this page’s scorecard market share is ~80% of designers for Figma versus ~15% of designers for Sketch. Figma’s share is higher (~80% of designers vs ~15% of designers). The active-designers attribute is 4M+ versus ~1M, and Figma lists more active designers (4M+ vs ~1M).",
  },
  {
    question: "Does Figma work on Windows, and does Sketch?",
    answer:
      "On this page Figma’s platform support is Mac, Windows, Linux, and Browser. Sketch is Mac only. The scorecard platform row is Any (browser) for Figma versus Mac only for Sketch, marked as a Figma win.",
  },
  {
    question: "Which has better real-time collaboration, Figma or Sketch?",
    answer:
      "On this page’s scorecard real-time collaboration is excellent for Figma and limited for Sketch, marked as a Figma win. Figma’s pros name real-time collaboration. Sketch’s cons say real-time collaboration is limited. A numeric collaboration score is unknown on this page.",
  },
  {
    question: "How much do Figma and Sketch cost?",
    answer:
      "On this page’s scorecard the price row is Free / $12+/mo for Figma versus $9/mo or $99/yr for Sketch, and it marks Sketch the winner. The on-page FAQ says Figma’s free tier allows 3 projects and unlimited personal files, and teams need the $12+/user/month plan. Sketch’s cons repeat $9/month or $99/year. Sketch’s pros mention a one-time license option, but a separate one-time dollar price is unknown on this page.",
  },
  {
    question: "Can you use Figma or Sketch offline?",
    answer:
      "On this page’s scorecard offline use is limited for Figma and full for Sketch, marked as a Sketch win. Figma’s cons say it requires an internet connection. Sketch’s pros say it is offline capable. An offline-file limit is unknown on this page.",
  },
  {
    question: "Is Figma free?",
    answer:
      "Yes, on this page’s FAQ. The free tier allows 3 projects and unlimited personal files. Teams need the $12+/user/month plan. The scorecard price cell is Free / $12+/mo versus Sketch at $9/mo or $99/yr.",
  },
  {
    question: "Which Figma vs Sketch figures does this page not print?",
    answer:
      "Unknown on this page: a plugin count for either tool, a Sketch one-time license dollar amount other than the printed $9/mo or $99/yr, and any dollar figure for the Adobe acquisition (the cons only say the deal was blocked). Do not invent those.",
  },
];

const FIGMA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: FIGMA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Figma platform, collaboration, market share, and active designers; Sketch offline use and the price row. The verdict says Figma won the UI design market.",
  keyFact:
    "No single scorecard winner. Market share is higher for Figma (~80% of designers vs ~15% of designers). The price row marks Sketch the winner (Free / $12+/mo vs $9/mo or $99/yr).",
};

// Printed by getMockComparison("canva-vs-photoshop") — extra row only.
// Scorecard cost Free/$13/mo vs $22.99/mo. Attribute cost Free / $12.99 vs $22.99.
// Users 170M+ registered vs ~30M paid subscribers.
const CANVA_SHORT_ANSWER =
  "On this page’s scorecard Canva leads the learning curve (minimal vs steep) and the template library (massive vs none built-in). Photoshop leads professional features (advanced vs basic) and photo retouching (professional vs basic). File format support prints as limited versus comprehensive. Canva’s users figure is larger (170M+ registered vs ~30M paid subscribers), and those labels are not the same kind of count. Canva’s scorecard monthly cost is lower (Free/$13/mo vs $22.99/mo). The attribute row is also lower for Canva (Free / $12.99 vs $22.99). This page does not name a single overall winner. An exact template count is unknown on this page.";

const CANVA_FAQS: FAQData[] = [
  {
    question: "Which is better, Canva or Photoshop?",
    answer:
      "This page does not name a single overall winner. On this page’s scorecard Canva leads the learning curve (minimal vs steep) and the template library (massive vs none built-in). Photoshop leads professional features (advanced vs basic) and photo retouching (professional vs basic). The verdict assigns Canva to quick social graphics and non-designers, and Photoshop to professional photo editing. Quote the metric.",
  },
  {
    question: "How much do Canva and Photoshop cost?",
    answer:
      "On this page’s scorecard monthly cost is Free/$13/mo for Canva versus $22.99/mo for Photoshop, marked as a Canva win. Canva’s scorecard monthly cost is lower (Free/$13/mo vs $22.99/mo). The attribute row prints a different Canva figure, Free / $12.99, against the same Photoshop price of $22.99. The attribute row is also lower for Canva (Free / $12.99 vs $22.99). Photoshop’s cons also say $22.99/month. Do not collapse Free/$13/mo and Free / $12.99 into one price.",
  },
  {
    question: "Is Canva replacing Photoshop?",
    answer:
      "No, on this page’s FAQ. They serve different audiences. Canva covers simple design tasks for non-professionals. Photoshop remains the tool this page calls irreplaceable for professional photography and advanced design.",
  },
  {
    question: "Who has more users, Canva or Photoshop?",
    answer:
      "On this page’s users attribute Canva is 170M+ registered and Photoshop is ~30M paid subscribers, marked as a Canva win. Canva’s users figure is larger (170M+ registered vs ~30M paid subscribers). Registered users and paid subscribers are not the same kind of count. A like-for-like paid-user total is unknown on this page.",
  },
  {
    question: "Which is easier to learn, Canva or Photoshop?",
    answer:
      "On this page’s scorecard the learning curve is minimal for Canva and steep for Photoshop, marked as a Canva win. Canva’s pros say no design skills are required. Photoshop’s cons name a steep learning curve.",
  },
  {
    question: "Which is better for photo retouching and templates?",
    answer:
      "On this page’s scorecard photo retouching is basic for Canva and professional for Photoshop. The template library is Massive for Canva and None built-in for Photoshop. The short answer says Canva has thousands of templates. An exact template count is unknown on this page. File format support prints as Limited for Canva and Comprehensive for Photoshop.",
  },
  {
    question: "Can Canva be used professionally?",
    answer:
      "On this page’s FAQ, yes for marketing materials, social media, and presentations, and no for professional photo retouching or complex design work. Canva’s best-for line is social media graphics, presentations, and non-designers. Photoshop’s best-for line is professional photographers, designers, and retouchers.",
  },
  {
    question: "Which Canva vs Photoshop figures does this page not print?",
    answer:
      "Unknown on this page: an exact template count (only “thousands” and “massive”), a like-for-like paid-subscriber total, and any Photoshop price other than $22.99/month. The two Canva prices that are printed, Free/$13/mo and Free / $12.99, should both be cited. Do not invent a third price.",
  },
];

const CANVA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CANVA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Canva ease, templates, monthly cost, and the users row; Photoshop professional features, photo retouching, and file formats.",
  keyFact:
    "Monthly cost is printed twice and the Canva cells do not match: Free/$13/mo on the scorecard and Free / $12.99 on the attribute row, both against Photoshop at $22.99. Do not collapse those Canva prices into one number.",
};

// Printed by getMockComparison("chatgpt-vs-gemini") — extra row only.
// Users tie 200M+ vs ~200M. Real-time search Paid ($20+/mo) vs Free.
// Gemini Advanced FAQ price $19.99/month. Free tier GPT-3.5 vs Gemini 1.5 Pro.
const CHATGPT_SHORT_ANSWER =
  "On this page’s scorecard monthly users are a tie (200M+ vs ~200M), with Gemini also described as ~200M (growing). ChatGPT leads the plugin ecosystem (largest vs growing) and image generation (DALL-E 3 built-in vs Imagen (limited)). Gemini leads real-time search (free vs paid only) and Google integration (deep vs none). The free-tier attribute prints GPT-3.5 (basic) for ChatGPT and Gemini 1.5 Pro (strong) for Gemini. ChatGPT real-time web search is priced at $20+/mo on that attribute row. The on-page FAQ prices Gemini Advanced at $19.99/month. This page does not name a single overall winner. Context-window sizes and benchmark scores are unknown on this page.";

const CHATGPT_FAQS: FAQData[] = [
  {
    question: "Which AI is better, ChatGPT or Gemini?",
    answer:
      "This page does not name a single overall winner. The on-page FAQ says ChatGPT (GPT-4o) and Gemini Ultra are broadly comparable. On this page’s scorecard ChatGPT leads plugins (largest vs growing) and image generation (DALL-E 3 built-in vs Imagen (limited)). Gemini leads real-time search (free vs paid only) and Google integration (deep vs none). Monthly users are a tie (200M+ vs ~200M). Quote the metric.",
  },
  {
    question: "Who has more monthly users, ChatGPT or Gemini?",
    answer:
      "Neither, on this page. The scorecard monthly-users row is a tie: 200M+ for ChatGPT versus ~200M (growing) for Gemini. The attribute row prints 200M+ versus ~200M. Monthly users are a tie (200M+ vs ~200M). Do not treat that tie as a win for either side.",
  },
  {
    question: "Which has free real-time web search, ChatGPT or Gemini?",
    answer:
      "On this page’s scorecard real-time search is paid only for ChatGPT and free, via Google integration, for Gemini. The attribute row prints Paid ($20+/mo) for ChatGPT and Free for Gemini. ChatGPT’s cons say there is no real-time web search on the free tier.",
  },
  {
    question: "What does the free tier include on this page?",
    answer:
      "On this page’s free-tier attribute, ChatGPT is GPT-3.5 (basic) and Gemini is Gemini 1.5 Pro (strong). The on-page FAQ says Gemini’s base version with Gemini 1.5 Pro is free. ChatGPT’s cons say the best models are on a paid tier. A context-window size for either free tier is unknown on this page.",
  },
  {
    question: "How much do ChatGPT and Gemini cost on this page?",
    answer:
      "On this page the attribute row prices ChatGPT real-time web search at $20+/mo. The on-page FAQ says Gemini Advanced, with the most powerful model, requires a Google One subscription at $19.99/month. Those are different products. A ChatGPT Plus plan name is not printed on this page. Do not invent another price.",
  },
  {
    question: "Which is better for images, plugins, and Google integration?",
    answer:
      "On this page’s scorecard image generation favors ChatGPT (DALL-E 3 built-in vs Imagen (limited)) and the plugin ecosystem favors ChatGPT (largest vs growing). Google integration favors Gemini (deep vs none). The short answer also names Gemini’s integration with Google Search, Gmail, and Workspace. An image-count limit and a plugin count are unknown on this page.",
  },
  {
    question: "Is Gemini free?",
    answer:
      "Yes for the base version, on this page’s FAQ: Gemini 1.5 Pro is free. Gemini Advanced requires a Google One subscription at $19.99/month. The scorecard says Gemini real-time search is free, while ChatGPT’s is paid only at $20+/mo.",
  },
  {
    question: "Which ChatGPT vs Gemini stats does this page not print?",
    answer:
      "Unknown on this page: context-window token counts, benchmark scores, and parameter counts. The verdict names ChatGPT for coding and the pros say strong coding (GPT-4o), but no numeric coding score is printed for ChatGPT or Gemini. Do not invent a token limit or a benchmark.",
  },
];

const CHATGPT_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CHATGPT_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: ChatGPT plugins and image generation; Gemini real-time search and Google integration; monthly users are a tie. The verdict also names ChatGPT for coding, with no coding score printed for Gemini.",
  keyFact:
    "Monthly users are a tie (200M+ vs ~200M). Do not crown a user-count winner. Context windows and benchmark scores are unknown on this page.",
};

// Printed by getMockComparison("cursor-vs-copilot") — extra row only.
// Pricing: Cursor Pro $20/mo (~$192/yr), Business $40/user/mo vs Copilot
// Pro $10/mo ($100/yr), Pro+ $39/mo, Business $19/user/mo, Enterprise $39/user/mo.
// Agentic + indexing favor Cursor. IDE, GitHub, enterprise, onboarding favor Copilot.
// Models and inline autocomplete are ties. No single overall winner.
const CURSOR_SHORT_ANSWER =
  "On this page’s scorecard GitHub Copilot leads pricing. Cursor Pro is higher ($20/mo vs $10/mo), the annual figure is higher (roughly $192/yr vs $100/yr), and Business is higher ($40/user/mo vs $19/user/mo). Copilot also prints Pro+ at $39/mo and Enterprise at $39/user/mo. A Cursor Pro+ price and a Cursor Enterprise dollar price are not on that row. Cursor leads agentic capabilities and codebase indexing. Copilot leads the IDE model (a VS Code fork versus a plugin) and GitHub integration. Underlying models and inline autocomplete are ties. This page does not name a single overall winner. Context-window sizes, user counts, benchmark scores, and model version numbers are unknown on this scorecard.";

const CURSOR_FAQS: FAQData[] = [
  {
    question: "Which is better, Cursor or GitHub Copilot?",
    answer:
      "This page does not name a single overall winner. On this page’s scorecard GitHub Copilot leads pricing: Cursor Pro is higher ($20/mo vs $10/mo). Cursor leads agentic capabilities (Composer plan-execute-verify versus Copilot’s agent mode, Workspace, and issue-to-PR agent) and codebase indexing. Copilot leads the IDE model and GitHub integration. Underlying models and inline autocomplete are ties. Quote the metric.",
  },
  {
    question: "How much do Cursor and GitHub Copilot cost?",
    answer:
      "On this page’s scorecard Cursor Pro is $20/mo (or roughly $192/yr billed annually) and Business is $40/user/mo. GitHub Copilot Pro is $10/mo (or $100/yr — two months free annually), Pro+ is $39/mo, Business is $19/user/mo, and Enterprise is $39/user/mo. Cursor Pro is higher ($20/mo vs $10/mo). Business is higher ($40/user/mo vs $19/user/mo). The annual figure is higher (roughly $192/yr vs $100/yr). Cursor also has a limited free Hobby tier. Copilot has a free tier and is fully free for verified students, teachers, and maintainers. A Hobby completion count and a Cursor Enterprise dollar price are unknown on this row.",
  },
  {
    question: "Which has better agentic and multi-file editing, Cursor or Copilot?",
    answer:
      "On this page’s scorecard agentic capabilities favor Cursor. Composer (Agent mode) runs a plan-execute-verify loop across files, terminal commands, and tests. Copilot has an in-editor agent, Copilot Workspace, and an issue-to-PR coding agent, and the same page says that tight in-editor loop trails Composer. The multi-file refactor row also favors Cursor. A numeric agent score is unknown on this page.",
  },
  {
    question: "Which works in more editors, Cursor or GitHub Copilot?",
    answer:
      "On this page’s scorecard the IDE row favors GitHub Copilot. Cursor is a standalone editor, a fork of VS Code. Copilot is a plugin for VS Code, Visual Studio, the JetBrains suite, Neovim, Xcode, Eclipse, and more. An IDE count is unknown on this page — do not invent one.",
  },
  {
    question: "Which has better GitHub integration and enterprise controls?",
    answer:
      "On this page’s scorecard GitHub and PR integration favors Copilot (PR summaries, issue-to-PR agent, GitHub CLI, and GitHub.com). Enterprise and security also favors Copilot (org policy, SSO, audit logs, content exclusion, data residency, and IP indemnification). Cursor’s enterprise cell names SSO/SAML, a privacy mode, and SOC 2 compliance, and says its certifications are less extensive. A Cursor Enterprise dollar price is unknown on this page.",
  },
  {
    question: "Do Cursor and Copilot both offer Claude, GPT, and Gemini?",
    answer:
      "Yes, on this page’s scorecard, and the underlying-models row is a tie. Cursor switches among Anthropic Claude (Sonnet/Opus class), OpenAI GPT models, Google Gemini, and its own fast models. Copilot’s chat and agent picker offers Claude, GPT, and Gemini families, while inline autocomplete still defaults to GitHub’s OpenAI-based completion engine. Model version numbers and context-window sizes are unknown on this scorecard.",
  },
  {
    question: "Which is better for inline autocomplete and onboarding?",
    answer:
      "On this page’s scorecard inline autocomplete is a tie: Cursor Tab predicts the next edit, and Copilot’s ghost text is described as effectively a tie for ordinary single-file work. Onboarding favors Copilot (one extension in the IDE you already use). Cursor’s onboarding cell calls an individual setup a five-minute setup because you install a new application. A latency number is unknown on this page.",
  },
  {
    question: "Which Cursor vs Copilot figures does this page not print?",
    answer:
      "Unknown on this scorecard: context-window token counts, user or subscriber totals, benchmark or accuracy scores, a Hobby completion quota, an IDE count, and a Cursor Enterprise dollar price. The pricing row does print Copilot Enterprise at $39/user/mo and Pro+ at $39/mo. Do not invent a model version or a user count.",
  },
];

const CURSOR_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: CURSOR_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Copilot price, IDE coverage, GitHub integration, enterprise controls, and onboarding; Cursor agentic editing and repo indexing; models and inline autocomplete are ties.",
  keyFact:
    "No single scorecard winner. Cursor Pro is higher ($20/mo vs $10/mo). Context windows, user counts, and model version numbers are unknown on this scorecard.",
};

// Printed by getMockComparison("android-vs-ios") — extra row overwrites base.
// Market share 72% vs 28%. Updates 2-3 years vs 5-6 years.
// Customization Extensive vs Limited. Privacy Good vs Excellent.
// Shadowed base cells (~27%, US ~44/~56, 2x app revenue, 2-4 years) are not here.
const ANDROID_SHORT_ANSWER =
  "On this page’s scorecard Android leads global market share (72% vs 28%) and customization (Extensive vs Limited). iOS leads software updates (2-3 years vs 5-6 years) and privacy (Good vs Excellent). This page’s verdict assigns Android to freedom and choice, and iOS to privacy, polish, and ecosystem integration. It does not name a single overall winner. US market share, an app-revenue multiple, and an exact app count are unknown on this page.";

const ANDROID_FAQS: FAQData[] = [
  {
    question: "Which is better, Android or iOS?",
    answer:
      "This page does not name a single overall winner. On this page’s scorecard Android leads global market share (72% vs 28%) and customization (Extensive vs Limited). iOS leads software updates (2-3 years vs 5-6 years) and privacy (Good vs Excellent). The verdict says both are excellent mobile platforms. Quote the metric.",
  },
  {
    question: "What is Android vs iOS global market share?",
    answer:
      "On this page’s scorecard global market share is 72% for Android versus 28% for iOS, marked as an Android win. Android’s share is higher (72% vs 28%). The same 72% and 28% are repeated on the attribute row and in Android’s description (runs on 72% of smartphones). A US market-share split is unknown on this page.",
  },
  {
    question: "Which gets software updates longer, Android or iOS?",
    answer:
      "On this page’s scorecard the software-updates row favors iOS (2-3 years vs 5-6 years). The attribute row prints average update support as 2-3 versus 5-6 years. iOS’s pros repeat 5-6 years of updates. Android’s cons say updates are fragmented. An Android update range other than 2-3 years is not on this page.",
  },
  {
    question: "Which is more private and secure, Android or iOS?",
    answer:
      "On this page’s scorecard privacy favors iOS (Good vs Excellent). The on-page FAQ says iOS is generally considered more secure because of Apple’s walled garden, mandatory app review, and longer update support. Android’s cons say more malware. A numeric security score is unknown on this page.",
  },
  {
    question: "Which is more customizable, Android or iOS?",
    answer:
      "On this page’s scorecard customization favors Android (Extensive vs Limited). Android’s pros say full customization and sideloading. iOS’s cons say limited customization and no sideloading. A customization score is unknown on this page.",
  },
  {
    question: "Can you sideload apps, and can you switch from Android to iPhone?",
    answer:
      "On this page Android allows sideloading and iOS does not (iOS’s cons say no sideloading). The on-page FAQ says Apple’s Move to iOS app transfers contacts, messages, photos, and apps, and that you may need to repurchase apps. An exact app count is unknown — the FAQ only says both platforms have millions of apps.",
  },
  {
    question: "Which Android vs iOS figures does this page not print?",
    answer:
      "Unknown on this page: a US market-share split, an app-revenue multiple, an exact app-store count, and a numeric security score. Global share on this page is 72% vs 28%, and update support is 2-3 years vs 5-6 years. Do not invent the missing figures.",
  },
];

const ANDROID_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: ANDROID_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: Android market share and customization; iOS software updates and privacy. The verdict says both are excellent.",
  keyFact:
    "No single scorecard winner. Android’s global share is higher (72% vs 28%). US market share is unknown on this page.",
};

// Printed by getMockComparison("nvidia-vs-amd") — extra row overwrites base.
// Market cap $2.5T+ vs $250B, also $2.5 Trillion vs $250 Billion, and a
// separate NVIDIA description figure of $2T+. Discrete share 80% vs 20%.
// Shadowed base cells (RTX 4090, $300-500, RX 7800 XT, H100/A100/MI300X) are not here.
const NVIDIA_SHORT_ANSWER =
  "On this page’s scorecard NVIDIA leads AI compute (Dominant vs Growing) and market cap ($2.5T+ vs $250B). The attribute row prints that market cap again as $2.5 Trillion vs $250 Billion. NVIDIA’s description also prints a separate $2T+ market cap. Do not collapse $2T+ and $2.5T+ into one figure. AMD leads value for money (Premium vs Excellent) and the CPU market (None vs Leading). Discrete GPU market share is higher for NVIDIA (80% vs 20%). This page does not name a single overall winner. A ray-tracing score, a flagship GPU name, and a mid-range dollar price are unknown on this page.";

const NVIDIA_FAQS: FAQData[] = [
  {
    question: "Which is better, NVIDIA or AMD?",
    answer:
      "This page does not name a single overall winner. On this page’s scorecard NVIDIA leads AI compute (Dominant vs Growing) and market cap ($2.5T+ vs $250B). AMD leads value for money (Premium vs Excellent) and the CPU market (None vs Leading). The verdict assigns NVIDIA to top-tier performance and AI, and AMD to value and a CPU plus GPU combo. Quote the metric.",
  },
  {
    question: "What is NVIDIA vs AMD discrete GPU market share?",
    answer:
      "On this page’s attribute row discrete GPU market share is 80% for NVIDIA versus 20% for AMD, marked as an NVIDIA win. NVIDIA’s share is higher (80% vs 20%). Those cells do not use a tilde. A separate gaming-only share is unknown on this page.",
  },
  {
    question: "Which has the larger market cap, NVIDIA or AMD?",
    answer:
      "NVIDIA, on this page. The scorecard market-cap row is $2.5T+ versus $250B. The attribute row prints $2.5 Trillion versus $250 Billion. NVIDIA’s description also says $2T+ market cap. NVIDIA’s market cap is larger ($2.5T+ vs $250B). Do not collapse $2T+ and $2.5T+ into one figure.",
  },
  {
    question: "Which is better for AI, NVIDIA or AMD?",
    answer:
      "On this page’s scorecard AI compute favors NVIDIA (Dominant vs Growing). The on-page FAQ says NVIDIA dominates AI workloads because of CUDA, and that AMD’s ROCm is improving but has much less ecosystem support. A benchmark score and a named accelerator chip are unknown on this page.",
  },
  {
    question: "Which is better for gaming value, and who makes CPUs?",
    answer:
      "On this page’s scorecard value for money favors AMD (Premium vs Excellent). The CPU-market row is None for NVIDIA versus Leading for AMD, so AMD leads CPUs. The FAQ says NVIDIA generally has the fastest GPUs, while AMD offers better value, and that NVIDIA leads high-end gaming with better ray tracing and DLSS while AMD is stronger at mid-range rasterization. A flagship model name and a mid-range dollar price are unknown on this page.",
  },
  {
    question: "What is DLSS vs FSR on this page?",
    answer:
      "On this page’s FAQ, DLSS (NVIDIA) and FSR (AMD) are AI upscaling technologies that boost frame rates. DLSS uses dedicated AI hardware (Tensor cores). FSR works on any GPU, with slightly lower quality at equivalent settings. NVIDIA’s pros name DLSS ray tracing. AMD’s pros name FSR as an open standard. A frame-rate number is unknown on this page.",
  },
  {
    question: "Which NVIDIA vs AMD figures does this page not print?",
    answer:
      "Unknown on this page: a ray-tracing score, a flagship GPU model name, a mid-range street price, and a named data-center accelerator. What is printed: discrete share 80% vs 20%, market cap $2.5T+ vs $250B (and $2.5 Trillion vs $250 Billion), plus a separate NVIDIA description figure of $2T+. Do not invent the missing specs.",
  },
];

const NVIDIA_QUICK_ANSWER: QuickAnswerTLDR = {
  tldr: NVIDIA_SHORT_ANSWER,
  winnerName: null,
  winnerReason:
    "By metric only: NVIDIA AI compute, market cap, and discrete GPU share; AMD value for money and CPUs. The verdict splits the same way.",
  keyFact:
    "Market cap is printed more than once. The scorecard is $2.5T+ vs $250B, the attribute row is $2.5 Trillion vs $250 Billion, and the NVIDIA description also says $2T+. Do not collapse those.",
};

type AeoOverlay = {
  shortAnswer: string;
  faqs: FAQData[];
  quickAnswer: QuickAnswerTLDR;
};

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
};

export function getEditorialAeoOverlay(slug: string): AeoOverlay | null {
  return OVERLAYS[slug] ?? null;
}

/**
 * Strengthen speakable Quick Answer + visible FAQ for Copilot-style citation
 * without replacing the published scorecard or inventing new totals.
 */
export function applyEditorialAeoOverlay(
  comparison: ComparisonPageData
): ComparisonPageData {
  const overlay = OVERLAYS[comparison.slug];
  if (!overlay) return comparison;

  return {
    ...comparison,
    shortAnswer: overlay.shortAnswer,
    faqs: overlay.faqs,
    quickAnswer: {
      ...overlay.quickAnswer,
      tldr: overlay.shortAnswer,
    },
  };
}
