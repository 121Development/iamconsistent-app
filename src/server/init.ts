import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { createDb } from '../lib/db/client'
import { users } from '../lib/db'
import { env } from 'cloudflare:workers'
import { requireAuth } from './auth'
import { clerkClient } from '@clerk/tanstack-react-start/server'

// Sync current Clerk user to database
export const syncUser = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const userId = await requireAuth()
    const db = createDb(env.DB)

    // Check if user exists in database
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!existingUser) {
      // Get full user details from Clerk
      const client = clerkClient()
      const clerkUser = await client.users.getUser(userId)

      if (!clerkUser) {
        throw new Error('Could not get user details from Clerk')
      }

      // Extract email from Clerk user - use primaryEmailAddress or fall back to first email
      const email = clerkUser.primaryEmailAddress?.emailAddress ||
                    clerkUser.emailAddresses[0]?.emailAddress ||
                    `${userId}@clerk.user`

      // Extract first and last name from Clerk user
      const firstName = clerkUser.firstName || ''
      const lastName = clerkUser.lastName || ''
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || null

      // Create user in database
      await db.insert(users).values({
        id: userId,
        email: email,
        name: fullName,
        subscriptionTier: 'free',
        emailNotifications: true,
      })
      console.log('User synced to database:', userId, email, fullName)
    }

    return { success: true, userId }
  } catch (error: any) {
    console.error('Failed to sync user:', error)
    throw error
  }
})
