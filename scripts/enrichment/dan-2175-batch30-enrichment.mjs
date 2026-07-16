/**
 * DAN-2175: Enrichment script for compare pages — batch 30
 *
 * Pages (90–101 searchImpressions):
 *   101 - bmw-i7-vs-mercedes-eqs
 *   100 - linkedin-vs-twitter
 *    98 - us-vs-china-economic-growth
 *    98 - bmw-3-series-vs-mercedes-c-class
 *    98 - paramount-vs-peacock
 *    97 - north-korea-vs-south-korea
 *    96 - mercedes-gle-vs-bmw-x5
 *    96 - xbox-series-x-vs-pc-gaming
 *    95 - logseq-vs-obsidian
 *    95 - chevy-silverado-vs-ford-f-150
 */

import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../../.env.local') })

const prisma = new PrismaClient()

// ── BMW i7 vs Mercedes EQS ────────────────────────────────────────────────────
const BMW_I7_EQS_ANALYSIS = `The BMW i7 and Mercedes-Benz EQS are the two most prominent luxury full-size electric sedans, competing directly against each other in the $100K+ segment. Both bring their brand's flagship design language and technology to the EV space.

BMW i7 (2026):
- Price: i7 xDrive60 starts at $107,300; i7 M70 xDrive from $183,000
- Range: up to 324 miles EPA (xDrive60); M70 offers 280 miles with V8-equivalent performance
- Power: xDrive60 — 536 hp (dual motor); M70 — 650 hp
- Charging: 195 kW DC fast charge (10–80% in ~34 min); 22 kW AC
- Design: bold "kidney grille" aesthetic on an EV (no need for a grille, but BMW kept it as design element); Theater Screen option — 31.3" rear screen that deploys from ceiling; iconic "angel eye" lights
- Interior: luxury BMW materials; 14.9" curved touchscreen; rear-seat focus; available individual rear seats with massage, footrest, and the Theater Screen
- Driving dynamics: traditional BMW sporty focus even at this size; responsive steering; excellent highway cruising
- Weight: ~5,800 lbs (AWD)
- Shared platform: built on the same 7 Series platform as the gasoline 740i/760i
- ADAS: BMW Personal Pilot L3 available (limited markets); standard driver assistance suite

Mercedes-Benz EQS (2026):
- Price: EQS 450+ starts at $104,400; EQS 580 4MATIC from $126,050; AMG EQS 53 from $147,550
- Range: up to 350 miles EPA (EQS 450+ RWD — one of the longest EV ranges available)
- Power: 450+ — 329 hp (RWD); 580 4MATIC — 516 hp (AWD); AMG EQS 53 — 649 hp
- Charging: 200 kW DC fast charge (10–80% in ~31 min); 22 kW AC
- Design: "one-bow" aerodynamic design (Cd 0.20 — one of the most aerodynamic production cars ever); tech-focused interior; lacks traditional grille
- Interior: MBUX Hyperscreen — 56-inch curved glass panel spanning the entire dashboard (three screens under one glass); ultra-luxury materials; rear-seat lounge ambience
- Driving dynamics: comfort-oriented; highway cruising excellence; less sporty feel than i7
- Weight: ~5,600 lbs (AWD)
- Platform: dedicated EV platform (EVA2); not shared with ICE models
- ADAS: Drive Pilot L3 certification in Germany/Nevada (Level 3 automation); leading the industry in autonomous capability

Head-to-head:
1. Range: EQS wins — 350 miles vs 324 miles
2. Interior technology: EQS wins — Hyperscreen is more spectacular
3. Driving dynamics: BMW i7 wins — sportier feel, better driver engagement
4. Autonomous driving: EQS wins — L3 Drive Pilot certified
5. Rear entertainment: BMW i7 wins — Theater Screen is more dramatic
6. Aerodynamics: EQS wins — Cd 0.20 is industry-leading
7. Brand exclusivity: tie — both are flagship sedans of their respective brands
8. Value: EQS 450+ RWD offers better range at a lower entry price`

const BMW_I7_EQS_CITATIONS = [
  { url: 'https://www.bmwusa.com/vehicles/bmwi/sedan/i7.html', text: 'BMW i7 — official specs, pricing, Theater Screen, i7 M70 performance' },
  { url: 'https://www.mbusa.com/en/vehicles/class/eqs-sedan/sedan', text: 'Mercedes-Benz EQS Sedan — official specs, Hyperscreen, Drive Pilot, range ratings' }
]

const BMW_I7_EQS_FAQS = [
  { question: 'Which has more range: BMW i7 or Mercedes EQS?', answer: 'The Mercedes EQS has a range advantage. The EQS 450+ in rear-wheel drive configuration achieves up to 350 miles EPA — one of the longest ranges of any production EV. The BMW i7 xDrive60 achieves up to 324 miles EPA. In real-world driving, both will fall 15–20% below EPA estimates at highway speeds; the EQS maintains its lead across driving conditions. The BMW i7 M70 performance variant drops to approximately 280 miles for its 650 hp output.' },
  { question: 'Is the BMW i7 or Mercedes EQS better for rear-seat passengers?', answer: 'Both excel for rear passengers, but in different ways. The BMW i7 wins if you prioritize the Theater Screen — a 31.3-inch retractable screen that deploys from the headliner with Amazon Fire TV built in, plus individual rear captain\'s chairs with massage and footrest available. The Mercedes EQS wins for interior ambiance — the MBUX Hyperscreen wraps the entire dashboard in glass and the rear-seat lounge package creates a genuinely quiet, opulent cocoon. Business-class preference: the i7\'s Theater Screen is more of an "event"; the EQS rear suite is more quietly luxurious.' },
  { question: 'Does the Mercedes EQS have Level 3 autonomous driving?', answer: 'Yes — Mercedes was the first automaker to receive legal approval for Level 3 (conditional automation) with Drive Pilot, certified in Germany and Nevada. Level 3 means the system can fully handle driving in specific conditions (highway traffic jams, up to 40 mph in Germany) and the driver can legally take their eyes off the road. The BMW i7 offers BMW Personal Pilot in select markets but is a Level 2+ system requiring driver attention. For genuine autonomous capability, the EQS is currently more advanced. Note: Level 3 approval is jurisdiction-specific and the feature requires specific hardware packages.' },
  { question: 'Are the BMW i7 and Mercedes EQS worth buying over a Tesla Model S?', answer: 'Depends on priorities. Tesla Model S Plaid ($94,990) outperforms both in acceleration (0–60 in 1.99s vs ~4s for i7/EQS), has the largest Supercharger network, and is cheaper. BMW i7 and EQS both beat the Model S for traditional luxury materials, interior refinement, dealer service experience, and brand prestige in conservative luxury markets. The i7 and EQS feel more like traditional luxury cars that happen to be electric; the Model S feels like a tech product. If Supercharger network access matters (road trips), Tesla wins. If interior luxury and brand cachet matter, i7/EQS win.' }
]

