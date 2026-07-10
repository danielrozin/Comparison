/**
 * Category-level FAQ pairs for FAQPage JSON-LD schema on /category/[slug] pages.
 * 4–5 Q&A pairs per category covering "how to compare", "best X", methodology, and
 * coverage questions — optimised for AI answer engine citation (AEO) and Google FAQ
 * rich results.
 */

export interface CategoryFaq {
  question: string;
  answer: string;
}

export const CATEGORY_FAQS: Record<string, CategoryFaq[]> = {
  sports: [
    {
      question: "How do I compare athletes side by side?",
      answer:
        "A Versus B lets you compare athletes and sports teams side by side using structured attribute tables — career stats, peak seasons, head-to-head records, titles, and awards. Every comparison includes a data-driven verdict so you can see who leads in each key metric at a glance.",
    },
    {
      question: "What are the most popular sports comparisons?",
      answer:
        "The most-viewed sports comparisons on A Versus B include Messi vs Ronaldo, LeBron James vs Michael Jordan, Federer vs Djokovic, Patriots vs Chiefs, and classic rivalry matchups across soccer, basketball, tennis, and American football.",
    },
    {
      question: "How does A Versus B source sports statistics?",
      answer:
        "We draw from official league records, publicly verified career databases, and historical game logs. Each attribute in our comparison tables links to its source so you can verify any statistic independently.",
    },
    {
      question: "Can I compare teams as well as individual athletes?",
      answer:
        "Yes — A Versus B covers both individual athletes and sports franchises. You can compare head-to-head season records, championship tallies, roster depth, and historical dominance for teams across the NFL, NBA, Premier League, La Liga, and other major leagues.",
    },
  ],

  countries: [
    {
      question: "How do I compare countries side by side?",
      answer:
        "On A Versus B you can compare countries across dozens of dimensions: GDP and GDP per capita, population, life expectancy, HDI rank, military spending, education index, democracy score, land area, and more — each displayed in a structured attribute table with a verdict.",
    },
    {
      question: "What data sources are used for country comparisons?",
      answer:
        "Country data on A Versus B comes from authoritative sources including the World Bank, IMF, UN Human Development Programme, OECD, and CIA World Factbook. We update comparisons when major indicators change.",
    },
    {
      question: "What are the most compared countries on A Versus B?",
      answer:
        "The most popular country comparisons include USA vs China, USA vs Russia, Germany vs France, Japan vs South Korea, India vs China, and UK vs USA — covering economic output, quality of life, military strength, and international rankings.",
    },
    {
      question: "Can I compare economies and quality-of-life metrics?",
      answer:
        "Yes — A Versus B country comparisons include economic indicators (GDP, trade balance, debt-to-GDP), quality-of-life scores (HDI, healthcare, education), and geopolitical metrics (military budget, alliances, governance index).",
    },
  ],

  technology: [
    {
      question: "How do I compare technology products side by side?",
      answer:
        "A Versus B technology comparisons display specs, features, pricing, and performance benchmarks side by side in structured tables. Each comparison ends with a verdict explaining which product wins overall and in specific use cases.",
    },
    {
      question: "What technology categories does A Versus B cover?",
      answer:
        "We cover smartphones, laptops, tablets, CPUs, GPUs, smart speakers, smartwatches, televisions, cameras, networking hardware, AI tools, cloud platforms, and more — with new comparisons added as major products launch.",
    },
    {
      question: "What are the most popular technology comparisons?",
      answer:
        "Top technology comparisons include iPhone vs Samsung Galaxy, MacBook vs Dell XPS, Intel vs AMD, ChatGPT vs Claude, PlayStation vs Xbox, and comparisons across the latest chips, flagship smartphones, and AI models.",
    },
    {
      question: "How current is the product data in technology comparisons?",
      answer:
        "Each comparison page displays a 'Last reviewed' date. We refresh key specs — particularly for fast-moving categories like AI models, smartphones, and laptops — when manufacturers release updates or new versions.",
    },
  ],

  products: [
    {
      question: "How do I compare consumer products on A Versus B?",
      answer:
        "A Versus B product comparisons show specs, features, pricing, user ratings, and key differences side by side. Each comparison ends with a structured verdict to help you decide which product is the better buy for your specific needs.",
    },
    {
      question: "What product categories does A Versus B cover?",
      answer:
        "We cover home & kitchen appliances, personal care gadgets, audio and wearables, smart home devices, fitness equipment, outdoor gear, gaming consoles, electric vehicles, and hundreds of other consumer product categories.",
    },
    {
      question: "Are product prices on A Versus B up to date?",
      answer:
        "Prices listed in comparisons reflect the price at time of last review. We recommend checking the retailer directly for the most current pricing. Each comparison shows a 'Last reviewed' date so you know when we last updated the data.",
    },
    {
      question: "Can I compare products in the same category at once?",
      answer:
        "Yes — browse by subcategory (e.g. Headphones, Smart Home, Fitness Equipment) to find all comparisons within a specific product type and quickly identify head-to-head matchups that match what you're shopping for.",
    },
  ],

  health: [
    {
      question: "What kinds of health comparisons are on A Versus B?",
      answer:
        "A Versus B covers comparisons between diets (e.g. keto vs paleo), supplements and vitamins, medications and drug classes, fitness approaches, mental-health strategies, and healthcare systems — each with an evidence-based verdict and source citations.",
    },
    {
      question: "How does A Versus B ensure health information is accurate?",
      answer:
        "Health comparisons on A Versus B cite peer-reviewed sources, government health agencies (NIH, WHO, CDC), and established medical literature. We note when evidence is mixed or when professional medical advice should be sought.",
    },
    {
      question: "Can A Versus B replace medical advice?",
      answer:
        "No — A Versus B health content is educational and informational only. Always consult a qualified healthcare professional before making medical or health decisions. Our comparisons summarise published research but are not a substitute for personalised medical advice.",
    },
    {
      question: "What are the most viewed health comparisons?",
      answer:
        "Popular health comparisons include Keto vs Intermittent Fasting, Creatine vs Protein Powder, Ozempic vs Wegovy, Melatonin vs Magnesium, and comparisons of common dietary supplements — covering efficacy, safety profile, and cost.",
    },
  ],

  finance: [
    {
      question: "What financial products can I compare on A Versus B?",
      answer:
        "A Versus B covers comparisons between savings accounts, investment platforms, brokerages, credit cards, cryptocurrencies, ETFs, insurance products, and personal finance strategies — each with structured attribute tables and a verdict.",
    },
    {
      question: "How does A Versus B source financial data?",
      answer:
        "Financial data comes from official product disclosures, SEC filings, FDIC records, and reputable financial news sources. APY rates, fee structures, and performance figures reflect data as of the last review date shown on each comparison.",
    },
    {
      question: "What are the most popular finance comparisons?",
      answer:
        "Top finance comparisons include Bitcoin vs Ethereum, Fidelity vs Vanguard, Roth IRA vs Traditional IRA, FDIC vs SIPC, and comparisons of major brokerage platforms and investment account types.",
    },
    {
      question: "Is financial information on A Versus B investment advice?",
      answer:
        "No — A Versus B finance content is educational only. It is not personalised investment advice. Always consult a licensed financial advisor before making investment decisions. Product features and terms change frequently; verify directly with the provider.",
    },
  ],

  education: [
    {
      question: "What educational topics does A Versus B compare?",
      answer:
        "A Versus B covers comparisons between universities, online learning platforms, degree programmes, standardised tests (SAT vs ACT, GRE vs GMAT), learning methodologies, and educational tools — with structured verdict tables.",
    },
    {
      question: "How does A Versus B compare online learning platforms?",
      answer:
        "Our online-learning comparisons evaluate course catalogue breadth, certification value, price and free-tier access, instructor quality, platform UX, and career outcomes — covering Coursera, edX, Udemy, LinkedIn Learning, Khan Academy, and more.",
    },
    {
      question: "What are the most popular education comparisons?",
      answer:
        "Top education comparisons include SAT vs ACT, Harvard vs MIT, MBA vs MSc, Coursera vs Udemy, Duolingo vs Rosetta Stone, and university comparisons across global rankings for specific subject areas.",
    },
    {
      question: "Can I compare university rankings on A Versus B?",
      answer:
        "Yes — university comparisons on A Versus B draw from QS World Rankings, Times Higher Education, US News & World Report, and acceptance rate data to give a multi-dimensional view of institutions side by side.",
    },
  ],

  entertainment: [
    {
      question: "What entertainment comparisons does A Versus B offer?",
      answer:
        "A Versus B covers streaming platforms, gaming consoles, movies, TV shows, music streaming services, content creators, and entertainment franchises — comparing features, content libraries, pricing, and critical reception.",
    },
    {
      question: "How does A Versus B compare streaming services?",
      answer:
        "Streaming service comparisons on A Versus B evaluate content library size, exclusive originals, video/audio quality, simultaneous streams, price per plan, device compatibility, and download options — side by side with a verdict.",
    },
    {
      question: "What are the most popular entertainment comparisons?",
      answer:
        "Top entertainment comparisons include Netflix vs Disney+, PlayStation 5 vs Xbox Series X, Spotify vs Apple Music, HBO Max vs Hulu, and comparisons of major film franchises and gaming titles.",
    },
    {
      question: "How often are entertainment comparisons updated?",
      answer:
        "We update entertainment comparisons when pricing changes, major content library updates occur, or new platform features are announced. Each page shows a 'Last reviewed' date and is flagged for review when a significant update is detected.",
    },
  ],

  history: [
    {
      question: "What kinds of historical comparisons does A Versus B provide?",
      answer:
        "A Versus B covers comparisons of historical figures, empires, battles, civilisations, political systems, economic eras, and historical events — structured with timeline attributes, influence scores, and sourced verdicts.",
    },
    {
      question: "How does A Versus B handle contested historical claims?",
      answer:
        "We present established historical consensus where it exists and flag areas of scholarly debate. All historical comparisons cite sources and note where interpretations diverge across historiographical traditions.",
    },
    {
      question: "What are the most popular history comparisons?",
      answer:
        "Top history comparisons include Napoleon vs Julius Caesar, Rome vs Greece, World War I vs World War II, Alexander the Great vs Genghis Khan, and comparisons of major empires by territory, longevity, and global influence.",
    },
    {
      question: "Who writes the historical content on A Versus B?",
      answer:
        "Historical comparisons are researched and written by our editorial team led by Daniel Rozin, drawing from academic sources, peer-reviewed histories, and encyclopedic references. Every verdict includes attribution and sourcing.",
    },
  ],

  military: [
    {
      question: "What military topics does A Versus B compare?",
      answer:
        "A Versus B covers comparisons of military hardware (fighter jets, tanks, aircraft carriers, missiles), armed forces by size and budget, defence doctrines, historical battles, and military alliances — with structured attribute tables and sourced verdicts.",
    },
    {
      question: "What data sources are used for military comparisons?",
      answer:
        "Military comparisons draw from SIPRI (Stockholm International Peace Research Institute), Global Firepower Index, IISS Military Balance, and official defence ministry publications. All figures reflect published and publicly verified data.",
    },
    {
      question: "What are the most popular military comparisons?",
      answer:
        "Top military comparisons on A Versus B include US vs China military power, F-35 vs F-22, M1 Abrams vs T-14 Armata, NATO vs Russia, and comparisons of the world's largest defence budgets and active-duty force sizes.",
    },
    {
      question: "Does A Versus B cover historical military conflicts?",
      answer:
        "Yes — we compare historical conflicts by scale, casualties, strategic outcome, and geopolitical impact, as well as individual battles, weapon systems from different eras, and military commanders across history.",
    },
  ],

  economy: [
    {
      question: "What economic comparisons does A Versus B cover?",
      answer:
        "A Versus B compares national economies by GDP, GDP per capita, trade balance, unemployment rate, inflation, debt-to-GDP ratio, economic freedom index, and sectoral composition — with structured tables and expert verdicts.",
    },
    {
      question: "What are the most popular economy comparisons?",
      answer:
        "Top economy comparisons include USA vs China GDP, Capitalism vs Socialism, Free Trade vs Protectionism, Keynesian vs Austrian Economics, and comparisons of major central bank policies and economic models.",
    },
    {
      question: "How current is the economic data on A Versus B?",
      answer:
        "Economic data is sourced from the World Bank, IMF, OECD, and national statistics agencies. Each comparison shows a 'Last reviewed' date; major macroeconomic indicators are updated annually or when significant revisions are published.",
    },
    {
      question: "Can I compare economic systems and ideologies?",
      answer:
        "Yes — A Versus B covers comparisons of economic systems (capitalism, socialism, mixed economy), fiscal policies, monetary regimes, and development models, drawing from academic economics and real-world outcomes data.",
    },
  ],

  companies: [
    {
      question: "How does A Versus B compare companies?",
      answer:
        "Company comparisons on A Versus B cover revenue, market cap, employee count, profit margin, growth rate, product portfolio, geographic reach, and brand strength — displayed side by side with a structured verdict.",
    },
    {
      question: "What are the most popular company comparisons?",
      answer:
        "Top company comparisons include Apple vs Microsoft, Google vs Amazon, Tesla vs Ford, Nvidia vs AMD, Uber vs Lyft, and head-to-head matchups between the world's largest corporations across tech, automotive, retail, and finance.",
    },
    {
      question: "What data sources are used for company comparisons?",
      answer:
        "Company financials come from SEC filings, annual reports, Bloomberg, and Statista. Brand and employee data draw from Glassdoor, LinkedIn, and Interbrand rankings. All figures are cited and dated to the most recent fiscal year available.",
    },
    {
      question: "Can I compare startups and private companies?",
      answer:
        "Yes — where public data is available we compare startups and private companies on valuation, funding raised, headcount, product traction, and market positioning. Comparisons note when figures are estimates based on public disclosures.",
    },
  ],

  brands: [
    {
      question: "How does A Versus B compare brands?",
      answer:
        "Brand comparisons on A Versus B evaluate brand value, consumer trust scores, social following, product quality ratings, price positioning, geographic reach, and market share — with structured attribute tables and a verdict.",
    },
    {
      question: "What are the most popular brand comparisons?",
      answer:
        "Top brand comparisons include Nike vs Adidas, Coca-Cola vs Pepsi, Apple vs Samsung, Amazon vs Walmart, Louis Vuitton vs Gucci, and head-to-head matchups across fashion, food & beverage, consumer tech, and retail.",
    },
    {
      question: "What data is used for brand comparisons?",
      answer:
        "Brand data comes from Interbrand, Brand Finance, YouGov Brand Index, Kantar, and consumer survey data. Social metrics reflect public platform data at time of last review.",
    },
    {
      question: "Does A Versus B cover heritage brands vs newer challengers?",
      answer:
        "Yes — we compare legacy brands against direct challengers (e.g. Gillette vs Dollar Shave Club, Kodak vs Canon vs Sony) to show how incumbents and disruptors stack up on innovation, loyalty, and market momentum.",
    },
  ],

  celebrities: [
    {
      question: "What kinds of celebrity comparisons does A Versus B have?",
      answer:
        "A Versus B compares celebrities across net worth, career achievements, awards, social following, box office or chart performance, and cultural impact — covering actors, musicians, athletes, entrepreneurs, and public figures.",
    },
    {
      question: "What are the most popular celebrity comparisons?",
      answer:
        "Top celebrity comparisons include Taylor Swift vs Beyoncé, Elon Musk vs Jeff Bezos, Leonardo DiCaprio vs Brad Pitt, Drake vs Kendrick Lamar, and comparisons of Forbes-listed celebrities by earnings and social reach.",
    },
    {
      question: "How does A Versus B handle celebrity net worth data?",
      answer:
        "Net worth estimates come from Forbes, Celebrity Net Worth, and Bloomberg Billionaires Index. We note that celebrity wealth is often estimated and subject to significant variation; figures reflect the most recent publicly cited estimates.",
    },
    {
      question: "Does A Versus B compare fictional characters?",
      answer:
        "Yes — we compare fictional characters from film, TV, and literature on in-universe power, cultural longevity, and franchise value (e.g. Batman vs Superman, Harry Potter vs Frodo, Tony Stark vs Captain America).",
    },
  ],

  software: [
    {
      question: "How does A Versus B compare software products?",
      answer:
        "Software comparisons on A Versus B cover features, pricing tiers, integration ecosystem, ease of use, performance benchmarks, security posture, and support quality — displayed in structured tables with a use-case-specific verdict.",
    },
    {
      question: "What software categories does A Versus B cover?",
      answer:
        "We cover VPNs, antivirus suites, project management tools, CRM platforms, design tools, cloud storage, password managers, email clients, development IDEs, video editing software, AI writing tools, and more.",
    },
    {
      question: "What are the most popular software comparisons?",
      answer:
        "Top software comparisons include NordVPN vs ExpressVPN, Notion vs Confluence, Figma vs Adobe XD, Slack vs Microsoft Teams, GitHub vs GitLab, and head-to-head matchups across the most widely-used productivity and developer tools.",
    },
    {
      question: "How current is the software pricing on A Versus B?",
      answer:
        "Pricing is updated when providers publish new plans or pricing changes. Each comparison shows a 'Last reviewed' date. We recommend checking the vendor's pricing page directly before purchasing, as SaaS prices change frequently.",
    },
  ],

  automotive: [
    {
      question: "How does A Versus B compare cars?",
      answer:
        "Car comparisons on A Versus B display specs (engine, horsepower, torque, 0–60 mph, range for EVs), safety ratings, fuel economy, cargo space, MSRP, and reliability scores side by side — with a verdict for different buyer profiles.",
    },
    {
      question: "What are the most popular automotive comparisons?",
      answer:
        "Top car comparisons include Tesla Model 3 vs BMW 3 Series, Ford F-150 vs Ram 1500, Toyota Camry vs Honda Accord, Rivian R1T vs Tesla Cybertruck, and head-to-head EV comparisons across range, charging speed, and total cost of ownership.",
    },
    {
      question: "What data sources are used for car comparisons?",
      answer:
        "Automotive data comes from EPA fuel economy ratings, NHTSA and IIHS safety databases, manufacturer specification sheets, and third-party reliability surveys (J.D. Power, Consumer Reports). Pricing reflects MSRP at time of last review.",
    },
    {
      question: "Does A Versus B cover electric vehicles specifically?",
      answer:
        "Yes — EV comparisons cover EPA-rated range, real-world range estimates, charging speed (L2 and DC fast), battery warranty, Supercharger vs CCS network access, autopilot features, and total 5-year ownership cost.",
    },
  ],

  travel: [
    {
      question: "What travel comparisons does A Versus B offer?",
      answer:
        "A Versus B compares travel destinations, airlines, hotel chains, travel insurance plans, luggage brands, booking platforms, and frequent flyer programmes — with structured attribute tables covering cost, comfort, coverage, and user experience.",
    },
    {
      question: "What are the most popular travel comparisons?",
      answer:
        "Top travel comparisons include Delta vs American Airlines, Airbnb vs Hotels.com, carry-on vs checked luggage, travel credit cards, Thailand vs Bali as vacation destinations, and comparisons of global travel loyalty programmes.",
    },
    {
      question: "How does A Versus B compare airline loyalty programmes?",
      answer:
        "Airline loyalty comparisons cover earning rate per dollar, redemption value per point, transfer partner network, elite status benefits, companion certificates, and award seat availability — helping frequent travellers pick the most valuable programme.",
    },
    {
      question: "Does A Versus B help compare travel destinations?",
      answer:
        "Yes — destination comparisons cover cost of living for travellers, visa requirements, safety index, best travel season, flight costs from major hubs, accommodation price range, and overall tourist infrastructure quality.",
    },
  ],
};

export function getCategoryFaqs(categorySlug: string): CategoryFaq[] {
  return CATEGORY_FAQS[categorySlug] ?? [];
}
