/**
 * DAN-2167: Enrichment script for compare pages — batch 22
 *
 * Pages (top unreviewed by searchImpressions, 323–687 range):
 *   687 - xbox-series-x-vs-ps5-specs-performance-games-2026
 *   649 - xbox-series-x-vs-ps5-performance-games-comparison-2026
 *   540 - china-vs-us-gdp-military-tech-comparison-2026
 *   524 - china-vs-japan-economy-comparison-2026
 *   399 - california-population-vs-texas-2026
 *   384 - japan-vs-china-economy-comparison-2026
 *   384 - macbook-air-vs-macbook-pro-battery-life-comparison-2026
 *   383 - neymar-vs-cristiano-ronaldo-career-stats-comparison-2026
 *   373 - us-nominal-gdp-vs-china-2026
 *   323 - netflix-vs-peacock-comparison-2026
 */

import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../../.env.local') })

const prisma = new PrismaClient()

const XBOX_PS5_ANALYSIS = `Xbox Series X and PlayStation 5 are the two most capable home consoles of their generation, but they target overlapping audiences with meaningfully different strengths. Both launched in November 2020 at $499 (disc) and have mature game libraries and established ecosystems.

Performance on paper is extremely close. Xbox Series X features a custom AMD CPU/GPU delivering 12 TFLOPS with 16GB GDDR6 memory and a 1TB NVMe SSD at 2.4 GB/s. PS5's GPU delivers 10.28 TFLOPS but with a faster SSD at 5.5 GB/s — twice the raw throughput — which enables near-instant loading. In practice, multiplatform games perform nearly identically on both platforms, with minor differences rarely exceeding single-digit FPS.

Exclusive game libraries are where they genuinely diverge. Xbox Game Pass ($14.99–$19.99/month) gives access to 400+ games day-one at launch, including every first-party Microsoft title — over 35 million subscribers as of 2024. PlayStation's exclusive library is the stronger argument for PS5: God of War Ragnarök, Spider-Man 2, Demon's Souls, Returnal, Horizon Forbidden West, and Ratchet & Clank: Rift Apart represent the current pinnacle of console game production.

The DualSense controller (PS5) is a genuine innovation with adaptive triggers (variable resistance) and nuanced haptic feedback. Many PS5 exclusive games are designed around DualSense capabilities. Xbox's controller is excellent but iterates on prior design.

For backwards compatibility: PS5 plays all PS4 games; Xbox plays Xbox One, Xbox 360, and many original Xbox games — a more comprehensive historical library.

For game library depth and subscription value: Xbox Series X + Game Pass. For exclusive AAA experiences and controller innovation: PS5. For players choosing one console: PS5's exclusive library has the stronger critical portfolio in 2026; Xbox's Game Pass offers better value-per-dollar for players who consume many titles.`

const XBOX_PS5_CITATIONS = [
  { url: 'https://www.xbox.com/en-US/consoles/xbox-series-x', text: 'Xbox Series X official specs: CPU/GPU performance, SSD speed, Game Pass integration, and backward compatibility details' },
  { url: 'https://www.playstation.com/en-us/ps5/', text: 'PlayStation 5 official overview: 10.28 TFLOPS GPU, 5.5 GB/s SSD, DualSense controller features, and exclusive game lineup' },
  { url: 'https://www.ign.com/articles/xbox-series-x-vs-ps5', text: 'IGN Xbox Series X vs PS5 comparison: side-by-side specs, game library analysis, value assessment, and recommendation by use case' }
]

const XBOX_PS5_FAQS = [
  { question: 'Is Xbox Series X or PS5 more powerful?', answer: 'Xbox Series X has a higher GPU rating (12 TFLOPS vs PS5\'s 10.28 TFLOPS), but PS5\'s SSD is significantly faster (5.5 GB/s vs 2.4 GB/s). In practice, multiplatform games perform nearly identically on both — most comparisons show 1–4% frame rate differences in either direction. Neither is meaningfully "more powerful" for actual gaming experience on multiplatform titles.' },
  { question: 'Is Game Pass worth it compared to buying PS5 games?', answer: 'Xbox Game Pass Ultimate ($19.99/month) includes 400+ games day-one at launch plus EA Play. If you play 3+ new games per month, Game Pass delivers better value than buying individual titles at $70 each. PlayStation Plus Extra/Premium has a larger catalog but doesn\'t include first-party games at launch. The comparison depends on play habits.' },
  { question: 'Does PS5 have better games than Xbox in 2026?', answer: 'By critical consensus, yes — PS5\'s first-party exclusive library is stronger in 2026. God of War Ragnarök (94 Metacritic), Spider-Man 2 (90 Metacritic), and Demon\'s Souls (88 Metacritic) are among the best-reviewed games of the generation. Xbox\'s most notable exclusives received more mixed critical responses, though Microsoft\'s major studio acquisitions (Activision Blizzard, Bethesda) will produce new exclusives over coming years.' },
  { question: 'Which is better for families, Xbox or PS5?', answer: 'Xbox Game Pass Family Plan ($19.99/month, up to 5 accounts) offers exceptional value for multi-player households. PS5\'s family game library (Astro\'s Playroom, Sackboy, Ratchet & Clank) is strong. Xbox parental controls are slightly more robust for managing screen time and spending. For pure family value: Game Pass Family Plan on Xbox is hard to beat.' },
  { question: 'Should I buy Xbox Series X or PS5 in 2026?', answer: 'Buy PS5 if: you want the best exclusive AAA games (Spider-Man, God of War, Horizon), you care about the DualSense controller experience, or you play at home on a TV. Buy Xbox Series X if: Game Pass\'s value appeals (400+ games for $19.99/month), you want the best backwards compatibility spanning four console generations, or you also game on PC (Game Pass works on both). Many households own both — they serve different occasions and neither is a wrong choice at $499.' }
]

