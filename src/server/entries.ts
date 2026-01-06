import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { eq, and, gte, lte } from 'drizzle-orm'
import { createDb } from '../lib/db/client'
import { entries, habits } from '../lib/db'
import {
  createEntrySchema,
  updateEntrySchema,
  deleteEntrySchema,
  getEntriesSchema,
} from './schemas'
import { env } from 'cloudflare:workers'
import { requireAuth } from './auth'

// Get all entries for a habit
export const getEntries = createServerFn({ method: 'GET' })
  .inputValidator(getEntriesSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()

    const db = createDb(env.DB)

    // Verify habit ownership
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, data.habitId), eq(habits.userId, userId)))
      .limit(1)

    if (!habit) {
      throw new Error('Habit not found')
    }

    // Build query conditions
    const conditions = [eq(entries.habitId, data.habitId)]

    if (data.startDate) {
      conditions.push(gte(entries.date, data.startDate))
    }

    if (data.endDate) {
      conditions.push(lte(entries.date, data.endDate))
    }

    const habitEntries = await db
      .select()
      .from(entries)
      .where(and(...conditions))
      .orderBy(entries.date)

    return habitEntries
  })

// Create a new entry
export const createEntry = createServerFn({ method: 'POST' })
  .inputValidator(createEntrySchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()

    const db = createDb(env.DB)

    // Verify habit ownership
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, data.habitId), eq(habits.userId, userId)))
      .limit(1)

    if (!habit) {
      throw new Error('Habit not found')
    }

    // Allow multiple entries per day - no uniqueness check

    const [newEntry] = await db
      .insert(entries)
      .values({
        habitId: data.habitId,
        userId,
        date: data.date,
        note: data.note,
      })
      .returning()

    return newEntry
  })

// Update an entry
export const updateEntry = createServerFn({ method: 'POST' })
  .inputValidator(updateEntrySchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()

    const db = createDb(env.DB)

    // Verify entry ownership
    const [existingEntry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, data.id), eq(entries.userId, userId)))
      .limit(1)

    if (!existingEntry) {
      throw new Error('Entry not found')
    }

    const [updatedEntry] = await db
      .update(entries)
      .set({
        note: data.note,
      })
      .where(eq(entries.id, data.id))
      .returning()

    return updatedEntry
  })

// Delete an entry
export const deleteEntry = createServerFn({ method: 'POST' })
  .inputValidator(deleteEntrySchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()

    const db = createDb(env.DB)

    // Verify entry ownership
    const [existingEntry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, data.id), eq(entries.userId, userId)))
      .limit(1)

    if (!existingEntry) {
      throw new Error('Entry not found')
    }

    await db.delete(entries).where(eq(entries.id, data.id))

    return { success: true }
  })