// ── LinkedIn vs Twitter ───────────────────────────────────────────────────────
const LINKEDIN_TWITTER_ANALYSIS = `LinkedIn and Twitter/X are both professional and public discourse platforms, but serve fundamentally different purposes and audiences. LinkedIn is a professional network focused on career growth and B2B; Twitter/X is a public real-time microblogging platform for news, conversation, and cultural commentary.

LinkedIn (2026):
- Users: 1 billion+ members globally; largest professional network in the world
- Ownership: Microsoft (acquired 2016 for $26.2B)
- Core use: job search, professional networking, B2B sales/marketing, thought leadership, company recruiting
- Content: long-form articles, professional updates, job postings, industry news; increasing video content
- Algorithm: favors "professional value" content; engagement from connections amplifies reach; comments > likes for reach
- Business model: LinkedIn Premium ($39.99–$99.99+/month), Recruiter licenses ($8K+/year), LinkedIn Ads, Sales Navigator
- Audience demographics: primarily professionals 25–55; strongest in North America, Europe, India; skews toward white-collar workers
- Advertising: B2B-focused; targeting by job title, company, industry, seniority — unmatched for reaching professionals
- Content moderation: relatively conservative; removes explicit content, spam; generally brand-safe
- Creator tools: LinkedIn Live (video streaming), newsletters, events, polls, LinkedIn Learning integration
- Tone: professional, relatively formal; overly promotional content gets lower reach

Twitter/X (2026):
- Users: ~350–400 million monthly active users (Musk-era stats are disputed; peak was 238M DAU in 2022)
- Ownership: X Corp (Elon Musk, acquired 2022 for $44B)
- Core use: real-time news, public discourse, politics, sports commentary, breaking news, cultural conversation
- Content: 280-character tweets (posts), long-form via X Premium, images, video, live audio (Spaces), subscriber-only content
- Algorithm: significant shift under Musk — now heavily promotes X Premium subscribers' content and Musk's own posts; organic reach for non-subscribers reduced
- Business model: X Premium ($8–22/month), advertising, creator revenue sharing (requires 500+ followers and 5M impressions)
- Audience demographics: skews younger (18–34), more diverse globally; strong in news/politics/tech/sports communities; heavy US/Japan/Brazil usage
- Advertising: significant brand-safety concerns since 2022; many major advertisers paused or reduced spending; DSA compliance issues in EU
- Content moderation: dramatically reduced under Musk; reinstated many previously banned accounts; increased far-right content; misinformation concerns
- Tone: real-time, casual, often confrontational; viral content driven by controversy and humor

Head-to-head:
1. Professional networking: LinkedIn wins decisively
2. Real-time news: Twitter/X wins
3. B2B advertising: LinkedIn wins — job title/company targeting is unmatched
4. Brand safety: LinkedIn wins — much safer advertiser environment
5. Cultural/political conversation: Twitter/X wins
6. Job searching: LinkedIn wins — dominant platform
7. Creator monetization: Twitter/X better for high-following accounts; LinkedIn better for lead generation
8. Content longevity: LinkedIn content has longer shelf life; Twitter/X is ephemeral`

const LINKEDIN_TWITTER_CITATIONS = [
  { url: 'https://business.linkedin.com/marketing-solutions/ads', text: 'LinkedIn Marketing Solutions — B2B targeting, ad formats, professional audience specs' },
  { url: 'https://business.x.com/en/advertising', text: 'X (Twitter) Ads — audience targeting, ad formats, brand safety policies post-2022' }
]

const LINKEDIN_TWITTER_FAQS = [
  { question: 'Is LinkedIn or Twitter better for B2B marketing?', answer: 'LinkedIn is significantly better for B2B marketing. LinkedIn allows targeting by job title, company size, industry, seniority level, and skills — precision that Twitter/X cannot match. LinkedIn\'s audience is actively in a professional mindset when browsing; B2B decision-makers use it to evaluate vendors. LinkedIn Ads average CPCs of $5–15+ but with conversion rates that justify the cost for high-value products. Twitter/X\'s B2B targeting is interest and keyword-based; less precise, and brand safety concerns since 2022 have caused many B2B companies to reduce Twitter/X ad spend. For enterprise software, professional services, recruiting, or any product targeting business decision-makers, LinkedIn typically delivers better ROI.' },
  { question: 'Can LinkedIn replace Twitter for following news?', answer: 'Not really. LinkedIn has improved its news content but it remains curated toward professional/business news. Breaking news, sports, politics, cultural moments, and real-time discourse still happen primarily on Twitter/X. LinkedIn\'s algorithm surfaces evergreen professional content; Twitter/X\'s strength is the immediacy of right-now events. Many professionals use both: LinkedIn for career networking and B2B content consumption, Twitter/X for staying current on fast-moving news and participating in public discourse. If you only want professional and business news, LinkedIn is sufficient. For breaking news and cultural conversation, Twitter/X remains more relevant despite its turbulence.' },
  { question: 'Should I post the same content on LinkedIn and Twitter?', answer: 'No — cross-posting the same content verbatim performs poorly on both platforms. LinkedIn rewards longer, structured content (400–1500 words) with professional insights; Twitter/X rewards punchy, real-time, often controversial or humorous observations under 280 characters. Tone differs significantly: LinkedIn skews formal and aspirational; Twitter/X is casual and can be irreverent. Strategy: write the full thought for LinkedIn as a post or article, then extract a single provocative sentence as a Twitter/X hook that links back. Different hashtag ecosystems apply. The most successful creators tailor content to each platform\'s specific format and audience expectations.' },
  { question: 'Has Twitter/X lost users since Elon Musk bought it?', answer: 'Yes, significant user exodus has occurred, though exact numbers are contested. The advertiser exodus is well-documented — major brands including Apple, Disney, IBM, and hundreds of others paused Twitter/X advertising following content moderation changes. Many prominent users (journalists, academics, public figures) moved to alternatives like Bluesky, Mastodon, and Threads. DAU peaked around 238M in early 2022 before the acquisition; reliable post-acquisition figures are not publicly disclosed. Despite user and advertiser losses, Twitter/X maintains relevance for real-time news, political discourse, sports, and tech communities. It remains the default platform for breaking news, even if its overall influence has declined from its 2020-2022 peak.' }
]

// ── US vs China Economic Growth ───────────────────────────────────────────────
const US_CHINA_ECONOMY_ANALYSIS = `The United States and China are the world's two largest economies, together representing roughly 42% of global GDP. Their economic trajectories, structures, and growth models differ fundamentally — the US is a mature, consumption-driven, innovation-led market economy; China is a state-guided, manufacturing-export-led economy transitioning toward consumption and technology.

United States Economy (2026):
- GDP: ~$30 trillion (nominal, 2025 estimate); #1 globally
- GDP per capita: ~$89,000 — among the highest in the world
- Growth rate: 2.0–2.8% annually (mature economy baseline)
- Currency: USD — world reserve currency (~58% of global reserves)
- Strengths: technology innovation (Silicon Valley, AI, biotech), financial services (Wall Street, global banking), consumer spending (70% of GDP), rule of law and IP protection, deep capital markets, entrepreneurship culture, military and diplomatic power
- Challenges: national debt ($36T+), income inequality (Gini ~0.49), healthcare costs, political polarization, infrastructure gaps
- Key sectors: technology, financial services, healthcare, defense, consumer goods, agriculture
- Trade: world's largest importer; significant trade deficits especially with China (~$280B deficit 2024)
- Dollar dominance: USD as reserve currency gives the US unique ability to finance deficits cheaply

China Economy (2026):
- GDP: ~$19–20 trillion (nominal); #2 globally; #1 by PPP ($35+ trillion)
- GDP per capita: ~$13,700 (nominal) — upper-middle income; about 15% of US per capita
- Growth rate: 4.5–5.0% annually (target); significantly slower than historical 10%+ growth pre-2015
- Strengths: world's largest manufacturer (~28% of global manufacturing output), export powerhouse, infrastructure (largest HSR network, ports), scale of domestic market (1.4B people), catching up in technology (EVs, solar, AI, 5G), enormous foreign exchange reserves ($3.1T)
- Challenges: real estate crisis (Evergrande, Country Garden collapse; 20–30% of GDP tied to property), youth unemployment (20%+), aging population, debt (250%+ debt-to-GDP including local governments), Western technology restrictions/chip export controls, geopolitical isolation risk
- Key sectors: manufacturing, real estate (declining), exports, technology, infrastructure
- State role: government directs key industries through SOEs, industrial policy, and capital allocation — not a free market economy

Comparison (2026):
1. Total GDP: US leads nominally; China leads on PPP — depends on measurement
2. Per capita income: US wins significantly — 6:1 ratio
3. Growth rate: China grows faster, but from a different stage of development
4. Innovation: US leads in frontier technology (AI, biotech, semiconductors); China catching up rapidly in applied tech, EVs, solar
5. Manufacturing: China wins — world's factory floor
6. Financial markets: US wins — deeper, more liquid, globally trusted
7. Geopolitical risk: China faces more external economic risk (tariffs, chip controls); US faces less but has domestic political risk`

