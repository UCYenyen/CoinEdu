import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ indicatorId: string }> }
) {
    try {
        const { indicatorId } = await params

        // Fetch the indicator with materials and questions
        const indicator = await prisma.indicator.findUnique({
            where: { id: indicatorId },
            include: {
                materials: {
                    orderBy: {
                        order: "asc",
                    },
                },
                questions: {
                    include: {
                        options: {
                            select: {
                                id: true,
                                optionText: true,
                                // Don't return isCorrect to the client
                            },
                        },
                    },
                    take: 1, // Get one question for now
                },
            },
        })

        if (!indicator) {
            return NextResponse.json(
                { error: "Indicator not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            indicator: {
                id: indicator.id,
                name: indicator.name,
                slug: indicator.slug,
            },
            materials: indicator.materials,
            question: indicator.questions[0] || null,
        })
    } catch (error) {
        console.error("Error fetching indicator:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}