import { z } from 'zod'

// User schemas
export const updateEmailNotificationsSchema = z.object({
  enabled: z.boolean(),
})

export const updateUserNameSchema = z.object({
  name: z.string().max(100).optional(),
})

// Habit schemas
export const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(100).optional(),
  icon: z.string().min(1).default('circle'),
  color: z.string().min(1).default('gray'),
  targetCount: z.number().int().positive().optional(),
  targetPeriod: z.enum(['day', 'week', 'month']).optional(),
  notesEnabled: z.boolean().optional().default(false),
})

export const updateHabitSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(100).optional().nullable(),
  icon: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  targetCount: z.number().int().positive().optional().nullable(),
  targetPeriod: z.enum(['day', 'week', 'month']).optional().nullable(),
  isArchived: z.boolean().optional(),
  notesEnabled: z.boolean().optional(),
})

export const deleteHabitSchema = z.object({
  id: z.string(),
})

export const getHabitSchema = z.object({
  id: z.string(),
})

// Entry schemas
export const createEntrySchema = z.object({
  habitId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  note: z.string().max(500).optional(),
})

export const deleteEntrySchema = z.object({
  id: z.string(),
})

export const getEntriesSchema = z.object({
  habitId: z.string(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})
