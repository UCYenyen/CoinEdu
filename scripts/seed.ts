import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { randomUUID } from 'crypto'

const connectionString = process.env.DATABASE_URL!

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min)

const randomElement = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)]

async function main() {
  console.log("🌱 Starting comprehensive seed...")

  // ================================
  // 1. SEASONS (PAST + CURRENT + FUTURE)
  // ================================
  console.log("📅 Creating seasons...")
  const seasons = await Promise.all([
    prisma.season.create({
      data: {
        name: "Fall 2024",
        startDate: new Date(Date.now() - 120 * 86400000),
        endDate: new Date(Date.now() - 60 * 86400000),
        isActive: false,
      },
    }),
    prisma.season.create({
      data: {
        name: "Winter 2024-2025",
        startDate: new Date(Date.now() - 30 * 86400000),
        endDate: new Date(Date.now() + 60 * 86400000),
        isActive: true,
      },
    }),
    prisma.season.create({
      data: {
        name: "Spring 2025",
        startDate: new Date(Date.now() + 70 * 86400000),
        endDate: new Date(Date.now() + 140 * 86400000),
        isActive: false,
      },
    }),
  ])

  const activeSeason = seasons.find(s => s.isActive)!

  // ================================
  // 2. INDICATORS (CORE CURRICULUM)
  // ================================
  console.log("📚 Creating learning indicators...")
  const indicatorData = [
    ["Market Capitalization", "market-cap", "Understand why market cap matters more than price"],
    ["Volatility & Risk", "volatility", "Learn to navigate cryptocurrency price swings"],
    ["Trading Fundamentals", "trading-101", "Master the basics of buying and selling crypto"],
    ["Technical Analysis Basics", "technical-analysis", "Decode candlesticks and trend patterns"],
    ["DeFi Fundamentals", "defi", "Explore decentralized finance and its opportunities"],
    ["Portfolio Diversification", "diversification", "Build a balanced crypto portfolio"],
    ["Security & Custody", "security", "Protect your assets with best practices"],
  ] as const

  const indicators = await Promise.all(
    indicatorData.map(([name, slug]) =>
        prisma.indicator.upsert({
        where: { slug }, // better than name
        update: {},
        create: { name, slug },
        })
    )
    )

  // ================================
  // 3. MATERIALS (L1–L4 per indicator)
  // ================================
  console.log("📖 Creating lesson materials...")
  const materialContent = {
    "market-cap": [
      "Market cap (short for market capitalization) is the total value of all coins in circulation. It's calculated by multiplying the current price of one coin by the total number of coins in existence. For example, if Bitcoin costs $50,000 and there are 21 million Bitcoin in circulation, the market cap would be $1.05 trillion. Market cap is crucial because it tells you the true size of a cryptocurrency, not just its price.",
      "Price alone can be misleading. A coin might cost $100 but have a low market cap if few coins exist. Another coin might cost $0.01 but have a higher market cap if billions of coins exist. Think of it like comparing company value by stock price alone — you'd miss the bigger picture. Market cap gives context. Always compare coins by market cap, not price.",
      "Market cap rankings help identify which cryptocurrencies are most established and have the strongest investor backing. Bitcoin and Ethereum dominate the top positions, suggesting greater stability and liquidity. However, lower-ranked coins can still have potential. Market cap is also used to assess risk: generally, the higher the market cap, the more stable and liquid a coin tends to be.",
      "Market cap can change rapidly based on price fluctuations and even changes in total coin supply (through mining or token burns). It's a living metric that reflects real-time investor sentiment. When evaluating any crypto investment, always check both the current market cap and its historical trends to understand if demand is growing or shrinking.",
    ],
    "volatility": [
      "Volatility is a measure of how dramatically a cryptocurrency's price swings up and down. Bitcoin might jump 10% in a single day, while stocks typically move 1-2% in the same period. This extreme volatility makes crypto exciting for traders but risky for conservative investors. Understanding volatility helps you prepare emotionally and financially for wild price swings.",
      "There are different types of volatility. Historical volatility measures past price movements — useful for understanding what you've already experienced. Implied volatility (from options markets) predicts future swings. As a beginner, focus on historical volatility. When volatility is high, price changes are bigger and more unpredictable. When it's low, price moves are gentler and more stable.",
      "Several factors drive crypto volatility: regulatory news (like government crackdowns), major technological updates, market manipulation (due to the young, less-regulated nature of crypto), and macroeconomic events. Bitcoin tends to be less volatile than smaller altcoins, which can swing 50% or more in a month. This is why beginners often start with Bitcoin or Ethereum — they're relatively more stable.",
      "Managing volatility risk requires realistic expectations and a long-term mindset. Don't panic sell during downturns — many crypto investors regret selling at the bottom. Instead, use volatility to your advantage: buy during price dips if you believe in the project, and hold through the noise. Diversification (holding multiple assets) also reduces the impact of any single coin's volatility.",
    ],
    "trading-101": [
      "Trading is the act of buying and selling assets to profit from price differences. You buy a coin when you think its price will rise, then sell it at a higher price to lock in profit. In crypto, you can trade via exchanges like Coinbase, Kraken, or Binance. As a beginner, understand that trading is different from investing: traders make frequent moves to exploit short-term price swings, while investors buy and hold long-term.",
      "Before you trade, understand the order types. A market order buys or sells immediately at the current market price — simple but potentially risky during volatile moments. A limit order lets you set a specific price: 'Buy Bitcoin only if it drops to $45,000.' Limit orders give you control but might not execute if the price never reaches your target. Most beginners should start with limit orders to avoid surprises.",
      "Fees matter more than beginners realize. Most exchanges charge 0.1% to 0.5% per trade. If you trade frequently, these fees add up fast. A coin must rise by at least the fee percentage just for you to break even. This is why day trading crypto is difficult — even small fees can eat profits. For now, focus on fewer, more thoughtful trades rather than constant buying and selling.",
      "Psychology is the hardest part of trading. When prices spike, you feel FOMO (fear of missing out) and buy at the peak. When prices crash, you panic and sell at the bottom. Instead, create a trading plan before emotions take over: decide your entry price, exit price, and stop-loss (a price at which you'll cut losses). Stick to your plan even when feelings say otherwise. Discipline beats emotion every time.",
    ],
    "technical-analysis": [
      "Technical analysis is the study of historical price patterns to predict future price movements. Instead of analyzing news or fundamentals, technical analysts look at charts: 'If a coin rose 30% every time this pattern appeared, maybe it will again.' Candlestick charts are the most common format. Each candlestick represents a time period (1 hour, 1 day, etc.) and shows the open, close, high, and low prices for that period.",
      "A green candle means the price closed higher than it opened (bullish). A red candle means the price closed lower (bearish). The body of the candle shows the open-close range, while the thin wicks show the highest and lowest prices touched. When you see a series of green candles, it signals upward momentum. When you see red candles, it signals downward momentum. This is the foundation of reading charts.",
      "Common patterns include support and resistance. Support is a price level where the coin has bounced up multiple times (buyers keep defending this price). Resistance is a price level where the coin has repeatedly failed to break above (sellers keep pushing down). When support breaks, expect lower prices. When resistance breaks, expect higher prices. Trends also matter: uptrends (rising lows and highs) are bullish; downtrends (falling lows and highs) are bearish.",
      "Technical indicators like moving averages and RSI help confirm patterns. A 50-day moving average smooths out daily noise and shows the longer trend. RSI (Relative Strength Index) measures momentum: above 70 is 'overbought' (potential pullback), below 30 is 'oversold' (potential bounce). These tools are helpful but not perfect — no indicator is 100% accurate. Always combine multiple signals before making trades.",
    ],
    "defi": [
      "DeFi (decentralized finance) replaces banks with smart contracts and blockchain. Instead of depositing money in a bank that pays 0.01% interest, you can deposit crypto into a DeFi protocol and earn 5-20% APY (annual percentage yield). Instead of asking a bank for a loan, you can borrow crypto by locking other crypto as collateral. DeFi is transparent, always open (no hours), and available to anyone with an internet connection.",
      "Common DeFi activities include yield farming (staking your crypto in liquidity pools) and lending/borrowing. In yield farming, you deposit two equal-value coins into a pool used by traders, and you earn a percentage of the trading fees. If you deposit $1,000 in a pool earning 20% APY, you'll earn about $200 per year (if rates stay constant). However, there's a risk called impermanent loss: if prices of the two coins diverge significantly, you lose money.",
      "Lending platforms like Aave and Compound let you deposit crypto and earn interest. Your deposited asset generates yield because borrowers pay interest on their loans. You can also borrow: deposit $10,000 of Bitcoin as collateral, then borrow $5,000 of stablecoins (coins tied to the dollar). This is useful if you think Bitcoin will rise but need cash now. However, if Bitcoin price drops, your collateral might get liquidated (automatically sold) to cover the loan.",
      "DeFi is exciting but risky. There's smart contract risk (code bugs can lead to hacks), liquidity risk (you might not be able to withdraw instantly during crises), and the risk of rug pulls (developers steal the project's funds and disappear). Always start small with well-audited, popular protocols like Aave, Compound, or Uniswap. Never invest more than you can afford to lose, and never use leverage (borrowed money) until you're experienced.",
    ],
    "diversification": [
      "Diversification means spreading your money across different assets so one bad investment doesn't wipe you out. If you invest all $10,000 in a single altcoin and it crashes 90%, you've lost nearly everything. But if you invest $5,000 in Bitcoin, $3,000 in Ethereum, and $2,000 in a smaller coin, a single crash hurts you less. This is the key principle of diversification: it reduces risk.",
      "In crypto, diversify by asset class and risk level. Bitcoin and Ethereum are 'blue chip' cryptocurrencies: more stable, larger market caps, and established use cases. Smaller altcoins are riskier but can grow faster. For a balanced portfolio, consider 50-60% Bitcoin/Ethereum (safe core), 30-40% mid-cap coins (moderate risk), and 10% experimental coins (high risk). Adjust these percentages based on your risk tolerance.",
      "Don't diversify into too many coins. Holding 50 different coins becomes unmanageable. A rule of thumb: know every coin you own well enough to explain why you own it in one sentence. If you can't explain it, you probably don't understand it well enough to own it. Quality over quantity: 5 well-researched coins beat 50 coins you know nothing about.",
      "Rebalance regularly (monthly or quarterly). If Bitcoin grows to 70% of your portfolio (your target was 50%), sell some Bitcoin and buy underweight coins. This forces you to 'sell high and buy low' — exactly what good investors do. Rebalancing also keeps you disciplined and prevents overexposure to any single asset. It's boring but essential for long-term wealth building.",
    ],
    "security": [
      "Security means protecting your crypto from theft, loss, and hacks. Crypto is stored in wallets — think of a wallet as a digital account with a private key (a secret password) and a public address (like your username). Anyone with your private key can steal your crypto. So the golden rule: never share your private key with anyone, ever. Not exchanges, not friends, not even supposed support staff.",
      "There are two main wallet types: hot wallets (connected to the internet, convenient but riskier) and cold wallets (offline, secure but less convenient). For beginners, a hot wallet on a trusted exchange like Coinbase is fine — they're insured and have strong security. As you accumulate more crypto, consider a hardware wallet like Ledger or Trezor: small devices that store your keys offline. For the vast majority of people, a hardware wallet is the best balance of safety and usability.",
      "Enable two-factor authentication (2FA) on every account. If a hacker guesses your password, 2FA prevents them from accessing your account because they don't have your phone. Use an authenticator app like Google Authenticator or Authy instead of SMS-based 2FA (SMS can be intercepted). Also, never use the same password across accounts — if one is breached, they're all at risk. Use a password manager like 1Password or Bitwarden.",
      "Watch out for scams. Fake websites that mimic real exchanges are common. Double-check URLs carefully. Never click links in emails claiming to verify your account. Never trust DMs offering 'guaranteed returns' or 'investment opportunities.' If it sounds too good to be true, it is. Assume everyone online wants your money. Verify through official channels (official website, verified social media), and trust nothing else.",
    ],
  }

  for (const indicator of indicators) {
    const content = materialContent[indicator.slug as keyof typeof materialContent]
    if (content) {
      await prisma.material.createMany({
        data: content.map((text, i) => ({
          indicatorId: indicator.id,
          level: `L${i + 1}`,
          content: text,
          order: i + 1,
        })),
      })
    }
  }

  // ================================
  // 4. TOOLTIP GLOSSARY
  // ================================
  console.log("📚 Creating glossary terms...")
  const glossaryTerms = [
    { keyword: "HODL", explanation: "Hold On for Dear Life — a meme strategy of buying crypto and holding long-term, ignoring price volatility." },
    { keyword: "Bag", explanation: "The amount of a particular coin you hold. 'I have a large Bitcoin bag' means you own a lot of Bitcoin." },
    { keyword: "Whale", explanation: "A person or entity that holds a very large amount of crypto. When whales move their coins, it can move markets." },
    { keyword: "Rug Pull", explanation: "A scam where a cryptocurrency project's developers steal the project's funds and disappear, leaving investors with worthless tokens." },
    { keyword: "Moon", explanation: "Slang meaning a coin's price will skyrocket. 'Bitcoin to the moon!' is optimistic hype." },
    { keyword: "Liquidation", explanation: "In leveraged trading, when the value of collateral drops below a threshold and the platform auto-sells your position to cover losses." },
    { keyword: "Slippage", explanation: "The difference between the price you expect and the price you actually get when executing a large trade." },
    { keyword: "Smart Contract", explanation: "Self-executing code on a blockchain that automatically performs actions when conditions are met — no intermediary needed." },
    { keyword: "Gas Fee", explanation: "The fee paid to the Ethereum network to process a transaction. Fees vary based on network congestion." },
    { keyword: "Yield Farming", explanation: "Depositing crypto into a DeFi protocol to earn interest or rewards. Often higher returns but higher risk than simple staking." },
  ]

  await prisma.tooltipGlossary.createMany({ data: glossaryTerms })

  // ================================
  // 5. QUESTIONS (5-6 per indicator)
  // ================================
  console.log("❓ Creating quiz questions...")
  const questions = []

  const questionData = {
    "market-cap": [
      {
        text: "What is the formula for calculating market capitalization?",
        options: [
          { text: "Price per coin × Total coins in circulation", correct: true },
          { text: "Total trading volume ÷ Price per coin", correct: false },
          { text: "Highest price ever ÷ Lowest price ever", correct: false },
          { text: "Number of transactions × Price per coin", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Why is market cap more important than price alone?",
        options: [
          { text: "Because a coin's price alone doesn't tell you the true size or total value", correct: true },
          { text: "Because market cap is easier to calculate", correct: false },
          { text: "Because higher prices always mean better investments", correct: false },
          { text: "Because market cap determines mining difficulty", correct: false },
        ],
        xp: 150,
      },
      {
        text: "If Coin A costs $1 with 1 billion coins in circulation, and Coin B costs $100 with 1 million coins, which has a larger market cap?",
        options: [
          { text: "They have equal market caps ($1 billion)", correct: true },
          { text: "Coin B (because $100 > $1)", correct: false },
          { text: "Coin A (because 1 billion > 1 million)", correct: false },
          { text: "Can't determine without more information", correct: false },
        ],
        xp: 200,
      },
      {
        text: "Which indicator suggests a cryptocurrency is more established and stable?",
        options: [
          { text: "Higher market cap and ranking", correct: true },
          { text: "Faster daily price increases", correct: false },
          { text: "Lower coin price", correct: false },
          { text: "Larger total coin supply", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Market cap can change rapidly due to:",
        options: [
          { text: "Price fluctuations and changes in total coin supply", correct: true },
          { text: "Only through mining rewards", correct: false },
          { text: "Only on weekends", correct: false },
          { text: "Investor sentiment has no effect on market cap", correct: false },
        ],
        xp: 150,
      },
    ],
    "volatility": [
      {
        text: "What does high volatility indicate?",
        options: [
          { text: "Large and frequent price swings, making prediction difficult", correct: true },
          { text: "The coin is a scam", correct: false },
          { text: "The price will go up", correct: false },
          { text: "The market is closed", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Why do smaller altcoins tend to have higher volatility than Bitcoin?",
        options: [
          { text: "Smaller market cap and lower trading volume make prices more sensitive to large trades", correct: true },
          { text: "Altcoins are always scams", correct: false },
          { text: "Bitcoin's volatility is exactly the same", correct: false },
          { text: "Smaller coins have fewer transactions", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Historical volatility measures:",
        options: [
          { text: "Past price movements and how much a coin's price has swung", correct: true },
          { text: "Future price predictions only", correct: false },
          { text: "The total number of coins created", correct: false },
          { text: "How often people tweet about the coin", correct: false },
        ],
        xp: 150,
      },
      {
        text: "During high volatility, the best strategy is to:",
        options: [
          { text: "Stay calm, stick to your plan, and avoid emotional decisions", correct: true },
          { text: "Panic sell immediately", correct: false },
          { text: "Buy as much as possible during every dip", correct: false },
          { text: "Trade as frequently as possible to catch every swing", correct: false },
        ],
        xp: 200,
      },
      {
        text: "What is FOMO in the context of crypto trading?",
        options: [
          { text: "Fear Of Missing Out — buying impulsively when prices spike due to emotional hype", correct: true },
          { text: "A technical indicator on TradingView", correct: false },
          { text: "An acronym for 'Futures Options Market Opening'", correct: false },
          { text: "A type of cryptocurrency", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Which factor does NOT typically drive crypto volatility?",
        options: [
          { text: "The weather forecast for tomorrow", correct: true },
          { text: "Regulatory news and government announcements", correct: false },
          { text: "Major technological updates to the blockchain", correct: false },
          { text: "Macroeconomic events and market sentiment", correct: false },
        ],
        xp: 150,
      },
    ],
    "trading-101": [
      {
        text: "What is the main difference between trading and investing?",
        options: [
          { text: "Traders make frequent moves for short-term profits; investors buy and hold long-term", correct: true },
          { text: "Traders use more money than investors", correct: false },
          { text: "Investing is riskier than trading", correct: false },
          { text: "There is no difference", correct: false },
        ],
        xp: 150,
      },
      {
        text: "A market order:",
        options: [
          { text: "Buys or sells immediately at the current market price", correct: true },
          { text: "Lets you set a specific price for buying or selling", correct: false },
          { text: "Only works on weekends", correct: false },
          { text: "Guarantees no losses", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Why do frequent traders often struggle to profit despite being active?",
        options: [
          { text: "Trading fees add up quickly and can eliminate profits on small gains", correct: true },
          { text: "Exchanges don't allow frequent trading", correct: false },
          { text: "The price only moves once per week", correct: false },
          { text: "Frequent traders are always lucky", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Which is the BEST approach for a beginner trader?",
        options: [
          { text: "Create a trading plan with entry, exit, and stop-loss prices before trading", correct: true },
          { text: "Make trades based on emotions and market hype", correct: false },
          { text: "Use as much leverage as possible to maximize gains", correct: false },
          { text: "Never use stop-losses because they limit potential gains", correct: false },
        ],
        xp: 200,
      },
      {
        text: "A limit order to 'Buy Bitcoin at $45,000' means:",
        options: [
          { text: "The order will execute only if Bitcoin drops to $45,000 or below", correct: true },
          { text: "The order executes immediately at the current price", correct: false },
          { text: "You can only buy one Bitcoin", correct: false },
          { text: "The order will never execute", correct: false },
        ],
        xp: 150,
      },
    ],
    "technical-analysis": [
      {
        text: "A green candlestick indicates:",
        options: [
          { text: "The closing price was higher than the opening price (bullish)", correct: true },
          { text: "The closing price was lower than the opening price", correct: false },
          { text: "No trading occurred", correct: false },
          { text: "A technical error in the chart", correct: false },
        ],
        xp: 150,
      },
      {
        text: "What does 'support' mean in technical analysis?",
        options: [
          { text: "A price level where the coin has bounced up multiple times, showing buyer interest", correct: true },
          { text: "A price level where the coin always falls", correct: false },
          { text: "The lowest price a coin has ever reached", correct: false },
          { text: "Customer service for an exchange", correct: false },
        ],
        xp: 150,
      },
      {
        text: "When support breaks (price falls below it), what should you expect?",
        options: [
          { text: "Prices are likely to drop further", correct: true },
          { text: "Prices will immediately bounce back up", correct: false },
          { text: "The exchange will shut down", correct: false },
          { text: "Support breaking has no meaning", correct: false },
        ],
        xp: 150,
      },
      {
        text: "An uptrend is characterized by:",
        options: [
          { text: "Rising lows and rising highs — each new low is higher than the previous, and new highs are higher", correct: true },
          { text: "Falling prices every day", correct: false },
          { text: "Flat prices with no movement", correct: false },
          { text: "Support levels above resistance", correct: false },
        ],
        xp: 150,
      },
      {
        text: "What does an RSI (Relative Strength Index) above 70 suggest?",
        options: [
          { text: "The coin is overbought and may be due for a pullback or correction", correct: true },
          { text: "The coin is definitely going to the moon", correct: false },
          { text: "All support levels will break", correct: false },
          { text: "The coin is oversold", correct: false },
        ],
        xp: 150,
      },
    ],
    "defi": [
      {
        text: "What is the main advantage of DeFi over traditional banking?",
        options: [
          { text: "Higher returns, transparency, and no intermediary; available 24/7 to anyone with internet", correct: true },
          { text: "DeFi is always completely risk-free", correct: false },
          { text: "Traditional banks offer better returns", correct: false },
          { text: "DeFi requires less capital to start", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Yield farming involves:",
        options: [
          { text: "Depositing crypto into a liquidity pool to earn interest or trading fees", correct: true },
          { text: "Growing crops on a blockchain", correct: false },
          { text: "Mining cryptocurrencies", correct: false },
          { text: "Storing coins indefinitely without any returns", correct: false },
        ],
        xp: 150,
      },
      {
        text: "What is 'impermanent loss' in yield farming?",
        options: [
          { text: "A loss when the prices of two pooled coins diverge significantly", correct: true },
          { text: "A fee charged by the exchange", correct: false },
          { text: "A temporary loss that always recovers", correct: false },
          { text: "Money lost due to hacking", correct: false },
        ],
        xp: 150,
      },
      {
        text: "In a DeFi lending protocol, what is collateral?",
        options: [
          { text: "Crypto you lock up as security to borrow other crypto", correct: true },
          { text: "Interest paid to the lender", correct: false },
          { text: "A fee to use the platform", correct: false },
          { text: "A type of stablecoin", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Why should beginners avoid using leverage in DeFi?",
        options: [
          { text: "Leverage amplifies losses; if collateral value drops, you face liquidation", correct: true },
          { text: "Leverage is always illegal", correct: false },
          { text: "Leverage never helps profits", correct: false },
          { text: "Beginners should use maximum leverage", correct: false },
        ],
        xp: 200,
      },
    ],
    "diversification": [
      {
        text: "The primary goal of diversification is to:",
        options: [
          { text: "Reduce risk by spreading investments across different assets", correct: true },
          { text: "Maximize returns by investing in as many coins as possible", correct: false },
          { text: "Ensure you'll always make money", correct: false },
          { text: "Avoid paying taxes", correct: false },
        ],
        xp: 150,
      },
      {
        text: "How should a balanced beginner portfolio be structured?",
        options: [
          { text: "50-60% Bitcoin/Ethereum (safe core), 30-40% mid-cap, 10% high-risk experimental", correct: true },
          { text: "100% in a single altcoin", correct: false },
          { text: "Equal amounts in 50+ different coins", correct: false },
          { text: "All in stablecoins", correct: false },
        ],
        xp: 150,
      },
      {
        text: "You should own a cryptocurrency only if:",
        options: [
          { text: "You can explain in one sentence why you own it and believe in its use case", correct: true },
          { text: "Everyone on social media is talking about it", correct: false },
          { text: "Someone promised you guaranteed returns", correct: false },
          { text: "The price went up 1000% yesterday", correct: false },
        ],
        xp: 200,
      },
      {
        text: "Rebalancing your portfolio means:",
        options: [
          { text: "Periodically adjusting your holdings to maintain your target allocation percentages", correct: true },
          { text: "Selling everything and starting over", correct: false },
          { text: "Trading every day", correct: false },
          { text: "Buying the same amount of every coin daily", correct: false },
        ],
        xp: 150,
      },
      {
        text: "What is the benefit of rebalancing quarterly?",
        options: [
          { text: "It forces you to 'sell high and buy low' — the essence of smart investing", correct: true },
          { text: "It guarantees profits", correct: false },
          { text: "It eliminates all risk", correct: false },
          { text: "It increases your transaction fees", correct: false },
        ],
        xp: 150,
      },
    ],
    "security": [
      {
        text: "The golden rule of crypto security is:",
        options: [
          { text: "Never share your private key with anyone, ever", correct: true },
          { text: "Share your private key with trusted friends for backup", correct: false },
          { text: "Your private key is the same as your public address", correct: false },
          { text: "Private keys only matter for Bitcoin", correct: false },
        ],
        xp: 200,
      },
      {
        text: "Which wallet type is best for a beginner accumulating small amounts of crypto?",
        options: [
          { text: "A hot wallet on a trusted exchange like Coinbase or Kraken", correct: true },
          { text: "Storing coins on a computer USB drive", correct: false },
          { text: "Memorizing your private key and not writing it down", correct: false },
          { text: "Sharing your account with a friend for safekeeping", correct: false },
        ],
        xp: 150,
      },
      {
        text: "What is two-factor authentication (2FA)?",
        options: [
          { text: "A security feature requiring a second verification (usually a code from your phone) beyond your password", correct: true },
          { text: "Two passwords for the same account", correct: false },
          { text: "An optional feature that slows down login", correct: false },
          { text: "Only for banks, not crypto exchanges", correct: false },
        ],
        xp: 150,
      },
      {
        text: "When should you use a hardware wallet like Ledger or Trezor?",
        options: [
          { text: "When you've accumulated a significant amount of crypto and want maximum security", correct: true },
          { text: "For every transaction, even small amounts", correct: false },
          { text: "Only if you're a professional trader", correct: false },
          { text: "Hardware wallets are never necessary", correct: false },
        ],
        xp: 150,
      },
      {
        text: "What is a common crypto scam red flag?",
        options: [
          { text: "A DM from someone offering guaranteed returns or investment opportunities", correct: true },
          { text: "Official website links in emails", correct: false },
          { text: "Verification requests through official channels", correct: false },
          { text: "Slow loading times on exchanges", correct: false },
        ],
        xp: 150,
      },
      {
        text: "Should you use the same password across multiple crypto exchanges?",
        options: [
          { text: "No — if one exchange is breached, all your accounts with that password are at risk", correct: true },
          { text: "Yes, it's easier to remember one password", correct: false },
          { text: "Only if the password is very long", correct: false },
          { text: "Exchanges don't allow different passwords", correct: false },
        ],
        xp: 150,
      },
    ],
  }

  for (const indicator of indicators) {
    const questionsForIndicator = questionData[indicator.slug as keyof typeof questionData]
    if (questionsForIndicator) {
      for (const q of questionsForIndicator) {
        const question = await prisma.question.create({
          data: {
            indicatorId: indicator.id,
            questionText: q.text,
            xpReward: q.xp,
            xpPenalty: 5,
          },
        })

        await prisma.questionOption.createMany({
          data: q.options.map(opt => ({
            questionId: question.id,
            optionText: opt.text,
            isCorrect: opt.correct,
          })),
        })

        questions.push(question)
      }
    }
  }

  // ================================
  // 6. USERS (50+) WITH REALISTIC NAMES
  // ================================
  console.log("👥 Creating 50+ users with realistic profiles...")
  const firstNames = [
    "Alex", "Jordan", "Casey", "Riley", "Morgan", "Taylor", "Blake", "Avery",
    "Quinn", "Drew", "Cameron", "Parker", "Skye", "Robin", "Jamie", "Dakota",
    "Kai", "Sage", "River", "Phoenix", "Aurora", "Miles", "Roman", "Ezra",
    "Adrian", "Leo", "Marco", "Jasper", "Oscar", "Nathan", "Lucas", "Oliver",
    "Ethan", "Liam", "Noah", "Mason", "Logan", "Jackson", "Aiden", "Benjamin",
    "Lucas", "Henry", "Alexander", "James", "Michael", "David", "Joseph",
    "Sophia", "Emma", "Olivia", "Isabella", "Mia", "Charlotte", "Amelia",
  ]

  const lastNames = [
    "Chen", "Garcia", "Singh", "Patel", "Kim", "Johnson", "Williams", "Brown",
    "Jones", "Lee", "Martinez", "Anderson", "Taylor", "Thomas", "Moore", "Jackson",
    "Martin", "Harrison", "Thompson", "White", "Harris", "Martin", "Perez", "Roberts",
  ]

  const usernames = new Set<string>()
  const users = []

  // Generate realistic users
  for (let i = 0; i < 55; i++) {
    let username: string
    let attempts = 0
    do {
      const first = randomElement(firstNames)
      const last = randomElement(lastNames)
      username = `${first}${last}${randomBetween(100, 999)}`
      attempts++
    } while (usernames.has(username) && attempts < 10)

    usernames.add(username)

    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
        email: `${username.toLowerCase()}@coinedu.demo`,
        emailVerified: Math.random() > 0.3,
        image: null,
      },
    })

    users.push(user)
  }

  // ================================
  // 7. SEASONAL XP (WITH REALISTIC DISTRIBUTION)
  // ================================
  console.log("🏆 Distributing seasonal XP...")
  for (const season of seasons) {
    const xpDistribution = users.map((user, i) => {
      let xp: number

      // Realistic distribution: few whales, more mid-tier, many beginners
      if (i < 3) {
        // Top 3 whales
        xp = randomBetween(35000, 55000)
      } else if (i < 10) {
        // High performers
        xp = randomBetween(20000, 35000)
      } else if (i < 25) {
        // Mid-tier active users
        xp = randomBetween(8000, 20000)
      } else if (i < 40) {
        // Casual players
        xp = randomBetween(2000, 8000)
      } else {
        // Beginners / inactive
        xp = randomBetween(0, 2000)
      }

      return {
        userId: user.id,
        seasonId: season.id,
        totalXp: xp,
      }
    })

    await prisma.userSeasonXP.createMany({ data: xpDistribution })
  }

  // ================================
  // 8. REALISTIC ATTEMPT HISTORY
  // ================================
  console.log("📋 Creating attempt history...")
  const attempts = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Generate attempts with realistic patterns
  for (const user of users) {
    // Each user has 3-40 attempts depending on engagement
    let attemptCount: number
    const userIndex = users.indexOf(user)

    if (userIndex < 5) {
      attemptCount = randomBetween(25, 50) // Very active
    } else if (userIndex < 15) {
      attemptCount = randomBetween(15, 25) // Active
    } else if (userIndex < 35) {
      attemptCount = randomBetween(5, 15) // Moderate
    } else {
      attemptCount = randomBetween(0, 8) // Casual
    }

    // Shuffle indicators and questions
    const shuffledIndicators = [...indicators].sort(() => Math.random() - 0.5)

    for (let i = 0; i < attemptCount; i++) {
      const indicator = randomElement(shuffledIndicators)
      const indicatorQuestions = questions.filter(q => q.indicatorId === indicator.id)

      if (indicatorQuestions.length === 0) continue

      const question = randomElement(indicatorQuestions)
      const isCorrect = Math.random() > 0.35 // ~65% success rate overall, varies by user

      // Distribute attempts over the past 30 days
      const daysAgo = randomBetween(0, 30)
      const attemptDate = new Date(today)
      attemptDate.setDate(attemptDate.getDate() - daysAgo)

      // Add random hours and minutes for realism
      attemptDate.setHours(randomBetween(0, 23))
      attemptDate.setMinutes(randomBetween(0, 59))

      attempts.push({
        userId: user.id,
        indicatorId: indicator.id,
        questionId: question.id,
        isCorrect,
        xpEarned: isCorrect ? question.xpReward : -question.xpPenalty,
        attemptedAt: attemptDate,
      })
    }
  }

  // Batch create attempts
  await prisma.dailyAttempt.createMany({ data: attempts, skipDuplicates: true })

  // ================================
  // SUMMARY
  // ================================
  console.log("\n✅ Seed complete! Summary:")
  console.log(`   📅 Seasons: ${seasons.length}`)
  console.log(`   📚 Indicators: ${indicators.length}`)
  console.log(`   📖 Materials: ${indicators.length * 4} (4 levels each)`)
  console.log(`   ❓ Questions: ${questions.length}`)
  console.log(`   📚 Glossary Terms: ${glossaryTerms.length}`)
  console.log(`   👥 Users: ${users.length}`)
  console.log(`   📊 Total Attempts: ${attempts.length}`)
  console.log(`   🏆 Seasonal XP Records: ${users.length * seasons.length}`)
  console.log("\n🎉 Your demo is ready! Users can now:")
  console.log("   • Learn from 7 detailed curriculum modules")
  console.log("   • Answer 30+ quiz questions")
  console.log("   • Compete on leaderboards")
  console.log("   • See realistic user engagement patterns")
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())