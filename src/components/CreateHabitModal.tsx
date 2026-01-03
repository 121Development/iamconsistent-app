import { useState } from 'react'
import { X } from 'lucide-react'
import { createHabit } from '../server/habits'
import { toast } from 'sonner'

interface CreateHabitModalProps {
  isOpen: boolean
  onClose: () => void
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

export default function CreateHabitModal({ isOpen, onClose, onSuccess }: CreateHabitModalProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('💪')
  const [color, setColor] = useState('emerald')
  const [useTarget, setUseTarget] = useState(false)
  const [targetCount, setTargetCount] = useState(3)
  const [targetPeriod, setTargetPeriod] = useState<'week' | 'month'>('week')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      await createHabit({
        data: {
          name: name.trim(),
          icon,
          color,
          ...(useTarget && { targetCount, targetPeriod }),
        }
      })

      toast.success('Habit created!')

      // Reset form
      setName('')
      setIcon('💪')
      setColor('emerald')
      setUseTarget(false)
      setTargetCount(3)
      setTargetPeriod('week')
      onClose()
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create habit')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-neutral-100">Create New Habit</h2>
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

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useTarget}
                onChange={(e) => setUseTarget(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-950 border-neutral-800 text-emerald-500 focus:ring-emerald-500"
              />
              Set target goal
            </label>
          </div>

          {useTarget && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2.5 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Period
                </label>
                <select
                  value={targetPeriod}
                  onChange={(e) => setTargetPeriod(e.target.value as 'week' | 'month')}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2.5 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>
          )}

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
              {isLoading ? 'Creating...' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
