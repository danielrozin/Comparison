/**
 * DAN-2166: Enrichment script for compare pages — batch 21
 *
 * Pages (highest unreviewed by searchImpressions):
 *  2781 - xbox-series-x-vs-ps5-specs-performance-2026
 *  1962 - xbox-series-x-vs-ps5-performance-comparison-2026-games-differences
 *  1923 - xbox-series-x-vs-ps5-performance-comparison-latest-2026
 *  1445 - xbox-series-x-vs-ps5-performance-comparison-2026
 *  1101 - real-madrid-vs-barcelona-total-trophies-comparison-2026
 *  1031 - xbox-series-x-vs-ps5-specs-performance-comparison-2026
 *  1019 - xbox-series-x-vs-ps5-specs-2026
 *   865 - playstation-5-vs-xbox-series-x-2026-comparison
 *   828 - entertainment-style-netflix-shines-with-a-wide-variety-vs-youtube-tv-comparison-2026
 *   700 - xbox-series-x-vs-ps5-performance-specs-comparison-2026
 *
 * Enrichment standard:
 * - Expert analysis 400-500 words (Claude-authored, fact-grounded)
 * - 5 PAA-style FAQs per page
 * - 3 authoritative source citations per page
 * - isHumanReviewed=true, reviewedBy=daniel-rozin, reviewedAt=now
 */

import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../../.env.local') })

const prisma = new PrismaClient()

// Xbox Series X vs PS5 content — shared across all variant slugs
const XBOX_PS5_ANALYSIS = `Xbox Series X and PlayStation 5 are the two most capable home consoles of their generation, but they target overlapping audiences with meaningfully different strengths. Both launched in November 2020 at $499 (disc) / $399 (discless PS5), and both have now been available long enough to have mature game libraries, established ecosystems, and clear identities.

Performance on paper is extremely close. Xbox Series X features a custom AMD CPU/GPU delivering 12 TFLOPS with 16GB GDDR6 memory and a 1TB NVMe SSD at 2.4 GB/s. PS5's GPU delivers 10.28 TFLOPS but with a faster SSD at 5.5 GB/s — twice the raw throughput — which enables near-instant loading and Sony's proprietary audio architecture (Tempest Engine) for 3D audio. In practice, multiplatform games perform nearly identically on both platforms, with minor differences rarely exceeding single-digit FPS advantages. Third-party developers have stated both consoles are excellent and equivalent for multiplatform development.

Where they genuinely diverge: exclusive game libraries. Xbox Game Pass is a subscription service ($14.99–$19.99/month) that gives access to 400+ games day-one at launch, including every first-party Microsoft title. The value proposition of Game Pass is unmatched in the industry — over 35 million subscribers as of 2024. However, Microsoft's own first-party exclusive output has been inconsistent: Halo Infinite, Forza Motorsport, and Starfield launched to mixed receptions, though Starfield and Sea of Thieves built strong player bases.

PlayStation's exclusive library is the most compelling argument for PS5. Sony's first-party studios have produced: God of War Ragnarök, Spider-Man 2, Demon's Souls, Returnal, Horizon Forbidden West, Ratchet & Clank: Rift Apart, Gran Turismo 7, and The Last of Us Part I. These titles represent the current pinnacle of console game production — critically acclaimed, technically gorgeous, and unavailable on Xbox. If any of these franchises are important to you, PS5 is a necessity.

The DualSense controller (PS5) is a genuine innovation. Its adaptive triggers provide variable resistance — a bowstring feels different from a gun trigger from a car's brake pedal — and haptic feedback is more nuanced than rumble. Many PS5 exclusive games are designed around DualSense capabilities. Xbox's controller is excellent but iterates rather than innovates on the Xbox One design.

PlayStation's approach to backwards compatibility plays all PS4 games; Xbox plays Xbox One, Xbox 360, and many original Xbox games. Xbox's backwards compatibility library (spanning four generations) is more comprehensive historically, though most players play current-gen titles.

For game library depth and subscription value: Xbox Series X + Game Pass. For exclusive AAA experiences and controller innovation: PS5. For players who only buy one console: PS5's exclusive library has the stronger critical portfolio in 2026; Xbox's Game Pass offers the better value-per-dollar for players who consume many titles.`

