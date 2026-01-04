import { createServerFn } from '@tanstack/react-start'
import { eq, and, sql } from 'drizzle-orm'
import { createDb } from '../lib/db/client'
import { habits, sharedHabits, sharedHabitMembers, users, entries } from '../lib/db'
import { env } from 'cloudflare:workers'
import { requireAuth } from './auth'
import { nanoid } from 'nanoid'
import { z } from 'zod'

// Generate a random 8-character alphanumeric invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Schemas
const createSharedHabitSchema = z.object({
  habitId: z.string(),
})

const joinSharedHabitSchema = z.object({
  inviteCode: z.string().length(8),
})

const sharedHabitIdSchema = z.object({
  sharedHabitId: z.string(),
})

const removeMemberSchema = z.object({
  sharedHabitId: z.string(),
  userId: z.string(),
})

// Create a shared habit and generate invite code
export const createSharedHabit = createServerFn({ method: 'POST' })
  .inputValidator(createSharedHabitSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Get the habit
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, data.habitId), eq(habits.userId, userId)))
      .limit(1)

    if (!habit) {
      throw new Error('Habit not found')
    }

    if (habit.isShared) {
      throw new Error('Habit is already shared')
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode()
    let attempts = 0
    while (attempts < 10) {
      const [existing] = await db
        .select()
        .from(sharedHabits)
        .where(eq(sharedHabits.inviteCode, inviteCode))
        .limit(1)

      if (!existing) break
      inviteCode = generateInviteCode()
      attempts++
    }

    if (attempts === 10) {
      throw new Error('Failed to generate unique invite code')
    }

    // Create shared habit record
    const [sharedHabit] = await db
      .insert(sharedHabits)
      .values({
        habitName: habit.name,
        habitIcon: habit.icon,
        habitColor: habit.color,
        targetCount: habit.targetCount,
        targetPeriod: habit.targetPeriod,
        ownerUserId: userId,
        inviteCode,
      })
      .returning()

    // Add owner as first member
    await db.insert(sharedHabitMembers).values({
      sharedHabitId: sharedHabit.id,
      userId,
      role: 'owner',
    })

    // Update habit to mark as shared
    await db
      .update(habits)
      .set({
        isShared: true,
        sharedHabitId: sharedHabit.id,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(habits.id, data.habitId))

    return {
      inviteCode,
      shareUrl: `https://iamconsistent.io/join/${inviteCode}`,
      sharedHabitId: sharedHabit.id,
    }
  })

// Join a shared habit using invite code
export const joinSharedHabit = createServerFn({ method: 'POST' })
  .inputValidator(joinSharedHabitSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Find shared habit by invite code
    const [sharedHabit] = await db
      .select()
      .from(sharedHabits)
      .where(eq(sharedHabits.inviteCode, data.inviteCode.toUpperCase()))
      .limit(1)

    if (!sharedHabit) {
      throw new Error('Invalid invite code')
    }

    // Check if code is expired
    if (sharedHabit.expiresAt) {
      const expiryDate = new Date(sharedHabit.expiresAt)
      if (expiryDate < new Date()) {
        throw new Error('Invite code has expired')
      }
    }

    // Check if user is already a member
    const [existingMember] = await db
      .select()
      .from(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, sharedHabit.id),
          eq(sharedHabitMembers.userId, userId)
        )
      )
      .limit(1)

    if (existingMember) {
      throw new Error('You are already a member of this habit')
    }

    // Create a copy of the habit for this user
    const [newHabit] = await db
      .insert(habits)
      .values({
        userId,
        name: sharedHabit.habitName,
        icon: sharedHabit.habitIcon,
        color: sharedHabit.habitColor,
        targetCount: sharedHabit.targetCount,
        targetPeriod: sharedHabit.targetPeriod,
        isShared: true,
        sharedHabitId: sharedHabit.id,
      })
      .returning()

    // Add user as member
    await db.insert(sharedHabitMembers).values({
      sharedHabitId: sharedHabit.id,
      userId,
      role: 'member',
    })

    return {
      success: true,
      habitId: newHabit.id,
      habitName: sharedHabit.habitName,
    }
  })

