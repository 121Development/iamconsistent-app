import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { Habit, Entry } from '../lib/db'
import { format } from 'date-fns'
import { createEntry, deleteEntry } from '../server/entries'
import { toast } from 'sonner'
import LogPastDateModal from './LogPastDateModal'

interface HabitCardProps {
  habit: Habit
  entries: Entry[]
  onUpdate: () => void
}

export default function HabitCard({ habit, entries, onUpdate }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPastDateModalOpen, setIsPastDateModalOpen] = useState(false)
  const today = format(new Date(), 'yyyy-MM-dd')
  const todayEntries = entries.filter(e => e.date === today)
  const todayCount = todayEntries.length

  const handleIncrement = async () => {
    setIsLoading(true)
    try {
      await createEntry({ data: { habitId: habit.id, date: today } })
      onUpdate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to log entry')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecrement = async () => {
    if (todayCount === 0) return

    // Delete the most recent entry for today
    const lastEntry = todayEntries[todayEntries.length - 1]

    setIsLoading(true)
    try {
      await deleteEntry({ data: { id: lastEntry.id } })
      onUpdate()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete entry')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate simple streak (consecutive days)
  const calculateStreak = () => {
    if (entries.length === 0) return 0

    const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date))
    let streak = 0
    let currentDate = new Date()

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
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
              className={`w-10 h-10 rounded flex items-center justify-center text-2xl bg-${habit.color}-950 border border-${habit.color}-800`}
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
            <button
              onClick={handleDecrement}
              disabled={isLoading || todayCount === 0}
              className="w-10 h-10 rounded bg-transparent hover:bg-neutral-800/50 disabled:bg-transparent disabled:text-neutral-800 text-neutral-500 hover:text-neutral-300 font-bold flex items-center justify-center transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>

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

        <button
          onClick={() => setIsPastDateModalOpen(true)}
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          log earlier date
        </button>
      </div>

      <LogPastDateModal
        isOpen={isPastDateModalOpen}
        onClose={() => setIsPastDateModalOpen(false)}
        habitId={habit.id}
        habitName={habit.name}
        onSuccess={onUpdate}
      />
    </>
  )
}