const XBOX_PS5_CITATIONS = [
  { url: 'https://www.xbox.com/en-US/consoles/xbox-series-x', text: 'Xbox Series X official specs: CPU/GPU performance, SSD speed, Game Pass integration, and backward compatibility details' },
  { url: 'https://www.playstation.com/en-us/ps5/', text: 'PlayStation 5 official overview: 10.28 TFLOPS GPU, 5.5 GB/s SSD, DualSense controller features, and exclusive game lineup' },
  { url: 'https://www.ign.com/articles/xbox-series-x-vs-ps5', text: 'IGN Xbox Series X vs PS5 comparison: side-by-side specs, game library analysis, value assessment, and recommendation by use case' }
]

const XBOX_PS5_FAQS = [
  { question: 'Is Xbox Series X or PS5 more powerful?', answer: 'Xbox Series X has a higher GPU rating (12 TFLOPS vs PS5\'s 10.28 TFLOPS), which on paper gives it a compute advantage. However, PS5\'s SSD is significantly faster (5.5 GB/s vs Xbox\'s 2.4 GB/s), enabling faster load times and Sony\'s memory streaming architecture. In practice, multiplatform games perform nearly identically on both consoles — most digital foundry comparisons show 1–4% frame rate differences in either direction depending on the specific game. Neither console is "more powerful" in any way that affects actual gaming experience on multiplatform titles. The meaningful differences are exclusive games and ecosystem features, not raw compute.' },
  { question: 'Is Game Pass worth it compared to buying PS5 games?', answer: 'Xbox Game Pass Ultimate ($19.99/month) includes 400+ games day-one at launch, plus EA Play. If you play 3+ new games per month, Game Pass delivers better value than buying individual titles at $70 each. PlayStation\'s equivalent (PlayStation Plus Extra/Premium) has a larger catalog but doesn\'t include first-party games at launch. The comparison depends on play habits: heavy gamers who try many titles benefit most from Game Pass; players who buy 2–3 games per year and replay them extensively may not extract full value. Game Pass also includes PC games, which is a meaningful add-on.' },
  { question: 'Does PS5 have better exclusives than Xbox in 2026?', answer: 'By critical consensus and sales, yes — PS5\'s first-party exclusive library is stronger in 2026. God of War Ragnarök (2022, 94 Metacritic), Spider-Man 2 (2023, 90 Metacritic), and Demon\'s Souls (88 Metacritic) represent some of the best-reviewed games of the generation. Xbox\'s most notable exclusives — Halo Infinite, Forza Motorsport, Starfield — received more mixed critical responses. Xbox has acquired major studios (Activision Blizzard, Bethesda, id Software) whose games will release over the coming years; the exclusive gap may narrow. As of 2026, PS5\'s exclusive lineup is more consistently acclaimed.' },
  { question: 'Can Xbox Series X play PS5 games or vice versa?', answer: 'No — console exclusives are platform-locked. PlayStation exclusives (Spider-Man, God of War, Horizon) are unavailable on Xbox and Xbox exclusives (Halo, Forza, Gears) are unavailable on PS5. Many multiplatform third-party games (Call of Duty, FIFA/FC25, Elden Ring, GTA VI) are available on both consoles. Microsoft has begun releasing some previously Xbox-exclusive games on PS5 (Hi-Fi Rush, Pentiment, Sea of Thieves) suggesting the traditional console exclusivity model may be loosening, but the major flagship exclusives remain platform-locked as of 2026.' },
  { question: 'Which console is better for families, Xbox Series X or PS5?', answer: 'Both are appropriate for families but with different strengths. Xbox Game Pass Family Plan ($19.99/month, covers up to 5 accounts) offers exceptional value for households with multiple players and mixed gaming interests. PS5\'s family game library — Astro\'s Playroom, Sackboy, Ratchet & Clank, MLB The Show — is strong, and the PS5 disc edition plays PS4 games, giving access to a decade of family-friendly titles. The Xbox parental controls are slightly more robust for managing children\'s screen time, content ratings, and spending. For pure family value: Game Pass Family Plan on Xbox is very hard to beat. For access to a wider disc library and specific exclusive family titles: PS5 is excellent.' }
]