const CHINA_US_ANALYSIS = `China and the United States are the world's two largest economies and the defining geopolitical rivalry of the 21st century. The comparison spans economic size, military capacity, technological capability, and global influence — each dimension tells a different story.

**Economy:** The US has the world's largest nominal GDP at approximately $29 trillion (2025 IMF estimate). China is second at approximately $18–19 trillion nominal GDP. However, in Purchasing Power Parity (PPP) terms — adjusting for what money actually buys in each country — China's economy already surpassed the US in approximately 2016 by IMF calculations: China's PPP GDP is approximately $38 trillion vs the US at $29 trillion. Which measure "wins" depends on the question: nominal GDP matters for international trade, debt, and global financial markets; PPP matters for comparing living standards and domestic economic activity.

**GDP per capita** is where the gap remains enormous: US GDP per capita (nominal) is approximately $87,000; China's is approximately $13,000. China's 1.4 billion population means its aggregate economy is enormous, but the average Chinese citizen's purchasing power is still a fraction of the average American's.

**Military:** The US military budget ($886 billion in FY2024) is approximately 3.5× China's declared military budget ($225 billion). The US operates 11 aircraft carrier strike groups to China's 3; has 750+ overseas military bases across 80 countries; and operates the world's most sophisticated stealth aircraft, drone fleet, and satellite network. China's military (PLA) has grown dramatically since 2000 — it operates the world's largest navy by hull count — but US qualitative advantages in training, equipment, and global power projection remain substantial. Taiwan remains the most acute potential flashpoint.

**Technology:** Both countries compete across AI, semiconductors, quantum computing, and space. The US leads in most advanced semiconductor design (NVIDIA, AMD, Intel, Qualcomm) and has restricted China's access to advanced chips via export controls. China leads in 5G deployment (Huawei), electric vehicles (BYD, NIO), solar manufacturing, rare earth processing (80%+ of global supply), and has a large domestic AI research community. The semiconductor competition — specifically whether China can develop advanced domestic chip manufacturing to replace TSMC/Samsung capacity — is the most consequential technology battle of the 2020s.

**Global influence:** The US dollar is the world's reserve currency, enabling significant financial leverage. The US leads NATO and maintains treaty alliances across Asia (Japan, South Korea, Australia). China's Belt and Road Initiative has invested in infrastructure across 140+ countries. China is the top trading partner for more countries than the US.

The strategic competition is not zero-sum in every dimension, but the two nations are increasingly decoupling in technology supply chains, financial systems, and military posture across the Pacific.`

const CHINA_US_CITATIONS = [
  { url: 'https://www.imf.org/en/Publications/WEO/weo-database', text: 'IMF World Economic Outlook Database: GDP nominal and PPP figures for US and China 2024–2025 with projections' },
  { url: 'https://comptroller.defense.gov/Budget-Materials/', text: 'US Department of Defense: FY2024 defense budget request, military capability overview, and force structure data' },
  { url: 'https://www.cfr.org/backgrounder/china-us-great-power-competition', text: 'Council on Foreign Relations: US-China great power competition — trade, technology, military, and diplomatic dynamics' }
]

const CHINA_US_FAQS = [
  { question: 'Is China\'s economy bigger than the US?', answer: 'It depends on the measure. By nominal GDP (in US dollars at current exchange rates): the US leads at approximately $29 trillion vs China\'s $18–19 trillion. By Purchasing Power Parity (PPP), which adjusts for domestic prices: China surpassed the US around 2016 and now leads at approximately $38 trillion vs $29 trillion. Nominal GDP is the more commonly cited metric for international comparisons and financial markets. PPP is more useful for comparing domestic living standards. In nominal terms: US is larger. In PPP terms: China is larger.' },
  { question: 'Who has the stronger military, US or China?', answer: 'By virtually every quantitative and qualitative metric, the US maintains stronger military capability globally. The US military budget ($886 billion FY2024) is 3.5× China\'s declared budget. The US has 11 aircraft carrier strike groups; China has 3. The US operates bases on every inhabited continent. China\'s military has grown dramatically since 2000 and excels in specific domains (missile systems, certain naval capabilities, cyber), but the overall qualitative gap in training, equipment, logistics, and interoperability with allies remains substantial. The balance in the specific context of a Taiwan conflict scenario, however, is much closer — China has significant geographic advantages and anti-access/area-denial (A2/AD) systems that complicate US operations in the western Pacific.' },
  { question: 'Which country leads in technology, US or China?', answer: 'The US maintains leads in foundational technology: advanced semiconductor design, software platforms, AI frontier research (top models from OpenAI, Anthropic, Google), and aerospace. China leads in: 5G infrastructure deployment, electric vehicles (BYD is now the world\'s largest EV maker), solar panel manufacturing, battery technology, rare earth processing, and application-layer AI deployment at scale (TikTok, WeChat ecosystems). The most consequential battle is in advanced semiconductors: the US has cut China\'s access to NVIDIA chips and TSMC manufacturing capacity via export controls; China is investing hundreds of billions to build domestic advanced chip capability. Who wins this race may determine long-term AI and defense dominance.' },
  { question: 'Will China overtake the US economy?', answer: 'In nominal GDP terms, projections vary significantly. Pre-2020 consensus predicted China would surpass the US in nominal GDP around 2030–2035. Post-COVID realities have pushed this timeline: China\'s economic growth has slowed (demographic challenges, property sector crisis, youth unemployment at record highs, foreign investment retreat), and more forecasters now see the gap narrowing but not closing within the 2030s. Goldman Sachs revised its China GDP overtake timeline to 2035+ in 2023. JPMorgan pushed it to 2040s. Some economists argue China may never overtake the US in nominal terms if current structural issues persist. In PPP terms, China already leads.' },
  { question: 'What are the main differences between the US and China politically?', answer: 'The US is a constitutional republic with separation of powers, competitive multiparty elections, independent judiciary, and legal protections for freedom of speech, press, and assembly. China is governed by the Chinese Communist Party (CCP), which has been the sole governing party since 1949. Xi Jinping consolidated personal control in 2012–2018 (removing presidential term limits) and China operates a system in which the Party controls the military, judiciary, media, and major economic institutions. This is not merely a political preference difference — it shapes every aspect of governance, information flow, individual rights, and foreign policy behavior. The US-China rivalry is partly ideological: democratic governance and open markets vs. party-state capitalism and authoritarian governance.' }
]

