import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/tanstack-react-start'
import { useMutation } from '@tanstack/react-query'
import { joinSharedHabit } from '../server/shared-habits'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export const Route = createFileRoute('/join/$code')({
  component: JoinPage,
})

function JoinPage() {
  const { code } = Route.useParams()
  const { isLoaded, userId } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [habitName, setHabitName] = useState('')

  const joinMutation = useMutation({
    mutationFn: () => joinSharedHabit({ data: { inviteCode: code.toUpperCase() } }),
    onSuccess: (data) => {
      setStatus('success')
      setHabitName(data.habitName)
      // Redirect to myhabits after 2 seconds
      setTimeout(() => {
        navigate({ to: '/myhabits' })
      }, 2000)
    },
    onError: (error: any) => {
      setStatus('error')
      setErrorMessage(error.message || 'Failed to join habit')
    },
  })

  useEffect(() => {
    if (!isLoaded) return

    if (!userId) {
      // Redirect to sign in with return URL
      navigate({ to: '/sign-in' })
      return
    }

    // User is authenticated, attempt to join
    if (code && code.length === 8) {
      joinMutation.mutate()
    } else {
      setStatus('error')
      setErrorMessage('Invalid invite code')
    }
  }, [isLoaded, userId, code])

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <Loader2 className="h-16 w-16 text-emerald-400 mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">
              Joining shared habit...
            </h1>
            <p className="text-neutral-400">
              Please wait while we add you to the group
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">
              Success! You've joined "{habitName}"
            </h1>
            <p className="text-neutral-400 mb-6">
              You can now track together with other members
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to your habits...
            </div>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">
              Couldn't join habit
            </h1>
            <p className="text-neutral-400 mb-6">{errorMessage}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate({ to: '/myhabits' })}
                className="bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-medium py-3 px-6 rounded transition-colors"
              >
                Go to My Habits
              </button>
              <button
                onClick={() => navigate({ to: '/' })}
                className="bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-medium py-3 px-6 rounded transition-colors border border-neutral-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
