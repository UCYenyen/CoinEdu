import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const activeSeason = await prisma.season.findFirst({
            where: {
                isActive: true,
            },
        })

        if (!activeSeason) {
            // Return a default/null response if no active season
            return NextResponse.json({
                season: null,
                message: "No active season found",
            })
        }

        return NextResponse.json({
            season: {
                id: activeSeason.id,
                name: activeSeason.name,
                startDate: activeSeason.startDate,
                endDate: activeSeason.endDate,
            },
        })
    } catch (error) {
        console.error("Error fetching active season:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}