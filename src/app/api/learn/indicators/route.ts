// src/app/api/learn/indicators/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const indicators = await prisma.indicator.findMany({
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        })

        return NextResponse.json({
            indicators,
        })
    } catch (error) {
        console.error("Error fetching indicators:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}