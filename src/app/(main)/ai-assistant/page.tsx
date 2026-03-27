"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { BotIcon, MicIcon, PlusCircleIcon, SendHorizonalIcon } from "lucide-react"
import { get } from "http"

// Types 

type Message = {
  id: string
  role: "ai" | "user"
  timestamp: string
  content: React.ReactNode
}

// Helper to generate timestamps for messages
function getTimestamp(label: "YOU" | "COINEDU AI") {
  const now = new Date()

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return `${label} · ${time}`
}

// Message

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    timestamp: getTimestamp("COINEDU AI"),
    content:
      "Hello! I can help you understand complex crypto concepts. What would you like to learn about today?",
  },
  {
    id: "2",
    role: "user",
    timestamp: getTimestamp("YOU"),
    content:
      "What is the difference between a hot wallet and a cold wallet?",
  },
  {
    id: "3",
    role: "ai",
    timestamp: "COINEDU AI · JUST NOW",
    content: (
      <div className="space-y-3 text-sm leading-7">
        <p>
          That&apos;s a fundamental question in crypto security! Think of it like
          the difference between a{" "}
          <span className="text-secondary">checking account</span> and a{" "}
          <span className="text-tertiary">bank vault</span>.
        </p>
        <div className="rounded-r-md border-l-2 border-primary bg-muted/60 p-3">
          <p className="font-semibold text-secondary">Hot Wallet (Always On)</p>
          <p className="mt-0.5 text-muted-foreground">
            Connected to the internet via your phone, browser, or desktop.
          </p>
          <ul className="mt-2 space-y-1 pl-4 text-muted-foreground">
            <li>
              Fast for{" "}
              <span className="text-secondary">active trading</span> and
              transactions.
            </li>
            <li>Easy to set up and accessible anywhere.</li>
            <li>
              Higher risk of{" "}
              <span className="text-destructive">online hacks</span> or
              phishing.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
]

// Component 

export default function Page() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
  const text = input.trim()
  if (!text) return

  const userMsg: Message = {
    id: Date.now().toString(),
    role: "user",
    timestamp: getTimestamp("YOU"),
    content: text,
  }

  // Add user message first
  setMessages((prev) => [...prev, userMsg])
  setInput("")

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...messages.map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content:
              typeof m.content === "string"
                ? m.content
                : "Complex response",
          })),
          { role: "user", content: text },
        ],
      }),
    })

    const data = await res.json()

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      timestamp: getTimestamp("COINEDU AI"),
      content: data.reply || "No response",
    }

    setMessages((prev) => [...prev, aiMsg])
  } catch (error) {
    console.error(error)

    const errorMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      timestamp: getTimestamp("COINEDU AI"),
      content: "⚠️ Failed to get response. Try again.",
    }

    setMessages((prev) => [...prev, errorMsg])
  }
}

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              {msg.role === "ai" ? (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                  <BotIcon className="size-4 text-muted-foreground" />
                </div>
              ) : (
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    N
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Bubble + timestamp */}
              <div
                className={cn(
                  "flex max-w-[75%] flex-col gap-1",
                  msg.role === "user" && "items-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "ai"
                      ? "bg-card text-card-foreground"
                      : "bg-primary/20 text-foreground"
                  )}
                >
                  {msg.content}
                </div>
                <p className="px-1 text-[10px] font-medium tracking-wider text-muted-foreground">
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-background px-4 py-3 lg:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-3 py-2">
            <Button variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground">
              <PlusCircleIcon className="size-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="flex-1 border-0 bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground">
              <MicIcon className="size-4" />
            </Button>
            <Button
              size="icon"
              className="size-8 shrink-0 rounded-xl"
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              <SendHorizonalIcon className="size-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            AI can make mistakes. Verify important financial details.
          </p>
        </div>
      </div>

    </div>
  )
}
