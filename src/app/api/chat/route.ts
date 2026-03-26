import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            `You are CoinEdu AI.
            - You teach crypto and finance simply.
            - If the user sends unclear input like "tes", "test", or random text,
            respond casually and ask what they need help with.
            - DO NOT assume a topic if the message is unclear.
            `,
        },
        ...messages,
      ],
    })

    const reply = completion.choices[0]?.message?.content

    return NextResponse.json({ reply })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    )
  }
}