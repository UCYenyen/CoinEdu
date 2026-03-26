/**
 * API Client utility for CoinEdu
 * Centralizes all API calls, error handling, and data types
 */

// ─── Types & Interfaces ───────────────────────────────────────────────────

export interface ApiError {
    error: string
    status: number
}

export interface Season {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
}

export interface Indicator {
    id: string
    name: string
    slug: string
}

export interface QuestionOption {
    id: string
    optionText: string
}

export interface Question {
    id: string
    questionText: string
    xpReward: number
    xpPenalty: number
    options: QuestionOption[]
}

export interface Material {
    id: string
    indicatorId: string
    level: string
    content: string
    order: number
}

export interface IndicatorDetails {
    indicator: Indicator
    materials: Material[]
    question: Question | null
}

export interface IndicatorProgress {
    id: string
    name: string
    slug: string
    attempted: boolean
    correct: boolean
    xpEarned: number
}

export interface UserProgress {
    totalXp: number
    indicators: IndicatorProgress[]
}

export interface SubmitAnswerPayload {
    questionId: string
    selectedOptionId: string
    indicatorId: string
    seasonId: string
}

export interface SubmitAnswerResponse {
    success: boolean
    attempt: {
        id: string
        isCorrect: boolean
        xpEarned: number
    }
    seasonXP: number
}

export interface LeaderboardEntry {
    rank: number
    userId: string
    username: string
    totalXp: number
    avatar?: string
}

export interface LeaderboardResponse {
    entries: LeaderboardEntry[]
    userRank?: number
    totalUsers: number
}

// ─── Seasons API ──────────────────────────────────────────────────────────

/**
 * Get the currently active season
 */
export async function getActiveSeason(): Promise<Season> {
    const response = await fetch('/api/seasons/active')
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('No active season found')
        }
        throw new Error('Failed to fetch active season')
    }
    
    const data = await response.json()
    return data.season
}

/**
 * Get all available seasons
 */
export async function getSeasons(): Promise<Season[]> {
    const response = await fetch('/api/seasons')
    
    if (!response.ok) {
        throw new Error('Failed to fetch seasons')
    }
    
    const data = await response.json()
    return data.seasons
}

// ─── Indicators API ───────────────────────────────────────────────────────

/**
 * Get all indicators (curriculum list)
 */
export async function getIndicators(): Promise<Indicator[]> {
    const response = await fetch('/api/learn/indicators')
    
    if (!response.ok) {
        throw new Error('Failed to fetch indicators')
    }
    
    const data = await response.json()
    return data.indicators
}

/**
 * Get indicator details including materials and current question
 */
export async function getIndicatorDetails(indicatorId: string): Promise<IndicatorDetails> {
    if (!indicatorId) {
        throw new Error('Indicator ID is required')
    }

    const response = await fetch(`/api/learn/${indicatorId}`)
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Indicator not found')
        }
        throw new Error('Failed to fetch indicator details')
    }
    
    return response.json()
}

// ─── Progress API ─────────────────────────────────────────────────────────

/**
 * Get user's learning progress for a season
 * Includes daily attempt tracking and XP earned
 */
export async function getUserProgress(seasonId: string): Promise<UserProgress> {
    if (!seasonId) {
        throw new Error('Season ID is required')
    }

    const response = await fetch(`/api/learn/progress?seasonId=${seasonId}`)
    
    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized - please sign in')
        }
        if (response.status === 400) {
            throw new Error('Invalid season ID')
        }
        throw new Error('Failed to fetch progress')
    }
    
    return response.json()
}

// ─── Quiz API ─────────────────────────────────────────────────────────────

/**
 * Submit an answer to a question
 * Returns the result and updated XP
 */
