"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserIcon, TrophyIcon, ZapIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Data ──────────────────────────────────────────────────────────────────

const allEntries = [
  { rank: 1, username: "BlockMaster", xp: 19420, return: "+24.2%", positive: true },
  { rank: 2, username: "EtherWiz",    xp: 14800, return: "+18.4%", positive: true },
  { rank: 3, username: "SatoshiNaka", xp: 12100, return: "+15.9%", positive: true },
  { rank: 4, username: "NodesRunner", xp: 9850,  return: "+11.4%", positive: true },
  { rank: 5, username: "CryptoSage",  xp: 8200,  return: "+9.7%",  positive: true },
  { rank: 6, username: "AltSeeker",   xp: 7100,  return: "+7.2%",  positive: true },
  { rank: 7, username: "DexHunter",   xp: 5950,  return: "+5.1%",  positive: true },
  { rank: 8, username: "LongHolder",  xp: 4300,  return: "-1.8%",  positive: false },
]

// Medal style per rank
const medalConfig: Record<number, { color: string; label: string }> = {
  1: { color: "text-tertiary",         label: "#01" },
  2: { color: "text-muted-foreground", label: "#02" },
  3: { color: "text-destructive",      label: "#03" },
}

// ── Podium Card ────────────────────────────────────────────────────────────

function PodiumCard({
  entry,
  isFirst,
}: {
  entry: (typeof allEntries)[number]
  isFirst?: boolean
}) {
  const medal = medalConfig[entry.rank]

  return (
    <div className="flex flex-1 flex-col">
      {isFirst && (
        <div className="mb-2 flex justify-center">
          <Badge
            variant="outline"
            className="border-primary/40 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            Current Leader
          </Badge>
        </div>
      )}
      <Card
        className={cn(
          "relative flex flex-col gap-4 overflow-hidden py-6",
          isFirst &&
            "shadow-[0_0_0_1px_hsl(var(--primary)/0.45)] bg-gradient-to-b from-primary/10 to-card"
        )}
      >
        {/* Rank watermark */}
        <span
          className={cn(
            "absolute right-4 top-3 text-4xl font-black tracking-tighter opacity-20",
            medal?.color
          )}
        >
          {medal?.label}
        </span>

        <CardHeader className="px-6 pb-0">
          {/* Medal icon */}
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full border-2 bg-muted",
              entry.rank === 1
                ? "border-tertiary"
                : entry.rank === 2
                ? "border-muted-foreground/40"
                : "border-destructive/50"
            )}
          >
            <TrophyIcon className={cn("size-4", medal?.color)} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-6">
          {/* User avatar placeholder */}
          <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted">
            <UserIcon className="size-5 text-muted-foreground" />
          </div>

          {/* Name + return */}
          <div>
            <p
              className={cn(
                "font-semibold tracking-tight",
                isFirst ? "text-2xl" : "text-xl"
              )}
            >
              {entry.username}
            </p>
            <p className="text-sm font-semibold text-secondary">
              {entry.return} Return
            </p>
          </div>

          {/* XP */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Experience
            </p>
            <p
              className={cn(
                "text-xl font-semibold tabular-nums",
                isFirst ? "text-tertiary" : ""
              )}
            >
              {entry.xp.toLocaleString()}{" "}
              <span className="text-sm font-bold">XP</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function Page() {
  const [period, setPeriod] = useState<"weekly" | "alltime">("weekly")

  const top3 = allEntries.slice(0, 3)
  // display order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]]

  const rest = allEntries.slice(3)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">

          {/* ── Header ──────────────────────────────────────────── */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">
                Global Rankings
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Compete with the world&apos;s most luminous traders and earn
                your place on the ledger.
              </p>
            </div>

            {/* Period toggle */}
            <div className="flex items-center rounded-lg border border-border bg-muted p-1">
              <Button
                variant={period === "weekly" ? "default" : "ghost"}
                size="sm"
                className="rounded-md"
                onClick={() => setPeriod("weekly")}
              >
                Weekly
              </Button>
              <Button
                variant={period === "alltime" ? "default" : "ghost"}
                size="sm"
                className="rounded-md"
                onClick={() => setPeriod("alltime")}
              >
                All-Time
              </Button>
            </div>
          </div>

          {/* ── Podium ──────────────────────────────────────────── */}
          <div className="flex items-end gap-3 md:gap-4">
            {podiumOrder.map((entry) => (
              <PodiumCard
                key={entry.rank}
                entry={entry}
                isFirst={entry.rank === 1}
              />
            ))}
          </div>

          {/* ── Rankings table ──────────────────────────────────── */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Navigator</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead className="text-right">Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rest.map((entry) => (
                    <TableRow key={entry.rank}>
                      <TableCell className="font-semibold tabular-nums text-muted-foreground">
                        {String(entry.rank).padStart(2, "0")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-7 items-center justify-center rounded-full border border-border bg-muted">
                            <UserIcon className="size-3.5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{entry.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="tabular-nums">
                        <span className="flex items-center gap-1 font-medium">
                          <ZapIcon className="size-3.5 text-tertiary" />
                          {entry.xp.toLocaleString()} XP
                        </span>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums font-semibold",
                          entry.positive ? "text-secondary" : "text-destructive"
                        )}
                      >
                        {entry.return}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
