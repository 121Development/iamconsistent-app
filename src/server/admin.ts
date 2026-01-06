import { createServerFn } from '@tanstack/react-start'
import { eq, sql } from 'drizzle-orm'
import { createDb } from '../lib/db/client'
import { users, habits, entries } from '../lib/db'
import { env } from 'cloudflare:workers'
import { requireAuth } from './auth'

// Check if current user is admin
export const isAdmin = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    return { isAdmin: user?.isAdmin ?? false }
  } catch (error) {
    return { isAdmin: false }
  }
})

// Require admin access
async function requireAdmin() {
  const userId = await requireAuth()
  const db = createDb(env.DB)

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user || !user.isAdmin) {
    throw new Error('Admin access required')
  }

  return userId
}

// Get total stats
export const getAdminStats = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()

  const db = createDb(env.DB)

  // Get total users
  const [userCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)

  // Get total habits
  const [habitCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(habits)
    .where(eq(habits.isArchived, false))

  // Get total entries
  const [entryCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(entries)

  return {
    totalUsers: userCount.count,
    totalHabits: habitCount.count,
    totalEntries: entryCount.count,
  }
})

// Get all users list
export const getAdminUsers = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()

  const db = createDb(env.DB)

  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      subscriptionTier: users.subscriptionTier,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt)

  return allUsers
})

// Get all habits list
export const getAdminHabits = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()

  const db = createDb(env.DB)

  const allHabits = await db
    .select({
      id: habits.id,
      name: habits.name,
      icon: habits.icon,
      targetCount: habits.targetCount,
      targetPeriod: habits.targetPeriod,
      userId: habits.userId,
      createdAt: habits.createdAt,
    })
    .from(habits)
    .where(eq(habits.isArchived, false))
    .orderBy(habits.createdAt)

  return allHabits
})

// Get daily trend data for the last 30 days
export const getAdminTrends = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdmin()

  const db = createDb(env.DB)

  // Get daily user signups for last 30 days
  const userTrends = await db
    .select({
      date: sql<string>`DATE(created_at)`,
      count: sql<number>`count(*)`,
    })
    .from(users)
    .where(sql`DATE(created_at) >= DATE('now', '-30 days')`)
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`)

  // Get daily habit creation for last 30 days
  const habitTrends = await db
    .select({
      date: sql<string>`DATE(created_at)`,
      count: sql<number>`count(*)`,
    })
    .from(habits)
    .where(sql`DATE(created_at) >= DATE('now', '-30 days')`)
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`)

  // Get daily entry creation for last 30 days
  const entryTrends = await db
    .select({
      date: sql<string>`DATE(created_at)`,
      count: sql<number>`count(*)`,
    })
    .from(entries)
    .where(sql`DATE(created_at) >= DATE('now', '-30 days')`)
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`)

  // Fill in missing dates with 0 counts
  const fillDates = (data: Array<{ date: string; count: number }>) => {
    const result: Array<{ date: string; count: number }> = []
    const dataMap = new Map(data.map((d) => [d.date, d.count]))

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        count: dataMap.get(dateStr) || 0,
      })
    }

    return result
  }

  return {
    users: fillDates(userTrends),
    habits: fillDates(habitTrends),
    entries: fillDates(entryTrends),
  }
})
