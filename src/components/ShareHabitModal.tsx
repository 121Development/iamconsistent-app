import { useState } from 'react'
import { X, Copy, Check, Users, RefreshCw, Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSharedHabit,
  getSharedHabitDetails,
  getSharedHabitMembers,
  regenerateInviteCode,
  removeMember,
} from '../server/shared-habits'
import { toast } from 'sonner'
import type { Habit } from '../lib/db'

interface ShareHabitModalProps {
  isOpen: boolean
  onClose: () => void
  habit: Habit
}

export default function ShareHabitModal({ isOpen, onClose, habit }: ShareHabitModalProps) {
  const [copied, setCopied] = useState(false)
  const queryClient = useQueryClient()

  // Create shared habit mutation
  const createSharedMutation = useMutation({
    mutationFn: () => createSharedHabit({ data: { habitId: habit.id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Habit is now shared! Send the code to friends')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to share habit')
    },
  })

  // Get shared habit details (invite code, etc.) if already shared
  const { data: sharedHabitDetails } = useQuery({
    queryKey: ['shared-habit-details', habit.sharedHabitId],
    queryFn: () =>
      habit.sharedHabitId
        ? getSharedHabitDetails({ data: { sharedHabitId: habit.sharedHabitId } })
        : Promise.resolve(null),
    enabled: isOpen && habit.isShared && !!habit.sharedHabitId,
  })

  // Get members if already shared
  const { data: members } = useQuery({
    queryKey: ['shared-habit-members', habit.sharedHabitId],
    queryFn: () =>
      habit.sharedHabitId
        ? getSharedHabitMembers({ data: { sharedHabitId: habit.sharedHabitId } })
        : Promise.resolve([]),
    enabled: isOpen && habit.isShared && !!habit.sharedHabitId,
  })

  // Regenerate code mutation
  const regenerateMutation = useMutation({
    mutationFn: () =>
      regenerateInviteCode({ data: { sharedHabitId: habit.sharedHabitId! } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['shared-habit-details', habit.sharedHabitId] })
      toast.success('New invite code generated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to regenerate code')
    },
  })

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (userId: string) =>
      removeMember({
        data: { sharedHabitId: habit.sharedHabitId!, userId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shared-habit-members', habit.sharedHabitId],
      })
      toast.success('Member removed')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove member')
    },
  })

  const handleShare = () => {
    createSharedMutation.mutate()
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard!')
  }

  const handleRegenerate = () => {
    if (confirm('Are you sure? The old code will no longer work.')) {
      regenerateMutation.mutate()
    }
  }

  const handleRemoveMember = (userId: string, email: string) => {
    if (confirm(`Remove ${email} from this habit?`)) {
      removeMemberMutation.mutate(userId)
    }
  }

  if (!isOpen) return null

  // Get invite code from mutation result (when first creating) or from query (when already shared)
  const inviteCode = createSharedMutation.data?.inviteCode || sharedHabitDetails?.inviteCode
  const shareUrl = createSharedMutation.data?.shareUrl || sharedHabitDetails?.shareUrl

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-neutral-900 border-2 border-emerald-500/30 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Share Habit</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!habit.isShared && !createSharedMutation.data ? (
          // Not shared yet - show share button
          <div className="space-y-4">
            <p className="text-sm text-neutral-400">
              Share "{habit.name}" with friends and track together. Each person maintains
              their own progress.
            </p>
            <button
              onClick={handleShare}
              disabled={createSharedMutation.isPending}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-700 disabled:text-neutral-500 text-neutral-950 font-medium py-3 rounded transition-colors"
            >
              {createSharedMutation.isPending ? 'Creating...' : 'Share This Habit'}
            </button>
          </div>
        ) : (
          // Already shared - show invite code and members
          <div className="space-y-6">
            {/* Invite Code */}
            {inviteCode && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Invite Code
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-3 font-mono text-xl text-center text-emerald-400">
                    {inviteCode}
                  </div>
                  <button
                    onClick={() => handleCopy(inviteCode)}
                    className="bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded p-3 transition-colors"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Share URL */}
            {shareUrl && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-neutral-800 border border-neutral-700 rounded p-3 text-sm text-neutral-400 truncate">
                    {shareUrl}
                  </div>
                  <button
                    onClick={() => handleCopy(shareUrl)}
                    className="bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded p-3 transition-colors"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Members List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Members ({members?.length || 0})
                </label>
                <button
                  onClick={handleRegenerate}
                  disabled={regenerateMutation.isPending}
                  className="text-xs text-neutral-500 hover:text-neutral-300 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  New Code
                </button>
              </div>
              <div className="space-y-2">
                {members?.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded p-3"
                  >
                    <div>
                      <div className="text-sm text-neutral-100">{member.name || member.email}</div>
                      <div className="text-xs text-neutral-500">
                        {member.role === 'owner' ? 'Owner' : 'Member'}
                      </div>
                    </div>
                    {member.role === 'member' && (
                      <button
                        onClick={() => handleRemoveMember(member.userId, member.name || member.email)}
                        disabled={removeMemberMutation.isPending}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              Each member tracks their own progress. You can view group stats on the habit
              card.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
