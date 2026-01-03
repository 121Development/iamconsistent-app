import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'

// Users table - synced with Clerk
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  subscriptionTier: text('subscription_tier', { enum: ['free', 'pro'] })
    .notNull()
    .default('free'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
})

// Habits table
export const habits = sqliteTable('habits', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  icon: text('icon').notNull().default('circle'),
  color: text('color').notNull().default('gray'),

  // Target tracking (optional)
  targetCount: integer('target_count'), // e.g., 3 times
  targetPeriod: text('target_period', { enum: ['week', 'month'] }), // per week/month

  // Soft delete
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),

  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
})

// Entries table - habit completion records
export const entries = sqliteTable('entries', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  habitId: text('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // Denormalized for faster queries

  // Date stored as ISO string (YYYY-MM-DD)
  date: text('date').notNull(),

  // Optional note
  note: text('note'),

  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
})

// Indexes for common queries
export const entriesDateIndex = sql`CREATE INDEX IF NOT EXISTS entries_date_idx ON entries(date)`
export const entriesHabitIdIndex = sql`CREATE INDEX IF NOT EXISTS entries_habit_id_idx ON entries(habit_id)`
export const entriesUserIdIndex = sql`CREATE INDEX IF NOT EXISTS entries_user_id_idx ON entries(user_id)`
export const habitsUserIdIndex = sql`CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id)`

// Types
export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export type Habit = typeof habits.$inferSelect
export type InsertHabit = typeof habits.$inferInsert

export type Entry = typeof entries.$inferSelect
export type InsertEntry = typeof entries.$inferInsert
