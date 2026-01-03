import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'
import { eq } from 'drizzle-orm'
import { createDb } from '../lib/db/client' 
import { users } from '../lib/db'
import { env } from 'cloudflare:workers'

/**
 * Sync Clerk user to our database
 * Called on first login or when user data changes
 */
export const syncUser = createServerFn({ method: 'POST' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

//  const clerkUser = await currentUser()
//  if (!clerkUser) {
//    throw new Error('User not found in Clerk')
//  }

  const db = createDb(env.DB)

  // Check if user exists
  const [existingUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

//  const email = clerkUser.emailAddresses[0]?.emailAddress
//  if (!email) {
//    throw new Error('User email not found')
//  }

  if (!existingUser) {
    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        email: '',
        subscriptionTier: 'free',
      })
      .returning()

    return newUser
  }

  // Update existing user
  const [updatedUser] = await db
    .update(users)
    .set({
      email: '',
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, userId))
    .returning()

  return updatedUser
})

/**
 * Get current user from database
 */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('Unauthorized')
  }

    const db = createDb(env.DB)

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

  if (!user) {
    throw new Error('User not found. Please sync your account.')
  }

  return user
})