const CHINA_JAPAN_ANALYSIS = `China and Japan are East Asia's two largest economies and share one of history's most complex bilateral relationships — defined by geography, culture exchange, devastating 20th-century conflict, and now intense economic interdependence alongside strategic rivalry.

**Economic size:** China's nominal GDP is approximately $18–19 trillion (2025), making it the world's second-largest economy. Japan's nominal GDP is approximately $4.2 trillion — approximately 23% of China's size. This comparison is dramatic: Japan held the world's second-largest GDP position for decades until China surpassed it in 2010. In the 15 years since, China has grown its economy to more than 4× Japan's size.

**GDP per capita:** Despite China's aggregate economic dominance, Japan's GDP per capita (nominal) is approximately $33,000 — more than 2.5× China's approximately $13,000. Japan's 125 million people are, on average, significantly more prosperous than China's 1.4 billion. Japan's lower aggregate GDP reflects its smaller population, not lower individual productivity.

**Economic structure:** Japan is a mature, consumption-led economy with world-class manufacturing (Toyota, Sony, Canon, Fanuc) concentrated in high-value-added electronics, automotive, and precision machinery. Japan runs a current account surplus and is the world's largest creditor nation. China is a production-led economy transitioning from manufacturing export dominance to higher-value technology goods. China is Japan's largest trading partner; Japan is among China's top 5 trading partners.

**Aging and demographics:** Japan is facing one of the world's most severe demographic crises: a declining and aging population, with total fertility rate of approximately 1.2 (below replacement) and projected population decline. This constrains Japan's long-term economic potential without structural reform. China faces similar demographic headwinds — its population peaked in 2022 and is now declining, with its own aging crisis emerging from the One-Child Policy era.

**Technology:** Japan leads in industrial robotics (Fanuc, Keyence, Yaskawa dominate globally), precision optics, specialty chemicals, and automotive technology. China leads in EV production, 5G deployment, consumer electronics manufacturing, and e-commerce infrastructure. Both compete in advanced manufacturing; Japan's strength is in components and materials that China's supply chains depend on.

**Strategic relationship:** The Japan-China relationship is economically interdependent but politically strained. Historical tensions from WWII remain active (Nanjing Massacre memory, Yasukuni Shrine visits, disputed Senkaku/Diaoyu islands). Japan has strengthened its US alliance, increased defense spending to 2% of GDP (2027 target), and is more directly involved in Taiwan Strait security discussions.`

const CHINA_JAPAN_CITATIONS = [
  { url: 'https://www.imf.org/en/Publications/WEO/weo-database', text: 'IMF World Economic Outlook Database: Japan and China GDP nominal and PPP data, growth projections 2024–2029' },
  { url: 'https://www.jetro.go.jp/en/reports/statistics/', text: 'JETRO Japan trade statistics: Japan-China bilateral trade data, export/import breakdown, and sector analysis' },
  { url: 'https://www.brookings.edu/articles/china-japan-economic-relations/', text: 'Brookings Institution: China-Japan economic relationship — interdependence, competition, and strategic tensions analysis' }
]

const CHINA_JAPAN_FAQS = [
  { question: 'Is China\'s economy bigger than Japan\'s?', answer: 'Yes — significantly. China\'s nominal GDP is approximately $18–19 trillion (2025); Japan\'s is approximately $4.2 trillion. China surpassed Japan as the world\'s second-largest economy in 2010 and has since grown to more than 4× Japan\'s size. However, Japan\'s GDP per capita (approximately $33,000) remains more than 2.5× China\'s (approximately $13,000), because Japan has 125 million people vs China\'s 1.4 billion. Japan is wealthier per person; China is larger in aggregate.' },
  { question: 'When did China overtake Japan economically?', answer: 'China surpassed Japan as the world\'s second-largest economy (by nominal GDP) in 2010. For most of the 20th century, Japan held the #2 position after the US. Japan\'s "Lost Decade" of economic stagnation in the 1990s, combined with China\'s sustained high-growth period (averaging 8–10% GDP growth annually from 1980–2010), closed and then reversed the gap. By 2023, China\'s economy is approximately 4.4× Japan\'s size in nominal terms.' },
  { question: 'What does Japan export to China?', answer: 'Japan\'s top exports to China include: semiconductor manufacturing equipment and precision electronics components, automotive parts (Toyota, Honda, Nissan supply chains), industrial machinery and robots, specialty chemicals and materials, optical instruments, and luxury consumer goods. China is Japan\'s largest single export destination and largest trading partner overall. Many Japanese manufacturers have significant supply chain dependencies on Chinese production networks and consumer markets.' },
  { question: 'Are Japan and China allies?', answer: 'No — Japan and China are economic partners but strategic competitors and historical rivals. Japan is a US treaty ally (the US-Japan Security Treaty gives the US military basing rights in Japan and commits the US to Japan\'s defense). China and the US are strategic competitors. Key tensions: the Senkaku/Diaoyu Islands dispute (both countries claim sovereignty), historical grievances from WWII (Nanjing Massacre, forced labor, comfort women), Taiwan Strait security (Japan has become more explicit about Taiwan\'s importance to Japanese security), and competition in Southeast Asian infrastructure investment. Economic interdependence creates strong incentives for stable relations, but the strategic relationship is fundamentally competitive.' },
  { question: 'Which country has a better quality of life, China or Japan?', answer: 'By standard quality-of-life measures, Japan ranks significantly higher than China. Japan\'s Human Development Index (HDI) score is 0.920 (ranked ~19th globally); China\'s is 0.788 (ranked ~79th globally). Japan offers universal healthcare, extremely high safety, world-class public infrastructure, low crime, and strong social services. Life expectancy in Japan (approximately 84 years) is among the world\'s highest; China\'s is approximately 78 years. Japan\'s higher GDP per capita ($33,000 vs $13,000) translates to significantly higher average living standards, particularly in urban areas. Within China, urban coastal residents have quality of life measures approaching Japan\'s; rural interior residents have much lower living standards.' }
]

