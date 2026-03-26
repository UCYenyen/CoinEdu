'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as API from '@/lib/api-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserIcon, TrophyIcon, ZapIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
}

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  email: string
  avatar: string | null
  xp: number
  return: string
}

export default function LeaderboardPageExample() {
  const [period, setPeriod] = useState<'weekly' | 'alltime'>('weekly')
  const [season, setSeason] = useState<Season | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Load season and leaderboard on mount
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)

        // Get active season
        const seasonData = await API.getActiveSeason()
        setSeason(seasonData.season)

        // Get leaderboard
        if (seasonData.season) {
          const leaderboardData = await API.getLeaderboard(
            seasonData.season.id,
            50
          )
          setLeaderboard(leaderboardData.leaderboard)
        }
      } catch (error) {
        const errorMsg = API.handleApiError(error)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // Refresh leaderboard
  const handleRefresh = async () => {
    if (!season) return

    try {
      setLoading(true)
      const data = await API.getLeaderboard(season.id, 50)
      setLeaderboard(data.leaderboard)
      toast.success('Leaderboard updated')
    } catch (error) {
      const errorMsg = API.handleApiError(error)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const medalConfig: Record<
    number,
    { color: string; label: string }
  > = {
    1: { color: 'text-tertiary', label: '#01' },
    2: { color: 'text-muted-foreground', label: '#02' },
    3: { color: 'text-destructive', label: '#03' },
  }

  const top3 = leaderboard.slice(0, 3)
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)
  const rest = leaderboard.slice(3)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">
                Global Rankings
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {season ? `${season.name} Leaderboard` : 'Loading...'}
              </p>
            </div>

            {/* Period Toggle */}
            <div className="flex gap-2">
              <div className="flex items-center rounded-lg border border-border bg-muted p-1">
                <Button
                  variant={period === 'weekly' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-md"
                  onClick={() => setPeriod('weekly')}
                >
                  Weekly
                </Button>
                <Button
                  variant={period === 'alltime' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-md"
                  onClick={() => setPeriod('alltime')}
                >
                  All-Time
                </Button>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? 'Updating...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Podium */}
          {podiumOrder.length > 0 && (
            <div className="flex items-end gap-3 md:gap-4">
              {podiumOrder.map((entry) => {
                const medal = medalConfig[entry.rank]
                const isFirst = entry.rank === 1

                return (
                  <div
                    key={entry.userId}
                    className="flex flex-1 flex-col"
                  >
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
                        'relative flex flex-col gap-4 overflow-hidden py-6',
                        isFirst &&
                        'shadow-[0_0_0_1px_hsl(var(--primary)/0.45)] bg-gradient-to-b from-primary/10 to-card'
                      )}
                    >
                      {/* Rank Watermark */}
                      <span
                        className={cn(
                          'absolute right-4 top-3 text-4xl font-black tracking-tighter opacity-20',
                          medal?.color
                        )}
                      >
                        {medal?.label}
                      </span>

                      <CardHeader className="px-6 pb-0">
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-full border-2 bg-muted',
                            entry.rank === 1
                              ? 'border-tertiary'
                              : entry.rank === 2
                                ? 'border-muted-foreground/40'
                                : 'border-destructive/50'
                          )}
                        >
                          <TrophyIcon
                            className={cn('size-4', medal?.color)}
                          />
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 px-6">
                        {/* Avatar */}
                        <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted">
                          {entry.avatar ? (
                            <img
                              src={entry.avatar}
                              alt={entry.username}
                              className="size-12 rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon className="size-5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Name + Return */}
                        <div>
                          <p
                            className={cn(
                              'font-semibold tracking-tight',
                              isFirst ? 'text-2xl' : 'text-xl'
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
                              'text-xl font-semibold tabular-nums',
                              isFirst ? 'text-tertiary' : ''
                            )}
                          >
                            {entry.xp.toLocaleString()}{' '}
                            <span className="text-sm font-bold">XP</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          )}

          {/* Rankings Table */}
          {rest.length > 0 && (
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
                      <TableRow key={entry.userId}>
                        <TableCell className="font-semibold tabular-nums text-muted-foreground">
                          {String(entry.rank).padStart(2, '0')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-7 items-center justify-center rounded-full border border-border bg-muted">
                              {entry.avatar ? (
                                <img
                                  src={entry.avatar}
                                  alt={entry.username}
                                  className="size-7 rounded-full object-cover"
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
                            {entry.xp.toLocaleString()} XP
                          </span>
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right tabular-nums font-semibold',
                            parseFloat(entry.return) > 0
                              ? 'text-secondary'
                              : 'text-destructive'
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
          )}

          {loading && leaderboard.length === 0 && (
            <div className="text-center text-muted-foreground">
              Loading leaderboard...
            </div>
          )}

          {!loading && leaderboard.length === 0 && (
            <div className="text-center text-muted-foreground">
              No leaderboard data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}