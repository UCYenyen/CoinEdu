import 'dotenv/config'
import { prisma } from "@/lib/prisma"

console.log("DATABASE_URL =", process.env.DATABASE_URL);

async function main() {
    console.log("🌱 Starting database seed...")

    // Clear existing data (optional - comment out if you want to keep data)
    // await prisma.dailyAttempt.deleteMany({})
    // await prisma.userSeasonXP.deleteMany({})
    // await prisma.questionOption.deleteMany({})
    // await prisma.question.deleteMany({})
    // await prisma.material.deleteMany({})
    // await prisma.indicator.deleteMany({})
    // await prisma.season.deleteMany({})

    // ==========================================
    // 1. Create Season
    // ==========================================
    const season = await prisma.season.create({
        data: {
            name: "Season 1 - Crypto Fundamentals",
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-03-31"),
            isActive: true,
        },
    })
    console.log(`Created season: ${season.name} (${season.id})`)

    // ==========================================
    // 2. Create Indicators & Content
    // ==========================================

    // Indicator 1: Market Cap
    const marketCapIndicator = await prisma.indicator.create({
        data: {
            name: "Market Cap",
            slug: "market-cap",
        },
    })

    await prisma.material.create({
        data: {
            indicatorId: marketCapIndicator.id,
            level: "L1",
            content: `Market capitalization (market cap) is the total market value of a cryptocurrency.
 
It's calculated as:
Market Cap = Current Price × Circulating Supply
 
For example:
- If Bitcoin is priced at $40,000
- And there are 21 million Bitcoin in circulation
- Market Cap = $40,000 × 21,000,000 = $840 billion
 
Why is market cap important?
- It shows the relative size of cryptocurrencies
- A higher market cap often means more stability
- It helps investors understand valuation compared to other cryptocurrencies`,
            order: 1,
        },
    })

    const marketCapQuestion = await prisma.question.create({
        data: {
            indicatorId: marketCapIndicator.id,
            questionText: "How is market cap calculated?",
            xpReward: 100,
            xpPenalty: 10,
            options: {
                create: [
                    {
                        optionText: "Current Price × Circulating Supply",
                        isCorrect: true,
                    },
                    {
                        optionText: "Daily Trading Volume × Price",
                        isCorrect: false,
                    },
                    {
                        optionText: "Total Supply × Historical Price",
                        isCorrect: false,
                    },
                ],
            },
        },
    })

    console.log(`Created indicator: Market Cap`)

    // Indicator 2: Volatility
    const volatilityIndicator = await prisma.indicator.create({
        data: {
            name: "Volatility",
            slug: "volatility",
        },
    })

    await prisma.material.create({
        data: {
            indicatorId: volatilityIndicator.id,
            level: "L1",
            content: `Volatility in cryptocurrency refers to the rapid and significant price changes over short periods.
 
Key concepts:
- High Volatility: Large price swings in short time frames
- Low Volatility: Stable, gradual price movements
- Standard Deviation: Measures how spread out prices are from the average
 
Why volatility matters:
- Higher volatility = Higher risk and potential rewards
- Investors use volatility to plan entry and exit points
- Understanding volatility helps with position sizing
- Volatile assets require better risk management
 
Historical context:
- Bitcoin is more volatile than traditional assets
- Altcoins are typically more volatile than Bitcoin
- Market cycles create periods of high and low volatility`,
            order: 1,
        },
    })

    const volatilityQuestion = await prisma.question.create({
        data: {
            indicatorId: volatilityIndicator.id,
            questionText: "What does high volatility indicate?",
            xpReward: 100,
            xpPenalty: 10,
            options: {
                create: [
                    {
                        optionText: "Large price swings in short periods",
                        isCorrect: true,
                    },
                    {
                        optionText: "Stable and predictable prices",
                        isCorrect: false,
                    },
                    {
                        optionText: "High trading volume only",
                        isCorrect: false,
                    },
                ],
            },
        },
    })

    console.log(`Created indicator: Volatility`)

    // Indicator 3: Risk Management
    const riskManagementIndicator = await prisma.indicator.create({
        data: {
            name: "Risk Management",
            slug: "risk-management",
        },
    })

    await prisma.material.create({
        data: {
            indicatorId: riskManagementIndicator.id,
            level: "L1",
            content: `Risk management is the practice of protecting your capital from losses.
 
Essential risk management strategies:
1. Position Sizing: Never risk more than 2-5% of your portfolio on one trade
2. Stop Losses: Set automatic exit points to limit losses
3. Take Profits: Lock in gains at predetermined levels
4. Diversification: Spread investments across multiple assets
5. Dollar-Cost Averaging: Invest fixed amounts at regular intervals
 
Why it matters:
- One bad trade can wipe out gains from many good trades
- Emotions lead to poor decisions - rules prevent this
- Protecting capital is more important than making gains
- Consistent small wins beat occasional big wins
 
Common mistakes:
- Over-leveraging (borrowing to trade)
- Not setting stop losses
- Holding losing positions too long
- Putting all money in one asset`,
            order: 1,
        },
    })

    const riskManagementQuestion = await prisma.question.create({
        data: {
            indicatorId: riskManagementIndicator.id,
            questionText: "What percentage of portfolio should you risk per trade?",
            xpReward: 100,
            xpPenalty: 10,
            options: {
                create: [
                    {
                        optionText: "2-5%",
                        isCorrect: true,
                    },
                    {
                        optionText: "20-30%",
                        isCorrect: false,
                    },
                    {
                        optionText: "50% or more",
                        isCorrect: false,
                    },
                ],
            },
        },
    })

    console.log(`Created indicator: Risk Management`)

    // Indicator 4: Diversification
    const diversificationIndicator = await prisma.indicator.create({
        data: {
            name: "Diversification",
            slug: "diversification",
        },
    })

    await prisma.material.create({
        data: {
            indicatorId: diversificationIndicator.id,
            level: "L1",
            content: `Diversification is the practice of spreading investments across multiple assets to reduce risk.
 
Types of diversification:
1. Asset Class: Mix of crypto, stocks, bonds
2. Cryptocurrency Types: Bitcoin, Ethereum, altcoins
3. Sectors: DeFi, NFTs, Layer-2s, Payments
4. Geographic: Different exchanges and regions
5. Time: Buy over time rather than all at once
 
Benefits:
- Reduces impact of single asset failure
- Smooths out overall portfolio returns
- Reduces emotional decision-making
- Protects against sector-specific risks
 
Example portfolio:
- 40% Bitcoin (store of value)
- 30% Ethereum (smart contracts)
- 20% Altcoins (growth potential)
- 10% Stablecoins (stability/liquidity)
 
Risks of over-diversification:
- Too many assets to monitor
- Dilutes potential gains
- Increases transaction fees`,
            order: 1,
        },
    })

    const diversificationQuestion = await prisma.question.create({
        data: {
            indicatorId: diversificationIndicator.id,
            questionText: "Why is diversification important in a portfolio?",
            xpReward: 100,
            xpPenalty: 10,
            options: {
                create: [
                    {
                        optionText: "It reduces the impact of single asset failure",
                        isCorrect: true,
                    },
                    {
                        optionText: "It guarantees profits",
                        isCorrect: false,
                    },
                    {
                        optionText: "It eliminates the need for stop losses",
                        isCorrect: false,
                    },
                ],
            },
        },
    })

    console.log(`Created indicator: Diversification`)

    // Indicator 5: Technical Analysis Basics
    const technicalAnalysisIndicator = await prisma.indicator.create({
        data: {
            name: "Technical Analysis Basics",
            slug: "technical-analysis-basics",
        },
    })

    await prisma.material.create({
        data: {
            indicatorId: technicalAnalysisIndicator.id,
            level: "L1",
            content: `Technical analysis is the study of past price movements to predict future price direction.
 
Core principles:
1. Price Action: Past prices contain all available information
2. Trends: Prices move in trends (up, down, sideways)
3. Support & Resistance: Prices struggle at certain levels
4. Patterns: Historical patterns repeat over time
 
Common tools:
- Moving Averages: Smooth out price noise
- Candlestick Patterns: Visual price action signals
- Support/Resistance: Key price levels
- Volume: Trading activity at price levels
- Indicators: RSI, MACD, Bollinger Bands, etc.
 
How to use it:
1. Identify the trend direction
2. Find support/resistance levels
3. Look for reversal patterns
4. Wait for confirmation signals
5. Execute with proper risk management
 
Limitations:
- Works better on longer timeframes
- Self-fulfilling prophecy
- Doesn't predict black swan events
- Requires practice and discipline`,
            order: 1,
        },
    })

    const technicalAnalysisQuestion = await prisma.question.create({
        data: {
            indicatorId: technicalAnalysisIndicator.id,
            questionText: "What is the main principle of technical analysis?",
            xpReward: 100,
            xpPenalty: 10,
            options: {
                create: [
                    {
                        optionText:
                            "Past prices contain all available information",
                        isCorrect: true,
                    },
                    {
                        optionText: "Prices always go up long-term",
                        isCorrect: false,
                    },
                    {
                        optionText: "Volume doesn't matter for analysis",
                        isCorrect: false,
                    },
                ],
            },
        },
    })

    console.log(`Created indicator: Technical Analysis Basics`)

    // ==========================================
    // 3. Create sample user and their progress
    // ==========================================
    // NOTE: In production, you'd have real users from authentication
    // This is just for testing the leaderboard

    console.log("\nSummary:")
    console.log(`- Season created: ${season.name}`)
    console.log(`- 5 Indicators created with materials and questions`)
    console.log(`- Season ID: ${season.id}`)
    console.log("\nExample queries:")
    console.log(`GET /api/seasons/active`)
    console.log(`GET /api/learn/indicators`)
    console.log(`GET /api/learn/${marketCapIndicator.id}`)
    console.log(`GET /api/leaderboard?seasonId=${season.id}`)

    console.log("\nDatabase seeded successfully!")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("Seeding failed:", e)
        await prisma.$disconnect()
        process.exit(1)
    })