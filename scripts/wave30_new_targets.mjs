#!/usr/bin/env node
/**
 * Wave 30 — Optimize 4 under-linked pos 21-30 pages
 *
 * Targets:
 * - ally-bank-vs-marcus-by-goldman-sachs (pos 23, 8100 vol "marcus hysa") — HIGHEST PRIORITY
 * - hulu-vs-peacock (pos 21, 170 vol "peacock hulu")
 * - us-military-vs-china-military (pos 21-28, ~1300 vol across variants)
 * - bubly-vs-lacroix (pos 24, 210 vol "bubly vs la croix")
 */
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local"), override: true });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();
const log = (...a) => console.log(...a);

// ── helpers ──────────────────────────────────────────────────────────────────

async function addFAQs(slug, newFaqs) {
  const comp = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true, faqs: { select: { question: true } } },
  });
  if (!comp) { log(`  ! skip (not found): ${slug}`); return 0; }
  const existingQs = new Set(comp.faqs.map(f => f.question?.toLowerCase().trim()));
  const toAdd = newFaqs.filter(f => !existingQs.has(f.question?.toLowerCase().trim()));
  if (toAdd.length === 0) { log(`  skip (all FAQs exist): ${slug}`); return 0; }
  await prisma.fAQ.createMany({
    data: toAdd.map(f => ({ question: f.question, answer: f.answer, comparisonId: comp.id, sortOrder: 99 })),
  });
  await prisma.comparison.update({ where: { slug }, data: { lastRefreshedAt: new Date() } });
  log(`  ✅ FAQs +${toAdd.length} (${comp.faqs.length}→${comp.faqs.length + toAdd.length}): ${slug}`);
  return toAdd.length;
}

async function addLinks(linksToAdd) {
  let added = 0;
  for (const link of linksToAdd) {
    const exists = await prisma.internalLink.findFirst({
      where: { fromPath: link.fromPath, toPath: link.toPath }
    });
    if (exists) { log(`  skip dup: ${link.fromPath} → ${link.toPath}`); continue; }
    await prisma.internalLink.create({ data: link });
    log(`  ✅ link: ${link.fromPath.slice(-40)} → ${link.toPath.slice(-40)} [${link.anchorText.slice(0,50)}]`);
    added++;
  }
  return added;
}

// ─────────────────────────────────────────────────────────────────────────────
// TARGET 1: ally-bank-vs-marcus-by-goldman-sachs (pos 23, 8100 vol)
// ─────────────────────────────────────────────────────────────────────────────
log("\n=== T1: ally-bank-vs-marcus-by-goldman-sachs (pos 23, 8100 vol 'marcus hysa') ===");

await addFAQs("ally-bank-vs-marcus-by-goldman-sachs", [
  {
    question: "Does Marcus by Goldman Sachs have a higher APY than Ally Bank in 2026?",
    answer: "Both Marcus and Ally offer competitive HYSA rates. As of 2026, both typically offer APYs above 4%, and Marcus has historically edged out Ally by a small margin. However rates change frequently with Federal Reserve policy — always check current rates directly on each bank's site since the gap is often under 0.10%.",
  },
  {
    question: "Which is safer: Ally Bank or Marcus by Goldman Sachs?",
    answer: "Both are FDIC-insured up to $250,000 per depositor, making both equally safe for deposits up to that limit. Marcus is backed by Goldman Sachs, one of the world's largest investment banks, while Ally is one of the largest online-only banks in the US. Both have strong financial stability ratings.",
  },
  {
    question: "Can I open both an Ally Bank and Marcus savings account?",
    answer: "Yes, you can hold accounts at both simultaneously. Many savers keep accounts at both to take advantage of whichever offers a higher HYSA rate at any given time. There is no restriction on having multiple online savings accounts across different banks.",
  },
  {
    question: "Does Marcus have a mobile app?",
    answer: "Yes, Marcus by Goldman Sachs has a mobile app for iOS and Android. The Marcus app lets you transfer funds, view account balances, and manage your high-yield savings account. Ally Bank's app is also highly rated and includes additional features like mobile check deposit and a spending analysis dashboard.",
  },
  {
    question: "How long does an ACH transfer take from Marcus or Ally?",
    answer: "Both Marcus and Ally typically process ACH transfers in 1-3 business days. Ally offers same-day transfers between Ally accounts and instant transfers from select debit cards. Marcus ACH transfers usually take 2-3 days. Neither offers instant wire transfers for standard savings accounts.",
  },
]);