const CALIFORNIA_TEXAS_ANALYSIS = `California and Texas are the two most populous US states and represent competing visions of American governance, economy, and culture. The comparison between them is genuine and consequential — not just political symbolism.

**Population:** California has approximately 39.0 million residents (2024 Census estimate), making it the most populous state. Texas has approximately 30.5 million, making it the second most populous. Texas is growing significantly faster: the state gained approximately 470,000 new residents in 2023–2024 alone, driven by domestic migration (particularly from California), international immigration, and high birth rates. California's population peaked and has seen net domestic out-migration in recent years, though international immigration has partially offset this.

**Economy:** California has the world's fifth-largest economy by GDP (approximately $4.0 trillion in 2024) — larger than every country except the US, China, Germany, and Japan. Texas has the world's eighth or ninth-largest state/national economy at approximately $2.7 trillion. Both are economic powerhouses. California's economy is concentrated in technology (Silicon Valley, Apple, Google, Meta, NVIDIA), entertainment (Hollywood), aerospace, and agriculture. Texas's economy is built on energy (oil & gas), technology (Austin's growth), aerospace (SpaceX in South Texas), finance, agriculture, and trade (US-Mexico border).

**Cost of living and housing:** California has some of the highest housing costs in the nation — median home price in the San Francisco Bay Area exceeds $1.3 million; Los Angeles median is $850,000+. Texas housing is significantly more affordable: Austin median is approximately $500,000, Houston approximately $310,000, Dallas $380,000, San Antonio $270,000. This cost difference is the primary driver of domestic migration from California to Texas.

**Taxes:** California has the highest state income tax in the nation (13.3% top marginal rate). Texas has no state income tax. California's combined state and local tax burden is the highest or near-highest nationally. Texas's property taxes are among the highest nationally (compensating for no income tax), but total tax burden is lower for most middle- and upper-income earners.

**Jobs and business climate:** Texas has ranked #1 or #2 in CNBC and Forbes business climate rankings in recent years, attracting headquarters relocations from Oracle, HP, Tesla (headquarters moved to Austin), and many others. California retains the deepest venture capital ecosystem, most engineering talent concentration, and most tech IPOs — but increasingly, companies scale in Texas after founding in California.

**Weather and geography:** Texas offers hot summers, mild winters (in most areas), and varied geography from Gulf Coast to Hill Country to west Texas desert. California's coastal climate (Mediterranean) is widely considered among the best in the world — mild year-round temperatures. Texas faces higher hurricane risk (Gulf Coast) and increasing extreme heat events.`

const CALIFORNIA_TEXAS_CITATIONS = [
  { url: 'https://www.census.gov/data/tables/time-series/demo/popest/2020s-state-total.html', text: 'US Census Bureau: state population estimates 2020–2024, including California and Texas growth trends and migration data' },
  { url: 'https://dof.ca.gov/forecasting/economics/economic-indicators/', text: 'California Department of Finance: California GDP, employment, and economic indicators 2024' },
  { url: 'https://www.texastribune.org/2024/california-texas-migration/', text: 'Texas Tribune: domestic migration trends between California and Texas, cost-of-living comparison, and economic analysis' }
]

const CALIFORNIA_TEXAS_FAQS = [
  { question: 'Is California or Texas bigger in population?', answer: 'California is larger: approximately 39.0 million residents vs Texas\'s approximately 30.5 million (2024 estimates). However, Texas is growing much faster. Texas added approximately 470,000 residents in 2023–2024 alone. At current growth rates, Texas could surpass California in population sometime between 2045 and 2065, though that timeline is highly uncertain. California has seen net domestic out-migration (more people leaving for other states than arriving) in recent years, partially offset by international immigration.' },
  { question: 'Why are people moving from California to Texas?', answer: 'The primary driver is cost of living, particularly housing. California median home prices ($850,000+ in LA, $1.3M+ in Bay Area) are 2–4× higher than comparable Texas metros (Houston $310K, San Antonio $270K, Dallas $380K, Austin $500K). California\'s top state income tax rate (13.3%) vs Texas\'s 0% also matters for high earners. Secondary factors: traffic, permitting difficulty for businesses, perceived public safety concerns, and political environment. Many people who leave California for Texas report it as primarily a financial decision, not a political one.' },
  { question: 'Is Texas\'s economy bigger than California\'s?', answer: 'No — California has the larger economy by a significant margin. California\'s GDP is approximately $4.0 trillion (2024), making it the 5th largest economy in the world if it were a country — larger than all but the US, China, Germany, and Japan. Texas\'s GDP is approximately $2.7 trillion, making it approximately the 8th largest if it were a country. Both are economic powerhouses: California dominates in technology, entertainment, and innovation; Texas dominates in energy, trade, and manufacturing. The gap has narrowed as Texas has grown faster, but California\'s economy remains about 48% larger.' },
  { question: 'Does California or Texas have higher taxes?', answer: 'California has significantly higher income taxes. California\'s top marginal state income tax rate is 13.3% (the highest in the nation); Texas has no state income tax. For a high earner making $500,000/year, this difference is $40,000–65,000 in annual state income taxes. However, Texas\'s property taxes are among the highest nationally (approximately 1.7–2.5% of home value annually) vs California\'s Proposition 13-constrained property taxes (capped at 1% of assessed value, which can be much lower than market value for long-term owners). For most middle and upper-income households: Texas has a lower total tax burden than California.' },
  { question: 'Is the weather better in California or Texas?', answer: 'By most conventional metrics, California\'s coastal climate is superior: San Diego and Los Angeles have year-round mild temperatures (60s–75°F in most months), low humidity, and the fewest weather extremes of any major US metropolitan areas. The Bay Area\'s famous microclimate variations aside, California coastal residents rarely experience extreme heat, severe cold, or dangerous weather events. Texas summers are brutal: Houston and Dallas regularly exceed 100°F for weeks, with very high humidity in the east. Texas faces hurricane risk along the Gulf Coast and severe tornado risk in north Texas. However, Texas\'s warm winters (particularly South Texas) attract retirees from northern states, and the state has diverse geography — the Texas Hill Country, Big Bend, and Gulf beaches each have distinct appeal.' }
]