const US_CHINA_ECONOMY_CITATIONS = [
  { url: 'https://www.worldbank.org/en/country/china/overview', text: 'World Bank China overview — GDP, growth rates, poverty reduction, structural challenges' },
  { url: 'https://www.bea.gov/news/2025/gross-domestic-product-fourth-quarter-and-year-2024-advance-estimate', text: 'BEA — US GDP advance estimate, growth rate, sector breakdown' }
]

const US_CHINA_ECONOMY_FAQS = [
  { question: 'Will China\'s economy surpass the US?', answer: 'This is one of the most debated economic questions. By PPP (purchasing power parity), China already surpassed the US around 2014. By nominal GDP, the IMF\'s 2024 projections suggest China may surpass the US sometime in the 2030s — but this timeline has repeatedly been pushed back. Factors that could prevent or delay China overtaking: demographic headwinds (population peaked and is aging rapidly), the property sector crisis (Evergrande/Country Garden wiped out enormous wealth), Western tech restrictions (chip export controls limiting AI/semiconductor development), and structural limits to the state-led economic model. China\'s recent economic slowdown (growth falling from 10%+ to ~5%) has led many economists to revise projections toward a China that challenges but does not definitively overtake the US nominal economy within the next decade.' },
  { question: 'Why does China grow faster than the US?', answer: 'China grows faster primarily because it started from a lower base. When a developing economy invests in basic infrastructure (roads, electricity, factories), adopts established foreign technologies, and urbanizes its rural population, it can grow rapidly by convergence — catching up to developed-world productivity. The US, as the technological frontier, must invent new productivity gains, which is slower. Additionally, China has mobilized an enormous labor force into industrial production and invested heavily in infrastructure and manufacturing capacity. However, as China approaches middle-income status and faces headwinds (demographics, debt, tech restrictions), its growth rate has slowed significantly from 10%+ to ~5%. The economic literature calls this the "middle-income trap" — many countries slow at this stage.' },
  { question: 'How do US and China tariffs affect each other\'s economies?', answer: 'The US-China trade relationship involves roughly $500–600B in annual goods trade. Tariffs imposed since 2018 (Trump tariffs, largely maintained and expanded by Biden, further expanded under Trump 2025) raise costs for US consumers and businesses that import Chinese goods, and reduce demand for Chinese exports. China has retaliated with its own tariffs on US goods (soybeans, aircraft, cars). The impact: US manufacturing has partially reshored or shifted to Vietnam/Mexico (nearshoring); Chinese exporters have diversified toward ASEAN and Global South; US consumers pay higher prices for affected goods (electronics, clothing, furniture, EV components). Neither side has clearly "won" the trade war — it has accelerated decoupling and supply chain diversification globally.' }
]

// ── BMW 3 Series vs Mercedes C-Class ─────────────────────────────────────────
const BMW3_CCLASS_ANALYSIS = `The BMW 3 Series and Mercedes-Benz C-Class are the definitive entry-luxury sport sedans, battling for the same buyer for 40+ years. Both start around $45,000–50,000 and represent the benchmark for what a compact luxury sports sedan should be.

BMW 3 Series (2026, G20 generation):
- Price: 330i starts at $44,995; 330i xDrive $47,395; 340i $56,995; M340i $63,900; M3 from $77,900
- Engine lineup: 2.0L turbo-4 (255–382 hp), 3.0L inline-6 turbo (374–503 hp M340i/M3)
- 0–60: 330i ~5.6s; M340i ~4.4s; M3 Competition ~3.5s
- Driving dynamics: BMW's core strength — the 3 Series is the driver's sedan benchmark; excellent steering feedback, balanced chassis, rear-wheel-drive standard
- Technology: 14.9" curved display with iDrive 8; Head-Up Display available; BMW's ConnectedDrive suite; over-the-air updates
- Interior: driver-focused; high-quality materials; back seat is tight (wheelbase shorter than C-Class); lower cargo volume
- Available body styles: sedan, touring wagon (3 Series Touring), 2-door coupe (4 Series), convertible (4 Series)
- AWD: xDrive all-wheel drive available on most models
- Reliability: generally good; maintenance costs moderate; BMW Care included (3 years/36K miles)
- Best for: driving enthusiasts, those who want the sportiest feel in the segment

Mercedes-Benz C-Class (2026, W206 generation):
- Price: C300 starts at $47,400; C300 4MATIC $50,400; C43 AMG $62,900; C63 AMG S E Performance $81,000
- Engine lineup: 2.0L turbo-4 (255 hp C300); 2.0L turbo-4 + 48V mild hybrid (C43 — 402 hp); AMG C63 uses 2.0L 4-cyl + electric motor (669 hp total — controversial departure from V8)
- 0–60: C300 ~6.2s; C43 ~4.0s; C63 ~3.4s
- Driving dynamics: comfort-oriented vs BMW; smoother, quieter ride; less driver feedback; more focused on passenger comfort
- Technology: 11.9" vertical touchscreen with MBUX; digital instrument cluster; ambient lighting (64 colors); excellent infotainment
- Interior: more spacious than 3 Series; rear seat more comfortable; C-Class interior widely considered more luxurious feeling
- Available body styles: sedan, cabriolet/convertible (C-Class Cabriolet separate model), estate wagon in Europe
- AWD: 4MATIC available on most models
- C63 controversy: new C63 replaced V8 with 2.0L 4-cylinder + electric motor — enthusiasts were divided; more power but different character
- Best for: those who want luxury feel and technology over pure driving dynamics

Head-to-head:
1. Driving dynamics: BMW 3 Series wins — the benchmark driver's car
2. Interior luxury feel: Mercedes C-Class wins
3. Rear passenger room: C-Class wins — larger footprint
4. Technology/infotainment: tie — both excellent; BMW more driver-centric, Mercedes more ambient
5. Engine character: BMW wins (especially 3.0L I6); C-Class lost fans with C63's 4-cyl change
6. Brand perception: tie — equal prestige in the segment
7. Price: BMW slightly lower entry ($44,995 vs $47,400)`

const BMW3_CCLASS_CITATIONS = [
  { url: 'https://www.bmwusa.com/vehicles/3-series/sedan/overview.html', text: 'BMW 3 Series — official pricing, specs, engine options, driving modes' },
  { url: 'https://www.mbusa.com/en/vehicles/class/c-class/sedan', text: 'Mercedes-Benz C-Class Sedan — official pricing, MBUX features, AMG variants' }
]

