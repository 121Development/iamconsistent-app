import { z } from 'zod'

// Habit schemas
export const createHabitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().min(1).default('circle'),
  color: z.string().min(1).default('gray'),
  targetCount: z.number().int().positive().optional(),
  targetPeriod: z.enum(['week', 'month']).optional(),
})

export const updateHabitSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  icon: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  targetCount: z.number().int().positive().optional().nullable(),
  targetPeriod: z.enum(['week', 'month']).optional().nullable(),
  isArchived: z.boolean().optional(),
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