await addLinks([
  { fromPath: "/compare/usa-vs-china", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally Bank vs Marcus HYSA comparison 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/lebron-vs-jordan", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "best online savings account: Ally vs Marcus by Goldman Sachs", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ww1-vs-ww2", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Marcus by Goldman Sachs vs Ally Bank comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/neymar-vs-mbappe", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally vs Marcus: top HYSA options compared", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/bitcoin-vs-ethereum", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "online bank comparison: Ally Bank vs Marcus", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/netflix-vs-disney-plus", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally Bank vs Marcus savings account review", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/nvidia-vs-amd", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "which HYSA is better: Ally or Marcus", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ali-vs-tyson", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "compare Ally Bank and Marcus savings accounts", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/us-economy-vs-china-economy", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Marcus HYSA vs Ally Bank online savings", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/stock-market-vs-real-estate", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "top high-yield savings: Ally vs Marcus 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/wordpress-vs-wix", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally Bank vs Marcus: best online HYSA 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/canva-vs-photoshop", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Marcus savings vs Ally Bank comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/slack-vs-microsoft-teams", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally vs Marcus: best high-yield savings account", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/marvel-vs-dc", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally Bank vs Marcus by Goldman Sachs HYSA", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/mba-vs-masters", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "compare Ally and Marcus savings rates", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/harvard-vs-stanford", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally Bank vs Marcus: online savings comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/star-wars-vs-star-trek", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Marcus by Goldman Sachs vs Ally savings", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/figma-vs-sketch", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally vs Marcus HYSA: which bank wins", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/capital-one-vs-chase", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "compare Ally Bank and Marcus high-yield savings", linkType: "related", position: "inline", score: 1.2 },
  { fromPath: "/compare/amazon-vs-best-buy", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "Ally Bank vs Marcus savings rate comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ikea-vs-wayfair", toPath: "/compare/ally-bank-vs-marcus-by-goldman-sachs", anchorText: "best HYSA 2026: Ally vs Marcus by Goldman Sachs", linkType: "related", position: "inline", score: 1 },
]);

// ─────────────────────────────────────────────────────────────────────────────
// TARGET 2: hulu-vs-peacock (pos 21, 170 vol "peacock hulu")
// ─────────────────────────────────────────────────────────────────────────────
log("\n=== T2: hulu-vs-peacock (pos 21, 170 vol 'peacock hulu') ===");

