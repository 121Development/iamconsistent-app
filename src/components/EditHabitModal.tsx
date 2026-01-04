import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Habit } from '../lib/db'
import { updateHabit, deleteHabit } from '../server/habits'
import { toast } from 'sonner'

interface EditHabitModalProps {
  isOpen: boolean
  onClose: () => void
  habit: Habit
  onSuccess: () => void
}

const ICON_OPTIONS = ['💪', '📚', '🏃', '🧘', '💻', '🎨', '🎵', '✍️', '🌱', '☕']
const COLOR_OPTIONS = [
  { name: 'emerald', class: 'bg-emerald-500' },
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'purple', class: 'bg-purple-500' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'pink', class: 'bg-pink-500' },
  { name: 'cyan', class: 'bg-cyan-500' },
]

export default function EditHabitModal({ isOpen, onClose, habit, onSuccess }: EditHabitModalProps) {
  const [name, setName] = useState(habit.name)
  const [icon, setIcon] = useState(habit.icon)
  const [color, setColor] = useState(habit.color)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update form when habit changes
  useEffect(() => {
    setName(habit.name)
    setIcon(habit.icon)
    setColor(habit.color)
  }, [habit])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      await updateHabit({
        data: {
          id: habit.id,
          name: name.trim(),
          icon,
          color,
        }
      })

      toast.success('Habit updated!')
      onClose()
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update habit')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteHabit({ data: { id: habit.id } })
      toast.success('Habit deleted!')
      setShowDeleteConfirm(false)
      onClose()
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete habit')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Edit Habit</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Exercise"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2.5 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`h-12 rounded border-2 text-2xl transition-colors ${
                    icon === emoji
                      ? 'border-emerald-500 bg-emerald-950'
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  className={`w-10 h-10 rounded border-2 transition-all ${c.class} ${
                    color === c.name ? 'border-neutral-100 scale-110' : 'border-neutral-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium py-2.5 px-4 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-medium py-2.5 px-4 rounded transition-colors"
            >
              {isLoading ? 'Updating...' : 'Update Habit'}
            </button>
          </div>
        </form>

        {/* Delete Section */}
        <div className="mt-6 pt-6 border-t border-neutral-800">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-950/50 hover:bg-red-950 border border-red-900/50 hover:border-red-800 text-red-400 hover:text-red-300 font-medium py-2.5 px-4 rounded transition-colors"
            >
              Delete Habit
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-neutral-400 text-center">
                Are you sure? This will delete the habit and all its entries.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium py-2.5 px-4 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-medium py-2.5 px-4 rounded transition-colors"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