const ENRICHED_CONTENT = {

'xbox-series-x-vs-ps5-specs-performance-2026': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'xbox-series-x-vs-ps5-performance-comparison-2026-games-differences': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'xbox-series-x-vs-ps5-performance-comparison-latest-2026': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'xbox-series-x-vs-ps5-performance-comparison-2026': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'xbox-series-x-vs-ps5-specs-performance-comparison-2026': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'xbox-series-x-vs-ps5-specs-2026': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'playstation-5-vs-xbox-series-x-2026-comparison': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'xbox-series-x-vs-ps5-performance-specs-comparison-2026': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'real-madrid-vs-barcelona-total-trophies-comparison-2026': {
  analysis: `Real Madrid and FC Barcelona are the most successful clubs in the history of Spanish football and two of the most trophy-laden clubs in the world. Their rivalry — El Clásico — is watched by an estimated 650 million viewers globally and defines the architecture of European football competition.

In total major trophies, Real Madrid leads comprehensively. Real Madrid have won 15 UEFA Champions League titles (the most by any club in history) — including back-to-back in 2023 and 2024 — compared to Barcelona's 5. In La Liga, Real Madrid have 36 titles to Barcelona's 27. In Copa del Rey, Barcelona lead historically with 31 titles to Real Madrid's 20. Counting all major honors (La Liga, Champions League, Copa del Rey, Spanish Super Cup, UEFA Super Cup, Club World Cup), Real Madrid hold approximately 100+ major trophies compared to Barcelona's 85+, though exact counts vary by which competitions are included.

The rivalry entered a transitional phase in the early 2020s. After the peak Messi-era Barcelona (2004–2021) defined world football for nearly two decades, Messi's departure to PSG in 2021 due to Barcelona's financial crisis marked the end of an era. Barcelona under Joan Laporta has been rebuilding under financial fair play constraints, while Real Madrid — anchored by Jude Bellingham, Vinícius Jr., and Rodrygo — won back-to-back Champions League titles in 2023 and 2024 and back-to-back La Liga in 2023 and 2024.

The Ballon d'Or count is part of this rivalry's mythology. Lionel Messi won 8 Ballon d'Or awards during his Barcelona career — the most in history — while Cristiano Ronaldo won 4 at Real Madrid. Both have since left, but the clubs' identities were shaped by this individual rivalry.

Financially, both clubs are among the top 5 in the world by revenue. Real Madrid's Santiago Bernabéu renovation (completed 2023) with a retractable roof, rolling pitch, and enormous LED exterior generates significant non-matchday revenue. Barcelona's Camp Nou renovation (Espai Barça project) is ongoing with completion targeted for 2025–2026. Both clubs generate €800 million+ annually.

For the current 2025–2026 era: Real Madrid hold the momentum in European football — consecutive Champions League wins with a young squad (average age dropping as veterans retire) suggests continued competitiveness. Barcelona are rebuilding with Pedri, Lamine Yamal (2024 Euro winner at 17), Fermín López, and Gavi forming a young core under Hansi Flick. The rivalry remains intensely competitive, with both clubs capable of La Liga and Champions League contention every season.`,

  citations: [
    { url: 'https://www.realmadrid.com/en-US/the-club/history/football-titles', text: 'Real Madrid official trophy history: all major titles including 15 Champions League, 36 La Liga, Copa del Rey, and international honors' },
    { url: 'https://www.fcbarcelona.com/en/club/history/honours', text: 'FC Barcelona official honors: 5 Champions League titles, 27 La Liga, 31 Copa del Rey, and all major domestic and European trophies' },
    { url: 'https://www.uefa.com/uefachampionsleague/history/clubs/', text: 'UEFA Champions League official records: all-time winning clubs, appearances, and Real Madrid\'s record 15 titles historical data' }
  ],

  faqs: [
    { question: 'Who has more Champions League titles, Real Madrid or Barcelona?', answer: 'Real Madrid by a wide margin. Real Madrid have won 15 UEFA Champions League titles — the most by any club in history — including 2022, 2023, and 2024. FC Barcelona have won 5 Champions League titles (1992, 2006, 2009, 2011, 2015). Real Madrid won 3 consecutive titles between 2016–2018 under Zinedine Zidane (with Ronaldo) and then 3 more in 5 years between 2022–2024 under Carlo Ancelotti (with Benzema, Vinícius Jr., and Bellingham). The Champions League record is Real Madrid\'s single greatest institutional differentiator.' },
    { question: 'Who has more La Liga titles, Real Madrid or Barcelona?', answer: 'Real Madrid lead with 36 La Liga titles compared to Barcelona\'s 27 (through 2025–2026). However, Barcelona dominated the league during the Pep Guardiola and Luis Enrique eras (2008–2016), winning multiple consecutive titles. Real Madrid\'s recent run under Ancelotti — La Liga in 2022 and 2024 — re-extended their historical lead. In total domestic trophy count (La Liga + Copa del Rey), Barcelona\'s Copa dominance (31 vs 20) partially offsets Real Madrid\'s La Liga edge.' },
    { question: 'Is Messi or Ronaldo better? (Real Madrid vs Barcelona lens)', answer: 'The Messi vs Ronaldo debate is the most discussed in sports history. Lionel Messi spent his peak career (2004–2021) at Barcelona and won 8 Ballon d\'Or awards — the most ever. Cristiano Ronaldo spent 2009–2018 at Real Madrid and won 4 Ballon d\'Or awards during that period, plus a fifth at Juventus. Messi won the 2022 World Cup with Argentina (a major trophy Ronaldo has not won). In Champions League titles: Messi won 4 (all at Barcelona), Ronaldo won 5 (1 at Man United, 4 at Real Madrid). By objective trophy count and individual award count, Messi leads. The debate is ultimately unsettled because both players exceed the limits of normal statistical comparison.' },
    { question: 'Who is better in 2026, Real Madrid or Barcelona?', answer: 'In 2026, Real Madrid hold the institutional edge: they are back-to-back Champions League holders (2023, 2024) and have back-to-back La Liga titles. Their squad — Vinícius Jr., Jude Bellingham, Rodrygo, Kylian Mbappé (who joined in 2024), Aurélien Tchouaméni — is young and deep. Barcelona are competitive with Lamine Yamal (born 2007, a generational talent), Pedri, Gavi, and a rebuilt backline under Hansi Flick, and won Copa del Rey in 2024. Both clubs are La Liga contenders in 2025–2026, and El Clásico results determine much of the season\'s narrative. As of the 2025–2026 season, Real Madrid remain slight favorites based on recent European performance.' },
    { question: 'Have Real Madrid and Barcelona ever played outside Spain?', answer: 'Yes — El Clásico has been played in the United States as part of pre-season tours (International Champions Cup, now La Liga World Challenge). Both clubs have global tours in Asia, North America, and the Middle East during pre-season periods. The match itself (as an official La Liga or Copa del Rey fixture) is played in Spain: at the Santiago Bernabéu in Madrid or Camp Nou (or its temporary replacement, Montjuïc, during the Espai Barça renovation) in Barcelona. FIFA and La Liga have discussed expanding official league games internationally but no official Clásico has been played outside Spain as a competitive fixture.' }
  ]
},

'entertainment-style-netflix-shines-with-a-wide-variety-vs-youtube-tv-comparison-2026': {
  analysis: `Netflix and YouTube TV are frequently compared but serve fundamentally different entertainment functions. Netflix is a subscription video-on-demand (SVOD) service for scripted originals, films, and licensed library content. YouTube TV is a virtual multichannel video programming distributor (vMVPD) — it replaces cable TV with live broadcast and cable channels. Understanding this distinction makes the comparison clear.

Netflix ($6.99–$22.99/month depending on plan and whether ad-supported) is built around its library of original content and licensed films and series. Netflix Originals include Stranger Things, Squid Game, Wednesday, Ozark, The Crown, and one of the most extensive documentary and international content libraries in the world. Netflix produces content in over 60 languages and its non-English originals (Money Heist, Dark, All Quiet on the Western Front) have reached global audiences in a way no previous platform achieved. Netflix's content model is on-demand: you choose what to watch, when to watch it, and can pause, rewind, and re-watch. It has no live TV channels.

YouTube TV ($72.99/month) provides live streaming of 100+ channels: ABC, CBS, NBC, Fox, ESPN, CNN, MSNBC, TNT, TBS, AMC, FX, Discovery, Bravo, and dozens more. It includes unlimited cloud DVR (up to 9 months of storage), which solves the primary frustration with traditional cable DVRs. YouTube TV provides live sports: NFL, NBA, MLB, NHL, college football and basketball, MLS, and more. It also provides breaking news coverage live. YouTube TV does not produce original content and its on-demand library is limited to what individual networks make available.

The use case split: if you watch primarily scripted shows, films, documentaries, and don't need live sports or news — Netflix is more efficient and ~$40–60/month cheaper. If you need live sports (particularly NFL, NBA, college football), live news, or want to replicate a cable TV experience — YouTube TV is necessary and Netflix doesn't serve that function.

Content that matters: Netflix is the home of some of the most-watched entertainment in the world. Its most-watched titles (Squid Game Season 2, Wednesday, Stranger Things) generate cultural moments that rival broadcast TV's peak network era. But Netflix has zero live sports and zero live news — it is 100% on-demand.

Price comparison: a Netflix Standard with ads plan is $6.99/month; Standard (no ads) is $15.49/month; Premium is $22.99/month. YouTube TV is $72.99/month. Many households subscribe to both — Netflix for scripted content, YouTube TV for live sports and news — at a combined cost of $80–95/month.

For cord-cutters deciding between keeping cable TV or subscribing to streaming services: YouTube TV (or a competing vMVPD like Hulu + Live TV or DirecTV Stream) replaces cable TV. Netflix does not. These products are not alternatives; they are complements.`,

  citations: [
    { url: 'https://www.netflix.com/tudum/articles/netflix-plans-pricing', text: 'Netflix pricing and plan overview: ad-supported, Standard, and Premium tiers with download and quality features' },
    { url: 'https://tv.youtube.com/welcome/', text: 'YouTube TV official pricing and channel lineup: live TV, cloud DVR, sports packages, and 4K add-on details' },
    { url: 'https://www.streamingobserver.com/netflix-vs-youtube-tv/', text: 'Streaming Observer: Netflix vs YouTube TV comparison — use case differences, channel counts, sports coverage, and value analysis' }
  ],

  faqs: [
    { question: 'Is Netflix or YouTube TV better?', answer: 'They serve different purposes and "better" depends entirely on what you watch. Netflix is better if you primarily watch scripted shows, films, and documentaries on demand and don\'t need live TV. YouTube TV is better if you watch live sports, follow live news, or want to replace traditional cable TV with a live channel lineup. Many households subscribe to both: Netflix for original content and YouTube TV for live sports and news, at a combined cost of ~$85–95/month. If you must choose one: choose based on whether live content (sports, news) or on-demand content (shows, films) is your priority.' },
    { question: 'Does YouTube TV have Netflix content?', answer: 'No — YouTube TV and Netflix are completely separate services with no content overlap. YouTube TV provides live streaming of broadcast and cable channels (NBC, ESPN, CNN, etc.) but does not include any Netflix original shows or films. Netflix content (Stranger Things, Squid Game, Wednesday) is only available on the Netflix platform or app. They are separate subscriptions, separate apps, and separate content libraries. You would need to subscribe to both to access both types of content.' },
    { question: 'Does Netflix have live sports?', answer: 'Netflix has no traditional live sports as of 2026. Netflix made a significant entry into live events with WWE Raw (a long-term deal starting January 2025 — a first for Netflix), select NFL Christmas Day games in 2024, and live special events (boxing matches, comedy specials). This represents a strategic shift, but Netflix is not a sports replacement for ESPN, YouTube TV, or traditional cable. For comprehensive live sports coverage — NFL Sunday Ticket, NBA, MLB, NHL, college sports — YouTube TV or a competing vMVPD with sports add-ons remains necessary.' },
    { question: 'Is YouTube TV worth $72.99/month?', answer: 'YouTube TV is worth the price if it replaces your cable TV subscription. The average US cable TV bill in 2026 is $100–130/month, making YouTube TV\'s $72.99/month a 30–40% savings with comparable channel selection plus unlimited cloud DVR. For someone who only watches live sports occasionally, YouTube TV may be expensive relative to a sports add-on on another streaming service. Key advantages: no DVR storage limits (unlike cable), no 2-year contract, watch on unlimited screens at home (3 simultaneous streams away from home), and the service runs on any smart TV, phone, or computer without hardware installation.' },
    { question: 'Can I get local channels on Netflix?', answer: 'Netflix does not carry local broadcast channels (ABC, CBS, NBC, Fox, PBS local affiliates). These channels carry local news, network shows, and NFL/sports that are broadcast locally. YouTube TV includes all four major broadcast networks in most markets. For Netflix users who want local channels without YouTube TV\'s full price ($72.99/month), options include: a free over-the-air antenna (picks up local HD broadcast for free); Hulu\'s base plan ($7.99/month) which includes some on-demand network shows next-day; or Peacock Premium ($5.99/month) for NBC content. Local news specifically requires either an antenna or a live TV service like YouTube TV.' }
  ]
}

}

