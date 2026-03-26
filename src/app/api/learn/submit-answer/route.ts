import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
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

        const body = await request.json()
        const { questionId, selectedOptionId, indicatorId, seasonId } = body

        // Validate input
        if (!questionId || !selectedOptionId || !indicatorId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Fetch the question and its options
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: { options: true },
        })

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            )
        }

        // Find the selected option
        const selectedOption = question.options.find(
            (opt) => opt.id === selectedOptionId
        )

        if (!selectedOption) {
            return NextResponse.json(
                { error: "Invalid option selected" },
                { status: 400 }
            )
        }

        // Determine if answer is correct
        const isCorrect = selectedOption.isCorrect

        // Calculate XP earned
        const xpEarned = isCorrect ? question.xpReward : -question.xpPenalty

        // Check if user already answered this question today (for the same indicator)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const existingAttempt = await prisma.dailyAttempt.findFirst({
            where: {
                userId: session.user.id,
                indicatorId: indicatorId,
                attemptedAt: {
                    gte: today,
                },
            },
        })

        if (existingAttempt) {
            return NextResponse.json(
                { error: "You have already answered a question for this indicator today" },
                { status: 429 }
            )
        }

        // Create the attempt record
        const attempt = await prisma.dailyAttempt.create({
            data: {
                userId: session.user.id,
                questionId: questionId,
                indicatorId: indicatorId,
                isCorrect: isCorrect,
                xpEarned: xpEarned,
                attemptedAt: new Date(),
            },
        })

        // Update user's seasonal XP
        let userSeasonXP = await prisma.userSeasonXP.findUnique({
            where: {
                userId_seasonId: {
                    userId: session.user.id,
                    seasonId: seasonId || "",
                },
            },
        })

        if (seasonId) {
            if (!userSeasonXP) {
                userSeasonXP = await prisma.userSeasonXP.create({
                    data: {
                        userId: session.user.id,
                        seasonId: seasonId,
                        totalXp: Math.max(0, xpEarned), // Don't let it go negative
                    },
                })
            } else {
                userSeasonXP = await prisma.userSeasonXP.update({
                    where: {
                        userId_seasonId: {
                            userId: session.user.id,
                            seasonId: seasonId,
                        },
                    },
                    data: {
                        totalXp: {
                            increment: xpEarned,
                        },
                    },
                })
            }
        }

        return NextResponse.json({
            success: true,
            attempt: {
                id: attempt.id,
                isCorrect: attempt.isCorrect,
                xpEarned: attempt.xpEarned,
            },
            seasonXP: userSeasonXP?.totalXp || 0,
        })
    } catch (error) {
        console.error("Error submitting answer:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}