const BMW3_CCLASS_FAQS = [
  { question: 'Is the BMW 3 Series or Mercedes C-Class more reliable?', answer: 'Both have mixed reliability records compared to Japanese luxury brands (Lexus, Acura, Infiniti). Consumer Reports and J.D. Power data generally show BMW 3 Series and Mercedes C-Class with similar reliability, roughly average for luxury compact sedans. Specific trouble areas: BMW issues commonly involve oil leaks, cooling system failures on older models; Mercedes issues include electrical gremlins, air suspension problems (on air-suspended models), and MBUX infotainment freezes on early W206 examples. Long-term maintenance: both brands have premium maintenance costs ($800–2000+/year after warranty). Lexus IS or Acura TLX are significantly more reliable alternatives if reliability is the top priority.' },
  { question: 'Which is faster: BMW M340i or Mercedes C43 AMG?', answer: 'The BMW M340i and Mercedes-AMG C43 are close competitors. BMW M340i: 3.0L inline-6 turbocharged, 382 hp, 0–60 in approximately 4.4 seconds, $63,900. Mercedes C43 4MATIC+: 2.0L turbo-4 with 48V mild hybrid, 402 hp, 0–60 approximately 3.9–4.0 seconds. The C43 is slightly quicker in the 0–60 sprint. However, driving enthusiasts widely prefer the M340i for its 3.0L inline-6 engine character — the I6 has a smoother power delivery and more satisfying sound. The C43\'s 4-cylinder feels less characterful despite strong numbers. The M3/M3 Competition and AMG C63 are faster still but significantly more expensive ($77K+ and $81K+ respectively).' },
  { question: 'Should I buy a BMW 3 Series or Mercedes C-Class?', answer: 'Choose the BMW 3 Series if: you prioritize driving engagement (the 3 Series is the benchmark driver\'s car in the segment), you want the 6-cylinder engine option (M340i), or you find the 3 Series styling more appealing. Choose the Mercedes C-Class if: you want a more comfortable ride, value interior luxury materials and ambiance over driving dynamics, or prefer Mercedes\' MBUX technology. In the real world, both are excellent — test drive both. The differences are real but subtle; if you can\'t tell the difference on a test drive, let price and personal brand preference decide. Both hold value reasonably well in the used market.' }
]

// ── Paramount+ vs Peacock ─────────────────────────────────────────────────────
const PARAMOUNT_PEACOCK_ANALYSIS = `Paramount+ and Peacock are two of the mid-tier streaming services, both priced below Netflix/HBO Max and both relying on legacy TV content plus sports. They compete in the "second subscription" segment — services consumers add alongside Netflix.

Paramount+ (2026):
- Price: Essential (ads) $7.99/month; Paramount+ with SHOWTIME $13.99/month; annual discounts available; often bundled with Apple TV+ or through Walmart+/Verizon
- Content strengths: Star Trek franchise (all series), CBS procedurals (NCIS, FBI, Blue Bloods, Survivor, The Amazing Race), Paramount movies (Top Gun, Mission: Impossible, Transformers, Sonic), MTV/Comedy Central/Nickelodeon archives, Sports (NFL on CBS, Champions League, March Madness)
- Originals: 1883 (Yellowstone prequel), Tulsa King, The Good Fight, Rabbit Hole, Star Trek: Strange New Worlds — solid but not dominating cultural conversation
- International: available in 60+ countries; strong in English-speaking markets and Europe
- Subscribers: ~67–71 million globally (2025)
- SHOWTIME bundle: adds premium cable dramas (Homeland, Billions, Dexter, Ray Donovan, Yellowjackets)
- Sports: significant sports content — NFL CBS games, UEFA Champions League, SEC on CBS, March Madness

Peacock (2026):
- Price: Free tier (with ads); Premium $7.99/month (with ads); Premium Plus $13.99/month (limited ads); often bundled with Xfinity
- Owned by: Comcast/NBCUniversal
- Content strengths: NBC content (The Office complete library — huge draw), Bravo reality (Real Housewives, Below Deck), NBC Sports/Olympics, Universal/DreamWorks films, Law & Order franchise, Saturday Night Live, WWE wrestling
- Originals: Bel-Air (Fresh Prince reimagining), Poker Face, Mrs. Davis, Apples Never Fall, The Traitors US — growing quality slate
- Sports: significant — NFL Sunday Night Football, Olympics (exclusive US streaming rights 2024+), Premier League, NASCAR, Big Ten college sports, WWE SmackDown
- Subscribers: ~36–40 million paid subscribers in US (2025)
- The Office advantage: The Office alone drove millions of subscribers — one of the most-rewatched shows ever; exclusively on Peacock in the US
- Free tier: Peacock's free tier (with ads) is unusually generous — access to large library without paying

Head-to-head:
1. Star Trek / sci-fi: Paramount+ wins decisively
2. The Office / NBC sitcoms: Peacock wins exclusively
3. Sports breadth: tie — both strong; Paramount has Champions League, Peacock has Olympics/NFL Sunday Night
4. Movies: Paramount+ wins — strong theatrical library
5. Reality TV: Peacock wins — Bravo, WWE, The Traitors
6. Free option: Peacock wins — generous free tier exists
7. CBS procedurals: Paramount+ wins
8. Original quality: approaching tie; Peacock originals improving rapidly`

const PARAMOUNT_PEACOCK_CITATIONS = [
  { url: 'https://www.paramountplus.com/plan-choice/', text: 'Paramount+ pricing and plan comparison — Essential vs with SHOWTIME' },
  { url: 'https://www.peacocktv.com/plans', text: 'Peacock pricing tiers — Free, Premium, Premium Plus' }
]

const PARAMOUNT_PEACOCK_FAQS = [
  { question: 'Is Paramount+ or Peacock worth subscribing to?', answer: 'Both are worth subscribing to if you watch their key content. Paramount+ is worth it if you watch: Star Trek, CBS shows (NCIS, Survivor), Yellowstone universe (1883, 1923), Champions League soccer, or want SHOWTIME content. Peacock is worth it if you watch: The Office (available nowhere else in the US), NBC shows, Bravo reality (Real Housewives), Olympics coverage, or WWE. If you have Xfinity internet, Peacock may be included at no extra cost. Many subscribers rotate — subscribing for 1–2 months to watch a specific series, then canceling. Neither is a strong "always-on" subscription compared to Netflix or HBO Max unless you\'re a superfan of their core content.' },
  { question: 'Can you watch NFL on Paramount+ or Peacock?', answer: 'Yes to both, but for different games. Paramount+ streams CBS\'s NFL games — this includes AFC games (the AFC is on CBS) and Super Bowl years when CBS airs it. You can watch CBS NFL games on Paramount+ Essential ($7.99/month). Peacock streams NBC\'s NFL games — this includes Sunday Night Football (the highest-rated program in US TV) and Peacock has secured exclusive streaming rights for some playoff games. In 2024, Peacock exclusively streamed a Wildcard playoff game (Bills vs Steelers), which was controversial for putting a free-TV game behind a paywall. If you want Sunday Night Football, Peacock is required for streaming. If you want CBS AFC games, Paramount+ works.' },
  { question: 'Does Peacock have The Office all seasons?', answer: 'Yes — Peacock has all 9 seasons of The Office (US) exclusively in the United States. The Office left Netflix in January 2021 and became a Peacock exclusive. This was a major driver of Peacock subscriber growth — The Office is one of the most rewatched shows in streaming history. All 201 episodes are available on Peacock Premium ($7.99/month); a limited selection is available on the free tier. It is not available on Netflix, Amazon Prime Video, Hulu, or any other major US streaming service. If The Office is a primary reason you want to subscribe to something, Peacock is your only option.' }
]