// Get shared habit details (including invite code)
export const getSharedHabitDetails = createServerFn({ method: 'GET' })
  .inputValidator(sharedHabitIdSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Verify user is a member
    const [membership] = await db
      .select()
      .from(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, data.sharedHabitId),
          eq(sharedHabitMembers.userId, userId)
        )
      )
      .limit(1)

    if (!membership) {
      throw new Error('You are not a member of this shared habit')
    }

    // Get shared habit details
    const [sharedHabit] = await db
      .select()
      .from(sharedHabits)
      .where(eq(sharedHabits.id, data.sharedHabitId))
      .limit(1)

    if (!sharedHabit) {
      throw new Error('Shared habit not found')
    }

    return {
      inviteCode: sharedHabit.inviteCode,
      shareUrl: `https://iamconsistent.io/join/${sharedHabit.inviteCode}`,
      ownerUserId: sharedHabit.ownerUserId,
    }
  })

// Get members of a shared habit with their stats
export const getSharedHabitMembers = createServerFn({ method: 'GET' })
  .inputValidator(sharedHabitIdSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Verify user is a member
    const [membership] = await db
      .select()
      .from(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, data.sharedHabitId),
          eq(sharedHabitMembers.userId, userId)
        )
      )
      .limit(1)

    if (!membership) {
      throw new Error('You are not a member of this shared habit')
    }

    // Get all members with user info
    const members = await db
      .select({
        userId: users.id,
        email: users.email,
        name: users.name,
        role: sharedHabitMembers.role,
        joinedAt: sharedHabitMembers.joinedAt,
      })
      .from(sharedHabitMembers)
      .innerJoin(users, eq(sharedHabitMembers.userId, users.id))
      .where(eq(sharedHabitMembers.sharedHabitId, data.sharedHabitId))

    return members
  })

// Get leaderboard stats for a shared habit
export const getSharedHabitLeaderboard = createServerFn({ method: 'GET' })
  .inputValidator(sharedHabitIdSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Verify user is a member
    const [membership] = await db
      .select()
      .from(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, data.sharedHabitId),
          eq(sharedHabitMembers.userId, userId)
        )
      )
      .limit(1)

    if (!membership) {
      throw new Error('You are not a member of this shared habit')
    }

    // Get all member habits for this shared habit
    const memberHabits = await db
      .select({
        userId: habits.userId,
        habitId: habits.id,
        email: users.email,
        name: users.name,
      })
      .from(habits)
      .innerJoin(users, eq(habits.userId, users.id))
      .where(eq(habits.sharedHabitId, data.sharedHabitId))

    // Get entries for all these habits (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    const leaderboardData = await Promise.all(
      memberHabits.map(async (member) => {
        // Get all entries for this member's habit
        const memberEntries = await db
          .select()
          .from(entries)
          .where(
            and(
              eq(entries.habitId, member.habitId),
              sql`entries.date >= ${thirtyDaysAgoStr}`
            )
          )

        // Calculate stats
        const totalEntries = memberEntries.length
        const uniqueDays = new Set(memberEntries.map((e) => e.date)).size

        // Calculate current streak
        let currentStreak = 0
        const sortedDates = Array.from(
          new Set(memberEntries.map((e) => e.date))
        ).sort((a, b) => b.localeCompare(a))

        let currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)

        for (const dateStr of sortedDates) {
          const entryDate = new Date(dateStr + 'T00:00:00')
          const diffDays = Math.floor(
            (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
          )

          if (diffDays === currentStreak) {
            currentStreak++
          } else {
            break
          }
        }

        return {
          userId: member.userId,
          email: member.email,
          name: member.name,
          totalEntries,
          uniqueDays,
          currentStreak,
          completionRate: Math.round((uniqueDays / 30) * 100),
        }
      })
    )

    // Sort by current streak (primary), then total entries (secondary)
    leaderboardData.sort((a, b) => {
      if (b.currentStreak !== a.currentStreak) {
        return b.currentStreak - a.currentStreak
      }
      return b.totalEntries - a.totalEntries
    })

    return leaderboardData
  })

