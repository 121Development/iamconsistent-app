import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { createDb } from '../lib/db/client'
import { users, habits, entries } from '../lib/db'
import { env } from 'cloudflare:workers'
import { requireAuth } from './auth'
import { clerkClient } from '@clerk/tanstack-react-start/server'
import { updateEmailNotificationsSchema, updateUserNameSchema } from './schemas'

// Get current user settings
export const getUserSettings = createServerFn({ method: 'GET' }).handler(async () => {
  const userId = await requireAuth()
  const db = createDb(env.DB)

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new Error('User not found')
  }

  return {
    name: user.name,
    emailNotifications: user.emailNotifications,
  }
})

// Update user name
export const updateUserName = createServerFn({ method: 'POST' })
  .inputValidator(updateUserNameSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    await db
      .update(users)
      .set({
        name: data.name || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))

    return { success: true, name: data.name }
  })

// Update email notification preference
export const updateEmailNotifications = createServerFn({ method: 'POST' })
  .inputValidator(updateEmailNotificationsSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    await db
      .update(users)
      .set({
        emailNotifications: data.enabled,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))

    return { success: true, emailNotifications: data.enabled }
  })

// Delete user account and all associated data
export const deleteUserAccount = createServerFn({ method: 'POST' }).handler(async () => {
  const userId = await requireAuth()
  const db = createDb(env.DB)

  // Delete all entries (will cascade due to foreign keys, but being explicit)
  await db.delete(entries).where(eq(entries.userId, userId))

  // Delete all habits (will cascade to entries)
  await db.delete(habits).where(eq(habits.userId, userId))

  // Delete user from our database
  await db.delete(users).where(eq(users.id, userId))

  // Delete user from Clerk
  try {
    const client = clerkClient()
    await client.users.deleteUser(userId)
  } catch (error) {
    console.error('Failed to delete user from Clerk:', error)
    // Continue anyway since we've deleted from our DB
  }

  return { success: true }
})
