// src/components/pages/learn/learn-page-example.tsx
/**
 * EXAMPLE: How to integrate Learn page with API
 * Copy relevant parts to your actual Learn page
 */

'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import * as API from '@/lib/api-client'

interface Season {
  id: string
  name: string
  startDate: string
  endDate: string
}

interface Indicator {
  id: string
  name: string
  slug: string
}

interface Material {
  id: string
  indicatorId: string
  level: string
  content: string
  order: number
}

interface QuestionOption {
  id: string
  optionText: string
}

interface Question {
  id: string
  indicatorId: string
  questionText: string
  xpReward: number
  xpPenalty: number
  options: QuestionOption[]
}

export default function LearnPageExample() {
  // State
  const [season, setSeason] = useState<Season | null>(null)
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(
    null
  )
  const [materials, setMaterials] = useState<Material[]>([])
  const [question, setQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load season and indicators on mount
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)

        // Get active season
        const seasonData = await API.getActiveSeason()
        setSeason(seasonData.season)

        // Get all indicators
        const indicatorsData = await API.getIndicators()
        setIndicators(indicatorsData.indicators)
      } catch (error) {
        const errorMsg = API.handleApiError(error)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // Load indicator details when selected
  const handleSelectIndicator = async (indicator: Indicator) => {
    try {
      setSelectedIndicator(indicator)
      setSelectedOption(null)
      setLoading(true)

      const data = await API.getIndicatorDetails(indicator.id)
      setMaterials(data.materials)
      setQuestion(data.question)
    } catch (error) {
      const errorMsg = API.handleApiError(error)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!selectedOption || !question || !selectedIndicator || !season) {
      toast.error('Please select an answer')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await API.submitAnswer({
        questionId: question.id,
        selectedOptionId: selectedOption,
        indicatorId: selectedIndicator.id,
        seasonId: season.id,
      })

      // Show result
      if (response.attempt.isCorrect) {
        toast.success(`Correct! +${response.attempt.xpEarned} XP`)
      } else {
        toast.error(`Wrong answer. ${response.attempt.xpEarned} XP lost`)
      }

      // Reset for next question
      setSelectedOption(null)
      // In a real app, you'd fetch the next question or move to the next module
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 429
      ) {
        toast.error('You already answered this indicator today. Come back tomorrow!')
      } else {
        const errorMsg = API.handleApiError(error)
        toast.error(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && indicators.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Left: Curriculum List */}
      <div className="space-y-3">
        <h3 className="font-semibold">Curriculum</h3>
        {indicators.map((indicator) => (
          <button
            key={indicator.id}
            onClick={() => handleSelectIndicator(indicator)}
            className={`w-full rounded-lg p-4 text-left transition ${selectedIndicator?.id === indicator.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card hover:bg-muted'
              }`}
          >
            {indicator.name}
          </button>
        ))}
      </div>

      {/* Right: Content & Quiz */}
      {selectedIndicator && (
        <div className="space-y-4 lg:col-span-2">
          {/* Materials */}
          {materials.map((material) => (
            <div key={material.id} className="rounded-lg bg-card p-6">
              <h3 className="mb-3 font-semibold">{material.level}</h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {material.content}
              </p>
            </div>
          ))}

          {/* Question */}
          {question && (
            <div className="rounded-lg bg-card p-6">
              <h3 className="mb-6 text-lg font-semibold">
                {question.questionText}
              </h3>
              <div className="space-y-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition ${selectedOption === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                      }`}
                  >
                    {option.optionText}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || isSubmitting}
                className="mt-6 w-full rounded-lg bg-primary p-3 font-semibold text-primary-foreground disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Correct: +{question.xpReward} XP | Wrong: -{question.xpPenalty}{' '}
                XP
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}