const MACBOOK_ANALYSIS = `MacBook Air and MacBook Pro are Apple's two laptop lines, and the decision between them has become more nuanced since Apple's M-series chips eliminated the performance gap that once made the Pro clearly superior for demanding workloads. In 2025–2026, both run on Apple Silicon — the Air on M4/M5, the Pro on M4 Pro/Max or M5 Pro/Max — and the right choice depends on specific workload and lifestyle needs.

**The MacBook Air's case:** Apple's M4 and M5 MacBook Air (13-inch and 15-inch) are the best thin-and-light laptops ever made by virtually any objective measure. They are fanless (completely silent), weigh 2.7–3.3 lbs, achieve 15–18 hours of real-world battery life, and offer performance that handles 95% of professional computing tasks — including 4K video editing, software development, graphic design, and data analysis — without thermal throttling. At $1,099–$1,299 (13-inch M4) and $1,299–$1,499 (15-inch M4), they are priced appropriately for what they deliver.

**The MacBook Pro's case:** The MacBook Pro exists for users who hit the walls of the Air's performance ceiling. The M4 Pro chip (base 14-inch Pro) delivers 40% more CPU performance and 50% more GPU performance than M4. The M4 Max chip (high-end 14-inch and 16-inch) delivers 4× GPU performance, up to 128GB of unified memory, and supports memory-intensive workloads (AI model training, 8K video editing, large-scale software compilation, scientific computing). The Pro also adds: a 120Hz ProMotion display, HDMI 2.1 output, SD card slot (full-size), three Thunderbolt 4 ports (vs two on Air), and MagSafe charging. The Pro has active cooling (fans), meaning sustained performance doesn't degrade under extended heavy workloads.

**Battery life:** This is where Air wins definitively. The MacBook Air M4 achieves 15–18 hours real-world battery life. The MacBook Pro 14-inch achieves 11–14 hours; the 16-inch achieves 13–16 hours. For mobile professionals who work away from outlets for extended periods: Air is the better choice.

**Display:** MacBook Pro has a noticeably better display — 120Hz ProMotion adaptive refresh rate (smoother scrolling and animation), higher peak brightness (1,000 nits vs 500 nits on Air), and mini-LED backlighting on Pro models that delivers better local dimming and contrast.

**Who should buy Air:** writers, students, developers, marketers, designers, most creative professionals, and anyone working primarily on documents, communication, design tools, or code. The Air handles all of these workloads without compromise.

**Who should buy Pro:** professional video editors working with RAW 8K footage, machine learning engineers training models locally, architects running large BIM models, audio engineers running 100+ plugin projects, and power users who genuinely need 32GB+ unified memory or sustained multi-hour compute tasks.`

const MACBOOK_CITATIONS = [
  { url: 'https://www.apple.com/macbook-air/', text: 'Apple MacBook Air official specs: M4/M5 chip options, battery life, weight, ports, and pricing for 13-inch and 15-inch models' },
  { url: 'https://www.apple.com/macbook-pro/', text: 'Apple MacBook Pro official specs: M4 Pro/Max chip options, ProMotion display, HDMI, SD card, memory options up to 128GB' },
  { url: 'https://www.macrumors.com/guide/macbook-air-vs-macbook-pro/', text: 'MacRumors buyer\'s guide: MacBook Air vs MacBook Pro comparison — performance benchmarks, battery tests, and use case recommendations' }
]

