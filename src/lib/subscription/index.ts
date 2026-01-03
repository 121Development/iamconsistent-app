import { User } from '../db'

export type SubscriptionTier = 'free' | 'pro'

export const TIER_LIMITS = {
  free: {
    maxHabits: 2,
    hasAnalytics: false,
  },
  pro: {
    maxHabits: Infinity,
    hasAnalytics: true,
  },
} as const

/**
 * Check if user can create a new habit based on their tier
 */
export function canCreateHabit(
  user: User,
  currentHabitCount: number,
): boolean {
  const limit = TIER_LIMITS[user.subscriptionTier].maxHabits
  return currentHabitCount < limit
}

/**
 * Check if user has access to analytics
 */
export function hasAnalyticsAccess(user: User): boolean {
  return TIER_LIMITS[user.subscriptionTier].hasAnalytics
}

/**
 * Get the maximum number of habits for a user's tier
 */
export function getMaxHabits(tier: SubscriptionTier): number {
  return TIER_LIMITS[tier].maxHabits
}