// ── North Korea vs South Korea ─────────────────────────────────────────────────
const NK_SK_ANALYSIS = `North Korea (DPRK) and South Korea (ROK) are the two successor states from the 1945 division of the Korean Peninsula, separated since 1948 and still technically at war (the Korean War 1950–1953 ended in armistice, not peace treaty). The contrast between them is one of the starkest in the world.

South Korea (Republic of Korea) — 2026:
- Population: ~51.7 million
- GDP: ~$1.7 trillion nominal; per capita ~$35,000
- Government: presidential democracy (6th Republic); regular democratic elections
- Military: approximately 500,000 active duty; one of the world's most capable militaries; US-ROK alliance with 28,500 US troops stationed
- Economy: 4th largest in Asia; global leader in semiconductors (Samsung, SK Hynix), smartphones (Samsung), shipbuilding (Hyundai Heavy, Samsung Heavy), automotive (Hyundai, Kia), K-pop/entertainment (BTS, BlackPink, Squid Game), consumer electronics
- Living standards: high-income country; extensive public transportation; world-leading internet speeds; universal healthcare; one of the world's most wired populations
- Nuclear status: non-nuclear; relies on US extended deterrence (nuclear umbrella)
- International standing: member of G20, OECD, WHO, UN; strong diplomatic relationships globally; hosted 1988 Olympics, 2018 Winter Olympics, 2002 World Cup
- Soft power: one of the world's top 10 global cultural exporters (Hallyu — Korean Wave in music, film, food, beauty)

North Korea (Democratic People's Republic of Korea) — 2026:
- Population: ~26 million
- GDP: ~$15–25 billion (estimates vary widely; government does not publish reliable data); per capita ~$600–1,800
- Government: totalitarian dynastic state; Kim Jong-un (Kim dynasty since 1948); Workers' Party of Korea; no elections; political dissent = imprisonment or death
- Military: approximately 1.2 million active duty (among world's largest armies by headcount); heavily resource-intensive (~25% of GDP to military)
- Economy: command economy; heavily sanctioned by UN, US, EU; primary exports: weapons/missiles (now global supplier to Russia-Ukraine conflict), coal (illegal), cyber-theft (Lazarus Group — billion-dollar cryptocurrency thefts)
- Living standards: dire for most citizens; food insecurity chronic; electricity unreliable; no internet access (domestic intranet "Kwangmyong" only); near-total isolation from global economy; prison camps (kwanliso) holding estimated 80,000–120,000 people
- Nuclear status: declared nuclear weapons state; estimated 40–50 nuclear warheads; ICBM capable; ongoing missile testing despite sanctions
- International standing: extreme isolation; allies limited to Russia and China; sanctioned by UN Security Council resolutions

Key comparison:
- The income gap between North and South Korea is approximately 25–50x in per capita terms
- South Korea has transformed from one of the poorest countries in the 1950s to a high-income democracy
- North Korea remains one of the world's most repressive states and poorest economies
- Both claim the peninsula; South Korea officially includes North Korea in its territory; North Korea does the same`

const NK_SK_CITATIONS = [
  { url: 'https://www.cia.gov/the-world-factbook/countries/korea-north/', text: 'CIA World Factbook — North Korea: government, economy, military, human rights' },
  { url: 'https://www.cia.gov/the-world-factbook/countries/korea-south/', text: 'CIA World Factbook — South Korea: economy, government, demographics, military' }
]

const NK_SK_FAQS = [
  { question: 'What is the difference between North and South Korea?', answer: 'North Korea (DPRK) is a totalitarian state under Kim Jong-un, one of the world\'s most repressive governments and poorest economies, with citizens having no freedom of movement, speech, or political participation and limited food security. South Korea (ROK) is a vibrant democracy with a high-income economy, global technology companies (Samsung, LG, Hyundai), and one of the world\'s most advanced digital infrastructures. The income gap is roughly 25–50x: South Koreans earn approximately $35,000 per capita; North Koreans approximately $600–1,800. The peninsula was divided after World War II (1945) when the Soviet Union occupied the north and the US the south; the Korean War (1950–1953) ended in a ceasefire that has lasted 70+ years.' },
  { question: 'Does North Korea have nuclear weapons?', answer: 'Yes — North Korea is a declared nuclear state. It has conducted six nuclear tests (2006, 2009, 2013, 2016 twice, 2017). As of 2025, estimates suggest North Korea has approximately 40–50 nuclear warheads, with ongoing production. It has developed intercontinental ballistic missiles (ICBMs) capable of reaching the continental United States (Hwasong-15, Hwasong-17). Despite 11+ rounds of UN Security Council sanctions, North Korea has continued its weapons programs and now supplies conventional weapons and ammunition to Russia for the Ukraine war. South Korea does not have nuclear weapons and relies on the US nuclear umbrella (extended deterrence) under the US-ROK alliance.' },
  { question: 'Can South Koreans visit North Korea?', answer: 'No — South Korean citizens are legally prohibited from visiting North Korea without special government permission (rarely granted). North Korea is closed to most international tourists; in 2020 it sealed its borders entirely due to COVID-19 and has since maintained near-total closure to foreign visitors. Prior to 2020, Western tourists could visit via approved tour operators (primarily through China), but those programs have largely ended. The Kaesong Industrial Complex (joint economic zone) and Mount Kumgang tourism site — both inter-Korean cooperation projects — were suspended in 2016 and 2008 respectively. Defectors who successfully flee North Korea to South Korea cannot return without risking imprisonment or death.' }
]

// ── Mercedes GLE vs BMW X5 ────────────────────────────────────────────────────
const GLE_X5_ANALYSIS = `The Mercedes-Benz GLE and BMW X5 are the benchmark midsize luxury SUVs, both priced $60,000–90,000+ and competing for the same affluent SUV buyer. They are the two best-selling models in their segment.

BMW X5 (2026, G05 generation):
- Price: xDrive40i starts at $63,900; M60i from $86,700; X5 M Competition from $123,000; xDrive50e PHEV from $71,900
- Engine options: 3.0L turbocharged inline-6 (335 hp) standard; 4.4L twin-turbo V8 (523 hp M60i); X5 M gets 627 hp
- 0–60: xDrive40i ~5.3s; M60i ~4.1s; xDrive50e ~4.6s (PHEV boost)
- Cargo: 33.9 cu ft behind 2nd row; 72.3 cu ft max
- Seating: 5 standard (7-seat option available $875)
- Driving dynamics: BMW's hallmark — the X5 is the most driver-focused mid-size luxury SUV; better handling and more feedback than GLE
- Technology: 12.3" digital cluster + 14.9" iDrive 8 touchscreen; excellent voice assistant; OTA updates
- Towing: 7,200 lbs max (properly equipped)
- xDrive50e PHEV: 30+ miles electric range; significant efficiency gains for commuting

Mercedes-Benz GLE (2026, W167 generation):
- Price: GLE 350 starts at $60,350; GLE 450 4MATIC $72,200; AMG GLE 53 $86,450; AMG GLE 63 S $121,100; GLE 580 V8 $86,900
- Engine options: 2.0L turbo-4 (255 hp, GLE 350); 3.0L inline-6 EQ Boost mild hybrid (362 hp, GLE 450/GLE 580V8); V8 options
- 0–60: GLE 350 ~6.1s; GLE 450 ~5.2s; AMG GLE 63 S ~4.2s
- Cargo: 35.3 cu ft behind 2nd row; 82.9 cu ft max — more cargo space than X5
- Seating: 5 standard; 7-seat option available (3rd row is tight for adults)
- Driving dynamics: comfort-oriented; AIRMATIC air suspension delivers an exceptionally smooth ride; less driver engagement than X5
- Technology: MBUX with 12.3" screens; E-Active Body Control suspension (optional) can actively lean the car into corners
- Towing: 7,700 lbs max
- Interior: considered more luxurious-feeling than X5 by many reviewers; rear seat more spacious

Head-to-head:
1. Driving dynamics: BMW X5 wins — best driver's SUV in the segment
2. Ride comfort: GLE wins — AIRMATIC suspension is exceptionally smooth
3. Interior space: GLE wins — more cargo space, more rear legroom
4. Technology: BMW wins slightly — iDrive 8 more intuitive than MBUX for many users
5. Towing: GLE wins slightly — 7,700 vs 7,200 lbs
6. Entry price: GLE wins — starts $3,500 less than X5
7. PHEV option: X5 wins — xDrive50e is a strong PHEV with real-world electric range`

