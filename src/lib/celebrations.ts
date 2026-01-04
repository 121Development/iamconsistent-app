import type { Habit } from './db'
import type { HabitStats } from './stats'

export type CelebrationType =
  | 'new_longest_streak'
  | 'streak_milestone'
  | 'total_milestone'
  | 'perfect_week'
  | 'target_hit'
  | 'overachiever'
  | 'comeback'

export interface Celebration {
  type: CelebrationType
  title: string
  description: string
  icon: string // Lucide icon name
  emoji: string
}

const STREAK_MILESTONES = [3, 7, 14, 21, 30, 50, 100, 365]
const TOTAL_MILESTONES = [10, 25, 50, 100, 250, 500, 1000]

/**
 * Check if any celebrations should be triggered
 * @param habit The habit being tracked
 * @param previousStats Stats before the new entry
 * @param newStats Stats after the new entry
 * @returns Array of celebrations to display
 */
export function checkCelebrations(
  habit: Habit,
  previousStats: HabitStats,
  newStats: HabitStats
): Celebration[] {
  const celebrations: Celebration[] = []

  // New longest streak
  if (newStats.longestStreak > previousStats.longestStreak) {
    celebrations.push({
      type: 'new_longest_streak',
      title: 'New Record!',
      description: `${newStats.longestStreak} ${habit.targetPeriod || 'day'} streak`,
      icon: 'trophy',
      emoji: '🏆',
    })
  }

  // Streak milestone
  const hitMilestone = STREAK_MILESTONES.find(
    m => newStats.currentStreak >= m && previousStats.currentStreak < m
  )
  if (hitMilestone) {
    const period = habit.targetPeriod || 'day'
    const periodPlural = hitMilestone === 1 ? period : `${period}s`
    celebrations.push({
      type: 'streak_milestone',
      title: `${hitMilestone} ${periodPlural.charAt(0).toUpperCase() + periodPlural.slice(1)} Streak!`,
      description: 'Keep it going!',
      icon: 'flame',
      emoji: '🔥',
    })
  }

  // Total completions milestone
  const totalMilestone = TOTAL_MILESTONES.find(
    m => newStats.totalCompletions >= m && previousStats.totalCompletions < m
  )
  if (totalMilestone) {
    celebrations.push({
      type: 'total_milestone',
      title: `${totalMilestone} Completions!`,
      description: 'Consistency pays off',
      icon: 'award',
      emoji: '⭐',
    })
  }

  // Perfect week (simple habits only)
  if (!habit.targetCount && newStats.completionsThisWeek === 7 && previousStats.completionsThisWeek < 7) {
    celebrations.push({
      type: 'perfect_week',
      title: 'Perfect Week!',
      description: '7 for 7',
      icon: 'calendar-check',
      emoji: '💯',
    })
  }

  // Target hit (target habits only)
  if (habit.targetCount) {
    const targetMet = newStats.completionsThisPeriod >= habit.targetCount
    const wasNotMet = previousStats.completionsThisPeriod < habit.targetCount

    if (targetMet && wasNotMet) {
      celebrations.push({
        type: 'target_hit',
        title: 'Target Hit!',
        description: `${habit.targetCount}/${habit.targetPeriod} complete`,
        icon: 'target',
        emoji: '🎯',
      })
    }

    // Overachiever
    if (
      newStats.completionsThisPeriod > habit.targetCount &&
      previousStats.completionsThisPeriod <= habit.targetCount
    ) {
      celebrations.push({
        type: 'overachiever',
        title: 'Overachiever!',
        description: `${newStats.completionsThisPeriod}/${habit.targetCount} this ${habit.targetPeriod}`,
        icon: 'rocket',
        emoji: '🚀',
      })
    }
  }

  // Comeback (after 7+ day gap)
  if (previousStats.daysSinceLastEntry >= 7 && newStats.daysSinceLastEntry === 0) {
    celebrations.push({
      type: 'comeback',
      title: 'Welcome Back!',
      description: 'Every day is a fresh start',
      icon: 'sunrise',
      emoji: '🌅',
    })
  }

  return celebrations
}