export async function submitAnswer(payload: SubmitAnswerPayload): Promise<SubmitAnswerResponse> {
    // Validate payload
    if (!payload.questionId || !payload.selectedOptionId || !payload.indicatorId) {
        throw new Error('Missing required fields: questionId, selectedOptionId, indicatorId')
    }

    const response = await fetch('/api/learn/submit-answer', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
        const error: ApiError = {
            error: data.error || 'Failed to submit answer',
            status: response.status,
        }
        
        // Handle specific error cases
        if (response.status === 401) {
            throw new Error('Unauthorized - please sign in')
        }
        if (response.status === 404) {
            throw new Error('Question or option not found')
        }
        if (response.status === 429) {
            throw new Error('You have already answered a question for this indicator today')
        }
        
        throw error
    }

    return data
}

// ─── Leaderboard API ──────────────────────────────────────────────────────

/**
 * Get leaderboard rankings for a season
 * Fetches top users sorted by total XP
 */
export async function getLeaderboard(
    seasonId: string,
    limit: number = 100
): Promise<LeaderboardResponse> {
    if (!seasonId) {
        throw new Error('Season ID is required')
    }

    if (limit < 1 || limit > 500) {
        throw new Error('Limit must be between 1 and 500')
    }

    const response = await fetch(
        `/api/leaderboard?seasonId=${seasonId}&limit=${limit}`
    )

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error('Invalid season ID')
        }
        throw new Error('Failed to fetch leaderboard')
    }

    return response.json()
}

/**
 * Get leaderboard with pagination
 * Useful for "load more" functionality
 */
export async function getLeaderboardPaginated(
    seasonId: string,
    page: number = 1,
    pageSize: number = 50
): Promise<LeaderboardResponse> {
    if (!seasonId) {
        throw new Error('Season ID is required')
    }

    if (page < 1) {
        throw new Error('Page must be 1 or greater')
    }

    if (pageSize < 1 || pageSize > 100) {
        throw new Error('Page size must be between 1 and 100')
    }

    const offset = (page - 1) * pageSize
    const response = await fetch(
        `/api/leaderboard?seasonId=${seasonId}&offset=${offset}&limit=${pageSize}`
    )

    if (!response.ok) {
        throw new Error('Failed to fetch leaderboard')
    }

    return response.json()
}

/**
 * Get user's rank on the leaderboard
 */
export async function getUserLeaderboardRank(seasonId: string): Promise<{
    rank: number
    totalXp: number
    totalUsers: number
}> {
    if (!seasonId) {
        throw new Error('Season ID is required')
    }

    const response = await fetch(
        `/api/leaderboard/user-rank?seasonId=${seasonId}`
    )

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized - please sign in')
        }
        throw new Error('Failed to fetch user rank')
    }

    return response.json()
}

// ─── Utility Functions ────────────────────────────────────────────────────

/**
 * Generic error handler for API responses
 */
export function handleApiError(error: unknown): string {
    // Handle Error objects
    if (error instanceof Error) {
        return error.message
    }
    
    // Handle ApiError objects
    if (typeof error === 'object' && error !== null && 'error' in error) {
        const apiError = error as ApiError
        return apiError.error
    }
    
    // Handle string errors
    if (typeof error === 'string') {
        return error
    }
    
    return 'An unknown error occurred'
}

/**
 * Check if error is a specific API error type
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'error' in error &&
        'status' in error &&
        typeof (error as any).error === 'string' &&
        typeof (error as any).status === 'number'
    )
}

/**
 * Check if error is an auth error (401/403)
 */
export function isAuthError(error: unknown): boolean {
    if (isApiError(error)) {
        return error.status === 401 || error.status === 403
    }
    return false
}

/**
 * Retry API call with exponential backoff
 */
export async function retryApiCall<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: unknown

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error
            
            // Don't retry auth errors
            if (isAuthError(error)) {
                throw error
            }

            // Don't retry on last attempt
            if (attempt === maxRetries - 1) {
                break
            }

            // Exponential backoff
            const delay = baseDelay * Math.pow(2, attempt)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }

    throw lastError
}

/**
 * Format XP display with commas
 */
export function formatXp(xp: number): string {
    return xp.toLocaleString()
}

/**
 * Format XP change with + or - sign
 */
export function formatXpChange(xp: number): string {
    if (xp > 0) return `+${formatXp(xp)}`
    if (xp < 0) return `-${formatXp(Math.abs(xp))}`
    return formatXp(xp)
}