// Leave a shared habit
export const leaveSharedHabit = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ habitId: z.string() }))
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Get habit
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, data.habitId), eq(habits.userId, userId)))
      .limit(1)

    if (!habit || !habit.isShared || !habit.sharedHabitId) {
      throw new Error('Habit not found or not shared')
    }

    // Remove membership
    await db
      .delete(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, habit.sharedHabitId),
          eq(sharedHabitMembers.userId, userId)
        )
      )

    // Archive the habit
    await db
      .update(habits)
      .set({ isArchived: true, updatedAt: new Date().toISOString() })
      .where(eq(habits.id, data.habitId))

    return { success: true }
  })

// Regenerate invite code (owner only)
export const regenerateInviteCode = createServerFn({ method: 'POST' })
  .inputValidator(sharedHabitIdSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Verify user is owner
    const [membership] = await db
      .select()
      .from(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, data.sharedHabitId),
          eq(sharedHabitMembers.userId, userId),
          eq(sharedHabitMembers.role, 'owner')
        )
      )
      .limit(1)

    if (!membership) {
      throw new Error('Only the owner can regenerate the invite code')
    }

    // Generate new code
    let inviteCode = generateInviteCode()
    let attempts = 0
    while (attempts < 10) {
      const [existing] = await db
        .select()
        .from(sharedHabits)
        .where(eq(sharedHabits.inviteCode, inviteCode))
        .limit(1)

      if (!existing) break
      inviteCode = generateInviteCode()
      attempts++
    }

    // Update shared habit
    await db
      .update(sharedHabits)
      .set({ inviteCode })
      .where(eq(sharedHabits.id, data.sharedHabitId))

    return {
      inviteCode,
      shareUrl: `https://iamconsistent.io/join/${inviteCode}`,
    }
  })

// Remove member (owner only)
export const removeMember = createServerFn({ method: 'POST' })
  .inputValidator(removeMemberSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Verify current user is owner
    const [ownerMembership] = await db
      .select()
      .from(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, data.sharedHabitId),
          eq(sharedHabitMembers.userId, userId),
          eq(sharedHabitMembers.role, 'owner')
        )
      )
      .limit(1)

    if (!ownerMembership) {
      throw new Error('Only the owner can remove members')
    }

    // Can't remove owner
    if (data.userId === userId) {
      throw new Error('Owner cannot remove themselves')
    }

    // Remove member
    await db
      .delete(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, data.sharedHabitId),
          eq(sharedHabitMembers.userId, data.userId)
        )
      )

    // Archive their habit copy
    await db
      .update(habits)
      .set({ isArchived: true, updatedAt: new Date().toISOString() })
      .where(
        and(
          eq(habits.userId, data.userId),
          eq(habits.sharedHabitId, data.sharedHabitId)
        )
      )

    return { success: true }
  })

// Get member activity for calendar view (last 30 days)
export const getSharedHabitMemberActivity = createServerFn({ method: 'GET' })
  .inputValidator(sharedHabitIdSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Verify user is a member
    const [membership] = await db
      .select()
      .from(sharedHabitMembers)
      .where(
        and(
          eq(sharedHabitMembers.sharedHabitId, data.sharedHabitId),
          eq(sharedHabitMembers.userId, userId)
        )
      )
      .limit(1)

    if (!membership) {
      throw new Error('You are not a member of this shared habit')
    }

    // Get all member habits for this shared habit
    const memberHabits = await db
      .select({
        userId: habits.userId,
        habitId: habits.id,
        email: users.email,
        name: users.name,
      })
      .from(habits)
      .innerJoin(users, eq(habits.userId, users.id))
      .where(eq(habits.sharedHabitId, data.sharedHabitId))

    // Get entries for all these habits (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

    const activityData = await Promise.all(
      memberHabits.map(async (member) => {
        // Get all entries for this member's habit
        const memberEntries = await db
          .select()
          .from(entries)
          .where(
            and(
              eq(entries.habitId, member.habitId),
              sql`entries.date >= ${thirtyDaysAgoStr}`
            )
          )

        // Group entries by date and count them
        const entriesByDate: Record<string, number> = {}
        memberEntries.forEach((entry) => {
          entriesByDate[entry.date] = (entriesByDate[entry.date] || 0) + 1
        })

        return {
          userId: member.userId,
          email: member.email,
          name: member.name,
          entriesByDate,
        }
      })
    )

    return activityData
  })
