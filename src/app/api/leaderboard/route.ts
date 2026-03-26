import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl
        const seasonId = searchParams.get("seasonId")
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100) // Max 100

        if (!seasonId) {
            return NextResponse.json(
                { error: "Season ID is required" },
                { status: 400 }
            )
        }

        // Fetch top users by XP for the season
        const leaderboard = await prisma.userSeasonXP.findMany({
            where: {
                seasonId: seasonId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                totalXp: "desc",
            },
            take: limit,
        })

        // Add rankings
        const ranked = leaderboard.map((entry, index) => ({
            rank: index + 1,
            userId: entry.user.id,
            username: entry.user.name,
            email: entry.user.email,
            avatar: entry.user.image,
            xp: entry.totalXp,
            // Calculate performance (this calculation is just a placeholder for now)
            return: `${((entry.totalXp / 1000) * 5).toFixed(1)}%`,
        }))

        return NextResponse.json({
            entries: ranked,
            total: leaderboard.length,
        })
    } catch (error) {
        console.error("Error fetching leaderboard:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}