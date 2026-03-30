/**
 * Additional FAQs for top comparison pages.
 * Merged at runtime to ensure each comparison has 3-5 FAQs minimum.
 */

export const FAQ_EXPANSION: Record<string, { question: string; answer: string }[]> = {
  "japan-vs-china": [
    { question: "Which country is bigger in size?", answer: "China is much larger, covering approximately 9.6 million km² compared to Japan's 377,975 km². China is the 3rd or 4th largest country in the world, while Japan ranks 62nd." },
    { question: "Which country has a stronger economy?", answer: "China has a larger total GDP ($17.7 trillion) as the world's second-largest economy, but Japan has a significantly higher GDP per capita ($33,800 vs $12,500), indicating higher individual prosperity." },
    { question: "Which country is safer to visit?", answer: "Japan is consistently ranked as one of the safest countries in the world with extremely low crime rates. China is also generally safe for tourists but has higher property crime rates and more complex travel logistics." },
  ],
  "iphone-17-vs-samsung-s26": [
    { question: "Which phone has a better camera?", answer: "The Samsung Galaxy S26 has a higher resolution main sensor (200MP vs 48MP), but the iPhone 17 excels in computational photography and video recording. Both produce excellent photos in most conditions." },
    { question: "Which phone lasts longer?", answer: "Both phones receive excellent long-term support. Samsung promises 7 years of updates, while Apple typically supports iPhones for 6-7 years. Battery life is comparable, with the iPhone 17 offering up to 28 hours of video playback." },
    { question: "Can I switch from iPhone to Samsung easily?", answer: "Samsung provides a Smart Switch app that transfers contacts, photos, messages, and apps from iPhone. Some iMessage features won't transfer, and you'll need to replace Apple-specific apps with Android alternatives." },
  ],
  "ps5-vs-xbox-series-x": [
    { question: "Which console has better exclusives?", answer: "PS5 traditionally has stronger exclusives like God of War, Spider-Man, and Horizon. Xbox has bolstered its library with Bethesda and Activision acquisitions (Starfield, Call of Duty), though many Xbox exclusives also come to PC." },
    { question: "Is Game Pass better than PS Plus?", answer: "Xbox Game Pass includes day-one first-party releases and a larger library for a similar price. PS Plus Premium offers classic game streaming and trials. For value, Game Pass is generally considered the better deal." },
    { question: "Which console is more powerful?", answer: "The Xbox Series X has a slight edge in raw GPU power (12 TFLOPS vs 10.28 TFLOPS), but the PS5's custom SSD is faster, leading to shorter load times. In practice, multiplatform games perform similarly on both." },
  ],
  "chatgpt-vs-claude": [
    { question: "Which AI is better for coding?", answer: "Both are excellent at coding. Claude tends to excel at longer code analysis and generation thanks to its larger context window, while ChatGPT has a broader plugin ecosystem including code execution. The best choice depends on your specific workflow." },
    { question: "Which AI is more accurate?", answer: "Both models can hallucinate and make errors. Claude's Constitutional AI training emphasizes honesty and tends to be more conservative (acknowledging uncertainty), while ChatGPT may be more confident but occasionally less calibrated." },
    { question: "Can I use both for free?", answer: "Yes, both offer free tiers. ChatGPT's free tier uses GPT-4o mini, while Claude's free tier provides limited access to its latest models. Both have $20/month paid plans with expanded capabilities." },
  ],
  "bitcoin-vs-ethereum": [
    { question: "Which cryptocurrency is a better investment?", answer: "Bitcoin is considered a safer store-of-value investment (digital gold), while Ethereum offers higher growth potential tied to DeFi and smart contract adoption. Bitcoin has lower volatility, while Ethereum has higher potential returns and risks." },
    { question: "Can you convert Bitcoin to Ethereum?", answer: "Yes, you can exchange Bitcoin for Ethereum on virtually any cryptocurrency exchange (Coinbase, Binance, Kraken, etc.) or through decentralized exchanges and swap services." },
    { question: "Which uses more energy?", answer: "Bitcoin uses significantly more energy due to its proof-of-work mining. Since Ethereum's transition to proof-of-stake in September 2022 (The Merge), its energy consumption dropped by over 99%." },
  ],
  "nike-vs-adidas": [
    { question: "Which brand is more popular worldwide?", answer: "Nike is the larger brand with over $50 billion in annual revenue compared to Adidas's ~€22 billion. Nike dominates in the US, while Adidas is stronger in Europe and has a significant streetwear following globally." },
    { question: "Which brand makes better running shoes?", answer: "Both make excellent running shoes. Nike's Vaporfly and Alphafly series dominate competitive running, while Adidas's Ultraboost and Adizero lines are highly rated for comfort and performance. The best choice depends on your foot shape and running style." },
    { question: "Are Nike or Adidas shoes more sustainable?", answer: "Both brands have sustainability initiatives. Adidas's Parley line uses recycled ocean plastic, while Nike's Move to Zero program focuses on zero carbon and zero waste. Adidas has been slightly ahead in marketing its sustainable lines." },
  ],
  "netflix-vs-disney-plus": [
    { question: "Which streaming service has more content?", answer: "Netflix has a significantly larger content library with thousands of titles across all genres. Disney+ has a smaller but highly curated library focused on Disney, Marvel, Star Wars, Pixar, and National Geographic content." },
    { question: "Which is better for families?", answer: "Disney+ is generally considered better for families with its vast library of animated films, Pixar movies, and family-friendly content. Netflix has a good kids section but also contains mature content requiring parental controls." },
    { question: "Can I get both services bundled?", answer: "Disney offers the Disney Bundle combining Disney+, Hulu, and ESPN+ at a discount. Netflix doesn't offer bundles with other services, though some carriers and ISPs include Netflix with their plans." },
    { question: "Which has better original content?", answer: "This is subjective. Netflix invests $17 billion annually and produces more original titles. Disney+ has fewer but often bigger-budget originals tied to Marvel and Star Wars franchises that generate massive viewership." },
  ],
  "tesla-vs-ford": [
    { question: "Which electric truck is better, Cybertruck or F-150 Lightning?", answer: "The F-150 Lightning offers a more practical, traditional truck design with proven Ford reliability. The Cybertruck has a unique stainless steel design, potentially better range, and Tesla's Supercharger network. The F-150 Lightning is generally more affordable." },
    { question: "Which company sells more cars?", answer: "Ford sells significantly more total vehicles annually (over 4 million) compared to Tesla (about 1.8 million). However, Tesla leads in EV-only sales and has a much higher market capitalization." },
    { question: "Which has better resale value?", answer: "Tesla vehicles generally have stronger resale values among EVs due to high demand and fewer model changes. Ford's traditional vehicles also hold value well, but their EVs face steeper depreciation." },
    { question: "Which company has a better charging network?", answer: "Tesla's Supercharger network is widely considered the best EV charging network with over 50,000 stations globally. Ford EVs can now access Tesla Superchargers via an adapter, but the CCS network they primarily use is less reliable." },
  ],
  "apple-vs-samsung": [
    { question: "Which brand has better phones?", answer: "Both make excellent phones. Apple offers a more integrated ecosystem with longer software support and consistent performance. Samsung provides more hardware variety, customization options, and often leads in display and camera hardware specifications." },
    { question: "Can Samsung and Apple devices work together?", answer: "While they can coexist (both use standard apps like WhatsApp, Spotify), the experience is less seamless than staying within one ecosystem. Features like AirDrop, iMessage, and Apple Watch only work with Apple devices." },
    { question: "Which brand is better for privacy?", answer: "Apple is generally considered stronger on privacy, with features like App Tracking Transparency, on-device processing, and minimal data collection. Samsung/Android has improved significantly but Google's ad-based business model means more data collection." },
  ],
  "mac-vs-windows": [
    { question: "Which is better for programming?", answer: "Both are excellent. macOS is preferred for iOS/mobile development and offers a Unix-based terminal. Windows is better for .NET development and has the Windows Subsystem for Linux (WSL). For web development, both work equally well." },
    { question: "Why are Macs more expensive?", answer: "Macs include premium build quality, Apple Silicon chips with excellent performance-per-watt, long software support (7+ years), and tight hardware-software integration. However, Windows PCs offer more options at every price point." },
    { question: "Can I run Windows on a Mac?", answer: "Apple Silicon Macs can run Windows via virtualization tools like Parallels Desktop (ARM version of Windows). Intel Macs can dual-boot Windows via Boot Camp. Performance is good but not native-equivalent for all tasks." },
  ],
  "android-vs-ios": [
    { question: "Which is easier to use?", answer: "iOS is generally considered easier for beginners with its consistent, simple interface. Android offers more customization but can be overwhelming. Both platforms have improved significantly in usability over the years." },
    { question: "Which has better apps?", answer: "Both platforms have millions of apps. iOS apps tend to be released first and are often more polished, partly because developers earn more on the App Store. Android has more free apps and allows sideloading." },
    { question: "Can I switch from Android to iPhone?", answer: "Yes, Apple provides the 'Move to iOS' app that transfers contacts, messages, photos, and apps. You'll lose some Android-specific features and need to repurchase apps, but the core data transfer is straightforward." },
  ],
  "nvidia-vs-amd": [
    { question: "Which GPU is better for gaming?", answer: "NVIDIA generally leads in the high-end gaming segment with better ray tracing performance and DLSS technology. AMD offers better value at mid-range price points with competitive rasterization performance." },
    { question: "Which is better for AI and machine learning?", answer: "NVIDIA dominates AI workloads thanks to CUDA, the industry-standard parallel computing platform. AMD's ROCm is improving but has much less ecosystem support. For professional AI work, NVIDIA is the clear choice." },
    { question: "What is DLSS vs FSR?", answer: "DLSS (NVIDIA) and FSR (AMD) are AI upscaling technologies that boost frame rates. DLSS uses dedicated AI hardware (Tensor cores) for higher quality, while FSR works on any GPU but with slightly lower quality at equivalent settings." },
  ],
  "usa-vs-china": [
    { question: "Which country has a larger economy?", answer: "The United States has a larger nominal GDP (~$26.9 trillion vs ~$17.7 trillion). However, when measured by purchasing power parity (PPP), China's economy is arguably larger due to lower domestic costs." },
    { question: "Which country has a stronger military?", answer: "The US has the world's strongest military with the largest defense budget ($886 billion), most advanced technology, and global force projection. China has the world's largest military by personnel (2 million active) and is rapidly modernizing." },
    { question: "Which country leads in technology?", answer: "The US leads in software, AI, semiconductors, and biotech. China leads in manufacturing, 5G infrastructure, and electric vehicles. Both are competing intensely in AI, quantum computing, and space technology." },
  ],
  "coca-cola-vs-pepsi": [
    { question: "Which sells more globally?", answer: "Coca-Cola outsells Pepsi globally with approximately 48% of the global carbonated soft drink market compared to Pepsi's approximately 20%. Coca-Cola is available in more countries and has stronger brand recognition worldwide." },
    { question: "What is the taste difference?", answer: "Coca-Cola has a more vanilla and raisin-forward flavor profile, while Pepsi is slightly sweeter with more citrus notes. In blind taste tests, people often prefer Pepsi in sips (sweeter) but Coca-Cola for full servings." },
    { question: "Which company is bigger?", answer: "The Coca-Cola Company focuses primarily on beverages ($45B revenue), while PepsiCo is a diversified food and beverage company ($91B revenue) that also owns Frito-Lay, Quaker Oats, and Gatorade, making PepsiCo larger by total revenue." },
    { question: "Which is healthier?", answer: "Neither is healthy — both are sugary carbonated drinks. Regular Coca-Cola has 39g of sugar per 12oz can while Pepsi has 41g. Both offer zero-sugar alternatives. Water remains the healthiest beverage choice." },
  ],
  "uber-vs-lyft": [
    { question: "Which is cheaper?", answer: "Prices vary by market and time. On average, Uber and Lyft prices are within 5-10% of each other. Lyft occasionally offers lower base rates, while Uber's surge pricing can be higher during peak times. It's worth comparing both apps before each ride." },
    { question: "Which is available in more cities?", answer: "Uber operates in over 10,000 cities across 70+ countries, while Lyft primarily operates in the US and Canada. For international travel, Uber is the clear choice." },
    { question: "Which is safer?", answer: "Both companies have similar safety features including driver background checks, GPS tracking, emergency buttons, and ride sharing. Both publish annual safety reports. Choose whichever has better driver ratings in your area." },
    { question: "Which pays drivers more?", answer: "Driver earnings are similar and vary by market. Lyft generally takes a smaller commission, but Uber's larger customer base can mean more ride requests. Many drivers use both platforms to maximize earnings." },
  ],
  "spotify-vs-apple-music": [
    { question: "Which has better sound quality?", answer: "Apple Music offers lossless audio and Dolby Atmos spatial audio on all plans. Spotify offers high-quality streaming but its planned HiFi lossless tier has been repeatedly delayed. For audiophiles, Apple Music currently has the edge." },
    { question: "Which has a better music library?", answer: "Both services offer over 100 million songs with very similar catalogs. The main difference is in exclusive releases and regional availability, where differences are minimal." },
    { question: "Which has better playlist recommendations?", answer: "Spotify is widely regarded as having superior music discovery algorithms, with Discover Weekly and Daily Mix playlists consistently praised. Apple Music has improved its recommendations but Spotify's data-driven approach remains ahead." },
    { question: "How much do they cost?", answer: "Both charge $10.99/month for individual plans and $16.99/month for family plans. Spotify offers a free ad-supported tier, while Apple Music offers a $5.99/month voice-only plan. Student discounts are available on both." },
  ],
  "stock-market-vs-real-estate": [
    { question: "Which has better long-term returns?", answer: "Historically, the US stock market has returned about 10% annually (7% after inflation) vs real estate's 4-8% total return including rental income. However, real estate allows leverage (mortgages) which can amplify returns significantly." },
    { question: "Which is more liquid?", answer: "Stocks are far more liquid — you can buy or sell in seconds during market hours. Real estate transactions take weeks to months and involve significant transaction costs (5-6% agent fees, closing costs)." },
    { question: "Which is better for passive income?", answer: "Real estate provides more predictable passive income through monthly rent payments. Stocks provide passive income through dividends, which are less predictable but require no management. REITs offer a hybrid approach." },
    { question: "Which requires more money to start?", answer: "Stocks can be purchased with any amount (even $1 through fractional shares). Real estate typically requires a significant down payment (3-20% of property value), making the barrier to entry much higher." },
  ],
  "democracy-vs-communism": [
    { question: "What are the main differences?", answer: "Democracy is a political system where power derives from the people through elections and representation. Communism is both an economic and political ideology advocating for collective ownership and a classless society. They differ fundamentally in how they distribute power and resources." },
    { question: "Can a country be both democratic and communist?", answer: "In theory, communism aims for a classless, stateless society with collective decision-making. In practice, communist states have been authoritarian single-party systems. Some argue democratic socialism blends elements of both, but pure democratic communism hasn't been achieved." },
    { question: "Which system is more common today?", answer: "Democracy is far more common, with over 120 countries classified as some form of democracy. Only a few countries identify as communist (China, Cuba, Vietnam, Laos, North Korea), and most have incorporated significant market-economy elements." },
  ],
  "capitalism-vs-socialism": [
    { question: "What is the main difference?", answer: "Capitalism is based on private ownership of production and free-market competition for profit. Socialism advocates for collective or government ownership of production and distribution based on need. Most modern economies blend elements of both." },
    { question: "Which system creates more wealth?", answer: "Capitalist economies have historically generated more total GDP growth and innovation. However, socialist policies like universal healthcare and education can create more equitable distribution. The highest-ranked countries for quality of life (Nordic nations) use a mixed approach." },
    { question: "Are any countries purely capitalist or socialist?", answer: "No modern economy is purely one or the other. The US has Social Security, public schools, and Medicare (socialist elements). China has a massive private sector (capitalist elements). Most successful economies are mixed." },
  ],
};
