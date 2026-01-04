import { X, Share2 } from 'lucide-react'
import type { Habit } from '../lib/db'
import { getHabitColor } from '../lib/colors'

interface InviteFriendModalProps {
  isOpen: boolean
  onClose: () => void
  habits: Habit[]
  onSelectHabit: (habit: Habit) => void
}

export default function InviteFriendModal({ isOpen, onClose, habits, onSelectHabit }: InviteFriendModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-100">Track with a Friend</h2>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {habits.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-8">
                You don't have any habits yet. Create a habit first to share with friends.
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-neutral-400 mb-4">
                  Select a habit to share with friends:
                </p>
                <div className="space-y-2">
                  {habits.map((habit) => {
                    const colors = getHabitColor(habit.color)
                    return (
                      <button
                        key={habit.id}
                        onClick={() => onSelectHabit(habit)}
                        className="w-full flex items-center gap-3 p-4 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-600 rounded transition-colors text-left"
                      >
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center text-2xl border flex-shrink-0"
                          style={{
                            backgroundColor: colors.bg,
                            borderColor: colors.border,
                          }}
                        >
                          {habit.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-neutral-100 truncate">
                            {habit.name}
                          </div>
                          {habit.isShared && (
                            <div className="text-xs text-blue-400 mt-0.5">
                              Already shared
                            </div>
                          )}
                        </div>
                        <Share2 className="h-5 w-5 text-neutral-500 flex-shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
  )
}