const GLE_X5_CITATIONS = [
  { url: 'https://www.bmwusa.com/vehicles/x-models/x5/overview.html', text: 'BMW X5 — official pricing, specs, xDrive50e PHEV, X5 M Competition details' },
  { url: 'https://www.mbusa.com/en/vehicles/class/gle/suv', text: 'Mercedes-Benz GLE SUV — AIRMATIC, E-Active Body Control, GLE 450 vs 580 specs' }
]

const GLE_X5_FAQS = [
  { question: 'Is the BMW X5 or Mercedes GLE more reliable?', answer: 'Neither has a standout reliability record versus Japanese luxury brands, but within the German luxury SUV segment they are comparable. Consumer Reports data shows the BMW X5 and Mercedes GLE with average or slightly below-average predicted reliability — both require owners to budget for higher maintenance costs than Japanese alternatives. Common X5 issues: oil leaks, cooling system, transfer case. Common GLE issues: air suspension compressor failures (on AIRMATIC-equipped models), electrical/sensor issues. Lexus RX or Acura MDX are significantly more reliable alternatives if reliability is your top priority. Both BMW and Mercedes include complimentary maintenance (oil changes, filters) for 3 years/36K miles.' },
  { question: 'BMW X5 vs Mercedes GLE: which is better for families?', answer: 'Both are excellent family vehicles; the choice depends on your priorities. The GLE wins on interior space — rear seat legroom is more generous, cargo volume is higher (35.3 vs 33.9 cu ft), and the available 7th seat (tight) gives a flexibility option. The BMW X5 wins for driving engagement — if the adult who spends the most time driving values a sporty feel, the X5 is more satisfying. The X5\'s iDrive 8 infotainment is arguably more intuitive for tech-savvy users. Both handle school runs, road trips, and family cargo equally well. Towing capacity is similar (7,200 lbs X5 vs 7,700 lbs GLE), relevant if you tow boats or trailers. For pure family utility, GLE edges ahead; for driver enjoyment + family hauling, X5.' }
]

// ── Xbox Series X vs PC Gaming ────────────────────────────────────────────────
const XBOX_PC_ANALYSIS = `Xbox Series X and PC gaming represent two distinct hardware philosophies: a fixed-spec $499 console versus an infinitely configurable (but expensive) PC platform. Microsoft uniquely bridges both through Xbox Game Pass Ultimate and Play Anywhere titles.

Xbox Series X (2026):
- Price: $499 (standard); Xbox Series S $299 (1080p/1440p digital-only)
- Hardware: custom AMD Zen 2 + RDNA 2; 12 teraflops GPU; 4K/60fps capable; 120fps in supported titles; 1TB NVMe SSD (2.4 GB/s); 16GB RAM
- Games: Xbox Game Pass Ultimate ($14.99–17.99/month) — 400+ games including all Microsoft first-party titles on day one; cross-buy with PC in many cases
- Exclusives: Halo, Forza Motorsport, Forza Horizon, Starfield, Redfall; Microsoft has acquired Bethesda, Activision Blizzard (Call of Duty, Warcraft, Overwatch), ZeniMax
- Controller: Xbox Wireless Controller — widely regarded as the best console controller; also works on PC
- Online: Xbox Live Gold (now included in Game Pass Ultimate); multiplayer gaming, party chat
- Backward compatibility: plays Xbox One, Xbox 360, and many original Xbox games natively
- Setup: plug in and play; no driver management, no compatibility issues; consistent performance
- Updates: Microsoft supports consoles for approximately 7–10 years

PC Gaming (2026):
- Entry cost: budget gaming PC ~$600–800 (1080p); mid-range ~$1,200–1,800 (1440p); high-end ~$2,500–4,000 (4K/ultra settings); GPU alone ranges $250 (RX 7600) to $1,999 (RTX 4090)
- Performance ceiling: unlimited — 4K/144fps, 8K/60fps possible at the high end; VR, ultra-wide monitors
- Games: Steam library (50,000+ games); more and cheaper during sales; many titles that never come to console; modding community extends game life massively
- Exclusives: many PC-exclusive genres (strategy, MMOs, simulation, RTS); games rarely released on console first; older PC-only games (Dwarf Fortress, etc.)
- Flexibility: use keyboard + mouse for precision; controllers supported; any monitor; custom RGB lighting; upgrade components over time
- Game Pass: Microsoft's PC Game Pass ($9.99–11.99/month) — most Xbox games available on PC too; Xbox exclusives available day one
- Backwards compatibility: infinite — games from the 1990s still play on modern PCs; no artificial limits
- Complexity: driver management, compatibility issues, optimization; troubleshooting required; game settings must be configured

Head-to-head:
1. Value at entry price: Xbox Series X wins — $499 vs $1,200+ for comparable PC
2. Peak performance: PC wins — no ceiling
3. Game library: PC wins — Steam's 50,000+ vs Xbox's library
4. Convenience: Xbox wins — plug and play, no maintenance
5. Modding: PC wins — massive modding communities
6. Multiplayer: tie — both have strong online ecosystems
7. Microsoft game access: tie — Xbox Game Pass available on both`

const XBOX_PC_CITATIONS = [
  { url: 'https://www.xbox.com/en-US/consoles/xbox-series-x', text: 'Xbox Series X — official specs, Game Pass details, backward compatibility, price' },
  { url: 'https://store.steampowered.com/', text: 'Steam — PC gaming platform; library size, sales, pricing model comparison' }
]

const XBOX_PC_FAQS = [
  { question: 'Is Xbox Game Pass available on PC?', answer: 'Yes — PC Game Pass ($9.99/month) gives access to 400+ games on Windows PC, including all Microsoft first-party titles on launch day. Xbox Game Pass Ultimate ($17.99/month) includes both console and PC Game Pass, plus Xbox Live Gold for online multiplayer. This is one of the best gaming subscription values — you get Halo, Forza, Starfield, Call of Duty, and dozens of other games for $10/month. The key limitation: games are available while they\'re in the catalog (titles rotate in and out), and the Game Pass library on PC is a subset of what\'s on console (most overlap, but not 100%). For PC gamers who like Microsoft franchises, PC Game Pass is an exceptional value.' },
  { question: 'Is PC gaming worth it over Xbox?', answer: 'PC gaming is worth the extra cost if: you want the highest possible visual fidelity (4K/120fps+), you play genres that are better on PC (strategy, MMOs, simulation, flight simulators), you value modding (Skyrim, Fallout, Minecraft with mods are transformative experiences), or you want access to the full Steam library including deep indie catalog. Xbox Series X is the better choice if: you want the best experience for the least money ($499 vs $1,200+), you prioritize plug-and-play simplicity, or you primarily play console-first games. Note: Most Xbox exclusives now also release on PC, so if you have a capable PC, you can often skip the Xbox console and still play Xbox games via Game Pass or purchase.' },
  { question: 'Is Xbox Series X still worth buying if PC gaming is an option?', answer: 'Xbox Series X is hard to justify at full price if you already have a capable gaming PC, given Microsoft\'s commitment to releasing all first-party games on PC simultaneously. The Xbox Series X makes most sense for: living room gaming where a PC setup is inconvenient, households where multiple people play on the same device, buyers who want the convenience of a console without PC complexity, or gamers who specifically want the physical DVD drive (useful for cheap used games). The Xbox Series S ($299) remains excellent value for 1080p gaming without a disc drive. If you already have a mid-range gaming PC, Xbox Game Pass for PC at $9.99/month gives you access to most Xbox content without buying the hardware.' }
]

