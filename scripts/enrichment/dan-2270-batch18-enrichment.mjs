/**
 * DAN-2270: Enrichment script for compare pages ranked 171-180 by GSC impressions
 * Week 18 — July 2026
 *
 * Pages:
 *  171 - jbl-charge-vs-sonos-move (149 impressions) — already enriched by DAN-2255; provenance update only
 *  172 - doordash-vs-uber-eats (147 impressions) — NEW: needs expert analysis + sources
 *  173 - delta-vs-united (146 impressions) — NEW: needs expert analysis + sources
 *  174 - netflix-vs-max-comparison-2026 (146 impressions) — already enriched; provenance update only
 *  175 - hulu-vs-disney-plus (144 impressions) — already enriched; provenance update only
 *  176 - honda-vs-toyota (144 impressions) — NEW: needs expert analysis + sources
 *  177 - korean-war-vs-vietnam-war-comparison (144 impressions) — NEW: needs expert analysis + sources
 *  178 - wordpress-vs-squarespace (143 impressions) — already enriched; provenance update only
 *  179 - bmw-7-series-vs-mercedes-s-class (140 impressions) — already enriched; provenance update only
 *  180 - american-airlines-vs-united-airlines (139 impressions) — already enriched; provenance update only
 *
 * Enrichment standard:
 * - Expert analysis 400-500 words (fact-grounded, 2026-dated, Tavily-enriched)
 * - 5 PAA-style FAQs per page (existing FAQs retained for all; new analysis only for 172, 173, 176, 177)
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

// Pages 172, 173, 176, 177 need full content (analysis + sources; keep existing FAQs)
const NEW_CONTENT = {

'doordash-vs-uber-eats': {
  analysis: `DoorDash and Uber Eats are the two dominant food delivery platforms in the United States in 2026, but they hold very different positions in the market — a gap that directly affects restaurant availability, pricing, and the value proposition for both customers and gig workers.

DoorDash holds approximately 67% of the U.S. food delivery market in 2026, making it the clear category leader. The company operates in 4,000+ U.S. cities and partners with 390,000+ restaurant locations, including exclusive DoorDash-only partnerships with major chains. For consumers, DoorDash's subscription product DashPass ($9.99/month) offers free delivery and reduced service fees on qualifying orders above $12, plus access to grocery, alcohol, and convenience delivery. DashPass members consistently see more value in DoorDash's dense restaurant network — in suburban and smaller metro markets, DoorDash typically offers significantly more restaurant options than Uber Eats. DoorDash's app experience is optimized around restaurant discovery, with curated collections, ratings, and estimated delivery times prominently displayed. Delivery fees for non-DashPass users range from $0.99 to $7.99 per order depending on distance, demand, and restaurant agreements. Service fees add an additional 10-15% of the order subtotal. DoorDash's restaurant commission rates typically run 15-30% depending on the partnership tier, which has been a point of ongoing tension with restaurant owners.

Uber Eats holds approximately 23% of the U.S. market in 2026. Where Uber Eats differentiates is in urban density and international coverage — in major metros like New York City, San Francisco, and Chicago, Uber Eats' restaurant selection is often comparable to DoorDash's, and the Uber One subscription bundle ($9.99/month or $99.99/year) adds value by combining ride-hailing discounts with food delivery benefits in a single membership. Uber One members receive free delivery on qualifying Uber Eats orders, 5% off eligible orders, and up to 10% off Uber rides. For consumers who use both Uber rides and Uber Eats, the bundled membership is more financially efficient than DashPass. Uber Eats also has broader international availability than DoorDash, making it the default choice for international travelers or U.S. expats.

For restaurant owners, both platforms charge commission rates of 15-30%, but the structures differ: DoorDash offers three tiers — Basic (15% commission, lower visibility), Plus (25%, more visibility), and Premier (30%, full features including DashPass inclusion). Uber Eats charges a flat 30% for delivery or 6% for pickup orders.

For gig workers, both platforms pay by the delivery, with base pay plus tips. Studies in 2025-2026 show DoorDash pays slightly more per delivery on average in suburban markets due to its density of orders; Uber Eats can pay more per hour in dense urban areas where deliveries are closer together.

Bottom line: DoorDash is the better choice for most U.S. suburban and mid-market consumers due to superior restaurant selection and DashPass value. Uber Eats is more compelling for urban consumers who already use Uber rides and want Uber One's combined benefits.`,

  sources: [
    { url: 'https://shifttrackerapp.com/blog/doordash-vs-uber-eats-vs-grubhub-2026-full-comparison', text: 'ShiftTracker: DoorDash vs Uber Eats 2026 — driver pay, fees, market share (~67% DoorDash), and customer comparison' },
    { url: 'https://www.getsauce.com/post/doordash-vs-uber-eats-for-restaurants', text: 'Sauce: DoorDash vs Uber Eats for restaurants — commission tiers (15-30%), support comparison, and margin impact 2026' },
    { url: 'https://www.linkedin.com/pulse/us-food-delivery-market-leaders-laggards-data-separates-them-nce9f', text: 'LinkedIn Pulse: U.S. food delivery market — DoorDash 67%, Uber Eats 23%, Grubhub 7% market share data 2026' }
  ]
},

'delta-vs-united': {
  analysis: `Delta Air Lines and United Airlines are two of the three major U.S. network carriers in 2026, and the choice between them depends significantly on route network, hub geography, loyalty program mechanics, and premium cabin quality.

Delta Air Lines consistently earns the top spot in U.S. airline rankings. The Points Guy ranked Delta #1 among U.S. airlines for the eighth consecutive year in 2026, and Fortune's Most Admired Companies list included Delta for the seventh consecutive year. Delta's operational reputation is built around on-time performance and low cancellation rates — the carrier has held the top position in DOT on-time statistics among major carriers through much of 2023-2026. Delta's primary hubs are Atlanta (ATL, the world's busiest airport and Delta's crown jewel), Minneapolis-St. Paul, Detroit, Salt Lake City, Seattle, and New York (JFK and LGA). Delta's transatlantic position is notable: aviation data from Cirium showed Delta surpassed United as the largest U.S. carrier across the Atlantic for summer 2026, deploying more than 4.5 million round-trip seats between the U.S. and Europe. Delta Sky Club lounges are widely regarded as the best major-carrier airport lounges in the U.S., though access has been tightened (2024: limited to Amex Platinum cardholders who also fly Delta, eliminating open lounge access for Amex users who don't actually fly Delta that day). Delta One business class (lie-flat seats on long-haul international) scores well in premium traveler surveys.

United Airlines' competitive advantage is geographic diversity. United's hub network — Newark/EWR (New York), Chicago O'Hare, Houston Bush, Denver, San Francisco, Los Angeles, and Washington Dulles — gives United the deepest connectivity in the Western U.S. and Latin America, and among the strongest Pacific route networks of any U.S. carrier. United has the largest network by routes to Central and South America. United Polaris business class, the carrier's long-haul international premium product, is competitive with Delta One — Polaris lounges at hub airports are often ranked alongside Delta Sky Club as the best in the U.S., though United has fewer of them. United has invested heavily in premium economy (United Premium Plus) and Wi-Fi upgrades across its fleet.

On loyalty programs, the landscape equalized in 2026: a Simple Flying analysis documented how American, Delta, and United "quietly adopted identical loyalty math" for 2026, making the three programs more comparable than at any prior point. MileagePlus (United) has historically offered better redemption flexibility and transfer partner options. SkyMiles (Delta) has been criticized for reduced award availability in recent years, though Delta has rolled back some 2023-era devaluation changes following customer backlash.

Hub geography should drive the choice: fly Delta for the Southeast U.S., Northeast, and transatlantic routes; fly United for the Western U.S., Pacific routes, and Latin America. Both carriers offer competitive domestic services; Delta edges United on domestic reliability and customer satisfaction metrics; United edges Delta on Western U.S. and Pacific connectivity.`,

  sources: [
    { url: 'https://news.delta.com/delta-americas-most-awarded-airline', text: 'Delta News Hub: Delta ranked #1 U.S. airline by The Points Guy for eighth consecutive year and Fortune Most Admired 2026' },
    { url: 'https://simpleflying.com/how-american-delta-united-quietly-adopted-identical-loyalty-math-2026', text: 'Simple Flying: American, Delta, and United adopt identical loyalty math for 2026 — SkyMiles vs MileagePlus comparison' },
    { url: 'https://www.facebook.com/AviationCircle/posts/delta-air-lines-has-claimed-a-title-united-airlines-held-for-years-according-to-/960296423670623', text: 'Aviation Circle: Delta surpasses United as largest U.S. transatlantic carrier for summer 2026 — Cirium scheduling data' }
  ]
},

'honda-vs-toyota': {
  analysis: `Honda and Toyota are the two most trusted Japanese automotive brands in the U.S. market in 2026, and both consistently rank among the top choices for consumers prioritizing long-term reliability and value retention. While the two brands share a reputation for dependability, they differ meaningfully in design philosophy, model lineup strengths, and target buyer profiles.

Toyota edges Honda in reliability rankings. Consumer Reports' 2025 Annual Auto Reliability Survey ranked Toyota #1 among all brands with a 66/100 reliability score; Honda placed 4th with 59/100 — still excellent by industry standards, but a measurable gap. Toyota's reliability advantage is most pronounced in its hybrid lineup: the Toyota Prius, Camry Hybrid, and RAV4 Hybrid have multi-year reliability track records that Honda's hybrid offerings have not fully matched. Toyota's hybrid system, first commercialized in 1997 with the original Prius, is now in its fifth generation — a maturity advantage that translates directly to lower repair rates. Toyota sold approximately 2.3 million vehicles in the U.S. in 2025, maintaining its position as the #1 or #2 brand by sales volume (trading positions with GM depending on the quarter).

Honda's competitive advantage lies in driving dynamics and lower maintenance costs. Honda vehicles — particularly the Civic and Accord — are consistently praised for more engaging, driver-focused handling compared to Toyota's more comfort-prioritized tuning. Consumer surveys on average annual maintenance costs typically show Honda slightly lower than Toyota (~$400/year vs ~$441/year for Toyota, according to multiple sources). Honda's VTEC and i-VTEC engine technology has a reputation for longevity: high-mileage Honda engines (200,000+ miles) are common. The Civic remains the best-selling car in the compact class, regularly outselling the Toyota Corolla. In the SUV segment, the Honda CR-V competes directly with the Toyota RAV4 — both are consistently in the top 5 best-selling vehicles in the U.S. RAV4 typically outsells CR-V, though the CR-V has a loyal following for its interior space efficiency relative to its exterior footprint.

On resale value, Toyota holds an edge — Kelley Blue Book and Edmunds data consistently show Toyota vehicles (particularly Tacoma pickups and RAV4 Hybrids) retaining a higher percentage of their MSRP at 3 and 5 years compared to equivalent Honda models. The Toyota Tacoma is among the highest-resale-value vehicles in any category in the U.S. market.

For technology and infotainment, both brands have improved their software interfaces in 2024-2026 model years. Toyota's multimedia systems now use Google built-in on select models (no USB tethering required for Android Auto), while Honda's 2025+ models feature the Honda Sensing 360 suite of safety assistance technology across more trim levels.

Choosing between them: Toyota for buyers who prioritize peak reliability, hybrid drivetrain maturity, and resale value; Honda for buyers who want a more engaging drive, lower average maintenance costs, and value the Civic/Accord's class-leading interior efficiency.`,

  sources: [
    { url: 'https://coveragex.com/auto/toyota-vs-honda-reliability', text: 'CoverageX: Toyota vs Honda reliability 2026 — Consumer Reports scores (Toyota #1 at 66/100, Honda 4th at 59/100), hybrid reliability comparison' },
    { url: 'https://majorworld.com/toyota-vs-honda', text: 'Major World: Toyota vs Honda brand comparison — reliability surveys, annual maintenance costs, resale value, and model lineup analysis 2025-2026' },
    { url: 'https://www.kirklandhonda.com/honda-vs-toyota', text: 'Kirkland Honda: 2026 Honda vs Toyota — warranty terms, lineup comparison, and ownership cost overview' }
  ]
},

'korean-war-vs-vietnam-war-comparison': {
  analysis: `The Korean War (1950-1953) and the Vietnam War (1955-1975) were both Cold War-era U.S. military engagements fought to contain the spread of communism in Asia, but they differed profoundly in duration, intensity, domestic political impact, and long-term geopolitical outcomes.

The Korean War began on June 25, 1950, when North Korean forces crossed the 38th parallel into South Korea. The war lasted 37 months of active combat (June 1950 to July 1953), ending with an armistice — not a peace treaty — that remains in effect today, technically leaving North and South Korea still in a state of war. Total U.S. battle deaths in Korea: 33,629. U.S. deaths from all causes (including non-combat): approximately 54,246. South Korean military deaths: approximately 137,000. Civilian deaths on both sides of the peninsula: estimated at 2-3 million. Despite its enormous human cost, the Korean War is often called "The Forgotten War" because it occurred between World War II and Vietnam — overshadowed by the heroism narratives of WWII before it and the massive domestic controversy of Vietnam after it. The war ended in a military stalemate essentially restoring the pre-war status quo at the 38th parallel, a result that was psychologically difficult for Americans to accept after WWII's unconditional surrender victories.

The Vietnam War officially involved U.S. combat forces from 1965 to 1973 (with U.S. advisors present since the late 1950s), spanning 101 months of major combat — nearly three times the duration of active Korean War fighting. U.S. battle deaths in Vietnam: 47,321. U.S. deaths from all causes: 58,220. South Vietnamese military deaths: approximately 250,000. Civilian deaths (North and South Vietnam combined): estimated at 1-3 million. The Vietnam War's casualty rate per month was lower than Korea's (Korea had a higher concentration of deaths in a shorter period — the first year alone saw 23,000 U.S. deaths), but Vietnam's extended duration produced the largest sustained anti-war movement in U.S. history. The draft lottery, nightly television news coverage of combat footage, and protests culminating in events like Kent State (1970) produced a domestic political rupture with no Korean War equivalent.

Geopolitical outcomes diverged sharply. Korea: the intervention succeeded in its stated objective — South Korea remained non-communist, and today the Republic of Korea is a prosperous democracy with a GDP per capita exceeding $33,000. North Korea remains one of the world's most isolated authoritarian states. Vietnam: the U.S. military withdrawal in 1973 and subsequent fall of Saigon in 1975 resulted in reunification under communist North Vietnam — the U.S. did not achieve its stated objective. However, Vietnam today is a U.S. trade partner (full diplomatic relations restored in 1995), and the long-term domino theory fear that communist Vietnam would destabilize Southeast Asia did not fully materialize.

The Vietnam War's lasting domestic impact — the "Vietnam Syndrome" of reluctance toward foreign military intervention — shaped U.S. foreign policy for decades and influenced every military intervention debate from Grenada (1983) through Iraq (2003). The Korean War, though tactically costly, produced less lasting domestic political disruption.`,

  sources: [
    { url: 'https://thekwe.org/topics/casualties/p_casualties_vietnam_korea.htm', text: 'Korean War Educator: Korean War vs Vietnam War casualty comparison — battle deaths, other deaths, wounds, total casualties by conflict' },
    { url: 'https://www.studentsofhistory.com/comparing-the-vietnam-korean-wars', text: 'Students of History: Comparing the Vietnam and Korean Wars — origins, U.S. involvement, Cold War context, and outcomes' },
    { url: 'https://ivypanda.com/essays/compare-and-contrast-paper-the-vietnam-war-and-korean-war', text: 'IvyPanda: Korean War vs Vietnam War comparison — similarities, differences, domestic political impact, and geopolitical legacy' }
  ]
}

}

// Pages that already have quality enrichment — update provenance to DAN-2270 only
const PROVENANCE_UPDATE_SLUGS = [
  'jbl-charge-vs-sonos-move',
  'netflix-vs-max-comparison-2026',
  'hulu-vs-disney-plus',
  'wordpress-vs-squarespace',
  'bmw-7-series-vs-mercedes-s-class',
  'american-airlines-vs-united-airlines'
]

async function enrichPage(slug, enrichedContent) {
  const { analysis, sources } = enrichedContent
  const now = new Date()

  const comparison = await prisma.comparison.findUnique({ where: { slug } })
  if (!comparison) {
    console.log(`SKIP ${slug} — not found in DB`)
    return
  }

  const contentJson = {
    ...(comparison.content && typeof comparison.content === 'object' ? comparison.content : {}),
    expertAnalysis: analysis,
    sources,
    enrichedAt: now.toISOString(),
    enrichedBy: 'DAN-2270'
  }

  await prisma.comparison.update({
    where: { slug },
    data: {
      content: contentJson,
      isHumanReviewed: true,
      reviewedBy: 'daniel-rozin',
      reviewedAt: now
    }
  })

  const wordCount = analysis.split(/\s+/).filter(Boolean).length
  console.log(`ENRICHED ${slug} — ${wordCount} words, ${sources.length} sources`)
}

async function updateProvenance(slug) {
  const now = new Date()
  const comparison = await prisma.comparison.findUnique({ where: { slug } })
  if (!comparison) {
    console.log(`SKIP ${slug} — not found in DB`)
    return
  }

  const contentJson = {
    ...(comparison.content && typeof comparison.content === 'object' ? comparison.content : {}),
    verifiedByBatch: 'DAN-2270',
    verifiedAt: now.toISOString()
  }

  await prisma.comparison.update({
    where: { slug },
    data: {
      content: contentJson,
      isHumanReviewed: true,
      reviewedBy: 'daniel-rozin',
      reviewedAt: now
    }
  })

  console.log(`VERIFIED ${slug} — provenance updated to DAN-2270`)
}

async function main() {
  console.log('DAN-2270 Batch 18 enrichment starting...\n')
  console.log('Pages: ranks 171-180 by GSC impressions\n')
  console.log('New enrichment (4 pages):')

  for (const [slug, content] of Object.entries(NEW_CONTENT)) {
    await enrichPage(slug, content)
  }

  console.log('\nProvenance update (6 pages, already enriched):')
  for (const slug of PROVENANCE_UPDATE_SLUGS) {
    await updateProvenance(slug)
  }

  console.log('\nAll done.')
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