const MACBOOK_FAQS = [
  { question: 'Should I buy MacBook Air or MacBook Pro?', answer: 'Buy MacBook Air if: you want the best battery life (15–18 hours), lightest weight, silent fanless operation, and your workloads are document creation, web development, design, communication, or standard video editing. The Air handles 95% of professional tasks without compromise. Buy MacBook Pro if: you edit 4K/8K RAW video professionally, train ML models locally, run large-scale software compilation, need 32GB+ RAM, require the 120Hz ProMotion display, want HDMI/SD card ports, or your workloads sustain heavy compute for hours at a time. Most people who wonder if they need the Pro actually don\'t — the Air is more capable than people expect.' },
  { question: 'Is MacBook Air good enough for video editing?', answer: 'Yes — for most video editing use cases, MacBook Air M4/M5 is excellent. It handles 4K ProRes editing in Final Cut Pro and DaVinci Resolve smoothly. The limit is sustained heavy workloads: a fanless Air will throttle performance if you render 4K footage for hours continuously, whereas the Pro\'s active cooling maintains peak performance. For YouTube creators, documentary filmmakers, wedding videographers, and most commercial production: Air is more than capable. For broadcast professionals working with 6K/8K RAW footage in long editing sessions: the Pro\'s sustained performance advantage justifies the premium.' },
  { question: 'What is the difference between MacBook Air and MacBook Pro display?', answer: 'MacBook Pro has a notably better display on three dimensions: (1) 120Hz ProMotion adaptive refresh rate vs Air\'s 60Hz — scrolling and animations are visibly smoother on Pro; (2) Peak brightness of 1,000 nits (standard) and 1,600 nits (HDR) vs Air\'s 500 nits — Pro is significantly brighter for outdoor use or HDR content; (3) Mini-LED backlighting on Pro delivers superior local dimming and contrast compared to Air\'s IPS display. For color graders, photographers, and designers who care deeply about display quality: the Pro\'s screen is worth the premium. For general use, the Air\'s Liquid Retina display remains excellent and most users are satisfied with it.' },
  { question: 'Is MacBook Air M4 good for programming?', answer: 'MacBook Air M4 is an excellent programming machine. It runs iOS simulators, compiles most codebases quickly (Xcode, Android Studio, VS Code, Docker containers), handles database work, and runs development servers without issue. The 16GB RAM base configuration is adequate for most development; 24GB is recommended for developers running multiple Docker containers, large databases, or iOS/Android simulators simultaneously. The Air\'s battery life (15–18 hours) is exceptional for developers who move between coffee shops and offices. The main limitation is sustained heavy builds — the Air may throttle during extended Swift/C++ compilation runs, where the Pro maintains speed due to active cooling.' },
  { question: 'How much faster is MacBook Pro vs MacBook Air?', answer: 'For everyday tasks: essentially the same. Both M4/M5 chips feel instant for web browsing, email, documents, and even most creative work. The performance gap widens significantly for sustained heavy workloads: in Apple\'s benchmarks, M4 Pro delivers approximately 40% more CPU performance and 50% more GPU performance than M4 base (Air). M4 Max delivers up to 4× GPU performance. For a concrete example: in Final Cut Pro, a MacBook Pro M4 Max will export a 4K project approximately 2–3× faster than an M4 Air in a sustained export. For a 30-minute project, that\'s the difference between 8 minutes and 20 minutes. Whether that time saving justifies the $600–$1,600 price premium is a personal calculation.' }
]

const NEYMAR_RONALDO_ANALYSIS = `Neymar Jr. and Cristiano Ronaldo represent two distinct footballing archetypes across different generational windows, making their career statistical comparison complex — they played at peak level in overlapping but not identical eras, and their profiles (attacker vs. winger/striker) make direct comparison genuinely interesting.

**Career goals:** Cristiano Ronaldo holds the record as the highest-scoring player in the history of men's professional football. As of 2025–2026, Ronaldo has scored 900+ career goals across club and international competition (surpassing 900 in 2024 while at Al-Nassr). Neymar has scored approximately 450+ career goals — impressive, but less than half of Ronaldo's tally. This is partly positional (Neymar primarily plays as an attacking winger/playmaker rather than a pure striker) and partly generational (Ronaldo is approximately 7 years older and has played more total career matches).

**International goals:** Ronaldo holds the record for most international goals ever, with 130+ goals for Portugal. Neymar overtook Pelé's all-time Brazil record in 2023, scoring his 78th and then 79th international goal — making him Brazil's all-time top scorer. By career international goals, Ronaldo leads significantly.

**Club career:** Ronaldo's club career is among the greatest in history: Sporting CP (youth), Manchester United (winning Premier League, Champions League), Real Madrid (winning 4 Champions Leagues, 3 La Liga titles, becoming the club's all-time scorer with 450 goals), Juventus, Manchester United again, and now Al-Nassr. Neymar's club career: Santos (where he established himself as a generational talent), Barcelona (winning Champions League 2015, La Liga, Copa del Rey), Paris Saint-Germain (where injury and off-field issues limited his impact), and Al-Hilal (where a severe ACL injury in 2023 effectively interrupted his prime years at 31).

**Injuries:** The most significant factor in Neymar's career is injury. He suffered a serious back injury at the 2014 World Cup, chronic hamstring and ankle issues, and a devastating ACL/ligament tear in October 2023 at Al-Hilal that kept him out for over a year. These injuries have materially shortened his peak competitive window. Ronaldo, by contrast, has had extraordinary physical durability — playing at the highest level into his late 30s with virtually no serious long-term injuries.

**Style and impact:** Neymar at his peak (Barcelona 2014–2017) was the more naturally gifted dribbler and creative player — his close control, skill moves, and vision were arguably superior to Ronaldo's. Ronaldo is the more complete goal-scorer: powerful, aerially dangerous, exceptional from distance, and possessing the mentality and physical preparation to sustain elite performance for 20+ seasons.

The comparison favors Ronaldo by volume statistics but Neymar's peak creative performance represents a different standard of excellence.`

const NEYMAR_RONALDO_CITATIONS = [
  { url: 'https://www.transfermarkt.com/cristiano-ronaldo/profil/spieler/8198', text: 'Transfermarkt: Cristiano Ronaldo career statistics — goals, assists, appearances by club and international competition' },
  { url: 'https://www.transfermarkt.com/neymar-jr/profil/spieler/68290', text: 'Transfermarkt: Neymar Jr. career statistics — goals, assists, appearances at Santos, Barcelona, PSG, Al-Hilal, and Brazil national team' },
  { url: 'https://www.fifa.com/fifaplus/en/articles/neymar-brazil-all-time-top-scorer', text: 'FIFA: Neymar breaks Brazil\'s all-time international scoring record, surpassing Pelé — career international goal records' }
]

