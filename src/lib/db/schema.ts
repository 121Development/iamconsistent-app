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
  emailNotifications: integer('email_notifications', { mode: 'boolean' })
    .notNull()
    .default(true),
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

  // Shared habit tracking
  isShared: integer('is_shared', { mode: 'boolean' }).notNull().default(false),
  sharedHabitId: text('shared_habit_id'), // References shared_habits.id (no FK to allow orphaned habits)

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

// Shared Habits table - for tracking shared habit groups
export const sharedHabits = sqliteTable('shared_habits', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  habitName: text('habit_name').notNull(), // Store original name
  habitIcon: text('habit_icon').notNull(),
  habitColor: text('habit_color').notNull(),
  targetCount: integer('target_count'),
  targetPeriod: text('target_period', { enum: ['week', 'month'] }),

  ownerUserId: text('owner_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  inviteCode: text('invite_code').notNull().unique(),

  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  expiresAt: text('expires_at'), // Optional expiration
})

// Shared Habit Members - join table for users in shared habits
export const sharedHabitMembers = sqliteTable('shared_habit_members', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  sharedHabitId: text('shared_habit_id')
    .notNull()
    .references(() => sharedHabits.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['owner', 'member'] }).notNull().default('member'),

  joinedAt: text('joined_at')
    .notNull()
    .default(sql`(datetime('now'))`),
})

// Indexes for common queries
export const entriesDateIndex = sql`CREATE INDEX IF NOT EXISTS entries_date_idx ON entries(date)`
export const entriesHabitIdIndex = sql`CREATE INDEX IF NOT EXISTS entries_habit_id_idx ON entries(habit_id)`
export const entriesUserIdIndex = sql`CREATE INDEX IF NOT EXISTS entries_user_id_idx ON entries(user_id)`
export const habitsUserIdIndex = sql`CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id)`
export const sharedHabitsInviteCodeIndex = sql`CREATE INDEX IF NOT EXISTS shared_habits_invite_code_idx ON shared_habits(invite_code)`
export const sharedHabitMembersIndex = sql`CREATE INDEX IF NOT EXISTS shared_habit_members_idx ON shared_habit_members(shared_habit_id, user_id)`

// Types
export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export type Habit = typeof habits.$inferSelect
export type InsertHabit = typeof habits.$inferInsert

export type Entry = typeof entries.$inferSelect
export type InsertEntry = typeof entries.$inferInsert

export type SharedHabit = typeof sharedHabits.$inferSelect
export type InsertSharedHabit = typeof sharedHabits.$inferInsert

export type SharedHabitMember = typeof sharedHabitMembers.$inferSelect
export type InsertSharedHabitMember = typeof sharedHabitMembers.$inferInsert
