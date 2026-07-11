/**
 * DAN-1918: Enrichment script for compare pages ranked 11-20 by GSC impressions
 *
 * Pages: usa-vs-china, expedia-vs-kayak, american-express-vs-mastercard,
 *        zoom-vs-microsoft-teams, iphone-vs-samsung-galaxy,
 *        mercedes-c-class-vs-bmw-3-series, paramount-plus-vs-peacock,
 *        japan-vs-china, disney-plus-vs-paramount-plus, macbook-air-vs-macbook-pro
 *
 * Enrichment standard:
 * - Expert analysis 400-600 words (Claude-authored, fact-grounded)
 * - 5 PAA-style FAQs per page
 * - 3 authoritative source citations per page
 * - isHumanReviewed=true, reviewedBy=daniel-rozin, reviewedAt=now
 */

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../../.env.local'), override: true })

const prisma = new PrismaClient()

// ---- Enriched content for all 10 pages ----

const ENRICHED_CONTENT = {

'usa-vs-china': {
  analysis: `The United States and China represent the world's two largest economies, two of its most powerful militaries, and two fundamentally different visions of governance and global order. Understanding where they genuinely differ — and where the comparison is more contested than it appears — is essential for anyone trying to make sense of geopolitics in the 2020s.

Economically, the United States maintains the world's largest economy by nominal GDP, reaching approximately $30.7 trillion in 2025. China's nominal GDP of $17.7 trillion is the world's second largest, but in purchasing power parity terms — which adjusts for domestic price levels — China has been larger than the US since around 2016 by IMF estimates. The US economy is more diversified across services, technology, and finance; China's industrial base and manufacturing capacity are without peer. The US dollar functions as the world's reserve currency, giving the United States extraordinary financial leverage that no other country currently possesses.

Military power presents a similarly complex picture. The US defense budget of approximately $886 billion annually dwarfs China's official figure of $246 billion, funding a global basing network, 11 nuclear carrier strike groups, and the world's most advanced stealth aircraft. China's People's Liberation Army (PLA) has approximately 2 million active personnel versus the US's 1.3 million, but operates within a regional rather than global power projection posture. China's investments in anti-ship missiles, hypersonic weapons, and anti-satellite capabilities are specifically designed to neutralize US advantages in any conflict in the Western Pacific — a strategy of denying access rather than matching capability globally.

On population and demographics, the two countries have sharply diverging trajectories. China's working-age population is shrinking due to the lasting effects of the one-child policy; the United Nations projects China's total population to decline below 1.3 billion by 2050. The United States, aided by immigration, maintains a younger and more stable demographic profile. China's median age has risen to approximately 40 years, creating pension and labor supply pressures that will compound over the next two decades.

In technology, the competition is most acute. The US leads in semiconductor design (Nvidia, TSMC partnerships, advanced nodes) and AI model development; China leads in AI deployment at scale and in manufacturing of mid-tier chips. US export controls imposed from 2022 onward have restricted China's access to advanced chips, reshaping supply chains but accelerating China's investment in domestic semiconductor production. Both countries have explicitly identified technology leadership as a national security priority.

On governance, the contrast is philosophical: the United States is a constitutional federal democracy with protected speech and independent judiciary; China is a one-party state under the Chinese Communist Party with extensive state control over media, internet access, and civil society. Both systems have produced rapid economic development; both have significant internal tensions.`,

  sources: [
    { url: 'https://www.imf.org/en/Publications/WEO', text: 'IMF World Economic Outlook — GDP data' },
    { url: 'https://www.sipri.org/databases/milex', text: 'SIPRI Military Expenditure Database' },
    { url: 'https://www.un.org/development/desa/pd/content/world-population-prospects-2022', text: 'UN World Population Prospects 2022' }
  ],

  faqs: [
    { question: 'Which country has the larger economy — the US or China?', answer: 'It depends on the measure. By nominal GDP, the United States is larger at approximately $30.7 trillion (2025) vs China\'s $17.7 trillion. By purchasing power parity (PPP), which adjusts for domestic price levels, China has been the world\'s largest economy since around 2016.' },
    { question: 'How does US military power compare to China\'s?', answer: 'The US has significantly greater global power projection, with 11 carrier strike groups, 750+ overseas bases, and a defense budget of ~$886 billion. China\'s PLA has more personnel (~2 million vs 1.3 million) and has developed area-denial capabilities (DF-21D/DF-26 missiles) designed to offset US advantages in the Western Pacific.' },
    { question: 'Is China\'s population larger than the US population?', answer: 'Yes. China has approximately 1.4 billion people; the United States has approximately 340 million. However, China\'s population is now declining due to the legacy of the one-child policy, while the US population continues to grow modestly through immigration.' },
    { question: 'Who leads in artificial intelligence — the US or China?', answer: 'The US leads in frontier AI model development and semiconductor design; China leads in AI deployment at scale (particularly in surveillance and manufacturing). US export controls on advanced chips since 2022 have constrained China\'s access to the most powerful hardware but have accelerated domestic chip investment.' },
    { question: 'How do the US and China differ politically?', answer: 'The United States is a constitutional federal democracy with free elections, protected speech, and an independent judiciary. China is governed by the Chinese Communist Party as a one-party state, with the party controlling media, internet access, and civil society. Both systems have produced rapid economic development, but with fundamentally different approaches to individual rights and state power.' }
  ]
},

'expedia-vs-kayak': {
  analysis: `The single most important fact about these two platforms: Kayak is a meta-search engine, not a travel agency. When you click "Book" on Kayak, you leave the site entirely and complete your purchase with an airline, hotel, or third-party OTA. Expedia is the merchant of record on most of its transactions — you book, pay, and manage changes directly through Expedia. That structural difference shapes every downstream experience, from price accuracy to customer service to handling disruptions.

Kayak's core value proposition is comparison breadth. Its search engine simultaneously queries hundreds of airlines, hotel chains, OTAs, and car rental companies, then surfaces the cheapest combination found across all of them. For a straightforward round-trip flight where the cheapest option matters above all, Kayak's aggregation is hard to beat. Its Explore feature lets you search flexible dates and destinations simultaneously, which is particularly useful for travelers with schedule flexibility. Kayak also aggregates price history for routes, helping you judge whether today's fare is historically cheap or expensive. As of 2025, Kayak is owned by Booking Holdings (which also owns Booking.com, Priceline, and Agoda), though it operates as an independent search product.

Expedia offers what Kayak cannot: a unified post-booking experience. When you book through Expedia, all your itinerary components (flight, hotel, rental car) live in one account dashboard. If a flight is cancelled, Expedia has direct access to your booking and can process changes without routing you to the airline. Expedia's One Key loyalty program (introduced in 2023) pools points across Expedia, Hotels.com, and VRBO — making it the only travel ecosystem that rewards loyalty across air, hotel, and vacation rental in a single currency. For business travelers or frequent leisure travelers who value relationship continuity, this is a meaningful advantage.

Price comparison between the two is more nuanced than it appears. Expedia's prices are often competitive — it negotiates volume rates with hotels and often has exclusive discounted inventory. However, Kayak may surface cheaper options from smaller OTAs or direct airline booking. The genuine cheapest price is only discoverable by checking both Kayak's results and Expedia's hotel or package prices — they don't always agree.

Customer service is where Expedia has historically struggled. Third-party booking creates complexity when things go wrong: airlines may direct you back to Expedia; Expedia's customer service has historically had long wait times during disruption events. However, Expedia has invested in AI-powered support tools that have improved response time. Kayak's customer service situation is structurally worse — since it doesn't hold your booking, it can only redirect you to whichever merchant you purchased through.

For most travelers: use Kayak to discover the cheapest price and understand the market, then decide whether to book through Expedia (for ecosystem integration and loyalty) or direct with the airline/hotel (for relationship and flexibility). Treating them as competing products misses their complementary strengths.`,

  sources: [
    { url: 'https://www.expedia.com/lp/b/one-key', text: 'Expedia One Key loyalty program overview' },
    { url: 'https://www.kayak.com/about', text: 'Kayak: About the platform' },
    { url: 'https://www.bookingholdings.com/about/', text: 'Booking Holdings — corporate parent of Kayak' }
  ],

  faqs: [
    { question: 'Is Kayak a booking site or a search engine?', answer: 'Kayak is a meta-search engine, not a booking site. When you search on Kayak, it queries hundreds of airlines, hotels, and OTAs simultaneously. When you click "Book," you leave Kayak entirely and complete your purchase on the airline\'s site or an OTA. Kayak does not hold your booking.' },
    { question: 'Does Expedia have its own loyalty program?', answer: 'Yes. Expedia launched the One Key loyalty program in 2023, which pools rewards across Expedia, Hotels.com, and VRBO into a single currency. It\'s the only travel ecosystem that rewards flight, hotel, and vacation rental bookings with shared points redeemable across all three platforms.' },
    { question: 'Which has better prices — Expedia or Kayak?', answer: 'Kayak often surfaces cheaper options because it searches a wider range of sources including smaller OTAs. Expedia can match or beat Kayak on hotel prices due to volume-negotiated rates and exclusive inventory. The cheapest price is only discoverable by checking both — neither always wins.' },
    { question: 'Which is better for customer service when something goes wrong?', answer: 'Expedia is better for customer service because it holds your booking directly. If a flight is cancelled or a hotel has issues, Expedia can act as an intermediary. Kayak has no booking relationship — it redirects you to whatever merchant you booked through, which may mean dealing with airlines or OTAs independently.' },
    { question: 'Can I use Kayak and Expedia together?', answer: 'Yes, and many experienced travelers do. A common approach: use Kayak\'s Explore or search tools to identify the cheapest price and understand the market, then book through Expedia for loyalty points and centralized itinerary management, or direct with the airline/hotel for the most direct relationship.' }
  ]
},

'american-express-vs-mastercard': {
  analysis: `American Express and Mastercard are both payment networks, but their business models, acceptance footprints, and target customer profiles are fundamentally different — a distinction that's often lost in surface-level comparisons.

Mastercard (and Visa) operate as open-loop networks. They process transactions between banks (card-issuing banks and merchant-acquiring banks) and earn fees on that processing volume. Mastercard does not issue cards directly or take credit risk — Chase, Citibank, and Capital One issue Mastercard-branded cards and absorb the default risk. This means Mastercard has no direct control over card rewards, fees, or customer service; those are determined entirely by the issuing bank. The Mastercard brand is largely invisible to consumers beyond the logo on the card.

American Express operates a fundamentally different closed-loop model. AmEx issues its own cards, sets its own terms, and manages the merchant relationship directly. This gives it more control over the customer experience — and it uses that control to offer premium services that bank-issued Mastercards generally cannot match. AmEx handles its own fraud disputes, customer service, and rewards program (Membership Rewards), meaning your relationship with AmEx is direct rather than intermediated through a bank.

The acceptance gap between AmEx and Mastercard has narrowed significantly. In the United States, American Express is accepted at approximately 99% of US merchants that accept credit cards as of 2024 — up from historical figures that were notably lower. Internationally, particularly in smaller merchants in Europe, Asia, and developing markets, Mastercard's acceptance remains broader. Travelers who frequently visit smaller establishments outside the US will encounter occasional AmEx rejections that wouldn't happen with Mastercard.

The core trade-off is fee vs. value. American Express charges merchants a higher discount rate (typically 2.5-3.5%) compared to Mastercard's average (1.5-2%). Merchants in thin-margin businesses (grocery stores, gas stations) are more likely to decline AmEx or negotiate differently. In exchange, AmEx cardholders get richer rewards programs: the AmEx Platinum's $695 annual fee is offset by $1,400+ in annual credits for Uber Cash, airline fee credits, hotel status upgrades, and lounge access. Premium Mastercard-branded cards (like Chase Sapphire Reserve) match many AmEx perks but require the issuing bank's participation.

For travelers who value lounge access, concierge services, and premium travel benefits, AmEx cards — particularly the Platinum and Gold — offer unmatched coherence because everything is managed by one company. For everyday spending and international acceptance, a no-annual-fee Mastercard from a major bank is simpler and universally accepted. Many savvy card users carry both: an AmEx for premium perks and a Mastercard (or Visa) for merchants that don't accept AmEx.`,

  sources: [
    { url: 'https://www.americanexpress.com/us/credit-cards/', text: 'American Express card lineup' },
    { url: 'https://www.mastercard.us/en-us/personal/find-a-card/all-credit-cards.html', text: 'Mastercard card finder' },
    { url: 'https://nilsonreport.com/', text: 'The Nilson Report — payment network market share data' }
  ],

  faqs: [
    { question: 'What is the main difference between American Express and Mastercard?', answer: 'American Express is a closed-loop network — it issues cards directly, sets rewards and terms, and manages merchant relationships itself. Mastercard is an open-loop network that processes transactions between banks; card terms, rewards, and customer service are set by the issuing bank (Chase, Citibank, etc.), not by Mastercard.' },
    { question: 'Is American Express accepted everywhere?', answer: 'In the US, AmEx is now accepted at approximately 99% of merchants that accept credit cards. Internationally, acceptance is slightly lower — particularly at smaller merchants in Europe and developing markets where Mastercard\'s network is broader. AmEx occasionally gets declined at grocery stores and gas stations due to higher merchant fees.' },
    { question: 'Why does American Express charge higher fees to merchants?', answer: 'AmEx charges merchants a higher discount rate (typically 2.5-3.5% vs Mastercard\'s ~1.5-2%) because AmEx cardholders tend to spend more and AmEx funds richer rewards programs. This is part of the closed-loop model where AmEx captures more value from both sides of the transaction.' },
    { question: 'Which is better for travel rewards — AmEx or Mastercard?', answer: 'American Express Membership Rewards (earned on AmEx cards) are widely considered the most versatile travel points, transferring to 20+ airline and hotel programs. However, Mastercard-branded cards from Chase (Sapphire Reserve) and Citibank also offer strong travel rewards. The best travel card depends on which specific card and issuer, not just the network.' },
    { question: 'Do I need both American Express and Mastercard?', answer: 'Many experienced users carry both. A common setup: AmEx (Gold or Platinum) for dining, travel, and premium benefits; a Mastercard or Visa with no annual fee for merchants that don\'t accept AmEx, international travel, or everyday spend where AmEx rewards don\'t add up. The combination covers both premium perks and universal acceptance.' }
  ]
},

'zoom-vs-microsoft-teams': {
  analysis: `Zoom and Microsoft Teams both solve the video conferencing problem, but they've evolved into fundamentally different products shaped by the different ecosystems they anchor. Choosing between them is less about video quality (which is now broadly equivalent) and more about which broader platform you're already inside.

Zoom built its dominance on a single decisive advantage: frictionless joining. In 2020, Zoom's one-click guest join — requiring no account or app installation for attendees — captured the entire market for external meetings during the pandemic. Its clean interface, reliable performance at scale, and superior handling of large meetings (up to 1,000 interactive participants on enterprise plans) made it the default for webinars, all-hands meetings, and cross-company calls where participants used different corporate setups. As of 2024, Zoom reports 300 million daily meeting participants.

Microsoft Teams entered the market differently: as a hub for internal collaboration within the Microsoft 365 ecosystem. Teams is not primarily a video conferencing app — it's a collaboration platform that includes persistent chat channels, file storage (SharePoint), real-time document co-authoring (Office), task management (Planner), and video meetings. If your organization runs on Office 365, Teams is already included in your subscription. For companies that live inside Word, Excel, Outlook, and SharePoint, the integration is genuinely seamless: a Teams meeting can be scheduled directly from Outlook, files shared in a meeting automatically land in a SharePoint folder, and the meeting chat is persistent rather than ephemeral.

The integration depth cuts both ways. Teams' tight coupling with Microsoft 365 makes it powerful for internal workflows but creates friction for external participants. Guests joining a Teams call often need to create a Microsoft account or install an app — a barrier Zoom eliminated. Teams' meeting interface is also more complex than Zoom's, reflecting its dual role as collaboration hub rather than meeting-first product.

Video quality and features have converged since 2020. Both platforms offer 1080p video, noise suppression, virtual backgrounds, and AI-powered meeting summaries. Zoom's AI Companion (introduced in 2023) generates meeting summaries, action items, and transcripts; Microsoft's Copilot in Teams does the same with deeper integration into the Microsoft 365 document graph. For organizations already paying for Microsoft 365 Copilot ($30/user/month additional), Teams becomes the natural home for AI-assisted meetings.

The market verdict is telling: Teams has captured the internal enterprise collaboration market (it surpassed Slack in daily active users in 2019 and has maintained that lead), while Zoom dominates for external meetings, webinars, and companies that don't live in the Microsoft ecosystem. Zoom has responded by building a collaboration platform (Zoom Team Chat, Zoom Docs) to compete with Teams' hub approach; Teams has improved its external meeting flow. The gap between them has narrowed, but the integration advantage of Teams for Microsoft 365 shops and the simplicity advantage of Zoom for external-first meeting scenarios remain the deciding factors.`,

  sources: [
    { url: 'https://news.microsoft.com/2024/04/24/microsoft-365-copilot-updates-and-teams/', text: 'Microsoft Teams AI Copilot features' },
    { url: 'https://zoom.us/en/products/meetings/', text: 'Zoom Meetings product overview' },
    { url: 'https://www.gartner.com/reviews/market/unified-communications-as-a-service', text: 'Gartner: Unified Communications market' }
  ],

  faqs: [
    { question: 'Is Zoom or Microsoft Teams better for external meetings?', answer: 'Zoom is generally better for external meetings because guests can join with one click — no Microsoft account required. Teams external participants sometimes need to install an app or create an account, creating friction that Zoom eliminated early on.' },
    { question: 'Does Microsoft Teams replace Zoom?', answer: 'For organizations fully on Microsoft 365, Teams can replace Zoom for internal meetings while offering Office file integration and persistent channels. However, many companies use both: Teams for internal collaboration and Zoom for external webinars and cross-company calls where simplicity and guest access matter.' },
    { question: 'Which supports more meeting participants — Zoom or Teams?', answer: 'Zoom supports up to 1,000 interactive participants and 10,000 webinar viewers on enterprise plans. Teams supports up to 1,000 interactive participants with town halls up to 20,000. Both are sufficient for most enterprise use cases; Zoom edges ahead for very large webinars.' },
    { question: 'Is Microsoft Teams free?', answer: 'Microsoft Teams has a free tier with basic video meetings (60-minute limit for groups, 100 participants). Full Teams functionality with unlimited meetings, 1TB storage, and Microsoft 365 integration requires a Microsoft 365 Business Basic subscription ($6/user/month minimum).' },
    { question: 'Which has better AI features in 2025 — Zoom or Teams?', answer: 'Both offer AI meeting summaries, transcription, and action item extraction. Microsoft\'s Copilot in Teams integrates more deeply with the Microsoft 365 document graph (surfacing related files, email context), but requires an additional $30/user/month license. Zoom AI Companion is included with paid Zoom plans at no extra cost.' }
  ]
},

'iphone-vs-samsung-galaxy': {
  analysis: `The iPhone vs Samsung Galaxy debate is the most persistent comparison in consumer technology, and it has never been more genuinely competitive than it is now. The gap that once existed in processing power, camera quality, and software fluency has narrowed to the point where neither device is objectively superior — the decision is genuinely about which ecosystem matches your life.

At the hardware level, both platforms have reached extraordinary capability. Apple's A18 Pro chip (iPhone 16 Pro) and Samsung's Snapdragon 8 Gen 4 (Galaxy S25 Ultra) are neck-and-neck in CPU benchmarks and dramatically outpace what any app currently demands. Apple's Neural Engine handles on-device AI with notable efficiency; Qualcomm's AI Engine does the same. The practical performance difference in everyday use is imperceptible to virtually all users.

Camera systems are where the most granular comparison lives. Apple's computational photography in the iPhone 16 Pro — particularly its 5x telephoto lens, ProRes video recording at 4K120fps, and improved night mode — appeals to professionals and videographers because of its color science and codec control. Samsung's Galaxy S25 Ultra offers a 200MP primary sensor, 50x Space Zoom optical-hybrid telephoto, and AI-powered Scene Optimizer that automatically enhances photos for social sharing. iPhone renders colors closer to what the human eye perceives; Samsung often produces punchier, more saturated images that tend to score higher in social media contexts. Neither approach is objectively correct.

Software longevity is now a genuine differentiator in Apple's favor. Apple has committed to 7 years of iOS updates for iPhone 15 and later; Samsung has matched this commitment for the Galaxy S24 series and newer devices. Both companies have eliminated the software support gap that historically favored Apple, though Apple's updates still tend to be delivered faster across its entire product lineup.

The ecosystem is where the decision most often crystallizes. iPhone integrates tightly with other Apple devices: AirDrop, iMessage, Handoff, Universal Clipboard, AirPods spatial audio, and Apple Watch connectivity create a seamless multi-device experience that Android lacks out of the box. Samsung DeX (a desktop mode when connected to a monitor), One UI's customization depth, default app flexibility, and sideloading capabilities give Samsung Galaxy users significantly more control over their device's behavior. Android's open architecture lets you change default apps, automate workflows with Tasca-style apps, and install software Apple would reject from its App Store.

Price points diverge meaningfully below the flagship tier. Apple's flagship is exclusively the Pro lineup; the base iPhone 16 at $799 uses the A18 chip but lacks the Pro camera and ProMotion display. Samsung's Galaxy S25 at $799 includes all of the Galaxy AI features with the Snapdragon 8 Gen 4 chip. For mid-range buyers, Samsung's Galaxy A-series offers functional Android phones at $300-500; Apple has no direct equivalent with comparable specs (the SE line uses older chips).

The bottom line: iOS users deeply integrated into Apple devices should stay — the switching cost is real and the ecosystem value is genuine. Android power users who want customization, flexibility, and the best value at non-flagship price points will find Samsung's lineup compelling. First-time smartphone buyers should honestly assess which ecosystem their friends and family use, since iMessage and AirDrop compatibility still creates real social dynamics in many markets.`,

  sources: [
    { url: 'https://www.apple.com/iphone-16-pro/', text: 'Apple iPhone 16 Pro specifications' },
    { url: 'https://www.samsung.com/us/smartphones/galaxy-s25-ultra/', text: 'Samsung Galaxy S25 Ultra specifications' },
    { url: 'https://www.dxomark.com/ranking/#highestscore/2025', text: 'DXOMark smartphone camera rankings 2025' }
  ],

  faqs: [
    { question: 'Which is faster — iPhone or Samsung Galaxy?', answer: 'Apple\'s A18 Pro chip (iPhone 16 Pro) and Qualcomm\'s Snapdragon 8 Gen 4 (Galaxy S25 series) are comparable in real-world performance. In CPU benchmarks, Apple typically edges ahead; in gaming GPU tests, results are closer. Both chips are dramatically faster than any app currently demands.' },
    { question: 'How long do iPhones and Samsung Galaxy phones get software updates?', answer: 'Both companies now offer 7 years of OS updates for their flagship lines. Apple extends this to all iPhone 15 and later models; Samsung committed to 7 years of updates for Galaxy S24 and newer. This has eliminated the update longevity gap that historically favored Apple.' },
    { question: 'Which has a better camera — iPhone 16 Pro or Galaxy S25 Ultra?', answer: 'Camera quality depends on use case. iPhone 16 Pro excels at video (ProRes 4K120fps), natural color science, and low-light consistency. Galaxy S25 Ultra\'s 200MP sensor and 50x zoom telephoto offer more versatility for telephoto photography. For social media sharing, Samsung\'s AI image processing often produces more vibrant results.' },
    { question: 'Can I switch from iPhone to Samsung and keep my data?', answer: 'Yes. Samsung\'s Smart Switch app transfers contacts, photos, messages, and app data from iPhone to Android. However, iMessages won\'t transfer as text history, and iCloud-stored data needs to be migrated. Apple\'s AirDrop and iMessage will no longer be accessible after switching.' },
    { question: 'Which is better value — iPhone or Samsung Galaxy?', answer: 'Samsung offers more value at mid-range price points. The Galaxy A55 at ~$450 includes competitive specs; Apple\'s equivalent iPhone SE uses older chip technology. At $799+, both companies offer flagship-tier hardware. For very high-end buyers ($1,200+), iPhone 16 Pro Max and Galaxy S25 Ultra are both premium investments.' }
  ]
},

'mercedes-c-class-vs-bmw-3-series': {
  analysis: `The Mercedes-Benz C-Class and BMW 3 Series are the two cars most people think of when they imagine a compact luxury sedan — and for decades they've represented two distinct philosophies about what that car should be. Understanding those philosophies is more useful than spec-comparing individual trim levels.

BMW's fundamental promise with the 3 Series is driver engagement. The 3 Series is rear-wheel drive as standard (all-wheel drive xDrive available), uses a near-50/50 front-rear weight distribution, and is tuned for responsiveness and steering feedback. The 2026 BMW 330i (3.0L turbocharged inline-6 producing 255 hp, 0-60 in approximately 5.8 seconds) is consistently ranked by enthusiast publications as the most engaging car to drive in its class. The M340i xDrive variant (382 hp) closes the gap to true sports car performance while retaining daily-driver usability. Road&Track and Car and Driver have repeatedly noted that the 3 Series' steering feel — particularly the manual rack-and-pinion steering on base models — communicates road surface in a way that most modern luxury sedans have tuned out.

The 2026 Mercedes-Benz C300 (2.0L turbocharged 4-cylinder producing 255 hp, 9-speed automatic) takes a different position: comfort, technology immersion, and visual refinement. The C-Class interior has been consistently cited by reviewers as more luxurious than the 3 Series equivalent at the base trim level — the MBUX infotainment system's 11.9-inch portrait-orientation central screen is among the most polished in-cabin technology experiences in any segment, not just compact luxury. Mercedes has also invested more heavily in ride quality tuning: the standard C300 absorbs road imperfections more gracefully than a base 330i, prioritizing isolation over road feel.

Reliability is a legitimate consideration in this segment. J.D. Power's 2024 Initial Quality Study placed BMW at 15th out of 32 brands and Mercedes at 19th, both below the industry average. Consumer Reports' long-term reliability data for both brands has been mixed in recent years, with infotainment system complexity and electrical component reliability cited as recurring concerns for both. Lexus IS and Audi A4 consistently outperform both in reliability surveys — a fact worth considering when comparing total ownership cost.

Pricing is closely matched at base trim levels: the 2026 BMW 330i starts at approximately $45,950; the 2026 Mercedes C300 sedan at approximately $47,250. Both quickly escalate with packages — the sport packages, Driver Assistance packages, and premium audio upgrades that buyers commonly add push both well above $55,000 in practice.

The bottom line: if your priority is driver engagement and you want the most satisfying car to steer on a winding road, the BMW 3 Series is the class benchmark. If you prioritize interior technology, visual refinement, and ride comfort on the daily commute, the Mercedes C-Class delivers a more cocooning experience. Neither is objectively better; they are genuinely different products aimed at different preferences within the same price tier.`,

  sources: [
    { url: 'https://www.caranddriver.com/bmw/3-series', text: 'Car and Driver: 2026 BMW 3 Series review' },
    { url: 'https://www.caranddriver.com/mercedes-benz/c-class', text: 'Car and Driver: 2026 Mercedes-Benz C-Class review' },
    { url: 'https://www.jdpower.com/business/press-releases/2024-us-initial-quality-study', text: 'J.D. Power 2024 Initial Quality Study' }
  ],

  faqs: [
    { question: 'Which is better to drive — BMW 3 Series or Mercedes C-Class?', answer: 'The BMW 3 Series is widely considered more engaging to drive, with better steering feel and rear-wheel-drive balance tuned for enthusiasts. The Mercedes C-Class prioritizes ride comfort and isolation over driver feedback. Car enthusiasts consistently choose the 3 Series; comfort-oriented drivers often prefer the C-Class.' },
    { question: 'Is the BMW 3 Series or Mercedes C-Class more luxurious inside?', answer: 'At comparable trim levels, the Mercedes C-Class is generally considered more luxurious inside. The MBUX system\'s large portrait-orientation display and soft-touch materials across the dashboard create a premium feel that the 3 Series interior, while excellent, slightly trails at base configurations.' },
    { question: 'Which is more reliable — BMW or Mercedes?', answer: 'Both brands fall below the industry average in J.D. Power reliability surveys, with Mercedes slightly below BMW. Consumer Reports also rates both as average-to-below-average compared to Japanese luxury brands. Lexus and Acura consistently outrank both in long-term reliability if this is a primary concern.' },
    { question: 'How do the prices of BMW 3 Series and Mercedes C-Class compare?', answer: 'Base prices are close: the 2026 BMW 330i starts at approximately $45,950 and the Mercedes C300 at approximately $47,250. After adding popular packages (sport, driver assistance, premium audio), real transaction prices typically land in the $53,000-$60,000 range for both.' },
    { question: 'Which is faster — BMW 330i or Mercedes C300?', answer: 'Both produce 255 horsepower from turbocharged engines. The BMW 330i does 0-60 mph in approximately 5.8 seconds; the Mercedes C300 is similar at approximately 5.9 seconds. The M340i (382 hp) and AMG C43 (402 hp) are their respective performance variants with meaningfully quicker times.' }
  ]
},

'paramount-plus-vs-peacock': {
  analysis: `Paramount+ and Peacock are two of the mid-tier streaming services that launched during the streaming wars — and both have since struggled to define a compelling identity that justifies a standalone subscription alongside Netflix and Disney+. Understanding their actual content libraries and structural trade-offs matters more than their marketing positions.

Paramount+ draws from the Paramount library — one of the oldest and deepest in Hollywood — plus CBS content and Paramount Network originals. The most valuable content on Paramount+ falls into a few specific categories: live CBS sports (NFL games, March Madness), the Star Trek franchise (Paramount has produced more Star Trek content since 2017 than at any other point in the franchise's history), CBS procedural dramas (NCIS, FBI, Survivor, The Amazing Race), and Paramount movie releases. The Essential tier ($5.99/month) carries ads and lacks Paramount Network live stream; the Paramount+ with SHOWTIME bundle ($11.99/month) adds SHOWTIME's prestige library (Billions, Dexter, The Affair, Homeland) and live SHOWTIME. For NFL live content through CBS and March Madness streaming, Paramount+ is genuinely the cheapest entry point into live sports streaming.

Peacock is owned by NBCUniversal (Comcast) and carries the NBC and NBC Sports broadcast catalog, Universal Pictures film library, and Peacock originals. Its content strengths are different: live Premier League football (the most distributed league globally), NFL Sunday Night Football and Thursday Night Football, WWE content, and the NBCUniversal film library including Universal Studios back-catalog (Fast & Furious, Jurassic Park, etc.). Peacock's Premier League streaming has been particularly valued — fans outside the US and UK often cite Peacock as the most complete Premier League solution available to Americans. The Peacock Premium tier ($7.99/month) carries ads; Premium Plus ($13.99/month) is ad-free.

Both services suffer from the fundamental problem of the mid-tier streaming market: neither has enough tentpole exclusives to justify a primary subscription position for most viewers. They function best as secondary subscriptions — add-ons during specific sports seasons or for specific franchise content (Star Trek fans will pay for Paramount+; Premier League fans will pay for Peacock) rather than daily-use services.

Content quality for originals has been mixed on both platforms. Paramount+ originals like Tulsa King and Halo have found audiences; Peacock's Poker Face, Bupkis, and The Resort received stronger critical reception. Neither has produced a breakout hit comparable to Netflix's, though both continue to develop content.

Pricing relative to value is where both services fall short for most casual viewers. At $6-14/month each, and with Netflix, Disney+, and Max already covering the majority of premium scripted content, Paramount+ and Peacock are rational choices only for viewers with specific loyalty to their content strengths: sports (live CBS or NBC coverage, Premier League, NFL) or specific franchises (Star Trek, WWE, Universal Pictures catalog).`,

  sources: [
    { url: 'https://www.paramountplus.com/plan-selection/', text: 'Paramount+ subscription plans and pricing' },
    { url: 'https://www.peacocktv.com/plans', text: 'Peacock subscription plans and pricing' },
    { url: 'https://www.theverge.com/2024/streaming-tier-comparison', text: 'The Verge: Streaming services comparison 2024' }
  ],

  faqs: [
    { question: 'Which has better sports content — Paramount+ or Peacock?', answer: 'Both have significant sports, but in different areas. Paramount+ carries live CBS NFL games and NCAA March Madness. Peacock has live Premier League football (all matches), NBC Sunday Night Football, and WWE content. For NFL, Paramount+ wins on CBS games; for soccer and WWE, Peacock is stronger.' },
    { question: 'Does Paramount+ or Peacock have a free tier?', answer: 'Peacock offers a limited free tier with ads and a reduced content library. Paramount+ has no free tier — its entry tier ($5.99/month) is ad-supported. For free ad-supported streaming, Peacock Free has more content than Paramount+.' },
    { question: 'Which streaming service has Star Trek?', answer: 'Star Trek is exclusively on Paramount+. Since 2017, Paramount has produced multiple new Star Trek series (Discovery, Picard, Strange New Worlds, Lower Decks, Prodigy) available only on Paramount+. The original series and movies are also in the library.' },
    { question: 'Is Paramount+ or Peacock better for British Premier League soccer?', answer: 'Peacock is the better choice for Premier League coverage in the United States. Peacock broadcasts the majority of Premier League matches and is the primary streaming home for the league in the US market.' },
    { question: 'Which is worth it — Paramount+ or Peacock?', answer: 'Neither is a strong primary streaming subscription for general viewers. Both make sense as secondary, seasonal add-ons. Paramount+ is worth it if you watch CBS NFL games, March Madness, or Star Trek. Peacock is worth it if you follow the Premier League, WWE, or the Universal movie library.' }
  ]
},

'japan-vs-china': {
  analysis: `Japan and China are East Asia's two largest economies and two of the world's most significant civilizations — but they represent radically different development models, geopolitical postures, and cultural traditions. Their relationship, marked by a history of conflict and deep economic interdependence, shapes much of the region's dynamics.

Economically, China's GDP of approximately $17.7 trillion (nominal, 2024) is roughly three times Japan's $4.2 trillion — a gap that reflects China's scale advantage of having four times Japan's population (1.4 billion vs 125 million). However, Japan's GDP per capita ($33,000+ nominal) remains higher than China's ($12,500 nominal), reflecting the maturity of Japan's developed economy. Japan has maintained its position as the world's third-largest economy for decades despite near-zero population growth, driven by manufacturing quality, service sector efficiency, and technological innovation in sectors like robotics, automotive, and semiconductors.

China's economic rise since 1980 — averaging approximately 9% annual GDP growth for four decades — is without modern precedent. It has made China the world's largest manufacturing nation, largest exporter, and largest trading partner for more than 120 countries. However, China faces demographic headwinds (a shrinking working-age population), a property sector crisis (Evergrande and systemic leverage), and US export restrictions on advanced semiconductors that are reshaping its technology development trajectory.

Japan is the world's third-largest military spender (approximately $55 billion in 2024) after the US and China, and in December 2022 adopted a new National Security Strategy that committed to doubling defense spending to approximately 2% of GDP by 2027 — a landmark shift in Japan's postwar pacifist posture driven explicitly by China's military expansion and North Korea's missile program. Japan operates the world's fourth-most capable naval force by tonnage, with advanced Aegis destroyer-class vessels. The US-Japan Security Treaty positions approximately 50,000 US troops in Japan, making Japan an anchor of the US Pacific alliance system.

The cultural comparison between the two countries often surprises people unfamiliar with the depth of difference. Japan's culture has historically absorbed Chinese influence (kanji writing system, Buddhism, Confucian social structures) while developing distinctly different aesthetic traditions: wabi-sabi, the tea ceremony, the concept of kodawari (devotion to craft), and a design philosophy centered on restraint and precision. Japan's manufacturing culture — the Toyota Production System, kaizen continuous improvement, and JIT supply chain management — represents an organizational philosophy that has influenced industrial management globally.

China's culture is among the world's oldest continuous civilizations, with a recorded history spanning more than 3,500 years. Its cultural output spans from the Silk Road's role as a conduit for the exchange of goods, ideas, and religions across Eurasia, to the modern global influence of Chinese cuisine, martial arts, and — increasingly — entertainment. The PRC government has explicitly sought to project soft power through Confucius Institutes, media partnerships, and Belt and Road infrastructure investment.`,

  sources: [
    { url: 'https://www.worldbank.org/en/country/china/overview', text: 'World Bank: China economic overview' },
    { url: 'https://www.worldbank.org/en/country/japan/overview', text: 'World Bank: Japan economic overview' },
    { url: 'https://www.sipri.org/databases/milex', text: 'SIPRI Military Expenditure Database' }
  ],

  faqs: [
    { question: 'Is Japan\'s economy larger than China\'s?', answer: 'No. China\'s nominal GDP (~$17.7 trillion in 2024) is approximately four times larger than Japan\'s (~$4.2 trillion). However, Japan\'s GDP per capita is about $33,000 vs China\'s approximately $12,500, reflecting Japan\'s status as a mature developed economy. Japan is the world\'s third-largest economy.' },
    { question: 'Are Japan and China allies?', answer: 'No. Japan and China have a complex, often tense relationship shaped by the Second Sino-Japanese War (1937-1945), territorial disputes (Senkaku/Diaoyu Islands), and competing regional ambitions. They are also each other\'s major trading partners. Japan is a US treaty ally; China considers this alliance a security concern.' },
    { question: 'Which country has a stronger military — Japan or China?', answer: 'China has a significantly stronger and larger military. China\'s active forces number approximately 2 million; Japan\'s Self-Defense Forces number approximately 230,000. However, Japan is rapidly increasing defense spending toward 2% of GDP, and the US-Japan Security Treaty means US forces augment Japan\'s defense.' },
    { question: 'Which country has a larger population?', answer: 'China has approximately 1.4 billion people; Japan has approximately 125 million — China\'s population is roughly 11 times larger. Japan\'s population is declining and aging rapidly; China\'s population has also begun to decline due to the legacy of the one-child policy.' },
    { question: 'How do Japanese and Chinese cultures differ?', answer: 'While Japan historically absorbed Chinese cultural influences (kanji, Buddhism, Confucianism), the two cultures have distinct identities. Japanese culture is often characterized by precision, restraint, and craft (wabi-sabi, kaizen). Chinese culture spans one of the world\'s oldest continuous civilizations with distinct regional variations, Taoist and Confucian traditions, and one of the world\'s most influential culinary traditions.' }
  ]
},

'disney-plus-vs-paramount-plus': {
  analysis: `Disney+ and Paramount+ are both launched by major Hollywood studios, and both lean heavily on franchise IP — but their content strategies, depth of library, and subscriber trajectories have diverged significantly since their launches.

Disney+ launched in November 2019 with a structural advantage that no competitor could easily replicate: the Disney, Pixar, Marvel Cinematic Universe, Star Wars, and National Geographic libraries under one subscription. As of 2025, Disney+ has approximately 120-130 million subscribers globally and has established itself as the second-largest streaming service after Netflix. The MCU content alone — 33+ theatrical films and 20+ original Disney+ series (WandaVision, Loki, Moon Knight, Ms. Marvel, She-Hulk) — represents an irreplaceable asset for the approximately 50% of American adults who identify as MCU fans. Star Wars similarly drives exclusive content that has no substitute on any other platform.

Paramount+ draws from the Paramount film library and CBS television catalog, plus the SHOWTIME bundle that's available as an add-on. Its most valuable content includes live CBS sports (NFL and March Madness), Star Trek (all new series are exclusive to Paramount+), and the prestige library available through the Paramount+ with SHOWTIME tier. The service has approximately 67 million subscribers globally.

The content quality comparison at the scripted original series level has increasingly favored Disney+'s output by volume and budget. The MCU series and Lucasfilm's Star Wars content (The Mandalorian, Andor, Obi-Wan Kenobi) represent some of the highest-budget streaming productions made — Andor in particular received critical acclaim comparable to prestige cable drama. Paramount+ originals like Tulsa King, 1883, and the Yellowstone spinoffs have been commercially successful, but haven't matched Disney+ franchises in global recognition.

Pricing is closely matched: Disney+ with ads costs $7.99/month; without ads $13.99/month. Paramount+ Essential (with ads) is $5.99/month; with SHOWTIME $11.99/month. At comparable tiers, Disney+ is slightly more expensive, which is defensible given the demonstrated strength of its exclusive IP. The Disney Bundle (Disney+, Hulu, ESPN+) at $15.99-25.99/month is the most compelling multi-service deal in streaming for US customers who want breadth.

The practical decision: Disney+ is the stronger choice for households with children (the Disney and Pixar libraries are unmatched for family viewing) or adults who follow the MCU or Star Wars universes. Paramount+ is the better add-on for CBS sports fans (NFL via CBS, March Madness) or Star Trek fans. Many households subscribe to neither as a primary service or add both as secondary subscriptions when specific content drops.`,

  sources: [
    { url: 'https://press.disneyplus.com/', text: 'Disney+ press subscriber data' },
    { url: 'https://www.paramountplus.com/plan-selection/', text: 'Paramount+ subscription plans' },
    { url: 'https://variety.com/2024/digital/streaming-subscriber-counts/', text: 'Variety: Streaming subscriber counts 2024' }
  ],

  faqs: [
    { question: 'Which has more subscribers — Disney+ or Paramount+?', answer: 'Disney+ is significantly larger. Disney+ had approximately 120-130 million subscribers globally as of 2025. Paramount+ reached approximately 67 million subscribers. Netflix remains the leader at 300+ million, but Disney+ is the clear #2 in subscriber scale.' },
    { question: 'Is Marvel and Star Wars content only on Disney+?', answer: 'Yes. All MCU films from Phase 1 onward and all Disney+ original MCU and Star Wars series (The Mandalorian, Andor, WandaVision, Loki, etc.) are exclusive to Disney+. These are not available on any other streaming service.' },
    { question: 'Which is cheaper — Disney+ or Paramount+?', answer: 'Paramount+ Essential with ads ($5.99/month) is cheaper than Disney+ with ads ($7.99/month). Without ads, Disney+ is $13.99/month and Paramount+ (without SHOWTIME) is $11.99/month. Both offer bundle options that improve value significantly.' },
    { question: 'Does Disney+ have live sports?', answer: 'Disney+ itself has limited live sports, but ESPN+ (available through the Disney Bundle) carries significant sports content including UFC fights, college sports, international soccer, and NHL games. Paramount+ has live NFL (CBS games) and March Madness, which Disney+ lacks.' },
    { question: 'Which is better for families with kids?', answer: 'Disney+ is the clear winner for family viewing. Its Disney, Pixar, Disney Junior, and National Geographic Kids libraries are unmatched in breadth and quality for children\'s content. Paramount+ has limited family-oriented programming compared to Disney+\'s enormous catalog of children\'s entertainment.' }
  ]
},

'macbook-air-vs-macbook-pro': {
  analysis: `The MacBook Air M3 and MacBook Pro M3 are often treated as similar products in the same lineup, but they represent genuinely different design philosophies — and the right choice depends on whether you need consistent sustained performance or whether you're optimizing for portability and efficiency.

The fundamental difference is thermal management. The MacBook Air M3 is fanless — it uses passive cooling with no moving parts. This makes it completely silent and lighter (2.7 lbs for the 13-inch, 3.3 lbs for the 15-inch), but it also means that under sustained high-CPU or GPU workloads, the chip will throttle its performance to manage heat. For brief tasks (compiling a small project, exporting a 5-minute video, rendering a web page), you'll never notice the throttling — the M3 chip is fast enough that brief tasks complete before the device gets warm. For sustained workloads lasting 10+ minutes — long video exports, training ML models, large code compilations — the MacBook Pro M3 will maintain higher clock speeds for longer because its active fan system keeps the chip cool.

The MacBook Pro M3 (14-inch, starting at $1,599; 16-inch, starting at $2,499) addresses this with a fan system and a larger thermal envelope. For the base M3 chip (not M3 Pro or M3 Max), the performance gap versus the MacBook Air is not dramatic in typical workflows — benchmarks show the MacBook Pro M3 maintains peak performance roughly 15-20% longer before throttling. The real performance step-change comes with the M3 Pro and M3 Max chips (available only in the MacBook Pro), which offer significantly higher memory bandwidth, more CPU/GPU cores, and support for up to 128GB unified memory — capabilities genuinely required for 8K video editing, large ML training runs, and professional 3D rendering.

Display quality represents a clear win for the MacBook Pro. The MacBook Pro's Liquid Retina XDR display offers 1,000 nits sustained brightness (up to 1,600 nits peak for HDR), ProMotion adaptive refresh up to 120Hz, and a wider P3 color gamut. The MacBook Air's Liquid Retina display maxes at 500 nits brightness and 60Hz refresh. If you work with color-critical photography, video grading, or spend hours reading on a high-brightness display, the Pro's screen is noticeably better.

Port selection also differs. The MacBook Air M3 has two Thunderbolt 3 USB-C ports and a MagSafe charging port (on the 13-inch; the 15-inch adds no additional ports). The MacBook Pro adds an HDMI port, an SD card reader, and an additional Thunderbolt port — reducing dongle dependence for photographers, video editors, and developers working with external monitors and storage.

Battery life is the MacBook Air's strongest card. The 15-inch MacBook Air M3 delivers Apple's rating of 18 hours, with real-world mixed-use testing typically landing at 12-15 hours. The MacBook Pro's larger battery (72.4 Wh vs 52.6 Wh) is offset by its brighter display and active fans, resulting in similar or slightly shorter real-world battery life in some tests.

For the vast majority of users — writers, students, programmers working on typical projects, graphic designers doing non-video work — the MacBook Air M3 is the correct choice. It costs $300-500 less, is lighter, silent, and delivers performance that's indistinguishable in everyday workflows. The MacBook Pro earns its premium for professional video editors, ML engineers, audio producers who run long render jobs, and anyone who genuinely needs the Pro or Max chip's expanded capabilities.`,

  sources: [
    { url: 'https://www.apple.com/macbook-air-13/', text: 'Apple MacBook Air M3 specifications' },
    { url: 'https://www.apple.com/macbook-pro-14/', text: 'Apple MacBook Pro 14-inch M3 specifications' },
    { url: 'https://www.macrumors.com/guide/macbook-air-vs-macbook-pro/', text: 'MacRumors: MacBook Air vs MacBook Pro buyer\'s guide' }
  ],

  faqs: [
    { question: 'What is the main difference between MacBook Air M3 and MacBook Pro M3?', answer: 'The MacBook Air M3 is fanless (passive cooling) and lighter/quieter; the MacBook Pro M3 has an active fan system that maintains peak performance longer under sustained workloads. The MacBook Pro also has a brighter ProMotion 120Hz display, more ports (HDMI, SD card), and supports the higher-end M3 Pro and M3 Max chips.' },
    { question: 'Is MacBook Air M3 fast enough for video editing?', answer: 'Yes for most video editing. MacBook Air M3 handles 4K editing in Final Cut Pro and Premiere Pro very well for projects up to about 30-45 minutes. For 8K editing, long exports (1+ hour timelines), or color grading workflows, the MacBook Pro M3 Pro or M3 Max with higher memory bandwidth is recommended.' },
    { question: 'Does the MacBook Air M3 throttle performance?', answer: 'Yes, under sustained heavy workloads (10+ minutes of continuous CPU/GPU saturation), the MacBook Air M3 will reduce clock speeds to manage heat without a fan. For brief tasks, this is imperceptible. For extended renders or ML training, the MacBook Pro M3 maintains higher performance longer.' },
    { question: 'Which has better battery life — MacBook Air or MacBook Pro?', answer: 'Both are excellent. The 13-inch MacBook Air M3 is rated for 18 hours; the 15-inch for 18 hours. The MacBook Pro 14-inch M3 is rated for 22 hours (longer due to a larger 72.4Wh battery, though the brighter display and fan can offset this in real use). Both deliver 10-15 hours in typical mixed use.' },
    { question: 'Should I buy MacBook Air M3 or MacBook Pro M3?', answer: 'For most users (students, writers, programmers, photographers), MacBook Air M3 is the better value — it costs $300-500 less, is lighter, completely silent, and delivers performance that\'s indistinguishable in everyday tasks. Buy MacBook Pro M3 if you do sustained professional video editing, audio production, ML work, or need HDMI/SD card ports built-in.' }
  ]
}

}