// ── Logseq vs Obsidian ────────────────────────────────────────────────────────
const LOGSEQ_OBSIDIAN_ANALYSIS = `Logseq and Obsidian are the two most popular personal knowledge management (PKM) tools for power users who want local-first, Markdown-based note-taking with bidirectional linking. Both have strong communities but different design philosophies.

Logseq (2026):
- Price: Free and open-source (MIT license); Logseq Sync $5/month; Logseq DB version incoming (new backend)
- Core philosophy: outliner-first; every piece of content is a bullet point (block); daily journal as default entry point; graph database approach (upcoming DB version rewrites the backend)
- Format: Markdown or Org-mode files (legacy); transitioning to proprietary DB format for performance
- Bidirectional links: excellent; block-level references allow you to embed specific bullet points in other pages
- Queries: built-in Datalog queries for filtering and organizing notes programmatically; advanced feature for power users
- Graph view: visual graph of note connections; less refined than Obsidian's
- Spaced repetition: built-in flashcard system (from blocks tagged :card:)
- PDF annotations: built-in PDF reader with annotation — no plugin needed
- Plugins: growing plugin ecosystem; smaller than Obsidian's
- Mobile: iOS/Android apps available; sync available via iCloud, Logseq Sync, or third-party
- DB version controversy: Logseq announced a rewrite to a database backend (departing from plain text files); this has divided the community; plain-text-first users concerned about vendor lock-in

Obsidian (2026):
- Price: Free for personal use; Sync $10/month; Publish $20/month; Commercial license $50/year/user
- Core philosophy: markdown files in a vault; canvas view; non-linear note-taking; connecting ideas across a flat file structure; community plugin ecosystem is its superpower
- Format: pure Markdown files; your data is always in plain text and fully portable
- Bidirectional links: excellent; [[wiki-style links]] plus visual graph
- Graph view: the visual graph is one of Obsidian's signature features — elegant visualization of connections
- Plugins: 1,500+ community plugins — this is Obsidian's killer feature; Dataview plugin (query your notes like a database), Templater, Calendar, Kanban, Excalidraw canvas drawing, and hundreds more
- Spaced repetition: via plugins (Anki integration, Spaced Repetition plugin)
- PDF annotations: via plugin (Annotator) not built-in
- Mobile: excellent iOS/Android apps; Sync works well
- Stability: extremely stable; core functionality rarely breaks; files always remain accessible

Head-to-head:
1. Plugin ecosystem: Obsidian wins decisively — 1,500+ plugins vs Logseq's smaller ecosystem
2. Data portability: Obsidian wins — pure Markdown, no lock-in; Logseq's DB transition creates uncertainty
3. Outliner/journaling workflow: Logseq wins — daily journal-first, block references are powerful
4. Block-level references: Logseq wins — embed specific bullet points anywhere
5. Built-in features: Logseq wins — flashcards, PDF reader out of box
6. Graph visualization: Obsidian wins — more elegant and performant
7. Stability: Obsidian wins — Logseq's DB migration adds uncertainty
8. Spaced repetition: Logseq wins for built-in; Obsidian needs plugins`

const LOGSEQ_OBSIDIAN_CITATIONS = [
  { url: 'https://logseq.com/', text: 'Logseq — official site, outliner PKM, pricing, DB version announcement' },
  { url: 'https://obsidian.md/', text: 'Obsidian — official site, plugin ecosystem, Sync pricing, mobile apps' }
]

const LOGSEQ_OBSIDIAN_FAQS = [
  { question: 'Should I use Logseq or Obsidian for note-taking?', answer: 'Choose Logseq if: you want a daily journal as your primary entry point, you like bullet-point/outliner-style thinking, you want block-level references (embed specific bullet points in multiple notes), or you want built-in flashcards and PDF annotation. Choose Obsidian if: you want the most powerful plugin ecosystem (1,500+ plugins), you want guaranteed data portability in plain Markdown files long-term, you prefer a non-linear canvas-style note graph, or you need extreme customizability. Many power users try both for 2–4 weeks — Logseq feels more like a digital journal; Obsidian feels more like building a personal Wikipedia. If you\'re uncertain, start with Obsidian for the larger community and plugin ecosystem.' },
  { question: 'Is Logseq going away?', answer: 'Logseq is not going away, but it is going through a significant transition. Logseq announced a full rewrite to a database backend (moving away from plain Markdown files) for performance and feature improvements. This "DB version" has been in development for several years and is taking longer than expected. The transition has concerned some users who value plain-text files and data portability. The original file-based Logseq remains functional and maintained; the DB version is available in testing. The open-source community (Logseq is MIT licensed) could theoretically fork the project if the DB direction proves unpopular. Net result: Logseq is alive but its long-term direction is less predictable than Obsidian\'s.' },
  { question: 'Can Obsidian replace Notion?', answer: 'Partially, with the right plugins. Obsidian with the Dataview plugin can approximate many Notion database features — you can query your notes like a database, create table views, filter by properties. Kanban and Canvas plugins add project management views. However, Obsidian lacks: real-time collaboration (multiple people editing simultaneously), easy sharing with non-technical users, web-clipping as seamlessly as Notion, or the drag-and-drop block interface most Notion users love. For a solo knowledge worker who wants full control over their data, Obsidian beats Notion. For teams, sharing, or database-heavy project management, Notion is more practical. Many people use both: Obsidian for personal notes/knowledge, Notion for team collaboration.' }
]

// ── Chevy Silverado vs Ford F-150 ────────────────────────────────────────────
const SILVERADO_F150_ANALYSIS = `The Chevrolet Silverado and Ford F-150 are the two best-selling full-size trucks and the two best-selling vehicles in the United States, period. Together they account for roughly 25% of all vehicle sales in the US. The rivalry is generational — both families and businesses have loyalty allegiances decades deep.

Ford F-150 (2026, 14th generation):
- Price: Regular Cab ~$36,000; SuperCrew XLT ~$48,000–55,000; Limited ~$80,000; F-150 Lightning (electric) from $49,995
- Best-selling: F-150 has been the best-selling vehicle in the US for 47 consecutive years
- Engine options: 2.7L EcoBoost V6 (325 hp), 3.5L EcoBoost V6 (400 hp), 5.0L V8 (400 hp), 3.5L PowerBoost Full Hybrid (430 hp, 35 mpg highway), diesel (250 hp/440 lb-ft)
- PowerBoost Hybrid: F-150 PowerBoost gets 24 mpg city/24 highway — exceptional fuel economy for a full-size truck; onboard power export (7.2kW Pro Power Onboard) runs tools, campsite, or powers your home during outage
- Towing: up to 14,000 lbs max (properly equipped, 3.5L EcoBoost)
- Payload: up to 3,325 lbs
- Aluminum body: F-150 uses a high-strength aluminum alloy body (since 2015); lighter than steel for fuel economy; concerns about repair costs in accidents largely disproven over time
- Interior quality: Pro Power Onboard (generator), center floor fold-flat work surface, 15.5" sync 4A touchscreen on upper trims; very feature-rich
- F-150 Lightning EV: up to 320 miles range; Mega Power Frunk (large front trunk); bi-directional charging (can power your house for 3–10 days); Platinum trim up to $92K

Chevrolet Silverado 1500 (2026, 5th generation):
- Price: Regular Cab ~$35,000; Crew Cab LT ~$48,000–55,000; High Country ~$67,000+; Silverado EV from $78,000
- Engine options: 2.7L Turbo-4 (310 hp), 3.0L Duramax diesel (305 hp/495 lb-ft), 5.3L V8 (355 hp), 6.2L V8 (420 hp)
- 6.2L V8: GM's 6.2L is the most powerful naturally-aspirated V8 in the segment; satisfying V8 sound and feel; beloved by truck enthusiasts
- Towing: up to 13,300 lbs max (properly equipped)
- Payload: up to 2,280 lbs (lower than F-150)
- Steel body: traditional steel construction; known for durability; repair costs more predictable than aluminum
- Interior quality: Multi-Pro tailgate (six modes); strong interior options; 13.4" infotainment screen on higher trims; good build quality
- Diesel option: 3.0L Duramax diesel (305 hp/495 lb-ft) gets 23/26 mpg city/highway — excellent for towing efficiency
- Silverado EV: up to 450 miles range (Silverado EV WT First Edition); 10,000 lbs towing; available 2023–2026 in limited configurations

Head-to-head:
1. Towing capacity: F-150 wins — 14,000 vs 13,300 lbs
2. Payload capacity: F-150 wins — 3,325 vs 2,280 lbs
3. Fuel economy (hybrid): F-150 PowerBoost wins — only mainstream full-size truck hybrid with 24/24 mpg
4. V8 sound/feel: Silverado wins — 6.2L V8 is the best naturally-aspirated engine in the segment
5. Diesel option: Silverado edges ahead — Duramax 3.0L has more torque (495 vs 440 lb-ft)
6. On-board power export: F-150 wins — Pro Power Onboard 7.2kW is more capable
7. Sales: F-150 wins — #1 for 47 years
8. Value of ownership: broadly comparable; parts availability excellent for both`

