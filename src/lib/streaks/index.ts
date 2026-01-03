import { Entry } from '../db'

/**
 * Calculate streaks for simple daily tracking mode
 * Returns current streak and longest streak
 */
export function calculateSimpleStreaks(entries: Entry[]): {
  currentStreak: number
  longestStreak: number
} {
  // TODO: Implement streak calculation
  // Sort entries by date, find consecutive days
  return {
    currentStreak: 0,
    longestStreak: 0,
  }
}

/**
 * Calculate streaks for target-based tracking mode
 * Returns current streak and longest streak of consecutive periods
 */
export function calculateTargetStreaks(
  entries: Entry[],
  targetCount: number,
  targetPeriod: 'week' | 'month',
): {
  currentStreak: number
  longestStreak: number
} {
  // TODO: Implement target-based streak calculation
  // Group entries by period, check if target is met, find consecutive periods
  return {
    currentStreak: 0,
    longestStreak: 0,
  }
}
