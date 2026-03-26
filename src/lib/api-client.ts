/**
 * API Client utility for CoinEdu
 * Centralizes all API calls and error handling
 */

export interface ApiError {
    error: string
    status: number
}

// Seasons API
export async function getActiveSeason() {
    const response = await fetch('/api/seasons/active')
    if (!response.ok) throw new Error('Failed to fetch active season')
    return response.json()
}

// Indicators API
export async function getIndicators() {
    const response = await fetch('/api/learn/indicators')
    if (!response.ok) throw new Error('Failed to fetch indicators')
    return response.json()
}

export async function getIndicatorDetails(indicatorId: string) {
    const response = await fetch(`/api/learn/${indicatorId}`)
    if (!response.ok) {
        if (response.status === 404) throw new Error('Indicator not found')
        throw new Error('Failed to fetch indicator details')
    }
    return response.json()
}

// Progress API
export async function getUserProgress(seasonId: string) {
    const response = await fetch(`/api/learn/progress?seasonId=${seasonId}`)
    if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized')
        throw new Error('Failed to fetch progress')
    }
    return response.json()
}

// Quiz API
export interface SubmitAnswerPayload {
    questionId: string
    selectedOptionId: string
    indicatorId: string
    seasonId: string
}

export async function submitAnswer(payload: SubmitAnswerPayload) {
    const response = await fetch('/api/learn/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
        const error: ApiError = {
            error: data.error || 'Failed to submit answer',
            status: response.status,
        }
        throw error
    }

    return data
}

// Leaderboard API
export async function getLeaderboard(
    seasonId: string,
    limit: number = 50
) {
    const response = await fetch(
        `/api/leaderboard?seasonId=${seasonId}&limit=${limit}`
    )
    if (!response.ok) {
        if (response.status === 400) throw new Error('Season ID is required')
        throw new Error('Failed to fetch leaderboard')
    }
    return response.json()
}

// Error handler
export function handleApiError(error: unknown): string {
    if (error instanceof Error) {
        return error.message
    }
    if (typeof error === 'object' && error !== null && 'error' in error) {
        const apiError = error as ApiError
        return apiError.error
    }
    return 'An unknown error occurred'
}