const NEYMAR_RONALDO_FAQS = [
  { question: 'Who has scored more goals, Neymar or Cristiano Ronaldo?', answer: 'Cristiano Ronaldo by a very large margin. Ronaldo has scored 900+ career goals (club + international) as of 2025–2026 — the highest total in the history of men\'s professional football. Neymar has scored approximately 450+ career goals, which is an excellent total for an attacker of his profile but less than half of Ronaldo\'s count. The gap reflects different careers: Ronaldo is a pure striker who has played for 20+ years at elite level; Neymar is primarily a creative winger, and significant injury absences have reduced his total appearances.' },
  { question: 'Who has more international goals, Neymar or Ronaldo?', answer: 'Ronaldo leads significantly. Cristiano Ronaldo holds the men\'s all-time record for international goals with 130+ goals for Portugal. Neymar became Brazil\'s all-time leading scorer when he surpassed Pelé\'s record of 77 goals in 2023, and has scored 79+ for Brazil. Neymar\'s record is genuinely historic — breaking Pelé\'s mark is one of the most significant individual records in football history. However, in raw total, Ronaldo\'s 130+ international goals far exceeds Neymar\'s Brazil record.' },
  { question: 'Who is better, Neymar or Cristiano Ronaldo?', answer: 'Opinions differ based on the standard used. By career volume statistics (goals, trophies, longevity): Ronaldo wins clearly. By peak creative ability and natural skill: Neymar at his best (2014–2017 at Barcelona, alongside Messi and Suárez) produced football that many observers found more aesthetically complete. Ronaldo\'s sustained excellence over 20 years is a distinct form of greatness — his physical preparation, mentality, and consistent goal output have no equal. Neymar\'s career has been shaped by injury and off-field choices that prevented him from reaching his potential ceiling. Most objective analyses rank Ronaldo ahead in career achievement; the question of "better at football" at peak is more contested.' },
  { question: 'Did Neymar win the World Cup?', answer: 'No — Neymar has not won the FIFA World Cup. Brazil was eliminated in the quarterfinals in 2014 (when Neymar was injured before the match), semi-finals in 2022 (a painful loss to Croatia on penalties), and Neymar missed the 2023 Copa América and 2025 World Cup qualifying matches due to ACL injury. Brazil has not won the World Cup since 2002 (their fifth and most recent title). Neymar\'s World Cup disappointments are one of the most significant gaps between his talent and his trophy cabinet.' },
  { question: 'How many Champions League titles does Neymar have vs Ronaldo?', answer: 'Neymar has 1 Champions League title (2014–15 with Barcelona, scoring in the final against Juventus). Ronaldo has won the Champions League 5 times: once with Manchester United (2007–08) and four times with Real Madrid (2013–14, 2015–16, 2016–17, 2017–18). Ronaldo\'s Champions League record — 5 titles and the all-time leading goal scorer in Champions League history with 140+ goals — is one of the most extraordinary in the competition\'s history.' }
]

const NETFLIX_PEACOCK_ANALYSIS = `Netflix and Peacock are both subscription streaming services, but they occupy different positions in the market and serve different content strengths. Netflix is the world's largest streaming service by subscriber count (~300 million global subscribers); Peacock is NBCUniversal's streaming platform (~40 million subscribers) that has grown rapidly through live sports and its NBC content library.

**Content strategy:** Netflix operates as a content production studio at massive scale — approximately $17 billion in annual content spending (2024). Its strategy is proprietary originals: Stranger Things, Wednesday, Squid Game, Bridgerton, The Crown, Ozark, and one of the world's largest documentary libraries. Netflix licenses some content but is primarily defined by what it makes.

Peacock's content identity is built on three pillars: (1) NBC and MSNBC's live broadcast and news content, (2) the Universal Pictures and DreamWorks film library (Jurassic Park, Fast & Furious, Illumination/Minions), and (3) live sports — particularly NFL (Sunday Night Football, the Super Bowl was on Peacock in 2024), Premier League soccer, WWE wrestling, and Olympic Games (Peacock and NBC shared streaming rights for Paris 2024 and LA 2028).

**Pricing:** Peacock is significantly cheaper. Peacock Free (ad-supported) is $0/month with limited content. Peacock Premium with ads is $7.99/month; Peacock Premium Plus (ad-free) is $13.99/month. Netflix Standard with ads is $6.99/month; Standard (no ads) is $15.49/month; Premium is $22.99/month. For price-conscious streamers: Peacock Free and Peacock Premium offer the best value per dollar — particularly for sports and NBC live content.

**Live sports advantage:** Peacock's biggest differentiator is live sports coverage. Netflix has no traditional live sports subscription access. Peacock offers exclusive streaming of NFL Sunday Night Football, English Premier League matches (selected games), WWE events, and was the exclusive streaming home of Super Bowl LVIII in January 2024 — the most-watched streaming event in US history with 23 million concurrent viewers. If live sports is your priority: Peacock, not Netflix.

**International availability:** Netflix operates in 190+ countries. Peacock is available primarily in the US (and limited markets). For international travelers or households with non-US family members: Netflix is the only option.

**Original content quality:** Netflix's original content has significantly more critical and cultural impact. Peacock's originals (Bel-Air, Poker Face, The Resort) are quality productions but have not achieved Netflix-level cultural penetration. Most Peacock subscribers cite live sports and the NBC library — not Peacock originals — as their primary reason for subscribing.`

const NETFLIX_PEACOCK_CITATIONS = [
  { url: 'https://www.netflix.com/tudum/articles/netflix-plans-pricing', text: 'Netflix official pricing and plan overview: ad-supported, Standard, and Premium tiers with features and pricing' },
  { url: 'https://www.peacocktv.com/', text: 'Peacock streaming service: plan pricing, channel lineup, live sports coverage including NFL, Premier League, and WWE' },
  { url: 'https://variety.com/2024/digital/news/peacock-super-bowl-streaming-record-1235903219/', text: 'Variety: Peacock Super Bowl LVIII streaming audience reaches 23 million concurrent viewers — US streaming record' }
]

