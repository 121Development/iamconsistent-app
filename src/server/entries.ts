import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { eq, and, gte, lte } from 'drizzle-orm'
import { getDb } from '../lib/db/client' 
import { entries, habits } from '../lib/db'
import {
  createEntrySchema,
  deleteEntrySchema,
  getEntriesSchema,
} from './schemas'

// Get all entries for a habit
export const getEntries = createServerFn({ method: 'GET' })
  .inputValidator(getEntriesSchema)
  .handler(async ({ data }) => {
    // Auth disabled - use demo user ID
    const userId = 'demo-user'

    const db = getDb()

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
    // Auth disabled - use demo user ID
    const userId = 'demo-user'

    const db = getDb()

    // Verify habit ownership
    const [habit] = await db
      .select()
      .from(habits)
      .where(and(eq(habits.id, data.habitId), eq(habits.userId, userId)))
      .limit(1)

    if (!habit) {
      throw new Error('Habit not found')
    }

    // Check if entry already exists for this date
    const [existingEntry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.habitId, data.habitId), eq(entries.date, data.date)))
      .limit(1)

    if (existingEntry) {
      throw new Error('Entry already exists for this date')
    }

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

// Delete an entry
export const deleteEntry = createServerFn({ method: 'POST' })
  .inputValidator(deleteEntrySchema)
  .handler(async ({ data }) => {
    // Auth disabled - use demo user ID
    const userId = 'demo-user'

    const db = getDb()

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