const SILVERADO_F150_CITATIONS = [
  { url: 'https://www.ford.com/trucks/f150/', text: 'Ford F-150 — official pricing, PowerBoost hybrid, Pro Power Onboard, F-150 Lightning specs' },
  { url: 'https://www.chevrolet.com/trucks/silverado/1500', text: 'Chevy Silverado 1500 — official pricing, 6.2L V8, Duramax diesel, Multi-Pro tailgate' }
]

const SILVERADO_F150_FAQS = [
  { question: 'Is the Ford F-150 or Chevy Silverado more reliable?', answer: 'Both have strong long-term reliability records for full-size trucks. Consumer Reports 2024 data shows the Silverado slightly ahead of the F-150 in predicted reliability, particularly in recent years. However, specific engines matter: the F-150 2.7L EcoBoost has had some documented issues (IIHS notes on engine failure); the 5.0L V8 and 3.5L EcoBoost are well-regarded. The Silverado 5.3L V8 has an excellent long-term track record; the 6.2L V8 is very strong. Both trucks have large dealer networks with readily available parts. Long-term: trucks from both brands commonly reach 200,000–300,000 miles with regular maintenance. If maximum reliability is the priority, consider Toyota Tundra (highest reliability in the segment per Consumer Reports).' },
  { question: 'Does the F-150 PowerBoost actually save money?', answer: 'The F-150 PowerBoost Full Hybrid ($4,000–5,000 premium over non-hybrid) offers roughly 24 mpg city/24 mpg highway versus about 17/24 for the non-hybrid 3.5L EcoBoost. At $4/gallon and 15,000 miles/year with mixed driving (estimated average), the fuel savings are approximately $400–600/year. Break-even on the hybrid premium is 7–10 years — reasonable for a work truck kept long-term. The hidden value: 7.2kW Pro Power Onboard is a $600–750 option that replaces a $500–1,000 generator for job site or camping use. If you regularly use power tools on site, the PowerBoost pays back much faster. The Ford F-150 Lightning (electric) offers even lower fuel costs but higher purchase price.' },
  { question: 'Ford F-150 vs Chevy Silverado for towing?', answer: 'The F-150 has the edge in maximum towing capacity: 14,000 lbs properly equipped (3.5L EcoBoost, Max Tow Package) vs Silverado 1500\'s 13,300 lbs max (6.2L V8 or 5.3L V8 with Max Trailering Package). However, maximum towing specs require specific configurations — trim level, rear axle ratio, engine, and Max Tow Package all affect the number. For diesel towing efficiency, the Silverado 3.0L Duramax diesel (495 lb-ft torque) gets 26 mpg highway and provides excellent low-end torque for towing heavy loads long distances — more torque than the F-150\'s diesel (250 hp/440 lb-ft) at a better price point. For heavy towing with diesel fuel efficiency, Silverado Duramax is often preferred. For absolute max capacity, F-150 wins.' }
]

// ── Main enrichment runner ────────────────────────────────────────────────────

async function enrichPage(slug, analysis, citations, faqs) {
  const comparison = await prisma.comparison.findUnique({ where: { slug } })
  if (!comparison) {
    console.log(`⚠️  Not found: ${slug}`)
    return
  }

  const existingContent = comparison.content
  const hasEnrichment =
    existingContent &&
    typeof existingContent === 'object' &&
    !Array.isArray(existingContent) &&
    ('analysis' in existingContent || 'expertAnalysis' in existingContent || 'enrichedAt' in existingContent)

  if (hasEnrichment) {
    console.log(`✅ Already enriched: ${slug}`)
    return
  }

  const baseContent = Array.isArray(existingContent)
    ? {}
    : existingContent && typeof existingContent === 'object'
    ? existingContent
    : {}

  await prisma.comparison.update({
    where: { slug },
    data: {
      content: {
        ...baseContent,
        analysis,
        citations,
        enrichedAt: new Date().toISOString(),
      },
    },
  })

  // Upsert FAQs
  await prisma.fAQ.deleteMany({ where: { comparisonId: comparison.id } })
  for (const faq of faqs) {
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        comparisonId: comparison.id,
      },
    })
  }

  console.log(`✅ Enriched: ${slug} (${faqs.length} FAQs)`)
}

async function main() {
  console.log('🚀 Batch 30 enrichment starting…')

  await enrichPage('bmw-i7-vs-mercedes-eqs', BMW_I7_EQS_ANALYSIS, BMW_I7_EQS_CITATIONS, BMW_I7_EQS_FAQS)
  await enrichPage('linkedin-vs-twitter', LINKEDIN_TWITTER_ANALYSIS, LINKEDIN_TWITTER_CITATIONS, LINKEDIN_TWITTER_FAQS)
  await enrichPage('us-vs-china-economic-growth', US_CHINA_ECONOMY_ANALYSIS, US_CHINA_ECONOMY_CITATIONS, US_CHINA_ECONOMY_FAQS)
  await enrichPage('bmw-3-series-vs-mercedes-c-class', BMW3_CCLASS_ANALYSIS, BMW3_CCLASS_CITATIONS, BMW3_CCLASS_FAQS)
  await enrichPage('paramount-vs-peacock', PARAMOUNT_PEACOCK_ANALYSIS, PARAMOUNT_PEACOCK_CITATIONS, PARAMOUNT_PEACOCK_FAQS)
  await enrichPage('north-korea-vs-south-korea', NK_SK_ANALYSIS, NK_SK_CITATIONS, NK_SK_FAQS)
  await enrichPage('mercedes-gle-vs-bmw-x5', GLE_X5_ANALYSIS, GLE_X5_CITATIONS, GLE_X5_FAQS)
  await enrichPage('xbox-series-x-vs-pc-gaming', XBOX_PC_ANALYSIS, XBOX_PC_CITATIONS, XBOX_PC_FAQS)
  await enrichPage('logseq-vs-obsidian', LOGSEQ_OBSIDIAN_ANALYSIS, LOGSEQ_OBSIDIAN_CITATIONS, LOGSEQ_OBSIDIAN_FAQS)
  await enrichPage('chevy-silverado-vs-ford-f-150', SILVERADO_F150_ANALYSIS, SILVERADO_F150_CITATIONS, SILVERADO_F150_FAQS)

  console.log('🎉 Batch 30 enrichment complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
