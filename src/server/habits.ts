import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { eq, and } from 'drizzle-orm'
import { createDb } from '../lib/db/client'
import { habits, users, sharedHabitMembers, sharedHabits } from '../lib/db'
import {
  createHabitSchema,
  updateHabitSchema,
  deleteHabitSchema,
  getHabitSchema,
} from './schemas'
import { canCreateHabit } from '../lib/subscription'
import { env } from 'cloudflare:workers'
import { requireAuth } from './auth'

// Helper function to clean up shared habits that only have 1 or 0 members
async function cleanupSoloSharedHabits(db: any, userId: string) {
  // Get user's shared habits
  const userSharedHabits = await db
    .select()
    .from(habits)
    .where(
      and(
        eq(habits.userId, userId),
        eq(habits.isShared, true),
        eq(habits.isArchived, false)
      )
    )

  for (const habit of userSharedHabits) {
    if (!habit.sharedHabitId) continue

    // Count active members
    const members = await db
      .select()
      .from(sharedHabitMembers)
      .where(eq(sharedHabitMembers.sharedHabitId, habit.sharedHabitId))

    // If only 1 member (this user), unshare
    if (members.length === 1) {
      await db
        .update(habits)
        .set({
          isShared: false,
          sharedHabitId: null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(habits.id, habit.id))

      // Clean up membership and shared habit record
      await db
        .delete(sharedHabitMembers)
        .where(eq(sharedHabitMembers.sharedHabitId, habit.sharedHabitId))
      await db
        .delete(sharedHabits)
        .where(eq(sharedHabits.id, habit.sharedHabitId))
    }
  }
}

// Get all habits for the current user
export const getHabits = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await requireAuth()

  const db = createDb(env.DB)

  // NOTE: Removed cleanupSoloSharedHabits from here - it was deleting newly created
  // shared habits that legitimately have only 1 member (the owner waiting for others to join)
  // Cleanup should only happen when someone actively leaves a shared habit

  const userHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.isArchived, false)))
    .orderBy(habits.createdAt)

  return userHabits
})

// Get a single habit by ID
export const getHabit = createServerFn({ method: 'GET' })
  .inputValidator(getHabitSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()

    const db = createDb(env.DB)  

    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, data.id), eq(habits.userId, userId)))
      .limit(1)

    if (!habit) {
      throw new Error('Habit not found')
    }

    return habit
  })

// Create a new habit
export const createHabit = createServerFn({ method: 'POST' })
  .inputValidator(createHabitSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()

    const db = createDb(env.DB)

    // Skip subscription checks for demo

    // Validate target settings
    if ((data.targetCount && !data.targetPeriod) || (!data.targetCount && data.targetPeriod)) {
      throw new Error('Both targetCount and targetPeriod must be provided together')
    }

    const [newHabit] = await db
      .insert(habits)
      .values({
        userId,
        name: data.name,
        description: data.description,
        icon: data.icon,
        color: data.color,
        targetCount: data.targetCount,
        targetPeriod: data.targetPeriod,
      })
      .returning()

    return newHabit
  })

// Update a habit
export const updateHabit = createServerFn({ method: 'POST' })
  .inputValidator(updateHabitSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()

    const db = createDb(env.DB)

    // Verify ownership
    const [existingHabit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, data.id), eq(habits.userId, userId)))
      .limit(1)

    if (!existingHabit) {
      throw new Error('Habit not found')
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.icon !== undefined) updateData.icon = data.icon
    if (data.color !== undefined) updateData.color = data.color
    if (data.isArchived !== undefined) updateData.isArchived = data.isArchived
    if (data.targetCount !== undefined) updateData.targetCount = data.targetCount
    if (data.targetPeriod !== undefined) updateData.targetPeriod = data.targetPeriod

    const [updatedHabit] = await db
      .update(habits)
      .set(updateData)
      .where(eq(habits.id, data.id))
      .returning()

    return updatedHabit
  })

// Delete (archive) a habit
export const deleteHabit = createServerFn({ method: 'POST' })
  .inputValidator(deleteHabitSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()

    const db = createDb(env.DB)

    // Verify ownership
    const [existingHabit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, data.id), eq(habits.userId, userId)))
      .limit(1)

    if (!existingHabit) {
      throw new Error('Habit not found')
    }

    // If it's a shared habit, remove from membership
    if (existingHabit.isShared && existingHabit.sharedHabitId) {
      await db
        .delete(sharedHabitMembers)
        .where(
          and(
            eq(sharedHabitMembers.sharedHabitId, existingHabit.sharedHabitId),
            eq(sharedHabitMembers.userId, userId)
          )
        )

      // Check if others remain and cleanup if needed
      const remainingMembers = await db
        .select()
        .from(sharedHabitMembers)
        .where(eq(sharedHabitMembers.sharedHabitId, existingHabit.sharedHabitId))

      if (remainingMembers.length === 1) {
        const lastMember = remainingMembers[0]
        await db
          .update(habits)
          .set({
            isShared: false,
            sharedHabitId: null,
            updatedAt: new Date().toISOString(),
          })
          .where(
            and(
              eq(habits.userId, lastMember.userId),
              eq(habits.sharedHabitId, existingHabit.sharedHabitId)
            )
          )
        await db
          .delete(sharedHabitMembers)
          .where(eq(sharedHabitMembers.sharedHabitId, existingHabit.sharedHabitId))
        await db
          .delete(sharedHabits)
          .where(eq(sharedHabits.id, existingHabit.sharedHabitId))
      } else if (remainingMembers.length === 0) {
        await db
          .delete(sharedHabits)
          .where(eq(sharedHabits.id, existingHabit.sharedHabitId))
      }
    }

    // Soft delete by setting isArchived to true
    await db.update(habits).set({ isArchived: true }).where(eq(habits.id, data.id))

    return { success: true }
  })
