"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import * as apiClient from "@/lib/api-client"

// ─── Types ───────────────────────────────────────────────────────────────

type PageState = "loading" | "selecting" | "learning" | "error"

interface LoadingState {
  indicators: boolean
  progress: boolean
  lesson: boolean
}

// ─── Component ───────────────────────────────────────────────────────────

export default function LearnPage() {
  // Auth & Session
  const { data: session } = useSession()

  // State Management
  const [pageState, setPageState] = useState<PageState>("loading")
  const [loading, setLoading] = useState<LoadingState>({
    indicators: true,
    progress: false,
    lesson: false,
  })

  // Data State
  const [indicators, setIndicators] = useState<apiClient.Indicator[]>([])
  const [activeSeason, setActiveSeason] = useState<apiClient.Season | null>(null)
  const [userProgress, setUserProgress] = useState<apiClient.UserProgress | null>(null)
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null)
  const [lessonData, setLessonData] = useState<apiClient.IndicatorDetails | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Error State
  const [error, setError] = useState<string | null>(null)

  // ─── Effects ──────────────────────────────────────────────────────────

  // Initial load: Get season, indicators, and progress
  useEffect(() => {
    const initializeLearn = async () => {
      try {
        setError(null)

        // Get active season
        const season = await apiClient.getActiveSeason()
        setActiveSeason(season)

        // Get indicators (curriculum)
        const indicatorsData = await apiClient.getIndicators()
        setIndicators(indicatorsData)

        // Get user progress if logged in
        if (session?.user) {
          const progress = await apiClient.getUserProgress(season.id)
          setUserProgress(progress)
        }

        setPageState("selecting")
        setLoading((prev) => ({ ...prev, indicators: false }))
      } catch (err) {
        setError(apiClient.handleApiError(err))
        setPageState("error")
        setLoading((prev) => ({ ...prev, indicators: false }))
        toast.error("Failed to load learning modules")
      }
    }

    initializeLearn()
  }, [session?.user])

  // Load lesson when indicator is selected
  useEffect(() => {
    if (!selectedIndicator) return

    const loadLesson = async () => {
      try {
        setLoading((prev) => ({ ...prev, lesson: true }))
        setError(null)
        setAnswerSubmitted(false)
        setSelectedAnswer(null)

        const lesson = await apiClient.getIndicatorDetails(selectedIndicator)
        setLessonData(lesson)
        setPageState("learning")
      } catch (err) {
        setError(apiClient.handleApiError(err))
        toast.error("Failed to load lesson")
      } finally {
        setLoading((prev) => ({ ...prev, lesson: false }))
      }
    }

    loadLesson()
  }, [selectedIndicator])

  // ─── Handlers ─────────────────────────────────────────────────────────

  const handleSelectIndicator = (indicatorId: string) => {
    setSelectedIndicator(indicatorId)
  }

  const handleBackToIndicators = () => {
    setSelectedIndicator(null)
    setPageState("selecting")
    setLessonData(null)
    setAnswerSubmitted(false)
    setSelectedAnswer(null)
  }

  const handleSelectAnswer = (optionId: string) => {
    if (!answerSubmitted) {
      setSelectedAnswer(optionId)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !lessonData || !activeSeason) return

    try {
      setSubmitLoading(true)
      const response = await apiClient.submitAnswer({
        questionId: lessonData.question!.id,
        selectedOptionId: selectedAnswer,
        indicatorId: lessonData.indicator.id,
        seasonId: activeSeason.id,
      })

      setAnswerSubmitted(true)

      if (response.attempt.isCorrect) {
        toast.success(`Correct! +${response.attempt.xpEarned} XP`, {
          description: `Total XP: ${apiClient.formatXp(response.seasonXP)}`,
        })
      } else {
        toast.error(`Incorrect. ${response.attempt.xpEarned > 0 ? `+${response.attempt.xpEarned}` : response.attempt.xpEarned} XP`)
      }

      // Refresh progress
      if (session?.user && activeSeason) {
        const updatedProgress = await apiClient.getUserProgress(activeSeason.id)
        setUserProgress(updatedProgress)
      }
    } catch (err) {
      const errorMsg = apiClient.handleApiError(err)
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setSubmitLoading(false)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────

  if (!session?.user) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign in to Learn</CardTitle>
            <CardDescription>
              You need to be signed in to access learning modules and earn XP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/sign-in">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (pageState === "error") {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-destructive" />
              Error Loading Content
            </CardTitle>
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

  if (loading.indicators) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Loading learning modules...</p>
        </div>
      </div>
    )
  }

  // Indicator Selection View
  if (pageState === "selecting" && !selectedIndicator) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="grid flex-1 gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            {/* Curriculum List */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Curriculum</h2>
                <Badge variant="outline">{indicators.length} Modules</Badge>
              </div>

              <div className="space-y-3">
                {indicators.map((indicator, index) => {
                  const isCompleted = userProgress?.indicators.some(
                    (ind) => ind.id === indicator.id && ind.attempted && ind.correct
                  )
                  const isAttempted = userProgress?.indicators.some(
                    (ind) => ind.id === indicator.id && ind.attempted
                  )
                  const isFirst = index === 0
                  const isPrevCompleted =
                    index === 0 ||
                    userProgress?.indicators[index - 1]?.attempted

                  const canAccess = isFirst || isPrevCompleted
                  const isLocked = !canAccess

                  return (
                    <Card
                      key={indicator.id}
                      className={`gap-4 bg-card/80 py-4 cursor-pointer transition-all ${
                        isLocked
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:shadow-md hover:ring-primary/50"
                      } ${
                        isCompleted
                          ? "ring-secondary/70 shadow-[0_0_0_1px_hsl(var(--secondary)/0.45)]"
                          : "ring-border/80"
                      }`}
                      onClick={() => !isLocked && handleSelectIndicator(indicator.id)}
                    >
                      <CardHeader className="px-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                              {indicator.name}
                              {isCompleted && (
                                <CheckCircle2Icon className="size-4 text-secondary" />
                              )}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              Learn about {indicator.name.toLowerCase()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="px-4">
                        {isLocked ? (
                          <Button variant="outline" className="w-full" disabled>
                            Unlock by completing previous module
                          </Button>
                        ) : (
                          <Button
                            variant={isCompleted ? "secondary" : "default"}
                            className="w-full justify-center"
                          >
                            {isCompleted ? "Review" : isAttempted ? "Continue" : "Start"}
                            <ArrowRightIcon className="size-4 ml-2" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>

            {/* Stats/Info Section */}
            <section className="space-y-4">
              <Card className="bg-gradient-to-b from-card to-card/80 py-5">
                <CardHeader className="space-y-4 px-6">
                  <CardTitle className="text-3xl font-semibold tracking-tight">
                    Your Learning Journey
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 px-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Total Experience
                      </span>
                      <span className="text-2xl font-bold text-tertiary">
                        {userProgress ? apiClient.formatXp(userProgress.totalXp) : "0"} XP
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${
                            userProgress
                              ? Math.min(
                                  (userProgress.totalXp / 100000) * 100,
                                  100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground font-medium">
                        COMPLETED
                      </p>
                      <p className="text-xl font-bold mt-1">
                        {userProgress?.indicators.filter((i) => i.correct).length || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground font-medium">
                        IN PROGRESS
                      </p>
                      <p className="text-xl font-bold mt-1">
                        {userProgress?.indicators.filter((i) => i.attempted && !i.correct)
                          .length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    )
  }

  // Lesson View
  if (pageState === "learning" && lessonData && activeSeason) {
    const question = lessonData.question
    const correctOption = question?.options.find((opt) => {
      // Note: We don't have isCorrect on the client, but we can show it after submission
      return selectedAnswer === opt.id
    })

    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="grid flex-1 gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            {/* Materials Sidebar */}
            <section className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleBackToIndicators}
              >
                ← Back to Curriculum
              </Button>

              <div>
                <h3 className="font-semibold text-sm mb-2">Course Materials</h3>
                <div className="space-y-2">
                  {lessonData.materials.map((material) => (
                    <div
                      key={material.id}
                      className="text-xs p-2 rounded bg-muted hover:bg-muted/80 cursor-pointer"
                    >
                      <p className="font-medium text-primary">{material.level}</p>
                      <p className="text-muted-foreground line-clamp-2">
                        {material.content.substring(0, 50)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Content Area */}
            <section className="space-y-4">
              {/* Teaching Material */}
              <Card className="bg-gradient-to-b from-card to-card/80">
                <CardHeader className="space-y-4 px-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <span>{lessonData.indicator.name}</span>
                  </div>
                  <CardTitle className="text-3xl font-semibold tracking-tight">
                    {lessonData.materials[0]?.level || "Learning Module"}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 px-6 text-base leading-8 text-muted-foreground">
                  {lessonData.materials.map((material) => (
                    <div key={material.id}>
                      <p className="text-foreground font-semibold mb-2">
                        {material.level}
                      </p>
                      <p>{material.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quiz Section */}
              {question && (
                <Card className="bg-card/90">
                  <CardHeader className="space-y-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md border border-border bg-muted p-2">
                        <CheckCircle2Icon className="size-5 text-tertiary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                          Knowledge Check
                        </CardTitle>
                        <CardDescription className="text-xs font-medium tracking-[0.14em] uppercase">
                          {question.xpReward} XP Reward
                        </CardDescription>
                      </div>
                    </div>
                    <p className="text-base font-medium text-foreground">
                      {question.questionText}
                    </p>
                  </CardHeader>

                  <CardContent className="grid gap-3 px-6 md:grid-cols-1 space-y-2">
                    {question.options.map((option) => (
                      <Button
                        key={option.id}
                        variant={
                          selectedAnswer === option.id
                            ? "secondary"
                            : "outline"
                        }
                        className="h-auto justify-start py-3 text-left leading-relaxed whitespace-normal"
                        onClick={() => handleSelectAnswer(option.id)}
                        disabled={answerSubmitted}
                      >
                        <span className="flex-1">{option.optionText}</span>
                        {selectedAnswer === option.id && answerSubmitted && (
                          <CheckCircle2Icon className="size-5 text-secondary ml-2 flex-shrink-0" />
                        )}
                      </Button>
                    ))}

                    {!answerSubmitted && (
                      <Button
                        className="w-full mt-4"
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer || submitLoading}
                      >
                        {submitLoading ? (
                          <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Answer"
                        )}
                      </Button>
                    )}

                    {answerSubmitted && (
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={handleBackToIndicators}
                      >
                        Back to Curriculum
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        </div>
      </div>
    )
  }

  return null
}