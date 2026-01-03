import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { eq, and } from 'drizzle-orm'
import { createDb } from '../lib/db/client' 
import { habits, users } from '../lib/db'
import {
  createHabitSchema,
  updateHabitSchema,
  deleteHabitSchema,
  getHabitSchema,
} from './schemas'
import { canCreateHabit } from '../lib/subscription'
import { env } from 'cloudflare:workers'

// Get all habits for the current user
export const getHabits = createServerFn({ method: 'GET' }).handler(async () => {
  // Auth disabled - use demo user ID
  const userId = 'demo-user'

  const db = createDb(env.DB)

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
    // Auth disabled - use demo user ID
    const userId = 'demo-user'

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
    // Auth disabled - use demo user ID
    const userId = 'demo-user'

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
    // Auth disabled - use demo user ID
    const userId = 'demo-user'

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
    // Auth disabled - use demo user ID
    const userId = 'demo-user'

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

    // Soft delete by setting isArchived to true
    await db.update(habits).set({ isArchived: true }).where(eq(habits.id, data.id))

    return { success: true }
  })
