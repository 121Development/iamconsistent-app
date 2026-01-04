import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { Habit, Entry } from '../lib/db'
import { format } from 'date-fns'
import { useCreateEntry, useDeleteEntry } from '../hooks/useEntries'
import { getHabitColor } from '../lib/colors'
import LogPastDateModal from './LogPastDateModal'
import RemoveEntryModal from './RemoveEntryModal'
import EditHabitModal from './EditHabitModal'

interface HabitCardProps {
  habit: Habit
  entries: Entry[]
}

export default function HabitCard({ habit, entries }: HabitCardProps) {
  const [isPastDateModalOpen, setIsPastDateModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const createEntryMutation = useCreateEntry()
  const deleteEntryMutation = useDeleteEntry()

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayEntries = entries.filter(e => e.date === today)
  const todayCount = todayEntries.length

  const handleIncrement = () => {
    createEntryMutation.mutate({
      habitId: habit.id,
      date: today,
    })
  }

  const handleDecrement = () => {
    if (todayCount === 0) return
    const lastEntry = todayEntries[todayEntries.length - 1]
    deleteEntryMutation.mutate(lastEntry.id)
  }

  const isLoading = createEntryMutation.isPending || deleteEntryMutation.isPending
  const colors = getHabitColor(habit.color)

  // Calculate simple streak (consecutive days)
  const calculateStreak = () => {
    if (entries.length === 0) return 0

    // Get unique dates only (handle multiple entries per day)
    const uniqueDates = Array.from(new Set(entries.map(e => e.date))).sort((a, b) => b.localeCompare(a))

    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0) // Normalize to start of day

    for (const dateStr of uniqueDates) {
      const entryDate = new Date(dateStr + 'T00:00:00')
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === streak) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const currentStreak = calculateStreak()

  return (
    <>
      <div className="border border-neutral-800 bg-neutral-900/50 p-5 rounded hover:border-neutral-700 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded flex items-center justify-center text-2xl border"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
              }}
            >
              {habit.icon}
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-100">{habit.name}</h3>
              <div className="text-xs text-neutral-500 mt-0.5">
                {currentStreak} day streak
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="w-12 text-center">
              <div className="text-2xl font-bold text-emerald-400">{todayCount}</div>
            </div>

            <button
              onClick={handleIncrement}
              disabled={isLoading}
              className="w-10 h-10 rounded bg-emerald-500 hover:bg-emerald-600 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-bold flex items-center justify-center transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            edit
          </button>
          |
          <button
            onClick={() => setIsRemoveModalOpen(true)}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            remove entry
          </button>
          |
          <button
            onClick={() => setIsPastDateModalOpen(true)}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            log earlier date
          </button>
          
        </div>
      </div>

      <EditHabitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        habit={habit}
      />

      <LogPastDateModal
        isOpen={isPastDateModalOpen}
        onClose={() => setIsPastDateModalOpen(false)}
        habitId={habit.id}
        habitName={habit.name}
      />

      <RemoveEntryModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        habitName={habit.name}
        entries={entries}
      />
    </>
  )
}