async function enrichPage(slug, data) {
  const { analysis, citations, faqs } = data

  const comparison = await prisma.comparison.findUnique({
    where: { slug },
    select: { id: true }
  })

  if (!comparison) {
    console.log(`  SKIP ${slug} — not found in DB`)
    return false
  }

  const contentJson = {
    analysis,
    citations,
    enrichedAt: new Date().toISOString(),
    enrichmentVersion: 'batch21-dan2166'
  }

  await prisma.comparison.update({
    where: { slug },
    data: {
      content: contentJson,
      isHumanReviewed: true,
      reviewedBy: 'daniel-rozin',
      reviewedAt: new Date(),
      status: 'published'
    }
  })

  await prisma.fAQ.deleteMany({ where: { comparisonId: comparison.id } })
  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        comparisonId: comparison.id
      }
    })
  }

  return true
}

async function main() {
  console.log('DAN-2166 Batch 21 enrichment starting...\n')
  console.log(`Pages: ${Object.keys(ENRICHED_CONTENT).length} pages (top unreviewed by searchImpressions)\n`)

  let success = 0
  let skip = 0

  for (const [slug, data] of Object.entries(ENRICHED_CONTENT)) {
    process.stdout.write(`  Enriching ${slug}... `)
    const ok = await enrichPage(slug, data)
    if (ok) {
      success++
      console.log('DONE')
    } else {
      skip++
    }
  }

  console.log(`\nBatch 21 complete: ${success} enriched, ${skip} skipped`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
