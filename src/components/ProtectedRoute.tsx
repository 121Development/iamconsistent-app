import { useAuth } from '@clerk/tanstack-react-start'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate({ to: '/sign-in' })
    }
  }, [isLoaded, userId, navigate])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    )
  }

  if (!userId) {
    return null
  }

  return <>{children}</>
}
