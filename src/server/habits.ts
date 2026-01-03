import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { eq, and } from 'drizzle-orm'
import { getDbFromContext } from './db'
import { habits, users } from '../lib/db'
import {
  createHabitSchema,
  updateHabitSchema,
  deleteHabitSchema,
  getHabitSchema,
} from './schemas'
import { canCreateHabit } from '../lib/subscription'

// Get all habits for the current user
export const getHabits = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const db = getDbFromContext()

  const userHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.isArchived, false)))
    .orderBy(habits.createdAt)

  return userHabits
})

// Get a single habit by ID
export const getHabit = createServerFn({ method: 'GET' })
  .validator(getHabitSchema)
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const db = getDbFromContext()

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
  .validator(createHabitSchema)
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const db = getDbFromContext()

    // Get user and check subscription limits
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (!user) {
      throw new Error('User not found')
    }

    // Check habit count
    const userHabits = await db
      .select()
      .from(habits)
      .where(and(eq(habits.userId, userId), eq(habits.isArchived, false)))

    if (!canCreateHabit(user, userHabits.length)) {
      throw new Error('Habit limit reached. Upgrade to Pro for unlimited habits.')
    }

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
  .validator(updateHabitSchema)
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const db = getDbFromContext()

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
  .validator(deleteHabitSchema)
  .handler(async ({ data }) => {
    const { userId } = await auth()
    if (!userId) {
      throw new Error('Unauthorized')
    }

    const db = getDbFromContext()

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
