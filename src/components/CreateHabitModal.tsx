import { useState } from 'react'
import { X } from 'lucide-react'
import { useCreateHabit } from '../hooks/useHabits'
import { toast } from 'sonner'

interface CreateHabitModalProps {
  isOpen: boolean
  onClose: () => void
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

export default function CreateHabitModal({ isOpen, onClose }: CreateHabitModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('💪')
  const [color, setColor] = useState('emerald')
  const [useTarget, setUseTarget] = useState(false)
  const [targetCount, setTargetCount] = useState<number | ''>(3)
  const [targetPeriod, setTargetPeriod] = useState<'day' | 'week' | 'month'>('week')
  const [notesEnabled, setNotesEnabled] = useState(false)

  const createHabitMutation = useCreateHabit()

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    // Validate target count if target is enabled
    if (useTarget && (targetCount === '' || targetCount < 1)) {
      toast.error('Please enter a valid target count (must be at least 1)')
      return
    }

    createHabitMutation.mutate(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        icon,
        color,
        notesEnabled,
        ...(useTarget && { targetCount: targetCount as number, targetPeriod }),
      },
      {
        onSuccess: () => {
          // Reset form
          setName('')
          setDescription('')
          setIcon('💪')
          setColor('emerald')
          setUseTarget(false)
          setTargetCount(3)
          setTargetPeriod('week')
          setNotesEnabled(false)
          onClose()
        },
      }
    )
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
              Short Description <span className="text-neutral-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 30 minutes of cardio"
              maxLength={100}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2.5 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-neutral-300">
                Add notes to logged habit. <br />
                Can be adjusted later also
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={notesEnabled}
                onClick={() => setNotesEnabled(!notesEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                  notesEnabled ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notesEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>

          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-neutral-300">
                Set target goal <br />
                (X times per day/week/month)
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={useTarget}
                onClick={() => setUseTarget(!useTarget)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
                  useTarget ? 'bg-emerald-500' : 'bg-neutral-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useTarget ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
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
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === '') {
                      setTargetCount('')
                    } else {
                      const num = parseInt(val)
                      if (!isNaN(num) && num > 0) {
                        setTargetCount(num)
                      }
                    }
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2.5 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Period
                </label>
                <select
                  value={targetPeriod}
                  onChange={(e) => setTargetPeriod(e.target.value as 'day' | 'week' | 'month')}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-4 py-2.5 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>
          )}

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
              disabled={!name.trim() || createHabitMutation.isPending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-medium py-2.5 px-4 rounded transition-colors"
            >
              {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
