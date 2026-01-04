import { createServerFn } from '@tanstack/react-start'
import { auth } from '@clerk/tanstack-react-start/server'

// Get current authenticated user ID
export const getCurrentUserId = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not authenticated')
  }

  return userId
})

// Helper to get userId in server functions
export async function requireAuth() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not authenticated')
  }

  return userId
}