// Already has 10 FAQs — only add links
await addLinks([
  { fromPath: "/compare/iphone-17-vs-samsung-s26", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock vs Hulu 2026 streaming comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/usa-vs-china", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock: which streaming service wins", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/lebron-vs-jordan", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock and Hulu compared: pricing and content", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ww1-vs-ww2", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock for sports and live TV", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/mac-vs-windows", toPath: "/compare/hulu-vs-peacock", anchorText: "compare Peacock and Hulu streaming plans", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/neymar-vs-mbappe", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock vs Hulu: best value streaming service", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/android-vs-ios", toPath: "/compare/hulu-vs-peacock", anchorText: "streaming battle: Hulu vs Peacock 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/bitcoin-vs-ethereum", toPath: "/compare/hulu-vs-peacock", anchorText: "which is better Peacock or Hulu", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/netflix-vs-disney-plus", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu and Peacock streaming: complete comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/nvidia-vs-amd", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock vs Hulu 2026: pricing, shows and sports", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ali-vs-tyson", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock for boxing and sports streaming", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/us-economy-vs-china-economy", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock vs Hulu: streaming services compared", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/stock-market-vs-real-estate", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock: best cheap streaming option", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/wordpress-vs-wix", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock or Hulu: which is worth it in 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/canva-vs-photoshop", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock streaming plans 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/slack-vs-microsoft-teams", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock and Hulu: best streaming for office breaks", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/mba-vs-masters", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock: which streaming service is better", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/harvard-vs-stanford", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock vs Hulu: full comparison 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/figma-vs-sketch", toPath: "/compare/hulu-vs-peacock", anchorText: "Hulu vs Peacock for streaming in 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/paramount-plus-vs-peacock", toPath: "/compare/hulu-vs-peacock", anchorText: "compare Hulu and Peacock streaming services", linkType: "related", position: "inline", score: 1.2 },
  { fromPath: "/compare/youtube-music-vs-soundcloud", toPath: "/compare/hulu-vs-peacock", anchorText: "Peacock vs Hulu: entertainment streaming compared", linkType: "related", position: "inline", score: 1 },
]);

// ─────────────────────────────────────────────────────────────────────────────
// TARGET 3: us-military-vs-china-military (pos 21-28, ~1300 vol)
// ─────────────────────────────────────────────────────────────────────────────
log("\n=== T3: us-military-vs-china-military (pos 21-28, ~1300 vol) ===");

await addFAQs("us-military-vs-china-military", [
  {
    question: "How many aircraft carriers does the US have compared to China?",
    answer: "The US Navy operates 11 active nuclear-powered aircraft carriers, the largest fleet in the world. China operates 3 carriers as of 2026, with a 4th under construction. US carriers are significantly larger (100,000+ tons) and carry 60-90 aircraft, while Chinese carriers carry 24-36 aircraft and are conventionally powered.",
  },
  {
    question: "Which country spends more on its military: the US or China?",
    answer: "The United States spends significantly more. The US defense budget for 2026 is approximately $886 billion, while China's official military budget is around $292 billion — though independent estimates suggest actual Chinese defense spending may be 1.5-2× higher due to off-budget items. The US accounts for roughly 40% of global military spending.",
  },
  {
    question: "Does China have more soldiers than the US military?",
    answer: "Yes, China has a larger active-duty force. The People's Liberation Army maintains approximately 2 million active troops vs. 1.3 million for the US. However, the US military compensates with superior technology, global force-projection capability, 800+ overseas bases, and significantly more combat experience from recent conflicts.",
  },
  {
    question: "Who has more stealth fighter jets: the US or China?",
    answer: "The US leads heavily in operational stealth aircraft. The US has 383+ F-22 and F-35 stealth fighters, all combat-ready and battle-tested. China operates approximately 50+ J-20 stealth fighters as of 2026. The US also maintains a large fleet of 4th-gen F-15, F-16, and F/A-18 jets with advanced avionics upgrades.",
  },
  {
    question: "How do US and China nuclear arsenals compare?",
    answer: "The United States has approximately 5,550 nuclear warheads (with ~1,700 deployed on ICBMs, submarines, and bombers). China is estimated to have around 350-500 nuclear warheads as of 2026 but is rapidly expanding its arsenal. Russia leads both with ~6,000 warheads. China is pursuing a nuclear buildup toward an estimated 1,000 warheads by 2030.",
  },
]);

await addLinks([
  { fromPath: "/compare/iphone-17-vs-samsung-s26", toPath: "/compare/us-military-vs-china-military", anchorText: "US military vs China military 2026 comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/lebron-vs-jordan", toPath: "/compare/us-military-vs-china-military", anchorText: "American military vs Chinese military: who is stronger", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/mac-vs-windows", toPath: "/compare/us-military-vs-china-military", anchorText: "US vs China military: defense budget and forces compared", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/neymar-vs-mbappe", toPath: "/compare/us-military-vs-china-military", anchorText: "compare US and China military power", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/android-vs-ios", toPath: "/compare/us-military-vs-china-military", anchorText: "China vs US military strength analysis", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/bitcoin-vs-ethereum", toPath: "/compare/us-military-vs-china-military", anchorText: "who has the stronger military: US or China", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/netflix-vs-disney-plus", toPath: "/compare/us-military-vs-china-military", anchorText: "US military vs PLA comparison 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/nvidia-vs-amd", toPath: "/compare/us-military-vs-china-military", anchorText: "American vs Chinese military forces breakdown", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ali-vs-tyson", toPath: "/compare/us-military-vs-china-military", anchorText: "US military vs Chinese military: comprehensive comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/stock-market-vs-real-estate", toPath: "/compare/us-military-vs-china-military", anchorText: "China vs United States military power comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/wordpress-vs-wix", toPath: "/compare/us-military-vs-china-military", anchorText: "US vs China military budget and strength", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/canva-vs-photoshop", toPath: "/compare/us-military-vs-china-military", anchorText: "compare American and Chinese military forces", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/slack-vs-microsoft-teams", toPath: "/compare/us-military-vs-china-military", anchorText: "China military vs US military 2026 analysis", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/marvel-vs-dc", toPath: "/compare/us-military-vs-china-military", anchorText: "US vs China military: which is more powerful", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/mba-vs-masters", toPath: "/compare/us-military-vs-china-military", anchorText: "American military vs Chinese military comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/harvard-vs-stanford", toPath: "/compare/us-military-vs-china-military", anchorText: "US and China military: full power comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/star-wars-vs-star-trek", toPath: "/compare/us-military-vs-china-military", anchorText: "US military vs China military strength", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/figma-vs-sketch", toPath: "/compare/us-military-vs-china-military", anchorText: "compare US and China military capability", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/us-economy-vs-china-economy", toPath: "/compare/us-military-vs-china-military", anchorText: "US military vs China military power comparison", linkType: "related", position: "inline", score: 1.3 },
  { fromPath: "/compare/f-16-vs-f-15", toPath: "/compare/us-military-vs-china-military", anchorText: "US military vs China military: air power comparison", linkType: "related", position: "inline", score: 1.2 },
  { fromPath: "/compare/lebron-vs-jordan", toPath: "/compare/us-military-vs-china-military", anchorText: "which military is stronger: US or China", linkType: "related", position: "inline", score: 1 },
]);

// ─────────────────────────────────────────────────────────────────────────────
// TARGET 4: bubly-vs-lacroix (pos 24, 210 vol "bubly vs la croix")
// ─────────────────────────────────────────────────────────────────────────────
log("\n=== T4: bubly-vs-lacroix (pos 24, 210 vol 'bubly vs la croix') ===");

await addFAQs("bubly-vs-lacroix", [
  {
    question: "Which sparkling water has stronger flavor: Bubly or LaCroix?",
    answer: "Bubly is generally considered to have a stronger, sweeter flavor profile. Bubly uses brighter, more distinct fruit essences that are easily noticeable. LaCroix's flavors are more subtle and natural-tasting. Most taste comparisons find Bubly's flavors more prominent, though some prefer LaCroix's understated approach. Both are unsweetened with no sugar.",
  },
  {
    question: "Is Bubly or LaCroix healthier?",
    answer: "Both are nearly identical nutritionally: zero calories, zero sugar, zero artificial sweeteners, and no sodium. The only real difference is carbonation level — Bubly tends to have lighter, smaller bubbles while LaCroix has more intense carbonation. Neither is healthier than the other. Both are excellent zero-calorie alternatives to soda.",
  },
  {
    question: "Which is cheaper: Bubly or LaCroix?",
    answer: "LaCroix is generally slightly cheaper. A 12-pack of LaCroix typically costs $5-7 at major retailers, while Bubly runs $6-8. Both are significantly cheaper than premium imported sparkling waters like Perrier or San Pellegrino. Costco and warehouse clubs often have the best prices on both brands.",
  },
  {
    question: "Does Bubly or LaCroix have more flavor varieties?",
    answer: "LaCroix offers 20+ flavors including lemon, lime, grapefruit, passionfruit, and seasonal Cúrate blends. Bubly offers 18+ flavors including cherry, mango, strawberry, watermelon, and peach. LaCroix has a slight edge in variety, but both cover the most popular sparkling water flavors. Both also release limited seasonal varieties.",
  },
  {
    question: "Which brand is more popular: Bubly or LaCroix?",
    answer: "LaCroix pioneered flavored sparkling water in the US and dominated the market through the 2010s. Bubly launched in 2018 backed by PepsiCo's marketing power and celebrity endorsements, quickly gaining significant market share. As of 2026, LaCroix retains the highest overall sparkling water sales volume, but Bubly is the fastest-growing competitor in the premium segment.",
  },
]);

await addLinks([
  { fromPath: "/compare/usa-vs-china", toPath: "/compare/bubly-vs-lacroix", anchorText: "LaCroix vs Bubly sparkling water comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/lebron-vs-jordan", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly vs LaCroix: which sparkling water is better", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ww1-vs-ww2", toPath: "/compare/bubly-vs-lacroix", anchorText: "compare LaCroix and Bubly flavors and price", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/neymar-vs-mbappe", toPath: "/compare/bubly-vs-lacroix", anchorText: "best sparkling water: Bubly vs LaCroix 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/bitcoin-vs-ethereum", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly vs LaCroix taste test and review", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/netflix-vs-disney-plus", toPath: "/compare/bubly-vs-lacroix", anchorText: "which is better: Bubly or LaCroix sparkling water", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/nvidia-vs-amd", toPath: "/compare/bubly-vs-lacroix", anchorText: "LaCroix vs Bubly: the definitive sparkling water comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ali-vs-tyson", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly vs LaCroix: best sparkling water for hydration", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/us-economy-vs-china-economy", toPath: "/compare/bubly-vs-lacroix", anchorText: "compare Bubly and LaCroix sparkling water brands", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/stock-market-vs-real-estate", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly vs LaCroix: which sparkling water wins", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/wordpress-vs-wix", toPath: "/compare/bubly-vs-lacroix", anchorText: "LaCroix vs Bubly comparison 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/canva-vs-photoshop", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly or LaCroix: which flavored water is better", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/slack-vs-microsoft-teams", toPath: "/compare/bubly-vs-lacroix", anchorText: "best office sparkling water: Bubly vs LaCroix", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/marvel-vs-dc", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly vs LaCroix: carbonated water showdown", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/mba-vs-masters", toPath: "/compare/bubly-vs-lacroix", anchorText: "LaCroix vs Bubly sparkling water brands compared", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/harvard-vs-stanford", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly or LaCroix: complete sparkling water comparison", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/star-wars-vs-star-trek", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly vs LaCroix: sparkling water face-off", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/figma-vs-sketch", toPath: "/compare/bubly-vs-lacroix", anchorText: "compare Bubly and LaCroix: which is best", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/capital-one-vs-chase", toPath: "/compare/bubly-vs-lacroix", anchorText: "Bubly vs LaCroix sparkling water comparison 2026", linkType: "related", position: "inline", score: 1 },
  { fromPath: "/compare/ikea-vs-wayfair", toPath: "/compare/bubly-vs-lacroix", anchorText: "LaCroix vs Bubly: best sparkling water brand", linkType: "related", position: "inline", score: 1 },
]);

// Update content scores for pages with new FAQs
log("\n=== Updating content scores ===");
for (const slug of ["us-military-vs-china-military", "bubly-vs-lacroix"]) {
  const page = await prisma.comparison.findFirst({
    where: { slug },
    select: { id: true, faqs: { select: { id: true } }, keyDifferences: true }
  });
  if (!page) continue;
  const faqCount = page.faqs.length;
  const kdCount = Array.isArray(page.keyDifferences) ? page.keyDifferences.length : 0;
  const score = Math.min(100, 50 + Math.min(faqCount, 12) * 3 + Math.min(kdCount, 12) * 2);
  await prisma.comparison.update({ where: { id: page.id }, data: { contentScore: score } });
  log(`  ✅ contentScore updated for ${slug}: ${score} (${faqCount} FAQs, ${kdCount} KDs)`);
}

log("\n✅ Wave 30 complete.");
await prisma.$disconnect();
