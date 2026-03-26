import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        // Get the session
        const session = await auth.api.getSession({
            headers: request.headers,
        })

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const { searchParams } = request.nextUrl
        const seasonId = searchParams.get("seasonId")

        if (!seasonId) {
            return NextResponse.json(
                { error: "Season ID is required" },
                { status: 400 }
            )
        }

        // Get user's seasonal XP
        const userSeasonXP = await prisma.userSeasonXP.findUnique({
            where: {
                userId_seasonId: {
                    userId: session.user.id,
                    seasonId: seasonId,
                },
            },
        })

        // Get all indicators and user's attempts for today
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const indicators = await prisma.indicator.findMany({
            orderBy: {
                name: "asc",
            },
        })

        // For each indicator, check if user attempted it today
        const userAttempts = await prisma.dailyAttempt.findMany({
            where: {
                userId: session.user.id,
                attemptedAt: {
                    gte: today,
                },
            },
            select: {
                indicatorId: true,
                isCorrect: true,
                xpEarned: true,
            },
        })

        const attemptMap = new Map(
            userAttempts.map((att) => [att.indicatorId, att])
        )

        const indicatorProgress = indicators.map((ind) => {
            const attempt = attemptMap.get(ind.id)
            return {
                id: ind.id,
                name: ind.name,
                slug: ind.slug,
                attempted: !!attempt,
                correct: attempt?.isCorrect || false,
                xpEarned: attempt?.xpEarned || 0,
            }
        })

        return NextResponse.json({
            totalXp: userSeasonXP?.totalXp || 0,
            indicators: indicatorProgress,
        })
    } catch (error) {
        console.error("Error fetching progress:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}