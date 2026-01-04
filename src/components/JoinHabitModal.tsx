import { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { joinSharedHabit } from '../server/shared-habits'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

interface JoinHabitModalProps {
  isOpen: boolean
  onClose: () => void
  initialCode?: string
}

export default function JoinHabitModal({
  isOpen,
  onClose,
  initialCode = '',
}: JoinHabitModalProps) {
  const [code, setCode] = useState(initialCode)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const joinMutation = useMutation({
    mutationFn: (inviteCode: string) =>
      joinSharedHabit({ data: { inviteCode: inviteCode.toUpperCase() } }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success(`✅ Joined ${data.habitName}! Start tracking together`)
      onClose()
      navigate({ to: '/myhabits' })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to join habit')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedCode = code.trim().toUpperCase()
    if (trimmedCode.length !== 8) {
      toast.error('Invite code must be 8 characters')
      return
    }
    joinMutation.mutate(trimmedCode)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric, max 8 chars
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
    setCode(value)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Join Shared Habit</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Enter Invite Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="ABC12XYZ"
              className="w-full bg-neutral-800 border border-neutral-700 rounded p-3 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono text-center text-xl tracking-wider"
              autoFocus
              maxLength={8}
            />
            <p className="text-xs text-neutral-500 mt-2">
              8-character code shared by a friend
            </p>
          </div>

          {joinMutation.isError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
              <p className="text-sm text-red-400">
                {(joinMutation.error as any)?.message || 'Failed to join habit'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={code.length !== 8 || joinMutation.isPending}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-950 font-medium py-3 rounded transition-colors flex items-center justify-center gap-2"
          >
            {joinMutation.isPending ? (
              'Joining...'
            ) : (
              <>
                Join Habit
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-800">
          <p className="text-xs text-neutral-500">
            By joining, you'll get a copy of the habit to track your own progress. You can
            see group stats and compete with other members!
          </p>
        </div>
      </div>
    </div>
  )
}
