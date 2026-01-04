import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, differenceInDays } from 'date-fns'
import type { Entry, Habit } from './db'

export interface HabitStats {
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  completionsThisWeek: number
  completionsThisMonth: number
  completionsThisPeriod: number // For target habits
  daysSinceLastEntry: number
  completionRate: number // Last 30 days
}

/**
 * Calculate all statistics for a habit
 */
export function calculateHabitStats(habit: Habit, entries: Entry[]): HabitStats {
  if (entries.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      completionsThisWeek: 0,
      completionsThisMonth: 0,
      completionsThisPeriod: 0,
      daysSinceLastEntry: 0,
      completionRate: 0,
    }
  }

  // Get unique dates (handle multiple entries per day)
  const uniqueDates = Array.from(new Set(entries.map(e => e.date))).sort((a, b) => b.localeCompare(a))
  const sortedEntries = entries.sort((a, b) => b.date.localeCompare(a.date))

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(uniqueDates)

  // Total completions
  const totalCompletions = entries.length

  // This week
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
  const completionsThisWeek = entries.filter(e => {
    const entryDate = parseISO(e.date)
    return entryDate >= weekStart && entryDate <= weekEnd
  }).length

  // This month
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const completionsThisMonth = entries.filter(e => {
    const entryDate = parseISO(e.date)
    return entryDate >= monthStart && entryDate <= monthEnd
  }).length

  // This period (for target habits)
  let completionsThisPeriod = 0
  if (habit.targetPeriod === 'week') {
    completionsThisPeriod = completionsThisWeek
  } else if (habit.targetPeriod === 'month') {
    completionsThisPeriod = completionsThisMonth
  }

  // Days since last entry
  const lastEntry = sortedEntries[0]
  const daysSinceLastEntry = differenceInDays(now, parseISO(lastEntry.date))

  // Completion rate (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const entriesLast30Days = entries.filter(e => {
    const entryDate = parseISO(e.date)
    return entryDate >= thirtyDaysAgo
  })
  const uniqueDaysLast30Days = new Set(entriesLast30Days.map(e => e.date)).size
  const completionRate = Math.round((uniqueDaysLast30Days / 30) * 100)

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    completionsThisWeek,
    completionsThisMonth,
    completionsThisPeriod,
    daysSinceLastEntry,
    completionRate,
  }
}

/**
 * Calculate current streak and longest streak
 * For simple habits: consecutive days with at least one entry
 * For target habits: consecutive periods hitting the target
 */
function calculateStreaks(uniqueDates: string[]): { currentStreak: number; longestStreak: number } {
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  // Calculate current streak (from today backwards)
  for (const dateStr of uniqueDates) {
    const entryDate = new Date(dateStr + 'T00:00:00')
    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === currentStreak) {
      currentStreak++
    } else {
      break
    }
  }

  // Calculate longest streak (scan all dates)
  let previousDate: Date | null = null
  for (const dateStr of uniqueDates.reverse()) { // Start from oldest
    const entryDate = new Date(dateStr + 'T00:00:00')

    if (previousDate === null) {
      tempStreak = 1
    } else {
      const diffDays = Math.floor((entryDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }

    previousDate = entryDate
  }

  longestStreak = Math.max(longestStreak, tempStreak)
  longestStreak = Math.max(longestStreak, currentStreak)

  return { currentStreak, longestStreak }
}
