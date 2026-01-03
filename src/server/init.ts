import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { createDb } from '../lib/db/client'
import { users } from '../lib/db'
import { env } from 'cloudflare:workers'

// Initialize demo user in database
export const initDemoUser = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const db = createDb(env.DB)

    // Check if demo user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, 'demo-user'))
      .limit(1)

    if (!existingUser) {
      // Create demo user
      await db.insert(users).values({
        id: 'demo-user',
        email: 'demo@example.com',
        subscriptionTier: 'free',
      })
      console.log('Demo user created')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Failed to init demo user:', error)
    throw error
  }
})