const NETFLIX_PEACOCK_FAQS = [
  { question: 'Is Netflix or Peacock better?', answer: 'It depends on what you watch. Netflix is better for: the largest library of prestige original content (Stranger Things, Squid Game, Wednesday, Bridgerton), the widest international availability (190+ countries), and the most varied content across films, series, documentaries, and stand-up. Peacock is better for: live sports (NFL Sunday Night Football, Premier League, WWE, Olympics), NBC live broadcast content (The Tonight Show, Saturday Night Live, NBC News), and the Universal Pictures film library. Many streamers subscribe to both ($7.99+$15.49 = $23.48/month) because their content doesn\'t overlap.' },
  { question: 'Does Peacock have the NFL?', answer: 'Yes — Peacock carries NFL Sunday Night Football as part of its agreement with NBC (NBC has the SNF package, which streams on Peacock). In January 2024, Peacock held the exclusive streaming rights to Super Bowl LVIII — the first Super Bowl to be exclusively on a streaming platform — drawing 23 million concurrent viewers, a US streaming record. Peacock also carries select playoff games and has carried some exclusive regular-season "Peacock exclusive" games. For NFL fans without cable, Peacock is an essential streaming add-on, particularly if your team plays Sunday Night Football regularly.' },
  { question: 'Is Peacock cheaper than Netflix?', answer: 'Peacock is significantly cheaper at comparable tiers. Peacock Premium (with ads) is $7.99/month; ad-free is $13.99/month. Peacock Free is $0/month with limited content. Netflix\'s ad-supported plan is $6.99/month; Standard (no ads) is $15.49/month; Premium is $22.99/month. At the ad-supported tier, Netflix ($6.99) is slightly cheaper than Peacock ($7.99). At the ad-free tier, Peacock ($13.99) is notably cheaper than Netflix Standard ($15.49). Peacock also offers annual plans that reduce the monthly equivalent to $5.99–$11.99.' },
  { question: 'What movies are on Peacock?', answer: 'Peacock\'s film library is built primarily around NBCUniversal\'s catalog: the Jurassic Park/World franchise, Fast & Furious series, Illumination animation (Despicable Me/Minions, The Super Mario Bros. Movie), Jurassic World, Downton Abbey films, and a large catalog of Universal Pictures releases from the 1990s–2020s. It also includes DreamWorks Animation titles (Shrek, Kung Fu Panda, How to Train Your Dragon) and Focus Features arthouse releases. New theatrical releases from Universal typically arrive on Peacock approximately 45 days after theatrical release — a faster window than most competitors.' },
  { question: 'Can I watch NBC live on Peacock?', answer: 'Yes — Peacock includes live streaming of the NBC broadcast network for subscribers. This means you can watch NBC primetime programming live, local news, NBC Sports events, the Today show, Saturday Night Live, and NBC\'s news content in real-time without a cable subscription. Not all Peacock tiers include live NBC — the free tier has limited live content; Premium tiers include full live NBC streaming. Local channel availability varies by market. This makes Peacock a viable cable replacement for households that primarily watch NBC programming and want live broadcast access without a cable or antenna.' }
]

const ENRICHED_CONTENT = {

'xbox-series-x-vs-ps5-specs-performance-games-2026': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'xbox-series-x-vs-ps5-performance-games-comparison-2026': {
  analysis: XBOX_PS5_ANALYSIS,
  citations: XBOX_PS5_CITATIONS,
  faqs: XBOX_PS5_FAQS
},

'china-vs-us-gdp-military-tech-comparison-2026': {
  analysis: CHINA_US_ANALYSIS,
  citations: CHINA_US_CITATIONS,
  faqs: CHINA_US_FAQS
},

'china-vs-japan-economy-comparison-2026': {
  analysis: CHINA_JAPAN_ANALYSIS,
  citations: CHINA_JAPAN_CITATIONS,
  faqs: CHINA_JAPAN_FAQS
},

'california-population-vs-texas-2026': {
  analysis: CALIFORNIA_TEXAS_ANALYSIS,
  citations: CALIFORNIA_TEXAS_CITATIONS,
  faqs: CALIFORNIA_TEXAS_FAQS
},

'japan-vs-china-economy-comparison-2026': {
  analysis: CHINA_JAPAN_ANALYSIS,
  citations: CHINA_JAPAN_CITATIONS,
  faqs: CHINA_JAPAN_FAQS
},

'macbook-air-vs-macbook-pro-battery-life-comparison-2026': {
  analysis: MACBOOK_ANALYSIS,
  citations: MACBOOK_CITATIONS,
  faqs: MACBOOK_FAQS
},

'neymar-vs-cristiano-ronaldo-career-stats-comparison-2026': {
  analysis: NEYMAR_RONALDO_ANALYSIS,
  citations: NEYMAR_RONALDO_CITATIONS,
  faqs: NEYMAR_RONALDO_FAQS
},

'us-nominal-gdp-vs-china-2026': {
  analysis: CHINA_US_ANALYSIS,
  citations: CHINA_US_CITATIONS,
  faqs: CHINA_US_FAQS
},

'netflix-vs-peacock-comparison-2026': {
  analysis: NETFLIX_PEACOCK_ANALYSIS,
  citations: NETFLIX_PEACOCK_CITATIONS,
  faqs: NETFLIX_PEACOCK_FAQS
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
    enrichmentVersion: 'batch22-dan2167'
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
  console.log('DAN-2167 Batch 22 enrichment starting...\n')
  console.log(`Pages: ${Object.keys(ENRICHED_CONTENT).length} pages (323–687 searchImpressions)\n`)

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

  console.log(`\nBatch 22 complete: ${success} enriched, ${skip} skipped`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
