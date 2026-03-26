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

async function main() {
  console.log("Seeding dataset...")

  // ================================
  // 1. SEASONS (PAST + CURRENT)
  // ================================
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
        name: "Winter 2024",
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
  // 2. INDICATORS (MORE VARIETY)
  // ================================
  const indicatorData = [
    ["Market Capitalization", "market-cap"],
    ["Volatility & Risk", "volatility"],
    ["Trading Fundamentals", "trading-101"],
    ["Technical Analysis", "technical-analysis"],
    ["DeFi Basics", "defi"],
  ]

  const indicators = await Promise.all(
    indicatorData.map(([name, slug]) =>
      prisma.indicator.create({ data: { name, slug } })
    )
  )

  // ================================
  // 3. MATERIALS (L1–L4)
  // ================================
  for (const indicator of indicators) {
    await prisma.material.createMany({
      data: Array.from({ length: 4 }).map((_, i) => ({
        indicatorId: indicator.id,
        level: `L${i + 1}`,
        content: `${indicator.name} lesson ${i + 1} with real-world examples.`,
        order: i + 1,
      })),
    })
  }

  // ================================
  // 4. QUESTIONS (5 per indicator)
  // ================================
  const questions = []

  for (const indicator of indicators) {
    for (let i = 1; i <= 5; i++) {
      const q = await prisma.question.create({
        data: {
          indicatorId: indicator.id,
          questionText: `${indicator.name} Question ${i}`,
          xpReward: randomBetween(80, 150),
          xpPenalty: 10,
        },
      })

      questions.push(q)

      await prisma.questionOption.createMany({
        data: [
          { questionId: q.id, optionText: "Correct answer", isCorrect: true },
          { questionId: q.id, optionText: "Wrong A", isCorrect: false },
          { questionId: q.id, optionText: "Wrong B", isCorrect: false },
          { questionId: q.id, optionText: "Wrong C", isCorrect: false },
        ],
      })
    }
  }

  // ================================
  // 5. USERS (30+)
  // ================================
  const baseNames = [
    "BlockMaster","EtherWiz","SatoshiNaka","CryptoSage",
    "AltSeeker","DexHunter","ChainGang","TokenTracker",
    "WalletWatch","CoinFollower","TradingKid",
    "BullRunner","BearSlayer","WhaleWatcher","DeFiWizard",
    "ChartGuru","MoonChaser","FOMOKing","DiamondHands",
    "PaperHands","GasFeeHero","LiquidityLord"
  ]

  const users = await Promise.all(
    baseNames.map(name =>
      prisma.user.create({
        data: {
          id: randomUUID(),
          name,
          email: `${name.toLowerCase()}@test.com`,
        },
      })
    )
  )

  // ================================
  // 6. XP PER SEASON (DIFFERENT META)
  // ================================
  for (const season of seasons) {
    await prisma.userSeasonXP.createMany({
      data: users.map((user, i) => {
        let xp

        if (i < 5) xp = randomBetween(15000, 25000)
        else if (i < 15) xp = randomBetween(5000, 12000)
        else xp = randomBetween(500, 4000)

        return {
          userId: user.id,
          seasonId: season.id,
          totalXp: xp,
        }
      }),
    })
  }

  // ================================
  // 7. ATTEMPTS (REALISTIC TIMELINE)
  // ================================
  const attempts = []

  for (const user of users) {
    const attemptCount = randomBetween(5, 15)

    for (let i = 0; i < attemptCount; i++) {
      const q = questions[randomBetween(0, questions.length)]

      attempts.push({
        userId: user.id,
        indicatorId: q.indicatorId,
        questionId: q.id,
        isCorrect: Math.random() > 0.3,
        xpEarned: 100,
        attemptedAt: new Date(Date.now() - randomBetween(1, 14) * 86400000),
      })
    }
  }

  await prisma.dailyAttempt.createMany({ data: attempts })

  console.log("Full seed complete!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())