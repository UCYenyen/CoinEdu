"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
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
import {
  UserIcon,
  TrophyIcon,
  ZapIcon,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import * as apiClient from "@/lib/api-client"

// ─── Types ───────────────────────────────────────────────────────────────

type PeriodType = "weekly" | "alltime"

interface PodiumEntry {
  rank: number
  username: string
  totalXp: number
  avatar?: string
}

const medalConfig: Record<number, { color: string; label: string }> = {
  1: { color: "text-tertiary", label: "#01" },
  2: { color: "text-muted-foreground", label: "#02" },
  3: { color: "text-destructive", label: "#03" },
}

// ─── Podium Card Component ────────────────────────────────────────────────

interface PodiumCardProps {
  entry: PodiumEntry
  isFirst?: boolean
}

function PodiumCard({ entry, isFirst }: PodiumCardProps) {
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
          {/* User avatar */}
          <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted">
            {entry.avatar ? (
              <img
                src={entry.avatar}
                alt={entry.username}
                className="size-full rounded-full object-cover"
              />
            ) : (
              <UserIcon className="size-5 text-muted-foreground" />
            )}
          </div>

          {/* Name */}
          <div>
            <p
              className={cn(
                "font-semibold tracking-tight",
                isFirst ? "text-2xl" : "text-xl"
              )}
            >
              {entry.username}
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
              {apiClient.formatXp(entry.totalXp)}{" "}
              <span className="text-sm font-bold">XP</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const { data: session } = useSession()

  // State - Initialize with safe defaults
  const [period, setPeriod] = useState<PeriodType>("weekly")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSeason, setActiveSeason] = useState<apiClient.Season | null>(null)
  const [leaderboard, setLeaderboard] = useState<apiClient.LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  // ─── Effects ──────────────────────────────────────────────────────────

  useEffect(() => {
    const initializeLeaderboard = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get active season
        const season = await apiClient.getActiveSeason()
        setActiveSeason(season)

        // Get leaderboard
        const leaderboardData = await apiClient.getLeaderboard(season.id, 100)
        setLeaderboard(leaderboardData.entries || [])

        // Get user rank if logged in
        if (session?.user) {
          try {
            const rankData = await apiClient.getUserLeaderboardRank(season.id)
            setUserRank(rankData.rank)
          } catch {
            // User might not have any XP yet
            setUserRank(null)
          }
        }
      } catch (err) {
        const errorMsg = apiClient.handleApiError(err)
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    initializeLeaderboard()
  }, [session?.user])

  // Handle load more
  const handleLoadMore = async () => {
    if (!activeSeason) return

    try {
      setLoadingMore(true)
      const nextPage = Math.ceil(leaderboard.length / 50) + 1
      const moreData = await apiClient.getLeaderboardPaginated(
        activeSeason.id,
        nextPage,
        50
      )
      setLeaderboard((prev) => [...prev, ...(moreData.entries || [])])
    } catch (err) {
      const errorMsg = apiClient.handleApiError(err)
      toast.error(errorMsg)
    } finally {
      setLoadingMore(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="size-5 text-destructive" />
              Failed to Load Leaderboard
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!activeSeason) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <h2 className="text-lg font-semibold">No Active Season</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              There is no active season at the moment. Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Safely handle leaderboard data - this is the fix!
  const safeLeaderboard = leaderboard || []
  const top3 = safeLeaderboard.slice(0, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)
  const rest = safeLeaderboard.slice(3)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          {/* ── Header ────────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">
                Global Rankings
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Compete with the world&apos;s most luminous traders and earn
                your place on the ledger.
              </p>
              {activeSeason && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="mt-2">
                    {activeSeason.name}
                  </Badge>
                </p>
              )}
            </div>

            {/* Period toggle */}
            <div className="flex items-center rounded-lg border border-border bg-muted p-1">
              <Button
                variant={period === "weekly" ? "default" : "ghost"}
                size="sm"
                className="rounded-md"
                onClick={() => setPeriod("weekly")}
                disabled
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

          {/* User's current rank */}
          {session?.user && userRank && (
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="flex items-center justify-between py-4 px-6">
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">
                    Your Rank
                  </p>
                  <p className="text-2xl font-bold text-tertiary">
                    #{userRank}
                  </p>
                </div>
                <ZapIcon className="size-6 text-tertiary opacity-20" />
              </CardContent>
            </Card>
          )}

          {/* ── Podium ────────────────────────────────────────────────── */}
          {podiumOrder.length > 0 && (
            <div className="flex items-end gap-3 md:gap-4">
              {podiumOrder.map((entry) => (
                <PodiumCard
                  key={entry.rank}
                  entry={{
                    rank: entry.rank,
                    username: entry.username,
                    totalXp: entry.totalXp,
                    avatar: entry.avatar,
                  }}
                  isFirst={entry.rank === 1}
                />
              ))}
            </div>
          )}

          {/* ── Rankings table ────────────────────────────────────────── */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Navigator</TableHead>
                    <TableHead>Experience</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rest && rest.length > 0 ? (
                    rest.map((entry) => (
                      <TableRow key={entry.userId}>
                        <TableCell className="font-semibold tabular-nums text-muted-foreground">
                          {String(entry.rank).padStart(2, "0")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-7 items-center justify-center rounded-full border border-border bg-muted flex-shrink-0">
                              {entry.avatar ? (
                                <img
                                  src={entry.avatar}
                                  alt={entry.username}
                                  className="size-full rounded-full object-cover"
                                />
                              ) : (
                                <UserIcon className="size-3.5 text-muted-foreground" />
                              )}
                            </div>
                            <span className="font-medium">{entry.username}</span>
                          </div>
                        </TableCell>
                        <TableCell className="tabular-nums">
                          <span className="flex items-center gap-1 font-medium">
                            <ZapIcon className="size-3.5 text-tertiary" />
                            {apiClient.formatXp(entry.totalXp)} XP
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No rankings available
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Load More Button */}
          {safeLeaderboard && safeLeaderboard.length > 0 && safeLeaderboard.length % 50 === 0 && (
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              variant="outline"
              className="w-full"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Rankings"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}