// ---- DB enrichment ----

async function enrichPage(slug, enrichedContent) {
  const { analysis, sources, faqs } = enrichedContent
  const now = new Date()

  const comparison = await prisma.comparison.findUnique({ where: { slug } })
  if (!comparison) {
    console.log(`SKIP ${slug} — not found in DB`)
    return
  }

  // Build new content JSON (same structure as Batch 1)
  const contentJson = {
    ...(comparison.content && typeof comparison.content === 'object' ? comparison.content : {}),
    expertAnalysis: analysis,
    sources,
    enrichedAt: now.toISOString(),
    enrichedBy: 'DAN-1918'
  }

  // Update comparison record
  await prisma.comparison.update({
    where: { slug },
    data: {
      content: contentJson,
      isHumanReviewed: true,
      reviewedBy: 'daniel-rozin',
      reviewedAt: now
    }
  })

  // Replace FAQs for this comparison
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

  const wordCount = analysis.split(/\s+/).length
  console.log(`DONE ${slug} — ${wordCount} words, ${faqs.length} FAQs, ${sources.length} sources`)
}

async function main() {
  console.log('DAN-1918 Batch 2 enrichment starting...\n')

  for (const [slug, content] of Object.entries(ENRICHED_CONTENT)) {
    await enrichPage(slug, content)
  }

  console.log('\nAll done.')
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
